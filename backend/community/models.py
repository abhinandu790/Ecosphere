from django.conf import settings
from django.db import models


class CommunityEvent(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=180, blank=True)
    points = models.PositiveIntegerField(default=10)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='open')
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hosted_events')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='events', blank=True)
    is_virtual = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['starts_at']

    def __str__(self):
        return f"{self.name} ({self.status})"
