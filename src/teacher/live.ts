/* Watching a student from the teacher app (docs/LIVE.md).
   - The "Right now" card at the top of a student's page: what she's on, and today's work with every score, read from
     her save every 20 seconds while the card is on screen.
   - Alerts: while the teacher app is open, every 30 seconds it reads the class's saves and pops up a note (and a
     browser notification, once allowed with 🔔) when a student finishes a plan row (a subject's time, a unit, an
     extra, a time goal) or passes a quiz or unit test. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { ledgerClient, savedDayHTML, type SaveDayLog } from './ledger';
import { subjectDayKey } from '../shared/subjectTime';

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
interface LiveRow { student_id: string; now: { t?: number; what?: string } | null; subjectTime: Record<string, Record<string, number>> | null; dayLog: Record<string, SaveDayLog> | null }
const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const agoText = (t: number) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m === 1 ? '1 minute ago' : m < 60 ? `${m} minutes ago` : `at ${clock(t)}`; };

/* ---------- the Right now card ---------- */
export function startRightNow(el: HTMLElement, student: { id: string; n: string }) {
  let timer: ReturnType<typeof setInterval> | null = null;
  async function tick() {
    if (!el.isConnected) { if (timer) clearInterval(timer); return; }
    if (el.closest('[hidden]') || document.hidden) return;   // the student's page is closed, or the tab is in the background
    const sb = ledgerClient(); if (!sb) { el.innerHTML = ''; return; }
    const { data, error } = await sb.from('saves').select('student_id, now:state->now, subjectTime:state->subjectTime, dayLog:state->dayLog').eq('student_id', student.id).maybeSingle();
    if (!el.isConnected) return;
    if (error) { el.innerHTML = `<div class="card"><h2>🔴 Right now</h2><p class="muted">Couldn’t read ${esc(student.n)}’s town: ${esc(error.message)}</p></div>`; return; }
    const row = data as LiveRow | null, day = subjectDayKey(), now = row?.now;
    const active = !!now?.t && Date.now() - now.t < 3 * 60000;   // the town reports every 15 seconds of active time
    const status = !now?.t ? `${esc(student.n)} hasn’t opened Pet World on this version yet.`
      : active ? `<b>${esc(student.n)} is on:</b> ${esc(now.what || 'Pet World')} <span class="muted">(${agoText(now.t)})</span>`
      : `<span class="muted">${esc(student.n)} isn’t in Pet World right now. Last seen ${agoText(now.t)} on ${esc(now.what || 'Pet World')}.</span>`;
    const today = row ? savedDayHTML({ id: student.id, n: student.n, subjectTime: row.subjectTime || {}, dayLog: row.dayLog || {} }, day) : '';
    el.innerHTML = `<div class="card live-now"><div class="row" style="margin:0; justify-content:space-between; align-items:center"><h2 style="margin:0">${active ? '🟢' : '⚪'} Right now</h2>${alertsButtonHTML()}</div>
      <p style="margin:6px 0">${status}</p>
      <details${active ? ' open' : ''}><summary>Today so far</summary>${today || '<p class="muted">Nothing yet today.</p>'}</details>
      <p class="muted" style="margin:6px 0 0; font-size:.85em">Updates every 20 seconds. Scores here are today’s, from her town; the Ledger tab keeps every day.</p></div>`;
    wireAlertsButton(el);
  }
  void tick();
  timer = setInterval(() => { void tick(); }, 20000);
}

/* ---------- alerts ---------- */
const NOTIFY_KEY = 'pw-teacher-notify';
const notifyOn = () => { try { return localStorage.getItem(NOTIFY_KEY) === '1' && typeof Notification !== 'undefined' && Notification.permission === 'granted'; } catch { return false; } };
function alertsButtonHTML() {
  if (typeof Notification === 'undefined') return '';
  return notifyOn() ? '<button type="button" class="btn small" data-notify="off" title="Stop browser notifications on this device">🔔 Notifications on</button>'
    : '<button type="button" class="btn small" data-notify="on" title="Get a notification on this device when a student finishes a subject or passes a test">🔕 Turn on notifications</button>';
}
function wireAlertsButton(root: HTMLElement) {
  root.querySelector<HTMLButtonElement>('[data-notify]')?.addEventListener('click', async e => {
    const b = e.currentTarget as HTMLButtonElement;
    if (b.dataset.notify === 'off') { try { localStorage.removeItem(NOTIFY_KEY); } catch { /* fine */ } }
    else {
      const p = await Notification.requestPermission();
      if (p === 'granted') { try { localStorage.setItem(NOTIFY_KEY, '1'); } catch { /* fine */ } }
      else showToast('Notifications are blocked for this site. Allow them in the browser’s site settings to get them.');
    }
    b.outerHTML = alertsButtonHTML(); wireAlertsButton(root);
  });
}
function showToast(text: string) {
  let box = document.getElementById('liveToasts');
  if (!box) { box = document.createElement('div'); box.id = 'liveToasts'; box.setAttribute('aria-live', 'polite'); box.style.cssText = 'position:fixed; right:12px; bottom:12px; z-index:50; display:flex; flex-direction:column; gap:8px; max-width:min(380px, calc(100vw - 24px))'; document.body.appendChild(box); }
  const n = document.createElement('div');
  n.className = 'card'; n.style.cssText = 'margin:0; padding:10px 12px; box-shadow:0 6px 18px #0004; cursor:pointer';
  n.textContent = text; n.title = 'Click to close';
  n.addEventListener('click', () => n.remove());
  box.appendChild(n); setTimeout(() => n.remove(), 20000);
}
/* what is worth an alert: a finished plan row, or a quiz or unit test passed */
function alertText(name: string, ev: { k?: string; title?: string; text?: string; kind?: string; mode?: string; passed?: boolean; s?: number; n?: number }) {
  if (ev.k === 'help') return `✋ ${name} has a question (${ev.title || 'Pet World'}): “${String((ev as { q?: string }).q || '')}”`;
  if (ev.k === 'done') return `✅ ${name} finished ${ev.title || 'a plan item'}`;
  if (ev.k === 'outside') return `📎 ${name} added outside work: ${ev.title || ''}${ev.text && /photo/.test(String(ev.text)) ? ' (with photos to review)' : ''}`;
  const test = (ev.k === 'course' && (ev.kind === 'quiz' || ev.kind === 'final')) || (ev.k === 'assess' && (ev.mode === 'quiz' || ev.mode === 'test'));
  if (test && ev.passed) return `🏅 ${name} passed: ${String(ev.text || ev.title || 'a test').replace(/^📚 /, '')}`;
  return '';
}
let alertTimer: ReturnType<typeof setInterval> | null = null, alertClass = '';
const seen: Record<string, number> = {};
/** Start (or keep) the class's alert check. Safe to call on every dashboard refresh. */
export function startAlerts(sb: SupabaseClient, classId: string, students: { id: string; n: string }[]) {
  if (alertClass === classId && alertTimer) return;
  if (alertTimer) clearInterval(alertTimer);
  alertClass = classId;
  const names = new Map(students.map(s => [s.id, s.n])), started = Date.now();
  const tick = async () => {
    if (alertClass !== classId || !names.size) return;
    const { data, error } = await sb.from('saves').select('student_id, dayLog:state->dayLog').in('student_id', [...names.keys()]);
    if (error || alertClass !== classId) return;
    const day = subjectDayKey();
    for (const row of (data || []) as { student_id: string; dayLog: Record<string, SaveDayLog> | null }[]) {
      const events = row.dayLog?.[day]?.events || [], from = seen[row.student_id] ?? started;
      let latest = from;
      for (const ev of events) {
        const t = Number(ev.t) || 0; if (t <= from) continue;
        latest = Math.max(latest, t);
        const text = alertText(names.get(row.student_id) || 'Your student', ev as Parameters<typeof alertText>[1]);
        if (!text) continue;
        showToast(text);
        if (notifyOn()) { try { new Notification('Pet World', { body: text, tag: `${row.student_id}:${t}` }); } catch { /* some phones only allow notifications from an installed app */ } }
      }
      seen[row.student_id] = latest;
    }
  };
  void tick();
  alertTimer = setInterval(() => { void tick(); }, 30000);
}
export function stopAlerts() { if (alertTimer) clearInterval(alertTimer); alertTimer = null; alertClass = ''; }
