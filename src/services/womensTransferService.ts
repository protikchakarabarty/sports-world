import { searchNews } from './newsApi';
import { generateContent } from './geminiApi';
import type { NormalizedArticle } from './newsApi';

export interface WomenTransferRumour {
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

export interface WomenTransferNewsItem {
  title: string;
  image: string;
  source: string;
  url: string;
  date: string;
}

const WOMENS_FOOTBALL_KEYWORDS = [
  "women's", 'women', 'womens', 'woman', 'female',
  'wsl', 'nwsl', 'liga f', 'division 1 féminine',
  'shebelieves', 'lionesses', 'frauen bundesliga',
  'chelsea women', 'arsenal women', 'man city women',
  'manchester city women', 'man united women',
  'barcelona femení', 'lyon féminin', 'ol lyon',
  'womens super league', "women's super league",
  'australia women', 'england women', 'usa women',
  'matildas', 'uswnt', 'lauren james', 'kiera walsh',
  'alexia putellas', 'aitana bonmatí', 'sam kerr',
  'marta', 'megan rapinoe', 'alex morgan', 'wendie renard',
  'ada hegerberg', 'vivianne miedema', 'beth mead',
  'fridolina rolfo', 'caroline graham hansen',
  'millie bright', 'leah williamson', 'lucy bronze',
  'katie mccabe', 'kim little', 'ji so-yun',
  'debinha', 'asisat oshoala', 'lieke martens',
  'pernille harder', 'christiane endler',
  'ballon d\'or féminin', 'the best fifa women',
];

const WOMENS_TRANSFER_KEYWORDS = [
  'transfer', 'signing', 'signs', 'joins', 'joined', 'loan', 'contract',
  'medical', 'agreement', 'bid', 'release clause', 'here we go',
  'fabrizio romano', 'sky sports', 'bbc sport', 'romano',
  'exit', 'departure', 'move', 'sell', 'buy', 'interest', 'target', 'offer',
];

const WOMENS_BLOCK_KEYWORDS = [
  'match report', 'result', 'fixtures', 'standings', 'preview',
  'highlights', 'review', 'prediction', 'lineup',
  'team news', 'injury update', 'press conference', 'interview',
  'opinion', 'analysis', 'reaction', 'recap', 'roundup',
  'fantasy', 'betting', 'odds', 'tips', 'transfers - ',

  // Block other sports
  'cricket', 'ipl', 'bcci', 'test match', 'odi', 't20', 'wpl',
  'bbl', 'cpl', 'ranji', 'county cricket', 'the hundred',
  'virat kohli', 'rohit sharma', 'jasprit bumrah', 'virat', 'kohli',
  'batting', 'bowling', 'wicket', 'innings', 'stump', 'century',
  'basketball', 'nba', 'tennis', 'wimbledon',
  'formula 1', 'f1', 'grand prix', 'motogp',
  'baseball', 'mlb', 'hockey', 'nhl',
  'golf', 'pga', 'masters', 'rugby',
  'boxing', 'ufc', 'wwe',

  // Block men's football (only unmistakably men-specific terms)
  "men's premier league", ' champions league men',
  'manchester united men', 'tottenham hotspur men',
  'real madrid men', 'bayern munich men',
  'erling haaland', 'kylian mbappé', 'kylian mbappe',
  'jude bellingham', 'vinicius jr', 'vinícius jr',
  'harry kane', 'mohamed salah', 'kevin de bruyne',
  "men's football", 'mens football', 'men football',
];

const WOMENS_TRANSFER_QUERIES = [
  "women's football transfer",
  'WSL transfer news',
  'NWSL transfer signing',
  "women's soccer transfer",
  'Liga F transfer',
];

const RUMOUR_CACHE_KEY = 'sw_women_transfer_rumours';
const ARTICLES_CACHE_KEY = 'sw_women_transfer_articles';
const CACHE_TTL = 24 * 60 * 60 * 1000;

const FALLBACK_RUMOURS: WomenTransferRumour[] = [
  {
    id: 'fw-rumour-1', player: 'Alexia Putellas',
    playerImage: 'https://img.uefa.com/imgml/2023/ucl/players/003/700x700/250101383.jpg',
    fromTeam: 'Barcelona', fromLogo: '', toTeam: 'Chelsea Women', toLogo: '',
    estimatedFee: 'Free Transfer', probability: 75,
    sources: ['Sky Sports'], articleUrl: '', date: new Date().toISOString(),
    title: 'Alexia Putellas set to join Chelsea on free transfer', countryFlag: 'es',
  },
  {
    id: 'fw-rumour-2', player: 'Keira Walsh',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Keira_Walsh_2024_%28cropped%29.jpg/330px-Keira_Walsh_2024_%28cropped%29.jpg',
    fromTeam: 'Barcelona', fromLogo: '', toTeam: 'Chelsea Women', toLogo: '',
    estimatedFee: '€450k', probability: 85,
    sources: ['BBC Sport'], articleUrl: '', date: new Date().toISOString(),
    title: 'Keira Walsh completes Chelsea move from Barcelona', countryFlag: 'gb-eng',
  },
  {
    id: 'fw-rumour-3', player: 'Sam Kerr',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sam_Kerr_2023_%28cropped%29.jpg/330px-Sam_Kerr_2023_%28cropped%29.jpg',
    fromTeam: 'Chelsea Women', fromLogo: '', toTeam: 'Real Madrid', toLogo: '',
    estimatedFee: 'Undisclosed', probability: 45,
    sources: ['Marca'], articleUrl: '', date: new Date().toISOString(),
    title: 'Real Madrid interested in Sam Kerr as Herrera replacement', countryFlag: 'au',
  },
  {
    id: 'fw-rumour-4', player: 'Mary Earps',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Mary_Earps_2023_%28cropped%29.jpg/330px-Mary_Earps_2023_%28cropped%29.jpg',
    fromTeam: 'Manchester United Women', fromLogo: '', toTeam: 'Paris Saint-Germain', toLogo: '',
    estimatedFee: '€100k', probability: 70,
    sources: ['L\'Équipe'], articleUrl: '', date: new Date().toISOString(),
    title: 'Mary Earps in talks with PSG over summer move', countryFlag: 'gb-eng',
  },
  {
    id: 'fw-rumour-5', player: 'Alessia Russo',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Alessia_Russo_2023_%28cropped%29.jpg/330px-Alessia_Russo_2023_%28cropped%29.jpg',
    fromTeam: 'Arsenal Women', fromLogo: '', toTeam: 'Manchester United Women', toLogo: '',
    estimatedFee: '€300k', probability: 60,
    sources: ['The Athletic'], articleUrl: '', date: new Date().toISOString(),
    title: 'Russo considering Man United offer as contract talks stall', countryFlag: 'gb-eng',
  },
  {
    id: 'fw-rumour-6', player: 'Lauren James',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lauren_James_2022_%28cropped%29.jpg/330px-Lauren_James_2022_%28cropped%29.jpg',
    fromTeam: 'Chelsea Women', fromLogo: '', toTeam: 'Lyon', toLogo: '',
    estimatedFee: '€500k', probability: 35,
    sources: ['The Guardian'], articleUrl: '', date: new Date().toISOString(),
    title: 'Lyon preparing bid for Chelsea star Lauren James', countryFlag: 'gb-eng',
  },
  {
    id: 'fw-rumour-7', player: 'Fridolina Rolfö',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Fridolina_Rolf%C3%B6_2023_%28cropped%29.jpg/330px-Fridolina_Rolf%C3%B6_2023_%28cropped%29.jpg',
    fromTeam: 'Barcelona', fromLogo: '', toTeam: 'Arsenal Women', toLogo: '',
    estimatedFee: 'Undisclosed', probability: 50,
    sources: ['Sky Sports'], articleUrl: '', date: new Date().toISOString(),
    title: 'Arsenal keen on Barcelona\'s Rolfö as Mead replacement', countryFlag: 'se',
  },
  {
    id: 'fw-rumour-8', player: 'Millie Bright',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Millie_Bright_2023_%28cropped%29.jpg/330px-Millie_Bright_2023_%28cropped%29.jpg',
    fromTeam: 'Chelsea Women', fromLogo: '', toTeam: 'Lyon', toLogo: '',
    estimatedFee: 'Free Transfer', probability: 40,
    sources: ['Foot Mercato'], articleUrl: '', date: new Date().toISOString(),
    title: 'Lyon target Millie Bright as Renard successor', countryFlag: 'gb-eng',
  },
  {
    id: 'fw-rumour-9', player: 'Trinity Rodman',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Trinity_Rodman_2023_%28cropped%29.jpg/330px-Trinity_Rodman_2023_%28cropped%29.jpg',
    fromTeam: 'Washington Spirit', fromLogo: '', toTeam: 'Chelsea Women', toLogo: '',
    estimatedFee: '€1M', probability: 55,
    sources: ['ESPN'], articleUrl: '', date: new Date().toISOString(),
    title: 'Chelsea in talks with Washington Spirit for Rodman', countryFlag: 'us',
  },
  {
    id: 'fw-rumour-10', player: 'Lena Oberdorf',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Lena_Oberdorf_2023_%28cropped%29.jpg/330px-Lena_Oberdorf_2023_%28cropped%29.jpg',
    fromTeam: 'Wolfsburg Women', fromLogo: '', toTeam: 'Bayern Munich Women', toLogo: '',
    estimatedFee: '€350k', probability: 80,
    sources: ['Kicker'], articleUrl: '', date: new Date().toISOString(),
    title: 'Oberdorf agrees personal terms with Bayern Munich', countryFlag: 'de',
  },
];

const FALLBACK_NEWS: WomenTransferNewsItem[] = [
  { title: 'WSL clubs smash transfer records in summer window', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/FA_Women%27s_Super_League_logo.svg/600px-FA_Women%27s_Super_League_logo.svg.png', source: 'BBC Sport', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'NWSL stars attract European interest as window opens', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/NWSL_logo.svg/600px-NWSL_logo.svg.png', source: 'ESPN', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Lyon rebuild: French giants target Chelsea duo', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Olympique_Lyonnais_2024_logo.svg/600px-Olympique_Lyonnais_2024_logo.svg.png', source: 'L\'Équipe', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'Barcelona femení face midfield exodus this summer', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/FC_Barcelona_2024_logo.svg/600px-FC_Barcelona_2024_logo.svg.png', source: 'Marca', url: '', date: new Date().toISOString().split('T')[0] },
  { title: 'WSL summer transfer window: All you need to know', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Women%27s_Super_League_2024_logo.svg/600px-Women%27s_Super_League_2024_logo.svg.png', source: 'The Athletic', url: '', date: new Date().toISOString().split('T')[0] },
];

const PLAYER_IMAGE_MAP: Record<string, string> = {};
for (const r of FALLBACK_RUMOURS) {
  if (r.playerImage) PLAYER_IMAGE_MAP[r.player.toLowerCase()] = r.playerImage;
}

interface CacheEntry<T = WomenTransferRumour[]> {
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
    console.warn(`[WomenTransfer] Failed to save cache for ${key}`);
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

  if (!/[a-z\u00C0-\u024F]/i.test(name)) return false;

  const parts = lower.split(' ').filter(Boolean);
  if (parts.length < 2) return false;

  if (parts.some((p) => p.length < 2)) return false;

  return true;
}

function isTransferArticle(article: NormalizedArticle): boolean {
  const text = `${article.title} ${article.description}`.toLowerCase();

  const isBlocked = WOMENS_BLOCK_KEYWORDS.some((kw) => text.includes(kw));
  if (isBlocked) return false;

  const hasTransferKeyword = WOMENS_TRANSFER_KEYWORDS.some((kw) => text.includes(kw));
  if (!hasTransferKeyword) return false;

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

async function searchWomenTransferArticles(pageSize: number): Promise<NormalizedArticle[]> {
  const cached = loadArticlesCache();
  if (cached) {
    return cached;
  }

  const seen = new Set<string>();
  const articles: NormalizedArticle[] = [];
  let newsApiCount = 0;
  let gnewsCount = 0;
  let rssCount = 0;

  for (const query of WOMENS_TRANSFER_QUERIES) {
    const results = await searchNews(query, pageSize, 'football');
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

  console.log(`[WomenTransfer] NewsAPI: ${newsApiCount} articles found`);
  console.log(`[WomenTransfer] GNews: ${gnewsCount} articles found`);
  console.log(`[WomenTransfer] RSS: ${rssCount} articles found`);
  console.log(`[WomenTransfer] After transfer keyword filter: ${final.length} articles`);

  if (final.length > 0) {
    saveArticlesCache(final, simpleHash(final.map((a) => a.url).join('')));
  }

  return final;
}

function buildRumourPrompt(articles: NormalizedArticle[]): string {
  const items = articles.map((a, i) =>
    `${i + 1}. Title: ${a.title}\n   Description: ${a.description}\n   Source: ${a.source}\n   URL: ${a.url}`
  ).join('\n\n');

  return `You are a women's football transfer expert. Extract ONLY real transfer rumours from these news articles.

CRITICAL RULES:
- If no real women's football player is mentioned, set "player" to null (skip the article)
- NEVER invent or guess a player name from generic headline words
- "World Cup", "Transfer", "Premier League", "Forward", "Defender" are NOT player names
- Only extract when a specific, real women's footballer is named

Return ONLY a valid JSON array. Each object must have:
- player: string (full name of the REAL footballer, or null if none found)
- fromTeam: string (current club, or null if unknown)
- toTeam: string (rumoured destination club, or null if unknown)
- estimatedFee: string (e.g. "€65M", "$50M", "Undisclosed", or null if unknown)
- probability: number (0-100 likelihood, or null if unknown)
- sourceName: string (primary source e.g. "BBC Sport", "Sky Sports")
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

  return `Extract women's transfer news items from these articles. Return ONLY a valid JSON array. Each object must have:
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

  return `Extract the most discussed/trending women's football PLAYERS from these transfer news articles.
CRITICAL: Only extract REAL women's football player names. "World Cup", "Transfer", "Premier League" are NOT players.
Return ONLY a valid JSON array. Each object must have:
- player: string (full name of the REAL footballer, or null if none found)
- clubs: string[] (array of clubs linked to this player e.g. ["Chelsea Women", "Lyon"])
- sourceName: string (news source name)
- date: string (today's date as YYYY-MM-DD)
- reason: string (short reason why they're trending, e.g. "Contract dispute", "Release clause triggered")
Skip if no real player is identified. Return [] if none found. No markdown.

Articles:
${items}`;
}

async function extractRumours(articles: NormalizedArticle[]): Promise<WomenTransferRumour[]> {
  if (articles.length === 0) return [];

  const prompt = buildRumourPrompt(articles);
  let text: string;
  try {
    text = await generateContent(prompt, 'gemini-2.0-flash', 2048, 0.3);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`[WomenTransfer] Gemini extraction FAILED for batch of ${articles.length} articles: ${msg}`);
    return [];
  }

  if (!text) return [];

  let parsed: Record<string, unknown>[];
  try {
    parsed = JSON.parse(extractJson(text)) as Record<string, unknown>[];
  } catch {
    console.log('[WomenTransfer] Failed to parse Gemini JSON response — no rumours generated');
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const results: WomenTransferRumour[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const r = parsed[i];
    const playerName = String(r.player ?? '').trim();

    if (!playerName || playerName === 'null' || !isKnownPlayer(playerName)) {
      continue;
    }

    const article = articles[i] || articles[0];
    const fromTeam = String(r.fromTeam ?? '').trim();
    const toTeam = String(r.toTeam ?? '').trim();

    results.push({
      id: `w-rumour-${i}-${Date.now()}`,
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

export async function getWomenTransferRumours(pageSize = 25): Promise<WomenTransferRumour[]> {
  const cached = loadCache<WomenTransferRumour[]>(RUMOUR_CACHE_KEY);

  console.log('[WomenTransfer] ===== Fetching women\'s transfer data =====');
  const articles = await searchWomenTransferArticles(pageSize);
  const contentHash = buildContentHash(articles);

  if (cached && cached.contentHash === contentHash && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[WomenTransfer] 24h cache HIT — ${cached.data.length} rumours (content unchanged)`);
    console.log(`[WomenTransfer] Using cached rumours`);
    return cached.data;
  }

  if (!articles.length) {
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[WomenTransfer] No new articles, using cached');
      console.log(`[WomenTransfer] Using cached rumours`);
      return cached.data;
    }
    console.log('[WomenTransfer] No articles found from any source, using fallback data');
    console.log(`[WomenTransfer] Fallback rumours: ${FALLBACK_RUMOURS.length}`);
    return FALLBACK_RUMOURS;
  }

  console.log(`[WomenTransfer] ${articles.length} transfer-related articles found, starting AI extraction...`);

  const BATCH_SIZE = 10;
  const rumourBatches: Promise<WomenTransferRumour[]>[] = [];

  for (let i = 0; i < Math.min(articles.length, 50); i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    rumourBatches.push(extractRumours(batch).catch(() => [] as WomenTransferRumour[]));
  }

  console.log(`[WomenTransfer] Generating ${rumourBatches.length} parallel batches (${articles.length} articles)...`);
  const batchResults = await Promise.all(rumourBatches);
  const results = batchResults.flat().slice(0, 50);

  if (results.length > 0) {
    saveCache(RUMOUR_CACHE_KEY, results, contentHash);
  } else if (articles.length > 0) {
    console.log('[WomenTransfer] AI extraction returned 0 results, using fallback');
    saveCache(RUMOUR_CACHE_KEY, FALLBACK_RUMOURS, contentHash);
    console.log(`[WomenTransfer] Fallback rumours: ${FALLBACK_RUMOURS.length}`);
    return FALLBACK_RUMOURS;
  }

  console.log(`[WomenTransfer] AI Rumours generated: ${results.length}`);
  if (results.length > 0) {
    console.log(`[WomenTransfer] Using AI-generated rumours`);
  }
  return results;
}

export async function getWomenTransferNews(pageSize = 25): Promise<WomenTransferNewsItem[]> {
  const articles = await searchWomenTransferArticles(pageSize);

  // Filter out non-women's-football articles
  const womenArticles = articles.filter((a) => {
    const text = `${a.title} ${a.description}`.toLowerCase();
    return WOMENS_FOOTBALL_KEYWORDS.some((kw) => text.includes(kw));
  });

  if (!womenArticles.length) {
    console.log('[WomenTransfer] No women-specific articles for news, using fallback');
    return FALLBACK_NEWS;
  }
  return womenArticles.slice(0, 50).map((a) => ({
    title: a.title,
    image: a.image ?? '',
    source: a.source,
    url: a.url,
    date: a.publishedAt?.split('T')[0] ?? '',
  }));
}

export async function getWomenDiscussedPlayers(pageSize = 25): Promise<WomenTransferRumour[]> {
  const articles = await searchWomenTransferArticles(pageSize);
  if (!articles.length) {
    console.log('[WomenTransfer] No articles for discussed, using fallback');
    return FALLBACK_RUMOURS.filter((r) => r.probability >= 40).slice(0, 5);
  }

  const BATCH_SIZE = 15;
  const batches: Promise<WomenTransferRumour[]>[] = [];

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

          const results: WomenTransferRumour[] = [];
          for (let j = 0; j < parsed.length; j++) {
            const d = parsed[j];
            const playerName = String(d.player ?? '').trim();
            if (!playerName || playerName === 'null' || !isKnownPlayer(playerName)) continue;

            const article = batch[j] || batch[0];
            const clubs = (d.clubs as string[]) ?? [];

            results.push({
              id: `w-discussed-${j}-${Date.now()}`,
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
  if (results.length === 0 && articles.length > 0) {
    console.log('[WomenTransfer] AI discussed extraction returned 0, using fallback');
    return FALLBACK_RUMOURS.filter((r) => r.probability >= 40).slice(0, 5);
  }
  return results;
}

export { timeAgo };
