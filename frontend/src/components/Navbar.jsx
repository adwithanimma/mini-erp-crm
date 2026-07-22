import { useEffect, useState } from "react";
import {
  getAppSettings,
  refreshAppSettings,
} from "../utils/appSettings";
import GlobalSearch from "./GlobalSearch";

function Navbar() {
  const [settings, setSettings] = useState(getAppSettings());

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    refreshAppSettings().then(setSettings);

    const onUpdate = () => setSettings(getAppSettings());
    window.addEventListener("app-settings-updated", onUpdate);
    return () =>
      window.removeEventListener("app-settings-updated", onUpdate);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="navbar">
      <div className="navbar-brand">
        {settings.logo && (
          <img src={settings.logo} alt="Logo" className="navbar-logo" />
        )}
        <h3>{settings.company_name || "ERP Operations Portal"}</h3>
        {settings.gst_number && (
          <span className="badge badge-gray">GST: {settings.gst_number}</span>
        )}
      </div>

      <GlobalSearch />

      <div className="nav-right">
        {user && (
          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <div>
              {user.name}
              <span className="badge badge-blue" style={{ marginLeft: 8 }}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
