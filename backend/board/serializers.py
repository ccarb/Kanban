from rest_framework import serializers
from .models import Card, Column, Board

class CardListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        card_mapping = {card.id: card for card in instance}
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for card_id, data in data_mapping.items():
            card = card_mapping.get(card_id, None)
            if card is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(card, data))

        return ret

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'
        list_serializer_class = CardListSerializer
        extra_kwargs = {'id': {'read_only': False, 'required':False}}

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'