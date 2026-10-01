import { MathOperation, PirateCharacter } from '../types';
import { BASE_CHARACTERS } from './constants';
import { UNLOCKABLE_CHARACTERS } from './mathIncentives';

export type PowerUpType = 'POWER_GROG' | 'POWER_SPEED' | 'POWER_INVISIBILITY' | 'POWER_KEG';

export interface LevelConfig {
  level: number;
  islandName: string;
  themeColor: string;
  badge: string;
  icon: string;
  mathDifficultyLevel: number;
  mathDifficultyName: string;
  mathCategory: 'EASY' | 'MEDIUM' | 'ADVANCED' | 'EXPERT' | 'MASTER';
  mathDescription: string;
  mathOperations: MathOperation[];
  featuredHero: PirateCharacter;
  newPowerUpUnlocked?: {
    type: PowerUpType;
    name: string;
    icon: string;
    description: string;
  };
  allowedPowerUps: PowerUpType[];
  parTimeSeconds: number; // Target clear time for Gold Anchor
  introLore: string;
}

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    level: 1,
    islandName: "Smuggler's Cove",
    themeColor: '#38bdf8', // Sky blue
    badge: 'Beginner Waters',
    icon: '🏝️',
    mathDifficultyLevel: 1,
    mathDifficultyName: 'Deckhand Addition (Easy)',
    mathCategory: 'EASY',
    mathDescription: 'Single-digit addition & basic counting plunder (within 10-20)',
    mathOperations: ['ADDITION'],
    featuredHero: BASE_CHARACTERS[0], // Blackbeard
    newPowerUpUnlocked: {
      type: 'POWER_GROG',
      name: 'Royal Grog',
      icon: '🍺',
      description: 'Draw cutlasses, frighten Redcoats & turn the tables!',
    },
    allowedPowerUps: ['POWER_GROG'],
    parTimeSeconds: 75,
    introLore: 'Steal the crown doubloons from the guarded cove while cracking beginner addition ciphers.',
  },
  2: {
    level: 2,
    islandName: "Dead Man's Atoll",
    themeColor: '#34d399', // Emerald
    badge: 'Elementary Reef',
    icon: '⛵',
    mathDifficultyLevel: 2,
    mathDifficultyName: 'Cabin Mate Subtraction & Addition',
    mathCategory: 'MEDIUM',
    mathDescription: 'Two-digit addition and subtraction within 30-50',
    mathOperations: ['ADDITION', 'SUBTRACTION'],
    featuredHero: BASE_CHARACTERS[1], // Anne Bonny
    newPowerUpUnlocked: {
      type: 'POWER_SPEED',
      name: 'Swift Rum Boots',
      icon: '💨',
      description: '1.8x turbocharged speed dash to outrun swift guards!',
    },
    allowedPowerUps: ['POWER_GROG', 'POWER_SPEED'],
    parTimeSeconds: 70,
    introLore: 'Calculate rations and distances to unlock swift winds and outpace the Redcoat navy.',
  },
  3: {
    level: 3,
    islandName: 'Port Royal Citadel',
    themeColor: '#a855f7', // Purple
    badge: 'Intermediate Citadel',
    icon: '🏰',
    mathDifficultyLevel: 3,
    mathDifficultyName: 'Boatswain Multiplication (Times Tables 2-5)',
    mathCategory: 'ADVANCED',
    mathDescription: 'Multiplication arrays, repeated groups & broadside calculations',
    mathOperations: ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION'],
    featuredHero: BASE_CHARACTERS[2], // Calico Jack
    newPowerUpUnlocked: {
      type: 'POWER_INVISIBILITY',
      name: "Smuggler's Ghost Mist Cloak",
      icon: '🌫️',
      description: 'Slip into spectral sea mist to phase invisibly through any guard!',
    },
    allowedPowerUps: ['POWER_GROG', 'POWER_SPEED', 'POWER_INVISIBILITY'],
    parTimeSeconds: 65,
    introLore: 'Infiltrate the Governor’s Citadel with spectral mist cloaks and rapid times-table precision.',
  },
  4: {
    level: 4,
    islandName: "Kraken's Trench",
    themeColor: '#f97316', // Orange
    badge: 'Gunner Division',
    icon: '🐙',
    mathDifficultyLevel: 4,
    mathDifficultyName: 'Gunner Division & Times Tables 6-10',
    mathCategory: 'EXPERT',
    mathDescription: 'Division with fair plunder sharing & multiplication mastery',
    mathOperations: ['MULTIPLICATION', 'DIVISION'],
    featuredHero: UNLOCKABLE_CHARACTERS[0], // Navigator Hypatia
    newPowerUpUnlocked: {
      type: 'POWER_KEG',
      name: 'Powder Keg Explosives',
      icon: '💣',
      description: 'Detonate explosive kegs to blast and stun all guards within corridors!',
    },
    allowedPowerUps: ['POWER_GROG', 'POWER_SPEED', 'POWER_INVISIBILITY', 'POWER_KEG'],
    parTimeSeconds: 60,
    introLore: 'Divide plundered galleons equally among the crew to detonate powder keg barrages.',
  },
  5: {
    level: 5,
    islandName: 'Tortuga Treasury & Grand Fleet',
    themeColor: '#fbbf24', // Amber/Gold
    badge: 'Admiral Grandmaster',
    icon: '👑',
    mathDifficultyLevel: 5,
    mathDifficultyName: 'PEMDAS Order of Operations & Master Arithmetic',
    mathCategory: 'MASTER',
    mathDescription: 'Multi-step arithmetic, parentheses precedence & high seas master navigation',
    mathOperations: ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'ORDER_OF_OPERATIONS'],
    featuredHero: UNLOCKABLE_CHARACTERS[1], // Captain Archimedes
    newPowerUpUnlocked: {
      type: 'POWER_KEG',
      name: 'Super Keg Barrage & Golden Galleon',
      icon: '🌟',
      description: 'Maximum arsenal: All power-ups active with golden doubloon multiplier!',
    },
    allowedPowerUps: ['POWER_GROG', 'POWER_SPEED', 'POWER_INVISIBILITY', 'POWER_KEG'],
    parTimeSeconds: 55,
    introLore: 'Solve royal astrolabe formulas using PEMDAS order of operations to claim the Corsair Crown.',
  },
};

export const LEVEL_PROGRESSION_MAP: LevelConfig[] = [
  LEVEL_CONFIGS[1],
  LEVEL_CONFIGS[2],
  LEVEL_CONFIGS[3],
  LEVEL_CONFIGS[4],
  LEVEL_CONFIGS[5],
];

export function getLevelConfig(level: number): LevelConfig {
  if (level in LEVEL_CONFIGS) {
    return LEVEL_CONFIGS[level];
  }
  // For level 6+, scale dynamically
  const base = LEVEL_CONFIGS[5];
  return {
    ...base,
    level,
    islandName: `Grand Admiral Waters (Tier ${level})`,
    mathDifficultyLevel: Math.min(10, 5 + (level - 5)),
    mathDifficultyName: `Grandmaster PEMDAS (Level ${Math.min(10, 5 + (level - 5))})`,
    parTimeSeconds: Math.max(45, 55 - (level - 5) * 2),
    introLore: `You have reached Tier ${level} of the Spanish Main! Redcoats patrol with maximum vigilance.`,
  };
}

export function isPowerUpUnlockedForLevel(type: PowerUpType, level: number): boolean {
  const config = getLevelConfig(level);
  return config.allowedPowerUps.includes(type);
}
