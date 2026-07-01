# ChillUP backend

Django + Django REST Framework API for the ChillUP subscription service
(games/entertainment venues: PC clubs, bowling, table tennis, anticafes,
board-game clubs, VR arcades). Matches the data model implied by the
frontend prototype in `../project/` (categories, partners, plans, FAQ).

## One-time setup

### 1. PostgreSQL

Your local PostgreSQL 18 requires a password for the `postgres` superuser
that nobody currently has. Rather than reset it, `scripts/setup_postgres.ps1`
creates a dedicated low-privilege role (`chillup_app`) and database
(`chillup`) for this project without ever needing that password.

Run **once**, from an **Administrator** PowerShell window:

```powershell
cd backend\scripts
.\setup_postgres.ps1
```

It temporarily flips local auth to `trust`, generates a random password,
creates the role/database with it, restores the original config, and writes
`DB_PASSWORD` into `backend/.env` for you (copy `.env.example` to `.env`
first if it doesn't exist yet) — nothing to edit by hand, and no secret is
hardcoded in the script itself.

### 2. Python environment

A virtualenv already exists at `backend/.venv` with everything from
`requirements.txt` installed (Django 6, DRF, SimpleJWT, psycopg3, CORS
headers, drf-spectacular, python-dateutil). To recreate it elsewhere:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Migrate + seed

```powershell
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_data      # categories, plans, partners, FAQ — matches the frontend mock data
.\.venv\Scripts\python.exe manage.py createsuperuser # for /admin/
```

### 4. Run

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

- API root: `http://127.0.0.1:8000/api/`
- Swagger docs: `http://127.0.0.1:8000/api/docs/`
- Admin (manage partners/plans/FAQ without touching code): `http://127.0.0.1:8000/admin/`

Update `CORS_ALLOWED_ORIGINS` in `.env` to match wherever you serve
`../project/ChillUP.html` from (e.g. a local static server).

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register/`, `POST /api/auth/login/` (email or phone), `POST /api/auth/token/refresh/`, `POST /api/auth/logout/`, `GET/PATCH /api/auth/me/`, `GET/PATCH /api/auth/me/notifications/` |
| Plans | `GET /api/plans/` |
| Partners | `GET /api/partners/categories/`, `GET /api/partners/?q=&city=&category=&tier=` |
| Subscription | `GET /api/subscriptions/me/`, `POST .../change-plan/`, `.../cancel/`, `.../resume/`, `.../freeze/`, `.../unfreeze/`, `GET .../payments/`, `/api/subscriptions/payment-methods/` (CRUD) |
| Visits / QR | `GET /api/visits/qr-token/` (user), `POST /api/visits/checkin/` + `/checkout/` (partner terminal, `X-Partner-Key` header), `GET /api/visits/` (history) |
| Dashboard | `GET /api/dashboard/overview/` |
| FAQ | `GET /api/faq/` |

JWT auth: send `Authorization: Bearer <access token>`.

## Design decisions worth knowing about

- **Access control** is inferred from the pricing page's comparison table,
  not spelled out explicitly anywhere: each `Plan` has a `tier_rank`
  (Базовый/Премиум/VIP) and optional `allowed_categories`. A checkin is
  allowed only if the user's plan's tier rank ≥ the partner's tier rank AND
  the partner's category is in the plan's allowed categories (empty =
  all). Basic is seeded to only cover `pc` + `anticafe` categories and caps
  at 10 visits/month, matching the pricing page. Revisit this if real
  business rules differ.
- **Payments are stubbed.** No merchant account/PSP was available while
  building this, so `subscriptions/payments.py` defines a
  `PaymentProvider` interface with a `MockPaymentProvider` that always
  succeeds. Swap in a real implementation (CloudPayments and Kaspi Pay are
  the common choices for KZ/RU) via the `PAYMENT_PROVIDER` setting — no
  other code needs to change. Card data is never meant to touch this
  server: `PaymentMethod` only stores a provider token + display metadata
  (brand/last4/exp), matching how real tokenizing PSPs work.
- **Subscription renewals** aren't event-driven (no Celery in this
  project). `python manage.py process_subscriptions` advances
  trials/periods that have ended (charges or expires them) — schedule it
  with Windows Task Scheduler every few minutes.
- **QR check-in** tokens are short-lived signed tokens (`visits/tokens.py`,
  default 90s validity) carrying just the user id, refreshed by the app
  every ~60s. Partner reception terminals authenticate separately via each
  `Partner.api_key` (`X-Partner-Key` header) — a placeholder for a real
  partner-terminal auth story.
