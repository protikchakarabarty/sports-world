import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import type { CricketStats } from '@/types';

const STATS_QUERIES = [
  'cricket most runs 2026',
  'cricket most wickets 2026',
  'cricket most centuries 2026',
  'international cricket top scorers',
  'cricket tournament highest run scorer',
];

const CACHE_TTL = 6 * 60 * 60 * 1000;

let cached: { data: { runs: CricketStats[]; wickets: CricketStats[]; hundreds: CricketStats[] }; ts: number } | null = null;

const mensFallback: { runs: CricketStats[]; wickets: CricketStats[]; hundreds: CricketStats[] } = {
  runs: [
    { player: 'SR Tendulkar', team: 'IND', span: '1989-2013', mat: 664, inns: 782, no: 74, runs: 34357, hs: '248*', ave: 48.52, bf: '50817+', sr: '67.58*', hundreds: 100, fifties: 164, ducks: 34, fours: '4076+', sixes: 264 },
    { player: 'V Kohli', team: 'IND', span: '2008-2026', mat: 560, inns: 627, no: 91, runs: 28220, hs: '254*', ave: 52.64, bf: '35441', sr: '79.62', hundreds: 85, fifties: 146, ducks: 40, fours: '2773', sixes: 322 },
    { player: 'KC Sangakkara', team: 'Asia/ICC/SL', span: '2000-2015', mat: 594, inns: 666, no: 67, runs: 28016, hs: '319', ave: 46.77, bf: '42086', sr: '66.56', hundreds: 63, fifties: 153, ducks: 28, fours: '3015', sixes: 159 },
    { player: 'RT Ponting', team: 'AUS/ICC', span: '1995-2012', mat: 560, inns: 668, no: 70, runs: 27483, hs: '257', ave: 45.95, bf: '40130', sr: '68.48', hundreds: 71, fifties: 146, ducks: 39, fours: '2781', sixes: 246 },
    { player: 'DPMD Jayawardene', team: 'Asia/SL', span: '1997-2015', mat: 652, inns: 725, no: 62, runs: 25957, hs: '374', ave: 39.15, bf: '40100', sr: '64.73', hundreds: 54, fifties: 136, ducks: 47, fours: '2679', sixes: 170 },
    { player: 'JH Kallis', team: 'Afr/ICC/SA', span: '1995-2014', mat: 519, inns: 617, no: 97, runs: 25534, hs: '224', ave: 49.1, bf: '45346', sr: '56.3', hundreds: 62, fifties: 149, ducks: 33, fours: '2455', sixes: 254 },
    { player: 'R Dravid', team: 'Asia/ICC/IND', span: '1996-2012', mat: 509, inns: 605, no: 72, runs: 24208, hs: '270', ave: 45.41, bf: '46564', sr: '51.98', hundreds: 48, fifties: 146, ducks: 21, fours: '2604', sixes: 66 },
    { player: 'JE Root', team: 'ENG', span: '2012-2026', mat: 388, inns: 513, no: 56, runs: 22660, hs: '262', ave: 49.58, bf: '33967', sr: '66.71', hundreds: 61, fifties: 118, ducks: 26, fours: '2227', sixes: 117 },
    { player: 'BC Lara', team: 'ICC/WI', span: '1990-2007', mat: 430, inns: 521, no: 38, runs: 22358, hs: '400*', ave: 46.28, bf: '32839', sr: '68.08', hundreds: 53, fifties: 111, ducks: 33, fours: '2601', sixes: 221 },
    { player: 'ST Jayasuriya', team: 'Asia/SL', span: '1989-2011', mat: 586, inns: 651, no: 35, runs: 21032, hs: '340', ave: 34.14, bf: '25910', sr: '81.17', hundreds: 42, fifties: 103, ducks: 53, fours: '2486', sixes: 352 },
  ],
  wickets: [
    { player: 'Muttiah Muralitharan', team: 'Sri Lanka', wickets: 1347 },
    { player: 'Shane Warne', team: 'Australia', wickets: 1001 },
    { player: 'James Anderson', team: 'England', wickets: 987 },
    { player: 'Anil Kumble', team: 'India', wickets: 956 },
    { player: 'Glenn McGrath', team: 'Australia', wickets: 949 },
    { player: 'Courtney Walsh', team: 'West Indies', wickets: 819 },
    { player: 'Wasim Akram', team: 'Pakistan', wickets: 916 },
    { player: 'Dale Steyn', team: 'South Africa', wickets: 699 },
    { player: 'Ravichandran Ashwin', team: 'India', wickets: 745 },
    { player: 'Nathan Lyon', team: 'Australia', wickets: 623 },
  ],
  hundreds: [
    { player: 'Sachin Tendulkar', team: 'India', hundreds: 100 },
    { player: 'Virat Kohli', team: 'India', hundreds: 81 },
    { player: 'Ricky Ponting', team: 'Australia', hundreds: 71 },
    { player: 'Kumar Sangakkara', team: 'Sri Lanka', hundreds: 63 },
    { player: 'Jacques Kallis', team: 'South Africa', hundreds: 62 },
    { player: 'Rohit Sharma', team: 'India', hundreds: 49 },
    { player: 'Brian Lara', team: 'West Indies', hundreds: 53 },
    { player: 'Hashim Amla', team: 'South Africa', hundreds: 55 },
    { player: 'Mahela Jayawardene', team: 'Sri Lanka', hundreds: 54 },
    { player: 'Steve Smith', team: 'Australia', hundreds: 44 },
  ],
};

const womensFallback: { runs: CricketStats[]; wickets: CricketStats[]; hundreds: CricketStats[] } = {
  runs: [
    { player: 'Mithali Raj', team: 'India', runs: 10868 },
    { player: 'Charlotte Edwards', team: 'England', runs: 9592 },
    { player: 'Smriti Mandhana', team: 'India', runs: 8526 },
    { player: 'Ellyse Perry', team: 'Australia', runs: 7894 },
    { player: 'Suzie Bates', team: 'New Zealand', runs: 7652 },
    { player: 'Sarah Taylor', team: 'England', runs: 7256 },
    { player: 'Meg Lanning', team: 'Australia', runs: 6895 },
    { player: 'Harmanpreet Kaur', team: 'India', runs: 6542 },
    { player: 'Stafanie Taylor', team: 'West Indies', runs: 6235 },
    { player: 'Alyssa Healy', team: 'Australia', runs: 5896 },
  ],
  wickets: [
    { player: 'Jhulan Goswami', team: 'India', wickets: 445 },
    { player: 'Catherine Fitzpatrick', team: 'Australia', wickets: 368 },
    { player: 'Anya Shrubsole', team: 'England', wickets: 342 },
    { player: 'Katherine Brunt', team: 'England', wickets: 335 },
    { player: 'Ellyse Perry', team: 'Australia', wickets: 318 },
    { player: 'Shabnim Ismail', team: 'South Africa', wickets: 305 },
    { player: 'Megan Schutt', team: 'Australia', wickets: 298 },
    { player: 'Poonam Yadav', team: 'India', wickets: 285 },
    { player: 'Deepti Sharma', team: 'India', wickets: 272 },
    { player: 'Sophie Ecclestone', team: 'England', wickets: 265 },
  ],
  hundreds: [
    { player: 'Mithali Raj', team: 'India', hundreds: 32 },
    { player: 'Charlotte Edwards', team: 'England', hundreds: 28 },
    { player: 'Smriti Mandhana', team: 'India', hundreds: 24 },
    { player: 'Meg Lanning', team: 'Australia', hundreds: 22 },
    { player: 'Ellyse Perry', team: 'Australia', hundreds: 18 },
    { player: 'Suzie Bates', team: 'New Zealand', hundreds: 17 },
    { player: 'Harmanpreet Kaur', team: 'India', hundreds: 15 },
    { player: 'Alyssa Healy', team: 'Australia', hundreds: 14 },
    { player: 'Sarah Taylor', team: 'England', hundreds: 12 },
    { player: 'Stafanie Taylor', team: 'West Indies', hundreds: 11 },
  ],
};

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

async function searchStatsArticles(): Promise<NormalizedArticle[]> {
  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];

  for (const query of STATS_QUERIES) {
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

type StatsData = { runs: CricketStats[]; wickets: CricketStats[]; hundreds: CricketStats[] };

async function extractStatsFromArticles(articles: NormalizedArticle[]): Promise<StatsData | null> {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');

  const prompt = `Based on these cricket news articles, extract the top international cricket players for three categories. Return ONLY a valid JSON object with three keys: "runs", "wickets", "hundreds". Each key must contain an array of objects.

For "runs" entries, include: player (full name), team (country name), span (career span as string like "1989-2013"), mat (matches), inns (innings), no (not outs), runs (total runs), hs (highest score as string like "248*"), ave (average as number), bf (balls faced as string), sr (strike rate as string), hundreds (number of 100s), fifties (number of 50s), ducks (number of 0s), fours (fours as string), sixes (sixes as number).

For "wickets" entries, include: player, team, wickets (number).

For "hundreds" entries, include: player, team, hundreds (number).

If articles mention tournament-specific stats, use those. If no tournament stats are found, use career all-format totals. If a category has no data, return an empty array for that key. No markdown, no explanation.

Articles:
${items}`;

  try {
    const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
    if (!text) return null;

    const parsed = JSON.parse(extractJson(text)) as Record<string, CricketStats[]>;
    if (!parsed || typeof parsed !== 'object') return null;

    const result: StatsData = { runs: [], wickets: [], hundreds: [] };
    for (const key of ['runs', 'wickets', 'hundreds'] as const) {
      if (Array.isArray(parsed[key])) {
        result[key] = parsed[key].filter((s) => s.player && s.team && s[key] != null) as CricketStats[];
      }
    }

    const total = result.runs.length + result.wickets.length + result.hundreds.length;
    if (total > 0) {
      console.log(`[CricketStatsService] Extracted ${result.runs.length} batters, ${result.wickets.length} bowlers, ${result.hundreds.length} centurions`);
      return result;
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

export async function getCricketStats(gender: string): Promise<StatsData> {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log(`[CricketStatsService] Cache HIT`);
    return cached.data;
  }

  try {
    console.log('[CricketStatsService] Searching stats news...');
    const articles = await searchStatsArticles();

    if (articles.length > 0) {
      const extracted = await extractStatsFromArticles(articles);
      if (extracted) {
        cached = { data: extracted, ts: Date.now() };
        return extracted;
      }
    }
  } catch (err) {
    console.error('[CricketStatsService] Failed:', err instanceof Error ? err.message : String(err));
  }

  const fallback = gender === 'women' ? womensFallback : mensFallback;
  console.log(`[CricketStatsService] Using static fallback data`);
  cached = { data: fallback, ts: Date.now() };
  return fallback;
}
