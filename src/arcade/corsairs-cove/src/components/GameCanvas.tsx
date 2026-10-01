import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/gameEngine';
import { GameRenderer } from '../game/renderer';
import { Direction, GameState } from '../types';
import { Play, RotateCcw, Volume2, HelpCircle, GraduationCap, Award, BookOpen, Crown, Flame } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { MathChallengeModal } from './MathChallengeModal';
import { MiniMap } from './MiniMap';

interface GameCanvasProps {
  engine: GameEngine;
  onStateChange: (state: GameState) => void;
  onOpenGuide: () => void;
  onOpenCharacterSelect: () => void;
  onOpenMathSettings: () => void;
  onOpenMathReport: () => void;
  onOpenIncentives: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  onStateChange,
  onOpenGuide,
  onOpenCharacterSelect,
  onOpenMathSettings,
  onOpenMathReport,
  onOpenIncentives,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animFrameId = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [currentStatus, setCurrentStatus] = useState<string>(engine.state.status);

  // Sync React state helper
  const syncState = useCallback(() => {
    onStateChange({ ...engine.state });
    setCurrentStatus(engine.state.status);
  }, [engine, onStateChange]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If currently solving a power-up math cipher, let input handle typing
      if (engine.state.status === 'POWERUP_CHALLENGE') {
        return;
      }

      // Prevent page scrolling on navigation keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'p' || e.key === 'P') {
        engine.togglePause();
        syncState();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (engine.state.status === 'MENU' || engine.state.status === 'GAME_OVER') {
          engine.startNewGame();
          syncState();
          return;
        } else if (engine.state.status === 'PAUSED') {
          engine.togglePause();
          syncState();
          return;
        } else if (engine.state.status === 'PLAYING') {
          // Broadside Cannon Fire!
          engine.fireCannon();
          syncState();
          return;
        }
      }

      // Active Combat Controls when Sailing
      if (engine.state.status === 'PLAYING') {
        if (e.key === 'f' || e.key === 'F') {
          engine.fireCannon();
          syncState();
          return;
        }
        if (e.key === 'b' || e.key === 'B' || e.key === 'e' || e.key === 'E') {
          engine.dropKeg();
          syncState();
          return;
        }
        if (e.key === 'Shift' || e.key === 'q' || e.key === 'Q') {
          engine.activateWindBoost();
          syncState();
          return;
        }
        if (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X') {
          engine.activateGhostMist();
          syncState();
          return;
        }
        if (e.key === 'r' || e.key === 'R') {
          engine.repairShip();
          syncState();
          return;
        }
      }

      let dir: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dir = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dir = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dir = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dir = 'RIGHT';
          break;
      }

      if (dir) {
        engine.handleInputDirection(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, syncState]);

  // Touch Swipe Gesture Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absDx, absDy) > 25) {
      if (absDx > absDy) {
        engine.handleInputDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        engine.handleInputDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  // ResizeObserver for canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    rendererRef.current = new GameRenderer(canvas);

    const updateCanvasDimensions = () => {
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width || 560;
      const containerHeight = rect.height || 620;

      // Desired 28 x 31 aspect ratio (approx 0.903)
      const targetAspect = 28 / 31;
      let w = containerWidth;
      let h = containerWidth / targetAspect;

      if (h > containerHeight) {
        h = containerHeight;
        w = containerHeight * targetAspect;
      }

      // High DPI crispness
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${Math.floor(w)}px`;
      canvas.style.height = `${Math.floor(h)}px`;

      if (rendererRef.current) {
        rendererRef.current.resize(canvas.width, canvas.height);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
    });

    resizeObserver.observe(container);
    updateCanvasDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let lastHudSync = 0;

    const loop = (time: number) => {
      const deltaMs = Math.min(time - lastTimeRef.current, 50); // Cap delta to prevent huge jumps
      lastTimeRef.current = time;

      engine.update(deltaMs);

      if (rendererRef.current) {
        rendererRef.current.render(
          engine.tiles,
          engine.pirate,
          engine.guards,
          engine.state.activePowers,
          engine.particles,
          engine.popups,
          engine.state.bonusItem,
          engine.state.level,
          engine.state.status,
          engine.ambientParticles,
          engine.cannonballs,
          engine.placedKegs
        );
      }

      // Sync state to React HUD every ~100ms or on status change
      if (time - lastHudSync > 100 || engine.state.status !== currentStatus) {
        lastHudSync = time;
        syncState();
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [engine, syncState, currentStatus]);

  return (
    <div
      ref={containerRef}
      id="game-canvas-container"
      className="relative w-full flex-1 h-full min-h-0 flex items-center justify-center overflow-hidden bg-slate-950 select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        id="pacman-canvas"
        className="block rounded-lg shadow-2xl shadow-black/80 border border-slate-800"
      />

      {/* Persistent Mini-Map in Corner of Game Canvas */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 pointer-events-auto">
        <MiniMap engine={engine} />
      </div>

      {/* OVERLAY: Title / Main Menu */}
      {currentStatus === 'MENU' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="max-w-md w-full flex flex-col items-center">
            {/* Skull Crest */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
              <span className="text-3xl">🏴‍☠️</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-wider mb-2">
              CORSAIR'S COVE
            </h1>
            <p className="text-sm font-semibold text-sky-300 mb-4 tracking-wide uppercase">
              Pirate Flagship vs. The Royal Navy Armada
            </p>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-sm">
              Steer your pirate ship across rolling Caribbean waves to salvage sunken doubloons! 
              Outmaneuver Royal Navy warships using 
              <strong className="text-purple-300"> Ghost Mist</strong>, 
              <strong className="text-sky-300"> Swift Wind sails</strong>, and 
              <strong className="text-amber-300"> Royal Grog</strong> broadside cannon fire!
            </p>

            {/* Pirate Character Selected Preview */}
            <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                  {engine.state.selectedCharacter.id === 'blackbeard' ? '🏴‍☠️' : engine.state.selectedCharacter.id === 'anne_bonny' ? '⚔️' : '🪙'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-100">{engine.state.selectedCharacter.name}</div>
                  <div className="text-[11px] text-amber-400">{engine.state.selectedCharacter.perk}</div>
                </div>
              </div>
              <button
                id="menu-switch-char-btn"
                onClick={onOpenCharacterSelect}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 underline"
              >
                Change
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
              <button
                id="start-game-btn"
                onClick={() => { engine.startNewGame(); syncState(); }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                Set Sail! (Play)
              </button>

              <button
                id="menu-math-settings-btn"
                onClick={onOpenMathSettings}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs sm:text-sm border border-sky-500/40 flex items-center justify-center gap-1.5 transition-colors"
                title="Configure Math Operations & Difficulty Levels"
              >
                <GraduationCap className="w-4 h-4 text-sky-400" />
                Curriculum
              </button>

              <button
                id="menu-incentives-btn"
                onClick={onOpenIncentives}
                className="px-4 py-3 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors"
                title="View Badges, Streaks & Math Heroes"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                Badges & Perks
              </button>

              <button
                id="menu-guide-btn"
                onClick={onOpenGuide}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Rules
              </button>
            </div>

            {engine.state.mathHistory?.length > 0 && (
              <button
                type="button"
                onClick={onOpenMathReport}
                className="mt-3 text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                View Last Session Math Report ({engine.state.mathHistory.length} problems)
              </button>
            )}

            <div className="text-[11px] text-slate-500 mt-4">
              Controls: Arrow Keys or W-A-S-D • Swipe on mobile
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: Countdown */}
      {currentStatus === 'COUNTDOWN' && (
        <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl sm:text-4xl font-black text-amber-400 font-serif animate-bounce tracking-widest drop-shadow-md">
            WEIGH ANCHOR! SET SAIL!
          </div>
          <div className="text-sm font-bold text-sky-300 mt-2">
            Royal Navy warships sighted on the horizon!
          </div>
        </div>
      )}

      {/* OVERLAY: Paused */}
      {currentStatus === 'PAUSED' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="text-2xl sm:text-3xl font-black text-slate-100 font-serif mb-2">
            HEIST PAUSED
          </div>
          <p className="text-xs text-slate-400 mb-5">Rest yer cutlass, captain.</p>
          
          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <button
              id="resume-game-btn"
              onClick={() => { engine.togglePause(); syncState(); }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Resume Chase
            </button>

            <button
              onClick={onOpenMathSettings}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Math Curriculum & Difficulty
            </button>

            {engine.state.mathHistory?.length > 0 && (
              <button
                onClick={onOpenMathReport}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Award className="w-4 h-4 text-sky-400" />
                Session Math Report Card
              </button>
            )}
          </div>
        </div>
      )}

      {/* OVERLAY: Game Over */}
      {currentStatus === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in overflow-y-auto">
          <div className="max-w-sm w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <div className="text-3xl mb-1">⛓️</div>
              <h2 className="text-2xl font-black text-rose-400 font-serif">
                CAPTURED!
              </h2>
              <p className="text-xs text-slate-400">
                The King's Royal Guard clapped you in irons.
              </p>
            </div>

            {/* Score & Math Performance Summary */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Plunder:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {engine.state.score.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                <span className="text-slate-400">Island Reached:</span>
                <span className="font-semibold text-sky-400">
                  Level {engine.state.level}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                <span className="text-slate-400">Math Ciphers Solved:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {engine.state.mathProblemsSolved || 0} / {engine.state.mathHistory?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-1.5">
                <span className="text-slate-400">Best Math Streak:</span>
                <span className="font-mono font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 inline" />
                  {engine.state.bestMathStreak || 0} in a row
                </span>
              </div>
            </div>

            {/* Interactive Math Review & Incentives Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                id="game-over-incentives-btn"
                onClick={onOpenIncentives}
                className="w-full py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border border-amber-500/50 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Math Mastery Badges & Unlocked Heroes</span>
              </button>

              <button
                type="button"
                id="game-over-report-btn"
                onClick={onOpenMathReport}
                className="w-full py-2 rounded-xl bg-sky-950 hover:bg-sky-900/90 text-sky-200 border border-sky-500/50 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Award className="w-4 h-4 text-sky-400" />
                <span>View Full Math Report Card</span>
              </button>

              <button
                type="button"
                id="game-over-settings-btn"
                onClick={onOpenMathSettings}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Adjust Math Curriculum & Levels</span>
              </button>
            </div>

            {/* Retry Button */}
            <button
              id="game-over-retry-btn"
              onClick={() => { engine.startNewGame(); syncState(); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Try Another Heist!
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY: Level Cleared */}
      {currentStatus === 'LEVEL_CLEAR' && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-center">
          <div className="text-3xl mb-1 animate-bounce">🏆</div>
          <div className="text-3xl font-black text-amber-300 font-serif tracking-wide drop-shadow-lg">
            PORT PLUNDERED!
          </div>
          <div className="text-sm font-semibold text-sky-300 mt-2">
            Setting sail to next fortress...
          </div>
        </div>
      )}

      {/* OVERLAY: Math Challenge to unlock powerup */}
      {currentStatus === 'POWERUP_CHALLENGE' && engine.state.mathChallenge && (
        <MathChallengeModal
          challenge={engine.state.mathChallenge}
          onSolve={(correct, userAnswer, attempts, forfeited) => {
            engine.resolveMathChallenge(correct, userAnswer, attempts, forfeited);
            syncState();
          }}
        />
      )}
    </div>
  );
};
