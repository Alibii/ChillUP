from django.conf import settings
from django.db import models
from django.utils import timezone


class Visit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="visits")
    partner = models.ForeignKey("partners.Partner", on_delete=models.PROTECT, related_name="visits")

    checked_in_at = models.DateTimeField(default=timezone.now)
    checked_out_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-checked_in_at"]

    def __str__(self):
        return f"{self.user.email} @ {self.partner.name} · {self.checked_in_at:%Y-%m-%d %H:%M}"

    @property
    def is_open(self):
        return self.checked_out_at is None

    @property
    def duration_minutes(self):
        end = self.checked_out_at or timezone.now()
        return max(0, int((end - self.checked_in_at).total_seconds() // 60))
