/* Whose turn it is. Computer empires play instantly; the round resolves after the last empire. */
import type { GameState } from '../types/game';
import { beginTurn, current, resolveRound } from './engine';
import { runAiTurn } from './empireAI';

/** run computer turns until a human is up ('human') or the round is over ('round') */
export function advance(gs: GameState): 'human' | 'round' {
  while (gs.turn < gs.empires.length && !current(gs).human) {
    const e = current(gs);
    const did = runAiTurn(gs, e);
    if (did.length) gs.chronicle.push({ round: gs.round, empire: e.index, kind: 'ai', text: `${e.name} ${did.slice(0, 6).join(', ')}.` });
    gs.turn++;
    if (gs.turn < gs.empires.length) beginTurn(gs);
  }
  if (gs.turn >= gs.empires.length) { resolveRound(gs); return 'round'; }
  return 'human';
}
export function endTurn(gs: GameState): 'human' | 'round' {
  gs.turn++;
  if (gs.turn < gs.empires.length) beginTurn(gs);
  return advance(gs);
}
