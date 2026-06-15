#!/usr/bin/env bash
set -o errexit

echo "==> Running migrations..."
python manage.py migrate --noinput --settings=config.settings.production

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --settings=config.settings.production

echo "==> Starting gunicorn..."
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
