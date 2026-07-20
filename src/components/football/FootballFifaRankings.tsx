import { useState, useMemo, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronUp, FiChevronDown, FiMinus, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFifaRankings } from '@/hooks/useFootballData';

const CONFEDERATIONS = ['UEFA', 'CONMEBOL', 'AFC', 'CAF', 'CONCACAF', 'OFC'] as const;

function Flag({ code, country }: { code: string; country: string }) {
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
    <span className="inline-flex items-center justify-center w-7 h-5 rounded text-lg shrink-0" title={country}>
      {emoji ?? '🏳'}
    </span>
  );
}

function RankChange({ change, pointsChange }: { change: 'up' | 'down' | 'same'; pointsChange: number }) {
  if (change === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
        <FiChevronUp className="w-3.5 h-3.5" />{Math.abs(pointsChange).toFixed(1)}
      </span>
    );
  }
  if (change === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold text-xs">
        <FiChevronDown className="w-3.5 h-3.5" />{Math.abs(pointsChange).toFixed(1)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
      <FiMinus className="w-3.5 h-3.5" />—
    </span>
  );
}

function RankSkeleton() {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-5 w-6 shrink-0" />
        <Skeleton className="h-5 w-7 shrink-0 rounded" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="hidden sm:block shrink-0">
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="shrink-0 text-right space-y-1">
          <Skeleton className="h-4 w-14 ml-auto" />
          <Skeleton className="h-3 w-10 ml-auto" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full mt-3 rounded-full" />
    </div>
  );
}

function formatLastUpdated(raw: string): string {
  if (!raw) return '';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return raw;
  }
}

export function FootballFifaRankings() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState<string>('all');

  const { data: result, isLoading, isError, refetch, isFetching } = useFifaRankings();

  const rankings = result?.rankings ?? [];
  const lastUpdated = result?.lastUpdated ?? '';
  const source = result?.source ?? 'api';

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rankings.filter((r) => {
      if (confFilter !== 'all' && r.confederation !== confFilter) return false;
      if (q && !r.country.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rankings, search, confFilter]);

  const maxPoints = useMemo(() => {
    if (rankings.length === 0) return 2100;
    return rankings[0]?.points ?? 2100;
  }, [rankings]);

  const confCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rankings) {
      counts.set(r.confederation, (counts.get(r.confederation) ?? 0) + 1);
    }
    return counts;
  }, [rankings]);

  const [showAll, setShowAll] = useState(false);

  const isFiltered = search.trim().length > 0 || confFilter !== 'all';

  const visible = useMemo(() => {
    if (isFiltered || showAll) return filtered;
    return filtered.slice(0, 10);
  }, [filtered, isFiltered, showAll]);

  const hiddenCount = useMemo(() => {
    if (isFiltered || showAll) return 0;
    return Math.max(0, filtered.length - 10);
  }, [filtered, isFiltered, showAll]);

  const searchPlaceholder = t('Search country...', 'দেশ অনুসন্ধান...');
  const formattedDate = useMemo(() => formatLastUpdated(lastUpdated), [lastUpdated]);

  return (
    <Section
      title={t("FIFA Men's Rankings", "ফিফা পুরুষদের র্যাঙ্কিং")}
      subtitle={t('Official FIFA/Coca-Cola World Ranking for Men\'s National Teams', 'পুরুষদের জাতীয় দলের অফিসিয়াল ফিফা/কোকা-কোলা বিশ্ব র্যাঙ্কিং')}
      gradient="football"
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Search */}
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

        {/* Confederation filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setConfFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              confFilter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('All', 'সব')}
          </button>
          {CONFEDERATIONS.map((conf) => {
            const count = confCounts.get(conf) ?? 0;
            return (
              <button
                key={conf}
                onClick={() => setConfFilter(conf)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  confFilter === conf
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {conf} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate
              ? `${t('Last updated', 'সর্বশেষ আপডেট')}: ${formattedDate}`
              : ''}
          </p>
          {source === 'cache' && (
            <Badge variant="warning">{t('Cached', 'ক্যাশে')}</Badge>
          )}
          {source === 'fallback' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-600 dark:text-red-400">
              <FiAlertTriangle className="w-3 h-3" />
              {t('Estimated', 'আনুমানিক')}
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {t('Refresh', 'রিফ্রেশ')}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <RankSkeleton key={i} />
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
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <FiChevronDown className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t('Failed to load rankings', 'র্যাঙ্কিং লোড করতে ব্যর্থ')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {t('Please try again later.', 'পরে আবার চেষ্টা করুন।')}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            {t('Retry', 'পুনরায় চেষ্টা')}
          </button>
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
              ? t(`No countries matching "${search}"`, `"${search}" এর সাথে মিলে এমন কোনো দেশ নেই`)
              : t('No rankings available.', 'কোনো র্যাঙ্কিং পাওয়া যায়নি।')}
          </p>
        </motion.div>
      )}

      {/* Data */}
      {!isLoading && !isError && visible.length > 0 && (
        <AnimatePresence mode="popLayout">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left py-2.5 pr-2 w-10">#</th>
                  <th className="text-left py-2.5 pr-3 w-10">{t('Flag', 'পতাকা')}</th>
                  <th className="text-left py-2.5 pr-4">{t('Country', 'দেশ')}</th>
                  <th className="text-left py-2.5 pr-4 w-24">{t('Confederation', 'কনফেডারেশন')}</th>
                  <th className="text-right py-2.5 pr-4 w-20">{t('Points', 'পয়েন্ট')}</th>
                  <th className="text-right py-2.5 pr-4 w-20">{t('Prev', 'পূর্ববর্তী')}</th>
                  <th className="text-right py-2.5 pr-4 w-24">{t('Change', 'পরিবর্তন')}</th>
                  <th className="py-2.5 w-32">{t('Form', 'ফর্ম')}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {visible.map((entry, i) => {
                    const barWidth = Math.max(2, (entry.points / maxPoints) * 100);
                    const isTop3 = entry.rank <= 3;
                    return (
                      <motion.tr
                        key={entry.country}
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
                          <Flag code={entry.countryCode} country={entry.country} />
                        </td>
                        <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                          {entry.country}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {entry.confederation}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-gray-900 dark:text-white tabular-nums">
                          {entry.points.toFixed(1)}
                        </td>
                        <td className="py-2.5 pr-4 text-right text-gray-500 dark:text-gray-400 tabular-nums">
                          {entry.previousRank}
                        </td>
                        <td className="py-2.5 pr-4 text-right">
                          <RankChange change={entry.rankChange} pointsChange={entry.pointsChange} />
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.02 }}
                                className={`h-full rounded-full ${
                                  entry.rankChange === 'up'
                                    ? 'bg-emerald-500'
                                    : entry.rankChange === 'down'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 tabular-nums w-10 text-right">
                              {barWidth.toFixed(0)}%
                            </span>
                          </div>
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
              {visible.map((entry, i) => {
                const barWidth = Math.max(2, (entry.points / maxPoints) * 100);
                const isTop3 = entry.rank <= 3;
                return (
                  <motion.div
                    key={entry.country}
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

                      <Flag code={entry.countryCode} country={entry.country} />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {entry.country}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {entry.confederation}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                          {entry.points.toFixed(1)}
                        </p>
                        <RankChange change={entry.rankChange} pointsChange={entry.pointsChange} />
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.02 }}
                          className={`h-full rounded-full ${
                            entry.rankChange === 'up'
                              ? 'bg-emerald-500'
                              : entry.rankChange === 'down'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 tabular-nums">
                        #{entry.previousRank}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </AnimatePresence>
      )}

      {/* View More / Show Less */}
      {!isLoading && !isError && !isFiltered && filtered.length > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
              bg-gradient-to-r from-emerald-500 to-green-500 text-white
              shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50
              ring-1 ring-amber-400/40 hover:ring-amber-400/70
              transition-all duration-300 hover:scale-105 active:scale-[0.98]"
          >
            <motion.span
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex"
            >
              <FiChevronDown className="w-4 h-4" />
            </motion.span>
            {showAll
              ? t('Show Less', 'সংক্ষিপ্ত দেখান')
              : `${t('View More', 'আরো দেখুন')} (${hiddenCount})`}
          </button>
        </motion.div>
      )}
    </Section>
  );
}
