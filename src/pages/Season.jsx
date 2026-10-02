import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { seasonStandings, formatRange } from '../lib/stats.js';
import { SEASON_POINTS } from '../content.js';
import { PlayerLink, RankHex, Segmented, pct } from '../components/bits.jsx';
import { VIS } from '../lib/visibility.js';

const SORTS = {
  points: (a, b) => b.points - a.points,
  win: (a, b) => b.winRate - a.winRate || b.points - a.points,
  vp: (a, b) => b.avgVp - a.avgVp || b.points - a.points
};

export default function Season() {
  const { model } = useData();
  const { year } = useParams();
  const navigate = useNavigate();
  const season = year ? +year : model.seasons[0];
  const [sort, setSort] = useState('points');
  const rows = useMemo(() => {
    const base = seasonStandings(model, season);
    return base.slice().sort(SORTS[sort]).map((r, i) => ({ ...r, rank: i + 1 }));
  }, [model, season, sort]);
  const events = [...model.completed, ...model.upcoming].filter((e) => e.season === season);
  const done = events.filter((e) => e.status === 'complete').length;
  const minGames = sort === 'points' ? 0 : 6;
  const shown = rows.filter((r) => r.games >= minGames);

  return (
    <div className="wrap">
      <div className="page-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow">{season} season</div>
            <h1>Season standings</h1>
            <p>Every affiliated NYCatan event this year. {done} done{events.length > done ? `, ${events.length - done} to go` : ''}.</p>
          </div>
          <Segmented label="Season" options={model.seasons.map((s) => [s, String(s)])} value={season} onChange={(s) => navigate(`/season/${s}`)} />
        </div>
      </div>

      <div className="grid-5" style={{ marginBottom: 48 }}>
        {events.map((e) => {
          const isNext = e === model.upcoming[0];
          const card = (
            <div style={{ padding: 20, borderRadius: 10, height: '100%', background: isNext ? 'var(--brick)' : e.status === 'complete' ? '#fff' : 'transparent', color: isNext ? '#fff' : 'var(--ink)', border: `1px solid ${isNext ? 'var(--brick)' : 'var(--line)'}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: '0.12em' }}>{e.status === 'complete' ? 'DONE' : isNext ? 'NEXT' : 'UPCOMING'}</span>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 21 }}>{e.name}</span>
              <span style={{ fontSize: 14, opacity: 0.85 }}>{formatRange(e.start_date, e.end_date)}</span>
              {e.champion && <span style={{ fontSize: 14 }}>Won by {e.champion}</span>}
              <span style={{ fontSize: 13, opacity: 0.75 }}>Host: {e.organizer}</span>
            </div>
          );
          return e.status === 'complete'
            ? <Link key={e.id} to={`/events/${e.id}`} style={{ textDecoration: 'none' }}>{card}</Link>
            : <div key={e.id}>{card}</div>;
        })}
      </div>

      {VIS.seasonRace ? (
      <div className="split-8-4">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <h2 style={{ fontSize: 28, fontWeight: 600 }}>Leaderboard</h2>
            <Segmented label="Sort leaderboard" options={[['points', 'Season points'], ['win', 'Win %'], ['vp', 'Avg VP']]} value={sort} onChange={setSort} />
          </div>
          {minGames > 0 && <p className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Minimum {minGames} games to rank.</p>}
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Rank</th><th>Player</th><th className="num">Events</th><th className="num">Wins</th><th className="num">Win %</th><th className="num">Avg VP</th><th className="hide-sm">Best finish</th><th className="num">Pts</th></tr></thead>
              <tbody>
                {shown.slice(0, 40).map((r, i) => (
                  <tr key={r.name}>
                    <td><RankHex rank={i + 1} /></td>
                    <td><PlayerLink name={r.name} slug={r.slug} /></td>
                    <td className="num">{r.events}</td>
                    <td className="num">{r.wins}</td>
                    <td className="num" style={{ fontWeight: sort === 'win' ? 600 : 400 }}>{pct(r.winRate)}</td>
                    <td className="num" style={{ fontWeight: sort === 'vp' ? 600 : 400 }}>{r.avgVp.toFixed(1)}</td>
                    <td className="hide-sm" style={{ color: 'var(--ink-2)' }}>{r.best}</td>
                    <td className="num" style={{ fontWeight: sort === 'points' ? 600 : 400 }}>{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {shown.length > 40 && <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>Top 40 of {shown.length} shown.</p>}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <h3 style={{ fontSize: 22, fontWeight: 600 }}>How season points work</h3>
              <span className="mono" style={{ fontSize: 11, padding: '4px 8px', background: '#F6E3DC', color: 'var(--brick-dark)', borderRadius: 4 }}>PROPOSED</span>
            </div>
            {[
              ['Event champion', SEASON_POINTS.champion], ['Final table', SEASON_POINTS.finalTable], ['Semifinalist', SEASON_POINTS.semifinal],
              ['Each prelim win', SEASON_POINTS.prelimWin], ['Played the event', SEASON_POINTS.played]
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--paper-2)' }}>
                <span>{l}</span><span className="mono" style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 14 }}>Finish points use your best result at the event. Prelim wins count from your best prelim day. Calculated from the results file, so nobody enters points by hand.</p>
          </div>
          <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 12, padding: 28 }}>
            <div className="eyebrow" style={{ color: 'var(--wheat)' }}>Season finale idea</div>
            <p style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 22, lineHeight: 1.2, marginTop: 10 }}>Top 8 in points play an invitational table at the Holiday Cup.</p>
            <p style={{ color: '#CFC8BB', fontSize: 14, marginTop: 10 }}>Gives players a reason to show up to every event, not only the qualifiers.</p>
          </div>
        </aside>
      </div>
      ) : (
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Final tables this season</h2>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Event</th><th>Host</th><th>Champion</th><th className="hide-sm">Finalists</th></tr></thead>
            <tbody>
              {events.filter((e) => e.status === 'complete').map((e) => (
                <tr key={e.id}>
                  <td><Link to={`/events/${e.id}`}>{e.name}</Link></td>
                  <td className="muted">{e.organizer}</td>
                  <td><PlayerLink name={e.champion} /></td>
                  <td className="hide-sm" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{e.finalTable.filter((x) => !x.win).map((x) => x.player).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>Every affiliated NYCatan event counts toward the season, whoever hosts it.</p>
      </div>
      )}
    </div>
  );
}
