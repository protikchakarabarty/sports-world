import { getEnv } from '@/config/env';
import { createClient } from './apiClient';
import type { AxiosInstance } from 'axios';

let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!client) {
    const { youtubeApiKey } = getEnv();
    client = createClient('https://www.googleapis.com/youtube/v3', {
      params: { key: youtubeApiKey },
    });
  }
  return client;
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  pageInfo: { totalResults: number; resultsPerPage: number };
  nextPageToken?: string;
}

export interface VideoResult {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  publishedAt: string;
}

async function searchVideos(
  query: string,
  maxResults = 8,
  videoType?: string,
  pageToken?: string,
): Promise<{ results: VideoResult[]; nextPageToken?: string }> {
  const { youtubeApiKey } = getEnv();
  if (!youtubeApiKey) return { results: [] };

  const params: Record<string, string | number> = {
    part: 'snippet',
    q: query,
    maxResults,
    type: 'video',
  };

  if (videoType) params.videoType = videoType;
  if (pageToken) params.pageToken = pageToken;

  const res = await getClient().get<YouTubeSearchResponse>('/search', { params });

  const results = (res.data.items ?? []).map((item) => ({
    id: item.id.videoId,
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));

  return { results, nextPageToken: res.data.nextPageToken };
}

export async function getMatchHighlights(sport: string, maxResults = 6): Promise<VideoResult[]> {
  const { results } = await searchVideos(`${sport} match highlights`, maxResults);
  return results;
}

export async function getPressConferences(sport: string, maxResults = 6): Promise<VideoResult[]> {
  const { results } = await searchVideos(`${sport} press conference`, maxResults);
  return results;
}

export async function getPlayerInterviews(sport: string, maxResults = 6): Promise<VideoResult[]> {
  const { results } = await searchVideos(`${sport} player interview`, maxResults);
  return results;
}

export async function getOfficialSportsVideos(sport: string, maxResults = 6): Promise<VideoResult[]> {
  const { results } = await searchVideos(`${sport} official`, maxResults);
  return results;
}

export async function getFootballHighlights(maxResults = 6): Promise<VideoResult[]> {
  return getMatchHighlights('football', maxResults);
}

const WOMEN_HIGHLIGHTS_KW = [
  "women's football", "women's soccer", 'wsl', 'nwsl',
  'liga f', 'frauen bundesliga', 'division 1 féminine',
  "uefa women's champions league", "fifa women's world cup",
  "women's euro", 'women highlights', 'women football', 'women soccer',
  'women football highlights', 'women soccer highlights',
  'wsl highlights', 'nwsl highlights', 'liga f highlights',
];

const MEN_BLOCK_KW = [
  'premier league', 'uefa champions league', "men's",
  'manchester united', 'manchester city', 'liverpool',
  'arsenal', 'chelsea fc', 'real madrid', 'barcelona',
  'bayern munich', 'juventus', 'ac milan', 'inter milan',
  "men's world cup", "men's champions league",
  'tottenham', 'newcastle', 'borussia dortmund', 'psg',
  'paris saint-germain', 'atletico madrid', 'napoli', 'roma',
  'lazio', 'atalanta', 'barcelona men', 'men football',
  'la liga', 'serie a', 'bundesliga', 'ligue 1',
  'champions league final', 'europa league', 'conference league',
  'fa cup', 'carabao cup', 'world cup 202', 'euro 202',
  'copa america', 'man utd', 'man city', 'fc barcelona',
  'real madrid cf', 'juventus fc', 'inter', 'ac milan',
];

function textContainsKw(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  });
}

function menBlocked(text: string): boolean {
  const lower = text.toLowerCase();
  const clean = lower.replace(/\b\w+\s+(women|femen[ei]|femenin[oa]|vrouwen)\b/gi, 'WOMENSTEAM');
  return textContainsKw(clean, MEN_BLOCK_KW);
}

function isWomenHighlight(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();

  const hasWomenKw = textContainsKw(text, WOMEN_HIGHLIGHTS_KW);
  if (!hasWomenKw) return false;

  if (menBlocked(text)) return false;

  // Men's World Cup matches leak when the channel description contains
  // women's keywords.  Require "women's" before "world cup".
  if (/\bworld\s+cup\b/i.test(text) && !/\bwomen['’]?s?\s+world\s+cup\b/i.test(text)) {
    return false;
  }

  return true;
}

const HIGHLIGHTS_CACHE_KEY = 'sw_women_highlights_cache';
const SEARCHED_MATCHES_KEY = 'sw_women_searched_matches';

interface HighlightsCache {
  [query: string]: { videos: VideoResult[]; timestamp: number };
}

function loadCache(): HighlightsCache {
  try {
    const raw = localStorage.getItem(HIGHLIGHTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCache(cache: HighlightsCache): void {
  try { localStorage.setItem(HIGHLIGHTS_CACHE_KEY, JSON.stringify(cache)); } catch {}
}

function loadSearchedIds(): string[] {
  try {
    const raw = localStorage.getItem(SEARCHED_MATCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSearchedIds(ids: string[]): void {
  try { localStorage.setItem(SEARCHED_MATCHES_KEY, JSON.stringify(ids)); } catch {}
}

function isVideoConsistent(v: VideoResult): boolean {
  if (!v.videoId || !v.thumbnail || !v.title) return false;
  // YouTube thumbnail URLs always contain the video ID as a path segment.
  // If the URL doesn't include the videoId, the thumbnail belongs to a different video.
  const urlContainsId = v.thumbnail.includes(`/${v.videoId}/`) ||
    v.thumbnail.includes(`/vi/${v.videoId}/`) ||
    v.thumbnail.includes(`/vi_webp/${v.videoId}/`);
  if (!urlContainsId) {
    console.warn(`[WomenHighlights] Rejected inconsistent card: thumbnail ${v.thumbnail} doesn't match videoId ${v.videoId}`);
    return false;
  }
  return true;
}

function collectVideo(video: VideoResult, all: VideoResult[], seen: Set<string>): void {
  if (seen.has(video.videoId)) return;
  seen.add(video.videoId);
  if (!isWomenHighlight(video.title, video.description)) return;
  if (!isVideoConsistent(video)) return;
  all.push(video);
}

async function searchPaginated(query: string, maxToCollect: number, seen: Set<string>): Promise<VideoResult[]> {
  const collected: VideoResult[] = [];
  let pageToken: string | undefined;

  while (collected.length < maxToCollect) {
    try {
      const { results, nextPageToken } = await searchVideos(query, 50, undefined, pageToken);
      if (results.length === 0) break;

      for (const video of results) {
        if (collected.length >= maxToCollect) break;
        collectVideo(video, collected, seen);
      }

      if (!nextPageToken) break;
      pageToken = nextPageToken;
    } catch {
      break;
    }
  }

  return collected;
}

export async function getWomenFootballHighlights(
  maxResults = 10,
  matchQueries: string[] = [],
  matchIds: string[] = [],
): Promise<VideoResult[]> {
  const CACHE_TTL = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const cache = loadCache();
  const searchedIds = new Set(loadSearchedIds());
  const allResults: VideoResult[] = [];
  const seen = new Set<string>();

  // Separate new (unsearched) from known matches
  const newMq: string[] = [];
  const newMid: string[] = [];

  for (let i = 0; i < matchIds.length; i++) {
    if (!searchedIds.has(matchIds[i])) {
      newMid.push(matchIds[i]);
      newMq.push(matchQueries[i]);
    }
  }

  // Mark new matches as searched immediately so concurrent calls don't duplicate work
  if (newMid.length > 0) {
    const updated = loadSearchedIds();
    for (const id of newMid) {
      if (!updated.includes(id)) updated.push(id);
    }
    saveSearchedIds(updated);
  }

  // Step 1 — Search YouTube for new matches
  for (const mq of newMq) {
    if (allResults.length >= maxResults) break;
    const videos = await searchPaginated(mq, maxResults - allResults.length, seen);
    if (videos.length > 0) {
      cache[mq] = { videos, timestamp: now };
      allResults.push(...videos);
    }
  }

  // Step 2 — Fill from cached previous-match highlights (< 24h)
  if (allResults.length < maxResults) {
    for (let i = 0; i < matchQueries.length && allResults.length < maxResults; i++) {
      const entry = cache[matchQueries[i]];
      if (entry && (now - entry.timestamp) < CACHE_TTL) {
        for (const v of entry.videos) {
          if (allResults.length >= maxResults) break;
          collectVideo(v, allResults, seen);
        }
      }
    }
  }

  // Step 3 — General fallback (still < 10)
  if (allResults.length < maxResults) {
    for (const q of [
      "women's football highlights",
      "women's soccer highlights",
      "women football highlights",
    ]) {
      if (allResults.length >= maxResults) break;
      const fallbackKey = `__general__${q}`;
      const cached = cache[fallbackKey];
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        for (const v of cached.videos) {
          if (allResults.length >= maxResults) break;
          collectVideo(v, allResults, seen);
        }
      } else {
        const videos = await searchPaginated(q, maxResults - allResults.length, seen);
        if (videos.length > 0) {
          cache[fallbackKey] = { videos, timestamp: now };
          allResults.push(...videos);
        }
      }
    }
  }

  saveCache(cache);
  return allResults.slice(0, maxResults);
}

const CRICKET_KW = [
  'cricket', 'test match', 'odi', 't20', 't20i', 'ipl', 'bbl', 'psl', 'cpl',
  'bpl', 'county', 'ashes', 'world cup', 'champions trophy',
  'india', 'australia', 'england', 'pakistan', 'south africa',
  'new zealand', 'west indies', 'sri lanka', 'bangladesh',
  'zimbabwe', 'afghanistan', 'ireland', 'netherlands',
  'virat kohli', 'rohit sharma', 'steve smith', 'pat cummins',
  'ben stokes', 'joe root', 'babar azam', 'shaheen afridi',
  'kane williamson', 'trent boult', 'rashid khan', 'mujeeb',
  'shakib hasan', 'mushfiqur rahim', 'kusal mendis', 'wanindu',
  'kagiso rabada', 'quinton de kock', 'jasprit bumrah',
  'ravindra jadeja', 'ms dhoni', 'suryakumar yadav',
  'jos buttler', 'travis head', 'marnus labuschagne',
  'mitchell starc', 'jofra archer', 'mohammad rizwan',
  'shaun marsh', 'david warner', 'glenn maxwell',
  'sanju samson', 'shubman gill', 'yashasvi jaiswal',
  'mumbai indians', 'chennai super kings', 'royal challengers',
  'kolkata knight riders', 'delhi capitals', 'punjab kings',
  'rajasthan royals', 'sunrisers hyderabad', 'lucknow super giants',
  'gujarat titans', 'team india', 'indian cricket',
  'bcci', 'ecb', 'cricket australia', 'pca', 'sri lanka cricket',
];

const WOMEN_CRICKET_KW = [
  "women's cricket", "women cricket", "women's t20", "women's odi",
  "women's test", "women's ashes", "women's world cup",
  "wpl", "women's premier league", "women's t20 world cup",
  "women's champions trophy", "women's big bash", "wbbpl",
  "india women", "australia women", "england women",
  "new zealand women", "west indies women", "south africa women",
  "pakistan women", "sri lanka women", "bangladesh women",
  "women's team", "women's match",
  'mandhana', 'harmanpreet', 'perry', 'ecclestone',
  'healy', 'kapp', 'lanning', 'sciver',
  'namibia women', 'zimbabwe women', 'uganda women',
];

const BLOCKED_CRICKET_KW = [
  'football', 'soccer', 'premier league', 'champions league', 'europa league',
  'la liga', 'serie a', 'bundesliga', 'ligue 1', 'fifa',
  'manchester united', 'manchester city', 'liverpool', 'arsenal', 'chelsea',
  'real madrid', 'barcelona', 'bayern munich', 'juventus', 'psg',
  'world cup football', 'world cup 202', 'euro 202',
  'nfl', 'nba', 'tennis', 'formula 1', 'f1', 'moto gp',
  'ufc', 'boxing', 'golf', 'rugby', 'hockey',
];

function isCricketVideo(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();

  if (WOMEN_CRICKET_KW.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  })) return false;

  if (BLOCKED_CRICKET_KW.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  })) return false;

  return CRICKET_KW.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  });
}

export async function getCricketHighlights(maxResults = 6): Promise<VideoResult[]> {
  const { results } = await searchVideos('cricket match highlights', maxResults * 2);
  return results.filter((v) => isCricketVideo(v.title, v.description)).slice(0, maxResults);
}

export async function getWomenCricketHighlights(maxResults = 12): Promise<VideoResult[]> {
  const collected: VideoResult[] = [];
  const seen = new Set<string>();

  const queries = [
    'women cricket highlights',
    'womens cricket match highlights',
    'india women cricket highlights',
    'WPL highlights',
    'women t20 highlights',
  ];

  for (const q of queries) {
    if (collected.length >= maxResults) break;
    try {
      const { results } = await searchVideos(q, maxResults * 2);
      for (const v of results) {
        if (collected.length >= maxResults) break;
        if (seen.has(v.videoId)) continue;
        seen.add(v.videoId);
        if (!WOMEN_CRICKET_KW.some((kw) => {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`\\b${escaped}\\b`, 'i').test(`${v.title} ${v.description}`);
          })) continue;
        collected.push(v);
      }
    } catch {
      continue;
    }
  }

  return collected;
}
