export const COMPETITIONS = {
  PREMIER_LEAGUE: 'PL',
  LA_LIGA: 'PD',
  BUNDESLIGA: 'BL1',
  SERIE_A: 'SA',
  LIGUE_1: 'FL1',
  EREDIVISIE: 'DED',
  PRIMEIRA_LIGA: 'PPL',
  CHAMPIONS_LEAGUE: 'CL',
} as const;

export function getCurrentSeason(): number {
  const now = new Date();
  const month = now.getMonth() + 1;
  return month >= 8 ? now.getFullYear() : now.getFullYear() - 1;
}

export const TOP_LEAGUES = [
  COMPETITIONS.PREMIER_LEAGUE,
  COMPETITIONS.LA_LIGA,
  COMPETITIONS.BUNDESLIGA,
  COMPETITIONS.SERIE_A,
  COMPETITIONS.LIGUE_1,
] as const;
