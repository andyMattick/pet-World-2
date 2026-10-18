import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Sparkles, Grid, ArrowLeftRight } from 'lucide-react';

interface CorsiGameProps {
  difficulty?: string; // 'forward' | 'reverse' | 'long-span'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface BlockNode {
  id: number;
  x: number; // percentage coordinates
  y: number;
}

// 9 standardized Corsi block spatial positions (irregular layout)
const CORSI_BLOCKS: BlockNode[] = [
  { id: 0, x: 20, y: 22 },
  { id: 1, x: 50, y: 18 },
  { id: 2, x: 80, y: 26 },
  { id: 3, x: 30, y: 46 },
  { id: 4, x: 68, y: 44 },
  { id: 5, x: 18, y: 72 },
  { id: 6, x: 44, y: 76 },
  { id: 7, x: 78, y: 70 },
  { id: 8, x: 52, y: 52 },
];

const TOTAL_ROUNDS = 6;

export const CorsiBlockGame: React.FC<CorsiGameProps> = ({
  difficulty = 'forward',
  onGameEnd,
  isEmbedded = false,
}) => {
  const isReverse = difficulty === 'reverse';
  const baseSpan = difficulty === 'long-span' ? 5 : 4;

  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [currentSpan, setCurrentSpan] = useState<number>(baseSpan);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [isDemonstrating, setIsDemonstrating] = useState<boolean>(false);
  const [activeFlashBlock, setActiveFlashBlock] = useState<number | null>(null);

  const [score, setScore] = useState<number>(0);
  const [correctRounds, setCorrectRounds] = useState<number>(0);
  const [maxSpanAchieved, setMaxSpanAchieved] = useState<number>(baseSpan);
  const roundStartTimeRef = useRef<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Generate sequence of block IDs without consecutive repeats
  const generateSequence = useCallback((spanLength: number): number[] => {
    const seq: number[] = [];
    for (let i = 0; i < spanLength; i++) {
      let next = Math.floor(Math.random() * CORSI_BLOCKS.length);
      while (seq.length > 0 && next === seq[seq.length - 1]) {
        next = Math.floor(Math.random() * CORSI_BLOCKS.length);
      }
      seq.push(next);
    }
    return seq;
  }, []);

  const startRound = useCallback((spanLength: number) => {
    const seq = generateSequence(spanLength);
    setSequence(seq);
    setUserTaps([]);
    setIsDemonstrating(true);
    setActiveFlashBlock(null);

    // Play visual flash sequence
    seq.forEach((blockId, idx) => {
      setTimeout(() => {
        setActiveFlashBlock(blockId);
        playTap();
      }, (idx + 1) * 750);

      setTimeout(() => {
        setActiveFlashBlock(null);
      }, (idx + 1) * 750 + 450);
    });

    // Finished demonstrating
    setTimeout(() => {
      setIsDemonstrating(false);
      roundStartTimeRef.current = Date.now();
    }, (seq.length + 1) * 750 + 200);
  }, [generateSequence]);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setRoundNumber(1);
    setCurrentSpan(baseSpan);
    setScore(0);
    setCorrectRounds(0);
    setMaxSpanAchieved(baseSpan);
    setReactionTimes([]);
    startRound(baseSpan);
  };

  const handleBlockClick = (blockId: number) => {
    if (isDemonstrating || gameState !== 'PLAYING') return;
    playTap();

    const expectedSequence = isReverse ? [...sequence].reverse() : sequence;
    const nextTapIndex = userTaps.length;

    if (blockId === expectedSequence[nextTapIndex]) {
      // Correct block tap!
      const nextTaps = [...userTaps, blockId];
      setUserTaps(nextTaps);

      if (nextTaps.length === expectedSequence.length) {
        // Round cleared successfully!
        playSuccess();
        const elapsed = Date.now() - roundStartTimeRef.current;
        setReactionTimes(prev => [...prev, elapsed]);
        setCorrectRounds(c => c + 1);
        setMaxSpanAchieved(m => Math.max(m, currentSpan));

        const roundPoints = currentSpan * 150 + Math.max(0, 1000 - Math.round(elapsed / 10));
        setScore(s => s + roundPoints);

        setTimeout(() => {
          advanceRound(true);
        }, 800);
      }
    } else {
      // Mistake!
      playError();
      setTimeout(() => {
        advanceRound(false);
      }, 900);
    }
  };

  const advanceRound = (wasSuccess: boolean) => {
    if (roundNumber >= TOTAL_ROUNDS) {
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 1200;

      const accuracy = Math.round(((correctRounds + (wasSuccess ? 1 : 0)) / TOTAL_ROUNDS) * 100);

      const result: GameResult = {
        gameId: 'corsi-block',
        score: score + (wasSuccess ? 150 : 0),
        accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_ROUNDS * 8)),
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      const nextR = roundNumber + 1;
      setRoundNumber(nextR);
      // Adaptive span scaling: increase if correct, maintain if wrong
      const nextSpan = wasSuccess ? Math.min(8, currentSpan + 1) : Math.max(3, currentSpan);
      setCurrentSpan(nextSpan);
      startRound(nextSpan);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto">
            <Grid className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Corsi Block Span ({isReverse ? 'Reverse Order' : 'Forward Order'})
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Based on the clinical Corsi Block-Tapping Test (Milner, 1971). Watch blocks illuminate in a spatial sequence across the canvas. Reproduce the exact path {isReverse ? 'in REVERSE order' : 'in the original forward order'}.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto text-center text-xs text-slate-300">
            <span className="font-semibold text-white block mb-1">Anatomical Target:</span>
            <span>Superior Parietal Lobule (BA 7) & Cerebellar timing circuits mediating spatial trajectory retention.</span>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Sequence Probe</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Round <strong className="text-white font-mono">{roundNumber}</strong> / {TOTAL_ROUNDS}</span>
              <span aria-hidden="true">·</span>
              <span>Sequence Length: <strong className="text-sky-400 font-mono">{currentSpan} Blocks</strong></span>
              {isReverse && (
                <span className="text-amber-400 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Reverse Mode
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="text-center">
            {isDemonstrating ? (
              <span className="text-xs font-semibold text-sky-400 animate-pulse">
                • Memorize the glowing block sequence...
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-400">
                Your Turn! Tap the blocks {isReverse ? 'in REVERSE order' : 'in FORWARD order'} ({userTaps.length} / {currentSpan})
              </span>
            )}
          </div>

          {/* Corsi Canvas Arena with 9 Irregular Spatial Blocks */}
          <div className="relative w-full h-[360px] md:h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
            {CORSI_BLOCKS.map((block) => {
              const isFlashing = activeFlashBlock === block.id;
              const hasTapped = userTaps.includes(block.id);

              return (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block.id)}
                  disabled={isDemonstrating}
                  style={{ left: `${block.x}%`, top: `${block.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-center justify-center font-mono font-bold text-base shadow-lg ${
                    isFlashing
                      ? 'bg-sky-400 border-white shadow-sky-400/80 scale-110 z-20'
                      : hasTapped
                      ? 'bg-sky-950/60 border-sky-500 text-sky-400 scale-95'
                      : isDemonstrating
                      ? 'bg-slate-900 border-slate-800 cursor-default'
                      : 'bg-slate-900 border-slate-700 hover:border-sky-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  {hasTapped && <Check className="w-5 h-5 text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Corsi Sequence Complete</h2>
            <p className="text-slate-400 text-sm">Parieto-Cerebellar Spatial Buffer Stimulated</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Max Span</span>
              <span className="text-xl font-bold text-sky-400 font-mono tabular-nums">{maxSpanAchieved} Blocks</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Rounds Cleared</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {correctRounds} / {TOTAL_ROUNDS}
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
