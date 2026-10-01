import { PirateCharacter } from '../types';

export interface MathMilestoneReward {
  threshold: number; // 1 to 10
  title: string;
  badge: string;
  icon: string;
  color: string;
  perkDescription: string;
  inGameBonusText: string;
  unlockedCharacter?: PirateCharacter;
  cosmeticTitle: string;
  loreSnippet: string;
}

// 2 Special Unlockable Corsair Captains earned strictly through Math Mastery!
export const UNLOCKABLE_CHARACTERS: PirateCharacter[] = [
  {
    id: 'hypatia_navigator',
    name: 'Navigator Hypatia',
    title: 'The Alexandria Astronomer & Astrolabe Master',
    color: '#065f46', // Emerald green scholar coat
    accentColor: '#34d399', // Bright jade astrolabe trim
    description: 'Unlocked by reaching Level 4 or solving 5 ciphers! Geometric star charts grant +25% bonus power-up duration and +1 extra starting life.',
    perk: '+25% Power Duration & +1 Life',
    perkType: 'POWER',
    isMathUnlocked: true,
    requiredSolved: 5,
  },
  {
    id: 'archimedes_bombardier',
    name: 'Captain Archimedes',
    title: 'The Eureka Corsair & Geometric Sage',
    color: '#701a75', // Royal purple/magenta sage coat
    accentColor: '#f472b6', // Radiant rose spark
    description: 'Unlocked by achieving an unbroken 5-Cipher Streak! Powder keg explosions radiate 40% wider and all coins award +25% doubloons.',
    perk: 'Wide Blast Radius & +25% Doubloons',
    perkType: 'GOLD',
    isMathUnlocked: true,
    requiredStreak: 5,
  },
];

// 10 Distinct Milestone Rewards for Questions 1 through 10 in EVERY level
export const LEVEL_MATH_MILESTONES: MathMilestoneReward[] = [
  {
    threshold: 1,
    title: 'Q1: Doubloon Starter Stash',
    badge: 'Starter Stash (+200 Gold)',
    icon: '🪙',
    color: '#38bdf8',
    perkDescription: 'Initial cipher solved! Grants +200 bonus doubloons immediately.',
    inGameBonusText: '+200 BONUS DOUBLOONS',
    cosmeticTitle: 'Cabin Scholar',
    loreSnippet: 'Every great pirate navigator starts by checking the stars and counting the plunder.',
  },
  {
    threshold: 2,
    title: 'Q2: Swift Wind Surge',
    badge: 'Swift Dash (5s Boost)',
    icon: '💨',
    color: '#34d399',
    perkDescription: 'Arithmetic momentum! Activates an instant 5-second turbo speed boost.',
    inGameBonusText: '5S SWIFT WIND DASH ACTIVATED',
    cosmeticTitle: 'Swift Counter',
    loreSnippet: 'Wind in the sails and calculations in the mind leave the Redcoats behind.',
  },
  {
    threshold: 3,
    title: 'Q3: Extra Crew Heart',
    badge: 'Extra Life Granted (+1 ❤️)',
    icon: '❤️',
    color: '#f43f5e',
    perkDescription: 'Agile calculation! Restores an immediate +1 Extra Heart life and short ghost mist cloak.',
    inGameBonusText: '+1 EXTRA HEART & GHOST CLOAK',
    cosmeticTitle: 'Quartermaster Scribe',
    loreSnippet: 'Quick thinking in battle keeps the captain out of Davy Jones’ locker.',
  },
  {
    threshold: 4,
    title: 'Q4: Spectral Mist Cloak',
    badge: 'Ghost Cloak (5s Phase)',
    icon: '🌫️',
    color: '#c084fc',
    perkDescription: 'Spectral sea mist wraps your pirate! Phase safely through all guards for 5 seconds.',
    inGameBonusText: '5S GHOST MIST INVISIBILITY',
    cosmeticTitle: 'Mist Smuggler',
    loreSnippet: 'Spectral fog rolls in off the reef, hiding our ship from British spyglasses.',
  },
  {
    threshold: 5,
    title: 'Q5: Hero Spotlight & Bounty',
    badge: 'Hero Spotlight & +500 Gold',
    icon: '🎓',
    color: '#10b981',
    perkDescription: 'Halfway through the level ciphers! Permanently unlocks Navigator Hypatia and awards +500 Gold.',
    inGameBonusText: 'HERO UNLOCK: NAVIGATOR HYPATIA & +500 GOLD',
    unlockedCharacter: UNLOCKABLE_CHARACTERS[0],
    cosmeticTitle: 'Grand Astrolabe Master',
    loreSnippet: 'Named after Alexandria’s greatest mathematician, calculating trajectories faster than cannonballs.',
  },
  {
    threshold: 6,
    title: 'Q6: Doubloon Doubler Frenzy',
    badge: '2x Gold on next 15 Coins',
    icon: '✨',
    color: '#eab308',
    perkDescription: 'Gold rush cipher! The next 15 gold doubloons picked up award double bounty points (2x).',
    inGameBonusText: '2X GOLD FRENZY ACTIVATED',
    cosmeticTitle: 'Treasury Raider',
    loreSnippet: 'A coded chart revealed the secret false bottom of the royal chest.',
  },
  {
    threshold: 7,
    title: 'Q7: Barracks Flash-Stun',
    badge: 'Stun Closest Redcoat',
    icon: '⚡',
    color: '#06b6d4',
    perkDescription: 'Disrupts British communications! Sends the nearest Redcoat guard fleeing back to barracks.',
    inGameBonusText: 'NEAREST GUARD STUNNED TO BARRACKS',
    cosmeticTitle: 'Tactical Gunner',
    loreSnippet: 'A flare fired at the signal tower threw the harbor garrison into utter disarray.',
  },
  {
    threshold: 8,
    title: 'Q8: Powder Keg Super Explosion',
    badge: 'Corridor Shockwave (+1,000)',
    icon: '💣',
    color: '#f97316',
    perkDescription: 'Detonates a massive explosive shockwave through nearby corridors, stunning all guards and granting +1,000 points.',
    inGameBonusText: 'POWDER KEG SHOCKWAVE DETONATED (+1,000 PTS)',
    cosmeticTitle: 'Artillery Mathematician',
    loreSnippet: 'With exact firing angles, our gunners cleared the deck in one thunderous volley.',
  },
  {
    threshold: 9,
    title: 'Q9: Fleet Siren Confusion',
    badge: 'All Guards Slowed 50% (8s)',
    icon: '🎶',
    color: '#8b5cf6',
    perkDescription: 'An eerie sea siren song disorients all four guards, slowing their movement to 50% for 8 seconds.',
    inGameBonusText: 'ALL GUARDS CONFUSED & SLOWED 50%',
    cosmeticTitle: 'Corsair Siren',
    loreSnippet: 'The sirens of the reef lure British frigates onto the shallows.',
  },
  {
    threshold: 10,
    title: 'Q10: Grand Admiral Level Mastery',
    badge: 'Mastery Crown (+2,500 Gold)',
    icon: '👑',
    color: '#fbbf24',
    perkDescription: 'Mastered all 10 ciphers for this level! Awards +2,500 Jackpot Doubloons and a radiant Golden Aura.',
    inGameBonusText: 'LEVEL CIPHER MASTERY! +2,500 BOUNTY',
    cosmeticTitle: 'High Seas Math Admiral',
    loreSnippet: 'Your mathematical brilliance has outsmarted the entire Crown Fleet.',
  },
];

// Alias for backwards compatibility
export const MATH_MILESTONES = LEVEL_MATH_MILESTONES;

// Accuracy Streak Incentives (Consecutive Correct Answers)
export interface StreakMilestone {
  streak: number;
  title: string;
  badge: string;
  icon: string;
  color: string;
  bonusText: string;
  perkText: string;
  unlockedCharacter?: PirateCharacter;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    streak: 2,
    title: '2-Streak: Navigator’s Spark',
    badge: '2 In A Row',
    icon: '⚡',
    color: '#38bdf8',
    bonusText: '+300 Speed Doubloons',
    perkText: 'Two consecutive correct answers grant rapid plunder bonus!',
  },
  {
    streak: 3,
    title: '3-Streak: Flawless Calculation',
    badge: '3 In A Row',
    icon: '🔥',
    color: '#f97316',
    bonusText: '+600 Doubloons & Swift Dash',
    perkText: 'Three perfect ciphers in a row triggers an automatic swift speed surge!',
  },
  {
    streak: 5,
    title: '5-Streak: Hero Unlocked: Captain Archimedes',
    badge: '5-Cipher Flawless Streak',
    icon: '👑',
    color: '#f43f5e',
    bonusText: 'Hero Unlocked & +1,500 Bounty',
    perkText: 'Unlocks Captain Archimedes permanently in your pirate roster!',
    unlockedCharacter: UNLOCKABLE_CHARACTERS[1],
  },
  {
    streak: 8,
    title: '8-Streak: High Seas Savant',
    badge: '8-Cipher Legend',
    icon: '🌟',
    color: '#fbbf24',
    bonusText: '+3,000 Grand Bounty & Golden Anchor',
    perkText: 'Legendary accuracy! Earns maximum score multiplier across the high seas.',
  },
];

// Speed tiers for individual problem answer time
export interface AnswerSpeedTier {
  tier: 'LIGHTNING' | 'SWIFT' | 'STEADY';
  maxSeconds: number;
  label: string;
  bonusPoints: number;
  grantSpeedBoost: boolean;
}

export const ANSWER_SPEED_TIERS: AnswerSpeedTier[] = [
  {
    tier: 'LIGHTNING',
    maxSeconds: 3.5,
    label: '⚡ LIGHTNING SOLVER',
    bonusPoints: 300,
    grantSpeedBoost: true,
  },
  {
    tier: 'SWIFT',
    maxSeconds: 7.0,
    label: '⚡ SWIFT CALCULATION',
    bonusPoints: 150,
    grantSpeedBoost: false,
  },
  {
    tier: 'STEADY',
    maxSeconds: 14.0,
    label: '🧭 STEADY NAVIGATOR',
    bonusPoints: 50,
    grantSpeedBoost: false,
  },
];

export function getAnswerSpeedReward(seconds: number): {
  tier: 'LIGHTNING' | 'SWIFT' | 'STEADY' | 'STANDARD';
  label: string;
  bonusPoints: number;
  grantSpeedBoost: boolean;
} {
  if (seconds <= 3.5) {
    return {
      tier: 'LIGHTNING',
      label: '⚡ LIGHTNING SOLVER! (< 3.5s)',
      bonusPoints: 300,
      grantSpeedBoost: true,
    };
  }
  if (seconds <= 7.0) {
    return {
      tier: 'SWIFT',
      label: '⚡ SWIFT CALCULATION (< 7s)',
      bonusPoints: 150,
      grantSpeedBoost: false,
    };
  }
  if (seconds <= 14.0) {
    return {
      tier: 'STEADY',
      label: '🧭 STEADY NAVIGATOR (< 14s)',
      bonusPoints: 50,
      grantSpeedBoost: false,
    };
  }
  return {
    tier: 'STANDARD',
    label: '⚓ SOLVED',
    bonusPoints: 0,
    grantSpeedBoost: false,
  };
}

// Level completion speed bounty calculation
export interface LevelSpeedRank {
  rank: 'GOLD' | 'SILVER' | 'BRONZE' | 'STANDARD';
  medalEmoji: string;
  label: string;
  bonusScore: number;
}

export function calculateLevelSpeedBounty(elapsedSeconds: number, parTimeSeconds: number): LevelSpeedRank {
  if (elapsedSeconds <= parTimeSeconds * 0.8) {
    return {
      rank: 'GOLD',
      medalEmoji: '🥇',
      label: 'Gold Anchor Speed Bounty!',
      bonusScore: 1500,
    };
  }
  if (elapsedSeconds <= parTimeSeconds * 1.1) {
    return {
      rank: 'SILVER',
      medalEmoji: '🥈',
      label: 'Silver Anchor Speed Bounty!',
      bonusScore: 800,
    };
  }
  if (elapsedSeconds <= parTimeSeconds * 1.4) {
    return {
      rank: 'BRONZE',
      medalEmoji: '🥉',
      label: 'Bronze Anchor Speed Bounty!',
      bonusScore: 400,
    };
  }
  return {
    rank: 'STANDARD',
    medalEmoji: '⚓',
    label: 'Clear Anchor Bounty',
    bonusScore: 150,
  };
}

// Persistence helpers
const STORAGE_KEY_UNLOCKED_HEROES = 'corsair_unlocked_heroes_v1';
const STORAGE_KEY_LIFETIME_SOLVED = 'corsair_lifetime_math_solved_v1';

export function getPersistedUnlockedHeroIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UNLOCKED_HEROES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePersistedUnlockedHeroId(heroId: string) {
  try {
    const current = getPersistedUnlockedHeroIds();
    if (!current.includes(heroId)) {
      current.push(heroId);
      localStorage.setItem(STORAGE_KEY_UNLOCKED_HEROES, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save unlocked hero', e);
  }
}

export function getLifetimeMathSolved(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIFETIME_SOLVED);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function addLifetimeMathSolved(count: number = 1): number {
  try {
    const current = getLifetimeMathSolved() + count;
    localStorage.setItem(STORAGE_KEY_LIFETIME_SOLVED, current.toString());
    return current;
  } catch {
    return 0;
  }
}
