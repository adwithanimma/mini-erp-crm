import { NavLink } from "react-router-dom";
import { getUser, canAccess } from "../utils/permissions";

const links = [
  { to: "/dashboard", module: "dashboard", label: "Dashboard", icon: "📊" },
  { to: "/customers", module: "customers", label: "Customers", icon: "👥" },
  { to: "/products", module: "products", label: "Products", icon: "📦" },
  { to: "/inventory", module: "inventory", label: "Inventory", icon: "🏬" },
  { to: "/challans", module: "challans", label: "Sales Challans", icon: "🧾" },
  { to: "/reports", module: "reports", label: "Reports", icon: "📑" },
  { to: "/settings", module: "settings", label: "Settings", icon: "⚙️" },
];

function Sidebar() {
  const user = getUser();

  return (
    <div className="sidebar">
      <h2 className="brand">
        Mini <span>ERP</span>
      </h2>

      {links
        .filter((link) => canAccess(user?.role, link.module))
        .map((link) => (
          <NavLink key={link.to} to={link.to}>
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
    </div>
  );
}

export default Sidebar;
