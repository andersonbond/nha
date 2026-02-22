# LIS 2026 – Progress Report Summary

## Project overview

**LIS (Lot Information System)** is a production-grade system for NHA, designed for Philippine deployment. It is built as a **Next.js frontend** and **FastAPI backend** with **PostgreSQL**, following a three-MVP plan with emphasis on UI/UX first and incremental backend integration.

---

## 1. Frontend (Next.js, Tailwind, Heroicons)

### Application shell and layout
- **Login page** – Email/password form (static); redirects to dashboard on submit; no backend auth (SSO to be integrated later).
- **Session flow** – Unauthenticated users land on login; logout redirects to login.
- **Header** – Search bar, username, light/dark toggle, logout. Logo removed from header per request.
- **Sidebar** – Logo in nav; all 10 modules with icons (Dashboard, Applications, Beneficiaries, Projects, Programs, Lot Management, Landholdings, CIIM, Lot Award Documentation, Reports, Settings). Collapsible with show/hide; burger menu on mobile.
- **Footer** – Privacy Policy, Terms of Use, Copyright.
- **Theme** – Primary color `#03045e`; light/dark mode; subtle borders/shadows; no gradients; mobile-responsive (desktop, tablet, mobile).

### Dashboard
- **Production-grade dashboard** (no “Coming soon”): stat cards (e.g. Total Applications, Pending, Beneficiaries, Lots, Projects, Programs), breakdowns (e.g. applications by status, lots by status), optional “Top projects” / “Recent activity” style content, welcome/header line.
- **Icons** – Heroicons used for nav, dashboard, search, and header labels.

### Core modules with full CRUD UI and API integration
- **Projects** – List (table), server-side filtering (popup with project_code, project_name, region, province, lot_type, program), Add/Edit (slide-over form with program dropdown, validation, add-project review step), Delete (soft delete with confirm). **Quick insights** – compact section (cards, stats, e.g. top by cost) – non-collapsible; filter as icon + “Filter” label opening a popup.
- **Programs** – List, Add/Edit (slide-over), Delete (soft delete), **add-program review** before submit. **Quick insights** (e.g. total programs, avg interest rate, max term). Filter icon + “Filter” label; icons in add-program form.
- **Applications** – Full CRUD aligned to backend schema; **quick insights** section; soft delete.
- **Beneficiaries** – Full CRUD; added to sidebar after Applications; **quick insights**; soft delete.

### UX and validation
- **Projects** – Program selector when adding/editing; confirmation/review before adding; basic field validation (lengths, numeric ranges, etc.).
- **Programs** – Confirmation/review before adding; basic validation.
- **Filter UX** – Filter as icon + “Filter” label; filters in popup (e.g. Projects) to save space; no collapsible quick insights.

### Mock mode (frontend-only / disconnected backend)
- **Env** – `NEXT_PUBLIC_USE_MOCK_DATA=true` for frontend-only or when backend is unreachable.
- **Implementation** – `frontend/app/lib/mockData.ts`: in-memory stores for projects, programs, applications, beneficiaries; GET (list + by-id, including project query params), POST, PUT, DELETE; same response shapes as API.
- **API layer** – `apiFetch` in `frontend/app/lib/api.ts` uses `isMockMode()`; when true, requests are handled by the mock layer with no `fetch`. Pages unchanged.
- **Docs** – `.env.example` and frontend README describe mock mode.

### Build and type fixes
- Removed or fixed unused variables (e.g. `applyFilters`, `isEdit`/`_isEdit`, map index `i`) for ESLint.
- `formatNum` in ProjectTable accepts `number | null | undefined` to match Project type and fix Vercel build.

---

## 2. Backend (FastAPI, PostgreSQL, Alembic)

### API and routes
- **Root** – `GET /` returns “NHA LIS server is running”.
- **Docs** – OpenAPI at `/docs`, ReDoc at `/redoc`.
- **CORS** – Configured for frontend origin (e.g. localhost:3000).

### Resources and CRUD
- **Applications** – UUID `app_id`; CRUD; soft delete (`deleted_at`).
- **Beneficiaries** – Integer `id`; CRUD; soft delete.
- **Projects** – `project_code` (PK); CRUD; server-side list filtering (project_code, project_name, region_code, province_code, lot_type, project_prog_id); soft delete; `created_at` (and optional `inp_date` handling).
- **Programs** – `project_prog_id` (SERIAL); CRUD; soft delete.
- **Program classifications** – `program_class` (PK); CRUD; referenced by programs/projects.
- **Co-owners, employment_profiles, properties** – Tables and APIs as per migrations; co-owners/employment_profiles link to beneficiaries.

### Schema and validation
- **Projects** – Pydantic schemas with constraints (e.g. `interest_rate`, `delinquency_rate` NUMERIC(7,4); `terms_yr` ≤ 99) to avoid DB and response validation errors.
- **Applications / Beneficiaries** – Schemas aligned to DB and frontend types.

### Migrations (Alembic)
- **001** – applications, user_log  
- **002** – beneficiaries  
- **003** – co_owners  
- **004** – employment_profiles  
- **005** – properties  
- **006** – projects  
- **007** – programs  
- **008** – program_classifications  
- **009** – created_at for projects  
- **010** – deleted_at (soft delete) for projects/programs  
- **011** – deleted_at for applications/beneficiaries  

### User audit
- **user_log** – User activity (e.g. login, IP, device, user_agent, success, timestamp); ready for SSO/middleware to write logs.

### Deployment and docs
- **README** – Virtual env (macOS/Linux), run commands, env vars, API overview, migrations.
- **DEPLOYMENT_LINUX.md** – Full Linux deployment: install PostgreSQL (Ubuntu/Debian, RHEL/Fedora), create DB and user, Python/venv, app deploy, migrations, systemd, Nginx, troubleshooting.
- **Deployment (macOS)** – In README: run with uvicorn, optional launchd/tmux.
- **Run command** – `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` documented for dev.

---

## 3. Integration and configuration

- **Frontend API client** – `getApiBaseUrl()`, `apiFetch<T>(path, options)` in `frontend/app/lib/api.ts`; base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`), path under `/api/v1`.
- **Env** – Root `.env.example` documents frontend and server vars; `NEXT_PUBLIC_USE_MOCK_DATA` for mock; server `DATABASE_URL` for PostgreSQL.

---

## 4. Delivered scope (summary)

| Area | Delivered |
|------|-----------|
| **UI/UX** | Login, dashboard, full shell, primary #03045e, light/dark, mobile-responsive, Heroicons |
| **Projects** | CRUD, program dropdown, filters (popup), quick insights, add review, validation, soft delete |
| **Programs** | CRUD, add review, quick insights, filter (popup), validation, soft delete |
| **Applications** | CRUD, quick insights, soft delete |
| **Beneficiaries** | CRUD, quick insights, soft delete, nav after Applications |
| **Backend** | FastAPI, PostgreSQL, Alembic, CRUD + soft delete for above; program_classifications; user_log; root message |
| **Mock mode** | Frontend works without backend when `NEXT_PUBLIC_USE_MOCK_DATA=true` |
| **Docs** | Root + server README, DEPLOYMENT_LINUX (incl. PostgreSQL install), .env.example |

---