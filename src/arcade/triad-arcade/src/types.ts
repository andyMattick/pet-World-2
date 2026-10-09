export type GameMode = 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'CASINO_WAR' | 'MEMORY_MATRIX' | 'LEADERBOARD';

export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface StandardCard {
  id: string;
  suit: CardSuit;
  rank: CardRank;
  value: number; // 2..14 (A=14 for War)
}

// Battleship Armada Tactical Types
export type ShipType = 'CARRIER' | 'BATTLESHIP' | 'CRUISER' | 'SUBMARINE' | 'DESTROYER';

export interface NavalShip {
  id: string;
  name: string;
  type: ShipType;
  size: number;
  coordinates: { row: number; col: number }[];
  hits: number;
  isSunk: boolean;
  color: string;
}

export type TacticalAbility = 'ARTILLERY' | 'SONAR' | 'AIRSTRIKE' | 'RAILGUN' | 'SMOKE_SCREEN';

export interface BattleshipCell {
  row: number;
  col: number;
  status: 'WATER' | 'HIT' | 'MISS';
  shipType?: ShipType;
  isSunk?: boolean;
  isScanned?: boolean;
  hasShip?: boolean;
  shipId?: string;
  isSmoked?: boolean;
}

// Bingo War Custom Pattern Types
export interface BingoWarCell extends BingoCell {
  isCustomTarget: boolean;
}

// Classic Bingo Duel Types
export type BingoPatternType =
  | 'LINE'
  | 'FOUR_CORNERS'
  | 'POSTAGE_STAMP'
  | 'LETTER_X'
  | 'PICTURE_FRAME'
  | 'PLUS_SIGN'
  | 'BLACKOUT';

export type BingoPatternOption = BingoPatternType | 'RANDOM';

export type DauberStyle = 'CLASSIC_RED' | 'EMERALD_STAR' | 'GOLD_CROWN' | 'NEON_HEART';

export interface BingoBall {
  number: number;
  letter: 'B' | 'I' | 'N' | 'G' | 'O';
  id: string;
}

export interface BingoCell {
  number: number;
  letter: 'B' | 'I' | 'N' | 'G' | 'O';
  row: number;
  col: number;
  isDaubed: boolean;
  isFree?: boolean;
  isHighlighted?: boolean;
}

export interface BingoDuelStats {
  playerWins: number;
  botWins: number;
  fastestBingoCalls: number;
  patternsWon: string[];
}

// Daily Challenges
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  mode: 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'CASINO_WAR' | 'MEMORY_MATRIX';
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  rewardPoints: number;
  badgeIcon: string;
}

export interface DailyChallengeState {
  dateKey: string;
  challenges: DailyChallenge[];
  allCompleted: boolean;
  bonusClaimed: boolean;
}

// Achievements System
export type AchievementCategory = 'ALL' | 'BINGO' | 'WAR' | 'BATTLESHIP' | 'MEMORY' | 'GENERAL';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'BINGO' | 'WAR' | 'BATTLESHIP' | 'MEMORY' | 'GENERAL';
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

// Casino War Specific Types
export interface WarRoundState {
  phase: 'BETTING' | 'DEAL' | 'WAR_DECISION' | 'WAR_BATTLE' | 'ROUND_OVER';
  playerCard: StandardCard | null;
  dealerCard: StandardCard | null;
  playerWarCard: StandardCard | null;
  dealerWarCard: StandardCard | null;
  burnCards: StandardCard[];
  currentBet: number;
  tieBet: number;
  warRaiseBet: number;
  outcomeText: string;
  roundNetChips: number;
}

export interface WarStats {
  bankroll: number;
  currentStreak: number;
  bestStreak: number;
  warsFought: number;
  warsWon: number;
  totalRounds: number;
  peakBankroll: number;
}

// Memory Matrix Specific Types
export type MatrixTheme = 'ROYAL_CASINO' | 'MYSTIC_ARCANA' | 'RETRO_ARCADE';
export type MatrixDifficulty = 'CASUAL' | 'STANDARD' | 'CHALLENGE' | 'GRAND' | 'COLOSSAL';

export interface MatrixCard {
  id: string;
  pairId: string;
  label: string;
  iconName: string;
  subtitle?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MatrixGameState {
  theme: MatrixTheme;
  difficulty: MatrixDifficulty;
  cards: MatrixCard[];
  flips: number;
  matches: number;
  totalPairs: number;
  score: number;
  streak: number;
  maxStreak: number;
  elapsedSeconds: number;
  isComplete: boolean;
}

// Leaderboard Types
export type LeaderboardCategory = 'ALL_TIME' | 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'CASINO_WAR' | 'MEMORY_MATRIX';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  avatar: string;
  mode: 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'CASINO_WAR' | 'MEMORY_MATRIX' | 'MEMORY_BINGO';
  score: number;
  metricLabel: string;
  metricValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  date: string;
  timestamp: number;
  isUser?: boolean;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  totalScore: number;
  gamesPlayed: number;
  bingoDuelWins: number;
  bingoWarWins?: number;
  battleshipWins?: number;
  memoryBingoBestScore?: number;
  warMaxBankroll: number;
  matrixFastestTime: number; // in seconds
  soundEnabled: boolean;
}
