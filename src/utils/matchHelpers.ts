export const FLAG_EMOJIS: Record<string, string> = {
  Argentina: '🇦🇷', Brazil: '🇧🇷', Spain: '🇪🇸', Belgium: '🇧🇪',
  France: '🇫🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Germany: '🇩🇪', Portugal: '🇵🇹',
  Netherlands: '🇳🇱', Italy: '🇮🇹', Morocco: '🇲🇦', Japan: '🇯🇵',
  Croatia: '🇭🇷', Mexico: '🇲🇽', 'USA': '🇺🇸', Uruguay: '🇺🇾',
  Colombia: '🇨🇴', Chile: '🇨🇱', Nigeria: '🇳🇬', Cameroon: '🇨🇲',
  Ghana: '🇬🇭', Senegal: '🇸🇳', Tunisia: '🇹🇳', Algeria: '🇩🇿',
  Egypt: '🇪🇬', 'South Korea': '🇰🇷', 'Saudi Arabia': '🇸🇦',
  Iran: '🇮🇷', Australia: '🇦🇺', Switzerland: '🇨🇭', Denmark: '🇩🇰',
  Sweden: '🇸🇪', Norway: '🇳🇴', Poland: '🇵🇱', 'Czech Republic': '🇨🇿',
  Austria: '🇦🇹', Hungary: '🇭🇺', Serbia: '🇷🇸', Russia: '🇷🇺',
  Ukraine: '🇺🇦', Turkey: '🇹🇷', Greece: '🇬🇷', Romania: '🇷🇴',
  Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', Ireland: '🇮🇪',
  Iceland: '🇮🇸', Canada: '🇨🇦', 'Costa Rica': '🇨🇷', Jamaica: '🇯🇲',
  Ecuador: '🇪🇨', Peru: '🇵🇪', Paraguay: '🇵🇾', Bolivia: '🇧🇴',
  Venezuela: '🇻🇪', Panama: '🇵🇦', 'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦', 'Ivory Coast': '🇨🇮', Mali: '🇲🇱',
  'Burkina Faso': '🇧🇫', Togo: '🇹🇬', Benin: '🇧🇯', Angola: '🇦🇴',
  Congo: '🇨🇬', 'DR Congo': '🇨🇩', Ethiopia: '🇪🇹', Kenya: '🇰🇪',
  Tanzania: '🇹🇿', Uganda: '🇺🇬', Zambia: '🇿🇲', Zimbabwe: '🇿🇼',
  'Bosnia and Herzegovina': '🇧🇦', Bulgaria: '🇧🇬', Slovakia: '🇸🇰',
  Slovenia: '🇸🇮', Israel: '🇮🇱', Finland: '🇫🇮', Albania: '🇦🇱',
  Montenegro: '🇲🇪', 'North Macedonia': '🇲🇰', Luxembourg: '🇱🇺',
  Armenia: '🇦🇲', Georgia: '🇬🇪', Kazakhstan: '🇰🇿', Cyprus: '🇨🇾',
  Qatar: '🇶🇦', 'United Arab Emirates': '🇦🇪', Iraq: '🇮🇶',
  Syria: '🇸🇾', Jordan: '🇯🇴', Oman: '🇴🇲', Bahrain: '🇧🇭',
  Kuwait: '🇰🇼', Lebanon: '🇱🇧', Palestine: '🇵🇸', Yemen: '🇾🇪',
  China: '🇨🇳', India: '🇮🇳', Thailand: '🇹🇭', Vietnam: '🇻🇳',
  Indonesia: '🇮🇩', Malaysia: '🇲🇾', Philippines: '🇵🇭',
  Singapore: '🇸🇬', 'Hong Kong': '🇭🇰', 'Chinese Taipei': '🇹🇼',
  Uzbekistan: '🇺🇿', Kyrgyzstan: '🇰🇬', Tajikistan: '🇹🇯',
  Turkmenistan: '🇹🇲', 'Sri Lanka': '🇱🇰', Nepal: '🇳🇵',
  Maldives: '🇲🇻', Bangladesh: '🇧🇩',
};

export function getFlagEmoji(team: string): string {
  const match = FLAG_EMOJIS[team] || FLAG_EMOJIS[Object.keys(FLAG_EMOJIS).find(
    (k) => k.toLowerCase() === team.toLowerCase()
  ) ?? ''];
  return match || '';
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00Z');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function formatStage(stage: string): string {
  if (!stage) return '';
  const smallWords = new Set(['of', 'the', 'and', 'for', 'by', 'in', 'to']);
  return stage
    .replace(/_/g, ' ')
    .split(' ')
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && smallWords.has(lower) && !/\d/.test(word)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}
