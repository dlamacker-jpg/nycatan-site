// Generates SAMPLE data shaped like a game-level tournament export.
// Every player name, score and past date here is invented for the demo.
// Real facts (venue, format, the Spring Qualifier 2026 dates) are noted inline.
// Run: node scripts/generate-sample.mjs
import { writeFileSync } from 'node:fs';

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261002);
const gauss = () => {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Headliners get higher skill so the demo has recognisable storylines.
const headliners = [
  ['Priya Castellanos', 1.5], ['Marcus Delgado', 1.4], ['Hannah Ostrowski', 1.35],
  ['Theo Barnwell', 1.3], ['Jun Nakashima', 1.2], ['Dani Achterberg', 1.0],
  ['Samir Haddad', 1.0], ['Leah Fontaine', 0.9], ['Omar Whitfield', 0.8],
  ['Grace Liang', 0.8], ['Felix Moreau', 0.7], ['Keisha Brandt', 0.6],
  ['Ravi Sundaram', 0.5], ['Nora Kessler', 0.5], ['Diego Varela', 0.4], ['Ellie Park', 0.4]
];
const first = ['Alex', 'Bianca', 'Caleb', 'Dmitri', 'Esme', 'Farah', 'Gus', 'Hiro', 'Ines', 'Jonah', 'Kemi', 'Luca', 'Maya', 'Nico', 'Odette', 'Pablo', 'Quinn', 'Rosa', 'Seth', 'Tova', 'Uri', 'Vera', 'Wes', 'Xochi', 'Yusuf', 'Zoe', 'Arjun', 'Bree', 'Cyrus', 'Delia', 'Emil', 'Fern', 'Gideon', 'Hana', 'Idris', 'Juno', 'Kofi', 'Lena', 'Mateo', 'Nadia', 'Orin', 'Pia', 'Rafael', 'Sana'];
const last = ['Abernathy', 'Bianchi', 'Coleman', 'Dubois', 'Engel', 'Ferreira', 'Gallo', 'Hartley', 'Iwata', 'Jensen', 'Kowalski', 'Lindqvist', 'Marsh', 'Novak', 'Okafor', 'Pruitt', 'Quintero', 'Rasmussen', 'Sato', 'Tremblay', 'Ueda', 'Vance', 'Whitaker', 'Yilmaz', 'Zeller', 'Adebayo', 'Brennan', 'Castillo', 'Duarte', 'Ellison', 'Fitzgerald', 'Greer', 'Holm', 'Ibarra', 'Joshi', 'Kaplan', 'Lowery', 'Mendez', 'Nakamura', 'Ortega', 'Patel', 'Reyes', 'Silva', 'Toth'];

const players = headliners.map(([name, skill]) => ({ name, skill, reg: 0.62 + rand() * 0.33 }));
const used = new Set(players.map((p) => p.name));
while (players.length < 150) {
  const n = first[Math.floor(rand() * first.length)] + ' ' + last[Math.floor(rand() * last.length)];
  if (used.has(n)) continue;
  used.add(n);
  players.push({ name: n, skill: gauss() * 0.7, reg: 0.2 + rand() * 0.55 });
}

const VENUE = 'Brooklyn Game Labs'; // real: NYCatan's usual venue
const ADDRESS = '479 7th Ave, Brooklyn, NY 11215'; // real
// Past dates are SAMPLE except Spring Qualifier 2026 (real: April 18-19, 2026).
const events = [
  ['2024-spring', 'Spring Qualifier', 2024, '2024-04-13', '2024-04-14', 'Qualifier'],
  ['2024-summer', 'Summer Open', 2024, '2024-07-20', '2024-07-20', 'Open'],
  ['2024-fall', 'Fall Qualifier', 2024, '2024-10-19', '2024-10-20', 'Qualifier'],
  ['2024-holiday', 'Holiday Cup', 2024, '2024-12-14', '2024-12-14', 'Cup'],
  ['2025-winter', 'Winter Open', 2025, '2025-01-25', '2025-01-25', 'Open'],
  ['2025-spring', 'Spring Qualifier', 2025, '2025-04-12', '2025-04-13', 'Qualifier'],
  ['2025-summer', 'Summer Open', 2025, '2025-07-19', '2025-07-19', 'Open'],
  ['2025-fall', 'Fall Qualifier', 2025, '2025-10-18', '2025-10-19', 'Qualifier'],
  ['2025-holiday', 'Holiday Cup', 2025, '2025-12-13', '2025-12-13', 'Cup'],
  ['2026-winter', 'Winter Qualifier', 2026, '2026-01-24', '2026-01-25', 'Qualifier'],
  ['2026-spring', 'Spring Qualifier', 2026, '2026-04-18', '2026-04-19', 'Qualifier'],
  ['2026-summer', 'Summer Open', 2026, '2026-07-18', '2026-07-18', 'Open']
];
const upcoming = [
  ['2026-fall', 'Fall Qualifier', 2026, '', '', 'Qualifier'],
  ['2026-holiday', 'Holiday Cup', 2026, '', '', 'Cup']
];

function playGame(seats) {
  const scored = seats.map((p) => ({ p, s: p.skill + gauss() * 1.25 }));
  const top = scored.reduce((a, b) => (b.s > a.s ? b : a));
  const mean = scored.reduce((a, b) => a + b.s, 0) / scored.length;
  return scored.map(({ p, s }) => {
    if (p === top.p) return { p, vp: rand() < 0.12 ? 11 : 10, win: 1 };
    const vp = Math.max(2, Math.min(9, Math.round(6 + 1.4 * (s - mean) + gauss() * 0.9)));
    return { p, vp, win: 0 };
  });
}

const rows = [];
function addGame(eventId, stage, day, round, table, result) {
  result.forEach((r, i) => rows.push({ event_id: eventId, stage, day, round, table, seat: i + 1, player: r.p.name, vp: r.vp, win: r.win }));
}

for (const [id, , , , , type] of events) {
  const twoDay = type === 'Qualifier';
  const attendees = shuffle(players.filter((p) => rand() < p.reg));
  const days = twoDay ? ['Sat', 'Sun'] : ['Sat'];
  const byDay = { Sat: [], Sun: [] };
  attendees.forEach((p, i) => {
    const d = twoDay ? days[i % 2] : 'Sat';
    byDay[d].push(p);
    if (twoDay && rand() < 0.15) byDay[d === 'Sat' ? 'Sun' : 'Sat'].push(p); // some play both days
  });
  const dayRecords = [];
  for (const d of days) {
    let field = byDay[d];
    field = field.slice(0, Math.floor(field.length / 4) * 4);
    const rec = new Map(field.map((p) => [p.name, { p, day: d, wins: 0, vp: 0, pct: 0 }]));
    for (let round = 1; round <= 3; round++) {
      const order = shuffle(field);
      for (let t = 0; t < order.length / 4; t++) {
        const res = playGame(order.slice(t * 4, t * 4 + 4));
        const total = res.reduce((a, b) => a + b.vp, 0);
        res.forEach((r) => { const x = rec.get(r.p.name); x.wins += r.win; x.vp += r.vp; x.pct += r.vp / total; });
        addGame(id, 'prelim', d, round, t + 1, res);
      }
    }
    dayRecords.push(...rec.values());
  }
  // Official CATAN tiebreakers: wins, total VP, then summed per-game VP%. Best placing across days counts.
  dayRecords.sort((a, b) => b.wins - a.wins || b.vp - a.vp || b.pct - a.pct || a.p.name.localeCompare(b.p.name));
  const seen = new Set();
  const cut = [];
  for (const r of dayRecords) {
    if (seen.has(r.p.name)) continue;
    seen.add(r.p.name);
    if (cut.length < 16) cut.push(r.p);
  }
  // Snake seed into 4 semifinal tables.
  const tables = [[], [], [], []];
  cut.forEach((p, i) => { const row = Math.floor(i / 4); const col = i % 4; tables[row % 2 === 0 ? col : 3 - col].push(p); });
  const finalists = [];
  tables.forEach((t, i) => {
    const res = playGame(t);
    addGame(id, 'semi', '', 1, i + 1, res);
    finalists.push(res.find((r) => r.win).p);
  });
  addGame(id, 'final', '', 1, 1, playGame(finalists));
}

const csv = (header, list) => [header.join(','), ...list.map((r) => header.map((h) => {
  const v = r[h] ?? '';
  return /[",]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v;
}).join(','))].join('\n') + '\n';

writeFileSync('public/data/games.csv', csv(['event_id', 'stage', 'day', 'round', 'table', 'seat', 'player', 'vp', 'win'], rows));
// SAMPLE host assignment. Affiliated events from several organizers count toward one season.
const hostFor = (type) => (type === 'Qualifier' ? 'Andrew' : type === 'Open' ? 'Tony' : 'Demar');
const evHeader = ['event_id', 'name', 'season', 'start_date', 'end_date', 'type', 'organizer', 'venue', 'address', 'status', 'bcp_url'];
writeFileSync('public/data/events.csv', csv(evHeader, [
  ...events.map(([event_id, name, season, start_date, end_date, type]) => ({ event_id, name, season, start_date, end_date, type, organizer: hostFor(type), venue: VENUE, address: ADDRESS, status: 'complete', bcp_url: '' })),
  ...upcoming.map(([event_id, name, season, start_date, end_date, type]) => ({ event_id, name, season, start_date, end_date, type, organizer: hostFor(type), venue: VENUE, address: ADDRESS, status: 'upcoming', bcp_url: '' }))
]));
console.log(`games.csv: ${rows.length} rows, events.csv: ${events.length + upcoming.length} events`);
