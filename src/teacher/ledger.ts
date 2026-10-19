/* The Ledger tab on a student's page (docs/LEDGER.md step 4): the Pet World days the student sent with
   "I'm done for today", days not sent yet (from time by subject in the save), and work outside Pet World that a
   grown-up adds. A grown-up can edit any day; an edited Pet World day keeps the student's version so it can go back. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUBJECT_TIME, subjectDayKey } from '../shared/subjectTime';
import { SHOPS } from '../shared/registry';

interface LedgerEvent { t?: number; k?: string; text?: string; [key: string]: unknown }
interface LedgerEntry {
  v?: number; day?: string; totalSecs?: number; subjects?: Record<string, number>;
  lessons?: { key: string; label: string; secs: number }[]; orders?: { key: string; label: string; n: number; ok: number }[];
  events?: LedgerEvent[]; extras?: { label: string; done: number; goal: number }[]; goals?: { subject: string; label: string; done: number; goal: number }[];
  note?: string; fromSave?: boolean; original?: LedgerEntry | null; plan?: { label: string; status: string; carried?: boolean }[];
  passed?: { text: string; s?: number; n?: number; test?: boolean }[]; mastered?: string[];
}
/* a math station quiz or unit test from the assessments table (kept for every day, before the day log existed too) */
interface QuizRow { shop: string; station: number | null; kind: string; score: number; total: number; passed: boolean; created_at: string }
interface DayRow { day: string; entry: LedgerEntry; sent_at: string; edited_by_teacher: boolean }
interface OutsideRow { id: number; day: string; course: string; title: string; minutes: number; grade: string; notes: string; source: string; review?: string; review_note?: string; images?: string[] }
/* an old Ledger backup (the separate Ledger app): {caleb:{name, entries:[{subject, assignment, minutes, grade, date, id}], subjects}, abi:{...}} */
interface ImportKid { key: string; name: string; entries: unknown[] }
interface ImportRow { day: string; course: string; title: string; minutes: number; grade: string }
interface ImportState { error?: string; file: string; kids: ImportKid[]; pick: string; existing: Set<string> }
const dupKey = (day: string, course: string, title: string) => `${day}|${course.trim().toLowerCase()}|${title.trim().toLowerCase()}`;
function validDay(v: unknown): v is string {
  if (typeof v !== 'string' || !DAY.test(v)) return false;
  const d = new Date(`${v}T12:00:00`);
  return !isNaN(d.getTime()) && subjectDayKey(d) === v;
}
/* which entries come in: readable ones not already in the record (or twice in the file) */
function prepareImport(kid: ImportKid | undefined, existing: Set<string>) {
  const rows: ImportRow[] = [], seen = new Set(existing);
  let bad = 0, dup = 0;
  for (const raw of kid?.entries || []) {
    const e = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const course = typeof e.subject === 'string' ? e.subject.trim().slice(0, 80) : '';
    if (!validDay(e.date) || !course) { bad++; continue; }
    const title = (typeof e.assignment === 'string' ? e.assignment.trim() : '').slice(0, 300);
    const key = dupKey(e.date, course, title);
    if (seen.has(key)) { dup++; continue; }
    seen.add(key);
    const m = Math.round(+String(e.minutes ?? 0));
    rows.push({ day: e.date, course, title, minutes: Number.isFinite(m) ? Math.max(0, Math.min(1440, m)) : 0, grade: e.grade == null ? '' : String(e.grade).trim().slice(0, 20) });
  }
  return { rows, bad, dup };
}
function parseBackup(text: string): ImportKid[] | string {
  let data: unknown;
  try { data = JSON.parse(text); } catch { return 'That file isn’t a Ledger backup (it isn’t JSON).'; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'That file isn’t a Ledger backup.';
  const kids = Object.entries(data as Record<string, unknown>).filter(([, v]) => v && typeof v === 'object' && Array.isArray((v as { entries?: unknown }).entries))
    .map(([key, v]) => { const o = v as { name?: unknown; entries: unknown[] }; return { key, name: typeof o.name === 'string' && o.name.trim() ? o.name.trim() : key, entries: o.entries }; });
  return kids.length ? kids : 'No children with entries were found in that file.';
}

/* the day log kept in the student's save for the last 14 days (game.js normalizeDayLog, docs: LEDGER.md) */
export interface SaveDayLog { places?: Record<string, number>; counts?: Record<string, { n: number; ok: number }>; events?: LedgerEvent[]; labels?: Record<string, string>; sent?: number }
export interface LedgerStudent { id: string; n: string; subjectTime?: Record<string, Record<string, number>>; dayLog?: Record<string, SaveDayLog> }

let client: SupabaseClient | null = null, ledgerClass = '';
/** main.ts calls this when a class opens, so the Ledger reads and writes that class's rows. */
export function setLedgerClass(sb: SupabaseClient | null, classId: string) { client = sb; ledgerClass = classId; }
/** The database client the Ledger uses (the Grades tab reads the Ledger with it too). */
export const ledgerClient = () => client;

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const SUBJECT_NAMES: Record<string, string> = Object.fromEntries(SUBJECT_TIME);
const COURSES = ['Math', 'English', 'Reading', 'Writing', 'Spelling', 'History', 'Science', 'Art', 'Music', 'PE'];
const mins = (secs: number) => (secs > 0 && secs < 60 ? '<1' : String(Math.round(secs / 60)));
const sum = (o: Record<string, number> | undefined) => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0);
const addDays = (day: string, n: number) => { const d = new Date(`${day}T12:00:00`); d.setDate(d.getDate() + n); return subjectDayKey(d); };
const dayName = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/* ---------- what she did, by subject, with every score (docs: LEDGER.md, "By subject") ---------- */
const SUBJECT_ORDER: [string, string][] = [['math', '➗ Math'], ['english', '📚 English'], ['reading', '📖 Reading Log'], ['history', '🏛️ History'], ['science', '🦁 Science'], ['breaks', '🧠 Brain and movement breaks'], ['other', 'Other']];
/* which subject an event belongs to; the time in each group comes from these time-by-subject ids */
const GROUP_TIME: Record<string, string[]> = { math: ['math'], english: ['english', 'words'], reading: ['reading'], history: ['history'], science: ['science'], breaks: ['brain'], other: [] };
function eventSubject(ev: LedgerEvent): string {
  const course = String(ev.course || '');
  switch (ev.k) {
    case 'assess': case 'sprint': case 'mastered': return 'math';
    case 'vocab': return 'english';
    case 'reading': return 'reading';
    case 'course': case 'review': return course === 'math' ? 'math' : course.startsWith('history') ? 'history' : course.startsWith('bio') ? 'science' : 'english';
    case 'project': return course.startsWith('bio') ? 'science' : 'history';
    case 'dig': case 'scribe': return 'history';
    case 'sim': return 'science';
    case 'brain': case 'move': return 'breaks';
    case 'done': { const s = String(ev.subject || ''); return s === 'biology' ? 'science' : ['math', 'english', 'reading', 'history', 'science'].includes(s) ? s : 'other'; }
    default: return 'other';
  }
}
const scoreOf = (ev: LedgerEvent) => { const s = Number(ev.s), n = Number(ev.n); return Number.isFinite(s) && n > 0 ? { s, n, pct: Math.round(s * 100 / n) } : null; };
/* events saved before each one carried its own wording */
function eventLabel(ev: LedgerEvent) {
  if (ev.text) return String(ev.text);
  const score = scoreOf(ev);
  const what = ev.k === 'assess' ? `Math ${ev.mode === 'test' ? 'unit test' : ev.mode === 'quiz' ? 'station quiz' : 'practice'}${ev.shop ? ` (${ev.shop}${ev.station ? ` station ${ev.station}` : ''})` : ''}`
    : ev.k === 'course' ? `${ev.course || ''}: ${ev.title || ''} (${ev.kind === 'final' ? 'unit test' : ev.kind || 'practice'})` : String(ev.title || ev.k || '');
  return `${what}${score ? ` · ${score.s} of ${score.n}` : ''}${ev.passed ? ' ✅' : ''}`;
}
function bySubjectHTML(e: LedgerEntry, time: (t?: number) => string) {
  const events = (e.events || []).filter(ev => ev.k !== 'note'), notes = (e.events || []).filter(ev => ev.k === 'note');
  if (!events.length && !notes.length) return '';
  const groups = SUBJECT_ORDER.map(([id, name]) => {
    const list = events.filter(ev => eventSubject(ev) === id).sort((a, b) => (Number(a.t) || 0) - (Number(b.t) || 0));
    if (!list.length) return '';
    const secs = GROUP_TIME[id].reduce((a, key) => a + (+(e.subjects || {})[key] || 0), 0);
    const scored = list.map(scoreOf).filter((x): x is NonNullable<ReturnType<typeof scoreOf>> => !!x);
    const right = scored.reduce((a, x) => a + x.s, 0), total = scored.reduce((a, x) => a + x.n, 0);
    const summary = [secs >= 30 ? `${mins(secs)} min` : '', scored.length ? `${scored.length} scored · <b>${right} of ${total} right (${Math.round(right * 100 / total)}%)</b>` : ''].filter(Boolean).join(' · ');
    return `<h4 style="margin:10px 0 4px">${name}${summary ? ` <span class="muted" style="font-weight:normal">· ${summary}</span>` : ''}</h4><ul style="margin:0">${list.map(ev => {
      const score = scoreOf(ev);
      return `<li>${time(Number(ev.t) || undefined)}${esc(eventLabel(ev))}${score ? ` <b>${score.pct}%</b>` : ''}</li>`;
    }).join('')}</ul>`;
  }).join('');
  return `<h4 style="margin:10px 0 4px">What she did, by subject</h4><div style="margin-left:8px">${groups}</div>`
    + (notes.length ? `<h4 style="margin:10px 0 4px">Added by a grown-up</h4><ul style="margin:0">${notes.map(ev => `<li>${esc(ev.text || '')}</li>`).join('')}</ul>` : '');
}
/* math quizzes and tests from the quiz history, for a day whose own record has none (days before the day log, Oct 16 2026) */
function quizEvent(q: QuizRow): LedgerEvent {
  const shop = (SHOPS as Record<string, { name: string; emoji?: string; stations: { id: number; name: string }[] }>)[q.shop], st = shop?.stations.find(x => x.id === q.station);
  const where = `${shop?.emoji || ''} ${shop?.name || q.shop}${q.kind === 'test' ? ' · Unit Test' : st ? ` · ${st.name} quiz` : ' quiz'}`.trim();
  return { t: Date.parse(q.created_at), k: 'assess', shop: q.shop, station: q.station ?? undefined, mode: q.kind, s: q.score, n: q.total, passed: q.passed, text: `${where} · ${q.score} of ${q.total}${q.passed ? ' ✅ passed' : ''}` };
}
function withQuizHistory(e: LedgerEntry, quizzes: QuizRow[]): LedgerEntry {
  if (!quizzes.length || (e.events || []).some(ev => ev.k === 'assess')) return e;
  return { ...e, events: [...(e.events || []), ...quizzes.map(quizEvent)] };
}
/* a day she didn't send: the same entry "I'm done for today" would have made, read from the save's day log */
function entryFromSave(day: string, r: LedgerStudent): LedgerEntry {
  const d = r.dayLog?.[day] || {}, subjects = { ...(r.subjectTime?.[day] || {}) }, label = (key: string) => d.labels?.[key] || key;
  return { v: 1, day, totalSecs: sum(subjects), subjects, fromSave: true,
    lessons: Object.entries(d.places || {}).filter(([k, s]) => s >= 30 && k !== 'town').sort((a, b) => b[1] - a[1]).map(([key, secs]) => ({ key, label: label(key), secs })),
    orders: Object.entries(d.counts || {}).map(([key, c]) => ({ key, label: label(key), n: c.n, ok: c.ok })),
    events: (d.events || []).map(ev => ({ ...ev, text: eventLabel(ev) })) };
}

/** One day from a student's save, the way the Ledger shows a day she didn't send (the Right now card uses it). */
export function savedDayHTML(r: LedgerStudent, day: string) { return entryHTML(entryFromSave(day, r)); }

function entryHTML(e: LedgerEntry) {
  const subjects = Object.entries(e.subjects || {}).filter(([, s]) => s >= 30).sort((a, b) => b[1] - a[1]);
  const list = (title: string, items: string[]) => (items.length ? `<h4 style="margin:10px 0 4px">${title}</h4><ul style="margin:0">${items.join('')}</ul>` : '');
  const time = (t?: number) => (t ? `<span class="muted">${new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span> ` : '');
  return list('Time by subject', subjects.map(([id, s]) => `<li>${esc(SUBJECT_NAMES[id] || id)}: <b>${mins(s)} min</b></li>`))
    + list('Time by lesson', (e.lessons || []).map(l => `<li>${esc(l.label)}: <b>${mins(l.secs)} min</b></li>`))
    + list('Practice orders', (e.orders || []).map(o => `<li>${esc(o.label)}: <b>${o.n}</b> order${o.n === 1 ? '' : 's'}, ${o.ok} perfect</li>`))
    + bySubjectHTML(e, time)
    + list('🏅 Passed', (e.passed || []).map(p => `<li>${p.test ? '🏆' : '📝'} ${esc(p.text)}${p.n ? ` · <b>${p.s} of ${p.n}</b>` : ''}</li>`))
    + list('⭐ Mastered', (e.mastered || []).map(m => `<li>${esc(m)}</li>`))
    + list('🗓️ Plan', (e.plan || []).map(p => `<li>${p.status === 'done' ? '✅' : p.status === 'waiting' ? '⏳' : '⬜'} ${esc(p.label)}${p.carried ? ' <span class="muted">(from an earlier day)</span>' : ''}${p.status === 'todo' ? ' <span class="muted">(not done)</span>' : ''}</li>`))
    + list('📋 Extras', (e.extras || []).map(x => `<li>${x.done >= x.goal ? '✅' : '⬜'} ${esc(x.label)}: ${x.done} of ${x.goal} min</li>`))
    + list('🎯 Time goals', (e.goals || []).map(g => `<li>${g.done >= g.goal ? '✅' : '⬜'} ${esc(g.label)}: ${g.done} of ${g.goal} min</li>`))
    + (e.note ? `<p><b>Grown-up’s note:</b> ${esc(e.note)}</p>` : '')
    + (e.fromSave && !(e.events || []).length && !(e.lessons || []).length ? '<p class="muted">Saved from time by subject; lesson detail wasn’t sent for this day.</p>' : '')
    + (!subjects.length && !(e.events || []).length && !e.note ? '<p class="muted">No practice time recorded.</p>' : '');
}

export function renderLedger(el: HTMLElement, r: LedgerStudent) {
  const today = subjectDayKey();
  const st = { from: addDays(today, -29), to: today, days: [] as DayRow[], outside: [] as OutsideRow[], quizzes: [] as QuizRow[], open: new Set<string>([today]), edit: '', editOut: 0, msg: '', imp: null as ImportState | null, importing: false };
  let deleteArmed = 0, deleteTimer: ReturnType<typeof setTimeout> | null = null;

  async function load() {
    if (!client) { el.innerHTML = '<p class="muted">The Ledger needs the online teacher app (signed in to the database).</p>'; return; }
    el.innerHTML = '<p class="muted">Loading the Ledger…</p>';
    const [a, b, c] = await Promise.all([
      client.from('ledger_days').select('day,entry,sent_at,edited_by_teacher').eq('student_id', r.id).gte('day', st.from).lte('day', st.to),
      outsideRows(client),
      client.from('assessments').select('shop,station,kind,score,total,passed,created_at').eq('student_id', r.id).gte('created_at', new Date(`${addDays(st.from, -1)}T00:00:00`).toISOString()).lte('created_at', new Date(`${addDays(st.to, 1)}T23:59:59`).toISOString()).order('created_at')
    ]);
    const err = a.error || b.error;
    if (err) { el.innerHTML = `<p class="status">Couldn’t load the Ledger: ${esc(err.message)}. Has database file 8 (<code>20261017000000_ledger.sql</code>) been run in Supabase?</p>`; return; }
    st.days = (a.data || []) as DayRow[]; st.outside = (b.data || []) as OutsideRow[];
    st.quizzes = c.error ? [] : (c.data || []) as QuizRow[];   // the quiz history is a bonus: the Ledger still works without it
    draw();
  }
  /* the student's own outside work (review, photos) needs database file 20261020000000_outside_work.sql; without it the
     Ledger still loads the rest */
  async function outsideRows(sb: SupabaseClient) {
    const q = (cols: string) => sb.from('ledger_outside').select(cols).eq('student_id', r.id).gte('day', st.from).lte('day', st.to).order('id');
    const full = await q('id,day,course,title,minutes,grade,notes,source,review,review_note,images');
    return full.error && /review|images|column/i.test(full.error.message) ? q('id,day,course,title,minutes,grade,notes,source') : full;
  }
  async function run(work: () => PromiseLike<{ error: { message: string } | null }>, done: string) {
    const { error } = await work();
    st.msg = error ? `Couldn’t save: ${error.message}` : done;
    if (error) { draw(); return; }
    st.edit = ''; st.editOut = 0; await load();
  }

  function outsideRowHTML(o: OutsideRow) {
    if (st.editOut === o.id) return `<tr data-out-row="${o.id}"><td><input type="date" data-o="day" value="${esc(o.day)}"></td><td><input data-o="course" list="ledgerCourses" maxlength="80" value="${esc(o.course)}" style="width:110px"></td>
      <td><input data-o="title" maxlength="300" value="${esc(o.title)}"></td><td><input type="number" data-o="minutes" min="0" max="1440" value="${o.minutes}" style="width:70px"></td><td><input data-o="grade" maxlength="20" value="${esc(o.grade)}" style="width:60px"></td>
      <td><input data-o="notes" maxlength="1000" value="${esc(o.notes)}"></td><td style="white-space:nowrap"><button class="btn small primary" data-out-save="${o.id}">Save</button> <button class="btn small" data-out-cancel>Cancel</button></td></tr>`;
    const mine = o.source === 'student', review = o.review || '', photos = Array.isArray(o.images) ? o.images : [];
    const reviewTag = review === 'waiting' ? ' <span class="tag a">⏳ waiting for you</span>' : review === 'ok' ? ' <span class="tag i">✅ checked</span>' : review === 'redo' ? ' <span class="tag a">🔁 redo asked</span>' : '';
    const extra = mine ? `<tr data-out-review="${o.id}"><td colspan="6" style="border-top:0; padding-top:0">
        ${photos.length ? `<div class="row" style="margin:4px 0; gap:8px">${photos.map(src => `<img src="${esc(src)}" alt="Photo of the work" data-zoom style="max-height:110px; max-width:100%; border-radius:6px; cursor:zoom-in">`).join('')}</div>` : ''}
        ${review === 'redo' && o.review_note ? `<p class="muted" style="margin:2px 0">Your note: “${esc(o.review_note)}”</p>` : ''}
        ${review !== 'ok' ? `<div class="row" style="margin:4px 0; gap:6px; align-items:center"><button class="btn small primary" data-out-ok="${o.id}">✓ Looks good</button><input data-out-note="${o.id}" maxlength="500" placeholder="What to fix (for a redo)" style="flex:1; min-width:160px"><button class="btn small" data-out-redo="${o.id}">🔁 Ask for a redo</button></div>` : ''}
      </td></tr>` : '';
    return `<tr><td>${esc(o.course)}${o.source === 'import' ? ' <span class="tag i">imported</span>' : ''}${mine ? ` <span class="tag i">added by ${esc(r.n)}</span>${reviewTag}` : ''}</td><td>${esc(o.title) || '<span class="muted">—</span>'}</td><td>${o.minutes} min</td><td>${esc(o.grade) || '<span class="muted">—</span>'}</td><td>${esc(o.notes)}</td>
      <td style="white-space:nowrap"><button class="btn small" data-out-edit="${o.id}">Edit</button> <button class="btn small" data-out-delete="${o.id}">${deleteArmed === o.id ? 'Click again to delete' : 'Delete'}</button></td></tr>${extra}`;
  }

  function editDayHTML(row: DayRow) {
    const e = row.entry, subj = e.subjects || {};
    return `<div data-day-edit="${esc(row.day)}"><h4 style="margin:8px 0 4px">Minutes by subject</h4><div class="row">${SUBJECT_TIME.map(([id, name]) => `<label>${esc(name)} <input type="number" min="0" max="1440" data-edit-subject="${id}" value="${subj[id] ? Math.round(subj[id] / 60) : ''}" style="width:70px"></label>`).join('')}</div>
      <h4 style="margin:10px 0 4px">Finished</h4><p class="muted" style="margin:0">Untick a line to take it off this day.</p>
      ${(e.events || []).map((ev, i) => `<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-edit-event="${i}" checked> ${esc(ev.text || ev.k || '')}</label>`).join('') || '<p class="muted" style="margin:0">Nothing listed.</p>'}
      <label>Add a line <input data-edit-add maxlength="200" placeholder="e.g. Read chapter 4 aloud" style="width:100%"></label>
      <label>Grown-up’s note <textarea data-edit-note maxlength="1000" rows="2" style="width:100%">${esc(e.note || '')}</textarea></label>
      <div class="row"><button class="btn small primary" data-day-save="${esc(row.day)}">Save this day</button> <button class="btn small" data-day-cancel>Cancel</button></div></div>`;
  }

  const quizzesOn = (day: string) => st.quizzes.filter(q => subjectDayKey(new Date(q.created_at)) === day);
  function dayHTML(day: string) {
    const row = st.days.find(d => d.day === day), outs = st.outside.filter(o => o.day === day);
    const saveRow = r.subjectTime?.[day] || {}, saveSecs = sum(saveRow);
    const ptSecs = row ? (row.entry.totalSecs ?? sum(row.entry.subjects)) : saveSecs, outMin = outs.reduce((a, o) => a + (o.minutes || 0), 0);
    const tags = [row?.edited_by_teacher ? '<span class="tag a">edited by a grown-up</span>' : '', !row && saveSecs ? '<span class="tag stale-tag">not sent yet</span>' : ''].filter(Boolean).join(' ');
    let body = '<h3 style="margin:8px 0 4px">🏡 Pet World</h3>';
    if (row && st.edit === day) body += editDayHTML(row);
    else if (row) body += entryHTML(withQuizHistory(row.entry, quizzesOn(day))) + `<p class="muted">${row.entry.fromSave ? 'Saved by a grown-up' : `Sent ${new Date(row.sent_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}.</p>
      <div class="row"><button class="btn small" data-day-edit-open="${esc(day)}">Edit this day</button>${row.entry.original ? ` <button class="btn small" data-day-revert="${esc(day)}">Go back to ${esc(r.n)}’s version</button>` : ''}</div>`;
    else if (saveSecs || (r.dayLog?.[day]?.events || []).length) body += `<p class="muted" style="margin:0">${esc(r.n)} didn’t press “I’m done for today”, so this comes from her save (it keeps the last 14 days).</p>${entryHTML(withQuizHistory(entryFromSave(day, r), quizzesOn(day)))}
      <div class="row"><button class="btn small" data-day-fromsave="${esc(day)}">Save this day to the record</button></div>`;
    else body += '<p class="muted" style="margin:0">No Pet World time this day.</p>';
    body += `<h3 style="margin:12px 0 4px">📚 Outside Pet World</h3>${outs.length ? `<table class="steptable"><tr><th>Course</th><th>Assignment</th><th>Time</th><th>Grade</th><th>Notes</th><th></th></tr>${outs.map(outsideRowHTML).join('')}</table>` : '<p class="muted" style="margin:0">Nothing added.</p>'}
      <div class="row"><button class="btn small" data-out-add-day="${esc(day)}">➕ Add outside work on this day</button></div>`;
    return `<details class="unit-card" data-ledger-day="${esc(day)}"${st.open.has(day) ? ' open' : ''}><summary><b>${esc(dayName(day))}</b><span class="unit-sum">Pet World ${mins(ptSecs)} min${outs.length ? ` · outside ${outMin} min` : ''}</span> ${tags}</summary>${body}</details>`;
  }

  function importHTML() {
    const imp = st.imp;
    if (!imp) return '';
    if (imp.error) return `<p class="status">${esc(imp.error)}</p>`;
    const kid = imp.kids.find(k => k.key === imp.pick), { rows, bad, dup } = prepareImport(kid, imp.existing);
    const dates = rows.map(x => x.day).sort(), byCourse: Record<string, number> = {};
    rows.forEach(x => { byCourse[x.course] = (byCourse[x.course] || 0) + 1; });
    return `<p><b>${esc(imp.file)}</b></p><label>Whose entries go to ${esc(r.n)}? <select id="ledgerKid"><option value="">Pick one</option>${imp.kids.map(k => `<option value="${esc(k.key)}"${k.key === imp.pick ? ' selected' : ''}>${esc(k.name)} (${k.entries.length} entries)</option>`).join('')}</select></label>
      ${kid ? `<p><b>${rows.length}</b> to import${rows.length ? `, ${esc(dayName(dates[0]))} to ${esc(dayName(dates[dates.length - 1]))}` : ''} · <b>${dup}</b> already in the record (skipped) · <b>${bad}</b> couldn’t be read (skipped)</p>
      ${rows.length ? `<p class="muted">${Object.entries(byCourse).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${esc(c)}: ${n}`).join(' · ')}</p><div class="row"><button class="btn small primary" id="ledgerImportGo"${st.importing ? ' disabled' : ''}>${st.importing ? 'Importing…' : `Import ${rows.length} entries`}</button> <button class="btn small" id="ledgerImportCancel">Cancel</button></div>` : '<div class="row"><button class="btn small" id="ledgerImportCancel">Close</button></div>'}` : ''}`;
  }
  /* every outside entry this student has, for the duplicate check (the list on screen covers only the dates shown) */
  async function existingKeys(sb: SupabaseClient) {
    const keys = new Set<string>();
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from('ledger_outside').select('day,course,title').eq('student_id', r.id).order('id').range(from, from + 999);
      if (error) throw new Error(error.message);
      (data || []).forEach((o: { day: string; course: string; title: string }) => keys.add(dupKey(o.day, o.course, o.title)));
      if (!data || data.length < 1000) return keys;
    }
  }
  async function runImport(sb: SupabaseClient) {
    const imp = st.imp;
    if (!imp || st.importing) return;
    const kid = imp.kids.find(k => k.key === imp.pick), { rows, bad, dup } = prepareImport(kid, imp.existing);
    if (!kid || !rows.length) return;
    st.importing = true; draw();
    let done = 0, failed = '';
    for (let i = 0; i < rows.length; i += 100) {
      const { error } = await sb.from('ledger_outside').insert(rows.slice(i, i + 100).map(x => ({ ...x, student_id: r.id, class_id: ledgerClass, notes: '', source: 'import' })));
      if (error) { failed = error.message; break; }
      done += Math.min(100, rows.length - i);
    }
    st.importing = false;
    const first = rows.map(x => x.day).sort()[0];
    if (first < st.from) st.from = first;
    st.msg = failed ? `Imported ${done} of ${rows.length} entries, then stopped: ${failed}. Import the same file again to bring in the rest (the ones already in are skipped).`
      : `Imported ${done} entries from ${kid.name}’s old Ledger. Skipped ${dup} already in the record and ${bad} that couldn’t be read.`;
    st.imp = null;
    await load();
  }

  function draw() {
    const days = new Set<string>([...st.days.map(d => d.day), ...st.outside.map(o => o.day)]);
    Object.entries(r.subjectTime || {}).forEach(([day, row]) => { if (day >= st.from && day <= st.to && sum(row) >= 60) days.add(day); });
    const list = [...days].sort().reverse();
    const ptMin = Math.round(list.reduce((a, day) => { const row = st.days.find(d => d.day === day); return a + (row ? (row.entry.totalSecs ?? sum(row.entry.subjects)) : sum(r.subjectTime?.[day])); }, 0) / 60);
    const outMin = st.outside.reduce((a, o) => a + (o.minutes || 0), 0);
    const courses = [...new Set([...st.outside.map(o => o.course), ...COURSES])];
    el.innerHTML = `<p class="muted" style="margin-top:0">${esc(r.n)}’s record, one day at a time: what ${esc(r.n)} sent with “I’m done for today”, days not sent (from practice time in the save), and work outside Pet World. Open a day to edit it.</p>
      <div class="row noprint"><label>From <input type="date" id="ledgerFrom" value="${esc(st.from)}"></label><label>To <input type="date" id="ledgerTo" value="${esc(st.to)}"></label><button class="btn small" id="ledgerShow">Show</button> <button class="btn small" id="ledgerEarlier">30 days earlier</button></div>
      <div class="summary"><div class="kpi"><b>${list.length}</b>days with work</div><div class="kpi"><b>${ptMin} min</b>in Pet World</div><div class="kpi"><b>${outMin} min</b>outside Pet World</div></div>
      <details class="card noprint" id="ledgerAdd"${st.editOut === -1 ? ' open' : ''}><summary><b>➕ Add outside work</b></summary>
        <div class="row"><label>Date <input type="date" id="outDay" value="${esc(today)}"></label><label>Course <input id="outCourse" list="ledgerCourses" maxlength="80" placeholder="e.g. Science"></label><label>Minutes <input id="outMin" type="number" min="0" max="1440" value="30" style="width:80px"></label><label>Grade <input id="outGrade" maxlength="20" placeholder="optional" style="width:90px"></label></div>
        <label>Assignment <input id="outTitle" maxlength="300" placeholder="e.g. Chapter 3 worksheet, field trip to the museum" style="width:100%"></label>
        <label>Notes <input id="outNotes" maxlength="1000" placeholder="optional" style="width:100%"></label>
        <div class="row"><button class="btn small primary" id="outAdd">Add</button></div></details>
      <details class="card noprint" id="ledgerImport"${st.imp ? ' open' : ''}><summary><b>📥 Import an old Ledger backup</b></summary>
        <p class="muted" style="margin-top:0">Pick a backup file from the old Ledger app (<code>ledger-backup-….json</code>). Its entries come in as outside work for ${esc(r.n)}. Entries already in the record (same date, course and assignment) are skipped, and so are entries without a date or course.</p>
        <input type="file" id="ledgerFile" accept=".json,application/json"><div id="ledgerImportPreview">${importHTML()}</div></details>
      <datalist id="ledgerCourses">${courses.map(c => `<option value="${esc(c)}"></option>`).join('')}</datalist>
      <p class="status" id="ledgerMsg">${esc(st.msg)}</p>
      ${list.length ? list.map(dayHTML).join('') : '<p class="muted">Nothing recorded in these dates.</p>'}`;
    st.msg = '';
    el.querySelectorAll<HTMLDetailsElement>('[data-ledger-day]').forEach(d => d.addEventListener('toggle', () => { const day = d.dataset.ledgerDay!; if (d.open) st.open.add(day); else st.open.delete(day); }));
  }

  const val = (sel: string, root: ParentNode = el) => (root.querySelector<HTMLInputElement>(sel)?.value ?? '').trim();
  const minutesOf = (v: string) => Math.max(0, Math.min(1440, Math.round(+v) || 0));
  const say = (msg: string) => { const m = el.querySelector('#ledgerMsg'); if (m) m.textContent = msg; };

  el.onchange = event => {
    const t = event.target as HTMLElement;
    if (t.id === 'ledgerKid' && st.imp) { st.imp.pick = (t as HTMLSelectElement).value; draw(); return; }
    if (t.id !== 'ledgerFile' || !client) return;
    const sb = client, file = (t as HTMLInputElement).files?.[0];
    if (!file) return;
    void (async () => {
      const kids = parseBackup(await file.text());
      if (typeof kids === 'string') { st.imp = { error: kids, file: file.name, kids: [], pick: '', existing: new Set() }; draw(); return; }
      let existing: Set<string>;
      try { existing = await existingKeys(sb); } catch (err) { st.imp = { error: `Couldn’t check the record: ${(err as Error).message}`, file: file.name, kids: [], pick: '', existing: new Set() }; draw(); return; }
      const name = r.n.trim().toLowerCase(), first = name.split(/\s+/)[0];
      const match = kids.find(k => k.name.toLowerCase() === name || k.key.toLowerCase() === name) || kids.find(k => k.name.toLowerCase().split(/\s+/)[0] === first);
      st.imp = { file: file.name, kids, pick: match?.key || (kids.length === 1 ? kids[0].key : ''), existing };
      draw();
    })();
  };
  el.onclick = event => {
    const zoom = (event.target as HTMLElement).closest<HTMLImageElement>('img[data-zoom]');
    if (zoom) { const big = zoom.style.maxHeight !== 'none'; zoom.style.maxHeight = big ? 'none' : '110px'; zoom.style.cursor = big ? 'zoom-out' : 'zoom-in'; return; }
    const t = (event.target as HTMLElement).closest<HTMLElement>('button');
    if (!t || !client) return;
    const sb = client, d = t.dataset;
    if (t.id === 'ledgerShow') {
      const from = val('#ledgerFrom'), to = val('#ledgerTo');
      if (!DAY.test(from) || !DAY.test(to) || from > to) { say('Pick a From date on or before the To date.'); return; }
      st.from = from; st.to = to; void load();
    } else if (t.id === 'ledgerEarlier') { st.from = addDays(st.from, -30); void load(); }
    else if (t.id === 'ledgerImportGo') void runImport(sb);
    else if (t.id === 'ledgerImportCancel') { st.imp = null; draw(); }
    else if (t.id === 'outAdd') {
      const day = val('#outDay'), course = val('#outCourse');
      if (!DAY.test(day)) { say('Pick a date.'); return; }
      if (!course) { say('Type a course, like Science or Piano.'); el.querySelector<HTMLInputElement>('#outCourse')?.focus(); return; }
      if (day < st.from) st.from = day;
      if (day > st.to) st.to = day;
      st.open.add(day);
      void run(() => sb.from('ledger_outside').insert({ student_id: r.id, class_id: ledgerClass, day, course: course.slice(0, 80), title: val('#outTitle').slice(0, 300), minutes: minutesOf(val('#outMin')), grade: val('#outGrade').slice(0, 20), notes: val('#outNotes').slice(0, 1000), source: 'teacher' }), `Added ${course} on ${dayName(day)}.`);
    } else if (d.outAddDay) {
      const add = el.querySelector<HTMLDetailsElement>('#ledgerAdd'), box = el.querySelector<HTMLInputElement>('#outDay');
      if (add && box) { add.open = true; box.value = d.outAddDay; add.scrollIntoView({ block: 'center' }); el.querySelector<HTMLInputElement>('#outCourse')?.focus(); }
    } else if (d.outOk) {
      const id = +d.outOk;
      void run(() => sb.from('ledger_outside').update({ review: 'ok', review_note: '' }).eq('id', id), `Marked as checked. ${r.n} sees ✅ on her plan.`);
    } else if (d.outRedo) {
      const id = +d.outRedo;
      const note = (el.querySelector<HTMLInputElement>(`[data-out-note="${id}"]`)?.value || '').trim().slice(0, 500);
      if (!note) { say('Type what to fix, then press Ask for a redo.'); el.querySelector<HTMLInputElement>(`[data-out-note="${id}"]`)?.focus(); return; }
      void run(() => sb.from('ledger_outside').update({ review: 'redo', review_note: note }).eq('id', id), `Sent back to ${r.n} with your note. It’s at the top of ${r.n}’s Today’s plan until it’s fixed.`);
    } else if (d.outEdit) { st.editOut = +d.outEdit; draw(); }
    else if (t.hasAttribute('data-out-cancel')) { st.editOut = 0; draw(); }
    else if (d.outSave) {
      const row = el.querySelector<HTMLElement>(`[data-out-row="${d.outSave}"]`)!, day = val('[data-o="day"]', row), course = val('[data-o="course"]', row);
      if (!DAY.test(day) || !course) { say('A day needs a date and a course.'); return; }
      if (day < st.from) st.from = day;
      if (day > st.to) st.to = day;
      st.open.add(day);
      void run(() => sb.from('ledger_outside').update({ day, course: course.slice(0, 80), title: val('[data-o="title"]', row).slice(0, 300), minutes: minutesOf(val('[data-o="minutes"]', row)), grade: val('[data-o="grade"]', row).slice(0, 20), notes: val('[data-o="notes"]', row).slice(0, 1000) }).eq('id', +d.outSave!), 'Saved.');
    } else if (d.outDelete) {
      const id = +d.outDelete;
      if (deleteArmed !== id) { deleteArmed = id; if (deleteTimer) clearTimeout(deleteTimer); deleteTimer = setTimeout(() => { deleteArmed = 0; draw(); }, 5000); draw(); return; }
      deleteArmed = 0; if (deleteTimer) clearTimeout(deleteTimer);
      void run(() => sb.from('ledger_outside').delete().eq('id', id), 'Deleted.');
    } else if (d.dayEditOpen) { st.edit = d.dayEditOpen; st.open.add(st.edit); draw(); }
    else if (t.hasAttribute('data-day-cancel')) { st.edit = ''; draw(); }
    else if (d.daySave) {
      const day = d.daySave, row = st.days.find(x => x.day === day), box = el.querySelector<HTMLElement>(`[data-day-edit="${day}"]`);
      if (!row || !box) return;
      const before = row.entry, subjects: Record<string, number> = {};
      box.querySelectorAll<HTMLInputElement>('[data-edit-subject]').forEach(i => {
        const id = i.dataset.editSubject!, old = before.subjects?.[id] || 0, raw = i.value.trim();
        if (raw === '') return;   // an empty box takes the subject off the day
        const m = minutesOf(raw);
        if (old && Math.round(old / 60) === m) subjects[id] = old;   // an unchanged box keeps the exact seconds
        else if (m) subjects[id] = m * 60;
      });
      const events = (before.events || []).filter((_, i) => box.querySelector<HTMLInputElement>(`[data-edit-event="${i}"]`)?.checked);
      const added = val('[data-edit-add]', box).slice(0, 200);
      if (added) events.push({ t: Date.now(), k: 'note', text: added });
      const plain: LedgerEntry = { ...before }; delete plain.original;
      const entry: LedgerEntry = { ...plain, subjects, totalSecs: sum(subjects), events, note: (box.querySelector<HTMLTextAreaElement>('[data-edit-note]')?.value || '').trim().slice(0, 1000), original: before.original ?? (row.edited_by_teacher ? null : plain) };
      void run(() => sb.from('ledger_days').update({ entry, edited_by_teacher: true }).eq('student_id', r.id).eq('day', day), `Saved ${dayName(day)}. ${r.n}’s “I’m done for today” won’t change it now.`);
    } else if (d.dayRevert) {
      const day = d.dayRevert, row = st.days.find(x => x.day === day);
      if (!row?.entry.original) return;
      void run(() => sb.from('ledger_days').update({ entry: row.entry.original, edited_by_teacher: false }).eq('student_id', r.id).eq('day', day), `${dayName(day)} is back to ${r.n}’s version.`);
    } else if (d.dayFromsave) {
      const day = d.dayFromsave, entry = entryFromSave(day, r);
      void run(() => sb.from('ledger_days').insert({ student_id: r.id, class_id: ledgerClass, day, entry, edited_by_teacher: false }), `Saved ${dayName(day)} to the record.`);
    }
  };
  void load();
}
