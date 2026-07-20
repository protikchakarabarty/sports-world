import { useState, useMemo, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronUp, FiChevronDown, FiMinus } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRichestFootballers } from '@/hooks/useFootballData';
import type { Gender } from '@/data/mockData';

function Flag({ code }: { code: string }) {
  const emoji = useMemo(() => {
    if (!code || code.length !== 2) return null;
    try {
      const cp = [...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
      return String.fromCodePoint(...cp);
    } catch {
      return null;
    }
  }, [code]);

  return (
    <span className="inline-flex items-center justify-center w-5 h-4 rounded text-base shrink-0" title={code}>
      {emoji ?? '🏳'}
    </span>
  );
}

function PlayerImage({ src, name }: { src: string; name: string }) {
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff&size=128`;
  return (
    <img
      src={src}
      alt={name}
      className="w-8 h-8 rounded-full object-cover shrink-0 bg-gray-100 dark:bg-gray-700"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackUrl;
      }}
    />
  );
}

function RankChange({ change }: { change: 'up' | 'down' | 'same' }) {
  if (change === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
        <FiChevronUp className="w-3.5 h-3.5" />
      </span>
    );
  }
  if (change === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold text-xs">
        <FiChevronDown className="w-3.5 h-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
      <FiMinus className="w-3.5 h-3.5" />
    </span>
  );
}

function RichListSkeleton() {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-5 w-6 shrink-0" />
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="hidden sm:block shrink-0">
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="shrink-0 text-right space-y-1">
          <Skeleton className="h-4 w-16 ml-auto" />
          <Skeleton className="h-3 w-14 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function FootballRichList({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const { data: footballers, isLoading, isError } = useRichestFootballers();

  const filtered = useMemo(() => {
    if (!footballers) return [];
    const q = search.toLowerCase().trim();
    if (!q) return footballers;
    return footballers.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      f.club.toLowerCase().includes(q) ||
      f.nationality.toLowerCase().includes(q) ||
      f.countryOfClub.toLowerCase().includes(q)
    );
  }, [footballers, search]);

  const searchPlaceholder = t('Search player, club or country...', 'খেলোয়াড়, ক্লাব বা দেশ অনুসন্ধান...');

  return (
    <Section
      title={t('Richest Footballers (Top 10)', 'শীর্ষ ১০ ধনী ফুটবলার')}
      subtitle={t('Estimated net worth based on salary, endorsements and business ventures.', 'বেতন, এনডোরসমেন্ট এবং ব্যবসায়িক বিনিয়োগের ভিত্তিতে আনুমানিক মোট সম্পদ।')}
      gradient="football"
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-shadow"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {footballers?.length ?? 0}
          </span>{' '}
          {t('players ranked', 'জন খেলোয়াড়')}
          {' · '}
          {t('Estimated net worth', 'আনুমানিক মোট সম্পদ')}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <RichListSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t('Failed to load data', 'ডেটা লোড করতে ব্যর্থ')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('Please try again later.', 'পরে আবার চেষ্টা করুন।')}
          </p>
        </motion.div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <FiSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search
              ? t(`No players matching "${search}"`, `"${search}" এর সাথে মিলে এমন কোনো খেলোয়াড় নেই`)
              : t('No data available.', 'কোনো তথ্য পাওয়া যায়নি।')}
          </p>
        </motion.div>
      )}

      {/* Data */}
      {!isLoading && !isError && filtered.length > 0 && (
        <AnimatePresence mode="popLayout">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left py-2.5 pr-2 w-8">#</th>
                  <th className="text-left py-2.5 pr-3 w-10"></th>
                  <th className="text-left py-2.5 pr-4">{t('Player', 'খেলোয়াড়')}</th>
                  <th className="text-right py-2.5 pr-4 w-28">{t('Net Worth', 'মোট মূল্য')}</th>
                  <th className="text-right py-2.5 pr-4 w-24">{t('Salary', 'বেতন')}</th>
                  <th className="text-left py-2.5 pr-4 w-28">{t('Nationality', 'জাতীয়তা')}</th>
                  <th className="text-left py-2.5 pr-4 w-28">{t('Country of Club', 'ক্লাবের দেশ')}</th>
                  <th className="text-left py-2.5 pr-4 w-36">{t('Current Club', 'বর্তমান ক্লাব')}</th>
                  <th className="text-right py-2.5 w-16">{t('Move', 'অবস্থান')}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((entry, i) => {
                    const isTop3 = entry.rank <= 3;
                    return (
                      <motion.tr
                        key={entry.name}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.015 }}
                        className={`border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                          isTop3 ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                        }`}
                      >
                        <td className={`py-2.5 pr-2 text-sm font-bold ${
                          isTop3 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {isTop3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                        </td>
                        <td className="py-2.5 pr-3">
                          <PlayerImage src={entry.image} name={entry.name} />
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                          {entry.netWorthDisplay}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {entry.annualSalary}
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Flag code={entry.countryCode} />
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                              {entry.nationality}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Flag code={entry.countryOfClubCode} />
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[110px]">
                              {entry.countryOfClub}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                          {entry.club}
                        </td>
                        <td className="py-2.5 text-right">
                          <RankChange change={entry.rankChange} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-2.5">
            <AnimatePresence>
              {filtered.map((entry, i) => {
                const isTop3 = entry.rank <= 3;
                return (
                  <motion.div
                    key={entry.name}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.015 }}
                    className={`glass-card p-3 ${isTop3 ? 'ring-1 ring-amber-400/40' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold w-7 text-center shrink-0 ${
                        isTop3 ? '' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {isTop3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : (
                          <span className="text-sm">{entry.rank}</span>
                        )}
                      </div>

                      <PlayerImage src={entry.image} name={entry.name} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {entry.name}
                          </p>
                          <Flag code={entry.countryCode} />
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {entry.club} · {entry.countryOfClub}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                          {entry.netWorthDisplay}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {entry.annualSalary}/yr
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{entry.nationality}</span>
                      <RankChange change={entry.rankChange} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </AnimatePresence>
      )}
    </Section>
  );
}
