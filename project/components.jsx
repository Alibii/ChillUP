// components.jsx — shared UI primitives for ChillUP
// Exports to window: Brand, Nav, Footer, Icon, Eyebrow, Section, useRoute

const { useState, useEffect, useCallback, useMemo, useRef } = React;

/* ========== ROUTING (hash-based, no reloads) ========== */
function useRoute() {
  const [route, setRoute] = useState(() => (window.location.hash || "#/").replace(/^#/, "") || "/");
  useEffect(() => {
    const onHash = () => setRoute((window.location.hash || "#/").replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = useCallback((path) => { window.location.hash = path; window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  return [route, go];
}

/* ========== ICONS ========== */
function Icon({ name, size = 16, stroke = 1.6, style }) {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    arrowUR: <path d="M7 17L17 7M9 7h8v8"/>,
    check: <path d="M5 12l5 5L20 7"/>,
    cross: <path d="M6 6l12 12M6 18L18 6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    play: <path d="M8 5v14l11-7z"/>,
    download: <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    userPlus: <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3.5-7 7-7s7 3 7 7"/><path d="M19 8v6M16 11h6"/></>,
    login: <><path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></>,
    pin: <><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></>,
    bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>,
    bowling: <><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1"/><circle cx="13" cy="8" r="1"/><circle cx="11" cy="12" r="1"/></>,
    tennis: <><circle cx="12" cy="12" r="9"/><path d="M5 5c4 3 5 11 0 14M19 5c-4 3-5 11 0 14"/></>,
    joystick: <><rect x="7" y="14" width="10" height="6" rx="2"/><circle cx="12" cy="8" r="3"/><path d="M12 11v3"/></>,
    cards: <><rect x="4" y="6" width="11" height="14" rx="2"/><path d="M8 2h11a2 2 0 012 2v12"/></>,
    coffee: <><path d="M4 8h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4V8z"/><path d="M16 10h2a3 3 0 010 6h-2"/></>,
    vr: <><rect x="2" y="8" width="20" height="9" rx="3"/><circle cx="8" cy="12.5" r="1.5"/><circle cx="16" cy="12.5" r="1.5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    filter: <path d="M3 6h18M6 12h12M10 18h4"/>,
    apple: <path d="M16.5 12.5c0-2 1.5-3 1.7-3.1-1-1.4-2.4-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.4 2.5-.4 6.2 1 8.2.7 1 1.4 2.1 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.6.6 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.2zM14.2 6c.6-.7 1-1.7.9-2.7-.8 0-1.9.5-2.5 1.2-.5.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.1z"/>,
    play2: <path d="M5 4l14 8-14 8z"/>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    chevDown: <path d="M6 9l6 6 6-6"/>,
    star: <path d="M12 3l2.4 5.7 6.1.5-4.7 4 1.5 6L12 16.4 6.7 19.2l1.5-6-4.7-4 6.1-.5z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12l2 1-1 2-2-1-1 2-2-1-1 2h-2l-1-2-2 1-1-2-2 1-1-2 2-1-2-1 1-2 2 1 1-2 2 1 1-2h2l1 2 2-1 1 2 2-1 1 2-2 1z"/></>,
    creditCard: <><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20M6 16h3"/></>,
    qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v3M14 21h3M21 17v4"/></>,
    bell: <><path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></>,
    home: <path d="M3 12l9-8 9 8M5 10v10h14V10"/>,
    map: <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></>,
    chart: <path d="M4 20V8M10 20V4M16 20v-7M22 20H2"/>,
  };
  return (
    <svg viewBox="0 0 24 24" {...s}>{paths[name] || null}</svg>
  );
}

/* ========== BRAND MARK ========== */
function Brand({ size = "md", onClick }) {
  const s = size === "lg" ? { fontSize: 24, mark: 38 } : { fontSize: 20, mark: 32 };
  return (
    <button className="brand" onClick={onClick} style={{ fontSize: s.fontSize }}>
      <span className="brand-mark" style={{ width: s.mark, height: s.mark }}>
        <svg viewBox="0 0 24 24" width={s.mark * 0.55} height={s.mark * 0.55} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10v4a4 4 0 004 4h8a4 4 0 004-4v-4a4 4 0 00-4-4H8a4 4 0 00-4 4z"/>
          <path d="M8 12h2M14 12h2"/>
          <circle cx="16" cy="11" r=".5" fill="currentColor"/>
          <circle cx="14" cy="13" r=".5" fill="currentColor"/>
        </svg>
      </span>
      <span>Chill<span style={{ color: "var(--accent)" }}>UP</span></span>
    </button>
  );
}

/* ========== EYEBROW (mono kicker) ========== */
function Eyebrow({ children, style }) {
  return <span className="eyebrow" style={style}>{children}</span>;
}

/* ========== SECTION HEADER ========== */
function SectionHead({ kicker, title, sub, align = "left", id }) {
  return (
    <Reveal variant="up">
      <header id={id} style={{ textAlign: align, marginBottom: 48, display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 16 }}>
        {kicker && <Eyebrow>{kicker}</Eyebrow>}
        <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", maxWidth: 820 }}>{title}</h2>
        {sub && <p className="muted" style={{ fontSize: 18, maxWidth: 640, lineHeight: 1.5, margin: 0 }}>{sub}</p>}
      </header>
    </Reveal>
  );
}

/* ========== NAV ========== */
function Nav({ route, go }) {
  const items = [
    { path: "/", label: "Главная" },
    { path: "/pricing", label: "Тарифы" },
    { path: "/partners", label: "Партнёры" },
    { path: "/faq", label: "FAQ" },
  ];
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Brand onClick={() => go("/")} />
        <div className="nav-links">
          {items.map(it => (
            <button key={it.path} className={"nav-link" + (route === it.path ? " is-active" : "")} onClick={() => go(it.path)}>
              {it.label}
            </button>
          ))}
          <button className="nav-link" onClick={() => go("/login")}>Войти</button>
          <button className="btn btn--primary btn--sm" onClick={() => go("/register")} style={{ marginLeft: 8 }}>
            Регистрация <Icon name="arrow" size={14}/>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ========== FOOTER ========== */
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Brand />
            <p className="muted" style={{ fontSize: 14, marginTop: 16, lineHeight: 1.6, maxWidth: 320 }}>
              Одна подписка — бесконечные развлечения. Компьютерные клубы, антикафе, боулинг, настольный теннис.
            </p>
            <div className="flex gap-8 mt-24">
              <button className="btn btn--secondary btn--sm"><Icon name="apple" size={14}/> App Store</button>
              <button className="btn btn--secondary btn--sm"><Icon name="play2" size={14}/> Google Play</button>
            </div>
          </div>
          <div className="footer-col">
            <h6>Продукт</h6>
            <ul>
              <li><a onClick={() => go("/")}>Главная</a></li>
              <li><a onClick={() => go("/pricing")}>Тарифы</a></li>
              <li><a onClick={() => go("/partners")}>Партнёры</a></li>
              <li><a onClick={() => go("/faq")}>FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>Аккаунт</h6>
            <ul>
              <li><a onClick={() => go("/login")}>Войти</a></li>
              <li><a onClick={() => go("/register")}>Регистрация</a></li>
              <li><a onClick={() => go("/dashboard")}>Личный кабинет</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>Контакты</h6>
            <ul>
              <li className="mono dim">info@chillup.kz</li>
              <li className="mono dim">+7 (800) 123-45-67</li>
              <li className="mono dim">Алматы · Астана</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CHILLUP.KZ — ALL ACCESS, ONE PASS</span>
          <span>v3.0 / NEON</span>
        </div>
      </div>
    </footer>
  );
}

/* ========== CATEGORY DATA ========== */
const CATEGORIES = [
  { key: "pc",      label: "PC-клубы",         icon: "joystick", desc: "Игровые ПК, периферия, киберспорт", count: 142, accent: "" },
  { key: "tennis",  label: "Настольный теннис", icon: "tennis",   desc: "Профи столы, ракетки в прокат",       count: 38,  accent: "is-magenta" },
  { key: "bowling", label: "Боулинг",           icon: "bowling",  desc: "Дорожки, бар, компании от 2 до 20",   count: 24,  accent: "is-violet" },
  { key: "anticafe",label: "Антикафе",          icon: "coffee",   desc: "Время в подарок, настолки, чай",      count: 67,  accent: "" },
  { key: "board",   label: "Настольные игры",   icon: "cards",    desc: "1500+ игр, гейм-мастера",             count: 19,  accent: "is-magenta" },
  { key: "vr",      label: "VR & аркады",       icon: "vr",       desc: "VR-арены, симуляторы, аркадные авт.", count: 28,  accent: "is-violet" },
];

/* ========== PARTNERS DATA ========== */
const PARTNERS = [
  { name: "Game Zone Cyber",   city: "Алматы",    address: "пр. Абая, 150",         tags: ["PC", "VR", "Консоли"],     tier: "Премиум",  cat: "pc" },
  { name: "Strike Lanes",      city: "Астана",    address: "пр. Кабанбай батыра, 28", tags: ["Боулинг", "Бар"],         tier: "Базовый",  cat: "bowling" },
  { name: "Time Cafe",         city: "Шымкент",   address: "ул. Тауке хана, 45",    tags: ["Антикафе", "Настолки"],    tier: "VIP",      cat: "anticafe" },
  { name: "Ping Pong Pro",     city: "Караганда", address: "пр. Бухар жырау, 35",   tags: ["Теннис", "Обучение"],      tier: "Базовый",  cat: "tennis" },
  { name: "Cyber Space",       city: "Алматы",    address: "ул. Сатпаева, 90",      tags: ["Киберспорт", "Турниры"],  tier: "Премиум",  cat: "pc" },
  { name: "Board Game Hub",    city: "Астана",    address: "ул. Кенесары, 40",      tags: ["Настолки", "Кафе"],        tier: "Базовый",  cat: "board" },
  { name: "Neon Arena VR",     city: "Алматы",    address: "БЦ Esentai, 4 этаж",    tags: ["VR", "Симуляторы"],        tier: "Премиум",  cat: "vr" },
  { name: "Spin Table Club",   city: "Актобе",    address: "пр. Молдагуловой, 12",  tags: ["Теннис"],                  tier: "Базовый",  cat: "tennis" },
  { name: "King Pin Bowling",  city: "Алматы",    address: "ТРЦ MEGA, 3 этаж",      tags: ["Боулинг", "Бар"],         tier: "VIP",      cat: "bowling" },
  { name: "Pixel Arcade",      city: "Тараз",     address: "пр. Толе би, 88",       tags: ["Аркады", "Ретро"],         tier: "Базовый",  cat: "vr" },
  { name: "Anticafe Loft",     city: "Павлодар",  address: "ул. Естая, 60",         tags: ["Антикафе", "Кальян"],      tier: "Базовый",  cat: "anticafe" },
  { name: "Esports HQ",        city: "Астана",    address: "ул. Достык, 14",        tags: ["PC", "Турниры"],           tier: "Премиум",  cat: "pc" },
];

/* ========== EXPORT ========== */
Object.assign(window, {
  useRoute, Icon, Brand, Eyebrow, SectionHead, Nav, Footer,
  CATEGORIES, PARTNERS,
});
