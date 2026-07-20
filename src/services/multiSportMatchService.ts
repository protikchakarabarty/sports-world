import type { Match } from '@/types';

const matches: Match[] = [
  // Basketball
  { id: 'ms1', sport: 'basketball', status: 'live', homeTeam: 'Los Angeles Lakers', awayTeam: 'Boston Celtics', homeScore: '87', awayScore: '82', time: new Date().toISOString(), date: new Date().toISOString().split('T')[0], venue: 'Crypto.com Arena, Los Angeles', broadcast: 'ESPN', league: 'NBA' },
  { id: 'ms2', sport: 'basketball', status: 'upcoming', homeTeam: 'Golden State Warriors', awayTeam: 'Miami Heat', time: new Date(Date.now() + 32400000).toISOString(), date: new Date(Date.now() + 32400000).toISOString().split('T')[0], venue: 'Chase Center, San Francisco', broadcast: 'TNT', league: 'NBA' },
  { id: 'ms3', sport: 'basketball', status: 'finished', homeTeam: 'Milwaukee Bucks', awayTeam: 'Philadelphia 76ers', homeScore: '112', awayScore: '104', time: new Date(Date.now() - 86400000).toISOString(), date: new Date(Date.now() - 86400000).toISOString().split('T')[0], venue: 'Fiserv Forum, Milwaukee', broadcast: 'NBA TV', league: 'NBA' },

  // Tennis
  { id: 'ms4', sport: 'tennis', status: 'live', homeTeam: 'Carlos Alcaraz', awayTeam: 'Jannik Sinner', homeScore: '6-4', awayScore: '3-6, 4-5', time: new Date().toISOString(), date: new Date().toISOString().split('T')[0], venue: 'Wimbledon Centre Court', broadcast: 'BBC Sport', league: 'Wimbledon' },
  { id: 'ms5', sport: 'tennis', status: 'upcoming', homeTeam: 'Novak Djokovic', awayTeam: 'Alexander Zverev', time: new Date(Date.now() + 36000000).toISOString(), date: new Date(Date.now() + 36000000).toISOString().split('T')[0], venue: 'Arthur Ashe Stadium, New York', broadcast: 'ESPN', league: 'US Open' },
  { id: 'ms6', sport: 'tennis', status: 'finished', homeTeam: 'Iga Swiatek', awayTeam: 'Coco Gauff', homeScore: '6-2, 7-5', awayScore: '', time: new Date(Date.now() - 172800000).toISOString(), date: new Date(Date.now() - 172800000).toISOString().split('T')[0], venue: 'Roland Garros, Paris', broadcast: 'Eurosport', league: 'French Open' },

  // Formula 1
  { id: 'ms7', sport: 'formula1', status: 'upcoming', homeTeam: 'Max Verstappen', awayTeam: 'Lewis Hamilton', time: new Date(Date.now() + 72000000).toISOString(), date: new Date(Date.now() + 72000000).toISOString().split('T')[0], venue: 'Circuit de Monaco', broadcast: 'Sky Sports F1', league: 'Monaco Grand Prix' },
  { id: 'ms8', sport: 'formula1', status: 'finished', homeTeam: 'Charles Leclerc', awayTeam: 'Carlos Sainz', homeScore: '1st', awayScore: '3rd', time: new Date(Date.now() - 259200000).toISOString(), date: new Date(Date.now() - 259200000).toISOString().split('T')[0], venue: 'Monza, Italy', broadcast: 'ESPN', league: 'Italian Grand Prix' },
  { id: 'ms9', sport: 'formula1', status: 'upcoming', homeTeam: 'Lando Norris', awayTeam: 'Oscar Piastri', time: new Date(Date.now() + 129600000).toISOString(), date: new Date(Date.now() + 129600000).toISOString().split('T')[0], venue: 'Silverstone Circuit, UK', broadcast: 'Sky Sports F1', league: 'British Grand Prix' },

  // Hockey
  { id: 'ms10', sport: 'hockey', status: 'live', homeTeam: 'India', awayTeam: 'Australia', homeScore: '3', awayScore: '2', time: new Date().toISOString(), date: new Date().toISOString().split('T')[0], venue: 'Kalinga Stadium, Bhubaneswar', broadcast: 'Star Sports', league: 'FIH Pro League' },
  { id: 'ms11', sport: 'hockey', status: 'upcoming', homeTeam: 'Netherlands', awayTeam: 'Germany', time: new Date(Date.now() + 28800000).toISOString(), date: new Date(Date.now() + 28800000).toISOString().split('T')[0], venue: 'Wagener Stadium, Amsterdam', broadcast: 'Eurosport', league: 'FIH Pro League' },
  { id: 'ms12', sport: 'hockey', status: 'finished', homeTeam: 'Belgium', awayTeam: 'Argentina', homeScore: '4', awayScore: '1', time: new Date(Date.now() - 43200000).toISOString(), date: new Date(Date.now() - 43200000).toISOString().split('T')[0], venue: 'Wilrijkse Plein, Antwerp', broadcast: 'FIH Live', league: 'FIH Pro League' },

  // Volleyball
  { id: 'ms13', sport: 'volleyball', status: 'upcoming', homeTeam: 'Brazil', awayTeam: 'Poland', time: new Date(Date.now() + 14400000).toISOString(), date: new Date(Date.now() + 14400000).toISOString().split('T')[0], venue: 'Ginásio do Maracanãzinho, Rio', broadcast: 'Volleyball World', league: 'VNL 2026' },
  { id: 'ms14', sport: 'volleyball', status: 'finished', homeTeam: 'USA', awayTeam: 'Italy', homeScore: '3-1', awayScore: '', time: new Date(Date.now() - 64800000).toISOString(), date: new Date(Date.now() - 64800000).toISOString().split('T')[0], venue: 'Honda Center, Anaheim', broadcast: 'NBC Sports', league: 'VNL 2026' },
  { id: 'ms15', sport: 'volleyball', status: 'upcoming', homeTeam: 'France', awayTeam: 'Japan', time: new Date(Date.now() + 79200000).toISOString(), date: new Date(Date.now() + 79200000).toISOString().split('T')[0], venue: 'Accor Arena, Paris', broadcast: 'Eurosport', league: 'VNL 2026' },

  // Boxing
  { id: 'ms16', sport: 'boxing', status: 'upcoming', homeTeam: 'Tyson Fury', awayTeam: 'Oleksandr Usyk', time: new Date(Date.now() + 604800000).toISOString(), date: new Date(Date.now() + 604800000).toISOString().split('T')[0], venue: 'Kingdom Arena, Riyadh', broadcast: 'DAZN PPV', league: 'Heavyweight Championship' },
  { id: 'ms17', sport: 'boxing', status: 'finished', homeTeam: 'Canelo Álvarez', awayTeam: 'Jaime Munguia', homeScore: 'UD', awayScore: '', time: new Date(Date.now() - 604800000).toISOString(), date: new Date(Date.now() - 604800000).toISOString().split('T')[0], venue: 'T-Mobile Arena, Las Vegas', broadcast: 'DAZN', league: 'Super Middleweight' },
  { id: 'ms18', sport: 'boxing', status: 'upcoming', homeTeam: 'Gervonta Davis', awayTeam: 'Shakur Stevenson', time: new Date(Date.now() + 1209600000).toISOString(), date: new Date(Date.now() + 1209600000).toISOString().split('T')[0], venue: 'Barclays Center, Brooklyn', broadcast: 'Showtime PPV', league: 'Lightweight Championship' },

  // Golf
  { id: 'ms19', sport: 'golf', status: 'upcoming', homeTeam: 'Scottie Scheffler', awayTeam: 'Rory McIlroy', time: new Date(Date.now() + 43200000).toISOString(), date: new Date(Date.now() + 43200000).toISOString().split('T')[0], venue: 'St Andrews, Scotland', broadcast: 'BBC Sport', league: 'The Open Championship' },
  { id: 'ms20', sport: 'golf', status: 'finished', homeTeam: 'Jon Rahm', awayTeam: 'Bryson DeChambeau', homeScore: '-12', awayScore: '-8', time: new Date(Date.now() - 345600000).toISOString(), date: new Date(Date.now() - 345600000).toISOString().split('T')[0], venue: 'Augusta National, Georgia', broadcast: 'CBS Sports', league: 'The Masters' },
  { id: 'ms21', sport: 'golf', status: 'upcoming', homeTeam: 'Xander Schauffele', awayTeam: 'Viktor Hovland', time: new Date(Date.now() + 86400000).toISOString(), date: new Date(Date.now() + 86400000).toISOString().split('T')[0], venue: 'Pebble Beach, California', broadcast: 'NBC Sports', league: 'US Open' },

  // Athletics
  { id: 'ms22', sport: 'athletics', status: 'upcoming', homeTeam: 'Noah Lyles', awayTeam: 'Fred Kerley', time: new Date(Date.now() + 54000000).toISOString(), date: new Date(Date.now() + 54000000).toISOString().split('T')[0], venue: 'Olympic Stadium, London', broadcast: 'BBC Sport', league: 'World Athletics Championships' },
  { id: 'ms23', sport: 'athletics', status: 'finished', homeTeam: 'Mondo Duplantis', awayTeam: 'Sam Kendricks', homeScore: '6.15m', awayScore: '5.95m', time: new Date(Date.now() - 86400000).toISOString(), date: new Date(Date.now() - 86400000).toISOString().split('T')[0], venue: 'Stade de France, Paris', broadcast: 'Eurosport', league: 'Diamond League' },
  { id: 'ms24', sport: 'athletics', status: 'upcoming', homeTeam: 'Sydney McLaughlin', awayTeam: 'Femke Bol', time: new Date(Date.now() + 194400000).toISOString(), date: new Date(Date.now() + 194400000).toISOString().split('T')[0], venue: 'Hayward Field, Oregon', broadcast: 'NBC Sports', league: 'US Olympic Trials' },

  // Baseball
  { id: 'ms25', sport: 'baseball', status: 'live', homeTeam: 'New York Yankees', awayTeam: 'Los Angeles Dodgers', homeScore: '5', awayScore: '3', time: new Date().toISOString(), date: new Date().toISOString().split('T')[0], venue: 'Yankee Stadium, New York', broadcast: 'FOX Sports', league: 'MLB' },
  { id: 'ms26', sport: 'baseball', status: 'upcoming', homeTeam: 'Chicago Cubs', awayTeam: 'St. Louis Cardinals', time: new Date(Date.now() + 21600000).toISOString(), date: new Date(Date.now() + 21600000).toISOString().split('T')[0], venue: 'Wrigley Field, Chicago', broadcast: 'MLB Network', league: 'MLB' },
  { id: 'ms27', sport: 'baseball', status: 'finished', homeTeam: 'Houston Astros', awayTeam: 'Texas Rangers', homeScore: '7', awayScore: '2', time: new Date(Date.now() - 28800000).toISOString(), date: new Date(Date.now() - 28800000).toISOString().split('T')[0], venue: 'Minute Maid Park, Houston', broadcast: 'ESPN', league: 'MLB' },

  // Swimming
  { id: 'ms28', sport: 'swimming', status: 'upcoming', homeTeam: 'Caeleb Dressel', awayTeam: 'Kyle Chalmers', time: new Date(Date.now() + 93600000).toISOString(), date: new Date(Date.now() + 93600000).toISOString().split('T')[0], venue: 'La Defense Arena, Paris', broadcast: 'NBC Sports', league: 'World Aquatics Championships' },
  { id: 'ms29', sport: 'swimming', status: 'finished', homeTeam: 'Ariarne Titmus', awayTeam: 'Mollie O\'Callaghan', homeScore: '1:53.15', awayScore: '1:53.62', time: new Date(Date.now() - 43200000).toISOString(), date: new Date(Date.now() - 43200000).toISOString().split('T')[0], venue: 'Sydney Aquatic Centre', broadcast: 'Channel 9', league: 'Australian Trials' },
  { id: 'ms30', sport: 'swimming', status: 'upcoming', homeTeam: 'Leon Marchand', awayTeam: 'Tom Dean', time: new Date(Date.now() + 302400000).toISOString(), date: new Date(Date.now() + 302400000).toISOString().split('T')[0], venue: 'Paris La Défense Arena', broadcast: 'Eurosport', league: 'World Aquatics Championships' },

  // MMA
  { id: 'ms31', sport: 'mma', status: 'upcoming', homeTeam: 'Islam Makhachev', awayTeam: 'Arman Tsarukyan', time: new Date(Date.now() + 432000000).toISOString(), date: new Date(Date.now() + 432000000).toISOString().split('T')[0], venue: 'T-Mobile Arena, Las Vegas', broadcast: 'ESPN+ PPV', league: 'UFC Lightweight Championship' },
  { id: 'ms32', sport: 'mma', status: 'finished', homeTeam: 'Alex Pereira', awayTeam: 'Jamahal Hill', homeScore: 'KO R1', awayScore: '', time: new Date(Date.now() - 604800000).toISOString(), date: new Date(Date.now() - 604800000).toISOString().split('T')[0], venue: 'Madison Square Garden, New York', broadcast: 'ESPN+ PPV', league: 'UFC 300' },
  { id: 'ms33', sport: 'mma', status: 'upcoming', homeTeam: 'Jon Jones', awayTeam: 'Tom Aspinall', time: new Date(Date.now() + 777600000).toISOString(), date: new Date(Date.now() + 777600000).toISOString().split('T')[0], venue: 'The O2, London', broadcast: 'ESPN+ PPV', league: 'UFC Heavyweight Championship' },

  // Rugby
  { id: 'ms34', sport: 'rugby', status: 'live', homeTeam: 'New Zealand All Blacks', awayTeam: 'South Africa Springboks', homeScore: '17', awayScore: '14', time: new Date().toISOString(), date: new Date().toISOString().split('T')[0], venue: 'Eden Park, Auckland', broadcast: 'Sky Sport NZ', league: 'The Rugby Championship' },
  { id: 'ms35', sport: 'rugby', status: 'upcoming', homeTeam: 'Ireland', awayTeam: 'France', time: new Date(Date.now() + 72000000).toISOString(), date: new Date(Date.now() + 72000000).toISOString().split('T')[0], venue: 'Aviva Stadium, Dublin', broadcast: 'ITV Sport', league: 'Six Nations' },
  { id: 'ms36', sport: 'rugby', status: 'finished', homeTeam: 'England', awayTeam: 'Australia', homeScore: '31', awayScore: '20', time: new Date(Date.now() - 172800000).toISOString(), date: new Date(Date.now() - 172800000).toISOString().split('T')[0], venue: 'Twickenham Stadium, London', broadcast: 'BBC Sport', league: 'Autumn Nations Series' },

  // Cycling
  { id: 'ms37', sport: 'cycling', status: 'upcoming', homeTeam: 'Tadej Pogačar', awayTeam: 'Jonas Vingegaard', time: new Date(Date.now() + 18000000).toISOString(), date: new Date(Date.now() + 18000000).toISOString().split('T')[0], venue: 'Champs-Élysées, Paris', broadcast: 'Eurosport', league: 'Tour de France' },
  { id: 'ms38', sport: 'cycling', status: 'finished', homeTeam: 'Remco Evenepoel', awayTeam: 'Primož Roglič', homeScore: '4:12:30', awayScore: '4:13:15', time: new Date(Date.now() - 86400000).toISOString(), date: new Date(Date.now() - 86400000).toISOString().split('T')[0], venue: 'La Vuelta, Spain', broadcast: 'Eurosport', league: 'Vuelta a España' },
  { id: 'ms39', sport: 'cycling', status: 'upcoming', homeTeam: 'Mathieu van der Poel', awayTeam: 'Wout van Aert', time: new Date(Date.now() + 259200000).toISOString(), date: new Date(Date.now() + 259200000).toISOString().split('T')[0], venue: 'Roubaix Velodrome, France', broadcast: 'Flobikes', league: 'Paris-Roubaix' },
];

export function getAllMatches(): Match[] {
  return matches;
}

export function getMatchesBySport(sport: string): Match[] {
  return matches.filter((m) => m.sport === sport);
}

export function getMatchesByStatus(status: 'live' | 'upcoming' | 'finished'): Match[] {
  return matches.filter((m) => m.status === status);
}

export function getFilteredMatches(activeTab: string): Match[] {
  if (activeTab === 'all') return matches;
  return matches.filter((m) => m.status === activeTab);
}
