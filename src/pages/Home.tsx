import { HeroSection } from '@/components/home/HeroSection';
import { LiveMatches } from '@/components/home/LiveMatches';
import { LatestNews } from '@/components/home/LatestNews';
import { MatchHighlights } from '@/components/home/MatchHighlights';
import { AthleteRankings } from '@/components/home/AthleteRankings';
import { OnThisDay } from '@/components/home/OnThisDay';
import { MedalTable } from '@/components/home/MedalTable';
import { HallOfFame } from '@/components/home/HallOfFame';
import { GlobalRecords } from '@/components/home/GlobalRecords';
import { HomeSectionNav } from '@/components/home/HomeSectionNav';

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <HomeSectionNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div id="home-live-matches"><LiveMatches /></div>
        <div id="home-latest-news"><LatestNews /></div>
        <div id="home-highlights"><MatchHighlights /></div>
        <div id="home-rankings"><AthleteRankings /></div>
        <div id="home-on-this-day"><OnThisDay /></div>
        <div id="home-medal-table"><MedalTable /></div>
        <div id="home-hall-of-fame"><HallOfFame /></div>
        <div id="home-global-records"><GlobalRecords /></div>
      </div>
    </div>
  );
}
