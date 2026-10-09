import { 
  GameState, 
  Position, 
  TileData, 
  Painting, 
  SecurityCamera, 
  PerimeterLock, 
  DetectiveCharacter, 
  ThiefState, 
  ActionDieFace,
  GameLogEntry,
  SmokeCloud
} from '../types/game';
import { BOARD_SIZE, POWER_ROOM_POS, getRoomForCoord, hasWallBetween } from './boardLayout';

/**
 * Orthogonal distance / steps
 */
export function manhattanDistance(p1: Position, p2: Position): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

/**
 * Checks if a tile is passable for movement
 */
export function isTileWalkable(x: number, y: number, tiles: TileData[][], locks: PerimeterLock[]): boolean {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return false;
  const tile = tiles[y]?.[x];
  if (!tile) return false;

  // Outer perimeter check: must have a lock (door/window)
  const isPerimeter = x === 0 || x === BOARD_SIZE - 1 || y === 0 || y === BOARD_SIZE - 1;
  if (isPerimeter) {
    const lock = locks.find(l => l.pos.x === x && l.pos.y === y);
    return !!lock;
  }

  return true;
}

/**
 * Finds shortest step-by-step path from `from` to `to` within `maxSteps`
 * Returns array of coordinates: [from, step1, step2, ..., to]
 */
export function findShortestPath(
  from: Position,
  to: Position,
  maxSteps: number,
  tiles: TileData[][],
  locks: PerimeterLock[],
  paintings: Painting[],
  isDetective: boolean = false
): Position[] | null {
  if (from.x === to.x && from.y === to.y) return [from];

  const paintingTiles = new Set(
    paintings.filter(p => p.status === 'intact' || p.status === 'cutting').map(p => `${p.pos.x},${p.pos.y}`)
  );

  const queue: { pos: Position; path: Position[] }[] = [{ pos: from, path: [from] }];
  const visited = new Set<string>([`${from.x},${from.y}`]);

  const deltas = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (path.length - 1 === maxSteps) continue;

    for (const d of deltas) {
      const nextPos: Position = { x: pos.x + d.dx, y: pos.y + d.dy };
      const key = `${nextPos.x},${nextPos.y}`;

      if (
        nextPos.x >= 0 && nextPos.x < BOARD_SIZE &&
        nextPos.y >= 0 && nextPos.y < BOARD_SIZE &&
        !visited.has(key)
      ) {
        // Must not have a solid wall or perimeter block
        if (!hasWallBetween(pos, nextPos, locks)) {
          // Detectives cannot step onto intact paintings
          if (isDetective && paintingTiles.has(key)) {
            continue;
          }

          if (nextPos.x === to.x && nextPos.y === to.y) {
            return [...path, nextPos];
          }

          visited.add(key);
          queue.push({ pos: nextPos, path: [...path, nextPos] });
        }
      }
    }
  }

  return null;
}

/**
 * Returns all valid move tiles (reachable within maxSteps respecting room walls and doors)
 */
export function getValidMoveTiles(
  currentPos: Position,
  maxSteps: number,
  tiles: TileData[][],
  locks: PerimeterLock[],
  paintings: Painting[],
  isDetective: boolean = false
): Position[] {
  const validMap = new Map<string, Position>();
  const paintingTiles = new Set(
    paintings.filter(p => p.status === 'intact' || p.status === 'cutting').map(p => `${p.pos.x},${p.pos.y}`)
  );

  const queue: { pos: Position; steps: number }[] = [{ pos: currentPos, steps: 0 }];
  const visited = new Map<string, number>();
  visited.set(`${currentPos.x},${currentPos.y}`, 0);

  const deltas = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const { pos, steps } = queue.shift()!;
    if (steps < maxSteps) {
      for (const d of deltas) {
        const nextPos: Position = { x: pos.x + d.dx, y: pos.y + d.dy };
        const key = `${nextPos.x},${nextPos.y}`;

        if (
          nextPos.x >= 0 && nextPos.x < BOARD_SIZE &&
          nextPos.y >= 0 && nextPos.y < BOARD_SIZE
        ) {
          // Strict wall & door checking
          if (!hasWallBetween(pos, nextPos, locks)) {
            // Detectives cannot land on paintings per official rules!
            if (isDetective && paintingTiles.has(key)) {
              continue;
            }

            const currentBest = visited.get(key);
            if (currentBest === undefined || steps + 1 < currentBest) {
              visited.set(key, steps + 1);
              queue.push({ pos: nextPos, steps: steps + 1 });
              validMap.set(key, nextPos);
            }
          }
        }
      }
    }
  }

  validMap.delete(`${currentPos.x},${currentPos.y}`);
  return Array.from(validMap.values());
}

/**
 * Line of sight check between two points.
 * Ray cannot cross solid gallery walls or smoke screens.
 */
export function hasDirectLineOfSight(
  from: Position, 
  to: Position, 
  tiles: TileData[][], 
  locks: PerimeterLock[] = [],
  smokeClouds: SmokeCloud[] = []
): boolean {
  const smokeMap = new Set(smokeClouds.map(s => `${s.pos.x},${s.pos.y}`));

  // If start or destination is in smoke, vision is blocked
  if (smokeMap.has(`${from.x},${from.y}`) || smokeMap.has(`${to.x},${to.y}`)) {
    return false;
  }

  // If in the same room and no smoke in room
  const fromRoom = getRoomForCoord(from.x, from.y).roomColor;
  const toRoom = getRoomForCoord(to.x, to.y).roomColor;
  if (fromRoom !== 'corridor' && fromRoom === toRoom) {
    return true;
  }

  // Orthogonal line of sight (hallway sightlines or looking directly through doorway)
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 || dy === 0) {
    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    let curr: Position = { ...from };

    while (curr.x !== to.x || curr.y !== to.y) {
      const next: Position = { x: curr.x + stepX, y: curr.y + stepY };
      if (hasWallBetween(curr, next, locks)) {
        return false; // Solid wall blocks sightline!
      }
      if (smokeMap.has(`${next.x},${next.y}`)) {
        return false; // Smoke screen blocks ray!
      }
      curr = next;
    }
    return true;
  }

  return false;
}

/**
 * Checks if ANY awake detective currently has line of sight to the thief
 */
export function checkDetectivesLineOfSight(
  detectives: DetectiveCharacter[],
  thiefPos: Position,
  tiles: TileData[][],
  locks: PerimeterLock[] = [],
  smokeClouds: SmokeCloud[] = []
): { spotted: boolean; spotterName?: string } {
  for (const det of detectives) {
    // Sleeping detectives cannot see!
    if (det.sleepTurns > 0) continue;

    if (hasDirectLineOfSight(det.pos, thiefPos, tiles, locks, smokeClouds)) {
      return { spotted: true, spotterName: det.name };
    }
  }
  return { spotted: false };
}

/**
 * Checks if a specific camera has line of sight to the thief
 */
export function checkCameraLineOfSight(
  camera: SecurityCamera,
  thiefPos: Position,
  tiles: TileData[][],
  powerOut: boolean,
  locks: PerimeterLock[] = [],
  smokeClouds: SmokeCloud[] = []
): { seesThief: boolean; status: 'online_detected' | 'online_clear' | 'cut' | 'power_down' } {
  if (camera.isCut) {
    return { seesThief: false, status: 'cut' };
  }
  if (powerOut) {
    return { seesThief: false, status: 'power_down' };
  }

  // Camera sees along intersecting corridors or through doorway within 5 tiles
  const dist = manhattanDistance(camera.pos, thiefPos);
  if (dist <= 5 && hasDirectLineOfSight(camera.pos, thiefPos, tiles, locks, smokeClouds)) {
    return { seesThief: true, status: 'online_detected' };
  }

  return { seesThief: false, status: 'online_clear' };
}
