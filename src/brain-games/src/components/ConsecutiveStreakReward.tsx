import React, { useState } from 'react';
import { UserStats } from '../types/game';
import { playStreak, playTap } from '../utils/audio';
import { Flame, Zap, Award, Sparkles, Check, Gift } from 'lucide-react';

interface ConsecutiveStreakProps {
  stats: UserStats;
  onBonusClaimed?: () => void;
}

export const ConsecutiveStreakReward: React.FC<ConsecutiveStreakProps> = ({
  stats,
}) => {
  const [claimedBonus, setClaimedBonus] = useState<boolean>(false);

  const daysStreak = Math.max(1, stats.consecutiveDaysStreak || 1);
  const gamesToday = stats.consecutiveGamesToday || 0;

  // Multiplier logic
  const multiplier = gamesToday >= 3 ? '1.30x' : gamesToday >= 2 ? '1.20x' : '1.10x';

  const handleClaim = () => {
    playStreak();
    setClaimedBonus(true);
    setTimeout(() => setClaimedBonus(false), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Consecutive Days & Daily Games Counter */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-white">
                {daysStreak}-Day Neural Consistency Streak
              </h3>
              <span className="text-xs font-mono text-orange-400">
                · Combo: {gamesToday} {gamesToday === 1 ? 'game' : 'games'} today
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consecutive game check-ins compound synaptic strength and unlock dopamine reinforcement rewards.
            </p>
          </div>
        </div>

        {/* Right Side: Active Multiplier & Reward Action */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Active Multiplier:</span>
            <span className="text-white font-bold">{multiplier}</span>
          </div>

          <button
            onClick={handleClaim}
            disabled={claimedBonus}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              claimedBonus
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {claimedBonus ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>+50 Bonus Synapses Claimed!</span>
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5" />
                <span>Check-in Reward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Consecutive Stepper Indicators */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
          gamesToday >= 1
            ? 'bg-slate-950/80 border-indigo-500/40 text-slate-200'
            : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
            gamesToday >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
          }`}>1</span>
          <div>
            <span className="font-semibold block text-white text-[11px]">1st Session</span>
            <span className="text-[10px] text-slate-400">+10% Synaptic Rate</span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
          gamesToday >= 2
            ? 'bg-slate-950/80 border-indigo-500/40 text-slate-200'
            : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
            gamesToday >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
          }`}>2</span>
          <div>
            <span className="font-semibold block text-white text-[11px]">2nd Session</span>
            <span className="text-[10px] text-slate-400">+20% Synaptic Rate</span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
          gamesToday >= 3
            ? 'bg-slate-950/80 border-amber-500/40 text-slate-200'
            : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
            gamesToday >= 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
          }`}>3</span>
          <div>
            <span className="font-semibold block text-white text-[11px]">3+ Circuit Complete</span>
            <span className="text-[10px] text-amber-400">+30% Max Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
