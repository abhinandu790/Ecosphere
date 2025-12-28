from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
<<<<<<< HEAD
    username = serializers.CharField(required=False, allow_blank=True)
=======
>>>>>>> main

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
<<<<<<< HEAD
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
=======
>>>>>>> main
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'eco_score',
            'badges',
            'streak_days',
            'profile_meta',
        ]
        read_only_fields = ['username', 'role']
