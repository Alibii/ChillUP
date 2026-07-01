from django.urls import path

from . import views

app_name = "visits"

urlpatterns = [
    path("qr-token/", views.QrTokenView.as_view(), name="qr-token"),
    path("checkin/", views.CheckinView.as_view(), name="checkin"),
    path("checkout/", views.CheckoutView.as_view(), name="checkout"),
    path("", views.VisitHistoryView.as_view(), name="history"),
]
