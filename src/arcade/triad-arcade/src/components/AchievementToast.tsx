import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { Award, Sparkles, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      sounds.playVictoryFanfare();
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 text-white relative overflow-hidden flex items-start gap-3.5">
        {/* Glow backdrop */}
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shrink-0 shadow-md">
          {achievement.icon}
        </div>

        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Achievement Unlocked!</span>
          </div>
          <div className="font-display font-bold text-base text-white leading-tight mt-0.5">
            {achievement.title}
          </div>
          <div className="text-xs text-slate-300 mt-1 leading-snug">
            {achievement.description}
          </div>
          <div className="text-xs font-mono font-bold text-amber-400 mt-1.5">
            +{achievement.points} Achievement XP
          </div>
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
