import React, { useState, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Grid, HelpCircle } from 'lucide-react';

interface MatrixGameProps {
  difficulty?: string;
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface MatrixPuzzle {
  id: string;
  ruleExplanation: string;
  // Render functions for the 8 known cells (indices 0..7) and 4 candidate choices (A, B, C, D)
  cells: Array<(active: boolean) => React.ReactNode>;
  options: Array<{
    id: string;
    render: () => React.ReactNode;
    isCorrect: boolean;
  }>;
}

export const PatternMatrixGame: React.FC<MatrixGameProps> = ({
  difficulty = 'single-rule',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Curated procedural puzzle templates
  const puzzles: MatrixPuzzle[] = [
    // Puzzle 1: Dot Count Progression (Row 1: 1,2,3; Row 2: 2,3,4; Row 3: 3,4,?) -> Ans: 5
    {
      id: 'puz-1',
      ruleExplanation: 'Dot count increases by +1 along each row and column.',
      cells: [
        // Row 1
        () => <div className="w-3 h-3 rounded-full bg-violet-400" />,
        () => (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
        ),
        () => (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
        ),
        // Row 2
        () => (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
        ),
        () => (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
        ),
        () => (
          <div className="grid grid-cols-2 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
          </div>
        ),
        // Row 3
        () => (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
        ),
        () => (
          <div className="grid grid-cols-2 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
          </div>
        ),
      ],
      options: [
        {
          id: 'opt-a',
          isCorrect: true, // 5 dots
          render: () => (
            <div className="flex flex-wrap gap-1 w-9 justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            </div>
          ),
        },
        {
          id: 'opt-b',
          isCorrect: false, // 4 dots
          render: () => (
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            </div>
          ),
        },
        {
          id: 'opt-c',
          isCorrect: false, // 6 dots
          render: () => (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-violet-400" />
              ))}
            </div>
          ),
        },
        {
          id: 'opt-d',
          isCorrect: false, // 3 dots
          render: () => (
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            </div>
          ),
        },
      ],
    },

    // Puzzle 2: Clockwise Pointer Rotation (+90 deg per column)
    {
      id: 'puz-2',
      ruleExplanation: 'The ray rotates 90° clockwise in each consecutive column.',
      cells: [
        // Row 1: up (0°), right (90°), down (180°)
        () => <div className="w-1 h-8 bg-amber-400 rounded-full" />,
        () => <div className="w-8 h-1 bg-amber-400 rounded-full" />,
        () => <div className="w-1 h-8 bg-amber-400 rounded-full" />,
        // Row 2: right (90°), down (180°), left (270°)
        () => <div className="w-8 h-1 bg-amber-400 rounded-full" />,
        () => <div className="w-1 h-8 bg-amber-400 rounded-full" />,
        () => <div className="w-8 h-1 bg-amber-400 rounded-full" />,
        // Row 3: down (180°), left (270°), ? -> should be up (0° or 360°)
        () => <div className="w-1 h-8 bg-amber-400 rounded-full" />,
        () => <div className="w-8 h-1 bg-amber-400 rounded-full" />,
      ],
      options: [
        {
          id: 'opt-a',
          isCorrect: true, // Up vertical line with arrow head
          render: () => (
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 border-t-2 border-l-2 border-amber-400 -rotate-45 mb-0.5" />
              <div className="w-1 h-7 bg-amber-400 rounded-full" />
            </div>
          ),
        },
        {
          id: 'opt-b',
          isCorrect: false, // Diagonal
          render: () => <div className="w-1 h-8 bg-amber-400 rounded-full rotate-45" />,
        },
        {
          id: 'opt-c',
          isCorrect: false, // Horizontal
          render: () => <div className="w-8 h-1 bg-amber-400 rounded-full" />,
        },
        {
          id: 'opt-d',
          isCorrect: false, // Down arrow
          render: () => (
            <div className="flex flex-col items-center">
              <div className="w-1 h-7 bg-amber-400 rounded-full" />
              <div className="w-2 h-2 border-b-2 border-r-2 border-amber-400 -rotate-45 mt-0.5" />
            </div>
          ),
        },
      ],
    },

    // Puzzle 3: Shape Polygon Edge Count (Triangle 3 -> Square 4 -> Pentagon 5)
    {
      id: 'puz-3',
      ruleExplanation: 'Shapes progress from 3 edges to 4 edges to 5 edges.',
      cells: [
        // Row 1: Triangle (3), Square (4), Circle (rounded/continuous)
        () => (
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-emerald-400" />
        ),
        () => <div className="w-6 h-6 border-2 border-emerald-400 rounded-sm" />,
        () => <div className="w-7 h-7 rounded-full border-2 border-emerald-400" />,
        // Row 2: Square (4), Circle, Triangle (3)
        () => <div className="w-6 h-6 border-2 border-emerald-400 rounded-sm" />,
        () => <div className="w-7 h-7 rounded-full border-2 border-emerald-400" />,
        () => (
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-emerald-400" />
        ),
        // Row 3: Circle, Triangle (3), ? -> Square (4)
        () => <div className="w-7 h-7 rounded-full border-2 border-emerald-400" />,
        () => (
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-emerald-400" />
        ),
      ],
      options: [
        {
          id: 'opt-a',
          isCorrect: true, // Square
          render: () => <div className="w-6 h-6 border-2 border-emerald-400 rounded-sm bg-emerald-500/10" />,
        },
        {
          id: 'opt-b',
          isCorrect: false, // Diamond
          render: () => <div className="w-5 h-5 border-2 border-emerald-400 rotate-45" />,
        },
        {
          id: 'opt-c',
          isCorrect: false, // Triangle
          render: () => (
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-emerald-400" />
          ),
        },
        {
          id: 'opt-d',
          isCorrect: false, // Circle
          render: () => <div className="w-7 h-7 rounded-full border-2 border-emerald-400" />,
        },
      ],
    },

    // Puzzle 4: Shading cycle (Hollow -> Striped -> Solid)
    {
      id: 'puz-4',
      ruleExplanation: 'Fill density transforms from hollow outline to striped pattern to solid core.',
      cells: [
        () => <div className="w-7 h-7 rounded-md border-2 border-indigo-400" />,
        () => (
          <div className="w-7 h-7 rounded-md border-2 border-indigo-400 bg-repeating-linear-gradient flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-400/40 rounded-sm" />
          </div>
        ),
        () => <div className="w-7 h-7 rounded-md bg-indigo-500 shadow-sm" />,
        // Row 2
        () => (
          <div className="w-7 h-7 rounded-md border-2 border-indigo-400 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-400/40 rounded-sm" />
          </div>
        ),
        () => <div className="w-7 h-7 rounded-md bg-indigo-500 shadow-sm" />,
        () => <div className="w-7 h-7 rounded-md border-2 border-indigo-400" />,
        // Row 3
        () => <div className="w-7 h-7 rounded-md bg-indigo-500 shadow-sm" />,
        () => <div className="w-7 h-7 rounded-md border-2 border-indigo-400" />,
      ],
      options: [
        {
          id: 'opt-a',
          isCorrect: true, // Striped/Half
          render: () => (
            <div className="w-7 h-7 rounded-md border-2 border-indigo-400 flex items-center justify-center bg-indigo-500/20">
              <div className="w-3 h-3 bg-indigo-400 rounded-sm" />
            </div>
          ),
        },
        {
          id: 'opt-b',
          isCorrect: false, // Solid
          render: () => <div className="w-7 h-7 rounded-md bg-indigo-500" />,
        },
        {
          id: 'opt-c',
          isCorrect: false, // Hollow Circle
          render: () => <div className="w-7 h-7 rounded-full border-2 border-indigo-400" />,
        },
        {
          id: 'opt-d',
          isCorrect: false, // Double ring
          render: () => (
            <div className="w-7 h-7 rounded-md border-2 border-indigo-400 p-1 flex items-center justify-center">
              <div className="w-3 h-3 border border-indigo-400" />
            </div>
          ),
        },
      ],
    },
  ];

  const currentPuzzle = puzzles[puzzleIndex];

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setPuzzleIndex(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedOptionId(null);
  };

  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (selectedOptionId) return; // Prevent double click
    setSelectedOptionId(optionId);

    if (isCorrect) {
      playSuccess();
      setCorrectCount(c => c + 1);
      setScore(s => s + 250);
    } else {
      playError();
    }

    setTimeout(() => {
      advancePuzzle(isCorrect);
    }, 700);
  };

  const advancePuzzle = (wasCorrect: boolean) => {
    setSelectedOptionId(null);

    if (puzzleIndex + 1 >= puzzles.length) {
      playVictory();
      setGameState('SUMMARY');

      const totalCorrect = correctCount + (wasCorrect ? 1 : 0);
      const accuracy = Math.round((totalCorrect / puzzles.length) * 100);

      const result: GameResult = {
        gameId: 'pattern-matrix',
        score: score + (wasCorrect ? 250 : 0),
        accuracy,
        avgReactionTimeMs: 4200,
        completedAt: new Date().toISOString(),
        durationSeconds: puzzles.length * 12,
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setPuzzleIndex(i => i + 1);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <Grid className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Pattern Matrix (Fluid Induction)
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Rostrolateral Prefrontal Cortex (BA 10). Analyze 3x3 visual logic grids to deduce multidimensional transformation rules (rotation, progression, shading) and identify the missing tile.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Methodology:</p>
            <p className="text-xs text-slate-400">
              Grounded in Raven's Progressive Matrices, the international benchmark for non-verbal fluid intelligence ($G_f$).
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Matrix Test
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Matrix <strong className="text-white font-mono">{puzzleIndex + 1}</strong> / {puzzles.length}</span>
              <span aria-hidden="true">·</span>
              <span>Domain: <strong className="text-violet-400">Inductive Logic</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* 3x3 Matrix Puzzle Board */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 w-72 h-72 md:w-84 md:h-84 shadow-inner">
              {currentPuzzle.cells.map((renderCell, idx) => (
                <div
                  key={`cell-${idx}`}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-center"
                >
                  {renderCell(true)}
                </div>
              ))}

              {/* The missing 9th tile target */}
              <div className="bg-violet-950/20 border-2 border-dashed border-violet-500/50 rounded-xl flex items-center justify-center animate-pulse">
                <HelpCircle className="w-8 h-8 text-violet-400" />
              </div>
            </div>
          </div>

          {/* Candidate Options (A, B, C, D) */}
          <div className="mt-8">
            <span className="text-xs text-slate-400 uppercase tracking-wider block text-center mb-3">
              Select the matching tile that satisfies the matrix logic
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              {currentPuzzle.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const letter = ['A', 'B', 'C', 'D'][idx];

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id, opt.isCorrect)}
                    disabled={selectedOptionId !== null}
                    className={`h-24 rounded-xl border p-2 flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500'
                          : 'bg-rose-950/60 border-rose-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-500">
                      {letter}
                    </span>
                    <div className="flex items-center justify-center">
                      {opt.render()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Matrix Reasoning Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Rostrolateral Prefrontal Cortex (BA 10) Stimulated</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Puzzles Solved</span>
              <span className="text-xl font-bold text-violet-400 font-mono tabular-nums">
                {correctCount} / {puzzles.length}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Fluid Index</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {Math.round((correctCount / puzzles.length) * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
