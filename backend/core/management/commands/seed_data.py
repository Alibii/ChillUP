"""Populates categories, plans, partners, and FAQ entries matching the
values baked into the frontend prototype (components.jsx / pages.jsx), so
the API returns data consistent with what the design was built against.

Safe to re-run - uses update_or_create/get_or_create throughout.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from core.constants import TIER_BASIC, TIER_PREMIUM, TIER_VIP
from faqs.models import FaqItem
from partners.models import Category, Partner
from plans.models import Plan, PlanFeature

CATEGORIES = [
    {"key": "pc", "label": "PC-клубы", "icon": "joystick", "description": "Игровые ПК, периферия, киберспорт", "order": 0},
    {"key": "tennis", "label": "Настольный теннис", "icon": "tennis", "description": "Профи столы, ракетки в прокат", "order": 1},
    {"key": "bowling", "label": "Боулинг", "icon": "bowling", "description": "Дорожки, бар, компании от 2 до 20", "order": 2},
    {"key": "anticafe", "label": "Антикафе", "icon": "coffee", "description": "Время в подарок, настолки, чай", "order": 3},
    {"key": "board", "label": "Настольные игры", "icon": "cards", "description": "1500+ игр, гейм-мастера", "order": 4},
    {"key": "vr", "label": "VR & аркады", "icon": "vr", "description": "VR-арены, симуляторы, аркадные авт.", "order": 5},
]

TIER_BY_LABEL = {"Базовый": TIER_BASIC, "Премиум": TIER_PREMIUM, "VIP": TIER_VIP}

PARTNERS = [
    {"name": "Game Zone Cyber", "city": "Алматы", "address": "пр. Абая, 150", "tags": ["PC", "VR", "Консоли"], "tier": "Премиум", "cat": "pc"},
    {"name": "Strike Lanes", "city": "Астана", "address": "пр. Кабанбай батыра, 28", "tags": ["Боулинг", "Бар"], "tier": "Базовый", "cat": "bowling"},
    {"name": "Time Cafe", "city": "Шымкент", "address": "ул. Тауке хана, 45", "tags": ["Антикафе", "Настолки"], "tier": "VIP", "cat": "anticafe"},
    {"name": "Ping Pong Pro", "city": "Караганда", "address": "пр. Бухар жырау, 35", "tags": ["Теннис", "Обучение"], "tier": "Базовый", "cat": "tennis"},
    {"name": "Cyber Space", "city": "Алматы", "address": "ул. Сатпаева, 90", "tags": ["Киберспорт", "Турниры"], "tier": "Премиум", "cat": "pc"},
    {"name": "Board Game Hub", "city": "Астана", "address": "ул. Кенесары, 40", "tags": ["Настолки", "Кафе"], "tier": "Базовый", "cat": "board"},
    {"name": "Neon Arena VR", "city": "Алматы", "address": "БЦ Esentai, 4 этаж", "tags": ["VR", "Симуляторы"], "tier": "Премиум", "cat": "vr"},
    {"name": "Spin Table Club", "city": "Актобе", "address": "пр. Молдагуловой, 12", "tags": ["Теннис"], "tier": "Базовый", "cat": "tennis"},
    {"name": "King Pin Bowling", "city": "Алматы", "address": "ТРЦ MEGA, 3 этаж", "tags": ["Боулинг", "Бар"], "tier": "VIP", "cat": "bowling"},
    {"name": "Pixel Arcade", "city": "Тараз", "address": "пр. Толе би, 88", "tags": ["Аркады", "Ретро"], "tier": "Базовый", "cat": "vr"},
    {"name": "Anticafe Loft", "city": "Павлодар", "address": "ул. Естая, 60", "tags": ["Антикафе", "Кальян"], "tier": "Базовый", "cat": "anticafe"},
    {"name": "Esports HQ", "city": "Астана", "address": "ул. Достык, 14", "tags": ["PC", "Турниры"], "tier": "Премиум", "cat": "pc"},
]

FAQ_DATA = [
    {"q": "Как работает подписка ChillUP?", "a": "Вы оплачиваете один из тарифов (Базовый, Премиум или VIP) и получаете в приложении QR-код, который показываете на ресепшене любого партнёрского заведения. Никаких дополнительных платежей."},
    {"q": "Можно отменить в любой момент?", "a": "Да. Отмена происходит в один клик в личном кабинете. Доступ сохраняется до конца оплаченного периода."},
    {"q": "Что входит в Премиум, но не входит в Базовый?", "a": "Премиум открывает безлимитные посещения, боулинг и настольный теннис, а также скидки на VIP-партнёров."},
    {"q": "Есть ли пробный период?", "a": "Да, первые 7 дней — бесплатно. Карту привязывать не обязательно для базового тарифа."},
    {"q": "Можно ли заморозить подписку?", "a": "Можно заморозить на срок до 3 месяцев один раз в год, например на время отъезда."},
    {"q": "Работает ли ChillUP в России?", "a": "Да, подписка действует в России и Казахстане — список городов смотрите на странице партнёров."},
]

PLANS = [
    {
        "key": "basic",
        "name": "Базовый",
        "tagline": "Старт. Несколько вечеров в неделю.",
        "tier_rank": TIER_BASIC,
        "monthly_price": 990,
        "max_visits_per_month": 10,
        "allowed_category_keys": ["pc", "anticafe"],
        "order": 0,
        "features": [
            (True, "Доступ к базовым заведениям"),
            (True, "До 10 посещений в месяц"),
            (True, "PC-клубы и антикафе"),
            (False, "Боулинг и настольный теннис"),
            (False, "VIP-заведения"),
        ],
    },
    {
        "key": "premium",
        "name": "Премиум",
        "tagline": "Безлимит. Большинству — самое то.",
        "tier_rank": TIER_PREMIUM,
        "monthly_price": 1990,
        "max_visits_per_month": None,
        "allowed_category_keys": [],  # empty = all categories
        "is_featured": True,
        "badge": "ПОПУЛЯРНЫЙ",
        "order": 1,
        "features": [
            (True, "Все заведения сети"),
            (True, "Безлимитные посещения"),
            (True, "PC, антикафе, теннис, боулинг"),
            (True, "Скидки на партнёров VIP-тира"),
            (True, "Бронирование столов и дорожек"),
        ],
    },
    {
        "key": "vip",
        "name": "VIP",
        "tagline": "Для тех, кто живёт в клубе.",
        "tier_rank": TIER_VIP,
        "monthly_price": 3990,
        "max_visits_per_month": None,
        "allowed_category_keys": [],
        "order": 2,
        "features": [
            (True, "Все заведения, включая VIP"),
            (True, "Безлимит + 2 часа боулинга/мес"),
            (True, "Эксклюзивные турниры"),
            (True, "Приоритетная поддержка 24/7"),
            (True, "Гость +1 раз в неделю"),
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds categories, plans, partners, and FAQ items matching the frontend prototype."

    @transaction.atomic
    def handle(self, *args, **options):
        categories_by_key = {}
        for data in CATEGORIES:
            category, _ = Category.objects.update_or_create(key=data["key"], defaults=data)
            categories_by_key[data["key"]] = category
        self.stdout.write(self.style.SUCCESS(f"Категории: {len(categories_by_key)}"))

        for data in PARTNERS:
            Partner.objects.update_or_create(
                name=data["name"],
                city=data["city"],
                defaults={
                    "category": categories_by_key[data["cat"]],
                    "address": data["address"],
                    "tags": data["tags"],
                    "tier_rank": TIER_BY_LABEL[data["tier"]],
                    "is_active": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Партнёры: {len(PARTNERS)}"))

        for data in PLANS:
            category_keys = data.pop("allowed_category_keys")
            features = data.pop("features")
            plan, _ = Plan.objects.update_or_create(key=data["key"], defaults=data)
            plan.allowed_categories.set([categories_by_key[k] for k in category_keys])
            plan.features.all().delete()
            for order, (included, text) in enumerate(features):
                PlanFeature.objects.create(plan=plan, text=text, included=included, order=order)
        self.stdout.write(self.style.SUCCESS(f"Тарифы: {len(PLANS)}"))

        for order, item in enumerate(FAQ_DATA):
            FaqItem.objects.update_or_create(
                question=item["q"], defaults={"answer": item["a"], "order": order, "is_active": True}
            )
        self.stdout.write(self.style.SUCCESS(f"FAQ: {len(FAQ_DATA)}"))

        self.stdout.write(self.style.SUCCESS("Готово."))
