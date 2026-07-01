from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("health/", views.HealthView.as_view(), name="health"),
    path("dashboard/overview/", views.DashboardOverviewView.as_view(), name="dashboard-overview"),
]
