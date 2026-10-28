/* 📈 Insights (docs/INSIGHTS.md): one student's last 5 days, read with built-in rules (no AI).
   Pure: no DOM, no Supabase, and NO imports, so the teacher app (src/teacher/insightsCard.ts) and the daily email
   (supabase/functions/daily-insights, which gets a copy of this file at deploy time) run the same code.

   In:  one student's report (the teacher app's StudentReport: class_report() plus her save), "now", and a time zone.
        Optional names (skills, stations, courses, mix-ups) come from src/shared/registry.ts; without them the module
        falls back to the labels her day log already carries.
   Out: today, the last 5 days, struggles, the prompts she missed most, when she struggles, where her time goes and in
        what order, tool use, wins, and recommendations (for her plan, and ideas for the app). Every recommendation
        carries its numbers and a confidence, and none is made below the minimums in INSIGHT_RULES. */

/* ---------- the rules: every minimum and cut-off in one place (docs/INSIGHTS.md lists them) ---------- */
export const INSIGHT_RULES = {
  windowDays: 5,            // rolling window, today included
  weekdayDays: 14,          // day-of-week pattern looks back further (the day log keeps 14 days)
  activeDaySecs: 300,       // a day counts as a work day from 5 active minutes
  minBucket: 12,            // scored answers needed in a group before a time pattern is stated
  minGapPts: 15,            // percentage points between the best and weakest group to call it a pattern
  mathMinOrders: 5,         // a math skill or station needs 5 orders in the window ...
  mathStrugglePct: 60,      // ... and fewer than 60% perfect to be a struggle
  lessonMinAnswers: 6,      // a lesson needs 6 answers in the window ...
  lessonStrugglePct: 70,    // ... and under 70% right
  mixupMin: 2,              // a mix-up seen twice in the window
  missedMin: 2,             // a prompt missed twice is a "most missed" item
  vocabMinTries: 3,         // a word with 3+ tries and a third or fewer right
  vocabWordsMin: 2,         // ... at least 2 such words before "re-teach these words"
  spellKindMin: 3,          // the same spelling slip 3 times
  goalMinDays: 3,           // days with a plan goal before comparing time with the goal
  goalMinMinutes: 10,       // ... for a goal of at least 10 minutes a day
  goalOverRatio: 1.5,       // 1.5× the goal or more: "takes longer than planned"
  goalUnderRatio: 0.6,      // 60% of the goal or less: "short of the goal"
  toolMinActiveDays: 3,     // "not used" is only said after 3 work days
  arcadeSharePct: 25,       // Arcade at a quarter of her time or more ...
  arcadeMinMinutes: 60,     // ... out of at least an hour
  partwaySecs: 120,         // 2+ minutes in a lesson without finishing it counts as leaving partway
  partwayMin: 3,            // 3 times ...
  partwayMinDays: 2,        // ... on 2 different days
  stuckSecs: 900,           // 15+ minutes on one screen with nothing finished
  idleSharePct: 35,         // on screen but idle for 35%+ of session time ...
  idleMinMinutes: 60,       // ... out of an hour on screen
  orderMinDays: 3,          // days with 2+ subjects before naming her usual order
  breakWindowMins: 30,      // answers 30 minutes before / after a break
  gapBreakMins: 30          // a 30-minute pause counts as a break
} as const;
const R = INSIGHT_RULES;

/* ---------- input ---------- */
/** One student's data. The teacher app's StudentReport fits this as is; every field is read defensively. */
export interface InsightsStudent {
  n: string;
  qz?: unknown; qx?: Record<string, string> | null; ss?: unknown; m?: unknown;
  subjectTime?: unknown; dayLog?: unknown; help?: unknown; writtenAnswers?: unknown; readingBooks?: unknown; mathThink?: unknown;
  vocab?: unknown; videosWatched?: unknown; cardStats?: unknown; missLog?: unknown; brain?: unknown; brainOn?: unknown;
  rp?: unknown;   // recent math orders: problems rows {created_at, skill, shop, station, perfect}
  ra?: unknown;   // recent first-try misses: attempts rows {created_at, skill, shop, step, answer, expected, misconception, context}
}
/** Names from the registry (optional). */
export interface InsightNames {
  skill?: (id: string) => string | undefined;
  station?: (shop: string, station: number) => string | undefined;
  shop?: (id: string) => string | undefined;
  course?: (id: string) => string | undefined;
  mixup?: (id: string) => { name: string; tip?: string } | undefined;
  unitSubject?: (unitId: string) => string | undefined;   // plan units: 'math' | 'english' | 'history' | 'biology'
}
export interface InsightsOptions { now?: number; tz?: string; names?: InsightNames }

/* ---------- output ---------- */
export type Confidence = 'high' | 'medium' | 'low';
export interface DayRow { day: string; label: string; minutes: number; right: number; total: number; active: boolean }
export interface TodayRow { day: string; label: string; minutes: number; subjects: { id: string; label: string; minutes: number }[]; right: number; total: number; passed: string[]; flags: string[]; firstSubject: string | null; lastActive: number | null; helpAsked: number }
export interface Struggle { kind: 'math' | 'lesson' | 'quiz' | 'mixup' | 'words' | 'spelling' | 'reading' | 'written'; subject: string; title: string; detail: string; action: string; right?: number; total?: number; days: number; weight: number; confidence: Confidence }
export interface MissedItem { subject: string; where: string; text: string; count: number; example?: string }
export interface Bucket { label: string; right: number; total: number; pct: number | null; enough: boolean }
export interface Pattern { id: 'time' | 'position' | 'breaks' | 'weekday'; title: string; buckets: Bucket[]; verdict: string; found: boolean }
export interface SubjectTimeRow { id: string; label: string; minutes: number; perDay: number[]; goal: number | null; goalDays: number; ratio: number | null }
export interface ToolRow { id: string; emoji: string; label: string; count: number; days: number; note: string }
export interface Rec { kind: 'plan' | 'app'; text: string; evidence: string; confidence: Confidence }
export interface Win { emoji: string; text: string }
export interface Insights {
  name: string; generatedAt: number; tz: string; today: TodayRow; days: DayRow[]; window: { from: string; to: string; activeDays: number };
  struggles: Struggle[]; missed: MissedItem[]; patterns: Pattern[];
  time: { subjects: SubjectTimeRow[]; totalMinutes: number; order: { days: { day: string; label: string; seq: string[] }[]; verdict: string };
    share: { lessons: number; games: number; arcade: number; town: number; breaks: number; total: number };
    idle: { onScreen: number; active: number; pct: number | null }; emptyDays: string[];
    partway: { subject: string; label: string; day: string; minutes: number }[]; stuck: { label: string; day: string; minutes: number }[] };
  tools: ToolRow[]; wins: Win[]; recs: { plan: Rec[]; app: Rec[] }; dataNotes: string[];
}

/* ---------- small helpers ---------- */
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WD_LONG = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const num = (v: unknown): number | null => { const n = typeof v === 'string' && v.trim() === '' ? NaN : Number(v); return Number.isFinite(n) ? n : null; };
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const pct = (right: number, total: number) => (total > 0 ? Math.round(right * 100 / total) : null);
const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const mins = (secs: number) => Math.round(secs / 60);
const sum = (list: number[]) => list.reduce((a, b) => a + b, 0);
const confidenceOf = (n: number, min: number): Confidence => (n >= 3 * min ? 'high' : n >= 1.5 * min ? 'medium' : 'low');
const shortText = (s: string, max = 90) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > max ? t.slice(0, max - 1) + '…' : t; };
export const addDays = (day: string, n: number) => { const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekdayOf = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay();
export const dayLabel = (day: string) => `${WD[weekdayOf(day)]} ${+day.slice(5, 7)}/${+day.slice(8, 10)}`;
const fmtCache = new Map<string, Intl.DateTimeFormat>();
/** The calendar day, hour and minute of a moment in a time zone (the browser's own zone when tz is empty). */
export function zoned(t: number, tz = '') {
  let f = fmtCache.get(tz);
  if (!f) {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
    try { f = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz || undefined }); } catch { f = new Intl.DateTimeFormat('en-CA', opts); }
    fmtCache.set(tz, f);
  }
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(t))) p[x.type] = x.value;
  return { day: `${p.year}-${p.month}-${p.day}`, hour: (+p.hour) % 24, minute: +p.minute };
}
const whenText = (label: string) => ({ 'Before 10 AM': 'before 10 AM', '10 AM–noon': 'from 10 AM to noon', 'Noon–2 PM': 'from noon to 2 PM', 'After 2 PM': 'after 2 PM' } as Record<string, string>)[label] || label;

/* subjects: the time-by-subject ids (src/shared/subjectTime.ts) */
const SUBJECT_LABEL: Record<string, string> = { bible: '✝️ Bible', math: '➗ Math', english: '📚 English', reading: '📖 Reading Log', words: '🔤 Word Workshop', facts: '⚡ Fact Sprint', history: '🏛️ History', science: '🦁 Science', brain: '🧠 Brain stretch', arcade: '🕹️ Arcade', town: '🏠 Around town' };
const MAIN_SUBJECTS = ['math', 'english', 'reading', 'history', 'science'];
const subjectLabel = (id: string) => SUBJECT_LABEL[id] || id;
const subjectName = (id: string) => subjectLabel(id).replace(/^[^\p{L}]+/u, '');
const courseSubject = (course: string) => (course === 'math' ? 'math' : course.startsWith('history') ? 'history' : course.startsWith('bio') ? 'science' : 'english');
/* which subject an event belongs to, for her order of the day (warm-ups are kept apart from the subjects) */
function eventSubject(ev: Record<string, unknown>): string {
  const k = str(ev.k), course = str(ev.course);
  switch (k) {
    case 'assess': case 'mastered': case 'chef': case 'surgery': case 'dash': case 'penguin': case 'detective': case 'carnival': case 'asteroids': case 'battleship': case 'parcel': case 'petshow': return 'math';
    case 'sprint': return 'facts';
    case 'vocab': return 'words';
    case 'reading': case 'readtime': return 'reading';
    case 'course': case 'review': return courseSubject(course);
    case 'project': return course.startsWith('bio') ? 'science' : course.startsWith('history') ? 'history' : 'english';
    case 'dig': case 'scribe': case 'pax': return 'history';
    case 'sim': case 'handson': return 'science';
    case 'ggame': case 'recall': case 'hero': return 'english';
    case 'bible': return 'bible';
    case 'brain': case 'move': return 'breaks';
    case 'done': { const s = str(ev.subject); return s === 'biology' ? 'science' : MAIN_SUBJECTS.includes(s) ? s : 'other'; }
    default: return 'other';
  }
}
/* a day-log place key's subject (time per lesson) */
function placeSubject(key: string): string {
  const [k, a = ''] = key.split(':');
  if (k === 'shop' || k === 'sprint') return k === 'sprint' ? 'facts' : 'math';
  if (k === 'vocab') return 'words';
  if (k === 'reading') return 'reading';
  if (k === 'bible') return 'bible';
  if (k === 'dig' || k === 'scribe') return 'history';
  if (k === 'sim') return 'science';
  if (k === 'project') return a.startsWith('bio') ? 'science' : 'history';
  if (k === 'course') return courseSubject(a);
  if (GAME_PLACES.has(k) || k === 'ggame' || k === 'hero' || k === 'recall') return 'games';
  return k === 'arcade' ? 'arcade' : k === 'town' ? 'town' : 'other';
}
const GAME_PLACES = new Set(['chef', 'surgery', 'dash', 'penguin', 'asteroids', 'battleship', 'parcel', 'petshow', 'detective', 'carnival', 'ggame', 'hero', 'recall']);
const SCORED_KINDS = new Set(['course', 'assess', 'ggame', 'hero', 'dig', 'vocab']);   // learning with a right/total (games and flashcards aren't counted for accuracy)

/* ---------- parsing the saved data ---------- */
interface Ev { t: number; day: string; k: string; s: number | null; n: number | null; passed: boolean; course: string; title: string; kind: string; mode: string; shop: string; station: number | null; text: string; first: boolean; min: number | null; subject: string; raw: Record<string, unknown> }
interface DayData { places: Record<string, number>; counts: Record<string, { n: number; ok: number }>; labels: Record<string, string>; events: Ev[] }
interface Item { t: number; day: string; hour: number; subject: string; right: number; total: number; key: string; label: string }

function parseDayLog(raw: unknown): Record<string, DayData> {
  const out: Record<string, DayData> = {};
  for (const [day, v] of Object.entries(obj(raw))) {
    if (!DAY_RE.test(day)) continue;
    const d = obj(v), places: Record<string, number> = {}, counts: Record<string, { n: number; ok: number }> = {}, labels: Record<string, string> = {};
    for (const [k, s] of Object.entries(obj(d.places))) { const n = num(s); if (n && n > 0) places[k] = n; }
    for (const [k, c] of Object.entries(obj(d.counts))) { const n = num(obj(c).n), ok = num(obj(c).ok); if (n && n > 0) counts[k] = { n, ok: Math.min(n, Math.max(0, ok || 0)) }; }
    for (const [k, s] of Object.entries(obj(d.labels))) if (typeof s === 'string') labels[k] = s;
    const events = arr(d.events).map(obj).filter(e => num(e.t) != null && typeof e.k === 'string').map(e => ({
      t: num(e.t)!, day, k: str(e.k), s: num(e.s), n: num(e.n), passed: e.passed === true, course: str(e.course), title: str(e.title), kind: str(e.kind), mode: str(e.mode),
      shop: str(e.shop), station: num(e.station), text: str(e.text), first: e.first === true, min: num(e.min), subject: eventSubject(e), raw: e
    })).sort((a, b) => a.t - b.t);
    out[day] = { places, counts, labels, events };
  }
  return out;
}
function parseSubjectTime(raw: unknown): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const [day, row] of Object.entries(obj(raw))) {
    if (!DAY_RE.test(day)) continue;
    const clean: Record<string, number> = {};
    for (const [id, s] of Object.entries(obj(row))) { const n = num(s); if (n && n > 0) clean[id] = n; }
    out[day] = clean;
  }
  return out;
}
const rowTime = (row: Record<string, unknown>) => num(row.t) ?? (typeof row.created_at === 'string' ? Date.parse(row.created_at) : NaN);

/* ---------- names ---------- */
function makeNamer(names: InsightNames, log: Record<string, DayData>) {
  const labels: Record<string, string> = {};
  for (const d of Object.values(log)) Object.assign(labels, d.labels);
  const courseTitles: Record<string, string> = {};
  for (const d of Object.values(log)) for (const e of d.events) {
    if (e.k === 'course' && e.course && e.text.startsWith('📚 ') && e.title) { const i = e.text.indexOf(`: ${e.title}`); if (i > 2) courseTitles[e.course] = e.text.slice(2, i).trim(); }
  }
  const station = (shop: string, st: number | null) => {
    if (st == null) return names.shop?.(shop) || labels[`shop:${shop}`] || shop;
    return names.station?.(shop, st) || labels[`shop:${shop}:${st}`] || `${names.shop?.(shop) || labels[`shop:${shop}`] || shop} · station ${st}`;
  };
  const course = (id: string) => names.course?.(id) || courseTitles[id] || (id === 'math' ? '➗ Math' : id);
  const skill = (id: string) => names.skill?.(id) || id;
  return { station, course, skill, label: (key: string) => labels[key] || key };
}
const stationKey = (shop: string, st: number | null | undefined) => `shop:${shop}${st == null ? '' : `:${st}`}`;

/* ---------- the plan's minutes for one day (quiz_overrides.plan, and old subjectGoals) ---------- */
const PLAN_DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
function unitSubjectGuess(unit: string, names: InsightNames): string {
  const s = names.unitSubject?.(unit);
  const id = s || (unit.startsWith('ela') ? 'english' : unit.startsWith('hist') ? 'history' : unit.startsWith('bio') ? 'biology' : 'math');
  return id === 'biology' ? 'science' : id;
}
function planGoals(qx: Record<string, string> | null | undefined, day: string, names: InsightNames): Record<string, number> {
  const goals: Record<string, number> = {};
  let plan: Record<string, unknown> = {};
  try { plan = obj(JSON.parse(qx?.plan || '{}')); } catch { plan = {}; }
  const own = obj(plan.days)[day], items = Array.isArray(own) ? own : arr(obj(plan.week)[PLAN_DOW[weekdayOf(day)]]);
  for (const it of items.map(obj)) {
    const m = num(it.minutes) ?? 15;
    if (it.kind === 'subject' && typeof it.subject === 'string') { const id = it.subject === 'biology' ? 'science' : it.subject; goals[id] = (goals[id] || 0) + m; }
    else if (it.kind === 'unit' && typeof it.unit === 'string' && (!it.what || it.what === 'practice')) { const id = unitSubjectGuess(it.unit, names); goals[id] = (goals[id] || 0) + m; }
  }
  let old: Record<string, unknown> = {};
  try { old = obj(JSON.parse(qx?.subjectGoals || '{}')); } catch { old = {}; }
  const base = { ...obj(old.base), ...obj(obj(old.days)[day]) };
  for (const [id, v] of Object.entries(base)) { const m = num(v); const sid = id === 'biology' ? 'science' : id; if (m && m > 0 && !(sid in goals)) goals[sid] = m; }
  return goals;
}

/* ==================================================================================================== */
/** Read one student's data. Same input and "now" always give the same output. */
export function computeInsights(student: InsightsStudent, options: InsightsOptions = {}): Insights {
  const now = options.now ?? Date.now(), tz = options.tz || '', names = options.names || {};
  const log = parseDayLog(student.dayLog), time = parseSubjectTime(student.subjectTime), qx = student.qx || {};
  const nm = makeNamer(names, log);
  const today = zoned(now, tz).day;
  const windowDays = Array.from({ length: R.windowDays }, (_, i) => addDays(today, i - (R.windowDays - 1)));
  const from = windowDays[0], inWin = (day: string) => day >= from && day <= today;
  const longFrom = addDays(today, -(R.weekdayDays - 1));
  const at = (t: number) => zoned(t, tz);
  const dataNotes: string[] = [];

  /* every event in the day log (all 14 days), and the window's */
  const allEvents = Object.values(log).flatMap(d => d.events).sort((a, b) => a.t - b.t);
  const events = allEvents.filter(e => inWin(e.day));

  /* math orders: problems rows (timestamped) when the app loaded them, else the day log's per-station counts */
  const problems = arr(student.rp).map(obj).map(p => ({ t: rowTime(p), skill: str(p.skill), shop: str(p.shop) || 'cafe', station: num(p.station), perfect: p.perfect === true }))
    .filter(p => Number.isFinite(p.t) && p.t <= now + 60000).map(p => ({ ...p, day: at(p.t).day, hour: at(p.t).hour })).sort((a, b) => a.t - b.t);
  const misses = arr(student.ra).map(obj).map(a => ({ t: rowTime(a), skill: str(a.skill), shop: str(a.shop), step: str(a.step), answer: str(a.answer), expected: str(a.expected), mis: str(a.misconception), context: str(a.context) }))
    .filter(a => Number.isFinite(a.t)).map(a => ({ ...a, day: at(a.t).day })).filter(a => inWin(a.day));
  const haveRows = student.rp !== undefined;
  if (!haveRows) dataNotes.push('Math orders by time of day need the problems list; only the day log’s per-station totals were used.');

  /* scored items: math orders + lessons, quizzes, games of grammar, word rounds */
  const items: Item[] = [];
  for (const p of problems) items.push({ t: p.t, day: p.day, hour: p.hour, subject: 'math', right: p.perfect ? 1 : 0, total: 1, key: `skill:${p.skill}`, label: nm.skill(p.skill) });
  for (const e of allEvents) {
    if (!SCORED_KINDS.has(e.k) || e.n == null || e.n <= 0 || e.s == null) continue;
    if (e.k === 'course' && e.kind === 'review') continue;
    items.push({ t: e.t, day: e.day, hour: at(e.t).hour, subject: e.k === 'vocab' ? 'words' : e.subject, right: Math.max(0, Math.min(e.s, e.n)), total: e.n, key: e.k, label: e.text });
  }
  items.sort((a, b) => a.t - b.t);
  const winItems = items.filter(x => inWin(x.day));

  /* ---------- day by day ---------- */
  const daySecs = (day: string) => sum(Object.values(time[day] || {}));
  const days: DayRow[] = windowDays.map(day => {
    const its = winItems.filter(x => x.day === day), secs = daySecs(day);
    return { day, label: dayLabel(day), minutes: mins(secs), right: sum(its.map(x => x.right)), total: sum(its.map(x => x.total)), active: secs >= R.activeDaySecs || its.length > 0 };
  });
  const activeDays = days.filter(d => d.active).length;

  /* ---------- her order of subjects each day (first time each subject shows up) ---------- */
  const timeline = (day: string) => {
    const marks: { t: number; subject: string }[] = [];
    for (const e of log[day]?.events || []) marks.push({ t: e.t, subject: e.subject });
    for (const p of problems) if (p.day === day) marks.push({ t: p.t, subject: 'math' });
    return marks.sort((a, b) => a.t - b.t);
  };
  const orderOf = (day: string) => { const seq: string[] = []; for (const m of timeline(day)) if (MAIN_SUBJECTS.includes(m.subject) && !seq.includes(m.subject)) seq.push(m.subject); return seq; };

  /* ---------- today ---------- */
  const todayItems = winItems.filter(x => x.day === today), todayEvents = events.filter(e => e.day === today);
  const todayTime = time[today] || {};
  const passedText = (e: Ev) => e.k === 'assess' ? `${nm.station(e.shop, e.station)}${e.mode === 'test' ? ' · Unit Test' : ' quiz'} · ${e.s}/${e.n}` : `${nm.course(e.course)}: ${e.title}${e.kind === 'final' ? ' (unit test)' : ' (quiz)'} · ${e.s}/${e.n}`;
  const isTest = (e: Ev) => (e.k === 'assess' && (e.mode === 'quiz' || e.mode === 'test')) || (e.k === 'course' && (e.kind === 'quiz' || e.kind === 'final'));
  const lastT = Math.max(0, ...allEvents.map(e => e.t), ...problems.map(p => p.t), num(obj(student.ss).last) || 0);
  const todayFlags: string[] = [];
  for (const g of groupLessons(todayEvents).values()) if (g.total >= 4 && (g.right / g.total) * 100 < R.lessonStrugglePct) todayFlags.push(`${g.label}: ${g.right} of ${g.total} right`);
  for (const e of todayEvents) if (isTest(e) && !e.passed) todayFlags.push(`Not passed: ${passedText(e)}`);
  const todayRow: TodayRow = {
    day: today, label: dayLabel(today), minutes: mins(sum(Object.values(todayTime))),
    subjects: Object.entries(todayTime).filter(([, s]) => s >= 60).sort((a, b) => b[1] - a[1]).map(([id, s]) => ({ id, label: subjectLabel(id), minutes: mins(s) })),
    right: sum(todayItems.map(x => x.right)), total: sum(todayItems.map(x => x.total)),
    passed: todayEvents.filter(e => isTest(e) && e.passed).map(passedText), flags: todayFlags.slice(0, 4),
    firstSubject: orderOf(today)[0] ? subjectLabel(orderOf(today)[0]) : null, lastActive: lastT || null,
    helpAsked: arr(student.help).map(obj).filter(q => num(q.at) != null && at(num(q.at)!).day === today).length
  };

  /* ---------- struggles ---------- */
  const struggles: Struggle[] = [];
  /* math: by skill from the problems rows, else by station from the day log's counts */
  if (problems.length) {
    const bySkill = new Map<string, { right: number; total: number; days: Set<string>; stations: Set<string> }>();
    for (const p of problems.filter(p => inWin(p.day))) {
      const g = bySkill.get(p.skill) || { right: 0, total: 0, days: new Set<string>(), stations: new Set<string>() };
      g.total++; if (p.perfect) g.right++; g.days.add(p.day); g.stations.add(nm.station(p.shop, p.station)); bySkill.set(p.skill, g);
    }
    for (const [skill, g] of bySkill) {
      const p = pct(g.right, g.total)!;
      if (g.total < R.mathMinOrders || p >= R.mathStrugglePct) continue;
      const where = [...g.stations].join(', ');
      struggles.push({ kind: 'math', subject: 'math', title: nm.skill(skill), detail: `${g.right} of ${g.total} orders perfect (${p}%) in ${where} over ${plural(g.days.size, 'day')}`,
        action: `Re-teach ${nm.skill(skill)}: ${g.right} of ${g.total} right in ${where} over ${plural(g.days.size, 'day')}`, right: g.right, total: g.total, days: g.days.size, weight: g.total - g.right, confidence: confidenceOf(g.total, R.mathMinOrders) });
    }
  } else {
    const byStation = new Map<string, { right: number; total: number; days: Set<string> }>();
    for (const day of windowDays) for (const [key, c] of Object.entries(log[day]?.counts || {})) {
      const g = byStation.get(key) || { right: 0, total: 0, days: new Set<string>() }; g.total += c.n; g.right += c.ok; g.days.add(day); byStation.set(key, g);
    }
    for (const [key, g] of byStation) {
      const p = pct(g.right, g.total)!, [, shop, st] = key.split(':'), label = nm.station(shop, num(st));
      if (g.total < R.mathMinOrders || p >= R.mathStrugglePct) continue;
      struggles.push({ kind: 'math', subject: 'math', title: label, detail: `${g.right} of ${g.total} orders perfect (${p}%) over ${plural(g.days.size, 'day')}`,
        action: `Re-teach ${label}: ${g.right} of ${g.total} right over ${plural(g.days.size, 'day')}`, right: g.right, total: g.total, days: g.days.size, weight: g.total - g.right, confidence: confidenceOf(g.total, R.mathMinOrders) });
    }
  }
  /* lessons: practice and Think it through rounds */
  for (const [, g] of groupLessons(events)) {
    const p = pct(g.right, g.total)!;
    if (g.total < R.lessonMinAnswers || p >= R.lessonStrugglePct) continue;
    struggles.push({ kind: 'lesson', subject: g.subject, title: g.label, detail: `${g.right} of ${g.total} right (${p}%) in ${plural(g.tries, 'round')} over ${plural(g.days.size, 'day')}`,
      action: `Re-teach ${g.label}: ${g.right} of ${g.total} right over ${plural(g.days.size, 'day')}`, right: g.right, total: g.total, days: g.days.size, weight: g.total - g.right, confidence: confidenceOf(g.total, R.lessonMinAnswers) });
  }
  /* quizzes and tests tried in the window and not passed since */
  const tests = new Map<string, { label: string; subject: string; tries: number; best: number; total: number; days: Set<string>; passedLater: boolean; lastFail: number }>();
  for (const e of allEvents.filter(isTest)) {
    const key = e.k === 'assess' ? `a:${e.shop}:${e.station}:${e.mode}` : `c:${e.course}:${e.title}:${e.kind}`;
    const g = tests.get(key) || { label: e.k === 'assess' ? `${nm.station(e.shop, e.station)}${e.mode === 'test' ? ' · Unit Test' : ' quiz'}` : `${nm.course(e.course)}: ${e.title}${e.kind === 'final' ? ' (unit test)' : ' (quiz)'}`, subject: e.subject, tries: 0, best: 0, total: e.n || 0, days: new Set<string>(), passedLater: false, lastFail: 0 };
    if (e.passed) { if (e.t > g.lastFail) g.passedLater = true; }
    else if (inWin(e.day)) { g.tries++; g.days.add(e.day); g.lastFail = e.t; g.passedLater = false; if ((e.s || 0) * (g.total || 1) >= g.best * (e.n || 1)) { g.best = e.s || 0; g.total = e.n || g.total; } }
    tests.set(key, g);
  }
  const qzMissed = new Map<string, string[]>();   // math quiz misses by skill (class_report's assessments)
  for (const q of arr(student.qz).map(obj)) { const t = num(q.t); if (t == null || !inWin(at(t).day) || q.passed === true) continue; const key = `a:${str(q.shop)}:${num(q.station)}:${q.kind === 'test' ? 'test' : 'quiz'}`; qzMissed.set(key, [...new Set([...(qzMissed.get(key) || []), ...arr(q.missed).map(str)])]); }
  for (const [key, g] of tests) {
    if (!g.tries || g.passedLater) continue;
    const missedSkills = (qzMissed.get(key) || []).map(nm.skill);
    struggles.push({ kind: 'quiz', subject: g.subject, title: `Not passed yet: ${g.label}`, detail: `${plural(g.tries, 'try', 'tries')} in the last ${R.windowDays} days, best ${g.best} of ${g.total}${missedSkills.length ? `; missed ${missedSkills.join(', ')}` : ''}`,
      action: `Go over ${missedSkills.length ? missedSkills.join(', ') : g.label} before the next try`, right: g.best, total: g.total, days: g.days.size, weight: 3 + g.tries, confidence: g.tries >= 2 ? 'high' : 'medium' });
  }
  /* mix-ups the game spotted in the window */
  const mixups = new Map<string, { n: number; ex: string; days: Set<string> }>();
  for (const a of misses) if (a.mis) { const g = mixups.get(a.mis) || { n: 0, ex: a.context, days: new Set<string>() }; g.n++; g.days.add(a.day); mixups.set(a.mis, g); }
  for (const [id, g] of mixups) {
    if (g.n < R.mixupMin) continue;
    const info = names.mixup?.(id);
    struggles.push({ kind: 'mixup', subject: 'math', title: `Mix-up: ${info?.name || id}`, detail: `${plural(g.n, 'time')} over ${plural(g.days.size, 'day')}${g.ex ? `, e.g. “${shortText(g.ex, 80)}”` : ''}`,
      action: info?.tip ? `Mix-up “${info.name || id}”: ${info.tip}` : `Talk through the mix-up “${info?.name || id}”`, days: g.days.size, weight: g.n + 1, confidence: confidenceOf(g.n, R.mixupMin) });
  }
  /* Word Workshop: words with few right, and spelling slips */
  const vocab = obj(student.vocab);
  const weakWords = Object.entries(obj(vocab.stats)).map(([w, v]) => ({ w, r: arr(obj(v).r).map(x => (x === 1 ? 1 : 0)) }))
    .filter(x => x.r.length >= R.vocabMinTries && sum(x.r) * 3 <= x.r.length).sort((a, b) => (sum(a.r) / a.r.length) - (sum(b.r) / b.r.length) || b.r.length - a.r.length);
  if (weakWords.length >= R.vocabWordsMin) {
    const list = weakWords.slice(0, 8).map(x => `${x.w} (${sum(x.r)}/${x.r.length})`);
    struggles.push({ kind: 'words', subject: 'words', title: `Words to re-teach: ${weakWords.slice(0, 5).map(x => x.w).join(', ')}`, detail: `${plural(weakWords.length, 'word')} with a third or fewer right in their recent tries: ${list.join(', ')}`,
      action: `Re-teach the words ${weakWords.slice(0, 5).map(x => x.w).join(', ')}`, days: 0, weight: weakWords.length, confidence: confidenceOf(weakWords.length, R.vocabWordsMin) });
  }
  const spells = arr(vocab.mistakes).map(obj).filter(m => num(m.t) != null && inWin(at(num(m.t)!).day));
  const kinds = new Map<string, { n: number; ex: string[] }>();
  for (const m of spells) for (const k of arr(m.kinds).map(str).filter(Boolean)) { const g = kinds.get(k) || { n: 0, ex: [] }; g.n++; if (g.ex.length < 3) g.ex.push(`${str(m.w)} → ${str(m.typed)}`); kinds.set(k, g); }
  for (const [k, g] of kinds) if (g.n >= R.spellKindMin) struggles.push({ kind: 'spelling', subject: 'words', title: `Spelling: ${k}`, detail: `${plural(g.n, 'slip')} this week: ${g.ex.join(', ')}`, action: `Practice the “${k}” spelling pattern`, days: 0, weight: g.n, confidence: confidenceOf(g.n, R.spellKindMin) });
  /* reading quizzes */
  for (const book of arr(student.readingBooks).map(obj)) for (const q of arr(book.quizzes).map(obj)) {
    const t = num(q.at), missed = arr(q.missed).map(str).filter(Boolean);
    if (t == null || !inWin(at(t).day) || missed.length < 2) continue;
    struggles.push({ kind: 'reading', subject: 'reading', title: `Reading quiz: ${str(book.title)}`, detail: `${num(q.score) ?? 0} of ${num(q.total) ?? 0} right on ${arr(q.chapterLabels).map(str).join(', ') || 'the chapters'}; missed ${missed.length}`,
      action: `Re-read with her: ${arr(q.chapterLabels).map(str).join(', ') || str(book.title)}`, right: num(q.score) ?? 0, total: num(q.total) ?? 0, days: 1, weight: missed.length, confidence: 'medium' });
  }
  /* written answers sent back to redo */
  for (const w of arr(student.writtenAnswers).map(obj)) {
    const t = num(w.at); if (t == null || !inWin(at(t).day)) continue;
    const teacher = str(qx[`written:${str(w.id)}`]).split(':'), redo = (teacher[0] === 'scored' && +teacher[1] === t) ? teacher[3] === '1' : obj(w.parentReview).redo === true;
    if (!redo) continue;
    struggles.push({ kind: 'written', subject: courseSubject(str(w.courseId)), title: 'Written answer sent back', detail: `“${shortText(str(w.prompt), 100)}”`, action: 'Go over what a strong answer needs, then let her redo it', days: 1, weight: 2, confidence: 'medium' });
  }
  struggles.sort((a, b) => b.weight - a.weight || (b.total || 0) - (a.total || 0));

  /* ---------- the prompts and items she missed most ---------- */
  const missed: MissedItem[] = [];
  const missLog = arr(student.missLog).map(obj).filter(m => num(m.t) != null && typeof m.q === 'string' && inWin(at(num(m.t)!).day));
  const byPrompt = new Map<string, MissedItem>();
  for (const m of missLog) {
    const course = str(m.c), key = `${course}|${str(m.q)}`, g = byPrompt.get(key) || { subject: courseSubject(course), where: nm.course(course), text: shortText(str(m.q), 140), count: 0 };
    g.count++; byPrompt.set(key, g);
  }
  missed.push(...[...byPrompt.values()].filter(x => x.count >= R.missedMin));
  const bySteps = new Map<string, MissedItem>();
  for (const a of misses) {
    const key = `${a.skill}|${a.step}`, g = bySteps.get(key) || { subject: 'math', where: nm.skill(a.skill), text: a.step || 'a step', count: 0, example: a.context ? `${shortText(a.context, 90)}${a.expected ? `: wrote ${a.answer || '—'}, answer ${a.expected}` : ''}` : undefined };
    g.count++; bySteps.set(key, g);
  }
  missed.push(...[...bySteps.values()].filter(x => x.count >= R.missedMin));
  const wordMiss = new Map<string, MissedItem>();
  for (const m of spells) { const w = str(m.w), g = wordMiss.get(w) || { subject: 'words', where: '🔤 Spelling', text: w, count: 0, example: `typed “${str(m.typed)}”` }; g.count++; wordMiss.set(w, g); }
  missed.push(...[...wordMiss.values()].filter(x => x.count >= R.missedMin));
  for (const book of arr(student.readingBooks).map(obj)) for (const q of arr(book.quizzes).map(obj)) {
    const t = num(q.at); if (t == null || !inWin(at(t).day)) continue;
    for (const x of arr(q.missed).map(str).filter(Boolean)) missed.push({ subject: 'reading', where: `📖 ${str(book.title)}`, text: shortText(x, 140), count: 1 });
  }
  /* Think it through: the last try's missed prompts, for sets she tried this week (when the miss log has none of them) */
  const thinkTried = new Set(events.filter(e => e.k === 'course' && e.kind === 'think').map(e => e.title));
  if (!missLog.some(m => str(m.w) === 'think')) for (const [key, v] of Object.entries(obj(student.mathThink))) {
    const [shop, st] = key.split(':'), label = nm.station(shop, num(st));
    if (![...thinkTried].some(t => label.includes(t) || t.includes(label.split(' · ').pop() || '¤'))) continue;
    for (const p of arr(obj(v).lastMissed).map(str).filter(Boolean).slice(0, 3)) missed.push({ subject: 'math', where: `${label} · Think it through`, text: shortText(p, 140), count: 1 });
  }
  missed.sort((a, b) => b.count - a.count);

  /* ---------- when she struggles ---------- */
  const bucketOf = (list: Item[], label: string): Bucket => { const right = sum(list.map(x => x.right)), total = sum(list.map(x => x.total)); return { label, right, total, pct: pct(right, total), enough: total >= R.minBucket }; };
  const verdictOf = (buckets: Bucket[], what: (best: Bucket, worst: Bucket) => string): { verdict: string; found: boolean } => {
    const ok = buckets.filter(b => b.enough);
    if (ok.length < 2) return { verdict: `Not enough data yet (each group needs ${R.minBucket} answers).`, found: false };
    const best = ok.reduce((a, b) => (b.pct! > a.pct! ? b : a)), worst = ok.reduce((a, b) => (b.pct! < a.pct! ? b : a));
    if (best.pct! - worst.pct! < R.minGapPts) return { verdict: `No clear difference (${ok.map(b => `${b.label} ${b.pct}%`).join(', ')}).`, found: false };
    return { verdict: what(best, worst), found: true };
  };
  const patterns: Pattern[] = [];
  { // time of day
    const groups: [string, (h: number) => boolean][] = [['Before 10 AM', h => h < 10], ['10 AM–noon', h => h >= 10 && h < 12], ['Noon–2 PM', h => h >= 12 && h < 14], ['After 2 PM', h => h >= 14]];
    const buckets = groups.map(([label, f]) => bucketOf(winItems.filter(x => f(x.hour)), label));
    const v = verdictOf(buckets, (b, w) => `Best ${whenText(b.label)} (${b.pct}% of ${b.total}); weakest ${whenText(w.label)} (${w.pct}% of ${w.total}).`);
    patterns.push({ id: 'time', title: 'Time of day', buckets, ...v });
  }
  /* position in her day: first subject, middle, last */
  const position = (x: Item) => { const seq = orderOf(x.day), i = seq.indexOf(x.subject); return i < 0 || seq.length < 2 ? '' : i === 0 ? 'first' : i === seq.length - 1 ? 'last' : 'middle'; };
  {
    const buckets = [bucketOf(winItems.filter(x => position(x) === 'first'), 'First subject'), bucketOf(winItems.filter(x => position(x) === 'middle'), 'Middle subjects'), bucketOf(winItems.filter(x => position(x) === 'last'), 'Last subject')];
    const v = verdictOf(buckets, (b, w) => `${b.label}: ${b.pct}% right; ${w.label.toLowerCase()}: ${w.pct}%.`);
    patterns.push({ id: 'position', title: 'Order in her day', buckets, ...v });
  }
  /* before and after breaks (brain stretches, stand-and-stretch, or a 30-minute pause) */
  const breaks: { from: number; to: number }[] = [];
  for (const day of windowDays) {
    const marks = timeline(day);
    for (const e of log[day]?.events || []) if (e.k === 'brain' || e.k === 'move') breaks.push({ from: e.t - 5 * 60000, to: e.t });
    for (let i = 1; i < marks.length; i++) if (marks[i].t - marks[i - 1].t >= R.gapBreakMins * 60000) breaks.push({ from: marks[i - 1].t, to: marks[i].t });
  }
  {
    const w = R.breakWindowMins * 60000;
    const before = winItems.filter(x => breaks.some(b => x.t <= b.from && x.t > b.from - w)), after = winItems.filter(x => breaks.some(b => x.t > b.to && x.t <= b.to + w));
    const buckets = [bucketOf(before, 'Before a break'), bucketOf(after, 'After a break')];
    const v = verdictOf(buckets, (b, wst) => `${b.label}: ${b.pct}% right; ${wst.label.toLowerCase()}: ${wst.pct}% (${R.breakWindowMins} minutes each side).`);
    patterns.push({ id: 'breaks', title: `Before and after breaks (${R.breakWindowMins} min)`, buckets, ...v });
  }
  { // day of the week, over two weeks
    const long = items.filter(x => x.day >= longFrom && x.day <= today);
    const buckets = [1, 2, 3, 4, 5, 6, 0].map(d => bucketOf(long.filter(x => weekdayOf(x.day) === d), WD[d])).filter(b => b.total > 0);
    const v = verdictOf(buckets, (b, wst) => `Best on ${WD_LONG[WD.indexOf(b.label)]} (${b.pct}%); weakest on ${WD_LONG[WD.indexOf(wst.label)]} (${wst.pct}%), last ${R.weekdayDays} days.`);
    patterns.push({ id: 'weekday', title: `Day of the week (last ${R.weekdayDays} days)`, buckets, ...v });
  }

  /* ---------- where her time goes ---------- */
  const subjIds = [...new Set(windowDays.flatMap(d => Object.keys(time[d] || {})))];
  const goalByDay = Object.fromEntries(windowDays.map(d => [d, planGoals(qx, d, names)]));
  const subjects: SubjectTimeRow[] = subjIds.map(id => {
    const perDay = windowDays.map(d => mins((time[d] || {})[id] || 0));
    const goalDays = windowDays.filter(d => (goalByDay[d][id] || 0) > 0 && days.find(x => x.day === d)?.active);
    const goal = goalDays.length ? sum(goalDays.map(d => goalByDay[d][id])) : null;
    const done = sum(goalDays.map(d => (time[d] || {})[id] || 0)) / 60;
    return { id, label: subjectLabel(id), minutes: sum(perDay), perDay, goal, goalDays: goalDays.length, ratio: goal ? Math.round(done / goal * 100) / 100 : null };
  }).sort((a, b) => b.minutes - a.minutes);
  for (const id of new Set(windowDays.flatMap(d => Object.keys(goalByDay[d])))) if (!subjects.some(s => s.id === id)) {
    const goalDays = windowDays.filter(d => (goalByDay[d][id] || 0) > 0 && days.find(x => x.day === d)?.active);
    if (goalDays.length) subjects.push({ id, label: subjectLabel(id), minutes: 0, perDay: windowDays.map(() => 0), goal: sum(goalDays.map(d => goalByDay[d][id])), goalDays: goalDays.length, ratio: 0 });
  }
  const totalSecs = sum(windowDays.map(daySecs));
  let gameSecs = 0;
  for (const d of windowDays) for (const [k, s] of Object.entries(log[d]?.places || {})) if (placeSubject(k) === 'games') gameSecs += s;
  const tsum = (id: string) => sum(windowDays.map(d => (time[d] || {})[id] || 0));
  const arcadeSecs = tsum('arcade'), townSecs = tsum('town'), breakSecs = tsum('brain');
  const share = { lessons: mins(Math.max(0, totalSecs - arcadeSecs - townSecs - breakSecs - gameSecs)), games: mins(gameSecs), arcade: mins(arcadeSecs), town: mins(townSecs), breaks: mins(breakSecs), total: mins(totalSecs) };
  const orderDays = windowDays.map(day => ({ day, label: dayLabel(day), seq: orderOf(day) })).filter(x => x.seq.length);
  const multi = orderDays.filter(x => x.seq.length >= 2);
  let orderVerdict = `Not enough data yet (needs ${R.orderMinDays} days with 2 or more subjects; has ${multi.length}).`;
  if (multi.length >= R.orderMinDays) {
    const firstCount = new Map<string, number>(), lastCount = new Map<string, number>();
    for (const x of multi) { firstCount.set(x.seq[0], (firstCount.get(x.seq[0]) || 0) + 1); const l = x.seq[x.seq.length - 1]; lastCount.set(l, (lastCount.get(l) || 0) + 1); }
    const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1])[0];
    const [f, fn] = top(firstCount), [l, ln] = top(lastCount);
    orderVerdict = `${fn * 2 > multi.length ? 'Usually starts' : 'Most often starts'} with ${subjectName(f)} (${fn} of ${multi.length} days) and ends with ${subjectName(l)} (${ln} of ${multi.length}).`;
  }
  /* idle: on screen minus active, from the practice sessions */
  let onScreen = 0, active = 0;
  for (const row of arr(obj(student.ss).recent)) { const r = arr(row), s = num(r[0]), e = num(r[1]), a = num(r[2]); if (s == null || e == null || a == null || !inWin(at(s).day)) continue; onScreen += Math.max(0, (e - s) / 1000); active += a; }
  const idle = { onScreen: mins(onScreen), active: mins(active), pct: onScreen >= 60 ? Math.max(0, Math.round((1 - active / onScreen) * 100)) : null };
  const emptyDays = days.filter(d => !d.active && d.day !== today && weekdayOf(d.day) % 6 !== 0).map(d => d.label);
  /* left partway: a lesson or quiz with 2+ minutes and nothing finished that day; stuck: 15+ minutes */
  const partway: Insights['time']['partway'] = [], stuck: Insights['time']['stuck'] = [];
  for (const day of windowDays) {
    const d = log[day]; if (!d) continue;
    for (const [key, secs] of Object.entries(d.places)) {
      const parts = key.split(':');
      let finished = true, subject = placeSubject(key);
      if (parts[0] === 'course' && parts.length >= 3) { const title = parts.slice(2).join(':'); finished = d.events.some(e => (e.k === 'course' || e.k === 'review') && e.course === parts[1] && e.title.slice(0, 50) === title); }
      else if (parts[0] === 'shop' && (parts[3] === 'quiz' || parts[3] === 'test')) finished = d.events.some(e => e.k === 'assess' && e.shop === parts[1] && (parts[3] === 'test' ? e.mode === 'test' : e.station === num(parts[2]) && e.mode === 'quiz'));
      else if (parts[0] === 'shop' && parts[3] === 'think') finished = d.events.some(e => e.k === 'course' && e.kind === 'think');
      else if (parts[0] === 'shop' && parts.length === 3) finished = !!d.counts[key];
      else if (parts[0] === 'project') finished = d.events.some(e => e.k === 'project' && e.course === parts[1]);
      else if (parts[0] === 'sim') finished = d.events.some(e => e.k === 'sim');
      else continue;
      if (subject === 'games' || finished) continue;
      if (secs >= R.stuckSecs) stuck.push({ label: nm.label(key), day: dayLabel(day), minutes: mins(secs) });
      else if (secs >= R.partwaySecs) partway.push({ subject, label: nm.label(key), day: dayLabel(day), minutes: mins(secs) });
    }
  }

  /* ---------- tool use ---------- */
  const inWinT = (t: unknown) => { const n = num(t); return n != null && inWin(at(n).day); };
  const daysOf = (ts: number[]) => new Set(ts.map(t => at(t).day)).size;
  const tool = (id: string, emoji: string, label: string, ts: number[], unused: string): ToolRow => ({ id, emoji, label, count: ts.length, days: daysOf(ts), note: ts.length ? `${plural(ts.length, 'time')} on ${plural(daysOf(ts), 'day')}` : activeDays ? `not used in ${R.windowDays} days` : unused });
  const flaggedT = arr(vocab.flagged).map(obj).map(f => num(f.at)).filter((t): t is number => t != null && inWinT(t));
  const lookedT = arr(vocab.lookedUp).map(obj).map(f => num(f.at)).filter((t): t is number => t != null && inWinT(t));
  const helpT = arr(student.help).map(obj).map(q => num(q.at)).filter((t): t is number => t != null && inWinT(t));
  const hintT = events.filter(e => e.k === 'gate' && /💡/.test(e.title + e.text)).map(e => e.t);
  const videoDays = Object.entries(obj(student.videosWatched)).filter(([, d]) => typeof d === 'string' && inWin(d));
  const watchT = events.filter(e => e.k === 'watch').map(e => e.t);
  const reviewT = events.filter(e => e.k === 'review' || (e.k === 'course' && e.kind === 'review')).map(e => e.t);
  const brainT = events.filter(e => e.k === 'brain').map(e => e.t), moveT = events.filter(e => e.k === 'move').map(e => e.t);
  const tools: ToolRow[] = [
    tool('flag', '📌', 'Word flags (words she didn’t know)', flaggedT, 'no data yet'),
    tool('lookup', '📖', 'Meaning look-ups (📌 on a known word)', lookedT, 'no data yet'),
    tool('help', '✋', 'Questions for a grown-up', helpT, 'no data yet'),
    tool('hint', '💡', 'Written-answer hints (grown-up PIN)', hintT, 'no data yet'),
    { id: 'video', emoji: '🎬', label: 'Lesson videos watched', count: videoDays.length, days: new Set(videoDays.map(([, d]) => d)).size, note: videoDays.length ? `${plural(videoDays.length, 'video')} on ${plural(new Set(videoDays.map(([, d]) => d)).size, 'day')}${watchT.length ? ` · opened Khan lessons ${plural(watchT.length, 'time')}` : ''}` : watchT.length ? `opened Khan lessons ${plural(watchT.length, 'time')}, none watched to the end in Pet World` : activeDays ? `not used in ${R.windowDays} days` : 'no data yet' },
    tool('review', '📇', 'Review flashcards', reviewT, 'no data yet'),
    tool('brain', '🧠', 'Brain stretches', brainT, 'no data yet'),
    tool('move', '🤸', 'Stand-and-stretch breaks', moveT, 'no data yet')
  ];

  /* ---------- wins ---------- */
  const wins: Win[] = [];
  for (const e of events.filter(e => isTest(e) && e.passed)) wins.push({ emoji: e.mode === 'test' || e.kind === 'final' ? '🏆' : '🏅', text: `Passed ${passedText(e)} (${dayLabel(e.day)})` });
  for (const e of events.filter(e => e.k === 'mastered' || (e.k === 'course' && e.kind === 'practice' && e.first))) wins.push({ emoji: '⭐', text: `${e.k === 'mastered' ? 'Mastered' : 'First pass'}: ${e.k === 'mastered' ? (e.title || nm.skill(str(e.raw.skill))) : `${nm.course(e.course)} · ${e.title}`} (${dayLabel(e.day)})` });
  for (const [, g] of groupLessons(events)) {   // turned around: started under 70%, latest round 80%+
    const r = g.rounds; if (r.length < 2) continue;
    const first = r[0], last = r[r.length - 1];
    if (first.total >= 3 && last.total >= 3 && first.right / first.total < R.lessonStrugglePct / 100 && last.right / last.total >= 0.8) wins.push({ emoji: '📈', text: `Turned around: ${g.label} (${pct(first.right, first.total)}% → ${pct(last.right, last.total)}%)` });
  }
  if (problems.length) {   // math skills she used to miss and now gets right
    const bySkill = new Map<string, boolean[]>();
    for (const p of problems.filter(p => inWin(p.day))) bySkill.set(p.skill, [...(bySkill.get(p.skill) || []), p.perfect]);
    for (const [skill, list] of bySkill) { if (list.length < 6) continue; const early = list.slice(0, list.length - 4), late = list.slice(-4); if (early.filter(Boolean).length / early.length < 0.6 && late.every(Boolean)) wins.push({ emoji: '📈', text: `${nm.skill(skill)}: now 4 in a row perfect (was ${pct(early.filter(Boolean).length, early.length)}%)` }); }
  }
  let streak = 0;
  for (let d = (daySecs(today) >= R.activeDaySecs ? today : addDays(today, -1)); daySecs(d) >= R.activeDaySecs; d = addDays(d, -1)) streak++;
  if (streak >= 3) wins.push({ emoji: '🔥', text: `${streak} days in a row with work` });
  const doneRows = events.filter(e => e.k === 'done').length;
  if (doneRows) wins.push({ emoji: '✅', text: `${plural(doneRows, 'plan item')} finished in ${R.windowDays} days` });

  /* ---------- recommendations ---------- */
  const plan: Rec[] = [], app: Rec[] = [];
  /* move a subject earlier (or later): its accuracy when first vs when last */
  for (const id of MAIN_SUBJECTS) {
    const mine = winItems.filter(x => x.subject === id), first = bucketOf(mine.filter(x => position(x) === 'first'), 'first'), last = bucketOf(mine.filter(x => position(x) === 'last'), 'last');
    if (!first.enough || !last.enough) continue;
    const gap = first.pct! - last.pct!;
    if (Math.abs(gap) < R.minGapPts) continue;
    const n = Math.min(first.total, last.total);
    plan.push(gap > 0
      ? { kind: 'plan', text: `Move ${subjectName(id).toLowerCase()} earlier: ${first.pct}% right when it’s first, ${last.pct}% when it’s last.`, evidence: `${first.right}/${first.total} first, ${last.right}/${last.total} last, last ${R.windowDays} days`, confidence: confidenceOf(n, R.minBucket) }
      : { kind: 'plan', text: `${subjectName(id)} goes better later in her day: ${last.pct}% when it’s last, ${first.pct}% when it’s first. Maybe warm up with something else.`, evidence: `${last.right}/${last.total} last, ${first.right}/${first.total} first`, confidence: confidenceOf(n, R.minBucket) });
  }
  const timeP = patterns.find(p => p.id === 'time')!;
  if (timeP.found) {
    const ok = timeP.buckets.filter(b => b.enough), best = ok.reduce((a, b) => (b.pct! > a.pct! ? b : a)), worst = ok.reduce((a, b) => (b.pct! < a.pct! ? b : a));
    plan.push({ kind: 'plan', text: `Put the hardest work ${whenText(best.label)}: ${best.pct}% right then, ${worst.pct}% ${whenText(worst.label)}.`, evidence: `${best.right}/${best.total} vs ${worst.right}/${worst.total}`, confidence: confidenceOf(Math.min(best.total, worst.total), R.minBucket) });
  }
  const breakP = patterns.find(p => p.id === 'breaks')!;
  if (breakP.found) {
    const [b, a] = breakP.buckets;
    plan.push(a.pct! > b.pct!
      ? { kind: 'plan', text: `Breaks help: ${a.pct}% right just after a break, ${b.pct}% just before one. Keep them, or add one sooner.`, evidence: `${a.right}/${a.total} after, ${b.right}/${b.total} before`, confidence: confidenceOf(Math.min(a.total, b.total), R.minBucket) }
      : { kind: 'plan', text: `She’s slow to restart after breaks: ${a.pct}% right in the first ${R.breakWindowMins} min after, ${b.pct}% before. Start back with something easy.`, evidence: `${a.right}/${a.total} after, ${b.right}/${b.total} before`, confidence: confidenceOf(Math.min(a.total, b.total), R.minBucket) });
  }
  for (const s of subjects) {
    if (s.goal == null || s.goalDays < R.goalMinDays || s.goal / s.goalDays < R.goalMinMinutes || s.ratio == null) continue;
    const actual = Math.round(s.ratio * s.goal);
    if (s.ratio >= R.goalOverRatio) plan.push({ kind: 'plan', text: `${subjectName(s.id)} takes ${s.ratio >= 1.9 ? `${Math.round(s.ratio * 10) / 10}×` : `${Math.round((s.ratio - 1) * 100)}% more than`} its goal. Raise the goal, or split it across two days.`, evidence: `${actual} min against ${s.goal} min planned on ${plural(s.goalDays, 'day')}`, confidence: confidenceOf(s.goalDays, R.goalMinDays - 1) });
    else if (s.ratio <= R.goalUnderRatio) plan.push({ kind: 'plan', text: `${subjectName(s.id)} falls short: ${Math.round(s.ratio * 100)}% of its planned time.`, evidence: `${actual} min of ${s.goal} min planned on ${plural(s.goalDays, 'day')}`, confidence: confidenceOf(s.goalDays, R.goalMinDays - 1) });
  }
  for (const s of struggles.filter(s => s.kind !== 'quiz' && s.kind !== 'written').slice(0, 3)) plan.push({ kind: 'plan', text: /[.!?]$/.test(s.action) ? s.action : s.action + '.', evidence: s.detail, confidence: s.confidence });
  let extras: unknown[] = [];
  try { extras = arr(JSON.parse(qx.extras || '[]')); } catch { extras = []; }
  if (extras.length && activeDays >= R.toolMinActiveDays) {
    const workDays = days.filter(d => d.active), noWarm = workDays.filter(d => !(log[d.day]?.events || []).some(e => e.k === 'sprint' || e.k === 'vocab'));
    if (noWarm.length >= 2) plan.push({ kind: 'plan', text: `She skipped the warm-up ${noWarm.length} of ${workDays.length} days.`, evidence: `No Fact Sprint or Word Workshop round on ${noWarm.map(d => d.label).join(', ')}`, confidence: noWarm.length >= 3 ? 'high' : 'medium' });
  }
  if (activeDays && emptyDays.length >= 2) plan.push({ kind: 'plan', text: `No Pet World work on ${emptyDays.join(', ')}.`, evidence: `Under ${R.activeDaySecs / 60} active minutes on those weekdays`, confidence: 'high' });

  /* ideas for the app */
  if (activeDays >= R.toolMinActiveDays) {
    const conf: Confidence = activeDays >= 5 ? 'high' : activeDays >= 4 ? 'medium' : 'low';
    if (!flaggedT.length && !lookedT.length) app.push({ kind: 'app', text: 'She never uses 📌 to look up a word. Maybe a reminder on reading-heavy screens, or a short how-to.', evidence: `0 flags and 0 look-ups on ${activeDays} work days`, confidence: conf });
    const histSci = sum(['history', 'science'].map(tsum));
    if (histSci >= 30 * 60 && !videoDays.length) app.push({ kind: 'app', text: 'She spends time in History/Science but hasn’t finished a lesson video there. The 🎬 Watch first prompt may need to be stronger.', evidence: `${mins(histSci)} min in History and Science, 0 videos watched`, confidence: conf });
    const brainOn = obj(student.brainOn).enabled === true;
    if (brainOn && !brainT.length) app.push({ kind: 'app', text: 'Brain stretches are on for the class, but none were done. Check that the break shows up after her first subject.', evidence: `0 brain stretches on ${activeDays} work days`, confidence: conf });
  }
  if (share.total >= R.arcadeMinMinutes && share.arcade * 100 / share.total >= R.arcadeSharePct) app.push({ kind: 'app', text: `She spends ${Math.round(share.arcade * 100 / share.total)}% of her time in the 🕹️ Arcade. Consider a daily cap or making it cost more practice.`, evidence: `${share.arcade} of ${share.total} min`, confidence: share.total >= 3 * R.arcadeMinMinutes ? 'high' : 'medium' });
  const partBySubject = new Map<string, typeof partway>();
  for (const p of partway) partBySubject.set(p.subject, [...(partBySubject.get(p.subject) || []), p]);
  for (const [subject, list] of partBySubject) {
    const nDays = new Set(list.map(p => p.day)).size;
    if (list.length >= R.partwayMin && nDays >= R.partwayMinDays) app.push({ kind: 'app', text: `She leaves ${subjectName(subject)} lessons partway (${list.length} times). Shorter rounds, or saving her place, might help.`, evidence: [...new Set(list.map(p => p.label))].slice(0, 3).map(label => { const mine = list.filter(p => p.label === label); return `${label}: ${plural(mine.length, 'time')}, ${sum(mine.map(p => p.minutes))} min with no finish (${mine.map(p => p.day.split(' ')[0]).join(', ')})`; }).join('; '), confidence: confidenceOf(list.length, R.partwayMin) });
  }
  for (const s of stuck.slice(0, 2)) app.push({ kind: 'app', text: `She may be stuck on “${s.label}”: ${s.minutes} min there on ${s.day} with nothing finished.`, evidence: `${s.minutes} min, no score or finish logged that day`, confidence: s.minutes >= 2 * R.stuckSecs / 60 ? 'high' : 'medium' });
  const helpPlaces = new Map<string, number>(), bugs: string[] = [];
  for (const q of arr(student.help).map(obj)) { if (!inWinT(q.at)) continue; const l = str(q.label) || 'Pet World'; helpPlaces.set(l, (helpPlaces.get(l) || 0) + 1); if (q.kind === 'bug') bugs.push(`${l}: “${shortText(str(q.text), 60)}”`); }
  for (const [place, n] of helpPlaces) if (n >= 2) app.push({ kind: 'app', text: `${n} ✋ questions from the same place: ${place}. The instructions there may need work.`, evidence: `${n} questions in ${R.windowDays} days`, confidence: n >= 3 ? 'high' : 'medium' });
  if (bugs.length) app.push({ kind: 'app', text: `She reported something not working (🐞): ${bugs.slice(0, 2).join('; ')}.`, evidence: `${plural(bugs.length, 'report')} in ${R.windowDays} days`, confidence: 'high' });
  if (idle.pct != null && idle.onScreen >= R.idleMinMinutes && idle.pct >= R.idleSharePct) app.push({ kind: 'app', text: `Pet World is open but idle ${idle.pct}% of the time. A “still there?” nudge, or shorter sittings, might help.`, evidence: `${idle.onScreen} min on screen, ${idle.active} min active (recent sessions)`, confidence: idle.onScreen >= 3 * R.idleMinMinutes ? 'high' : 'medium' });

  if (!activeDays) dataNotes.push(`No work recorded in the last ${R.windowDays} days.`);
  return {
    name: student.n, generatedAt: now, tz, today: todayRow, days, window: { from, to: today, activeDays },
    struggles: struggles.slice(0, 8), missed: missed.slice(0, 10), patterns,
    time: { subjects, totalMinutes: mins(totalSecs), order: { days: orderDays.map(x => ({ ...x, seq: x.seq.map(subjectLabel) })), verdict: orderVerdict }, share, idle, emptyDays, partway, stuck },
    tools, wins: wins.slice(0, 10), recs: { plan: plan.slice(0, 8), app: app.slice(0, 8) }, dataNotes
  };

  /* lessons (practice and Think it through rounds), grouped */
  function groupLessons(list: Ev[]) {
    const out = new Map<string, { label: string; subject: string; right: number; total: number; tries: number; days: Set<string>; rounds: { right: number; total: number }[] }>();
    for (const e of list) {
      if (e.k !== 'course' || (e.kind !== 'practice' && e.kind !== 'think') || e.n == null || e.n <= 0 || e.s == null) continue;
      const key = `${e.course}|${e.title}|${e.kind}`, g = out.get(key) || { label: e.kind === 'think' ? `${e.title || nm.course(e.course)} · Think it through` : `${nm.course(e.course)} · ${e.title}`, subject: e.subject, right: 0, total: 0, tries: 0, days: new Set<string>(), rounds: [] };
      g.right += e.s; g.total += e.n; g.tries++; g.days.add(e.day); g.rounds.push({ right: e.s, total: e.n }); out.set(key, g);
    }
    return out;
  }
}

/* ---------- save → report fields (the teacher app and the email read the same ones) ---------- */
/** The save fields Insights reads, cleaned up. main.ts copies the ones it doesn't already copy; the email function copies all. */
export function insightsSaveFields(state: unknown) {
  const s = obj(state);
  return {
    readingBooks: arr(s.readingBooks), elaProgress: obj(s.elaProgress), historyProgress: obj(s.historyProgress), scienceProgress: obj(s.scienceProgress),
    help: arr(s.help), writtenAnswers: arr(s.writtenAnswers), mathThink: obj(s.mathThink), subjectTime: obj(s.subjectTime), dayLog: obj(s.dayLog),
    brain: s.brain ?? null, vocab: obj(s.vocab), videosWatched: obj(s.videosWatched), cardStats: obj(s.cardStats), missLog: arr(s.missLog)
  };
}
/** Rows from the problems or attempts table, grouped by student (for rp and ra). */
export function rowsByStudent(rows: unknown): Map<string, Record<string, unknown>[]> {
  const out = new Map<string, Record<string, unknown>[]>();
  for (const r of arr(rows).map(obj)) { const id = str(r.student_id); if (!id) continue; const list = out.get(id) || []; list.push(r); out.set(id, list); }
  return out;
}
/** How far back the problems and attempts rows need to go (a day of margin for time zones). */
export const insightsSince = (now = Date.now()) => new Date(now - (INSIGHT_RULES.windowDays + 1) * 86400000).toISOString();

/* ---------- the email (inline styles and tables only, so mail apps show it the same) ---------- */
const escHTML = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const CONF_MARK: Record<Confidence, string> = { high: '●●●', medium: '●●○', low: '●○○' };
/** One email for one grown-up: a section per student. */
export function insightsEmailHTML(list: { ins: Insights }[], opts: { title?: string; appUrl?: string; className?: string } = {}) {
  const p = (html: string, style = '') => `<p style="margin:0 0 8px;${style}">${html}</p>`;
  const h = (text: string) => `<h3 style="margin:18px 0 6px;font-size:16px;color:#A8304F">${escHTML(text)}</h3>`;
  const bar = (value: number, top: number) => `<span style="display:inline-block;height:8px;width:${Math.max(2, Math.round(80 * value / Math.max(1, top)))}px;background:#D94C71;border-radius:4px;vertical-align:middle"></span>`;
  const recRow = (r: Rec) => `<li style="margin:0 0 8px">${escHTML(r.text)}<br><span style="color:#76605C;font-size:13px">${escHTML(r.evidence)} · <span title="confidence">${CONF_MARK[r.confidence]} ${r.confidence}</span></span></li>`;
  const sections = list.map(({ ins }) => {
    const t = ins.today, top = Math.max(1, ...ins.days.map(d => d.minutes));
    const dayRows = ins.days.map(d => `<tr><td style="padding:2px 8px 2px 0;color:#76605C">${escHTML(d.label)}</td><td style="padding:2px 8px 2px 0">${bar(d.minutes, top)} ${d.minutes} min</td><td style="padding:2px 0;color:#76605C">${d.total ? `${pct(d.right, d.total)}% right (${d.right}/${d.total})` : d.active ? 'no scores' : '—'}</td></tr>`).join('');
    const found = ins.patterns.filter(x => x.found);
    return `<div style="border:1px solid #E9D6DC;border-radius:12px;padding:16px;margin:0 0 18px;background:#fff">
      <h2 style="margin:0 0 6px;font-size:20px;color:#3B2724">📈 ${escHTML(ins.name)}</h2>
      ${p(`<b>Today (${escHTML(t.label)}):</b> ${t.minutes} min${t.total ? ` · ${pct(t.right, t.total)}% right (${t.right}/${t.total})` : ''}${t.subjects.length ? ` · ${t.subjects.map(s => `${escHTML(s.label)} ${s.minutes}`).join(', ')}` : ''}${t.firstSubject ? ` · started with ${escHTML(t.firstSubject)}` : ''}`)}
      ${t.passed.length ? p(`🏅 ${t.passed.map(escHTML).join('<br>🏅 ')}`) : ''}${t.flags.length ? p(`⚠️ ${t.flags.map(escHTML).join('<br>⚠️ ')}`) : ''}
      ${h(`Last ${ins.days.length} days`)}<table style="border-collapse:collapse;font-size:14px">${dayRows}</table>
      ${ins.struggles.length ? `${h('Struggles')}<ol style="margin:0;padding-left:20px">${ins.struggles.slice(0, 5).map(s => `<li style="margin:0 0 6px"><b>${escHTML(s.title)}</b><br><span style="color:#76605C;font-size:13px">${escHTML(s.detail)}</span></li>`).join('')}</ol>` : `${h('Struggles')}${p('Nothing stands out.', 'color:#76605C')}`}
      ${ins.missed.length ? `${h('Missed most')}<ul style="margin:0;padding-left:20px">${ins.missed.slice(0, 5).map(m => `<li style="margin:0 0 4px">${escHTML(m.text)} <span style="color:#76605C;font-size:13px">· ${escHTML(m.where)}${m.count > 1 ? ` · ${m.count}×` : ''}${m.example ? ` · ${escHTML(m.example)}` : ''}</span></li>`).join('')}</ul>` : ''}
      ${h('When she struggles')}${found.length ? found.map(x => p(`<b>${escHTML(x.title)}:</b> ${escHTML(x.verdict)}`)).join('') : p('No clear pattern yet (each group needs enough answers).', 'color:#76605C')}
      ${h('Time and order')}${p(`${ins.time.totalMinutes} min in ${ins.days.length} days · lessons ${ins.time.share.lessons} · unit games ${ins.time.share.games} · Arcade ${ins.time.share.arcade}`)}${p(escHTML(ins.time.order.verdict), 'color:#76605C')}
      ${h('Tools')}${p(ins.tools.map(x => `${x.emoji} ${escHTML(x.label.split(' (')[0])}: ${escHTML(x.note)}`).join('<br>'), 'font-size:14px')}
      ${ins.wins.length ? `${h('Worth noting')}${p(ins.wins.slice(0, 5).map(w => `${w.emoji} ${escHTML(w.text)}`).join('<br>'))}` : ''}
      ${h('Recommendations for her plan')}${ins.recs.plan.length ? `<ul style="margin:0;padding-left:20px">${ins.recs.plan.map(recRow).join('')}</ul>` : p('None yet: not enough data for a confident suggestion.', 'color:#76605C')}
      ${h('Ideas for the app')}${ins.recs.app.length ? `<ul style="margin:0;padding-left:20px">${ins.recs.app.map(recRow).join('')}</ul>` : p('None this time.', 'color:#76605C')}
    </div>`;
  }).join('');
  const title = opts.title || 'Pet World daily insights';
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escHTML(title)}</title></head>
<body style="margin:0;padding:0;background:#FBF3F5;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#3B2724;line-height:1.45">
<div style="max-width:640px;margin:0 auto;padding:16px">
<h1 style="font-size:22px;margin:0 0 4px">${escHTML(title)}</h1>
<p style="margin:0 0 16px;color:#76605C;font-size:13px">${opts.className ? `${escHTML(opts.className)} · ` : ''}Rolling ${INSIGHT_RULES.windowDays} days, built-in rules (no AI). ●●● = strong evidence, ●○○ = just enough.${opts.appUrl ? ` <a href="${escHTML(opts.appUrl)}" style="color:#A8304F">Open the teacher app</a>` : ''}</p>
${sections || '<p>No students yet.</p>'}
<p style="color:#76605C;font-size:12px">You get this because the daily insights email is on in Pet World’s class Settings. Turn it off there.</p>
</div></body></html>`;
}
