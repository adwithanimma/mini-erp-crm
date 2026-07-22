import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { money } from "../utils/appSettings";

const EMPTY = { customers: [], products: [], challans: [] };

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const boxRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const q = query.trim();

    if (q.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/search", { params: { q } });
        setResults(res.data.data || EMPTY);
      } catch {
        setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (path) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  const total =
    results.customers.length +
    results.products.length +
    results.challans.length;

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className="global-search" ref={boxRef}>
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        placeholder="Search customers, products, SKU, challans..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {showDropdown && (
        <div className="search-dropdown">
          {loading && total === 0 ? (
            <div className="search-empty">Searching…</div>
          ) : total === 0 ? (
            <div className="search-empty">No results for “{query}”</div>
          ) : (
            <>
              {results.customers.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Customers</div>
                  {results.customers.map((c) => (
                    <button
                      key={`c-${c.id}`}
                      className="search-item"
                      onClick={() => go("/customers")}
                    >
                      <span className="search-item-main">
                        {c.customer_name}
                      </span>
                      <span className="search-item-sub">
                        {c.business_name || c.mobile || c.email || ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.products.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Products</div>
                  {results.products.map((p) => (
                    <button
                      key={`p-${p.id}`}
                      className="search-item"
                      onClick={() => go("/products")}
                    >
                      <span className="search-item-main">
                        {p.product_name}
                      </span>
                      <span className="search-item-sub">
                        SKU: {p.sku} · {money(p.unit_price)} · stock{" "}
                        {p.current_stock}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.challans.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Challans</div>
                  {results.challans.map((ch) => (
                    <button
                      key={`ch-${ch.id}`}
                      className="search-item"
                      onClick={() => go("/challans")}
                    >
                      <span className="search-item-main">
                        {ch.challan_number}
                      </span>
                      <span className="search-item-sub">
                        {ch.customer_name} · {money(ch.total_amount)} ·{" "}
                        {ch.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
