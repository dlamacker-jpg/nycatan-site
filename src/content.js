// Hand-edited site content. Everything here is real (from nycatan.com) unless marked.

export const REGISTER_URL = 'https://www.nycatan.com/enter-now';

// PROPOSED scale. Andrew sets the real numbers.
export const SEASON_POINTS = {
  champion: 100,
  finalTable: 60,
  semifinal: 35,
  prelimWin: 10,
  played: 5
};

export const NATIONAL_HONORS = [
  { year: '2024', name: 'Bo Peng', title: 'Americas Champion' },
  { year: '2022', name: 'Eric Freeman', title: 'US National Champion' },
  { year: '2021', name: 'Bo Peng', title: 'US National Champion' }
];

export const VIDEOS = [
  {
    url: 'https://www.youtube.com/watch?v=tyY8n73P9AI',
    title: 'What a NYCatan tournament is actually like',
    sub: 'YouTuber DyLighted plays his first one'
  },
  {
    url: 'https://www.youtube.com/watch?v=zxufGZ_OeII&t=18555s',
    title: '2025 US National Final',
    sub: 'Andrew at the final table'
  }
];

export const DAY_STEPS = [
  { time: '9:30am', title: 'Check in, find your seat', body: 'Your table and seat show up in the BCP app. Bring ID and proof of US residency. Players must be 18+.' },
  { time: 'All day', title: 'Three prelim games', body: 'Four players per table. Ranked by wins, then total VP, then your share of table VP.' },
  { time: 'About 4:30pm', title: 'The cut', body: 'Top 16 across both prelim days advance. Your best day is the one that counts.' },
  { time: '5:00pm', title: 'Semifinals', body: 'Four tables of four. Each table winner moves on.' },
  { time: 'Evening', title: 'The final', body: 'One game. At qualifiers, the winner earns a seat at the CATAN Regional Championship.' }
];

// What the public site shows. Off by default after community feedback:
// season ranks and career win rates can drive "rep blocking" (tables ganging up on known
// strong players) and discourage players who rank low. Winners and finalists are always shown.
// Organizers can preview everything with ?show=all (footer link).
export const VISIBILITY = {
  seasonRace: false, // season points table and leader chart
  performanceStats: false, // win rate, average VP, prelim records on profiles and Hall of Fame
  headToHead: false, // opponent records on player profiles
  fullStandings: false // event pages list every player instead of only the top 16
};

export const OFFICIAL_RULES_URL = 'https://catanevents.com/cnc-rules';
