from rest_framework import permissions, viewsets

from .models import Plan
from .serializers import PlanSerializer


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True).prefetch_related("features", "allowed_categories")
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "key"
