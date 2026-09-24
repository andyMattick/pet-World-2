/* Renders the class dashboard from the per-student reports that class_report() returns. */
import { SKILLS, SKILL_ORDER as ORDER, STATIONS, MIS, statusFromRecent } from '../shared/registry';

export interface StudentReport {
  id: string; n: string; cl?: string; t: number; o: number; pf: number; tm: number;
  k: Record<string, [number, string]>;
  s: Record<string, Record<string, [number, number, number, string]>>;
  cc: [number, number, number, number];
  m: Record<string, [number, string[]]>;
  f: [string, number, number, number][]; df: [string, number, number, number][];
  p: Record<string, { miss?: number; slow?: number; sprint?: number }>; sp: number;
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

export function renderClassReport(el: HTMLElement, list: StudentReport[]) {
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
  h += '</div>';

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
    Object.entries(r.p || {}).forEach(([t, v]) => { tables[t] = (tables[t] || 0) + (v.miss || 0) + (v.slow || 0) + (v.sprint || 0); });
  });
  const tf = Object.entries(facts).filter(([, v]) => v.miss > 0).sort((a, b) => b[1].miss - a[1].miss).slice(0, 10);
  const tt = Object.entries(tables).sort((a, b) => b[1] - a[1]).slice(0, 6);
  h += `<div class="card"><h2>Times tables across the class</h2>
    ${tt.length ? `<p style="margin-top:0">Tables that triggered the most practice pop-ups: ${tt.map(([t, c]) => `<span class="chip">${t}s (${c})</span>`).join('')}</p>` : ''}
    ${tf.length ? '<table class="steptable"><tr><th>Fact</th><th>Misses or slow</th><th>Students</th></tr>' + tf.map(([k, v]) => { const [x, y] = k.split('x').map(Number); return `<tr><td>${x} × ${y} = ${x * y}</td><td>${v.miss}</td><td>${[...v.who].map(esc).join(', ')}</td></tr>`; }).join('') + '</table>' : '<p class="muted">No times-table trouble yet.</p>'}</div></div>`;
  el.innerHTML = h;
  el.querySelectorAll<HTMLButtonElement>('.namebtn').forEach(b => b.addEventListener('click', () => openDetail(list.find(r => r.id === b.dataset.id)!)));
  el.querySelector('#csv')?.addEventListener('click', () => downloadCSV(list));
  el.querySelector('#printDash')?.addEventListener('click', () => window.print());
}

export function openDetail(r: StudentReport) {
  if (!r) return;
  const st = sStats(r);
  let h = `<div class="row noprint" style="justify-content:space-between; margin-top:0"><h2 id="dTitle" style="margin:0">${esc(r.n)}</h2>
    <span><button class="btn small" id="dPrint">Print</button> <button class="btn small" id="dClose">Close</button></span></div>
    <p class="muted">Last active ${r.o ? ago(r.t) : 'not yet'}. ${r.o || 0} problems, ${r.pf || 0} perfect. About ${r.tm || 0} minutes played. Best sprint: ${r.sp || 0}.</p>
    <div class="summary"><div class="kpi"><b>${pctTxt(st.ip)}</b>idea steps right, first try</div><div class="kpi"><b>${pctTxt(st.ap)}</b>arithmetic steps right, first try</div></div>`;
  h += '<h2>Skills and steps</h2><table class="steptable"><tr><th>Khan skill</th><th>Status</th><th>Steps (right first try / tried)</th><th></th></tr>';
  ORDER.forEach(k => {
    const e = (r.k || {})[k], s = statusFromRecent(e ? e[1] : ''), steps = (r.s || {})[k] || {};
    const stepTxt = Object.entries(steps).filter(([, v]) => v[3] !== 's').map(([nm, v]) => `<span class="tag ${v[3]}">${v[3] === 'i' ? 'idea' : 'arith'}</span> ${esc(nm)}: ${v[1]}/${v[0]}${v[2] ? ` (${v[2]} slow)` : ''}`).join('<br>');
    h += `<tr><td>${esc(SKILLS[k].name)}</td><td><span class="tag s-${s}" style="color:#3B2724">${s}</span></td><td>${stepTxt || '<span class="muted">not yet</span>'}</td><td><a href="${SKILLS[k].url}" target="_blank" rel="noopener">Khan</a></td></tr>`;
  });
  h += '</table><div class="two" style="margin-top:14px"><div><h2>Mix-ups</h2>';
  h += st.mis.length ? '<ul>' + st.mis.map(([id, v]) => `<li><b>${esc(MIS[id] ? MIS[id].name : id)}</b> (${v[0]})${(v[1] || []).map(x => `<div class="muted">${esc(x)}</div>`).join('')}</li>`).join('') + '</ul>' : '<p class="muted">None spotted.</p>';
  const f = (r.f || []).map(([k, a, c, s]) => { const [x, y] = k.split('x'); return `<span class="chip">${x}×${y}: ${c}/${a}${s ? `, ${s} slow` : ''}</span>`; }).join('');
  const df = (r.df || []).map(([k, a, c, s]) => { const [x, y] = k.split('x').map(Number); return `<span class="chip">${x * y}÷${x}: ${c}/${a}${s ? `, ${s} slow` : ''}</span>`; }).join('');
  const pl = Object.entries(r.p || {}).map(([t, v]) => `<span class="chip">${t}s: ${(v.miss || 0) + (v.slow || 0) + (v.sprint || 0)}</span>`).join('');
  h += `</div><div><h2>Times tables</h2><p><b>Multiplying</b><br>${f || '<span class="muted">No trouble</span>'}</p><p><b>Finding the multiplier (dividing)</b><br>${df || '<span class="muted">No trouble</span>'}</p><p><b>Practice pop-ups</b><br>${pl || '<span class="muted">None</span>'}</p></div></div>`;
  $('#detailSheet').innerHTML = h; $('#detail').hidden = false;
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
