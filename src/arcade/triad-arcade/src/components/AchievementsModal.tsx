import React, { useState } from 'react';
import { Achievement, AchievementCategory } from '../types';
import { Trophy, CheckCircle2, Lock, X, Award, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  const [filter, setFilter] = useState<AchievementCategory>('ALL');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalScore = achievements
    .filter((a) => a.isUnlocked)
    .reduce((acc, cur) => acc + cur.points, 0);
  const maxPossibleScore = achievements.reduce((acc, cur) => acc + cur.points, 0);

  const filtered = achievements.filter((a) => {
    if (filter === 'ALL') return true;
    return a.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Arcade Hall of Honors</h3>
              <p className="text-xs text-slate-400">
                Persistent milestones across Bingo, Casino War &amp; Memory Match
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Career Trophy Bar */}
        <div className="my-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Achievements Unlocked
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {unlockedCount} <span className="text-sm font-normal text-slate-500">/ {achievements.length}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Achievement Score
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
              {totalScore.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ {maxPossibleScore.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 shrink-0">
          {(['ALL', 'BINGO', 'WAR', 'MEMORY', 'GENERAL'] as AchievementCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setFilter(cat);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filter === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL'
                ? 'All Badges'
                : cat === 'BINGO'
                ? 'Bingo'
                : cat === 'WAR'
                ? 'Casino War'
                : cat === 'MEMORY'
                ? 'Memory'
                : 'General'}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                ach.isUnlocked
                  ? 'bg-slate-950/70 border-amber-500/40 text-white shadow-xs'
                  : 'bg-slate-950/30 border-slate-800/80 text-slate-400 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    ach.isUnlocked
                      ? 'bg-amber-500/20 border-amber-400/50 shadow-inner'
                      : 'bg-slate-800/60 border-slate-700/60 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-white">
                      {ach.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{ach.points} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {ach.description}
                  </p>

                  {/* Progress tracker if multi-step and locked */}
                  {!ach.isUnlocked && ach.maxProgress > 1 && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Progress:</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span>{ach.progress}/{ach.maxProgress}</span>
                    </div>
                  )}

                  {ach.isUnlocked && ach.unlockedAt && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Unlocked on {ach.unlockedAt}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 self-center">
                {ach.isUnlocked ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-3 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
