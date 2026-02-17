# LIS 2026 – Lot Information System

A production-grade **Lot Information System** tailored for Philippine-based deployment. The system is built for government or enterprise use with an emphasis on clarity, auditability, and long-term maintainability.

## Tech stack

| Layer      | Technology |
| ---------- | ---------- |
| Frontend   | Next.js 14+ (App Router), Tailwind CSS, Heroicons |
| Backend    | FastAPI (Python 3.11+), SQLAlchemy 2.x |
| Database   | PostgreSQL |
| Migrations | Alembic |

## Repository layout

```
nha-lis/
├── frontend/     # Next.js web app (UI, dashboard, modules)
├── server/       # FastAPI API, models, migrations
├── .env.example  # Environment variable templates
└── README.md     # This file
```

- **frontend/** – Next.js app with dashboard, login, Projects, Applications, and other modules. See [frontend/README.md](frontend/README.md) for Next.js-specific notes.
- **server/** – FastAPI backend, PostgreSQL connection, Alembic migrations, and REST API. See [server/README.md](server/README.md) for setup and API details.

## Prerequisites

- **Node.js** 18+ and **npm** (for frontend)
- **Python** 3.11+ (for server)
- **PostgreSQL** with a database (e.g. `nha-dev` on `localhost:5432`)

## Quick start

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works with mock/session-based flow without the backend; integrate the API when ready.

### 2. Backend (API + database)

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Set DATABASE_URL for your PostgreSQL (e.g. nha-dev)
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API base: [http://localhost:8000](http://localhost:8000)
- OpenAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Run both

Run the server in one terminal and the frontend in another. The frontend is configured for CORS with `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env` (or `.env.local` in frontend) and set:

- **Frontend:** `NEXT_PUBLIC_APP_URL`, `API_URL` (when integrating the API).
- **Server:** `DATABASE_URL` (e.g. `postgresql://user:password@localhost:5432/nha-dev`).
- **SSO:** Optional; LIS is designed to consume an external login API when available.

See [server/.env.example](server/.env.example) for the server-specific template.

## Core modules (UI)

The application includes (or placeholders for):

- **Dashboard** – Summary stats (applications, beneficiaries, lots, projects).
- **Applications** – Lot applications (backend API available).
- **Projects** – Housing/resettlement projects (CRUD UI; backend table + migration).
- **Programs** – Programs linked to projects.
- **Lot Management** – Lots with optional map view (Mapbox).
- **Landholdings Inventory** – Landholdings.
- **CIIM** – Commercial, Institutional, Industrial, Mixed-Use units.
- **Lot Award Documentation** – Award documents and history.
- **Reports** – Report generation.
- **Settings** – Theme (light/dark), locale placeholder.

## Design

- **Primary color:** `#03045e` (light mode); adjusted for dark mode.
- **UI:** Clean, minimal gradients; subtle borders and shadows; full light/dark support.
- **Layout:** Header (search, user, theme, logout), collapsible sidebar, footer (Privacy, Terms, Copyright). Mobile: burger menu.

## Database (server)

Migrations live in `server/alembic/versions/`. Main tables include:

- `applications` – Lot applications
- `user_log` – User activity / login audit
- `beneficiaries`, `co_owners`, `employment_profiles`, `properties` – Supporting data
- `projects` – Housing/resettlement projects

Apply migrations from the `server` directory with the venv active:

```bash
alembic upgrade head
```

## License

Proprietary – NHA LIS 2026.
