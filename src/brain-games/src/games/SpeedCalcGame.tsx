import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Calculator, X } from 'lucide-react';

interface SpeedCalcProps {
  difficulty?: string; // 'foundational' | 'intermediate' | 'expert'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface EquationProblem {
  expression: string;
  displayedResult: number;
  isActuallyTrue: boolean;
}

const TOTAL_PROBLEMS = 20;

export const SpeedCalcGame: React.FC<SpeedCalcProps> = ({
  difficulty = 'intermediate',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [problemIndex, setProblemIndex] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<EquationProblem>({
    expression: '12 + 15',
    displayedResult: 27,
    isActuallyTrue: true,
  });

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const problemStartTimeRef = useRef<number>(0);
  const [timeRemainingPercent, setTimeRemainingPercent] = useState<number>(100);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeLimitMs = difficulty === 'expert' ? 2200 : difficulty === 'foundational' ? 4000 : 3000;

  const generateProblem = useCallback((): EquationProblem => {
    let a = 0;
    let b = 0;
    let op = '+';
    let realResult = 0;

    const opType = difficulty === 'foundational'
      ? (Math.random() < 0.6 ? '+' : '-')
      : difficulty === 'intermediate'
      ? (['+', '-', '*'][Math.floor(Math.random() * 3)])
      : (['+', '-', '*', '/'][Math.floor(Math.random() * 4)]);

    if (opType === '+') {
      a = Math.floor(Math.random() * 45) + 6;
      b = Math.floor(Math.random() * 45) + 6;
      op = '+';
      realResult = a + b;
    } else if (opType === '-') {
      a = Math.floor(Math.random() * 60) + 20;
      b = Math.floor(Math.random() * (a - 5)) + 4;
      op = '−';
      realResult = a - b;
    } else if (opType === '*') {
      a = Math.floor(Math.random() * 11) + 3;
      b = Math.floor(Math.random() * 11) + 3;
      op = '×';
      realResult = a * b;
    } else {
      // Division
      b = Math.floor(Math.random() * 8) + 2;
      realResult = Math.floor(Math.random() * 12) + 2;
      a = b * realResult;
      op = '÷';
    }

    const isTrue = Math.random() < 0.5;
    let displayed = realResult;
    if (!isTrue) {
      const offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      displayed = realResult + offset;
      if (displayed === realResult) displayed += 2;
    }

    return {
      expression: `${a} ${op} ${b}`,
      displayedResult: displayed,
      isActuallyTrue: isTrue,
    };
  }, [difficulty]);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setProblemIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setReactionTimes([]);

    const p = generateProblem();
    setCurrentProblem(p);
    problemStartTimeRef.current = Date.now();
    setTimeRemainingPercent(100);
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - problemStartTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / timeLimitMs) * 100);
      setTimeRemainingPercent(remaining);

      if (elapsed >= timeLimitMs) {
        handleTimeout();
      }
    }, 40);

    timerIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState, problemIndex, timeLimitMs]);

  const handleTimeout = () => {
    playError();
    setStreak(0);
    advanceProblem(false, timeLimitMs);
  };

  const handleAnswer = (userSaysTrue: boolean) => {
    const elapsed = Date.now() - problemStartTimeRef.current;
    const isCorrect = userSaysTrue === currentProblem.isActuallyTrue;

    if (isCorrect) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) playStreak();

      setCorrectCount(c => c + 1);
      const speedBonus = Math.max(0, Math.round((timeLimitMs - elapsed) / 25));
      setScore(s => s + 100 + speedBonus + newStreak * 10);
    } else {
      playError();
      setStreak(0);
    }

    advanceProblem(isCorrect, elapsed);
  };

  const advanceProblem = (wasCorrect: boolean, rt: number) => {
    setReactionTimes(prev => [...prev, rt]);

    if (problemIndex + 1 >= TOTAL_PROBLEMS) {
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round((reactionTimes.reduce((a, b) => a + b, 0) + rt) / (reactionTimes.length + 1))
        : 850;

      const accuracy = Math.round(((correctCount + (wasCorrect ? 1 : 0)) / TOTAL_PROBLEMS) * 100);

      const result: GameResult = {
        gameId: 'speed-calc',
        score: score + (wasCorrect ? 100 : 0),
        accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_PROBLEMS * timeLimitMs) / 1000),
        difficulty,
        peakStreak: bestStreak,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setProblemIndex(i => i + 1);
      const nextP = generateProblem();
      setCurrentProblem(nextP);
      problemStartTimeRef.current = Date.now();
      setTimeRemainingPercent(100);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
            <Calculator className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Speed Calculation ({difficulty})
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Left Intraparietal Sulcus and Angular Gyrus (BA 39/40). Rapidly verify arithmetic truth under time pressure to accelerate numerical working memory.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Task Protocol:</p>
            <p className="text-xs text-slate-400">
              Is the equation TRUE or FALSE? Respond before the timer fuse burns out.
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Calculation
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Equation <strong className="text-white font-mono">{problemIndex + 1}</strong> / {TOTAL_PROBLEMS}</span>
              <span aria-hidden="true">·</span>
              <span>Streak: <strong className="text-cyan-400 font-mono">{streak}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Time Fuse */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full transition-all duration-75 ${
                timeRemainingPercent > 35 ? 'bg-cyan-500' : 'bg-rose-500'
              }`}
              style={{ width: `${timeRemainingPercent}%` }}
            />
          </div>

          {/* Math Problem Display */}
          <div className="h-44 md:h-52 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 my-4 shadow-inner">
            <div className="text-3xl md:text-5xl font-mono font-bold tracking-wider text-slate-100 mb-2">
              {currentProblem.expression} = <span className="text-cyan-400">{currentProblem.displayedResult}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Verify mathematically</span>
          </div>

          {/* True / False Decision Controls */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleAnswer(false)}
              className="py-4 px-6 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-base active:scale-95"
            >
              <X className="w-5 h-5" />
              FALSE
            </button>

            <button
              onClick={() => handleAnswer(true)}
              className="py-4 px-6 rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-base active:scale-95"
            >
              <Check className="w-5 h-5" />
              TRUE
            </button>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Calculation Run Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Left Intraparietal Sulcus (BA 39/40) Stimulated</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {Math.round((correctCount / TOTAL_PROBLEMS) * 100)}%
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Max Streak</span>
              <span className="text-xl font-bold text-cyan-400 font-mono tabular-nums">{bestStreak}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Avg Time</span>
              <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">
                {reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0} ms
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
