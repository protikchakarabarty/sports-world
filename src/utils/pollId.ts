export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function derivePollId(competition: string, homeTeam: string, awayTeam: string): string {
  return `${slug(competition)}-${slug(homeTeam)}-${slug(awayTeam)}`;
}

export function derivePollQuestion(homeTeam: string, awayTeam: string): string {
  return `Who will win: ${homeTeam} vs ${awayTeam}?`;
}
