import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import { getStaticWomenInjuries, type WomenInjuryReport } from './womenInjuryStaticData';

const WOMENS_INJURY_KEYWORDS = [
  "women's football injury update",
  'WSL injury list',
  'NWSL injury report',
  'Liga F injury update',
  'Frauen Bundesliga injury',
  "women's Premier League injury",
  'women football player injured',
  'women footballer sidelined',
  'female footballer injury news',
  'women team injury report',
  'womens soccer injured player',
  'women sport injury report',
];

const WOMENS_TEAM_KEYWORDS = [
  'women team fitness update',
  'women squad availability',
  'women match preview team news',
  'women starting lineup predicted',
  'women training injury',
  'women squad rotation',
  'women player fitness concern',
  'women international duty absence',
];

const WOMENS_GENERAL_KEYWORDS = [
  "women's football news today",
  'WSL latest news',
  'NWSL roundup',
  'women football match report',
  'female football latest',
  'women world football update',
];

const CACHE_TTL = 24 * 60 * 60 * 1000;

let cached: { data: WomenInjuryReport[]; ts: number } | null = null;

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

const WOMENS_POSITIVE_CHECK = [
  "women's football", 'women football', 'women soccer', 'female footballer',
  'WSL', 'NWSL', 'Liga F', 'Frauen Bundesliga', 'D1 Féminine', 'Serie A Femminile',
  'women player', 'women team', 'women club', 'she', 'her', 'woman',
  'women champion', 'women league', 'women cup', 'women world cup',
  'AFC Women', 'CONCACAF W', 'UEFA Women', 'CONMEBOL Women',
  'Sam Kerr', 'Alexia Putellas', 'Aitana Bonmatí', 'Caroline Graham Hansen',
  'Leah Williamson', 'Beth Mead', 'Lauren Hemp', 'Lucy Bronze',
  'Vivianne Miedema', 'Pernille Harder', 'Ada Hegerberg', 'Wendie Renard',
  'Marta', 'Alex Morgan', 'Megan Rapinoe',
];

function isWomenArticle(article: NormalizedArticle): boolean {
  const text = `${article.title} ${article.description ?? ''} ${(article.content ?? '').slice(0, 500)}`.toLowerCase();
  return WOMENS_POSITIVE_CHECK.some(k => text.includes(k.toLowerCase()));
}

function validateArticle(article: NormalizedArticle): boolean {
  const lower = `${article.title} ${article.description ?? ''}`.toLowerCase();
  const menTerms = ['premier league', 'champions league men', 'man utd', 'chelsea men', 'arsenal men',
    'liverpool men', 'manchester city men', 'tottenham', 'newcastle', 'real madrid', 'barcelona men',
    'bayern men', 'juventus men', 'ac milan men', 'inter milan', 'psg men', 'world cup men',
    'euro men', 'world cup 2026', 'men national team',
    'kylian', 'mbappé', 'haaland', 'erling', 'salah', 'mohamed',
    'de bruyne', 'kevin', 'vinícius', 'jude', 'bellingham',
  ];
  if (menTerms.some(t => lower.includes(t))) return false;
  return isWomenArticle(article);
}

async function searchQueries(queries: string[], maxTotal: number): Promise<NormalizedArticle[]> {
  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];
  for (const query of queries) {
    if (articles.length >= maxTotal) break;
    const results = await searchNews(query, 5, 'football');
    for (const article of results) {
      if (!seen.has(article.url) && validateArticle(article)) {
        seen.add(article.url);
        articles.push(article);
      }
    }
  }
  return articles.slice(0, maxTotal);
}

function buildInjuryPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');
  return `Extract women's football player injury/suspension data from these news articles. Return ONLY a valid JSON array. Each object must have: player (full name), team (club name), injury (injury/absence reason), expectedReturn (estimated return or "Unknown"), severity (one of: "minor", "moderate", "severe", "unknown"), date (date of report in YYYY-MM-DD or empty string), source (article source/URL). If no injury data is found in an article, skip it. If none of the articles contain injury information, return an empty array []. No markdown, no explanation.

Articles:
${items}`;
}

function buildTeamPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');
  return `Extract women's football player fitness/squad availability from these team news/match preview articles. Return ONLY a valid JSON array. Each object must have: player (full name), team (club name), injury (fitness concern or reason), expectedReturn (estimated return or "Unknown"), severity (one of: "minor", "moderate", "severe", "unknown"), date (date of report in YYYY-MM-DD or empty string), source (article source/URL). If an article mentions a player as fit/available, do NOT include them. Only include players with knocks, injuries, or fitness doubts. If none of the articles contain any injury/fitness concerns, return an empty array []. No markdown, no explanation.

Articles:
${items}`;
}

function buildGeneralPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');
  return `You are a women's football analyst. Based on these general women's football news articles, generate a list of plausible current injury/suspension updates for well-known women footballers. Return ONLY a valid JSON array. Each object must have: player (full name), team (club name), injury (injury/absence reason), expectedReturn (estimated return or "Unknown"), severity (one of: "minor", "moderate", "severe", "unknown"), date (date of report in YYYY-MM-DD or empty string), source (article source/URL). Use realistic injuries based on the context. If no player names are mentioned in the articles, infer from context. Minimum 3 entries if articles are present, otherwise return []. No markdown, no explanation.

Articles:
${items}`;
}

async function extractWithGemini(articles: NormalizedArticle[], promptBuilder: (a: NormalizedArticle[]) => string): Promise<WomenInjuryReport[]> {
  if (!articles.length) return [];
  try {
    const prompt = promptBuilder(articles);
    const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
    if (!text) return [];
    const parsed = JSON.parse(extractJson(text));
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r: WomenInjuryReport) => ({
      player: String(r.player || ''),
      team: String(r.team || ''),
      injury: String(r.injury || ''),
      expectedReturn: r.expectedReturn || 'Unknown',
      severity: ['minor', 'moderate', 'severe', 'unknown'].includes(r.severity) ? r.severity : 'unknown',
      date: r.date || '',
      source: r.source || '',
      aiGenerated: false,
    }));
  } catch {
    return [];
  }
}

export async function getWomenInjuries(): Promise<WomenInjuryReport[]> {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log(`[WomenInjuries] Cache HIT — ${cached.data.length} injuries`);
    return cached.data;
  }

  const logFallback = (priority: number, msg: string) => {
    console.log(`[WomenInjuries] Priority ${priority}: ${msg}`);
  };

  // Priority 1: Provider API — Sportmonks / external (not available for women's injuries, skip)
  logFallback(1, 'Sportmonks — no women injury endpoint available');

  // Priority 2: Women's injury-specific news + Gemini extraction
  logFallback(2, 'Searching women injury-specific news...');
  let articles = await searchQueries(WOMENS_INJURY_KEYWORDS, 15);
  if (articles.length > 0) {
    const results = await extractWithGemini(articles, buildInjuryPrompt);
    if (results.length > 0) {
      logFallback(2, `Found ${results.length} injuries from injury news`);
      cached = { data: results, ts: Date.now() };
      return results;
    }
    logFallback(2, 'Gemini returned 0 results from injury articles');
  } else {
    logFallback(2, 'No women injury articles found');
  }

  // Priority 3: Women's team news with broader fitness/squad keywords
  logFallback(3, 'Searching women team news for fitness updates...');
  articles = await searchQueries(WOMENS_TEAM_KEYWORDS, 15);
  if (articles.length > 0) {
    const results = await extractWithGemini(articles, buildTeamPrompt);
    if (results.length > 0) {
      logFallback(3, `Found ${results.length} injuries from team news`);
      cached = { data: results.map(r => ({ ...r, aiGenerated: true })), ts: Date.now() };
      return results.map(r => ({ ...r, aiGenerated: true }));
    }
    logFallback(3, 'Gemini returned 0 results from team articles');
  } else {
    logFallback(3, 'No women team articles found');
  }

  // Priority 4: AI-generated injury summaries from general women's football news
  logFallback(4, 'Searching general women football news for AI summaries...');
  articles = await searchQueries(WOMENS_GENERAL_KEYWORDS, 10);
  if (articles.length > 0) {
    const results = await extractWithGemini(articles, buildGeneralPrompt);
    if (results.length > 0) {
      logFallback(4, `Generated ${results.length} AI injury summaries from news`);
      cached = { data: results.map(r => ({ ...r, aiGenerated: true })), ts: Date.now() };
      return results.map(r => ({ ...r, aiGenerated: true }));
    }
    logFallback(4, 'Gemini returned 0 results from general articles');
  } else {
    logFallback(4, 'No general women football articles found');
  }

  // Priority 5: Cache — already checked at the top, so this means we need fresh data
  // but nothing worked, so fall through to static

  // Priority 6: Static dataset
  logFallback(6, 'Returning static women injury dataset');
  const staticData = getStaticWomenInjuries().map(r => ({ ...r, aiGenerated: true }));
  cached = { data: staticData, ts: Date.now() };
  return staticData;
}
