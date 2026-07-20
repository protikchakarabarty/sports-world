import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCpu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenInjuries } from '@/hooks/useWomenFootballData';
import { Skeleton } from '@/components/ui/Skeleton';
import type { WomenInjuryReport } from '@/services/womenInjuryStaticData';

function severityColor(severity: string) {
  switch (severity) {
    case 'minor': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'moderate': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
    case 'severe': return 'bg-red-500/10 text-red-600 dark:text-red-400';
    default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  }
}

export function WomenInjuries() {
  const { t } = useLanguage();
  const { data: injuries, isLoading, isError } = useWomenInjuries();
  const scrollRef = useRef<HTMLDivElement>(null);

  const injuryList: WomenInjuryReport[] = useMemo(() => injuries ?? [], [injuries]);
  const hasData = !isError && injuryList.length > 0;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Section title={t("Women's Injuries & Suspensions", 'মহিলা চোট ও স্থগিত')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
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

  if (hasData) {
    return (
      <Section title={t("Women's Injuries & Suspensions", 'মহিলা চোট ও স্থগিত')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
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
            {injuryList.map((injury, i) => (
              <motion.div
                key={`w-injury-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="snap-start shrink-0"
              >
                <div className="w-[280px] glass-card match-card p-4 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {injury.player && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityColor(injury.severity)}`}>
                          {injury.severity === 'minor' ? t('Minor', 'সামান্য') :
                           injury.severity === 'moderate' ? t('Moderate', 'মধ্যম') :
                           injury.severity === 'severe' ? t('Severe', 'গুরুতর') : t('Unknown', 'অজানা')}
                        </span>
                      )}
                      {injury.aiGenerated && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          <FiCpu className="w-2.5 h-2.5" />
                          {t('AI', 'AI')}
                        </span>
                      )}
                    </div>
                    {injury.date && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <FiCalendar className="w-3 h-3" />
                        {injury.date}
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
                  {injury.expectedReturn && injury.expectedReturn !== 'Unknown' && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {t('Expected return', 'প্রত্যাশিত প্রত্যাবর্তন')}: {injury.expectedReturn}
                    </p>
                  )}
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
    <Section title={t("Women's Injuries & Suspensions", 'মহিলা চোট ও স্থগিত')} subtitle={t('Player injuries and suspensions', 'খেলোয়াড়ের চোট ও স্থগিত')}>
      <div className="flex items-center justify-center py-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("No women's football data is currently available.", 'মহিলা ফুটবল ডেটা বর্তমানে উপলব্ধ নেই।')}
        </p>
      </div>
    </Section>
  );
}
