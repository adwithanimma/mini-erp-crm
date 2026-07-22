import api from "../api/axios";

export const CURRENCIES = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const KEY = "app_settings";

export const getAppSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

// Fetch from API, cache, and notify listeners (e.g. Navbar)
export const refreshAppSettings = async () => {
  try {
    const res = await api.get("/settings");
    const settings = res.data.data || {};
    localStorage.setItem(KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("app-settings-updated"));
    return settings;
  } catch {
    return getAppSettings();
  }
};

export const currencySymbol = () =>
  CURRENCIES[getAppSettings().currency] || "₹";

export const money = (value) =>
  currencySymbol() +
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
