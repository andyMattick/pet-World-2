import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/gameEngine';
import { GRID_COLS, GRID_ROWS } from '../game/constants';
import { Compass, Minimize2, Sparkles, Coins, Landmark, Filter, Check } from 'lucide-react';
import { getLevelConfig } from '../game/levelProgression';

interface MiniMapProps {
  engine: GameEngine;
  className?: string;
}

type PinFilter = 'ALL' | 'MATH' | 'GOLD' | 'VAULT';

export const MiniMap: React.FC<MiniMapProps> = ({ engine, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<PinFilter>('ALL');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('corsairs_cove_minimap_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const levelConfig = getLevelConfig(engine.state.level);
  const nearestVaultData = engine.getNearestVaultDistance ? engine.getNearestVaultDistance() : null;
  const nearestVault = nearestVaultData ? nearestVaultData.vault : null;
  const nearestDistance = nearestVaultData ? nearestVaultData.distance : null;

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('corsairs_cove_minimap_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Count active math ciphers remaining on the current map
  let remainingMathCiphers = 0;
  if (engine.tiles) {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (engine.tiles[r]?.[c]?.startsWith('POWER')) {
          remainingMathCiphers++;
        }
      }
    }
  }

  // 60 FPS real-time rendering loop for mini-map
  useEffect(() => {
    if (isCollapsed) return;

    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cellW = 4.6;
      const cellH = 4.6;
      const width = Math.round(GRID_COLS * cellW);
      const height = Math.round(GRID_ROWS * cellH);

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Deep Ocean Background
      ctx.fillStyle = '#03101c';
      ctx.fillRect(0, 0, width, height);

      // Faint nautical latitude/longitude chart grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 0.5;
      for (let x = cellW * 4; x < width; x += cellW * 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = cellH * 4; y < height; y += cellH * 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const now = Date.now();
      const tiles = engine.tiles;
      const hasMathChallengeModal = engine.state.status === 'POWERUP_CHALLENGE' && engine.state.mathChallenge;
      const carriedCoins = engine.pirate?.carriedCoins || 0;

      // 2. Procedural Island Terrain (Atolls, Walls, Navigable Waterways)
      if (tiles && tiles.length > 0) {
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            const x = c * cellW;
            const y = r * cellH;

            if (tile === 'WALL') {
              // Island sandy shoreline edge
              ctx.fillStyle = '#0f2c38';
              ctx.fillRect(x, y, cellW, cellH);

              // Island tropical green atoll center
              ctx.fillStyle = '#059669';
              ctx.fillRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);
            } else if (tile === 'GATE') {
              // Navy Citadel boom log
              ctx.fillStyle = '#d97706';
              ctx.fillRect(x, y + 1.2, cellW, 1.8);
            }
          }
        }
      }

      // 3. Render COLOR-CODED PINS:

      // === PIN TYPE A: GOLD CACHES (Spanish Doubloons) ===
      if (tiles && tiles.length > 0) {
        const isGoldDimmed = activeFilter !== 'ALL' && activeFilter !== 'GOLD';
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            if (tile === 'COIN') {
              const cx = c * cellW + cellW / 2;
              const cy = r * cellH + cellH / 2;

              if (isGoldDimmed) {
                ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
                ctx.fillRect(cx - 0.7, cy - 0.7, 1.4, 1.4);
              } else {
                // Bright gold cache dot
                ctx.fillStyle = '#facc15';
                ctx.fillRect(cx - 0.8, cy - 0.8, 1.6, 1.6);

                // Highlight sweep if Gold filter selected
                if (activeFilter === 'GOLD') {
                  ctx.fillStyle = '#fef08a';
                  ctx.fillRect(cx - 1, cy - 1, 2, 2);
                }
              }
            }
          }
        }
      }

      // === PIN TYPE B: SPECIAL ISLAND LOCATIONS (Portals & Ammo Depots) ===
      if (tiles && tiles.length > 0) {
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            const cx = c * cellW + cellW / 2;
            const cy = r * cellH + cellH / 2;

            if (tile === 'PORTAL_WHIRLPOOL') {
              // Sea Portal Whirlpool (Cyan swirl pin)
              ctx.fillStyle = '#06b6d4';
              ctx.beginPath();
              ctx.arc(cx, cy, 2, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            } else if (tile === 'AMMO_DEPOT') {
              // Ammo Haven Depot (Sky blue crossed cannon dock)
              ctx.fillStyle = '#38bdf8';
              ctx.fillRect(cx - 1.2, cy - 1.2, 2.4, 2.4);

              ctx.strokeStyle = '#0284c7';
              ctx.lineWidth = 0.6;
              ctx.strokeRect(cx - 1.2, cy - 1.2, 2.4, 2.4);
            }
          }
        }
      }

      // === PIN TYPE C: ACTIVE MATH CHALLENGES (Power-up Ciphers) ===
      if (tiles && tiles.length > 0) {
        const isMathDimmed = activeFilter !== 'ALL' && activeFilter !== 'MATH';
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            if (tile && tile.startsWith('POWER')) {
              const cx = c * cellW + cellW / 2;
              const cy = r * cellH + cellH / 2;

              const isThisChallengeActive = 
                hasMathChallengeModal && 
                engine.state.mathChallenge?.tileCol === c && 
                engine.state.mathChallenge?.tileRow === r;

              ctx.save();
              if (isMathDimmed && !isThisChallengeActive) {
                // Dimmed inactive state
                ctx.fillStyle = 'rgba(217, 70, 239, 0.35)';
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                ctx.fill();
              } else {
                // Vibrant Fuchsia / Violet Math Challenge Pin
                const pulse = (now / 350) % 1;

                // Pulsing radiant cipher beacon ring
                const ringRadius = isThisChallengeActive ? 4.5 + pulse * 4 : 3 + pulse * 2.8;
                ctx.strokeStyle = isThisChallengeActive 
                  ? `rgba(244, 114, 182, ${0.9 * (1 - pulse)})` 
                  : `rgba(217, 70, 239, ${0.8 * (1 - pulse)})`;
                ctx.lineWidth = isThisChallengeActive ? 1.4 : 1;
                ctx.beginPath();
                ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Outer Diamond Pin Base
                ctx.fillStyle = isThisChallengeActive ? '#ec4899' : '#d946ef'; // Fuchsia / Pink
                ctx.beginPath();
                ctx.moveTo(cx, cy - 3.2);
                ctx.lineTo(cx + 3.2, cy);
                ctx.lineTo(cx, cy + 3.2);
                ctx.lineTo(cx - 3.2, cy);
                ctx.closePath();
                ctx.fill();

                // Inner Pin Core (Violet / White Math Symbol dot)
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
                ctx.fill();

                // Active challenge flashing marker
                if (isThisChallengeActive) {
                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 1;
                  ctx.stroke();
                }
              }
              ctx.restore();
            }
          }
        }
      }

      // === PIN TYPE E: SHIP REPAIR DOCKS (Careening Slipways) ===
      if (tiles && tiles.length > 0) {
        const isRepairNeeded = (engine.pirate?.hull ?? 2) < (engine.pirate?.maxHull ?? 2);
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            if (tile === 'REPAIR_DOCK' || tile === 'AMMO_DEPOT') {
              const cx = c * cellW + cellW / 2;
              const cy = r * cellH + cellH / 2;

              ctx.save();
              // If hull is damaged, pulse repair pin with bright emerald sonar ping!
              if (isRepairNeeded) {
                const repPulse = (now / 400) % 1;
                ctx.strokeStyle = `rgba(34, 197, 94, ${0.85 * (1 - repPulse)})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(cx, cy, 3 + repPulse * 4, 0, Math.PI * 2);
                ctx.stroke();
              }

              // Emerald Repair Dock Pin Base
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
              ctx.fill();

              // White Repair Cross
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(cx - 1.5, cy - 0.5, 3, 1);
              ctx.fillRect(cx - 0.5, cy - 1.5, 1, 3);

              ctx.restore();
            }
          }
        }
      }

      // === PIN TYPE D: PIRATE TREASURE VAULT (Cargo Banking & Visual Pulsating Beacon) ===
      if (tiles && tiles.length > 0) {
        const isVaultDimmed = activeFilter !== 'ALL' && activeFilter !== 'VAULT';
        const beaconTimer = engine.vaultBeaconTimer || now;
        const isCarrying = carriedCoins > 0;
        const isVaultFilterActive = activeFilter === 'VAULT';

        // 1. Waypoint Navigation Guide Beam from Player Flagship to Nearest Vault
        if ((isCarrying || isVaultFilterActive) && engine.pirate) {
          const nearestVaultQuery = engine.getNearestVaultDistance ? engine.getNearestVaultDistance() : null;
          if (nearestVaultQuery) {
            const px = engine.pirate.x * cellW + cellW / 2;
            const py = engine.pirate.y * cellH + cellH / 2;
            const nvx = nearestVaultQuery.vault.col * cellW + cellW / 2;
            const nvy = nearestVaultQuery.vault.row * cellH + cellH / 2;

            ctx.save();
            ctx.strokeStyle = isCarrying ? 'rgba(250, 204, 21, 0.7)' : 'rgba(251, 191, 36, 0.45)';
            ctx.lineWidth = isCarrying ? 1.2 : 0.9;
            ctx.setLineDash([3, 3]);
            ctx.lineDashOffset = -(now / 22);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nvx, nvy);
            ctx.stroke();

            // Animated beacon guide pulse blip traveling along the line towards vault
            const travelProg = ((now / 900) % 1);
            const bx = px + (nvx - px) * travelProg;
            const by = py + (nvy - py) * travelProg;
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // 2. Render Vault Pins with Visual Pulsating Beacon Effect
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            const tile = tiles[r]?.[c];
            if (tile === 'TREASURE_VAULT') {
              const cx = c * cellW + cellW / 2;
              const cy = r * cellH + cellH / 2;

              ctx.save();
              if (isVaultDimmed) {
                // Standby beacon ping even when other filters are active so player never loses bearing
                const faintPulse = (now / 700) % 1;
                ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 * (1 - faintPulse)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(cx, cy, 2.5 + faintPulse * 3.5, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
                ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
              } else {
                // === HIGH-VISIBILITY PULSATING BEACON EFFECT ===
                const waveCycle = isCarrying ? 750 : 1200;
                const sweepSpeed = isCarrying ? 900 : 1500;
                const maxBeaconRadius = isCarrying ? 16 : (isVaultFilterActive ? 18 : 13);

                // A. Atmospheric Golden Light Dome / Cove Ambient Glow
                const glowRadius = isCarrying ? 14 + Math.sin(now / 150) * 3 : 10 + Math.sin(now / 250) * 2;
                const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, glowRadius);
                glow.addColorStop(0, isCarrying ? 'rgba(251, 191, 36, 0.65)' : 'rgba(245, 158, 11, 0.45)');
                glow.addColorStop(0.4, isCarrying ? 'rgba(234, 179, 8, 0.3)' : 'rgba(217, 119, 6, 0.18)');
                glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                // B. Rotating Lighthouse Sweeping Beacon Rays
                const sweepAngle = (beaconTimer / sweepSpeed) * Math.PI * 2;
                const beamLength = isCarrying ? 24 : 18;
                const beamSpread = 0.32; // radians

                const beamGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, beamLength);
                beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
                beamGrad.addColorStop(0.45, 'rgba(250, 204, 21, 0.28)');
                beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
                ctx.fillStyle = beamGrad;

                // Main forward sweep beam
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, beamLength, sweepAngle - beamSpread, sweepAngle + beamSpread);
                ctx.closePath();
                ctx.fill();

                // Secondary subtle opposite counter-beam
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, beamLength * 0.65, sweepAngle + Math.PI - beamSpread * 0.7, sweepAngle + Math.PI + beamSpread * 0.7);
                ctx.closePath();
                ctx.fill();

                // C. Triple Concentric Expanding Sonar Beacon Waves
                const waves = [
                  (beaconTimer / waveCycle) % 1,
                  ((beaconTimer + waveCycle * 0.33) / waveCycle) % 1,
                  ((beaconTimer + waveCycle * 0.66) / waveCycle) % 1,
                ];

                for (let i = 0; i < waves.length; i++) {
                  const wave = waves[i];
                  const minRadius = 2.5;
                  const radius = minRadius + wave * (maxBeaconRadius - minRadius);
                  const alpha = (1 - wave) * (isCarrying ? 0.95 : 0.75);

                  ctx.strokeStyle = isCarrying
                    ? `rgba(253, 224, 71, ${alpha})`
                    : `rgba(245, 158, 11, ${alpha})`;
                  ctx.lineWidth = isCarrying ? (wave < 0.25 ? 1.8 : 1.2) : (wave < 0.25 ? 1.4 : 0.9);
                  ctx.beginPath();
                  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                  ctx.stroke();
                }

                // D. Beacon Tower & Pin Structure
                // Dark wooden pier foundation ring
                ctx.fillStyle = '#451a03';
                ctx.beginPath();
                ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
                ctx.fill();

                // Golden Citadel Shield Pin
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(cx, cy, 3.1, 0, Math.PI * 2);
                ctx.fill();

                // Radiant yellow top plate
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(cx - 1.4, cy - 1.4, 2.8, 2.8);

                // Core vault chest emblem
                ctx.fillStyle = '#78350f';
                ctx.fillRect(cx - 0.8, cy - 0.8, 1.6, 1.6);

                // Central Beacon Flash Glint
                const pulseIntensity = (Math.sin(beaconTimer / 120) + 1) / 2;
                ctx.fillStyle = pulseIntensity > 0.6 ? '#ffffff' : '#fde047';
                ctx.beginPath();
                ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
                ctx.fill();

                // 4-point beacon glint cross at peak pulse
                if (pulseIntensity > 0.5) {
                  const glintLen = 2.4 + pulseIntensity * 1.2;
                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 0.8;
                  ctx.beginPath();
                  ctx.moveTo(cx - glintLen, cy);
                  ctx.lineTo(cx + glintLen, cy);
                  ctx.moveTo(cx, cy - glintLen);
                  ctx.lineTo(cx, cy + glintLen);
                  ctx.stroke();
                }

                // Tiny top beacon spire light
                ctx.fillStyle = '#fde047';
                ctx.fillRect(cx - 0.5, cy - 4.5, 1, 1.8);
                ctx.beginPath();
                ctx.arc(cx, cy - 4.8, 1, 0, Math.PI * 2);
                ctx.fill();

                // Always show high-visibility "VAULT 🏛️" or "BANK!" tag on mini-map chart
                ctx.save();
                const labelStr = isCarrying ? 'BANK!' : 'VAULT';
                ctx.font = 'bold 6.5px monospace';
                ctx.textAlign = 'center';
                const labelW = ctx.measureText(labelStr).width;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
                ctx.fillRect(cx - labelW / 2 - 2, cy + 5.2, labelW + 4, 8);
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 0.6;
                ctx.strokeRect(cx - labelW / 2 - 2, cy + 5.2, labelW + 4, 8);

                ctx.fillStyle = isCarrying ? '#fde047' : '#fef08a';
                ctx.fillText(labelStr, cx, cy + 11.2);
                ctx.restore();
              }
              ctx.restore();
            }
          }
        }
      }

      // 4. Royal Navy Warships (Red Fleet Tracking Blips)
      if (engine.guards) {
        for (const g of engine.guards) {
          const gx = g.x * cellW + cellW / 2;
          const gy = g.y * cellH + cellH / 2;

          ctx.fillStyle = g.state === 'FRIGHTENED' ? '#38bdf8' : g.state === 'IN_PEN' ? '#f59e0b' : '#ef4444';
          ctx.beginPath();
          ctx.arc(gx, gy, g.state === 'IN_PEN' ? 1.4 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Island Naval Bases on chart
      const NAVAL_BASE_COORDS = [
        { c: 13, r: 3 },
        { c: 24, r: 5 },
        { c: 4, r: 5 },
        { c: 24, r: 13 },
        { c: 23, r: 24 },
        { c: 4, r: 24 },
      ];
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      for (const nb of NAVAL_BASE_COORDS) {
        const nx = nb.c * cellW + cellW / 2;
        const ny = nb.r * cellH + cellH / 2;
        ctx.fillRect(nx - 1, ny - 1, 2, 2);
      }

      // 5. Player Pirate Flagship (Emerald / Lime Ship Marker with Heading Arrow)
      const p = engine.pirate;
      if (p) {
        const px = p.x * cellW + cellW / 2;
        const py = p.y * cellH + cellH / 2;

        // Pulsing radar ping around player ship
        const playerPulse = (now / 380) % 1;
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.85 * (1 - playerPulse)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, py, 3.2 + playerPulse * 3.8, 0, Math.PI * 2);
        ctx.stroke();

        // Directional Ship Pointer
        let angle = 0;
        if (p.dir === 'UP') angle = -Math.PI / 2;
        else if (p.dir === 'DOWN') angle = Math.PI / 2;
        else if (p.dir === 'LEFT') angle = Math.PI;
        else angle = 0;

        ctx.fillStyle = '#22c55e'; // Emerald Flagship
        ctx.beginPath();
        const tipX = px + Math.cos(angle) * 4.2;
        const tipY = py + Math.sin(angle) * 4.2;
        const leftX = px + Math.cos(angle + 2.5) * 2.8;
        const leftY = py + Math.sin(angle + 2.5) * 2.8;
        const rightX = px + Math.cos(angle - 2.5) * 2.8;
        const rightY = py + Math.sin(angle - 2.5) * 2.8;

        ctx.moveTo(tipX, tipY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [engine, isCollapsed, activeFilter]);

  // Collapsed Minimalist View
  if (isCollapsed) {
    return (
      <div className={`select-none pointer-events-auto ${className}`}>
        <button
          id="expand-minimap-btn"
          onClick={toggleCollapsed}
          className="w-10 h-10 rounded-xl bg-slate-900/90 border border-amber-500/50 hover:border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shadow-black/70 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          title="Open Island Sea Chart & Tactical Pins"
          aria-label="Expand Island Mini-Map"
        >
          <Compass className="w-5 h-5 text-amber-400" />
        </button>
      </div>
    );
  }

  const isMathChallengeActive = engine.state.status === 'POWERUP_CHALLENGE';

  return (
    <div
      id="island-minimap-container"
      className={`select-none pointer-events-auto rounded-xl border border-amber-500/40 bg-slate-950/95 backdrop-blur-md shadow-2xl shadow-black/80 flex flex-col p-2 text-slate-100 w-[148px] animate-fade-in transition-all ${className}`}
    >
      {/* Mini-Map Header */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-serif">
            Sea Chart
          </span>
        </div>
        <button
          id="collapse-minimap-btn"
          onClick={toggleCollapsed}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
          title="Minimize Chart"
          aria-label="Collapse Island Mini-Map"
        >
          <Minimize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Strategic Pin Filter Bar */}
      <div className="flex items-center justify-between gap-1 mb-1.5 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800/80 text-[9px] font-bold">
        <button
          id="filter-all-pins"
          onClick={() => setActiveFilter('ALL')}
          className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Show All Pins"
        >
          All
        </button>
        <button
          id="filter-math-pins"
          onClick={() => setActiveFilter('MATH')}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            activeFilter === 'MATH'
              ? 'bg-fuchsia-600 text-white shadow-sm'
              : 'text-fuchsia-400 hover:text-fuchsia-300'
          }`}
          title="Focus on Active Math Challenges"
        >
          <span>◆</span>
          <span>Math</span>
        </button>
        <button
          id="filter-gold-pins"
          onClick={() => setActiveFilter('GOLD')}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            activeFilter === 'GOLD'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-amber-400 hover:text-amber-300'
          }`}
          title="Focus on Gold Caches"
        >
          <span>●</span>
          <span>Gold</span>
        </button>
        <button
          id="filter-vault-pins"
          onClick={() => setActiveFilter('VAULT')}
          className={`relative flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            activeFilter === 'VAULT'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-amber-400 hover:text-amber-300'
          }`}
          title="Focus on Vault Deposit Point & Beacon"
        >
          <span>🏛️</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
        </button>
      </div>

      {/* Island Mini-Map Canvas */}
      <div className="relative rounded border border-slate-800/90 overflow-hidden bg-[#03101c] shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          id="minimap-canvas"
          style={{ width: '130px', height: '144px' }}
          className="block"
        />

        {/* Compass Rose Mark */}
        <div className="absolute bottom-1 right-1 pointer-events-none opacity-40 text-[8px] font-mono font-bold text-amber-300">
          N
        </div>

        {/* Pulsating Vault Beacon Cargo Alert Badge */}
        {engine.pirate?.carriedCoins > 0 && !isMathChallengeActive && (
          <div className="absolute top-1 left-1 pointer-events-none px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/80 text-[7.5px] font-bold text-amber-200 animate-pulse flex items-center gap-1 shadow-sm shadow-black/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>BEACON PULSING: BANK {engine.pirate.carriedCoins}🪙</span>
          </div>
        )}

        {/* Active Math Cipher Alert Overlay badge if currently solving */}
        {isMathChallengeActive && (
          <div className="absolute top-1 left-1 pointer-events-none px-1 py-0.5 rounded bg-fuchsia-950/90 border border-fuchsia-500/80 text-[8px] font-bold text-fuchsia-200 animate-pulse flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping inline-block" />
            <span>CIPHER ACTIVE!</span>
          </div>
        )}
      </div>

      {/* Strategic Color-Coded Pins Legend */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex flex-col gap-1 text-[9px] font-medium leading-tight">
        {/* 1. Active Math Challenge Pin */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'MATH' ? 'ALL' : 'MATH')}
          className={`flex items-center justify-between p-1 rounded transition-colors cursor-pointer ${
            activeFilter === 'MATH' ? 'bg-fuchsia-950/70 border border-fuchsia-500/50' : 'hover:bg-slate-900/60'
          }`}
          title="Math Cipher Coves: Solve arithmetic problems to unlock combat powers & ammunition"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rotate-45 bg-fuchsia-500 border border-fuchsia-300 shadow-sm shadow-fuchsia-500/50 shrink-0" />
            <span className="font-bold text-fuchsia-300">Math Ciphers</span>
          </div>
          <span className="text-fuchsia-400 font-mono font-bold text-[8.5px]">
            {remainingMathCiphers} coves
          </span>
        </div>

        {/* 2. Gold Caches Pin */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'GOLD' ? 'ALL' : 'GOLD')}
          className={`flex items-center justify-between p-1 rounded transition-colors cursor-pointer ${
            activeFilter === 'GOLD' ? 'bg-amber-950/70 border border-amber-500/50' : 'hover:bg-slate-900/60'
          }`}
          title="Gold Caches: Floating Spanish doubloons to gather across the island waterways"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50 shrink-0" />
            <span className="text-amber-200 font-semibold">Gold Caches</span>
          </div>
          <span className="text-amber-400 font-mono font-bold text-[8.5px]">
            {engine.state.coinsRemaining} left
          </span>
        </div>

        {/* 3. Treasure Vault Pin with Visual Pulsating Beacon Status */}
        <div 
          id="minimap-legend-vault"
          onClick={() => setActiveFilter(activeFilter === 'VAULT' ? 'ALL' : 'VAULT')}
          className={`flex flex-col gap-0.5 p-1 rounded transition-all cursor-pointer ${
            activeFilter === 'VAULT' 
              ? 'bg-amber-950/80 border border-amber-400/80 shadow-md shadow-amber-950/60' 
              : 'hover:bg-slate-900/60 border border-transparent'
          } ${engine.pirate?.carriedCoins > 0 ? 'bg-amber-950/60 border-amber-500/60 ring-1 ring-amber-500/40' : ''}`}
          title="Treasure Vault Pier: Pulsating golden beacon marks your deposit point across the islands. Sail in to bank cargo doubloons for +15x bonus score!"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-amber-400 text-[10px] leading-none shrink-0">🏛️</span>
              <span className="text-yellow-300 font-bold">Island Vault</span>
            </div>
            <span className="text-amber-300 font-mono font-bold text-[8.5px]">
              {engine.pirate?.carriedCoins > 0 ? `+${engine.pirate.carriedCoins * 15} pts` : 'Deposit'}
            </span>
          </div>
          {/* Real-time Beacon Status & Distance Indicator */}
          <div className="flex items-center justify-between text-[8px] pl-3.5 text-amber-200/90 font-mono leading-none">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              <span>Beacon: {nearestDistance !== null ? `${Math.round(nearestDistance)} nm` : 'Active'}</span>
            </span>
            {engine.pirate?.carriedCoins > 0 ? (
              <span className="text-emerald-400 font-bold animate-pulse">BANK CARGO!</span>
            ) : (
              <span className="text-amber-400/80">Pulsing</span>
            )}
          </div>
        </div>

        {/* 4. Ship Repair Docks Pin */}
        <div 
          className="flex items-center justify-between p-1 rounded hover:bg-slate-900/60 transition-colors"
          title="Repair Stops: Sail into drydock to repair damaged ship hull back to 100%!"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 shrink-0" />
            <span className="text-emerald-300 font-bold">Repair Docks</span>
          </div>
          <span className="text-emerald-400 font-mono font-bold text-[8.5px]">
            {(engine.pirate?.hull ?? 2) < (engine.pirate?.maxHull ?? 2) ? '⚠️ Visit!' : 'Full HP'}
          </span>
        </div>
      </div>
    </div>
  );
};
