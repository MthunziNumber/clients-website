#!/bin/sh
set -eu

exec gunicorn --bind "0.0.0.0:${PORT:-8000}" --workers 2 --timeout 60 dewday.wsgi:application
