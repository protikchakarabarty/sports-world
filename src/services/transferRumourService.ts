import { searchNews } from './newsApi';
import { generateContent } from './geminiApi';
import type { NormalizedArticle } from './newsApi';

export interface TransferRumour {
  id: string;
  player: string;
  playerImage: string;
  fromTeam: string;
  fromLogo: string;
  toTeam: string;
  toLogo: string;
  estimatedFee: string;
  probability: number;
  sources: string[];
  articleUrl: string;
  date: string;
  title: string;
  countryFlag: string;
}

export interface TransferNewsItem {
  title: string;
  image: string;
  source: string;
  url: string;
  date: string;
}

const TRANSFER_KEYWORDS = [
  'transfer', 'signing', 'signs', 'joins', 'joined', 'loan', 'contract',
  'medical', 'agreement', 'bid', 'release clause', 'here we go',
  'fabrizio romano', 'sky sports', 'bbc sport', 'romano',
  'exit', 'departure', 'move', 'sell', 'buy', 'interest', 'target', 'offer',
];

const BLOCK_KEYWORDS = [
  'match report', 'result', 'fixtures', 'standings', 'preview',
  'world cup', 'highlights', 'review', 'prediction', 'lineup',
  'team news', 'injury update', 'press conference', 'interview',
  'opinion', 'analysis', 'reaction', 'recap', 'roundup',
  'fantasy', 'betting', 'odds', 'tips', 'transfers - ',

  // Block other sports
  'cricket', 'ipl', 'bcci', 'test match', 'odi', 't20', 'wpl',
  'basketball', 'nba', 'tennis', 'wimbledon',
  'formula 1', 'f1', 'grand prix', 'motogp',
  'baseball', 'mlb', 'hockey', 'nhl',
  'golf', 'pga', 'masters', 'rugby',
  'boxing', 'ufc', 'wwe',
];

const TRANSFER_QUERIES = [
  'football transfer news',
  'player transfer rumour signing',
  'transfer deal medical',
  'football transfer window latest',
  'star player transfer move',
  'premier league transfer news',
  'transfer bid agreement',
  'soccer transfer news latest',
];

const FALLBACK_RUMOURS: TransferRumour[] = [
  {
    id: 'm-rumour-1', player: 'Kylian Mbappé',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kylian_Mbapp%C3%A9_2024_%28cropped%29.jpg/330px-Kylian_Mbapp%C3%A9_2024_%28cropped%29.jpg',
    fromTeam: 'Real Madrid', fromLogo: '', toTeam: 'Manchester United', toLogo: '',
    estimatedFee: '€200M', probability: 30,
    sources: ['Marca'], articleUrl: '', date: new Date().toISOString(),
    title: 'Real Madrid open to Mbappé sale as FFP pressures mount', countryFlag: 'fr',
  },
  {
    id: 'm-rumour-2', player: 'Jude Bellingham',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jude_Bellingham_2024_%28cropped%29.jpg/330px-Jude_Bellingham_2024_%28cropped%29.jpg',
    fromTeam: 'Real Madrid', fromLogo: '', toTeam: 'Manchester City', toLogo: '',
    estimatedFee: '€180M', probability: 25,
    sources: ['The Athletic'], articleUrl: '', date: new Date().toISOString(),
    title: 'City consider record bid for Bellingham as Modric replacement', countryFlag: 'gb-eng',
  },
  {
    id: 'm-rumour-3', player: 'Vinicius Junior',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Vin%C3%ADcius_J%C3%BAnior_2024_%28cropped%29.jpg/330px-Vin%C3%ADcius_J%C3%BAnior_2024_%28cropped%29.jpg',
    fromTeam: 'Real Madrid', fromLogo: '', toTeam: 'Paris Saint-Germain', toLogo: '',
    estimatedFee: '€150M', probability: 40,
    sources: ['L\'Équipe'], articleUrl: '', date: new Date().toISOString(),
    title: 'PSG plot Vinicius Jr move as Mbappé successor', countryFlag: 'br',
  },
  {
    id: 'm-rumour-4', player: 'Bukayo Saka',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bukayo_Saka_2023_%28cropped%29.jpg/330px-Bukayo_Saka_2023_%28cropped%29.jpg',
    fromTeam: 'Arsenal', fromLogo: '', toTeam: 'Liverpool', toLogo: '',
    estimatedFee: '€120M', probability: 20,
    sources: ['Sky Sports'], articleUrl: '', date: new Date().toISOString(),
    title: 'Liverpool consider Saka as Salah replacement', countryFlag: 'gb-eng',
  },
  {
    id: 'm-rumour-5', player: 'Erling Haaland',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Erling_Haaland_2024_%28cropped%29.jpg/330px-Erling_Haaland_2024_%28cropped%29.jpg',
    fromTeam: 'Manchester City', fromLogo: '', toTeam: 'Real Madrid', toLogo: '',
    estimatedFee: '€250M', probability: 35,
    sources: ['Marca', 'AS'], articleUrl: '', date: new Date().toISOString(),
    title: 'Haaland\'s release clause active — Madrid monitoring situation', countryFlag: 'no',
  },
  {
    id: 'm-rumour-6', player: 'Lamine Yamal',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Lamine_Yamal_2024_%28cropped%29.jpg/330px-Lamine_Yamal_2024_%28cropped%29.jpg',
    fromTeam: 'Barcelona', fromLogo: '', toTeam: 'Paris Saint-Germain', toLogo: '',
    estimatedFee: '€250M', probability: 15,
    sources: ['Sport'], articleUrl: '', date: new Date().toISOString(),
    title: 'PSG prepare world-record bid for Yamal', countryFlag: 'es',
  },
  {
    id: 'm-rumour-7', player: 'Victor Osimhen',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Victor_Osimhen_2024_%28cropped%29.jpg/330px-Victor_Osimhen_2024_%28cropped%29.jpg',
    fromTeam: 'Napoli', fromLogo: '', toTeam: 'Chelsea', toLogo: '',
    estimatedFee: '€110M', probability: 55,
    sources: ['Sky Sports'], articleUrl: '', date: new Date().toISOString(),
    title: 'Chelsea reignite Osimhen interest with improved offer', countryFlag: 'ng',
  },
  {
    id: 'm-rumour-8', player: 'Florian Wirtz',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Florian_Wirtz_2024_%28cropped%29.jpg/330px-Florian_Wirtz_2024_%28cropped%29.jpg',
    fromTeam: 'Bayer Leverkusen', fromLogo: '', toTeam: 'Bayern Munich', toLogo: '',
    estimatedFee: '€100M', probability: 60,
    sources: ['Kicker'], articleUrl: '', date: new Date().toISOString(),
    title: 'Wirtz favours Bayern move as release clause nears', countryFlag: 'de',
  },
  {
    id: 'm-rumour-9', player: 'Rodri',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Rodri_2024_%28cropped%29.jpg/330px-Rodri_2024_%28cropped%29.jpg',
    fromTeam: 'Manchester City', fromLogo: '', toTeam: 'Real Madrid', toLogo: '',
    estimatedFee: '€120M', probability: 25,
    sources: ['AS'], articleUrl: '', date: new Date().toISOString(),
    title: 'Real Madrid target Rodri as Kroos successor', countryFlag: 'es',
  },
  {
    id: 'm-rumour-10', player: 'Alexander Isak',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Alexander_Isak_2024_%28cropped%29.jpg/330px-Alexander_Isak_2024_%28cropped%29.jpg',
    fromTeam: 'Newcastle United', fromLogo: '', toTeam: 'Arsenal', toLogo: '',
    estimatedFee: '€90M', probability: 45,
    sources: ['The Athletic'], articleUrl: '', date: new Date().toISOString(),
    title: 'Arsenal make Isak top summer target as Newcastle face PSR pressure', countryFlag: 'se',
  },
];

const FALLBACK_NEWS: TransferNewsItem[] = [
  { title: 'Premier League clubs set for record summer spending spree', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Premier_League_logo.svg/600px-Premier_League_logo.svg.png', source: 'BBC Sport', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Real Madrid lead race for Premier League star', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Real_Madrid_2024_logo.svg/600px-Real_Madrid_2024_logo.svg.png', source: 'Sky Sports', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Chelsea complete first signing of summer window', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Chelsea_2024_logo.svg/600px-Chelsea_2024_logo.svg.png', source: 'The Athletic', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Manchester United identify top defensive target', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Manchester_United_2024_logo.svg/600px-Manchester_United_2024_logo.svg.png', source: 'ESPN', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Saudi Pro League clubs target European stars in £500M window', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Saudi_Pro_League_logo.svg/600px-Saudi_Pro_League_logo.svg.png', source: 'The Guardian', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Arsenal and Tottenham battle for £60M midfielder', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Arsenal_2024_logo.svg/600px-Arsenal_2024_logo.svg.png', source: 'Evening Standard', url: '', date: new Date().toISOString().split('T')[0] },
];

const PLAYER_IMAGE_MAP: Record<string, string> = {};
for (const r of FALLBACK_RUMOURS) {
  if (r.playerImage) PLAYER_IMAGE_MAP[r.player.toLowerCase()] = r.playerImage;
}

const RUMOUR_CACHE_KEY = 'sw_transfer_rumours';
const ARTICLES_CACHE_KEY = 'sw_transfer_articles';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CacheEntry<T = TransferRumour[]> {
  data: T;
  contentHash: string;
  timestamp: number;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function loadCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function saveCache<T>(key: string, data: T, contentHash: string): void {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      contentHash,
      timestamp: Date.now(),
    }));
  } catch {
    console.warn(`[Transfer] Failed to save cache for ${key}`);
  }
}

function loadArticlesCache(): NormalizedArticle[] | null {
  const cached = loadCache<NormalizedArticle[]>(ARTICLES_CACHE_KEY);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function saveArticlesCache(data: NormalizedArticle[], contentHash: string): void {
  saveCache(ARTICLES_CACHE_KEY, data, contentHash);
}

function extractJson(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

const KNOWN_TRANSFER_PLAYERS = new Set<string>();

function isKnownPlayer(name: string): boolean {
  if (!name || name.length < 3) return false;
  const lower = name.toLowerCase().trim();

  // Reject generic words/phrases that are not football players
  const genericWords = [
    'world cup', 'premier league', 'champions league', 'la liga', 'serie a',
    'bundesliga', 'ligue 1', 'eredivisie', 'transfer', 'signing', 'football',
    'soccer', 'england', 'spain', 'germany', 'france', 'italy', 'brazil',
    'argentina', 'paper talk', 'gossip', 'rumour mill', 'deadline day',
    'transfer window', 'top', 'star', 'star player', 'star man',
    'forward', 'defender', 'midfielder', 'goalkeeper', 'striker', 'winger',
    'captain', 'veteran', 'youngster', 'teenager', 'prospect', 'ace',
    'target', 'interest', 'bid', 'deal', 'move', 'exit', 'departure',
    'agreement', 'talks', 'negotiations', 'set', 'set to', 'close to',
    'eyeing', 'keen on', 'plotting', 'planning', 'weighing',
  ];

  if (genericWords.some((w) => lower === w || lower.startsWith(w + ' ') || lower.endsWith(' ' + w) || lower.includes(' ' + w + ' '))) {
    return false;
  }

  // Must be at least 2 characters, at least one letter
  if (!/[a-z\u00C0-\u024F]/i.test(name)) return false;

  // Must have at least 2 parts (first + last name)
  const parts = lower.split(' ').filter(Boolean);
  if (parts.length < 2) return false;

  // Each part should be at least 2 characters
  if (parts.some((p) => p.length < 2)) return false;

  return true;
}

function isTransferArticle(article: NormalizedArticle): boolean {
  const text = `${article.title} ${article.description}`.toLowerCase();

  // Must match at least ONE transfer keyword
  const hasTransferKeyword = TRANSFER_KEYWORDS.some((kw) => text.includes(kw));
  if (!hasTransferKeyword) return false;

  // Must NOT match any block keyword (match reports, previews, etc.)
  const isBlocked = BLOCK_KEYWORDS.some((kw) => text.includes(kw));
  if (isBlocked) return false;

  return true;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const now = Date.now();
    const d = new Date(dateStr).getTime();
    if (isNaN(d)) return '';
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function getCountryFlag(teamName: string): string {
  const flags: Record<string, string> = {
    'england': 'gb-eng', 'premier league': 'gb-eng', 'manchester': 'gb-eng',
    'liverpool': 'gb-eng', 'chelsea': 'gb-eng', 'arsenal': 'gb-eng',
    'tottenham': 'gb-eng', 'man city': 'gb-eng', 'newcastle': 'gb-eng',
    'aston villa': 'gb-eng', 'west ham': 'gb-eng',
    'spain': 'es', 'la liga': 'es', 'barcelona': 'es', 'real madrid': 'es',
    'atletico madrid': 'es', 'atlético madrid': 'es', 'sevilla': 'es',
    'germany': 'de', 'bundesliga': 'de', 'bayern': 'de', 'borussia': 'de',
    'dortmund': 'de', 'bayer': 'de', 'leipzig': 'de',
    'italy': 'it', 'serie a': 'it', 'juventus': 'it', 'milan': 'it',
    'inter': 'it', 'napoli': 'it', 'roma': 'it',
    'france': 'fr', 'ligue 1': 'fr', 'paris': 'fr', 'psg': 'fr',
    'monaco': 'fr', 'lyon': 'fr', 'marseille': 'fr',
    'netherlands': 'nl', 'eredivisie': 'nl', 'ajax': 'nl', 'feyenoord': 'nl',
    'portugal': 'pt', 'primeira liga': 'pt', 'benfica': 'pt', 'porto': 'pt',
    'sporting': 'pt',
    'brazil': 'br', 'flamengo': 'br', 'palmeiras': 'br', 'santos': 'br',
    'argentina': 'ar', 'river plate': 'ar', 'boca juniors': 'ar',
    'belgium': 'be', 'turkey': 'tr', 'galatasaray': 'tr', 'fenerbahce': 'tr',
    'scotland': 'gb-sct', 'celtic': 'gb-sct', 'rangers': 'gb-sct',
  };
  const lower = teamName.toLowerCase();
  for (const [key, flag] of Object.entries(flags)) {
    if (lower.includes(key)) return flag;
  }
  return '';
}

let _lastTransferArticleCounts = { newsApi: 0, gnews: 0, rss: 0, total: 0, filtered: 0 };

async function searchTransferArticles(): Promise<NormalizedArticle[]> {
  // Check 24h cache first
  const cached = loadArticlesCache();
  if (cached) {
    return cached;
  }

  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];
  let newsApiCount = 0;
  let gnewsCount = 0;
  let rssCount = 0;

  for (const query of TRANSFER_QUERIES) {
    const results = await searchNews(query, 25, 'football');
    for (const article of results) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        if (article.id.startsWith('na-')) newsApiCount++;
        else if (article.id.startsWith('gn-')) gnewsCount++;
        else if (article.id.startsWith('rss-')) rssCount++;
        if (isTransferArticle(article)) {
          articles.push(article);
        }
      }
    }
  }

  const final = articles.slice(0, 100);
  _lastTransferArticleCounts = {
    newsApi: newsApiCount,
    gnews: gnewsCount,
    rss: rssCount,
    total: seen.size,
    filtered: final.length,
  };

  console.log(`[Transfer] NewsAPI: ${newsApiCount} articles found`);
  console.log(`[Transfer] GNews: ${gnewsCount} articles found`);
  console.log(`[Transfer] RSS: ${rssCount} articles found`);
  console.log(`[Transfer] After transfer keyword filter: ${final.length} articles`);

  // Cache for 24h
  if (final.length > 0) {
    saveArticlesCache(final, simpleHash(final.map((a) => a.url).join('')));
  }

  return final;
}

function buildRumourPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Source: ${a.source}\n   URL: ${a.url}`
  ).join('\n\n');

  return `You are a football transfer expert. Extract ONLY real transfer rumours from these news articles.

CRITICAL RULES:
- If no real football player is mentioned, set "player" to null (skip the article)
- NEVER invent or guess a player name from generic headline words
- "World Cup", "Transfer", "Premier League", "Forward", "Defender" are NOT player names
- Only extract when a specific, real footballer is named

Return ONLY a valid JSON array. Each object must have:
- player: string (full name of the REAL footballer, or null if none found)
- fromTeam: string (current club, or null if unknown)
- toTeam: string (rumoured destination club, or null if unknown)
- estimatedFee: string (e.g. "€65M", "$50M", "Undisclosed", or null if unknown)
- probability: number (0-100 likelihood, or null if unknown)
- sourceName: string (primary source e.g. "Fabrizio Romano", "Sky Sports")
- articleUrl: string (the original article URL)

Skip the article if it's not about a specific transfer involving a named player.
Return [] if none found. No markdown.

Articles:
${items}`;
}

function buildNewsPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Source: ${a.source}\n   URL: ${a.url}`
  ).join('\n\n');

  return `Extract transfer news items from these articles. Return ONLY a valid JSON array. Each object must have:
- title: string (short transfer headline)
- source: string (news source name)
- url: string (article URL)
- date: string (today's date as YYYY-MM-DD)
If the article is not about a transfer, skip it. Return [] if none found. No markdown.

Articles:
${items}`;
}

function buildDiscussedPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Source: ${a.source}`
  ).join('\n\n');

  return `Extract the most discussed/trending football PLAYERS from these transfer news articles.
CRITICAL: Only extract REAL football player names. "World Cup", "Transfer", "Premier League" are NOT players.
Return ONLY a valid JSON array. Each object must have:
- player: string (full name of the REAL footballer, or null if none found)
- clubs: string[] (array of clubs linked to this player e.g. ["Real Madrid", "Manchester City"])
- sourceName: string (news source name)
- date: string (today's date as YYYY-MM-DD)
- reason: string (short reason why they're trending, e.g. "Contract dispute", "Release clause triggered")
Skip if no real player is identified. Return [] if none found. No markdown.

Articles:
${items}`;
}

async function extractRumours(articles: NormalizedArticle[]): Promise<TransferRumour[]> {
  if (articles.length === 0) return [];

  const prompt = buildRumourPrompt(articles);
  let text: string;
  try {
    text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`[Transfer] Gemini extraction FAILED for batch of ${articles.length} articles: ${msg}`);
    return [];
  }

  if (!text) return [];

  let parsed: Record<string, unknown>[];
  try {
    parsed = JSON.parse(extractJson(text)) as Record<string, unknown>[];
  } catch {
    console.log('[Transfer] Failed to parse Gemini JSON response — no rumours generated');
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const results: TransferRumour[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const r = parsed[i];
    const playerName = String(r.player ?? '').trim();

    // Skip if no player identified or player name is not a real footballer
    if (!playerName || playerName === 'null' || !isKnownPlayer(playerName)) {
      continue;
    }

    const article = articles[i] || articles[0];
    const fromTeam = String(r.fromTeam ?? '').trim();
    const toTeam = String(r.toTeam ?? '').trim();

    results.push({
      id: `rumour-${i}-${Date.now()}`,
      player: playerName,
      playerImage: article?.image ?? PLAYER_IMAGE_MAP[playerName.toLowerCase()] ?? '',
      fromTeam: fromTeam && fromTeam !== 'null' ? fromTeam : '—',
      fromLogo: '',
      toTeam: toTeam && toTeam !== 'null' ? toTeam : '—',
      toLogo: '',
      estimatedFee: String(r.estimatedFee ?? '').trim() || 'Undisclosed',
      probability: Math.max(0, Math.min(100, Number(r.probability) || 50)),
      sources: [String(r.sourceName ?? article?.source ?? '')].filter(Boolean),
      articleUrl: String(r.articleUrl ?? article?.url ?? ''),
      date: article?.publishedAt ?? new Date().toISOString(),
      title: article?.title ?? `${playerName} transfer rumour`,
      countryFlag: getCountryFlag(toTeam !== '—' ? toTeam : fromTeam),
    });
  }

  return results;
}

function buildContentHash(articles: NormalizedArticle[]): string {
  const keys = articles.map((a) => `${a.title}|${a.url}`).sort().join('||');
  return simpleHash(keys);
}

export async function getTransferRumours(): Promise<TransferRumour[]> {
  const cached = loadCache<TransferRumour[]>(RUMOUR_CACHE_KEY);

  console.log('[Transfer] ===== Fetching transfer data =====');
  const articles = await searchTransferArticles();
  const contentHash = buildContentHash(articles);

  if (cached && cached.contentHash === contentHash && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Transfer] 24h cache HIT — ${cached.data.length} rumours (content unchanged)`);
    console.log(`[Transfer] Using cached rumours`);
    return cached.data;
  }

  if (!articles.length) {
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[Transfer] No new articles, using cached');
      console.log(`[Transfer] Using cached rumours`);
      return cached.data;
    }
    console.log('[Transfer] No articles found from any source');
    console.log(`[Transfer] AI Rumours generated: 0`);
    console.log(`[Transfer] Using FALLBACK_RUMOURS (${FALLBACK_RUMOURS.length} entries)`);
    return FALLBACK_RUMOURS;
  }

  console.log(`[Transfer] ${articles.length} transfer-related articles found, starting AI extraction...`);

  const BATCH_SIZE = 10;
  const rumourBatches: Promise<TransferRumour[]>[] = [];

  for (let i = 0; i < Math.min(articles.length, 50); i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    rumourBatches.push(extractRumours(batch).catch(() => [] as TransferRumour[]));
  }

  console.log(`[Transfer] Generating ${rumourBatches.length} parallel batches (${articles.length} articles)...`);
  const batchResults = await Promise.all(rumourBatches);
  const results = batchResults.flat().slice(0, 50);

  if (results.length > 0) {
    saveCache(RUMOUR_CACHE_KEY, results, contentHash);
  }

  console.log(`[Transfer] AI Rumours generated: ${results.length}`);
  if (results.length > 0) {
    console.log(`[Transfer] Using AI-generated rumours`);
    return results;
  }

  console.log(`[Transfer] AI extraction returned 0 — using FALLBACK_RUMOURS (${FALLBACK_RUMOURS.length} entries)`);
  return FALLBACK_RUMOURS;
}

export async function getTransferNews(): Promise<TransferNewsItem[]> {
  const articles = await searchTransferArticles();
  if (!articles.length) {
    console.log(`[Transfer] No articles for news, using FALLBACK_NEWS (${FALLBACK_NEWS.length} entries)`);
    return FALLBACK_NEWS;
  }

  // Use articles directly — no AI processing needed for news items
  return articles.slice(0, 50).map((a) => ({
    title: a.title,
    image: a.image ?? '',
    source: a.source,
    url: a.url,
    date: a.publishedAt?.split('T')[0] ?? '',
  }));
}

export async function getDiscussedPlayers(): Promise<TransferRumour[]> {
  const articles = await searchTransferArticles();
  if (!articles.length) {
    console.log(`[Transfer] No articles for discussed, using FALLBACK_RUMOURS (${FALLBACK_RUMOURS.length} entries)`);
    return FALLBACK_RUMOURS;
  }

  const BATCH_SIZE = 15;
  const batches: Promise<TransferRumour[]>[] = [];

  for (let i = 0; i < Math.min(articles.length, 45); i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    batches.push(
      (async () => {
        try {
          const prompt = buildDiscussedPrompt(batch);
          const text = await generateContent(prompt, 'gemini-2.0-flash', 1024, 0.3);
          if (!text) return [];

          let parsed: Record<string, unknown>[];
          try {
            parsed = JSON.parse(extractJson(text)) as Record<string, unknown>[];
          } catch {
            return [];
          }

          if (!Array.isArray(parsed)) return [];

          const results: TransferRumour[] = [];
          for (let j = 0; j < parsed.length; j++) {
            const d = parsed[j];
            const playerName = String(d.player ?? '').trim();
            if (!playerName || playerName === 'null' || !isKnownPlayer(playerName)) continue;

            const article = batch[j] || batch[0];
            const clubs = (d.clubs as string[]) ?? [];

            results.push({
              id: `discussed-${j}-${Date.now()}`,
              player: playerName,
              playerImage: article?.image ?? PLAYER_IMAGE_MAP[playerName.toLowerCase()] ?? '',
              fromTeam: clubs[0] ?? '—',
              fromLogo: '',
              toTeam: clubs[1] ?? clubs[0] ?? '—',
              toLogo: '',
              estimatedFee: 'Trending',
              probability: 0,
              sources: [String(d.sourceName ?? article?.source ?? '')],
              articleUrl: article?.url ?? '',
              date: String(d.date ?? article?.publishedAt?.split('T')[0] ?? ''),
              title: String(d.reason ?? d.player ?? ''),
              countryFlag: '',
            });
          }
          return results;
        } catch {
          return [];
        }
      })(),
    );
  }

  const batchResults = await Promise.all(batches);
  const results = batchResults.flat().slice(0, 20);

  if (results.length > 0) {
    console.log(`[Transfer] Discussed AI results: ${results.length}`);
    return results;
  }

  console.log(`[Transfer] Discussed AI returned 0 — using FALLBACK_RUMOURS (${FALLBACK_RUMOURS.length} entries)`);
  return FALLBACK_RUMOURS;
}

export { timeAgo };
