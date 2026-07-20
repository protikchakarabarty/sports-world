import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFootballLeagues } from '@/hooks/useFootballData';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function FootballLeagues({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data, isLoading, isError, error } = useFootballLeagues(gender);
  const leagues = data?.running ?? [];

  if (isLoading) {
    return (
      <Section title={t('Football Leagues', 'ফুটবল লীগ')} subtitle={t('Active football competitions', 'সক্রিয় ফুটবল প্রতিযোগিতা')}>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section title={t('Football Leagues', 'ফুটবল লীগ')} subtitle={t('Active football competitions', 'সক্রিয় ফুটবল প্রতিযোগিতা')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FiAlertCircle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-xs text-gray-400">
            {error instanceof Error ? error.message : t('Failed to load', 'লোড করা যায়নি')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Football Leagues', 'ফুটবল লীগ')} subtitle={t('Active football competitions', 'সক্রিয় ফুটবল প্রতিযোগিতা')}>
      {leagues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-gray-400">{t('No league data available', 'কোনো লীগ ডেটা উপলব্ধ নেই')}</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {leagues.map((league, i) => (
          <motion.div
            key={league.id || `league-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{league.name}</h4>
              <Badge variant={league.status === 'ongoing' ? 'live' : 'warning'}>
                {t(league.status.charAt(0).toUpperCase() + league.status.slice(1), league.status === 'ongoing' ? 'চলমান' : 'আসন্ন')}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>{league.type}</span>
              {league.startDate && league.endDate && (
                <><span>•</span><span>{league.startDate} → {league.endDate}</span></>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </Section>
  );
}
