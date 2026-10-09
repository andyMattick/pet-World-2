import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, Share2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScoreCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  score: number;
  metricLabel: string;
  metricValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  mode: 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'MEMORY_BINGO' | 'CASINO_WAR' | 'MEMORY_MATRIX';
  onViewLeaderboard: () => void;
  onPlayAgain: () => void;
}

export const ScoreCelebrationModal: React.FC<ScoreCelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  score,
  metricLabel,
  metricValue,
  secondaryLabel,
  secondaryValue,
  onViewLeaderboard,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playVictoryFanfare();
      // Fire confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f59e0b', '#fbbf24', '#ffffff'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#34d399', '#ffffff'],
          });
        }, 250);
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center text-white">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Trophy className="w-8 h-8 text-slate-950" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          {title}
        </h2>
        <p className="text-sm text-slate-400 mb-6">{subtitle}</p>

        {/* Score display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Final Score</div>
          <div className="text-4xl font-extrabold font-mono text-amber-400 tracking-tight mb-2">
            {score.toLocaleString()}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div>
              <span className="text-slate-500">{metricLabel}: </span>
              <span className="font-semibold text-white">{metricValue}</span>
            </div>
            {secondaryLabel && (
              <>
                <span className="text-slate-600">·</span>
                <div>
                  <span className="text-slate-500">{secondaryLabel}: </span>
                  <span className="font-semibold text-white">{secondaryValue}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Play Again
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onViewLeaderboard();
            }}
            className="w-full sm:flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Leaderboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
