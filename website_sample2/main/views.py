import json
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST


logger = logging.getLogger(__name__)


def home(request):
    return render(request, 'main/index.html')


@require_POST
def send_quotation(request):
    if len(request.body) > 10_240:
        return JsonResponse({'error': 'Request is too large.'}, status=413)

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({'error': 'Request must contain valid JSON.'}, status=400)

    if not isinstance(data, dict):
        return JsonResponse({'error': 'Request must contain a JSON object.'}, status=400)

    fields = {name: data.get(name) for name in ('name', 'email', 'number', 'message')}
    if any(not isinstance(value, str) or not value.strip() for value in fields.values()):
        return JsonResponse({'error': 'All fields are required.'}, status=400)

    fields = {name: value.strip() for name, value in fields.items()}
    if any(len(fields[name]) > limit for name, limit in {
        'name': 120,
        'email': 254,
        'number': 40,
        'message': 5000,
    }.items()):
        return JsonResponse({'error': 'One or more fields are too long.'}, status=400)

    try:
        validate_email(fields['email'])
    except ValidationError:
        return JsonResponse({'error': 'Enter a valid email address.'}, status=400)

    email_body = (
        'New Quotation Request:\n'
        f"Name: {fields['name']}\n"
        f"Email: {fields['email']}\n"
        f"Contact: {fields['number']}\n"
        f"Message: {fields['message']}\n"
    )

    try:
        send_mail(
            'New Quotation Request',
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [settings.CONTACT_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception('Failed to send quotation request.')
        return JsonResponse(
            {'error': 'We could not send your request right now. Please try again later.'},
            status=503,
        )

    return JsonResponse({'success': True}, status=200)