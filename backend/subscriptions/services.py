from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.utils import timezone

from .models import Payment, UserSubscription
from .payments import get_payment_provider

MAX_FREEZE_MONTHS = 3


class SubscriptionError(Exception):
    pass


def _period_length(period: str) -> relativedelta:
    return relativedelta(years=1) if period == UserSubscription.PERIOD_YEAR else relativedelta(months=1)


def start_trial_subscription(*, user, plan, period=UserSubscription.PERIOD_MONTH) -> UserSubscription:
    now = timezone.now()
    trial_ends_at = now + timedelta(days=getattr(settings, "TRIAL_DAYS", 7))
    subscription, _ = UserSubscription.objects.update_or_create(
        user=user,
        defaults={
            "plan": plan,
            "period": period,
            "status": UserSubscription.STATUS_TRIALING,
            "trial_ends_at": trial_ends_at,
            "current_period_start": now,
            "current_period_end": trial_ends_at,
            "cancel_at_period_end": False,
            "canceled_at": None,
            "frozen_until": None,
        },
    )
    return subscription


def change_plan(subscription: UserSubscription, *, plan, period=None) -> UserSubscription:
    subscription.plan = plan
    if period:
        subscription.period = period
    subscription.save(update_fields=["plan", "period", "updated_at"])
    return subscription


def cancel_subscription(subscription: UserSubscription, *, immediate=False) -> UserSubscription:
    now = timezone.now()
    if immediate:
        subscription.status = UserSubscription.STATUS_CANCELED
        subscription.current_period_end = now
    subscription.cancel_at_period_end = True
    subscription.canceled_at = now
    subscription.save(update_fields=["status", "cancel_at_period_end", "canceled_at", "current_period_end", "updated_at"])
    return subscription


def resume_subscription(subscription: UserSubscription) -> UserSubscription:
    if subscription.status == UserSubscription.STATUS_CANCELED:
        raise SubscriptionError("Период уже закончился, отмену нельзя отменить — оформите подписку заново.")
    subscription.cancel_at_period_end = False
    subscription.canceled_at = None
    subscription.save(update_fields=["cancel_at_period_end", "canceled_at", "updated_at"])
    return subscription


def freeze_subscription(subscription: UserSubscription, *, months: int) -> UserSubscription:
    if not (1 <= months <= MAX_FREEZE_MONTHS):
        raise SubscriptionError(f"Заморозить можно от 1 до {MAX_FREEZE_MONTHS} месяцев.")
    now = timezone.now()
    if subscription.freeze_used_at and subscription.freeze_used_at > now - relativedelta(years=1):
        raise SubscriptionError("Заморозку можно использовать не чаще одного раза в год.")
    subscription.status = UserSubscription.STATUS_FROZEN
    subscription.frozen_until = now + relativedelta(months=months)
    subscription.freeze_used_at = now
    subscription.save(update_fields=["status", "frozen_until", "freeze_used_at", "updated_at"])
    return subscription


def unfreeze_subscription(subscription: UserSubscription) -> UserSubscription:
    if subscription.status != UserSubscription.STATUS_FROZEN:
        raise SubscriptionError("Подписка не заморожена.")
    now = timezone.now()
    # Push the paid period end back by however long the freeze actually lasted,
    # so the user doesn't lose access time they already paid for.
    frozen_elapsed = now - subscription.freeze_used_at
    subscription.status = UserSubscription.STATUS_ACTIVE
    subscription.current_period_end = subscription.current_period_end + frozen_elapsed
    subscription.frozen_until = None
    subscription.save(update_fields=["status", "current_period_end", "frozen_until", "updated_at"])
    return subscription


def charge_subscription_period(subscription: UserSubscription) -> Payment:
    """Charges the default payment method for one billing period and either
    advances the subscription (on success) or marks it expired (on failure).
    Called by the `process_subscriptions` management command when a
    trial/period ends. See subscriptions/payments.py for provider wiring.
    """
    plan = subscription.plan
    amount = plan.price_for_period(subscription.period)
    payment_method = subscription.user.payment_methods.filter(is_default=True).first()

    provider = get_payment_provider()
    result = provider.charge(
        user=subscription.user,
        amount=amount,
        currency=plan.currency,
        payment_method=payment_method,
        description=f"ChillUP · {plan.name} · {subscription.period}",
    )

    payment = Payment.objects.create(
        user=subscription.user,
        subscription=subscription,
        payment_method=payment_method,
        amount=amount,
        currency=plan.currency,
        status=Payment.STATUS_SUCCEEDED if result.success else Payment.STATUS_FAILED,
        provider=provider.name,
        provider_reference=result.provider_reference,
        description=f"Продление · {plan.name}",
    )

    if result.success:
        subscription.status = UserSubscription.STATUS_ACTIVE
        subscription.current_period_start = timezone.now()
        subscription.current_period_end = timezone.now() + _period_length(subscription.period)
        subscription.save(update_fields=["status", "current_period_start", "current_period_end", "updated_at"])
    else:
        subscription.status = UserSubscription.STATUS_EXPIRED
        subscription.save(update_fields=["status", "updated_at"])

    return payment
