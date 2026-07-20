import type { FootballMatch, FootballMatchGoalEvent, CompetitionInfo, StandingEntry, ScorerEntry } from '../footballApi';
import type { FootballMatchProvider, ProviderName } from './types';
import type { TransferNews } from '@/types';

const SPORTMONKS_BASE = 'https://api.sportmonks.com/v3/football';

const LEAGUE_TO_CODE: [string, string][] = [
  ['Premier League', 'PL'],
  ['Championship', 'ELC'],
  ['La Liga', 'PD'],
  ['Serie A', 'SA'],
  ['Bundesliga', 'BL1'],
  ['Ligue 1', 'FL1'],
  ['Champions League', 'CL'],
  ['Eredivisie', 'DED'],
  ['Primeira Liga', 'PPL'],
  ['World Cup', 'WC'],
  ['European Championship', 'EC'],
  ['Superliga', 'SUP'],
  ['Premiership', 'SP'],
  ['Nations League', 'UNL'],
  ['Copa America', 'COPA'],
  ['Africa Cup of Nations', 'CAF'],
  ['Asian Cup', 'AFC'],
  ['Gold Cup', 'GC'],
  ['Club World Cup', 'CWC'],
  ['Olympics', 'OLY'],
  ['Friendly', 'FRI'],
  ['Confederations Cup', 'CONF'],
];

const WOMENS_LEAGUE_TO_CODE: [string, string][] = [
  ["Women's Super League", 'WSL'],
  ['FA WSL', 'WSL'],
  ['Barclays WSL', 'WSL'],
  ['Liga F', 'LF'],
  ['Frauen Bundesliga', 'FBL'],
  ['Serie A Femminile', 'SAF'],
  ['Division 1 Féminine', 'D1F'],
  ['D1 Féminine', 'D1F'],
  ['NWSL', 'NWSL'],
  ["Women's World Cup", 'WWC'],
  ['FIFA Women\'s World Cup', 'WWC'],
  ["UEFA Women's Champions League", 'UWCL'],
  ['Women\'s Champions League', 'UWCL'],
  ["Women's Championship", 'WCH'],
  ["AFC Women's Asian Cup", 'WAC'],
  ['Africa Women Cup of Nations', 'WAFCON'],
  ['Copa América Femenina', 'WCA'],
  ['Copa America Femenina', 'WCA'],
  ['CONCACAF W Gold Cup', 'WGC'],
  ["CONCACAF Women's Gold Cup", 'WGC'],
  ["UEFA Women's Nations League", 'WNL'],
  ["Women's Nations League", 'WNL'],
  ["UEFA Women's Euro", 'WEURO'],
  ["Women's Euro", 'WEURO'],
];

function getToken(): string {
  return import.meta.env.VITE_SPORTMONKS_API_TOKEN || '';
}

function mapStatus(smStatus: string): 'live' | 'upcoming' | 'finished' {
  switch (smStatus.toUpperCase()) {
    case 'LIVE': case '1H': case '2H': case 'HT': case 'ET':
    case 'PEN_LIVE': case 'BREAK': case 'INT':
      return 'live';
    case 'FT': case 'AET': case 'PEN': case 'AWD': case 'WO':
      return 'finished';
    default:
      return 'upcoming';
  }
}

function toFdoStatus(smStatus: string): string {
  switch (smStatus.toUpperCase()) {
    case 'LIVE': case '1H': case '2H': case 'HT': case 'ET':
    case 'PEN_LIVE': case 'BREAK': case 'INT':
      return 'LIVE';
    case 'FT': case 'AET': case 'PEN': case 'AWD': case 'WO':
      return 'FINISHED';
    default:
      return 'SCHEDULED';
  }
}

export function detectLeagueCode(leagueName: string): { code: string; name: string } | null {
  for (const [keyword, code] of LEAGUE_TO_CODE) {
    if (leagueName.toLowerCase().includes(keyword.toLowerCase())) {
      return { code, name: keyword };
    }
  }
  return null;
}

export function detectWomenLeagueCode(leagueName: string): { code: string; name: string } | null {
  for (const [keyword, code] of WOMENS_LEAGUE_TO_CODE) {
    if (leagueName.toLowerCase().includes(keyword.toLowerCase())) {
      return { code, name: keyword };
    }
  }
  return null;
}

interface SmEvent {
  id: number;
  type: string;
  minute: number;
  extra_minute?: number | null;
  result?: string;
  player?: { name: string };
  team_id?: number;
}

interface SmFixture {
  id: number;
  name: string;
  league_id: number;
  season_id: number;
  starting_at: string;
  starting_at_timestamp: number;
  status: string;
  participants: { id: number; name: string; image_path?: string; meta?: { location: string; winner?: string | null } }[];
  scores: {
    localteam_score: number | null;
    visitorteam_score: number | null;
    localteam_pen_score?: number | null;
    visitorteam_pen_score?: number | null;
  };
  venue?: { name?: string; city?: string };
  league?: { id: number; name: string; image_path?: string };
  time?: { minute: number; added_time?: number };
  events?: SmEvent[];
}

interface SmFixturesResponse {
  data: SmFixture[];
}

async function sportmonksFetch<T>(path: string): Promise<T | null> {
  const token = getToken();
  if (!token) {
    console.warn('[Sportmonks] No API token found in VITE_SPORTMONKS_API_TOKEN');
    return null;
  }
  const url = `${SPORTMONKS_BASE}${path}${path.includes('?') ? '&' : '?'}api_token=${token}`;
  console.log(`[Sportmonks] ➡️ ${url.slice(0, 120).replace(token, '***')}...`);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[Sportmonks] ❌ ${res.status} | ${res.statusText}`);
      if (res.status === 429) console.warn('[Sportmonks] ⚠️ Rate limited');
      return null;
    }
    const body = (await res.json()) as T;
    console.log(`[Sportmonks] ✅ ${res.status}`);
    return body;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Sportmonks] ❌ ${msg}`);
    return null;
  }
}

function getParticipant(participants: SmFixture['participants'], location: string) {
  return participants?.find(p => p.meta?.location === location);
}

function normalizeFixture(f: SmFixture): FootballMatch | null {
  const leagueName = f.league?.name ?? '';
  if (!f.league) {
    console.warn(`[Sportmonks] Fixture ${f.id} has no league data — skipping`);
  }
  const detected = detectLeagueCode(leagueName);
  if (!detected) return null;
  const rawDate = f.starting_at ?? '';
  const utcDate = rawDate;
  const date = rawDate.split(' ')[0] ?? '';
  const timePart = rawDate.split(' ')[1]?.slice(0, 5) ?? '';
  const smStatus = f.status?.toUpperCase() ?? '';
  const homeP = getParticipant(f.participants, 'home');
  const awayP = getParticipant(f.participants, 'away');

  // Raw Sportmonks values
  const rawHomeScore = f.scores?.localteam_score;
  const rawAwayScore = f.scores?.visitorteam_score;
  const rawPenHome = f.scores?.localteam_pen_score;
  const rawPenAway = f.scores?.visitorteam_pen_score;

  const homeScore: number | null = rawHomeScore ?? null;
  const awayScore: number | null = rawAwayScore ?? null;
  const homePenaltyScore: number | null = rawPenHome ?? null;
  const awayPenaltyScore: number | null = rawPenAway ?? null;
  const hasPenalties = homePenaltyScore != null && awayPenaltyScore != null;
  const wentToExtraTime = hasPenalties || smStatus === 'AET';

  // Sportmonks returns AGGREGATE score (extra time + penalty shootout).
  // Subtract penalty scores to get the true 120-min display score.
  let homeDisplayScore: number;
  let awayDisplayScore: number;

  if (hasPenalties && homePenaltyScore != null && awayPenaltyScore != null && homeScore != null && awayScore != null) {
    const normalizedHome = homeScore > homePenaltyScore ? homeScore - homePenaltyScore : homeScore;
    const normalizedAway = awayScore > awayPenaltyScore ? awayScore - awayPenaltyScore : awayScore;
    homeDisplayScore = !isNaN(normalizedHome) ? normalizedHome : homeScore;
    awayDisplayScore = !isNaN(normalizedAway) ? normalizedAway : awayScore;
  } else {
    homeDisplayScore = homeScore ?? 0;
    awayDisplayScore = awayScore ?? 0;
  }

  if (homeDisplayScore == null || isNaN(homeDisplayScore)) { homeDisplayScore = homeScore ?? 0; }
  if (awayDisplayScore == null || isNaN(awayDisplayScore)) { awayDisplayScore = awayScore ?? 0; }

  // Elapsed minutes
  const elapsed = f.time?.minute ?? undefined;

  // Build team_id → location map for event team detection
  const teamIdToLocation: Record<number, string> = {};
  for (const p of f.participants) {
    if (p.meta?.location) {
      teamIdToLocation[p.id] = p.meta.location;
    }
  }

  // Extract goal events (excluding shootout penalties)
  const goals: FootballMatchGoalEvent[] | undefined = f.events
    ?.filter(e => e.type === 'goal' || e.type === 'penalty' || e.type === 'own-goal')
    .map(e => {
      const location = e.team_id != null ? teamIdToLocation[e.team_id] : null;
      return {
        minute: e.minute,
        extraMinute: e.extra_minute ?? undefined,
        player: e.player?.name ?? 'Unknown',
        team: location === 'home' ? 'home' as const : 'away' as const,
        type: (e.type === 'penalty' ? 'penalty' : e.type === 'own-goal' ? 'own-goal' : 'goal') as 'goal' | 'penalty' | 'own-goal',
        result: e.result,
      };
    });

  console.log("[Penalty Provider]", {
    team: `${homeP?.name ?? '?'} vs ${awayP?.name ?? '?'}`,
    homeScore,
    awayScore,
    homePenaltyScore,
    awayPenaltyScore,
    homeDisplayScore,
    awayDisplayScore,
    hasPenalties,
  });

  return {
    id: `sm-${f.id}`,
    competition: detected.code,
    competitionName: detected.name,
    date,
    time: timePart,
    utcDate,
    homeTeam: homeP?.name ?? '',
    awayTeam: awayP?.name ?? '',
    homeCrest: homeP?.image_path ?? '',
    awayCrest: awayP?.image_path ?? '',
    homeScore,
    awayScore,
    homeDisplayScore,
    awayDisplayScore,
    status: mapStatus(f.status),
    fdoStatus: toFdoStatus(f.status),
    venue: f.venue?.name ?? '',
    homePenaltyScore,
    awayPenaltyScore,
    hasPenalties,
    winner: null,
    wentToExtraTime,
    extraTimeHome: null,
    extraTimeAway: null,
    elapsed,
    goals,
  };
}

interface SmTransfer {
  id: number;
  player_id: number;
  from_team_id: number;
  to_team_id: number;
  amount: string | null;
  date: string;
  completed: boolean;
  player?: { name: string; display_name?: string; common_name?: string };
  fromteam?: { name: string };
  toteam?: { name: string };
}

export async function getTransfers(): Promise<TransferNews[]> {
  console.log('[Transfer] Sportmonks: fetching transfers...');
  const data = await sportmonksFetch<{ data: SmTransfer[] }>(
    `/transfers/latest?include=player;fromteam;toteam&per_page=50`
  );
  if (!data?.data?.length) {
    console.log('[Transfer] Sportmonks: 0 transfers found (no data returned)');
    return [];
  }
  console.log(`[Transfer] Sportmonks: ${data.data.length} transfers found`);
  
  // Debug: log first 3 transfers to verify team names
  data.data.slice(0, 3).forEach((t, i) => {
    console.log(`[Transfer] Sportmonks #${i + 1}: "${t.player?.name}" from "${t.fromteam?.name}" → "${t.toteam?.name}" | fee: ${t.amount} | completed: ${t.completed}`);
  });
  return data.data.map((t) => ({
    id: `sm-trf-${t.id}`,
    player: t.player?.name ?? t.player?.display_name ?? t.player?.common_name ?? `Player #${t.player_id}`,
    from: t.fromteam?.name ?? `Team #${t.from_team_id}`,
    to: t.toteam?.name ?? `Team #${t.to_team_id}`,
    fee: t.amount ?? 'N/A',
    status: t.completed ? 'completed' as const : 'rumored' as const,
    date: t.date ?? '',
  }));
}

const name: ProviderName = 'sportmonks';

export interface AiMatchInfo {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest: string;
  awayCrest: string;
  competition: string;
  date: string;
  time: string;
  utcDate: string;
  isKnockout: boolean;
}

export async function getUpcomingAiFixtures(): Promise<AiMatchInfo[]> {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const from = now.toISOString().split('T')[0];
  const to = tomorrow.toISOString().split('T')[0];

  const data = await sportmonksFetch<SmFixturesResponse>(
    `/fixtures/between/${from}/${to}?include=league;venue;participants&per_page=100`
  );

  if (!data?.data?.length) return [];

  const ignoreStatuses = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO', 'LIVE', '1H', '2H', 'HT', 'ET', 'PEN_LIVE', 'BREAK', 'INT']);
  const cupHints = ['cup', 'final', 'play-off', 'knockout', 'round of', 'quarter', 'semi', 'qualification', 'cup_', '_cup'];

  return data.data
    .filter(f => !ignoreStatuses.has((f.status ?? '').toUpperCase()))
    .map(f => {
      const homeP = f.participants?.find(p => p.meta?.location === 'home');
      const awayP = f.participants?.find(p => p.meta?.location === 'away');
      const rawDate = f.starting_at ?? '';
      const leagueName = (f.league?.name ?? '').toLowerCase();
      const fixtureName = (f.name ?? '').toLowerCase();
      const isKnockout = cupHints.some(k => leagueName.includes(k) || fixtureName.includes(k));

      return {
        id: `sm-${f.id}`,
        homeTeam: homeP?.name ?? '',
        awayTeam: awayP?.name ?? '',
        homeCrest: homeP?.image_path ?? '',
        awayCrest: awayP?.image_path ?? '',
        competition: f.league?.name ?? '',
        date: rawDate.split(' ')[0] ?? '',
        time: rawDate.split(' ')[1]?.slice(0, 5) ?? '',
        utcDate: rawDate,
        isKnockout,
      };
    });
}

function normalizeWomenFixture(f: SmFixture): FootballMatch | null {
  const leagueName = f.league?.name ?? '';
  const detected = detectWomenLeagueCode(leagueName);
  if (!detected) return null;
  const rawDate = f.starting_at ?? '';
  const utcDate = rawDate;
  const date = rawDate.split(' ')[0] ?? '';
  const timePart = rawDate.split(' ')[1]?.slice(0, 5) ?? '';
  const smStatus = f.status?.toUpperCase() ?? '';
  const homeP = getParticipant(f.participants, 'home');
  const awayP = getParticipant(f.participants, 'away');

  const rawHomeScore = f.scores?.localteam_score;
  const rawAwayScore = f.scores?.visitorteam_score;
  const rawPenHome = f.scores?.localteam_pen_score;
  const rawPenAway = f.scores?.visitorteam_pen_score;

  const homeScore: number | null = rawHomeScore ?? null;
  const awayScore: number | null = rawAwayScore ?? null;
  const homePenaltyScore: number | null = rawPenHome ?? null;
  const awayPenaltyScore: number | null = rawPenAway ?? null;
  const hasPenalties = homePenaltyScore != null && awayPenaltyScore != null;
  const wentToExtraTime = hasPenalties || smStatus === 'AET';

  let homeDisplayScore: number;
  let awayDisplayScore: number;

  if (hasPenalties && homePenaltyScore != null && awayPenaltyScore != null && homeScore != null && awayScore != null) {
    const normalizedHome = homeScore > homePenaltyScore ? homeScore - homePenaltyScore : homeScore;
    const normalizedAway = awayScore > awayPenaltyScore ? awayScore - awayPenaltyScore : awayScore;
    homeDisplayScore = !isNaN(normalizedHome) ? normalizedHome : homeScore;
    awayDisplayScore = !isNaN(normalizedAway) ? normalizedAway : awayScore;
  } else {
    homeDisplayScore = homeScore ?? 0;
    awayDisplayScore = awayScore ?? 0;
  }

  if (homeDisplayScore == null || isNaN(homeDisplayScore)) { homeDisplayScore = homeScore ?? 0; }
  if (awayDisplayScore == null || isNaN(awayDisplayScore)) { awayDisplayScore = awayScore ?? 0; }

  const elapsed = f.time?.minute ?? undefined;

  const teamIdToLocation: Record<number, string> = {};
  for (const p of f.participants) {
    if (p.meta?.location) {
      teamIdToLocation[p.id] = p.meta.location;
    }
  }

  const goals: FootballMatchGoalEvent[] | undefined = f.events
    ?.filter(e => e.type === 'goal' || e.type === 'penalty' || e.type === 'own-goal')
    .map(e => {
      const location = e.team_id != null ? teamIdToLocation[e.team_id] : null;
      return {
        minute: e.minute,
        extraMinute: e.extra_minute ?? undefined,
        player: e.player?.name ?? 'Unknown',
        team: location === 'home' ? 'home' as const : 'away' as const,
        type: (e.type === 'penalty' ? 'penalty' : e.type === 'own-goal' ? 'own-goal' : 'goal') as 'goal' | 'penalty' | 'own-goal',
        result: e.result,
      };
    });

  return {
    id: `sm-${f.id}`,
    competition: detected.code,
    competitionName: detected.name,
    date,
    time: timePart,
    utcDate,
    homeTeam: homeP?.name ?? '',
    awayTeam: awayP?.name ?? '',
    homeCrest: homeP?.image_path ?? '',
    awayCrest: awayP?.image_path ?? '',
    homeScore,
    awayScore,
    homeDisplayScore,
    awayDisplayScore,
    status: mapStatus(f.status),
    fdoStatus: toFdoStatus(f.status),
    venue: f.venue?.name ?? '',
    homePenaltyScore,
    awayPenaltyScore,
    hasPenalties,
    winner: null,
    wentToExtraTime,
    extraTimeHome: null,
    extraTimeAway: null,
    elapsed,
    goals,
  };
}

export async function getWomenFixtures(from: string, to: string): Promise<FootballMatch[]> {
  const data = await sportmonksFetch<SmFixturesResponse>(
    `/fixtures/between/${from}/${to}?include=league;venue;participants;events;events.player&per_page=250&gender=female`
  );
  if (!data?.data?.length) {
    console.log('[Sportmonks] No women fixtures returned');
    return [];
  }
  console.log(`[Sportmonks] Raw women fixtures: ${data.data.length}`);
  const matches: FootballMatch[] = [];
  const seen = new Set<string>();
  for (const f of data.data) {
    const m = normalizeWomenFixture(f);
    if (!m) continue;
    const key = `${m.utcDate}|${m.homeTeam}|${m.awayTeam}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push(m);
  }
  console.log(`[Sportmonks] Normalized women matches: ${matches.length}`);
  return matches;
}

export async function getWomenCompetitions(): Promise<CompetitionInfo[]> {
  const data = await sportmonksFetch<{ data: { id: number; name: string; image_path?: string }[] }>(
    '/leagues?per_page=100'
  );
  if (!data?.data) return [];
  const comps: CompetitionInfo[] = [];
  const added = new Set<string>();
  for (const league of data.data) {
    const detected = detectWomenLeagueCode(league.name);
    if (detected && !added.has(detected.code)) {
      added.add(detected.code);
      comps.push({
        id: league.id,
        name: detected.name,
        code: detected.code,
        area: '',
        emblem: league.image_path ?? '',
        type: 'League',
      });
    }
  }
  return comps;
}

export const sportmonksProvider: FootballMatchProvider = {
  name,

  async getAllFixtures(from: string, to: string): Promise<FootballMatch[]> {
    const data = await sportmonksFetch<SmFixturesResponse>(
      `/fixtures/between/${from}/${to}?include=league;venue;participants;events;events.player&per_page=250`
    );
    if (!data?.data?.length) {
      console.log('[Sportmonks] No fixtures returned');
      return [];
    }
    console.log(`[Sportmonks] Raw fixtures: ${data.data.length}`);
    const matches: FootballMatch[] = [];
    const seen = new Set<string>();
    for (const f of data.data) {
      const m = normalizeFixture(f);
      if (!m) {
        const leagueName = f.league?.name ?? '(no league)';
        const homeP = getParticipant(f.participants, 'home');
        const awayP = getParticipant(f.participants, 'away');
        console.log(`[Sportmonks] SKIPPED fixture #${f.id}: "${homeP?.name ?? '?'} vs ${awayP?.name ?? '?'}" league="${leagueName}" status="${f.status}"`);
        continue;
      }
      const key = `${m.utcDate}|${m.homeTeam}|${m.awayTeam}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push(m);
    }
    console.log(`[Sportmonks] Normalized matches for tracked leagues: ${matches.length}`);
    matches.forEach((m) => {
      console.log(`  [SM] ${m.competition.padEnd(12)} | ${m.utcDate} | ${m.status.padEnd(9)} | ${m.homeTeam.padEnd(22)} vs ${m.awayTeam}`);
    });
    return matches;
  },

  async getCompetitions(): Promise<CompetitionInfo[]> {
    const data = await sportmonksFetch<{ data: { id: number; name: string; image_path?: string }[] }>(
      '/leagues?per_page=100'
    );
    if (!data?.data) return [];
    const comps: CompetitionInfo[] = [];
    const added = new Set<string>();
    for (const league of data.data) {
      const detected = detectLeagueCode(league.name);
      if (detected && !added.has(detected.code)) {
        added.add(detected.code);
        comps.push({
          id: league.id,
          name: detected.name,
          code: detected.code,
          area: '',
          emblem: league.image_path ?? '',
          type: 'League',
        });
      }
    }
    return comps;
  },

  async getTable(_compCode: string): Promise<StandingEntry[]> {
    console.warn('[Sportmonks] getTable not implemented yet, falling through');
    return [];
  },

  async getTopScorers(_compCode: string): Promise<ScorerEntry[]> {
    console.warn('[Sportmonks] getTopScorers not implemented yet, falling through');
    return [];
  },
};
