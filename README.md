# Mini ERP / CRM

A full-stack ERP and CRM application designed for small businesses. It provides customer management, product and inventory management, sales challans, dashboard analytics, reports, role-based access, and configurable company settings.

## Tech Stack

| Layer          | Technologies                                    |
| -------------- | ----------------------------------------------- |
| Backend        | Node.js, Express, TypeScript, PostgreSQL (`pg`) |
| Authentication | JWT (`jsonwebtoken`), bcrypt                    |
| Frontend       | React, Vite, React Router, Axios, Recharts      |
| Exports        | jsPDF, jsPDF-AutoTable, XLSX                    |

## Features

### Authentication and Role-Based Access

* JWT-based login.
* Four user roles: ADMIN, SALES, WAREHOUSE, and ACCOUNTS.
* API routes are protected using role-based middleware.
* The frontend also adjusts available pages, sidebar options, and controls according to the logged-in user's role.

### Customers

* Add, view, update, and delete customers.
* Customer type and status management.
* Foreign-key checks before deleting customers.

### Products and Inventory

* Add, update, view, and delete products.
* Track available stock.
* Identify low-stock and out-of-stock products.

### Sales Challans

* Create challans with multiple products.
* Product prices are taken from the server.
* Stock is updated when a challan is created.
* Challan status workflow:

`CREATED → DISPATCHED → DELIVERED / CANCELLED`

### Dashboard

The dashboard provides:

* KPI cards
* Today's sales
* Today's orders
* Revenue information
* Monthly sales chart
* Stock IN vs OUT chart
* Top products
* Recent activity

### Reports

The application includes six reports:

* Customer Report
* Sales Report
* Inventory Report
* Product Report
* Monthly Revenue Report
* Low Stock Report

Reports can be exported as:

* PDF
* Excel

### Global Search

The navbar includes a global search for:

* Customers
* Products
* SKUs
* Challans

Search results are filtered according to the logged-in user's role.

### Settings

Administrators can configure:

* Company name
* GST number
* Company logo
* Currency
* Tax percentage

These settings are used throughout the application.

## User Roles

| Role      | Access                                  |
| --------- | --------------------------------------- |
| ADMIN     | All modules                             |
| SALES     | Customers and Sales Challans            |
| WAREHOUSE | Products and Inventory                  |
| ACCOUNTS  | Dashboard, Reports, and Challan viewing |

## Project Structure

```text
mini-erp-crm/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── repositories/
│       └── middleware/
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── utils/
│       └── api/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── docs/
    ├── API.md
    ├── architecture/
    └── deployment/
```

## Getting Started

### Prerequisites

* Node.js 18 or later
* PostgreSQL 14 or later

### 1. Set Up the Database

Create the database and run the schema and seed files:

```bash
createdb mini_erp

psql -d mini_erp -f database/schema.sql

psql -d mini_erp -f database/seed.sql
```

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update the `.env` file with your PostgreSQL credentials and JWT secret.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=mini_erp

JWT_SECRET=replace_with_a_long_random_secret
```

Start the development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend connects to the backend through:

```text
http://localhost:5000/api
```

The API URL is configured in:

```text
frontend/src/api/axios.js
```

## Demo Accounts

The database seed creates one account for each role.

All demo accounts use the password:

```text
admin123
```

| Email                                           | Role      |
| ----------------------------------------------- | --------- |
| [admin@test.com](mailto:admin@test.com)         | ADMIN     |
| [sales@test.com](mailto:sales@test.com)         | SALES     |
| [warehouse@test.com](mailto:warehouse@test.com) | WAREHOUSE |
| [accounts@test.com](mailto:accounts@test.com)   | ACCOUNTS  |

## API Overview

All API endpoints are under `/api`.

Authentication is required for all endpoints except the login endpoint.

| Method              | Endpoint               | Roles                   |
| ------------------- | ---------------------- | ----------------------- |
| POST                | `/auth/login`          | Public                  |
| GET                 | `/dashboard/stats`     | ADMIN, ACCOUNTS         |
| GET/POST/PUT/DELETE | `/customers[/:id]`     | ADMIN, SALES            |
| GET                 | `/products`            | ADMIN, WAREHOUSE, SALES |
| POST/PUT/DELETE     | `/products[/:id]`      | ADMIN, WAREHOUSE        |
| GET/POST            | `/challans`            | ADMIN, SALES            |
| GET                 | `/challans`            | ADMIN, SALES, ACCOUNTS  |
| PATCH               | `/challans/:id/status` | ADMIN, SALES            |
| GET                 | `/reports/:type`       | ADMIN, ACCOUNTS         |
| GET                 | `/search?q=`           | All roles               |
| GET                 | `/settings`            | All roles               |
| PUT                 | `/settings`            | ADMIN                   |

For the complete API details, see `docs/API.md`.

## Security

* `.env` is included in `.gitignore` and should not be committed.
* Do not use real passwords in the seed data for production.
* Change the demo passwords before deployment.
* Use a strong, randomly generated `JWT_SECRET` in production.
* API access is protected using JWT authentication and role-based middleware.


