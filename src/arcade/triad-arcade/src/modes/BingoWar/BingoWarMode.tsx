import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BingoWarCell, BingoBall, StandardCard, CardSuit, CardRank } from '../../types';
import { PlayingCard } from '../../components/PlayingCard';
import { sounds } from '../../utils/audio';
import {
  Swords,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Zap,
  Bot,
  User,
  Wand2,
  CheckCircle2,
  RefreshCw,
  Target,
  Dices,
  Trash2,
  Edit3,
  Layers,
} from 'lucide-react';

interface BingoWarModeProps {
  onCompleteGame: (score: number, metrics: { patternCount: number; duelsWon: number; warsWon: number; winner: 'PLAYER' | 'COMPUTER' }) => void;
  playerName: string;
}

const BINGO_LETTERS: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];

const SUITS: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: { rank: CardRank; value: number }[] = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 11 },
  { rank: 'Q', value: 12 },
  { rank: 'K', value: 13 },
  { rank: 'A', value: 14 },
];

function drawCard(): StandardCard {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rankItem = RANKS[Math.floor(Math.random() * RANKS.length)];
  return {
    id: `war-card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    suit,
    rank: rankItem.rank,
    value: rankItem.value,
  };
}

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

function generateClassicCard(): BingoWarCell[][] {
  const card: BingoWarCell[][] = [];
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
    const row: BingoWarCell[] = [];
    for (let c = 0; c < 5; c++) {
      const isCenter = r === 2 && c === 2;
      row.push({
        number: isCenter ? 0 : colNumbers[c][r],
        letter: BINGO_LETTERS[c],
        row: r,
        col: c,
        isDaubed: isCenter,
        isFree: isCenter,
        isCustomTarget: false,
      });
    }
    card.push(row);
  }

  return card;
}

function generateRandomPatternCoords(count: number = 6): [number, number][] {
  const allCoords: [number, number][] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      allCoords.push([r, c]);
    }
  }
  for (let i = allCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
  }
  return allCoords.slice(0, count);
}

// Preset patterns for quick player setup
const PRESET_PATTERNS: Record<string, [number, number][]> = {
  DRAGON_BLADE: [
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 1], [2, 3]
  ],
  DIAMOND_SHIELD: [
    [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 1], [3, 3], [4, 2]
  ],
  LIGHTNING_BOLT: [
    [0, 3], [1, 2], [2, 1], [2, 2], [3, 1], [4, 0]
  ],
  WAR_CORNERS: [
    [0, 0], [0, 4], [4, 0], [4, 4], [1, 1], [3, 3]
  ],
  CROSSFIRE_X: [
    [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [0, 4], [1, 3], [3, 1], [4, 0]
  ],
  IRON_FORTRESS: [
    [0, 1], [0, 2], [0, 3], [4, 1], [4, 2], [4, 3], [2, 0], [2, 4]
  ],
};

export const BingoWarMode: React.FC<BingoWarModeProps> = ({ onCompleteGame, playerName }) => {
  // Phase 1: HIGHLIGHT_PATTERN vs Phase 2: ACTIVE_WAR
  const [phase, setPhase] = useState<'SETUP_PATTERN' | 'ACTIVE_WAR'>('SETUP_PATTERN');

  const [playerCard, setPlayerCard] = useState<BingoWarCell[][]>(() => {
    const init = generateClassicCard();
    // Default initial template (Diamond pattern)
    PRESET_PATTERNS.DRAGON_BLADE.forEach(([r, c]) => {
      init[r][c].isCustomTarget = true;
    });
    return init;
  });

  const [botCard, setBotCard] = useState<BingoWarCell[][]>(() => {
    const init = generateClassicCard();
    PRESET_PATTERNS.DIAMOND_SHIELD.forEach(([r, c]) => {
      init[r][c].isCustomTarget = true;
    });
    return init;
  });

  // War Duel & Hand States
  const [playerHand, setPlayerHand] = useState<StandardCard[]>(() => [
    drawCard(),
    drawCard(),
    drawCard(),
    drawCard(),
  ]);
  const [botHand, setBotHand] = useState<StandardCard[]>(() => [
    drawCard(),
    drawCard(),
    drawCard(),
    drawCard(),
  ]);
  const [playerWarCard, setPlayerWarCard] = useState<StandardCard | null>(null);
  const [botWarCard, setBotWarCard] = useState<StandardCard | null>(null);
  const [burnCards, setBurnCards] = useState<StandardCard[]>([]);
  const [isTieWar, setIsTieWar] = useState<boolean>(false);
  const [tieDuelPlayerCard, setTieDuelPlayerCard] = useState<StandardCard | null>(null);
  const [tieDuelBotCard, setTieDuelBotCard] = useState<StandardCard | null>(null);

  // 3-Ball Draft & Ball Rotation States
  const [roundBalls, setRoundBalls] = useState<BingoBall[]>([]);
  const [winnerPickedBall, setWinnerPickedBall] = useState<BingoBall | null>(null);
  const [loserPickedBall, setLoserPickedBall] = useState<BingoBall | null>(null);
  const [sharedBall, setSharedBall] = useState<BingoBall | null>(null);
  const [roundWinner, setRoundWinner] = useState<'PLAYER' | 'COMPUTER' | null>(null);
  const [clashStage, setClashStage] = useState<'IDLE' | 'AWAITING_CARD' | 'WINNER_DRAFT' | 'LOSER_DRAFT' | 'ROUND_RESOLVED'>('IDLE');

  // Ball Recirculation Animation States
  const [isRecirculating, setIsRecirculating] = useState<boolean>(false);
  const [recirculatingBalls, setRecirculatingBalls] = useState<BingoBall[]>([]);
  const [lastRecycledBalls, setLastRecycledBalls] = useState<BingoBall[]>([]);
  const [showPoolInspector, setShowPoolInspector] = useState<boolean>(false);
  const recirculateTimeoutRef = useRef<number | null>(null);

  // Ball Hopper RNG State
  const [uncalledPool, setUncalledPool] = useState<number[]>(() =>
    Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  );
  const [currentBall, setCurrentBall] = useState<BingoBall | null>(null);
  const [recentBalls, setRecentBalls] = useState<BingoBall[]>([]);

  // War Stats
  const [duelsWon, setDuelsWon] = useState<number>(0);
  const [botDuelsWon, setBotDuelsWon] = useState<number>(0);
  const [warsSurvived, setWarsSurvived] = useState<number>(0);
  const [totalRounds, setTotalRounds] = useState<number>(0);

  // Status & Controls
  const [autoDuel, setAutoDuel] = useState<boolean>(false);
  const [duelSpeedMs, setDuelSpeedMs] = useState<number>(2200);
  const [announcement, setAnnouncement] = useState<string>(
    'Highlight your custom target squares on your board, then Lock In to begin the War!'
  );
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'PLAYER' | 'COMPUTER' | null>(null);

  const timerRef = useRef<number | null>(null);

  // Count target squares
  const playerTargetCount = playerCard.flat().filter((c) => c.isCustomTarget).length;
  const playerTargetsRemaining = playerCard
    .flat()
    .filter((c) => c.isCustomTarget && !c.isDaubed).length;

  const botTargetsRemaining = botCard
    .flat()
    .filter((c) => c.isCustomTarget && !c.isDaubed).length;

  // Toggle cell target in SETUP_PATTERN phase
  const handleToggleCellTarget = (r: number, c: number) => {
    if (phase !== 'SETUP_PATTERN') return;
    sounds.playClick();
    setPlayerCard((prev) =>
      prev.map((row, rowIdx) =>
        row.map((cell, colIdx) =>
          rowIdx === r && colIdx === c
            ? { ...cell, isCustomTarget: !cell.isCustomTarget }
            : cell
        )
      )
    );
  };

  // Apply preset pattern
  const handleApplyPreset = (key: keyof typeof PRESET_PATTERNS) => {
    sounds.playClick();
    const preset = PRESET_PATTERNS[key];
    setPlayerCard((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) => ({
          ...cell,
          isCustomTarget: preset.some(([pr, pc]) => pr === r && pc === c),
        }))
      )
    );
  };

  // Roll a randomized battle pattern for player (and bot)
  const handleRollRandomPattern = () => {
    sounds.playClick();
    const count = Math.floor(Math.random() * 3) + 5; // 5 to 7 squares
    const randomCoords = generateRandomPatternCoords(count);
    setPlayerCard((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) => ({
          ...cell,
          isCustomTarget: randomCoords.some(([pr, pc]) => pr === r && pc === c),
        }))
      )
    );
    const botCoords = generateRandomPatternCoords(count);
    setBotCard((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) => ({
          ...cell,
          isCustomTarget: botCoords.some(([pr, pc]) => pr === r && pc === c),
        }))
      )
    );
    setAnnouncement(`🎲 Rolled random ${randomCoords.length}-square battle formation! You can lock in or customize.`);
  };

  // Clear all pattern targets for manual highlighting
  const handleClearPattern = () => {
    sounds.playClick();
    setPlayerCard((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          isCustomTarget: false,
        }))
      )
    );
    setAnnouncement('Board cleared! Click any squares to paint your own winning formation.');
  };

  // Lock In Custom Pattern & Start War
  const handleLockInPattern = () => {
    if (playerTargetCount < 3) {
      sounds.playMismatch();
      setAnnouncement('Please highlight at least 3 target squares for your battle pattern!');
      return;
    }

    sounds.playVictoryFanfare();
    setPhase('ACTIVE_WAR');
    dealNextThreeBalls();
  };

  // Play Again: roll fresh random and immediately start active war match
  const handlePlayAgainRandom = () => {
    sounds.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setAutoDuel(false);
    setIsGameOver(false);
    setWinner(null);
    setPlayerHand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setBotHand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setPlayerWarCard(null);
    setBotWarCard(null);
    setBurnCards([]);
    setIsTieWar(false);
    setTieDuelPlayerCard(null);
    setTieDuelBotCard(null);
    setRoundBalls([]);
    setWinnerPickedBall(null);
    setLoserPickedBall(null);
    setSharedBall(null);
    setRoundWinner(null);
    setCurrentBall(null);
    setRecentBalls([]);
    setDuelsWon(0);
    setBotDuelsWon(0);
    setWarsSurvived(0);
    setTotalRounds(0);
    setClashStage('IDLE');

    const freshPool = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setUncalledPool(freshPool);

    const count = Math.floor(Math.random() * 3) + 5;
    const playerCoords = generateRandomPatternCoords(count);
    const newPlayerCard = generateClassicCard();
    playerCoords.forEach(([r, c]) => {
      newPlayerCard[r][c].isCustomTarget = true;
    });
    setPlayerCard(newPlayerCard);

    const botCoords = generateRandomPatternCoords(count);
    const newBotCard = generateClassicCard();
    botCoords.forEach(([r, c]) => {
      newBotCard[r][c].isCustomTarget = true;
    });
    setBotCard(newBotCard);

    setPhase('ACTIVE_WAR');
    dealNextThreeBalls(freshPool);
  };

  // Restart / Reset
  const handleResetMatch = () => {
    sounds.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setAutoDuel(false);
    setIsGameOver(false);
    setWinner(null);
    setPlayerHand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setBotHand([drawCard(), drawCard(), drawCard(), drawCard()]);
    setPlayerWarCard(null);
    setBotWarCard(null);
    setBurnCards([]);
    setIsTieWar(false);
    setTieDuelPlayerCard(null);
    setTieDuelBotCard(null);
    setRoundBalls([]);
    setWinnerPickedBall(null);
    setLoserPickedBall(null);
    setSharedBall(null);
    setRoundWinner(null);
    setCurrentBall(null);
    setRecentBalls([]);
    setDuelsWon(0);
    setBotDuelsWon(0);
    setWarsSurvived(0);
    setTotalRounds(0);
    setClashStage('IDLE');

    const freshPool = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setUncalledPool(freshPool);

    const newPlayerCard = generateClassicCard();
    PRESET_PATTERNS.DRAGON_BLADE.forEach(([r, c]) => {
      newPlayerCard[r][c].isCustomTarget = true;
    });
    setPlayerCard(newPlayerCard);

    const newBotCard = generateClassicCard();
    PRESET_PATTERNS.DIAMOND_SHIELD.forEach(([r, c]) => {
      newBotCard[r][c].isCustomTarget = true;
    });
    setBotCard(newBotCard);

    setPhase('SETUP_PATTERN');
    setAnnouncement('Paint your battle pattern! Click any squares you want to achieve for Bingo.');
  };

  // Deal next 3 Balls from the hopper pool
  const dealNextThreeBalls = useCallback((currentPool?: number[]) => {
    let pool = currentPool || uncalledPool;
    if (isGameOver) return;

    // Replenish pool if less than 3 remain
    if (pool.length < 3) {
      const allCalled = new Set<number>();
      playerCard.flat().forEach((c) => c.isDaubed && allCalled.add(c.number));
      botCard.flat().forEach((c) => c.isDaubed && allCalled.add(c.number));
      const uncompleted = Array.from({ length: 75 }, (_, i) => i + 1).filter((n) => !allCalled.has(n));
      const freshBatch = uncompleted.length > 0 ? uncompleted : Array.from({ length: 75 }, (_, i) => i + 1);
      pool = [...pool, ...freshBatch.sort(() => Math.random() - 0.5)];
    }

    const threeNums = pool.slice(0, 3);
    const restPool = pool.slice(3);
    setUncalledPool(restPool);

    const balls: BingoBall[] = threeNums.map((n) => ({
      number: n,
      letter: getBallLetter(n),
      id: `round-ball-${n}-${Date.now()}-${Math.random()}`,
    }));

    setRoundBalls(balls);
    setIsRecirculating(false);
    setPlayerWarCard(null);
    setBotWarCard(null);
    setBurnCards([]);
    setIsTieWar(false);
    setTieDuelPlayerCard(null);
    setTieDuelBotCard(null);
    setWinnerPickedBall(null);
    setLoserPickedBall(null);
    setSharedBall(null);
    setRoundWinner(null);
    setClashStage('AWAITING_CARD');
    setTotalRounds((prev) => prev + 1);

    sounds.playBallPop();
    const ballLabels = balls.map((b) => `${b.letter}-${b.number}`).join(', ');
    setAnnouncement(`🎱 3 Balls Revealed: ${ballLabels}! Assess the numbers, decide how badly you want to win, and play a card from your hand.`);
  }, [isGameOver, uncalledPool, playerCard, botCard]);

  // Execute playing a card from hand to bid for the 3 balls
  const handlePlayCardFromHand = (playerCardIdx: number) => {
    if (clashStage !== 'AWAITING_CARD' || !playerHand[playerCardIdx] || roundBalls.length < 3) return;

    const pCard = playerHand[playerCardIdx];
    setPlayerWarCard(pCard);
    sounds.playCardFlip();

    // Bot evaluates how many of roundBalls match botCard targets
    const botTargets = botCard
      .flat()
      .filter((c) => c.isCustomTarget && !c.isDaubed)
      .map((c) => c.number);
    const matchesForBot = roundBalls.filter((b) => botTargets.includes(b.number)).length;

    const sortedBotHand = [...botHand].sort((a, b) => b.value - a.value);
    let chosenBotCard: StandardCard;
    if (matchesForBot >= 2) {
      chosenBotCard = sortedBotHand[0] || botHand[0];
    } else if (matchesForBot === 1) {
      chosenBotCard = sortedBotHand[1] || sortedBotHand[0] || botHand[0];
    } else {
      chosenBotCard = sortedBotHand[sortedBotHand.length - 1] || botHand[0];
    }
    setBotWarCard(chosenBotCard);

    // Remove played cards from hands
    const nextPlayerHand = playerHand.filter((_, idx) => idx !== playerCardIdx);
    const nextBotHand = botHand.filter((c) => c.id !== chosenBotCard.id);
    setPlayerHand(nextPlayerHand);
    setBotHand(nextBotHand);

    // Compare card battle
    if (pCard.value > chosenBotCard.value) {
      // Player Wins!
      sounds.playMatchSuccess();
      setDuelsWon((prev) => prev + 1);
      setRoundWinner('PLAYER');
      setClashStage('WINNER_DRAFT');
      setAnnouncement(
        `🏆 You won the card clash (${pCard.rank} vs ${chosenBotCard.rank})! Pick 1 of the 3 balls for your card ONLY.`
      );
    } else if (chosenBotCard.value > pCard.value) {
      // Bot Wins!
      sounds.playMismatch();
      setBotDuelsWon((prev) => prev + 1);
      setRoundWinner('COMPUTER');

      // Bot automatically chooses its best ball
      const botPick = roundBalls.find((b) => botTargets.includes(b.number)) || roundBalls[0];
      setWinnerPickedBall(botPick);

      // Daub Bot card ONLY
      setBotCard((prev) =>
        prev.map((row) =>
          row.map((cell) => (cell.number === botPick.number ? { ...cell, isDaubed: true } : cell))
        )
      );

      // ROTATE BALL BACK INTO POOL! (Because player did not get it)
      setUncalledPool((prev) => [...prev, botPick.number]);

      setClashStage('LOSER_DRAFT');
      setAnnouncement(
        `🤖 Commander Vane won the card clash (${chosenBotCard.rank} vs ${pCard.rank}) and claimed ${botPick.letter}-${botPick.number} for herself (rotated back into pool)! Now choose 1 of the remaining 2 balls for your card ONLY.`
      );
    } else {
      // TIE - WAR!
      sounds.playWarHorn();
      setIsTieWar(true);
      setWarsSurvived((prev) => prev + 1);

      const tieBurn = [drawCard(), drawCard(), drawCard()];
      setBurnCards(tieBurn);
      const tiePCard = drawCard();
      const tieBCard = drawCard();
      setTieDuelPlayerCard(tiePCard);
      setTieDuelBotCard(tieBCard);

      if (tiePCard.value >= tieBCard.value) {
        sounds.playMatchSuccess();
        setDuelsWon((prev) => prev + 1);
        setRoundWinner('PLAYER');
        setClashStage('WINNER_DRAFT');
        setAnnouncement(
          `⚔️ WAR VICTORY! Your tie-breaker card (${tiePCard.rank}) defeated Vane's (${tieBCard.rank})! Pick 1 of the 3 balls for your card ONLY.`
        );
      } else {
        sounds.playMismatch();
        setBotDuelsWon((prev) => prev + 1);
        setRoundWinner('COMPUTER');

        const botPick = roundBalls.find((b) => botTargets.includes(b.number)) || roundBalls[0];
        setWinnerPickedBall(botPick);

        setBotCard((prev) =>
          prev.map((row) =>
            row.map((cell) => (cell.number === botPick.number ? { ...cell, isDaubed: true } : cell))
          )
        );
        // Rotate back into pool
        setUncalledPool((prev) => [...prev, botPick.number]);

        setClashStage('LOSER_DRAFT');
        setAnnouncement(
          `⚔️ WAR DEFEAT! Vane's tie-breaker (${tieBCard.rank}) defeated your (${tiePCard.rank}) and took ${botPick.letter}-${botPick.number}! Pick 1 of the remaining 2 balls for your card ONLY.`
        );
      }
    }
  };

  // Replay Ball Recirculation Animation
  const handleReplayRecirculationAnimation = () => {
    if (lastRecycledBalls.length === 0) return;
    setIsRecirculating(true);
    sounds.playRecirculate();
    if (recirculateTimeoutRef.current) clearTimeout(recirculateTimeoutRef.current);
    recirculateTimeoutRef.current = window.setTimeout(() => {
      setIsRecirculating(false);
    }, 3500);
  };

  // Draft a ball (Player selection in WINNER_DRAFT or LOSER_DRAFT)
  const handleDraftBall = (ballNum: number) => {
    const selectedBall = roundBalls.find((b) => b.number === ballNum);
    if (!selectedBall) return;

    sounds.playDaub();

    if (clashStage === 'WINNER_DRAFT') {
      // Player is Winner: claims selectedBall for player ONLY
      setWinnerPickedBall(selectedBall);

      // Daub player card ONLY
      const updatedPlayerCard = playerCard.map((row) =>
        row.map((cell) => (cell.number === selectedBall.number ? { ...cell, isDaubed: true } : cell))
      );
      setPlayerCard(updatedPlayerCard);

      // Rotate Winner's exclusive ball back into pool (loser never got it)
      const poolWithBall1 = [...uncalledPool, selectedBall.number];

      // Bot is Loser: bot chooses 1 of the remaining 2 balls
      const remainingTwo = roundBalls.filter((b) => b.number !== selectedBall.number);
      const botTargets = botCard
        .flat()
        .filter((c) => c.isCustomTarget && !c.isDaubed)
        .map((c) => c.number);
      const botLoserPick = remainingTwo.find((b) => botTargets.includes(b.number)) || remainingTwo[0];
      setLoserPickedBall(botLoserPick);

      // Daub bot card ONLY
      const updatedBotCard = botCard.map((row) =>
        row.map((cell) => (cell.number === botLoserPick.number ? { ...cell, isDaubed: true } : cell))
      );
      setBotCard(updatedBotCard);

      // The 3rd ball is used by BOTH players!
      const thirdShared = remainingTwo.find((b) => b.number !== botLoserPick.number) || remainingTwo[1];
      setSharedBall(thirdShared);
      setCurrentBall(thirdShared);
      setRecentBalls((prev) => [selectedBall, botLoserPick, thirdShared, ...prev.slice(0, 3)]);

      // Rotate Winner's exclusive ball, Loser's exclusive ball, and 3rd shared ball back into pool
      const poolWithAllRotated = [...poolWithBall1, botLoserPick.number, thirdShared.number];
      setUncalledPool(poolWithAllRotated);

      // Trigger Visual Recirculation Animation
      const recycledThree = [selectedBall, botLoserPick, thirdShared];
      setRecirculatingBalls(recycledThree);
      setLastRecycledBalls(recycledThree);
      setIsRecirculating(true);
      sounds.playRecirculate();
      if (recirculateTimeoutRef.current) clearTimeout(recirculateTimeoutRef.current);
      recirculateTimeoutRef.current = window.setTimeout(() => {
        setIsRecirculating(false);
      }, 3500);

      // Daub 3rd ball on BOTH cards
      const finalPlayerCard = updatedPlayerCard.map((row) =>
        row.map((cell) => (cell.number === thirdShared.number ? { ...cell, isDaubed: true } : cell))
      );
      setPlayerCard(finalPlayerCard);

      const finalBotCard = updatedBotCard.map((row) =>
        row.map((cell) => (cell.number === thirdShared.number ? { ...cell, isDaubed: true } : cell))
      );
      setBotCard(finalBotCard);

      // Refill hands back to 4 cards
      setPlayerHand((prev) => [...prev, drawCard()]);
      setBotHand((prev) => [...prev, drawCard()]);

      // Check Victory
      const playerRem = finalPlayerCard.flat().filter((c) => c.isCustomTarget && !c.isDaubed).length;
      if (playerRem === 0) {
        setIsGameOver(true);
        setAutoDuel(false);
        setWinner('PLAYER');
        sounds.playVictoryFanfare();
        const finalScore = playerTargetCount * 1000 + (duelsWon + 1) * 300 + 3000;
        setAnnouncement(`🎉 BINGO WAR VICTORY! All target squares conquered! (+${finalScore} pts)`);
        onCompleteGame(finalScore, {
          patternCount: playerTargetCount,
          duelsWon: duelsWon + 1,
          warsWon: warsSurvived,
          winner: 'PLAYER',
        });
        setClashStage('ROUND_RESOLVED');
        return;
      }

      const botRem = finalBotCard.flat().filter((c) => c.isCustomTarget && !c.isDaubed).length;
      if (botRem === 0) {
        setIsGameOver(true);
        setAutoDuel(false);
        setWinner('COMPUTER');
        sounds.playMismatch();
        setAnnouncement('🤖 Commander Vane finished their pattern first!');
        onCompleteGame(500, {
          patternCount: playerTargetCount,
          duelsWon: duelsWon + 1,
          warsWon: warsSurvived,
          winner: 'COMPUTER',
        });
        setClashStage('ROUND_RESOLVED');
        return;
      }

      setClashStage('ROUND_RESOLVED');
      setAnnouncement(
        `✅ Round Resolved! You claimed ${selectedBall.letter}-${selectedBall.number} (yours only, rotated into pool), Vane claimed ${botLoserPick.letter}-${botLoserPick.number} (bot only, rotated into pool), and ${thirdShared.letter}-${thirdShared.number} was shared by both!`
      );
    } else if (clashStage === 'LOSER_DRAFT') {
      // Player is Loser: bot already claimed winnerPickedBall (rotated into pool)
      setLoserPickedBall(selectedBall);

      // Daub player card ONLY
      const updatedPlayerCard = playerCard.map((row) =>
        row.map((cell) => (cell.number === selectedBall.number ? { ...cell, isDaubed: true } : cell))
      );
      setPlayerCard(updatedPlayerCard);

      // The 3rd ball is used by BOTH players!
      const remainingBalls = roundBalls.filter(
        (b) => b.number !== winnerPickedBall?.number && b.number !== selectedBall.number
      );
      const thirdShared = remainingBalls[0] || selectedBall;
      setSharedBall(thirdShared);
      setCurrentBall(thirdShared);
      if (winnerPickedBall) {
        setRecentBalls((prev) => [winnerPickedBall, selectedBall, thirdShared, ...prev.slice(0, 3)]);
      }

      // Rotate player's exclusive ball AND third shared ball back into pool (winner was already rotated)
      setUncalledPool((prev) => [...prev, selectedBall.number, thirdShared.number]);

      // Trigger Visual Recirculation Animation
      const recycledThree = [winnerPickedBall || roundBalls[0], selectedBall, thirdShared];
      setRecirculatingBalls(recycledThree);
      setLastRecycledBalls(recycledThree);
      setIsRecirculating(true);
      sounds.playRecirculate();
      if (recirculateTimeoutRef.current) clearTimeout(recirculateTimeoutRef.current);
      recirculateTimeoutRef.current = window.setTimeout(() => {
        setIsRecirculating(false);
      }, 3500);

      // Daub 3rd ball on BOTH cards
      const finalPlayerCard = updatedPlayerCard.map((row) =>
        row.map((cell) => (cell.number === thirdShared.number ? { ...cell, isDaubed: true } : cell))
      );
      setPlayerCard(finalPlayerCard);

      const finalBotCard = botCard.map((row) =>
        row.map((cell) => (cell.number === thirdShared.number ? { ...cell, isDaubed: true } : cell))
      );
      setBotCard(finalBotCard);

      // Refill hands back to 4 cards
      setPlayerHand((prev) => [...prev, drawCard()]);
      setBotHand((prev) => [...prev, drawCard()]);

      // Check Victory
      const playerRem = finalPlayerCard.flat().filter((c) => c.isCustomTarget && !c.isDaubed).length;
      if (playerRem === 0) {
        setIsGameOver(true);
        setAutoDuel(false);
        setWinner('PLAYER');
        sounds.playVictoryFanfare();
        const finalScore = playerTargetCount * 1000 + duelsWon * 300 + 2500;
        setAnnouncement(`🎉 BINGO WAR VICTORY! Completed pattern! (+${finalScore} pts)`);
        onCompleteGame(finalScore, {
          patternCount: playerTargetCount,
          duelsWon,
          warsWon: warsSurvived,
          winner: 'PLAYER',
        });
        setClashStage('ROUND_RESOLVED');
        return;
      }

      const botRem = finalBotCard.flat().filter((c) => c.isCustomTarget && !c.isDaubed).length;
      if (botRem === 0) {
        setIsGameOver(true);
        setAutoDuel(false);
        setWinner('COMPUTER');
        sounds.playMismatch();
        setAnnouncement('🤖 Commander Vane finished their pattern first!');
        onCompleteGame(500, {
          patternCount: playerTargetCount,
          duelsWon,
          warsWon: warsSurvived,
          winner: 'COMPUTER',
        });
        setClashStage('ROUND_RESOLVED');
        return;
      }

      setClashStage('ROUND_RESOLVED');
      setAnnouncement(
        `✅ Round Resolved! Vane claimed ${winnerPickedBall?.letter}-${winnerPickedBall?.number} (bot only, rotated), you claimed ${selectedBall.letter}-${selectedBall.number} (yours only, rotated), and ${thirdShared.letter}-${thirdShared.number} was shared by both!`
      );
    }
  };

  // Auto-Duel effect for hands, draft, and rounds
  useEffect(() => {
    if (autoDuel && phase === 'ACTIVE_WAR' && !isGameOver) {
      if (clashStage === 'IDLE' || clashStage === 'ROUND_RESOLVED') {
        const timer = window.setTimeout(() => {
          dealNextThreeBalls();
        }, clashStage === 'ROUND_RESOLVED' ? Math.max(duelSpeedMs, 2800) : duelSpeedMs);
        return () => clearTimeout(timer);
      }

      if (clashStage === 'AWAITING_CARD' && playerHand.length > 0) {
        const timer = window.setTimeout(() => {
          // Smart card play: if any ball matches player pattern, play highest card
          const playerTargets = playerCard
            .flat()
            .filter((c) => c.isCustomTarget && !c.isDaubed)
            .map((c) => c.number);
          const matches = roundBalls.filter((b) => playerTargets.includes(b.number)).length;

          const sortedHand = playerHand
            .map((card, idx) => ({ card, idx }))
            .sort((a, b) => b.card.value - a.card.value);

          const pickIdx = matches > 0 ? sortedHand[0]?.idx ?? 0 : sortedHand[sortedHand.length - 1]?.idx ?? 0;
          handlePlayCardFromHand(pickIdx);
        }, 1000);
        return () => clearTimeout(timer);
      }

      if (clashStage === 'WINNER_DRAFT' && roundBalls.length === 3) {
        const timer = window.setTimeout(() => {
          // Choose ball matching player pattern if available
          const playerTargets = playerCard
            .flat()
            .filter((c) => c.isCustomTarget && !c.isDaubed)
            .map((c) => c.number);
          const bestBall = roundBalls.find((b) => playerTargets.includes(b.number)) || roundBalls[0];
          handleDraftBall(bestBall.number);
        }, 1000);
        return () => clearTimeout(timer);
      }

      if (clashStage === 'LOSER_DRAFT' && roundBalls.length === 3) {
        const timer = window.setTimeout(() => {
          const remaining = roundBalls.filter((b) => b.number !== winnerPickedBall?.number);
          const playerTargets = playerCard
            .flat()
            .filter((c) => c.isCustomTarget && !c.isDaubed)
            .map((c) => c.number);
          const bestBall = remaining.find((b) => playerTargets.includes(b.number)) || remaining[0];
          if (bestBall) handleDraftBall(bestBall.number);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    autoDuel,
    phase,
    isGameOver,
    duelSpeedMs,
    clashStage,
    playerHand,
    roundBalls,
    winnerPickedBall,
    playerCard,
    dealNextThreeBalls,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top HUD: Mode Status & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        {/* Phase Indicator & Custom Pattern Metric */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {phase === 'SETUP_PATTERN' ? 'Phase 1: Pattern Architect' : 'Phase 2: Active Bingo War'}
              </div>
              <div className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                <span>Custom Target: {playerTargetCount} Squares</span>
                {phase === 'ACTIVE_WAR' && (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    {playerTargetsRemaining} remaining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preset Patterns & Randomizer (Only in setup phase) */}
        {phase === 'SETUP_PATTERN' ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">Formations:</span>
            <button
              onClick={() => handleApplyPreset('DRAGON_BLADE')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🗡️ Blade
            </button>
            <button
              onClick={() => handleApplyPreset('DIAMOND_SHIELD')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🛡️ Shield
            </button>
            <button
              onClick={() => handleApplyPreset('LIGHTNING_BOLT')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              ⚡ Lightning
            </button>
            <button
              onClick={() => handleApplyPreset('WAR_CORNERS')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🎯 Outposts
            </button>
            <button
              onClick={() => handleApplyPreset('CROSSFIRE_X')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              ⚔️ Crossfire
            </button>
            <button
              onClick={() => handleApplyPreset('IRON_FORTRESS')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              🏰 Fortress
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

            <button
              onClick={handleRollRandomPattern}
              className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>🎲 Random Pattern</span>
            </button>

            <button
              onClick={handleClearPattern}
              title="Clear all selected squares to paint by hand"
              className="px-2 py-1 text-xs font-medium bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        ) : (
          /* Battle Meters in ACTIVE_WAR phase */
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Lock className="w-3 h-3" />
              <span>Pattern Locked</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="text-xs">
              <span className="text-slate-400">Duels Won: </span>
              <span className="font-mono font-bold text-emerald-400">{duelsWon}</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="text-xs">
              <span className="text-slate-400">Wars Won: </span>
              <span className="font-mono font-bold text-amber-400">{warsSurvived}</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <button
              onClick={() => {
                sounds.playClick();
                setDuelSpeedMs((prev) => (prev === 2200 ? 1100 : 2200));
              }}
              className="text-[11px] text-slate-400 hover:text-white font-mono cursor-pointer"
              title="Toggle Duel Speed"
            >
              Speed: {duelSpeedMs === 2200 ? '1x' : '2x'}
            </button>
          </div>
        )}

        {/* Primary Action Button (Lock In vs Engage Clash) */}
        <div className="flex items-center gap-2">
          {phase === 'SETUP_PATTERN' ? (
            <button
              onClick={handleLockInPattern}
              disabled={playerTargetCount < 3}
              className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>LOCK IN BATTLE PATTERN</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dealNextThreeBalls()}
                disabled={isGameOver || (clashStage !== 'IDLE' && clashStage !== 'ROUND_RESOLVED')}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>
                  {clashStage === 'AWAITING_CARD'
                    ? 'BID WITH CARD BELOW'
                    : clashStage === 'WINNER_DRAFT' || clashStage === 'LOSER_DRAFT'
                    ? 'DRAFT BALL BELOW'
                    : 'DRAW NEXT 3 BALLS'}
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setAutoDuel(!autoDuel);
                }}
                disabled={isGameOver}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  autoDuel
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={autoDuel ? 'Pause Auto-Duel' : 'Auto-Duel Battle'}
              >
                {autoDuel ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          )}

          <button
            onClick={handleResetMatch}
            title="Redesign Pattern & Restart Match"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Announcement Banner */}
      {announcement && (
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-amber-200 animate-in fade-in duration-200">
          {announcement}
        </div>
      )}

      {/* Post-Game Banner with Rematch and Roll Different Random options */}
      {isGameOver && (
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="font-display text-xl font-bold text-white">
              {winner === 'PLAYER' ? '🏆 BINGO WAR VICTORY!' : '🤖 COMMANDER VANE PREVAILED!'}
            </h3>
          </div>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {winner === 'PLAYER'
              ? `Magnificent tactical victory! You conquered all ${playerTargetCount} battle target squares, winning ${duelsWon} card duels and surviving ${warsSurvived} high-stakes wars.`
              : `Commander Vane captured their pattern first. Ready for a rematch? Roll a different random battle formation to challenge them again!`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={handlePlayAgainRandom}
              className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 cursor-pointer flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>Play Again (Roll Different Random)</span>
            </button>
            <button
              onClick={handleResetMatch}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Redesign Custom Pattern</span>
            </button>
          </div>
        </div>
      )}

      {/* War Battle Arena */}
      {phase === 'ACTIVE_WAR' && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-5">
          {/* Section 1: The 3 Drawn Balls of the Round */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  ROUND HOPPER DRAW: 3 REVEALED BALLS
                </span>
              </div>
              <div className="text-xs font-medium text-slate-400">
                {clashStage === 'AWAITING_CARD' && (
                  <span className="text-amber-300 font-semibold animate-pulse">
                    ⚡ Look at the 3 balls, then play a card from your hand below!
                  </span>
                )}
                {clashStage === 'WINNER_DRAFT' && (
                  <span className="text-emerald-400 font-bold animate-bounce">
                    🎉 You Won the Clash! Select 1 ball below for your card ONLY (rotates back into pool).
                  </span>
                )}
                {clashStage === 'LOSER_DRAFT' && (
                  <span className="text-amber-400 font-bold animate-bounce">
                    🥈 Select 1 of the remaining 2 balls for your card ONLY (rotates back into pool).
                  </span>
                )}
                {clashStage === 'ROUND_RESOLVED' && (
                  <span className="text-cyan-400 font-semibold">
                    Round Complete! Winner & Loser exclusive balls rotated into pool. 3rd ball shared!
                  </span>
                )}
              </div>
            </div>

            {/* The 3 Balls Grid */}
            {roundBalls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
                {roundBalls.map((ball, idx) => {
                  const onPlayerCard = playerCard.flat().some((c) => c.number === ball.number && !c.isDaubed);
                  const onPlayerTarget = playerCard.flat().some((c) => c.number === ball.number && c.isCustomTarget && !c.isDaubed);
                  const onBotTarget = botCard.flat().some((c) => c.number === ball.number && c.isCustomTarget && !c.isDaubed);

                  const isWinnerPick = winnerPickedBall?.number === ball.number;
                  const isLoserPick = loserPickedBall?.number === ball.number;
                  const isShared = sharedBall?.number === ball.number;
                  const isRecirculatingThis = isRecirculating && recirculatingBalls.some((b) => b.number === ball.number);

                  const canDraftThis =
                    (clashStage === 'WINNER_DRAFT') ||
                    (clashStage === 'LOSER_DRAFT' && winnerPickedBall?.number !== ball.number);

                  return (
                    <div
                      key={ball.id}
                      onClick={() => canDraftThis && handleDraftBall(ball.number)}
                      className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all ${
                        canDraftThis
                          ? 'cursor-pointer hover:scale-105 bg-slate-900/90 border-amber-400 ring-2 ring-amber-400/50 hover:ring-amber-400 shadow-lg'
                          : isRecirculatingThis
                          ? 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-400/40 shadow-xl'
                          : isWinnerPick
                          ? 'bg-emerald-950/40 border-emerald-500/50'
                          : isLoserPick
                          ? 'bg-amber-950/40 border-amber-500/50'
                          : isShared
                          ? 'bg-cyan-950/40 border-cyan-500/50'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap gap-1 items-center justify-center min-h-[22px]">
                        {onPlayerTarget && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-black">
                            🎯 YOUR TARGET!
                          </span>
                        )}
                        {onPlayerCard && !onPlayerTarget && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                            On Card
                          </span>
                        )}
                        {onBotTarget && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded font-bold">
                            Vane Needs
                          </span>
                        )}
                      </div>

                      {/* Ball Icon */}
                      <div className="my-2">
                        <div
                          className={`w-14 h-14 rounded-full border-2 font-mono font-black text-lg flex items-center justify-center shadow-lg transition-transform ${getBallColorClass(
                            ball.letter
                          )} ${canDraftThis ? 'animate-pulse' : ''} ${isRecirculatingThis ? 'animate-ball-recycle ring-2 ring-amber-400' : ''}`}
                        >
                          {ball.number}
                        </div>
                        <div className="text-xs font-bold text-center text-white mt-1">
                          {ball.letter}-{ball.number}
                        </div>
                      </div>

                      {/* Action / Outcome Badge */}
                      <div className="w-full mt-1">
                        {canDraftThis ? (
                          <button
                            type="button"
                            className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg uppercase tracking-wide cursor-pointer shadow-xs"
                          >
                            CLAIM BALL
                          </button>
                        ) : isRecirculatingThis ? (
                          <div className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/50 py-1 rounded text-center flex items-center justify-center gap-1 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>ROTATING TO POOL</span>
                          </div>
                        ) : isWinnerPick ? (
                          <div className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 py-1 rounded text-center">
                            {roundWinner === 'PLAYER' ? '👑 YOUR EXCLUSIVE (Rotated)' : '🤖 VANE EXCLUSIVE (Rotated)'}
                          </div>
                        ) : isLoserPick ? (
                          <div className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 py-1 rounded text-center">
                            {roundWinner === 'PLAYER' ? '🤖 VANE EXCLUSIVE (Rotated)' : '👑 YOUR EXCLUSIVE (Rotated)'}
                          </div>
                        ) : isShared ? (
                          <div className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 py-1 rounded text-center">
                            ⭐ SHARED BY BOTH
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 text-center py-1">Ball #{idx + 1}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs italic">
                Press <strong>"Draw Next 3 Balls"</strong> or toggle Auto-Duel to call the next 3 balls.
              </div>
            )}
          </div>

          {/* Section 1.5: Interactive Hopper Recirculation Chamber & Visual Animation */}
          <div
            className={`rounded-xl border p-4 sm:p-5 transition-all duration-300 relative overflow-hidden ${
              isRecirculating
                ? 'bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border-amber-500/60 ring-2 ring-amber-400/40 shadow-2xl'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                    isRecirculating
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-spin'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                      HOPPER RECIRCULATION CHAMBER
                    </span>
                    {isRecirculating ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ROTATING BALLS INTO AVAILABLE POOL (+3)
                      </span>
                    ) : clashStage === 'ROUND_RESOLVED' ? (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                        ✓ 3 BALLS RESTOCKED TO POOL
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                        Cyclical Pool Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Round balls rotate back into the hopper reservoir upon round completion, maintaining an infinite pool cycle.
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                {lastRecycledBalls.length > 0 && (
                  <button
                    onClick={handleReplayRecirculationAnimation}
                    className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Replay the ball recirculation animation"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRecirculating ? 'animate-spin' : ''}`} />
                    <span>Replay Rotation Animation</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowPoolInspector(!showPoolInspector);
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showPoolInspector ? 'Hide Chamber' : 'Inspect Pool'}</span>
                </button>
              </div>
            </div>

            {/* Recirculation Visual Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
              {/* Left: Round Balls Drafted (4 Cols) */}
              <div className="md:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{isRecirculating ? 'RECIRCULATING BALLS' : 'RECENT ROUND BALLS'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(isRecirculating && recirculatingBalls.length > 0
                    ? recirculatingBalls
                    : lastRecycledBalls.length > 0
                    ? lastRecycledBalls
                    : roundBalls
                  ).map((ball, bIdx) => {
                    const isWinner = winnerPickedBall?.number === ball.number;
                    const isLoser = loserPickedBall?.number === ball.number;
                    const isShared = sharedBall?.number === ball.number;
                    return (
                      <div
                        key={`recirc-${ball.number}-${bIdx}`}
                        className={`relative flex flex-col items-center transition-all ${
                          isRecirculating ? 'animate-ball-recycle' : ''
                        }`}
                        style={{ animationDelay: `${bIdx * 200}ms` }}
                      >
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 font-mono font-black text-sm sm:text-base flex items-center justify-center shadow-lg transition-transform ${getBallColorClass(
                            ball.letter
                          )} ${
                            isRecirculating
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-105'
                              : ''
                          }`}
                        >
                          {ball.number}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 mt-1">
                          {ball.letter}-{ball.number}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400">
                          {isWinner ? 'Winner' : isLoser ? 'Loser' : isShared ? 'Shared' : `#${bIdx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center: Recirculation Conveyor Pipeline (5 Cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center px-2 py-2">
                <div className="w-full relative py-2">
                  <div className="h-2 w-full bg-slate-950 rounded-full border border-slate-700 overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all ${
                        isRecirculating ? 'animate-stream-particle w-full' : 'w-2/3 opacity-40'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                    <span>Round Pool</span>
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <RefreshCw className={`w-3 h-3 ${isRecirculating ? 'animate-spin' : ''}`} />
                      {isRecirculating ? 'CYCLING TO RESERVOIR >>>' : 'Cyclical Return Line'}
                    </span>
                    <span>Hopper Cage</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {isRecirculating
                    ? '🌀 Balls tumbling along conveyor stream directly into the available pool reservoir...'
                    : 'Exclusive drafted balls and the shared ball return to the available pool.'}
                </p>
              </div>

              {/* Right: Available Hopper Chamber Tumbler (3 Cols) */}
              <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full border-2 border-cyan-400/50 bg-radial from-cyan-900/30 via-slate-950 to-slate-900 flex flex-col items-center justify-center shadow-xl relative overflow-hidden transition-all ${
                      isRecirculating ? 'animate-hopper-glow scale-105' : ''
                    }`}
                  >
                    <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none animate-hopper-swirl">
                      <div className="w-14 h-14 rounded-full border border-dashed border-cyan-300" />
                    </div>

                    <span className="font-mono font-black text-2xl text-cyan-300 leading-none">
                      {uncalledPool.length}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-cyan-400/80 mt-0.5">
                      AVAILABLE
                    </span>
                  </div>

                  {isRecirculating && (
                    <div className="absolute -top-2 -right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-emerald-300 animate-bounce">
                      +3 Recycled!
                    </div>
                  )}
                </div>

                <span className="text-xs font-semibold text-slate-300 mt-1.5">
                  Available Hopper Pool
                </span>
              </div>
            </div>

            {/* Expandable Chamber Inspection Drawer */}
            {showPoolInspector && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <span className="font-bold text-slate-200">
                    Chamber Inspection: 75 Ball Pool Status
                  </span>
                  <div className="flex items-center gap-3 text-[11px] flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Hopper ({uncalledPool.length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Player Daubed ({playerCard.flat().filter(c => c.isDaubed).length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vane Daubed ({botCard.flat().filter(c => c.isDaubed).length})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-15 sm:grid-cols-25 gap-1 max-h-36 overflow-y-auto p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                  {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => {
                    const inPool = uncalledPool.includes(n);
                    const inRound = roundBalls.some((b) => b.number === n);
                    const isPlayerDaubed = playerCard.flat().some((c) => c.number === n && c.isDaubed);
                    const isBotDaubed = botCard.flat().some((c) => c.number === n && c.isDaubed);

                    return (
                      <div
                        key={`inspect-${n}`}
                        title={`Ball ${getBallLetter(n)}-${n}: ${
                          inRound ? 'In Current Round' : inPool ? 'In Available Hopper Pool' : isPlayerDaubed ? 'Daubed on Player Board' : 'Daubed on Bot Board'
                        }`}
                        className={`h-6 text-[10px] font-mono font-bold rounded flex items-center justify-center border transition-colors ${
                          inRound
                            ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                            : inPool
                            ? 'bg-cyan-950/50 text-cyan-200 border-cyan-800'
                            : isPlayerDaubed
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                            : isBotDaubed
                            ? 'bg-rose-950/60 text-rose-300 border-rose-700/60'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {n}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Card Showdown Arena */}
          {(playerWarCard || botWarCard) && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Player Played Card */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs uppercase font-bold text-amber-400">{playerName}</div>
                  <div className="text-[11px] text-slate-400">Card Played</div>
                </div>
                {playerWarCard && (
                  <PlayingCard suit={playerWarCard.suit} rank={playerWarCard.rank} size="sm" highlight />
                )}
              </div>

              {/* Clash Verdict */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 font-display font-extrabold text-sm text-white">
                  <Swords className="w-4 h-4 text-rose-500" />
                  <span>
                    {isTieWar
                      ? 'WAR SHOWDOWN (TIE)!'
                      : roundWinner === 'PLAYER'
                      ? 'YOU WON 1st PICK!'
                      : roundWinner === 'COMPUTER'
                      ? 'VANE WON 1st PICK!'
                      : 'CARD DUEL'}
                  </span>
                </div>
                {isTieWar && tieDuelPlayerCard && tieDuelBotCard && (
                  <div className="text-xs text-rose-300 mt-0.5">
                    Tie-breaker: {tieDuelPlayerCard.rank} vs {tieDuelBotCard.rank}
                  </div>
                )}
              </div>

              {/* Bot Played Card */}
              <div className="flex items-center gap-3">
                {botWarCard && (
                  <PlayingCard suit={botWarCard.suit} rank={botWarCard.rank} size="sm" />
                )}
                <div className="text-left">
                  <div className="text-xs uppercase font-bold text-rose-400">Commander Vane</div>
                  <div className="text-[11px] text-slate-400">Card Played</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Player's Tactical Card Hand */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  YOUR COMBAT HAND ({playerHand.length} CARDS)
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {clashStage === 'AWAITING_CARD' ? (
                  <span className="text-amber-300 font-bold">
                    👉 Click any card below to play it into the card battle!
                  </span>
                ) : (
                  <span>Deck refills after each round</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-1">
              {playerHand.map((card, idx) => {
                const canPlay = clashStage === 'AWAITING_CARD';
                return (
                  <div
                    key={card.id}
                    onClick={() => canPlay && handlePlayCardFromHand(idx)}
                    className={`relative transition-all duration-200 ${
                      canPlay
                        ? 'cursor-pointer hover:-translate-y-2 hover:scale-105 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 rounded-lg shadow-lg'
                        : 'opacity-70'
                    }`}
                  >
                    <PlayingCard suit={card.suit} rank={card.rank} size="sm" highlight={canPlay} />
                    {canPlay && (
                      <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                        PLAY
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
              Decide how badly you want to win: play higher cards (Ace, King, Queen) to guarantee winning 1st Pick, or sacrifice lower cards (2-5) if the numbers don't help your pattern!
            </p>
          </div>
        </div>
      )}

      {/* Main Duel Grid Arena: Player Card vs Opponent Card */}
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
                    YOUR GRID
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {phase === 'SETUP_PATTERN'
                    ? 'Click squares to toggle your custom battle pattern'
                    : 'Target squares highlighted in amber gold'}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-amber-400">
              {phase === 'SETUP_PATTERN'
                ? `${playerTargetCount} Selected`
                : `${playerTargetsRemaining} Needed`}
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
                const isSelected = cell.isCustomTarget;
                const isCurrentlyCalled = currentBall?.number === cell.number;

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleToggleCellTarget(rIdx, cIdx)}
                    disabled={phase === 'ACTIVE_WAR'}
                    title={
                      phase === 'SETUP_PATTERN'
                        ? 'Click to toggle custom battle formation target'
                        : isSelected
                        ? 'Target square for victory'
                        : undefined
                    }
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-200 select-none ${
                      cell.isDaubed
                        ? 'bg-linear-to-br from-emerald-600 to-emerald-800 border-emerald-400 text-white shadow-inner font-black cursor-default'
                        : isCurrentlyCalled
                        ? 'bg-amber-500/35 border-amber-300 text-amber-100 font-black animate-pulse shadow-lg ring-2 ring-amber-400 cursor-default'
                        : isSelected
                        ? phase === 'SETUP_PATTERN'
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/60 shadow-md font-bold cursor-pointer hover:scale-105 active:scale-95'
                          : 'bg-amber-500/15 border-amber-400/60 text-amber-200 ring-1 ring-amber-400/40 shadow-xs font-bold cursor-default'
                        : phase === 'SETUP_PATTERN'
                        ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer hover:scale-105 active:scale-95'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 cursor-default'
                    }`}
                  >
                    {/* Target indicator icon */}
                    {isSelected && !cell.isDaubed && (
                      <span
                        className="absolute top-1.5 right-1.5 flex items-center justify-center text-[9px] font-black text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded-full border border-amber-400/30 shadow-xs"
                        title="Your Custom Target Square"
                      >
                        ★
                      </span>
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
                        <div className="w-8 h-8 rounded-full border border-emerald-300/50 bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                          ✓
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Opponent Board */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative opacity-95">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <span>Commander Vane</span>
                  <span className="text-[10px] font-sans text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded font-semibold">
                    WAR OPPONENT
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Target squares highlighted in crimson
                </p>
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-rose-400">
              {botTargetsRemaining} to go
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
                const isSelected = cell.isCustomTarget;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative select-none ${
                      cell.isDaubed
                        ? 'bg-linear-to-br from-rose-700 to-rose-900 border-rose-400 text-white shadow-inner font-bold'
                        : isSelected
                        ? 'bg-rose-500/15 border-rose-400/60 text-rose-200 ring-1 ring-rose-400/30'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    {isSelected && !cell.isDaubed && (
                      <span
                        className="absolute top-1.5 right-1.5 flex items-center justify-center text-[9px] font-black text-rose-400 bg-rose-500/20 px-1 py-0.2 rounded-full border border-rose-400/30 shadow-xs"
                        title="Commander Vane Target Square"
                      >
                        ⚔️
                      </span>
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
    </div>
  );
};
