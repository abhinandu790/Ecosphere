from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    USER = 'user'
    ADMIN = 'admin'
    ROLE_CHOICES = [
        (USER, 'User'),
        (ADMIN, 'Admin'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=USER)
    eco_score = models.FloatField(default=0)
    badges = models.JSONField(default=list, blank=True)
    streak_days = models.PositiveIntegerField(default=0)
    profile_meta = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
