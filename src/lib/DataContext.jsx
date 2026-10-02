import { createContext, useContext, useEffect, useState } from 'react';
import Papa from 'papaparse';
import { buildModel } from './stats.js';

const DataContext = createContext(null);

async function loadCsv(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load ${path}`);
  const text = await res.text();
  return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
}

export function DataProvider({ children }) {
  const [state, setState] = useState({ model: null, error: null });
  useEffect(() => {
    Promise.all([loadCsv('/data/events.csv'), loadCsv('/data/games.csv')])
      .then(([events, games]) => setState({ model: buildModel(events, games), error: null }))
      .catch((error) => setState({ model: null, error }));
  }, []);
  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
