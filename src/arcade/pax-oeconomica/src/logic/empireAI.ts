/* Computer empires. They follow the same rules and prices as players, using simple sensible habits:
   keep enough food, sell what they have too much of (more when the price is good), build camps for what they lack,
   build depots before goods spoil, defend when raiders are near, give to crises, and save for their wonder.
   Easy computers do fewer things each turn; hard ones do more and sell more cleverly. */
import type { Empire, GameState, HexTile, NodeType, ResourceType } from '../types/game';
import { key, RESOURCES } from '../types/game';
import { civById } from '../config/civilizations';
import { FESTIVAL_COST, MAX_SCOUTS, RES_INFO, TROOP_COST } from '../config/rules';
import { hexDist, reachable } from './hexMath';
import {
  build, buildCost, buildWonder, buyScout, canAfford, capacity, foodUpkeep, holdFestival, moveScout, ownedTiles, production, stored,
  train, upgrade, upgradeCost, whyCantBuild, wonderInfo, buildingsOf, scoutMoves, shortfall,
} from './economy';
import { buy, maxBuy, quoteBuy, sell, sellPrice } from './marketEngine';
import { defenseAt, dismiss, hire, whyCantHire } from './barbarianAI';
import { pledge, pledgedTotal } from './crisisEngine';
import { traderNear, traderPrices, traderReveal } from './engine';

const VALUE: Record<NodeType, number> = { food: 4, wood: 4, stone: 5, iron: 7, luxury: 9, gold: 8 };

function keepLevels(gs: GameState, e: Empire): Record<ResourceType, number> {
  const up = foodUpkeep(gs, e);
  const k: Record<ResourceType, number> = { food: up * 3 + 8, wood: 16, stone: 18, iron: 8, luxury: 6 };
  const w = wonderInfo(gs, e);
  if (w) for (const r of RESOURCES) k[r] = Math.max(k[r], w.cost[r] || 0);
  if (gs.crisis) k[gs.crisis.resource] = Math.min(k[gs.crisis.resource], 5);
  return k;
}

export function runAiTurn(gs: GameState, e: Empire): string[] {
  const did: string[] = [];
  const level = gs.difficulty === 'easy' ? 3 : 4;
  let actions = 0;
  const act = (s: string) => { did.push(s); actions++; };
  const keep = keepLevels(gs, e);

  // 1. food first
  const p = production(gs, e);
  const net = p.food - foodUpkeep(gs, e);
  if (e.stock.food + net < foodUpkeep(gs, e) + 2) {
    const n = Math.min(maxBuy(gs, e, 'food'), foodUpkeep(gs, e) * 2 + 4 - Math.floor(e.stock.food));
    if (n > 0) { buy(gs, e, 'food', n); did.push(`bought ${n} food`); }
  }
  // 2. crisis aid with what they can spare
  if (gs.crisis) {
    const r = gs.crisis.resource;
    const spare = Math.floor(e.stock[r] - (r === 'food' ? foodUpkeep(gs, e) * 2 : 4));
    const left = gs.crisis.need - pledgedTotal(gs);
    const give = Math.min(spare, left, gs.difficulty === 'easy' ? 8 : 20);
    if (give > 0 && !pledge(gs, e, give)) did.push(`gave ${give} ${r} for ${gs.crisis.name}`);
  }
  // 3. defense when raiders are near and stronger than the defense
  const threats = gs.barbarians.filter(c => c.status !== 'mercenary' && buildingsOf(gs, e.index).some(t => hexDist(c.home, t) <= 5));
  if (threats.length && actions < level) {
    const strongest = Math.max(...threats.map(c => c.strength));
    const weak = buildingsOf(gs, e.index).filter(t => hexDist(t, threats[0].home) <= 5 || t.building!.type === 'depot')
      .sort((a, b) => defenseAt(gs, e, a).total - defenseAt(gs, e, b).total);
    if (!buildingsOf(gs, e.index, 'barracks').length && e.raidedRound > 0 && gs.round - e.raidedRound < 4) {
      const spot = ownedTiles(gs, e.index).find(t => !t.building && t.biome !== 'water' && !t.barbCamp);
      if (spot && !build(gs, e, spot, 'barracks')) act('built a barracks');
    }
    for (const t of weak.slice(0, 2)) {
      while (defenseAt(gs, e, t).total <= strongest && canAfford(e, TROOP_COST) && e.stock.food > foodUpkeep(gs, e) * 2 + 6 && actions < level + 2) {
        if (train(gs, e, t)) break; act('trained a soldier');
      }
    }
    // hire a clan if raided recently and rich
    if (e.raidedRound && gs.round - e.raidedRound <= 2 && e.gold > 80 && !gs.barbarians.some(c => c.employer === e.index)) {
      const c = gs.barbarians.filter(c => !whyCantHire(gs, e, c)).sort((a, b) => b.strength - a.strength)[0];
      if (c && !hire(gs, e, c)) act(`hired the ${c.name}`);
    }
  }
  for (const c of gs.barbarians) if (c.employer === e.index && e.gold < 20 && c.unrest >= 40) { dismiss(gs, e, c); did.push(`let the ${c.name} go`); }

  // 4. sell surplus: always what's spoiling, plus extra when the price is good
  const exposedNow = () => Math.max(0, stored(e) - capacity(gs, e));
  for (const r of RESOURCES.slice().sort((a, b) => sellPrice(gs, b) / RES_INFO[b].base - sellPrice(gs, a) / RES_INFO[a].base)) {
    const surplus = Math.floor(e.stock[r] - keep[r]);
    if (surplus <= 0) continue;
    const good = sellPrice(gs, r) >= RES_INFO[r].base * 0.85;
    const n = Math.min(surplus, good ? surplus : exposedNow(), 25);
    if (n > 0) { const got = sell(gs, e, r, n); if (got) did.push(`sold ${n} ${r} for ${got} gold`); }
  }

  // 5. wonder (buy the missing pieces if rich enough)
  const w = wonderInfo(gs, e);
  if (w && actions < level) {
    const miss = shortfall(e, w.cost);
    const missCost = RESOURCES.reduce((a, r) => a + (miss[r] ? quoteBuy(gs, e, r, miss[r]!) : 0), 0);
    if (missCost + 25 <= e.gold) {
      for (const r of RESOURCES) if (miss[r]) buy(gs, e, r, miss[r]!);
      if (!buildWonder(gs, e)) act(`built the ${w.name}`);
    }
  }
  // 6. a depot before goods spoil
  if (stored(e) + p.food + p.wood + p.stone + p.iron + p.luxury > capacity(gs, e) * 0.9 && actions < level) {
    const spot = ownedTiles(gs, e.index).filter(t => !t.building && t.biome !== 'water' && !t.node).sort((a, b) => hexDist(a, e.capital) - hexDist(b, e.capital))[0]
      || ownedTiles(gs, e.index).find(t => !t.building && t.biome !== 'water');
    if (spot) {
      const c = buildCost(e, 'depot');
      for (const r of RESOURCES) { const lack = (c[r] || 0) - e.stock[r]; if (lack > 0 && quoteBuy(gs, e, r, lack) < e.gold - 15) buy(gs, e, r, lack); }
      if (!build(gs, e, spot, 'depot')) act('built a depot');
    }
  }
  // 7. camps on the most useful nodes; upgrades; outposts toward more nodes
  for (let tries = 0; tries < 4 && actions < level; tries++) {
    const have = new Set(buildingsOf(gs, e.index, 'camp').map(t => t.node));
    const options = [...gs.tiles.values()].filter(t => t.node && !t.building && e.seen.has(key(t.q, t.r)) && !whyCantBuildIgnoringCost(gs, e, t, 'camp'));
    if (!options.length) break;
    const score = (t: HexTile) => VALUE[t.node!] * (have.has(t.node) ? 1 : 2.2) * (civById(e.civId).rich.includes(t.node!) ? 1.2 : 1) - hexDist(t, e.capital);
    options.sort((a, b) => score(b) - score(a));
    const t = options[0];
    if (!canAfford(e, buildCost(e, 'camp'))) {
      const lack = (buildCost(e, 'camp').wood || 0) - e.stock.wood;
      if (lack > 0 && quoteBuy(gs, e, 'wood', lack) + 4 < e.gold - 10) buy(gs, e, 'wood', lack); else break;
    }
    if (!build(gs, e, t, 'camp')) act(`built a camp for ${t.node}`); else break;
  }
  if (actions < level) {
    const camps = buildingsOf(gs, e.index, 'camp').filter(t => upgradeCost(t)).sort((a, b) => VALUE[b.node!] - VALUE[a.node!]);
    for (const t of camps.slice(0, 2)) if (actions < level && canAfford(e, upgradeCost(t)!) && !upgrade(gs, e, t)) act(`upgraded a ${t.node} camp`);
  }
  if (actions < level && gs.round % 3 === 1) {
    // an outpost on unclaimed land with the most free nodes around it
    const cands = [...gs.tiles.values()].filter(t => t.owner === null && e.seen.has(key(t.q, t.r)) && !whyCantBuildIgnoringCost(gs, e, t, 'outpost'));
    const nodesNear = (t: HexTile) => [...gs.tiles.values()].filter(x => x.node && x.owner === null && !x.building && hexDist(x, t) <= 1).length;
    cands.sort((a, b) => nodesNear(b) - nodesNear(a));
    if (cands[0] && nodesNear(cands[0]) >= 2 && canAfford(e, buildCost(e, 'outpost')) && !build(gs, e, cands[0], 'outpost')) act('built an outpost');
  }
  // 8. festival with spare luxury and food
  if (e.festivalRound !== gs.round) {
    const rich = e.gold > (w ? 400 : 150) && gs.difficulty !== 'easy';
    if (rich) for (const r of ['luxury', 'food'] as ResourceType[]) {
      const lack = (FESTIVAL_COST[r] || 0) + (r === 'food' ? foodUpkeep(gs, e) : 0) - e.stock[r];
      if (lack > 0) buy(gs, e, r, Math.ceil(lack));
    }
    if (e.stock.luxury >= (FESTIVAL_COST.luxury || 0) + (rich ? 0 : keep.luxury) && e.stock.food >= (FESTIVAL_COST.food || 0) + (rich ? foodUpkeep(gs, e) : keep.food) && !holdFestival(gs, e)) did.push('held a festival');
  }
  // 9. scouts explore; buy a second scout early
  if (e.scouts.length < Math.min(2, MAX_SCOUTS) && gs.round >= 2 && e.gold > 60 && e.stock.food > 25 && !buyScout(gs, e)) did.push('trained a scout');
  for (const s of e.scouts) {
    if (s.moved) continue;
    const reach = reachable(gs, s, scoutMoves(e));
    let best: string | null = null, bestScore = -1;
    const hint = e.hints[0];
    for (const [k] of reach) {
      const [q, r] = k.split(',').map(Number);
      let sc = 0;
      if (hint) sc = 40 - hexDist({ q, r }, hint) * 5;
      else for (const h of [{ q, r }]) { let unseen = 0; for (const t of gs.tiles.values()) if (hexDist(t, h) <= 2 && !e.seen.has(key(t.q, t.r))) unseen++; sc = unseen; }
      const t = gs.tiles.get(k)!;
      if (t.waystone && !e.hints.some(x => x.q === t.waystone!.target.q && x.r === t.waystone!.target.r)) sc += 30;
      if (t.ruin && t.ruin.claimedBy === null) sc += 50;
      if (sc > bestScore) { bestScore = sc; best = k; }
    }
    if (best) { const [q, r] = best.split(',').map(Number); moveScout(gs, e, s.id, q, r); }
  }
  // 10. the trader's map, now and then
  if (traderNear(gs, e) && e.gold > 70 + traderPrices(e).reveal && gs.round % 2 === 0) { const m = traderReveal(gs, e); if (m.startsWith('The trader')) did.push('bought a map from the trader'); }
  // 11. hard computers bank extra goods as gold when prices are high
  return did;
}
function whyCantBuildIgnoringCost(gs: GameState, e: Empire, t: HexTile, type: 'camp' | 'outpost') {
  const why = whyCantBuild(gs, e, t, type);
  return why && !why.startsWith('You need') ? why : null;
}
