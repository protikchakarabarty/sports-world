import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiSunrise, FiSunset, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import type { OnThisDayEntry } from '@/types';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlayerPhoto } from './PlayerPhoto';

const cricketersBornToday: OnThisDayEntry[] = [
  { id: 'cbt1', name: 'Shaun Pollock', sport: 'Cricket', type: 'born', year: '1973', description: 'South African all-rounder, 421 Test wickets', country: 'South Africa' },
  { id: 'cbt2', name: 'André Nel', sport: 'Cricket', type: 'born', year: '1977', description: 'South African fast bowler, 123 Test wickets', country: 'South Africa' },
  { id: 'cbt3', name: 'Sam Hain', sport: 'Cricket', type: 'born', year: '1995', description: 'England batter, prolific in white-ball cricket', country: 'England' },
  { id: 'cbt4', name: 'Dale Richards', sport: 'Cricket', type: 'born', year: '1976', description: 'West Indies opening batter', country: 'West Indies' },
  { id: 'cbt5', name: 'Venkataraman Subramanya', sport: 'Cricket', type: 'born', year: '1936', description: 'Indian batter, played 9 Tests', country: 'India' },
  { id: 'cbt6', name: 'Stan McCabe', sport: 'Cricket', type: 'born', year: '1910', diedYear: '1968', description: 'Australian batting legend, 6 Test centuries', country: 'Australia' },
  { id: 'cbt7', name: 'Anwar Hussain', sport: 'Cricket', type: 'born', year: '1920', diedYear: '2002', description: 'Pakistan\'s first Test cricketer', country: 'Pakistan' },
  { id: 'cbt8', name: 'John Warr', sport: 'Cricket', type: 'born', year: '1927', diedYear: '2016', description: 'England fast bowler, MCC President', country: 'England' },
  { id: 'cbt9', name: 'Phil Carrick', sport: 'Cricket', type: 'born', year: '1952', diedYear: '2000', description: 'England spinner, Yorkshire captain', country: 'England' },
  { id: 'cbt10', name: 'Charles Studd', sport: 'Cricket', type: 'born', year: '1860', diedYear: '1931', description: 'England all-rounder, 5 Tests', country: 'England' },
];

const cricketersDiedToday: OnThisDayEntry[] = [
  { id: 'cdt1', name: 'Charles Studd', sport: 'Cricket', type: 'died', year: '1860', diedYear: '1931', description: 'England all-rounder and missionary', country: 'England' },
  { id: 'cdt2', name: 'Tom Brooks', sport: 'Cricket', type: 'died', year: '1915', diedYear: '2007', description: 'Australian Test umpire, stood in 23 Tests', country: 'Australia' },
];

const womensCricketersBornToday: OnThisDayEntry[] = [
  { id: 'wcbt1', name: 'Sophia Dunkley', sport: 'Cricket', type: 'born', year: '1998', description: 'England Women batter', country: 'England' },
];

const womensCricketersDiedToday: OnThisDayEntry[] = [];

export function CricketOnThisDay({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [showBorn, setShowBorn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bornData = gender === 'women' ? womensCricketersBornToday : cricketersBornToday;
  const diedData = gender === 'women' ? womensCricketersDiedToday : cricketersDiedToday;
  const entries = showBorn ? bornData : diedData;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <Section title={t('On This Day', 'এই দিনে')} subtitle={t('Cricket history from this date', 'ক্রিকেট ইতিহাসের এই দিনে')}>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowBorn(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            showBorn ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <FiSunrise className="w-3.5 h-3.5" />
          {t('Born Today', 'আজ জন্মেছেন')}
        </button>
        <button
          onClick={() => setShowBorn(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !showBorn ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <FiSunset className="w-3.5 h-3.5" />
          {t('Died Today', 'আজ মারা গেছেন')}
        </button>
        <FiCalendar className="w-4 h-4 text-gray-400 ml-auto" />
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('No entries for today.', 'আজকের জন্য কোনো এন্ট্রি নেই।')}
          </p>
        </div>
      ) : (
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
            <AnimatePresence mode="sync">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id ?? entry.name ?? `cricket-otd-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="snap-start shrink-0"
                >
                  <div className="w-[260px] glass-card p-4 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <PlayerPhoto name={entry.name} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{entry.country}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200/30 dark:border-gray-700/30 pt-2 space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {showBorn ? 'Born' : 'Died'}: <span className="font-semibold text-gray-900 dark:text-white">{entry.year}</span>
                        {entry.diedYear && showBorn ? (
                          <span> — Died: <span className="font-semibold text-gray-900 dark:text-white">{entry.diedYear}</span></span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{entry.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -mr-4"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </Section>
  );
}
