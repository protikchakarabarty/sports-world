const KNOCKOUT_STAGES = new Set([
  'ROUND_OF_32', 'ROUND_OF_16', 'ROUND_OF_8',
  'QUARTER_FINALS', 'QUARTER_FINAL', 'QUARTERFINALS', 'QUARTERFINAL',
  'SEMI_FINALS', 'SEMI_FINAL', 'SEMIFINALS', 'SEMIFINAL',
  'THIRD_PLACE', 'THIRD_PLACE_PLAYOFF', '3RD_PLACE',
  'FINAL', 'GRAND_FINAL',
  'PLAYOFFS', 'PLAYOFF',
  'PRELIMINARY_FINAL', 'PRELIMINARY',
  'KNOCKOUT', 'KNOCKOUT_STAGE',
  'ROUND 1', 'ROUND 2', 'ROUND 3',
  'FIRST_ROUND', 'SECOND_ROUND', 'THIRD_ROUND',
  'LAST_32', 'LAST_16', 'LAST_8',
  'EIGHTHFINALS', 'QUARTERFINALS',
]);

export function isKnockoutStage(stage: string): boolean {
  if (!stage) return false;
  const upper = stage.toUpperCase().replace(/\s+/g, '_');
  if (upper.includes('GROUP')) return false;
  return KNOCKOUT_STAGES.has(upper) || [...KNOCKOUT_STAGES].some((k) => upper.includes(k));
}

export function getPredictionOptions(homeTeam: string, awayTeam: string, isKnockout: boolean): readonly string[] {
  if (isKnockout) return [homeTeam, awayTeam] as const;
  return [homeTeam, awayTeam, 'Draw'] as const;
}
