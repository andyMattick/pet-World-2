export type GameRole = 'thief' | 'detectives' | 'pass_and_play';

export type RoomColor = 
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'orange'
  | 'power_room'
  | 'corridor';

export type ActionDieFace = 'eyes' | 'camera_scan' | 'motion_detector';

export interface Position {
  x: number;
  y: number;
}

export interface PerimeterLock {
  id: string;
  name: string;
  pos: Position; // tile coordinate on perimeter
  isWindow: boolean;
  isLocked: boolean; // True if locked, False if unlocked
  revealed: boolean; // Face-down until inspected or thief tries to escape
  isPermanentlyLocked?: boolean; // True if sealed by a detective with Lockdown
  lockedDownBy?: string; // Name of detective who padlocked it
}

export type ArtMediumType = 'painting' | 'sculpture' | 'artifact' | 'tapestry' | 'relic';

export interface Painting {
  id: string;
  number: number;
  name: string;
  artist: string;
  year?: string;
  medium?: string;
  type?: ArtMediumType;
  location?: string;
  funFact?: string;
  wrongCreators?: string[];
  wrongLocations?: string[];
  imageUrl?: string;
  fullImageUrl?: string;
  extract?: string | null;
  roomColor: RoomColor;
  roomName: string;
  pos: Position;
  // Stealing takes 2 turns:
  // 1. Land on space (status becomes 'cutting')
  // 2. Wait full turn, then solve educational heist quiz ('stolen' or 'destroyed')
  status: 'intact' | 'cutting' | 'stolen' | 'destroyed';
  stolenTurn?: number;
}

export interface SecurityCamera {
  number: number; // 1 to 6
  pos: Position;
  facing: 'north' | 'south' | 'east' | 'west' | 'all_angles';
  isCut: boolean;
}

export interface DetectiveCharacter {
  id: string;
  name: string;
  clueName: string;
  color: string;
  bgClass: string;
  pos: Position;
  sleepTurns: number; // >0 if tranquilized to sleep!
}

export interface FootstepPoint {
  pos: Position;
  turn: number;
}

export interface ThiefState {
  pos: Position;
  startPos: Position;
  isSpotted: boolean;
  spotReason: string | null;
  paintingsInBag: string[]; // painting IDs
  cuttingPaintingId: string | null;
  movesRemaining: number;
  stepsHistory: Position[];
  footstepTrails: FootstepPoint[];
  sleepDarts: number; // Tranquilizer darts to put a guard to sleep!
  smokeBombs: number; // Smoke bombs to block vision!
  adrenalineUsed: boolean; // One-time sprint boost (+2 moves)
  lockpicks: number;
  escaped: boolean;
}

export interface SmokeCloud {
  id: string;
  pos: Position;
  turnsRemaining: number;
}

export interface TileData {
  x: number;
  y: number;
  roomColor: RoomColor;
  roomName: string;
  isWall: boolean;
  isDoor: boolean;
  isWindow: boolean;
  isPerimeter: boolean;
  isPowerRoom: boolean;
}

export interface GameLogEntry {
  id: string;
  turn: number;
  phase: 'thief' | 'detective';
  actor: string;
  text: string;
  type: 'move' | 'alarm' | 'cut' | 'theft' | 'spotted' | 'dice' | 'action' | 'escape' | 'catch' | 'gadget';
  timestamp: string;
}

export interface GameState {
  role: GameRole;
  turnNumber: number;
  activePhase: 'thief' | 'detective';
  currentDetectiveIndex: number; // Rotates: Det 0 -> Thief -> Det 1 -> Thief -> Det 2...
  
  thief: ThiefState;
  detectives: DetectiveCharacter[];
  paintings: Painting[];
  cameras: SecurityCamera[];
  locks: PerimeterLock[];
  smokeClouds: SmokeCloud[];
  
  powerOutageTurns: number; // 0 if power is on; >0 if power cut
  uvTrackerActive: boolean; // Detective UV blacklight footstep tracker
  alarmLevel: 1 | 2 | 3; // 1: Standard, 2: Elevated, 3: Full Museum Lockdown
  
  // Detective turn rolls
  movementRoll: number | null;
  actionRoll: ActionDieFace | null;
  actionUsed: boolean;
  movesRemaining: number;
  
  // Modals & prompts
  selectedCameraForScan: number | null;
  actionResultPrompt: string | null;
  gameOver: 'thief_escaped' | 'thief_caught' | null;
  privacyShieldActive: boolean; // For pass and play or hiding thief pad
  
  // Educational Heist Quiz
  quizState: {
    isOpen: boolean;
    artPiece: Painting;
    phase: 'creator' | 'location' | 'bonus_gadget' | 'destroyed';
    creatorOptions: string[];
    eliminatedCreatorOptions: string[];
    locationOptions: string[];
    eliminatedLocationOptions: string[];
    selectedCreatorAnswer: string | null;
    selectedLocationAnswer: string | null;
    isCreatorCorrect: boolean | null;
    isLocationCorrect: boolean | null;
    optionsCount: number;
    consecutiveStolenCount: number;
    awardedGadget: string | null;
  } | null;

  // Infiltration selection (thief can choose any door or window)
  isInfiltrationSetup: boolean;

  logs: GameLogEntry[];
}
