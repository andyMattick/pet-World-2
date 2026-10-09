import React from 'react';
import { 
  GameState, 
  Position, 
  TileData, 
  RoomColor, 
  DetectiveCharacter,
  Painting 
} from '../types/game';
import { BOARD_SIZE, ROOM_INFO, getTileWallBorders, GALLERY_DOORS } from '../utils/boardLayout';
import { 
  Camera, 
  Zap, 
  Lock, 
  Unlock, 
  Scissors, 
  Image as ImageIcon, 
  Eye, 
  Footprints, 
  HelpCircle, 
  DoorOpen,
  Moon,
  CloudFog,
  ShieldAlert,
  Flame,
  Crosshair
} from 'lucide-react';

interface MuseumBoardProps {
  state: GameState;
  tiles: TileData[][];
  validMoves: Position[];
  onTileClick: (pos: Position) => void;
  is3dView: boolean;
  walkingPawn?: {
    type: 'thief' | 'detective';
    id: string;
    pos: Position;
  } | null;
  activePathPreview?: Position[];
  isInfiltrationMode?: boolean;
  onInfiltrationSelect?: (pos: Position, name: string) => void;
  onInspectPainting?: (painting: Painting) => void;
}

export const MuseumBoard: React.FC<MuseumBoardProps> = ({
  state,
  tiles,
  validMoves,
  onTileClick,
  is3dView,
  walkingPawn,
  activePathPreview = [],
  isInfiltrationMode = false,
  onInfiltrationSelect,
  onInspectPainting,
}) => {
  const { 
    thief, 
    detectives, 
    paintings, 
    cameras, 
    locks, 
    powerOutageTurns, 
    role, 
    activePhase, 
    currentDetectiveIndex,
    smokeClouds,
    uvTrackerActive,
    alarmLevel
  } = state;
  const powerOut = powerOutageTurns > 0;

  // Next detective to move:
  const nextDetectiveIndex = activePhase === 'thief'
    ? currentDetectiveIndex
    : (currentDetectiveIndex + 1) % detectives.length;
  const nextDetective = detectives[nextDetectiveIndex];

  // Active detective (if detective phase):
  const activeDetective = activePhase === 'detective' ? detectives[currentDetectiveIndex] : null;

  // Should the thief pawn be visible on the board?
  const showThiefPawn = 
    role === 'thief' || 
    thief.isSpotted || 
    (role === 'pass_and_play' && activePhase === 'thief');

  const validMoveMap = new Set(validMoves.map(m => `${m.x},${m.y}`));
  const pathPreviewMap = new Set(activePathPreview.map(m => `${m.x},${m.y}`));

  // Mapping lookup tables
  const paintingMap = new Map(paintings.map(p => [`${p.pos.x},${p.pos.y}`, p]));
  const cameraMap = new Map(cameras.map(c => [`${c.pos.x},${c.pos.y}`, c]));
  const lockMap = new Map(locks.map(l => [`${l.pos.x},${l.pos.y}`, l]));
  const doorMap = new Map(GALLERY_DOORS.map(d => [`${d.pos.x},${d.pos.y}`, d]));
  const smokeMap = new Map(smokeClouds.map(s => [`${s.pos.x},${s.pos.y}`, s]));

  // Footsteps trail map for UV blacklight or thief view
  const footstepMap = new Map<string, number>();
  thief.footstepTrails.forEach(fp => {
    footstepMap.set(`${fp.pos.x},${fp.pos.y}`, fp.turn);
  });

  // Effective detective positions (override if walking)
  const effectiveDetectives = detectives.map(det => {
    if (walkingPawn && walkingPawn.type === 'detective' && walkingPawn.id === det.id) {
      return { ...det, pos: walkingPawn.pos };
    }
    return det;
  });
  const detectiveMap = new Map(effectiveDetectives.map(d => [`${d.pos.x},${d.pos.y}`, d]));

  // Effective thief position (override if walking)
  const effectiveThiefPos = (walkingPawn && walkingPawn.type === 'thief')
    ? walkingPawn.pos
    : thief.pos;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      {/* 3D tilt wrapper */}
      <div
        className={`transition-all duration-500 origin-center ${
          is3dView
            ? 'rotate-x-24 rotate-z-[-2deg] scale-[0.96] shadow-2xl [transform-style:preserve-3d]'
            : 'scale-100 shadow-xl'
        }`}
      >
        {/* Board Outer Wooden Frame */}
        <div className={`p-3 bg-gradient-to-b from-amber-900 via-stone-900 to-amber-950 rounded-2xl border-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-colors ${
          alarmLevel === 3
            ? 'border-red-600/90 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
            : alarmLevel === 2
            ? 'border-amber-600/90'
            : 'border-amber-700/60'
        }`}>
          {/* Brass Nameplate Banner */}
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border border-amber-600/40 rounded-lg text-amber-300 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider">THE GREAT MUSEUM CAPER</span>
              <span className="text-[10px] text-amber-500/80">· 1991</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {/* Security Alarm Level Indicator */}
              <div className="flex items-center gap-1 font-bold">
                <span className="text-stone-400 text-[10px]">ALARM:</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  alarmLevel === 3
                    ? 'bg-red-950 text-red-400 border border-red-500 animate-pulse'
                    : alarmLevel === 2
                    ? 'bg-amber-950 text-amber-400 border border-amber-500'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                }`}>
                  {alarmLevel === 3 ? 'LEVEL 3 (LOCKDOWN)' : alarmLevel === 2 ? 'LEVEL 2 (ALERT)' : 'LEVEL 1 (CALM)'}
                </span>
              </div>

              {powerOut ? (
                <span className="text-red-400 flex items-center gap-1 animate-pulse font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  POWER CUT
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  CAMERAS ON
                </span>
              )}
            </div>
          </div>

          {/* Grid Container */}
          <div
            className="grid gap-0.5 bg-stone-950 p-2 rounded-xl border border-stone-800 relative"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              width: 'min(88vw, 620px)',
              height: 'min(88vw, 620px)',
            }}
          >
            {tiles.flatMap((row, y) =>
              row.map((tile, x) => {
                const coordKey = `${x},${y}`;
                const isValidMove = validMoveMap.has(coordKey);
                const isPathStep = pathPreviewMap.has(coordKey);
                const painting = paintingMap.get(coordKey);
                const camera = cameraMap.get(coordKey);
                const lock = lockMap.get(coordKey);
                const door = doorMap.get(coordKey);
                const smoke = smokeMap.get(coordKey);
                const detective = detectiveMap.get(coordKey);
                const isThiefHere = effectiveThiefPos.x === x && effectiveThiefPos.y === y && showThiefPawn;
                const roomInfo = ROOM_INFO[tile.roomColor];

                // Check physical wall borders for this tile
                const wallBorders = getTileWallBorders(x, y);

                // Check if this detective is the "Next Up" detective
                const isNextDetectivePawn = detective && detective.id === nextDetective?.id;
                const isActiveDetectivePawn = detective && detective.id === activeDetective?.id;
                const isDetectiveAsleep = detective && detective.sleepTurns > 0;

                // Check UV Footstep illumination
                const footstepTurn = footstepMap.get(coordKey);
                const isUVFootstepVisible = (uvTrackerActive || role === 'thief') && footstepTurn !== undefined;

                return (
                  <div
                    key={coordKey}
                    onClick={() => isValidMove && onTileClick({ x, y })}
                    className={`relative rounded-xs flex items-center justify-center transition-all duration-150 ${
                      tile.isWall && !lock
                        ? 'bg-stone-900/90 opacity-60'
                        : tile.isPowerRoom
                        ? 'bg-amber-950/60'
                        : `${roomInfo.bgClass}`
                    } ${
                      wallBorders.north ? 'border-t-2 border-t-amber-600/90' : 'border-t-stone-800/30'
                    } ${
                      wallBorders.south ? 'border-b-2 border-b-amber-600/90' : 'border-b-stone-800/30'
                    } ${
                      wallBorders.east ? 'border-r-2 border-r-amber-600/90' : 'border-r-stone-800/30'
                    } ${
                      wallBorders.west ? 'border-l-2 border-l-amber-600/90' : 'border-l-stone-800/30'
                    } ${
                      isValidMove
                        ? 'ring-2 ring-amber-400 bg-amber-500/25 cursor-pointer animate-pulse z-20'
                        : ''
                    } ${
                      isPathStep
                        ? 'bg-amber-400/30 ring-1 ring-amber-300'
                        : ''
                    }`}
                  >
                    {/* Gallery Doorway Archway Indicator */}
                    {door && (
                      <div
                        className="absolute inset-x-0.5 inset-y-0.5 rounded border border-amber-400/80 bg-amber-950/50 flex flex-col items-center justify-center z-15 pointer-events-none"
                        title={`${door.name} (Access between corridor and ${door.roomName})`}
                      >
                        <DoorOpen className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
                        <span className="text-[7px] font-mono font-black text-amber-200 leading-none uppercase tracking-tighter">
                          DOOR
                        </span>
                      </div>
                    )}

                    {/* Smoke Bomb Cloud Screen */}
                    {smoke && (
                      <div
                        className="absolute inset-0 bg-stone-500/80 backdrop-blur-xs rounded flex flex-col items-center justify-center z-25 text-white animate-pulse"
                        title={`Smoke Screen! Blocks camera & guard vision (${smoke.turnsRemaining} turns left)`}
                      >
                        <CloudFog className="w-4 h-4 text-stone-200" />
                        <span className="text-[7px] font-mono font-black uppercase text-stone-300 leading-none">
                          SMOKE
                        </span>
                      </div>
                    )}

                    {/* Power Room Symbol (P) */}
                    {tile.isPowerRoom && (
                      <div className="flex flex-col items-center justify-center text-amber-400 font-bold z-10 pointer-events-none">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        <span className="text-[9px] font-mono leading-none">P</span>
                      </div>
                    )}

                    {/* Perimeter Lock / Window / Door */}
                    {lock && (
                      <div
                        onClick={(e) => {
                          if (isInfiltrationMode && onInfiltrationSelect) {
                            e.stopPropagation();
                            onInfiltrationSelect(lock.pos, lock.name);
                          }
                        }}
                        className={`absolute inset-0.5 rounded flex items-center justify-center z-10 border transition-transform ${
                          isInfiltrationMode
                            ? 'ring-2 ring-emerald-400 bg-emerald-950/90 text-emerald-300 cursor-pointer animate-pulse hover:scale-105'
                            : lock.isPermanentlyLocked
                            ? 'bg-red-950/95 border-2 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.7)]'
                            : lock.revealed
                            ? lock.isLocked
                              ? 'bg-red-950/80 border-red-500 text-red-300'
                              : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : 'bg-amber-950/70 border-amber-600/70 text-amber-400'
                        }`}
                        title={`${lock.name} ${
                          isInfiltrationMode
                            ? '(Click to Infiltrate Here!)'
                            : lock.isPermanentlyLocked
                            ? `(PERMANENTLY LOCKED DOWN by ${lock.lockedDownBy || 'Detectives'})`
                            : lock.revealed
                            ? (lock.isLocked ? '(Locked)' : '(Unlocked)')
                            : '(Face Down)'
                        }`}
                      >
                        {isInfiltrationMode ? (
                          <div className="flex flex-col items-center scale-90">
                            <Crosshair className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
                            <span className="text-[6px] font-mono font-black text-emerald-200 leading-none uppercase">
                              ENTRY
                            </span>
                          </div>
                        ) : lock.isPermanentlyLocked ? (
                          <div className="flex flex-col items-center scale-90">
                            <Lock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                            <span className="text-[6px] font-mono font-black text-red-300 leading-none uppercase">
                              SEALED
                            </span>
                          </div>
                        ) : lock.revealed ? (
                          lock.isLocked ? (
                            <Lock className="w-3 h-3 text-red-400" />
                          ) : (
                            <Unlock className="w-3 h-3 text-emerald-400" />
                          )
                        ) : (
                          <div className="flex flex-col items-center scale-90">
                            <HelpCircle className="w-2.5 h-2.5" />
                            <span className="text-[7px] font-mono font-bold leading-none">LOCK</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Security Camera */}
                    {camera && (
                      <div
                        className={`absolute inset-1 rounded-full flex flex-col items-center justify-center z-10 border shadow-md ${
                          camera.isCut
                            ? 'bg-red-950/90 border-red-500 text-red-400 line-through'
                            : powerOut
                            ? 'bg-amber-950/90 border-amber-600 text-amber-400 opacity-60'
                            : 'bg-slate-900 border-cyan-400 text-cyan-300 ring-1 ring-cyan-500/50'
                        }`}
                        title={`Security Camera #${camera.number} (${camera.isCut ? 'Wires Cut' : powerOut ? 'Power Down' : 'Online'})`}
                      >
                        <Camera className="w-3 h-3" />
                        <span className="text-[8px] font-bold font-mono leading-none">
                          #{camera.number}
                        </span>
                        {!camera.isCut && !powerOut && (
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </div>
                    )}

                    {/* Art Piece Frame */}
                    {painting && (
                      <div
                        onClick={(e) => {
                          if (onInspectPainting) {
                            e.stopPropagation();
                            onInspectPainting(painting);
                          }
                        }}
                        className={`absolute inset-0.5 rounded border-2 flex flex-col items-center justify-center z-10 transition-transform cursor-pointer hover:scale-105 ${
                          painting.status === 'stolen'
                            ? 'bg-stone-900/50 border-dashed border-stone-600 text-stone-600'
                            : painting.status === 'destroyed'
                            ? 'bg-red-950/80 border-red-600 text-red-400 ring-1 ring-red-500/50'
                            : painting.status === 'cutting'
                            ? 'bg-amber-950/80 border-amber-400 text-amber-200 animate-pulse ring-2 ring-amber-400/50'
                            : 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm hover:border-amber-300'
                        }`}
                        title={
                          painting.status === 'stolen'
                            ? `${painting.name} (#${painting.number}) - Created by ${painting.artist} [STOLEN ✓] • Click to view picture`
                            : painting.status === 'destroyed'
                            ? `${painting.name} (#${painting.number}) - Created by ${painting.artist} [DESTROYED ✕] • Click to view picture`
                            : `${painting.name} (#${painting.number}) • [Creator Classified: Solve Quiz to Reveal] • Click to inspect picture`
                        }
                      >
                        {painting.status === 'stolen' ? (
                          <div className="text-[7px] font-mono text-emerald-400/70 font-bold uppercase">
                            STOLEN
                          </div>
                        ) : painting.status === 'destroyed' ? (
                          <div className="flex flex-col items-center">
                            <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                            <span className="text-[6px] font-mono text-red-300 font-bold uppercase leading-none">
                              RUINED
                            </span>
                          </div>
                        ) : painting.status === 'cutting' ? (
                          <div className="flex flex-col items-center">
                            <Scissors className="w-3 h-3 text-amber-400 animate-bounce" />
                            <span className="text-[7px] font-mono text-amber-300 font-bold leading-none">
                              QUIZ
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] leading-none">
                              {painting.type === 'sculpture' ? '🗿' : painting.type === 'artifact' ? '🏺' : painting.type === 'tapestry' ? '🧵' : '🖼️'}
                            </span>
                            <span className="text-[7px] font-mono font-bold leading-none mt-0.5">
                              #{painting.number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Detective Pawn (Awake or Sleeping) */}
                    {detective && (
                      <div
                        className={`absolute inset-1 rounded-full flex items-center justify-center z-30 shadow-lg border-2 border-white/80 transition-all duration-200 transform scale-110 ${
                          isDetectiveAsleep
                            ? 'opacity-60 ring-2 ring-indigo-400'
                            : isActiveDetectivePawn
                            ? 'ring-4 ring-white animate-pulse'
                            : ''
                        }`}
                        style={{ backgroundColor: detective.color }}
                        title={`${detective.name} (${detective.clueName}) ${isDetectiveAsleep ? '— ASLEEP (Zzz)' : isNextDetectivePawn ? '- NEXT UP!' : ''}`}
                      >
                        <span className="text-[10px] font-black text-white font-mono drop-shadow">
                          {detective.clueName[0]}
                        </span>
                        
                        {/* Snoozing Sleeping Zzz indicator */}
                        {isDetectiveAsleep && (
                          <div className="absolute -top-3.5 px-1 py-0.2 bg-indigo-700 text-white text-[7px] font-black rounded uppercase shadow font-mono tracking-tighter whitespace-nowrap animate-pulse flex items-center gap-0.5">
                            <Moon className="w-2 h-2" />
                            <span>Zzz ({detective.sleepTurns})</span>
                          </div>
                        )}

                        {/* Next Up floating beacon indicator */}
                        {!isDetectiveAsleep && isNextDetectivePawn && !isActiveDetectivePawn && (
                          <div className="absolute -top-3.5 px-1 py-0.2 bg-amber-400 text-stone-950 text-[7px] font-black rounded uppercase shadow font-mono tracking-tighter whitespace-nowrap animate-bounce">
                            NEXT
                          </div>
                        )}

                        {/* Active moving beacon */}
                        {!isDetectiveAsleep && isActiveDetectivePawn && (
                          <div className="absolute -top-3.5 px-1 py-0.2 bg-white text-stone-950 text-[7px] font-black rounded uppercase shadow font-mono tracking-tighter whitespace-nowrap">
                            ACTIVE
                          </div>
                        )}
                      </div>
                    )}

                    {/* Thief Pawn (Gray Pawn - Boris) */}
                    {isThiefHere && (
                      <div
                        className={`absolute inset-1 rounded-full flex items-center justify-center z-35 shadow-2xl border-2 border-zinc-200 transition-all duration-200 transform scale-115 ${
                          thief.isSpotted
                            ? 'bg-zinc-300 text-zinc-950 ring-4 ring-red-500 animate-bounce'
                            : 'bg-zinc-600/90 text-zinc-100 ring-2 ring-cyan-400/60'
                        }`}
                        title={`Thief (Boris) - ${thief.isSpotted ? 'SPOTTED!' : 'Hidden'}`}
                      >
                        <span className="text-[10px] font-black font-mono">
                          T
                        </span>
                        {thief.isSpotted && (
                          <div className="absolute -top-3.5 px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded uppercase shadow-lg">
                            SPOTTED!
                          </div>
                        )}
                      </div>
                    )}

                    {/* UV Footsteps Glowing Markers (Forensics Tracker) */}
                    {isUVFootstepVisible && !isThiefHere && !detective && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-15"
                        title={`Recent Footsteps (Turn ${footstepTurn})`}
                      >
                        <div className="px-1 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/70 text-cyan-300 text-[8px] font-mono font-bold flex items-center gap-0.5 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse">
                          <Footprints className="w-2.5 h-2.5 text-cyan-400" />
                          <span>T{footstepTurn}</span>
                        </div>
                      </div>
                    )}

                    {/* Valid Move Indicator Circle */}
                    {isValidMove && !detective && !isThiefHere && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md animate-ping z-25" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Board Footer Legend */}
          <div className="mt-2.5 pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-400 font-mono px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white/50 inline-block" />
                Scarlet
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white/50 inline-block" />
                Mustard
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white/50 inline-block" />
                Green
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 border border-white/50 inline-block" />
                Thief
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-300">
                <Footprints className="w-3 h-3 text-cyan-400" /> UV Tracks
              </span>
              <span className="flex items-center gap-1 text-indigo-300">
                <Moon className="w-3 h-3 text-indigo-400" /> Zzz Darts
              </span>
              <span className="flex items-center gap-1 text-stone-300">
                <CloudFog className="w-3 h-3" /> Smoke
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
