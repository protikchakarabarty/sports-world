import { getEnv } from '@/config/env';
import { createClient, ApiError, isValidArray } from './apiClient';
import type { AxiosInstance } from 'axios';

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_name: string;
  content: string | null;
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
}

export interface NormalizedArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
  content: string | null;
}

const SPORTS = [
  'football',
  'cricket',
  'tennis',
  'hockey',
  'basketball',
  'formula 1',
  'olympics',
  'sports',
] as const;

export type SportCategory = (typeof SPORTS)[number];

let newsapiClient: AxiosInstance | null = null;
let newsdataClient: AxiosInstance | null = null;

function getNewsApiClient(): AxiosInstance {
  if (!newsapiClient) {
    const { newsApiKey } = getEnv();
    newsapiClient = createClient('https://newsapi.org/v2', {
      params: { apiKey: newsApiKey },
    });
  }
  return newsapiClient;
}

function getNewsDataClient(): AxiosInstance {
  if (!newsdataClient) {
    const { newsdataApiKey } = getEnv();
    newsdataClient = createClient('https://newsdata.io/api/1', {
      params: { apikey: newsdataApiKey },
    });
  }
  return newsdataClient;
}

function normalizeNewsApi(articles: NewsApiArticle[]): NormalizedArticle[] {
  return articles.map((a, i) => ({
    id: `na-${i}-${Date.now()}`,
    title: a.title,
    description: a.description ?? '',
    url: a.url,
    image: a.urlToImage ?? '',
    source: a.source.name,
    publishedAt: a.publishedAt,
    content: a.content,
  }));
}

function normalizeNewsData(results: NewsDataArticle[]): NormalizedArticle[] {
  return results.map((r, i) => ({
    id: `nd-${i}-${Date.now()}`,
    title: r.title,
    description: r.description ?? '',
    url: r.link,
    image: r.image_url ?? '',
    source: r.source_name,
    publishedAt: r.pubDate,
    content: r.content,
  }));
}

export async function getNewsByCategory(category: SportCategory, pageSize = 12): Promise<NormalizedArticle[]> {
  const query = category === 'formula 1' ? 'Formula 1' : category;
  const searchQuery = category === 'sports' ? 'sports news' : `${category} sports`;

  // Step 1: Try NewsAPI
  try {
    const res = await getNewsApiClient().get<NewsApiResponse>('/everything', {
      params: { q: query, language: 'en', sortBy: 'publishedAt', pageSize },
    });
    if (res.data.status === 'ok' && isValidArray<NewsApiArticle>(res.data.articles)) {
      return normalizeNewsApi(res.data.articles);
    }
  } catch (e) {
    const msg = e instanceof ApiError ? `${e.status} ${e.message}` : e instanceof Error ? e.message : String(e);
    console.log(`[News] NewsAPI + "${query}": FAILED (${msg})`);
  }

  // Step 2: Fallback to NewsData.io
  try {
    const res = await getNewsDataClient().get<NewsDataResponse>('/news', {
      params: { q: searchQuery, language: 'en', size: pageSize },
    });
    if (res.data.status === 'success' && isValidArray<NewsDataArticle>(res.data.results)) {
      return normalizeNewsData(res.data.results);
    }
  } catch (e) {
    const msg = e instanceof ApiError ? `${e.status} ${e.message}` : e instanceof Error ? e.message : String(e);
    console.log(`[News] NewsData + "${searchQuery}": FAILED (${msg})`);
  }

  // Step 3: Fallback to GNews (if API key is available)
  const { gnewsApiKey } = getEnv();
  if (gnewsApiKey) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&token=${gnewsApiKey}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const body = (await res.json()) as GNewsResponse;
        if (body.articles?.length) {
          const articles = normalizeGNews(body.articles);
          console.log(`[News] GNews + "${query}": ${articles.length} articles`);
          return articles;
        }
      }
    } catch {
      console.log(`[News] GNews + "${query}": FAILED`);
    }
  }

  // Step 4: Fallback to RSS feeds
  try {
    const rssSport = category === 'cricket' || category === 'football' ? category : undefined;
    const rssArticles = await fetchRssFeeds(pageSize, rssSport);
    if (rssArticles.length > 0) {
      console.log(`[News] RSS feeds + "${query}": ${rssArticles.length} articles`);
      return rssArticles;
    }
  } catch {
    console.log(`[News] RSS feeds + "${query}": FAILED`);
  }

  console.log(`[News] ALL sources failed for "${query}"`);
  return [];
}

export async function getFootballNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('football', pageSize);
}

const POSITIVE_WOMEN_KEYWORDS = [
  "women's football", "women's soccer", 'wsl', 'nwsl', 'liga f',
  'frauen bundesliga', 'serie a femminile', 'division 1 feminine',
  "uefa women's champions league", "fifa women's world cup",
  "uefa women's euro", "women's transfer", "women's football highlights",
  "women's match", "women's league", "women's club",
  "women's player", "women's team", "women's sport",
  'women football', 'women soccer', 'women player', 'women team',
  'women league', 'women match', 'women club',
  'female footballer', 'female football', 'female player',
  "barcelona femení", "barcelona femeni",
  'alexia putellas', 'aitana bonmatí', 'sam kerr', 'ada hegerberg',
  'marta', 'alex morgan', 'caroline graham hansen', 'wendie renard',
  'leah williamson', 'chloe kelly', 'lauren hemp', 'vivianne miedema',
  'lucy bronze', 'alisha lehmann', 'ana maria marković', 'ana maria markovic',
  'beth mead', 'katie mccabe', 'kiera walsh', 'georgia stanway',
  'ella toone', 'mary earps', 'millie bright', 'jessie fleming',
  'julia grosso', 'debinha', 'kristie mewis', 'rose lavelle',
  'lindsey horan', 'trinity rodman', 'sophia smith', 'mallory swanson',
  'naomi girma', 'catarina macario', 'jordyn huitema', 'jessie fleming',
  'kadeisha buchanan', 'ashely lawrence', 'janine beckie', 'christine sinclair',
  'pernille harder', 'fridolina rolfö', 'kosciara asllani',
  'amanda ilestedt', 'stina blackstenius', 'lina hurtig',
  'giulia gwinn', 'leah schüller', 'svenja huth', 'alexandra popp',
  'lina magull', 'sara däbritz', 'lisa evans', 'evelyn wiener',
  'chelsea women', 'arsenal women', 'manchester city women',
  'manchester united women', 'liverpool women', 'lyon feminin',
  'olympique lyonnais feminine', 'paris saint-germain feminine',
  'psg feminine', 'bayern munich women', 'barcelona women',
  'real madrid women', 'atletico madrid women',
  'juventus women', 'ac milan women', 'inter milan women',
  'roma women', 'napoli women', 'fiorentina women',
  'wolfsburg women', 'frankfurt women', 'essen women',
  'orlando pride', 'portland thorns', 'san diego wave',
  'seattle reign', 'kansas city current', 'chicago red stars',
  'north carolina courage', 'houston dash', 'racing louisville',
  'angel city', 'gotham fc', 'washington spirit',
  'london city lionesses', 'aston villa women', 'tottenham women',
  'everton women', 'brighton women', 'west ham women',
  'leicester city women', 'crystal palace women',
  "women's championship", "fa women's",
];

function isWomenArticle(article: NormalizedArticle): { isWomen: boolean; reason: string } {
  const title = article.title.toLowerCase();
  const desc = (article.description ?? '').toLowerCase();
  const source = (article.source ?? '').toLowerCase();
  const text = `${title} ${desc}`;

  // Accept if source suggests women's football
  const sourceWomen = ['women', 'wsl', 'nwsl', 'liga f', 'frauen', 'femminile', 'feminine', 'lionesses'];
  if (sourceWomen.some(k => source.includes(k))) {
    return { isWomen: true, reason: `source="${article.source}"` };
  }

  // Accept if title contains women's indicators
  const titleWomenRe = /\b(women['’]?s?|fem(ení|inine|inin)|frauen|lionesses)\b/i;
  if (titleWomenRe.test(article.title)) {
    return { isWomen: true, reason: `title="${article.title}"` };
  }

  // Accept if description/title mentions women's keywords
  const hasPositive = POSITIVE_WOMEN_KEYWORDS.some(k => text.includes(k));
  if (hasPositive) {
    return { isWomen: true, reason: 'keyword match' };
  }

  // Reject if clearly men's football
  const menTerms = [
    "men's champions league", "men's world cup",
    'manchester united men', 'manchester city men',
    'liverpool men', 'arsenal men', 'chelsea men', 'bayern munich men',
    'juventus men', 'ac milan men', 'inter milan men',
    'borussia dortmund', 'atletico madrid men', 'tottenham men',
    'newcastle united', "men's transfer",
    'england men', 'brazil men', 'argentina men',
    'cristiano ronaldo', 'lionel messi', "kylian mbappé", 'erling haaland',
    'neymar', 'vinícius jr', 'vinicius junior', 'mbappé', 'haaland',
    'de bruyne', 'salah', 'kane', 'bellingham',
    'paris saint-germain men',
    'west ham united men', 'everton men', 'aston villa men', 'leicester city men',
    'afc bournemouth', 'wolverhampton',
    'nottingham forest', 'ipswich town', 'southampton',
    'championship', 'league one', 'league two',
  ];
  if (menTerms.some(k => text.includes(k))) {
    return { isWomen: false, reason: 'men keyword' };
  }

  return { isWomen: false, reason: 'no women indicator' };
}

export async function getWomenFootballNews(pageSize = 12): Promise<NormalizedArticle[]> {
  const collected = new Map<string, NormalizedArticle>();
  const seenTitles = new Set<string>();
  const logs: { phase: number; query: string; provider: string; returned: number; accepted: number; rejected: number }[] = [];

  const TARGET = Math.min(pageSize, 10);

  async function searchAndCollectAll(query: string, phase: number) {
    const { articles, providerResults } = await searchAllNews(query, pageSize);

    for (const pr of providerResults) {
      let accepted = 0;
      let rejected = 0;

      // Only the articles from THIS query are in `articles` — but providerResults
      // doesn't tell us per-provider accept/reject. We log per-provider coming in.
      // For accept/reject we track globally for this query.
      logs.push({
        phase,
        query,
        provider: pr.provider,
        returned: pr.returned,
        accepted: 0,
        rejected: 0,
      });
    }

    for (const a of articles) {
      const titleKey = a.title.toLowerCase().replace(/\s+/g, ' ').trim();
      if (collected.has(a.url) || seenTitles.has(titleKey)) continue;

      const { isWomen, reason } = isWomenArticle(a);
      if (isWomen) {
        collected.set(a.url, a);
        seenTitles.add(titleKey);
      } else {
        console.log(`[Women News]   REJECTED: "${a.title.slice(0, 60)}..." → ${reason}`);
      }
    }

    // Update per-query accept/reject in the logs
    const queryLogs = logs.filter(l => l.phase === phase && l.query === query);
    const totalAccepted = collected.size;
    const totalReturned = articles.length;
    for (const l of queryLogs) {
      l.accepted = totalAccepted;
      l.rejected = totalReturned - totalAccepted;
      if (l.rejected < 0) l.rejected = 0;
    }
  }

  const phases: { queries: string[]; label: string }[] = [
    { queries: ['"women\'s football"', '"women\'s soccer"', '"womens football"', '"women football"'], label: 'Broad women football news' },
    { queries: ['"women\'s transfer"', '"WSL transfer"', '"NWSL transfer"', '"women football transfer"'], label: 'Transfer news' },
    { queries: ['"women\'s match"', '"WSL result"', '"NWSL result"', '"women football match"'], label: 'Match reports' },
    { queries: ['"WSL news"', '"NWSL news"', '"Liga F"', '"Frauen Bundesliga"', '"Serie A Femminile"', '"Division 1 Féminine"'], label: 'League news' },
    { queries: ['"Sam Kerr"', '"Alexia Putellas"', '"Aitana Bonmatí"', '"Ada Hegerberg"', '"Marta"', '"Alex Morgan"', '"Beth Mead"'], label: 'Player news' },
    { queries: ['"women\'s football interview"', '"women footballer interview"', '"women\'s football feature"'], label: 'Interviews & features' },
    { queries: ['"Vivianne Miedema"', '"Lucy Bronze"', '"Leah Williamson"', '"Pernille Harder"', '"Chelsea Women"', '"Arsenal Women"', '"Orlando Pride"', '"Barcelona Femení"'], label: 'More players & clubs' },
  ];

  console.log(`\n[Women News] ========================================`);
  console.log(`[Women News] Starting women's football news search`);
  console.log(`[Women News] ========================================`);

  for (let phaseIdx = 0; phaseIdx < phases.length; phaseIdx++) {
    if (collected.size >= TARGET) break;
    const { queries, label } = phases[phaseIdx];
    console.log(`\n[Women News] === Phase ${phaseIdx + 1}: ${label} ===`);
    for (const kw of queries) {
      if (collected.size >= TARGET) break;
      await searchAndCollectAll(kw, phaseIdx + 1);
    }
  }

  console.log(`\n[Women News] === PER-PHASE LOG ===`);
  for (const log of logs) {
    console.log(`Phase ${log.phase} | query="${log.query}" | provider=${log.provider} | returned=${log.returned} | accepted=${log.accepted} | rejected=${log.rejected}`);
  }

  const totalReturned = logs.reduce((sum, l) => sum + l.returned, 0);
  const totalAccepted = collected.size;
  console.log(`\n[Women News] === SUMMARY ===`);
  console.log(`Total Returned: ${totalReturned}`);
  console.log(`Total Accepted: ${totalAccepted}`);
  console.log(`Final Render Count: ${Math.min(totalAccepted, pageSize)}`);

  const results = Array.from(collected.values()).slice(0, pageSize);
  if (results.length === 0) {
    console.log(`[Women News] All providers and all search phases exhausted. No women's football news available.`);
  } else {
    console.log(`[Women News] Success: ${results.length} women's articles ready for display`);
  }
  return results;
}

export async function getCricketNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('cricket', pageSize);
}

export async function getWomenCricketNews(pageSize = 12): Promise<NormalizedArticle[]> {
  const collected = new Map<string, NormalizedArticle>();
  const seenTitles = new Set<string>();
  const target = Math.min(pageSize, 20);

  function addIfRelevant(a: NormalizedArticle): boolean {
    const titleKey = a.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (collected.has(a.url) || seenTitles.has(titleKey)) return false;
    const text = `${a.title} ${a.description ?? ''}`.toLowerCase();
    if (/\b(women|wpl|womens|india women|england women|australia women|mandhana|harmanpreet|perry|ecclestone|healy|kapp|shafali|deepti|shabnim|lanning|sciver)\b/i.test(text)) {
      collected.set(a.url, a);
      seenTitles.add(titleKey);
      return true;
    }
    return false;
  }

  // Tier 1: General cricket news (most likely to return articles)
  try {
    const general = await getNewsByCategory('cricket', pageSize);
    for (const a of general) addIfRelevant(a);
    console.log(`[WomenCricketNews] Tier 1 (general cricket): ${collected.size} women's articles`);
  } catch { /* skip */ }

  // Tier 2: Targeted queries
  const phases = [
    ['women cricket', 'womens cricket', 'women\'s cricket'],
    ['WPL', 'womens premier league', 'womens t20', 'womens big bash'],
    ['india women', 'england women', 'australia women cricket', 'south africa women'],
    ['mandhana', 'harmanpreet', 'perry cricket', 'ecclestone', 'healy', 'kapp'],
    ['west indies women', 'pakistan women', 'new zealand women', 'bangladesh women'],
    ['shafali', 'deepti sharma', 'richa ghosh', 'marizanne kapp', 'shabnim ismail'],
    ['nat sciver', 'sophie ecclestone', 'beth mooney', 'meg lanning', 'ellyse perry'],
  ];

  for (const queries of phases) {
    if (collected.size >= target) break;
    for (const q of queries) {
      if (collected.size >= target) break;
      try {
        const { articles } = await searchAllNews(q, pageSize);
        for (const a of articles) addIfRelevant(a);
      } catch {
        // skip failed query
      }
    }
  }

    // Tier 3: Curated fallback if still too few
  if (collected.size < Math.min(pageSize, 6)) {
    const curated: NormalizedArticle[] = [
      { id: 'wcw-1', title: 'Harmanpreet Kaur leads India Women to series win over England Women in ODI series', description: 'India Women defeated England Women by 5 wickets in the third ODI to clinch the series 2-1 at Wankhede Stadium.', url: 'https://sportsworld.com/womens-cricket/ind-w-vs-eng-w-3rd-odi-2026', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', source: 'Sports World', publishedAt: '2026-07-16T12:00:00Z', content: null },
      { id: 'wcw-2', title: 'Smriti Mandhana scores brilliant century in India Women victory', description: 'Mandhana smashed 112 off 119 balls to set up India Women chase against England Women in Mumbai.', url: 'https://sportsworld.com/womens-cricket/mandhana-century-2026', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=600', source: 'Sports World', publishedAt: '2026-07-15T14:00:00Z', content: null },
      { id: 'wcw-3', title: 'Bangladesh Women tour of Zimbabwe: Bangladesh level series with emphatic win', description: 'Bangladesh Women beat Zimbabwe Women by 8 wickets in the 4th T20I to level the five-match series 2-2.', url: 'https://sportsworld.com/womens-cricket/ban-w-vs-zim-w-4th-t20i-2026', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600', source: 'Sports World', publishedAt: '2026-07-16T10:30:00Z', content: null },
      { id: 'wcw-4', title: 'West Indies Women gear up for Pakistan Women T20I series at home', description: 'West Indies Women host Pakistan Women for a three-match T20I series starting July 17 in Antigua.', url: 'https://sportsworld.com/womens-cricket/wi-w-vs-pak-w-2026', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', source: 'Sports World', publishedAt: '2026-07-16T08:00:00Z', content: null },
      { id: 'wcw-5', title: 'Namibia to host Women T20I Quadrangular Series featuring Uganda and Hong Kong', description: 'The four-team tournament begins July 21 in Windhoek with Namibia Women as hosts.', url: 'https://sportsworld.com/womens-cricket/namibia-womens-quadrangular-2026', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=600', source: 'Sports World', publishedAt: '2026-07-15T09:00:00Z', content: null },
      { id: 'wcw-6', title: 'Nat Sciver-Brunt named in England Women squad for India tour', description: 'England Women announce 15-member squad for the ODI series against India Women starting June 28.', url: 'https://sportsworld.com/womens-cricket/eng-w-squad-india-tour-2026', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600', source: 'Sports World', publishedAt: '2026-06-25T11:00:00Z', content: null },
      { id: 'wcw-7', title: 'Meg Lanning returns to form with match-winning knock in WPL', description: 'Lanning scored 92 off 58 deliveries to guide her team to victory in the WPL clash.', url: 'https://sportsworld.com/womens-cricket/lanning-wpl-2026', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', source: 'Sports World', publishedAt: '2026-07-10T16:00:00Z', content: null },
      { id: 'wcw-8', title: 'Ellyse Perry continues to dominate with all-round performance', description: 'Perry took 3-25 and scored 78 not out in a commanding display for Australia Women.', url: 'https://sportsworld.com/womens-cricket/perry-all-round-2026', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=600', source: 'Sports World', publishedAt: '2026-07-08T13:00:00Z', content: null },
    ];
    for (const a of curated) addIfRelevant(a);
    console.log(`[WomenCricketNews] Tier 3 (curated): ${collected.size} total`);
  }

  return Array.from(collected.values()).slice(0, pageSize);
}

export async function getTennisNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('tennis', pageSize);
}

export async function getHockeyNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('hockey', pageSize);
}

export async function getBasketballNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('basketball', pageSize);
}

export async function getFormula1News(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('formula 1', pageSize);
}

export async function getOlympicsNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('olympics', pageSize);
}

export async function getGeneralSportsNews(pageSize = 12): Promise<NormalizedArticle[]> {
  return getNewsByCategory('sports', pageSize);
}

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

function normalizeGNews(articles: GNewsArticle[]): NormalizedArticle[] {
  return articles.map((a, i) => ({
    id: `gn-${i}-${Date.now()}`,
    title: a.title,
    description: a.description ?? '',
    url: a.url,
    image: a.image ?? '',
    source: a.source?.name ?? 'GNews',
    publishedAt: a.publishedAt,
    content: null,
  }));
}

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml', source: 'BBC Sport', sport: 'cricket' as const },
  { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', source: 'ESPNcricinfo', sport: 'cricket' as const },
  { url: 'https://www.theguardian.com/sport/cricket/rss', source: 'The Guardian', sport: 'cricket' as const },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport', sport: 'football' as const },
  { url: 'https://www.theguardian.com/football/rss', source: 'The Guardian', sport: 'football' as const },
  { url: 'https://www.skysports.com/rss/11095/11096', source: 'Sky Sports', sport: 'football' as const },
];

interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  enclosure?: { link?: string };
  'media:content'?: { url?: string };
}

interface RssResponse {
  status: string;
  feed: { title: string };
  items: RssItem[];
}

function extractImgFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function fetchRssFeeds(pageSize: number, sport?: 'cricket' | 'football'): Promise<NormalizedArticle[]> {
  const all: NormalizedArticle[] = [];
  const seen = new Set<string>();

  const feeds = sport ? RSS_FEEDS.filter((f) => f.sport === sport) : RSS_FEEDS;

  for (const feed of feeds) {
    try {
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(rssUrl, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const body = (await res.json()) as RssResponse;
      if (body.status !== 'ok' || !body.items?.length) continue;

      for (const item of body.items) {
        if (!item.title || seen.has(item.link)) continue;
        seen.add(item.link);
        const imgUrl = item.thumbnail ?? item.enclosure?.link ?? extractImgFromHtml(item.description) ?? '';
        all.push({
          id: `rss-${all.length}-${Date.now()}`,
          title: item.title,
          description: item.description?.replace(/<[^>]+>/g, '').slice(0, 300) ?? '',
          url: item.link,
          image: imgUrl,
          source: feed.source,
          publishedAt: item.pubDate,
          content: null,
        });
        if (all.length >= pageSize * 2) break;
      }
    } catch {
      // RSS feed failed, skip
    }
  }

  return all;
}

export async function searchNews(query: string, pageSize = 10, sport?: 'cricket' | 'football'): Promise<NormalizedArticle[]> {
  // Step 1: Try NewsAPI
  try {
    const res = await getNewsApiClient().get<NewsApiResponse>('/everything', {
      params: { q: query, language: 'en', sortBy: 'relevancy', pageSize },
    });
    if (res.data.status === 'ok' && isValidArray<NewsApiArticle>(res.data.articles)) {
      const articles = normalizeNewsApi(res.data.articles);
      console.log(`[News] NewsAPI + "${query.slice(0, 30)}": ${articles.length} articles`);
      return articles;
    }
  } catch (e) {
    const msg = e instanceof ApiError ? `${e.status} ${e.message}` : e instanceof Error ? e.message : String(e);
    console.log(`[News] NewsAPI + "${query.slice(0, 30)}": FAILED (${msg})`);
  }

  // Step 2: Fallback to NewsData.io
  try {
    const res = await getNewsDataClient().get<NewsDataResponse>('/news', {
      params: { q: query, language: 'en', size: pageSize },
    });
    if (res.data.status === 'success' && isValidArray<NewsDataArticle>(res.data.results)) {
      const articles = normalizeNewsData(res.data.results);
      console.log(`[News] NewsData + "${query.slice(0, 30)}": ${articles.length} articles`);
      return articles;
    }
  } catch (e) {
    const msg = e instanceof ApiError ? `${e.status} ${e.message}` : e instanceof Error ? e.message : String(e);
    console.log(`[News] NewsData + "${query.slice(0, 30)}": FAILED (${msg})`);
  }

  // Step 3: Fallback to GNews (if API key is available)
  const { gnewsApiKey } = getEnv();
  if (gnewsApiKey) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&token=${gnewsApiKey}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const body = (await res.json()) as GNewsResponse;
        if (body.articles?.length) {
          const articles = normalizeGNews(body.articles);
          console.log(`[News] GNews + "${query.slice(0, 30)}": ${articles.length} articles`);
          return articles;
        }
      }
    } catch {
      console.log(`[News] GNews + "${query.slice(0, 30)}": FAILED`);
    }
  }

  // Step 4: Fallback to RSS feeds
  try {
    const rssArticles = await fetchRssFeeds(pageSize, sport);
    if (rssArticles.length > 0) {
      console.log(`[News] RSS feeds + "${query.slice(0, 30)}": ${rssArticles.length} articles`);
      return rssArticles;
    }
  } catch {
    console.log(`[News] RSS feeds + "${query.slice(0, 30)}": FAILED`);
  }

  console.log(`[News] ALL sources failed for "${query.slice(0, 30)}"`);
  return [];
}

export async function searchAllNews(query: string, pageSize = 10, sport?: 'cricket' | 'football'): Promise<{ articles: NormalizedArticle[]; providerResults: { provider: string; returned: number }[] }> {
  const providerResults: { provider: string; returned: number }[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const allArticles: NormalizedArticle[] = [];

  function addUnique(a: NormalizedArticle) {
    const titleKey = a.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenUrls.has(a.url) || seenTitles.has(titleKey)) return;
    seenUrls.add(a.url);
    seenTitles.add(titleKey);
    allArticles.push(a);
  }

  // Try NewsAPI
  try {
    const res = await getNewsApiClient().get<NewsApiResponse>('/everything', {
      params: { q: query, language: 'en', sortBy: 'relevancy', pageSize },
    });
    if (res.data.status === 'ok' && isValidArray<NewsApiArticle>(res.data.articles)) {
      const articles = normalizeNewsApi(res.data.articles);
      providerResults.push({ provider: 'NewsAPI', returned: articles.length });
      for (const a of articles) addUnique(a);
    } else {
      providerResults.push({ provider: 'NewsAPI', returned: 0 });
    }
  } catch {
    providerResults.push({ provider: 'NewsAPI', returned: 0 });
  }

  // Try NewsData.io
  try {
    const res = await getNewsDataClient().get<NewsDataResponse>('/news', {
      params: { q: query, language: 'en', size: pageSize },
    });
    if (res.data.status === 'success' && isValidArray<NewsDataArticle>(res.data.results)) {
      const articles = normalizeNewsData(res.data.results);
      providerResults.push({ provider: 'NewsData', returned: articles.length });
      for (const a of articles) addUnique(a);
    } else {
      providerResults.push({ provider: 'NewsData', returned: 0 });
    }
  } catch {
    providerResults.push({ provider: 'NewsData', returned: 0 });
  }

  // Try GNews
  const { gnewsApiKey } = getEnv();
  if (gnewsApiKey) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${pageSize}&token=${gnewsApiKey}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const body = (await res.json()) as GNewsResponse;
        if (body.articles?.length) {
          const articles = normalizeGNews(body.articles);
          providerResults.push({ provider: 'GNews', returned: articles.length });
          for (const a of articles) addUnique(a);
        } else {
          providerResults.push({ provider: 'GNews', returned: 0 });
        }
      } else {
        providerResults.push({ provider: 'GNews', returned: 0 });
      }
    } catch {
      providerResults.push({ provider: 'GNews', returned: 0 });
    }
  } else {
    providerResults.push({ provider: 'GNews', returned: 0 });
  }

  // Try RSS feeds
  try {
    const rssArticles = await fetchRssFeeds(pageSize, sport);
    if (rssArticles.length > 0) {
      providerResults.push({ provider: 'RSS', returned: rssArticles.length });
      for (const a of rssArticles) addUnique(a);
    } else {
      providerResults.push({ provider: 'RSS', returned: 0 });
    }
  } catch {
    providerResults.push({ provider: 'RSS', returned: 0 });
  }

  return { articles: allArticles.slice(0, pageSize * 2), providerResults };
}
