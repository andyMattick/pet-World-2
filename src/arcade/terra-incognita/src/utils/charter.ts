/* The Royal Charter: what she has to do, and by when. A short charter is the default (about 20 minutes); the longer
   ones are for a game she saves and continues over several days. Stars = goals met when the charter ends (it ends
   early once every goal is met). Numbers are here so balance changes are one-file edits (docs/TERRA-INCOGNITA.md). */
export type CharterLength = 'short' | 'long' | 'grand';

export interface CharterConfig {
  id: CharterLength;
  name: string;
  blurb: string;
  months: number;
  regions: number;    // new lands charted (a ship drops anchor there)
  specimens: number;  // plants and animals surveyed
  treaties: number;   // peace and trade treaties signed
}

export const CHARTERS: Record<CharterLength, CharterConfig> = {
  short: { id: 'short', name: 'Short Charter', blurb: 'Six months · about 20 minutes', months: 6, regions: 4, specimens: 4, treaties: 1 },
  long: { id: 'long', name: 'Long Voyage', blurb: 'Eighteen months · save and continue', months: 18, regions: 7, specimens: 8, treaties: 3 },
  grand: { id: 'grand', name: 'Grand Charter', blurb: 'Three years · several sittings', months: 36, regions: 12, specimens: 14, treaties: 5 },
};

export const START = { year: 1604, month: 3, day: 12 };   // April 12, 1604
/** Days since the start of year 0 on the game's 30-day-month calendar. */
export const dayIndex = (year: number, month: number, day: number) => year * 360 + month * 30 + day;
export const START_DAY = dayIndex(START.year, START.month, START.day);

export interface CharterProgress { regions: number; specimens: number; treaties: number }
export function goalsMet(c: CharterConfig, p: CharterProgress) {
  return (p.regions >= c.regions ? 1 : 0) + (p.specimens >= c.specimens ? 1 : 0) + (p.treaties >= c.treaties ? 1 : 0);
}

export const newCharterId = () => `t${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`.slice(0, 20);

/* Autosave on this device, so a longer charter can be finished another day. */
const SAVE_KEY = 'terra-save-v1';
export function saveGame(data: unknown) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* storage full or blocked */ }
}
export function loadGame<T>(): T | null {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) as T : null; } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }
