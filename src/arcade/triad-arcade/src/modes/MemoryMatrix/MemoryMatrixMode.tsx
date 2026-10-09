import React, { useState, useEffect, useRef } from 'react';
import { MatrixCard, MatrixDifficulty, MatrixTheme } from '../../types';
import { sounds } from '../../utils/audio';
import { Flame, Clock, RefreshCw, Sparkles, Award } from 'lucide-react';

interface MemoryMatrixModeProps {
  onCompleteGame: (score: number, metrics: { time: string; flips: number; accuracy: number; difficulty: string }) => void;
}

const THEME_ICONS: Record<MatrixTheme, { label: string; icon: string; subtitle: string }[]> = {
  ROYAL_CASINO: [
    { label: 'Ace', icon: '♠', subtitle: 'High Spade' },
    { label: 'King', icon: '👑', subtitle: 'Royal Crown' },
    { label: 'Queen', icon: '♥', subtitle: 'Heart Ruby' },
    { label: 'Jack', icon: '♣', subtitle: 'Club Knave' },
    { label: 'Diamond', icon: '♦', subtitle: 'Brilliant Gem' },
    { label: 'Dice', icon: '🎲', subtitle: 'Lucky Roll' },
    { label: 'Bell', icon: '🔔', subtitle: 'Liberty Bell' },
    { label: 'Clover', icon: '🍀', subtitle: 'Four Leaf' },
    { label: 'Horseshoe', icon: '🧲', subtitle: 'Silver Shoe' },
    { label: 'Seven', icon: '7️⃣', subtitle: 'Triple Jackpot' },
    { label: 'Chips', icon: '🪙', subtitle: 'Gold Stack' },
    { label: 'Chest', icon: '💎', subtitle: 'Vault Stash' },
    { label: 'Grape', icon: '🍇', subtitle: 'Fruit Reel' },
    { label: 'Cherry', icon: '🍒', subtitle: 'Classic Spin' },
    { label: 'Shield', icon: '🛡️', subtitle: 'High Roller' },
    { label: 'Goblet', icon: '🏆', subtitle: 'Trophy Cup' },
    { label: 'Star', icon: '⭐', subtitle: 'VIP Star' },
    { label: 'Mask', icon: '🎭', subtitle: 'Dealer Bluff' },
    { label: 'Crown', icon: '🤴', subtitle: 'Monarch' },
    { label: 'Ring', icon: '💍', subtitle: 'Signet Gem' },
    { label: 'Coin', icon: '💰', subtitle: 'Money Bag' },
    { label: 'Flame', icon: '🔥', subtitle: 'Hot Streak' },
    { label: 'Lion', icon: '🦁', subtitle: 'Pride Banner' },
    { label: 'Eagle', icon: '🦅', subtitle: 'Golden Crest' },
  ],
  MYSTIC_ARCANA: [
    { label: 'Sun', icon: '☀️', subtitle: 'Solar Radiance' },
    { label: 'Moon', icon: '🌙', subtitle: 'Crescent Veil' },
    { label: 'Star', icon: '✨', subtitle: 'Starlight Prism' },
    { label: 'Orb', icon: '🔮', subtitle: 'Scrying Sphere' },
    { label: 'Hourglass', icon: '⏳', subtitle: 'Sands of Fate' },
    { label: 'Potion', icon: '🧪', subtitle: 'Elixir of Life' },
    { label: 'Tome', icon: '📖', subtitle: 'Grimoire Rune' },
    { label: 'Key', icon: '🗝️', subtitle: 'Golden Portal' },
    { label: 'Sword', icon: '⚔️', subtitle: 'Blade of Dawn' },
    { label: 'Ring', icon: '💍', subtitle: 'Ring of Power' },
    { label: 'Mirror', icon: '🪞', subtitle: 'Truth Shard' },
    { label: 'Flame', icon: '🔥', subtitle: 'Sacred Pyre' },
    { label: 'Chalice', icon: '🏺', subtitle: 'Sacred Vessel' },
    { label: 'Scroll', icon: '📜', subtitle: 'Ancient Oath' },
    { label: 'Crystal', icon: '💎', subtitle: 'Aether Shard' },
    { label: 'Compass', icon: '🧭', subtitle: 'Astral Needle' },
    { label: 'Feather', icon: '🪶', subtitle: 'Raven Quill' },
    { label: 'Crown', icon: '👑', subtitle: 'Elder Crown' },
    { label: 'Dagger', icon: '🗡️', subtitle: 'Rune Blade' },
    { label: 'Owl', icon: '🦉', subtitle: 'Astral Familiar' },
    { label: 'Serpent', icon: '🐍', subtitle: 'Ouroboros' },
    { label: 'Comet', icon: '☄️', subtitle: 'Skyward Omen' },
    { label: 'Trident', icon: '🔱', subtitle: 'Abyssal Fork' },
    { label: 'Lantern', icon: '🏮', subtitle: 'Spirit Beacon' },
  ],
  RETRO_ARCADE: [
    { label: 'Ghost', icon: '👻', subtitle: 'Pixel Phantom' },
    { label: 'Alien', icon: '👾', subtitle: 'Space Invader' },
    { label: 'Gamepad', icon: '🎮', subtitle: '8-Bit Joypad' },
    { label: 'Joystick', icon: '🕹️', subtitle: 'Arcade Stick' },
    { label: 'Rocket', icon: '🚀', subtitle: 'Vector Ship' },
    { label: 'Coin', icon: '🪙', subtitle: 'Insert Token' },
    { label: 'Heart', icon: '❤️', subtitle: 'Extra Life' },
    { label: 'Bomb', icon: '💣', subtitle: 'Screen Clear' },
    { label: 'Bolt', icon: '⚡', subtitle: 'Turbo Boost' },
    { label: 'Disk', icon: '💾', subtitle: 'Save Point' },
    { label: 'Robot', icon: '🤖', subtitle: 'Automaton' },
    { label: 'Laser', icon: '🔫', subtitle: 'Ray Blaster' },
    { label: 'Mushroom', icon: '🍄', subtitle: 'Power Shroom' },
    { label: 'Key', icon: '🔑', subtitle: 'Boss Key' },
    { label: 'Skull', icon: '💀', subtitle: 'Game Over' },
    { label: 'Chest', icon: '📦', subtitle: 'Loot Box' },
    { label: 'Flag', icon: '🚩', subtitle: 'Checkpoint' },
    { label: 'Crown', icon: '👑', subtitle: 'High Score' },
    { label: 'Diamond', icon: '💎', subtitle: 'Bonus Gem' },
    { label: 'Cassette', icon: '📼', subtitle: 'Chiptune Tape' },
    { label: 'Battery', icon: '🔋', subtitle: 'Full Power' },
    { label: 'Target', icon: '🎯', subtitle: 'Bullseye' },
    { label: 'Diamond', icon: '🔮', subtitle: 'Magic Token' },
    { label: 'Fireball', icon: '💥', subtitle: 'Combo Blast' },
  ],
};

const DIFFICULTY_PAIRS: Record<MatrixDifficulty, { pairs: number; cols: string; label: string; cardCount: number }> = {
  CASUAL: { pairs: 6, cols: 'grid-cols-3 sm:grid-cols-4', label: 'Casual (12)', cardCount: 12 },
  STANDARD: { pairs: 8, cols: 'grid-cols-4', label: 'Standard (16)', cardCount: 16 },
  CHALLENGE: { pairs: 12, cols: 'grid-cols-4 sm:grid-cols-6', label: 'Challenge (24)', cardCount: 24 },
  GRAND: { pairs: 18, cols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6', label: 'Grand (36)', cardCount: 36 },
  COLOSSAL: { pairs: 24, cols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8', label: 'Colossal (48)', cardCount: 48 },
};

function generateCards(theme: MatrixTheme, difficulty: MatrixDifficulty): MatrixCard[] {
  const count = DIFFICULTY_PAIRS[difficulty].pairs;
  const pool = THEME_ICONS[theme].slice(0, count);

  const cards: MatrixCard[] = [];
  pool.forEach((item, index) => {
    // Card A
    cards.push({
      id: `c-${index}-a`,
      pairId: `pair-${index}`,
      label: item.label,
      iconName: item.icon,
      subtitle: item.subtitle,
      isFlipped: false,
      isMatched: false,
    });
    // Card B
    cards.push({
      id: `c-${index}-b`,
      pairId: `pair-${index}`,
      label: item.label,
      iconName: item.icon,
      subtitle: item.subtitle,
      isFlipped: false,
      isMatched: false,
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export const MemoryMatrixMode: React.FC<MemoryMatrixModeProps> = ({ onCompleteGame }) => {
  const [theme, setTheme] = useState<MatrixTheme>('ROYAL_CASINO');
  const [difficulty, setDifficulty] = useState<MatrixDifficulty>('STANDARD');
  const [cards, setCards] = useState<MatrixCard[]>(() => generateCards('ROYAL_CASINO', 'STANDARD'));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [flips, setFlips] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleRestart = (newTheme = theme, newDiff = difficulty) => {
    sounds.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setCards(generateCards(newTheme, newDiff));
    setFlippedIndices([]);
    setFlips(0);
    setMatchedPairs(0);
    setStreak(0);
    setScore(0);
    setElapsedSeconds(0);
    setIsPlaying(false);
  };

  const totalPairs = DIFFICULTY_PAIRS[difficulty].pairs;

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    if (!isPlaying) setIsPlaying(true);
    sounds.playCardFlip();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Flip card visually
    const nextCards = cards.map((c, idx) => (idx === index ? { ...c, isFlipped: true } : c));
    setCards(nextCards);

    if (newFlipped.length === 2) {
      setFlips((prev) => prev + 1);
      const cardA = nextCards[newFlipped[0]];
      const cardB = nextCards[newFlipped[1]];

      if (cardA.pairId === cardB.pairId) {
        // MATCH!
        sounds.playMatchSuccess();
        const nextStreak = streak + 1;
        setStreak(nextStreak);

        const streakBonus = nextStreak * 200;
        const pairPoints = 500 + streakBonus;
        setScore((prev) => prev + pairPoints);

        const nextMatches = matchedPairs + 1;
        setMatchedPairs(nextMatches);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === newFlipped[0] || idx === newFlipped[1]
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIndices([]);

          // Check for Victory!
          if (nextMatches >= totalPairs) {
            setIsPlaying(false);
            sounds.playVictoryFanfare();

            // Calculate final composite score
            const timeBonus = Math.max(0, 3000 - elapsedSeconds * 25);
            const accuracy = Math.round((totalPairs / Math.max(1, flips + 1)) * 100);
            const accuracyBonus = accuracy * 20;
            const finalScore = score + pairPoints + timeBonus + accuracyBonus;

            onCompleteGame(finalScore, {
              time: `${elapsedSeconds}s`,
              flips: flips + 1,
              accuracy,
              difficulty,
            });
          }
        }, 400);
      } else {
        // MISMATCH
        sounds.playMismatch();
        setStreak(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === newFlipped[0] || idx === newFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top HUD: Unobtrusive game status & meters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        {/* Score & Timers */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Matrix Score</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Timer</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-slate-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Pairs Matched</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {matchedPairs}/{totalPairs}
            </div>
          </div>
        </div>

        {/* Combos & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>x{streak} Streak Combo</span>
            </div>
          )}

          {/* Difficulty selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {(['CASUAL', 'STANDARD', 'CHALLENGE', 'GRAND', 'COLOSSAL'] as MatrixDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  handleRestart(theme, d);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  difficulty === d
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {DIFFICULTY_PAIRS[d].label}
              </button>
            ))}
          </div>

          {/* Theme selector */}
          <select
            value={theme}
            onChange={(e) => {
              const val = e.target.value as MatrixTheme;
              setTheme(val);
              handleRestart(val, difficulty);
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="ROYAL_CASINO">Royal Casino</option>
            <option value="MYSTIC_ARCANA">Mystic Arcana</option>
            <option value="RETRO_ARCADE">Retro Arcade</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => handleRestart()}
            title="Reset Board"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className={`grid gap-3 sm:gap-4 ${DIFFICULTY_PAIRS[difficulty].cols}`}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || card.isFlipped}
              className={`aspect-4/3 sm:aspect-square rounded-2xl border select-none perspective-1000 transition-all duration-200 ${
                card.isMatched
                  ? 'opacity-40 bg-emerald-950/40 border-emerald-700/50 cursor-default scale-95'
                  : card.isFlipped
                  ? 'bg-slate-950 border-amber-400/90 shadow-xl ring-2 ring-amber-400'
                  : 'bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 border-slate-700/80 hover:border-amber-400/60 hover:-translate-y-1 hover:shadow-lg cursor-pointer'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <span className="text-3xl sm:text-4xl drop-shadow-sm mb-1">{card.iconName}</span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-full">
                    {card.label}
                  </span>
                  {card.subtitle && (
                    <span className="text-[10px] text-slate-400 hidden sm:block truncate">
                      {card.subtitle}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-400/70 text-xs font-serif font-bold">
                    ◈
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
