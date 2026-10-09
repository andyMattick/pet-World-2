import React, { useState } from 'react';
import { ActionDieFace, DetectiveCharacter, PerimeterLock } from '../types/game';
import { Eye, Camera, Radio, ArrowRight, ShieldAlert, CheckCircle2, Footprints, Moon, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';
import { DiceRollingTray } from './DiceRollingTray';

interface DetectiveDialsProps {
  movementRoll: number | null;
  actionRoll: ActionDieFace | null;
  actionUsed: boolean;
  movesRemaining: number;
  currentDetective: DetectiveCharacter;
  adjacentLocks: PerimeterLock[];
  isDetectiveTurn: boolean;
  isAiTurn: boolean;
  workingCamerasCount: number;
  powerOut: boolean;
  uvTrackerActive: boolean;
  onRollDice: () => void;
  onUseEyes: () => void;
  onOpenCamScanModal: () => void;
  onUseMotionDetector: () => void;
  onToggleUVTracker: () => void;
  onDeployK9Dog: () => void;
  onLockdownExit: (lockId: string) => void;
  onEndDetectiveTurn: () => void;
}

export const DetectiveDials: React.FC<DetectiveDialsProps> = ({
  movementRoll,
  actionRoll,
  actionUsed,
  movesRemaining,
  currentDetective,
  adjacentLocks,
  isDetectiveTurn,
  isAiTurn,
  workingCamerasCount,
  powerOut,
  uvTrackerActive,
  onRollDice,
  onUseEyes,
  onOpenCamScanModal,
  onUseMotionDetector,
  onToggleUVTracker,
  onDeployK9Dog,
  onLockdownExit,
  onEndDetectiveTurn,
}) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    sounds.playDiceRoll();
    setTimeout(() => {
      setIsRolling(false);
      onRollDice();
    }, 650);
  };

  const isCurrentDetectiveAsleep = currentDetective.sleepTurns > 0;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
            style={{ backgroundColor: currentDetective.color }}
          />
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">Active Detective</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {currentDetective.name}
              {isAiTurn && <span className="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded font-mono">AI</span>}
            </div>
          </div>
        </div>

        {isCurrentDetectiveAsleep ? (
          <div className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/60 px-2 py-1 rounded text-indigo-300 text-xs font-mono font-bold animate-pulse">
            <Moon className="w-3.5 h-3.5" />
            ASLEEP (Zzz: {currentDetective.sleepTurns} turns left)
          </div>
        ) : powerOut ? (
          <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-2 py-1 rounded text-amber-300 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            POWER OFFLINE
          </div>
        ) : null}
      </div>

      {/* Sleeping Detective Warning */}
      {isCurrentDetectiveAsleep && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-600/40 rounded-lg text-xs text-indigo-200 mb-3 font-mono flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            {currentDetective.name} was hit by a tranquilizer dart and is fast asleep! Turn must be skipped.
          </span>
        </div>
      )}

      {/* The Visual 3D Physical Dice Rolling Tray */}
      {!isCurrentDetectiveAsleep && (
        <div className="mb-4">
          <DiceRollingTray
            movementRoll={movementRoll}
            actionRoll={actionRoll}
            isRolling={isRolling}
            canRoll={isDetectiveTurn && !isAiTurn && movementRoll === null}
            onRollClick={handleRoll}
            activeDetectiveName={currentDetective.name}
            activeDetectiveColor={currentDetective.color}
          />
        </div>
      )}

      {/* Detective Lockdown Ability when adjacent to a door or window */}
      {adjacentLocks.length > 0 && !isCurrentDetectiveAsleep && (
        <div className="p-2.5 bg-red-950/60 border-2 border-red-500/80 rounded-xl space-y-2 mb-3 shadow-lg">
          <div className="text-[11px] uppercase font-mono font-bold text-red-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Detective Lockdown Available!</span>
          </div>
          <p className="text-[10px] text-red-200/90 leading-tight">
            Permanently padlock this exit with heavy security chains. The thief will never be able to escape through it!
          </p>
          {adjacentLocks.map(l => (
            <button
              key={l.id}
              onClick={() => onLockdownExit(l.id)}
              disabled={!isDetectiveTurn || isAiTurn}
              className="w-full py-2 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Lock Down {l.name}
            </button>
          ))}
        </div>
      )}

      {/* Detective Forensic Investigation Tools (UV Footstep Tracker & K-9) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 mb-3 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
          <span>Forensic Investigation Tools</span>
          <span className="text-[9px] text-cyan-400">Tracking Tools</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* UV Footstep Tracker Toggle */}
          <button
            onClick={() => {
              sounds.playUVScanner();
              onToggleUVTracker();
            }}
            className={`py-1.5 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              uvTrackerActive
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Reveal the thief's recent glowing footsteps on the museum floor!"
          >
            <Footprints className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold">
              {uvTrackerActive ? 'UV Light: ON' : 'UV Tracker: OFF'}
            </span>
          </button>

          {/* K-9 Guard Dog Sniff */}
          <button
            onClick={() => {
              sounds.playDogBark();
              onDeployK9Dog();
            }}
            disabled={!isDetectiveTurn || isAiTurn || isCurrentDetectiveAsleep}
            className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            title="Deploy museum guard dog to sniff for intruder scents within 3 tiles!"
          >
            <span className="text-sm">🐶</span>
            <span className="text-[10px] font-bold">K-9 Sniff Search</span>
          </button>
        </div>
      </div>

      {/* Action execution buttons */}
      <div className="space-y-2">
        {!isCurrentDetectiveAsleep && movementRoll !== null && (
          <>
            {/* Execute Special Action Button */}
            {!actionUsed && actionRoll && (
              <div>
                {actionRoll === 'eyes' && (
                  <button
                    onClick={onUseEyes}
                    disabled={!isDetectiveTurn || isAiTurn}
                    className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    Check Eyes (Line of Sight from Hallways/Rooms)
                  </button>
                )}

                {actionRoll === 'camera_scan' && (
                  <button
                    onClick={onOpenCamScanModal}
                    disabled={!isDetectiveTurn || isAiTurn}
                    className="w-full py-2 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    Scan Camera Feed (Pick Camera 1–6)
                  </button>
                )}

                {actionRoll === 'motion_detector' && (
                  <button
                    onClick={onUseMotionDetector}
                    disabled={!isDetectiveTurn || isAiTurn}
                    className="w-full py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-200 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-emerald-400" />
                    Trigger Motion Detector System
                  </button>
                )}
              </div>
            )}

            {actionUsed && (
              <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Special Action completed for this turn
              </div>
            )}
          </>
        )}

        {/* End Detective Turn */}
        {(isCurrentDetectiveAsleep || movementRoll !== null) && (
          <button
            onClick={onEndDetectiveTurn}
            disabled={!isDetectiveTurn || isAiTurn}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 font-medium rounded-lg flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
          >
            {isCurrentDetectiveAsleep ? 'Skip Turn (Sleeping)' : 'Finish Move & Pass Turn to Thief'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
