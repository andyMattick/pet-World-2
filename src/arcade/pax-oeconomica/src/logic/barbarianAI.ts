/* Barbarian clans: wild clans raid, hired clans (mercenaries) defend their employer, unpaid mercenaries grow restless
   and revolt, and a clan can be bribed to raid a rival. Spec numbers live in config/rules.ts. */
import type { BarbarianClan, Empire, GameState, HexTile } from '../types/game';
import { civById } from '../config/civilizations';
import {
  BARB_GROWTH_EVERY, BARB_MAX, BRIBE_FOOD, BRIBE_GOLD, DEFENSE_PRESTIGE, HIRE_COST, PAYROLL, RAID_CHANCE, RAID_PRIORITY, RAID_RANGE,
  REVOLT_AT, UNREST_MISSED, UNREST_PAID_DROP,
} from '../config/rules';
import { RESOURCES } from '../types/game';
import { hexDist, rand } from './hexMath';
import { addPrestige, buildingsOf, capacity, isVisible, stored } from './economy';

export const hireCost = (e: Empire) => Math.round(HIRE_COST * (civById(e.civId).mods.hireCostMult || 1));
export const clanKnown = (e: Empire, c: BarbarianClan) => isVisible(e, c) || e.seen.has(`${c.home.q},${c.home.r}`);

export function whyCantHire(gs: GameState, e: Empire, c: BarbarianClan): string | null {
  if (!clanKnown(e, c)) return 'You haven’t found this clan’s camp yet.';
  if (c.status === 'rebel') return 'This clan is in revolt.';
  if (c.status === 'mercenary') return c.employer === e.index ? 'Already working for you.' : `Already working for ${gs.empires[c.employer!].name}.`;
  if (c.cooldown > 0 && c.formerEmployer === e.index) return 'This clan won’t work for you again yet.';
  if (e.gold < hireCost(e)) return `You need ${hireCost(e)} 🪙.`;
  return null;
}
export function hire(gs: GameState, e: Empire, c: BarbarianClan): string | null {
  const why = whyCantHire(gs, e, c); if (why) return why;
  e.gold -= hireCost(e);
  c.status = 'mercenary'; c.employer = e.index; c.unrest = 0; c.loyalty = 100; c.bribedAgainst = null;
  c.station = { ...e.capital };
  gs.chronicle.push({ round: gs.round, empire: e.index, kind: 'event', text: `${e.name} hired the ${c.name}.` });
  return null;
}
export function dismiss(gs: GameState, e: Empire, c: BarbarianClan) {
  if (c.employer !== e.index) return;
  c.status = 'wild'; c.employer = null; c.station = null; c.cooldown = 2; c.formerEmployer = e.index; c.unrest = 0;
}
export function whyCantBribe(gs: GameState, e: Empire, c: BarbarianClan, rival: number, payWith: 'gold' | 'food'): string | null {
  if (!clanKnown(e, c)) return 'You haven’t found this clan’s camp yet.';
  if (c.status !== 'wild') return 'Only free (wild) clans take bribes.';
  if (c.bribedAgainst !== null) return 'Someone already bribed this clan this round.';
  if (rival === e.index || !gs.empires[rival]?.alive) return 'Pick a rival.';
  if (payWith === 'gold' && e.gold < BRIBE_GOLD) return `You need ${BRIBE_GOLD} 🪙.`;
  if (payWith === 'food' && e.stock.food < BRIBE_FOOD) return `You need ${BRIBE_FOOD} 🌾.`;
  return null;
}
export function bribe(gs: GameState, e: Empire, c: BarbarianClan, rival: number, payWith: 'gold' | 'food'): string | null {
  const why = whyCantBribe(gs, e, c, rival, payWith); if (why) return why;
  if (payWith === 'gold') e.gold -= BRIBE_GOLD; else e.stock.food -= BRIBE_FOOD;
  c.bribedAgainst = rival; c.formerEmployer = null;
  return null;
}

/** the building a clan goes after: depots first, then outposts, camps, barracks; the capital only if nothing else */
function pickTarget(gs: GameState, c: BarbarianClan, victim: number, onlyDepots = false, range = RAID_RANGE): HexTile | null {
  let best: HexTile | null = null, bestScore = -1e9;
  for (const t of buildingsOf(gs, victim)) {
    const d = hexDist(c.home, t);
    if (d > range) continue;
    if (onlyDepots && t.building!.type !== 'depot') continue;
    const score = RAID_PRIORITY[t.building!.type] * 100 - d * 10 - t.troops * 15;
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best;
}

export function defenseAt(gs: GameState, victim: Empire, t: HexTile) {
  const mods = civById(victim.civId).mods;
  const troops = t.troops * (1 + (mods.troopDefenseBonus || 0));
  const walls = t.building ? Math.floor(t.building.hp / 3) : 0;
  const mercs = gs.barbarians.filter(b => b.status === 'mercenary' && b.employer === victim.index).reduce((a, b) => a + b.strength, 0);
  return { troops, walls, mercs, total: troops + walls + mercs };
}

/** one raid. Returns a sentence for the round report. */
export function raid(gs: GameState, c: BarbarianClan, t: HexTile, why: string): string {
  const victim = gs.empires[t.owner!];
  const strength = c.strength + (c.status === 'rebel' ? 2 : 0);
  const def = defenseAt(gs, victim, t);
  const bname = t.building!.type === 'capital' ? 'capital' : t.building!.type;
  victim.raidedRound = gs.round;
  c.cooldown = 2;
  if (def.total > strength) {
    if (t.troops > 0) t.troops--;
    c.strength = Math.max(2, c.strength - 1);
    addPrestige(victim, 'defense', DEFENSE_PRESTIGE);
    victim.stats.repelled++;
    return `${why} The ${c.name} (strength ${strength}) attacked ${victim.name}’s ${bname}, but the defense (${def.total.toFixed(0)}) drove them off! (+${DEFENSE_PRESTIGE} prestige)`;
  }
  const resist = civById(victim.civId).mods.depotRaidResist || 0;
  const partial = def.total > 0;
  // exposed goods (above storage) go first, then some of what is in storage
  const exposedGoods = Math.max(0, stored(victim) - capacity(gs, victim));
  let toTake = Math.round((partial ? 0.5 : 1) * exposedGoods + (partial ? 20 : 40) * (t.building!.type === 'depot' ? 1 - resist : 1) * (t.building!.type === 'depot' || t.building!.type === 'capital' ? 1 : 0.5));
  toTake = Math.min(toTake, Math.floor(stored(victim)));
  const taken: string[] = [];
  let left = toTake;
  // take from the largest piles first
  while (left > 0) {
    const r = RESOURCES.slice().sort((a, b) => victim.stock[b] - victim.stock[a])[0];
    if (victim.stock[r] < 1) break;
    const n = Math.min(left, Math.max(1, Math.floor(victim.stock[r] / 3)));
    victim.stock[r] -= n; left -= n;
    taken.push(`${n} ${r}`);
  }
  const goldTaken = Math.floor(victim.gold * (partial ? 0.05 : 0.1));
  victim.gold -= goldTaken;
  const b = t.building!;
  let damage: string;
  if (partial) { b.hp = Math.max(0, Math.floor(b.hp / 2)); damage = 'damaged it'; }
  else if (b.type === 'capital') { b.hp = 0; damage = 'smashed the city walls'; }
  else if (b.level > 1) { b.level--; b.hp = Math.floor(b.maxHp / 2); damage = 'knocked it down a level'; }
  else { t.building = null; damage = 'burned it to the ground'; if (t.troops) t.troops = 0; }
  victim.stats.raided++;
  c.strength = Math.min(BARB_MAX, c.strength + (partial ? 0 : 1));
  const loot = toTake - left;
  return `${why} The ${c.name} (strength ${strength}) raided ${victim.name}’s ${bname}: defense ${def.total.toFixed(0)} wasn’t enough. They took ${loot} goods${goldTaken ? ` and ${goldTaken} gold` : ''} and ${damage}.`;
}

/** everything barbarians do at the end of a round; returns report lines */
export function barbarianRound(gs: GameState): { text: string; empire?: number; kind: 'raid' | 'mutiny' | 'event' }[] {
  const out: { text: string; empire?: number; kind: 'raid' | 'mutiny' | 'event' }[] = [];
  const raidChance = RAID_CHANCE * (gs.difficulty === 'easy' ? 0.6 : 1);
  for (const c of gs.barbarians) {
    if (gs.round % BARB_GROWTH_EVERY === 0 && c.strength < BARB_MAX && c.status !== 'mercenary') c.strength++;
    // payroll
    if (c.status === 'mercenary' && c.employer !== null) {
      const e = gs.empires[c.employer];
      if (e.gold >= PAYROLL) { e.gold -= PAYROLL; c.unrest = Math.max(0, c.unrest - UNREST_PAID_DROP); }
      else {
        c.unrest += UNREST_MISSED;
        out.push({ empire: e.index, kind: 'mutiny', text: `${e.name} couldn’t pay the ${c.name} (${PAYROLL} 🪙). Their unrest is now ${c.unrest}/${REVOLT_AT}.` });
        if (c.unrest >= REVOLT_AT) {
          c.status = 'rebel'; c.formerEmployer = e.index; c.employer = null; c.station = null;
          out.push({ empire: e.index, kind: 'mutiny', text: `The ${c.name} revolted against ${e.name}!` });
        }
      }
      c.loyalty = 100 - c.unrest;
    }
    if (c.cooldown > 0) c.cooldown--;
  }
  for (const c of gs.barbarians) {
    if (c.status === 'mercenary') continue;
    let t: HexTile | null = null, why = '';
    if (c.status === 'rebel' && c.formerEmployer !== null) {
      // rebels go for their old employer's nearest depot, wherever it is
      t = pickTarget(gs, c, c.formerEmployer, true, 99) || pickTarget(gs, c, c.formerEmployer, false, 99);
      why = 'Revolt!';
      c.status = 'wild'; c.cooldown = 3; c.unrest = 0;
    } else if (c.bribedAgainst !== null) {
      t = pickTarget(gs, c, c.bribedAgainst, false, 99);
      why = 'A bribe was paid.';
      c.bribedAgainst = null;
    } else if (c.cooldown === 0 && gs.round > 2 && rand(gs) < raidChance) {
      // a wild clan goes for the nearest empire within reach
      const victims = gs.empires.filter(e => e.alive).map(e => ({ e, t: pickTarget(gs, c, e.index) })).filter(x => x.t);
      victims.sort((a, b) => hexDist(c.home, a.t!) - hexDist(c.home, b.t!));
      if (victims.length) { t = victims[0].t; why = 'Raiders!'; }
    }
    if (t && t.owner !== null) {
      const text = raid(gs, c, t, why);
      out.push({ empire: t.owner ?? undefined, kind: 'raid', text });
      c.q = t.q; c.r = t.r;
    } else { c.q = c.home.q; c.r = c.home.r; }
  }
  return out;
}
