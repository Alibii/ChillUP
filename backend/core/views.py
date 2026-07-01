from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from partners.models import Partner
from partners.serializers import PartnerSerializer
from visits.models import Visit
from visits.serializers import VisitSerializer


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class DashboardOverviewView(APIView):
    """Powers the dashboard "Обзор" tab: this-month usage, a rough savings
    estimate, recent visits, and a few not-yet-visited recommendations.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        this_month = Visit.objects.filter(user=user, checked_in_at__year=now.year, checked_in_at__month=now.month)
        last_month_date = (now.replace(day=1) - timezone.timedelta(days=1))
        last_month = Visit.objects.filter(
            user=user, checked_in_at__year=last_month_date.year, checked_in_at__month=last_month_date.month
        )

        visits_this_month = this_month.count()
        visits_last_month = last_month.count()
        hours_played = sum(v.duration_minutes for v in this_month) / 60

        subscription = getattr(user, "subscription", None)
        plan = subscription.plan if subscription else None

        if plan and plan.max_visits_per_month:
            usage_percent = min(100, round(visits_this_month / plan.max_visits_per_month * 100))
        else:
            # No hard cap on this plan - show engagement against a rough
            # "typical active month" baseline rather than a real limit.
            usage_percent = min(100, round(visits_this_month / 30 * 100))

        avg_pay_per_visit = Decimal(str(getattr(settings, "ESTIMATED_PAY_PER_VISIT_KZT", 2000)))
        monthly_price = plan.monthly_price if plan else Decimal(0)
        money_saved = max(Decimal(0), (avg_pay_per_visit * visits_this_month) - monthly_price)

        recent_visits = Visit.objects.filter(user=user).select_related("partner").order_by("-checked_in_at")[:4]

        visited_partner_ids = Visit.objects.filter(user=user).values_list("partner_id", flat=True)
        recommendations_qs = Partner.objects.filter(is_active=True).exclude(pk__in=visited_partner_ids)
        if plan:
            recommendations_qs = recommendations_qs.filter(tier_rank__lte=plan.tier_rank)
            if plan.allowed_categories.exists():
                recommendations_qs = recommendations_qs.filter(category__in=plan.allowed_categories.all())
        recommendations = recommendations_qs.select_related("category").order_by("?")[:4]

        return Response(
            {
                "visits_this_month": visits_this_month,
                "visits_last_month": visits_last_month,
                "visits_delta": visits_this_month - visits_last_month,
                "hours_played": round(hours_played, 1),
                "usage_percent": usage_percent,
                "money_saved": money_saved,
                "currency": plan.currency if plan else "KZT",
                "recent_visits": VisitSerializer(recent_visits, many=True).data,
                "recommendations": PartnerSerializer(recommendations, many=True).data,
            }
        )
