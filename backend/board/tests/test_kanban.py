import json
from django.test import TestCase, RequestFactory

from ..views import kanban
from .fixture import DatabaseElements

# Create your tests here.
class KanbanViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet_successful(self):
        request = self.factory.get('kanban/1', content_type='application/json')
        response = kanban(request,1)
        self.assertEqual(response.status_code,200)
        response.render()
        responseText = response.content.decode('utf-8')
        responseData = json.loads(responseText)
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        # amounts of keys in dict should be 5: id, name, created, owner, columns
        self.assertEqual(len(responseData),5)
        expectedResponse={**self.dbElements.boardDict}
        expectedResponse['columns']=self.dbElements.columnsDict[0:5]
        for i in range(len(expectedResponse['columns'])):
            expectedResponse['columns'][i]['cards']=[]
        for i in range(len(self.dbElements.cardsDict[0:6])):
            expectedResponse['columns'][self.dbElements.cardsDict[i]['column']-1]['cards'].append(self.dbElements.cardsDict[i])
        self.assertDictContainsSubset(responseData,expectedResponse)
    def test_not_exists(self):
        request = self.factory.get('kanban/10', content_type='application/json')
        response = kanban(request,10)
        self.assertEqual(response.status_code,404)
