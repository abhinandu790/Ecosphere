from rest_framework import serializers

from .models import EcoAction, Reminder


class EcoActionSerializer(serializers.ModelSerializer):
    impact_label = serializers.SerializerMethodField()

    class Meta:
        model = EcoAction
        fields = [
            'id',
            'category',
            'action_type',
            'carbon_kg',
            'packaging_type',
            'origin',
            'distance_km',
            'expiry_date',
            'disposal_method',
            'severity',
            'estimated_savings_kg',
            'receipt_url',
            'data',
            'impact_label',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'impact_label']

    def get_impact_label(self, obj):
        if obj.carbon_kg < 1:
            return 'Low'
        if obj.carbon_kg < 5:
            return 'Medium'
        return 'High'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        action = super().create(validated_data)
        profile = user
        profile.eco_score = profile.eco_score + validated_data.get('estimated_savings_kg', 0) - validated_data.get('carbon_kg', 0)
        profile.badges = self._derive_badges(profile)
        profile.save(update_fields=['eco_score', 'badges'])
        return action

    def _derive_badges(self, profile):
        badges = set(profile.badges)
        actions = profile.eco_actions.all()
        if actions.filter(category='waste', disposal_method='recycled').count() >= 5:
            badges.add('Zero Waste')
        if actions.filter(category='travel', estimated_savings_kg__gt=0).count() >= 5:
            badges.add('Transit Champ')
        if actions.filter(origin__iexact='local').count() >= 3:
            badges.add('Local Shopper')
        if actions.count() >= 10:
            badges.add('Eco Hero')
        return list(badges)


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'message', 'due_date', 'severity', 'delivered', 'action']
        read_only_fields = ['delivered']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
