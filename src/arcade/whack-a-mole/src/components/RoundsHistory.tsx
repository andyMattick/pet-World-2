import React, { useState } from 'react';
import { GameRecord, DatasetStatistics } from '../types/game';

interface RoundsHistoryProps {
  records: GameRecord[];
  baselineStats: DatasetStatistics;
  onClearHistory: () => void;
  onSelectRoundForChart?: (score: number, roundNum: number) => void;
}

export const RoundsHistory: React.FC<RoundsHistoryProps> = ({
  records,
  baselineStats,
  onClearHistory,
  onSelectRoundForChart,
}) => {
  const [activeTab, setActiveTab] = useState<'rounds' | 'baseline' | 'trends'>('rounds');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Player's personal session summary
  const playerScores = records.map((r) => r.score);
  const playerHitPcts = records.map((r) => r.hitPercentage ?? r.accuracy);
  const playerMissPcts = records.map((r) => r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy)));

  const sessionMeanScore = playerScores.length
    ? Number((playerScores.reduce((a, b) => a + b, 0) / playerScores.length).toFixed(1))
    : 0;
  const sessionMeanHitPct = playerHitPcts.length
    ? Number((playerHitPcts.reduce((a, b) => a + b, 0) / playerHitPcts.length).toFixed(1))
    : 0;
  const sessionMeanMissPct = playerMissPcts.length
    ? Number((playerMissPcts.reduce((a, b) => a + b, 0) / playerMissPcts.length).toFixed(1))
    : 0;

  const handleExportCsv = () => {
    if (!records.length) return;
    const headers = [
      'Round',
      'Timestamp',
      'Score',
      'Hits',
      'GoldenHits',
      'Misses',
      'MaxCombo',
      'HitPercentage',
      'MissPercentage',
      'ScoreZScore',
      'ScorePercentile',
      'HitZScore',
      'HitPercentile',
      'MissZScore',
      'MissPercentile',
    ];
    const rows = records.map((r) => [
      r.roundNumber,
      new Date(r.timestamp).toISOString(),
      r.score,
      r.hits,
      r.goldenHits,
      r.misses,
      r.maxCombo ?? 0,
      r.hitPercentage ?? r.accuracy,
      r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy)),
      r.zScore.toFixed(3),
      r.empiricalPercentile,
      (r.hitZScore ?? 0).toFixed(3),
      r.hitPercentile ?? 50,
      (r.missZScore ?? 0).toFixed(3),
      r.missPercentile ?? 50,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Chronological order for trend graph (Round 1 -> latest)
  const chronologicalRecords = [...records].reverse();

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>📊 Multi-Round Tracking & Analytics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking Score, Hit %, and Miss % across all 30-second games against standardized norms.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('rounds')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'rounds'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rounds Table ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'trends'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trend Graphs 📈
          </button>
          <button
            onClick={() => setActiveTab('baseline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'baseline'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Baseline Norms (N = {baselineStats.count})
          </button>
        </div>
      </div>

      {activeTab === 'rounds' && (
        <div className="space-y-4">
          {/* Session Overview Stats with Score, Hit %, and Miss % */}
          {records.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Rounds Played</span>
                <span className="text-xl font-bold font-mono text-slate-100">{records.length}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Score</span>
                <span className="text-xl font-bold font-mono text-amber-300">{sessionMeanScore} pts</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Hit %</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{sessionMeanHitPct}%</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Miss %</span>
                <span className="text-xl font-bold font-mono text-rose-400">{sessionMeanMissPct}%</span>
              </div>
            </div>
          )}

          {/* Rounds Table */}
          {records.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800">
              <span className="text-3xl block mb-2">🎯</span>
              <h4 className="text-sm font-semibold text-slate-200">No rounds played yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Press "Start 30s Game" to play. Scores, hit %, and miss % will be automatically
                analyzed with Z-scores and percentiles!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Round</th>
                    <th className="py-3 px-3">Score (X)</th>
                    <th className="py-3 px-3">Mean (μ) & Shift</th>
                    <th className="py-3 px-3">Score Z / %ile</th>
                    <th className="py-3 px-3">Hit % (Acc)</th>
                    <th className="py-3 px-3">Miss % (Err)</th>
                    <th className="py-3 px-3">Swings</th>
                    <th className="py-3 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {records.map((rec, idx) => {
                    const hitPct = rec.hitPercentage ?? rec.accuracy;
                    const missPct = rec.missPercentage ?? (100 - hitPct);
                    const isPositiveZ = rec.zScore >= 0;

                    return (
                      <tr
                        key={rec.id ? `${rec.id}-${rec.roundNumber}-${idx}` : `round-${rec.roundNumber}-${idx}`}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-200">
                          #{rec.roundNumber}
                          <span className="text-[10px] text-slate-400 font-sans block">
                            {new Date(rec.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-sm font-bold text-amber-400">{rec.score}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {rec.newMean !== undefined ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-amber-300">
                                μ = {rec.newMean}
                              </span>
                              {rec.meanDelta !== undefined && rec.roundNumber > 1 && (
                                <span
                                  className={`text-[10px] font-semibold ${
                                    rec.meanDelta > 0
                                      ? 'text-emerald-400'
                                      : rec.meanDelta < 0
                                      ? 'text-rose-400'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {rec.meanDelta > 0 ? `▲+${rec.meanDelta}` : rec.meanDelta < 0 ? `▼${rec.meanDelta}` : '0.0'}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs">―</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isPositiveZ
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                              }`}
                            >
                              {isPositiveZ ? `+${rec.zScore.toFixed(2)}` : rec.zScore.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-slate-300">{rec.empiricalPercentile}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-emerald-400 font-semibold">{hitPct}%</span>
                          <span className="text-[10px] text-slate-400 block">
                            z = {rec.hitZScore ? (rec.hitZScore >= 0 ? `+${rec.hitZScore.toFixed(2)}` : rec.hitZScore.toFixed(2)) : '0.00'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-rose-400 font-semibold">{missPct}%</span>
                          <span className="text-[10px] text-slate-400 block">
                            z = {rec.missZScore ? (rec.missZScore >= 0 ? `+${rec.missZScore.toFixed(2)}` : rec.missZScore.toFixed(2)) : '0.00'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          <div>{rec.hits}H / {rec.misses}M</div>
                          {rec.maxCombo !== undefined && rec.maxCombo > 0 && (
                            <span className="text-[10px] text-amber-400 font-semibold block">
                              {rec.maxCombo}x streak 🔥
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onSelectRoundForChart?.(rec.score, rec.roundNumber)}
                            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                          >
                            Chart ↗
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Action buttons */}
          {records.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <span>📋</span>
                <span>{copiedNotification ? 'Copied CSV to Clipboard!' : 'Copy Data to Clipboard (CSV)'}</span>
              </button>

              <div className="flex items-center gap-2">
                {confirmReset ? (
                  <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-lg">
                    <span className="text-xs text-rose-300">Wipe all {records.length} scores?</span>
                    <button
                      onClick={() => {
                        onClearHistory();
                        setConfirmReset(false);
                      }}
                      className="px-2 py-0.5 text-xs font-bold rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                    >
                      Yes, Reset All
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-2 py-0.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-3 py-1.5 text-xs rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition-colors"
                  >
                    🗑️ Reset All Scores
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multi-Round Trend Graphs (Score, Hit %, and Miss %) */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          {chronologicalRecords.length < 2 ? (
            <div className="text-center py-10 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800">
              <span className="text-3xl block mb-2">📈</span>
              <h4 className="text-sm font-semibold text-slate-200">Play at least 2 rounds</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Play a few 30-second rounds to see your multi-round progression graphs for Score,
                Hit %, and Miss %!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-100">
                  Performance Progression Across Rounds
                </h4>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-amber-400 rounded-full inline-block" />
                    <span className="text-amber-300">Score</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
                    <span className="text-emerald-300">Hit %</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-rose-400 rounded-full inline-block" />
                    <span className="text-rose-300">Miss %</span>
                  </div>
                </div>
              </div>

              {/* SVG Trend Graph */}
              <div className="relative overflow-x-auto">
                <svg viewBox="0 0 600 200" className="w-full h-auto select-none">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="580" y2="20" stroke="#1E293B" strokeWidth="1" />
                  <line x1="40" y1="80" x2="580" y2="80" stroke="#1E293B" strokeWidth="1" />
                  <line x1="40" y1="140" x2="580" y2="140" stroke="#1E293B" strokeWidth="1" />
                  <line x1="40" y1="170" x2="580" y2="170" stroke="#334155" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="32" y="24" textAnchor="end" fontSize="9" fill="#64748B" className="font-mono">
                    100%
                  </text>
                  <text x="32" y="84" textAnchor="end" fontSize="9" fill="#64748B" className="font-mono">
                    50%
                  </text>
                  <text x="32" y="144" textAnchor="end" fontSize="9" fill="#64748B" className="font-mono">
                    0%
                  </text>

                  {/* Calculate plot points */}
                  {(() => {
                    const count = chronologicalRecords.length;
                    const maxScore = Math.max(35, ...chronologicalRecords.map((r) => r.score));

                    const getX = (idx: number) => 50 + (idx / (count - 1 || 1)) * 510;
                    const getYPercent = (pct: number) => 170 - (pct / 100) * 150;
                    const getYScore = (s: number) => 170 - (s / maxScore) * 150;

                    const scorePoints = chronologicalRecords.map((r, i) => `${getX(i)},${getYScore(r.score)}`).join(' ');
                    const hitPoints = chronologicalRecords
                      .map((r, i) => `${getX(i)},${getYPercent(r.hitPercentage ?? r.accuracy)}`)
                      .join(' ');
                    const missPoints = chronologicalRecords
                      .map((r, i) => `${getX(i)},${getYPercent(r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy)))}`)
                      .join(' ');

                    return (
                      <g>
                        {/* Hit % Line */}
                        <polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          points={hitPoints}
                        />

                        {/* Miss % Line */}
                        <polyline
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          points={missPoints}
                        />

                        {/* Score Line */}
                        <polyline
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          points={scorePoints}
                        />

                        {/* Data Points */}
                        {chronologicalRecords.map((r, i) => {
                          const x = getX(i);
                          const hitY = getYPercent(r.hitPercentage ?? r.accuracy);
                          const missY = getYPercent(r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy)));
                          const scoreY = getYScore(r.score);

                          return (
                            <g key={r.id ? `trend-${r.id}-${r.roundNumber}-${i}` : `trend-${r.roundNumber}-${i}`}>
                              {/* X Axis Tick */}
                              <text
                                x={x}
                                y="186"
                                textAnchor="middle"
                                fontSize="9"
                                fill="#94A3B8"
                                className="font-mono"
                              >
                                R#{r.roundNumber}
                              </text>

                              {/* Hit Dot */}
                              <circle cx={x} cy={hitY} r="3" fill="#10B981" />
                              {/* Miss Dot */}
                              <circle cx={x} cy={missY} r="2.5" fill="#F43F5E" />
                              {/* Score Dot */}
                              <circle cx={x} cy={scoreY} r="3.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Solid Green: Hit Accuracy %</span>
                <span>Dashed Red: Miss Rate %</span>
                <span>Amber Line: Game Score (Normalized)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predefined Baseline Dataset View */}
      {activeTab === 'baseline' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-3">
            <h4 className="text-sm font-semibold text-slate-200">
              Predefined Normative Reference Baseline (N = {baselineStats.count})
            </h4>
            <p className="text-slate-400 leading-relaxed">
              These reference scores represent calibrated normative datasets of 100 historical
              30-second trials. Statistics for Score, Hit %, and Miss % are calculated against these
              distributions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Sample Size (N)</span>
                <span className="text-base font-bold font-mono text-slate-200">{baselineStats.count}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Score Mean (μ)</span>
                <span className="text-base font-bold font-mono text-amber-300">{baselineStats.mean}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Hit % Mean (μ)</span>
                <span className="text-base font-bold font-mono text-emerald-400">84.6%</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Miss % Mean (μ)</span>
                <span className="text-base font-bold font-mono text-rose-400">15.4%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
