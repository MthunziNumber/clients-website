# Dew Day Trading & Projects

A Django website for Dew Day Trading & Projects with a polished landing page, a quotation form, and deployment-ready configuration.

## Preview the website locally

Run the following from the project root:

```bash
cd /workspaces/clients-website/website_sample2
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Test the website

```bash
python manage.py test
```

## Form submission

The quotation form sends submissions to the configured contact inbox, which is set to:

```text
dewdaytrading@gmail.com
```

## Deployment notes

- The project uses environment-based settings for production readiness.
- Static files are collected and served with WhiteNoise.
- Azure App Service deployment assets are included in the repository.
