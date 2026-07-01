from django.db import transaction
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services
from .models import Payment, PaymentMethod, UserSubscription
from .serializers import (
    CancelSubscriptionSerializer,
    ChangePlanSerializer,
    FreezeSubscriptionSerializer,
    PaymentMethodSerializer,
    PaymentSerializer,
    UserSubscriptionSerializer,
)


class MySubscriptionView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSubscriptionSerializer

    def get_object(self):
        subscription = getattr(self.request.user, "subscription", None)
        if subscription is None:
            from rest_framework.exceptions import NotFound

            raise NotFound("Подписка не найдена. Оформите тариф.")
        return subscription


class _SubscriptionActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_subscription(self):
        subscription = getattr(self.request.user, "subscription", None)
        if subscription is None:
            from rest_framework.exceptions import NotFound

            raise NotFound("Подписка не найдена. Оформите тариф.")
        return subscription

    def respond(self, subscription):
        return Response(UserSubscriptionSerializer(subscription).data)


class ChangePlanView(_SubscriptionActionView):
    def post(self, request):
        serializer = ChangePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription = services.change_plan(self.get_subscription(), **serializer.validated_data)
        return self.respond(subscription)


class CancelSubscriptionView(_SubscriptionActionView):
    def post(self, request):
        serializer = CancelSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription = services.cancel_subscription(self.get_subscription(), **serializer.validated_data)
        return self.respond(subscription)


class ResumeSubscriptionView(_SubscriptionActionView):
    def post(self, request):
        try:
            subscription = services.resume_subscription(self.get_subscription())
        except services.SubscriptionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return self.respond(subscription)


class FreezeSubscriptionView(_SubscriptionActionView):
    def post(self, request):
        serializer = FreezeSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            subscription = services.freeze_subscription(self.get_subscription(), **serializer.validated_data)
        except services.SubscriptionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return self.respond(subscription)


class UnfreezeSubscriptionView(_SubscriptionActionView):
    def post(self, request):
        try:
            subscription = services.unfreeze_subscription(self.get_subscription())
        except services.SubscriptionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return self.respond(subscription)


class PaymentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentMethodViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentMethodSerializer
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            is_first = not PaymentMethod.objects.filter(user=self.request.user).exists()
            instance = serializer.save(user=self.request.user, is_default=is_first)
            if not is_first and serializer.validated_data.get("is_default"):
                PaymentMethod.objects.filter(user=self.request.user).exclude(pk=instance.pk).update(is_default=False)

    @action(detail=True, methods=["post"], url_path="set-default")
    def set_default(self, request, pk=None):
        method = self.get_object()
        PaymentMethod.objects.filter(user=request.user).update(is_default=False)
        method.is_default = True
        method.save(update_fields=["is_default"])
        return Response(PaymentMethodSerializer(method).data)
