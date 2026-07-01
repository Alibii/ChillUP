from django.db.models import Q
from rest_framework import permissions, viewsets

from core.constants import TIER_CHOICES
from core.pagination import StandardResultsPagination

from .models import Category, Partner
from .serializers import CategorySerializer, PartnerSerializer

TIER_RANK_BY_LABEL = {label: rank for rank, label in TIER_CHOICES}


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "key"
    pagination_class = None


class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        qs = Partner.objects.filter(is_active=True).select_related("category")

        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(name__icontains=q) | Q(city__icontains=q) | Q(address__icontains=q)
            )

        city = self.request.query_params.get("city")
        if city and city != "all":
            qs = qs.filter(city=city)

        category = self.request.query_params.get("category")
        if category and category != "all":
            qs = qs.filter(category__key=category)

        tier = self.request.query_params.get("tier")
        if tier and tier != "all":
            tier_rank = TIER_RANK_BY_LABEL.get(tier)
            qs = qs.filter(tier_rank=tier_rank) if tier_rank else qs.none()

        return qs
