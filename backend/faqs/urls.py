from rest_framework.routers import DefaultRouter

from .views import FaqItemViewSet

router = DefaultRouter()
router.register("", FaqItemViewSet, basename="faq")

app_name = "faqs"
urlpatterns = router.urls
