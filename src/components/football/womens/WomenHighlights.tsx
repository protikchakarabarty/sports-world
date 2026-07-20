import { FiExternalLink, FiCalendar, FiClock, FiPlay } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenFootballHighlights } from '@/hooks/useWomenFootballData';

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function HighlightSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

export function WomenHighlights() {
  const { t } = useLanguage();
  const { data: videos, isLoading } = useWomenFootballHighlights();

  if (isLoading) {
    return (
      <Section title={t("Women's Match Highlights", 'মহিলা ম্যাচ হাইলাইটস')} subtitle={t('Best moments from recent women\'s football matches', 'সাম্প্রতিক মহিলা ফুটবল ম্যাচের সেরা মুহূর্ত')} link="#">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] shrink-0">
              <HighlightSkeleton />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Section title={t("Women's Match Highlights", 'মহিলা ম্যাচ হাইলাইটস')} subtitle={t('Best moments from recent women\'s football matches', 'সাম্প্রতিক মহিলা ফুটবল ম্যাচের সেরা মুহূর্ত')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("No women's football data is currently available.", 'মহিলা ফুটবল ডেটা বর্তমানে উপলভ্য নয়।')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t("Women's Match Highlights", 'মহিলা ম্যাচ হাইলাইটস')} subtitle={t('Best moments from recent women\'s football matches', 'সাম্প্রতিক মহিলা ফুটবল ম্যাচের সেরা মুহূর্ত')} link="#">
      <MatchCarousel>
        {videos.map((video, i) => (
          <article
            key={video.id || `highlights-${i}`}
            className="glass-card overflow-hidden group flex flex-col"
          >
            <div className="relative overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-emerald-500/90 flex items-center justify-center">
                  <FiPlay className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge variant="trending">{t('Highlights', 'হাইলাইটস')}</Badge>
                <Badge variant="default" className="text-[10px]">
                  {t("Women's Football", 'মহিলা ফুটবল')}
                </Badge>
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 flex-1">
                {video.channel}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="truncate max-w-[120px]">{video.channel}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {video.publishedAt?.split('T')[0] || ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {formatTime(video.publishedAt || '')}
                  </span>
                </div>
              </div>

              <a
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold
                  bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                  hover:from-emerald-600 hover:to-teal-600
                  transition-all duration-200 shadow-lg shadow-emerald-500/25
                  active:scale-[0.98]"
              >
                <FiPlay className="w-3 h-3" />
                {t('Watch Now', 'এখন দেখুন')}
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </MatchCarousel>
    </Section>
  );
}
