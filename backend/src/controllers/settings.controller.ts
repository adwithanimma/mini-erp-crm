import { Request, Response } from "express";
import pool from "../config/db";

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM settings WHERE id = 1");

    res.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to load settings",
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { company_name, gst_number, logo, currency, tax_percentage } =
      req.body;

    const tax = Number(tax_percentage);

    if (isNaN(tax) || tax < 0 || tax > 100) {
      return res.status(400).json({
        success: false,
        message: "Tax percentage must be between 0 and 100",
      });
    }

    if (!company_name || !company_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // logo is a data URI; keep it under ~500KB
    if (logo && logo.length > 700000) {
      return res.status(400).json({
        success: false,
        message: "Logo image is too large (max ~500KB)",
      });
    }

    const result = await pool.query(
      `UPDATE settings SET
        company_name=$1, gst_number=$2, logo=$3,
        currency=$4, tax_percentage=$5, updated_at=NOW()
       WHERE id=1
       RETURNING *`,
      [company_name.trim(), gst_number || "", logo || "", currency || "INR", tax]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to update settings",
    });
  }
};
