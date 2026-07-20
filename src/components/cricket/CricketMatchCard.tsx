import { motion } from 'framer-motion';
import { FiMapPin, FiMonitor, FiClock } from 'react-icons/fi';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';

function formatDateTime(dateStr: string): string {
  if (!dateStr || dateStr === 'TBD') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

interface CricketMatchItem {
  id: string;
  status: 'live' | 'upcoming' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  time: string;
  date: string;
  venue: string;
  broadcast: string;
  league?: string;
}

export function CricketMatchCard({ match }: { match: CricketMatchItem }) {
  const { t } = useLanguage();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'warning' : 'success'}>
          {match.status === 'live' ? t('LIVE', 'লাইভ') : match.status === 'upcoming' ? t('Upcoming', 'আসন্ন') : t('Completed', 'শেষ')}
        </Badge>
        <span className="text-xs text-gray-400">{match.league}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.homeTeam}</span>
          {match.homeScore && <span className="text-lg font-bold text-blue-500">{match.homeScore}</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{match.awayTeam}</span>
          {match.awayScore && <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{match.awayScore}</span>}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <FiClock className="w-3 h-3" />
        <span>{formatDateTime(match.time || match.date)}</span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FiMapPin className="w-3 h-3" /> {match.venue}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FiMonitor className="w-3 h-3" /> {match.broadcast}
        </div>
      </div>
    </motion.div>
  );
}
