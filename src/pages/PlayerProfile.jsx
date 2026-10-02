import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { formatDate, finishRank, seasonStandings } from '../lib/stats.js';
import { PlayerLink, initials, pct } from '../components/bits.jsx';

function drawCard(player, h) {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1080;
  const x = c.getContext('2d');
  x.fillStyle = '#16181D'; x.fillRect(0, 0, 1080, 1080);
  x.fillStyle = '#B4432A';
  x.beginPath();
  [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]].forEach(([px, py], i) => {
    const X = 700 + px * 460; const Y = -80 + py * 400;
    i ? x.lineTo(X, Y) : x.moveTo(X, Y);
  });
  x.fill();
  x.fillStyle = '#E0B356'; x.font = '600 34px "IBM Plex Mono", monospace';
  x.fillText(`NYCATAN ${h.eventName.toUpperCase()} ${h.season}`, 90, 160);
  x.fillStyle = '#F4EFE6'; x.font = '800 150px "Bricolage Grotesque", sans-serif';
  x.fillText(h.finish === 'Champion' ? 'Champion.' : h.finish === 'Final table' ? 'Final table.' : 'Top 16.', 80, 620);
  x.font = '600 70px "Bricolage Grotesque", sans-serif';
  x.fillText(player.name, 90, 730);
  x.fillStyle = '#CFC8BB'; x.font = '400 36px "IBM Plex Mono", monospace';
  x.fillText(`Prelims ${h.record}   ${h.vp} VP`, 90, 800);
  x.fillStyle = '#9A958C'; x.font = '400 32px "IBM Plex Mono", monospace';
  x.fillText('nycatan.com', 90, 980);
  const a = document.createElement('a');
  a.download = `nycatan-${player.slug}-${h.eventId}.png`;
  a.href = c.toDataURL('image/png');
  a.click();
}

export default function PlayerProfile() {
  const { model } = useData();
  const { slug } = useParams();
  const player = [...model.players.values()].find((p) => p.slug === slug);
  if (!player) {
    return (
      <div className="wrap page-head">
        <h1>No player found</h1>
        <p><Link to="/players">Back to all players</Link></p>
      </div>
    );
  }
  const season = model.seasons.find((s) => model.completed.some((e) => e.season === s));
  const standing = seasonStandings(model, season).find((r) => r.name === player.name);
  const firstYear = Math.min(...player.history.map((h) => h.season));
  const h2h = [...player.h2h.values()].sort((a, b) => b.games - a.games || b.w - a.w).slice(0, 6);
  const chrono = player.history.slice().reverse().slice(-10);
  const maxPts = Math.max(...chrono.map((h) => h.points), 1);
  const best = player.history.slice().sort((a, b) => finishRank(a.finish) - finishRank(b.finish) || b.date.localeCompare(a.date))[0];
  const shareable = finishRank(best.finish) <= 2 ? best : null;

  const badges = [];
  if (player.titles) badges.push([`${player.titles}x Champion`, 'var(--wheat)', 'var(--ink)']);
  if (player.finals) badges.push([`${player.finals}x Final table`, 'var(--forest)', '#fff']);
  if (player.top16) badges.push([`${player.top16}x Top 16`, '#353943', 'var(--paper)']);
  if (standing?.rank === 1) badges.push([`${season} season leader`, 'var(--brick)', '#fff']);

  return (
    <>
      <section className="player-hero">
        <div className="wrap">
          <span className="hex big">{initials(player.name)}</span>
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="eyebrow" style={{ color: 'var(--wheat)' }}>
              {standing ? `${season} season rank #${standing.rank}` : `Not yet active in ${season}`}  Playing since {firstYear}
            </span>
            <h1>{player.name}</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {badges.map(([l, bg, fg]) => <span key={l} className="pill" style={{ background: bg, color: fg }}>{l}</span>)}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="stat-strip" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div><div className="stat-num">{player.events}</div><div className="stat-label">events played</div></div>
          <div><div className="stat-num">{player.games}</div><div className="stat-label">games</div></div>
          <div><div className="stat-num">{pct(player.winRate)}</div><div className="stat-label">win rate (par is 25%)</div></div>
          <div><div className="stat-num">{player.avgVp.toFixed(1)}</div><div className="stat-label">average VP</div></div>
          <div><div className="stat-num">{player.titles}</div><div className="stat-label">titles</div></div>
        </div>
      </div>

      <section className="wrap section split" style={{ paddingTop: 64 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>Event history</h2>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Event</th><th className="num">Prelims</th><th className="num">VP</th><th>Finish</th><th className="num">Pts</th></tr></thead>
              <tbody>
                {player.history.map((h) => (
                  <tr key={h.eventId}>
                    <td><Link to={`/events/${h.eventId}`}>{h.eventName}</Link><div className="muted" style={{ fontSize: 13 }}>{formatDate(h.date)}</div></td>
                    <td className="num">{h.record}</td>
                    <td className="num">{h.vp}</td>
                    <td style={{ fontWeight: finishRank(h.finish) <= 1 ? 600 : 400, color: h.finish === 'Champion' ? 'var(--brick)' : 'var(--ink)' }}>{h.finish}</td>
                    <td className="num">{h.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>Head to head</h2>
            <div className="card" style={{ padding: '6px 22px' }}>
              {h2h.map((o) => (
                <div key={o.opponent} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 110px', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--paper-2)' }}>
                  <PlayerLink name={o.opponent} style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'none' }} />
                  <span className="mono muted" style={{ fontSize: 13 }}>{o.games} games</span>
                  <div className="h2h-bar" aria-label={`${player.name} won ${o.w}, ${o.opponent} won ${o.l}`}>
                    <span style={{ flex: Math.max(o.w, 0.4), background: 'var(--brick)', color: '#fff' }}>{o.w}</span>
                    <span style={{ flex: Math.max(o.l, 0.4), background: '#DCD3C3' }}>{o.l}</span>
                  </div>
                </div>
              ))}
              <p className="muted" style={{ fontSize: 13, padding: '12px 0' }}>Most-played opponents. Red: games {player.name.split(' ')[0]} won at a shared table. Grey: games they won.</p>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>Points by event</h2>
            <div className="vbars">
              {chrono.map((h) => (
                <div key={h.eventId}>
                  <span className="mono" style={{ fontSize: 12 }}>{h.points}</span>
                  <div className={`b ${h.points === maxPts ? 'hi' : ''}`} style={{ height: `${(h.points / maxPts) * 160}px` }} />
                </div>
              ))}
            </div>
            <div className="vbars-labels">{chrono.map((h) => <span key={h.eventId}>{formatDate(h.date, { month: 'short', year: '2-digit' })}</span>)}</div>
          </div>
        </div>
      </section>

      {shareable && (
        <section className="share-band">
          <div className="wrap">
            <div className="share-card">
              <span className="hex" aria-hidden="true" style={{ position: 'absolute', right: -40, top: -30, width: 180, height: 156, background: 'var(--brick)' }} />
              <span className="mono" style={{ fontSize: 13, letterSpacing: '0.12em', color: 'var(--wheat)', position: 'relative' }}>NYCATAN {shareable.eventName.toUpperCase()} {shareable.season}</span>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 52, lineHeight: 1 }}>{shareable.finish === 'Champion' ? 'Champion.' : shareable.finish === 'Final table' ? 'Final table.' : 'Top 16.'}</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 26, marginTop: 8 }}>{player.name}</div>
                <div className="mono" style={{ color: '#CFC8BB', fontSize: 14, marginTop: 6 }}>Prelims {shareable.record}   {shareable.vp} VP</div>
              </div>
              <span className="mono" style={{ color: '#9A958C', fontSize: 13, position: 'relative' }}>nycatan.com</span>
            </div>
            <div style={{ flex: '1 1 320px', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span className="eyebrow">Auto-generated</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800 }}>Every result becomes a post someone wants to share.</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17 }}>Champion, finalist and top 16 cards are built from the results file. Players post them, which markets the next event.</p>
              <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => drawCard(player, shareable)}>Download card</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
