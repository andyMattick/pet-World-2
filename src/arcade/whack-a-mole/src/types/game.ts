export type MetricType = 'score' | 'hit_pct' | 'miss_pct';

export type MoleType = 'standard' | 'golden' | 'speedy' | 'frozen';

export interface GameRecord {
  id: string;
  roundNumber: number;
  timestamp: number;
  playerName: string;
  score: number;
  hits: number;
  goldenHits: number;
  speedyHits?: number;
  frozenHits?: number;
  misses: number;
  totalClicks: number;
  maxCombo?: number;
  accuracy: number; // Hit %
  hitPercentage: number;
  missPercentage: number;
  avgReactionTimeMs: number;
  zScore: number; // Score Z-Score
  empiricalPercentile: number; // Score Percentile
  normalPercentile: number;
  hitZScore: number;
  hitPercentile: number;
  missZScore: number;
  missPercentile: number;
  previousMean?: number;
  newMean?: number;
  meanDelta?: number;
}

export type MoleState =
  | 'empty'
  | 'mole_up'
  | 'golden_up'
  | 'speedy_up'
  | 'frozen_up'
  | 'whacked'
  | 'whacked_golden'
  | 'whacked_speedy'
  | 'whacked_frozen'
  | 'cooling_down'
  | 'cooling_down_golden'
  | 'cooling_down_speedy'
  | 'cooling_down_frozen';

export interface MoleHoleData {
  id: number;
  state: MoleState;
  moleType?: MoleType;
  appearedAt: number;
  expiresAt?: number;
  cooldownUntil?: number;
  cooldownDurationMs?: number;
  hitCount?: number;
}

export interface FloatingFeedback {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface DatasetStatistics {
  scores: number[];
  count: number;
  mean: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
}
