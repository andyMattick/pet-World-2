import React, { useState } from 'react';
import { GameRecord, DatasetStatistics, MetricType } from '../types/game';
import { NormalDistributionChart } from './NormalDistributionChart';

interface RoundSummaryModalProps {
  isOpen: boolean;
  record: GameRecord | null;
  baselineStats: DatasetStatistics;
  hitPctStats: DatasetStatistics;
  missPctStats: DatasetStatistics;
  onPlayNextRound: () => void;
  onViewHistory: () => void;
  onClose: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  isOpen,
  record,
  baselineStats,
  hitPctStats,
  missPctStats,
  onPlayNextRound,
  onViewHistory,
  onClose,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('score');

  if (!isOpen || !record) return null;

  const hitPct = record.hitPercentage ?? record.accuracy;
  const missPct = record.missPercentage ?? (100 - hitPct);

  // Active statistics according to selected tab
  const activeStats =
    selectedMetric === 'score'
      ? baselineStats
      : selectedMetric === 'hit_pct'
      ? hitPctStats
      : missPctStats;

  const activeValue =
    selectedMetric === 'score' ? record.score : selectedMetric === 'hit_pct' ? hitPct : missPct;

  const activeZScore =
    selectedMetric === 'score'
      ? record.zScore
      : selectedMetric === 'hit_pct'
      ? record.hitZScore ?? 0
      : record.missZScore ?? 0;

  const activePercentile =
    selectedMetric === 'score'
      ? record.empiricalPercentile
      : selectedMetric === 'hit_pct'
      ? record.hitPercentile ?? 50
      : record.missPercentile ?? 50;

  const deviation = Number((activeValue - activeStats.mean).toFixed(2));
  const isPositiveZ = activeZScore >= 0;
  const unit = selectedMetric === 'score' ? 'pts' : '%';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
                🎯
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  Round #{record.roundNumber} Complete!
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>30-Second Timed Round</span>
                  <span>·</span>
                  <span>
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Primary Metrics Grid: Score, Hit %, Miss % */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Score Card */}
            <div
              onClick={() => setSelectedMetric('score')}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedMetric === 'score'
                  ? 'bg-amber-950/30 border-amber-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  1. Final Score
                </span>
                {selectedMetric === 'score' && <span className="text-xs text-amber-300">● Active</span>}
              </div>
              <span className="text-3xl font-extrabold font-mono text-amber-300 mt-1 block">
                {record.score} pts
              </span>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>z = {record.zScore >= 0 ? `+${record.zScore.toFixed(2)}` : record.zScore.toFixed(2)}</span>
                <span className="text-emerald-400 font-semibold">{record.empiricalPercentile}%ile</span>
              </div>
            </div>

            {/* Hit Accuracy Card */}
            <div
              onClick={() => setSelectedMetric('hit_pct')}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedMetric === 'hit_pct'
                  ? 'bg-emerald-950/30 border-emerald-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  2. Hit Accuracy %
                </span>
                {selectedMetric === 'hit_pct' && <span className="text-xs text-emerald-300">● Active</span>}
              </div>
              <span className="text-3xl font-extrabold font-mono text-emerald-300 mt-1 block">
                {hitPct}%
              </span>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>
                  z ={' '}
                  {record.hitZScore
                    ? record.hitZScore >= 0
                      ? `+${record.hitZScore.toFixed(2)}`
                      : record.hitZScore.toFixed(2)
                    : '0.00'}
                </span>
                <span className="text-emerald-400 font-semibold">{record.hitPercentile ?? 50}%ile</span>
              </div>
            </div>

            {/* Miss Rate Card */}
            <div
              onClick={() => setSelectedMetric('miss_pct')}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedMetric === 'miss_pct'
                  ? 'bg-rose-950/30 border-rose-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                  3. Miss Rate %
                </span>
                {selectedMetric === 'miss_pct' && <span className="text-xs text-rose-300">● Active</span>}
              </div>
              <span className="text-3xl font-extrabold font-mono text-rose-300 mt-1 block">
                {missPct}%
              </span>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>
                  z ={' '}
                  {record.missZScore
                    ? record.missZScore >= 0
                      ? `+${record.missZScore.toFixed(2)}`
                      : record.missZScore.toFixed(2)
                    : '0.00'}
                </span>
                <span className="text-rose-400 font-semibold">{record.missPercentile ?? 50}%ile</span>
              </div>
            </div>
          </div>

          {/* Performance Sub-Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-xs text-slate-300">
            <div>
              <span className="text-slate-500">Hits: </span>
              <span className="font-mono font-semibold text-emerald-300">{record.hits}</span>
              {(record.goldenHits > 0 || (record.speedyHits ?? 0) > 0 || (record.frozenHits ?? 0) > 0) && (
                <span className="text-[11px] text-slate-400">
                  {' '}({record.goldenHits > 0 && <span className="text-amber-400 font-semibold">{record.goldenHits}👑 </span>}
                  {(record.speedyHits ?? 0) > 0 && <span className="text-sky-300 font-semibold">{(record.speedyHits ?? 0)}⚡ </span>}
                  {(record.frozenHits ?? 0) > 0 && <span className="text-cyan-300 font-semibold">{(record.frozenHits ?? 0)}❄️</span>})
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-500">Max Combo: </span>
              <span className="font-mono font-semibold text-amber-400">
                {record.maxCombo !== undefined ? `${record.maxCombo}🔥` : '0🔥'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Missed Swings: </span>
              <span className="font-mono font-semibold text-rose-400">{record.misses}</span>
            </div>
            <div>
              <span className="text-slate-500">Total Swings: </span>
              <span className="font-mono font-semibold text-slate-200">{record.totalClicks}</span>
            </div>
            <div>
              <span className="text-slate-500">Avg Reaction: </span>
              <span className="font-mono font-semibold text-amber-300">
                {record.avgReactionTimeMs > 0 ? `${record.avgReactionTimeMs}ms` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Real Data Live Mean Tracker Callout */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📈</span>
              <div>
                <span className="font-bold text-amber-300 block">
                  Actual Mean of All Played Games: μ = {activeStats.mean}{unit}
                </span>
                <span className="text-[11px] text-slate-300">
                  {record.previousMean !== undefined ? (
                    <>
                      Shifted from <strong>{record.previousMean}</strong> by{' '}
                      <strong className={record.meanDelta && record.meanDelta > 0 ? 'text-emerald-400' : record.meanDelta && record.meanDelta < 0 ? 'text-rose-400' : 'text-slate-300'}>
                        {record.meanDelta !== undefined && record.meanDelta > 0 ? `+${record.meanDelta}` : record.meanDelta}{unit}
                      </strong>{' '}
                      this round (N = {activeStats.count} games)
                    </>
                  ) : (
                    <>Round 1 initial baseline mean established. Next rounds will adjust this mean live!</>
                  )}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs shrink-0">
              μ = {activeStats.mean}
            </span>
          </div>

          {/* Bell Curve Normal Distribution Graph for the Selected Metric */}
          <div>
            <NormalDistributionChart
              stats={activeStats}
              currentScore={activeValue}
              roundLabel={`Round #${record.roundNumber}`}
              showHistogram={true}
              metric={selectedMetric}
              onMetricChange={(m) => setSelectedMetric(m)}
              unit={unit}
            />
          </div>

          {/* Step-by-Step Statistical Arithmetic Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span>
                📐 Calculation Breakdown for{' '}
                {selectedMetric === 'score'
                  ? 'Score'
                  : selectedMetric === 'hit_pct'
                  ? 'Hit % (Accuracy)'
                  : 'Miss % (Error Rate)'}
              </span>
            </h4>

            <div className="space-y-2 text-slate-300 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-amber-400 font-semibold block text-[11px]">
                  1. Deviation from Population Mean:
                </span>
                <span className="text-slate-200">
                  (X - μ) = {activeValue}{unit} - {activeStats.mean}{unit} ={' '}
                  {deviation >= 0 ? `+${deviation}` : deviation}{unit}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-amber-400 font-semibold block text-[11px]">
                  2. Standardized Z-Score Formula:
                </span>
                <span className="text-slate-200">
                  z = (X - μ) / σ = ({activeValue} - {activeStats.mean}) / {activeStats.stdDev} ={' '}
                  <strong className={isPositiveZ ? 'text-emerald-400' : 'text-rose-400'}>
                    {isPositiveZ ? `+${activeZScore.toFixed(3)}` : activeZScore.toFixed(3)}
                  </strong>
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-amber-400 font-semibold block text-[11px]">
                  3. Percentile Rank:
                </span>
                <span className="text-slate-200">
                  Empirical Rank = <strong>{activePercentile}th percentile</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onViewHistory}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
          >
            📊 View All Rounds & Trends
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={onPlayNextRound}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all text-center whitespace-nowrap"
            >
              Play Next Round (30s) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
