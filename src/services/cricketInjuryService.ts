import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import type { InjuryReport } from '@/types';
import { cricketInjuries, womensCricketInjuries } from '@/data/mockData';

const INJURY_QUERIES = [
  'cricket injury update',
  'cricket player injured match',
  'international cricket injury news',
  'cricket player injury return',
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
    const results = await searchNews(query, 5, 'cricket');
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

  return `Extract cricket player injury/suspension data from these news articles. Return ONLY a valid JSON array. Each object must have: player (full name), team (country or team name), injury (injury/absence reason), returnDate (estimated return or "Unknown"), status (exactly one of: "day-to-day", "injured", "out"). If no injury data is found in an article, skip it. If none of the articles contain injury information, return an empty array []. No markdown, no explanation.

Articles:
${items}`;
}

export async function getCricketInjuries(gender: string): Promise<InjuryReport[]> {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    const filtered = cached.data.filter((i) => {
      if (gender === 'women') return i.team.toLowerCase().includes('women') || ['Sophie Ecclestone', 'Shafali Verma', 'Megan Schutt', 'Stafanie Taylor', 'Alyssa Healy', 'Ellyse Perry', 'Beth Mooney', 'Nat Sciver-Brunt', 'Deepti Sharma', 'Smriti Mandhana', 'Harmanpreet Kaur', 'Marizanne Kapp', 'Laura Wolvaardt', 'Amelia Kerr', 'Hayley Matthews'].includes(i.player);
      return true;
    });
    console.log(`[CricketInjuryService] Cache HIT — ${filtered.length} injuries`);
    return filtered;
  }

  try {
    console.log('[CricketInjuryService] Searching injury news...');
    const articles = await searchInjuryArticles();

    if (articles.length > 0) {
      console.log(`[CricketInjuryService] Found ${articles.length} articles, extracting with Gemini...`);
      const prompt = buildPrompt(articles);
      const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);

      if (text) {
        const parsed = JSON.parse(extractJson(text)) as InjuryReport[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          const results = parsed.map((r, i) => ({
            ...r,
            id: `inj-${i}-${Date.now()}`,
            status: (['day-to-day', 'injured', 'out'].includes(r.status) ? r.status : 'injured') as InjuryReport['status'],
          }));

          console.log(`[CricketInjuryService] Extracted ${results.length} injuries`);
          cached = { data: results, ts: Date.now() };
          return results;
        }
      }
    }
  } catch (err) {
    console.error('[CricketInjuryService] Failed:', err instanceof Error ? err.message : String(err));
  }

  // Fallback: static dataset from mockData
  const fallback = gender === 'women' ? womensCricketInjuries : cricketInjuries;
  const mapped = fallback.map((i) => ({ ...i, id: `static-${i.id}` }));
  console.log(`[CricketInjuryService] Using ${mapped.length} static injury entries`);
  cached = { data: mapped, ts: Date.now() };
  return mapped;
}
