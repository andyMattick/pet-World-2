import React from 'react';
import { X, ShieldAlert, Sparkles, Wind, Bomb, Coins, Compass, Anchor, Timer, Zap } from 'lucide-react';
import { LEVEL_PROGRESSION_MAP } from '../game/levelProgression';

interface PowerUpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: number;
}

export const PowerUpGuideModal: React.FC<PowerUpGuideModalProps> = ({ isOpen, onClose, currentLevel = 1 }) => {
  if (!isOpen) return null;

  const powers = [
    {
      title: 'Broadside Cannons (Press SPACE or F)',
      unlockedAtLevel: 1,
      icon: <Bomb className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/30',
      description: 'Fire heavy cast-iron cannonballs forward to sink pursuing Royal Navy warships! Direct hits disable warships and award +250 bounty points. Refill ammo at Ammo Depots (⚓).',
    },
    {
      title: 'Explosive Powder Kegs (Press B or E)',
      unlockedAtLevel: 1,
      icon: <Bomb className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/30',
      description: 'Drop floating iron-banded powder kegs behind your ship. When pursuing navy warships close in, the keg detonates in a massive 5-tile blast knocking warships back to port!',
    },
    {
      title: 'Island Treasure Vault (Bank Cargo Doubloons)',
      unlockedAtLevel: 1,
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      color: 'border-yellow-500/40 bg-yellow-950/30',
      description: 'Collect gold doubloons into your ship cargo hold, then sail into the Pirate Island Vault pier (🏛️) to securely bank your loot for a massive +15x bonus score payout! If your ship sinks before banking, half your unbanked cargo is lost.',
    },
    {
      title: 'Mystic Sea Whirlpools (Sea Portal Teleport)',
      unlockedAtLevel: 1,
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-950/30',
      description: 'Sail into any swirling oceanic vortex (🌀) to instantly teleport across the archipelago to another island harbor dock, shaking off pursuing warships in seconds!',
    },
    {
      title: 'Ammo Haven Depots (Reload Ammunition)',
      unlockedAtLevel: 1,
      icon: <Anchor className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-950/30',
      description: 'Running low on shot or powder? Land at an Ammo Depot dock (⚓) along island shores to reload all cannonballs (5/5), powder kegs (2/2), and combat charges to full capacity!',
    },
    {
      title: 'Fight Back! (Royal Grog Overdrive)',
      unlockedAtLevel: 1,
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/30',
      description: 'Unleash broadside fury! Royal Navy warships hoist white flags and flee in panic. Ram fleeing warships for 200, 400, 800, and 1600 bounty points!',
    },
    {
      title: 'Swift Rum (Buccaneer Wind Dash - Press SHIFT or Q)',
      unlockedAtLevel: 1,
      icon: <Wind className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-950/30',
      description: 'Turbocharge your ship sails with a 1.8x speed dash and aqua wind trails to escape tight corners or sweep long waterways!',
    },
    {
      title: 'Ghost Mist Cloak (Spectral Phasing - Press C or R)',
      unlockedAtLevel: 2,
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/30',
      description: 'Shrouds your pirate vessel in eerie ghostly sea mist, allowing you to safely phase right through enemy warships unharmed!',
    },
  ];

  return (
    <div id="powerup-guide-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏴‍☠️</span>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wide font-serif">
                Island Progression & Arsenal Guide
              </h2>
              <p className="text-xs text-slate-400">
                Each level unlocks new power-ups, heroes, and escalating arithmetic challenges!
              </p>
            </div>
          </div>
          <button
            id="close-guide-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto py-3 space-y-3.5 pr-1">
          {/* Island Progression Timeline */}
          <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🗺️</span> 5-Island Campaign Progression
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {LEVEL_PROGRESSION_MAP.map((lvl) => {
                const isCurrent = lvl.level === currentLevel;
                const isPassed = lvl.level < currentLevel;
                return (
                  <div
                    key={lvl.level}
                    className={`p-2 rounded-lg border flex flex-col gap-0.5 ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-500/20 shadow-sm'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">
                        Island #{lvl.level}: {lvl.islandName}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-300/90 font-medium">
                      Math: {lvl.mathDifficultyName}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      🎁 Feature: {lvl.newPowerUpUnlocked ? `${lvl.newPowerUpUnlocked.icon} ${lvl.newPowerUpUnlocked.name}` : `${lvl.featuredHero.name}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speed Scoring Rewards Explainer */}
          <div className="p-3 rounded-xl border border-sky-500/40 bg-sky-950/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-900/60 border border-sky-600/50 shrink-0 text-sky-300">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h3 className="text-sm font-bold text-sky-200 mb-0.5 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-sky-400" />
                <span>Speed Bounties & Lightning Answer Bonuses</span>
              </h3>
              <p className="text-sky-100/90 leading-relaxed">
                Players are rewarded for speed on two fronts:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300 text-[11px]">
                <li><strong>Lightning Ciphers:</strong> Solve a math problem in under 3.5s for <strong>+300 pts &amp; instant wind dash</strong> (under 7s for +150 pts).</li>
                <li><strong>Island Par Speed:</strong> Finish the level under par time for up to <strong>+3,000 Doubloons</strong> and Gold speed medals!</li>
              </ul>
            </div>
          </div>

          {/* Power-Ups Arsenal */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              High Seas Arsenal & Power-Ups
            </div>
            {powers.map((p, idx) => {
              const isUnlocked = currentLevel >= p.unlockedAtLevel;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${p.color} flex items-start gap-3 transition-opacity ${
                    isUnlocked ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-100">{p.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isUnlocked
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isUnlocked ? `Unlocked (Lv ${p.unlockedAtLevel}+)` : `Unlocks at Island #${p.unlockedAtLevel}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* British Guard Intel */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>💂‍♂️</span> British Guard Personalities
            </div>
            <div>• <strong className="text-rose-400">Capt. Sterling (Red):</strong> Relentless pursuer, directly hounds your coordinates.</div>
            <div>• <strong className="text-pink-400">Lt. Hastings (Pink):</strong> Interceptor, aims 4 tiles ahead of your heading.</div>
            <div>• <strong className="text-cyan-400">Sgt. O'Malley (Cyan):</strong> Flanker, coordinates with Sterling to pinch your escape.</div>
            <div>• <strong className="text-amber-400">Officer Higgins (Orange):</strong> Sentry, chases from afar then patrols his fortress corner.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            id="guide-got-it-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-sm shadow-md transition-colors"
          >
            Aye, Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

