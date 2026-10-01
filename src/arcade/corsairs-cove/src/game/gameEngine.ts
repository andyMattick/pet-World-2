import {
  GameState,
  PiratePlayer,
  Guard,
  Direction,
  ActivePowerUp,
  Particle,
  ScorePopup,
  TileType,
  PirateCharacter,
  MathConfig,
  Cannonball,
  PlacedKeg,
  AmbientSeaParticle,
  VaultLocation,
  VaultBeaconState,
  CaptainsLogEntry,
} from '../types';
import {
  GRID_COLS,
  GRID_ROWS,
  CHARACTERS,
  GAME_SPEEDS,
  POWERUP_DURATIONS,
  SCORES,
} from './constants';
import { parseMaze, isWalkablePirate, isWalkableGuard } from './mapData';
import { soundEngine } from '../audio/soundEngine';
import { DEFAULT_MATH_CONFIG, generateMathProblem } from './mathChallenge';
import {
  LEVEL_MATH_MILESTONES,
  STREAK_MILESTONES,
  savePersistedUnlockedHeroId,
  addLifetimeMathSolved,
  getAnswerSpeedReward,
  calculateLevelSpeedBounty,
} from './mathIncentives';
import { getLevelConfig } from './levelProgression';

export class GameEngine {
  public state: GameState;
  public tiles: TileType[][] = [];
  public pirate: PiratePlayer;
  public guards: Guard[] = [];
  public particles: Particle[] = [];
  public popups: ScorePopup[] = [];
  public cannonballs: Cannonball[] = [];
  public placedKegs: PlacedKeg[] = [];
  public ambientParticles: AmbientSeaParticle[] = [];
  public vaultBeaconTimer: number = 0;

  private popupIdCounter = 0;
  private projectileIdCounter = 0;
  private portalCooldown = 0;
  private modeTimer = 0;
  private currentMode: 'CHASE' | 'SCATTER' = 'SCATTER';
  private modeCycleIndex = 0;
  private deathTimer = 0;
  private levelClearTimer = 0;
  // Track coins that were dropped as a result of being shot by enemy cannonballs
  private droppedCoinTiles: Array<{ col: number; row: number }> = [];

  // Mode durations in ticks (60fps)
  private readonly SCATTER_TICKS = 60;
  private readonly CHASE_TICKS = 20 * 60;

  constructor(character: PirateCharacter = CHARACTERS[0]) {
    const highScore = this.loadHighScore();
    const mathConfig = this.loadMathConfig();
    this.state = {
      status: 'MENU',
      score: 0,
      highScore,
      level: 1,
      lives: 3,
      coinsRemaining: 0,
      totalCoins: 0,
      guardsDefeatedInGrog: 0,
      activePowers: [],
      selectedCharacter: character,
      soundEnabled: true,
      musicEnabled: true,
      powerUpsUsedCount: 0,
      mathProblemsSolved: 0,
      levelMathSolved: 0,
      levelMilestonesUnlocked: [],
      levelStartTime: Date.now(),
      levelElapsedTime: 0,
      doubleDoubloonRemaining: 0,
      currentMathStreak: 0,
      bestMathStreak: 0,
      unlockedMilestones: [],
      recentRewardNotification: null,
      levelClearSummary: null,
      mathChallenge: null,
      mathConfig,
      mathHistory: [],
      bonusItem: null,
      targetCoins: this.loadTargetCoins(),
      mapSeed: Math.floor(Math.random() * 1000000),
      hull: 2,
      maxHull: 2,
      cannonAmmo: 5,
      maxCannonAmmo: 5,
      kegAmmo: 2,
      maxKegAmmo: 2,
      windCharges: 2,
      maxWindCharges: 2,
      cloakCharges: 0,
      maxCloakCharges: 1,
      cloakUnlocked: false,
      carriedCoins: 0,
      bankedCoins: 0,
      captainsLog: [],
    };

    this.pirate = this.createPirate(character);
    this.initAmbientParticles();
    this.resetLevel(1);
  }

  private loadTargetCoins(): number {
    try {
      const saved = localStorage.getItem('corsairs_cove_target_coins');
      if (saved) {
        const val = parseInt(saved, 10);
        if ([100, 200, 350, 500].includes(val)) return val;
      }
    } catch {
      // ignore
    }
    return 200; // Balanced fun default instead of 500
  }

  public setTargetCoins(target: number) {
    this.state.targetCoins = target;
    try {
      localStorage.setItem('corsairs_cove_target_coins', String(target));
    } catch {
      // ignore
    }
    this.regenerateCurrentMap();
  }

  public regenerateCurrentMap(seed?: number) {
    const newSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
    this.state.mapSeed = newSeed;
    const { tiles, totalCoins } = parseMaze(this.state.level, newSeed, this.state.targetCoins || 200);
    this.tiles = tiles;
    this.state.totalCoins = totalCoins;
    this.state.coinsRemaining = totalCoins;
    this.cannonballs = [];
    this.placedKegs = [];
    this.resetPositions();
    soundEngine.playWhirlpool();
    this.spawnScorePopup(this.pirate.x * 20 + 10, this.pirate.y * 20 - 10, `🗺️ NEW ISLAND (#${newSeed % 10000})!`, '#38bdf8');
  }

  private loadHighScore(): number {
    try {
      const saved = localStorage.getItem('corsairs_cove_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  private saveHighScore(score: number) {
    try {
      localStorage.setItem('corsairs_cove_high_score', score.toString());
    } catch {
      // ignore
    }
  }

  private loadMathConfig(): MathConfig {
    try {
      const saved = localStorage.getItem('corsairs_cove_math_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          operations: Array.isArray(parsed.operations) && parsed.operations.length > 0 
            ? parsed.operations 
            : DEFAULT_MATH_CONFIG.operations,
          minLevel: typeof parsed.minLevel === 'number' ? parsed.minLevel : DEFAULT_MATH_CONFIG.minLevel,
          maxLevel: typeof parsed.maxLevel === 'number' ? parsed.maxLevel : DEFAULT_MATH_CONFIG.maxLevel,
          timedMode: typeof parsed.timedMode === 'boolean' ? parsed.timedMode : DEFAULT_MATH_CONFIG.timedMode,
          timeLimitSeconds: typeof parsed.timeLimitSeconds === 'number' ? parsed.timeLimitSeconds : DEFAULT_MATH_CONFIG.timeLimitSeconds,
        };
      }
    } catch {
      // fallback to default
    }
    return DEFAULT_MATH_CONFIG;
  }

  public setMathConfig(config: MathConfig) {
    this.state.mathConfig = config;
    try {
      localStorage.setItem('corsairs_cove_math_config', JSON.stringify(config));
    } catch {
      // ignore
    }
  }

  public clearMathHistory() {
    this.state.mathHistory = [];
  }

  public setCharacter(char: PirateCharacter) {
    this.state.selectedCharacter = char;
    this.pirate.characterId = char.id;
    this.updatePirateSpeed();
  }

  private updatePirateSpeed() {
    const hasSpeedPower = this.state.activePowers.some(p => p.type === 'SPEED');
    const charBonus = this.state.selectedCharacter.perkType === 'SPEED' ? 1.1 : 1.0;
    if (hasSpeedPower) {
      this.pirate.speed = GAME_SPEEDS.PIRATE_SPEED_BOOST * charBonus;
    } else {
      this.pirate.speed = GAME_SPEEDS.PIRATE_BASE * charBonus;
    }
  }

  private createPirate(character: PirateCharacter): PiratePlayer {
    const charBonus = character.perkType === 'SPEED' ? 1.1 : 1.0;
    return {
      x: 13.5,
      y: 23,
      gridCol: 13,
      gridRow: 23,
      dir: 'LEFT',
      nextDir: 'LEFT',
      speed: GAME_SPEEDS.PIRATE_BASE * charBonus,
      mouthAngle: 0.25,
      mouthDir: 1,
      characterId: character.id,
      isMoving: false,
      walkFrame: 0,
      collectGoldTimer: 0,
      collectGoldFrame: 0,
      totalGoldCollected: 0,
      cannonAmmo: 5,
      maxCannonAmmo: 5,
      kegAmmo: 2,
      maxKegAmmo: 2,
      windCharges: 2,
      maxWindCharges: 2,
      cloakCharges: 0,
      maxCloakCharges: 1,
      cloakUnlocked: false,
      carriedCoins: 0,
      bankedCoins: 0,
      shootCooldown: 0,
      hull: 2,
      maxHull: 2,
    };
  }

  public syncPirateToState() {
    if (!this.pirate) return;
    this.state.hull = this.pirate.hull;
    this.state.maxHull = this.pirate.maxHull;
    this.state.cannonAmmo = this.pirate.cannonAmmo;
    this.state.maxCannonAmmo = this.pirate.maxCannonAmmo;
    this.state.kegAmmo = this.pirate.kegAmmo;
    this.state.maxKegAmmo = this.pirate.maxKegAmmo;
    this.state.windCharges = this.pirate.windCharges;
    this.state.maxWindCharges = this.pirate.maxWindCharges;
    this.state.cloakCharges = this.pirate.cloakCharges;
    this.state.maxCloakCharges = this.pirate.maxCloakCharges;
    this.state.cloakUnlocked = this.pirate.cloakUnlocked;
    this.state.carriedCoins = this.pirate.carriedCoins;
    this.state.bankedCoins = this.pirate.bankedCoins;
  }

  private createGuards(): Guard[] {
    return [
      {
        id: 'sterling',
        name: 'Captain Sterling (Fort Sterling)',
        rank: 'Royal Fleet Admiral',
        personality: 'CHASER',
        color: '#dc2626', // Scarlet Red
        frightenedColor: '#2563eb',
        x: 13,
        y: 3,
        gridCol: 13,
        gridRow: 3,
        dir: 'DOWN',
        nextDir: 'DOWN',
        targetCol: 13,
        targetRow: 23,
        speed: GAME_SPEEDS.GUARD_NORMAL,
        state: 'SCATTER',
        homeCorner: { col: 13, row: 1 },
        penPosition: { col: 13, row: 3 },
        penTimer: 0, // Deploys immediately from North Naval Bastion
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 120 + Math.random() * 120,
      },
      {
        id: 'hastings',
        name: 'Lt. Hastings (NE Fort Port)',
        rank: 'Tactical Officer',
        personality: 'AMBUSHER',
        color: '#f43f5e', // Rose/Pink
        frightenedColor: '#2563eb',
        x: 24,
        y: 5,
        gridCol: 24,
        gridRow: 5,
        dir: 'LEFT',
        nextDir: 'LEFT',
        targetCol: 2,
        targetRow: 0,
        speed: GAME_SPEEDS.GUARD_NORMAL,
        state: 'IN_PEN',
        homeCorner: { col: 25, row: 1 },
        penPosition: { col: 24, row: 5 },
        penTimer: 10, // Deploys shortly after the first ship
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 160 + Math.random() * 120,
      },
      {
        id: 'omalley',
        name: 'Sgt. O\'Malley (NW Redoubt)',
        rank: 'Highland Guard',
        personality: 'FLANKER',
        color: '#06b6d4', // Cyan
        frightenedColor: '#2563eb',
        x: 4,
        y: 5,
        gridCol: 4,
        gridRow: 5,
        dir: 'RIGHT',
        nextDir: 'RIGHT',
        targetCol: 27,
        targetRow: 30,
        speed: GAME_SPEEDS.GUARD_NORMAL,
        state: 'IN_PEN',
        homeCorner: { col: 2, row: 1 },
        penPosition: { col: 4, row: 5 },
        penTimer: 20, // Deploys from North-West Fort
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 180 + Math.random() * 120,
      },
      {
        id: 'hawke',
        name: 'Commander Hawke (East Battery)',
        rank: 'Royal Man-of-War',
        personality: 'CHASER',
        color: '#8b5cf6', // Royal Purple
        frightenedColor: '#2563eb',
        x: 24,
        y: 13,
        gridCol: 24,
        gridRow: 13,
        dir: 'LEFT',
        nextDir: 'LEFT',
        targetCol: 13,
        targetRow: 10,
        speed: GAME_SPEEDS.GUARD_NORMAL * 1.04,
        state: 'IN_PEN',
        homeCorner: { col: 26, row: 14 },
        penPosition: { col: 24, row: 13 },
        penTimer: 30, // Deploys from East Harbor Battery
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 140 + Math.random() * 120,
      },
      {
        id: 'drake',
        name: 'Captain Drake (SE Citadel)',
        rank: 'Navy Ironclad',
        personality: 'AMBUSHER',
        color: '#059669', // Emerald Green
        frightenedColor: '#2563eb',
        x: 23,
        y: 24,
        gridCol: 23,
        gridRow: 24,
        dir: 'UP',
        nextDir: 'UP',
        targetCol: 20,
        targetRow: 23,
        speed: GAME_SPEEDS.GUARD_NORMAL * 1.02,
        state: 'IN_PEN',
        homeCorner: { col: 26, row: 29 },
        penPosition: { col: 23, row: 24 },
        penTimer: 40, // Deploys from South-East Island Citadel
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 200 + Math.random() * 120,
      },
      {
        id: 'higgins',
        name: 'Officer Higgins (SW Outpost)',
        rank: 'Harbor Sentry',
        personality: 'PATROLLER',
        color: '#f97316', // Orange
        frightenedColor: '#2563eb',
        x: 4,
        y: 24,
        gridCol: 4,
        gridRow: 24,
        dir: 'UP',
        nextDir: 'UP',
        targetCol: 0,
        targetRow: 30,
        speed: GAME_SPEEDS.GUARD_NORMAL,
        state: 'IN_PEN',
        homeCorner: { col: 1, row: 29 },
        penPosition: { col: 4, row: 24 },
        penTimer: 50, // Deploys from South-West Island Outpost
        frightenedTimer: 0,
        returnTimer: 0,
        shootCooldown: 220 + Math.random() * 120,
      },
    ];
  }

  public resetLevel(level: number = 1) {
    const seed = Math.floor(Math.random() * 1000000);
    this.state.mapSeed = seed;
    const targetCoins = this.state.targetCoins || 200;
    const { tiles, totalCoins } = parseMaze(level, seed, targetCoins);
    this.tiles = tiles;
    this.state.level = level;
    this.state.totalCoins = totalCoins;
    this.state.coinsRemaining = totalCoins;
    this.state.activePowers = [];
    this.state.bonusItem = null;
    this.state.levelMathSolved = 0;
    this.state.levelMilestonesUnlocked = [];
    this.state.levelStartTime = Date.now();
    this.state.levelElapsedTime = 0;
    this.state.doubleDoubloonRemaining = 0;
    this.state.levelClearSummary = null;
    this.particles = [];
    this.popups = [];
    this.cannonballs = [];
    this.placedKegs = [];
    this.portalCooldown = 0;
    this.droppedCoinTiles = [];
    this.resetPositions();
  }

  public resetPositions() {
    this.pirate = this.createPirate(this.state.selectedCharacter);
    this.state.hull = this.pirate.hull;
    this.state.maxHull = this.pirate.maxHull;
    this.guards = this.createGuards();
    this.modeTimer = 0;
    this.currentMode = 'SCATTER';
    this.modeCycleIndex = 0;
    this.state.guardsDefeatedInGrog = 0;
  }

  public startNewGame() {
    this.state.score = 0;
    // Hypatia perk: +1 starting life
    const bonusLives = this.state.selectedCharacter.id === 'hypatia_navigator' ? 1 : 0;
    this.state.lives = 3 + bonusLives;
    this.state.powerUpsUsedCount = 0;
    this.state.mathProblemsSolved = 0;
    this.state.levelMathSolved = 0;
    this.state.levelMilestonesUnlocked = [];
    this.state.levelStartTime = Date.now();
    this.state.levelElapsedTime = 0;
    this.state.doubleDoubloonRemaining = 0;
    this.state.levelClearSummary = null;
    this.state.currentMathStreak = 0;
    this.state.bestMathStreak = 0;
    this.state.unlockedMilestones = [];
    this.state.recentRewardNotification = null;
    this.state.mathChallenge = null;
    this.state.mathHistory = [];
    this.resetLevel(1);
    this.state.status = 'COUNTDOWN';
    setTimeout(() => {
      if (this.state.status === 'COUNTDOWN') {
        this.state.status = 'PLAYING';
      }
    }, 1800);
  }

  public advanceToNextLevel() {
    if (this.state.status !== 'LEVEL_CLEAR') return;
    const nextLevel = this.state.level + 1;
    this.resetLevel(nextLevel);
    this.state.status = 'COUNTDOWN';
    soundEngine.playClick();
    setTimeout(() => {
      if (this.state.status === 'COUNTDOWN') {
        this.state.status = 'PLAYING';
      }
    }, 1800);
  }

  public handleInputDirection(dir: Direction) {
    if (this.state.status !== 'PLAYING') return;
    this.pirate.nextDir = dir;
  }

  public togglePause() {
    if (this.state.status === 'PLAYING') {
      this.state.status = 'PAUSED';
      soundEngine.playClick();
    } else if (this.state.status === 'PAUSED') {
      this.state.status = 'PLAYING';
      soundEngine.playClick();
    }
  }

  public toggleSound(): boolean {
    const nextVal = !this.state.soundEnabled;
    this.state.soundEnabled = nextVal;
    soundEngine.setEnabled(nextVal);
    return nextVal;
  }

  public update(deltaMs: number) {
    // Continuously advance beacon timer so mini-map and world beacons stay alive and synchronized
    this.vaultBeaconTimer += deltaMs;

    if (
      this.state.status === 'PAUSED' || 
      this.state.status === 'MENU' || 
      this.state.status === 'GAME_OVER' ||
      this.state.status === 'POWERUP_CHALLENGE'
    ) {
      this.updateAmbientParticles(deltaMs);
      return;
    }

    if (this.state.status === 'COUNTDOWN') {
      this.updateAmbientParticles(deltaMs);
      return;
    }

    if (this.state.status === 'DIED') {
      this.deathTimer += deltaMs;
      this.updateAmbientParticles(deltaMs);
      this.updateParticles();
      if (this.deathTimer > 1800) {
        if (this.state.lives > 0) {
          this.resetPositions();
          this.state.status = 'PLAYING';
        } else {
          this.state.status = 'GAME_OVER';
        }
      }
      return;
    }

    if (this.state.status === 'LEVEL_CLEAR') {
      this.levelClearTimer += deltaMs;
      this.updateAmbientParticles(deltaMs);
      this.updateParticles();
      this.updatePopups();
      // Auto-advance after 12 seconds if player does not click button
      if (this.levelClearTimer > 12000) {
        this.advanceToNextLevel();
      }
      return;
    }

    if (this.state.status === 'PLAYING') {
      this.state.levelElapsedTime = Math.max(1, Math.round((Date.now() - this.state.levelStartTime) / 1000));
    }

    // 0. Update ambient sea spray, bubbles and water sparkle particles
    this.updateAmbientParticles(deltaMs);

    // Update cooldown timers
    if (this.portalCooldown > 0) {
      this.portalCooldown = Math.max(0, this.portalCooldown - deltaMs);
    }
    if (this.pirate.shootCooldown > 0) {
      this.pirate.shootCooldown = Math.max(0, this.pirate.shootCooldown - deltaMs);
    }

    // 1. Update active power-ups
    this.updateActivePowers(deltaMs);

    // 2. Update Mode Timer (Scatter vs Chase)
    this.updateModeTimer();

    // 3. Update Pirate Movement & Animation
    this.updatePirate(deltaMs);

    // 4. Update Cannonballs & Powder Kegs
    this.updateCannonballs(deltaMs);
    this.updatePlacedKegs(deltaMs);

    // 5. Update Guards Movement & AI
    this.updateGuards();

    // 6. Check Collisions (Coins, Powers, Guards, Chest, Vault, Whirlpool, Ammo Depot)
    this.checkTileCollisions();
    this.checkGuardCollisions();
    this.checkBonusItem(deltaMs);

    // 7. Update visual effects
    this.updateParticles();
    this.updatePopups();

    // 7. Auto-dismiss reward notification after 3.5 seconds
    if (this.state.recentRewardNotification && (Date.now() - this.state.recentRewardNotification.timestamp > 3500)) {
      this.state.recentRewardNotification = null;
    }
  }

  private updateActivePowers(deltaMs: number) {
    const prevPowers = [...this.state.activePowers];
    this.state.activePowers = this.state.activePowers
      .map(p => ({ ...p, remainingMs: p.remainingMs - deltaMs }))
      .filter(p => p.remainingMs > 0);

    // If speed power just expired, revert pirate speed
    const hadSpeed = prevPowers.some(p => p.type === 'SPEED');
    const hasSpeed = this.state.activePowers.some(p => p.type === 'SPEED');
    if (hadSpeed !== hasSpeed) {
      this.updatePirateSpeed();
    }
  }

  private updateModeTimer() {
    // If any grog is active, frightened handles guard mode
    const hasGrog = this.state.activePowers.some(p => p.type === 'GROG');
    if (hasGrog) return;

    this.modeTimer++;
    const target = this.currentMode === 'SCATTER' ? this.SCATTER_TICKS : this.CHASE_TICKS;
    if (this.modeTimer >= target) {
      this.modeTimer = 0;
      this.currentMode = this.currentMode === 'SCATTER' ? 'CHASE' : 'SCATTER';
      for (const g of this.guards) {
        if (g.state === 'CHASE' || g.state === 'SCATTER') {
          g.state = this.currentMode;
          // Reverse direction on mode switch like authentic Pac-Man
          g.dir = this.getOppositeDirection(g.dir);
        }
      }
    }
  }

  private updatePirate(deltaMs: number = 16.6) {
    const p = this.pirate;

    // Countdown gold collection celebration animation timer
    if (p.collectGoldTimer > 0) {
      p.collectGoldTimer = Math.max(0, p.collectGoldTimer - deltaMs);
      p.collectGoldFrame = Math.floor((300 - p.collectGoldTimer) / 75) % 4;
    }

    // Animated mouth
    p.mouthAngle += 0.04 * p.mouthDir;
    if (p.mouthAngle > 0.5) p.mouthDir = -1;
    if (p.mouthAngle < 0.05) p.mouthDir = 1;

    // Check if we can turn in nextDir
    if (p.nextDir !== p.dir && p.nextDir !== 'NONE') {
      if (this.canTurn(p.x, p.y, p.nextDir)) {
        p.dir = p.nextDir;
        // Snap perpendicular coordinate to center of tile
        if (p.dir === 'UP' || p.dir === 'DOWN') {
          p.x = Math.round(p.x);
        } else {
          p.y = Math.round(p.y);
        }
      }
    }

    // Move in current direction if path is clear
    const vx = p.dir === 'LEFT' ? -1 : p.dir === 'RIGHT' ? 1 : 0;
    const vy = p.dir === 'UP' ? -1 : p.dir === 'DOWN' ? 1 : 0;
    let actuallyMoved = false;

    if (vx !== 0 || vy !== 0) {
      const nextX = p.x + vx * p.speed;
      const nextY = p.y + vy * p.speed;

      // Wrap around tunnel at row 14
      if (Math.round(p.y) === 14) {
        if (nextX < -0.5) {
          p.x = GRID_COLS - 1;
          p.gridCol = GRID_COLS - 1;
          p.gridRow = 14;
          return;
        } else if (nextX > GRID_COLS - 0.5) {
          p.x = 0;
          p.gridCol = 0;
          p.gridRow = 14;
          return;
        }
      }

      // Check wall collision
      const checkCol = vx > 0 ? Math.floor(nextX + 0.5) : Math.ceil(nextX - 0.5);
      const checkRow = vy > 0 ? Math.floor(nextY + 0.5) : Math.ceil(nextY - 0.5);

      if (isWalkablePirate(checkCol, checkRow, this.tiles)) {
        p.x = nextX;
        p.y = nextY;
        actuallyMoved = true;
      } else {
        // Stop at center of tile
        if (vx !== 0) p.x = Math.round(p.x);
        if (vy !== 0) p.y = Math.round(p.y);
      }
    }

    p.isMoving = actuallyMoved;
    if (actuallyMoved) {
      // 8-frame walking stride animation cycle (advancing smoothly during movement)
      p.walkFrame = (p.walkFrame + deltaMs * 0.012) % 8;
    } else {
      p.walkFrame = 0;
    }

    p.gridCol = Math.round(p.x);
    p.gridRow = Math.round(p.y);

    // Water wake spray behind boat when sailing
    if (Math.random() < 0.25) {
      this.particles.push({
        x: p.x * 20 + 10,
        y: p.y * 20 + 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 1.5,
        color: 'rgba(255, 255, 255, 0.5)',
        alpha: 0.5,
        decay: 0.05,
      });
    }

    // Speed boost particle trail
    if (this.state.activePowers.some(pow => pow.type === 'SPEED') && Math.random() < 0.4) {
      this.particles.push({
        x: p.x * 20 + 10,
        y: p.y * 20 + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2.5 + Math.random() * 2,
        color: '#38bdf8',
        alpha: 0.7,
        decay: 0.05,
      });
    }
  }

  private canTurn(x: number, y: number, dir: Direction): boolean {
    const rx = Math.round(x);
    const ry = Math.round(y);
    const dist = Math.abs(x - rx) + Math.abs(y - ry);
    // Allow turning when close enough to tile center
    if (dist > 0.4) return false;

    let targetCol = rx;
    let targetRow = ry;
    if (dir === 'UP') targetRow -= 1;
    if (dir === 'DOWN') targetRow += 1;
    if (dir === 'LEFT') targetCol -= 1;
    if (dir === 'RIGHT') targetCol += 1;

    return isWalkablePirate(targetCol, targetRow, this.tiles);
  }

  private updateGuards() {
    const p = this.pirate;
    const isPirateInvisible = this.state.activePowers.some(pow => pow.type === 'INVISIBILITY');

    for (const g of this.guards) {
      // 1. Island Naval Base Harbor Handling (at anchor before deployment)
      if (g.state === 'IN_PEN') {
        g.penTimer--;
        // Rocking at anchor at its island naval base harbor
        g.x = g.penPosition.col;
        g.y = g.penPosition.row + Math.sin(Date.now() * 0.005 + g.penPosition.col) * 0.03;
        if (g.penTimer <= 0) {
          // Deploy directly into the sea from its island naval port!
          g.state = this.currentMode;
          g.x = g.penPosition.col;
          g.y = g.penPosition.row;
          g.gridCol = Math.round(g.x);
          g.gridRow = Math.round(g.y);
          g.speed = GAME_SPEEDS.GUARD_NORMAL;
          soundEngine.playGuardRevived();
        }
        continue;
      }

      if (g.state === 'EXITING_PEN') {
        // Direct deployment from island harbor
        g.state = this.currentMode;
        g.speed = g.state === 'CHASE' ? GAME_SPEEDS.GUARD_CHASE : GAME_SPEEDS.GUARD_NORMAL;
        continue;
      }

      // 2. Returning to Island Naval Base (Defeated Warships returning for repairs)
      if (g.state === 'RETURNING') {
        g.returnTimer = (g.returnTimer || 0) + 1;
        const distToBase = Math.hypot(g.x - g.penPosition.col, g.y - g.penPosition.row);
        const hasTimedOut = g.returnTimer > 400; // 6.5s fail-safe ensures no ship is ever stranded

        if (distToBase <= 1.2 || hasTimedOut) {
          // Safely docked at its home island naval base harbor! Repair and re-deploy
          g.x = g.penPosition.col;
          g.y = g.penPosition.row;
          g.gridCol = Math.round(g.x);
          g.gridRow = Math.round(g.y);
          g.state = 'IN_PEN';
          g.penTimer = 45; // brief repairs at naval base before redeploying
          g.returnTimer = 0;
          g.speed = GAME_SPEEDS.GUARD_NORMAL;
          soundEngine.playGuardRevived();
          continue;
        }

        // Guide ship path back to its island naval base
        g.speed = GAME_SPEEDS.GUARD_RETURNING;
        g.targetCol = Math.round(g.penPosition.col);
        g.targetRow = Math.round(g.penPosition.row);
      } else if (g.state === 'FRIGHTENED') {
        g.speed = GAME_SPEEDS.GUARD_FRIGHTENED;
        g.frightenedTimer -= 16.6;
        if (g.frightenedTimer <= 0) {
          g.state = this.currentMode;
        }
      } else {
        // Normal Chase or Scatter
        g.speed = g.state === 'CHASE' ? GAME_SPEEDS.GUARD_CHASE : GAME_SPEEDS.GUARD_NORMAL;
        if (g.state === 'SCATTER') {
          g.targetCol = g.homeCorner.col;
          g.targetRow = g.homeCorner.row;
        } else {
          // Chase Mode AI logic per personality
          if (isPirateInvisible) {
            // Guards are bewildered by pirate mist! Target random wanders
            g.targetCol = Math.floor(Math.random() * GRID_COLS);
            g.targetRow = Math.floor(Math.random() * GRID_ROWS);
          } else {
            this.setGuardChaseTarget(g, p);
          }
        }
      }

      // Move Guard along grid
      this.moveGuardAlongGrid(g);

      // 4. Enemy Ship Broadside Cannon Shooting AI:
      // Navy warships fire red cannonballs when player is in their corridor line-of-sight
      if (g.shootCooldown && g.shootCooldown > 0) {
        g.shootCooldown--;
      }
      if (
        (!g.shootCooldown || g.shootCooldown <= 0) &&
        (g.state === 'CHASE' || g.state === 'SCATTER') &&
        this.state.status === 'PLAYING' &&
        !isPirateInvisible
      ) {
        const shotDir = this.getGuardLineOfSightToPirate(g, p);
        if (shotDir) {
          g.shootCooldown = 180 + Math.random() * 150; // ~3-5.5 sec cooldown
          this.cannonballs.push({
            id: ++this.projectileIdCounter,
            x: g.x,
            y: g.y,
            vx: shotDir.vx * 0.19,
            vy: shotDir.vy * 0.19,
            distanceTraveled: 0,
            maxDistance: 8.5,
            isEnemy: true,
          });
          soundEngine.playCannonFire();

          // Muzzle flash particles
          for (let k = 0; k < 6; k++) {
            this.particles.push({
              x: g.x * 20 + 10,
              y: g.y * 20 + 10,
              vx: (Math.random() - 0.5) * 2 + shotDir.vx * 1.5,
              vy: (Math.random() - 0.5) * 2 + shotDir.vy * 1.5,
              size: 3,
              color: '#ef4444',
              alpha: 1,
              decay: 0.08,
            });
          }
        }
      }
    }
  }

  // Line-of-sight check: checks if guard and player share a clear corridor within 7.5 tiles
  private getGuardLineOfSightToPirate(g: Guard, p: PiratePlayer): { vx: number; vy: number } | null {
    const gx = Math.round(g.x);
    const gy = Math.round(g.y);
    const px = Math.round(p.x);
    const py = Math.round(p.y);

    // Horizontal alignment
    if (gy === py) {
      const dist = Math.abs(px - gx);
      if (dist >= 1 && dist <= 7) {
        const step = px > gx ? 1 : -1;
        let clear = true;
        for (let c = gx + step; c !== px; c += step) {
          if (this.tiles[gy]?.[c] === 'WALL' || this.tiles[gy]?.[c] === 'GATE') {
            clear = false;
            break;
          }
        }
        if (clear) return { vx: step, vy: 0 };
      }
    }

    // Vertical alignment
    if (gx === px) {
      const dist = Math.abs(py - gy);
      if (dist >= 1 && dist <= 7) {
        const step = py > gy ? 1 : -1;
        let clear = true;
        for (let r = gy + step; r !== py; r += step) {
          if (this.tiles[r]?.[gx] === 'WALL' || this.tiles[r]?.[gx] === 'GATE') {
            clear = false;
            break;
          }
        }
        if (clear) return { vx: 0, vy: step };
      }
    }

    return null;
  }

  private setGuardChaseTarget(g: Guard, p: PiratePlayer) {
    switch (g.personality) {
      case 'CHASER': // Sterling: Targets pirate directly
        g.targetCol = p.gridCol;
        g.targetRow = p.gridRow;
        break;

      case 'AMBUSHER': // Hastings: Targets 4 tiles ahead of pirate
        let tx = p.gridCol;
        let ty = p.gridRow;
        if (p.dir === 'UP') { ty -= 4; tx -= 4; } // Authentic Pac-Man overflow quirk
        else if (p.dir === 'DOWN') ty += 4;
        else if (p.dir === 'LEFT') tx -= 4;
        else if (p.dir === 'RIGHT') tx += 4;
        g.targetCol = tx;
        g.targetRow = ty;
        break;

      case 'FLANKER': { // O'Malley: Vector between Sterling and 2 ahead of pirate doubled
        const blinky = this.guards.find(guard => guard.id === 'sterling');
        let ax = p.gridCol;
        let ay = p.gridRow;
        if (p.dir === 'UP') ay -= 2;
        else if (p.dir === 'DOWN') ay += 2;
        else if (p.dir === 'LEFT') ax -= 2;
        else if (p.dir === 'RIGHT') ax += 2;

        if (blinky) {
          const vx = ax - blinky.gridCol;
          const vy = ay - blinky.gridRow;
          g.targetCol = ax + vx;
          g.targetRow = ay + vy;
        } else {
          g.targetCol = ax;
          g.targetRow = ay;
        }
        break;
      }

      case 'PATROLLER': { // Higgins: Targets pirate if > 8 tiles away; retreats if closer
        const dist = Math.hypot(g.gridCol - p.gridCol, g.gridRow - p.gridRow);
        if (dist > 8) {
          g.targetCol = p.gridCol;
          g.targetRow = p.gridRow;
        } else {
          g.targetCol = g.homeCorner.col;
          g.targetRow = g.homeCorner.row;
        }
        break;
      }
    }
  }

  private moveGuardAlongGrid(g: Guard) {
    const rx = Math.round(g.x);
    const ry = Math.round(g.y);

    const vx = g.dir === 'LEFT' ? -1 : g.dir === 'RIGHT' ? 1 : 0;
    const vy = g.dir === 'UP' ? -1 : g.dir === 'DOWN' ? 1 : 0;

    // Check if the guard reaches or crosses the tile center in this frame
    let reachedCenter = false;
    if (vx > 0) {
      if ((g.x <= rx && g.x + vx * g.speed >= rx) || Math.abs(g.x - rx) < g.speed * 0.6) {
        reachedCenter = true;
      }
    } else if (vx < 0) {
      if ((g.x >= rx && g.x + vx * g.speed <= rx) || Math.abs(g.x - rx) < g.speed * 0.6) {
        reachedCenter = true;
      }
    } else if (vy > 0) {
      if ((g.y <= ry && g.y + vy * g.speed >= ry) || Math.abs(g.y - ry) < g.speed * 0.6) {
        reachedCenter = true;
      }
    } else if (vy < 0) {
      if ((g.y >= ry && g.y + vy * g.speed <= ry) || Math.abs(g.y - ry) < g.speed * 0.6) {
        reachedCenter = true;
      }
    } else {
      reachedCenter = true;
    }

    if (reachedCenter) {
      g.x = rx;
      g.y = ry;
      g.gridCol = rx;
      g.gridRow = ry;

      // Pick next direction at tile center
      const nextDir = this.chooseNextGuardDirection(g);
      g.dir = nextDir;
    }

    // Move in chosen direction
    const nvx = g.dir === 'LEFT' ? -1 : g.dir === 'RIGHT' ? 1 : 0;
    const nvy = g.dir === 'UP' ? -1 : g.dir === 'DOWN' ? 1 : 0;

    const nextX = g.x + nvx * g.speed;
    const nextY = g.y + nvy * g.speed;

    // Wrap around tunnel
    if (Math.round(g.y) === 14) {
      if (nextX < -0.5) {
        g.x = GRID_COLS - 1;
        g.y = 14;
        g.gridCol = GRID_COLS - 1;
        g.gridRow = 14;
        return;
      } else if (nextX > GRID_COLS - 0.5) {
        g.x = 0;
        g.y = 14;
        g.gridCol = 0;
        g.gridRow = 14;
        return;
      }
    }

    // Ensure guard stays in walkable bounds
    const checkCol = nvx > 0 ? Math.floor(nextX + 0.5) : Math.ceil(nextX - 0.5);
    const checkRow = nvy > 0 ? Math.floor(nextY + 0.5) : Math.ceil(nextY - 0.5);
    const canPassGate = g.state === 'RETURNING';

    if (isWalkableGuard(checkCol, checkRow, this.tiles, canPassGate)) {
      g.x = nextX;
      g.y = nextY;
      g.gridCol = Math.round(g.x);
      g.gridRow = Math.round(g.y);
    } else {
      g.x = rx;
      g.y = ry;
      g.gridCol = rx;
      g.gridRow = ry;
      // A blocked heading can leave a ship bouncing between two tiles. Pick a
      // legal escape turn, allowing a reverse only when it is the way out.
      const blockedDir = g.dir;
      g.dir = this.chooseNextGuardDirection({ ...g, dir: this.getOppositeDirection(blockedDir) });
    }
  }

  private chooseNextGuardDirection(g: Guard): Direction {
    const col = g.gridCol;
    const row = g.gridRow;
    const opposite = this.getOppositeDirection(g.dir);

    const candidates: Direction[] = ['UP', 'LEFT', 'DOWN', 'RIGHT'];
    const validMoves: { dir: Direction; col: number; row: number }[] = [];
    const canPassGate = g.state === 'RETURNING';

    for (const dir of candidates) {
      // Cannot immediately turn 180 degrees backwards at intersection
      if (dir === opposite && g.state !== 'FRIGHTENED') continue;

      let nc = col;
      let nr = row;
      if (dir === 'UP') nr -= 1;
      if (dir === 'DOWN') nr += 1;
      if (dir === 'LEFT') nc -= 1;
      if (dir === 'RIGHT') nc += 1;

      if (nr === 14 && nc < 0) nc = GRID_COLS - 1;
      else if (nr === 14 && nc >= GRID_COLS) nc = 0;

      if (isWalkableGuard(nc, nr, this.tiles, canPassGate)) {
        validMoves.push({ dir, col: nc, row: nr });
      }
    }

    if (validMoves.length === 0) {
      return opposite; // Fallback
    }

    if (g.state === 'FRIGHTENED') return validMoves[Math.floor(Math.random() * validMoves.length)].dir;

    // Follow actual walkable paths so guards do not repeatedly steer into walls.
    let targetCol = Math.max(0, Math.min(GRID_COLS - 1, Math.round(g.targetCol)));
    let targetRow = Math.max(0, Math.min(GRID_ROWS - 1, Math.round(g.targetRow)));
    if (!isWalkableGuard(targetCol, targetRow, this.tiles, canPassGate)) {
      let nearest = Infinity;
      for (let r = 0; r < GRID_ROWS; r++) for (let c = 0; c < GRID_COLS; c++) {
        if (!isWalkableGuard(c, r, this.tiles, canPassGate)) continue;
        const distance = Math.abs(c - targetCol) + Math.abs(r - targetRow);
        if (distance < nearest) { nearest = distance; targetCol = c; targetRow = r; }
      }
    }

    const distances = Array.from({length: GRID_ROWS}, () => Array<number>(GRID_COLS).fill(Infinity));
    const queue: {col: number; row: number}[] = [{col: targetCol, row: targetRow}];
    distances[targetRow][targetCol] = 0;
    for (let head = 0; head < queue.length; head++) {
      const here = queue[head], nextDistance = distances[here.row][here.col] + 1;
      for (const dir of candidates) {
        let nc = here.col, nr = here.row;
        if (dir === 'UP') nr--;
        if (dir === 'DOWN') nr++;
        if (dir === 'LEFT') nc--;
        if (dir === 'RIGHT') nc++;
        if (nr === 14 && nc < 0) nc = GRID_COLS - 1;
        else if (nr === 14 && nc >= GRID_COLS) nc = 0;
        if (nc < 0 || nc >= GRID_COLS || nr < 0 || nr >= GRID_ROWS || distances[nr][nc] !== Infinity) continue;
        if (!isWalkableGuard(nc, nr, this.tiles, canPassGate)) continue;
        distances[nr][nc] = nextDistance;
        queue.push({col: nc, row: nr});
      }
    }

    validMoves.sort((a, b) => distances[a.row][a.col] - distances[b.row][b.col]);
    return validMoves[0].dir;
  }

  private getOppositeDirection(dir: Direction): Direction {
    switch (dir) {
      case 'UP': return 'DOWN';
      case 'DOWN': return 'UP';
      case 'LEFT': return 'RIGHT';
      case 'RIGHT': return 'LEFT';
      default: return 'NONE';
    }
  }

  private checkTileCollisions() {
    const p = this.pirate;
    const c = p.gridCol;
    const r = p.gridRow;

    if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) return;

    const tile = this.tiles[r]?.[c];
    if (!tile || tile === 'EMPTY' || tile === 'WALL' || tile === 'GATE') return;

    if (tile === 'COIN') {
      this.tiles[r][c] = 'EMPTY';
      this.state.coinsRemaining--;
      // If collected coin was dropped from enemy fire, remove from tracking
      this.droppedCoinTiles = this.droppedCoinTiles.filter(t => !(t.col === c && t.row === r));
      // Trigger sprite gold collection celebration animation
      p.collectGoldTimer = 300;
      p.collectGoldFrame = 0;
      p.totalGoldCollected = (p.totalGoldCollected || 0) + 1;
      p.carriedCoins = (p.carriedCoins || 0) + 1;

      const goldMultiplier = this.state.selectedCharacter.perkType === 'GOLD' ? 1.5 : 1.0;
      let pts = Math.round(SCORES.COIN * goldMultiplier);
      if (this.state.doubleDoubloonRemaining > 0) {
        pts *= 2;
        this.state.doubleDoubloonRemaining--;
        if (Math.random() < 0.25) {
          this.spawnScorePopup(c * 20 + 10, r * 20 - 8, '2X GOLD! +20', '#eab308');
        }
      }
      this.addScore(pts);
      soundEngine.playCoin();

      // Gold Sparkle particles
      this.particles.push({
        x: c * 20 + 10,
        y: r * 20 + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 0.5,
        size: 3.5,
        color: '#facc15',
        alpha: 1,
        decay: 0.05,
        shape: 'sparkle',
      });

      // Check level clear
      if (this.state.coinsRemaining <= 0) {
        this.triggerLevelClear();
      }
    } else if (tile === 'TREASURE_VAULT') {
      this.depositCargoAtVault(c, r);
    } else if (tile === 'PORTAL_WHIRLPOOL') {
      this.triggerWhirlpoolTeleport(c, r);
    } else if (tile === 'REPAIR_DOCK' || tile === 'AMMO_DEPOT') {
      this.repairAtRepairStop(c, r);
    } else if (
      tile === 'POWER_GROG' ||
      tile === 'POWER_INVISIBILITY' ||
      tile === 'POWER_SPEED' ||
      tile === 'POWER_KEG'
    ) {
      this.triggerPowerUpMathChallenge(tile, c, r);
    }
  }

  private triggerPowerUpMathChallenge(
    tile: 'POWER_GROG' | 'POWER_INVISIBILITY' | 'POWER_SPEED' | 'POWER_KEG',
    col: number,
    row: number
  ) {
    const mathProblem = generateMathProblem(this.state.mathConfig, this.state.powerUpsUsedCount, this.state.level);

    let powerUpName = 'Royal Grog';
    let powerUpIcon = '🍺';
    let powerUpDescription = 'Draw cutlasses, scare Redcoats & fight back!';
    if (tile === 'POWER_INVISIBILITY') {
      powerUpName = 'Ghost Mist Cloak';
      powerUpIcon = '🌫️';
      powerUpDescription = 'Disguise in spectral sea mist & phase through guards!';
    } else if (tile === 'POWER_SPEED') {
      powerUpName = 'Swift Rum Dash';
      powerUpIcon = '💨';
      powerUpDescription = '1.8x turbocharged speed dash to sweep the cove!';
    } else if (tile === 'POWER_KEG') {
      powerUpName = 'Powder Keg Blast';
      powerUpIcon = '💣';
      powerUpDescription = 'Detonate explosive cannon keg at all nearby guards!';
    }

    this.state.mathChallenge = {
      powerUpType: tile,
      powerUpName,
      powerUpIcon,
      powerUpDescription,
      tileCol: col,
      tileRow: row,
      ...mathProblem,
      openedTimestamp: Date.now(),
      timeLimitSeconds: this.state.mathConfig.timedMode ? this.state.mathConfig.timeLimitSeconds : undefined,
    };

    this.state.status = 'POWERUP_CHALLENGE';
    soundEngine.playPuzzlePrompt();
  }

  public resolveMathChallenge(
    correct: boolean,
    userAnswer: number | null = null,
    attempts: number = 1,
    forfeited: boolean = false,
    elapsedSeconds?: number
  ) {
    const challenge = this.state.mathChallenge;
    if (!challenge) return;

    const { powerUpType, tileCol: c, tileRow: r, bonusPoints } = challenge;

    // Tile is cleared
    this.tiles[r][c] = 'EMPTY';

    const challengeOpened = challenge.openedTimestamp || Date.now();
    const answerTimeSeconds = typeof elapsedSeconds === 'number'
      ? Math.max(0.2, Math.round(elapsedSeconds * 10) / 10)
      : Math.max(0.5, Math.round(((Date.now() - challengeOpened) / 1000) * 10) / 10);

    // Calculate answer speed reward
    const speedReward = getAnswerSpeedReward(answerTimeSeconds);
    const speedBonusPoints = correct ? speedReward.bonusPoints : 0;

    // Record into session math history for report card & review
    this.state.mathHistory.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      challengeNumber: challenge.challengeNumber,
      operation: challenge.operation,
      difficultyLevel: challenge.difficultyLevel,
      difficultyName: challenge.difficultyName,
      question: challenge.question,
      correctAnswer: challenge.correctAnswer,
      userAnswer,
      isCorrect: correct,
      attempts,
      forfeited,
      explanation: challenge.explanation,
      hint: challenge.hint,
      bonusPoints: correct ? bonusPoints : 0,
      powerUpName: challenge.powerUpName,
      answerTimeSeconds,
      speedBonusPoints,
      levelNumber: this.state.level,
    });

    if (correct) {
      this.state.powerUpsUsedCount++;
      this.state.mathProblemsSolved++;
      this.state.levelMathSolved = Math.min(10, this.state.levelMathSolved + 1);
      this.state.currentMathStreak++;
      if (this.state.currentMathStreak > this.state.bestMathStreak) {
        this.state.bestMathStreak = this.state.currentMathStreak;
      }
      addLifetimeMathSolved(1);
      soundEngine.playPuzzleSuccess();

      // Bonus score for solving the math cipher
      this.addScore(bonusPoints);
      this.spawnScorePopup(c * 20 + 10, r * 20 - 5, `+${bonusPoints} CIPHER SOLVED!`, '#38bdf8');

      // Math Cipher Reward: automatically reloads the weapon that is currently lowest,
      // or unlocks Ghost Mist if all existing ammo is full!
      const p = this.pirate;
      const isAllExistingAmmoFull =
        p.cannonAmmo >= p.maxCannonAmmo &&
        p.kegAmmo >= p.maxKegAmmo &&
        p.windCharges >= p.maxWindCharges;

      if (!p.cloakUnlocked && isAllExistingAmmoFull) {
        // Unlock Ghost Mist!
        p.cloakUnlocked = true;
        p.cloakCharges = 1;
        p.maxCloakCharges = 1;
        soundEngine.playMilestoneUnlock();
        this.spawnScorePopup(c * 20 + 10, r * 20 - 46, '🎉 GHOST MIST UNLOCKED! (Press C)', '#c084fc');
        this.state.recentRewardNotification = {
          id: `mist-unlocked-${Date.now()}`,
          title: 'Ghost Mist Unlocked!',
          badge: 'New Weapon Unlocked',
          icon: '🌫️',
          color: '#c084fc',
          description: 'All existing ammo was full! Decoded cipher unlocked Ghost Mist Spectral Cloak [C / X].',
          timestamp: Date.now(),
        };
        this.logCaptainEvent({
          type: 'CIPHER',
          title: 'Ghost Mist Unlocked',
          detail: 'All weapons were full! Decoded cipher unlocked Ghost Mist Spectral Cloak.',
          badge: 'Mist Unlocked',
          icon: '🌫️',
        });
      } else if (p.cloakUnlocked && isAllExistingAmmoFull && p.cloakCharges >= p.maxCloakCharges) {
        // All weapons and Ghost Mist are already topped off! Expand ship armament capacity!
        p.maxCannonAmmo = Math.min(10, p.maxCannonAmmo + 1);
        p.cannonAmmo = p.maxCannonAmmo;
        soundEngine.playLevelClear();
        this.spawnScorePopup(c * 20 + 10, r * 20 - 46, `⚡ MAX CANNON CAPACITY +1 (${p.maxCannonAmmo})!`, '#facc15');
        this.logCaptainEvent({
          type: 'CIPHER',
          title: 'Arsenal Expanded',
          detail: `All weapons fully loaded! Cipher mastery increased Max Cannon Capacity to ${p.maxCannonAmmo}.`,
          badge: 'Capacity +1',
          icon: '⚡',
        });
      } else {
        // Reload lowest weapon among available weapons
        const weapons = [
          {
            name: 'Broadside Cannon',
            icon: '💥',
            current: p.cannonAmmo,
            max: p.maxCannonAmmo,
            ratio: p.cannonAmmo / p.maxCannonAmmo,
            reload: () => {
              const added = Math.min(p.maxCannonAmmo - p.cannonAmmo, 3);
              p.cannonAmmo = Math.min(p.maxCannonAmmo, p.cannonAmmo + 3);
              return { added, text: added > 0 ? `+${added}` : 'TOPPED' };
            },
          },
          {
            name: 'Powder Kegs',
            icon: '💣',
            current: p.kegAmmo,
            max: p.maxKegAmmo,
            ratio: p.kegAmmo / p.maxKegAmmo,
            reload: () => {
              const added = Math.min(p.maxKegAmmo - p.kegAmmo, 2);
              p.kegAmmo = Math.min(p.maxKegAmmo, p.kegAmmo + 2);
              return { added, text: added > 0 ? `+${added}` : 'TOPPED' };
            },
          },
          {
            name: 'Wind Dash',
            icon: '💨',
            current: p.windCharges,
            max: p.maxWindCharges,
            ratio: p.windCharges / p.maxWindCharges,
            reload: () => {
              const added = Math.min(p.maxWindCharges - p.windCharges, 2);
              p.windCharges = Math.min(p.maxWindCharges, p.windCharges + 2);
              return { added, text: added > 0 ? `+${added}` : 'TOPPED' };
            },
          },
        ];

        if (p.cloakUnlocked) {
          weapons.push({
            name: 'Ghost Mist',
            icon: '🌫️',
            current: p.cloakCharges,
            max: p.maxCloakCharges,
            ratio: p.cloakCharges / p.maxCloakCharges,
            reload: () => {
              const added = Math.min(p.maxCloakCharges - p.cloakCharges, 1);
              p.cloakCharges = Math.min(p.maxCloakCharges, p.cloakCharges + 1);
              return { added, text: added > 0 ? `+${added}` : 'TOPPED' };
            },
          });
        }

        weapons.sort((a, b) => a.ratio - b.ratio || a.current - b.current);
        const lowestWeapon = weapons[0];
        const res = lowestWeapon.reload();

        this.spawnScorePopup(
          c * 20 + 10,
          r * 20 - 46,
          `⚡ ${lowestWeapon.icon} ${lowestWeapon.name.toUpperCase()} RELOADED (${res.text})!`,
          '#38bdf8'
        );

        this.logCaptainEvent({
          type: 'CIPHER',
          title: 'Cipher Decoded & Weapon Reloaded',
          detail: `Decoded cipher (${challenge.question} = ${challenge.correctAnswer}) — ${lowestWeapon.name} reloaded (${res.text}).`,
          badge: 'Reloaded',
          icon: lowestWeapon.icon,
        });
      }

      this.syncPirateToState();

      // Award problem answer speed bonus!
      if (speedBonusPoints > 0) {
        this.addScore(speedBonusPoints);
        this.spawnScorePopup(c * 20 + 10, r * 20 - 32, `${speedReward.label} +${speedBonusPoints}`, '#38bdf8');
      }
      if (speedReward.grantSpeedBoost) {
        this.activatePower('SPEED', 3500);
        this.updatePirateSpeed();
      }

      // Check Streak Incentives
      const streakReward = STREAK_MILESTONES.find(s => s.streak === this.state.currentMathStreak);
      if (streakReward) {
        soundEngine.playStreakBonus();
        this.addScore(500);
        this.spawnScorePopup(c * 20 + 10, r * 20 - 50, `${streakReward.badge}!`, streakReward.color);
        if (streakReward.unlockedCharacter) {
          savePersistedUnlockedHeroId(streakReward.unlockedCharacter.id);
        }
        this.state.recentRewardNotification = {
          id: `streak-${streakReward.streak}-${Date.now()}`,
          title: streakReward.title,
          badge: streakReward.badge,
          icon: streakReward.icon,
          color: streakReward.color,
          description: streakReward.perkText,
          timestamp: Date.now(),
        };
      }

      // Check Level Milestones Incentives (10 rewards for questions 1 to 10 in EVERY level)
      const milestone = LEVEL_MATH_MILESTONES.find(m => m.threshold === this.state.levelMathSolved);
      if (milestone && !this.state.levelMilestonesUnlocked.includes(milestone.threshold)) {
        this.state.levelMilestonesUnlocked.push(milestone.threshold);
        soundEngine.playMilestoneUnlock();

        // Apply distinct physical in-game gameplay perk!
        switch (milestone.threshold) {
          case 1:
            this.addScore(200);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, '+200 STARTER DOUBLOONS!', '#38bdf8');
            break;
          case 2:
            this.activatePower('SPEED', 5000);
            this.updatePirateSpeed();
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, '5S SWIFT WIND DASH!', '#34d399');
            break;
          case 3:
            this.state.lives = Math.min(this.state.lives + 1, 6);
            this.activatePower('INVISIBILITY', 4000);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'EXTRA HEART GRANTED (+1 ❤️)!', '#f43f5e');
            soundEngine.playExtraLife();
            break;
          case 4:
            this.activatePower('INVISIBILITY', 5500);
            this.addScore(300);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, '5.5S SPECTRAL MIST CLOAK!', '#c084fc');
            break;
          case 5:
            if (milestone.unlockedCharacter) {
              savePersistedUnlockedHeroId(milestone.unlockedCharacter.id);
            }
            this.addScore(500);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'HERO UNLOCKED: HYPATIA & +500!', '#10b981');
            break;
          case 6:
            this.state.doubleDoubloonRemaining = 15;
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, '2X GOLD FRENZY (15 COINS)!', '#eab308');
            break;
          case 7: {
            let closestGuard: Guard | null = null;
            let minDist = Infinity;
            for (const g of this.guards) {
              if (g.state !== 'IN_PEN' && g.state !== 'RETURNING') {
                const d = Math.hypot(g.x - this.pirate.x, g.y - this.pirate.y);
                if (d < minDist) {
                  minDist = d;
                  closestGuard = g;
                }
              }
            }
            if (closestGuard) {
              closestGuard.state = 'RETURNING';
              this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'REDCOAT FLASH-STUNNED!', '#06b6d4');
            }
            break;
          }
          case 8:
            this.addScore(1000);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'SUPER KEG SHOCKWAVE! +1,000', '#f97316');
            this.triggerKegExplosion(c, r);
            break;
          case 9:
            for (const g of this.guards) {
              if (g.state !== 'RETURNING' && g.state !== 'IN_PEN') {
                g.state = 'FRIGHTENED';
                g.frightenedTimer = 8000;
                g.speed = GAME_SPEEDS.GUARD_FRIGHTENED * 0.7;
              }
            }
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'FLEET SIREN: GUARDS SLOWED 50%!', '#8b5cf6');
            break;
          case 10:
            this.addScore(2500);
            this.spawnScorePopup(c * 20 + 10, r * 20 - 20, 'LEVEL MASTER! +2,500 BOUNTY', '#fbbf24');
            soundEngine.playLevelClear();
            break;
        }

        // Emit notification banner
        this.state.recentRewardNotification = {
          id: `milestone-lvl-${this.state.level}-${milestone.threshold}-${Date.now()}`,
          title: milestone.title,
          badge: milestone.badge,
          icon: milestone.icon,
          color: milestone.color,
          description: milestone.perkDescription,
          timestamp: Date.now(),
        };
      }

      // Activate the respective power-up effect
      if (powerUpType === 'POWER_GROG') {
        this.addScore(SCORES.GROG);
        soundEngine.playFightBackPower();

        const durationBonus = this.state.selectedCharacter.perkType === 'POWER' ? 3000 : 0;
        const totalMs = POWERUP_DURATIONS.GROG_MS + durationBonus;

        this.activatePower('GROG', totalMs);
        this.state.guardsDefeatedInGrog = 0;

        for (const g of this.guards) {
          if (g.state !== 'RETURNING' && g.state !== 'IN_PEN') {
            g.state = 'FRIGHTENED';
            g.frightenedTimer = totalMs;
            g.dir = this.getOppositeDirection(g.dir);
          }
        }

        this.spawnScorePopup(c * 20 + 10, r * 20 + 10, 'FIGHT BACK!', '#fbbf24');
      } else if (powerUpType === 'POWER_INVISIBILITY') {
        this.addScore(SCORES.INVISIBILITY);
        soundEngine.playInvisibility();

        this.activatePower('INVISIBILITY', POWERUP_DURATIONS.INVISIBILITY_MS);

        for (let i = 0; i < 15; i++) {
          this.particles.push({
            x: c * 20 + 10,
            y: r * 20 + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 4 + Math.random() * 4,
            color: '#c084fc',
            alpha: 0.8,
            decay: 0.03,
          });
        }

        this.spawnScorePopup(c * 20 + 10, r * 20 + 10, 'GHOST CLOAK!', '#c084fc');
      } else if (powerUpType === 'POWER_SPEED') {
        this.addScore(SCORES.SPEED);
        soundEngine.playSpeedUp();

        const bonus = this.state.selectedCharacter.perkType === 'SPEED' ? 2500 : 0;
        this.activatePower('SPEED', POWERUP_DURATIONS.SPEED_MS + bonus);
        this.updatePirateSpeed();

        this.spawnScorePopup(c * 20 + 10, r * 20 + 10, 'SWIFT RUM!', '#38bdf8');
      } else if (powerUpType === 'POWER_KEG') {
        this.addScore(SCORES.KEG);
        soundEngine.playCannonBlast();

        this.spawnScorePopup(c * 20 + 10, r * 20 + 10, 'BOOM!', '#ef4444');
        this.triggerKegExplosion(c, r);
      }
    } else {
      // Streak breaks upon forfeiture or missed challenge
      this.state.currentMathStreak = 0;
      soundEngine.playPuzzleFail();
      this.spawnScorePopup(c * 20 + 10, r * 20 + 10, 'FORFEITED', '#94a3b8');
    }

    this.state.mathChallenge = null;
    this.state.status = 'PLAYING';
  }

  private activatePower(type: ActivePowerUp['type'], totalMs: number) {
    const existing = this.state.activePowers.find(p => p.type === type);
    if (existing) {
      existing.remainingMs = totalMs;
      existing.totalMs = totalMs;
    } else {
      this.state.activePowers.push({ type, remainingMs: totalMs, totalMs });
    }
  }

  private triggerKegExplosion(col: number, row: number) {
    const cx = col * 20 + 10;
    const cy = row * 20 + 10;

    // Massive spark and smoke particles
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: Math.random() < 0.5 ? '#f97316' : '#ef4444',
        alpha: 1,
        decay: 0.03,
      });
    }

    // Blast any guards within 6 tiles radius!
    for (const g of this.guards) {
      const dist = Math.hypot(g.gridCol - col, g.gridRow - row);
      if (dist <= 6 && g.state !== 'IN_PEN' && g.state !== 'RETURNING') {
        if (g.state === 'EXITING_PEN') {
          g.state = 'IN_PEN';
          g.penTimer = 50;
          g.x = g.penPosition.col;
          g.y = g.penPosition.row;
          g.gridCol = Math.round(g.x);
          g.gridRow = Math.round(g.y);
          g.dir = 'UP';
        } else {
          g.state = 'RETURNING';
          g.returnTimer = 0;
        }
        this.addScore(300);
        this.spawnScorePopup(g.x * 20 + 10, g.y * 20 + 10, '+300 BLAST!', '#f97316');
      }
    }
  }

  private checkGuardCollisions() {
    const p = this.pirate;
    const isPirateInvisible = this.state.activePowers.some(pow => pow.type === 'INVISIBILITY');

    for (const g of this.guards) {
      if (g.state === 'IN_PEN' || g.state === 'EXITING_PEN' || g.state === 'RETURNING') {
        continue;
      }

      const dist = Math.hypot(p.x - g.x, p.y - g.y);
      if (dist < 0.7) {
        if (g.state === 'FRIGHTENED') {
          // Pirate eats / defeats British guard!
          g.state = 'RETURNING';
          g.returnTimer = 0;
          this.state.guardsDefeatedInGrog++;
          const multiplier = Math.pow(2, Math.min(3, this.state.guardsDefeatedInGrog - 1));
          const bounty = SCORES.GUARD_BASE * multiplier;
          this.addScore(bounty);

          soundEngine.playGuardDefeated();
          this.spawnScorePopup(g.x * 20 + 10, g.y * 20 + 10, `+${bounty}`, '#38bdf8');

          // Cutlass clashing sparks
          for (let i = 0; i < 18; i++) {
            this.particles.push({
              x: g.x * 20 + 10,
              y: g.y * 20 + 10,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              size: 2.5 + Math.random() * 3,
              color: '#f8fafc',
              alpha: 1,
              decay: 0.04,
              shape: 'sparkle',
            });
          }
        } else {
          // Dangerous guard encounter
          if (isPirateInvisible) {
            // Pirate is invisible! Safe ghost phase through
            if (Math.random() < 0.2) {
              this.particles.push({
                x: p.x * 20 + 10,
                y: p.y * 20 + 10,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 4,
                color: '#38bdf8',
                alpha: 0.8,
                decay: 0.05,
              });
            }
          } else {
            // Caught by British guard!
            this.triggerPlayerDeath();
            break;
          }
        }
      }
    }
  }

  private checkBonusItem(deltaMs: number) {
    const coinsEaten = this.state.totalCoins - this.state.coinsRemaining;
    if (!this.state.bonusItem && (coinsEaten === 70 || coinsEaten === 170)) {
      this.state.bonusItem = {
        type: 'CHEST',
        col: 13.5,
        row: 17,
        points: SCORES.CHEST,
        timer: 9000,
        visible: true,
      };
    }

    if (this.state.bonusItem && this.state.bonusItem.visible) {
      this.state.bonusItem.timer -= deltaMs;
      if (this.state.bonusItem.timer <= 0) {
        this.state.bonusItem.visible = false;
      } else {
        const p = this.pirate;
        const dist = Math.hypot(p.x - this.state.bonusItem.col, p.y - this.state.bonusItem.row);
        if (dist < 0.8) {
          // Collected bonus chest!
          this.addScore(this.state.bonusItem.points);
          soundEngine.playTreasureChest();
          this.spawnScorePopup(
            this.state.bonusItem.col * 20 + 10,
            this.state.bonusItem.row * 20 + 10,
            `+${this.state.bonusItem.points}`,
            '#eab308'
          );
          this.state.bonusItem.visible = false;
        }
      }
    }
  }

  private triggerPlayerDeath() {
    this.state.status = 'DIED';
    this.deathTimer = 0;
    this.state.lives--;
    soundEngine.playPlayerCaught();

    // High stakes: Lose half of unbanked cargo doubloons to the deep
    if (this.pirate.carriedCoins > 0) {
      const lost = Math.ceil(this.pirate.carriedCoins / 2);
      this.pirate.carriedCoins -= lost;
      this.spawnScorePopup(this.pirate.x * 20 + 10, this.pirate.y * 20 - 15, `⚠️ -${lost} CARGO LOST!`, '#ef4444');
    }

    // Any coins lost when shot disappear if you die! They sink to the ocean abyss
    if (this.droppedCoinTiles.length > 0) {
      let sunkCount = 0;
      for (const pos of this.droppedCoinTiles) {
        if (this.tiles[pos.row]?.[pos.col] === 'COIN') {
          this.tiles[pos.row][pos.col] = 'EMPTY';
          this.state.coinsRemaining = Math.max(0, this.state.coinsRemaining - 1);
          this.state.totalCoins = Math.max(1, this.state.totalCoins - 1);
          sunkCount++;

          for (let k = 0; k < 5; k++) {
            this.particles.push({
              x: pos.col * 20 + 10,
              y: pos.row * 20 + 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 0.8 + Math.random() * 1.2,
              size: 2.5 + Math.random() * 2,
              color: '#38bdf8',
              alpha: 0.85,
              decay: 0.04,
              shape: 'circle',
            });
          }
        }
      }
      if (sunkCount > 0) {
        this.spawnScorePopup(
          this.pirate.x * 20 + 10,
          this.pirate.y * 20 + 20,
          `🌊 ${sunkCount} LOST COINS SUNK TO THE DEEP!`,
          '#60a5fa'
        );
      }
      this.droppedCoinTiles = [];
    }

    // Death smoke puff
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: this.pirate.x * 20 + 10,
        y: this.pirate.y * 20 + 10,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 3 + Math.random() * 4,
        color: '#dc2626',
        alpha: 1,
        decay: 0.03,
      });
    }
  }

  private triggerLevelClear() {
    this.state.status = 'LEVEL_CLEAR';
    this.levelClearTimer = 0;
    soundEngine.playLevelClear();

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - this.state.levelStartTime) / 1000));
    const currentLvlConfig = getLevelConfig(this.state.level);
    const speedBounty = calculateLevelSpeedBounty(elapsedSeconds, currentLvlConfig.parTimeSeconds);

    // Award level speed bounty
    this.addScore(speedBounty.bonusScore);
    this.spawnScorePopup(
      (GRID_COLS / 2) * 20,
      (GRID_ROWS / 2) * 20 - 25,
      `${speedBounty.medalEmoji} ${speedBounty.label} +${speedBounty.bonusScore}`,
      '#fbbf24'
    );

    // Calculate math accuracy and average answer speed for this level
    const levelRecords = this.state.mathHistory.filter(r => r.levelNumber === this.state.level);
    const correctCount = levelRecords.filter(r => r.isCorrect).length;
    const totalCount = levelRecords.length;
    const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;
    const totalAnswerSec = levelRecords.reduce((acc, r) => acc + (r.answerTimeSeconds || 0), 0);
    const avgAnswerSpeed = totalCount > 0 ? Math.round((totalAnswerSec / totalCount) * 10) / 10 : 0;

    const nextLvl = this.state.level + 1;
    const nextConfig = getLevelConfig(nextLvl);

    this.state.levelClearSummary = {
      level: this.state.level,
      islandName: currentLvlConfig.islandName,
      elapsedSeconds,
      parTimeSeconds: currentLvlConfig.parTimeSeconds,
      speedRank: speedBounty.rank,
      speedMedalEmoji: speedBounty.medalEmoji,
      speedBounty: speedBounty.bonusScore,
      mathSolvedThisLevel: this.state.levelMathSolved,
      mathTotalThisLevel: Math.max(this.state.levelMathSolved, totalCount),
      mathAccuracyPct: accuracyPct,
      avgAnswerSpeedSeconds: avgAnswerSpeed,
      nextLevelNumber: nextLvl,
      nextIslandName: nextConfig.islandName,
      nextMathDifficultyName: nextConfig.mathDifficultyName,
      nextUnlockedFeature: nextConfig.newPowerUpUnlocked
        ? `${nextConfig.newPowerUpUnlocked.icon} ${nextConfig.newPowerUpUnlocked.name}: ${nextConfig.newPowerUpUnlocked.description}`
        : `${nextConfig.featuredHero.name} Mastery`,
    };

    // Confetti / Gold fountain particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: (GRID_COLS / 2) * 20,
        y: (GRID_ROWS / 2) * 20,
        vx: (Math.random() - 0.5) * 7,
        vy: -Math.random() * 7,
        size: 3 + Math.random() * 5,
        color: Math.random() < 0.5 ? '#facc15' : '#38bdf8',
        alpha: 1,
        decay: 0.02,
        shape: 'sparkle',
      });
    }
  }

  private addScore(amount: number) {
    this.state.score += amount;
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore(this.state.highScore);
    }
  }

  // Captain's Logbook: Records major naval, cipher, and voyage gameplay events
  public logCaptainEvent(entry: {
    type: CaptainsLogEntry['type'];
    title: string;
    detail: string;
    badge?: string;
    icon?: string;
  }) {
    const elapsedSec = Math.floor((Date.now() - (this.state.levelStartTime || Date.now())) / 1000);
    const mm = Math.floor(elapsedSec / 60).toString().padStart(2, '0');
    const ss = (elapsedSec % 60).toString().padStart(2, '0');
    const newEntry: CaptainsLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      timeFormatted: `${mm}:${ss}`,
      type: entry.type,
      title: entry.title,
      detail: entry.detail,
      badge: entry.badge,
      icon: entry.icon,
    };
    if (!this.state.captainsLog) {
      this.state.captainsLog = [];
    }
    this.state.captainsLog.unshift(newEntry);
    if (this.state.captainsLog.length > 25) {
      this.state.captainsLog.pop();
    }
  }

  // Ambient Sea Spray & Bubbles Simulation
  private initAmbientParticles() {
    this.ambientParticles = [];
    for (let i = 0; i < 50; i++) {
      const type: 'SPRAY' | 'BUBBLE' | 'GLINT' = 
        i % 3 === 0 ? 'BUBBLE' : i % 3 === 1 ? 'SPRAY' : 'GLINT';
      this.ambientParticles.push({
        x: Math.random() * (GRID_COLS * 20),
        y: Math.random() * (GRID_ROWS * 20),
        vx: (Math.random() * 0.35 + 0.15) * (type === 'SPRAY' ? 1.3 : 0.8),
        vy: (Math.random() - 0.5) * 0.15 + (type === 'BUBBLE' ? -0.22 : 0),
        size: type === 'BUBBLE' ? 2 + Math.random() * 3 : type === 'SPRAY' ? 1.5 + Math.random() * 2 : 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.45,
        type,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  private updateAmbientParticles(deltaMs: number) {
    const maxX = GRID_COLS * 20;
    const maxY = GRID_ROWS * 20;

    for (const p of this.ambientParticles) {
      p.phase += 0.04;
      p.x += p.vx;
      p.y += p.vy + Math.sin(p.phase) * 0.3;

      // Wrap smoothly around ocean boundaries
      if (p.x > maxX + 10) p.x = -10;
      if (p.x < -10) p.x = maxX + 10;
      if (p.y > maxY + 10) p.y = -10;
      if (p.y < -10) p.y = maxY + 10;
    }
  }

  // Combat Weapon: Broadside Cannon Fire
  public fireCannon(): boolean {
    if (this.state.status !== 'PLAYING') return false;
    const p = this.pirate;
    if (p.shootCooldown > 0 || p.cannonAmmo <= 0) return false;

    p.cannonAmmo--;
    p.shootCooldown = 320;

    // Determine direction vector
    let vx = 0;
    let vy = 0;
    if (p.dir === 'UP') vy = -0.42;
    else if (p.dir === 'DOWN') vy = 0.42;
    else if (p.dir === 'LEFT') vx = -0.42;
    else vx = 0.42; // default or RIGHT

    this.cannonballs.push({
      id: ++this.projectileIdCounter,
      x: p.x + vx * 1.5,
      y: p.y + vy * 1.5,
      vx,
      vy,
      distanceTraveled: 0,
      maxDistance: 9, // tiles
    });

    soundEngine.playCannonFire();

    // Muzzle flash & smoke particles
    const cx = (p.x + vx * 1.2) * 20 + 10;
    const cy = (p.y + vy * 1.2) * 20 + 10;
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 2 + vx * 2,
        vy: (Math.random() - 0.5) * 2 + vy * 2,
        size: 3 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#f59e0b' : '#94a3b8',
        alpha: 0.9,
        decay: 0.08,
      });
    }

    return true;
  }

  // Combat Weapon: Drop Floating Explosive Powder Keg
  public dropKeg(): boolean {
    if (this.state.status !== 'PLAYING') return false;
    const p = this.pirate;
    if (p.kegAmmo <= 0) return false;

    p.kegAmmo--;
    this.placedKegs.push({
      id: ++this.projectileIdCounter,
      x: Math.round(p.x),
      y: Math.round(p.y),
      fuseTimer: 6500, // 6.5s
    });

    soundEngine.playClick();
    this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 10, '💣 KEG LAID!', '#f97316');
    return true;
  }

  // Combat Weapon: Swift Wind Dash Boost
  public activateWindBoost(): boolean {
    if (this.state.status !== 'PLAYING') return false;
    const p = this.pirate;
    if (p.windCharges <= 0) return false;

    p.windCharges--;
    this.activatePower('SPEED', 4000);
    this.updatePirateSpeed();
    soundEngine.playSpeedUp();
    this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 10, '💨 SWIFT WIND!', '#38bdf8');
    return true;
  }

  // Combat Weapon: Ghost Mist Cloak
  public activateGhostMist(): boolean {
    if (this.state.status !== 'PLAYING') return false;
    const p = this.pirate;
    if (p.cloakCharges <= 0) return false;

    p.cloakCharges--;
    this.activatePower('INVISIBILITY', 5000);
    soundEngine.playInvisibility();
    this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 10, '🌫️ GHOST MIST!', '#c084fc');
    return true;
  }

  // Update flying cannonballs
  private updateCannonballs(deltaMs: number) {
    for (let i = this.cannonballs.length - 1; i >= 0; i--) {
      const cb = this.cannonballs[i];
      cb.x += cb.vx;
      cb.y += cb.vy;
      cb.distanceTraveled += Math.hypot(cb.vx, cb.vy);

      // Trailing water spray / smoke
      if (Math.random() < 0.35) {
        this.particles.push({
          x: cb.x * 20 + 10,
          y: cb.y * 20 + 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 2,
          color: 'rgba(220, 220, 220, 0.6)',
          alpha: 0.6,
          decay: 0.08,
        });
      }

      const col = Math.round(cb.x);
      const row = Math.round(cb.y);

      // Wall hit check
      if (
        col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS ||
        this.tiles[row]?.[col] === 'WALL' ||
        cb.distanceTraveled >= cb.maxDistance
      ) {
        // Water splash impact
        for (let k = 0; k < 6; k++) {
          this.particles.push({
            x: cb.x * 20 + 10,
            y: cb.y * 20 + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 2.5,
            color: '#38bdf8',
            alpha: 0.8,
            decay: 0.08,
          });
        }
        this.cannonballs.splice(i, 1);
        continue;
      }

      // Check hits
      if (cb.isEnemy) {
        // Enemy Navy cannonball: Check hit on pirate ship
        const isInv = this.state.activePowers.some(pow => pow.type === 'INVISIBILITY');
        const distToPlayer = Math.hypot(cb.x - this.pirate.x, cb.y - this.pirate.y);
        if (distToPlayer < 0.85 && !isInv) {
          this.handlePlayerHitByCannonball(cb.x, cb.y);
          this.cannonballs.splice(i, 1);
          continue;
        }
      } else {
        // Player's cannonball: Check guard warship hit
        let hitGuard = false;
        for (const g of this.guards) {
          if (g.state === 'IN_PEN' || g.state === 'RETURNING') continue;
          const dist = Math.hypot(cb.x - g.x, cb.y - g.y);
          if (dist < 0.85) {
            hitGuard = true;
            // Blast navy warship!
            g.state = 'RETURNING';
            g.returnTimer = 0;
            this.addScore(250);
            soundEngine.playGuardDefeated();
            this.spawnScorePopup(g.x * 20 + 10, g.y * 20 - 10, '+250 CANNON BLAST!', '#f59e0b');

            // Cannon explosion on ship
            for (let k = 0; k < 18; k++) {
              this.particles.push({
                x: g.x * 20 + 10,
                y: g.y * 20 + 10,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: 3 + Math.random() * 3,
                color: Math.random() < 0.5 ? '#f97316' : '#f8fafc',
                alpha: 1,
                decay: 0.05,
                shape: 'sparkle',
              });
            }
            break;
          }
        }

        if (hitGuard) {
          this.cannonballs.splice(i, 1);
        }
      }
    }
  }

  // Player ship struck by enemy navy cannonball: drops carried or banked doubloons!
  private handlePlayerHitByCannonball(x: number, y: number) {
    soundEngine.playCannonBlast();
    const p = this.pirate;
    
    // Hull damage: 2 shots = death!
    p.hull--;
    this.state.hull = p.hull;

    let dropped = 0;
    if (p.carriedCoins > 0) {
      dropped = Math.min(p.carriedCoins, 5 + Math.floor(Math.random() * 4));
      p.carriedCoins -= dropped;
    } else if (p.bankedCoins > 0) {
      dropped = Math.min(p.bankedCoins, 4);
      p.bankedCoins -= dropped;
    }

    // Scatter dropped doubloons into neighboring water tiles to be recollected!
    if (dropped > 0) {
      let placed = 0;
      for (let dr = -2; dr <= 2 && placed < dropped; dr++) {
        for (let dc = -2; dc <= 2 && placed < dropped; dc++) {
          const nr = Math.round(p.y) + dr;
          const nc = Math.round(p.x) + dc;
          if (
            nr >= 1 && nr < GRID_ROWS - 1 &&
            nc >= 1 && nc < GRID_COLS - 1 &&
            this.tiles[nr]?.[nc] === 'EMPTY'
          ) {
            this.tiles[nr][nc] = 'COIN';
            this.state.coinsRemaining++;
            this.droppedCoinTiles.push({ col: nc, row: nr });
            placed++;
          }
        }
      }
      soundEngine.playCoin();
      this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 15, `💥 CANNON HIT! -${dropped} COINS DROPPED!`, '#ef4444');
    } else {
      this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 15, `💥 HULL STRUCK!`, '#f97316');
    }

    // Explosion sparks and wood splinter particles
    for (let k = 0; k < 18; k++) {
      this.particles.push({
        x: p.x * 20 + 10,
        y: p.y * 20 + 10,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5,
        size: 3 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#ef4444' : '#f59e0b',
        alpha: 1,
        decay: 0.05,
        shape: 'sparkle',
      });
    }

    // 2-shot death rule: if hit twice, ship sinks!
    if (p.hull <= 0) {
      this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 32, '💥 2ND CANNON HIT! SHIP SUNK!', '#dc2626');
      this.triggerPlayerDeath();
    } else {
      soundEngine.playPlayerCaught();
      this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 32, '⚠️ HULL CRACKED (1/2 HP)! VISIT 🛠️ REPAIR STOP!', '#f59e0b');
    }
  }

  // Update floating powder kegs
  private updatePlacedKegs(deltaMs: number) {
    for (let i = this.placedKegs.length - 1; i >= 0; i--) {
      const keg = this.placedKegs[i];
      keg.fuseTimer -= deltaMs;

      // Fuse sparks
      if (Math.random() < 0.3) {
        this.particles.push({
          x: keg.x * 20 + 10,
          y: keg.y * 20 + 4,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.5,
          size: 2,
          color: '#f59e0b',
          alpha: 1,
          decay: 0.1,
        });
      }

      // Check proximity to guards
      let shouldDetonate = keg.fuseTimer <= 0;
      if (!shouldDetonate) {
        for (const g of this.guards) {
          if (g.state === 'IN_PEN' || g.state === 'RETURNING') continue;
          if (Math.hypot(keg.x - g.x, keg.y - g.y) < 1.3) {
            shouldDetonate = true;
            break;
          }
        }
      }

      if (shouldDetonate) {
        soundEngine.playCannonBlast();
        this.triggerKegExplosion(keg.x, keg.y);
        this.placedKegs.splice(i, 1);
      }
    }
  }

  // Island Feature: Deposit Cargo Coins at Pirate Treasure Vault
  private depositCargoAtVault(col: number, row: number) {
    const p = this.pirate;
    if (p.carriedCoins <= 0) return;

    const coins = p.carriedCoins;
    p.bankedCoins = (p.bankedCoins || 0) + coins;
    const bonus = coins * 15;
    this.addScore(bonus);
    p.carriedCoins = 0;

    soundEngine.playTreasureChest();
    this.spawnScorePopup(col * 20 + 10, row * 20 - 15, `🪙 ${coins} CARGO BANKED! +${bonus}`, '#facc15');

    // Golden celebration sparks
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: col * 20 + 10,
        y: row * 20 + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        size: 3.5,
        color: '#facc15',
        alpha: 1,
        decay: 0.04,
        shape: 'sparkle',
      });
    }
  }

  // Island Feature: Mystic Sea Portal / Whirlpool Teleport
  private triggerWhirlpoolTeleport(col: number, row: number) {
    if (this.portalCooldown > 0) return;

    // Find all other whirlpool portals on the map
    const portals: { c: number; r: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (this.tiles[r]?.[c] === 'PORTAL_WHIRLPOOL' && !(c === col && r === row)) {
          portals.push({ c, r });
        }
      }
    }

    if (portals.length === 0) return;

    // Pick a destination portal
    const dest = portals[Math.floor(Math.random() * portals.length)];
    this.pirate.x = dest.c;
    this.pirate.y = dest.r;
    this.pirate.gridCol = dest.c;
    this.pirate.gridRow = dest.r;
    this.portalCooldown = 2200;

    soundEngine.playWhirlpool();
    this.spawnScorePopup(dest.c * 20 + 10, dest.r * 20 - 15, '🌀 WHIRLPOOL TELEPORT!', '#38bdf8');

    // Swirling water vortex particles
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2;
      this.particles.push({
        x: dest.c * 20 + 10,
        y: dest.r * 20 + 10,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        size: 3.5,
        color: '#38bdf8',
        alpha: 0.9,
        decay: 0.04,
      });
    }
  }

  // Island Feature: Ship Repair Stop / Drydock Careening Haven (Fully repairs hull!)
  private repairAtRepairStop(col: number, row: number) {
    const p = this.pirate;
    if (p.hull < p.maxHull) {
      p.hull = p.maxHull;
      this.state.hull = p.hull;
      soundEngine.playShipRepair();
      this.spawnScorePopup(col * 20 + 10, row * 20 - 15, '🛠️ SHIP REPAIRED! HULL 100% (2/2 HP)', '#22c55e');

      // Oak timber planks and emerald restoration particles
      for (let i = 0; i < 24; i++) {
        this.particles.push({
          x: col * 20 + 10,
          y: row * 20 + 10,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: 3.5,
          color: Math.random() < 0.5 ? '#22c55e' : '#f59e0b',
          alpha: 1,
          decay: 0.04,
          shape: 'sparkle',
        });
      }
    }
  }

  // Ship Repair Action: Allows captain to careen & repair ship
  public repairShip(): boolean {
    if (this.state.status !== 'PLAYING') return false;
    const p = this.pirate;
    if (p.hull >= p.maxHull) {
      this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 10, '🛡️ HULL ALREADY SHIPSHAPE (2/2 HP)!', '#38bdf8');
      return false;
    }

    const curR = Math.round(p.y);
    const curC = Math.round(p.x);
    const isAtRepairStop = 
      this.tiles[curR]?.[curC] === 'REPAIR_DOCK' || 
      this.tiles[curR]?.[curC] === 'AMMO_DEPOT' ||
      this.tiles[curR]?.[curC] === 'TREASURE_VAULT';

    let cost = 0;
    if (!isAtRepairStop) {
      if (p.carriedCoins >= 5) {
        cost = 5;
        p.carriedCoins -= 5;
      } else if (p.bankedCoins >= 5) {
        cost = 5;
        p.bankedCoins -= 5;
      }
    }

    p.hull = p.maxHull;
    this.state.hull = p.hull;
    soundEngine.playShipRepair();

    for (let i = 0; i < 22; i++) {
      this.particles.push({
        x: p.x * 20 + 10,
        y: p.y * 20 + 10,
        vx: (Math.random() - 0.5) * 2.8,
        vy: (Math.random() - 0.5) * 2.8,
        size: 3 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#22c55e' : '#f59e0b',
        alpha: 1,
        decay: 0.04,
        shape: 'sparkle',
      });
    }

    const note = cost > 0 ? ` (-${cost}🪙)` : (isAtRepairStop ? ' (Free Dock Repair!)' : ' (Emergency Patch!)');
    this.spawnScorePopup(p.x * 20 + 10, p.y * 20 - 15, `🛠️ HULL RESTORED TO 100%!${note}`, '#22c55e');
    return true;
  }

  private spawnScorePopup(x: number, y: number, text: string, color: string) {
    this.popups.push({
      id: ++this.popupIdCounter,
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -0.8,
    });
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updatePopups() {
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y += pop.vy;
      pop.alpha -= 0.02;
      if (pop.alpha <= 0) {
        this.popups.splice(i, 1);
      }
    }
  }

  // Vault Navigation Query: Locates all treasure vaults across the current island archipelago
  public getVaultLocations(): { col: number; row: number }[] {
    const vaults: { col: number; row: number }[] = [];
    if (!this.tiles || this.tiles.length === 0) return vaults;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (this.tiles[r]?.[c] === 'TREASURE_VAULT') {
          vaults.push({ col: c, row: r });
        }
      }
    }
    return vaults;
  }

  // Vault Navigation Query: Calculates nearest vault distance and nautical bearing from current ship position
  public getNearestVaultDistance(): { distance: number; dx: number; dy: number; direction: string; vault: { col: number; row: number } } | null {
    const vaults = this.getVaultLocations();
    if (vaults.length === 0 || !this.pirate) return null;

    let nearest = vaults[0];
    let minDist = Infinity;
    for (const v of vaults) {
      const d = Math.hypot(v.col - this.pirate.x, v.row - this.pirate.y);
      if (d < minDist) {
        minDist = d;
        nearest = v;
      }
    }

    const dx = nearest.col - this.pirate.x;
    const dy = nearest.row - this.pirate.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180

    let direction = 'E';
    if (angle >= -22.5 && angle < 22.5) direction = 'E';
    else if (angle >= 22.5 && angle < 67.5) direction = 'SE';
    else if (angle >= 67.5 && angle < 112.5) direction = 'S';
    else if (angle >= 112.5 && angle < 157.5) direction = 'SW';
    else if (angle >= -67.5 && angle < -22.5) direction = 'NE';
    else if (angle >= -112.5 && angle < -67.5) direction = 'N';
    else if (angle >= -157.5 && angle < -112.5) direction = 'NW';
    else direction = 'W';

    return {
      distance: Math.round(minDist * 10) / 10,
      dx,
      dy,
      direction,
      vault: nearest,
    };
  }

  // Vault Beacon Navigation State: returns real-time pulsating beacon properties for mini-map & UI
  public getVaultBeaconState(): VaultBeaconState {
    const rawVaults = this.getVaultLocations();
    const vaults: VaultLocation[] = [];
    let nearestVault: VaultLocation | null = null;
    let minDist = Infinity;

    const px = this.pirate?.x ?? 0;
    const py = this.pirate?.y ?? 0;

    for (const v of rawVaults) {
      const d = Math.hypot(v.col - px, v.row - py);
      const loc: VaultLocation = {
        col: v.col,
        row: v.row,
        x: v.col,
        y: v.row,
        distance: Math.round(d * 10) / 10,
      };
      vaults.push(loc);
      if (d < minDist) {
        minDist = d;
        nearestVault = loc;
      }
    }

    const carriedCoins = this.pirate?.carriedCoins || 0;
    // Faster, urgent pulse period when carrying coins to deposit
    const period = carriedCoins > 0 ? 800 : 1300;
    const pulsePhase = (this.vaultBeaconTimer % period) / period;
    const beaconIntensity = carriedCoins > 0 ? Math.min(2.0, 1.2 + carriedCoins * 0.08) : 1.0;

    return {
      timer: this.vaultBeaconTimer,
      pulsePhase,
      beaconIntensity,
      nearestVault,
      vaults,
      carriedCoins,
    };
  }
}
