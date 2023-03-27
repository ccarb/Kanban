from rest_framework import serializers
from models import Card, Column, Board

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        field = '__all__'

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        field = '__all__'

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        field = '__all__'

class KanbanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        field = '__all__'
        read_only_fields='__all__'
        depth = 3