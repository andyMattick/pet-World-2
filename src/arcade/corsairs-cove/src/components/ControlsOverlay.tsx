import React from 'react';
import { Direction } from '../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Bomb, Flame, Wind, Sparkles } from 'lucide-react';

interface ControlsOverlayProps {
  onDirectionInput: (dir: Direction) => void;
  currentDir: Direction;
  onFireCannon?: () => void;
  onDropKeg?: () => void;
  onWindBoost?: () => void;
  onGhostMist?: () => void;
  cannonAmmo?: number;
  maxCannonAmmo?: number;
  kegAmmo?: number;
  maxKegAmmo?: number;
  windCharges?: number;
  maxWindCharges?: number;
  cloakCharges?: number;
  maxCloakCharges?: number;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onDirectionInput,
  currentDir,
  onFireCannon,
  onDropKeg,
  onWindBoost,
  onGhostMist,
  cannonAmmo = 5,
  maxCannonAmmo = 5,
  kegAmmo = 2,
  maxKegAmmo = 2,
  windCharges = 2,
  maxWindCharges = 2,
  cloakCharges = 1,
  maxCloakCharges = 1,
}) => {
  return (
    <div id="touch-controls" className="w-full max-w-lg mx-auto py-1 px-3 flex items-center justify-between select-none touch-none gap-4">
      {/* Directional Navigation Pad (Left) */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-1.5 w-36">
          <div />
          {/* UP */}
          <button
            id="btn-dir-up"
            aria-label="Steer North"
            onPointerDown={(e) => { e.preventDefault(); onDirectionInput('UP'); }}
            className={`h-11 rounded-xl flex items-center justify-center border font-bold text-white transition-all active:scale-95 shadow-md cursor-pointer ${
              currentDir === 'UP'
                ? 'bg-amber-500 border-amber-300 shadow-amber-500/40 scale-95'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700/90'
            }`}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div />

          {/* LEFT */}
          <button
            id="btn-dir-left"
            aria-label="Steer West"
            onPointerDown={(e) => { e.preventDefault(); onDirectionInput('LEFT'); }}
            className={`h-11 rounded-xl flex items-center justify-center border font-bold text-white transition-all active:scale-95 shadow-md cursor-pointer ${
              currentDir === 'LEFT'
                ? 'bg-amber-500 border-amber-300 shadow-amber-500/40 scale-95'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700/90'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Compass Rose Center */}
          <div className="h-11 rounded-xl flex items-center justify-center bg-slate-900/80 border border-slate-800 text-amber-400 text-xs font-serif font-black">
            🧭
          </div>

          {/* RIGHT */}
          <button
            id="btn-dir-right"
            aria-label="Steer East"
            onPointerDown={(e) => { e.preventDefault(); onDirectionInput('RIGHT'); }}
            className={`h-11 rounded-xl flex items-center justify-center border font-bold text-white transition-all active:scale-95 shadow-md cursor-pointer ${
              currentDir === 'RIGHT'
                ? 'bg-amber-500 border-amber-300 shadow-amber-500/40 scale-95'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700/90'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div />

          {/* DOWN */}
          <button
            id="btn-dir-down"
            aria-label="Steer South"
            onPointerDown={(e) => { e.preventDefault(); onDirectionInput('DOWN'); }}
            className={`h-11 rounded-xl flex items-center justify-center border font-bold text-white transition-all active:scale-95 shadow-md cursor-pointer ${
              currentDir === 'DOWN'
                ? 'bg-amber-500 border-amber-300 shadow-amber-500/40 scale-95'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700/90'
            }`}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <div />
        </div>
      </div>

      {/* Combat Action Buttons & Ammo Rack (Right) */}
      <div className="flex flex-col gap-1.5 flex-1 max-w-[240px]">
        <div className="grid grid-cols-2 gap-2">
          {/* Broadside Cannon */}
          <button
            id="btn-fire-cannon"
            onPointerDown={(e) => { e.preventDefault(); onFireCannon?.(); }}
            disabled={cannonAmmo <= 0}
            className={`h-12 px-2.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md ${
              cannonAmmo > 0
                ? 'bg-amber-950/80 hover:bg-amber-900/80 border-amber-500/50 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-1 font-bold text-xs tracking-tight">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>CANNON</span>
            </div>
            <div className="text-[10px] text-amber-400/90 font-mono font-bold">
              💣 {cannonAmmo}/{maxCannonAmmo}
            </div>
          </button>

          {/* Powder Keg Mine */}
          <button
            id="btn-drop-keg"
            onPointerDown={(e) => { e.preventDefault(); onDropKeg?.(); }}
            disabled={kegAmmo <= 0}
            className={`h-12 px-2.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md ${
              kegAmmo > 0
                ? 'bg-rose-950/80 hover:bg-rose-900/80 border-rose-500/50 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-1 font-bold text-xs tracking-tight">
              <Bomb className="w-3.5 h-3.5 text-rose-400" />
              <span>KEG</span>
            </div>
            <div className="text-[10px] text-rose-400/90 font-mono font-bold">
              🛢️ {kegAmmo}/{maxKegAmmo}
            </div>
          </button>

          {/* Swift Wind Dash */}
          <button
            id="btn-wind-dash"
            onPointerDown={(e) => { e.preventDefault(); onWindBoost?.(); }}
            disabled={windCharges <= 0}
            className={`h-9 px-2 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
              windCharges > 0
                ? 'bg-sky-950/70 hover:bg-sky-900/70 border-sky-500/40 text-sky-200'
                : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <Wind className="w-3 h-3 text-sky-400" />
            <span>WIND ({windCharges})</span>
          </button>

          {/* Ghost Mist Cloak */}
          <button
            id="btn-ghost-mist"
            onPointerDown={(e) => { e.preventDefault(); onGhostMist?.(); }}
            disabled={cloakCharges <= 0}
            className={`h-9 px-2 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
              cloakCharges > 0
                ? 'bg-purple-950/70 hover:bg-purple-900/70 border-purple-500/40 text-purple-200'
                : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>CLOAK ({cloakCharges})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
