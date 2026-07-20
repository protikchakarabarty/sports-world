import { getEnv } from '@/config/env';
import type { CricketMatchRaw } from './cricketApi';

const BASE_URL = 'https://api.cricapi.com/v1';

interface CricketDataMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: { name: string; shortname: string; img: string }[];
  score: { r: number; w: number; o: number; inning: string }[];
  series_id: string;
  matchStarted: boolean;
  matchEnded: boolean;
}

function classifyStatus(m: CricketDataMatch): string {
  if (!m.matchStarted) return 'upcoming';
  if (m.matchEnded) return 'finished';
  return 'live';
}

function getScores(m: CricketDataMatch): { homeScore: string; awayScore: string } {
  if (!m.score || m.score.length === 0) return { homeScore: '', awayScore: '' };
  const sorted = [...m.score].sort((a, b) => {
    const numA = parseInt(a.inning?.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.inning?.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });
  const home = sorted[0] ? `${sorted[0].r}/${sorted[0].w}` : '';
  const away = sorted[1] ? `${sorted[1].r}/${sorted[1].w}` : '';
  return { homeScore: home, awayScore: away };
}

function mapToCricketMatchRaw(m: CricketDataMatch): CricketMatchRaw {
  const homeTeam = m.teams?.[0] || '';
  const awayTeam = m.teams?.[1] || '';
  const { homeScore, awayScore } = getScores(m);
  const status = classifyStatus(m);
  return {
    id: `cd-${m.id}`,
    name: m.name,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status,
    date: m.dateTimeGMT || m.date,
    venue: m.venue || '',
    series: m.name?.split(',')?.slice(1)?.join(',')?.trim() || '',
  };
}

interface CricketDataSeries {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  odi?: number;
  t20?: number;
  test?: number;
  matches: number;
}

function parseEndDate(startDate: string, endDate: string): string {
  if (endDate.includes('-')) return endDate;
  const year = startDate.split('-')[0];
  return `${year}-${endDate}`;
}

function classifySeriesStatus(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(parseEndDate(startDate, endDate) || endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  if (now < start) return 'upcoming';
  return 'completed';
}

export async function fetchCricketDataSeries(): Promise<{ id: string; name: string; type: string; status: string; startDate: string; endDate: string }[]> {
  const key = getEnv().cricketDataApiKey;
  if (!key) return [];

  const offsets = [0, 25, 50];
  try {
    const results = await Promise.allSettled(
      offsets.map(offset =>
        fetch(`${BASE_URL}/series?apikey=${key}&offset=${offset}`)
          .then(res => {
            if (!res.ok) throw new Error(`CricketData series HTTP ${res.status} at offset=${offset}`);
            return res.json() as Promise<{ status: string; data: CricketDataSeries[] }>;
          })
          .then(data => {
            if (data.status !== 'success' || !data.data) return [];
            return data.data.map((s) => ({
              id: s.id,
              name: s.name,
              type: (s.test ? 'Test' : '') + (s.odi ? 'ODI' : '') + (s.t20 ? 'T20' : '') || 'Multi-format',
              status: classifySeriesStatus(s.startDate, s.endDate),
              startDate: s.startDate,
              endDate: parseEndDate(s.startDate, s.endDate),
            }));
          })
      )
    );
    const all: { id: string; name: string; type: string; status: string; startDate: string; endDate: string }[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') all.push(...r.value);
    }
    console.log(`[CricketData] Fetched ${all.length} series from ${offsets.length} pages`);
    return all;
  } catch (e) {
    console.error('[CricketData] Series fetch failed:', e);
    return [];
  }
}

export async function fetchCricketDataMatches(): Promise<CricketMatchRaw[]> {
  const key = getEnv().cricketDataApiKey;
  if (!key) {
    console.warn('[CricketData] No API key configured');
    return [];
  }

  const offsets = [0, 25, 50, 75];
  try {
    const results = await Promise.allSettled(
      offsets.map(offset =>
        fetch(`${BASE_URL}/currentMatches?apikey=${key}&offset=${offset}`)
          .then(res => {
            if (!res.ok) throw new Error(`CricketData HTTP ${res.status} at offset=${offset}`);
            return res.json() as Promise<{ status: string; data: CricketDataMatch[] }>;
          })
          .then(data => {
            if (data.status !== 'success' || !data.data) return [];
            return data.data.map(mapToCricketMatchRaw);
          })
      )
    );
    const all: CricketMatchRaw[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') all.push(...r.value);
    }
    console.log(`[CricketData] Fetched ${all.length} matches from ${offsets.length} pages`);
    return all;
  } catch (e) {
    console.error('[CricketData] Fetch failed:', e);
    return [];
  }
}
