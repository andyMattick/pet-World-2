/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Cell,
  Direction,
  GameStatus,
  GameMode,
  LevelConfig,
  PlayerStats,
  Position,
  UpgradesState,
  AbilityType,
  MissionAccolade
} from './types/game';
import {
  CAMPAIGN_LEVELS,
  generateMinefield,
  isValid,
  getFacingDirection,
  calculateProximityDanger,
  applyEmpBlast,
  applySonarScan,
  applyDroneDefusal,
  floodFillReveal,
  chordReveal,
  recalculateAllNeighbors,
  prependEndlessRows,
  activateWatchtower,
  NEIGHBOR_OFFSETS
} from './utils/minefield';
import { sounds } from './utils/audio';
import { TopBar } from './components/TopBar';
import { HUD } from './components/HUD';
import { AbilityBar } from './components/AbilityBar';
import { MinefieldGrid } from './components/MinefieldGrid';
import { LevelSummaryModal } from './components/LevelSummaryModal';
import { ArmoryModal } from './components/ArmoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CustomGameModal } from './components/CustomGameModal';
import { FieldIntelModal } from './components/FieldIntelModal';

const DEFAULT_UPGRADES: UpgradesState = {
  maxArmor: 1,
  maxEmp: 1,
  maxJumps: 2,
  maxSonar: 1,
  maxDrones: 1,
  sonarRadius: 2,
  visionRange: 3.5,
  maxDefusalKits: 4
};

const DEFAULT_STATS: PlayerStats = {
  levelsCompleted: 0,
  totalMinesDefused: 0,
  totalMinesEncountered: 0,
  totalSteps: 0,
  abilitiesUsed: 0,
  deaths: 0,
  intelPoints: 0,
  falseDefusalsCount: 0,
  endlessBestDistance: 0,
  highScores: {}
};

// Pet Town Arcade: inside the Arcade frame (?arcadeRun=...), upgrades and stats are saved in the student's
// Pet Town save instead of this browser, and rewards and endless rows are reported for tickets (README.md).
const ARCADE_RUN = new URLSearchParams(window.location.search).get('arcadeRun');
const EMBEDDED = !!ARCADE_RUN && window.parent !== window;
const ENDLESS_START_ROW = 18;
function postToPetTown(message: Record<string, unknown>) {
  if (EMBEDDED) window.parent.postMessage({ ...message, gameId: 'mine-walker', runId: ARCADE_RUN }, window.location.origin);
}
function readLocal<T extends object>(key: string, fallback: T): T {
  if (EMBEDDED) return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Persistence state
  const [upgrades, setUpgrades] = useState<UpgradesState>(() => readLocal('mine_walker_upgrades', DEFAULT_UPGRADES));

  const [stats, setStats] = useState<PlayerStats>(() => readLocal('mine_walker_stats', DEFAULT_STATS));
  const [arcadeLoaded, setArcadeLoaded] = useState<boolean>(!EMBEDDED);

  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());

  // Game mode & Progression
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [activeLevelConfig, setActiveLevelConfig] = useState<LevelConfig>(CAMPAIGN_LEVELS[0]);

  // Endless mode parameters
  const [collapseRow, setCollapseRow] = useState<number>(24);
  const [endlessDistance, setEndlessDistance] = useState<number>(0);

  // Tactical Systems: Fog of War & Defusal Kits
  const [isFogOfWar, setIsFogOfWar] = useState<boolean>(true);
  const [defusalKits, setDefusalKits] = useState<number>(4);
  const [defusalStreak, setDefusalStreak] = useState<number>(0);
  const [falseDefusalAlert, setFalseDefusalAlert] = useState<string | null>(null);

  // Game board state
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [playerPos, setPlayerPos] = useState<Position>({ x: 3, y: 8 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('N');
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // Dynamic feedback and alerts
  const [bombDetonationCue, setBombDetonationCue] = useState<{
    active: boolean;
    wasFatal: boolean;
    x: number;
    y: number;
  } | null>(null);
  const [mudNotice, setMudNotice] = useState<boolean>(false);

  // Abilities current charges
  const [armor, setArmor] = useState(1);
  const [empCharges, setEmpCharges] = useState(1);
  const [jumpCharges, setJumpCharges] = useState(2);
  const [sonarCharges, setSonarCharges] = useState(1);
  const [droneCharges, setDroneCharges] = useState(1);

  // Active interaction modes
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [activeTargetingAbility, setActiveTargetingAbility] = useState<AbilityType | null>(null);

  // Visual shockwaves
  const [empEffectPos, setEmpEffectPos] = useState<Position | null>(null);
  const [sonarEffectPos, setSonarEffectPos] = useState<Position | null>(null);

  // HUD stats
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [disarmedMinesCount, setDisarmedMinesCount] = useState(0);
  const [dangerIntensity, setDangerIntensity] = useState(0);

  // Tactical Accolades & Rewards Tracking (Time, Full Clearance, Flawless, Purist)
  const [damageTakenThisRun, setDamageTakenThisRun] = useState(0);
  const [defusesUsedThisRun, setDefusesUsedThisRun] = useState(0);
  const [watchtowersActivatedThisRun, setWatchtowersActivatedThisRun] = useState(0);
  const [currentAccolades, setCurrentAccolades] = useState<MissionAccolade[]>([]);
  const [lastEarnedIntel, setLastEarnedIntel] = useState(100);

  // Field Notifications
  const [watchtowerNotice, setWatchtowerNotice] = useState<string | null>(null);
  const [crateNotice, setCrateNotice] = useState<{ title: string; subtitle: string; iconType: string } | null>(null);

  // Modals
  const [showArmory, setShowArmory] = useState(false);
  const [showIntel, setShowIntel] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Pet Town Arcade: load upgrades and stats from the student's Pet Town save
  useEffect(() => {
    if (!EMBEDDED) return;
    let done = false;
    const finish = () => { done = true; window.removeEventListener('message', onMessage); setArcadeLoaded(true); };
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (done || event.source !== window.parent || event.origin !== window.location.origin || !data
        || data.type !== 'arcade:state-load' || data.gameId !== 'mine-walker' || data.runId !== ARCADE_RUN) return;
      if (typeof data.state === 'string') {
        try {
          const saved = JSON.parse(data.state);
          if (saved && typeof saved.upgrades === 'object' && typeof saved.stats === 'object') {
            const loadedStats: PlayerStats = { ...DEFAULT_STATS, ...saved.stats, highScores: { ...(saved.stats.highScores || {}) } };
            setUpgrades({ ...DEFAULT_UPGRADES, ...saved.upgrades });
            setStats(loadedStats);
            setCurrentLevelIndex(Math.max(0, Math.min(CAMPAIGN_LEVELS.length - 1, Math.floor(+loadedStats.levelsCompleted || 0))));
          }
        } catch { /* a bad save starts fresh */ }
      }
      finish();
    }
    window.addEventListener('message', onMessage);
    postToPetTown({ type: 'arcade:state-load-request' });
    const fallback = setTimeout(() => { if (!done) finish(); }, 2000);
    return () => { done = true; window.removeEventListener('message', onMessage); clearTimeout(fallback); };
  }, []);

  // Save upgrades and stats: to Pet Town inside the Arcade, otherwise to this browser
  useEffect(() => {
    if (!EMBEDDED) {
      try {
        localStorage.setItem('mine_walker_upgrades', JSON.stringify(upgrades));
        localStorage.setItem('mine_walker_stats', JSON.stringify(stats));
      } catch { /* storage unavailable */ }
      return;
    }
    if (!arcadeLoaded) return;
    const timer = setTimeout(() => {
      const saved = JSON.stringify({ upgrades, stats });
      if (saved.length <= 95000) postToPetTown({ type: 'arcade:state-save', state: saved });
    }, 800);
    return () => clearTimeout(timer);
  }, [upgrades, stats, arcadeLoaded]);

  // Endless rows walked: the farthest row reached, counted from the start row. endlessShiftRef adds
  // the rows that were inserted above the player, so walking back and forth never adds rows.
  const endlessShiftRef = useRef(0);
  const endlessRunRef = useRef({ rows: 0, reported: true });
  const finishEndlessRun = () => {
    const run = endlessRunRef.current;
    if (!run.reported && run.rows > 0) {
      postToPetTown({ type: 'arcade:round-complete', roundId: `endless-${Date.now()}`, score: run.rows, mode: 'endless' });
    }
    run.reported = true;
  };

  // Initialize campaign level
  const initLevel = useCallback(
    (config: LevelConfig) => {
      finishEndlessRun();
      setGameMode('campaign');
      const startX = Math.floor(config.width / 2);
      const startY = config.height - 1;
      const initialPos: Position = { x: startX, y: startY };

      const newGrid = generateMinefield(config, initialPos);

      setActiveLevelConfig(config);
      setGrid(newGrid);
      setPlayerPos(initialPos);
      setPlayerDirection('N');
      setGameStatus('playing');
      setElapsedSeconds(0);
      setMoveCount(0);
      setDisarmedMinesCount(0);
      setActiveTargetingAbility(null);
      setIsFlagMode(false);
      setShowSummary(false);
      setBombDetonationCue(null);
      setMudNotice(false);
      setFalseDefusalAlert(null);
      setDefusalStreak(0);
      setDefusalKits(upgrades.maxDefusalKits ?? 4);
      setDamageTakenThisRun(0);
      setDefusesUsedThisRun(0);
      setWatchtowersActivatedThisRun(0);
      setCurrentAccolades([]);
      setWatchtowerNotice(null);
      setCrateNotice(null);

      // Initial abilities incorporating armory upgrades
      setArmor(Math.max(config.initialArmor, upgrades.maxArmor));
      setEmpCharges(Math.max(config.initialEmp, upgrades.maxEmp));
      setJumpCharges(Math.max(config.initialJumps, upgrades.maxJumps));
      setSonarCharges(Math.max(config.initialSonar, upgrades.maxSonar));
      setDroneCharges(Math.max(config.initialDrones, upgrades.maxDrones));

      const initDanger = calculateProximityDanger(initialPos, newGrid, config.width, config.height);
      setDangerIntensity(initDanger);
    },
    [upgrades]
  );

  // Initialize Endless Mode ("bottom of the screen rolls up")
  const initEndless = useCallback(() => {
    finishEndlessRun();
    endlessShiftRef.current = 0;
    endlessRunRef.current = { rows: 0, reported: false };
    setGameMode('endless');
    const width = 10;
    const height = 24;
    const initialPos: Position = { x: 4, y: ENDLESS_START_ROW };

    const endlessConfig: LevelConfig = {
      id: 9999,
      title: 'Endless Run',
      codename: 'Rolling Barrage',
      width,
      height,
      mineCount: 38,
      initialArmor: Math.max(2, upgrades.maxArmor),
      initialEmp: Math.max(2, upgrades.maxEmp),
      initialJumps: Math.max(3, upgrades.maxJumps),
      initialSonar: Math.max(2, upgrades.maxSonar),
      initialDrones: Math.max(2, upgrades.maxDrones),
      cratesCount: 5,
      hasMud: true,
      hasElectricFence: true,
      description: 'Survival operation. The bottom barrage advances upward continuously!'
    };

    const newGrid = generateMinefield(endlessConfig, initialPos);

    setActiveLevelConfig(endlessConfig);
    setGrid(newGrid);
    setPlayerPos(initialPos);
    setPlayerDirection('N');
    setGameStatus('playing');
    setElapsedSeconds(0);
    setMoveCount(0);
    setDisarmedMinesCount(0);
    setEndlessDistance(0);
    setCollapseRow(height - 1);
    setActiveTargetingAbility(null);
    setIsFlagMode(false);
    setShowSummary(false);
    setBombDetonationCue(null);
    setMudNotice(false);
    setFalseDefusalAlert(null);
    setDefusalStreak(0);
    setDefusalKits(upgrades.maxDefusalKits ?? 4);
    setDamageTakenThisRun(0);
    setDefusesUsedThisRun(0);
    setWatchtowersActivatedThisRun(0);
    setCurrentAccolades([]);
    setWatchtowerNotice(null);
    setCrateNotice(null);

    setArmor(Math.max(2, upgrades.maxArmor));
    setEmpCharges(Math.max(2, upgrades.maxEmp));
    setJumpCharges(Math.max(3, upgrades.maxJumps));
    setSonarCharges(Math.max(2, upgrades.maxSonar));
    setDroneCharges(Math.max(2, upgrades.maxDrones));

    const initDanger = calculateProximityDanger(initialPos, newGrid, width, height);
    setDangerIntensity(initDanger);
  }, [upgrades]);

  // First mount load
  useEffect(() => {
    initLevel(CAMPAIGN_LEVELS[currentLevelIndex] || CAMPAIGN_LEVELS[0]);
  }, [initLevel, currentLevelIndex]);

  // Timer loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Endless Mode: Creeping Barrage Timer (bottom of the screen rolls up)
  useEffect(() => {
    if (gameStatus !== 'playing' || gameMode !== 'endless') return;

    // Every 3.4 seconds, the bottom barrage line advances upward by 1 row
    const interval = setInterval(() => {
      setCollapseRow((prevRow) => {
        const nextRow = prevRow - 1;
        // If the barrage reaches Miller
        if (nextRow <= playerPos.y) {
          sounds.playExplosion();
          setGameStatus('lost');
          setBombDetonationCue({
            active: true,
            wasFatal: true,
            x: playerPos.x,
            y: playerPos.y
          });
          setShowSummary(true);
        }
        return nextRow;
      });
    }, 3400);

    return () => clearInterval(interval);
  }, [gameStatus, gameMode, playerPos.y, playerPos.x]);

  // Endless: distance is the farthest row reached
  useEffect(() => {
    if (gameMode !== 'endless') return;
    const rows = ENDLESS_START_ROW - (playerPos.y - endlessShiftRef.current);
    if (rows > endlessRunRef.current.rows) {
      endlessRunRef.current.rows = rows;
      setEndlessDistance(rows);
      setStats((s) => ({ ...s, endlessBestDistance: Math.max(s.endlessBestDistance, rows) }));
    }
  }, [playerPos, gameMode]);

  // Endless: report the rows walked to Pet Town when the run ends
  useEffect(() => {
    if (gameMode === 'endless' && gameStatus === 'lost') finishEndlessRun();
  }, [gameStatus, gameMode]);

  // Geiger proximity audio tick interval
  useEffect(() => {
    if (gameStatus !== 'playing' || isMuted || dangerIntensity <= 0.1) return;

    const tickInterval = Math.max(180, 1200 - dangerIntensity * 1020);
    const interval = setInterval(() => {
      sounds.triggerGeigerTick(dangerIntensity);
    }, tickInterval);

    return () => clearInterval(interval);
  }, [gameStatus, isMuted, dangerIntensity]);

  // Toggle audio mute
  const handleToggleMute = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
  };

  // Check Crate pickup
  const checkCratePickup = (cell: Cell) => {
    if (cell.hasCrate) {
      sounds.playCrate();
      const crate = cell.hasCrate;
      cell.hasCrate = undefined;

      if (crate === 'emp') {
        setEmpCharges((c) => c + 1);
        setCrateNotice({ title: '📦 EMP CAPACITOR', subtitle: '+1 High-Voltage Pulse Recharged', iconType: 'emp' });
      } else if (crate === 'sonar') {
        setSonarCharges((c) => c + 1);
        setCrateNotice({ title: '📦 SONAR RADAR PING', subtitle: '+1 Holographic Area Sweep', iconType: 'sonar' });
      } else if (crate === 'armor') {
        setArmor((a) => a + 1);
        setCrateNotice({ title: '📦 KEVLAR ARMOR PLATE', subtitle: '+1 Blast Shield Capacity Added', iconType: 'armor' });
      } else if (crate === 'intel') {
        setStats((prev) => ({ ...prev, intelPoints: prev.intelPoints + 75 }));
        setDefusalKits((k) => Math.min(upgrades.maxDefusalKits ?? 4, k + 1));
        setCrateNotice({ title: '📦 FIELD INTEL DATA', subtitle: '+75 Intel XP & +1 Defusal Kit', iconType: 'intel' });
      }
      setTimeout(() => setCrateNotice(null), 2400);
    }
  };

  // Step onto a target position (normal move)
  const executeStep = useCallback(
    (targetX: number, targetY: number) => {
      if (gameStatus !== 'playing') return;

      const { width, height } = activeLevelConfig;
      if (!isValid(targetX, targetY, width, height)) return;

      const cell = grid[targetY][targetX];

      // Cannot step on flagged cells
      if (cell.state === 'flagged') {
        return;
      }

      // Check Endless Barrage zone (cannot step behind or in the creeping barrage)
      if (gameMode === 'endless' && targetY >= collapseRow) {
        return;
      }

      // ENVIRONMENTAL HAZARD 1: Electric Fence
      if (cell.hazard === 'electric_fence') {
        sounds.playElectricShock();
        setDamageTakenThisRun((d) => d + 1);
        if (armor > 0) {
          // Armor absorbs high voltage shock
          setArmor((a) => a - 1);
          cell.hazard = undefined;
          cell.state = 'revealed';
          setBombDetonationCue({
            active: true,
            wasFatal: false,
            x: targetX,
            y: targetY
          });
          setTimeout(() => setBombDetonationCue(null), 1800);
        } else {
          // Fatal shock
          sounds.playExplosion();
          cell.state = 'exploded';
          setGameStatus('lost');
          setBombDetonationCue({
            active: true,
            wasFatal: true,
            x: targetX,
            y: targetY
          });
          setShowSummary(true);
          return;
        }
      }

      // ENVIRONMENTAL HAZARD 2: Mud Patch
      let stepCost = 1;
      if (cell.hazard === 'mud') {
        sounds.playMud();
        stepCost = 2; // costs 2 moves
        setMudNotice(true);
        setTimeout(() => setMudNotice(false), 1200);
      }

      // Facing direction
      const newDir = getFacingDirection(playerPos, { x: targetX, y: targetY });
      setPlayerDirection(newDir);
      setPlayerPos({ x: targetX, y: targetY });
      setMoveCount((m) => m + stepCost);
      setStats((prev) => ({ ...prev, totalSteps: prev.totalSteps + stepCost }));

      // Footstep animation & sound
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 160);
      if (cell.hazard !== 'mud') {
        sounds.playStep();
      }

      // Check supply crate
      checkCratePickup(cell);

      // Check Recon Watchtower activation
      if (cell.hasWatchtower && !cell.isWatchtowerActivated) {
        sounds.playWatchtowerRecon();
        activateWatchtower(grid, targetX, targetY, width, height, 4.2);
        setWatchtowersActivatedThisRun((w) => w + 1);
        setWatchtowerNotice('🔭 RECON WATCHTOWER SECURED! High ground surveyed the field ahead!');
        setTimeout(() => setWatchtowerNotice(null), 2800);
      }

      // STEPPED ON A BOMB! (Visible cue + armor/fatal)
      if (cell.isMine && !cell.isDefused) {
        setDamageTakenThisRun((d) => d + 1);
        if (armor > 0) {
          // Armor absorbs fatal blast!
          sounds.playArmorDeflect();
          setArmor((a) => a - 1);
          cell.isMine = false;
          cell.state = 'disarmed';
          setDisarmedMinesCount((d) => d + 1);
          setStats((prev) => ({
            ...prev,
            totalMinesDefused: prev.totalMinesDefused + 1
          }));

          // VISUAL CUE: Big detonation banner & screen flash
          setBombDetonationCue({
            active: true,
            wasFatal: false,
            x: targetX,
            y: targetY
          });
          setTimeout(() => setBombDetonationCue(null), 1800);

          recalculateAllNeighbors(grid, width, height);
        } else {
          // FATAL EXPLOSION CUE!
          sounds.playExplosion();
          cell.state = 'exploded';
          setGameStatus('lost');

          // VISUAL CUE: Critical Detonation Alert & screen shake
          setBombDetonationCue({
            active: true,
            wasFatal: true,
            x: targetX,
            y: targetY
          });

          setShowSummary(true);
          setStats((prev) => ({
            ...prev,
            deaths: prev.deaths + 1,
            totalMinesEncountered: prev.totalMinesEncountered + 1
          }));
          return;
        }
      } else {
        // Safe cell
        if (cell.state !== 'revealed') {
          if (cell.neighborMines === 0) {
            floodFillReveal(grid, targetX, targetY, width, height);
            sounds.playCascade();
          } else {
            cell.state = 'revealed';
            sounds.playReveal(cell.neighborMines);
          }
        }
      }

      // Endless Mode: Distance tracking and rolling terrain generation ahead
      if (gameMode === 'endless') {
        // If Miller approaches the top edge (targetY < 7), prepend 8 fresh rows!
        if (targetY < 7) {
          const numRowsToAdd = 8;
          const { newGrid } = prependEndlessRows(grid, numRowsToAdd, width, 0.18);
          setGrid(newGrid);
          endlessShiftRef.current += numRowsToAdd;
          setPlayerPos({ x: targetX, y: targetY + numRowsToAdd });
          setCollapseRow((r) => r + numRowsToAdd);
          setActiveLevelConfig((cfg) => ({ ...cfg, height: newGrid.length }));
          return;
        }
      }

      // Update Proximity Danger
      const newDanger = calculateProximityDanger({ x: targetX, y: targetY }, grid, width, height);
      setDangerIntensity(newDanger);

      // Check Campaign Victory Condition (Reached Row 0 / Extraction Line)
      if (gameMode === 'campaign' && targetY === 0) {
        handleVictory();
      }
    },
    [gameStatus, activeLevelConfig, grid, playerPos, armor, gameMode, collapseRow]
  );

  // Victory handler with Tactical Accolades & Rewards calculation
  const handleVictory = () => {
    setGameStatus('won');
    setShowSummary(true);

    const parTime =
      activeLevelConfig.parTime ??
      Math.max(30, Math.floor((activeLevelConfig.width * activeLevelConfig.height) / 2));
    const isSpeedDemon = elapsedSeconds <= parTime;
    const isFullClearance = disarmedMinesCount >= activeLevelConfig.mineCount;
    const isFlawless = damageTakenThisRun === 0;
    const isPurist = defusesUsedThisRun === 0;
    const hasTowers = (activeLevelConfig.watchtowerCount ?? 0) > 0;
    const isReconMaster =
      hasTowers && watchtowersActivatedThisRun >= (activeLevelConfig.watchtowerCount ?? 1);

    const calculatedAccolades: MissionAccolade[] = [
      {
        id: 'speed_demon',
        title: 'Lightning Scout',
        subtitle: `Par Time ≤ ${parTime}s (Achieved ${elapsedSeconds}s)`,
        description: 'Completed the extraction in rapid tactical time under par.',
        earned: isSpeedDemon,
        xpReward: 100,
        iconType: 'speed'
      },
      {
        id: 'full_clearance',
        title: 'Sweeper Supreme',
        subtitle: `Defused ${disarmedMinesCount} / ${activeLevelConfig.mineCount} Mines`,
        description: '100% field clearance: Neutralized every single explosive threat.',
        earned: isFullClearance,
        xpReward: 150,
        iconType: 'clearance'
      },
      {
        id: 'flawless_run',
        title: 'Ghost Walk',
        subtitle: `0 Damage Taken (Armor Intact)`,
        description: 'Flawless run: Never suffered an explosion or hazard shock.',
        earned: isFlawless,
        xpReward: 125,
        iconType: 'flawless'
      },
      {
        id: 'purist',
        title: 'Nerve of Steel',
        subtitle: `0 Defusal Flags Used`,
        description: 'Pure numerical deduction: Crossed without defusing any bomb.',
        earned: isPurist,
        xpReward: 100,
        iconType: 'purist'
      }
    ];

    if (hasTowers) {
      calculatedAccolades.push({
        id: 'recon_master',
        title: 'Vanguard Recon',
        subtitle: `Captured Outposts (${watchtowersActivatedThisRun}/${activeLevelConfig.watchtowerCount ?? 1})`,
        description: 'Secured all high-ground observation towers in the sector.',
        earned: isReconMaster,
        xpReward: 75,
        iconType: 'recon'
      });
    }

    const earnedAccolades = calculatedAccolades.filter((a) => a.earned);

    // Pet Town: report the rewards earned on a campaign level (custom games pay nothing). Pet Town pays
    // each reward id only once, ever, so replaying a level only pays for medals not earned before.
    if (CAMPAIGN_LEVELS.some((level) => level.id === activeLevelConfig.id)) {
      const levelId = activeLevelConfig.id;
      const rewards = [`L${levelId}-clear`, ...earnedAccolades.map((a) => `L${levelId}-${a.id}`)];
      postToPetTown({ type: 'arcade:round-complete', roundId: `campaign-${levelId}-${Date.now()}`, score: rewards.length, rewards });
    }
    const accoladeBonusXp = earnedAccolades.reduce((sum, a) => sum + a.xpReward, 0);
    const baseIntel = 100 + activeLevelConfig.id * 35;
    const totalIntelEarned = baseIntel + accoladeBonusXp;

    if (earnedAccolades.length > 0) {
      sounds.playAccoladeFanfare();
    } else {
      sounds.playVictory();
    }

    setCurrentAccolades(calculatedAccolades);
    setLastEarnedIntel(totalIntelEarned);

    const stars =
      elapsedSeconds < 60 && moveCount < activeLevelConfig.height * 2 ? 3 : elapsedSeconds < 120 ? 2 : 1;

    setStats((prev) => {
      const isNewClear = prev.levelsCompleted <= currentLevelIndex;
      const earnedMedalIds = earnedAccolades.map((a) => a.id);
      return {
        ...prev,
        levelsCompleted: isNewClear ? currentLevelIndex + 1 : prev.levelsCompleted,
        intelPoints: prev.intelPoints + totalIntelEarned,
        medalsEarnedCount: (prev.medalsEarnedCount ?? 0) + earnedAccolades.length,
        highScores: {
          ...prev.highScores,
          [activeLevelConfig.id]: {
            time: Math.min(prev.highScores[activeLevelConfig.id]?.time ?? 9999, elapsedSeconds),
            stars: Math.max(prev.highScores[activeLevelConfig.id]?.stars ?? 0, stars),
            moves: Math.min(prev.highScores[activeLevelConfig.id]?.moves ?? 9999, moveCount),
            medals: Array.from(
              new Set([...(prev.highScores[activeLevelConfig.id]?.medals ?? []), ...earnedMedalIds])
            )
          }
        }
      };
    });
  };

  // Flag toggle & Bomb Defusal with WRONGFUL DEFUSAL PENALTY and STREAK REWARDS!
  const toggleFlag = useCallback(
    (x: number, y: number) => {
      if (gameStatus !== 'playing') return;
      const { width, height } = activeLevelConfig;
      const cell = grid[y][x];

      if (cell.state === 'revealed' || cell.state === 'exploded' || cell.state === 'disarmed') {
        return;
      }

      const wasFlagged = cell.state === 'flagged';
      if (wasFlagged) {
        // Un-flag: if was defused, refund the defusal kit
        if (cell.isDefused) {
          setDefusalKits((k) => Math.min(upgrades.maxDefusalKits ?? 4, k + 1));
          cell.isDefused = false;
        }
        cell.state = 'hidden';
        sounds.playFlag(false);
        recalculateAllNeighbors(grid, width, height);
      } else {
        // Planting flag / Attempting defusal!
        if (defusalKits <= 0) {
          sounds.playFalseDefusalError();
          setFalseDefusalAlert('⚠️ OUT OF DEFUSAL KITS! Find supply crates or step carefully.');
          setTimeout(() => setFalseDefusalAlert(null), 2200);
          return;
        }

        // Consume 1 defusal kit and track defusal attempt for purist accolade
        setDefusalKits((k) => Math.max(0, k - 1));
        setDefusesUsedThisRun((d) => d + 1);

        if (cell.isMine) {
          // SUCCESSFUL DEFUSAL!
          cell.isDefused = true;
          cell.state = 'flagged';
          sounds.playDefuse();
          setDisarmedMinesCount((d) => d + 1);
          setStats((prev) => ({
            ...prev,
            totalMinesDefused: prev.totalMinesDefused + 1,
            intelPoints: prev.intelPoints + 30
          }));

          // 2-Streak Defusal Bonus: Correctly defusing 2 in a row rewards +1 Defusal Kit!
          const nextStreak = defusalStreak + 1;
          if (nextStreak >= 2) {
            setDefusalKits((k) => Math.min(upgrades.maxDefusalKits ?? 4, k + 1));
            sounds.playBonusKitReward();
            setDefusalStreak(0);
            setFalseDefusalAlert('🎯 STREAK x2 BONUS! +1 DEFUSAL KIT REQUISITIONED');
            setTimeout(() => setFalseDefusalAlert(null), 2200);
          } else {
            setDefusalStreak(nextStreak);
          }

          // Recalculate all neighbors: defused bombs no longer count toward adjacent numbers!
          recalculateAllNeighbors(grid, width, height);

          // If any revealed neighbor now has 0 remaining mines, ripple-reveal surrounding safe tiles!
          for (const [dx, dy] of NEIGHBOR_OFFSETS) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, width, height)) {
              const neighbor = grid[ny][nx];
              if (neighbor.state === 'revealed' && neighbor.neighborMines === 0) {
                floodFillReveal(grid, nx, ny, width, height);
              }
            }
          }
        } else {
          // WRONGFUL DEFUSAL PENALTY!
          // Player flagged an empty tile thinking it was a mine
          cell.state = 'flagged';
          setDefusalStreak(0); // Reset streak on mistake
          sounds.playFalseDefusalError();
          setStats((prev) => ({
            ...prev,
            falseDefusalsCount: prev.falseDefusalsCount + 1
          }));

          // PENALTY: Spawns a NEW hidden live mine on an unrevealed, non-mine cell!
          const eligibleCandidates: [number, number][] = [];
          for (let ry = 1; ry < height - 1; ry++) {
            for (let rx = 0; rx < width; rx++) {
              const c = grid[ry][rx];
              if (
                !c.isMine &&
                c.state === 'hidden' &&
                !(rx === playerPos.x && ry === playerPos.y) &&
                !(rx === x && ry === y)
              ) {
                eligibleCandidates.push([rx, ry]);
              }
            }
          }

          if (eligibleCandidates.length > 0) {
            const [spawnX, spawnY] = eligibleCandidates[Math.floor(Math.random() * eligibleCandidates.length)];
            grid[spawnY][spawnX].isMine = true;
            recalculateAllNeighbors(grid, width, height);
            setFalseDefusalAlert('⚠️ FALSE DEFUSAL PENALTY: SEISMIC TRIPWIRE SPAWNED +1 MINE!');
            setTimeout(() => setFalseDefusalAlert(null), 2500);
          } else {
            setFalseDefusalAlert('⚠️ FALSE DEFUSAL: 1 DEFUSAL KIT WASTED!');
            setTimeout(() => setFalseDefusalAlert(null), 2000);
          }
        }
      }

      setGrid([...grid]);
    },
    [
      gameStatus,
      grid,
      activeLevelConfig,
      defusalKits,
      defusalStreak,
      playerPos,
      upgrades.maxDefusalKits
    ]
  );

  // Rocket Jump execution
  const executeRocketJump = (targetX: number, targetY: number) => {
    if (jumpCharges <= 0) return;
    const { width, height } = activeLevelConfig;
    if (!isValid(targetX, targetY, width, height)) return;

    setJumpCharges((j) => j - 1);
    setStats((s) => ({ ...s, abilitiesUsed: s.abilitiesUsed + 1 }));
    setActiveTargetingAbility(null);

    // Vault jump
    setIsJumping(true);
    sounds.playJump();

    setTimeout(() => {
      setIsJumping(false);
      executeStep(targetX, targetY);
    }, 240);
  };

  // Defusal Drone execution
  const executeDroneDefusal = (targetX: number, targetY: number) => {
    if (droneCharges <= 0) return;
    const { width, height } = activeLevelConfig;
    if (!isValid(targetX, targetY, width, height)) return;

    setDroneCharges((d) => d - 1);
    setStats((s) => ({ ...s, abilitiesUsed: s.abilitiesUsed + 1 }));
    setActiveTargetingAbility(null);

    sounds.playDrone();
    const { wasMine } = applyDroneDefusal(grid, targetX, targetY, width, height);

    if (wasMine) {
      setDisarmedMinesCount((d) => d + 1);
      setStats((prev) => ({
        ...prev,
        totalMinesDefused: prev.totalMinesDefused + 1
      }));
    }

    setGrid([...grid]);
  };

  // Ability Selection
  const handleSelectAbility = (type: AbilityType) => {
    if (gameStatus !== 'playing') return;

    if (type === 'emp') {
      if (empCharges <= 0) return;
      setEmpCharges((e) => e - 1);
      setStats((s) => ({ ...s, abilitiesUsed: s.abilitiesUsed + 1 }));
      sounds.playEmp();

      setEmpEffectPos({ x: playerPos.x, y: playerPos.y });
      setTimeout(() => setEmpEffectPos(null), 600);

      const { disarmedMines } = applyEmpBlast(
        grid,
        playerPos.x,
        playerPos.y,
        activeLevelConfig.width,
        activeLevelConfig.height
      );

      if (disarmedMines > 0) {
        setDisarmedMinesCount((d) => d + disarmedMines);
        setStats((prev) => ({
          ...prev,
          totalMinesDefused: prev.totalMinesDefused + disarmedMines
        }));
      }

      setGrid([...grid]);
      const danger = calculateProximityDanger(playerPos, grid, activeLevelConfig.width, activeLevelConfig.height);
      setDangerIntensity(danger);
    } else if (type === 'sonar') {
      if (sonarCharges <= 0) return;
      setSonarCharges((s) => s - 1);
      setStats((s) => ({ ...s, abilitiesUsed: s.abilitiesUsed + 1 }));
      sounds.playSonar();

      setSonarEffectPos({ x: playerPos.x, y: playerPos.y });
      setTimeout(() => setSonarEffectPos(null), 800);

      applySonarScan(
        grid,
        playerPos.x,
        playerPos.y,
        upgrades.sonarRadius,
        activeLevelConfig.width,
        activeLevelConfig.height
      );

      setGrid([...grid]);
    } else if (type === 'jump') {
      if (jumpCharges <= 0) return;
      setActiveTargetingAbility(activeTargetingAbility === 'jump' ? null : 'jump');
    } else if (type === 'drone') {
      if (droneCharges <= 0) return;
      setActiveTargetingAbility(activeTargetingAbility === 'drone' ? null : 'drone');
    }
  };

  // Chord Action around player
  const handleChord = useCallback(() => {
    if (gameStatus !== 'playing') return;
    const { width, height } = activeLevelConfig;
    const result = chordReveal(grid, playerPos.x, playerPos.y, width, height);

    if (result.hitMine) {
      if (armor > 0) {
        sounds.playArmorDeflect();
        setArmor((a) => a - 1);
        if (result.minePos) {
          const mineCell = grid[result.minePos.y][result.minePos.x];
          mineCell.isMine = false;
          mineCell.state = 'disarmed';
        }
        setDisarmedMinesCount((d) => d + 1);
        setBombDetonationCue({
          active: true,
          wasFatal: false,
          x: result.minePos?.x ?? playerPos.x,
          y: result.minePos?.y ?? playerPos.y
        });
        setTimeout(() => setBombDetonationCue(null), 1800);
      } else {
        sounds.playExplosion();
        setGameStatus('lost');
        setBombDetonationCue({
          active: true,
          wasFatal: true,
          x: result.minePos?.x ?? playerPos.x,
          y: result.minePos?.y ?? playerPos.y
        });
        setShowSummary(true);
      }
    } else if (result.cellsRevealed > 0) {
      sounds.playCascade();
    }
    setGrid([...grid]);
  }, [gameStatus, activeLevelConfig, grid, playerPos, armor]);

  // Cell Click Handler
  const handleCellClick = (x: number, y: number) => {
    if (gameStatus !== 'playing') return;

    if (activeTargetingAbility === 'jump') {
      executeRocketJump(x, y);
      return;
    }

    if (activeTargetingAbility === 'drone') {
      executeDroneDefusal(x, y);
      return;
    }

    if (isFlagMode) {
      toggleFlag(x, y);
      return;
    }

    // If clicking player's current revealed cell -> chord action
    if (x === playerPos.x && y === playerPos.y) {
      handleChord();
      return;
    }

    // If cell is adjacent, step there!
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    if (dx <= 1 && dy <= 1) {
      executeStep(x, y);
    }
  };

  // Cell Right-click / Context menu
  const handleCellContextMenu = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFlag(x, y);
  };

  // Keyboard navigation & hotkeys (Arrow Keys & WASD fully supported)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'Escape') {
        setActiveTargetingAbility(null);
        setShowArmory(false);
        setShowIntel(false);
        setShowControls(false);
        setShowSandbox(false);
        setShowSummary(false);
        return;
      }

      if (gameStatus !== 'playing') return;

      // Abilities Hotkeys: 1, 2, 3, 4
      if (e.key === '1') {
        handleSelectAbility('emp');
        return;
      }
      if (e.key === '2') {
        handleSelectAbility('jump');
        return;
      }
      if (e.key === '3') {
        handleSelectAbility('sonar');
        return;
      }
      if (e.key === '4') {
        handleSelectAbility('drone');
        return;
      }

      // Flag toggle: F
      if (e.key === 'f' || e.key === 'F') {
        setIsFlagMode((prev) => !prev);
        return;
      }

      // Fog of War toggle: Z
      if (e.key === 'z' || e.key === 'Z') {
        setIsFogOfWar((prev) => !prev);
        return;
      }

      // Chord: Space
      if (e.key === ' ') {
        e.preventDefault();
        handleChord();
        return;
      }

      // Directional movement with Arrow Keys and WASD
      let dx = 0;
      let dy = 0;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        dy = -1;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        dy = 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        dx = -1;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        dx = 1;
      }

      if (dx !== 0 || dy !== 0) {
        const targetX = playerPos.x + dx;
        const targetY = playerPos.y + dy;

        if (activeTargetingAbility === 'jump') {
          executeRocketJump(playerPos.x + dx * 2, playerPos.y + dy * 2);
        } else {
          executeStep(targetX, targetY);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameStatus,
    playerPos,
    activeTargetingAbility,
    executeStep,
    handleSelectAbility,
    handleChord
  ]);

  // Calculate flags planted
  let flaggedCount = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.state === 'flagged') flaggedCount++;
    }
  }
  const minesRemaining = Math.max(0, activeLevelConfig.mineCount - flaggedCount);

  // Armory upgrade purchase handler
  const handleUpgradePurchase = (type: keyof UpgradesState, cost: number) => {
    if (stats.intelPoints < cost) return;

    setStats((prev) => ({
      ...prev,
      intelPoints: prev.intelPoints - cost
    }));

    setUpgrades((prev) => ({
      ...prev,
      [type]: (prev[type] as number) + 1
    }));
  };

  // Next level progression
  const handleNextLevel = () => {
    const nextIdx = currentLevelIndex + 1;
    if (nextIdx < CAMPAIGN_LEVELS.length) {
      setCurrentLevelIndex(nextIdx);
      initLevel(CAMPAIGN_LEVELS[nextIdx]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 3-Zone Top Navigation Contract */}
      <TopBar
        onOpenArmory={() => setShowArmory(true)}
        onOpenIntel={() => setShowIntel(true)}
        onOpenControls={() => setShowControls(true)}
        onOpenSandbox={() => setShowSandbox(true)}
        onStartEndless={initEndless}
        onDeployNewRun={() =>
          gameMode === 'endless' ? initEndless() : initLevel(activeLevelConfig)
        }
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        gameMode={gameMode}
      />

      {/* Main Game Screen */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Tactical HUD Header */}
        <HUD
          levelConfig={activeLevelConfig}
          playerY={playerPos.y}
          armor={armor}
          maxArmor={upgrades.maxArmor}
          minesRemaining={minesRemaining}
          totalMines={activeLevelConfig.mineCount}
          elapsedSeconds={elapsedSeconds}
          moveCount={moveCount}
          dangerIntensity={dangerIntensity}
          isFlagMode={isFlagMode}
          onToggleFlagMode={() => setIsFlagMode((prev) => !prev)}
          onResetLevel={() =>
            gameMode === 'endless' ? initEndless() : initLevel(activeLevelConfig)
          }
          isEndless={gameMode === 'endless'}
          endlessDistance={endlessDistance}
          collapseRow={collapseRow}
          defusedCount={disarmedMinesCount}
          defusalKits={defusalKits}
          maxDefusalKits={upgrades.maxDefusalKits ?? 4}
          defusalStreak={defusalStreak}
          isFogOfWar={isFogOfWar}
          onToggleFog={() => setIsFogOfWar((prev) => !prev)}
        />

        {/* Tactical Minefield Grid with Fog of War */}
        <MinefieldGrid
          grid={grid}
          width={activeLevelConfig.width}
          height={activeLevelConfig.height}
          playerPos={playerPos}
          playerDirection={playerDirection}
          isMoving={isMoving}
          hasArmor={armor > 0}
          isJumping={isJumping}
          activeTargetingAbility={activeTargetingAbility}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
          empEffectPos={empEffectPos}
          sonarEffectPos={sonarEffectPos}
          isEndless={gameMode === 'endless'}
          collapseRow={collapseRow}
          bombDetonationCue={bombDetonationCue}
          mudNotice={mudNotice}
          isFogOfWar={isFogOfWar}
          visionRange={upgrades.visionRange ?? 3.5}
          falseDefusalAlert={falseDefusalAlert}
          watchtowerNotice={watchtowerNotice}
          crateNotice={crateNotice}
        />

        {/* Ability Hotbar & Chording Footer */}
        <AbilityBar
          abilities={{
            empCharges,
            maxEmp: upgrades.maxEmp,
            jumpCharges,
            maxJumps: upgrades.maxJumps,
            sonarCharges,
            maxSonar: upgrades.maxSonar,
            droneCharges,
            maxDrones: upgrades.maxDrones
          }}
          activeTargetingAbility={activeTargetingAbility}
          onSelectAbility={handleSelectAbility}
          onCancelTargeting={() => setActiveTargetingAbility(null)}
          onChordAction={handleChord}
          disabled={gameStatus !== 'playing'}
        />
      </main>

      {/* Victory / Defeat Modal with Mission Accolades */}
      {showSummary && (
        <LevelSummaryModal
          status={gameStatus === 'won' ? 'won' : 'lost'}
          levelConfig={activeLevelConfig}
          elapsedSeconds={elapsedSeconds}
          moveCount={moveCount}
          disarmedMines={disarmedMinesCount}
          intelEarned={
            gameMode === 'endless'
              ? Math.floor(endlessDistance * 5) + disarmedMinesCount * 20
              : gameStatus === 'won'
              ? lastEarnedIntel
              : 15
          }
          isLastLevel={currentLevelIndex >= CAMPAIGN_LEVELS.length - 1}
          onNextLevel={handleNextLevel}
          onRestart={() =>
            gameMode === 'endless' ? initEndless() : initLevel(activeLevelConfig)
          }
          onClose={() => setShowSummary(false)}
          isEndless={gameMode === 'endless'}
          endlessDistance={endlessDistance}
          accolades={currentAccolades}
        />
      )}

      {/* Field Armory Modal */}
      {showArmory && (
        <ArmoryModal
          intelPoints={stats.intelPoints}
          upgrades={upgrades}
          onUpgrade={handleUpgradePurchase}
          onClose={() => setShowArmory(false)}
        />
      )}

      {/* Field Intel Dossier */}
      {showIntel && (
        <FieldIntelModal
          stats={stats}
          currentLevelIndex={currentLevelIndex}
          onSelectLevel={(idx) => {
            setCurrentLevelIndex(idx);
            initLevel(CAMPAIGN_LEVELS[idx]);
          }}
          onClose={() => setShowIntel(false)}
        />
      )}

      {/* Tactical Field Manual */}
      {showControls && (
        <HowToPlayModal onClose={() => setShowControls(false)} />
      )}

      {/* Custom Sandbox Simulator */}
      {showSandbox && (
        <CustomGameModal
          onStartCustomGame={(customConfig) => {
            setShowSandbox(false);
            initLevel(customConfig);
          }}
          onClose={() => setShowSandbox(false)}
        />
      )}
    </div>
  );
}
