import { Request, Response } from "express";
import pool from "../config/db";

const REPORT_QUERIES: Record<string, string> = {
  customers: `
    SELECT
      id, customer_name, mobile, email, business_name,
      gst_number, customer_type, status,
      to_char(created_at, 'DD Mon YYYY') AS created_on
    FROM customers
    ORDER BY id
  `,

  sales: `
    SELECT
      sc.challan_number,
      c.customer_name,
      sc.total_amount,
      sc.status,
      to_char(sc.created_at, 'DD Mon YYYY') AS date
    FROM sales_challans sc
    JOIN customers c ON c.id = sc.customer_id
    ORDER BY sc.created_at DESC
  `,

  inventory: `
    SELECT
      product_name, sku, warehouse_location,
      current_stock, minimum_stock,
      unit_price,
      (current_stock * unit_price) AS stock_value,
      CASE
        WHEN current_stock <= 0 THEN 'OUT OF STOCK'
        WHEN current_stock <= minimum_stock THEN 'LOW STOCK'
        ELSE 'IN STOCK'
      END AS stock_status
    FROM products
    ORDER BY product_name
  `,

  products: `
    SELECT
      id, product_name, sku, category,
      unit_price, current_stock, minimum_stock, warehouse_location,
      to_char(created_at, 'DD Mon YYYY') AS created_on
    FROM products
    ORDER BY id
  `,

  "monthly-revenue": `
    SELECT
      to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
      COUNT(*) AS orders,
      SUM(total_amount) AS revenue
    FROM sales_challans
    WHERE status <> 'CANCELLED'
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `,

  "low-stock": `
    SELECT
      product_name, sku, warehouse_location,
      current_stock, minimum_stock,
      (minimum_stock - current_stock) AS shortfall,
      CASE
        WHEN current_stock <= 0 THEN 'OUT OF STOCK'
        ELSE 'LOW STOCK'
      END AS stock_status
    FROM products
    WHERE current_stock <= minimum_stock
    ORDER BY (minimum_stock - current_stock) DESC
  `,
};

export const getReport = async (req: Request, res: Response) => {
  const type = String(req.params.type);
  const sql = REPORT_QUERIES[type];

  if (!sql) {
    return res.status(404).json({
      success: false,
      message:
        "Unknown report. Available: " + Object.keys(REPORT_QUERIES).join(", "),
    });
  }

  try {
    const result = await pool.query(sql);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to generate report",
    });
  }
};
