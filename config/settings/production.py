"""
Production settings — PostgreSQL via DATABASE_URL, Render deployment, security hardening.
"""

import os

import dj_database_url
from decouple import Csv, config

from .base import *  # noqa: F403

DEBUG = config('DEBUG', default=False, cast=bool)

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL') or config('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=True,
    ),
}

# Manifest storage raises 500 if collectstatic missed a file — too fragile for PaaS deploy
STORAGES['staticfiles']['BACKEND'] = 'whitenoise.storage.CompressedStaticFilesStorage'  # noqa: F405

ALLOWED_HOSTS = list(ALLOWED_HOSTS)

# Render injects RENDER_EXTERNAL_HOSTNAME when public URL is enabled
render_hostname = config('RENDER_EXTERNAL_HOSTNAME', default='')
if render_hostname and render_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_hostname)

# Custom domain — set SITE_DOMAIN in Render dashboard
site_domain = config('SITE_DOMAIN', default='').strip().lower()
domain_hosts: list[str] = []
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
if render_hostname:
    csrf_origins.append(f'https://{render_hostname}')
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
