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
            name='CommunityEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=180)),
                ('description', models.TextField(blank=True)),
                ('location', models.CharField(blank=True, max_length=180)),
                ('points', models.PositiveIntegerField(default=10)),
                ('starts_at', models.DateTimeField(blank=True, null=True)),
                ('ends_at', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('open', 'Open'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='open', max_length=32)),
                ('is_virtual', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosted_events', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(blank=True, related_name='events', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['starts_at'],
            },
        ),
    ]
