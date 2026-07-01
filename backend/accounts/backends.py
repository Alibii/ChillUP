from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()


class EmailOrPhoneBackend(ModelBackend):
    """Lets the frontend's single "email или телефон" field authenticate
    against either column."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        login = username or kwargs.get("login")
        if not login or not password:
            return None
        try:
            user = User.objects.get(Q(email__iexact=login) | Q(phone=login))
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
