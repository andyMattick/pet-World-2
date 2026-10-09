import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { User, X, Check, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onSaveProfile: (updates: Partial<PlayerProfile>) => void;
}

const AVATAR_OPTIONS = ['🎲', '🦊', '🦈', '🦉', '🍀', '👑', '⚡', '🎩', '💎', '🔥', '🃏', '🐅'];

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onSaveProfile({
      name: name.trim() || 'LuckyPlayer',
      avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-lg font-bold">Player Dossier</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(item);
                  }}
                  className={`h-11 rounded-lg text-xl flex items-center justify-center border transition-all ${
                    avatar === item
                      ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-xs'
                      : 'bg-slate-800/80 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              Callsign / Nickname
            </label>
            <input
              type="text"
              maxLength={18}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              placeholder="Enter arcade callsign"
            />
          </div>

          {/* Career Snapshot */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Career Record</span>
            </div>

            <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Total Games Played</span>
              <span className="font-mono font-medium text-white">{profile.gamesPlayed}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bingo Duel Victories</span>
              <span className="font-mono font-medium text-white">{(profile.bingoDuelWins || 0).toLocaleString()} wins</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Battleship Armada Victories</span>
              <span className="font-mono font-medium text-cyan-300">{(profile.battleshipWins || 0).toLocaleString()} wins</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Casino War Peak Bankroll</span>
              <span className="font-mono font-medium text-white">${profile.warMaxBankroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-400">Total Arcade Points</span>
              <span className="font-mono font-medium text-white">{profile.totalScore.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md shadow-amber-500/20"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
