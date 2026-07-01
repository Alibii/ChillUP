from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("payment-methods", views.PaymentMethodViewSet, basename="payment-method")

app_name = "subscriptions"

urlpatterns = [
    path("me/", views.MySubscriptionView.as_view(), name="me"),
    path("change-plan/", views.ChangePlanView.as_view(), name="change-plan"),
    path("cancel/", views.CancelSubscriptionView.as_view(), name="cancel"),
    path("resume/", views.ResumeSubscriptionView.as_view(), name="resume"),
    path("freeze/", views.FreezeSubscriptionView.as_view(), name="freeze"),
    path("unfreeze/", views.UnfreezeSubscriptionView.as_view(), name="unfreeze"),
    path("payments/", views.PaymentListView.as_view(), name="payments"),
] + router.urls
