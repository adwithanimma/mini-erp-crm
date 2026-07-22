import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

const emptyForm = {
  customer_name: "",
  mobile: "",
  email: "",
  business_name: "",
  gst_number: "",
  customer_type: "Retail",
  address: "",
  status: "Active",
  notes: "",
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
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

  const openEdit = (customer) => {
    setEditing(customer);
    setForm({
      customer_name: customer.customer_name || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      business_name: customer.business_name || "",
      gst_number: customer.gst_number || "",
      customer_type: customer.customer_type || "Retail",
      address: customer.address || "",
      status: customer.status || "Active",
      notes: customer.notes || "",
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

    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, form);
      } else {
        await api.post("/customers", form);
      }

      setShowModal(false);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save customer");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (customer) => {
    if (
      !window.confirm(
        `Delete customer "${customer.customer_name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setPageError("");

    try {
      await api.delete(`/customers/${customer.id}`);
      loadCustomers();
    } catch (err) {
      setPageError(
        err.response?.data?.message || "Unable to delete customer"
      );
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>{customers.length} customers in your CRM</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Customer
        </button>
      </div>

      {pageError && <div className="page-error">{pageError}</div>}

      <div className="panel">
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="empty-state">
              No customers yet. Click "Add Customer" to create one.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="text-muted">#{customer.id}</td>
                    <td>
                      <strong>{customer.customer_name}</strong>
                    </td>
                    <td>{customer.mobile || "-"}</td>
                    <td>{customer.email || "-"}</td>
                    <td>{customer.business_name || "-"}</td>
                    <td>
                      {customer.customer_type ? (
                        <span className="badge badge-gray">
                          {customer.customer_type}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          (customer.status || "").toUpperCase() === "INACTIVE"
                            ? "badge badge-red"
                            : "badge badge-green"
                        }
                      >
                        {customer.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => openEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-link-danger"
                        onClick={() => remove(customer)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editing ? "Edit Customer" : "Add Customer"}
          onClose={() => setShowModal(false)}
        >
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={save}>
            <div className="form-grid">
              <div className="field full">
                <label>Customer Name *</label>
                <input
                  value={form.customer_name}
                  onChange={(e) => setField("customer_name", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Mobile</label>
                <input
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Business Name</label>
                <input
                  value={form.business_name}
                  onChange={(e) => setField("business_name", e.target.value)}
                />
              </div>

              <div className="field">
                <label>GST Number</label>
                <input
                  value={form.gst_number}
                  onChange={(e) => setField("gst_number", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Customer Type</label>
                <select
                  value={form.customer_type}
                  onChange={(e) => setField("customer_type", e.target.value)}
                >
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>Distributor</option>
                </select>
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="field full">
                <label>Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </div>

              <div className="field full">
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
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
                  : "Add Customer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}

export default Customers;
