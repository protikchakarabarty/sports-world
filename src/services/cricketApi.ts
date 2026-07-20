import { getEnv } from '@/config/env';
import { createClient, ApiError } from './apiClient';
import type { AxiosInstance } from 'axios';
import { fetchCricketDataMatches, fetchCricketDataSeries } from './cricketDataProvider';
import { getUpcomingFixtures as getScheduledFixturesFromFile } from './upcomingFixtures';
import { getUpcomingSeries as getScheduledSeriesFromFile } from './upcomingSeries';

export interface TeamRankingEntry {
  rank: number;
  team: string;
  rating: number;
  format: string;
  gender: string;
}

let client: AxiosInstance | null = null;
const MIN_REQUEST_INTERVAL = 2200;
let lastRequestChain = Promise.resolve();

// === CricketData.org Provider (Primary Tier) ===
let cricketDataCache: ReturnType<typeof normalizeMatch>[] | null = null;
let cricketDataPromise: Promise<ReturnType<typeof normalizeMatch>[]> | null = null;

async function fetchAndNormalizeCricketData(): Promise<ReturnType<typeof normalizeMatch>[]> {
  const raw = await fetchCricketDataMatches();
  const matches = raw.map(normalizeMatch);
  console.log(`[CricketAPI] CricketData fetched ${matches.length} matches (${matches.filter((m) => m.status === 'live').length} live, ${matches.filter((m) => m.status === 'upcoming').length} upcoming, ${matches.filter((m) => m.status === 'finished').length} finished)`);
  return matches;
}

async function getCricketDataMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  if (cricketDataCache) return cricketDataCache;
  if (!cricketDataPromise) {
    cricketDataPromise = fetchAndNormalizeCricketData().then((matches) => {
      cricketDataCache = matches;
      cricketDataPromise = null;
      return matches;
    }).catch(() => {
      cricketDataPromise = null;
      return [];
    });
  }
  return cricketDataPromise;
}

// === SportScore Provider (Secondary Tier) ===
interface SportScoreMatch {
  home: string;
  away: string;
  home_score: string | null;
  away_score: string | null;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  competition: string;
  url: string;
}

let sportScoreCache: ReturnType<typeof normalizeMatch>[] | null = null;
let sportScorePromise: Promise<ReturnType<typeof normalizeMatch>[]> | null = null;

function sportScoreToRaw(m: SportScoreMatch): CricketMatchRaw {
  return {
    id: m.url?.replace('/cricket/match/', '').replace(/[^a-zA-Z0-9_-]/g, '_') || `ss-${m.home}-${m.away}`.replace(/\s+/g, '_'),
    homeTeam: m.home,
    awayTeam: m.away,
    homeScore: m.home_score ?? '',
    awayScore: m.away_score ?? '',
    status: m.status,
    date: m.time,
    series: m.competition,
    venue: '',
  };
}

async function fetchSportScoreMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  try {
    const res = await fetch('https://sportscore.com/api/widget/matches/?sport=cricket&limit=50');
    if (!res.ok) throw new Error(`SportScore HTTP ${res.status}`);
    const data: { matches?: SportScoreMatch[] } = await res.json();
    const raw = data?.matches ?? [];
    const matches = raw.map((m) => normalizeMatch(sportScoreToRaw(m)));
    console.log(`[CricketAPI] SportScore fetched ${matches.length} matches (${raw.filter((m) => m.status === 'live').length} live, ${raw.filter((m) => m.status === 'upcoming').length} upcoming, ${raw.filter((m) => m.status === 'finished').length} finished)`);
    return matches;
  } catch (e) {
    console.error('[CricketAPI] SportScore fetch failed:', e);
    return [];
  }
}

async function getSportScoreMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  if (sportScoreCache) return sportScoreCache;
  if (!sportScorePromise) {
    sportScorePromise = fetchSportScoreMatches().then((matches) => {
      sportScoreCache = matches;
      sportScorePromise = null;
      return matches;
    }).catch(() => {
      sportScorePromise = null;
      return [];
    });
  }
  return sportScorePromise;
}

// === Upcoming Fixtures (Curated schedule - low priority) ===
let fixturesCache: ReturnType<typeof normalizeMatch>[] | null = null;

function getFixturesData(): ReturnType<typeof normalizeMatch>[] {
  if (fixturesCache) return fixturesCache;
  const raw = getScheduledFixturesFromFile();
  fixturesCache = raw.map(normalizeMatch);
  console.log(`[CricketAPI] UpcomingFixtures loaded ${fixturesCache.length} scheduled matches`);
  return fixturesCache;
}

// === Cricbuzz Provider (Secondary Tier - scraped via proxy) ===
const CRICBUZZ_PROXY_URL = 'https://blac-cricket-api.vercel.app';

interface CricbuzzMatch {
  id: number;
  start_time: string;
  status: string;
  teams: string;
  title: string;
}

let cricbuzzCache: ReturnType<typeof normalizeMatch>[] | null = null;
let cricbuzzPromise: Promise<ReturnType<typeof normalizeMatch>[]> | null = null;

function parseCricbuzzTeams(m: CricbuzzMatch): { home: string; away: string } {
  const titleParts = m.title.split(' vs ');
  if (titleParts.length === 2) {
    const left = titleParts[0].trim();
    const right = titleParts[1].split(',')[0].split(' - ')[0].trim();
    if (left && right && left.length > 1 && right.length > 1) return { home: left, away: right };
  }
  const parts = m.teams.trim().split(/\s+/);
  if (parts.length === 2) return { home: parts[0], away: parts[1] };
  if (parts.length >= 4 && parts.length % 2 === 0) {
    const half = parts.length / 2;
    return { home: parts.slice(0, half).join(' '), away: parts.slice(half).join(' ') };
  }
  return { home: parts[0] || '', away: parts[1] || '' };
}

function cricbuzzStatus(s: string): string {
  const map: Record<string, string> = { live: 'live', upcoming: 'upcoming', completed: 'finished' };
  return map[s.toLowerCase()] || 'upcoming';
}

function extractCricbuzzScores(title: string): { homeScore: string; awayScore: string } {
  const scoreRegex = /(\d+\/\d+|\d+-\d+)/g;
  const scores = title.match(scoreRegex);
  if (scores && scores.length >= 2) return { homeScore: scores[0], awayScore: scores[1] };
  if (scores && scores.length === 1) return { homeScore: scores[0], awayScore: '' };
  const numScores = title.match(/\b(\d{2,3})\b/g);
  if (numScores && numScores.length >= 2) return { homeScore: numScores[0], awayScore: numScores[1] };
  return { homeScore: '', awayScore: '' };
}

function parseCricbuzzDate(startTime: string): string {
  const gmtMatch = startTime.match(/(\d{1,2}:\d{2}) (AM|PM) GMT/);
  if (!gmtMatch) return startTime;
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  let [h, m] = gmtMatch[1].split(':').map(Number);
  if (gmtMatch[2] === 'PM' && h !== 12) h += 12;
  if (gmtMatch[2] === 'AM' && h === 12) h = 0;
  return `${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`;
}

function cricbuzzToRaw(m: CricbuzzMatch): CricketMatchRaw {
  const { home, away } = parseCricbuzzTeams(m);
  const { homeScore, awayScore } = extractCricbuzzScores(m.title);
  return {
    id: `cb-${m.id}`,
    homeTeam: home,
    awayTeam: away,
    homeScore,
    awayScore,
    status: cricbuzzStatus(m.status),
    date: parseCricbuzzDate(m.start_time),
    series: m.title,
    venue: '',
  };
}

async function fetchCricbuzzMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  try {
    const res = await fetch(`${CRICBUZZ_PROXY_URL}/live-matches`);
    if (!res.ok) throw new Error(`Cricbuzz proxy HTTP ${res.status}`);
    const data: { code: number; data?: { matches?: CricbuzzMatch[] }; success: boolean } = await res.json();
    const raw = data?.data?.matches ?? [];
    const matches = raw.map((m) => normalizeMatch(cricbuzzToRaw(m)));
    console.log(`[CricketAPI] Cricbuzz fetched ${matches.length} matches (${raw.filter((m) => m.status === 'Live').length} live, ${raw.filter((m) => m.status === 'Upcoming').length} upcoming, ${raw.filter((m) => m.status === 'Completed').length} completed)`);
    return matches;
  } catch (e) {
    console.error('[CricketAPI] Cricbuzz fetch failed:', e);
    return [];
  }
}

async function getCricbuzzMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  if (cricbuzzCache) return cricbuzzCache;
  if (!cricbuzzPromise) {
    cricbuzzPromise = fetchCricbuzzMatches().then((matches) => {
      cricbuzzCache = matches;
      cricbuzzPromise = null;
      return matches;
    }).catch(() => {
      cricbuzzPromise = null;
      return [];
    });
  }
  return cricbuzzPromise;
}

function matchKey(m: ReturnType<typeof normalizeMatch>): string {
  return `${m.homeTeam}|${m.awayTeam}`.toLowerCase().replace(/\s+/g, '');
}

function mergeProviders(a: ReturnType<typeof normalizeMatch>[], b: ReturnType<typeof normalizeMatch>[]): ReturnType<typeof normalizeMatch>[] {
  const seen = new Set<string>();
  const result: ReturnType<typeof normalizeMatch>[] = [];
  for (const m of a) { const k = matchKey(m); if (!seen.has(k)) { seen.add(k); result.push(m); } }
  for (const m of b) { const k = matchKey(m); if (!seen.has(k)) { seen.add(k); result.push(m); } }
  return result;
}

function getClient(): AxiosInstance {
  if (!client) {
    const { cricketApiKey, cricketRapidapiHost } = getEnv();
    client = createClient('https://api-cricket1.p.rapidapi.com', {
      headers: {
        'X-RapidAPI-Key': cricketApiKey,
        'X-RapidAPI-Host': cricketRapidapiHost,
      },
    });
  }
  return client;
}

const fullResponseLogged = new Set<string>();

async function rateLimitedFetch<T>(url: string): Promise<T> {
  const result = await new Promise<T>((resolve, reject) => {
    lastRequestChain = lastRequestChain.then(async () => {
      await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL));
      console.log(`[CricketAPI] ➡️ ${url}`);
      try {
        const res = await getClient().get<T>(url);
        const body = JSON.stringify(res.data);
        console.log(`[CricketAPI] ✅ ${res.status} ${url}`);
        console.log(`[CricketAPI]    Body (first 200): ${body.slice(0, 200)}`);
        if (!fullResponseLogged.has(url)) {
          fullResponseLogged.add(url);
          console.log(`[CricketAPI]    FULL RESPONSE: ${body}`);
        }
        resolve(res.data);
      } catch (e: unknown) {
        const apiErr = e as ApiError;
        const status = apiErr.status ?? (e as { response?: { status: number } }).response?.status ?? 0;
        const msg = apiErr.message ?? '';
        console.error(`[CricketAPI] ❌ ${status} ${url} | ${msg}`);
        reject(e);
      }
    });
  });
  return result;
}

function extractArray<T>(data: unknown, key: string): T[] {
  if (!data || typeof data !== 'object') {
    console.log(`[CricketAPI extractArray] data is not an object:`, typeof data);
    return [];
  }
  const obj = data as Record<string, unknown>;

  console.group(`[CricketAPI extractArray] key="${key}"`);
  console.log('Top Level Keys:', Object.keys(obj));
  console.log('Full Response:', data);

  function tryGetArray(source: Record<string, unknown>): T[] | null {
    if (Array.isArray(source[key])) return source[key] as T[];
    const allArr = Object.values(source).filter(Array.isArray);
    if (allArr.length > 0) return allArr[0] as T[];
    return null;
  }

  // 1 — obj[key] (exact key at root)
  const rootArr = tryGetArray(obj);
  if (rootArr) { console.log(`✓ Found at root.${key}`, rootArr.length, 'items'); console.groupEnd(); return rootArr; }

  // 2 — obj.response (if array directly)
  if (obj.response && Array.isArray(obj.response)) {
    console.log(`✓ obj.response is array directly`, (obj.response as T[]).length, 'items');
    console.groupEnd();
    return obj.response as T[];
  }

  // 3 — obj.data (if array directly)
  if (obj.data && Array.isArray(obj.data)) {
    console.log(`✓ obj.data is array directly`, (obj.data as T[]).length, 'items');
    console.groupEnd();
    return obj.data as T[];
  }

  // 4 — obj.data.response
  if (obj.data && typeof obj.data === 'object') {
    const d = obj.data as Record<string, unknown>;
    const arr = tryGetArray(d);
    if (arr) { console.log(`✓ Found at data.${key}`, arr.length, 'items'); console.groupEnd(); return arr; }
    // 5 — obj.data.response / obj.data.response[key]
    if (d.response) {
      if (Array.isArray(d.response)) { console.log(`✓ obj.data.response is array`, (d.response as T[]).length, 'items'); console.groupEnd(); return d.response as T[]; }
      const resp = d.response as Record<string, unknown>;
      const arr2 = tryGetArray(resp);
      if (arr2) { console.log(`✓ Found at data.response.${key}`, arr2.length, 'items'); console.groupEnd(); return arr2; }
    }
  }

  // 6 — obj.response (object) / obj.response[key]
  if (obj.response && typeof obj.response === 'object') {
    const resp = obj.response as Record<string, unknown>;
    if (resp.data) {
      const d2 = resp.data as Record<string, unknown>;
      const arr2 = tryGetArray(d2);
      if (arr2) { console.log(`✓ Found at response.data.${key}`, arr2.length, 'items'); console.groupEnd(); return arr2; }
    }
    const arr2 = tryGetArray(resp);
    if (arr2) { console.log(`✓ Found at response.${key}`, arr2.length, 'items'); console.groupEnd(); return arr2; }
  }

  // 7 — obj.result / obj.result[key]
  if (obj.result) {
    if (Array.isArray(obj.result)) { console.log(`✓ obj.result is array`, (obj.result as T[]).length, 'items'); console.groupEnd(); return obj.result as T[]; }
    const r = obj.result as Record<string, unknown>;
    const arr2 = tryGetArray(r);
    if (arr2) { console.log(`✓ Found at result.${key}`, arr2.length, 'items'); console.groupEnd(); return arr2; }
  }

  // 8 — deep scan of all object values for any nested array
  function deepFindArray(val: unknown): T[] | null {
    if (Array.isArray(val) && val.length > 0) return val as T[];
    if (val && typeof val === 'object') {
      for (const v of Object.values(val as Record<string, unknown>)) {
        const found = deepFindArray(v);
        if (found) return found;
      }
    }
    return null;
  }
  const deepArr = deepFindArray(obj);
  if (deepArr) { console.log(`✓ Deep scan found array`, deepArr.length, 'items'); console.groupEnd(); return deepArr; }

  console.log(`✗ No array found for key="${key}"`);
  console.groupEnd();
  return [];
}

export interface CricketMatchRaw {
  id?: string | number;
  event_key?: string | number;
  match_id?: string | number;
  name?: string;
  event_name?: string;
  title?: string;
  date?: string;
  event_date_start?: string;
  start_date?: string;
  status?: string;
  event_status?: string;
  match_status?: string;
  homeTeam?: string;
  event_home_team?: string;
  home_team?: string;
  team_home?: string;
  awayTeam?: string;
  event_away_team?: string;
  away_team?: string;
  team_away?: string;
  homeScore?: string | number;
  event_home_score?: string | number;
  home_score?: string | number;
  awayScore?: string | number;
  event_away_score?: string | number;
  away_score?: string | number;
  venue?: string;
  venue_name?: string;
  event_venue?: string;
  series?: string;
  league_name?: string;
  event_type?: string;
}

export function normalizeMatch(raw: CricketMatchRaw) {
  return {
    id: String(raw.id ?? raw.event_key ?? raw.match_id ?? ''),
    name: raw.name ?? raw.event_name ?? raw.title ?? '',
    date: raw.date ?? raw.event_date_start ?? raw.start_date ?? '',
    status: raw.status ?? raw.event_status ?? raw.match_status ?? '',
    homeTeam: raw.homeTeam ?? raw.event_home_team ?? raw.home_team ?? raw.team_home ?? '',
    awayTeam: raw.awayTeam ?? raw.event_away_team ?? raw.away_team ?? raw.team_away ?? '',
    homeScore: String(raw.homeScore ?? raw.event_home_score ?? raw.home_score ?? ''),
    awayScore: String(raw.awayScore ?? raw.event_away_score ?? raw.away_score ?? ''),
    venue: raw.venue ?? raw.venue_name ?? raw.event_venue ?? '',
    series: raw.series ?? raw.league_name ?? raw.event_type ?? '',
  };
}

export async function getLiveMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  const [cd, ss, cb] = await Promise.allSettled([getCricketDataMatches(), getSportScoreMatches(), getCricbuzzMatches()]);
  const cricketData = cd.status === 'fulfilled' ? cd.value.filter((m) => m.status === 'live') : [];
  const sportScore = ss.status === 'fulfilled' ? ss.value.filter((m) => m.status === 'live') : [];
  const cricbuzz = cb.status === 'fulfilled' ? cb.value.filter((m) => m.status === 'live') : [];
  const merged = mergeProviders(cricketData, mergeProviders(sportScore, cricbuzz));
  if (merged.length > 0) {
    console.log(`[CricketAPI] Live: ${cricketData.length} CricketData + ${sportScore.length} SportScore + ${cricbuzz.length} Cricbuzz = ${merged.length} merged`);
    return merged;
  }

  // Fallback: RapidAPI
  try {
    const data = await rateLimitedFetch<unknown>('/v2/live');
    const arr = extractArray<CricketMatchRaw>(data, 'matches');
    const normalized = arr.map(normalizeMatch);
    console.log(`[CricketAPI]    Parsed ${normalized.length} matches from /v2/live`);
    if (normalized.length > 0) return normalized;
  } catch (e) {
    console.error('[CricketAPI] getLiveMatches RapidAPI failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  return [];
}

export async function getTodayMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  const today = new Date().toISOString().split('T')[0];

  const [cd, ss, cb] = await Promise.allSettled([getCricketDataMatches(), getSportScoreMatches(), getCricbuzzMatches()]);
  const cricketData = cd.status === 'fulfilled' ? cd.value.filter((m) => m.status === 'upcoming' && m.date.startsWith(today)) : [];
  const sportScore = ss.status === 'fulfilled' ? ss.value.filter((m) => m.status === 'upcoming' && m.date.startsWith(today)) : [];
  const cricbuzz = cb.status === 'fulfilled' ? cb.value.filter((m) => m.status === 'upcoming') : [];
  const fixtures = getFixturesData().filter((m) => m.date.startsWith(today));
  const merged = mergeProviders(cricketData, mergeProviders(sportScore, mergeProviders(cricbuzz, fixtures)));
  console.log(`[CricketAPI] Today: ${cricketData.length} CricketData + ${sportScore.length} SportScore + ${cricbuzz.length} Cricbuzz + ${fixtures.length} Fixtures = ${merged.length} merged`);
  if (merged.length > 0) return merged;

  // Fallback: RapidAPI
  try {
    const data = await rateLimitedFetch<unknown>(`/v2/fixtures?date=${today}`);
    const arr = extractArray<CricketMatchRaw>(data, 'fixtures');
    const normalized = arr.map(normalizeMatch);
    console.log(`[CricketAPI]    Parsed ${normalized.length} matches from /v2/fixtures?date=${today}`);
    if (normalized.length > 0) return normalized;
  } catch (e) {
    console.error('[CricketAPI] getTodayMatches RapidAPI failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  return merged;
}

export async function getUpcomingMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  const [cd, ss, cb] = await Promise.allSettled([getCricketDataMatches(), getSportScoreMatches(), getCricbuzzMatches()]);
  const cricketData = cd.status === 'fulfilled' ? cd.value.filter((m) => m.status === 'upcoming') : [];
  const sportScore = ss.status === 'fulfilled' ? ss.value.filter((m) => m.status === 'upcoming') : [];
  const cricbuzz = cb.status === 'fulfilled' ? cb.value.filter((m) => m.status === 'upcoming') : [];
  const fixtures = getFixturesData();
  const merged = mergeProviders(cricketData, mergeProviders(sportScore, mergeProviders(cricbuzz, fixtures)));
  console.log(`[CricketAPI] Upcoming: ${cricketData.length} CricketData + ${sportScore.length} SportScore + ${cricbuzz.length} Cricbuzz + ${fixtures.length} Fixtures = ${merged.length} merged`);
  if (merged.length > 0) return merged;

  // Fallback: RapidAPI
  try {
    const data = await rateLimitedFetch<unknown>('/v2/fixtures');
    const arr = extractArray<CricketMatchRaw>(data, 'fixtures');
    const normalized = arr.map(normalizeMatch);
    console.log(`[CricketAPI]    Parsed ${normalized.length} matches from /v2/fixtures`);
    if (normalized.length > 0) return normalized;
  } catch (e) {
    console.error('[CricketAPI] getUpcomingMatches RapidAPI failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  return merged;
}

export async function getFinishedMatches(): Promise<ReturnType<typeof normalizeMatch>[]> {
  const [cd, ss, cb] = await Promise.allSettled([getCricketDataMatches(), getSportScoreMatches(), getCricbuzzMatches()]);
  const cricketData = cd.status === 'fulfilled' ? cd.value.filter((m) => m.status === 'finished') : [];
  const sportScore = ss.status === 'fulfilled' ? ss.value.filter((m) => m.status === 'finished') : [];
  const cricbuzz = cb.status === 'fulfilled' ? cb.value.filter((m) => m.status === 'finished') : [];
  const merged = mergeProviders(cricketData, mergeProviders(sportScore, cricbuzz));
  if (merged.length > 0) {
    console.log(`[CricketAPI] Finished: ${cricketData.length} CricketData + ${sportScore.length} SportScore + ${cricbuzz.length} Cricbuzz = ${merged.length} merged`);
    return merged;
  }

  // Fallback: RapidAPI
  try {
    const data = await rateLimitedFetch<unknown>('/v2/results');
    const arr = extractArray<CricketMatchRaw>(data, 'results');
    const normalized = arr.map(normalizeMatch);
    console.log(`[CricketAPI]    Parsed ${normalized.length} matches from /v2/results`);
    if (normalized.length > 0) return normalized;
  } catch (e) {
    console.error('[CricketAPI] getFinishedMatches RapidAPI failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  return [];
}

const SERIES_CACHE_KEY = 'cricket_series_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getCachedSeries(): { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[] | null {
  try {
    const raw = localStorage.getItem(SERIES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt < CACHE_TTL_MS) {
      console.log(`[CricketAPI] Series cache hit (${Math.round((Date.now() - parsed.cachedAt) / 60000)} min old)`);
      return parsed.data;
    }
    console.log('[CricketAPI] Series cache expired, refetching');
    localStorage.removeItem(SERIES_CACHE_KEY);
  } catch {
    // ignore
  }
  return null;
}

function setCachedSeries(data: { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[]): void {
  try {
    localStorage.setItem(SERIES_CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
    console.log('[CricketAPI] Series data cached for 24h');
  } catch {
    // ignore
  }
}

function mergeCuratedSeries(apiData: { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[]): { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[] {
  const curated = getScheduledSeriesFromFile();
  if (curated.length === 0) return apiData;
  const seen = new Set(apiData.map((s) => s.id));
  const merged = [...apiData];
  for (const s of curated) {
    if (!seen.has(s.id)) {
      seen.add(s.id);
      merged.push(s);
    }
  }
  return merged;
}

export async function getRunningSeries(): Promise<{ id: string; name: string; type: string; status: string; startDate: string; endDate: string }[]> {
  let result: { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[] = [];

  // Try localStorage cache (merge curated on top)
  const cached = getCachedSeries();
  if (cached) {
    result = mergeCuratedSeries(cached);
    console.log(`[CricketAPI] Series cache hit, merged ${result.length} total (${cached.length} cached + ${result.length - cached.length} curated)`);
    return result;
  }

  // Primary: CricketData
  const cd = await fetchCricketDataSeries();
  if (cd.length > 0) {
    const now = Date.now();
    const ms30d = 30 * 24 * 60 * 60 * 1000;
    const filtered = cd.filter((s) => {
      const t = new Date(s.startDate || s.endDate).getTime();
      if (isNaN(t)) return true;
      return t < now + ms30d;
    });
    const sorted = [...filtered].sort((a, b) => {
      const order = { ongoing: 0, upcoming: 1, completed: 2 };
      return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3);
    });
    console.log(`[CricketAPI] Series: ${cd.length} from CricketData, ${sorted.length} filtered`);
    result = mergeCuratedSeries(sorted);
    setCachedSeries(result);
    return result;
  }

  // Fallback: RapidAPI
  try {
    const data = await rateLimitedFetch<unknown>('/v2/series');
    const arr = extractArray<Record<string, unknown>>(data, 'series');
    const normalized = arr.map((s) => ({
      id: String(s.id ?? s.series_id ?? s.league_key ?? ''),
      name: String(s.name ?? s.series_name ?? s.league_name ?? ''),
      type: String(s.type ?? s.series_type ?? s.format ?? ''),
      status: String(s.status ?? s.series_status ?? ''),
      startDate: String(s.startDate ?? s.start_date ?? s.league_year ?? ''),
      endDate: String(s.endDate ?? s.end_date ?? ''),
    }));
    console.log(`[CricketAPI]    Parsed ${normalized.length} series from /v2/series`);
    if (normalized.length > 0) {
      result = mergeCuratedSeries(normalized);
      setCachedSeries(result);
      return result;
    }
  } catch (e) {
    console.error('[CricketAPI] getRunningSeries RapidAPI failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  // Ultimate fallback: Curated series schedule only
  const curated = getScheduledSeriesFromFile();
  if (curated.length > 0) {
    console.log(`[CricketAPI]    Using ${curated.length} curated series entries`);
    return curated;
  }

  return [];
}

export async function getTeams(): Promise<{ id: string; name: string; country: string; type: string }[]> {
  try {
    const data = await rateLimitedFetch<unknown>('/v2/teams');
    const arr = extractArray<Record<string, unknown>>(data, 'teams');
    const normalized = arr.map((t) => ({
      id: String(t.id ?? t.team_key ?? t.team_id ?? ''),
      name: String(t.name ?? t.team_name ?? ''),
      country: String(t.country ?? t.country_name ?? ''),
      type: String(t.type ?? t.team_type ?? ''),
    }));
    console.log(`[CricketAPI]    Parsed ${normalized.length} teams from /v2/teams`);
    return normalized;
  } catch (e) {
    console.error('[CricketAPI] getTeams failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
    return [];
  }
}

export async function getIccRankings(): Promise<{ rank: number; player: string; country: string; rating: number; format: string; category: string; gender: string }[]> {
  try {
    const data = await rateLimitedFetch<unknown>('/v2/rankings');
    const arr = extractArray<Record<string, unknown>>(data, 'rankings');
    const normalized = arr.map((r) => {
      const rawGender = String(r.gender ?? r.sex ?? '');
      const player = String(r.player ?? r.name ?? r.player_name ?? '');
      const country = String(r.country ?? r.team ?? r.country_name ?? '');
      const inferredGender = rawGender || (player.toLowerCase().includes('women') || country.toLowerCase().includes('women') ? 'women' : 'men');
      return {
        rank: Number(r.rank ?? r.position ?? 0),
        player,
        country,
        rating: Number(r.rating ?? r.points ?? 0),
        format: String(r.format ?? r.type ?? ''),
        category: String(r.category ?? r.role ?? ''),
        gender: inferredGender,
      };
    });
    console.log(`[CricketAPI]    Parsed ${normalized.length} rankings from /v2/rankings`);
    return normalized;
  } catch (e) {
    console.error('[CricketAPI] getIccRankings failed:', e instanceof ApiError ? `${e.status} ${e.url}` : e);
  }

  return getFallbackIccRankings();
}

function getFallbackIccRankings(): { rank: number; player: string; country: string; rating: number; format: string; category: string; gender: string }[] {
  return [
    // === TEST BATTERS (Jul 2026) ===
    { rank: 1, player: 'Travis Head', country: 'Australia', rating: 853, format: 'test', category: 'batters', gender: 'men' },
    { rank: 2, player: 'Harry Brook', country: 'England', rating: 852, format: 'test', category: 'batters', gender: 'men' },
    { rank: 3, player: 'Joe Root', country: 'England', rating: 840, format: 'test', category: 'batters', gender: 'men' },
    { rank: 4, player: 'Steve Smith', country: 'Australia', rating: 831, format: 'test', category: 'batters', gender: 'men' },
    { rank: 5, player: 'Temba Bavuma', country: 'South Africa', rating: 775, format: 'test', category: 'batters', gender: 'men' },
    { rank: 6, player: 'Kamindu Mendis', country: 'Sri Lanka', rating: 744, format: 'test', category: 'batters', gender: 'men' },
    { rank: 7, player: 'Shubman Gill', country: 'India', rating: 743, format: 'test', category: 'batters', gender: 'men' },
    { rank: 8, player: 'Rachin Ravindra', country: 'New Zealand', rating: 740, format: 'test', category: 'batters', gender: 'men' },
    { rank: 9, player: 'Yashasvi Jaiswal', country: 'India', rating: 733, format: 'test', category: 'batters', gender: 'men' },
    { rank: 10, player: 'Dinesh Chandimal', country: 'Sri Lanka', rating: 713, format: 'test', category: 'batters', gender: 'men' },

    // === TEST BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Jasprit Bumrah', country: 'India', rating: 883, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 2, player: 'Kagiso Rabada', country: 'South Africa', rating: 872, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 3, player: 'Josh Hazlewood', country: 'Australia', rating: 860, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 4, player: 'Ravichandran Ashwin', country: 'India', rating: 807, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 5, player: 'Prabath Jayasuriya', country: 'Sri Lanka', rating: 801, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 6, player: 'Pat Cummins', country: 'Australia', rating: 796, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 7, player: 'Ravindra Jadeja', country: 'India', rating: 794, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 8, player: 'Nathan Lyon', country: 'Australia', rating: 782, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 9, player: 'Noman Ali', country: 'Pakistan', rating: 759, format: 'test', category: 'bowlers', gender: 'men' },
    { rank: 10, player: 'Matt Henry', country: 'New Zealand', rating: 750, format: 'test', category: 'bowlers', gender: 'men' },

    // === TEST ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Mehidy Hasan Miraz', country: 'Bangladesh', rating: 284, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 2, player: 'Pat Cummins', country: 'Australia', rating: 250, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 3, player: 'Wiaan Mulder', country: 'South Africa', rating: 245, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 4, player: 'Washington Sundar', country: 'India', rating: 244, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 5, player: 'Gus Atkinson', country: 'England', rating: 243, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 6, player: 'Joe Root', country: 'England', rating: 209, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 7, player: 'Axar Patel', country: 'India', rating: 198, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 8, player: 'Kagiso Rabada', country: 'South Africa', rating: 197, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 9, player: 'Shamar Joseph', country: 'West Indies', rating: 191, format: 'test', category: 'all-rounders', gender: 'men' },
    { rank: 10, player: 'Kyle Jamieson', country: 'New Zealand', rating: 189, format: 'test', category: 'all-rounders', gender: 'men' },

    // === ODI BATTERS (Jul 2026) ===
    { rank: 1, player: 'Daryl Mitchell', country: 'New Zealand', rating: 815, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 2, player: 'Shubman Gill', country: 'India', rating: 791, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 3, player: 'Virat Kohli', country: 'India', rating: 768, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 4, player: 'Rohit Sharma', country: 'India', rating: 754, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 5, player: 'Ibrahim Zadran', country: 'Afghanistan', rating: 712, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 6, player: 'Babar Azam', country: 'Pakistan', rating: 689, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 7, player: 'Shai Hope', country: 'West Indies', rating: 683, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 8, player: 'Harry Tector', country: 'Ireland', rating: 679, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 9, player: 'Charith Asalanka', country: 'Sri Lanka', rating: 659, format: 'odi', category: 'batters', gender: 'men' },
    { rank: 10, player: 'Harry Brook', country: 'England', rating: 656, format: 'odi', category: 'batters', gender: 'men' },

    // === ODI BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Rashid Khan', country: 'Afghanistan', rating: 682, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 2, player: 'Abrar Ahmed', country: 'Pakistan', rating: 675, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 3, player: 'Jofra Archer', country: 'England', rating: 649, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 4, player: 'Keshav Maharaj', country: 'South Africa', rating: 645, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 5, player: 'Maheesh Theekshana', country: 'Sri Lanka', rating: 641, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 6, player: 'Adil Rashid', country: 'England', rating: 629, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 7, player: 'Kuldeep Yadav', country: 'India', rating: 624, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 8, player: 'Mehidy Hasan Miraz', country: 'Bangladesh', rating: 618, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 9, player: 'Shaheen Afridi', country: 'Pakistan', rating: 604, format: 'odi', category: 'bowlers', gender: 'men' },
    { rank: 10, player: 'Josh Hazlewood', country: 'Australia', rating: 601, format: 'odi', category: 'bowlers', gender: 'men' },

    // === ODI ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Azmatullah Omarzai', country: 'Afghanistan', rating: 316, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 2, player: 'Sikandar Raza', country: 'Zimbabwe', rating: 265, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 3, player: 'Mohammad Nabi', country: 'Afghanistan', rating: 258, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 4, player: 'Mehidy Hasan Miraz', country: 'Bangladesh', rating: 258, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 5, player: 'Michael Bracewell', country: 'New Zealand', rating: 230, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 6, player: 'Brandon McMullen', country: 'Scotland', rating: 228, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 7, player: 'Mitchell Santner', country: 'New Zealand', rating: 225, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 8, player: 'Rashid Khan', country: 'Afghanistan', rating: 220, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 9, player: 'Wanindu Hasaranga', country: 'Sri Lanka', rating: 205, format: 'odi', category: 'all-rounders', gender: 'men' },
    { rank: 10, player: 'Salman Agha', country: 'Pakistan', rating: 193, format: 'odi', category: 'all-rounders', gender: 'men' },

    // === T20I BATTERS (Jul 2026) ===
    { rank: 1, player: 'Ishan Kishan', country: 'India', rating: 876, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 2, player: 'Abhishek Sharma', country: 'India', rating: 869, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 3, player: 'Sahibzada Farhan', country: 'Pakistan', rating: 848, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 4, player: 'Phil Salt', country: 'England', rating: 792, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 5, player: 'Pathum Nissanka', country: 'Sri Lanka', rating: 751, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 6, player: 'Tilak Varma', country: 'India', rating: 747, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 7, player: 'Jos Buttler', country: 'England', rating: 716, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 8, player: 'Suryakumar Yadav', country: 'India', rating: 708, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 9, player: 'Mitchell Marsh', country: 'Australia', rating: 706, format: 't20i', category: 'batters', gender: 'men' },
    { rank: 10, player: 'Dewald Brevis', country: 'South Africa', rating: 702, format: 't20i', category: 'batters', gender: 'men' },

    // === T20I BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Rashid Khan', country: 'Afghanistan', rating: 753, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 2, player: 'Abrar Ahmed', country: 'Pakistan', rating: 736, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 3, player: 'Adil Rashid', country: 'England', rating: 712, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 4, player: 'Varun Chakravarthy', country: 'India', rating: 695, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 5, player: 'Corbin Bosch', country: 'South Africa', rating: 690, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 6, player: 'Jasprit Bumrah', country: 'India', rating: 685, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 7, player: 'Matthew Forde', country: 'West Indies', rating: 670, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 8, player: 'Adam Zampa', country: 'Australia', rating: 660, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 9, player: 'Mustafizur Rahman', country: 'Bangladesh', rating: 650, format: 't20i', category: 'bowlers', gender: 'men' },
    { rank: 10, player: 'Mujeeb Ur Rahman', country: 'Afghanistan', rating: 640, format: 't20i', category: 'bowlers', gender: 'men' },

    // === T20I ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Sikandar Raza', country: 'Zimbabwe', rating: 328, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 2, player: 'Saim Ayub', country: 'Pakistan', rating: 275, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 3, player: 'Hardik Pandya', country: 'India', rating: 270, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 4, player: 'Dipendra Singh Airee', country: 'Nepal', rating: 256, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 5, player: 'Roston Chase', country: 'West Indies', rating: 249, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 6, player: 'Azmatullah Omarzai', country: 'Afghanistan', rating: 241, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 7, player: 'Will Jacks', country: 'England', rating: 222, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 8, player: 'Mohammad Nabi', country: 'Afghanistan', rating: 209, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 9, player: 'Jason Holder', country: 'West Indies', rating: 209, format: 't20i', category: 'all-rounders', gender: 'men' },
    { rank: 10, player: 'Mohammad Nawaz', country: 'Pakistan', rating: 203, format: 't20i', category: 'all-rounders', gender: 'men' },

    // === WOMEN'S TEST BATTERS (Jul 2026) ===
    { rank: 1, player: 'Tammy Beaumont', country: 'England', rating: 815, format: 'test', category: 'batters', gender: 'women' },
    { rank: 2, player: 'Heather Knight', country: 'England', rating: 792, format: 'test', category: 'batters', gender: 'women' },
    { rank: 3, player: 'Ellyse Perry', country: 'Australia', rating: 778, format: 'test', category: 'batters', gender: 'women' },
    { rank: 4, player: 'Nat Sciver-Brunt', country: 'England', rating: 765, format: 'test', category: 'batters', gender: 'women' },
    { rank: 5, player: 'Smriti Mandhana', country: 'India', rating: 750, format: 'test', category: 'batters', gender: 'women' },
    { rank: 6, player: 'Beth Mooney', country: 'Australia', rating: 738, format: 'test', category: 'batters', gender: 'women' },
    { rank: 7, player: 'Meg Lanning', country: 'Australia', rating: 725, format: 'test', category: 'batters', gender: 'women' },
    { rank: 8, player: 'Laura Wolvaardt', country: 'South Africa', rating: 710, format: 'test', category: 'batters', gender: 'women' },
    { rank: 9, player: 'Alyssa Healy', country: 'Australia', rating: 698, format: 'test', category: 'batters', gender: 'women' },
    { rank: 10, player: 'Jemimah Rodrigues', country: 'India', rating: 672, format: 'test', category: 'batters', gender: 'women' },

    // === WOMEN'S TEST BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Sophie Ecclestone', country: 'England', rating: 812, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 2, player: 'Katherine Sciver-Brunt', country: 'England', rating: 780, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 3, player: 'Megan Schutt', country: 'Australia', rating: 758, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 4, player: 'Jess Jonassen', country: 'Australia', rating: 742, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 5, player: 'Shabnim Ismail', country: 'South Africa', rating: 728, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 6, player: 'Marizanne Kapp', country: 'South Africa', rating: 715, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 7, player: 'Deepti Sharma', country: 'India', rating: 702, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 8, player: 'Sune Luus', country: 'South Africa', rating: 685, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 9, player: 'Rajeshwari Gayakwad', country: 'India', rating: 670, format: 'test', category: 'bowlers', gender: 'women' },
    { rank: 10, player: 'Lauren Filer', country: 'England', rating: 652, format: 'test', category: 'bowlers', gender: 'women' },

    // === WOMEN'S TEST ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Ellyse Perry', country: 'Australia', rating: 435, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 2, player: 'Nat Sciver-Brunt', country: 'England', rating: 415, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 3, player: 'Marizanne Kapp', country: 'South Africa', rating: 398, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 4, player: 'Deepti Sharma', country: 'India', rating: 375, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 5, player: 'Ash Gardner', country: 'Australia', rating: 360, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 6, player: 'Heather Knight', country: 'England', rating: 345, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 7, player: 'Sune Luus', country: 'South Africa', rating: 320, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 8, player: 'Hayley Matthews', country: 'West Indies', rating: 305, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 9, player: 'Alice Capsey', country: 'England', rating: 280, format: 'test', category: 'all-rounders', gender: 'women' },
    { rank: 10, player: 'Kim Garth', country: 'England', rating: 268, format: 'test', category: 'all-rounders', gender: 'women' },

    // === WOMEN'S ODI BATTERS (Jul 2026) ===
    { rank: 1, player: 'Smriti Mandhana', country: 'India', rating: 782, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 2, player: 'Laura Wolvaardt', country: 'South Africa', rating: 765, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 3, player: 'Nat Sciver-Brunt', country: 'England', rating: 751, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 4, player: 'Beth Mooney', country: 'Australia', rating: 748, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 5, player: 'Harmanpreet Kaur', country: 'India', rating: 722, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 6, player: 'Chamari Athapaththu', country: 'Sri Lanka', rating: 710, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 7, player: 'Meg Lanning', country: 'Australia', rating: 698, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 8, player: 'Alyssa Healy', country: 'Australia', rating: 685, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 9, player: 'Hayley Matthews', country: 'West Indies', rating: 672, format: 'odi', category: 'batters', gender: 'women' },
    { rank: 10, player: 'Tammy Beaumont', country: 'England', rating: 660, format: 'odi', category: 'batters', gender: 'women' },

    // === WOMEN'S ODI BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Sophie Ecclestone', country: 'England', rating: 798, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 2, player: 'Jess Jonassen', country: 'Australia', rating: 745, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 3, player: 'Deepti Sharma', country: 'India', rating: 728, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 4, player: 'Marizanne Kapp', country: 'South Africa', rating: 715, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 5, player: 'Shabnim Ismail', country: 'South Africa', rating: 698, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 6, player: 'Megan Schutt', country: 'Australia', rating: 690, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 7, player: 'Nonkululeko Mlaba', country: 'South Africa', rating: 672, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 8, player: 'Ash Gardner', country: 'Australia', rating: 665, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 9, player: 'Sadia Iqbal', country: 'Pakistan', rating: 652, format: 'odi', category: 'bowlers', gender: 'women' },
    { rank: 10, player: 'Renuka Singh', country: 'India', rating: 640, format: 'odi', category: 'bowlers', gender: 'women' },

    // === WOMEN'S ODI ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Marizanne Kapp', country: 'South Africa', rating: 410, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 2, player: 'Hayley Matthews', country: 'West Indies', rating: 395, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 3, player: 'Ash Gardner', country: 'Australia', rating: 378, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 4, player: 'Nat Sciver-Brunt', country: 'England', rating: 365, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 5, player: 'Deepti Sharma', country: 'India', rating: 352, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 6, player: 'Nida Dar', country: 'Pakistan', rating: 310, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 7, player: 'Sune Luus', country: 'South Africa', rating: 290, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 8, player: 'Kim Garth', country: 'Australia', rating: 275, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 9, player: 'Alice Capsey', country: 'England', rating: 262, format: 'odi', category: 'all-rounders', gender: 'women' },
    { rank: 10, player: 'Annerie Dercksen', country: 'South Africa', rating: 248, format: 'odi', category: 'all-rounders', gender: 'women' },

    // === WOMEN'S T20I BATTERS (Jul 2026) ===
    { rank: 1, player: 'Beth Mooney', country: 'Australia', rating: 812, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 2, player: 'Laura Wolvaardt', country: 'South Africa', rating: 785, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 3, player: 'Smriti Mandhana', country: 'India', rating: 772, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 4, player: 'Tahlia McGrath', country: 'Australia', rating: 760, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 5, player: 'Nat Sciver-Brunt', country: 'England', rating: 748, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 6, player: 'Harmanpreet Kaur', country: 'India', rating: 735, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 7, player: 'Chamari Athapaththu', country: 'Sri Lanka', rating: 720, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 8, player: 'Hayley Matthews', country: 'West Indies', rating: 708, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 9, player: 'Alyssa Healy', country: 'Australia', rating: 695, format: 't20i', category: 'batters', gender: 'women' },
    { rank: 10, player: 'Shafali Verma', country: 'India', rating: 680, format: 't20i', category: 'batters', gender: 'women' },

    // === WOMEN'S T20I BOWLERS (Jul 2026) ===
    { rank: 1, player: 'Sophie Ecclestone', country: 'England', rating: 804, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 2, player: 'Megan Schutt', country: 'Australia', rating: 760, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 3, player: 'Nonkululeko Mlaba', country: 'South Africa', rating: 738, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 4, player: 'Sadia Iqbal', country: 'Pakistan', rating: 722, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 5, player: 'Shabnim Ismail', country: 'South Africa', rating: 710, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 6, player: 'Deepti Sharma', country: 'India', rating: 698, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 7, player: 'Ash Gardner', country: 'Australia', rating: 685, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 8, player: 'Nashra Sandhu', country: 'Pakistan', rating: 670, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 9, player: 'Jess Jonassen', country: 'Australia', rating: 662, format: 't20i', category: 'bowlers', gender: 'women' },
    { rank: 10, player: 'Renuka Singh', country: 'India', rating: 648, format: 't20i', category: 'bowlers', gender: 'women' },

    // === WOMEN'S T20I ALL-ROUNDERS (Jul 2026) ===
    { rank: 1, player: 'Hayley Matthews', country: 'West Indies', rating: 415, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 2, player: 'Marizanne Kapp', country: 'South Africa', rating: 398, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 3, player: 'Nat Sciver-Brunt', country: 'England', rating: 385, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 4, player: 'Ash Gardner', country: 'Australia', rating: 372, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 5, player: 'Tahlia McGrath', country: 'Australia', rating: 360, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 6, player: 'Deepti Sharma', country: 'India', rating: 348, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 7, player: 'Nida Dar', country: 'Pakistan', rating: 325, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 8, player: 'Sune Luus', country: 'South Africa', rating: 305, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 9, player: 'Alice Capsey', country: 'England', rating: 285, format: 't20i', category: 'all-rounders', gender: 'women' },
    { rank: 10, player: 'Annerie Dercksen', country: 'South Africa', rating: 270, format: 't20i', category: 'all-rounders', gender: 'women' },
  ];
}

export async function getUnifiedRankings(): Promise<{
  players: Awaited<ReturnType<typeof getIccRankings>>;
  teams: Awaited<ReturnType<typeof getTeamRankings>>;
}> {
  const [players, teams] = await Promise.allSettled([getIccRankings(), getTeamRankings()]);
  return {
    players: players.status === 'fulfilled' ? players.value : [],
    teams: teams.status === 'fulfilled' ? teams.value : [],
  };
}

export async function getTeamRankings(): Promise<TeamRankingEntry[]> {
  try {
    const data = await rateLimitedFetch<unknown>('/v2/team-rankings');
    const arr = extractArray<Record<string, unknown>>(data, 'rankings');
    const normalized = arr.map((r) => ({
      rank: Number(r.rank ?? r.position ?? 0),
      team: String(r.team ?? r.name ?? r.country ?? r.team_name ?? ''),
      rating: Number(r.rating ?? r.points ?? 0),
      format: String(r.format ?? r.type ?? ''),
      gender: String(r.gender ?? r.sex ?? 'men'),
    }));
    console.log(`[CricketAPI] Team rankings: ${normalized.length} entries`);
    return normalized;
  } catch (e) {
    console.error('[CricketAPI] getTeamRankings failed:', e);
  }
  return getFallbackTeamRankings();
}

function getFallbackTeamRankings(): { rank: number; team: string; rating: number; format: string; gender: string }[] {
  return [
    // === TEST (Jul 2026) ===
    { rank: 1, team: 'Australia', rating: 131, format: 'test', gender: 'men' },
    { rank: 2, team: 'South Africa', rating: 119, format: 'test', gender: 'men' },
    { rank: 3, team: 'New Zealand', rating: 106, format: 'test', gender: 'men' },
    { rank: 4, team: 'India', rating: 104, format: 'test', gender: 'men' },
    { rank: 5, team: 'England', rating: 99, format: 'test', gender: 'men' },
    { rank: 6, team: 'Pakistan', rating: 93, format: 'test', gender: 'men' },
    { rank: 7, team: 'Sri Lanka', rating: 88, format: 'test', gender: 'men' },
    { rank: 8, team: 'West Indies', rating: 82, format: 'test', gender: 'men' },
    { rank: 9, team: 'Bangladesh', rating: 72, format: 'test', gender: 'men' },
    { rank: 10, team: 'Zimbabwe', rating: 60, format: 'test', gender: 'men' },

    // === ODI (Jul 2026) ===
    { rank: 1, team: 'India', rating: 128, format: 'odi', gender: 'men' },
    { rank: 2, team: 'Australia', rating: 122, format: 'odi', gender: 'men' },
    { rank: 3, team: 'South Africa', rating: 115, format: 'odi', gender: 'men' },
    { rank: 4, team: 'Pakistan', rating: 108, format: 'odi', gender: 'men' },
    { rank: 5, team: 'New Zealand', rating: 105, format: 'odi', gender: 'men' },
    { rank: 6, team: 'Sri Lanka', rating: 100, format: 'odi', gender: 'men' },
    { rank: 7, team: 'England', rating: 98, format: 'odi', gender: 'men' },
    { rank: 8, team: 'Bangladesh', rating: 92, format: 'odi', gender: 'men' },
    { rank: 9, team: 'Afghanistan', rating: 88, format: 'odi', gender: 'men' },
    { rank: 10, team: 'West Indies', rating: 82, format: 'odi', gender: 'men' },

    // === T20I (Jul 2026) ===
    { rank: 1, team: 'India', rating: 135, format: 't20i', gender: 'men' },
    { rank: 2, team: 'Australia', rating: 128, format: 't20i', gender: 'men' },
    { rank: 3, team: 'England', rating: 124, format: 't20i', gender: 'men' },
    { rank: 4, team: 'West Indies', rating: 118, format: 't20i', gender: 'men' },
    { rank: 5, team: 'South Africa', rating: 114, format: 't20i', gender: 'men' },
    { rank: 6, team: 'New Zealand', rating: 110, format: 't20i', gender: 'men' },
    { rank: 7, team: 'Pakistan', rating: 106, format: 't20i', gender: 'men' },
    { rank: 8, team: 'Sri Lanka', rating: 100, format: 't20i', gender: 'men' },
    { rank: 9, team: 'Bangladesh', rating: 95, format: 't20i', gender: 'men' },
    { rank: 10, team: 'Afghanistan', rating: 92, format: 't20i', gender: 'men' },

    // === WOMEN'S TEST (Jul 2026) ===
    { rank: 1, team: 'Australia', rating: 138, format: 'test', gender: 'women' },
    { rank: 2, team: 'England', rating: 125, format: 'test', gender: 'women' },
    { rank: 3, team: 'India', rating: 112, format: 'test', gender: 'women' },
    { rank: 4, team: 'South Africa', rating: 98, format: 'test', gender: 'women' },
    { rank: 5, team: 'West Indies', rating: 85, format: 'test', gender: 'women' },

    // === WOMEN'S ODI (Jul 2026) ===
    { rank: 1, team: 'Australia', rating: 142, format: 'odi', gender: 'women' },
    { rank: 2, team: 'England', rating: 128, format: 'odi', gender: 'women' },
    { rank: 3, team: 'India', rating: 120, format: 'odi', gender: 'women' },
    { rank: 4, team: 'South Africa', rating: 115, format: 'odi', gender: 'women' },
    { rank: 5, team: 'New Zealand', rating: 104, format: 'odi', gender: 'women' },
    { rank: 6, team: 'West Indies', rating: 98, format: 'odi', gender: 'women' },
    { rank: 7, team: 'Sri Lanka', rating: 90, format: 'odi', gender: 'women' },
    { rank: 8, team: 'Pakistan', rating: 85, format: 'odi', gender: 'women' },
    { rank: 9, team: 'Bangladesh', rating: 78, format: 'odi', gender: 'women' },
    { rank: 10, team: 'Ireland', rating: 68, format: 'odi', gender: 'women' },

    // === WOMEN'S T20I (Jul 2026) ===
    { rank: 1, team: 'Australia', rating: 148, format: 't20i', gender: 'women' },
    { rank: 2, team: 'England', rating: 132, format: 't20i', gender: 'women' },
    { rank: 3, team: 'India', rating: 125, format: 't20i', gender: 'women' },
    { rank: 4, team: 'South Africa', rating: 118, format: 't20i', gender: 'women' },
    { rank: 5, team: 'New Zealand', rating: 108, format: 't20i', gender: 'women' },
    { rank: 6, team: 'West Indies', rating: 102, format: 't20i', gender: 'women' },
    { rank: 7, team: 'Sri Lanka', rating: 94, format: 't20i', gender: 'women' },
    { rank: 8, team: 'Pakistan', rating: 88, format: 't20i', gender: 'women' },
    { rank: 9, team: 'Bangladesh', rating: 80, format: 't20i', gender: 'women' },
    { rank: 10, team: 'Ireland', rating: 72, format: 't20i', gender: 'women' },
  ];
}

export const CRICKET_TEAM_LOGOS: Record<string, string> = {
  'India': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Board_of_Control_for_Cricket_in_India_Logo_%282024%29.svg/120px-Board_of_Control_for_Cricket_in_India_Logo_%282024%29.svg.png',
  'Pakistan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pakistan_cricket_team_logo.png/120px-Pakistan_cricket_team_logo.png',
  'West Indies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cricket_West_Indies_Logo_2017.svg/120px-Cricket_West_Indies_Logo_2017.svg.png',
  'Afghanistan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Afghanistan_cricket_board_logo.jpg/120px-Afghanistan_cricket_board_logo.jpg',
  'Australia': 'https://flagcdn.com/w80/au.png',
  'England': 'https://flagcdn.com/w80/gb-eng.png',
  'South Africa': 'https://flagcdn.com/w80/za.png',
  'New Zealand': 'https://flagcdn.com/w80/nz.png',
  'Sri Lanka': 'https://flagcdn.com/w80/lk.png',
  'Bangladesh': 'https://flagcdn.com/w80/bd.png',
  'Zimbabwe': 'https://flagcdn.com/w80/zw.png',
  'Ireland': 'https://flagcdn.com/w80/ie.png',
  'Netherlands': 'https://flagcdn.com/w80/nl.png',
  'Scotland': 'https://flagcdn.com/w80/gb-sct.png',
  'Namibia': 'https://flagcdn.com/w80/na.png',
  'Oman': 'https://flagcdn.com/w80/om.png',
  'Nepal': 'https://flagcdn.com/w80/np.png',
  'UAE': 'https://flagcdn.com/w80/ae.png',
  'USA': 'https://flagcdn.com/w80/us.png',
};
