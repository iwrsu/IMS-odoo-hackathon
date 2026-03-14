# PostgreSQL Setup (WSL Ubuntu)

This project uses `DATABASE_URL` for server-side PostgreSQL access.

## 1) Start PostgreSQL service

```bash
sudo service postgresql start
```

## 2) Create database + user

```bash
sudo -u postgres psql
```

Run inside `psql`:

```sql
CREATE USER ims_user WITH PASSWORD 'ims_password';
CREATE DATABASE ims_db OWNER ims_user;
GRANT ALL PRIVILEGES ON DATABASE ims_db TO ims_user;
\q
```

## 3) Configure environment

Create `.env.local` in project root:

```env
DATABASE_URL=postgresql://ims_user:ims_password@localhost:5432/ims_db
```

## 4) Initialize tables and seed sample data

```bash
npm run db:init
npm run db:seed
```

## 5) Test with psql CLI

```bash
psql "postgresql://ims_user:ims_password@localhost:5432/ims_db" -c "SELECT NOW();"
```

## 6) Test from the app

Run app:

```bash
npm run dev
```

Check endpoint:

```bash
curl http://localhost:3000/api/health/db
```

Expected response shape:

```json
{ "ok": true, "database": "postgres", "connectedAt": "..." }
```

## Notes

- `lib/db.ts` contains the shared PostgreSQL pool.
- `lib/server/inventory-service.ts` contains inventory business logic.
- `app/api/inventory/route.ts` exposes inventory CRUD/confirm actions.
- `app/api/health/db/route.ts` validates DB connection.
- If PostgreSQL runs in Docker or another host, replace `localhost` in `DATABASE_URL`.

For complete project setup and API details, see `README.md`.
