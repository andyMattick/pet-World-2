import React, { useState, useEffect } from 'react';
import { GameMode, LeaderboardEntry, PlayerProfile, WarStats, DailyChallengeState, Achievement } from './types';
import { Navbar } from './components/Navbar';
import { BingoWarMode } from './modes/BingoWar/BingoWarMode';
import { BattleshipMode } from './modes/Battleship/BattleshipMode';
import { BingoDuelMode } from './modes/ClassicBingo/BingoDuelMode';
import { CasinoWarMode } from './modes/CasinoWar/CasinoWarMode';
import { MemoryMatrixMode } from './modes/MemoryMatrix/MemoryMatrixMode';
import { LeaderboardView } from './modes/Leaderboard/LeaderboardView';
import { ScoreCelebrationModal } from './components/ScoreCelebrationModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { RulesModal } from './components/RulesModal';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AchievementToast } from './components/AchievementToast';
import {
  getLeaderboard,
  saveLeaderboardEntry,
  getPlayerProfile,
  savePlayerProfile,
  resetLeaderboardToDefaults,
} from './utils/storage';
import { getDailyChallengeState, updateDailyChallengeProgress } from './utils/dailyChallenges';
import { getAchievements, checkAndUnlockAchievements } from './utils/achievements';
import { sounds } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('BINGO_WAR');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());
  const [profile, setProfile] = useState<PlayerProfile>(() => getPlayerProfile());
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());
  const [dailyState, setDailyState] = useState<DailyChallengeState>(() => getDailyChallengeState());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getAchievements());
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);

  // Celebration Modal state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    score: number;
    metricLabel: string;
    metricValue: string;
    secondaryLabel?: string;
    secondaryValue?: string;
    mode: 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'MEMORY_BINGO' | 'CASINO_WAR' | 'MEMORY_MATRIX';
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    score: 0,
    metricLabel: '',
    metricValue: '',
    mode: 'BINGO_WAR',
  });

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateProfile = (updates: Partial<PlayerProfile>) => {
    const updated = savePlayerProfile(updates);
    setProfile(updated);
  };

  const handleResetLeaderboard = () => {
    const reset = resetLeaderboardToDefaults();
    setLeaderboard(reset);
  };

  // Game completion handlers
  const handleBingoWarComplete = (
    score: number,
    metrics: { patternCount: number; duelsWon: number; warsWon: number; winner: 'PLAYER' | 'COMPUTER' }
  ) => {
    const isWin = metrics.winner === 'PLAYER';
    saveLeaderboardEntry({
      playerName: profile.name,
      avatar: profile.avatar,
      mode: 'BINGO_WAR',
      score,
      metricLabel: 'Winner',
      metricValue: isWin ? 'War Victory' : 'Bot Won War',
      secondaryLabel: 'Battle Pattern',
      secondaryValue: `${metrics.patternCount} Targets · ${metrics.warsWon} Wars Won`,
    });

    // Check Daily Challenge progress
    const { state: updatedDaily, newlyCompleted } = updateDailyChallengeProgress('BINGO_WAR', {
      won: isWin,
      warsWon: metrics.warsWon,
    });
    setDailyState(updatedDaily);

    // Check Achievements
    const newAchievements = checkAndUnlockAchievements({
      mode: 'WAR',
      event: 'BINGO_WAR',
      data: { won: isWin, warsWon: metrics.warsWon },
    });
    if (newAchievements.length > 0) {
      setAchievements(getAchievements());
      setActiveToast(newAchievements[0]);
    }

    setLeaderboard(getLeaderboard());
    setProfile(getPlayerProfile());

    setCelebration({
      isOpen: true,
      title: isWin ? '⚔️ BINGO WAR VICTORY!' : 'COMMANDER VANE WON WAR',
      subtitle: isWin
        ? `You conquered all ${metrics.patternCount} custom pattern squares through card duels!${
            newlyCompleted ? ` 🎯 Completed Daily Challenge: "${newlyCompleted.title}"!` : ''
          }`
        : `Commander Vane completed their battle pattern first.`,
      score,
      metricLabel: 'Custom Target Pattern',
      metricValue: `${metrics.patternCount} Squares`,
      secondaryLabel: 'Duels & Wars Won',
      secondaryValue: `${metrics.duelsWon} Duels · ${metrics.warsWon} Wars`,
      mode: 'BINGO_WAR',
    });
  };

  const handleBattleshipComplete = (
    score: number,
    metrics: { turns: number; accuracy: number; shipsLost: number; winner: 'PLAYER' | 'COMPUTER' }
  ) => {
    const isWin = metrics.winner === 'PLAYER';
    saveLeaderboardEntry({
      playerName: profile.name,
      avatar: profile.avatar,
      mode: 'BATTLESHIP',
      score,
      metricLabel: 'Outcome',
      metricValue: isWin ? 'Naval Victory' : 'Armada Defeated',
      secondaryLabel: 'Rounds & Accuracy',
      secondaryValue: `${metrics.turns} Rounds · ${metrics.accuracy}% Acc · Lost ${metrics.shipsLost} Ships`,
    });

    if (isWin) {
      handleUpdateProfile({
        battleshipWins: (profile.battleshipWins || 0) + 1,
      });
    }

    // Daily Challenge progress
    const { state: updatedDaily, newlyCompleted } = updateDailyChallengeProgress('BATTLESHIP', {
      won: isWin,
      turns: metrics.turns,
      accuracy: metrics.accuracy,
    });
    setDailyState(updatedDaily);

    // Achievements
    const newAchievements = checkAndUnlockAchievements({
      mode: 'BATTLESHIP',
      event: 'BATTLESHIP_WIN',
      data: { won: isWin, accuracy: metrics.accuracy, turns: metrics.turns },
    });
    if (newAchievements.length > 0) {
      setAchievements(getAchievements());
      setActiveToast(newAchievements[0]);
    }

    setLeaderboard(getLeaderboard());
    setProfile(getPlayerProfile());

    setCelebration({
      isOpen: true,
      title: isWin ? '⚓ NAVAL ARMADA CONQUEST!' : 'FLEET ENGAGEMENT OVER',
      subtitle: isWin
        ? `You sunk Commander Vane's armada in ${metrics.turns} rounds with ${metrics.accuracy}% accuracy!${
            newlyCompleted ? ` 🎯 Daily Challenge Completed: "${newlyCompleted.title}"!` : ''
          }`
        : `Admiral Vane prevailed in this naval theater. Reorganize for a counter-attack!`,
      score,
      metricLabel: 'Firing Accuracy',
      metricValue: `${metrics.accuracy}%`,
      secondaryLabel: 'Fleet Rounds',
      secondaryValue: `${metrics.turns} Rounds (Lost ${metrics.shipsLost} Ships)`,
      mode: 'BATTLESHIP',
    });
  };

  const handleBingoDuelComplete = (
    score: number,
    metrics: { pattern: string; calls: number; winner: 'PLAYER' | 'COMPUTER' }
  ) => {
    const isWin = metrics.winner === 'PLAYER';
    saveLeaderboardEntry({
      playerName: profile.name,
      avatar: profile.avatar,
      mode: 'BINGO_DUEL',
      score,
      metricLabel: 'Winner',
      metricValue: isWin ? `Victory (${metrics.calls} calls)` : `Defeat (${metrics.calls} calls)`,
      secondaryLabel: 'Pattern',
      secondaryValue: `${metrics.pattern} vs BingoBot`,
    });

    // Check Daily Challenge progress
    const { state: updatedDaily, newlyCompleted } = updateDailyChallengeProgress('BINGO_DUEL', {
      won: isWin,
      pattern: metrics.pattern,
      calls: metrics.calls,
    });
    setDailyState(updatedDaily);

    // Check Achievements
    const newAchievements = checkAndUnlockAchievements({
      mode: 'BINGO',
      event: 'WIN',
      data: { won: isWin, calls: metrics.calls, pattern: metrics.pattern },
    });
    if (newAchievements.length > 0) {
      setAchievements(getAchievements());
      setActiveToast(newAchievements[0]);
    }

    setLeaderboard(getLeaderboard());
    setProfile(getPlayerProfile());

    setCelebration({
      isOpen: true,
      title: isWin ? 'BINGO VICTORY!' : 'BINGOBOT CALLED BINGO!',
      subtitle: isWin
        ? `You completed ${metrics.pattern} in ${metrics.calls} ball calls and defeated the computer!${
            newlyCompleted ? ` 🎯 Completed Daily Challenge: "${newlyCompleted.title}"!` : ''
          }`
        : `BingoBot 3000 completed ${metrics.pattern} in ${metrics.calls} ball calls.`,
      score,
      metricLabel: 'Winning Pattern',
      metricValue: metrics.pattern,
      secondaryLabel: 'Total Balls Called',
      secondaryValue: `${metrics.calls} Balls`,
      mode: 'BINGO_DUEL',
    });
  };

  const handleCasinoWarComplete = (score: number, stats: WarStats) => {
    saveLeaderboardEntry({
      playerName: profile.name,
      avatar: profile.avatar,
      mode: 'CASINO_WAR',
      score,
      metricLabel: 'Peak Bankroll',
      metricValue: `$${stats.peakBankroll.toLocaleString()}`,
      secondaryLabel: 'Wars Won',
      secondaryValue: `${stats.warsWon}/${stats.warsFought} Wars · Streak ${stats.bestStreak}`,
    });

    // Check Daily Challenge progress
    const { state: updatedDaily, newlyCompleted } = updateDailyChallengeProgress('CASINO_WAR', {
      warsWon: stats.warsWon,
      streak: stats.bestStreak,
    });
    setDailyState(updatedDaily);

    // Check Achievements
    const newAchievements = checkAndUnlockAchievements({
      mode: 'WAR',
      event: 'ROUND',
      data: {
        won: stats.warsWon > 0 || stats.currentStreak > 0,
        warsWon: stats.warsWon,
        streak: stats.bestStreak,
        bankroll: stats.bankroll,
      },
    });
    if (newAchievements.length > 0) {
      setAchievements(getAchievements());
      setActiveToast(newAchievements[0]);
    }

    setLeaderboard(getLeaderboard());
    setProfile(getPlayerProfile());

    setCelebration({
      isOpen: true,
      title: 'CASINO CASH OUT!',
      subtitle: `Bankroll finalized at $${stats.bankroll.toLocaleString()} with ${stats.warsWon} War victories.${
        newlyCompleted ? ` 🎯 Completed Daily Challenge: "${newlyCompleted.title}"!` : ''
      }`,
      score,
      metricLabel: 'Peak Bankroll',
      metricValue: `$${stats.peakBankroll.toLocaleString()}`,
      secondaryLabel: 'Best Win Streak',
      secondaryValue: `${stats.bestStreak} Rounds`,
      mode: 'CASINO_WAR',
    });
  };

  const handleMemoryMatrixComplete = (
    score: number,
    metrics: { time: string; flips: number; accuracy: number; difficulty: string }
  ) => {
    saveLeaderboardEntry({
      playerName: profile.name,
      avatar: profile.avatar,
      mode: 'MEMORY_MATRIX',
      score,
      metricLabel: 'Time',
      metricValue: metrics.time,
      secondaryLabel: 'Accuracy',
      secondaryValue: `${metrics.accuracy}% (${metrics.difficulty.toLowerCase()})`,
    });

    // Check Daily Challenge progress
    const { state: updatedDaily, newlyCompleted } = updateDailyChallengeProgress('MEMORY_MATRIX', {
      difficulty: metrics.difficulty,
      accuracy: metrics.accuracy,
    });
    setDailyState(updatedDaily);

    // Check Achievements
    const timeSecs = parseInt(metrics.time, 10) || 45;
    const newAchievements = checkAndUnlockAchievements({
      mode: 'MEMORY',
      event: 'CLEAR',
      data: {
        timeSeconds: timeSecs,
        accuracy: metrics.accuracy,
        difficulty: metrics.difficulty,
      },
    });
    if (newAchievements.length > 0) {
      setAchievements(getAchievements());
      setActiveToast(newAchievements[0]);
    }

    setLeaderboard(getLeaderboard());
    setProfile(getPlayerProfile());

    setCelebration({
      isOpen: true,
      title: 'MATRIX CLEARED!',
      subtitle: `Solved in ${metrics.time} with ${metrics.accuracy}% memory accuracy!${
        newlyCompleted ? ` 🎯 Completed Daily Challenge: "${newlyCompleted.title}"!` : ''
      }`,
      score,
      metricLabel: 'Completion Time',
      metricValue: metrics.time,
      secondaryLabel: 'Accuracy',
      secondaryValue: `${metrics.accuracy}%`,
      mode: 'MEMORY_MATRIX',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        dailyCompletedCount={dailyState.challenges.filter((c) => c.isCompleted).length}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        unlockedAchievementsCount={achievements.filter((a) => a.isUnlocked).length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        playerName={profile.name}
        playerAvatar={profile.avatar}
      />

      {/* Main Content Arena with seamless tab switching */}
      <main className="flex-1 pb-16">
        {/* Bingo War Mode */}
        <div className={currentMode === 'BINGO_WAR' ? 'block' : 'hidden'}>
          <BingoWarMode
            onCompleteGame={handleBingoWarComplete}
            playerName={profile.name}
          />
        </div>

        {/* Battleship Mode */}
        <div className={currentMode === 'BATTLESHIP' ? 'block' : 'hidden'}>
          <BattleshipMode
            onCompleteGame={handleBattleshipComplete}
            playerName={profile.name}
          />
        </div>

        {/* Bingo Duel Mode */}
        <div className={currentMode === 'BINGO_DUEL' ? 'block' : 'hidden'}>
          <BingoDuelMode
            onCompleteGame={handleBingoDuelComplete}
            playerName={profile.name}
          />
        </div>

        {/* Casino War Mode */}
        <div className={currentMode === 'CASINO_WAR' ? 'block' : 'hidden'}>
          <CasinoWarMode onCompleteGame={handleCasinoWarComplete} />
        </div>

        {/* Memory Matrix Mode */}
        <div className={currentMode === 'MEMORY_MATRIX' ? 'block' : 'hidden'}>
          <MemoryMatrixMode onCompleteGame={handleMemoryMatrixComplete} />
        </div>

        {/* Leaderboard View */}
        <div className={currentMode === 'LEADERBOARD' ? 'block' : 'hidden'}>
          <LeaderboardView
            entries={leaderboard}
            onResetLeaderboard={handleResetLeaderboard}
            playerName={profile.name}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-400">TRIAD ARCADE</span>
            <span>·</span>
            <span>Memory Bingo &amp; Card Suite</span>
          </div>
          <div>
            <span>Cross-Mode High Scores Saved Locally</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScoreCelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        subtitle={celebration.subtitle}
        score={celebration.score}
        metricLabel={celebration.metricLabel}
        metricValue={celebration.metricValue}
        secondaryLabel={celebration.secondaryLabel}
        secondaryValue={celebration.secondaryValue}
        mode={celebration.mode}
        onViewLeaderboard={() => {
          setCurrentMode('LEADERBOARD');
        }}
        onPlayAgain={() => {
          // Stay on current mode
        }}
      />

      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        defaultTab={
          currentMode === 'BATTLESHIP'
            ? 'BATTLESHIP'
            : currentMode === 'BINGO_WAR'
            ? 'BINGO_WAR'
            : currentMode === 'CASINO_WAR'
            ? 'WAR'
            : currentMode === 'MEMORY_MATRIX'
            ? 'MEMORY'
            : 'BINGO'
        }
      />

      <DailyChallengesModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        state={dailyState}
        onNavigateToMode={(mode) => setCurrentMode(mode)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <AchievementToast
        achievement={activeToast}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}
