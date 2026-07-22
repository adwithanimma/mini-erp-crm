// Single source of truth for which roles see which modules.
// Keep in sync with the authorize() guards in backend/src/routes/*.

const MODULE_ROLES = {
  dashboard: ["ADMIN", "ACCOUNTS"],
  customers: ["ADMIN", "SALES"],
  products: ["ADMIN", "WAREHOUSE"],
  inventory: ["ADMIN", "WAREHOUSE"],
  challans: ["ADMIN", "SALES", "ACCOUNTS"],
  reports: ["ADMIN", "ACCOUNTS"],
  settings: ["ADMIN"],
};

// Sidebar / routing order
const MODULE_ORDER = [
  "dashboard",
  "customers",
  "products",
  "inventory",
  "challans",
  "reports",
  "settings",
];

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const canAccess = (role, module) =>
  Boolean(role && MODULE_ROLES[module]?.includes(role));

export const allowedModules = (role) =>
  MODULE_ORDER.filter((module) => canAccess(role, module));

// Where to land after login / when blocked from a page
export const homeRoute = (role) => {
  const first = allowedModules(role)[0];
  return first ? `/${first}` : "/";
};

// ACCOUNTS sees challans read-only; only these roles can create/update them
export const canEditChallans = (role) => ["ADMIN", "SALES"].includes(role);
