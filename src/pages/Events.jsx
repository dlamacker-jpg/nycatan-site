import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { formatRange, toCsv } from '../lib/stats.js';
import { PlayerLink, DownloadIcon, downloadText, pct } from '../components/bits.jsx';
import { VIS } from '../lib/visibility.js';

export function EventList() {
  const { model } = useData();
  const bySeason = model.seasons.map((s) => ({ season: s, events: [...model.completed].reverse().filter((e) => e.season === s) })).filter((x) => x.events.length);
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="eyebrow">Results</div>
        <h1>Every event</h1>
        <p>Full standings, semifinal tables and the final for every NYCatan tournament on record.</p>
      </div>
      {bySeason.map(({ season, events }) => (
        <section key={season} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>{season}</h2>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Event</th><th className="hide-sm">Date</th><th className="hide-sm">Host</th><th className="num">Players</th><th>Champion</th></tr></thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td><Link to={`/events/${e.id}`}>{e.name}</Link></td>
                    <td className="hide-sm muted">{formatRange(e.start_date, e.end_date)}</td>
                    <td className="hide-sm muted">{e.organizer}</td>
                    <td className="num">{e.fieldSize}</td>
                    <td><PlayerLink name={e.champion} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export function EventRecap() {
  const { model } = useData();
  const { id } = useParams();
  const ev = model.eventsById.get(id);
  const [showAll, setShowAll] = useState(false);
  if (!ev) return <div className="wrap page-head"><h1>Event not found</h1><p><Link to="/events">All events</Link></p></div>;
  const seasonEvents = model.completed.filter((e) => e.season === ev.season);
  const idx = seasonEvents.indexOf(ev) + 1;
  const twoDay = new Set(ev.standings.map((s) => s.day)).size > 1;
  const exportCsv = () => downloadText(`nycatan-${ev.id}.csv`, toCsv(ev.games, ['event_id', 'stage', 'day', 'round', 'table', 'seat', 'player', 'vp', 'win']));

  return (
    <div className="wrap">
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <Link to={`/season/${ev.season}`} className="eyebrow" style={{ textDecoration: 'none' }}>{ev.season} season, event {idx}</Link>
          <h1>{ev.name}</h1>
          <p>{formatRange(ev.start_date, ev.end_date)} at {ev.venue}, {ev.address}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <span className="chip">{ev.fieldSize} players</span>
            <span className="chip">{twoDay ? '2 prelim days' : '1 prelim day'}</span>
            <span className="chip">Hosted by {ev.organizer}</span>
            <span className="chip">Imported from BCP</span>
          </div>
        </div>
        {VIS.fullStandings && <button type="button" className="btn btn-ghost" onClick={exportCsv}><DownloadIcon /> Download results CSV</button>}
      </div>

      <section className="split" style={{ marginTop: 16 }}>
        <div className="final-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ color: 'var(--wheat)' }}>Final table</span>
            {ev.type === 'Qualifier' && <span style={{ color: '#CFC8BB', fontSize: 14 }}>Winner qualifies for the CATAN Regional Championship</span>}
          </div>
          {ev.finalTable.map((s, i) => (
            <div className="final-row" key={s.player}>
              <span className="hex" style={{ width: 48, height: 42, background: i === 0 ? 'var(--wheat)' : '#353943', color: i === 0 ? 'var(--ink)' : 'var(--paper)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{i + 1}</span>
              <PlayerLink name={s.player} style={{ fontSize: i === 0 ? 32 : 22 }} />
              <span className="mono" style={{ fontSize: 20 }}>{s.vp} VP</span>
            </div>
          ))}
        </div>
        <div className="placeholder" style={{ minHeight: 380 }}>[PHOTO: champion at the final table]</div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 20 }}>Semifinals</h2>
        <div className="grid-4">
          {ev.semis.map((t) => (
            <div className="card" key={t.table} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="mono muted" style={{ fontSize: 12, letterSpacing: '0.12em' }}>TABLE {t.table}</span>
              {t.seats.map((s) => (
                <div key={s.player} className={`semi-seat ${s.win ? 'win' : ''}`}>
                  <PlayerLink name={s.player} /><span className="mono">{s.vp}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section split-8-4" style={{ paddingTop: 64 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600 }}>{VIS.fullStandings ? 'Prelim standings' : 'Made the cut'}</h2>
            <span className="muted" style={{ fontSize: 14 }}>{VIS.fullStandings ? `All ${ev.fieldSize} players.` : `The top 16 who made the cut, of ${ev.fieldSize}.`}{twoDay ? ' Best day counts.' : ''}{!VIS.fullStandings && ev.bcp_url ? <> <a href={ev.bcp_url}>Full standings on BCP</a></> : ''}</span>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Rank</th><th>Player</th>{twoDay && <th>Day</th>}<th className="num">W</th><th className="num">VP</th><th className="num">Table %</th><th>Result</th></tr></thead>
              <tbody>
                {ev.standings.slice(0, VIS.fullStandings ? (showAll ? undefined : 32) : 16).map((r) => {
                  const f = ev.finish.get(r.player);
                  return (
                    <tr key={r.player} style={r.rank === 17 ? { borderTop: '2px dashed var(--brick)' } : undefined}>
                      <td className="mono" style={{ fontWeight: 600 }}>{r.rank}</td>
                      <td><PlayerLink name={r.player} /></td>
                      {twoDay && <td className="mono muted">{r.day}</td>}
                      <td className="num">{r.wins}</td>
                      <td className="num">{r.vp}</td>
                      <td className="num">{pct(r.pct)}</td>
                      <td style={{ fontSize: 14, fontWeight: f === 'Prelims' ? 400 : 600, color: f === 'Prelims' ? 'var(--muted)' : 'var(--brick)' }}>{f === 'Prelims' ? '' : f}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {VIS.fullStandings && ev.standings.length > 32 && (
            <button type="button" className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show top 32' : `Show all ${ev.standings.length} players`}
            </button>
          )}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 22, fontWeight: 600 }}>How the cut works</h3>
            {['Most wins across 3 prelim games', 'Then total victory points', 'Then your share of all VP scored at your tables'].map((t, i) => (
              <div key={t} style={{ display: 'flex', gap: 14 }}><span className="mono" style={{ fontWeight: 600, color: 'var(--brick)' }}>{i + 1}</span><span>{t}</span></div>
            ))}
            {twoDay && <p className="muted" style={{ fontSize: 14 }}>Each prelim day is scored on its own. If you played both, your better placing counts.</p>}
          </div>
          {ev.topGame && (
            <div style={{ background: 'var(--paper-2)', borderRadius: 12, padding: 28 }}>
              <span className="eyebrow">Biggest table</span>
              <p style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 22, lineHeight: 1.25, marginTop: 10 }}>
                {ev.topGame.player} put up {ev.topGame.vp} VP in prelim round {ev.topGame.round}, the high score of the event.
              </p>
              <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>Stat callouts are generated from the results file.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
