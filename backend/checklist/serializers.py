from rest_framework import serializers
from .models import Checklist, ChecklistItem

class ChecklistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Checklist 
        fields = ('name', 'description')

class ChecklistItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChecklistItem
        fields = ('checklistId', 'name', 'done', 'order')