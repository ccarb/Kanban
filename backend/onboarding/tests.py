import json
from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory

from .views import onboarding

# Create your tests here.
class OnboardingViewTest(TestCase):
    def setUp(self) -> None:
        self.factory = RequestFactory()
        user=User(username="user1", password="eigthchars")
        user.save()
        return super().setUp()
    def test_successful(self):
        data = {"username": "test", "password": "eightchars"}
        request = self.factory.post('api/signup', data=data, content_type='application/json')
        response = onboarding(request)
        self.assertEqual(response.status_code,201)
        response.render()
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertDictContainsSubset(data,responseData)
        
    def test_invalidUser(self):
        data = {"username": "user1", "password": "eightchars"}
        request = self.factory.post('api/signup', data=data, content_type='application/json')
        response = onboarding(request)
        self.assertEqual(response.status_code,400)

    def test_invalidPassword(self):
        data = {"username": "test", "password": "12345678"}
        request = self.factory.post('api/signup', data=data, content_type='application/json')
        response = onboarding(request)
        self.assertEqual(response.status_code,400)

    def test_missingPassword(self):
        data = {"username": "test"}
        request = self.factory.post('api/signup', data=data, content_type='application/json')
        response = onboarding(request)
        self.assertEqual(response.status_code,400)

    def test_emptyRequest(self):
        data={}
        request = self.factory.post('api/signup', data=data, content_type='application/json')
        response = onboarding(request)
        self.assertEqual(response.status_code,400)
