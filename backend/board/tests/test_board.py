import json
from django.test import TestCase, RequestFactory

from ..models import Board, Column
from ..views import boards, board, createDefaultColumns
from .fixture import DatabaseElements

# Create your tests here.
class BoardsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('boards', content_type='application/json')
        response = boards(request)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData),1)
        self.assertDictContainsSubset(self.dbElements.boardDict,responseData[0])

    def testPost(self):
        data={'name': 'new board'}
        request = self.factory.post('boards', data=data, content_type='application/json')
        response = boards(request)
        self.assertEqual(response.status_code,201)
        response.render()
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertDictContainsSubset(data,responseData)
        allBoards=Board.objects.all()
        self.assertEqual(len(allBoards),3)
        self.assertTrue(Board.objects.get(pk=responseData['id']))
        boardColumns=Column.objects.filter(board=responseData['id'])
        self.assertEqual(len(boardColumns),5)
        request = self.factory.post('boards', data={'keyNotInBoard':'randomString'},content_type='application/json')
        response = boards(request)
        self.assertEqual(response.status_code,400)

    def testCreateDefaultColumns(self):
        board=Board.objects.create(name='For tests')
        createDefaultColumns(board)
        createdColumns=Column.objects.filter(board=board.pk)
        self.assertEqual(len(createdColumns),5)
        archive=Column.objects.filter(board=board.pk,colType=Column.ColType.ARCHIVE)
        self.assertEqual(len(archive),1)
        self.assertEqual(archive[0].name,'Archive')
        backlog=Column.objects.filter(board=board.pk,colType=Column.ColType.BACKLOG)
        self.assertEqual(len(backlog),1)
        self.assertEqual(backlog[0].name,'Backlog')
        normal=Column.objects.filter(board=board.pk,colType=Column.ColType.NORMAL)
        self.assertEqual(len(normal),3)

class BoardViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request= self.factory.get('boards/1', content_type='application/json')
        response= board(request,1)
        self.assertEqual(response.status_code,200)        
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData),1)
        self.assertDictContainsSubset(self.dbElements.boardDict,responseData[0])
        request = self.factory.get('boards/10', content_type='application/json')
        response = board(request,10)
        self.assertEqual(response.status_code,404)

    def testPut(self):
        request = self.factory.put('boards/1/', data = {'keyNotInBoard': 'Updated Name'}, content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('boards/10/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = board(request,10)
        self.assertEqual(response.status_code,404)
        request = self.factory.put('boards/1/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,204)
        modelBoards=Board.objects.all()
        self.assertEqual(len(modelBoards),2)
        self.assertEqual(modelBoards[0].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/1', content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Board.DoesNotExist, lambda: Board.objects.get(pk=1))
        request = self.factory.delete('boards/1', content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,404)