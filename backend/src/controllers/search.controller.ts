import { Request, Response } from "express";
import pool from "../config/db";

// Which roles may search which entity — mirrors the module permissions
const ROLE_SCOPE: Record<string, string[]> = {
  ADMIN: ["customers", "products", "challans"],
  SALES: ["customers", "challans"],
  WAREHOUSE: ["products"],
  ACCOUNTS: ["challans"],
};

export const search = async (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();

  if (q.length < 2) {
    return res.json({
      success: true,
      data: { customers: [], products: [], challans: [] },
    });
  }

  const role = (req as any).user?.role;
  const scope = ROLE_SCOPE[role] || [];
  const term = `%${q}%`;

  try {
    const results: Record<string, any[]> = {
      customers: [],
      products: [],
      challans: [],
    };

    const tasks: Promise<void>[] = [];

    if (scope.includes("customers")) {
      tasks.push(
        pool
          .query(
            `SELECT id, customer_name, mobile, email, business_name
             FROM customers
             WHERE customer_name ILIKE $1
                OR mobile ILIKE $1
                OR email ILIKE $1
                OR business_name ILIKE $1
                OR gst_number ILIKE $1
             ORDER BY customer_name
             LIMIT 8`,
            [term]
          )
          .then((r) => {
            results.customers = r.rows;
          })
      );
    }

    if (scope.includes("products")) {
      tasks.push(
        pool
          .query(
            `SELECT id, product_name, sku, category, unit_price, current_stock
             FROM products
             WHERE product_name ILIKE $1
                OR sku ILIKE $1
                OR category ILIKE $1
                OR warehouse_location ILIKE $1
             ORDER BY product_name
             LIMIT 8`,
            [term]
          )
          .then((r) => {
            results.products = r.rows;
          })
      );
    }

    if (scope.includes("challans")) {
      tasks.push(
        pool
          .query(
            `SELECT sc.id, sc.challan_number, sc.total_amount, sc.status,
                    c.customer_name
             FROM sales_challans sc
             JOIN customers c ON c.id = sc.customer_id
             WHERE sc.challan_number ILIKE $1
                OR c.customer_name ILIKE $1
                OR sc.status ILIKE $1
             ORDER BY sc.created_at DESC
             LIMIT 8`,
            [term]
          )
          .then((r) => {
            results.challans = r.rows;
          })
      );
    }

    await Promise.all(tasks);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};
