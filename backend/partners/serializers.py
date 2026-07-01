from rest_framework import serializers

from .models import Category, Partner


class CategorySerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "key", "label", "icon", "description", "count"]

    def get_count(self, obj):
        return obj.partners.filter(is_active=True).count()


class PartnerSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="key", read_only=True)
    tier_label = serializers.CharField(read_only=True)

    class Meta:
        model = Partner
        fields = [
            "id",
            "name",
            "category",
            "city",
            "address",
            "tier_rank",
            "tier_label",
            "tags",
        ]
