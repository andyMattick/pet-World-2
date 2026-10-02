/* Renders the class dashboard from the per-student reports that class_report() returns. */
import { SKILLS, SKILL_ORDER as ORDER, SHOPS, BUILDINGS, DEFAULT_HOME, builtHoods, validHood, shopOfSkill, MIS, statusFromRecent, drillLabel, type DrillSettings } from '../shared/registry';

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
  readingBooks?: { title: string; author?: string; chapters: { label?: string; characters?: string; notableAction?: string; interaction?: string; conflict?: string; joy?: string; setting?: string; themes?: string; detail?: string; vocabulary?: string }[] }[];
  elaProgress?: Record<string, { answered?: number; misses?: number; tries?: number; best?: number; passed?: boolean; questionCount?: number }>;
  historyProgress?: Record<string, { answered?: number; misses?: number; tries?: number; best?: number; passed?: boolean; questionCount?: number }>;
  historyProjects?: Record<string, { answers?: Record<string, string>; status?: string; submittedAt?: number }>;
}
/* practice time from class_report(): minutes today and in the last 7 days, daily minutes for 4 weeks,
   and the 10 most recent sessions as [start ms, last seen ms, active seconds, device] */
interface PracticeSummary { last: number | null; today: number; week: number; days: [string, number][]; recent: [number, number, number, string | null][] }

const $ = (s: string) => document.querySelector(s) as HTMLElement;
export const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
let reportShop: string | null = null;   // null: the first shop of the class's home grade
let reportHome = DEFAULT_HOME, reportClass = '';
/* the dashboard opens on the class's home grade; picking another class starts over there */
export function setReportClass(classId: string, home: unknown) {
  if (classId !== reportClass) { reportClass = classId; reportShop = null; }
  reportHome = validHood(home) ? home : DEFAULT_HOME;
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

export function renderClassReport(el: HTMLElement, list: StudentReport[], onSaveStudentDrills?: SaveStudentDrills, onResetStudent?: ResetStudent, onSaveQuizOverride?: SaveQuizOverride) {
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

  const groups: Record<string, { r: StudentReport; n: number; ex?: string }[]> = {};
  list.forEach(r => Object.entries(r.m || {}).forEach(([id, v]) => { if (!MIS[id]) return; (groups[id] = groups[id] || []).push({ r, n: v[0], ex: v[1] && v[1][0] }); }));
  const gl = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  h += `<div class="card"><h2>Suggested small groups</h2><p class="muted" style="margin-top:0">Students grouped by the mix-up the game spotted. Counts show how many times it happened.</p>`;
  h += gl.length ? '<div class="groups">' + gl.map(([id, arr]) => `<div class="group"><h3>${esc(MIS[id].name)}</h3>
      <div class="who">${arr.sort((a, b) => b.n - a.n).map(x => `<span class="chip">${esc(x.r.n)} (${x.n})</span>`).join('')}</div>
      <div class="muted">${esc(MIS[id].tip)}</div>
      ${arr[0].ex ? `<div class="muted" style="margin-top:6px"><i>Example: ${esc(arr[0].ex)}</i></div>` : ''}
      ${MIS[id].skills.length ? `<div style="margin-top:6px">Khan practice: ${MIS[id].skills.map(s => `<a href="${SKILLS[s].url}" target="_blank" rel="noopener">${SHOPS[shopOfSkill(s)].emoji} ${esc(SKILLS[s].name)}</a>`).join(', ')}</div>` : ''}</div>`).join('') + '</div>'
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
  h += `<div class="two"><div class="card"><h2>Skills to reteach or assign</h2>${needs.length ? needs.map(x => `<p style="margin:0 0 10px"><b>${SHOPS[shopOfSkill(x.k)].emoji} ${esc(SKILLS[x.k].name)}</b>: ${x.who.map(r => esc(r.n)).join(', ')}<br><a href="${SKILLS[x.k].url}" target="_blank" rel="noopener">Assign on Khan Academy</a></p>`).join('') : '<p class="muted">Nobody is struggling on a skill right now.</p>'}</div>`;

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
  el.querySelectorAll<HTMLButtonElement>('.namebtn').forEach(b => b.addEventListener('click', () => openDetail(list.find(r => r.id === b.dataset.id)!, onSaveStudentDrills, onResetStudent, onSaveQuizOverride)));
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
  h += practiceHTML(r);
    h += englishReadingHTML(r);
  h += '<div id="projectCard"></div>';
  h += '<h2>Skills and steps</h2><table class="steptable"><tr><th>Khan skill</th><th>Status</th><th>Steps (right first try / tried)</th><th></th></tr>';
  ORDER.forEach(k => {
    const e = (r.k || {})[k], s = statusFromRecent(e ? e[1] : ''), steps = (r.s || {})[k] || {};
    const stepTxt = Object.entries(steps).map(([nm, v]) => `<span class="tag ${v[3]}">${v[3] === 's' ? 'count' : v[3] === 'i' ? 'idea' : 'arith'}</span> ${esc(nm)}: ${v[1]}/${v[0]}${v[2] ? ` (${v[2]} slow)` : ''}`).join('<br>');
    h += `<tr><td>${SHOPS[shopOfSkill(k)].emoji} ${esc(SKILLS[k].name)}</td><td><span class="tag s-${s}" style="color:#3B2724">${s}</span></td><td>${stepTxt || '<span class="muted">not yet</span>'}</td><td><a href="${SKILLS[k].url}" target="_blank" rel="noopener">Khan</a></td></tr>`;
  });
  h += '</table><div class="two" style="margin-top:14px"><div><h2>Mix-ups</h2>';
  h += st.mis.length ? '<ul>' + st.mis.map(([id, v]) => `<li><b>${esc(MIS[id] ? MIS[id].name : id)}</b> (${v[0]})${(v[1] || []).map(x => `<div class="muted">${esc(x)}</div>`).join('')}</li>`).join('') + '</ul>' : '<p class="muted">None spotted.</p>';
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
    const controlRows = quizTargets.map(t => quizControlRow(t.key, t.label)).join('');
    return `<h3>History</h3><table class="steptable"><tr><th>Date</th><th>Shop</th><th>Station</th><th>Score</th><th>Missed skills</th></tr>${historyRows || '<tr><td colspan="5" class="muted">No quizzes or tests yet.</td></tr>'}</table>
      <h3>Overrides</h3><table class="steptable"><tr><th>Quiz</th><th>Status</th><th></th></tr>${controlRows}</table><p class="status" id="studentQuizMsg"></p>`;
  }
  async function saveOverride(key: string, value: string | null) {
    if (!onSaveQuizOverride) return;
    const next = { ...overrides };
    if (value) next[key] = value; else delete next[key];
    try { await onSaveQuizOverride(r.id, Object.keys(next).length ? next : null); overrides = next; renderQuizCard(); }
    catch (err) { const msg = $('#studentQuizMsg'); if (msg) msg.textContent = String(err); }
  }
  function renderQuizCard() {
    const el2 = $('#quizCard');
    if (!el2) return;
    el2.innerHTML = quizCardHtml();
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-excuse]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizExcuse!, 'excused'); }));
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-clear]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizClear!, `cleared:${Date.now()}`); }));
    el2.querySelectorAll<HTMLButtonElement>('[data-quiz-undo]').forEach(b => b.addEventListener('click', () => { void saveOverride(b.dataset.quizUndo!, null); }));
    renderProjectCard();
  }
  function renderProjectCard() {
    const card = $('#projectCard');
    if (!card) return;
    card.innerHTML = historyProjectsHTML(r, overrides);
    card.querySelectorAll<HTMLButtonElement>('[data-project-verdict]').forEach(b => b.addEventListener('click', () => {
      void saveOverride(`project:${b.dataset.projectCourse}`, `${b.dataset.projectVerdict}:${b.dataset.projectAt}`);
    }));
  }
  $('#detailSheet').innerHTML = h; $('#detail').hidden = false;
  renderQuizCard();
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
  $('#dClose').focus();
  $('#dClose').addEventListener('click', closeDetail);
  $('#dPrint').addEventListener('click', () => window.print());
}
function historyProjectsHTML(r: StudentReport, overrides: Record<string, string>) {
  const projects: Record<string, string> = { history: 'History Unit 1: Source Investigator Project', history2: 'History Unit 2: Forager or Farmer? Evidence Case' };
  const labels: Record<string, string> = { source: 'Source', perspective: 'Perspective', claim: 'Claim and evidence', frame: 'Frame or scale', subject: 'Subject', evidence: 'Evidence', tradeoffs: 'Advantages and disadvantages', sources: 'Sources used' };
  const rows = Object.entries(projects).map(([id, title]) => {
    const p = r.historyProjects?.[id], at = p?.submittedAt || 0, submitted = p?.status === 'submitted' && at > 0;
    const [verdict, stamp] = String(overrides[`project:${id}`] || '').split(':'), current = +stamp === at && (verdict === 'verified' || verdict === 'revise') ? verdict : '';
    const status = !submitted ? 'Not submitted' : current === 'verified' ? 'Verified' : current === 'revise' ? 'Revision requested' : 'Waiting for review';
    const answers = Object.entries(p?.answers || {}).filter(([, v]) => v).map(([k, v]) => `<dt>${esc(labels[k] || k)}</dt><dd>${esc(v)}</dd>`).join('');
    return `<h3>${esc(title)} · ${status}</h3>${answers ? `<div class="reading-report-chapter"><dl>${answers}</dl></div>` : '<p class="muted">No work yet.</p>'}${submitted ? `<div class="row"><button class="btn small primary" data-project-verdict="verified" data-project-course="${id}" data-project-at="${at}">Verify</button> <button class="btn small" data-project-verdict="revise" data-project-course="${id}" data-project-at="${at}">Request revision</button></div>` : ''}`;
  }).join('');
  return `<div class="card"><h2>History projects</h2><p class="muted">Student-built research projects. Verify when the work meets your standard, or request a revision.</p>${rows}<p class="status" id="studentQuizMsg2"></p></div>`;
}
function englishReadingHTML(r: StudentReport) {
  const courses = [
    {title:'English Unit 1: Nouns',skills:{identifyNouns:'Identifying nouns',singularPlural:'Singular and plural nouns',commonProper:'Common and proper nouns',concreteAbstract:'Concrete and abstract nouns',fToVes:'f to -ves plurals',enPlurals:'-en plurals',basePlurals:'Base plurals',mutantPlurals:'Mutant plurals',foreignPlurals:'Foreign plurals',pluralReview:'Irregular plural review'},quizzes:[['quiz:intro','Introduction to nouns Quiz'],['quiz:types','Types of nouns Quiz'],['quiz:irregularBase','Irregular plurals I Quiz'],['quiz:irregularForeign','Irregular plurals II Quiz']],finalKey:'final-test',finalCount:10},
    {title:'English Unit 2: Verbs',skills:{verbIdentify:'Identifying verbs',verbAgreement:'Introduction to verb agreement',verbTense:'Introduction to verb tense',actionLinkHelping:'Action, linking, and helping verbs',irregularVerbs:'Irregular verbs',simpleAspect:'Simple verb aspect',progressiveAspect:'Progressive verb aspect',perfectAspect:'Perfect verb aspect',perfectProgressive:'Perfect progressive verb aspect',tenseAspectTime:'Managing time with tense and aspect',modalVerbs:'Modal verbs'},quizzes:[['verbs:quiz:foundation','Quiz 1 · Verbs foundations'],['verbs:quiz:irregular','Irregular verbs Quiz'],['verbs:quiz:aspect','Verb aspect Quiz'],['verbs:quiz:aspectModal','Aspect and modal verbs Quiz']],finalKey:'verbs:final-test',finalCount:11},
    {title:'History Unit 1: Origins of History',history:true,skills:{historyStories:'History Stories',historyScale:'History of Many Shapes and Sizes',historyFrames:'History Frames',historyMemory:'History and Memory'},quizzes:[] as string[][],finalKey:'history:final-test',finalCount:8},
    {title:'History Unit 2: Early Humans',history:true,skills:{earliestHumans:'The Earliest Humans',migrationArt:'Migration and Art',foragingSocieties:'Foraging Societies',agriculturalRevolution:'The Agricultural Revolution',biggestMistake:'The Biggest Mistake Humans Ever Made?'},quizzes:[] as string[][],finalKey:'history2:final-test',finalCount:10}
  ];
  const coursePanels = courses.map(course => {
    const skills = Object.entries(course.skills).map(([id, name]) => {
      const progress = ((course as { history?: boolean }).history ? r.historyProgress : r.elaProgress)?.[id], answered = progress?.answered || 0, misses = progress?.misses || 0;
      const result = answered ? `${Math.round((answered - misses) * 100 / answered)}% · ${answered - misses}/${answered} correct`
        : progress?.tries ? `No answer history · best ${progress.best ?? 0}/${progress.questionCount || 4}` : 'Not practiced';
      return `<tr><td>${esc(name)}</td><td>${result}</td><td>${answered >= 4 && (answered - misses) / answered < .7 ? 'Review suggested' : ''}</td></tr>`;
    }).join('');
    const assessments = [...course.quizzes.map(([key, name]) => ({key,name,total:4})),{key:course.finalKey,name:'Unit test',total:course.finalCount}].map(item => {
      const progress = ((course as { history?: boolean }).history ? r.historyProgress : r.elaProgress)?.[item.key];
      return `<tr><td>${esc(item.name)}</td><td>${progress?.tries ? `${progress.passed ? 'Passed' : 'Not passed'} · best ${progress.best ?? 0}/${progress.questionCount || item.total}` : 'Not started'}</td><td>${progress?.tries || 0}</td></tr>`;
    }).join('');
    return `<div class="card"><h2>${esc(course.title)}</h2><h3>Practice by skill</h3><table class="steptable"><tr><th>Skill</th><th>Accuracy</th><th>Focus</th></tr>${skills}</table><h3>Quizzes and test</h3><table class="steptable"><tr><th>Assessment</th><th>Status</th><th>Attempts</th></tr>${assessments}</table></div>`;
  }).join('');
  const books = (r.readingBooks || []).map(book => `<section class="reading-report"><h4>${esc(book.title)}${book.author ? ` · ${esc(book.author)}` : ''}</h4>${book.chapters.length ? book.chapters.map(chapter => {
    const notes = [['Main characters',chapter.characters],['Notable character action',chapter.notableAction],['Character interactions',chapter.interaction],['Conflict',chapter.conflict],['Joy or success',chapter.joy],['Environment and setting',chapter.setting],['Theme or big idea',chapter.themes],['Standout detail',chapter.detail],['Vocabulary',chapter.vocabulary]].filter(([,value]) => value);
    return `<div class="reading-report-chapter"><b>${esc(chapter.label || 'Untitled chapter')}</b>${notes.length ? `<dl>${notes.map(([label,value]) => `<dt>${label}</dt><dd>${esc(value)}</dd>`).join('')}</dl>` : '<p class="muted">No notes yet.</p>'}</div>`;
  }).join('') : '<p class="muted">No chapters yet.</p>'}</section>`).join('');
  return `${coursePanels}<div class="card"><h2>Reading Log</h2><p class="muted">Student-entered chapter book reports; the game does not verify interpretations.</p>${books || '<p class="muted">No books added yet.</p>'}</div>`;
}
export function closeDetail() { $('#detail').hidden = true; }
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
    <h3>Recent sessions</h3>${recent ? `<table class="steptable"><tr><th>Date</th><th>Started</th><th>Last active</th><th>Active</th><th>Device</th></tr>${recent}</table>` : '<p class="muted">No sessions yet.</p>'}`;
}

function downloadCSV(list: StudentReport[]) {
  const head = ['Student', 'Last active', 'Last signed in', 'Minutes today', 'Minutes this week', 'Problems', 'Ideas %', 'Arithmetic %', 'Top mix-up', ...ORDER.map(k => SKILLS[k].name)];
  const rows = list.map(r => { const s = sStats(r); return [r.n, r.o ? new Date(r.t).toLocaleString() : '', r.ss?.last ? new Date(r.ss.last).toLocaleString() : '', r.ss?.today ?? 0, r.ss?.week ?? 0, r.o || 0, s.ip ?? '', s.ap ?? '', s.top && MIS[s.top] ? MIS[s.top].name : '', ...ORDER.map(k => statusFromRecent(((r.k || {})[k] || [])[1] || ''))]; });
  const csv = [head, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'pet-town-class.csv'; a.click();
}
