from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.pagination import StandardResultsPagination

from .authentication import PartnerKeyAuthentication
from .models import Visit
from .serializers import CheckinSerializer, CheckoutSerializer, VisitSerializer
from .tokens import issue_qr_token, resolve_qr_token

User = get_user_model()


class QrTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {"token": issue_qr_token(request.user), "ttl_seconds": 60}
        )


class VisitHistoryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VisitSerializer
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        return Visit.objects.filter(user=self.request.user).select_related("partner")


class CheckinView(APIView):
    """Called by a partner reception terminal, authenticated via
    `X-Partner-Key` (see `PartnerKeyAuthentication`), with the user's QR
    token in the body.
    """

    authentication_classes = [PartnerKeyAuthentication]
    permission_classes = [permissions.AllowAny]  # gated manually below on request.auth (the Partner)

    def post(self, request):
        partner = request.auth
        if partner is None:
            return Response({"detail": "Укажите X-Partner-Key."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = CheckinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = resolve_qr_token(serializer.validated_data["token"])
        if user_id is None:
            return Response({"detail": "QR-код недействителен или истёк."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)

        subscription = getattr(user, "subscription", None)
        if subscription is None or not subscription.has_access:
            return Response({"detail": "Подписка неактивна."}, status=status.HTTP_403_FORBIDDEN)

        plan = subscription.plan
        if plan.tier_rank < partner.tier_rank:
            return Response(
                {"detail": f"Тариф «{plan.name}» не открывает доступ к заведениям уровня «{partner.tier_label}»."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if not plan.allows_category(partner.category):
            return Response(
                {"detail": f"Тариф «{plan.name}» не включает категорию «{partner.category.label}»."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if plan.max_visits_per_month is not None and subscription.visits_used_this_month() >= plan.max_visits_per_month:
            return Response(
                {"detail": "Лимит посещений по тарифу на этот месяц исчерпан."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if Visit.objects.filter(user=user, checked_out_at__isnull=True).exists():
            return Response({"detail": "У пользователя уже есть открытое посещение."}, status=status.HTTP_400_BAD_REQUEST)

        visit = Visit.objects.create(user=user, partner=partner)
        return Response(VisitSerializer(visit).data, status=status.HTTP_201_CREATED)


class CheckoutView(APIView):
    authentication_classes = [PartnerKeyAuthentication]
    permission_classes = [permissions.AllowAny]  # gated manually below on request.auth (the Partner)

    def post(self, request):
        partner = request.auth
        if partner is None:
            return Response({"detail": "Укажите X-Partner-Key."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = resolve_qr_token(serializer.validated_data["token"])
        if user_id is None:
            return Response({"detail": "QR-код недействителен или истёк."}, status=status.HTTP_400_BAD_REQUEST)

        from django.utils import timezone

        visit = (
            Visit.objects.filter(user_id=user_id, partner=partner, checked_out_at__isnull=True)
            .order_by("-checked_in_at")
            .first()
        )
        if visit is None:
            return Response({"detail": "Открытое посещение не найдено."}, status=status.HTTP_404_NOT_FOUND)

        visit.checked_out_at = timezone.now()
        visit.save(update_fields=["checked_out_at"])
        return Response(VisitSerializer(visit).data)
