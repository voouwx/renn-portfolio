"""
Local development settings — SQLite, DEBUG enabled.
"""

from decouple import config

from .base import *  # noqa: F403

DEBUG = config('DEBUG', default=True, cast=bool)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',  # noqa: F405
    }
}
