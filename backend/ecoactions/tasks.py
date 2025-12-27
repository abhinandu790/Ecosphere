from datetime import date

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Sum

from .models import EcoAction, Reminder

User = get_user_model()


@shared_task
def send_due_reminders():
    today = date.today()
    reminders = Reminder.objects.filter(due_date__lte=today, delivered=False)
    delivered_count = reminders.update(delivered=True)
    return f"Delivered {delivered_count} reminders"


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
