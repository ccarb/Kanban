#from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Checklist, ChecklistItem
from .serializers import *

@api_view(['GET', 'POST'])
def checklists(request):
    if request.method == 'GET':
        data = Checklist.objects.all()

        serializer = ChecklistSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)
    
    elif request.method == 'POST':#create checklist
        serializer = ChecklistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
def checklist(request, pk):
    checklist = Checklist.objects.get(pk=pk)
    if request.method=='GET':#get checlikst info
        serializer= ChecklistItemSerializer(checklist,context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':#edit checklist
        serializer = ChecklistSerializer(checklistItems, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':#delete checklist
        checklist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET','POST'])
def checklistItems(request, fk):
    checklistItems = ChecklistItem.objects.filter(checklistId=fk)
    if request.method == 'GET':
        serializer = ChecklistItemSerializer(checklistItems, context={'request': request}, many=True)
        response={}
        response['checklistItems']=serializer.data
        return Response(response)

    if request.method == 'POST':#create checklist
        serializer = ChecklistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view( ['PUT','DELETE'])
def checklistItem(request,pk):
    checklistItems = ChecklistItem.objects.get(pk=pk)
    if request.method == 'PUT':
        serializer = ChecklistItemSerializer(checklistItems, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        checklistItems.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)