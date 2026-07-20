import type { Athlete } from '@/types';

const RICHEST_ATHLETES: Athlete[] = [
  { id: 'r1', name: 'Michael Jordan', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg', rank: 1, value: '$3.2B', nationality: 'USA', description: 'NBA legend and businessman. Earned billions through Nike, Hornets ownership, and endorsements.' },
  { id: 'r2', name: 'Tiger Woods', sport: 'Golf', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/President_Donald_Trump_hosts_a_reception_honoring_Black_History_Month_%2854341713089%29_%28cropped%29.jpg', rank: 2, value: '$2.1B', nationality: 'USA', description: '15-time major champion. Built a billion-dollar empire from prize money, endorsements, and course design.' },
  { id: 'r3', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg', rank: 3, value: '$1.2B', nationality: 'Portugal', description: '5x Ballon d\'Or winner. First footballer to reach $1B in career earnings.' },
  { id: 'r4', name: 'Lionel Messi', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg', rank: 4, value: '$1.1B', nationality: 'Argentina', description: '8x Ballon d\'Or winner and World Cup champion. Record contracts with Barcelona, PSG, and Inter Miami.' },
  { id: 'r5', name: 'LeBron James', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg', rank: 5, value: '$1.0B', nationality: 'USA', description: 'NBA all-time scoring leader. Became a billionaire through salary, endorsements, and media ventures.' },
  { id: 'r6', name: 'Roger Federer', sport: 'Tennis', image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg', rank: 6, value: '$900M', nationality: 'Switzerland', description: '20 Grand Slam champion. One of the highest-earning tennis players ever through prize money and endorsements.' },
  { id: 'r7', name: 'Floyd Mayweather', sport: 'Boxing', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Floyd_Mayweather_Jr_2011.jpg', rank: 7, value: '$850M', nationality: 'USA', description: 'Undefeated 50-0 boxing legend. Generated massive PPV revenue from mega-fights like Pacquiao and McGregor.' },
  { id: 'r8', name: 'Virat Kohli', sport: 'Cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg', rank: 8, value: '$750M', nationality: 'India', description: 'Modern cricket great. India\'s most marketable athlete with massive endorsement portfolio.' },
  { id: 'r9', name: 'Neymar Jr', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg', rank: 9, value: '$700M', nationality: 'Brazil', description: 'Brazilian football superstar. Record €222M transfer to PSG and lucrative endorsement deals.' },
  { id: 'r10', name: 'Usain Bolt', sport: 'Athletics', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Usain_Bolt_smiling_Berlin_2009.JPG', rank: 10, value: '$500M', nationality: 'Jamaica', description: 'Fastest man in history. 8x Olympic gold medalist with endorsements from Puma, Gatorade, and more.' },
];

const HIGHEST_PAID: Athlete[] = [
  { id: 'hp1', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg', rank: 1, earnings: '$260M', nationality: 'Portugal', description: 'Al-Nassr and Portugal captain. Combined salary + endorsements make him the highest-paid athlete annually.' },
  { id: 'hp2', name: 'Lionel Messi', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg', rank: 2, earnings: '$220M', nationality: 'Argentina', description: 'Inter Miami star. Massive revenue share deal + Apple TV partnership drives his earnings.' },
  { id: 'hp3', name: 'LeBron James', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg', rank: 3, earnings: '$180M', nationality: 'USA', description: 'Lakers superstar. NBA salary plus lucrative media and production company ventures.' },
  { id: 'hp4', name: 'Stephen Curry', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Stephen_Curry%2C_Olympic_Games_2024_%28cropped%29.jpg', rank: 4, earnings: '$160M', nationality: 'USA', description: 'Warriors legend and 3-point king. Under Armour partnership and production deals boost earnings.' },
  { id: 'hp5', name: 'Neymar Jr', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg', rank: 5, earnings: '$150M', nationality: 'Brazil', description: 'Brazilian forward. Al-Hilal contract and Puma endorsement keep him among top earners.' },
  { id: 'hp6', name: 'Kevin Durant', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Kevin_Durant%2C_Paris_2024_%28cropped%29.jpg', rank: 6, earnings: '$140M', nationality: 'USA', description: 'Suns star and 2x NBA champion. Investment portfolio and media company add to NBA salary.' },
  { id: 'hp7', name: 'Roger Federer', sport: 'Tennis', image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg', rank: 7, earnings: '$130M', nationality: 'Switzerland', description: 'Retired legend. OnCourse clothing line and Uniqlo deal continue generating massive income.' },
  { id: 'hp8', name: 'Virat Kohli', sport: 'Cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg', rank: 8, earnings: '$120M', nationality: 'India', description: 'India\'s batting icon. Multiple brand endorsements and WPL franchise ownership drive earnings.' },
  { id: 'hp9', name: 'Canelo Álvarez', sport: 'Boxing', image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Sa%C3%BAl_%C3%81lvarez.png', rank: 9, earnings: '$110M', nationality: 'Mexico', description: 'Undisputed super middleweight champion. Massive DAZN contract makes him boxing\'s top earner.' },
  { id: 'hp10', name: 'Tom Brady', sport: 'NFL', image: 'https://upload.wikimedia.org/wikipedia/commons/7/73/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Tom_Brady_-_240422_191334_%28cropped%29_%28cropped%29.jpg', rank: 10, earnings: '$100M', nationality: 'USA', description: '7x Super Bowl champion. Broadcasting deal with Fox and TB12 brand sustain post-retirement earnings.' },
];

const MOST_FAMOUS: Athlete[] = [
  { id: 'mf1', name: 'Cristiano Ronaldo', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg', rank: 1, value: '1.2B followers', nationality: 'Portugal', description: 'The most-followed person on Instagram. Global brand with reach across every continent.' },
  { id: 'mf2', name: 'Lionel Messi', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg', rank: 2, value: '800M followers', nationality: 'Argentina', description: 'Second most-followed athlete. World Cup victory in 2022 boosted his global following.' },
  { id: 'mf3', name: 'Virat Kohli', sport: 'Cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg', rank: 3, value: '500M followers', nationality: 'India', description: 'India\'s most-followed athlete across social media. Massive fanbase in cricket-crazy India.' },
  { id: 'mf4', name: 'Neymar Jr', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg', rank: 4, value: '450M followers', nationality: 'Brazil', description: 'Brazil\'s most-followed athlete. Known for flashy style and massive social media presence.' },
  { id: 'mf5', name: 'LeBron James', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg', rank: 5, value: '300M followers', nationality: 'USA', description: 'NBA\'s most-followed player. Media personality, activist, and entertainment mogul.' },
  { id: 'mf6', name: 'Roger Federer', sport: 'Tennis', image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg', rank: 6, value: '250M followers', nationality: 'Switzerland', description: 'Tennis legend with a global following. Elegant style and sportsmanship transcended the sport.' },
  { id: 'mf7', name: 'Ronaldo Nazário', sport: 'Football', image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Ronaldo_Lu%C3%ADs_Naz%C3%A1rio_de_Lima_2019_%283x4_cropped%29.jpg', rank: 7, value: '200M followers', nationality: 'Brazil', description: 'Brazilian icon and 2x World Cup winner. One of football\'s most recognizable legends.' },
  { id: 'mf8', name: 'Stephen Curry', sport: 'Basketball', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Stephen_Curry%2C_Olympic_Games_2024_%28cropped%29.jpg', rank: 8, value: '180M followers', nationality: 'USA', description: 'Revolutionized basketball with 3-point shooting. Global ambassador for the NBA.' },
  { id: 'mf9', name: 'MS Dhoni', sport: 'Cricket', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg', rank: 9, value: '150M followers', nationality: 'India', description: 'India\'s most successful cricket captain. Cult-like following across the Indian subcontinent.' },
  { id: 'mf10', name: 'Usain Bolt', sport: 'Athletics', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Usain_Bolt_smiling_Berlin_2009.JPG', rank: 10, value: '120M followers', nationality: 'Jamaica', description: 'Fastest man alive. Charismatic personality made him track and field\'s biggest global star.' },
];

const dataMap: Record<string, { data: Athlete[]; label: string }> = {
  richest: { data: RICHEST_ATHLETES, label: 'Forbes Billionaires List' },
  paid: { data: HIGHEST_PAID, label: 'Forbes Highest-Paid Athletes' },
  famous: { data: MOST_FAMOUS, label: 'Social Media Following' },
};

export function getAthleteRankings(category: string): Athlete[] {
  return dataMap[category]?.data ?? [];
}

export function getRankingSource(category: string): string {
  return dataMap[category]?.label ?? '';
}
