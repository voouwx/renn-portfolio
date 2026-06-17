"""
Production settings — PostgreSQL via DATABASE_URL, Railway deployment, security hardening.
"""

from urllib.parse import parse_qs, urlparse

from decouple import Csv, config

from .base import *  # noqa: F403

DEBUG = config('DEBUG', default=False, cast=bool)

database_url = config('DATABASE_URL')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

parsed = urlparse(database_url)
query_params = parse_qs(parsed.query)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': parsed.path.lstrip('/'),
        'USER': parsed.username,
        'PASSWORD': parsed.password,
        'HOST': parsed.hostname,
        'PORT': parsed.port or 5432,
        'OPTIONS': {
            'sslmode': query_params.get('sslmode', ['require'])[0],
        },
    }
}

# Manifest storage raises 500 if collectstatic missed a file — too fragile for PaaS deploy
STORAGES['staticfiles']['BACKEND'] = 'whitenoise.storage.CompressedStaticFilesStorage'  # noqa: F405

# Railway injects RAILWAY_PUBLIC_DOMAIN when public networking is enabled
ALLOWED_HOSTS = list(ALLOWED_HOSTS)
railway_domain = config('RAILWAY_PUBLIC_DOMAIN', default='')
if railway_domain:
    ALLOWED_HOSTS.append(railway_domain)

# Custom domain — set SITE_DOMAIN di dashboard (Render, Railway, dll.)
site_domain = config('SITE_DOMAIN', default='').strip().lower()
if site_domain:
    domain_hosts = [site_domain]
    if site_domain.startswith('www.'):
        domain_hosts.append(site_domain.removeprefix('www.'))
    else:
        domain_hosts.append(f'www.{site_domain}')

    for host in domain_hosts:
        if host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(host)

csrf_origins = list(config('CSRF_TRUSTED_ORIGINS', default='', cast=Csv()))
if railway_domain:
    csrf_origins.append(f'https://{railway_domain}')
if site_domain:
    for host in domain_hosts:
        origin = f'https://{host}'
        if origin not in csrf_origins:
            csrf_origins.append(origin)
CSRF_TRUSTED_ORIGINS = csrf_origins

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}
