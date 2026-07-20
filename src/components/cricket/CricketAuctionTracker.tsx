import { motion } from 'framer-motion';
import type { Gender } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketAuctionData } from '@/hooks/useCricketData';
import { PlayerPhoto } from './PlayerPhoto';

export function CricketAuctionTracker({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: transfers, isLoading } = useCricketAuctionData(gender);

  if (isLoading) {
    return (
      <Section title={t('Auction Tracker', 'নিলাম ট্র্যাকার')} subtitle={t('Latest player transfers and auction updates', 'সর্বশেষ খেলোয়াড় স্থানান্তর ও নিলাম আপডেট')}>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <Section title={t('Auction Tracker', 'নিলাম ট্র্যাকার')} subtitle={t('Latest player transfers and auction updates', 'সর্বশেষ খেলোয়াড় স্থানান্তর ও নিলাম আপডেট')}>
        <div className="glass-card p-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('No transfer updates available at the moment.', 'এই মুহূর্তে কোনো স্থানান্তর আপডেট উপলব্ধ নেই।')}
          </p>
        </div>
      </Section>
    );
  }

  const title = gender === 'women' ? t('WPL Auction Tracker', 'ডব্লিউপিএল নিলাম ট্র্যাকার') : t('IPL/BPL Auction Tracker', 'আইপিএল/বিপিএল নিলাম ট্র্যাকার');

  return (
    <Section title={title} subtitle={t('Latest player transfers and auction updates', 'সর্বশেষ খেলোয়াড় স্থানান্তর ও নিলাম আপডেট')}>
      <div className="space-y-2">
        {transfers.map((item, i) => (
          <motion.div
            key={item.id ?? `auction-${i}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3 flex items-center justify-between flex-wrap gap-2"
          >
            <div className="flex items-center gap-3">
              <PlayerPhoto name={item.player} size="sm" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.player}</p>
                <p className="text-xs text-gray-400">{item.from} → {item.to}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.fee}</span>
              <Badge variant={item.status === 'completed' ? 'success' : item.status === 'rumored' ? 'warning' : 'default'}>
                {t(item.status.charAt(0).toUpperCase() + item.status.slice(1), item.status === 'completed' ? 'সম্পন্ন' : item.status === 'rumored' ? 'গুজব' : 'বাকি')}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
