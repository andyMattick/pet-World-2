/* Extra time for timed games. Pet World adds ?pace=1.25 (up to 2) when a student is finding a game hard at its
   easiest level, and steps it back to 1 as they do well, so a game never feels impossible (docs/BRAIN-GAMES.md).
   Opened on its own, the pace is 1. */
const raw = typeof window !== 'undefined' ? Number(new URLSearchParams(window.location.search).get('pace')) : 1;
export const PACE = Number.isFinite(raw) && raw > 1 ? Math.min(2, raw) : 1;
/** A time limit or speed, stretched by the student's pace. */
export const paced = (ms: number) => Math.round(ms * PACE);
