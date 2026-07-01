from django.conf import settings
from django.db import models
from django.utils import timezone


class UserSubscription(models.Model):
    STATUS_TRIALING = "trialing"
    STATUS_ACTIVE = "active"
    STATUS_FROZEN = "frozen"
    STATUS_CANCELED = "canceled"
    STATUS_EXPIRED = "expired"
    STATUS_CHOICES = [
        (STATUS_TRIALING, "Пробный период"),
        (STATUS_ACTIVE, "Активна"),
        (STATUS_FROZEN, "Заморожена"),
        (STATUS_CANCELED, "Отменена"),
        (STATUS_EXPIRED, "Истекла"),
    ]

    PERIOD_MONTH = "month"
    PERIOD_YEAR = "year"
    PERIOD_CHOICES = [(PERIOD_MONTH, "Месяц"), (PERIOD_YEAR, "Год")]

    ACTIVE_STATUSES = {STATUS_TRIALING, STATUS_ACTIVE, STATUS_FROZEN}

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription"
    )
    plan = models.ForeignKey("plans.Plan", on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_TRIALING)
    period = models.CharField(max_length=8, choices=PERIOD_CHOICES, default=PERIOD_MONTH)

    trial_ends_at = models.DateTimeField(null=True, blank=True)
    current_period_start = models.DateTimeField(default=timezone.now)
    current_period_end = models.DateTimeField()

    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)

    frozen_until = models.DateTimeField(null=True, blank=True)
    freeze_used_at = models.DateTimeField(
        null=True, blank=True, help_text="Когда в последний раз использовалась заморозка (лимит: раз в год)."
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} · {self.plan.name} · {self.status}"

    @property
    def is_trialing(self):
        return self.status == self.STATUS_TRIALING and self.trial_ends_at and self.trial_ends_at > timezone.now()

    @property
    def has_access(self):
        now = timezone.now()
        if self.status == self.STATUS_FROZEN:
            return False
        if self.status not in self.ACTIVE_STATUSES:
            return False
        if self.status == self.STATUS_TRIALING:
            return bool(self.trial_ends_at and self.trial_ends_at > now)
        return self.current_period_end > now

    def visits_used_this_month(self):
        now = timezone.now()
        return self.user.visits.filter(
            checked_in_at__year=now.year, checked_in_at__month=now.month
        ).count()


class PaymentMethod(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payment_methods"
    )
    brand = models.CharField(max_length=32, default="Visa")
    last4 = models.CharField(max_length=4)
    exp_month = models.PositiveSmallIntegerField()
    exp_year = models.PositiveSmallIntegerField()
    is_default = models.BooleanField(default=False)

    # Set by the payment provider's client-side tokenization (Kaspi/CloudPayments/etc).
    # Raw card numbers must never reach this model or this server.
    provider = models.CharField(max_length=32, default="mock")
    provider_token = models.CharField(max_length=128, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.brand} •••• {self.last4}"


class Payment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_SUCCEEDED = "succeeded"
    STATUS_FAILED = "failed"
    STATUS_REFUNDED = "refunded"
    STATUS_CHOICES = [
        (STATUS_PENDING, "В обработке"),
        (STATUS_SUCCEEDED, "Успешно"),
        (STATUS_FAILED, "Ошибка"),
        (STATUS_REFUNDED, "Возврат"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    subscription = models.ForeignKey(
        UserSubscription, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments"
    )
    payment_method = models.ForeignKey(
        PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="KZT")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)

    provider = models.CharField(max_length=32, default="mock")
    provider_reference = models.CharField(max_length=128, blank=True)
    description = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} · {self.amount} {self.currency} · {self.status}"
