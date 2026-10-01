import { TileType, PiratePlayer, Guard, Particle, ScorePopup, ActivePowerUp, Cannonball, PlacedKeg, AmbientSeaParticle } from '../types';
import { GRID_COLS, GRID_ROWS, BASE_TILE_SIZE } from './constants';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private tileSize: number = BASE_TILE_SIZE;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    const sizeX = width / GRID_COLS;
    const sizeY = height / GRID_ROWS;
    this.tileSize = Math.min(sizeX, sizeY);
  }

  public getTileSize(): number {
    return this.tileSize;
  }

  public render(
    tiles: TileType[][],
    pirate: PiratePlayer,
    guards: Guard[],
    activePowers: ActivePowerUp[],
    particles: Particle[],
    popups: ScorePopup[],
    bonusItem: { type: string; col: number; row: number; visible: boolean } | null,
    level: number,
    gameStatus: string,
    ambientParticles: AmbientSeaParticle[] = [],
    cannonballs: Cannonball[] = [],
    placedKegs: PlacedKeg[] = []
  ) {
    this.time += 0.045;
    const ctx = this.ctx;
    const ts = this.tileSize;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 1. Render Caribbean Ocean surface with animated wave currents and sun caustics
    this.renderOceanSurface(ctx, width, height, level);

    // 2. Render Ambient Sea Spray, Bubbles & Water Sparkle Particles
    this.renderAmbientSeaParticles(ctx, ambientParticles);

    // 3. Render Island Archipelago Reefs & Moving Walls (swaying on the waves)
    this.renderArchipelago(ctx, tiles, ts, level);

    // 4. Render Floating Cargo, Doubloons, Vaults, Whirlpools & Ammo Depots
    this.renderCollectibles(ctx, tiles, ts);

    // 5. Render Placed Powder Kegs (Naval Sea Mines)
    this.renderPlacedKegs(ctx, placedKegs, ts);

    // 6. Render Flying Broadside Cannonballs
    this.renderCannonballs(ctx, cannonballs, ts);

    // 7. Render Bonus Sunken Treasure
    if (bonusItem && bonusItem.visible) {
      this.renderBonusTreasure(ctx, bonusItem, ts);
    }

    // 8. Render Royal Navy Warships (Imperial Fleet)
    for (const guard of guards) {
      this.renderNavyWarship(ctx, guard, ts, activePowers);
    }

    // 9. Render Pirate Flagship Boat
    this.renderPirateShip(ctx, pirate, ts, activePowers);

    // 10. Render Ocean Spray, Cannon Smoke & Spark Particles
    this.renderParticles(ctx, particles);

    // 11. Render Nautical Gold Bounties & Popups
    this.renderScorePopups(ctx, popups);

    // 12. Status Vignette (Ghost Mist / Speed)
    const isInv = activePowers.some(p => p.type === 'INVISIBILITY');
    if (isInv) {
      this.renderSpectralVignette(ctx, width, height);
    }

    // 13. Screen-Edge Vault Navigational Compass HUD Indicator
    if (status === 'PLAYING' || status === 'COUNTDOWN' || status === 'POWERUP_CHALLENGE') {
      this.renderVaultNavCompass(ctx, tiles, pirate, ts, width, height);
    }
  }

  /**
   * Screen-Edge Vault Waypoint Compass:
   * Provides immediate visual navigation so players can locate their deposit point from anywhere on the map!
   */
  private renderVaultNavCompass(
    ctx: CanvasRenderingContext2D,
    tiles: TileType[][],
    pirate: PiratePlayer,
    ts: number,
    w: number,
    h: number
  ) {
    if (!tiles || tiles.length === 0 || !pirate) return;

    // Find nearest vault
    let nearestVault: { col: number; row: number } | null = null;
    let minDist = Infinity;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (tiles[r]?.[c] === 'TREASURE_VAULT') {
          const d = Math.hypot(c - pirate.x, r - pirate.y);
          if (d < minDist) {
            minDist = d;
            nearestVault = { col: c, row: r };
          }
        }
      }
    }

    if (!nearestVault) return;

    const carriedCoins = pirate.carriedCoins || 0;
    const dx = nearestVault.col - pirate.x;
    const dy = nearestVault.row - pirate.y;
    const angle = Math.atan2(dy, dx);
    const distNautical = Math.round(minDist);

    // Draw HUD Navigational Pill in bottom-left corner of canvas
    ctx.save();
    const pillX = 14;
    const pillY = h - 26;
    const isCarrying = carriedCoins > 0;
    const pillW = isCarrying ? 175 : 130;
    const pillH = 20;

    // Glowing amber backdrop
    ctx.fillStyle = isCarrying ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.82)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 5);
    ctx.fill();

    ctx.strokeStyle = isCarrying ? '#f59e0b' : 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = isCarrying ? 1.5 : 1;
    ctx.stroke();

    // Pulsing radar ping dot
    const pulse = (this.time * 3) % 1;
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.8 * (1 - pulse)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(pillX + 11, pillY + 10, 3.5 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(pillX + 11, pillY + 10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Directional Pointer Arrow
    const arrowX = pillX + pillW - 13;
    const arrowY = pillY + 10;
    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(angle);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(5.5, 0);
    ctx.lineTo(-3.5, -3.5);
    ctx.lineTo(-1.5, 0);
    ctx.lineTo(-3.5, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Label text
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = isCarrying ? '#fde047' : '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (isCarrying) {
      ctx.fillText(`🏛️ BANK ${carriedCoins}🪙 (${distNautical}nm)`, pillX + 20, pillY + 10);
    } else {
      ctx.fillText(`🏛️ VAULT: ${distNautical}nm`, pillX + 20, pillY + 10);
    }

    ctx.restore();
  }

  /**
   * Deep Caribbean Ocean Surface with animated rolling wave currents and light caustics
   */
  private renderOceanSurface(ctx: CanvasRenderingContext2D, w: number, h: number, level: number) {
    // Sea color palette shifts with island depths
    let deepWater = '#071728';
    let midWater = '#0a2c47';
    let shallowWater = '#0d4a6b';

    if (level === 2) {
      // Emerald reef shallows
      deepWater = '#051f22';
      midWater = '#063836';
      shallowWater = '#0b524c';
    } else if (level === 3) {
      // Royal midnight harbor
      deepWater = '#0e122b';
      midWater = '#141e43';
      shallowWater = '#1d2f65';
    } else if (level >= 4) {
      // Volcanic trench abyssal depths
      deepWater = '#160d21';
      midWater = '#281335';
      shallowWater = '#3f1a4e';
    }

    // Base ocean gradient
    const seaGrad = ctx.createLinearGradient(0, 0, w, h);
    seaGrad.addColorStop(0, deepWater);
    seaGrad.addColorStop(0.5, midWater);
    seaGrad.addColorStop(1, shallowWater);
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, w, h);

    // Rolling oceanic wave swells (curving lines drifting across the sea)
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.5;

    const waveSpeed = this.time * 1.5;
    for (let y = 8; y < h; y += 24) {
      ctx.beginPath();
      for (let x = 0; x < w; x += 16) {
        const wave = Math.sin(x * 0.04 + waveSpeed + y * 0.06) * 3.5 + Math.cos(x * 0.02 - waveSpeed * 0.5) * 1.5;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    // Secondary fine sea foam ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 18; y < h; y += 32) {
      ctx.beginPath();
      for (let x = 0; x < w; x += 20) {
        const wave = Math.cos(x * 0.06 - waveSpeed * 0.8 + y * 0.08) * 2;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Island Archipelago Reefs & Moving Walls:
   * Walls visibly bob and sway back and forth on the ocean waves!
   */
  private renderArchipelago(ctx: CanvasRenderingContext2D, tiles: TileType[][], ts: number, level: number) {
    ctx.save();

    // Theme palette for island rocks and flora
    let rockColor = '#1c2d3d';
    let rockHighlight = '#2d4a63';
    let rockRim = '#38bdf8';
    let floraColor = '#10b981';

    if (level === 2) {
      rockColor = '#1b3b32';
      rockHighlight = '#285e50';
      rockRim = '#34d399';
      floraColor = '#059669';
    } else if (level === 3) {
      rockColor = '#2d2542';
      rockHighlight = '#463866';
      rockRim = '#c084fc';
      floraColor = '#eab308';
    } else if (level >= 4) {
      rockColor = '#381c28';
      rockHighlight = '#5c2b3d';
      rockRim = '#fb923c';
      floraColor = '#ef4444';
    }

    const waveTime = this.time * 2.0;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const tile = tiles[r]?.[c];
        if (!tile) continue;

        const baseX = c * ts;
        const baseY = r * ts;

        // Wave bobbing physics: the walls sway horizontally & heave vertically on the waves!
        const wavePhase = c * 0.45 + r * 0.35;
        const swayX = Math.sin(waveTime + wavePhase) * (ts * 0.12);
        const bobY = Math.cos(waveTime * 0.9 + wavePhase) * (ts * 0.08);

        const x = baseX + swayX;
        const y = baseY + bobY;

        if (tile === 'WALL') {
          // 1. Submerged turquoise shallow reef shelf beneath the island
          ctx.fillStyle = 'rgba(14, 116, 144, 0.35)';
          ctx.fillRect(baseX - 3, baseY - 3, ts + 6, ts + 6);

          // 2. Golden Caribbean Sand Beach Shoreline (borders facing water)
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 1, ts + 2, ts + 2, 5);
          ctx.fill();

          // 3. Main Tropical Island Rock & Earth Core
          ctx.fillStyle = rockColor;
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, ts - 2, ts - 2, 4);
          ctx.fill();

          // 4. Lush Tropical Palm Foliage & Greenery
          ctx.fillStyle = floraColor;
          ctx.beginPath();
          ctx.arc(x + ts * 0.5, y + ts * 0.45, ts * 0.28, 0, Math.PI * 2);
          ctx.fill();

          // Palm fronds radiating outward
          ctx.strokeStyle = '#065f46';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x + ts * 0.5, y + ts * 0.45);
          ctx.lineTo(x + ts * 0.75, y + ts * 0.25);
          ctx.moveTo(x + ts * 0.5, y + ts * 0.45);
          ctx.lineTo(x + ts * 0.25, y + ts * 0.25);
          ctx.moveTo(x + ts * 0.5, y + ts * 0.45);
          ctx.lineTo(x + ts * 0.5, y + ts * 0.15);
          ctx.stroke();

          // Sunlit rock highlight
          ctx.fillStyle = rockHighlight;
          ctx.fillRect(x + 3, y + 3, ts - 6, 2);

          // 5. Breaker surf / ocean foam lapping against the windward edge of the island!
          const surfPulse = Math.max(0, Math.sin(waveTime * 1.5 + wavePhase)) * 3;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + surfPulse * 0.2})`;
          ctx.lineWidth = 1.4;

          const top = r > 0 && tiles[r - 1]?.[c] !== 'WALL';
          const bottom = r < GRID_ROWS - 1 && tiles[r + 1]?.[c] !== 'WALL';
          const left = c > 0 && tiles[r]?.[c - 1] !== 'WALL';
          const right = c < GRID_COLS - 1 && tiles[r]?.[c + 1] !== 'WALL';

          ctx.beginPath();
          if (top) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + ts, y);
          }
          if (bottom) {
            ctx.moveTo(x, y + ts);
            ctx.lineTo(x + ts, y + ts);
          }
          if (left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ts);
          }
          if (right) {
            ctx.moveTo(x + ts, y);
            ctx.lineTo(x + ts, y + ts);
          }
          ctx.stroke();

          // Reef rim glow
          ctx.strokeStyle = rockRim;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else if (tile === 'GATE') {
          // Royal Navy Harbor Fort Gate: floating wooden boom logs and iron sea chains
          const gateBob = Math.sin(waveTime * 2 + c) * 2;
          ctx.fillStyle = '#78350f';
          ctx.fillRect(x, y + ts * 0.35 + gateBob, ts, ts * 0.3);

          // Iron chain links
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y + ts * 0.5 + gateBob);
          ctx.lineTo(x + ts, y + ts * 0.5 + gateBob);
          ctx.stroke();

          // Gate spikes
          ctx.fillStyle = '#d97706';
          for (let gx = x + 3; gx < x + ts; gx += 5) {
            ctx.fillRect(gx, y + ts * 0.2 + gateBob, 2, ts * 0.6);
          }
        } else {
          // Open water channel with faint navigation wake currents
          if ((r + c) % 4 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(baseX + ts * 0.3, baseY + ts * 0.3, ts * 0.4, 1.5);
          }
        }
      }
    }

    // 6. Island Naval Bases (Fortified coastal harbors where Royal Navy warships emerge & repair)
    const NAVAL_BASES = [
      { c: 13, r: 3, name: 'FORT STERLING' },
      { c: 24, r: 5, name: 'NE NAVAL PORT' },
      { c: 4, r: 5, name: 'NW REDOUBT' },
      { c: 24, r: 13, name: 'EAST BATTERY' },
      { c: 23, r: 24, name: 'SE CITADEL' },
      { c: 4, r: 24, name: 'SW OUTPOST' },
    ];

    for (const nb of NAVAL_BASES) {
      const bx = nb.c * ts + ts / 2;
      const by = nb.r * ts + ts / 2;

      ctx.save();
      // Stone battlement quay dock
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx - ts * 0.45, by - ts * 0.42, ts * 0.9, ts * 0.25);

      // Stone crenellations
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - ts * 0.4, by - ts * 0.48, ts * 0.2, ts * 0.12);
      ctx.fillRect(bx + ts * 0.2, by - ts * 0.48, ts * 0.2, ts * 0.12);

      // Red Royal Navy Pennant flying from flagstaff
      const flagFlutter = Math.sin(this.time * 8 + nb.c) * 1.8;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, by - ts * 0.42);
      ctx.lineTo(bx, by - ts * 0.8);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(bx, by - ts * 0.8);
      ctx.lineTo(bx + ts * 0.4, by - ts * 0.7 + flagFlutter);
      ctx.lineTo(bx, by - ts * 0.6);
      ctx.closePath();
      ctx.fill();

      // Tiny fort label
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(nb.name, bx, by + ts * 0.45);

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Floating Gold Doubloons, Island Vaults, Whirlpools & Power-Up Relics
   */
  private renderCollectibles(ctx: CanvasRenderingContext2D, tiles: TileType[][], ts: number) {
    ctx.save();
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const tile = tiles[r]?.[c];
        if (!tile || tile === 'EMPTY' || tile === 'WALL' || tile === 'GATE') continue;

        const cx = c * ts + ts / 2;
        const cy = r * ts + ts / 2;

        if (tile === 'COIN') {
          // Floating Spanish Gold Doubloon
          const bob = Math.sin(this.time * 3 + c * 0.8 + r * 0.5) * 1.5;
          const radius = Math.max(2.8, ts * 0.18);

          // Expanding water ripple ring
          const ripple = (this.time * 2 + c + r) % 3;
          ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, 0.3 - ripple * 0.1)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy + bob, radius + ripple * 2.5, 0, Math.PI * 2);
          ctx.stroke();

          // Golden coin outer rim
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx, cy + bob, radius, 0, Math.PI * 2);
          ctx.fill();

          // Coin face with golden shine
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx, cy + bob, radius * 0.75, 0, Math.PI * 2);
          ctx.fill();

          // Skull stamp on the coin center
          ctx.fillStyle = '#b45309';
          ctx.fillRect(cx - 1, cy + bob - 1.5, 2, 2.5);
        } else if (tile === 'TREASURE_VAULT') {
          // Pirate Island Treasure Vault Pier (Deposit cargo coins!)
          this.renderTreasureVault(ctx, cx, cy, ts);
        } else if (tile === 'PORTAL_WHIRLPOOL') {
          // Mystic Sea Whirlpool Portal (Teleport to another island!)
          this.renderPortalWhirlpool(ctx, cx, cy, ts);
        } else if (tile === 'REPAIR_DOCK' || tile === 'AMMO_DEPOT') {
          // Ship Repair Drydock Slipway (Repairs ship hull to 100%!)
          this.renderRepairDock(ctx, cx, cy, ts);
        } else if (tile === 'POWER_GROG') {
          // Royal Grog: Pirate Rum Keg floating on a wooden sea raft
          this.renderGrogKeg(ctx, cx, cy, ts);
        } else if (tile === 'POWER_INVISIBILITY') {
          // Ghost Mist: Ethereal Spectral Pirate Lantern
          this.renderGhostLantern(ctx, cx, cy, ts);
        } else if (tile === 'POWER_SPEED') {
          // Swift Wind: Ancient Mariner's Wind Compass
          this.renderWindCompass(ctx, cx, cy, ts);
        } else if (tile === 'POWER_KEG') {
          // Powder Keg: Iron-bound explosive powder barrel with fuse
          this.renderPowderKeg(ctx, cx, cy, ts);
        }
      }
    }
    ctx.restore();
  }

  /**
   * Power-up: Royal Grog Keg floating on raft
   */
  private renderGrogKeg(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 4) * 2;
    const r = ts * 0.45;

    // Glowing golden rum aura
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 1.6);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
    grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Wooden raft planks beneath keg
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - r * 0.8, cy + bob + r * 0.3, r * 1.6, 3);

    // Dark oak barrel
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(cx, cy + bob, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden iron barrel hoops
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + bob - r * 0.15, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.ellipse(cx, cy + bob + r * 0.15, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Foaming rum mug on top
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy + bob - r * 0.35, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Power-up: Ghost Mist Lantern
   */
  private renderGhostLantern(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 5) * 2;
    const r = ts * 0.45;

    // Spectral violet/cyan eerie haze
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 1.8);
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Brass ghost lantern frame
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cx - r * 0.4, cy + bob - r * 0.4, r * 0.8, r * 0.8);

    // Glowing inner spectral flame
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Lantern handle
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + bob - r * 0.45, r * 0.25, Math.PI, 0, false);
    ctx.stroke();
  }

  /**
   * Power-up: Swift Wind Compass
   */
  private renderWindCompass(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 6) * 2;
    const r = ts * 0.45;

    // Azure wind swirl aura
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 1.6);
    grad.addColorStop(0, 'rgba(14, 165, 233, 0.9)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.3)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Brass nautical compass ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 0.6, 0, Math.PI * 2);
    ctx.stroke();

    // Four compass points (Rose of the Winds)
    const spin = this.time * 3;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(spin) * r * 0.55, cy + bob + Math.sin(spin) * r * 0.55);
    ctx.lineTo(cx + Math.cos(spin + 1.6) * r * 0.2, cy + bob + Math.sin(spin + 1.6) * r * 0.2);
    ctx.lineTo(cx + Math.cos(spin + Math.PI) * r * 0.55, cy + bob + Math.sin(spin + Math.PI) * r * 0.55);
    ctx.lineTo(cx + Math.cos(spin - 1.6) * r * 0.2, cy + bob + Math.sin(spin - 1.6) * r * 0.2);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Power-up: Powder Keg Sea Mine
   */
  private renderPowderKeg(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 4) * 2;
    const r = ts * 0.45;

    // Fiery blast aura
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 1.6);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
    grad.addColorStop(0.6, 'rgba(249, 115, 22, 0.3)');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Black iron sea barrel
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(cx, cy + bob, r * 0.6, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Burning fuse spark
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + bob - r * 0.5);
    ctx.quadraticCurveTo(cx + 4, cy + bob - r * 0.9, cx + 8, cy + bob - r * 0.7);
    ctx.stroke();

    // Spark
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx + 8, cy + bob - r * 0.7, 3 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Pirate Island Treasure Vault Pier (Deposit cargo coins for bonus points!)
   */
  private renderTreasureVault(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 2.5) * 1.5;
    const r = ts * 0.5;

    // Glowing golden vault beacon
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 2.2);
    grad.addColorStop(0, 'rgba(250, 204, 21, 0.95)');
    grad.addColorStop(0.4, 'rgba(234, 179, 8, 0.45)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Multi-stage visual pulsating beacon ripple rings expanding across the water
    const beaconPulse1 = (this.time * 1.6) % 1;
    const ripple1 = r * 1.0 + beaconPulse1 * r * 2.6;
    ctx.strokeStyle = `rgba(253, 224, 71, ${0.85 * (1 - beaconPulse1)})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, ripple1, 0, Math.PI * 2);
    ctx.stroke();

    const beaconPulse2 = ((this.time * 1.6 + 0.5) % 1);
    const ripple2 = r * 1.0 + beaconPulse2 * r * 2.6;
    ctx.strokeStyle = `rgba(245, 158, 11, ${0.7 * (1 - beaconPulse2)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, ripple2, 0, Math.PI * 2);
    ctx.stroke();

    // Towering vertical lighthouse beacon light column shining upward into the sky
    const beamGrad = ctx.createLinearGradient(cx, cy + bob, cx, cy + bob - ts * 3.2);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
    beamGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.3)');
    beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 3.5, cy + bob - r * 0.4);
    ctx.lineTo(cx - 12, cy + bob - ts * 3.2);
    ctx.lineTo(cx + 12, cy + bob - ts * 3.2);
    ctx.lineTo(cx + 3.5, cy + bob - r * 0.4);
    ctx.closePath();
    ctx.fill();

    // Wooden dock pier platform
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - r * 0.85, cy + bob + r * 0.2, r * 1.7, ts * 0.35);

    // Mooring dock pilings
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - r * 0.8, cy + bob + r * 0.1, 3, ts * 0.45);
    ctx.fillRect(cx + r * 0.7, cy + bob + r * 0.1, 3, ts * 0.45);

    // Golden Pirate Treasure Chest Vault
    ctx.fillStyle = '#92400e';
    ctx.fillRect(cx - r * 0.6, cy + bob - r * 0.4, r * 1.2, r * 0.75);

    // Rounded chest lid with gold rim
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(cx, cy + bob - r * 0.4, r * 0.6, Math.PI, 0, false);
    ctx.fill();

    // Gold trim and lock
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - r * 0.6, cy + bob - r * 0.4, r * 1.2, r * 0.75);

    // Skull and crossbones badge on vault
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, cy + bob - r * 0.15, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Floating high-contrast text badge above the vault
    ctx.save();
    const tagText = '🏛️ VAULT (BANK HERE 🪙)';
    ctx.font = 'bold 8.5px sans-serif';
    ctx.textAlign = 'center';
    const textWidth = ctx.measureText(tagText).width;
    
    // Dark amber background chip with border
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(cx - textWidth / 2 - 4, cy + bob + r * 0.45, textWidth + 8, 13);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - textWidth / 2 - 4, cy + bob + r * 0.45, textWidth + 8, 13);

    ctx.fillStyle = '#fef08a';
    ctx.fillText(tagText, cx, cy + bob + r * 0.45 + 9.5);
    ctx.restore();
  }

  /**
   * Mystic Sea Whirlpool Portal (Teleport to another island!)
   */
  private renderPortalWhirlpool(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const r = ts * 0.55;
    const spin = this.time * 4.5;

    // Glowing cyan/azure oceanic whirlpool aura
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.6);
    grad.addColorStop(0, '#02131e');
    grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.75)');
    grad.addColorStop(0.7, 'rgba(14, 165, 233, 0.35)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Deep abyssal center vortex hole
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 4 Spiraling foam arms spinning clockwise into the vortex
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(spin);

    for (let arm = 0; arm < 4; arm++) {
      ctx.rotate((Math.PI * 2) / 4);
      ctx.strokeStyle = arm % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let t = 0; t < 1.2; t += 0.1) {
        const rad = r * 0.25 + t * (r * 0.65);
        const theta = t * 2.2;
        const x = Math.cos(theta) * rad;
        const y = Math.sin(theta) * rad;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Floating text label
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PORTAL 🌀', cx, cy + r * 1.2);
  }

  /**
   * Ship Repair Drydock Haven (Repairs ship hull to 100%!)
   */
  private renderRepairDock(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number) {
    const bob = Math.sin(this.time * 2.8) * 1.2;
    const r = ts * 0.5;

    // Emerald / turquoise shipyard restorative aura
    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, r * 1.8);
    grad.addColorStop(0, 'rgba(34, 197, 94, 0.85)');
    grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.35)');
    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Wooden shipyard drydock pier with slipway planks
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - r * 0.85, cy + bob + r * 0.15, r * 1.7, ts * 0.4);

    // Crossed shipwright tools (hammer & wrench)
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.4, cy + bob + r * 0.2);
    ctx.lineTo(cx + r * 0.4, cy + bob - r * 0.4);
    ctx.moveTo(cx + r * 0.4, cy + bob + r * 0.2);
    ctx.lineTo(cx - r * 0.4, cy + bob - r * 0.4);
    ctx.stroke();

    // Tool heads (brass / iron)
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx + r * 0.3, cy + bob - r * 0.45, 4, 3);
    ctx.fillRect(cx - r * 0.4, cy + bob - r * 0.45, 4, 3);

    // Green healing cross / repair badge in center
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(cx, cy + bob - r * 0.1, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3, cy + bob - r * 0.1 - 1, 6, 2);
    ctx.fillRect(cx - 1, cy + bob - r * 0.1 - 3, 2, 6);

    // Floating text label
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('REPAIR 🛠️', cx, cy + bob + r * 0.85);
  }

  /**
   * Flying Broadside Cannonballs
   */
  private renderCannonballs(ctx: CanvasRenderingContext2D, cannonballs: Cannonball[], ts: number) {
    for (const cb of cannonballs) {
      const cx = cb.x * ts + ts / 2;
      const cy = cb.y * ts + ts / 2;
      const r = Math.max(3.2, ts * 0.24);

      if (cb.isEnemy) {
        // Red Navy fiery cannonball with flame aura
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Fiery red/orange body
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Blazing core
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Trailing smoke ring
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.beginPath();
        ctx.arc(cx - cb.vx * ts * 0.8, cy - cb.vy * ts * 0.8, r * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Cast iron ball
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Specular shine highlight
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Placed Powder Kegs (Naval Sea Mines)
   */
  private renderPlacedKegs(ctx: CanvasRenderingContext2D, placedKegs: PlacedKeg[], ts: number) {
    for (const keg of placedKegs) {
      const cx = keg.x * ts + ts / 2;
      const cy = keg.y * ts + ts / 2;
      const bob = Math.sin(this.time * 4 + keg.id) * 1.5;
      const r = ts * 0.42;

      // Pulsing proximity danger shockwave ring
      const dangerPulse = (this.time * 4) % 1;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 * (1 - dangerPulse)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy + bob, r + dangerPulse * ts * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Dark wooden floating keg barrel
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(cx, cy + bob, r * 0.65, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Black iron barrel bands
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + bob - r * 0.2, r * 0.55, r * 0.2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx, cy + bob + r * 0.2, r * 0.55, r * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Sizzling burning fuse spark
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy + bob - r * 0.55);
      ctx.quadraticCurveTo(cx + 3, cy + bob - r * 0.9, cx + 6, cy + bob - r * 0.7);
      ctx.stroke();

      // Fiery fuse spark
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + 6, cy + bob - r * 0.7, 2.5 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Ambient Sea Spray & Bubbles Simulation
   */
  private renderAmbientSeaParticles(ctx: CanvasRenderingContext2D, ambientParticles: AmbientSeaParticle[]) {
    const scale = this.tileSize / 20;

    for (const p of ambientParticles) {
      const sx = p.x * scale;
      const sy = p.y * scale;
      const r = p.size * scale;

      ctx.save();
      if (p.type === 'BUBBLE') {
        // Translucent ocean bubble with glint
        ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(14, 165, 233, ${p.alpha * 0.3})`;
        ctx.fill();

        // Specular dot
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(sx - r * 0.35, sy - r * 0.35, Math.max(0.6, r * 0.25), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'SPRAY') {
        // Sea spray droplet riding wave current
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.65})`;
        ctx.beginPath();
        ctx.ellipse(sx, sy, r * 1.4, r * 0.8, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // GLINT: 4-pointed shimmering sun star on water
        ctx.strokeStyle = `rgba(254, 240, 138, ${p.alpha * 0.75})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - r * 1.5, sy);
        ctx.lineTo(sx + r * 1.5, sy);
        ctx.moveTo(sx, sy - r * 1.5);
        ctx.lineTo(sx, sy + r * 1.5);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, r * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  /**
   * Bonus Sunken Treasure Chest
   */
  private renderBonusTreasure(
    ctx: CanvasRenderingContext2D,
    item: { type: string; col: number; row: number },
    ts: number
  ) {
    const cx = item.col * ts + ts / 2;
    const cy = item.row * ts + ts / 2;
    const r = ts * 0.5;

    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;

    // Spanish Galleon Treasure Chest
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - r * 0.7, cy - r * 0.2, r * 1.4, r * 0.85);

    // Rounded chest lid
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.2, r * 0.7, Math.PI, 0, false);
    ctx.fill();

    // Gold bands and lock
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - r * 0.7, cy - r * 0.2, r * 1.4, r * 0.85);

    // Jewels peeking out
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 3, cy - r * 0.2, 3, 3);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cx + 1, cy - r * 0.2, 3, 3);

    ctx.restore();
  }

  /**
   * PLAYER BOAT: The Pirate Flagship Sloop / Brigantine
   * Replaces the old pac-man with an authentic wooden sailing vessel!
   */
  private renderPirateShip(
    ctx: CanvasRenderingContext2D,
    pirate: PiratePlayer,
    ts: number,
    activePowers: ActivePowerUp[]
  ) {
    const cx = pirate.x * ts + ts / 2;
    const cy = pirate.y * ts + ts / 2;
    const shipLength = ts * 1.15;
    const shipWidth = ts * 0.65;

    const hasGrog = activePowers.some(p => p.type === 'GROG');
    const hasInvisibility = activePowers.some(p => p.type === 'INVISIBILITY');
    const hasSpeed = activePowers.some(p => p.type === 'SPEED');

    // Direction heading in radians
    let heading = 0;
    if (pirate.dir === 'RIGHT') heading = 0;
    else if (pirate.dir === 'DOWN') heading = Math.PI / 2;
    else if (pirate.dir === 'LEFT') heading = Math.PI;
    else if (pirate.dir === 'UP') heading = -Math.PI / 2;

    // Ocean swell rocking physics: boat gently rolls and pitches on the sea waves
    const seaRoll = Math.sin(this.time * 5 + pirate.x * 2) * 0.08;
    const seaHeave = Math.cos(this.time * 4) * 1.2;

    ctx.save();
    ctx.translate(cx, cy + seaHeave);
    ctx.rotate(heading + seaRoll);

    // Spectral Phantom Ghost Ship mode
    if (hasInvisibility) {
      ctx.globalAlpha = 0.45;
      // Spectral glowing halo around the boat
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, shipLength * 0.7, shipWidth * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 1. Water Wake: Twin frothing white wake streams trailing behind the rudder
    ctx.strokeStyle = hasSpeed ? 'rgba(56, 189, 248, 0.65)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = hasSpeed ? 3.5 : 2;
    ctx.beginPath();
    ctx.moveTo(-shipLength * 0.45, -shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.85, -shipWidth * 0.55);
    ctx.moveTo(-shipLength * 0.45, shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.85, shipWidth * 0.55);
    ctx.stroke();

    // 2. Wooden Hull: Carved Oak Deck Planks and Pointed Bowsprit
    // Gunwale color based on character or power-up
    let hullColor = '#78350f'; // Rich dark oak
    let deckColor = '#b45309'; // Teak deck
    let trimColor = '#ef4444'; // Red pirate trim

    if (pirate.characterId === 'anne_bonny') {
      trimColor = '#0284c7'; // Caribbean turquoise
    } else if (pirate.characterId === 'calico_jack') {
      trimColor = '#f59e0b'; // Calico amber
    } else if (pirate.characterId === 'hypatia_navigator') {
      trimColor = '#3b82f6'; // Celestial sapphire
    } else if (pirate.characterId === 'archimedes_captain') {
      trimColor = '#10b981'; // Emerald brass
    }

    if (hasGrog) {
      // Broadside Overdrive: Blazing golden hull aura
      hullColor = '#9a3412';
      trimColor = '#eab308';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 12;
    }

    // Hull Outline (Pointed bow at right/front, curved midship, squared transom stern at left)
    ctx.fillStyle = hullColor;
    ctx.beginPath();
    ctx.moveTo(shipLength * 0.55, 0); // Bowsprit tip
    ctx.quadraticCurveTo(shipLength * 0.4, -shipWidth * 0.45, 0, -shipWidth * 0.45); // Port bow
    ctx.lineTo(-shipLength * 0.45, -shipWidth * 0.35); // Port stern
    ctx.lineTo(-shipLength * 0.45, shipWidth * 0.35); // Starboard stern
    ctx.lineTo(0, shipWidth * 0.45); // Starboard midship
    ctx.quadraticCurveTo(shipLength * 0.4, shipWidth * 0.45, shipLength * 0.55, 0); // Starboard bow
    ctx.closePath();
    ctx.fill();

    // Gunwale Trim
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 3. Wooden Deck Planks
    ctx.fillStyle = deckColor;
    ctx.beginPath();
    ctx.moveTo(shipLength * 0.35, 0);
    ctx.quadraticCurveTo(shipLength * 0.25, -shipWidth * 0.32, 0, -shipWidth * 0.32);
    ctx.lineTo(-shipLength * 0.35, -shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.35, shipWidth * 0.25);
    ctx.lineTo(0, shipWidth * 0.32);
    ctx.quadraticCurveTo(shipLength * 0.25, shipWidth * 0.32, shipLength * 0.35, 0);
    ctx.closePath();
    ctx.fill();

    // Deck plank seam lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-shipLength * 0.3, -shipWidth * 0.12);
    ctx.lineTo(shipLength * 0.25, -shipWidth * 0.12);
    ctx.moveTo(-shipLength * 0.3, shipWidth * 0.12);
    ctx.lineTo(shipLength * 0.25, shipWidth * 0.12);
    ctx.stroke();

    // 4. Broadside Cannons (port and starboard barrels pointing out)
    ctx.fillStyle = '#0f172a';
    // Port cannons
    ctx.fillRect(-shipLength * 0.15, -shipWidth * 0.55, 3, shipWidth * 0.2);
    ctx.fillRect(shipLength * 0.08, -shipWidth * 0.55, 3, shipWidth * 0.2);
    // Starboard cannons
    ctx.fillRect(-shipLength * 0.15, shipWidth * 0.35, 3, shipWidth * 0.2);
    ctx.fillRect(shipLength * 0.08, shipWidth * 0.35, 3, shipWidth * 0.2);

    // If Royal Grog is active: Cannons fire fiery muzzle flash smoke & sparks!
    if (hasGrog) {
      const flash = Math.sin(this.time * 16) > 0.3;
      if (flash) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-shipLength * 0.15, -shipWidth * 0.65, 3.5, 0, Math.PI * 2);
        ctx.arc(shipLength * 0.08, shipWidth * 0.65, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Center Mast, Yardarm & Rigging
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -shipWidth * 0.4);
    ctx.lineTo(0, shipWidth * 0.4);
    ctx.stroke();

    // 6. Billowing Canvas Sails with Pirate Jolly Roger Emblem
    const sailBillow = Math.sin(this.time * 6) * 1.5;
    const sailColor = hasGrog ? '#0f172a' : '#f8fafc'; // Black sails in grog mode, crisp white normally
    ctx.fillStyle = sailColor;
    ctx.beginPath();
    ctx.moveTo(-shipLength * 0.05, -shipWidth * 0.42);
    ctx.quadraticCurveTo(shipLength * 0.15 + sailBillow, 0, -shipLength * 0.05, shipWidth * 0.42);
    ctx.lineTo(-shipLength * 0.12, shipWidth * 0.38);
    ctx.quadraticCurveTo(shipLength * 0.08 + sailBillow, 0, -shipLength * 0.12, -shipWidth * 0.38);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = hasGrog ? '#eab308' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pirate Jolly Roger Skull stamped on the sail!
    ctx.fillStyle = hasGrog ? '#ef4444' : '#0f172a';
    ctx.beginPath();
    ctx.arc(shipLength * 0.05 + sailBillow * 0.5, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    // Crossed cutlasses under skull
    ctx.strokeStyle = hasGrog ? '#ef4444' : '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(shipLength * 0.02 + sailBillow * 0.5, -2.5);
    ctx.lineTo(shipLength * 0.08 + sailBillow * 0.5, 2.5);
    ctx.moveTo(shipLength * 0.02 + sailBillow * 0.5, 2.5);
    ctx.lineTo(shipLength * 0.08 + sailBillow * 0.5, -2.5);
    ctx.stroke();

    // 7. Pirate Flag / Masthead Pennant fluttering in the sea wind
    const flagFlutter = Math.sin(this.time * 12) * 2.5;
    ctx.fillStyle = hasGrog ? '#dc2626' : '#000000';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-shipLength * 0.3, -shipWidth * 0.2 + flagFlutter);
    ctx.lineTo(-shipLength * 0.22, 0);
    ctx.lineTo(-shipLength * 0.3, shipWidth * 0.2 + flagFlutter);
    ctx.closePath();
    ctx.fill();

    // 8. SPRITE-BASED ANIMATED PIRATE CAPTAIN AT THE HELM
    // Includes real walking cycle strides (boots, coat, cutlass swing) and gold collecting celebration!
    this.renderPirateCaptainSprite(ctx, pirate, ts, hasGrog, trimColor);

    // 9. DAMAGED HULL EFFECTS (Hit once: 1/2 HP!)
    if (pirate.hull === 1) {
      // Billowing black/grey smoke plumes and fire embers from damaged deck
      for (let s = 0; s < 3; s++) {
        const smokePhase = (this.time * 6 + s * 1.8) % 3;
        const sx = -shipLength * 0.2 - smokePhase * 4;
        const sy = -shipWidth * 0.15 - smokePhase * 2.5;
        const sr = 2.5 + smokePhase * 2.5;
        ctx.fillStyle = `rgba(60, 60, 60, ${Math.max(0, 0.7 - smokePhase * 0.2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();

        // Glowing red spark ember
        if (s === 0) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx + 2, sy + 1, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Blinking 1 HP warning
      const blink = Math.sin(this.time * 8) > 0;
      if (blink) {
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f87171';
        ctx.fillText('⚠️ 1 HP', 0, -shipWidth * 0.75);
      }
    }

    ctx.restore();
  }

  /**
   * Sprite-based Animated Pirate Captain:
   * - 8-frame walking stride cycle during movement (legs, coat sway, arm & cutlass swing, step ripples)
   * - Victorious gold-collecting celebration animation (raising gold coin aloft, starburst aura, pouch bounce)
   */
  private renderPirateCaptainSprite(
    ctx: CanvasRenderingContext2D,
    pirate: PiratePlayer,
    ts: number,
    hasGrog: boolean,
    coatColor: string
  ) {
    const isMoving = pirate.isMoving;
    const walkFrame = pirate.walkFrame || 0;
    const isCollectingGold = (pirate.collectGoldTimer || 0) > 0;

    // Walking gait calculations (alternating left/right leg strides)
    const stride = isMoving ? Math.sin(walkFrame * Math.PI) * (ts * 0.18) : 0;
    const walkBob = isMoving ? Math.abs(Math.sin(walkFrame * Math.PI)) * 1.5 : 0;
    const coatSway = isMoving ? Math.sin(walkFrame * Math.PI) * 2 : 0;
    const armSwing = isMoving ? Math.cos(walkFrame * Math.PI) * (ts * 0.15) : 0;

    ctx.save();
    ctx.translate(-ts * 0.05, -walkBob);

    // 1. Walking Boots (Alternating stride animation)
    ctx.fillStyle = '#1e1b4b'; // Dark leather boots
    // Left boot
    ctx.fillRect(-ts * 0.18 + stride, -ts * 0.25, ts * 0.14, ts * 0.12);
    // Right boot
    ctx.fillRect(-ts * 0.18 - stride, ts * 0.13, ts * 0.14, ts * 0.12);

    // Boot gold buckles
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-ts * 0.15 + stride, -ts * 0.23, 2, 3);
    ctx.fillRect(-ts * 0.15 - stride, ts * 0.15, 2, 3);

    // 2. Pirate Coat Body & Waistcoat
    ctx.fillStyle = coatColor;
    ctx.beginPath();
    ctx.ellipse(0, coatSway * 0.5, ts * 0.24, ts * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // White ruffled cravat / neck cloth
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(ts * 0.08, coatSway * 0.3, ts * 0.08, ts * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    // Leather weapon belt & coin loot pouch
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-ts * 0.1, -ts * 0.18, ts * 0.18, 3.5);

    // Bouncing gold coin pouch on belt
    const pouchBounce = isCollectingGold ? Math.sin(this.time * 20) * 3 : 0;
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(-ts * 0.08, ts * 0.18 + pouchBounce, ts * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-ts * 0.1, ts * 0.12 + pouchBounce, ts * 0.05, 2);

    // 3. Left & Right Arms / Cutlass / Gold Celebration
    if (isCollectingGold) {
      // CELEBRATION SPRITE: Hoisting gleaming gold coin high in victory!
      // Raised arm
      ctx.strokeStyle = coatColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -ts * 0.1);
      ctx.lineTo(ts * 0.25, -ts * 0.45);
      ctx.stroke();

      // Hand
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(ts * 0.25, -ts * 0.45, 3, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Gold Doubloon held aloft!
      const pulse = 1 + Math.sin(this.time * 25) * 0.2;
      const coinR = ts * 0.2 * pulse;

      // Radiant starburst rays
      const burstGrad = ctx.createRadialGradient(ts * 0.25, -ts * 0.45, 1, ts * 0.25, -ts * 0.45, coinR * 2.2);
      burstGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      burstGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
      burstGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = burstGrad;
      ctx.beginPath();
      ctx.arc(ts * 0.25, -ts * 0.45, coinR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // The shining Gold Coin
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(ts * 0.25, -ts * 0.45, coinR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(ts * 0.23, -ts * 0.47, coinR * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Gleaming sparkles popping
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ts * 0.25 + Math.cos(this.time * 15) * 6, -ts * 0.45 + Math.sin(this.time * 15) * 6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // NORMAL / WALKING STRIDE: Swinging Cutlass & Arm Cycle
      // Swinging arm with cutlass
      ctx.strokeStyle = '#e2e8f0'; // Silver cutlass blade
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ts * 0.05, ts * 0.15);
      ctx.lineTo(ts * 0.35 + armSwing, ts * 0.28);
      ctx.stroke();

      // Golden cutlass hilt guard
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(ts * 0.08, ts * 0.16, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Pirate Head & Face
    ctx.fillStyle = '#fed7aa'; // Pirate flesh tone
    ctx.beginPath();
    ctx.arc(ts * 0.12, 0, ts * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Jolly good eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ts * 0.18, -ts * 0.05, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ts * 0.19, -ts * 0.05, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Black Eyepatch & Strap
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ts * 0.18, ts * 0.05, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ts * 0.05, -ts * 0.1);
    ctx.lineTo(ts * 0.22, ts * 0.1);
    ctx.stroke();

    // Gold Earring
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ts * 0.05, -ts * 0.12, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Pirate Tricorn Captain's Hat with Skull
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(ts * 0.02, -ts * 0.22);
    ctx.lineTo(ts * 0.3, 0);
    ctx.lineTo(ts * 0.02, ts * 0.22);
    ctx.lineTo(ts * 0.12, 0);
    ctx.closePath();
    ctx.fill();

    // Tricorn gold brim trim
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Skull badge on hat
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(ts * 0.16, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    // Plume feather on hat bobbing with steps
    const featherBob = Math.sin(this.time * 8 + walkFrame) * 1.5;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(ts * 0.05, -ts * 0.2 + featherBob, 2, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * ROYAL NAVY WARSHIPS (Guards):
   * Imperial Men-of-War, Frigates, and Cutters hunting the pirate!
   */
  private renderNavyWarship(
    ctx: CanvasRenderingContext2D,
    guard: Guard,
    ts: number,
    activePowers: ActivePowerUp[]
  ) {
    const cx = guard.x * ts + ts / 2;
    const cy = guard.y * ts + ts / 2;
    const shipLength = ts * 1.15;
    const shipWidth = ts * 0.65;

    const isFrightened = guard.state === 'FRIGHTENED';
    const isReturning = guard.state === 'RETURNING';

    // Defeated State: Surviving Naval Life Dinghy rowing back to harbor
    if (isReturning) {
      this.renderNavalDinghy(ctx, cx, cy, ts, guard.dir);
      return;
    }

    // Direction heading in radians
    let heading = 0;
    if (guard.dir === 'RIGHT') heading = 0;
    else if (guard.dir === 'DOWN') heading = Math.PI / 2;
    else if (guard.dir === 'LEFT') heading = Math.PI;
    else if (guard.dir === 'UP') heading = -Math.PI / 2;

    const seaRoll = Math.sin(this.time * 6 + guard.x) * 0.06;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(heading + seaRoll);

    // Color logic: When frightened by Royal Grog, ships panic in royal blue / flashing white
    let hullColor = '#0f172a'; // Imperial dark navy
    let trimColor = guard.color; // Personality coat color (Sterling Red, Hastings Pink, O'Malley Cyan, Higgins Orange)
    let sailColor = '#ffffff';

    if (isFrightened) {
      if (guard.frightenedTimer < 2200 && Math.floor(this.time * 10) % 2 === 0) {
        hullColor = '#ffffff';
        trimColor = '#3b82f6';
      } else {
        hullColor = '#1e3a8a';
        trimColor = '#60a5fa';
      }
    }

    // 1. Water Wake behind naval ship
    ctx.strokeStyle = isFrightened ? 'rgba(147, 197, 253, 0.6)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-shipLength * 0.45, -shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.8, -shipWidth * 0.5);
    ctx.moveTo(-shipLength * 0.45, shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.8, shipWidth * 0.5);
    ctx.stroke();

    // 2. Naval Warship Hull (Heavy military prow with stern cabin gallery)
    ctx.fillStyle = hullColor;
    ctx.beginPath();
    ctx.moveTo(shipLength * 0.5, 0); // Ram bow
    ctx.lineTo(shipLength * 0.35, -shipWidth * 0.45);
    ctx.lineTo(-shipLength * 0.4, -shipWidth * 0.4);
    ctx.lineTo(-shipLength * 0.45, -shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.45, shipWidth * 0.25);
    ctx.lineTo(-shipLength * 0.4, shipWidth * 0.4);
    ctx.lineTo(shipLength * 0.35, shipWidth * 0.45);
    ctx.closePath();
    ctx.fill();

    // Naval Checker Stripe (The famous Nelson checker line)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-shipLength * 0.35, -shipWidth * 0.35, shipLength * 0.65, 2);
    ctx.fillRect(-shipLength * 0.35, shipWidth * 0.3, shipLength * 0.65, 2);

    // Coat trim gunwales
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Naval Cannons
    ctx.fillStyle = '#334155';
    ctx.fillRect(-shipLength * 0.15, -shipWidth * 0.5, 2.5, shipWidth * 0.15);
    ctx.fillRect(shipLength * 0.08, -shipWidth * 0.5, 2.5, shipWidth * 0.15);
    ctx.fillRect(-shipLength * 0.15, shipWidth * 0.35, 2.5, shipWidth * 0.15);
    ctx.fillRect(shipLength * 0.08, shipWidth * 0.35, 2.5, shipWidth * 0.15);

    // 4. Square-Rigged Imperial Sails
    if (!isFrightened) {
      // Main Yardarm
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -shipWidth * 0.45);
      ctx.lineTo(0, shipWidth * 0.45);
      ctx.stroke();

      // Square Royal Canvas Sail
      ctx.fillStyle = sailColor;
      ctx.beginPath();
      ctx.rect(-shipLength * 0.08, -shipWidth * 0.4, shipLength * 0.18, shipWidth * 0.8);
      ctx.fill();

      // Royal Ensign Cross stamped on sail
      ctx.fillStyle = trimColor;
      ctx.fillRect(-shipLength * 0.02, -shipWidth * 0.35, 3, shipWidth * 0.7);
      ctx.fillRect(-shipLength * 0.06, -1.5, shipLength * 0.12, 3);

      // Royal Navy Swallowtail Pennant Flag
      const flutter = Math.sin(this.time * 10 + guard.y) * 2;
      ctx.fillStyle = trimColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-shipLength * 0.35, -shipWidth * 0.15 + flutter);
      ctx.lineTo(-shipLength * 0.25, 0);
      ctx.lineTo(-shipLength * 0.35, shipWidth * 0.15 + flutter);
      ctx.closePath();
      ctx.fill();
    } else {
      // Panicked Fleeing State: Hoisting White Truce/Surrender Flag!
      const flagWave = Math.sin(this.time * 16) * 3;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-shipLength * 0.35, -shipWidth * 0.25 + flagWave);
      ctx.lineTo(-shipLength * 0.3, shipWidth * 0.25 + flagWave);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Defeated Sunk State: Wooden Life Dinghy with sailors rowing back to fort
   */
  private renderNavalDinghy(ctx: CanvasRenderingContext2D, cx: number, cy: number, ts: number, dir: string) {
    let heading = 0;
    if (dir === 'RIGHT') heading = 0;
    else if (dir === 'DOWN') heading = Math.PI / 2;
    else if (dir === 'LEFT') heading = Math.PI;
    else if (dir === 'UP') heading = -Math.PI / 2;

    const oarStroke = Math.sin(this.time * 12) * 0.45;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(heading);

    // Wooden life rowboat
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(0, 0, ts * 0.35, ts * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Interior deck
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 0, ts * 0.28, ts * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Two wooden oars rhythmically rowing
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Port oar
    ctx.moveTo(0, -ts * 0.1);
    ctx.lineTo(Math.cos(Math.PI / 2 + oarStroke) * ts * 0.45, -ts * 0.45);
    // Starboard oar
    ctx.moveTo(0, ts * 0.1);
    ctx.lineTo(Math.cos(-Math.PI / 2 - oarStroke) * ts * 0.45, ts * 0.45);
    ctx.stroke();

    // Sailor heads
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-ts * 0.1, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(ts * 0.1, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    ctx.save();
    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.shape === 'sparkle') {
        const s = p.size;
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.restore();
  }

  private renderScorePopups(ctx: CanvasRenderingContext2D, popups: ScorePopup[]) {
    ctx.save();
    ctx.font = 'bold 14px "Pirata One", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const pop of popups) {
      ctx.globalAlpha = pop.alpha;
      ctx.fillStyle = pop.color;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 5;
      ctx.fillText(pop.text, pop.x, pop.y);
    }
    ctx.restore();
  }

  private renderSpectralVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    const pulse = 0.5 + Math.sin(this.time * 4) * 0.2;
    const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    grad.addColorStop(1, `rgba(56, 189, 248, ${0.25 * pulse})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
