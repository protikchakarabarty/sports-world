import { useState, useMemo, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronUp, FiChevronDown, FiMinus, FiRefreshCw } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenClubRankings } from '@/hooks/useWomenFootballData';

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

function ClubLogo({ src, club }: { src: string; club: string }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
        {club.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={club}
      className="w-7 h-7 object-contain shrink-0"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

function RankChange({ change, ratingScore }: { change: 'up' | 'down' | 'same'; ratingScore: number }) {
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

function ClubRankSkeleton() {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-5 w-6 shrink-0" />
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="hidden sm:block shrink-0">
          <Skeleton className="h-3 w-20" />
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

function formatLastUpdated(): string {
  try {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function WomenClubRankings() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const { data: rankings, isLoading, isError, refetch, isFetching } = useWomenClubRankings();

  const isFiltered = search.trim().length > 0 || leagueFilter !== 'all';

  const filtered = useMemo(() => {
    if (!rankings) return [];
    const q = search.toLowerCase().trim();
    return rankings.filter((r) => {
      if (leagueFilter !== 'all' && r.league !== leagueFilter) return false;
      if (q && !r.club.toLowerCase().includes(q) && !r.country.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rankings, search, leagueFilter]);

  const visible = useMemo(() => {
    if (isFiltered || showAll) return filtered;
    return filtered.slice(0, 10);
  }, [filtered, isFiltered, showAll]);

  const hiddenCount = useMemo(() => {
    if (isFiltered || showAll) return 0;
    return Math.max(0, filtered.length - 10);
  }, [filtered, isFiltered, showAll]);

  const maxScore = useMemo(() => {
    if (!rankings || rankings.length === 0) return 50;
    return rankings[0]?.ratingScore ?? 50;
  }, [rankings]);

  const leagueCounts = useMemo(() => {
    if (!rankings) return new Map<string, number>();
    const counts = new Map<string, number>();
    for (const r of rankings) {
      counts.set(r.league, (counts.get(r.league) ?? 0) + 1);
    }
    return counts;
  }, [rankings]);

  const formattedDate = useMemo(() => formatLastUpdated(), []);
  const searchPlaceholder = t('Search clubs or country...', 'ক্লাব বা দেশ অনুসন্ধান...');

  return (
    <Section
      title={t("Women's Club Power Rankings", 'মহিলা ক্লাব পাওয়ার র‌্যাঙ্কিং')}
      subtitle={t('Top women\'s football clubs based on current performance', 'বর্তমান পারফরম্যান্সের ভিত্তিতে শীর্ষ মহিলা ফুটবল ক্লাব')}
      gradient="football"
    >
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

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setLeagueFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              leagueFilter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t('All', 'সব')}
          </button>
          {Array.from(leagueCounts.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([league, count]) => (
            <button
              key={league}
              onClick={() => setLeagueFilter(league)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                leagueFilter === league
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {league} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {rankings && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{rankings.length}</span>
          )}{' '}
          {t('clubs ranked across', 'টি ক্লাব')}{' '}
          <span className="font-semibold">{leagueCounts.size}</span>{' '}
          {t('leagues', 'লীগ থেকে')}
          {' · '}
          {t('Last updated', 'সর্বশেষ আপডেট')}: {formattedDate}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {t('Refresh', 'রিফ্রেশ')}
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ClubRankSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t('Failed to load club rankings', 'ক্লাব র্যাঙ্কিং লোড করতে ব্যর্থ')}
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

      {!isLoading && !isError && visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <FiSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search
              ? t(`No clubs matching "${search}"`, `"${search}" এর সাথে মিলে এমন কোনো ক্লাব নেই`)
              : t("No women's football data is currently available.", 'মহিলা ফুটবল ডেটা বর্তমানে উপলভ্য নয়।')}
          </p>
        </motion.div>
      )}

      {!isLoading && !isError && visible.length > 0 && (
        <AnimatePresence mode="popLayout">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left py-2.5 pr-2 w-10">#</th>
                  <th className="text-left py-2.5 pr-3 w-10">{t('Club', 'ক্লাব')}</th>
                  <th className="text-left py-2.5 pr-4">{t('Club Name', 'ক্লাবের নাম')}</th>
                  <th className="text-left py-2.5 pr-4 w-24">{t('League', 'লীগ')}</th>
                  <th className="text-right py-2.5 pr-4 w-20">{t('Rating', 'রেটিং')}</th>
                  <th className="text-right py-2.5 pr-4 w-20">{t('Prev', 'পূর্ববর্তী')}</th>
                  <th className="text-right py-2.5 pr-4 w-20">{t('Move', 'অবস্থান')}</th>
                  <th className="py-2.5 w-32">{t('Form', 'ফর্ম')}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {visible.map((entry, i) => {
                    const barWidth = Math.max(2, (entry.ratingScore / maxScore) * 100);
                    const isTop3 = entry.rank <= 3;
                    return (
                      <motion.tr
                        key={entry.club || entry.leagueCode || `club-${i}`}
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
                          <ClubLogo src={entry.clubLogo} club={entry.club} />
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                              {entry.club}
                            </span>
                            <Flag code={entry.countryFlag} />
                          </div>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {entry.league}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-gray-900 dark:text-white tabular-nums">
                          {entry.ratingScore}
                        </td>
                        <td className="py-2.5 pr-4 text-right text-gray-500 dark:text-gray-400 tabular-nums">
                          {entry.previousRank}
                        </td>
                        <td className="py-2.5 pr-4 text-right">
                          <RankChange change={entry.rankChange} ratingScore={entry.ratingScore} />
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

          <div className="sm:hidden space-y-2.5">
            <AnimatePresence>
              {visible.map((entry, i) => {
                const barWidth = Math.max(2, (entry.ratingScore / maxScore) * 100);
                const isTop3 = entry.rank <= 3;
                return (
                  <motion.div
                    key={entry.club || entry.leagueCode || `club-${i}`}
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

                      <ClubLogo src={entry.clubLogo} club={entry.club} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {entry.club}
                          </p>
                          <Flag code={entry.countryFlag} />
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {entry.league}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                          {entry.ratingScore}
                        </p>
                        <RankChange change={entry.rankChange} ratingScore={entry.ratingScore} />
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
