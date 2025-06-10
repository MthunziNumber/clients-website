from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://www.dewdaytrading.com"}})

# Gmail API Setup
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Authenticate Gmail API
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

@app.route('/send-quotation', methods=['POST'])
def send_quotation():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    number = data.get('number')
    message = data.get('message')

    if not name or not email or not number or not message:
        return jsonify({'error': 'All fields are required'}), 400

    email_content = f"""
    Subject: New Quotation Request

    New Quotation Request:
    Name: {name}
    Email: {email}
    Contact: {number}
    Message: {message}
    """

    try:
        creds = authenticate_gmail()
        service = build('gmail', 'v1', credentials=creds)

        message = {
            'raw': email_content.encode('utf-8').hex()
        }

        service.users().messages().send(userId="me", body=message).execute()
        
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
