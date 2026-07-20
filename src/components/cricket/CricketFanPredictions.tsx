import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiClock, FiLock, FiUsers } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketMatches } from '@/hooks/useCricketData';
import { useFanPrediction } from '@/hooks/useFanPrediction';
import { derivePollQuestion, slug } from '@/utils/pollId';
import { getBarColor } from '@/utils/teamColors';

function formatDateTime(dateStr: string): string {
  if (!dateStr || dateStr === 'TBD') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function FanPredictionCard({ match }: { match: { id: string; homeTeam: string; awayTeam: string; time: string; date: string; league?: string } }) {
  const { t } = useLanguage();
  const compPrefix = match.league ? slug(match.league) : 'cricket';
  const pollId = `${compPrefix}-${slug(match.homeTeam)}-${slug(match.awayTeam)}`;
  const question = derivePollQuestion(match.homeTeam, match.awayTeam);
  const options = [match.homeTeam, match.awayTeam, 'Draw'] as const;
  const closed = false;

  const fan = useFanPrediction(pollId, options, closed);
  const homeBar = getBarColor(match.homeTeam);
  const awayBar = getBarColor(match.awayTeam);
  const neutralBar = { base: '#6B7280', gradient: 'linear-gradient(to right, #6B7280, #9CA3AF)', glow: 'none' };

  function barForOption(option: string) {
    if (option === match.homeTeam) return homeBar;
    if (option === match.awayTeam) return awayBar;
    return neutralBar;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <FiBarChart2 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{match.homeTeam} vs {match.awayTeam}</h3>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <FiClock className="w-3 h-3" />
        <span>{formatDateTime(match.time || match.date)}</span>
      </div>

      {/* Fan Poll */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{question}</p>
        {fan.isError ? (
          <p className="text-xs text-gray-400">{fan.error ?? t('Failed to load poll', 'পোল লোড করা যায়নি')}</p>
        ) : (
          <div className="space-y-1.5">
            {fan.optionPercentages.filter((opt) => opt.option !== 'Draw').map((opt, i) => {
              const isUserVote = fan.userVote === opt.option;
              const canVote = !fan.hasVoted && !fan.closed && !fan.isVoting;
              const colors = barForOption(opt.option);
              const pollOptionKey = `${pollId}-${(opt.option || '').trim()}-${i}`;
              return (
                <motion.button
                  key={pollOptionKey}
                  whileHover={{ scale: canVote ? 1.01 : 1 }}
                  whileTap={{ scale: canVote ? 0.99 : 1 }}
                  onClick={() => { if (canVote) fan.vote(opt.option); }}
                  disabled={!canVote}
                  className={`w-full p-2.5 rounded-xl text-left relative overflow-hidden transition-all ${
                    isUserVote ? 'border' : 'border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  } ${canVote ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{
                    ...(isUserVote ? {
                      borderColor: `${colors.base}60`,
                      background: `linear-gradient(to right, ${colors.base}20, ${colors.base}15)`,
                    } : {
                      backgroundColor: 'rgba(249,250,251,var(--tw-bg-opacity))',
                    }),
                  }}
                >
                  {(fan.hasVoted || fan.totalVotes > 0) && (
                    <div
                      className="absolute inset-0 transition-all"
                      style={{ width: `${opt.percentage}%`, background: colors.gradient, opacity: 0.12 }}
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {opt.option}
                      {isUserVote && <span className="ml-1.5 text-xs" style={{ color: colors.base }}>({t('Your Vote', 'আপনার ভোট')})</span>}
                    </span>
                    {(fan.hasVoted || fan.totalVotes > 0) && (
                      <span className="text-sm font-bold" style={{ color: colors.base }}>{opt.percentage.toFixed(1)}%</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {fan.voteError && <p className="text-xs text-red-500 mt-1.5">{fan.voteError}</p>}

        {fan.closed && (
          <div className="flex items-center gap-1.5 mt-2">
            <FiLock className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-400">{t('Voting Closed', 'ভোট বন্ধ')}</p>
          </div>
        )}

        {fan.emptyVote ? (
          <p className="text-xs text-gray-400 mt-2">{t('Be the first fan to vote.', 'প্রথম ভোটার হোন।')}</p>
        ) : fan.totalVotes > 0 ? (
          <p className="text-xs text-gray-400 mt-2">{fan.totalVotes.toLocaleString()} {t('votes', 'ভোট')}</p>
        ) : null}
      </div>
    </motion.div>
  );
}

export function CricketFanPredictions({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: matches, isLoading: crLoading } = useCricketMatches(gender);

  const upcomingIn24h = useMemo(() => {
    const now = new Date();
    const ms24h = 24 * 60 * 60 * 1000;
    return (matches || []).filter((m) => {
      if (m.status !== 'upcoming') return false;
      const matchTime = new Date(m.time || m.date);
      if (isNaN(matchTime.getTime())) return false;
      const diff = matchTime.getTime() - now.getTime();
      return diff > -7200000 && diff <= ms24h;
    });
  }, [matches]);

  if (crLoading) {
    return (
      <Section title={t('Match Predictions by Fan', 'ভক্তদের ম্যাচ পূর্বাভাস')} className="mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              {Array.from({ length: 2 }).map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (upcomingIn24h.length === 0) {
    return (
      <Section title={t('Match Predictions by Fan', 'ভক্তদের ম্যাচ পূর্বাভাস')} className="mb-0">
        <div className="glass-card p-4 text-center py-6">
          <p className="text-xs text-gray-400">{t('No matches scheduled in the next 24 hours', 'পরবর্তী ২৪ ঘন্টায় কোনো ম্যাচ নির্ধারিত নয়')}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Match Predictions by Fan', 'ভক্তদের ম্যাচ পূর্বাভাস')} subtitle={t('Cast your vote for upcoming matches', 'আসন্ন ম্যাচের জন্য আপনার ভোট দিন')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingIn24h.map((match) => (
          <FanPredictionCard key={match.id} match={match} />
        ))}
      </div>
    </Section>
  );
}
