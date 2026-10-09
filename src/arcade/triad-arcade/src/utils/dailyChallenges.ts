import { DailyChallenge, DailyChallengeState } from '../types';

const DAILY_STORAGE_KEY = 'triad_daily_challenges_v1';

export function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateDailyChallenges(dateKey: string): DailyChallenge[] {
  // Stable pseudorandom seed based on date string
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) {
    seed = (seed << 5) - seed + dateKey.charCodeAt(i);
    seed |= 0;
  }
  const seededRand = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const bingoPatterns = ['POSTAGE_STAMP', 'LETTER_X', 'FOUR_CORNERS', 'PLUS_SIGN'];
  const chosenPattern = bingoPatterns[Math.floor(seededRand(1) * bingoPatterns.length)];
  const patternNames: Record<string, string> = {
    POSTAGE_STAMP: 'Postage Stamp',
    LETTER_X: 'Letter X',
    FOUR_CORNERS: 'Four Corners',
    PLUS_SIGN: 'Plus Sign (+)',
  };

  return [
    {
      id: `daily-bingo-${dateKey}`,
      title: 'Bingo Duel Champion',
      description: `Defeat BingoBot in a ${patternNames[chosenPattern]} or Random match`,
      mode: 'BINGO_DUEL',
      targetValue: 1,
      currentValue: 0,
      isCompleted: false,
      rewardPoints: 1200,
      badgeIcon: '🎯',
    },
    {
      id: `daily-war-${dateKey}`,
      title: 'Frontline War Hero',
      description: 'Fight and win at least 1 tied War battle in Casino War',
      mode: 'CASINO_WAR',
      targetValue: 1,
      currentValue: 0,
      isCompleted: false,
      rewardPoints: 1000,
      badgeIcon: '⚔️',
    },
    {
      id: `daily-memory-${dateKey}`,
      title: 'Mind of Steel',
      description: 'Clear a Challenge (24) or Grand (36) memory board with ≥75% accuracy',
      mode: 'MEMORY_MATRIX',
      targetValue: 1,
      currentValue: 0,
      isCompleted: false,
      rewardPoints: 1500,
      badgeIcon: '🧠',
    },
  ];
}

export function getDailyChallengeState(): DailyChallengeState {
  const today = getTodayDateKey();
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (raw) {
      const parsed: DailyChallengeState = JSON.parse(raw);
      if (parsed.dateKey === today) {
        return parsed;
      }
    }
  } catch {
    // Fallback to fresh
  }

  const newState: DailyChallengeState = {
    dateKey: today,
    challenges: generateDailyChallenges(today),
    allCompleted: false,
    bonusClaimed: false,
  };
  saveDailyChallengeState(newState);
  return newState;
}

export function saveDailyChallengeState(state: DailyChallengeState) {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full safe
  }
}

export function updateDailyChallengeProgress(
  mode: 'BINGO_WAR' | 'BATTLESHIP' | 'BINGO_DUEL' | 'CASINO_WAR' | 'MEMORY_MATRIX',
  payload: {
    won?: boolean;
    pattern?: string;
    calls?: number;
    warsWon?: number;
    streak?: number;
    difficulty?: string;
    accuracy?: number;
    turns?: number;
  }
): { state: DailyChallengeState; newlyCompleted: DailyChallenge | null; bonusAwarded: boolean } {
  const state = getDailyChallengeState();
  let newlyCompleted: DailyChallenge | null = null;
  let bonusAwarded = false;

  state.challenges = state.challenges.map((challenge) => {
    if (challenge.isCompleted) return challenge;

    let satisfied = false;
    if (challenge.mode === mode) {
      if (mode === 'BATTLESHIP') {
        if (payload.won) satisfied = true;
      } else if (mode === 'BINGO_WAR' || mode === 'BINGO_DUEL') {
        if (payload.won) satisfied = true;
      } else if (mode === 'CASINO_WAR') {
        if ((payload.warsWon ?? 0) >= 1) satisfied = true;
      } else if (mode === 'MEMORY_MATRIX') {
        const isLarge = payload.difficulty === 'CHALLENGE' || payload.difficulty === 'GRAND' || payload.difficulty === 'COLOSSAL';
        if (isLarge && (payload.accuracy ?? 0) >= 75) satisfied = true;
      }
    } else if (mode === 'BINGO_WAR' && challenge.mode === 'CASINO_WAR' && (payload.warsWon ?? 0) >= 1) {
      // Wars won in Bingo War also fulfill war battle challenge!
      satisfied = true;
    }

    if (satisfied) {
      challenge.currentValue = challenge.targetValue;
      challenge.isCompleted = true;
      newlyCompleted = challenge;
    }
    return challenge;
  });

  const allDone = state.challenges.every((c) => c.isCompleted);
  if (allDone && !state.allCompleted) {
    state.allCompleted = true;
    bonusAwarded = true;
  }

  saveDailyChallengeState(state);
  return { state, newlyCompleted, bonusAwarded };
}
