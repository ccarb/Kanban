import json
from django.test import TestCase, RequestFactory

from ..models import Card
from ..views import cards, card, cardBulkUpdate
from .fixture import DatabaseElements

class CardsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('boards/columns/2/cards', content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['cards']),1)
        self.assertDictContainsSubset(self.dbElements.cardsDict[2],responseData['cards'][0])

    def testPost(self):
        #invalid data
        request = self.factory.post('boards/columns/2/cards', data={'keyNotInCard':'randomString'},content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,400)
        # happy path
        data={'name': 'new card','order':1,'column':2}
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,201)
        response.render()
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertDictContainsSubset(data,responseData)
        allCards=Card.objects.filter(column=2)
        self.assertEqual(len(allCards),2)
        self.assertTrue(Card.objects.get(pk=responseData['id']))
        # higher than allowed order value
        data['order']=102
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,400)
        # card limit reached
        Card.objects.bulk_create([Card(name='new card', order=2+i, column=self.dbElements.columns[1]) for i in range(1,100)])
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,403)
        
class CardViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPut(self):
        request = self.factory.put('boards/columns/cards/1/', data = {'keyNotInCard': 'Updated Name'}, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('boards/columns/cards/100/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = card(request,100)
        self.assertEqual(response.status_code,404)
        data = self.dbElements.cardsDict[0]
        data['name']='Updated Name'
        data['cover']=None
        request = self.factory.put('boards/columns/cards/1/', data = data, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(modelCards[0].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/columns/cards/1', content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Card.DoesNotExist, lambda: Card.objects.get(pk=1))
        request = self.factory.delete('boards/1', content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,404)
    
class CardBulkUpdateTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPut(self):
        # invalid card
        request = self.factory.put('boards/columns/cards/reorder/', data = [{'id':2, 'keyNotInCard': 'Updated Name'}], content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,400)
        # invalid id
        request = self.factory.put('boards/columns/cards/reorder/', data = [{'id': 120}], content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,400)
        # happy path
        data= self.dbElements.cardsDict[0:2]
        data[0]['order']=1
        data[0]['cover']=None
        id0=data[0]['id']
        data[1]['order']=0
        data[1]['cover']=None
        id1=data[1]['id']
        request = self.factory.put('boards/columns/cards/reorder/', data = data, content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(Card.objects.get(id=id0).order, 1)
        self.assertEqual(Card.objects.get(id=id1).order, 0)
