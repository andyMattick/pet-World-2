import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BingoCell, BingoBall, BingoPatternType, BingoPatternOption, DauberStyle } from '../../types';
import { sounds } from '../../utils/audio';
import {
  Play,
  Pause,
  ChevronRight,
  Bot,
  User,
  RefreshCw,
  Trophy,
  Dices,
  Volume2,
  VolumeX,
  Grid3X3,
  Sparkles,
  X,
} from 'lucide-react';

interface BingoDuelModeProps {
  onCompleteGame: (score: number, metrics: { pattern: string; calls: number; winner: 'PLAYER' | 'COMPUTER' }) => void;
  playerName: string;
}

const BINGO_LETTERS: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];

const ALL_PATTERNS: BingoPatternType[] = [
  'LINE',
  'FOUR_CORNERS',
  'POSTAGE_STAMP',
  'PLUS_SIGN',
  'LETTER_X',
  'PICTURE_FRAME',
  'BLACKOUT',
];

const PATTERN_CONFIGS: Record<
  BingoPatternType,
  {
    name: string;
    description: string;
    points: number;
    check: (card: BingoCell[][]) => boolean;
    getProgress: (card: BingoCell[][]) => { needed: number; total: number };
    getMiniGrid: () => boolean[][];
  }
> = {
  LINE: {
    name: 'Standard Line',
    description: 'Any horizontal, vertical, or diagonal line of 5',
    points: 1500,
    check: (card) => {
      for (let r = 0; r < 5; r++) {
        if (card[r].every((c) => c.isDaubed)) return true;
      }
      for (let c = 0; c < 5; c++) {
        if (card.every((row) => row[c].isDaubed)) return true;
      }
      if (card[0][0].isDaubed && card[1][1].isDaubed && card[2][2].isDaubed && card[3][3].isDaubed && card[4][4].isDaubed) return true;
      if (card[0][4].isDaubed && card[1][3].isDaubed && card[2][2].isDaubed && card[3][1].isDaubed && card[4][0].isDaubed) return true;
      return false;
    },
    getProgress: (card) => {
      let maxDaubed = 0;
      for (let r = 0; r < 5; r++) {
        const daubed = card[r].filter((c) => c.isDaubed).length;
        if (daubed > maxDaubed) maxDaubed = daubed;
      }
      for (let c = 0; c < 5; c++) {
        const daubed = card.filter((row) => row[c].isDaubed).length;
        if (daubed > maxDaubed) maxDaubed = daubed;
      }
      const diag1 = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]].filter((c) => c.isDaubed).length;
      const diag2 = [card[0][4], card[1][3], card[2][2], card[3][1], card[4][0]].filter((c) => c.isDaubed).length;
      maxDaubed = Math.max(maxDaubed, diag1, diag2);
      return { needed: Math.max(0, 5 - maxDaubed), total: 5 };
    },
    getMiniGrid: () => [
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
    ],
  },
  FOUR_CORNERS: {
    name: 'Four Corners',
    description: 'All 4 outer corner squares',
    points: 1800,
    check: (card) =>
      card[0][0].isDaubed && card[0][4].isDaubed && card[4][0].isDaubed && card[4][4].isDaubed,
    getProgress: (card) => {
      const corners = [card[0][0], card[0][4], card[4][0], card[4][4]];
      const daubed = corners.filter((c) => c.isDaubed).length;
      return { needed: 4 - daubed, total: 4 };
    },
    getMiniGrid: () => [
      [true, false, false, false, true],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [true, false, false, false, true],
    ],
  },
  POSTAGE_STAMP: {
    name: 'Postage Stamp',
    description: 'A 2x2 square in any of the 4 corners',
    points: 2000,
    check: (card) => {
      const stampTL = card[0][0].isDaubed && card[0][1].isDaubed && card[1][0].isDaubed && card[1][1].isDaubed;
      const stampTR = card[0][3].isDaubed && card[0][4].isDaubed && card[1][3].isDaubed && card[1][4].isDaubed;
      const stampBL = card[3][0].isDaubed && card[3][1].isDaubed && card[4][0].isDaubed && card[4][1].isDaubed;
      const stampBR = card[3][3].isDaubed && card[3][4].isDaubed && card[4][3].isDaubed && card[4][4].isDaubed;
      return stampTL || stampTR || stampBL || stampBR;
    },
    getProgress: (card) => {
      const stamps = [
        [card[0][0], card[0][1], card[1][0], card[1][1]],
        [card[0][3], card[0][4], card[1][3], card[1][4]],
        [card[3][0], card[3][1], card[4][0], card[4][1]],
        [card[3][3], card[3][4], card[4][3], card[4][4]],
      ];
      let maxDaubed = 0;
      stamps.forEach((s) => {
        const d = s.filter((c) => c.isDaubed).length;
        if (d > maxDaubed) maxDaubed = d;
      });
      return { needed: 4 - maxDaubed, total: 4 };
    },
    getMiniGrid: () => [
      [true, true, false, false, false],
      [true, true, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ],
  },
  LETTER_X: {
    name: 'Letter X',
    description: 'Both diagonal lines forming a giant X',
    points: 2800,
    check: (card) => {
      const diag1 = card[0][0].isDaubed && card[1][1].isDaubed && card[2][2].isDaubed && card[3][3].isDaubed && card[4][4].isDaubed;
      const diag2 = card[0][4].isDaubed && card[1][3].isDaubed && card[2][2].isDaubed && card[3][1].isDaubed && card[4][0].isDaubed;
      return diag1 && diag2;
    },
    getProgress: (card) => {
      const xCells = new Set([
        card[0][0], card[1][1], card[2][2], card[3][3], card[4][4],
        card[0][4], card[1][3], card[3][1], card[4][0],
      ]);
      const daubed = Array.from(xCells).filter((c) => c.isDaubed).length;
      return { needed: 9 - daubed, total: 9 };
    },
    getMiniGrid: () => [
      [true, false, false, false, true],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [true, false, false, false, true],
    ],
  },
  PICTURE_FRAME: {
    name: 'Picture Frame',
    description: 'All 16 outer perimeter edge squares',
    points: 3500,
    check: (card) => {
      for (let i = 0; i < 5; i++) {
        if (!card[0][i].isDaubed || !card[4][i].isDaubed || !card[i][0].isDaubed || !card[i][4].isDaubed) {
          return false;
        }
      }
      return true;
    },
    getProgress: (card) => {
      const border = new Set<BingoCell>();
      for (let i = 0; i < 5; i++) {
        border.add(card[0][i]);
        border.add(card[4][i]);
        border.add(card[i][0]);
        border.add(card[i][4]);
      }
      const daubed = Array.from(border).filter((c) => c.isDaubed).length;
      return { needed: 16 - daubed, total: 16 };
    },
    getMiniGrid: () => [
      [true, true, true, true, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, true, true, true, true],
    ],
  },
  PLUS_SIGN: {
    name: 'Plus Sign (+)',
    description: 'Entire middle row & middle column',
    points: 2400,
    check: (card) => {
      const middleRow = card[2].every((c) => c.isDaubed);
      const middleCol = card.every((row) => row[2].isDaubed);
      return middleRow && middleCol;
    },
    getProgress: (card) => {
      const plusCells = new Set<BingoCell>();
      card[2].forEach((c) => plusCells.add(c));
      card.forEach((row) => plusCells.add(row[2]));
      const daubed = Array.from(plusCells).filter((c) => c.isDaubed).length;
      return { needed: 9 - daubed, total: 9 };
    },
    getMiniGrid: () => [
      [false, false, true, false, false],
      [false, false, true, false, false],
      [true, true, true, true, true],
      [false, false, true, false, false],
      [false, false, true, false, false],
    ],
  },
  BLACKOUT: {
    name: 'Blackout / Coverall',
    description: 'All 25 squares completely daubed',
    points: 5000,
    check: (card) => card.every((row) => row.every((c) => c.isDaubed)),
    getProgress: (card) => {
      const total = 25;
      const daubed = card.flat().filter((c) => c.isDaubed).length;
      return { needed: total - daubed, total };
    },
    getMiniGrid: () => [
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true],
    ],
  },
};

const DAUBER_STYLES: Record<DauberStyle, { label: string; icon: string; bg: string; border: string }> = {
  CLASSIC_RED: { label: 'Ruby Dauber', icon: '✓', bg: 'bg-emerald-500/30', border: 'border-emerald-300/50' },
  EMERALD_STAR: { label: 'Star Dauber', icon: '★', bg: 'bg-amber-500/30', border: 'border-amber-300/60' },
  GOLD_CROWN: { label: 'Royal Crown', icon: '👑', bg: 'bg-yellow-500/30', border: 'border-yellow-300/60' },
  NEON_HEART: { label: 'Heart Gem', icon: '♥', bg: 'bg-rose-500/30', border: 'border-rose-300/60' },
};

function getBallLetter(num: number): 'B' | 'I' | 'N' | 'G' | 'O' {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

function getBallColorClass(letter: 'B' | 'I' | 'N' | 'G' | 'O'): string {
  switch (letter) {
    case 'B':
      return 'bg-blue-600 text-white border-blue-400';
    case 'I':
      return 'bg-red-600 text-white border-red-400';
    case 'N':
      return 'bg-amber-500 text-slate-950 border-amber-300';
    case 'G':
      return 'bg-emerald-600 text-white border-emerald-400';
    case 'O':
      return 'bg-purple-600 text-white border-purple-400';
  }
}

function generateClassicCard(): BingoCell[][] {
  const card: BingoCell[][] = [];
  const colRanges = [
    { min: 1, max: 15 },
    { min: 16, max: 30 },
    { min: 31, max: 45 },
    { min: 46, max: 60 },
    { min: 61, max: 75 },
  ];

  const colNumbers: number[][] = [];
  colRanges.forEach(({ min, max }) => {
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(n)) nums.push(n);
    }
    nums.sort((a, b) => a - b);
    colNumbers.push(nums);
  });

  for (let r = 0; r < 5; r++) {
    const row: BingoCell[] = [];
    for (let c = 0; c < 5; c++) {
      const isCenter = r === 2 && c === 2;
      row.push({
        number: isCenter ? 0 : colNumbers[c][r],
        letter: BINGO_LETTERS[c],
        row: r,
        col: c,
        isDaubed: isCenter,
        isFree: isCenter,
      });
    }
    card.push(row);
  }

  return card;
}

export const BingoDuelMode: React.FC<BingoDuelModeProps> = ({ onCompleteGame, playerName }) => {
  const [selectedOption, setSelectedOption] = useState<BingoPatternOption>('RANDOM');
  const [activePattern, setActivePattern] = useState<BingoPatternType>('LINE');
  const [playerCard, setPlayerCard] = useState<BingoCell[][]>(() => generateClassicCard());
  const [botCard, setBotCard] = useState<BingoCell[][]>(() => generateClassicCard());

  // Ball Hopper RNG state
  const [uncalledPool, setUncalledPool] = useState<number[]>(() =>
    Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  );
  const [calledBalls, setCalledBalls] = useState<BingoBall[]>([]);
  const [currentBall, setCurrentBall] = useState<BingoBall | null>(null);

  // Settings
  const [isAutoCalling, setIsAutoCalling] = useState<boolean>(false);
  const [callerSpeedMs, setCallerSpeedMs] = useState<number>(2400);
  const [autoDaub, setAutoDaub] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => sounds.getVoiceEnabled());
  const [dauberStyle, setDauberStyle] = useState<DauberStyle>('CLASSIC_RED');
  const [showMasterBoard, setShowMasterBoard] = useState<boolean>(false);

  // Game Status
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'PLAYER' | 'COMPUTER' | null>(null);
  const [playerCanClaimBingo, setPlayerCanClaimBingo] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('🎲 Random Mystery Pattern active! Call balls to duel BingoBot.');
  const [isLockedIn, setIsLockedIn] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Pick a random pattern different from current
  const rollNewRandomPattern = useCallback((current: BingoPatternType): BingoPatternType => {
    const candidates = ALL_PATTERNS.filter((p) => p !== current);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    return chosen;
  }, []);

  // Initialize random pattern on mount if RANDOM is default
  useEffect(() => {
    if (selectedOption === 'RANDOM') {
      const initial = rollNewRandomPattern('LINE');
      setActivePattern(initial);
      setAnnouncement(`🎲 Mystery Pattern: ${PATTERN_CONFIGS[initial].name} (+${PATTERN_CONFIGS[initial].points} pts)!`);
    }
  }, [selectedOption, rollNewRandomPattern]);

  // Start fresh match
  const handleNewMatch = useCallback(
    (newOpt: BingoPatternOption = selectedOption) => {
      sounds.playClick();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsAutoCalling(false);
      setIsGameOver(false);
      setWinner(null);
      setPlayerCanClaimBingo(false);
      setIsLockedIn(false);

      setPlayerCard(generateClassicCard());
      setBotCard(generateClassicCard());

      const freshPool = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      setUncalledPool(freshPool);
      setCalledBalls([]);
      setCurrentBall(null);

      if (newOpt === 'RANDOM') {
        const rolled = rollNewRandomPattern(activePattern);
        setActivePattern(rolled);
        setAnnouncement(`🎲 Rolled Mystery Pattern: ${PATTERN_CONFIGS[rolled].name} (+${PATTERN_CONFIGS[rolled].points} pts)!`);
      } else {
        setActivePattern(newOpt);
        setAnnouncement(`Target: ${PATTERN_CONFIGS[newOpt].name} (+${PATTERN_CONFIGS[newOpt].points} pts)`);
      }
    },
    [selectedOption, activePattern, rollNewRandomPattern]
  );

  // Call Next Ball RNG
  const handleCallNextBall = useCallback(() => {
    if (isGameOver || uncalledPool.length === 0) {
      setIsAutoCalling(false);
      return;
    }

    // Automatically lock pattern once balls begin calling
    if (!isLockedIn) {
      setIsLockedIn(true);
    }

    sounds.playBallPop();

    const nextNum = uncalledPool[0];
    const restPool = uncalledPool.slice(1);
    const letter = getBallLetter(nextNum);
    const newBall: BingoBall = {
      number: nextNum,
      letter,
      id: `ball-${nextNum}-${Date.now()}`,
    };

    // Voice announcement
    sounds.speakCall(letter, nextNum);

    setUncalledPool(restPool);
    setCurrentBall(newBall);
    setCalledBalls((prev) => [newBall, ...prev]);

    // Computer bot reaction: Daubs its card automatically
    setTimeout(() => {
      setBotCard((prevCard) => {
        let didDaub = false;
        const updated = prevCard.map((row) =>
          row.map((cell) => {
            if (cell.number === nextNum && !cell.isDaubed) {
              didDaub = true;
              return { ...cell, isDaubed: true };
            }
            return cell;
          })
        );

        if (didDaub) {
          if (PATTERN_CONFIGS[activePattern].check(updated)) {
            // Bot Wins!
            setIsGameOver(true);
            setIsAutoCalling(false);
            setWinner('COMPUTER');
            sounds.playMismatch();
            setAnnouncement(`BingoBot called BINGO on ${newBall.letter}-${newBall.number}! Bot Wins!`);

            onCompleteGame(400, {
              pattern: PATTERN_CONFIGS[activePattern].name,
              calls: 75 - restPool.length,
              winner: 'COMPUTER',
            });
          }
        }
        return updated;
      });
    }, 450);

    // If auto-daub is enabled for player
    if (autoDaub) {
      setPlayerCard((prevCard) => {
        let didDaub = false;
        const updated = prevCard.map((row) =>
          row.map((cell) => {
            if (cell.number === nextNum && !cell.isDaubed) {
              didDaub = true;
              return { ...cell, isDaubed: true };
            }
            return cell;
          })
        );
        if (didDaub) {
          sounds.playDaub();
          if (PATTERN_CONFIGS[activePattern].check(updated)) {
            setPlayerCanClaimBingo(true);
          }
        }
        return updated;
      });
    }
  }, [isGameOver, uncalledPool, activePattern, autoDaub, onCompleteGame]);

  // Auto caller interval
  useEffect(() => {
    if (isAutoCalling && !isGameOver) {
      timerRef.current = window.setInterval(() => {
        handleCallNextBall();
      }, callerSpeedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoCalling, isGameOver, callerSpeedMs, handleCallNextBall]);

  // Player manual daub click
  const handlePlayerCellClick = (r: number, c: number) => {
    if (isGameOver) return;
    const targetCell = playerCard[r][c];
    if (targetCell.isDaubed) return;

    const wasCalled = calledBalls.some((b) => b.number === targetCell.number);
    if (wasCalled || targetCell.isFree) {
      sounds.playDaub();
      const updatedCard = playerCard.map((row, rowIdx) =>
        row.map((cell, colIdx) =>
          rowIdx === r && colIdx === c ? { ...cell, isDaubed: true } : cell
        )
      );
      setPlayerCard(updatedCard);

      if (PATTERN_CONFIGS[activePattern].check(updatedCard)) {
        setPlayerCanClaimBingo(true);
      }
    } else {
      sounds.playMismatch();
      setAnnouncement(`Number ${targetCell.letter}-${targetCell.number} hasn't been called yet!`);
      setTimeout(() => setAnnouncement(''), 2000);
    }
  };

  // Player Claims Bingo!
  const handleClaimBingo = () => {
    if (!playerCanClaimBingo || isGameOver) return;

    sounds.playVictoryFanfare();
    setIsGameOver(true);
    setIsAutoCalling(false);
    setWinner('PLAYER');

    const totalCalls = calledBalls.length;
    const patternBonus = PATTERN_CONFIGS[activePattern].points;
    const speedBonus = Math.max(0, 3500 - totalCalls * 50);
    const finalScore = patternBonus + speedBonus;

    setAnnouncement(`🎉 BINGO! You beat BingoBot to ${PATTERN_CONFIGS[activePattern].name}! Won +${finalScore} pts!`);

    onCompleteGame(finalScore, {
      pattern: PATTERN_CONFIGS[activePattern].name,
      calls: totalCalls,
      winner: 'PLAYER',
    });
  };

  const playerProgress = PATTERN_CONFIGS[activePattern].getProgress(playerCard);
  const botProgress = PATTERN_CONFIGS[activePattern].getProgress(botCard);
  const miniGrid = PATTERN_CONFIGS[activePattern].getMiniGrid();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top HUD: Pattern & Race Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        {/* Pattern Selector with RANDOM Mystery option & Mini Visualizer */}
        <div className="flex items-center gap-4">
          {/* Mini 5x5 Pattern Visualizer */}
          <div
            title={`Pattern Target: ${PATTERN_CONFIGS[activePattern].name}`}
            className="w-11 h-11 p-1 bg-slate-950 border border-amber-500/40 rounded-xl grid grid-cols-5 gap-0.5 shrink-0 shadow-inner"
          >
            {miniGrid.map((row, rIdx) =>
              row.map((active, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`rounded-xs ${active ? 'bg-amber-400' : 'bg-slate-800/60'}`}
                />
              ))
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
              <span>Game Pattern</span>
              {isLockedIn ? (
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded flex items-center gap-1 border border-amber-400/30">
                  🔒 Locked In
                </span>
              ) : selectedOption === 'RANDOM' ? (
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <Dices className="w-3 h-3" />
                  Auto-Rolls
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedOption}
                disabled={isLockedIn || isGameOver}
                onChange={(e) => {
                  const opt = e.target.value as BingoPatternOption;
                  setSelectedOption(opt);
                  handleNewMatch(opt);
                }}
                className={`px-3 py-1.5 bg-slate-950 border rounded-xl text-sm font-bold text-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400 ${
                  isLockedIn
                    ? 'border-slate-800 opacity-80 cursor-not-allowed'
                    : 'border-slate-700 cursor-pointer'
                }`}
              >
                <option value="RANDOM">🎲 Random Mystery Pattern</option>
                <option value="LINE">Standard Line (1,500 pts)</option>
                <option value="FOUR_CORNERS">Four Corners (1,800 pts)</option>
                <option value="POSTAGE_STAMP">Postage Stamp 2x2 (2,000 pts)</option>
                <option value="PLUS_SIGN">Plus Sign [+] (2,400 pts)</option>
                <option value="LETTER_X">Letter X (2,800 pts)</option>
                <option value="PICTURE_FRAME">Picture Frame (3,500 pts)</option>
                <option value="BLACKOUT">Blackout / Coverall (5,000 pts)</option>
              </select>

              {!isLockedIn && !isGameOver && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsLockedIn(true);
                    setAnnouncement(`Pattern "${PATTERN_CONFIGS[activePattern].name}" locked in for this game!`);
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Lock In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Race Status */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">You: </span>
              <span className={`font-mono font-bold ${playerProgress.needed === 0 ? 'text-amber-400 animate-pulse' : 'text-white'}`}>
                {playerProgress.needed === 0 ? 'READY!' : `${playerProgress.needed} needed`}
              </span>
            </div>
          </div>

          <div className="text-slate-600">vs</div>

          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-rose-400" />
            <div className="text-xs">
              <span className="text-slate-400">BingoBot: </span>
              <span className="font-mono font-bold text-rose-300">
                {botProgress.needed === 0 ? 'READY!' : `${botProgress.needed} needed`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Toggles: Master Board, Voice, Auto-Daub, Re-roll */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dauber Style Picker */}
          <select
            value={dauberStyle}
            onChange={(e) => setDauberStyle(e.target.value as DauberStyle)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium cursor-pointer"
            title="Custom Stamp Style"
          >
            <option value="CLASSIC_RED">✓ Stamp (Check)</option>
            <option value="EMERALD_STAR">★ Stamp (Star)</option>
            <option value="GOLD_CROWN">👑 Stamp (Crown)</option>
            <option value="NEON_HEART">♥ Stamp (Heart)</option>
          </select>

          {/* Master Board button */}
          <button
            onClick={() => setShowMasterBoard(true)}
            title="View 75-Ball Master Board"
            className="p-2 text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          {/* Voice Announcer Toggle */}
          <button
            onClick={() => {
              const next = sounds.toggleVoice();
              setVoiceEnabled(next);
            }}
            title={voiceEnabled ? 'Voice Caller ON' : 'Voice Caller OFF'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Daub */}
          <button
            onClick={() => setAutoDaub(!autoDaub)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              autoDaub
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Auto-Daub: {autoDaub ? 'ON' : 'OFF'}
          </button>

          {/* Reset / Roll Different Pattern */}
          <button
            onClick={() => handleNewMatch()}
            title={selectedOption === 'RANDOM' ? 'Roll Different Random Pattern & Restart' : 'Restart Match'}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
          >
            {selectedOption === 'RANDOM' ? <Dices className="w-4 h-4 text-amber-400" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Ball Caller Hopper Chamber */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Animated Hopper Ball */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {currentBall ? (
              <div
                key={currentBall.id}
                className={`w-20 h-20 rounded-full border-4 shadow-xl flex flex-col items-center justify-center animate-in zoom-in-75 duration-200 ${getBallColorClass(
                  currentBall.letter
                )}`}
              >
                <span className="text-xs font-black tracking-widest leading-none drop-shadow-xs">
                  {currentBall.letter}
                </span>
                <span className="text-2xl font-black font-mono leading-none mt-0.5">
                  {currentBall.number}
                </span>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-700 bg-slate-950/70 flex items-center justify-center text-xs text-slate-500 font-bold">
                HOPPER
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Call</div>
            <div className="text-xl sm:text-2xl font-display font-bold text-white">
              {currentBall ? `${currentBall.letter}-${currentBall.number}` : 'Ready to Roll'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Drawn: <span className="text-white font-mono font-bold">{calledBalls.length}</span> / 75
            </div>
          </div>
        </div>

        {/* Recent Calls Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-sm py-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mr-1 shrink-0">
            Recent:
          </span>
          {calledBalls.slice(1, 6).map((ball) => (
            <div
              key={ball.id}
              className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getBallColorClass(
                ball.letter
              )}`}
            >
              {ball.number}
            </div>
          ))}
          {calledBalls.length <= 1 && (
            <span className="text-xs text-slate-500 italic">Calls appear here</span>
          )}
        </div>

        {/* Caller Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCallNextBall}
            disabled={isGameOver || isAutoCalling || uncalledPool.length === 0}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Call Ball</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setIsAutoCalling(!isAutoCalling);
            }}
            disabled={isGameOver || uncalledPool.length === 0}
            className={`px-4 py-2.5 font-bold text-xs rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isAutoCalling
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isAutoCalling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoCalling ? 'Pause' : 'Auto Call'}</span>
          </button>

          <select
            value={callerSpeedMs}
            onChange={(e) => setCallerSpeedMs(Number(e.target.value))}
            className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium cursor-pointer"
          >
            <option value={3500}>Relaxed (3.5s)</option>
            <option value={2400}>Normal (2.4s)</option>
            <option value={1400}>Fast (1.4s)</option>
          </select>
        </div>
      </div>

      {/* Announcement Banner */}
      {announcement && (
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-amber-200 animate-in fade-in duration-200">
          {announcement}
        </div>
      )}

      {/* BIG BINGO CLAIM BUTTON */}
      {playerCanClaimBingo && !isGameOver && (
        <div className="flex justify-center animate-bounce">
          <button
            onClick={handleClaimBingo}
            className="py-4 px-10 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-display font-extrabold text-2xl rounded-2xl shadow-2xl shadow-amber-500/60 ring-4 ring-amber-300 transition-transform active:scale-95 cursor-pointer"
          >
            ★ CLAIM BINGO NOW! ★
          </button>
        </div>
      )}

      {/* Post-Game "Play Again (Roll Different Random)" Banner */}
      {isGameOver && (
        <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl text-center space-y-3">
          <div className="text-base font-bold text-white">
            {winner === 'PLAYER' ? '🏆 Victory Against BingoBot!' : '🤖 BingoBot Claimed the Win!'}
          </div>
          <p className="text-xs text-slate-400">
            Ready for another round? Clicking Play Again will roll to a fresh challenge pattern!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleNewMatch()}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>Play Again (Roll Different Random)</span>
            </button>
          </div>
        </div>
      )}

      {/* The Duel Arena: Player Card vs Computer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Player Board */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <span>{playerName}</span>
                  <span className="text-[10px] font-sans text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                    YOU
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Target: {PATTERN_CONFIGS[activePattern].name}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-amber-400">
              {playerProgress.needed === 0 ? 'BINGO READY!' : `${playerProgress.needed} to go`}
            </div>
          </div>

          {/* 5x5 Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {BINGO_LETTERS.map((letter) => (
              <div
                key={letter}
                className="h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-display font-bold text-base text-amber-400 shadow-xs"
              >
                {letter}
              </div>
            ))}

            {playerCard.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isCurrentlyCalled = currentBall?.number === cell.number;
                const isTargetCell = miniGrid[rIdx][cIdx];

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handlePlayerCellClick(rIdx, cIdx)}
                    disabled={cell.isDaubed}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-200 select-none ${
                      cell.isDaubed
                        ? 'bg-linear-to-br from-emerald-600 to-emerald-800 border-emerald-400 text-white shadow-inner font-bold cursor-default'
                        : isCurrentlyCalled
                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-black animate-pulse cursor-pointer shadow-lg ring-2 ring-amber-400'
                        : isTargetCell
                        ? 'bg-amber-500/12 border-amber-400/60 text-amber-100 hover:border-amber-300 hover:bg-amber-500/20 ring-1 ring-amber-400/30 shadow-xs cursor-pointer'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    {isTargetCell && !cell.isDaubed && (
                      <span
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs animate-pulse"
                        title="Winning Pattern Target"
                      />
                    )}

                    {cell.isFree ? (
                      <span className="text-[11px] font-extrabold tracking-wider text-amber-200">FREE</span>
                    ) : (
                      <span className="text-base sm:text-lg font-bold font-mono tabular-nums">
                        {cell.number}
                      </span>
                    )}

                    {cell.isDaubed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-daub">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold text-white shadow-sm ${DAUBER_STYLES[dauberStyle].bg} ${DAUBER_STYLES[dauberStyle].border}`}
                        >
                          {DAUBER_STYLES[dauberStyle].icon}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Computer Bot Board */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative opacity-95">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <span>BingoBot 3000</span>
                  <span className="text-[10px] font-sans text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded font-semibold">
                    AI OPPONENT
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Auto-daubs matches in real time</p>
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-rose-400">
              {botProgress.needed === 0 ? 'BINGO READY!' : `${botProgress.needed} to go`}
            </div>
          </div>

          {/* 5x5 Grid for Bot */}
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {BINGO_LETTERS.map((letter) => (
              <div
                key={letter}
                className="h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-display font-bold text-base text-rose-400 shadow-xs"
              >
                {letter}
              </div>
            ))}

            {botCard.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isTargetCell = miniGrid[rIdx][cIdx];

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative select-none ${
                      cell.isDaubed
                        ? 'bg-linear-to-br from-rose-700 to-rose-900 border-rose-400 text-white shadow-inner font-bold'
                        : isTargetCell
                        ? 'bg-rose-500/12 border-rose-400/50 text-rose-200 ring-1 ring-rose-400/25 shadow-xs'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    {isTargetCell && !cell.isDaubed && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-xs opacity-75" />
                    )}

                    {cell.isFree ? (
                      <span className="text-[11px] font-extrabold tracking-wider text-rose-200">FREE</span>
                    ) : (
                      <span className="text-base sm:text-lg font-bold font-mono tabular-nums">
                        {cell.number}
                      </span>
                    )}

                    {cell.isDaubed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-daub">
                        <div className="w-8 h-8 rounded-full border border-rose-300/40 bg-rose-500/30 flex items-center justify-center text-xs text-white">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 75-Ball Master Board Modal */}
      {showMasterBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-white">Master Caller Board (1-75)</h3>
              </div>
              <button
                onClick={() => setShowMasterBoard(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {BINGO_LETTERS.map((letter, colIdx) => {
                const min = colIdx * 15 + 1;
                const max = min + 14;
                const numbers = Array.from({ length: 15 }, (_, i) => min + i);

                return (
                  <div key={letter} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 font-display font-bold text-amber-300 flex items-center justify-center shrink-0">
                      {letter}
                    </div>
                    <div className="grid grid-cols-15 gap-1 flex-1">
                      {numbers.map((num) => {
                        const isCalled = calledBalls.some((b) => b.number === num);
                        return (
                          <div
                            key={num}
                            className={`aspect-square rounded flex items-center justify-center font-mono text-[11px] font-semibold border ${
                              isCalled
                                ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-xs'
                                : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>{calledBalls.length} of 75 balls drawn</span>
              <button
                onClick={() => setShowMasterBoard(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
