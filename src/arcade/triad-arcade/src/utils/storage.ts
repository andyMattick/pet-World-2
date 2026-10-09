import { LeaderboardEntry, PlayerProfile } from '../types';

const STORAGE_LEADERBOARD_KEY = 'triad_arcade_leaderboard_v1';
const STORAGE_PROFILE_KEY = 'triad_arcade_player_profile_v1';

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'entry-seed-1',
    playerName: 'VegasViper',
    avatar: '🦊',
    mode: 'BINGO_DUEL',
    score: 8450,
    metricLabel: 'Winner',
    metricValue: 'Victory (28 Calls)',
    secondaryLabel: 'Pattern',
    secondaryValue: 'Letter X vs BingoBot',
    date: 'Oct 06, 2026',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'entry-seed-2',
    playerName: 'CardShark_Ray',
    avatar: '🦈',
    mode: 'CASINO_WAR',
    score: 6250,
    metricLabel: 'Peak Bankroll',
    metricValue: '$6,250',
    secondaryLabel: 'Streak',
    secondaryValue: '9 Wins · 4 Wars Won',
    date: 'Oct 05, 2026',
    timestamp: Date.now() - 172800000,
  },
  {
    id: 'entry-seed-3',
    playerName: 'MemoryMaestro',
    avatar: '🦉',
    mode: 'MEMORY_MATRIX',
    score: 5120,
    metricLabel: 'Time',
    metricValue: '28.4s',
    secondaryLabel: 'Accuracy',
    secondaryValue: '96% (Colossal 48)',
    date: 'Oct 07, 2026',
    timestamp: Date.now() - 10800000,
  },
  {
    id: 'entry-seed-4',
    playerName: 'LuckyLady88',
    avatar: '🍀',
    mode: 'BINGO_DUEL',
    score: 7200,
    metricLabel: 'Winner',
    metricValue: 'Victory (22 Calls)',
    secondaryLabel: 'Pattern',
    secondaryValue: 'Four Corners vs BingoBot',
    date: 'Oct 04, 2026',
    timestamp: Date.now() - 259200000,
  },
  {
    id: 'entry-seed-5',
    playerName: 'HighRollerJack',
    avatar: '👑',
    mode: 'CASINO_WAR',
    score: 4800,
    metricLabel: 'Peak Bankroll',
    metricValue: '$4,800',
    secondaryLabel: 'Streak',
    secondaryValue: '7 Wins · 3 Wars Won',
    date: 'Oct 03, 2026',
    timestamp: Date.now() - 345600000,
  },
  {
    id: 'entry-seed-6',
    playerName: 'SynapseAce',
    avatar: '⚡',
    mode: 'MEMORY_MATRIX',
    score: 4750,
    metricLabel: 'Time',
    metricValue: '34.1s',
    secondaryLabel: 'Accuracy',
    secondaryValue: '91% (Grand 36)',
    date: 'Oct 02, 2026',
    timestamp: Date.now() - 432000000,
  },
  {
    id: 'entry-seed-7',
    playerName: 'BingoBaron',
    avatar: '🎩',
    mode: 'BINGO_DUEL',
    score: 6100,
    metricLabel: 'Winner',
    metricValue: 'Victory (31 Calls)',
    secondaryLabel: 'Pattern',
    secondaryValue: 'Standard Line vs BingoBot',
    date: 'Oct 01, 2026',
    timestamp: Date.now() - 518400000,
  },
  {
    id: 'entry-seed-8',
    playerName: 'AdmiralNimitz',
    avatar: '⚓',
    mode: 'BATTLESHIP',
    score: 8250,
    metricLabel: 'Outcome',
    metricValue: 'Naval Victory',
    secondaryLabel: 'Rounds & Accuracy',
    secondaryValue: '18 Rounds · 67% Acc · Lost 1 Ship',
    date: 'Oct 07, 2026',
    timestamp: Date.now() - 7200000,
  }
];

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'LuckyChallenger',
  avatar: '🎲',
  totalScore: 0,
  gamesPlayed: 0,
  bingoDuelWins: 0,
  battleshipWins: 0,
  warMaxBankroll: 1000,
  matrixFastestTime: 0,
  soundEnabled: true,
};

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp' | 'date'>): LeaderboardEntry {
  const current = getLeaderboard();
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: dateStr,
    timestamp: Date.now(),
    isUser: true,
  };

  const updated = [newEntry, ...current].sort((a, b) => b.score - a.score);
  // Keep top 50 records
  const trimmed = updated.slice(0, 50);

  try {
    localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch {
    // Localstorage full or unavailable
  }

  // Update profile lifetime stats
  updateProfileStats(entry.mode, entry.score);

  // Pet Town Arcade: when this runs inside the Arcade frame (?arcadeRun=...), report each finished game
  const arcadeRunId = new URLSearchParams(window.location.search).get('arcadeRun');
  if (arcadeRunId && window.parent !== window) {
    window.parent.postMessage({ type: 'arcade:round-complete', gameId: 'triad-arcade', runId: arcadeRunId, roundId: newEntry.id, score: Math.max(0, Math.floor(entry.score) || 0) }, window.location.origin);
  }

  return newEntry;
}

export function getPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: Partial<PlayerProfile>): PlayerProfile {
  const current = getPlayerProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
  } catch {
    // Safe
  }
  return updated;
}

function updateProfileStats(mode: LeaderboardEntry['mode'], score: number) {
  const profile = getPlayerProfile();
  profile.gamesPlayed += 1;
  profile.totalScore += score;

  if (mode === 'BINGO_DUEL' || mode === 'MEMORY_BINGO') {
    profile.bingoDuelWins = (profile.bingoDuelWins || 0) + 1;
  } else if (mode === 'CASINO_WAR' && score > profile.warMaxBankroll) {
    profile.warMaxBankroll = score;
  }

  savePlayerProfile(profile);
}

export function resetLeaderboardToDefaults(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(INITIAL_LEADERBOARD));
  } catch {
    // Safe
  }
  return INITIAL_LEADERBOARD;
}
