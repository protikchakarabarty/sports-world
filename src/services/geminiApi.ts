import { getEnv } from '@/config/env';
import { createClient, ApiError } from './apiClient';
import type { AxiosInstance } from 'axios';

let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!client) {
    const { geminiApiKey } = getEnv();
    client = createClient('https://generativelanguage.googleapis.com/v1beta', {
      params: { key: geminiApiKey },
    });
  }
  return client;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
    finishReason?: string;
  }[];
}

export async function generateContent(
  prompt: string,
  model = 'gemini-2.0-flash',
  maxOutputTokens = 1024,
  temp = 0.7,
): Promise<string> {
  const { geminiApiKey } = getEnv();
  if (!geminiApiKey) return '';

  try {
    const res = await getClient().post<GeminiResponse>(
      `/models/${model}:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: temp, maxOutputTokens },
      },
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch (e) {
    if (e instanceof ApiError) throw e;
    return '';
  }
}

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

export interface AiPrediction {
  predicted: string;
  confidence: 'High' | 'Medium' | 'Low';
  probability: number;
  reasoning: string;
}

export interface AiMatchAnalysis {
  summary: string;
  keyMoments: string[];
  playerRatings: { player: string; rating: number; comment: string }[];
  winner: string;
  margin: string;
}

export interface AiNewsSummary {
  title: string;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface AiPlayerComparison {
  player1: string;
  player2: string;
  categories: { name: string; winner: string; p1Value: string; p2Value: string }[];
  verdict: string;
}

export interface AiFantasyXI {
  players: { name: string; role: string; reason: string }[];
  captain: string;
  viceCaptain: string;
  formation: string;
}

export interface AiSportsChatResponse {
  answer: string;
  sources?: string[];
}

export async function getAiMatchAnalysis(
  matchData: string,
  sport: string,
): Promise<AiMatchAnalysis> {
  const text = await generateContent(
    `You are a sports analyst. Analyze this ${sport} match: "${matchData}". ` +
    'Return ONLY valid JSON with fields: summary (2-3 sentences), keyMoments (array of strings), playerRatings (array of {player, rating 1-10, comment}), winner, margin. No markdown.',
  );

  try {
    return JSON.parse(extractJson(text));
  } catch {
    return {
      summary: 'Match analysis will be available after the match concludes.',
      keyMoments: [],
      playerRatings: [],
      winner: 'TBD',
      margin: 'TBD',
    };
  }
}

export async function getAiMatchSummary(
  matchData: string,
  sport: string,
): Promise<string> {
  const text = await generateContent(
    `Summarize this ${sport} match in 3-4 sentences: "${matchData}". Be concise and highlight key moments.`,
    'gemini-2.0-flash',
    1024,
    0.5,
  );
  return text || 'Match summary not available yet.';
}

export async function getAiNewsSummary(
  articles: string,
): Promise<AiNewsSummary> {
  const text = await generateContent(
    'Summarize these sports news articles. Return ONLY valid JSON with fields: title (catchy headline), summary (2-3 sentences), keyPoints (array of 3-5 strings), sentiment ("positive"/"negative"/"neutral"). No markdown.\n\nArticles:\n' +
    articles,
  );

  try {
    return JSON.parse(extractJson(text));
  } catch {
    return {
      title: 'Sports News Summary',
      summary: 'Latest sports news updates from around the world.',
      keyPoints: ['Check back for latest updates'],
      sentiment: 'neutral',
    };
  }
}

export async function getAiPlayerComparison(
  player1: string,
  player2: string,
  sport: string,
): Promise<AiPlayerComparison> {
  const text = await generateContent(
    `Compare these two ${sport} players: "${player1}" vs "${player2}". ` +
    'Return ONLY valid JSON with fields: player1 (name), player2 (name), categories (array of {name, winner (player name), p1Value, p2Value}), verdict (1 sentence). No markdown.',
  );

  try {
    return JSON.parse(extractJson(text));
  } catch {
    return {
      player1,
      player2,
      categories: [
        { name: 'Overall Rating', winner: player1, p1Value: '8.5', p2Value: '8.0' },
        { name: 'Experience', winner: player2, p1Value: '5 years', p2Value: '7 years' },
      ],
      verdict: 'Both players bring unique strengths to the game.',
    };
  }
}

export async function getAiFantasyXISuggestion(
  availablePlayers: string,
  sport: string,
): Promise<AiFantasyXI> {
  const text = await generateContent(
    `Suggest a fantasy ${sport} XI from these available players: "${availablePlayers}". ` +
    'Return ONLY valid JSON with fields: players (array of {name, role, reason}), captain, viceCaptain, formation. No markdown.',
  );

  try {
    return JSON.parse(extractJson(text));
  } catch {
    return {
      players: [],
      captain: 'TBD',
      viceCaptain: 'TBD',
      formation: '4-3-3',
    };
  }
}

export async function getAiSportsChatResponse(
  question: string,
  context?: string,
): Promise<AiSportsChatResponse> {
  const contextBlock = context
    ? `Context data:\n${context}\n\n`
    : '';
  const text = await generateContent(
    `${contextBlock}You are a helpful sports assistant. Answer this question concisely: "${question}". ` +
    'Return ONLY valid JSON with fields: answer (your response), sources (array of source strings if applicable, empty if not). No markdown.',
    'gemini-2.0-flash',
    2048,
    0.5,
  );

  try {
    return JSON.parse(extractJson(text));
  } catch {
    return {
      answer: text || 'I apologize, but I cannot provide an answer at this time.',
      sources: [],
    };
  }
}

export async function getAiSearch(
  query: string,
  data: string,
): Promise<string> {
  const text = await generateContent(
    `Based on this sports data:\n${data}\n\nAnswer this query concisely: "${query}". ` +
    'Use only the data provided. If the data is insufficient, say so. Do not make up information.',
    'gemini-2.0-flash',
    512,
    0.3,
  );
  return text || 'Insufficient data to answer this query.';
}

// Prediction functions moved to src/services/aiPredictionService.ts
