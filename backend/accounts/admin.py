from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Eco Profile', {'fields': ('role', 'eco_score', 'badges', 'streak_days', 'profile_meta')}),
    )
    list_display = ('username', 'email', 'role', 'eco_score', 'streak_days')
    list_filter = ('role',)
