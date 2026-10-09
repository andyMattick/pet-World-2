import { Achievement } from '../types';

const STORAGE_ACHIEVEMENTS_KEY = 'triad_arcade_achievements_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Win',
    description: 'Win your first game in any arcade mode.',
    category: 'GENERAL',
    icon: '🏆',
    points: 250,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'bingo_novice',
    title: 'Bingo Rookie',
    description: 'Defeat BingoBot 3000 in your first Bingo Duel.',
    category: 'BINGO',
    icon: '🎯',
    points: 300,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'speed_runner_bingo',
    title: 'Speed Dauber',
    description: 'Win a Bingo Duel in 30 balls called or fewer.',
    category: 'BINGO',
    icon: '⚡',
    points: 750,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'pattern_variety',
    title: 'Pattern Master',
    description: 'Win matches across 3 different Bingo patterns.',
    category: 'BINGO',
    icon: '🎨',
    points: 600,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'blackout_king',
    title: 'Coverall King',
    description: 'Achieve a full Blackout / Coverall Bingo victory.',
    category: 'BINGO',
    icon: '👑',
    points: 1200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'first_war_win',
    title: 'First Blood',
    description: 'Win a War duel against the croupier.',
    category: 'WAR',
    icon: '⚔️',
    points: 300,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'war_hero',
    title: 'War Veteran',
    description: 'Survive and win 3 War battle confrontations.',
    category: 'WAR',
    icon: '🛡️',
    points: 800,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'hot_streak_5',
    title: 'Hot Streak',
    description: 'Build a consecutive 5-round win streak in Casino War.',
    category: 'WAR',
    icon: '🔥',
    points: 600,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'streak_10',
    title: '10 Wins Streak',
    description: 'Achieve an unstoppable 10-round win streak in Casino War.',
    category: 'WAR',
    icon: '🌟',
    points: 1500,
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Amass a Casino War bankroll of $3,000 or greater.',
    category: 'WAR',
    icon: '💰',
    points: 750,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3000,
  },
  {
    id: 'memory_speed',
    title: 'Speed Runner',
    description: 'Clear any Memory Match grid in 30 seconds or less.',
    category: 'MEMORY',
    icon: '⏱️',
    points: 750,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'perfect_recall',
    title: 'Flawless Mind',
    description: 'Clear a Memory Match grid with 90% or higher accuracy.',
    category: 'MEMORY',
    icon: '🧠',
    points: 800,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'colossal_conqueror',
    title: 'Colossal Titan',
    description: 'Clear the 48-card Colossal memory board.',
    category: 'MEMORY',
    icon: '🏛️',
    points: 1200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'battleship_admiral',
    title: 'Fleet Admiral',
    description: 'Decimate Commander Vane\'s armada and claim naval victory.',
    category: 'BATTLESHIP',
    icon: '⚓',
    points: 800,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'battleship_sharpshooter',
    title: 'Naval Sharpshooter',
    description: 'Win a Battleship match with 60% or higher firing accuracy.',
    category: 'BATTLESHIP',
    icon: '🎯',
    points: 1000,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'triad_champion',
    title: 'Triad Champion',
    description: 'Play and record scores across all arcade modes.',
    category: 'GENERAL',
    icon: '💎',
    points: 1000,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
];

export function getAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACHIEVEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    const parsed: Achievement[] = JSON.parse(raw);
    // Ensure all defined achievements exist in case new ones were added
    const ids = new Set(parsed.map((a) => a.id));
    const merged = [...parsed];
    INITIAL_ACHIEVEMENTS.forEach((init) => {
      if (!ids.has(init.id)) merged.push(init);
    });
    return merged;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // Storage full fallback
  }
}

interface AchievementEventPayload {
  mode: 'BINGO' | 'WAR' | 'BATTLESHIP' | 'MEMORY' | 'GENERAL';
  event: string;
  data?: {
    won?: boolean;
    calls?: number;
    pattern?: string;
    warsWon?: number;
    streak?: number;
    bankroll?: number;
    timeSeconds?: number;
    accuracy?: number;
    difficulty?: string;
    turns?: number;
    modesPlayed?: Set<string>;
  };
}

export function checkAndUnlockAchievements(payload: AchievementEventPayload): Achievement[] {
  const list = getAchievements();
  const newlyUnlocked: Achievement[] = [];
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const unlock = (ach: Achievement) => {
    if (!ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = now;
      ach.progress = ach.maxProgress;
      newlyUnlocked.push(ach);
    }
  };

  list.forEach((ach) => {
    // General: first_win
    if (ach.id === 'first_win' && payload.data?.won) {
      unlock(ach);
    }

    // Bingo checks
    if (payload.mode === 'BINGO' && payload.data?.won) {
      if (ach.id === 'bingo_novice') unlock(ach);

      if (ach.id === 'speed_runner_bingo' && (payload.data.calls ?? 999) <= 30) {
        unlock(ach);
      }

      if (ach.id === 'blackout_king' && payload.data.pattern?.toLowerCase().includes('blackout')) {
        unlock(ach);
      }

      if (ach.id === 'pattern_variety' && !ach.isUnlocked) {
        ach.progress = Math.min(ach.maxProgress, ach.progress + 1);
        if (ach.progress >= ach.maxProgress) unlock(ach);
      }
    }

    // War checks
    if (payload.mode === 'WAR') {
      if (ach.id === 'first_war_win' && (payload.data?.warsWon ?? 0) >= 1) {
        unlock(ach);
      }

      if (ach.id === 'war_hero' && !ach.isUnlocked) {
        ach.progress = Math.min(ach.maxProgress, (payload.data?.warsWon ?? 0));
        if (ach.progress >= ach.maxProgress) unlock(ach);
      }

      if (ach.id === 'hot_streak_5') {
        const s = payload.data?.streak ?? 0;
        ach.progress = Math.max(ach.progress, Math.min(ach.maxProgress, s));
        if (s >= 5) unlock(ach);
      }

      if (ach.id === 'streak_10') {
        const s = payload.data?.streak ?? 0;
        ach.progress = Math.max(ach.progress, Math.min(ach.maxProgress, s));
        if (s >= 10) unlock(ach);
      }

      if (ach.id === 'high_roller') {
        const b = payload.data?.bankroll ?? 0;
        ach.progress = Math.max(ach.progress, Math.min(ach.maxProgress, b));
        if (b >= 3000) unlock(ach);
      }
    }

    // Memory checks
    if (payload.mode === 'MEMORY') {
      if (ach.id === 'memory_speed' && (payload.data?.timeSeconds ?? 999) <= 30) {
        unlock(ach);
      }

      if (ach.id === 'perfect_recall' && (payload.data?.accuracy ?? 0) >= 90) {
        unlock(ach);
      }

      if (ach.id === 'colossal_conqueror' && payload.data?.difficulty === 'COLOSSAL') {
        unlock(ach);
      }
    }

    // Battleship checks
    if (payload.mode === 'BATTLESHIP') {
      if (ach.id === 'battleship_admiral' && payload.data?.won) {
        unlock(ach);
      }
      if (ach.id === 'battleship_sharpshooter' && payload.data?.won && (payload.data?.accuracy ?? 0) >= 60) {
        unlock(ach);
      }
    }

    // General: triad_champion
    if (ach.id === 'triad_champion' && !ach.isUnlocked && payload.data?.modesPlayed) {
      ach.progress = Math.min(ach.maxProgress, payload.data.modesPlayed.size);
      if (ach.progress >= ach.maxProgress) unlock(ach);
    }
  });

  if (newlyUnlocked.length > 0) {
    saveAchievements(list);
  }

  return newlyUnlocked;
}
