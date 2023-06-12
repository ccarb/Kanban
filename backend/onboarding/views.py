from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import UserSerializer

# Create your views here.
@api_view(['POST'])
def onboarding(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        newRecord=serializer.save()
        serializedRecord=UserSerializer(newRecord, context={'request':request})
        return Response(serializedRecord.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
