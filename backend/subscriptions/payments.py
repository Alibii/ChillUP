"""Payment provider abstraction.

No real payment service provider is wired up yet (no merchant account/API keys
were available at build time). `MockPaymentProvider` simulates an
always-succeeding PSP so the full subscription lifecycle (trial -> charge ->
renewal, failed payments, refunds) can be built and tested end-to-end now.

To go live, implement `PaymentProvider` for a real gateway (CloudPayments and
Kaspi Pay are the common choices for the KZ/RU market) and point
`PAYMENT_PROVIDER` in settings at it. Nothing else in this app should need to
change - views/services only ever talk to `get_payment_provider()`.

Whatever provider is added must tokenize cards client-side and hand this
backend only an opaque token + display metadata (brand/last4/exp) - raw PANs
must never be sent to or stored by this server (PCI-DSS scope).
"""

import uuid
from dataclasses import dataclass

from django.conf import settings
from django.utils.module_loading import import_string


@dataclass
class ChargeResult:
    success: bool
    provider_reference: str
    failure_reason: str = ""


class PaymentProvider:
    name = "base"

    def charge(self, *, user, amount, currency, payment_method=None, description="") -> ChargeResult:
        raise NotImplementedError


class MockPaymentProvider(PaymentProvider):
    """Always succeeds. Local/dev default - see module docstring."""

    name = "mock"

    def charge(self, *, user, amount, currency, payment_method=None, description="") -> ChargeResult:
        return ChargeResult(success=True, provider_reference=f"mock_{uuid.uuid4().hex[:16]}")


def get_payment_provider() -> PaymentProvider:
    path = getattr(settings, "PAYMENT_PROVIDER", "subscriptions.payments.MockPaymentProvider")
    provider_cls = import_string(path)
    return provider_cls()
