# NYCatan site

Results, season standings, player profiles and a Hall of Fame for NYC Catan tournaments.
Every number on the site is calculated in the browser from two CSV files. Nobody edits standings by hand.

**Status: demo.** All player names, scores and past dates in `public/data` are generated sample data.
Real: venue, format, tiebreakers, national honors, the Spring Qualifier 2026 dates, video links.

## Run locally

```
npm install
npm run dev        # http://localhost:5173
```

## Deploy on Railway

1. Push this folder to a GitHub repo.
2. In Railway: New Project > Deploy from GitHub repo > pick the repo.
3. Railway reads `railway.json`: it runs `npm run build`, then `npm start` (Express serving `dist/` on `$PORT`).
4. Settings > Networking > Generate Domain. Add `nycatan.com` there later if Andrew wants it.

Or with the Railway CLI from this folder: `railway login`, `railway init`, `railway up`.

## Adding an event (the whole maintenance job)

1. Add a row to `public/data/events.csv` (or flip an upcoming event's `status` to `complete` and fill its dates).
2. Append that event's games to `public/data/games.csv`.
3. Commit. Railway redeploys and every page updates.

### games.csv format (one row per player per game)

| column   | meaning                                        |
|----------|------------------------------------------------|
| event_id | matches `events.csv`                           |
| stage    | `prelim`, `semi` or `final`                    |
| day      | `Sat` or `Sun` for prelims, blank otherwise    |
| round    | prelim round 1 to 3; `1` for semi and final    |
| table    | table number within that round                 |
| seat     | seat at the table                              |
| player   | display name, spelled the same every event     |
| vp       | victory points scored                          |
| win      | `1` for the table winner, else `0`             |

**Open item:** this is a normalized format, not BCP's exact export. Once we have one real BCP CSV,
a small converter (`scripts/`) maps BCP's columns into this shape. That is the only BCP-specific code.

## Assumptions to confirm with Andrew

- Season points scale (`src/content.js`, `SEASON_POINTS`) is a proposal: champion 100, final table 60, semifinal 35, 10 per prelim win, 5 for playing.
- "Best day counts" applies to two-day qualifiers; one-day events have a single prelim day.
- Player identity is the name string. If BCP exposes a stable player ID, switch to that.
