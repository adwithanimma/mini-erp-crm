import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import api from "../api/axios";
import Layout from "../components/Layout";
import { money, getAppSettings } from "../utils/appSettings";

const REPORTS = [
  {
    key: "customers",
    label: "Customer Report",
    columns: [
      { key: "id", label: "ID" },
      { key: "customer_name", label: "Name" },
      { key: "mobile", label: "Mobile" },
      { key: "email", label: "Email" },
      { key: "business_name", label: "Company" },
      { key: "gst_number", label: "GST" },
      { key: "customer_type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "created_on", label: "Created" },
    ],
  },
  {
    key: "sales",
    label: "Sales Report",
    columns: [
      { key: "challan_number", label: "Challan #" },
      { key: "customer_name", label: "Customer" },
      { key: "total_amount", label: "Amount", fmt: "money" },
      { key: "status", label: "Status" },
      { key: "date", label: "Date" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory Report",
    columns: [
      { key: "product_name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "warehouse_location", label: "Location" },
      { key: "current_stock", label: "Stock" },
      { key: "minimum_stock", label: "Min Stock" },
      { key: "unit_price", label: "Unit Price", fmt: "money" },
      { key: "stock_value", label: "Stock Value", fmt: "money" },
      { key: "stock_status", label: "Status" },
    ],
  },
  {
    key: "products",
    label: "Product Report",
    columns: [
      { key: "id", label: "ID" },
      { key: "product_name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "unit_price", label: "Unit Price", fmt: "money" },
      { key: "current_stock", label: "Stock" },
      { key: "minimum_stock", label: "Min Stock" },
      { key: "warehouse_location", label: "Location" },
      { key: "created_on", label: "Created" },
    ],
  },
  {
    key: "monthly-revenue",
    label: "Monthly Revenue Report",
    columns: [
      { key: "month", label: "Month" },
      { key: "orders", label: "Orders" },
      { key: "revenue", label: "Revenue", fmt: "money" },
    ],
  },
  {
    key: "low-stock",
    label: "Low Stock Report",
    columns: [
      { key: "product_name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "warehouse_location", label: "Location" },
      { key: "current_stock", label: "Stock" },
      { key: "minimum_stock", label: "Min Stock" },
      { key: "shortfall", label: "Shortfall" },
      { key: "stock_status", label: "Status" },
    ],
  },
];

const formatCell = (value, fmt) => {
  if (value == null || value === "") return "-";
  if (fmt === "money") return money(value);
  return String(value);
};

function Reports() {
  const [active, setActive] = useState(REPORTS[0]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.key]);

  const loadReport = async (report) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/reports/${report.key}`);
      setRows(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load report");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const exportExcel = () => {
    const sheetRows = rows.map((row) => {
      const out = {};
      active.columns.forEach((col) => {
        // keep numbers numeric in Excel; label as header
        const value = row[col.key];
        out[col.label] =
          col.fmt === "money" || typeof value === "number"
            ? Number(value ?? 0)
            : value ?? "";
      });
      return out;
    });

    const ws = XLSX.utils.json_to_sheet(sheetRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, active.label.slice(0, 31));
    XLSX.writeFile(wb, `${active.label} ${fileStamp()}.xlsx`);
  };

  const exportPDF = () => {
    const settings = getAppSettings();
    const doc = new jsPDF({
      orientation: active.columns.length > 6 ? "landscape" : "portrait",
    });

    doc.setFontSize(15);
    doc.text(settings.company_name || "Mini ERP", 14, 16);

    doc.setFontSize(10);
    doc.setTextColor(100);
    let y = 22;
    if (settings.gst_number) {
      doc.text(`GST: ${settings.gst_number}`, 14, y);
      y += 5;
    }
    doc.text(
      `${active.label} — generated ${new Date().toLocaleDateString("en-IN")}`,
      14,
      y
    );

    autoTable(doc, {
      startY: y + 5,
      head: [active.columns.map((col) => col.label)],
      body: rows.map((row) =>
        active.columns.map((col) =>
          // jsPDF's default font can't render ₹ — use plain numbers in PDF
          col.fmt === "money"
            ? Number(row[col.key] ?? 0).toLocaleString("en-IN")
            : row[col.key] ?? "-"
        )
      ),
      styles: { fontSize: 8.5 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`${active.label} ${fileStamp()}.pdf`);
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Generate and export business reports</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={exportPDF}
            disabled={loading || rows.length === 0}
          >
            Export PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={exportExcel}
            disabled={loading || rows.length === 0}
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="report-tabs">
        {REPORTS.map((report) => (
          <button
            key={report.key}
            className={
              report.key === active.key ? "report-tab active" : "report-tab"
            }
            onClick={() => setActive(report)}
          >
            {report.label.replace(" Report", "")}
          </button>
        ))}
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="panel">
        <div className="panel-title">
          {active.label}
          <span className="text-muted" style={{ fontWeight: 400 }}>
            {" "}
            — {rows.length} rows
          </span>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading report...</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">No data for this report.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {active.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {active.columns.map((col) => (
                      <td key={col.key}>{formatCell(row[col.key], col.fmt)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Reports;
