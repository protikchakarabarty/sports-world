import { getTable, getCompetitions } from './providers/providerManager';
import { getWomenTable } from './footballApi';
import type { CompetitionInfo } from './footballApi';
import type { StandingEntry } from './footballApi';

export interface ClubRankingEntry {
  rank: number;
  club: string;
  clubLogo: string;
  country: string;
  countryFlag: string;
  league: string;
  leagueCode: string;
  ratingScore: number;
  ppg: number;
  position: number;
  previousRank: number;
  rankChange: 'up' | 'down' | 'same';
}

interface LeagueMeta {
  code: string;
  name: string;
  country: string;
  flag: string;
  weight: number;
}

const COUNTRY_FLAGS: Record<string, string> = {
  England: 'gb-eng', Spain: 'es', Germany: 'de', Italy: 'it',
  France: 'fr', Netherlands: 'nl', Portugal: 'pt', Brazil: 'br',
  Argentina: 'ar', Belgium: 'be', Turkey: 'tr', Scotland: 'gb-sct',
  Austria: 'at', Switzerland: 'ch', Greece: 'gr', Russia: 'ru',
  Ukraine: 'ua', Czech: 'cz', Croatia: 'hr', Denmark: 'dk',
  Poland: 'pl', Sweden: 'se', Norway: 'no', 'Saudi Arabia': 'sa',
  'United Arab Emirates': 'ae', Qatar: 'qa', China: 'cn',
  Japan: 'jp', 'South Korea': 'kr', Australia: 'au', Mexico: 'mx',
  USA: 'us', Canada: 'ca', Chile: 'cl', Colombia: 'co',
  Peru: 'pe', Uruguay: 'uy', Paraguay: 'py', Ecuador: 'ec',
  Bolivia: 'bo', Venezuela: 've', Egypt: 'eg', Morocco: 'ma',
  Tunisia: 'tn', Algeria: 'dz', Nigeria: 'ng', 'South Africa': 'za',
  Ghana: 'gh', Senegal: 'sn', 'Ivory Coast': 'ci', Cameroon: 'cm',
  Mali: 'ml', Congo: 'cd', Zambia: 'zm',
};

const KNOWN_WEIGHTS: Record<string, number> = {
  PL: 1.0, PD: 0.95, BL1: 0.90, SA: 0.85, FL1: 0.80,
  DED: 0.65, PPL: 0.60, ELC: 0.55,
  BSA: 0.50, 'Brasileirão': 0.50, 'Brazilian': 0.50,
  'Super Lig': 0.50, 'Süper Lig': 0.50,
  'Primeira Liga': 0.60, 'Liga Portugal': 0.60,
  'Jupiler': 0.50, 'Belgian': 0.50,
  'Championship': 0.55, 'League One': 0.35, 'League Two': 0.25,
  '2. Bundesliga': 0.40, 'Segunda': 0.35, 'Serie B': 0.35,
  'Ligue 2': 0.35, 'Eerste': 0.30,
};

const CUP_PATTERNS = ['cup', 'play-off', 'playoff', 'final', 'super cup', 'supercup', 'world cup', 'champions league', 'europa league', 'conference league', 'club world', 'national', 'international', 'friendly', 'pre-season', 'tournament'];

const PREV_CACHE_KEY = 'sw_club_rankings_prev';

interface CacheEntry {
  rankings: ClubRankingEntry[];
  timestamp: number;
}

function loadCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(PREV_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function saveCache(rankings: ClubRankingEntry[]): void {
  try {
    localStorage.setItem(PREV_CACHE_KEY, JSON.stringify({ rankings, timestamp: Date.now() }));
  } catch {
    console.warn('[ClubRankings] Failed to save cache');
  }
}

function isCupCompetition(name: string): boolean {
  const lower = name.toLowerCase();
  return CUP_PATTERNS.some((p) => lower.includes(p));
}

function resolveCountryFlag(area: string, code: string): string {
  if (COUNTRY_FLAGS[area]) return COUNTRY_FLAGS[area];
  const byCode = Object.entries(COUNTRY_FLAGS).find(([k]) => code.toLowerCase().includes(k.toLowerCase()) || area.toLowerCase().includes(k.toLowerCase()));
  return byCode?.[1] ?? '';
}

function resolveWeight(code: string, name: string): number {
  if (KNOWN_WEIGHTS[code]) return KNOWN_WEIGHTS[code];
  const lower = name.toLowerCase();
  if (lower.includes('premier') || lower.includes('primeira')) return 1.0;
  if (lower.includes('la liga') || lower.includes('laliga')) return 0.95;
  if (lower.includes('bundesliga') && !lower.includes('2.')) return 0.90;
  if (lower.includes('serie a') && !lower.includes('serie b')) return 0.85;
  if (lower.includes('ligue 1')) return 0.80;
  if (lower.includes('eredivisie')) return 0.65;
  if (lower.includes('championship') || lower.includes('super lig') || lower.includes('jupiler')) return 0.50;
  if (lower.includes('league one')) return 0.35;
  if (lower.includes('league two') || lower.includes('segunda') || lower.includes('serie b') || lower.includes('2. bundesliga')) return 0.30;
  return 0.25;
}

function toClubEntry(
  s: StandingEntry,
  league: LeagueMeta,
  prevMap: Map<string, number>,
  index: number,
): ClubRankingEntry {
  const ppg = s.played > 0 ? s.points / s.played : 0;
  const rawScore = ppg * league.weight * 20;
  const key = `${s.team}|${league.code}`;
  const previousRank = prevMap.get(key) ?? index + 1;

  let rankChange: 'up' | 'down' | 'same' = 'same';
  if (previousRank < index + 1) rankChange = 'down';
  else if (previousRank > index + 1) rankChange = 'up';

  return {
    rank: index + 1,
    club: s.team,
    clubLogo: s.teamCrest ?? '',
    country: league.country,
    countryFlag: league.flag,
    league: league.name,
    leagueCode: league.code,
    ratingScore: Math.round(rawScore * 10) / 10,
    ppg,
    position: s.position,
    previousRank,
    rankChange,
  };
}

const WOMENS_KNOWN_WEIGHTS: Record<string, number> = {
  WSL: 1.0, NWSL: 0.95, LF: 0.90, FBL: 0.85, SAF: 0.80, D1F: 0.75,
  UWCL: 0.70, WWC: 0.65, WCH: 0.55, WNL: 0.50, WEURO: 0.50,
};

function resolveWomenWeight(code: string, name: string): number {
  if (WOMENS_KNOWN_WEIGHTS[code]) return WOMENS_KNOWN_WEIGHTS[code];
  const lower = name.toLowerCase();
  if (lower.includes('super league') || lower.includes('wsl')) return 1.0;
  if (lower.includes('nwsl')) return 0.95;
  if (lower.includes('liga f') || lower.includes('primera')) return 0.90;
  if (lower.includes('frauen') || lower.includes('bundesliga')) return 0.85;
  if (lower.includes('femminile') || lower.includes('serie a')) return 0.80;
  if (lower.includes('féminine') || lower.includes('division 1')) return 0.75;
  if (lower.includes('champions league') || lower.includes('uwcl')) return 0.70;
  if (lower.includes('world cup')) return 0.65;
  return 0.25;
}

export async function getClubRankings(): Promise<ClubRankingEntry[]> {
  const prevCache = loadCache();
  const prevMap = new Map<string, number>();
  if (prevCache) {
    for (const r of prevCache.rankings) {
      prevMap.set(`${r.club}|${r.leagueCode}`, r.rank);
    }
  }

  const { competitions } = await getCompetitions();
  const leagues = competitions.filter((c) => !isCupCompetition(c.name));

  if (leagues.length === 0) {
    console.warn('[ClubRankings] No leagues discovered from provider');
    return [];
  }

  console.log(`[ClubRankings] Discovered ${leagues.length} leagues from provider`);

  const all: ClubRankingEntry[] = [];
  const seenClubs = new Map<string, number>();

  for (const league of leagues) {
    try {
      const result = await getTable(league.code);
      const standings = result.standings;
      if (!standings || standings.length === 0) {
        console.log(`[ClubRankings] ${league.code.padEnd(6)} | ${league.name.padEnd(30)} | 0 teams (no standings)`);
        continue;
      }

      const meta: LeagueMeta = {
        code: league.code,
        name: league.name,
        country: league.area || '',
        flag: resolveCountryFlag(league.area || '', league.code),
        weight: resolveWeight(league.code, league.name),
      };

      let added = 0;
      for (const s of standings) {
        const dedupKey = `${s.team}|${league.code}`;
        if (seenClubs.has(dedupKey)) continue;
        seenClubs.set(dedupKey, all.length);
        all.push(toClubEntry(s, meta, prevMap, all.length));
        added++;
      }

      console.log(`[ClubRankings] ${league.code.padEnd(6)} | ${league.name.padEnd(30)} | ${added} clubs | weight: ${meta.weight}`);
    } catch {
      console.warn(`[ClubRankings] ${league.code.padEnd(6)} | ${league.name.padEnd(30)} | SKIPPED (fetch failed)`);
    }
  }

  all.sort((a, b) => b.ratingScore - a.ratingScore);
  const ranked = all.map((e, i) => ({ ...e, rank: i + 1 })).slice(0, 100);

  console.log(`[ClubRankings] === SUMMARY ===`);
  console.log(`[ClubRankings] Total leagues processed: ${leagues.length}`);
  console.log(`[ClubRankings] Total clubs in ranking: ${ranked.length}`);
  console.log(`[ClubRankings] Top 5: ${ranked.slice(0, 5).map((r) => `${r.club} (${r.ratingScore})`).join(', ')}`);

  saveCache(ranked);
  return ranked;
}

const WOMENS_RANKINGS_PREV_CACHE_KEY = 'sw_women_club_rankings_prev';

function loadWomenCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(WOMENS_RANKINGS_PREV_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function saveWomenCache(rankings: ClubRankingEntry[]): void {
  try {
    localStorage.setItem(WOMENS_RANKINGS_PREV_CACHE_KEY, JSON.stringify({ rankings, timestamp: Date.now() }));
  } catch {
    console.warn('[ClubRankings] Failed to save women cache');
  }
}

const WOMENS_FDO_CODES = ['WSL', 'FFL', 'D1F'];

const WOMENS_LEAGUE_META: Record<string, { name: string; country: string; flag: string }> = {
  WSL:   { name: 'Women\'s Super League',    country: 'England', flag: 'gb-eng' },
  NWSL:  { name: 'NWSL',                     country: 'USA',     flag: 'us' },
  LF:    { name: 'Liga F',                   country: 'Spain',   flag: 'es' },
  FFL:   { name: 'Frauen Bundesliga',         country: 'Germany', flag: 'de' },
  SAF:   { name: 'Serie A Femminile',         country: 'Italy',   flag: 'it' },
  D1F:   { name: 'Division 1 Féminine',      country: 'France',  flag: 'fr' },
  WCH:   { name: 'Women\'s Championship',    country: 'England', flag: 'gb-eng' },
  UWCL:  { name: 'UEFA Women\'s Champions League', country: 'Europe', flag: 'eu' },
};

const WOMEN_CLUB_LOGO_MAP: Record<string, string> = {
  // WSL
  'Chelsea Women':         'https://crests.football-data.org/61.png',
  'Arsenal Women':         'https://crests.football-data.org/57.png',
  'Manchester City Women': 'https://crests.football-data.org/65.png',
  'Manchester United Women': 'https://crests.football-data.org/66.png',
  'Liverpool Women':       'https://crests.football-data.org/64.png',
  'Tottenham Women':       'https://crests.football-data.org/73.png',
  'Aston Villa Women':     'https://crests.football-data.org/58.png',
  'Everton Women':         'https://crests.football-data.org/62.png',
  'Brighton Women':        'https://crests.football-data.org/397.png',
  'Leicester City Women':  'https://crests.football-data.org/338.png',
  'West Ham Women':        'https://crests.football-data.org/563.png',
  'Crystal Palace Women':  'https://crests.football-data.org/354.png',

  // Liga F
  'Barcelona Femení':      'https://crests.football-data.org/81.png',
  'Real Madrid Femení':    'https://crests.football-data.org/86.png',
  'Atlético Madrid Women': 'https://crests.football-data.org/78.png',
  'Sevilla Women':         'https://crests.football-data.org/559.png',
  'Valencia Women':        'https://crests.football-data.org/95.png',
  'Athletic Club Women':   'https://crests.football-data.org/77.png',
  'Real Sociedad Women':   'https://crests.football-data.org/92.png',
  'Levante Women':         'https://crests.football-data.org/88.png',

  // Frauen Bundesliga
  'FC Bayern Women':       'https://crests.football-data.org/5.png',
  'VfL Wolfsburg Women':   'https://crests.football-data.org/504.png',
  'Eintracht Frankfurt Women': 'https://crests.football-data.org/182.png',
  'Bayer Leverkusen Women': 'https://crests.football-data.org/3.png',
  'Borussia Dortmund Women': 'https://crests.football-data.org/4.png',
  'RB Leipzig Women':      'https://crests.football-data.org/721.png',
  'TSG Hoffenheim Women':  'https://crests.football-data.org/546.png',

  // Serie A Femminile
  'AS Roma Women':         'https://crests.football-data.org/100.png',
  'Juventus Women':        'https://crests.football-data.org/109.png',
  'AC Milan Women':        'https://crests.football-data.org/98.png',
  'Inter Women':           'https://crests.football-data.org/108.png',
  'Fiorentina Women':      'https://crests.football-data.org/99.png',
  'Lazio Women':           'https://crests.football-data.org/110.png',

  // Division 1 Féminine
  'Lyon Women':            'https://crests.football-data.org/104.png',
  'Paris Saint-Germain Women': 'https://crests.football-data.org/524.png',
  'Paris FC Women':        'https://crests.football-data.org/548.png',

  // Liga BPI (Portugal)
  'SL Benfica Women':      'https://crests.football-data.org/1900.png',

  // Eredivisie Vrouwen
  'Ajax Vrouwen':          'https://crests.football-data.org/1911.png',
  'PSV Vrouwen':           'https://crests.football-data.org/1903.png',
  'FC Twente Vrouwen':     'https://crests.football-data.org/383.png',

  // NWSL
  'Portland Thorns':       'https://upload.wikimedia.org/wikipedia/en/4/44/Portland_Thorns_FC_logo.svg',
  'NJ/NY Gotham FC':       'https://upload.wikimedia.org/wikipedia/en/8/8b/NJ_NY_Gotham_FC_logo.svg',
  'San Diego Wave':        'https://upload.wikimedia.org/wikipedia/en/6/6a/San_Diego_Wave_FC_logo.svg',
  'Orlando Pride':         'https://upload.wikimedia.org/wikipedia/en/d/d0/Orlando_Pride_logo.svg',
  'Kansas City Current':   'https://upload.wikimedia.org/wikipedia/en/1/1f/Kansas_City_Current_logo.svg',
  'Chicago Red Stars':     'https://upload.wikimedia.org/wikipedia/en/0/0a/Chicago_Red_Stars_logo.svg',
  'North Carolina Courage': 'https://upload.wikimedia.org/wikipedia/en/1/16/North_Carolina_Courage_logo.svg',
  'Angel City FC':         'https://upload.wikimedia.org/wikipedia/en/4/40/Angel_City_FC_logo.svg',
  'Racing Louisville':     'https://upload.wikimedia.org/wikipedia/en/4/40/Racing_Louisville_FC_logo.svg',
  'Seattle Reign':         'https://upload.wikimedia.org/wikipedia/en/d/dc/Seattle_Reign_FC_logo.svg',
  'Utah Royals':           'https://upload.wikimedia.org/wikipedia/en/6/6e/Utah_Royals_FC_logo.svg',
  'Houston Dash':          'https://upload.wikimedia.org/wikipedia/en/9/98/Houston_Dash_logo.svg',

  // Damallsvenskan
  'FC Rosengård':          'https://upload.wikimedia.org/wikipedia/commons/c/cf/FC_Roseng%C3%A5rd_logo.svg',

  // Other women-specific
  'BK Häcken Women':       'https://upload.wikimedia.org/wikipedia/commons/4/46/BK_H%C3%A4cken_logo.svg',
};

function resolveWomenClubLogo(apiCrest: string | undefined | null, clubName: string): string {
  if (apiCrest) return apiCrest;
  return WOMEN_CLUB_LOGO_MAP[clubName] ?? '';
}

function calcGoalDiffBonus(gd: number, weight: number): number {
  return Math.max(0, (gd / 10) * weight);
}

function calcFormBonus(form: string | undefined, weight: number): number {
  if (!form) return 0;
  const results = form.split('').filter((c) => c === 'W' || c === 'D' || c === 'L');
  if (results.length === 0) return 0;
  const points = results.reduce((sum, r) => sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  const formPpg = points / results.length;
  return formPpg * weight * 5;
}

function staticLogo(club: string): string {
  return WOMEN_CLUB_LOGO_MAP[club] ?? '';
}

const STATIC_WOMENS_CLUBS: ClubRankingEntry[] = [
  { rank: 1,  club: 'Barcelona Femení',    clubLogo: staticLogo('Barcelona Femení'),    country: 'Spain',   countryFlag: 'es', league: 'Liga F',                     leagueCode: 'LF',  ratingScore: 98.5, ppg: 2.8, position: 1, previousRank: 1, rankChange: 'same' },
  { rank: 2,  club: 'Chelsea Women',        clubLogo: staticLogo('Chelsea Women'),        country: 'England', countryFlag: 'gb-eng', league: 'Women\'s Super League',  leagueCode: 'WSL', ratingScore: 95.2, ppg: 2.7, position: 1, previousRank: 2, rankChange: 'same' },
  { rank: 3,  club: 'Lyon Women',           clubLogo: staticLogo('Lyon Women'),           country: 'France',  countryFlag: 'fr', league: 'Division 1 Féminine',     leagueCode: 'D1F', ratingScore: 93.0, ppg: 2.6, position: 1, previousRank: 3, rankChange: 'same' },
  { rank: 4,  club: 'Arsenal Women',        clubLogo: staticLogo('Arsenal Women'),        country: 'England', countryFlag: 'gb-eng', league: 'Women\'s Super League',  leagueCode: 'WSL', ratingScore: 90.1, ppg: 2.5, position: 2, previousRank: 4, rankChange: 'same' },
  { rank: 5,  club: 'VfL Wolfsburg Women',  clubLogo: staticLogo('VfL Wolfsburg Women'),  country: 'Germany', countryFlag: 'de', league: 'Frauen Bundesliga',       leagueCode: 'FFL', ratingScore: 88.3, ppg: 2.5, position: 1, previousRank: 5, rankChange: 'same' },
  { rank: 6,  club: 'FC Bayern Women',      clubLogo: staticLogo('FC Bayern Women'),      country: 'Germany', countryFlag: 'de', league: 'Frauen Bundesliga',       leagueCode: 'FFL', ratingScore: 86.7, ppg: 2.4, position: 2, previousRank: 6, rankChange: 'same' },
  { rank: 7,  club: 'Paris Saint-Germain Women', clubLogo: staticLogo('Paris Saint-Germain Women'), country: 'France', countryFlag: 'fr', league: 'Division 1 Féminine', leagueCode: 'D1F', ratingScore: 84.5, ppg: 2.3, position: 2, previousRank: 7, rankChange: 'same' },
  { rank: 8,  club: 'Manchester City Women', clubLogo: staticLogo('Manchester City Women'), country: 'England', countryFlag: 'gb-eng', league: 'Women\'s Super League', leagueCode: 'WSL', ratingScore: 82.9, ppg: 2.2, position: 3, previousRank: 8, rankChange: 'same' },
  { rank: 9,  club: 'AS Roma Women',        clubLogo: staticLogo('AS Roma Women'),        country: 'Italy',   countryFlag: 'it', league: 'Serie A Femminile',       leagueCode: 'SAF', ratingScore: 80.2, ppg: 2.3, position: 1, previousRank: 9, rankChange: 'same' },
  { rank: 10, club: 'SL Benfica Women',     clubLogo: staticLogo('SL Benfica Women'),     country: 'Portugal',countryFlag: 'pt', league: 'Liga BPI',                leagueCode: 'LBP', ratingScore: 78.0, ppg: 2.4, position: 1, previousRank: 10, rankChange: 'same' },
  { rank: 11, club: 'Juventus Women',       clubLogo: staticLogo('Juventus Women'),       country: 'Italy',   countryFlag: 'it', league: 'Serie A Femminile',       leagueCode: 'SAF', ratingScore: 76.8, ppg: 2.1, position: 2, previousRank: 11, rankChange: 'same' },
  { rank: 12, club: 'Manchester United Women', clubLogo: staticLogo('Manchester United Women'), country: 'England', countryFlag: 'gb-eng', league: 'Women\'s Super League', leagueCode: 'WSL', ratingScore: 75.4, ppg: 2.0, position: 4, previousRank: 12, rankChange: 'same' },
  { rank: 13, club: 'Real Madrid Femení',   clubLogo: staticLogo('Real Madrid Femení'),   country: 'Spain',   countryFlag: 'es', league: 'Liga F',                  leagueCode: 'LF',  ratingScore: 74.1, ppg: 2.0, position: 2, previousRank: 13, rankChange: 'same' },
  { rank: 14, club: 'Paris FC Women',       clubLogo: staticLogo('Paris FC Women'),       country: 'France',  countryFlag: 'fr', league: 'Division 1 Féminine',     leagueCode: 'D1F', ratingScore: 72.5, ppg: 1.9, position: 3, previousRank: 14, rankChange: 'same' },
  { rank: 15, club: 'NJ/NY Gotham FC',      clubLogo: staticLogo('NJ/NY Gotham FC'),      country: 'USA',     countryFlag: 'us', league: 'NWSL',                    leagueCode: 'NWSL', ratingScore: 71.0, ppg: 1.9, position: 1, previousRank: 15, rankChange: 'same' },
  { rank: 16, club: 'San Diego Wave',       clubLogo: staticLogo('San Diego Wave'),       country: 'USA',     countryFlag: 'us', league: 'NWSL',                    leagueCode: 'NWSL', ratingScore: 69.8, ppg: 1.8, position: 2, previousRank: 16, rankChange: 'same' },
  { rank: 17, club: 'Eintracht Frankfurt Women', clubLogo: staticLogo('Eintracht Frankfurt Women'), country: 'Germany', countryFlag: 'de', league: 'Frauen Bundesliga', leagueCode: 'FFL', ratingScore: 68.3, ppg: 1.8, position: 3, previousRank: 17, rankChange: 'same' },
  { rank: 18, club: 'Portland Thorns',      clubLogo: staticLogo('Portland Thorns'),      country: 'USA',     countryFlag: 'us', league: 'NWSL',                    leagueCode: 'NWSL', ratingScore: 67.0, ppg: 1.7, position: 3, previousRank: 18, rankChange: 'same' },
  { rank: 19, club: 'Ajax Vrouwen',         clubLogo: staticLogo('Ajax Vrouwen'),         country: 'Netherlands', countryFlag: 'nl', league: 'Eredivisie Vrouwen',  leagueCode: 'VEV', ratingScore: 65.5, ppg: 2.0, position: 1, previousRank: 19, rankChange: 'same' },
  { rank: 20, club: 'FC Rosengård',         clubLogo: staticLogo('FC Rosengård'),         country: 'Sweden',  countryFlag: 'se', league: 'Damallsvenskan',          leagueCode: 'DAM', ratingScore: 64.2, ppg: 1.9, position: 1, previousRank: 20, rankChange: 'same' },
];

function isCacheValid(cache: CacheEntry | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < 24 * 60 * 60 * 1000;
}

async function tryFetchLeague(
  code: string,
  prevMap: Map<string, number>,
  all: ClubRankingEntry[],
  seenClubs: Map<string, number>,
): Promise<{ league: string; clubsReturned: number; success: boolean }> {
  try {
    const standings = await getWomenTable(code);
    if (!standings || standings.length === 0) {
      return { league: code, clubsReturned: 0, success: false };
    }

    const meta = WOMENS_LEAGUE_META[code];
    if (!meta) {
      return { league: code, clubsReturned: 0, success: false };
    }

    const weight = resolveWomenWeight(code, meta.name);
    let added = 0;

    for (const s of standings) {
      if (!s.team || s.team.trim() === '') continue;

      const dedupKey = `${s.team}|${code}`;
      if (seenClubs.has(dedupKey)) continue;
      seenClubs.set(dedupKey, all.length);

      const ppg = s.played > 0 ? s.points / s.played : 0;
      const goalDiffBonus = calcGoalDiffBonus(s.goalDifference, weight);
      const formBonus = calcFormBonus(s.form, weight);
      const rawScore = ppg * weight * 20 + goalDiffBonus + formBonus;

      const key = `${s.team}|${code}`;
      const previousRank = prevMap.get(key) ?? all.length + 1;
      let rankChange: 'up' | 'down' | 'same' = 'same';
      if (previousRank < all.length + 1) rankChange = 'down';
      else if (previousRank > all.length + 1) rankChange = 'up';

      all.push({
        rank: all.length + 1,
        club: s.team,
        clubLogo: resolveWomenClubLogo(s.teamCrest, s.team),
        country: meta.country,
        countryFlag: meta.flag,
        league: meta.name,
        leagueCode: code,
        ratingScore: Math.round(rawScore * 10) / 10,
        ppg,
        position: s.position,
        previousRank,
        rankChange,
      });
      added++;
    }

    return { league: `${code} (${meta.name})`, clubsReturned: added, success: true };
  } catch {
    return { league: code, clubsReturned: 0, success: false };
  }
}

export async function getWomenClubRankings(): Promise<ClubRankingEntry[]> {
  const prevCache = loadWomenCache();
  const prevMap = new Map<string, number>();
  if (prevCache) {
    for (const r of prevCache.rankings) {
      if (r.club) prevMap.set(`${r.club}|${r.leagueCode}`, r.rank);
    }
  }

  const codesToQuery = WOMENS_FDO_CODES;

  if (codesToQuery.length === 0) {
    console.warn('[WomenClubRankings] No women league codes configured');
    return fallbackWomenRankings();
  }

  const live: ClubRankingEntry[] = [];
  const seenClubs = new Map<string, number>();
  const results: { league: string; clubsReturned: number; success: boolean }[] = [];

  for (const code of codesToQuery) {
    const r = await tryFetchLeague(code, prevMap, live, seenClubs);
    results.push(r);
  }

  // Merge: live data first, then static clubs not already in live
  const liveNames = new Set(live.map(e => e.club));
  for (const staticClub of STATIC_WOMENS_CLUBS) {
    if (!staticClub.club || staticClub.club.trim() === '') continue;
    if (!liveNames.has(staticClub.club)) {
      live.push(staticClub);
    }
  }

  if (live.length === 0) {
    console.warn('[WomenClubRankings] No clubs collected from any source');
    return fallbackWomenRankings();
  }

  live.sort((a, b) => b.ratingScore - a.ratingScore);
  const ranked = live.map((e, i) => ({
    ...e,
    rank: i + 1,
    clubLogo: resolveWomenClubLogo(e.clubLogo, e.club),
  })).slice(0, 50);

  console.log('[WomenClubRankings] === MERGED SUMMARY ===');
  console.log(`[WomenClubRankings] Live leagues queried: ${results.length}`);
  console.log(`[WomenClubRankings] Live clubs collected: ${live.length - STATIC_WOMENS_CLUBS.filter(c => !liveNames.has(c.club) && c.club).length} live + ${STATIC_WOMENS_CLUBS.filter(c => !liveNames.has(c.club) && c.club).length} static fallback = ${live.length} total`);
  console.log('[WomenClubRankings] Top 10:');
  console.table(ranked.slice(0, 10).map((r) => ({ rank: r.rank, club: r.club, league: r.league, score: r.ratingScore })));

  saveWomenCache(ranked);
  return ranked;
}

function fallbackWomenRankings(): ClubRankingEntry[] {
  // Try 24h cache — skip any corrupt entries
  const cache = loadWomenCache();
  if (isCacheValid(cache) && cache!.rankings.length > 0) {
    const valid = cache!.rankings.filter((r) => r.club && r.club.trim() !== '');
    if (valid.length > 0) {
      console.log(`[WomenClubRankings] Using cached rankings (${valid.length} valid)`);
      return valid.map((r) => ({
        ...r,
        clubLogo: resolveWomenClubLogo(r.clubLogo, r.club),
      }));
    }
  }

  // Fallback to static dataset — skip any invalid entries
  const valid = STATIC_WOMENS_CLUBS.filter((c) => c.club && c.club.trim() !== '');
  console.log(`[WomenClubRankings] Using static top women clubs dataset (${valid.length} entries)`);
  return valid.map((c, i) => ({ ...c, rank: i + 1 }));
}
