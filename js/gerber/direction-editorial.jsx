/* eslint-disable */
// GERBER EVENTS — noir build of the hero + services.
// Pure monochrome, cinematic. Wordmark lockup on the alley scene, cursor
// spotlight that lifts the dim photo to full brightness, script flourishes
// in Allura, and a contact-sheet film strip beneath.

// -------------------------------------------------------------------
// Tokens
// -------------------------------------------------------------------
const N_TOKENS = {
  dark: {
    bg: '#0a0a0a',
    bgSoft: '#141414',
    bgDeep: '#050505',
    paper: '#f4f1ec',
    fg: '#f4f1ec',
    fgMute: 'rgba(244,241,236,0.70)',
    fgFaint: 'rgba(244,241,236,0.40)',
    rule: 'rgba(244,241,236,0.16)',
    ruleStrong: 'rgba(244,241,236,0.32)',
    accent: '#f4f1ec',
    rowHover: 'rgba(244,241,236,0.04)'
  },
  light: {
    bg: '#ebe5dc', // tearsheet paper
    bgSoft: '#dfd9cf',
    bgDeep: '#d6d0c5',
    paper: '#0a0a0a',
    fg: '#0a0a0a',
    fgMute: 'rgba(10,10,10,0.62)',
    fgFaint: 'rgba(10,10,10,0.38)',
    rule: 'rgba(10,10,10,0.20)',
    ruleStrong: 'rgba(10,10,10,0.36)',
    accent: '#0a0a0a',
    rowHover: 'rgba(10,10,10,0.04)'
  }
};

// -------------------------------------------------------------------
// Root
// -------------------------------------------------------------------
function DirectionEditorial({ tweaks }) {
  const t = tweaks || {};
  const mode = t.dark === false ? 'light' : 'dark';
  const C = N_TOKENS[mode];
  const dt = densityTokens(t.density);
  const af = animFactor(t.motion);

  const display = typoStack(t.typo || 'sans', 'display');
  const body = typoStack(t.typo || 'sans', 'body');
  const script = typoStack(t.typo || 'sans', 'script');
  const mono = typoStack(t.typo || 'sans', 'mono');

  const layout = t.layout || 'stack'; // stack | offset

  return (
    <div
      className="ge-root"
      data-mode={mode}
      style={{
        background: C.bg,
        color: C.fg,
        fontFamily: body,
        fontSize: 15,
        lineHeight: 1.5
      }}>
      
      <Hero C={C} dt={dt} af={af} layout={layout} display={display} body={body} script={script} mono={mono} />
      <FilmRoll C={C} dt={dt} af={af} mono={mono} script={script} />
      <Manifesto C={C} dt={dt} af={af} display={display} script={script} mono={mono} />
      <KeywordMarquee C={C} mono={mono} af={af} />
      <Disciplines C={C} dt={dt} af={af} display={display} body={body} script={script} mono={mono} />
      <ContactStrip C={C} dt={dt} mono={mono} script={script} display={display} />

      <style>{`
        @keyframes a-blink { 0%,80% { opacity: 1 } 90%,100% { opacity: 0 } }
        @keyframes ge-grain { 0% { transform: translate(0,0) } 100% { transform: translate(-12%, 8%) } }
        .grain::before {
          content:''; position:absolute; inset:-30%;
          background-image: radial-gradient(rgba(255,255,255,.06) 0.5px, transparent 0.5px);
          background-size: 3px 3px;
          mix-blend-mode: overlay;
          opacity: .35;
          pointer-events: none;
          animation: ge-grain 8s steps(8) infinite alternate;
        }
        .ge-root[data-mode="light"] .grain::before {
          background-image: radial-gradient(rgba(0,0,0,.08) 0.5px, transparent 0.5px);
          mix-blend-mode: multiply;
        }
      `}</style>
    </div>);

}

// -------------------------------------------------------------------
// HERO — alley scene, wordmark lockup, cursor spotlight
// -------------------------------------------------------------------
function Hero({ C, dt, af, layout, display, body, script, mono }) {
  const heroRef = useRef(null);
  const mouse = useMouse(heroRef);
  const scrollY = useScrollY();

  // Parallax bg shift on scroll (small)
  const parallax = Math.min(60, scrollY * 0.15);
  const fade = Math.max(0, 1 - scrollY / 600);

  return (
    <section
      ref={heroRef}
      data-screen-label="Hero · Wordmark"
      className="grain"
      style={{
        position: 'relative',
        minHeight: 'max(760px, 100vh)',
        overflow: 'hidden',
        background: C.bgDeep,
        color: C.fg,
        cursor: 'none',
        isolation: 'isolate'
      }}>
      
      {/* BG photo — dim base */}
      <HeroBackdrop
        C={C} mouse={mouse} af={af} parallax={parallax} />
      

      {/* Top nav */}
      <NavBar C={C} mono={mono} script={script} display={display} fade={fade} />

      {/* Center stage — wordmark lockup left, editorial copy right */}
      <HeroStage
        C={C} dt={dt} af={af} layout={layout}
        display={display} body={body} script={script} mono={mono}
        mouse={mouse} scrollY={scrollY} />
      

      {/* Bottom strip */}
      <HeroBaseline C={C} mono={mono} mouse={mouse} dt={dt} />

      {/* Cursor */}
      <CursorDot C={C} mouse={mouse} af={af} mono={mono} />
    </section>);

}

function HeroBackdrop({ C, mouse, af, parallax }) {
  const x = mouse.active ? mouse.rel.x * 100 : 50;
  const y = mouse.active ? mouse.rel.y * 100 : 50;
  const radius = 320;
  const mask = `radial-gradient(circle ${radius}px at ${x}% ${y}%, #000 0, #000 50%, rgba(0,0,0,.55) 78%, transparent 100%)`;
  const reveal = mouse.active && af > 0 ? 1 : 0;
  const isLight = C.bg !== '#0a0a0a';

  // Two layers — dimmed base + bright "lit" copy revealed by the radial mask.
  const layerStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(assets/bg-alley-lamps.png)',
    backgroundSize: 'cover',
    backgroundPosition: `center calc(50% + ${parallax}px)`,
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* dim base */}
      <div style={{
        ...layerStyle,
        filter: isLight ? 'grayscale(1) brightness(1.05) contrast(.85) invert(1)' : 'grayscale(1) brightness(.45) contrast(1.15)',
        animation: af > 0 ? 'ge-fade 1.2s both' : 'none'
      }} />
      {/* lit copy */}
      <div style={{
        ...layerStyle,
        filter: isLight ? 'grayscale(1) brightness(.6) contrast(1.1) invert(1)' : 'grayscale(1) brightness(.95) contrast(1.05)',
        opacity: reveal,
        maskImage: mask,
        WebkitMaskImage: mask,
        transition: 'opacity .35s var(--ge-ease)'
      }} />
      {/* vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, ${C.bgDeep}cc 95%),
          linear-gradient(180deg, ${C.bgDeep}aa 0%, transparent 30%, transparent 70%, ${C.bgDeep}ee 100%)
        `
      }} />
    </div>);

}

function CursorDot({ C, mouse, af, mono }) {
  if (!mouse.active || af === 0) return null;
  const x = mouse.rel.x * 100;
  const y = mouse.rel.y * 100;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        width: 1, height: 1,
        pointerEvents: 'none',
        zIndex: 30
      }}>
      
      {/* outer ring */}
      <div style={{
        position: 'absolute', left: -22, top: -22, width: 44, height: 44,
        borderRadius: '50%', border: `1px solid ${C.fg}`, opacity: .6
      }} />
      {/* crosshair */}
      <div style={{ position: 'absolute', left: -9, top: 0, width: 18, height: 1, background: C.fg, opacity: .9 }} />
      <div style={{ position: 'absolute', left: 0, top: -9, width: 1, height: 18, background: C.fg, opacity: .9 }} />
      {/* label */}
      <div style={{
        position: 'absolute', left: 30, top: 26,
        fontFamily: mono, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase',
        color: C.fg, whiteSpace: 'nowrap', opacity: .9
      }} className="ge-num">
        {String(Math.round(x)).padStart(2, '0')}·{String(Math.round(y)).padStart(2, '0')}
      </div>
    </div>);

}

function NavBar({ C, mono, script, display, fade }) {
  return (
    <header
      style={{
        position: 'relative', zIndex: 8,
        display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center', gap: 28,
        padding: '22px clamp(20px, 4vw, 56px)',
        opacity: fade,
        transition: 'opacity .2s'
      }}>
      
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: C.fg, minWidth: 0 }}>
        <GEMark size={32} fg={C.fg} bg={C.bgDeep} />
        <span style={{
          display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 4, whiteSpace: 'nowrap'
        }}>
          <span style={{ fontFamily: display, fontSize: 18, letterSpacing: '.01em', lineHeight: 1 }}>
            GERBER EVENTS
          </span>
          <span style={{ fontFamily: script, fontSize: 17, color: C.fgMute, lineHeight: .85, marginTop: -2 }}>
            since 1983
          </span>
        </span>
      </a>

      <nav style={{
        display: 'flex', gap: 30, justifyContent: 'center',
        fontFamily: mono, fontSize: 11, letterSpacing: '.20em', textTransform: 'uppercase', color: C.fgMute
      }}>
        {['Atelier', 'Productions', 'Méthode', 'Presse', 'Contact'].map((it) =>
        <a key={it} href="#"
        style={{ color: 'inherit', textDecoration: 'none', transition: 'color .2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = C.fg}
        onMouseLeave={(e) => e.currentTarget.style.color = C.fgMute}>
            {it}
          </a>
        )}
      </nav>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end',
        fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.fgMute,
        whiteSpace: 'nowrap'
      }}>
        <StarMark size={11} color={C.fg} style={{ animation: 'a-blink 3.2s ease-in-out infinite', flexShrink: 0 }} />
        <span>Backstage · MMXXVI</span>
        <span style={{
          display: 'inline-block', width: 5, height: 5, background: C.fg, borderRadius: 3
        }} />
        <a href="#" style={{ color: C.fg, textDecoration: 'none' }}>Brief · FR/EN</a>
      </div>
    </header>);

}

function GEMark({ size = 32, fg, bg }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: size * 0.22,
        background: bg, color: fg, border: `1px solid ${fg}`,
        fontFamily: '"DM Serif Display", serif', fontSize: size * 0.6, lineHeight: 1, letterSpacing: '-0.04em'
      }}>
      G<span style={{ marginLeft: -size * 0.08 }}>E</span></span>);

}

function HeroStage({ C, dt, af, layout, display, body, script, mono, mouse, scrollY }) {
  const offset = layout === 'offset';
  const lift = Math.min(80, scrollY * 0.4);
  return (
    <div style={{
      position: 'relative', zIndex: 6,
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
      gap: 'clamp(40px, 6vw, 96px)',
      padding: `clamp(20px, 4vh, 64px) clamp(20px, 4vw, 56px) 0`,
      transform: `translateY(${-lift}px)`
    }}>
      {/* LEFT — wordmark lockup */}
      <WordmarkLockup
        C={C} display={display} script={script} mono={mono}
        af={af} offset={offset} />
      

      {/* RIGHT — editorial copy + backstage flourish */}
      <HeroSidebar
        C={C} display={display} body={body} script={script} mono={mono}
        af={af} mouse={mouse} />
      
    </div>);

}

function WordmarkLockup({ C, display, script, mono, af, offset }) {
  // Wordmark "GERBER" + "EVENTS" stacked, with "since 1983" script tag.
  // Sized big — this is the brand.
  const size = 'clamp(96px, 14.5vw, 240px)';
  return (
    <div
      style={{
        position: 'relative',
        animation: af > 0 ? `ge-rise ${0.9 * af}s ${0.05 * af}s both` : 'none'
      }}>
      
      <div style={{
        fontFamily: mono, fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase',
        color: C.fgMute, marginBottom: 22, display: 'inline-flex', alignItems: 'center', gap: 12
      }}>
        <StarMark size={12} color={C.fg} />
        <span>Dossier I · Manifeste</span>
        <span style={{ display: 'inline-block', width: 36, height: 1, background: C.fgFaint }} />
        <span>Édition&nbsp;MMXXVI</span>
      </div>

      <h1 style={{
        margin: 0,
        fontFamily: display, fontWeight: 400,
        fontSize: size, lineHeight: 0.86, letterSpacing: '-0.02em',
        color: C.fg,
        textShadow: C.bg === '#0a0a0a' ? '0 1px 0 rgba(0,0,0,.5)' : 'none'
      }}>
        <div style={{ whiteSpace: 'nowrap', margin: "-1px 0px 0px", fontWeight: "400", fontFamily: "Kanilia" }}>GERBER</div>
        <div style={{
          paddingLeft: offset ? 0 : '0.12em',
          whiteSpace: 'nowrap', fontFamily: "Kanilia", padding: "0px"
        }}>EVENTS</div>
        <div style={{
          fontFamily: script, fontWeight: 400,
          fontSize: '0.34em', letterSpacing: 'normal',
          color: C.fg, lineHeight: 1, marginTop: '0.06em',
          paddingLeft: offset ? '0.4em' : '0.6em',
          whiteSpace: 'nowrap'
        }}>
          since 1983
        </div>
      </h1>

      <div style={{
        marginTop: 28,
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 22,
        fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase',
        color: C.fgMute
      }}>
        <span>Atelier Lyon · Genève</span>
        <span style={{ color: C.fgFaint }}>·</span>
        <span>Quatre disciplines · une seule signature</span>
        <span style={{ color: C.fgFaint }}>·</span>
        <span style={{ color: C.fg }}>Brief direct → 6.00.00.00.00</span>
      </div>
    </div>);

}

function HeroSidebar({ C, display, body, script, mono, af, mouse }) {
  const x = mouse.active ? mouse.rel.x * 100 : 50;
  const y = mouse.active ? mouse.rel.y * 100 : 50;
  return (
    <aside
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 32,
        paddingTop: 'clamp(20px, 3vh, 60px)',
        animation: af > 0 ? `ge-rise ${0.9 * af}s ${0.18 * af}s both` : 'none'
      }}>
      
      {/* Pull-quote tagline */}
      <div style={{
        fontFamily: display, fontStyle: 'italic', fontWeight: 400,
        fontSize: 'clamp(26px, 2.4vw, 38px)', lineHeight: 1.15, letterSpacing: '-0.01em',
        color: C.fg
      }}>
        “Concevoir, créer,&nbsp;
        <span style={{ fontStyle: 'italic', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 6 }}>
          casser les codes.
        </span>”
      </div>

      {/* Backstage script flourish */}
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: script, fontSize: 'clamp(44px, 4.6vw, 76px)', lineHeight: 1.05,
          color: C.fg, letterSpacing: '-0.005em',
          textShadow: C.bg === '#0a0a0a' ? '0 2px 12px rgba(0,0,0,.4)' : 'none'
        }}>
          backstage <span style={{ display: 'inline-block', transform: 'rotate(-2deg)' }}>mindset.</span>
        </div>
        <div style={{
          fontFamily: mono, fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase',
          color: C.fgFaint, marginTop: 14
        }}>— Manifeste, depuis 1983</div>
      </div>

      {/* Body copy */}
      <p style={{
        margin: 0, color: C.fgMute, fontSize: 15.5, lineHeight: 1.55, maxWidth: 460,
        fontFamily: body
      }}>
        David Gerber dessine, code, construit et met en lumière —
        <span style={{ color: C.fg }}> souvent dans le même projet.</span>
        &nbsp;Un atelier qui pense la régie comme on pense la maquette&nbsp;: <em>continue</em>.
      </p>

      {/* Tiny info row */}
      <div style={{
        marginTop: 'auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        paddingTop: 24, borderTop: `1px solid ${C.rule}`,
        fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: C.fgFaint
      }}>
        <div>
          <div>Projets livrés</div>
          <div style={{
            fontFamily: display, fontSize: 'clamp(36px, 3.5vw, 52px)', lineHeight: 1,
            letterSpacing: '-0.025em', color: C.fg, marginTop: 4
          }} className="ge-num">142<span style={{ color: C.fg, opacity: .6 }}>+</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>Curseur · backstage</div>
          <div style={{
            fontFamily: display, fontSize: 'clamp(36px, 3.5vw, 52px)', lineHeight: 1,
            letterSpacing: '-0.025em', color: C.fg, marginTop: 4
          }} className="ge-num">
            {String(Math.round(x)).padStart(2, '0')}·{String(Math.round(y)).padStart(2, '0')}
          </div>
        </div>
      </div>
    </aside>);

}

function HeroBaseline({ C, mono, mouse, dt }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'clamp(16px, 2.5vh, 32px)',
        left: 'clamp(20px, 4vw, 56px)',
        right: 'clamp(20px, 4vw, 56px)',
        zIndex: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase',
        color: C.fgFaint
      }}>
      
      <span>Établi 1983 · Lyon</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: C.fgMute }}>
        <StarMark size={10} color={C.fg} />
        {mouse.active ? 'Backstage allumé' : 'Bouger le curseur pour entrer dans la scène'}
      </span>
      <span>↓ Faire défiler · I—IV</span>
    </div>);

}

// -------------------------------------------------------------------
// FILM ROLL — contact sheet of the noir portraits
// -------------------------------------------------------------------
function FilmRoll({ C, dt, af, mono, script }) {
  const ref = useRef(null);
  const seen = useInView(ref);

  return (
    <section
      ref={ref}
      data-screen-label="Contact sheet"
      style={{
        position: 'relative',
        padding: `clamp(56px, 7vh, 96px) ${dt.pad} clamp(40px, 5vh, 64px)`,
        background: C.bg,
        borderTop: `1px solid ${C.rule}`
      }}>
      
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 24, alignItems: 'baseline',
        marginBottom: 36
      }}>
        <div>
          <div style={{
            fontFamily: mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
            color: C.fgMute, marginBottom: 10
          }}>
            <StarMark size={11} color={C.fg} style={{ display: 'inline-block', marginRight: 10, verticalAlign: '-1px' }} />
            Planche-contact · A&nbsp;–&nbsp;D
          </div>
          <h2 style={{
            margin: 0, fontFamily: '"DM Serif Display", serif', fontWeight: 400,
            fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: C.fg
          }}>
            Six images. <span style={{ fontStyle: 'italic' }}>Un même film.</span>
          </h2>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: C.fgFaint, textAlign: 'right', lineHeight: 1.6 }}>
          Roll 014 · 35mm<br /><span style={{ color: C.fgMute }}>Tirage · MMXXVI</span>
        </div>
        <a href="#" style={{
          fontFamily: mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
          color: C.fg, textDecoration: 'none', padding: '10px 14px',
          border: `1px solid ${C.rule}`, borderRadius: 999
        }}>
          → Voir la galerie
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: 14
      }}>
        {STILLS.map((s, i) =>
        <FilmFrame key={s.src} s={s} i={i} seen={seen} C={C} mono={mono} af={af} />
        )}
      </div>
    </section>);

}

function FilmFrame({ s, i, seen, C, mono, af }) {
  const [hover, setHover] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        margin: 0,
        aspectRatio: '3 / 4',
        overflow: 'hidden',
        background: C.bgSoft,
        border: `1px solid ${C.rule}`,
        cursor: 'pointer',
        opacity: seen || af === 0 ? 1 : 0,
        transform: seen || af === 0 ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${0.5 * (af || 0.01)}s ${i * 0.07 * (af || 0.01)}s var(--ge-ease),
                     transform ${0.5 * (af || 0.01)}s ${i * 0.07 * (af || 0.01)}s var(--ge-ease)`
      }}>
      
      <img
        src={s.src} alt={s.label}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: hover ? 'grayscale(1) contrast(1.05) brightness(1)' : 'grayscale(1) contrast(.95) brightness(.7)',
          transform: hover ? 'scale(1.04)' : 'scale(1)',
          transition: `filter ${0.3 * (af || 0.01)}s var(--ge-ease), transform ${0.5 * (af || 0.01)}s var(--ge-ease)`
        }} />
      
      {/* corner ticks */}
      {['tl', 'tr', 'bl', 'br'].map((c) => {
        const sty = {
          position: 'absolute', width: 10, height: 10,
          borderColor: C.paper, borderStyle: 'solid', borderWidth: 0,
          opacity: hover ? 1 : .55, transition: 'opacity .25s'
        };
        if (c === 'tl') {sty.top = 6;sty.left = 6;sty.borderTopWidth = 1;sty.borderLeftWidth = 1;}
        if (c === 'tr') {sty.top = 6;sty.right = 6;sty.borderTopWidth = 1;sty.borderRightWidth = 1;}
        if (c === 'bl') {sty.bottom = 6;sty.left = 6;sty.borderBottomWidth = 1;sty.borderLeftWidth = 1;}
        if (c === 'br') {sty.bottom = 6;sty.right = 6;sty.borderBottomWidth = 1;sty.borderRightWidth = 1;}
        return <span key={c} style={sty} />;
      })}
      {/* caption */}
      <figcaption style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: 10,
        background: `linear-gradient(180deg, transparent, ${C.bgDeep}cc)`,
        color: C.paper,
        fontFamily: mono, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'
      }}>
        <span>{s.label}</span>
        <span style={{ opacity: .7 }}>{s.code}</span>
      </figcaption>
    </figure>);

}

// -------------------------------------------------------------------
// MANIFESTO — full-bleed dark band with the big serif quote
// -------------------------------------------------------------------
function Manifesto({ C, dt, af, display, script, mono }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section
      ref={ref}
      data-screen-label="Manifeste"
      style={{
        position: 'relative',
        padding: `clamp(96px, 12vh, 168px) ${dt.pad}`,
        background: C.bgDeep,
        color: C.fg,
        borderTop: `1px solid ${C.rule}`,
        borderBottom: `1px solid ${C.rule}`,
        overflow: 'hidden'
      }}>
      
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr', gap: 36,
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
          color: C.fgMute, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12
        }}>
          <span style={{ width: 36, height: 1, background: C.fgMute }} />
          <StarMark size={11} color={C.fg} />
          <span>II — Manifeste</span>
          <StarMark size={11} color={C.fg} />
          <span style={{ width: 36, height: 1, background: C.fgMute }} />
        </div>

        <blockquote style={{
          margin: 0, fontFamily: display, fontWeight: 400, fontStyle: 'italic',
          fontSize: 'clamp(48px, 7.5vw, 132px)', lineHeight: 0.98, letterSpacing: '-0.025em',
          color: C.fg,
          opacity: seen || af === 0 ? 1 : 0.001,
          transform: seen || af === 0 ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity ${0.8 * (af || 0.01)}s var(--ge-ease), transform ${0.8 * (af || 0.01)}s var(--ge-ease)`
        }}>
          <div>“Concevoir, créer,</div>
          <div>casser les codes.”</div>
        </blockquote>

        <div style={{
          width: 'min(420px, 60%)', height: 1, background: C.rule,
          margin: '8px auto 0'
        }} />

        <div style={{
          fontFamily: script, fontSize: 'clamp(36px, 4vw, 64px)', lineHeight: 1.1,
          color: C.fg, paddingTop: 8
        }}>
          backstage <span style={{ display: 'inline-block', transform: 'rotate(-2deg)' }}>mindset.</span>
        </div>

        <div style={{
          fontFamily: mono, fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase',
          color: C.fgFaint, marginTop: 12
        }}>
          Atelier Gerber — depuis MCMLXXXIII
        </div>
      </div>
    </section>);

}

// -------------------------------------------------------------------
// MARQUEE — keyword strip
// -------------------------------------------------------------------
function KeywordMarquee({ C, mono, af }) {
  const tokens = [
  'CONCEPTION', '×', 'DÉVELOPPEMENT', '×', 'RÉNOVATION', '×', 'ÉVÉNEMENTIEL', '×',
  'SCÉNOGRAPHIE', '×', 'SON & LUMIÈRE', '×', 'BÉTON CIRÉ', '×', 'IDENTITÉ VISUELLE', '×'];

  return (
    <div
      aria-hidden
      style={{
        borderTop: `1px solid ${C.rule}`,
        borderBottom: `1px solid ${C.rule}`,
        overflow: 'hidden', padding: '20px 0',
        background: C.bg
      }}>
      
      <div style={{
        display: 'inline-flex', gap: 36, whiteSpace: 'nowrap',
        animation: af > 0 ? `ge-marquee ${48 / (af + 0.2)}s linear infinite` : 'none',
        fontFamily: mono, fontSize: 12.5, letterSpacing: '.24em', textTransform: 'uppercase',
        color: C.fgMute
      }}>
        {[...tokens, ...tokens, ...tokens].map((tk, i) =>
        <span key={i} style={{ color: tk === '×' ? C.fg : 'inherit' }}>
            {tk === '×' ? <StarMark size={11} color={C.fg} style={{ verticalAlign: '-1px' }} /> : tk}
          </span>
        )}
      </div>
    </div>);

}

// -------------------------------------------------------------------
// DISCIPLINES — 4 numbered rows with noir thumbnails
// -------------------------------------------------------------------
function Disciplines({ C, dt, af, display, body, script, mono }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  const [active, setActive] = useState(null);
  return (
    <section
      ref={ref}
      data-screen-label="Disciplines"
      style={{
        position: 'relative',
        padding: `${dt.sectionPadY} ${dt.pad}`,
        background: C.bg
      }}>
      
      <div style={{
        display: 'grid', gridTemplateColumns: '220px 1fr 240px', alignItems: 'baseline',
        gap: 40, marginBottom: 64
      }}>
        <div style={{
          fontFamily: mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
          color: C.fgMute, display: 'flex', alignItems: 'center', gap: 12
        }}>
          <StarMark size={11} color={C.fg} />
          III — Disciplines
        </div>
        <h2 style={{
          margin: 0, fontFamily: display, fontWeight: 400,
          fontSize: 'clamp(34px, 4.4vw, 64px)', lineHeight: 1.04,
          letterSpacing: '-0.02em', color: C.fg, maxWidth: 880
        }}>
          Quatre métiers, un seul atelier — <span style={{ fontStyle: 'italic' }}>pensés ensemble</span> pour
          que la fabrique reste continue.
        </h2>
        <div style={{
          fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase',
          color: C.fgFaint, textAlign: 'right', lineHeight: 1.7
        }}>
          IV / IV<br />
          <a href="#" style={{ color: C.fg, textDecoration: 'none' }}>→ Voir l'index complet</a>
        </div>
      </div>

      <ol
        onMouseLeave={() => setActive(null)}
        style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        
        {SERVICES.map((s, i) =>
        <DisciplineRow
          key={s.n} s={s} i={i}
          seen={seen}
          active={active === i}
          anyActive={active !== null}
          onEnter={() => setActive(i)}
          C={C} display={display} body={body} script={script} mono={mono} af={af} />

        )}
      </ol>
    </section>);

}

function DisciplineRow({ s, i, seen, active, anyActive, onEnter, C, display, body, script, mono, af }) {
  const aff = af === 0 ? 0.0001 : af;
  return (
    <li
      onMouseEnter={onEnter}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '100px 96px 1fr 280px 90px 40px',
        gap: 28, alignItems: 'center',
        padding: '24px 12px',
        borderTop: `1px solid ${C.rule}`,
        borderBottom: i === SERVICES.length - 1 ? `1px solid ${C.rule}` : 'none',
        cursor: 'pointer',
        background: active ? C.rowHover : 'transparent',
        opacity: seen || af === 0 ? anyActive && !active ? 0.5 : 1 : 0,
        transform: seen || af === 0 ? 'translateY(0)' : 'translateY(20px)',
        transition: `
          opacity ${0.55 * aff}s ${i * 0.07 * aff}s var(--ge-ease),
          transform ${0.55 * aff}s ${i * 0.07 * aff}s var(--ge-ease),
          background .25s var(--ge-ease),
          padding-left .3s var(--ge-ease)
        `,
        paddingLeft: active ? 22 : 12
      }}>
      
      <span
        className="ge-num"
        style={{
          fontFamily: display, fontSize: 'clamp(28px, 2.6vw, 40px)',
          color: active ? C.fg : C.fgFaint,
          letterSpacing: '-0.02em', lineHeight: 1,
          transition: 'color .25s'
        }}>
        
        {s.n}
      </span>

      <div style={{
        position: 'relative', width: 96, height: 120,
        overflow: 'hidden', background: C.bgSoft,
        transform: active ? 'scale(1.04)' : 'scale(1)',
        transition: `transform ${0.4 * aff}s var(--ge-ease)`
      }}>
        <img
          src={s.img} alt={s.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: active ? 'grayscale(1) brightness(1) contrast(1.05)' : 'grayscale(1) brightness(.65) contrast(1)',
            transition: `filter ${0.3 * aff}s var(--ge-ease)`
          }} />
        
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 style={{
          margin: 0, fontFamily: display, fontWeight: 400,
          fontSize: 'clamp(26px, 2.8vw, 44px)', lineHeight: 1.05,
          letterSpacing: '-0.015em', color: C.fg
        }}>
          {s.title}
        </h3>
        <div style={{
          overflow: 'hidden',
          maxHeight: active ? 80 : 0, opacity: active ? 1 : 0,
          transition: `max-height ${0.35 * aff}s var(--ge-ease), opacity ${0.25 * aff}s var(--ge-ease)`
        }}>
          <p style={{ margin: '8px 0 0', color: C.fgMute, fontSize: 14.5, maxWidth: 620, fontFamily: body }}>
            {s.blurb}
          </p>
        </div>
        <span style={{
          fontFamily: script, fontSize: 22, color: C.fgFaint, lineHeight: 1,
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(-6px)',
          transition: `opacity ${0.25 * aff}s, transform ${0.25 * aff}s`
        }}>{s.caption}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {s.tags.map((t) =>
        <span key={t} style={{
          fontFamily: mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
          padding: '4px 10px',
          border: `1px solid ${active ? C.ruleStrong : C.rule}`,
          borderRadius: 999, color: active ? C.fg : C.fgMute,
          transition: 'border-color .25s, color .25s'
        }}>{t}</span>
        )}
      </div>

      <span style={{
        fontFamily: mono, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
        color: active ? C.fg : C.fgFaint, textAlign: 'right'
      }}>{['UX', 'BRAND', 'BÂTI', 'EVT'][i]}</span>

      <span
        aria-hidden
        style={{
          fontFamily: mono, fontSize: 20, color: active ? C.fg : C.fgFaint,
          textAlign: 'right',
          transform: active ? 'translateX(6px)' : 'translateX(0)',
          transition: 'transform .25s, color .25s'
        }}>
        →</span>
    </li>);

}

// -------------------------------------------------------------------
// CONTACT STRIP — footer
// -------------------------------------------------------------------
function ContactStrip({ C, dt, mono, script, display }) {
  return (
    <footer
      data-screen-label="Contact"
      style={{
        padding: `clamp(56px, 7vh, 96px) ${dt.pad} clamp(36px, 5vh, 64px)`,
        background: C.bgDeep,
        borderTop: `1px solid ${C.rule}`,
        color: C.fg
      }}>
      
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 40, alignItems: 'end',
        marginBottom: 40
      }}>
        <div>
          <div style={{
            fontFamily: mono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase',
            color: C.fgMute, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12
          }}>
            <StarMark size={11} color={C.fg} />
            Prendre rendez-vous
          </div>
          <div style={{
            fontFamily: display, fontWeight: 400, fontSize: 'clamp(48px, 6vw, 96px)',
            lineHeight: 0.92, letterSpacing: '-0.025em', color: C.fg
          }}>
            Brief direct.
            <div style={{ fontFamily: script, fontSize: '0.6em', lineHeight: .9, marginTop: 12, color: C.fg }}>
              backstage <span style={{ transform: 'rotate(-2deg)', display: 'inline-block' }}>welcome.</span>
            </div>
          </div>
        </div>

        <div style={{
          alignSelf: 'end',
          fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
          color: C.fgMute, lineHeight: 1.9, textAlign: 'right'
        }}>
          <div style={{ color: C.fg }}>david@gerber-events.fr</div>
          <div>+33 6 00 00 00 00</div>
          <div>Atelier · 14 rue des Capucins, Lyon</div>
        </div>

        <a href="#" style={{
          alignSelf: 'end',
          display: 'inline-flex', alignItems: 'center', gap: 14,
          padding: '16px 24px',
          border: `1px solid ${C.fg}`,
          color: C.fg, background: 'transparent', textDecoration: 'none',
          fontFamily: mono, fontSize: 11, letterSpacing: '.20em', textTransform: 'uppercase'
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = C.fg;e.currentTarget.style.color = C.bgDeep;}}
        onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = C.fg;}}>
          
          <span>→ Envoyer un brief</span>
        </a>
      </div>

      <div style={{
        paddingTop: 24, borderTop: `1px solid ${C.rule}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase',
        color: C.fgFaint
      }}>
        <span>© MMXXVI · GERBER EVENTS</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <StarMark size={10} color={C.fg} />
          Depuis MCMLXXXIII
          <StarMark size={10} color={C.fg} />
        </span>
        <span>Mentions légales · Crédits</span>
      </div>
    </footer>);

}

Object.assign(window, { DirectionEditorial });