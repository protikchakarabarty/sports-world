import { useQuery } from '@tanstack/react-query';
import { getWomenFixtures, getWomenCompetitions, detectWomenLeagueCode } from '@/services/providers/sportmonksProvider';
import type { AiMatchInfo } from '@/services/providers/sportmonksProvider';
import { womenFootballDataProvider } from '@/services/providers/footballDataProvider';
import { getWomenTable, getWomenTopScorers } from '@/services/footballApi';
import type { StandingEntry, ScorerEntry, CompetitionInfo, CompetitionGroup, FootballMatch } from '@/services/footballApi';
import { getWomenFifaRankings } from '@/services/fifaRankingApi';
import { getWomenClubRankings } from '@/services/clubRankingService';
import { getWomenFootballNews } from '@/services/newsApi';
import { getWomenInjuries } from '@/services/womensInjuryService';
import { getWomenTransferRumours, getWomenTransferNews, getWomenDiscussedPlayers } from '@/services/womensTransferService';
import { getWomenOnThisDayFootballData } from '@/services/womensOnThisDayService';
import { getWomenMatchPrediction, generateAllWomenMatchPredictions, getWomenPredictionPoll } from '@/services/aiPredictionService';
import { getWomenFootballHighlights, type VideoResult } from '@/services/youtubeApi';
import type { MatchPredictionInput, AiExtendedPrediction } from '@/types/prediction';
import type { OnThisDayEntry, OnThisDayResponse } from '@/types';

const hookDefaults = {
  retry: 2 as const,
  refetchOnMount: true as const,
  refetchOnWindowFocus: false as const,
};

function dateString(d: Date): string {
  return d.toISOString().split('T')[0];
}

function toDhakaTime(utcDate: string): string {
  if (!utcDate) return '';
  try {
    const d = new Date(utcDate);
    const dhaka = new Intl.DateTimeFormat('en-BD', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
    return dhaka;
  } catch {
    const d = new Date(utcDate);
    const offset = 6 * 60;
    const local = new Date(d.getTime() + offset * 60000);
    return local.toISOString().split('T')[1]?.slice(0, 5) ?? '';
  }
}

function mapWomenStatus(status: string): 'live' | 'upcoming' | 'finished' {
  switch (status.toUpperCase()) {
    case 'LIVE': case '1H': case '2H': case 'HT': case 'ET':
    case 'PEN_LIVE': case 'BREAK': case 'INT':
      return 'live';
    case 'FT': case 'AET': case 'PEN': case 'AWD': case 'WO':
      return 'finished';
    default:
      return 'upcoming';
  }
}

export function useWomenFootballFixtures() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['women-football-fixtures'],
    queryFn: async () => {
      const now = new Date();
      const today = dateString(now);
      const tomorrow = dateString(new Date(now.getTime() + 1 * 86400000));
      const next7 = dateString(new Date(now.getTime() + 7 * 86400000));
      const past30 = dateString(new Date(now.getTime() - 30 * 86400000));

      let smMatches: FootballMatch[] = [];
      const seenKeys = new Set<string>();

      // Tier 1: next 24 hours
      console.log('[WomenHooks] Tier 1: fetching next 24 hours');
      try {
        const m = await getWomenFixtures(today, tomorrow);
        console.log(`[WomenHooks] Tier 1 returned ${m.length} matches`);
        for (const match of m) {
          const key = `${match.utcDate}|${match.homeTeam}|${match.awayTeam}`;
          if (!seenKeys.has(key)) { seenKeys.add(key); smMatches.push(match); }
        }
      } catch (e) {
        console.warn('[WomenHooks] Tier 1 failed', e);
      }

      // Tier 2: next 7 days
      if (smMatches.length < 10) {
        console.log('[WomenHooks] Tier 2: expanding to next 7 days');
        try {
          const m = await getWomenFixtures(tomorrow, next7);
          console.log(`[WomenHooks] Tier 2 returned ${m.length} matches`);
          for (const match of m) {
            const key = `${match.utcDate}|${match.homeTeam}|${match.awayTeam}`;
            if (!seenKeys.has(key)) { seenKeys.add(key); smMatches.push(match); }
          }
        } catch (e) {
          console.warn('[WomenHooks] Tier 2 failed', e);
        }
      }

      // Tier 3: last 30 days (completed matches)
      if (smMatches.length < 10) {
        console.log('[WomenHooks] Tier 3: fetching last 30 days of completed matches');
        try {
          const m = await getWomenFixtures(past30, today);
          console.log(`[WomenHooks] Tier 3 returned ${m.length} matches`);
          for (const match of m) {
            const key = `${match.utcDate}|${match.homeTeam}|${match.awayTeam}`;
            if (!seenKeys.has(key)) { seenKeys.add(key); smMatches.push(match); }
          }
        } catch (e) {
          console.warn('[WomenHooks] Tier 3 failed', e);
        }
      }

      // Fallback: football-data.org provider
      if (smMatches.length === 0) {
        console.log('[WomenHooks] Sportmonks returned 0 across all tiers, trying FDO fallback');
        try {
          const fallback = await womenFootballDataProvider.getAllFixtures();
          console.log(`[WomenHooks] FDO fallback returned ${fallback.length} matches`);
          smMatches = fallback;
        } catch (e2) {
          console.error('[WomenHooks] FDO fallback also failed', e2);
        }
      }

      console.log(`[WomenHooks] Total matches collected: ${smMatches.length}`);

      const all: {
        id: string;
        sport: 'football';
        status: 'live' | 'upcoming' | 'finished';
        homeTeam: string;
        awayTeam: string;
        homeCrest?: string;
        awayCrest?: string;
        homeScore?: string;
        awayScore?: string;
        homeDisplayScore: number;
        awayDisplayScore: number;
        homePenaltyScore?: number | null;
        awayPenaltyScore?: number | null;
        hasPenalties: boolean;
        time: string;
        date: string;
        utcDate: string;
        venue: string;
        league: string;
        stage: string;
        elapsed?: number;
        goals?: { minute: number; extraMinute?: number; player: string; team: 'home' | 'away'; type: string }[];
      }[] = [];

      const added = new Set<string>();

      for (const m of smMatches) {
        const key = `${m.utcDate}|${m.homeTeam}|${m.awayTeam}`;
        if (added.has(key)) continue;
        added.add(key);

        const status = mapWomenStatus(m.status);
        all.push({
          id: m.id,
          sport: 'football',
          status,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeCrest: m.homeCrest,
          awayCrest: m.awayCrest,
          homeScore: m.homeScore?.toString(),
          awayScore: m.awayScore?.toString(),
          homeDisplayScore: m.homeDisplayScore,
          awayDisplayScore: m.awayDisplayScore,
          homePenaltyScore: m.homePenaltyScore,
          awayPenaltyScore: m.awayPenaltyScore,
          hasPenalties: m.hasPenalties,
          time: toDhakaTime(m.utcDate) || m.time,
          date: m.date,
          utcDate: m.utcDate,
          venue: m.venue || '',
          league: m.competitionName || '',
          stage: m.stage || '',
          elapsed: m.elapsed,
          goals: m.goals,
        });
      }

      const liveMatches = all.filter((m) => m.status === 'live');
      const upcomingMatches = all.filter((m) => m.status === 'upcoming');
      const finishedMatches = all.filter((m) => m.status === 'finished');

      liveMatches.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
      upcomingMatches.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
      finishedMatches.sort((a, b) => b.utcDate.localeCompare(a.utcDate));

      console.log(`[WomenHooks] Live: ${liveMatches.length}, Upcoming: ${upcomingMatches.length}, Finished: ${finishedMatches.length}`);

      return [...liveMatches, ...upcomingMatches, ...finishedMatches];
    },
  });
}

export function useWomenStandings(compCode: string) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 5,
    queryKey: ['women-standings', compCode],
    queryFn: async (): Promise<StandingEntry[]> => {
      const data = await getWomenTable(compCode);
      return data;
    },
  });
}

export function useWomenStats(compCode: string) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 5,
    queryKey: ['women-stats', compCode],
    queryFn: async () => {
      const data = await getWomenTopScorers(compCode);
      return data;
    },
  });
}

export function useWomenFifaRankings() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    queryKey: ['women-fifa-rankings'],
    queryFn: async () => {
      const data = await getWomenFifaRankings();
      return data;
    },
  });
}

export function useWomenClubRankings() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    queryKey: ['women-club-rankings'],
    queryFn: async () => {
      const data = await getWomenClubRankings();
      return data;
    },
  });
}

export function useWomenNews() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['women-football-news'],
    queryFn: async () => {
      const articles = await getWomenFootballNews();
      return articles;
    },
  });
}

export function useWomenInjuries() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['women-injuries'],
    queryFn: async () => {
      const data = await getWomenInjuries();
      return data;
    },
  });
}

export function useWomenTransferRumours() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    queryKey: ['women-transfer-rumours'],
    queryFn: async () => {
      const data = await getWomenTransferRumours();
      return data;
    },
  });
}

export function useWomenTransferNews() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    queryKey: ['women-transfer-news'],
    queryFn: async () => {
      const data = await getWomenTransferNews();
      return data;
    },
  });
}

export function useWomenDiscussedPlayers() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    queryKey: ['women-discussed-players'],
    queryFn: async () => {
      const data = await getWomenDiscussedPlayers();
      return data;
    },
  });
}

export function useWomenLeagues() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    queryKey: ['women-football-leagues'],
    queryFn: async (): Promise<CompetitionGroup> => {
      const data = await getWomenCompetitions();
      return { running: data, upcoming: [] };
    },
  });
}

export function useWomenPredictions() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    queryKey: ['women-predictions'],
    queryFn: async () => {
      const now = new Date();
      const today = dateString(now);
      const tomorrow = dateString(new Date(now.getTime() + 86400000));

      const fixtures = await getWomenFixtures(today, tomorrow);

      const aiFixtures: AiMatchInfo[] = fixtures
        .filter((f) => f.status === 'SCHEDULED' || f.status === 'TIMED' || !['FT', 'AET', 'PEN', 'AWD', 'WO', 'LIVE', '1H', '2H', 'HT', 'ET', 'PEN_LIVE', 'BREAK', 'INT'].includes(f.status.toUpperCase()))
        .map((f) => ({
          id: f.id,
          homeTeam: f.homeTeam,
          awayTeam: f.awayTeam,
          homeCrest: f.homeCrest || '',
          awayCrest: f.awayCrest || '',
          competition: f.competitionName,
          date: f.date,
          time: f.time,
          utcDate: f.utcDate,
          isKnockout: false,
        }));

      const predictions = await generateAllWomenMatchPredictions(aiFixtures);

      const poll = await getWomenPredictionPoll<{
        id: string;
        question: string;
        options: string[];
        votes: number[];
        totalVotes: number;
      }>();

      return { fixtures: aiFixtures, predictions, poll };
    },
  });
}

export function useWomenOnThisDay() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    queryKey: ['women-on-this-day'],
    queryFn: async (): Promise<OnThisDayResponse> => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      return getWomenOnThisDayFootballData(month, day);
    },
  });
}

export function useWomenFootballHighlights() {
  return useQuery<VideoResult[]>({
    queryKey: ['women-football-highlights'],
    queryFn: async () => {
      let matchQueries: string[] = [];
      let matchIds: string[] = [];
      try {
        const all = await womenFootballDataProvider.getAllFixtures();
        const finished = all.filter((m) => m.status === 'finished');
        const last10 = finished.slice(0, 10);
        matchQueries = last10.map(
          (m) => `${m.homeTeam} vs ${m.awayTeam} highlights`,
        );
        matchIds = last10.map((m) => m.id);
      } catch {
        console.warn('[WomenHighlights] Failed to fetch completed matches');
      }

      return getWomenFootballHighlights(10, matchQueries, matchIds);
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
  });
}
