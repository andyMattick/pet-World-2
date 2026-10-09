import React, { useState } from 'react';
import { LeaderboardCategory, LeaderboardEntry } from '../../types';
import { Trophy, Sparkles, Swords, Brain, RotateCcw, Filter, User } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onResetLeaderboard: () => void;
  playerName: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  onResetLeaderboard,
  playerName,
}) => {
  const [filter, setFilter] = useState<LeaderboardCategory>('ALL_TIME');
  const [onlyUserScores, setOnlyUserScores] = useState<boolean>(false);

  const filteredEntries = entries.filter((item) => {
    if (filter === 'ALL_TIME') {
      return !onlyUserScores || item.isUser || item.playerName === playerName;
    }
    const matchesMode =
      item.mode === filter ||
      (filter === 'BINGO_DUEL' && item.mode === 'MEMORY_BINGO');
    return matchesMode && (!onlyUserScores || item.isUser || item.playerName === playerName);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Visual Tournament Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4" />
            <span>Arcade Hall of Fame</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Triad Championship Board
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Record your best performances across Memory Bingo, Casino War, and Memory Matrix. Compete against top challengers and establish your reign.
          </p>
        </div>

        {/* Visual Banner Thumbnail */}
        <div className="relative z-10 w-full sm:w-56 h-28 rounded-2xl overflow-hidden border border-amber-400/30 shadow-lg bg-slate-900 shrink-0">
          <img
            src="/src/assets/images/arcade_trophy_banner_1791388131959.jpg"
            alt="Arcade Trophy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Filter and Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('ALL_TIME');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'ALL_TIME'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            All Modes
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setFilter('BINGO_WAR');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'BINGO_WAR'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Bingo War
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setFilter('BATTLESHIP');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'BATTLESHIP'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚓</span>
            Battleship
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setFilter('BINGO_DUEL');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'BINGO_DUEL'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Bingo Duel
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setFilter('CASINO_WAR');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'CASINO_WAR'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Casino War
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setFilter('MEMORY_MATRIX');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'MEMORY_MATRIX'
                ? 'bg-purple-500 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            Memory
          </button>
        </div>

        {/* User filter & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setOnlyUserScores(!onlyUserScores);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              onlyUserScores
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-xs'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Scores Only</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset leaderboard to arcade baseline records?')) {
                sounds.playClick();
                onResetLeaderboard();
              }
            }}
            title="Reset Board Records"
            className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 sm:px-6 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4 sm:px-6">Player</th>
                <th className="py-3.5 px-4 sm:px-6">Mode</th>
                <th className="py-3.5 px-4 sm:px-6">Primary Metric</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Arcade Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                    No scores recorded in this category yet. Play a round to claim first place!
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item, index) => {
                  const isTop3 = index < 3;
                  const medalColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
                  const isCurrentUser = item.isUser || item.playerName === playerName;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-amber-500/10 hover:bg-amber-500/15'
                          : 'hover:bg-slate-850/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 sm:px-6 text-center font-mono font-bold">
                        {isTop3 ? (
                          <span className={`text-base ${medalColors[index]}`}>
                            #{index + 1}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">#{index + 1}</span>
                        )}
                      </td>

                      {/* Player */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                            {item.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{item.playerName}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] text-amber-400 bg-amber-400/20 px-1.5 py-0.2 rounded font-medium">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{item.date}</div>
                          </div>
                        </div>
                      </td>

                      {/* Mode (Clean unboxed text metadata) */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="text-xs font-medium text-slate-300">
                          {(item.mode === 'BINGO_DUEL' || item.mode === 'MEMORY_BINGO') && 'Bingo Duel'}
                          {item.mode === 'CASINO_WAR' && 'Casino War'}
                          {item.mode === 'MEMORY_MATRIX' && 'Memory Match'}
                        </div>
                      </td>

                      {/* Primary Metric with secondary details */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="text-xs">
                          <span className="font-semibold text-white font-mono tabular-nums">
                            {item.metricValue}
                          </span>
                          {item.secondaryValue && (
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              {item.secondaryValue}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Arcade Score */}
                      <td className="py-4 px-4 sm:px-6 text-right font-mono font-extrabold text-base text-amber-400 tabular-nums">
                        {item.score.toLocaleString()} pts
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
