import json
from unittest.mock import patch

from django.conf import settings
from django.test import Client, SimpleTestCase


class HomePageTests(SimpleTestCase):
    def test_app_does_not_configure_a_database(self):
        self.assertEqual(
            settings.DATABASES['default']['ENGINE'],
            'django.db.backends.dummy',
        )

    def test_home_page_returns_200(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'SelloMogoera@gmail.com')


class SendQuotationTests(SimpleTestCase):
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
        self.assertEqual(mock_send_mail.call_args.args[3], ['dewdaytrading@gmail.com'])

    def test_send_quotation_requires_csrf_token(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            '/send-quotation',
            data=json.dumps({
                'name': 'Jane Doe',
                'email': 'jane@example.com',
                'number': '0123456789',
                'message': 'Please send a quote',
            }),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)

    @patch('main.views.send_mail', side_effect=RuntimeError('private SMTP detail'))
    def test_send_quotation_hides_email_delivery_errors(self, mock_send_mail):
        response = self.client.post(
            '/send-quotation',
            data=json.dumps({
                'name': 'Jane Doe',
                'email': 'jane@example.com',
                'number': '0123456789',
                'message': 'Please send a quote',
            }),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 503)
        self.assertNotIn('private SMTP detail', response.content.decode())
        mock_send_mail.assert_called_once()
