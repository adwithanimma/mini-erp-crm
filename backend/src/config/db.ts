import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// In production (managed Postgres on Render/Railway/Neon/etc.) a single
// DATABASE_URL is provided and SSL is required. Locally we fall back to the
// discrete DB_* variables with no SSL.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

export default pool;
