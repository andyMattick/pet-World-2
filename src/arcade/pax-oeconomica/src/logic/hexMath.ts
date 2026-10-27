/* Axial hex coordinates (pointy-top). https://www.redblobgames.com/grids/hexagons/ */
import type { GameState } from '../types/game';
import { key } from '../types/game';

export interface Hex { q: number; r: number }
export const DIRS: Hex[] = [{ q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }];
export const DIR_NAMES = ['east', 'northeast', 'northwest', 'west', 'southwest', 'southeast'];

export const hexDist = (a: Hex, b: Hex) => (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
export const neighbors = (h: Hex): Hex[] => DIRS.map(d => ({ q: h.q + d.q, r: h.r + d.r }));
export const inMap = (h: Hex, radius: number) => hexDist(h, { q: 0, r: 0 }) <= radius;

/** every hex within n steps of h (including h) */
export function within(h: Hex, n: number): Hex[] {
  const out: Hex[] = [];
  for (let dq = -n; dq <= n; dq++)
    for (let dr = Math.max(-n, -dq - n); dr <= Math.min(n, -dq + n); dr++) out.push({ q: h.q + dq, r: h.r + dr });
  return out;
}
export function allHexes(radius: number): Hex[] { return within({ q: 0, r: 0 }, radius); }

export const HEX_SIZE = 30;
export function hexToPixel(h: Hex, size = HEX_SIZE) {
  return { x: size * Math.sqrt(3) * (h.q + h.r / 2), y: size * 1.5 * h.r };
}
export function hexCorners(cx: number, cy: number, size = HEX_SIZE) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 30);
    pts.push(`${(cx + size * Math.cos(a)).toFixed(1)},${(cy + size * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
/** a rough compass direction from a to b, for waystone clues */
export function direction(a: Hex, b: Hex): string {
  const pa = hexToPixel(a), pb = hexToPixel(b);
  const ang = Math.atan2(-(pb.y - pa.y), pb.x - pa.x) * 180 / Math.PI;   // 0 = east, 90 = north
  const names = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
  return names[(Math.round(((ang + 360) % 360) / 45)) % 8];
}

/** land paths for scouts (water blocks them); returns hexes reachable within `moves` */
export function reachable(gs: GameState, from: Hex, moves: number): Map<string, number> {
  const seen = new Map<string, number>([[key(from.q, from.r), 0]]);
  let frontier: Hex[] = [from];
  for (let step = 1; step <= moves; step++) {
    const next: Hex[] = [];
    for (const h of frontier) for (const n of neighbors(h)) {
      const k = key(n.q, n.r); const t = gs.tiles.get(k);
      if (!t || t.biome === 'water' || seen.has(k)) continue;
      seen.set(k, step); next.push(n);
    }
    frontier = next;
  }
  return seen;
}

/* seeded random numbers (mulberry32): the state lives in the game, so a saved game continues the same way */
export function rand(gs: { rng: number }): number {
  let t = (gs.rng = (gs.rng + 0x6D2B79F5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const randInt = (gs: { rng: number }, lo: number, hi: number) => lo + Math.floor(rand(gs) * (hi - lo + 1));
export const pick = <T,>(gs: { rng: number }, arr: T[]): T => arr[Math.floor(rand(gs) * arr.length)];
export function shuffle<T>(gs: { rng: number }, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand(gs) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
