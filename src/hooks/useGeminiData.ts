import { useQuery } from '@tanstack/react-query';
import {
  getAiMatchPrediction,
  getFootballPredictionPoll,
  getCricketPredictionPoll,
} from '@/services/aiPredictionService';
import {
  getAiMatchAnalysis,
  getAiMatchSummary,
  getAiNewsSummary,
  getAiPlayerComparison,
  getAiFantasyXISuggestion,
  getAiSportsChatResponse,
  getAiSearch,
} from '@/services/geminiApi';
import type {
  AiPrediction,
  AiMatchAnalysis,
  AiNewsSummary,
  AiPlayerComparison,
  AiFantasyXI,
  AiSportsChatResponse,
} from '@/services/geminiApi';

const hookDefaults = {
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
  refetchOnMount: false as const,
  refetchOnWindowFocus: false as const,
  refetchOnReconnect: false as const,
  retry: false as const,
};

export function useMatchPrediction(matchInfo: string, sport: string) {
  return useQuery<AiPrediction>({
    ...hookDefaults,
    queryKey: ['ai-match-prediction', matchInfo, sport],
    queryFn: () => getAiMatchPrediction(matchInfo, sport),
    enabled: !!matchInfo,
  });
}

export function useMatchAnalysis(matchData: string, sport: string) {
  return useQuery<AiMatchAnalysis>({
    ...hookDefaults,
    queryKey: ['ai-match-analysis', matchData, sport],
    queryFn: () => getAiMatchAnalysis(matchData, sport),
    enabled: !!matchData,
  });
}

export function useMatchSummary(matchData: string, sport: string) {
  return useQuery<string>({
    ...hookDefaults,
    queryKey: ['ai-match-summary', matchData, sport],
    queryFn: () => getAiMatchSummary(matchData, sport),
    enabled: !!matchData,
  });
}

export function useNewsSummary(articles: string) {
  return useQuery<AiNewsSummary>({
    ...hookDefaults,
    staleTime: 1000 * 60 * 15,
    queryKey: ['ai-news-summary', articles],
    queryFn: () => getAiNewsSummary(articles),
    enabled: articles.length > 50,
  });
}

export function usePlayerComparison(player1: string, player2: string, sport: string) {
  return useQuery<AiPlayerComparison>({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    queryKey: ['ai-player-comparison', player1, player2, sport],
    queryFn: () => getAiPlayerComparison(player1, player2, sport),
    enabled: !!player1 && !!player2,
  });
}

export function useFantasyXISuggestion(availablePlayers: string, sport: string) {
  return useQuery<AiFantasyXI>({
    ...hookDefaults,
    queryKey: ['ai-fantasy-xi', availablePlayers, sport],
    queryFn: () => getAiFantasyXISuggestion(availablePlayers, sport),
    enabled: !!availablePlayers,
  });
}

export function useSportsChat(question: string, context?: string) {
  return useQuery<AiSportsChatResponse>({
    ...hookDefaults,
    staleTime: 0,
    queryKey: ['ai-sports-chat', question, context],
    queryFn: () => getAiSportsChatResponse(question, context),
    enabled: !!question,
  });
}

export function useAiSearch(query: string, data: string) {
  return useQuery<string>({
    ...hookDefaults,
    staleTime: 0,
    queryKey: ['ai-search', query, data],
    queryFn: () => getAiSearch(query, data),
    enabled: !!query && !!data,
  });
}

export function useFootballPredictionPoll() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    queryKey: ['football-prediction-poll'],
    queryFn: () => getFootballPredictionPoll<{
      id: string;
      question: string;
      options: string[];
      votes: number[];
      totalVotes: number;
    }>(),
  });
}

export function useCricketPredictionPoll() {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    queryKey: ['cricket-prediction-poll'],
    queryFn: () => getCricketPredictionPoll<{
      id: string;
      question: string;
      options: string[];
      votes: number[];
      totalVotes: number;
    }>(),
  });
}

export { useAIPrediction } from './useFootballData';
