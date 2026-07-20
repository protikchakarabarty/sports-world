const NATIONAL_TEAMS: Record<string, string> = {
  Argentina: '#75AADB',
  Brazil: '#009C3B',
  'Spain': '#AA151B',
  Belgium: '#EF3340',
  France: '#0055A4',
  England: '#FFFFFF',
  Germany: '#000000',
  Portugal: '#006600',
  Netherlands: '#FF6A00',
  Italy: '#008C45',
  Morocco: '#C1272D',
  Japan: '#BC002D',
  Croatia: '#D00027',
  Mexico: '#006847',
  'USA': '#3C3B6E',
  Uruguay: '#003DA5',
  Colombia: '#FCD116',
  Chile: '#D52B1E',
  Nigeria: '#008751',
  Cameroon: '#007A5E',
  Ghana: '#CE1126',
  Senegal: '#00853F',
  IvoryCoast: '#F77F00',
  Tunisia: '#E70013',
  Algeria: '#006633',
  Egypt: '#C8102E',
  SouthKorea: '#E60000',
  SaudiArabia: '#006C35',
  Iran: '#239F40',
  Australia: '#FFCD00',
  Switzerland: '#D52B1E',
  Denmark: '#C8102E',
  Sweden: '#005B9F',
  Norway: '#BA0C2F',
  Poland: '#D4213D',
  'Czech Republic': '#11457E',
  Austria: '#ED2939',
  Hungary: '#436F4D',
  Serbia: '#003893',
  Russia: '#D52B1E',
  Ukraine: '#005BBB',
  Turkey: '#E30A17',
  Greece: '#0D5EAF',
  Romania: '#002B7F',
  Scotland: '#005EB8',
  'Wales': '#CF142B',
  'Ireland': '#169B62',
  'Northern Ireland': '#D01A26',
  Iceland: '#003897',
  Canada: '#E01111',
  'Costa Rica': '#002B7F',
  Jamaica: '#009B3A',
  Honduras: '#00A3E0',
  Ecuador: '#FFE600',
  Peru: '#D91023',
  Paraguay: '#D52B1E',
  Bolivia: '#007934',
  Venezuela: '#FEDF00',
  Panama: '#00529C',
  'New Zealand': '#000000',
  'South Africa': '#007A4D',
  Zambia: '#198A3F',
  'Ivory Coast': '#F77F00',
  Mali: '#00853F',
  BurkinaFaso: '#EF2B2D',
  Togo: '#D4A300',
  Benin: '#008751',
  Angola: '#CC092F',
  Congo: '#009543',
  'DR Congo': '#007FFF',
  Ethiopia: '#007A5E',
  Kenya: '#BB0000',
  Tanzania: '#00A651',
  Uganda: '#DDB309',
  Zimbabwe: '#009B3A',
  'Bosnia and Herzegovina': '#002395',
  Bulgaria: '#00966E',
  Slovakia: '#0B4EA2',
  Slovenia: '#005DA4',
  Israel: '#0038B8',
  Finland: '#002F6C',
  Albania: '#E0001B',
  Montenegro: '#D52B1E',
  'North Macedonia': '#FFCE00',
  Luxembourg: '#00A1DE',
  Armenia: '#D90012',
  Georgia: '#FF0000',
  Kazakhstan: '#00A3E0',
  Cyprus: '#005FAD',
};

const CLUB_TEAMS: Record<string, string> = {
  'Manchester City': '#6CABDD',
  'Manchester United': '#DA291C',
  Liverpool: '#C8102E',
  Chelsea: '#034694',
  Arsenal: '#EF0107',
  Tottenham: '#132257',
  'Real Madrid': '#FEBE10',
  Barcelona: '#A50044',
  'Atletico Madrid': '#CB3524',
  'Bayern Munich': '#DC052D',
  'Borussia Dortmund': '#FDE100',
  'Paris Saint-Germain': '#004170',
  'Inter Milan': '#010E80',
  'AC Milan': '#FB2B1B',
  Juventus: '#000000',
  Napoli: '#12A0D7',
  Ajax: '#D31245',
  'PSV Eindhoven': '#E9002C',
  Feyenoord: '#C8102E',
  'Sporting CP': '#006233',
  Benfica: '#EF2B2D',
  Porto: '#0051A0',
};

const CRICKET_TEAMS: Record<string, string> = {
  India: '#0077FF',
  Pakistan: '#006600',
  'Sri Lanka': '#0000FF',
  Bangladesh: '#006747',
  'West Indies': '#9B287B',
  Afghanistan: '#D0342A',
  Ireland: '#169B62',
  Netherlands: '#FF6A00',
  Nepal: '#003893',
  'United Arab Emirates': '#FF0000',
  UAE: '#FF0000',
  Namibia: '#003DA5',
  'Papua New Guinea': '#FF0000',
  'Hong Kong': '#E30A17',
  Scotland: '#005EB8',
  'West Indies Select XI': '#9B287B',
  'India Women': '#0077FF',
  'England Women': '#FFFFFF',
  'Australia Women': '#FFCD00',
  'New Zealand Women': '#000000',
  'South Africa Women': '#007A4D',
  'Zimbabwe Women': '#D40000',
  'Bangladesh Women': '#006747',
  'West Indies Women': '#9B287B',
  'Pakistan Women': '#006600',
  'Sri Lanka Women': '#0000FF',
  'Ireland Women': '#169B62',
};

function hashTeamName(name: string): number {
  let hash = 0;
  const normalized = name.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function hslFromHash(hash: number): string {
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

function normalizeTeamName(name: string): string {
  const lookup: Record<string, string> = {
    'usa': 'USA',
    'us': 'USA',
    'uk': 'England',
    'great britain': 'England',
    'czech': 'Czech Republic',
    'czechia': 'Czech Republic',
    'south korea': 'SouthKorea',
    'korea republic': 'SouthKorea',
    'saudi arabia': 'SaudiArabia',
    'saudi': 'SaudiArabia',
    'ivory coast': 'IvoryCoast',
    "côte d'ivoire": 'IvoryCoast',
    'bosnia': 'Bosnia and Herzegovina',
    'bosnia & herzegovina': 'Bosnia and Herzegovina',
    'north macedonia': 'North Macedonia',
    'dr congo': 'DR Congo',
    'new zealand': 'New Zealand',
    'south africa': 'South Africa',
    'northern ireland': 'Northern Ireland',
    'costa rica': 'Costa Rica',
    'burkina faso': 'BurkinaFaso',
    'psg': 'Paris Saint-Germain',
    'manchester city': 'Manchester City',
    'manchester united': 'Manchester United',
    'man utd': 'Manchester United',
    'real madrid': 'Real Madrid',
    'bayern': 'Bayern Munich',
    'bayern munich': 'Bayern Munich',
    'borussia dortmund': 'Borussia Dortmund',
    'dortmund': 'Borussia Dortmund',
    'inter': 'Inter Milan',
    'inter milan': 'Inter Milan',
    'ac milan': 'AC Milan',
    'milan': 'AC Milan',
    'juve': 'Juventus',
    'psv': 'PSV Eindhoven',
    'sporting': 'Sporting CP',
    'benfica': 'Benfica',
    'atletico': 'Atletico Madrid',
    'atlético': 'Atletico Madrid',
    'tottenham': 'Tottenham',
    'spurs': 'Tottenham',
    'chelsea': 'Chelsea',
    'arsenal': 'Arsenal',
    'liverpool': 'Liverpool',
    'napoli': 'Napoli',
    'ajax': 'Ajax',
    'feyenoord': 'Feyenoord',
    'porto': 'Porto',
    // cricket national team name variants
    'west indies': 'West Indies',
    'west indies select xi': 'West Indies Select XI',
    'sri lanka': 'Sri Lanka',
    'uae': 'UAE',
    'png': 'Papua New Guinea',
    'india women': 'India Women',
    'england women': 'England Women',
    'australia women': 'Australia Women',
    'new zealand women': 'New Zealand Women',
    'south africa women': 'South Africa Women',
    'west indies women': 'West Indies Women',
    'pakistan women': 'Pakistan Women',
    'bangladesh women': 'Bangladesh Women',
    'zimbabwe women': 'Zimbabwe Women',
    'sri lanka women': 'Sri Lanka Women',
    'ireland women': 'Ireland Women',
  };
  return lookup[name.toLowerCase().trim()] || name;
}

export function getTeamColor(team: string): string {
  if (!team) return '#6B7280';

  const normalized = normalizeTeamName(team);

  const nationalColor = NATIONAL_TEAMS[normalized];
  if (nationalColor) return nationalColor;

  const cricketColor = CRICKET_TEAMS[normalized];
  if (cricketColor) return cricketColor;

  const clubColor = CLUB_TEAMS[normalized];
  if (clubColor) return clubColor;

  const hash = hashTeamName(team);
  return hslFromHash(hash);
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    return `rgba(107, 114, 128, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isColorLight(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }
  return false;
}

export function lightenColor(hex: string, amount: number = 30): string {
  if (!hex || hex.startsWith('hsl')) {
    return hex;
  }
  const clean = hex.replace('#', '');
  let r: number, g: number, b: number;

  if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    return hex;
  }

  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getTeamColorStyle(team: string): { color: string; lighter: string; rgba: (alpha: number) => string; isLight: boolean } {
  const color = getTeamColor(team);
  const lighter = color.startsWith('hsl') ? color : lightenColor(color, 40);
  const isLight = color.startsWith('hsl') ? false : isColorLight(color);
  return {
    color,
    lighter,
    rgba: (alpha: number) => color.startsWith('hsl') ? `hsla(${color.match(/\d+/g)?.[0] ?? '0'}, 70%, 50%, ${alpha})` : hexToRgba(color, alpha),
    isLight,
  };
}

const DRAW_COLOR = '#6B7280';
const DRAW_COLOR_LIGHTER = '#9CA3AF';

export function getBarColor(team: string | 'draw'): { base: string; gradient: string; glow: string } {
  if (team === 'draw') {
    return {
      base: DRAW_COLOR,
      gradient: `linear-gradient(90deg, ${DRAW_COLOR}, ${DRAW_COLOR_LIGHTER})`,
      glow: `0 0 12px ${hexToRgba(DRAW_COLOR, 0.45)}`,
    };
  }

  const style = getTeamColorStyle(team);
  const base = style.color;
  const gradient = `linear-gradient(90deg, ${base}, ${style.lighter})`;
  const glow = `0 0 12px ${style.rgba(0.45)}`;
  return { base, gradient, glow };
}

export function getTextColorForTeam(team: string): string {
  const style = getTeamColorStyle(team);
  if (team === 'draw') return DRAW_COLOR;
  if (style.isLight) return '#374151';
  return style.color;
}
