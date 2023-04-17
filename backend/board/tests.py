import json
from django.test import TestCase, RequestFactory
from .models import Board, Column, Card
from .views import *

class DatabaseElements:
    def __init__(self):
        self.boardDict={
            'name': 'Test Board'
        }
        self.board=Board.objects.create(**self.boardDict)
        self.boardDict['created']=self.board.created.isoformat()
        self.boardDict['id']=self.board.pk
        self.columnsDict=[
            {
                'name':'Backlog',
                'colType': Column.ColType.BACKLOG,
                'order': 1,
                'board': self.board
            },
            {
                'name': 'To Do',
                'colType': Column.ColType.NORMAL,
                'order': 2,
                'board': self.board
            },
            {
                'name': 'Doing',
                'colType': Column.ColType.NORMAL,
                'order': 3,
                'board': self.board
            },
            {
                'name': 'Done',
                'colType': Column.ColType.NORMAL,
                'order': 4,
                'board': self.board
            },
            {
                'name': 'Archive',
                'colType': Column.ColType.ARCHIVE,
                'order': 5,
                'board': self.board
            }
        ]
        self.columns=[]
        for columnDict in self.columnsDict:
            column = Column.objects.create(**columnDict)            
            self.columns.append(column)
            columnDict['colType']=column.colType.title()
            columnDict['board']=self.board.pk
            columnDict['id']=column.pk
            columnDict['created']=column.created.isoformat()
        self.cardsDict=[
            {
                'name': 'Card in Backlog',
                'description': 'this is a card in the backlog column',
                'order': 1,
                'column': self.columns[0]
            },
            {
                'name': 'Card in To Do',
                'description': 'this is a card in the To Do column',
                'order': 1,
                'column': self.columns[1]
            },
            {
                'name': 'Card in Doing',
                'description': 'this is a card in the Doing column',
                'order': 1,
                'column': self.columns[2],
                'dueDate': '2023-04-19'
            },
            {
                'name': 'Card in Done',
                'description': 'this is a card in the Done column',
                'order': 1,
                'column': self.columns[3]
            },
            {
                'name': 'Card in Archive',
                'description': 'this is a card in the Archive column',
                'order': 1,
                'column': self.columns[4]
            },
        ]
        self.cards=[]
        for cardDict in self.cardsDict:
            card=Card.objects.create(**cardDict)
            cardDict['created']=card.created.isoformat()
            cardDict['id']=card.pk
            if card.dueDate:
                cardDict['dueDate']=card.dueDate
            else:
                cardDict['dueDate']=None
            cardDict['cover']=card.cover
            cardDict['column']=card.column.pk
            self.cards.append(card)


# Create your tests here.
class KanbanViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('kanban/1', content_type='application/json')
        response = kanban(request,1)
        self.assertEqual(response.status_code,200)
        response.render()
        responseText = response.content.decode('utf-8')
        responseData = json.loads(responseText)
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        self.assertEqual(len(responseData),4)
        expectedResponse={**self.dbElements.boardDict}
        expectedResponse['columns']=self.dbElements.columnsDict
        for i in range(len(expectedResponse['columns'])):
            expectedResponse['columns'][i]['cards']=[]
        for i in range(len(self.dbElements.cardsDict)):
            expectedResponse['columns'][self.dbElements.cardsDict[i]['column']-1]['cards'].append(self.dbElements.cardsDict[i])
        self.assertDictContainsSubset(responseData,expectedResponse)
        request = self.factory.get('kanban/10', content_type='application/json')
        response = kanban(request,10)
        self.assertEqual(response.status_code,404)

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
        self.assertEqual(len(allBoards),2)
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
        request = self.factory.get('boards/2', content_type='application/json')
        response = board(request,2)
        self.assertEqual(response.status_code,404)

    def testPut(self):
        request = self.factory.put('boards/1/', data = {'keyNotInBoard': 'Updated Name'}, content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('boards/2/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = board(request,2)
        self.assertEqual(response.status_code,404)
        request = self.factory.put('boards/1/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,204)
        modelBoards=Board.objects.all()
        self.assertEqual(len(modelBoards),1)
        self.assertEqual(modelBoards[0].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/1', content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Board.DoesNotExist, lambda: Board.objects.get(pk=1))
        request = self.factory.delete('boards/1', content_type='application/json')
        response = board(request,1)
        self.assertEqual(response.status_code,404)

class ColumnsViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('boards/1/columns', content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,200)
        response.render()
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertEqual(len(responseData['columns']),5)
        self.assertListEqual(self.dbElements.columnsDict,responseData['columns'])

    def testPost(self):
        data={'name': 'new column', 'order': 6, 'board': 1}
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,201)
        response.render()
        responseText=response.content.decode('utf-8')
        responseData=json.loads(responseText)
        self.assertDictContainsSubset(data,responseData)
        allColumns=Column.objects.filter(board=1)
        self.assertEqual(len(allColumns),6)
        self.assertTrue(Column.objects.get(pk=responseData['id']))
        request = self.factory.post('boards/2/columns', data={'keyNotInColumn':'randomString'},content_type='application/json')
        response = columns(request,2)
        self.assertEqual(response.status_code,400)
        data['colType']=Column.ColType.BACKLOG.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)
        data['colType']=Column.ColType.ARCHIVE.title()
        request = self.factory.post('boards/1/columns', data=data, content_type='application/json')
        response = columns(request,1)
        self.assertEqual(response.status_code,403)

class ColumnViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPut(self):
        request = self.factory.put('boards/columns/1/', data = {'keyNotInColumn': 'Updated Name'}, content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('boards/columns/10/', data = {'name': 'Updated Name', 'order': 1, 'board':1}, content_type='application/json')
        response = column(request,10)
        self.assertEqual(response.status_code,404)
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1, 'colType':Column.ColType.BACKLOG.title()}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,403)
        request = self.factory.put('board/columns/2/', data = {'name': 'Updated Name', 'order': 2, 'board':1}, content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        modelColumns=Column.objects.filter(board=1)
        self.assertEqual(len(modelColumns),5)
        self.assertEqual(modelColumns[1].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Board.DoesNotExist, lambda: Board.objects.get(pk=2))
        request = self.factory.delete('boards/columns/1', content_type='application/json')
        response = column(request,1)
        self.assertEqual(response.status_code,403)
        request = self.factory.delete('boards/columns/2', content_type='application/json')
        response = column(request,2)
        self.assertEqual(response.status_code,404)

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
        self.assertDictContainsSubset(self.dbElements.cardsDict[1],responseData['cards'][0])

    def testPost(self):
        data={'name': 'new card','order':2,'column':2}
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
        request = self.factory.post('boards/columns/2/cards', data={'keyNotInCard':'randomString'},content_type='application/json')
        response = cards(request,2)
        self.assertEqual(response.status_code,400)
        
class CardViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements()
        self.factory = RequestFactory()
        return super().setUp()
    
    def testPut(self):
        request = self.factory.put('boards/columns/cards/1/', data = {'keyNotInCard': 'Updated Name'}, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,400)
        request = self.factory.put('boards/columns/cards/10/', data = {'name': 'Updated Name'}, content_type='application/json')
        response = card(request,10)
        self.assertEqual(response.status_code,404)
        data = self.dbElements.cardsDict[0]
        data['name']='Updated Name'
        data['cover']=None
        request = self.factory.put('boards/columns/cards/1/', data = data, content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        modelCards=Card.objects.all()
        self.assertEqual(len(modelCards),5)
        self.assertEqual(modelCards[0].name,"Updated Name")

    def testDelete(self):
        request = self.factory.delete('boards/columns/cards/1', content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,204)
        self.assertRaises(Card.DoesNotExist, lambda: Card.objects.get(pk=1))
        request = self.factory.delete('boards/1', content_type='application/json')
        response = card(request,1)
        self.assertEqual(response.status_code,404)
    
