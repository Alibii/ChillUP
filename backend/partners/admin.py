from django.contrib import admin

from .models import Category, Partner


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["label", "key", "icon", "order"]
    list_editable = ["order"]
    prepopulated_fields = {"key": ("label",)}


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "city", "tier_rank", "is_active"]
    list_filter = ["category", "city", "tier_rank", "is_active"]
    search_fields = ["name", "city", "address"]
    readonly_fields = ["api_key"]
