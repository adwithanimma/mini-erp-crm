import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import Layout from "../components/Layout";
import { money } from "../utils/appSettings";

const BLUE = "#3b82f6";
const AMBER = "#d97706";

const inr = money;

const activityBadge = {
  CHALLAN: { label: "Challan", cls: "badge badge-blue" },
  STOCK_IN: { label: "Stock In", cls: "badge badge-green" },
  STOCK_OUT: { label: "Stock Out", cls: "badge badge-amber" },
};

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const kpis = data?.kpis || {};
  const today = data?.today || {};

  const heroCards = [
    {
      label: "Today's Sales",
      value: today.today_sales != null ? inr(today.today_sales) : null,
      sub: "Excluding cancelled",
    },
    {
      label: "Today's Orders",
      value: today.today_orders,
      sub: "Challans created today",
    },
    {
      label: "Total Revenue",
      value: today.total_revenue != null ? inr(today.total_revenue) : null,
      sub: "All time",
    },
  ];

  const kpiCards = [
    { label: "Total Customers", value: kpis.total_customers },
    { label: "Total Products", value: kpis.total_products },
    { label: "Sales Challans", value: kpis.total_challans },
    {
      label: "Inventory Value",
      value: kpis.inventory_value != null ? inr(kpis.inventory_value) : null,
    },
    {
      label: "Low Stock Products",
      value: kpis.low_stock,
      danger: Number(kpis.low_stock) > 0,
    },
    {
      label: "Out of Stock",
      value: kpis.out_of_stock,
      danger: Number(kpis.out_of_stock) > 0,
    },
  ];

  const salesData = (data?.sales_by_month || []).map((row) => ({
    month: row.month,
    total: Number(row.total),
  }));

  const movementData = (data?.stock_movement || []).map((row) => ({
    month: row.month,
    "Stock In": Number(row.stock_in),
    "Stock Out": Number(row.stock_out),
  }));

  const topProducts = (data?.top_products || []).map((row) => ({
    name: row.product_name,
    units: Number(row.units_sold),
    revenue: Number(row.revenue),
  }));

  const activities = data?.recent_activities || [];
  const recentCustomers = data?.recent_customers || [];
  const recentMovements = data?.recent_stock_movements || [];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back{user?.name ? `, ${user.name}` : ""} 👋</p>
        </div>
      </div>

      <div className="cards hero-cards">
        {heroCards.map((card) => (
          <div className="stat-card hero-card" key={card.label}>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">
              {loading || card.value == null ? "…" : card.value}
            </div>
            <div className="stat-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="cards">
        {kpiCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className="stat-label">{card.label}</div>
            <div
              className="stat-value"
              style={card.danger ? { color: "var(--danger)" } : {}}
            >
              {loading || card.value == null ? "…" : card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="panel chart-panel">
          <div className="panel-title">Sales by Month</div>
          <div className="chart-body">
            {salesData.length === 0 ? (
              <div className="empty-state">
                {loading ? "Loading..." : "No sales data yet."}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salesData} barSize={36}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={inr}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    width={80}
                  />
                  <Tooltip formatter={(v) => [inr(v), "Sales"]} />
                  <Bar
                    dataKey="total"
                    name="Sales"
                    fill={BLUE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-title">Stock Movement (IN vs OUT)</div>
          <div className="chart-body">
            {movementData.length === 0 ? (
              <div className="empty-state">
                {loading ? "Loading..." : "No stock movements yet."}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={movementData} barSize={24} barGap={2}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{ fontSize: 13 }}
                    iconType="circle"
                    iconSize={9}
                  />
                  <Bar
                    dataKey="Stock In"
                    fill={BLUE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Stock Out"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-title">Top Selling Products</div>
          <div className="chart-body">
            {topProducts.length === 0 ? (
              <div className="empty-state">
                {loading ? "Loading..." : "No sales yet."}
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(180, topProducts.length * 52)}
              >
                <BarChart data={topProducts} layout="vertical" barSize={20}>
                  <CartesianGrid horizontal={false} stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 12.5, fill: "#0f172a" }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value, name, item) => [
                      `${value} units (${inr(item.payload.revenue)})`,
                      "Sold",
                    ]}
                  />
                  <Bar
                    dataKey="units"
                    name="Units sold"
                    fill={BLUE}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Recent Activities</div>
          {activities.length === 0 ? (
            <div className="empty-state">
              {loading ? "Loading..." : "No activity yet."}
            </div>
          ) : (
            <ul className="activity-list">
              {activities.map((activity, index) => {
                const badge =
                  activityBadge[activity.type] || {
                    label: activity.type,
                    cls: "badge badge-gray",
                  };

                return (
                  <li key={index} className="activity-item">
                    <span className={badge.cls}>{badge.label}</span>
                    <span className="activity-text">
                      {activity.description}
                    </span>
                    <span className="activity-date">
                      {new Date(activity.created_at).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" }
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">Recent Customers</div>
          {recentCustomers.length === 0 ? (
            <div className="empty-state">
              {loading ? "Loading..." : "No customers yet."}
            </div>
          ) : (
            <ul className="activity-list">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="activity-item">
                  <span className="badge badge-blue">
                    {customer.customer_type || "Customer"}
                  </span>
                  <span className="activity-text">
                    <strong>{customer.customer_name}</strong>
                    {customer.business_name
                      ? ` — ${customer.business_name}`
                      : ""}
                  </span>
                  <span className="activity-date">
                    {customer.created_at
                      ? new Date(customer.created_at).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short" }
                        )
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">Recent Stock Movements</div>
          {recentMovements.length === 0 ? (
            <div className="empty-state">
              {loading ? "Loading..." : "No stock movements yet."}
            </div>
          ) : (
            <ul className="activity-list">
              {recentMovements.map((movement) => (
                <li key={movement.id} className="activity-item">
                  <span
                    className={
                      movement.movement_type === "IN"
                        ? "badge badge-green"
                        : "badge badge-amber"
                    }
                  >
                    {movement.movement_type}
                  </span>
                  <span className="activity-text">
                    <strong>{movement.product_name}</strong>
                    {` — ${movement.quantity} units`}
                    {movement.reason ? ` (${movement.reason})` : ""}
                  </span>
                  <span className="activity-date">
                    {new Date(movement.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
