from django.contrib import admin

from .models import Visit


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ["user", "partner", "checked_in_at", "checked_out_at", "duration_minutes"]
    list_filter = ["partner__city", "partner__category"]
    search_fields = ["user__email", "partner__name"]
    autocomplete_fields = ["user", "partner"]
