from django.test import TestCase, RequestFactory
from .models import Checklist, ChecklistItem
from .views import checklists, checklist, checklistItems, checklistItem
from .serializers import ChecklistSerializer
import json

# Create your tests here.
class ChecklistTest(TestCase):
    testChecklist = {
        "name": "Test Checklist",
        "description": "Description text"
    }

    def setUp(self) -> None:
        self.factory = RequestFactory()
        return super().setUp()

    def testPostChecklistsView(self):
        request = self.factory.post('checklists', data=self.testChecklist, content_type='application/json')
        response = checklists(request)
        self.assertEqual(response.status_code,201)
        modelChecklists=Checklist.objects.all()
        self.assertEqual(len(modelChecklists),1)
        self.assertEqual(modelChecklists[0].name,"Test Checklist")
        self.assertEqual(modelChecklists[0].description,"Description text")

    def testGetChecklistsView(self):
        Checklist.objects.create(**self.testChecklist)
        request = self.factory.get('checklists', content_type='application/json')
        response = checklists(request)
        response.render()
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(response.status_code,200)
        self.assertEqual(len(responseData),1)
        self.assertDictContainsSubset(self.testChecklist,responseData[0])
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
    
    def testPutChecklistView(self):
        Checklist.objects.create(**self.testChecklist)
        request = self.factory.put('checklists/1/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = checklist(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('checklists/2/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = checklist(request,2)
        self.assertEqual(response.status_code,404)
        request = self.factory.put('checklists/1/', data = {'name': 'Updated Name', 'description': 'Updated Description'}, content_type='application/json')
        response = checklist(request,1)
        self.assertEqual(response.status_code,204)
        modelChecklists=Checklist.objects.all()
        self.assertEqual(len(modelChecklists),1)
        self.assertEqual(modelChecklists[0].name,"Updated Name")
        self.assertEqual(modelChecklists[0].description,"Updated Description")

    def testDeleteChecklistView(self):
        Checklist.objects.create(**self.testChecklist)
        request = self.factory.delete('checklists/1', content_type='application/json')
        response = checklist(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Checklist.DoesNotExist, lambda: Checklist.objects.get(pk=1))
        request = self.factory.delete('checklists/1', content_type='application/json')
        response = checklist(request,1)
        self.assertEqual(response.status_code,404)

    def testGetChecklistView(self):
        Checklist.objects.create(**self.testChecklist)
        Checklist.objects.create(name='other checklist',description='other checklist\'s description')
        request= self.factory.get('checklists/2', content_type='application/json')
        response= checklist(request,2)
        self.assertEqual(response.status_code,200)        
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData),1)
        self.assertEqual(responseData[0]['name'],"other checklist")
        self.assertEqual(responseData[0]['description'],"other checklist\'s description")
        request = self.factory.get('checklists/2', content_type='application/json')
        response = checklist(request,3)
        self.assertEqual(response.status_code,404)




