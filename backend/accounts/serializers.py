from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from plans.models import Plan

from .models import NotificationPreference

User = get_user_model()


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "push_new_venues",
            "email_billing",
            "sms_checkin",
            "telegram_events",
        ]


class UserSerializer(serializers.ModelSerializer):
    notification_preference = NotificationPreferenceSerializer(read_only=True)
    initials = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "initials",
            "date_joined",
            "notification_preference",
        ]
        read_only_fields = ["id", "email", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    plan = serializers.SlugRelatedField(
        slug_field="key",
        queryset=Plan.objects.filter(is_active=True),
        write_only=True,
        required=False,
        allow_null=True,
    )
    period = serializers.ChoiceField(
        choices=["month", "year"], write_only=True, required=False, default="month"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "password",
            "plan",
            "period",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        from subscriptions.services import start_trial_subscription

        plan = validated_data.pop("plan", None)
        period = validated_data.pop("period", "month")
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)
        NotificationPreference.objects.create(user=user)

        plan = plan or Plan.objects.filter(is_active=True).order_by("order").first()
        if plan is not None:
            start_trial_subscription(user=user, plan=plan, period=period)

        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["login"],
            password=attrs["password"],
        )
        if not user:
            raise serializers.ValidationError(
                "Неверный email/телефон или пароль."
            )
        if not user.is_active:
            raise serializers.ValidationError("Аккаунт отключён.")
        attrs["user"] = user
        return attrs
