import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { initials } from '../components/bits.jsx';

export default function Players() {
  const { model } = useData();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const all = [...model.players.values()].sort((a, b) => b.events - a.events || a.name.localeCompare(b.name));
    const s = q.trim().toLowerCase();
    return s ? all.filter((p) => p.name.toLowerCase().includes(s)) : all;
  }, [model, q]);

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="eyebrow">Players</div>
        <h1>Everyone who has sat down</h1>
        <p>{model.players.size} players across {model.completed.length} events. Every profile builds itself from the results files.</p>
      </div>
      <label htmlFor="player-search" className="mono muted" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Find a player</label>
      <input id="player-search" className="search" type="search" placeholder="Type a name" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="player-grid" style={{ marginTop: 24 }}>
        {list.map((p) => (
          <Link key={p.slug} className="player-tile" to={`/players/${p.slug}`}>
            <span className="hex" style={p.titles ? { background: 'var(--wheat)' } : undefined}>{initials(p.name)}</span>
            <span>
              <strong style={{ display: 'block' }}>{p.name}</strong>
              <span className="muted" style={{ fontSize: 13 }}>{p.events} events{p.titles ? `, ${p.titles} title${p.titles > 1 ? 's' : ''}` : ''}</span>
            </span>
          </Link>
        ))}
      </div>
      {!list.length && <p className="muted" style={{ marginTop: 24 }}>No player matches "{q}".</p>}
    </div>
  );
}
