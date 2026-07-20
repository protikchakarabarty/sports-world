import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiStar, FiUsers } from 'react-icons/fi';
import { useUnifiedRankings } from '@/hooks/useCricketData';
import { CRICKET_TEAM_LOGOS } from '@/services/cricketApi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlayerPhoto } from './PlayerPhoto';

type Format = 'test' | 'odi' | 't20i';
type Category = 'teams' | 'players';

const formats: { key: Format; label: string; icon: string }[] = [
  { key: 'test', label: 'TEST', icon: '🏏' },
  { key: 'odi', label: 'ODI', icon: '🏏' },
  { key: 't20i', label: 'T20I', icon: '⚡' },
];

const categories: { key: Category; label: string; icon: string }[] = [
  { key: 'teams', label: 'Team', icon: '🏏' },
  { key: 'players', label: 'Players', icon: '🏏' },
];

const formatLabels: Record<Format, string> = { test: 'Test', odi: 'ODI', t20i: 'T20I' };

function TeamLogo({ team }: { team: string }) {
  const [failed, setFailed] = useState(false);
  const src = CRICKET_TEAM_LOGOS[team];
  if (!src || failed) {
    return (
      <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
        {team.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={team}
      className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-lg bg-gray-100 dark:bg-gray-800"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const formatThemes: Record<Format, { border: string; glow: string; accent: string; bg: string }> = {
  test: { border: 'border-sky-500/30', glow: 'shadow-sky-500/20', accent: 'from-sky-500 to-cyan-500', bg: 'bg-sky-500/10' },
  odi: { border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20', accent: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10' },
  t20i: { border: 'border-amber-500/30', glow: 'shadow-amber-500/20', accent: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
};

export function ICCRankingsSection({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [format, setFormat] = useState<Format>('test');
  const [category, setCategory] = useState<Category>('teams');
  const { data, isLoading } = useUnifiedRankings(gender);

  const theme = formatThemes[format];

  const teamData = useMemo(() => {
    if (!data?.teams) return [];
    return data.teams.filter((r) => r.format === format).slice(0, 10);
  }, [data?.teams, format]);

  const playerCategoryData = useMemo(() => {
    if (!data?.players) return { batters: [], bowlers: [], 'all-rounders': [] };
    const filtered = data.players.filter((r) => r.format === format);
    return {
      batters: filtered.filter((r) => r.category === 'batters').slice(0, 10),
      bowlers: filtered.filter((r) => r.category === 'bowlers').slice(0, 10),
      'all-rounders': filtered.filter((r) => r.category === 'all-rounders').slice(0, 10),
    };
  }, [data?.players, format]);

  const hasTeamData = teamData.length > 0;
  const hasPlayerData = playerCategoryData.batters.length > 0 || playerCategoryData.bowlers.length > 0 || playerCategoryData['all-rounders'].length > 0;
  const hasData = category === 'teams' ? hasTeamData : hasPlayerData;

  if (isLoading) {
    return (
      <Section title={t('ICC Rankings', 'আইসিসি র্যাঙ্কিং')} subtitle={t('Official ICC rankings across all formats', 'সব ফরম্যাটে অফিসিয়াল আইসিসি র্যাঙ্কিং')}>
        <div className="flex items-center gap-2 mb-6 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-2xl w-fit mx-auto">
          {formats.map((f) => (
            <div key={f.key} className="px-5 py-2.5 rounded-xl text-sm font-bold tracking-wider text-gray-400">
              {f.label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col} className="space-y-3">
              <div className="skeleton h-5 w-24 rounded mb-3" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-card p-3 flex items-center gap-3">
                  <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3 w-1/3 rounded" />
                  </div>
                  <div className="skeleton h-6 w-12 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t('ICC Rankings', 'আইসিসি র্যাঙ্কিং')}
      subtitle={t('Official ICC rankings across all formats', 'সব ফরম্যাটে অফিসিয়াল আইসিসি র্যাঙ্কিং')}
    >
      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('Rankings data will be added in a future update.', 'ভবিষ্যত আপডেটে র্যাঙ্কিং ডেটা যুক্ত করা হবে।')}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-2xl w-fit">
              {formats.map((f) => (
                <motion.button
                  key={f.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormat(f.key)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all flex items-center gap-2 ${
                    format === f.key
                      ? 'text-white shadow-lg'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {format === f.key && (
                    <motion.div
                      layoutId="icc-format-bg"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${theme.accent} shadow-lg ${theme.glow}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{f.icon}</span>
                  <span className="relative z-10">{f.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-2xl w-fit">
              {categories.map((cat) => (
                <motion.button
                  key={cat.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory(cat.key)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                    category === cat.key
                      ? 'text-white shadow-lg'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {category === cat.key && (
                    <motion.div
                      layoutId="icc-category-bg"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${theme.accent} shadow-lg ${theme.glow}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${format}-${category}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {category === 'teams' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${theme.accent} text-white`}>
                      Top 10 {formatLabels[format]} Teams
                    </span>
                    <p className="text-xs text-gray-400">ICC Rating Points</p>
                  </div>
                  <div className="space-y-2.5">
                    {teamData.map((entry, i) => {
                      const teamKey = `team-${entry.rank}-${entry.team.replace(/\s+/g, '')}`;
                      return (
                      <motion.div
                        key={teamKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className={`glass-card p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border ${theme.border} transition-all group`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base font-extrabold ${
                          i === 0
                            ? `bg-gradient-to-br ${theme.accent} text-white shadow-lg ${theme.glow}`
                            : i < 3
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {i === 0 ? <FiStar className="w-4 h-4 md:w-5 md:h-5" /> : `#${entry.rank}`}
                        </div>

                        <TeamLogo team={entry.team} />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate">{entry.team}</h4>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <div className={`text-lg md:text-xl font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>
                            {entry.rating}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-400">PTS</div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['batters', 'bowlers', 'all-rounders'] as const).map((cat) => {
                    const label = cat === 'batters' ? 'Batters' : cat === 'bowlers' ? 'Bowlers' : 'All-Rounders';
                    const entries = playerCategoryData[cat];
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-3">
                          <FiUsers className={`w-4 h-4 ${cat === 'batters' ? 'text-blue-500' : cat === 'bowlers' ? 'text-red-500' : 'text-emerald-500'}`} />
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t(label, label)}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-auto">Top 10</span>
                        </div>
                        <div className="space-y-2">
                          {entries.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center">
                              {t('No data', 'কোন তথ্য নেই')}
                            </p>
                          ) : (
                            entries.map((entry, i) => {
                              const iccKey = `${cat}-${entry.rank ?? i}`;
                              return (
                              <motion.div
                                key={iccKey}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                className={`glass-card p-3 flex items-center gap-3 hover:border ${theme.border} transition-all group`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                                  i === 0
                                    ? `bg-gradient-to-br ${theme.accent} text-white shadow-lg ${theme.glow}`
                                    : i < 3
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                    : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                  {i === 0 ? <FiStar className="w-4 h-4" /> : `#${entry.rank}`}
                                </div>

                                <PlayerPhoto name={entry.player} />

                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{entry.player}</h4>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-gray-400">{entry.country}</span>
                                  </div>
                                </div>

                                <div className="flex-shrink-0 text-right">
                                  <div className={`text-lg font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>
                                    {entry.rating}
                                  </div>
                                  <div className="text-[10px] uppercase tracking-wider text-gray-400">PTS</div>
                                </div>
                              </motion.div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <FiAward className="w-3.5 h-3.5" />
            <span>
              {t('Official ICC Rankings', 'অফিসিয়াল আইসিসি র্যাঙ্কিং')}
            </span>
          </div>
        </>
      )}
    </Section>
  );
}
