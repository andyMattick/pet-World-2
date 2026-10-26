/* 🎡 The class wheel (docs/CLASS-WHEEL.md). Every school day (Monday to Friday), right after the grown-up's theme and
   end-of-day question, a wheel picks the day's classes: by default 3 of the 4 core classes (on Pet World) and 1 of the 3
   electives (done away from Pet World; she writes what she did). It looks random to her, but the picks follow rules a
   grown-up can change in the teacher app (WheelRules). With the defaults:
   - Core: one class sits out each day, the one that has sat out the fewest times this week (ties are random), so over
     a week three meet 4 times and one meets 3 times.
   - A class with its Pet World review or test waiting always meets (a Khan unit test doesn't count). The next school day it sits out (unless
     its test is still waiting).
   - A class that sat out the last school day meets today.
   - The class that met the fewest times last week meets on Monday and isn't the one that sits out twice again.
   - Electives: one that hasn't met in the last 2 school days meets today (each meets at least once every 3 school
     days), otherwise the one that has met the fewest times this week (not yesterday's). That's 2, 2 and 1 a week, and
     the one that met once goes first the next week.
   A grown-up can change the day's picks; the next days work from what really happened (the log). */

export const CORE_CLASSES: [string, string][] = [['math', '➗ Math'], ['english', '📚 English'], ['history', '🏛️ History'], ['biology', '🦁 Biology']];
export const DEFAULT_ELECTIVES = ['Spanish', 'Art', 'Computer Science'];
const CORE_IDS = CORE_CLASSES.map(([id]) => id);

/** the grown-up's rules, saved with the daily plan (quiz_overrides.plan.wheel) */
export interface WheelRules {
  on: boolean;
  core: string[];            // the core classes on the wheel
  corePerDay: number;        // how many core classes meet each day
  electives: string[];       // elective names (done away from Pet World)
  electivesPerDay: number;
  electiveMinutes: number;
  coreMinutes: number;       // for a core class with no minutes on the plan
  testsMeet: boolean;        // a class with its Pet World review or test waiting always meets
  restAfterTest: boolean;    // ...and sits out the next school day
  satOutMeets: boolean;      // a class that sat out the last school day meets today
  fewestFirst: boolean;      // last week's fewest meets on Monday, and isn't the short one again
  electiveGap: number;       // each elective meets at least once every this many school days (0 = no rule)
}
export const DEFAULT_WHEEL: WheelRules = { on: false, core: CORE_IDS, corePerDay: 3, electives: DEFAULT_ELECTIVES, electivesPerDay: 1, electiveMinutes: 30, coreMinutes: 30, testsMeet: true, restAfterTest: true, satOutMeets: true, fewestFirst: true, electiveGap: 3 };

const int = (v: unknown, lo: number, hi: number, d: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const bool = (v: unknown, d: boolean) => typeof v === 'boolean' ? v : d;
export function wheelRules(raw: unknown): WheelRules {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Partial<WheelRules>, d = DEFAULT_WHEEL;
  const core = Array.isArray(o.core) ? CORE_IDS.filter(id => o.core!.includes(id)) : d.core;
  const electives = Array.isArray(o.electives) ? [...new Set(o.electives.map(x => String(x).trim().slice(0, 40)).filter(Boolean))].slice(0, 8) : d.electives;
  return {
    on: bool(o.on, d.on), core: core.length ? core : d.core, corePerDay: int(o.corePerDay, 0, 4, d.corePerDay), electives,
    electivesPerDay: int(o.electivesPerDay, 0, 4, d.electivesPerDay), electiveMinutes: int(o.electiveMinutes, 5, 240, d.electiveMinutes), coreMinutes: int(o.coreMinutes, 5, 240, d.coreMinutes),
    testsMeet: bool(o.testsMeet, d.testsMeet), restAfterTest: bool(o.restAfterTest, d.restAfterTest), satOutMeets: bool(o.satOutMeets, d.satOutMeets), fewestFirst: bool(o.fewestFirst, d.fewestFirst),
    electiveGap: int(o.electiveGap, 0, 10, d.electiveGap)
  };
}

/** one school day's classes: c = core classes that meet, e = electives, t = core classes with a test waiting that day, o = a grown-up changed them */
export interface WheelDay { c: string[]; e: string[]; t?: string[]; o?: 1 }
export type WheelLog = Record<string, WheelDay>;
export interface WheelPick { core: string[]; electives: string[]; tests: string[] }

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const at = (day: string) => new Date(`${day}T12:00:00`);
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const isSchoolDay = (day: string) => { const w = at(day).getDay(); return w >= 1 && w <= 5; };
/** the Monday of the week that holds day */
export function weekOf(day: string): string { const d = at(day); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return key(d); }
const addDays = (day: string, n: number) => { const d = at(day); d.setDate(d.getDate() + n); return key(d); };

export function normalizeWheelLog(raw: unknown): WheelLog {
  const out: WheelLog = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const day of Object.keys(raw as object).filter(d => DAY.test(d)).sort().slice(-40)) {
    const v = (raw as Record<string, Partial<WheelDay> & { e?: unknown }>)[day];
    if (!v || !Array.isArray(v.c)) continue;
    const e = (Array.isArray(v.e) ? v.e : typeof v.e === 'string' && v.e ? [v.e] : []).map(x => String(x).slice(0, 40)).slice(0, 8);
    out[day] = { c: CORE_IDS.filter(id => v.c!.includes(id)), e, ...(Array.isArray(v.t) && v.t.length ? { t: CORE_IDS.filter(id => v.t!.includes(id)) } : {}), ...(v.o ? { o: 1 as const } : {}) };
  }
  return out;
}

/** today's picks from what really happened on earlier school days. tests = core classes with a Pet World review or test waiting today. */
export function pickClasses(day: string, log: WheelLog, rules: WheelRules, tests: string[] = [], rand: () => number = Math.random): WheelPick {
  const earlier = Object.keys(log).filter(d => d < day).sort();
  const prev = earlier[earlier.length - 1], week = weekOf(day), thisWeek = earlier.filter(d => d >= week);
  const lastWeek = earlier.filter(d => d >= addDays(week, -7) && d < week);
  const shuffle = <T>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const core = rules.core, k = Math.min(rules.corePerDay, core.length), testing = rules.testsMeet ? core.filter(id => tests.includes(id)) : [];

  /* core */
  const sat = (id: string) => thisWeek.filter(d => !log[d].c.includes(id)).length;
  const met = (id: string, days: string[]) => days.filter(d => log[d].c.includes(id)).length;
  const fewest = rules.fewestFirst && lastWeek.length ? core.filter(id => met(id, lastWeek) === Math.min(...core.map(id2 => met(id2, lastWeek)))) : [];
  const owed = fewest.length && fewest.length < core.length ? fewest : [];
  const satOut = rules.satOutMeets && prev ? core.filter(id => !log[prev].c.includes(id)) : [];
  const rest = rules.restAfterTest && prev ? core.filter(id => (log[prev].t || []).includes(id) && log[prev].c.includes(id) && !testing.includes(id)) : [];
  const meet = new Set<string>(testing);   // a test never sits out
  for (const id of [...satOut, ...(thisWeek.length ? [] : owed)]) if (meet.size < k && !rest.includes(id)) meet.add(id);
  const outToday = new Set<string>(rest.filter(id => !meet.has(id)).slice(0, core.length - k));   // rests after a test
  /* the rest sit out by fewest sit-outs this week; a second sit-out isn't given to last week's short class or yesterday's sit-out */
  const free = core.filter(id => !meet.has(id) && !outToday.has(id));
  const ranked = shuffle(free).sort((a, b) => (sat(a) + (owed.includes(a) ? .5 : 0)) - (sat(b) + (owed.includes(b) ? .5 : 0)));
  while (core.length - outToday.size > Math.max(k, meet.size) && ranked.length) outToday.add(ranked.shift()!);
  const coreToday = core.filter(id => !outToday.has(id));

  /* electives */
  const list = rules.electives, m = Math.min(rules.electivesPerDay, list.length), picked: string[] = [];
  const lastSeen = (e: string) => { for (let i = earlier.length - 1; i >= 0; i--) if (log[earlier[i]].e.includes(e)) return i; return -1; };
  if (rules.electiveGap > 1 && earlier.length >= rules.electiveGap - 1) {
    const recent = earlier.slice(-(rules.electiveGap - 1));
    list.filter(e => !recent.some(d => log[d].e.includes(e))).sort((a, b) => lastSeen(a) - lastSeen(b)).forEach(e => { if (picked.length < m) picked.push(e); });
  }
  const count = (e: string, days: string[]) => days.filter(d => log[d].e.includes(e)).length;
  const lastWeekLeast = rules.fewestFirst && !thisWeek.length && lastWeek.length ? list.filter(e => count(e, lastWeek) === Math.min(...list.map(x => count(x, lastWeek)))) : [];
  const yesterday = (e: string) => !!prev && log[prev].e.includes(e);
  const rest2 = shuffle(list.filter(e => !picked.includes(e))).sort((a, b) =>
    (lastWeekLeast.includes(b) ? 1 : 0) - (lastWeekLeast.includes(a) ? 1 : 0) || count(a, thisWeek) - count(b, thisWeek) || (yesterday(a) ? 1 : 0) - (yesterday(b) ? 1 : 0) || lastSeen(a) - lastSeen(b));
  while (picked.length < m && rest2.length) picked.push(rest2.shift()!);
  return { core: coreToday, electives: picked, tests: testing };
}
