import React from 'react';
import { DynamicDailyWorkout } from '../utils/dailyWorkoutEngine';
import {
  X,
  Play,
  CheckCircle2,
  Zap,
  Sparkles,
  Check,
  RotateCcw,
  Compass,
  Calendar,
} from 'lucide-react';

interface DailyRegimenProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCircuitGame: (gameId: string, difficulty?: string) => void;
  dailyCompleted: boolean;
  completedGameIds: string[];
  workout: DynamicDailyWorkout;
  onOpenWarmup?: () => void;
}

export const DailyRegimenModal: React.FC<DailyRegimenProps> = ({
  isOpen,
  onClose,
  onStartCircuitGame,
  dailyCompleted,
  completedGameIds = [],
  workout,
  onOpenWarmup,
}) => {
  if (!isOpen) return null;

  const circuitSteps = workout.steps;
  const completedCount = circuitSteps.filter(g => completedGameIds.includes(g.gameId)).length;
  const isAllFinished = completedCount === circuitSteps.length || dailyCompleted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Adaptive Neuro Workout</h3>
              <span className="text-xs text-slate-400">
                Customized daily for your neural profile & deficit targets
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Today's Theme & Adaptation Reason Banner */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{workout.themeTitle}</span>
              </div>
              <span className="font-mono text-slate-400">
                {completedCount} / {circuitSteps.length} Steps Done
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {workout.themeDescription}
            </p>

            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / circuitSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pre-Workout Warm-Up Primer Callout */}
          {onOpenWarmup && (
            <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Pre-Workout Neural Warm-Up</span>
                    <span className="text-[10px] text-amber-400 font-mono font-medium bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                      3 micro-tasks · 2 min
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Prime ocular saccades, alpha rhythms, and working memory before Step 1.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenWarmup();
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer shadow-sm shadow-amber-500/20"
              >
                Warm Up Now
              </button>
            </div>
          )}

          <div className="space-y-3">
            {circuitSteps.map((step, idx) => {
              const isDone = completedGameIds.includes(step.gameId);

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full text-xs font-mono flex items-center justify-center font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `0${idx + 1}`}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                          {isDone ? (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              Credited Today
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400">
                              ~{step.time}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{step.role} · {step.region}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onStartCircuitGame(step.gameId, step.recommendedDifficulty);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        isDone
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                      }`}
                    >
                      {isDone ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                      <span>{isDone ? 'Replay' : 'Play Step'}</span>
                    </button>
                  </div>

                  {/* Why this game was selected for you */}
                  <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{step.selectionReason}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {isAllFinished ? (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                All 3 circuit steps completed & verified! Tomorrow's workout will automatically rotate to new neural pathways.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Daily workouts adapt daily to prevent cognitive plateaus and target your least stimulated regions.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{isAllFinished ? '✓ Today\'s circuit credited' : `${circuitSteps.length - completedCount} steps remaining`}</span>
          <button
            onClick={() => {
              onClose();
              const nextUnfinished = circuitSteps.find(g => !completedGameIds.includes(g.gameId)) || circuitSteps[0];
              onStartCircuitGame(nextUnfinished.gameId, nextUnfinished.recommendedDifficulty);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            {isAllFinished ? 'Review Exercises' : 'Play Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};
