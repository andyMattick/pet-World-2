import React from 'react';
import { GameState } from '../types';
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  ShieldAlert, 
  Sparkles, 
  Wind, 
  HelpCircle, 
  Users, 
  GraduationCap, 
  Award,
  Flame,
  Crown,
  Timer,
  Zap,
  Coins
} from 'lucide-react';
import { getLevelConfig } from '../game/levelProgression';

interface GameHUDProps {
  gameState: GameState;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenGuide: () => void;
  onOpenCharacterSelect: () => void;
  onOpenMathSettings: () => void;
  onOpenMathReport: () => void;
  onOpenIncentives: () => void;
  onSetTargetCoins?: (target: number) => void;
  onRegenerateMap?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameState,
  onToggleSound,
  onTogglePause,
  onOpenGuide,
  onOpenCharacterSelect,
  onOpenMathSettings,
  onOpenMathReport,
  onOpenIncentives,
  onSetTargetCoins,
  onRegenerateMap,
}) => {
  const levelConfig = getLevelConfig(gameState.level);
  const mathSolvedThisLevel = gameState.levelMathSolved || 0;
  const levelElapsed = gameState.levelElapsedTime || 0;
  const isUnderPar = levelElapsed <= levelConfig.parTimeSeconds;

  return (
    <div id="game-hud" className="w-full bg-slate-900/95 border-b border-amber-500/30 px-3 sm:px-6 py-2 text-slate-100 flex flex-col gap-1.5 backdrop-blur-sm select-none z-10 shrink-0">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        {/* Pirate Brand & Score */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 flex items-center gap-1">
              <span>Loot Collected</span>
              {(gameState.doubleDoubloonRemaining || 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-yellow-500 text-slate-950 font-black text-[9px] animate-pulse">
                  2X GOLD ({gameState.doubleDoubloonRemaining})
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-amber-300 font-mono">
              {gameState.score.toLocaleString()} <span className="text-xs font-normal text-amber-500">pts</span>
            </div>
          </div>

          <div className="hidden sm:block border-l border-slate-700 pl-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">High Bounty</div>
            <div className="text-base sm:text-lg font-bold text-slate-300 font-mono">
              {gameState.highScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Level / Island Badge & Speed Par Timer */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-semibold text-sky-400 tracking-wider">
              Island #{gameState.level}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-950/70 border border-slate-800" title="Island clear elapsed time vs Par time">
              <Timer className={`w-3 h-3 ${isUnderPar ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className={isUnderPar ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
                {levelElapsed}s
              </span>
              <span className="text-slate-500 text-[9px]">/ par {levelConfig.parTimeSeconds}s</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-sky-200 px-2.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 mt-0.5">
            {levelConfig.islandName}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="hud-incentives-btn"
            onClick={onOpenIncentives}
            className="p-1.5 rounded-md hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors relative"
            title="10 Level Milestones & Speed Bounties"
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            {mathSolvedThisLevel > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                {mathSolvedThisLevel}
              </span>
            )}
          </button>

          <button
            id="hud-math-settings-btn"
            onClick={onOpenMathSettings}
            className="p-1.5 rounded-md hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            title="Math Curriculum (Operations & Levels)"
          >
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="hud-math-report-btn"
            onClick={onOpenMathReport}
            className="p-1.5 rounded-md hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors relative"
            title="Math Session Report Card"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            {(gameState.mathHistory?.length || 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                {gameState.mathHistory.length}
              </span>
            )}
          </button>

          <button
            id="hud-character-btn"
            onClick={onOpenCharacterSelect}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
            title="Change Pirate Character"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="hud-guide-btn"
            onClick={onOpenGuide}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
            title="Power-Ups & Island Guide"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="hud-sound-btn"
            onClick={onToggleSound}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
            title={gameState.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {gameState.soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            )}
          </button>

          <button
            id="hud-pause-btn"
            onClick={onTogglePause}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
            title="Pause Game (P)"
          >
            {gameState.status === 'PAUSED' ? (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary Status Row: Lives & Active Power-Ups & Milestone Tracker */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs flex-wrap gap-1">
        {/* Lives Counter & Math Milestones Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Crew:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    idx < gameState.lives
                      ? 'bg-amber-500 shadow-sm shadow-amber-500/50 scale-100'
                      : 'bg-slate-800 border border-slate-700 opacity-30 scale-90'
                  }`}
                  title={`Life ${idx + 1}`}
                >
                  <span className="text-[9px] leading-none">🏴‍☠️</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ship Hull Armor (2 Shots = Death rule!) */}
          <div 
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
              (gameState.hull ?? 2) < (gameState.maxHull ?? 2)
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
            title="Ship Hull: You survive 1 shot, but 2 shots sink the ship! Visit a 🛠️ Repair Stop to repair."
          >
            <span className="text-[11px] font-bold text-slate-400">Hull:</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: gameState.maxHull ?? 2 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] leading-none ${
                    idx < (gameState.hull ?? 2) ? 'text-emerald-400' : 'text-slate-600 opacity-40'
                  }`}
                >
                  🛡️
                </span>
              ))}
            </div>
            <span className={`text-[10px] font-mono font-bold ${
              (gameState.hull ?? 2) < (gameState.maxHull ?? 2) ? 'text-amber-300' : 'text-emerald-400'
            }`}>
              {(gameState.hull ?? 2)}/{(gameState.maxHull ?? 2)}
            </span>
          </div>

          {/* 10 Level Math Milestones Progress Button */}
          <button
            type="button"
            onClick={onOpenIncentives}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold transition-colors cursor-pointer"
            title="Click to view the 10 math question milestone rewards for this island"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Island Math:</span>
            <span className="font-mono font-bold text-emerald-200">{mathSolvedThisLevel}/10</span>
            <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (mathSolvedThisLevel / 10) * 100)}%` }}
              />
            </div>
          </button>

          {/* Math Streak Pill */}
          {(gameState.currentMathStreak || 0) > 0 && (
            <button
              type="button"
              onClick={onOpenIncentives}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-950/80 border border-orange-500/50 text-[10px] font-bold text-orange-300 animate-pulse transition-transform hover:scale-105"
              title="Current consecutive correct answer streak! Click to view incentives."
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{gameState.currentMathStreak} Streak</span>
            </button>
          )}

          {/* In-Game Coin Density Target Setting */}
          {onSetTargetCoins && (
            <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded px-1.5 py-0.5 text-[10px]">
              <Coins className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400 font-semibold hidden lg:inline">Target:</span>
              {[100, 200, 350, 500].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onSetTargetCoins(cnt)}
                  className={`px-1.5 py-0.2 rounded font-mono font-bold transition-all cursor-pointer ${
                    (gameState.targetCoins || 200) === cnt
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                  title={`Adjust island coin count to ${cnt} doubloons`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          )}

          {/* Procedural Island Reroll Button */}
          {onRegenerateMap && (
            <button
              id="hud-regenerate-map-btn"
              type="button"
              onClick={onRegenerateMap}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-sky-300 hover:text-white font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Generate a brand new procedural Caribbean island maze layout"
            >
              <span>🎲</span>
              <span className="hidden sm:inline">New Island</span>
            </button>
          )}

          <span className="text-amber-400/90 font-mono text-[11px] font-semibold hidden md:inline">
            ({gameState.coinsRemaining} coins left)
          </span>
        </div>

        {/* Active Power-Ups Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {gameState.activePowers.length === 0 ? (
            <span className="text-[10px] text-slate-500 italic hidden sm:inline">
              Unlocked: {levelConfig.newPowerUpUnlocked ? levelConfig.newPowerUpUnlocked.name : 'Royal Grog & Wind Boots'}
            </span>
          ) : (
            gameState.activePowers.map(p => {
              const secondsLeft = (p.remainingMs / 1000).toFixed(1);
              const pct = Math.max(0, Math.min(100, (p.remainingMs / p.totalMs) * 100));

              let bg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              let icon = <ShieldAlert className="w-3 h-3 text-amber-400 animate-pulse" />;
              let label = 'FIGHT BACK';

              if (p.type === 'INVISIBILITY') {
                bg = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                icon = <Sparkles className="w-3 h-3 text-purple-400 animate-spin" />;
                label = 'GHOST CLOAK';
              } else if (p.type === 'SPEED') {
                bg = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                icon = <Wind className="w-3 h-3 text-sky-400 animate-bounce" />;
                label = 'SWIFT RUM';
              }

              return (
                <div
                  key={p.type}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${bg} text-[10px] font-bold shadow-sm relative overflow-hidden`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-white/10 transition-all pointer-events-none"
                    style={{ width: `${pct}%` }}
                  />
                  {icon}
                  <span className="relative z-10 whitespace-nowrap">{label}</span>
                  <span className="relative z-10 font-mono font-normal opacity-90">{secondsLeft}s</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
