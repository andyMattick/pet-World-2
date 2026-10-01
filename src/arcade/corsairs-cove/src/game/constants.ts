import { PirateCharacter } from '../types';
import { UNLOCKABLE_CHARACTERS } from './mathIncentives';

export const GRID_COLS = 28;
export const GRID_ROWS = 31;
export const BASE_TILE_SIZE = 20; // 560 width x 620 height

export const BASE_CHARACTERS: PirateCharacter[] = [
  {
    id: 'blackbeard',
    name: 'Captain Blackbeard',
    title: 'The Terror of the Spanish Main',
    color: '#1e293b', // Midnight black coat
    accentColor: '#ef4444', // Red bandana
    description: 'Fierce and intimidating with a smoking beard. Grog Fight Back power lasts 3 seconds longer!',
    perk: '+3s Grog Fight Back',
    perkType: 'POWER',
  },
  {
    id: 'anne_bonny',
    name: 'Anne Bonny',
    title: 'Queen of the High Seas',
    color: '#0284c7', // Sea blue coat
    accentColor: '#38bdf8', // Azure bandana
    description: 'Swift and agile corsair. Moves 10% faster and Swift Rum speed lasts longer!',
    perk: '+10% Speed & Extended Dash',
    perkType: 'SPEED',
  },
  {
    id: 'calico_jack',
    name: 'Calico Jack',
    title: 'Lover of Doubloons',
    color: '#d97706', // Gold/amber coat
    accentColor: '#f59e0b', // Striped calico bandana
    description: 'A cunning treasure hunter. Scores +50% bonus gold and treasure chests spawn faster!',
    perk: '+50% Gold Value',
    perkType: 'GOLD',
  }
];

export const CHARACTERS: PirateCharacter[] = [
  ...BASE_CHARACTERS,
  ...UNLOCKABLE_CHARACTERS,
];

export const GAME_SPEEDS = {
  PIRATE_BASE: 0.125, // tiles per tick (approx 60fps * 0.125 = 7.5 tiles/sec)
  PIRATE_SPEED_BOOST: 0.22,
  GUARD_NORMAL: 0.14,
  GUARD_CHASE: 0.18,
  GUARD_FRIGHTENED: 0.07,
  GUARD_RETURNING: 0.22,
  GUARD_PEN_EXIT: 0.08,
};

export const POWERUP_DURATIONS = {
  GROG_MS: 8500,
  INVISIBILITY_MS: 7000,
  SPEED_MS: 6000,
};

export const SCORES = {
  COIN: 10,
  GROG: 50,
  INVISIBILITY: 75,
  SPEED: 75,
  KEG: 100,
  GUARD_BASE: 200, // 200, 400, 800, 1600
  CHEST: 1000,
  CHALICE: 500,
};
