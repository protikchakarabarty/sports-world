import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { useCricketMatches } from '@/hooks/useCricketData';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { CricketMatchCard } from './CricketMatchCard';

interface CricketMatchItem {
  id: string;
  status: 'live' | 'upcoming' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  time: string;
  date: string;
  venue: string;
  broadcast: string;
  league?: string;
}

const tabs = [
  { key: 'all', label: { en: 'All Matches', bn: 'সব ম্যাচ' } },
  { key: 'live', label: { en: 'Live Scores', bn: 'লাইভ স্কোর' } },
  { key: 'upcoming', label: { en: 'Upcoming', bn: 'আপকামিং' } },
  { key: 'finished', label: { en: 'Completed', bn: 'শেষ' } },
];

export function CricketMatches({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const { data: matches, isLoading, isError, error } = useCricketMatches(gender);

  const NATIONAL_TEAMS = new Set([
    'india', 'england', 'australia', 'south africa', 'new zealand', 'west indies',
    'pakistan', 'sri lanka', 'bangladesh', 'zimbabwe', 'afghanistan', 'ireland',
    'netherlands', 'scotland', 'namibia', 'oman', 'nepal', 'uae', 'usa',
  ]);

  function isInternational(m: CricketMatchItem): boolean {
    const home = m.homeTeam.toLowerCase().trim();
    const away = m.awayTeam.toLowerCase().trim();
    const matchNat = (name: string) => [...NATIONAL_TEAMS].some((t) => name === t || name.startsWith(t + ' ') || name.endsWith(' ' + t));
    return matchNat(home) && matchNat(away);
  }

  const allMatches: CricketMatchItem[] = (matches ?? []).slice().sort((a, b) => {
    const aIntl = isInternational(a) ? 0 : 1;
    const bIntl = isInternational(b) ? 0 : 1;
    return aIntl - bIntl;
  });
  const filtered = activeTab === 'all' ? allMatches : allMatches.filter((m) => m.status === activeTab);

  if (isLoading) {
    return (
      <Section title={t('Cricket Matches', 'ক্রিকেট ম্যাচ')} subtitle={t('Live scores, fixtures and results', 'লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section title={t('Cricket Matches', 'ক্রিকেট ম্যাচ')} subtitle={t('Live scores, fixtures and results', 'লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
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

  const finishedMatches = allMatches.filter((m) => m.status === 'finished');
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming');
  const liveMatches = allMatches.filter((m) => m.status === 'live');
  const showFinishedCarousel = (activeTab === 'all' || activeTab === 'finished') && finishedMatches.length > 0;
  const showUpcomingCarousel = (activeTab === 'all' || activeTab === 'upcoming') && upcomingMatches.length > 0;

  return (
    <Section title={t('Cricket Matches', 'ক্রিকেট ম্যাচ')} subtitle={t('Live scores, fixtures and results', 'লাইভ স্কোর, ফিক্সচার ও ফলাফল')}>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(tab.label.en, tab.label.bn)}
          </motion.button>
        ))}
      </div>

      {allMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('No cricket matches available right now.', 'এই মুহূর্তে কোনো ক্রিকেট ম্যাচ উপলব্ধ নেই।')}
          </p>
        </div>
      ) : (
        <>
          {showUpcomingCarousel && (
            <div className={showFinishedCarousel ? 'mb-6' : ''}>
              <MatchCarousel>
                {upcomingMatches.map((match, i) => {
                  const upcKey = (match.id || `${(match.homeTeam || 'h')}-${(match.awayTeam || 'a')}-${(match.date || match.time || i)}`) || `upc-${i}`;
                  console.assert(upcKey !== "", "Empty React key detected in CricketMatches upcoming");
                  return <CricketMatchCard key={upcKey} match={match} />;
                })}
              </MatchCarousel>
            </div>
          )}

          {showFinishedCarousel && (
            <div className="mb-6">
              <MatchCarousel>
                {finishedMatches.map((match, i) => {
                  const finKey = (match.id || `${(match.homeTeam || 'h')}-${(match.awayTeam || 'a')}-${(match.date || match.time || i)}`) || `fin-${i}`;
                  console.assert(finKey !== "", "Empty React key detected in CricketMatches finished");
                  return <CricketMatchCard key={finKey} match={match} />;
                })}
              </MatchCarousel>
            </div>
          )}

          {activeTab !== 'finished' && activeTab !== 'upcoming' && liveMatches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {liveMatches.map((match, i) => {
                  const liveKey = (match.id || `${(match.homeTeam || 'h')}-${(match.awayTeam || 'a')}-${(match.date || match.time || i)}`) || `live-${i}`;
                  console.assert(liveKey !== "", "Empty React key detected in CricketMatches live");
                  return <CricketMatchCard key={liveKey} match={match} />;
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      <div className="mt-4 text-center">
        <a
          href="https://sportscore.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 11.5l-1.5 1.5L8 11l-2 2-1.5-1.5L5 9 3 7.5 4.5 6 8 9.5 11.5 6 13 7.5 11 9l1.5 2.5z"/>
          </svg>
          Powered by SportScore
        </a>
      </div>
    </Section>
  );
}
