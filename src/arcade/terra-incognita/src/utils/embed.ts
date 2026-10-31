/* How the game was opened: inside Pet World's History Unit 6 (?from=history6), from the Arcade (?arcadeRun=...), or on
   its own. Results go back to Pet World with postMessage (docs/TERRA-INCOGNITA.md). */
const params = new URLSearchParams(window.location.search);
export const FROM = params.get('from');
export const ARCADE_RUN = params.get('arcadeRun');
export const EMBEDDED = window.parent !== window;

export interface CharterResult {
  charterId: string;
  length: string;
  stars: number;
  regions: number;
  specimens: number;
  treaties: number;
  prestige: number;
  months: number;
}

export function reportResult(r: CharterResult) {
  if (!EMBEDDED) return;
  if (ARCADE_RUN) {
    window.parent.postMessage({ type: 'arcade:round-complete', gameId: 'terra-incognita', runId: ARCADE_RUN, roundId: r.charterId, score: r.stars }, window.location.origin);
  } else if (FROM) {
    window.parent.postMessage({ type: 'terra:result', from: FROM, ...r }, window.location.origin);
  }
}
export function closeGame() {
  if (EMBEDDED) window.parent.postMessage({ type: 'terra:close' }, window.location.origin);
}
