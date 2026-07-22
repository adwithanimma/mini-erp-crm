import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { CURRENCIES, refreshAppSettings } from "../utils/appSettings";

const MAX_LOGO_BYTES = 500 * 1024;

function Settings() {
  const [form, setForm] = useState({
    company_name: "",
    gst_number: "",
    logo: "",
    currency: "INR",
    tax_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get("/settings");
      const s = res.data.data;
      if (s) {
        setForm({
          company_name: s.company_name || "",
          gst_number: s.gst_number || "",
          logo: s.logo || "",
          currency: s.currency || "INR",
          tax_percentage: Number(s.tax_percentage) || 0,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Logo must be an image file.");
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setError("Logo must be under 500KB.");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = () => setField("logo", reader.result);
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put("/settings", form);
      await refreshAppSettings();
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Company configuration — applies across the portal</p>
        </div>
      </div>

      <div className="panel settings-panel">
        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading settings...</div>
          ) : (
            <>
              {error && <div className="form-error">{error}</div>}
              {saved && (
                <div className="form-success">Settings saved successfully.</div>
              )}

              <form onSubmit={save}>
                <div className="form-grid">
                  <div className="field">
                    <label>Company Name *</label>
                    <input
                      value={form.company_name}
                      onChange={(e) =>
                        setField("company_name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <label>GST Number</label>
                    <input
                      value={form.gst_number}
                      onChange={(e) => setField("gst_number", e.target.value)}
                      placeholder="e.g. 22AAAAA0000A1Z5"
                    />
                  </div>

                  <div className="field">
                    <label>Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setField("currency", e.target.value)}
                    >
                      {Object.entries(CURRENCIES).map(([code, symbol]) => (
                        <option key={code} value={code}>
                          {code} ({symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Tax Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={form.tax_percentage}
                      onChange={(e) =>
                        setField("tax_percentage", e.target.value)
                      }
                    />
                  </div>

                  <div className="field full">
                    <label>Logo</label>
                    <div className="logo-row">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt="Company logo"
                          className="logo-preview"
                        />
                      ) : (
                        <div className="logo-placeholder">No logo</div>
                      )}

                      <div className="logo-actions">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onLogoChange}
                        />
                        {form.logo && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setField("logo", "")}
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
