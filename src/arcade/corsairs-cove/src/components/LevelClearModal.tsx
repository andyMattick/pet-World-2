import React from 'react';
import { LevelClearSummary } from '../types';
import { Trophy, Timer, Zap, Target, ArrowRight, Award, GraduationCap, Sparkles } from 'lucide-react';

interface LevelClearModalProps {
  summary: LevelClearSummary | null;
  onAdvance: () => void;
  onOpenReport: () => void;
  onOpenSettings: () => void;
}

export const LevelClearModal: React.FC<LevelClearModalProps> = ({
  summary,
  onAdvance,
  onOpenReport,
  onOpenSettings,
}) => {
  if (!summary) return null;

  return (
    <div
      id="level-clear-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-1 animate-bounce">🏆</div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            Island #{summary.level} Conquered
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 font-serif tracking-wide">
            {summary.islandName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All doubloons swept! The fleet salutes yer maritime navigation & quick arithmetic.
          </p>
        </div>

        {/* Speed Bounty Performance Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Speed Bounty
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs">
              <span>{summary.speedMedalEmoji}</span>
              <span>{summary.speedRank} Rank</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Clear Time</div>
              <div className="text-base sm:text-lg font-mono font-black text-slate-100">
                {summary.elapsedSeconds}s
              </div>
              <div className="text-[10px] text-slate-500">Par: {summary.parTimeSeconds}s</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Speed Rating</div>
              <div className="text-base sm:text-lg font-mono font-black text-sky-400">
                {summary.elapsedSeconds <= summary.parTimeSeconds ? (
                  <span className="text-emerald-400">Under Par</span>
                ) : (
                  <span className="text-amber-400">Over Par</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">
                {Math.abs(summary.parTimeSeconds - summary.elapsedSeconds)}s {summary.elapsedSeconds <= summary.parTimeSeconds ? 'faster' : 'slower'}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Bounty Doubloons</div>
              <div className="text-base sm:text-lg font-mono font-black text-amber-300">
                +{summary.speedBounty.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-500">Bonus Gold</div>
            </div>
          </div>
        </div>

        {/* Level Math Performance Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
            <span className="font-bold text-sky-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-sky-400" /> Math Mastery (Island #{summary.level})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {summary.mathSolvedThisLevel} / 10 Ciphers
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Ciphers Solved</div>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400">
                {summary.mathSolvedThisLevel} <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Accuracy</div>
              <div className="text-base sm:text-lg font-mono font-black text-sky-400">
                {summary.mathAccuracyPct}%
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Avg Answer Speed</div>
              <div className="text-base sm:text-lg font-mono font-black text-amber-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{summary.avgAnswerSpeedSeconds > 0 ? `${summary.avgAnswerSpeedSeconds}s` : '—'}</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 p-2 rounded-lg bg-sky-950/40 border border-sky-800/30 text-[11px] text-sky-200 text-center">
            ⚓ <strong>Level Milestone Reset:</strong> On the next island, question milestones reset to 0 so you can unlock 10 brand-new in-game rewards!
          </div>
        </div>

        {/* Up Next: New Features & Unlocks */}
        <div className="bg-slate-950/90 border border-purple-500/40 rounded-xl p-3.5 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Up Next: Island #{summary.nextLevelNumber}
          </div>
          <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>{summary.nextIslandName}</span>
            <span className="text-xs font-medium text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
              {summary.nextMathDifficultyName}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-300 bg-purple-950/30 border border-purple-800/30 rounded-lg p-2 flex items-center gap-2">
            <span className="text-base">🎁</span>
            <div>
              <div className="text-[10px] text-purple-300 uppercase font-semibold">New Feature Introduced:</div>
              <div className="font-semibold text-slate-200">{summary.nextUnlockedFeature}</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            id="advance-level-btn"
            onClick={onAdvance}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Set Sail to Next Island!</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenReport}
              className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Session Report</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
