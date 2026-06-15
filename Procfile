release: python manage.py migrate --noinput --settings=config.settings.production && python manage.py collectstatic --noinput --settings=config.settings.production
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
