import { MERCH, PICKUP_NOTE } from '../merch.js';

const HEX = '25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3';
const COLORS = ['#B4432A', '#2F5D46', '#E0B356', '#6B8FB8', '#8C7A4E', '#D8D0C2'];

function Hex({ x, y, s, fill, stroke }) {
  return <polygon points={HEX} transform={`translate(${x} ${y}) scale(${s / 100})`} fill={fill} stroke={stroke} strokeWidth={stroke ? 100 / s * 2 : 0} />;
}

function Mark({ x, y, s }) {
  // Five-hex mark: an original cluster, no CATAN artwork.
  const w = s * 0.75; const h = s * 0.866;
  const cells = [[0, 0, '#2F5D46'], [w, -h / 2, '#B4432A'], [w * 2, 0, '#E0B356'], [w, h / 2, '#6B8FB8'], [w * 3, -h / 2, '#8C7A4E']];
  return <g>{cells.map(([cx, cy, f], i) => <Hex key={i} x={x + cx} y={y + cy} s={s} fill={f} />)}</g>;
}

export function Art({ kind }) {
  if (kind === 'stickers') {
    return (
      <svg viewBox="0 0 320 240" role="img" aria-label="Sticker pack illustration">
        <rect width="320" height="240" fill="#EDE5D7" />
        {COLORS.map((c, i) => (
          <Hex key={c} x={38 + (i % 3) * 86} y={34 + Math.floor(i / 3) * 92 + (i % 2) * 14} s={72} fill={c} stroke="#FFFFFF" />
        ))}
      </svg>
    );
  }
  if (kind === 'tee') {
    return (
      <svg viewBox="0 0 320 240" role="img" aria-label="T-shirt illustration">
        <rect width="320" height="240" fill="#EDE5D7" />
        <path d="M110 30 L140 20 Q160 34 180 20 L210 30 L258 62 L238 96 L214 84 L214 222 L106 222 L106 84 L82 96 L62 62 Z" fill="#16181D" />
        <Mark x={128} y={86} s={20} />
        <text x="160" y="160" textAnchor="middle" fill="#F4EFE6" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="1">SETTLE UP NY</text>
      </svg>
    );
  }
  if (kind === 'pin') {
    return (
      <svg viewBox="0 0 320 240" role="img" aria-label="Enamel pin illustration">
        <rect width="320" height="240" fill="#EDE5D7" />
        <Hex x={70} y={66} s={124} fill="#B08A2E" />
        <Hex x={80} y={74} s={104} fill="#E0B356" />
        <text x="132" y="126" textAnchor="middle" fill="#16181D" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="18">FINAL</text>
        <Hex x={210} y={96} s={64} fill="#8E949C" />
        <Hex x={216} y={101} s={52} fill="#C9CDD2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Tote bag illustration">
      <rect width="320" height="240" fill="#EDE5D7" />
      <path d="M125 70 Q125 30 160 30 Q195 30 195 70" fill="none" stroke="#C9B994" strokeWidth="8" />
      <rect x="92" y="66" width="136" height="156" rx="4" fill="#F4EFE6" stroke="#C9B994" strokeWidth="3" />
      <Mark x={116} y={126} s={22} />
    </svg>
  );
}

export default function Shop() {
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="eyebrow">Shop</div>
        <h1>Rep the tables</h1>
        <p>Community merch for NYC Catan players. {PICKUP_NOTE}</p>
      </div>
      <div className="grid-4 shop-grid">
        {MERCH.map((m) => (
          <article key={m.id} className="card shop-card">
            <div className="shop-art"><Art kind={m.art} /></div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <h2 style={{ fontSize: 22, fontWeight: 600 }}>{m.name}</h2>
                <span className="mono" style={{ fontWeight: 600 }}>{m.price}</span>
              </div>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, flex: 1 }}>{m.blurb}</p>
              {m.buyUrl ? (
                <a className="btn btn-primary" href={m.buyUrl} target="_blank" rel="noreferrer">{m.status === 'preorder' ? 'Preorder' : 'Buy'}</a>
              ) : (
                <span className="btn btn-ghost" aria-disabled="true" style={{ opacity: 0.6, cursor: 'default' }}>Coming soon</span>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 14, marginTop: 24, maxWidth: 720 }}>
        Checkout is handled by our payment provider; this site never sees your card details. NYCatan is a community group and is not affiliated with CATAN GmbH or CATAN Studio.
      </p>
    </div>
  );
}
