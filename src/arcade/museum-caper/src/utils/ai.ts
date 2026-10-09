import { 
  GameState, 
  Position, 
  TileData, 
  ActionDieFace,
  DetectiveCharacter 
} from '../types/game';
import { 
  manhattanDistance, 
  getValidMoveTiles, 
  checkCameraLineOfSight, 
  hasDirectLineOfSight 
} from './rulesEngine';
import { getRoomForCoord } from './boardLayout';

/**
 * AI Detective selects their move
 */
export function getAIDetectiveMove(
  det: DetectiveCharacter,
  movesAvailable: number,
  state: GameState,
  tiles: TileData[][]
): Position {
  const validMoves = getValidMoveTiles(det.pos, movesAvailable, tiles, state.locks, state.paintings, true);
  if (validMoves.length === 0) return det.pos;

  let targetPos: Position | null = null;

  // 1. If thief is currently spotted, hunt them down directly!
  if (state.thief.isSpotted) {
    targetPos = state.thief.pos;
  } 
  // 2. If a painting is being cut or was recently stolen, patrol there
  else if (state.thief.cuttingPaintingId) {
    const cuttingPainting = state.paintings.find(p => p.id === state.thief.cuttingPaintingId);
    if (cuttingPainting) {
      targetPos = cuttingPainting.pos;
    }
  } 
  // 3. Otherwise patrol key corridors or paintings that are still intact
  else {
    const intactPaintings = state.paintings.filter(p => p.status === 'intact');
    if (intactPaintings.length > 0) {
      // Pick nearest painting to protect
      const sorted = [...intactPaintings].sort(
        (a, b) => manhattanDistance(det.pos, a.pos) - manhattanDistance(det.pos, b.pos)
      );
      targetPos = sorted[0].pos;
    } else {
      // Patrol exits to trap thief
      const unlockedLocks = state.locks.filter(l => !l.isLocked || !l.revealed);
      if (unlockedLocks.length > 0) {
        targetPos = unlockedLocks[0].pos;
      }
    }
  }

  if (!targetPos) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Pick valid move that minimizes distance to target
  let bestMove = validMoves[0];
  let bestDist = manhattanDistance(bestMove, targetPos);

  for (const m of validMoves) {
    const dist = manhattanDistance(m, targetPos);
    if (dist < bestDist) {
      bestDist = dist;
      bestMove = m;
    }
  }

  return bestMove;
}

/**
 * AI Detective picks the best camera to scan
 */
export function getAICameraScanSelection(state: GameState): number {
  const workingCameras = state.cameras.filter(c => !c.isCut);
  if (workingCameras.length === 0) return 1;

  // Pick a camera covering a room with remaining paintings
  const intact = state.paintings.filter(p => p.status === 'intact');
  if (intact.length > 0) {
    const randomPainting = intact[Math.floor(Math.random() * intact.length)];
    const closestCam = [...workingCameras].sort(
      (a, b) => manhattanDistance(a.pos, randomPainting.pos) - manhattanDistance(b.pos, randomPainting.pos)
    )[0];
    return closestCam.number;
  }

  return workingCameras[Math.floor(Math.random() * workingCameras.length)].number;
}

/**
 * AI Thief decision
 */
export function getAIThiefMove(
  state: GameState,
  tiles: TileData[][]
): { nextPos: Position; willCutCamera: boolean; willCutPower: boolean } {
  const { thief, paintings, locks, detectives } = state;
  const validMoves = getValidMoveTiles(thief.pos, 3, tiles, locks, paintings, false);
  if (validMoves.length === 0) {
    return { nextPos: thief.pos, willCutCamera: false, willCutPower: false };
  }

  // 1. If currently cutting a painting and on it, thief stays to finish cutting!
  if (thief.cuttingPaintingId) {
    return { nextPos: thief.pos, willCutCamera: false, willCutPower: false };
  }

  // 2. If 3 or more paintings stolen, ESCAPE towards nearest unlocked perimeter door/window!
  if (thief.paintingsInBag.length >= 3) {
    const unlockedExits = locks.filter(l => !l.isLocked && !l.isPermanentlyLocked);
    let bestExit = unlockedExits[0] || locks.find(l => !l.isPermanentlyLocked) || locks[0];
    let minDist = Infinity;
    for (const exit of unlockedExits) {
      const d = manhattanDistance(thief.pos, exit.pos);
      if (d < minDist) {
        minDist = d;
        bestExit = exit;
      }
    }

    // Move towards exit while avoiding detectives
    let bestMove = validMoves[0];
    let bestScore = -Infinity;

    for (const m of validMoves) {
      const distToExit = manhattanDistance(m, bestExit.pos);
      // Min distance to any detective
      const minDetDist = Math.min(...detectives.map(d => manhattanDistance(m, d.pos)));
      // Score: lower exit distance, higher detective distance
      const score = (100 - distToExit * 2) + (minDetDist >= 3 ? 20 : minDetDist * 5);
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }

    return { nextPos: bestMove, willCutCamera: false, willCutPower: false };
  }

  // 3. Otherwise, target the closest intact painting
  const intact = paintings.filter(p => p.status === 'intact');
  if (intact.length > 0) {
    const sorted = [...intact].sort(
      (a, b) => manhattanDistance(thief.pos, a.pos) - manhattanDistance(thief.pos, b.pos)
    );
    const target = sorted[0];

    // Check if any valid move lands directly on the target painting
    const directHit = validMoves.find(m => m.x === target.pos.x && m.y === target.pos.y);
    if (directHit) {
      return { nextPos: directHit, willCutCamera: false, willCutPower: false };
    }

    // Move towards painting, preferring safe stealth paths
    let bestMove = validMoves[0];
    let bestDist = Infinity;

    for (const m of validMoves) {
      const dist = manhattanDistance(m, target.pos);
      const minDetDist = Math.min(...detectives.map(d => manhattanDistance(m, d.pos)));
      // Penalty if detective is too close
      const safetyPenalty = minDetDist <= 2 ? 10 : 0;
      if (dist + safetyPenalty < bestDist) {
        bestDist = dist + safetyPenalty;
        bestMove = m;
      }
    }

    return { nextPos: bestMove, willCutCamera: false, willCutPower: false };
  }

  return { nextPos: validMoves[0], willCutCamera: false, willCutPower: false };
}
