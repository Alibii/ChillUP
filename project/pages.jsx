// pages.jsx — All pages: Home, Pricing, Partners, FAQ, Login, Register, Dashboard
// Depends on: components.jsx (Brand, Nav, Footer, Icon, Eyebrow, SectionHead, CATEGORIES, PARTNERS)

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

/* =========================================================
   HOME
   ========================================================= */
function HomePage({ go }) {
  return (
    <>
      <Hero go={go} />
      <Ticker />
      <Categories go={go} />
      <HowItWorks />
      <PricingPreview go={go} />
      <PartnersPreview go={go} />
      <Stats />
      <Testimonials />
      <FaqPreview go={go} />
      <DownloadCTA />
    </>
  );
}

/* ----- HERO ----- */
function Hero({ go }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <Reveal variant="up" delay={0}><Eyebrow>Подписка + Казахстан</Eyebrow></Reveal>
            <Reveal variant="up" delay={80}>
              <h1 className="hero-headline">
                Развлекайся<br/>
                <span className="accent">безлимитно</span>.<br/>
                Один пасс — <span className="accent-2">всё</span>.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={160}>
              <p className="hero-sub">
                ChillUP — это единая подписка на компьютерные клубы, антикафе, боулинг,
                настольный теннис и VR-арены. Без счётов, без бронирований — просто приходи и играй.
              </p>
            </Reveal>
            <Reveal variant="up" delay={240}>
              <div className="hero-cta">
                <Magnetic strength={0.25}>
                  <button className="btn btn--primary btn--lg" onClick={() => go("/register")}>
                    Попробовать 7 дней бесплатно <Icon name="arrow" size={16}/>
                  </button>
                </Magnetic>
                <button className="btn btn--ghost btn--lg" onClick={() => go("/pricing")}>
                  <Icon name="play" size={14}/> Тарифы
                </button>
              </div>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <div className="flex gap-24 mt-48 wrap">
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={500} suffix="+"/></div>
                  <div className="stat-label">Партнёров</div>
                </div>
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={50} suffix="+"/></div>
                  <div className="stat-label">Городов</div>
                </div>
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={50} suffix="K"/></div>
                  <div className="stat-label">Активных пользователей</div>
                </div>
              </div>
            </Reveal>
          </div>

          <div style={{ position: "relative" }}>
            <Reveal variant="scale" delay={120}><HeroVisual /></Reveal>
            <div style={{ position: "absolute", top: -46, right: -20, zIndex: 5, pointerEvents: "auto" }}>
              <Mascot size={128}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Animated city-grid hero visual */
function HeroVisual() {
  const [tick, setTick] = useStateP(0);
  useEffectP(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  // Generate stable random pins
  const pins = useMemoP(() => {
    const seed = (n) => { let x = Math.sin(n) * 10000; return x - Math.floor(x); };
    return Array.from({ length: 18 }, (_, i) => ({
      x: 8 + seed(i + 1) * 84,
      y: 8 + seed(i + 9) * 84,
      kind: i % 3,
    }));
  }, []);

  return (
    <div className="hero-visual">
      {/* grid bg */}
      <svg width="100%" height="100%" viewBox="0 0 400 420" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".0"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity=".2"/>
          </linearGradient>
        </defs>
        {Array.from({length: 16}).map((_, i) => (
          <line key={"v"+i} x1={i*25} y1="0" x2={i*25} y2="420" stroke="var(--line)" strokeWidth="1"/>
        ))}
        {Array.from({length: 17}).map((_, i) => (
          <line key={"h"+i} x1="0" y1={i*25} x2="400" y2={i*25} stroke="var(--line)" strokeWidth="1"/>
        ))}
        {/* "scanning" sweep */}
        <line x1="0" x2="400" y1={((tick * 40) % 420)} y2={((tick * 40) % 420)} stroke="var(--accent)" strokeWidth="1" opacity=".4">
          <animate attributeName="opacity" values=".2;.6;.2" dur="1.2s" repeatCount="indefinite"/>
        </line>
      </svg>

      {/* venue pins */}
      {pins.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: p.kind === 0 ? "var(--accent)" : p.kind === 1 ? "var(--accent-2)" : "var(--accent-3)",
            boxShadow: `0 0 14px ${p.kind === 0 ? "var(--accent)" : p.kind === 1 ? "var(--accent-2)" : "var(--accent-3)"}`,
            animation: `pulse 2s ease-in-out infinite ${(i % 6) * 0.2}s`,
          }}/>
        </div>
      ))}

      {/* status card overlay */}
      <div style={{
        position: "absolute", left: 20, bottom: 20, right: 20,
        padding: 16, border: "1px solid var(--line)",
        background: "color-mix(in oklab, var(--surface) 90%, transparent)",
        backdropFilter: "blur(12px)",
        borderRadius: "var(--radius-card)",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
      }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "var(--text-3)", textTransform: "uppercase" }}>СТАТУС СЕТИ · LIVE</div>
          <div className="h-display" style={{ fontSize: 20, marginTop: 4 }}>
            <span style={{ color: "var(--accent)" }}>●</span> 234 заведений онлайн
          </div>
        </div>
        <div className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>
          {String(((tick * 7) % 60)).padStart(2, "0")}<span style={{ opacity: .4 }}>FPS</span>
        </div>
      </div>

      {/* corner ticker */}
      <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
        <span className="chip chip--dot chip--accent">ALMATY</span>
        <span className="chip">+04:00</span>
      </div>
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <span className="chip">No. {String(2046 + tick).padStart(6, "0")}</span>
      </div>
    </div>
  );
}

/* ----- TICKER ----- */
function Ticker() {
  const items = ["безлимитные посещения", "500+ партнёров", "₸ один платёж в месяц", "PC · теннис · боулинг · VR", "Россия + Казахстан", "отмена в один клик", "первая неделя бесплатно"];
  const doubled = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => <span key={i} className="ticker-item">{t}</span>)}
      </div>
    </div>
  );
}

/* ----- CATEGORIES (bento grid) ----- */
function Categories({ go }) {
  const layout = [
    { key: "pc",      span: 3, tall: true,  accent: "" },
    { key: "tennis",  span: 3, tall: false, accent: "is-magenta" },
    { key: "bowling", span: 3, tall: false, accent: "is-violet" },
    { key: "vr",      span: 2, tall: false, accent: "" },
    { key: "anticafe",span: 2, tall: false, accent: "is-magenta" },
    { key: "board",   span: 2, tall: false, accent: "is-violet" },
  ];
  const byKey = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));
  return (
    <section>
      <div className="container">
        <SectionHead
          kicker="ШЕСТЬ КАТЕГОРИЙ"
          title="Любой формат отдыха — без выбора между ними."
          sub="Закрытая сеть из тщательно отобранных заведений. Один пасс открывает все двери."
        />
        <div className="cat-grid">
          {layout.map(({ key, span, tall, accent }, li) => {
            const c = byKey[key];
            return (
              <Reveal key={key} variant="up" delay={li * 70} className={`cat-cell span-${span}${tall ? " is-tall" : ""}`}>
              <div
                className={`cat-tile ${accent} ${tall ? "is-tall" : ""}`}
                onClick={() => go("/partners")}
                role="button"
              >
                <div className="flex between middle">
                  <span className="cat-tile-num">/ 0{CATEGORIES.findIndex(x => x.key === key) + 1}</span>
                  <span className="chip">{c.count}</span>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  <Icon name={c.icon} size={tall ? 56 : 36} stroke={1.4} style={{ color: "var(--accent)" }}/>
                  <h3 className="cat-tile-title">{c.label}</h3>
                  <p className="cat-tile-desc">{c.desc}</p>
                </div>
                <div className="cat-tile-glow"/>
              </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----- HOW IT WORKS ----- */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Скачай приложение", d: "Создай аккаунт за 30 секунд и получи QR-код доступа.", icon: "download" },
    { n: "02", t: "Выбери тариф",      d: "От базового до VIP. Первая неделя — бесплатно, отмена в один клик.", icon: "creditCard" },
    { n: "03", t: "Приходи и играй",    d: "Покажи QR на ресепшене любого партнёра. Время не ограничено.", icon: "qr" },
  ];
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <SectionHead
          kicker="ПРОЦЕСС"
          title="Три шага между тобой и развлечением."
        />
        <div className="step-row">
          {steps.map((s, si) => (
            <Reveal key={s.n} variant="up" delay={si * 100}>
            <div className="step">
              <div className="step-num">{s.n}</div>
              <Icon name={s.icon} size={32} stroke={1.4} style={{ color: "var(--accent)", marginBottom: 16 }}/>
              <h3 className="step-title">{s.t}</h3>
              <p className="step-desc">{s.d}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- PRICING PREVIEW (on home) ----- */
function PricingPreview({ go }) {
  const [period, setPeriod] = useStateP("month");
  return (
    <section>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow>Тарифы</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", marginTop: 16 }}>
              Подбери план под свой ритм.
            </h2>
          </div>
          <BillingToggle period={period} setPeriod={setPeriod} />
        </div>
        <PlanGrid period={period} go={go} />
      </div>
    </section>
  );
}

function BillingToggle({ period, setPeriod }) {
  return (
    <div className="toggle">
      <button className={"toggle-opt" + (period === "month" ? " is-on" : "")} onClick={() => setPeriod("month")}>Месяц</button>
      <button className={"toggle-opt" + (period === "year" ? " is-on" : "")} onClick={() => setPeriod("year")}>
        Год <span className="mono" style={{ fontSize: 10, opacity: .8 }}>−20%</span>
      </button>
    </div>
  );
}

const PLANS = [
  {
    key: "basic",
    name: "Базовый",
    tagline: "Старт. Несколько вечеров в неделю.",
    monthly: 990,
    features: [
      { ok: true,  t: "Доступ к базовым заведениям" },
      { ok: true,  t: "До 10 посещений в месяц" },
      { ok: true,  t: "PC-клубы и антикафе" },
      { ok: false, t: "Боулинг и настольный теннис" },
      { ok: false, t: "VIP-заведения" },
    ],
    cta: "Начать",
  },
  {
    key: "premium",
    name: "Премиум",
    tagline: "Безлимит. Большинству — самое то.",
    monthly: 1990,
    featured: true,
    badge: "ПОПУЛЯРНЫЙ",
    features: [
      { ok: true, t: "Все заведения сети" },
      { ok: true, t: "Безлимитные посещения" },
      { ok: true, t: "PC, антикафе, теннис, боулинг" },
      { ok: true, t: "Скидки на партнёров VIP-тира" },
      { ok: true, t: "Бронирование столов и дорожек" },
    ],
    cta: "Выбрать Премиум",
  },
  {
    key: "vip",
    name: "VIP",
    tagline: "Для тех, кто живёт в клубе.",
    monthly: 3990,
    features: [
      { ok: true, t: "Все заведения, включая VIP" },
      { ok: true, t: "Безлимит + 2 часа боулинга/мес" },
      { ok: true, t: "Эксклюзивные турниры" },
      { ok: true, t: "Приоритетная поддержка 24/7" },
      { ok: true, t: "Гость +1 раз в неделю" },
    ],
    cta: "Стать VIP",
  },
];

function PlanGrid({ period, go }) {
  const yearMult = 12 * 0.8;
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {PLANS.map((p, pi) => {
        const price = period === "year" ? Math.round(p.monthly * yearMult) : p.monthly;
        return (
          <Reveal key={p.key} variant="up" delay={pi * 110}>
          <div className={"card plan-card card--hover" + (p.featured ? " is-featured" : "")}>
            {p.badge && <span className="plan-badge">{p.badge}</span>}
            <h3 className="plan-name">{p.name}</h3>
            <p className="plan-tagline">{p.tagline}</p>
            <div className="plan-price">
              <span className="amount">{price.toLocaleString("ru-RU")}</span>
              <span className="currency">₸</span>
              <span className="period">/ {period === "year" ? "год" : "мес"}</span>
            </div>
            {period === "year" && <div className="mono" style={{ fontSize: 11, color: "var(--good)" }}>Экономия {Math.round((p.monthly * 12) - price).toLocaleString("ru-RU")} ₸ за год</div>}
            <ul className="plan-features">
              {p.features.map((f, i) => (
                <li key={i} className={f.ok ? "" : "is-off"}>
                  <Icon name={f.ok ? "check" : "cross"} size={16} style={{ color: f.ok ? "var(--accent)" : "var(--text-3)" }}/>
                  {f.t}
                </li>
              ))}
            </ul>
            <button className={"btn btn--block " + (p.featured ? "btn--primary" : "btn--secondary")} onClick={() => go("/register")}>
              {p.cta} <Icon name="arrow" size={14}/>
            </button>
          </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ----- PARTNERS PREVIEW ----- */
function PartnersPreview({ go }) {
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow>Сеть · 500+ точек</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", marginTop: 16 }}>
              Партнёры, которым доверяют 50K игроков.
            </h2>
          </div>
          <button className="btn btn--ghost" onClick={() => go("/partners")}>
            Смотреть всех <Icon name="arrowUR" size={14}/>
          </button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {PARTNERS.slice(0, 6).map((p, i) => <PartnerCard key={i} p={p} idx={i}/>)}
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ p, idx }) {
  const cat = CATEGORIES.find(c => c.key === p.cat);
  return (
    <Reveal variant="up" delay={(idx % 3) * 90}>
    <div className="card partner-card card--hover">
      <div className="partner-img">
        <Icon name={cat.icon} size={64} stroke={1.2} style={{ color: "var(--accent)", opacity: .9 }}/>
        <span className="partner-img-label">№ {String(idx + 1).padStart(3, "0")} · {cat.label}</span>
      </div>
      <div className="partner-body">
        <div className="flex between middle">
          <h3 className="partner-name">{p.name}</h3>
          <span className={"chip " + (p.tier === "VIP" ? "chip--magenta" : p.tier === "Премиум" ? "chip--accent" : "")}>{p.tier}</span>
        </div>
        <div className="partner-meta"><Icon name="pin" size={12}/> {p.city} · {p.address}</div>
        <div className="flex gap-8 wrap">
          {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
      </div>
    </div>
    </Reveal>
  );
}

/* ----- STATS ----- */
function Stats() {
  const items = [
    { to: 500, suffix: "+", label: "Партнёров в сети" },
    { to: 50,  suffix: "+", label: "Городов" },
    { to: 1.2, suffix: "M", decimals: 1, label: "Часов отыграно" },
    { to: 98,  suffix: "%", label: "Возвращаемость" },
  ];
  return (
    <section className="tight">
      <div className="container">
        <Reveal variant="scale">
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
          {items.map((it, i) => (
            <div key={i} style={{ padding: 32, borderRight: i < 3 ? "1px solid var(--line)" : "none", background: "var(--surface)" }}>
              <div className="stat-num"><CountUp to={it.to} suffix={it.suffix} decimals={it.decimals || 0}/></div>
              <div className="stat-label" style={{ marginTop: 8 }}>{it.label}</div>
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----- TESTIMONIALS ----- */
function Testimonials() {
  const items = [
    { q: "Раньше тратил по 30к в месяц на компьютерный клуб. Теперь хожу куда хочу за 2к — это какая-то магия.", name: "Ермек К.", role: "Разработчик · Алматы", initials: "ЕК" },
    { q: "С друзьями катаемся то в боулинг, то в антикафе. Одна подписка, никакой возни с кошельками.", name: "Дина А.", role: "Студентка · Астана", initials: "ДА" },
    { q: "Теннис три раза в неделю — окупается на четвёртый день. Сервис огонь.", name: "Армат С.", role: "Тренер · Шымкент", initials: "АС" },
  ];
  return (
    <section>
      <div className="container">
        <SectionHead kicker="ОТЗЫВЫ" title="Что говорят пользователи." />
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {items.map((t, i) => (
            <Reveal key={i} variant="up" delay={i * 100}>
            <div className="card tcard">
              <div className="flex gap-8 mb-16">
                {[...Array(5)].map((_, j) => <Icon key={j} name="star" size={14} style={{ color: "var(--accent)", fill: "var(--accent)" }}/>)}
              </div>
              <q>{t.q}</q>
              <div className="t-author">
                <div className="t-avatar">{t.initials}</div>
                <div className="t-meta">
                  <span className="t-name">{t.name}</span>
                  <span className="t-role">{t.role}</span>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- FAQ ----- */
const FAQ_DATA = [
  { q: "Как работает подписка ChillUP?", a: "Вы оплачиваете один из тарифов (Базовый, Премиум или VIP) и получаете в приложении QR-код, который показываете на ресепшене любого партнёрского заведения. Никаких дополнительных платежей." },
  { q: "Можно отменить в любой момент?", a: "Да. Отмена происходит в один клик в личном кабинете. Доступ сохраняется до конца оплаченного периода." },
  { q: "Что входит в Премиум, но не входит в Базовый?", a: "Премиум открывает безлимитные посещения, боулинг и настольный теннис, а также скидки на VIP-партнёров." },
  { q: "Есть ли пробный период?", a: "Да, первые 7 дней — бесплатно. Карту привязывать не обязательно для базового тарифа." },
  { q: "Можно ли заморозить подписку?", a: "Можно заморозить на срок до 3 месяцев один раз в год, например на время отъезда." },
  { q: "Работает ли ChillUP в России?", a: "Да, подписка действует в России и Казахстане — список городов смотрите на странице партнёров." },
];

function FaqPreview({ go }) {
  const [open, setOpen] = useStateP(0);
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 16, marginBottom: 16 }}>
              Вопросы, которые задают чаще всего.
            </h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 24 }}>
              Не нашли ответа? Поддержка работает 24/7 в чате приложения.
            </p>
            <button className="btn btn--ghost" onClick={() => go("/faq")}>Все вопросы <Icon name="arrow" size={14}/></button>
          </div>
          <div>
            {FAQ_DATA.slice(0, 5).map((it, i) => (
              <div key={i} className={"faq-item" + (open === i ? " is-open" : "")} onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="faq-head">
                  <span className="faq-q">{it.q}</span>
                  <span className="faq-icon"><Icon name={open === i ? "minus" : "plus"} size={14}/></span>
                </div>
                <div className="faq-a">{it.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- DOWNLOAD CTA ----- */
function DownloadCTA() {
  return (
    <section>
      <div className="container">
        <div style={{
          position: "relative",
          padding: "64px 48px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--line-strong)",
          background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 12%, var(--surface)), color-mix(in oklab, var(--accent-2) 8%, var(--surface)))",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(60% 70% at 80% 50%, color-mix(in oklab, var(--accent) 25%, transparent), transparent)" }}/>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center", position: "relative" }}>
            <div>
              <Eyebrow>iOS · Android</Eyebrow>
              <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "16px 0" }}>
                Скачай ChillUP и приходи играть.
              </h2>
              <p className="muted" style={{ fontSize: 16, marginBottom: 24, maxWidth: 480, lineHeight: 1.5 }}>
                Управляй подпиской, находи заведения рядом, бронируй столы и дорожки прямо в приложении.
              </p>
              <div className="flex gap-12 wrap">
                <button className="btn btn--primary btn--lg"><Icon name="apple" size={16}/> App Store</button>
                <button className="btn btn--secondary btn--lg"><Icon name="play2" size={16}/> Google Play</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PhoneMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="float" style={{
      width: 220, height: 440,
      border: "2px solid var(--line-strong)",
      borderRadius: 32,
      background: "var(--bg)",
      padding: 12,
      position: "relative",
      boxShadow: "0 30px 80px rgba(0,0,0,.6)",
    }}>
      <div style={{
        position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
        width: 60, height: 6, background: "var(--line-strong)", borderRadius: 3,
      }}/>
      <div style={{
        width: "100%", height: "100%",
        border: "1px solid var(--line)",
        borderRadius: 22,
        background: "var(--bg-2)",
        padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
        overflow: "hidden",
        marginTop: 8,
      }}>
        <div style={{ height: 8 }}/>
        <div className="mono dim" style={{ fontSize: 9 }}>QR ACCESS</div>
        <div style={{
          aspectRatio: "1", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--line)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name="qr" size={60} stroke={1.4} style={{ color: "var(--accent)" }}/>
        </div>
        <div className="h-display" style={{ fontSize: 14 }}>Премиум · активен</div>
        <div className="mono dim" style={{ fontSize: 9 }}>До 14 декабря</div>
        <div className="bar"><span style={{ width: "62%" }}/></div>
      </div>
    </div>
  );
}

/* =========================================================
   PRICING PAGE
   ========================================================= */
function PricingPage({ go }) {
  const [period, setPeriod] = useStateP("month");
  return (
    <>
      <section className="hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="container center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <Eyebrow>Тарифы</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            Один план — <span style={{ color: "var(--accent)" }}>вся</span> сеть.
          </h1>
          <p className="muted" style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.5 }}>
            Прозрачная цена, отмена в один клик, первая неделя — бесплатно.
          </p>
          <BillingToggle period={period} setPeriod={setPeriod}/>
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <PlanGrid period={period} go={go}/>
        </div>
      </section>

      <ComparisonTable/>
      <PricingFAQ/>
    </>
  );
}

function ComparisonTable() {
  const rows = [
    { f: "Доступ к PC-клубам и антикафе",      values: [true, true, true] },
    { f: "Безлимитные посещения",               values: [false, true, true] },
    { f: "Боулинг и настольный теннис",         values: [false, true, true] },
    { f: "VIP-заведения",                       values: [false, false, true] },
    { f: "Бронирование онлайн",                 values: [false, true, true] },
    { f: "Гость +1 раз в неделю",               values: [false, false, true] },
    { f: "Приоритетная поддержка 24/7",         values: [false, false, true] },
    { f: "2 часа боулинга в подарок (мес)",     values: [false, false, true] },
  ];
  return (
    <section>
      <div className="container">
        <SectionHead kicker="СРАВНЕНИЕ" title="Что входит в каждый план."/>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 28px", borderBottom: "1px solid var(--line)" }}>
            <span className="label">Возможности</span>
            <span className="label center">Базовый</span>
            <span className="label center" style={{ color: "var(--accent)" }}>Премиум</span>
            <span className="label center">VIP</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 28px", borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>{r.f}</span>
              {r.values.map((v, j) => (
                <span key={j} className="center" style={{ display: "flex", justifyContent: "center" }}>
                  {v ? <Icon name="check" size={18} style={{ color: "var(--accent)" }}/> : <Icon name="cross" size={16} style={{ color: "var(--text-3)" }}/>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFAQ() {
  const [open, setOpen] = useStateP(0);
  const items = [
    { q: "Когда происходит списание?", a: "В день оформления подписки и далее каждый месяц или год — в зависимости от выбранного периода." },
    { q: "Можно ли вернуть деньги?", a: "Возврат возможен в течение 14 дней с момента оплаты при условии, что вы не использовали услуги." },
    { q: "Что произойдёт по окончании пробного периода?", a: "Списание произойдёт автоматически по выбранному тарифу. Вы можете отменить подписку до окончания триала без списания." },
  ];
  return (
    <section>
      <div className="container" style={{ maxWidth: 800 }}>
        <SectionHead kicker="УСЛОВИЯ" title="Подписка без сюрпризов." align="left"/>
        {items.map((it, i) => (
          <div key={i} className={"faq-item" + (open === i ? " is-open" : "")} onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="faq-head">
              <span className="faq-q">{it.q}</span>
              <span className="faq-icon"><Icon name={open === i ? "minus" : "plus"} size={14}/></span>
            </div>
            <div className="faq-a">{it.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PARTNERS PAGE (with filters)
   ========================================================= */
function PartnersPage({ go }) {
  const [q, setQ] = useStateP("");
  const [city, setCity] = useStateP("all");
  const [cat, setCat] = useStateP("all");
  const [tier, setTier] = useStateP("all");

  const cities = useMemoP(() => ["all", ...Array.from(new Set(PARTNERS.map(p => p.city)))], []);

  const filtered = useMemoP(() => {
    return PARTNERS.filter(p => {
      if (q && !`${p.name} ${p.city} ${p.address}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "all" && p.city !== city) return false;
      if (cat !== "all" && p.cat !== cat) return false;
      if (tier !== "all" && p.tier !== tier) return false;
      return true;
    });
  }, [q, city, cat, tier]);

  return (
    <>
      <section className="hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="container center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Eyebrow>Партнёры · 500+ точек</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            Сеть, которая <span style={{ color: "var(--accent)" }}>растёт</span>.
          </h1>
          <p className="muted" style={{ fontSize: 18, maxWidth: 640, lineHeight: 1.5 }}>
            Каждое заведение проходит проверку. Никаких сюрпризов в качестве.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Filters */}
          <div className="card" style={{ marginBottom: 32, padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}/>
                <input className="input" placeholder="Поиск по названию, городу, адресу..." value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 40 }}/>
              </div>
              <select className="input" value={city} onChange={e => setCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c === "all" ? "Все города" : c}</option>)}
              </select>
              <select className="input" value={cat} onChange={e => setCat(e.target.value)}>
                <option value="all">Все категории</option>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <select className="input" value={tier} onChange={e => setTier(e.target.value)}>
                <option value="all">Все тиры</option>
                <option>Базовый</option>
                <option>Премиум</option>
                <option>VIP</option>
              </select>
            </div>
            <div className="flex gap-8 mt-16 wrap" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="flex gap-8 wrap">
                {[["all", "Все"], ...CATEGORIES.map(c => [c.key, c.label])].map(([k, l]) => (
                  <button key={k} className={"chip " + (cat === k ? "chip--accent" : "")} onClick={() => setCat(k)}>{l}</button>
                ))}
              </div>
              <span className="mono dim" style={{ fontSize: 12 }}>Найдено: {filtered.length}</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filtered.map((p, i) => <PartnerCard key={i} p={p} idx={i}/>)}
          </div>
          {filtered.length === 0 && (
            <div className="card center" style={{ padding: 48 }}>
              <h3 className="h-display" style={{ fontSize: 24, marginBottom: 8 }}>Ничего не нашли</h3>
              <p className="muted">Попробуйте изменить фильтры или сбросить поиск.</p>
              <button className="btn btn--secondary mt-16" onClick={() => { setQ(""); setCity("all"); setCat("all"); setTier("all"); }}>Сбросить</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================================
   FAQ PAGE
   ========================================================= */
function FaqPage() {
  const [open, setOpen] = useStateP(0);
  return (
    <>
      <section className="hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="container center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            Часто <span style={{ color: "var(--accent)" }}>спрашивают</span>.
          </h1>
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {FAQ_DATA.map((it, i) => (
            <div key={i} className={"faq-item" + (open === i ? " is-open" : "")} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-head">
                <span className="faq-q">{it.q}</span>
                <span className="faq-icon"><Icon name={open === i ? "minus" : "plus"} size={14}/></span>
              </div>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}

          <div className="card mt-48 center" style={{ padding: 40 }}>
            <Icon name="bell" size={28} stroke={1.4} style={{ color: "var(--accent)", margin: "0 auto 12px" }}/>
            <h3 className="h-display" style={{ fontSize: 24 }}>Не нашли ответ?</h3>
            <p className="muted mt-8" style={{ marginBottom: 16 }}>Поддержка работает 24/7 в приложении и в Telegram.</p>
            <div className="flex gap-8" style={{ justifyContent: "center" }}>
              <button className="btn btn--primary">Открыть чат</button>
              <button className="btn btn--secondary">Telegram</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   LOGIN
   ========================================================= */
function LoginPage({ go }) {
  return (
    <section className="hero">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", minHeight: "70vh" }}>
        <div>
          <Eyebrow>Вход</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", marginTop: 16, marginBottom: 16 }}>
            С возвращением.<br/><span style={{ color: "var(--accent)" }}>Игра ждёт.</span>
          </h1>
          <p className="muted" style={{ fontSize: 16, maxWidth: 440, lineHeight: 1.5 }}>
            Войди, чтобы открыть QR-доступ к 500+ заведениям и управлять подпиской.
          </p>
          <div className="mt-32 flex gap-12">
            <div>
              <div className="stat-num" style={{ fontSize: 24 }}>500+</div>
              <div className="stat-label mt-8">Партнёров</div>
            </div>
            <div style={{ width: 1, background: "var(--line)" }}/>
            <div>
              <div className="stat-num" style={{ fontSize: 24 }}>50K</div>
              <div className="stat-label mt-8">Пользователей</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 40 }}>
          <h2 className="h-display" style={{ fontSize: 28, marginBottom: 24 }}>Войти</h2>
          <div className="col gap-16">
            <div className="field">
              <span className="label">Email или телефон</span>
              <input className="input" placeholder="you@chillup.kz" defaultValue="ermek@chillup.kz"/>
            </div>
            <div className="field">
              <span className="label">Пароль</span>
              <input className="input" type="password" placeholder="••••••••" defaultValue="••••••••"/>
            </div>
            <div className="flex between middle">
              <label className="flex gap-8 middle" style={{ fontSize: 13, color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked/> Запомнить
              </label>
              <a className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>Забыли пароль?</a>
            </div>
            <button className="btn btn--primary btn--block btn--lg" onClick={() => go("/dashboard")}>
              Войти <Icon name="arrow" size={14}/>
            </button>
            <div className="center mono dim" style={{ fontSize: 11, marginTop: 8 }}>ИЛИ</div>
            <button className="btn btn--secondary btn--block">Войти через Telegram</button>
            <div className="center muted mt-16" style={{ fontSize: 13 }}>
              Нет аккаунта? <a onClick={() => go("/register")} style={{ color: "var(--accent)", cursor: "pointer" }}>Регистрация</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REGISTER
   ========================================================= */
function RegisterPage({ go }) {
  const [step, setStep] = useStateP(0);
  const [plan, setPlan] = useStateP("premium");

  return (
    <section className="hero">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="center mb-32">
          <Eyebrow>Регистрация · 7 дней бесплатно</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(40px, 6vw, 64px)", marginTop: 16 }}>
            Стань частью сети <span style={{ color: "var(--accent)" }}>ChillUP</span>.
          </h1>
        </div>

        {/* Stepper */}
        <div className="flex gap-12 mb-32" style={{ justifyContent: "center" }}>
          {["Аккаунт", "Тариф", "Готово"].map((s, i) => (
            <div key={i} className="flex gap-8 middle">
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "grid", placeItems: "center",
                background: i <= step ? "var(--accent)" : "var(--surface)",
                color: i <= step ? "#000" : "var(--text-3)",
                border: "1px solid var(--line)",
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
              }}>{i + 1}</div>
              <span className="mono" style={{ fontSize: 11, color: i <= step ? "var(--text)" : "var(--text-3)", letterSpacing: ".12em", textTransform: "uppercase" }}>{s}</span>
              {i < 2 && <div style={{ width: 28, height: 1, background: i < step ? "var(--accent)" : "var(--line)" }}/>}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 40 }}>
          {step === 0 && (
            <div className="col gap-16">
              <h2 className="h-display" style={{ fontSize: 24, margin: 0 }}>Создай аккаунт</h2>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="field"><span className="label">Имя</span><input className="input" defaultValue="Ермек"/></div>
                <div className="field"><span className="label">Фамилия</span><input className="input" defaultValue="Касенов"/></div>
              </div>
              <div className="field"><span className="label">Email</span><input className="input" type="email" defaultValue="ermek@chillup.kz"/></div>
              <div className="field"><span className="label">Телефон</span><input className="input" defaultValue="+7 (777) 123-45-67"/></div>
              <div className="field"><span className="label">Пароль</span><input className="input" type="password" defaultValue="••••••••"/></div>
              <div className="flex gap-12">
                <button className="btn btn--secondary fill" onClick={() => go("/")}>Отмена</button>
                <button className="btn btn--primary fill" onClick={() => setStep(1)}>Дальше <Icon name="arrow" size={14}/></button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="col gap-16">
              <h2 className="h-display" style={{ fontSize: 24, margin: 0 }}>Выбери тариф</h2>
              {PLANS.map(p => (
                <div key={p.key} className={"card card--hover " + (plan === p.key ? "card--accent" : "")} style={{ padding: 20, cursor: "pointer" }} onClick={() => setPlan(p.key)}>
                  <div className="flex between middle">
                    <div>
                      <h3 className="plan-name" style={{ margin: 0 }}>{p.name}</h3>
                      <span className="plan-tagline" style={{ display: "block", marginTop: 4 }}>{p.tagline}</span>
                    </div>
                    <div className="flex middle gap-12">
                      <div style={{ textAlign: "right" }}>
                        <div className="h-display" style={{ fontSize: 24 }}>{p.monthly.toLocaleString("ru-RU")} ₸</div>
                        <div className="mono dim" style={{ fontSize: 11 }}>/мес</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: "1.5px solid " + (plan === p.key ? "var(--accent)" : "var(--line-strong)"),
                        background: plan === p.key ? "var(--accent)" : "transparent",
                        display: "grid", placeItems: "center",
                      }}>
                        {plan === p.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#000" }}/>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-12">
                <button className="btn btn--secondary fill" onClick={() => setStep(0)}>Назад</button>
                <button className="btn btn--primary fill" onClick={() => setStep(2)}>Активировать триал <Icon name="bolt" size={14}/></button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "var(--glow-accent)" }}>
                <Icon name="check" size={40} stroke={2.5} style={{ color: "#000" }}/>
              </div>
              <h2 className="h-display" style={{ fontSize: 36, margin: 0 }}>Всё готово!</h2>
              <p className="muted" style={{ maxWidth: 420, lineHeight: 1.5 }}>
                Твой 7-дневный триал тарифа <b style={{ color: "var(--accent)" }}>{PLANS.find(p => p.key === plan).name}</b> активен.
                QR-код доступа уже в твоём личном кабинете.
              </p>
              <div className="flex gap-12 mt-16">
                <button className="btn btn--primary btn--lg" onClick={() => go("/dashboard")}>Открыть кабинет <Icon name="arrow" size={14}/></button>
                <button className="btn btn--secondary" onClick={() => go("/")}>На главную</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */
function DashboardPage({ go }) {
  const [tab, setTab] = useStateP("overview");

  return (
    <section className="hero">
      <div className="container">
        <div className="dash-grid">
          {/* Side */}
          <aside className="dash-side">
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", marginBottom: 4 }}>
              <div className="t-avatar" style={{ width: 40, height: 40, marginBottom: 8 }}>ЕК</div>
              <div className="h-display" style={{ fontSize: 16 }}>Ермек К.</div>
              <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 2 }}>Премиум · активен</div>
            </div>
            {[
              { k: "overview", l: "Обзор", i: "home" },
              { k: "qr",       l: "QR-доступ", i: "qr" },
              { k: "history",  l: "История", i: "clock" },
              { k: "billing",  l: "Подписка", i: "creditCard" },
              { k: "settings", l: "Настройки", i: "settings" },
            ].map(it => (
              <button key={it.k} className={tab === it.k ? "is-active" : ""} onClick={() => setTab(it.k)}>
                <Icon name={it.i} size={16}/> {it.l}
              </button>
            ))}
            <div style={{ flex: 1 }}/>
            <button onClick={() => go("/")} style={{ color: "var(--text-3)" }}>
              <Icon name="login" size={16}/> Выйти
            </button>
          </aside>

          {/* Main */}
          <div className="col gap-24">
            {tab === "overview" && <DashOverview/>}
            {tab === "qr" && <DashQR/>}
            {tab === "history" && <DashHistory/>}
            {tab === "billing" && <DashBilling/>}
            {tab === "settings" && <DashSettings/>}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashOverview() {
  return (
    <>
      <div className="flex between middle wrap gap-12">
        <div>
          <Eyebrow>Обзор</Eyebrow>
          <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>Привет, Ермек.</h1>
        </div>
        <button className="btn btn--primary"><Icon name="qr" size={14}/> Показать QR</button>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card">
          <div className="label">Посещений в этом месяце</div>
          <div className="stat-num mt-8">24</div>
          <div className="mono mt-8" style={{ fontSize: 12, color: "var(--good)" }}>+8 vs прошлый месяц</div>
        </div>
        <div className="card">
          <div className="label">Часов отыграно</div>
          <div className="stat-num mt-8">62<span style={{ fontSize: 24, color: "var(--text-3)" }}>ч</span></div>
          <div className="bar mt-16"><span style={{ width: "62%" }}/></div>
        </div>
        <div className="card">
          <div className="label">Сэкономлено</div>
          <div className="stat-num mt-8">48 200 <span style={{ fontSize: 24, color: "var(--text-3)" }}>₸</span></div>
          <div className="mono mt-8" style={{ fontSize: 12, color: "var(--text-2)" }}>vs оплата по факту</div>
        </div>
      </div>

      {/* Recent + Recommendations */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <div className="flex between middle mb-16">
            <h3 className="h-display" style={{ fontSize: 20 }}>Недавние посещения</h3>
            <button className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>Все →</button>
          </div>
          <div className="live-feed">
            {[
              { name: "Game Zone Cyber", city: "Алматы", when: "Сегодня · 19:24", dur: "2ч 14мин" },
              { name: "Strike Lanes",   city: "Алматы", when: "Вчера · 21:00",  dur: "1ч 30мин" },
              { name: "Ping Pong Pro",  city: "Алматы", when: "12 дек · 18:40", dur: "45мин"   },
              { name: "Time Cafe",      city: "Алматы", when: "10 дек · 16:00", dur: "3ч 02мин" },
            ].map((v, i) => (
              <div key={i} className="live-row">
                <span className="live-dot"/>
                <div>
                  <div style={{ fontWeight: 600 }}>{v.name}</div>
                  <div className="mono dim" style={{ fontSize: 11 }}>{v.city} · {v.dur}</div>
                </div>
                <span className="live-when">{v.when}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="h-display" style={{ fontSize: 20, marginBottom: 16 }}>Тебе понравится</h3>
          <div className="col gap-12">
            {PARTNERS.slice(6, 10).map((p, i) => {
              const cat = CATEGORIES.find(c => c.key === p.cat);
              return (
                <div key={i} className="flex gap-12 middle" style={{ padding: 8, borderRadius: "var(--radius-card)", cursor: "pointer", transition: "background .2s" }}
                     onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-chip)", background: "var(--surface-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon name={cat.icon} size={20} style={{ color: "var(--accent)" }}/>
                  </div>
                  <div className="fill">
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div className="mono dim" style={{ fontSize: 10 }}>{p.city} · {cat.label}</div>
                  </div>
                  <Icon name="arrowUR" size={14} style={{ color: "var(--text-3)" }}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function DashQR() {
  return (
    <div className="card center" style={{ padding: 48 }}>
      <Eyebrow>Доступ · LIVE</Eyebrow>
      <h2 className="h-display mt-16" style={{ fontSize: 32 }}>Покажи на ресепшене</h2>
      <p className="muted mt-8" style={{ marginBottom: 24 }}>QR обновляется каждые 60 секунд</p>
      <div style={{ width: 280, height: 280, margin: "0 auto", background: "var(--bg)", border: "1px solid var(--accent)", borderRadius: "var(--radius-card)", display: "grid", placeItems: "center", boxShadow: "var(--glow-accent)" }}>
        <Icon name="qr" size={200} stroke={1} style={{ color: "var(--accent)" }}/>
      </div>
      <div className="mono mt-24" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".14em" }}>ID: CHLLP-2046-ERMK · ПРЕМИУМ</div>
    </div>
  );
}

function DashHistory() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    name: PARTNERS[i % PARTNERS.length].name,
    city: PARTNERS[i % PARTNERS.length].city,
    date: `${15 - i} дек 2026`,
    dur: `${1 + (i % 4)}ч ${(i * 13) % 60}мин`,
  }));
  return (
    <>
      <Eyebrow>История</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>Последние посещения</h1>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid var(--line)" }}>
          <span className="label">Заведение</span><span className="label">Город</span><span className="label">Длительность</span><span className="label">Дата</span>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>{it.name}</span>
            <span className="muted">{it.city}</span>
            <span className="mono">{it.dur}</span>
            <span className="mono dim">{it.date}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function DashBilling() {
  return (
    <>
      <Eyebrow>Подписка</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>Управление подпиской</h1>
      <div className="card card--accent">
        <div className="flex between middle wrap gap-16">
          <div>
            <span className="chip chip--accent">АКТИВЕН</span>
            <h2 className="h-display mt-16" style={{ fontSize: 32 }}>Премиум · 1 990 ₸/мес</h2>
            <p className="muted mt-8">Следующее списание: 14 января 2027</p>
          </div>
          <div className="flex gap-8">
            <button className="btn btn--secondary">Сменить тариф</button>
            <button className="btn btn--ghost" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>Заморозить</button>
          </div>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <h3 className="h-display" style={{ fontSize: 18 }}>Метод оплаты</h3>
          <div className="flex gap-12 middle mt-16" style={{ padding: 16, border: "1px solid var(--line)", borderRadius: "var(--radius-card)" }}>
            <Icon name="creditCard" size={28} style={{ color: "var(--accent)" }}/>
            <div className="fill">
              <div style={{ fontWeight: 600 }}>•••• 4521</div>
              <div className="mono dim" style={{ fontSize: 11 }}>Visa · истекает 09/28</div>
            </div>
            <button className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>Изменить</button>
          </div>
        </div>
        <div className="card">
          <h3 className="h-display" style={{ fontSize: 18 }}>Последние платежи</h3>
          <div className="col gap-8 mt-16">
            {["14 дек 2026", "14 ноя 2026", "14 окт 2026"].map((d, i) => (
              <div key={i} className="flex between middle" style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                <span className="mono dim" style={{ fontSize: 12 }}>{d}</span>
                <span className="mono">1 990 ₸</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DashSettings() {
  return (
    <>
      <Eyebrow>Настройки</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>Профиль и уведомления</h1>
      <div className="card">
        <div className="col gap-16">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="field"><span className="label">Имя</span><input className="input" defaultValue="Ермек"/></div>
            <div className="field"><span className="label">Фамилия</span><input className="input" defaultValue="Касенов"/></div>
          </div>
          <div className="field"><span className="label">Email</span><input className="input" defaultValue="ermek@chillup.kz"/></div>
          <div className="field"><span className="label">Телефон</span><input className="input" defaultValue="+7 (777) 123-45-67"/></div>
          <div className="divider"/>
          {[
            "Push о новых заведениях рядом",
            "Email о платежах и продлении",
            "SMS о подтверждении посещения",
            "Telegram о турнирах и событиях",
          ].map((l, i) => (
            <div key={i} className="flex between middle" style={{ padding: "8px 0" }}>
              <span style={{ fontSize: 14 }}>{l}</span>
              <ToggleSwitch defaultOn={i % 2 === 0}/>
            </div>
          ))}
          <div className="flex gap-12 mt-16">
            <button className="btn btn--primary">Сохранить</button>
            <button className="btn btn--ghost">Отмена</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ToggleSwitch({ defaultOn = false }) {
  const [on, setOn] = useStateP(defaultOn);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 44, height: 24, borderRadius: 999,
      background: on ? "var(--accent)" : "var(--surface-2)",
      border: "1px solid var(--line)",
      position: "relative",
      transition: "background .2s",
    }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 22 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: on ? "#000" : "var(--text-2)",
        transition: "left .2s",
      }}/>
    </button>
  );
}

Object.assign(window, {
  HomePage, PricingPage, PartnersPage, FaqPage, LoginPage, RegisterPage, DashboardPage,
});
