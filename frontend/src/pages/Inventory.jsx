import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const lowStock = products.filter(
    (p) => Number(p.current_stock) <= Number(p.minimum_stock)
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Stock levels across the warehouse</p>
        </div>
      </div>

      <div className="cards">
        <div className="stat-card">
          <div className="stat-label">Total SKUs</div>
          <div className="stat-value">{loading ? "…" : products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Units</div>
          <div className="stat-value">
            {loading
              ? "…"
              : products.reduce(
                  (sum, p) => sum + Number(p.current_stock || 0),
                  0
                )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div
            className="stat-value"
            style={lowStock.length > 0 ? { color: "var(--danger)" } : {}}
          >
            {loading ? "…" : lowStock.length}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Stock Levels</div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading inventory...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products in inventory.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th className="text-right">Current Stock</th>
                  <th className="text-right">Minimum Stock</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const low =
                    Number(product.current_stock) <=
                    Number(product.minimum_stock);

                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.product_name}</strong>
                      </td>
                      <td className="text-muted">{product.sku}</td>
                      <td className="text-right">{product.current_stock}</td>
                      <td className="text-right text-muted">
                        {product.minimum_stock}
                      </td>
                      <td>{product.warehouse_location || "-"}</td>
                      <td>
                        <span
                          className={
                            low ? "badge badge-red" : "badge badge-green"
                          }
                        >
                          {low ? "REORDER" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Inventory;
