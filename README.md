# Mini ERP / CRM

A full-stack ERP + CRM for small businesses: customers, products, inventory,
sales challans, dashboard analytics, reports, and role-based access — with a
configurable company profile (currency, tax, branding).

## Tech stack

| Layer     | Stack                                                        |
| --------- | ----------------------------------------------------------- |
| Backend   | Node.js, Express, TypeScript, PostgreSQL (`pg`)             |
| Auth      | JWT (`jsonwebtoken`), password hashing with `bcrypt`        |
| Frontend  | React, Vite, React Router, Axios, Recharts                  |
| Exports   | `jspdf` + `jspdf-autotable` (PDF), `xlsx` (Excel)           |

## Features

- **Authentication & RBAC** — JWT login with four roles (ADMIN, SALES,
  WAREHOUSE, ACCOUNTS). Access is enforced on **both** the API (route guards)
  and the UI (sidebar, routing, and controls adapt to the role).
- **Customers** — full CRUD with type/status, delete with foreign-key-safe guards.
- **Products & Inventory** — CRUD, stock levels, low-stock / out-of-stock flags.
- **Sales Challans** — multi-line challans that price items server-side, decrement
  stock, and support a status workflow (CREATED → DISPATCHED → DELIVERED / CANCELLED).
- **Dashboard** — KPI cards, today's sales / orders / revenue widgets, and charts
  (sales by month, stock IN vs OUT, top products, recent activity).
- **Reports** — six reports (Customer, Sales, Inventory, Product, Monthly Revenue,
  Low Stock) exportable as **PDF** or **Excel**.
- **Global search** — search customers, products, SKUs, and challans from the navbar
  (results scoped to the user's role).
- **Settings** — admin-configurable company name, GST number, logo, currency, and
  tax percentage that apply across the app.

## Roles

| Role      | Can access                          |
| --------- | ----------------------------------- |
| ADMIN     | Everything                          |
| SALES     | Customers, Sales Challans           |
| WAREHOUSE | Products, Inventory                 |
| ACCOUNTS  | Dashboard (reports), Challans (view)|

## Project structure

```
mini-erp-crm/
├── backend/          Express + TypeScript API
│   └── src/
│       ├── controllers/  routes/  services/  repositories/  middleware/
├── frontend/         React + Vite SPA
│   └── src/
│       ├── pages/  components/  utils/  api/
├── database/
│   ├── schema.sql    table definitions
│   └── seed.sql      demo users, customer, product
└── docs/             API, architecture, deployment notes
```

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Database

Create the database, then load the schema and demo data:

```bash
createdb mini_erp
psql -d mini_erp -f database/schema.sql
psql -d mini_erp -f database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your DB password + a JWT secret
npm run dev               # starts on http://localhost:5000
```

`.env` keys (see `backend/.env.example`):

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=mini_erp
JWT_SECRET=replace_with_a_long_random_secret
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api` (see
`frontend/src/api/axios.js`).

### Demo login

The seed creates one user per role. The password for **all** of them is `admin123`:

| Email                | Role      |
| -------------------- | --------- |
| admin@test.com       | ADMIN     |
| sales@test.com       | SALES     |
| warehouse@test.com   | WAREHOUSE |
| accounts@test.com    | ACCOUNTS  |

## API overview

All routes are under `/api` and require a `Bearer` token except `POST /api/auth/login`.

| Method | Endpoint                    | Roles                       |
| ------ | --------------------------- | --------------------------- |
| POST   | `/auth/login`               | public                      |
| GET    | `/dashboard/stats`          | ADMIN, ACCOUNTS             |
| GET/POST/PUT/DELETE | `/customers[/:id]` | ADMIN, SALES              |
| GET    | `/products`                 | ADMIN, WAREHOUSE, SALES     |
| POST/PUT/DELETE | `/products[/:id]`  | ADMIN, WAREHOUSE            |
| GET/POST | `/challans`               | ADMIN, SALES (+ ACCOUNTS read) |
| PATCH  | `/challans/:id/status`      | ADMIN, SALES                |
| GET    | `/reports/:type`            | ADMIN, ACCOUNTS             |
| GET    | `/search?q=`                | any (results role-scoped)   |
| GET    | `/settings`                 | any                         |
| PUT    | `/settings`                 | ADMIN                       |

See `docs/API.md` for details.

## Security notes

- `backend/.env` is git-ignored — never commit real secrets.
- The seed password hash is published deliberately for demo convenience; use a
  strong password and rotate `JWT_SECRET` before any real deployment.

## License

See [LICENSE](LICENSE).
