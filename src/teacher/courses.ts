/* Courses and grades on a student's page (docs/LEDGER.md step 6). Pet World courses get a suggested grade from
   unit tests, quizzes and daily work (weights the grown-up sets; daily work is a completion grade, 100% for any
   practice); outside courses (Ledger tab work, imported or added) suggest the average of their graded entries.
   The grown-up can rename a course, override its grade, leave it off the transcript, and add courses of their own.
   Saved in quiz_overrides as "courses" (JSON). The transcript (step 7) reads the same numbers. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { ledgerClient } from './ledger';

export interface CourseStudent {
  id: string; n: string;
  subjectTime?: Record<string, Record<string, number>>;
  qz?: { shop: string; station: number | null; kind: 'quiz' | 'test'; score: number; total: number; passed: boolean; t: number }[];
  elaProgress?: Record<string, Progress>; historyProgress?: Record<string, Progress>; scienceProgress?: Record<string, Progress>;
}
interface Progress { best?: number; passed?: boolean; questionCount?: number; tries?: number; answered?: number }
interface CourseSettings {
  w?: { test?: number; quiz?: number; daily?: number };
  c?: Record<string, { name?: string; grade?: string; off?: boolean; into?: string }>;
  add?: { id: string; name: string; hours?: number; grade?: string }[];
}
export interface CourseRow {
  id: string; kind: 'pettown' | 'outside' | 'added'; name: string; defaultName: string;
  hours: number; finished: string; test: number | null; quiz: number | null; daily: number | null;
  suggested: number | null; grade: string; overridden: boolean; off: boolean;
  into: string; parts: { id: string; name: string }[];   // into: the course this one is combined into; parts: courses combined into this one
}
export interface LedgerTotals { days: { day: string; subjects: Record<string, number> }[]; outside: { day: string; course: string; minutes: number; grade: string }[] }

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
export const DEFAULT_WEIGHTS = { test: 50, quiz: 40, daily: 10 };
/* each Pet World course: its time-by-subject ids and where its quizzes and tests live */
const PET_TOWN: { id: string; name: string; time: string[]; store: 'math' | 'elaProgress' | 'historyProgress' | 'scienceProgress' }[] = [
  { id: 'pt:math', name: 'Math', time: ['math'], store: 'math' },
  { id: 'pt:english', name: 'English', time: ['english', 'reading', 'words'], store: 'elaProgress' },
  { id: 'pt:history', name: 'History', time: ['history'], store: 'historyProgress' },
  { id: 'pt:science', name: 'Biology', time: ['science'], store: 'scienceProgress' }
];

export function parseCourseSettings(raw: unknown): CourseSettings {
  try { const v = typeof raw === 'string' ? JSON.parse(raw) : raw; return v && typeof v === 'object' && !Array.isArray(v) ? v as CourseSettings : {}; } catch { return {}; }
}
/** A grade as a number: "95", "95%", "A-" (letters map to the middle of their band). Null when it isn't a grade. */
export function gradeNumber(g: unknown): number | null {
  const s = String(g ?? '').trim().toUpperCase();
  if (!s) return null;
  const n = parseFloat(s.replace('%', ''));
  if (Number.isFinite(n) && /^\d/.test(s)) return Math.max(0, Math.min(110, n));
  const m = /^([ABCDF])([+-]?)$/.exec(s);
  if (!m) return null;
  const base = { A: 95, B: 85, C: 75, D: 65, F: 50 }[m[1] as 'A'] ?? 50;
  return m[1] === 'F' ? base : base + (m[2] === '+' ? 3 : m[2] === '-' ? -3 : 0);
}
export const letter = (n: number) => (n >= 90 ? 'A' : n >= 80 ? 'B' : n >= 70 ? 'C' : n >= 60 ? 'D' : 'F');
export const gradeText = (n: number | null) => (n == null ? '—' : `${Math.round(n)}% (${letter(n)})`);
/** What the grade column shows: an override as typed (a number gets its letter), or the suggestion. */
export function shownGrade(row: CourseRow) {
  if (!row.grade) return gradeText(row.suggested);
  const n = gradeNumber(row.grade);
  return n != null && /^\d/.test(row.grade.trim()) ? gradeText(n) : row.grade;
}
const dayOf = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/* best score on each quiz and unit test, as percents */
function petTownScores(r: CourseStudent, store: string, inRange: (day: string) => boolean = () => true) {
  const tests: number[] = [], quizzes: number[] = [];
  let units = 0;
  if (store === 'math') {
    const best: Record<string, { pct: number; kind: string; passed: boolean }> = {};
    for (const a of r.qz || []) {
      if (!a.total || !inRange(dayOf(a.t))) continue;   // math quizzes and tests have dates; the other subjects' don't
      const key = `${a.shop}:${a.kind === 'test' ? 'test' : a.station}`, pct = a.score * 100 / a.total;
      if (!best[key] || pct > best[key].pct) best[key] = { pct, kind: a.kind, passed: a.passed || !!best[key]?.passed };
      else if (a.passed) best[key].passed = true;
    }
    Object.values(best).forEach(b => { (b.kind === 'test' ? tests : quizzes).push(b.pct); if (b.kind === 'test' && b.passed) units++; });
  } else {
    const progress = (r as unknown as Record<string, Record<string, Progress> | undefined>)[store] || {};
    for (const [key, p] of Object.entries(progress)) {
      const isTest = /final-test$/.test(key), isQuiz = /(^|:)quiz:/.test(key);
      if ((!isTest && !isQuiz) || !p?.tries || !p.questionCount) continue;
      (isTest ? tests : quizzes).push(Math.min(100, (p.best || 0) * 100 / p.questionCount));
      if (isTest && p.passed) units++;
    }
  }
  return { test: avg(tests), quiz: avg(quizzes), units };
}

/** Every course for the student: Pet World, outside (from the Ledger) and added, with hours and grades. */
export function computeCourses(r: CourseStudent, settingsRaw: unknown, data: LedgerTotals, range?: { from: string; to: string }): CourseRow[] {
  const s = parseCourseSettings(settingsRaw), w = { ...DEFAULT_WEIGHTS, ...(s.w || {}) }, c = s.c || {};
  const inRange = (day: string) => !range || (day >= range.from && day <= range.to);
  /* seconds per subject id: the sent days, plus days in the save that were never sent */
  const secs: Record<string, number> = {}, sent = new Set(data.days.map(d => d.day));
  data.days.filter(d => inRange(d.day)).forEach(d => Object.entries(d.subjects || {}).forEach(([id, v]) => { secs[id] = (secs[id] || 0) + (+v || 0); }));
  Object.entries(r.subjectTime || {}).forEach(([day, row]) => { if (!sent.has(day) && inRange(day)) Object.entries(row).forEach(([id, v]) => { secs[id] = (secs[id] || 0) + (+v || 0); }); });
  const finish = (row: Omit<CourseRow, 'name' | 'grade' | 'overridden' | 'off' | 'into' | 'parts'>): CourseRow => {
    const o = c[row.id] || {};
    return { ...row, name: o.name?.trim() || row.defaultName, grade: (o.grade || '').trim(), overridden: !!(o.grade || '').trim(), off: !!o.off, into: o.into || '', parts: [] };
  };
  const rows: CourseRow[] = PET_TOWN.map(p => {
    const t = p.time.reduce((a, id) => a + (secs[id] || 0), 0), sc = petTownScores(r, p.store, inRange), daily = t >= 60 ? 100 : null;
    const parts = ([['test', sc.test], ['quiz', sc.quiz], ['daily', daily]] as [keyof typeof w, number | null][]).filter(([k, v]) => v != null && (+w[k] || 0) > 0);
    const total = parts.reduce((a, [k]) => a + (+w[k] || 0), 0);
    const suggested = total ? parts.reduce((a, [k, v]) => a + (v as number) * (+w[k] || 0), 0) / total : null;
    return finish({ id: p.id, kind: 'pettown', defaultName: p.name, hours: t / 3600, finished: `${sc.units} unit${sc.units === 1 ? '' : 's'} passed`, test: sc.test, quiz: sc.quiz, daily, suggested });
  });
  const outside: Record<string, { name: string; mins: number; n: number; grades: number[] }> = {};
  data.outside.filter(o => inRange(o.day)).forEach(o => {
    const key = `out:${o.course.trim().toLowerCase()}`, g = gradeNumber(o.grade);
    const x = outside[key] || (outside[key] = { name: o.course.trim(), mins: 0, n: 0, grades: [] });
    x.mins += o.minutes || 0; x.n++; if (g != null) x.grades.push(g);
  });
  Object.entries(outside).sort((a, b) => a[1].name.localeCompare(b[1].name)).forEach(([id, x]) => rows.push(finish({ id, kind: 'outside', defaultName: x.name, hours: x.mins / 60, finished: `${x.n} assignment${x.n === 1 ? '' : 's'}${x.grades.length ? `, ${x.grades.length} graded` : ''}`, test: null, quiz: null, daily: null, suggested: avg(x.grades) })));
  (s.add || []).forEach(a => { const row = finish({ id: a.id, kind: 'added', defaultName: a.name, hours: +(a.hours || 0), finished: '', test: null, quiz: null, daily: null, suggested: null }); row.grade = (a.grade || '').trim(); row.overridden = !!row.grade; rows.push(row); });
  return combine(rows);
}
/* "Combine with": a course's hours and work go into another course (e.g. Pet World Math into 6th Grade Math). The
   combined suggestion is the parts' suggestions weighted by hours; the target keeps its own name, grade and tick. */
function combine(rows: CourseRow[]): CourseRow[] {
  const byId = new Map(rows.map(x => [x.id, x]));
  const target = (x: CourseRow) => { let t = x; for (let i = 0; i < 5 && t.into && byId.has(t.into) && t.into !== x.id; i++) t = byId.get(t.into)!; return t === x ? null : t; };
  const groups = new Map<CourseRow, CourseRow[]>();
  for (const x of rows) { const t = target(x); if (t && !t.into) groups.set(t, [...(groups.get(t) || []), x]); }
  for (const [t, parts] of groups) {
    const all = [t, ...parts], scored = all.filter(x => x.suggested != null), hours = scored.reduce((a, x) => a + x.hours, 0);
    t.suggested = scored.length ? (hours > 0 ? scored.reduce((a, x) => a + (x.suggested as number) * x.hours, 0) / hours : scored.reduce((a, x) => a + (x.suggested as number), 0) / scored.length) : null;
    t.hours = all.reduce((a, x) => a + x.hours, 0);
    t.finished = all.map(x => x.finished).filter(Boolean).join(' · ');
    t.parts = parts.map(x => ({ id: x.id, name: x.name }));
  }
  return rows.filter(x => !(x.into && target(x) && groups.has(target(x)!)));
}

/** The student's whole Ledger, read in pages: subject time of each sent day, and every outside entry. */
export async function loadLedgerTotals(sb: SupabaseClient, studentId: string): Promise<LedgerTotals> {
  const days: LedgerTotals['days'] = [], outside: LedgerTotals['outside'] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from('ledger_days').select('day,subjects:entry->subjects').eq('student_id', studentId).order('day').range(from, from + 999);
    if (error) throw new Error(error.message);
    ((data || []) as unknown as { day: string; subjects: Record<string, number> | null }[]).forEach(d => days.push({ day: d.day, subjects: d.subjects || {} }));
    if (!data || data.length < 1000) break;
  }
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from('ledger_outside').select('day,course,minutes,grade').eq('student_id', studentId).order('id').range(from, from + 999);
    if (error) throw new Error(error.message);
    ((data || []) as unknown as LedgerTotals['outside']).forEach(o => outside.push(o));
    if (!data || data.length < 1000) break;
  }
  return { days, outside };
}

const hoursText = (h: number) => (h >= 10 ? String(Math.round(h)) : h.toFixed(1));
const pct = (n: number | null) => (n == null ? '<span class="muted">—</span>' : `${Math.round(n)}%`);

export function renderCourses(el: HTMLElement, r: CourseStudent, getSettings: () => unknown, save: (value: string | null) => Promise<void>) {
  let data: LedgerTotals | null = null, msg = '';
  async function load() {
    const sb = ledgerClient();
    if (!sb) { el.innerHTML = '<p class="muted">Grades need the online teacher app (signed in to the database).</p>'; return; }
    el.innerHTML = '<p class="muted">Adding up courses…</p>';
    try { data = await loadLedgerTotals(sb, r.id); } catch (err) { el.innerHTML = `<p class="status">Couldn’t read the Ledger: ${esc((err as Error).message)}</p>`; return; }
    draw();
  }
  function draw() {
    if (!data) return;
    const s = parseCourseSettings(getSettings()), w = { ...DEFAULT_WEIGHTS, ...(s.w || {}) }, rows = computeCourses(r, s, data);
    const row = (x: CourseRow) => `<tr data-course="${esc(x.id)}"${x.off ? ' style="opacity:.55"' : ''}>
      <td><input data-c-name value="${esc(x.name)}" maxlength="80" style="width:150px" aria-label="Course name">${x.kind === 'pettown' ? ' <span class="tag i">Pet World</span>' : x.kind === 'added' ? ' <span class="tag a">added</span>' : ''}
        ${x.parts.length ? `<div class="muted" style="font-size:.85em">Includes ${x.parts.map(p => `${esc(p.name)} <button class="btn small" data-c-split="${esc(p.id)}">Separate</button>`).join(' ')}</div>` : `<div><label class="muted" style="font-size:.85em">Combine with <select data-c-into><option value="">—</option>${rows.filter(o => o.id !== x.id).map(o => `<option value="${esc(o.id)}">${esc(o.name)}</option>`).join('')}</select></label></div>`}</td>
      <td>${x.kind === 'added' ? `<input type="number" data-c-hours min="0" max="2000" step="0.5" value="${x.hours || ''}" style="width:70px" aria-label="Hours">` : hoursText(x.hours)}</td>
      <td>${esc(x.finished)}</td>
      <td>${x.kind === 'pettown' ? `${pct(x.test)} · ${pct(x.quiz)} · ${pct(x.daily)}` : '<span class="muted">—</span>'}</td>
      <td>${gradeText(x.suggested)}</td>
      <td><input data-c-grade value="${esc(x.grade)}" maxlength="20" placeholder="${x.suggested == null ? 'e.g. 92 or A' : 'use suggested'}" style="width:90px" aria-label="Grade"></td>
      <td><b>${esc(shownGrade(x))}</b></td>
      <td style="white-space:nowrap"><label><input type="checkbox" data-c-on ${x.off ? '' : 'checked'}> On transcript</label>${x.kind === 'added' ? ` <button class="btn small" data-c-remove="${esc(x.id)}">Remove</button>` : ''}</td></tr>`;
    el.innerHTML = `<p class="muted" style="margin-top:0">Every course for ${esc(r.n)}: Pet World subjects, courses from the Ledger tab (outside work and the old Ledger), and courses you add. Change a name, type a grade to override the suggestion (leave it empty to use the suggestion), untick a course to leave it off the transcript, or combine two courses into one (for example Pet World Math with 6th Grade Math from the Ledger: hours add up and the suggestion is weighted by hours), then <b>Save courses</b>.</p>
      <h3>How Pet World grades are suggested</h3>
      <div class="row"><label>Unit tests <input type="number" id="cwTest" min="0" max="100" value="${w.test}" style="width:65px">%</label><label>Quizzes <input type="number" id="cwQuiz" min="0" max="100" value="${w.quiz}" style="width:65px">%</label><label>Daily work <input type="number" id="cwDaily" min="0" max="100" value="${w.daily}" style="width:65px">%</label></div>
      <p class="muted" style="margin:0">Each test and quiz counts its best score. Daily work is a completion grade: 100% once there is practice time in the subject. If a course has no tests (or no quizzes) yet, the other parts share its weight. Outside courses suggest the average of their graded entries.</p>
      <div class="tablewrap"><table class="steptable" style="margin-top:10px"><tr><th>Course</th><th>Hours</th><th>Finished</th><th>Tests · quizzes · daily</th><th>Suggested</th><th>Your grade</th><th>Grade</th><th></th></tr>${rows.map(row).join('')}</table></div>
      <h3>Add a course</h3><p class="muted" style="margin:0">For a course with no Ledger entries, like a co-op class or music lessons. To track its work day by day, add it on the Ledger tab instead.</p>
      <div class="row"><label>Course <input id="caName" maxlength="80" placeholder="e.g. Piano"></label><label>Hours <input id="caHours" type="number" min="0" max="2000" step="0.5" style="width:80px"></label><label>Grade <input id="caGrade" maxlength="20" placeholder="e.g. 95 or A" style="width:100px"></label><button class="btn small" id="caAdd">Add course</button></div>
      <div class="row"><button class="btn small primary" id="cSave">Save courses</button></div><p class="status" id="cMsg">${esc(msg)}</p>`;
    msg = '';
  }
  /* reads the page into settings: weights, names, overrides, transcript ticks, added courses */
  function readPage(): CourseSettings {
    const s = parseCourseSettings(getSettings()), rows = data ? computeCourses(r, s, data) : [];
    const num = (id: string, d: number) => { const v = el.querySelector<HTMLInputElement>(id)?.value.trim() ?? ''; return v === '' ? d : Math.max(0, Math.min(100, Math.round(+v) || 0)); };
    const next: CourseSettings = { w: { test: num('#cwTest', DEFAULT_WEIGHTS.test), quiz: num('#cwQuiz', DEFAULT_WEIGHTS.quiz), daily: num('#cwDaily', DEFAULT_WEIGHTS.daily) }, c: {}, add: [] };
    for (const x of rows) {
      const tr = el.querySelector<HTMLElement>(`[data-course="${CSS.escape(x.id)}"]`);
      if (!tr) continue;
      const name = (tr.querySelector<HTMLInputElement>('[data-c-name]')?.value || '').trim().slice(0, 80), grade = (tr.querySelector<HTMLInputElement>('[data-c-grade]')?.value || '').trim().slice(0, 20);
      const off = !tr.querySelector<HTMLInputElement>('[data-c-on]')?.checked, into = tr.querySelector<HTMLSelectElement>('[data-c-into]')?.value || '';
      if (x.kind === 'added') {
        const hours = Math.max(0, Math.min(2000, +(tr.querySelector<HTMLInputElement>('[data-c-hours]')?.value || 0) || 0));
        next.add!.push({ id: x.id, name: name || x.defaultName, hours, grade });
        if (off || into) next.c![x.id] = { ...(off ? { off } : {}), ...(into ? { into } : {}) };
        continue;
      }
      const o: { name?: string; grade?: string; off?: boolean; into?: string } = {};
      if (name && name !== x.defaultName) o.name = name;
      if (grade) o.grade = grade;
      if (off) o.off = true;
      if (into) o.into = into;
      if (Object.keys(o).length) next.c![x.id] = o;
    }
    /* courses combined into another aren't rows on the page: keep their settings as they are */
    const shown = new Set(rows.map(x => x.id));
    for (const [id, o] of Object.entries(s.c || {})) if (!shown.has(id)) next.c![id] = o;
    return next;
  }
  async function store(next: CourseSettings, done: string) {
    const empty = !Object.keys(next.c || {}).length && !(next.add || []).length && JSON.stringify(next.w) === JSON.stringify(DEFAULT_WEIGHTS);
    await save(empty ? null : JSON.stringify(next));
    msg = JSON.stringify(parseCourseSettings(getSettings())) === JSON.stringify(empty ? {} : next) ? done : 'Couldn’t save. Try again.';
    draw();
  }
  el.onclick = event => {
    const t = (event.target as HTMLElement).closest<HTMLElement>('button');
    if (!t) return;
    if (t.id === 'cSave') void store(readPage(), 'Saved.');
    else if (t.id === 'caAdd') {
      const name = (el.querySelector<HTMLInputElement>('#caName')?.value || '').trim().slice(0, 80);
      if (!name) { const m = el.querySelector('#cMsg'); if (m) m.textContent = 'Type the course name.'; return; }
      const next = readPage();
      next.add!.push({ id: `add:${Date.now().toString(36)}`, name, hours: Math.max(0, Math.min(2000, +(el.querySelector<HTMLInputElement>('#caHours')?.value || 0) || 0)), grade: (el.querySelector<HTMLInputElement>('#caGrade')?.value || '').trim().slice(0, 20) });
      void store(next, `Added ${name}.`);
    } else if (t.dataset.cSplit) {
      const next = readPage(), o = { ...(next.c![t.dataset.cSplit] || {}) };
      delete o.into;
      if (Object.keys(o).length) next.c![t.dataset.cSplit] = o; else delete next.c![t.dataset.cSplit];
      void store(next, 'Separated.');
    } else if (t.dataset.cRemove) {
      const next = readPage();
      next.add = (next.add || []).filter(a => a.id !== t.dataset.cRemove);
      delete next.c![t.dataset.cRemove];
      void store(next, 'Removed.');
    }
  };
  void load();
}
