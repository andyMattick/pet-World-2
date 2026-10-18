import React, { useState } from 'react';
import { UserStats, Achievement } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievementsCatalog';
import {
  X,
  Trophy,
  Award,
  Zap,
  Flame,
  Calendar,
  Eye,
  Activity,
  Brain,
  ShieldCheck,
  Crown,
  Sparkles,
  Layers,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface AchievementsModalProps {
  stats: UserStats;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Zap,
  Trophy,
  Layers,
  Flame,
  Award,
  Calendar,
  Eye,
  Activity,
  Brain,
  ShieldCheck,
  Crown,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  stats,
  isOpen,
  onClose,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'score' | 'streak' | 'consecutive' | 'mastery'>('all');

  if (!isOpen) return null;

  const unlockedSet = new Set(stats.unlockedAchievementIds || []);
  const unlockDates = stats.achievementUnlockDates || {};

  const filtered = ACHIEVEMENTS.filter(b => {
    if (categoryFilter === 'all') return true;
    return b.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">Neural Achievement Milestones</h3>
              <span className="text-xs text-slate-400">
                {unlockedSet.size} of {ACHIEVEMENTS.length} Badges Claimed
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto">
          {(['all', 'score', 'streak', 'consecutive', 'mastery'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Milestones' : `${cat} Badges`}
            </button>
          ))}
        </div>

        {/* Badges List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((badge) => {
              const isUnlocked = unlockedSet.has(badge.id);
              const evaluation = badge.check(stats);
              const unlockDate = unlockDates[badge.id];
              const IconComp = ICON_MAP[badge.icon] || Trophy;

              const tierStyle =
                badge.tier === 'platinum'
                  ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
                  : badge.tier === 'gold'
                  ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
                  : badge.tier === 'silver'
                  ? 'text-slate-300 border-slate-700 bg-slate-800/20'
                  : 'text-orange-400 border-orange-600/30 bg-orange-950/20';

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border transition-all flex gap-3.5 ${
                    isUnlocked
                      ? 'bg-slate-950/80 border-slate-700/80'
                      : 'bg-slate-950/40 border-slate-800/50 opacity-70'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked ? tierStyle : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <IconComp className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {badge.title}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {badge.tier}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug mb-2">
                      {badge.description}
                    </p>

                    <p className="text-[11px] text-slate-500 italic mb-2.5">
                      {badge.neurologicalBenefit}
                    </p>

                    {/* Progress Bar / Unlocked Status */}
                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          Unlocked {unlockDate ? new Date(unlockDate).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${evaluation.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {evaluation.label} ({evaluation.progress}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Badges stimulate sustained motivation through dopamine-pathway reinforcement.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
