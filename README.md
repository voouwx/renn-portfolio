# Renn Portfolio

Personal developer portfolio built with **Django 5** — showcasing projects, skills, experience, blog posts, and a contact form with real-time validation.

**Live:** _Coming soon on Railway_  
**Author:** [voouwx](https://github.com/voouwx)

---

## Features

- **One-page homepage** with hero, about, skills, experience, projects, blog preview, and contact
- **Dynamic content** managed via Django Admin (projects, blog, skills, experience)
- **Dark minimal UI** — JetBrains Mono + Inter, cyan accent, cosmic hero background
- **Typewriter effect** on focus areas (`// Data Science`, `AI Security`, …)
- **Scroll animations** — counter stats, skill bars, staggered cards, depth zoom blog items
- **Contact form** — dual-layer validation (JavaScript + Django Forms) with email notification
- **Mobile responsive** navbar with hamburger menu

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5.x, Python 3.12 |
| Database | PostgreSQL (production) / SQLite (local) |
| Static files | WhiteNoise |
| Server | Gunicorn |
| Deploy | Railway |
| Frontend | Vanilla CSS + JavaScript (no framework) |

---

## Local Setup

### Prerequisites

- Python 3.11+
- Git

### Installation

```bash
git clone https://github.com/voouwx/renn_portofolio.git
cd renn_portofolio

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env — set SECRET_KEY at minimum
```

### Database & run

```bash
python manage.py migrate --settings=config.settings.local
python manage.py createsuperuser --settings=config.settings.local
python manage.py runserver --settings=config.settings.local
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000)  
Admin panel: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## Project Structure

```
renn_portofolio/
├── apps/
│   ├── portfolio/    # Projects, skills, experience
│   ├── blog/         # Blog posts
│   └── contact/      # Contact form
├── config/settings/  # base, local, production
├── templates/        # Django templates
├── static/           # CSS, JS, images
├── railway.toml      # Railway deploy config
└── start.sh          # Production start script
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full list.

| Variable | Local | Production |
|----------|-------|------------|
| `SECRET_KEY` | Required | Required (Railway dashboard) |
| `DEBUG` | `True` | `False` |
| `DATABASE_URL` | SQLite (default) | PostgreSQL (Railway plugin) |
| `DJANGO_SETTINGS_MODULE` | `config.settings.local` | `config.settings.production` |

---

## Deploy

This project is configured for **[Railway](https://railway.app)**:

1. Connect GitHub repository to Railway
2. Add **PostgreSQL** plugin
3. Set environment variables (see `.env.example`)
4. Push to `main` — auto-deploy via `start.sh`

Production flow: `migrate` → `collectstatic` → `gunicorn`

---

## Development Notes

- Settings split: `config/settings/local.py` (dev) / `production.py` (Railway)
- Static files use `{% static %}` — never hardcode paths
- Fat models, thin views — business logic in `models.py`
- Run checks before deploy:

```bash
python manage.py check --deploy --settings=config.settings.production
```

---

## License

Personal portfolio — all rights reserved.

---

Built with Django · Deployed on Railway
