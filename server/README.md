# LIS Server (FastAPI)

Backend API for the **Lot Information System (LIS)**. Provides REST endpoints for applications, beneficiaries, projects, programs, and related data. Built with FastAPI, SQLAlchemy, and PostgreSQL.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project layout](#project-layout)
- [Development setup](#development-setup)
- [Environment variables](#environment-variables)
- [Running the server](#running-the-server)
- [API overview](#api-overview)
- [Migrations](#migrations)
- [Deployment (Linux)](#deployment-linux) — see also [DEPLOYMENT_LINUX.md](DEPLOYMENT_LINUX.md) (full guide with PostgreSQL install)
- [Deployment (macOS)](#deployment-macos)

---

## Tech stack

| Component   | Technology        |
| ----------- | ------------------ |
| Framework   | FastAPI            |
| Python      | 3.11+ (or 3.10)    |
| ORM         | SQLAlchemy 2.x     |
| Database    | PostgreSQL         |
| Migrations  | Alembic            |
| ASGI server | Uvicorn            |

---

## Prerequisites

- **Python** 3.11+ (or 3.10)
- **PostgreSQL** with a database (e.g. `nha-dev` on `localhost:5432`)
- **pip** (or another Python package manager)

---

## Project layout

```
server/
├── app/
│   ├── main.py          # FastAPI app, CORS, routes
│   ├── config.py        # Settings (DATABASE_URL, etc.)
│   ├── database.py     # SQLAlchemy engine/session
│   ├── api/v1/          # API routers (applications, beneficiaries, projects, …)
│   ├── models/         # SQLAlchemy models
│   └── schemas/        # Pydantic request/response schemas
├── alembic/
│   ├── versions/       # Migration scripts
│   └── env.py
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md           # This file
```

---

## Development setup

**1. Clone or enter the repo and go to the server directory**

```bash
cd /path/to/nha-lis/server
```

**2. Create and activate a virtual environment**

- **Linux / macOS:**

  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

- **Windows:**

  ```bash
  python -m venv .venv
  .venv\Scripts\activate
  ```

Your prompt should show `(.venv)` when the environment is active.

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure environment**

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL (see [Environment variables](#environment-variables))
```

**5. Run migrations**

```bash
alembic upgrade head
```

This creates/updates tables: `applications`, `user_log`, `beneficiaries`, `co_owners`, `employment_profiles`, `properties`, `projects`, `programs`, `program_classifications`, and adds `deleted_at` where used for soft delete.

---

## Environment variables

| Variable       | Required | Description |
|----------------|----------|-------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/nha-dev` |
| `API_HOST`     | No       | Bind host (default `0.0.0.0`) |
| `PORT`         | No       | Port (default `8000`) |

Example `.env`:

```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/nha-dev
# Optional:
# API_HOST=0.0.0.0
# PORT=8000
```

---

## Running the server

From the `server` directory with the virtual environment activated:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **API root:** http://localhost:8000  
- **OpenAPI docs:** http://localhost:8000/docs  
- **ReDoc:** http://localhost:8000/redoc  
- **Health:** http://localhost:8000/health  

Use `--reload` only in development. For production, see [Deployment (Linux)](#deployment-linux) and [Deployment (macOS)](#deployment-macos).

---

## API overview

All endpoints are under `/api/v1`. List endpoints support `skip` and `limit` query parameters. Full request/response schemas are at http://localhost:8000/docs.

| Resource               | Endpoints |
|------------------------|-----------|
| **Applications**       | `GET/POST /applications`, `GET/PUT/DELETE /applications/{app_id}` (UUID) |
| **Beneficiaries**      | `GET/POST /beneficiaries`, `GET/PUT/DELETE /beneficiaries/{id}` |
| **Co-owners**          | `GET/POST /co-owners`, `GET/PUT/DELETE /co-owners/{id}` |
| **Employment profiles**| `GET/POST /employment-profiles`, `GET/PUT/DELETE /employment-profiles/{id}` |
| **Program classifications** | `GET/POST /program-classifications`, `GET/PUT/DELETE /program-classifications/{program_class}` |
| **Programs**            | `GET/POST /programs`, `GET/PUT/DELETE /programs/{project_prog_id}` |
| **Projects**            | `GET/POST /projects`, `GET/PUT/DELETE /projects/{project_code}` — list supports `project_code`, `project_name`, `region_code`, `province_code`, `lot_type`, `project_prog_id` |
| **Properties**          | `GET/POST /properties`, `GET/PUT/DELETE /properties/{geoid}` |

Projects, programs, applications, and beneficiaries use **soft delete** (DELETE sets `deleted_at`; list/get exclude soft-deleted rows).

---

## Migrations

- **Apply all pending migrations:**  
  `alembic upgrade head`

- **Create a new revision:**  
  `alembic revision -m "description"`  
  Then edit the new file in `alembic/versions/`.

- **Rollback one revision:**  
  `alembic downgrade -1`

- **Show current revision:**  
  `alembic current`

---

## Deployment (Linux)

For a **full step-by-step guide** including **PostgreSQL installation** on Ubuntu/Debian and RHEL-family distros, database creation, systemd, and Nginx, see **[DEPLOYMENT_LINUX.md](DEPLOYMENT_LINUX.md)**.

Summary below assumes a Linux server (e.g. Ubuntu/Debian) with Python 3.11+, PostgreSQL already installed, and the app code under `/opt/lis/server` (adjust paths as needed).

**1. Install system dependencies (if needed)**

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-client
```

**2. Start and enable PostgreSQL**

After installing PostgreSQL, start the service and enable it to run at boot:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Check that it is running:

```bash
sudo systemctl status postgresql
```

You should see `active (running)`. To create a database and user for the LIS app, see **[DEPLOYMENT_LINUX.md](DEPLOYMENT_LINUX.md)** (section “Create database and user”).

**3. Create app user and directory (optional but recommended)**

```bash
sudo useradd -r -s /bin/false lisapp
sudo mkdir -p /opt/lis/server
sudo chown lisapp:lisapp /opt/lis/server
```

**4. Deploy code**

Deploy via **GitHub** (recommended): you do **not** need `git init` — use **`git clone`** to get the repository onto the server.

- **First-time deploy:** clone the repo, then use the `server` directory as your app directory.

  ```bash
  # If /opt/lis doesn't exist: sudo mkdir -p /opt/lis
  cd /opt/lis
  git clone https://github.com/YOUR_ORG/nha-lis.git
  # App code is in nha-lis/server; use that path for the steps below
  cd nha-lis/server
  ```

  Replace `YOUR_ORG/nha-lis` with your actual GitHub org/repo (and use SSH if you prefer, e.g. `git@github.com:YOUR_ORG/nha-lis.git`). If the server directory is not at `server/` in the repo, adjust the path. In the steps below, use `/opt/lis/nha-lis/server` as the app directory (or `/opt/lis/server` if you copy only the `server` folder there). If you created the `lisapp` user (step 2), give it ownership of the clone: `sudo chown -R lisapp:lisapp /opt/lis/nha-lis`.

- **Later updates:** pull the latest code, then restart the app.

  ```bash
  cd /opt/lis/nha-lis
  git pull
  cd server
  # Reinstall deps if requirements changed, re-run migrations, then restart the service
  source .venv/bin/activate
  pip install -r requirements.txt
  alembic upgrade head
  sudo systemctl restart lis-api
  ```

Alternatively, copy the app files manually into `/opt/lis/server` (e.g. via rsync or an archive).

**5. Create virtual environment and install dependencies**

```bash
cd /opt/lis/server   # or /opt/lis/nha-lis/server if you deployed via git clone
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**6. Configure environment**

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL to your production PostgreSQL (host, user, password, dbname)
nano .env
```

**7. Run migrations**

```bash
source .venv/bin/activate
alembic upgrade head
```

**8. Run with Uvicorn (production: no `--reload`, optional workers)**

```bash
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

**9. Run as a systemd service (recommended)**

Create `/etc/systemd/system/lis-api.service`:

```ini
[Unit]
Description=LIS FastAPI server
After=network.target postgresql.service

[Service]
Type=notify
User=lisapp
Group=lisapp
WorkingDirectory=/opt/lis/server
Environment="PATH=/opt/lis/server/.venv/bin"
ExecStart=/opt/lis/server/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable lis-api
sudo systemctl start lis-api
sudo systemctl status lis-api
```

**10. Put a reverse proxy in front (e.g. Nginx)** for TLS and to forward to `http://127.0.0.1:8000`. Example Nginx location:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Production checklist (Linux)**

- Set `DATABASE_URL` to the production database.
- Do **not** use `--reload`.
- Use `--workers 2` (or more) if the app is stateless.
- Run as a dedicated user (e.g. `lisapp`).
- Use systemd (or similar) for restarts and logging.
- Use a reverse proxy (Nginx/Apache) for HTTPS and to hide the app port.
- Update CORS in `app/main.py` if the frontend is served from a different origin.

---

## Deployment (macOS)

On macOS you can run the API in the foreground, in a terminal multiplexer, or as a launchd service.

**1. Install Python and PostgreSQL** (e.g. via Homebrew)

```bash
brew install python@3.11 postgresql
```

**2. Clone/copy the app and set up the server** (same as development: venv, `pip install -r requirements.txt`, `.env`, `alembic upgrade head`).

**3. Run in production mode (no reload)**

```bash
cd /path/to/nha-lis/server
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

**4. Optional: keep running in the background with `tmux` or `screen`**

```bash
tmux new -s lis-api
cd /path/to/nha-lis/server
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
# Detach: Ctrl+B, then D. Reattach: tmux attach -t lis-api
```

**5. Optional: run as a launchd service (runs at boot, restarts on failure)**

Create `~/Library/LaunchAgents/com.nha.lis-api.plist` (adjust paths and user):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.nha.lis-api</string>
  <key>ProgramArguments</key>
  <array>
    <string>/path/to/nha-lis/server/.venv/bin/uvicorn</string>
    <string>app.main:app</string>
    <string>--host</string>
    <string>0.0.0.0</string>
    <string>--port</string>
    <string>8000</string>
    <string>--workers</string>
    <string>2</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/path/to/nha-lis/server</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/lis-api.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/lis-api.err.log</string>
</dict>
</plist>
```

Load and start:

```bash
launchctl load ~/Library/LaunchAgents/com.nha.lis-api.plist
launchctl start com.nha.lis-api
# Check: launchctl list | grep lis-api
# Stop: launchctl stop com.nha.lis-api
# Unload: launchctl unload ~/Library/LaunchAgents/com.nha.lis-api.plist
```

**Production checklist (macOS)**

- Set `DATABASE_URL` in `.env` to the production database.
- Do **not** use `--reload`; use `--workers 2` (or more) if appropriate.
- Use launchd (or tmux/screen) so the process survives logout.
- Put Nginx (or another reverse proxy) in front for HTTPS if the server is exposed.
- Update CORS in `app/main.py` for the real frontend origin.

---

## License

Proprietary – NHA LIS 2026.
