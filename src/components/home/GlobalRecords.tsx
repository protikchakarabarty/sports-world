import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import type { GlobalRecord } from '@/types';

const globalRecords: GlobalRecord[] = [
  {
    id: 'gr1',
    title: 'Most Goals in International Football',
    description: 'The all-time leading goal scorer in international football with 130+ goals',
    holder: 'Cristiano Ronaldo',
    category: 'Football',
    year: '2026',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Cristiano_Ronaldo_%28cropped%29.jpg',
  },
  {
    id: 'gr2',
    title: 'Fastest 100m Sprint',
    description: 'The fastest time ever recorded for 100 meters — 9.58 seconds',
    holder: 'Usain Bolt',
    category: 'Athletics',
    year: '2009',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Usain_Bolt_portrait.jpg',
  },
  {
    id: 'gr3',
    title: 'Most Test Runs in Cricket',
    description: 'The highest run scorer in Test cricket history with 15,921 runs',
    holder: 'Sachin Tendulkar',
    category: 'Cricket',
    year: '2013',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Sachin_Tendulkar_cropped.jpg',
  },
  {
    id: 'gr4',
    title: 'Most Grand Slam Titles',
    description: 'The most Grand Slam singles titles in tennis history — 24 titles',
    holder: 'Novak Djokovic',
    category: 'Tennis',
    year: '2026',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Novak_Djokovic.jpg',
  },
  {
    id: 'gr5',
    title: 'Most NBA Championships',
    description: 'The most NBA championships won by a player — 11 titles',
    holder: 'Bill Russell',
    category: 'Basketball',
    year: '1969',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Bill_Russell_%28cropped%29.jpg',
  },
  {
    id: 'gr6',
    title: 'Most Olympic Gold Medals',
    description: 'The most Olympic gold medals won by an individual — 23 gold medals',
    holder: 'Michael Phelps',
    category: 'Olympic Sports',
    year: '2016',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Michael_Phelps_August_2016.jpg',
  },
  {
    id: 'gr7',
    title: 'Most F1 World Championships',
    description: 'The most Formula 1 World Drivers\' Championships — 7 titles each',
    holder: 'Lewis Hamilton & Michael Schumacher',
    category: 'Formula 1',
    year: '2020',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Lewis_Hamilton_2022.jpg',
  },
  {
    id: 'gr8',
    title: 'Most Goals in a Calendar Year',
    description: 'The most goals scored in a single calendar year — 91 goals',
    holder: 'Lionel Messi',
    category: 'Football',
    year: '2012',
    holderImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Lionel_Messi_2018.jpg',
  },
];

function RecordCard({ record, index }: { record: GlobalRecord; index: number }) {
  const [imgError, setImgError] = useState(false);

  const initials = record.holder
    .split('&')[0]
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-0 overflow-hidden"
    >
      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 relative">
        {!imgError ? (
          <img
            src={record.holderImage}
            alt={record.holder}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
            <span className="text-3xl font-bold text-primary/60">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-2">
          <FiAward className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-white/90">{record.category}</span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{record.title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{record.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{record.holder}</span>
          <span className="text-xs text-gray-400">{record.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function GlobalRecords() {
  const { t } = useLanguage();

  return (
    <Section title={t('Global Records', 'বিশ্ব রেকর্ড')} subtitle={t('Incredible achievements across all sports', 'সব খেলায় অবিশ্বাস্য কীর্তি')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {globalRecords.map((record, i) => (
          <RecordCard key={record.id || `record-${i}`} record={record} index={i} />
        ))}
      </div>
    </Section>
  );
}
