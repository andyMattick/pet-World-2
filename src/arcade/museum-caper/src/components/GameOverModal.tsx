import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ShieldAlert, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { GameRole } from '../types/game';

interface GameOverModalProps {
  outcome: 'thief_escaped' | 'thief_caught';
  userRole: GameRole;
  paintingsStolenCount: number;
  totalPaintings: number;
  turnsTaken: number;
  onRestart: () => void;
  onSwitchRole: (newRole: GameRole) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  outcome,
  userRole,
  paintingsStolenCount,
  totalPaintings,
  turnsTaken,
  onRestart,
  onSwitchRole,
}) => {
  const isThiefEscaped = outcome === 'thief_escaped';

  useEffect(() => {
    if (
      (isThiefEscaped && userRole === 'thief') ||
      (!isThiefEscaped && userRole === 'detectives')
    ) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isThiefEscaped, userRole]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 text-center">
        {/* Banner Icon */}
        <div className="flex justify-center mb-4">
          {isThiefEscaped ? (
            <div className="p-4 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 shadow-xl animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-red-950/80 border-2 border-red-500 text-red-400 shadow-xl animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
          {isThiefEscaped ? 'Heist Successful! Boris Escaped!' : 'Apprehended! Thief Caught!'}
        </h2>

        <p className="text-sm text-slate-300 mb-6">
          {isThiefEscaped
            ? `Boris successfully smuggled ${paintingsStolenCount} masterpieces out of the museum and vanished into the night!`
            : 'The museum detective team cornered the phantom prowler! The museum treasures are secure!'}
        </p>

        {/* Heist Stats */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-left font-mono">
          <div>
            <div className="text-[10px] uppercase text-slate-400">Masterpieces Stolen</div>
            <div className="text-lg font-bold text-amber-400">
              {paintingsStolenCount} / {totalPaintings}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400">Turns Survived</div>
            <div className="text-lg font-bold text-cyan-400">
              {turnsTaken}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Play Another Round
          </button>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSwitchRole('thief')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
            >
              Play as Thief
            </button>
            <button
              onClick={() => onSwitchRole('detectives')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
            >
              Play as Detectives
            </button>
            <button
              onClick={() => onSwitchRole('pass_and_play')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
            >
              2P Pass & Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
