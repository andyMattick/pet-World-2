/* 📈 Insights: the first section of a student's page (docs/INSIGHTS.md). The numbers come from src/shared/insights.ts
   (the same code the daily email runs); this file only draws them, and wires the ✉️ Email me this now button. */
import { computeInsights, INSIGHT_RULES, type Insights, type InsightNames, type InsightsStudent, type Rec, type Pattern } from '../shared/insights';
import { SKILLS, SHOPS, MIS, BUILDINGS } from '../shared/registry';
import { LESSON_COURSES } from '../shared/questionBanks';

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const COURSES = LESSON_COURSES as { id: string; title: string }[];
/** Names from the registry, so Insights says "Adding decimals" instead of "addDec". */
export const insightNames: InsightNames = {
  skill: id => (SKILLS as Record<string, { name?: string }>)[id]?.name,
  shop: id => (SHOPS[id] ? `${SHOPS[id].emoji} ${SHOPS[id].name}` : undefined),
  station: (shop, st) => { const s = SHOPS[shop], x = s?.stations.find(y => y.id === st); return s && x ? `${s.emoji} ${s.name} · ${x.name}` : undefined; },
  course: id => COURSES.find(c => c.id === id)?.title,
  mixup: id => (MIS[id] ? { name: MIS[id].name, tip: MIS[id].tip } : undefined),
  unitSubject: id => BUILDINGS.find(b => b.id === id)?.subject
};

/* ✉️ Email me this now: main.ts supplies the call to the daily-insights function (it has the database client) */
export type InsightsEmailer = (studentId: string) => Promise<{ ok: boolean; message: string }>;
let emailer: InsightsEmailer | null = null;
export function setInsightsEmailer(fn: InsightsEmailer | null) { emailer = fn; }

const tz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } };
let shown: { el: HTMLElement; id: string } | null = null;

/** Draw the section for one student (and remember it, so a dashboard reload can redraw it with fresh data). */
export function renderInsightsCard(el: HTMLElement, r: InsightsStudent & { id: string }) {
  shown = { el, id: r.id };
  const open = new Set([...el.querySelectorAll<HTMLDetailsElement>('details[data-ins]')].filter(d => d.open).map(d => d.dataset.ins!));
  const first = !el.innerHTML;
  let ins: Insights;
  try { ins = computeInsights(r, { now: Date.now(), tz: tz(), names: insightNames }); }
  catch (err) { el.innerHTML = `<div class="card insights-card"><h2>📈 Insights</h2><p class="err">Couldn’t read the data: ${esc((err as Error).message)}</p></div>`; return; }
  el.innerHTML = insightsHTML(ins, first ? null : open);
  const btn = el.querySelector<HTMLButtonElement>('[data-ins-email]'), status = el.querySelector<HTMLElement>('[data-ins-status]');
  btn?.addEventListener('click', async () => {
    if (!status) return;
    if (!emailer) { status.innerHTML = setupNote('Email needs the online teacher app.'); return; }
    btn.disabled = true; status.textContent = 'Sending…';
    try { const res = await emailer(r.id); status.innerHTML = res.ok ? `✅ ${esc(res.message)}` : setupNote(res.message); }
    catch (err) { status.innerHTML = setupNote((err as Error).message); }
    btn.disabled = false;
  });
}
/** A dashboard reload hands over fresh reports: redraw the section if this student's page is still open. */
export function refreshInsights(list: (InsightsStudent & { id: string })[]) {
  if (!shown || !shown.el.isConnected || shown.el.closest('[hidden]')) return;
  const fresh = list.find(x => x.id === shown!.id);
  if (fresh) renderInsightsCard(shown.el, fresh);
}
const setupNote = (why: string) => `<span>✉️ The email isn’t set up yet${why ? ` <span class="muted">(${esc(why)})</span>` : ''}. The steps are in <b>docs/INSIGHTS.md</b>: a free Resend account, two secrets, one deploy and one database file. Everything on this page works without it.</span>`;

/* ---------- drawing ---------- */
const CONF: Record<Rec['confidence'], string> = { high: '●●●', medium: '●●○', low: '●○○' };
const pctOf = (r: number, t: number) => (t ? Math.round(r * 100 / t) : null);
/* a small single-series column chart: one value per day, the value written above each bar */
function columns(values: (number | null)[], labels: string[], opts: { max: number; unit: string; cls: string; title: string; tips: string[] }) {
  const W = 300, H = 92, top = 16, base = H - 18, bw = 34, gap = (W - bw * values.length) / values.length;
  const bars = values.map((v, i) => {
    const x = Math.round(gap / 2 + i * (bw + gap)), h = v == null ? 0 : Math.max(2, Math.round((base - top) * Math.min(1, v / Math.max(1, opts.max))));
    return `<g><title>${esc(opts.tips[i])}</title><rect x="${x - 4}" y="${top - 4}" width="${bw + 8}" height="${base - top + 24}" fill="transparent"/>${v == null ? `<text x="${x + bw / 2}" y="${base - 4}" class="ins-nil" text-anchor="middle">–</text>` : `<path class="${opts.cls}" d="M${x},${base} V${base - h + 4} Q${x},${base - h} ${x + 4},${base - h} H${x + bw - 4} Q${x + bw},${base - h} ${x + bw},${base - h + 4} V${base} Z"/><text x="${x + bw / 2}" y="${base - h - 4}" class="ins-val" text-anchor="middle">${v}${opts.unit}</text>`}<text x="${x + bw / 2}" y="${H - 4}" class="ins-axis" text-anchor="middle">${esc(labels[i])}</text></g>`;
  }).join('');
  return `<figure class="ins-chart"><figcaption>${esc(opts.title)}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title)}: ${values.map((v, i) => `${labels[i]} ${v == null ? 'none' : v + opts.unit}`).join(', ')}"><line x1="0" x2="${W}" y1="${base}" y2="${base}" class="ins-base"/>${bars}</svg></figure>`;
}
/* one horizontal bar per group (time patterns, time per subject) */
const hbar = (label: string, value: number | null, max: number, text: string, dim = false, mark: number | null = null) =>
  `<div class="ins-hrow${dim ? ' dim' : ''}" title="${esc(`${label}: ${text}`)}"><span class="ins-hl">${esc(label)}</span><span class="ins-track">${value == null ? '' : `<i style="width:${Math.max(2, Math.min(100, Math.round(100 * value / Math.max(1, max))))}%"></i>`}${mark != null ? `<b class="ins-goal" style="left:${Math.min(100, Math.round(100 * mark / Math.max(1, max)))}%" title="goal"></b>` : ''}</span><span class="ins-hv">${esc(text)}</span></div>`;
function patternHTML(p: Pattern) {
  return `<div class="ins-pattern"><h4>${esc(p.title)}</h4>${p.buckets.map(b => hbar(b.label, b.pct, 100, b.total ? `${b.pct}% · ${b.right}/${b.total}` : 'no answers', !b.enough)).join('')}<p class="${p.found ? '' : 'muted'}">${p.found ? '👉 ' : ''}${esc(p.verdict)}</p></div>`;
}
const recHTML = (r: Rec) => `<li><span>${esc(r.text)}</span><small class="muted">${esc(r.evidence)} · <span class="ins-conf ${r.confidence}" title="confidence: ${r.confidence}">${CONF[r.confidence]} ${r.confidence}</span></small></li>`;

export function insightsHTML(ins: Insights, open: Set<string> | null) {
  const det = (id: string, summary: string, body: string, startOpen: boolean) => `<details class="ins-fold" data-ins="${id}"${(open ? open.has(id) : startOpen) ? ' open' : ''}><summary>${summary}</summary>${body}</details>`;
  const t = ins.today, tp = pctOf(t.right, t.total);
  const todayHTML = `<div class="ins-today">
      <div class="ins-kpi"><b>${t.minutes}</b><span>min today</span></div>
      <div class="ins-kpi"><b>${tp == null ? '–' : tp + '%'}</b><span>${t.total ? `right (${t.right}/${t.total})` : 'no scored work'}</span></div>
      <div class="ins-kpi"><b>${t.firstSubject ? esc(t.firstSubject.split(' ')[0]) : '–'}</b><span>${t.firstSubject ? `started with ${esc(t.firstSubject.replace(/^\S+\s/, ''))}` : 'no subject yet'}</span></div>
      <div class="ins-kpi"><b>${t.passed.length}</b><span>passed today</span></div></div>
    ${t.subjects.length ? `<p class="ins-line">${t.subjects.map(s => `<span class="chip">${esc(s.label)} ${s.minutes} min</span>`).join('')}</p>` : ''}
    ${t.passed.map(x => `<p class="ins-line">🏅 ${esc(x)}</p>`).join('')}${t.flags.map(x => `<p class="ins-line">⚠️ ${esc(x)}</p>`).join('')}${t.helpAsked ? `<p class="ins-line">✋ ${t.helpAsked} question${t.helpAsked === 1 ? '' : 's'} today</p>` : ''}`;
  const d = ins.days, maxMin = Math.max(30, ...d.map(x => x.minutes));
  const charts = `<div class="ins-charts">${columns(d.map(x => x.minutes), d.map(x => x.label.split(' ')[0]), { max: maxMin, unit: '', cls: 'ins-bar-min', title: 'Active minutes per day', tips: d.map(x => `${x.label}: ${x.minutes} min`) })}
    ${columns(d.map(x => pctOf(x.right, x.total)), d.map(x => x.label.split(' ')[0]), { max: 100, unit: '%', cls: 'ins-bar-pct', title: '% right per day (scored work)', tips: d.map(x => `${x.label}: ${x.total ? `${pctOf(x.right, x.total)}% (${x.right} of ${x.total})` : 'no scored work'}`) })}</div>`;
  const struggles = ins.struggles.length ? `<ol class="ins-list">${ins.struggles.map(s => `<li><b>${esc(s.title)}</b> <span class="ins-conf ${s.confidence}" title="confidence: ${s.confidence}">${CONF[s.confidence]}</span><br><small class="muted">${esc(s.detail)}</small></li>`).join('')}</ol>` : `<p class="muted">Nothing stands out: no lesson under ${INSIGHT_RULES.lessonStrugglePct}% (with ${INSIGHT_RULES.lessonMinAnswers}+ answers), no math skill under ${INSIGHT_RULES.mathStrugglePct}% perfect (with ${INSIGHT_RULES.mathMinOrders}+ orders), no failed quiz left.</p>`;
  const missed = ins.missed.length ? `<ul class="ins-list">${ins.missed.map(m => `<li>${esc(m.text)} <small class="muted">· ${esc(m.where)}${m.count > 1 ? ` · <b>${m.count}×</b>` : ''}${m.example ? ` · ${esc(m.example)}` : ''}</small></li>`).join('')}</ul>` : `<p class="muted">No prompt missed twice in ${INSIGHT_RULES.windowDays} days (lesson prompts are logged from this version of the game on).</p>`;
  const found = ins.patterns.filter(p => p.found);
  const subj = ins.time.subjects.filter(s => s.minutes > 0 || s.goal), maxS = Math.max(1, ...subj.map(s => Math.max(s.minutes, s.goal || 0)));
  const sh = ins.time.share;
  const timeHTML = `${subj.length ? subj.map(s => hbar(s.label, s.minutes, maxS, `${s.minutes} min${s.goal ? ` / goal ${s.goal}${s.ratio != null ? ` (${Math.round(s.ratio * 100)}%)` : ''}` : ''}`, false, s.goal)).join('') : '<p class="muted">No time recorded.</p>'}
    <p class="muted" style="margin:4px 0 8px">The ▏ mark is the plan’s goal on the days she worked.</p>
    ${sh.total ? `<div class="ins-share" title="Lessons ${sh.lessons} · unit games ${sh.games} · Arcade ${sh.arcade} · town ${sh.town} · brain breaks ${sh.breaks} min">${[['lessons', sh.lessons, 'Lessons'], ['games', sh.games, 'Unit games'], ['arcade', sh.arcade, 'Arcade'], ['town', sh.town + sh.breaks, 'Town & breaks']].filter(x => +x[1] > 0).map(([k, v]) => `<i class="ins-s-${k}" style="flex:${v}"></i>`).join('')}</div>
    <p class="ins-legend">${[['lessons', sh.lessons, 'Lessons'], ['games', sh.games, 'Unit games'], ['arcade', sh.arcade, 'Arcade'], ['town', sh.town + sh.breaks, 'Town & breaks']].map(([k, v, l]) => `<span><i class="ins-s-${k}"></i>${l} ${v} min</span>`).join('')}</p>` : ''}
    <h4>Order of her day</h4>${ins.time.order.days.length ? `<div class="ins-order">${ins.time.order.days.map(x => `<div><span class="muted">${esc(x.label)}</span> ${x.seq.map(esc).join(' → ')}</div>`).join('')}</div>` : ''}<p class="muted">${esc(ins.time.order.verdict)}</p>
    ${ins.time.idle.pct != null ? `<p class="ins-line">⏸️ On screen ${ins.time.idle.onScreen} min, active ${ins.time.idle.active} min (${ins.time.idle.pct}% idle)${ins.time.idle.pauses ? ` · ${ins.time.idle.pauses} pause${ins.time.idle.pauses === 1 ? '' : 's'} after “Still there?” (${ins.time.idle.pausedMinutes} min)` : ''}</p>` : ''}
    ${ins.time.emptyDays.length ? `<p class="ins-line">📭 No work: ${ins.time.emptyDays.map(esc).join(', ')}</p>` : ''}
    ${ins.time.stuck.map(s => `<p class="ins-line">🧱 ${s.minutes} min on ${esc(s.label)} (${esc(s.day)}), nothing finished</p>`).join('')}
    ${ins.time.partway.length ? `<p class="ins-line">↩️ Left partway: ${ins.time.partway.slice(0, 6).map(p => `${esc(p.label)} (${esc(p.day.split(' ')[0])}, ${p.minutes} min)`).join(' · ')}</p>` : ''}`;
  const tools = `<div class="ins-tools">${ins.tools.map(x => `<div class="ins-tool${x.count ? '' : ' unused'}"><span class="ins-te">${x.emoji}</span><span><b>${esc(x.label)}</b><br><small>${esc(x.note)}</small></span></div>`).join('')}</div>`;
  const wins = ins.wins.length ? `<ul class="ins-list ins-wins">${ins.wins.map(w => `<li>${w.emoji} ${esc(w.text)}</li>`).join('')}</ul>` : '<p class="muted">Nothing yet this week.</p>';
  const recs = (list: Rec[], none: string) => (list.length ? `<ul class="ins-recs">${list.map(recHTML).join('')}</ul>` : `<p class="muted">${none}</p>`);
  const stamp = new Date(ins.generatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `<div class="card insights-card">
    <div class="ins-head"><h2>📈 Insights</h2><span class="muted">Last ${INSIGHT_RULES.windowDays} days · built-in rules · updated ${esc(stamp)}</span><button type="button" class="btn small noprint" data-ins-email>✉️ Email me this now</button></div>
    <p class="status ins-status noprint" data-ins-status aria-live="polite"></p>
    <h3>Today · ${esc(t.label)}</h3>${todayHTML}
    <h3>Last ${INSIGHT_RULES.windowDays} days <span class="muted">· ${ins.window.activeDays} work day${ins.window.activeDays === 1 ? '' : 's'}</span></h3>${charts}
    ${det('struggles', `<b>Struggles</b> <span class="muted">· ${ins.struggles.length || 'none'}</span>`, struggles, true)}
    ${det('missed', `<b>Missed most</b> <span class="muted">· ${ins.missed.length || 'none'}</span>`, missed, ins.missed.length > 0)}
    ${det('when', `<b>When she struggles</b> <span class="muted">· ${found.length ? esc(found[0].verdict) : 'no clear pattern yet'}</span>`, `<div class="ins-patterns">${ins.patterns.map(patternHTML).join('')}</div><p class="muted">A pattern is named only with ${INSIGHT_RULES.minBucket}+ scored answers in each group and a ${INSIGHT_RULES.minGapPts}-point gap. Faded bars don’t have enough answers yet.</p>`, false)}
    ${det('time', `<b>Time and order</b> <span class="muted">· ${ins.time.totalMinutes} min · ${esc(ins.time.order.verdict.split(' (')[0])}</span>`, timeHTML, false)}
    ${det('tools', `<b>Tools</b> <span class="muted">· ${ins.tools.filter(x => x.count).length} of ${ins.tools.length} used</span>`, tools, false)}
    ${det('wins', `<b>Worth noting</b> <span class="muted">· ${ins.wins.length}</span>`, wins, ins.wins.length > 0)}
    <h3>Recommendations</h3>
    <div class="ins-rec-cols"><div><h4>For her plan</h4>${recs(ins.recs.plan, 'None yet: not enough data for a confident suggestion.')}</div>
    <div><h4>Ideas for the app</h4>${recs(ins.recs.app, 'None this time.')}</div></div>
    ${ins.dataNotes.length ? `<p class="muted">${ins.dataNotes.map(esc).join(' ')}</p>` : ''}
    <p class="muted ins-key">●●● strong evidence · ●●○ good · ●○○ just enough. Nothing is suggested below the minimums in docs/INSIGHTS.md.</p></div>`;
}
