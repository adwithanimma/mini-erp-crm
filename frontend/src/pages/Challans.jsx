import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { getUser, canEditChallans } from "../utils/permissions";
import { money, getAppSettings } from "../utils/appSettings";

function Challans() {
  const [challans, setChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit = canEditChallans(getUser()?.role);

  const STATUSES = ["CREATED", "DISPATCHED", "DELIVERED", "CANCELLED"];

  const statusBadge = {
    CREATED: "badge badge-blue",
    DISPATCHED: "badge badge-amber",
    DELIVERED: "badge badge-green",
    CANCELLED: "badge badge-red",
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const requests = [api.get("/challans")];

      // customers + products are only needed for the create form,
      // and read-only roles (ACCOUNTS) aren't allowed to fetch them
      if (canEditChallans(getUser()?.role)) {
        requests.push(api.get("/customers"), api.get("/products"));
      }

      const [challansRes, customersRes, productsRes] = await Promise.all(
        requests
      );

      setChallans(challansRes.data.data || []);
      if (customersRes) setCustomers(customersRes.data.data || []);
      if (productsRes) setProducts(productsRes.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setCustomerId("");
    setItems([{ product_id: "", quantity: 1 }]);
    setError("");
    setShowModal(true);
  };

  const setItem = (index, key, value) => {
    setItems((list) =>
      list.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addItem = () => {
    setItems((list) => [...list, { product_id: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems((list) => list.filter((_, i) => i !== index));
  };

  const productById = (id) => products.find((p) => p.id === Number(id));

  const total = items.reduce((sum, item) => {
    const product = productById(item.product_id);
    if (!product) return sum;
    return sum + Number(product.unit_price) * Number(item.quantity || 0);
  }, 0);

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const validItems = items.filter(
      (item) => item.product_id && Number(item.quantity) > 0
    );

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (validItems.length === 0) {
      setError("Add at least one product line.");
      return;
    }

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    setSaving(true);

    try {
      await api.post("/challans", {
        customer_id: Number(customerId),
        created_by: user?.id,
        items: validItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });

      setShowModal(false);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create challan");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (challan, status) => {
    if (status === challan.status) return;

    setPageError("");

    try {
      await api.patch(`/challans/${challan.id}/status`, { status });

      setChallans((list) =>
        list.map((c) => (c.id === challan.id ? { ...c, status } : c))
      );
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Unable to update challan status"
      );
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Sales Challans</h1>
          <p>{challans.length} challans issued</p>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={openCreate}>
            + New Challan
          </button>
        )}
      </div>

      {pageError && <div className="page-error">{pageError}</div>}

      <div className="panel">
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading challans...</div>
          ) : challans.length === 0 ? (
            <div className="empty-state">
              No challans yet. Click "New Challan" to create one.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Customer</th>
                  <th className="text-right">Total Amount</th>
                  <th>Status</th>
                  {canEdit && <th>Update Status</th>}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {challans.map((challan) => (
                  <tr key={challan.id}>
                    <td>
                      <strong>{challan.challan_number}</strong>
                    </td>
                    <td>{challan.customer_name}</td>
                    <td className="text-right">
                      {money(challan.total_amount)}
                    </td>
                    <td>
                      <span
                        className={
                          statusBadge[challan.status] || "badge badge-gray"
                        }
                      >
                        {challan.status || "CREATED"}
                      </span>
                    </td>
                    {canEdit && (
                    <td>
                      <select
                        className="status-select"
                        value={challan.status || "CREATED"}
                        onChange={(e) =>
                          changeStatus(challan, e.target.value)
                        }
                        disabled={
                          challan.status === "DELIVERED" ||
                          challan.status === "CANCELLED"
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    )}
                    <td className="text-muted">
                      {challan.created_at
                        ? new Date(challan.created_at).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="New Sales Challan" onClose={() => setShowModal(false)} wide>
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={save}>
            <div className="field">
              <label>Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              >
                <option value="">Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customer_name}
                    {customer.business_name
                      ? ` — ${customer.business_name}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Items *</label>

              <div className="line-items">
                <div className="line-item-row line-item-head">
                  <div>Product</div>
                  <div>Quantity</div>
                  <div>Subtotal</div>
                  <div></div>
                </div>

                {items.map((item, index) => {
                  const product = productById(item.product_id);
                  const subtotal = product
                    ? Number(product.unit_price) * Number(item.quantity || 0)
                    : 0;

                  return (
                    <div className="line-item-row" key={index}>
                      <select
                        value={item.product_id}
                        onChange={(e) =>
                          setItem(index, "product_id", e.target.value)
                        }
                      >
                        <option value="">Select product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.product_name} ({money(p.unit_price)}, stock:{" "}
                            {p.current_stock})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        max={product ? product.current_stock : undefined}
                        value={item.quantity}
                        onChange={(e) =>
                          setItem(index, "quantity", e.target.value)
                        }
                      />

                      <div>{product ? money(subtotal) : "-"}</div>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        title="Remove line"
                      >
                        🗑
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addItem}
              >
                + Add Line
              </button>

              {(() => {
                const taxPct = Number(getAppSettings().tax_percentage) || 0;
                const tax = (total * taxPct) / 100;

                return (
                  <div className="challan-summary">
                    <div>Subtotal: {money(total)}</div>
                    {taxPct > 0 && (
                      <div>
                        Tax ({taxPct}%): {money(tax)}
                      </div>
                    )}
                    <div className="challan-total">
                      Total: {money(total + tax)}
                    </div>
                  </div>
                );
              })()}
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
                {saving ? "Creating..." : "Create Challan"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}

export default Challans;
