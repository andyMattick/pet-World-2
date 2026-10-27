/* Every number the game uses, in one place, so balancing is a one-file change (docs/PAX-OECONOMICA.md). */
import type { BuildingType, Era, NodeType, ResourceType, Stock } from '../types/game';

export const zero = (): Stock => ({ food: 0, wood: 0, stone: 0, iron: 0, luxury: 0 });
export type Cost = Partial<Stock> & { gold?: number };

export const RES_INFO: Record<ResourceType, { name: string; emoji: string; base: number; color: string }> = {
  food: { name: 'Food', emoji: '🌾', base: 4, color: '#84cc16' },
  wood: { name: 'Wood', emoji: '🪵', base: 4, color: '#a16207' },
  stone: { name: 'Stone', emoji: '🪨', base: 5, color: '#94a3b8' },
  iron: { name: 'Iron', emoji: '⛓️', base: 8, color: '#64748b' },
  luxury: { name: 'Luxury', emoji: '💎', base: 10, color: '#d946ef' },
};
/** what a luxury is called in each era (the goods are different, the rules are the same) */
export const LUXURY_NAME: Record<Era, string> = { 1: 'Luxury (silk, spices, purple dye)', 2: 'Luxury (silk, spices, furs, porcelain)' };
export const NODE_INFO: Record<NodeType, { camp: string; emoji: string }> = {
  food: { camp: 'Farm', emoji: '🌾' }, wood: { camp: 'Lumber camp', emoji: '🌲' }, stone: { camp: 'Quarry', emoji: '🪨' },
  iron: { camp: 'Iron mine', emoji: '⛏️' }, luxury: { camp: 'Luxury workshop', emoji: '💎' }, gold: { camp: 'Gold mine', emoji: '🪙' },
};

export const START = { gold: 50, stock: { food: 12, wood: 12, stone: 8, iron: 4, luxury: 4 } as Stock };

// storage (spec: base 40, +80 per depot); goods above it sit outside, exposed: they spoil and raiders take them first
export const BASE_CAPACITY = 40;
export const DEPOT_CAPACITY = 80;
export const SPOIL_RATE = 0.1;

// production
/** camp output by level (1-3). Cheap goods come in bigger piles, so every camp is worth about the same in gold. */
export const CAMP_YIELD: Record<NodeType, number[]> = {
  food: [0, 4, 6, 9], wood: [0, 4, 6, 9], stone: [0, 3, 5, 7], iron: [0, 2, 3, 5], luxury: [0, 2, 3, 4], gold: [0, 10, 15, 20],
};
export const CAPITAL_YIELD: Partial<Stock> & { gold: number } = { food: 3, wood: 2, gold: 5 };

// building (cost, prestige when built, HP, vision)
export const BUILD: Record<Exclude<BuildingType, 'capital'>, { name: string; emoji: string; cost: Cost; prestige: number; hp: number; vision: number; what: string }> = {
  camp: { name: 'Camp', emoji: '⛺', cost: { wood: 8, gold: 4 }, prestige: 3, hp: 3, vision: 2, what: 'Harvests the resource on this hex every round.' },
  outpost: { name: 'Outpost', emoji: '🗼', cost: { wood: 12, stone: 8 }, prestige: 5, hp: 6, vision: 3, what: 'Claims the hexes around it and sees 3 hexes away.' },
  depot: { name: 'Storage depot', emoji: '🏚️', cost: { stone: 14, wood: 8 }, prestige: 4, hp: 8, vision: 1, what: `Stores ${DEPOT_CAPACITY} more goods so they don’t spoil.` },
  barracks: { name: 'Barracks', emoji: '🛡️', cost: { stone: 12, iron: 6 }, prestige: 3, hp: 8, vision: 2, what: 'Lets you train soldiers anywhere in your land.' },
};
export const CAPITAL = { hp: 12, vision: 3 };
export const UPGRADE_COST: Cost[] = [{}, {}, { wood: 6, stone: 6 }, { stone: 10, iron: 4 }];   // to reach level 2, 3
export const UPGRADE_PRESTIGE = 3;
export const MAX_LEVEL = 3;
export const BUILD_RANGE = 2;                   // outposts and depots may be placed this far beyond your land

// soldiers
export const TROOP_COST: Cost = { food: 6, iron: 3 };
export const MAX_TROOPS = 6;
export const REPAIR_COST: Cost = { stone: 4 };

// scouts
export const SCOUT_COST: Cost = { food: 10, gold: 10 };
export const MAX_SCOUTS = 3;
export const SCOUT_MOVES = 3;
export const SCOUT_VISION = 2;

// upkeep (food eaten each round)
export const FOOD_UPKEEP = { capital: 2, outpost: 1, troop: 1 };
export const FAMINE_PRESTIGE = 5;

// prestige
export const WONDER_STAGES: { cost: Cost; prestige: number }[] = [
  { cost: { stone: 30, wood: 20, luxury: 10 }, prestige: 40 },
  { cost: { stone: 40, iron: 20, luxury: 15 }, prestige: 60 },
  { cost: { stone: 50, iron: 30, luxury: 25, food: 30 }, prestige: 90 },
];
export const WONDER_NAME: Record<Era, string[]> = {
  1: ['Great Forum', 'Grand Library', 'Colossus of the Age'],
  2: ['Great Bazaar', 'House of Learning', 'Grand Cathedral-Mosque-Pagoda'],
};
export const FESTIVAL_COST: Cost = { luxury: 8, food: 12 };
export const FESTIVAL_PRESTIGE = 10;
export const TRADE_PRESTIGE_PER_GOLD = 1 / 25;   // +1 prestige for every 25 gold of goods sold
export const LAND_PRESTIGE_PER = 5;              // +1 prestige a round for every 5 hexes you hold
export const DEFENSE_PRESTIGE = 8;
export const AID_BONUS_ALL = 5, AID_BONUS_TOP = 10;
export const RUIN_GOLD = 30, RUIN_PRESTIGE = 10;

// barbarians (spec numbers)
export const HIRE_COST = 30;
export const PAYROLL = 8;
export const BRIBE_GOLD = 25, BRIBE_FOOD = 30;
export const UNREST_MISSED = 40, REVOLT_AT = 100, UNREST_PAID_DROP = 10;
export const BARB_START_STRENGTH = [3, 6];
export const BARB_GROWTH_EVERY = 3, BARB_MAX = 10;
export const RAID_CHANCE = 0.35, RAID_RANGE = 5;
export const RAID_PRIORITY: Record<BuildingType, number> = { depot: 4, outpost: 3, camp: 2, barracks: 1, capital: 0 };

// trader (spec numbers)
export const TRADER_REVEAL = 20, TRADER_INTEL = 35, TRADER_RUMOR = 10;

// market
export const SPREAD = 1.3;                      // buying costs this much more than selling
export const PRICE_EXP = 0.7;
export const PRICE_MIN = 0.4, PRICE_MAX = 3;

// game length and victory
export const LENGTHS = [{ rounds: 15, name: 'Short' }, { rounds: 25, name: 'Standard' }, { rounds: 35, name: 'Long' }];
export const PRESTIGE_TARGET = 500;
export const MAP_SIZES = [{ radius: 7, name: 'Standard' }, { radius: 9, name: 'Large' }];
