import { useQuery } from '@tanstack/react-query';
import {
  getCricketHighlights,
  getWomenCricketHighlights,
  getMatchHighlights,
  getPressConferences,
  getPlayerInterviews,
  getOfficialSportsVideos,
} from '@/services/youtubeApi';
import type { VideoResult } from '@/services/youtubeApi';

function useYouTubeQuery(key: string, fetcher: () => Promise<VideoResult[]>) {
  return useQuery<VideoResult[]>({
    queryKey: ['youtube', key],
    queryFn: async () => {
      try {
        const results = await fetcher();
        return results;
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

export function useFootballHighlights() {
  return useYouTubeQuery('football-highlights', () => getMatchHighlights('football', 6));
}

export function useCricketHighlights() {
  return useYouTubeQuery('cricket-highlights', () => getCricketHighlights(12));
}

export function useWomenCricketHighlights() {
  return useYouTubeQuery('women-cricket-highlights', () => getWomenCricketHighlights(12));
}

export function useFootballPressConferences() {
  return useYouTubeQuery('football-press', () => getPressConferences('football', 6));
}

export function useCricketPressConferences() {
  return useYouTubeQuery('cricket-press', () => getPressConferences('cricket', 6));
}

export function useFootballInterviews() {
  return useYouTubeQuery('football-interviews', () => getPlayerInterviews('football', 6));
}

export function useCricketInterviews() {
  return useYouTubeQuery('cricket-interviews', () => getPlayerInterviews('cricket', 6));
}

export function useFootballOfficialVideos() {
  return useYouTubeQuery('football-official', () => getOfficialSportsVideos('football', 6));
}

export function useCricketOfficialVideos() {
  return useYouTubeQuery('cricket-official', () => getOfficialSportsVideos('cricket', 6));
}
