from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import CreateUserSerializer

# Create your views here.
@api_view(['POST'])
def onboarding(request):
    serializer = CreateUserSerializer(data=request.data)
    if serializer.is_valid():
        newRecord=serializer.save()
        serializedRecord=CreateUserSerializer(newRecord, context={'request':request})
        return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
