/* The shared market. Prices follow supply and demand:
     sell price = base × (demand / supply)^0.7 × crisis × flood
   Selling raises supply, buying raises demand, and both drift back to normal each round. Selling a lot of one good
   at once floods the market (the price drops for about two rounds), so it pays to sell a little at a time and to
   sell what is scarce. Buying always costs more than selling (the merchant's cut). */
import type { Empire, GameState, MarketState, ResourceType } from '../types/game';
import { RESOURCES } from '../types/game';
import { civById } from '../config/civilizations';
import { PRICE_EXP, PRICE_MAX, PRICE_MIN, RES_INFO, SPREAD, TRADE_PRESTIGE_PER_GOLD, zero } from '../config/rules';
import { rand } from './hexMath';
import { addPrestige, capacity, stored } from './economy';

export function newMarket(): MarketState {
  const volume = {} as MarketState['volume'], history = {} as MarketState['history'];
  for (const r of RESOURCES) { volume[r] = [0, 0]; history[r] = [] }
  const supply = zero(), demand = zero();
  for (const r of RESOURCES) { supply[r] = 100; demand[r] = 100; }
  return { supply, demand, volume, history };
}

function flood(m: MarketState, r: ResourceType) {
  const recent = m.volume[r][0] + m.volume[r][1] * 0.5;
  return 1 / (1 + recent / 60);
}
export function sellPrice(gs: GameState, r: ResourceType): number {
  const m = gs.market;
  let p = RES_INFO[r].base * Math.pow(m.demand[r] / m.supply[r], PRICE_EXP) * flood(m, r);
  if (gs.crisis?.resource === r) p *= gs.crisis.priceMult;
  return Math.max(RES_INFO[r].base * PRICE_MIN, Math.min(RES_INFO[r].base * PRICE_MAX, p));
}
export function buyPrice(gs: GameState, r: ResourceType, e?: Empire): number {
  const disc = e ? civById(e.civId).mods.marketDiscount || 0 : 0;
  return sellPrice(gs, r) * SPREAD * (1 - disc);
}
/** what an empire is actually paid per unit (Abbasids get more for luxury) */
export function sellPriceFor(gs: GameState, r: ResourceType, e: Empire) {
  const bonus = r === 'luxury' ? civById(e.civId).mods.luxurySellBonus || 0 : 0;
  return sellPrice(gs, r) * (1 + bonus);
}

/** total for selling n units one at a time (each sale nudges the price down) */
export function quoteSell(gs: GameState, e: Empire, r: ResourceType, n: number): number {
  const sim = structuredClone(gs.market);
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += sellPriceFor({ ...gs, market: sim } as GameState, r, e);
    sim.supply[r] += 0.6; sim.volume[r][0] += 1;
  }
  return Math.floor(total);
}
export function quoteBuy(gs: GameState, e: Empire, r: ResourceType, n: number): number {
  const sim = structuredClone(gs.market);
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += buyPrice({ ...gs, market: sim } as GameState, r, e);
    sim.demand[r] += 0.6;
  }
  return Math.ceil(total);
}

export function sell(gs: GameState, e: Empire, r: ResourceType, n: number): number {
  n = Math.min(n, Math.floor(e.stock[r]));
  if (n <= 0) return 0;
  const got = quoteSell(gs, e, r, n);
  e.stock[r] -= n; e.gold += got;
  gs.market.supply[r] += 0.6 * n; gs.market.volume[r][0] += n;
  e.soldThisRound[r] = (e.soldThisRound[r] || 0) + n;
  e.stats.sold += got;
  addPrestige(e, 'trade', got * TRADE_PRESTIGE_PER_GOLD);
  return got;
}
export function buy(gs: GameState, e: Empire, r: ResourceType, n: number): number {
  if (n <= 0) return 0;
  const cost = quoteBuy(gs, e, r, n);
  if (cost > e.gold) return 0;
  e.gold -= cost; e.stock[r] += n;
  gs.market.demand[r] += 0.6 * n;
  e.stats.bought += cost;
  return cost;
}
/** the most of r an empire can afford right now */
export function maxBuy(gs: GameState, e: Empire, r: ResourceType): number {
  let n = 0;
  while (n < 200 && quoteBuy(gs, e, r, n + 1) <= e.gold) n++;
  return n;
}
/** goods above storage capacity: what spoils and what raiders grab first */
export function exposed(gs: GameState, e: Empire): number { return Math.max(0, stored(e) - capacity(gs, e)); }

/** end of round: production fed supply, people ate (demand), prices drift back toward normal */
export function marketRound(gs: GameState) {
  const m = gs.market;
  for (const r of RESOURCES) {
    m.supply[r] += (100 - m.supply[r]) * 0.25 + (rand(gs) - 0.5) * 8;
    m.demand[r] += (100 - m.demand[r]) * 0.25 + (rand(gs) - 0.5) * 8;
    if (gs.crisis?.resource === r) m.demand[r] += 6;
    m.supply[r] = Math.max(40, Math.min(260, m.supply[r]));
    m.demand[r] = Math.max(40, Math.min(260, m.demand[r]));
    m.volume[r] = [0, m.volume[r][0]];
    m.history[r].push(Math.round(sellPrice(gs, r) * 10) / 10);
    if (m.history[r].length > 12) m.history[r].shift();
  }
}
