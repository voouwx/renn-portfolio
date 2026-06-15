# PROJECT_BRIEF.md — Renn Portfolio
# Versi: 3.0

> **Source of truth** untuk project ini. Update setiap ada keputusan signifikan.

---

## Overview

| Field | Value |
|---|---|
| **Project name** | Renn Portfolio |
| **GitHub handle** | `voouwx` |
| **Type** | Personal developer portfolio — web dinamis, publicly accessible |
| **Goal** | Komunikasikan identity: Data Science × AI Security × Edge AI/TinyML × MLOps |
| **Target audience** | Recruiter, fellow developer, kolaborator, komunitas tech |
| **Stack** | Django 5.x + PostgreSQL (Railway) + Railway Web Service |
| **Status** | 🟡 Planning → Phase 0 |

---

## Identity Statement

> *"Data Scientist yang nyaman di antara circuit dan cloud — dari microcontroller ESP32 sampai ML pipeline production."*

Background elektronika industri (SMK) + Data Science = perspektif hardware-to-software yang langka. Portfolio ini harus komunikasikan ini dalam **5 detik pertama**.

---

## Deployment: Railway

### Kenapa Railway (bukan Vercel/Render)?
| Aspek | Railway | Render |
|---|---|---|
| Django support | ✅ Native — persistent web service | ✅ Native |
| PostgreSQL | ✅ Plugin (DATABASE_URL otomatis) | ✅ Managed DB |
| Cold start | ✅ Tidak ada (persistent) | ⚠️ Free tier sleep after 15min |
| Static files | ✅ WhiteNoise langsung jalan | ✅ WhiteNoise |
| Setup effort | ✅ Low — Procfile + railway.toml | ✅ Low — render.yaml |
| Free tier | ✅ $5 credit/bulan | ✅ Ada (dengan sleep) |

**Catatan free tier Railway:** Railway memberikan $5 credit gratis per bulan. Portfolio Django kecil biasanya cukup — monitor usage di dashboard. Tidak ada sleep seperti Render free tier.

### Railway Setup Flow
```
1. Push repo ke GitHub (dengan railway.toml + Procfile)
2. Buat project baru di railway.app → Deploy from GitHub repo
3. Tambah PostgreSQL plugin ke project
4. Set environment variables di Railway dashboard
5. Generate public domain → Railway inject RAILWAY_PUBLIC_DOMAIN
6. Procfile release phase handle migrate + collectstatic otomatis
7. Auto-deploy setiap push ke branch main
```

---

## Design Direction

### Aesthetic
**Dark & Minimal — Developer Workspace Tone**

Obsidian backdrop dengan satu glow color. Intentional, bersih, setiap elemen punya alasan. Inspired by bricohen.com — tapi dengan identity Renn.

### Design Token

```
--bg-primary:    #0a0a0a    near-black background
--bg-secondary:  #111111    section backgrounds
--bg-card:       #161616    card depth

--text-primary:  #e8e8e8    off-white body text
--text-secondary:#888888    labels, metadata
--text-muted:    #444444    placeholder, disabled

--accent:        #00e5ff    precision cyan — satu-satunya warna hidup
--accent-dim:    #00e5ff18  glow overlay

--border:        #1e1e1e    subtle
--error:         #ff4d4d    form error
--success:       #00c896    form success

Font display/mono : JetBrains Mono
Font body         : Inter
```

### Signature Element
**Terminal typewriter di hero** — nama dan tagline muncul karakter per karakter, cursor berkedip. Satu-satunya "wow moment" — sisanya quiet.

---

## Site Map

```
/                     → Home (Hero + About + Skills)
/projects/            → Project list
/projects/<slug>/     → Project detail
/blog/                → Blog list
/blog/<slug>/         → Blog detail
/contact/             → Contact form
/admin/               → Django Admin
```

---

## Section Breakdown

### Hero
```
> _
> Renn_
> Data Scientist.
> AI Security. Edge AI. MLOps.

"From circuit boards to ML pipelines."

[View Projects]  [Read Blog]
```

### About
- 2-3 paragraf: background → current focus
- "Currently exploring:" (Local LLM, TinyML, MLSec)
- Link GitHub `voouwx`

### Skills — Dynamic (Django Admin)
Kategori: `ML/AI` · `MLOps` · `Edge AI/TinyML` · `Security` · `Languages` · `Tools`
Tampilan: tag/chip style

### Projects — Dynamic (Django Admin)
Card: title, tech tags, deskripsi singkat, link GitHub + live

### Blog — Dynamic (Django Admin)
List: title, tanggal, excerpt, reading time
Detail: Markdown → HTML

### Contact Form — Fitur Utama Dinamis

| Field | Required | Validasi |
|---|---|---|
| Nama | ✅ | min 2 karakter |
| Email | ✅ | format valid |
| No. HP | ❌ | format Indonesia: 08xx / +62xx |
| Subject | ✅ | min 5 karakter |
| Pesan | ✅ | min 20 karakter |

**Dua layer validasi:**
- Client-side: real-time saat mengetik, visual feedback per field, disable submit jika ada error
- Server-side: Django Forms `clean_*` methods, CSRF protection

**Notifikasi:** Email via `send_mail` + SMTP Gmail (Phase 1), WhatsApp Twilio (Phase 2)

---

## Models

```python
# apps/portfolio/models.py
class Skill(models.Model):
    name     = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    order    = models.IntegerField(default=0)

class Project(models.Model):
    title       = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True)
    description = models.TextField()
    tech_stack  = models.CharField(max_length=300)   # comma-separated
    github_url  = models.URLField(blank=True)
    live_url    = models.URLField(blank=True)
    image       = models.ImageField(upload_to='projects/', blank=True)
    is_featured = models.BooleanField(default=False)
    published   = models.BooleanField(default=True)
    created_at  = models.DateField()

# apps/blog/models.py
class BlogPost(models.Model):
    title      = models.CharField(max_length=200)
    slug       = models.SlugField(unique=True)
    body       = models.TextField()          # Markdown
    excerpt    = models.CharField(max_length=300, blank=True)
    published  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

## Environment Variables

```bash
# .env.example
SECRET_KEY=generate-with-python-secrets-token-hex
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (local)
DATABASE_URL=sqlite:///db.sqlite3

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
CONTACT_RECIPIENT_EMAIL=

# Production (set di Railway dashboard → Variables, bukan di file ini)
# DATABASE_URL=postgresql://...  → otomatis dari Railway PostgreSQL plugin
# DJANGO_SETTINGS_MODULE=config.settings.production
# DEBUG=False
# RAILWAY_PUBLIC_DOMAIN=...      → otomatis dari Railway
```

---

## Development Phases

### Phase 0 — Setup (1 hari)
- [ ] `django-admin startproject config .`
- [ ] Struktur `apps/` dan `config/settings/`
- [ ] `requirements.txt` (django, gunicorn, psycopg2-binary, whitenoise, python-decouple, Pillow)
- [ ] `.env`, `.env.example`, `.gitignore`
- [ ] `railway.toml` + `Procfile` + `build.sh`
- [ ] Init git + push ke GitHub
- [ ] Connect ke Railway, test deploy pertama (empty Django)

### Phase 1 — Foundation (2-3 hari)
- [ ] Models: `Skill`, `Project`, `BlogPost`
- [ ] Django Admin setup
- [ ] `base.html` + CSS variables
- [ ] Hero + typewriter effect
- [ ] About section
- [ ] Skills section (dynamic)

### Phase 2 — Dynamic Content (3-4 hari)
- [ ] Projects list + detail
- [ ] Blog list + detail (Markdown)
- [ ] Contact form + validasi dua layer
- [ ] Email notification

### Phase 3 — Polish & Deploy (2 hari)
- [ ] Responsive check (375px / 768px / 1280px)
- [ ] Railway PostgreSQL connection
- [ ] Environment variables di Railway dashboard
- [ ] Final deploy + smoke test

### Phase 4 — Post-Launch (opsional)
- [ ] WhatsApp notification (Twilio)
- [ ] GitHub API auto-sync projects
- [ ] Continue.dev + Ollama replace Cursor

---

## Reference

| Site | URL | Yang diadopsi |
|---|---|---|
| bricohen.com | https://bricohen.com | Obsidian bg + single glow color, strong identity di hero |
| — | — | Tambahkan referensi lain |

---

## Decisions Log

| Keputusan | Alasan |
|---|---|
| Deploy ke Railway | Django-native, PostgreSQL plugin, no sleep on free tier, $5 credit/bulan |
| Cursor sebagai AI assistant | Zero friction, free tier cukup |
| Vanilla CSS | Belajar CSS proper, kontrol penuh design system |
| Cyan `#00e5ff` sebagai accent | "Technical precision" feel, align dengan AI/tech identity |
| `apps/` subfolder | Lebih organized, mudah scale |
| Phone field opsional | Tidak semua orang nyaman share nomor HP |
| Markdown untuk blog | Portable, tidak lock-in ke rich text editor |
| `gunicorn` sebagai WSGI | Standard untuk Django production di Railway (bind ke $PORT) |
