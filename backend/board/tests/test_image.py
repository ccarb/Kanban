import os
from django.test import TestCase, RequestFactory

from ..views import image

class imageViewTest(TestCase):
    def setUp(self) -> None:
        with open('test/test.png','wb'):
            pass
        self.factory = RequestFactory()
        return super().setUp()
    
    def tearDown(self) -> None:
        os.remove('test/test.png')
        return super().tearDown()
    
    def testImageExists(self):
        request = self.factory.get('card_covers/test.png')
        response = image(request,'test.png','test')
        self.assertEqual(response.status_code,200)

    def testCardNotExist(self):        
        request = self.factory.get('card_covers/te.png')
        response = image(request,'tt.png','test')
        self.assertEqual(response.status_code,404)

    def testMethodNotAllowed(self):
        request = self.factory.put('card_covers/test.png')
        response = image(request,'test.png','test')
        self.assertEqual(response.status_code,405)