import { motion } from 'framer-motion';
import { getFlagEmoji, formatDate, formatStage } from '@/utils/matchHelpers';

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  homeDisplayScore: number;
  awayDisplayScore: number;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  hasPenalties?: boolean;
  date: string;
  time: string;
  stage: string;
  goals?: { minute: number; extraMinute?: number; player: string; team: 'home' | 'away'; type: string }[];
}

export function FinishedMatchCard({
  homeTeam, awayTeam, homeCrest, awayCrest,
  homeDisplayScore, awayDisplayScore,
  homePenaltyScore, awayPenaltyScore, hasPenalties,
  date, time, stage, goals,
}: Props) {
  const safeHomeScore = (homeDisplayScore != null && !isNaN(homeDisplayScore)) ? homeDisplayScore : 0;
  const safeAwayScore = (awayDisplayScore != null && !isNaN(awayDisplayScore)) ? awayDisplayScore : 0;
  const homeFlag = getFlagEmoji(homeTeam);
  const awayFlag = getFlagEmoji(awayTeam);
  const showPen = hasPenalties && homePenaltyScore != null && awayPenaltyScore != null;

  console.log("[Penalty UI]", {
    match: `${homeTeam} vs ${awayTeam}`,
    homeDisplayScore,
    awayDisplayScore,
    safeHomeScore,
    safeAwayScore,
    homePenaltyScore,
    awayPenaltyScore,
    showPen,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`glass-card match-card p-4 ${showPen ? 'match-card-penalty' : ''}`}
    >
      {/* Teams + Scores */}
      <div className="space-y-2.5 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {homeFlag ? (
              <span className="text-lg shrink-0">{homeFlag}</span>
            ) : homeCrest ? (
              <img src={homeCrest} alt="" className="w-5 h-5 object-contain shrink-0" />
            ) : null}
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {homeTeam}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <span className="text-lg font-bold text-emerald-500 tabular-nums">
              {safeHomeScore}
            </span>
            {showPen && (
              <span className="text-xs font-bold text-emerald-500/70 tabular-nums ml-1">
                ({homePenaltyScore})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {awayFlag ? (
              <span className="text-lg shrink-0">{awayFlag}</span>
            ) : awayCrest ? (
              <img src={awayCrest} alt="" className="w-5 h-5 object-contain shrink-0" />
            ) : null}
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {awayTeam}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <span className="text-lg font-bold text-gray-600 dark:text-gray-300 tabular-nums">
              {safeAwayScore}
            </span>
            {showPen && (
              <span className="text-xs font-bold text-gray-500/70 tabular-nums ml-1">
                ({awayPenaltyScore})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Goal scorers */}
      {goals && goals.length > 0 && (
        <div className="mb-3 space-y-0.5">
          {goals.map((g, gi) => (
            <div key={gi} className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
              <span>⚽</span>
              <span className={g.team === 'home' ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                {g.player}
              </span>
              <span className="tabular-nums text-gray-400">{g.minute}{g.extraMinute ? `+${g.extraMinute}` : ''}'</span>
              {g.type === 'penalty' && <span className="text-[10px] text-gray-400">(PEN)</span>}
              {g.type === 'own-goal' && <span className="text-[10px] text-gray-400">(OG)</span>}
            </div>
          ))}
        </div>
      )}

      {/* PEN badge */}
      {showPen && (
        <div className="flex justify-center mb-3">
          <span
            className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold leading-5"
            style={{ background: '#FFD54A', color: '#111' }}
          >
            🟡 PEN
          </span>
        </div>
      )}

      {/* Date / Time / Stage */}
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
        {stage && (
          <div className="flex items-center gap-1.5">
            <span>🏆</span>
            <span>{formatStage(stage)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
