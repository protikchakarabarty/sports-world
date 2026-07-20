import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SportsHero } from '@/components/ui/SportsHero';
import { GenderSwitcher } from '@/components/ui/GenderSwitcher';
import type { Gender } from '@/components/ui/GenderSwitcher';
import { FootballMatches } from '@/components/football/FootballMatches';
import { FootballLeagues } from '@/components/football/FootballLeagues';
import { FootballFifaRankings } from '@/components/football/FootballFifaRankings';
import { FootballClubRankings } from '@/components/football/FootballClubRankings';
import { TransferMarketSection } from '@/components/football/TransferMarket';
import { FootballInjuries } from '@/components/football/FootballInjuries';
import { FootballPredictions } from '@/components/football/FootballPredictions';
import { FootballOnThisDay } from '@/components/football/FootballOnThisDay';
import { FootballNewsSection } from '@/components/football/FootballNewsSection';
import { FootballHighlights } from '@/components/football/FootballHighlights';
import { FootballRichList } from '@/components/football/FootballRichList';
import { BeautifulFootballers } from '@/components/football/BeautifulFootballers';
import { FootballSectionNav } from '@/components/football/FootballSectionNav';
import { FootballStats } from '@/components/football/FootballStats';
import { FootballStandings } from '@/components/football/FootballStandings';
import { WomenFootballMatches } from '@/components/football/womens/WomenFootballMatches';
import { WomenStandings } from '@/components/football/womens/WomenStandings';
import { WomenPredictions } from '@/components/football/womens/WomenPredictions';
import { WomenStats } from '@/components/football/womens/WomenStats';
import { WomenLeagues } from '@/components/football/womens/WomenLeagues';
import { WomenNewsSection } from '@/components/football/womens/WomenNewsSection';
import { WomenHighlights } from '@/components/football/womens/WomenHighlights';
import { WomenFifaRankings } from '@/components/football/womens/WomenFifaRankings';
import { WomenClubRankings } from '@/components/football/womens/WomenClubRankings';
import { WomenTransferMarket } from '@/components/football/womens/WomenTransferMarket';
import { WomenInjuries } from '@/components/football/womens/WomenInjuries';
import { WomenBeautifulFootballers } from '@/components/football/womens/WomenBeautifulFootballers';
import { WomenOnThisDay } from '@/components/football/womens/WomenOnThisDay';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const footballBg = 'https://images.unsplash.com/photo-1549333580-4cb2c5c8e421?w=1920&q=85';

const pageContent: Record<Gender, { key: string; component: (g: Gender) => React.ReactNode }[]> = {
  men: [
    { key: 'matches', component: (g) => <div id="football-matches"><FootballMatches key="matches" gender={g} /></div> },
    { key: 'standings', component: (g) => <div id="football-standings"><FootballStandings key="standings" /></div> },
    { key: 'predictions', component: (g) => <div id="football-predictions"><FootballPredictions key="predictions" gender={g} /></div> },
    { key: 'stats', component: (g) => <div id="football-stats"><FootballStats key="stats" gender={g} /></div> },
    { key: 'leagues', component: (g) => <div id="football-leagues"><FootballLeagues key="leagues" gender={g} /></div> },
    { key: 'news', component: (g) => <div id="football-news"><FootballNewsSection key="news" gender={g} /></div> },
    { key: 'highlights', component: (g) => <div id="football-highlights"><FootballHighlights key="highlights" /></div> },
    { key: 'fifa-rankings', component: () => <div id="football-fifa-rankings"><FootballFifaRankings /></div> },
    { key: 'club-rankings', component: () => <div id="football-club-rankings"><FootballClubRankings /></div> },
    { key: 'transfer', component: (g) => <div id="football-transfer"><TransferMarketSection key="transfer" gender={g} /></div> },
    { key: 'injuries', component: (g) => <div id="football-injuries"><FootballInjuries key="injuries" gender={g} /></div> },
    { key: 'richest', component: (g) => <div id="football-richest"><FootballRichList key="richest" gender={g} /></div> },
    { key: 'today', component: (g) => <div id="football-today"><FootballOnThisDay key="today" gender={g} /></div> },
  ],
  women: [
    { key: 'matches', component: () => <div id="football-matches"><ErrorBoundary><WomenFootballMatches /></ErrorBoundary></div> },
    { key: 'standings', component: () => <div id="football-standings"><ErrorBoundary><WomenStandings /></ErrorBoundary></div> },
    { key: 'predictions', component: () => <div id="football-predictions"><ErrorBoundary><WomenPredictions /></ErrorBoundary></div> },
    { key: 'stats', component: () => <div id="football-stats"><ErrorBoundary><WomenStats /></ErrorBoundary></div> },
    { key: 'leagues', component: () => <div id="football-leagues"><ErrorBoundary><WomenLeagues /></ErrorBoundary></div> },
    { key: 'news', component: () => <div id="football-news"><ErrorBoundary><WomenNewsSection /></ErrorBoundary></div> },
    { key: 'highlights', component: () => <div id="football-highlights"><ErrorBoundary><WomenHighlights /></ErrorBoundary></div> },
    { key: 'fifa-rankings', component: () => <div id="football-fifa-rankings"><ErrorBoundary><WomenFifaRankings /></ErrorBoundary></div> },
    { key: 'club-rankings', component: () => <div id="football-club-rankings"><ErrorBoundary><WomenClubRankings /></ErrorBoundary></div> },
    { key: 'transfer', component: () => <div id="football-transfer"><ErrorBoundary><WomenTransferMarket /></ErrorBoundary></div> },
    { key: 'injuries', component: () => <div id="football-injuries"><ErrorBoundary><WomenInjuries /></ErrorBoundary></div> },
    { key: 'beautiful', component: () => <div id="football-beautiful"><ErrorBoundary><WomenBeautifulFootballers /></ErrorBoundary></div> },
    { key: 'today', component: () => <div id="football-today"><ErrorBoundary><WomenOnThisDay /></ErrorBoundary></div> },
  ],
};

export default function Football() {
  const [gender, setGender] = useState<Gender>(() => (localStorage.getItem('football-gender') as Gender) || 'men');
  const sections = pageContent[gender] ?? [];

  useEffect(() => { localStorage.setItem('football-gender', gender); }, [gender]);

  return (
    <div className="min-h-screen">
      <SportsHero
        image={footballBg}
        title="Football"
        subtitle="Live scores, transfer market, FIFA rankings, injuries, fixtures & more — the beautiful game covered."
        accentGradient="from-emerald-400 via-green-400 to-teal-500"
        overlayColor="from-emerald-900/40 via-green-900/20"
      />
      <GenderSwitcher gender={gender} onChange={setGender} />
      <FootballSectionNav gender={gender} />
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
            {sections.map((s) => s.component(gender))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
