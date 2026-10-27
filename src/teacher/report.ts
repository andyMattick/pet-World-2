/* Renders the class dashboard from the per-student reports that class_report() returns. */
import { renderBibleCard, bibleVerseStatus } from './bible';
import { writtenReview, reviewScore, encodeTeacherReview, TYPE_LABELS } from '../shared/questionTypes';
import { LESSON_COURSES } from '../shared/questionBanks';
import { subjectTimeTableHTML, GOAL_SUBJECTS, parseSubjectGoals } from '../shared/subjectTime';
import { thinkReportHTML } from '../shared/thinkReport';
import { brainReportHTML, type BrainSettings } from '../shared/brainGames';
import { renderLedger, type SaveDayLog } from './ledger';
import { startRightNow } from './live';
import { renderCourses } from './courses';
import { renderTranscript } from './transcript';
import { renderPlanCard } from './plan';
import { SKILLS, SKILL_ORDER as ORDER, SHOPS, BUILDINGS, DEFAULT_HOME, builtHoods, validHood, shopOfSkill, MIS, statusFromRecent, drillLabel, DRILLS, type DrillSettings } from '../shared/registry';
/* extras a grown-up assigns one student (ROADMAP F7) */
interface Extra { id: string; kind: 'sprint' | 'vocab'; minutes: number; skills?: string[]; tables?: number[]; mode?: string; challenge?: number }
const DRILL_NAMES = DRILLS as unknown as Record<string, { name?: string }>;
const VOCAB_MODES: Record<string, string> = { practice: '🃏 Practice cards', sprint: '⚡ Word sprint', spell: '🔤 Spell it' };

type DrillHistory = Record<string, { miss?: number; slow?: number; sprint?: number; popups?: number; missesAfter?: number; reteach?: boolean }>;
interface AssessmentHistory { shop: string; station: number | null; kind: 'quiz' | 'test'; score: number; total: number; passed: boolean; missed: string[]; t: number }
type SaveStudentDrills = (id: string, settings: Partial<DrillSettings> | null) => Promise<void>;
type ResetStudent = (id: string, clearHistory: boolean) => Promise<void>;
type SaveQuizOverride = (id: string, overrides: Record<string, string> | null) => Promise<void>;

export interface StudentReport {
  id: string; n: string; cl?: string; t: number; o: number; pf: number; tm: number;
  k: Record<string, [number, string]>;
  s: Record<string, Record<string, [number, number, number, string]>>;
  cc: [number, number, number, number];
  m: Record<string, [number, string[]]>;
  f: [string, number, number, number][]; df: [string, number, number, number][];
  p: Record<string, { miss?: number; slow?: number; sprint?: number }>; dr?: DrillHistory; ds?: Partial<DrillSettings> | null; dl?: DrillHistory; sp: number;
  qz?: AssessmentHistory[]; qx?: Record<string, string> | null;
  ss?: PracticeSummary;
  readingBooks?: { id?: string; title: string; author?: string; chapters: ReadingChapter[]; quizzes?: ReadingQuiz[] }[];
  elaProgress?: Record<string, { answered?: number; misses?: number; tries?: number; best?: number; passed?: boolean; questionCount?: number }>;
  historyProgress?: Record<string, { answered?: number; misses?: number; tries?: number; best?: number; passed?: boolean; questionCount?: number }>;
  historyProjects?: Record<string, { answers?: Record<string, string>; status?: string; submittedAt?: number; localReview?: string }>;
  scienceProgress?: Record<string, { answered?: number; misses?: number; tries?: number; best?: number; passed?: boolean; questionCount?: number }>;
  scienceProjects?: Record<string, { answers?: Record<string, string>; status?: string; submittedAt?: number; localReview?: string }>;
  writtenAnswers?: WrittenEntry[];
  help?: HelpQuestion[];   // ✋ questions she asked (docs/QUESTIONS.md), from the save
  subjectTime?: Record<string, Record<string, number>>;
  dayLog?: Record<string, SaveDayLog>;   // the save's day log (src/teacher/ledger.ts)
  bible?: unknown;   // ✝️ S.bible from the save: journal, books game, verse practice
  chat?: { replies?: { id: string; at: number; text: string }[]; seenAt?: number } | null;   // 💬 her replies (docs/CHAT.md)
  brain?: unknown; brainOn?: BrainSettings;   // brain stretches: S.brain from the save, and the class setting
  mathThink?: Record<string, { best?: number; tries?: number; passed?: boolean; lastScore?: number; questionCount?: number; lastMissed?: string[] }>;   // 🧠 Think it through sets, from the save   // active seconds per day and subject, from the student's save
}
/* a short answer or paragraph from the student's save (docs: QUESTION-TYPES.md) */
interface WrittenEntry { id: string; courseId: string; skillId: string; type: string; prompt: string; rubric: string[]; model: string; text: string; at: number; where: string; parentReview?: { points: number[]; comment: string; redo: boolean } }
interface ReadingChapter { id?: string; label?: string; characters?: string; notableAction?: string; interaction?: string; conflict?: string; joy?: string; setting?: string; themes?: string; detail?: string; vocabulary?: string; submittedAt?: number; localReview?: string }
interface ReadingQuiz { id: string; at?: number; chapterLabels?: string[]; score?: number; total?: number; missed?: string[]; essays?: { prompt: string; answer: string }[]; submittedAt?: number; localReview?: string }
/* practice time from class_report(): minutes today and in the last 7 days, daily minutes for 4 weeks,
   and the 10 most recent sessions as [start ms, last seen ms, active seconds, device] */
interface PracticeSummary { last: number | null; today: number; week: number; days: [string, number][]; recent: [number, number, number, string | null][] }

const $ = (s: string) => document.querySelector(s) as HTMLElement;
export const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
let reportShop: string | null = null;   // null: the first shop of the class's home grade
let reportHome = DEFAULT_HOME, reportClass = '', reportKhan = true, reportThinkRequired = true;
/* the dashboard opens on the class's home grade; picking another class starts over there */
export function setReportClass(classId: string, home: unknown, khan: unknown = true, requireThink: unknown = true) {
  reportThinkRequired = requireThink !== false;
  if (classId !== reportClass) { reportClass = classId; reportShop = null; }
  reportKhan = khan !== false;   // Class settings → Use Khan Academy (docs: KHAN.md)
  reportHome = validHood(home) ? home as string : DEFAULT_HOME;
}
const shopsIn = (hood: string) => Object.values(SHOPS).filter(s => BUILDINGS.some(b => b.id === s.id && b.hood === hood));

function sStats(r: StudentReport) {
  const cc = r.cc || [0, 0, 0, 0];
  const ip = cc[0] ? Math.round(100 * cc[1] / cc[0]) : null, ap = cc[2] ? Math.round(100 * cc[3] / cc[2]) : null;
  const mis = Object.entries(r.m || {}).sort((a, b) => b[1][0] - a[1][0]);
  return { ip, ap, top: mis[0] ? mis[0][0] : null, mis };
}
export function ago(t: number) {
  if (!t) return 'never';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60); if (h < 24) return h + ' hr ago';
  return Math.round(h / 24) + ' days ago';
}
const pctTxt = (v: number | null) => v == null ? '–' : v + '%';
const WEEK_MS = 7 * 86400000;
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/* "today 3:42 PM", "yesterday 8:05 AM", "4 days ago", or "never" */
export function signedInTxt(t?: number | null) {
  if (!t) return 'never';
  const d = new Date(t), days = Math.round((dayStart(new Date()) - dayStart(d)) / 86400000);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return days <= 0 ? `today ${time}` : days === 1 ? `yesterday ${time}` : `${days} days ago`;
}
const noRecentSignIn = (r: StudentReport) => !r.ss?.last || Date.now() - r.ss.last > WEEK_MS;
const minTxt = (m?: number) => m == null ? '–' : `${m} min`;
const drillHistory = (r: StudentReport): DrillHistory => r.dl && Object.keys(r.dl).length ? r.dl : r.dr && Object.keys(r.dr).length ? r.dr : Object.fromEntries(Object.entries(r.p || {}).map(([key, value]) => ['times:' + key, value]));
function assessmentCell(r: StudentReport, shop: string, station: number | null, kind: 'quiz' | 'test') {
  const key = station == null ? `${shop}:test` : `${shop}:${station}`;
  if (r.qx?.[key] === 'excused') return '✅ excused';
  const attempts = (r.qz || []).filter(a => a.shop === shop && a.station === station && a.kind === kind);
  if (!attempts.length) return '—';
  const bestOf = (rows: AssessmentHistory[]) => rows.reduce((best, row) => row.score * best.total > best.score * row.total ? row : best);
  const passed = attempts.filter(a => a.passed);
  const best = bestOf(passed.length ? passed : attempts);
  if (passed.length) return `✅ ${best.score}/${best.total}`;
  const latest = attempts.reduce((a, b) => a.t >= b.t ? a : b);
  const inReview = r.qx?.[key] !== 'cleared' && !!latest.missed?.length;
  return `${inReview ? '🔁 ' : ''}${best.score}/${best.total}`;
}

/* A check saved on a student's page (written answers, projects, reading, quiz marks) changes that student's overrides.
   They are copied back into the report (r.qx), and closing the page redraws the dashboard, so "Waiting for a grown-up"
   and the student's page show the new check right away instead of after the next reload. */
let redrawReport: (() => void) | null = null, reportChanged = false;
export function renderClassReport(el: HTMLElement, list: StudentReport[], onSaveStudentDrills?: SaveStudentDrills, onResetStudent?: ResetStudent, onSaveQuizOverride?: SaveQuizOverride) {
  redrawReport = () => renderClassReport(el, list, onSaveStudentDrills, onResetStudent, onSaveQuizOverride);
  if (!list.length) { el.innerHTML = '<div class="card empty">No students yet. Add your roster on the Roster tab.</div>'; return; }
  const shop = (reportShop && SHOPS[reportShop]) || shopsIn(reportHome)[0] || SHOPS.cafe;
  const shopStations = shop.stations.map(st => ({
    station: st,
    skills: ORDER.filter(k => shopOfSkill(k) === shop.id && SKILLS[k].st === st.id)
  })).filter(g => g.skills.length > 0);
  const shopSkills = shopStations.flatMap(group => group.skills);
  const allStationsBuilt = shop.stations.every(st => st.skills.length > 0);
  const played = list.filter(r => r.o > 0);
  const n = list.length, orders = list.reduce((s, r) => s + (r.o || 0), 0);
  let ci = 0, cc = 0, ca = 0, cac = 0;
  list.forEach(r => { const c = r.cc || [0, 0, 0, 0]; ci += c[0]; cc += c[1]; ca += c[2]; cac += c[3]; });
  const ip = ci ? Math.round(100 * cc / ci) : null, ap = ca ? Math.round(100 * cac / ca) : null;
  const activeNow = list.filter(r => r.t && Date.now() - r.t < 10 * 60000).length;
  const readingStudents = list.filter(r => r.readingBooks?.length).length;
  const englishStudents = list.filter(r => Object.values(r.elaProgress || {}).some(progress => (progress.answered || 0) > 0 || (progress.tries || 0) > 0)).length;
  let h = `<div class="summary">
    <div class="kpi"><b>${n}</b>students (${played.length} have played)</div>
    <div class="kpi"><b>${activeNow}</b>active in the last 10 minutes</div>
    <div class="kpi"><b>${orders}</b>problems solved</div>
    <div class="kpi"><b>${pctTxt(ip)}</b>idea steps right, first try</div>
    <div class="kpi"><b>${pctTxt(ap)}</b>arithmetic steps right, first try</div>
    <div class="kpi"><b>${readingStudents}</b>students with Reading Logs · ${englishStudents} practiced English</div></div>`;
  h += questionsWaitingHTML(list);
  h += waitingHTML(list);

  const groups: Record<string, { r: StudentReport; n: number; ex?: string }[]> = {};
  list.forEach(r => Object.entries(r.m || {}).forEach(([id, v]) => { if (!MIS[id]) return; (groups[id] = groups[id] || []).push({ r, n: v[0], ex: v[1] && v[1][0] }); }));
  const gl = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  h += `<div class="card"><h2>Suggested small groups</h2><p class="muted" style="margin-top:0">Students grouped by the mix-up the game spotted, in unit order. Counts show how many times it happened.</p>`;
  const unitOf = (id: string) => [...new Set(MIS[id].skills.filter(k => SKILLS[k]).map(k => shopOfSkill(k)))].map(sh => SHOPS[sh] ? `${SHOPS[sh].emoji} ${esc(SHOPS[sh].name)}` : '').filter(Boolean).join(' · ') || 'All units';
  const shopRank = (id: string) => { const k = MIS[id].skills.find(x => SKILLS[x]); return k ? Object.keys(SHOPS).indexOf(shopOfSkill(k)) : -1; };
  gl.sort((a, b) => shopRank(a[0]) - shopRank(b[0]) || b[1].length - a[1].length);
  h += gl.length ? '<div class="groups">' + gl.map(([id, arr]) => `<div class="group"><div class="muted">${unitOf(id)}</div><h3>${esc(MIS[id].name)}</h3>
      <div class="who">${arr.sort((a, b) => b.n - a.n).map(x => `<span class="chip">${esc(x.r.n)} (${x.n})</span>`).join('')}</div>
      <div class="muted">${esc(MIS[id].tip)}</div>
      ${arr[0].ex ? `<div class="muted" style="margin-top:6px"><i>Example: ${esc(arr[0].ex)}</i></div>` : ''}
      ${MIS[id].skills.length && reportKhan ? `<div style="margin-top:6px">Khan practice: ${MIS[id].skills.map(s => `<a href="${SKILLS[s].url}" target="_blank" rel="noopener">${SHOPS[shopOfSkill(s)].emoji} ${esc(SKILLS[s].name)}</a>`).join(', ')}</div>` : ''}</div>`).join('') + '</div>'
    : '<p class="muted">No mix-ups spotted yet.</p>';
  const inReview = list.flatMap(r => {
    const latest = new Map<string, AssessmentHistory>();
    (r.qz || []).forEach(a => {
      const key = `${a.shop}:${a.station == null ? 'test' : a.station}`;
      if (!latest.has(key) || latest.get(key)!.t <= a.t) latest.set(key, a);
    });
    return [...latest.entries()].flatMap(([key, a]) => {
      if (a.passed || r.qx?.[key] === 'cleared' || r.qx?.[key] === 'excused' || !a.missed?.length) return [];
      return [{student: r.n, assessment: a}];
    });
  });
  const reviewGroups = inReview.length ? '<div class="groups">' + inReview.map(({student, assessment}) => {
    const shopEmoji = SHOPS[assessment.shop]?.emoji || '';
    const name = assessment.kind === 'test' ? 'Unit Test' : `Station ${assessment.station} Quiz`;
    const missed = assessment.missed.map(skill => `${SHOPS[shopOfSkill(skill)]?.emoji || shopEmoji} ${esc(SKILLS[skill]?.name || skill)}`).join(', ');
    return `<div class="group"><h3>${esc(student)} · ${shopEmoji} ${name}</h3><div class="who">${missed}</div></div>`;
  }).join('') + '</div>' : '<p class="muted">No students are in review after a quiz.</p>';
  h += `</div><div class="card"><h2>In review after a quiz</h2>${reviewGroups}</div>`;
  const byWeek = [...list].sort((a, b) => (a.ss?.week || 0) - (b.ss?.week || 0) || a.n.localeCompare(b.n));
  h += `<div class="card"><h2>Practice time this week</h2><p class="muted" style="margin-top:0">Active minutes in the last 7 days, least first. Only time with the game on screen and a tap or key press in the last minute counts.</p>${list.length ? '<table class="steptable"><tr><th>Student</th><th>Last 7 days</th><th>Today</th><th>Last signed in</th></tr>' + byWeek.map(r => `<tr class="${noRecentSignIn(r) ? 'stale' : ''}"><td>${esc(r.n)}</td><td>${minTxt(r.ss?.week ?? 0)}</td><td>${minTxt(r.ss?.today ?? 0)}</td><td>${signedInTxt(r.ss?.last)}${noRecentSignIn(r) ? ' <span class="tag stale-tag">no sign-in in 7 days</span>' : ''}</td></tr>`).join('') + '</table>' : '<p class="muted">No students yet.</p>'}</div>`;
  const notHelping = list.flatMap(r => Object.entries(r.dl || {}).filter(([, v]) => v.reteach).map(([id, v]) => ({name:r.n, id, v})));
  h += `<div class="card"><h2>Pop-ups that aren't helping</h2>${notHelping.length ? '<table class="steptable"><tr><th>Student</th><th>Drill</th><th>Pop-ups</th><th>Misses after</th></tr>' + notHelping.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(drillLabel(x.id))}</td><td>${x.v.popups || 0}</td><td>${x.v.missesAfter || 0}</td></tr>`).join('') + '</table>' : '<p class="muted">No drills need reteaching right now.</p>'}</div>`;

  h += `<div class="card"><h2>Skill grid</h2><div class="noprint shop-tabs" role="tablist" aria-label="Shop">${builtHoods().filter(n => shopsIn(n.id).length).map(n => `<div class="row shop-grade"><span class="grade-lbl">${n.emoji} ${esc(n.name)}</span>${shopsIn(n.id).map(s => `<button class="btn small${s.id === shop.id ? ' mint' : ''}" type="button" role="tab" aria-selected="${s.id === shop.id}" data-report-shop="${s.id}">${s.emoji} ${s.id === 'cafe' ? 'Café' : esc(s.name)}</button>`).join('')}</div>`).join('')}</div>`;
  if (!shopSkills.length) h += `<p class="muted">No ${esc(shop.name)} skills are built yet.</p>`;
  if (shopStations.length) {
    h += `<div class="tablewrap"><table class="cls"><thead><tr><th></th>`;
    shopStations.forEach(({station, skills}) => { h += `<th class="stn" colspan="${skills.length + 1}">${station.id}. ${esc(station.name)}</th>`; });
    if (allStationsBuilt) h += `<th class="stn" rowspan="2">Unit Test</th>`;
    h += `<th colspan="8"></th></tr><tr><th>Student</th>`;
    shopStations.forEach(({skills}) => { h += skills.map(k => `<th class="sk" title="${esc(SKILLS[k].name)}">${esc(SKILLS[k].short)}</th>`).join('') + '<th class="sk" title="Station quiz">Quiz</th>'; });
    h += `<th>Ideas</th><th>Arithmetic</th><th>Top mix-up</th><th>Problems</th><th>Last active</th><th>Last signed in</th><th>Today</th><th>This week</th></tr></thead><tbody>`;
    list.forEach(r => {
      const st = sStats(r);
      h += `<tr><td><button class="namebtn" data-id="${esc(r.id)}">${esc(r.n)}</button></td>`;
      shopStations.forEach(({station, skills}) => {
        skills.forEach(k => { const e = (r.k || {})[k]; const s = statusFromRecent(e ? e[1] : ''); h += `<td class="cell s-${s}" title="${esc(SKILLS[k].name)}: ${s}${e ? `, ${e[0]} tried` : ''}">${e ? e[0] : ''}</td>`; });
        h += `<td>${assessmentCell(r, shop.id, station.id, 'quiz')}</td>`;
      });
      h += allStationsBuilt ? `<td>${assessmentCell(r, shop.id, null, 'test')}</td>` : '';
      h += `<td>${pctTxt(st.ip)}</td><td>${pctTxt(st.ap)}</td><td>${st.top ? esc(MIS[st.top] ? MIS[st.top].name : st.top) : '–'}</td><td>${r.o || 0}</td><td>${r.o ? ago(r.t) : 'not yet'}</td><td class="${noRecentSignIn(r) ? 'stale' : ''}">${signedInTxt(r.ss?.last)}</td><td>${minTxt(r.ss?.today)}</td><td>${minTxt(r.ss?.week)}</td></tr>`;
    });
    h += `</tbody></table></div>`;
  }
  h += `<div class="legend"><span><i class="s-mastered"></i>Mastered (4+ tries, 75% of last 8 perfect)</span><span><i class="s-practicing"></i>Practicing</span><span><i class="s-struggling"></i>Struggling</span><span><i class="s-new"></i>Not started</span><span>Numbers are problems tried.</span></div>
    <div class="row noprint"><button class="btn small" id="csv">Download CSV</button><button class="btn small" id="printDash">Print</button></div></div>`;

  const needs = ORDER.map(k => ({ k, who: list.filter(r => statusFromRecent(((r.k || {})[k] || [])[1] || '') === 'struggling') })).filter(x => x.who.length).sort((a, b) => b.who.length - a.who.length);
  h += `<div class="two"><div class="card"><h2>Skills to reteach or assign</h2>${needs.length ? needs.map(x => `<p style="margin:0 0 10px"><b>${SHOPS[shopOfSkill(x.k)].emoji} ${esc(SKILLS[x.k].name)}</b>: ${x.who.map(r => esc(r.n)).join(', ')}${reportKhan ? `<br><a href="${SKILLS[x.k].url}" target="_blank" rel="noopener">Assign on Khan Academy</a>` : ''}</p>`).join('') : '<p class="muted">Nobody is struggling on a skill right now.</p>'}</div>`;

  const facts: Record<string, { miss: number; who: Set<string> }> = {}, tables: Record<string, number> = {};
  list.forEach(r => {
    (r.f || []).forEach(([key, a, c, s]) => { facts[key] = facts[key] || { miss: 0, who: new Set() }; facts[key].miss += a - c + s; facts[key].who.add(r.n); });
    Object.entries(drillHistory(r)).forEach(([id, v]) => { tables[id] = (tables[id] || 0) + (v.miss || 0) + (v.slow || 0) + (v.sprint || 0); });
  });
  const tf = Object.entries(facts).filter(([, v]) => v.miss > 0).sort((a, b) => b[1].miss - a[1].miss).slice(0, 10);
  const tt = Object.entries(tables).sort((a, b) => b[1] - a[1]).slice(0, 6);
  h += `<div class="card"><h2>Most-triggered practice pop-ups</h2>
    ${tt.length ? `<p style="margin-top:0">${tt.map(([id, c]) => `<span class="chip">${esc(drillLabel(id))} (${c})</span>`).join('')}</p>` : ''}
    ${tf.length ? '<table class="steptable"><tr><th>Fact</th><th>Misses or slow</th><th>Students</th></tr>' + tf.map(([k, v]) => { const [x, y] = k.split('x').map(Number); return `<tr><td>${x} × ${y} = ${x * y}</td><td>${v.miss}</td><td>${[...v.who].map(esc).join(', ')}</td></tr>`; }).join('') + '</table>' : '<p class="muted">No times-table trouble yet.</p>'}</div></div>`;
  el.innerHTML = h;
  el.querySelectorAll<HTMLButtonElement>('[data-report-shop]').forEach(b => b.addEventListener('click', () => {
    reportShop = b.dataset.reportShop || null;
    renderClassReport(el, list, onSaveStudentDrills, onResetStudent, onSaveQuizOverride);
  }));
  el.querySelectorAll<HTMLButtonElement>('.namebtn').forEach(b => b.addEventListener('click', () => { if (b.dataset.subject) detailSubject = b.dataset.subject; openDetail(list.find(r => r.id === b.dataset.id)!, onSaveStudentDrills, onResetStudent, onSaveQuizOverride); }));
  el.querySelector('#csv')?.addEventListener('click', () => downloadCSV(list));
  el.querySelector('#printDash')?.addEventListener('click', () => window.print());
}

export function openDetail(r: StudentReport, onSaveStudentDrills?: SaveStudentDrills, onResetStudent?: ResetStudent, onSaveQuizOverride?: SaveQuizOverride) {
  if (!r) return;
  let overrides: Record<string, string> = { ...(r.qx || {}) };
  const st = sStats(r);
  let setupA = 0, setupC = 0;
  Object.values(r.s || {}).forEach(steps => Object.values(steps).forEach(v => { if (v[3] === 's') { setupA += v[0]; setupC += v[1]; } }));
  let h = `<div class="row noprint" style="justify-content:space-between; margin-top:0"><h2 id="dTitle" style="margin:0">${esc(r.n)}</h2>
    <span><button class="btn small" id="dPrint">Print</button> <button class="btn small" id="dReset">Reset</button> <button class="btn small" id="dClose">Close</button></span></div><div id="studentResetPanel" class="reset-panel" hidden></div>
    <p class="muted">Last active ${r.o ? ago(r.t) : 'not yet'}. ${r.o || 0} problems, ${r.pf || 0} perfect. About ${r.tm || 0} minutes played. Best sprint: ${r.sp || 0}.</p>
    <div class="summary"><div class="kpi"><b>${pctTxt(st.ip)}</b>idea steps right, first try</div><div class="kpi"><b>${pctTxt(st.ap)}</b>arithmetic steps right, first try</div><div class="kpi"><b>Counting and reading the picture: ${setupC} of ${setupA}</b> right on first try.</div></div>`;
  h += '<div id="helpQCard" class="noprint"></div>';   // ✋ questions (docs/QUESTIONS.md)
  h += '<div id="liveNowCard" class="noprint"></div>';   // 🔴 Right now (docs/LIVE.md)
  h += practiceHTML(r);
  /* progress by subject and unit: one tab per subject, one fold-out per unit (the units in progress start open) */
  const subjectTabs: [string, string][] = [['math', '➗ Math'], ['English', '📚 English'], ['History', '🏛️ History'], ['Biology', '🦁 Biology'], ['bible', '✝️ Bible'], ['projects', '📁 Projects'], ['written', '✍️ Written'], ['reading', '📖 Reading Log'], ['brain', '🧠 Brain'], ['ledger', '📅 Ledger'], ['courses', '🎓 Grades'], ['transcript', '📜 Transcript']];
  if (!subjectTabs.some(([id]) => id === detailSubject)) detailSubject = 'math';
  const panel = (id: string, inner: string) => `<div data-subject-panel="${id}"${id === detailSubject ? '' : ' hidden'}>${inner}</div>`;
  h += `<h2>Progress by subject and unit</h2><div class="noprint subject-tabs" role="group" aria-label="Subject">${subjectTabs.map(([id, label]) => `<button type="button" class="btn small subject-tab" data-subject-tab="${id}" aria-pressed="${id === detailSubject}">${label}</button>`).join('')}</div>`;
  h += panel('math', mathUnitsHTML(r) + `<h3>🧠 Think it through</h3>${thinkReportHTML(r.mathThink, reportThinkRequired)}`) + ['English', 'History', 'Biology'].map(id => panel(id, englishReadingHTML(r, id))).join('');
  h += panel('bible', '<div id="bibleCard"></div>') + panel('projects', '<div id="projectCard"></div>') + panel('written', '<div id="writtenCard"></div>') + panel('reading', '<div id="readingCard"></div>') + panel('brain', `<h3>🧠 Brain stretches</h3>${brainReportHTML(r.brain, r.brainOn)}`) + panel('ledger', '<div id="ledgerCard"></div>') + panel('courses', '<div id="coursesCard"></div>') + panel('transcript', '<div id="transcriptCard"></div>');
  /* the Ledger (docs/LEDGER.md step 4) reads the database, so it loads the first time its tab opens;
     Grades (step 6) adds up again each time its tab opens, so Ledger changes show */
  let ledgerShown = false;
  const showLedger = () => {
    const courses = $('#coursesCard');
    if (detailSubject === 'courses' && courses) renderCourses(courses, r, () => overrides.courses, value => saveOverride('courses', value));
    const transcript = $('#transcriptCard');   // the transcript (step 7) also adds up again each time its tab opens
    if (detailSubject === 'transcript' && transcript) renderTranscript(transcript, r, () => overrides.courses, () => overrides.transcript, value => saveOverride('transcript', value));
    const bible = $('#bibleCard');   // ✝️ Bible (docs/BIBLE.md): her settings, memory verses and journal
    if (detailSubject === 'bible' && bible) renderBibleCard(bible, r.n, r.bible, () => overrides.bible, value => saveOverride('bible', value));
    const el = $('#ledgerCard'); if (ledgerShown || detailSubject !== 'ledger' || !el) return; ledgerShown = true; renderLedger(el, r);
  };
  const loose = st.mis.filter(([id]) => !misShops(r, id).length);
  h += '<div class="two" style="margin-top:14px"><div><h2>Mix-ups across units</h2><p class="muted" style="margin-top:0">Mix-ups tied to a unit are listed inside that unit on the Math tab.</p>';
  h += loose.length ? misListHTML(loose) : '<p class="muted">None spotted.</p>';
  const f = (r.f || []).map(([k, a, c, s]) => { const [x, y] = k.split('x'); return `<span class="chip">${x}×${y}: ${c}/${a}${s ? `, ${s} slow` : ''}</span>`; }).join('');
  const df = (r.df || []).map(([k, a, c, s]) => { const [x, y] = k.split('x').map(Number); return `<span class="chip">${x * y}÷${x}: ${c}/${a}${s ? `, ${s} slow` : ''}</span>`; }).join('');
  const pl = Object.entries(drillHistory(r)).map(([id, v]) => `<span class="chip">${esc(drillLabel(id))}: ${(v.miss || 0) + (v.slow || 0) + (v.sprint || 0)}</span>`).join('');
  const mode = r.ds == null ? 'class' : r.ds.enabled === false ? 'off' : r.ds.timeScale === 2 ? '2' : r.ds.timeScale === 1.5 ? '1.5' : 'advanced';
  let currentOverride: Partial<DrillSettings> | null = r.ds ? {...r.ds} : null;
  const historyRows = Object.entries(drillHistory(r)).map(([id, v]) => {
    const status = v.reteach ? 'reteach' : (v.popups && (v.missesAfter || 0) < v.popups ? 'helping' : 'watching');
    return `<tr><td>${esc(drillLabel(id))}</td><td>${v.popups || 0}</td><td>${v.missesAfter || 0}</td><td>${status === 'reteach' ? '<b>reteach</b>' : status}</td>${status === 'reteach' ? `<td><button class="btn small" data-clear-drill="${esc(id)}">Clear</button></td>` : '<td></td>'}</tr>`;
  }).join('');
  h += `</div><div><h2>Times tables</h2><p><b>Multiplying</b><br>${f || '<span class="muted">No trouble</span>'}</p><p><b>Finding the multiplier (dividing)</b><br>${df || '<span class="muted">No trouble</span>'}</p><p><b>Practice pop-ups</b><br>${pl || '<span class="muted">None</span>'}</p></div></div>`;
  h += `<div class="card"><h2>Practice pop-ups for ${esc(r.n)}</h2><label for="studentDrillMode">Mode</label><select id="studentDrillMode"><option value="class" ${mode === 'class' ? 'selected' : ''}>Use class settings</option><option value="1.5" ${mode === '1.5' ? 'selected' : ''}>Extra time ×1.5</option><option value="2" ${mode === '2' ? 'selected' : ''}>Extra time ×2</option><option value="off" ${mode === 'off' ? 'selected' : ''}>Pop-ups off</option><option value="advanced" ${mode === 'advanced' ? 'selected' : ''}>Custom override</option></select><details open><summary>Advanced</summary><p class="muted">Individual drill settings are stored with this student's override.</p><label for="studentReadSeconds">Reading time before the tip timer starts</label><input id="studentReadSeconds" type="number" min="0" max="20" step="1" value="${r.ds?.readSeconds ?? ''}"></details><table class="steptable"><tr><th>Drill</th><th>Pop-ups</th><th>Misses after</th><th>Status</th><th></th></tr>${historyRows || '<tr><td colspan="5" class="muted">No drill history yet.</td></tr>'}</table><p class="status" id="studentDrillMsg"></p></div>`;
  h += `<div class="card"><h2>Quizzes and tests for ${esc(r.n)}</h2><div id="quizCard"></div></div>`;
  h += `<div class="card"><h2>📋 Extras for ${esc(r.n)}</h2><div id="extrasCard"></div></div>`;
  h += `<div class="card"><h2>🗓️ Daily plan for ${esc(r.n)}</h2><div id="goalsCard"></div><div id="planCard"></div></div>`;
  const quizTargets = Object.values(SHOPS).flatMap(shop => [
    ...shop.stations.filter(st => st.skills.length).map(st => ({ key: `${shop.id}:${st.id}`, label: `${shop.emoji} ${st.name} quiz` })),
    ...(shop.stations.every(st => st.skills.length) ? [{ key: `${shop.id}:test`, label: `${shop.emoji} ${shop.name} unit test` }] : [])
  ]);
  /* plain "cleared" (legacy) always counts; "cleared:<epoch>" only counts if newer than the latest attempt */
  function clearedAfter(override: string | undefined, latestT: number | undefined) {
    if (override === 'cleared') return true;
    const m = typeof override === 'string' && /^cleared:(\d+)$/.exec(override);
    return !!m && +m[1] > (latestT || 0);
  }
  function quizControlRow(key: string, label: string) {
    const [shopId, stationPart] = key.split(':');
    const station = stationPart === 'test' ? null : +stationPart;
    const attempts = (r.qz || []).filter(a => a.shop === shopId && a.station === station && a.kind === (stationPart === 'test' ? 'test' : 'quiz'));
    const latest = attempts.length ? attempts.reduce((a, b) => a.t >= b.t ? a : b) : null;
    const inReview = !!latest && !latest.passed && !!latest.missed?.length;
    const override = overrides[key];
    const cleared = clearedAfter(override, latest?.t);
    const statusTxt = override === 'excused' ? 'Excused' : cleared ? 'Review cleared' : inReview ? 'In review' : latest?.passed ? 'Passed' : '—';
    const buttons = [
      override !== 'excused' ? `<button class="btn small" data-quiz-excuse="${esc(key)}">Excuse quiz</button>` : '',
      inReview && !cleared ? `<button class="btn small" data-quiz-clear="${esc(key)}">Clear review</button>` : '',
      override ? `<button class="btn small" data-quiz-undo="${esc(key)}">Undo</button>` : ''
    ].filter(Boolean).join(' ');
    return `<tr><td>${esc(label)}</td><td>${statusTxt}</td><td>${buttons}</td></tr>`;
  }
  function quizCardHtml() {
    const historyRows = [...(r.qz || [])].sort((a, b) => b.t - a.t).map(a => {
      const shop = SHOPS[a.shop];
      const label = a.kind === 'test' ? 'Unit Test' : `Station ${a.station}`;
      const missed = (a.missed || []).map(sk => esc(SKILLS[sk]?.name || sk)).join(', ');
      return `<tr><td>${new Date(a.t).toLocaleDateString()}</td><td>${shop?.emoji || ''} ${esc(shop?.name || a.shop)}</td><td>${label}</td><td>${a.passed ? '✅' : '✗'} ${a.score}/${a.total}</td><td>${missed || '<span class="muted">none</span>'}</td></tr>`;
    }).join('');
    const controlRows = Object.values(SHOPS).map(shop => {
      const rows = quizTargets.filter(t => t.key.split(':')[0] === shop.id).map(t => quizControlRow(t.key, t.label));
      if (!rows.length) return '';
      const active = rows.some(row => !row.includes('<td>—</td>'));
      return `<details class="unit-card"${active ? ' open' : ''}><summary><b>${shop.emoji} ${esc(shop.name)}</b><span class="unit-sum">${active ? 'has activity' : 'nothing yet'}</span></summary><table class="steptable"><tr><th>Quiz</th><th>Status</th><th></th></tr>${rows.join('')}</table></details>`;
    }).join('');
    /* every unit, every subject: open all its quizzes and tests now, or count its unit test as passed (opens the next unit) */
    const UNIT_BUILDINGS = [...Object.values(SHOPS).map(shop => shop.id), 'elaNouns', 'elaVerbs', 'elaPron', 'elaDescr', 'elaConj', 'elaPunct', 'histOrigins', 'histEarly', 'histAgrarian', 'histEmpires', 'histWebs', 'bioChem', 'bioCells'];
    const unitRows = UNIT_BUILDINGS.flatMap(id => BUILDINGS.filter(b => b.id === id)).map(b => {
      const open = overrides[`${b.id}:open`] === 'all', passed = overrides[`${b.id}:test`] === 'excused';
      return `<tr><td>${b.emoji} ${esc(b.name)} <span class="muted">${esc(b.unit)}</span></td><td>${[open ? 'All quizzes and tests open' : '', passed ? 'Unit test counted as passed' : ''].filter(Boolean).join(' · ') || '<span class="muted">Following the app</span>'}</td>
        <td style="white-space:nowrap">${open ? `<button class="btn small" data-quiz-undo="${b.id}:open">Close again</button>` : `<button class="btn small" data-unit-open="${b.id}">Open all tests</button>`} ${passed ? `<button class="btn small" data-quiz-undo="${b.id}:test">Undo pass</button>` : `<button class="btn small" data-quiz-excuse="${b.id}:test">Count unit test as passed</button>`}</td></tr>`;
    }).join('');
    return `<h3>History</h3><table class="steptable"><tr><th>Date</th><th>Shop</th><th>Station</th><th>Score</th><th>Missed skills</th></tr>${historyRows || '<tr><td colspan="5" class="muted">No quizzes or tests yet.</td></tr>'}</table>
      <h3>Overrides</h3>${controlRows}
      <h3>Override the app for a whole unit</h3><p class="muted" style="margin-top:0"><b>Open all tests</b> lets ${esc(r.n)} take every quiz and the unit test in that unit now, even if practice isn't finished. <b>Count unit test as passed</b> opens the next unit without the test. Both work for math, English, History and Biology.</p>
      <table class="steptable"><tr><th>Unit</th><th>Status</th><th></th></tr>${unitRows}</table><p class="status" id="studentQuizMsg"></p>`;
  }
  async function saveOverride(key: string, value: string | null) {
    if (!onSaveQuizOverride) return;
    const next = { ...overrides };
    if (value) next[key] = value; else delete next[key];
    try { await onSaveQuizOverride(r.id, Object.keys(next).length ? next : null); overrides = next; r.qx = Object.keys(next).length ? { ...next } : null; reportChanged = true; renderQuizCard(); }
    catch (err) { const msg = $('#studentQuizMsg'); if (msg) msg.textContent = String(err); }
  }
  /* extras for this student (ROADMAP F7): saved in quiz_overrides as "extras", a JSON list the game reads */
  function extrasList(): Extra[] { try { const l = JSON.parse(overrides.extras || '[]'); return Array.isArray(l) ? l as Extra[] : []; } catch { return []; } }
  function renderExtrasCard() {
    const el = $('#extrasCard'); if (!el) return;
    const list = extrasList(), drillIds = Object.keys(DRILL_NAMES).filter(id => !id.startsWith('story'));
    const label = (x: Extra) => x.kind === 'vocab' ? `🔤 Word Workshop: ${VOCAB_MODES[x.mode || 'practice'] || 'Practice cards'}`
      : `⚡ Fact Sprint: ${(x.skills || ['times']).map(t => DRILL_NAMES[t]?.name || t).join(' + ')}${x.tables?.length ? ` (${x.tables.join(', ')}s)` : ''}`;
    el.innerHTML = `<p class="muted" style="margin-top:0">Extras show on ${esc(r.n)}’s town page every day as a checklist. Fact Sprint minutes count when the sprint is started from that list; Word Workshop minutes count for that exercise. Remove an extra when it’s no longer needed.<br><b>⏱️ Timed challenge:</b> the warm-up is one hard-timed round (“how many can you get in 5 minutes?”) that stops when the clock runs out. Any minutes beyond the challenge show as a separate row later in the day, after her plan.</p>
  ${list.length ? `<table class="steptable"><tr><th>Extra</th><th>Minutes a day</th><th></th></tr>${list.map(x => `<tr><td>${esc(label(x))}${x.challenge ? `<br><small>⏱️ ${Math.min(x.challenge, x.minutes)}-minute challenge first${x.minutes > x.challenge ? `, then ${x.minutes - x.challenge} min later in the day` : ''}</small>` : ''}</td><td>${esc(x.minutes)}</td><td style="white-space:nowrap">${x.challenge ? `<button class="btn small" data-extra-challenge="${esc(x.id)}" data-min="0">Turn off the challenge</button>` : `<button class="btn small" data-extra-challenge="${esc(x.id)}" data-min="5">⏱️ Make it a 5-min challenge</button>`} <button class="btn small" data-extra-remove="${esc(x.id)}">Remove</button></td></tr>`).join('')}</table>` : '<p class="muted">No extras yet.</p>'}
  <h3>Add an extra</h3>
  <div class="row"><label>Activity <select id="exKind"><option value="sprint">⚡ Fact Sprint</option><option value="vocab">🔤 Word Workshop</option></select></label><label>Minutes a day <input id="exMin" type="number" min="1" max="60" value="5" style="width:70px"></label><label><input type="checkbox" id="exChallenge"> ⏱️ Start with a timed challenge of <input id="exChallengeMin" type="number" min="1" max="30" value="5" style="width:60px"> min</label></div>
  <div id="exSprint"><p style="margin:6px 0 2px"><b>Skills</b></p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:4px">${drillIds.map(id => `<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-ex-skill="${esc(id)}" ${id === 'times' ? 'checked' : ''}> ${esc(DRILL_NAMES[id]?.name || id)}</label>`).join('')}</div>
  <p style="margin:8px 0 2px"><b>Times tables</b> <span class="muted">(tick the ones to practice, or leave them all unticked for a mix of every table)</span></p><div class="row">${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => `<label style="display:flex;gap:4px;align-items:center"><input type="checkbox" data-ex-table="${n}"> ${n}s</label>`).join('')}</div></div>
  <div id="exVocab" hidden><label>Exercise <select id="exMode">${Object.entries(VOCAB_MODES).map(([id, name]) => `<option value="${id}">${esc(name)}</option>`).join('')}</select></label> <span class="muted">Uses ${esc(r.n)}’s focus words.</span></div>
  <div class="row"><button class="btn small primary" id="exAdd">Add extra</button></div>`;
    const kind = el.querySelector<HTMLSelectElement>('#exKind')!;
    kind.addEventListener('change', () => { el.querySelector<HTMLElement>('#exSprint')!.hidden = kind.value !== 'sprint'; el.querySelector<HTMLElement>('#exVocab')!.hidden = kind.value !== 'vocab'; });
    el.querySelector('#exAdd')!.addEventListener('click', () => {
      const minutes = Math.max(1, Math.min(60, Math.round(+el.querySelector<HTMLInputElement>('#exMin')!.value || 0)));
      const ticked = [...el.querySelectorAll<HTMLInputElement>('[data-ex-skill]:checked')].map(b => b.dataset.exSkill!), skills = ticked.length ? ticked : ['times'];
      const tables = [...el.querySelectorAll<HTMLInputElement>('[data-ex-table]:checked')].map(b => +b.dataset.exTable!);
      const id = `x${Date.now().toString(36)}`;
      const challenge = el.querySelector<HTMLInputElement>('#exChallenge')!.checked ? Math.max(1, Math.min(30, Math.round(+el.querySelector<HTMLInputElement>('#exChallengeMin')!.value || 5))) : 0;
      const extra: Extra = kind.value === 'vocab' ? { id, kind: 'vocab', minutes: Math.max(minutes, challenge), mode: el.querySelector<HTMLSelectElement>('#exMode')!.value, ...(challenge ? { challenge } : {}) }
        : { id, kind: 'sprint', minutes: Math.max(minutes, challenge), skills, tables: skills.includes('times') ? tables : [], ...(challenge ? { challenge } : {}) };
      void saveOverride('extras', JSON.stringify([...extrasList(), extra].slice(-10)));
    });
    el.querySelectorAll<HTMLButtonElement>('[data-extra-challenge]').forEach(b => b.addEventListener('click', () => {
      const min = +b.dataset.min!;
      const next = extrasList().map(x => x.id !== b.dataset.extraChallenge ? x : min > 0 ? { ...x, challenge: min, minutes: Math.max(x.minutes, min) } : { ...x, challenge: undefined });   // undefined drops out of the JSON
      void saveOverride('extras', JSON.stringify(next));
    }));
    el.querySelectorAll<HTMLButtonElement>('[data-extra-remove]').forEach(b => b.addEventListener('click', () => {
      const next = extrasList().filter(x => x.id !== b.dataset.extraRemove);
      void saveOverride('extras', next.length ? JSON.stringify(next) : null);
    }));
  }
  /* Time goals (ROADMAP F8) were the same thing as a plan's minutes, so the daily plan replaced them. A student who
     still has old goals ("subjectGoals") keeps them on her plan; this note moves them into the plan (Monday–Friday). */
  const GOAL_TO_PLAN: Record<string, string> = { math: 'math', english: 'english', history: 'history', science: 'biology', reading: 'reading' };
  function renderGoalsCard() {
    const el = $('#goalsCard'); if (!el) return;
    const base = Object.entries(parseSubjectGoals(overrides.subjectGoals).base).filter(([, m]) => m > 0);
    if (!base.length) { el.innerHTML = ''; return; }
    const names = Object.fromEntries(GOAL_SUBJECTS);
    el.innerHTML = `<p class="review-banner" style="margin-top:0">${esc(r.n)} still has old time goals: ${base.map(([id, m]) => `${esc(names[id] || id)} ${m} min`).join(', ')}. They still show on her plan. <button class="btn small primary" id="goalsMove">Move them into the daily plan</button><br><small class="muted">They’re added to Monday–Friday (a subject already on a day keeps the larger number of minutes).${base.some(([id]) => !GOAL_TO_PLAN[id]) ? ' Word Workshop time belongs in Extras.' : ''}</small></p>`;
    el.querySelector('#goalsMove')!.addEventListener('click', async () => {
      let plan: { week?: Record<string, { id: string; kind: string; subject?: string; minutes?: number }[]>; days?: Record<string, unknown> } = {};
      try { plan = JSON.parse(overrides.plan || '{}') || {}; } catch { plan = {}; }
      const week = { ...(plan.week || {}) };
      ['mon', 'tue', 'wed', 'thu', 'fri'].forEach((d, i) => {
        const items = [...(week[d] || [])];
        base.forEach(([id, m]) => {
          const subject = GOAL_TO_PLAN[id]; if (!subject) return;
          const row = items.find(x => x.kind === 'subject' && x.subject === subject);
          if (row) row.minutes = Math.max(row.minutes || 0, m); else items.push({ id: `g${Date.now().toString(36)}${i}${subject}`, kind: 'subject', subject, minutes: m });
        });
        week[d] = items;
      });
      await saveOverride('plan', JSON.stringify({ ...plan, week }));
      await saveOverride('subjectGoals', null);
    });
  }
  /* ✋ her questions: the waiting ones with an answer box, the answered ones folded away */
  function renderHelpQCard() {
    const card = $('#helpQCard'); if (!card) return;
    card.innerHTML = helpQuestionsHTML(r, overrides);
    card.querySelectorAll<HTMLButtonElement>('[data-help-quick]').forEach(b => b.addEventListener('click', () => { const box = b.closest('[data-help-q]')?.querySelector('textarea'); if (box) { box.value = b.dataset.helpQuick || ''; box.focus(); } }));
    card.querySelectorAll<HTMLButtonElement>('[data-help-answer]').forEach(b => b.addEventListener('click', () => {
      const box = b.closest('[data-help-q]')?.querySelector('textarea'), text = box?.value.trim() || '';
      if (!text) { box?.focus(); return; }
      void saveOverride(`help:${b.dataset.helpAnswer}`, `answered:${text.slice(0, 600)}`);
    }));
  }
  function renderQuizCard() {
    renderHelpQCard();
    const el2 = $('#quizCard');
    if (!el2) return;
    el2.innerHTML = quizCardHtml();
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-excuse]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizExcuse!, 'excused'); }));
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-clear]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizClear!, `cleared:${Date.now()}`); }));
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-undo]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizUndo!, null); }));
    el2.querySelectorAll<HTMLButtonElement>('[data-unit-open]').forEach(b => b.addEventListener('click', () => { void saveOverride(`${b.dataset.unitOpen}:open`, 'all'); }));
    renderProjectCard();
    renderExtrasCard();
    renderGoalsCard();
    const plan = $('#planCard');   // the daily plan (ROADMAP F10)
    if (plan) renderPlanCard(plan, r.n, PROJECT_TITLES, () => overrides.plan, value => saveOverride('plan', value));
  }
  function renderProjectCard() {
    const card = $('#projectCard');
    if (!card) return;
    card.innerHTML = historyProjectsHTML(r, overrides);
    card.querySelectorAll<HTMLButtonElement>('[data-project-guess-send]').forEach(b => b.addEventListener('click', async () => {
      const id = b.dataset.projectGuessSend!, box = b.closest('[data-guess-row]')?.querySelector<HTMLInputElement>('[data-project-guess]'), text = box?.value.trim() || '';
      if (!text) { box?.focus(); return; }
      await saveOverride(`project-guess:${id}`, `${b.dataset.projectAt}:${text}`);
      await saveOverride(`project:${id}`, `revise:${b.dataset.projectAt}`);   // opens the project again for questions 2 and 3
    }));
    card.querySelectorAll<HTMLButtonElement>('[data-project-verdict]').forEach(b => b.addEventListener('click', () => {
      void saveOverride(`project:${b.dataset.projectCourse}`, `${b.dataset.projectVerdict}:${b.dataset.projectAt}`);
    }));
    renderWrittenCard();
    const reading = $('#readingCard');
    if (!reading) return;
    reading.innerHTML = readingReviewHTML(r, overrides);
    reading.querySelectorAll<HTMLButtonElement>('[data-reading-verdict]').forEach(b => b.addEventListener('click', () => {
      void saveOverride(b.dataset.readingKey!, `${b.dataset.readingVerdict}:${b.dataset.readingAt}`);
    }));
  }
  /* short answers and paragraphs: tick the rubric points, add a note, or ask for a redo. Saved in quiz_overrides as written:<id>. */
  function renderWrittenCard() {
    const card = $('#writtenCard');
    if (!card) return;
    card.innerHTML = writtenCardHTML(r, overrides);
    card.querySelectorAll<HTMLButtonElement>('[data-written-save]').forEach(b => b.addEventListener('click', () => {
      const entry = (r.writtenAnswers || []).find(e => e.id === b.dataset.writtenSave), box = b.closest<HTMLElement>('[data-written-entry]');
      if (!entry || !box) return;
      const points = entry.rubric.map((_, i) => (box.querySelector<HTMLInputElement>(`[data-written-point="${i}"]`)?.checked ? 1 : 0));
      const comment = box.querySelector<HTMLInputElement>('[data-written-comment]')?.value || '', redo = b.dataset.redo === '1';
      void saveOverride(`written:${entry.id}`, encodeTeacherReview(entry.at, points, redo, comment));
    }));
  }
  $('#detailSheet').innerHTML = h; $('#detail').hidden = false;
  $('#detailSheet').querySelectorAll<HTMLButtonElement>('[data-subject-tab]').forEach(b => b.addEventListener('click', () => {
    detailSubject = b.dataset.subjectTab!;
    $('#detailSheet').querySelectorAll<HTMLButtonElement>('[data-subject-tab]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $('#detailSheet').querySelectorAll<HTMLElement>('[data-subject-panel]').forEach(p => { p.hidden = p.dataset.subjectPanel !== detailSubject; });
    showLedger();
  }));
  renderQuizCard();
  showLedger();
  $('#studentDrillMode').addEventListener('change', async e => {
    if (!onSaveStudentDrills) return;
    const value = (e.target as HTMLSelectElement).value;
    const readSeconds = +($('#studentReadSeconds') as HTMLInputElement).value;
    const settings = value === 'class' ? null : value === '1.5' ? {timeScale:1.5} : value === '2' ? {timeScale:2} : value === 'off' ? {enabled:false} : {...(r.ds || {}), readSeconds};
    try { await onSaveStudentDrills(r.id, settings); currentOverride = settings; $('#studentDrillMsg').textContent = 'Saved.'; } catch (err) { $('#studentDrillMsg').textContent = String(err); }
  });
  $('#studentReadSeconds').addEventListener('change', async e => {
    if (!onSaveStudentDrills || ($('#studentDrillMode') as HTMLSelectElement).value !== 'advanced') return;
    const readSeconds = +(e.target as HTMLInputElement).value;
    const settings = {...(r.ds || {}), readSeconds};
    try { await onSaveStudentDrills(r.id, settings); currentOverride = settings; $('#studentDrillMsg').textContent = 'Saved.'; } catch (err) { $('#studentDrillMsg').textContent = String(err); }
  });
  $('#dReset').addEventListener('click', () => {
    if (!onResetStudent) return;
    const panel = $('#studentResetPanel'); panel.hidden = false;
    panel.innerHTML = `<strong>Reset ${esc(r.n)}?</strong><p>Reset town clears the town but keeps learning history. Reset everything also erases learning history.</p><div class="row"><button class="btn small primary" data-detail-reset-town>Reset town</button><button class="btn small" data-detail-reset-all>Reset everything</button><button class="btn small" data-detail-reset-cancel>Cancel</button></div><p class="status" id="studentResetMsg"></p>`;
    let armed = false, armTimer: ReturnType<typeof setTimeout> | null = null;
    const finish = async (clearHistory: boolean) => {
      panel.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = true; });
      try { await onResetStudent(r.id, clearHistory); closeDetail(); } catch (error) { $('#studentResetMsg').textContent = String(error); panel.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = false; }); }
    };
    panel.querySelector('[data-detail-reset-town]')?.addEventListener('click', () => { void finish(false); });
    panel.querySelector('[data-detail-reset-all]')?.addEventListener('click', e => {
      const button = e.currentTarget as HTMLButtonElement;
      if (!armed) { armed = true; button.textContent = `Click again to erase all of ${r.n}'s history`; armTimer = setTimeout(() => { armed = false; button.textContent = 'Reset everything'; }, 5000); return; }
      if (armTimer) clearTimeout(armTimer); void finish(true);
    });
    panel.querySelector('[data-detail-reset-cancel]')?.addEventListener('click', () => { if (armTimer) clearTimeout(armTimer); panel.hidden = true; panel.innerHTML = ''; });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-clear-drill]').forEach(b => b.addEventListener('click', async () => {
    if (!onSaveStudentDrills) return;
    try { await onSaveStudentDrills(r.id, {...(currentOverride || {}), resetAt:new Date().toISOString()}); b.disabled = true; b.textContent = 'Cleared'; } catch (err) { $('#studentDrillMsg').textContent = String(err); }
  }));
  startRightNow($('#liveNowCard'), r);
  $('#dClose').focus();
  $('#dClose').addEventListener('click', closeDetail);
  $('#dPrint').addEventListener('click', () => { document.querySelectorAll<HTMLDetailsElement>('#detailSheet details').forEach(d => { d.open = true; }); window.print(); });
}
/* one Khan skill row for the student detail: status and the step counts */
function skillStepRow(r: StudentReport, k: string) {
    const e = (r.k || {})[k], s = statusFromRecent(e ? e[1] : ''), steps = (r.s || {})[k] || {};
    const stepTxt = Object.entries(steps).map(([nm, v]) => `<span class="tag ${v[3]}">${v[3] === 's' ? 'count' : v[3] === 'i' ? 'idea' : 'arith'}</span> ${esc(nm)}: ${v[1]}/${v[0]}${v[2] ? ` (${v[2]} slow)` : ''}`).join('<br>');
    return `<tr><td>${esc(SKILLS[k].name)}</td><td><span class="tag s-${s}" style="color:#3B2724">${s}</span></td><td>${stepTxt || '<span class="muted">not yet</span>'}</td><td>${reportKhan ? `<a href="${SKILLS[k].url}" target="_blank" rel="noopener">Khan</a>` : ''}</td></tr>`;
}
/* the shops a mix-up belongs to: shops with one of its skills that the student has practiced */
function misShops(r: StudentReport, id: string) {
  return MIS[id] ? [...new Set(MIS[id].skills.filter(k => SKILLS[k] && (r.k || {})[k]).map(k => shopOfSkill(k)))] : [];
}
function misListHTML(list: [string, [number, string[]]][]) {
  return '<ul>' + list.map(([id, v]) => `<li><b>${esc(MIS[id] ? MIS[id].name : id)}</b> (${v[0]})${(v[1] || []).map(x => `<div class="muted">${esc(x)}</div>`).join('')}${MIS[id] ? `<div class="muted">Try: ${esc(MIS[id].tip)}</div>` : ''}</li>`).join('') + '</ul>';
}
let detailSubject = 'math';
/* the student's math skills, one fold-out per shop (unit), stations as sub-headings; home grade first */
function mathUnitsHTML(r: StudentReport) {
  const hoods = builtHoods().filter(n => shopsIn(n.id).length).sort((a, b) => Number(b.id === reportHome) - Number(a.id === reportHome));
  return hoods.map(n => (hoods.length > 1 ? `<h3>${n.emoji} ${esc(n.name)}</h3>` : '') + shopsIn(n.id).map(shop => {
    const groups = shop.stations.map(st => ({ st, skills: ORDER.filter(k => shopOfSkill(k) === shop.id && SKILLS[k].st === st.id) })).filter(g => g.skills.length);
    if (!groups.length) return '';
    const all = groups.flatMap(g => g.skills), tried = all.filter(k => (r.k || {})[k]).length;
    const mastered = all.filter(k => statusFromRecent(((r.k || {})[k] || [])[1] || '') === 'mastered').length;
    const test = shop.stations.every(st => st.skills.length) ? assessmentCell(r, shop.id, null, 'test') : '';
    const mis = sStats(r).mis.filter(([id]) => misShops(r, id).includes(shop.id));
    const summary = tried ? `${mastered} of ${all.length} skills mastered${mis.length ? ` · ${mis.length} mix-up${mis.length === 1 ? '' : 's'}` : ''}${test ? ` · Unit Test ${test}` : ''}` : 'Not started';
    const rows = groups.map(({ st, skills }) => `<tr class="stn-row"><th colspan="4">${st.id}. ${esc(st.name)} · quiz ${assessmentCell(r, shop.id, st.id, 'quiz')}</th></tr>` + skills.map(k => skillStepRow(r, k)).join('')).join('');
    return `<details class="card unit-card"${tried && !test.startsWith('✅') ? ' open' : ''}><summary><b>${shop.emoji} ${esc(shop.name)}</b> <span class="muted">${esc(shop.unitLabel)}</span><span class="unit-sum">${summary}</span></summary>
      <table class="steptable"><tr><th>Khan skill</th><th>Status</th><th>Steps (right first try / tried)</th><th></th></tr>${rows}</table>${mis.length ? `<h3>Mix-ups in this unit</h3>${misListHTML(mis)}` : ''}</details>`;
  }).join('')).join('');
}
const courseTitle = (id: string) => (LESSON_COURSES as { id: string; title: string; skills: { id: string; name: string }[] }[]).find(c => c.id === id);
const lessonName = (courseId: string, skillId: string) => {
  if (courseId === 'math') { const [shop, id] = skillId.split(':'), st = SHOPS[shop]?.stations.find(x => x.id === +id); return st ? `${st.name} · Think it through` : skillId; }
  return skillId === 'unit-test' ? 'Unit test' : courseTitle(courseId)?.skills.find(s => s.id === skillId)?.name || skillId;
};
const placeTitle = (courseId: string, skillId: string) => courseId === 'math' ? `${SHOPS[skillId.split(':')[0]]?.emoji || ''} ${SHOPS[skillId.split(':')[0]]?.name || 'Math'}` : courseTitle(courseId)?.title || courseId;
const writtenWaiting = (r: StudentReport) => (r.writtenAnswers || []).filter(e => !writtenReview(e, r.qx || {}));
/* ✋ questions (docs/QUESTIONS.md): asked from any assignment; the place she asked about stays closed until answered */
export interface HelpQuestion { id: string; at: number; kind?: string; text?: string; label?: string; open?: string; shot?: string; localAnswer?: string }
const helpAnswerOf = (q: HelpQuestion, overrides: Record<string, string>) => { const t = String(overrides[`help:${q.id}`] || ''); return t.startsWith('answered:') ? t.slice(9) : q.localAnswer || ''; };
const helpOpen = (r: StudentReport) => (r.help || []).filter(q => q && q.id && !helpAnswerOf(q, r.qx || {}));
const HELP_QUICK = ['I fixed it. Try again!', 'Skip that one for now and keep going.', 'Watch the lesson video again, then try once more.', 'Let’s go over it together later today.'];
function helpQuestionsHTML(r: StudentReport, overrides: Record<string, string>) {
  const all = (r.help || []).filter(q => q && q.id).sort((a, b) => b.at - a.at), waiting = all.filter(q => !helpAnswerOf(q, overrides)), answered = all.filter(q => helpAnswerOf(q, overrides));
  if (!all.length) return '';
  const when = (t: number) => new Date(t).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  const one = (q: HelpQuestion) => `<div class="help-q" data-help-q="${esc(q.id)}"><p style="margin:4px 0"><b>${q.kind === 'bug' ? '🐞 Something isn’t working' : '🤔 Doesn’t know how'}</b> · ${esc(q.label || 'Pet World')} · <span class="muted">${esc(when(q.at))}</span></p>
    <p style="margin:4px 0">“${esc(q.text || '')}”</p>${q.shot ? `<details><summary>📷 Picture of her screen</summary><img src="${esc(q.shot)}" alt="Her screen" style="max-width:100%;border-radius:8px;border:1px solid #ccc"></details>` : ''}
    <div class="row" style="flex-wrap:wrap">${HELP_QUICK.map(t => `<button type="button" class="btn small" data-help-quick="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <textarea rows="2" maxlength="600" style="width:100%" placeholder="Your answer. Sending it opens ${esc(q.label || 'that place')} again."></textarea>
    <div class="row"><button type="button" class="btn small primary" data-help-answer="${esc(q.id)}">Send answer</button></div></div>`;
  return `<div class="card help-card"><h2>✋ Questions from ${esc(r.n)}${waiting.length ? ` · ${waiting.length} waiting` : ''}</h2>${waiting.length ? `<p class="muted" style="margin-top:0">She can’t go back to the place she asked about until you answer. Your answer shows on her plan.</p>${waiting.map(one).join('<hr>')}` : '<p class="muted" style="margin-top:0">Nothing waiting.</p>'}
    ${answered.length ? `<details><summary>Answered (${answered.length})</summary>${answered.slice(0, 8).map(q => `<p style="margin:6px 0">${esc(when(q.at))} · ${esc(q.label || '')}: “${esc(q.text || '')}”<br>↳ <b>${esc(helpAnswerOf(q, overrides))}</b>${q.localAnswer && !String(overrides[`help:${q.id}`] || '') ? ' <span class="muted">(answered at home)</span>' : ''}</p>`).join('')}</details>` : ''}</div>`;
}
function questionsWaitingHTML(list: StudentReport[]) {
  const rows = list.flatMap(r => helpOpen(r).map(q => ({ r, q }))).sort((a, b) => a.q.at - b.q.at);
  if (!rows.length) return '';
  return `<div class="card help-card"><h2>✋ Questions waiting · ${rows.length}</h2><p class="muted" style="margin-top:0">Each student is stuck on these until you answer. Tap a name to answer on their page.</p>
    <table class="steptable"><thead><tr><th>Student</th><th>Where</th><th>Question</th><th>Asked</th></tr></thead><tbody>${rows.map(({ r, q }) => `<tr><td><button class="namebtn" data-id="${esc(r.id)}">${esc(r.n)}</button></td><td>${esc(q.label || '')}</td><td>${q.kind === 'bug' ? '🐞' : '🤔'} ${esc((q.text || '').slice(0, 140))}${q.shot ? ' 📷' : ''}</td><td>${esc(ago(q.at))}</td></tr>`).join('')}</tbody></table></div>`;
}
/* "Waiting for a grown-up" on the class dashboard: everything a student sent that nobody has checked yet. A parent's
   check at home (grown-up PIN) counts as checked, the same as on the student's page; the teacher can still change it. */
function projectsWaiting(r: StudentReport) {
  const overrides = r.qx || {};
  return Object.keys(PROJECT_TITLES).filter(id => {
    const p = (id.startsWith('bio') ? r.scienceProjects : r.historyProjects)?.[id], at = p?.submittedAt || 0;
    if (p?.status !== 'submitted' || !at) return false;
    const [verdict, stamp] = String(overrides[`project:${id}`] || '').split(':');
    return !(+stamp === at && (verdict === 'verified' || verdict === 'revise')) && p.localReview !== 'verified' && p.localReview !== 'revise';
  }).length;
}
function readingWaiting(r: StudentReport) {
  const overrides = r.qx || {};
  let chapters = 0, essays = 0;
  (r.readingBooks || []).forEach(book => {
    if (book.id) book.chapters.forEach(ch => { if (ch.id && readingVerdict(overrides, `reading:${book.id}:${ch.id}`, ch.submittedAt || 0, ch.localReview) === 'submitted') chapters++; });
    (book.quizzes || []).forEach(qz => { if ((qz.essays || []).length && readingVerdict(overrides, `readingEssay:${qz.id}`, qz.submittedAt || 0, qz.localReview) === 'submitted') essays++; });
  });
  return { chapters, essays };
}
function waitingHTML(list: StudentReport[]) {
  const rows = list.map(r => ({ r, projects: projectsWaiting(r), ...readingWaiting(r), written: writtenWaiting(r).length, verse: bibleVerseStatus(r.qx?.bible, r.bible).needsVerse ? 1 : 0 }))
    .map(x => ({ ...x, total: x.projects + x.chapters + x.essays + x.written + x.verse })).filter(x => x.total).sort((a, b) => b.total - a.total || a.r.n.localeCompare(b.r.n));
  const total = rows.reduce((sum, x) => sum + x.total, 0);
  const chip = (r: StudentReport, n: number, one: string, many: string, subject: string) => n ? `<button class="namebtn chip" data-id="${esc(r.id)}" data-subject="${subject}">${n} ${n === 1 ? one : many}</button>` : '';
  return `<div class="card"><h2>🧑‍🏫 Waiting for a grown-up${total ? ` · ${total}` : ''}</h2><p class="muted" style="margin-top:0">Projects and labs, Reading Log chapters, reading-quiz essays, and written answers that nobody has checked yet, and students who need a new memory verse. Tap one to open that student's page at the right tab. A parent's check at home counts as checked; you can still change it.</p>
    ${rows.length ? `<table class="steptable"><thead><tr><th>Student</th><th>To check</th></tr></thead><tbody>${rows.map(x => `<tr><td><button class="namebtn" data-id="${esc(x.r.id)}" data-subject="${x.projects ? 'projects' : x.chapters || x.essays ? 'reading' : x.written ? 'written' : 'bible'}">${esc(x.r.n)}</button></td><td>${[
      chip(x.r, x.projects, 'project or lab', 'projects or labs', 'projects'), chip(x.r, x.chapters, 'reading chapter', 'reading chapters', 'reading'),
      chip(x.r, x.essays, 'reading essay', 'reading essays', 'reading'), chip(x.r, x.written, 'written answer', 'written answers', 'written'), x.verse ? `<button class="namebtn chip" data-id="${esc(x.r.id)}" data-subject="bible">✝️ needs a new memory verse</button>` : ''].filter(Boolean).join(' ')}</td></tr>`).join('')}</tbody></table>`
      : '<p class="muted">Nothing is waiting. Everything students sent has been checked.</p>'}</div>`;
}
/* accepted work folds into a closed "✅ Accepted" section at the bottom of its tab, so the page shows only what still
   needs a look. Sent-back work stays out in the open until the student turns it in again. (ROADMAP F2) */
function archiveHTML(inner: string, n: number) {
  return n ? `<details class="archive" style="margin-top:10px"><summary class="muted">✅ Accepted · ${n} (tap to look back)</summary>${inner}</details>` : '';
}
function writtenCardHTML(r: StudentReport, overrides: Record<string, string>) {
  const entries = [...(r.writtenAnswers || [])].sort((a, b) => Number(!!writtenReview(a, overrides)) - Number(!!writtenReview(b, overrides)) || b.at - a.at);
  const card = (e: WrittenEntry) => {
    const review = writtenReview(e, overrides), mine = review?.by === 'teacher', parent = e.parentReview && !mine ? writtenReview({ ...e }, {}) : null;
    const status = !review ? '<span class="tag a">Waiting</span>' : `<span class="tag i">${review.redo ? 'Redo asked for' : 'Read'} · ${reviewScore(review)}/${e.rubric.length}${review.by === 'parent' ? ' (parent)' : ''}</span>`;
    return `<div class="reading-report-chapter" data-written-entry="${esc(e.id)}"><b>${esc(placeTitle(e.courseId, e.skillId))} · ${esc(lessonName(e.courseId, e.skillId))}</b> · <span class="muted">${esc((TYPE_LABELS as Record<string, string>)[e.type] || e.type)}${e.where === 'test' ? ' on the unit test' : ' in practice'} · ${esc(new Date(e.at).toLocaleDateString())}</span> ${status}
      <p>${esc(e.prompt)}</p><blockquote style="white-space:pre-wrap; margin:6px 0; padding:6px 10px; border-left:4px solid #E4577A">${esc(e.text)}</blockquote>
      <details><summary class="muted">Model answer</summary><p class="muted">${esc(e.model)}</p></details>
      ${parent ? `<p class="muted">Parent’s check: ${reviewScore(parent)}/${e.rubric.length}${parent.comment ? ` · “${esc(parent.comment)}”` : ''}${parent.redo ? ' · redo asked for' : ''}</p>` : ''}
      <div style="display:grid; gap:4px; margin:6px 0">${e.rubric.map((point, i) => `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-written-point="${i}" ${review?.points[i] ? 'checked' : ''}> ${esc(point)}</label>`).join('')}</div>
      <label>Note for the student <input type="text" data-written-comment maxlength="300" value="${esc(review?.comment || '')}"></label>
      <div class="row"><button class="btn small primary" data-written-save="${esc(e.id)}" data-redo="0">${mine && !review?.redo ? '✅ Update: looks good' : '✅ Looks good'}</button> <button class="btn small" data-written-save="${esc(e.id)}" data-redo="1">${mine && review?.redo ? '🔁 Update: send back' : '🔁 Send back to redo'}</button></div>
      <p class="muted" style="margin:4px 0 0">Send back puts the question back in the student's practice with your note, and at the top of their Today's plan as “Fix first” until they send it again.</p></div>`;
      };
      const accepted = (e: WrittenEntry) => { const rv = writtenReview(e, overrides); return !!rv && !rv.redo; };
      const doneList = entries.filter(accepted);
      const rows = entries.filter(e => !accepted(e)).map(card).join('') + archiveHTML(doneList.map(card).join(''), doneList.length);
  return `<div class="card"><h2>Written answers${entries.length ? ` · ${writtenWaiting({ ...r, qx: overrides }).length} waiting` : ''}</h2><p class="muted">Tick each point the answer shows. Written answers don't change practice or test scores. The student sees your ticks and note under “My written answers.” To add a word from her writing to the vocabulary list, double-click it and tap 📌 Add to vocab.</p>${rows || '<p class="muted">No written answers yet.</p>'}</div>`;
}
/* projects and experiments a student can submit; shown on the Projects tab and counted on the dashboard's waiting card */
const GUESS_PROJECTS = new Set(['historylab']);   // projects where the teacher guesses what a drawing shows before the last questions open
const PROJECT_TITLES: Record<string, string> = { history: 'History Unit 1: Source Investigator Project', historylab: 'History Unit 1: Cave Painting Studio', history2: 'History Unit 2: Forager or Farmer? Evidence Case', history3: 'History Unit 3: Compare Two Early Societies', history4: 'History Unit 4: Belief Systems and Empires Case Study', bio1: 'Biology Unit 1: Model Project', bio1lab: 'Biology Unit 1: Germination Lab (experiment)', bio2: 'Biology Unit 2: Field Guide Page', bio2lab: 'Biology Unit 2: Bean Sprouts in Light and Dark (experiment)', bio2lab2: 'Biology Unit 2: Paper Helicopter Seeds (experiment)', bio2lab3: 'Biology Unit 2: Kitchen Clones (experiment)', prepositions: 'English Unit 5: Treasure Hunt Directions', prepositionslab: 'English Unit 5: Prepositions in the Wild (field notes)', prepositionslab2: 'English Unit 5: Interjection Comic' };
function historyProjectsHTML(r: StudentReport, overrides: Record<string, string>) {
  const projects = PROJECT_TITLES;
  const labels: Record<string, string> = { choice: 'Model choice', parts: 'Parts and functions', organization: 'Organization', limits: 'Model limits', question: 'Question and hypothesis', variables: 'Variables', procedure: 'Procedure', data: 'Data', conclusion: 'Conclusion', connection: 'Connection to plant reproduction', source: 'Source', perspective: 'Perspective', claim: 'Claim and evidence', frame: 'Frame or scale', subject: 'Subject', evidence: 'Evidence', tradeoffs: 'Advantages and disadvantages', sources: 'Sources used', environment: 'Environment and resources', compare: 'Comparison', spread: 'How it spread', painting: 'Cave painting', guessCompare: 'Your guess vs. what I meant', cantShow: 'What I couldn’t show a historian', animal: 'Animal', inherit: 'Inherited and acquired traits', behavior: 'Behaviors', strategy: 'Parenting strategy', growth: 'Growth', page: 'Field guide page (photo)', setup: 'Setup', heights: 'Heights (data table)', photo: 'Photo', results: 'Results', build: 'What I built', predict: 'Prediction', times: 'Fall times (data table)', dispersal: 'Connection to seed dispersal', explain: 'Explanation', risk: 'Clones: good and risky', hide: 'What and where', directions: 'Directions', phrases: 'Phrases (table)', hunt: 'The hunt', book: 'Book', found: 'Phrases found (table)', pattern: 'Pattern', interjections: 'Interjections found', rewrite: 'Rewrite', plan: 'Plan', comic: 'Comic (photo)', lines: 'Speech bubbles' };
  const items = Object.entries(projects).map(([id, title]) => {
    const p = (id.startsWith('bio') ? r.scienceProjects : r.historyProjects)?.[id], at = p?.submittedAt || 0, submitted = p?.status === 'submitted' && at > 0;
    const [verdict, stamp] = String(overrides[`project:${id}`] || '').split(':'), current = +stamp === at && (verdict === 'verified' || verdict === 'revise') ? verdict : '';
    const parent = !current && (p?.localReview === 'verified' || p?.localReview === 'revise') ? p.localReview : '';   // a parent's check at home (grown-up PIN)
    const status = !submitted ? 'Not submitted' : current === 'verified' ? 'Verified' : current === 'revise' ? 'Revision requested' : parent === 'verified' ? 'Verified by a parent' : parent === 'revise' ? 'Revision requested by a parent' : 'Waiting for review';
    const answers = Object.entries(p?.answers || {}).filter(([, v]) => v).map(([k, v]) => `<dt>${esc(labels[k] || k)}</dt><dd>${/^data:image\//.test(v) ? `<img src="${esc(v)}" alt="${esc(labels[k] || 'Drawing')}" style="width:100%;max-width:360px;border-radius:8px">` : `<span style="white-space:pre-wrap">${esc(v)}</span>`}</dd>`).join('');
    /* the Cave Painting Studio: first the teacher writes what they think the painting shows, which opens the student's last two questions */
    const guess = String(overrides[`project-guess:${id}`] || '').replace(/^\d+:/, ''), needsGuess = GUESS_PROJECTS.has(id) && submitted && !p?.answers?.guessCompare;
    const guessBox = GUESS_PROJECTS.has(id) && submitted ? (needsGuess ? `<div class="row" data-guess-row="${id}"><label style="flex:1">What do you think this painting shows? Write it like a historian who can’t ask the artist.<input type="text" data-project-guess maxlength="300" value="${esc(guess)}" style="width:100%"></label><button class="btn small primary" data-project-guess-send="${id}" data-project-at="${at}">Send my guess</button></div><p class="muted" style="margin:4px 0 0">Sending your guess opens questions 2 and 3 for the student.</p>` : guess ? `<p class="muted">Your guess: “${esc(guess)}”</p>` : '') : '';
    return { done: submitted && (current === 'verified' || (!current && parent === 'verified')), html: `<h3>${esc(title)} · ${status}</h3>${answers ? `<div class="reading-report-chapter"><dl>${answers}</dl></div>` : '<p class="muted">No work yet.</p>'}${guessBox}${submitted && !needsGuess ? `<div class="row"><button class="btn small primary" data-project-verdict="verified" data-project-course="${id}" data-project-at="${at}">Verify</button> <button class="btn small" data-project-verdict="revise" data-project-course="${id}" data-project-at="${at}">Request revision</button></div>` : ''}` };
    });
    const doneItems = items.filter(x => x.done);
    const rows = items.filter(x => !x.done).map(x => x.html).join('') + archiveHTML(doneItems.map(x => x.html).join(''), doneItems.length);
  return `<div class="card"><h2>Projects and experiments</h2><p class="muted">Student-built research projects and lab reports. Verify when the work meets your standard, or request a revision: it goes at the top of the student's Today's plan as “Fix first” until they send it again.</p>${rows}<p class="status" id="studentQuizMsg2"></p></div>`;
}
function englishReadingHTML(r: StudentReport, subject = '') {
  const courses = [
    {title:'English Unit 1: Nouns',skills:{identifyNouns:'Identifying nouns',singularPlural:'Singular and plural nouns',commonProper:'Common and proper nouns',concreteAbstract:'Concrete and abstract nouns',fToVes:'f to -ves plurals',enPlurals:'-en plurals',basePlurals:'Base plurals',mutantPlurals:'Mutant plurals',foreignPlurals:'Foreign plurals',pluralReview:'Irregular plural review'},quizzes:[['quiz:intro','Introduction to nouns Quiz'],['quiz:types','Types of nouns Quiz'],['quiz:irregularBase','Irregular plurals I Quiz'],['quiz:irregularForeign','Irregular plurals II Quiz']],finalKey:'final-test',finalCount:10},
    {title:'English Unit 2: Verbs',skills:{verbIdentify:'Identifying verbs',verbAgreement:'Introduction to verb agreement',verbTense:'Introduction to verb tense',actionLinkHelping:'Action, linking, and helping verbs',irregularVerbs:'Irregular verbs',simpleAspect:'Simple verb aspect',progressiveAspect:'Progressive verb aspect',perfectAspect:'Perfect verb aspect',perfectProgressive:'Perfect progressive verb aspect',tenseAspectTime:'Managing time with tense and aspect',modalVerbs:'Modal verbs'},quizzes:[['verbs:quiz:foundation','Quiz 1 · Verbs foundations'],['verbs:quiz:irregular','Irregular verbs Quiz'],['verbs:quiz:aspect','Verb aspect Quiz'],['verbs:quiz:aspectModal','Aspect and modal verbs Quiz']],finalKey:'verbs:final-test',finalCount:11},
    {title:'English Unit 3: Pronouns',skills:{questionWord:'The question word',personalPronoun:'Meet the personal pronoun',possessivePronoun:'Possessive pronouns and adjectives',reflexivePronoun:'Reflexive pronouns',relativePronoun:'Relative pronouns',pronounCase:'Choosing between subject and object pronouns',pronounPerson:'Pronoun person',pronounNumber:'Pronoun number',indefinitePronoun:'Indefinite pronouns',pronounVagueness:'Pronoun vagueness',emphaticPronoun:'Emphatic pronouns'},quizzes:[['pronouns:quiz:intro','Introduction to pronouns Quiz'],['pronouns:quiz:possessive','Possessive and reflexive pronouns Quiz'],['pronouns:quiz:relative','Relative pronouns Quiz'],['pronouns:quiz:caseNumber','Subject, object, person, and number Quiz'],['pronouns:quiz:indefinite','Indefinite, vague, and emphatic pronouns Quiz']],finalKey:'pronouns:final-test',finalCount:11},
    {title:'English Unit 4: Adjectives and Adverbs',skills:{meetAdjective:'Meet the adjective',meetArticle:'Meet the article',definiteIndefinite:'Choosing between definite and indefinite articles',meetAdverb:'Meet the adverb',adverbOrAdjective:'Using adverbs and adjectives',relativeAdverbs:'Identifying relative adverbs',adjectiveOrder:'Adjective order',commasAdjectives:'Commas and adjectives',comparativeSuperlative:'Comparative and superlative adjectives and adverbs',intensifiers:'Intensifiers and adverbs of degree'},quizzes:[['modifiers:quiz:intro','Adjectives and articles Quiz'],['modifiers:quiz:adverbs','Adverbs Quiz'],['modifiers:quiz:order','Adjective order and commas Quiz'],['modifiers:quiz:degree','Comparing and intensifying Quiz']],finalKey:'modifiers:final-test',finalCount:10},
    {title:'English Unit 5: Prepositions and Interjections',skills:{meetPreposition:'Meet the preposition',prepPhrases:'Prepositional phrases',prepPurpose:'What prepositions tell',prepAgreement:'Subject-verb agreement with prepositional phrases',prepOrAdverb:'Challenge: Preposition or adverb?',meetInterjection:'Meet the interjection',interjectionPunct:'Punctuating interjections',prepInterjMix:'Prepositions and interjections: mixed practice'},quizzes:[['prepositions:quiz:prepositions','Prepositions Quiz'],['prepositions:quiz:interjections','Interjections and mixed practice Quiz']],finalKey:'prepositions:final-test',finalCount:16},
    {title:'English Unit 6: Punctuation',skills:{endMarks:'Three ways to end a sentence',meetComma:'Meet the comma',listCommas:'Punctuating lists',letterCommas:'Salutations, valedictions, dates, and addresses',introCommas:'Commas and introductory elements',dialogueCommas:'Commas in dialogue, tag questions, direct address, and yes-or-no responses',appositives:'Appositives',meetApostrophe:'Meet the apostrophe',contractions:'Introduction to contractions',apostrophePlurals:'Apostrophes and plurals',possessive:'Introduction to the possessive',pluralPossessive:'Advanced (plural) possession',itsVsIts:'Choosing between its and it’s'},quizzes:[['punctuation:quiz:endCommas','End marks and commas Quiz'],['punctuation:quiz:spaceTime','Commas in space and time Quiz'],['punctuation:quiz:moreCommas','More ways to use commas Quiz'],['punctuation:quiz:apostrophes','Apostrophes and contractions Quiz'],['punctuation:quiz:possessive','Possessives Quiz']],finalKey:'punctuation:final-test',finalCount:13},
    {title:'History Unit 1: Origins of History',history:true,skills:{historyStories:'History Stories',historyScale:'History of Many Shapes and Sizes',historyFrames:'History Frames',historyMemory:'History and Memory'},quizzes:[] as string[][],finalKey:'history:final-test',finalCount:8},
    {title:'History Unit 2: Early Humans',history:true,skills:{earliestHumans:'The Earliest Humans',migrationArt:'Migration and Art',foragingSocieties:'Foraging Societies',agriculturalRevolution:'The Agricultural Revolution',biggestMistake:'The Biggest Mistake Humans Ever Made?'},quizzes:[] as string[][],finalKey:'history2:final-test',finalCount:10},
    {title:'History Unit 3: Early Agrarian Societies',history:true,skills:{villageNetworks:'Foragers and Village Networks',firstCities:'The First Cities, States, and Empires',tradeNetworks:'Ancient Trade Networks',mesopotamia:'Ancient Mesopotamia',shangChina:'Shang Dynasty China',egyptNubia:'Nubia and Ancient Egypt',earlyAmericas:'Ancient Americas',ancientIndia:'Indus River Valley',earlyAgrarian:'Early Agrarian Societies in Context'},quizzes:[] as string[][],finalKey:'history3:final-test',finalCount:18},
    {title:'History Unit 4: Empires and Belief Systems',history:true,skills:{portableBelief:'Portable Belief Systems',hinduBuddhism:'Hinduism and Buddhism',judaismChristianity:'Judaism and Christianity',islam:'Islam',comparePortable:'Comparing Portable Belief Systems',persia:'Ancient Persia',greece:'Classical Greece',imperialChina:'Ancient and Imperial China',compareEmpires:'Comparing Ancient Empires',rome:'Ancient Rome',romeHan:'Rome and Han China',womenAncient:'Women in the Ancient World'},quizzes:[['history4:quiz:hinduBuddhism','Quiz 1'],['history4:quiz:religionsChange','Quiz 2'],['history4:quiz:imperialChina','Quiz 3'],['history4:quiz:riseFall','Quiz 4']],finalKey:'history4:final-test',finalCount:24},
    {title:'History Unit 5: Regional Webs',history:true,skills:{collapseEmpires:'Why Do Empires Collapse?',byzantine:'The Byzantine Empire',darkAges:'Assessing the Dark Ages',serfdom:'Serfdom in Europe',peasantRevolts:'Peasant Revolts in Europe',europeChina:'Systems Restructure in Europe and China',islamicWorld:'The Islamic World',islamGoldenAge:'The Golden Age of Islam',silkRoad:'The Silk Road',expandingRoutes:'Expanding the Silk Routes',songChina:'Song China'},quizzes:[['history5:quiz:darkAges5','Quiz 1'],['history5:quiz:islam5','Quiz 2']],finalKey:'history5:final-test',finalCount:22},
    {title:'Biology Unit 1: Life Sciences',science:true,skills:{cellsOrganisms:'Understand: Cells and organisms',cellPartsU:'Understand: Cell parts and functions',cellPartsA:'Apply: Cell parts and functions',plantSuccessU:'Understand: Plant reproductive success',plantSuccessA:'Apply: Plant reproductive success',asexualPlants:'Asexual reproduction',sexualPlants:'Sexual reproduction',seedDispersal:'Dispersal of seeds',digestionHumans:'Digestion in humans',digestionIntestines:'Digestion in the intestines',humanDigestion:'Human digestion'},quizzes:[['bio1:quiz:cells','Quiz 1'],['bio1:quiz:plants','Quiz 2'],['bio1:quiz:digestion','Quiz 3']],finalKey:'bio1:final-test',finalCount:22},
    {title:'Biology Unit 2: Organism Growth and Reproduction',science:true,skills:{traitsReproU:'Understand: Traits and reproduction',traitsReproA:'Apply: Traits and reproduction',animalBehaviorU:'Understand: Animal behavior and reproductive success',animalBehaviorA:'Apply: Animal behavior and reproductive success',plantStructuresU:'Understand: Plant structures and reproductive success',plantStructuresA:'Apply: Plant structures and reproductive success',growthEnvU:'Understand: Organism growth and the environment',growthEnvA:'Apply: Organism growth and the environment'},quizzes:[['bio2:quiz:traits','Quiz 1'],['bio2:quiz:growth','Quiz 2']],finalKey:'bio2:final-test',finalCount:24}
  ];
  const coursePanels = courses.filter(course => !subject || course.title.startsWith(subject)).map(course => {
    const store = (course as { history?: boolean }).history ? r.historyProgress : (course as { science?: boolean }).science ? r.scienceProgress : r.elaProgress;
    const practiced = Object.keys(course.skills).filter(id => (store?.[id]?.answered || 0) > 0 || (store?.[id]?.tries || 0) > 0).length, fin = store?.[course.finalKey];
    const summary = !practiced && !fin?.tries ? 'Not started' : `${practiced} of ${Object.keys(course.skills).length} skills practiced · ${fin?.passed ? 'Unit test passed ✅' : fin?.tries ? 'Unit test not passed yet' : 'Unit test not taken'}`;
    const [unitTitle, unitName] = course.title.split(': ');
    const skills = Object.entries(course.skills).map(([id, name]) => {
      const progress = ((course as { history?: boolean }).history ? r.historyProgress : (course as { science?: boolean }).science ? r.scienceProgress : r.elaProgress)?.[id], answered = progress?.answered || 0, misses = progress?.misses || 0;
      const result = answered ? `${Math.round((answered - misses) * 100 / answered)}% · ${answered - misses}/${answered} correct`
        : progress?.tries ? `No answer history · best ${progress.best ?? 0}/${progress.questionCount || 4}` : 'Not practiced';
      return `<tr><td>${esc(name)}</td><td>${result}</td><td>${answered >= 4 && (answered - misses) / answered < .7 ? 'Review suggested' : ''}</td></tr>`;
    }).join('');
    const assessments = [...course.quizzes.map(([key, name]) => ({key,name,total:4})),{key:course.finalKey,name:'Unit test',total:course.finalCount}].map(item => {
      const progress = ((course as { history?: boolean }).history ? r.historyProgress : (course as { science?: boolean }).science ? r.scienceProgress : r.elaProgress)?.[item.key];
      return `<tr><td>${esc(item.name)}</td><td>${progress?.tries ? `${progress.passed ? 'Passed' : 'Not passed'} · best ${progress.best ?? 0}/${progress.questionCount || item.total}` : 'Not started'}</td><td>${progress?.tries || 0}</td></tr>`;
    }).join('');
    return `<details class="card unit-card"${practiced && !fin?.passed ? ' open' : ''}><summary><b>${esc(unitTitle)}</b> <span class="muted">${esc(unitName || '')}</span><span class="unit-sum">${summary}</span></summary><h3>Practice by skill</h3><table class="steptable"><tr><th>Skill</th><th>Accuracy</th><th>Focus</th></tr>${skills}</table><h3>Quizzes and test</h3><table class="steptable"><tr><th>Assessment</th><th>Status</th><th>Attempts</th></tr>${assessments}</table></details>`;
  }).join('');
  return coursePanels;
}
/* Reading Log with the grown-up check: chapter notes must be verified before they can be quizzed (docs/READING-QUIZ.md).
   Verdicts are saved in quiz_overrides as reading:<bookId>:<chapterId> and readingEssay:<quizId> = "verified:<submittedAt>" or "revise:<submittedAt>". */
const READING_LABELS: [keyof ReadingChapter, string][] = [['characters','Main characters'],['notableAction','Notable character action'],['interaction','Character interactions'],['conflict','Conflict'],['joy','Joy or success'],['setting','Environment and setting'],['themes','Theme or big idea'],['detail','Standout detail'],['vocabulary','Vocabulary']];
function readingVerdict(overrides: Record<string, string>, key: string, at: number, parent = '') {
  if (!at) return 'draft';
  const [verdict, stamp] = String(overrides[key] || '').split(':');
  if (+stamp === at && (verdict === 'verified' || verdict === 'revise')) return verdict;
  return parent === 'verified' ? 'parentVerified' : parent === 'revise' ? 'parentRevise' : 'submitted';   // a parent's check at home
}
const READING_STATUS: Record<string, string> = { draft: 'Not sent yet', submitted: 'Waiting for your check', verified: 'Verified', revise: 'Needs fixing', parentVerified: 'Checked by a parent', parentRevise: 'A parent asked for a fix' };
function readingReviewHTML(r: StudentReport, overrides: Record<string, string>) {
  let waiting = 0;
  const buttons = (key: string, at: number, yes: string, no: string) => `<div class="row"><button class="btn small primary" data-reading-verdict="verified" data-reading-key="${esc(key)}" data-reading-at="${at}">${yes}</button> <button class="btn small" data-reading-verdict="revise" data-reading-key="${esc(key)}" data-reading-at="${at}">${no}</button></div>`;
  const books = (r.readingBooks || []).map(book => {
    const chapterItems = book.chapters.map(chapter => {
      const at = chapter.submittedAt || 0, key = `reading:${book.id}:${chapter.id}`, state = book.id && chapter.id ? readingVerdict(overrides, key, at, chapter.localReview) : 'draft';
      if (state === 'submitted') waiting++;
      const notes = READING_LABELS.filter(([k]) => chapter[k]).map(([k, label]) => `<dt>${label}</dt><dd>${esc(chapter[k])}</dd>`).join('');
      return { done: state === 'verified' || state === 'parentVerified', html: `<div class="reading-report-chapter"><b>${esc(chapter.label || 'Untitled chapter')}</b> · <span class="muted">${READING_STATUS[state]}</span>${notes ? `<dl>${notes}</dl>` : '<p class="muted">No notes yet.</p>'}${at ? buttons(key, at, state === 'verified' ? 'Verified ✓' : 'Notes match the book', 'Needs fixing') : ''}</div>` };
      });
    const quizItems = (book.quizzes || []).slice().reverse().map(qz => {
      const at = qz.submittedAt || 0, key = `readingEssay:${qz.id}`, state = (qz.essays || []).length ? readingVerdict(overrides, key, at, qz.localReview) : 'draft';
      if (state === 'submitted') waiting++;
      const essays = (qz.essays || []).map(e => `<dt>${esc(e.prompt)}</dt><dd>${esc(e.answer)}</dd>`).join('');
      return { done: !essays || state === 'verified' || state === 'parentVerified', html: `<div class="reading-report-chapter"><b>Reading quiz ${qz.at ? esc(new Date(qz.at).toLocaleDateString()) : ''} · ${esc((qz.chapterLabels || []).join(', '))}</b> · ${qz.score ?? 0}/${qz.total ?? 0} right${essays ? ` · essay: ${state === 'verified' ? 'Accepted' : state === 'revise' ? 'Redo requested' : state === 'parentVerified' ? 'Accepted by a parent' : state === 'parentRevise' ? 'A parent asked for a redo' : 'Waiting for your check'}` : ''}${(qz.missed || []).length ? `<p class="muted">Missed: ${(qz.missed || []).map(esc).join(' · ')}</p>` : ''}${essays ? `<dl>${essays}</dl>${buttons(key, at, 'Accept essay', 'Ask for a redo')}` : ''}</div>` };   // a quiz with no essay has nothing to check
      });
      const items = [...chapterItems, ...quizItems], doneItems = items.filter(x => x.done);
      return `<section class="reading-report"><h4>${esc(book.title)}${book.author ? ` · ${esc(book.author)}` : ''}</h4>${book.chapters.length ? '' : '<p class="muted">No chapters yet.</p>'}${items.filter(x => !x.done).map(x => x.html).join('')}${archiveHTML(doneItems.map(x => x.html).join(''), doneItems.length)}</section>`;
  }).join('');
  return `<div class="card"><h2>Reading Log and Reading Quizzes${waiting ? ` · ${waiting} waiting` : ''}</h2><p class="muted">Students write these notes themselves. Check each chapter against the book: only verified chapters can be quizzed. Quiz questions are built from the verified notes; essays wait for you to read.</p>${books || '<p class="muted">No books added yet.</p>'}</div>`;
}
export function closeDetail() { $('#detail').hidden = true; if (reportChanged && redrawReport) { reportChanged = false; redrawReport(); } }
$('#detail').addEventListener('click', e => { if ((e.target as HTMLElement).id === 'detail') closeDetail(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#detail').hidden) closeDetail(); });

/* student detail: 4-week bars of daily minutes and the recent sessions */
function practiceHTML(r: StudentReport) {
  const ss = r.ss, byDay = new Map((ss?.days || []).map(([d, m]) => [d, m]));
  const days = Array.from({ length: 28 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (27 - i)); return { d, mins: byDay.get(dayKey(d)) || 0 }; });
  const top = Math.max(10, ...days.map(x => x.mins));
  const bars = days.map(x => `<div class="pt-day${x.d.getDay() === 1 ? ' week-start' : ''}" title="${esc(x.d.toLocaleDateString())}: ${x.mins} min"><span class="pt-bar" style="height:${Math.round(100 * x.mins / top)}%"></span></div>`).join('');
  const recent = (ss?.recent || []).map(([start, end, secs, device]) => { const s = new Date(start), e = new Date(end);
    return `<tr><td>${esc(s.toLocaleDateString())}</td><td>${esc(s.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))}</td><td>${esc(e.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))}</td><td>${Math.round(secs / 60)} min</td><td>${esc(device || '–')}</td></tr>`; }).join('');
  return `<h2>Practice time</h2><div class="summary"><div class="kpi"><b>${minTxt(ss?.today ?? 0)}</b>today</div><div class="kpi"><b>${minTxt(ss?.week ?? 0)}</b>in the last 7 days</div><div class="kpi"><b>${esc(signedInTxt(ss?.last))}</b>last signed in</div></div>
    <p class="muted" style="margin:10px 0 4px">Active minutes per day, last 4 weeks</p><div class="pt-bars" aria-label="Active minutes per day for the last 4 weeks">${bars}</div>
    <h3>Time by subject</h3>${subjectTimeTableHTML(r.subjectTime, 7)}
    <h3>Recent sessions</h3>${recent ? `<table class="steptable"><tr><th>Date</th><th>Started</th><th>Last active</th><th>Active</th><th>Device</th></tr>${recent}</table>` : '<p class="muted">No sessions yet.</p>'}`;
}

function downloadCSV(list: StudentReport[]) {
  const head = ['Student', 'Last active', 'Last signed in', 'Minutes today', 'Minutes this week', 'Problems', 'Ideas %', 'Arithmetic %', 'Top mix-up', ...ORDER.map(k => SKILLS[k].name)];
  const rows = list.map(r => { const s = sStats(r); return [r.n, r.o ? new Date(r.t).toLocaleString() : '', r.ss?.last ? new Date(r.ss.last).toLocaleString() : '', r.ss?.today ?? 0, r.ss?.week ?? 0, r.o || 0, s.ip ?? '', s.ap ?? '', s.top && MIS[s.top] ? MIS[s.top].name : '', ...ORDER.map(k => statusFromRecent(((r.k || {})[k] || [])[1] || ''))]; });
  const csv = [head, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'pet-town-class.csv'; a.click();
}
