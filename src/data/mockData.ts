import type {
  NewsArticle, Match, Athlete, MedalEntry, HallOfFameEntry,
  GlobalRecord, OnThisDayEntry, CricketSeries, CricketStats,
  CricketRanking, TransferNews, LeagueStanding, FootballStats,
  PredictionPoll, HeroSlide, InjuryReport, ICCRankingEntry,
} from '@/types';

export const heroSlides: HeroSlide[] = [
  { id: 'h1', title: 'Champions League Final: Real Madrid vs Man City', subtitle: 'The biggest game of the season awaits', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200', category: 'Football' },
  { id: 'h2', title: 'IPL 2026: Mumbai Indians Clinch Title', subtitle: 'Dominant performance in the final', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200', category: 'Cricket' },
  { id: 'h3', title: 'US Open 2026: Final Highlights', subtitle: 'Epic showdown at Flushing Meadows', image: 'https://images.unsplash.com/photo-1622279457486-28c2f0912047?w=1200', category: 'Tennis' },
  { id: 'h4', title: 'F1 Monaco GP: Verstappen Wins Again', subtitle: 'Dominant display on the streets', image: 'https://images.unsplash.com/photo-1647516263096-23d3e8820b87?w=1200', category: 'Formula 1' },
  { id: 'h5', title: 'NBA Finals 2026: Game 7 Thriller', subtitle: 'Basketball at its finest', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200', category: 'Basketball' },
];

export const breakingNews: string[] = [
  'BREAKING: Cristiano Ronaldo signs for Al Hilal in record $500M deal',
  'BREAKING: India announces squad for World Test Championship final',
  'BREAKING: Novak Djokovic withdraws from Wimbledon due to injury',
  'BREAKING: Manchester City charged with 115 FFP violations - verdict expected',
];

export const featuredStory: NewsArticle = {
  id: 'f1',
  title: 'The Rise of Women\'s Sports: A New Era of Global Recognition',
  excerpt: 'Women\'s sports are experiencing unprecedented growth in viewership, sponsorship, and participation across all major disciplines worldwide.',
  image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
  category: 'Olympic Sports',
  date: '2026-07-03',
  author: 'Sarah Johnson',
  readTime: '8 min read',
  featured: true,
  trending: true,
};

export const categories: string[] = [
  'All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Formula 1', 'Hockey', 'Volleyball', 'Olympic Sports',
];

export const newsArticles: NewsArticle[] = [
  { id: 'n1', title: 'Manchester United Announce New Manager for 2026 Season', excerpt: 'The Red Devils have appointed a new tactician to lead their rebuild after a disappointing campaign.', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600', category: 'Football', date: '2026-07-03', author: 'James Taylor', readTime: '4 min read', featured: false, trending: true },
  { id: 'n2', title: 'Virat Kohli Breaks Record for Most International Centuries', excerpt: 'The Indian batting maestro continues to rewrite the record books with his 81st international ton.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', category: 'Cricket', date: '2026-07-03', author: 'Priya Sharma', readTime: '5 min read', featured: false, trending: true },
  { id: 'n3', title: 'Lakers Trade Shakes Up NBA Power Dynamics', excerpt: 'A blockbuster trade has sent shockwaves through the league as the Lakers acquire a superstar.', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600', category: 'Basketball', date: '2026-07-02', author: 'Mike Chen', readTime: '3 min read', featured: false, trending: true },
  { id: 'n4', title: 'Iga Swiatek Dominates at Wimbledon', excerpt: 'The world No. 1 continues her grass court dominance with a straight-sets victory.', image: 'https://images.unsplash.com/photo-1622279457486-28c2f0912047?w=600', category: 'Tennis', date: '2026-07-02', author: 'Emma Williams', readTime: '4 min read', featured: false, trending: false },
  { id: 'n5', title: 'Hamilton Announces Retirement at End of Season', excerpt: 'The seven-time world champion will hang up his helmet after an illustrious career.', image: 'https://images.unsplash.com/photo-1647516263096-23d3e8820b87?w=600', category: 'Formula 1', date: '2026-07-01', author: 'Alex Turner', readTime: '6 min read', featured: false, trending: true },
  { id: 'n6', title: 'India Hockey Team Qualifies for World Cup Semifinals', excerpt: 'A dominant performance sees the Indian hockey team book their spot in the final four.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', category: 'Hockey', date: '2026-07-01', author: 'Raj Patel', readTime: '3 min read', featured: false, trending: false },
  { id: 'n7', title: 'Brazilian Volleyball Star Signs Record Deal', excerpt: 'The biggest contract in volleyball history has been signed by the Olympic gold medalist.', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600', category: 'Volleyball', date: '2026-06-30', author: 'Carlos Silva', readTime: '4 min read', featured: false, trending: false },
  { id: 'n8', title: 'Olympics 2028: Los Angeles Prepares for Mega Event', excerpt: 'With two years to go, LA is gearing up for what promises to be the most innovative Olympics yet.', image: 'https://images.unsplash.com/photo-1579126038374-1417c0346514?w=600', category: 'Olympic Sports', date: '2026-06-30', author: 'David Miller', readTime: '7 min read', featured: false, trending: false },
];

export const matches: Match[] = [
  { id: 'm1', sport: 'football', status: 'live', homeTeam: 'Real Madrid', awayTeam: 'Manchester City', homeScore: '2', awayScore: '1', time: '65\'', date: '2026-07-03', venue: 'Santiago Bernabéu', broadcast: 'Sky Sports, ESPN', league: 'Champions League' },
  { id: 'm2', sport: 'cricket', status: 'live', homeTeam: 'India', awayTeam: 'Australia', homeScore: '245/4', awayScore: '189/6', time: '38.2 overs', date: '2026-07-03', venue: 'Lord\'s', broadcast: 'Star Sports, Hotstar', league: 'World Test Championship' },
  { id: 'm3', sport: 'basketball', status: 'live', homeTeam: 'LA Lakers', awayTeam: 'Boston Celtics', homeScore: '89', awayScore: '82', time: '3rd Q', date: '2026-07-03', venue: 'Staples Center', broadcast: 'NBA TV', league: 'NBA' },
  { id: 'm4', sport: 'football', status: 'upcoming', homeTeam: 'Barcelona', awayTeam: 'Bayern Munich', time: '20:00', date: '2026-07-03', venue: 'Camp Nou', broadcast: 'ESPN+', league: 'La Liga' },
  { id: 'm5', sport: 'cricket', status: 'upcoming', homeTeam: 'Pakistan', awayTeam: 'England', time: '10:00', date: '2026-07-04', venue: 'Gaddafi Stadium', broadcast: 'PTV Sports', league: 'Test Series' },
  { id: 'm6', sport: 'tennis', status: 'finished', homeTeam: 'Novak Djokovic', awayTeam: 'Carlos Alcaraz', homeScore: '3', awayScore: '1', time: 'Final', date: '2026-07-02', venue: 'Wimbledon', broadcast: 'BBC Sport', league: 'Wimbledon' },
  { id: 'm7', sport: 'formula1', status: 'upcoming', homeTeam: 'Max Verstappen', awayTeam: 'Lewis Hamilton', time: '14:00', date: '2026-07-05', venue: 'Silverstone', broadcast: 'Sky Sports F1', league: 'F1 British GP' },
  { id: 'm8', sport: 'hockey', status: 'finished', homeTeam: 'India', awayTeam: 'Netherlands', homeScore: '4', awayScore: '2', time: 'FT', date: '2026-07-02', venue: 'Kalinga Stadium', broadcast: 'Olympic Channel', league: 'Hockey World Cup' },
];

export const richestAthletes: Athlete[] = [
  { id: 'r1', name: 'Michael Jordan', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9391?w=200', rank: 1, value: '$3.2B', nationality: 'USA' },
  { id: 'r2', name: 'Tiger Woods', sport: 'Golf', image: 'https://images.unsplash.com/photo-1587174486073-ae5eac565959?w=200', rank: 2, value: '$2.1B', nationality: 'USA' },
  { id: 'r3', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 3, value: '$1.2B', nationality: 'Portugal' },
  { id: 'r4', name: 'Lionel Messi', sport: 'Football', image: 'https://images.unsplash.com/photo-1566370865903-2f8255ed3e46?w=200', rank: 4, value: '$1.1B', nationality: 'Argentina' },
  { id: 'r5', name: 'LeBron James', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=200', rank: 5, value: '$1.0B', nationality: 'USA' },
  { id: 'r6', name: 'Roger Federer', sport: 'Tennis', image: 'https://images.unsplash.com/photo-1627856014754-3b5c60ebc7d0?w=200', rank: 6, value: '$900M', nationality: 'Switzerland' },
  { id: 'r7', name: 'Floyd Mayweather', sport: 'Boxing', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200', rank: 7, value: '$850M', nationality: 'USA' },
  { id: 'r8', name: 'Virat Kohli', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 8, value: '$750M', nationality: 'India' },
  { id: 'r9', name: 'Neymar Jr', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 9, value: '$700M', nationality: 'Brazil' },
  { id: 'r10', name: 'Usain Bolt', sport: 'Athletics', image: 'https://images.unsplash.com/photo-1579126038374-1417c0346514?w=200', rank: 10, value: '$500M', nationality: 'Jamaica' },
];

export const highestPaidAthletes: Athlete[] = [
  { id: 'hp1', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 1, earnings: '$260M', nationality: 'Portugal' },
  { id: 'hp2', name: 'Lionel Messi', sport: 'Football', image: 'https://images.unsplash.com/photo-1566370865903-2f8255ed3e46?w=200', rank: 2, earnings: '$220M', nationality: 'Argentina' },
  { id: 'hp3', name: 'LeBron James', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=200', rank: 3, earnings: '$180M', nationality: 'USA' },
  { id: 'hp4', name: 'Stephen Curry', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=200', rank: 4, earnings: '$160M', nationality: 'USA' },
  { id: 'hp5', name: 'Neymar Jr', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 5, earnings: '$150M', nationality: 'Brazil' },
  { id: 'hp6', name: 'Kevin Durant', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=200', rank: 6, earnings: '$140M', nationality: 'USA' },
  { id: 'hp7', name: 'Roger Federer', sport: 'Tennis', image: 'https://images.unsplash.com/photo-1627856014754-3b5c60ebc7d0?w=200', rank: 7, earnings: '$130M', nationality: 'Switzerland' },
  { id: 'hp8', name: 'Virat Kohli', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 8, earnings: '$120M', nationality: 'India' },
  { id: 'hp9', name: 'Canelo Alvarez', sport: 'Boxing', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200', rank: 9, earnings: '$110M', nationality: 'Mexico' },
  { id: 'hp10', name: 'Tom Brady', sport: 'NFL', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9391?w=200', rank: 10, earnings: '$100M', nationality: 'USA' },
];

export const mostFamousAthletes: Athlete[] = [
  { id: 'mf1', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 1, value: '1.2B followers', nationality: 'Portugal' },
  { id: 'mf2', name: 'Lionel Messi', sport: 'Football', image: 'https://images.unsplash.com/photo-1566370865903-2f8255ed3e46?w=200', rank: 2, value: '800M followers', nationality: 'Argentina' },
  { id: 'mf3', name: 'Virat Kohli', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 3, value: '500M followers', nationality: 'India' },
  { id: 'mf4', name: 'Neymar Jr', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 4, value: '450M followers', nationality: 'Brazil' },
  { id: 'mf5', name: 'LeBron James', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=200', rank: 5, value: '300M followers', nationality: 'USA' },
  { id: 'mf6', name: 'Roger Federer', sport: 'Tennis', image: 'https://images.unsplash.com/photo-1627856014754-3b5c60ebc7d0?w=200', rank: 6, value: '250M followers', nationality: 'Switzerland' },
  { id: 'mf7', name: 'Ronaldo Nazário', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 7, value: '200M followers', nationality: 'Brazil' },
  { id: 'mf8', name: 'Stephen Curry', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=200', rank: 8, value: '180M followers', nationality: 'USA' },
  { id: 'mf9', name: 'MS Dhoni', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 9, value: '150M followers', nationality: 'India' },
  { id: 'mf10', name: 'Usain Bolt', sport: 'Athletics', image: 'https://images.unsplash.com/photo-1579126038374-1417c0346514?w=200', rank: 10, value: '120M followers', nationality: 'Jamaica' },
];

export const medalTable: MedalEntry[] = [
  { country: 'United States', flag: '🇺🇸', gold: 39, silver: 41, bronze: 33, total: 113 },
  { country: 'China', flag: '🇨🇳', gold: 38, silver: 32, bronze: 18, total: 88 },
  { country: 'Japan', flag: '🇯🇵', gold: 27, silver: 14, bronze: 17, total: 58 },
  { country: 'Great Britain', flag: '🇬🇧', gold: 22, silver: 21, bronze: 22, total: 65 },
  { country: 'ROC', flag: '🇷🇺', gold: 20, silver: 28, bronze: 23, total: 71 },
  { country: 'Australia', flag: '🇦🇺', gold: 17, silver: 7, bronze: 22, total: 46 },
  { country: 'Netherlands', flag: '🇳🇱', gold: 10, silver: 12, bronze: 14, total: 36 },
  { country: 'France', flag: '🇫🇷', gold: 10, silver: 12, bronze: 11, total: 33 },
  { country: 'Germany', flag: '🇩🇪', gold: 10, silver: 11, bronze: 16, total: 37 },
  { country: 'Italy', flag: '🇮🇹', gold: 10, silver: 10, bronze: 20, total: 40 },
];

export const hallOfFame: HallOfFameEntry[] = [
  { id: 'hof1', name: 'Pelé', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400', era: '1956-1977', achievements: ['3x World Cup Winner', '12x Brazilian League Winner', '1279 Goals in 1363 Games'], records: ['Most goals in a calendar year (127)', 'Youngest World Cup winner (17)'], nationality: 'Brazil', bio: 'Widely regarded as the greatest footballer of all time, Pelé won three FIFA World Cups and scored over 1,200 career goals.' },
  { id: 'hof2', name: 'Michael Jordan', sport: 'Basketball', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9391?w=400', era: '1984-2003', achievements: ['6x NBA Champion', '5x MVP', '6x Finals MVP'], records: ['Highest career PPG in NBA (30.12)', '10x Scoring Champion'], nationality: 'USA', bio: 'The greatest basketball player of all time who revolutionized the game and became a global cultural icon.' },
  { id: 'hof3', name: 'Donald Bradman', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', era: '1928-1948', achievements: ['99.94 Test Average', '29 Test Centuries', 'Ashes Legend'], records: ['Highest Test batting average (99.94)', 'Most runs in a Test series (974)'], nationality: 'Australia', bio: 'The greatest batsman in cricket history with a Test average of 99.94, widely considered the most remarkable statistical achievement in sports.' },
  { id: 'hof4', name: 'Serena Williams', sport: 'Tennis', image: 'https://images.unsplash.com/photo-1622279457486-28c2f0912047?w=400', era: '1995-2022', achievements: ['23 Grand Slam Singles Titles', '4x Olympic Gold Medalist', '319 Weeks as World No.1'], records: ['Most Grand Slams in Open Era (23)', 'Most titles at 3 different Slams'], nationality: 'USA', bio: 'One of the greatest tennis players ever, Serena dominated women\'s tennis for two decades with unmatched power and athleticism.' },
  { id: 'hof5', name: 'Muhammad Ali', sport: 'Boxing', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400', era: '1960-1981', achievements: ['3x World Heavyweight Champion', 'Olympic Gold Medalist', 'Sportsman of the Century'], records: ['Only 3x lineal heavyweight champion', 'Fight of the Century vs Frazier'], nationality: 'USA', bio: 'The Greatest — a boxing legend, civil rights activist, and one of the most influential cultural figures of the 20th century.' },
  { id: 'hof6', name: 'Usain Bolt', sport: 'Athletics', image: 'https://images.unsplash.com/photo-1579126038374-1417c0346514?w=400', era: '2004-2017', achievements: ['8x Olympic Gold Medalist', '11x World Champion', 'World Records in 100m & 200m'], records: ['World Record 100m (9.58s)', 'World Record 200m (19.19s)', '3x triple-triple Olympic gold'], nationality: 'Jamaica', bio: 'The fastest man in history, Bolt dominated sprinting with world records in the 100m and 200m that still stand today.' },
];

export const globalRecords: GlobalRecord[] = [
  { id: 'gr1', title: 'Most Goals in International Football', description: 'The all-time leading goal scorer in international football', holder: 'Cristiano Ronaldo', category: 'Football', year: '2026', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Cristiano_Ronaldo_%28cropped%29.jpg' },
  { id: 'gr2', title: 'Fastest 100m Sprint', description: 'The fastest time ever recorded for 100 meters', holder: 'Usain Bolt', category: 'Athletics', year: '2009', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Usain_Bolt_portrait.jpg' },
  { id: 'gr3', title: 'Most Test Runs in Cricket', description: 'The highest run scorer in Test cricket history', holder: 'Sachin Tendulkar', category: 'Cricket', year: '2013', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Sachin_Tendulkar_cropped.jpg' },
  { id: 'gr4', title: 'Most Grand Slam Titles', description: 'The most Grand Slam singles titles in tennis history', holder: 'Novak Djokovic', category: 'Tennis', year: '2026', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Novak_Djokovic.jpg' },
  { id: 'gr5', title: 'Most NBA Championships', description: 'The most NBA championships won by a player', holder: 'Bill Russell', category: 'Basketball', year: '1969', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Bill_Russell_%28cropped%29.jpg' },
  { id: 'gr6', title: 'Most Olympic Gold Medals', description: 'The most Olympic gold medals won by an individual', holder: 'Michael Phelps', category: 'Olympic Sports', year: '2016', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Michael_Phelps_August_2016.jpg' },
  { id: 'gr7', title: 'Most F1 World Championships', description: 'The most Formula 1 World Drivers\' Championships', holder: 'Lewis Hamilton & Michael Schumacher', category: 'Formula 1', year: '2020', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Lewis_Hamilton_2022.jpg' },
  { id: 'gr8', title: 'Most Goals in a Calendar Year', description: 'The most goals scored in a single calendar year', holder: 'Lionel Messi', category: 'Football', year: '2012', holderImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Lionel_Messi_2018.jpg' },
];

export const onThisDayBorn: OnThisDayEntry[] = [
  { id: 'otd1', name: 'Julius Caesar', sport: 'Boxing', type: 'born', year: '1985', description: 'Heavyweight boxing champion who unified the division' },
  { id: 'otd2', name: 'Marta Vieira da Silva', sport: 'Football', type: 'born', year: '1986', description: 'Brazilian football legend, 6x World Player of the Year' },
  { id: 'otd3', name: 'Roger Federer', sport: 'Tennis', type: 'born', year: '1981', description: 'Swiss tennis maestro, 20 Grand Slam titles' },
  { id: 'otd4', name: 'LeBron James', sport: 'Basketball', type: 'born', year: '1984', description: 'NBA all-time leading scorer and 4x champion' },
  { id: 'otd5', name: 'MS Dhoni', sport: 'Cricket', type: 'born', year: '1981', description: 'Indian cricket legend, World Cup winning captain' },
];

export const onThisDayDied: OnThisDayEntry[] = [
  { id: 'otd6', name: 'Muhammad Ali', sport: 'Boxing', type: 'died', year: '2016', description: 'The Greatest, cultural icon and humanitarian' },
  { id: 'otd7', name: 'Kobe Bryant', sport: 'Basketball', type: 'died', year: '2020', description: 'NBA legend, 5x champion, Mamba mentality' },
  { id: 'otd8', name: 'Diego Maradona', sport: 'Football', type: 'died', year: '2020', description: 'Argentinian football genius, World Cup winner' },
  { id: 'otd9', name: 'Pelé', sport: 'Football', type: 'died', year: '2022', description: 'The King of Football, 3x World Cup winner' },
];

// --- CRICKET DATA ---
export const cricketMatches: Match[] = [
  { id: 'cm1', sport: 'cricket', status: 'live', homeTeam: 'India', awayTeam: 'Australia', homeScore: '245/4', awayScore: '189/6', time: '38.2 overs', date: '2026-07-03', venue: 'Lord\'s', broadcast: 'Star Sports, Hotstar', league: 'World Test Championship' },
  { id: 'cm2', sport: 'cricket', status: 'live', homeTeam: 'Mumbai Indians', awayTeam: 'Chennai Super Kings', homeScore: '178/5', awayScore: '145/3', time: '16.4 overs', date: '2026-07-03', venue: 'Wankhede Stadium', broadcast: 'Disney+ Hotstar', league: 'IPL 2026' },
  { id: 'cm3', sport: 'cricket', status: 'upcoming', homeTeam: 'Pakistan', awayTeam: 'England', time: '10:00', date: '2026-07-04', venue: 'Gaddafi Stadium', broadcast: 'PTV Sports', league: 'Test Series' },
  { id: 'cm4', sport: 'cricket', status: 'upcoming', homeTeam: 'New Zealand', awayTeam: 'South Africa', time: '14:00', date: '2026-07-05', venue: 'Basin Reserve', broadcast: 'Sky Sport NZ', league: 'ODI Series' },
  { id: 'cm5', sport: 'cricket', status: 'upcoming', homeTeam: 'West Indies', awayTeam: 'Sri Lanka', time: '09:30', date: '2026-07-06', venue: 'Kensington Oval', broadcast: 'ESPN Caribbean', league: 'T20 Series' },
  { id: 'cm6', sport: 'cricket', status: 'finished', homeTeam: 'Bangladesh', awayTeam: 'Afghanistan', homeScore: '312/8', awayScore: '289/all out', time: 'Completed', date: '2026-07-02', venue: 'Sher-e-Bangla Stadium', broadcast: 'Gazi TV', league: 'BPL 2026' },
  { id: 'cm7', sport: 'cricket', status: 'finished', homeTeam: 'Australia', awayTeam: 'India', homeScore: '456/10', awayScore: '234/2', time: 'Stumps Day 3', date: '2026-07-02', venue: 'MCG', broadcast: 'Fox Sports', league: 'Border-Gavaskar Trophy' },
  { id: 'cm8', sport: 'cricket', status: 'finished', homeTeam: 'RCB', awayTeam: 'KKR', homeScore: '185/7', awayScore: '188/4', time: 'Completed', date: '2026-07-01', venue: 'Chinnaswamy', broadcast: 'Star Sports', league: 'IPL 2026' },
];

export const cricketSeries: CricketSeries[] = [
  { id: 'cs1', name: 'World Test Championship 2025-27', type: 'Test', status: 'ongoing', startDate: '2025-06-01', endDate: '2027-06-30' },
  { id: 'cs2', name: 'IPL 2026', type: 'T20', status: 'ongoing', startDate: '2026-03-20', endDate: '2026-05-30' },
  { id: 'cs3', name: 'Asia Cup 2026', type: 'ODI', status: 'upcoming', startDate: '2026-08-01', endDate: '2026-08-30' },
  { id: 'cs4', name: 'Australia vs India Test Series', type: 'Test', status: 'ongoing', startDate: '2026-06-15', endDate: '2026-07-15' },
  { id: 'cs5', name: 'BPL 2026', type: 'T20', status: 'completed', startDate: '2026-01-10', endDate: '2026-03-01' },
  { id: 'cs6', name: 'Pakistan vs England T20 Series', type: 'T20', status: 'upcoming', startDate: '2026-07-10', endDate: '2026-07-25' },
];

export const topRunScorers: CricketStats[] = [
  { player: 'Virat Kohli', team: 'India', runs: 25896 },
  { player: 'Sachin Tendulkar', team: 'India', runs: 34357 },
  { player: 'Ricky Ponting', team: 'Australia', runs: 27483 },
  { player: 'Kumar Sangakkara', team: 'Sri Lanka', runs: 28016 },
  { player: 'Jacques Kallis', team: 'South Africa', runs: 25534 },
  { player: 'Rohit Sharma', team: 'India', runs: 21032 },
  { player: 'Brian Lara', team: 'West Indies', runs: 22358 },
  { player: 'Steve Smith', team: 'Australia', runs: 15689 },
  { player: 'Joe Root', team: 'England', runs: 18234 },
  { player: 'Kane Williamson', team: 'New Zealand', runs: 16534 },
];

export const topWicketTakers: CricketStats[] = [
  { player: 'Muttiah Muralitharan', team: 'Sri Lanka', wickets: 1347 },
  { player: 'Shane Warne', team: 'Australia', wickets: 1001 },
  { player: 'James Anderson', team: 'England', wickets: 987 },
  { player: 'Anil Kumble', team: 'India', wickets: 956 },
  { player: 'Glenn McGrath', team: 'Australia', wickets: 949 },
  { player: 'Courtney Walsh', team: 'West Indies', wickets: 819 },
  { player: 'Wasim Akram', team: 'Pakistan', wickets: 916 },
  { player: 'Dale Steyn', team: 'South Africa', wickets: 699 },
  { player: 'Ravichandran Ashwin', team: 'India', wickets: 745 },
  { player: 'Nathan Lyon', team: 'Australia', wickets: 623 },
];

export const mostHundreds: CricketStats[] = [
  { player: 'Sachin Tendulkar', team: 'India', hundreds: 100 },
  { player: 'Virat Kohli', team: 'India', hundreds: 81 },
  { player: 'Ricky Ponting', team: 'Australia', hundreds: 71 },
  { player: 'Kumar Sangakkara', team: 'Sri Lanka', hundreds: 63 },
  { player: 'Jacques Kallis', team: 'South Africa', hundreds: 62 },
  { player: 'Rohit Sharma', team: 'India', hundreds: 49 },
  { player: 'Brian Lara', team: 'West Indies', hundreds: 53 },
  { player: 'Hashim Amla', team: 'South Africa', hundreds: 55 },
  { player: 'Mahela Jayawardene', team: 'Sri Lanka', hundreds: 54 },
  { player: 'Steve Smith', team: 'Australia', hundreds: 44 },
];

export const iccRankings: CricketRanking[] = [
  { category: 'Test Batting', rank: 1, player: 'Steve Smith', team: 'Australia', rating: 912 },
  { category: 'Test Batting', rank: 2, player: 'Joe Root', team: 'England', rating: 897 },
  { category: 'Test Batting', rank: 3, player: 'Kane Williamson', team: 'New Zealand', rating: 883 },
  { category: 'Test Bowling', rank: 1, player: 'Pat Cummins', team: 'Australia', rating: 898 },
  { category: 'Test Bowling', rank: 2, player: 'Ravichandran Ashwin', team: 'India', rating: 856 },
  { category: 'Test Bowling', rank: 3, player: 'Kagiso Rabada', team: 'South Africa', rating: 842 },
  { category: 'ODI Batting', rank: 1, player: 'Virat Kohli', team: 'India', rating: 875 },
  { category: 'ODI Batting', rank: 2, player: 'Babar Azam', team: 'Pakistan', rating: 868 },
  { category: 'ODI Batting', rank: 3, player: 'Rohit Sharma', team: 'India', rating: 845 },
  { category: 'T20 Batting', rank: 1, player: 'Suryakumar Yadav', team: 'India', rating: 910 },
];

export const teamRankings: CricketRanking[] = [
  { category: 'Test', rank: 1, player: 'Australia', team: 'Australia', rating: 128 },
  { category: 'Test', rank: 2, player: 'India', team: 'India', rating: 120 },
  { category: 'Test', rank: 3, player: 'England', team: 'England', rating: 115 },
  { category: 'Test', rank: 4, player: 'South Africa', team: 'South Africa', rating: 108 },
  { category: 'ODI', rank: 1, player: 'India', team: 'India', rating: 125 },
  { category: 'ODI', rank: 2, player: 'Australia', team: 'Australia', rating: 118 },
  { category: 'ODI', rank: 3, player: 'Pakistan', team: 'Pakistan', rating: 112 },
  { category: 'T20', rank: 1, player: 'India', team: 'India', rating: 132 },
  { category: 'T20', rank: 2, player: 'England', team: 'England', rating: 126 },
  { category: 'T20', rank: 3, player: 'New Zealand', team: 'New Zealand', rating: 118 },
];

export const richestCricketers: Athlete[] = [
  { id: 'rc1', name: 'Sachin Tendulkar', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 1, value: '$800M', nationality: 'India' },
  { id: 'rc2', name: 'Virat Kohli', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 2, value: '$750M', nationality: 'India' },
  { id: 'rc3', name: 'MS Dhoni', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 3, value: '$500M', nationality: 'India' },
  { id: 'rc4', name: 'Rohit Sharma', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 4, value: '$300M', nationality: 'India' },
  { id: 'rc5', name: 'Ricky Ponting', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 5, value: '$250M', nationality: 'Australia' },
  { id: 'rc6', name: 'Shane Warne', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 6, value: '$200M', nationality: 'Australia' },
  { id: 'rc7', name: 'Brian Lara', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 7, value: '$180M', nationality: 'West Indies' },
  { id: 'rc8', name: 'Ben Stokes', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 8, value: '$150M', nationality: 'England' },
  { id: 'rc9', name: 'Pat Cummins', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 9, value: '$140M', nationality: 'Australia' },
  { id: 'rc10', name: 'Babar Azam', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 10, value: '$120M', nationality: 'Pakistan' },
];

export const cricketersBornToday: OnThisDayEntry[] = [
  { id: 'cbt1', name: 'MS Dhoni', sport: 'Cricket', type: 'born', year: '1981', description: 'Legendary Indian captain, World Cup winner' },
  { id: 'cbt2', name: 'Brian Lara', sport: 'Cricket', type: 'born', year: '1969', description: 'West Indies batting maestro, record holder' },
  { id: 'cbt3', name: 'Wasim Akram', sport: 'Cricket', type: 'born', year: '1966', description: 'Sultan of Swing, Pakistan pace legend' },
  { id: 'cbt4', name: 'Rahul Dravid', sport: 'Cricket', type: 'born', year: '1973', description: 'The Wall of Indian cricket' },
  { id: 'cbt5', name: 'Jacques Kallis', sport: 'Cricket', type: 'born', year: '1975', description: 'South Africa\'s greatest all-rounder' },
];

export const cricketersDiedToday: OnThisDayEntry[] = [
  { id: 'cdt1', name: 'Malcolm Marshall', sport: 'Cricket', type: 'died', year: '1999', description: 'West Indies fast bowling legend' },
  { id: 'cdt2', name: 'Keith Miller', sport: 'Cricket', type: 'died', year: '2004', description: 'Australian all-rounder and WWII hero' },
];

export const cricketNews: NewsArticle[] = [
  { id: 'cn1', title: 'Virat Kohli Scores Historic 81st Century', excerpt: 'The Indian maestro surpasses Sachin Tendulkar\'s record for most international centuries.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', category: 'Cricket', date: '2026-07-03', author: 'Priya Sharma', readTime: '5 min read', featured: true, trending: true },
  { id: 'cn2', title: 'Bumrah Named Vice-Captain for WTC Final', excerpt: 'India\'s pace spearhead gets leadership role for the crucial World Test Championship final.', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', category: 'Cricket', date: '2026-07-03', author: 'Rajesh Kumar', readTime: '3 min read', featured: false, trending: true },
  { id: 'cn3', title: 'IPL 2026 Auction: Mega Changes Ahead', excerpt: 'Two new teams to be added for the 2027 season, mega auction likely in December.', image: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=600', category: 'Cricket', date: '2026-07-02', author: 'Ananya Gupta', readTime: '6 min read', featured: false, trending: false },
  { id: 'cn4', title: 'Stokes Returns to Full Fitness', excerpt: 'England\'s star all-rounder declares himself fully fit ahead of the Pakistan series.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', category: 'Cricket', date: '2026-07-02', author: 'James Taylor', readTime: '3 min read', featured: false, trending: false },
  { id: 'cn5', title: 'Shaheen Afridi Cleared for Return', excerpt: 'Pakistan\'s left-arm pacer has been cleared by medical staff after a knee injury.', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', category: 'Cricket', date: '2026-07-01', author: 'Hassan Ali', readTime: '4 min read', featured: false, trending: true },
  { id: 'cn6', title: 'BPL 2026: Top 5 Highest Run Scorers', excerpt: 'The Bangladesh Premier League has seen some incredible batting performances this season.', image: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=600', category: 'Cricket', date: '2026-07-01', author: 'Shahid Rahman', readTime: '5 min read', featured: false, trending: false },
];

export const cricketInjuries: InjuryReport[] = [
  { id: 'ci1', player: 'Jasprit Bumrah', team: 'India', injury: 'Back Spasm', returnDate: '2026-07-10', status: 'day-to-day' },
  { id: 'ci2', player: 'Ben Stokes', team: 'England', injury: 'Knee', returnDate: '2026-07-15', status: 'injured' },
  { id: 'ci3', player: 'Mitchell Starc', team: 'Australia', injury: 'Finger Fracture', returnDate: '2026-08-01', status: 'out' },
  { id: 'ci4', player: 'Shaheen Afridi', team: 'Pakistan', injury: 'Knee', returnDate: '2026-07-05', status: 'day-to-day' },
  { id: 'ci5', player: 'Kane Williamson', team: 'New Zealand', injury: 'Elbow', returnDate: '2026-07-20', status: 'injured' },
];

export const iplAuctionTracker: TransferNews[] = [
  { id: 'ipl1', player: 'Jos Buttler', from: 'Rajasthan Royals', to: 'Mumbai Indians', fee: '₹18.5 Cr', status: 'completed', date: '2026-06-15' },
  { id: 'ipl2', player: 'Rashid Khan', from: 'Gujarat Titans', to: 'SRH', fee: '₹16 Cr', status: 'completed', date: '2026-06-14' },
  { id: 'ipl3', player: 'KL Rahul', from: 'LSG', to: 'RCB', fee: '₹15 Cr', status: 'completed', date: '2026-06-13' },
  { id: 'ipl4', player: 'Sam Curran', from: 'PBKS', to: 'CSK', fee: '₹12 Cr', status: 'rumored', date: '2026-06-20' },
  { id: 'ipl5', player: 'Shreyas Iyer', from: 'KKR', to: 'DC', fee: '₹14 Cr', status: 'pending', date: '2026-07-01' },
];

export const predictionPolls: Record<string, PredictionPoll> = {
  cricket: {
    id: 'pp-cricket',
    question: 'Who will win the World Test Championship 2025-27?',
    options: ['India', 'Australia', 'England', 'South Africa'],
    votes: [45, 30, 15, 10],
    totalVotes: 12500,
  },
  global: {
    id: 'pp-global',
    question: 'Which country will top the 2028 Olympics medal table?',
    options: ['USA', 'China', 'Japan', 'Great Britain'],
    votes: [40, 35, 15, 10],
    totalVotes: 8900,
  },
};

export type Gender = 'men' | 'women';

export const womensPredictionPolls: Record<string, PredictionPoll> = {
  cricket: {
    id: 'wpp-cricket',
    question: 'Who will win the Women\'s T20 World Cup 2026?',
    options: ['Australia Women', 'India Women', 'England Women', 'South Africa Women'],
    votes: [35, 30, 20, 15],
    totalVotes: 9800,
  },
};

export const womensCricketMatches: Match[] = [
  { id: 'wcm1', sport: 'cricket', status: 'live', homeTeam: 'Australia Women', awayTeam: 'England Women', homeScore: '185/3', awayScore: '142/5', time: '32.4 overs', date: '2026-07-03', venue: 'MCG', broadcast: 'Star Sports', league: 'Ashes' },
  { id: 'wcm2', sport: 'cricket', status: 'live', homeTeam: 'India Women', awayTeam: 'South Africa Women', homeScore: '210/6', awayScore: '178/4', time: '28.2 overs', date: '2026-07-03', venue: 'Wankhede', broadcast: 'Hotstar', league: 'WODI Series' },
  { id: 'wcm3', sport: 'cricket', status: 'upcoming', homeTeam: 'New Zealand Women', awayTeam: 'West Indies Women', time: '10:00', date: '2026-07-04', venue: 'Basin Reserve', broadcast: 'Sky Sport NZ', league: 'WT20 Series' },
  { id: 'wcm4', sport: 'cricket', status: 'upcoming', homeTeam: 'Pakistan Women', awayTeam: 'Sri Lanka Women', time: '14:00', date: '2026-07-05', venue: 'Gaddafi Stadium', broadcast: 'PTV Sports', league: 'WODI Series' },
  { id: 'wcm5', sport: 'cricket', status: 'finished', homeTeam: 'India Women', awayTeam: 'Australia Women', homeScore: '245/8', awayScore: '248/4', time: 'Completed', date: '2026-07-02', venue: 'Chinnaswamy', broadcast: 'Star Sports', league: 'T20 World Cup' },
  { id: 'wcm6', sport: 'cricket', status: 'finished', homeTeam: 'England Women', awayTeam: 'India Women', homeScore: '312/6', awayScore: '289/9', time: 'Completed', date: '2026-07-01', venue: 'Lord\'s', broadcast: 'BBC Sport', league: 'Ashes' },
];

export const womensCricketSeries: CricketSeries[] = [
  { id: 'wcs1', name: 'Women\'s Ashes 2026', type: 'Multi-Format', status: 'ongoing', startDate: '2026-06-20', endDate: '2026-07-20' },
  { id: 'wcs2', name: 'WODI World Cup 2027', type: 'ODI', status: 'upcoming', startDate: '2027-02-01', endDate: '2027-03-15' },
  { id: 'wcs3', name: 'India Women vs South Africa Women', type: 'ODI', status: 'ongoing', startDate: '2026-06-28', endDate: '2026-07-08' },
  { id: 'wcs4', name: 'T20 World Cup 2026', type: 'T20', status: 'completed', startDate: '2026-02-10', endDate: '2026-02-28' },
];

export const womensCricketNews: NewsArticle[] = [
  { id: 'wcn1', title: 'Smriti Mandhana Scores Record 7th ODI Century', excerpt: 'The Indian opener continues her stellar form with a magnificent century against South Africa.', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', category: 'Cricket', date: '2026-07-03', author: 'Priya Sharma', readTime: '4 min read', featured: true, trending: true },
  { id: 'wcn2', title: 'Ellyse Perry Announces WBBL Return', excerpt: 'The Australian all-rounder will play for Sydney Sixers in the upcoming WBBL season.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', category: 'Cricket', date: '2026-07-02', author: 'Sarah Johnson', readTime: '3 min read', featured: false, trending: true },
  { id: 'wcn3', title: 'England Women Fight Back in Lord\'s Test', excerpt: 'England Women stage a remarkable comeback on Day 3 of the Ashes Test match at Lord\'s.', image: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=600', category: 'Cricket', date: '2026-07-02', author: 'Emma Williams', readTime: '5 min read', featured: false, trending: false },
  { id: 'wcn4', title: 'Harmanpreet Kaur Leads from the Front', excerpt: 'The Indian captain scores a match-winning half-century in the WODI series against South Africa.', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', category: 'Cricket', date: '2026-07-01', author: 'Rajesh Kumar', readTime: '3 min read', featured: false, trending: false },
];

export const womensTopRunScorers: CricketStats[] = [
  { player: 'Mithali Raj', team: 'India', runs: 10868 },
  { player: 'Charlotte Edwards', team: 'England', runs: 9592 },
  { player: 'Smriti Mandhana', team: 'India', runs: 8526 },
  { player: 'Ellyse Perry', team: 'Australia', runs: 7894 },
  { player: 'Suzie Bates', team: 'New Zealand', runs: 7652 },
  { player: 'Sarah Taylor', team: 'England', runs: 7256 },
  { player: 'Meg Lanning', team: 'Australia', runs: 6895 },
  { player: 'Harmanpreet Kaur', team: 'India', runs: 6542 },
  { player: 'Stafanie Taylor', team: 'West Indies', runs: 6235 },
  { player: 'Alyssa Healy', team: 'Australia', runs: 5896 },
];

export const womensTopWicketTakers: CricketStats[] = [
  { player: 'Jhulan Goswami', team: 'India', wickets: 445 },
  { player: 'Catherine Fitzpatrick', team: 'Australia', wickets: 368 },
  { player: 'Anya Shrubsole', team: 'England', wickets: 342 },
  { player: 'Katherine Brunt', team: 'England', wickets: 335 },
  { player: 'Ellyse Perry', team: 'Australia', wickets: 318 },
  { player: 'Shabnim Ismail', team: 'South Africa', wickets: 305 },
  { player: 'Megan Schutt', team: 'Australia', wickets: 298 },
  { player: 'Poonam Yadav', team: 'India', wickets: 285 },
  { player: 'Deepti Sharma', team: 'India', wickets: 272 },
  { player: 'Sophie Ecclestone', team: 'England', wickets: 265 },
];

export const womensMostHundreds: CricketStats[] = [
  { player: 'Mithali Raj', team: 'India', hundreds: 32 },
  { player: 'Charlotte Edwards', team: 'England', hundreds: 28 },
  { player: 'Smriti Mandhana', team: 'India', hundreds: 24 },
  { player: 'Meg Lanning', team: 'Australia', hundreds: 22 },
  { player: 'Ellyse Perry', team: 'Australia', hundreds: 18 },
  { player: 'Suzie Bates', team: 'New Zealand', hundreds: 17 },
  { player: 'Harmanpreet Kaur', team: 'India', hundreds: 15 },
  { player: 'Alyssa Healy', team: 'Australia', hundreds: 14 },
  { player: 'Sarah Taylor', team: 'England', hundreds: 12 },
  { player: 'Stafanie Taylor', team: 'West Indies', hundreds: 11 },
];

export const womensIccRankings: CricketRanking[] = [
  { category: 'ODI Batting', rank: 1, player: 'Smriti Mandhana', team: 'India', rating: 878 },
  { category: 'ODI Batting', rank: 2, player: 'Ellyse Perry', team: 'Australia', rating: 865 },
  { category: 'ODI Batting', rank: 3, player: 'Meg Lanning', team: 'Australia', rating: 852 },
  { category: 'ODI Bowling', rank: 1, player: 'Sophie Ecclestone', team: 'England', rating: 834 },
  { category: 'ODI Bowling', rank: 2, player: 'Shabnim Ismail', team: 'South Africa', rating: 818 },
  { category: 'ODI Bowling', rank: 3, player: 'Megan Schutt', team: 'Australia', rating: 805 },
  { category: 'T20 Batting', rank: 1, player: 'Smriti Mandhana', team: 'India', rating: 892 },
  { category: 'T20 Batting', rank: 2, player: 'Alyssa Healy', team: 'Australia', rating: 875 },
  { category: 'T20 Batting', rank: 3, player: 'Beth Mooney', team: 'Australia', rating: 862 },
  { category: 'T20 Bowling', rank: 1, player: 'Sophie Ecclestone', team: 'England', rating: 856 },
];

export const womensTeamRankings: CricketRanking[] = [
  { category: 'ODI', rank: 1, player: 'Australia', team: 'Australia', rating: 132 },
  { category: 'ODI', rank: 2, player: 'India', team: 'India', rating: 125 },
  { category: 'ODI', rank: 3, player: 'England', team: 'England', rating: 118 },
  { category: 'T20', rank: 1, player: 'Australia', team: 'Australia', rating: 138 },
  { category: 'T20', rank: 2, player: 'India', team: 'India', rating: 130 },
  { category: 'T20', rank: 3, player: 'England', team: 'England', rating: 124 },
];

export const womensRichestCricketers: Athlete[] = [
  { id: 'wrc1', name: 'Smriti Mandhana', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 1, value: '$12M', nationality: 'India' },
  { id: 'wrc2', name: 'Ellyse Perry', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 2, value: '$10M', nationality: 'Australia' },
  { id: 'wrc3', name: 'Harmanpreet Kaur', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 3, value: '$8M', nationality: 'India' },
  { id: 'wrc4', name: 'Meg Lanning', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 4, value: '$7.5M', nationality: 'Australia' },
  { id: 'wrc5', name: 'Alyssa Healy', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 5, value: '$6M', nationality: 'Australia' },
  { id: 'wrc6', name: 'Sophie Ecclestone', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 6, value: '$5.5M', nationality: 'England' },
  { id: 'wrc7', name: 'Deepti Sharma', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 7, value: '$5M', nationality: 'India' },
  { id: 'wrc8', name: 'Shafali Verma', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 8, value: '$4.5M', nationality: 'India' },
  { id: 'wrc9', name: 'Beth Mooney', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 9, value: '$4M', nationality: 'Australia' },
  { id: 'wrc10', name: 'Nat Sciver-Brunt', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 10, value: '$3.8M', nationality: 'England' },
];

export const womensCricketInjuries: InjuryReport[] = [
  { id: 'wci1', player: 'Sophie Ecclestone', team: 'England', injury: 'Shoulder Strain', returnDate: '2026-07-15', status: 'injured' },
  { id: 'wci2', player: 'Shafali Verma', team: 'India', injury: 'Hamstring', returnDate: '2026-07-10', status: 'day-to-day' },
  { id: 'wci3', player: 'Megan Schutt', team: 'Australia', injury: 'Knee', returnDate: '2026-08-01', status: 'out' },
  { id: 'wci4', player: 'Stafanie Taylor', team: 'West Indies', injury: 'Back Spasm', returnDate: '2026-07-20', status: 'injured' },
  { id: 'wci5', player: 'Alyssa Healy', team: 'Australia', injury: 'Finger Fracture', returnDate: '2026-07-25', status: 'injured' },
];

export const womensCricketersBornToday: OnThisDayEntry[] = [
  { id: 'wcbt1', name: 'Mithali Raj', sport: 'Cricket', type: 'born', year: '1982', description: 'Indian legend, highest run scorer in women\'s international cricket' },
  { id: 'wcbt2', name: 'Ellyse Perry', sport: 'Cricket', type: 'born', year: '1990', description: 'Australian dual sport star, cricket and football icon' },
  { id: 'wcbt3', name: 'Sarah Taylor', sport: 'Cricket', type: 'born', year: '1989', description: 'English wicketkeeper-batter, pioneer of the game' },
  { id: 'wcbt4', name: 'Stafanie Taylor', sport: 'Cricket', type: 'born', year: '1991', description: 'West Indies captain, all-round extraordinaire' },
  { id: 'wcbt5', name: 'Suzie Bates', sport: 'Cricket', type: 'born', year: '1987', description: 'New Zealand cricket and basketball international' },
];

export const womensCricketersDiedToday: OnThisDayEntry[] = [
  { id: 'wcdt1', name: 'Betty Wilson', sport: 'Cricket', type: 'died', year: '2010', description: 'Australian women\'s cricketing pioneer' },
  { id: 'wcdt2', name: 'Rachael Heyhoe-Flint', sport: 'Cricket', type: 'died', year: '2017', description: 'England captain, women\'s cricket trailblazer' },
];

export const womensFantasyXI = [
  { name: 'Smriti Mandhana', role: 'Batsman', points: 485, team: 'India' },
  { name: 'Alyssa Healy', role: 'Wicketkeeper', points: 472, team: 'Australia' },
  { name: 'Meg Lanning', role: 'Batsman', points: 468, team: 'Australia' },
  { name: 'Ellyse Perry', role: 'All-Rounder', points: 498, team: 'Australia' },
  { name: 'Harmanpreet Kaur', role: 'Batsman', points: 452, team: 'India' },
  { name: 'Nat Sciver-Brunt', role: 'All-Rounder', points: 445, team: 'England' },
  { name: 'Sophie Ecclestone', role: 'Bowler', points: 438, team: 'England' },
  { name: 'Deepti Sharma', role: 'All-Rounder', points: 425, team: 'India' },
  { name: 'Shabnim Ismail', role: 'Bowler', points: 418, team: 'South Africa' },
  { name: 'Poonam Yadav', role: 'Bowler', points: 405, team: 'India' },
  { name: 'Beth Mooney', role: 'Batsman', points: 432, team: 'Australia' },
];

export const beautifulCricketers = [
  { id: 'bc1', name: 'Smriti Mandhana', country: 'India', role: 'Opening Batter', team: 'India Women', bio: 'India\'s batting sensation known for her elegant strokeplay and consistency across all formats. A role model for millions of aspiring cricketers.', photo: 'SM' },
  { id: 'bc2', name: 'Ellyse Perry', country: 'Australia', role: 'All-Rounder', team: 'Australia Women', bio: 'One of the greatest female athletes of all time, representing Australia in both cricket and football. Known for her athleticism and grace.', photo: 'EP' },
  { id: 'bc3', name: 'Harmanpreet Kaur', country: 'India', role: 'Captain & Batter', team: 'India Women', bio: 'The iconic Indian captain who led her team to T20 World Cup glory. Known for her powerful hitting and leadership.', photo: 'HK' },
  { id: 'bc4', name: 'Meg Lanning', country: 'Australia', role: 'Captain & Batter', team: 'Australia Women', bio: 'Australia\'s most successful captain with multiple World Cup titles. A master tactician and elegant batter.', photo: 'ML' },
  { id: 'bc5', name: 'Alyssa Healy', country: 'Australia', role: 'Wicketkeeper-Batter', team: 'Australia Women', bio: 'Explosive wicketkeeper-batter who holds the record for the most runs in a Women\'s T20 World Cup final.', photo: 'AH' },
  { id: 'bc6', name: 'Shafali Verma', country: 'India', role: 'Opening Batter', team: 'India Women', bio: 'The young Indian prodigy who took the cricketing world by storm with her aggressive batting at just 16.', photo: 'SV' },
];

// ── WOMEN'S FOOTBALL ──
export const womensFootballMatches: Match[] = [
  { id: 'wfm1', sport: 'football', status: 'live', homeTeam: 'USA Women', awayTeam: 'England Women', homeScore: '2', awayScore: '1', time: '72\'', date: '2026-07-03', venue: 'Rose Bowl', broadcast: 'ESPN, BBC', league: 'WC Qualifier' },
  { id: 'wfm2', sport: 'football', status: 'live', homeTeam: 'Spain Women', awayTeam: 'France Women', homeScore: '1', awayScore: '0', time: '55\'', date: '2026-07-03', venue: 'Camp Nou', broadcast: 'DAZN', league: 'UEFA Nations League' },
  { id: 'wfm3', sport: 'football', status: 'upcoming', homeTeam: 'Brazil Women', awayTeam: 'Germany Women', time: '20:00', date: '2026-07-03', venue: 'Maracanã', broadcast: 'Globo', league: 'Friendly' },
  { id: 'wfm4', sport: 'football', status: 'upcoming', homeTeam: 'Australia Women', awayTeam: 'Japan Women', time: '19:00', date: '2026-07-04', venue: 'Stadium Australia', broadcast: 'Optus Sport', league: 'Asian Cup' },
  { id: 'wfm5', sport: 'football', status: 'finished', homeTeam: 'Netherlands Women', awayTeam: 'Sweden Women', homeScore: '3', awayScore: '1', time: 'FT', date: '2026-07-02', venue: 'Johan Cruyff Arena', broadcast: 'NPO 1', league: 'UEFA Nations League' },
  { id: 'wfm6', sport: 'football', status: 'finished', homeTeam: 'Canada Women', awayTeam: 'Norway Women', homeScore: '2', awayScore: '2', time: 'FT', date: '2026-07-01', venue: 'BC Place', broadcast: 'CBC', league: 'Friendly' },
];

export const womensRunningLeagues: CricketSeries[] = [
  { id: 'wfl1', name: 'Women\'s Super League 2026', type: 'Domestic', status: 'ongoing', startDate: '2026-06-15', endDate: '2026-09-15' },
  { id: 'wfl2', name: 'UEFA Women\'s Nations League', type: 'Continental', status: 'ongoing', startDate: '2026-05-01', endDate: '2026-08-30' },
  { id: 'wfl3', name: 'NWSL 2026', type: 'Domestic', status: 'ongoing', startDate: '2026-04-01', endDate: '2026-10-30' },
  { id: 'wfl4', name: 'Women\'s World Cup 2027', type: 'International', status: 'upcoming', startDate: '2027-06-10', endDate: '2027-07-20' },
  { id: 'wfl5', name: 'Liga F 2026-27', type: 'Domestic', status: 'upcoming', startDate: '2026-09-01', endDate: '2027-05-30' },
  { id: 'wfl6', name: 'Barclays WSL 2026-27', type: 'Domestic', status: 'upcoming', startDate: '2026-09-10', endDate: '2027-05-25' },
];

export const womensFootballNews: NewsArticle[] = [
  { id: 'wfn1', title: 'USA Women Dominate England in World Cup Qualifier', excerpt: 'The US Women\'s National Team puts on a masterclass performance against England at the Rose Bowl.', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600', category: 'Football', date: '2026-07-03', author: 'Megan Thompson', readTime: '5 min read', featured: true, trending: true },
  { id: 'wfn2', title: 'Alex Morgan Announces Retirement', excerpt: 'The legendary US striker will hang up her boots at the end of the NWSL season.', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600', category: 'Football', date: '2026-07-02', author: 'Sarah Johnson', readTime: '4 min read', featured: false, trending: true },
  { id: 'wfn3', title: 'Spain Women Win UEFA Nations League', excerpt: 'Spain\'s women\'s team continues their dominance with a Nations League title victory.', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600', category: 'Football', date: '2026-07-01', author: 'Carlos Mendez', readTime: '3 min read', featured: false, trending: false },
  { id: 'wfn4', title: 'Barcelona Femení Complete Historic Treble', excerpt: 'The Catalan giants dominate European women\'s football winning all three major trophies.', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600', category: 'Football', date: '2026-06-30', author: 'Alex Turner', readTime: '6 min read', featured: false, trending: true },
];

export const womensTopGoalScorers: FootballStats[] = [
  { player: 'Christine Sinclair', team: 'Portland Thorns', league: 'International', goals: 524 },
  { player: 'Marta', team: 'Orlando Pride', league: 'International', goals: 489 },
  { player: 'Abby Wambach', team: 'Retired', league: 'International', goals: 478 },
  { player: 'Carli Lloyd', team: 'Retired', league: 'International', goals: 456 },
  { player: 'Alex Morgan', team: 'San Diego Wave', league: 'International', goals: 423 },
  { player: 'Sam Kerr', team: 'Chelsea Women', league: 'International', goals: 398 },
  { player: 'Vivianne Miedema', team: 'Arsenal Women', league: 'International', goals: 378 },
  { player: 'Ada Hegerberg', team: 'Lyon Féminin', league: 'International', goals: 365 },
  { player: 'Jenni Hermoso', team: 'Pachuca Women', league: 'International', goals: 342 },
  { player: 'Megan Rapinoe', team: 'OL Reign', league: 'International', goals: 335 },
];

export const womensTopAssistProviders: FootballStats[] = [
  { player: 'Megan Rapinoe', team: 'OL Reign', league: 'International', assists: 182 },
  { player: 'Marta', team: 'Orlando Pride', league: 'International', assists: 175 },
  { player: 'Carli Lloyd', team: 'Retired', league: 'International', assists: 168 },
  { player: 'Alex Morgan', team: 'San Diego Wave', league: 'International', assists: 155 },
  { player: 'Sam Kerr', team: 'Chelsea Women', league: 'International', assists: 142 },
  { player: 'Vivianne Miedema', team: 'Arsenal Women', league: 'International', assists: 138 },
  { player: 'Lindsey Horan', team: 'Lyon Féminin', league: 'International', assists: 132 },
  { player: 'Rose Lavelle', team: 'OL Reign', league: 'International', assists: 125 },
  { player: 'Lucy Bronze', team: 'Barcelona Femení', league: 'International', assists: 118 },
  { player: 'Ewa Pajor', team: 'Barcelona Femení', league: 'International', assists: 112 },
];

export const womensFifaRankings: CricketRanking[] = [
  { category: 'World', rank: 1, player: 'USA', team: 'USA', rating: 1876 },
  { category: 'World', rank: 2, player: 'Spain', team: 'Spain', rating: 1842 },
  { category: 'World', rank: 3, player: 'Germany', team: 'Germany', rating: 1825 },
  { category: 'World', rank: 4, player: 'England', team: 'England', rating: 1810 },
  { category: 'World', rank: 5, player: 'France', team: 'France', rating: 1795 },
  { category: 'World', rank: 6, player: 'Sweden', team: 'Sweden', rating: 1778 },
  { category: 'World', rank: 7, player: 'Netherlands', team: 'Netherlands', rating: 1762 },
  { category: 'World', rank: 8, player: 'Brazil', team: 'Brazil', rating: 1745 },
  { category: 'World', rank: 9, player: 'Canada', team: 'Canada', rating: 1732 },
  { category: 'World', rank: 10, player: 'Japan', team: 'Japan', rating: 1718 },
];

export const womensClubRankings: CricketRanking[] = [
  { category: 'Club', rank: 1, player: 'Lyon Féminin', team: 'France', rating: 96 },
  { category: 'Club', rank: 2, player: 'Barcelona Femení', team: 'Spain', rating: 94 },
  { category: 'Club', rank: 3, player: 'Chelsea Women', team: 'England', rating: 92 },
  { category: 'Club', rank: 4, player: 'Arsenal Women', team: 'England', rating: 90 },
  { category: 'Club', rank: 5, player: 'Wolfsburg Women', team: 'Germany', rating: 88 },
  { category: 'Club', rank: 6, player: 'Portland Thorns', team: 'USA', rating: 86 },
  { category: 'Club', rank: 7, player: 'Manchester City Women', team: 'England', rating: 85 },
  { category: 'Club', rank: 8, player: 'PSG Féminine', team: 'France', rating: 84 },
  { category: 'Club', rank: 9, player: 'OL Reign', team: 'USA', rating: 82 },
  { category: 'Club', rank: 10, player: 'San Diego Wave', team: 'USA', rating: 80 },
];

export const womensTransferMarket: TransferNews[] = [
  { id: 'wtm1', player: 'Aitana Bonmatí', from: 'Barcelona Femení', to: 'Lyon Féminin', fee: '€1.2M', status: 'completed', date: '2026-06-15' },
  { id: 'wtm2', player: 'Lauren James', from: 'Chelsea Women', to: 'Arsenal Women', fee: '€850K', status: 'completed', date: '2026-06-20' },
  { id: 'wtm3', player: 'Salma Paralluelo', from: 'Barcelona Femení', to: 'Chelsea Women', fee: '€950K', status: 'rumored', date: '2026-07-02' },
  { id: 'wtm4', player: 'Sophia Smith', from: 'Portland Thorns', to: 'Lyon Féminin', fee: '€1.1M', status: 'pending', date: '2026-07-05' },
  { id: 'wtm5', player: 'Lieke Martens', from: 'PSG Féminine', to: 'Barcelona Femení', fee: '€500K', status: 'completed', date: '2026-06-25' },
  { id: 'wtm6', player: 'Kadidiatou Diani', from: 'PSG Féminine', to: 'Lyon Féminin', fee: '€750K', status: 'completed', date: '2026-06-28' },
];

export const womensFootballInjuries: InjuryReport[] = [
  { id: 'wfi1', player: 'Sam Kerr', team: 'Chelsea Women', injury: 'ACL Recovery', returnDate: '2026-09-01', status: 'out' },
  { id: 'wfi2', player: 'Vivianne Miedema', team: 'Arsenal Women', injury: 'Knee', returnDate: '2026-07-20', status: 'injured' },
  { id: 'wfi3', player: 'Alex Morgan', team: 'San Diego Wave', injury: 'Calf Strain', returnDate: '2026-07-10', status: 'day-to-day' },
  { id: 'wfi4', player: 'Lucy Bronze', team: 'Barcelona Femení', injury: 'Hamstring', returnDate: '2026-07-25', status: 'injured' },
  { id: 'wfi5', player: 'Rose Lavelle', team: 'OL Reign', injury: 'Ankle Sprain', returnDate: '2026-08-01', status: 'injured' },
  { id: 'wfi6', player: 'Megan Rapinoe', team: 'OL Reign', injury: 'Achilles', returnDate: '2026-09-15', status: 'out' },
];

export const womensRichestFootballers: Athlete[] = [
  { id: 'wrf1', name: 'Megan Rapinoe', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 1, value: '$18M', nationality: 'USA' },
  { id: 'wrf2', name: 'Alex Morgan', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 2, value: '$15M', nationality: 'USA' },
  { id: 'wrf3', name: 'Sam Kerr', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 3, value: '$12M', nationality: 'Australia' },
  { id: 'wrf4', name: 'Ada Hegerberg', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 4, value: '$10M', nationality: 'Norway' },
  { id: 'wrf5', name: 'Carli Lloyd', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 5, value: '$9M', nationality: 'USA' },
  { id: 'wrf6', name: 'Vivianne Miedema', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 6, value: '$8M', nationality: 'Netherlands' },
  { id: 'wrf7', name: 'Marta', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 7, value: '$7.5M', nationality: 'Brazil' },
  { id: 'wrf8', name: 'Aitana Bonmatí', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 8, value: '$6.5M', nationality: 'Spain' },
  { id: 'wrf9', name: 'Lieke Martens', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 9, value: '$5.5M', nationality: 'Netherlands' },
  { id: 'wrf10', name: 'Christine Sinclair', sport: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200', rank: 10, value: '$5M', nationality: 'Canada' },
];

export const womensFootballPlayersBornToday: OnThisDayEntry[] = [
  { id: 'wfbt1', name: 'Marta', sport: 'Football', type: 'born', year: '1986', description: 'Brazilian icon, 6x FIFA World Player of the Year' },
  { id: 'wfbt2', name: 'Alex Morgan', sport: 'Football', type: 'born', year: '1989', description: 'US superstar, World Cup winner and Olympic gold medalist' },
  { id: 'wfbt3', name: 'Sam Kerr', sport: 'Football', type: 'born', year: '1993', description: 'Australian captain, goal-scoring machine' },
  { id: 'wfbt4', name: 'Ada Hegerberg', sport: 'Football', type: 'born', year: '1995', description: 'First women\'s Ballon d\'Or winner, Lyon legend' },
  { id: 'wfbt5', name: 'Vivianne Miedema', sport: 'Football', type: 'born', year: '1996', description: 'Dutch striker, WSL all-time leading scorer' },
];

export const womensFootballPlayersDiedToday: OnThisDayEntry[] = [
  { id: 'wfdt1', name: 'Lena Videkull', sport: 'Football', type: 'died', year: '2022', description: 'Swedish football pioneer' },
];

export const beautifulFootballers = [
  { id: 'bf1', name: 'Alex Morgan', country: 'USA', role: 'Striker', team: 'San Diego Wave', bio: 'American football icon, World Cup champion, Olympic gold medalist, and advocate for gender equality in sports.', photo: 'AM' },
  { id: 'bf2', name: 'Sam Kerr', country: 'Australia', role: 'Striker', team: 'Chelsea Women', bio: 'Australian captain and one of the most prolific goal-scorers in world football.', photo: 'SK' },
  { id: 'bf3', name: 'Megan Rapinoe', country: 'USA', role: 'Winger', team: 'OL Reign', bio: 'World Cup winner, Ballon d\'Or recipient, and one of the most recognizable faces in women\'s football globally.', photo: 'MR' },
  { id: 'bf4', name: 'Marta', country: 'Brazil', role: 'Forward', team: 'Orlando Pride', bio: 'The Queen of Football, 6x FIFA World Player of the Year, and all-time leading goal-scorer in World Cup history.', photo: 'MA' },
  { id: 'bf5', name: 'Aitana Bonmatí', country: 'Spain', role: 'Midfielder', team: 'Barcelona Femení', bio: 'Spanish midfield maestro, World Cup and Champions League winner. Known for her vision and technique.', photo: 'AB' },
  { id: 'bf6', name: 'Vivianne Miedema', country: 'Netherlands', role: 'Striker', team: 'Arsenal Women', bio: 'Dutch goal-scoring phenomenon, WSL all-time leading scorer, and Euro 2017 winner.', photo: 'VM' },
];

export const iccRankingsFull: ICCRankingEntry[] = [
  // ── TEST BATTERS ──
  { rank: 1, player: 'Joe Root', photo: 'JR', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 912, change: 'up', careerBest: 933, format: 'test', category: 'batters' },
  { rank: 2, player: 'Steve Smith', photo: 'SS', country: 'Australia', flag: '🇦🇺', rating: 898, change: 'same', careerBest: 947, format: 'test', category: 'batters' },
  { rank: 3, player: 'Kane Williamson', photo: 'KW', country: 'New Zealand', flag: '🇳🇿', rating: 883, change: 'down', careerBest: 919, format: 'test', category: 'batters' },
  { rank: 4, player: 'Virat Kohli', photo: 'VK', country: 'India', flag: '🇮🇳', rating: 865, change: 'up', careerBest: 937, format: 'test', category: 'batters' },
  { rank: 5, player: 'Marnus Labuschagne', photo: 'ML', country: 'Australia', flag: '🇦🇺', rating: 852, change: 'down', careerBest: 936, format: 'test', category: 'batters' },
  { rank: 6, player: 'Rohit Sharma', photo: 'RS', country: 'India', flag: '🇮🇳', rating: 838, change: 'up', careerBest: 882, format: 'test', category: 'batters' },
  { rank: 7, player: 'Babar Azam', photo: 'BA', country: 'Pakistan', flag: '🇵🇰', rating: 824, change: 'down', careerBest: 898, format: 'test', category: 'batters' },
  { rank: 8, player: 'Usman Khawaja', photo: 'UK', country: 'Australia', flag: '🇦🇺', rating: 811, change: 'up', careerBest: 835, format: 'test', category: 'batters' },
  { rank: 9, player: 'Daryl Mitchell', photo: 'DM', country: 'New Zealand', flag: '🇳🇿', rating: 798, change: 'up', careerBest: 812, format: 'test', category: 'batters' },
  { rank: 10, player: 'Ben Stokes', photo: 'BS', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 785, change: 'same', careerBest: 843, format: 'test', category: 'batters' },

  // ── TEST BOWLERS ──
  { rank: 1, player: 'Pat Cummins', photo: 'PC', country: 'Australia', flag: '🇦🇺', rating: 898, change: 'up', careerBest: 914, format: 'test', category: 'bowlers' },
  { rank: 2, player: 'Kagiso Rabada', photo: 'KR', country: 'South Africa', flag: '🇿🇦', rating: 876, change: 'down', careerBest: 902, format: 'test', category: 'bowlers' },
  { rank: 3, player: 'Jasprit Bumrah', photo: 'JB', country: 'India', flag: '🇮🇳', rating: 864, change: 'up', careerBest: 908, format: 'test', category: 'bowlers' },
  { rank: 4, player: 'Nathan Lyon', photo: 'NL', country: 'Australia', flag: '🇦🇺', rating: 852, change: 'same', careerBest: 883, format: 'test', category: 'bowlers' },
  { rank: 5, player: 'James Anderson', photo: 'JA', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 841, change: 'down', careerBest: 903, format: 'test', category: 'bowlers' },
  { rank: 6, player: 'Ravichandran Ashwin', photo: 'RA', country: 'India', flag: '🇮🇳', rating: 835, change: 'up', careerBest: 904, format: 'test', category: 'bowlers' },
  { rank: 7, player: 'Shaheen Afridi', photo: 'SA', country: 'Pakistan', flag: '🇵🇰', rating: 818, change: 'up', careerBest: 856, format: 'test', category: 'bowlers' },
  { rank: 8, player: 'Mitchell Starc', photo: 'MS', country: 'Australia', flag: '🇦🇺', rating: 805, change: 'down', careerBest: 873, format: 'test', category: 'bowlers' },
  { rank: 9, player: 'Ollie Robinson', photo: 'OR', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 792, change: 'up', careerBest: 815, format: 'test', category: 'bowlers' },
  { rank: 10, player: 'Kyle Jamieson', photo: 'KJ', country: 'New Zealand', flag: '🇳🇿', rating: 778, change: 'same', careerBest: 804, format: 'test', category: 'bowlers' },

  // ── TEST ALL-ROUNDERS ──
  { rank: 1, player: 'Ravindra Jadeja', photo: 'RJ', country: 'India', flag: '🇮🇳', rating: 456, change: 'up', careerBest: 478, format: 'test', category: 'all-rounders' },
  { rank: 2, player: 'Ben Stokes', photo: 'BS', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 442, change: 'up', careerBest: 467, format: 'test', category: 'all-rounders' },
  { rank: 3, player: 'Pat Cummins', photo: 'PC', country: 'Australia', flag: '🇦🇺', rating: 435, change: 'down', careerBest: 461, format: 'test', category: 'all-rounders' },
  { rank: 4, player: 'Jason Holder', photo: 'JH', country: 'West Indies', flag: '🏝️', rating: 428, change: 'same', careerBest: 462, format: 'test', category: 'all-rounders' },
  { rank: 5, player: 'Shakib Al Hasan', photo: 'SH', country: 'Bangladesh', flag: '🇧🇩', rating: 415, change: 'down', careerBest: 489, format: 'test', category: 'all-rounders' },
  { rank: 6, player: 'Axar Patel', photo: 'AP', country: 'India', flag: '🇮🇳', rating: 402, change: 'up', careerBest: 428, format: 'test', category: 'all-rounders' },
  { rank: 7, player: 'Mitchell Marsh', photo: 'MM', country: 'Australia', flag: '🇦🇺', rating: 394, change: 'up', careerBest: 412, format: 'test', category: 'all-rounders' },
  { rank: 8, player: 'Chris Woakes', photo: 'CW', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 385, change: 'down', careerBest: 418, format: 'test', category: 'all-rounders' },
  { rank: 9, player: 'Kyle Mayers', photo: 'KM', country: 'West Indies', flag: '🏝️', rating: 372, change: 'up', careerBest: 392, format: 'test', category: 'all-rounders' },
  { rank: 10, player: 'Rachin Ravindra', photo: 'RR', country: 'New Zealand', flag: '🇳🇿', rating: 365, change: 'up', careerBest: 378, format: 'test', category: 'all-rounders' },

  // ── ODI BATTERS ──
  { rank: 1, player: 'Virat Kohli', photo: 'VK', country: 'India', flag: '🇮🇳', rating: 875, change: 'up', careerBest: 911, format: 'odi', category: 'batters' },
  { rank: 2, player: 'Babar Azam', photo: 'BA', country: 'Pakistan', flag: '🇵🇰', rating: 868, change: 'down', careerBest: 898, format: 'odi', category: 'batters' },
  { rank: 3, player: 'Rohit Sharma', photo: 'RS', country: 'India', flag: '🇮🇳', rating: 855, change: 'up', careerBest: 882, format: 'odi', category: 'batters' },
  { rank: 4, player: 'Shubman Gill', photo: 'SG', country: 'India', flag: '🇮🇳', rating: 842, change: 'up', careerBest: 868, format: 'odi', category: 'batters' },
  { rank: 5, player: 'David Warner', photo: 'DW', country: 'Australia', flag: '🇦🇺', rating: 828, change: 'down', careerBest: 889, format: 'odi', category: 'batters' },
  { rank: 6, player: 'Quinton de Kock', photo: 'QK', country: 'South Africa', flag: '🇿🇦', rating: 815, change: 'down', careerBest: 856, format: 'odi', category: 'batters' },
  { rank: 7, player: 'Harry Tector', photo: 'HT', country: 'Ireland', flag: '🇮🇪', rating: 802, change: 'up', careerBest: 825, format: 'odi', category: 'batters' },
  { rank: 8, player: 'Rassie van der Dussen', photo: 'RD', country: 'South Africa', flag: '🇿🇦', rating: 795, change: 'same', careerBest: 831, format: 'odi', category: 'batters' },
  { rank: 9, player: 'Steve Smith', photo: 'SS', country: 'Australia', flag: '🇦🇺', rating: 784, change: 'down', careerBest: 854, format: 'odi', category: 'batters' },
  { rank: 10, player: 'Fakhar Zaman', photo: 'FZ', country: 'Pakistan', flag: '🇵🇰', rating: 771, change: 'up', careerBest: 818, format: 'odi', category: 'batters' },

  // ── ODI BOWLERS ──
  { rank: 1, player: 'Jasprit Bumrah', photo: 'JB', country: 'India', flag: '🇮🇳', rating: 864, change: 'up', careerBest: 890, format: 'odi', category: 'bowlers' },
  { rank: 2, player: 'Mohammed Siraj', photo: 'MS', country: 'India', flag: '🇮🇳', rating: 852, change: 'up', careerBest: 871, format: 'odi', category: 'bowlers' },
  { rank: 3, player: 'Trent Boult', photo: 'TB', country: 'New Zealand', flag: '🇳🇿', rating: 838, change: 'down', careerBest: 878, format: 'odi', category: 'bowlers' },
  { rank: 4, player: 'Shaheen Afridi', photo: 'SA', country: 'Pakistan', flag: '🇵🇰', rating: 825, change: 'up', careerBest: 856, format: 'odi', category: 'bowlers' },
  { rank: 5, player: 'Josh Hazlewood', photo: 'JH', country: 'Australia', flag: '🇦🇺', rating: 812, change: 'same', careerBest: 845, format: 'odi', category: 'bowlers' },
  { rank: 6, player: 'Adam Zampa', photo: 'AZ', country: 'Australia', flag: '🇦🇺', rating: 798, change: 'down', careerBest: 832, format: 'odi', category: 'bowlers' },
  { rank: 7, player: 'Kuldeep Yadav', photo: 'KY', country: 'India', flag: '🇮🇳', rating: 785, change: 'up', careerBest: 815, format: 'odi', category: 'bowlers' },
  { rank: 8, player: 'Rashid Khan', photo: 'RK', country: 'Afghanistan', flag: '🇦🇫', rating: 778, change: 'down', careerBest: 826, format: 'odi', category: 'bowlers' },
  { rank: 9, player: 'Pat Cummins', photo: 'PC', country: 'Australia', flag: '🇦🇺', rating: 765, change: 'up', careerBest: 818, format: 'odi', category: 'bowlers' },
  { rank: 10, player: 'Matt Henry', photo: 'MH', country: 'New Zealand', flag: '🇳🇿', rating: 752, change: 'up', careerBest: 778, format: 'odi', category: 'bowlers' },

  // ── ODI ALL-ROUNDERS ──
  { rank: 1, player: 'Shakib Al Hasan', photo: 'SH', country: 'Bangladesh', flag: '🇧🇩', rating: 412, change: 'up', careerBest: 436, format: 'odi', category: 'all-rounders' },
  { rank: 2, player: 'Mohammad Nabi', photo: 'MN', country: 'Afghanistan', flag: '🇦🇫', rating: 398, change: 'down', careerBest: 425, format: 'odi', category: 'all-rounders' },
  { rank: 3, player: 'Ravindra Jadeja', photo: 'RJ', country: 'India', flag: '🇮🇳', rating: 392, change: 'up', careerBest: 418, format: 'odi', category: 'all-rounders' },
  { rank: 4, player: 'Mitchell Santner', photo: 'MS', country: 'New Zealand', flag: '🇳🇿', rating: 385, change: 'same', careerBest: 402, format: 'odi', category: 'all-rounders' },
  { rank: 5, player: 'Jason Holder', photo: 'JH', country: 'West Indies', flag: '🏝️', rating: 378, change: 'down', careerBest: 425, format: 'odi', category: 'all-rounders' },
  { rank: 6, player: 'Chris Woakes', photo: 'CW', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 372, change: 'down', careerBest: 402, format: 'odi', category: 'all-rounders' },
  { rank: 7, player: 'Glenn Maxwell', photo: 'GM', country: 'Australia', flag: '🇦🇺', rating: 365, change: 'up', careerBest: 398, format: 'odi', category: 'all-rounders' },
  { rank: 8, player: 'Sikandar Raza', photo: 'SR', country: 'Zimbabwe', flag: '🇿🇼', rating: 358, change: 'up', careerBest: 382, format: 'odi', category: 'all-rounders' },
  { rank: 9, player: 'Axar Patel', photo: 'AP', country: 'India', flag: '🇮🇳', rating: 352, change: 'up', careerBest: 375, format: 'odi', category: 'all-rounders' },
  { rank: 10, player: 'Liam Livingstone', photo: 'LL', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 345, change: 'same', careerBest: 368, format: 'odi', category: 'all-rounders' },

  // ── T20I BATTERS ──
  { rank: 1, player: 'Suryakumar Yadav', photo: 'SY', country: 'India', flag: '🇮🇳', rating: 910, change: 'up', careerBest: 935, format: 't20i', category: 'batters' },
  { rank: 2, player: 'Phil Salt', photo: 'PS', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 878, change: 'up', careerBest: 892, format: 't20i', category: 'batters' },
  { rank: 3, player: 'Babar Azam', photo: 'BA', country: 'Pakistan', flag: '🇵🇰', rating: 865, change: 'down', careerBest: 896, format: 't20i', category: 'batters' },
  { rank: 4, player: 'Mohammad Rizwan', photo: 'MR', country: 'Pakistan', flag: '🇵🇰', rating: 852, change: 'down', careerBest: 887, format: 't20i', category: 'batters' },
  { rank: 5, player: 'Virat Kohli', photo: 'VK', country: 'India', flag: '🇮🇳', rating: 845, change: 'same', careerBest: 897, format: 't20i', category: 'batters' },
  { rank: 6, player: 'Jos Buttler', photo: 'JB', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 832, change: 'up', careerBest: 875, format: 't20i', category: 'batters' },
  { rank: 7, player: 'Rilee Rossouw', photo: 'RR', country: 'South Africa', flag: '🇿🇦', rating: 818, change: 'up', careerBest: 842, format: 't20i', category: 'batters' },
  { rank: 8, player: 'Devon Conway', photo: 'DC', country: 'New Zealand', flag: '🇳🇿', rating: 805, change: 'down', careerBest: 835, format: 't20i', category: 'batters' },
  { rank: 9, player: 'Glenn Maxwell', photo: 'GM', country: 'Australia', flag: '🇦🇺', rating: 795, change: 'up', careerBest: 828, format: 't20i', category: 'batters' },
  { rank: 10, player: 'Aiden Markram', photo: 'AM', country: 'South Africa', flag: '🇿🇦', rating: 782, change: 'same', careerBest: 802, format: 't20i', category: 'batters' },

  // ── T20I BOWLERS ──
  { rank: 1, player: 'Rashid Khan', photo: 'RK', country: 'Afghanistan', flag: '🇦🇫', rating: 842, change: 'up', careerBest: 868, format: 't20i', category: 'bowlers' },
  { rank: 2, player: 'Wanindu Hasaranga', photo: 'WH', country: 'Sri Lanka', flag: '🇱🇰', rating: 828, change: 'down', careerBest: 861, format: 't20i', category: 'bowlers' },
  { rank: 3, player: 'Adil Rashid', photo: 'AR', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 815, change: 'up', careerBest: 838, format: 't20i', category: 'bowlers' },
  { rank: 4, player: 'Josh Hazlewood', photo: 'JH', country: 'Australia', flag: '🇦🇺', rating: 802, change: 'same', careerBest: 832, format: 't20i', category: 'bowlers' },
  { rank: 5, player: 'Pat Cummins', photo: 'PC', country: 'Australia', flag: '🇦🇺', rating: 795, change: 'up', careerBest: 822, format: 't20i', category: 'bowlers' },
  { rank: 6, player: 'Anrich Nortje', photo: 'AN', country: 'South Africa', flag: '🇿🇦', rating: 785, change: 'down', careerBest: 815, format: 't20i', category: 'bowlers' },
  { rank: 7, player: 'Trent Boult', photo: 'TB', country: 'New Zealand', flag: '🇳🇿', rating: 778, change: 'down', careerBest: 825, format: 't20i', category: 'bowlers' },
  { rank: 8, player: 'Shaheen Afridi', photo: 'SA', country: 'Pakistan', flag: '🇵🇰', rating: 772, change: 'up', careerBest: 798, format: 't20i', category: 'bowlers' },
  { rank: 9, player: 'Lockie Ferguson', photo: 'LF', country: 'New Zealand', flag: '🇳🇿', rating: 765, change: 'same', careerBest: 788, format: 't20i', category: 'bowlers' },
  { rank: 10, player: 'Axar Patel', photo: 'AP', country: 'India', flag: '🇮🇳', rating: 758, change: 'up', careerBest: 776, format: 't20i', category: 'bowlers' },

  // ── T20I ALL-ROUNDERS ──
  { rank: 1, player: 'Wanindu Hasaranga', photo: 'WH', country: 'Sri Lanka', flag: '🇱🇰', rating: 378, change: 'up', careerBest: 395, format: 't20i', category: 'all-rounders' },
  { rank: 2, player: 'Shakib Al Hasan', photo: 'SH', country: 'Bangladesh', flag: '🇧🇩', rating: 368, change: 'down', careerBest: 412, format: 't20i', category: 'all-rounders' },
  { rank: 3, player: 'Mohammad Nabi', photo: 'MN', country: 'Afghanistan', flag: '🇦🇫', rating: 362, change: 'up', careerBest: 388, format: 't20i', category: 'all-rounders' },
  { rank: 4, player: 'Mitchell Marsh', photo: 'MM', country: 'Australia', flag: '🇦🇺', rating: 355, change: 'up', careerBest: 378, format: 't20i', category: 'all-rounders' },
  { rank: 5, player: 'Glenn Maxwell', photo: 'GM', country: 'Australia', flag: '🇦🇺', rating: 348, change: 'same', careerBest: 382, format: 't20i', category: 'all-rounders' },
  { rank: 6, player: 'Liam Livingstone', photo: 'LL', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 342, change: 'up', careerBest: 368, format: 't20i', category: 'all-rounders' },
  { rank: 7, player: 'Hardik Pandya', photo: 'HP', country: 'India', flag: '🇮🇳', rating: 338, change: 'up', careerBest: 362, format: 't20i', category: 'all-rounders' },
  { rank: 8, player: 'Moeen Ali', photo: 'MA', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 332, change: 'down', careerBest: 358, format: 't20i', category: 'all-rounders' },
  { rank: 9, player: 'Sikandar Raza', photo: 'SR', country: 'Zimbabwe', flag: '🇿🇼', rating: 325, change: 'up', careerBest: 348, format: 't20i', category: 'all-rounders' },
  { rank: 10, player: 'Jason Holder', photo: 'JH', country: 'West Indies', flag: '🏝️', rating: 318, change: 'down', careerBest: 352, format: 't20i', category: 'all-rounders' },
];
