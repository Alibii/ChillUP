import uuid

from django.db import models

from core.constants import TIER_CHOICES


class Category(models.Model):
    key = models.SlugField(max_length=32, unique=True)
    label = models.CharField(max_length=64)
    icon = models.CharField(max_length=32, help_text="Имя иконки во фронтенде (см. Icon в components.jsx)")
    description = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.label


class Partner(models.Model):
    name = models.CharField(max_length=150)
    category = models.ForeignKey(Category, related_name="partners", on_delete=models.PROTECT)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    tier_rank = models.PositiveSmallIntegerField(
        choices=TIER_CHOICES, help_text="Минимальный тариф, открывающий доступ к заведению."
    )
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    api_key = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Ключ терминала ресепшена для чек-ина (заголовок X-Partner-Key).",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.city})"

    @property
    def tier_label(self):
        return self.get_tier_rank_display()
