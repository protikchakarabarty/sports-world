import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HallOfFameEntry } from '@/types';

const hallOfFame: HallOfFameEntry[] = [
  {
    id: 'hof1', name: 'Pelé', sport: 'Football', nationality: 'Brazil',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg',
    era: '1956-1977',
    achievements: ['3x World Cup Winner (1958, 1962, 1970)', '12x Brazilian League Winner', '1279 Goals in 1363 Games'],
    records: ['Most goals in a calendar year (127)', 'Youngest World Cup winner (17)', 'All-time top scorer for Brazil (77 goals)'],
    bio: 'Widely regarded as the greatest footballer of all time, Pelé was named Athlete of the Century by the IOC and co-winner of the FIFA Player of the Century award.'
  },
  {
    id: 'hof2', name: 'Michael Jordan', sport: 'Basketball', nationality: 'USA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg',
    era: '1984-2003',
    achievements: ['6x NBA Champion', '5x NBA MVP', '6x NBA Finals MVP'],
    records: ['Highest career PPG in NBA (30.12)', '10x Scoring Champion', '9x NBA All-Defensive First Team'],
    bio: 'Michael Jordan is widely considered the greatest basketball player of all time. He led the Chicago Bulls to six NBA championships and became a global cultural icon.'
  },
  {
    id: 'hof3', name: 'Don Bradman', sport: 'Cricket', nationality: 'Australia',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Don_Bradman_1930.jpg',
    era: '1928-1948',
    achievements: ['99.94 Test Batting Average', '29 Test Centuries in 52 Matches', 'Ashes Legend'],
    records: ['Highest Test batting average (99.94)', 'Most runs in a Test series (974 in 1930)', 'Fastest to 6,000 Test runs'],
    bio: 'Sir Donald Bradman is universally acknowledged as the greatest batsman in cricket history. His career average of 99.94 is considered the greatest statistical achievement in any major sport.'
  },
  {
    id: 'hof4', name: 'Serena Williams', sport: 'Tennis', nationality: 'USA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg',
    era: '1995-2022',
    achievements: ['23 Grand Slam Singles Titles', '14 Grand Slam Doubles Titles', '4x Olympic Gold Medalist'],
    records: ['Most Grand Slam singles titles in Open Era (23)', 'Most titles at 3 different Slams (7 each)', '319 weeks as World No. 1'],
    bio: 'Serena Williams revolutionized women\'s tennis with her power and athleticism. She holds the most Grand Slam titles of any player in the Open Era and is a global advocate for equality.'
  },
  {
    id: 'hof5', name: 'Muhammad Ali', sport: 'Boxing', nationality: 'USA',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Muhammad_Ali_NYWTS.jpg',
    era: '1960-1981',
    achievements: ['3x World Heavyweight Champion', 'Olympic Gold Medalist (1960)', 'Sportsman of the Century'],
    records: ['Only 3x lineal heavyweight champion in history', 'First fighter to win heavyweight title 3 times', 'Most famous sports figure of the 20th century'],
    bio: 'Muhammad Ali was more than a boxer — he was a cultural icon, civil rights activist, and one of the most famous people in history. "Float like a butterfly, sting like a bee."'
  },
  {
    id: 'hof6', name: 'Usain Bolt', sport: 'Athletics', nationality: 'Jamaica',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Usain_Bolt_smiling_Berlin_2009.JPG',
    era: '2004-2017',
    achievements: ['8x Olympic Gold Medalist', '11x World Champion', 'World Records in 100m & 200m'],
    records: ['World Record 100m (9.58s)', 'World Record 200m (19.19s)', 'Only sprinter to win Olympic 100m & 200m triple-triple'],
    bio: 'Usain Bolt is the fastest human ever timed. His charismatic personality and record-breaking performances made him the most beloved track and field athlete in history.'
  },
  {
    id: 'hof7', name: 'Lionel Messi', sport: 'Football', nationality: 'Argentina',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg',
    era: '2004-Present',
    achievements: ['8x Ballon d\'Or Winner', 'FIFA World Cup Winner (2022)', '4x UEFA Champions League Winner'],
    records: ['Most Ballon d\'Or awards (8)', 'Most goals in a calendar year (91 in 2012)', 'All-time top scorer for Barcelona (672 goals)'],
    bio: 'Lionel Messi is widely regarded as one of the greatest footballers of all time. His dribbling, vision, and goal-scoring have earned him a record eight Ballon d\'Or awards.'
  },
  {
    id: 'hof8', name: 'Cristiano Ronaldo', sport: 'Football', nationality: 'Portugal',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
    era: '2002-Present',
    achievements: ['5x Ballon d\'Or Winner', 'UEFA European Champion (2016)', '5x UEFA Champions League Winner'],
    records: ['Most international goals in history (130+)', 'Most goals in UEFA Champions League (140+)', 'First to score in 5 World Cups'],
    bio: 'Cristiano Ronaldo is one of the greatest footballers in history. Known for his incredible athleticism, goal-scoring prowess, and relentless work ethic, he has set records across multiple leagues.'
  },
  {
    id: 'hof9', name: 'Sachin Tendulkar', sport: 'Cricket', nationality: 'India',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/The_cricket_legend_Sachin_Tendulkar_at_the_Oval_Maidan_in_Mumbai_During_the_Duke_and_Duchess_of_Cambridge_Visit%2826271019082%29.jpg',
    era: '1989-2013',
    achievements: ['100 International Centuries', 'World Cup Winner (2011)', 'Most runs in international cricket'],
    records: ['Most international runs (34,357)', 'Most international centuries (100)', 'First to score a double century in ODI cricket'],
    bio: 'Sachin Tendulkar is the most celebrated cricketer in history. With 100 international centuries and over 34,000 runs, his records may never be broken.'
  },
  {
    id: 'hof10', name: 'Roger Federer', sport: 'Tennis', nationality: 'Switzerland',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg',
    era: '1998-2022',
    achievements: ['20 Grand Slam Singles Titles', '310 Weeks as World No. 1', 'Olympic Gold Medalist'],
    records: ['Most consecutive weeks at No. 1 (237)', 'Oldest world No. 1 in history (36)', 'Only player to win 8 Wimbledon titles'],
    bio: 'Roger Federer is widely considered the greatest tennis player of all time. His elegant style, 20 Grand Slam titles, and sportsmanship made him a global ambassador for the sport.'
  },
  {
    id: 'hof11', name: 'Diego Maradona', sport: 'Football', nationality: 'Argentina',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/DiegoMaradona.jpg',
    era: '1976-1997',
    achievements: ['FIFA World Cup Winner (1986)', 'FIFA Player of the Century (co-winner)', 'Serie A Champion with Napoli'],
    records: ['Most famous goal in history (Hand of God)', 'Goal of the Century (vs England, 1986)', 'Only player to break Serie A dominance with Napoli'],
    bio: 'Diego Maradona was one of the most gifted and controversial footballers of all time. His 1986 World Cup triumph, capped by two legendary goals against England, cemented his immortal status.'
  },
  {
    id: 'hof12', name: 'Steffi Graf', sport: 'Tennis', nationality: 'Germany',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg',
    era: '1982-1999',
    achievements: ['22 Grand Slam Singles Titles', 'Golden Slam (1988)', '377 Weeks as World No. 1'],
    records: ['Only player to win Golden Slam (all 4 majors + Olympic gold)', 'Most weeks at No. 1 (377)', 'Only player to win each major at least 4 times'],
    bio: 'Steffi Graf dominated women\'s tennis in the late 80s and 90s. Her 1988 Golden Slam — winning all four majors and Olympic gold in the same year — remains an unmatched achievement.'
  },
];

export function HallOfFame() {
  const { t } = useLanguage();

  return (
    <Section title={t('Hall of Fame', 'হল অফ ফেম')} subtitle={t('Legendary athletes who shaped sports history', 'ক্রীড়া ইতিহাস গঠনকারী কিংবদন্তি অ্যাথলেট')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hallOfFame.map((legend, i) => (
          <motion.div
            key={legend.id || `legend-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative h-40 overflow-hidden">
              <img src={legend.image} alt={legend.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-lg font-bold text-white">{legend.name}</h3>
                <p className="text-xs text-white/70">{legend.nationality} • {legend.sport} • {legend.era}</p>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{legend.bio}</p>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">{t('Achievements', 'অর্জন')}</p>
                {legend.achievements.map((a, j) => (
                  <p key={j} className="text-xs text-gray-600 dark:text-gray-400">• {a}</p>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">{t('Records', 'রেকর্ড')}</p>
                {legend.records.map((r, j) => (
                  <p key={j} className="text-xs text-gray-600 dark:text-gray-400">• {r}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
