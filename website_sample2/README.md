# Dew Day Trading & Projects

This project is a Django-based website for Dew Day Trading & Projects. It includes a polished landing page, service sections, a quotation request form, and deployment-ready settings for Azure App Service.

## What the app does

- Displays company information, services, projects, compliance details, and entertainment offerings
- Provides a quotation request form for prospective clients
- Sends form submissions to the configured contact inbox
- Supports local development and Azure deployment with environment-based settings

## Project structure

- `dewday/` – Django project settings and routing
- `main/` – app logic, templates, views, static assets, and tests
- `requirements.txt` – Python dependencies
- `startup.sh` – startup script for Azure App Service
- `azure.yaml` – deployment metadata

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

### 3. Run database migrations

```bash
python manage.py migrate
```

### 4. Start the development server

```bash
python manage.py runserver 0.0.0.0:8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Test the app

```bash
python manage.py test
```

## How the quotation form works

The form submits a JSON payload to the `/send-quotation` endpoint. The server validates the input and sends the enquiry to the contact inbox configured in the environment variable `CONTACT_EMAIL`.

By default, the app is set to use:

```text
dewdaytrading@gmail.com
```

## Environment variables

The app uses environment variables for deployment-friendly configuration.

Recommended variables:

```bash
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=127.0.0.1,localhost
CONTACT_EMAIL=dewdaytrading@gmail.com
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## Azure deployment steps

### 1. Sign in to Azure

```bash
az login
```

### 2. Create a resource group

```bash
az group create --name dewday-rg --location eastus
```

### 3. Create an App Service plan

```bash
az appservice plan create --name dewday-plan --resource-group dewday-rg --sku B1 --is-linux
```

### 4. Create the web app

```bash
az webapp create --resource-group dewday-rg --plan dewday-plan --name your-unique-app-name --runtime "PYTHON|3.12"
```

### 5. Configure app settings

```bash
az webapp config appsettings set \
  --resource-group dewday-rg \
  --name your-unique-app-name \
  --settings \
  SECRET_KEY="replace-with-a-strong-secret" \
  DEBUG="False" \
  ALLOWED_HOSTS="your-unique-app-name.azurewebsites.net,www.dewday.com" \
  CONTACT_EMAIL="dewdaytrading@gmail.com" \
  EMAIL_BACKEND="django.core.mail.backends.console.EmailBackend"
```

### 6. Deploy the code

```bash
cd /workspaces/clients-website/website_sample2
zip -r site.zip . -x ".git/*" ".venv/*" "__pycache__/*"
az webapp deploy --resource-group dewday-rg --name your-unique-app-name --src-path site.zip --type zip
```

### 7. Restart and browse

```bash
az webapp restart --resource-group dewday-rg --name your-unique-app-name
```

Then open:

```text
https://your-unique-app-name.azurewebsites.net
```

## Notes for production

- Use a strong secret key in production
- Use HTTPS and a custom domain for `www.dewday.com`
- For real email delivery, replace the console email backend with a real SMTP provider later
- Consider using PostgreSQL instead of SQLite for production workloads
