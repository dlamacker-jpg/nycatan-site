import { Link } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { seasonStandings, formatRange } from '../lib/stats.js';
import { REGISTER_URL, NATIONAL_HONORS, VIDEOS, DAY_STEPS } from '../content.js';
import { PlayerLink, RankHex, PlayIcon, initials } from '../components/bits.jsx';
import { VIS } from '../lib/visibility.js';
import { SHOP_ENABLED, MERCH, PICKUP_NOTE } from '../merch.js';
import { Art } from './Shop.jsx';

export default function Home() {
  const { model } = useData();
  const next = model.upcoming[0];
  const latest = model.completed[model.completed.length - 1];
  const season = latest.season;
  const race = seasonStandings(model, season).slice(0, 8);
  const top = race[0]?.points || 1;
  const recentChamps = model.completed.slice(-4).reverse();
  const totalGames = new Set(model.games.map((g) => `${g.event_id}|${g.stage}|${g.day}|${g.round}|${g.table}`)).size;
  const seasonPlayers = new Set(model.completed.filter((e) => e.season === season).flatMap((e) => e.standings.map((s) => s.player))).size;

  return (
    <>
      <section className="hero">
        <div className="hero-deco" aria-hidden="true">
          <span className="hex" style={{ right: -60, top: -40, width: 260, height: 225, background: 'var(--brick)', opacity: 0.9 }} />
          <span className="hex" style={{ right: 140, top: 70, width: 130, height: 113, background: 'var(--forest)' }} />
          <span className="hex" style={{ right: 60, top: 190, width: 90, height: 78, background: 'var(--wheat)' }} />
        </div>
        <div className="wrap">
          <div>
            <div className="eyebrow" style={{ color: 'var(--wheat)' }}>Next up: {next ? `${next.name}, ${formatRange(next.start_date, next.end_date)}` : 'Schedule coming soon'}</div>
            <h1 style={{ marginTop: 20 }}>Settle up,<br />New York.</h1>
            <p className="hero-lede">Three prelim games. A top 16 cut. One final table. Five events a year, every result in one place.</p>
            <div className="hero-facts">
              <div><div className="fact-label">WHERE</div><div className="fact-main">{next?.venue || 'Brooklyn Game Labs'}</div><div className="fact-sub">{next?.address || '479 7th Ave, Brooklyn'}</div></div>
              <div><div className="fact-label">PRELIMS</div><div className="fact-main">9:30am start</div><div className="fact-sub">Best day counts at qualifiers</div></div>
              <div><div className="fact-label">FINALS</div><div className="fact-main">5pm onward</div><div className="fact-sub">Semis, then one final table</div></div>
            </div>
            <div className="hero-ctas">
              <a className="btn btn-wheat" href={REGISTER_URL}>Register{next ? ` for the ${next.name}` : ''}</a>
              <a className="btn btn-ghost-light" href="#first-timers">First time? Start here</a>
            </div>
          </div>
          <div className="hero-side">
            <div className="dark-card">
              <div className="fact-label">LATEST CHAMPION</div>
              <PlayerLink name={latest.champion} style={{ display: 'block', marginTop: 10, fontFamily: 'var(--display)', fontWeight: 600, fontSize: 28, color: 'var(--paper)', textDecoration: 'none' }} />
              <div className="fact-sub" style={{ marginTop: 6 }}>Won the {latest.name}, {latest.season}</div>
            </div>
            {VIS.seasonRace ? (
              <div className="dark-card">
                <div className="fact-label">{season} SEASON LEADER</div>
                <PlayerLink name={race[0].name} slug={race[0].slug} style={{ display: 'block', marginTop: 10, fontFamily: 'var(--display)', fontWeight: 600, fontSize: 28, color: 'var(--paper)', textDecoration: 'none' }} />
                <div className="fact-sub" style={{ marginTop: 6 }}>{race[0].points} points after {model.completed.filter((e) => e.season === season).length} events</div>
              </div>
            ) : (
              <div className="dark-card">
                <div className="fact-label">NEW HERE?</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 24, marginTop: 10, lineHeight: 1.2 }}>Read the rules and FAQ before your first event.</div>
                <Link to="/faq" style={{ display: 'inline-block', marginTop: 12, color: 'var(--wheat)', fontWeight: 600 }}>Rules and FAQ</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="stat-strip">
          <div><div className="stat-num">5</div><div className="stat-label">tournaments a year</div></div>
          <div><div className="stat-num">{seasonPlayers}</div><div className="stat-label">players in {season}</div></div>
          <div><div className="stat-num">{totalGames.toLocaleString()}</div><div className="stat-label">games on record</div></div>
          <div><div className="stat-num">2</div><div className="stat-label">US national titles won by NYC players</div></div>
        </div>
      </div>

      <section className="wrap section split">
{VIS.seasonRace ? (
        <div>
          <div className="section-head">
            <div><div className="eyebrow">{season} season race</div><h2>Who owns the city</h2></div>
            <Link to="/season" style={{ fontWeight: 600, padding: '12px 0' }}>Full standings</Link>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Rank</th><th>Player</th><th className="num">Events</th><th className="hide-sm" style={{ width: '30%' }}></th><th className="num">Pts</th></tr></thead>
              <tbody>
                {race.map((r) => (
                  <tr key={r.name}>
                    <td><RankHex rank={r.rank} /></td>
                    <td><PlayerLink name={r.name} slug={r.slug} /></td>
                    <td className="num">{r.events}</td>
                    <td className="hide-sm"><div className={`bar ${r.rank === 1 ? 'lead' : ''}`}><span style={{ width: `${(r.points / top) * 100}%` }} /></div></td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
        <div>
          <div className="section-head">
            <div><div className="eyebrow">Recent finals</div><h2>Who made the final table</h2></div>
            <Link to="/events" style={{ fontWeight: 600, padding: '12px 0' }}>All results</Link>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Event</th><th>Champion</th><th className="hide-sm">Finalists</th></tr></thead>
              <tbody>
                {model.completed.slice(-6).reverse().map((e) => (
                  <tr key={e.id}>
                    <td><Link to={`/events/${e.id}`}>{e.name} {e.season}</Link><div className="muted" style={{ fontSize: 13 }}>Hosted by {e.organizer}</div></td>
                    <td><PlayerLink name={e.champion} /></td>
                    <td className="hide-sm" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{e.finalTable.filter((x) => !x.win).map((x) => x.player).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
        <div>
          <div className="section-head">
            <div><div className="eyebrow">Latest results</div><h2>{latest.name}</h2></div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="placeholder" style={{ borderRadius: 0, minHeight: 200 }}>[FINAL TABLE PHOTO]</div>
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="muted">{formatRange(latest.start_date, latest.end_date)} at {latest.venue}. {latest.fieldSize} players.</span>
              {latest.finalTable.map((s) => (
                <div key={s.player} className={`semi-seat ${s.win ? 'win' : ''}`} style={{ background: s.win ? '#F6E3DC' : 'var(--paper)' }}>
                  <PlayerLink name={s.player} /><span className="mono">{s.vp} VP</span>
                </div>
              ))}
              <Link className="btn btn-ghost" to={`/events/${latest.id}`} style={{ marginTop: 6 }}>Full recap and standings</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow">Recent champions</div><h2>Came up at these tables.</h2></div>
            <Link to="/hall-of-fame" style={{ color: 'var(--paper)', fontWeight: 600, padding: '12px 0' }}>Hall of Fame</Link>
          </div>
          <div className="grid-4">
            {recentChamps.map((e) => (
              <div className="champ-card" key={e.id}>
                <span className="hex">{initials(e.champion)}</span>
                <div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--wheat)' }}>{e.name.toUpperCase()} {e.season}</div>
                  <PlayerLink name={e.champion} style={{ display: 'block', marginTop: 6, fontFamily: 'var(--display)', fontWeight: 600, fontSize: 24 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid-3" style={{ marginTop: 20 }}>
            {NATIONAL_HONORS.map((h) => (
              <div key={h.year + h.name} style={{ borderTop: '1px solid #3C6E55', paddingTop: 14 }}>
                <span className="mono" style={{ color: 'var(--wheat)', fontSize: 13 }}>{h.year}</span>{' '}
                <strong>{h.name}</strong>, {h.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="wrap section">
        <div className="section-head">
          <div><div className="eyebrow">Community</div><h2>From the tables</h2></div>
        </div>
        <div className="grid-3">
          <div className="placeholder" style={{ minHeight: 300 }}>[EVENT PHOTO]</div>
          <div className="placeholder" style={{ minHeight: 300, background: '#DCD3C3' }}>[PHOTO: semifinal table]</div>
          <div className="placeholder" style={{ minHeight: 300 }}>[PHOTO: champion with trophy]</div>
        </div>
        <div className="grid-2" style={{ marginTop: 24 }}>
          {VIDEOS.map((v) => (
            <a key={v.url} className="video-link" href={v.url} target="_blank" rel="noreferrer">
              <span className="video-thumb"><PlayIcon /></span>
              <span><strong style={{ display: 'block', fontSize: 17 }}>{v.title}</strong><span className="muted" style={{ fontSize: 14 }}>{v.sub}</span></span>
            </a>
          ))}
        </div>
      </section>

      {SHOP_ENABLED && (
        <section className="wrap section home-shop">
          <div>
            <div className="eyebrow">Shop</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginTop: 8 }}>Rep the tables</h2>
            <p style={{ color: 'var(--ink-2)', marginTop: 12, fontSize: 17 }}>{PICKUP_NOTE}</p>
            <Link className="btn btn-ghost" to="/shop" style={{ marginTop: 20 }}>See the merch</Link>
          </div>
          <div className="thumbs">
            {MERCH.slice(0, 3).map((m) => (
              <Link key={m.id} to="/shop" aria-label={m.name} className="shop-art" style={{ textDecoration: 'none', color: 'var(--ink)', background: '#fff' }}>
                <Art kind={m.art} />
                <span style={{ display: 'block', fontWeight: 600, fontSize: 15, padding: '10px 12px' }}>{m.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="first-timers" className="steps">
        <div className="wrap">
          <div className="section-head"><div><div className="eyebrow">First tournament?</div><h2>The whole day, start to finish</h2></div><Link to="/faq" style={{ fontWeight: 600, padding: '12px 0' }}>Full rules and FAQ</Link></div>
          <div className="grid-5">
            {DAY_STEPS.map((s) => (
              <div className="step" key={s.title}>
                <span className="step-time">{s.time}</span>
                <span className="step-title">{s.title}</span>
                <span style={{ color: 'var(--ink-2)', fontSize: 15 }}>{s.body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
