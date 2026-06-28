import json
from unittest.mock import patch

from django.test import TestCase


class HomePageTests(TestCase):
    def test_home_page_returns_200(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


class SendQuotationTests(TestCase):
    @patch('main.views.send_mail')
    def test_send_quotation_requires_all_fields(self, mock_send_mail):
        response = self.client.post(
            '/send-quotation',
            data=json.dumps({'name': 'Jane'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('All fields are required', response.json()['error'])
        mock_send_mail.assert_not_called()

    @patch('main.views.send_mail')
    def test_send_quotation_succeeds_with_valid_payload(self, mock_send_mail):
        payload = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'number': '0123456789',
            'message': 'Please send a quote',
        }

        response = self.client.post(
            '/send-quotation',
            data=json.dumps(payload),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        mock_send_mail.assert_called_once()
