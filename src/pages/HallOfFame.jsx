import { useMemo, useState } from 'react';
import { useData } from '../lib/DataContext.jsx';
import { aggregate, leaderTimeline } from '../lib/stats.js';
import { NATIONAL_HONORS } from '../content.js';
import { Link } from 'react-router-dom';
import { PlayerLink, Segmented, pct } from '../components/bits.jsx';
import { VIS } from '../lib/visibility.js';

const PALETTE = ['#E0B356', '#C9563B', '#3E9A70', '#6B8FB8', '#B09A63', '#A77BB5', '#D98C5F', '#7FB3A3'];

function Board({ title, sub, tabs, tab, setTab, rows }) {
  const [top, ...rest] = rows;
  return (
    <div className="hof-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2>{title}</h2>
          <p style={{ fontSize: 14, color: 'var(--night-muted)', marginTop: 6 }}>{sub}</p>
        </div>
        {tabs.length > 1 && (
          <div className="tabs" role="group" aria-label={`${title} bracket`}>
            {tabs.map((t, i) => <button key={t} type="button" aria-pressed={i === tab} onClick={() => setTab(i)}>{t}</button>)}
          </div>
        )}
      </div>
      {top ? (
        <div className="hof-top">
          <span className="hex">1</span>
          <PlayerLink name={top.name} slug={top.slug} />
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontWeight: 600, fontSize: 24, color: 'var(--wheat)' }}>{top.value}</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--night-muted)' }}>{top.note}</div>
          </div>
        </div>
      ) : <p style={{ color: 'var(--night-muted)' }}>Nobody qualifies yet.</p>}
      <div>
        {rest.map((r, i) => (
          <div className="hof-row" key={r.name}>
            <span className="mono" style={{ fontWeight: 600, color: i < 2 ? 'var(--wheat)' : 'var(--night-muted)' }}>{i + 2}</span>
            <PlayerLink name={r.name} slug={r.slug} />
            <span className="mono" style={{ textAlign: 'right' }}>{r.value} <span style={{ fontSize: 11, color: 'var(--night-muted)' }}>{r.note}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

const unit = (value, note) => (value === '1' && /s$/.test(note) && !/-/.test(note) ? note.slice(0, -1) : note);

function rank(rows, get, fmt, note, n = 8) {
  return rows
    .filter((r) => get(r) > 0)
    .sort((a, b) => get(b) - get(a) || b.wins - a.wins || a.name.localeCompare(b.name))
    .slice(0, n)
    .map((r) => { const value = fmt(get(r)); return { name: r.name, slug: r.slug, value, note: unit(value, note(r)) }; });
}

export default function HallOfFame() {
  const { model } = useData();
  const [mode, setMode] = useState('all');
  const [tabs, setTabs] = useState({ titles: 0, win: 0, vp: 0, apps: 0 });
  const set = (k) => (i) => setTabs((t) => ({ ...t, [k]: i }));
  const season = model.seasons.find((s) => model.completed.some((e) => e.season === s));
  const rows = useMemo(() => aggregate(model, mode === 'all' ? null : season), [model, mode, season]);
  const mins = mode === 'all' ? [15, 30, 45] : [6, 9, 12];
  const timeline = useMemo(() => leaderTimeline(model), [model]);
  const maxPts = Math.max(...timeline.map((t) => t.points));
  const leaders = [...new Set(timeline.map((t) => t.leader))];
  const colorOf = (n) => PALETTE[leaders.indexOf(n) % PALETTE.length];

  const titleKey = ['titles', 'finals', 'top16'][tabs.titles];
  const titleNote = ['titles', 'final tables', 'top 16 cuts'][tabs.titles];
  const winMin = mins[tabs.win];
  const vpMin = mins[tabs.vp];

  return (
    <div className="hof">
      <section className="hof-stage">
        <div className="hof-hexes" aria-hidden="true">
          {['#2F5D46', '#B4432A', '#E0B356', '#6B6F76', '#8C7A4E'].map((c, i) => (
            <span key={c} className="hex" style={{ background: c, marginTop: i % 2 ? 0 : 60 }} />
          ))}
        </div>
        <span className="eyebrow" style={{ color: 'var(--wheat)', letterSpacing: '0.3em', position: 'relative' }}>New York City Catan</span>
        <h1 style={{ position: 'relative' }}>Hall of Fame</h1>
        <p style={{ color: '#CFC8BB', fontSize: 19, position: 'relative' }}>{model.completed.length} events and {model.players.size} players on record.</p>
        <div style={{ position: 'relative', marginTop: 8 }}>
          <Segmented dark label="Time range" options={[['all', 'All-time'], ['season', `${season} season`]]} value={mode} onChange={setMode} />
        </div>
      </section>

      <section className="wrap grid-2" style={{ paddingTop: 64 }}>
        <Board title="Most decorated" sub="Deep runs, by finish" tabs={['Titles', 'Final', 'Top 16']} tab={tabs.titles} setTab={set('titles')}
          rows={rank(rows, (r) => r[titleKey], String, () => titleNote)} />
        {VIS.performanceStats && (
          <>
        <Board title="Win rate" sub="Share of all games won. Four-player tables, so 25% is par." tabs={mins.map((m) => `${m}+ G`)} tab={tabs.win} setTab={set('win')}
          rows={rank(rows.filter((r) => r.games >= winMin), (r) => r.winRate, pct, (r) => `${r.wins}-${r.games - r.wins}`)} />
        <Board title="Average VP" sub="Points per game across prelims and cut rounds" tabs={mins.map((m) => `${m}+ G`)} tab={tabs.vp} setTab={set('vp')}
          rows={rank(rows.filter((r) => r.games >= vpMin), (r) => r.avgVp, (v) => v.toFixed(2), (r) => `${r.games} games`)} />
          </>
        )}
        <Board title="Iron players" sub="Showed up the most" tabs={['Events', 'Games']} tab={tabs.apps} setTab={set('apps')}
          rows={rank(rows, (r) => (tabs.apps === 0 ? r.events : r.games), String, () => (tabs.apps === 0 ? 'events' : 'games'))} />
      </section>

      {VIS.seasonRace && (
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 72 }}>
          <div className="section-head">
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 600 }}>Season leader after every event</h2>
              <p style={{ color: 'var(--night-muted)', marginTop: 8, fontSize: 14 }}>Points reset each January. Bar height is the leader's season points.</p>
            </div>
          </div>
          <div className="hof-chart">
            <div className="table-scroll">
              <div style={{ minWidth: 720 }}>
                <div className="vbars">
                  {timeline.map((t) => (
                    <div key={t.eventId}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: colorOf(t.leader), textAlign: 'center', lineHeight: 1.2 }}>{t.leader.split(' ')[0]}</span>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--night-muted)' }}>{t.points}</span>
                      <div className="b" style={{ height: `${(t.points / maxPts) * 170}px`, background: colorOf(t.leader) }} />
                    </div>
                  ))}
                </div>
                <div className="vbars-labels">
                  {timeline.map((t) => <span key={t.eventId}>{t.label}<br />{t.season}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 72 }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 600 }}>Every final table</h2>
            <p style={{ color: 'var(--night-muted)', marginTop: 8, fontSize: 14 }}>The full record of champions and finalists across affiliated NYCatan events.</p>
          </div>
        </div>
        <div className="grid-3">
          {[...model.completed].reverse().map((e) => (
            <div key={e.id} className="hof-card" style={{ gap: 10, padding: 24 }}>
              <Link to={`/events/${e.id}`} className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--wheat)', textDecoration: 'none' }}>{e.name.toUpperCase()} {e.season}</Link>
              <PlayerLink name={e.champion} style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 24, textDecoration: 'none' }} />
              <span style={{ fontSize: 14, color: 'var(--night-muted)' }}>with {e.finalTable.filter((x) => !x.win).map((x) => x.player).join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="honors">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--ink)' }}>Beyond NYC</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, marginTop: 10 }}>Came through these tables.</h2>
          </div>
          <div className="grid-3">
            {NATIONAL_HONORS.map((h) => (
              <div className="honor" key={h.year + h.name}>
                <div className="mono" style={{ color: 'var(--wheat)', fontSize: 13 }}>{h.year}</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 22, marginTop: 6 }}>{h.name}</div>
                <div style={{ color: '#CFC8BB', fontSize: 14, marginTop: 4 }}>{h.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
