import { useMemo } from 'react';
import { useCricketNews } from '@/hooks/useCricketData';
import type { Gender } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';

const FOOTBALL_EXCLUDE = [
  'football', 'soccer', 'epl', 'premier league', 'la liga', 'serie a', 'bundesliga',
  'ligue 1', 'champions league', 'uefa', 'fifa',
  'manchester', 'liverpool', 'arsenal', 'chelsea', 'tottenham', 'everton',
  'aston villa', 'newcastle', 'wolverhampton', 'west ham',
  'real madrid', 'barcelona', 'atletico madrid', 'bayern munich',
  'juventus', 'ac milan', 'inter milan', 'roma', 'napoli',
  'paris saint-germain', 'psg', 'borussia dortmund',
  'cristiano ronaldo', 'lionel messi', 'neymar', 'mbappé', 'mbappe',
  'erling haaland', 'kevin de bruyne', 'mohamed salah', 'harry kane',
  'vinícius', 'vinicius', 'jude bellingham',
];

const OTHER_SPORTS_EXCLUDE = [
  'tennis', 'grand slam', 'wimbledon', 'us open', 'australian open', 'french open',
  'nadal', 'djokovic', 'federer', 'swiatek', 'serena williams',
  'basketball', 'nba', 'ncaa', 'lebron', 'curry', 'giannis',
  'hockey', 'nhl', 'field hockey', 'ice hockey',
  'formula 1', 'f1', 'grand prix', 'verstappen', 'hamilton', 'leclerc',
  'rugby', 'six nations', 'super rugby', 'world rugby',
  'golf', 'pga', 'masters', 'the open', 'ryder cup',
  'boxing', 'ufc', 'mma', 'heavyweight',
  'olympics', 'olympic', 'olympic games', 'paralympics',
  'athletics', 'track and field', 'marathon', 'sprint',
  'badminton', 'table tennis', 'weightlifting', 'swimming',
  'cycling', 'tour de france', 'motogp', 'wwe',
  'transfer news', 'trade', 'contract extension',
];

const CRICKET_KEYWORDS = [
  'cricket', 'test match', 'odi', 't20', 'bbl', 'ipl', 'psl', 'the hundred',
  'batsman', 'batsmen', 'bowler', 'bowlers', 'all-rounder', 'wicketkeeper',
  'century', 'half-century', 'five-wicket', 'hat-trick', 'run-out', 'stumping',
  'virat', 'kohli', 'rohit', 'sharma', 'bumrah', 'jadeja', 'gill', 'iyer',
  'stokes', 'root', 'archer', 'anderson', 'broad', 'buttler', 'wood',
  'smith', 'warner', 'cummins', 'starc', 'lyon', 'hazlewood', 'labuschagne',
  'williamson', 'southee', 'boult', 'jamieson', 'ravindra',
  'babar', 'rizwan', 'afridi', 'shaheen', 'shadab', 'naseem',
  'shakib', 'mushfiqur', 'taskin', 'liton', 'tamim',
  'rabada', 'de kock', 'nortje', 'markram', 'miller', 'klaasen',
  'chandimal', 'mendis', 'hasaranga', 'chameera', 'asitha',
  'cummins', 'rashid', 'khan', 'mujeeb', 'gurbaz', 'naib',
  'holden', 'pooran', 'hetmyer', 'chase', 'roach', 'joseph',
  'sikandar', 'raza', 'muzarabani', 'ervine', 'williams', 'ngarava',
  'international', 'cricket council', 'icc', 'world cup', 'champions trophy',
  'asia cup', 'county', 'sheffield shield', 'ranji', 'big bash',
  'caribbean', 'premier league', 'test series', 'wpl',
  'england', 'india', 'australia', 'pakistan', 'bangladesh', 'sri lanka',
  'west indies', 'new zealand', 'south africa', 'zimbabwe', 'afghanistan',
  'ireland', 'netherlands', 'scotland', 'namibia', 'nepal', 'oman',
  'dhon', 'sachin', 'tendulkar',
];

const WOMEN_KEYWORDS = [
  'women', "women's", 'womens', 'woman', 'female', 'girl',
  'wpl', 'womens premier league', 'womens t20', 'womens odi', 'womens test',
  'womens asia cup', 'icc womens championship', 'womens world cup',
  'womens t20 world cup', 'womens champions trophy',
  'india women', 'england women', 'australia women', 'new zealand women',
  'south africa women', 'west indies women', 'pakistan women',
  'sri lanka women', 'bangladesh women', 'ireland women',
  'ind-w', 'eng-w', 'aus-w', 'nz-w', 'sa-w', 'wi-w', 'pak-w', 'sl-w', 'ban-w',
  'india women\'s', 'england women\'s', 'australia women\'s',
  'mithali', 'mandhana', 'harmanpreet', 'ecclestone', 'schutt',
  'healy', 'perry', 'lanning', 'bates', 'devine', 'taylor',
  'kapp', 'wolvaardt', 'ismail', 'goswami', 'sharma',
  'marizanne', 'shabnim', 'poonam', 'deepti', 'richa',
  'jemimah', 'shafali', 'renuka', 'rajeshwari',
  'nat sciver', 'sophie', 'alyssa', 'megan',
];

function isCricketArticle(title: string, excerpt: string, gender: string): boolean {
  const text = `${title} ${excerpt}`.toLowerCase();
  if (FOOTBALL_EXCLUDE.some((kw) => text.includes(kw))) return false;
  if (OTHER_SPORTS_EXCLUDE.some((kw) => text.includes(kw))) return false;
  if (!CRICKET_KEYWORDS.some((kw) => text.includes(kw))) return false;
  if (gender === 'men' && WOMEN_KEYWORDS.some((kw) => text.includes(kw))) return false;
  return true;
}

export function CricketNewsSection({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: articles, isLoading } = useCricketNews(gender);

  const filtered = useMemo(() => {
    if (!articles) return [];
    return articles.filter((a) => isCricketArticle(a.title, (a.excerpt || ''), gender));
  }, [articles, gender]);

  if (isLoading) {
    return (
      <Section title={t('Cricket News', 'ক্রিকেট খবর')} link="#">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-full sm:w-72 glass-card overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (filtered.length === 0) {
    return (
      <Section title={t('Cricket News', 'ক্রিকেট খবর')} link="#">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('Data source will be added in a future update.', 'ভবিষ্যত আপডেটে ডেটা উৎস যুক্ত করা হবে।')}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Cricket News', 'ক্রিকেট খবর')} link="#">
      <MatchCarousel>
        {filtered.map((article, i) => {
          const newsKey = article.id ?? `news-${i}`;
          return (
            <article
              key={newsKey}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {article.trending && <Badge variant="trending">{t('Trending', 'ট্রেন্ডিং')}</Badge>}
                  {article.featured && <Badge variant="breaking">{t('Featured', 'বৈশিষ্ট্যযুক্ত')}</Badge>}
                </div>
                <div className="absolute top-2 right-2"><BookmarkButton id={article.id} /></div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors">{article.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </article>
          );
        })}
      </MatchCarousel>
    </Section>
  );
}
