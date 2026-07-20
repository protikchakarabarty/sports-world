import type { AiPrediction } from './geminiApi';
import type { AiExtendedPrediction, MatchPredictionInput } from '@/types/prediction';
import { fallbackExtendedPrediction, redistributeKnockoutProbs } from '@/types/prediction';
import type { AiMatchInfo } from './providers/sportmonksProvider';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama-3.1-8b-instant';

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY || '';
}

interface CacheEntry {
  data: unknown;
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60;

function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function cacheSet(key: string, data: unknown): void {
  if (cache.size >= 100) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  cache.set(key, { data, ts: Date.now() });
}

function cacheKey(...parts: string[]): string {
  return parts.join('||');
}

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

async function groqChat(
  messages: { role: string; content: string }[],
  model?: string,
  maxTokens = 1024,
  temp = 0.7,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Groq API key not configured');

  const body = {
    model: model ?? PRIMARY_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature: temp,
  };

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited by Groq');
    const text = await res.text().catch(() => '');
    throw new Error(`Groq API error: ${res.status}`);
  }

  const data = await res.json() as { choices: { message: { content: string }; finish_reason: string }[] };
  return data.choices?.[0]?.message?.content ?? '';
}

async function groqChatWithFallback(
  messages: { role: string; content: string }[],
  maxTokens = 1024,
  temp = 0.7,
): Promise<string> {
  try {
    return await groqChat(messages, PRIMARY_MODEL, maxTokens, temp);
  } catch (primaryErr) {
    console.warn(`[AI] Primary model failed, trying fallback:`, (primaryErr as Error)?.message);
    try {
      return await groqChat(messages, FALLBACK_MODEL, maxTokens, temp);
    } catch {
      throw primaryErr;
    }
  }
}

export async function getFootballMatchPrediction(input: MatchPredictionInput): Promise<AiExtendedPrediction> {
  const { homeTeam, awayTeam, competition, stage, isKnockout } = input;
  const label = `${homeTeam} vs ${awayTeam} (${competition})`;
  const stageLine = stage ? `Stage: ${stage}` : '';

  const ckey = cacheKey('football-prediction', homeTeam, awayTeam, competition, stage);
  const cached = cacheGet<AiExtendedPrediction>(ckey);
  if (cached) {
    console.log('[AI] 🏆 Cache HIT for football prediction', label);
    return cached;
  }

  const koLine = isKnockout
    ? 'This is a KNOCKOUT match — a draw is impossible. There MUST NOT be a draw prediction. homeProbability + awayProbability MUST equal 100. drawProbability MUST be 0.'
    : 'This is a league/group stage match — a draw is possible. homeProbability + drawProbability + awayProbability MUST equal 100.';

  const contextBlock = input.teamContext
    ? `\n\nActual team context (current season standings/form):\n${input.teamContext}`
    : '';

  const prompt = `You are a world-class football match predictor. Predict this match accurately using current form, team strength, and statistics.

Match: ${homeTeam} vs ${awayTeam}
Competition: ${competition}
${stageLine}
${koLine}${contextBlock}

Return ONLY valid JSON with these EXACT fields:
- "predicted": The predicted winner (team name) — for knockout, this MUST be one of the two teams, never "Draw"
- "confidence": "High", "Medium", or "Low"
- "homeProbability": win probability for ${homeTeam} (integer 0-100)
- "awayProbability": win probability for ${awayTeam} (integer 0-100)
- "drawProbability": draw probability (integer 0-100; ${isKnockout ? 'MUST be 0' : '0-100'})
- "predictedScore": predicted exact score, e.g. "${homeTeam} 2-1 ${awayTeam}"
- "homeXg": expected goals for ${homeTeam} (float, e.g. 1.78)
- "awayXg": expected goals for ${awayTeam} (float, e.g. 1.52)
- "homePossession": predicted possession for ${homeTeam} (integer 0-100)
- "awayPossession": predicted possession for ${awayTeam} (integer 0-100)
- "homeShots": predicted shots for ${homeTeam} (integer)
- "awayShots": predicted shots for ${awayTeam} (integer)
- "homeCorners": predicted corners for ${homeTeam} (integer)
- "awayCorners": predicted corners for ${awayTeam} (integer)
- "homeCleanSheetChance": clean sheet probability for ${homeTeam} (integer 0-100)
- "awayCleanSheetChance": clean sheet probability for ${awayTeam} (integer 0-100)
- "upsetChance": probability of an upset result (integer 0-100)
- "starPlayer": name of one key player expected to influence the match
- "starPlayerReason": why this star player is important (one sentence)
- "homeMomentum": momentum rating for ${homeTeam} (integer 0-100)
- "awayMomentum": momentum rating for ${awayTeam} (integer 0-100)
- "keyReasons": array of 3-5 bullet points explaining the prediction (strings)
- "reasoning": 2-3 sentence summary of the prediction

Probability rules:
${isKnockout ? 'homeProbability + awayProbability = 100, drawProbability = 0' : 'homeProbability + drawProbability + awayProbability = 100'}

No markdown, no extra explanation — only JSON.`;

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }], 1500, 0.7);
    const parsed = JSON.parse(extractJson(text));

    let homeP = typeof parsed.homeProbability === 'number' ? parsed.homeProbability : 33;
    let drawP = typeof parsed.drawProbability === 'number' ? parsed.drawProbability : (isKnockout ? 0 : 34);
    let awayP = typeof parsed.awayProbability === 'number' ? parsed.awayProbability : 33;

    if (isKnockout) {
      if (drawP > 0 || homeP + awayP !== 100) {
        const redist = redistributeKnockoutProbs(homeP, drawP, awayP);
        homeP = redist.homeProbability;
        awayP = redist.awayProbability;
        drawP = 0;
      }
    }

    const predictedRaw = parsed.predicted ?? '';
    let predicted = '';
    if (isKnockout && (!predictedRaw || predictedRaw === 'Draw')) {
      predicted = homeP >= awayP ? homeTeam : awayTeam;
    } else {
      predicted = predictedRaw || (homeP >= awayP ? homeTeam : awayTeam);
    }

    const result: AiExtendedPrediction = {
      predicted,
      confidence: ['High', 'Medium', 'Low'].includes(parsed.confidence) ? parsed.confidence : 'Medium',
      probability: isKnockout ? Math.max(homeP, awayP) : Math.max(homeP, drawP, awayP),
      reasoning: parsed.reasoning ?? '',
      homeProbability: homeP,
      awayProbability: awayP,
      drawProbability: drawP,
      predictedScore: typeof parsed.predictedScore === 'string' ? parsed.predictedScore : '-',
      homeXg: typeof parsed.homeXg === 'number' ? parsed.homeXg : null,
      awayXg: typeof parsed.awayXg === 'number' ? parsed.awayXg : null,
      homePossession: typeof parsed.homePossession === 'number' ? parsed.homePossession : null,
      awayPossession: typeof parsed.awayPossession === 'number' ? parsed.awayPossession : null,
      homeShots: typeof parsed.homeShots === 'number' ? parsed.homeShots : null,
      awayShots: typeof parsed.awayShots === 'number' ? parsed.awayShots : null,
      homeCorners: typeof parsed.homeCorners === 'number' ? parsed.homeCorners : null,
      awayCorners: typeof parsed.awayCorners === 'number' ? parsed.awayCorners : null,
      homeCleanSheetChance: typeof parsed.homeCleanSheetChance === 'number' ? parsed.homeCleanSheetChance : null,
      awayCleanSheetChance: typeof parsed.awayCleanSheetChance === 'number' ? parsed.awayCleanSheetChance : null,
      upsetChance: typeof parsed.upsetChance === 'number' ? parsed.upsetChance : null,
      starPlayer: typeof parsed.starPlayer === 'string' ? parsed.starPlayer : null,
      starPlayerReason: typeof parsed.starPlayerReason === 'string' ? parsed.starPlayerReason : null,
      homeMomentum: typeof parsed.homeMomentum === 'number' ? parsed.homeMomentum : null,
      awayMomentum: typeof parsed.awayMomentum === 'number' ? parsed.awayMomentum : null,
      keyReasons: Array.isArray(parsed.keyReasons) ? parsed.keyReasons : [],
      isKnockout,
    };
    cacheSet(ckey, result);
    return result;
  } catch (err) {
    console.warn('[AI] Prediction failed:', (err as Error)?.message);
    const fallback = fallbackExtendedPrediction(isKnockout, homeTeam, awayTeam);
    cacheSet(ckey, fallback);
    return fallback;
  }
}

export async function generateAllMatchPredictions(
  matches: AiMatchInfo[],
  teamContexts?: Map<string, string>,
): Promise<Map<string, AiExtendedPrediction>> {
  const results = new Map<string, AiExtendedPrediction>();

  const inputs: MatchPredictionInput[] = matches.map(m => {
    const homeCtx = teamContexts?.get(m.homeTeam) ?? '';
    const awayCtx = teamContexts?.get(m.awayTeam) ?? '';
    const contextStr = homeCtx || awayCtx
      ? `${m.homeTeam}: ${homeCtx}\n${m.awayTeam}: ${awayCtx}`
      : '';
    return {
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      competition: m.competition,
      stage: '',
      isKnockout: m.isKnockout,
      teamContext: contextStr || undefined,
    };
  });

  console.log(`[AI] Generating ${matches.length} predictions in parallel...`);

  const predictions = await Promise.all(
    inputs.map(input =>
      getFootballMatchPrediction(input).catch(() => {
        console.warn(`[AI] Prediction failed for ${input.homeTeam} vs ${input.awayTeam}`);
        return fallbackExtendedPrediction(input.isKnockout, input.homeTeam, input.awayTeam);
      })
    )
  );

  matches.forEach((m, i) => results.set(m.id, predictions[i]));

  console.log(`[AI] Generated ${results.size} predictions`);

  return results;
}

export async function getAiMatchPrediction(matchInfo: string, _sport: string): Promise<AiPrediction> {
  return getAiPrediction(matchInfo, []);
}

export async function getAiPrediction(question: string, options: string[]): Promise<AiPrediction> {
  if (!question || options.length < 2) {
    return fallbackPrediction();
  }

  const ckey = cacheKey('prediction', question, ...options);
  const cached = cacheGet<AiPrediction>(ckey);
  if (cached) {
    console.log('[AI] 🏆 Cache HIT for prediction');
    return cached;
  }

  const optionsText = options.map((o, i) => `${i + 1}. ${o}`).join('\n');
  const prompt =
    `You are a sports prediction AI. Given this question: "${question}" with these options:\n${optionsText}\n\n` +
    'Return ONLY valid JSON with these fields:\n' +
    '- "predicted": the predicted winner (one of the options)\n' +
    '- "confidence": "High", "Medium", or "Low"\n' +
    '- "probability": win probability for the predicted winner (0-100)\n' +
    '- "reasoning": 2-3 sentences explaining the prediction\n' +
    '- "keyPlayers": array of 1-2 key player names\n' +
    '- "scoreline": predicted score or result (e.g., "2-1" for football, "250-7" for cricket)\n' +
    'No markdown, no explanation — just JSON.';

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }]);
    const parsed = JSON.parse(extractJson(text));
    const result: AiPrediction = {
      predicted: parsed.predicted ?? options[0],
      confidence: ['High', 'Medium', 'Low'].includes(parsed.confidence) ? parsed.confidence : 'Medium',
      probability: typeof parsed.probability === 'number' ? parsed.probability : 50,
      reasoning: parsed.reasoning ?? '',
    };
    cacheSet(ckey, result);
    return result;
  } catch (err) {
    console.warn('[AI] Prediction failed:', (err as Error)?.message);
    const fallback = fallbackPrediction();
    cacheSet(ckey, fallback);
    return fallback;
  }
}

function fallbackPrediction(): AiPrediction {
  return {
    predicted: 'Unavailable',
    confidence: 'Low',
    probability: 50,
    reasoning: 'AI prediction temporarily unavailable.',
  };
}

export async function getFootballPredictionPoll<T>(): Promise<T> {
  const ckey = cacheKey('poll-football');
  const cached = cacheGet<T>(ckey);
  if (cached) return cached;

  const prompt =
    'Create a football fan prediction poll about the current season (2025-26). ' +
    'Return ONLY valid JSON with fields: id (string), question (string), options (array of 4 strings), votes (array of 4 numbers), totalVotes (number). ' +
    'Make the question about a major upcoming match or tournament. No markdown — just JSON.';

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }]);
    const result = JSON.parse(extractJson(text)) as T;
    cacheSet(ckey, result);
    return result;
  } catch {
    throw new Error('AI poll generation failed');
  }
}

export async function getCricketPredictionPoll<T>(): Promise<T> {
  const ckey = cacheKey('poll-cricket');
  const cached = cacheGet<T>(ckey);
  if (cached) return cached;

  const prompt =
    'Create a cricket fan prediction poll about the current season. ' +
    'Return ONLY valid JSON with fields: id (string), question (string), options (array of 4 strings), votes (array of 4 numbers), totalVotes (number). ' +
    'Make the question about an upcoming ICC tournament or major series. No markdown — just JSON.';

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }]);
    const result = JSON.parse(extractJson(text)) as T;
    cacheSet(ckey, result);
    return result;
  } catch {
    throw new Error('AI poll generation failed');
  }
}

export async function getWomenMatchPrediction(input: MatchPredictionInput): Promise<AiExtendedPrediction> {
  const { homeTeam, awayTeam, competition, stage, isKnockout } = input;
  const label = `${homeTeam} vs ${awayTeam} (${competition})`;
  const stageLine = stage ? `Stage: ${stage}` : '';

  const ckey = cacheKey('women-prediction', homeTeam, awayTeam, competition, stage);
  const cached = cacheGet<AiExtendedPrediction>(ckey);
  if (cached) {
    console.log('[AI] 🏆 Cache HIT for women football prediction', label);
    return cached;
  }

  const koLine = isKnockout
    ? 'This is a KNOCKOUT match — a draw is impossible. There MUST NOT be a draw prediction. homeProbability + awayProbability MUST equal 100. drawProbability MUST be 0.'
    : 'This is a league/group stage match — a draw is possible. homeProbability + drawProbability + awayProbability MUST equal 100.';

  const contextBlock = input.teamContext
    ? `\n\nActual team context (current season standings/form):\n${input.teamContext}`
    : '';

  const prompt = `You are a world-class women's football match predictor. Predict this match accurately using current form, team strength, and statistics.

Match: ${homeTeam} vs ${awayTeam}
Competition: ${competition}
${stageLine}
${koLine}${contextBlock}

Return ONLY valid JSON with these EXACT fields:
- "predicted": The predicted winner (team name) — for knockout, this MUST be one of the two teams, never "Draw"
- "confidence": "High", "Medium", or "Low"
- "homeProbability": win probability for ${homeTeam} (integer 0-100)
- "awayProbability": win probability for ${awayTeam} (integer 0-100)
- "drawProbability": draw probability (integer 0-100; ${isKnockout ? 'MUST be 0' : '0-100'})
- "predictedScore": predicted exact score, e.g. "${homeTeam} 2-1 ${awayTeam}"
- "homeXg": expected goals for ${homeTeam} (float, e.g. 1.78)
- "awayXg": expected goals for ${awayTeam} (float, e.g. 1.52)
- "homePossession": predicted possession for ${homeTeam} (integer 0-100)
- "awayPossession": predicted possession for ${awayTeam} (integer 0-100)
- "homeShots": predicted shots for ${homeTeam} (integer)
- "awayShots": predicted shots for ${awayTeam} (integer)
- "homeCorners": predicted corners for ${homeTeam} (integer)
- "awayCorners": predicted corners for ${awayTeam} (integer)
- "homeCleanSheetChance": clean sheet probability for ${homeTeam} (integer 0-100)
- "awayCleanSheetChance": clean sheet probability for ${awayTeam} (integer 0-100)
- "upsetChance": probability of an upset result (integer 0-100)
- "starPlayer": name of one key player expected to influence the match
- "starPlayerReason": why this star player is important (one sentence)
- "homeMomentum": momentum rating for ${homeTeam} (integer 0-100)
- "awayMomentum": momentum rating for ${awayTeam} (integer 0-100)
- "keyReasons": array of 3-5 bullet points explaining the prediction (strings)
- "reasoning": 2-3 sentence summary of the prediction

Probability rules:
${isKnockout ? 'homeProbability + awayProbability = 100, drawProbability = 0' : 'homeProbability + drawProbability + awayProbability = 100'}

No markdown, no extra explanation — only JSON.`;

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }], 1500, 0.7);
    const parsed = JSON.parse(extractJson(text));

    let homeP = typeof parsed.homeProbability === 'number' ? parsed.homeProbability : 33;
    let drawP = typeof parsed.drawProbability === 'number' ? parsed.drawProbability : (isKnockout ? 0 : 34);
    let awayP = typeof parsed.awayProbability === 'number' ? parsed.awayProbability : 33;

    if (isKnockout) {
      if (drawP > 0 || homeP + awayP !== 100) {
        const redist = redistributeKnockoutProbs(homeP, drawP, awayP);
        homeP = redist.homeProbability;
        awayP = redist.awayProbability;
        drawP = 0;
      }
    }

    const predictedRaw = parsed.predicted ?? '';
    let predicted = '';
    if (isKnockout && (!predictedRaw || predictedRaw === 'Draw')) {
      predicted = homeP >= awayP ? homeTeam : awayTeam;
    } else {
      predicted = predictedRaw || (homeP >= awayP ? homeTeam : awayTeam);
    }

    const result: AiExtendedPrediction = {
      predicted,
      confidence: ['High', 'Medium', 'Low'].includes(parsed.confidence) ? parsed.confidence : 'Medium',
      probability: isKnockout ? Math.max(homeP, awayP) : Math.max(homeP, drawP, awayP),
      reasoning: parsed.reasoning ?? '',
      homeProbability: homeP,
      awayProbability: awayP,
      drawProbability: drawP,
      predictedScore: typeof parsed.predictedScore === 'string' ? parsed.predictedScore : '-',
      homeXg: typeof parsed.homeXg === 'number' ? parsed.homeXg : null,
      awayXg: typeof parsed.awayXg === 'number' ? parsed.awayXg : null,
      homePossession: typeof parsed.homePossession === 'number' ? parsed.homePossession : null,
      awayPossession: typeof parsed.awayPossession === 'number' ? parsed.awayPossession : null,
      homeShots: typeof parsed.homeShots === 'number' ? parsed.homeShots : null,
      awayShots: typeof parsed.awayShots === 'number' ? parsed.awayShots : null,
      homeCorners: typeof parsed.homeCorners === 'number' ? parsed.homeCorners : null,
      awayCorners: typeof parsed.awayCorners === 'number' ? parsed.awayCorners : null,
      homeCleanSheetChance: typeof parsed.homeCleanSheetChance === 'number' ? parsed.homeCleanSheetChance : null,
      awayCleanSheetChance: typeof parsed.awayCleanSheetChance === 'number' ? parsed.awayCleanSheetChance : null,
      upsetChance: typeof parsed.upsetChance === 'number' ? parsed.upsetChance : null,
      starPlayer: typeof parsed.starPlayer === 'string' ? parsed.starPlayer : null,
      starPlayerReason: typeof parsed.starPlayerReason === 'string' ? parsed.starPlayerReason : null,
      homeMomentum: typeof parsed.homeMomentum === 'number' ? parsed.homeMomentum : null,
      awayMomentum: typeof parsed.awayMomentum === 'number' ? parsed.awayMomentum : null,
      keyReasons: Array.isArray(parsed.keyReasons) ? parsed.keyReasons : [],
      isKnockout,
    };
    cacheSet(ckey, result);
    return result;
  } catch (err) {
    console.warn('[AI] Women prediction failed:', (err as Error)?.message);
    const fallback = fallbackExtendedPrediction(isKnockout, homeTeam, awayTeam);
    cacheSet(ckey, fallback);
    return fallback;
  }
}

export async function generateAllWomenMatchPredictions(
  matches: AiMatchInfo[],
  teamContexts?: Map<string, string>,
): Promise<Map<string, AiExtendedPrediction>> {
  const results = new Map<string, AiExtendedPrediction>();

  const inputs: MatchPredictionInput[] = matches.map(m => {
    const homeCtx = teamContexts?.get(m.homeTeam) ?? '';
    const awayCtx = teamContexts?.get(m.awayTeam) ?? '';
    const contextStr = homeCtx || awayCtx
      ? `${m.homeTeam}: ${homeCtx}\n${m.awayTeam}: ${awayCtx}`
      : '';
    return {
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      competition: m.competition,
      stage: '',
      isKnockout: m.isKnockout,
      teamContext: contextStr || undefined,
    };
  });

  console.log(`[AI] Generating ${matches.length} women's match predictions in parallel...`);

  const predictions = await Promise.all(
    inputs.map(input =>
      getWomenMatchPrediction(input).catch(() => {
        console.warn(`[AI] Women prediction failed for ${input.homeTeam} vs ${input.awayTeam}`);
        return fallbackExtendedPrediction(input.isKnockout, input.homeTeam, input.awayTeam);
      })
    )
  );

  matches.forEach((m, i) => results.set(m.id, predictions[i]));

  console.log(`[AI] Generated ${results.size} women's predictions`);

  return results;
}

export async function getWomenPredictionPoll<T>(): Promise<T> {
  const ckey = cacheKey('poll-women-football');
  const cached = cacheGet<T>(ckey);
  if (cached) return cached;

  const prompt =
    "Create a women's football fan prediction poll about the current season (2025-26). " +
    'Return ONLY valid JSON with fields: id (string), question (string), options (array of 4 strings), votes (array of 4 numbers), totalVotes (number). ' +
    "Make the question about a major upcoming women's match or tournament. No markdown — just JSON.";

  try {
    const text = await groqChatWithFallback([{ role: 'user', content: prompt }]);
    const result = JSON.parse(extractJson(text)) as T;
    cacheSet(ckey, result);
    return result;
  } catch {
    throw new Error('AI women poll generation failed');
  }
}
