"""
Local development settings — SQLite, DEBUG always on, simple static files.
"""

from .base import *  # noqa: F403

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',  # noqa: F405
    }
}

# Manifest storage needs collectstatic — skip for local dev
STORAGES['staticfiles']['BACKEND'] = (  # noqa: F405
    'django.contrib.staticfiles.storage.StaticFilesStorage'
)
