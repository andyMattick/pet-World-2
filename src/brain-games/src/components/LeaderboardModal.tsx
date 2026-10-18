import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Award,
  Flame,
  Zap,
  TrendingUp,
  Check,
  Search,
  User,
  Sparkles,
  Calendar,
} from 'lucide-react';
import {
  LeaderboardEntry,
  loadLeaderboard,
  postToLeaderboard,
  getSavedUsername,
  setSavedUsername,
} from '../utils/leaderboardStorage';
import { UserStats } from '../types/game';
import { computeRolling7DayMetrics } from '../utils/rollingAnalytics';
import { playSuccess, playTap } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  initialPostScore?: number | null;
  initialPostLabel?: string | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  stats,
  initialPostScore = null,
  initialPostLabel = null,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<'rolling_7day' | 'streak' | 'single_game'>('rolling_7day');
  const [playerName, setPlayerName] = useState<string>(getSavedUsername);
  const [showPostPrompt, setShowPostPrompt] = useState<boolean>(false);
  const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);

  const rollingMetrics = computeRolling7DayMetrics(stats);

  useEffect(() => {
    if (isOpen) {
      setEntries(loadLeaderboard());
      setPlayerName(getSavedUsername());
      if (initialPostScore !== null) {
        setShowPostPrompt(true);
      }
    }
  }, [isOpen, initialPostScore]);

  if (!isOpen) return null;

  const handlePostScore = () => {
    playTap();
    const finalName = playerName.trim() || 'NeuroNovice';
    setSavedUsername(finalName);

    let scoreToPost = rollingMetrics.rollingAvgDailyPoints;
    let categoryToPost: LeaderboardEntry['category'] = 'rolling_7day';
    let gameTitle = undefined;
    let badge = 'Active Synapse';

    if (activeCategory === 'streak') {
      scoreToPost = Math.max(1, stats.consecutiveDaysStreak);
      categoryToPost = 'streak';
      badge = `${stats.consecutiveDaysStreak}-Day Streak`;
    } else if (activeCategory === 'single_game' && initialPostScore) {
      scoreToPost = initialPostScore;
      categoryToPost = 'single_game';
      gameTitle = initialPostLabel || 'Recent Session';
      badge = 'Game Score';
    } else {
      scoreToPost = initialPostScore ?? rollingMetrics.rollingAvgDailyPoints;
      categoryToPost = 'rolling_7day';
      badge = '7-Day Velocity';
    }

    const { updatedLeaderboard, newRank } = postToLeaderboard({
      username: finalName,
      avatarSeed: 'indigo',
      category: categoryToPost,
      gameTitle,
      score: scoreToPost,
      accuracy: rollingMetrics.rollingAvgAccuracy || 90,
      reactionTimeMs: rollingMetrics.rollingAvgReactionTimeMs || 500,
      badge,
    });

    playSuccess();
    setEntries(updatedLeaderboard);
    setPostSuccessMessage(`🎉 Posted! You are now ranked #${newRank} in this leaderboard.`);
    setTimeout(() => {
      setPostSuccessMessage(null);
      setShowPostPrompt(false);
    }, 3000);
  };

  const filteredEntries = entries
    .filter(e => e.category === activeCategory)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Cognitive Performance Leaderboard</span>
              </h3>
              <span className="text-xs text-slate-400">
                Community rankings for rolling 7-day velocity, streaks, and single-game mastery
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 gap-2 flex-wrap">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-medium">
            <button
              onClick={() => setActiveCategory('rolling_7day')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'rolling_7day' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Rolling 7-Day Velocity</span>
            </button>
            <button
              onClick={() => setActiveCategory('streak')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'streak' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Daily Streaks</span>
            </button>
            <button
              onClick={() => setActiveCategory('single_game')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'single_game' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Game Champions</span>
            </button>
          </div>

          <button
            onClick={() => setShowPostPrompt(!showPostPrompt)}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{showPostPrompt ? 'Hide Post Form' : 'Post My Stats'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Optional Post to Leaderboard Form */}
          {showPostPrompt && (
            <div className="p-4 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Post to Community Leaderboard
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Category: {activeCategory.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-400 block font-medium">Your Display Handle:</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                    maxLength={24}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-medium">Score to Post:</label>
                  <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-emerald-400">
                    {activeCategory === 'streak'
                      ? `${stats.consecutiveDaysStreak} days`
                      : initialPostScore !== null
                      ? `${initialPostScore} pts`
                      : `${rollingMetrics.rollingAvgDailyPoints} pts/day`}
                  </div>
                </div>
              </div>

              {postSuccessMessage ? (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{postSuccessMessage}</span>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowPostPrompt(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostScore}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Confirm & Post</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-950">
                  <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-3">
                    {activeCategory === 'streak'
                      ? 'Streak'
                      : activeCategory === 'single_game'
                      ? 'Game / Score'
                      : 'Rolling 7-Day Velocity'}
                  </th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Accuracy</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEntries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  const rankBadgeClass =
                    rank === 1
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-950 font-extrabold'
                      : rank === 3
                      ? 'bg-amber-700 text-white font-extrabold'
                      : 'bg-slate-800 text-slate-400 font-mono';

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-indigo-950/40 border-l-2 border-indigo-500 font-semibold'
                          : 'hover:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] ${rankBadgeClass}`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {entry.username}
                            {entry.isCurrentUser && (
                              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 tabular-nums">
                        {activeCategory === 'streak' ? (
                          `${entry.score} consecutive days`
                        ) : activeCategory === 'single_game' ? (
                          <div>
                            <span className="text-white text-xs block font-sans">{entry.gameTitle}</span>
                            <span className="text-emerald-400">{entry.score} pts</span>
                          </div>
                        ) : (
                          `${entry.score} pts/day`
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 hidden sm:table-cell tabular-nums">
                        {entry.accuracy ? `${entry.accuracy}%` : '—'}
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        {entry.badge ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300">
                            {entry.badge}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Your Rolling 7-Day Velocity:</span>
            <strong className="text-emerald-400 font-mono font-bold">
              {rollingMetrics.rollingAvgDailyPoints} pts/day
            </strong>
          </div>
          <button
            onClick={() => setShowPostPrompt(true)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Post Latest Score
          </button>
        </div>
      </div>
    </div>
  );
};
