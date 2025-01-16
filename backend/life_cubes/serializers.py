from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Tag, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'birth_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'created_at')
        read_only_fields = ('id', 'created_at')

class EventSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = (
            'id', 'user', 'week_index', 'day_of_week', 'title',
            'description', 'icon', 'color', 'tags', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        event = Event.objects.create(**validated_data)
        
        # Handle tags
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            event.tags.add(tag)
        
        return event

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        
        # Update Event fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update tags
        if tags_data:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, _ = Tag.objects.get_or_create(**tag_data)
                instance.tags.add(tag)

        return instance 