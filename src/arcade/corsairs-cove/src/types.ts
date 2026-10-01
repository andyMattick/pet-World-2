export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export interface Position {
  x: number;
  y: number;
}

export interface GridCoord {
  col: number;
  row: number;
}

export type TileType = 
  | 'EMPTY'
  | 'WALL'
  | 'COIN'
  | 'POWER_GROG'        // Grog Barrel
  | 'POWER_INVISIBILITY'  // Ghost Mist
  | 'POWER_SPEED'         // Swift Wind
  | 'POWER_KEG'           // Powder Keg
  | 'GATE'                // Guard pen gate
  | 'CHEST'               // Bonus treasure
  | 'TREASURE_VAULT'      // Pirate Island Bank (drop off cargo doubloons)
  | 'PORTAL_WHIRLPOOL'    // Mystic Sea Portal / Whirlpool
  | 'REPAIR_DOCK'         // Shipyard Drydock: Repairs Ship Hull to 100% (2/2 HP)
  | 'AMMO_DEPOT';         // Legacy alias for Repair Haven

export type GuardPersonality = 'CHASER' | 'AMBUSHER' | 'FLANKER' | 'PATROLLER';

export type GuardState = 'IN_PEN' | 'EXITING_PEN' | 'CHASE' | 'SCATTER' | 'FRIGHTENED' | 'RETURNING';

export interface Guard {
  id: string;
  name: string;
  rank: string;
  personality: GuardPersonality;
  color: string;
  frightenedColor: string;
  x: number;
  y: number;
  gridCol: number;
  gridRow: number;
  dir: Direction;
  nextDir: Direction;
  targetCol: number;
  targetRow: number;
  speed: number;
  state: GuardState;
  homeCorner: GridCoord;
  penPosition: GridCoord;
  penTimer: number;
  frightenedTimer: number;
  returnTimer?: number;
  shootCooldown?: number;
}

export interface Cannonball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  distanceTraveled: number;
  maxDistance: number;
  isEnemy?: boolean;
}

export interface PlacedKeg {
  id: number;
  x: number;
  y: number;
  fuseTimer: number;
}

export interface AmbientSeaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  type: 'SPRAY' | 'BUBBLE' | 'GLINT';
  phase: number;
}

export interface PiratePlayer {
  x: number;
  y: number;
  gridCol: number;
  gridRow: number;
  dir: Direction;
  nextDir: Direction;
  speed: number;
  mouthAngle: number;
  mouthDir: number;
  characterId: string;
  heading?: number;
  // Sprite animation states
  isMoving: boolean;
  walkFrame: number;
  collectGoldTimer: number;
  collectGoldFrame: number;
  totalGoldCollected: number;
  // Weapons & Ammo (land at coves / depots to refill!)
  cannonAmmo: number;
  maxCannonAmmo: number;
  kegAmmo: number;
  maxKegAmmo: number;
  windCharges: number;
  maxWindCharges: number;
  cloakCharges: number;
  maxCloakCharges: number;
  cloakUnlocked: boolean;
  carriedCoins: number;
  bankedCoins: number;
  shootCooldown: number;
  hull: number;
  maxHull: number;
}

export interface PirateCharacter {
  id: string;
  name: string;
  title: string;
  color: string;
  accentColor: string;
  description: string;
  perk: string;
  perkType: 'SPEED' | 'POWER' | 'GOLD';
  isMathUnlocked?: boolean;
  requiredSolved?: number;
  requiredStreak?: number;
}

export interface ActivePowerUp {
  type: 'GROG' | 'INVISIBILITY' | 'SPEED' | 'KEG';
  remainingMs: number;
  totalMs: number;
}

export interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape?: 'circle' | 'sparkle' | 'smoke' | 'skull';
}

export type GameStatus = 
  | 'MENU' 
  | 'COUNTDOWN' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'POWERUP_CHALLENGE' 
  | 'DIED' 
  | 'LEVEL_CLEAR' 
  | 'GAME_OVER';

export type MathOperation = 
  | 'ADDITION' 
  | 'SUBTRACTION' 
  | 'MULTIPLICATION' 
  | 'DIVISION' 
  | 'ORDER_OF_OPERATIONS';

export interface MathConfig {
  operations: MathOperation[];
  minLevel: number; // 1 to 10
  maxLevel: number; // 1 to 10
  timedMode: boolean;
  timeLimitSeconds: number;
}

export interface ProblemRecord {
  id: string;
  timestamp: number;
  challengeNumber: number;
  operation: MathOperation;
  difficultyLevel: number;
  difficultyName: string;
  question: string;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
  attempts: number;
  forfeited: boolean;
  explanation: string;
  hint: string;
  bonusPoints: number;
  powerUpName: string;
  answerTimeSeconds?: number;
  speedBonusPoints?: number;
  levelNumber?: number;
}

export interface MathChallenge {
  powerUpType: 'POWER_GROG' | 'POWER_INVISIBILITY' | 'POWER_SPEED' | 'POWER_KEG';
  powerUpName: string;
  powerUpIcon: string;
  powerUpDescription: string;
  tileCol: number;
  tileRow: number;
  challengeNumber: number;
  operation: MathOperation;
  difficultyLevel: number;
  difficultyName: string;
  question: string;
  correctAnswer: number;
  bonusPoints: number;
  explanation: string;
  hint: string;
  timeLimitSeconds?: number;
  openedTimestamp?: number;
}

export interface LevelClearSummary {
  level: number;
  islandName: string;
  elapsedSeconds: number;
  parTimeSeconds: number;
  speedRank: 'GOLD' | 'SILVER' | 'BRONZE' | 'STANDARD';
  speedMedalEmoji: string;
  speedBounty: number;
  mathSolvedThisLevel: number;
  mathTotalThisLevel: number;
  mathAccuracyPct: number;
  avgAnswerSpeedSeconds: number;
  nextLevelNumber: number;
  nextIslandName: string;
  nextMathDifficultyName: string;
  nextUnlockedFeature: string;
}

export interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  level: number;
  lives: number;
  coinsRemaining: number;
  totalCoins: number;
  guardsDefeatedInGrog: number;
  activePowers: ActivePowerUp[];
  selectedCharacter: PirateCharacter;
  soundEnabled: boolean;
  musicEnabled: boolean;
  powerUpsUsedCount: number;
  mathProblemsSolved: number;
  levelMathSolved: number; // Max 10 per level
  levelMilestonesUnlocked: number[]; // 1 to 10 for the current level
  levelStartTime: number;
  levelElapsedTime: number;
  doubleDoubloonRemaining: number;
  currentMathStreak: number;
  bestMathStreak: number;
  unlockedMilestones: number[];
  recentRewardNotification: {
    id: string;
    title: string;
    badge: string;
    icon: string;
    color: string;
    description: string;
    timestamp: number;
  } | null;
  levelClearSummary: LevelClearSummary | null;
  mathChallenge: MathChallenge | null;
  mathConfig: MathConfig;
  mathHistory: ProblemRecord[];
  bonusItem: {
    type: 'CHEST' | 'CHALICE' | 'COMPASS';
    col: number;
    row: number;
    points: number;
    timer: number;
    visible: boolean;
  } | null;
  targetCoins: number;
  mapSeed: number;
  hull: number;
  maxHull: number;
  cannonAmmo: number;
  maxCannonAmmo: number;
  kegAmmo: number;
  maxKegAmmo: number;
  windCharges: number;
  maxWindCharges: number;
  cloakCharges: number;
  maxCloakCharges: number;
  cloakUnlocked: boolean;
  carriedCoins: number;
  bankedCoins: number;
  captainsLog: CaptainsLogEntry[];
}

export interface CaptainsLogEntry {
  id: string;
  timestamp: number;
  timeFormatted: string; // e.g. "01:45"
  type: 'VAULT' | 'SHIP_SUNK' | 'REPAIR' | 'DAMAGE' | 'CIPHER' | 'MILESTONE' | 'PORTAL' | 'VOYAGE';
  title: string;
  detail: string;
  badge?: string;
  icon?: string;
}

export interface VaultLocation {
  col: number;
  row: number;
  x: number;
  y: number;
  distance: number;
}

export interface VaultBeaconState {
  timer: number;
  pulsePhase: number;
  beaconIntensity: number;
  nearestVault: VaultLocation | null;
  vaults: VaultLocation[];
  carriedCoins: number;
}
