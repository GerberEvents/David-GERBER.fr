/* eslint-disable */
// Shared helpers — GERBER EVENTS noir build.

const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

// Pointer position relative to a ref'd element.
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

// One-shot IntersectionObserver reveal.
function useInView(ref, { rootMargin = '-10% 0px', threshold = 0.12 } = {}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, rootMargin, threshold]);
  return seen;
}

// Page-level scroll progress for parallax / hero fade.
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

// Typography stacks for the rebrand.
//  - display: Kanilia is the GERBER EVENTS wordmark face. Falls back to
//    DM Serif Display / Bodoni Moda / Georgia until the font file is
//    self-hosted (see @font-face in styles.css).
//  - body: serif/sans/mono picks an editorial body
//  - script: Allura, always
function typoStack(name, role) {
  const display = '"Kanilia", "Kanilia Regular", "DM Serif Display", "Bodoni Moda", "Cormorant Garamond", Georgia, serif';
  const map = {
    serif: {
      body: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
      bodyAlt: '"Geist", system-ui, sans-serif',
    },
    sans: {
      body: '"Geist", "Söhne", -apple-system, system-ui, sans-serif',
      bodyAlt: '"Geist", system-ui, sans-serif',
    },
    mono: {
      body: '"JetBrains Mono", ui-monospace, monospace',
      bodyAlt: '"JetBrains Mono", ui-monospace, monospace',
    },
  };
  const script = '"Allura", "Pinyon Script", cursive';
  const mono = '"JetBrains Mono", ui-monospace, monospace';
  if (role === 'display') return display;
  if (role === 'script')  return script;
  if (role === 'mono')    return mono;
  return (map[name] || map.sans).body;
}

// Density tokens.
function densityTokens(d) {
  const v = d || 'airy';
  return v === 'tight'
    ? {
        pad:        'clamp(20px, 3.2vw, 40px)',
        gap:        '14px',
        heroPadY:   'clamp(28px, 4vh, 56px)',
        sectionPadY:'clamp(56px, 7vh, 84px)',
      }
    : {
        pad:        'clamp(28px, 4.5vw, 88px)',
        gap:        '22px',
        heroPadY:   'clamp(36px, 5.5vh, 80px)',
        sectionPadY:'clamp(80px, 9vh, 128px)',
      };
}

function animFactor(level) {
  if (level === 'off') return 0;
  if (level === 'subtle') return 0.6;
  return 1;
}

// Services — themed for events / multi-discipline atelier, each anchored
// to one of the noir stills we received.
const SERVICES = [
  {
    n: 'I',
    title: 'Conception · UX / UI Design',
    blurb: "Aménagement d'espaces, création 3D, design d'interface et expérience utilisateur — du pré-prod à la régie graphique en plateau.",
    tags: ['UX', 'UI', '3D', 'Espaces'],
    img: 'assets/portrait-sound-engineer.png',
    caption: 'Régie · session 2024',
  },
  {
    n: 'II',
    title: 'Développement Web · Identité Digitale',
    blurb: 'Création de sites web, branding, design visuel et solutions digitales sur mesure — pensé pour résister au plateau.',
    tags: ['Code', 'Brand', 'Visuel', 'Sur-mesure'],
    img: 'assets/portrait-trumpet.jpeg',
    caption: 'Direction artistique · 2023',
  },
  {
    n: 'III',
    title: 'Rénovation · Second Œuvre',
    blurb: 'Électricité, plomberie, finitions, béton ciré et coordination technique de chantier — la matière avant l\'image.',
    tags: ['Chantier', 'Finitions', 'Coordination'],
    img: 'assets/bg-alley-corner.png',
    caption: 'Chantier · loft Canut',
  },
  {
    n: 'IV',
    title: 'Événementiel · Régie générale',
    blurb: 'Son, lumière, scénographie et accompagnement global — depuis 1983, sur scène et en coulisses.',
    tags: ['Son', 'Lumière', 'Scéno.', 'Production'],
    img: 'assets/portrait-motorbike.png',
    caption: 'Tournée · printemps 2025',
  },
];

// Featured stills for the hero contact strip / film roll.
const STILLS = [
  { src: 'assets/portrait-revolver-lockup.jpg', label: 'Casting · Studio 4',     code: 'A-014' },
  { src: 'assets/portrait-motorbike.png',       label: 'Repérage · Hudson St.',   code: 'A-027' },
  { src: 'assets/portrait-trumpet.jpeg',        label: 'Session · Trompette',     code: 'B-008' },
  { src: 'assets/portrait-sound-engineer.png',  label: 'Régie son · Live',        code: 'B-019' },
  { src: 'assets/portrait-shadow.png',          label: 'Portrait · D. Gerber',    code: 'C-003' },
  { src: 'assets/bg-alley-corner.png',          label: 'Décor · brique brute',    code: 'D-002' },
];

const HEADLINE   = ['Concevoir, créer,', 'casser les codes.'];
const TAGLINE_FR = 'Atelier pluridisciplinaire — David Gerber dessine, code, construit et met en lumière.';
const TAGLINE_EN = 'backstage mindset.';

// 4-point sparkle star — the brand mark.
function StarMark({ size = 18, color = 'currentColor', style }) {
  const half = size / 2;
  // narrow pinch via cubic bezier to read as the "sparkle" mark, not a kite.
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
  SERVICES, STILLS, HEADLINE, TAGLINE_FR, TAGLINE_EN,
  StarMark,
});
