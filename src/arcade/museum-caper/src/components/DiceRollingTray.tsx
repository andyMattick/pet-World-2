import React, { useState, useEffect } from 'react';
import { ActionDieFace } from '../types/game';
import { Eye, Camera, Radio, Dices } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DiceRollingTrayProps {
  movementRoll: number | null;
  actionRoll: ActionDieFace | null;
  isRolling: boolean;
  canRoll: boolean;
  onRollClick: () => void;
  activeDetectiveName: string;
  activeDetectiveColor: string;
}

export const DiceRollingTray: React.FC<DiceRollingTrayProps> = ({
  movementRoll,
  actionRoll,
  isRolling,
  canRoll,
  onRollClick,
  activeDetectiveName,
  activeDetectiveColor,
}) => {
  // Rapid cycle states for tumbling animation
  const [displayMove, setDisplayMove] = useState<number>(movementRoll || 1);
  const [displayAction, setDisplayAction] = useState<ActionDieFace>(actionRoll || 'eyes');

  useEffect(() => {
    if (isRolling) {
      const actions: ActionDieFace[] = ['eyes', 'camera_scan', 'motion_detector'];
      const interval = setInterval(() => {
        setDisplayMove(Math.floor(Math.random() * 6) + 1);
        setDisplayAction(actions[Math.floor(Math.random() * actions.length)]);
      }, 70);
      return () => clearInterval(interval);
    } else {
      if (movementRoll !== null) setDisplayMove(movementRoll);
      if (actionRoll !== null) setDisplayAction(actionRoll);
    }
  }, [isRolling, movementRoll, actionRoll]);

  // Render authentic d6 pips for movement die
  const renderDiePips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-2 row-start-2 w-3.5 h-3.5 rounded-full bg-red-600 mx-auto shadow" />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-1 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto shadow" />
          </div>
        );
    }
  };

  const getActionFace = (action: ActionDieFace) => {
    switch (action) {
      case 'eyes':
        return (
          <div className="flex flex-col items-center justify-center text-amber-500">
            <Eye className="w-8 h-8 drop-shadow" />
            <span className="text-[10px] font-black uppercase font-mono mt-0.5 tracking-tight text-amber-300">
              EYES
            </span>
          </div>
        );
      case 'camera_scan':
        return (
          <div className="flex flex-col items-center justify-center text-cyan-400">
            <Camera className="w-8 h-8 drop-shadow" />
            <span className="text-[10px] font-black uppercase font-mono mt-0.5 tracking-tight text-cyan-200">
              CAMERA
            </span>
          </div>
        );
      case 'motion_detector':
        return (
          <div className="flex flex-col items-center justify-center text-emerald-400">
            <Radio className="w-8 h-8 drop-shadow" />
            <span className="text-[10px] font-black uppercase font-mono mt-0.5 tracking-tight text-emerald-200">
              MOTION
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-800/60 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Wooden Felt Dice Tray Inner Background */}
      <div className="absolute inset-2 bg-emerald-950/40 rounded-xl border border-emerald-800/40 pointer-events-none" />

      {/* Tray Title Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-200">
            Official 2-Dice Tray
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/40"
            style={{ backgroundColor: activeDetectiveColor }}
          />
          <span className="text-stone-300 font-semibold">{activeDetectiveName}</span>
        </div>
      </div>

      {/* The Two Animated 3D Physical Dice */}
      <div className="relative z-10 grid grid-cols-2 gap-4 my-2">
        {/* Die 1: Movement Die */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2">
            Movement Die (1–6)
          </span>

          <div
            className={`w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 border-2 border-stone-300 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center justify-center transform transition-transform ${
              isRolling ? 'animate-spin scale-110 rotate-12' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {renderDiePips(displayMove)}
          </div>

          <div className="mt-2 text-xs font-mono font-bold text-amber-400">
            {movementRoll !== null ? `${movementRoll} Spaces` : 'Awaiting Roll'}
          </div>
        </div>

        {/* Die 2: Special Action Die */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2">
            Action Die (3 Actions)
          </span>

          <div
            className={`w-18 h-18 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 border-2 border-stone-600 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center justify-center transform transition-transform ${
              isRolling ? 'animate-spin scale-110 -rotate-12' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {getActionFace(displayAction)}
          </div>

          <div className="mt-2 text-xs font-mono font-bold text-cyan-300">
            {actionRoll !== null
              ? actionRoll === 'eyes' ? 'Eyes (Sight)' : actionRoll === 'camera_scan' ? 'Camera Scan' : 'Motion Ping'
              : 'Awaiting Roll'}
          </div>
        </div>
      </div>

      {/* Roll Action Button */}
      {canRoll && (
        <div className="relative z-10 mt-3 pt-2 border-t border-stone-800/80">
          <button
            onClick={() => {
              sounds.playDiceRoll();
              onRollClick();
            }}
            disabled={isRolling}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 cursor-pointer text-xs uppercase tracking-wider font-mono"
          >
            <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Tumbling Dice...' : 'Throw Both Dice!'}
          </button>
        </div>
      )}
    </div>
  );
};
