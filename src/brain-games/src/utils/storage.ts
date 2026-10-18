import { GameResult, UserStats, CognitiveDomain, SessionRecord, Achievement } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievementsCatalog';
import { GAMES_CATALOG } from '../data/gamesCatalog';

const STORAGE_KEY = 'neuro_suite_user_stats';

const defaultStats: UserStats = {
  totalSessions: 0,
  totalTimeSeconds: 0,
  scoresByGame: {},
  domainStimulation: {
    working_memory: 0,
    cognitive_flexibility: 0,
    inhibitory_control: 0,
    processing_speed: 0,
    visuospatial: 0,
    inductive_reasoning: 0,
    numerical_fluency: 0,
    verbal_fluency: 0,
    spatial_rotation: 0,
    sustained_vigilance: 0,
    rule_induction: 0,
    sequential_visuospatial: 0,
  },
  dailyCompletedDates: [],
  consecutiveDaysStreak: 0,
  consecutiveGamesToday: 0,
  lastCheckInDate: '',
  unlockedAchievementIds: [],
  achievementUnlockDates: {},
  sessionHistory: [],
  dailyStimulationHistory: {},
  baselineResult: null,
  dailyWorkoutCompletedGameIds: [],
};

export const loadUserStats = (): UserStats => {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    const todayStr = new Date().toISOString().split('T')[0];
    const isSameDay = parsed.lastCheckInDate === todayStr;

    return {
      ...defaultStats,
      ...parsed,
      domainStimulation: {
        ...defaultStats.domainStimulation,
        ...(parsed.domainStimulation || {}),
      },
      scoresByGame: {
        ...(parsed.scoresByGame || {}),
      },
      dailyCompletedDates: parsed.dailyCompletedDates || [],
      unlockedAchievementIds: parsed.unlockedAchievementIds || [],
      achievementUnlockDates: parsed.achievementUnlockDates || {},
      sessionHistory: parsed.sessionHistory || [],
      dailyStimulationHistory: parsed.dailyStimulationHistory || {},
      baselineResult: parsed.baselineResult || null,
      dailyWorkoutCompletedGameIds: isSameDay ? (parsed.dailyWorkoutCompletedGameIds || []) : [],
    };
  } catch (err) {
    console.error('Failed to load user stats from localStorage', err);
    return defaultStats;
  }
};

export const saveBaselineResult = (baseline: import('../types/game').BaselineResult): UserStats => {
  const current = loadUserStats();
  const updated: UserStats = {
    ...current,
    baselineResult: baseline,
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save baseline result', err);
    }
  }
  return updated;
};

export const saveGameResult = (
  result: GameResult,
  domain: CognitiveDomain
): { updatedStats: UserStats; newlyUnlocked: Achievement[] } => {
  const current = loadUserStats();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Consecutive Days & Consecutive Games Logic
  let newDaysStreak = current.consecutiveDaysStreak;
  let newGamesToday = current.consecutiveGamesToday;

  if (!current.lastCheckInDate) {
    newDaysStreak = 1;
    newGamesToday = 1;
  } else if (current.lastCheckInDate === todayStr) {
    // Already checked in today, increment games played today
    newGamesToday += 1;
  } else {
    // Check if lastCheckInDate was yesterday
    const lastDate = new Date(current.lastCheckInDate);
    const diffDays = Math.round((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      newDaysStreak += 1;
    } else {
      newDaysStreak = 1;
    }
    newGamesToday = 1;
  }

  const gameStats = current.scoresByGame[result.gameId] || {
    highScore: 0,
    bestAccuracy: 0,
    bestReactionTime: 99999,
    sessionsPlayed: 0,
    lastPlayed: '',
    peakStreak: 0,
  };

  const updatedGameStats = {
    highScore: Math.max(gameStats.highScore, result.score),
    bestAccuracy: Math.max(gameStats.bestAccuracy, result.accuracy),
    bestReactionTime: result.avgReactionTimeMs > 0
      ? Math.min(gameStats.bestReactionTime, result.avgReactionTimeMs)
      : gameStats.bestReactionTime,
    sessionsPlayed: gameStats.sessionsPlayed + 1,
    lastPlayed: result.completedAt,
    peakStreak: Math.max(gameStats.peakStreak || 0, result.peakStreak || 0),
  };

  // Add stimulation points (10 baseline + accuracy bonus)
  const stimulationPoints = Math.round(10 + (result.accuracy / 10));
  const newDomainStimulation = {
    ...current.domainStimulation,
    [domain]: (current.domainStimulation[domain] || 0) + stimulationPoints,
  };

  // Daily stimulation history
  const updatedDailyHistory = {
    ...current.dailyStimulationHistory,
    [todayStr]: (current.dailyStimulationHistory[todayStr] || 0) + stimulationPoints,
  };

  // Session history record
  const gameDef = GAMES_CATALOG.find(g => g.id === result.gameId);
  const newSessionRecord: SessionRecord = {
    id: `sess-${Date.now()}`,
    gameId: result.gameId,
    gameTitle: gameDef?.title || result.gameId,
    domain,
    score: result.score,
    accuracy: result.accuracy,
    reactionTimeMs: result.avgReactionTimeMs,
    timestamp: result.completedAt,
    durationSeconds: result.durationSeconds,
  };

  const updatedHistory = [newSessionRecord, ...current.sessionHistory].slice(0, 50);

  // Daily workout completed games credit
  const isSameDayWorkout = current.lastCheckInDate === todayStr;
  const currentWorkoutGames = isSameDayWorkout ? (current.dailyWorkoutCompletedGameIds || []) : [];
  const updatedWorkoutGames = currentWorkoutGames.includes(result.gameId)
    ? currentWorkoutGames
    : [...currentWorkoutGames, result.gameId];

  // If 3 or more distinct games completed today, credit full daily workout completion
  const isFullWorkoutComplete = updatedWorkoutGames.length >= 3;
  const dailyDates = (current.dailyCompletedDates.includes(todayStr) || isFullWorkoutComplete)
    ? (current.dailyCompletedDates.includes(todayStr) ? current.dailyCompletedDates : [...current.dailyCompletedDates, todayStr])
    : current.dailyCompletedDates;

  // Intermediate state for achievement checking
  const candidateStats: UserStats = {
    ...current,
    totalSessions: current.totalSessions + 1,
    totalTimeSeconds: current.totalTimeSeconds + result.durationSeconds,
    scoresByGame: {
      ...current.scoresByGame,
      [result.gameId]: updatedGameStats,
    },
    domainStimulation: newDomainStimulation,
    dailyCompletedDates: dailyDates,
    consecutiveDaysStreak: newDaysStreak,
    consecutiveGamesToday: newGamesToday,
    lastCheckInDate: todayStr,
    sessionHistory: updatedHistory,
    dailyStimulationHistory: updatedDailyHistory,
    dailyWorkoutCompletedGameIds: updatedWorkoutGames,
  };

  // Check achievements
  const newlyUnlocked: Achievement[] = [];
  const currentUnlockedIds = new Set(current.unlockedAchievementIds);
  const newUnlockDates = { ...current.achievementUnlockDates };

  ACHIEVEMENTS.forEach(achievement => {
    if (!currentUnlockedIds.has(achievement.id)) {
      const evaluation = achievement.check(candidateStats, result);
      if (evaluation.isUnlocked) {
        newlyUnlocked.push(achievement);
        currentUnlockedIds.add(achievement.id);
        newUnlockDates[achievement.id] = now.toISOString();
      }
    }
  });

  const finalStats: UserStats = {
    ...candidateStats,
    unlockedAchievementIds: Array.from(currentUnlockedIds),
    achievementUnlockDates: newUnlockDates,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalStats));
    } catch (err) {
      console.error('Failed to save user stats', err);
    }
  }

  return { updatedStats: finalStats, newlyUnlocked };
};
