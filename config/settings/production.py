"""
Production settings — PostgreSQL via DATABASE_URL, Railway deployment, security hardening.
"""

from urllib.parse import urlparse

from decouple import Csv, config

from .base import *  # noqa: F403

DEBUG = config('DEBUG', default=False, cast=bool)

database_url = config('DATABASE_URL')
parsed = urlparse(database_url)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': parsed.path.lstrip('/'),
        'USER': parsed.username,
        'PASSWORD': parsed.password,
        'HOST': parsed.hostname,
        'PORT': parsed.port or 5432,
    }
}

# Railway injects RAILWAY_PUBLIC_DOMAIN when public networking is enabled
ALLOWED_HOSTS = list(ALLOWED_HOSTS)
railway_domain = config('RAILWAY_PUBLIC_DOMAIN', default='')
if railway_domain:
    ALLOWED_HOSTS.append(railway_domain)

csrf_origins = list(config('CSRF_TRUSTED_ORIGINS', default='', cast=Csv()))
if railway_domain:
    csrf_origins.append(f'https://{railway_domain}')
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
