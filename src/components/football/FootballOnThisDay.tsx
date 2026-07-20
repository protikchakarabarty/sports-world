import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiSunrise, FiSunset } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnThisDay } from '@/hooks/useFootballData';
import type { FootballOnThisDayPlayer } from '@/services/onThisDayService';

function getTodayDisplay(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function CardSkeleton() {
  return (
    <div className="w-[260px] shrink-0">
      <div className="glass-card overflow-hidden">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, showBorn }: { player: FootballOnThisDayPlayer; showBorn: boolean }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!player.image && !imgError;

  const yearText = player.deathYear
    ? `${player.birthYear ?? '?'} – ${player.deathYear}`
    : player.birthYear
      ? `${player.birthYear} –`
      : '';

  return (
    <div className="w-[260px] shrink-0">
      <div className="glass-card overflow-hidden group">
        {/* Photo */}
        <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {hasImage ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
              showBorn ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}>
              {player.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {player.country && (
            <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
              {player.country}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {player.name}
          </p>
          {yearText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {yearText}
            </p>
          )}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {player.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FootballOnThisDay({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [showBorn, setShowBorn] = useState(true);
  const { data, isLoading, error } = useOnThisDay();
  const todayDisplay = getTodayDisplay();

  const entries = useMemo(() => {
    if (!data) return [];
    return showBorn ? data.births : data.deaths;
  }, [data, showBorn]);

  return (
    <Section title={t('On This Day', 'এই দিনে')} subtitle={todayDisplay}>
      {/* Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowBorn(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            showBorn
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <FiSunrise className="w-3.5 h-3.5" />
          {t('Born Today', 'আজ জন্মেছেন')}
          {data && <span className="ml-1 text-[10px] opacity-70">({data.births.length})</span>}
        </button>
        <button
          onClick={() => setShowBorn(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !showBorn
              ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <FiSunset className="w-3.5 h-3.5" />
          {t('Died Today', 'আজ মারা গেছেন')}
          {data && <span className="ml-1 text-[10px] opacity-70">({data.deaths.length})</span>}
        </button>
        <FiCalendar className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-red-500 dark:text-red-400">
            {t('Failed to load data.', 'ডেটা লোড করতে ব্যর্থ।')}
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && !entries.length && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('No data available for today.', 'আজকের জন্য কোনো তথ্য নেই।')}
          </p>
        </div>
      )}

      {/* Carousel */}
      {!isLoading && !error && entries.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={showBorn ? 'born' : 'died'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MatchCarousel>
              {entries.map((player) => (
                <PlayerCard key={player.id || `otd-player-${i}`} player={player} showBorn={showBorn} />
              ))}
            </MatchCarousel>
          </motion.div>
        </AnimatePresence>
      )}
    </Section>
  );
}
