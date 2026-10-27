/* Crises: a disaster somewhere pushes one good's price up for two rounds and asks every empire for aid. Giving earns
   prestige (more for Maurya and Mali); if together the empires meet the need, every donor gets a bonus and the top
   donor gets more. The next crisis is decided a round early so the trader can sell it as a rumor. */
import type { Empire, GameState, ResourceType } from '../types/game';
import { civById } from '../config/civilizations';
import { CRISES } from '../config/eraContent';
import { AID_BONUS_ALL, AID_BONUS_TOP, RES_INFO, zero } from '../config/rules';
import { pick, rand } from './hexMath';
import { addPrestige } from './economy';

export const CRISIS_ROUNDS = 2;
export const pledgedTotal = (gs: GameState) => gs.empires.reduce((a, e) => a + (gs.crisis ? e.pledged[gs.crisis.resource] : 0), 0);

/** no empire may give more than half the need, so later turns can still help */
export const pledgeCap = (gs: GameState) => Math.ceil((gs.crisis?.need || 0) / 2);

export function whyCantPledge(gs: GameState, e: Empire, n: number): string | null {
  if (!gs.crisis) return 'There is no crisis right now.';
  const r = gs.crisis.resource;
  if (n <= 0) return 'Pick an amount.';
  if (e.stock[r] < n) return `You only have ${Math.floor(e.stock[r])} ${RES_INFO[r].name.toLowerCase()}.`;
  if (pledgedTotal(gs) >= gs.crisis.need) return 'The need is already met.';
  if (e.pledged[r] >= pledgeCap(gs)) return `Each empire can give up to ${pledgeCap(gs)}, so everyone gets a chance to help.`;
  return null;
}
export function pledge(gs: GameState, e: Empire, n: number): string | null {
  const why = whyCantPledge(gs, e, n); if (why) return why;
  const r = gs.crisis!.resource as ResourceType;
  n = Math.min(n, gs.crisis!.need - pledgedTotal(gs), pledgeCap(gs) - e.pledged[r]);
  e.stock[r] -= n; e.pledged[r] += n;
  e.stats.aid += n;
  addPrestige(e, 'aid', n * (civById(e.civId).mods.aidPrestigeMult || 1));
  return null;
}

function rollNext(gs: GameState) {
  const list = CRISES[gs.era].filter(c => c.id !== gs.crisis?.id);
  gs.nextCrisis = rand(gs) < 0.45 ? pick(gs, list) : null;
}

/** end of round: count down the current crisis, settle it, maybe start the next one. Returns report lines. */
export function crisisRound(gs: GameState): string[] {
  const out: string[] = [];
  if (gs.crisis) {
    gs.crisisLeft--;
    if (gs.crisisLeft <= 0) {
      const c = gs.crisis, total = pledgedTotal(gs);
      const donors = gs.empires.filter(e => e.pledged[c.resource] > 0).sort((a, b) => b.pledged[c.resource] - a.pledged[c.resource]);
      if (total >= c.need && donors.length) {
        donors.forEach(e => addPrestige(e, 'aid', AID_BONUS_ALL));
        addPrestige(donors[0], 'aid', AID_BONUS_TOP);
        out.push(`${c.name} is over. The empires sent ${total} of ${c.need} needed. Every helper gets +${AID_BONUS_ALL} prestige, and ${donors[0].name} gave the most (+${AID_BONUS_TOP} more).`);
      } else {
        out.push(`${c.name} is over. Only ${total} of ${c.need} was sent, so there’s no bonus this time.`);
      }
      for (const e of gs.empires) e.pledged = zero();
      gs.crisis = null;
    }
  }
  if (!gs.crisis && gs.round >= 2) {
    if (gs.nextCrisis) {
      gs.crisis = gs.nextCrisis; gs.crisisLeft = CRISIS_ROUNDS;
      out.push(`Crisis! ${gs.crisis.name}: ${gs.crisis.text} ${RES_INFO[gs.crisis.resource].name} prices jump.`);
      gs.nextCrisis = null;
    }
    if (!gs.crisis) rollNext(gs);
  } else if (!gs.crisis) rollNext(gs);
  return out;
}
