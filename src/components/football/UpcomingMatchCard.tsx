import { motion } from 'framer-motion';
import { getFlagEmoji, formatDate, formatStage } from '@/utils/matchHelpers';

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  date: string;
  time: string;
  league: string;
  stage: string;
  venue: string;
}

export function UpcomingMatchCard({
  homeTeam, awayTeam, homeCrest, awayCrest,
  date, time, league, stage, venue,
}: Props) {
  const homeFlag = getFlagEmoji(homeTeam);
  const awayFlag = getFlagEmoji(awayTeam);
  const displayStage = stage || league;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card match-card p-4"
    >
      {/* Teams with vs divider */}
      <div className="space-y-2.5 mb-3">
        <div className="flex items-center gap-2">
          {homeFlag ? (
            <span className="text-lg shrink-0">{homeFlag}</span>
          ) : homeCrest ? (
            <img src={homeCrest} alt="" className="w-5 h-5 object-contain shrink-0" />
          ) : null}
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {homeTeam}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">vs</span>
        </div>

        <div className="flex items-center gap-2">
          {awayFlag ? (
            <span className="text-lg shrink-0">{awayFlag}</span>
          ) : awayCrest ? (
            <img src={awayCrest} alt="" className="w-5 h-5 object-contain shrink-0" />
          ) : null}
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {awayTeam}
          </span>
        </div>
      </div>

      {/* Date / Time / Stage / Venue */}
      <div className="space-y-1 text-[11px] text-gray-400">
        {date && (
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{formatDate(date)}</span>
          </div>
        )}
        {time && (
          <div className="flex items-center gap-1.5">
            <span>🕒</span>
            <span>{time}</span>
          </div>
        )}
        {displayStage && (
          <div className="flex items-center gap-1.5">
            <span>🏆</span>
            <span>{formatStage(displayStage)}</span>
          </div>
        )}
        {venue && (
          <div className="flex items-center gap-1.5">
            <span>🏟️</span>
            <span className="truncate">{venue}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
