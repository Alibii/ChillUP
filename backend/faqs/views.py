from rest_framework import permissions, viewsets

from .models import FaqItem
from .serializers import FaqItemSerializer


class FaqItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FaqItem.objects.filter(is_active=True)
    serializer_class = FaqItemSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
