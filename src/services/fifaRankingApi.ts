export interface FifaRankingEntry {
  rank: number;
  country: string;
  countryCode: string;
  confederation: string;
  points: number;
  previousRank: number;
  rankChange: 'up' | 'down' | 'same';
  pointsChange: number;
}

export interface FifaRankingsResult {
  rankings: FifaRankingEntry[];
  lastUpdated: string;
  source: 'api' | 'cache' | 'fallback';
}

const CACHE_KEY = 'sw_fifa_rankings_men';
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_VERSION = 1;

interface CacheEntry {
  version?: number;
  rankings: FifaRankingEntry[];
  lastUpdated: string;
  timestamp: number;
}

function loadLocalCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (parsed.version !== CACHE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveLocalCache(rankings: FifaRankingEntry[], lastUpdated: string): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      rankings,
      lastUpdated,
      timestamp: Date.now(),
    }));
  } catch {
    console.warn('[FifaRankings] Failed to save cache');
  }
}

function parseFifaApiResponse(data: unknown): { rankings: FifaRankingEntry[]; lastUpdated: string } | null {
  try {
    const root = data as Record<string, unknown>;
    const results = root.Results;
    if (!Array.isArray(results) || results.length === 0) return null;

    let lastUpdated = '';
    const rankings: FifaRankingEntry[] = [];

    for (const item of results) {
      const r = item as Record<string, unknown>;
      const teamNameArr = r.TeamName as Array<{ Locale: string; Description: string }> | undefined;
      const teamName = teamNameArr?.[0]?.Description ?? '';
      const confederation = String(r.ConfederationName ?? '');
      const rank = typeof r.Rank === 'number' ? r.Rank : rankings.length + 1;
      const prevRank = typeof r.PrevRank === 'number' ? r.PrevRank : rank;
      const movement = typeof r.RankingMovement === 'number' ? r.RankingMovement : 0;
      const points = typeof r.DecimalTotalPoints === 'number' ? r.DecimalTotalPoints : (typeof r.TotalPoints === 'number' ? r.TotalPoints : 0);
      const prevPoints = typeof r.DecimalPrevPoints === 'number' ? r.DecimalPrevPoints : (typeof r.PrevPoints === 'number' ? r.PrevPoints : points);
      const pubDate = String(r.PubDate ?? '');
      if (!lastUpdated && pubDate) lastUpdated = pubDate;

      if (!teamName || !confederation) continue;

      rankings.push({
        rank,
        country: teamName,
        countryCode: String(r.IdCountry ?? '').toLowerCase(),
        confederation,
        points,
        previousRank: prevRank,
        rankChange: movement > 0 ? 'up' : movement < 0 ? 'down' : 'same',
        pointsChange: points - prevPoints,
      });
    }

    if (rankings.length === 0) return null;

    return { rankings, lastUpdated: lastUpdated || new Date().toISOString() };
  } catch {
    return null;
  }
}

async function fetchFromFifaApi(): Promise<{ rankings: FifaRankingEntry[]; lastUpdated: string } | null> {
  const url = 'https://api.fifa.com/api/v3/rankings/?gender=1&count=300&language=en';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[FifaRankings] API returned ${res.status}`);
      return null;
    }
    return parseFifaApiResponse(await res.json());
  } catch (err) {
    console.warn('[FifaRankings] API fetch failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getFifaRankings(): Promise<FifaRankingsResult> {
  const cached = loadLocalCache();

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[FifaRankings] 📦 Cache fresh — ${cached.rankings.length} teams, ${Math.round((Date.now() - cached.timestamp) / 60000)}m old`);
    return { rankings: cached.rankings, lastUpdated: cached.lastUpdated, source: 'cache' };
  }

  const apiResult = await fetchFromFifaApi();

  if (apiResult) {
    saveLocalCache(apiResult.rankings, apiResult.lastUpdated);
    console.log(`[FifaRankings] ✅ API — ${apiResult.rankings.length} teams, updated ${apiResult.lastUpdated}`);
    return { rankings: apiResult.rankings, lastUpdated: apiResult.lastUpdated, source: 'api' };
  }

  if (cached && cached.rankings.length > 0) {
    console.log(`[FifaRankings] 📦 Cache expired but API failed — ${cached.rankings.length} teams, ${Math.round((Date.now() - cached.timestamp) / 60000)}m old`);
    return { rankings: cached.rankings, lastUpdated: cached.lastUpdated, source: 'cache' };
  }

  console.warn('[FifaRankings] ⚠️ No cache and API failed — returning empty');
  return {
    rankings: [],
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  };
}

const WOMEN_CACHE_KEY = 'sw_fifa_rankings_women';

function loadWomenLocalCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(WOMEN_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (parsed.version !== CACHE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveWomenLocalCache(rankings: FifaRankingEntry[], lastUpdated: string): void {
  try {
    localStorage.setItem(WOMEN_CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      rankings,
      lastUpdated,
      timestamp: Date.now(),
    }));
  } catch {
    console.warn('[FifaRankings] Failed to save women cache');
  }
}

async function fetchWomenFromFifaApi(): Promise<{ rankings: FifaRankingEntry[]; lastUpdated: string } | null> {
  const url = 'https://api.fifa.com/api/v3/rankings/?gender=2&count=300&language=en';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[FifaRankings] Women API returned ${res.status}`);
      return null;
    }
    return parseFifaApiResponse(await res.json());
  } catch (err) {
    console.warn('[FifaRankings] Women API fetch failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getWomenFifaRankings(): Promise<FifaRankingsResult> {
  const cached = loadWomenLocalCache();

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[FifaRankings] 📦 Women cache fresh — ${cached.rankings.length} teams`);
    return { rankings: cached.rankings, lastUpdated: cached.lastUpdated, source: 'cache' };
  }

  const apiResult = await fetchWomenFromFifaApi();

  if (apiResult) {
    saveWomenLocalCache(apiResult.rankings, apiResult.lastUpdated);
    console.log(`[FifaRankings] ✅ Women API — ${apiResult.rankings.length} teams`);
    return { rankings: apiResult.rankings, lastUpdated: apiResult.lastUpdated, source: 'api' };
  }

  if (cached && cached.rankings.length > 0) {
    console.log(`[FifaRankings] 📦 Women cache expired but API failed — ${cached.rankings.length} teams`);
    return { rankings: cached.rankings, lastUpdated: cached.lastUpdated, source: 'cache' };
  }

  console.warn('[FifaRankings] ⚠️ No women cache and API failed — using static fallback');
  return {
    rankings: STATIC_WOMENS_FIFA_RANKINGS.map((r, i) => ({ ...r, rank: i + 1 })),
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  };
}

const STATIC_WOMENS_FIFA_RANKINGS: FifaRankingEntry[] = [
  { rank: 1,  country: 'Spain',           countryCode: 'esp', confederation: 'UEFA',     points: 2100, previousRank: 1,  rankChange: 'same', pointsChange: 0 },
  { rank: 2,  country: 'USA',             countryCode: 'usa', confederation: 'CONCACAF', points: 2050, previousRank: 2,  rankChange: 'same', pointsChange: 0 },
  { rank: 3,  country: 'Germany',         countryCode: 'ger', confederation: 'UEFA',     points: 2020, previousRank: 4,  rankChange: 'up',   pointsChange: 5 },
  { rank: 4,  country: 'England',         countryCode: 'eng', confederation: 'UEFA',     points: 2010, previousRank: 3,  rankChange: 'down', pointsChange: -5 },
  { rank: 5,  country: 'Japan',           countryCode: 'jpn', confederation: 'AFC',      points: 1990, previousRank: 5,  rankChange: 'same', pointsChange: 0 },
  { rank: 6,  country: 'France',          countryCode: 'fra', confederation: 'UEFA',     points: 1970, previousRank: 7,  rankChange: 'up',   pointsChange: 3 },
  { rank: 7,  country: 'Brazil',          countryCode: 'bra', confederation: 'CONMEBOL', points: 1960, previousRank: 6,  rankChange: 'down', pointsChange: -3 },
  { rank: 8,  country: 'Sweden',          countryCode: 'swe', confederation: 'UEFA',     points: 1940, previousRank: 8,  rankChange: 'same', pointsChange: 0 },
  { rank: 9,  country: 'Canada',          countryCode: 'can', confederation: 'CONCACAF', points: 1920, previousRank: 9,  rankChange: 'same', pointsChange: 0 },
  { rank: 10, country: 'Netherlands',     countryCode: 'ned', confederation: 'UEFA',     points: 1900, previousRank: 10, rankChange: 'same', pointsChange: 0 },
  { rank: 11, country: 'DPR Korea',       countryCode: 'prk', confederation: 'AFC',      points: 1890, previousRank: 11, rankChange: 'same', pointsChange: 0 },
  { rank: 12, country: 'Denmark',         countryCode: 'den', confederation: 'UEFA',     points: 1880, previousRank: 12, rankChange: 'same', pointsChange: 0 },
  { rank: 13, country: 'Italy',           countryCode: 'ita', confederation: 'UEFA',     points: 1870, previousRank: 14, rankChange: 'up',   pointsChange: 2 },
  { rank: 14, country: 'Norway',          countryCode: 'nor', confederation: 'UEFA',     points: 1860, previousRank: 13, rankChange: 'down', pointsChange: -2 },
  { rank: 15, country: 'Australia',       countryCode: 'aus', confederation: 'AFC',      points: 1840, previousRank: 15, rankChange: 'same', pointsChange: 0 },
  { rank: 16, country: 'China PR',        countryCode: 'chn', confederation: 'AFC',      points: 1820, previousRank: 16, rankChange: 'same', pointsChange: 0 },
  { rank: 17, country: 'Iceland',         countryCode: 'isl', confederation: 'UEFA',     points: 1800, previousRank: 17, rankChange: 'same', pointsChange: 0 },
  { rank: 18, country: 'Belgium',         countryCode: 'bel', confederation: 'UEFA',     points: 1780, previousRank: 18, rankChange: 'same', pointsChange: 0 },
  { rank: 19, country: 'Korea Republic',  countryCode: 'kor', confederation: 'AFC',      points: 1760, previousRank: 19, rankChange: 'same', pointsChange: 0 },
  { rank: 20, country: 'Colombia',        countryCode: 'col', confederation: 'CONMEBOL', points: 1750, previousRank: 20, rankChange: 'same', pointsChange: 0 },
  { rank: 21, country: 'Republic of Ireland', countryCode: 'irl', confederation: 'UEFA', points: 1730, previousRank: 23, rankChange: 'up',   pointsChange: 4 },
  { rank: 22, country: 'Portugal',        countryCode: 'por', confederation: 'UEFA',     points: 1720, previousRank: 21, rankChange: 'down', pointsChange: -2 },
  { rank: 23, country: 'Austria',         countryCode: 'aut', confederation: 'UEFA',     points: 1710, previousRank: 22, rankChange: 'down', pointsChange: -1 },
  { rank: 24, country: 'Finland',         countryCode: 'fin', confederation: 'UEFA',     points: 1700, previousRank: 26, rankChange: 'up',   pointsChange: 3 },
  { rank: 25, country: 'Scotland',        countryCode: 'sco', confederation: 'UEFA',     points: 1690, previousRank: 24, rankChange: 'down', pointsChange: -1 },
  { rank: 26, country: 'Switzerland',     countryCode: 'sui', confederation: 'UEFA',     points: 1680, previousRank: 25, rankChange: 'down', pointsChange: -1 },
  { rank: 27, country: 'Russia',          countryCode: 'rus', confederation: 'UEFA',     points: 1670, previousRank: 29, rankChange: 'up',   pointsChange: 2 },
  { rank: 28, country: 'Mexico',          countryCode: 'mex', confederation: 'CONCACAF', points: 1660, previousRank: 27, rankChange: 'down', pointsChange: -1 },
  { rank: 29, country: 'Poland',          countryCode: 'pol', confederation: 'UEFA',     points: 1650, previousRank: 28, rankChange: 'down', pointsChange: -1 },
  { rank: 30, country: 'Argentina',       countryCode: 'arg', confederation: 'CONMEBOL', points: 1640, previousRank: 30, rankChange: 'same', pointsChange: 0 },
];
