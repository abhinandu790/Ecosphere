from django.contrib import admin

from .models import EcoAction, Reminder


@admin.register(EcoAction)
class EcoActionAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'action_type', 'carbon_kg', 'severity', 'created_at')
    list_filter = ('category', 'severity')
    search_fields = ('action_type', 'user__username')


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'due_date', 'severity', 'delivered')
    list_filter = ('severity', 'delivered')
    search_fields = ('message', 'user__username')
