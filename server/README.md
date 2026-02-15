# LIS Server (FastAPI)

Backend API for the Lot Information System. Uses FastAPI, PostgreSQL, and Alembic.

## Prerequisites

- Python 3.11+ (or 3.10)
- PostgreSQL with database `nha-dev` (e.g. on `localhost:5432`)

## Virtual environment (Mac)

On macOS, create and use a venv from the `server` directory:

**Create the virtual environment:**

```bash
cd server
python3 -m venv .venv
```

**Activate it** (run this in the same terminal whenever you work on the server):

```bash
source .venv/bin/activate
```

Your prompt will show `(.venv)` when it’s active. All `pip` and `python` commands then use this environment.

**Deactivate when finished:**

```bash
deactivate
```

## Setup

1. **Create and activate the virtual environment** (see [Virtual environment (Mac)](#virtual-environment-mac) above):

   ```bash
   cd server
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   On Windows: `python -m venv .venv` then `.venv\Scripts\activate`

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:

   Copy `.env.example` to `.env` and set your database URL:

   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL=postgresql://user:password@localhost:5432/nha-dev
   ```

4. **Run migrations**:

   ```bash
   alembic upgrade head
   ```

   This creates the `applications` and `user_log` tables in `nha-dev`.

## Run the server

From the `server` directory with your virtual environment activated, run:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- OpenAPI docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

## API

- `GET /api/v1/applications` – list applications (query: `skip`, `limit`)
- `GET /api/v1/applications/{app_id}` – get one application
- `POST /api/v1/applications` – create application
- `PUT /api/v1/applications/{app_id}` – update application
- `DELETE /api/v1/applications/{app_id}` – delete application

## Migrations

- Create a new revision: `alembic revision -m "description"` (edit the new file in `alembic/versions/`).
- Apply migrations: `alembic upgrade head`
- Rollback one revision: `alembic downgrade -1`
