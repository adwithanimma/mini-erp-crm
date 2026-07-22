import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { money, currencySymbol } from "../utils/appSettings";

const emptyForm = {
  product_name: "",
  sku: "",
  category: "",
  unit_price: "",
  current_stock: "",
  minimum_stock: "",
  warehouse_location: "",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      product_name: product.product_name || "",
      sku: product.sku || "",
      category: product.category || "",
      unit_price: product.unit_price ?? "",
      current_stock: product.current_stock ?? "",
      minimum_stock: product.minimum_stock ?? "",
      warehouse_location: product.warehouse_location || "",
    });
    setError("");
    setShowModal(true);
  };

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      unit_price: Number(form.unit_price),
      current_stock: Number(form.current_stock || 0),
      minimum_stock: Number(form.minimum_stock || 0),
    };

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    if (
      !window.confirm(
        `Delete product "${product.product_name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setPageError("");

    try {
      await api.delete(`/products/${product.id}`);
      loadProducts();
    } catch (err) {
      setPageError(err.response?.data?.message || "Unable to delete product");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {pageError && <div className="page-error">{pageError}</div>}

      <div className="panel">
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              No products yet. Click "Add Product" to create one.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Stock</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const low =
                    Number(product.current_stock) <=
                    Number(product.minimum_stock);

                  return (
                    <tr key={product.id}>
                      <td className="text-muted">#{product.id}</td>
                      <td>
                        <strong>{product.product_name}</strong>
                      </td>
                      <td className="text-muted">{product.sku}</td>
                      <td>{product.category || "-"}</td>
                      <td className="text-right">
                        {money(product.unit_price)}
                      </td>
                      <td className="text-right">{product.current_stock}</td>
                      <td>{product.warehouse_location || "-"}</td>
                      <td>
                        <span
                          className={
                            low ? "badge badge-red" : "badge badge-green"
                          }
                        >
                          {low ? "LOW STOCK" : "IN STOCK"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => openEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-link-danger"
                          onClick={() => remove(product)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editing ? "Edit Product" : "Add Product"}
          onClose={() => setShowModal(false)}
        >
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={save}>
            <div className="form-grid">
              <div className="field full">
                <label>Product Name *</label>
                <input
                  value={form.product_name}
                  onChange={(e) => setField("product_name", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>SKU *</label>
                <input
                  value={form.sku}
                  onChange={(e) => setField("sku", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Unit Price ({currencySymbol()}) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unit_price}
                  onChange={(e) => setField("unit_price", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Current Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.current_stock}
                  onChange={(e) => setField("current_stock", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Minimum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.minimum_stock}
                  onChange={(e) => setField("minimum_stock", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Warehouse Location</label>
                <input
                  value={form.warehouse_location}
                  onChange={(e) =>
                    setField("warehouse_location", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editing
                  ? "Save Changes"
                  : "Add Product"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}

export default Products;
