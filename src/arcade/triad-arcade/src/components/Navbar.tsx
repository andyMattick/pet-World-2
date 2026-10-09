import React from 'react';
import { GameMode } from '../types';
import { Volume2, VolumeX, User, HelpCircle, Calendar, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenRules: () => void;
  onOpenProfile: () => void;
  onOpenDaily: () => void;
  dailyCompletedCount: number;
  onOpenAchievements: () => void;
  unlockedAchievementsCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  playerName: string;
  playerAvatar: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenRules,
  onOpenProfile,
  onOpenDaily,
  dailyCompletedCount,
  onOpenAchievements,
  unlockedAchievementsCount,
  isMuted,
  onToggleMute,
  playerName,
  playerAvatar,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectMode('BINGO_DUEL');
          }}
          className="text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors">
            TRIAD ARCADE
          </span>
        </button>

        {/* Zone 2: Navigation Modes */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-700">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('BINGO_WAR');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'BINGO_WAR'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚔️</span>
            <span>Bingo War</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('BATTLESHIP');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'BATTLESHIP'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚓</span>
            <span>Battleship</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('BINGO_DUEL');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'BINGO_DUEL'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🎱</span>
            <span>Bingo Duel</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('CASINO_WAR');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'CASINO_WAR'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🃏</span>
            <span>Casino War</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('MEMORY_MATRIX');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'MEMORY_MATRIX'
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🧠</span>
            <span>Memory Matrix</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('LEADERBOARD');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'LEADERBOARD'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🏆</span>
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">Scores</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Sound, Profile & Rules & Daily) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDaily();
            }}
            title="Daily Challenges"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Daily</span>
            <span className="font-mono text-[11px] bg-amber-500/30 px-1.5 py-0.2 rounded font-bold">
              {dailyCompletedCount}/3
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenAchievements();
            }}
            title="Arcade Achievements & Honors"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Badges</span>
            <span className="font-mono text-[11px] bg-slate-900 px-1.5 py-0.2 rounded font-bold text-amber-400">
              {unlockedAchievementsCount}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenRules();
            }}
            title="Rules & Guide"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors max-w-[130px] truncate cursor-pointer"
          >
            <span className="text-sm">{playerAvatar}</span>
            <span className="truncate">{playerName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

