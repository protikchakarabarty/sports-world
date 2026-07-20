import { useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlay, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMatchHighlights } from '@/services/youtubeApi';
import type { VideoResult } from '@/services/youtubeApi';

const SPORTS = [
  'basketball', 'tennis', 'formula 1', 'hockey',
  'volleyball', 'boxing', 'golf', 'athletics',
];

const SPORT_LABELS: Record<string, string> = {
  basketball: 'Basketball', tennis: 'Tennis', 'formula 1': 'Formula 1',
  hockey: 'Hockey', volleyball: 'Volleyball', boxing: 'Boxing',
  golf: 'Golf', athletics: 'Athletics',
};

const SPORT_IMAGES: Record<string, string> = {
  basketball: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball_court_%28cropped%29.jpg',
  tennis: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/ATP_Tennis_ball.JPG',
  'formula 1': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Formula1.jpg',
  hockey: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Field_hockey_at_the_2012_Summer_Olympics_1.jpg',
  volleyball: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Volleyball_game.jpg',
  boxing: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Boxing_ring.jpg',
  golf: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Golf_ball.jpg',
  athletics: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/100m_at_2012_Olympics.jpg',
};

const FALLBACK_HIGHLIGHTS: VideoResult[] = [
  { videoId: 'fb1', id: 'fb1', title: 'NBA Finals Game 7 Highlights', description: 'Basketball championship action', thumbnail: SPORT_IMAGES.basketball, channel: 'NBA', publishedAt: '' },
  { videoId: 'fb2', id: 'fb2', title: 'Wimbledon Men\'s Final Highlights', description: 'Tennis at its finest', thumbnail: SPORT_IMAGES.tennis, channel: 'Wimbledon', publishedAt: '' },
  { videoId: 'fb3', id: 'fb3', title: 'Monaco Grand Prix Race Highlights', description: 'F1 racing around Monte Carlo', thumbnail: SPORT_IMAGES['formula 1'], channel: 'Formula 1', publishedAt: '' },
  { videoId: 'fb4', id: 'fb4', title: 'NHL Stanley Cup Playoffs Highlights', description: 'Ice hockey championship', thumbnail: SPORT_IMAGES.hockey, channel: 'NHL', publishedAt: '' },
  { videoId: 'fb5', id: 'fb5', title: 'FIVB World Championship Highlights', description: 'Top volleyball action', thumbnail: SPORT_IMAGES.volleyball, channel: 'FIVB', publishedAt: '' },
  { videoId: 'fb6', id: 'fb6', title: 'Heavyweight Title Fight Highlights', description: 'Championship boxing match', thumbnail: SPORT_IMAGES.boxing, channel: 'Boxing', publishedAt: '' },
  { videoId: 'fb7', id: 'fb7', title: 'The Masters Final Round Highlights', description: 'Golf major championship', thumbnail: SPORT_IMAGES.golf, channel: 'PGA Tour', publishedAt: '' },
  { videoId: 'fb8', id: 'fb8', title: 'World Athletics Championships Highlights', description: 'Track and field excellence', thumbnail: SPORT_IMAGES.athletics, channel: 'World Athletics', publishedAt: '' },
  { videoId: 'fb9', id: 'fb9', title: 'NBA Western Conference Finals', description: 'Basketball playoff intensity', thumbnail: SPORT_IMAGES.basketball, channel: 'NBA', publishedAt: '' },
  { videoId: 'fb10', id: 'fb10', title: 'US Open Final Highlights', description: 'Grand Slam tennis', thumbnail: SPORT_IMAGES.tennis, channel: 'US Open', publishedAt: '' },
  { videoId: 'fb11', id: 'fb11', title: 'F1 Season Review Race Highlights', description: 'Best moments of the season', thumbnail: SPORT_IMAGES['formula 1'], channel: 'Formula 1', publishedAt: '' },
  { videoId: 'fb12', id: 'fb12', title: 'Olympic Hockey Gold Medal Match', description: 'Field hockey at its peak', thumbnail: SPORT_IMAGES.hockey, channel: 'Olympics', publishedAt: '' },
];

function getSportFromFallback(fb: VideoResult): string {
  const map: Record<string, string> = {};
  for (const v of FALLBACK_HIGHLIGHTS) {
    for (const [sport, url] of Object.entries(SPORT_IMAGES)) {
      if (v.thumbnail === url) map[v.videoId] = sport;
    }
  }
  return map[fb.videoId] || 'Sports';
}

function getSportFromTitle(title: string): string {
  for (const [key, label] of Object.entries(SPORT_LABELS)) {
    if (title.toLowerCase().includes(key)) return label;
  }
  return 'Sports';
}

function Card({ video, sport }: { video: VideoResult; sport: string }) {
  return (
    <div className="w-[300px] shrink-0">
      <div className="glass-card overflow-hidden group cursor-pointer p-0 block">
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div whileHover={{ scale: 1.1 }} className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <FiPlay className="w-5 h-5 text-white ml-0.5" />
            </motion.div>
          </div>
          <span className="absolute top-2 left-2 text-[10px] font-medium text-white bg-primary/80 px-2 py-0.5 rounded-full">
            {sport}
          </span>
        </div>
        <div className="p-2.5">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{video.title}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-xs text-gray-400 truncate flex-1">{video.channel}</p>
            <FiExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MatchHighlights() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const queries = useQueries({
    queries: SPORTS.map((sport) => ({
      queryKey: ['youtube', 'highlights', sport],
      queryFn: () => getMatchHighlights(sport, 2),
      staleTime: 1000 * 60 * 30,
      retry: 1,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const hasRealData = queries.some((q) => q.data && q.data.length > 0);

  const videos: { video: VideoResult; sport: string }[] = [];

  if (hasRealData) {
    for (let i = 0; i < queries.length; i++) {
      const data = queries[i].data;
      if (data && data.length > 0) {
        for (const v of data) {
          videos.push({ video: v, sport: SPORT_LABELS[SPORTS[i]] });
        }
      }
    }
    videos.sort((a, b) => new Date(b.video.publishedAt).getTime() - new Date(a.video.publishedAt).getTime());
  }

  const displayVideos = videos.length > 0
    ? videos.slice(0, 12)
    : FALLBACK_HIGHLIGHTS.map((v) => ({
        video: v,
        sport: getSportFromTitle(v.title) || getSportFromFallback(v),
      }));

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <Section title={t('Match Highlights', 'ম্যাচ হাইলাইটস')} subtitle={t('Best moments from top sports', 'শীর্ষ খেলার সেরা মুহূর্ত')}>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[300px] shrink-0">
                <div className="glass-card overflow-hidden p-0">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-2.5 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
          >
            {displayVideos.map((item, i) => {
              const v = item.video;
              const isPlaceholder = !hasRealData;
              return (
                <motion.a
                  key={`${v.videoId}-${i}`}
                  href={isPlaceholder ? undefined : `https://www.youtube.com/watch?v=${v.videoId}`}
                  target={isPlaceholder ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="snap-start shrink-0 block"
                >
                  <Card video={v} sport={item.sport} />
                </motion.a>
              );
            })}
          </div>
        )}

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -mr-4"
        >
          <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </Section>
  );
}
