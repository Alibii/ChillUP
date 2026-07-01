from rest_framework import authentication, exceptions

from partners.models import Partner


class PartnerKeyAuthentication(authentication.BaseAuthentication):
    """Authenticates a partner reception terminal via the `X-Partner-Key`
    header (the partner's `api_key` UUID) rather than a user account.

    This is a placeholder for a real partner-terminal auth story (device
    pairing, per-terminal keys, etc); it's enough to let check-in/out work
    end-to-end today. `request.user` stays anonymous - the authenticated
    principal is available as `request.auth` (a `Partner` instance).
    """

    def authenticate(self, request):
        key = request.headers.get("X-Partner-Key")
        if not key:
            return None
        try:
            partner = Partner.objects.get(api_key=key, is_active=True)
        except (Partner.DoesNotExist, ValueError):
            raise exceptions.AuthenticationFailed("Неверный ключ партнёра.")
        return (None, partner)
