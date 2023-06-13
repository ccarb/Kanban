from django.contrib.auth.models import User
from ..models import Board, Column, Card

class DatabaseElements:
    def __init__(self):
        self.user=User(username='user1', password='eightchars')
        self.user.save()
        self.boardDict={
            'name': 'Test Board', 'owner': None
        }
        self.board=Board.objects.create(**self.boardDict)
        self.userBoard=Board.objects.create(name='user board', owner=self.user)
        self.boardDict['created']=self.board.created.isoformat()
        self.boardDict['id']=self.board.pk
        self.columnsDict=[
            {
                'name':'Backlog',
                'colType': Column.ColType.BACKLOG,
                'order': 0,
                'board': self.board
            },
            {
                'name': 'To Do',
                'colType': Column.ColType.NORMAL,
                'order': 1,
                'board': self.board
            },
            {
                'name': 'Doing',
                'colType': Column.ColType.NORMAL,
                'order': 2,
                'board': self.board
            },
            {
                'name': 'Done',
                'colType': Column.ColType.NORMAL,
                'order': 3,
                'board': self.board
            },
            {
                'name': 'Archive',
                'colType': Column.ColType.ARCHIVE,
                'order': 11,
                'board': self.board
            },
            {
                'name':'Backlog',
                'colType': Column.ColType.BACKLOG,
                'order': 0,
                'board': self.userBoard
            },
            {
                'name': 'To Do',
                'colType': Column.ColType.NORMAL,
                'order': 1,
                'board': self.userBoard
            },
            {
                'name': 'Doing',
                'colType': Column.ColType.NORMAL,
                'order': 2,
                'board': self.userBoard
            },
            {
                'name': 'Done',
                'colType': Column.ColType.NORMAL,
                'order': 3,
                'board': self.userBoard
            },
            {
                'name': 'Archive',
                'colType': Column.ColType.ARCHIVE,
                'order': 11,
                'board': self.userBoard
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
                'order': 0,
                'column': self.columns[0]
            },
            {
                'name': 'Second Card in Backlog',
                'description': 'this is the second card in the backlog column',
                'order': 1,
                'column': self.columns[0]
            },
            {
                'name': 'Card in To Do',
                'description': 'this is a card in the To Do column',
                'order': 0,
                'column': self.columns[1]
            },
            {
                'name': 'Card in Doing',
                'description': 'this is a card in the Doing column',
                'order': 0,
                'column': self.columns[2],
                'dueDate': '2023-04-19'
            },
            {
                'name': 'Card in Done',
                'description': 'this is a card in the Done column',
                'order': 0,
                'column': self.columns[3]
            },
            {
                'name': 'Card in Archive',
                'description': 'this is a card in the Archive column',
                'order': 0,
                'column': self.columns[4]
            },
            {
                'name': 'Card in Backlog',
                'description': 'this is a card in the backlog column',
                'order': 0,
                'column': self.columns[5]
            },
            {
                'name': 'Second Card in Backlog',
                'description': 'this is the second card in the backlog column',
                'order': 1,
                'column': self.columns[5]
            },
            {
                'name': 'Card in To Do',
                'description': 'this is a card in the To Do column',
                'order': 0,
                'column': self.columns[6]
            },
            {
                'name': 'Card in Doing',
                'description': 'this is a card in the Doing column',
                'order': 0,
                'column': self.columns[7],
                'dueDate': '2023-04-19'
            },
            {
                'name': 'Card in Done',
                'description': 'this is a card in the Done column',
                'order': 0,
                'column': self.columns[8]
            },
            {
                'name': 'Card in Archive',
                'description': 'this is a card in the Archive column',
                'order': 0,
                'column': self.columns[9]
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
