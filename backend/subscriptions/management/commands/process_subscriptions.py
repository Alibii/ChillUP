"""Advances subscription lifecycles: charges trials/periods that have ended,
and finalizes cancellations whose period has run out.

There's no task queue (Celery) in this project yet, so schedule this with
Windows Task Scheduler (or cron in production) to run every few minutes, e.g.:

    <venv>\\Scripts\\python.exe manage.py process_subscriptions

This is intentionally a plain management command rather than a Celery task so
it has no extra infrastructure dependency to run locally; swap it for a
scheduled Celery task if/when this project adopts Celery.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone

from subscriptions.models import UserSubscription
from subscriptions.services import charge_subscription_period


class Command(BaseCommand):
    help = "Processes subscription renewals, trial conversions, and expirations."

    def handle(self, *args, **options):
        now = timezone.now()
        due = UserSubscription.objects.filter(
            status__in=[UserSubscription.STATUS_TRIALING, UserSubscription.STATUS_ACTIVE],
            current_period_end__lte=now,
        )

        charged, expired = 0, 0
        for subscription in due:
            if subscription.cancel_at_period_end:
                subscription.status = UserSubscription.STATUS_CANCELED
                subscription.save(update_fields=["status", "updated_at"])
                expired += 1
                continue
            charge_subscription_period(subscription)
            charged += 1

        self.stdout.write(self.style.SUCCESS(f"Продлено/списано: {charged}. Завершено по отмене: {expired}."))
