from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, PartnerViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("", PartnerViewSet, basename="partner")

app_name = "partners"
urlpatterns = router.urls
