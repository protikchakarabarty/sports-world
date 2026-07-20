import { useState } from 'react';
import { FiExternalLink, FiCalendar, FiClock } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenNews } from '@/hooks/useWomenFootballData';

const DEFAULT_NEWS_IMAGE = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop';

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function NewsSkeleton() {
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

export function WomenNewsSection() {
  const { t } = useLanguage();
  const { data: articles, isLoading, error } = useWomenNews();

  if (isLoading) {
    return (
      <Section title={t("Women's Football News", 'মহিলা ফুটবল খবর')} subtitle={t("Latest women's football news from around the world", 'বিশ্বজুড়ে সর্বশেষ মহিলা ফুটবল খবর')}>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] shrink-0">
              <NewsSkeleton />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title={t("Women's Football News", 'মহিলা ফুটবল খবর')} subtitle={t("Latest women's football news from around the world", 'বিশ্বজুড়ে সর্বশেষ মহিলা ফুটবল খবর')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-red-500 dark:text-red-400">
            {t('Failed to load news.', 'খবর লোড করতে ব্যর্থ।')}
          </p>
        </div>
      </Section>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <Section title={t("Women's Football News", 'মহিলা ফুটবল খবর')} subtitle={t("Latest women's football news from around the world", 'বিশ্বজুড়ে সর্বশেষ মহিলা ফুটবল খবর')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("No women's football news available.", 'কোনো মহিলা ফুটবল খবর পাওয়া যায়নি।')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t("Women's Football News", 'মহিলা ফুটবল খবর')} subtitle={t("Latest women's football news from around the world", 'বিশ্বজুড়ে সর্বশেষ মহিলা ফুটবল খবর')}>
      <MatchCarousel>
        {articles.map((article, i) => (
          <NewsCard key={article.id || `news-${i}`} article={article} />
        ))}
      </MatchCarousel>
    </Section>
  );
}

function NewsCard({ article }: { article: any }) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const imgSrc = (!article.image || imgError) ? DEFAULT_NEWS_IMAGE : article.image;

  return (
    <article className="glass-card overflow-hidden group flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {article.trending && <Badge variant="trending">{t('Trending', 'ট্রেন্ডিং')}</Badge>}
          <Badge variant="default" className="text-[10px]">
            {t('Women\'s Football', 'মহিলা ফুটবল')}
          </Badge>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="truncate max-w-[120px]">{article.author}</span>
          <div className="flex items-center gap-2 shrink-0">
            {article.date && (
              <span className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                {article.date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {formatTime(article.date)}
            </span>
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold
            bg-gradient-to-r from-emerald-500 to-teal-500 text-white
            hover:from-emerald-600 hover:to-teal-600
            transition-all duration-200 shadow-lg shadow-emerald-500/25
            active:scale-[0.98]"
        >
          {t('Read More', 'আরও পড়ুন')}
          <FiExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
