/* Pax Oeconomica: data model (docs/PAX-OECONOMICA.md). */
export type ResourceType = 'food' | 'wood' | 'stone' | 'iron' | 'luxury';
export const RESOURCES: ResourceType[] = ['food', 'wood', 'stone', 'iron', 'luxury'];
export type Stock = Record<ResourceType, number>;

export type HexBiome = 'plains' | 'forest' | 'hills' | 'mountains' | 'desert' | 'water' | 'coast' | 'waystone';
/** a harvestable node on a tile: a resource, or gold from a desert oasis */
export type NodeType = ResourceType | 'gold';
export type BuildingType = 'capital' | 'camp' | 'outpost' | 'depot' | 'barracks';
export type Era = 1 | 2;
export type Visibility = 0 | 1 | 2;   // 0 unexplored, 1 fogged (terrain known), 2 visible

export interface Building { type: BuildingType; level: number; hp: number; maxHp: number }
export interface HexTile {
  q: number; r: number; biome: HexBiome;
  node: NodeType | null;      // a resource node a camp can harvest
  owner: number | null;       // empire index
  building: Building | null;
  troops: number;             // garrison stationed here (empire owner)
  barbCamp: boolean;          // a neutral barbarian encampment
  waystone: { clue: string; target: { q: number; r: number } } | null;
  ruin: { name: string; lore: string; claimedBy: number | null } | null;   // a lost site a waystone points to
}
export interface Scout { id: number; q: number; r: number; moved: boolean }
export interface Empire {
  index: number; civId: string; name: string; human: boolean; color: string;
  alive: boolean;
  gold: number; stock: Stock; prestige: number;
  capital: { q: number; r: number };
  scouts: Scout[];
  seen: Set<string>;          // explored tiles (fogged or visible)
  visible: Set<string>;       // visible this turn
  hints: { q: number; r: number; text: string }[];   // "?" markers from waystones and rumors
  intel: Record<number, number>;   // rival index -> round their capital and stockpile were last revealed
  prestigeLog: Record<string, number>;   // where prestige came from: development, aid, defense...
  pledged: Stock;             // goods pledged to this round's crisis
  soldThisRound: Partial<Record<ResourceType, number>>;
  wonder: number;             // wonder stages built (0..3)
  festivalRound: number;      // last round a festival was held (one a round)
  famine: number;             // rounds in a row without enough food
  raidedRound: number;        // last round raiders hit this empire
  stats: { sold: number; bought: number; repelled: number; raided: number; aid: number; spoiled: number };
}
export interface BarbarianClan {
  id: number; name: string; strength: number; q: number; r: number; home: { q: number; r: number };
  status: 'wild' | 'mercenary' | 'rebel';
  employer: number | null;    // empire paying it (mercenary)
  loyalty: number; unrest: number;   // 0..100
  target: { q: number; r: number; empire: number } | null;
  bribedAgainst: number | null;      // a rival it was paid to raid
  station: { q: number; r: number } | null;   // where a mercenary guards
  cooldown: number;           // rounds of rest after a raid
  formerEmployer: number | null;   // a rebel remembers who stopped paying it
}
export interface CrisisEvent {
  id: string; name: string; text: string; resource: ResourceType; need: number;
  priceMult: number;          // how much the crisis pushes that price
  supplyHit?: Partial<Record<ResourceType, number>>;   // production cut for everyone (0.5 = half)
}
export interface MarketState {
  supply: Stock; demand: Stock;      // indexes, start at 100
  volume: Record<ResourceType, number[]>;   // big sales push prices down for 2 rounds
  history: Record<ResourceType, number[]>;  // sell price each round (for the little chart)
}
export interface Trader { q: number; r: number; visiting: number }   // which empire's land the trader stands in
export type Phase = 'TITLE_MENU' | 'SETUP' | 'ACTIVE_TURN' | 'PASS_SCREEN' | 'ROUND_RESOLUTION' | 'GAME_OVER';
export interface ChronicleEntry { round: number; text: string; empire?: number; kind?: 'raid' | 'aid' | 'market' | 'ai' | 'event' | 'clue' | 'mutiny' | 'build' }
export interface SlotConfig { human: boolean; civId: string; name: string }
export interface GameState {
  era: Era; round: number; maxRounds: number; radius: number; seed: number;
  tiles: Map<string, HexTile>;
  empires: Empire[];
  barbarians: BarbarianClan[];
  market: MarketState;
  crisis: CrisisEvent | null;
  crisisLeft: number;         // rounds the crisis has left
  nextCrisis: CrisisEvent | null;   // decided a round early, so the trader's rumor can tell it
  trader: Trader;
  turn: number;               // index into empires of whose turn it is
  chronicle: ChronicleEntry[];
  roundReport: ChronicleEntry[];
  nextId: number;
  rng: number;                // seeded random state, saved with the game
  target: number;             // prestige that wins outright
  difficulty: 'easy' | 'normal' | 'hard';
  winner: number | null;
  over: boolean;
  reported?: boolean;         // the result was sent to Pet World
}
export const key = (q: number, r: number) => `${q},${r}`;
