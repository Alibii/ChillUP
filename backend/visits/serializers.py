from rest_framework import serializers

from .models import Visit


class VisitSerializer(serializers.ModelSerializer):
    partner_name = serializers.CharField(source="partner.name", read_only=True)
    partner_city = serializers.CharField(source="partner.city", read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Visit
        fields = [
            "id",
            "partner",
            "partner_name",
            "partner_city",
            "checked_in_at",
            "checked_out_at",
            "duration_minutes",
        ]


class CheckinSerializer(serializers.Serializer):
    token = serializers.CharField()


class CheckoutSerializer(serializers.Serializer):
    token = serializers.CharField()
