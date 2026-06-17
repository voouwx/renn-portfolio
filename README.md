# Voyager Portfolio

Personal developer portfolio — Django 5, dark cosmic UI, dynamic content via Admin.

**Author:** [voouwx](https://github.com/voouwx)

---

## Features

- One-page homepage: hero, about, skills, experience, projects, blog, contact me
- Dynamic content via Django Admin (PostgreSQL)
- Galaxy-themed UI — scroll animations, glitch counters, skill bars
- Mobile responsive navbar

---

## Quick start (local)

```bash
git clone https://github.com/voouwx/renn_portofolio.git
cd renn_portofolio
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate --settings=config.settings.local
python manage.py createsuperuser --settings=config.settings.local
python manage.py runserver --settings=config.settings.local
```

Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## Deploy

Production: **Render** (web) + **Neon** (PostgreSQL).

Set env vars di Render dashboard. Panduan deploy ada di `docs/DEPLOY.md` (file lokal, tidak di-repo).

---

## Tech stack

| Layer | Tech |
|-------|------|
| Backend | Django 5, Python 3.12 |
| DB | SQLite (local) / Neon PostgreSQL (prod) |
| Static | WhiteNoise |
| Server | Gunicorn |
| Frontend | Vanilla CSS + JS |

---

## Project structure

```
apps/portfolio/   → projects, skills, experience, /contact/ redirect
apps/blog/        → blog posts
config/settings/  → base, local, production
static/           → css, js, images/social/
templates/        → HTML templates
render.yaml       → Render deploy config
start.sh          → production start script
```

---

Built with Django · Deployed on Render + Neon
