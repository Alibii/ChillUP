from rest_framework import serializers

from plans.models import Plan
from plans.serializers import PlanSerializer

from .models import Payment, PaymentMethod, UserSubscription


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    has_access = serializers.BooleanField(read_only=True)
    is_trialing = serializers.BooleanField(read_only=True)
    visits_used_this_month = serializers.SerializerMethodField()

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "plan",
            "status",
            "period",
            "trial_ends_at",
            "current_period_start",
            "current_period_end",
            "cancel_at_period_end",
            "canceled_at",
            "frozen_until",
            "has_access",
            "is_trialing",
            "visits_used_this_month",
        ]

    def get_visits_used_this_month(self, obj):
        return obj.visits_used_this_month()


class ChangePlanSerializer(serializers.Serializer):
    plan = serializers.SlugRelatedField(slug_field="key", queryset=Plan.objects.filter(is_active=True))
    period = serializers.ChoiceField(choices=["month", "year"], required=False)


class CancelSubscriptionSerializer(serializers.Serializer):
    immediate = serializers.BooleanField(required=False, default=False)


class FreezeSubscriptionSerializer(serializers.Serializer):
    months = serializers.IntegerField(min_value=1, max_value=3)


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "brand", "last4", "exp_month", "exp_year", "is_default", "provider", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_last4(self, value):
        if not value.isdigit() or len(value) != 4:
            raise serializers.ValidationError("Ожидаются последние 4 цифры карты.")
        return value


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "amount", "currency", "status", "description", "created_at"]
