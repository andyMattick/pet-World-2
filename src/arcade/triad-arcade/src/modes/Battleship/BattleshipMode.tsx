import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavalShip, ShipType, TacticalAbility, BattleshipCell } from '../../types';
import { sounds } from '../../utils/audio';
import {
  Anchor,
  Crosshair,
  Radio,
  Zap,
  RotateCcw,
  Shield,
  Bomb,
  Plane,
  Eye,
  Trophy,
  Dices,
  RotateCw,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
} from 'lucide-react';

interface BattleshipModeProps {
  onCompleteGame: (score: number, metrics: { turns: number; accuracy: number; shipsLost: number; winner: 'PLAYER' | 'COMPUTER' }) => void;
  playerName: string;
}

const GRID_SIZE = 10;
const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COL_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const FLEET_DEFINITIONS: { type: ShipType; name: string; size: number; color: string; icon: string }[] = [
  { type: 'CARRIER', name: 'Aircraft Carrier', size: 5, color: 'from-blue-600 to-indigo-700', icon: '🛳️' },
  { type: 'BATTLESHIP', name: 'Battleship', size: 4, color: 'from-amber-600 to-red-700', icon: '⚓' },
  { type: 'CRUISER', name: 'Cruiser', size: 3, color: 'from-emerald-600 to-teal-700', icon: '🚢' },
  { type: 'SUBMARINE', name: 'Submarine', size: 3, color: 'from-cyan-600 to-blue-800', icon: '🐬' },
  { type: 'DESTROYER', name: 'Destroyer', size: 2, color: 'from-purple-600 to-violet-800', icon: '🚤' },
];

function createEmptyGrid(): BattleshipCell[][] {
  const grid: BattleshipCell[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: BattleshipCell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push({
        row: r,
        col: c,
        status: 'WATER',
      });
    }
    grid.push(row);
  }
  return grid;
}

function generateRandomFleet(): { ships: NavalShip[]; grid: BattleshipCell[][] } {
  const grid = createEmptyGrid();
  const ships: NavalShip[] = [];

  for (const def of FLEET_DEFINITIONS) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts++;
      const isHorizontal = Math.random() > 0.5;
      const r = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE : GRID_SIZE - def.size + 1));
      const c = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE - def.size + 1 : GRID_SIZE));

      // Check if space is free (with 1-tile buffer)
      let fits = true;
      const coords: { row: number; col: number }[] = [];

      for (let i = 0; i < def.size; i++) {
        const currR = isHorizontal ? r : r + i;
        const currC = isHorizontal ? c + i : c;

        if (grid[currR][currC].hasShip) {
          fits = false;
          break;
        }
        coords.push({ row: currR, col: currC });
      }

      if (fits) {
        const shipId = `ship-${def.type}-${Date.now()}-${Math.random()}`;
        coords.forEach(({ row, col }) => {
          grid[row][col].hasShip = true;
          grid[row][col].shipType = def.type;
          grid[row][col].shipId = shipId;
        });

        ships.push({
          id: shipId,
          name: def.name,
          type: def.type,
          size: def.size,
          coordinates: coords,
          hits: 0,
          isSunk: false,
          color: def.color,
        });
        placed = true;
      }
    }
  }

  return { ships, grid };
}

export const BattleshipMode: React.FC<BattleshipModeProps> = ({ onCompleteGame, playerName }) => {
  // Phase: DEPLOYMENT vs COMBAT vs GAMEOVER
  const [phase, setPhase] = useState<'DEPLOYMENT' | 'COMBAT' | 'GAMEOVER'>('DEPLOYMENT');

  // Player Fleet
  const [playerGrid, setPlayerGrid] = useState<BattleshipCell[][]>(() => createEmptyGrid());
  const [playerShips, setPlayerShips] = useState<NavalShip[]>([]);
  const [selectedDeployShip, setSelectedDeployShip] = useState<ShipType>('CARRIER');
  const [deployHorizontal, setDeployHorizontal] = useState<boolean>(true);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  // Keydown listener for 'R' to rotate ships anytime
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'DEPLOYMENT' && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        sounds.playClick();
        setDeployHorizontal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Enemy (AI) Fleet
  const [enemyGrid, setEnemyGrid] = useState<BattleshipCell[][]>(() => createEmptyGrid());
  const [enemyShips, setEnemyShips] = useState<NavalShip[]>([]);

  // The Twist: Tactical Command Energy & Abilities
  const [playerEnergy, setPlayerEnergy] = useState<number>(30);
  const [enemyEnergy, setEnemyEnergy] = useState<number>(20);
  const [selectedAbility, setSelectedAbility] = useState<TacticalAbility>('ARTILLERY');
  const [smokeScreenRounds, setSmokeScreenRounds] = useState<number>(0);
  const [smokedCells, setSmokedCells] = useState<{ row: number; col: number }[]>([]);

  // Turn management & Salvo streak
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [salvoBonusActive, setSalvoBonusActive] = useState<boolean>(false);
  const [sonarResult, setSonarResult] = useState<{ sector: string; count: number } | null>(null);

  // Stats & Comms Log
  const [turnCount, setTurnCount] = useState<number>(0);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [commsLog, setCommsLog] = useState<string[]>([
    'Armada Command: Welcome Admiral. Deploy your battle group or use Auto-Deploy to begin.',
  ]);
  const [winner, setWinner] = useState<'PLAYER' | 'COMPUTER' | null>(null);

  // AI memory state for intelligent hunting
  const aiHuntQueue = useRef<{ row: number; col: number }[]>([]);
  const aiHitStack = useRef<{ row: number; col: number }[]>([]);

  const addComms = (msg: string) => {
    setCommsLog((prev) => [msg, ...prev.slice(0, 9)]);
  };

  // Auto-Deploy Player fleet
  const handleAutoDeployPlayer = () => {
    sounds.playClick();
    const { ships, grid } = generateRandomFleet();
    setPlayerShips(ships);
    setPlayerGrid(grid);
    addComms('Command: Tactical fleet auto-deployed across battle sectors.');
  };

  // Clear Player Fleet
  const handleClearPlayerFleet = () => {
    sounds.playClick();
    setPlayerGrid(createEmptyGrid());
    setPlayerShips([]);
    addComms('Command: Fleet formation cleared. Ready for redeployment.');
  };

  // Manual deployment of single ship
  const handleDeployCellClick = (r: number, c: number) => {
    if (phase !== 'DEPLOYMENT') return;

    const shipDef = FLEET_DEFINITIONS.find((s) => s.type === selectedDeployShip);
    if (!shipDef) return;

    // Check boundary
    if (deployHorizontal && c + shipDef.size > GRID_SIZE) {
      sounds.playMismatch();
      return;
    }
    if (!deployHorizontal && r + shipDef.size > GRID_SIZE) {
      sounds.playMismatch();
      return;
    }

    // Check collision with other ships (excluding currently placing ship)
    const existingOtherShips = playerShips.filter((s) => s.type !== selectedDeployShip);
    const newCoords: { row: number; col: number }[] = [];

    for (let i = 0; i < shipDef.size; i++) {
      const targetR = deployHorizontal ? r : r + i;
      const targetC = deployHorizontal ? c + i : c;

      const collides = existingOtherShips.some((s) =>
        s.coordinates.some((coord) => coord.row === targetR && coord.col === targetC)
      );
      if (collides) {
        sounds.playMismatch();
        return;
      }
      newCoords.push({ row: targetR, col: targetC });
    }

    sounds.playDaub();

    const newShip: NavalShip = {
      id: `ship-${shipDef.type}-${Date.now()}`,
      name: shipDef.name,
      type: shipDef.type,
      size: shipDef.size,
      coordinates: newCoords,
      hits: 0,
      isSunk: false,
      color: shipDef.color,
    };

    const updatedShips = [...existingOtherShips, newShip];
    setPlayerShips(updatedShips);

    // Rebuild grid
    const freshGrid = createEmptyGrid();
    updatedShips.forEach((ship) => {
      ship.coordinates.forEach(({ row, col }) => {
        freshGrid[row][col].hasShip = true;
        freshGrid[row][col].shipType = ship.type;
        freshGrid[row][col].shipId = ship.id;
      });
    });
    setPlayerGrid(freshGrid);

    // Automatically cycle to next undeployed ship
    const remainingTypes = FLEET_DEFINITIONS.filter(
      (def) => !updatedShips.some((s) => s.type === def.type)
    );
    if (remainingTypes.length > 0) {
      setSelectedDeployShip(remainingTypes[0].type);
    }
  };

  // Lock in fleet and begin active naval war
  const handleLockInFleet = () => {
    if (playerShips.length < 5) {
      sounds.playMismatch();
      addComms('Alert: All 5 capital warships must be deployed before engaging!');
      return;
    }

    sounds.playVictoryFanfare();
    sounds.playSiren();

    // Generate Enemy Fleet
    const { ships: eShips, grid: eGrid } = generateRandomFleet();
    setEnemyShips(eShips);
    setEnemyGrid(eGrid);

    setPhase('COMBAT');
    setIsPlayerTurn(true);
    setPlayerEnergy(40);
    setEnemyEnergy(25);
    setTurnCount(1);
    setShotsFired(0);
    setShotsHit(0);
    setCommsLog([
      '🚨 COMBAT STATIONS! Admiral Vane has entered the sector. Radar engaged.',
      'Tactical Note: Scoring direct hits reloads your battery for an immediate BONUS SALVO!',
    ]);
  };

  // Restart match
  const handleRestart = () => {
    sounds.playClick();
    setPhase('DEPLOYMENT');
    setPlayerGrid(createEmptyGrid());
    setPlayerShips([]);
    setEnemyGrid(createEmptyGrid());
    setEnemyShips([]);
    setPlayerEnergy(30);
    setEnemyEnergy(20);
    setSelectedAbility('ARTILLERY');
    setIsPlayerTurn(true);
    setSalvoBonusActive(false);
    setSonarResult(null);
    setTurnCount(0);
    setShotsFired(0);
    setShotsHit(0);
    setWinner(null);
    setSmokedCells([]);
    setSmokeScreenRounds(0);
    aiHuntQueue.current = [];
    aiHitStack.current = [];
    handleAutoDeployPlayer();
  };

  // Auto deploy initial fleet on mount
  useEffect(() => {
    const { ships, grid } = generateRandomFleet();
    setPlayerShips(ships);
    setPlayerGrid(grid);
  }, []);

  // Check if player won
  const checkVictory = (ships: NavalShip[], isPlayer: boolean) => {
    const allSunk = ships.every((s) => s.isSunk);
    if (allSunk) {
      setPhase('GAMEOVER');
      const win = isPlayer ? 'PLAYER' : 'COMPUTER';
      setWinner(win);

      if (win === 'PLAYER') {
        sounds.playVictoryFanfare();
        const acc = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 50;
        const shipsLost = playerShips.filter((s) => s.isSunk).length;
        const finalScore = Math.max(1000, 10000 - turnCount * 250 + acc * 50 - shipsLost * 500);

        addComms(`🏆 ADMIRAL VICTORY! Enemy armada decimated! Score: ${finalScore} pts.`);
        onCompleteGame(finalScore, {
          turns: turnCount,
          accuracy: acc,
          shipsLost,
          winner: 'PLAYER',
        });
      } else {
        sounds.playSiren();
        sounds.playMismatch();
        addComms('💀 DEFEAT: Our fleet was sunk by Admiral Vane. Ready the reserve ships.');
        onCompleteGame(500, {
          turns: turnCount,
          accuracy: 30,
          shipsLost: 5,
          winner: 'COMPUTER',
        });
      }
      return true;
    }
    return false;
  };

  // Execute Strike on Enemy Waters
  const handlePlayerGridClick = (r: number, c: number) => {
    if (phase !== 'COMBAT' || !isPlayerTurn) return;

    const cell = enemyGrid[r][c];

    // Ability: SONAR PULSE (Cost: 35)
    if (selectedAbility === 'SONAR') {
      if (playerEnergy < 35) {
        sounds.playMismatch();
        addComms('Insufficient Command Energy for Sonar Pulse (Requires 35)!');
        return;
      }

      sounds.playSonarPing();
      setPlayerEnergy((prev) => Math.max(0, prev - 35));

      // Scan 3x3 sector
      let detectedCount = 0;
      const scannedGrid = enemyGrid.map((row) => [...row]);

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const scanR = r + dr;
          const scanC = c + dc;
          if (scanR >= 0 && scanR < GRID_SIZE && scanC >= 0 && scanC < GRID_SIZE) {
            scannedGrid[scanR][scanC].isScanned = true;
            if (scannedGrid[scanR][scanC].hasShip) {
              detectedCount++;
            }
          }
        }
      }
      setEnemyGrid(scannedGrid);

      const sectorName = `${ROW_LABELS[Math.max(0, r - 1)]}${c + 1}-${ROW_LABELS[Math.min(GRID_SIZE - 1, r + 1)]}${c + 1}`;
      setSonarResult({ sector: sectorName, count: detectedCount });
      addComms(`📡 Sonar Echo: Detected ${detectedCount} vessel hull sections in Sector ${sectorName}!`);
      setSelectedAbility('ARTILLERY');
      return;
    }

    // Ability: DEFENSIVE SMOKE SCREEN (Cost: 40)
    if (selectedAbility === 'SMOKE_SCREEN') {
      if (playerEnergy < 40) {
        sounds.playMismatch();
        addComms('Insufficient Command Energy for Smoke Screen (Requires 40)!');
        return;
      }
      sounds.playSplash();
      setPlayerEnergy((prev) => Math.max(0, prev - 40));
      setSmokeScreenRounds(3);

      const smoked: { row: number; col: number }[] = [];
      const updatedPGrid = playerGrid.map((row, rowIdx) =>
        row.map((cellItem, colIdx) => {
          if (rowIdx >= r - 1 && rowIdx <= r && colIdx >= c - 1 && colIdx <= c) {
            smoked.push({ row: rowIdx, col: colIdx });
            return { ...cellItem, isSmoked: true };
          }
          return cellItem;
        })
      );
      setSmokedCells(smoked);
      setPlayerGrid(updatedPGrid);
      addComms(`🛡️ Smoke Screen Deployed around coordinate ${ROW_LABELS[r]}${c + 1}! Enemy strikes will be deflected for 3 turns.`);
      setSelectedAbility('ARTILLERY');
      return;
    }

    // Prevent clicking already struck cell
    if (cell.status !== 'WATER') {
      sounds.playMismatch();
      return;
    }

    // Ability: AIRSTRIKE (Cost: 65)
    if (selectedAbility === 'AIRSTRIKE') {
      if (playerEnergy < 65) {
        sounds.playMismatch();
        addComms('Insufficient Command Energy for Airstrike (Requires 65)!');
        return;
      }

      sounds.playAirStrike();
      setPlayerEnergy((prev) => Math.max(0, prev - 65));

      // 3-cell cross strike
      const targetCoords = [
        { r, c },
        { r: r - 1, c },
        { r: r + 1, c },
      ].filter((coord) => coord.r >= 0 && coord.r < GRID_SIZE && coord.c >= 0 && coord.c < GRID_SIZE);

      executeMultiStrike(targetCoords, 'Squadron Carpet Bomb');
      setSelectedAbility('ARTILLERY');
      return;
    }

    // Ability: RAILGUN LINE (Cost: 80)
    if (selectedAbility === 'RAILGUN') {
      if (playerEnergy < 80) {
        sounds.playMismatch();
        addComms('Insufficient Command Energy for Railgun Line (Requires 80)!');
        return;
      }

      sounds.playCannonFire();
      setPlayerEnergy((prev) => Math.max(0, prev - 80));

      // Strike 3 contiguous cells horizontally or vertically
      const targetCoords = [
        { r, c },
        { r, c: c + 1 },
        { r, c: c + 2 },
      ].filter((coord) => coord.r >= 0 && coord.r < GRID_SIZE && coord.c >= 0 && coord.c < GRID_SIZE);

      executeMultiStrike(targetCoords, 'High Velocity Railgun Penetration');
      setSelectedAbility('ARTILLERY');
      return;
    }

    // STANDARD ARTILLERY (Free, with Salvo Bonus Twist)
    executeSingleStrike(r, c);
  };

  // Helper: Execute single strike with SALVO BONUS TWIST
  const executeSingleStrike = (r: number, c: number) => {
    sounds.playCannonFire();
    setShotsFired((prev) => prev + 1);

    const cell = enemyGrid[r][c];
    const isHit = cell.hasShip;

    const newGrid: BattleshipCell[][] = enemyGrid.map((row, rowIdx) =>
      row.map((cellItem, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return {
            ...cellItem,
            status: (isHit ? 'HIT' : 'MISS') as 'HIT' | 'MISS',
          };
        }
        return cellItem;
      })
    );

    if (isHit) {
      sounds.playExplosion();
      setShotsHit((prev) => prev + 1);
      setPlayerEnergy((prev) => Math.min(100, prev + 25));

      // Update ship damage
      let hitShipName = 'Enemy Vessel';
      const updatedShips = enemyShips.map((ship) => {
        if (ship.coordinates.some((coord) => coord.row === r && coord.col === c)) {
          hitShipName = ship.name;
          const newHits = ship.hits + 1;
          const isNowSunk = newHits >= ship.size;
          return {
            ...ship,
            hits: newHits,
            isSunk: isNowSunk,
          };
        }
        return ship;
      });

      const sunkShip = updatedShips.find((s) => s.name === hitShipName && s.isSunk && !enemyShips.find(es => es.name === s.name)?.isSunk);

      if (sunkShip) {
        sounds.playSiren();
        setPlayerEnergy((prev) => Math.min(100, prev + 45));
        addComms(`💥 DIRECT HIT & SUNK! Enemy ${sunkShip.name} has been destroyed! (+45 Energy)`);
        // Mark sunk cells
        sunkShip.coordinates.forEach((coord) => {
          newGrid[coord.row][coord.col].isSunk = true;
        });
      } else {
        addComms(`🎯 DIRECT HIT on ${hitShipName} at ${ROW_LABELS[r]}${c + 1}! (+25 Energy)`);
      }

      setEnemyShips(updatedShips);
      setEnemyGrid(newGrid);

      if (checkVictory(updatedShips, true)) return;

      // TWIST: BONUS SALVO!
      sounds.playMatchSuccess();
      setSalvoBonusActive(true);
      addComms('⚡ SALVO BONUS UNLOCKED! Battery reloaded for an immediate extra shot!');
      // Player retains turn!
    } else {
      sounds.playSplash();
      setEnemyGrid(newGrid);
      setPlayerEnergy((prev) => Math.min(100, prev + 10));
      addComms(`Splash: Miss at ${ROW_LABELS[r]}${c + 1}.`);
      setSalvoBonusActive(false);

      // Pass turn to Admiral Vane
      setIsPlayerTurn(false);
      setTimeout(() => {
        executeAiTurn();
      }, 1000);
    }
  };

  // Helper: Execute multi strike for special abilities
  const executeMultiStrike = (coords: { r: number; c: number }[], abilityName: string) => {
    let hitCount = 0;
    const newGrid = enemyGrid.map((row) => [...row]);
    let currentShips = [...enemyShips];

    coords.forEach(({ r, c }) => {
      const cell = newGrid[r][c];
      if (cell.status === 'WATER') {
        const isHit = cell.hasShip;
        newGrid[r][c] = {
          ...cell,
          status: (isHit ? 'HIT' : 'MISS') as 'HIT' | 'MISS',
        };

        if (isHit) {
          hitCount++;
          currentShips = currentShips.map((ship) => {
            if (ship.coordinates.some((coord) => coord.row === r && coord.col === c)) {
              const newHits = ship.hits + 1;
              return { ...ship, hits: newHits, isSunk: newHits >= ship.size };
            }
            return ship;
          });
        }
      }
    });

    setShotsFired((prev) => prev + coords.length);
    setShotsHit((prev) => prev + hitCount);
    setEnemyShips(currentShips);
    setEnemyGrid(newGrid);

    if (hitCount > 0) {
      sounds.playExplosion();
      setPlayerEnergy((prev) => Math.min(100, prev + hitCount * 20));
      addComms(`💥 ${abilityName} Impact! Scored ${hitCount} direct hits!`);
    } else {
      sounds.playSplash();
      addComms(`🌊 ${abilityName} completed. All shells missed enemy vessels.`);
    }

    if (checkVictory(currentShips, true)) return;

    // End turn
    setSalvoBonusActive(false);
    setIsPlayerTurn(false);
    setTimeout(() => {
      executeAiTurn();
    }, 1200);
  };

  // AI Turn (Admiral Vane Intelligent Hunter)
  const executeAiTurn = useCallback(() => {
    if (phase !== 'COMBAT') return;

    let targetR = -1;
    let targetC = -1;

    // If AI has a hunt queue (prioritized adjacent tiles after a hit)
    while (aiHuntQueue.current.length > 0) {
      const candidate = aiHuntQueue.current.shift()!;
      if (
        candidate.row >= 0 &&
        candidate.row < GRID_SIZE &&
        candidate.col >= 0 &&
        candidate.col < GRID_SIZE &&
        playerGrid[candidate.row][candidate.col].status === 'WATER'
      ) {
        targetR = candidate.row;
        targetC = candidate.col;
        break;
      }
    }

    // Otherwise random parity checkerboard search
    if (targetR === -1) {
      const availableWater: { r: number; c: number }[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (playerGrid[r][c].status === 'WATER') {
            availableWater.push({ r, c });
          }
        }
      }

      if (availableWater.length === 0) return;
      // Parity preference
      const parityCells = availableWater.filter(({ r, c }) => (r + c) % 2 === 0);
      const chosen = parityCells.length > 0
        ? parityCells[Math.floor(Math.random() * parityCells.length)]
        : availableWater[Math.floor(Math.random() * availableWater.length)];

      targetR = chosen.r;
      targetC = chosen.c;
    }

    sounds.playCannonFire();

    const cell = playerGrid[targetR][targetC];

    // Check if defended by Smoke Screen
    if (cell.isSmoked && smokeScreenRounds > 0) {
      sounds.playSplash();
      addComms(`🛡️ DEFLECTED! Enemy strike at ${ROW_LABELS[targetR]}${targetC + 1} was blinded by your Smoke Screen!`);
      setIsPlayerTurn(true);
      setTurnCount((prev) => prev + 1);
      return;
    }

    const isHit = cell.hasShip;

    const newPGrid: BattleshipCell[][] = playerGrid.map((row, rowIdx) =>
      row.map((cellItem, colIdx) => {
        if (rowIdx === targetR && colIdx === targetC) {
          return {
            ...cellItem,
            status: (isHit ? 'HIT' : 'MISS') as 'HIT' | 'MISS',
          };
        }
        return cellItem;
      })
    );

    if (isHit) {
      sounds.playExplosion();
      sounds.playSiren();
      aiHitStack.current.push({ row: targetR, col: targetC });

      // Add adjacent cardinal tiles to AI hunt queue
      const neighbors = [
        { row: targetR - 1, col: targetC },
        { row: targetR + 1, col: targetC },
        { row: targetR, col: targetC - 1 },
        { row: targetR, col: targetC + 1 },
      ];
      neighbors.forEach((n) => aiHuntQueue.current.push(n));

      // Update Player ships damage
      let hitShipName = 'Warship';
      const updatedShips = playerShips.map((ship) => {
        if (ship.coordinates.some((coord) => coord.row === targetR && coord.col === targetC)) {
          hitShipName = ship.name;
          const newHits = ship.hits + 1;
          const isNowSunk = newHits >= ship.size;
          return { ...ship, hits: newHits, isSunk: isNowSunk };
        }
        return ship;
      });

      const sunkShip = updatedShips.find((s) => s.name === hitShipName && s.isSunk && !playerShips.find(ps => ps.name === s.name)?.isSunk);

      if (sunkShip) {
        addComms(`🚨 CRITICAL LOSS: Our ${sunkShip.name} has been sunk by enemy fire!`);
        sunkShip.coordinates.forEach((coord) => {
          newPGrid[coord.row][coord.col].isSunk = true;
        });
      } else {
        addComms(`⚠️ DAMAGE ALERT: Enemy scored a direct hit on our ${hitShipName} at ${ROW_LABELS[targetR]}${targetC + 1}!`);
      }

      setPlayerShips(updatedShips);
      setPlayerGrid(newPGrid);

      if (checkVictory(updatedShips, false)) return;

      // Enemy also gets a follow up shot on hit!
      setTimeout(() => {
        executeAiTurn();
      }, 1000);
    } else {
      sounds.playSplash();
      setPlayerGrid(newPGrid);
      addComms(`Admiral Vane fired shell into empty water at ${ROW_LABELS[targetR]}${targetC + 1}.`);

      // Decrease smoke screen round
      if (smokeScreenRounds > 0) {
        setSmokeScreenRounds((prev) => prev - 1);
      }

      setIsPlayerTurn(true);
      setTurnCount((prev) => prev + 1);
    }
  }, [phase, playerGrid, playerShips, smokeScreenRounds]);

  const playerShipsRemaining = playerShips.filter((s) => !s.isSunk).length;
  const enemyShipsRemaining = enemyShips.filter((s) => !s.isSunk).length;

  // Compute ghost placement coordinates for hover preview
  const hoverCoords = React.useMemo(() => {
    if (phase !== 'DEPLOYMENT' || !hoverCell) return [];
    const shipDef = FLEET_DEFINITIONS.find((s) => s.type === selectedDeployShip);
    if (!shipDef) return [];

    const existingOtherShips = playerShips.filter((s) => s.type !== selectedDeployShip);
    const coords: { r: number; c: number; isValid: boolean }[] = [];

    const willFit = deployHorizontal
      ? hoverCell.col + shipDef.size <= GRID_SIZE
      : hoverCell.row + shipDef.size <= GRID_SIZE;

    for (let i = 0; i < shipDef.size; i++) {
      const targetR = deployHorizontal ? hoverCell.row : hoverCell.row + i;
      const targetC = deployHorizontal ? hoverCell.col + i : hoverCell.col;
      const inBounds = targetR < GRID_SIZE && targetC < GRID_SIZE;
      const collides =
        inBounds &&
        existingOtherShips.some((s) =>
          s.coordinates.some((coord) => coord.row === targetR && coord.col === targetC)
        );

      coords.push({
        r: targetR,
        c: targetC,
        isValid: inBounds && willFit && !collides,
      });
    }
    return coords;
  }, [phase, hoverCell, selectedDeployShip, deployHorizontal, playerShips]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {phase === 'DEPLOYMENT' ? 'Phase 1: Harbor Fleet Deployment' : 'Phase 2: Tactical Radar Combat'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <span>ARMADA OPS: BATTLESHIP</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Special Ops Twist
              </span>
            </h2>
          </div>
        </div>

        {/* Phase Buttons */}
        <div className="flex items-center gap-2">
          {phase === 'DEPLOYMENT' ? (
            <>
              <button
                onClick={handleAutoDeployPlayer}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Randomly position all 5 warships"
              >
                <Dices className="w-4 h-4 text-cyan-400" />
                <span>Auto-Deploy</span>
              </button>
              <button
                onClick={handleClearPlayerFleet}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                title="Clear all deployed ships"
              >
                Clear
              </button>
              <button
                onClick={handleLockInFleet}
                disabled={playerShips.length < 5}
                className="px-5 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
              >
                <Crosshair className="w-4 h-4" />
                <span>ENGAGE ARMADA</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Turn:</span>
                <span className="font-mono font-bold text-white">{turnCount}</span>
                <div className="h-3 w-px bg-slate-800" />
                <span className="text-slate-400">Fleet:</span>
                <span className="font-mono font-bold text-emerald-400">{playerShipsRemaining}/5</span>
                <span className="text-slate-400">vs</span>
                <span className="font-mono font-bold text-rose-400">{enemyShipsRemaining}/5</span>
              </div>
              <button
                onClick={handleRestart}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Redeploy Armada"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Special Ops Twist Arsenal Bar (Active in Combat) */}
      {phase === 'COMBAT' && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Command Energy Battery */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-cyan-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Command Energy:</span>
              </div>
              <div className="w-36 sm:w-48 h-3.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
                <div
                  className="h-full bg-linear-to-r from-amber-500 via-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${playerEnergy}%` }}
                />
              </div>
              <span className="font-mono text-xs font-extrabold text-amber-300">{playerEnergy}/100</span>
            </div>

            {/* Turn & Salvo Status */}
            <div className="flex items-center gap-2">
              {salvoBonusActive ? (
                <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>BONUS SALVO SHOT ACTIVE!</span>
                </div>
              ) : isPlayerTurn ? (
                <div className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>YOUR TURN: Select Target on Radar</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>ADMIRAL VANE IS FIRING...</span>
                </div>
              )}
            </div>
          </div>

          {/* Tactical Special Abilities Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedAbility('ARTILLERY');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedAbility === 'ARTILLERY'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-xs shadow-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Artillery Strike</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Free (Salvo on Hit)</div>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedAbility('SONAR');
              }}
              disabled={playerEnergy < 35}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedAbility === 'SONAR'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-xs shadow-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-300">
                <Eye className="w-3.5 h-3.5" />
                <span>Sonar Sweep (35)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Scans 3x3 sector count</div>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedAbility('AIRSTRIKE');
              }}
              disabled={playerEnergy < 65}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedAbility === 'AIRSTRIKE'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-xs shadow-amber-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                <Plane className="w-3.5 h-3.5" />
                <span>Air Salvo (65)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">3-tile cluster bomb</div>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedAbility('RAILGUN');
              }}
              disabled={playerEnergy < 80}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedAbility === 'RAILGUN'
                  ? 'bg-rose-500/20 border-rose-400 text-white shadow-xs shadow-rose-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                <Bomb className="w-3.5 h-3.5" />
                <span>Railgun Line (80)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Piercing 3-cell shell</div>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedAbility('SMOKE_SCREEN');
              }}
              disabled={playerEnergy < 40}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedAbility === 'SMOKE_SCREEN'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-xs shadow-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                <Shield className="w-3.5 h-3.5" />
                <span>Smoke Screen (40)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Masks 2x2 sector for 3 turns</div>
            </button>
          </div>
        </div>
      )}

      {/* Deployment Harbor Control (Only in DEPLOYMENT phase) */}
      {phase === 'DEPLOYMENT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-white text-base">Fleet Harbor: Position Your Capital Vessels</h3>
              <p className="text-xs text-slate-400">
                Click a warship below, then click your Home Waters grid to place. You can also click Auto-Deploy for instant random placement.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setDeployHorizontal(!deployHorizontal);
                }}
                className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 text-xs font-bold rounded-xl border border-cyan-500/50 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-2 shadow-sm shadow-cyan-500/20"
                title="Toggle between Horizontal and Vertical ship orientation"
              >
                <RotateCw className="w-4 h-4 text-cyan-400" />
                <span>Orientation: <strong className="text-white underline">{deployHorizontal ? 'Horizontal ↔' : 'Vertical ↕'}</strong></span>
                <span className="text-[10px] bg-cyan-900/60 px-1.5 py-0.5 rounded text-cyan-300 font-mono">[Press R]</span>
              </button>
            </div>
          </div>

          {/* Placement Quick Help Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">💡 How to Turn Vertically:</span>
              <span>Click the button above, press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-cyan-300 font-bold">R</kbd> on your keyboard, or <strong>Right-Click</strong> anywhere on your grid!</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="text-emerald-400 font-bold">🚀 How to Start:</span>
              <span>Deploy all 5 ships (or click <strong>Auto-Deploy</strong>), then click <strong className="text-white bg-cyan-600/40 px-2 py-0.5 rounded border border-cyan-500/50">ENGAGE ARMADA</strong> at the top right!</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FLEET_DEFINITIONS.map((def) => {
              const isDeployed = playerShips.some((s) => s.type === def.type);
              const isSelected = selectedDeployShip === def.type;

              return (
                <button
                  key={def.type}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedDeployShip(def.type);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{def.icon}</span>
                    {isDeployed ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        DEPLOYED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        UNPLACED
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-white mt-1.5">{def.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{def.size} Compartments</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Dual Radar Combat Arenas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Arena: Enemy Waters Radar (Fog of War) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="font-display font-bold text-white text-base">Enemy Waters: Strike Radar</h3>
                <div className="text-[11px] text-slate-400">Commander Vane's Hidden Fleet</div>
              </div>
            </div>
            {phase === 'COMBAT' && (
              <div className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                {enemyShipsRemaining} Ships Lurking
              </div>
            )}
          </div>

          {/* Grid Area */}
          <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
            {/* Column labels */}
            <div className="grid grid-cols-11 gap-1 mb-1 text-center font-mono text-[11px] text-slate-400 font-bold min-w-[280px]">
              <div></div>
              {COL_LABELS.map((col) => (
                <div key={col}>{col}</div>
              ))}
            </div>

            {/* Grid rows */}
            <div className="space-y-1 min-w-[280px]">
              {enemyGrid.map((row, r) => (
                <div key={r} className="grid grid-cols-11 gap-1 items-center">
                  <div className="text-center font-mono text-[11px] text-slate-400 font-bold">
                    {ROW_LABELS[r]}
                  </div>
                  {row.map((cell, c) => {
                    const isHit = cell.status === 'HIT';
                    const isMiss = cell.status === 'MISS';
                    const isSunk = cell.isSunk;
                    const isScanned = cell.isScanned;

                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handlePlayerGridClick(r, c)}
                        disabled={phase !== 'COMBAT' || !isPlayerTurn || cell.status !== 'WATER'}
                        title={`${ROW_LABELS[r]}${c + 1}`}
                        className={`aspect-square rounded-md border flex items-center justify-center transition-all cursor-pointer relative ${
                          isSunk
                            ? 'bg-rose-950 border-rose-600 text-rose-400 font-black shadow-inner shadow-rose-900'
                            : isHit
                            ? 'bg-linear-to-br from-amber-600 to-rose-700 border-amber-400 text-amber-100 font-black'
                            : isMiss
                            ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                            : isScanned
                            ? 'bg-blue-950/70 border-cyan-500/60 hover:bg-cyan-900/40'
                            : 'bg-slate-900/90 border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40'
                        }`}
                      >
                        {isSunk ? (
                          <span className="text-xs">💀</span>
                        ) : isHit ? (
                          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        ) : isMiss ? (
                          <span className="text-[11px] font-mono font-bold text-slate-400">·</span>
                        ) : isScanned ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Arena: Player Fleet Grid (Defensive Waterways) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-display font-bold text-white text-base">Home Waters: Defensive Fleet Grid</h3>
                <div className="text-[11px] text-slate-400">{playerName}'s Task Force</div>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
              {playerShipsRemaining} Ships Floating
            </div>
          </div>

          {/* Grid Area */}
          <div className="bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
            {/* Column labels */}
            <div className="grid grid-cols-11 gap-1 mb-1 text-center font-mono text-[11px] text-slate-400 font-bold min-w-[280px]">
              <div></div>
              {COL_LABELS.map((col) => (
                <div key={col}>{col}</div>
              ))}
            </div>

            {/* Grid rows */}
            <div className="space-y-1 min-w-[280px]">
              {playerGrid.map((row, r) => (
                <div key={r} className="grid grid-cols-11 gap-1 items-center">
                  <div className="text-center font-mono text-[11px] text-slate-400 font-bold">
                    {ROW_LABELS[r]}
                  </div>
                  {row.map((cell, c) => {
                    const hasShip = cell.hasShip;
                    const isHit = cell.status === 'HIT';
                    const isMiss = cell.status === 'MISS';
                    const isSunk = cell.isSunk;
                    const isSmoked = cell.isSmoked;

                    // Check if current cell is part of hover preview
                    const hoverItem = hoverCoords.find((hc) => hc.r === r && hc.c === c);
                    const isHovered = !!hoverItem;
                    const isHoverValid = hoverItem?.isValid;

                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleDeployCellClick(r, c)}
                        onMouseEnter={() => phase === 'DEPLOYMENT' && setHoverCell({ row: r, col: c })}
                        onMouseLeave={() => phase === 'DEPLOYMENT' && setHoverCell(null)}
                        onContextMenu={(e) => {
                          if (phase === 'DEPLOYMENT') {
                            e.preventDefault();
                            sounds.playClick();
                            setDeployHorizontal((prev) => !prev);
                          }
                        }}
                        disabled={phase !== 'DEPLOYMENT'}
                        title={
                          phase === 'DEPLOYMENT'
                            ? `${ROW_LABELS[r]}${c + 1} - Left click to place ${selectedDeployShip}, Right click or press [R] to rotate`
                            : `${ROW_LABELS[r]}${c + 1}`
                        }
                        className={`aspect-square rounded-md border flex items-center justify-center transition-all relative ${
                          isSunk
                            ? 'bg-rose-950 border-rose-600 text-rose-300 font-black'
                            : isHit
                            ? 'bg-linear-to-br from-amber-600 to-rose-700 border-amber-400 text-white'
                            : isMiss
                            ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                            : hasShip
                            ? 'bg-linear-to-br from-blue-700 to-indigo-800 border-blue-400 text-white shadow-xs'
                            : isSmoked
                            ? 'bg-emerald-950/60 border-emerald-500/50'
                            : isHovered
                            ? isHoverValid
                              ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/50'
                              : 'bg-rose-500/30 border-rose-500 ring-2 ring-rose-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        } ${phase === 'DEPLOYMENT' ? 'cursor-pointer hover:border-cyan-400' : 'cursor-default'}`}
                      >
                        {isSunk ? (
                          <span className="text-xs">💀</span>
                        ) : isHit ? (
                          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        ) : isMiss ? (
                          <span className="text-[11px] font-mono text-slate-400">·</span>
                        ) : isSmoked ? (
                          <span className="text-xs">💨</span>
                        ) : hasShip ? (
                          <div className="w-2 h-2 rounded-full bg-cyan-300" />
                        ) : isHovered ? (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isHoverValid ? 'bg-cyan-400 animate-ping' : 'bg-rose-400'
                            }`}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Status Monitors & Combat Radio Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fleet Integrity Status */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Task Force Vessel Telemetry</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Player ships list */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                <span>{playerName}'s Capital Ships</span>
                <span>{playerShipsRemaining}/5 Active</span>
              </div>
              <div className="space-y-1.5">
                {FLEET_DEFINITIONS.map((def) => {
                  const ship = playerShips.find((s) => s.type === def.type);
                  const isSunk = ship?.isSunk ?? false;
                  const hits = ship?.hits ?? 0;

                  return (
                    <div key={def.type} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span>{def.icon}</span>
                        <span className={isSunk ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {def.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: def.size }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-xs border ${
                              i < hits
                                ? 'bg-rose-500 border-rose-400'
                                : 'bg-slate-800 border-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enemy ships list */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-300 flex items-center justify-between">
                <span>Admiral Vane's Armada</span>
                <span>{enemyShipsRemaining}/5 Remaining</span>
              </div>
              <div className="space-y-1.5">
                {FLEET_DEFINITIONS.map((def) => {
                  const ship = enemyShips.find((s) => s.type === def.type);
                  const isSunk = ship?.isSunk ?? false;
                  const hits = ship?.hits ?? 0;

                  return (
                    <div key={def.type} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span>{def.icon}</span>
                        <span className={isSunk ? 'line-through text-slate-400 font-bold text-rose-400' : 'text-slate-200'}>
                          {def.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: def.size }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-xs border ${
                              isSunk
                                ? 'bg-rose-600 border-rose-400'
                                : i < hits
                                ? 'bg-amber-500 border-amber-400'
                                : 'bg-slate-800 border-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Military Radio Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Combat Comms Log</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">LIVE FEED</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 h-44 overflow-y-auto space-y-1.5 font-mono text-xs">
            {commsLog.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  i === 0
                    ? 'text-cyan-300 font-bold'
                    : log.includes('DIRECT HIT')
                    ? 'text-amber-400'
                    : log.includes('SUNK')
                    ? 'text-rose-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post-Game Victory / Defeat Modal Banner */}
      {phase === 'GAMEOVER' && (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <h3 className="font-display text-2xl font-black text-white">
              {winner === 'PLAYER' ? '🏆 NAVAL CONQUEST VICTORY!' : '💀 ARMADA DEFEAT'}
            </h3>
          </div>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {winner === 'PLAYER'
              ? `Outstanding tactical brilliance, Admiral! You neutralized Commander Vane's entire fleet in ${turnCount} rounds with ${
                  shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0
                }% firing accuracy.`
              : `Admiral Vane penetrated our battle lines and sunk all five warships. Regroup and redeploy your armada for a rematch!`}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-display font-black text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Deploy New Armada</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
