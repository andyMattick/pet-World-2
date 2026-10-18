import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, SpellCheck, Delete } from 'lucide-react';

interface WordGameProps {
  difficulty?: string;
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface WordPuzzle {
  word: string;
  clue: string;
  scrambled: string[];
}

const PUZZLE_BANK: Array<{ word: string; clue: string }> = [
  { word: 'NEURON', clue: 'Electrically excitable cell that transmits nerve impulses' },
  { word: 'SYNAPSE', clue: 'Microscopic junction across which nerve signals bridge' },
  { word: 'CORTEX', clue: 'Outer furrowed grey-matter layer of the cerebrum' },
  { word: 'MYELIN', clue: 'Protective lipid sheath insulating axon fibers' },
  { word: 'AXON', clue: 'Slender nerve fiber conducting impulses away from cell body' },
  { word: 'DENDRITE', clue: 'Branching tree-like structure receiving incoming synaptic input' },
  { word: 'MEMORY', clue: 'Neurochemical process of encoding and retrieving experiences' },
  { word: 'SIGNAL', clue: 'Electrochemical action potential transmitting biological data' },
];

export const WordFluencyGame: React.FC<WordGameProps> = ({
  difficulty = '6-letter',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [puzzleList, setPuzzleList] = useState<WordPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userLetters, setUserLetters] = useState<Array<{ letter: string; originalIndex: number }>>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const startTimeRef = useRef<number>(0);

  const preparePuzzles = useCallback(() => {
    // Pick 5 random words
    const shuffled = [...PUZZLE_BANK].sort(() => Math.random() - 0.5).slice(0, 5);
    const prepared = shuffled.map(p => {
      const letters = p.word.split('');
      // Scramble ensuring it's not already in target order
      let scrambled = [...letters].sort(() => Math.random() - 0.5);
      if (scrambled.join('') === p.word && letters.length > 2) {
        scrambled.reverse();
      }
      return {
        word: p.word,
        clue: p.clue,
        scrambled,
      };
    });
    setPuzzleList(prepared);
  }, []);

  const startGame = () => {
    playTap();
    preparePuzzles();
    setGameState('PLAYING');
    setCurrentIndex(0);
    setUserLetters([]);
    setUsedIndices(new Set());
    setScore(0);
    setCorrectCount(0);
    startTimeRef.current = Date.now();
  };

  const currentPuzzle = puzzleList[currentIndex];

  const handlePickLetter = (letter: string, originalIndex: number) => {
    if (usedIndices.has(originalIndex)) return;
    playTap();

    const nextUsed = new Set(usedIndices);
    nextUsed.add(originalIndex);
    setUsedIndices(nextUsed);

    const nextUserLetters = [...userLetters, { letter, originalIndex }];
    setUserLetters(nextUserLetters);

    // Check if word is complete
    if (nextUserLetters.length === currentPuzzle.word.length) {
      const constructedWord = nextUserLetters.map(l => l.letter).join('');
      if (constructedWord === currentPuzzle.word) {
        // Correct!
        playSuccess();
        setCorrectCount(c => c + 1);
        setScore(s => s + 200);

        setTimeout(() => {
          advanceWord(true);
        }, 500);
      } else {
        // Incorrect
        playError();
        setTimeout(() => {
          // Clear input so they can retry
          setUserLetters([]);
          setUsedIndices(new Set());
        }, 600);
      }
    }
  };

  const handleRemoveLast = () => {
    if (userLetters.length === 0) return;
    playTap();
    const last = userLetters[userLetters.length - 1];
    const nextUser = userLetters.slice(0, -1);
    const nextUsed = new Set(usedIndices);
    nextUsed.delete(last.originalIndex);

    setUserLetters(nextUser);
    setUsedIndices(nextUsed);
  };

  const handleClearAll = () => {
    playTap();
    setUserLetters([]);
    setUsedIndices(new Set());
  };

  const advanceWord = (wasCorrect: boolean) => {
    setUserLetters([]);
    setUsedIndices(new Set());

    if (currentIndex + 1 >= puzzleList.length) {
      playVictory();
      setGameState('SUMMARY');

      const totalCorrect = correctCount + (wasCorrect ? 1 : 0);
      const totalTime = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const accuracy = Math.round((totalCorrect / puzzleList.length) * 100);

      const result: GameResult = {
        gameId: 'word-fluency',
        score: score + (wasCorrect ? 200 : 0),
        accuracy,
        avgReactionTimeMs: Math.round((totalTime / puzzleList.length) * 1000),
        completedAt: new Date().toISOString(),
        durationSeconds: totalTime,
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
            <SpellCheck className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Lexical Fluency & Search
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Left Inferior Frontal Gyrus (BA 44/45 / Broca's Area) and Temporal Lexicon. Rapidly synthesize orthographic letters into neuroscience-themed terms using semantic clues.
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Clinical Value:</p>
            <p className="text-xs text-slate-400">
              Preserves rapid semantic retrieval pathways, phonological loop synthesis, and word-finding velocity.
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-pink-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Fluency Session
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && currentPuzzle && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Word <strong className="text-white font-mono">{currentIndex + 1}</strong> / {puzzleList.length}</span>
              <span aria-hidden="true">·</span>
              <span>Domain: <strong className="text-pink-400">Semantic Access</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Clue Prompt */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-pink-400 font-semibold block mb-1">Cognitive Clue</span>
            <p className="text-sm md:text-base text-slate-200 italic">"{currentPuzzle.clue}"</p>
          </div>

          {/* User Word Construction Slots */}
          <div className="flex justify-center items-center gap-2 md:gap-3 my-6 min-h-[60px]">
            {Array.from({ length: currentPuzzle.word.length }).map((_, slotIdx) => {
              const item = userLetters[slotIdx];
              return (
                <div
                  key={`slot-${slotIdx}`}
                  className={`w-11 h-13 md:w-14 md:h-16 rounded-xl border flex items-center justify-center font-mono text-xl md:text-2xl font-bold transition-all ${
                    item
                      ? 'bg-pink-950/30 border-pink-500/50 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 border-dashed text-slate-600'
                  }`}
                >
                  {item ? item.letter : ''}
                </div>
              );
            })}
          </div>

          {/* Scrambled Letter Tiles */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 md:gap-3 my-8">
            {currentPuzzle.scrambled.map((letter, origIdx) => {
              const isUsed = usedIndices.has(origIdx);
              return (
                <button
                  key={`letter-${origIdx}`}
                  onClick={() => handlePickLetter(letter, origIdx)}
                  disabled={isUsed}
                  className={`w-12 h-14 md:w-14 md:h-16 rounded-xl font-mono text-xl md:text-2xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isUsed
                      ? 'bg-slate-950/40 border border-slate-900 text-slate-700 opacity-40 cursor-default'
                      : 'bg-slate-900 border border-slate-700 hover:border-pink-500 text-white hover:scale-105 active:scale-95 shadow-md'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Controls: Backspace & Clear */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={handleRemoveLast}
              disabled={userLetters.length === 0}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Delete className="w-4 h-4" />
              Undo Letter
            </button>
            <button
              onClick={handleClearAll}
              disabled={userLetters.length === 0}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Lexical Fluency Complete</h2>
          <p className="text-slate-400 text-sm mb-6">Broca's Area (BA 44/45) & Semantic Temporal Hub Stimulated</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Words Synthesized</span>
              <span className="text-xl font-bold text-pink-400 font-mono tabular-nums">
                {correctCount} / {puzzleList.length}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Fluency Index</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {Math.round((correctCount / puzzleList.length) * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-pink-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
