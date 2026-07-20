import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Gender } from '@/data/mockData';

interface NavItem {
  key: string;
  labelEn: string;
  labelBn: string;
}

const menSections: NavItem[] = [
  { key: 'matches', labelEn: 'Matches', labelBn: 'ম্যাচ' },
  { key: 'standings', labelEn: 'Standings', labelBn: 'স্ট্যান্ডিং' },
  { key: 'predictions', labelEn: 'Predictions', labelBn: 'ভবিষ্যদ্বাণী' },
  { key: 'stats', labelEn: 'Stats', labelBn: 'পরিসংখ্যান' },
  { key: 'leagues', labelEn: 'Leagues', labelBn: 'লীগ' },
  { key: 'news', labelEn: 'News', labelBn: 'খবর' },
  { key: 'highlights', labelEn: 'Highlights', labelBn: 'হাইলাইটস' },
  { key: 'fifa-rankings', labelEn: 'FIFA Rankings', labelBn: 'ফিফা র্যাঙ্কিং' },
  { key: 'club-rankings', labelEn: 'Club Rankings', labelBn: 'ক্লাব র্যাঙ্কিং' },
  { key: 'transfer', labelEn: 'Transfers', labelBn: 'ট্রান্সফার' },
  { key: 'injuries', labelEn: 'Injuries', labelBn: 'ইনজুরি' },
  { key: 'richest', labelEn: 'Richest', labelBn: 'ধনী' },
  { key: 'today', labelEn: 'On This Day', labelBn: 'এই দিনে' },
];

const womenSections: NavItem[] = [
  { key: 'matches', labelEn: 'Matches', labelBn: 'ম্যাচ' },
  { key: 'standings', labelEn: 'Standings', labelBn: 'স্ট্যান্ডিং' },
  { key: 'predictions', labelEn: 'Predictions', labelBn: 'ভবিষ্যদ্বাণী' },
  { key: 'stats', labelEn: 'Stats', labelBn: 'পরিসংখ্যান' },
  { key: 'leagues', labelEn: 'Leagues', labelBn: 'লীগ' },
  { key: 'news', labelEn: 'News', labelBn: 'খবর' },
  { key: 'highlights', labelEn: 'Highlights', labelBn: 'হাইলাইটস' },
  { key: 'fifa-rankings', labelEn: 'FIFA Rankings', labelBn: 'ফিফা র্যাঙ্কিং' },
  { key: 'club-rankings', labelEn: 'Club Rankings', labelBn: 'ক্লাব র্যাঙ্কিং' },
  { key: 'transfer', labelEn: 'Transfers', labelBn: 'ট্রান্সফার' },
  { key: 'injuries', labelEn: 'Injuries', labelBn: 'ইনজুরি' },
  { key: 'beautiful', labelEn: 'Most Beautiful', labelBn: 'সবচেয়ে সুন্দরী' },
  { key: 'today', labelEn: 'On This Day', labelBn: 'এই দিনে' },
];

export function FootballSectionNav({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('matches');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections = gender === 'women' ? womenSections : menSections;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace('football-', ''));
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    for (const section of sections) {
      const el = document.getElementById(`football-${section.key}`);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollTo = (key: string) => {
    const el = document.getElementById(`football-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-2">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-1 min-w-max">
            {sections.map((s) => {
              const isActive = activeSection === s.key;
              return (
                <motion.button
                  key={s.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo(s.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t(s.labelEn, s.labelBn)}
                  <FiChevronRight className={`w-3 h-3 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
