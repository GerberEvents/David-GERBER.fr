/* eslint-disable */
// GERBER EVENTS — point d'entrée WP.
// Monte DirectionEditorial sur #ge-root avec les données PHP injectées.

function App() {
  const D = window.GERBER_DATA || {};
  return <DirectionEditorial data={D} tweaks={{ typo:'serif', density:'airy', motion:'full', dark:true }} />;
}

const root = document.getElementById('ge-root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
