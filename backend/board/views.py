#from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django.http import FileResponse, HttpResponseNotFound, HttpResponseNotAllowed
from django.contrib.auth.models import User
from django.db.models import Q
from knox.auth import TokenAuthentication

from .models import Board, Column, Card
from .serializers import *
from .permissions import IsPublicOrIsOwnerOrNotAllowed

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def kanban(request,pk):
    permissions=IsPublicOrIsOwnerOrNotAllowed()
    try:
        board = Board.objects.prefetch_related('column_set__card_set').get(pk=pk)
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    except Board.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    columns = board.column_set.all()
    cards=[]
    for column in columns:
        cards.append(column.card_set.all())

    boardSerializer=BoardSerializer(board,context={'request': request})
    columnSerializer=ColumnSerializer(columns,context={'request': request},many=True)
    
    kanban=boardSerializer.data
    kanban['columns']=columnSerializer.data
    for i in range(len(cards)):
        cardSerializer=CardSerializer(cards[i],many=True,context={'request': request})
        kanban['columns'][i]['cards']=cardSerializer.data

    return Response(kanban,headers={'context_type': 'application/json'})
        
@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
def boards(request):
    permissions=IsPublicOrIsOwnerOrNotAllowed()
    if type(request.user)==User:
        user=request.user
    else:
        user=None
    if request.method == 'GET':
        data = Board.objects.filter(Q(owner=user) | Q(owner=None))
        for board in data:
            if not permissions.has_object_permission(request, None, board):
                raise PermissionDenied
        serializer = BoardSerializer(data, context={'request': request},many=True)

        return Response(serializer.data, headers={'content_type':'application/json'})
    
    elif request.method == 'POST':
        data=request.data.copy()
        data['owner']=request.user.pk
        serializer = BoardSerializer(data=data)
        if serializer.is_valid():
            newRecord=serializer.save()
            serializedRecord=BoardSerializer(newRecord, context={'request':request})
            createDefaultColumns(newRecord)
            return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def createDefaultColumns(boardObj):
    """Every board starts with the following default columns:
            backlog, to do, doing, done, archive"""
    Column.objects.bulk_create([
        Column(name='Backlog',order=Column.MIN_ORDER, colType=Column.ColType.BACKLOG,board=boardObj),
        Column(name='To do',order='1',board=boardObj),
        Column(name='Doing',order='2',board=boardObj),
        Column(name='Done',order='3',board=boardObj),
        Column(name='Archive',order=Column.MAX_ORDER, colType=Column.ColType.ARCHIVE,board=boardObj),
    ])
    
@api_view(['GET','PUT','DELETE'])
@authentication_classes([TokenAuthentication])
def board(request, pk):
    permissions=IsPublicOrIsOwnerOrNotAllowed()
    try:
        board = Board.objects.get(pk=pk)
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    except Board.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = BoardSerializer(board, context={'request': request})
        return Response([serializer.data],headers = {'content_type':'application/json'})
    
    elif request.method == 'PUT':
        serializer = BoardSerializer(board, data=request.data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
@api_view(['GET','POST'])
@authentication_classes([TokenAuthentication])
def columns(request,boardKey):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    columns = Column.objects.select_related("board__owner").filter(board=boardKey)
    for column in columns:
        board = column.board
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    if request.method == 'GET':
        serializer = ColumnSerializer(columns,context={'request':request},many=True)
        responseData={}
        responseData['columns']=serializer.data
        return Response(responseData,headers={'content_type':'application/json'})
    
    elif request.method == 'POST':
        if columns.count() >= Column.MAX_COLUMNS_PER_BOARD:
            return Response('Cannot add more columns', status=status.HTTP_403_FORBIDDEN)
        serializer = ColumnSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data.get('colType') not in (Column.ColType.NORMAL, None):
                return Response("Cannot create Backlog or Archive columns.",status=status.HTTP_403_FORBIDDEN)
            if serializer.validated_data.get('order') in (Column.MIN_ORDER, Column.MAX_ORDER):
                return Response("Cannot create, attempting to use reserved order value",status=status.HTTP_403_FORBIDDEN)
            newRecord=serializer.save()
            serializedRecord=ColumnSerializer(newRecord)
            return Response(serializedRecord.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT','DELETE'])
@authentication_classes([TokenAuthentication])
def column(request,pk):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    try:
        column = Column.objects.select_related('board__owner').get(pk=pk)
    except Column.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        board = column.board
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
        if request.method == 'PUT':
            serializer = ColumnSerializer(column, data=request.data, context={'request': request})
            if serializer.is_valid():
                # cannot change coltype
                if serializer.validated_data.get('colType') not in (column.colType.title(), None):
                    return Response('Cannot change colType',status=status.HTTP_403_FORBIDDEN)
                # cannot change order on backlog or archive col
                if column.colType != Column.ColType.NORMAL and serializer.validated_data.get('order') != column.order:
                    return Response('Cannot reorder Backlog or Archive columns',status=status.HTTP_403_FORBIDDEN)
                serializer.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            if column.colType in (column.ColType.ARCHIVE, column.ColType.BACKLOG):
                return Response(status=status.HTTP_403_FORBIDDEN)
            column.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
def columnBulkUpdate(request):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    receivedColumnData = request.data
    columnIds = [column['id'] for column in receivedColumnData if 'id' in column.keys()]
    affectedColumns = Column.objects.select_related('board__owner').filter(id__in = columnIds)
    for column in affectedColumns:
        board = column.board
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    if len(affectedColumns) != len(receivedColumnData):
        return Response('Invalid Ids', status=status.HTTP_400_BAD_REQUEST)
    if any(col.colType!=Column.ColType.NORMAL for col in affectedColumns):
        return Response('Cannot reorder Archive or Backlog type columns', status=status.HTTP_403_FORBIDDEN)
    reorderedColumns = ColumnSerializer(affectedColumns, data=request.data, many=True)
    if reorderedColumns.is_valid():
        if any(col['colType']!=Column.ColType.NORMAL.value for col in reorderedColumns.validated_data):
            return Response('Cannot reorder Archive or Backlog type columns', status=status.HTTP_403_FORBIDDEN)
        reorderedColumns.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(reorderedColumns.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET','POST'])
@authentication_classes([TokenAuthentication])
def cards(request,columnKey):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    cards=Card.objects.select_related('column__board__owner').filter(column=columnKey)
    for card in cards:
        board=card.column.board
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    if request.method=='GET':
        serializer=CardSerializer(cards,context={'request':request}, many=True)
        responseData={}
        responseData['cards']=serializer.data
        return Response(responseData,headers={'content_type':'application/json'})
    
    elif request.method=='POST':
        if cards.count() >= Card.MAX_CARDS_PER_COLUMN:
            return Response('Cannot add more cards', status=status.HTTP_403_FORBIDDEN)
        serializer=CardSerializer(data=request.data)
        if serializer.is_valid():
            newRecord=serializer.save()
            serializedRecord=CardSerializer(newRecord)
            return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
def card(request,pk):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    try:
        card=Card.objects.select_related('column__board__owner').get(pk=pk)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    board = card.column.board
    if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    if request.method=='PUT':
        serializer=CardSerializer(card,data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
def cardBulkUpdate(request):
    permissions = IsPublicOrIsOwnerOrNotAllowed()
    receivedCardData = request.data
    cardIds = [card['id'] for card in receivedCardData if 'id' in card.keys()]
    affectedCards = Card.objects.select_related('column__board__owner').filter(id__in = cardIds)
    for card in affectedCards:
        board = card.column.board
        if not permissions.has_object_permission(request, None, board):
            raise PermissionDenied
    if len(affectedCards) != len(receivedCardData):
        return Response('Invalid Ids', status=status.HTTP_400_BAD_REQUEST)
    reorderedCards = CardSerializer(affectedCards, data=request.data, many=True)
    if reorderedCards.is_valid():
        reorderedCards.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(reorderedCards.errors, status=status.HTTP_400_BAD_REQUEST)

def image(request, filename, folderName='card_covers'):
    if request.method=='GET':
        try:
            res=FileResponse(open('{}/{}'.format(folderName, filename),'rb'))
        except FileNotFoundError:
            res=HttpResponseNotFound()
    else:
        res=HttpResponseNotAllowed(['GET'])
    return res