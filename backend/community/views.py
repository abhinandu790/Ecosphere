from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from ecoactions.models import EcoAction
from .models import CommunityEvent
from .serializers import CommunityEventSerializer, ParticipantSerializer

User = get_user_model()


class CommunityEventViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CommunityEvent.objects.filter(status__in=['open', 'completed']).prefetch_related('participants')

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        event = self.get_object()
        event.participants.add(request.user)
        return Response({'status': 'joined'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        event = self.get_object()
        event.status = 'completed'
        event.save(update_fields=['status'])
        request.user.eco_score += event.points
        badges = set(request.user.badges)
        badges.add('Community Hero')
        request.user.badges = list(badges)
        request.user.save(update_fields=['eco_score', 'badges'])
        return Response({'status': 'completed', 'eco_score': request.user.eco_score})


class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        top_users = User.objects.annotate(
            action_count=Count('eco_actions'),
            total_carbon=Sum('eco_actions__carbon_kg'),
        ).order_by('-eco_score')[:10]
        serializer = ParticipantSerializer(top_users, many=True)
        return Response({'leaders': serializer.data})
