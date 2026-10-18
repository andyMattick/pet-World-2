import React, { useState, useEffect, useMemo } from 'react';
import { GAMES_CATALOG } from './data/gamesCatalog';
import { GameDefinition, GameResult, UserStats, Achievement, BaselineResult } from './types/game';
import { loadUserStats, saveGameResult } from './utils/storage';
import {
  getSoundEnabled,
  setSoundEnabled,
  playTap,
  playStreak,
  playVictory,
  getZenModeEnabled,
  setZenModeEnabled,
  startZenMusic,
  stopZenMusic,
  isZenMusicActive,
} from './utils/audio';

import { Header } from './components/Header';
import { ZenModeHUD } from './components/ZenModeHUD';
import { EmbedExportModal } from './components/EmbedExportModal';
import { NeuralPathwayMap } from './components/NeuralPathwayMap';
import { DailyRegimenModal } from './components/DailyRegimenModal';
import { AchievementsShowcase } from './components/AchievementsShowcase';
import { AchievementsModal } from './components/AchievementsModal';
import { RecommendedGamesSection } from './components/RecommendedGamesSection';
import { ConsecutiveStreakReward } from './components/ConsecutiveStreakReward';
import { ProgressOverTimeView } from './components/ProgressOverTimeView';
import { CognitiveInsightsView } from './components/CognitiveInsightsView';
import { AchievementUnlockToast } from './components/AchievementUnlockToast';
import { BaselineTestModal } from './components/BaselineTestModal';
import { GameGuideModal } from './components/GameGuideModal';
import { WarmupModal } from './components/WarmupModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { generateDynamicDailyWorkout } from './utils/dailyWorkoutEngine';

import { DualNBackGame } from './games/DualNBackGame';
import { StroopClashGame } from './games/StroopClashGame';
import { ChimpMemoryGame } from './games/ChimpMemoryGame';
import { TrailMakingGame } from './games/TrailMakingGame';
import { SpeedCalcGame } from './games/SpeedCalcGame';
import { PatternMatrixGame } from './games/PatternMatrixGame';
import { FlankerTaskGame } from './games/FlankerTaskGame';
import { WordFluencyGame } from './games/WordFluencyGame';
import { CorsiBlockGame } from './games/CorsiBlockGame';
import { GoNoGoGame } from './games/GoNoGoGame';
import { MentalRotationGame } from './games/MentalRotationGame';
import { CardSortingGame } from './games/CardSortingGame';

import {
  Brain,
  Play,
  Code2,
  ArrowLeft,
  Activity,
  Trophy,
  Compass,
  BookOpen,
  CheckCircle2,
  Check,
  Sparkles,
  Music,
  EyeOff,
  Sliders,
} from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [soundOn, setSoundOn] = useState<boolean>(getSoundEnabled);
  const [isZenMode, setIsZenMode] = useState<boolean>(getZenModeEnabled);

  // Active game view
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<string, string>>({
    'dual-n-back': '2-back',
    'stroop-clash': 'standard',
    'chimp-memory': 'medium',
    'trail-making': 'part-b',
    'speed-calc': 'intermediate',
    'pattern-matrix': 'single-rule',
    'flanker-task': 'standard',
    'word-fluency': '6-letter',
    'corsi-block': 'forward',
    'go-no-go': 'standard',
    'mental-rotation': 'standard',
    'card-sorting': 'standard',
  });

  // Current page view
  const [currentView, setCurrentView] = useState<'catalog' | 'pathways' | 'regimen' | 'progress' | 'insights'>('catalog');

  // Modals
  const [embedModalGame, setEmbedModalGame] = useState<GameDefinition | null>(null);
  const [isDailyRegimenOpen, setIsDailyRegimenOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);
  const [isBaselineModalOpen, setIsBaselineModalOpen] = useState<boolean>(false);
  const [isGameGuideModalOpen, setIsGameGuideModalOpen] = useState<boolean>(false);
  const [gameGuideSelectedId, setGameGuideSelectedId] = useState<string>('dual-n-back');
  const [isWarmupModalOpen, setIsWarmupModalOpen] = useState<boolean>(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState<boolean>(false);
  const [leaderboardPostScore, setLeaderboardPostScore] = useState<number | null>(null);
  const [leaderboardPostLabel, setLeaderboardPostLabel] = useState<string | null>(null);

  // Notification states
  const [latestUnlockedAchievement, setLatestUnlockedAchievement] = useState<Achievement | null>(null);
  const [workoutCreditNotification, setWorkoutCreditNotification] = useState<string | null>(null);

  // Domain filter tabs
  const [domainFilter, setDomainFilter] = useState<string>('all');

  // Check URL parameters for iframe embedding support: ?embed=true&game=dual-n-back
  const [isIframeEmbedded, setIsIframeEmbedded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const embedParam = params.get('embed');
      const gameParam = params.get('game');

      if (embedParam === 'true') {
        setIsIframeEmbedded(true);
        const gameDef = GAMES_CATALOG.find(g => g.id === gameParam);
        if (gameDef) {
          setActiveGameId(gameDef.id);
          // Pet World picks the level (?difficulty=...); an unknown level keeps the default
          const levelParam = params.get('difficulty');
          if (levelParam && gameDef.difficultyLevels.some(level => level.id === levelParam)) {
            setSelectedDifficulty(prev => ({ ...prev, [gameDef.id]: levelParam }));
          }
        }
      }
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleToggleZenMode = () => {
    const next = !isZenMode;
    setIsZenMode(next);
    setZenModeEnabled(next);
  };

  const handleStartGame = (gameId: string) => {
    playTap();
    setActiveGameId(gameId);
    if (isZenMode) {
      startZenMusic();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    playTap();
    setActiveGameId(null);
  };

  const handleOpenGameGuide = (gameId: string) => {
    playTap();
    setGameGuideSelectedId(gameId);
    setIsGameGuideModalOpen(true);
  };

  const handleGameEnd = (result: GameResult) => {
    const gameDef = GAMES_CATALOG.find(g => g.id === result.gameId);
    if (!gameDef) return;

    // Inside Pet World (a brain stretch, ?stretch=<id>), the result goes to the student's save instead
    if (isIframeEmbedded) {
      const stretch = new URLSearchParams(window.location.search).get('stretch');
      if (stretch && window.parent !== window) {
        window.parent.postMessage({ type: 'brain:result', stretch, result }, window.location.origin);
      }
      return;
    }

    const { updatedStats, newlyUnlocked } = saveGameResult(result, gameDef.targetDomain);
    setStats(updatedStats);

    // Provide verified daily workout credit message (suppressed during Zen Mode to prevent popup distraction)
    if (!isZenMode) {
      const completedWorkoutCount = (updatedStats.dailyWorkoutCompletedGameIds || []).length;
      if (completedWorkoutCount >= 3) {
        setWorkoutCreditNotification('🎉 Daily 3-Circuit Workout Fully Completed & Credited!');
      } else {
        setWorkoutCreditNotification(`✓ Daily Workout Step Credited: ${completedWorkoutCount} of 3 finished!`);
      }

      setTimeout(() => {
        setWorkoutCreditNotification(null);
      }, 4500);

      if (newlyUnlocked.length > 0) {
        playStreak();
        setLatestUnlockedAchievement(newlyUnlocked[0]);
      }
    }
  };

  const handleBaselineCompleted = (res: BaselineResult) => {
    const current = loadUserStats();
    setStats(current);
  };

  const activeGame = useMemo(() => {
    return GAMES_CATALOG.find(g => g.id === activeGameId) || null;
  }, [activeGameId]);

  const filteredGames = useMemo(() => {
    if (domainFilter === 'all') return GAMES_CATALOG;
    return GAMES_CATALOG.filter(g => g.targetDomain === domainFilter);
  }, [domainFilter]);

  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = stats.dailyCompletedDates.includes(todayStr);
  const workoutCompletedGames = stats.dailyWorkoutCompletedGameIds || [];
  const workoutCount = workoutCompletedGames.length;

  const dynamicWorkout = useMemo(() => generateDynamicDailyWorkout(stats), [stats]);

  // If running inside an iframe in embed mode (?embed=true), render purely the active game
  if (isIframeEmbedded && activeGame) {
    const diff = selectedDifficulty[activeGame.id] || activeGame.difficultyLevels[0].id;
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-2">
        {renderGameComponent(activeGame.id, diff, handleGameEnd, true)}
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-500 ${isZenMode ? 'bg-[#080b11]' : 'bg-[#0c0f17]'}`}>
      {/* Top Bar Header or Zen Mode HUD */}
      {isZenMode && activeGame ? (
        <ZenModeHUD
          gameTitle={activeGame.title}
          brainRegionName={activeGame.primaryBrainRegion.name}
          anatomicalCode={activeGame.primaryBrainRegion.anatomicalCode}
          onExitGame={handleBackToCatalog}
          onToggleZenMode={handleToggleZenMode}
          isZenActive={isZenMode}
        />
      ) : (
        <Header
          currentView={currentView}
          onNavigate={(view) => {
            setActiveGameId(null);
            setCurrentView(view);
          }}
          onOpenBaselineModal={() => setIsBaselineModalOpen(true)}
          onOpenGameGuideModal={() => setIsGameGuideModalOpen(true)}
          onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
          onOpenEmbedModal={() => setEmbedModalGame(GAMES_CATALOG[0])}
          onOpenWarmupModal={() => setIsWarmupModalOpen(true)}
          onOpenLeaderboardModal={() => {
            setLeaderboardPostScore(null);
            setLeaderboardPostLabel(null);
            setIsLeaderboardModalOpen(true);
          }}
          onStartDailyWorkout={() => setIsDailyRegimenOpen(true)}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          dailyWorkoutCompletedCount={workoutCount}
          isZenMode={isZenMode}
          onToggleZenMode={handleToggleZenMode}
        />
      )}

      <main className={`flex-1 w-full mx-auto px-4 md:px-8 py-6 transition-all duration-300 ${isZenMode && activeGame ? 'max-w-4xl' : 'max-w-7xl'}`}>
        {/* If an active game is selected, show the game view */}
        {activeGame ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Game Navigation & Difficulty Header (Streamlined in Zen Mode) */}
            {isZenMode ? (
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Difficulty:
                  </span>
                  <div className="flex items-center p-0.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                    {activeGame.difficultyLevels.map((lvl) => {
                      const currentDiff = selectedDifficulty[activeGame.id] || activeGame.difficultyLevels[0].id;
                      const isSelected = currentDiff === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => {
                            playTap();
                            setSelectedDifficulty(prev => ({
                              ...prev,
                              [activeGame.id]: lvl.id,
                            }));
                          }}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-indigo-400/80 hidden sm:inline">
                  Deep Flow State Active
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToCatalog}
                    className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Exit to Suite</span>
                  </button>
                  <div>
                    <h1 className="text-base md:text-lg font-bold text-white">{activeGame.title}</h1>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeGame.primaryBrainRegion.name} · {activeGame.primaryBrainRegion.anatomicalCode}
                    </span>
                  </div>
                </div>

                {/* Difficulty Selector & Actions */}
                <div className="flex items-center gap-2">
                  {/* Zen Mode Button */}
                  <button
                    onClick={handleToggleZenMode}
                    className="px-2.5 py-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/20"
                    title="Enable Zen Mode: Hide non-essential UI and play peaceful ambient music"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Zen Mode</span>
                  </button>

                  <button
                    onClick={() => handleOpenGameGuide(activeGame.id)}
                    className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>How it Works</span>
                  </button>

                  <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
                    {activeGame.difficultyLevels.map((lvl) => {
                      const currentDiff = selectedDifficulty[activeGame.id] || activeGame.difficultyLevels[0].id;
                      const isSelected = currentDiff === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => {
                            playTap();
                            setSelectedDifficulty(prev => ({
                              ...prev,
                              [activeGame.id]: lvl.id,
                            }));
                          }}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setEmbedModalGame(activeGame)}
                    className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Get Embed Code for this game"
                  >
                    <Code2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Active Game Arena */}
            <div className="py-2">
              {renderGameComponent(
                activeGame.id,
                selectedDifficulty[activeGame.id] || activeGame.difficultyLevels[0].id,
                handleGameEnd,
                false
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* View Switching */}
            {currentView === 'pathways' ? (
              <div className="space-y-6">
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to All Games
                </button>
                <NeuralPathwayMap
                  stats={stats}
                  onSelectGameForDomain={(domain) => {
                    const targetGame = GAMES_CATALOG.find(g => g.targetDomain === domain);
                    if (targetGame) handleStartGame(targetGame.id);
                  }}
                />
              </div>
            ) : currentView === 'progress' ? (
              <ProgressOverTimeView
                stats={stats}
                onBackToCatalog={() => setCurrentView('catalog')}
                onNavigateToInsights={() => setCurrentView('insights')}
                onOpenLeaderboard={() => {
                  setLeaderboardPostScore(null);
                  setLeaderboardPostLabel(null);
                  setIsLeaderboardModalOpen(true);
                }}
              />
            ) : currentView === 'insights' ? (
              <CognitiveInsightsView
                stats={stats}
                onBackToCatalog={() => setCurrentView('catalog')}
                onSelectGame={(gameId) => handleStartGame(gameId)}
              />
            ) : currentView === 'regimen' ? (
              <div className="space-y-6">
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to All Games
                </button>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 max-w-2xl mx-auto text-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Daily Neuro-Maintenance Circuit</h2>
                  <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                    Designed to maintain synaptic plasticity, dendrite spine density, and rapid neurotransmitter transmission. Complete the 3-step circuit in under 7 minutes.
                  </p>
                  <button
                    onClick={() => setIsDailyRegimenOpen(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    Open Daily Circuit ({workoutCount}/3 Completed)
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Zen Mode Banner (When active in catalog) */}
                {isZenMode && (
                  <div className="p-4 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                            Zen Mode Active
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-500/20 font-mono">
                            Peaceful Soundscape On
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Sidebars, notifications, and visual clutter are silenced during gameplay so you can focus strictly on cognitive performance.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleZenMode}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                    >
                      Turn Off Zen
                    </button>
                  </div>
                )}

                {/* Hero Section */}
                <section className="text-center pt-2 pb-2 max-w-3xl mx-auto space-y-4">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                    <span>12 Targeted Neural Pathways</span>
                    <span aria-hidden="true">·</span>
                    <span>Standardized Baseline Diagnostic</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-400">Embeddable React / Iframe</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white" style={{ textWrap: 'balance' }}>
                    Maintain Healthy Neural Pathways
                  </h1>

                  <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    A suite of cognitive paradigms targeting working memory, executive inhibition, spatial mapping, and fluid inductive reasoning. Ready to play standalone or embed inside any application.
                  </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIsWarmupModalOpen(true)}
                        className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs md:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-amber-500/10"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Warm-up (2 min)</span>
                      </button>
                      <button
                        onClick={() => setIsBaselineModalOpen(true)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Compass className="w-4 h-4" />
                        <span>{stats.baselineResult ? 'Retake Baseline Test' : 'Take Baseline Test'}</span>
                      </button>
                      <button
                        onClick={() => setCurrentView('insights')}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-xs md:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Brain className="w-4 h-4 text-indigo-400" />
                        <span>Regional Insights</span>
                      </button>
                      <button
                        onClick={() => setIsGameGuideModalOpen(true)}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs md:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Game Explanations</span>
                      </button>
                    </div>
                </section>

                {/* Prescribed Pathway Banner (if baseline test has been taken) */}
                {stats.baselineResult && (
                  <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                            Your Prescribed Neural Path:
                          </span>
                          <span className="text-sm font-bold text-white">
                            {stats.baselineResult.prescribedPath.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {stats.baselineResult.prescribedPath.description} (Baseline Score: <strong className="text-white font-mono">{stats.baselineResult.overallScore}%</strong>)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartGame(stats.baselineResult!.prescribedPath.recommendedGameIds[0])}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play Prescribed Track</span>
                      </button>
                      <button
                        onClick={() => setIsBaselineModalOpen(true)}
                        className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs rounded-xl border border-slate-800 transition-colors cursor-pointer"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                )}

                {/* Consecutive Streak Check-in Reward Strip */}
                <ConsecutiveStreakReward
                  stats={stats}
                  onBonusClaimed={() => {
                    const current = loadUserStats();
                    setStats(current);
                  }}
                />

                {/* Achievements Showcase directly on the main catalog screen */}
                <AchievementsShowcase
                  stats={stats}
                  onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
                />

                {/* Recommended Games Based on Progress */}
                <RecommendedGamesSection
                  stats={stats}
                  onSelectGame={(gameId) => handleStartGame(gameId)}
                />

                {/* Filter Bar (Interactive segmented control) */}
                <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
                    <button
                      onClick={() => setDomainFilter('all')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'all'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All 12 Paradigms
                    </button>
                    <button
                      onClick={() => setDomainFilter('working_memory')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'working_memory'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Working Memory
                    </button>
                    <button
                      onClick={() => setDomainFilter('inhibitory_control')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'inhibitory_control'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Inhibition
                    </button>
                    <button
                      onClick={() => setDomainFilter('visuospatial')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'visuospatial'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Spatial Span
                    </button>
                    <button
                      onClick={() => setDomainFilter('cognitive_flexibility')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'cognitive_flexibility'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Task Switching
                    </button>
                    <button
                      onClick={() => setDomainFilter('spatial_rotation')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'spatial_rotation'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      3D Rotation
                    </button>
                    <button
                      onClick={() => setDomainFilter('sustained_vigilance')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        domainFilter === 'sustained_vigilance'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Vigilance
                    </button>
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} ready
                  </span>
                </div>

                {/* 12 Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game, idx) => {
                    const gameStats = stats.scoresByGame[game.id];
                    const isCreditedToday = workoutCompletedGames.includes(game.id);

                    return (
                      <div
                        key={game.id}
                        className={`bg-slate-900/70 border rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 group ${
                          isCreditedToday ? 'border-emerald-500/40 bg-slate-900/90' : 'border-slate-800'
                        }`}
                      >
                        <div>
                          {/* Unboxed Metadata Header with Credit Indicator */}
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                            <span className="font-mono text-slate-500">{String(idx + 1).padStart(2, '0')}</span>
                            <div className="flex items-center gap-1.5">
                              {isCreditedToday && (
                                <span className="text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Credited Today</span>
                                  <span aria-hidden="true" className="text-slate-600 ml-1">·</span>
                                </span>
                              )}
                              <span className="text-indigo-400">{game.primaryBrainRegion.anatomicalCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>{game.domainLabel}</span>
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                            {game.title}
                          </h3>
                          <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                            {game.subtitle}
                          </p>

                          {/* Neural Pathway Clinical Target */}
                          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-5 text-xs">
                            <span className="text-slate-400 block font-medium mb-1">Target Brain Region:</span>
                            <span className="text-slate-200 font-semibold block">{game.primaryBrainRegion.name}</span>
                            <span className="text-[11px] text-slate-500 mt-1 block line-clamp-2">{game.clinicalBasis}</span>
                          </div>
                        </div>

                        <div>
                          {/* User Stats / High Score Strip */}
                          <div className="flex items-center justify-between py-2 px-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs font-mono text-slate-400 mb-4">
                            <span>High Score: <strong className="text-white tabular-nums">{gameStats?.highScore || 0}</strong></span>
                            <span>Best Acc: <strong className="text-emerald-400 tabular-nums">{gameStats?.bestAccuracy ? `${gameStats.bestAccuracy}%` : '—'}</strong></span>
                          </div>

                          {/* Action Buttons: Play + How it Works + Embed */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartGame(game.id)}
                              className={`flex-1 py-2.5 px-4 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                                isCreditedToday
                                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>{isCreditedToday ? 'Play Again' : 'Play Game'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenGameGuide(game.id)}
                              className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                              title="Read plain English explanation of this game"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              <span className="hidden sm:inline">Guide</span>
                            </button>

                            <button
                              onClick={() => setEmbedModalGame(game)}
                              className="py-2.5 px-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium rounded-xl transition-colors flex items-center cursor-pointer"
                              title="Embed this game in another app"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Neural Pathway Summary Section */}
                <section className="pt-8 border-t border-slate-800">
                  <NeuralPathwayMap
                    stats={stats}
                    onSelectGameForDomain={(domain) => {
                      const targetGame = GAMES_CATALOG.find(g => g.targetDomain === domain);
                      if (targetGame) handleStartGame(targetGame.id);
                    }}
                  />
                </section>
              </>
            )}
          </div>
        )}
      </main>

      {/* Embed Export Code Modal */}
      <EmbedExportModal
        game={embedModalGame}
        isOpen={embedModalGame !== null}
        onClose={() => setEmbedModalGame(null)}
      />

      {/* Daily Regimen Circuit Modal with verified credit & dynamic adaptation */}
      <DailyRegimenModal
        isOpen={isDailyRegimenOpen}
        onClose={() => setIsDailyRegimenOpen(false)}
        onStartCircuitGame={(gameId, diff) => {
          if (diff) {
            setSelectedDifficulty(prev => ({ ...prev, [gameId]: diff }));
          }
          handleStartGame(gameId);
        }}
        dailyCompleted={isDailyCompletedToday}
        completedGameIds={workoutCompletedGames}
        workout={dynamicWorkout}
      />

      {/* Achievements Gallery Modal */}
      <AchievementsModal
        stats={stats}
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
      />

      {/* Baseline Test Diagnostic Modal */}
      <BaselineTestModal
        isOpen={isBaselineModalOpen}
        onClose={() => setIsBaselineModalOpen(false)}
        onBaselineComplete={handleBaselineCompleted}
        onLaunchGame={(gameId) => handleStartGame(gameId)}
      />

      {/* Comprehensive Game Guide Modal */}
      <GameGuideModal
        initialGameId={gameGuideSelectedId}
        isOpen={isGameGuideModalOpen}
        onClose={() => setIsGameGuideModalOpen(false)}
        onLaunchGame={(gameId) => handleStartGame(gameId)}
      />

      {/* Achievement Unlocked Toast (Silenced during Zen Mode) */}
      {!isZenMode && (
        <AchievementUnlockToast
          achievement={latestUnlockedAchievement}
          onClose={() => setLatestUnlockedAchievement(null)}
        />
      )}

      {/* Daily Workout Credit Toast (Silenced during Zen Mode) */}
      {!isZenMode && workoutCreditNotification && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-white block">
                Daily Workout Credit
              </span>
              <span className="text-xs text-emerald-300 block">
                {workoutCreditNotification}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer (Hidden during active gameplay in Zen Mode for distraction-free arena) */}
      {(!isZenMode || !activeGame) && (
        <footer className="mt-auto border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>NeuroSuite · Cognitive Pathway Preservation Toolkit</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsBaselineModalOpen(true)}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Baseline Diagnostic
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setIsGameGuideModalOpen(true)}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Game Guide
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setEmbedModalGame(GAMES_CATALOG[0])}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Developer Embed API
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Game Dispatcher Helper
function renderGameComponent(
  gameId: string,
  difficulty: string,
  onGameEnd: (result: GameResult) => void,
  isEmbedded: boolean
) {
  switch (gameId) {
    case 'dual-n-back':
      return <DualNBackGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'stroop-clash':
      return <StroopClashGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'chimp-memory':
      return <ChimpMemoryGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'trail-making':
      return <TrailMakingGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'speed-calc':
      return <SpeedCalcGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'pattern-matrix':
      return <PatternMatrixGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'flanker-task':
      return <FlankerTaskGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'word-fluency':
      return <WordFluencyGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'corsi-block':
      return <CorsiBlockGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'go-no-go':
      return <GoNoGoGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'mental-rotation':
      return <MentalRotationGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    case 'card-sorting':
      return <CardSortingGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
    default:
      return <DualNBackGame difficulty={difficulty} onGameEnd={onGameEnd} isEmbedded={isEmbedded} />;
  }
}
