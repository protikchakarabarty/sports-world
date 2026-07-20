import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketInjuries } from '@/hooks/useCricketData';
import type { Gender } from '@/data/mockData';

function statusColor(status: string) {
  switch (status) {
    case 'day-to-day': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'injured': return 'bg-red-500/10 text-red-600 dark:text-red-400';
    case 'out': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  }
}

export function CricketInjuries({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: injuries, isLoading } = useCricketInjuries(gender);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Section title={t('Injury Report', 'ইnjury রিপোর্ট')} subtitle={t('Player injuries and return dates', 'খেলোয়াড়ের চোট ও ফেরার তারিখ')}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[280px] shrink-0 glass-card p-4 space-y-2">
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

  if (injuries && injuries.length > 0) {
    return (
      <Section title={t('Injury Report', 'ইnjury রিপোর্ট')} subtitle={t('Player injuries and return dates', 'খেলোয়াড়ের চোট ও ফেরার তারিখ')}>
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
          >
            {injuries.map((injury, i) => (
              <motion.div
                key={injury.id || `injury-card-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="snap-start shrink-0"
              >
                <div className="w-[280px] glass-card match-card p-4 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
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
                </div>
              </motion.div>
            ))}
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

  return (
    <Section title={t('Injury Report', 'ইnjury রিপোর্ট')} subtitle={t('Player injuries and return dates', 'খেলোয়াড়ের চোট ও ফেরার তারিখ')}>
      <div className="flex items-center justify-center py-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('No major injury updates available today.', 'আজকে কোনো বড় চোট আপডেট নেই।')}
        </p>
      </div>
    </Section>
  );
}
