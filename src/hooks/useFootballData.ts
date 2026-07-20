import { useQuery } from '@tanstack/react-query';
import { getAllFixtures, getCompetitions as getProviderCompetitions, getTransfers as getProviderTransfers, getTopScorers as getProviderTopScorers } from '@/services/providers/providerManager';
import { getUpcomingAiFixtures, detectLeagueCode } from '@/services/providers/sportmonksProvider';
import type { AiMatchInfo } from '@/services/providers/sportmonksProvider';
import { getInjuries as getProviderInjuries } from '@/services/injuryService';
import { getNewsByCategory } from '@/services/newsApi';
import { getTable } from '@/services/footballApi';
import { getFootballPredictionPoll, getAiPrediction as getAiPred, getFootballMatchPrediction, generateAllMatchPredictions } from '@/services/aiPredictionService';
import type { Gender } from '@/data/mockData';
import type { MatchPredictionInput, AiExtendedPrediction } from '@/types/prediction';
import { getFifaRankings } from '@/services/fifaRankingApi';
import { getRichestFootballers } from '@/services/richestFootballersApi';
import { getOnThisDayFootballData } from '@/services/onThisDayService';
import type { FootballOnThisDayPlayer } from '@/services/onThisDayService';
import { getTransferRumours, getTransferNews, getDiscussedPlayers } from '@/services/transferRumourService';
import { getClubRankings } from '@/services/clubRankingService';

function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function toDhakaTime(utcDate: string): string {
  if (!utcDate) return '';
  try {
    const d = new Date(utcDate);
    const dhaka = new Intl.DateTimeFormat('en-BD', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
    return dhaka;
  } catch {
    const d = new Date(utcDate);
    const offset = 6 * 60;
    const local = new Date(d.getTime() + offset * 60000);
    return local.toISOString().split('T')[1]?.slice(0, 5) ?? '';
  }
}

const VALID_FDO_STATUSES = new Set(['LIVE', 'IN_PLAY', 'PAUSED', 'SCHEDULED', 'TIMED', 'FINISHED', 'AWARDED']);

function mapStatus(fdoStatus: string): 'live' | 'upcoming' | 'finished' | null {
  switch (fdoStatus) {
    case 'LIVE':
    case 'IN_PLAY':
    case 'PAUSED':
      return 'live';
    case 'SCHEDULED':
    case 'TIMED':
      return 'upcoming';
    case 'FINISHED':
    case 'AWARDED':
      return 'finished';
    default:
      return null;
  }
}

const hookDefaults = {
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 30,
  refetchOnMount: true as const,
  refetchOnWindowFocus: false as const,
  refetchOnReconnect: false as const,
  retry: 2 as const,
};

const FOOTBALL_KEYWORDS = [
  // Football terms
  'match', 'player', 'team', 'goal', 'league', 'transfer', 'injury',
  'score', 'cup', 'stadium', 'coach', 'manager',
  'striker', 'defender', 'midfielder', 'goalkeeper', 'substitute',
  'penalty', 'free kick', 'corner kick', 'assist', 'tackle', 'save',
  'fixture', 'kickoff', 'halftime', 'fulltime', 'stoppage time',
  'red card', 'yellow card', 'foul', 'offside', 'handball',
  'victory', 'defeat', 'draw', 'hat-trick', 'comeback', 'clean sheet',
  'signing', 'contract', 'squad', 'captain', 'bench', 'lineup',
  'football', 'soccer', 'winger', 'keeper', 'loan',
  'round of 16', 'quarterfinal', 'quarter-final', 'semifinal', 'semi-final',
  'final', 'friendly', 'pre-season', 'transfer window',
  'brace', 'treble', 'top scorer', 'golden boot',
  'promotion', 'relegation', 'play-off', 'playoff',
  'nations league',

  // Competitions & leagues
  'premier league', 'epl',
  'champions league', 'ucl',
  'la liga',
  'serie a',
  'bundesliga',
  'ligue 1',
  'europa league', 'uel',
  'conference league', 'uecl',
  'fa cup', 'carabao cup', 'league cup', 'community shield',
  'copa del rey', 'dfb pokal', 'coppa italia', 'coupe de france',
  'world cup', 'fifa world cup', 'club world cup',
  'european championship', 'euros', 'euro 2024', 'euro 2028',
  'copa america', 'copa américa',
  'africa cup of nations', 'afcon',
  'asian cup',
  'super cup', 'uefa super cup',
  'championship', 'league one', 'league two',
  'eredivisie', 'primeira liga', 'ligaporta',
  'super lig', 'süper lig',
  'jupiler league', 'pro league',
  'mls', 'major league soccer',
  'argentine league', 'brazilian league',
  'australian league', 'a-league',
  'japanese league', 'j-league',
  'saudi league', 'saudi pro league',
  'champions league group stage',

  // Clubs
  'arsenal', 'chelsea', 'liverpool', 'manchester city', 'manchester united',
  'man city', 'man utd', 'man united',
  'tottenham', 'spurs', 'newcastle', 'aston villa', 'west ham',
  'wolves', 'brighton', 'everton', 'nottingham',
  'real madrid', 'barcelona', 'atletico madrid', 'atlético madrid',
  'sevilla', 'valencia', 'villareal', 'betis',
  'bayern munich', 'bayern', 'borussia dortmund', 'dortmund',
  'rb leipzig', 'leverkusen', 'bayer leverkusen',
  'frankfurt', 'mönchengladbach', 'stuttgart', 'wolfsburg',
  'psg', 'paris saint-germain', 'monaco', 'lyon', 'marseille',
  'lille', 'nice', 'rennes', 'lens',
  'juventus', 'juve', 'ac milan', 'milan', 'inter milan', 'inter',
  'napoli', 'roma', 'lazio', 'atalanta', 'fiorentina',
  'benfica', 'porto', 'sporting lisbon', 'sporting cp',
  'ajax', 'psv', 'feyenoord',
  'celtic', 'rangers',
  'galatasaray', 'fenerbahce', 'besiktas',
  'shakhtar donetsk', 'dynamo kyiv',
  'club brugge', 'anderlecht',
  'salzburg', 'red bull salzburg',
  'copenhagen', 'midtjylland',
  'olympiacos', 'panathinaikos',
  'dinamo zagreb',
  'slavia prague', 'sparta prague',
  'ferencvaros',
  'young boys',
  'slovan bratislava',
  'ludogorets',
  'maccabi haifa',
  'al-hilal', 'al-nassr', 'al-ittihad',
  'flamengo', 'palmeiras', 'santos', 'corinthians',
  'boca juniors', 'river plate',
  'monterrey', 'club america', 'chivas',

  // Players — current stars
  'messi', 'ronaldo', 'cristiano ronaldo', 'cr7',
  'mbappe', 'kylian',
  'haaland', 'erling haaland',
  'bellingham', 'judd bellingham',
  'vinicius', 'vinícius', 'vini jr', 'vinicius junior',
  'kane', 'harry kane',
  'salah', 'mohamed salah',
  'neymar', 'neymar jr',
  'de bruyne', 'kevin de bruyne',
  'saka', 'bukayo saka',
  'musiala', 'jamal musiala',
  'pedri', 'yamal', 'lamal',
  'gavi', 'raphinha',
  'foden', 'phil foden',
  'odegaard', 'odegård', 'martin odegaard',
  'rice', 'declan rice',
  'havertz', 'kai havertz',
  'salah', 'mané', 'sadio mané',
  'vvd', 'van dijk', 'virgil van dijk',
  'saliba', 'william saliba',
  'maguire', 'harry maguire',
  'palmer', 'cole palmer',
  'rodri', 'rodrigo hernandez',
  'modric', 'luka modric',
  'kroos', 'toni kroos',
  'alvarez', 'julián alvarez', 'julian alvarez',
  'enzo', 'enzo fernandez',
  'macallister', 'mac allister', 'alexis mac allister',
  'nunez', 'darwin nunez',
  'gakpo', 'cody gakpo',
  'doku', 'jeremy doku',
  'grealish', 'jack grealish',
  'fernandes', 'bruno fernandes',
  'rashford', 'marcus rashford',
  'garnacho', 'alejandro garnacho',
  'sancho', 'jadon sancho',
  'højlund', 'hojlund', 'rasmus hojlund',
  'mount', 'mason mount',
  'mbappe', 'dembele', 'ousmane dembele',
  'lewandowski', 'robert lewandowski',
  'gündogan', 'gundogan', 'ilkay gundogan',
  'wirtz', 'florian wirtz',
  'grimaldo', 'alex grimaldo',
  'xavi', 'iniesta', 'ancelotti', 'guardiola', 'pep',
  'klopp', 'jurgen klopp', 'arteta', 'mikel arteta',
  'emery', 'unai emery', 'allegri', 'conte',
  'mourinho', 'zidane',
  'rivaldo', 'ronaldinho', 'kaka',
  'zico', 'maradona', 'pele', 'pelé',
  'cruyff', 'beckham', 'david beckham',
  'van basten', 'gullit', 'rijkaard',
  'lineker', 'shearer', 'rooney', 'wayne rooney',
  'gerrard', 'steven gerrard', 'lampard', 'frank lampard',
  'terry', 'john terry', 'scholes', 'paul scholes',
  'giggs', 'ryan giggs', 'keane', 'roy keane',
  'vieira', 'patrick vieira', 'henry', 'thierry henry',
  'bergkamp', 'dennis bergkamp', 'wright', 'ian wright',
  'totti', 'francesco totti', 'del piero',
  'maldini', 'baresi', 'nesta', 'cannavaro',
  'buffon', 'gigi buffon', 'chiellini',
  'pirlo', 'andrea pirlo',
  'ronaldo brazil', 'r9', 'ronaldo nazario',
  'ramos', 'sergio ramos', 'pique', 'gerard pique',
  'puyol', 'carles puyol', 'xavi',
  'casillas', 'iker casillas', 'raul',
  'zlatan', 'ibrahimovic', 'zlatan ibrahimović',
  'zlatan ibrahimovic',
  'ruth', 'babe ruth',
];

const FOOTBALL_BLOCK_KEYWORDS = [
  'cricket', 'ipl', 'bcci', 'test match', 'odi', 't20',
  'basketball', 'nba', 'ncaa',
  'tennis', 'wimbledon', 'us open', 'french open', 'australian open',
  'formula 1', 'f1', 'grand prix', 'motogp',
  'baseball', 'mlb',
  'hockey', 'nhl',
  'nfl', 'super bowl', 'american football',
  'boxing', 'ufc', 'wwe',
  'golf', 'pga', 'masters',
  'rugby', 'six nations', 'rugby world cup',
  'volleyball', 'nfl',
  'olympics', 'olympic games',
  'badminton', 'table tennis',
  'swimming', 'athletics', 'cycling',
  'esports', 'gaming',
];

function isFootballArticle(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const hasBlocked = FOOTBALL_BLOCK_KEYWORDS.some((kw) => text.includes(kw));
  if (hasBlocked) return false;
  const matches = FOOTBALL_KEYWORDS.filter((kw) => text.includes(kw.toLowerCase()));
  return matches.length >= 3;
}

export function useFootballNews(_gender: Gender) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['football-news'],
    queryFn: async () => {
      const articles = await getNewsByCategory('football', 20);
      const seen = new Set<string>();
      return articles
        .filter((a) => {
          if (!a.title || !a.url) return false;
          const key = a.title.toLowerCase() + a.url;
          if (seen.has(key)) return false;
          seen.add(key);
          return isFootballArticle(a.title, a.description);
        })
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .map((a, i) => ({
          id: `news-${i}-${Date.now()}`,
          title: a.title,
          url: a.url,
          excerpt: a.description || '',
          image: a.image,
          category: 'Football' as const,
          date: a.publishedAt?.split('T')[0] || todayDate(),
          author: a.source || 'Sports Desk',
          readTime: '3 min read',
          featured: i < 2,
          trending: i < 3,
        }));
    },
  });
}

export function useFootballFixtures(_gender: Gender) {
  return useQuery({
    ...hookDefaults,
    queryKey: ['football-fixtures'],
    queryFn: async () => {
      console.log(`[FootballHooks] Fetching fixtures via provider manager...`);

      const { matches: fixtureMatches } = await getAllFixtures();

      const all: {
        id: string;
        sport: 'football';
        status: 'live' | 'upcoming' | 'finished';
        homeTeam: string;
        awayTeam: string;
        homeCrest?: string;
        awayCrest?: string;
        homeScore?: string;
        awayScore?: string;
        homeDisplayScore: number;
        awayDisplayScore: number;
        homePenaltyScore?: number | null;
        awayPenaltyScore?: number | null;
        hasPenalties: boolean;
        time: string;
        date: string;
        utcDate: string;
        venue: string;
        broadcast: string;
        league: string;
        stage: string;
        wentToExtraTime?: boolean;
        winner?: string | null;
        elapsed?: number;
        goals?: { minute: number; extraMinute?: number; player: string; team: 'home' | 'away'; type: string }[];
      }[] = [];

      const added = new Set<string>();

      for (const m of fixtureMatches) {
        if (!VALID_FDO_STATUSES.has(m.fdoStatus)) continue;
        if (added.has(m.id)) continue;
        added.add(m.id);
        const status = mapStatus(m.fdoStatus);
        if (!status) continue;
          const mapped = {
            id: m.id,
            sport: 'football' as const,
            status,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            homeCrest: m.homeCrest,
            awayCrest: m.awayCrest,
            homeScore: m.homeScore?.toString(),
            awayScore: m.awayScore?.toString(),
            homeDisplayScore: m.homeDisplayScore,
            awayDisplayScore: m.awayDisplayScore,
            homePenaltyScore: m.homePenaltyScore,
            awayPenaltyScore: m.awayPenaltyScore,
            hasPenalties: m.hasPenalties,
            time: toDhakaTime(m.utcDate) || m.time,
            date: m.date,
            utcDate: m.utcDate,
            venue: m.venue || '',
            broadcast: '',
            league: m.competitionName || '',
            stage: m.stage || '',
            wentToExtraTime: m.wentToExtraTime,
            winner: m.winner,
            elapsed: m.elapsed,
            goals: m.goals,
          };
          if (m.hasPenalties) {
            console.log("[Penalty Hook]", mapped);
          }
          all.push(mapped);
      }

      const liveMatches = all.filter((m) => m.status === 'live');
      const upcomingMatches = all.filter((m) => m.status === 'upcoming');
      const finishedMatches = all.filter((m) => m.status === 'finished');

      liveMatches.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
      upcomingMatches.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
      finishedMatches.sort((a, b) => b.utcDate.localeCompare(a.utcDate));

      const allTabView = [...liveMatches, ...finishedMatches];

      const sorted = [...liveMatches, ...upcomingMatches, ...finishedMatches];

      console.log(`[FootballHooks] === PARSED MATCHES ===`);
      sorted.forEach((m) => {
        console.log(`  ${m.league.padEnd(30)} | ${(m.stage || '-').padEnd(16)} | ${m.utcDate} | BD:${m.time} | ${m.status.toUpperCase().padEnd(9)} | ${m.homeTeam.padEnd(22)} vs ${m.awayTeam}${m.homeScore ? ` (${m.homeScore}-${m.awayScore})` : ''}`);
      });

      console.log(`[FootballHooks] === SUMMARY ===`);
      console.log(`  Live: ${liveMatches.length} matches`);
      console.log(`  Fixtures: ${upcomingMatches.length} matches`);
      console.log(`  Completed: ${finishedMatches.length} matches`);
      console.log(`  All (excl. fixtures): ${allTabView.length} matches`);

      return sorted;
    },
  });
}

export function useFootballLeagues(_gender: Gender) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    queryKey: ['football-leagues'],
    queryFn: async () => {
      const { competitions: comps } = await getProviderCompetitions();
      const running = comps.map((c, i) => ({
        id: `comp-${i}`,
        name: c.name,
        type: c.type || 'Domestic',
        status: 'ongoing' as const,
        startDate: '',
        endDate: '',
      }));
      return { running };
    },
  });
}

export function useFootballStats(gender: Gender, compCode = 'PL') {
  const query = useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 15,
    queryKey: ['football-scorers', compCode],
    queryFn: async () => {
      const { scorers } = await getProviderTopScorers(compCode);
      return scorers;
    },
  });
  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useStandings(compCode: string) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 15,
    queryKey: ['football-standings', compCode],
    queryFn: async () => {
      const { getTable } = await import('@/services/providers/providerManager');
      const result = await getTable(compCode);
      return result.standings;
    },
  });
}

export function useTransfers(_gender: Gender) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['football-transfers'],
    queryFn: async () => getProviderTransfers(),
    retry: 1,
  });
}

export function useInjuries(_gender: Gender) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    queryKey: ['football-injuries'],
    queryFn: async () => getProviderInjuries(),
    retry: 1,
  });
}

export function usePredictions(gender: Gender) {
  return useQuery({
    ...hookDefaults,
    staleTime: 1000 * 60 * 60,
    queryKey: ['football-predictions', gender],
    queryFn: async () => {
      const poll = await getFootballPredictionPoll<{
        id: string;
        question: string;
        options: string[];
        votes: number[];
        totalVotes: number;
      }>();
      return { football: poll };
    },
  });
}

export function useAIPrediction(question: string, options: string[]) {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryKey: ['ai-prediction', question, ...options],
    queryFn: () => getAiPred(question, options),
    enabled: !!question && options.length > 0,
  });
}

export function useFootballAIPrediction(input: MatchPredictionInput | null) {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryKey: ['football-ai-prediction', input?.homeTeam ?? '', input?.awayTeam ?? '', input?.competition ?? '', input?.stage ?? ''],
    queryFn: () => getFootballMatchPrediction(input!),
    enabled: !!input && !!input.homeTeam && !!input.awayTeam,
  });
}

export function useTransferNews() {
  return useQuery({
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-transfer-news'],
    queryFn: () => getTransferNews(),
  });
}

export function useDiscussedPlayers() {
  return useQuery({
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-discussed-players'],
    queryFn: () => getDiscussedPlayers(),
  });
}

export function useClubRankings() {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-club-rankings'],
    queryFn: () => getClubRankings(),
  });
}

export function useTransferRumours() {
  return useQuery({
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-transfer-rumours'],
    queryFn: () => getTransferRumours(),
  });
}

export function useFifaRankings() {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['fifa-rankings'],
    queryFn: () => getFifaRankings(),
  });
}

export function useRichestFootballers() {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: false as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-richest'],
    queryFn: () => getRichestFootballers(),
  });
}

export function useMatchPredictions() {
  return useQuery({
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryKey: ['football-match-predictions'],
    queryFn: async () => {
      const fixtures = await getUpcomingAiFixtures();
      if (!fixtures.length) {
        console.log('[Predictions] No upcoming matches in next 24h');
        return { fixtures: [] as AiMatchInfo[], predictions: new Map<string, AiExtendedPrediction>() };
      }

      // Build team context from standings
      const teamContexts = new Map<string, string>();
      const uniqueComps = [...new Set(fixtures.map((m) => m.competition))];
      for (const comp of uniqueComps) {
        const mapped = detectLeagueCode(comp);
        if (!mapped) continue;
        try {
          const table = await getTable(mapped.code);
          for (const row of table) {
            const existing = teamContexts.get(row.team) ?? '';
            const line = `${comp}: ${row.position}th, Pld: ${row.played}, W: ${row.won}, D: ${row.drawn}, L: ${row.lost}, Pts: ${row.points}, GD: ${row.goalDifference}${row.form ? `, Form: ${row.form}` : ''}`;
            teamContexts.set(row.team, existing ? `${existing}\n${line}` : line);
          }
        } catch {}
      }
      console.log(`[Predictions] Team context built for ${teamContexts.size} teams`);

      const predictions = await generateAllMatchPredictions(fixtures, teamContexts);
      return { fixtures, predictions };
    },
  });
}

export function useOnThisDay() {
  return useQuery({
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    refetchOnMount: true as const,
    refetchOnWindowFocus: false as const,
    refetchOnReconnect: false as const,
    retry: 1,
    queryKey: ['football-onthisday'],
    queryFn: (): Promise<{ births: FootballOnThisDayPlayer[]; deaths: FootballOnThisDayPlayer[] }> =>
      getOnThisDayFootballData(),
  });
}
