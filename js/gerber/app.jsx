/* eslint-disable */
// GERBER Events — full-bleed single-page render of Direction A (Éditorial).
// No canvas chrome. The whole viewport is the design.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "typo": "serif",
  "layout": "stack",
  "density": "airy",
  "motion": "full",
  "dark": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <div data-screen-label="GERBER Events · Éditorial" style={{ minHeight: '100vh' }}>
        <DirectionEditorial tweaks={t} />
      </div>

      <TweaksPanel title="Tweaks · GERBER Events">
        <TweakSection label="Typographie" />
        <TweakRadio
          label="Famille"
          value={t.typo}
          options={[
            { value: 'serif', label: 'Serif' },
            { value: 'sans',  label: 'Sans'  },
            { value: 'mono',  label: 'Mono'  },
          ]}
          onChange={(v) => setTweak('typo', v)}
        />

        <TweakSection label="Hero" />
        <TweakRadio
          label="Mise en page"
          value={t.layout}
          options={[
            { value: 'stack',  label: 'Stack'  },
            { value: 'offset', label: 'Offset' },
          ]}
          onChange={(v) => setTweak('layout', v)}
        />

        <TweakSection label="Mise en page globale" />
        <TweakRadio
          label="Densité"
          value={t.density}
          options={[
            { value: 'tight', label: 'Serrée' },
            { value: 'airy',  label: 'Aérée'  },
          ]}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Animation" />
        <TweakRadio
          label="Niveau"
          value={t.motion}
          options={[
            { value: 'off',    label: 'Off'    },
            { value: 'subtle', label: 'Subtle' },
            { value: 'full',   label: 'Full'   },
          ]}
          onChange={(v) => setTweak('motion', v)}
        />

        <TweakSection label="Thème" />
        <TweakToggle
          label="Mode sombre"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
