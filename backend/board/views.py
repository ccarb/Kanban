#from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Board, Column, Card
from .serializers import *

@api_view(['GET'])
def kanban(request,pk):
    try:
        board = Board.objects.get(pk=pk)
    except Board.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    columns = Column.objects.filter(board=pk)
    cards=[]
    for column in columns:
        cards.append(Card.objects.filter(column=column.pk))
    
    boardSerializer=BoardSerializer(board,context={'request': request})
    columnSerializer=ColumnSerializer(columns,context={'request': request},many=True)
    
    kanban=boardSerializer.data
    kanban['columns']=columnSerializer.data
    for i in range(len(cards)):
        cardSerializer=CardSerializer(cards[i],many=True,context={'request': request})
        kanban['columns'][i]['cards']=cardSerializer.data

    return Response(kanban,headers={'context_type': 'application/json'})
        
@api_view(['GET', 'POST'])
def boards(request):
    if request.method == 'GET':
        data = Board.objects.all()
        serializer = BoardSerializer(data, context={'request': request},many=True)

        return Response(serializer.data, headers={'content_type':'application/json'})
    
    elif request.method == 'POST':
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            newRecord=serializer.save()
            serializedRecord=BoardSerializer(newRecord, context={'request':request})
            createDefaultColumns(newRecord)
            return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def createDefaultColumns(boardKey):
    """Every board starts with the following default columns:
            backlog, to do, doing, done, archive"""
    Column.objects.create(name='Backlog',order='1',colType=Column.ColType.BACKLOG,board=boardKey)
    Column.objects.create(name='To do',order='2',board=boardKey)
    Column.objects.create(name='Doing',order='3',board=boardKey)
    Column.objects.create(name='Done',order='4',board=boardKey)
    Column.objects.create(name='Archive',order='5',colType=Column.ColType.ARCHIVE,board=boardKey)

@api_view(['GET','PUT','DELETE'])
def board(request, pk):
    try:
        board = Board.objects.get(pk=pk)
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
        try:
            board.delete()
        except Board.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)
        
@api_view(['GET','POST'])
def columns(request,boardKey):
    columns = Column.objects.filter(board=boardKey)
    if request.method == 'GET':
        serializer = ColumnSerializer(columns,context={'request':request},many=True)
        responseData={}
        responseData['columns']=serializer.data
        return Response(responseData,headers={'content_type':'application/json'})
    
    elif request.method == 'POST':
        serializer = ColumnSerializer(data=request.data)
        if serializer.is_valid():
            newRecord=serializer.save()
            serializedRecord=ColumnSerializer(newRecord)
            return Response(serializedRecord.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT','DELETE'])
def column(request,pk):
    column = Column.objects.get(pk=pk)
    if request.method == 'PUT':
        serializer = ColumnSerializer(column, data=request.data, context={'request': request})
        if serializer.is_valid():
            if request.data['colType'] in (column.ColType.NORMAL, column.ColType.ARCHIVE ) and column.colType == column.ColType.BACKLOG:
                return Response(status=status.HTTP_403_FORBIDDEN)
            elif request.data['colType'] in (column.ColType.NORMAL, column.ColType.BACKLOG ) and column.colType == column.ColType.ARCHIVE:
                return Response(status=status.HTTP_403_FORBIDDEN)
            elif request.data['colType'] != column.ColType.NORMAL:
                return Response(status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        if column.colType in (column.ColType.ARCHIVE, column.ColType.BACKLOG):
            return Response(status=status.HTTP_403_FORBIDDEN)
        column.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET','POST'])
def cards(request,columnKey):
    cards=Card.objects.filter(column=columnKey)
    if request.method=='GET':
        serializer=CardSerializer(cards,context={'request':request}, many=True)
        responseData={}
        responseData['cards']=serializer.data
        return Response(responseData,headers={'content_type':'application/json'})
    
    elif request.method=='POST':
        serializer=CardSerializer(data=request.data)
        if serializer.is_valid():
            newRecord=serializer.save()
            serializedRecord=CardSerializer(newRecord)
            return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def card(request,pk):
    card=Card.objects.get(pk=pk)
    if request.method=='PUT':
        serializer=CardSerializer(card,data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
