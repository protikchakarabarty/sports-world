import type { MedalEntry } from '@/types';

const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'Australia': '🇦🇺',
  'France': '🇫🇷',
  'Netherlands': '🇳🇱',
  'Great Britain': '🇬🇧',
  'South Korea': '🇰🇷',
  'Italy': '🇮🇹',
  'Germany': '🇩🇪',
  'New Zealand': '🇳🇿',
  'Canada': '🇨🇦',
  'Uzbekistan': '🇺🇿',
  'Hungary': '🇭🇺',
  'Spain': '🇪🇸',
  'Sweden': '🇸🇪',
  'Kenya': '🇰🇪',
  'Norway': '🇳🇴',
  'Ireland': '🇮🇪',
  'Brazil': '🇧🇷',
  'Iran': '🇮🇷',
  'Ukraine': '🇺🇦',
  'Romania': '🇷🇴',
  'Georgia': '🇬🇪',
  'Belgium': '🇧🇪',
  'Bulgaria': '🇧🇬',
  'Serbia': '🇷🇸',
  'Czech Republic': '🇨🇿',
  'Denmark': '🇩🇰',
  'Azerbaijan': '🇦🇿',
  'Cuba': '🇨🇺',
  'Bahrain': '🇧🇭',
  'Slovenia': '🇸🇮',
  'Chinese Taipei': '🇹🇼',
  'Austria': '🇦🇹',
  'Hong Kong': '🇭🇰',
  'Algeria': '🇩🇿',
  'Israel': '🇮🇱',
  'Poland': '🇵🇱',
  'Kazakhstan': '🇰🇿',
  'Jamaica': '🇯🇲',
  'Ethiopia': '🇪🇹',
  'Switzerland': '🇨🇭',
  'Ecuador': '🇪🇨',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Argentina': '🇦🇷',
  'Botswana': '🇧🇼',
  'Dominican Republic': '🇩🇴',
  'Guatemala': '🇬🇹',
  'Dominica': '🇩🇲',
  'Turkey': '🇹🇷',
  'Mexico': '🇲🇽',
  'Armenia': '🇦🇲',
  'Kyrgyzstan': '🇰🇬',
  'Lithuania': '🇱🇹',
  'India': '🇮🇳',
  'Moldova': '🇲🇩',
  'Kosovo': '🇽🇰',
  'Cyprus': '🇨🇾',
  'Tajikistan': '🇹🇯',
  'Albania': '🇦🇱',
  'Cape Verde': '🇨🇻',
  'Thailand': '🇹🇭',
  'Philippines': '🇵🇭',
  'South Africa': '🇿🇦',
  'Croatia': '🇭🇷',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Nigeria': '🇳🇬',
  'Egypt': '🇪🇬',
  'Tunisia': '🇹🇳',
  'Morocco': '🇲🇦',
  'Colombia': '🇨🇴',
  'Venezuela': '🇻🇪',
  'Slovakia': '🇸🇰',
  'Finland': '🇫🇮',
  'Latvia': '🇱🇻',
  'Estonia': '🇪🇪',
  'Iceland': '🇮🇸',
  'Luxembourg': '🇱🇺',
  'Montenegro': '🇲🇪',
  'North Macedonia': '🇲🇰',
  'Bosnia and Herzegovina': '🇧🇦',
  'Malta': '🇲🇹',
  'Singapore': '🇸🇬',
  'Vietnam': '🇻🇳',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Sri Lanka': '🇱🇰',
  'Nepal': '🇳🇵',
  'Myanmar': '🇲🇲',
  'Cambodia': '🇰🇭',
  'Laos': '🇱🇦',
  'Mongolia': '🇲🇳',
  'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦',
  'Oman': '🇴🇲',
  'Yemen': '🇾🇪',
  'Kuwait': '🇰🇼',
  'Lebanon': '🇱🇧',
  'Jordan': '🇯🇴',
  'Syria': '🇸🇾',
  'Iraq': '🇮🇶',
  'Russia': '🇷🇺',
};

function getFlag(country: string): string {
  const normalized = country.trim();
  return COUNTRY_FLAGS[normalized] || '🏳️';
}

export async function fetchOlympicMedalTable(count = 20): Promise<MedalEntry[]> {
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=2024_Summer_Olympics_medal_table&prop=text&format=json&origin=*';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const html: string = data?.parse?.text?.['*'];
    if (!html) throw new Error('No HTML in response');

    const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*sortable[^"]*"[^>]*>.*?<\/table>/s);
    if (!tableMatch) throw new Error('Could not find medal table');

    const entries: MedalEntry[] = [];
    const rowRegex = /<tr[^>]*>.*?<\/tr>/gs;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(tableMatch[0])) !== null) {
      const rowHtml = rowMatch[0];
      const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
      const cells: string[] = [];
      let cellMatch;

      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(cellMatch[1]);
      }

      if (cells.length < 6) continue;

      const countryLink = cells[1].match(/<a[^>]*>([^<]+)<\/a>/);
      if (!countryLink) continue;
      const country = countryLink[1].trim();
      const gold = parseInt(cells[2].replace(/<[^>]+>/g, '').trim(), 10);
      const silver = parseInt(cells[3].replace(/<[^>]+>/g, '').trim(), 10);
      const bronze = parseInt(cells[4].replace(/<[^>]+>/g, '').trim(), 10);
      const total = parseInt(cells[5].replace(/<[^>]+>/g, '').trim(), 10);

      if (isNaN(gold)) continue;

      entries.push({ country, flag: getFlag(country), gold, silver, bronze, total });
    }

    if (entries.length === 0) throw new Error('No entries parsed');
    return entries.slice(0, count);
  } catch (error) {
    console.error('Failed to fetch Olympic medal table:', error);
    throw error;
  }
}
