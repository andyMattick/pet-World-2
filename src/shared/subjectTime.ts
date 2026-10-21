/* Practice time by subject, per day (docs: PRACTICE-TIME.md, "Time by subject").
   The game credits each 15 seconds of active time to whatever is on screen, and saves the totals in the town as
   S.subjectTime = { 'YYYY-MM-DD': { math: seconds, english: seconds, ... } } (the student's own dates, the last 60 days).
   Shared by the grown-ups' progress report (game) and the teacher's student page. */

export const SUBJECT_TIME: [string, string][] = [
  ['math', '➗ Math'], ['english', '📚 English'], ['reading', '📖 Reading Log'], ['words', '🔤 Word Workshop'], ['facts', '⚡ Fact Sprint'],
  ['history', '🏛️ History'], ['science', '🦁 Science'], ['brain', '🧠 Brain stretch'], ['arcade', '🕹️ Arcade'], ['town', '🏠 Around town']
];
export type SubjectTime = Record<string, Record<string, number>>;
const SUBJECT_IDS = new Set(SUBJECT_TIME.map(([id]) => id));
export const SUBJECT_TIME_DAYS = 60;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Day key in the browser's own time zone, like "2026-10-13". */
export const subjectDayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function normalizeSubjectTime(raw: unknown): SubjectTime {
  const out: SubjectTime = {};
  if (!raw || typeof raw !== 'object') return out;
  const days = Object.keys(raw as object).filter(day => DAY.test(day)).sort().slice(-SUBJECT_TIME_DAYS);
  for (const day of days) {
    const row = (raw as Record<string, unknown>)[day];
    if (!row || typeof row !== 'object') continue;
    const clean: Record<string, number> = {};
    for (const [id, secs] of Object.entries(row as Record<string, unknown>)) {
      const n = Math.floor(Number(secs));
      if (SUBJECT_IDS.has(id) && Number.isFinite(n) && n > 0) clean[id] = Math.min(n, 86400);
    }
    if (Object.keys(clean).length) out[day] = clean;
  }
  return out;
}

/** Add active seconds to today's total for one subject. */
export function addSubjectTime(store: SubjectTime, subject: string, seconds: number, date = new Date()) {
  if (!SUBJECT_IDS.has(subject) || !(seconds > 0)) return;
  const day = subjectDayKey(date), row = store[day] || (store[day] = {});
  row[subject] = Math.min(86400, (row[subject] || 0) + seconds);
  const days = Object.keys(store).sort();
  for (const old of days.slice(0, Math.max(0, days.length - SUBJECT_TIME_DAYS))) delete store[old];
}

/** Two devices: both saves share their history, so for each day and subject keep the larger total. Returns how many changed. */
export function mergeSubjectTime(base: SubjectTime, other: unknown): number {
  let n = 0;
  for (const [day, row] of Object.entries(normalizeSubjectTime(other))) {
    for (const [id, secs] of Object.entries(row)) {
      if (secs > (base[day]?.[id] || 0)) { (base[day] = base[day] || {})[id] = secs; n++; }
    }
  }
  return n;
}

/* daily minute goals per subject (ROADMAP F8), set by a grown-up for one student and saved in quiz_overrides as
   "subjectGoals" = JSON {base:{math:20, ...}, days:{"2026-10-17":{math:0}}}. A day's value (0 too) replaces the every-day value. */
export const GOAL_SUBJECTS = SUBJECT_TIME.filter(([id]) => id !== 'brain' && id !== 'arcade' && id !== 'town' && id !== 'facts');   // Fact Sprint time is set as a warm-up extra instead
export interface SubjectGoals { base: Record<string, number>; days: Record<string, Record<string, number>> }
const GOAL_IDS = new Set(GOAL_SUBJECTS.map(([id]) => id));
function cleanGoals(row: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (row && typeof row === 'object') for (const [id, v] of Object.entries(row as Record<string, unknown>)) {
    const n = Math.round(Number(v)); if (GOAL_IDS.has(id) && v !== '' && v !== null && Number.isFinite(n) && n >= 0) out[id] = Math.min(n, 240);
  }
  return out;
}
export function parseSubjectGoals(raw: unknown): SubjectGoals {
  let v: unknown = raw;
  if (typeof raw === 'string') { try { v = JSON.parse(raw); } catch { v = null; } }
  const o = (v && typeof v === 'object' ? v : {}) as { base?: unknown; days?: unknown }, days: Record<string, Record<string, number>> = {};
  if (o.days && typeof o.days === 'object') for (const [d, row] of Object.entries(o.days as Record<string, unknown>)) {
    if (!DAY.test(d)) continue; const c = cleanGoals(row); if (Object.keys(c).length) days[d] = c;
  }
  return { base: cleanGoals(o.base), days };
}
/** The goals for one day: the every-day minutes with that day's changes on top. */
export const goalsFor = (goals: SubjectGoals, day = subjectDayKey()): Record<string, number> => ({ ...goals.base, ...(goals.days[day] || {}) });

const escHTML = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const minutes = (secs: number) => !secs ? '–' : secs < 60 ? '<1' : String(Math.round(secs / 60));

/** A table of the last `days` days (today first): one column per subject that has any time, plus the total, in minutes. */
export function subjectTimeTableHTML(raw: unknown, days = 7, className = 'subject-time'): string {
  const store = normalizeSubjectTime(raw);
  const rows = Array.from({ length: days }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - i); return { d, row: store[subjectDayKey(d)] || {} }; });
  const cols = SUBJECT_TIME.filter(([id]) => rows.some(x => x.row[id]));
  if (!cols.length) return '<p class="muted">No time by subject yet. It starts counting the next time practice is open.</p>';
  const total = (row: Record<string, number>) => Object.values(row).reduce((a, b) => a + b, 0);
  const label = (d: Date, i: number) => i === 0 ? 'Today' : i === 1 ? 'Yesterday' : d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
  const sums = Object.fromEntries(cols.map(([id]) => [id, rows.reduce((a, x) => a + (x.row[id] || 0), 0)]));
  return `<div class="${className}-wrap"><table class="steptable ${className}"><thead><tr><th>Day</th>${cols.map(([, name]) => `<th>${escHTML(name)}</th>`).join('')}<th>Total</th></tr></thead><tbody>
    ${rows.map((x, i) => `<tr><td>${escHTML(label(x.d, i))}</td>${cols.map(([id]) => `<td>${minutes(x.row[id] || 0)}</td>`).join('')}<td><b>${minutes(total(x.row))}</b></td></tr>`).join('')}
    <tr class="${className}-sum"><td><b>${days} days</b></td>${cols.map(([id]) => `<td><b>${minutes(sums[id])}</b></td>`).join('')}<td><b>${minutes(Object.values(sums).reduce((a, b) => a + b, 0))}</b></td></tr></tbody></table></div>
    <p class="muted" style="margin-top:4px">Minutes of active time, by what was on screen. “Around town” is the map, the pet room, the sticker book and menus.</p>`;
}
