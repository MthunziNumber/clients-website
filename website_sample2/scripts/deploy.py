import subprocess
import sys
from pathlib import Path

from dotenv import dotenv_values


PROJECT_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = PROJECT_DIR / '.env'
REQUIRED_VALUES = (
    'SECRET_KEY',
    'ALLOWED_HOSTS',
    'CSRF_TRUSTED_ORIGINS',
    'CONTACT_EMAIL',
    'DEFAULT_FROM_EMAIL',
    'EMAIL_BACKEND',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_HOST_USER',
    'EMAIL_USE_TLS',
    'EMAIL_USE_SSL',
    'EMAIL_HOST_PASSWORD',
)


def main():
    if not ENV_FILE.is_file():
        sys.exit('Missing .env. Copy .env.example to .env and configure production values.')

    values = dotenv_values(ENV_FILE)
    missing = [name for name in REQUIRED_VALUES if not (values.get(name) or '').strip()]
    if missing:
        sys.exit(f'Missing required .env values: {", ".join(missing)}')

    if (values.get('DEBUG') or '').strip().lower() not in {'false', '0', 'no', 'off'}:
        sys.exit('Set DEBUG=False in .env before deploying.')
    if len(values['SECRET_KEY']) < 50 or 'change' in values['SECRET_KEY'].lower():
        sys.exit('Set SECRET_KEY to a randomly generated value of at least 50 characters.')
    if not values['EMAIL_BACKEND'].endswith('.smtp.EmailBackend'):
        sys.exit('EMAIL_BACKEND must use Django SMTP for production email delivery.')
    if any('your_' in values[name].lower() for name in ('ALLOWED_HOSTS', 'CSRF_TRUSTED_ORIGINS')):
        sys.exit('Replace hostname placeholders in ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS.')
    hosts = {host.strip().lower() for host in values['ALLOWED_HOSTS'].split(',')}
    if hosts <= {'localhost', '127.0.0.1', '::1', '*'}:
        sys.exit('Set ALLOWED_HOSTS to the deployed Cloudflare hostname.')
    origins = [origin.strip() for origin in values['CSRF_TRUSTED_ORIGINS'].split(',')]
    if any(not origin.startswith('https://') for origin in origins):
        sys.exit('CSRF_TRUSTED_ORIGINS must contain HTTPS origins only.')

    subprocess.run(
        ['npx', 'wrangler', 'secret', 'bulk', str(ENV_FILE)],
        cwd=PROJECT_DIR,
        check=True,
    )
    subprocess.run(['npx', 'wrangler', 'deploy'], cwd=PROJECT_DIR, check=True)


if __name__ == '__main__':
    main()