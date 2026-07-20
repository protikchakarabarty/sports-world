export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  featured: boolean;
  trending: boolean;
}

export interface Match {
  id: string;
  sport: 'cricket' | 'football' | 'basketball' | 'tennis' | 'formula1' | 'hockey' | 'volleyball' | 'boxing' | 'golf' | 'athletics' | 'baseball' | 'swimming' | 'mma' | 'rugby' | 'cycling';
  status: 'live' | 'upcoming' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  time: string;
  date: string;
  venue: string;
  broadcast: string;
  league?: string;
}

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  image: string;
  rank: number;
  value?: string;
  earnings?: string;
  nationality: string;
  description?: string;
}

export interface MedalEntry {
  country: string;
  flag: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  sport: string;
  image: string;
  era: string;
  achievements: string[];
  records: string[];
  nationality: string;
  bio: string;
}

export interface GlobalRecord {
  id: string;
  title: string;
  description: string;
  holder: string;
  category: string;
  year: string;
  holderImage: string;
}

export interface OnThisDayEntry {
  id: string;
  name: string;
  sport: string;
  type: 'born' | 'died';
  year: string;
  diedYear?: string;
  description: string;
  image?: string;
  country?: string;
}

export interface OnThisDayResponse {
  entries: OnThisDayEntry[];
  matchType: 'exact' | 'nearby' | 'static';
  dateRangeLabel?: string;
}

export interface CricketSeries {
  id: string;
  name: string;
  type: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
}

export interface CricketStats {
  player: string;
  team: string;
  span?: string;
  mat?: number;
  inns?: number;
  no?: number;
  runs?: number;
  hs?: string;
  ave?: number;
  bf?: string;
  sr?: string;
  hundreds?: number;
  fifties?: number;
  ducks?: number;
  fours?: string;
  sixes?: number;
  wickets?: number;
}

export interface CricketRanking {
  category: string;
  rank: number;
  player: string;
  team: string;
  rating: number;
}

export interface ICCRankingEntry {
  rank: number;
  player: string;
  photo: string;
  country: string;
  flag: string;
  rating: number;
  change: 'up' | 'down' | 'same';
  careerBest: number;
  format: 'test' | 'odi' | 't20i';
  category: 'batters' | 'bowlers' | 'all-rounders';
}

export interface TransferNews {
  id: string;
  player: string;
  from: string;
  to: string;
  fee: string;
  status: 'completed' | 'rumored' | 'pending';
  date: string;
}

export interface LeagueStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export interface FootballStats {
  player: string;
  team: string;
  league: string;
  goals?: number;
  assists?: number;
}

export interface PredictionPoll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  totalVotes: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
}

export interface InjuryReport {
  id: string;
  player: string;
  team: string;
  injury: string;
  returnDate: string;
  status: 'day-to-day' | 'injured' | 'out';
}

export interface FantasyPlayer {
  name: string;
  role: string;
  points: number;
  team: string;
}
