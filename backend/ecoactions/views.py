from django.db.models import Count, Sum
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EcoAction, Reminder
from .serializers import EcoActionSerializer, ReminderSerializer


class EcoActionViewSet(viewsets.ModelViewSet):
    serializer_class = EcoActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EcoAction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ImpactSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        actions = EcoAction.objects.filter(user=request.user)
        totals_by_category = actions.values('category').annotate(total=Sum('carbon_kg'))
        severity_counts = actions.values('severity').annotate(count=Count('id'))
        reminders = Reminder.objects.filter(user=request.user, delivered=False).order_by('due_date')

        breakdown = {item['category']: item['total'] or 0 for item in totals_by_category}
        severity = {item['severity']: item['count'] for item in severity_counts}

        data = {
            'total_carbon': actions.aggregate(total=Sum('carbon_kg')).get('total') or 0,
            'total_savings': actions.aggregate(total=Sum('estimated_savings_kg')).get('total') or 0,
            'breakdown': breakdown,
            'severity': severity,
            'badges': request.user.badges,
            'reminders': ReminderSerializer(reminders, many=True).data,
        }
        return Response(data)
