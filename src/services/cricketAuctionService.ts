import { searchNews, type NormalizedArticle } from './newsApi';
import { generateContent } from './geminiApi';
import type { TransferNews } from '@/types';

const MEN_QUERIES = [
  'IPL 2026 auction transfer',
  'BPL 2026 player transfer',
  'cricket auction latest news',
  'IPL player transfer news',
];

const WOMEN_QUERIES = [
  'WPL 2026 auction transfer',
  'Women Premier League player transfer',
  'women cricket WPL auction news',
  'WPL player transfer news',
];

const CACHE_TTL = 6 * 60 * 60 * 1000;

let menCache: { data: TransferNews[]; ts: number } | null = null;
let womenCache: { data: TransferNews[]; ts: number } | null = null;

const menTransfers: TransferNews[] = [
  { id: 'at1', player: 'Rishabh Pant', from: 'Delhi Capitals', to: 'Lucknow Super Giants', fee: '₹27 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at2', player: 'Shreyas Iyer', from: 'Kolkata Knight Riders', to: 'Punjab Kings', fee: '₹26.75 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at3', player: 'Jos Buttler', from: 'Rajasthan Royals', to: 'Gujarat Titans', fee: '₹15.75 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at4', player: 'KL Rahul', from: 'Lucknow Super Giants', to: 'Delhi Capitals', fee: '₹14 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at5', player: 'Mitchell Starc', from: 'Kolkata Knight Riders', to: 'Delhi Capitals', fee: '₹11.75 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at6', player: 'Yuzvendra Chahal', from: 'Rajasthan Royals', to: 'Punjab Kings', fee: '₹18 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at7', player: 'Arshdeep Singh', from: 'Punjab Kings', to: 'Punjab Kings', fee: '₹18 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at8', player: 'Mohammed Shami', from: 'Gujarat Titans', to: 'Sunrisers Hyderabad', fee: '₹10 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at9', player: 'Devon Conway', from: 'Chennai Super Kings', to: 'Chennai Super Kings', fee: '₹6.25 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at10', player: 'Mitchell Marsh', from: 'Delhi Capitals', to: 'Lucknow Super Giants', fee: '₹3.4 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at11', player: 'Rovman Powell', from: 'Rajasthan Royals', to: 'Punjab Kings', fee: '₹1.5 Cr', status: 'completed', date: '2025-11-24' },
  { id: 'at12', player: 'Glenn Maxwell', from: 'Royal Challengers Bengaluru', to: 'Punjab Kings', fee: '₹4.2 Cr', status: 'completed', date: '2025-11-25' },
];

const womenTransfers: TransferNews[] = [
  { id: 'wat1', player: 'Smriti Mandhana', from: 'Royal Challengers Bengaluru', to: 'Royal Challengers Bengaluru', fee: '₹3.4 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat2', player: 'Harmanpreet Kaur', from: 'Mumbai Indians', to: 'Mumbai Indians', fee: '₹3.4 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat3', player: 'Meg Lanning', from: 'Delhi Capitals', to: 'Delhi Capitals', fee: '₹3.4 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat4', player: 'Annabel Sutherland', from: 'Melbourne Stars', to: 'Delhi Capitals', fee: '₹2 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat5', player: 'Deandra Dottin', from: 'Barbados Royals', to: 'Delhi Capitals', fee: '₹1.7 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat6', player: 'Kashvee Gautam', from: 'Gujarat Giants', to: 'Gujarat Giants', fee: '₹2 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat7', player: 'Simran Shaikh', from: 'UP Warriorz', to: 'UP Warriorz', fee: '₹1.9 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat8', player: 'Shabnam Shakil', from: 'Delhi Capitals', to: 'Delhi Capitals', fee: '₹1 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat9', player: 'N Charani', from: 'UP Warriorz', to: 'UP Warriorz', fee: '₹30 L', status: 'completed', date: '2025-12-15' },
  { id: 'wat10', player: 'Vrinda Dinesh', from: 'Kerala', to: 'UP Warriorz', fee: '₹1.4 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat11', player: 'Sophie Molineux', from: 'Royal Challengers Bengaluru', to: 'Royal Challengers Bengaluru', fee: '₹1.3 Cr', status: 'completed', date: '2025-12-15' },
  { id: 'wat12', player: 'Shafali Verma', from: 'Delhi Capitals', to: 'Delhi Capitals', fee: '₹1.5 Cr', status: 'completed', date: '2025-12-15' },
];

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

async function searchAuctionArticles(queries: string[]): Promise<NormalizedArticle[]> {
  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];

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

async function extractAuctionsFromArticles(articles: NormalizedArticle[], isWomen: boolean): Promise<TransferNews[]> {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Content: ${(a.content ?? '').slice(0, 300)}`
  ).join('\n\n');

  const prompt = `Extract ${isWomen ? 'WPL/ Women cricket' : 'IPL/BPL/CPL cricket'} player transfer and auction data from these news articles. Return ONLY a valid JSON array. Each object must have: player (full name), from (previous team), to (new team), fee (transfer fee/auction price as string like "₹27 Cr" or "$1.2M"), status (exactly one of: "completed", "rumored", "pending"), date (date of transfer in YYYY-MM-DD format). If no transfer data is found in an article, skip it. If none of the articles contain transfer information, return an empty array []. No markdown, no explanation.

Articles:
${items}`;

  try {
    const text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
    if (!text) return [];

    const parsed = JSON.parse(extractJson(text)) as TransferNews[];
    if (!Array.isArray(parsed)) return [];

    const results = parsed
      .filter((t) => t.player && t.from && t.to && t.fee)
      .map((t, i) => ({
        ...t,
        id: `auction-${i}-${Date.now()}`,
        status: (['completed', 'rumored', 'pending'].includes(t.status) ? t.status : 'completed') as TransferNews['status'],
      }));

    console.log(`[CricketAuctionService] Extracted ${results.length} transfers`);
    return results;
  } catch {
    return [];
  }
}

export async function getCricketAuctionData(gender: 'men' | 'women' = 'men'): Promise<TransferNews[]> {
  const cache = gender === 'women' ? womenCache : menCache;
  const queries = gender === 'women' ? WOMEN_QUERIES : MEN_QUERIES;
  const fallback = gender === 'women' ? womenTransfers : menTransfers;

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    console.log(`[CricketAuctionService] ${gender} cache HIT — ${cache.data.length} transfers`);
    return cache.data;
  }

  try {
    console.log(`[CricketAuctionService] Searching ${gender} auction news...`);
    const articles = await searchAuctionArticles(queries);

    if (articles.length > 0) {
      const extracted = await extractAuctionsFromArticles(articles, gender === 'women');
      if (extracted.length > 0) {
        if (gender === 'women') {
          womenCache = { data: extracted, ts: Date.now() };
        } else {
          menCache = { data: extracted, ts: Date.now() };
        }
        return extracted;
      }
    }
  } catch (err) {
    console.error('[CricketAuctionService] Failed:', err instanceof Error ? err.message : String(err));
  }

  console.log(`[CricketAuctionService] ${gender} using ${fallback.length} curated entries`);
  if (gender === 'women') {
    womenCache = { data: fallback, ts: Date.now() };
  } else {
    menCache = { data: fallback, ts: Date.now() };
  }
  return fallback;
}
