export interface FootballOnThisDayPlayer {
  id: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  country: string;
  image: string;
  type: 'born' | 'died';
  description: string;
}

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

function isFootballer(item: WikipediaOnThisDayItem): boolean {
  const desc = item.pages?.[0]?.description?.toLowerCase() ?? '';
  return (
    desc.includes('association football') ||
    desc.includes('footballer') ||
    desc.includes('soccer player')
  );
}

function mapBirthItem(item: WikipediaOnThisDayItem): FootballOnThisDayPlayer | null {
  const page = item.pages?.[0];
  if (!page) return null;
  if (!isFootballer(item)) return null;

  const birthYear = typeof item.year === 'number' ? item.year : null;

  // Try to get death year from extract (some deceased players appear in birthdays)
  let deathYear: number | null = null;
  const extractDeath = page.extract?.match(/\((\d{4})\s*[–-]\s*(\d{4})\)/);
  if (extractDeath) {
    deathYear = parseInt(extractDeath[2], 10);
  }

  return {
    id: `onthisday-birth-${page.title.replace(/\s+/g, '-')}`,
    name: parseNameFromText(item.text),
    birthYear,
    deathYear,
    country: parseCountry(page.description ?? ''),
    image: page.thumbnail?.source ?? '',
    type: 'born',
    description: page.extract?.split('\n')[0] ?? page.description ?? '',
  };
}

function mapDeathItem(item: WikipediaOnThisDayItem): FootballOnThisDayPlayer | null {
  const page = item.pages?.[0];
  if (!page) return null;
  if (!isFootballer(item)) return null;

  // Parse years from description: "Canadian physician (1849–1919)" → birth=1849, death=1919
  let birthYear: number | null = null;
  let deathYear: number | null = null;

  if (page.description) {
    const rangeMatch = page.description.match(/\((\d{4})\s*[–-]\s*(\d{4})\)/);
    if (rangeMatch) {
      birthYear = parseInt(rangeMatch[1], 10);
      deathYear = parseInt(rangeMatch[2], 10);
    }
  }

  // Fallback: parse from text like "... (died 1919)" or "... (born 1930)"
  if (!deathYear) {
    const diedMatch = item.text.match(/died\s+(\d{4})/);
    if (diedMatch) deathYear = parseInt(diedMatch[1], 10);
  }
  if (!birthYear && !deathYear && typeof item.year === 'number') {
    deathYear = item.year;
  }

  return {
    id: `onthisday-death-${page.title.replace(/\s+/g, '-')}`,
    name: parseNameFromText(item.text),
    birthYear,
    deathYear,
    country: parseCountry(page.description ?? ''),
    image: page.thumbnail?.source ?? '',
    type: 'died',
    description: page.extract?.split('\n')[0] ?? page.description ?? '',
  };
}

const CACHE_KEY = 'sw_onthisday_football_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface OnThisDayCache {
  births: FootballOnThisDayPlayer[];
  deaths: FootballOnThisDayPlayer[];
  date: string;
  timestamp: number;
}

function loadCache(): OnThisDayCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnThisDayCache;
    if (parsed.date !== getTodayDateStr()) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(births: FootballOnThisDayPlayer[], deaths: FootballOnThisDayPlayer[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      births,
      deaths,
      date: getTodayDateStr(),
      timestamp: Date.now(),
    }));
  } catch { /* ignore */ }
}

function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMonthDay(): [number, number] {
  const d = new Date();
  return [d.getMonth() + 1, d.getDate()];
}

export async function getOnThisDayFootballData(): Promise<{
  births: FootballOnThisDayPlayer[];
  deaths: FootballOnThisDayPlayer[];
}> {
  const cached = loadCache();
  if (cached) return { births: cached.births, deaths: cached.deaths };

  const [month, day] = getMonthDay();

  try {
    const [birthsRes, deathsRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`, { signal: AbortSignal.timeout(8000) }),
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`, { signal: AbortSignal.timeout(8000) }),
    ]);

    if (!birthsRes.ok || !deathsRes.ok) throw new Error('Wikipedia API failed');

    const birthsData = await birthsRes.json() as WikipediaOnThisDayResponse;
    const deathsData = await deathsRes.json() as WikipediaOnThisDayResponse;

    const births = (birthsData.births ?? [])
      .map(mapBirthItem)
      .filter((b): b is FootballOnThisDayPlayer => b !== null)
      .slice(0, 30);

    const deaths = (deathsData.deaths ?? [])
      .map(mapDeathItem)
      .filter((d): d is FootballOnThisDayPlayer => d !== null)
      .slice(0, 30);

    const result = { births, deaths };
    saveCache(result.births, result.deaths);
    return result;
  } catch {
    return { births: [], deaths: [] };
  }
}
