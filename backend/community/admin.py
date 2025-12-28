from django.contrib import admin

from .models import CommunityEvent


@admin.register(CommunityEvent)
class CommunityEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'points', 'starts_at', 'location')
    list_filter = ('status',)
    search_fields = ('name', 'location')
