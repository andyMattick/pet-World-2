import { Cell, Direction, LevelConfig, Position } from '../types/game';

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Sector Alpha',
    codename: 'The Perimeter',
    width: 7,
    height: 9,
    mineCount: 7,
    initialArmor: 1,
    initialEmp: 1,
    initialJumps: 2,
    initialSonar: 1,
    initialDrones: 1,
    cratesCount: 2,
    hasWatchtower: true,
    watchtowerCount: 1,
    parTime: 35,
    description: 'Basic forward reconnaissance. Scale the Recon Watchtower to uncover the sector, and flag mines to defuse them!'
  },
  {
    id: 2,
    title: 'Sector Bravo',
    codename: 'Dust Devil',
    width: 8,
    height: 11,
    mineCount: 13,
    initialArmor: 1,
    initialEmp: 2,
    initialJumps: 2,
    initialSonar: 1,
    initialDrones: 1,
    cratesCount: 2,
    hasWatchtower: true,
    watchtowerCount: 1,
    parTime: 45,
    description: 'Arid scrubland with clustered charges. High ground watchtowers survey hidden minefields.'
  },
  {
    id: 3,
    title: 'Sector Charlie',
    codename: 'Marshland Trench',
    width: 9,
    height: 13,
    mineCount: 19,
    initialArmor: 1,
    initialEmp: 2,
    initialJumps: 3,
    initialSonar: 2,
    initialDrones: 1,
    cratesCount: 3,
    hasMud: true,
    hasWatchtower: true,
    watchtowerCount: 1,
    parTime: 55,
    description: 'Muddy terrain! Mud patches cost 2 moves to cross. Secure the watchtower to reveal paths around the mire.'
  },
  {
    id: 4,
    title: 'Sector Delta',
    codename: 'Scorched Plain',
    width: 10,
    height: 15,
    mineCount: 27,
    initialArmor: 2,
    initialEmp: 2,
    initialJumps: 3,
    initialSonar: 2,
    initialDrones: 2,
    cratesCount: 3,
    hasMud: true,
    hasWatchtower: true,
    watchtowerCount: 1,
    parTime: 65,
    description: 'High-density blast zone. Collect supply boxes for armor & EMP, and conquer the outpost tower.'
  },
  {
    id: 5,
    title: 'Sector Echo',
    codename: 'Iron Bastion',
    width: 11,
    height: 17,
    mineCount: 35,
    initialArmor: 2,
    initialEmp: 3,
    initialJumps: 4,
    initialSonar: 3,
    initialDrones: 2,
    hasPatrolDrone: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 2,
    cratesCount: 4,
    parTime: 80,
    description: 'Electrified security perimeter! Electric fences damage armor if walked into—vault over with Rocket Jump.'
  },
  {
    id: 6,
    title: 'Sector Foxtrot',
    codename: 'Redoubt Zero',
    width: 12,
    height: 19,
    mineCount: 46,
    initialArmor: 2,
    initialEmp: 3,
    initialJumps: 4,
    initialSonar: 3,
    initialDrones: 3,
    hasPatrolDrone: true,
    hasMud: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 2,
    cratesCount: 4,
    parTime: 95,
    description: 'Deep fortification with mud patches, electric fences, and twin reconnaissance towers.'
  },
  {
    id: 7,
    title: 'Sector Golf',
    codename: 'Thunder Ridge',
    width: 13,
    height: 21,
    mineCount: 58,
    initialArmor: 2,
    initialEmp: 4,
    initialJumps: 5,
    initialSonar: 4,
    initialDrones: 3,
    hasMud: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 2,
    cratesCount: 5,
    parTime: 110,
    description: 'Extensive defense line with heavy environmental hazards. Keep your blast armor primed.'
  },
  {
    id: 8,
    title: 'Sector Hotel',
    codename: 'The Gauntlet',
    width: 14,
    height: 23,
    mineCount: 72,
    initialArmor: 3,
    initialEmp: 4,
    initialJumps: 5,
    initialSonar: 4,
    initialDrones: 4,
    hasPatrolDrone: true,
    hasMud: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 2,
    cratesCount: 5,
    parTime: 125,
    description: 'Near-impenetrable mine lattice. Defuse mines with flags to clear safe paths.'
  },
  {
    id: 9,
    title: 'Sector India',
    codename: 'Omega Perimeter',
    width: 15,
    height: 25,
    mineCount: 88,
    initialArmor: 3,
    initialEmp: 5,
    initialJumps: 6,
    initialSonar: 5,
    initialDrones: 4,
    hasMud: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 2,
    cratesCount: 6,
    parTime: 140,
    description: 'Heavy strategic mine belt with electrified barriers. Air crates and watchtowers are vital for survival.'
  },
  {
    id: 10,
    title: 'Sector Juliet',
    codename: 'Extraction Zero',
    width: 16,
    height: 28,
    mineCount: 110,
    initialArmor: 3,
    initialEmp: 5,
    initialJumps: 6,
    initialSonar: 5,
    initialDrones: 5,
    hasPatrolDrone: true,
    hasMud: true,
    hasElectricFence: true,
    hasWatchtower: true,
    watchtowerCount: 3,
    cratesCount: 6,
    parTime: 160,
    description: 'The final crossing. Maximum field depth, mud traps, fences, and deadly explosive density.'
  }
];

// Helper to check valid coordinate
export function isValid(x: number, y: number, width: number, height: number): boolean {
  return x >= 0 && x < width && y >= 0 && y < height;
}

// 8 neighbor offsets
export const NEIGHBOR_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1]
];

// Calculate neighbor mines for a grid. DEFUSED or DISARMED mines do NOT count!
export function recalculateAllNeighbors(grid: Cell[][], width: number, height: number) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let count = 0;
      for (const [dx, dy] of NEIGHBOR_OFFSETS) {
        const nx = x + dx;
        const ny = y + dy;
        if (isValid(nx, ny, width, height)) {
          const neighbor = grid[ny][nx];
          // If a mine is DEFUSED via flag or disarmed via ability, it no longer threatens neighbors!
          if (neighbor.isMine && !neighbor.isDefused && neighbor.state !== 'disarmed') {
            count++;
          }
        }
      }
      grid[y][x].neighborMines = count;
    }
  }
}

// Generate new level grid with guaranteed safe path and dynamic hazards
export function generateMinefield(config: LevelConfig, startPos: Position): Cell[][] {
  const { width, height, mineCount, cratesCount, hasMud, hasElectricFence } = config;

  // Initialize empty grid
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        isMine: false,
        isDefused: false,
        state: 'hidden',
        neighborMines: 0
      });
    }
    grid.push(row);
  }

  // Ensure bottom start line (y = height - 1) and top extraction line (y = 0) are safe
  const reservedSafe = new Set<string>();
  for (let x = 0; x < width; x++) {
    reservedSafe.add(`${x},0`);
    reservedSafe.add(`${x},${height - 1}`);
  }

  // Start position and immediate 8 neighbors are always guaranteed safe for comfortable start
  for (const [dx, dy] of [[0, 0], ...NEIGHBOR_OFFSETS]) {
    const sx = startPos.x + dx;
    const sy = startPos.y + dy;
    if (isValid(sx, sy, width, height)) {
      reservedSafe.add(`${sx},${sy}`);
    }
  }

  // Carve at least one winding safe path from start to top to guarantee solvability
  let currX = startPos.x;
  let currY = startPos.y - 1;
  reservedSafe.add(`${currX},${currY}`);

  while (currY > 1) {
    const choices: [number, number][] = [[0, -1]];
    if (currX > 0) choices.push([-1, -1], [-1, 0]);
    if (currX < width - 1) choices.push([1, -1], [1, 0]);

    const choice = choices[Math.floor(Math.random() * choices.length)];
    const nextX = Math.max(0, Math.min(width - 1, currX + choice[0]));
    const nextY = Math.max(1, currY + choice[1]);

    currX = nextX;
    currY = nextY;
    reservedSafe.add(`${currX},${currY}`);
  }

  // Eligible mine candidates
  const candidates: [number, number][] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 0; x < width; x++) {
      if (!reservedSafe.has(`${x},${y}`)) {
        candidates.push([x, y]);
      }
    }
  }

  // Shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Plant mines
  const actualMineCount = Math.min(mineCount, candidates.length);
  for (let i = 0; i < actualMineCount; i++) {
    const [mx, my] = candidates[i];
    grid[my][mx].isMine = true;
  }

  // Distribute Environmental Hazards: Mud & Electric Fences
  if (hasMud) {
    for (let y = 2; y < height - 2; y++) {
      for (let x = 0; x < width; x++) {
        if (!grid[y][x].isMine && Math.random() < 0.09) {
          grid[y][x].hazard = 'mud';
        }
      }
    }
  }

  if (hasElectricFence) {
    const numFences = Math.max(2, Math.floor(height / 4));
    let placedFences = 0;
    for (let y = 3; y < height - 3 && placedFences < numFences; y += 2) {
      const fenceX = Math.floor(Math.random() * (width - 2)) + 1;
      // Do not block reserved safe path completely
      if (!reservedSafe.has(`${fenceX},${y}`) && !grid[y][fenceX].isMine) {
        grid[y][fenceX].hazard = 'electric_fence';
        placedFences++;
      }
    }
  }

  // Distribute Recon Watchtowers on safe non-mine cells
  if (config.hasWatchtower || (config.watchtowerCount ?? 0) > 0) {
    const numTowers = config.watchtowerCount ?? 1;
    const towerCandidates: [number, number][] = [];
    for (let y = 2; y < height - 2; y++) {
      for (let x = 0; x < width; x++) {
        if (!grid[y][x].isMine && !grid[y][x].hazard) {
          towerCandidates.push([x, y]);
        }
      }
    }
    for (let i = towerCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [towerCandidates[i], towerCandidates[j]] = [towerCandidates[j], towerCandidates[i]];
    }
    const placedTowers = Math.min(numTowers, towerCandidates.length);
    for (let i = 0; i < placedTowers; i++) {
      const [tx, ty] = towerCandidates[i];
      grid[ty][tx].hasWatchtower = true;
      grid[ty][tx].isWatchtowerActivated = false;
    }
  }

  // Recalculate numbers
  recalculateAllNeighbors(grid, width, height);

  // Distribute tactical supply crates on safe non-mine cells (excluding watchtower cells)
  const safeCrateCandidates: [number, number][] = [];
  for (let y = 2; y < height - 2; y++) {
    for (let x = 0; x < width; x++) {
      if (!grid[y][x].isMine && !grid[y][x].hazard && !grid[y][x].hasWatchtower) {
        safeCrateCandidates.push([x, y]);
      }
    }
  }

  for (let i = safeCrateCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [safeCrateCandidates[i], safeCrateCandidates[j]] = [safeCrateCandidates[j], safeCrateCandidates[i]];
  }

  const crateTypes: ('emp' | 'sonar' | 'armor' | 'intel')[] = ['emp', 'sonar', 'armor', 'intel'];
  const numCrates = Math.min(cratesCount, safeCrateCandidates.length);
  for (let i = 0; i < numCrates; i++) {
    const [cx, cy] = safeCrateCandidates[i];
    grid[cy][cx].hasCrate = crateTypes[i % crateTypes.length];
  }

  // Pre-reveal start position and entire start row deployment trench
  for (let x = 0; x < width; x++) {
    grid[height - 1][x].state = 'revealed';
  }

  // Also flood fill start position if 0
  if (grid[startPos.y][startPos.x].neighborMines === 0) {
    floodFillReveal(grid, startPos.x, startPos.y, width, height);
  }

  return grid;
}

// Classic Minesweeper flood fill when clicking/stepping on a 0
export function floodFillReveal(
  grid: Cell[][],
  startX: number,
  startY: number,
  width: number,
  height: number
): number {
  let revealedCount = 0;
  const queue: [number, number][] = [[startX, startY]];
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    const cell = grid[cy][cx];

    if (cell.state !== 'flagged') {
      if (cell.state !== 'revealed') {
        cell.state = 'revealed';
        revealedCount++;
      }

      if (cell.neighborMines === 0 && !cell.isMine) {
        for (const [dx, dy] of NEIGHBOR_OFFSETS) {
          const nx = cx + dx;
          const ny = cy + dy;
          const key = `${nx},${ny}`;
          if (isValid(nx, ny, width, height) && !visited.has(key)) {
            visited.add(key);
            const neighbor = grid[ny][nx];
            if (!neighbor.isMine && neighbor.state !== 'flagged') {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
  }

  return revealedCount;
}

// Chording: if flagged neighbors match neighbor count, reveal other neighbors
export function chordReveal(
  grid: Cell[][],
  x: number,
  y: number,
  width: number,
  height: number
): { cellsRevealed: number; hitMine: boolean; minePos?: Position } {
  const cell = grid[y][x];
  if (cell.state !== 'revealed' || cell.neighborMines === 0) {
    return { cellsRevealed: 0, hitMine: false };
  }

  let flaggedCount = 0;
  const hiddenNeighbors: [number, number][] = [];

  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    const nx = x + dx;
    const ny = y + dy;
    if (isValid(nx, ny, width, height)) {
      const neighbor = grid[ny][nx];
      if (neighbor.state === 'flagged') {
        flaggedCount++;
      } else if (neighbor.state === 'hidden') {
        hiddenNeighbors.push([nx, ny]);
      }
    }
  }

  if (flaggedCount !== cell.neighborMines || hiddenNeighbors.length === 0) {
    return { cellsRevealed: 0, hitMine: false };
  }

  let totalRevealed = 0;
  for (const [hx, hy] of hiddenNeighbors) {
    const target = grid[hy][hx];
    if (target.isMine) {
      target.state = 'exploded';
      return { cellsRevealed: totalRevealed, hitMine: true, minePos: { x: hx, y: hy } };
    } else {
      if (target.neighborMines === 0) {
        totalRevealed += floodFillReveal(grid, hx, hy, width, height);
      } else {
        target.state = 'revealed';
        totalRevealed++;
      }
    }
  }

  return { cellsRevealed: totalRevealed, hitMine: false };
}

// EMP Blast in 3x3 radius
export function applyEmpBlast(
  grid: Cell[][],
  centerX: number,
  centerY: number,
  width: number,
  height: number
): { disarmedMines: number; affectedCells: Position[] } {
  let disarmedMines = 0;
  const affectedCells: Position[] = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const tx = centerX + dx;
      const ty = centerY + dy;
      if (isValid(tx, ty, width, height)) {
        affectedCells.push({ x: tx, y: ty });
        const cell = grid[ty][tx];
        if (cell.isMine) {
          cell.isMine = false;
          cell.state = 'disarmed';
          disarmedMines++;
        } else if (cell.state === 'hidden') {
          cell.state = 'revealed';
        }
      }
    }
  }

  // Recalculate neighbors after mines are disarmed
  recalculateAllNeighbors(grid, width, height);

  // If center or affected cells have 0 mines now, ripple reveal them
  for (const pos of affectedCells) {
    if (grid[pos.y][pos.x].neighborMines === 0 && !grid[pos.y][pos.x].isMine) {
      floodFillReveal(grid, pos.x, pos.y, width, height);
    }
  }

  return { disarmedMines, affectedCells };
}

// Sonar scan in radius (defaults to 2, which is 5x5)
export function applySonarScan(
  grid: Cell[][],
  centerX: number,
  centerY: number,
  radius: number,
  width: number,
  height: number
): { minesDetected: number; scannedCells: Position[] } {
  let minesDetected = 0;
  const scannedCells: Position[] = [];

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tx = centerX + dx;
      const ty = centerY + dy;
      if (isValid(tx, ty, width, height)) {
        scannedCells.push({ x: tx, y: ty });
        const cell = grid[ty][tx];
        cell.isScanned = true;
        if (cell.isMine) {
          minesDetected++;
        }
      }
    }
  }

  return { minesDetected, scannedCells };
}

// Single Drone defusal
export function applyDroneDefusal(
  grid: Cell[][],
  tx: number,
  ty: number,
  width: number,
  height: number
): { wasMine: boolean } {
  if (!isValid(tx, ty, width, height)) return { wasMine: false };

  const cell = grid[ty][tx];
  const wasMine = cell.isMine;

  if (cell.isMine) {
    cell.isMine = false;
    cell.state = 'disarmed';
    recalculateAllNeighbors(grid, width, height);
  } else {
    cell.state = 'revealed';
    if (cell.neighborMines === 0) {
      floodFillReveal(grid, tx, ty, width, height);
    }
  }

  return { wasMine };
}

// Get direction between two positions
export function getFacingDirection(from: Position, to: Position): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dy < 0 && dx === 0) return 'N';
  if (dy > 0 && dx === 0) return 'S';
  if (dx > 0 && dy === 0) return 'E';
  if (dx < 0 && dy === 0) return 'W';
  if (dy < 0 && dx > 0) return 'NE';
  if (dy < 0 && dx < 0) return 'NW';
  if (dy > 0 && dx > 0) return 'SE';
  return 'SW';
}

// Proximity danger calculation: returns danger score (0 - 1) based on nearest hidden mines
export function calculateProximityDanger(pos: Position, grid: Cell[][], width: number, height: number): number {
  let minDistance = 999;
  let countNearby = 0;

  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const tx = pos.x + dx;
      const ty = pos.y + dy;
      if (isValid(tx, ty, width, height)) {
        const cell = grid[ty][tx];
        // Only active non-defused mines trigger the geiger proximity
        if (cell.isMine && !cell.isDefused && cell.state !== 'disarmed') {
          const dist = Math.hypot(dx, dy);
          if (dist < minDistance) minDistance = dist;
          countNearby++;
        }
      }
    }
  }

  if (minDistance > 2.5) return 0;
  // Danger ranges from 0.1 (dist ~ 2.5) to 1.0 (dist 1.0)
  const distFactor = Math.max(0, (3 - minDistance) / 2);
  const countFactor = Math.min(1, countNearby / 4);
  return Math.min(1, distFactor * 0.7 + countFactor * 0.3);
}

// Endless Mode: Prepend fresh rows to the top of the grid
export function prependEndlessRows(
  existingGrid: Cell[][],
  numNewRows: number,
  width: number,
  mineDensity: number = 0.18
): { newGrid: Cell[][]; addedRowsCount: number } {
  const currentHeight = existingGrid.length;

  // Shift existing rows y by numNewRows
  for (let y = 0; y < currentHeight; y++) {
    for (let x = 0; x < width; x++) {
      existingGrid[y][x].y += numNewRows;
    }
  }

  // Create new top rows
  const newTopRows: Cell[][] = [];
  for (let y = 0; y < numNewRows; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      const isMine = Math.random() < mineDensity;
      const hazard = !isMine && Math.random() < 0.08 ? 'mud' : undefined;
      row.push({
        x,
        y,
        isMine,
        isDefused: false,
        state: 'hidden',
        neighborMines: 0,
        hazard
      });
    }
    newTopRows.push(row);
  }

  // Add occasional crate in new rows
  const crateX = Math.floor(Math.random() * width);
  const crateY = Math.floor(Math.random() * numNewRows);
  if (!newTopRows[crateY][crateX].isMine) {
    const crateTypes: ('emp' | 'sonar' | 'armor' | 'intel')[] = ['emp', 'sonar', 'armor', 'intel'];
    newTopRows[crateY][crateX].hasCrate = crateTypes[Math.floor(Math.random() * crateTypes.length)];
  }

  // Occasional electric fence
  if (Math.random() < 0.5) {
    const fenceX = Math.floor(Math.random() * (width - 2)) + 1;
    const fenceY = Math.floor(Math.random() * numNewRows);
    if (!newTopRows[fenceY][fenceX].isMine) {
      newTopRows[fenceY][fenceX].hazard = 'electric_fence';
    }
  }

  // Occasional Recon Watchtower in endless mode
  if (Math.random() < 0.35) {
    const towerX = Math.floor(Math.random() * width);
    const towerY = Math.floor(Math.random() * numNewRows);
    const targetCell = newTopRows[towerY][towerX];
    if (!targetCell.isMine && !targetCell.hazard && !targetCell.hasCrate) {
      targetCell.hasWatchtower = true;
      targetCell.isWatchtowerActivated = false;
    }
  }

  const combinedGrid = [...newTopRows, ...existingGrid];
  const newTotalHeight = combinedGrid.length;

  // Recalculate numbers
  recalculateAllNeighbors(combinedGrid, width, newTotalHeight);

  return { newGrid: combinedGrid, addedRowsCount: numNewRows };
}

// Activate Recon Watchtower: High vantage point sweeps fog of war & scans mines in wide radius
export function activateWatchtower(
  grid: Cell[][],
  towerX: number,
  towerY: number,
  width: number,
  height: number,
  revealRadius: number = 3.8
): { revealedSafeCount: number; scannedMinesCount: number } {
  let revealedSafeCount = 0;
  let scannedMinesCount = 0;

  if (!isValid(towerX, towerY, width, height)) {
    return { revealedSafeCount, scannedMinesCount };
  }

  const tower = grid[towerY][towerX];
  tower.isWatchtowerActivated = true;

  const newlyRevealedZeros: [number, number][] = [];

  for (let dy = -Math.ceil(revealRadius); dy <= Math.ceil(revealRadius); dy++) {
    for (let dx = -Math.ceil(revealRadius); dx <= Math.ceil(revealRadius); dx++) {
      const nx = towerX + dx;
      const ny = towerY + dy;
      if (isValid(nx, ny, width, height)) {
        const dist = Math.hypot(dx, dy);
        if (dist <= revealRadius) {
          const target = grid[ny][nx];
          if (target.isMine && !target.isDefused) {
            target.isScanned = true;
            scannedMinesCount++;
          } else if (!target.isMine) {
            if (target.state !== 'flagged' && target.state !== 'revealed') {
              target.state = 'revealed';
              revealedSafeCount++;
              if (target.neighborMines === 0) {
                newlyRevealedZeros.push([nx, ny]);
              }
            }
          }
        }
      }
    }
  }

  // Cascade zeros
  for (const [zx, zy] of newlyRevealedZeros) {
    revealedSafeCount += floodFillReveal(grid, zx, zy, width, height);
  }

  return { revealedSafeCount, scannedMinesCount };
}

