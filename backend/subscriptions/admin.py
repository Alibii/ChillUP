from django.contrib import admin

from .models import Payment, PaymentMethod, UserSubscription


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "plan", "status", "period", "current_period_end", "cancel_at_period_end"]
    list_filter = ["status", "period", "plan"]
    search_fields = ["user__email"]
    autocomplete_fields = ["user", "plan"]


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ["user", "brand", "last4", "is_default", "created_at"]
    search_fields = ["user__email"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "currency", "status", "provider", "created_at"]
    list_filter = ["status", "provider"]
    search_fields = ["user__email", "provider_reference"]
