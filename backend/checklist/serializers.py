from rest_framework import serializers
from .models import Checklist, ChecklistItem

class ChecklistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Checklist 
        fields = ('pk', 'name', 'description')

class ChecklistItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChecklistItem
        fields = ('pk', 'checklistId', 'name', 'done', 'order')