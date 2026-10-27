/* How the game was opened: inside a Pet World history unit (?from=history4 or history5, one era), from the Arcade
   (?arcadeRun=..., either era), or on its own. Results go back to Pet World with postMessage. */
import type { Era } from '../types/game';

const params = new URLSearchParams(window.location.search);
export const FROM = params.get('from');
export const ARCADE_RUN = params.get('arcadeRun');
export const LOCKED_ERA: Era | null = FROM === 'history4' ? 1 : FROM === 'history5' ? 2 : null;
export const EMBEDDED = window.parent !== window;

export function reportResult(r: { era: Era; stars: number; rank: number; prestige: number; rounds: number; empires: number; gameId: string }) {
  if (!EMBEDDED) return;
  if (ARCADE_RUN) {
    window.parent.postMessage({ type: 'arcade:round-complete', gameId: 'pax-oeconomica', runId: ARCADE_RUN, roundId: r.gameId, score: r.stars }, window.location.origin);
  } else if (FROM) {
    window.parent.postMessage({ type: 'pax:result', from: FROM, era: r.era, stars: r.stars, rank: r.rank, prestige: r.prestige, rounds: r.rounds, empires: r.empires, gameId: r.gameId }, window.location.origin);
  }
}
export function closeGame() {
  if (EMBEDDED) window.parent.postMessage({ type: 'pax:close' }, window.location.origin);
}
