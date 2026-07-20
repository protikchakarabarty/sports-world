import { useQuery } from '@tanstack/react-query';
import {
  getLiveMatches,
  getTodayMatches,
  getUpcomingMatches,
  getFinishedMatches,
  getRunningSeries,
  getTeams,
  getUnifiedRankings,
} from '@/services/cricketApi';
import { getNewsByCategory, getWomenCricketNews } from '@/services/newsApi';
import { getCricketPredictionPoll, getAiPrediction as getAiPred } from '@/services/aiPredictionService';
import { getCricketInjuries } from '@/services/cricketInjuryService';
import { getCricketStats } from '@/services/cricketStatsService';
import { getCricketAuctionData } from '@/services/cricketAuctionService';
import { getCricketFantasy } from '@/services/cricketFantasyService';
import type { Gender } from '@/data/mockData';

function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function useCricketMatches(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-matches', gender],
    queryFn: async () => {
      const [live, today, upcoming, finished] = await Promise.allSettled([
        getLiveMatches(),
        getTodayMatches(),
        getUpcomingMatches(),
        getFinishedMatches(),
      ]);

      console.log('[CricketMatches] Live:', live.status === 'fulfilled' ? `${live.value.length} matches` : live.reason);
      console.log('[CricketMatches] Today:', today.status === 'fulfilled' ? `${today.value.length} matches` : today.reason);
      console.log('[CricketMatches] Upcoming:', upcoming.status === 'fulfilled' ? `${upcoming.value.length} matches` : upcoming.reason);
      console.log('[CricketMatches] Finished:', finished.status === 'fulfilled' ? `${finished.value.length} matches` : finished.reason);

      const all: {
        id: string;
        sport: 'cricket';
        status: 'live' | 'upcoming' | 'finished';
        homeTeam: string;
        awayTeam: string;
        homeScore?: string;
        awayScore?: string;
        time: string;
        date: string;
        venue: string;
        broadcast: string;
        league?: string;
      }[] = [];

      const isWomen = (home: string, away: string, league: string) =>
        home.toLowerCase().includes('women') || away.toLowerCase().includes('women') || league.toLowerCase().includes('women');

      const extract = (result: PromiseSettledResult<Awaited<ReturnType<typeof getLiveMatches>>>, status: 'live' | 'upcoming' | 'finished') => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          result.value.forEach((m) => {
            const league = m.series || '';
            if (gender === 'men' && isWomen(m.homeTeam, m.awayTeam, league)) return;
            if (gender === 'women' && !isWomen(m.homeTeam, m.awayTeam, league)) return;
            all.push({
              id: `c-${m.id}`,
              sport: 'cricket',
              status,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              time: m.date || 'TBD',
              date: m.date?.split('T')[0] || todayDate(),
              venue: m.venue || 'TBD',
              broadcast: '',
              league,
            });
          });
        }
      };

      extract(live, 'live');
      extract(today, 'upcoming');
      extract(upcoming, 'upcoming');
      extract(finished, 'finished');

      console.log('[CricketMatches] Total extracted:', all.length);
      if (all.length > 0) {
        console.log('[CricketMatches] Sample:', JSON.stringify(all.slice(0, 2)));
      }

      const seen = new Set<string>();
      const deduped: typeof all = [];
      for (const m of all) {
        const k = `${m.homeTeam}|${m.awayTeam}`.toLowerCase().replace(/\s+/g, '');
        if (!seen.has(k)) { seen.add(k); deduped.push(m); }
      }
      console.log('[CricketMatches] After dedup:', deduped.length);

      const nationalTeams = new Set([
        'india', 'england', 'australia', 'south africa', 'new zealand', 'west indies',
        'pakistan', 'sri lanka', 'bangladesh', 'zimbabwe', 'afghanistan', 'ireland',
        'netherlands', 'scotland', 'namibia', 'oman', 'nepal', 'uae', 'usa',
      ]);
      const isIntl = (m: typeof all[number]) => {
        const h = m.homeTeam.toLowerCase().trim();
        const a = m.awayTeam.toLowerCase().trim();
        const matchNat = (name: string) => [...nationalTeams].some((t) => name === t || name.startsWith(t + ' ') || name.endsWith(' ' + t));
        return matchNat(h) && matchNat(a);
      };
      deduped.sort((a, b) => {
        const aIntl = isIntl(a) ? 0 : 1;
        const bIntl = isIntl(b) ? 0 : 1;
        return aIntl - bIntl;
      });

      return deduped.slice(0, 50);
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

export function useCricketSeries(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-series', gender],
    queryFn: async () => {
      const series = await getRunningSeries();
      return series
        .filter((s) => {
          const name = s.name.toLowerCase();
          if (gender === 'men' && name.includes('women')) return false;
          if (gender === 'women' && !name.includes('women')) return false;
          return true;
        })
        .filter((s) => s.status === 'ongoing')
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          status: s.status as 'ongoing',
          startDate: s.startDate,
          endDate: s.endDate,
        }));
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCricketUpcomingSeries(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-upcoming-series', gender],
    queryFn: async () => {
      const series = await getRunningSeries();
      return series
        .filter((s) => {
          const name = s.name.toLowerCase();
          if (gender === 'men' && name.includes('women')) return false;
          if (gender === 'women' && !name.includes('women')) return false;
          return true;
        })
        .filter((s) => s.status === 'upcoming')
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          status: 'upcoming' as const,
          startDate: s.startDate,
          endDate: s.endDate,
        }));
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

const NEWS_CACHE_KEY = 'cricket_news_cache';
const NEWS_CACHE_VERSION = 2;
const NEWS_CACHE_TTL = 24 * 60 * 60 * 1000;

function getCachedNews(gender: Gender): { articles: ReturnType<typeof normalizeCricketNews>[] } | null {
  try {
    const raw = localStorage.getItem(`${NEWS_CACHE_KEY}_${gender}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== NEWS_CACHE_VERSION) {
      console.log(`[CricketNews] Cache version mismatch for ${gender}, refetching`);
      localStorage.removeItem(`${NEWS_CACHE_KEY}_${gender}`);
      return null;
    }
    if (Date.now() - parsed.cachedAt < NEWS_CACHE_TTL) {
      console.log(`[CricketNews] Cache hit for ${gender} (${Math.round((Date.now() - parsed.cachedAt) / 60000)} min old)`);
      return parsed;
    }
    localStorage.removeItem(`${NEWS_CACHE_KEY}_${gender}`);
  } catch { /* ignore */ }
  return null;
}

function setCachedNews(gender: Gender, articles: ReturnType<typeof normalizeCricketNews>[]): void {
  try {
    localStorage.setItem(`${NEWS_CACHE_KEY}_${gender}`, JSON.stringify({ version: NEWS_CACHE_VERSION, articles, cachedAt: Date.now() }));
    console.log(`[CricketNews] Cached ${articles.length} articles for ${gender} (24h TTL)`);
  } catch { /* ignore */ }
}

function normalizeCricketNews(a: Awaited<ReturnType<typeof getNewsByCategory>>[number], i: number) {
  return {
    id: `cnews-${i}-${Date.now()}`,
    title: a.title,
    excerpt: (a.description || '') + ' ' + ((a.content || '').slice(0, 500)),
    image: a.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
    category: 'Cricket' as const,
    date: a.publishedAt?.split('T')[0] || todayDate(),
    author: a.source || 'Sports Desk',
    readTime: '3 min read',
    featured: i < 2,
    trending: i < 3,
  };
}

export function useCricketNews(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-news', gender],
    queryFn: async () => {
      const cached = getCachedNews(gender);
      if (cached) return cached.articles;

      try {
        const articles = gender === 'women'
          ? await getWomenCricketNews(30)
          : await getNewsByCategory('cricket', 30);
        const normalized = articles.map(normalizeCricketNews);
        setCachedNews(gender, normalized);
        return normalized;
      } catch {
        return [];
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCricketTeams() {
  return useQuery({
    queryKey: ['cricket-teams'],
    queryFn: getTeams,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useUnifiedRankings(gender?: Gender) {
  return useQuery({
    queryKey: ['unified-rankings', gender],
    queryFn: async () => {
      const data = await getUnifiedRankings();
      if (!gender) return data;
      const target = gender === 'men' ? 'men' : 'women';
      return {
        players: data.players.filter((r) => r.gender === target),
        teams: data.teams.filter((r) => r.gender === target),
      };
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCricketStats(_gender: Gender) {
  return {
    runsQuery: useQuery({
      queryKey: ['cricket-stats-runs'],
      queryFn: async () => [] as { player: string; team: string; runs?: number; wickets?: number; hundreds?: number }[],
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }),
    wicketsQuery: useQuery({
      queryKey: ['cricket-stats-wickets'],
      queryFn: async () => [] as { player: string; team: string; runs?: number; wickets?: number; hundreds?: number }[],
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }),
  };
}

export function useCricketInjuries(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-injuries', gender],
    queryFn: async () => getCricketInjuries(gender),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCricketPredictions(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-predictions', gender],
    queryFn: async () => {
      if (gender === 'women') {
        return {
          id: 'wpp-cricket',
          question: "Who will win the Women's T20 World Cup 2026?",
          options: ['Australia Women', 'India Women', 'England Women', 'South Africa Women'],
          votes: [35, 30, 20, 15],
          totalVotes: 9800,
        };
      }
      return getCricketPredictionPoll<{
        id: string;
        question: string;
        options: string[];
        votes: number[];
        totalVotes: number;
      }>();
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCricketAuctionData(gender: Gender = 'men') {
  return useQuery({
    queryKey: ['cricket-auction', gender],
    queryFn: async () => getCricketAuctionData(gender),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCricketPlayerRankings() {
  return useQuery({
    queryKey: ['cricket-player-rankings'],
    queryFn: async () =>
      [] as { id: string; name: string; sport: string; image: string; rank: number; value?: string; earnings?: string; nationality: string }[],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCricketStatsData(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-stats', gender],
    queryFn: async () => getCricketStats(gender),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCricketFantasyData(gender: Gender) {
  return useQuery({
    queryKey: ['cricket-fantasy', gender],
    queryFn: async () => getCricketFantasy(gender),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
