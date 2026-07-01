// i18n.js — RU/KK localization for ChillUP.
// Exports to window: LocaleProvider, useLocale, LangSwitch, tierLabel, tagLabel, cityLabel
// Must load BEFORE components.jsx/pages.jsx/app.jsx (only depends on React).

const { createContext: __createContext, useContext: __useContext, useState: __useStateI18n, useEffect: __useEffectI18n, useCallback: __useCallbackI18n, useMemo: __useMemoI18n } = React;

const STRINGS = {
  ru: {
    "nav.home": "Главная",
    "nav.pricing": "Тарифы",
    "nav.partners": "Партнёры",
    "nav.faq": "FAQ",
    "nav.login": "Войти",
    "nav.register": "Регистрация",

    "footer.tagline": "Одна подписка — бесконечные развлечения. Компьютерные клубы, антикафе, боулинг, настольный теннис.",
    "footer.product": "Продукт",
    "footer.account": "Аккаунт",
    "footer.contacts": "Контакты",
    "footer.dashboardLink": "Личный кабинет",

    "categories.kicker": "ШЕСТЬ КАТЕГОРИЙ",
    "categories.title": "Любой формат отдыха — без выбора между ними.",
    "categories.sub": "Закрытая сеть из тщательно отобранных заведений. Один пасс открывает все двери.",

    "category.pc.label": "PC-клубы",
    "category.pc.desc": "Игровые ПК, периферия, киберспорт",
    "category.tennis.label": "Настольный теннис",
    "category.tennis.desc": "Профи столы, ракетки в прокат",
    "category.bowling.label": "Боулинг",
    "category.bowling.desc": "Дорожки, бар, компании от 2 до 20",
    "category.anticafe.label": "Антикафе",
    "category.anticafe.desc": "Время в подарок, настолки, чай",
    "category.board.label": "Настольные игры",
    "category.board.desc": "1500+ игр, гейм-мастера",
    "category.vr.label": "VR & аркады",
    "category.vr.desc": "VR-арены, симуляторы, аркадные авт.",

    "howItWorks.kicker": "ПРОЦЕСС",
    "howItWorks.title": "Три шага между тобой и развлечением.",
    "howItWorks.step1.t": "Скачай приложение",
    "howItWorks.step1.d": "Создай аккаунт за 30 секунд и получи QR-код доступа.",
    "howItWorks.step2.t": "Выбери тариф",
    "howItWorks.step2.d": "От базового до VIP. Первая неделя — бесплатно, отмена в один клик.",
    "howItWorks.step3.t": "Приходи и играй",
    "howItWorks.step3.d": "Покажи QR на ресепшене любого партнёра. Время не ограничено.",

    "hero.eyebrow": "Подписка + Казахстан",
    "hero.headline.line1": "Развлекайся",
    "hero.headline.line2": "безлимитно",
    "hero.headline.line3pre": "Один пасс — ",
    "hero.headline.line3accent": "всё",
    "hero.sub": "ChillUP — это единая подписка на компьютерные клубы, антикафе, боулинг, настольный теннис и VR-арены. Без счётов, без бронирований — просто приходи и играй.",
    "hero.cta.trial": "Попробовать 7 дней бесплатно",
    "hero.cta.pricing": "Тарифы",
    "hero.stat.partners": "Партнёров",
    "hero.stat.cities": "Городов",
    "hero.stat.users": "Активных пользователей",

    "heroVisual.status": "СТАТУС СЕТИ · LIVE",
    "heroVisual.venuesOnline": "заведений онлайн",

    "ticker.0": "безлимитные посещения",
    "ticker.1": "500+ партнёров",
    "ticker.2": "₸ один платёж в месяц",
    "ticker.3": "PC · теннис · боулинг · VR",
    "ticker.4": "Россия + Казахстан",
    "ticker.5": "отмена в один клик",
    "ticker.6": "первая неделя бесплатно",

    "pricingPreview.kicker": "Тарифы",
    "pricingPreview.title": "Подбери план под свой ритм.",
    "billingToggle.month": "Месяц",
    "billingToggle.year": "Год",

    "plan.basic.name": "Базовый",
    "plan.basic.tagline": "Старт. Несколько вечеров в неделю.",
    "plan.basic.cta": "Начать",
    "plan.basic.feature.0": "Доступ к базовым заведениям",
    "plan.basic.feature.1": "До 10 посещений в месяц",
    "plan.basic.feature.2": "PC-клубы и антикафе",
    "plan.basic.feature.3": "Боулинг и настольный теннис",
    "plan.basic.feature.4": "VIP-заведения",

    "plan.premium.name": "Премиум",
    "plan.premium.tagline": "Безлимит. Большинству — самое то.",
    "plan.premium.badge": "ПОПУЛЯРНЫЙ",
    "plan.premium.cta": "Выбрать Премиум",
    "plan.premium.feature.0": "Все заведения сети",
    "plan.premium.feature.1": "Безлимитные посещения",
    "plan.premium.feature.2": "PC, антикафе, теннис, боулинг",
    "plan.premium.feature.3": "Скидки на партнёров VIP-тира",
    "plan.premium.feature.4": "Бронирование столов и дорожек",

    "plan.vip.name": "VIP",
    "plan.vip.tagline": "Для тех, кто живёт в клубе.",
    "plan.vip.cta": "Стать VIP",
    "plan.vip.feature.0": "Все заведения, включая VIP",
    "plan.vip.feature.1": "Безлимит + 2 часа боулинга/мес",
    "plan.vip.feature.2": "Эксклюзивные турниры",
    "plan.vip.feature.3": "Приоритетная поддержка 24/7",
    "plan.vip.feature.4": "Гость +1 раз в неделю",

    "plan.yearSavings": "Экономия {amount} ₸ за год",
    "plan.perMonth": "/мес",

    "partnersPreview.kicker": "Сеть · 500+ точек",
    "partnersPreview.title": "Партнёры, которым доверяют 50K игроков.",
    "partnersPreview.viewAll": "Смотреть всех",

    "stats.partners": "Партнёров в сети",
    "stats.cities": "Городов",
    "stats.hours": "Часов отыграно",
    "stats.retention": "Возвращаемость",

    "testimonials.kicker": "ОТЗЫВЫ",
    "testimonials.title": "Что говорят пользователи.",
    "testimonial.0.q": "Раньше тратил по 30к в месяц на компьютерный клуб. Теперь хожу куда хочу за 2к — это какая-то магия.",
    "testimonial.0.role": "Разработчик · Алматы",
    "testimonial.1.q": "С друзьями катаемся то в боулинг, то в антикафе. Одна подписка, никакой возни с кошельками.",
    "testimonial.1.role": "Студентка · Астана",
    "testimonial.2.q": "Теннис три раза в неделю — окупается на четвёртый день. Сервис огонь.",
    "testimonial.2.role": "Тренер · Шымкент",

    "faq.0.q": "Как работает подписка ChillUP?",
    "faq.0.a": "Вы оплачиваете один из тарифов (Базовый, Премиум или VIP) и получаете в приложении QR-код, который показываете на ресепшене любого партнёрского заведения. Никаких дополнительных платежей.",
    "faq.1.q": "Можно отменить в любой момент?",
    "faq.1.a": "Да. Отмена происходит в один клик в личном кабинете. Доступ сохраняется до конца оплаченного периода.",
    "faq.2.q": "Что входит в Премиум, но не входит в Базовый?",
    "faq.2.a": "Премиум открывает безлимитные посещения, боулинг и настольный теннис, а также скидки на VIP-партнёров.",
    "faq.3.q": "Есть ли пробный период?",
    "faq.3.a": "Да, первые 7 дней — бесплатно. Карту привязывать не обязательно для базового тарифа.",
    "faq.4.q": "Можно ли заморозить подписку?",
    "faq.4.a": "Можно заморозить на срок до 3 месяцев один раз в год, например на время отъезда.",
    "faq.5.q": "Работает ли ChillUP в России?",
    "faq.5.a": "Да, подписка действует в России и Казахстане — список городов смотрите на странице партнёров.",

    "faqPreview.kicker": "FAQ",
    "faqPreview.title": "Вопросы, которые задают чаще всего.",
    "faqPreview.sub": "Не нашли ответа? Поддержка работает 24/7 в чате приложения.",
    "faqPreview.viewAll": "Все вопросы",

    "downloadCTA.eyebrow": "iOS · Android",
    "downloadCTA.title": "Скачай ChillUP и приходи играть.",
    "downloadCTA.sub": "Управляй подпиской, находи заведения рядом, бронируй столы и дорожки прямо в приложении.",

    "phoneMock.planActive": "Премиум · активен",
    "phoneMock.until": "До 14 декабря",

    "pricingPage.eyebrow": "Тарифы",
    "pricingPage.title.pre": "Один план — ",
    "pricingPage.title.accent": "вся",
    "pricingPage.title.post": " сеть.",
    "pricingPage.sub": "Прозрачная цена, отмена в один клик, первая неделя — бесплатно.",

    "comparisonTable.kicker": "СРАВНЕНИЕ",
    "comparisonTable.title": "Что входит в каждый план.",
    "comparisonTable.header.features": "Возможности",
    "comparisonTable.row.0": "Доступ к PC-клубам и антикафе",
    "comparisonTable.row.1": "Безлимитные посещения",
    "comparisonTable.row.2": "Боулинг и настольный теннис",
    "comparisonTable.row.3": "VIP-заведения",
    "comparisonTable.row.4": "Бронирование онлайн",
    "comparisonTable.row.5": "Гость +1 раз в неделю",
    "comparisonTable.row.6": "Приоритетная поддержка 24/7",
    "comparisonTable.row.7": "2 часа боулинга в подарок (мес)",

    "pricingFaq.kicker": "УСЛОВИЯ",
    "pricingFaq.title": "Подписка без сюрпризов.",
    "pricingFaq.0.q": "Когда происходит списание?",
    "pricingFaq.0.a": "В день оформления подписки и далее каждый месяц или год — в зависимости от выбранного периода.",
    "pricingFaq.1.q": "Можно ли вернуть деньги?",
    "pricingFaq.1.a": "Возврат возможен в течение 14 дней с момента оплаты при условии, что вы не использовали услуги.",
    "pricingFaq.2.q": "Что произойдёт по окончании пробного периода?",
    "pricingFaq.2.a": "Списание произойдёт автоматически по выбранному тарифу. Вы можете отменить подписку до окончания триала без списания.",

    "partnersPage.eyebrow": "Партнёры · 500+ точек",
    "partnersPage.title.pre": "Сеть, которая ",
    "partnersPage.title.accent": "растёт",
    "partnersPage.title.post": ".",
    "partnersPage.sub": "Каждое заведение проходит проверку. Никаких сюрпризов в качестве.",
    "partnersPage.searchPlaceholder": "Поиск по названию, городу, адресу...",
    "partnersPage.allCities": "Все города",
    "partnersPage.allCategories": "Все категории",
    "partnersPage.allTiers": "Все тиры",
    "partnersPage.all": "Все",
    "partnersPage.foundTemplate": "Найдено: {n}",
    "partnersPage.emptyTitle": "Ничего не нашли",
    "partnersPage.emptyDesc": "Попробуйте изменить фильтры или сбросить поиск.",
    "partnersPage.reset": "Сбросить",

    "tier.basic": "Базовый",
    "tier.premium": "Премиум",
    "tier.vip": "VIP",

    "tag.pc": "PC",
    "tag.vr": "VR",
    "tag.consoles": "Консоли",
    "tag.bowling": "Боулинг",
    "tag.bar": "Бар",
    "tag.anticafe": "Антикафе",
    "tag.boardgames": "Настолки",
    "tag.tennis": "Теннис",
    "tag.coaching": "Обучение",
    "tag.esports": "Киберспорт",
    "tag.tournaments": "Турниры",
    "tag.cafe": "Кафе",
    "tag.simulators": "Симуляторы",
    "tag.arcades": "Аркады",
    "tag.retro": "Ретро",
    "tag.hookah": "Кальян",

    "city.Алматы": "Алматы",
    "city.Астана": "Астана",
    "city.Шымкент": "Шымкент",
    "city.Караганда": "Караганда",
    "city.Актобе": "Актобе",
    "city.Тараз": "Тараз",
    "city.Павлодар": "Павлодар",

    "faqPage.eyebrow": "FAQ",
    "faqPage.title.pre": "Часто ",
    "faqPage.title.accent": "спрашивают",
    "faqPage.title.post": ".",
    "faqPage.notFound.title": "Не нашли ответ?",
    "faqPage.notFound.sub": "Поддержка работает 24/7 в приложении и в Telegram.",
    "faqPage.openChat": "Открыть чат",

    "loginPage.eyebrow": "Вход",
    "loginPage.title.line1": "С возвращением.",
    "loginPage.title.accent": "Игра ждёт.",
    "loginPage.sub": "Войди, чтобы открыть QR-доступ к 500+ заведениям и управлять подпиской.",
    "loginPage.stat.partners": "Партнёров",
    "loginPage.stat.users": "Пользователей",
    "loginPage.formTitle": "Войти",
    "loginPage.field.login": "Email или телефон",
    "loginPage.field.password": "Пароль",
    "loginPage.remember": "Запомнить",
    "loginPage.forgot": "Забыли пароль?",
    "loginPage.submit": "Войти",
    "loginPage.or": "ИЛИ",
    "loginPage.telegram": "Войти через Telegram",
    "loginPage.noAccount": "Нет аккаунта?",
    "loginPage.registerLink": "Регистрация",

    "registerPage.eyebrow": "Регистрация · 7 дней бесплатно",
    "registerPage.titleBefore": "Стань частью сети ",
    "registerPage.titleAfter": ".",
    "registerPage.stepper.account": "Аккаунт",
    "registerPage.stepper.plan": "Тариф",
    "registerPage.stepper.done": "Готово",
    "registerPage.step0.title": "Создай аккаунт",
    "registerPage.field.firstName": "Имя",
    "registerPage.field.lastName": "Фамилия",
    "registerPage.field.email": "Email",
    "registerPage.field.phone": "Телефон",
    "registerPage.field.password": "Пароль",
    "registerPage.cancel": "Отмена",
    "registerPage.next": "Дальше",
    "registerPage.step1.title": "Выбери тариф",
    "registerPage.back": "Назад",
    "registerPage.activateTrial": "Активировать триал",
    "registerPage.perMonth": "/мес",
    "registerPage.step2.title": "Всё готово!",
    "registerPage.step2.descPre": "Твой 7-дневный триал тарифа ",
    "registerPage.step2.descPost": " активен. QR-код доступа уже в твоём личном кабинете.",
    "registerPage.openDashboard": "Открыть кабинет",
    "registerPage.toHome": "На главную",

    "dashboard.nav.overview": "Обзор",
    "dashboard.nav.qr": "QR-доступ",
    "dashboard.nav.history": "История",
    "dashboard.nav.billing": "Подписка",
    "dashboard.nav.settings": "Настройки",
    "dashboard.logout": "Выйти",
    "dashboard.planActive": "Премиум · активен",

    "dashOverview.eyebrow": "Обзор",
    "dashOverview.greeting": "Привет, {name}.",
    "dashOverview.showQr": "Показать QR",
    "dashOverview.stat.visits": "Посещений в этом месяце",
    "dashOverview.visitsDeltaTemplate": "+{n} vs прошлый месяц",
    "dashOverview.stat.hours": "Часов отыграно",
    "dashOverview.stat.saved": "Сэкономлено",
    "dashOverview.stat.savedVs": "vs оплата по факту",
    "dashOverview.recent.title": "Недавние посещения",
    "dashOverview.recent.viewAll": "Все →",
    "dashOverview.recommended.title": "Тебе понравится",
    "dashOverview.today": "Сегодня",
    "dashOverview.yesterday": "Вчера",
    "dashOverview.dec": "дек",

    "dashQr.eyebrow": "Доступ · LIVE",
    "dashQr.title": "Покажи на ресепшене",
    "dashQr.sub": "QR обновляется каждые 60 секунд",

    "dashHistory.eyebrow": "История",
    "dashHistory.title": "Последние посещения",
    "dashHistory.col.venue": "Заведение",
    "dashHistory.col.city": "Город",
    "dashHistory.col.duration": "Длительность",
    "dashHistory.col.date": "Дата",
    "dashHistory.dec": "дек",

    "dashBilling.eyebrow": "Подписка",
    "dashBilling.title": "Управление подпиской",
    "dashBilling.active": "АКТИВЕН",
    "dashBilling.planLineTemplate": "{plan} · {price} ₸/мес",
    "dashBilling.nextChargeTemplate": "Следующее списание: {date}",
    "dashBilling.nextChargeDate": "14 января 2027",
    "dashBilling.changePlan": "Сменить тариф",
    "dashBilling.freeze": "Заморозить",
    "dashBilling.paymentMethod": "Метод оплаты",
    "dashBilling.cardExpiry": "Visa · истекает 09/28",
    "dashBilling.change": "Изменить",
    "dashBilling.recentPayments": "Последние платежи",
    "dashBilling.paymentDate.0": "14 дек 2026",
    "dashBilling.paymentDate.1": "14 ноя 2026",
    "dashBilling.paymentDate.2": "14 окт 2026",

    "dashSettings.eyebrow": "Настройки",
    "dashSettings.title": "Профиль и уведомления",
    "dashSettings.notif.push": "Push о новых заведениях рядом",
    "dashSettings.notif.email": "Email о платежах и продлении",
    "dashSettings.notif.sms": "SMS о подтверждении посещения",
    "dashSettings.notif.telegram": "Telegram о турнирах и событиях",
    "dashSettings.save": "Сохранить",
    "dashSettings.cancel": "Отмена",

    "unit.hour": "ч",
    "unit.min": "мин",
  },

  kk: {
    "nav.home": "Басты бет",
    "nav.pricing": "Тарифтер",
    "nav.partners": "Серіктестер",
    "nav.faq": "FAQ",
    "nav.login": "Кіру",
    "nav.register": "Тіркелу",

    "footer.tagline": "Бір жазылым — шексіз көңіл көтеру. Компьютерлік клубтар, антикафе, боулинг, үстел теннисі.",
    "footer.product": "Өнім",
    "footer.account": "Тіркелгі",
    "footer.contacts": "Байланыс",
    "footer.dashboardLink": "Жеке кабинет",

    "categories.kicker": "АЛТЫ САНАТ",
    "categories.title": "Демалыстың кез келген форматы — олардың арасынан таңдаусыз.",
    "categories.sub": "Мұқият таңдалған мекемелердің жабық желісі. Бір пасс барлық есікті ашады.",

    "category.pc.label": "PC-клубтар",
    "category.pc.desc": "Ойын компьютерлері, перифериялар, киберспорт",
    "category.tennis.label": "Үстел теннисі",
    "category.tennis.desc": "Кәсіби үстелдер, жалға ракеткалар",
    "category.bowling.label": "Боулинг",
    "category.bowling.desc": "Жолақтар, бар, 2-ден 20-ға дейінгі компаниялар",
    "category.anticafe.label": "Антикафе",
    "category.anticafe.desc": "Уақыт сыйға тартылады, үстел ойындары, шай",
    "category.board.label": "Үстел ойындары",
    "category.board.desc": "1500+ ойын, гейм-мастерлер",
    "category.vr.label": "VR және аркадалар",
    "category.vr.desc": "VR-аландар, симуляторлар, аркада автоматтары",

    "howItWorks.kicker": "ҮДЕРІС",
    "howItWorks.title": "Сен мен көңіл көтерудің арасында үш қадам.",
    "howItWorks.step1.t": "Қолданбаны жүктеп ал",
    "howItWorks.step1.d": "30 секундта тіркелгі жаса және кіру QR-кодын ал.",
    "howItWorks.step2.t": "Тарифті таңда",
    "howItWorks.step2.d": "Негізгіден VIP-ге дейін. Бірінші апта — тегін, бас тарту бір басу арқылы.",
    "howItWorks.step3.t": "Кел де ойна",
    "howItWorks.step3.d": "Кез келген серіктестің ресепшнінде QR-ды көрсет. Уақыт шектелмейді.",

    "hero.eyebrow": "Жазылым + Қазақстан",
    "hero.headline.line1": "Ойна",
    "hero.headline.line2": "шексіз",
    "hero.headline.line3pre": "Бір пасс — ",
    "hero.headline.line3accent": "бәрі",
    "hero.sub": "ChillUP — компьютерлік клубтарға, антикафеге, боулингке, үстел теннисіне және VR-аландарға арналған бірыңғай жазылым. Шоттарсыз, брондаусыз — жай ғана кел де ойна.",
    "hero.cta.trial": "7 күн тегін сынап көру",
    "hero.cta.pricing": "Тарифтер",
    "hero.stat.partners": "Серіктес",
    "hero.stat.cities": "Қала",
    "hero.stat.users": "Белсенді пайдаланушы",

    "heroVisual.status": "ЖЕЛІ МӘРТЕБЕСІ · LIVE",
    "heroVisual.venuesOnline": "мекеме желіде",

    "ticker.0": "шексіз бару",
    "ticker.1": "500+ серіктес",
    "ticker.2": "₸ айына бір төлем",
    "ticker.3": "PC · теннис · боулинг · VR",
    "ticker.4": "Ресей + Қазақстан",
    "ticker.5": "бір басу арқылы бас тарту",
    "ticker.6": "бірінші апта тегін",

    "pricingPreview.kicker": "Тарифтер",
    "pricingPreview.title": "Өз ырғағыңа сай жоспарды таңда.",
    "billingToggle.month": "Ай",
    "billingToggle.year": "Жыл",

    "plan.basic.name": "Негізгі",
    "plan.basic.tagline": "Бастау. Аптасына бірнеше кеш.",
    "plan.basic.cta": "Бастау",
    "plan.basic.feature.0": "Негізгі мекемелерге қолжетімділік",
    "plan.basic.feature.1": "Айына 10-ға дейін бару",
    "plan.basic.feature.2": "PC-клубтар мен антикафе",
    "plan.basic.feature.3": "Боулинг және үстел теннисі",
    "plan.basic.feature.4": "VIP-мекемелер",

    "plan.premium.name": "Премиум",
    "plan.premium.tagline": "Шексіз. Көпшілікке дәл келеді.",
    "plan.premium.badge": "ЕҢ ТАҢДАУЛЫ",
    "plan.premium.cta": "Премиумды таңдау",
    "plan.premium.feature.0": "Желінің барлық мекемелері",
    "plan.premium.feature.1": "Шексіз бару",
    "plan.premium.feature.2": "PC, антикафе, теннис, боулинг",
    "plan.premium.feature.3": "VIP-деңгейлі серіктестерге жеңілдіктер",
    "plan.premium.feature.4": "Үстелдер мен жолақтарды брондау",

    "plan.vip.name": "VIP",
    "plan.vip.tagline": "Клубта өмір сүретіндерге арналған.",
    "plan.vip.cta": "VIP болу",
    "plan.vip.feature.0": "VIP қоса, барлық мекемелер",
    "plan.vip.feature.1": "Шексіз + айына 2 сағат боулинг",
    "plan.vip.feature.2": "Эксклюзивті турнирлер",
    "plan.vip.feature.3": "Басым қолдау 24/7",
    "plan.vip.feature.4": "Апта сайын +1 қонақ",

    "plan.yearSavings": "Жылына {amount} ₸ үнемдейсің",
    "plan.perMonth": "/ай",

    "partnersPreview.kicker": "Желі · 500+ нүкте",
    "partnersPreview.title": "50 мың ойыншы сенетін серіктестер.",
    "partnersPreview.viewAll": "Барлығын қарау",

    "stats.partners": "Желідегі серіктестер",
    "stats.cities": "Қала",
    "stats.hours": "Ойналған сағат",
    "stats.retention": "Қайта оралу",

    "testimonials.kicker": "ПІКІРЛЕР",
    "testimonials.title": "Пайдаланушылар не дейді.",
    "testimonial.0.q": "Бұрын компьютерлік клубқа айына 30 мыңға жуық жұмсайтынмын. Қазір 2 мыңға қалаған жеріме барамын — бұл сиқыр сияқты.",
    "testimonial.0.role": "Дамытушы · Алматы",
    "testimonial.1.q": "Достарыммен кейде боулингке, кейде антикафеге барамыз. Бір жазылым, әмиянмен әуре болу жоқ.",
    "testimonial.1.role": "Студент · Астана",
    "testimonial.2.q": "Аптасына үш рет теннис — төртінші күні өзін-өзі ақтайды. Қызмет керемет.",
    "testimonial.2.role": "Жаттықтырушы · Шымкент",

    "faq.0.q": "ChillUP жазылымы қалай жұмыс істейді?",
    "faq.0.a": "Сіз тарифтердің бірін (Негізгі, Премиум немесе VIP) төлейсіз және қолданбада кез келген серіктес мекеменің ресепшнінде көрсететін QR-код аласыз. Қосымша төлемдер жоқ.",
    "faq.1.q": "Кез келген уақытта бас тартуға бола ма?",
    "faq.1.a": "Иә. Бас тарту жеке кабинетте бір басу арқылы жасалады. Қолжетімділік төленген кезең соңына дейін сақталады.",
    "faq.2.q": "Премиумге кіретін, бірақ Негізгіге кірмейтін немене?",
    "faq.2.a": "Премиум шексіз баруды, боулинг пен үстел теннисін, сондай-ақ VIP-серіктестерге жеңілдіктерді ашады.",
    "faq.3.q": "Сынақ мерзімі бар ма?",
    "faq.3.a": "Иә, алғашқы 7 күн — тегін. Негізгі тариф үшін картаны байланыстыру міндетті емес.",
    "faq.4.q": "Жазылымды тоқтата тұруға бола ма?",
    "faq.4.a": "Жылына бір рет, мысалы сапарға шыққан кезде, 3 айға дейін тоқтата тұруға болады.",
    "faq.5.q": "ChillUP Ресейде жұмыс істей ме?",
    "faq.5.a": "Иә, жазылым Ресей мен Қазақстанда қолданылады — қалалар тізімін серіктестер бетінен қараңыз.",

    "faqPreview.kicker": "FAQ",
    "faqPreview.title": "Жиі қойылатын сұрақтар.",
    "faqPreview.sub": "Жауап таппадыңыз ба? Қолдау қызметі қолданбада 24/7 жұмыс істейді.",
    "faqPreview.viewAll": "Барлық сұрақтар",

    "downloadCTA.eyebrow": "iOS · Android",
    "downloadCTA.title": "ChillUP-ты жүктеп ал да ойнауға кел.",
    "downloadCTA.sub": "Жазылымды басқар, жақын жердегі мекемелерді тап, үстелдер мен жолақтарды тікелей қолданбада брондa.",

    "phoneMock.planActive": "Премиум · белсенді",
    "phoneMock.until": "14 желтоқсанға дейін",

    "pricingPage.eyebrow": "Тарифтер",
    "pricingPage.title.pre": "Бір жоспар — ",
    "pricingPage.title.accent": "барлық",
    "pricingPage.title.post": " желі.",
    "pricingPage.sub": "Ашық баға, бір басу арқылы бас тарту, бірінші апта — тегін.",

    "comparisonTable.kicker": "САЛЫСТЫРУ",
    "comparisonTable.title": "Әр жоспарға не кіреді.",
    "comparisonTable.header.features": "Мүмкіндіктер",
    "comparisonTable.row.0": "PC-клубтар мен антикафеге қолжетімділік",
    "comparisonTable.row.1": "Шексіз бару",
    "comparisonTable.row.2": "Боулинг және үстел теннисі",
    "comparisonTable.row.3": "VIP-мекемелер",
    "comparisonTable.row.4": "Онлайн брондау",
    "comparisonTable.row.5": "Апта сайын +1 қонақ",
    "comparisonTable.row.6": "Басым қолдау 24/7",
    "comparisonTable.row.7": "Айына 2 сағат боулинг сыйлыққа",

    "pricingFaq.kicker": "ШАРТТАР",
    "pricingFaq.title": "Жазылым — тосынсызсыз.",
    "pricingFaq.0.q": "Ақша қашан есептен шығарылады?",
    "pricingFaq.0.a": "Жазылым рәсімделген күні және одан кейін таңдалған кезеңге байланысты әр ай немесе жыл сайын.",
    "pricingFaq.1.q": "Ақшаны қайтаруға бола ма?",
    "pricingFaq.1.a": "Қызметтерді пайдаланбаған жағдайда төлемнен кейінгі 14 күн ішінде қайтару мүмкін.",
    "pricingFaq.2.q": "Сынақ мерзімі аяқталған соң не болады?",
    "pricingFaq.2.a": "Таңдалған тариф бойынша ақша автоматты түрде есептен шығарылады. Сіз триал аяқталғанға дейін жазылымнан ақысыз бас тарта аласыз.",

    "partnersPage.eyebrow": "Серіктестер · 500+ нүкте",
    "partnersPage.title.pre": "Күн санап ",
    "partnersPage.title.accent": "өсіп келе жатқан",
    "partnersPage.title.post": " желі.",
    "partnersPage.sub": "Әр мекеме тексеруден өтеді. Сапада тосынсыз жоқ.",
    "partnersPage.searchPlaceholder": "Атауы, қаласы, мекенжайы бойынша іздеу...",
    "partnersPage.allCities": "Барлық қалалар",
    "partnersPage.allCategories": "Барлық санаттар",
    "partnersPage.allTiers": "Барлық деңгейлер",
    "partnersPage.all": "Барлығы",
    "partnersPage.foundTemplate": "Табылды: {n}",
    "partnersPage.emptyTitle": "Ештеңе табылмады",
    "partnersPage.emptyDesc": "Сүзгілерді өзгертіп көріңіз немесе іздеуді тазалаңыз.",
    "partnersPage.reset": "Тазалау",

    "tier.basic": "Негізгі",
    "tier.premium": "Премиум",
    "tier.vip": "VIP",

    "tag.pc": "PC",
    "tag.vr": "VR",
    "tag.consoles": "Консольдер",
    "tag.bowling": "Боулинг",
    "tag.bar": "Бар",
    "tag.anticafe": "Антикафе",
    "tag.boardgames": "Үстел ойындары",
    "tag.tennis": "Теннис",
    "tag.coaching": "Оқыту",
    "tag.esports": "Киберспорт",
    "tag.tournaments": "Турнирлер",
    "tag.cafe": "Кафе",
    "tag.simulators": "Симуляторлар",
    "tag.arcades": "Аркадалар",
    "tag.retro": "Ретро",
    "tag.hookah": "Кальян",

    "city.Алматы": "Алматы",
    "city.Астана": "Астана",
    "city.Шымкент": "Шымкент",
    "city.Караганда": "Қарағанды",
    "city.Актобе": "Ақтөбе",
    "city.Тараз": "Тараз",
    "city.Павлодар": "Павлодар",

    "faqPage.eyebrow": "FAQ",
    "faqPage.title.pre": "Жиі ",
    "faqPage.title.accent": "қойылатын сұрақтар",
    "faqPage.title.post": ".",
    "faqPage.notFound.title": "Жауап таппадыңыз ба?",
    "faqPage.notFound.sub": "Қолдау қызметі қолданба мен Telegram-да 24/7 жұмыс істейді.",
    "faqPage.openChat": "Чатты ашу",

    "loginPage.eyebrow": "Кіру",
    "loginPage.title.line1": "Қайта оралуыңызбен.",
    "loginPage.title.accent": "Ойын күтіп тұр.",
    "loginPage.sub": "500+ мекемеге QR арқылы кіру және жазылымды басқару үшін кіріңіз.",
    "loginPage.stat.partners": "Серіктес",
    "loginPage.stat.users": "Пайдаланушы",
    "loginPage.formTitle": "Кіру",
    "loginPage.field.login": "Email немесе телефон",
    "loginPage.field.password": "Құпия сөз",
    "loginPage.remember": "Есте сақтау",
    "loginPage.forgot": "Құпия сөзді ұмыттыңыз ба?",
    "loginPage.submit": "Кіру",
    "loginPage.or": "НЕМЕСЕ",
    "loginPage.telegram": "Telegram арқылы кіру",
    "loginPage.noAccount": "Тіркелгіңіз жоқ па?",
    "loginPage.registerLink": "Тіркелу",

    "registerPage.eyebrow": "Тіркелу · 7 күн тегін",
    "registerPage.titleBefore": "",
    "registerPage.titleAfter": " желісінің бөлігі бол.",
    "registerPage.stepper.account": "Тіркелгі",
    "registerPage.stepper.plan": "Тариф",
    "registerPage.stepper.done": "Дайын",
    "registerPage.step0.title": "Тіркелгі жаса",
    "registerPage.field.firstName": "Аты",
    "registerPage.field.lastName": "Тегі",
    "registerPage.field.email": "Email",
    "registerPage.field.phone": "Телефон",
    "registerPage.field.password": "Құпия сөз",
    "registerPage.cancel": "Бас тарту",
    "registerPage.next": "Келесі",
    "registerPage.step1.title": "Тарифті таңда",
    "registerPage.back": "Артқа",
    "registerPage.activateTrial": "Триалды іске қосу",
    "registerPage.perMonth": "/ай",
    "registerPage.step2.title": "Бәрі дайын!",
    "registerPage.step2.descPre": "Сенің ",
    "registerPage.step2.descPost": " тарифінің 7 күндік триалы белсенді. Кіру QR-коды жеке кабинетіңде дайын тұр.",
    "registerPage.openDashboard": "Кабинетті ашу",
    "registerPage.toHome": "Басты бетке",

    "dashboard.nav.overview": "Шолу",
    "dashboard.nav.qr": "QR-кіру",
    "dashboard.nav.history": "Тарих",
    "dashboard.nav.billing": "Жазылым",
    "dashboard.nav.settings": "Баптаулар",
    "dashboard.logout": "Шығу",
    "dashboard.planActive": "Премиум · белсенді",

    "dashOverview.eyebrow": "Шолу",
    "dashOverview.greeting": "Сәлем, {name}.",
    "dashOverview.showQr": "QR-ды көрсету",
    "dashOverview.stat.visits": "Осы айдағы бару саны",
    "dashOverview.visitsDeltaTemplate": "өткен айға қарағанда +{n}",
    "dashOverview.stat.hours": "Ойналған сағат",
    "dashOverview.stat.saved": "Үнемделді",
    "dashOverview.stat.savedVs": "нақты төлеммен салыстырғанда",
    "dashOverview.recent.title": "Соңғы барулар",
    "dashOverview.recent.viewAll": "Барлығы →",
    "dashOverview.recommended.title": "Саған ұнайды",
    "dashOverview.today": "Бүгін",
    "dashOverview.yesterday": "Кеше",
    "dashOverview.dec": "желт.",

    "dashQr.eyebrow": "Кіру · LIVE",
    "dashQr.title": "Ресепшенде көрсет",
    "dashQr.sub": "QR әр 60 секунд сайын жаңарады",

    "dashHistory.eyebrow": "Тарих",
    "dashHistory.title": "Соңғы барулар",
    "dashHistory.col.venue": "Мекеме",
    "dashHistory.col.city": "Қала",
    "dashHistory.col.duration": "Ұзақтығы",
    "dashHistory.col.date": "Күні",
    "dashHistory.dec": "желт.",

    "dashBilling.eyebrow": "Жазылым",
    "dashBilling.title": "Жазылымды басқару",
    "dashBilling.active": "БЕЛСЕНДІ",
    "dashBilling.planLineTemplate": "{plan} · {price} ₸/ай",
    "dashBilling.nextChargeTemplate": "Келесі есептен шығару: {date}",
    "dashBilling.nextChargeDate": "2027 жылғы 14 қаңтар",
    "dashBilling.changePlan": "Тарифті ауыстыру",
    "dashBilling.freeze": "Тоқтата тұру",
    "dashBilling.paymentMethod": "Төлем әдісі",
    "dashBilling.cardExpiry": "Visa · мерзімі 09/28 дейін",
    "dashBilling.change": "Өзгерту",
    "dashBilling.recentPayments": "Соңғы төлемдер",
    "dashBilling.paymentDate.0": "2026 жылғы 14 желтоқсан",
    "dashBilling.paymentDate.1": "2026 жылғы 14 қараша",
    "dashBilling.paymentDate.2": "2026 жылғы 14 қазан",

    "dashSettings.eyebrow": "Баптаулар",
    "dashSettings.title": "Профиль және хабарландырулар",
    "dashSettings.notif.push": "Жақын жердегі жаңа мекемелер туралы push",
    "dashSettings.notif.email": "Төлемдер мен ұзарту туралы email",
    "dashSettings.notif.sms": "Баруды растау туралы SMS",
    "dashSettings.notif.telegram": "Турнирлер мен іс-шаралар туралы Telegram",
    "dashSettings.save": "Сақтау",
    "dashSettings.cancel": "Бас тарту",

    "unit.hour": "сағ",
    "unit.min": "мин",
  },
};

const LANGS = [
  { code: "ru", label: "РУС" },
  { code: "kk", label: "ҚАЗ" },
];

function formatStr(str, vars) {
  if (!vars) return str;
  return Object.keys(vars).reduce((s, k) => s.split(`{${k}}`).join(vars[k]), str);
}

const LocaleContext = __createContext(null);

function LocaleProvider({ children }) {
  const [locale, setLocaleState] = __useStateI18n(() => {
    try { return localStorage.getItem("chillup_locale") || "ru"; } catch (e) { return "ru"; }
  });

  __useEffectI18n(() => {
    try { localStorage.setItem("chillup_locale", locale); } catch (e) {}
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const t = __useCallbackI18n((key, vars) => {
    const dict = STRINGS[locale] || STRINGS.ru;
    const raw = dict[key] ?? STRINGS.ru[key] ?? key;
    return formatStr(raw, vars);
  }, [locale]);

  const value = __useMemoI18n(() => ({ locale, setLocale: setLocaleState, t }), [locale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocale() {
  const ctx = __useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/* Display-only translation helpers for values stored in canonical Russian in
   the (shared) PARTNERS data, so filtering/search logic keeps comparing
   stable untranslated strings while the UI shows the localized label. */
function tierLabel(rawTier, t) {
  const map = { "Базовый": "tier.basic", "Премиум": "tier.premium", "VIP": "tier.vip" };
  return t(map[rawTier] || "tier.premium");
}

const TAG_KEYS = {
  "PC": "tag.pc", "VR": "tag.vr", "Консоли": "tag.consoles", "Боулинг": "tag.bowling",
  "Бар": "tag.bar", "Антикафе": "tag.anticafe", "Настолки": "tag.boardgames", "Теннис": "tag.tennis",
  "Обучение": "tag.coaching", "Киберспорт": "tag.esports", "Турниры": "tag.tournaments", "Кафе": "tag.cafe",
  "Симуляторы": "tag.simulators", "Аркады": "tag.arcades", "Ретро": "tag.retro", "Кальян": "tag.hookah",
};
function tagLabel(rawTag, t) {
  return t(TAG_KEYS[rawTag] || rawTag) || rawTag;
}

function cityLabel(rawCity, t) {
  return t("city." + rawCity) === "city." + rawCity ? rawCity : t("city." + rawCity);
}

/* ========== LANGUAGE SWITCHER ========== */
function LangSwitch({ compact = false }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={"lang-switch-opt" + (locale === l.code ? " is-active" : "")}
          onClick={() => setLocale(l.code)}
          type="button"
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { LocaleProvider, useLocale, LangSwitch, tierLabel, tagLabel, cityLabel });
