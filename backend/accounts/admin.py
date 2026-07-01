from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import NotificationPreference, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ["-date_joined"]
    list_display = ["email", "phone", "first_name", "last_name", "is_staff", "is_active", "date_joined"]
    search_fields = ["email", "phone", "first_name", "last_name"]
    fieldsets = (
        (None, {"fields": ("email", "phone", "password")}),
        ("Личные данные", {"fields": ("first_name", "last_name")}),
        (
            "Права доступа",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Даты", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "phone", "password1", "password2"),
            },
        ),
    )
    readonly_fields = ["date_joined"]


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ["user", "push_new_venues", "email_billing", "sms_checkin", "telegram_events"]
    search_fields = ["user__email"]
