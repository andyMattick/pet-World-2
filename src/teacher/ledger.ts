/* The Ledger tab on a student's page (docs/LEDGER.md step 4): the Pet Town days the student sent with
   "I'm done for today", days not sent yet (from time by subject in the save), and work outside Pet Town that a
   grown-up adds. A grown-up can edit any day; an edited Pet Town day keeps the student's version so it can go back. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUBJECT_TIME, subjectDayKey } from '../shared/subjectTime';

interface LedgerEvent { t?: number; k?: string; text?: string; [key: string]: unknown }
interface LedgerEntry {
  v?: number; day?: string; totalSecs?: number; subjects?: Record<string, number>;
  lessons?: { key: string; label: string; secs: number }[]; orders?: { key: string; label: string; n: number; ok: number }[];
  events?: LedgerEvent[]; extras?: { label: string; done: number; goal: number }[]; goals?: { subject: string; label: string; done: number; goal: number }[];
  note?: string; fromSave?: boolean; original?: LedgerEntry | null;
}
interface DayRow { day: string; entry: LedgerEntry; sent_at: string; edited_by_teacher: boolean }
interface OutsideRow { id: number; day: string; course: string; title: string; minutes: number; grade: string; notes: string; source: string }
export interface LedgerStudent { id: string; n: string; subjectTime?: Record<string, Record<string, number>> }

let client: SupabaseClient | null = null, ledgerClass = '';
/** main.ts calls this when a class opens, so the Ledger reads and writes that class's rows. */
export function setLedgerClass(sb: SupabaseClient | null, classId: string) { client = sb; ledgerClass = classId; }

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const SUBJECT_NAMES: Record<string, string> = Object.fromEntries(SUBJECT_TIME);
const COURSES = ['Math', 'English', 'Reading', 'Writing', 'Spelling', 'History', 'Science', 'Art', 'Music', 'PE'];
const mins = (secs: number) => (secs > 0 && secs < 60 ? '<1' : String(Math.round(secs / 60)));
const sum = (o: Record<string, number> | undefined) => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0);
const addDays = (day: string, n: number) => { const d = new Date(`${day}T12:00:00`); d.setDate(d.getDate() + n); return subjectDayKey(d); };
const dayName = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function entryHTML(e: LedgerEntry) {
  const subjects = Object.entries(e.subjects || {}).filter(([, s]) => s >= 30).sort((a, b) => b[1] - a[1]);
  const list = (title: string, items: string[]) => (items.length ? `<h4 style="margin:10px 0 4px">${title}</h4><ul style="margin:0">${items.join('')}</ul>` : '');
  const time = (t?: number) => (t ? `<span class="muted">${new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span> ` : '');
  return list('Time by subject', subjects.map(([id, s]) => `<li>${esc(SUBJECT_NAMES[id] || id)}: <b>${mins(s)} min</b></li>`))
    + list('Time by lesson', (e.lessons || []).map(l => `<li>${esc(l.label)}: <b>${mins(l.secs)} min</b></li>`))
    + list('Practice orders', (e.orders || []).map(o => `<li>${esc(o.label)}: <b>${o.n}</b> order${o.n === 1 ? '' : 's'}, ${o.ok} perfect</li>`))
    + list('Finished', (e.events || []).map(ev => `<li>${time(ev.t)}${esc(ev.text || ev.k || '')}</li>`))
    + list('📋 Extras', (e.extras || []).map(x => `<li>${x.done >= x.goal ? '✅' : '⬜'} ${esc(x.label)}: ${x.done} of ${x.goal} min</li>`))
    + list('🎯 Time goals', (e.goals || []).map(g => `<li>${g.done >= g.goal ? '✅' : '⬜'} ${esc(g.label)}: ${g.done} of ${g.goal} min</li>`))
    + (e.note ? `<p><b>Grown-up’s note:</b> ${esc(e.note)}</p>` : '')
    + (e.fromSave ? '<p class="muted">Saved from time by subject; lesson detail wasn’t sent for this day.</p>' : '')
    + (!subjects.length && !(e.events || []).length && !e.note ? '<p class="muted">No practice time recorded.</p>' : '');
}

export function renderLedger(el: HTMLElement, r: LedgerStudent) {
  const today = subjectDayKey();
  const st = { from: addDays(today, -29), to: today, days: [] as DayRow[], outside: [] as OutsideRow[], open: new Set<string>([today]), edit: '', editOut: 0, msg: '' };
  let deleteArmed = 0, deleteTimer: ReturnType<typeof setTimeout> | null = null;

  async function load() {
    if (!client) { el.innerHTML = '<p class="muted">The Ledger needs the online teacher app (signed in to the database).</p>'; return; }
    el.innerHTML = '<p class="muted">Loading the Ledger…</p>';
    const [a, b] = await Promise.all([
      client.from('ledger_days').select('day,entry,sent_at,edited_by_teacher').eq('student_id', r.id).gte('day', st.from).lte('day', st.to),
      client.from('ledger_outside').select('id,day,course,title,minutes,grade,notes,source').eq('student_id', r.id).gte('day', st.from).lte('day', st.to).order('id')
    ]);
    const err = a.error || b.error;
    if (err) { el.innerHTML = `<p class="status">Couldn’t load the Ledger: ${esc(err.message)}. Has database file 8 (<code>20261017000000_ledger.sql</code>) been run in Supabase?</p>`; return; }
    st.days = (a.data || []) as DayRow[]; st.outside = (b.data || []) as OutsideRow[];
    draw();
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
    return `<tr><td>${esc(o.course)}${o.source === 'import' ? ' <span class="tag i">imported</span>' : ''}</td><td>${esc(o.title) || '<span class="muted">—</span>'}</td><td>${o.minutes} min</td><td>${esc(o.grade) || '<span class="muted">—</span>'}</td><td>${esc(o.notes)}</td>
      <td style="white-space:nowrap"><button class="btn small" data-out-edit="${o.id}">Edit</button> <button class="btn small" data-out-delete="${o.id}">${deleteArmed === o.id ? 'Click again to delete' : 'Delete'}</button></td></tr>`;
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

  function dayHTML(day: string) {
    const row = st.days.find(d => d.day === day), outs = st.outside.filter(o => o.day === day);
    const saveRow = r.subjectTime?.[day] || {}, saveSecs = sum(saveRow);
    const ptSecs = row ? (row.entry.totalSecs ?? sum(row.entry.subjects)) : saveSecs, outMin = outs.reduce((a, o) => a + (o.minutes || 0), 0);
    const tags = [row?.edited_by_teacher ? '<span class="tag a">edited by a grown-up</span>' : '', !row && saveSecs ? '<span class="tag stale-tag">not sent yet</span>' : ''].filter(Boolean).join(' ');
    let body = '<h3 style="margin:8px 0 4px">🏡 Pet Town</h3>';
    if (row && st.edit === day) body += editDayHTML(row);
    else if (row) body += entryHTML(row.entry) + `<p class="muted">${row.entry.fromSave ? 'Saved by a grown-up' : `Sent ${new Date(row.sent_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}.</p>
      <div class="row"><button class="btn small" data-day-edit-open="${esc(day)}">Edit this day</button>${row.entry.original ? ` <button class="btn small" data-day-revert="${esc(day)}">Go back to ${esc(r.n)}’s version</button>` : ''}</div>`;
    else if (saveSecs) body += `<p class="muted" style="margin:0">${esc(r.n)} didn’t press “I’m done for today”. Time by subject from the save:</p><ul style="margin:4px 0">${Object.entries(saveRow).filter(([, s]) => s >= 30).map(([id, s]) => `<li>${esc(SUBJECT_NAMES[id] || id)}: <b>${mins(s)} min</b></li>`).join('')}</ul>
      <div class="row"><button class="btn small" data-day-fromsave="${esc(day)}">Save this day to the record</button></div>`;
    else body += '<p class="muted" style="margin:0">No Pet Town time this day.</p>';
    body += `<h3 style="margin:12px 0 4px">📚 Outside Pet Town</h3>${outs.length ? `<table class="steptable"><tr><th>Course</th><th>Assignment</th><th>Time</th><th>Grade</th><th>Notes</th><th></th></tr>${outs.map(outsideRowHTML).join('')}</table>` : '<p class="muted" style="margin:0">Nothing added.</p>'}
      <div class="row"><button class="btn small" data-out-add-day="${esc(day)}">➕ Add outside work on this day</button></div>`;
    return `<details class="unit-card" data-ledger-day="${esc(day)}"${st.open.has(day) ? ' open' : ''}><summary><b>${esc(dayName(day))}</b><span class="unit-sum">Pet Town ${mins(ptSecs)} min${outs.length ? ` · outside ${outMin} min` : ''}</span> ${tags}</summary>${body}</details>`;
  }

  function draw() {
    const days = new Set<string>([...st.days.map(d => d.day), ...st.outside.map(o => o.day)]);
    Object.entries(r.subjectTime || {}).forEach(([day, row]) => { if (day >= st.from && day <= st.to && sum(row) >= 60) days.add(day); });
    const list = [...days].sort().reverse();
    const ptMin = Math.round(list.reduce((a, day) => { const row = st.days.find(d => d.day === day); return a + (row ? (row.entry.totalSecs ?? sum(row.entry.subjects)) : sum(r.subjectTime?.[day])); }, 0) / 60);
    const outMin = st.outside.reduce((a, o) => a + (o.minutes || 0), 0);
    const courses = [...new Set([...st.outside.map(o => o.course), ...COURSES])];
    el.innerHTML = `<p class="muted" style="margin-top:0">${esc(r.n)}’s record, one day at a time: what ${esc(r.n)} sent with “I’m done for today”, days not sent (from practice time in the save), and work outside Pet Town. Open a day to edit it.</p>
      <div class="row noprint"><label>From <input type="date" id="ledgerFrom" value="${esc(st.from)}"></label><label>To <input type="date" id="ledgerTo" value="${esc(st.to)}"></label><button class="btn small" id="ledgerShow">Show</button> <button class="btn small" id="ledgerEarlier">30 days earlier</button></div>
      <div class="summary"><div class="kpi"><b>${list.length}</b>days with work</div><div class="kpi"><b>${ptMin} min</b>in Pet Town</div><div class="kpi"><b>${outMin} min</b>outside Pet Town</div></div>
      <details class="card noprint" id="ledgerAdd"${st.editOut === -1 ? ' open' : ''}><summary><b>➕ Add outside work</b></summary>
        <div class="row"><label>Date <input type="date" id="outDay" value="${esc(today)}"></label><label>Course <input id="outCourse" list="ledgerCourses" maxlength="80" placeholder="e.g. Science"></label><label>Minutes <input id="outMin" type="number" min="0" max="1440" value="30" style="width:80px"></label><label>Grade <input id="outGrade" maxlength="20" placeholder="optional" style="width:90px"></label></div>
        <label>Assignment <input id="outTitle" maxlength="300" placeholder="e.g. Chapter 3 worksheet, field trip to the museum" style="width:100%"></label>
        <label>Notes <input id="outNotes" maxlength="1000" placeholder="optional" style="width:100%"></label>
        <div class="row"><button class="btn small primary" id="outAdd">Add</button></div></details>
      <datalist id="ledgerCourses">${courses.map(c => `<option value="${esc(c)}"></option>`).join('')}</datalist>
      <p class="status" id="ledgerMsg">${esc(st.msg)}</p>
      ${list.length ? list.map(dayHTML).join('') : '<p class="muted">Nothing recorded in these dates.</p>'}`;
    st.msg = '';
    el.querySelectorAll<HTMLDetailsElement>('[data-ledger-day]').forEach(d => d.addEventListener('toggle', () => { const day = d.dataset.ledgerDay!; if (d.open) st.open.add(day); else st.open.delete(day); }));
  }

  const val = (sel: string, root: ParentNode = el) => (root.querySelector<HTMLInputElement>(sel)?.value ?? '').trim();
  const minutesOf = (v: string) => Math.max(0, Math.min(1440, Math.round(+v) || 0));
  const say = (msg: string) => { const m = el.querySelector('#ledgerMsg'); if (m) m.textContent = msg; };

  el.onclick = event => {
    const t = (event.target as HTMLElement).closest<HTMLElement>('button');
    if (!t || !client) return;
    const sb = client, d = t.dataset;
    if (t.id === 'ledgerShow') {
      const from = val('#ledgerFrom'), to = val('#ledgerTo');
      if (!DAY.test(from) || !DAY.test(to) || from > to) { say('Pick a From date on or before the To date.'); return; }
      st.from = from; st.to = to; void load();
    } else if (t.id === 'ledgerEarlier') { st.from = addDays(st.from, -30); void load(); }
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
      const day = d.dayFromsave, subjects = { ...(r.subjectTime?.[day] || {}) };
      const entry: LedgerEntry = { v: 1, day, totalSecs: sum(subjects), subjects, lessons: [], orders: [], events: [], fromSave: true };
      void run(() => sb.from('ledger_days').insert({ student_id: r.id, class_id: ledgerClass, day, entry, edited_by_teacher: false }), `Saved ${dayName(day)} to the record.`);
    }
  };
  void load();
}
