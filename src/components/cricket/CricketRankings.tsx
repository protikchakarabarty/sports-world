import { motion } from 'framer-motion';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlayerPhoto } from './PlayerPhoto';
import type { Athlete } from '@/types';

const richestCricketers: Athlete[] = [
  { id: 'rc1', name: 'Sachin Tendulkar', sport: 'Cricket', image: '', rank: 1, value: '$175 Million', nationality: 'India' },
  { id: 'rc2', name: 'Ajay Jadeja', sport: 'Cricket', image: '', rank: 2, value: '$175 Million', nationality: 'India' },
  { id: 'rc3', name: 'Mahendra Singh Dhoni', sport: 'Cricket', image: '', rank: 3, value: '$111 Million', nationality: 'India' },
  { id: 'rc4', name: 'Virat Kohli', sport: 'Cricket', image: '', rank: 4, value: '$92 Million', nationality: 'India' },
  { id: 'rc5', name: 'Ricky Ponting', sport: 'Cricket', image: '', rank: 5, value: '$70 Million', nationality: 'Australia' },
  { id: 'rc6', name: 'Brian Lara', sport: 'Cricket', image: '', rank: 6, value: '$60 Million', nationality: 'West Indies' },
  { id: 'rc7', name: 'Shane Warne', sport: 'Cricket', image: '', rank: 7, value: '$50 Million', nationality: 'Australia' },
  { id: 'rc8', name: 'Jacques Kallis', sport: 'Cricket', image: '', rank: 8, value: '$48 Million', nationality: 'South Africa' },
  { id: 'rc9', name: 'Virender Sehwag', sport: 'Cricket', image: '', rank: 9, value: '$40 Million', nationality: 'India' },
  { id: 'rc10', name: 'Shane Watson', sport: 'Cricket', image: '', rank: 10, value: '$40 Million', nationality: 'Australia' },
];

const womensRichestCricketers: Athlete[] = [
  { id: 'wrc1', name: 'Smriti Mandhana', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 1, value: '$12M', nationality: 'India' },
  { id: 'wrc2', name: 'Ellyse Perry', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 2, value: '$10M', nationality: 'Australia' },
  { id: 'wrc3', name: 'Harmanpreet Kaur', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 3, value: '$8M', nationality: 'India' },
  { id: 'wrc4', name: 'Meg Lanning', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 4, value: '$7.5M', nationality: 'Australia' },
  { id: 'wrc5', name: 'Alyssa Healy', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 5, value: '$6M', nationality: 'Australia' },
  { id: 'wrc6', name: 'Sophie Ecclestone', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 6, value: '$5.5M', nationality: 'England' },
  { id: 'wrc7', name: 'Deepti Sharma', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 7, value: '$5M', nationality: 'India' },
  { id: 'wrc8', name: 'Shafali Verma', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 8, value: '$4.5M', nationality: 'India' },
  { id: 'wrc9', name: 'Beth Mooney', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 9, value: '$4M', nationality: 'Australia' },
  { id: 'wrc10', name: 'Nat Sciver-Brunt', sport: 'Cricket', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200', rank: 10, value: '$3.8M', nationality: 'England' },
];

export function CricketRankings({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const data = gender === 'women' ? womensRichestCricketers : richestCricketers;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Section title={t('Richest Cricketers', 'ধনী ক্রিকেটার')} subtitle={t('Top 10 wealthiest cricket players', 'শীর্ষ ১০ ধনী ক্রিকেট খেলোয়াড়')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.map((c, i) => {
          const rankKey = c.id ?? c.name ?? `cricket-rank-${i}`;
          console.assert(rankKey !== "", "Empty React key detected in CricketRankings");
          return (
          <motion.div
            key={rankKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="glass-card flex items-center gap-3 p-3"
          >
            <span className="text-lg w-8 text-center">{medals[i] || `#${i + 1}`}</span>
            <PlayerPhoto name={c.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</p>
              <p className="text-xs text-gray-400 truncate">{c.nationality} • {c.value}</p>
            </div>
          </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
