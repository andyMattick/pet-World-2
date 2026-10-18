import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { paced } from '../utils/pace';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

interface GoNoGoProps {
  difficulty?: string; // 'standard' | 'high-speed' | 'rare-target'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface TrialStimulus {
  type: 'GO' | 'NOGO';
  colorHex: string;
  symbol: string;
}

const TOTAL_TRIALS = 30;

export const GoNoGoGame: React.FC<GoNoGoProps> = ({
  difficulty = 'standard',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [trialIndex, setTrialIndex] = useState<number>(0);
  const [currentStim, setCurrentStim] = useState<TrialStimulus | null>(null);
  const [hasResponded, setHasResponded] = useState<boolean>(false);

  // Performance metrics
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [goHits, setGoHits] = useState<number>(0);
  const [goMisses, setGoMisses] = useState<number>(0); // Omission error
  const [noGoFalseAlarms, setNoGoFalseAlarms] = useState<number>(0); // Commission error
  const [noGoCorrectWithholds, setNoGoCorrectWithholds] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const trialStartTimeRef = useRef<number>(0);
  const trialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stimulusDurationMs = paced(difficulty === 'high-speed' ? 650 : 850);
  const interStimulusIntervalMs = 400;

  // Generate trial with ~75% GO stimuli and ~25% NO-GO stimuli
  const generateStimulus = useCallback((): TrialStimulus => {
    const isNoGo = Math.random() < 0.25;
    if (isNoGo) {
      return {
        type: 'NOGO',
        colorHex: '#ef4444',
        symbol: 'STOP',
      };
    }
    return {
      type: 'GO',
      colorHex: '#22c55e',
      symbol: 'GO',
    };
  }, []);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setTrialIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setGoHits(0);
    setGoMisses(0);
    setNoGoFalseAlarms(0);
    setNoGoCorrectWithholds(0);
    setReactionTimes([]);
    setHasResponded(false);
    runTrial(0);
  };

  const runTrial = (idx: number) => {
    setHasResponded(false);
    const stim = generateStimulus();
    setCurrentStim(stim);
    trialStartTimeRef.current = Date.now();

    // Trial window
    trialTimeoutRef.current = setTimeout(() => {
      // Evaluate end of window if user didn't tap
      evaluateTrialEnd(stim, false, stimulusDurationMs);
    }, stimulusDurationMs);
  };

  const handleTap = () => {
    if (gameState !== 'PLAYING' || hasResponded || !currentStim) return;
    setHasResponded(true);
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);

    const rt = Date.now() - trialStartTimeRef.current;

    if (currentStim.type === 'GO') {
      // Correct GO tap!
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) playStreak();

      setGoHits(h => h + 1);
      setReactionTimes(prev => [...prev, rt]);

      const speedBonus = Math.max(0, Math.round((stimulusDurationMs - rt) / 10));
      setScore(s => s + 50 + speedBonus + newStreak * 5);
    } else {
      // Commission error (Tapped on NO-GO!)
      playError();
      setStreak(0);
      setNoGoFalseAlarms(fa => fa + 1);
      setScore(s => Math.max(0, s - 40));
    }

    // Schedule next trial
    setTimeout(advanceToNextTrial, interStimulusIntervalMs);
  };

  const evaluateTrialEnd = (stim: TrialStimulus, userTapped: boolean, rt: number) => {
    if (!userTapped) {
      if (stim.type === 'NOGO') {
        // Correctly withheld response!
        setNoGoCorrectWithholds(w => w + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        setScore(s => s + 40 + newStreak * 2);
      } else {
        // Omission error (Missed a GO target)
        playError();
        setStreak(0);
        setGoMisses(m => m + 1);
      }
    }

    setTimeout(advanceToNextTrial, interStimulusIntervalMs);
  };

  const advanceToNextTrial = () => {
    setCurrentStim(null);
    setTrialIndex(i => {
      const nextIdx = i + 1;
      if (nextIdx >= TOTAL_TRIALS) {
        finishGame();
        return i;
      }
      setTimeout(() => runTrial(nextIdx), 150);
      return nextIdx;
    });
  };

  const finishGame = () => {
    playVictory();
    setGameState('SUMMARY');

    const totalGoTrials = goHits + goMisses;
    const totalNoGoTrials = noGoCorrectWithholds + noGoFalseAlarms;
    const totalCorrect = goHits + noGoCorrectWithholds;
    const accuracy = Math.round((totalCorrect / TOTAL_TRIALS) * 100);

    const avgRt = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 420;

    const result: GameResult = {
      gameId: 'go-no-go',
      score,
      accuracy,
      avgReactionTimeMs: avgRt,
      completedAt: new Date().toISOString(),
      durationSeconds: Math.round((TOTAL_TRIALS * (stimulusDurationMs + interStimulusIntervalMs)) / 1000),
      difficulty,
      peakStreak: bestStreak,
    };

    if (onGameEnd) {
      onGameEnd(result);
    }
  };

  // Keyboard shortcut (Space bar or Enter to tap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hasResponded, currentStim]);

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
            <Zap className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Go / No-Go Sustained Vigilance
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Stimulate your Right Inferior Frontal Gyrus (rIFG / BA 47/44) and motor brake circuits. Rapid green circles will appear — tap instantly! But when a RED STOP signal flashes, you must immediately freeze and withhold your response.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-xs text-left">
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                GO
              </span>
              <div>
                <span className="font-bold text-white block">Green Target: TAP!</span>
                <span className="text-slate-400">Tap spacebar or button at top speed.</span>
              </div>
            </div>

            <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0">
                STOP
              </span>
              <div>
                <span className="font-bold text-white block">Red Signal: FREEZE!</span>
                <span className="text-slate-400">Withhold tap completely.</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Vigilance Challenge</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Stimulus <strong className="text-white font-mono">{trialIndex + 1}</strong> / {TOTAL_TRIALS}</span>
              <span aria-hidden="true">·</span>
              <span>Streak: <strong className="text-emerald-400 font-mono">{streak}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Central Target Display */}
          <div className="h-56 md:h-64 flex flex-col items-center justify-center bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner relative">
            {currentStim ? (
              <div
                className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center font-black text-2xl md:text-3xl text-white shadow-2xl transition-transform animate-in zoom-in-75 duration-75 ${
                  currentStim.type === 'GO'
                    ? 'bg-emerald-500 shadow-emerald-500/40 ring-4 ring-emerald-400/50'
                    : 'bg-rose-600 shadow-rose-600/40 ring-4 ring-rose-400/50'
                }`}
              >
                {currentStim.symbol}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-600 font-mono">
                +
              </div>
            )}

            <div className="absolute bottom-3 text-xs text-slate-500">
              Spacebar or tap button below
            </div>
          </div>

          {/* Large Tactile Screen Tap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleTap}
              className="w-full max-w-md py-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 font-bold text-lg text-white shadow-lg transition-all cursor-pointer active:scale-95"
            >
              TAP NOW [SPACE]
            </button>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Vigilance Probe Complete</h2>
            <p className="text-slate-400 text-sm">Right Inferior Frontal Gyrus (rIFG / BA 47/44) Stimulated</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Go Hits</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{goHits}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">No-Go Withheld</span>
              <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">{noGoCorrectWithholds}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">False Triggers</span>
              <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">{noGoFalseAlarms}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retest Vigilance</span>
          </button>
        </div>
      )}
    </div>
  );
};
