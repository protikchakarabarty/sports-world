import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenStandings } from '@/hooks/useWomenFootballData';

const LEAGUES = [
  { code: 'WSL', name: 'WSL', country: 'England' },
  { code: 'NWSL', name: 'NWSL', country: 'USA' },
  { code: 'LIGAF', name: 'Liga F', country: 'Spain' },
  { code: 'FBL', name: 'Frauen Bundesliga', country: 'Germany' },
  { code: 'SAF', name: 'Serie A Femminile', country: 'Italy' },
  { code: 'D1F', name: 'D1 Féminine', country: 'France' },
];

function FormBadge({ result }: { result: string }) {
  const colorMap: Record<string, string> = {
    W: 'bg-green-500',
    D: 'bg-yellow-500',
    L: 'bg-red-500',
  };
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colorMap[result] ?? 'bg-gray-400'}`} />
  );
}

function FormIndicator({ form }: { form?: string }) {
  if (!form) return null;
  const results = form.split(',').filter(Boolean).slice(0, 5);
  return (
    <div className="flex items-center gap-1">
      {results.map((r, i) => (
        <FormBadge key={`${r}-${i}`} result={r.trim().toUpperCase()} />
      ))}
    </div>
  );
}

function StandingsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="glass-card p-3 sm:p-4 flex items-center gap-3">
          <Skeleton className="h-5 w-6 shrink-0" />
          <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-36 flex-1" />
          <div className="hidden sm:flex items-center gap-3">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-4 w-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function WomenStandings() {
  const { t } = useLanguage();
  const [selectedLeague, setSelectedLeague] = useState('WSL');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { data: standings, isLoading, isError, refetch, isFetching } = useWomenStandings(selectedLeague);

  const league = LEAGUES.find((l) => l.code === selectedLeague);

  const filtered = (standings ?? []).filter(
    (s) => !search || s.team.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = showAll ? filtered : filtered.slice(0, 10);
  const hiddenCount = Math.max(0, filtered.length - 10);

  return (
    <Section
      title={`${league?.name ?? ''} ${t('Standings', 'স্ট্যান্ডিং')}`}
      subtitle={t('League table with positions, form, and statistics', 'পজিশন, ফর্ম এবং পরিসংখ্যান সহ লীগ টেবিল')}
      gradient="football"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search team...', 'দল খুঁজুন...')}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-shadow"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEAGUES.map((l) => (
            <motion.button
              key={l.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedLeague(l.code); setShowAll(false); setSearch(''); }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedLeague === l.code
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {l.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{filtered.length}</span>
          {' '}{t('teams', 'দল')}
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

      {isLoading ? (
        <StandingsSkeleton />
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <FiAlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t('Failed to load standings', 'স্ট্যান্ডিং লোড করা যায়নি')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {t('Please try again', 'আবার চেষ্টা করুন')}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            {t('Retry', 'পুনরায় চেষ্টা')}
          </button>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <FiSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search
              ? t(`No teams matching "${search}"`, `"${search}" এর সাথে মিলে যায় এমন কোন দল নেই`)
              : t("No women's football data is currently available.", 'বর্তমানে কোনো মহিলা ফুটবল ডেটা উপলব্ধ নেই।')}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-2.5 pr-2 text-left">#</th>
                  <th className="py-2.5 pr-3 text-left">{t('Team', 'দল')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('P', 'ম্যাচ')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('W', 'জ')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('D', 'ড')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('L', 'হ')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('GD', 'গোল পার্থক্য')}</th>
                  <th className="py-2.5 pr-3 text-center">{t('Pts', 'পয়েন্ট')}</th>
                  <th className="py-2.5 text-center">{t('Form', 'ফর্ম')}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {displayed.map((entry, i) => {
                    const isCL = entry.position <= 4;
                    const isEL = entry.position === 5 || entry.position === 6;
                    const isRel = filtered.length >= 18 && entry.position > filtered.length - 3;
                    return (
                      <motion.tr
                        key={entry.team}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.015 }}
                        className={`border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                          isCL ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                        } ${isEL ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''} ${isRel ? 'bg-red-50/40 dark:bg-red-900/10' : ''}`}
                      >
                        <td className="py-2.5 pr-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                          {entry.position <= 3 ? ['🥇', '🥈', '🥉'][entry.position - 1] : entry.position}
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            {entry.teamCrest ? (
                              <img src={entry.teamCrest} alt="" className="w-5 h-5 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                {entry.team.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                              {entry.team}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-center font-semibold text-gray-900 dark:text-white tabular-nums">{entry.played}</td>
                        <td className="py-2.5 pr-3 text-center text-green-600 dark:text-green-400 font-semibold tabular-nums">{entry.won}</td>
                        <td className="py-2.5 pr-3 text-center text-amber-600 dark:text-amber-400 font-semibold tabular-nums">{entry.drawn}</td>
                        <td className="py-2.5 pr-3 text-center text-red-600 dark:text-red-400 font-semibold tabular-nums">{entry.lost}</td>
                        <td className="py-2.5 pr-3 text-center font-semibold tabular-nums">
                          <span className={entry.goalDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-center font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-base">{entry.points}</td>
                        <td className="py-2.5 text-center">
                          <FormIndicator form={entry.form} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2.5">
            <AnimatePresence mode="popLayout">
              {displayed.map((entry, i) => {
                const isCL = entry.position <= 4;
                const isRel = filtered.length >= 18 && entry.position > filtered.length - 3;
                return (
                  <motion.div
                    key={entry.team}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.015 }}
                    className={`glass-card p-3 ${isCL ? 'ring-1 ring-blue-400/30' : ''} ${isRel ? 'ring-1 ring-red-400/30' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-500 w-6 shrink-0">
                        {entry.position <= 3 ? ['🥇', '🥈', '🥉'][entry.position - 1] : entry.position}
                      </span>
                      {entry.teamCrest ? (
                        <img src={entry.teamCrest} alt="" className="w-7 h-7 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {entry.team.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{entry.team}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span>{t('P', 'ম্যাচ')} {entry.played}</span>
                          <span className="text-green-600">{t('W', 'জ')} {entry.won}</span>
                          <span className="text-amber-600">{t('D', 'ড')} {entry.drawn}</span>
                          <span className="text-red-600">{t('L', 'হ')} {entry.lost}</span>
                          <span className={entry.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                          </span>
                        </div>
                        <div className="mt-1">
                          <FormIndicator form={entry.form} />
                        </div>
                      </div>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{entry.points}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {!isLoading && !isError && filtered.length > 10 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 ring-1 ring-amber-400/40 hover:ring-amber-400/70 transition-all duration-300 hover:scale-105 active:scale-[0.98]"
              >
                <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  ▼
                </motion.span>
                {showAll
                  ? t('Show Less', 'সংকুচিত করুন')
                  : `${t('View More', 'আরো দেখুন')} (${hiddenCount})`}
              </button>
            </motion.div>
          )}
        </>
      )}
    </Section>
  );
}
