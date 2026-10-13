import React from 'react';
import { Shield, Flag, Bomb, Compass, Clock, Footprints, Wrench, Eye, EyeOff } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface HUDProps {
  levelConfig: LevelConfig;
  playerY: number;
  armor: number;
  maxArmor: number;
  minesRemaining: number;
  totalMines: number;
  elapsedSeconds: number;
  moveCount: number;
  dangerIntensity: number; // 0 to 1
  isFlagMode: boolean;
  onToggleFlagMode: () => void;
  onResetLevel: () => void;
  isEndless?: boolean;
  endlessDistance?: number;
  collapseRow?: number;
  defusedCount?: number;
  defusalKits: number;
  maxDefusalKits: number;
  defusalStreak: number;
  isFogOfWar: boolean;
  onToggleFog: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  levelConfig,
  playerY,
  armor,
  maxArmor,
  minesRemaining,
  totalMines,
  elapsedSeconds,
  moveCount,
  dangerIntensity,
  isFlagMode,
  onToggleFlagMode,
  onResetLevel,
  isEndless,
  endlessDistance = 0,
  collapseRow = -1,
  defusedCount = 0,
  defusalKits,
  maxDefusalKits,
  defusalStreak,
  isFogOfWar,
  onToggleFog
}) => {
  // Format mm:ss
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Distance to top extraction zone (playerY = 0 is goal)
  const distanceRemaining = playerY;
  const totalDistance = levelConfig.height - 1;
  const progressPercent = Math.min(100, Math.round(((totalDistance - distanceRemaining) / totalDistance) * 100));
  const barrageDistance = collapseRow >= 0 ? Math.max(0, collapseRow - playerY) : 999;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono select-none">
      {/* Left: Sector & Progress */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-slate-400 font-sans font-medium text-xs">
            {isEndless ? 'Endless Operation' : levelConfig.title} ·{' '}
            <span className="text-amber-400 font-mono font-semibold">
              {isEndless ? 'ROLLING BARRAGE' : levelConfig.codename}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            {isEndless ? (
              <>
                <span>Distance:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{endlessDistance}m</span>
                <span className="text-red-400 font-sans">
                  (Barrage: {barrageDistance}m behind)
                </span>
              </>
            ) : (
              <>
                <span>Target LZ:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{distanceRemaining}m remaining</span>
                <span className="text-slate-500 font-sans">({progressPercent}%)</span>
              </>
            )}
          </div>
        </div>

        {/* Mini progress track */}
        {!isEndless && (
          <div className="hidden lg:flex flex-col gap-1 w-28">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Center: Tactical Geiger Proximity Meter */}
      <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 rounded-lg px-3 py-1.5">
        <span className="text-slate-400 tracking-wider text-[11px] uppercase">Proximity:</span>
        <div className="flex items-center gap-1">
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((threshold, idx) => {
            const isActive = dangerIntensity >= threshold;
            const barColor =
              idx < 2 ? 'bg-emerald-500' : idx < 4 ? 'bg-amber-500' : 'bg-red-500 animate-pulse';
            return (
              <div
                key={idx}
                className={`w-2.5 h-4 rounded-xs transition-colors duration-150 ${
                  isActive ? barColor : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
        <span
          className={`text-[11px] font-bold ${
            dangerIntensity > 0.7
              ? 'text-red-400 animate-pulse'
              : dangerIntensity > 0.3
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {dangerIntensity > 0.7 ? 'CRITICAL' : dangerIntensity > 0.3 ? 'CAUTION' : 'CLEAR'}
        </span>
      </div>

      {/* Right: Armor, Mines, Time, Moves, Flag Toggle */}
      <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
        {/* Blast Armor */}
        <div className="flex items-center gap-1.5 text-slate-300" title="Blast Armor charges">
          <Shield className={`w-4 h-4 ${armor > 0 ? 'text-cyan-400' : 'text-slate-600'}`} />
          <span>Armor:</span>
          <span className="text-cyan-400 font-bold tabular-nums">
            {armor}/{maxArmor}
          </span>
        </div>

        {/* Defusal Kits */}
        <div
          className="flex items-center gap-1.5 text-slate-300"
          title="Defusal Kits: Flags defuse live mines. False defusals spawn a new mine! 2 consecutive defusals reward +1 kit."
        >
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>Kits:</span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {defusalKits}/{maxDefusalKits}
          </span>
          {defusalStreak > 0 && (
            <span className="text-amber-400 font-bold text-[10px]" title={`${defusalStreak} defusal streak`}>
              (x{defusalStreak})
            </span>
          )}
        </div>

        {/* Mines Counter */}
        <div className="flex items-center gap-1.5 text-slate-300" title="Suspected mines remaining">
          <Bomb className="w-4 h-4 text-red-400" />
          <span>Mines:</span>
          <span className="text-red-400 font-bold tabular-nums">
            {minesRemaining} / {totalMines}
          </span>
        </div>

        {/* Footsteps / Moves */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Footprints className="w-3.5 h-3.5 text-slate-400" />
          <span className="tabular-nums">{moveCount} moves</span>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="tabular-nums">{timeString}</span>
        </div>

        {/* Fog of War Toggle */}
        <button
          onClick={onToggleFog}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all ${
            isFogOfWar
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70 shadow-xs'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
          }`}
          title="Toggle Fog of War (Hotkey: Z)"
        >
          {isFogOfWar ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>Fog [Z]</span>
        </button>

        {/* Interactive Flag Mode Toggle */}
        <button
          onClick={onToggleFlagMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all ${
            isFlagMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
          }`}
          title="Toggle Flagging Mode (Hotkey: F or Right-Click)"
        >
          <Flag className={`w-3.5 h-3.5 ${isFlagMode ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>Flag [F]</span>
        </button>

        {/* Quick Restart */}
        <button
          onClick={onResetLevel}
          className="text-slate-400 hover:text-slate-200 transition-colors underline decoration-slate-700 hover:decoration-slate-400 text-xs font-sans"
        >
          Restart
        </button>
      </div>
    </div>
  );
};
