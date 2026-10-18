import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, GitCommit } from 'lucide-react';

interface TrailGameProps {
  difficulty?: string; // 'part-a' (1-16) | 'part-b' (1-A-2-B... up to 8/H) | 'complex'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface TrailNode {
  id: string;
  label: string;
  stepOrder: number; // 0, 1, 2...
  x: number; // percentage 10-90
  y: number; // percentage 15-85
}

export const TrailMakingGame: React.FC<TrailGameProps> = ({
  difficulty = 'part-b',
  onGameEnd,
  isEmbedded = false,
}) => {
  const isPartA = difficulty === 'part-a';

  // Sequence items
  const sequenceItems = isPartA
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    : ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F', '7', 'G'];

  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [nodes, setNodes] = useState<TrailNode[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [connectedPath, setConnectedPath] = useState<TrailNode[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorFlashId, setErrorFlashId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate non-overlapping random coordinates
  const generateNodes = useCallback((): TrailNode[] => {
    const list: TrailNode[] = [];
    const minDistance = 14; // percentage min distance

    sequenceItems.forEach((label, idx) => {
      let x = 0;
      let y = 0;
      let attempts = 0;
      let valid = false;

      while (!valid && attempts < 100) {
        attempts++;
        x = Math.floor(Math.random() * 75) + 12; // 12% to 87%
        y = Math.floor(Math.random() * 70) + 15; // 15% to 85%

        valid = list.every(existing => {
          const dx = existing.x - x;
          const dy = existing.y - y;
          return Math.sqrt(dx * dx + dy * dy) >= minDistance;
        });
      }

      list.push({
        id: `node-${idx}`,
        label,
        stepOrder: idx,
        x,
        y,
      });
    });

    return list;
  }, [sequenceItems]);

  const startGame = () => {
    playTap();
    const newNodes = generateNodes();
    setNodes(newNodes);
    setGameState('PLAYING');
    setCurrentStep(0);
    setConnectedPath([]);
    setErrorCount(0);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime]);

  const handleNodeClick = (node: TrailNode) => {
    if (node.stepOrder === currentStep) {
      // Correct node!
      playTap();
      const newPath = [...connectedPath, node];
      setConnectedPath(newPath);

      if (currentStep + 1 >= sequenceItems.length) {
        // Complete!
        playVictory();
        setGameState('SUMMARY');

        const totalTime = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        const accuracy = Math.max(20, Math.round(100 - (errorCount * 6)));
        const speedBonus = Math.max(0, 1500 - totalTime * 25);
        const finalScore = Math.max(100, 1000 + speedBonus - errorCount * 50);

        const result: GameResult = {
          gameId: 'trail-making',
          score: finalScore,
          accuracy: accuracy,
          avgReactionTimeMs: Math.round((totalTime / sequenceItems.length) * 1000),
          completedAt: new Date().toISOString(),
          durationSeconds: totalTime,
          difficulty,
        };

        if (onGameEnd) {
          onGameEnd(result);
        }
      } else {
        setCurrentStep(s => s + 1);
        if ((currentStep + 1) % 4 === 0) playSuccess();
      }
    } else {
      // Wrong node!
      playError();
      setErrorCount(e => e + 1);
      setErrorFlashId(node.id);
      setTimeout(() => setErrorFlashId(null), 400);
    }
  };

  const nextExpectedLabel = sequenceItems[currentStep] || '';

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4">
            <GitCommit className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Trail Making Switch ({isPartA ? 'Part A: Numeric' : 'Part B: Alternating'})
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Stimulate your Frontoparietal Task-Switching Network (BA 8/9/40). Connect scattered nodes in rapid sequence. In Part B, switch dynamically between numbers and letters (1 → A → 2 → B → 3 → C).
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl max-w-md mx-auto mb-8 text-center text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Target Sequence Pattern:</p>
            <p className="text-xs font-mono text-teal-400">
              {isPartA ? '1 → 2 → 3 → 4 → 5 → 6...' : '1 → A → 2 → B → 3 → C → 4 → D...'}
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-teal-600/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Trail
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Next Target: <strong className="text-teal-400 font-mono text-base px-2 py-0.5 bg-teal-500/10 rounded border border-teal-500/20">{nextExpectedLabel}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Progress: <strong className="text-white font-mono">{currentStep} / {sequenceItems.length}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Time: <strong className="text-white font-mono tabular-nums">{elapsedSeconds}s</strong></span>
              <span aria-hidden="true">·</span>
              <span>Errors: <strong className="text-rose-400 font-mono tabular-nums">{errorCount}</strong></span>
            </div>
          </div>

          {/* Canvas with SVG Lines and Floating Nodes */}
          <div className="relative w-full h-[400px] md:h-[480px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            {/* SVG Connecting Trail Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connectedPath.map((node, i) => {
                if (i === 0) return null;
                const prev = connectedPath[i - 1];
                return (
                  <line
                    key={`line-${i}`}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isCleared = node.stepOrder < currentStep;
              const isCurrentTarget = node.stepOrder === currentStep;
              const isError = errorFlashId === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  disabled={isCleared}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-150 cursor-pointer shadow-md ${
                    isError
                      ? 'bg-rose-600 text-white border-2 border-rose-400 scale-110 animate-bounce'
                      : isCleared
                      ? 'bg-teal-950 text-teal-400 border border-teal-500/40 opacity-70 cursor-default scale-90'
                      : isCurrentTarget
                      ? 'bg-teal-500 text-slate-950 border-2 border-white shadow-teal-500/50 scale-105'
                      : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-500 hover:scale-105'
                  }`}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4">
            <Check className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Trail Completed</h2>
          <p className="text-slate-400 text-sm mb-6">Frontoparietal Control Network (BA 8/9/40) Activated</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Total Time</span>
              <span className="text-xl font-bold text-teal-400 font-mono tabular-nums">{elapsedSeconds}s</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Errors Made</span>
              <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">{errorCount}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Switch Agility</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">
                {Math.max(0, 100 - errorCount * 8)}%
              </span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
