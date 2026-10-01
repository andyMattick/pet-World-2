import React, { useEffect, useState } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';
import { GameState } from '../types';

interface RewardToastProps {
  notification: NonNullable<GameState['recentRewardNotification']>;
  onDismiss: () => void;
  onViewBadges: () => void;
}

export const RewardToast: React.FC<RewardToastProps> = ({
  notification,
  onDismiss,
  onViewBadges,
}) => {
  const TOTAL_DURATION_MS = 3500;
  const [remainingMs, setRemainingMs] = useState(() => {
    const elapsed = Date.now() - notification.timestamp;
    return Math.max(0, TOTAL_DURATION_MS - elapsed);
  });

  useEffect(() => {
    const updateCountdown = () => {
      const elapsed = Date.now() - notification.timestamp;
      const left = Math.max(0, TOTAL_DURATION_MS - elapsed);
      setRemainingMs(left);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 40);
    return () => clearInterval(interval);
  }, [notification.timestamp]);

  const progressPercent = Math.min(100, Math.max(0, (remainingMs / TOTAL_DURATION_MS) * 100));
  const remainingSeconds = Math.max(0, remainingMs / 1000).toFixed(1);

  return (
    <div
      id="reward-notification-toast"
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-xs sm:max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 border-2 rounded-2xl shadow-2xl backdrop-blur-md transition-all pointer-events-auto overflow-hidden animate-fade-in"
      style={{ borderColor: notification.color || '#f59e0b' }}
    >
      <div className="p-3.5 flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border shadow-inner"
          style={{
            backgroundColor: `${notification.color || '#f59e0b'}25`,
            borderColor: `${notification.color || '#f59e0b'}60`,
          }}
        >
          {notification.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Reward Unlocked!
            </span>
            <button
              type="button"
              id="close-reward-toast-btn"
              onClick={onDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss immediately"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm font-black text-slate-100 truncate mt-1">
            {notification.title}
          </div>
          <p className="text-[11px] text-slate-300 leading-tight mt-0.5 line-clamp-2">
            {notification.description}
          </p>

          {/* Visual Progress Bar Section */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Auto-clears
              </span>
              <span className="font-mono font-bold text-amber-300 text-xs">
                {remainingSeconds}s
              </span>
            </div>

            {/* Visual Progress Bar Container */}
            <div
              role="progressbar"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reward auto-clear countdown timer"
              className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-700/60 p-[1px]"
            >
              <div
                className="h-full rounded-full transition-[width] ease-linear duration-75"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: notification.color || '#f59e0b',
                  boxShadow: `0 0 10px ${notification.color || '#f59e0b'}a0`,
                }}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Milestone Perk
            </span>
            <button
              type="button"
              onClick={onViewBadges}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer hover:underline"
            >
              View Badges →
            </button>
          </div>
        </div>
      </div>

      {/* Edge accent line that also counts down */}
      <div className="w-full h-1 bg-slate-800/50 relative overflow-hidden">
        <div
          className="h-full transition-[width] ease-linear duration-75"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: notification.color || '#f59e0b',
          }}
        />
      </div>
    </div>
  );
};
