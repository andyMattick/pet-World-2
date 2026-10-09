import React from 'react';
import { DailyChallengeState, GameMode } from '../types';
import { Calendar, CheckCircle2, Trophy, X, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DailyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: DailyChallengeState;
  onNavigateToMode: (mode: GameMode) => void;
}

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  isOpen,
  onClose,
  state,
  onNavigateToMode,
}) => {
  if (!isOpen) return null;

  const completedCount = state.challenges.filter((c) => c.isCompleted).length;
  const isAllDone = state.allCompleted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Daily Arcade Challenges</h3>
              <p className="text-xs text-slate-400">Complete all 3 objectives for a +2,500 XP trophy bonus</p>
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

        {/* Progress Tracker Bar */}
        <div className="my-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300">Daily Mission Progress</span>
            <span className="font-mono font-bold text-amber-400">{completedCount} / 3 Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
          {isAllDone && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>All daily missions achieved! +2,500 Grand Bonus added to profile!</span>
            </div>
          )}
        </div>

        {/* Challenge Cards List */}
        <div className="space-y-3">
          {state.challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                challenge.isCompleted
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{challenge.badgeIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{challenge.title}</span>
                    <span className="text-[11px] font-mono text-amber-400">
                      +{challenge.rewardPoints} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{challenge.description}</p>
                </div>
              </div>

              <div>
                {challenge.isCompleted ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      onNavigateToMode(challenge.mode);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Play</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Resets every 24 hours at midnight</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
