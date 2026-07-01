from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/auth/", include("accounts.urls")),
    path("api/plans/", include("plans.urls")),
    path("api/partners/", include("partners.urls")),
    path("api/subscriptions/", include("subscriptions.urls")),
    path("api/visits/", include("visits.urls")),
    path("api/faq/", include("faqs.urls")),
    path("api/", include("core.urls")),
]
