import json
from django.test import TestCase, RequestFactory
from .models import Board, Column, Card
from .views import kanban

class DatabaseElements:
    def __init__(self):
        self.boardDict={
            'name': 'Test Board'
        }
        self.board=Board.objects.create(**self.boardDict)
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
                'column': self.columns[2]
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
        expectedResponse['created']=self.dbElements.board.created.isoformat()
        expectedResponse['id']=self.dbElements.board.pk
        expectedResponse['columns']=self.dbElements.columnsDict
        for i in range(len(expectedResponse['columns'])):
            expectedResponse['columns'][i]['colType']=expectedResponse['columns'][i]['colType'].title()
            expectedResponse['columns'][i]['board']=self.dbElements.board.pk
            expectedResponse['columns'][i]['id']=self.dbElements.columns[i].pk
            expectedResponse['columns'][i]['created']=self.dbElements.columns[i].created.isoformat()
            expectedResponse['columns'][i]['cards']=[]
        for i in range(len(self.dbElements.cardsDict)):
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'].append(self.dbElements.cardsDict[i])
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'][-1]['id']=self.dbElements.cards[i].pk
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'][-1]['created']=self.dbElements.cards[i].created.isoformat()
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'][-1]['dueDate']=self.dbElements.cards[i].dueDate
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'][-1]['cover']=None
            expectedResponse['columns'][self.dbElements.cards[i].column.pk-1]['cards'][-1]['column']=self.dbElements.cards[i].column.pk
        self.assertDictContainsSubset(responseData,expectedResponse)
        request = self.factory.get('kanban/10', content_type='application/json')
        response = kanban(request,10)
        self.assertEqual(response.status_code,404)
