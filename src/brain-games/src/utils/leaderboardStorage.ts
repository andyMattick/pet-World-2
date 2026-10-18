export interface LeaderboardEntry {
  id: string;
  username: string;
  avatarSeed: string; // color or icon identifier
  category: 'rolling_7day' | 'streak' | 'single_game' | 'workout_master';
  gameTitle?: string;
  score: number; // either points/day, streak count, or raw score
  accuracy?: number;
  reactionTimeMs?: number;
  date: string;
  badge?: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_STORAGE_KEY = 'neuro_suite_leaderboard';
const USERNAME_STORAGE_KEY = 'neuro_suite_player_name';

const INITIAL_PEER_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'peer-1',
    username: 'DrSynapse',
    avatarSeed: 'indigo',
    category: 'rolling_7day',
    score: 142,
    accuracy: 94,
    reactionTimeMs: 460,
    date: '2026-10-17',
    badge: 'Frontal Master',
  },
  {
    id: 'peer-2',
    username: 'NeuroNaut_42',
    avatarSeed: 'cyan',
    category: 'rolling_7day',
    score: 128,
    accuracy: 91,
    reactionTimeMs: 510,
    date: '2026-10-18',
    badge: 'Parietal Pacer',
  },
  {
    id: 'peer-3',
    username: 'CerebralSpark',
    avatarSeed: 'amber',
    category: 'rolling_7day',
    score: 115,
    accuracy: 89,
    reactionTimeMs: 490,
    date: '2026-10-16',
    badge: 'Dual N-Back Ace',
  },
  {
    id: 'peer-4',
    username: 'AlphaRhythm',
    avatarSeed: 'emerald',
    category: 'rolling_7day',
    score: 98,
    accuracy: 87,
    reactionTimeMs: 540,
    date: '2026-10-18',
    badge: 'Vigilance Pro',
  },
  {
    id: 'peer-5',
    username: 'SynapticFlow',
    avatarSeed: 'pink',
    category: 'rolling_7day',
    score: 82,
    accuracy: 85,
    reactionTimeMs: 580,
    date: '2026-10-15',
    badge: 'Daily Streak',
  },
  // Streak Masters
  {
    id: 'peer-streak-1',
    username: 'CerebralSpark',
    avatarSeed: 'amber',
    category: 'streak',
    score: 21,
    date: '2026-10-18',
    badge: '21-Day Titan',
  },
  {
    id: 'peer-streak-2',
    username: 'DrSynapse',
    avatarSeed: 'indigo',
    category: 'streak',
    score: 14,
    date: '2026-10-17',
    badge: '2-Week Plasticity',
  },
  {
    id: 'peer-streak-3',
    username: 'MemoryMatrix',
    avatarSeed: 'purple',
    category: 'streak',
    score: 9,
    date: '2026-10-18',
    badge: 'Consistent Synapse',
  },
  // Game champions
  {
    id: 'peer-game-1',
    username: 'AyumuApprentice',
    avatarSeed: 'emerald',
    category: 'single_game',
    gameTitle: 'Chimp Spatial Span',
    score: 850,
    accuracy: 100,
    date: '2026-10-17',
    badge: 'Photographic Recall',
  },
  {
    id: 'peer-game-2',
    username: 'DrSynapse',
    avatarSeed: 'indigo',
    category: 'single_game',
    gameTitle: 'Dual N-Back',
    score: 720,
    accuracy: 96,
    date: '2026-10-18',
    badge: 'Fluid Gf Elite',
  },
  {
    id: 'peer-game-3',
    username: 'SpeedDemon',
    avatarSeed: 'rose',
    category: 'single_game',
    gameTitle: 'Signal & Flanker',
    score: 680,
    accuracy: 98,
    reactionTimeMs: 320,
    date: '2026-10-18',
    badge: 'Ultra Fast Reflex',
  },
];

export const getSavedUsername = (): string => {
  if (typeof window === 'undefined') return 'NeuroNovice';
  return localStorage.getItem(USERNAME_STORAGE_KEY) || 'NeuroNovice';
};

export const setSavedUsername = (name: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERNAME_STORAGE_KEY, name.trim() || 'NeuroNovice');
};

export const loadLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return INITIAL_PEER_ENTRIES;
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(INITIAL_PEER_ENTRIES));
      return INITIAL_PEER_ENTRIES;
    }
    const parsed: LeaderboardEntry[] = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to load leaderboard', e);
    return INITIAL_PEER_ENTRIES;
  }
};

export const postToLeaderboard = (
  entry: Omit<LeaderboardEntry, 'id' | 'date' | 'isCurrentUser'>
): { updatedLeaderboard: LeaderboardEntry[]; newRank: number } => {
  const current = loadLeaderboard();
  const todayStr = new Date().toISOString().split('T')[0];

  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `user-post-${Date.now()}`,
    date: todayStr,
    isCurrentUser: true,
  };

  // Replace existing entry by same username in this category if new score is higher, or append
  const filtered = current.filter(
    item => !(item.isCurrentUser && item.category === entry.category && (entry.gameTitle ? item.gameTitle === entry.gameTitle : true))
  );

  const updated = [...filtered, newEntry];

  // Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save leaderboard', e);
    }
  }

  // Calculate rank in this category
  const categoryEntries = updated
    .filter(e => e.category === entry.category && (entry.gameTitle ? e.gameTitle === entry.gameTitle : true))
    .sort((a, b) => b.score - a.score);

  const newRank = categoryEntries.findIndex(e => e.id === newEntry.id) + 1;

  return {
    updatedLeaderboard: updated,
    newRank: newRank > 0 ? newRank : 1,
  };
};
