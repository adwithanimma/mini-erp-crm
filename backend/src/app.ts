import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import customerRoutes from "./routes/customer.routes";
import productRoutes from "./routes/product.routes";
import stockRoutes from "./routes/stock.routes";
import challanRoutes from "./routes/challan.routes";
import settingsRoutes from "./routes/settings.routes";
import reportsRoutes from "./routes/reports.routes";
import searchRoutes from "./routes/search.routes";

const app = express();

// Restrict to CORS_ORIGIN in production if set; otherwise allow all origins.
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use(
"/api/stock",
stockRoutes
);
app.use(
"/api/challans",
challanRoutes
);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/search", searchRoutes);

export default app;