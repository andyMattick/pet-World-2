import React from 'react';
import { UserStats, CognitiveDomain } from '../types/game';
import {
  Activity,
  Calendar,
  Clock,
  Trophy,
  Zap,
  TrendingUp,
  Brain,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  Award,
} from 'lucide-react';
import { computeRolling7DayMetrics } from '../utils/rollingAnalytics';

interface ProgressViewProps {
  stats: UserStats;
  onBackToCatalog: () => void;
  onNavigateToInsights?: () => void;
  onOpenLeaderboard?: () => void;
}

export const ProgressOverTimeView: React.FC<ProgressViewProps> = ({
  stats,
  onBackToCatalog,
  onNavigateToInsights,
  onOpenLeaderboard,
}) => {
  // Compute rolling 7-day analytics
  const rolling = computeRolling7DayMetrics(stats);

  const maxDailyPoints = Math.max(100, ...rolling.days.map(d => d.points));
  const rollingMeanPercent = Math.min(100, Math.round((rolling.rollingAvgDailyPoints / maxDailyPoints) * 100));

  // Compute lifetime averages
  const history = stats.sessionHistory || [];
  const avgAccuracy = history.length > 0
    ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length)
    : 0;

  let bestRt = 99999;
  history.forEach(h => {
    if (h.reactionTimeMs > 0 && h.reactionTimeMs < bestRt) bestRt = h.reactionTimeMs;
  });

  const totalMinutes = Math.round(stats.totalTimeSeconds / 60);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              Rolling 7-Day Neuro-Telemetry
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Cognitive Progress & Rolling 7-Day Performance
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Continuous rolling 7-day stimulation averages, session history, and neural velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          )}

          {onNavigateToInsights && (
            <button
              onClick={onNavigateToInsights}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Brain Region Insights →</span>
            </button>
          )}

          <button
            onClick={onBackToCatalog}
            className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer px-2 py-1"
          >
            ← Back to Catalog
          </button>
        </div>
      </div>

      {/* ROLLING 7-DAY AVERAGE HIGHLIGHT STRIP */}
      <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Rolling 7-Day Averages & Velocity</h3>
              <span className="text-[11px] text-slate-400">Past 7 calendar days compared to previous 7-day cycle</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Total in 7 Days:</span>
            <span className="text-emerald-400 font-bold">{rolling.rollingTotalPoints} pts</span>
          </div>
        </div>

        {/* 4 Rolling 7-Day Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Rolling Daily Points</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {rolling.rollingAvgDailyPoints}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">pts/day</span>
            </div>
            <div className="mt-2 text-[10px] font-mono flex items-center gap-1">
              {rolling.pointsTrendPercent >= 0 ? (
                <span className="text-emerald-400 font-semibold">
                  +{rolling.pointsTrendPercent}% vs prior 7d
                </span>
              ) : (
                <span className="text-rose-400 font-semibold">
                  {rolling.pointsTrendPercent}% vs prior 7d
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Rolling Accuracy Mean</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                {rolling.rollingAvgAccuracy > 0 ? `${rolling.rollingAvgAccuracy}%` : '—'}
              </span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-400">
              {rolling.priorAvgAccuracy > 0 ? (
                <span>
                  {rolling.accuracyTrendDelta >= 0 ? `+${rolling.accuracyTrendDelta}%` : `${rolling.accuracyTrendDelta}%`} vs baseline
                </span>
              ) : (
                <span>Across {rolling.rollingSessionsCount} sessions</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Rolling Reaction Latency</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
                {rolling.rollingAvgReactionTimeMs > 0 ? `${rolling.rollingAvgReactionTimeMs} ms` : '—'}
              </span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-400">
              <span>{rolling.totalTrainingMinutes} mins trained this week</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">7-Day Consistency</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
                {rolling.activeDaysInLast7} / 7
              </span>
              <span className="text-[10px] text-slate-500 font-mono">days</span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-amber-400 font-medium">
              <span>{rolling.adherencePercentage}% weekly adherence</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Lifetime Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Lifetime Sessions</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums">
            {stats.totalSessions}
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Lifetime Time</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalMinutes} mins
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Lifetime Accuracy</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums">
            {avgAccuracy > 0 ? `${avgAccuracy}%` : '—'}
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Fastest Reaction</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums">
            {bestRt < 99999 ? `${bestRt} ms` : '—'}
          </span>
        </div>
      </div>

      {/* 7-Day Neuro Activity Bar Chart with Rolling 7-Day Overlay Line */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              7-Day Neuro Velocity & Rolling Average Baseline
            </h3>
            <span className="text-xs text-slate-400">
              Daily stimulation points with dashed rolling 7-day average threshold ({rolling.rollingAvgDailyPoints} pts/day)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
              <span>Daily Volume</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-4 h-0.5 border-t border-dashed border-amber-400 inline-block" />
              <span>Rolling Mean ({rolling.rollingAvgDailyPoints})</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer with Rolling Average Line Overlay */}
        <div className="h-48 pt-6 pb-2 px-2 border-b border-slate-800 relative">
          {/* Dashed Horizontal Rolling Average Line */}
          {rolling.rollingAvgDailyPoints > 0 && (
            <div
              className="absolute left-2 right-2 border-b-2 border-dashed border-amber-400/60 z-10 pointer-events-none transition-all flex items-center justify-end pr-2"
              style={{ bottom: `${Math.max(16, rollingMeanPercent * 0.7 + 24)}px` }}
            >
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-amber-500/30 -translate-y-2.5">
                Mean: {rolling.rollingAvgDailyPoints} pts
              </span>
            </div>
          )}

          <div className="h-full flex items-end justify-between gap-2 md:gap-4">
            {rolling.days.map((day) => {
              const heightPercent = Math.max(8, Math.round((day.points / maxDailyPoints) * 100));

              return (
                <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group relative z-20">
                  <div className="w-full flex justify-center items-end h-32 relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 pointer-events-none whitespace-nowrap z-30">
                      {day.points} pts ({day.sessionCount} sessions)
                    </div>

                    <div
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                        day.isToday
                          ? 'bg-indigo-500 group-hover:bg-indigo-400 shadow-md shadow-indigo-500/30 ring-1 ring-indigo-400/50'
                          : day.points > 0
                          ? 'bg-slate-700 group-hover:bg-slate-600'
                          : 'bg-slate-900'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div className="text-center">
                    <span className={`text-[11px] font-medium block ${day.isToday ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                      {day.dayLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {day.points > 0 ? day.points : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Session Log Table */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Session History Log
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {history.length} {history.length === 1 ? 'record' : 'records'} logged
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/60 text-slate-400 text-xs">
            No training sessions logged yet. Complete any brain game or warm-up to start tracking your rolling trajectory!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Date / Time</th>
                  <th className="py-2.5 px-3">Game</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Reaction Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {history.slice(0, 15).map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(sess.timestamp).toLocaleDateString()} {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-white">
                      {sess.gameTitle}
                    </td>
                    <td className="py-2.5 px-3 text-indigo-400 font-bold tabular-nums">
                      {sess.score} pts
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 tabular-nums">
                      {sess.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 tabular-nums">
                      {sess.reactionTimeMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
