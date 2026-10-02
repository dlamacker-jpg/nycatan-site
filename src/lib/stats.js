// Turns the two CSVs into everything the site shows.
// Input rows are game-level: one row per player per game (see public/data/games.csv).
import { SEASON_POINTS } from '../content.js';

export const slugify = (name) =>
  name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const FINISH_ORDER = { Champion: 0, 'Final table': 1, Semifinal: 2, Prelims: 3 };
export const finishRank = (f) => FINISH_ORDER[f] ?? 9;

function rankPrelims(records) {
  return records.sort(
    (a, b) => b.wins - a.wins || b.vp - a.vp || b.pct - a.pct || a.player.localeCompare(b.player)
  );
}

function buildEvent(event, games) {
  const prelimGames = games.filter((g) => g.stage === 'prelim');
  const byDayPlayer = new Map();
  const tableTotals = new Map();
  for (const g of prelimGames) {
    const tk = `${g.day}|${g.round}|${g.table}`;
    tableTotals.set(tk, (tableTotals.get(tk) || 0) + g.vp);
  }
  for (const g of prelimGames) {
    const key = `${g.day}|${g.player}`;
    if (!byDayPlayer.has(key)) byDayPlayer.set(key, { player: g.player, day: g.day, wins: 0, vp: 0, tableVp: 0, games: 0 });
    const r = byDayPlayer.get(key);
    r.wins += g.win; r.vp += g.vp; r.games += 1;
    r.tableVp += tableTotals.get(`${g.day}|${g.round}|${g.table}`);
  }
  const dayRecords = [...byDayPlayer.values()].map((r) => ({ ...r, pct: r.tableVp ? r.vp / r.tableVp : 0 }));
  rankPrelims(dayRecords);
  // Best placing across days counts.
  const seen = new Set();
  const standings = [];
  for (const r of dayRecords) {
    if (seen.has(r.player)) continue;
    seen.add(r.player);
    standings.push({ ...r, rank: standings.length + 1 });
  }

  const tablesOf = (stage) => {
    const map = new Map();
    for (const g of games.filter((x) => x.stage === stage)) {
      if (!map.has(g.table)) map.set(g.table, []);
      map.get(g.table).push(g);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([table, seats]) => ({
      table,
      seats: seats.slice().sort((a, b) => b.win - a.win || b.vp - a.vp)
    }));
  };
  const semis = tablesOf('semi');
  const finalTable = tablesOf('final')[0]?.seats || [];

  const finish = new Map();
  standings.forEach((r) => finish.set(r.player, 'Prelims'));
  semis.forEach((t) => t.seats.forEach((s) => finish.set(s.player, 'Semifinal')));
  finalTable.forEach((s) => finish.set(s.player, s.win ? 'Champion' : 'Final table'));

  const champion = finalTable.find((s) => s.win)?.player || null;
  const topGame = prelimGames.reduce((best, g) => (!best || g.vp > best.vp ? g : best), null);

  return { ...event, games, standings, semis, finalTable, finish, champion, topGame, fieldSize: standings.length };
}

export function pointsFor(finish, prelimWins) {
  const base = { Champion: SEASON_POINTS.champion, 'Final table': SEASON_POINTS.finalTable, Semifinal: SEASON_POINTS.semifinal }[finish] || 0;
  return base + prelimWins * SEASON_POINTS.prelimWin + SEASON_POINTS.played;
}

export function buildModel(eventRows, gameRows) {
  const games = gameRows.map((r) => ({
    event_id: r.event_id, stage: r.stage, day: r.day, round: +r.round, table: +r.table,
    seat: +r.seat, player: r.player.trim(), vp: +r.vp, win: +r.win
  }));
  const allEvents = eventRows
    .map((e) => ({ ...e, id: e.event_id, season: +e.season }))
    .sort((a, b) => (a.start_date || '9999').localeCompare(b.start_date || '9999'));

  const byEvent = new Map();
  for (const g of games) {
    if (!byEvent.has(g.event_id)) byEvent.set(g.event_id, []);
    byEvent.get(g.event_id).push(g);
  }
  const completed = allEvents
    .filter((e) => e.status === 'complete' && byEvent.has(e.id))
    .map((e) => buildEvent(e, byEvent.get(e.id)));
  const upcoming = allEvents.filter((e) => e.status !== 'complete');
  const eventsById = new Map(completed.map((e) => [e.id, e]));

  // Player aggregates.
  const players = new Map();
  const getP = (name) => {
    if (!players.has(name)) {
      players.set(name, { name, slug: slugify(name), history: [], games: 0, wins: 0, vp: 0, h2h: new Map() });
    }
    return players.get(name);
  };
  for (const ev of completed) {
    const tables = new Map();
    for (const g of ev.games) {
      const k = `${g.stage}|${g.day}|${g.round}|${g.table}`;
      if (!tables.has(k)) tables.set(k, []);
      tables.get(k).push(g);
      const p = getP(g.player);
      p.games += 1; p.wins += g.win; p.vp += g.vp;
    }
    for (const seats of tables.values()) {
      const winner = seats.find((s) => s.win)?.player;
      for (const a of seats) {
        const pa = getP(a.player);
        for (const b of seats) {
          if (a === b) continue;
          if (!pa.h2h.has(b.player)) pa.h2h.set(b.player, { opponent: b.player, games: 0, w: 0, l: 0 });
          const h = pa.h2h.get(b.player);
          h.games += 1;
          if (winner === a.player) h.w += 1;
          if (winner === b.player) h.l += 1;
        }
      }
    }
    for (const r of ev.standings) {
      const f = ev.finish.get(r.player);
      const evGames = ev.games.filter((g) => g.player === r.player);
      getP(r.player).history.push({
        eventId: ev.id, eventName: ev.name, season: ev.season, date: ev.start_date,
        rank: r.rank, record: `${r.wins}-${r.games - r.wins}`, prelimWins: r.wins,
        vp: evGames.reduce((a, g) => a + g.vp, 0), games: evGames.length,
        finish: f, points: pointsFor(f, r.wins)
      });
    }
  }
  for (const p of players.values()) {
    p.history.sort((a, b) => b.date.localeCompare(a.date));
    p.events = p.history.length;
    p.avgVp = p.games ? p.vp / p.games : 0;
    p.winRate = p.games ? p.wins / p.games : 0;
    p.titles = p.history.filter((h) => h.finish === 'Champion').length;
    p.finals = p.history.filter((h) => finishRank(h.finish) <= 1).length;
    p.top16 = p.history.filter((h) => finishRank(h.finish) <= 2).length;
    p.bestFinish = p.history.reduce((best, h) => (finishRank(h.finish) < finishRank(best) ? h.finish : best), 'Prelims');
  }

  const seasons = [...new Set(allEvents.map((e) => e.season))].sort((a, b) => b - a);
  return { games, completed, upcoming, eventsById, players, seasons };
}

// Aggregate a subset of history (all-time or one season) into leaderboard rows.
export function aggregate(model, season) {
  const rows = [];
  for (const p of model.players.values()) {
    const h = season ? p.history.filter((x) => x.season === season) : p.history;
    if (!h.length) continue;
    const evIds = new Set(h.map((x) => x.eventId));
    const games = model.games.filter((g) => g.player === p.name && evIds.has(g.event_id));
    const wins = games.reduce((a, g) => a + g.win, 0);
    const vp = games.reduce((a, g) => a + g.vp, 0);
    rows.push({
      name: p.name, slug: p.slug, events: h.length, games: games.length, wins,
      winRate: games.length ? wins / games.length : 0, avgVp: games.length ? vp / games.length : 0,
      titles: h.filter((x) => x.finish === 'Champion').length,
      finals: h.filter((x) => finishRank(x.finish) <= 1).length,
      top16: h.filter((x) => finishRank(x.finish) <= 2).length,
      points: h.reduce((a, x) => a + x.points, 0),
      best: h.reduce((b, x) => (finishRank(x.finish) < finishRank(b) ? x.finish : b), 'Prelims')
    });
  }
  return rows;
}

export function seasonStandings(model, season) {
  return aggregate(model, season)
    .sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

// Season points leader after each completed event.
export function leaderTimeline(model) {
  const out = [];
  const running = new Map();
  let currentSeason = null;
  for (const ev of model.completed) {
    if (ev.season !== currentSeason) { running.clear(); currentSeason = ev.season; }
    for (const r of ev.standings) {
      const f = ev.finish.get(r.player);
      running.set(r.player, (running.get(r.player) || 0) + pointsFor(f, r.wins));
    }
    let leader = null; let pts = -1;
    for (const [name, v] of running) if (v > pts) { leader = name; pts = v; }
    out.push({ eventId: ev.id, label: ev.name.split(' ')[0], season: ev.season, leader, points: pts });
  }
  return out;
}

export function toCsv(rows, header) {
  const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
  return [header.join(','), ...rows.map((r) => header.map((h) => esc(r[h] ?? '')).join(','))].join('\n');
}

export function formatDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return 'Date TBA';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
}

export function formatRange(start, end) {
  if (!start) return 'Date TBA';
  if (!end || end === start) return formatDate(start, { month: 'long', day: 'numeric', year: 'numeric' });
  const s = formatDate(start, { month: 'long', day: 'numeric' });
  const [y, , d] = end.split('-').map(Number);
  return `${s} and ${d}, ${y}`;
}
