#!/usr/bin/env bash
set -o errexit

python manage.py migrate --noinput --settings=config.settings.production
python manage.py collectstatic --noinput --settings=config.settings.production
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
