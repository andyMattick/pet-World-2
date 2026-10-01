import React, { useState } from 'react';
import { X, Award, CheckCircle2, Lock, Flame, Shield, Sparkles, Heart, Crown, Zap, Timer, ChevronRight } from 'lucide-react';
import {
  LEVEL_MATH_MILESTONES,
  STREAK_MILESTONES,
  getPersistedUnlockedHeroIds,
  getLifetimeMathSolved,
  ANSWER_SPEED_TIERS,
} from '../game/mathIncentives';
import { getLevelConfig } from '../game/levelProgression';

interface MathIncentivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: number;
  levelMathSolved?: number;
  levelMilestonesUnlocked?: number[];
  currentSolved?: number;
  currentStreak: number;
  bestStreak: number;
  unlockedMilestones?: number[];
  onOpenCharacterSelect: () => void;
}

export const MathIncentivesModal: React.FC<MathIncentivesModalProps> = ({
  isOpen,
  onClose,
  currentLevel = 1,
  levelMathSolved = 0,
  levelMilestonesUnlocked = [],
  currentSolved = 0,
  currentStreak,
  bestStreak,
  onOpenCharacterSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'level' | 'speed' | 'streaks'>('level');

  if (!isOpen) return null;

  const lifetimeSolved = getLifetimeMathSolved();
  const unlockedHeroIds = getPersistedUnlockedHeroIds();
  const levelConfig = getLevelConfig(currentLevel);

  return (
    <div
      id="math-incentives-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wide font-serif">
                Math Mastery Incentives & Badges
              </h2>
              <p className="text-xs text-slate-400">
                10 in-game milestone rewards per island, answer speed surges, and streak bonuses!
              </p>
            </div>
          </div>
          <button
            id="close-incentives-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Progress Banner */}
        <div className="py-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Island #{currentLevel} Ciphers
              </div>
              <div className="text-lg font-mono font-black text-emerald-400 flex items-center justify-center gap-1">
                <span>{levelMathSolved}</span>
                <span className="text-xs font-normal text-slate-500">/ 10</span>
              </div>
              <div className="text-[10px] text-amber-400/90 font-medium">Resets each island!</div>
            </div>

            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-orange-400 inline" /> Streak
              </div>
              <div className="text-lg font-mono font-black text-orange-400">
                {currentStreak}
              </div>
              <div className="text-[10px] text-slate-500">Best run: {bestStreak}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Math Captains</div>
              <div className="text-lg font-mono font-black text-amber-400">
                {unlockedHeroIds.length} / 2
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCharacterSelect();
                }}
                className="text-[10px] text-sky-400 hover:underline font-semibold"
              >
                Change Hero →
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/60 border border-slate-800 rounded-xl mb-3 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('level')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'level'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>10 Level Milestones ({levelMathSolved}/10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('speed')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'speed'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Speed Bounties</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streaks')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'streaks'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Accuracy Streaks</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1 py-1">
          {/* TAB 1: 10 Island Milestones */}
          {activeTab === 'level' && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300/90">
                ⚓ <strong>Island #{currentLevel} ({levelConfig.islandName}):</strong> Every island presents up to 10 question milestones. Each gives a unique power surge or bounty bonus. When you sail to the next island, question count resets to 0 so you can claim all 10 rewards anew!
              </div>

              <div className="space-y-2">
                {LEVEL_MATH_MILESTONES.map((m) => {
                  const isEarned = levelMilestonesUnlocked.includes(m.threshold) || levelMathSolved >= m.threshold;

                  return (
                    <div
                      key={m.threshold}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isEarned
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                          style={{
                            backgroundColor: `${m.color}20`,
                            borderColor: `${m.color}60`,
                          }}
                        >
                          {m.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-100">{m.title}</span>
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.2 rounded border"
                                style={{
                                  backgroundColor: `${m.color}20`,
                                  color: m.color,
                                  borderColor: `${m.color}40`,
                                }}
                              >
                                {m.badge}
                              </span>
                            </div>

                            {isEarned ? (
                              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-mono">
                                <Lock className="w-3 h-3 text-slate-500" /> Q#{m.threshold}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-300 mt-0.5">{m.perkDescription}</p>
                          <div className="text-[10px] text-amber-400/80 italic mt-0.5">"{m.loreSnippet}"</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Speed Bounties */}
          {activeTab === 'speed' && (
            <div className="space-y-3">
              {/* Island Speed Par Card */}
              <div className="p-3 rounded-xl border border-amber-500/40 bg-slate-950/60">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Island #{currentLevel} Par Clear Time
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                    Par: {levelConfig.parTimeSeconds}s
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Clear all doubloons on the island quickly to claim prestigious speed ranks and bonus bounty points when you conquer the port!
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30">
                    <div className="text-base">🥇</div>
                    <div className="font-bold text-amber-300">Gold Star</div>
                    <div className="text-[10px] text-slate-400">Under Par: +3,000 pts</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                    <div className="text-base">🥈</div>
                    <div className="font-bold text-slate-200">Silver Anchor</div>
                    <div className="text-[10px] text-slate-400">Near Par: +1,500 pts</div>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-950/30 border border-orange-500/30">
                    <div className="text-base">🥉</div>
                    <div className="font-bold text-orange-300">Bronze Cutlass</div>
                    <div className="text-[10px] text-slate-400">Island Clear: +500 pts</div>
                  </div>
                </div>
              </div>

              {/* Individual Question Speed Bonuses */}
              <div className="p-3 rounded-xl border border-sky-500/40 bg-sky-950/20">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>Cipher Calculation Speed Bonuses</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Answering cipher challenges rapidly triggers instant in-game boosts!
                </p>
                <div className="space-y-1.5 text-xs">
                  {ANSWER_SPEED_TIERS.map((tier) => (
                    <div
                      key={tier.tier}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{tier.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">(&lt; {tier.maxSeconds}s)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400">+{tier.bonusPoints} pts</span>
                        {tier.grantSpeedBoost && (
                          <span className="ml-1 text-[10px] font-bold text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                            + Wind Dash
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Accuracy Streaks */}
          {activeTab === 'streaks' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-xs text-orange-200">
                🔥 <strong>Flawless Streaks:</strong> Answer consecutive ciphers correctly without mistakes to unlock exclusive characters and high seas bounties!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STREAK_MILESTONES.map((s) => {
                  const isEarned = bestStreak >= s.streak || (s.unlockedCharacter && unlockedHeroIds.includes(s.unlockedCharacter.id));
                  return (
                    <div
                      key={s.streak}
                      className={`p-3 rounded-xl border ${
                        isEarned
                          ? 'bg-orange-950/20 border-orange-500/40 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{s.icon}</span>
                        <span className="font-bold text-xs text-slate-100">{s.title}</span>
                        {isEarned && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                      </div>
                      <div className="text-xs text-amber-300 font-semibold">{s.bonusText}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.perkText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCharacterSelect();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <span>Math Captains ({unlockedHeroIds.length}/2)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-sm shadow-md transition-colors"
          >
            Back to Island
          </button>
        </div>
      </div>
    </div>
  );
};
