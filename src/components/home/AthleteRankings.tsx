import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiTrendingUp, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAthleteRankings, getRankingSource } from '@/services/athleteRankingService';
import type { Athlete } from '@/types';

const tabs = [
  { key: 'richest', label: { en: 'Richest Athletes', bn: 'ধনী অ্যাথলেট' }, icon: FiAward },
  { key: 'paid', label: { en: 'Highest Paid', bn: 'সর্বোচ্চ বেতন' }, icon: FiTrendingUp },
  { key: 'famous', label: { en: 'Most Famous', bn: 'সবচেয়ে বিখ্যাত' }, icon: FiStar },
];

function Card({ athlete, statLabel }: { athlete: Athlete; statLabel: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-[260px] shrink-0">
      <div className="glass-card overflow-hidden group">
        <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imgError ? (
            <img
              src={athlete.image}
              alt={athlete.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600">
              {athlete.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center text-white text-xs font-bold shadow">
            #{athlete.rank}
          </div>
          <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
            {athlete.nationality}
          </span>
          <span className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
            {athlete.value || athlete.earnings}
          </span>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
            {athlete.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{athlete.sport}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-3 leading-snug">{athlete.description}</p>
        </div>
      </div>
    </div>
  );
}

export function AthleteRankings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('richest');
  const scrollRef = useRef<HTMLDivElement>(null);
  const entries = getAthleteRankings(activeTab);
  const source = getRankingSource(activeTab);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <Section
      title={t('Athlete Rankings', 'অ্যাথলেট র্যাঙ্কিং')}
      subtitle={t('Richest, highest paid and most famous athletes', 'ধনী, সর্বোচ্চ বেতন ও সবচেয়ে বিখ্যাত অ্যাথলেট')}
    >
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(tab.label.en, tab.label.bn)}
            </motion.button>
          );
        })}
        <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap self-center">
          {source}
        </span>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-4"
            >
              {entries.map((athlete, i) => (
                <motion.div
                  key={athlete.id ?? `athlete-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="snap-start shrink-0"
                >
                  <Card
                    athlete={athlete}
                    statLabel={activeTab === 'famous' ? 'Followers' : activeTab === 'richest' ? 'Net Worth' : 'Annual'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
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
