import React, { useRef, useEffect, useState } from 'react';
import { Cell, Direction, Position, AbilityType } from '../types/game';
import { PlayerSprite } from './PlayerSprite';
import {
  Flag,
  Bomb,
  ShieldAlert,
  Sparkles,
  Box,
  Wrench,
  Droplets,
  Zap,
  AlertTriangle,
  Eye,
  Radio,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface MinefieldGridProps {
  grid: Cell[][];
  width: number;
  height: number;
  playerPos: Position;
  playerDirection: Direction;
  isMoving: boolean;
  hasArmor: boolean;
  isJumping: boolean;
  activeTargetingAbility: AbilityType | null;
  onCellClick: (x: number, y: number) => void;
  onCellContextMenu: (x: number, y: number, e: React.MouseEvent) => void;
  empEffectPos: Position | null;
  sonarEffectPos: Position | null;
  // Dynamic Hazards & Visual Cues
  isEndless?: boolean;
  collapseRow?: number;
  bombDetonationCue?: { active: boolean; wasFatal: boolean; x: number; y: number } | null;
  mudNotice?: boolean;
  // Fog of War
  isFogOfWar?: boolean;
  visionRange?: number;
  // False Defusal Penalty Alert
  falseDefusalAlert?: string | null;
  watchtowerNotice?: string | null;
  crateNotice?: { title: string; subtitle: string; iconType: string } | null;
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-400 font-bold',
  2: 'text-emerald-400 font-bold',
  3: 'text-rose-500 font-black',
  4: 'text-purple-400 font-black',
  5: 'text-amber-500 font-black',
  6: 'text-cyan-300 font-black',
  7: 'text-slate-100 font-black',
  8: 'text-slate-400 font-black'
};

export const MinefieldGrid: React.FC<MinefieldGridProps> = ({
  grid,
  width,
  height,
  playerPos,
  playerDirection,
  isMoving,
  hasArmor,
  isJumping,
  activeTargetingAbility,
  onCellClick,
  onCellContextMenu,
  empEffectPos,
  sonarEffectPos,
  isEndless,
  collapseRow = -1,
  bombDetonationCue,
  mudNotice,
  isFogOfWar = true,
  visionRange = 3.5,
  falseDefusalAlert,
  watchtowerNotice,
  crateNotice
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Dedicated helper to scroll camera to row 0 (Extraction Zone)
  const scrollToLZ = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Dedicated helper to center camera on Miller
  const scrollToPlayer = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const playerEl = document.getElementById(`cell-${playerPos.x}-${playerPos.y}`);
    if (playerEl) {
      const containerRect = container.getBoundingClientRect();
      const playerRect = playerEl.getBoundingClientRect();
      const currentScrollTop = container.scrollTop;
      const relativeTop = playerRect.top - containerRect.top + currentScrollTop;
      const targetScroll = Math.max(0, relativeTop - container.clientHeight * 0.55);
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll to track player as they move forward across the field
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const playerEl = document.getElementById(`cell-${playerPos.x}-${playerPos.y}`);
    if (playerEl) {
      const containerRect = container.getBoundingClientRect();
      const playerRect = playerEl.getBoundingClientRect();
      const currentScrollTop = container.scrollTop;
      const relativeTop = playerRect.top - containerRect.top + currentScrollTop;
      // Position player at ~60% down so the field ahead towards extraction (row 0) is wide open!
      const targetScroll = Math.max(0, relativeTop - container.clientHeight * 0.6);
      container.scrollTo({
        top: targetScroll,
        behavior: isMoving ? 'auto' : 'smooth'
      });
    }
  }, [playerPos.x, playerPos.y, isMoving, isJumping]);

  // Check if a cell is an adjacent legal walking step (orthogonal or diagonal)
  const isAdjacentWalkable = (x: number, y: number): boolean => {
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
  };

  // Check if a cell is a valid 2-tile leap target
  const isValidJumpTarget = (x: number, y: number): boolean => {
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    return (dx === 2 && dy === 0) || (dx === 0 && dy === 2) || (dx === 2 && dy === 2);
  };

  // Check if a cell is a valid drone target (within 4 distance)
  const isValidDroneTarget = (x: number, y: number): boolean => {
    const dist = Math.hypot(x - playerPos.x, y - playerPos.y);
    return dist <= 4.2 && !(x === playerPos.x && y === playerPos.y);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex-1 overflow-y-auto overflow-x-auto flex flex-col items-center justify-start p-3 sm:p-6 pb-28 bg-slate-950 select-none min-h-[460px] ${
        bombDetonationCue?.active ? 'animate-bounce' : ''
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, transparent 80%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px'
      }}
    >
      {/* Red flash vignette cue when stepping on a bomb */}
      {bombDetonationCue?.active && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-red-600/30 animate-pulse border-8 border-red-500" />
      )}

      {/* Sticky Extraction Zone Beacon & Quick Camera Controls */}
      <div className="sticky top-0 z-30 w-full max-w-lg mb-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/95 border-2 border-emerald-500/80 shadow-2xl backdrop-blur-md text-emerald-300 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="font-bold tracking-wider">
            {isEndless
              ? `DISTANCE SURVIVED: ${playerPos.y}m`
              : `EXTRACTION LZ ALPHA: ${playerPos.y} ${playerPos.y === 1 ? 'ROW' : 'ROWS'} AHEAD`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {!isEndless && (
            <button
              onClick={scrollToLZ}
              className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-400 text-[10px] text-emerald-300 font-bold transition-all shadow-xs hover:scale-105 cursor-pointer"
              title="Pan camera to Extraction Landing Zone at Row 0"
            >
              ▲ View LZ
            </button>
          )}
          <button
            onClick={scrollToPlayer}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] text-slate-300 font-bold transition-all shadow-xs hover:scale-105 cursor-pointer"
            title="Focus camera back on Specialist Miller"
          >
            🎯 Focus Miller
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="relative flex flex-col items-center">
        {/* Floating Bomb Detonation Cue Banner */}
        {bombDetonationCue?.active && (
          <div
            className={`absolute -top-12 z-50 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl animate-bounce ${
              bombDetonationCue.wasFatal
                ? 'bg-red-600 text-white border-2 border-red-400'
                : 'bg-amber-500 text-slate-950 border-2 border-yellow-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {bombDetonationCue.wasFatal
                ? 'CRITICAL DETONATION! FATAL BLAST DETECTED!'
                : 'MINE DETONATED! KEVLAR ARMOR SAVED YOU (-1 SHIELD)'}
            </span>
          </div>
        )}

        {/* Floating Watchtower Recon Announcement */}
        {watchtowerNotice && (
          <div className="absolute -top-12 z-40 px-4 py-2 rounded-xl bg-indigo-950/95 border-2 border-indigo-400 text-indigo-100 text-xs font-mono flex items-center gap-2 shadow-2xl animate-bounce">
            <Eye className="w-4 h-4 text-indigo-300 shrink-0" />
            <span className="font-bold">{watchtowerNotice}</span>
          </div>
        )}

        {/* Floating Supply Crate Pickup Toast */}
        {crateNotice && (
          <div className="absolute -top-12 z-40 px-4 py-2 rounded-xl bg-slate-900/95 border-2 border-amber-400 text-amber-200 text-xs font-mono flex items-center gap-2.5 shadow-2xl animate-bounce">
            <Box className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300">{crateNotice.title}: </span>
              <span className="text-slate-200">{crateNotice.subtitle}</span>
            </div>
          </div>
        )}

        {/* Mud slow notice */}
        {mudNotice && !crateNotice && !watchtowerNotice && (
          <div className="absolute -top-10 z-40 px-3 py-1 rounded-lg bg-amber-950/90 border border-amber-600/70 text-amber-300 text-xs font-mono flex items-center gap-1.5 shadow-lg animate-pulse">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>MUD SLOG! (+1 Move Cost)</span>
          </div>
        )}

        {/* False Defusal Penalty Alert */}
        {falseDefusalAlert && !crateNotice && !watchtowerNotice && (
          <div className="absolute -top-11 z-40 px-3 py-1.5 rounded-lg bg-rose-950/95 border-2 border-rose-500 text-rose-200 text-xs font-mono flex items-center gap-2 shadow-2xl animate-bounce">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{falseDefusalAlert}</span>
          </div>
        )}

        {/* Top Extraction Banner / Endless Distance Indicator */}
        <div className="w-full mb-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-semibold tracking-wider">
              {isEndless ? 'ENDLESS EXTRACTION RUN' : 'EXTRACTION ZONE [LZ ALPHA]'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400">
            {isEndless ? 'SURVIVE THE CREEPING BARRAGE' : 'MISSION OBJECTIVE'}
          </span>
        </div>

        {/* Cells Grid */}
        <div
          className="grid gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(40px, 52px))`
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPlayerHere = playerPos.x === x && playerPos.y === y;
              const isExtractionRow = !isEndless && y === 0;
              const isStartRow = !isEndless && y === height - 1;
              const isConsumedByBarrage = isEndless && y >= collapseRow;
              const canWalkHere = isAdjacentWalkable(x, y);
              const canJumpHere = activeTargetingAbility === 'jump' && isValidJumpTarget(x, y);
              const canDroneHere = activeTargetingAbility === 'drone' && isValidDroneTarget(x, y);
              const isBombDetonationTile =
                bombDetonationCue?.active && bombDetonationCue.x === x && bombDetonationCue.y === y;

              // Fog of War calculation
              let fogLevel = 0; // 0 = clear illumination, 1 = twilight edge, 2 = deep darkness
              if (isFogOfWar) {
                const dist = Math.hypot(x - playerPos.x, y - playerPos.y);

                // Directional Flashlight cone bonus (extends 4.5 tiles ahead of Miller)
                let inFlashlight = false;
                if (playerDirection === 'N' && y < playerPos.y && y >= playerPos.y - 4.5 && Math.abs(x - playerPos.x) <= 1.2) {
                  inFlashlight = true;
                } else if (playerDirection === 'S' && y > playerPos.y && y <= playerPos.y + 4.5 && Math.abs(x - playerPos.x) <= 1.2) {
                  inFlashlight = true;
                } else if (playerDirection === 'E' && x > playerPos.x && x <= playerPos.x + 4.5 && Math.abs(y - playerPos.y) <= 1.2) {
                  inFlashlight = true;
                } else if (playerDirection === 'W' && x < playerPos.x && x >= playerPos.x - 4.5 && Math.abs(y - playerPos.y) <= 1.2) {
                  inFlashlight = true;
                }

                const inSonar = sonarEffectPos ? Math.hypot(x - sonarEffectPos.x, y - sonarEffectPos.y) <= 3.8 : false;

                if (dist <= (visionRange ?? 3.5) || inFlashlight || inSonar || isPlayerHere) {
                  fogLevel = 0;
                } else if (dist <= (visionRange ?? 3.5) + 2.0) {
                  fogLevel = 1;
                } else {
                  fogLevel = 2;
                }

                // EXTRACTION ZONE BEACONS: LZ Alpha transmits illuminated guidance flares!
                // Never obscured in deep black fog so player can always locate the extraction line.
                if (isExtractionRow) {
                  fogLevel = Math.min(fogLevel, 1);
                }
              }

              return (
                <div
                  key={`${x}-${y}`}
                  id={`cell-${x}-${y}`}
                  onClick={() => onCellClick(x, y)}
                  onContextMenu={(e) => onCellContextMenu(x, y, e)}
                  className={`
                    relative aspect-square rounded-lg flex items-center justify-center font-mono text-base font-bold transition-all duration-150 cursor-pointer overflow-hidden
                    ${
                      isConsumedByBarrage
                        ? 'bg-red-950/90 border border-red-700/60 opacity-60 shadow-inner'
                        : isBombDetonationTile
                        ? 'bg-red-600 border-4 border-yellow-400 shadow-2xl animate-ping scale-110 z-30'
                        : fogLevel === 2
                        ? 'bg-slate-950/95 border border-slate-900/80 opacity-25 filter brightness-50'
                        : fogLevel === 1
                        ? 'opacity-65 filter brightness-75 ' + (cell.state === 'revealed' ? 'bg-slate-800/70 border border-slate-750' : 'bg-slate-900 border border-slate-800')
                        : cell.state === 'revealed'
                        ? isExtractionRow
                          ? 'bg-emerald-950/50 border border-emerald-500/60 shadow-inner'
                          : isStartRow
                          ? 'bg-slate-850 border border-slate-700/80'
                          : 'bg-slate-800/90 border border-slate-700/50 shadow-inner'
                        : cell.state === 'flagged'
                        ? cell.isDefused
                          ? 'bg-emerald-950/80 border-2 border-emerald-400 shadow-md shadow-emerald-500/30'
                          : 'bg-amber-950/70 border border-amber-500 shadow-md shadow-amber-500/20'
                        : cell.state === 'exploded'
                        ? 'bg-red-950 border-2 border-red-500 shadow-lg shadow-red-500/40'
                        : cell.state === 'disarmed'
                        ? 'bg-slate-800 border border-cyan-500/50'
                        : cell.hazard === 'electric_fence'
                        ? 'bg-cyan-950/80 border-2 border-cyan-400 shadow-md shadow-cyan-400/20'
                        : cell.hazard === 'mud'
                        ? 'bg-amber-950/40 border border-amber-800/60'
                        : cell.hasWatchtower && !cell.isWatchtowerActivated
                        ? 'bg-indigo-950/60 border-2 border-indigo-400/80 shadow-md shadow-indigo-500/20'
                        : isExtractionRow
                        ? 'bg-emerald-950/40 border border-emerald-600/50 hover:bg-emerald-900/40'
                        : 'bg-slate-850 hover:bg-slate-800 border border-slate-750/90 hover:border-slate-600 shadow-xs'
                    }
                    ${
                      canJumpHere
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105 bg-amber-950/60'
                        : canDroneHere
                        ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-900 scale-105 bg-violet-950/60'
                        : canWalkHere && cell.state !== 'flagged' && !activeTargetingAbility && !isConsumedByBarrage
                        ? 'hover:ring-1 hover:ring-amber-400/60 hover:border-amber-400/40'
                        : ''
                    }
                  `}
                >
                  <span className="sr-only">Cell {x}, {y}</span>

                  {/* Deep Fog Mist Overlay */}
                  {fogLevel === 2 && (
                    <div className="absolute inset-0 bg-slate-950/90 pointer-events-none flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
                    </div>
                  )}

                  {/* Consumed by barrage smoke/crater */}
                  {isConsumedByBarrage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/80 text-red-500/60 text-xs pointer-events-none">
                      ✕
                    </div>
                  )}

                  {/* Cell Content (Obscured when in deep fog) */}
                  <div
                    className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${
                      fogLevel === 2 ? 'opacity-0' : fogLevel === 1 ? 'opacity-65' : 'opacity-100'
                    }`}
                  >
                    {cell.state === 'flagged' ? (
                      cell.isDefused ? (
                        /* Defused Bomb Visual Badge */
                        <div
                          className="flex flex-col items-center justify-center text-emerald-400 drop-shadow-md animate-pulse"
                          title="DEFUSED BOMB! Threat neutralized; neighboring clues no longer count this mine."
                        >
                          <div className="relative">
                            <Wrench className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                          </div>
                          <span className="text-[8px] font-mono font-black text-emerald-400 tracking-tighter uppercase">
                            DEFUSED
                          </span>
                        </div>
                      ) : (
                        /* Normal Flag on suspected tile */
                        <div
                          className="flex flex-col items-center justify-center text-amber-400 drop-shadow-md animate-bounce"
                          title="Flagged suspected mine"
                        >
                          <Flag className="w-4 h-4 fill-amber-400" />
                        </div>
                      )
                    ) : cell.state === 'exploded' ? (
                      <div className="flex flex-col items-center justify-center text-red-500 animate-pulse">
                        <Bomb className="w-5 h-5 fill-red-600" />
                        <span className="text-[7px] text-red-400 font-mono font-bold">DETONATED</span>
                      </div>
                    ) : cell.state === 'disarmed' ? (
                      <div className="flex items-center justify-center text-cyan-400 opacity-70">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    ) : cell.state === 'revealed' ? (
                      cell.isMine ? (
                        <Bomb className="w-4 h-4 text-red-400" />
                      ) : cell.neighborMines > 0 ? (
                        <span className={`select-none ${NUMBER_COLORS[cell.neighborMines] || 'text-slate-200'}`}>
                          {cell.neighborMines}
                        </span>
                      ) : isExtractionRow ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
                      ) : null
                    ) : null}

                    {/* Military Extraction Landing Zone Beacon Flares on Row 0 */}
                    {isExtractionRow && cell.state !== 'exploded' && cell.state !== 'flagged' && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-emerald-950/70 border-2 border-emerald-400/90 rounded-lg shadow-md shadow-emerald-500/20"
                        title="Extraction Zone [LZ Alpha]: Reach this row to extract and complete the mission!"
                      >
                        <div className="relative flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping absolute" />
                          <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block shadow-xs shadow-emerald-400" />
                        </div>
                        <span className="text-[6.5px] font-mono font-black text-emerald-300 uppercase tracking-tighter mt-0.5">
                          LZ ALPHA
                        </span>
                      </div>
                    )}

                    {/* Recon Watchtower Structure */}
                    {cell.hasWatchtower && cell.state !== 'exploded' && cell.state !== 'disarmed' && (
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none rounded-lg ${
                          cell.isWatchtowerActivated
                            ? 'bg-indigo-950/40 border border-indigo-500/40'
                            : 'bg-indigo-950/70 border-2 border-indigo-400 shadow-md shadow-indigo-500/30'
                        }`}
                        title={
                          cell.isWatchtowerActivated
                            ? 'Recon Watchtower: High ground secured! Sector surveyed.'
                            : 'Recon Watchtower: Step here to survey and reveal surrounding fog of war & tag hidden mines!'
                        }
                      >
                        <div className="relative">
                          <Eye className={`w-3.5 h-3.5 ${cell.isWatchtowerActivated ? 'text-indigo-400' : 'text-indigo-300 animate-pulse'}`} />
                          {!cell.isWatchtowerActivated && (
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                          )}
                        </div>
                        <span className="text-[6px] font-mono font-black text-indigo-300 tracking-tighter uppercase mt-0.5">
                          {cell.isWatchtowerActivated ? 'SECURED' : 'TOWER'}
                        </span>
                      </div>
                    )}

                    {/* Environmental Hazard: Electric Fence */}
                    {cell.hazard === 'electric_fence' && cell.state !== 'exploded' && cell.state !== 'disarmed' && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-cyan-950/60 border border-cyan-400/80"
                        title="Electric Fence: Vault over with Rocket Jump or EMP! Walking into it discharges armor."
                      >
                        <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span className="text-[7px] text-cyan-300 font-mono font-bold tracking-tighter">FENCE</span>
                      </div>
                    )}

                    {/* Environmental Hazard: Mud Patch */}
                    {cell.hazard === 'mud' && (
                      <div
                        className="absolute bottom-1 left-1 pointer-events-none flex items-center text-amber-500/80"
                        title="Mud Patch: Thick sludge (+1 move cost)"
                      >
                        <Droplets className="w-3 h-3 text-amber-500/70" />
                      </div>
                    )}

                    {/* Sonar Scanned Mine Alert (Hazard Hologram) */}
                    {cell.state === 'hidden' && cell.isScanned && cell.isMine && !cell.isDefused && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse"
                        title="Detected Mine! Tagged by Sonar/Watchtower Recon"
                      >
                        <div className="p-1 rounded-full bg-red-900/60 border border-red-500/80 shadow-md shadow-red-500/40">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        </div>
                      </div>
                    )}

                    {/* Supply Crate Indicator (Clearly distinguished by type) */}
                    {cell.hasCrate && cell.state !== 'revealed' && cell.state !== 'flagged' && (
                      <div
                        className={`absolute top-1 right-1 p-0.5 rounded shadow-xs flex items-center justify-center pointer-events-none ${
                          cell.hasCrate === 'armor'
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400'
                            : cell.hasCrate === 'emp'
                            ? 'bg-sky-950/90 text-sky-300 border border-sky-400'
                            : cell.hasCrate === 'sonar'
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-400'
                        }`}
                        title={
                          cell.hasCrate === 'armor'
                            ? 'Supply Crate: Kevlar Armor Plate (+1 Shield)'
                            : cell.hasCrate === 'emp'
                            ? 'Supply Crate: EMP Capacitor (+1 EMP Blast)'
                            : cell.hasCrate === 'sonar'
                            ? 'Supply Crate: Sonar Radar Ping (+1 Sonar Ping)'
                            : 'Supply Crate: Intel XP & Defusal Kit (+75 XP & +1 Defusal Kit)'
                        }
                      >
                        {cell.hasCrate === 'armor' ? (
                          <Shield className="w-3 h-3 text-cyan-300" />
                        ) : cell.hasCrate === 'emp' ? (
                          <Zap className="w-3 h-3 text-sky-300" />
                        ) : cell.hasCrate === 'sonar' ? (
                          <Radio className="w-3 h-3 text-emerald-300" />
                        ) : (
                          <Award className="w-3 h-3 text-amber-300" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Player Avatar */}
                  {isPlayerHere && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <PlayerSprite
                        direction={playerDirection}
                        isMoving={isMoving}
                        hasArmor={hasArmor}
                        isJumping={isJumping}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* EMP Wave FX Overlay */}
          {empEffectPos && (
            <div
              className="absolute pointer-events-none rounded-full border-4 border-cyan-400 bg-cyan-400/20 animate-ping z-30"
              style={{
                left: `${(empEffectPos.x - 1) * 46 + 12}px`,
                top: `${(empEffectPos.y - 1) * 46 + 12}px`,
                width: '140px',
                height: '140px'
              }}
            />
          )}

          {/* Sonar Ping Wave FX Overlay */}
          {sonarEffectPos && (
            <div
              className="absolute pointer-events-none rounded-full border-2 border-emerald-400/80 bg-emerald-400/10 animate-ping z-30"
              style={{
                left: `${(sonarEffectPos.x - 2) * 46 + 12}px`,
                top: `${(sonarEffectPos.y - 2) * 46 + 12}px`,
                width: '230px',
                height: '230px'
              }}
            />
          )}

          {/* Tactical Vision & Flashlight Ambient Aura in Fog of War */}
          {isFogOfWar && (
            <div
              className="absolute pointer-events-none rounded-full z-15 transition-all duration-200"
              style={{
                left: `${(playerPos.x - (visionRange ?? 3.5)) * 46 + 24}px`,
                top: `${(playerPos.y - (visionRange ?? 3.5)) * 46 + 24}px`,
                width: `${(visionRange ?? 3.5) * 2 * 46}px`,
                height: `${(visionRange ?? 3.5) * 2 * 46}px`,
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(251, 191, 36, 0.04) 50%, transparent 75%)',
                filter: 'blur(12px)'
              }}
            />
          )}
        </div>

        {/* Bottom Banner: Endless Barrage warning OR Deployment Trench */}
        {isEndless ? (
          <div className="w-full mt-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-600/70 text-red-300 font-mono text-xs animate-pulse">
            <span className="font-semibold tracking-wider">▲ ADVANCING BARRAGE ZONE ▲</span>
            <span className="text-[11px] text-red-400">ROLLING UPWARD</span>
          </div>
        ) : (
          <div className="w-full mt-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-xs">
            <span className="font-semibold tracking-wider">DEPLOYMENT TRENCH [START LINE]</span>
            <span className="text-[11px] text-slate-500">SAFE HAVEN</span>
          </div>
        )}

        {/* Collapsible Tactical Map Legend (Explains boxes, symbols, watchtowers) */}
        <div className="w-full mt-2.5">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">Map Legend: What do the boxes & symbols mean?</span>
            </div>
            {showLegend ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showLegend && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-xs font-sans text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 shadow-xl animate-fadeIn">
              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-indigo-950 border border-indigo-400 text-indigo-300 shrink-0 mt-0.5">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-indigo-300">Recon Watchtower:</span>
                  <p className="text-[11px] text-slate-400">Step on the tower to survey a large section of the map ahead, uncovering the fog of war and scanning hidden mines!</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-amber-950 border border-amber-400 text-amber-300 shrink-0 mt-0.5">
                  <Box className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-amber-300">Supply Boxes:</span>
                  <p className="text-[11px] text-slate-400">Collect for extra equipment: Armor (+1 shield), EMP (+1 charge), Sonar Radar, or Intel XP (+75 XP & defusal kit).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-amber-950 border border-amber-800 text-amber-400 shrink-0 mt-0.5">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-amber-400">Mud Patches:</span>
                  <p className="text-[11px] text-slate-400">Thick sludge that costs 2 movement steps to slog across. Step around if possible.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-cyan-300">Electric Fences:</span>
                  <p className="text-[11px] text-slate-400">Electrified barrier that depletes 1 armor charge. Bypass by leaping over with Rocket Jump [2] or blasting with EMP [1].</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-emerald-950 border border-emerald-400 text-emerald-400 shrink-0 mt-0.5">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-emerald-300">Defused Mine:</span>
                  <p className="text-[11px] text-slate-400">Planting a flag [F] on a real mine defuses it permanently! Neighboring numbers immediately drop down.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-1.5 bg-slate-950/70 rounded-md border border-slate-850">
                <div className="p-1 rounded bg-red-950 border border-red-500 text-red-400 shrink-0 mt-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-mono font-bold text-red-400">Scanned Mine Hologram:</span>
                  <p className="text-[11px] text-slate-400">Revealed by Sonar Radar [3] or a Watchtower. Indicates a confirmed explosive hazard—do not walk here without defusing!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

