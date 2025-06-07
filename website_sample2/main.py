from flask import Flask, request, jsonify
from flask_cors import CORS

import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://www.dewdaytrading.com"}})

@app.route('/send-quotation', methods=['POST'])
def send_quotation():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    number = data.get('number')
    message = data.get('message')

    email_content = f"""
    New Quotation Request:
    Name: {name}
    Email: {email}
    Contact: {number}
    Message: {message}
    """

    # Email setup
    msg = EmailMessage()
    msg.set_content(email_content)
    msg['Subject'] = 'New Quotation Request'
    msg['From'] = 'yourcompany@example.com'
    msg['To'] = 'Dewdaytrading@gmail.com'

    # Send email using SMTP (e.g., Gmail)
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login('yourcompany@example.com', 'your_app_password')
            smtp.send_message(msg)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
