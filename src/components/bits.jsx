import { Link } from 'react-router-dom';

export const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
export const pct = (x) => `${Math.round(x * 100)}%`;

export function PlayerLink({ name, slug, style }) {
  const s = slug || name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return <Link to={`/players/${s}`} style={style}>{name}</Link>;
}

export function RankHex({ rank }) {
  const cls = rank === 1 ? 'gold' : rank <= 3 ? 'dark' : '';
  return <span className={`hex rank-hex ${cls}`}>{rank}</span>;
}

export function Segmented({ options, value, onChange, dark, label }) {
  return (
    <div className={`seg ${dark ? 'dark' : ''}`} role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={v === value} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}

export function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4EFE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="7 4 20 12 7 20 7 4" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function downloadText(filename, text, type = 'text/csv') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
