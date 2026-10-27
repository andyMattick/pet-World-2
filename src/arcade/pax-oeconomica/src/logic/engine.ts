/* The turn loop: new game, each empire's turn (hotseat humans, instant AI), and the end-of-round resolution
   (production, food, spoilage, barbarians, crises, market, trader, victory). */
import type { ChronicleEntry, Empire, Era, GameState, HexTile, SlotConfig } from '../types/game';
import { key, RESOURCES } from '../types/game';
import { civById } from '../config/civilizations';
import { BARBARIAN_NAMES } from '../config/eraContent';
import {
  BARB_START_STRENGTH, FAMINE_PRESTIGE, LAND_PRESTIGE_PER, PRESTIGE_TARGET, RES_INFO, SPOIL_RATE, START, TRADER_INTEL, TRADER_REVEAL,
  TRADER_RUMOR, zero,
} from '../config/rules';
import { hexDist, neighbors, rand, randInt, within } from './hexMath';
import { generateMap } from './mapGenerator';
import { marketRound, newMarket, sellPrice } from './marketEngine';
import { barbarianRound } from './barbarianAI';
import { crisisRound } from './crisisEngine';
import { addPrestige, capacity, foodUpkeep, maxHpFor, ownedTiles, production, stored, tileAt, updateVision } from './economy';

export interface NewGameOptions { era: Era; slots: SlotConfig[]; radius: number; maxRounds: number; difficulty: GameState['difficulty']; seed?: number }

export function newGame(o: NewGameOptions): GameState {
  const gs: GameState = {
    era: o.era, round: 1, maxRounds: o.maxRounds, radius: o.radius, seed: o.seed ?? Math.floor(Math.random() * 1e9),
    tiles: new Map(), empires: [], barbarians: [], market: newMarket(), crisis: null, crisisLeft: 0, nextCrisis: null,
    trader: { q: 0, r: 0, visiting: 0 }, turn: 0, chronicle: [], roundReport: [], nextId: 1, rng: 0,
    target: PRESTIGE_TARGET, difficulty: o.difficulty, winner: null, over: false,
  };
  gs.rng = gs.seed;
  const { capitals, camps } = generateMap(gs, o.slots.map(s => s.civId), o.era);
  gs.empires = o.slots.map((s, i): Empire => {
    const civ = civById(s.civId);
    return {
      index: i, civId: s.civId, name: s.name || civ.name, human: s.human, color: civ.color, alive: true,
      gold: START.gold, stock: { ...START.stock }, prestige: 0, capital: capitals[i],
      scouts: [{ id: gs.nextId++, q: capitals[i].q, r: capitals[i].r, moved: false }],
      seen: new Set(), visible: new Set(), hints: [], intel: {}, prestigeLog: {}, pledged: zero(), soldThisRound: {},
      wonder: 0, festivalRound: 0, famine: 0, raidedRound: 0,
      stats: { sold: 0, bought: 0, repelled: 0, raided: 0, aid: 0, spoiled: 0 },
    };
  });
  for (const e of gs.empires) {
    const cap = tileAt(gs, e.capital.q, e.capital.r)!;
    const hp = maxHpFor(e, 'capital');
    cap.building = { type: 'capital', level: 1, hp, maxHp: hp };
    cap.troops = 1;
  }
  const names = BARBARIAN_NAMES[o.era];
  gs.barbarians = camps.map((t, i) => ({
    id: gs.nextId++, name: names[i % names.length], strength: randInt(gs, BARB_START_STRENGTH[0], BARB_START_STRENGTH[1]),
    q: t.q, r: t.r, home: { q: t.q, r: t.r }, status: 'wild' as const, employer: null, loyalty: 100, unrest: 0,
    target: null, bribedAgainst: null, station: null, cooldown: 0, formerEmployer: null,
  }));
  // the trader starts on land near the middle
  const land = [...gs.tiles.values()].filter(t => t.biome !== 'water').sort((a, b) => hexDist(a, { q: 0, r: 0 }) - hexDist(b, { q: 0, r: 0 }));
  gs.trader = { q: land[0].q, r: land[0].r, visiting: 0 };
  for (const r of RESOURCES) gs.market.history[r].push(Math.round(sellPrice(gs, r) * 10) / 10);
  for (const e of gs.empires) updateVision(gs, e);
  gs.chronicle.push({ round: 1, kind: 'event', text: `Round 1 begins. ${gs.empires.length} empires are ready to trade.` });
  return gs;
}

/** turn order rotates each round, so nobody always goes first (first pick of prices and crisis aid) */
export const turnOrder = (gs: GameState) => gs.empires.map((_, k) => gs.empires[(k + gs.round - 1) % gs.empires.length]);
export const current = (gs: GameState) => turnOrder(gs)[gs.turn];

export function beginTurn(gs: GameState) {
  const e = current(gs);
  e.scouts.forEach(s => (s.moved = false));
  e.soldThisRound = {};
  updateVision(gs, e);
}

/* ---------- the trader ---------- */
export function traderNear(gs: GameState, e: Empire) {
  const t = gs.trader;
  return within(t, 1).some(h => tileAt(gs, h.q, h.r)?.owner === e.index) || e.scouts.some(s => hexDist(s, t) <= 1);
}
const intelCost = (e: Empire, base: number) => Math.round(base * (1 - (civById(e.civId).mods.intelDiscount || 0)));
export const traderPrices = (e: Empire) => ({ reveal: intelCost(e, TRADER_REVEAL), intel: intelCost(e, TRADER_INTEL), rumor: intelCost(e, TRADER_RUMOR) });

export function traderReveal(gs: GameState, e: Empire): string {
  if (!traderNear(gs, e)) return 'The trader isn’t close enough.';
  const cost = traderPrices(e).reveal; if (e.gold < cost) return `You need ${cost} 🪙.`;
  // the trader's map shows the nearest unexplored place worth knowing about
  const unseen = [...gs.tiles.values()].filter(t => !e.seen.has(key(t.q, t.r)) && t.biome !== 'water');
  if (!unseen.length) return 'You have explored everything.';
  const worth = (t: HexTile) => (t.node ? 3 : 0) + (t.ruin ? 4 : 0) + (t.waystone ? 3 : 0) + (t.barbCamp ? 2 : 0);
  unseen.sort((a, b) => (worth(b) * 3 - hexDist(b, e.capital)) - (worth(a) * 3 - hexDist(a, e.capital)));
  const c = unseen[0];
  e.gold -= cost;
  for (const h of within(c, 1)) if (gs.tiles.has(key(h.q, h.r))) e.seen.add(key(h.q, h.r));
  return `The trader’s map shows 7 new hexes around (${c.q}, ${c.r}).`;
}
export function traderIntel(gs: GameState, e: Empire, rival: number): string {
  if (!traderNear(gs, e)) return 'The trader isn’t close enough.';
  const cost = traderPrices(e).intel; if (e.gold < cost) return `You need ${cost} 🪙.`;
  const r = gs.empires[rival]; if (!r || rival === e.index) return 'Pick a rival.';
  e.gold -= cost; e.intel[rival] = gs.round;
  for (const h of within(r.capital, 2)) if (gs.tiles.has(key(h.q, h.r))) e.seen.add(key(h.q, h.r));
  return `The trader tells you all about ${r.name}: their capital is on your map, and you can see their storehouses this round.`;
}
export function traderRumor(gs: GameState, e: Empire): string {
  if (!traderNear(gs, e)) return 'The trader isn’t close enough.';
  const cost = traderPrices(e).rumor; if (e.gold < cost) return `You need ${cost} 🪙.`;
  e.gold -= cost;
  if (gs.nextCrisis) return `The trader whispers: “Trouble is coming. Soon everyone will need ${RES_INFO[gs.nextCrisis.resource].name.toLowerCase()}.” Store some now, while it is cheap!`;
  return 'The trader says: “The roads are calm. I’ve heard of no trouble coming.”';
}
export const hasIntel = (gs: GameState, e: Empire, rival: number) => (e.intel[rival] ?? -9) >= gs.round - 1;

function moveTrader(gs: GameState) {
  const alive = gs.empires.filter(e => e.alive);
  const target = alive[gs.trader.visiting % alive.length];
  for (let step = 0; step < 3; step++) {
    const opts = neighbors(gs.trader).map(h => tileAt(gs, h.q, h.r)).filter((t): t is HexTile => !!t && t.biome !== 'water');
    if (!opts.length) break;
    opts.sort((a, b) => hexDist(a, target.capital) - hexDist(b, target.capital) + (rand(gs) - 0.5) * 1.5);
    gs.trader.q = opts[0].q; gs.trader.r = opts[0].r;
  }
  if (hexDist(gs.trader, target.capital) <= 2) gs.trader.visiting = (gs.trader.visiting + 1) % alive.length;
}

/* ---------- end of round ---------- */
export function resolveRound(gs: GameState): ChronicleEntry[] {
  const report: ChronicleEntry[] = [];
  const say = (text: string, empire?: number, kind: ChronicleEntry['kind'] = 'event') => report.push({ round: gs.round, text, empire, kind });
  for (const e of gs.empires) {
    const p = production(gs, e);
    for (const r of RESOURCES) e.stock[r] += p[r];
    e.gold += p.gold;
    const made = RESOURCES.filter(r => p[r]).map(r => `${p[r]} ${RES_INFO[r].emoji}`).concat(p.gold ? [`${p.gold} 🪙`] : []).join(', ');
    say(`${e.name} produced ${made || 'nothing'}.`, e.index, 'market');
    // food
    const need = foodUpkeep(gs, e);
    if (e.stock.food >= need) { e.stock.food -= need; e.famine = 0; }
    else {
      e.stock.food = 0; e.famine++;
      addPrestige(e, 'famine', -FAMINE_PRESTIGE);
      const t = ownedTiles(gs, e.index).find(x => x.troops > 0);
      if (t) t.troops--;
      say(`${e.name} ran out of food (needed ${need} 🌾). Hungry people: −${FAMINE_PRESTIGE} prestige${t ? ' and a soldier left' : ''}.`, e.index, 'event');
    }
    // spoilage of goods stored outside
    const over = stored(e) - capacity(gs, e);
    if (over > 0) {
      const lose = Math.max(1, Math.round(over * SPOIL_RATE));
      let left = lose;
      for (const r of RESOURCES.slice().sort((a, b) => e.stock[b] - e.stock[a])) {
        const n = Math.min(left, Math.ceil(lose * e.stock[r] / stored(e)), Math.floor(e.stock[r]));
        e.stock[r] -= n; left -= n; if (left <= 0) break;
      }
      e.stats.spoiled += lose - left;
      say(`${e.name} had ${Math.round(over)} goods with no room in storage, and ${lose - left} spoiled. (Build a depot or sell extra goods.)`, e.index, 'event');
    }
  }
  for (const x of barbarianRound(gs)) say(x.text, x.empire, x.kind);
  for (const line of crisisRound(gs)) say(line, undefined, 'event');
  for (const e of gs.empires) {
    const land = ownedTiles(gs, e.index).length;
    addPrestige(e, 'land', Math.floor(land / LAND_PRESTIGE_PER));
    for (const t of ownedTiles(gs, e.index)) if (t.building && t.building.hp < t.building.maxHp) t.building.hp++;
  }
  marketRound(gs);
  moveTrader(gs);
  for (const e of gs.empires) { e.prestige = Math.round(e.prestige * 10) / 10; e.gold = Math.floor(e.gold); for (const r of RESOURCES) e.stock[r] = Math.max(0, Math.floor(e.stock[r])); }
  const top = ranking(gs)[0];
  if (top.prestige >= gs.target || gs.round >= gs.maxRounds) {
    gs.over = true; gs.winner = top.index;
    say(top.prestige >= gs.target ? `${top.name} reached ${gs.target} prestige and wins!` : `The last round is over. ${top.name} has the most prestige and wins!`, top.index, 'event');
  }
  gs.roundReport = report;
  gs.chronicle.push(...report.filter(r => r.kind !== 'market'));
  if (gs.chronicle.length > 300) gs.chronicle.splice(0, gs.chronicle.length - 300);
  if (!gs.over) { gs.round++; gs.turn = 0; for (const e of gs.empires) updateVision(gs, e); beginTurn(gs); }
  return report;
}

export const ranking = (gs: GameState) => gs.empires.slice().sort((a, b) => b.prestige - a.prestige);
/** Pet World stars: 3 for first place, 2 for second, 1 for finishing */
export function starsFor(gs: GameState) {
  const r = ranking(gs);
  const best = Math.min(...gs.empires.filter(e => e.human).map(e => r.indexOf(e)));
  return { rank: best + 1, stars: best === 0 ? 3 : best === 1 ? 2 : 1, prestige: Math.round(r[best]?.prestige || 0) };
}

/* ---------- saving ---------- */
export function serialize(gs: GameState): string {
  return JSON.stringify({
    ...gs, tiles: [...gs.tiles.values()],
    empires: gs.empires.map(e => ({ ...e, seen: [...e.seen], visible: [...e.visible] })),
  });
}
export function deserialize(s: string): GameState {
  const o = JSON.parse(s);
  o.tiles = new Map((o.tiles as HexTile[]).map(t => [key(t.q, t.r), t]));
  o.empires = o.empires.map((e: Empire & { seen: string[]; visible: string[] }) => ({ ...e, seen: new Set(e.seen), visible: new Set(e.visible) }));
  return o as GameState;
}
