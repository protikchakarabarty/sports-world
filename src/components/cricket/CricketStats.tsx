import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender } from '@/data/mockData';
import type { CricketStats as CricketStatType } from '@/types';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketStatsData } from '@/hooks/useCricketData';

const tabs = [
  { key: 'runs', label: { en: 'Top Run Scorers', bn: 'শীর্ষ রান সংগ্রহকারী' } },
  { key: 'wickets', label: { en: 'Top Wicket Takers', bn: 'শীর্ষ উইকেট সংগ্রহকারী' } },
  { key: 'hundreds', label: { en: 'Most Hundreds', bn: 'সর্বোচ্চ সেঞ্চুরি' } },
];

function StatsTable({ data, activeTab }: { data: CricketStatType[]; activeTab: string }) {
  const isRuns = activeTab === 'runs';
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
              <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">#</th>
              <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Player</th>
              <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Team</th>
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Mat</th>}
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Inns</th>}
              <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{isRuns ? 'Runs' : activeTab === 'wickets' ? 'Wkts' : '100s'}</th>
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">HS</th>}
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Ave</th>}
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">SR</th>}
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">100</th>}
              {isRuns && <th className="text-right p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">50</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {data.map((stat, i) => (
                <motion.tr
                  key={stat.player ?? `${activeTab}-${i}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-3 font-bold text-gray-400">{i + 1}</td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{stat.player}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{stat.team}</td>
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.mat}</td>}
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.inns}</td>}
                  <td className="p-3 text-right font-bold text-blue-500">{isRuns ? stat.runs : (stat.wickets ?? stat.hundreds)}</td>
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.hs}</td>}
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.ave}</td>}
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.sr}</td>}
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.hundreds}</td>}
                  {isRuns && <td className="p-3 text-right text-gray-600 dark:text-gray-400">{stat.fifties}</td>}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CricketStats({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('runs');
  const { data: stats, isLoading } = useCricketStatsData(gender);
  const data = stats ? stats[activeTab as keyof typeof stats] : [];

  return (
    <Section title={t('Cricket Statistics', 'ক্রিকেট পরিসংখ্যান')}>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(tab.label.en, tab.label.bn)}
          </motion.button>
        ))}
      </div>
      {isLoading ? (
        <div className="glass-card p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-6 h-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      ) : data.length > 0 ? (
          <StatsTable data={data} activeTab={activeTab} />
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('No stats available at the moment.', 'এই মুহূর্তে কোনো পরিসংখ্যান উপলব্ধ নেই।')}
          </p>
        </div>
      )}
    </Section>
  );
}
