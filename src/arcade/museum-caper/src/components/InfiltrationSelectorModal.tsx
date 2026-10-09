import React from 'react';
import { PerimeterLock, Position } from '../types/game';
import { DoorOpen, Eye, Compass, Shield, Check, Crosshair } from 'lucide-react';
import { sounds } from '../utils/audio';

interface InfiltrationSelectorModalProps {
  isOpen: boolean;
  locks: PerimeterLock[];
  currentStartPos: Position;
  onSelectStartPos: (pos: Position, lockName: string) => void;
  onConfirm: () => void;
}

export const InfiltrationSelectorModal: React.FC<InfiltrationSelectorModalProps> = ({
  isOpen,
  locks,
  currentStartPos,
  onSelectStartPos,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-2xl max-w-xl w-full p-6 text-zinc-100 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              Mission Infiltration Setup
            </span>
          </div>
          <h2 className="text-2xl font-serif font-black text-emerald-100 tracking-wide">
            Select Your Museum Entry Point
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Boris can infiltrate through ANY perimeter door or window. Choose where to slip into the gallery:
          </p>
        </div>

        {/* List of 8 perimeter doors and windows */}
        <div className="py-4 grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto">
          {locks.map(lock => {
            const isSelected = lock.pos.x === currentStartPos.x && lock.pos.y === currentStartPos.y;
            return (
              <button
                key={lock.id}
                onClick={() => {
                  sounds.playFootstep(true);
                  onSelectStartPos(lock.pos, lock.name);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                    : 'bg-zinc-800/80 hover:bg-zinc-750 border-zinc-700 text-zinc-300 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                    <span className="text-base">{lock.isWindow ? '🪟' : '🚪'}</span>
                    <span>{lock.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Coordinates: ({lock.pos.x}, {lock.pos.y})
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Hidden behind tracking shield at start
          </span>

          <button
            onClick={() => {
              sounds.playVictory();
              onConfirm();
            }}
            className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm flex items-center gap-1.5"
          >
            Confirm Entry & Begin Infiltration
          </button>
        </div>
      </div>
    </div>
  );
};
