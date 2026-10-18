import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface FlankerGameProps {
  difficulty?: string;
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface FlankerTrial {
  targetDirection: 'LEFT' | 'RIGHT';
  flankerDirection: 'LEFT' | 'RIGHT';
  isCongruent: boolean;
}

const TOTAL_TRIALS = 25;

export const FlankerTaskGame: React.FC<FlankerGameProps> = ({
  difficulty = 'standard',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [trialIndex, setTrialIndex] = useState<number>(0);
  const [currentTrial, setCurrentTrial] = useState<FlankerTrial>({
    targetDirection: 'RIGHT',
    flankerDirection: 'RIGHT',
    isCongruent: true,
  });

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Separate congruent vs incongruent reaction time tracking
  const [congruentRTs, setCongruentRTs] = useState<number[]>([]);
  const [incongruentRTs, setIncongruentRTs] = useState<number[]>([]);

  const trialStartTimeRef = useRef<number>(0);
  const isWaitingNextTrial = useRef<boolean>(false);

  const generateTrial = useCallback((): FlankerTrial => {
    const targetDir: 'LEFT' | 'RIGHT' = Math.random() < 0.5 ? 'LEFT' : 'RIGHT';
    // 50% congruent, 50% incongruent
    const isCongruent = Math.random() < 0.5;
    const flankerDir: 'LEFT' | 'RIGHT' = isCongruent
      ? targetDir
      : targetDir === 'LEFT' ? 'RIGHT' : 'LEFT';

    return {
      targetDirection: targetDir,
      flankerDirection: flankerDir,
      isCongruent,
    };
  }, []);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setTrialIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setCongruentRTs([]);
    setIncongruentRTs([]);
    isWaitingNextTrial.current = false;

    const t = generateTrial();
    setCurrentTrial(t);
    trialStartTimeRef.current = Date.now();
  };

  const handleResponse = (selectedDir: 'LEFT' | 'RIGHT') => {
    if (gameState !== 'PLAYING' || isWaitingNextTrial.current) return;
    const rt = Date.now() - trialStartTimeRef.current;
    isWaitingNextTrial.current = true;

    const isCorrect = selectedDir === currentTrial.targetDirection;

    if (isCorrect) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) playStreak();

      setCorrectCount(c => c + 1);

      if (currentTrial.isCongruent) {
        setCongruentRTs(prev => [...prev, rt]);
      } else {
        setIncongruentRTs(prev => [...prev, rt]);
      }

      const speedBonus = Math.max(0, Math.round((1200 - rt) / 10));
      setScore(s => s + 100 + speedBonus + newStreak * 5);
    } else {
      playError();
      setStreak(0);
    }

    // Brief inter-stimulus pause
    setTimeout(() => {
      advanceTrial(isCorrect, rt);
    }, 180);
  };

  const advanceTrial = (wasCorrect: boolean, lastRt: number) => {
    if (trialIndex + 1 >= TOTAL_TRIALS) {
      playVictory();
      setGameState('SUMMARY');

      const allRTs = [...congruentRTs, ...incongruentRTs, lastRt];
      const avgRt = allRTs.length > 0
        ? Math.round(allRTs.reduce((a, b) => a + b, 0) / allRTs.length)
        : 500;

      const accuracy = Math.round(((correctCount + (wasCorrect ? 1 : 0)) / TOTAL_TRIALS) * 100);

      const result: GameResult = {
        gameId: 'flanker-task',
        score: score + (wasCorrect ? 100 : 0),
        accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_TRIALS * 1.5)),
        difficulty,
        peakStreak: bestStreak,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setTrialIndex(i => i + 1);
      const nextT = generateTrial();
      setCurrentTrial(nextT);
      trialStartTimeRef.current = Date.now();
      isWaitingNextTrial.current = false;
    }
  };

  // Keyboard controls (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleResponse('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleResponse('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, currentTrial]);

  const avgCongruent = congruentRTs.length > 0
    ? Math.round(congruentRTs.reduce((a, b) => a + b, 0) / congruentRTs.length)
    : 0;

  const avgIncongruent = incongruentRTs.length > 0
    ? Math.round(incongruentRTs.reduce((a, b) => a + b, 0) / incongruentRTs.length)
    : 0;

  const flankerCost = Math.max(0, avgIncongruent - avgCongruent);

  const arrowCount = difficulty === 'dense' ? 7 : 5;
  const sideCount = Math.floor(arrowCount / 2);

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-4">
            <Eye className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Signal & Flanker (Eriksen Task)
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Pre-Supplementary Motor Area and Frontal Eye Fields (BA 6/8). Focus laser attention on the center arrow while actively inhibiting distraction from surrounding flanker arrows.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Response Rule:</p>
            <p className="text-xs text-slate-400">
              Which direction does the <span className="text-orange-400 font-bold">CENTER ARROW</span> point? Use Left/Right buttons or keyboard arrow keys.
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Trials
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Trial <strong className="text-white font-mono">{trialIndex + 1}</strong> / {TOTAL_TRIALS}</span>
              <span aria-hidden="true">·</span>
              <span>Streak: <strong className="text-orange-400 font-mono">{streak}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Stimulus Crosshair & Arrow Array */}
          <div className="h-44 md:h-56 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 my-4 shadow-inner relative">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {/* Left Flankers */}
              {Array.from({ length: sideCount }).map((_, idx) => (
                <span key={`lf-${idx}`} className="text-3xl md:text-5xl font-mono text-slate-500">
                  {currentTrial.flankerDirection === 'LEFT' ? '←' : '→'}
                </span>
              ))}

              {/* Central Target Arrow */}
              <span className="text-4xl md:text-6xl font-mono font-black text-orange-400 px-2 scale-110 drop-shadow-md">
                {currentTrial.targetDirection === 'LEFT' ? '←' : '→'}
              </span>

              {/* Right Flankers */}
              {Array.from({ length: sideCount }).map((_, idx) => (
                <span key={`rf-${idx}`} className="text-3xl md:text-5xl font-mono text-slate-500">
                  {currentTrial.flankerDirection === 'LEFT' ? '←' : '→'}
                </span>
              ))}
            </div>

            <div className="absolute bottom-4 text-xs text-slate-500">
              Focus on the bright center arrow
            </div>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleResponse('LEFT')}
              className="py-4 px-6 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer font-bold text-base active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-orange-400" />
              <span>LEFT [←]</span>
            </button>

            <button
              onClick={() => handleResponse('RIGHT')}
              className="py-4 px-6 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer font-bold text-base active:scale-95"
            >
              <span>RIGHT [→]</span>
              <ArrowRight className="w-5 h-5 text-orange-400" />
            </button>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Flanker Trial Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Pre-SMA & Saccadic Spatial Networks (BA 6/8) Stimulated</p>

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
              <span className="text-xs text-slate-400 block">Congruent RT</span>
              <span className="text-xl font-bold text-slate-200 font-mono tabular-nums">{avgCongruent} ms</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Incongruent RT</span>
              <span className="text-xl font-bold text-orange-400 font-mono tabular-nums">{avgIncongruent} ms</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
