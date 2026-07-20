import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCpu, FiBarChart2, FiLock, FiCalendar, FiClock, FiTarget, FiAlertTriangle, FiStar } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFootballFixtures } from '@/hooks/useFootballData';
import { useFanPrediction } from '@/hooks/useFanPrediction';
import { derivePollQuestion, slug } from '@/utils/pollId';
import { isKnockoutStage, getPredictionOptions } from '@/utils/knockout';
import { generateAllMatchPredictions } from '@/services/aiPredictionService';
import { getTable } from '@/services/footballApi';
import { detectLeagueCode } from '@/services/providers/sportmonksProvider';
import { getBarColor, getTeamColorStyle } from '@/utils/teamColors';
import type { AiMatchInfo } from '@/services/providers/sportmonksProvider';
import type { AiExtendedPrediction } from '@/types/prediction';

function MatchFanPoll({ match }: { match: { status: string; league: string; stage: string; homeTeam: string; awayTeam: string; utcDate: string; time: string; date: string } }) {
  const { t } = useLanguage();
  const isKnockout = isKnockoutStage(match.stage);
  const compPrefix = slug(match.league);
  const pollId = `${compPrefix}-${slug(match.homeTeam)}-${slug(match.awayTeam)}`;
  const question = derivePollQuestion(match.homeTeam, match.awayTeam);
  const options = getPredictionOptions(match.homeTeam, match.awayTeam, isKnockout);
  const closed = match.status === 'finished';
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
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="default" className="text-[10px]">{match.league}</Badge>
        {match.date && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
            <FiCalendar className="w-3 h-3" />
            {match.date}
          </span>
        )}
        {match.time && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <FiClock className="w-3 h-3" />
            {match.time}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <FiBarChart2 className="w-4 h-4 text-primary shrink-0" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{question}</h3>
        {isKnockout && (
          <Badge variant="warning">{t('Knockout', 'নকআউট')}</Badge>
        )}
      </div>

      {fan.isError ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">{fan.error ?? t('Failed to load poll', 'পোল লোড করা যায়নি')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {fan.optionPercentages.map((opt) => {
              const isUserVote = fan.userVote === opt.option;
              const canVote = !fan.hasVoted && !fan.closed && !fan.isVoting;
              const colors = barForOption(opt.option);
              return (
                <motion.button
                  key={opt.option}
                  whileHover={{ scale: canVote ? 1.01 : 1 }}
                  whileTap={{ scale: canVote ? 0.99 : 1 }}
                  onClick={() => { if (canVote) fan.vote(opt.option); }}
                  disabled={!canVote}
                  className={`w-full p-3 rounded-xl text-left relative overflow-hidden transition-all ${
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
                      className="absolute inset-0 transition-all rounded-xl"
                      style={{
                        width: `${opt.percentage}%`,
                        background: colors.gradient,
                        opacity: 0.12,
                      }}
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {opt.option}
                      {isUserVote && (
                        <span className="ml-1.5 text-xs" style={{ color: colors.base }}>
                          ({t('Your Vote', 'আপনার ভোট')})
                        </span>
                      )}
                    </span>
                    {(fan.hasVoted || fan.totalVotes > 0) && (
                      <span className="text-sm font-bold" style={{ color: colors.base }}>
                        {opt.percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
          {fan.voteError && <p className="text-xs text-red-500 mt-2">{fan.voteError}</p>}
          {fan.closed && (
            <div className="flex items-center gap-1.5 mt-3">
              <FiLock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">{t('Voting Closed', 'ভোট বন্ধ')}</p>
            </div>
          )}
          {fan.emptyVote ? (
            <p className="text-xs text-gray-400 mt-3">{t('Be the first fan to vote.', 'প্রথম ভোটার হোন।')}</p>
          ) : fan.totalVotes > 0 ? (
            <p className="text-xs text-gray-400 mt-3">{fan.totalVotes.toLocaleString()} {t('votes', 'ভোট')}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

function PredictedWinner({ prediction, homeTeam, awayTeam }: { prediction: AiExtendedPrediction; homeTeam: string; awayTeam: string }) {
  const { t } = useLanguage();
  return (
    <div className={`p-3 rounded-xl border ${prediction.confidence === 'High' ? 'bg-emerald-500/10 border-emerald-500/25' : prediction.confidence === 'Medium' ? 'bg-blue-500/10 border-blue-500/25' : 'bg-gray-500/10 border-gray-500/25'}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] text-gray-400">{t('Predicted Winner', 'পূর্বাভাসিত বিজয়ী')}</p>
        <span className={`text-[10px] font-semibold ${prediction.confidence === 'High' ? 'text-emerald-500' : prediction.confidence === 'Medium' ? 'text-blue-500' : 'text-gray-400'}`}>
          {prediction.confidence}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{prediction.predicted}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-emerald-500">{prediction.probability}%</span>
        {prediction.predictedScore && prediction.predictedScore !== '-' && (
          <span className="text-[10px] text-gray-400">{t('Score', 'স্কোর')}: {prediction.predictedScore}</span>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, home, away, homeColor, awayColor, fmt, suffix }: {
  label: string;
  home: number | null;
  away: number | null;
  homeColor: string;
  awayColor: string;
  fmt?: (v: number) => string;
  suffix?: string;
}) {
  const hVal = home != null ? (fmt ? fmt(home) : `${home}${suffix ?? ''}`) : '-';
  const aVal = away != null ? (fmt ? fmt(away) : `${away}${suffix ?? ''}`) : '-';
  return (
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <p className="text-[10px] font-semibold text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium" style={{ color: homeColor }}>{hVal}</span>
        <span className="text-gray-300 dark:text-gray-600">vs</span>
        <span className="font-medium" style={{ color: awayColor }}>{aVal}</span>
      </div>
    </div>
  );
}

function MomentumBars({ homeMomentum, awayMomentum, homeTeam, awayTeam, homeColorStyle, awayColorStyle, homeBar, awayBar }: {
  homeMomentum: number | null;
  awayMomentum: number | null;
  homeTeam: string;
  awayTeam: string;
  homeColorStyle: { color: string; isLight: boolean };
  awayColorStyle: { color: string; isLight: boolean };
  homeBar: { gradient: string; glow: string; base: string };
  awayBar: { gradient: string; glow: string; base: string };
}) {
  if (homeMomentum == null || awayMomentum == null) {
    return (
      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
        <p className="text-[10px] text-gray-400">—</p>
      </div>
    );
  }
  const total = homeMomentum + awayMomentum;
  const homePct = total > 0 ? Math.round((homeMomentum / total) * 100) : 50;
  const awayPct = 100 - homePct;
  return (
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <p className="text-[10px] font-semibold text-gray-500 mb-2">{'Match Momentum'}</p>
      {/* Home half */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-semibold w-1/3 text-right truncate" style={{ color: homeColorStyle.isLight ? '#374151' : homeColorStyle.color }}>
          {homeTeam.split(' ').pop()}
        </span>
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${homePct}%`, background: homeBar.gradient }} />
        </div>
        <span className="text-[11px] font-bold w-[42px] text-left" style={{ color: homeColorStyle.isLight ? '#374151' : homeColorStyle.color }}>
          {homePct}%
        </span>
      </div>
      {/* Away half */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold w-1/3 text-right truncate" style={{ color: awayColorStyle.isLight ? '#374151' : awayColorStyle.color }}>
          {awayTeam.split(' ').pop()}
        </span>
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${awayPct}%`, background: awayBar.gradient }} />
        </div>
        <span className="text-[11px] font-bold w-[42px] text-left" style={{ color: awayColorStyle.isLight ? '#374151' : awayColorStyle.color }}>
          {awayPct}%
        </span>
      </div>
    </div>
  );
}

function ShotsAndCorners({ homeShots, awayShots, homeCorners, awayCorners, homeColor, awayColor }: {
  homeShots: number | null;
  awayShots: number | null;
  homeCorners: number | null;
  awayCorners: number | null;
  homeColor: string;
  awayColor: string;
}) {
  return (
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-1.5">
      <div>
        <p className="text-[10px] font-semibold text-gray-500 mb-0.5">{'Shots'}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: homeColor }}>{homeShots ?? '-'}</span>
          <span className="text-gray-300 dark:text-gray-600">vs</span>
          <span className="font-medium" style={{ color: awayColor }}>{awayShots ?? '-'}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 mb-0.5">{'Corners'}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: homeColor }}>{homeCorners ?? '-'}</span>
          <span className="text-gray-300 dark:text-gray-600">vs</span>
          <span className="font-medium" style={{ color: awayColor }}>{awayCorners ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}

function UpsetAlert({ upsetChance }: { upsetChance: number | null }) {
  if (upsetChance == null) return null;
  return (
    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-center h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <FiAlertTriangle className="w-3 h-3 text-amber-500" />
        <p className="text-[10px] font-semibold text-gray-500">{'Upset Alert'}</p>
      </div>
      <p className="text-sm font-bold text-amber-500">{upsetChance}%</p>
    </div>
  );
}

function StarPlayerCard({ starPlayer, starPlayerReason }: { starPlayer: string | null; starPlayerReason: string | null }) {
  if (!starPlayer) {
    return (
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
        <p className="text-[10px] text-gray-400">{'—'}</p>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-1.5">
        <FiStar className="w-3.5 h-3.5 text-yellow-500" />
        <p className="text-[10px] font-semibold text-gray-500">{'Star Player to Watch'}</p>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{starPlayer}</p>
      {starPlayerReason && (
        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{starPlayerReason}</p>
      )}
    </div>
  );
}

export function FootballPredictions({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: fixtures, isLoading: fbLoading } = useFootballFixtures(gender);

  const next24h = useMemo(() => {
    if (!fixtures) return [];
    const now = new Date();
    const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const matches = fixtures.filter((m) => {
      if (m.status !== 'upcoming') return false;
      const kickoff = new Date(m.utcDate || `${m.date}T${m.time || '00:00'}`);
      return kickoff >= now && kickoff <= cutoff;
    });

    console.log('[FootballPredictions] Debug upcoming matches:');
    console.log(`  Current time (ISO): ${now.toISOString()}`);
    console.log(`  24h cutoff (ISO):   ${cutoff.toISOString()}`);
    console.log(`  Number of matches:  ${matches.length}`);
    if (matches.length > 0) {
      console.table(
        matches.map((m) => ({
          home: m.homeTeam,
          away: m.awayTeam,
          kickoff: m.utcDate,
          competition: m.league,
          status: m.status,
        }))
      );
    }

    return matches;
  }, [fixtures]);

  const { data: predictions, isLoading: predLoading } = useQuery({
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryKey: ['football-next24h-predictions', ...next24h.map((m) => m.id)],
    queryFn: async () => {
      const inputs: AiMatchInfo[] = next24h.map((m) => ({
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeCrest: m.homeCrest ?? '',
        awayCrest: m.awayCrest ?? '',
        competition: m.league,
        date: m.date,
        time: m.time,
        utcDate: m.utcDate,
        isKnockout: isKnockoutStage(m.stage),
      }));

      // Fetch standings for team context
      const uniqueComps = [...new Set(next24h.map((m) => m.league))];
      const teamContexts = new Map<string, string>();
      for (const comp of uniqueComps) {
        const mapped = detectLeagueCode(comp);
        if (!mapped) continue;
        try {
          const standings = await getTable(mapped.code);
          if (!standings || standings.length === 0) continue;
          for (const s of standings) {
            teamContexts.set(s.team, `Position: ${s.position} | Pld: ${s.played} | W: ${s.won} | D: ${s.drawn} | L: ${s.lost} | Pts: ${s.points} | GD: ${s.goalDifference}${s.form ? ` | Form: ${s.form}` : ''}`);
          }
        } catch {}
      }
      console.log(`[FootballPredictions] Team context built for ${teamContexts.size} teams`);

      return generateAllMatchPredictions(inputs, teamContexts);
    },
    enabled: next24h.length > 0 && !fbLoading,
  });

  const hasMatches = next24h.length > 0;
  const isLoading = fbLoading || predLoading;

  return (
    <div className="space-y-6">
      {/* Fan Prediction Polls */}
      <Section title={t('Fan Prediction Poll', 'ভবিষ্যদ্বাণী পোল')} className="mb-0">
        {fbLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : !hasMatches ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
              <FiBarChart2 className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {t('No upcoming matches to vote on.', 'ভোট দেওয়ার জন্য কোনো ম্যাচ নেই।')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
              {t('Check back when new fixtures are available within the next 24 hours.', 'পরবর্তী ২৪ ঘন্টার মধ্যে নতুন ফিক্সচার উপলব্ধ হলে আবার চেক করুন।')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {next24h.map((match, i) => (
              <MatchFanPoll key={match.id || `fp-${i}`} match={match} />
            ))}
          </div>
        )}
      </Section>

      {/* AI Match Predictions */}
      <Section
        title={t('AI Match Predictions', 'এআই ম্যাচ পূর্বাভাস')}
        subtitle={t('Next 24 hours', 'পরবর্তী ২৪ ঘন্টা')}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : !hasMatches ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
              <FiCpu className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {t('No upcoming matches to predict.', 'পূর্বাভাসের জন্য কোনো ম্যাচ নেই।')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
              {t('Check back when new fixtures are available within the next 24 hours.', 'পরবর্তী ২৪ ঘন্টার মধ্যে নতুন ফিক্সচার উপলব্ধ হলে আবার চেক করুন।')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {next24h.map((match, i) => {
              const pred = predictions?.get(match.id);
              const hasPred = !!pred;
              const homeBar = getBarColor(match.homeTeam);
              const awayBar = getBarColor(match.awayTeam);
              const homeColorStyle = getTeamColorStyle(match.homeTeam);
              const awayColorStyle = getTeamColorStyle(match.awayTeam);
              const homeColor = homeColorStyle.color;
              const awayColor = awayColorStyle.color;

              return (
                <div key={match.id || `ai-${i}`} className="space-y-2">
                  {/* Match header */}
                  <div className="flex items-center justify-between px-1">
                    <Badge variant="default" className="text-[10px]">{match.league}</Badge>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      {match.date && (
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {match.date}
                        </span>
                      )}
                      {match.time && (
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {match.time}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Team logos */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    {match.homeCrest ? (
                      <img src={match.homeCrest} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[100px] text-center">
                      {match.homeTeam}
                    </span>
                    <span className="text-xs text-gray-400">vs</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[100px] text-center">
                      {match.awayTeam}
                    </span>
                    {match.awayCrest ? (
                      <img src={match.awayCrest} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>

                  {/* Prediction grid — 3 cols × 2 rows */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Col 1 Row 1: Winning Prediction */}
                    <div className="col-start-1 row-start-1">
                      {hasPred ? (
                        <PredictedWinner prediction={pred} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                      ) : (
                        <div className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/25 text-center h-full flex items-center justify-center">
                          <p className="text-xs text-gray-400">{t('No prediction', 'কোনো পূর্বাভাস নেই')}</p>
                        </div>
                      )}
                    </div>

                    {/* Col 1 Row 2: Key Player to Watch */}
                    <div className="col-start-1 row-start-2">
                      {hasPred ? (
                        <StarPlayerCard starPlayer={pred.starPlayer} starPlayerReason={pred.starPlayerReason} />
                      ) : (
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                          <p className="text-xs text-gray-400">—</p>
                        </div>
                      )}
                    </div>

                    {/* Col 2 Row 1: Match Momentum */}
                    <div className="col-start-2 row-start-1">
                      {hasPred ? (
                        <MomentumBars
                          homeMomentum={pred.homeMomentum}
                          awayMomentum={pred.awayMomentum}
                          homeTeam={match.homeTeam}
                          awayTeam={match.awayTeam}
                          homeColorStyle={homeColorStyle}
                          awayColorStyle={awayColorStyle}
                          homeBar={homeBar}
                          awayBar={awayBar}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                          <p className="text-[10px] text-gray-400">—</p>
                        </div>
                      )}
                    </div>

                    {/* Col 2 Row 2: Clean Sheet + Upset Alert */}
                    <div className="col-start-2 row-start-2 flex flex-col gap-2">
                      {hasPred ? (
                        <>
                          <StatBox label="Clean Sheet" home={pred.homeCleanSheetChance} away={pred.awayCleanSheetChance} homeColor={homeColor} awayColor={awayColor} suffix="%" />
                          <UpsetAlert upsetChance={pred.upsetChance} />
                        </>
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                          <p className="text-[10px] text-gray-400">—</p>
                        </div>
                      )}
                    </div>

                    {/* Col 3 Row 1: xG + Possession */}
                    <div className="col-start-3 row-start-1 flex flex-col gap-2">
                      {hasPred ? (
                        <>
                          <StatBox label="xG" home={pred.homeXg} away={pred.awayXg} homeColor={homeColor} awayColor={awayColor} fmt={(v) => v.toFixed(2)} />
                          <StatBox label="Possession" home={pred.homePossession} away={pred.awayPossession} homeColor={homeColor} awayColor={awayColor} suffix="%" />
                        </>
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                          <p className="text-[10px] text-gray-400">—</p>
                        </div>
                      )}
                    </div>

                    {/* Col 3 Row 2: Shots & Corners */}
                    <div className="col-start-3 row-start-2">
                      {hasPred ? (
                        <ShotsAndCorners
                          homeShots={pred.homeShots}
                          awayShots={pred.awayShots}
                          homeCorners={pred.homeCorners}
                          awayCorners={pred.awayCorners}
                          homeColor={homeColor}
                          awayColor={awayColor}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                          <p className="text-[10px] text-gray-400">—</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
