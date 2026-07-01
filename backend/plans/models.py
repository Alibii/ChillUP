from decimal import Decimal

from django.db import models

from core.constants import TIER_CHOICES


class Plan(models.Model):
    key = models.SlugField(max_length=32, unique=True)
    name = models.CharField(max_length=64)
    tagline = models.CharField(max_length=200, blank=True)
    tier_rank = models.PositiveSmallIntegerField(choices=TIER_CHOICES, unique=True)

    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="KZT")
    yearly_discount_pct = models.PositiveSmallIntegerField(
        default=20, help_text="Скидка при годовой оплате, %"
    )

    # null == unlimited visits per month
    max_visits_per_month = models.PositiveIntegerField(null=True, blank=True)
    allowed_categories = models.ManyToManyField(
        "partners.Category",
        related_name="plans",
        blank=True,
        help_text="Пусто = доступны все категории.",
    )

    is_featured = models.BooleanField(default=False)
    badge = models.CharField(max_length=32, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name

    def price_for_period(self, period: str) -> Decimal:
        if period == "year":
            multiplier = Decimal(12) * (Decimal(100 - self.yearly_discount_pct) / Decimal(100))
            return (self.monthly_price * multiplier).quantize(Decimal("1"))
        return self.monthly_price

    def allows_category(self, category) -> bool:
        return not self.allowed_categories.exists() or self.allowed_categories.filter(
            pk=category.pk
        ).exists()


class PlanFeature(models.Model):
    plan = models.ForeignKey(Plan, related_name="features", on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    included = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.plan.name}: {self.text}"
