/* The 12 civilizations: Era 1 (Classical, History Unit 4) and Era 2 (Medieval, History Unit 5). Each ability is a set
   of numbers the engine reads, so the bonus in the text is the bonus in the game. */
import type { Era, NodeType } from '../types/game';

export interface CivAbility {
  outpostCostMult?: number;      // Rome: cheaper outposts
  fortHpBonus?: number;          // Rome: +2 HP to every fortification (outposts, depots, barracks, capital)
  depotCapMult?: number;         // Han: bigger depots
  yieldBonus?: Partial<Record<'food' | 'wood' | 'stone' | 'iron' | 'luxury' | 'gold', number>>;   // extra per camp of that kind
  yieldMult?: Partial<Record<'food' | 'wood' | 'stone' | 'iron' | 'luxury' | 'gold', number>>;    // multiplies that output
  hireCostMult?: number;         // Parthia: cheaper barbarians
  tollPerRoute?: number;         // Parthia: gold per rival empire, every round (Silk Road tolls)
  aidPrestigeMult?: number;      // Maurya +20%, Mali bonus
  troopDefenseBonus?: number;    // Kush: each troop counts extra
  marketDiscount?: number;       // Athens: 5% cheaper buying
  goldPerRound?: number;         // Mali, Song, Athens
  depotRaidResist?: number;      // Byzantium: raids take less from depots
  intelDiscount?: number;        // Abbasids: trader intelligence at half price
  luxurySellBonus?: number;      // Abbasids: spice hub, sells luxury higher
  coastVisionBonus?: number;     // Srivijaya: sees farther on coasts and water
  scoutMoveBonus?: number;       // Kievan Rus: scouts move +1 hex
}
export interface Civ {
  id: string; era: Era; name: string; emoji: string; color: string;
  ability: string; abilityText: string; history: string; mods: CivAbility;
  /** what the land around the capital is rich in and short of: this is what the empire has to sell and to buy */
  rich: NodeType[]; poor: NodeType[];
}
export const CIVS: Civ[] = [
  { id: 'rome', era: 1, name: 'Rome', emoji: '🏛️', color: '#991B1B', ability: 'Legionary Engineering',
    abilityText: 'Outposts cost 25% less, and every fortification gets +2 HP.',
    history: 'Roman legions built roads, forts and walls across the empire as they marched.',
    mods: { outpostCostMult: 0.75, fortHpBonus: 2 }, rich: ['stone','iron'], poor: ['luxury'] },
  { id: 'han', era: 1, name: 'Han', emoji: '🐉', color: '#065F46', ability: 'Imperial Granary',
    abilityText: 'Storage depots hold 50% more, and farms make +1 food.',
    history: 'Han China kept great state granaries to feed the people in years of bad harvests.',
    mods: { depotCapMult: 1.5, yieldBonus: { food: 1 } }, rich: ['food','luxury'], poor: ['iron'] },
  { id: 'parthia', era: 1, name: 'Parthia', emoji: '🐎', color: '#D97706', ability: 'Steppe Caravaneers',
    abilityText: 'Hiring barbarians costs 25% less, and Silk Road tolls pay you 2 gold a round for each rival empire.',
    history: 'Parthia sat in the middle of the Silk Roads and grew rich as the go-between for Rome and Han China.',
    mods: { hireCostMult: 0.75, tollPerRoute: 2 }, rich: ['gold','luxury'], poor: ['wood'] },
  { id: 'maurya', era: 1, name: 'Maurya', emoji: '🐘', color: '#EA580C', ability: 'Dhamma Edicts',
    abilityText: '+20% prestige from aid donations, and lumber camps make +1 wood.',
    history: 'Emperor Ashoka’s edicts asked rulers to care for people and animals, and he built wells and rest houses.',
    mods: { aidPrestigeMult: 1.2, yieldBonus: { wood: 1 } }, rich: ['food','wood'], poor: ['stone'] },
  { id: 'kush', era: 1, name: 'Kush', emoji: '⚒️', color: '#78350F', ability: 'Nubian Metallurgy',
    abilityText: 'Mines make +1 iron, and each soldier defends a little better.',
    history: 'Meroë in Kush was famous for its iron furnaces along the Nile.',
    mods: { yieldBonus: { iron: 1 }, troopDefenseBonus: 0.5 }, rich: ['iron','gold'], poor: ['food'] },
  { id: 'athens', era: 1, name: 'Athens', emoji: '🏺', color: '#0284C7', ability: 'Maritime Agora',
    abilityText: 'Buying at the market costs 5% less, and you earn +2 gold a round from silver.',
    history: 'Athens’ agora and harbor made it a trading center, and its silver mines paid for its fleet.',
    mods: { marketDiscount: 0.05, goldPerRound: 2 }, rich: ['luxury','gold'], poor: ['food'] },
  { id: 'byzantium', era: 2, name: 'Byzantium', emoji: '🏰', color: '#7E22CE', ability: 'Theodosian Forts',
    abilityText: 'Raiders take half as much from your depots, and your soldiers defend a little better behind the walls.',
    history: 'Constantinople’s Theodosian Walls held off attackers for a thousand years, and its silk was famous.',
    mods: { depotRaidResist: 0.5, troopDefenseBonus: 0.25 }, rich: ['luxury','stone'], poor: ['food'] },
  { id: 'abbasid', era: 2, name: 'Abbasids', emoji: '🕌', color: '#047857', ability: 'House of Wisdom',
    abilityText: 'Trader intelligence costs half, you sell luxuries for 30% more, and Baghdad’s markets pay +2 gold a round.',
    history: 'Baghdad’s House of Wisdom gathered knowledge from many lands, and its markets were a spice hub.',
    mods: { intelDiscount: 0.5, luxurySellBonus: 0.3, goldPerRound: 2 }, rich: ['luxury','gold'], poor: ['wood'] },
  { id: 'song', era: 2, name: 'Song', emoji: '🏮', color: '#B91C1C', ability: 'Paper Currency & Blast Furnaces',
    abilityText: '+2 gold a round, and iron output +50%.',
    history: 'Song China printed paper money and made huge amounts of iron in its furnaces.',
    mods: { goldPerRound: 2, yieldMult: { iron: 1.5 } }, rich: ['food','iron'], poor: ['luxury'] },
  { id: 'mali', era: 2, name: 'Mali', emoji: '👑', color: '#CA8A04', ability: 'Mansa Gold Caravan',
    abilityText: '+6 gold a round, and +20% prestige from aid donations.',
    history: 'Mali’s gold crossed the Sahara by camel, and Mansa Musa was famous for his generosity.',
    mods: { goldPerRound: 6, aidPrestigeMult: 1.2 }, rich: ['gold','food'], poor: ['wood'] },
  { id: 'srivijaya', era: 2, name: 'Srivijaya', emoji: '🚢', color: '#0D9488', ability: 'Maritime Spice Lords',
    abilityText: 'Ships paying to pass the Strait of Malacca give you +2 gold a round, and you see twice as far over coasts and water.',
    history: 'Srivijaya controlled the Strait of Malacca and the spice trade between India and China.',
    mods: { goldPerRound: 2, coastVisionBonus: 2 }, rich: ['luxury','wood'], poor: ['iron'] },
  { id: 'rus', era: 2, name: 'Kievan Rus', emoji: '🌲', color: '#334155', ability: 'River Trade Portages',
    abilityText: 'Lumber camps make +1 wood, and scouts move 1 hex farther.',
    history: 'The Rus carried boats between rivers to trade furs and timber with Constantinople and Baghdad.',
    mods: { yieldBonus: { wood: 1 }, scoutMoveBonus: 1 }, rich: ['wood','luxury'], poor: ['food'] },
];
export const civById = (id: string) => CIVS.find(c => c.id === id)!;
export const civsForEra = (era: Era) => CIVS.filter(c => c.era === era);
export const ERA_NAME: Record<Era, string> = { 1: 'Era 1: Classical Age (History Unit 4)', 2: 'Era 2: Medieval Age (History Unit 5)' };
