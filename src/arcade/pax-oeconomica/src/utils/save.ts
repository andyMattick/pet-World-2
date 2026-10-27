/* Autosave per era on this device, so a game can be finished another day. */
import type { Era, GameState } from '../types/game';
import { deserialize, serialize } from '../logic/engine';

const saveKey = (era: Era) => `pax-save-era${era}`;
export function saveGame(gs: GameState) {
  try { localStorage.setItem(saveKey(gs.era), serialize(gs)); } catch { /* storage full or blocked */ }
}
export function loadGame(era: Era): GameState | null {
  try { const s = localStorage.getItem(saveKey(era)); return s ? deserialize(s) : null; } catch { return null; }
}
export function clearSave(era: Era) { try { localStorage.removeItem(saveKey(era)); } catch { /* ignore */ } }
