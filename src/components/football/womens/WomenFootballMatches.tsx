import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWomenFootballFixtures } from '@/hooks/useWomenFootballData';
import { MatchSkeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '../MatchCarousel';
import { FinishedMatchCard } from '../FinishedMatchCard';
import { UpcomingMatchCard } from '../UpcomingMatchCard';

const tabs = [
  { key: 'all', label: { en: 'All Matches', bn: 'সব ম্যাচ' } },
  { key: 'live', label: { en: 'Live Scores', bn: 'লাইভ স্কোর' } },
  { key: 'upcoming', label: { en: 'Fixtures', bn: 'ফিক্সচার' } },
  { key: 'finished', label: { en: 'Completed', bn: 'শেষ' } },
];

interface MatchItem {
  id: string;
  status: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  homeDisplayScore: number;
  awayDisplayScore: number;
  homeScore?: string;
  awayScore?: string;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  hasPenalties?: boolean;
  time?: string;
  date: string;
  venue?: string;
  stage: string;
  elapsed?: number;
  goals?: { minute: number; extraMinute?: number; player: string; team: 'home' | 'away'; type: string }[];
}

function MatchCard({ match, t }: { match: MatchItem; t: (en: string, bn: string) => string }) {
  if (match.status === 'finished') {
    return (
      <FinishedMatchCard
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeCrest={match.homeCrest}
        awayCrest={match.awayCrest}
        homeDisplayScore={match.homeDisplayScore}
        awayDisplayScore={match.awayDisplayScore}
        homePenaltyScore={match.homePenaltyScore}
        awayPenaltyScore={match.awayPenaltyScore}
        hasPenalties={match.hasPenalties}
        date={match.date}
        time={match.time ?? ''}
        stage={match.stage}
        goals={match.goals}
      />
    );
  }

  if (match.status === 'upcoming') {
    return (
      <UpcomingMatchCard
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeCrest={match.homeCrest}
        awayCrest={match.awayCrest}
        date={match.date}
        time={match.time ?? ''}
        league={match.league}
        stage={match.stage}
        venue={match.venue ?? ''}
      />
    );
  }

  const homeGoals = match.goals?.filter(g => g.team === 'home') ?? [];
  const awayGoals = match.goals?.filter(g => g.team === 'away') ?? [];
  const elapsedText = match.elapsed != null
    ? `${match.elapsed}'`
    : match.time || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card match-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Badge variant="live">
            {t('LIVE', 'লাইভ')}
          </Badge>
          {match.elapsed != null && (
            <span className="text-xs font-bold text-red-500 tabular-nums">
              {elapsedText}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{match.league}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.homeTeam}</span>
            {homeGoals.length > 0 && (
              <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                {homeGoals.map((g, gi) => (
                  <span key={gi} className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">
                    ⚽ {g.player} {g.minute}'
                  </span>
                ))}
              </div>
            )}
          </div>
          {match.homeScore != null && (
            <span className="text-lg font-bold text-emerald-500 shrink-0 ml-2">
              {match.homeScore}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.awayTeam}</span>
            {awayGoals.length > 0 && (
              <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                {awayGoals.map((g, gi) => (
                  <span key={gi} className="text-[10px] text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                    ⚽ {g.player} {g.minute}'
                  </span>
                ))}
              </div>
            )}
          </div>
          {match.awayScore != null && (
            <span className="text-lg font-bold text-gray-600 dark:text-gray-300 shrink-0 ml-2">
              {match.awayScore}
            </span>
          )}
        </div>
      </div>
      {match.venue && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <FiMapPin className="w-3 h-3" /> {match.venue}
        </div>
      )}
    </motion.div>
  );
}

export function WomenFootballMatches() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const { data: fixtures, isLoading, isError, error } = useWomenFootballFixtures();
  const filtered = !fixtures ? [] : activeTab === 'all' ? fixtures : fixtures.filter((m) => m.status === activeTab);

  if (isLoading) {
    return (
      <Section title={t("Women's Football Matches", 'মহিলা ফুটবল ম্যাচ')} subtitle={t("Women's live scores, fixtures and results", 'মহিলাদের লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MatchSkeleton key={i} />
          ))}
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section title={t("Women's Football Matches", 'মহিলা ফুটবল ম্যাচ')} subtitle={t("Women's live scores, fixtures and results", 'মহিলাদের লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiAlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t('Failed to load matches', 'ম্যাচ লোড করা যায়নি')}
          </p>
          <p className="text-xs text-gray-400 max-w-md">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Section>
    );
  }

  const finishedFiltered = filtered.filter((m) => m.status === 'finished');
  const upcomingFiltered = filtered.filter((m) => m.status === 'upcoming');
  const liveFiltered = filtered.filter((m) => m.status === 'live');
  const showFinishedCarousel = (activeTab === 'all' || activeTab === 'finished') && finishedFiltered.length > 0;
  const showUpcomingCarousel = (activeTab === 'all' || activeTab === 'upcoming') && upcomingFiltered.length > 0;

  return (
    <Section title={t("Women's Football Matches", 'মহিলা ফুটবল ম্যাচ')} subtitle={t("Women's live scores, fixtures and results", 'মহিলাদের লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(tab.label.en, tab.label.bn)}
          </motion.button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('No matches found for this period', 'এই সময়ের জন্য কোনো ম্যাচ পাওয়া যায়নি')}
          </p>
        </div>
      ) : (
        <>
          {showUpcomingCarousel && (
            <div className={showFinishedCarousel ? 'mb-6' : ''}>
              <MatchCarousel>
                {upcomingFiltered.map((match, i) => (
                  <MatchCard key={match.id || `upc-${i}`} match={match} t={t} />
                ))}
              </MatchCarousel>
            </div>
          )}
          {showFinishedCarousel && (
            <div className="mb-6">
              <MatchCarousel>
                {finishedFiltered.map((match, i) => (
                  <MatchCard key={match.id || `fin-${i}`} match={match} t={t} />
                ))}
              </MatchCarousel>
            </div>
          )}
          {activeTab !== 'finished' && activeTab !== 'upcoming' && liveFiltered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {liveFiltered.map((match, i) => (
                  <MatchCard key={match.id || `live-${i}`} match={match} t={t} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
