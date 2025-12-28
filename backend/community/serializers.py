from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import CommunityEvent

User = get_user_model()


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'eco_score', 'badges']


class CommunityEventSerializer(serializers.ModelSerializer):
    host = ParticipantSerializer(read_only=True)
    participants = ParticipantSerializer(read_only=True, many=True)
    participant_count = serializers.SerializerMethodField()

    class Meta:
        model = CommunityEvent
        fields = [
            'id',
            'name',
            'description',
            'location',
            'points',
            'starts_at',
            'ends_at',
            'status',
            'is_virtual',
            'host',
            'participants',
            'participant_count',
        ]

    def get_participant_count(self, obj):
        return obj.participants.count()

    def create(self, validated_data):
        validated_data['host'] = self.context['request'].user
        return super().create(validated_data)
