import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import type { FantasyPlayer } from '@/types';

const FANTASY_QUERIES = [
  'cricket fantasy XI dream team',
  'best cricket fantasy team',
  'cricket player form points',
  'top cricket players fantasy',
];

const CACHE_TTL = 6 * 60 * 60 * 1000;

const cache = new Map<string, { data: FantasyPlayer[]; ts: number }>();

const realMenFantasy: FantasyPlayer[] = [
  { name: 'Virat Kohli', role: 'Batsman', points: 512, team: 'India' },
  { name: 'Rohit Sharma', role: 'Batsman', points: 485, team: 'India' },
  { name: 'Joe Root', role: 'Batsman', points: 478, team: 'England' },
  { name: 'Steve Smith', role: 'Batsman', points: 465, team: 'Australia' },
  { name: 'Shubman Gill', role: 'Batsman', points: 452, team: 'India' },
  { name: 'Ben Stokes', role: 'All-Rounder', points: 498, team: 'England' },
  { name: 'Ravindra Jadeja', role: 'All-Rounder', points: 445, team: 'India' },
  { name: 'Jasprit Bumrah', role: 'Bowler', points: 472, team: 'India' },
  { name: 'Pat Cummins', role: 'Bowler', points: 438, team: 'Australia' },
  { name: 'Rashid Khan', role: 'Bowler', points: 425, team: 'Afghanistan' },
  { name: 'MS Dhoni', role: 'Wicketkeeper', points: 458, team: 'India' },
];

const realWomenFantasy: FantasyPlayer[] = [
  { name: 'Smriti Mandhana', role: 'Batsman', points: 485, team: 'India' },
  { name: 'Meg Lanning', role: 'Batsman', points: 468, team: 'Australia' },
  { name: 'Beth Mooney', role: 'Batsman', points: 432, team: 'Australia' },
  { name: 'Harmanpreet Kaur', role: 'Batsman', points: 452, team: 'India' },
  { name: 'Ellyse Perry', role: 'All-Rounder', points: 498, team: 'Australia' },
  { name: 'Nat Sciver-Brunt', role: 'All-Rounder', points: 445, team: 'England' },
  { name: 'Deepti Sharma', role: 'All-Rounder', points: 425, team: 'India' },
  { name: 'Sophie Ecclestone', role: 'Bowler', points: 438, team: 'England' },
  { name: 'Shabnim Ismail', role: 'Bowler', points: 418, team: 'South Africa' },
  { name: 'Poonam Yadav', role: 'Bowler', points: 405, team: 'India' },
  { name: 'Alyssa Healy', role: 'Wicketkeeper', points: 472, team: 'Australia' },
];

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

async function searchFantasyArticles(gender?: string): Promise<NormalizedArticle[]> {
  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];
  const queries = gender === 'women'
    ? [...FANTASY_QUERIES.map((q) => `women's ${q}`), ...FANTASY_QUERIES]
    : FANTASY_QUERIES;

  for (const query of queries) {
    if (articles.length >= 10) break;
    const results = await searchNews(query, 4, 'cricket');
    for (const article of results) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        articles.push(article);
      }
    }
  }

  return articles.slice(0, 10);
}

async function extractFantasyFromArticles(articles: NormalizedArticle[], gender?: string): Promise<FantasyPlayer[]> {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');

  const genderHint = gender === 'women'
    ? '\nIMPORTANT: Return ONLY women\'s cricket players. No men\'s players.'
    : '';
  const prompt = `Based on these cricket news articles, create a fantasy XI dream team (11 players) with recent form and performance data. Return ONLY a valid JSON array. Each object must have: name (full name), role (exactly one of: "Batsman", "Bowler", "All-Rounder", "Wicketkeeper"), points (fantasy points as number), team (country or franchise name). If an article mentions player form, ratings, or performance, use that data. If no player data is found, return an empty array []. No markdown, no explanation.${genderHint}

Articles:
${items}`;

  try {
    const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
    if (!text) return [];

    const parsed = JSON.parse(extractJson(text)) as FantasyPlayer[];
    if (!Array.isArray(parsed)) return [];

    const validRoles = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'];
    const results = parsed.filter((p) => p.name && p.team && p.points != null && validRoles.includes(p.role));

    if (results.length > 0) {
      console.log(`[CricketFantasyService] Extracted ${results.length} fantasy players`);
      return results;
    }
  } catch {
    // ignore
  }

  return [];
}

export async function getCricketFantasy(gender: string): Promise<FantasyPlayer[]> {
  const entry = cache.get(gender);
  if (entry && Date.now() - entry.ts < CACHE_TTL) {
    console.log(`[CricketFantasyService] Cache HIT (${gender}) — ${entry.data.length} players`);
    return entry.data;
  }

  try {
    console.log('[CricketFantasyService] Searching fantasy news...');
    const articles = await searchFantasyArticles(gender);

    if (articles.length > 0) {
      const extracted = await extractFantasyFromArticles(articles, gender);
      if (extracted.length > 0) {
        cache.set(gender, { data: extracted, ts: Date.now() });
        return extracted;
      }
    }
  } catch (err) {
    console.error('[CricketFantasyService] Failed:', err instanceof Error ? err.message : String(err));
  }

  const fallback = gender === 'women' ? realWomenFantasy : realMenFantasy;
  console.log(`[CricketFantasyService] Using ${fallback.length} real player entries (${gender})`);
  cache.set(gender, { data: fallback, ts: Date.now() });
  return fallback;
}
