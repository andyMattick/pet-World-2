import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { paced } from '../utils/pace';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Zap, Check } from 'lucide-react';

interface StroopGameProps {
  difficulty?: string; // 'standard' | 'turbo' | 'reverse'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface ColorItem {
  id: string;
  name: string;
  hex: string;
  textColorClass: string;
}

const COLOR_PALETTE: ColorItem[] = [
  { id: 'red', name: 'RED', hex: '#ef233c', textColorClass: 'text-red-500' },
  { id: 'yellow', name: 'YELLOW', hex: '#ffe600', textColorClass: 'text-yellow-400' },
  { id: 'blue', name: 'BLUE', hex: '#2563eb', textColorClass: 'text-blue-500' },
  { id: 'green', name: 'GREEN', hex: '#16a34a', textColorClass: 'text-green-600' },
  { id: 'purple', name: 'PURPLE', hex: '#9333ea', textColorClass: 'text-purple-600' },
  { id: 'cyan', name: 'CYAN', hex: '#06b6d4', textColorClass: 'text-cyan-500' },
];

const TOTAL_TRIALS = 25;

export const StroopClashGame: React.FC<StroopGameProps> = ({
  difficulty = 'standard',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [trialIndex, setTrialIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<ColorItem>(COLOR_PALETTE[0]);
  const [currentColor, setCurrentColor] = useState<ColorItem>(COLOR_PALETTE[1]);
  const [targetRule, setTargetRule] = useState<'INK' | 'WORD'>('INK'); // In 'reverse' difficulty it can change

  // Performance metrics
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Timer & progress bar
  const stimulusStartTimeRef = useRef<number>(0);
  const [timeRemainingPercent, setTimeRemainingPercent] = useState<number>(100);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const trialDurationMs = paced(difficulty === 'turbo' ? 1600 : difficulty === 'reverse' ? 2200 : 2500);

  const generateStimulus = useCallback(() => {
    // Generate word and color with ~75% incongruency
    const wordIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
    let colorIdx = Math.floor(Math.random() * COLOR_PALETTE.length);

    if (Math.random() < 0.75) {
      while (colorIdx === wordIdx) {
        colorIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
      }
    }

    const nextRule: 'INK' | 'WORD' = difficulty === 'reverse' && Math.random() < 0.35 ? 'WORD' : 'INK';

    setCurrentWord(COLOR_PALETTE[wordIdx]);
    setCurrentColor(COLOR_PALETTE[colorIdx]);
    setTargetRule(nextRule);
    stimulusStartTimeRef.current = Date.now();
    setTimeRemainingPercent(100);
  }, [difficulty]);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setTrialIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setReactionTimes([]);
    generateStimulus();
  };

  // Timer tick for the current trial
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - stimulusStartTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / trialDurationMs) * 100);
      setTimeRemainingPercent(remaining);

      if (elapsed >= trialDurationMs) {
        // Time out count as error
        handleTimeout();
      }
    }, 40);

    timerIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [gameState, trialIndex, trialDurationMs]);

  const handleTimeout = () => {
    playError();
    setStreak(0);
    advanceTrial(false, trialDurationMs);
  };

  const handleColorChoice = (selectedColorId: string) => {
    const elapsed = Date.now() - stimulusStartTimeRef.current;
    const targetId = targetRule === 'INK' ? currentColor.id : currentWord.id;
    const isCorrect = selectedColorId === targetId;

    if (isCorrect) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) playStreak();

      setCorrectCount(c => c + 1);

      // Speed bonus: faster reaction gives more points
      const speedMultiplier = Math.max(1, Math.round((trialDurationMs - elapsed) / 200));
      const points = 100 + speedMultiplier * 10 + newStreak * 5;
      setScore(s => s + points);
    } else {
      playError();
      setStreak(0);
    }

    advanceTrial(isCorrect, elapsed);
  };

  const advanceTrial = (wasCorrect: boolean, rt: number) => {
    setReactionTimes(prev => [...prev, rt]);

    if (trialIndex + 1 >= TOTAL_TRIALS) {
      // Game over
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round((reactionTimes.reduce((a, b) => a + b, 0) + rt) / (reactionTimes.length + 1))
        : 600;

      const finalAccuracy = Math.round(((correctCount + (wasCorrect ? 1 : 0)) / TOTAL_TRIALS) * 100);

      const result: GameResult = {
        gameId: 'stroop-clash',
        score: score + (wasCorrect ? 100 : 0),
        accuracy: finalAccuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_TRIALS * trialDurationMs) / 1000),
        difficulty,
        peakStreak: bestStreak,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setTrialIndex(i => i + 1);
      generateStimulus();
    }
  };

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
            <Zap className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Stroop Color Clash
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Anterior Cingulate Cortex (BA 24/32) by overriding the brain's automatic reading impulse. Identify the visual ink color without letting the printed word interfere.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Golden Rule:</p>
            <p className="text-xs text-slate-400">
              Name the <span className="text-rose-400 font-semibold">INK COLOR</span>, never what the word spells. Respond with maximum velocity!
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Challenge
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          {/* Header metrics */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Stimulus <strong className="text-white font-mono">{trialIndex + 1}</strong> / {TOTAL_TRIALS}</span>
              <span aria-hidden="true">·</span>
              <span>Streak: <strong className="text-amber-400 font-mono">{streak}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Time fuse bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full transition-all duration-75 ${
                timeRemainingPercent > 35 ? 'bg-indigo-500' : 'bg-rose-500'
              }`}
              style={{ width: `${timeRemainingPercent}%` }}
            />
          </div>

          {/* Prompt rule reminder */}
          <div className="text-center mb-4">
            <span className="text-xs tracking-wider uppercase text-slate-400">
              {targetRule === 'INK' ? 'Select Font Color' : 'Select Word Meaning'}
            </span>
          </div>

          {/* Central Stimulus Display */}
          <div className="h-44 md:h-52 flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 my-4 shadow-inner">
            <span
              className="text-4xl md:text-6xl font-black tracking-tight transition-transform duration-100"
              style={{ color: currentColor.hex }}
            >
              {currentWord.name}
            </span>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChoice(color.id)}
                className="py-3.5 px-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Inhibition Test Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Anterior Cingulate Cortex (BA 24/32) Stimulated</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {Math.round((correctCount / TOTAL_TRIALS) * 100)}%
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Avg Reaction</span>
              <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">
                {avgReactionTime} ms
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Peak Streak</span>
              <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">{bestStreak}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
