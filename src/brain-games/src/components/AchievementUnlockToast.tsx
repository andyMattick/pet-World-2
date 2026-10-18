import React from 'react';
import { Achievement } from '../types/game';
import { Trophy, X, Sparkles } from 'lucide-react';

interface ToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlockToast: React.FC<ToastProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>Achievement Unlocked!</span>
          </div>

          <h4 className="text-sm font-bold text-white truncate">
            {achievement.title}
          </h4>

          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            {achievement.description}
          </p>

          <span className="text-[10px] text-slate-500 block mt-1 italic">
            {achievement.neurologicalBenefit}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
