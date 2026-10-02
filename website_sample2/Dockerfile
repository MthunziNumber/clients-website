FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py startup.sh ./
COPY dewday ./dewday
COPY main ./main

RUN SECRET_KEY=build-only-key-not-used-at-runtime \
	ALLOWED_HOSTS=localhost \
	CSRF_TRUSTED_ORIGINS=https://localhost \
	CONTACT_EMAIL=build@example.com \
	DEFAULT_FROM_EMAIL=build@example.com \
	EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend \
	EMAIL_HOST=smtp.gmail.com \
	EMAIL_PORT=587 \
	EMAIL_USE_TLS=True \
	EMAIL_USE_SSL=False \
	EMAIL_HOST_USER=build \
	EMAIL_HOST_PASSWORD=build \
	python manage.py collectstatic --noinput

ENV DEBUG=False

EXPOSE 8000

CMD ["./startup.sh"]
