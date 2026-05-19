/* eslint-disable */
// GERBER EVENTS — shared helpers (WP build).
// Data (disciplines, stills, etc.) comes from window.GERBER_DATA injected by PHP.

const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

function useMouse(ref) {
  const [m, setM] = useState({ x: 0, y: 0, rel: { x: 0.5, y: 0.5 }, active: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setM({ x, y, rel: { x: x / r.width, y: y / r.height }, active: true });
    };
    const leave = () => setM((p) => ({ ...p, active: false }));
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref]);
  return m;
}

function useInView(ref, { rootMargin = '-10% 0px', threshold = 0.12 } = {}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setSeen(true); io.disconnect(); return; }
        }
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, rootMargin, threshold]);
  return seen;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || window.pageYOffset || 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

function typoStack(name, role) {
  const display = '"Kanilia", "Kanilia Regular", "DM Serif Display", "Bodoni Moda", "Cormorant Garamond", Georgia, serif';
  const map = {
    serif: { body: '"Instrument Serif", "Cormorant Garamond", Georgia, serif' },
    sans:  { body: '"Geist", "Söhne", -apple-system, system-ui, sans-serif' },
    mono:  { body: '"JetBrains Mono", ui-monospace, monospace' },
  };
  const script = '"Allura", "Pinyon Script", cursive';
  const mono   = '"JetBrains Mono", ui-monospace, monospace';
  if (role === 'display') return display;
  if (role === 'script')  return script;
  if (role === 'mono')    return mono;
  return (map[name] || map.sans).body;
}

function densityTokens(d) {
  const v = d || 'airy';
  return v === 'tight'
    ? { pad: 'clamp(20px, 3.2vw, 40px)',  gap: '14px', heroPadY: 'clamp(28px, 4vh, 56px)',  sectionPadY: 'clamp(56px, 7vh, 84px)' }
    : { pad: 'clamp(28px, 4.5vw, 88px)', gap: '22px', heroPadY: 'clamp(36px, 5.5vh, 80px)', sectionPadY: 'clamp(80px, 9vh, 128px)' };
}

function animFactor(level) {
  if (level === 'off')    return 0;
  if (level === 'subtle') return 0.6;
  return 1;
}

function StarMark({ size = 18, color = 'currentColor', style }) {
  const half = size / 2;
  const path = `M ${half} 0
                C ${half} ${half * 0.6}, ${half * 1.4} ${half * 0.6}, ${size} ${half}
                C ${half * 1.4} ${half * 1.4}, ${half} ${half * 1.4}, ${half} ${size}
                C ${half} ${half * 1.4}, ${half * 0.6} ${half * 1.4}, 0 ${half}
                C ${half * 0.6} ${half * 0.6}, ${half} ${half * 0.6}, ${half} 0 Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style} aria-hidden>
      <path d={path} fill={color} />
    </svg>
  );
}

Object.assign(window, {
  useMouse, useInView, useScrollY,
  typoStack, densityTokens, animFactor,
  StarMark,
});
