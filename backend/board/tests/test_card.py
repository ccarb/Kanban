import json
from django.test import TestCase, RequestFactory
from knox.auth import AuthToken

from ..models import Card
from ..views import cards, card, cardBulkUpdate
from .fixture import DatabaseElements

class CardsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_get_successful(self):
        request = self.factory.get('boards/columns/2/cards', content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['cards']),1)
        self.assertDictContainsSubset(self.dbElements.cardsDict[2],responseData['cards'][0])

    def test_anonymus_get_non_existant(self):
        request = self.factory.get('boards/columns/100/cards', content_type='application/json')
        response = cards(request,100)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['cards']),0)

    def test_anonymus_get_not_public(self):
        request = self.factory.get('boards/columns/7/cards', content_type='application/json')
        response = cards(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_get_owned(self):
        request = self.factory.get('boards/columns/7/cards', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cards(request,7)
        self.assertEqual(response.status_code,200)
    
    def test_authenticated_get_public(self):
        request = self.factory.get('boards/columns/2/cards', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cards(request,2)
        self.assertEqual(response.status_code,200)

    def test_anonymus_post_invalid_data(self):
        request = self.factory.post('boards/columns/2/cards', data={'keyNotInCard':'randomString'},content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,400)

    def test_anonymus_post_public_successful(self):
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

    def test_anonymus_post_invalid_order(self):
        # higher than allowed order value
        data={'name': 'new card','order':102,'column':2}
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,400)

    def test_anonymus_post_card_limit(self):
        # card limit reached
        data={'name': 'new card','order':1,'column':2}
        Card.objects.bulk_create([Card(name='new card', order=2+i, column=self.dbElements.columns[1]) for i in range(1,100)])
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,403)
    
    def test_anonymus_post_not_public(self):
        data={'name': 'new card','order':1,'column':2}
        request = self.factory.post('boards/columns/7/cards', data=data, content_type='application/json')
        response = cards(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_post_public(self):
        data={'name': 'new card','order':1,'column':2}
        request = self.factory.post('boards/columns/2/cards', data=data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cards(request,2)
        self.assertEqual(response.status_code,201)

    def test_authenticated_post_owned(self):
        data={'name': 'new card','order':1,'column':2}
        request = self.factory.post('boards/columns/7/cards', data=data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cards(request,7)
        self.assertEqual(response.status_code,201)


class CardViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_put_invalid_data(self):
        request = self.factory.put('boards/columns/cards/1/', data = {'keyNotInCard': 'Updated Name'}, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_not_exists(self):
        request = self.factory.put('boards/columns/cards/100/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = card(request,100)
        self.assertEqual(response.status_code,404)

    def test_anonymus_put_public_successful(self):
        data = self.dbElements.cardsDict[0]
        data['name']='Updated Name'
        data['cover']=None
        request = self.factory.put('boards/columns/cards/1/', data = data, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(modelCards[0].name,"Updated Name")

    def test_anonymus_put_not_public(self):
        request = self.factory.put('boards/columns/cards/7/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = card(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_put_public(self):
        data = self.dbElements.cardsDict[0]
        data['name']='Updated Name'
        data['cover']=None
        request = self.factory.put('boards/columns/cards/1/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(modelCards[0].name,"Updated Name")

    def test_authenticated_put_owned_successful(self):
        data = self.dbElements.cardsDict[0]
        data['name']='Updated Name'
        data['cover']=None
        request = self.factory.put('boards/columns/cards/7/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = card(request,7)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(modelCards[0].name,"Updated Name")

    def test_anonymus_delete_public_successful(self):
        request = self.factory.delete('boards/columns/cards/1', content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Card.DoesNotExist, lambda: Card.objects.get(pk=1))

    def test_anonymus_delete_non_existant(self):
        request = self.factory.delete('boards/columns/cards/100', content_type='application/json')
        response = card(request,100)
        self.assertEqual(response.status_code,404)

    def test_anonymus_delete_not_public(self):
        request = self.factory.delete('boards/columns/cards/7', content_type='application/json')
        response = card(request,7)
        self.assertEqual(response.status_code,403)

    def test_authenticated_delete_public(self):
        request = self.factory.delete('boards/columns/cards/1', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Card.DoesNotExist, lambda: Card.objects.get(pk=1))

    def test_authenticated_delete_owned(self):
        request = self.factory.delete('boards/columns/cards/7', content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = card(request,7)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Card.DoesNotExist, lambda: Card.objects.get(pk=7))

class CardBulkUpdateTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def test_anonymus_put_invalid_data(self):
        request = self.factory.put('boards/columns/cards/reorder/', data = [{'id':2, 'keyNotInCard': 'Updated Name'}], content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_invalid_id(self):
        request = self.factory.put('boards/columns/cards/reorder/', data = [{'id': 120}], content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,400)

    def test_anonymus_put_public(self):
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
    
    def test_anonymus_put_not_public(self):
        data= self.dbElements.cardsDict[5:7]
        data[0]['order']=1
        data[0]['cover']=None
        id0=data[0]['id']
        data[1]['order']=0
        data[1]['cover']=None
        id1=data[1]['id']
        request = self.factory.put('boards/columns/cards/reorder/', data = data, content_type='application/json')
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,403)

    def test_authenticated_put_public(self):
        data= self.dbElements.cardsDict[0:2]
        data[0]['order']=1
        data[0]['cover']=None
        id0=data[0]['id']
        data[1]['order']=0
        data[1]['cover']=None
        id1=data[1]['id']
        request = self.factory.put('boards/columns/cards/reorder/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(Card.objects.get(id=id0).order, 1)
        self.assertEqual(Card.objects.get(id=id1).order, 0)

    def test_authenticated_put_owned(self):        
        data= self.dbElements.cardsDict[5:7]
        data[0]['order']=1
        data[0]['cover']=None
        id0=data[0]['id']
        data[1]['order']=0
        data[1]['cover']=None
        id1=data[1]['id']
        request = self.factory.put('boards/columns/cards/reorder/', data = data, content_type='application/json')
        token=AuthToken.objects.create(self.dbElements.user)
        request.META['HTTP_AUTHORIZATION'] = f'Token {token[1]}'
        response = cardBulkUpdate(request)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),12)
        self.assertEqual(Card.objects.get(id=id0).order, 1)
        self.assertEqual(Card.objects.get(id=id1).order, 0)
