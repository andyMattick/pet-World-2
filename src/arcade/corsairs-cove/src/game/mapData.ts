import { TileType } from '../types';
import { GRID_COLS, GRID_ROWS } from './constants';

/**
 * Organic Caribbean Island Archipelago Procedural Generator:
 * Generates natural island atolls with sandy beaches, lagoons, and customizable coin density!
 * Every map (including the first one) is procedurally generated using unique seeds.
 * 
 * Includes:
 * - V: Pirate Treasure Vault (Sail into island pier to deposit cargo coins for massive bonus points!)
 * - W: Mystic Sea Portal / Whirlpool (Teleports ship across the ocean to a distant island!)
 * - A: Weapon Haven / Ammo Depot (Land on dock to reload cannons, powder kegs & charges!)
 * - G, S, I, K: Combat Power-Up Coves
 * - 100% path reachability via BFS auto-healing
 */

interface Point {
  c: number;
  r: number;
}

export function generateProceduralLayout(
  level: number,
  seed: number = Math.floor(Math.random() * 1000000),
  targetCoins: number = 200
): string[] {
  // Start with open Caribbean sea (' ')
  const grid: string[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(' '));

  // Seeded pseudo-random number generator
  let currentSeed = Math.abs(seed) % 2147483647;
  if (currentSeed === 0) currentSeed = 12345;
  const nextRand = () => {
    currentSeed = (currentSeed * 16807) % 2147483647;
    return (currentSeed - 1) / 2147483646;
  };

  // 1. Outer perimeter coral boundary
  for (let c = 0; c < GRID_COLS; c++) {
    grid[0][c] = '#';
    grid[GRID_ROWS - 1][c] = '#';
  }
  for (let r = 0; r < GRID_ROWS; r++) {
    grid[r][0] = '#';
    grid[r][GRID_COLS - 1] = '#';
  }

  // 2. Open Trade-Wind Wrap Tunnel at Row 14
  grid[14][0] = ' ';
  grid[14][GRID_COLS - 1] = ' ';
  for (let c = 0; c <= 4; c++) {
    grid[14][c] = ' ';
    grid[14][GRID_COLS - 1 - c] = ' ';
  }

  // Side barriers around the wrap tunnel
  for (let r = 9; r <= 19; r++) {
    if (r === 14) continue;
    grid[r][5] = '#';
    grid[r][GRID_COLS - 1 - 5] = '#';
  }

  // 3. Central Archipelago Sea & Tactical Cover Mini-Islands
  // Central Rock Atoll (2x2 rocky outcrop for evasion and tactical maneuvering)
  grid[13][13] = '#';
  grid[13][14] = '#';
  grid[14][13] = '#';
  grid[14][14] = '#';

  // Tactical hiding reefs, rock pillars, and sea walls across the sea (places to hide from cannon fire)
  grid[8][10] = '#';
  grid[8][11] = '#';
  grid[8][12] = '#';

  grid[20][15] = '#';
  grid[20][16] = '#';
  grid[20][17] = '#';

  grid[10][7] = '#';
  grid[11][7] = '#';
  grid[12][7] = '#';

  grid[10][20] = '#';
  grid[11][20] = '#';
  grid[12][20] = '#';

  grid[6][10] = '#';
  grid[6][11] = '#';
  grid[6][16] = '#';
  grid[6][17] = '#';

  grid[22][8] = '#';
  grid[22][9] = '#';
  grid[22][18] = '#';
  grid[22][19] = '#';

  // Additional tactical cover mini-islands & walls for ambush and evasion
  grid[4][8] = '#';
  grid[4][9] = '#';
  grid[4][18] = '#';
  grid[4][19] = '#';

  grid[16][8] = '#';
  grid[17][8] = '#';
  grid[16][19] = '#';
  grid[17][19] = '#';

  grid[25][7] = '#';
  grid[25][8] = '#';
  grid[25][19] = '#';
  grid[25][20] = '#';

  grid[18][11] = '#';
  grid[18][12] = '#';

  // Island Naval Base Harbors (where enemy warships deploy from)
  const navalBases = [
    { c: 13, r: 3 },  // North Naval Bastion (Sterling)
    { c: 24, r: 5 },  // North-East Naval Port (Hastings)
    { c: 4, r: 5 },   // North-West Fort (O'Malley)
    { c: 24, r: 13 }, // East Harbor Battery (Hawke)
    { c: 23, r: 24 }, // South-East Citadel (Drake)
    { c: 4, r: 24 },  // South-West Outpost (Higgins)
  ];
  for (const b of navalBases) {
    grid[b.r][b.c] = ' ';
  }

  // Player starting harbor at Row 23
  grid[23][13] = ' ';
  grid[23][14] = ' ';
  grid[23][12] = ' ';
  grid[23][15] = ' ';

  // 4. Procedurally Generate Organic Caribbean Islands & Atolls with Randomized Jitter
  // NW Sector Island
  const nwC = 4 + Math.floor(nextRand() * 3);
  const nwR = 4 + Math.floor(nextRand() * 4);
  const nwRadC = 2.2 + nextRand() * 1.2;
  const nwRadR = 1.8 + nextRand() * 1.0;
  placeOrganicIsland(grid, nwC, nwR, nwRadC, nwRadR, nextRand);

  // NE Sector Island
  const neC = GRID_COLS - 1 - (4 + Math.floor(nextRand() * 3));
  const neR = 4 + Math.floor(nextRand() * 4);
  const neRadC = 2.2 + nextRand() * 1.2;
  const neRadR = 1.8 + nextRand() * 1.0;
  placeOrganicIsland(grid, neC, neR, neRadC, neRadR, nextRand);

  // SW Sector Island
  const swC = 4 + Math.floor(nextRand() * 3);
  const swR = 21 + Math.floor(nextRand() * 4);
  const swRadC = 2.2 + nextRand() * 1.2;
  const swRadR = 1.8 + nextRand() * 1.0;
  placeOrganicIsland(grid, swC, swR, swRadC, swRadR, nextRand);

  // SE Sector Island
  const seC = GRID_COLS - 1 - (4 + Math.floor(nextRand() * 3));
  const seR = 21 + Math.floor(nextRand() * 4);
  const seRadC = 2.2 + nextRand() * 1.2;
  const seRadR = 1.8 + nextRand() * 1.0;
  placeOrganicIsland(grid, seC, seR, seRadC, seRadR, nextRand);

  // 2-3 Dynamic Central / Mid-Latitude Coral Reef Chains
  const reefCount = 2 + Math.floor(nextRand() * 2);
  for (let i = 0; i < reefCount; i++) {
    const isNorth = i === 0;
    const centerC = isNorth ? 8 + Math.floor(nextRand() * 12) : 8 + Math.floor(nextRand() * 12);
    const centerR = isNorth ? 6 + Math.floor(nextRand() * 3) : 26 + Math.floor(nextRand() * 3);
    if (centerR >= 13 && centerR <= 15) continue;
    placeOrganicIsland(grid, centerC, centerR, 1.8, 1.4, nextRand);
  }

  // 5. Procedurally Place Special Landmarks at Coastal Water Coves
  // Find valid water cells adjacent to an island wall
  const getCoveCandidates = (minR: number, maxR: number, minC: number, maxC: number): Point[] => {
    const list: Point[] = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (grid[r][c] !== ' ') continue;
        if (r === 23 && (c >= 12 && c <= 15)) continue; // Not at player start

        // Check if adjacent to at least one island wall and has open water neighbors
        const adjWalls = 
          (grid[r-1]?.[c] === '#' ? 1 : 0) +
          (grid[r+1]?.[c] === '#' ? 1 : 0) +
          (grid[r]?.[c-1] === '#' ? 1 : 0) +
          (grid[r]?.[c+1] === '#' ? 1 : 0);
        
        if (adjWalls >= 1 && adjWalls <= 2) {
          list.push({ c, r });
        }
      }
    }
    return list;
  };

  // Place Vaults (V) - High-visibility Pirate Island Bank Piers
  // Vault 1 in North-West / North sector
  const nwCandidates = getCoveCandidates(2, 10, 2, 12);
  const v1 = nwCandidates.length > 0 
    ? nwCandidates[Math.floor(nextRand() * nwCandidates.length)]
    : { c: 3, r: 7 };
  grid[v1.r][v1.c] = 'V';

  // Vault 2 in South-East / East sector
  const seCandidates = getCoveCandidates(19, 29, 15, GRID_COLS - 3);
  const v2 = seCandidates.length > 0 
    ? seCandidates[Math.floor(nextRand() * seCandidates.length)]
    : { c: 24, r: 25 };
  grid[v2.r][v2.c] = 'V';

  // Place Whirlpool Portals (W)
  const portalSpots = [
    { c: GRID_COLS - 4, r: 3 },
    { c: 3, r: GRID_ROWS - 4 },
    { c: 13, r: 3 },
  ];
  for (const p of portalSpots) {
    if (grid[p.r][p.c] === ' ') grid[p.r][p.c] = 'W';
  }

  // Place Ship Repair Stops (R / A)
  const repairSpots = [
    { c: 3, r: 20 },
    { c: GRID_COLS - 4, r: 20 },
    { c: 13, r: 8 },
  ];
  for (const d of repairSpots) {
    if (grid[d.r][d.c] === ' ' || grid[d.r][d.c] === '.') grid[d.r][d.c] = 'R';
  }

  // Place Math / Combat Power-Up Coves
  const powerSpots = [
    { c: 2, r: 2, type: 'G' }, // Royal Grog
    { c: GRID_COLS - 3, r: 2, type: 'G' },
    { c: 2, r: GRID_ROWS - 3, type: 'I' }, // Ghost Mist
    { c: GRID_COLS - 3, r: GRID_ROWS - 3, type: 'I' },
    { c: 2, r: 10, type: 'S' }, // Swift Wind
    { c: GRID_COLS - 3, r: 10, type: 'S' },
    { c: 13, r: 20, type: 'K' }, // Powder Keg
  ];
  for (const p of powerSpots) {
    if (grid[p.r][p.c] === ' ' || grid[p.r][p.c] === '.') {
      grid[p.r][p.c] = p.type;
    }
  }

  // 6. Distribute Coins according to Target Coin Count Setting
  // Collect all eligible open water cells
  const availableWaterCells: Point[] = [];
  for (let r = 1; r < GRID_ROWS - 1; r++) {
    for (let c = 1; c < GRID_COLS - 1; c++) {
      if (grid[r][c] === ' ') {
        // Exclude citadel fort interior and wrap tunnel center
        if (r >= 12 && r <= 16 && c >= 10 && c <= 17) continue;
        if (r === 14 && (c <= 4 || c >= GRID_COLS - 5)) continue;
        if (r === 23 && (c >= 12 && c <= 15)) continue; // Player starting dock
        availableWaterCells.push({ c, r });
      }
    }
  }

  // Shuffle available water cells
  for (let i = availableWaterCells.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    const temp = availableWaterCells[i];
    availableWaterCells[i] = availableWaterCells[j];
    availableWaterCells[j] = temp;
  }

  // Place exact target number of coins
  const numCoinsToPlace = Math.min(targetCoins, availableWaterCells.length);
  for (let i = 0; i < numCoinsToPlace; i++) {
    const pt = availableWaterCells[i];
    grid[pt.r][pt.c] = '.';
  }

  return grid.map(row => row.join(''));
}

/**
 * Places an organic, natural-looking island atoll with rounded curves and lagoon bays
 */
function placeOrganicIsland(
  grid: string[][],
  centerC: number,
  centerR: number,
  radiusC: number,
  radiusR: number,
  rand: () => number
) {
  for (let r = Math.floor(centerR - radiusR); r <= Math.ceil(centerR + radiusR); r++) {
    for (let c = Math.floor(centerC - radiusC); c <= Math.ceil(centerC + radiusC); c++) {
      if (r <= 1 || r >= GRID_ROWS - 2 || c <= 1 || c >= GRID_COLS - 2) continue;
      // Never encroach on wrap tunnel, fort, or player dock
      if (r >= 10 && r <= 18 && c >= 8 && c <= 19) continue;
      if (r === 14) continue;
      if (r >= 22 && r <= 24 && c >= 11 && c <= 16) continue;

      // Natural ellipse distance with organic roughness
      const dx = (c - centerC) / radiusC;
      const dy = (r - centerR) / radiusR;
      const dist = dx * dx + dy * dy + (rand() - 0.5) * 0.4;

      if (dist <= 0.95) {
        grid[r][c] = '#';
      }
    }
  }
}

/**
 * BFS Connectivity Validator & Auto-Carver:
 * Guarantees 100% path connectivity so every single doubloon, weapon cove,
 * treasure vault, whirlpool portal, and ammo haven is reachable from the player's start dock (13, 23).
 */
function ensureAllTilesAccessible(tiles: TileType[][]): void {
  const reachable: boolean[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));
  const queue: Point[] = [{ c: 13, r: 23 }];
  reachable[23][13] = true;

  const dirs = [
    { c: 0, r: 1 },
    { c: 0, r: -1 },
    { c: 1, r: 0 },
    { c: -1, r: 0 }
  ];

  while (queue.length > 0) {
    const { c, r } = queue.shift()!;
    for (const d of dirs) {
      let nc = c + d.c;
      let nr = r + d.r;

      // Handle wrap tunnel at row 14
      if (nr === 14) {
        if (nc < 0) nc = GRID_COLS - 1;
        else if (nc >= GRID_COLS) nc = 0;
      }

      if (nc >= 0 && nc < GRID_COLS && nr >= 0 && nr < GRID_ROWS) {
        if (!reachable[nr][nc] && tiles[nr][nc] !== 'WALL' && tiles[nr][nc] !== 'GATE') {
          reachable[nr][nc] = true;
          queue.push({ c: nc, r: nr });
        }
      }
    }
  }

  // If any COIN or Sanctuary is unreachable, carve an open water canal directly toward center
  for (let r = 1; r < GRID_ROWS - 1; r++) {
    for (let c = 1; c < GRID_COLS - 1; c++) {
      const tile = tiles[r][c];
      const isValuable = 
        tile === 'COIN' || 
        tile.startsWith('POWER') || 
        tile === 'TREASURE_VAULT' || 
        tile === 'PORTAL_WHIRLPOOL' || 
        tile === 'REPAIR_DOCK' ||
        tile === 'AMMO_DEPOT';

      if (isValuable && !reachable[r][c]) {
        let curR = r;
        let curC = c;
        while (!reachable[curR][curC] && curR > 1 && curR < GRID_ROWS - 2) {
          tiles[curR][curC] = 'EMPTY';
          reachable[curR][curC] = true;
          if (curC < 13) curC++;
          else if (curC > 14) curC--;
          else if (curR < 23) curR++;
          else curR--;
        }
      }
    }
  }
}

/**
 * Parses the procedurally generated layout into typed game tiles
 */
export function parseMaze(
  level: number = 1,
  seed: number = Math.floor(Math.random() * 1000000),
  targetCoins: number = 200
): {
  tiles: TileType[][];
  totalCoins: number;
  seed: number;
} {
  const layout = generateProceduralLayout(level, seed, targetCoins);
  const tiles: TileType[][] = [];
  let totalCoins = 0;

  for (let r = 0; r < GRID_ROWS; r++) {
    const rowStr = layout[r] || "";
    const rowTiles: TileType[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const ch = rowStr[c] || " ";
      switch (ch) {
        case "#":
          rowTiles.push("WALL");
          break;
        case ".":
          rowTiles.push("COIN");
          totalCoins++;
          break;
        case "G":
          rowTiles.push("POWER_GROG");
          break;
        case "I":
          rowTiles.push("POWER_INVISIBILITY");
          break;
        case "S":
          rowTiles.push("POWER_SPEED");
          break;
        case "K":
          rowTiles.push("POWER_KEG");
          break;
        case "V":
          rowTiles.push("TREASURE_VAULT");
          break;
        case "W":
          rowTiles.push("PORTAL_WHIRLPOOL");
          break;
        case "A":
        case "R":
          rowTiles.push("REPAIR_DOCK");
          break;
        case "-":
          rowTiles.push("GATE");
          break;
        default:
          rowTiles.push("EMPTY");
          break;
      }
    }
    tiles.push(rowTiles);
  }

  // Guarantee 100% path reachability across all waterways
  ensureAllTilesAccessible(tiles);

  // Recount coins accurately
  let finalCoins = 0;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (tiles[r][c] === 'COIN') finalCoins++;
    }
  }

  return { tiles, totalCoins: finalCoins, seed };
}

// Walkability check for Pirate (Walkable on water, ports, vaults, portals, coves)
export function isWalkablePirate(col: number, row: number, tiles: TileType[][]): boolean {
  if (row === 14 && (col < 0 || col >= GRID_COLS)) {
    return true;
  }
  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
    return false;
  }
  const tile = tiles[row][col];
  return tile !== 'WALL' && tile !== 'GATE';
}

// Walkability check for Guards
export function isWalkableGuard(col: number, row: number, tiles: TileType[][], canPassGate: boolean = false): boolean {
  if (row === 14 && (col < 0 || col >= GRID_COLS)) {
    return true;
  }
  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
    return false;
  }
  const tile = tiles[row][col];
  if (tile === 'WALL') return false;
  if (tile === 'GATE') return canPassGate;
  return true;
}
