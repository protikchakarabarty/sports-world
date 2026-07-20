import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFootballStats } from '@/hooks/useFootballData';
import { Skeleton } from '@/components/ui/Skeleton';

const LEAGUES = [
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'FL1', name: 'Ligue 1' },
];

export function FootballStats({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [showGoals, setShowGoals] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('PL');
  const { data, isLoading, isError, error } = useFootballStats(gender, selectedLeague);

  const filtered = showGoals
    ? data.filter((s) => s.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, 20)
    : data.filter((s) => (s.assists ?? 0) > 0).sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0)).slice(0, 20);

  return (
    <Section title={t('Football Statistics', 'ফুটবল পরিসংখ্যান')}>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: true, label: { en: 'Top Goal Scorers', bn: 'শীর্ষ গোলদাতা' } },
          { key: false, label: { en: 'Top Assists', bn: 'শীর্ষ অ্যাসিস্ট' } },
        ].map((tab) => (
          <motion.button
            key={String(tab.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGoals(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              showGoals === tab.key
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(tab.label.en, tab.label.bn)}
          </motion.button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-1.5">
          {LEAGUES.map((l) => (
            <motion.button
              key={l.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLeague(l.code)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedLeague === l.code
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {l.name}
            </motion.button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiAlertCircle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-xs text-gray-400">
            {error instanceof Error ? error.message : t('Failed to load stats', 'পরিসংখ্যান লোড করা যায়নি')}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-gray-400">
            {t('No statistics available for the current season', 'বর্তমান মৌসুমের জন্য কোনো পরিসংখ্যান নেই')}
          </p>
        </div>
      ) : (
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
                <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">#</th>
                <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{t('Player', 'খেলোয়াড়')}</th>
                <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{t('Team', 'দল')}</th>
                <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{showGoals ? t('Goals', 'গোল') : t('Assists', 'অ্যাসিস্ট')}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((stat, i) => (
                  <motion.tr
                    key={`${showGoals ? 'g' : 'a'}-${stat.playerName}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-3 font-bold text-gray-400">{i + 1}</td>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{stat.playerName}</td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">{stat.team}</td>
                    <td className="p-3 text-right font-bold text-emerald-500">{showGoals ? stat.goals : stat.assists}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      )}
    </Section>
  );
}
