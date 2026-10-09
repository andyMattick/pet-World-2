import { 
  RoomColor, 
  TileData, 
  Painting, 
  SecurityCamera, 
  PerimeterLock, 
  DetectiveCharacter, 
  ThiefState, 
  Position 
} from '../types/game';
import { ART_CATALOG, ArtPieceData } from '../data/artCatalog';
import { ART_IMAGES_MAP } from '../data/artImagesMap';

export const BOARD_SIZE = 12; // 12x12 grid (0 to 11)

export const POWER_ROOM_POS: Position = { x: 5, y: 5 };

export interface WallBorders {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export interface GalleryDoor {
  id: string;
  name: string;
  pos: Position; // Tile where the door is located
  connectsTo: Position; // The corridor tile it opens into
  roomColor: RoomColor;
  roomName: string;
}

export const ROOM_INFO: Record<RoomColor, { name: string; hex: string; bgClass: string; textClass: string }> = {
  red: { name: 'Red Gallery', hex: '#dc2626', bgClass: 'bg-red-950/40 border-red-500/50', textClass: 'text-red-400' },
  blue: { name: 'Blue Gallery', hex: '#2563eb', bgClass: 'bg-blue-950/40 border-blue-500/50', textClass: 'text-blue-400' },
  yellow: { name: 'Yellow Gallery', hex: '#ca8a04', bgClass: 'bg-amber-950/40 border-amber-500/50', textClass: 'text-amber-400' },
  green: { name: 'Green Gallery', hex: '#16a34a', bgClass: 'bg-emerald-950/40 border-emerald-500/50', textClass: 'text-emerald-400' },
  purple: { name: 'Purple Gallery', hex: '#9333ea', bgClass: 'bg-purple-950/40 border-purple-500/50', textClass: 'text-purple-400' },
  orange: { name: 'Orange Gallery', hex: '#ea580c', bgClass: 'bg-orange-950/40 border-orange-500/50', textClass: 'text-orange-400' },
  power_room: { name: 'Power Room (P)', hex: '#f59e0b', bgClass: 'bg-zinc-900 border-amber-500', textClass: 'text-amber-300' },
  corridor: { name: 'Corridor', hex: '#64748b', bgClass: 'bg-slate-900/60 border-slate-700/30', textClass: 'text-slate-400' },
};

/**
 * Designated gallery doors connecting rooms to museum corridors
 */
export const GALLERY_DOORS: GalleryDoor[] = [
  {
    id: 'door-red',
    name: 'Red Gallery Arched Door',
    pos: { x: 3, y: 2 },
    connectsTo: { x: 4, y: 2 },
    roomColor: 'red',
    roomName: 'Red Gallery',
  },
  {
    id: 'door-blue',
    name: 'Blue Gallery Arched Door',
    pos: { x: 8, y: 2 },
    connectsTo: { x: 7, y: 2 },
    roomColor: 'blue',
    roomName: 'Blue Gallery',
  },
  {
    id: 'door-yellow',
    name: 'Yellow Gallery Arched Door',
    pos: { x: 3, y: 6 },
    connectsTo: { x: 4, y: 6 },
    roomColor: 'yellow',
    roomName: 'Yellow Gallery',
  },
  {
    id: 'door-purple',
    name: 'Purple Gallery Arched Door',
    pos: { x: 8, y: 6 },
    connectsTo: { x: 7, y: 6 },
    roomColor: 'purple',
    roomName: 'Purple Gallery',
  },
  {
    id: 'door-green',
    name: 'Green Gallery Arched Door',
    pos: { x: 3, y: 9 },
    connectsTo: { x: 4, y: 9 },
    roomColor: 'green',
    roomName: 'Green Gallery',
  },
  {
    id: 'door-orange',
    name: 'Orange Gallery Arched Door',
    pos: { x: 8, y: 9 },
    connectsTo: { x: 7, y: 9 },
    roomColor: 'orange',
    roomName: 'Orange Gallery',
  },
  {
    id: 'door-power',
    name: 'Power Room Security Hatch',
    pos: { x: 5, y: 5 },
    connectsTo: { x: 5, y: 4 },
    roomColor: 'power_room',
    roomName: 'Power Generator Room (P)',
  },
];

/**
 * Returns room color for coordinates
 */
export function getRoomForCoord(x: number, y: number): { roomColor: RoomColor; roomName: string } {
  // Power room: center 5,5 and 6,5
  if ((x === 5 || x === 6) && (y === 5 || y === 6)) {
    return { roomColor: 'power_room', roomName: 'Power Generator Room (P)' };
  }

  // Red room: Top-Left (1..3, 1..3)
  if (x >= 1 && x <= 3 && y >= 1 && y <= 3) {
    return { roomColor: 'red', roomName: 'Red Gallery (Antiquities)' };
  }

  // Blue room: Top-Right (8..10, 1..3)
  if (x >= 8 && x <= 10 && y >= 1 && y <= 3) {
    return { roomColor: 'blue', roomName: 'Blue Gallery (Classical)' };
  }

  // Yellow room: Middle-Left (1..3, 5..7)
  if (x >= 1 && x <= 3 && y >= 5 && y <= 7) {
    return { roomColor: 'yellow', roomName: 'Yellow Gallery (Impressionism)' };
  }

  // Purple room: Middle-Right (8..10, 5..7)
  if (x >= 8 && x <= 10 && y >= 5 && y <= 7) {
    return { roomColor: 'purple', roomName: 'Purple Gallery (Modern Art)' };
  }

  // Green room: Bottom-Left (1..3, 8..10)
  if (x >= 1 && x <= 3 && y >= 8 && y <= 10) {
    return { roomColor: 'green', roomName: 'Green Gallery (Renaissance)' };
  }

  // Orange room: Bottom-Right (8..10, 8..10)
  if (x >= 8 && x <= 10 && y >= 8 && y <= 10) {
    return { roomColor: 'orange', roomName: 'Orange Gallery (Egyptian Relics)' };
  }

  return { roomColor: 'corridor', roomName: 'Museum Corridor' };
}

/**
 * Checks if there is a solid wall blocking movement between two adjacent coordinates (p1 and p2).
 * Strictly enforces that players CANNOT walk through gallery walls; they must use DOORS!
 */
export function hasWallBetween(p1: Position, p2: Position, locks: PerimeterLock[]): boolean {
  // Ensure adjacent
  const dx = Math.abs(p1.x - p2.x);
  const dy = Math.abs(p1.y - p2.y);
  if (dx + dy !== 1) return true; // Only orthogonal adjacent moves allowed

  // 1. Perimeter Wall Check
  const isP1Perimeter = p1.x === 0 || p1.x === BOARD_SIZE - 1 || p1.y === 0 || p1.y === BOARD_SIZE - 1;
  const isP2Perimeter = p2.x === 0 || p2.x === BOARD_SIZE - 1 || p2.y === 0 || p2.y === BOARD_SIZE - 1;

  if (isP1Perimeter) {
    const lock = locks.find(l => l.pos.x === p1.x && l.pos.y === p1.y);
    if (!lock) return true; // Solid perimeter wall
  }
  if (isP2Perimeter) {
    const lock = locks.find(l => l.pos.x === p2.x && l.pos.y === p2.y);
    if (!lock) return true; // Solid perimeter wall
  }

  // 2. Room vs Corridor Boundaries (Doorway Check)
  const room1 = getRoomForCoord(p1.x, p1.y).roomColor;
  const room2 = getRoomForCoord(p2.x, p2.y).roomColor;

  // Moving within the same room or within corridors is not blocked by room boundaries
  if (room1 === room2) return false;

  // If one is in a room and the other is in corridor (or another room),
  // they can ONLY pass through the designated DOOR!
  for (const door of GALLERY_DOORS) {
    const isDoorEntry = 
      (p1.x === door.pos.x && p1.y === door.pos.y && p2.x === door.connectsTo.x && p2.y === door.connectsTo.y) ||
      (p2.x === door.pos.x && p2.y === door.pos.y && p1.x === door.connectsTo.x && p1.y === door.connectsTo.y);
    if (isDoorEntry) {
      return false; // Allowed through the door!
    }
  }

  // Not a designated doorway: Solid wall blocks movement!
  return true;
}

/**
 * Returns wall borders for a specific tile to render on the board
 */
export function getTileWallBorders(x: number, y: number): WallBorders {
  const room = getRoomForCoord(x, y).roomColor;

  // Check north, south, east, west
  const checkSide = (nx: number, ny: number) => {
    if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) return false;
    const nRoom = getRoomForCoord(nx, ny).roomColor;
    if (room === nRoom) return false;

    // Check if this border is a door
    for (const door of GALLERY_DOORS) {
      if (
        (x === door.pos.x && y === door.pos.y && nx === door.connectsTo.x && ny === door.connectsTo.y) ||
        (nx === door.pos.x && ny === door.pos.y && x === door.connectsTo.x && y === door.connectsTo.y)
      ) {
        return false; // It's an open door, not a solid wall!
      }
    }

    // Otherwise it's a solid room partition wall!
    return room !== 'corridor' || nRoom !== 'corridor';
  };

  return {
    north: checkSide(x, y - 1),
    south: checkSide(x, y + 1),
    east: checkSide(x + 1, y),
    west: checkSide(x - 1, y),
  };
}

/**
 * Initial Perimeter Locks on windows and doors (placed face down in setup)
 */
export function createInitialLocks(): PerimeterLock[] {
  return [
    { id: 'lock-d1', name: 'North Main Gate', pos: { x: 5, y: 0 }, isWindow: false, isLocked: false, revealed: false },
    { id: 'lock-w1', name: 'Northwest Window', pos: { x: 2, y: 0 }, isWindow: true, isLocked: true, revealed: false },
    { id: 'lock-w2', name: 'Northeast Window', pos: { x: 9, y: 0 }, isWindow: true, isLocked: false, revealed: false },
    { id: 'lock-d2', name: 'East Service Door', pos: { x: 11, y: 6 }, isWindow: false, isLocked: true, revealed: false },
    { id: 'lock-w3', name: 'East Gallery Window', pos: { x: 11, y: 2 }, isWindow: true, isLocked: false, revealed: false },
    { id: 'lock-d3', name: 'South Grand Portico', pos: { x: 5, y: 11 }, isWindow: false, isLocked: false, revealed: false },
    { id: 'lock-w4', name: 'Southwest Window', pos: { x: 2, y: 11 }, isWindow: true, isLocked: true, revealed: false },
    { id: 'lock-d4', name: 'West Fire Door', pos: { x: 0, y: 6 }, isWindow: false, isLocked: false, revealed: false },
  ];
}

/**
 * 9 Art Pieces (paintings, sculptures, antiquities, tapestries) placed inside the rooms
 * (at least 1 per main room; none in corridors, power room, or right in front of doors/windows)
 * Sampled dynamically from the authentic 60+ real art piece catalog.
 */
export function createInitialPaintings(seed?: number): Painting[] {
  // Shuffle or sample 9 diverse art pieces from the catalog
  const catalogCopy = [...ART_CATALOG];
  for (let i = catalogCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [catalogCopy[i], catalogCopy[j]] = [catalogCopy[j], catalogCopy[i]];
  }

  const selectedPieces = catalogCopy.slice(0, 9);

  const roomAssignments: Array<{ roomColor: RoomColor; roomName: string; pos: Position }> = [
    // Red Gallery (2 pieces)
    { roomColor: 'red', roomName: 'Red Gallery', pos: { x: 1, y: 1 } },
    { roomColor: 'red', roomName: 'Red Gallery', pos: { x: 3, y: 1 } },
    // Blue Gallery (1 piece)
    { roomColor: 'blue', roomName: 'Blue Gallery', pos: { x: 9, y: 1 } },
    // Yellow Gallery (2 pieces)
    { roomColor: 'yellow', roomName: 'Yellow Gallery', pos: { x: 1, y: 7 } },
    { roomColor: 'yellow', roomName: 'Yellow Gallery', pos: { x: 2, y: 5 } },
    // Purple Gallery (1 piece)
    { roomColor: 'purple', roomName: 'Purple Gallery', pos: { x: 10, y: 6 } },
    // Green Gallery (2 pieces)
    { roomColor: 'green', roomName: 'Green Gallery', pos: { x: 1, y: 9 } },
    { roomColor: 'green', roomName: 'Green Gallery', pos: { x: 3, y: 10 } },
    // Orange Gallery (1 piece)
    { roomColor: 'orange', roomName: 'Orange Gallery', pos: { x: 9, y: 10 } },
  ];

  return selectedPieces.map((piece, index) => {
    const slot = roomAssignments[index];
    const imgMeta = ART_IMAGES_MAP[piece.id];
    return {
      id: piece.id,
      number: index + 1,
      name: piece.title,
      artist: piece.creator,
      year: piece.year,
      medium: piece.medium,
      type: piece.type,
      location: piece.location,
      funFact: piece.funFact,
      wrongCreators: piece.wrongCreators,
      wrongLocations: piece.wrongLocations,
      imageUrl: imgMeta?.imageUrl,
      fullImageUrl: imgMeta?.fullImageUrl,
      extract: imgMeta?.extract,
      roomColor: slot.roomColor,
      roomName: slot.roomName,
      pos: slot.pos,
      status: 'intact',
    };
  });
}

/**
 * 6 Security Cameras placed number-side up (1 to 6)
 */
export function createInitialCameras(): SecurityCamera[] {
  return [
    { number: 1, pos: { x: 4, y: 2 }, facing: 'all_angles', isCut: false },
    { number: 2, pos: { x: 7, y: 2 }, facing: 'all_angles', isCut: false },
    { number: 3, pos: { x: 4, y: 6 }, facing: 'all_angles', isCut: false },
    { number: 4, pos: { x: 7, y: 6 }, facing: 'all_angles', isCut: false },
    { number: 5, pos: { x: 4, y: 9 }, facing: 'all_angles', isCut: false },
    { number: 6, pos: { x: 7, y: 9 }, facing: 'all_angles', isCut: false },
  ];
}

/**
 * Detectives placed on starting spaces
 */
export function createInitialDetectives(): DetectiveCharacter[] {
  return [
    {
      id: 'det-scarlet',
      name: 'Miss Scarlet',
      clueName: 'Scarlet',
      color: '#ef4444',
      bgClass: 'bg-red-600',
      pos: { x: 5, y: 3 },
      sleepTurns: 0,
    },
    {
      id: 'det-mustard',
      name: 'Colonel Mustard',
      clueName: 'Mustard',
      color: '#eab308',
      bgClass: 'bg-amber-500',
      pos: { x: 6, y: 7 },
      sleepTurns: 0,
    },
    {
      id: 'det-green',
      name: 'Mr. Green',
      clueName: 'Green',
      color: '#22c55e',
      bgClass: 'bg-emerald-600',
      pos: { x: 7, y: 3 },
      sleepTurns: 0,
    },
  ];
}

/**
 * Thief initial state (starts secretly at an unlocked window or door)
 */
export function createInitialThief(startPos: Position = { x: 5, y: 0 }): ThiefState {
  return {
    pos: { ...startPos },
    startPos: { ...startPos },
    isSpotted: false,
    spotReason: null,
    paintingsInBag: [],
    cuttingPaintingId: null,
    movesRemaining: 3,
    stepsHistory: [{ ...startPos }],
    footstepTrails: [{ pos: { ...startPos }, turn: 1 }],
    sleepDarts: 2,
    smokeBombs: 2,
    adrenalineUsed: false,
    lockpicks: 1,
    escaped: false,
  };
}

/**
 * Generates grid tiles with walls and doorways between rooms and corridors
 */
export function generateBoardTiles(): TileData[][] {
  const grid: TileData[][] = [];
  const locks = createInitialLocks();
  const lockMap = new Map(locks.map(l => [`${l.pos.x},${l.pos.y}`, l]));
  const doorMap = new Map(GALLERY_DOORS.map(d => [`${d.pos.x},${d.pos.y}`, d]));

  for (let y = 0; y < BOARD_SIZE; y++) {
    const row: TileData[] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      const { roomColor, roomName } = getRoomForCoord(x, y);
      const isPerimeter = x === 0 || x === BOARD_SIZE - 1 || y === 0 || y === BOARD_SIZE - 1;
      const lock = lockMap.get(`${x},${y}`);
      const isGalleryDoor = doorMap.has(`${x},${y}`);

      let isWall = false;
      let isDoor = false;
      let isWindow = false;

      if (isPerimeter) {
        if (lock) {
          isDoor = !lock.isWindow;
          isWindow = lock.isWindow;
        } else {
          isWall = true;
        }
      } else if (isGalleryDoor) {
        isDoor = true;
      }

      const isPowerRoom = (x === 5 && y === 5);

      row.push({
        x,
        y,
        roomColor,
        roomName,
        isWall,
        isDoor,
        isWindow,
        isPerimeter,
        isPowerRoom,
      });
    }
    grid.push(row);
  }
  return grid;
}
