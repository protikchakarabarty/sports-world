import { useQuery } from '@tanstack/react-query';
import {
  getFootballPredictionPoll,
  getCricketPredictionPoll,
  getAiPrediction,
} from '@/services/aiPredictionService';
import type { PredictionPoll } from '@/types';

export function useFootballPredictionPoll() {
  return useQuery<PredictionPoll>({
    queryKey: ['football-prediction-poll'],
    queryFn: getFootballPredictionPoll,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCricketPredictionPoll() {
  return useQuery<PredictionPoll>({
    queryKey: ['cricket-prediction-poll'],
    queryFn: getCricketPredictionPoll,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useAIPrediction(question: string, options: string[]) {
  return useQuery({
    queryKey: ['ai-prediction', question, ...options],
    queryFn: () => getAiPrediction(question, options),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!question && options.length > 0,
  });
}
