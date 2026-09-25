/* Renders the class dashboard from the per-student reports that class_report() returns. */
import { SKILLS, SKILL_ORDER as ORDER, STATIONS, MIS, statusFromRecent, drillLabel, type DrillSettings } from '../shared/registry';

type DrillHistory = Record<string, { miss?: number; slow?: number; sprint?: number; popups?: number; missesAfter?: number; reteach?: boolean }>;
type SaveStudentDrills = (id: string, settings: Partial<DrillSettings> | null) => Promise<void>;
type ResetStudent = (id: string, clearHistory: boolean) => Promise<void>;

export interface StudentReport {
  id: string; n: string; cl?: string; t: number; o: number; pf: number; tm: number;
  k: Record<string, [number, string]>;
  s: Record<string, Record<string, [number, number, number, string]>>;
  cc: [number, number, number, number];
  m: Record<string, [number, string[]]>;
  f: [string, number, number, number][]; df: [string, number, number, number][];
  p: Record<string, { miss?: number; slow?: number; sprint?: number }>; dr?: DrillHistory; ds?: Partial<DrillSettings> | null; dl?: DrillHistory; sp: number;
}

const $ = (s: string) => document.querySelector(s) as HTMLElement;
export const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);

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
const drillHistory = (r: StudentReport): DrillHistory => r.dl && Object.keys(r.dl).length ? r.dl : r.dr && Object.keys(r.dr).length ? r.dr : Object.fromEntries(Object.entries(r.p || {}).map(([key, value]) => ['times:' + key, value]));

export function renderClassReport(el: HTMLElement, list: StudentReport[], onSaveStudentDrills?: SaveStudentDrills, onResetStudent?: ResetStudent) {
  if (!list.length) { el.innerHTML = '<div class="card empty">No students yet. Add your roster on the Roster tab.</div>'; return; }
  const played = list.filter(r => r.o > 0);
  const n = list.length, orders = list.reduce((s, r) => s + (r.o || 0), 0);
  let ci = 0, cc = 0, ca = 0, cac = 0;
  list.forEach(r => { const c = r.cc || [0, 0, 0, 0]; ci += c[0]; cc += c[1]; ca += c[2]; cac += c[3]; });
  const ip = ci ? Math.round(100 * cc / ci) : null, ap = ca ? Math.round(100 * cac / ca) : null;
  const activeNow = list.filter(r => r.t && Date.now() - r.t < 10 * 60000).length;
  let h = `<div class="summary">
    <div class="kpi"><b>${n}</b>students (${played.length} have played)</div>
    <div class="kpi"><b>${activeNow}</b>active in the last 10 minutes</div>
    <div class="kpi"><b>${orders}</b>problems solved</div>
    <div class="kpi"><b>${pctTxt(ip)}</b>idea steps right, first try</div>
    <div class="kpi"><b>${pctTxt(ap)}</b>arithmetic steps right, first try</div></div>`;

  const groups: Record<string, { r: StudentReport; n: number; ex?: string }[]> = {};
  list.forEach(r => Object.entries(r.m || {}).forEach(([id, v]) => { if (!MIS[id]) return; (groups[id] = groups[id] || []).push({ r, n: v[0], ex: v[1] && v[1][0] }); }));
  const gl = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  h += `<div class="card"><h2>Suggested small groups</h2><p class="muted" style="margin-top:0">Students grouped by the mix-up the game spotted. Counts show how many times it happened.</p>`;
  h += gl.length ? '<div class="groups">' + gl.map(([id, arr]) => `<div class="group"><h3>${esc(MIS[id].name)}</h3>
      <div class="who">${arr.sort((a, b) => b.n - a.n).map(x => `<span class="chip">${esc(x.r.n)} (${x.n})</span>`).join('')}</div>
      <div class="muted">${esc(MIS[id].tip)}</div>
      ${arr[0].ex ? `<div class="muted" style="margin-top:6px"><i>Example: ${esc(arr[0].ex)}</i></div>` : ''}
      ${MIS[id].skills.length ? `<div style="margin-top:6px">Khan practice: ${MIS[id].skills.map(s => `<a href="${SKILLS[s].url}" target="_blank" rel="noopener">${esc(SKILLS[s].name)}</a>`).join(', ')}</div>` : ''}</div>`).join('') + '</div>'
    : '<p class="muted">No mix-ups spotted yet.</p>';
  const notHelping = list.flatMap(r => Object.entries(r.dl || {}).filter(([, v]) => v.reteach).map(([id, v]) => ({name:r.n, id, v})));
  h += `</div><div class="card"><h2>Pop-ups that aren't helping</h2>${notHelping.length ? '<table class="steptable"><tr><th>Student</th><th>Drill</th><th>Pop-ups</th><th>Misses after</th></tr>' + notHelping.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(drillLabel(x.id))}</td><td>${x.v.popups || 0}</td><td>${x.v.missesAfter || 0}</td></tr>`).join('') + '</table>' : '<p class="muted">No drills need reteaching right now.</p>'}</div>`;

  h += `<div class="card"><h2>Skill grid</h2><div class="tablewrap"><table class="cls"><thead><tr><th></th>`;
  STATIONS.forEach(st => { h += `<th class="stn" colspan="${st.skills.length}">${st.id}. ${esc(st.name)}</th>`; });
  h += `<th colspan="5"></th></tr><tr><th>Student</th>${ORDER.map(k => `<th class="sk" title="${esc(SKILLS[k].name)}">${esc(SKILLS[k].short)}</th>`).join('')}
    <th>Ideas</th><th>Arithmetic</th><th>Top mix-up</th><th>Problems</th><th>Last active</th></tr></thead><tbody>`;
  list.forEach(r => {
    const st = sStats(r);
    h += `<tr><td><button class="namebtn" data-id="${esc(r.id)}">${esc(r.n)}</button></td>`;
    ORDER.forEach(k => { const e = (r.k || {})[k]; const s = statusFromRecent(e ? e[1] : ''); h += `<td class="cell s-${s}" title="${esc(SKILLS[k].name)}: ${s}${e ? `, ${e[0]} tried` : ''}">${e ? e[0] : ''}</td>`; });
    h += `<td>${pctTxt(st.ip)}</td><td>${pctTxt(st.ap)}</td><td>${st.top ? esc(MIS[st.top] ? MIS[st.top].name : st.top) : '–'}</td><td>${r.o || 0}</td><td>${r.o ? ago(r.t) : 'not yet'}</td></tr>`;
  });
  h += `</tbody></table></div><div class="legend"><span><i class="s-mastered"></i>Mastered (4+ tries, 75% of last 8 perfect)</span><span><i class="s-practicing"></i>Practicing</span><span><i class="s-struggling"></i>Struggling</span><span><i class="s-new"></i>Not started</span><span>Numbers are problems tried.</span></div>
    <div class="row noprint"><button class="btn small" id="csv">Download CSV</button><button class="btn small" id="printDash">Print</button></div></div>`;

  const needs = ORDER.map(k => ({ k, who: list.filter(r => statusFromRecent(((r.k || {})[k] || [])[1] || '') === 'struggling') })).filter(x => x.who.length).sort((a, b) => b.who.length - a.who.length);
  h += `<div class="two"><div class="card"><h2>Skills to reteach or assign</h2>${needs.length ? needs.map(x => `<p style="margin:0 0 10px"><b>${esc(SKILLS[x.k].name)}</b>: ${x.who.map(r => esc(r.n)).join(', ')}<br><a href="${SKILLS[x.k].url}" target="_blank" rel="noopener">Assign on Khan Academy</a></p>`).join('') : '<p class="muted">Nobody is struggling on a skill right now.</p>'}</div>`;

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
  el.querySelectorAll<HTMLButtonElement>('.namebtn').forEach(b => b.addEventListener('click', () => openDetail(list.find(r => r.id === b.dataset.id)!, onSaveStudentDrills, onResetStudent)));
  el.querySelector('#csv')?.addEventListener('click', () => downloadCSV(list));
  el.querySelector('#printDash')?.addEventListener('click', () => window.print());
}

export function openDetail(r: StudentReport, onSaveStudentDrills?: SaveStudentDrills, onResetStudent?: ResetStudent) {
  if (!r) return;
  const st = sStats(r);
  let setupA = 0, setupC = 0;
  Object.values(r.s || {}).forEach(steps => Object.values(steps).forEach(v => { if (v[3] === 's') { setupA += v[0]; setupC += v[1]; } }));
  let h = `<div class="row noprint" style="justify-content:space-between; margin-top:0"><h2 id="dTitle" style="margin:0">${esc(r.n)}</h2>
    <span><button class="btn small" id="dPrint">Print</button> <button class="btn small" id="dReset">Reset</button> <button class="btn small" id="dClose">Close</button></span></div><div id="studentResetPanel" class="reset-panel" hidden></div>
    <p class="muted">Last active ${r.o ? ago(r.t) : 'not yet'}. ${r.o || 0} problems, ${r.pf || 0} perfect. About ${r.tm || 0} minutes played. Best sprint: ${r.sp || 0}.</p>
    <div class="summary"><div class="kpi"><b>${pctTxt(st.ip)}</b>idea steps right, first try</div><div class="kpi"><b>${pctTxt(st.ap)}</b>arithmetic steps right, first try</div><div class="kpi"><b>Counting and reading the picture: ${setupC} of ${setupA}</b> right on first try.</div></div>`;
  h += '<h2>Skills and steps</h2><table class="steptable"><tr><th>Khan skill</th><th>Status</th><th>Steps (right first try / tried)</th><th></th></tr>';
  ORDER.forEach(k => {
    const e = (r.k || {})[k], s = statusFromRecent(e ? e[1] : ''), steps = (r.s || {})[k] || {};
    const stepTxt = Object.entries(steps).map(([nm, v]) => `<span class="tag ${v[3]}">${v[3] === 's' ? 'count' : v[3] === 'i' ? 'idea' : 'arith'}</span> ${esc(nm)}: ${v[1]}/${v[0]}${v[2] ? ` (${v[2]} slow)` : ''}`).join('<br>');
    h += `<tr><td>${esc(SKILLS[k].name)}</td><td><span class="tag s-${s}" style="color:#3B2724">${s}</span></td><td>${stepTxt || '<span class="muted">not yet</span>'}</td><td><a href="${SKILLS[k].url}" target="_blank" rel="noopener">Khan</a></td></tr>`;
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
  $('#detailSheet').innerHTML = h; $('#detail').hidden = false;
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
export function closeDetail() { $('#detail').hidden = true; }
$('#detail').addEventListener('click', e => { if ((e.target as HTMLElement).id === 'detail') closeDetail(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#detail').hidden) closeDetail(); });

function downloadCSV(list: StudentReport[]) {
  const head = ['Student', 'Last active', 'Problems', 'Ideas %', 'Arithmetic %', 'Top mix-up', ...ORDER.map(k => SKILLS[k].name)];
  const rows = list.map(r => { const s = sStats(r); return [r.n, r.o ? new Date(r.t).toLocaleString() : '', r.o || 0, s.ip ?? '', s.ap ?? '', s.top && MIS[s.top] ? MIS[s.top].name : '', ...ORDER.map(k => statusFromRecent(((r.k || {})[k] || [])[1] || ''))]; });
  const csv = [head, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'pet-town-class.csv'; a.click();
}
