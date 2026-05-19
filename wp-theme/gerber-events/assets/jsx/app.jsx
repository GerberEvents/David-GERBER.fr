/* eslint-disable */
// GERBER EVENTS — point d'entrée WordPress.

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '3rem', background: '#0a0a0a', color: '#f4f1ec',
          fontFamily: 'system-ui, sans-serif', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16
        }}>
          <div style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .5 }}>
            GERBER EVENTS — Erreur de rendu
          </div>
          <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#f44', maxWidth: 600, textAlign: 'center' }}>
            {this.state.error.message}
          </div>
          <div style={{ fontSize: 11, opacity: .4 }}>
            Consultez la console pour plus de détails.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const D = window.GERBER_DATA || {};
  return (
    <ErrorBoundary>
      <DirectionEditorial
        data={D}
        tweaks={{ typo: 'serif', density: 'airy', motion: 'full', dark: true }}
      />
    </ErrorBoundary>
  );
}

const root = document.getElementById('ge-root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
