import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiMonitor, FiClock, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAllMatches } from '@/services/multiSportMatchService';

const tabs = [
  { key: 'all', label: { en: 'All', bn: 'সব' } },
  { key: 'live', label: { en: 'Live', bn: 'লাইভ' } },
  { key: 'upcoming', label: { en: 'Upcoming', bn: 'আসন্ন' } },
  { key: 'finished', label: { en: 'Finished', bn: 'শেষ' } },
];

const sportColors: Record<string, string> = {
  basketball: 'from-orange-500 to-red-500',
  tennis: 'from-green-400 to-lime-500',
  formula1: 'from-red-500 to-rose-500',
  hockey: 'from-purple-500 to-violet-500',
  volleyball: 'from-yellow-500 to-amber-500',
  boxing: 'from-red-600 to-orange-600',
  golf: 'from-emerald-400 to-teal-500',
  athletics: 'from-blue-400 to-cyan-500',
  baseball: 'from-red-500 to-blue-500',
  swimming: 'from-cyan-400 to-blue-500',
  mma: 'from-gray-700 to-red-700',
  rugby: 'from-green-600 to-lime-500',
  cycling: 'from-yellow-400 to-orange-500',
};

const sportEmojis: Record<string, string> = {
  basketball: '🏀',
  tennis: '🎾',
  formula1: '🏎️',
  hockey: '🏑',
  volleyball: '🏐',
  boxing: '🥊',
  golf: '⛳',
  athletics: '🏃',
  baseball: '⚾',
  swimming: '🏊',
  mma: '🥊',
  rugby: '🏉',
  cycling: '🚴',
};

function formatDateTime(dateStr: string): string {
  if (!dateStr || dateStr === 'TBD') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const sportLabels: Record<string, string> = {
  basketball: 'Basketball', tennis: 'Tennis', formula1: 'Formula 1',
  hockey: 'Hockey', volleyball: 'Volleyball', boxing: 'Boxing',
  golf: 'Golf', athletics: 'Athletics', baseball: 'Baseball',
  swimming: 'Swimming', mma: 'MMA', rugby: 'Rugby', cycling: 'Cycling',
};

export function LiveMatches() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sportParam = searchParams.get('sport');

  const allMatches = getAllMatches();
  const sportFiltered = sportParam ? allMatches.filter((m) => m.sport === sportParam) : allMatches;
  const filtered = activeTab === 'all' ? sportFiltered : sportFiltered.filter((m) => m.status === activeTab);

  useEffect(() => {
    if (sportParam) {
      const el = document.getElementById('home-live-matches');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sportParam]);

  const clearSport = () => {
    setSearchParams({});
    setActiveTab('all');
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <Section title={t("Live & Today's Matches", 'লাইভ ও আজকের ম্যাচ')} subtitle={t('All sports - live scores and updates', 'সব খেলা - লাইভ স্কোর ও আপডেট')}>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {sportParam && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
            {sportLabels[sportParam] || sportParam}
            <button onClick={clearSport} className="ml-1 hover:text-primary/70"><FiX className="w-3 h-3" /></button>
          </div>
        )}
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(tab.label.en, tab.label.bn)}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center w-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('No matches found', 'কোনো ম্যাচ পাওয়া যায়নি')}
              </p>
            </div>
          ) : (
            filtered.map((match, i) => (
              <motion.div
                key={match.id || `match-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="snap-start shrink-0"
              >
                <div className="w-[320px] glass-card p-4 relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${sportColors[match.sport] || 'from-gray-500 to-gray-600'} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'warning' : 'success'}>
                          {match.status === 'live' ? t('LIVE', 'লাইভ') : match.status === 'upcoming' ? t('Upcoming', 'আসন্ন') : t('FT', 'শেষ')}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400">{sportEmojis[match.sport] || ''} {match.sport}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.homeTeam}</span>
                        {match.homeScore != null && (
                          <span className="text-lg font-bold text-primary">{match.homeScore}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.awayTeam}</span>
                        {match.awayScore != null && (
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{match.awayScore}</span>
                        )}
                      </div>
                    </div>
                    {match.league && (
                      <div className="mt-2 text-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{match.league}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                      <FiClock className="w-3 h-3" />
                      <span>{formatDateTime(match.time || match.date)}</span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FiMapPin className="w-3 h-3" /> {match.venue}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FiMonitor className="w-3 h-3" /> {match.broadcast}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -mr-4"
        >
          <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </Section>
  );
}
