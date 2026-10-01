import React, { useState } from 'react';
import { ProblemRecord } from '../types';
import { OPERATION_META } from '../game/mathChallenge';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  X, 
  RefreshCw, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface MathReportCardModalProps {
  isOpen: boolean;
  history: ProblemRecord[];
  score: number;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const MathReportCardModal: React.FC<MathReportCardModalProps> = ({
  isOpen,
  history,
  score,
  onClose,
  onOpenSettings,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CORRECT' | 'WRONG'>('ALL');
  const [copied, setCopied] = useState(false);
  const [practiceProblem, setPracticeProblem] = useState<ProblemRecord | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

  if (!isOpen) return null;

  const totalAttempted = history.length;
  const correctCount = history.filter(p => p.isCorrect).length;
  const wrongCount = totalAttempted - correctCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const totalMathPoints = history.reduce((sum, p) => sum + p.bonusPoints, 0);

  // Determine Mastery Rank
  let rankTitle = 'Cabin Boy Apprentice';
  let rankBadge = '⚓ Novice';
  let rankColor = 'text-slate-400';

  if (totalAttempted === 0) {
    rankTitle = 'Fleet Observer';
    rankBadge = 'No Ciphers Attempted Yet';
  } else if (accuracy >= 90 && totalAttempted >= 4) {
    rankTitle = 'Grand Pirate Math Admiral';
    rankBadge = '🌟 High Seas Master';
    rankColor = 'text-amber-300';
  } else if (accuracy >= 75) {
    rankTitle = 'Sharp-Eyed Quartermaster';
    rankBadge = '🧭 Skilled Navigator';
    rankColor = 'text-sky-300';
  } else if (accuracy >= 50) {
    rankTitle = 'Able-Bodied Boatswain';
    rankBadge = '⚔️ Practicing Sailor';
    rankColor = 'text-emerald-300';
  }

  const filteredHistory = history.filter(p => {
    if (filter === 'CORRECT') return p.isCorrect;
    if (filter === 'WRONG') return !p.isCorrect;
    return true;
  });

  const handleCopyReport = () => {
    soundEngine.playClick();
    const dateStr = new Date().toLocaleDateString();
    const summary = [
      `🏴‍☠️ CORSAIR'S COVE - MATH REPORT CARD (${dateStr})`,
      `=========================================`,
      `Mastery Rank: ${rankTitle} (${rankBadge})`,
      `Overall Accuracy: ${accuracy}% (${correctCount} of ${totalAttempted} solved)`,
      `Bonus Doubloons Earned: +${totalMathPoints.toLocaleString()} pts`,
      `Final Game Plunder: ${score.toLocaleString()} pts`,
      ``,
      `--- PROBLEM BREAKDOWN ---`,
      ...history.map((p, idx) => {
        const status = p.isCorrect ? '✅ CORRECT' : p.forfeited ? '⚠️ FORFEITED' : '❌ MISSED';
        return `${idx + 1}. [${p.operation}] ${p.question} = ${p.correctAnswer} (${status}) | Your Answer: ${p.userAnswer ?? 'None'} | ${p.difficultyName}`;
      }),
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!practiceProblem) return;
    const parsed = parseInt(practiceAnswer.trim(), 10);
    if (parsed === practiceProblem.correctAnswer) {
      setPracticeFeedback('CORRECT');
      soundEngine.playPuzzleSuccess();
    } else {
      setPracticeFeedback('WRONG');
      soundEngine.playPuzzleFail();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-amber-500/20 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-serif text-amber-300">
                Math Session Report Card
              </h2>
              <p className="text-xs text-slate-400">
                Performance review, educational breakdowns & practice drills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Executive Overview Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                Earned Rank & Title
              </div>
              <div className={`text-lg sm:text-xl font-black font-serif ${rankColor}`}>
                {rankTitle}
              </div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">
                {rankBadge}
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  {accuracy}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {correctCount}/{totalAttempted} solved
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Math Bonus</div>
                <div className="text-lg font-black font-mono text-amber-300">
                  +{totalMathPoints.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">pts added</div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  filter === 'ALL'
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({totalAttempted})
              </button>
              <button
                type="button"
                onClick={() => setFilter('CORRECT')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  filter === 'CORRECT'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Correct ({correctCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('WRONG')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  filter === 'WRONG'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Review ({wrongCount})
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyReport}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  Copy Report for Teacher
                </>
              )}
            </button>
          </div>

          {/* Interactive Practice Drill Popup (if triggered) */}
          {practiceProblem && (
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-amber-500/50 shadow-xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Practice Drill: Master This Problem
                </span>
                <button
                  onClick={() => { setPracticeProblem(null); setPracticeFeedback('IDLE'); }}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  Close Drill ✕
                </button>
              </div>

              <div className="text-base sm:text-lg font-black font-mono text-slate-100">
                {practiceProblem.question} = ?
              </div>

              <form onSubmit={handlePracticeSubmit} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Enter answer..."
                  value={practiceAnswer}
                  onChange={e => setPracticeAnswer(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-amber-300 w-36 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  Check
                </button>
              </form>

              {practiceFeedback === 'CORRECT' && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Splendid work! You solved it correctly: <strong>{practiceProblem.correctAnswer}</strong></span>
                </div>
              )}

              {practiceFeedback === 'WRONG' && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Not quite! Hint: {practiceProblem.hint}</span>
                </div>
              )}
            </div>
          )}

          {/* Problem Records List */}
          {history.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl p-6">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="font-bold text-slate-400 text-sm">No Ciphers Encountered Yet</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                During your heist, collect power-up bottles and kegs to unlock and solve math ciphers!
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No problems match this filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item, idx) => {
                const meta = OPERATION_META[item.operation];

                return (
                  <div
                    key={item.id || idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isCorrect
                        ? 'bg-slate-950/60 border-slate-800/90'
                        : 'bg-rose-950/20 border-rose-800/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{ backgroundColor: `${meta?.color || '#38bdf8'}22`, color: meta?.color || '#38bdf8' }}
                        >
                          {meta?.label || item.operation}
                        </span>
                        <span className="text-xs font-mono font-black text-amber-300">
                          {item.question}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.difficultyName}
                        </span>
                        {item.isCorrect ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 font-bold">
                            +{item.bonusPoints} pts
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/50 text-rose-300 font-bold">
                            {item.forfeited ? 'Forfeited' : 'Missed'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answers Comparison */}
                    <div className="bg-slate-900/90 rounded-lg p-2.5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-800/60 mb-2">
                      <div>
                        <span className="text-slate-400">Your Answer: </span>
                        <span className={`font-mono font-bold ${item.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {item.userAnswer !== null ? item.userAnswer : '(None / Forfeited)'}
                        </span>
                        {item.attempts > 1 && (
                          <span className="text-[10px] text-slate-500 ml-1">
                            ({item.attempts} tries)
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400">Correct Answer: </span>
                        <span className="font-mono font-bold text-amber-300">
                          {item.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Educational Step-by-Step Explanation */}
                    <div className="text-[11px] text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40 leading-relaxed">
                      <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-sky-400" /> Educational Solution
                      </div>
                      <div className="whitespace-pre-line text-slate-300">
                        {item.explanation}
                      </div>
                    </div>

                    {/* Action to Practice Missed Problem */}
                    {!item.isCorrect && (
                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setPracticeProblem(item);
                            setPracticeAnswer('');
                            setPracticeFeedback('IDLE');
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" /> Practice this problem now
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Adjust Math Curriculum
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors ml-auto"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
