export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

export interface Position {
  x: number; // column (0 .. width - 1)
  y: number; // row
}

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'exploded' | 'disarmed';

export type HazardType = 'mud' | 'electric_fence';

export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isDefused?: boolean; // Successfully defused via flag
  state: CellState;
  neighborMines: number;
  hazard?: HazardType;
  hasCrate?: 'emp' | 'sonar' | 'armor' | 'intel';
  hasWatchtower?: boolean; // Recon Watchtower structure
  isWatchtowerActivated?: boolean; // Activated by player stepping or scanning
  isScanned?: boolean; // Revealed by Sonar or Watchtower without revealing cell
  isPebbleTested?: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'paused';
export type GameMode = 'campaign' | 'endless' | 'custom';

export type AbilityType = 'emp' | 'jump' | 'sonar' | 'drone';

export interface AbilityInfo {
  type: AbilityType;
  name: string;
  key: string;
  description: string;
  charges: number;
  maxCharges: number;
  icon: string;
  cooldown?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  codename: string;
  width: number;
  height: number;
  mineCount: number;
  initialArmor: number;
  initialEmp: number;
  initialJumps: number;
  initialSonar: number;
  initialDrones: number;
  initialDefusalKits?: number;
  hasPatrolDrone?: boolean;
  cratesCount: number;
  description: string;
  hasMud?: boolean;
  hasElectricFence?: boolean;
  hasWatchtower?: boolean;
  watchtowerCount?: number;
  parTime?: number; // Target seconds for Speed Demon reward
}

export interface MissionAccolade {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  earned: boolean;
  xpReward: number;
  iconType: 'speed' | 'clearance' | 'flawless' | 'purist' | 'recon';
}

export interface UpgradesState {
  maxArmor: number;
  maxEmp: number;
  maxJumps: number;
  maxSonar: number;
  maxDrones: number;
  sonarRadius: number; // 2 = 5x5
  visionRange: number; // default 3.5
  maxDefusalKits: number; // default 4
}

export interface PlayerStats {
  levelsCompleted: number;
  totalMinesDefused: number;
  totalMinesEncountered: number;
  totalSteps: number;
  abilitiesUsed: number;
  deaths: number;
  intelPoints: number;
  falseDefusalsCount: number;
  endlessBestDistance: number;
  medalsEarnedCount?: number;
  highScores: Record<number, { time: number; stars: number; moves: number; medals?: string[] }>;
}

