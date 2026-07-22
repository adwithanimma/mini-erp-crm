import { Request, Response } from "express";
import pool from "../config/db";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [
      counts,
      today,
      salesByMonth,
      stockMovement,
      topProducts,
      recentActivities,
      recentCustomers,
      recentMovements,
    ] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM customers) AS total_customers,
          (SELECT COUNT(*) FROM products) AS total_products,
          (SELECT COUNT(*) FROM sales_challans) AS total_challans,
          (SELECT COALESCE(SUM(current_stock * unit_price), 0) FROM products) AS inventory_value,
          (SELECT COUNT(*) FROM products
            WHERE current_stock > 0 AND current_stock <= minimum_stock) AS low_stock,
          (SELECT COUNT(*) FROM products WHERE current_stock <= 0) AS out_of_stock
      `),

      pool.query(`
        SELECT
          COALESCE(SUM(total_amount) FILTER
            (WHERE created_at::date = CURRENT_DATE AND status <> 'CANCELLED'), 0) AS today_sales,
          COUNT(*) FILTER
            (WHERE created_at::date = CURRENT_DATE AND status <> 'CANCELLED') AS today_orders,
          COALESCE(SUM(total_amount) FILTER
            (WHERE status <> 'CANCELLED'), 0) AS total_revenue
        FROM sales_challans
      `),

      pool.query(`
        SELECT
          to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
          date_trunc('month', created_at) AS month_start,
          SUM(total_amount) AS total
        FROM sales_challans
        WHERE status <> 'CANCELLED'
        GROUP BY 1, 2
        ORDER BY 2
      `),

      pool.query(`
        SELECT
          to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
          date_trunc('month', created_at) AS month_start,
          SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE 0 END) AS stock_in,
          SUM(CASE WHEN movement_type = 'OUT' THEN quantity ELSE 0 END) AS stock_out
        FROM stock_movements
        GROUP BY 1, 2
        ORDER BY 2
      `),

      pool.query(`
        SELECT
          p.product_name,
          SUM(ci.quantity) AS units_sold,
          SUM(ci.subtotal) AS revenue
        FROM challan_items ci
        JOIN products p ON p.id = ci.product_id
        GROUP BY p.product_name
        ORDER BY units_sold DESC
        LIMIT 5
      `),

      pool.query(`
        SELECT * FROM (
          SELECT
            'CHALLAN' AS type,
            sc.challan_number || ' for ' || c.customer_name ||
              ' (₹' || sc.total_amount || ')' AS description,
            sc.created_at
          FROM sales_challans sc
          JOIN customers c ON c.id = sc.customer_id

          UNION ALL

          SELECT
            'STOCK_' || sm.movement_type AS type,
            p.product_name || ': ' || sm.quantity || ' units — ' ||
              COALESCE(sm.reason, 'no reason') AS description,
            sm.created_at
          FROM stock_movements sm
          JOIN products p ON p.id = sm.product_id
        ) activity
        ORDER BY created_at DESC
        LIMIT 10
      `),

      pool.query(`
        SELECT id, customer_name, business_name, customer_type, created_at
        FROM customers
        ORDER BY created_at DESC
        LIMIT 5
      `),

      pool.query(`
        SELECT
          sm.id,
          p.product_name,
          sm.movement_type,
          sm.quantity,
          sm.reason,
          sm.created_at
        FROM stock_movements sm
        JOIN products p ON p.id = sm.product_id
        ORDER BY sm.created_at DESC
        LIMIT 5
      `),
    ]);

    res.json({
      success: true,
      data: {
        kpis: counts.rows[0],
        today: today.rows[0],
        sales_by_month: salesByMonth.rows,
        stock_movement: stockMovement.rows,
        top_products: topProducts.rows,
        recent_activities: recentActivities.rows,
        recent_customers: recentCustomers.rows,
        recent_stock_movements: recentMovements.rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to load dashboard stats",
    });
  }
};
