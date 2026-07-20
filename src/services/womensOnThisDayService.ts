import type { OnThisDayEntry, OnThisDayResponse } from '@/types';
import { getStaticWomenOnThisDay } from './womenOnThisDayStaticData';

const DEMONYM_MAP: Record<string, string> = {
  english: 'England', scottish: 'Scotland', welsh: 'Wales', irish: 'Ireland',
  'northern irish': 'Northern Ireland',
  brazilian: 'Brazil', argentine: 'Argentina', argentinian: 'Argentina',
  french: 'France', german: 'Germany', spanish: 'Spain', italian: 'Italy',
  dutch: 'Netherlands', portuguese: 'Portugal', belgian: 'Belgium',
  swedish: 'Sweden', danish: 'Denmark', norwegian: 'Norway', finnish: 'Finland',
  polish: 'Poland', ukrainian: 'Ukraine', russian: 'Russia',
  croatian: 'Croatia', serbian: 'Serbia', turkish: 'Turkey',
  swiss: 'Switzerland', austrian: 'Austria',
  australian: 'Australia', japanese: 'Japan', korean: 'South Korea',
  chinese: 'China', nigerian: 'Nigeria', ghanaian: 'Ghana',
  cameroonian: 'Cameroon', senegalese: 'Senegal', egyptian: 'Egypt',
  moroccan: 'Morocco', tunisian: 'Tunisia', algerian: 'Algerian',
  'south african': 'South Africa',
  american: 'United States', canadian: 'Canada', mexican: 'Mexico',
  colombian: 'Colombia', uruguayan: 'Uruguay', chilean: 'Chile',
  peruvian: 'Peru', ecuadorian: 'Ecuador', paraguayan: 'Paraguay',
  jamaican: 'Jamaica', haitian: 'Haiti', cuban: 'Cuba',
  bolivian: 'Bolivia', venezuelan: 'Venezuela',
  'ivorian': 'Ivory Coast', 'ivoirian': 'Ivory Coast',
  congolese: 'DR Congo', angolan: 'Angola', zambian: 'Zambia',
  zimbabwean: 'Zimbabwe', kenyan: 'Kenya',
  saud: 'Saudi Arabia', 'saudi arabian': 'Saudi Arabia',
  iranian: 'Iran', iraqi: 'Iraq', israeli: 'Israel',
  indian: 'India', pakistani: 'Pakistan', bangladeshi: 'Bangladesh',
  sri: 'Sri Lanka', malaysian: 'Malaysia', indonesian: 'Indonesia',
  thai: 'Thailand', vietnamese: 'Vietnam',
  hungarian: 'Hungary', czech: 'Czech Republic', slovak: 'Slovakia',
  romanian: 'Romania', bulgarian: 'Bulgaria', greek: 'Greece',
  georgian: 'Georgia', bosnian: 'Bosnia', slovenian: 'Slovenia',
  macedonian: 'North Macedonia', montenegrin: 'Montenegro',
  albanian: 'Albanian', moldovan: 'Moldova',
  costa: 'Costa Rica', panamanian: 'Panama',
  'new zealander': 'New Zealand', 'kiwi': 'New Zealand',
  liberian: 'Liberia', sierra: 'Sierra Leone',
  togolese: 'Togo', beninese: 'Benin', burkinabe: 'Burkina Faso',
  mali: 'Mali', gambian: 'Gambia', guinean: 'Guinea',
  cape: 'Cape Verde', mauritanian: 'Mauritania',
  sudanese: 'Sudan', 'south sudanese': 'South Sudan',
  ethiopian: 'Ethiopia', somali: 'Somalia', ugandan: 'Uganda',
  tanzanian: 'Tanzania', mozambican: 'Mozambique',
  namibian: 'Namibia', botswanan: 'Botswana',
  qatari: 'Qatar', emirati: 'UAE', omani: 'Oman', bahraini: 'Bahrain',
  kuwaiti: 'Kuwait', jordanian: 'Jordan', lebanese: 'Lebanon',
  syrian: 'Syria', yemeni: 'Yemen',
  afghan: 'Afghanistan', uzbek: 'Uzbekistan',
  kazakh: 'Kazakhstan', turkmen: 'Turkmenistan',
  icelandic: 'Iceland', maltese: 'Malta', cypriot: 'Cyprus',
  luxembourgish: 'Luxembourg', monacan: 'Monaco',
  liechtenstein: 'Liechtenstein', san: 'San Marino',
  andorran: 'Andorra',
  'trinidad': 'Trinidad and Tobago', 'tobagonian': 'Trinidad and Tobago',
  barbadian: 'Barbados', guyanese: 'Guyana', surinamese: 'Suriname',
  fijian: 'Fiji', 'solomon': 'Solomon Islands',
  tahitian: 'Tahiti', 'new caledonian': 'New Caledonia',
  puerto: 'Puerto Rico',
};

const KNOWN_WOMEN_FOOTBALLERS: string[] = [
  'Marta', 'Mia Hamm', 'Abby Wambach', 'Alex Morgan', 'Megan Rapinoe',
  'Carli Lloyd', 'Hope Solo', 'Christine Sinclair', 'Birgit Prinz',
  'Kelly Smith', 'Homare Sawa', 'Sun Wen', 'Hege Riise', 'Nadine Angerer',
  'Dzsenifer Marozsán', 'Ada Hegerberg', 'Pernille Harder', 'Sam Kerr',
  'Vivianne Miedema', 'Lieke Martens', 'Lucy Bronze', 'Wendie Renard',
  'Amandine Henry', 'Eugénie Le Sommer', 'Marie-Antoinette Katoto',
  'Kadidiatou Diani', 'Alexandra Popp', 'Lina Magull', 'Sara Däbritz',
  'Beth Mead', 'Ellen White', 'Fran Kirby', 'Nikita Parris',
  'Caroline Graham Hansen', 'Fridolina Rolfö', 'Kosovare Asllani',
  'Stina Blackstenius', 'Asisat Oshoala', 'Tabitha Chawinga',
  'Thembi Kgatlana', 'Shanice van de Sanden', 'Sherida Spitse',
  'Jackie Groenen', 'Tobin Heath', 'Rose Lavelle', 'Julie Ertz',
  'Becky Sauerbrunn', 'Cristiane', 'Formiga', 'Sissi', 'Pretinha',
  'Louisa Necib', 'Ramona Bachmann', 'Ana-Maria Crnogorčević',
  'Lisa Dahlkvist', 'Sofia Jakobsson', 'Lotta Ökvist',
];

interface WikipediaPage {
  title: string;
  displaytitle: string;
  thumbnail?: { source: string };
  description?: string;
  extract?: string;
}

interface WikipediaOnThisDayItem {
  text: string;
  year?: number;
  pages: WikipediaPage[];
}

interface WikipediaOnThisDayResponse {
  births?: WikipediaOnThisDayItem[];
  deaths?: WikipediaOnThisDayItem[];
}

function parseCountry(description: string): string {
  if (!description) return '';
  const lower = description.toLowerCase();
  for (const [demonym, country] of Object.entries(DEMONYM_MAP)) {
    if (lower.startsWith(demonym)) return country;
  }
  return '';
}

function parseNameFromText(text: string): string {
  return text.replace(/^\d{4}\s*[–-]\s*/, '').split(',')[0].trim();
}

function isWomenFootballer(item: WikipediaOnThisDayItem): boolean {
  const page = item.pages?.[0];
  if (!page) return false;

  const desc = page.description?.toLowerCase() ?? '';
  const title = page.title ?? '';
  const extract = page.extract?.toLowerCase() ?? '';

  const isFootball = (
    desc.includes('association football') ||
    desc.includes('footballer') ||
    desc.includes('soccer player') ||
    extract.includes('association football') ||
    extract.includes('footballer') ||
    extract.includes('soccer player')
  );
  if (!isFootball) return false;

  const womenIndicators = ['women', 'female', 'woman', "ladies'", "women's"];
  const hasWomenIndicator = womenIndicators.some(
    w => desc.includes(w) || extract.includes(w) || item.text.toLowerCase().includes(w)
  );
  if (hasWomenIndicator) return true;

  const isKnown = KNOWN_WOMEN_FOOTBALLERS.some(
    name => title.includes(name) || item.text.includes(name)
  );
  if (isKnown) return true;

  return false;
}

function mapItem(item: WikipediaOnThisDayItem, type: 'born' | 'died'): OnThisDayEntry | null {
  const page = item.pages?.[0];
  if (!page) return null;
  if (!isWomenFootballer(item)) return null;

  return {
    id: `women-onthisday-${type}-${page.title.replace(/\s+/g, '-')}`,
    name: parseNameFromText(item.text),
    year: typeof item.year === 'number' ? String(item.year) : '',
    description: page.extract?.split('\n')[0] ?? page.description ?? '',
    image: page.thumbnail?.source,
    country: parseCountry(page.description ?? ''),
    sport: 'football',
    type,
  };
}

async function fetchWikipediaOnThisDay(month: number, day: number): Promise<OnThisDayEntry[]> {
  try {
    const [birthsRes, deathsRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`, { signal: AbortSignal.timeout(8000) }),
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`, { signal: AbortSignal.timeout(8000) }),
    ]);

    if (!birthsRes.ok || !deathsRes.ok) return [];

    const birthsData = await birthsRes.json() as WikipediaOnThisDayResponse;
    const deathsData = await deathsRes.json() as WikipediaOnThisDayResponse;

    const births: OnThisDayEntry[] = (birthsData.births ?? [])
      .map(item => mapItem(item, 'born'))
      .filter((e): e is OnThisDayEntry => e !== null);

    const deaths: OnThisDayEntry[] = (deathsData.deaths ?? [])
      .map(item => mapItem(item, 'died'))
      .filter((e): e is OnThisDayEntry => e !== null);

    return [...births, ...deaths];
  } catch {
    return [];
  }
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDateRange(month: number, startDay: number, endDay: number): string {
  const monthName = new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });
  return `${monthName} ${startDay}\u2013${endDay}`;
}

function buildNearbyDates(month: number, day: number, range: number): { m: number; d: number }[] {
  const now = new Date();
  const year = now.getFullYear();
  const dates: { m: number; d: number }[] = [];
  for (let offset = -range; offset <= range; offset++) {
    if (offset === 0) continue;
    const d = new Date(year, month - 1, day + offset);
    dates.push({ m: d.getMonth() + 1, d: d.getDate() });
  }
  return dates;
}

const CACHE_KEY = 'sw_women_onthisday_football';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface WomenOnThisDayCache {
  entries: OnThisDayEntry[];
  month: number;
  day: number;
  timestamp: number;
}

function loadCache(month: number, day: number): OnThisDayEntry[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WomenOnThisDayCache;
    if (parsed.month !== month || parsed.day !== day) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.entries;
  } catch {
    return null;
  }
}

function saveCache(month: number, day: number, entries: OnThisDayEntry[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      entries,
      month,
      day,
      timestamp: Date.now(),
    }));
  } catch { /* ignore */ }
}

export async function getWomenOnThisDayFootballData(month: number, day: number): Promise<OnThisDayResponse> {
  // Priority 1: Exact date from Wikipedia
  const cached = loadCache(month, day);
  if (cached && cached.length > 0) {
    return { entries: cached, matchType: 'exact' };
  }

  const exact = await fetchWikipediaOnThisDay(month, day);
  if (exact.length > 0) {
    saveCache(month, day, exact);
    return { entries: exact, matchType: 'exact' };
  }

  // Priority 2: Nearby dates ±3 days
  const nearbyDates = buildNearbyDates(month, day, 3);
  const seen = new Set<string>();
  const nearbyEntries: OnThisDayEntry[] = [];

  for (const { m, d } of nearbyDates) {
    const entries = await fetchWikipediaOnThisDay(m, d);
    for (const e of entries) {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        nearbyEntries.push(e);
      }
    }
  }

  if (nearbyEntries.length > 0) {
    const startDay = day - 3;
    const endDay = day + 3;
    const dateRangeLabel = formatDateRange(month, Math.max(1, startDay), Math.min(endDay, 31));
    return { entries: nearbyEntries, matchType: 'nearby', dateRangeLabel };
  }

  // Priority 3: Static dataset
  const staticEntries = getStaticWomenOnThisDay(month, day);
  if (staticEntries.length > 0) {
    return { entries: staticEntries, matchType: 'static' };
  }

  return { entries: [], matchType: 'exact' };
}
