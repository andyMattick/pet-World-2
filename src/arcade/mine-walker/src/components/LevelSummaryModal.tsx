import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Star,
  Trophy,
  ArrowRight,
  RotateCcw,
  Shield,
  Bomb,
  Clock,
  Award,
  Zap,
  Crosshair,
  ShieldCheck,
  Footprints,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { LevelConfig, MissionAccolade } from '../types/game';

interface LevelSummaryModalProps {
  status: 'won' | 'lost';
  levelConfig: LevelConfig;
  elapsedSeconds: number;
  moveCount: number;
  disarmedMines: number;
  intelEarned: number;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onClose: () => void;
  isEndless?: boolean;
  endlessDistance?: number;
  accolades?: MissionAccolade[];
}

export const LevelSummaryModal: React.FC<LevelSummaryModalProps> = ({
  status,
  levelConfig,
  elapsedSeconds,
  moveCount,
  disarmedMines,
  intelEarned,
  isLastLevel,
  onNextLevel,
  onRestart,
  onClose,
  isEndless,
  endlessDistance = 0,
  accolades = []
}) => {
  const isWon = status === 'won';

  // Trigger celebratory confetti on victory
  useEffect(() => {
    if (isWon) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isWon]);

  // Compute stars (1 to 3) based on performance
  const stars = isWon ? (elapsedSeconds < 60 && moveCount < levelConfig.height * 2 ? 3 : elapsedSeconds < 120 ? 2 : 1) : 0;

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const renderAccoladeIcon = (type: MissionAccolade['iconType']) => {
    switch (type) {
      case 'speed':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'clearance':
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'flawless':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'purist':
        return <Footprints className="w-4 h-4 text-cyan-400" />;
      case 'recon':
        return <Eye className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border shrink-0 ${
            isWon
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-red-950/80 border-red-500/60 text-red-400 shadow-lg shadow-red-500/20'
          }`}
        >
          {isWon ? <Trophy className="w-7 h-7" /> : <Bomb className="w-7 h-7" />}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold font-mono tracking-tight mb-1">
          {isEndless
            ? 'ENDLESS OPERATION TERMINATED'
            : isWon
            ? 'EXTRACTION SUCCESSFUL'
            : 'DETONATION FATALITY'}
        </h2>
        <p className="text-xs text-slate-400 mb-4 font-sans">
          {isEndless
            ? `Specialist Miller advanced ${endlessDistance} meters through the rolling barrage.`
            : isWon
            ? `Specialist Miller safely crossed ${levelConfig.codename}.`
            : `Hostile mine triggered in ${levelConfig.codename}. Tactical armor depleted.`}
        </p>

        {/* Stars on Victory */}
        {isWon && !isEndless && (
          <div className="flex items-center gap-2 mb-4 shrink-0">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-6 h-6 transition-all ${
                  starIdx <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Debrief Stats Grid */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 grid grid-cols-2 gap-2.5 text-left font-mono text-xs shrink-0">
          {isEndless ? (
            <div className="flex items-center gap-2 text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Distance Reached</div>
                <div className="font-bold text-amber-400 tabular-nums">{endlessDistance} meters</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Mission Time</div>
                <div className="font-bold tabular-nums">{timeString}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Field Steps</div>
              <div className="font-bold tabular-nums">{moveCount} moves</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Bomb className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Mines Defused</div>
              <div className="font-bold text-emerald-400 tabular-nums">{disarmedMines} mines</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Intel XP</div>
              <div className="font-bold text-yellow-400 tabular-nums">+{intelEarned} XP</div>
            </div>
          </div>
        </div>

        {/* Tactical Accolades & Finish Rewards (Time, Full Clearance, Flawless, Purist) */}
        {isWon && !isEndless && accolades.length > 0 && (
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 mb-5 text-left shrink-0">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Mission Accolades & Merits</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {accolades.filter((a) => a.earned).length} / {accolades.length} Earned
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {accolades.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all ${
                    acc.earned
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-100 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                      acc.earned ? 'bg-slate-900 border border-slate-700' : 'bg-slate-900/50'
                    }`}
                  >
                    {renderAccoladeIcon(acc.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-mono font-bold truncate ${
                          acc.earned ? 'text-amber-300' : 'text-slate-400'
                        }`}
                      >
                        {acc.title}
                      </span>
                      {acc.earned ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1 rounded shrink-0">
                          +{acc.xpReward} XP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600 shrink-0">
                          Locked
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{acc.subtitle}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                      {acc.description}
                    </div>
                  </div>
                  {acc.earned && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3 shrink-0">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redeploy</span>
          </button>

          {!isEndless && isWon && !isLastLevel ? (
            <button
              onClick={onNextLevel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Next Sector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all"
            >
              <span>Return to Base</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
