import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiSunrise, FiSunset, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import type { OnThisDayEntry } from '@/types';

interface CardEntry extends OnThisDayEntry {
  image: string;
  country: string;
}

const onThisDayBorn: CardEntry[] = [
  { id: 'otd1', name: 'Muhammad Ali', sport: 'Boxing', type: 'born', year: '1942', description: 'The Greatest — 3x heavyweight champion, cultural icon and humanitarian', image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Muhammad_Ali_NYWTS.jpg', country: 'USA' },
  { id: 'otd2', name: 'Michael Jordan', sport: 'Basketball', type: 'born', year: '1963', description: '6x NBA champion, 5x MVP, widely considered the greatest basketball player ever', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg', country: 'USA' },
  { id: 'otd3', name: 'Serena Williams', sport: 'Tennis', type: 'born', year: '1981', description: '23 Grand Slam titles, 4x Olympic gold medalist, women\'s tennis icon', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg', country: 'USA' },
  { id: 'otd4', name: 'Usain Bolt', sport: 'Athletics', type: 'born', year: '1986', description: 'Fastest human — 9.58s 100m, 19.19s 200m, 8x Olympic gold medalist', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Usain_Bolt_smiling_Berlin_2009.JPG', country: 'Jamaica' },
  { id: 'otd5', name: 'Michael Phelps', sport: 'Swimming', type: 'born', year: '1985', description: '28 Olympic medals (23 gold) — the most decorated Olympian in history', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Michael_Phelps_Rio_Olympics_2016.jpg', country: 'USA' },
  { id: 'otd6', name: 'Roger Federer', sport: 'Tennis', type: 'born', year: '1981', description: '20 Grand Slam titles, 310 weeks as world No. 1, Swiss tennis maestro', image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg', country: 'Switzerland' },
  { id: 'otd7', name: 'LeBron James', sport: 'Basketball', type: 'born', year: '1984', description: 'NBA all-time leading scorer, 4x champion, 4x MVP, business mogul', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg', country: 'USA' },
  { id: 'otd8', name: 'Tiger Woods', sport: 'Golf', type: 'born', year: '1975', description: '15 major championships, 82 PGA Tour wins, golf\'s greatest icon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/President_Donald_Trump_hosts_a_reception_honoring_Black_History_Month_%2854341713089%29_%28cropped%29.jpg', country: 'USA' },
  { id: 'otd9', name: 'Simone Biles', sport: 'Gymnastics', type: 'born', year: '1997', description: '7 Olympic medals, 25 World Championship medals, GOAT of gymnastics', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Simone_Biles_National_Team_2024.jpg', country: 'USA' },
  { id: 'otd10', name: 'Mike Tyson', sport: 'Boxing', type: 'born', year: '1966', description: 'Youngest heavyweight champion at 20, 50-6 record, most feared boxer ever', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Mike_Tyson_Photo_Op_GalaxyCon_Austin_2023.jpg', country: 'USA' },
];

const onThisDayDied: CardEntry[] = [
  { id: 'otd11', name: 'Kobe Bryant', sport: 'Basketball', type: 'died', year: '2020', description: '5x NBA champion, 18x All-Star, Mamba mentality legend', image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Kobe_Bryant_Dec_2014.jpg', country: 'USA' },
  { id: 'otd12', name: 'Jesse Owens', sport: 'Athletics', type: 'died', year: '1980', description: '4x Olympic gold medalist (1936), defied Hitler with his achievements', image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Jesse_Owens_1936.jpg', country: 'USA' },
  { id: 'otd13', name: 'Bruce Lee', sport: 'Martial Arts', type: 'died', year: '1973', description: 'Martial arts legend, actor, founder of Jeet Kune Do philosophy', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Bruce_Lee_as_Chen_Zhen_%284x5_cropped%29.jpg', country: 'USA' },
  { id: 'otd14', name: 'Ayrton Senna', sport: 'Formula 1', type: 'died', year: '1994', description: '3x F1 World Champion, 41 wins, widely regarded as fastest driver ever', image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Ayrton_Senna_in_the_paddock_before_the_1993_British_Grand_Prix_%2833686752075%29_%28cropped%29.jpg', country: 'Brazil' },
  { id: 'otd15', name: 'Florence Griffith Joyner', sport: 'Athletics', type: 'died', year: '1998', description: '3x Olympic gold medalist, world records in 100m & 200m still stand', image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Florence_Griffith_Joyner2.jpg', country: 'USA' },
  { id: 'otd16', name: 'Babe Ruth', sport: 'Baseball', type: 'died', year: '1948', description: '7x World Series champion, 714 HR, baseball\'s original superstar', image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Babe_Ruth2.jpg', country: 'USA' },
];

function Card({ entry, showBorn }: { entry: CardEntry; showBorn: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-[260px] shrink-0">
      <div className="glass-card overflow-hidden group">
        <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imgError ? (
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-white text-3xl font-bold ${
              showBorn ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}>
              {entry.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
            {entry.country}
          </span>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {entry.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.sport} • {entry.year}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-snug">{entry.description}</p>
        </div>
      </div>
    </div>
  );
}

export function OnThisDay() {
  const { t } = useLanguage();
  const [showBorn, setShowBorn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const entries = showBorn ? onThisDayBorn : onThisDayDied;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <Section title={t('On This Day', 'এই দিনে')} subtitle={t('Historical moments in sports', 'ক্রীড়ার ঐতিহাসিক মুহূর্ত')}>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowBorn(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            showBorn ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <FiSunrise className="w-3.5 h-3.5" />
          {t('Born Today', 'আজ জন্মেছেন')}
        </button>
        <button
          onClick={() => setShowBorn(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !showBorn ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <FiSunset className="w-3.5 h-3.5" />
          {t('Died Today', 'আজ মারা গেছেন')}
        </button>
        <FiCalendar className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
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
          <AnimatePresence mode="sync">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id ?? `otd-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className="snap-start shrink-0"
              >
                <Card entry={entry} showBorn={showBorn} />
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
    </Section>
  );
}
