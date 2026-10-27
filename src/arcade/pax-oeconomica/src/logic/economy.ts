/* An empire's land, storage, production, building and scouting. Every action returns null when it worked, or a short
   reason the player can read when it didn't. */
import type { BuildingType, Empire, GameState, HexTile, NodeType, Stock } from '../types/game';
import { key, RESOURCES } from '../types/game';
import { civById } from '../config/civilizations';
import {
  BASE_CAPACITY, BUILD, BUILD_RANGE, CAMP_YIELD, CAPITAL, CAPITAL_YIELD, Cost, DEPOT_CAPACITY, FESTIVAL_COST, FESTIVAL_PRESTIGE,
  FOOD_UPKEEP, MAX_LEVEL, MAX_SCOUTS, MAX_TROOPS, REPAIR_COST, RES_INFO, RUIN_GOLD, RUIN_PRESTIGE, SCOUT_COST, SCOUT_MOVES,
  SCOUT_VISION, TROOP_COST, UPGRADE_COST, UPGRADE_PRESTIGE, WONDER_NAME, WONDER_STAGES, zero,
} from '../config/rules';
import { hexDist, neighbors, reachable, within } from './hexMath';

/** easy computers produce less, hard ones more (they all play the same way) */
export const AI_YIELD = { easy: 0.75, normal: 1, hard: 1.4 };

export const stored = (e: Empire) => RESOURCES.reduce((a, r) => a + e.stock[r], 0);
export const tileAt = (gs: GameState, q: number, r: number) => gs.tiles.get(key(q, r));
export const ownedTiles = (gs: GameState, i: number) => [...gs.tiles.values()].filter(t => t.owner === i);
export const buildingsOf = (gs: GameState, i: number, type?: BuildingType) =>
  ownedTiles(gs, i).filter(t => t.building && (!type || t.building.type === type));
export const troopsOf = (gs: GameState, i: number) => ownedTiles(gs, i).reduce((a, t) => a + t.troops, 0);

export function capacity(gs: GameState, e: Empire) {
  const mult = civById(e.civId).mods.depotCapMult || 1;
  return BASE_CAPACITY + buildingsOf(gs, e.index, 'depot').reduce((a, t) => a + Math.round(DEPOT_CAPACITY * mult * (t.building!.hp > 0 ? 1 : 0.5)), 0);
}
export function addPrestige(e: Empire, source: string, amount: number) {
  e.prestige += amount;
  e.prestigeLog[source] = (e.prestigeLog[source] || 0) + amount;
}
export function canAfford(e: Empire, c: Cost) {
  if ((c.gold || 0) > e.gold) return false;
  return RESOURCES.every(r => (c[r] || 0) <= e.stock[r]);
}
export function pay(e: Empire, c: Cost) {
  e.gold -= c.gold || 0;
  for (const r of RESOURCES) e.stock[r] -= c[r] || 0;
}
/** what's missing, for the "you need" line: { wood: 3, gold: 2 } */
export function shortfall(e: Empire, c: Cost): Partial<Stock> & { gold?: number } {
  const out: Partial<Stock> & { gold?: number } = {};
  if ((c.gold || 0) > e.gold) out.gold = (c.gold || 0) - Math.floor(e.gold);
  for (const r of RESOURCES) if ((c[r] || 0) > e.stock[r]) out[r] = (c[r] || 0) - Math.floor(e.stock[r]);
  return out;
}
export function costText(c: Cost) {
  const parts = RESOURCES.filter(r => c[r]).map(r => `${c[r]} ${RES_INFO[r].emoji}`);
  if (c.gold) parts.push(`${c.gold} 🪙`);
  return parts.join(' + ') || 'free';
}
export function buildCost(e: Empire, type: Exclude<BuildingType, 'capital'>): Cost {
  const c: Cost = { ...BUILD[type].cost };
  if (type === 'outpost') {
    const m = civById(e.civId).mods.outpostCostMult || 1;
    for (const k of Object.keys(c) as (keyof Cost)[]) c[k] = Math.round((c[k] || 0) * m);
  }
  return c;
}
export function maxHpFor(e: Empire, type: BuildingType) {
  const base = type === 'capital' ? CAPITAL.hp : BUILD[type].hp;
  return base + (type === 'camp' ? 0 : civById(e.civId).mods.fortHpBonus || 0);
}

/** this round's output for one camp */
export function campYield(gs: GameState, e: Empire, t: HexTile): { res: NodeType; n: number } | null {
  if (!t.node || t.building?.type !== 'camp') return null;
  const mods = civById(e.civId).mods;
  let n = CAMP_YIELD[t.node][t.building.level] + (mods.yieldBonus?.[t.node] || 0);
  n *= mods.yieldMult?.[t.node] || 1;
  if (t.node !== 'gold') n *= gs.crisis?.supplyHit?.[t.node] ?? 1;
  if (t.building.hp < t.building.maxHp / 2) n *= 0.5;      // a badly damaged camp works at half speed
  if (!e.human) n *= AI_YIELD[gs.difficulty];             // the difficulty setting: computer empires produce less or more
  return { res: t.node, n: Math.floor(n) };
}
export function production(gs: GameState, e: Empire): Stock & { gold: number } {
  const out = { ...zero(), gold: 0 };
  for (const t of buildingsOf(gs, e.index, 'camp')) {
    const y = campYield(gs, e, t); if (!y) continue;
    if (y.res === 'gold') out.gold += y.n; else out[y.res] += y.n;
  }
  for (const r of RESOURCES) out[r] += CAPITAL_YIELD[r] || 0;
  out.gold += CAPITAL_YIELD.gold;
  const mods = civById(e.civId).mods;
  out.gold += mods.goldPerRound || 0;
  if (mods.tollPerRoute) out.gold += mods.tollPerRoute * gs.empires.filter(x => x.alive && x.index !== e.index).length;
  return out;
}
export function foodUpkeep(gs: GameState, e: Empire) {
  return FOOD_UPKEEP.capital + buildingsOf(gs, e.index, 'outpost').length * FOOD_UPKEEP.outpost + troopsOf(gs, e.index) * FOOD_UPKEEP.troop;
}

/* ---------- vision ---------- */
export function updateVision(gs: GameState, e: Empire) {
  e.visible = new Set();
  const coast = civById(e.civId).mods.coastVisionBonus || 0;
  const see = (q: number, r: number, n: number) => {
    for (const h of within({ q, r }, n + coast)) {
      const k = key(h.q, h.r); const t = gs.tiles.get(k); if (!t) continue;
      const d = hexDist(h, { q, r });
      if (d > n && !(t.biome === 'water' || t.biome === 'coast')) continue;   // Srivijaya sees farther over the sea
      e.visible.add(k); e.seen.add(k);
    }
  };
  for (const t of ownedTiles(gs, e.index)) {
    const b = t.building;
    const v = !b ? 1 : b.type === 'capital' ? CAPITAL.vision : BUILD[b.type].vision;
    see(t.q, t.r, v);
  }
  for (const s of e.scouts) see(s.q, s.r, SCOUT_VISION);
}
export const isVisible = (e: Empire, t: { q: number; r: number }) => e.visible.has(key(t.q, t.r));

/* ---------- building ---------- */
const touchesLand = (gs: GameState, e: Empire, t: HexTile) =>
  t.owner === e.index || neighbors(t).some(n => tileAt(gs, n.q, n.r)?.owner === e.index);
const nearLand = (gs: GameState, e: Empire, t: HexTile, d: number) =>
  within(t, d).some(h => tileAt(gs, h.q, h.r)?.owner === e.index);

export function whyCantBuild(gs: GameState, e: Empire, t: HexTile, type: Exclude<BuildingType, 'capital'>): string | null {
  if (!e.seen.has(key(t.q, t.r))) return 'Explore this hex first.';
  if (t.biome === 'water') return 'You can’t build on water.';
  if (t.building) return 'Something is already built here.';
  if (t.barbCamp) return 'A barbarian camp is here.';
  if (t.owner !== null && t.owner !== e.index) return `This land belongs to ${gs.empires[t.owner].name}.`;
  if (type === 'camp') {
    if (!t.node) return 'A camp needs a resource on the hex.';
    if (!touchesLand(gs, e, t)) return 'Camps must be in or next to your land.';
  } else if (type === 'outpost') {
    if (t.biome === 'mountains') return 'Too steep for an outpost.';
    if (!nearLand(gs, e, t, BUILD_RANGE)) return `Outposts must be within ${BUILD_RANGE} hexes of your land.`;
  } else {
    if (t.owner !== e.index) return 'Build this inside your own land.';
  }
  const c = buildCost(e, type);
  if (!canAfford(e, c)) return 'You need ' + costText(shortfall(e, c)) + ' more.';
  return null;
}
export function build(gs: GameState, e: Empire, t: HexTile, type: Exclude<BuildingType, 'capital'>): string | null {
  const why = whyCantBuild(gs, e, t, type); if (why) return why;
  pay(e, buildCost(e, type));
  const hp = maxHpFor(e, type);
  t.building = { type, level: 1, hp, maxHp: hp };
  t.owner = e.index;
  if (type === 'outpost') for (const h of within(t, 1)) {
    const n = tileAt(gs, h.q, h.r);
    if (n && n.owner === null && n.biome !== 'water' && !n.barbCamp) n.owner = e.index;
  }
  addPrestige(e, 'development', BUILD[type].prestige);
  updateVision(gs, e);
  return null;
}
export function upgradeCost(t: HexTile): Cost | null {
  if (!t.building || t.building.type !== 'camp' || t.building.level >= MAX_LEVEL) return null;
  return UPGRADE_COST[t.building.level + 1];
}
export function upgrade(gs: GameState, e: Empire, t: HexTile): string | null {
  const c = upgradeCost(t);
  if (!c || t.owner !== e.index) return 'This can’t be upgraded.';
  if (!canAfford(e, c)) return 'You need ' + costText(shortfall(e, c)) + ' more.';
  pay(e, c); t.building!.level++;
  addPrestige(e, 'development', UPGRADE_PRESTIGE);
  return null;
}
export function whyCantTrain(gs: GameState, e: Empire, t: HexTile): string | null {
  if (t.owner !== e.index || !t.building) return 'Soldiers guard your buildings.';
  if (t.building.type !== 'capital' && !buildingsOf(gs, e.index, 'barracks').length) return 'Build a barracks first (the capital can always train).';
  if (t.troops >= MAX_TROOPS) return `At most ${MAX_TROOPS} soldiers per hex.`;
  if (!canAfford(e, TROOP_COST)) return 'You need ' + costText(shortfall(e, TROOP_COST)) + ' more.';
  return null;
}
export function train(gs: GameState, e: Empire, t: HexTile): string | null {
  const why = whyCantTrain(gs, e, t); if (why) return why;
  pay(e, TROOP_COST); t.troops++;
  return null;
}
export function repair(gs: GameState, e: Empire, t: HexTile): string | null {
  if (t.owner !== e.index || !t.building || t.building.type === 'capital' && t.building.maxHp === 0) return 'Nothing to repair.';
  if (t.building.hp >= t.building.maxHp) return 'It isn’t damaged.';
  if (!canAfford(e, REPAIR_COST)) return 'You need ' + costText(shortfall(e, REPAIR_COST)) + ' more.';
  pay(e, REPAIR_COST); t.building.hp = t.building.maxHp;
  return null;
}

/* ---------- scouts ---------- */
export function scoutMoves(e: Empire) { return SCOUT_MOVES + (civById(e.civId).mods.scoutMoveBonus || 0); }
export function buyScout(gs: GameState, e: Empire): string | null {
  if (e.scouts.length >= MAX_SCOUTS) return `You can have ${MAX_SCOUTS} scouts.`;
  if (!canAfford(e, SCOUT_COST)) return 'You need ' + costText(shortfall(e, SCOUT_COST)) + ' more.';
  pay(e, SCOUT_COST);
  e.scouts.push({ id: gs.nextId++, q: e.capital.q, r: e.capital.r, moved: true });
  return null;
}
export interface ScoutFind { text: string; kind: 'clue' | 'ruin' }
export function moveScout(gs: GameState, e: Empire, scoutId: number, q: number, r: number): { err: string | null; finds: ScoutFind[] } {
  const s = e.scouts.find(x => x.id === scoutId);
  if (!s) return { err: 'No scout.', finds: [] };
  if (s.moved) return { err: 'This scout already moved this round.', finds: [] };
  const reach = reachable(gs, s, scoutMoves(e));
  if (!reach.has(key(q, r))) return { err: 'Too far (or across water).', finds: [] };
  s.q = q; s.r = r; s.moved = true;
  updateVision(gs, e);
  return { err: null, finds: scoutFinds(gs, e, s) };
}
/** a scout standing on a waystone reads it; one standing on a lost site claims it */
export function scoutFinds(gs: GameState, e: Empire, s: { q: number; r: number }): ScoutFind[] {
  const finds: ScoutFind[] = [];
  const t = tileAt(gs, s.q, s.r)!;
  if (t.waystone && !e.hints.some(h => h.q === t.waystone!.target.q && h.r === t.waystone!.target.r)) {
    e.hints.push({ ...t.waystone.target, text: t.waystone.clue });
    finds.push({ kind: 'clue', text: `Waystone: ${t.waystone.clue} A “?” is now on your map.` });
  }
  if (t.ruin && t.ruin.claimedBy === null) {
    t.ruin.claimedBy = e.index;
    e.gold += RUIN_GOLD; addPrestige(e, 'discovery', RUIN_PRESTIGE);
    e.hints = e.hints.filter(h => !(h.q === t.q && h.r === t.r));
    finds.push({ kind: 'ruin', text: `${t.ruin.name}: ${t.ruin.lore} (+${RUIN_GOLD} 🪙, +${RUIN_PRESTIGE} prestige)` });
  }
  return finds;
}

/* ---------- prestige projects ---------- */
export function wonderInfo(gs: GameState, e: Empire) {
  if (e.wonder >= WONDER_STAGES.length) return null;
  return { ...WONDER_STAGES[e.wonder], name: WONDER_NAME[gs.era][e.wonder], stage: e.wonder + 1 };
}
export function buildWonder(gs: GameState, e: Empire): string | null {
  const w = wonderInfo(gs, e); if (!w) return 'Your wonder is finished.';
  if (!canAfford(e, w.cost)) return 'You need ' + costText(shortfall(e, w.cost)) + ' more.';
  pay(e, w.cost); e.wonder++;
  addPrestige(e, 'wonder', w.prestige);
  gs.chronicle.push({ round: gs.round, empire: e.index, kind: 'build', text: `${e.name} completed the ${w.name} (+${w.prestige} prestige).` });
  return null;
}
export function holdFestival(gs: GameState, e: Empire): string | null {
  if (e.festivalRound === gs.round) return 'One festival a round.';
  if (!canAfford(e, FESTIVAL_COST)) return 'You need ' + costText(shortfall(e, FESTIVAL_COST)) + ' more.';
  pay(e, FESTIVAL_COST); e.festivalRound = gs.round;
  addPrestige(e, 'festivals', FESTIVAL_PRESTIGE);
  return null;
}
