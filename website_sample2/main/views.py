import json
import os

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


def home(request):
    return render(request, 'main/index.html')


@csrf_exempt
def send_quotation(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        number = data.get('number')
        message = data.get('message')

        if not name or not email or not number or not message:
            return JsonResponse({'error': 'All fields are required'}, status=400)

        subject = 'New Quotation Request'
        email_body = f"""
New Quotation Request:
Name: {name}
Email: {email}
Contact: {number}
Message: {message}
"""

        recipient = os.getenv('CONTACT_EMAIL', 'dewdaytrading@gmail.com')
        send_mail(
            subject,
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [recipient],
            fail_silently=False,
        )

        return JsonResponse({'success': True}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)