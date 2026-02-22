# LIS Server – Linux Deployment Guide

This guide walks through deploying the LIS FastAPI backend on a Linux server, including **installing and configuring PostgreSQL**, then running the API.

---

## Table of contents

- [Overview](#overview)
- [1. Install PostgreSQL](#1-install-postgresql)
- [2. Create database and user](#2-create-database-and-user)
- [3. Install Python and system dependencies](#3-install-python-and-system-dependencies)
- [4. Deploy the application](#4-deploy-the-application)
- [5. Configure environment](#5-configure-environment)
- [6. Run migrations](#6-run-migrations)
- [7. Run the API (production)](#7-run-the-api-production)
- [8. Run as a systemd service](#8-run-as-a-systemd-service)
- [9. Reverse proxy (Nginx)](#9-reverse-proxy-nginx)
- [Troubleshooting](#troubleshooting)

---

## Overview

| Component   | Recommendation        |
| ----------- | ---------------------- |
| OS          | Ubuntu 22.04 LTS / Debian 12 (or similar) |
| Python      | 3.11+                  |
| Database    | PostgreSQL 14+         |
| App path    | `/opt/lis/server` (adjust as needed) |

---

## 1. Install PostgreSQL

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

Start and enable the service:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Check status:

```bash
sudo systemctl status postgresql
```

### RHEL / Rocky Linux / AlmaLinux / CentOS (dnf)

```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Fedora

```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Verify installation

```bash
sudo -u postgres psql -c "SELECT version();"
```

You should see the PostgreSQL version string.

---

## 2. Create database and user

Create a dedicated database and user for the LIS application (replace `lisuser` and `your_secure_password` and `nha_lis` with your values).

**Option A: Using `psql` as the `postgres` user**

```bash
sudo -u postgres psql
```

In the `psql` prompt:

```sql
-- Create role (user) with login and password
CREATE ROLE lisuser WITH LOGIN PASSWORD 'your_secure_password';

-- Create database (owner optional; we'll grant privileges)
CREATE DATABASE nha_lis OWNER lisuser;

-- Grant full privileges on the database
GRANT ALL PRIVILEGES ON DATABASE nha_lis TO lisuser;

-- Connect to the database and grant schema privileges (PostgreSQL 15+)
\c nha_lis

-- Allow lisuser to create objects and use the public schema
GRANT ALL ON SCHEMA public TO lisuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lisuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lisuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lisuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lisuser;

\q
```

**Option B: One-liner from shell (Ubuntu/Debian)**

```bash
sudo -u postgres psql -c "CREATE ROLE lisuser WITH LOGIN PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE nha_lis OWNER lisuser;"
sudo -u postgres psql -d nha_lis -c "GRANT ALL ON SCHEMA public TO lisuser;"
```

**Connection string for LIS**

Use this in your `.env` (replace host if PostgreSQL is on another machine):

```text
DATABASE_URL=postgresql://lisuser:your_secure_password@localhost:5432/nha_lis
```

If PostgreSQL is on the same server as the app, `localhost` is correct. If the database is on a different host, use that hostname or IP and ensure `pg_hba.conf` allows the connection (see [Troubleshooting](#troubleshooting)).

---

## 3. Install Python and system dependencies

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip git
```

### RHEL / Rocky / Alma / CentOS / Fedora

```bash
sudo dnf install -y python3.11 python3.11-pip git
# Or enable CodeReady Builder / EPEL if needed for python3.11
```

Ensure `python3.11 --version` works. Adjust the version (e.g. `python3.12`) if your distro provides a different one.

---

## 4. Deploy the application

**Option A: Clone from Git**

```bash
sudo mkdir -p /opt/lis
sudo git clone https://github.com/your-org/nha-lis.git /opt/lis/repo
sudo cp -r /opt/lis/repo/server /opt/lis/server
# Or symlink: sudo ln -s /opt/lis/repo/server /opt/lis/server
```

**Option B: Copy from your machine**

From your dev machine (replace `user@your-server` and path):

```bash
scp -r /path/to/nha-lis/server user@your-server:/opt/lis/
```

Then on the server:

```bash
sudo mkdir -p /opt/lis
sudo mv /opt/lis/server /opt/lis/server  # if needed
```

**Set ownership (recommended: dedicated user)**

```bash
sudo useradd -r -s /bin/false lisapp 2>/dev/null || true
sudo mkdir -p /opt/lis/server
sudo chown -R lisapp:lisapp /opt/lis/server
```

---

## 5. Configure environment

```bash
cd /opt/lis/server
sudo -u lisapp cp .env.example .env
sudo -u lisapp nano .env   # or use vi; edit as root then chown to lisapp
```

Set at least:

```env
DATABASE_URL=postgresql://lisuser:your_secure_password@localhost:5432/nha_lis
```

Optional:

```env
API_HOST=0.0.0.0
PORT=8000
```

Ensure only the app user can read `.env` (it contains secrets):

```bash
sudo chmod 600 /opt/lis/server/.env
sudo chown lisapp:lisapp /opt/lis/server/.env
```

---

## 6. Run migrations

Run migrations as the app user (or as your deploy user if you prefer; the DB user in `DATABASE_URL` must have rights to create tables).

```bash
cd /opt/lis/server
sudo -u lisapp /opt/lis/server/.venv/bin/python -m alembic upgrade head
```

If the virtual environment does not exist yet (first-time deploy):

```bash
cd /opt/lis/server
sudo -u lisapp python3.11 -m venv .venv
sudo -u lisapp .venv/bin/pip install -r requirements.txt
sudo -u lisapp .venv/bin/alembic upgrade head
```

This creates or updates all tables (applications, beneficiaries, projects, programs, etc.) in `nha_lis`.

---

## 7. Run the API (production)

Do **not** use `--reload` in production. Use multiple workers for better throughput:

```bash
cd /opt/lis/server
sudo -u lisapp .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

- API root: `http://<server-ip>:8000`
- Docs: `http://<server-ip>:8000/docs`
- Health: `http://<server-ip>:8000/health`

Stop with `Ctrl+C`. For a permanent setup, use systemd (next section).

---

## 8. Run as a systemd service

Create the service file:

```bash
sudo nano /etc/systemd/system/lis-api.service
```

Paste (adjust paths and user if needed):

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

If your Uvicorn does not support `Type=notify`, change to `Type=simple`.

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable lis-api
sudo systemctl start lis-api
sudo systemctl status lis-api
```

Useful commands:

```bash
sudo systemctl stop lis-api
sudo systemctl restart lis-api
sudo journalctl -u lis-api -f
```

---

## 9. Reverse proxy (Nginx)

To serve the API over HTTPS and hide the app port, use Nginx (or Apache) as a reverse proxy.

**Install Nginx (Ubuntu/Debian)**

```bash
sudo apt install -y nginx
```

**Example site config** (`/etc/nginx/sites-available/lis-api`):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/lis-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Add TLS with Let’s Encrypt (optional):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Troubleshooting

### PostgreSQL: connection refused

- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- If the app is on another host, allow remote connections in `postgresql.conf` (`listen_addresses`) and in `pg_hba.conf` (add a line for your app server’s IP and the `lisuser` role), then restart PostgreSQL.

### Permission denied for schema public

- Connect to the DB and run (as a superuser):  
  `GRANT ALL ON SCHEMA public TO lisuser;`  
  and (for PostgreSQL 15+):  
  `GRANT CREATE ON SCHEMA public TO lisuser;`

### Alembic: “can’t locate revision”

- Ensure you’re in `/opt/lis/server` and the `alembic/versions` folder is present.
- Run `alembic current`; if the DB is empty, `alembic upgrade head` should apply all revisions.

### API returns 502 Bad Gateway (Nginx)

- Check that Uvicorn is listening on `127.0.0.1:8000`:  
  `curl http://127.0.0.1:8000/health`
- Check `sudo journalctl -u lis-api -n 50` for errors.

### CORS errors from the frontend

- In `app/main.py`, add your frontend origin to the CORS middleware `allow_origins` list (e.g. `https://yourdomain.com`).

---

## Summary checklist

- [ ] PostgreSQL installed and running
- [ ] Database `nha_lis` and user `lisuser` created; privileges granted
- [ ] Python 3.11+ and venv set up under `/opt/lis/server`
- [ ] `pip install -r requirements.txt` and `.env` with `DATABASE_URL` configured
- [ ] `alembic upgrade head` run successfully
- [ ] API runs with `uvicorn` (no `--reload`), or via systemd
- [ ] (Optional) Nginx reverse proxy and TLS in front of the API
- [ ] CORS updated in `app/main.py` for the production frontend origin

For a shorter reference, see the main [README.md](README.md) (Development setup, Running the server, Deployment sections).
