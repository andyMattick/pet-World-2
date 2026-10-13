import React from 'react';
import { Zap, ArrowUp, Radio, Crosshair, X } from 'lucide-react';
import { AbilityType } from '../types/game';

interface AbilityState {
  empCharges: number;
  maxEmp: number;
  jumpCharges: number;
  maxJumps: number;
  sonarCharges: number;
  maxSonar: number;
  droneCharges: number;
  maxDrones: number;
}

interface AbilityBarProps {
  abilities: AbilityState;
  activeTargetingAbility: AbilityType | null;
  onSelectAbility: (type: AbilityType) => void;
  onCancelTargeting: () => void;
  onChordAction: () => void;
  disabled: boolean;
}

export const AbilityBar: React.FC<AbilityBarProps> = ({
  abilities,
  activeTargetingAbility,
  onSelectAbility,
  onCancelTargeting,
  onChordAction,
  disabled
}) => {
  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Ability Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* EMP Blast */}
        <button
          onClick={() => onSelectAbility('emp')}
          disabled={disabled || abilities.empCharges <= 0}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-left transition-all ${
            abilities.empCharges > 0 && !disabled
              ? 'bg-slate-800 hover:bg-slate-750 border-cyan-500/40 text-slate-100 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Electromagnetic Pulse: Instantly deactivates all mines in a 3x3 radius around you."
        >
          <div className="p-1.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-200">EMP Blast</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-700 rounded-sm text-cyan-400">
                1
              </kbd>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {abilities.empCharges}/{abilities.maxEmp} charges · 3×3
            </div>
          </div>
        </button>

        {/* Rocket Leap */}
        <button
          onClick={() => onSelectAbility('jump')}
          disabled={disabled || abilities.jumpCharges <= 0}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-left transition-all ${
            activeTargetingAbility === 'jump'
              ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
              : abilities.jumpCharges > 0 && !disabled
              ? 'bg-slate-800 hover:bg-slate-750 border-amber-500/40 text-slate-100 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Rocket Jump: Vault 2 tiles in any direction over suspected minefields."
        >
          <div className="p-1.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800">
            <ArrowUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-200">Rocket Jump</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-700 rounded-sm text-amber-400">
                2
              </kbd>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {abilities.jumpCharges}/{abilities.maxJumps} charges · 2 tiles
            </div>
          </div>
        </button>

        {/* Sonar Scan */}
        <button
          onClick={() => onSelectAbility('sonar')}
          disabled={disabled || abilities.sonarCharges <= 0}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-left transition-all ${
            abilities.sonarCharges > 0 && !disabled
              ? 'bg-slate-800 hover:bg-slate-750 border-emerald-500/40 text-slate-100 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Sonar Ping: Emits radar sweep detecting all hidden mines in a 5x5 zone."
        >
          <div className="p-1.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-200">Sonar Radar</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-700 rounded-sm text-emerald-400">
                3
              </kbd>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {abilities.sonarCharges}/{abilities.maxSonar} charges · 5×5
            </div>
          </div>
        </button>

        {/* Defusal Drone */}
        <button
          onClick={() => onSelectAbility('drone')}
          disabled={disabled || abilities.droneCharges <= 0}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-left transition-all ${
            activeTargetingAbility === 'drone'
              ? 'bg-violet-500/20 border-violet-400 text-violet-200 ring-2 ring-violet-400/30'
              : abilities.droneCharges > 0 && !disabled
              ? 'bg-slate-800 hover:bg-slate-750 border-violet-500/40 text-slate-100 hover:border-violet-400 hover:shadow-md hover:shadow-violet-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Remote Drone: Click any tile within 4 range to safely defuse and reveal it."
        >
          <div className="p-1.5 rounded-md bg-violet-950 text-violet-400 border border-violet-800">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-200">Defusal Drone</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-700 rounded-sm text-violet-400">
                4
              </kbd>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {abilities.droneCharges}/{abilities.maxDrones} charges · Target
            </div>
          </div>
        </button>
      </div>

      {/* Target Status / Fast Chord helper */}
      <div className="flex items-center gap-3">
        {activeTargetingAbility ? (
          <div className="flex items-center gap-2 bg-amber-950/70 border border-amber-600/60 px-3 py-1.5 rounded-lg text-xs text-amber-200 animate-pulse">
            <span>
              {activeTargetingAbility === 'jump'
                ? 'Select a landing tile (2 tiles away)'
                : 'Click target tile to deploy drone'}
            </span>
            <button
              onClick={onCancelTargeting}
              className="p-1 hover:bg-amber-900 rounded text-amber-300"
              title="Cancel targeting"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Chord Sweep:</span>
            <button
              onClick={onChordAction}
              disabled={disabled}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded text-[11px] font-medium"
              title="If flags match number on current cell, reveal remaining neighbors"
            >
              [Space] Sweep
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
