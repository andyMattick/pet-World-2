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

/* Everyday words with kid-friendly clues. '4-letter' plays the short words (4–5 letters), '6-letter' the long ones
   (6–7 letters). Each round draws 5 at random, so rounds rarely repeat. */
const SHORT_WORDS: Array<{ word: string; clue: string }> = [
  { word: 'FROG', clue: 'A green animal that hops and says ribbit' },
  { word: 'CAKE', clue: 'A sweet treat with candles on your birthday' },
  { word: 'MOON', clue: 'It glows in the sky at night' },
  { word: 'SHIP', clue: 'A big boat that crosses the ocean' },
  { word: 'BIRD', clue: 'It has feathers and can fly' },
  { word: 'RAIN', clue: 'Water falling from the clouds' },
  { word: 'DRUM', clue: 'You tap it to keep the beat' },
  { word: 'NEST', clue: 'A home a bird builds from twigs' },
  { word: 'KITE', clue: 'You fly it on a windy day' },
  { word: 'CORN', clue: 'Yellow kernels on a cob' },
  { word: 'LAMP', clue: 'It lights up a room' },
  { word: 'SNOW', clue: 'Cold white flakes in winter' },
  { word: 'TREE', clue: 'It has a trunk, branches and leaves' },
  { word: 'FISH', clue: 'It swims and breathes with gills' },
  { word: 'BOOK', clue: 'Pages full of stories to read' },
  { word: 'STAR', clue: 'A tiny twinkling light in the night sky' },
  { word: 'MILK', clue: 'A white drink that comes from cows' },
  { word: 'GOAT', clue: 'A farm animal with horns and a beard' },
  { word: 'SOAP', clue: 'It makes bubbles when you wash your hands' },
  { word: 'WOLF', clue: 'A wild animal that howls at the moon' },
  { word: 'APPLE', clue: 'A red or green fruit that keeps the doctor away' },
  { word: 'BEACH', clue: 'Sand and waves by the sea' },
  { word: 'CLOUD', clue: 'A fluffy white puff in the sky' },
  { word: 'HORSE', clue: 'An animal you can ride that gallops' },
  { word: 'PIZZA', clue: 'Cheesy slices with toppings' },
  { word: 'TIGER', clue: 'A big striped cat' },
  { word: 'PLANT', clue: 'It grows from a seed in soil' },
  { word: 'CHAIR', clue: 'Something you sit on' },
  { word: 'TRAIN', clue: 'It rides on tracks and goes choo-choo' },
  { word: 'SMILE', clue: 'What your face does when you are happy' },
  { word: 'GRAPE', clue: 'A small round fruit that grows in bunches' },
  { word: 'BREAD', clue: 'You use two slices to make a sandwich' },
  { word: 'OCEAN', clue: 'A huge body of salty water' },
  { word: 'ROBOT', clue: 'A machine that can move and follow commands' },
  { word: 'HONEY', clue: 'Sweet and sticky, made by bees' },
  { word: 'PIANO', clue: 'An instrument with black and white keys' },
];
const LONG_WORDS: Array<{ word: string; clue: string }> = [
  { word: 'RABBIT', clue: 'A fluffy animal with long ears that hops' },
  { word: 'GARDEN', clue: 'A place where flowers and vegetables grow' },
  { word: 'PLANET', clue: 'Earth and Mars are each one of these' },
  { word: 'CASTLE', clue: 'A big stone home for a king or queen' },
  { word: 'BRIDGE', clue: 'It lets you cross over a river' },
  { word: 'SUMMER', clue: 'The hottest season of the year' },
  { word: 'TURTLE', clue: 'A slow animal that carries its shell' },
  { word: 'PENCIL', clue: 'You write with it and can erase it' },
  { word: 'ORANGE', clue: 'A fruit and a color' },
  { word: 'JUNGLE', clue: 'A thick, hot forest full of animals' },
  { word: 'ROCKET', clue: 'It blasts off into space' },
  { word: 'MONKEY', clue: 'It swings from trees and loves bananas' },
  { word: 'WINTER', clue: 'The cold season with snow' },
  { word: 'CANDLE', clue: 'It has a wick and a little flame' },
  { word: 'PUZZLE', clue: 'Pieces you fit together to make a picture' },
  { word: 'FLOWER', clue: 'A colorful bloom that bees visit' },
  { word: 'DRAGON', clue: 'A fire-breathing creature from stories' },
  { word: 'SCHOOL', clue: 'Where you go to learn with a teacher' },
  { word: 'BASKET', clue: 'You carry things in it, or shoot a ball into it' },
  { word: 'PIRATE', clue: 'A sailor who hunts for treasure' },
  { word: 'PENGUIN', clue: 'A bird that cannot fly but swims well' },
  { word: 'DOLPHIN', clue: 'A smart sea animal that clicks and jumps' },
  { word: 'RAINBOW', clue: 'Colors in the sky after the rain' },
  { word: 'BLANKET', clue: 'It keeps you warm in bed' },
  { word: 'KITCHEN', clue: 'The room where food is cooked' },
  { word: 'TEACHER', clue: 'The person who helps a class learn' },
  { word: 'PICNIC', clue: 'A meal eaten outside on a blanket' },
  { word: 'VOLCANO', clue: 'A mountain that can erupt with lava' },
  { word: 'GIRAFFE', clue: 'The animal with the longest neck' },
  { word: 'LIBRARY', clue: 'A place full of books to borrow' },
  { word: 'PUMPKIN', clue: 'A big orange squash carved at Halloween' },
  { word: 'BALLOON', clue: 'Fill it with air and it floats at parties' },
  { word: 'COOKIES', clue: 'Sweet baked treats, maybe with chocolate chips' },
  { word: 'TRUMPET', clue: 'A brass instrument you blow into' },
  { word: 'HAMSTER', clue: 'A small pet that runs on a wheel' },
  { word: 'MONSTER', clue: 'A make-believe creature that might be scary' },
];
const WORDS_PER_ROUND = 5;

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

  const [hintsUsed, setHintsUsed] = useState<number>(0);   // letters shown on this word
  const [wrongTries, setWrongTries] = useState<number>(0); // full wrong spellings on this word (Skip shows after one)

  const preparePuzzles = useCallback(() => {
    // Pick 5 random words of this level's length (Fisher-Yates, so every word is equally likely)
    const bank = [...(difficulty === '4-letter' ? SHORT_WORDS : LONG_WORDS)];
    for (let i = bank.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bank[i], bank[j]] = [bank[j], bank[i]]; }
    const shuffled = bank.slice(0, WORDS_PER_ROUND);
    const prepared = shuffled.map(p => {
      const letters = p.word.split('');
      // Scramble ensuring it's not already in target order
      let scrambled = [...letters];
      for (let tries = 0; tries < 10 && scrambled.join('') === p.word; tries++) {
        for (let i = scrambled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]]; }
      }
      return {
        word: p.word,
        clue: p.clue,
        scrambled,
      };
    });
    setPuzzleList(prepared);
  }, [difficulty]);

  const startGame = () => {
    playTap();
    preparePuzzles();
    setGameState('PLAYING');
    setCurrentIndex(0);
    setUserLetters([]);
    setUsedIndices(new Set());
    setScore(0);
    setCorrectCount(0);
    setHintsUsed(0);
    setWrongTries(0);
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
        // Solved: counts as right with at most one hint letter; more hints still score, just fewer points
        const solvedFair = hintsUsed <= 1;
        playSuccess();
        if (solvedFair) setCorrectCount(c => c + 1);
        setScore(s => s + Math.max(50, 200 - hintsUsed * 50 - wrongTries * 20));

        setTimeout(() => {
          advanceWord(solvedFair);
        }, 500);
      } else {
        // Incorrect: clear back to the hint letters so they can retry (a Skip button shows after the first miss)
        playError();
        setWrongTries(t => t + 1);
        setTimeout(() => {
          fillHint(hintsUsed);
        }, 600);
      }
    }
  };

  /* the first n letters of the word, placed for the student (a hint) */
  const fillHint = (n: number) => {
    const placed: Array<{ letter: string; originalIndex: number }> = [], used = new Set<number>();
    for (const letter of currentPuzzle.word.slice(0, n)) {
      const idx = currentPuzzle.scrambled.findIndex((l, i) => l === letter && !used.has(i));
      if (idx < 0) break;
      used.add(idx); placed.push({ letter, originalIndex: idx });
    }
    setUserLetters(placed); setUsedIndices(used);
  };
  const handleHint = () => {
    if (hintsUsed >= currentPuzzle.word.length - 1) return;
    playTap();
    const n = hintsUsed + 1;
    setHintsUsed(n); fillHint(n);
  };
  const handleSkip = () => {
    playError();
    advanceWord(false);
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
    setHintsUsed(0);
    setWrongTries(0);

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
            Word Builder
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Read the clue, then tap the mixed-up letters in order to spell the word. Stuck? Tap 💡 to see a letter.
          </p>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-pink-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && currentPuzzle && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Word <strong className="text-white font-mono">{currentIndex + 1}</strong> / {puzzleList.length}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Clue Prompt */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-pink-400 font-semibold block mb-1">Clue</span>
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
            <button
              onClick={handleHint}
              disabled={hintsUsed >= currentPuzzle.word.length - 1}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-amber-300 disabled:opacity-40 transition-colors cursor-pointer"
            >
              💡 Show a letter
            </button>
            {wrongTries > 0 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip this word
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Nice work!</h2>
          <p className="text-slate-400 text-sm mb-6">Every round has new words. Try again to beat your score.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Words spelled</span>
              <span className="text-xl font-bold text-pink-400 font-mono tabular-nums">
                {correctCount} / {puzzleList.length}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Accuracy</span>
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
