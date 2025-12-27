from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EcoAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('food', 'Food'), ('travel', 'Travel'), ('energy', 'Energy'), ('waste', 'Waste')], max_length=20)),
                ('action_type', models.CharField(max_length=120)),
                ('carbon_kg', models.FloatField(default=0)),
                ('packaging_type', models.CharField(blank=True, max_length=100)),
                ('origin', models.CharField(blank=True, max_length=100)),
                ('distance_km', models.FloatField(default=0)),
                ('expiry_date', models.DateField(blank=True, null=True)),
                ('disposal_method', models.CharField(choices=[('recycled', 'Recycled'), ('reused', 'Reused'), ('composted', 'Composted'), ('landfill', 'Landfill'), ('n/a', 'N/A')], default='n/a', max_length=50)),
                ('severity', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=20)),
                ('estimated_savings_kg', models.FloatField(default=0)),
                ('receipt_url', models.URLField(blank=True)),
                ('data', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='eco_actions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Reminder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=255)),
                ('due_date', models.DateField()),
                ('severity', models.CharField(default='medium', max_length=20)),
                ('delivered', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('action', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reminders', to='ecoactions.ecoaction')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reminders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['due_date'],
            },
        ),
    ]
