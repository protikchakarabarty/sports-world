import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import type { InjuryReport } from '@/types';

const INJURY_QUERIES = [
  'football injury update',
  'player injured match',
  'injury list premier league',
  'football player injury news',
];

const CACHE_TTL = 60 * 60 * 1000;

let cached: { data: InjuryReport[]; ts: number } | null = null;

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

async function searchInjuryArticles(): Promise<NormalizedArticle[]> {
  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];

  for (const query of INJURY_QUERIES) {
    if (articles.length >= 15) break;
    const results = await searchNews(query, 5, 'football');
    for (const article of results) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        articles.push(article);
      }
    }
  }

  return articles.slice(0, 15);
}

function buildPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');

  return `Extract football player injury/suspension data from these news articles. Return ONLY a valid JSON array. Each object must have: player (full name), team (club name), injury (injury/absence reason), returnDate (estimated return or "Unknown"), status (exactly one of: "day-to-day", "injured", "out"). If no injury data is found in an article, skip it. If none of the articles contain injury information, return an empty array []. No markdown, no explanation.

Articles:
${items}`;
}

export async function getInjuries(): Promise<InjuryReport[]> {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log(`[InjuryService] Cache HIT — ${cached.data.length} injuries`);
    return cached.data;
  }

  try {
    console.log('[InjuryService] Searching injury news...');
    const articles = await searchInjuryArticles();

    if (!articles.length) {
      console.log('[InjuryService] No articles found');
      cached = { data: [], ts: Date.now() };
      return [];
    }

    console.log(`[InjuryService] Found ${articles.length} articles, extracting with Gemini...`);
    const prompt = buildPrompt(articles);
    const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);

    if (!text) {
      console.log('[InjuryService] Gemini returned empty');
      cached = { data: [], ts: Date.now() };
      return [];
    }

    const parsed = JSON.parse(extractJson(text)) as InjuryReport[];

    if (!Array.isArray(parsed)) {
      console.log('[InjuryService] Gemini response was not an array');
      cached = { data: [], ts: Date.now() };
      return [];
    }

    const results = parsed.map((r, i) => ({
      ...r,
      id: `inj-${i}-${Date.now()}`,
      status: (['day-to-day', 'injured', 'out'].includes(r.status) ? r.status : 'injured') as InjuryReport['status'],
    }));

    console.log(`[InjuryService] Extracted ${results.length} injuries`);
    cached = { data: results, ts: Date.now() };
    return results;
  } catch (err) {
    console.error('[InjuryService] Failed:', err instanceof Error ? err.message : String(err));
    cached = { data: [], ts: Date.now() };
    return [];
  }
}
