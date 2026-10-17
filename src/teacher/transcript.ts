/* The transcript on a student's page (docs/LEDGER.md step 7, ROADMAP F11). The grown-up sets each school year's
   start and end dates; each year lists its courses (Pet Town and outside) with hours, what was finished and the
   grade, plus totals. Grades start from the Grades tab (its names, overrides and "on transcript" ticks) and can be
   changed for one year only. Prints one year or the full transcript. Saved in quiz_overrides as "transcript". */
import { computeCourses, loadLedgerTotals, parseCourseSettings, gradeNumber, gradeText, shownGrade, type CourseRow, type CourseStudent, type LedgerTotals } from './courses';
import { ledgerClient } from './ledger';
import { subjectDayKey } from '../shared/subjectTime';

interface YearCourse { id: string; name: string; hours?: number; grade?: string }
interface SchoolYear { id: string; name: string; from: string; to: string; level?: string; grades?: Record<string, string>; off?: string[]; add?: YearCourse[] }
interface TranscriptSettings { school?: string; years?: SchoolYear[] }
interface YearRow { id: string; name: string; hours: number; finished: string; grade: string; num: number | null; kind: string; off: boolean; yearGrade: string; suggestedText: string }

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const longDate = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
const hoursText = (h: number) => (h >= 10 ? String(Math.round(h)) : h.toFixed(1));

function parseTranscript(raw: unknown): TranscriptSettings {
  try { const v = typeof raw === 'string' ? JSON.parse(raw) : raw; return v && typeof v === 'object' && !Array.isArray(v) ? v as TranscriptSettings : {}; } catch { return {}; }
}
/* a year's courses: the Grades tab's work in those dates, then this year's own grades, ticks and added courses */
function yearRows(r: CourseStudent, coursesRaw: unknown, data: LedgerTotals, y: SchoolYear): YearRow[] {
  const s = parseCourseSettings(coursesRaw), today = subjectDayKey();
  /* courses added on the Grades tab have no dates: they belong to the year that holds today */
  const courses = computeCourses(r, { ...s, add: today >= y.from && today <= y.to ? s.add : [] }, data, { from: y.from, to: y.to });
  const rows: YearRow[] = courses.filter((c: CourseRow) => c.kind !== 'pettown' || c.hours >= 0.05 || c.test != null || c.quiz != null).map((c: CourseRow) => {
    const yearGrade = (y.grades?.[c.id] || '').trim(), grade = yearGrade || (c.grade ? c.grade : '');
    const shown = yearGrade ? shownGrade({ ...c, grade: yearGrade }) : shownGrade(c);
    return { id: c.id, name: c.name, hours: c.hours, finished: c.finished, grade: shown, num: gradeNumber(grade) ?? c.suggested, kind: c.kind, off: c.off || !!y.off?.includes(c.id), yearGrade, suggestedText: gradeText(c.suggested) };
  });
  (y.add || []).forEach(a => rows.push({ id: a.id, name: a.name, hours: +(a.hours || 0), finished: '', grade: a.grade ? shownGrade({ grade: a.grade, suggested: null } as CourseRow) : '—', num: gradeNumber(a.grade), kind: 'year', off: !!y.off?.includes(a.id), yearGrade: a.grade || '', suggestedText: '—' }));
  return rows;
}
function totals(rows: YearRow[]) {
  const on = rows.filter(x => !x.off), graded = on.map(x => x.num).filter((n): n is number => n != null);
  return { courses: on.length, hours: on.reduce((a, x) => a + x.hours, 0), avg: graded.length ? graded.reduce((a, b) => a + b, 0) / graded.length : null };
}

/* the printed page: plain black-on-white, one section per year */
function printHTML(name: string, school: string, years: { y: SchoolYear; rows: YearRow[] }[], full: boolean) {
  const all = years.flatMap(x => x.rows.filter(r => !r.off)), t = totals(all);
  const section = ({ y, rows }: { y: SchoolYear; rows: YearRow[] }) => {
    const on = rows.filter(x => !x.off), yt = totals(rows);
    return `<section><h2>${esc(y.name)}${y.level ? ` · ${esc(y.level)}` : ''}</h2><p class="dates">${esc(longDate(y.from))} to ${esc(longDate(y.to))}</p>
      <table><thead><tr><th>Course</th><th class="n">Hours</th><th>Completed</th><th class="n">Grade</th></tr></thead><tbody>
      ${on.map(x => `<tr><td>${esc(x.name)}</td><td class="n">${hoursText(x.hours)}</td><td>${esc(x.finished)}</td><td class="n">${esc(x.grade)}</td></tr>`).join('') || '<tr><td colspan="4">No courses recorded.</td></tr>'}
      </tbody><tfoot><tr><td>${yt.courses} course${yt.courses === 1 ? '' : 's'}</td><td class="n">${hoursText(yt.hours)}</td><td></td><td class="n">${yt.avg == null ? '' : `Average ${esc(gradeText(yt.avg))}`}</td></tr></tfoot></table></section>`;
  };
  return `<!doctype html><html><head><meta charset="utf-8"><title>Transcript · ${esc(name)}</title><style>
    body{font:14px/1.45 Georgia,'Times New Roman',serif;color:#000;background:#fff;margin:32px auto;max-width:760px;padding:0 16px}
    h1{font-size:24px;margin:0 0 4px;text-align:center;letter-spacing:.04em} .sub{text-align:center;margin:0 0 20px}
    h2{font-size:17px;margin:22px 0 2px;border-bottom:1px solid #000;padding-bottom:2px} .dates{margin:0 0 8px;font-style:italic}
    table{width:100%;border-collapse:collapse} th,td{padding:4px 6px;border-bottom:1px solid #bbb;text-align:left;vertical-align:top} th{border-bottom:1px solid #000}
    .n{text-align:right;white-space:nowrap} tfoot td{font-weight:bold;border-bottom:0;border-top:1px solid #000}
    .total{margin-top:24px;border:1px solid #000;padding:8px 12px} .sign{margin-top:48px;display:flex;gap:40px} .sign div{flex:1;border-top:1px solid #000;padding-top:4px}
    section{break-inside:avoid} @media print{body{margin:0 auto}}
  </style></head><body><h1>${full ? 'Academic Transcript' : 'School Year Report'}</h1>
  <p class="sub"><b>${esc(name)}</b>${school ? `<br>${esc(school)}` : ''}<br>Printed ${esc(longDate(subjectDayKey()))}</p>
  ${years.map(section).join('')}
  ${full && years.length > 1 ? `<div class="total"><b>All years:</b> ${t.courses} courses · ${hoursText(t.hours)} hours${t.avg == null ? '' : ` · average grade ${esc(gradeText(t.avg))}`}</div>` : ''}
  <div class="sign"><div>Parent or teacher signature</div><div>Date</div></div></body></html>`;
}

export function renderTranscript(el: HTMLElement, r: CourseStudent, getCourses: () => unknown, getSettings: () => unknown, save: (value: string | null) => Promise<void>) {
  let data: LedgerTotals | null = null, pick = '', msg = '';
  const settings = () => parseTranscript(getSettings());
  async function load() {
    const sb = ledgerClient();
    if (!sb) { el.innerHTML = '<p class="muted">The transcript needs the online teacher app (signed in to the database).</p>'; return; }
    el.innerHTML = '<p class="muted">Adding up the years…</p>';
    try { data = await loadLedgerTotals(sb, r.id); } catch (err) { el.innerHTML = `<p class="status">Couldn’t read the Ledger: ${esc((err as Error).message)}</p>`; return; }
    draw();
  }
  function draw() {
    if (!data) return;
    const s = settings(), years = [...(s.years || [])].sort((a, b) => b.from.localeCompare(a.from)), today = subjectDayKey();
    if (!years.some(y => y.id === pick)) pick = (years.find(y => today >= y.from && today <= y.to) || years[0])?.id || '';
    const y = years.find(x => x.id === pick), rows = y ? yearRows(r, getCourses(), data, y) : [], t = totals(rows);
    const thisYear = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    el.innerHTML = `<p class="muted" style="margin-top:0">Set each school year’s dates. Each year lists the courses with work in those dates, with hours and grades from the Grades tab; change a grade here for this year only. Print one year, or the full transcript with every year.</p>
      <div class="row"><label>School name <input id="tSchool" maxlength="100" value="${esc(s.school || '')}" placeholder="e.g. Mattick Home School" style="width:240px"></label><button class="btn small" id="tSchoolSave">Save</button></div>
      <h3>School years</h3>
      ${years.length ? `<table class="steptable"><tr><th>Year</th><th>Dates</th><th>Grade level</th><th></th></tr>${years.map(x => `<tr${x.id === pick ? ' style="font-weight:700"' : ''}><td>${esc(x.name)}</td><td>${esc(x.from)} to ${esc(x.to)}</td><td>${esc(x.level || '')}</td><td style="white-space:nowrap"><button class="btn small" data-t-open="${esc(x.id)}">${x.id === pick ? 'Showing' : 'Show'}</button> <button class="btn small" data-t-del="${esc(x.id)}">Delete</button></td></tr>`).join('')}</table>` : '<p class="muted">No school years yet. Add the first one below.</p>'}
      <details class="card noprint"${years.length ? '' : ' open'}><summary><b>➕ Add a school year</b></summary>
        <div class="row"><label>Name <input id="tyName" maxlength="40" value="${thisYear}–${thisYear + 1}" style="width:110px"></label><label>Starts <input type="date" id="tyFrom" value="${thisYear}-08-01"></label><label>Ends <input type="date" id="tyTo" value="${thisYear + 1}-06-30"></label><label>Grade level <input id="tyLevel" maxlength="30" placeholder="e.g. 6th grade" style="width:110px"></label><button class="btn small primary" id="tyAdd">Add year</button></div></details>
      ${y ? `<h3>${esc(y.name)}${y.level ? ` · ${esc(y.level)}` : ''} <span class="muted" style="font-weight:400">${esc(y.from)} to ${esc(y.to)}</span></h3>
      <div class="row"><label>Starts <input type="date" id="tyEditFrom" value="${esc(y.from)}"></label><label>Ends <input type="date" id="tyEditTo" value="${esc(y.to)}"></label><label>Grade level <input id="tyEditLevel" maxlength="30" value="${esc(y.level || '')}" style="width:110px"></label></div>
      <div class="tablewrap"><table class="steptable"><tr><th>Course</th><th>Hours</th><th>Completed</th><th>From Grades tab</th><th>Grade this year</th><th>On transcript</th></tr>
      ${rows.map(x => `<tr data-ty-row="${esc(x.id)}"><td>${esc(x.name)}${x.kind === 'year' ? ' <span class="tag a">this year</span>' : ''}</td><td>${hoursText(x.hours)}</td><td>${esc(x.finished)}</td><td>${x.kind === 'year' ? '<span class="muted">—</span>' : esc(x.yearGrade ? x.suggestedText : x.grade)}</td>
        <td><input data-ty-grade value="${esc(x.yearGrade)}" maxlength="20" placeholder="${x.kind === 'year' ? 'e.g. 95' : 'same as Grades'}" style="width:90px" aria-label="Grade this year"></td>
        <td style="white-space:nowrap"><input type="checkbox" data-ty-on ${x.off ? '' : 'checked'} aria-label="On transcript">${x.kind === 'year' ? ` <button class="btn small" data-ty-remove="${esc(x.id)}">Remove</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">No work in these dates yet.</td></tr>'}</table></div>
      <p><b>${t.courses}</b> courses on the transcript · <b>${hoursText(t.hours)}</b> hours${t.avg == null ? '' : ` · average <b>${esc(gradeText(t.avg))}</b>`}</p>
      <p class="muted" style="margin:0">Math scores count the quizzes and tests taken in these dates. English, History and Biology scores have no dates in Pet Town, so they count every quiz and test so far.</p>
      <div class="row"><label>Add a course to this year <input id="tyAddName" maxlength="80" placeholder="e.g. Piano"></label><label>Hours <input id="tyAddHours" type="number" min="0" max="2000" step="0.5" style="width:80px"></label><label>Grade <input id="tyAddGrade" maxlength="20" style="width:80px"></label><button class="btn small" id="tyAddCourse">Add</button></div>
      <div class="row"><button class="btn small primary" id="tySave">Save this year</button> <button class="btn small" id="tPrintYear">🖨️ Print this year</button> <button class="btn small" id="tPrintAll">🖨️ Print full transcript</button></div>` : ''}
      <p class="status" id="tMsg">${esc(msg)}</p>`;
    msg = '';
  }
  async function store(next: TranscriptSettings, done: string) {
    const empty = !next.school && !(next.years || []).length;
    await save(empty ? null : JSON.stringify(next));
    msg = JSON.stringify(settings()) === JSON.stringify(empty ? {} : next) ? done : 'Couldn’t save. Try again.';
    draw();
  }
  const say = (m: string) => { const p = el.querySelector('#tMsg'); if (p) p.textContent = m; };
  const val = (sel: string) => (el.querySelector<HTMLInputElement>(sel)?.value || '').trim();
  /* this year as it stands on the page: dates, level, per-year grades, ticks and added courses */
  function readYear(y: SchoolYear): SchoolYear | string {
    const from = val('#tyEditFrom'), to = val('#tyEditTo');
    if (!DAY.test(from) || !DAY.test(to) || from > to) return 'The year needs a start date on or before its end date.';
    const grades: Record<string, string> = {}, off: string[] = [], add: YearCourse[] = [];
    el.querySelectorAll<HTMLElement>('[data-ty-row]').forEach(tr => {
      const id = tr.dataset.tyRow!, grade = (tr.querySelector<HTMLInputElement>('[data-ty-grade]')?.value || '').trim().slice(0, 20);
      if (!tr.querySelector<HTMLInputElement>('[data-ty-on]')?.checked) off.push(id);
      const own = (y.add || []).find(a => a.id === id);
      if (own) add.push({ ...own, grade });
      else if (grade) grades[id] = grade;
    });
    return { ...y, from, to, level: val('#tyEditLevel').slice(0, 30), grades, off, add };
  }
  function openPrint(full: boolean) {
    if (!data) return;
    const s = settings(), list = [...(s.years || [])].sort((a, b) => a.from.localeCompare(b.from)).filter(y => full || y.id === pick);
    if (!list.length) { say('Add a school year first.'); return; }
    const w = window.open('', '_blank');
    if (!w) { say('The print window was blocked. Allow pop-ups for this site and try again.'); return; }
    w.document.write(printHTML(r.n, s.school || '', list.map(y => ({ y, rows: yearRows(r, getCourses(), data!, y) })), full));
    w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
  }
  el.onclick = event => {
    const t = (event.target as HTMLElement).closest<HTMLElement>('button');
    if (!t) return;
    const s = settings(), years = s.years || [], d = t.dataset;
    if (t.id === 'tSchoolSave') void store({ ...s, school: val('#tSchool').slice(0, 100) }, 'Saved the school name.');
    else if (t.id === 'tyAdd') {
      const from = val('#tyFrom'), to = val('#tyTo'), name = val('#tyName').slice(0, 40) || `${from.slice(0, 4)}–${to.slice(0, 4)}`;
      if (!DAY.test(from) || !DAY.test(to) || from > to) { say('Pick a start date on or before the end date.'); return; }
      const overlap = years.find(y => from <= y.to && to >= y.from);
      if (overlap) { say(`Those dates overlap ${overlap.name}. Change one so each day belongs to one year.`); return; }
      const y: SchoolYear = { id: `y${Date.now().toString(36)}`, name, from, to, level: val('#tyLevel').slice(0, 30) };
      pick = y.id;
      void store({ ...s, years: [...years, y] }, `Added ${name}.`);
    } else if (d.tOpen) { pick = d.tOpen; draw(); }
    else if (d.tDel) {
      const y = years.find(x => x.id === d.tDel);
      if (!y) return;
      if (t.dataset.armed !== '1') { t.dataset.armed = '1'; t.textContent = 'Click again to delete'; setTimeout(() => { if (t.isConnected) { t.dataset.armed = ''; t.textContent = 'Delete'; } }, 5000); return; }
      void store({ ...s, years: years.filter(x => x.id !== y.id) }, `Deleted ${y.name}. Its Ledger work and grades are unchanged.`);
    } else if (t.id === 'tySave' || t.id === 'tyAddCourse' || d.tyRemove) {
      const y = years.find(x => x.id === pick);
      if (!y) return;
      const next = readYear(y);
      if (typeof next === 'string') { say(next); return; }
      const overlap = years.find(x => x.id !== y.id && next.from <= x.to && next.to >= x.from);
      if (overlap) { say(`Those dates overlap ${overlap.name}.`); return; }
      let done = `Saved ${y.name}.`;
      if (t.id === 'tyAddCourse') {
        const name = val('#tyAddName').slice(0, 80);
        if (!name) { say('Type the course name.'); return; }
        next.add = [...(next.add || []), { id: `ya${Date.now().toString(36)}`, name, hours: Math.max(0, Math.min(2000, +val('#tyAddHours') || 0)), grade: val('#tyAddGrade').slice(0, 20) }];
        done = `Added ${name} to ${y.name}.`;
      } else if (d.tyRemove) { next.add = (next.add || []).filter(a => a.id !== d.tyRemove); next.off = (next.off || []).filter(id => id !== d.tyRemove); done = 'Removed.'; }
      void store({ ...s, years: years.map(x => (x.id === y.id ? next : x)) }, done);
    } else if (t.id === 'tPrintYear') openPrint(false);
    else if (t.id === 'tPrintAll') openPrint(true);
  };
  void load();
}
