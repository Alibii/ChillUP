// anim.jsx — animation toolkit: Reveal (scroll), Mascot (mouse-follow), Magnetic, Parallax, CountUp
// Exports to window. Depends on React (global) + Icon (from components.jsx).

const { useState: useStateAn, useEffect: useEffectAn, useRef: useRefAn, useCallback: useCbAn } = React;

/* ---------- global reduced-motion flag ---------- */
const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   REVEAL — scroll-triggered entrance via IntersectionObserver
   variant: up | fade | scale | left | right ; delay in ms
   ========================================================= */
function Reveal({ children, variant = "up", delay = 0, className = "", style, as = "div", once = true }) {
  const ref = useRefAn(null);
  const [shown, setShown] = useStateAn(REDUCED);
  useEffectAn(() => {
    if (REDUCED) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setShown(true); if (once) io.unobserve(e.target); }
        else if (!once) setShown(false);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* Stagger helper: wraps a list of children each in a Reveal with incremental delay */
function Stagger({ children, step = 80, variant = "up", className = "", style, base = 0 }) {
  const arr = React.Children.toArray(children);
  return (
    <div className={className} style={style}>
      {arr.map((c, i) => (
        <Reveal key={i} variant={variant} delay={base + i * step} style={{ display: "contents" }}>
          {c}
        </Reveal>
      ))}
    </div>
  );
}

/* =========================================================
   useMouse — normalized pointer position (-1..1 from center of viewport)
   ========================================================= */
function useGlobalMouse() {
  const [pos, setPos] = useStateAn({ x: 0, y: 0, px: 0, py: 0 });
  useEffectAn(() => {
    if (REDUCED) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setPos({ x: nx, y: ny, px: e.clientX, py: e.clientY });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return pos;
}

/* =========================================================
   MASCOT — a friendly joystick/robot that looks at the cursor.
   Eyes track pointer; antenna bobs; blinks periodically; reacts on hover.
   ========================================================= */
function Mascot({ size = 200 }) {
  const wrapRef = useRefAn(null);
  const [eye, setEye] = useStateAn({ x: 0, y: 0 });
  const [blink, setBlink] = useStateAn(false);
  const [wave, setWave] = useStateAn(false);

  // eyes follow cursor relative to mascot center
  useEffectAn(() => {
    if (REDUCED) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2.4;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const max = 5.5; // px of pupil travel
        setEye({ x: (dx / dist) * Math.min(max, dist / 12), y: (dy / dist) * Math.min(max, dist / 12) });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // random blink
  useEffectAn(() => {
    if (REDUCED) return;
    let t;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  const eyeH = blink ? 1.5 : 9;

  return (
    <div
      ref={wrapRef}
      className="mascot"
      style={{ width: size, height: size }}
      onMouseEnter={() => setWave(true)}
      onMouseLeave={() => setWave(false)}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: "visible" }}>
        {/* glow */}
        <ellipse cx="60" cy="108" rx="34" ry="6" fill="var(--accent)" opacity="0.18"/>
        {/* antenna */}
        <g className={"mascot-antenna" + (wave ? " is-active" : "")}>
          <line x1="60" y1="24" x2="60" y2="8" stroke="var(--line-strong)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="60" cy="6" r="5" fill="var(--accent-2)">
            <animate attributeName="r" values="5;6.5;5" dur="1.6s" repeatCount="indefinite"/>
          </circle>
        </g>
        {/* body (controller shell) */}
        <rect className="mascot-body" x="14" y="24" width="92" height="72" rx="26" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5"/>
        {/* face screen */}
        <rect x="26" y="36" width="68" height="40" rx="14" fill="var(--bg)" stroke="var(--line)" strokeWidth="1.5"/>
        {/* eyes */}
        <g>
          <ellipse cx={44 + eye.x} cy={56 + eye.y} rx="7" ry={eyeH/1.4} fill="var(--accent)"/>
          <ellipse cx={76 + eye.x} cy={56 + eye.y} rx="7" ry={eyeH/1.4} fill="var(--accent)"/>
        </g>
        {/* smile */}
        <path d={wave ? "M50 68 Q60 76 70 68" : "M52 68 Q60 72 68 68"} stroke="var(--accent-2)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* d-pad + buttons */}
        <g opacity="0.9">
          <rect x="24" y="84" width="14" height="4" rx="2" fill="var(--text-3)"/>
          <rect x="29" y="79" width="4" height="14" rx="2" fill="var(--text-3)"/>
          <circle cx="84" cy="86" r="3" fill="var(--accent)"/>
          <circle cx="93" cy="86" r="3" fill="var(--accent-2)"/>
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   MAGNETIC — child drifts toward cursor while hovered (buttons)
   ========================================================= */
function Magnetic({ children, strength = 0.35, className = "", style }) {
  const ref = useRefAn(null);
  useEffectAn(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    };
    const onLeave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [strength]);
  return <div ref={ref} className={"magnetic " + className} style={style}>{children}</div>;
}

/* =========================================================
   COUNTUP — animates a number when scrolled into view
   ========================================================= */
function CountUp({ to, duration = 1400, suffix = "", prefix = "", decimals = 0, className, style }) {
  const ref = useRefAn(null);
  const [val, setVal] = useStateAn(0);
  const started = useRefAn(false);
  useEffectAn(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const shown = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("ru-RU");
  return <span ref={ref} className={className} style={style}>{prefix}{shown}{suffix}</span>;
}

/* =========================================================
   TILT — 3D tilt on hover for cards
   ========================================================= */
function Tilt({ children, max = 8, className = "", style }) {
  const ref = useRefAn(null);
  useEffectAn(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    };
    const onLeave = () => { el.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [max]);
  return <div ref={ref} className={"tilt " + className} style={{ transition: "transform .18s ease", ...style }}>{children}</div>;
}

Object.assign(window, { Reveal, Stagger, useGlobalMouse, Mascot, Magnetic, CountUp, Tilt, REDUCED });
