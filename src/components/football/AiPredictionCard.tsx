import { motion } from 'framer-motion';
import { FiCpu, FiTarget, FiAlertTriangle, FiStar, FiTrendingUp } from 'react-icons/fi';
import type { AiExtendedPrediction } from '@/types/prediction';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBarColor, getTextColorForTeam, getTeamColorStyle } from '@/utils/teamColors';

interface Props {
  prediction?: AiExtendedPrediction;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  isLoading?: boolean;
}

export function AiPredictionCard({ prediction, homeTeam, awayTeam, homeCrest, awayCrest, isLoading }: Props) {
  const { t } = useLanguage();

  if (isLoading || !prediction) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <FiCpu className="w-4 h-4 text-purple-500" />
          <Badge variant="trending">{t('AI Powered', 'এআই চালিত')}</Badge>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">{t('No prediction available', 'কোনো পূর্বাভাস নেই')}</p>
          </div>
        )}
      </div>
    );
  }

  const { isKnockout } = prediction;
  const showDraw = !isKnockout && prediction.drawProbability > 0;
  const totalProbs = prediction.homeProbability + (showDraw ? prediction.drawProbability : 0) + prediction.awayProbability;
  const homeBarWidth = totalProbs > 0 ? (prediction.homeProbability / totalProbs) * 100 : 0;
  const drawBarWidth = totalProbs > 0 && showDraw ? (prediction.drawProbability / totalProbs) * 100 : 0;
  const awayBarWidth = totalProbs > 0 ? (prediction.awayProbability / totalProbs) * 100 : 0;

  const homeBar = getBarColor(homeTeam);
  const awayBar = getBarColor(awayTeam);
  const drawBar = getBarColor('draw');

  const homeColorStyle = getTeamColorStyle(homeTeam);
  const awayColorStyle = getTeamColorStyle(awayTeam);

  const bars = [
    { label: homeTeam, prob: prediction.homeProbability, barWidth: homeBarWidth, crest: homeCrest, colors: homeBar, textColor: getTextColorForTeam(homeTeam) },
    ...(showDraw ? [{ label: t('Draw', 'ড্র'), prob: prediction.drawProbability, barWidth: drawBarWidth, crest: undefined as string | undefined, colors: drawBar, textColor: '#6B7280' }] : []),
    { label: awayTeam, prob: prediction.awayProbability, barWidth: awayBarWidth, crest: awayCrest, colors: awayBar, textColor: getTextColorForTeam(awayTeam) },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <FiCpu className="w-4 h-4 text-purple-500" />
        <Badge variant="trending">{t('AI Powered', 'এআই চালিত')}</Badge>
        {isKnockout && (
          <Badge variant="warning">{t('Knockout', 'নকআউট')}</Badge>
        )}
      </div>

      {/* Winner + Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl mb-4 border ${prediction.confidence === 'High' ? 'bg-emerald-500/10 border-emerald-500/25' : prediction.confidence === 'Medium' ? 'bg-blue-500/10 border-blue-500/25' : 'bg-gray-500/10 border-gray-500/25'}`}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">{t('Predicted Winner', 'পূর্বাভাসিত বিজয়ী')}</p>
          <span className={`text-xs font-semibold ${prediction.confidence === 'High' ? 'text-emerald-500' : prediction.confidence === 'Medium' ? 'text-blue-500' : 'text-gray-400'}`}>
            {prediction.confidence} {t('Confidence', 'আত্মবিশ্বাস')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{prediction.predicted}</p>
          <span className="text-sm font-bold text-emerald-500">{prediction.probability}%</span>
        </div>
        {prediction.predictedScore && prediction.predictedScore !== '-' && (
          <p className="text-xs text-gray-400 mt-1">
            <FiTarget className="inline w-3 h-3 mr-1" />
            {t('Predicted Score', 'পূর্বাভাসিত স্কোর')}: {prediction.predictedScore}
          </p>
        )}
      </motion.div>

      {/* Probability Bars */}
      <div className="space-y-3 mb-4">
        {bars.map((bar) => (
          <motion.div
            key={bar.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {bar.crest ? (
                  <img src={bar.crest} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ backgroundColor: `${bar.colors.base}20`, color: bar.colors.base }}
                  >
                    {bar.label === t('Draw', 'ড্র') ? '=' : bar.label.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bar.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: bar.textColor }}>
                {bar.prob}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.barWidth}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: bar.colors.gradient,
                  boxShadow: bar.colors.glow,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Momentum bars */}
      {prediction.homeMomentum != null && prediction.awayMomentum != null && (
        <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 mb-2">
            <FiTrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500">{t('Match Momentum', 'ম্যাচ momentum')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-medium w-1/4 text-right truncate"
              style={{ color: homeColorStyle.isLight ? '#374151' : homeColorStyle.color }}
            >
              {homeTeam}
            </span>
            <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.homeMomentum}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-l-full"
                style={{
                  background: homeBar.gradient,
                  boxShadow: homeBar.glow,
                }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.awayMomentum}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full rounded-r-full"
                style={{
                  background: awayBar.gradient,
                  boxShadow: awayBar.glow,
                }}
              />
            </div>
            <span
              className="text-xs font-medium w-1/4 truncate"
              style={{ color: awayColorStyle.isLight ? '#374151' : awayColorStyle.color }}
            >
              {awayTeam}
            </span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatBox label={t('xG', 'xG')} home={prediction.homeXg} away={prediction.awayXg} homeColor={homeColorStyle.color} awayColor={awayColorStyle.color} fmt={(v) => v?.toFixed(2) ?? '-'} />
        <StatBox label={t('Possession', 'পজেশন')} home={prediction.homePossession} away={prediction.awayPossession} homeColor={homeColorStyle.color} awayColor={awayColorStyle.color} suffix="%" />
        <StatBox label={t('Shots', 'শট')} home={prediction.homeShots} away={prediction.awayShots} homeColor={homeColorStyle.color} awayColor={awayColorStyle.color} />
        <StatBox label={t('Corners', 'কর্নার')} home={prediction.homeCorners} away={prediction.awayCorners} homeColor={homeColorStyle.color} awayColor={awayColorStyle.color} />
        <StatBox label={t('Clean Sheet', 'ক্লিন শীট')} home={prediction.homeCleanSheetChance} away={prediction.awayCleanSheetChance} homeColor={homeColorStyle.color} awayColor={awayColorStyle.color} suffix="%" />
        {prediction.upsetChance != null && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <FiAlertTriangle className="w-3 h-3 text-amber-500" />
              <p className="text-[10px] font-semibold text-gray-500">{t('Upset Chance', 'আপসেট')}</p>
            </div>
            <p className="text-sm font-bold text-amber-500">{prediction.upsetChance}%</p>
          </div>
        )}
      </div>

      {/* Star Player */}
      {prediction.starPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 mb-4"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <FiStar className="w-3.5 h-3.5 text-yellow-500" />
            <p className="text-xs font-semibold text-gray-500">{t('Star Player to Watch', 'নজর রাখুন')}</p>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{prediction.starPlayer}</p>
          {prediction.starPlayerReason && (
            <p className="text-xs text-gray-500 mt-0.5">{prediction.starPlayerReason}</p>
          )}
        </motion.div>
      )}

      {/* Key Reasons */}
      {prediction.keyReasons.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-semibold text-gray-500 mb-2">{t('Key Reasons', 'মূল কারণ')}</p>
          <ul className="space-y-1">
            {prediction.keyReasons.slice(0, 5).map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Reasoning */}
      {prediction.reasoning && (
        <p className="text-xs text-gray-400 italic mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {prediction.reasoning}
        </p>
      )}
    </div>
  );
}

function StatBox({ label, home, away, homeColor, awayColor, fmt, suffix }: {
  label: string;
  home: number | null;
  away: number | null;
  homeColor: string;
  awayColor: string;
  fmt?: (v: number) => string;
  suffix?: string;
}) {
  const hVal = home != null ? (fmt ? fmt(home) : `${home}${suffix ?? ''}`) : '-';
  const aVal = away != null ? (fmt ? fmt(away) : `${away}${suffix ?? ''}`) : '-';
  return (
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <p className="text-[10px] font-semibold text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium" style={{ color: homeColor }}>{hVal}</span>
        <span className="text-gray-300 dark:text-gray-600">vs</span>
        <span className="font-medium" style={{ color: awayColor }}>{aVal}</span>
      </div>
    </div>
  );
}
