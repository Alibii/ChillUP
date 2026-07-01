// pages.jsx — All pages: Home, Pricing, Partners, FAQ, Login, Register, Dashboard
// Depends on: components.jsx (Brand, Nav, Footer, Icon, Eyebrow, SectionHead, CATEGORIES, PARTNERS)
//             i18n.js (useLocale, tierLabel, tagLabel, cityLabel)

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

/* ----- shared helpers ----- */
function getFaqData(t) {
  return [0, 1, 2, 3, 4, 5].map(i => ({ q: t(`faq.${i}.q`), a: t(`faq.${i}.a`) }));
}

function generateAccessToken() {
  const rnd = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHLLP-${rnd()}-${rnd()}`;
}

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
  const { t } = useLocale();
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <Reveal variant="up" delay={0}><Eyebrow>{t("hero.eyebrow")}</Eyebrow></Reveal>
            <Reveal variant="up" delay={80}>
              <h1 className="hero-headline">
                {t("hero.headline.line1")}<br/>
                <span className="accent">{t("hero.headline.line2")}</span>.<br/>
                {t("hero.headline.line3pre")}<span className="accent-2">{t("hero.headline.line3accent")}</span>.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={160}>
              <p className="hero-sub">{t("hero.sub")}</p>
            </Reveal>
            <Reveal variant="up" delay={240}>
              <div className="hero-cta">
                <Magnetic strength={0.25}>
                  <button className="btn btn--primary btn--lg" onClick={() => go("/register")}>
                    {t("hero.cta.trial")} <Icon name="arrow" size={16}/>
                  </button>
                </Magnetic>
                <button className="btn btn--ghost btn--lg" onClick={() => go("/pricing")}>
                  <Icon name="play" size={14}/> {t("hero.cta.pricing")}
                </button>
              </div>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <div className="flex gap-24 mt-48 wrap">
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={500} suffix="+"/></div>
                  <div className="stat-label">{t("hero.stat.partners")}</div>
                </div>
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={50} suffix="+"/></div>
                  <div className="stat-label">{t("hero.stat.cities")}</div>
                </div>
                <div>
                  <div className="stat-num" style={{ fontSize: 32 }}><CountUp to={50} suffix="K"/></div>
                  <div className="stat-label">{t("hero.stat.users")}</div>
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
  const { t } = useLocale();
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
          <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "var(--text-3)", textTransform: "uppercase" }}>{t("heroVisual.status")}</div>
          <div className="h-display" style={{ fontSize: 20, marginTop: 4 }}>
            <span style={{ color: "var(--accent)" }}>●</span> 234 {t("heroVisual.venuesOnline")}
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
  const { t } = useLocale();
  const items = [0, 1, 2, 3, 4, 5, 6].map(i => t(`ticker.${i}`));
  const doubled = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((it, i) => <span key={i} className="ticker-item">{it}</span>)}
      </div>
    </div>
  );
}

/* ----- CATEGORIES (bento grid) ----- */
function Categories({ go }) {
  const { t } = useLocale();
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
          kicker={t("categories.kicker")}
          title={t("categories.title")}
          sub={t("categories.sub")}
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
                  <h3 className="cat-tile-title">{t(`category.${key}.label`)}</h3>
                  <p className="cat-tile-desc">{t(`category.${key}.desc`)}</p>
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
  const { t } = useLocale();
  const steps = [
    { n: "01", key: "step1", icon: "download" },
    { n: "02", key: "step2", icon: "creditCard" },
    { n: "03", key: "step3", icon: "qr" },
  ];
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <SectionHead
          kicker={t("howItWorks.kicker")}
          title={t("howItWorks.title")}
        />
        <div className="step-row">
          {steps.map((s, si) => (
            <Reveal key={s.n} variant="up" delay={si * 100}>
            <div className="step">
              <div className="step-num">{s.n}</div>
              <Icon name={s.icon} size={32} stroke={1.4} style={{ color: "var(--accent)", marginBottom: 16 }}/>
              <h3 className="step-title">{t(`howItWorks.${s.key}.t`)}</h3>
              <p className="step-desc">{t(`howItWorks.${s.key}.d`)}</p>
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
  const { t } = useLocale();
  const [period, setPeriod] = useStateP("month");
  return (
    <section>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow>{t("pricingPreview.kicker")}</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", marginTop: 16 }}>
              {t("pricingPreview.title")}
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
  const { t } = useLocale();
  return (
    <div className="toggle">
      <button className={"toggle-opt" + (period === "month" ? " is-on" : "")} onClick={() => setPeriod("month")}>{t("billingToggle.month")}</button>
      <button className={"toggle-opt" + (period === "year" ? " is-on" : "")} onClick={() => setPeriod("year")}>
        {t("billingToggle.year")} <span className="mono" style={{ fontSize: 10, opacity: .8 }}>−20%</span>
      </button>
    </div>
  );
}

/* key/monthly/featured stay fixed; name/tagline/cta/badge/feature text are
   localized via t('plan.<key>....') — see i18n.js. `features` here is just
   the ok/not-ok flags in display order. */
const PLANS = [
  { key: "basic",   monthly: 990,  features: [true, true, true, false, false] },
  { key: "premium", monthly: 1990, featured: true, features: [true, true, true, true, true] },
  { key: "vip",     monthly: 3990, features: [true, true, true, true, true] },
];

function PlanGrid({ period, go }) {
  const { t } = useLocale();
  const yearMult = 12 * 0.8;
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {PLANS.map((p, pi) => {
        const price = period === "year" ? Math.round(p.monthly * yearMult) : p.monthly;
        return (
          <Reveal key={p.key} variant="up" delay={pi * 110}>
          <div className={"card plan-card card--hover" + (p.featured ? " is-featured" : "")}>
            {p.key === "premium" && <span className="plan-badge">{t("plan.premium.badge")}</span>}
            <h3 className="plan-name">{t(`plan.${p.key}.name`)}</h3>
            <p className="plan-tagline">{t(`plan.${p.key}.tagline`)}</p>
            <div className="plan-price">
              <span className="amount">{price.toLocaleString("ru-RU")}</span>
              <span className="currency">₸</span>
              <span className="period">/ {period === "year" ? t("billingToggle.year") : t("plan.perMonth").replace("/", "")}</span>
            </div>
            {period === "year" && <div className="mono" style={{ fontSize: 11, color: "var(--good)" }}>{t("plan.yearSavings", { amount: Math.round((p.monthly * 12) - price).toLocaleString("ru-RU") })}</div>}
            <ul className="plan-features">
              {p.features.map((ok, i) => (
                <li key={i} className={ok ? "" : "is-off"}>
                  <Icon name={ok ? "check" : "cross"} size={16} style={{ color: ok ? "var(--accent)" : "var(--text-3)" }}/>
                  {t(`plan.${p.key}.feature.${i}`)}
                </li>
              ))}
            </ul>
            <button className={"btn btn--block " + (p.featured ? "btn--primary" : "btn--secondary")} onClick={() => go("/register")}>
              {t(`plan.${p.key}.cta`)} <Icon name="arrow" size={14}/>
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
  const { t } = useLocale();
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow>{t("partnersPreview.kicker")}</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", marginTop: 16 }}>
              {t("partnersPreview.title")}
            </h2>
          </div>
          <button className="btn btn--ghost" onClick={() => go("/partners")}>
            {t("partnersPreview.viewAll")} <Icon name="arrowUR" size={14}/>
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
  const { t } = useLocale();
  const cat = CATEGORIES.find(c => c.key === p.cat);
  return (
    <Reveal variant="up" delay={(idx % 3) * 90}>
    <div className="card partner-card card--hover">
      <div className="partner-img">
        <Icon name={cat.icon} size={64} stroke={1.2} style={{ color: "var(--accent)", opacity: .9 }}/>
        <span className="partner-img-label">№ {String(idx + 1).padStart(3, "0")} · {t(`category.${cat.key}.label`)}</span>
      </div>
      <div className="partner-body">
        <div className="flex between middle">
          <h3 className="partner-name">{p.name}</h3>
          <span className={"chip " + (p.tier === "VIP" ? "chip--magenta" : p.tier === "Премиум" ? "chip--accent" : "")}>{tierLabel(p.tier, t)}</span>
        </div>
        <div className="partner-meta"><Icon name="pin" size={12}/> {cityLabel(p.city, t)} · {p.address}</div>
        <div className="flex gap-8 wrap">
          {p.tags.map(tag => <span key={tag} className="chip">{tagLabel(tag, t)}</span>)}
        </div>
      </div>
    </div>
    </Reveal>
  );
}

/* ----- STATS ----- */
function Stats() {
  const { t } = useLocale();
  const items = [
    { to: 500, suffix: "+", label: t("stats.partners") },
    { to: 50,  suffix: "+", label: t("stats.cities") },
    { to: 1.2, suffix: "M", decimals: 1, label: t("stats.hours") },
    { to: 98,  suffix: "%", label: t("stats.retention") },
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
  const { t } = useLocale();
  const items = [
    { q: t("testimonial.0.q"), name: "Ермек К.", role: t("testimonial.0.role"), initials: "ЕК" },
    { q: t("testimonial.1.q"), name: "Дина А.", role: t("testimonial.1.role"), initials: "ДА" },
    { q: t("testimonial.2.q"), name: "Армат С.", role: t("testimonial.2.role"), initials: "АС" },
  ];
  return (
    <section>
      <div className="container">
        <SectionHead kicker={t("testimonials.kicker")} title={t("testimonials.title")} />
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {items.map((t2, i) => (
            <Reveal key={i} variant="up" delay={i * 100}>
            <div className="card tcard">
              <div className="flex gap-8 mb-16">
                {[...Array(5)].map((_, j) => <Icon key={j} name="star" size={14} style={{ color: "var(--accent)", fill: "var(--accent)" }}/>)}
              </div>
              <q>{t2.q}</q>
              <div className="t-author">
                <div className="t-avatar">{t2.initials}</div>
                <div className="t-meta">
                  <span className="t-name">{t2.name}</span>
                  <span className="t-role">{t2.role}</span>
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
function FaqPreview({ go }) {
  const { t } = useLocale();
  const [open, setOpen] = useStateP(0);
  const faqData = getFaqData(t);
  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
          <div>
            <Eyebrow>{t("faqPreview.kicker")}</Eyebrow>
            <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 16, marginBottom: 16 }}>
              {t("faqPreview.title")}
            </h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 24 }}>
              {t("faqPreview.sub")}
            </p>
            <button className="btn btn--ghost" onClick={() => go("/faq")}>{t("faqPreview.viewAll")} <Icon name="arrow" size={14}/></button>
          </div>
          <div>
            {faqData.slice(0, 5).map((it, i) => (
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
  const { t } = useLocale();
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
              <Eyebrow>{t("downloadCTA.eyebrow")}</Eyebrow>
              <h2 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "16px 0" }}>
                {t("downloadCTA.title")}
              </h2>
              <p className="muted" style={{ fontSize: 16, marginBottom: 24, maxWidth: 480, lineHeight: 1.5 }}>
                {t("downloadCTA.sub")}
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
  const { t } = useLocale();
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
        <div className="h-display" style={{ fontSize: 14 }}>{t("phoneMock.planActive")}</div>
        <div className="mono dim" style={{ fontSize: 9 }}>{t("phoneMock.until")}</div>
        <div className="bar"><span style={{ width: "62%" }}/></div>
      </div>
    </div>
  );
}

/* =========================================================
   PRICING PAGE
   ========================================================= */
function PricingPage({ go }) {
  const { t } = useLocale();
  const [period, setPeriod] = useStateP("month");
  return (
    <>
      <section className="hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="container center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <Eyebrow>{t("pricingPage.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            {t("pricingPage.title.pre")}<span style={{ color: "var(--accent)" }}>{t("pricingPage.title.accent")}</span>{t("pricingPage.title.post")}
          </h1>
          <p className="muted" style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.5 }}>
            {t("pricingPage.sub")}
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
  const { t } = useLocale();
  const rowValues = [
    [true, true, true],
    [false, true, true],
    [false, true, true],
    [false, false, true],
    [false, true, true],
    [false, false, true],
    [false, false, true],
    [false, false, true],
  ];
  const rows = rowValues.map((values, i) => ({ f: t(`comparisonTable.row.${i}`), values }));
  return (
    <section>
      <div className="container">
        <SectionHead kicker={t("comparisonTable.kicker")} title={t("comparisonTable.title")}/>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "20px 28px", borderBottom: "1px solid var(--line)" }}>
            <span className="label">{t("comparisonTable.header.features")}</span>
            <span className="label center">{t("plan.basic.name")}</span>
            <span className="label center" style={{ color: "var(--accent)" }}>{t("plan.premium.name")}</span>
            <span className="label center">{t("plan.vip.name")}</span>
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
  const { t } = useLocale();
  const [open, setOpen] = useStateP(0);
  const items = [0, 1, 2].map(i => ({ q: t(`pricingFaq.${i}.q`), a: t(`pricingFaq.${i}.a`) }));
  return (
    <section>
      <div className="container" style={{ maxWidth: 800 }}>
        <SectionHead kicker={t("pricingFaq.kicker")} title={t("pricingFaq.title")} align="left"/>
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
  const { t } = useLocale();
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
          <Eyebrow>{t("partnersPage.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            {t("partnersPage.title.pre")}<span style={{ color: "var(--accent)" }}>{t("partnersPage.title.accent")}</span>{t("partnersPage.title.post")}
          </h1>
          <p className="muted" style={{ fontSize: 18, maxWidth: 640, lineHeight: 1.5 }}>
            {t("partnersPage.sub")}
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
                <input className="input" placeholder={t("partnersPage.searchPlaceholder")} value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 40 }}/>
              </div>
              <select className="input" value={city} onChange={e => setCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c === "all" ? t("partnersPage.allCities") : cityLabel(c, t)}</option>)}
              </select>
              <select className="input" value={cat} onChange={e => setCat(e.target.value)}>
                <option value="all">{t("partnersPage.allCategories")}</option>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{t(`category.${c.key}.label`)}</option>)}
              </select>
              <select className="input" value={tier} onChange={e => setTier(e.target.value)}>
                <option value="all">{t("partnersPage.allTiers")}</option>
                <option value="Базовый">{t("tier.basic")}</option>
                <option value="Премиум">{t("tier.premium")}</option>
                <option value="VIP">{t("tier.vip")}</option>
              </select>
            </div>
            <div className="flex gap-8 mt-16 wrap" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="flex gap-8 wrap">
                {[["all", t("partnersPage.all")], ...CATEGORIES.map(c => [c.key, t(`category.${c.key}.label`)])].map(([k, l]) => (
                  <button key={k} className={"chip " + (cat === k ? "chip--accent" : "")} onClick={() => setCat(k)}>{l}</button>
                ))}
              </div>
              <span className="mono dim" style={{ fontSize: 12 }}>{t("partnersPage.foundTemplate", { n: filtered.length })}</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filtered.map((p, i) => <PartnerCard key={i} p={p} idx={i}/>)}
          </div>
          {filtered.length === 0 && (
            <div className="card center" style={{ padding: 48 }}>
              <h3 className="h-display" style={{ fontSize: 24, marginBottom: 8 }}>{t("partnersPage.emptyTitle")}</h3>
              <p className="muted">{t("partnersPage.emptyDesc")}</p>
              <button className="btn btn--secondary mt-16" onClick={() => { setQ(""); setCity("all"); setCat("all"); setTier("all"); }}>{t("partnersPage.reset")}</button>
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
  const { t } = useLocale();
  const [open, setOpen] = useStateP(0);
  const faqData = getFaqData(t);
  return (
    <>
      <section className="hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="container center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Eyebrow>{t("faqPage.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
            {t("faqPage.title.pre")}<span style={{ color: "var(--accent)" }}>{t("faqPage.title.accent")}</span>{t("faqPage.title.post")}
          </h1>
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {faqData.map((it, i) => (
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
            <h3 className="h-display" style={{ fontSize: 24 }}>{t("faqPage.notFound.title")}</h3>
            <p className="muted mt-8" style={{ marginBottom: 16 }}>{t("faqPage.notFound.sub")}</p>
            <div className="flex gap-8" style={{ justifyContent: "center" }}>
              <button className="btn btn--primary">{t("faqPage.openChat")}</button>
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
  const { t } = useLocale();
  return (
    <section className="hero">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", minHeight: "70vh" }}>
        <div>
          <Eyebrow>{t("loginPage.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", marginTop: 16, marginBottom: 16 }}>
            {t("loginPage.title.line1")}<br/><span style={{ color: "var(--accent)" }}>{t("loginPage.title.accent")}</span>
          </h1>
          <p className="muted" style={{ fontSize: 16, maxWidth: 440, lineHeight: 1.5 }}>
            {t("loginPage.sub")}
          </p>
          <div className="mt-32 flex gap-12">
            <div>
              <div className="stat-num" style={{ fontSize: 24 }}>500+</div>
              <div className="stat-label mt-8">{t("loginPage.stat.partners")}</div>
            </div>
            <div style={{ width: 1, background: "var(--line)" }}/>
            <div>
              <div className="stat-num" style={{ fontSize: 24 }}>50K</div>
              <div className="stat-label mt-8">{t("loginPage.stat.users")}</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 40 }}>
          <h2 className="h-display" style={{ fontSize: 28, marginBottom: 24 }}>{t("loginPage.formTitle")}</h2>
          <div className="col gap-16">
            <div className="field">
              <span className="label">{t("loginPage.field.login")}</span>
              <input className="input" placeholder="you@chillup.kz" defaultValue="ermek@chillup.kz"/>
            </div>
            <div className="field">
              <span className="label">{t("loginPage.field.password")}</span>
              <input className="input" type="password" placeholder="••••••••" defaultValue="••••••••"/>
            </div>
            <div className="flex between middle">
              <label className="flex gap-8 middle" style={{ fontSize: 13, color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked/> {t("loginPage.remember")}
              </label>
              <a className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>{t("loginPage.forgot")}</a>
            </div>
            <button className="btn btn--primary btn--block btn--lg" onClick={() => go("/dashboard")}>
              {t("loginPage.submit")} <Icon name="arrow" size={14}/>
            </button>
            <div className="center mono dim" style={{ fontSize: 11, marginTop: 8 }}>{t("loginPage.or")}</div>
            <button className="btn btn--secondary btn--block">{t("loginPage.telegram")}</button>
            <div className="center muted mt-16" style={{ fontSize: 13 }}>
              {t("loginPage.noAccount")} <a onClick={() => go("/register")} style={{ color: "var(--accent)", cursor: "pointer" }}>{t("loginPage.registerLink")}</a>
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
  const { t } = useLocale();
  const [step, setStep] = useStateP(0);
  const [plan, setPlan] = useStateP("premium");

  return (
    <section className="hero">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="center mb-32">
          <Eyebrow>{t("registerPage.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: "clamp(40px, 6vw, 64px)", marginTop: 16 }}>
            {t("registerPage.titleBefore")}<span style={{ color: "var(--accent)" }}>ChillUP</span>{t("registerPage.titleAfter")}
          </h1>
        </div>

        {/* Stepper */}
        <div className="flex gap-12 mb-32" style={{ justifyContent: "center" }}>
          {[t("registerPage.stepper.account"), t("registerPage.stepper.plan"), t("registerPage.stepper.done")].map((s, i) => (
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
              <h2 className="h-display" style={{ fontSize: 24, margin: 0 }}>{t("registerPage.step0.title")}</h2>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="field"><span className="label">{t("registerPage.field.firstName")}</span><input className="input" defaultValue="Ермек"/></div>
                <div className="field"><span className="label">{t("registerPage.field.lastName")}</span><input className="input" defaultValue="Касенов"/></div>
              </div>
              <div className="field"><span className="label">{t("registerPage.field.email")}</span><input className="input" type="email" defaultValue="ermek@chillup.kz"/></div>
              <div className="field"><span className="label">{t("registerPage.field.phone")}</span><input className="input" defaultValue="+7 (777) 123-45-67"/></div>
              <div className="field"><span className="label">{t("registerPage.field.password")}</span><input className="input" type="password" defaultValue="••••••••"/></div>
              <div className="flex gap-12">
                <button className="btn btn--secondary fill" onClick={() => go("/")}>{t("registerPage.cancel")}</button>
                <button className="btn btn--primary fill" onClick={() => setStep(1)}>{t("registerPage.next")} <Icon name="arrow" size={14}/></button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="col gap-16">
              <h2 className="h-display" style={{ fontSize: 24, margin: 0 }}>{t("registerPage.step1.title")}</h2>
              {PLANS.map(p => (
                <div key={p.key} className={"card card--hover " + (plan === p.key ? "card--accent" : "")} style={{ padding: 20, cursor: "pointer" }} onClick={() => setPlan(p.key)}>
                  <div className="flex between middle">
                    <div>
                      <h3 className="plan-name" style={{ margin: 0 }}>{t(`plan.${p.key}.name`)}</h3>
                      <span className="plan-tagline" style={{ display: "block", marginTop: 4 }}>{t(`plan.${p.key}.tagline`)}</span>
                    </div>
                    <div className="flex middle gap-12">
                      <div style={{ textAlign: "right" }}>
                        <div className="h-display" style={{ fontSize: 24 }}>{p.monthly.toLocaleString("ru-RU")} ₸</div>
                        <div className="mono dim" style={{ fontSize: 11 }}>{t("registerPage.perMonth")}</div>
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
                <button className="btn btn--secondary fill" onClick={() => setStep(0)}>{t("registerPage.back")}</button>
                <button className="btn btn--primary fill" onClick={() => setStep(2)}>{t("registerPage.activateTrial")} <Icon name="bolt" size={14}/></button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "var(--glow-accent)" }}>
                <Icon name="check" size={40} stroke={2.5} style={{ color: "#000" }}/>
              </div>
              <h2 className="h-display" style={{ fontSize: 36, margin: 0 }}>{t("registerPage.step2.title")}</h2>
              <p className="muted" style={{ maxWidth: 420, lineHeight: 1.5 }}>
                {t("registerPage.step2.descPre")}<b style={{ color: "var(--accent)" }}>{t(`plan.${plan}.name`)}</b>{t("registerPage.step2.descPost")}
              </p>
              <div className="flex gap-12 mt-16">
                <button className="btn btn--primary btn--lg" onClick={() => go("/dashboard")}>{t("registerPage.openDashboard")} <Icon name="arrow" size={14}/></button>
                <button className="btn btn--secondary" onClick={() => go("/")}>{t("registerPage.toHome")}</button>
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
  const { t } = useLocale();
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
              <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 2 }}>{t("dashboard.planActive")}</div>
            </div>
            {[
              { k: "overview", l: t("dashboard.nav.overview"), i: "home" },
              { k: "qr",       l: t("dashboard.nav.qr"), i: "qr" },
              { k: "history",  l: t("dashboard.nav.history"), i: "clock" },
              { k: "billing",  l: t("dashboard.nav.billing"), i: "creditCard" },
              { k: "settings", l: t("dashboard.nav.settings"), i: "settings" },
            ].map(it => (
              <button key={it.k} className={tab === it.k ? "is-active" : ""} onClick={() => setTab(it.k)}>
                <Icon name={it.i} size={16}/> {it.l}
              </button>
            ))}
            <div style={{ flex: 1 }}/>
            <button onClick={() => go("/")} style={{ color: "var(--text-3)" }}>
              <Icon name="login" size={16}/> {t("dashboard.logout")}
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
  const { t } = useLocale();
  return (
    <>
      <div className="flex between middle wrap gap-12">
        <div>
          <Eyebrow>{t("dashOverview.eyebrow")}</Eyebrow>
          <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>{t("dashOverview.greeting", { name: "Ермек" })}</h1>
        </div>
        <button className="btn btn--primary"><Icon name="qr" size={14}/> {t("dashOverview.showQr")}</button>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card">
          <div className="label">{t("dashOverview.stat.visits")}</div>
          <div className="stat-num mt-8">24</div>
          <div className="mono mt-8" style={{ fontSize: 12, color: "var(--good)" }}>{t("dashOverview.visitsDeltaTemplate", { n: 8 })}</div>
        </div>
        <div className="card">
          <div className="label">{t("dashOverview.stat.hours")}</div>
          <div className="stat-num mt-8">62<span style={{ fontSize: 24, color: "var(--text-3)" }}>{t("unit.hour")}</span></div>
          <div className="bar mt-16"><span style={{ width: "62%" }}/></div>
        </div>
        <div className="card">
          <div className="label">{t("dashOverview.stat.saved")}</div>
          <div className="stat-num mt-8">48 200 <span style={{ fontSize: 24, color: "var(--text-3)" }}>₸</span></div>
          <div className="mono mt-8" style={{ fontSize: 12, color: "var(--text-2)" }}>{t("dashOverview.stat.savedVs")}</div>
        </div>
      </div>

      {/* Recent + Recommendations */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <div className="flex between middle mb-16">
            <h3 className="h-display" style={{ fontSize: 20 }}>{t("dashOverview.recent.title")}</h3>
            <button className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>{t("dashOverview.recent.viewAll")}</button>
          </div>
          <div className="live-feed">
            {[
              { name: "Game Zone Cyber", city: "Алматы", when: `${t("dashOverview.today")} · 19:24`, dur: `2${t("unit.hour")} 14${t("unit.min")}` },
              { name: "Strike Lanes",   city: "Алматы", when: `${t("dashOverview.yesterday")} · 21:00`,  dur: `1${t("unit.hour")} 30${t("unit.min")}` },
              { name: "Ping Pong Pro",  city: "Алматы", when: `12 ${t("dashOverview.dec")} · 18:40`, dur: `45${t("unit.min")}`   },
              { name: "Time Cafe",      city: "Алматы", when: `10 ${t("dashOverview.dec")} · 16:00`, dur: `3${t("unit.hour")} 02${t("unit.min")}` },
            ].map((v, i) => (
              <div key={i} className="live-row">
                <span className="live-dot"/>
                <div>
                  <div style={{ fontWeight: 600 }}>{v.name}</div>
                  <div className="mono dim" style={{ fontSize: 11 }}>{cityLabel(v.city, t)} · {v.dur}</div>
                </div>
                <span className="live-when">{v.when}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="h-display" style={{ fontSize: 20, marginBottom: 16 }}>{t("dashOverview.recommended.title")}</h3>
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
                    <div className="mono dim" style={{ fontSize: 10 }}>{cityLabel(p.city, t)} · {t(`category.${cat.key}.label`)}</div>
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

/* Real, scannable QR code (client-side, via qrcode-generator loaded in
   ChillUP.html) encoding a demo access token — the frontend isn't wired to
   the backend's signed token endpoint (visits/tokens.py) yet, so this token
   is a locally generated stand-in refreshed every 60s, not the real
   backend-issued one. */
function DashQR() {
  const { t } = useLocale();
  const [token, setToken] = useStateP(() => generateAccessToken());
  const [svg, setSvg] = useStateP("");

  useEffectP(() => {
    const id = setInterval(() => setToken(generateAccessToken()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffectP(() => {
    if (!window.qrcode) return;
    const qr = window.qrcode(0, "M");
    qr.addData(token);
    qr.make();
    setSvg(qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
  }, [token]);

  return (
    <div className="card center" style={{ padding: 48 }}>
      <Eyebrow>{t("dashQr.eyebrow")}</Eyebrow>
      <h2 className="h-display mt-16" style={{ fontSize: 32 }}>{t("dashQr.title")}</h2>
      <p className="muted mt-8" style={{ marginBottom: 24 }}>{t("dashQr.sub")}</p>
      <div style={{ width: 280, height: 280, margin: "0 auto", background: "#fff", border: "1px solid var(--accent)", borderRadius: "var(--radius-card)", display: "grid", placeItems: "center", boxShadow: "var(--glow-accent)", padding: 20, boxSizing: "border-box" }}>
        {svg
          ? <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }}/>
          : <Icon name="qr" size={200} stroke={1} style={{ color: "var(--accent)" }}/>}
      </div>
      <div className="mono mt-24" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".14em" }}>ID: {token} · {t("tier.premium").toUpperCase()}</div>
    </div>
  );
}

function DashHistory() {
  const { t } = useLocale();
  const items = Array.from({ length: 12 }, (_, i) => ({
    name: PARTNERS[i % PARTNERS.length].name,
    city: PARTNERS[i % PARTNERS.length].city,
    date: `${15 - i} ${t("dashHistory.dec")} 2026`,
    dur: `${1 + (i % 4)}${t("unit.hour")} ${(i * 13) % 60}${t("unit.min")}`,
  }));
  return (
    <>
      <Eyebrow>{t("dashHistory.eyebrow")}</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>{t("dashHistory.title")}</h1>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid var(--line)" }}>
          <span className="label">{t("dashHistory.col.venue")}</span><span className="label">{t("dashHistory.col.city")}</span><span className="label">{t("dashHistory.col.duration")}</span><span className="label">{t("dashHistory.col.date")}</span>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>{it.name}</span>
            <span className="muted">{cityLabel(it.city, t)}</span>
            <span className="mono">{it.dur}</span>
            <span className="mono dim">{it.date}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function DashBilling() {
  const { t } = useLocale();
  return (
    <>
      <Eyebrow>{t("dashBilling.eyebrow")}</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>{t("dashBilling.title")}</h1>
      <div className="card card--accent">
        <div className="flex between middle wrap gap-16">
          <div>
            <span className="chip chip--accent">{t("dashBilling.active")}</span>
            <h2 className="h-display mt-16" style={{ fontSize: 32 }}>{t("dashBilling.planLineTemplate", { plan: t("plan.premium.name"), price: "1 990" })}</h2>
            <p className="muted mt-8">{t("dashBilling.nextChargeTemplate", { date: t("dashBilling.nextChargeDate") })}</p>
          </div>
          <div className="flex gap-8">
            <button className="btn btn--secondary">{t("dashBilling.changePlan")}</button>
            <button className="btn btn--ghost" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>{t("dashBilling.freeze")}</button>
          </div>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <h3 className="h-display" style={{ fontSize: 18 }}>{t("dashBilling.paymentMethod")}</h3>
          <div className="flex gap-12 middle mt-16" style={{ padding: 16, border: "1px solid var(--line)", borderRadius: "var(--radius-card)" }}>
            <Icon name="creditCard" size={28} style={{ color: "var(--accent)" }}/>
            <div className="fill">
              <div style={{ fontWeight: 600 }}>•••• 4521</div>
              <div className="mono dim" style={{ fontSize: 11 }}>{t("dashBilling.cardExpiry")}</div>
            </div>
            <button className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>{t("dashBilling.change")}</button>
          </div>
        </div>
        <div className="card">
          <h3 className="h-display" style={{ fontSize: 18 }}>{t("dashBilling.recentPayments")}</h3>
          <div className="col gap-8 mt-16">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex between middle" style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                <span className="mono dim" style={{ fontSize: 12 }}>{t(`dashBilling.paymentDate.${i}`)}</span>
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
  const { t } = useLocale();
  return (
    <>
      <Eyebrow>{t("dashSettings.eyebrow")}</Eyebrow>
      <h1 className="h-display" style={{ fontSize: 40, marginTop: 12 }}>{t("dashSettings.title")}</h1>
      <div className="card">
        <div className="col gap-16">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="field"><span className="label">{t("registerPage.field.firstName")}</span><input className="input" defaultValue="Ермек"/></div>
            <div className="field"><span className="label">{t("registerPage.field.lastName")}</span><input className="input" defaultValue="Касенов"/></div>
          </div>
          <div className="field"><span className="label">{t("registerPage.field.email")}</span><input className="input" defaultValue="ermek@chillup.kz"/></div>
          <div className="field"><span className="label">{t("registerPage.field.phone")}</span><input className="input" defaultValue="+7 (777) 123-45-67"/></div>
          <div className="divider"/>
          {[
            t("dashSettings.notif.push"),
            t("dashSettings.notif.email"),
            t("dashSettings.notif.sms"),
            t("dashSettings.notif.telegram"),
          ].map((l, i) => (
            <div key={i} className="flex between middle" style={{ padding: "8px 0" }}>
              <span style={{ fontSize: 14 }}>{l}</span>
              <ToggleSwitch defaultOn={i % 2 === 0}/>
            </div>
          ))}
          <div className="flex gap-12 mt-16">
            <button className="btn btn--primary">{t("dashSettings.save")}</button>
            <button className="btn btn--ghost">{t("dashSettings.cancel")}</button>
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
