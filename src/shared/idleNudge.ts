/* ⏸️ "Still there?" nudge, then pause (ROADMAP F93, docs/IDLE-NUDGE.md).
   After `nudge` minutes with no taps or keys, her helper pet asks "Still there?". If nobody answers in `pause` more
   minutes, Pet World pauses: time from the nudge on never counts as practice. Shared by the game (src/game/game.js)
   and the teacher app (Settings), so both read the same defaults and limits. */

export const IDLE_NUDGE_MIN = 2;    // default: minutes with no taps or keys before "Still there?"
export const IDLE_PAUSE_MIN = 3;    // default: more minutes with no answer before Pet World pauses
export const IDLE_MAX_MIN = 10;     // both settings go from 1 to 10 minutes
/** On a quiz or test question she may be reading for a while, so the nudge waits this many times longer (2 → 4 min). */
export const IDLE_TEST_FACTOR = 2;

export interface IdleSettings { on: boolean; nudge: number; pause: number }

const minutes = (v: unknown, fallback: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.max(1, Math.min(IDLE_MAX_MIN, n)) : fallback;
};

/** One stored setting (the class's game_settings.idle, or the grown-up's S.idleNudge), cleaned up; null when not set. */
export function idleSetting(raw: unknown): IdleSettings | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as Partial<IdleSettings>;
  return { on: r.on !== false, nudge: minutes(r.nudge, IDLE_NUDGE_MIN), pause: minutes(r.pause, IDLE_PAUSE_MIN) };
}

/** What applies: the grown-up's setting wins, then the teacher's class setting, then the defaults (on, 2 and 3). */
export function idleSettings(grownUp: unknown, teacher: unknown): IdleSettings & { from: 'grown-up' | 'teacher' | 'default' } {
  const g = idleSetting(grownUp); if (g) return { ...g, from: 'grown-up' };
  const t = idleSetting(teacher); if (t) return { ...t, from: 'teacher' };
  return { on: true, nudge: IDLE_NUDGE_MIN, pause: IDLE_PAUSE_MIN, from: 'default' };
}
