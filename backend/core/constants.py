"""Shared enums used by both `plans` and `partners` so access-control checks
(`plan.tier_rank >= partner.tier_rank`) compare on the same scale without the
two apps importing each other's models.
"""

TIER_BASIC = 1
TIER_PREMIUM = 2
TIER_VIP = 3

TIER_CHOICES = [
    (TIER_BASIC, "Базовый"),
    (TIER_PREMIUM, "Премиум"),
    (TIER_VIP, "VIP"),
]

TIER_LABELS = dict(TIER_CHOICES)
