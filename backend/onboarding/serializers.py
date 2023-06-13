from rest_framework import serializers
from django.contrib.auth.models import User
from django.core import exceptions
import django.contrib.auth.password_validation as validators

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        errors = dict()

        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)
         
        if errors:
            raise serializers.ValidationError(errors)
          
        return super(CreateUserSerializer, self).validate(data)