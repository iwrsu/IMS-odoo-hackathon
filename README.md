# Core Inventory IMS

Modular Inventory Management System (IMS) built with Next.js + PostgreSQL.

This app centralizes stock operations that are usually handled with registers or spreadsheets:
- Product management
- Incoming receipts
- Outgoing deliveries
- Internal transfers
- Stock adjustments
- Transaction ledger and dashboard KPIs

## What is implemented

- PostgreSQL-backed inventory persistence
- Server API route for IMS actions: `/api/inventory`
- Dashboard metrics derived from database
- Stock movement ledger with persistent history
- Stock auto-updates on receipt/delivery/adjustment confirmations
- Internal transfer confirmations logged in ledger
- Database health check route: `/api/health/db`
- OTP email authentication via Brevo SMTP
- Role-based access control for `admin`, `manager`, and `staff`

## Tech stack

- Next.js 16 (App Router)
- React + TypeScript
- PostgreSQL
- `pg` (Node Postgres)

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL running locally (WSL Ubuntu is supported)

## 1) Create database and user (first time only)

Start PostgreSQL:

```bash
sudo service postgresql start
```

Open `psql` as postgres superuser:

```bash
sudo -u postgres psql
```

Run:

```sql
CREATE USER ims_user WITH PASSWORD 'ims_password';
CREATE DATABASE ims_db OWNER ims_user;
GRANT ALL PRIVILEGES ON DATABASE ims_db TO ims_user;
\q
```

## 2) Configure environment

Create `.env.local` in project root:

```env
DATABASE_URL=postgresql://ims_user:ims_password@localhost:5432/ims_db

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login
SMTP_PASS=your_brevo_smtp_key
SMTP_FROM=CoreInventory <your_verified_sender@example.com>

SESSION_COOKIE_NAME=ims_session
OTP_TTL_MINUTES=10
SESSION_TTL_DAYS=7
```

## 3) Install dependencies

```bash
npm install
```

## 4) Initialize schema + seed data

```bash
npm run db:init
npm run db:seed
```

Notes:
- `db:init` runs `scripts/init-db.sql`
- `db:seed` runs `scripts/seed-db.sql`
- The SQL runner auto-reads `DATABASE_URL` from `.env.local`

## 5) Run the app

```bash
npm run dev
```

Open:
- `http://localhost:3000/login`
- `http://localhost:3000/dashboard/admin`

## 6) Verify DB connectivity

```bash
curl http://localhost:3000/api/health/db
```

Expected:

```json
{"ok":true,"database":"postgres","connectedAt":"..."}
```

## API overview

### GET `/api/inventory`

Returns full snapshot:
- products
- receipts
- deliveries
- transfers
- adjustments
- ledger
- stats

### POST `/api/inventory`

Action-based mutation endpoint.

Request shape:

```json
{
  "action": "product.create",
  "id": "optional-for-update-delete-confirm",
  "payload": {}
}
```

Supported actions:

- `product.create`
- `product.update`
- `product.delete`
- `receipt.create`
- `receipt.update`
- `receipt.delete`
- `receipt.confirm`
- `delivery.create`
- `delivery.update`
- `delivery.delete`
- `delivery.confirm`
- `transfer.create`
- `transfer.update`
- `transfer.delete`
- `transfer.confirm`
- `adjustment.create`
- `adjustment.update`
- `adjustment.delete`

### Auth endpoints

- `POST /api/auth/request-otp` → send OTP to role-matched user email
- `POST /api/auth/verify-otp` → verify OTP and create httpOnly session cookie
- `GET /api/auth/me` → return current signed-in user from session
- `POST /api/auth/logout` → invalidate session and clear cookie

## Database schema

Tables:
- `products`
- `receipts`
- `deliveries`
- `transfers`
- `adjustments`
- `ledger_entries`
- `users`
- `otp_codes`
- `user_sessions`

Design notes:
- Each operation table stores line items as JSONB
- Confirming receipt/delivery updates product stock levels
- Creating adjustment updates stock immediately
- All stock changes are logged in `ledger_entries`

## Inventory flow implemented

1. Receipt confirmed → stock increases
2. Delivery confirmed → stock decreases
3. Transfer confirmed → movement is logged (location movement, no total stock change)
4. Adjustment created → stock corrected (increase/decrease/write-off)
5. Ledger stores all above events

## OTP authentication flow

1. Enter email + role on `/login`
2. If email is new, the app auto-creates an active user with selected role
3. OTP is emailed through Brevo SMTP relay
4. Enter 6-digit OTP to sign in
5. Session is stored in secure httpOnly cookie
6. User is redirected to role home:
  - `admin` → `/dashboard/admin`
  - `manager` → `/dashboard/manager`
  - `staff` → `/dashboard/staff`

Important:
- `SMTP_USER` must be your Brevo SMTP login.
- `SMTP_PASS` must be your Brevo SMTP key (not account password).
- `SMTP_FROM` must be a sender verified in Brevo.

Seed users (from `scripts/seed-db.sql`):
- `admin@coreinventory.com`
- `manager@coreinventory.com`
- `staff@coreinventory.com`

## Important project files

- DB pool + transactions: `lib/db.ts`
- Inventory service/business logic: `lib/server/inventory-service.ts`
- Inventory API route: `app/api/inventory/route.ts`
- DB health route: `app/api/health/db/route.ts`
- DB schema SQL: `scripts/init-db.sql`
- Seed SQL: `scripts/seed-db.sql`
- SQL executor script: `scripts/run-sql.mjs`
- Client inventory state provider: `lib/contexts/inventory-context.tsx`

## Troubleshooting

If `/api/health/db` fails:
- Ensure PostgreSQL service is running
- Ensure `.env.local` has valid `DATABASE_URL`
- Test manually:

```bash
psql "postgresql://ims_user:ims_password@localhost:5432/ims_db" -c "SELECT NOW();"
```

If `db:init` or `db:seed` fails:
- Check database credentials and host in `.env.local`
- Ensure `ims_db` exists and user has privileges
