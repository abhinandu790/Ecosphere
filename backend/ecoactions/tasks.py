from datetime import date

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.core.mail import send_mail

from .models import EcoAction, Reminder

User = get_user_model()


@shared_task
def send_due_reminders():
    today = date.today()
    reminders = Reminder.objects.filter(due_date__lte=today, delivered=False)
    delivered_count = 0

    for reminder in reminders.select_related('user', 'action'):
        user_email = reminder.user.email
        subject = f"EcoSphere reminder: {reminder.action.action_type} due soon"
        message = (
            f"Hi {reminder.user.username or reminder.user.email},\n\n"
            f"This is your EcoSphere reminder for {reminder.action.action_type}.\n"
            f"Due date: {reminder.due_date}\n"
            f"Impact: {reminder.action.carbon_kg} kg CO₂e (severity: {reminder.severity}).\n\n"
            "Log disposal, upload a receipt, or mark as reused/composted to protect your EcoScore.\n\n"
            "— EcoSphere automations"
        )

        if user_email:
            send_mail(subject, message, None, [user_email], fail_silently=True)

        reminder.delivered = True
        reminder.save(update_fields=['delivered'])
        delivered_count += 1

    return f"Delivered {delivered_count} reminders with notifications"


@shared_task
def recompute_scores_and_badges():
    for user in User.objects.all():
        actions = EcoAction.objects.filter(user=user)
        carbon = actions.aggregate(total=Sum('carbon_kg')).get('total') or 0
        savings = actions.aggregate(total=Sum('estimated_savings_kg')).get('total') or 0
        eco_score = max(0, savings - carbon)

        badges = set(user.badges)
        if actions.filter(disposal_method='recycled').count() >= 5:
            badges.add('Zero Waste')
        if actions.filter(origin__iexact='local').count() >= 3:
            badges.add('Local Shopper')
        if actions.filter(category='travel', estimated_savings_kg__gt=0).count() >= 5:
            badges.add('Transit Champ')
        if actions.count() >= 10:
            badges.add('Eco Hero')

        user.eco_score = eco_score
        user.badges = list(badges)
        user.save(update_fields=['eco_score', 'badges'])
    return 'Scores and badges updated'
