import { motion } from 'framer-motion';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketFantasyData } from '@/hooks/useCricketData';
import { PlayerPhoto } from './PlayerPhoto';

export function FantasyXI({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: players, isLoading } = useCricketFantasyData(gender);

  if (isLoading) {
    return (
      <Section title={t('Fantasy XI', 'ফ্যান্টাসি একাদশ')} subtitle={t('AI-powered dream team suggestions', 'এআই চালিত স্বপ্নের দল পরামর্শ')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="glass-card p-3 text-center">
              <Skeleton className="w-10 h-10 rounded-full mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto mb-1" />
              <Skeleton className="h-4 w-14 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (!players || players.length === 0) {
    return (
      <Section title={t('Fantasy XI', 'ফ্যান্টাসি একাদশ')} subtitle={t('AI-powered dream team suggestions', 'এআই চালিত স্বপ্নের দল পরামর্শ')}>
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('No fantasy data available at the moment.', 'এই মুহূর্তে কোনো ফ্যান্টাসি ডেটা উপলব্ধ নেই।')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Fantasy XI', 'ফ্যান্টাসি একাদশ')} subtitle={t('AI-powered dream team suggestions', 'এআই চালিত স্বপ্নের দল পরামর্শ')}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {players.map((player, i) => (
          <motion.div
            key={player.name ?? `fantasy-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3 text-center"
          >
            <div className="mx-auto mb-2">
              <PlayerPhoto name={player.name} size="md" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{player.name}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Badge variant="default">{player.role}</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-1">{player.team}</p>
            <p className="text-xs font-bold text-primary mt-1">{player.points} pts</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
