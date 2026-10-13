import React from 'react';
import { X, Award, Crosshair, Footprints, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { PlayerStats, LevelConfig } from '../types/game';
import { CAMPAIGN_LEVELS } from '../utils/minefield';

interface FieldIntelModalProps {
  stats: PlayerStats;
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const FieldIntelModal: React.FC<FieldIntelModalProps> = ({
  stats,
  currentLevelIndex,
  onSelectLevel,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-amber-400">
              FIELD INTELLIGENCE DOSSIER
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Operational track record and sector clearance logs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 shrink-0">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sectors Cleared</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {stats.levelsCompleted} / {CAMPAIGN_LEVELS.length}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Mines Disarmed</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {stats.totalMinesDefused}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Medals Earned</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {stats.medalsEarnedCount ?? 0}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>Intel XP</span>
            </div>
            <div className="text-lg font-bold font-mono text-yellow-400 tabular-nums">
              {stats.intelPoints}
            </div>
          </div>
        </div>

        {/* Sector Selection List */}
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono shrink-0">
          Campaign Operations:
        </h3>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {CAMPAIGN_LEVELS.map((level, idx) => {
            const isUnlocked = idx <= Math.max(stats.levelsCompleted, currentLevelIndex);
            const isCompleted = idx < stats.levelsCompleted;
            const isCurrent = idx === currentLevelIndex;
            const highScore = stats.highScores[level.id];

            return (
              <div
                key={level.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/60 shadow-xs'
                    : isUnlocked
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isUnlocked
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {isCompleted ? '✓' : isUnlocked ? idx + 1 : <Lock className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{level.title}</span>
                      <span className="text-amber-400 font-mono">[{level.codename}]</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {level.width}×{level.height} Field · {level.mineCount} Mines · {level.cratesCount} Air Crates
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {highScore && (
                    <div className="hidden sm:block text-right font-mono text-[11px] text-slate-400">
                      <div>Best: {highScore.time}s</div>
                      <div className="text-amber-400">{'★'.repeat(highScore.stars)}</div>
                    </div>
                  )}

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        onSelectLevel(idx);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Deploy'}
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-600 px-2.5 py-1">Classified</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
