import json
from django.test import TestCase, RequestFactory
from .models import Board, Column, Card
from .views import kanban

class DatabaseElements:
    boardDict={
        'name': 'Test Board'
    }
    board=Board.objects.create(**boardDict)
    columnsDict=[
        {
            'name':'Backlog',
            'colType': Column.ColType.BACKLOG,
            'order': 1,
            'board': board
        },
        {
            'name': 'To Do',
            'colType': Column.ColType.NORMAL,
            'order': 2,
            'board': board
        },
        {
            'name': 'Doing',
            'colType': Column.ColType.NORMAL,
            'order': 3,
            'board': board
        },
        {
            'name': 'Done',
            'colType': Column.ColType.NORMAL,
            'order': 4,
            'board': board
        },
        {
            'name': 'Archive',
            'colType': Column.ColType.ARCHIVE,
            'order': 5,
            'board': board
        }
    ]
    columns=[]
    for columnDict in columnsDict:
        column = Column.objects.create(**columnDict)
        columns.append(column)
    cardsDict=[
        {
            'name': 'Card in Backlog',
            'description': 'this is a card in the backlog column',
            'order': 1,
            'column': columns[0]
        },
        {
            'name': 'Card in To Do',
            'description': 'this is a card in the To Do column',
            'order': 1,
            'column': columns[1]
        },
        {
            'name': 'Card in Doing',
            'description': 'this is a card in the Doing column',
            'order': 1,
            'column': columns[2]
        },
        {
            'name': 'Card in Done',
            'description': 'this is a card in the Done column',
            'order': 1,
            'column': columns[3]
        },
        {
            'name': 'Card in Archive',
            'description': 'this is a card in the Archive column',
            'order': 1,
            'column': columns[4]
        },
    ]
    cards=[]
    for cardDict in cardsDict:
        card=Card.objects.create(**cardDict)
        cards.append(card)

# Create your tests here.
class KanbanViewTest(TestCase):
    def setUp(self) -> None:
        self.dbElements=DatabaseElements
        self.factory = RequestFactory()
        return super().setUp()
    
    def testGet(self):
        request = self.factory.get('kanban/1', content_type='application/json')
        response = kanban(request,self.dbElements.board.pk)
        self.assertEqual(response.status_code,200)
        response.render()
        responseText = response.content.decode('utf-8')
        responseData = json.loads(responseText)
        self.assertEqual(response.__getitem__('content-type'), 'application/json')
        self.assertEqual(len(responseData),1)
        self.assertDictContainsSubset(DatabaseElements.boardDict,responseData)
        for columnDict in DatabaseElements.columnsDict:
            self.assertDictContainsSubset(columnDict,responseData)
        for cardDict in DatabaseElements.cardsDict:
            self.assertDictContainsSubset(cardDict,responseData)
        request = self.factory.get('kanban/10', content_type='application/json')
        response = kanban(request,10)
        self.assertEqual(response.status_code,404)
