import { getEnv } from '@/config/env';
import { createClient, ApiError } from './apiClient';
import type { AxiosInstance } from 'axios';

let client: AxiosInstance | null = null;
const MIN_REQUEST_INTERVAL = 1000;
const MAX_429_RETRIES = 3;
let lastRequestChain = Promise.resolve();

function getClient(): AxiosInstance {
  if (!client) {
    const { footballApiKey } = getEnv();
    client = createClient('/api/football/v4', {
      headers: { 'X-Auth-Token': footballApiKey },
    });
  }
  return client;
}

function extractStatus(e: unknown): number {
  if (e instanceof ApiError) return e.status ?? 0;
  return (e as { response?: { status: number } }).response?.status ?? 0;
}

function extractRetryAfter(e: unknown, fallback: number): number {
  const headers = e instanceof ApiError ? e.headers : undefined;
  const raw = headers?.['retry-after'];
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

async function apiFetch<T>(url: string): Promise<T | null> {
  const result = await new Promise<T | null>((resolve) => {
    lastRequestChain = lastRequestChain.then(async () => {
      await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL));
      const label = `/api/football/v4${url}`;

      for (let attempt = 1; attempt <= MAX_429_RETRIES; attempt++) {
        console.log(`[FootballAPI] ➡️ ${label} (attempt ${attempt}/${MAX_429_RETRIES})`);
        try {
          const res = await getClient().get<T>(url);
          const body = JSON.stringify(res.data).slice(0, 200);
          console.log(`[FootballAPI] ✅ ${res.status} ${label}`);
          console.log(`[FootballAPI]    Body: ${body}`);
          const matches = (res.data as { matches?: unknown[] })?.matches;
          if (matches) console.log(`[FootballAPI]    Matches in response: ${matches.length}`);
          resolve(res.data);
          return;
        } catch (e: unknown) {
          const status = extractStatus(e);
          const body = e instanceof ApiError ? e.message : String(e);
          console.error(`[FootballAPI] ❌ ${status} ${label} | ${body}`);

          if (status === 429 && attempt < MAX_429_RETRIES) {
            const wait = extractRetryAfter(e, 60);
            console.warn(`[FootballAPI] ⚠️ Rate limited. Waiting ${wait}s before retry #${attempt + 1}...`);
            await new Promise((r) => setTimeout(r, wait * 1000));
            continue;
          }

          if (status === 403) {
            console.warn('[FootballAPI] ⚠️ API key rejected. Set a valid football-data.org API key in VITE_FOOTBALL_API_KEY.');
          }
          resolve(null);
          return;
        }
      }
    });
  });
  return result;
}

export const COMP_IDS: Record<string, string> = {
  PREMIER_LEAGUE: 'PL',
  CHAMPIONSHIP: 'ELC',
  LA_LIGA: 'PD',
  SERIE_A: 'SA',
  BUNDESLIGA: 'BL1',
  LIGUE_1: 'FL1',
  CHAMPIONS_LEAGUE: 'CL',
  EREDIVISIE: 'DED',
  PRIMEIRA_LIGA: 'PPL',
  FIFA_WORLD_CUP: 'WC',
  EUROPEAN_CHAMPIONSHIP: 'EC',
  UEFA_NATIONS_LEAGUE: 'UNL',
  COPA_AMERICA: 'COPA',
  AFRICA_CUP_OF_NATIONS: 'CAF',
  ASIAN_CUP: 'AFC',
  CONCACAF_GOLD_CUP: 'GC',
  FIFA_CLUB_WORLD_CUP: 'CWC',
  OLYMPICS: 'OLY',
  FRIENDLY: 'FRI',
};

export const WOMENS_COMP_IDS: Record<string, string> = {
  WOMENS_SUPER_LEAGUE: 'WSL',
  FRAUEN_BUNDESLIGA: 'FFL',
  LIGA_F: 'LF',
  SERIE_A_FEMMINILE: 'SAF',
  D1_FEMININE: 'D1F',
  NWSL: 'NWSL',
  WOMENS_CHAMPIONSHIP: 'WCH',
  UEFA_WOMENS_CHAMPIONS_LEAGUE: 'UWCL',
  FIFA_WOMENS_WORLD_CUP: 'WWC',
  UEFA_WOMENS_EURO: 'WEURO',
  WOMENS_NATIONS_LEAGUE: 'WNL',
  AFC_WOMENS_ASIAN_CUP: 'WAC',
  AFRICA_WOMENS_CUP_OF_NATIONS: 'WAFCON',
  COPA_AMERICA_FEMENINA: 'WCA',
};

export function getTrackedCompetitions(): string[] {
  return Object.values(COMP_IDS);
}

export function getTrackedWomenCompetitions(): string[] {
  return Object.values(WOMENS_COMP_IDS);
}

interface FdoArea {
  name: string;
  code?: string;
  flag?: string;
}

interface FdoCompetition {
  id: number;
  name: string;
  code: string;
  type?: string;
  area?: FdoArea;
}

interface FdoTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

interface FdoScore {
  winner: string | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime?: { home: number | null; away: number | null };
  penalties?: { home: number | null; away: number | null };
  extraTime?: { home: number | null; away: number | null };
}

interface FdoGoal {
  minute: number;
  type: 'GOAL' | 'PENALTY' | 'OWN_GOAL';
  scorer: { name: string };
  team?: { id: number; name: string };
  assist?: { name: string } | null;
  score?: { home: number; away: number };
}

interface FdoMatch {
  id: number;
  competition: FdoCompetition;
  season: { id: number; startDate: string; endDate: string; currentMatchday: number };
  utcDate: string;
  status: string;
  matchday: number;
  stage?: string;
  group?: string;
  homeTeam: FdoTeam;
  awayTeam: FdoTeam;
  score: FdoScore;
  venue?: string;
  goals?: FdoGoal[];
}

interface FdoMatchResponse {
  match: FdoMatch;
}

interface FdoMatchesResponse {
  matches: FdoMatch[];
  resultSet?: { count: number; competitions: string; first: string; last: string; played: number };
}

interface FdoCompetitionsResponse {
  competitions: FdoCompetition[];
}

interface FdoStandingsResponse {
  standings: {
    stage: string;
    type: string;
    group: string | null;
    table: {
      position: number;
      team: FdoTeam;
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      form?: string;
    }[];
  }[];
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysAhead(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function mapFdoStatus(fdoStatus: string): 'live' | 'upcoming' | 'finished' {
  switch (fdoStatus) {
    case 'IN_PLAY':
    case 'LIVE':
    case 'PAUSED':
      return 'live';
    case 'FINISHED':
    case 'AWARDED':
      return 'finished';
    case 'SCHEDULED':
    case 'TIMED':
    case 'POSTPONED':
    case 'CANCELLED':
    case 'SUSPENDED':
    default:
      return 'upcoming';
  }
}

export interface FootballMatchGoalEvent {
  minute: number;
  extraMinute?: number;
  player: string;
  team: 'home' | 'away';
  type: 'goal' | 'penalty' | 'own-goal';
  result?: string;
}

export interface FootballMatch {
  id: string;
  competition: string;
  competitionName: string;
  date: string;
  time: string;
  utcDate: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  homeScore: number | null;
  awayScore: number | null;
  homeDisplayScore: number;
  awayDisplayScore: number;
  status: string;
  fdoStatus: string;
  stage?: string;
  venue?: string;
  homePenaltyScore: number | null;
  awayPenaltyScore: number | null;
  hasPenalties: boolean;
  winner?: string | null;
  wentToExtraTime?: boolean;
  extraTimeHome?: number | null;
  extraTimeAway?: number | null;
  elapsed?: number;
  goals?: FootballMatchGoalEvent[];
}

function normalizeMatch(m: FdoMatch): FootballMatch {
  const duration = m.score?.duration ?? '';
  const hasExtraTime = duration === 'EXTRA_TIME' || duration === 'PENALTIES';
  const hasPenScore = m.score?.penalties?.home != null && m.score?.penalties?.away != null;
  const decidedByPenalties = duration === 'PENALTIES' || hasPenScore;
  const penaltiesHome = decidedByPenalties ? (m.score?.penalties?.home ?? null) : undefined;
  const penaltiesAway = decidedByPenalties ? (m.score?.penalties?.away ?? null) : undefined;

  const etHome = m.score?.extraTime?.home ?? null;
  const etAway = m.score?.extraTime?.away ?? null;
  const hasEtScores = etHome != null && etAway != null;

  // Use extra time score (120 min) as main score when available for ET/PEN matches.
  // Fall back to full time (90 min) otherwise.
  const mainHomeScore = hasExtraTime && hasEtScores ? etHome : m.score?.fullTime?.home;
  const mainAwayScore = hasExtraTime && hasEtScores ? etAway : m.score?.fullTime?.away;

  if (decidedByPenalties) {
    console.log("[Penalty Raw]", JSON.parse(JSON.stringify(m)));
    console.log(
      `[Penalty] Match: ${m.homeTeam?.name ?? '?'} vs ${m.awayTeam?.name ?? '?'}`,
      `| FT: ${m.score?.fullTime?.home ?? 0}-${m.score?.fullTime?.away ?? 0}`,
      `| ET: ${etHome ?? 'N/A'}-${etAway ?? 'N/A'}`,
      `| Main: ${mainHomeScore}-${mainAwayScore}`,
      `| Pens: ${penaltiesHome ?? 0}-${penaltiesAway ?? 0}`,
      `| Provider: football-data`
    );
  }

  return {
    id: `fdo-${m.id}`,
    competition: m.competition?.code ?? '',
    competitionName: m.competition?.name ?? '',
    date: m.utcDate?.split('T')[0] ?? '',
    time: m.utcDate ? m.utcDate.split('T')[1]?.slice(0, 5) ?? '' : '',
    utcDate: m.utcDate ?? '',
    homeTeam: m.homeTeam?.name ?? '',
    awayTeam: m.awayTeam?.name ?? '',
    homeCrest: m.homeTeam?.crest ?? '',
    awayCrest: m.awayTeam?.crest ?? '',
    homeScore: mainHomeScore,
    awayScore: mainAwayScore,
    homeDisplayScore: (mainHomeScore != null && !isNaN(mainHomeScore)) ? mainHomeScore : 0,
    awayDisplayScore: (mainAwayScore != null && !isNaN(mainAwayScore)) ? mainAwayScore : 0,
    status: mapFdoStatus(m.status),
    fdoStatus: m.status,
    stage: m.stage ?? '',
    venue: m.venue ?? '',
    homePenaltyScore: penaltiesHome ?? null,
    awayPenaltyScore: penaltiesAway ?? null,
    hasPenalties: decidedByPenalties,
    winner: m.score?.winner ?? null,
    wentToExtraTime: hasExtraTime,
    extraTimeHome: hasEtScores ? etHome : null,
    extraTimeAway: hasEtScores ? etAway : null,
    elapsed: undefined,
    goals: m.goals?.filter(g => g.type === 'GOAL' || g.type === 'PENALTY' || g.type === 'OWN_GOAL').map(g => ({
      minute: g.minute,
      player: g.scorer.name,
      team: g.team && m.homeTeam ? (g.team.id === m.homeTeam.id ? 'home' as const : 'away' as const) : 'home' as const,
      type: (g.type === 'PENALTY' ? 'penalty' : g.type === 'OWN_GOAL' ? 'own-goal' : 'goal') as 'goal' | 'penalty' | 'own-goal',
    })),
  };
}

async function fetchMatches(endpoint: string): Promise<FootballMatch[]> {
  const data = await apiFetch<FdoMatchesResponse>(endpoint);
  if (data?.matches) {
    const normalized = data.matches.map(normalizeMatch);
    console.log(`[FootballAPI]    Parsed ${normalized.length} matches from ${endpoint}`);
    return normalized;
  }
  return [];
}

export interface CompetitionInfo {
  id: number;
  name: string;
  code: string;
  area: string;
  emblem?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CompetitionGroup {
  running: CompetitionInfo[];
  upcoming: CompetitionInfo[];
}

export interface ScorerEntry {
  playerName: string;
  team: string;
  teamCrest?: string;
  goals: number;
  assists?: number;
  nationality?: string;
  position?: string;
}

export interface StandingEntry {
  position: number;
  team: string;
  teamCrest?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

const CACHE_KEY = 'sw_football_competitions';
const CACHE_TTL = 24 * 60 * 60 * 1000;
let memoryCache: { data: CompetitionInfo[]; timestamp: number } | null = null;
let inFlightCompetitions: Promise<CompetitionInfo[]> | null = null;

function loadCompetitionsCache(): CompetitionInfo[] | null {
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.data;
  }
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const entry = JSON.parse(raw) as { data: CompetitionInfo[]; timestamp: number };
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        memoryCache = entry;
        return entry.data;
      }
    }
  } catch {}
  return null;
}

function saveCompetitionsCache(data: CompetitionInfo[]): void {
  const entry = { data, timestamp: Date.now() };
  memoryCache = entry;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {}
}

export async function getMatch(id: number): Promise<FootballMatch | null> {
  const data = await apiFetch<FdoMatchResponse>(`/matches/${id}`);
  if (data?.match) {
    console.log(`[FootballAPI] Fetched single match #${id} with ${data.match.goals?.length ?? 0} goals`);
    return normalizeMatch(data.match);
  }
  return null;
}

export async function getCompetitions(): Promise<CompetitionInfo[]> {
  const cached = loadCompetitionsCache();
  if (cached) {
    console.log('[FootballAPI] 🏆 Cache HIT for /competitions');
    return cached;
  }

  if (inFlightCompetitions) {
    console.log('[FootballAPI] 🔁 Reusing in-flight /competitions request');
    return inFlightCompetitions;
  }

  console.log('[FootballAPI] 🏆 Cache MISS for /competitions');
  inFlightCompetitions = (async () => {
    const data = await apiFetch<FdoCompetitionsResponse>('/competitions');
    inFlightCompetitions = null;
    if (data?.competitions) {
      const result = data.competitions.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        area: c.area?.name ?? '',
        emblem: '',
        type: c.type,
      }));
      saveCompetitionsCache(result);
      return result;
    }
    console.warn('[FootballAPI] getCompetitions returned no data');
    return [];
  })();

  return inFlightCompetitions;
}

async function fetchCompetitionMatches(compCode: string, params: string): Promise<FootballMatch[]> {
  const endpoint = `/competitions/${compCode}/matches?${params}`;
  const data = await apiFetch<FdoMatchesResponse>(endpoint);
  if (data?.matches) {
    const normalized = data.matches.map(normalizeMatch);
    console.log(`[FootballAPI]    [${compCode}] ${normalized.length} matches parsed`);
    return normalized;
  }
  console.log(`[FootballAPI]    [${compCode}] 0 matches`);
  return [];
}

export async function getCompetitionFixtures(compCode: string): Promise<FootballMatch[]> {
  const from = daysAgo(30);
  const to = daysAhead(30);
  return fetchCompetitionMatches(compCode, `dateFrom=${from}&dateTo=${to}`);
}

export async function getWomenCompetitionFixtures(compCode: string): Promise<FootballMatch[]> {
  const from = daysAgo(30);
  const to = daysAhead(30);
  return fetchCompetitionMatches(compCode, `dateFrom=${from}&dateTo=${to}`);
}

export async function getWomenTable(compCode: string): Promise<StandingEntry[]> {
  const data = await apiFetch<FdoStandingsResponse>(`/competitions/${compCode}/standings`);
  if (data?.standings?.length && data.standings[0]?.table) {
    return data.standings[0].table.map((r) => ({
      position: r.position,
      team: r.team.name,
      teamCrest: r.team.crest ?? '',
      played: r.playedGames,
      won: r.won,
      drawn: r.draw,
      lost: r.lost,
      goalsFor: r.goalsFor,
      goalsAgainst: r.goalsAgainst,
      goalDifference: r.goalDifference,
      points: r.points,
      form: r.form,
    }));
  }
  return [];
}

export async function getWomenTopScorers(compCode: string): Promise<ScorerEntry[]> {
  const data = await apiFetch<FdoScorersResponse>(`/competitions/${compCode}/scorers`);
  if (data?.scorers) {
    return data.scorers.map((s) => ({
      playerName: s.player.name,
      team: s.team?.name ?? '',
      teamCrest: s.team?.crest ?? '',
      goals: s.goals,
      assists: s.assists ?? 0,
      nationality: s.player.nationality ?? '',
      position: s.player.position ?? '',
    }));
  }
  return [];
}

export async function getTable(compCode: string): Promise<StandingEntry[]> {
  const data = await apiFetch<FdoStandingsResponse>(`/competitions/${compCode}/standings`);
  if (data?.standings?.length && data.standings[0]?.table) {
    return data.standings[0].table.map((r) => ({
      position: r.position,
      team: r.team.name,
      teamCrest: r.team.crest ?? '',
      played: r.playedGames,
      won: r.won,
      drawn: r.draw,
      lost: r.lost,
      goalsFor: r.goalsFor,
      goalsAgainst: r.goalsAgainst,
      goalDifference: r.goalDifference,
      points: r.points,
      form: r.form ?? '',
    }));
  }
  console.warn('[FootballAPI] getTable returned no data');
  return [];
}

interface FdoScorersResponse {
  scorers: {
    player: { name: string; firstName?: string; lastName?: string; nationality?: string; position?: string };
    team: { name: string; crest?: string };
    goals: number;
    assists?: number;
    penalties?: number;
  }[];
}

export async function getTopScorers(compCode: string): Promise<ScorerEntry[]> {
  const data = await apiFetch<FdoScorersResponse>(`/competitions/${compCode}/scorers`);
  if (data?.scorers) {
    return data.scorers.map((s) => ({
      playerName: s.player.name,
      team: s.team.name,
      teamCrest: s.team.crest ?? '',
      goals: s.goals ?? 0,
      assists: s.assists ?? 0,
      nationality: s.player.nationality ?? '',
      position: s.player.position ?? '',
    }));
  }
  console.warn('[FootballAPI] getTopScorers returned no data');
  return [];
}
