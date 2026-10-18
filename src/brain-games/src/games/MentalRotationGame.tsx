import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playStreak, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, X, Box, Rotate3D } from 'lucide-react';

interface MentalRotationProps {
  difficulty?: string; // 'standard' | 'angles-90' | 'complex'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface ShapePuzzle {
  id: string;
  name: string;
  baseSvg: (rotDeg: number, isMirrored: boolean) => React.ReactNode;
  rotationAngle: number; // e.g. 90, 180, 270
  isActuallySame: boolean;
}

const TOTAL_PUZZLES = 10;

// SVG Isometric Block Shape Generators (Tetracube L-shape, Z-shape, T-shape, Snake-shape)
const renderLBlock = (rotDeg: number, isMirrored: boolean) => (
  <svg
    viewBox="0 0 100 100"
    className="w-28 h-28 md:w-36 md:h-36 transition-transform duration-200"
    style={{
      transform: `rotate(${rotDeg}deg) ${isMirrored ? 'scaleX(-1)' : ''}`,
    }}
  >
    {/* Block 1 (Base corner) */}
    <rect x="25" y="55" width="22" height="22" rx="4" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
    {/* Block 2 (Up) */}
    <rect x="25" y="30" width="22" height="22" rx="4" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
    {/* Block 3 (Top) */}
    <rect x="25" y="5" width="22" height="22" rx="4" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
    {/* Block 4 (Right foot) */}
    <rect x="50" y="55" width="22" height="22" rx="4" fill="#818cf8" stroke="#c7d2fe" strokeWidth="2" />
    {/* Block 5 (Far foot) */}
    <rect x="75" y="55" width="22" height="22" rx="4" fill="#a5b4fc" stroke="#c7d2fe" strokeWidth="2" />
  </svg>
);

const renderZBlock = (rotDeg: number, isMirrored: boolean) => (
  <svg
    viewBox="0 0 100 100"
    className="w-28 h-28 md:w-36 md:h-36 transition-transform duration-200"
    style={{
      transform: `rotate(${rotDeg}deg) ${isMirrored ? 'scaleX(-1)' : ''}`,
    }}
  >
    {/* Top wing */}
    <rect x="15" y="20" width="22" height="22" rx="4" fill="#06b6d4" stroke="#67e8f9" strokeWidth="2" />
    <rect x="40" y="20" width="22" height="22" rx="4" fill="#0891b2" stroke="#67e8f9" strokeWidth="2" />
    {/* Center step */}
    <rect x="40" y="45" width="22" height="22" rx="4" fill="#0e7490" stroke="#67e8f9" strokeWidth="2" />
    {/* Bottom wing */}
    <rect x="40" y="70" width="22" height="22" rx="4" fill="#155e75" stroke="#67e8f9" strokeWidth="2" />
    <rect x="65" y="70" width="22" height="22" rx="4" fill="#22d3ee" stroke="#a5f3fc" strokeWidth="2" />
  </svg>
);

const renderTBlock = (rotDeg: number, isMirrored: boolean) => (
  <svg
    viewBox="0 0 100 100"
    className="w-28 h-28 md:w-36 md:h-36 transition-transform duration-200"
    style={{
      transform: `rotate(${rotDeg}deg) ${isMirrored ? 'scaleX(-1)' : ''}`,
    }}
  >
    {/* Horizontal Bar */}
    <rect x="15" y="25" width="22" height="22" rx="4" fill="#f59e0b" stroke="#fcd34d" strokeWidth="2" />
    <rect x="40" y="25" width="22" height="22" rx="4" fill="#d97706" stroke="#fcd34d" strokeWidth="2" />
    <rect x="65" y="25" width="22" height="22" rx="4" fill="#b45309" stroke="#fcd34d" strokeWidth="2" />
    {/* Stem */}
    <rect x="40" y="50" width="22" height="22" rx="4" fill="#f59e0b" stroke="#fcd34d" strokeWidth="2" />
    <rect x="40" y="75" width="22" height="22" rx="4" fill="#fbbf24" stroke="#fef3c7" strokeWidth="2" />
  </svg>
);

const SHAPE_RENDERERS = [renderLBlock, renderZBlock, renderTBlock];

export const MentalRotationGame: React.FC<MentalRotationProps> = ({
  difficulty = 'standard',
  onGameEnd,
  isEmbedded = false,
}) => {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<ShapePuzzle | null>(null);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const puzzleStartTimeRef = useRef<number>(0);

  const generatePuzzle = useCallback((idx: number): ShapePuzzle => {
    const renderFn = SHAPE_RENDERERS[idx % SHAPE_RENDERERS.length];
    const angles = [90, 180, 270];
    const rotationAngle = angles[Math.floor(Math.random() * angles.length)];
    const isSame = Math.random() < 0.5;

    return {
      id: `rot-${idx}`,
      name: `Spatial Object ${idx + 1}`,
      baseSvg: renderFn,
      rotationAngle,
      isActuallySame: isSame,
    };
  }, []);

  const startGame = () => {
    playTap();
    setGameState('PLAYING');
    setPuzzleIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setReactionTimes([]);

    const p = generatePuzzle(0);
    setCurrentPuzzle(p);
    puzzleStartTimeRef.current = Date.now();
  };

  const handleChoice = (userSaysSame: boolean) => {
    if (!currentPuzzle || gameState !== 'PLAYING') return;

    const rt = Date.now() - puzzleStartTimeRef.current;
    const isCorrect = userSaysSame === currentPuzzle.isActuallySame;

    if (isCorrect) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) playStreak();

      setCorrectCount(c => c + 1);
      const speedBonus = Math.max(0, Math.round((5000 - rt) / 50));
      setScore(s => s + 100 + speedBonus + newStreak * 10);
    } else {
      playError();
      setStreak(0);
    }

    setReactionTimes(prev => [...prev, rt]);

    if (puzzleIndex + 1 >= TOTAL_PUZZLES) {
      playVictory();
      setGameState('SUMMARY');

      const avgRt = reactionTimes.length > 0
        ? Math.round((reactionTimes.reduce((a, b) => a + b, 0) + rt) / (reactionTimes.length + 1))
        : 2200;

      const accuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / TOTAL_PUZZLES) * 100);

      const result: GameResult = {
        gameId: 'mental-rotation',
        score: score + (isCorrect ? 100 : 0),
        accuracy,
        avgReactionTimeMs: avgRt,
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((TOTAL_PUZZLES * 3)),
        difficulty,
        peakStreak: bestStreak,
      };

      if (onGameEnd) {
        onGameEnd(result);
      }
    } else {
      const nextIdx = puzzleIndex + 1;
      setPuzzleIndex(nextIdx);
      const nextP = generatePuzzle(nextIdx);
      setCurrentPuzzle(nextP);
      puzzleStartTimeRef.current = Date.now();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto">
            <Rotate3D className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Mental 3D Rotation (Shepard & Metzler)
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Stimulate your Superior Parietal Lobule (BA 7 / SPL). Two isometric geometric figures appear side-by-side. Mentally rotate the right figure to determine if it is identical to the left figure or mirrored.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto text-xs text-slate-300 text-center">
            <span className="font-semibold text-white block mb-1">Clinical Significance:</span>
            <span>Measures spatial transformation velocity and isometric cognitive manipulation in 3D Euclidean space.</span>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Rotation Probe</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && currentPuzzle && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Figure <strong className="text-white font-mono">{puzzleIndex + 1}</strong> / {TOTAL_PUZZLES}</span>
              <span aria-hidden="true">·</span>
              <span>Streak: <strong className="text-purple-400 font-mono">{streak}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Neuro Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
            </div>
          </div>

          {/* Comparison Dual Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Figure A (Reference 0 deg) */}
            <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-2">
                Reference Figure
              </span>
              {currentPuzzle.baseSvg(0, false)}
            </div>

            {/* Figure B (Rotated or Mirrored) */}
            <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
              <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-bold mb-2">
                Rotated Figure ({currentPuzzle.rotationAngle}°)
              </span>
              {currentPuzzle.baseSvg(currentPuzzle.rotationAngle, !currentPuzzle.isActuallySame)}
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="text-center text-xs text-slate-400 mb-2">
            Are these two figures structurally identical (merely rotated), or are they different/mirrored?
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleChoice(false)}
              className="py-4 bg-slate-950 hover:bg-slate-800 border border-rose-500/40 text-rose-400 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
              <span>DIFFERENT (Mirrored)</span>
            </button>

            <button
              onClick={() => handleChoice(true)}
              className="py-4 bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-5 h-5" />
              <span>SAME (Rotated)</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Rotation Complete</h2>
            <p className="text-slate-400 text-sm">Superior Parietal Lobule (BA 7) Spatial Buffer Stimulated</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                {Math.round((correctCount / TOTAL_PUZZLES) * 100)}%
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Peak Streak</span>
              <span className="text-xl font-bold text-purple-400 font-mono tabular-nums">{bestStreak}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Avg Rotation Time</span>
              <span className="text-xl font-bold text-slate-200 font-mono tabular-nums">
                {reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0} ms
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retest Spatial Rotation</span>
          </button>
        </div>
      )}
    </div>
  );
};
