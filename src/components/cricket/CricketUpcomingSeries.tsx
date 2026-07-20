import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCricketUpcomingSeries } from '@/hooks/useCricketData';
import type { Gender } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

export function CricketUpcomingSeries({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: series, isLoading } = useCricketUpcomingSeries(gender);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Section title={t('Upcoming Series', 'আসন্ন সিরিজ')} subtitle={t('Cricket series scheduled in the coming days', 'আগামী দিনে নির্ধারিত ক্রিকেট সিরিজ')}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[260px] shrink-0 glass-card p-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (!series || series.length === 0) {
    return (
      <Section title={t('Upcoming Series', 'আসন্ন সিরিজ')} subtitle={t('Cricket series scheduled in the coming days', 'আগামী দিনে নির্ধারিত ক্রিকেট সিরিজ')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('No upcoming series found.', 'কোন আসন্ন সিরিজ পাওয়া যায়নি।')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Upcoming Series', 'আসন্ন সিরিজ')} subtitle={t('Cricket series scheduled in the coming days', 'আগামী দিনে নির্ধারিত ক্রিকেট সিরিজ')}>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {series.map((s, i) => {
            const seriesKey = s.id ?? s.name ?? `upcoming-series-${i}`;
            return (
            <motion.div
              key={seriesKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0 w-[260px] bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="warning">
                  {t('Upcoming', 'আসন্ন')}
                </Badge>
                <span className="text-xs font-medium text-gray-400">{s.type}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{s.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{s.startDate}</span>
                <span>→</span>
                <span>{s.endDate}</span>
              </div>
            </motion.div>
            );
          })}
        </div>

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
