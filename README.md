# D.R.STORES — Premium Grocery E-Commerce

A full-stack grocery storefront + admin dashboard. **React 19 + Vite** frontend backed by an **Express + MongoDB (Mongoose)** API. JWT sessions, seeded demo data, and live dashboards.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js, Express, Mongoose (MongoDB) |
| Auth | JWT (Bearer + httpOnly cookie), bcrypt password hashing |
| DB | MongoDB (Docker container, `mongodb://localhost:27017/drstores`) |

## Quick Start

### 1. Start MongoDB

```bash
docker run -d --name drstores-mongo -p 27017:27017 -v drstores-data:/data/db mongo:7
```

### 2. Install dependencies

```bash
npm install          # frontend (axios added for the API layer)
cd server && npm install
```

### 3. Seed the database

```bash
cd server && node seed/seedData.js
```

Seeds 13 users, 8 categories, 40 products, 22 orders, 36 inventory items, 7 delivery partners, 10 coupons, notifications, activity logs, addresses and reviews.

### 4. Run the backend (port 5000)

```bash
cd server && node server.js
```

### 5. Run the frontend (port 5173, proxies `/api` → `:5000`)

```bash
npm run dev
```

Open http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | [configured admin account]
| Customer | `customer@gmail.com` |
| Demo customer | `demo@drstores.com` |

Phone OTP logins are simulated (no SMS provider) — the 6-digit code is returned by the API and shown as a "demo OTP" in the UI.

## Architecture

- **Frontend** — React Context provides all data access:
  - `context/AuthContext.jsx` — auth session, wishlist, settings (JWT session)
  - `context/ProductsContext.jsx` — shop + admin product catalog & categories
  - `context/CartContext.jsx` — cart, coupons, addresses, order history, toasts
  - `context/OrdersContext.jsx`, `CustomersContext`, `InventoryContext`, `DeliveryContext`, `CouponsContext` — admin modules
  - `context/AdminDataContext.jsx` — live dashboard KPIs, charts, activity, notifications
  - `api/index.js` — Axios API layer (all endpoints unwrap the `{ success, data }` envelope)
- **Backend** — `server/` Express app with `models/`, `controllers/`, `routes/`, `middleware/`, `seed/`.
  - JWT attached via `Authorization: Bearer` header; a 401 on any protected route bounces the SPA to `/login`.
  - All routes mounted under `/api`.

## Scripts

```bash
npm run dev        # Vite dev server (port 5173)
npm run build      # production build
npm run lint       # oxlint
```

## Recent Work

- **Phase 5** — Full admin dashboard (products, categories, orders, customers, inventory, delivery, coupons, reports, analytics, activity).
- **Backend migration** — Added an Express + MongoDB backend and rewired every feature (auth, catalog, cart, checkout, orders, wishlist, addresses, coupons, admin modules) from `localStorage` to the API.
