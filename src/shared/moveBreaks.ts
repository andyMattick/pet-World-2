/* Stand-and-stretch breaks (docs/MOVE-BREAKS.md): when a student finishes one subject and goes to start a different one,
   her pet leads a short movement break (4 moves: 2 stretches and 2 fun ones, about 20 seconds each) before the new
   subject. No skip button.
   Shared by the game (the break itself, S.move in the save) and the teacher app (class settings). */

/** kind: a stretch, or a fun one (get up and do something). anim: the pet's animation, class `move-<anim>` in
    src/styles/game.css (the id when not set). seconds: how long it lasts (MOVE_SECONDS when not set). */
export interface Move { id: string; name: string; emoji: string; cue: string; kind: 'stretch' | 'fun'; anim?: string; seconds?: number }

export const MOVES: Move[] = [
  { id: 'reach', kind: 'stretch', name: 'Reach for the sky', emoji: '🙌', cue: 'Stand up tall and stretch both arms up high.' },
  { id: 'toes', kind: 'stretch', name: 'Touch your toes', emoji: '🦶', cue: 'Bend down slowly and reach toward your toes. It’s fine to bend your knees.' },
  { id: 'circles', kind: 'stretch', name: 'Arm circles', emoji: '🔄', cue: 'Arms out to the sides. Make small circles, then big ones.' },
  { id: 'march', kind: 'stretch', name: 'March in place', emoji: '🥁', cue: 'Lift your knees up high and march.' },
  { id: 'side', kind: 'stretch', name: 'Side bends', emoji: '🌴', cue: 'One arm up, lean to the side like a tree in the wind. Then switch sides.' },
  { id: 'twist', kind: 'stretch', name: 'Gentle twists', emoji: '🌀', cue: 'Hands on your hips. Turn slowly left, then right.' },
  { id: 'shoulders', kind: 'stretch', name: 'Shoulder rolls', emoji: '🔁', cue: 'Roll your shoulders back 5 times, then forward 5 times.' },
  { id: 'jacks', kind: 'stretch', name: 'Jumping jacks', emoji: '⭐', cue: 'Jump out wide with your arms up, then jump back together.' },
  { id: 'lap', kind: 'fun', anim: 'march', seconds: 45, name: 'Lap of the house', emoji: '🏃', cue: 'Run one lap around the house and come back. Walk on the stairs!' },
  { id: 'juggle', kind: 'fun', anim: 'jacks', seconds: 30, name: 'Juggle', emoji: '🤹', cue: 'Juggle two or three balls, socks, or stuffed animals. Count how many catches you make.' },
  { id: 'catch', kind: 'fun', anim: 'jacks', seconds: 30, name: 'Toss and catch', emoji: '⚾', cue: 'Throw a ball up and catch it. Can you clap before you catch it? Twice?' },
  { id: 'sockShot', kind: 'fun', anim: 'jacks', seconds: 30, name: 'Sock basketball', emoji: '🧦', cue: 'Roll up a pair of socks and shoot it into a basket or a box. Take a step back after each basket.' },
  { id: 'pushups', kind: 'fun', anim: 'shoulders', name: 'Push-ups', emoji: '💪', cue: 'Do as many push-ups as you can. Knees on the floor counts.' },
  { id: 'plank', kind: 'fun', anim: 'still', name: 'Plank', emoji: '🪵', cue: 'Hold a plank on your hands or elbows. Keep your back flat like a table.' },
  { id: 'wallSit', kind: 'fun', anim: 'still', name: 'Wall sit', emoji: '🧱', cue: 'Lean your back on a wall and sit on an invisible chair until the timer ends.' },
  { id: 'handstand', kind: 'fun', anim: 'flip', seconds: 30, name: 'Handstand or cartwheel', emoji: '🤸', cue: 'Kick up into a handstand against a wall, or do a cartwheel. Only on carpet or grass, with room around you.' },
  { id: 'breath', kind: 'fun', anim: 'puff', name: 'Big breath', emoji: '🫧', cue: 'Take a huge breath and hold it while you count to 10 in your head. Let it out slowly, then breathe normally.' },
  { id: 'stare', kind: 'fun', anim: 'still', seconds: 30, name: 'Staring contest', emoji: '👀', cue: 'Challenge Mom (or anyone nearby) to a staring contest. First one to blink loses!' },
  { id: 'dance', kind: 'fun', anim: 'wiggle', name: 'Dance party', emoji: '🕺', cue: 'Dance like nobody’s watching until the timer runs out.' },
  { id: 'animalWalk', kind: 'fun', anim: 'march', name: 'Animal walk', emoji: '🐻', cue: 'Bear-crawl, crab-walk, or frog-hop across the room and back.' },
  { id: 'flamingo', kind: 'fun', anim: 'side', name: 'Flamingo', emoji: '🦩', cue: 'Stand on one foot. Close your eyes if you dare. Switch feet halfway.' },
  { id: 'statue', kind: 'fun', anim: 'still', name: 'Freeze statue', emoji: '🗿', cue: 'Strike a silly pose and don’t move a muscle. Not even a giggle.' },
  { id: 'hops', kind: 'fun', anim: 'jacks', name: 'One-foot hops', emoji: '🦘', cue: 'Hop 10 times on your left foot, then 10 times on your right.' },
  { id: 'faces', kind: 'fun', anim: 'wiggle', name: 'Funny faces', emoji: '🤪', cue: 'Make five of your funniest faces. Bonus if you make someone laugh.' },
  { id: 'joke', kind: 'fun', anim: 'wiggle', seconds: 45, name: 'Tell a joke', emoji: '😂', cue: 'Go tell someone in your house a joke, then come back.' },
  { id: 'water', kind: 'fun', anim: 'march', seconds: 45, name: 'Water break', emoji: '💧', cue: 'Go get a drink of water and come right back.' },
  { id: 'petLove', kind: 'fun', anim: 'wiggle', seconds: 30, name: 'Pet hug', emoji: '🐶', cue: 'Go give a pet (or a stuffed animal) a hug and a scratch behind the ears.' }
];
export const moveSeconds = (id: string) => moveById(id)?.seconds || MOVE_SECONDS;
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

/** Moves for one break: half stretches and half fun ones, taking turns (stretch first), and ones not done in the
    last break or two before the rest. If the class's cycle has only one kind, the break uses that kind. */
export function pickMoves(allowed: string[], recent: string[], count = MOVES_PER_BREAK, random = Math.random): string[] {
  const shuffle = (list: string[]) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const order = (list: string[]) => [...shuffle(list.filter(id => !recent.includes(id))), ...shuffle(list.filter(id => recent.includes(id)))];
  const stretch = order(allowed.filter(id => moveById(id)?.kind !== 'fun')), fun = order(allowed.filter(id => moveById(id)?.kind === 'fun'));
  const out: string[] = [];
  while (out.length < Math.min(count, allowed.length)) {
    const next = (out.length % 2 === 0 ? stretch : fun).shift() ?? stretch.shift() ?? fun.shift();
    if (!next) break;
    out.push(next);
  }
  return out;
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
    recent: (Array.isArray(r.recent) ? r.recent : []).filter((id: unknown) => typeof id === 'string' && ids.has(id)).slice(-MOVES_PER_BREAK * 3),
    breaks: (Array.isArray(r.breaks) ? r.breaks : []).filter((x: any) => x && Number.isFinite(+x.t) && Array.isArray(x.moves)).slice(-60)
      .map((x: any) => ({ t: +x.t, after: subj(x.after), to: subj(x.to), moves: x.moves.filter((id: unknown) => typeof id === 'string' && ids.has(id)).slice(0, MOVES.length) }))
  };
}
