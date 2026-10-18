import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, X, Layers, Shuffle, Sparkles } from 'lucide-react';

interface CardSortProps {
  difficulty?: string;
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

type CardColor = 'red' | 'blue' | 'green' | 'yellow';
type CardShape = 'circle' | 'triangle' | 'star' | 'cross';
type CardCount = 1 | 2 | 3 | 4;
type SortingDimension = 'color' | 'shape' | 'count';

interface SortingCard {
  color: CardColor;
  shape: CardShape;
  count: CardCount;
}

const COLOR_MAP: Record<CardColor, string> = {
  red: '#ff334b',
  blue: '#38bdf8',
  green: '#22c55e',
  yellow: '#fde047',
};

// 4 standardized reference target decks (Classic WCST)
const TARGET_DECKS: SortingCard[] = [
  { color: 'red', shape: 'circle', count: 1 },
  { color: 'green', shape: 'triangle', count: 2 },
  { color: 'blue', shape: 'cross', count: 3 },
  { color: 'yellow', shape: 'star', count: 4 },
];

const TOTAL_CARDS = 25;
const SHIFT_THRESHOLD = 5; // Rules shift every 5 consecutive correct sorts

export const CardSortingGame: React.FC<CardSortProps> = ({
  difficulty = 'standard',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [currentRule, setCurrentRule] = useState<SortingDimension>('color');
  const [activeCard, setActiveCard] = useState<SortingCard>({
    color: 'red',
    shape: 'triangle',
    count: 3,
  });

  const [ruleStreak, setRuleStreak] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [correctSorts, setCorrectSorts] = useState<number>(0);
  const [perseverationErrors, setPerseverationErrors] = useState<number>(0);
  const [rulesDiscovered, setRulesDiscovered] = useState<number>(0);
  const previousRuleRef = useRef<SortingDimension | null>(null);

  const cardStartTimeRef = useRef<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Generate random card
  const generateRandomCard = useCallback((): SortingCard => {
    const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
    const shapes: CardShape[] = ['circle', 'triangle', 'star', 'cross'];
    const counts: CardCount[] = [1, 2, 3, 4];

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      count: counts[Math.floor(Math.random() * counts.length)],
    };
  }, []);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setCardIndex(0);
    setScore(0);
    setCorrectSorts(0);
    setPerseverationErrors(0);
    setRulesDiscovered(1);
    setRuleStreak(0);
    setLastFeedback(null);
    setReactionTimes([]);

    // Random initial rule
    const rules: SortingDimension[] = ['color', 'shape', 'count'];
    const initialRule = rules[Math.floor(Math.random() * rules.length)];
    setCurrentRule(initialRule);
    previousRuleRef.current = null;

    setActiveCard(generateRandomCard());
    cardStartTimeRef.current = Date.now();
  };

  const handleDeckChoice = (deckIndex: number) => {
    if (gameState !== 'PLAYING') return;

    const rt = Date.now() - cardStartTimeRef.current;
    const targetDeck = TARGET_DECKS[deckIndex];

    // Check if matches active dimension
    const isCorrect =
      currentRule === 'color'
        ? activeCard.color === targetDeck.color
        : currentRule === 'shape'
        ? activeCard.shape === targetDeck.shape
        : activeCard.count === targetDeck.count;

    if (isCorrect) {
      playSuccess();
      setCorrectSorts(c => c + 1);
      const newStreak = ruleStreak + 1;
      setRuleStreak(newStreak);
      setScore(s => s + 50 + newStreak * 10);
      setLastFeedback({ isCorrect: true, message: '✓ Correctly Sorted' });

      // Check if threshold reached to SHIFT RULE!
      if (newStreak >= SHIFT_THRESHOLD) {
        playStreak();
        // Shift rule to a different dimension!
        const dimensions: SortingDimension[] = ['color', 'shape', 'count'];
        const remaining = dimensions.filter(d => d !== currentRule);
        const nextRule = remaining[Math.floor(Math.random() * remaining.length)];

        previousRuleRef.current = currentRule;
        setCurrentRule(nextRule);
        setRuleStreak(0);
        setRulesDiscovered(r => r + 1);
        setLastFeedback({ isCorrect: true, message: '★ Rule Mastered! Rule has now shifted...' });
      }
    } else {
      playError();
      setRuleStreak(0);

      // Check if perseveration error (repeating old rule after shift)
      if (previousRuleRef.current) {
        const matchesOld =
          previousRuleRef.current === 'color'
            ? activeCard.color === targetDeck.color
            : previousRuleRef.current === 'shape'
            ? activeCard.shape === targetDeck.shape
            : activeCard.count === targetDeck.count;

        if (matchesOld) {
          setPerseverationErrors(p => p + 1);
        }
      }

      setLastFeedback({ isCorrect: false, message: '✕ Incorrect Match' });
    }

    setReactionTimes(prev => [...prev, rt]);

    if (cardIndex + 1 >= TOTAL_CARDS) {
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 1100;

      const accuracy = Math.round(((correctSorts + (isCorrect ? 1 : 0)) / TOTAL_CARDS) * 100);

      const result: GameResult = {
        gameId: 'card-sorting',
        score: score + (isCorrect ? 50 : 0),
        accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_CARDS * 2.5)),
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      setCardIndex(i => i + 1);
      setActiveCard(generateRandomCard());
      cardStartTimeRef.current = Date.now();
    }
  };

  const renderShapeIcon = (shape: CardShape, color: CardColor) => {
    const hex = COLOR_MAP[color];
    switch (shape) {
      case 'circle':
        return <div className="w-5 h-5 rounded-full" style={{ backgroundColor: hex }} />;
      case 'triangle':
        return (
          <div
            className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px]"
            style={{ borderBottomColor: hex }}
          />
        );
      case 'star':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: hex }}>
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        );
      case 'cross':
        return (
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div className="absolute w-5 h-1.5 rounded-full" style={{ backgroundColor: hex }} />
            <div className="absolute w-1.5 h-5 rounded-full" style={{ backgroundColor: hex }} />
          </div>
        );
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
            <Layers className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Neuro Card Sort (WCST Adaptation)
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Based on the legendary Wisconsin Card Sorting Test. You are shown a card that varies by <strong>Color, Shape, and Count</strong>. Match it with one of the 4 target decks. The sorting rule is hidden — you must deduce it from feedback. Beware: <em>the rule will shift without warning!</em>
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto text-xs text-slate-300 text-center">
            <span className="font-semibold text-white block mb-1">Target Brain Machinery:</span>
            <span>Orbitofrontal Cortex (BA 11) & Striatum. Measures cognitive set shifting and resistance to perseveration errors.</span>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-600/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Card Sort</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Card <strong className="text-white font-mono">{cardIndex + 1}</strong> / {TOTAL_CARDS}</span>
              <span aria-hidden="true">·</span>
              <span>Rule Streak: <strong className="text-amber-400 font-mono">{ruleStreak} / {SHIFT_THRESHOLD}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* 4 Reference Target Decks */}
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block text-center mb-3">
              Target Piles (Click a pile to sort active card)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {TARGET_DECKS.map((deck, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDeckChoice(idx)}
                  className="h-32 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Deck {idx + 1}
                  </span>
                  <div className="flex flex-wrap gap-1.5 items-center justify-center min-h-[44px]">
                    {Array.from({ length: deck.count }).map((_, cIdx) => (
                      <React.Fragment key={cIdx}>
                        {renderShapeIcon(deck.shape, deck.color)}
                      </React.Fragment>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Bar */}
          {lastFeedback && (
            <div className="flex justify-center">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all animate-in fade-in duration-100 ${
                  lastFeedback.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                }`}
              >
                {lastFeedback.message}
              </span>
            </div>
          )}

          {/* Active Card to Sort */}
          <div className="flex flex-col items-center justify-center my-2">
            <span className="text-xs uppercase font-mono text-slate-400 mb-2">
              Active Card to Match
            </span>
            <div className="w-36 h-48 bg-slate-950 rounded-2xl border-2 border-indigo-500/50 shadow-xl flex flex-col items-center justify-center gap-3 p-4">
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {Array.from({ length: activeCard.count }).map((_, cIdx) => (
                  <React.Fragment key={cIdx}>
                    {renderShapeIcon(activeCard.shape, activeCard.color)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Card Sorting Complete</h2>
            <p className="text-slate-400 text-sm">Orbitofrontal Cortex (BA 11) & Striatal Flexibility Stimulated</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Correct Sorts</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {correctSorts} / {TOTAL_CARDS}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Rules Shifted</span>
              <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">{rulesDiscovered}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Perseveration Errors</span>
              <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">{perseverationErrors}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sort Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
