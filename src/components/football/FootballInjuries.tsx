import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInjuries } from '@/hooks/useFootballData';
import { Skeleton } from '@/components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { searchNews } from '@/services/newsApi';

function statusColor(status: string) {
  switch (status) {
    case 'day-to-day': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'injured': return 'bg-red-500/10 text-red-600 dark:text-red-400';
    case 'out': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  }
}

const INJURY_NEWS_QUERIES = [
  'football injury update',
  'player injured match injury news',
  'injury return footballer',
];

function useInjuryNews() {
  return useQuery({
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryKey: ['football-injury-news'],
    queryFn: async () => {
      const seen = new Set<string>();
      const articles: { title: string; source: string; date: string; url: string }[] = [];

      for (const query of INJURY_NEWS_QUERIES) {
        if (articles.length >= 8) break;
        const results = await searchNews(query, 4);
        for (const article of results) {
          if (!seen.has(article.url)) {
            seen.add(article.url);
            articles.push({
              title: article.title,
              source: article.source,
              date: article.publishedAt?.split('T')[0] || '',
              url: article.url,
            });
          }
        }
      }

      return articles.slice(0, 8);
    },
  });
}

export function FootballInjuries({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: injuries, isLoading, isError } = useInjuries(gender);
  const { data: injuryNews, isLoading: newsLoading } = useInjuryNews();

  const showNewsFallback = (isError || !injuries?.length) && !isLoading;
  const hasNews = injuryNews && injuryNews.length > 0;

  if (isLoading) {
    return (
      <Section title={t('Injury & Suspension List', 'চোট ও স্থগিত তালিকা')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (!showNewsFallback && injuries && injuries.length > 0) {
    return (
      <Section title={t('Injury & Suspension List', 'চোট ও স্থগিত তালিকা')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {injuries.map((injury, i) => (
            <motion.div
              key={injury.id || `injury-card-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="glass-card match-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(injury.status)}`}>
                  {injury.status === 'day-to-day' ? t('Day-to-Day', 'দিন দিন') : injury.status === 'injured' ? t('Injured', 'আহত') : t('Out', 'বাইরে')}
                </span>
                {injury.returnDate && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <FiCalendar className="w-3 h-3" />
                    {injury.returnDate}
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 truncate">
                {injury.player}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {injury.team}
              </p>
              <p className="text-xs font-medium text-primary">
                {injury.injury}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  }

  if (showNewsFallback && newsLoading) {
    return (
      <Section title={t('Injury & Suspension List', 'চোট ও স্থগিত তালিকা')} subtitle={t('Latest injury news', 'সর্বশেষ চোটের খবর')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (showNewsFallback && hasNews) {
    return (
      <Section title={t('Injury & Suspension List', 'চোট ও স্থগিত তালিকা')} subtitle={t('Latest injury news', 'সর্বশেষ চোটের খবর')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {injuryNews!.map((article, i) => (
            <motion.a
              key={article.url || `injury-${i}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="glass-card p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors block"
            >
              <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">
                {article.title}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="truncate max-w-[100px]">{article.source}</span>
                <span>{article.date}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Injury & Suspension List', 'চোট ও স্থগিত তালিকা')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
      <div className="flex items-center justify-center py-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('No major injury updates available today.', 'আজকে কোনো বড় চোট আপডেট নেই।')}
        </p>
      </div>
    </Section>
  );
}
