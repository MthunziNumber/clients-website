from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from django.core.mail import send_mail

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def home(request):
    return render(request, 'main/index.html')

def authenticate_gmail():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}

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

        send_mail(
            subject,
            email_body,
            'yourcompany@gmail.com',  # From
            ['Dewdaytrading@gmail.com'],  # To
            fail_silently=False,
        )

        return JsonResponse({'success': True}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)