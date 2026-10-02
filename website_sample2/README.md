# Dew Day Trading & Projects

This project is the Dew Day Trading & Projects Django website, configured for Cloudflare Workers Containers.

## What the app does

- Displays company information, services, projects, compliance details, and entertainment offerings
- Provides a quotation request form for prospective clients
- Sends form submissions to the configured contact inbox
- Serves static assets through WhiteNoise
- Runs without a database and uses environment-based production secrets

## Project structure

- `dewday/` – Django project settings and routing
- `main/` – app logic, templates, views, static assets, and tests
- `requirements.txt` – Python dependencies
- `startup.sh` – starts the Django application server
- `.env.example` – local and production environment variable template
- `wrangler.jsonc` and `src/index.ts` – Cloudflare Worker and Container configuration
- `scripts/deploy.py` – validates `.env`, uploads its values as Worker secrets, and deploys

## Run the app locally

### 1. Create and activate a virtual environment

```bash
cd /workspaces/clients-website/website_sample2
python -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the development server

```bash
DEBUG=True python manage.py runserver 0.0.0.0:8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Test the app

```bash
DEBUG=True python manage.py test
```

## How the quotation form works

The form submits a JSON payload to the `/send-quotation` endpoint. The server validates the input and sends the enquiry to the contact inbox configured in the environment variable `CONTACT_EMAIL`.

By default, the app is set to use:

```text
dewdaytrading@gmail.com
```

## Environment variables

Production values are read from `.env`. This site does not store submissions or use a database; the form sends them directly by email. Generate a key with `python -c "import secrets; print(secrets.token_urlsafe(64))"`, then set `DEBUG=False`, that `SECRET_KEY`, exact `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`, and SMTP account details. For Gmail, use an App Password rather than the account password. `npm run deploy` uploads the `.env` values as Worker secrets without printing or committing them.

Set the deployed `dewday.<your-subdomain>.workers.dev` hostname in `ALLOWED_HOSTS` and `https://dewday.<your-subdomain>.workers.dev` in `CSRF_TRUSTED_ORIGINS` inside `.env`. Add any custom HTTPS domain there too. `CONTACT_EMAIL` is the inbox that receives quote requests. `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` are your SMTP login and app password.

## Cloudflare deployment

Cloudflare Pages alone cannot run Django. This deployment uses Cloudflare Workers Containers and a Durable Object to proxy requests to the Django container. No PostgreSQL or D1 database is required for this email-only form.

```bash
npm install
npx wrangler login
```

Edit `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` in `wrangler.jsonc` to include the exact `workers.dev` hostname and any custom HTTPS hostname you will use. Update `CONTACT_EMAIL` if quote requests should go to a different inbox. These are configuration values, not secrets.

```bash
npm run build
npm run deploy
```

Wrangler builds the Docker image and deploys the Worker and container. Open the URL printed by Wrangler after deployment.

For local container development, run `npm run dev`; Docker must be installed and running. Set `DEBUG=True` for local Django tests:

```bash
SECRET_KEY=local-test-key DEBUG=True python manage.py test
```
