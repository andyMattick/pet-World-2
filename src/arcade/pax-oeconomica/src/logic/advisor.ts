/* The royal advisor: a few plain tips about wise use of resources, based on the empire's situation right now. */
import type { Empire, GameState } from '../types/game';
import { RESOURCES } from '../types/game';
import { RES_INFO, WONDER_STAGES } from '../config/rules';
import { buildingsOf, capacity, foodUpkeep, production, stored } from './economy';
import { sellPrice } from './marketEngine';
import { traderNear } from './engine';
import { hexDist } from './hexMath';

export function advice(gs: GameState, e: Empire): string[] {
  const tips: string[] = [];
  const p = production(gs, e), up = foodUpkeep(gs, e), cap = capacity(gs, e), have = stored(e);
  const nextFood = e.stock.food + p.food - up;
  if (nextFood < 0) tips.push(`🌾 Food will run out at the end of this round (you make ${p.food}, your people eat ${up}). Buy food or build a farm, or people go hungry.`);
  else if (p.food < up) tips.push(`🌾 You eat more food (${up}) than you grow (${p.food}). Plan a farm, or buy food while it is cheap.`);
  const after = have + RESOURCES.reduce((a, r) => a + p[r], 0) - up;
  if (after > cap) tips.push(`📦 Next round you’ll have about ${Math.round(after)} goods but room for ${cap}. Extra goods spoil and raiders grab them first: sell some or build a depot.`);
  if (gs.crisis) tips.push(`🆘 ${gs.crisis.name}: ${RES_INFO[gs.crisis.resource].name} is worth more right now. Selling some is profitable, and giving aid earns prestige.`);
  const hot = RESOURCES.filter(r => sellPrice(gs, r) >= RES_INFO[r].base * 1.35 && e.stock[r] >= 6);
  if (hot.length) tips.push(`📈 ${hot.map(r => RES_INFO[r].name).join(' and ')} ${hot.length > 1 ? 'are' : 'is'} selling high. A good time to sell what you don’t need.`);
  const cheap = RESOURCES.filter(r => sellPrice(gs, r) <= RES_INFO[r].base * 0.75);
  if (cheap.length) tips.push(`📉 ${cheap.map(r => RES_INFO[r].name).join(' and ')} ${cheap.length > 1 ? 'are' : 'is'} cheap. A good time to buy if you need it, a bad time to sell.`);
  const near = gs.barbarians.filter(c => c.status !== 'mercenary' && buildingsOf(gs, e.index).some(t => hexDist(t, c.home) <= 5) && e.seen.has(`${c.home.q},${c.home.r}`));
  if (near.length && !buildingsOf(gs, e.index).some(t => t.troops > 0 && t.building?.type !== 'capital')) tips.push(`⚔️ The ${near[0].name} (strength ${near[0].strength}) are camped near you. Soldiers or a hired clan protect your buildings, and depots are their favorite target.`);
  if (traderNear(gs, e)) tips.push('🐫 The trader is near your land. You can buy a map, news about a rival, or a rumor about the next crisis.');
  if (e.wonder < WONDER_STAGES.length && e.gold > 150) tips.push('👑 You have lots of gold. Gold doesn’t win by itself: turn it into prestige with your wonder or a festival.');
  if (!tips.length) tips.push('✅ Your empire is in good shape. Look for a resource you lack and build a camp on it, or explore with your scout.');
  return tips.slice(0, 3);
}
