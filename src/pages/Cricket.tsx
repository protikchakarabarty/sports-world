import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SportsHero } from '@/components/ui/SportsHero';
import { GenderSwitcher } from '@/components/ui/GenderSwitcher';
import type { Gender } from '@/components/ui/GenderSwitcher';
import { CricketMatches } from '@/components/cricket/CricketMatches';
import { CricketSeries } from '@/components/cricket/CricketSeries';
import { CricketUpcomingSeries } from '@/components/cricket/CricketUpcomingSeries';
import { CricketStats } from '@/components/cricket/CricketStats';
import { ICCRankingsSection } from '@/components/cricket/ICCRankings';
import { CricketAuctionTracker } from '@/components/cricket/CricketAuctionTracker';
import { CricketInjuries } from '@/components/cricket/CricketInjuries';
import { CricketRankings } from '@/components/cricket/CricketRankings';
import { CricketOnThisDay } from '@/components/cricket/CricketOnThisDay';
import { CricketFanPredictions } from '@/components/cricket/CricketFanPredictions';
import { CricketAIPredictions } from '@/components/cricket/CricketAIPredictions';
import { FantasyXI } from '@/components/cricket/FantasyXI';
import { CricketNewsSection } from '@/components/cricket/CricketNewsSection';
import { CricketHighlights } from '@/components/cricket/CricketHighlights';
import { BeautifulCricketers } from '@/components/cricket/BeautifulCricketers';
import { CricketNav } from '@/components/cricket/CricketNav';

const cricketBg = 'https://images.unsplash.com/photo-1750716413444-c8a957fcf35c?w=1920&q=85';

const pageContent: Record<Gender, { sections: { key: string; component: (g: Gender) => React.ReactNode }[] }> = {
  men: {
    sections: [
      { key: 'matches', component: (g) => <CricketMatches key="matches" gender={g} /> },
      { key: 'fan-predictions', component: (g) => <CricketFanPredictions key="fan-predictions" gender={g} /> },
      { key: 'ai-predictions', component: (g) => <CricketAIPredictions key="ai-predictions" gender={g} /> },
      { key: 'series', component: (g) => <CricketSeries key="series" gender={g} /> },
      { key: 'upcoming-series', component: (g) => <CricketUpcomingSeries key="upcoming-series" gender={g} /> },
      { key: 'news', component: (g) => <CricketNewsSection key="news" gender={g} /> },
      { key: 'highlights', component: (g) => <CricketHighlights key="highlights" gender={g} /> },
      { key: 'rankings', component: (g) => <ICCRankingsSection key="rankings" gender={g} /> },
      { key: 'injuries', component: (g) => <CricketInjuries key="injuries" gender={g} /> },
      { key: 'stats', component: (g) => <CricketStats key="stats" gender={g} /> },
      { key: 'auction', component: (g) => <CricketAuctionTracker key="auction" gender={g} /> },
      { key: 'fantasy', component: (g) => <FantasyXI key="fantasy" gender={g} /> },
      { key: 'richest', component: (g) => <CricketRankings key="richest" gender={g} /> },
      { key: 'today', component: (g) => <CricketOnThisDay key="today" gender={g} /> },
    ],
  },
  women: {
    sections: [
      { key: 'matches', component: (g) => <CricketMatches key="matches" gender={g} /> },
      { key: 'fan-predictions', component: (g) => <CricketFanPredictions key="fan-predictions" gender={g} /> },
      { key: 'ai-predictions', component: (g) => <CricketAIPredictions key="ai-predictions" gender={g} /> },
      { key: 'series', component: (g) => <CricketSeries key="series" gender={g} /> },
      { key: 'upcoming-series', component: (g) => <CricketUpcomingSeries key="upcoming-series" gender={g} /> },
      { key: 'news', component: (g) => <CricketNewsSection key="news" gender={g} /> },
      { key: 'highlights', component: (g) => <CricketHighlights key="highlights" gender={g} /> },
      { key: 'rankings', component: (g) => <ICCRankingsSection key="rankings" gender={g} /> },
      { key: 'injuries', component: (g) => <CricketInjuries key="injuries" gender={g} /> },
      { key: 'stats', component: (g) => <CricketStats key="stats" gender={g} /> },
      { key: 'auction', component: (g) => <CricketAuctionTracker key="auction" gender={g} /> },
      { key: 'fantasy', component: (g) => <FantasyXI key="fantasy" gender={g} /> },
      { key: 'richest', component: (g) => <CricketRankings key="richest" gender={g} /> },
      { key: 'today', component: (g) => <CricketOnThisDay key="today" gender={g} /> },
      { key: 'beautiful', component: () => <BeautifulCricketers key="beautiful" /> },
    ],
  },
};

export default function Cricket() {
  const [gender, setGender] = useState<Gender>(() => (localStorage.getItem('cricket-gender') as Gender) || 'men');
  const content = pageContent[gender];

  useEffect(() => { localStorage.setItem('cricket-gender', gender); }, [gender]);

  return (
    <div className="min-h-screen">
      <SportsHero
        image={cricketBg}
        title="Cricket"
        subtitle="Live scores, in-depth stats, ICC rankings, auction tracker, fantasy XI & more — all things cricket."
        accentGradient="from-sky-400 via-cyan-400 to-blue-500"
        overlayColor="from-blue-900/40 via-cyan-900/20"
      />
      <GenderSwitcher gender={gender} onChange={setGender} />
      <CricketNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={gender}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {content.sections.map((s) => (
              <div key={s.key} id={`section-${s.key}`}>
                {s.component(gender)}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
