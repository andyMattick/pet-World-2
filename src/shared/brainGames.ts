/* Brain stretches (docs/BRAIN-GAMES.md): 3 short brain games in a row, each morning and after each core subject on the
   student's daily plan. The games are built from src/brain-games/ into public/brain-games/ and run in a frame.
   Shared by the game (stretches, saving results) and the teacher app (class settings, the student's 🧠 Brain tab). */

export interface BrainGame { id: string; name: string; emoji: string; skill: string; levels: [string, string][] }

/** Easiest level first. Ids match src/brain-games/src/data/gamesCatalog.ts. */
export const BRAIN_GAMES: BrainGame[] = [
  { id: 'stroop-clash', name: 'Color Clash', emoji: '🎨', skill: 'Focus: name the ink color, not the word', levels: [['standard', 'Standard'], ['turbo', 'Turbo'], ['reverse', 'Reverse']] },
  { id: 'chimp-memory', name: 'Chimp Memory', emoji: '🐒', skill: 'Memory: remember where the numbers were', levels: [['easy', '5 numbers'], ['medium', '6 numbers'], ['chimp', '8 numbers']] },
  { id: 'trail-making', name: 'Trail Making', emoji: '🔢', skill: 'Switching: connect the dots in order', levels: [['part-a', 'Numbers'], ['part-b', 'Numbers and letters']] },
  { id: 'speed-calc', name: 'Speed Math', emoji: '➕', skill: 'Quick math: is the equation true or false?', levels: [['foundational', 'Basic'], ['intermediate', 'Mixed'], ['expert', 'Fast']] },
  { id: 'pattern-matrix', name: 'Pattern Matrix', emoji: '🔳', skill: 'Reasoning: find the missing piece', levels: [['single-rule', 'One rule'], ['dual-rule', 'Two rules']] },
  { id: 'flanker-task', name: 'Arrow Focus', emoji: '➡️', skill: 'Focus: which way does the middle arrow point?', levels: [['standard', '5 arrows'], ['dense', '7 arrows']] },
  { id: 'word-fluency', name: 'Word Builder', emoji: '🔤', skill: 'Words: unscramble the letters to spell the word', levels: [['4-letter', '4 letters'], ['6-letter', '6 letters']] },
  { id: 'corsi-block', name: 'Block Path', emoji: '🟦', skill: 'Memory: tap the blocks in the same order', levels: [['forward', 'Same order'], ['reverse', 'Reverse order']] },
  { id: 'go-no-go', name: 'Go / No-Go', emoji: '🚦', skill: 'Self-control: tap for go, hold back for stop', levels: [['standard', 'Standard'], ['high-speed', 'Fast']] },
  { id: 'mental-rotation', name: 'Shape Turner', emoji: '🧊', skill: 'Space: is it the same shape, turned?', levels: [['standard', 'Standard'], ['complex', 'Harder angles']] },
  { id: 'card-sorting', name: 'Card Sort', emoji: '🃏', skill: 'Flexible thinking: figure out the sorting rule', levels: [['standard', 'Standard']] },
  { id: 'dual-n-back', name: 'Dual N-Back', emoji: '🧩', skill: 'Memory: match what came 1, 2 or 3 steps back', levels: [['1-back', '1 back'], ['2-back', '2 back'], ['3-back', '3 back']] }
];
export const brainGame = (id: string) => BRAIN_GAMES.find(game => game.id === id);

export const STRETCH_GAMES = 3;          // games in each stretch
export const LEVEL_UP_ACCURACY = 85;     // a game moves up a level after this accuracy (or better)...
export const LEVEL_UP_IN_A_ROW = 3;      // ...this many times in a row
export const EASE_ACCURACY = 60;         // below this twice in a row, the game gets gentler:
export const EASE_IN_A_ROW = 2;          //   down a level, or (at the easiest level) a bit more time
export const PACE_STEP = 0.25, PACE_MAX = 2;   // extra time comes in quarter steps, up to double; it steps back as she does well

/** Class setting game_settings.brain. Off until a teacher turns it on; every game is in the cycle unless blocked. */
export interface BrainSettings { enabled: boolean; games: Record<string, boolean> }
export function brainSettings(raw: Partial<BrainSettings> | null | undefined): BrainSettings {
  return { enabled: raw?.enabled === true, games: Object.fromEntries(BRAIN_GAMES.map(game => [game.id, raw?.games?.[game.id] !== false])) };
}

/** One finished game. t = when (ms), g = game id, lv = level id, acc = % right, rt = average reaction time (ms),
    sc = the game's score, dur = seconds, s = the stretch it was part of. */
export interface BrainResult { t: number; g: string; lv: string; acc: number; rt: number; sc: number; dur: number; s: string }
/** One stretch. kind 'morning' or 'subject' (after a plan item: label says which). */
export interface BrainStretch { id: string; day: string; kind: 'morning' | 'subject'; label: string; item?: string; games: string[]; done: number; at: number; finishedAt?: number }
/** S.brain in the student's save. */
export interface BrainState {
  morning: string;                   // the last day the morning stretch was set
  stretched: Record<string, string[]>; // day → plan item ids that already got their stretch
  active: string;                    // id of the stretch in progress ('' when none)
  stretches: BrainStretch[];         // the last 90
  levels: Record<string, number>;    // game id → level index (0 = easiest)
  streak: Record<string, number>;    // game id → results in a row at LEVEL_UP_ACCURACY or better at this level
  slump: Record<string, number>;     // game id → results in a row below EASE_ACCURACY
  pace: Record<string, number>;      // game id → time multiplier for timed games (1 = normal, up to PACE_MAX)
  results: BrainResult[];            // the last 400
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const num = (v: unknown, lo: number, hi: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; };
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

export function normalizeBrainState(raw: unknown): BrainState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const ids = new Set(BRAIN_GAMES.map(game => game.id));
  const stretches: BrainStretch[] = (Array.isArray(r.stretches) ? r.stretches : [])
    .filter((x: any) => x && typeof x.id === 'string' && DAY.test(x.day) && Array.isArray(x.games))
    .slice(-90).map((x: any) => {
      const games = x.games.filter((g: unknown) => typeof g === 'string' && ids.has(g)).slice(0, STRETCH_GAMES);
      return { id: str(x.id, 60), day: x.day, kind: x.kind === 'subject' ? 'subject' : 'morning', label: str(x.label, 120), ...(typeof x.item === 'string' ? { item: str(x.item, 60) } : {}),
        games, done: num(x.done, 0, games.length), at: num(x.at, 0, 1e14), ...(Number.isFinite(+x.finishedAt) && +x.finishedAt > 0 ? { finishedAt: +x.finishedAt } : {}) };
    });
  const stretched: Record<string, string[]> = {};
  for (const [day, list] of Object.entries(r.stretched && typeof r.stretched === 'object' ? r.stretched : {}).filter(([day]) => DAY.test(day)).sort().slice(-7)) {
    if (Array.isArray(list)) stretched[day] = list.filter((id: unknown) => typeof id === 'string').slice(0, 40);
  }
  const perGame = (v: unknown, hi: (id: string) => number) => Object.fromEntries(Object.entries(v && typeof v === 'object' ? v : {})
    .filter(([id]) => ids.has(id)).map(([id, n]) => [id, num(n, 0, hi(id))]));
  const active = typeof r.active === 'string' && stretches.some(x => x.id === r.active && x.done < x.games.length) ? r.active : '';
  return {
    morning: typeof r.morning === 'string' && DAY.test(r.morning) ? r.morning : '',
    stretched, active, stretches,
    levels: perGame(r.levels, id => brainGame(id)!.levels.length - 1),
    streak: perGame(r.streak, () => 99),
    slump: perGame(r.slump, () => 99),
    pace: Object.fromEntries(Object.entries(r.pace && typeof r.pace === 'object' ? r.pace : {}).filter(([id, v]) => ids.has(id) && Number.isFinite(+(v as number)))
      .map(([id, v]) => [id, Math.max(1, Math.min(PACE_MAX, Math.round(+(v as number) / PACE_STEP) * PACE_STEP))])),
    results: (Array.isArray(r.results) ? r.results : []).filter((x: any) => x && ids.has(x.g) && Number.isFinite(+x.t)).slice(-400)
      .map((x: any) => ({ t: +x.t, g: x.g, lv: str(x.lv, 30), acc: num(x.acc, 0, 100), rt: num(x.rt, 0, 600000), sc: num(x.sc, -1e6, 1e9), dur: num(x.dur, 0, 7200), s: str(x.s, 60) }))
  };
}

/** Two devices: keep every result and stretch from both, the further-along copy of each stretch, and the higher level. */
export function mergeBrainState(base: BrainState, other: unknown): number {
  const o = normalizeBrainState(other);
  let n = 0;
  const lastPlayed = (s: BrainState) => s.results.reduce<Record<string, number>>((m, x) => { if (x.t > (m[x.g] || 0)) m[x.g] = x.t; return m; }, {});
  const baseLast = lastPlayed(base), otherLast = lastPlayed(o);   // before the results are combined
  base.slump = base.slump || {}; base.pace = base.pace || {};
  const seen = new Set(base.results.map(x => `${x.t}:${x.g}`));
  for (const x of o.results) if (!seen.has(`${x.t}:${x.g}`)) { base.results.push(x); n++; }
  base.results = base.results.sort((a, b) => a.t - b.t).slice(-400);
  for (const x of o.stretches) {
    const i = base.stretches.findIndex(y => y.id === x.id);
    if (i < 0) { base.stretches.push(x); n++; } else if (x.done > base.stretches[i].done) { base.stretches[i] = x; n++; }
  }
  base.stretches = base.stretches.sort((a, b) => a.at - b.at).slice(-90);
  for (const [day, list] of Object.entries(o.stretched)) {
    const mine = base.stretched[day] || (base.stretched[day] = []);
    for (const id of list) if (!mine.includes(id)) { mine.push(id); n++; }
  }
  /* each game's level and pace come from whichever device played that game last (levels go down as well as up) */
  for (const { id } of BRAIN_GAMES) {
    if (!((otherLast[id] || 0) > (baseLast[id] || 0))) continue;
    if ((o.levels[id] || 0) !== (base.levels[id] || 0) || (o.pace[id] || 1) !== (base.pace[id] || 1)) n++;
    base.levels[id] = o.levels[id] || 0; base.streak[id] = o.streak[id] || 0; base.slump[id] = o.slump[id] || 0; base.pace[id] = o.pace[id] || 1;
  }
  if (o.morning > base.morning) { base.morning = o.morning; n++; }
  if (base.active && !base.stretches.some(x => x.id === base.active && x.done < x.games.length)) base.active = '';
  return n;
}

/** Pick a stretch's games: different from each other, and games played in the last two stretches only when nothing else is left. */
export function pickStretchGames(allowed: string[], recent: string[], count = STRETCH_GAMES, random = Math.random): string[] {
  const shuffle = (list: string[]) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fresh = shuffle(allowed.filter(id => !recent.includes(id))), again = shuffle(allowed.filter(id => recent.includes(id)));
  return [...fresh, ...again].slice(0, Math.min(count, allowed.length));
}

/** What changed after a game: moved up or down a level (the new level's name), more time or less time, a new best. */
export interface BrainChange { up?: string; down?: string; moreTime?: boolean; lessTime?: boolean; best?: boolean }

/** The time multiplier Pet World passes to a game (?pace=). */
export const brainPace = (state: BrainState, id: string) => state.pace?.[id] || 1;

/** Record a finished game and adjust it so it always feels doable but keeps growing:
    - 85%+ three times in a row: up a level. While she has extra time, a good result first takes a step of it away.
    - under 60% twice in a row: down a level, or at the easiest level, a bit more time (up to double).
    - anything between keeps things as they are. */
export function recordBrainResult(state: BrainState, result: BrainResult): BrainChange {
  const before = state.results.filter(x => x.g === result.g && x.lv === result.lv);
  state.results = [...state.results, result].slice(-400);
  state.slump = state.slump || {}; state.pace = state.pace || {};
  const game = brainGame(result.g); if (!game) return {};
  const change: BrainChange = before.length >= 1 && result.acc > Math.max(...before.map(x => x.acc)) ? { best: true } : {};
  const level = state.levels[game.id] || 0, pace = brainPace(state, game.id);
  if (game.levels[level]?.[0] !== result.lv) return change;   // played at another level (an old link): it doesn't move anything
  if (result.acc >= LEVEL_UP_ACCURACY) {
    state.slump[game.id] = 0;
    if (pace > 1) { state.pace[game.id] = Math.max(1, pace - PACE_STEP); state.streak[game.id] = 0; return { ...change, lessTime: true }; }
    const streak = (state.streak[game.id] || 0) + 1;
    if (streak >= LEVEL_UP_IN_A_ROW && level < game.levels.length - 1) { state.levels[game.id] = level + 1; state.streak[game.id] = 0; return { ...change, up: game.levels[level + 1][1] }; }
    state.streak[game.id] = streak;
    return change;
  }
  state.streak[game.id] = 0;
  if (result.acc >= EASE_ACCURACY) { state.slump[game.id] = 0; return change; }
  const slump = (state.slump[game.id] || 0) + 1;
  if (slump < EASE_IN_A_ROW) { state.slump[game.id] = slump; return change; }
  state.slump[game.id] = 0;
  if (level > 0) { state.levels[game.id] = level - 1; return { ...change, down: game.levels[level - 1][1] }; }
  if (pace < PACE_MAX) { state.pace[game.id] = Math.min(PACE_MAX, pace + PACE_STEP); return { ...change, moreTime: true }; }
  return change;
}

/* ---------- the teacher's 🧠 Brain tab ---------- */
const escHTML = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const avg = (list: number[]) => (list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null);
const dayOf = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export function brainReportHTML(raw: unknown, settings?: BrainSettings): string {
  const state = normalizeBrainState(raw);
  const off = settings && !settings.enabled ? '<p class="muted">Brain stretches are off for this class. Turn them on in the class settings.</p>' : '';
  if (!state.results.length && !state.stretches.length) return `${off}<p class="muted">No brain stretches yet.</p>`;
  const week = new Date(); week.setDate(week.getDate() - 6);
  const weekKey = dayOf(week.getTime());
  const recentStretches = state.stretches.filter(x => x.day >= weekKey);
  const finished = recentStretches.filter(x => x.done >= x.games.length).length;
  const rows = BRAIN_GAMES.map(game => {
    const mine = state.results.filter(x => x.g === game.id);
    if (!mine.length) return '';
    const first = mine.slice(0, 5), last = mine.slice(-5), level = state.levels[game.id] || 0;
    const a0 = avg(first.map(x => x.acc)), a1 = avg(last.map(x => x.acc)), rt = avg(last.map(x => x.rt).filter(n => n > 0));
    const trend = mine.length >= 6 && a0 != null && a1 != null ? `${a0}% → ${a1}%` : `${a1}%`;
    return `<tr><td>${game.emoji} ${escHTML(game.name)}</td><td>${escHTML(game.levels[level][1])}${brainPace(state, game.id) > 1 ? ` <span class="muted">(extra time ×${brainPace(state, game.id)})</span>` : level < game.levels.length - 1 ? ` <span class="muted">(${state.streak[game.id] || 0} of ${LEVEL_UP_IN_A_ROW} toward the next)</span>` : ''}</td><td>${mine.length}</td><td>${trend}</td><td>${rt != null ? `${(rt / 1000).toFixed(2)} s` : '–'}</td><td>${dayOf(mine[mine.length - 1].t)}</td></tr>`;
  }).join('');
  const recent = state.results.slice(-15).reverse().map(x => {
    const game = brainGame(x.g), stretch = state.stretches.find(s => s.id === x.s);
    return `<tr><td>${new Date(x.t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td><td>${game ? `${game.emoji} ${escHTML(game.name)}` : escHTML(x.g)}</td><td>${escHTML(game?.levels.find(([id]) => id === x.lv)?.[1] || x.lv)}</td><td>${x.acc}%</td><td>${x.rt ? `${(x.rt / 1000).toFixed(2)} s` : '–'}</td><td>${escHTML(stretch?.label || '')}</td></tr>`;
  }).join('');
  return `${off}<p>Last 7 days: <b>${finished}</b> of ${recentStretches.length} brain stretch${recentStretches.length === 1 ? '' : 'es'} finished.</p>
<h3>By game</h3><p class="muted" style="margin-top:0">Accuracy is the first 5 games → the last 5. A game moves up a level after ${LEVEL_UP_IN_A_ROW} results in a row at ${LEVEL_UP_ACCURACY}% or better. After ${EASE_IN_A_ROW} in a row under ${EASE_ACCURACY}%, it moves down a level, or at the easiest level gives extra time, which steps back as she does well. Reaction time is the average of the last 5.</p>
<table class="steptable"><thead><tr><th>Game</th><th>Level now</th><th>Played</th><th>Accuracy</th><th>Reaction time</th><th>Last played</th></tr></thead><tbody>${rows}</tbody></table>
<h3>Latest games</h3><table class="steptable"><thead><tr><th>When</th><th>Game</th><th>Level</th><th>Accuracy</th><th>Reaction time</th><th>Stretch</th></tr></thead><tbody>${recent}</tbody></table>`;
}
