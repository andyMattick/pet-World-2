/* Stand-and-stretch breaks (docs/MOVE-BREAKS.md): when a student finishes one subject and goes to start a different one,
   her pet leads a short movement break (4 moves, 20 seconds each) before the new subject. No skip button.
   Shared by the game (the break itself, S.move in the save) and the teacher app (class settings). */

export interface Move { id: string; name: string; emoji: string; cue: string }

/** anim class in the game is `move-<id>` (src/styles/game.css). */
export const MOVES: Move[] = [
  { id: 'reach', name: 'Reach for the sky', emoji: '🙌', cue: 'Stand up tall and stretch both arms up high.' },
  { id: 'toes', name: 'Touch your toes', emoji: '🦶', cue: 'Bend down slowly and reach toward your toes. It’s fine to bend your knees.' },
  { id: 'circles', name: 'Arm circles', emoji: '🔄', cue: 'Arms out to the sides. Make small circles, then big ones.' },
  { id: 'march', name: 'March in place', emoji: '🥁', cue: 'Lift your knees up high and march.' },
  { id: 'side', name: 'Side bends', emoji: '🌴', cue: 'One arm up, lean to the side like a tree in the wind. Then switch sides.' },
  { id: 'twist', name: 'Gentle twists', emoji: '🌀', cue: 'Hands on your hips. Turn slowly left, then right.' },
  { id: 'shoulders', name: 'Shoulder rolls', emoji: '🔁', cue: 'Roll your shoulders back 5 times, then forward 5 times.' },
  { id: 'jacks', name: 'Jumping jacks', emoji: '⭐', cue: 'Jump out wide with your arms up, then jump back together.' }
];
export const moveById = (id: string) => MOVES.find(move => move.id === id);

export const MOVES_PER_BREAK = 4;     // moves in each break
export const MOVE_SECONDS = 20;       // seconds per move (about a minute and a half in all)
export const MOVE_MINUTES = 10;       // default: minutes in a subject before switching subjects earns a break
export const MOVE_MINUTES_MAX = 60;
/** The subjects a break sits between (ids from src/shared/subjectTime.ts). Town, the Arcade, Word Workshop and brain stretches don't count. */
export const MOVE_SUBJECTS = ['math', 'english', 'reading', 'history', 'science'];

/** Class setting game_settings.move. Off until a teacher turns it on; every move is in the cycle unless unchecked.
    minutes: how long she has to have spent in a subject before moving to a different one brings a break (0 = every switch). */
export interface MoveSettings { enabled: boolean; minutes: number; moves: Record<string, boolean> }
export function moveSettings(raw: Partial<MoveSettings> | null | undefined): MoveSettings {
  const m = Math.round(Number(raw?.minutes));
  return {
    enabled: raw?.enabled === true,
    minutes: Number.isFinite(m) ? Math.max(0, Math.min(MOVE_MINUTES_MAX, m)) : MOVE_MINUTES,
    moves: Object.fromEntries(MOVES.map(move => [move.id, raw?.moves?.[move.id] !== false]))
  };
}
export const allowedMoves = (settings: MoveSettings) => (settings.enabled ? MOVES.filter(move => settings.moves[move.id]).map(move => move.id) : []);

/** Moves for one break: ones not done in the last break or two first, in random order. */
export function pickMoves(allowed: string[], recent: string[], count = MOVES_PER_BREAK, random = Math.random): string[] {
  const shuffle = (list: string[]) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fresh = shuffle(allowed.filter(id => !recent.includes(id))), again = shuffle(allowed.filter(id => recent.includes(id)));
  return [...fresh, ...again].slice(0, Math.min(count, allowed.length));
}

/** S.move in the student's save. */
export interface MoveBreak { t: number; after: string; to: string; moves: string[] }
export interface MoveState {
  day: string;          // the day subject and secs are for
  subject: string;      // the subject she was last working in today ('' = none yet)
  secs: number;         // active seconds in that subject since she started it
  due: string;          // the subject she just finished, when a break is waiting ('' = none)
  recent: string[];     // moves from the last breaks, so the next one mixes it up
  breaks: MoveBreak[];  // the last 60 finished breaks
}
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const subj = (v: unknown) => (typeof v === 'string' && MOVE_SUBJECTS.includes(v) ? v : '');
export function normalizeMoveState(raw: unknown): MoveState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const ids = new Set(MOVES.map(move => move.id));
  return {
    day: typeof r.day === 'string' && DAY.test(r.day) ? r.day : '',
    subject: subj(r.subject),
    secs: Number.isFinite(+r.secs) ? Math.max(0, Math.min(86400, Math.round(+r.secs))) : 0,
    due: subj(r.due),
    recent: (Array.isArray(r.recent) ? r.recent : []).filter((id: unknown) => typeof id === 'string' && ids.has(id)).slice(-MOVES_PER_BREAK * 2),
    breaks: (Array.isArray(r.breaks) ? r.breaks : []).filter((x: any) => x && Number.isFinite(+x.t) && Array.isArray(x.moves)).slice(-60)
      .map((x: any) => ({ t: +x.t, after: subj(x.after), to: subj(x.to), moves: x.moves.filter((id: unknown) => typeof id === 'string' && ids.has(id)).slice(0, MOVES.length) }))
  };
}
