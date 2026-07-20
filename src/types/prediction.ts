import type { AiPrediction } from '@/services/geminiApi';

export interface AiExtendedPrediction extends AiPrediction {
  homeProbability: number;
  awayProbability: number;
  drawProbability: number;
  predictedScore: string;
  homeXg: number | null;
  awayXg: number | null;
  homePossession: number | null;
  awayPossession: number | null;
  homeShots: number | null;
  awayShots: number | null;
  homeCorners: number | null;
  awayCorners: number | null;
  homeCleanSheetChance: number | null;
  awayCleanSheetChance: number | null;
  upsetChance: number | null;
  starPlayer: string | null;
  starPlayerReason: string | null;
  homeMomentum: number | null;
  awayMomentum: number | null;
  keyReasons: string[];
  isKnockout: boolean;
}

export interface MatchPredictionInput {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  stage: string;
  isKnockout: boolean;
  teamContext?: string;
}

export function fallbackExtendedPrediction(_isKnockout: boolean, homeTeam: string, awayTeam: string): AiExtendedPrediction {
  return {
    predicted: '',
    confidence: 'Low',
    probability: 0,
    reasoning: 'AI prediction unavailable.',
    homeProbability: 0,
    awayProbability: 0,
    drawProbability: 0,
    predictedScore: '-',
    homeXg: null,
    awayXg: null,
    homePossession: null,
    awayPossession: null,
    homeShots: null,
    awayShots: null,
    homeCorners: null,
    awayCorners: null,
    homeCleanSheetChance: null,
    awayCleanSheetChance: null,
    upsetChance: null,
    starPlayer: null,
    starPlayerReason: null,
    homeMomentum: null,
    awayMomentum: null,
    keyReasons: [],
    isKnockout: _isKnockout,
  };
}

export function redistributeKnockoutProbs(home: number, draw: number, away: number): { homeProbability: number; awayProbability: number } {
  const total = home + away;
  if (total <= 0) return { homeProbability: 50, awayProbability: 50 };
  let h = Math.round((home / total) * 100);
  let a = Math.round((away / total) * 100);
  if (h + a !== 100) {
    if (h > a) h += 100 - (h + a);
    else a += 100 - (h + a);
  }
  return { homeProbability: h, awayProbability: a };
}
