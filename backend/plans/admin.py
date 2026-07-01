from django.contrib import admin

from .models import Plan, PlanFeature


class PlanFeatureInline(admin.TabularInline):
    model = PlanFeature
    extra = 1


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ["name", "key", "tier_rank", "monthly_price", "is_featured", "is_active", "order"]
    list_editable = ["order", "is_active"]
    search_fields = ["name", "key"]
    prepopulated_fields = {"key": ("name",)}
    filter_horizontal = ["allowed_categories"]
    inlines = [PlanFeatureInline]
