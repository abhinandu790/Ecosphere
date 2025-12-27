from django.conf import settings
from django.db import models


class EcoAction(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food'),
        ('travel', 'Travel'),
        ('energy', 'Energy'),
        ('waste', 'Waste'),
    ]

    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    DISPOSAL_CHOICES = [
        ('recycled', 'Recycled'),
        ('reused', 'Reused'),
        ('composted', 'Composted'),
        ('landfill', 'Landfill'),
        ('n/a', 'N/A'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='eco_actions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    action_type = models.CharField(max_length=120)
    carbon_kg = models.FloatField(default=0)
    packaging_type = models.CharField(max_length=100, blank=True)
    origin = models.CharField(max_length=100, blank=True)
    distance_km = models.FloatField(default=0)
    expiry_date = models.DateField(null=True, blank=True)
    disposal_method = models.CharField(max_length=50, choices=DISPOSAL_CHOICES, default='n/a')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    estimated_savings_kg = models.FloatField(default=0)
    receipt_url = models.URLField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.category} ({self.carbon_kg} kg)"


class Reminder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminders')
    action = models.ForeignKey(EcoAction, on_delete=models.CASCADE, related_name='reminders')
    message = models.CharField(max_length=255)
    due_date = models.DateField()
    severity = models.CharField(max_length=20, default='medium')
    delivered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"Reminder for {self.action} on {self.due_date}"
