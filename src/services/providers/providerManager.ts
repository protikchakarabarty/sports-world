import type { FootballMatch, CompetitionInfo, StandingEntry, ScorerEntry } from '../footballApi';
import { getMatch as fdoGetMatch } from '../footballApi';
import type {
  ProviderName,
  ProviderFixtureResult,
  ProviderCompetitionResult,
  ProviderTableResult,
  ProviderTopScorerResult,
} from './types';
import type { TransferNews } from '@/types';
import { sportmonksProvider, getTransfers as smGetTransfers } from './sportmonksProvider';
import { footballDataProvider } from './footballDataProvider';

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

function makeDedupKey(m: FootballMatch): string {
  return `${m.utcDate}|${m.homeTeam}|${m.awayTeam}`;
}

function deduplicate(primary: FootballMatch[], secondary: FootballMatch[]): FootballMatch[] {
  const seen = new Set<string>();
  const result: FootballMatch[] = [];

  for (const m of primary) {
    const key = makeDedupKey(m);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(m);
    }
  }

  let addedFromSecondary = 0;
  for (const m of secondary) {
    const key = makeDedupKey(m);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(m);
      addedFromSecondary++;
    }
  }

  if (addedFromSecondary > 0) {
    console.log(`[ProviderManager] Merged ${addedFromSecondary} unique matches from secondary provider`);
  }
  console.log(`[ProviderManager] Total after dedup: ${result.length}`);
  result.forEach((m) => {
    const tag = primary.includes(m) ? 'PRI' : 'SEC';
    console.log(`  [${tag}] ${m.competition.padEnd(12)} | ${m.utcDate} | ${m.status.padEnd(9)} | ${m.homeTeam.padEnd(22)} vs ${m.awayTeam}`);
  });

  return result;
}

const from = daysAgo(30);
const to = daysAhead(30);

let cachedFixtures: { matches: FootballMatch[]; source: ProviderFixtureResult['source']; ts: number } | null = null;
const FIXTURES_CACHE_TTL = 15 * 60 * 1000;

async function enrichLiveGoals(matches: FootballMatch[], fdoMatches?: FootballMatch[]): Promise<void> {
  const liveWithoutGoals = matches.filter(m => m.status === 'live' && (!m.goals || m.goals.length === 0));
  if (liveWithoutGoals.length === 0) return;
  console.log(`[ProviderManager] Enriching up to 5/${liveWithoutGoals.length} live matches with FDO goals...`);
  let enriched = 0;
  for (let i = 0; i < Math.min(5, liveWithoutGoals.length); i++) {
    const match = liveWithoutGoals[i];
    if (match.id.startsWith('fdo-')) {
      const fdoId = parseInt(match.id.replace('fdo-', ''), 10);
      if (fdoId && !isNaN(fdoId)) {
        const enrichedMatch = await fdoGetMatch(fdoId);
        if (enrichedMatch?.goals && enrichedMatch.goals.length > 0) {
          match.goals = enrichedMatch.goals;
          enriched++;
        }
      }
    } else if (fdoMatches) {
      const fdoMatch = fdoMatches.find(m => makeDedupKey(m) === makeDedupKey(match));
      if (fdoMatch) {
        const fdoId = parseInt(fdoMatch.id.replace('fdo-', ''), 10);
        if (fdoId && !isNaN(fdoId)) {
          const enrichedMatch = await fdoGetMatch(fdoId);
          if (enrichedMatch?.goals && enrichedMatch.goals.length > 0) {
            match.goals = enrichedMatch.goals;
            enriched++;
          }
        }
      }
    }
  }
  console.log(`[ProviderManager] Enriched ${enriched} live matches with goal data`);
}

export async function getAllFixtures(): Promise<ProviderFixtureResult> {
  if (cachedFixtures && Date.now() - cachedFixtures.ts < FIXTURES_CACHE_TTL) {
    console.log(`[ProviderManager] 🏆 Cache HIT — returning ${cachedFixtures.matches.length} matches from ${cachedFixtures.source}`);
    return { matches: cachedFixtures.matches, source: cachedFixtures.source };
  }

  console.log('[ProviderManager] Fetching fixtures — trying Sportmonks first...');
  const smMatches = await safeCall(() => sportmonksProvider.getAllFixtures(from, to));

  if (smMatches.length === 0) {
    console.log('[ProviderManager] Sportmonks returned 0 matches, falling back to Football-Data.org');
    const fdoMatches = await safeCall(() => footballDataProvider.getAllFixtures(from, to));
    await enrichLiveGoals(fdoMatches);
    const source = 'football-data' as const;
    cachedFixtures = { matches: fdoMatches, source, ts: Date.now() };
    return { matches: fdoMatches, source };
  }

  console.log('[ProviderManager] Sportmonks succeeded — also fetching Football-Data.org for merge');
  const fdoMatches = await safeCall(() => footballDataProvider.getAllFixtures(from, to));

  if (fdoMatches.length === 0) {
    const source = 'sportmonks' as const;
    cachedFixtures = { matches: smMatches, source, ts: Date.now() };
    return { matches: smMatches, source };
  }

  const merged = deduplicate(smMatches, fdoMatches);
  const source = 'merged' as const;

  await enrichLiveGoals(merged, fdoMatches);

  cachedFixtures = { matches: merged, source, ts: Date.now() };
  return { matches: merged, source };
}

let cachedCompetitions: { competitions: CompetitionInfo[]; source: ProviderName; ts: number } | null = null;
const COMP_CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getCompetitions(): Promise<ProviderCompetitionResult> {
  if (cachedCompetitions && Date.now() - cachedCompetitions.ts < COMP_CACHE_TTL) {
    return { competitions: cachedCompetitions.competitions, source: cachedCompetitions.source };
  }

  console.log('[ProviderManager] Fetching competitions — trying Sportmonks first...');
  const smComps = await safeCall(() => sportmonksProvider.getCompetitions());

  if (smComps.length > 0) {
    cachedCompetitions = { competitions: smComps, source: 'sportmonks', ts: Date.now() };
    return { competitions: smComps, source: 'sportmonks' };
  }

  console.log('[ProviderManager] Sportmonks returned 0 competitions, falling back to Football-Data.org');
  const fdoComps = await footballDataProvider.getCompetitions();
  cachedCompetitions = { competitions: fdoComps, source: 'football-data', ts: Date.now() };
  return { competitions: fdoComps, source: 'football-data' };
}

export async function getTable(compCode: string): Promise<ProviderTableResult> {
  const smTable = await safeCall(() => sportmonksProvider.getTable(compCode));
  if (smTable.length > 0) {
    return { standings: smTable, source: 'sportmonks' };
  }
  const fdoTable = await footballDataProvider.getTable(compCode);
  return { standings: fdoTable, source: 'football-data' };
}

let cachedTopScorers: { data: ScorerEntry[]; source: ProviderName; ts: number; compCode: string } | null = null;
const TOP_SCORERS_CACHE_TTL = 15 * 60 * 1000;

export async function getTopScorers(compCode: string): Promise<ProviderTopScorerResult> {
  if (cachedTopScorers && cachedTopScorers.compCode === compCode && Date.now() - cachedTopScorers.ts < TOP_SCORERS_CACHE_TTL) {
    return { scorers: cachedTopScorers.data, source: cachedTopScorers.source };
  }
  const smScorers = await safeCall(() => sportmonksProvider.getTopScorers(compCode));
  if (smScorers.length > 0) {
    cachedTopScorers = { data: smScorers, source: 'sportmonks', ts: Date.now(), compCode };
    return { scorers: smScorers, source: 'sportmonks' };
  }
  const fdoScorers = await footballDataProvider.getTopScorers(compCode);
  cachedTopScorers = { data: fdoScorers, source: 'football-data', ts: Date.now(), compCode };
  return { scorers: fdoScorers, source: 'football-data' };
}

let cachedTransfers: { data: TransferNews[]; ts: number } | null = null;
const TRANSFERS_CACHE_TTL = 10 * 60 * 1000;

export async function getTransfers(): Promise<TransferNews[]> {
  if (cachedTransfers && Date.now() - cachedTransfers.ts < TRANSFERS_CACHE_TTL) {
    console.log(`[ProviderManager] 🏆 Transfers cache HIT — ${cachedTransfers.data.length} transfers`);
    return cachedTransfers.data;
  }
  const data = await safeCall(() => smGetTransfers());
  cachedTransfers = { data, ts: Date.now() };
  return data;
}

async function safeCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error('[ProviderManager] Provider error:', err instanceof Error ? err.message : String(err));
    return [] as unknown as T;
  }
}
