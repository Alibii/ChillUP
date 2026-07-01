// app.jsx — root app: routing, theme tweaks, mounts pages
// Depends on: components.jsx, pages.jsx, tweaks-panel.jsx (already loaded as window.*)

const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "arcade",
  "accentHue": "cyan",
  "density": "regular",
  "grid": true
}/*EDITMODE-END*/;

const ACCENT_HUES = {
  cyan:    { accent: "#00e5ff", accent2: "#ff2ec4", accent3: "#7c3aed" },
  green:   { accent: "#39ff14", accent2: "#ff2ec4", accent3: "#00d4ff" },
  orange:  { accent: "#ff6b35", accent2: "#ffd23f", accent3: "#06d6a0" },
  pink:    { accent: "#ff2ec4", accent2: "#00e5ff", accent3: "#7c3aed" },
};

function App() {
  const [route, go] = useRoute();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* scroll progress bar */
  const [prog, setProg] = useStateA(0);
  useEffectA(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProg(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [route]);

  /* Apply theme variant to <html data-theme=...> + accent override */
  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", t.theme || "arcade");
  }, [t.theme]);

  useEffectA(() => {
    const hue = ACCENT_HUES[t.accentHue] || ACCENT_HUES.cyan;
    const root = document.documentElement;
    if (t.accentHue && t.accentHue !== "default") {
      root.style.setProperty("--accent", hue.accent);
      root.style.setProperty("--accent-2", hue.accent2);
      root.style.setProperty("--accent-3", hue.accent3);
    } else {
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-2");
      root.style.removeProperty("--accent-3");
    }
  }, [t.accentHue]);

  let Page;
  switch (route) {
    case "/pricing":   Page = <PricingPage go={go}/>; break;
    case "/partners":  Page = <PartnersPage go={go}/>; break;
    case "/faq":       Page = <FaqPage go={go}/>; break;
    case "/login":     Page = <LoginPage go={go}/>; break;
    case "/register":  Page = <RegisterPage go={go}/>; break;
    case "/dashboard": Page = <DashboardPage go={go}/>; break;
    default:           Page = <HomePage go={go}/>;
  }

  return (
    <>
      <div className="scroll-progress" style={{ width: prog + "%" }}/>
      <div className="app-bg" style={{ opacity: t.grid ? 1 : 0 }}/>
      <Nav route={route} go={go}/>
      <main>{Page}</main>
      <Footer go={go}/>

      <TweaksPanel>
        <TweakSection label="Тема"/>
        <TweakRadio
          label="Направление"
          value={t.theme}
          options={[
            { value: "arcade", label: "Arcade" },
            { value: "glass",  label: "Glass" },
            { value: "pulse",  label: "Pulse" },
          ]}
          onChange={v => setTweak("theme", v)}
        />
        <TweakColor
          label="Акцент"
          value={ACCENT_HUES[t.accentHue]?.accent || "#00e5ff"}
          options={["#00e5ff", "#39ff14", "#ff6b35", "#ff2ec4"]}
          onChange={(v) => {
            const map = { "#00e5ff": "cyan", "#39ff14": "green", "#ff6b35": "orange", "#ff2ec4": "pink" };
            setTweak("accentHue", map[v] || "cyan");
          }}
        />
        <TweakToggle label="Сетка-фон" value={t.grid} onChange={v => setTweak("grid", v)}/>

        <TweakSection label="Навигация"/>
        <TweakButton label="→ Главная" onClick={() => go("/")}/>
        <TweakButton label="→ Тарифы" onClick={() => go("/pricing")}/>
        <TweakButton label="→ Партнёры" onClick={() => go("/partners")}/>
        <TweakButton label="→ FAQ" onClick={() => go("/faq")}/>
        <TweakButton label="→ Регистрация" onClick={() => go("/register")}/>
        <TweakButton label="→ Личный кабинет" onClick={() => go("/dashboard")}/>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<LocaleProvider><App/></LocaleProvider>);
