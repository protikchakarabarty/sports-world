import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiClock, FiCpu } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketMatches } from '@/hooks/useCricketData';
import { useAIPrediction } from '@/hooks/useGeminiPrediction';
import { derivePollQuestion, slug } from '@/utils/pollId';

function formatDateTime(dateStr: string): string {
  if (!dateStr || dateStr === 'TBD') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function AIPredictionCard({ match }: { match: { id: string; homeTeam: string; awayTeam: string; time: string; date: string; league?: string } }) {
  const { t } = useLanguage();
  const compPrefix = match.league ? slug(match.league) : 'cricket';
  const question = derivePollQuestion(match.homeTeam, match.awayTeam);
  const options = [match.homeTeam, match.awayTeam, 'Draw'];

  const { data: ai } = useAIPrediction(question, options);

  const homeAiProb = ai
    ? ai.predicted === match.homeTeam ? ai.probability : 100 - ai.probability
    : 50;
  const awayAiProb = 100 - homeAiProb;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <FiBarChart2 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{match.homeTeam} vs {match.awayTeam}</h3>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <FiClock className="w-3 h-3" />
        <span>{formatDateTime(match.time || match.date)}</span>
      </div>

      {/* AI Prediction */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <FiCpu className="w-3 h-3 text-purple-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('AI Prediction', 'এআই পূর্বাভাস')}</span>
        </div>
        {ai ? (
          <div className="space-y-1.5">
            <div className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transition-all" style={{ width: `${homeAiProb}%` }} />
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{match.homeTeam}</span>
                <span className="text-sm font-bold text-purple-500">{homeAiProb.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transition-all" style={{ width: `${awayAiProb}%` }} />
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{match.awayTeam}</span>
                <span className="text-sm font-bold text-purple-500">{awayAiProb.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t('Confidence', 'আত্মবিশ্বাস')}: {ai.confidence}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CricketAIPredictions({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: matches, isLoading: crLoading } = useCricketMatches(gender);

  const upcomingIn24h = useMemo(() => {
    const now = new Date();
    const ms24h = 24 * 60 * 60 * 1000;
    return (matches || []).filter((m) => {
      if (m.status !== 'upcoming') return false;
      const matchTime = new Date(m.time || m.date);
      if (isNaN(matchTime.getTime())) return false;
      const diff = matchTime.getTime() - now.getTime();
      return diff > -7200000 && diff <= ms24h;
    });
  }, [matches]);

  if (crLoading) {
    return (
      <Section title={t('Match Predictions by AI', 'এআই ম্যাচ পূর্বাভাস')} className="mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (upcomingIn24h.length === 0) {
    return (
      <Section title={t('Match Predictions by AI', 'এআই ম্যাচ পূর্বাভাস')} className="mb-0">
        <div className="glass-card p-4 text-center py-6">
          <p className="text-xs text-gray-400">{t('No matches scheduled in the next 24 hours', 'পরবর্তী ২৪ ঘন্টায় কোনো ম্যাচ নির্ধারিত নয়')}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Match Predictions by AI', 'এআই ম্যাচ পূর্বাভাস')} subtitle={t('AI-powered win probability for upcoming matches', 'আসন্ন ম্যাচের জন্য এআই-চালিত জয়ের সম্ভাবনা')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingIn24h.map((match) => (
          <AIPredictionCard key={match.id} match={match} />
        ))}
      </div>
    </Section>
  );
}
