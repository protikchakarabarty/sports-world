import { useQuery } from '@tanstack/react-query';
import { getFootballHighlights, type VideoResult } from '@/services/youtubeApi';

export function useFootballHighlights() {
  return useQuery<VideoResult[]>({
    queryKey: ['football-highlights'],
    queryFn: () => getFootballHighlights(),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
