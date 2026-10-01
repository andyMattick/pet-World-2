import React from 'react';
import { X, Check, Lock, GraduationCap, Flame } from 'lucide-react';
import { PirateCharacter } from '../types';
import { CHARACTERS } from '../game/constants';
import { getPersistedUnlockedHeroIds, getLifetimeMathSolved } from '../game/mathIncentives';

interface CharacterSelectModalProps {
  isOpen: boolean;
  selectedChar: PirateCharacter;
  onSelect: (char: PirateCharacter) => void;
  onClose: () => void;
  solvedCount?: number;
  bestStreak?: number;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  isOpen,
  selectedChar,
  onSelect,
  onClose,
  solvedCount = 0,
  bestStreak = 0,
}) => {
  if (!isOpen) return null;

  const unlockedIds = getPersistedUnlockedHeroIds();
  const lifetimeSolved = getLifetimeMathSolved();

  const isCharUnlocked = (char: PirateCharacter): boolean => {
    if (!char.isMathUnlocked) return true;
    if (unlockedIds.includes(char.id)) return true;
    if (char.requiredSolved && (solvedCount >= char.requiredSolved || lifetimeSolved >= char.requiredSolved)) return true;
    if (char.requiredStreak && bestStreak >= char.requiredStreak) return true;
    return false;
  };

  return (
    <div id="character-select-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-black text-amber-300 tracking-wide font-serif flex items-center gap-2">
              <span>Choose Your Corsair</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-sans font-normal">
                Math Roster
              </span>
            </h2>
            <p className="text-xs text-slate-400">Master math ciphers to unlock legendary pirate scholars</p>
          </div>
          <button
            id="close-char-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Characters List */}
        <div className="py-3 space-y-2.5 overflow-y-auto pr-1">
          {CHARACTERS.map((char) => {
            const isSelected = selectedChar.id === char.id;
            const unlocked = isCharUnlocked(char);

            const getIcon = () => {
              if (char.id === 'blackbeard') return '🏴‍☠️';
              if (char.id === 'anne_bonny') return '⚔️';
              if (char.id === 'calico_jack') return '🪙';
              if (char.id === 'hypatia_navigator') return '🧭';
              if (char.id === 'archimedes_bombardier') return '🧪';
              return '🏴‍☠️';
            };

            return (
              <div
                key={char.id}
                id={`char-card-${char.id}`}
                onClick={() => {
                  if (unlocked) onSelect(char);
                }}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 ${
                  !unlocked
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-70 cursor-not-allowed'
                    : isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400 cursor-pointer'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer'
                }`}
              >
                {/* Pirate Avatar Visual */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border relative"
                  style={{ backgroundColor: char.color, borderColor: char.accentColor }}
                >
                  <span className="text-2xl">{getIcon()}</span>
                  {!unlocked ? (
                    <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                  ) : isSelected ? (
                    <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-100">{char.name}</h3>
                      {char.isMathUnlocked && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 flex items-center gap-0.5">
                          <GraduationCap className="w-2.5 h-2.5" /> Math Hero
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      {char.perk}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400/80 font-medium italic mb-0.5">{char.title}</div>
                  <p className="text-xs text-slate-300 leading-snug">{char.description}</p>

                  {/* Lock Requirement indicator if not unlocked */}
                  {!unlocked && (
                    <div className="mt-2 text-[11px] font-semibold text-rose-400 bg-rose-950/30 border border-rose-800/40 rounded-lg px-2 py-1 flex items-center gap-1.5">
                      {char.requiredStreak ? (
                        <>
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>Requires {char.requiredStreak}-Problem Perfect Math Streak (Best: {bestStreak})</span>
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Solve {char.requiredSolved} Math Ciphers to unlock (Solved: {Math.max(solvedCount, lifetimeSolved)}/{char.requiredSolved})</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            {unlockedIds.length > 0 ? (
              <span className="text-emerald-400 font-semibold">✨ {unlockedIds.length} Math Hero(es) Unlocked!</span>
            ) : (
              <span>Solve 5 ciphers or get a 5-streak to unlock heroes</span>
            )}
          </div>
          <button
            id="char-confirm-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-sm shadow-md transition-colors"
          >
            Ready for Plunder!
          </button>
        </div>
      </div>
    </div>
  );
};
