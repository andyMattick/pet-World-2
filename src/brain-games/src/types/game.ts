export type CognitiveDomain =
  | 'working_memory'
  | 'cognitive_flexibility'
  | 'inhibitory_control'
  | 'processing_speed'
  | 'visuospatial'
  | 'inductive_reasoning'
  | 'numerical_fluency'
  | 'verbal_fluency'
  | 'spatial_rotation'
  | 'sustained_vigilance'
  | 'rule_induction'
  | 'sequential_visuospatial';

export interface BrainRegion {
  name: string;
  anatomicalCode: string;
  description: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  targetDomain: CognitiveDomain;
  domainLabel: string;
  primaryBrainRegion: BrainRegion;
  clinicalBasis: string;
  dailyDosage: string;
  difficultyLevels: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  instructions: string[];
}

export interface GameResult {
  gameId: string;
  score: number;
  accuracy: number; // 0 to 100
  avgReactionTimeMs: number;
  completedAt: string;
  durationSeconds: number;
  difficulty: string;
  peakStreak?: number;
}

export interface SessionRecord {
  id: string;
  gameId: string;
  gameTitle: string;
  domain: CognitiveDomain;
  score: number;
  accuracy: number;
  reactionTimeMs: number;
  timestamp: string;
  durationSeconds: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'score' | 'streak' | 'consecutive' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  neurologicalBenefit: string;
  check: (stats: UserStats, latestResult?: GameResult) => { isUnlocked: boolean; progress: number; current: number; max: number; label: string };
}

export interface BaselineResult {
  completedAt: string;
  overallScore: number;
  domainScores: {
    workingMemory: number;
    inhibitoryControl: number;
    processingSpeed: number;
    mentalAgility: number;
  };
  strongestDomain: string;
  growthDomain: string;
  prescribedPath: {
    id: string;
    name: string;
    description: string;
    recommendedGameIds: string[];
  };
}

export interface UserStats {
  totalSessions: number;
  totalTimeSeconds: number;
  scoresByGame: Record<string, {
    highScore: number;
    bestAccuracy: number;
    bestReactionTime: number;
    sessionsPlayed: number;
    lastPlayed: string;
    peakStreak?: number;
  }>;
  domainStimulation: Record<CognitiveDomain, number>;
  dailyCompletedDates: string[]; // YYYY-MM-DD
  // Enhanced tracking
  consecutiveDaysStreak: number;
  consecutiveGamesToday: number;
  lastCheckInDate: string; // YYYY-MM-DD
  unlockedAchievementIds: string[];
  achievementUnlockDates: Record<string, string>;
  sessionHistory: SessionRecord[];
  dailyStimulationHistory: Record<string, number>; // YYYY-MM-DD -> points
  baselineResult?: BaselineResult | null;
  dailyWorkoutCompletedGameIds: string[]; // Game IDs completed today as part of daily workout
}
