import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ChimpGameProps {
  difficulty?: string; // 'easy' (5 items) | 'medium' (7 items) | 'chimp' (9 items)
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface TileData {
  index: number;
  val: number | null; // null if empty cell
  isMasked: boolean;
  isCleared: boolean;
  isError: boolean;
}

const GRID_SIZE = 25; // 5x5 grid
const TOTAL_ROUNDS = 6;

export const ChimpMemoryGame: React.FC<ChimpGameProps> = ({
  difficulty = 'medium',
  onGameEnd,
  isEmbedded = false,
}) => {
  const baseItemCount = difficulty === 'easy' ? 5 : difficulty === 'chimp' ? 8 : 6;

  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [grid, setGrid] = useState<TileData[]>([]);
  const [nextExpectedNum, setNextExpectedNum] = useState<number>(1);
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [roundSuccesses, setRoundSuccesses] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [roundItemCount, setRoundItemCount] = useState<number>(baseItemCount);
  const roundStartTimeRef = useRef<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Generate random positions for 1..N
  const setupRound = useCallback((itemCount: number) => {
    const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);
    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const assignedTiles: TileData[] = Array.from({ length: GRID_SIZE }, (_, i) => ({
      index: i,
      val: null,
      isMasked: false,
      isCleared: false,
      isError: false,
    }));

    for (let num = 1; num <= itemCount; num++) {
      const cellIdx = indices[num - 1];
      assignedTiles[cellIdx] = {
        index: cellIdx,
        val: num,
        isMasked: false,
        isCleared: false,
        isError: false,
      };
    }

    setGrid(assignedTiles);
    setNextExpectedNum(1);
    setIsMasked(false);
    roundStartTimeRef.current = Date.now();
  }, []);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setRoundNumber(1);
    setRoundSuccesses(0);
    setScore(0);
    setRoundItemCount(baseItemCount);
    setReactionTimes([]);
    setupRound(baseItemCount);
  };

  const handleTileClick = (cellIdx: number) => {
    const tile = grid[cellIdx];
    if (!tile.val || tile.isCleared) return;

    if (tile.val === nextExpectedNum) {
      // Correct click
      playTap();
      const updatedGrid = [...grid];
      updatedGrid[cellIdx] = { ...tile, isCleared: true, isMasked: false };

      // Mask all other numbers as soon as "1" is clicked!
      if (nextExpectedNum === 1) {
        setIsMasked(true);
        for (let i = 0; i < updatedGrid.length; i++) {
          if (updatedGrid[i].val && updatedGrid[i].val !== 1) {
            updatedGrid[i].isMasked = true;
          }
        }
      }

      setGrid(updatedGrid);

      if (nextExpectedNum === roundItemCount) {
        // Round cleared successfully!
        playSuccess();
        const elapsed = Date.now() - roundStartTimeRef.current;
        setReactionTimes(prev => [...prev, elapsed]);
        setRoundSuccesses(s => s + 1);

        const roundPoints = roundItemCount * 120 + Math.max(0, 1000 - Math.round(elapsed / 10));
        setScore(s => s + roundPoints);

        setTimeout(() => {
          advanceRound(true);
        }, 600);
      } else {
        setNextExpectedNum(n => n + 1);
      }
    } else {
      // Error!
      playError();
      const updatedGrid = [...grid];
      updatedGrid[cellIdx] = { ...tile, isError: true };
      // Reveal all numbers to show what went wrong
      for (let i = 0; i < updatedGrid.length; i++) {
        if (updatedGrid[i].val) {
          updatedGrid[i].isMasked = false;
        }
      }
      setGrid(updatedGrid);

      setTimeout(() => {
        advanceRound(false);
      }, 1000);
    }
  };

  const advanceRound = (success: boolean) => {
    if (roundNumber >= TOTAL_ROUNDS) {
      // Game ended
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 1200;

      const accuracy = Math.round(((roundSuccesses + (success ? 1 : 0)) / TOTAL_ROUNDS) * 100);

      const result: GameResult = {
        gameId: 'chimp-memory',
        score: score,
        accuracy: accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_ROUNDS * 8000) / 1000),
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      const nextRound = roundNumber + 1;
      setRoundNumber(nextRound);
      // Adaptive scaling: increase item count on success, maintain on fail
      const nextItemCount = success ? Math.min(10, roundItemCount + 1) : Math.max(4, roundItemCount);
      setRoundItemCount(nextItemCount);
      setupRound(nextItemCount);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Chimp Spatial Span
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Train your photographic visual-spatial working memory (BA 7 & Hippocampus). Take an instant mental snapshot of scattered numbers. Once you tap "1", all numbers are masked—recall the sequence from memory.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Mechanics:</p>
            <p className="text-xs text-slate-400">
              Numbers 1 to {baseItemCount}+ appear. Tapping "1" masks the rest into blank tiles. Tap them in exact ascending sequence (2, 3, 4...).
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Test
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Round <strong className="text-white font-mono">{roundNumber}</strong> / {TOTAL_ROUNDS}</span>
              <span aria-hidden="true">·</span>
              <span>Sequence Span: <strong className="text-amber-400 font-mono">{roundItemCount} items</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Next Expected: <strong className="text-indigo-400 font-mono">{nextExpectedNum}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* 5x5 Memory Arena */}
          <div className="flex justify-center items-center my-4">
            <div className="grid grid-cols-5 gap-2.5 md:gap-3 p-3 md:p-4 bg-slate-950 rounded-2xl border border-slate-800 w-full max-w-md aspect-square">
              {grid.map((cell) => {
                const hasValue = cell.val !== null;
                const showNumber = hasValue && !cell.isMasked && !cell.isCleared;
                const isMaskedActive = hasValue && cell.isMasked && !cell.isCleared;

                return (
                  <button
                    key={cell.index}
                    onClick={() => handleTileClick(cell.index)}
                    disabled={!hasValue || cell.isCleared}
                    className={`rounded-xl font-mono text-lg md:text-2xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                      cell.isCleared
                        ? 'bg-transparent border border-transparent opacity-0 cursor-default'
                        : cell.isError
                        ? 'bg-rose-600 text-white border border-rose-400 shadow-md animate-pulse'
                        : isMaskedActive
                        ? 'bg-white hover:bg-slate-100 text-transparent border border-slate-300 shadow-sm active:scale-95'
                        : showNumber
                        ? 'bg-slate-900 border border-amber-500/50 text-amber-400 shadow-md hover:bg-slate-800 active:scale-95'
                        : 'bg-slate-900/40 border border-slate-800/40 cursor-default'
                    }`}
                  >
                    {showNumber ? cell.val : isMaskedActive ? '' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Spatial Span Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Parieto-Occipital & Hippocampal Network Stimulated</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Rounds Cleared</span>
              <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                {roundSuccesses} / {TOTAL_ROUNDS}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Max Span</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{roundItemCount} Items</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
