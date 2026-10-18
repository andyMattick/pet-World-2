import React from 'react';
import { UserStats, Achievement } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievementsCatalog';
import {
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
  ChevronRight,
} from 'lucide-react';

interface AchievementsShowcaseProps {
  stats: UserStats;
  onOpenAchievementsModal: () => void;
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

export const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  stats,
  onOpenAchievementsModal,
}) => {
  const unlockedSet = new Set(stats.unlockedAchievementIds || []);
  const unlockedCount = unlockedSet.size;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">Milestone Badges & Neural Honors</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Earned by hitting score thresholds, streak lengths, and consecutive training check-ins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400">
            <span className="text-white font-bold tabular-nums">{unlockedCount}</span> / {totalCount} Unlocked
          </div>

          <button
            onClick={onOpenAchievementsModal}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges Grid / Horizontal Rack */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {ACHIEVEMENTS.slice(0, 6).map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const evaluation = badge.check(stats);
          const IconComp = ICON_MAP[badge.icon] || Trophy;

          // Tier color schemes
          const tierBorder =
            badge.tier === 'platinum'
              ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20'
              : badge.tier === 'gold'
              ? 'border-amber-500/40 text-amber-400 bg-amber-950/20'
              : badge.tier === 'silver'
              ? 'border-slate-400/40 text-slate-300 bg-slate-800/30'
              : 'border-orange-600/40 text-orange-400 bg-orange-950/20';

          return (
            <div
              key={badge.id}
              onClick={onOpenAchievementsModal}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center group relative ${
                isUnlocked
                  ? `${tierBorder} hover:scale-[1.02] shadow-sm`
                  : 'bg-slate-950/60 border-slate-800/60 text-slate-600 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                  isUnlocked
                    ? badge.tier === 'platinum'
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/30'
                      : badge.tier === 'gold'
                      ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/30'
                      : badge.tier === 'silver'
                      ? 'bg-slate-700/50 text-slate-200'
                      : 'bg-orange-600/20 text-orange-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-700'
                }`}
              >
                {isUnlocked ? (
                  <IconComp className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <span
                className={`text-xs font-semibold tracking-tight line-clamp-1 ${
                  isUnlocked ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'
                }`}
              >
                {badge.title}
              </span>

              <span className="text-[10px] text-slate-500 font-mono mt-1">
                {isUnlocked ? 'Unlocked' : evaluation.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
