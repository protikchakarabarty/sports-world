import { useQuery } from '@tanstack/react-query';
import {
  getNewsByCategory,
  searchNews,
  getGeneralSportsNews,
} from '@/services/newsApi';
import type { NormalizedArticle, SportCategory } from '@/services/newsApi';

function useNewsQuery(key: string, fetcher: () => Promise<NormalizedArticle[]>) {
  return useQuery<NormalizedArticle[]>({
    queryKey: ['news', key],
    queryFn: async () => {
      try {
        return await fetcher();
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

export function useFootballNews() {
  return useNewsQuery('football', () => getNewsByCategory('football'));
}

export function useCricketNews() {
  return useNewsQuery('cricket', () => getNewsByCategory('cricket'));
}

export function useTennisNews() {
  return useNewsQuery('tennis', () => getNewsByCategory('tennis'));
}

export function useHockeyNews() {
  return useNewsQuery('hockey', () => getNewsByCategory('hockey'));
}

export function useBasketballNews() {
  return useNewsQuery('basketball', () => getNewsByCategory('basketball'));
}

export function useFormula1News() {
  return useNewsQuery('formula1', () => getNewsByCategory('formula 1'));
}

export function useOlympicsNews() {
  return useNewsQuery('olympics', () => getNewsByCategory('olympics'));
}

export function useGeneralSportsNews() {
  return useNewsQuery('general', getGeneralSportsNews);
}

export function useNewsSearch(query: string) {
  return useQuery<NormalizedArticle[]>({
    queryKey: ['news-search', query],
    queryFn: async () => {
      try {
        return await searchNews(query);
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: query.length > 2,
  });
}
