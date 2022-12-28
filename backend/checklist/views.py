#from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Checklist, ChecklistItem
from .serializers import *

@api_view(['GET', 'POST', 'DELETE'])
def checklists(request):
    if request.method == 'GET':
        data = Checklist.objects.all()

        serializer = ChecklistSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ChecklistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        checklist = Checklist.objects.get(pk=request.GET.get('pk'))
        checklist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT', 'GET', 'DELETE'])
def checklistItems(request, fk):
    checklistItems = ChecklistItem.objects.filter(checklistId=fk)
    

    if request.method == 'GET':
        serializer = ChecklistItemSerializer(checklistItems, context={'request': request}, many=True)
        response={}
        response['checklistItems']=serializer.data
        return Response(response)

    if request.method == 'PUT':
        serializer = ChecklistItemSerializer(checklistItems, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        checklistItems.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)