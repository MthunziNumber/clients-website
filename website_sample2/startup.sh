#!/bin/bash
set -e
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn --bind=0.0.0.0 --timeout 600 dewday.wsgi
