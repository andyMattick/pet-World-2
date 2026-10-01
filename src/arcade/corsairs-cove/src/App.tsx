/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { GameEngine } from './game/gameEngine';
import { GameHUD } from './components/GameHUD';
import { GameCanvas } from './components/GameCanvas';
import { ControlsOverlay } from './components/ControlsOverlay';
import { PowerUpGuideModal } from './components/PowerUpGuideModal';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { MathSettingsModal } from './components/MathSettingsModal';
import { MathReportCardModal } from './components/MathReportCardModal';
import { MathIncentivesModal } from './components/MathIncentivesModal';
import { LevelClearModal } from './components/LevelClearModal';
import { RewardToast } from './components/RewardToast';
import { GameState, PirateCharacter, Direction, MathConfig } from './types';
import { Gamepad2, ShieldAlert, Sparkles, Wind, Bomb, Flame, Info, GraduationCap, Award, Crown, X, Maximize, Minimize, Wrench } from 'lucide-react';

export default function App() {
  const arcadeRunId = new URLSearchParams(window.location.search).get('arcadeRun');
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }
  const engine = engineRef.current;

  const [gameState, setGameState] = useState<GameState>({ ...engine.state });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCharSelectOpen, setIsCharSelectOpen] = useState(false);
  const [isMathSettingsOpen, setIsMathSettingsOpen] = useState(false);
  const [isMathReportOpen, setIsMathReportOpen] = useState(false);
  const [isIncentivesOpen, setIsIncentivesOpen] = useState(false);
  const [showVirtualControls, setShowVirtualControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reportedArcadeRounds = useRef<Set<string>>(new Set());

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
    if (!arcadeRunId || window.parent === window || newState.status !== 'GAME_OVER') return;
    const roundId = `${newState.levelStartTime}:${newState.level}:${newState.score}`;
    if (reportedArcadeRounds.current.has(roundId)) return;
    reportedArcadeRounds.current.add(roundId);
    window.parent.postMessage({type:'arcade:round-complete', gameId:'corsairs-cove', runId:arcadeRunId, roundId, score:newState.score}, window.location.origin);
  }, [arcadeRunId]);

  const handleToggleSound = () => {
    engine.toggleSound();
    setGameState({ ...engine.state });
  };

  const handleTogglePause = () => {
    engine.togglePause();
    setGameState({ ...engine.state });
  };

  const handleSelectCharacter = (char: PirateCharacter) => {
    engine.setCharacter(char);
    setGameState({ ...engine.state });
  };

  const handleSaveMathConfig = (newConfig: MathConfig) => {
    engine.setMathConfig(newConfig);
    setGameState({ ...engine.state });
  };

  const handleDirectionInput = (dir: Direction) => {
    engine.handleInputDirection(dir);
  };

  const handleFireCannon = () => {
    engine.fireCannon();
    setGameState({ ...engine.state });
  };

  const handleDropKeg = () => {
    engine.dropKeg();
    setGameState({ ...engine.state });
  };

  const handleWindBoost = () => {
    engine.activateWindBoost();
    setGameState({ ...engine.state });
  };

  const handleGhostMist = () => {
    engine.activateGhostMist();
    setGameState({ ...engine.state });
  };

  const handleRepairShip = () => {
    engine.repairShip();
    setGameState({ ...engine.state });
  };

  const handleSetTargetCoins = (target: number) => {
    engine.setTargetCoins(target);
    setGameState({ ...engine.state });
  };

  const handleRegenerateMap = () => {
    engine.regenerateCurrentMap();
    setGameState({ ...engine.state });
  };

  // Auto-dismiss reward notification after 3.5 seconds
  React.useEffect(() => {
    if (gameState.recentRewardNotification) {
      const timer = setTimeout(() => {
        engine.state.recentRewardNotification = null;
        setGameState({ ...engine.state });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [gameState.recentRewardNotification, engine]);

  return (
    <main className="h-screen w-screen bg-[#070f1e] text-slate-100 flex flex-col overflow-hidden selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Full-Screen Responsive Game Container */}
      <div className="w-full h-full flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* HUD Top Bar */}
        <GameHUD
          gameState={gameState}
          onToggleSound={handleToggleSound}
          onTogglePause={handleTogglePause}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenCharacterSelect={() => setIsCharSelectOpen(true)}
          onOpenMathSettings={() => setIsMathSettingsOpen(true)}
          onOpenMathReport={() => setIsMathReportOpen(true)}
          onOpenIncentives={() => setIsIncentivesOpen(true)}
          onSetTargetCoins={handleSetTargetCoins}
          onRegenerateMap={handleRegenerateMap}
        />

        {/* Game Canvas (Expands to fill all available viewport space) */}
        <GameCanvas
          engine={engine}
          onStateChange={handleStateChange}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenCharacterSelect={() => setIsCharSelectOpen(true)}
          onOpenMathSettings={() => setIsMathSettingsOpen(true)}
          onOpenMathReport={() => setIsMathReportOpen(true)}
          onOpenIncentives={() => setIsIncentivesOpen(true)}
        />

        {/* Interactive Pirate Weapon Action Bar & Island Cargo Status */}
        <div className="w-full bg-slate-950/95 border-t border-slate-800 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0 z-10">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {/* Cannon Weapon Button */}
            <button
              id="action-bar-cannon"
              onClick={handleFireCannon}
              disabled={engine.pirate.cannonAmmo <= 0 || gameState.status !== 'PLAYING'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                engine.pirate.cannonAmmo > 0 && gameState.status === 'PLAYING'
                  ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/50 text-amber-300 cursor-pointer active:scale-95'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
              title="Fire broadside cannonball at warships [SPACE / F]"
            >
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>Cannon</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono text-[9px] font-black">
                    SPACE / F
                  </kbd>
                </div>
                <span className="text-[10px] text-amber-300/80 font-mono">
                  Ammo: {engine.pirate.cannonAmmo}/{engine.pirate.maxCannonAmmo}
                </span>
              </div>
            </button>

            {/* Powder Keg Button */}
            <button
              id="action-bar-keg"
              onClick={handleDropKeg}
              disabled={engine.pirate.kegAmmo <= 0 || gameState.status !== 'PLAYING'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                engine.pirate.kegAmmo > 0 && gameState.status === 'PLAYING'
                  ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/50 text-rose-300 cursor-pointer active:scale-95'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
              title="Drop floating explosive naval powder keg mine [B / E]"
            >
              <Bomb className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>Keg</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 font-mono text-[9px] font-black">
                    B / E
                  </kbd>
                </div>
                <span className="text-[10px] text-rose-300/80 font-mono">
                  Mines: {engine.pirate.kegAmmo}/{engine.pirate.maxKegAmmo}
                </span>
              </div>
            </button>

            {/* Swift Wind Button */}
            <button
              id="action-bar-wind"
              onClick={handleWindBoost}
              disabled={engine.pirate.windCharges <= 0 || gameState.status !== 'PLAYING'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                engine.pirate.windCharges > 0 && gameState.status === 'PLAYING'
                  ? 'bg-sky-950/80 hover:bg-sky-900 border-sky-500/50 text-sky-300 cursor-pointer active:scale-95'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
              title="Turbocharged wind dash boost [SHIFT / Q]"
            >
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>Wind Dash</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/50 font-mono text-[9px] font-black">
                    SHIFT / Q
                  </kbd>
                </div>
                <span className="text-[10px] text-sky-300/80 font-mono">
                  Charges: {engine.pirate.windCharges}/{engine.pirate.maxWindCharges}
                </span>
              </div>
            </button>

            {/* Ghost Mist Button */}
            <button
              id="action-bar-mist"
              onClick={handleGhostMist}
              disabled={engine.pirate.cloakCharges <= 0 || gameState.status !== 'PLAYING'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                engine.pirate.cloakCharges > 0 && gameState.status === 'PLAYING'
                  ? 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/50 text-purple-300 cursor-pointer active:scale-95'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
              title="Phase through ships safely in spectral sea mist [C / X]"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>Ghost Mist</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/50 font-mono text-[9px] font-black">
                    C / X
                  </kbd>
                </div>
                <span className="text-[10px] text-purple-300/80 font-mono">
                  Cloaks: {engine.pirate.cloakCharges}/{engine.pirate.maxCloakCharges}
                </span>
              </div>
            </button>

            {/* Ship Hull & Repair Button */}
            <button
              id="action-bar-repair"
              onClick={handleRepairShip}
              disabled={engine.pirate.hull >= engine.pirate.maxHull || gameState.status !== 'PLAYING'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                engine.pirate.hull < engine.pirate.maxHull && gameState.status === 'PLAYING'
                  ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-500/80 text-emerald-300 ring-2 ring-emerald-500/50 animate-pulse cursor-pointer'
                  : 'bg-slate-900 border-slate-800 text-slate-400 opacity-80 cursor-default'
              }`}
              title="Repair damaged hull [R] (Free at 🛠️ Repair Stops!)"
            >
              <Wrench className={`w-4 h-4 shrink-0 ${engine.pirate.hull < engine.pirate.maxHull ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>Repair Ship</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono text-[9px] font-black">
                    R
                  </kbd>
                </div>
                <span className="text-[10px] font-mono">
                  Hull: {engine.pirate.hull}/{engine.pirate.maxHull} {engine.pirate.hull < engine.pirate.maxHull ? '⚠️ 1 HP LEFT!' : '🛡️ 100%'}
                </span>
              </div>
            </button>

            {/* Cargo Doubloons Indicator */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300 font-semibold text-xs whitespace-nowrap shadow-sm"
              title="Sail into the Island Vault (🏛️) to deposit cargo doubloons and bank bonus points!"
            >
              <span className="font-bold">🪙 Cargo: {engine.pirate.carriedCoins || 0}</span>
              <span className="text-amber-400/90 text-[10px] font-mono hidden sm:inline">(Bank at 🏛️ Vault!)</span>
            </div>

            {/* Controls & Key Legend next to Ammo - always visible */}
            <div 
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/95 border border-slate-700/80 text-[10px] text-slate-300 whitespace-nowrap shadow-inner"
              title="Keyboard and touch control reference"
            >
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px]">Keys:</span>
              <span className="font-mono text-amber-300"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black text-amber-200">SPACE</kbd> Fire</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-rose-300"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black text-rose-200">B</kbd> Keg</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-sky-300"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black text-sky-200">SHIFT</kbd> Dash</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-purple-300"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black text-purple-200">C</kbd> Cloak</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-emerald-300"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black text-emerald-200">R</kbd> Repair</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-200"><kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 font-black">WASD</kbd> Steer</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Key shortcut helper strip */}
            <div className="hidden 2xl:flex items-center gap-2 text-[10px] text-slate-400 border-l border-slate-800 pl-3">
              <span>Keys:</span>
              <span className="text-amber-300 font-mono font-bold">[SPACE] Cannon</span>
              <span className="text-rose-300 font-mono font-bold">[B] Keg</span>
              <span className="text-sky-300 font-mono font-bold">[Q] Dash</span>
              <span className="text-purple-300 font-mono font-bold">[C] Mist</span>
              <span className="text-slate-300 font-mono font-bold">[WASD/Arrows] Steer</span>
            </div>
            <button
              id="toggle-fullscreen-btn"
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 transition-colors shrink-0 cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fill Screen'}</span>
            </button>

            <button
              id="toggle-dpad-btn"
              onClick={() => setShowVirtualControls(!showVirtualControls)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors shrink-0 cursor-pointer ${
                showVirtualControls
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle On-screen Touch Controls"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Controls</span>
            </button>
          </div>
        </div>

        {/* Virtual D-Pad & Combat Controls (Visible if toggled or on mobile) */}
        {(showVirtualControls || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches)) && (
          <div className="w-full bg-slate-950 border-t border-slate-800 py-1 shrink-0 z-10">
            <ControlsOverlay
              onDirectionInput={handleDirectionInput}
              currentDir={engine.pirate.dir}
              onFireCannon={handleFireCannon}
              onDropKeg={handleDropKeg}
              onWindBoost={handleWindBoost}
              onGhostMist={handleGhostMist}
              cannonAmmo={engine.pirate.cannonAmmo}
              maxCannonAmmo={engine.pirate.maxCannonAmmo}
              kegAmmo={engine.pirate.kegAmmo}
              maxKegAmmo={engine.pirate.maxKegAmmo}
              windCharges={engine.pirate.windCharges}
              maxWindCharges={engine.pirate.maxWindCharges}
              cloakCharges={engine.pirate.cloakCharges}
              maxCloakCharges={engine.pirate.maxCloakCharges}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <LevelClearModal
        summary={gameState.levelClearSummary}
        onAdvance={() => {
          engine.advanceToNextLevel();
          setGameState({ ...engine.state });
        }}
        onOpenReport={() => setIsMathReportOpen(true)}
        onOpenSettings={() => setIsMathSettingsOpen(true)}
      />

      <PowerUpGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentLevel={gameState.level}
      />

      <CharacterSelectModal
        isOpen={isCharSelectOpen}
        selectedChar={gameState.selectedCharacter}
        onSelect={handleSelectCharacter}
        onClose={() => setIsCharSelectOpen(false)}
        solvedCount={gameState.mathProblemsSolved}
        bestStreak={gameState.bestMathStreak}
      />

      <MathSettingsModal
        isOpen={isMathSettingsOpen}
        config={gameState.mathConfig}
        onSave={handleSaveMathConfig}
        onClose={() => setIsMathSettingsOpen(false)}
      />

      <MathReportCardModal
        isOpen={isMathReportOpen}
        history={gameState.mathHistory}
        score={gameState.score}
        onClose={() => setIsMathReportOpen(false)}
        onOpenSettings={() => setIsMathSettingsOpen(true)}
      />

      <MathIncentivesModal
        isOpen={isIncentivesOpen}
        onClose={() => setIsIncentivesOpen(false)}
        currentLevel={gameState.level}
        levelMathSolved={gameState.levelMathSolved || 0}
        levelMilestonesUnlocked={gameState.levelMilestonesUnlocked || []}
        currentSolved={gameState.mathProblemsSolved || 0}
        currentStreak={gameState.currentMathStreak || 0}
        bestStreak={gameState.bestMathStreak || 0}
        unlockedMilestones={gameState.unlockedMilestones || []}
        onOpenCharacterSelect={() => setIsCharSelectOpen(true)}
      />

      {/* Non-intrusive floating toast in viewport corner with 3.5s countdown progress bar */}
      {gameState.recentRewardNotification && (
        <RewardToast
          key={`${gameState.recentRewardNotification.id}-${gameState.recentRewardNotification.timestamp}`}
          notification={gameState.recentRewardNotification}
          onDismiss={() => {
            engine.state.recentRewardNotification = null;
            setGameState({ ...engine.state });
          }}
          onViewBadges={() => {
            engine.state.recentRewardNotification = null;
            setGameState({ ...engine.state });
            setIsIncentivesOpen(true);
          }}
        />
      )}
    </main>
  );
}
