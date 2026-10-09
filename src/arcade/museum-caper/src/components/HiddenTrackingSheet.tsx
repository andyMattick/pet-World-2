import React, { useState } from 'react';
import { ThiefState, Painting, SecurityCamera, PerimeterLock, DetectiveCharacter } from '../types/game';
import { 
  Scissors, 
  Zap, 
  Footprints, 
  ShieldAlert, 
  EyeOff, 
  Eye, 
  Lock, 
  Unlock, 
  Sparkles,
  ArrowRight,
  Moon,
  CloudFog,
  Flame
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HiddenTrackingSheetProps {
  thief: ThiefState;
  paintings: Painting[];
  cameras: SecurityCamera[];
  locks: PerimeterLock[];
  detectives: DetectiveCharacter[];
  powerOut: boolean;
  powerOutageTurns: number;
  isThiefTurn: boolean;
  isAiThief: boolean;
  onCutCamera: (camNumber: number) => void;
  onCutPower: () => void;
  onStartCuttingPainting: (paintingId: string) => void;
  onFinishStealingPainting: (paintingId: string) => void;
  onEndThiefTurn: () => void;
  onFireSleepDart: (targetDetectiveId: string) => void;
  onDeploySmokeBomb: () => void;
  onUseAdrenaline: () => void;
  onOpenInfiltrationSelect?: () => void;
  onInspectPainting?: (painting: Painting) => void;
  canCutCurrentCamera: number | null;
  canCutCurrentPower: boolean;
  canCutCurrentPainting: string | null;
  canFinishCurrentPainting: string | null;
}

export const HiddenTrackingSheet: React.FC<HiddenTrackingSheetProps> = ({
  thief,
  paintings,
  cameras,
  locks,
  detectives,
  powerOut,
  powerOutageTurns,
  isThiefTurn,
  isAiThief,
  onCutCamera,
  onCutPower,
  onStartCuttingPainting,
  onFinishStealingPainting,
  onEndThiefTurn,
  onFireSleepDart,
  onDeploySmokeBomb,
  onUseAdrenaline,
  onOpenInfiltrationSelect,
  onInspectPainting,
  canCutCurrentCamera,
  canCutCurrentPower,
  canCutCurrentPainting,
  canFinishCurrentPainting,
}) => {
  const [showDartTargets, setShowDartTargets] = useState(false);

  // Detectives within sleep dart range (within 4 spaces)
  const awakeDetectives = detectives.filter(d => d.sleepTurns === 0);

  return (
    <div className="bg-zinc-950/95 border-2 border-zinc-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md text-zinc-200">
      {/* Top Ledger Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-zinc-400 border border-zinc-200 shadow" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
              Thief's Secret Pad & Arsenal
            </div>
            <div className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 font-mono">
              BORIS "THE PHANTOM"
              {isAiThief && <span className="text-[10px] bg-zinc-800 text-amber-400 px-1 rounded">AI</span>}
            </div>
          </div>
        </div>

        {/* Visibility & Entry status */}
        <div className="flex items-center gap-1.5">
          {onOpenInfiltrationSelect && (
            <button
              onClick={onOpenInfiltrationSelect}
              className="px-2 py-1 rounded text-[11px] font-mono font-medium border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Change entry door or window"
            >
              🚪 Entry: ({thief.pos.x}, {thief.pos.y})
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border">
            {thief.isSpotted ? (
              <span className="flex items-center gap-1 text-red-400 border-red-500/40 bg-red-950/40">
                <Eye className="w-3.5 h-3.5" />
                SPOTTED! Pawn on Board
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 border-emerald-500/40 bg-emerald-950/40">
                <EyeOff className="w-3.5 h-3.5" />
                HIDDEN behind shield
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Turn Actions and Movement status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            Movement: 1 to 3 spaces per turn
          </span>
          <span className="text-xs font-bold text-amber-300 font-mono">
            {thief.movesRemaining} moves remaining
          </span>
        </div>

        {/* Contextual actions when standing on special tiles */}
        <div className="space-y-2 mt-2">
          {canCutCurrentPainting && (
            <button
              onClick={() => {
                sounds.playWireCut();
                onStartCuttingPainting(canCutCurrentPainting);
              }}
              disabled={!isThiefTurn || isAiThief}
              className="w-full py-2 px-3 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500 text-amber-200 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              Prepare Acquisition: Begin Slicing Display (Takes 1 Turn)
            </button>
          )}

          {canFinishCurrentPainting && (
            <button
              onClick={() => {
                onFinishStealingPainting(canFinishCurrentPainting);
              }}
              disabled={!isThiefTurn || isAiThief}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-zinc-950 font-black text-xs rounded flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer ring-2 ring-yellow-400/50"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              Acquire Art: Answer Authentication Quiz! 🎓
            </button>
          )}

          {canCutCurrentCamera !== null && (
            <button
              onClick={() => {
                sounds.playWireCut();
                onCutCamera(canCutCurrentCamera);
              }}
              disabled={!isThiefTurn || isAiThief}
              className="w-full py-2 px-3 bg-red-600/30 hover:bg-red-600/40 border border-red-500 text-red-200 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-red-400" />
              Snip Security Camera #{canCutCurrentCamera} Wires
            </button>
          )}

          {canCutCurrentPower && (
            <button
              onClick={() => {
                sounds.playWireCut();
                onCutPower();
              }}
              disabled={!isThiefTurn || isAiThief}
              className="w-full py-2 px-3 bg-yellow-500/30 hover:bg-yellow-500/40 border border-yellow-500 text-yellow-200 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Sabotage Power Generator (Disable all cameras & sensors for 3 turns!)
            </button>
          )}
        </div>
      </div>

      {/* Thief Gadget Arsenal ("Go Crazy!") */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-3">
        <div className="text-xs font-mono text-zinc-400 mb-2 font-bold flex items-center justify-between">
          <span>Heist Sabotage Gadgets</span>
          <span className="text-[10px] text-amber-400">Special Tools</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* 1. Sleep Dart */}
          <div>
            <button
              onClick={() => setShowDartTargets(!showDartTargets)}
              disabled={!isThiefTurn || isAiThief || thief.sleepDarts <= 0 || awakeDetectives.length === 0}
              className="w-full py-2 px-1.5 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/60 disabled:opacity-40 text-indigo-200 rounded text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              title="Shoot a tranquilizer dart to put a detective to sleep for 2 turns!"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold font-mono">Sleep Dart</span>
              <span className="text-[9px] text-indigo-300 font-mono">({thief.sleepDarts} left)</span>
            </button>
          </div>

          {/* 2. Smoke Bomb */}
          <div>
            <button
              onClick={() => {
                sounds.playSmokeBomb();
                onDeploySmokeBomb();
              }}
              disabled={!isThiefTurn || isAiThief || thief.smokeBombs <= 0}
              className="w-full py-2 px-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 disabled:opacity-40 text-slate-200 rounded text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              title="Drop a smoke bomb to block all detective and camera vision lines!"
            >
              <CloudFog className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-bold font-mono">Smoke Bomb</span>
              <span className="text-[9px] text-slate-400 font-mono">({thief.smokeBombs} left)</span>
            </button>
          </div>

          {/* 3. Adrenaline Sprint */}
          <div>
            <button
              onClick={() => {
                sounds.playFootstep(true);
                onUseAdrenaline();
              }}
              disabled={!isThiefTurn || isAiThief || thief.adrenalineUsed}
              className="w-full py-2 px-1.5 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/60 disabled:opacity-40 text-amber-200 rounded text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              title="One-time sprint boost (+2 moves) to escape tight corners!"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold font-mono">Adrenaline</span>
              <span className="text-[9px] text-amber-400 font-mono">{thief.adrenalineUsed ? 'Used' : '+2 Moves'}</span>
            </button>
          </div>
        </div>

        {/* Sleep Dart Target Picker Modal/Drawer */}
        {showDartTargets && (
          <div className="mt-2.5 p-2 bg-stone-950 rounded border border-indigo-500/50 space-y-1.5 animate-fade-in">
            <div className="text-[10px] font-mono text-indigo-300 font-bold">
              Choose Detective to put to sleep (2 turns):
            </div>
            <div className="grid grid-cols-3 gap-1">
              {awakeDetectives.map(det => (
                <button
                  key={det.id}
                  onClick={() => {
                    sounds.playDart();
                    setTimeout(() => sounds.playSnore(), 300);
                    onFireSleepDart(det.id);
                    setShowDartTargets(false);
                  }}
                  className="py-1 px-1.5 bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-400 rounded text-[10px] font-mono text-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: det.color }} />
                  <span className="truncate">{det.clueName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End Thief Turn Button */}
        {isThiefTurn && !isAiThief && (
          <div className="mt-3 pt-2 border-t border-zinc-800">
            <button
              onClick={onEndThiefTurn}
              className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-medium rounded flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
            >
              End Thief Move & Pass Turn to Detectives
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Paintings Stolen Tracker (Need at least 3 to escape) */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-zinc-400">Priceless Art Loot ({thief.paintingsInBag.length}/3 to Escape)</span>
          <span className="text-amber-400 font-bold">
            {thief.paintingsInBag.length >= 3 ? '✓ Ready to Escape!' : `${3 - thief.paintingsInBag.length} more needed`}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {paintings.map((p) => {
            const inBag = thief.paintingsInBag.includes(p.id);
            const isCutting = thief.cuttingPaintingId === p.id;
            const isDestroyed = p.status === 'destroyed';
            return (
              <div
                key={p.id}
                className={`p-1.5 rounded border text-[11px] font-mono flex flex-col justify-between ${
                  inBag
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 line-through'
                    : isDestroyed
                    ? 'bg-red-950/60 border-red-500/60 text-red-400 line-through'
                    : isCutting
                    ? 'bg-amber-950/60 border-amber-500 animate-pulse text-amber-200'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold truncate text-[11px] text-zinc-200">{p.number}. {p.name}</div>
                  {onInspectPainting && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectPainting(p);
                      }}
                      className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] text-amber-300 border border-zinc-700 hover:border-amber-400 shrink-0 flex items-center gap-0.5 cursor-pointer"
                      title="Inspect Masterpiece Picture"
                    >
                      <Eye className="w-2.5 h-2.5" /> Pic
                    </button>
                  )}
                </div>
                <div className="text-[9px] opacity-75 mt-0.5">
                  {p.roomName.split(' ')[0]} • {inBag ? `✓ ${p.artist}` : isDestroyed ? `✕ ${p.artist}` : '🔒 Creator Hidden'}
                </div>
                {inBag && <div className="text-[9px] text-emerald-400 font-bold">STOLEN ✓</div>}
                {isDestroyed && <div className="text-[9px] text-red-400 font-bold">DESTROYED ✕</div>}
                {isCutting && <div className="text-[9px] text-amber-400 font-bold">READY FOR QUIZ</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Cameras Wire Cut Checklist (1 to 6) */}
      <div className="mb-3">
        <div className="text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
          <span>Security Cameras (6 Total)</span>
          {powerOut && (
            <span className="text-amber-400 text-[10px]">
              Power Sabotaged ({powerOutageTurns} turns left)
            </span>
          )}
        </div>

        <div className="grid grid-cols-6 gap-1">
          {cameras.map((c) => (
            <div
              key={c.number}
              className={`p-1 text-center rounded border text-[10px] font-mono font-bold ${
                c.isCut
                  ? 'bg-red-950/80 border-red-500 text-red-400 line-through'
                  : powerOut
                  ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300'
              }`}
            >
              #{c.number}
              <div className="text-[8px] font-normal">{c.isCut ? 'CUT' : powerOut ? 'OFF' : 'ACTIVE'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Perimeter Locks Intel */}
      <div>
        <div className="text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
          <span>Perimeter Doors & Windows</span>
          <span className="text-[10px] text-zinc-500">Must exit via unlocked!</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto">
          {locks.map((l) => (
            <div
              key={l.id}
              className={`p-1.5 rounded border text-[10px] font-mono flex items-center justify-between ${
                l.revealed
                  ? l.isLocked
                    ? 'bg-red-950/40 border-red-500/40 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
              }`}
            >
              <span className="truncate">{l.name}</span>
              {l.revealed ? (
                l.isLocked ? (
                  <Lock className="w-3 h-3 text-red-400 shrink-0" />
                ) : (
                  <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
                )
              ) : (
                <span className="text-[9px] text-zinc-500 shrink-0">Face Down</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
