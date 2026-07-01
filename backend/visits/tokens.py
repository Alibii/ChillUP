"""Short-lived signed tokens behind the dashboard's QR code.

The token is just the user's id, signed and timestamped by Django's
`TimestampSigner`. A partner's reception terminal (authenticated separately
via its own `X-Partner-Key`) posts the token to `/api/visits/checkin/`, which
verifies the signature and expiry (`QR_TOKEN_TTL_SECONDS`) server-side. The
token carries no secret worth protecting beyond the signature itself - it
only identifies *which* user is standing at the terminal.
"""

from django.conf import settings
from django.core import signing

SALT = "visits.qr-access"


def issue_qr_token(user) -> str:
    return signing.TimestampSigner(salt=SALT).sign(str(user.pk))


def resolve_qr_token(token: str):
    """Returns the user id encoded in `token`, or None if it's invalid/expired."""
    ttl = getattr(settings, "QR_TOKEN_TTL_SECONDS", 90)
    try:
        value = signing.TimestampSigner(salt=SALT).unsign(token, max_age=ttl)
    except signing.BadSignature:
        return None
    return int(value)
