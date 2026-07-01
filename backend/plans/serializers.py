from rest_framework import serializers

from .models import Plan, PlanFeature


class PlanFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanFeature
        fields = ["text", "included"]


class PlanSerializer(serializers.ModelSerializer):
    features = PlanFeatureSerializer(many=True, read_only=True)
    monthly_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    yearly_price = serializers.SerializerMethodField()
    tier_label = serializers.CharField(source="get_tier_rank_display", read_only=True)
    allowed_categories = serializers.SlugRelatedField(
        slug_field="key", many=True, read_only=True
    )

    class Meta:
        model = Plan
        fields = [
            "id",
            "key",
            "name",
            "tagline",
            "tier_rank",
            "tier_label",
            "monthly_price",
            "yearly_price",
            "currency",
            "yearly_discount_pct",
            "max_visits_per_month",
            "allowed_categories",
            "is_featured",
            "badge",
            "features",
        ]

    def get_yearly_price(self, obj):
        return obj.price_for_period("year")
