/* Teacher app: sign in, manage classes and rosters, print PIN cards, live class dashboard. */
import type { RealtimeChannel } from '@supabase/supabase-js';
import { makeClient } from '../lib/supabase';
import { BUILDINGS, DRILLS, mergeDrillSettings, STATIONS, type DrillSettings } from '../shared/registry';
import { renderClassReport, esc, type StudentReport } from './report';

interface ClassRow { id: string; name: string; join_code: string; min_station: number; drill_settings: Partial<DrillSettings> | null; created_at: string }
interface StudentRow { id: string; display_name: string; pin_plain: string | null; failed_attempts: number; locked_until: string | null }
interface NewPin { name: string; pin: string }

const sb = makeClient('pt-teacher');
const app = document.getElementById('app') as HTMLElement;
const $ = (s: string) => document.querySelector(s) as HTMLElement;

let classes: ClassRow[] = [];
let current: ClassRow | null = null;
let tab: 'dashboard' | 'roster' | 'settings' = 'dashboard';
let channel: RealtimeChannel | null = null;
let reloadTimer: ReturnType<typeof setTimeout> | null = null;
const gameUrl = () => new URL('./', location.href).href;

if (!sb) {
  app.innerHTML = `<div class="card authcard"><h2>Almost there</h2><p>This build has no Supabase settings. Copy <code>.env.example</code> to <code>.env</code>, fill in your project URL and anon key, and rebuild. See the README.</p></div>`;
} else {
  sb.auth.onAuthStateChange((_e, session) => { if (session) void loadClasses(); else renderAuth(); });
}

/* ---------- sign in ---------- */
function renderAuth(msg = '') {
  stopLive();
  app.innerHTML = `<div class="card authcard"><h2>Sign in</h2>
    <label for="email">Email</label><input type="email" id="email" autocomplete="email">
    <label for="pw">Password</label><input type="password" id="pw" autocomplete="current-password">
    <div class="row"><button class="btn primary" id="signIn">Sign in</button><button class="btn" id="signUp">Create an account</button></div>
    <p class="status ${msg ? 'err' : 'muted'}" id="authMsg">${esc(msg)}</p></div>`;
  const creds = () => ({ email: ($('#email') as HTMLInputElement).value.trim(), password: ($('#pw') as HTMLInputElement).value });
  $('#signIn').addEventListener('click', async () => {
    const { error } = await sb!.auth.signInWithPassword(creds());
    if (error) $('#authMsg').textContent = error.message;
  });
  $('#signUp').addEventListener('click', async () => {
    const c = creds();
    if (c.password.length < 8) { $('#authMsg').textContent = 'Use a password with at least 8 characters.'; return; }
    const { data, error } = await sb!.auth.signUp(c);
    $('#authMsg').textContent = error ? error.message : data.session ? '' : 'Check your email to confirm your account, then sign in.';
  });
}

/* ---------- classes ---------- */
async function loadClasses(selectId?: string) {
  const { data, error } = await sb!.from('classes').select('id,name,join_code,min_station,drill_settings,created_at').order('created_at');
  if (error) { renderAuth(error.message); return; }
  classes = (data || []) as ClassRow[];
  current = classes.find(c => c.id === (selectId || current?.id)) || classes[0] || null;
  renderShell();
}
function renderShell() {
  app.innerHTML = `<div class="shell">
    <aside class="side"><h2>Classes</h2>
      ${classes.map(c => `<button class="classbtn ${current && c.id === current.id ? 'on' : ''}" data-id="${c.id}">${esc(c.name)}</button>`).join('') || '<p class="muted" style="margin:4px">No classes yet.</p>'}
      <div class="row"><input type="text" id="newClass" placeholder="New class name, e.g. Period 3" maxlength="60"></div>
      <div class="row"><button class="btn small primary" id="addClass">Add class</button><button class="btn small" id="signOut">Sign out</button></div>
    </aside>
    <section id="main"></section></div>`;
  app.querySelectorAll<HTMLButtonElement>('.classbtn').forEach(b => b.addEventListener('click', () => { current = classes.find(c => c.id === b.dataset.id) || null; renderShell(); }));
  $('#addClass').addEventListener('click', addClass);
  ($('#newClass') as HTMLInputElement).addEventListener('keydown', e => { if (e.key === 'Enter') void addClass(); });
  $('#signOut').addEventListener('click', () => { void sb!.auth.signOut(); });
  renderMain();
}
async function addClass() {
  const name = ($('#newClass') as HTMLInputElement).value.trim(); if (!name) return;
  const { data, error } = await sb!.from('classes').insert({ name }).select('id').single();
  if (error) { alertMain(error.message); return; }
  tab = 'roster'; await loadClasses((data as { id: string }).id);
}
function alertMain(msg: string) { const m = document.getElementById('main'); if (m) m.insertAdjacentHTML('afterbegin', `<p class="err">${esc(msg)}</p>`); }

function renderMain() {
  const main = $('#main');
  if (!current) { stopLive(); main.innerHTML = '<div class="card empty">Add your first class on the left to get a class code.</div>'; return; }
  main.innerHTML = `<div class="tabs">${(['dashboard', 'roster', 'settings'] as const).map(t => `<button class="tab ${tab === t ? 'on' : ''}" data-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
    <span style="flex:1"></span><span class="muted">Class code <b>${esc(current.join_code)}</b></span></div><div id="pane"></div>`;
  main.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab as typeof tab; renderMain(); }));
  if (tab === 'dashboard') void renderDashboard(); else { stopLive(); if (tab === 'roster') void renderRoster(); else renderSettings(); }
}

/* ---------- dashboard (live) ---------- */
async function renderDashboard() {
  const pane = $('#pane'), cls = current!;
  if (!pane.innerHTML) pane.innerHTML = '<p class="muted">Loading…</p>';
  const { data, error } = await sb!.rpc('class_report', { p_class: cls.id });
  if (current?.id !== cls.id || tab !== 'dashboard') return;
  if (error) { pane.innerHTML = `<p class="err">${esc(error.message)}</p>`; return; }
  pane.innerHTML = `<p class="live noprint"><i></i>Live. Updates as students finish problems. Last updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.</p><div id="report"></div>`;
  renderClassReport($('#report'), (data || []) as StudentReport[], saveStudentDrills);
  startLive(cls.id);
}
async function saveStudentDrills(id: string, settings: Partial<DrillSettings> | null) {
  const { error } = await sb!.from('students').update({ drill_settings: settings }).eq('id', id);
  if (error) throw error;
}
function startLive(classId: string) {
  if (channel && channel.topic.endsWith(classId)) return;
  stopLive();
  channel = sb!.channel('class-' + classId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'problems', filter: `class_id=eq.${classId}` }, () => {
      if (reloadTimer) clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => { if (tab === 'dashboard' && current?.id === classId) void renderDashboard(); }, 3000);
    })
    .subscribe();
}
function stopLive() { if (channel) { void sb?.removeChannel(channel); channel = null; } }

/* ---------- roster and PIN cards ---------- */
async function renderRoster(newPins: NewPin[] = []) {
  const pane = $('#pane'), cls = current!;
  const { data, error } = await sb!.from('students').select('id,display_name,pin_plain,failed_attempts,locked_until').eq('class_id', cls.id).order('display_name');
  if (error) { pane.innerHTML = `<p class="err">${esc(error.message)}</p>`; return; }
  const students = (data || []) as StudentRow[];
  pane.innerHTML = `
    ${newPins.length ? `<div class="card"><h2>New PINs</h2><p class="muted" style="margin-top:0">PINs are shown only now. Print the cards before leaving this page. You can reset a PIN any time.</p>
      <div class="cards">${newPins.map(p => pinCard(p.name, p.pin)).join('')}</div><div class="row"><button class="btn primary" id="printCards">Print PIN cards</button></div></div>` : ''}
    <div class="two">
      <div class="card"><h2>Add students</h2><p class="muted" style="margin-top:0">One per line. First name and last initial works well (Maya M.). No emails needed.</p>
        <textarea id="names" style="font-family:inherit; font-size:.95rem; min-height:160px" placeholder="Maya M.&#10;Ben T.&#10;Carmen R."></textarea>
        <div class="row"><button class="btn primary" id="addNames">Add and make PINs</button></div><p class="status" id="rosterMsg"></p></div>
      <div class="card"><h2>Roster (${students.length})</h2>
        ${students.length ? `<div class="row roster-tools"><button class="btn small" id="copyClassList" data-label="Copy class list">Copy class list</button><button class="btn small" id="printAllCards">Print all PIN cards</button></div><textarea id="classListFallback" class="copy-fallback" hidden readonly aria-label="Class list to copy"></textarea><table class="steptable"><thead><tr><th>Student</th><th>PIN</th><th></th></tr></thead><tbody>${students.map(s => `<tr><td>${esc(s.display_name)}${s.locked_until && new Date(s.locked_until) > new Date() ? ' <span class="tag" style="background:var(--work)">locked</span>' : ''}</td><td>${s.pin_plain ? `<span class="pin">${esc(s.pin_plain)}</span>` : '<span class="muted">(click New PIN to show)</span>'}</td>
          <td style="text-align:right"><button class="btn small" data-reset="${s.id}" data-name="${esc(s.display_name)}">New PIN</button> <button class="btn small" data-del="${s.id}">Remove</button></td></tr>`).join('')}</tbody></table>`
          : '<p class="muted">No students yet.</p>'}
      </div></div>`;
  $('#addNames').addEventListener('click', async () => {
    const names = ($('#names') as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!names.length) return;
    const { data: made, error: e2 } = await sb!.rpc('add_students', { p_class: cls.id, p_names: names });
    if (e2) { $('#rosterMsg').textContent = e2.message; return; }
    const rows = (made || []) as { out_name: string; out_pin: string }[];
    const skipped = names.length - rows.length;
    await renderRoster(rows.map(r => ({ name: r.out_name, pin: r.out_pin })));
    if (skipped > 0) $('#rosterMsg').textContent = `${skipped} name${skipped === 1 ? ' was' : 's were'} already on the roster.`;
  });
  pane.querySelectorAll<HTMLButtonElement>('[data-reset]').forEach(b => b.addEventListener('click', async () => {
    const { data: pin, error: e3 } = await sb!.rpc('reset_pin', { p_student: b.dataset.reset });
    if (e3) { alertMain(e3.message); return; }
    await renderRoster([{ name: b.dataset.name || '', pin: String(pin) }]);
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-del]').forEach(b => {
    let armed = false;
    b.addEventListener('click', async () => {
      if (!armed) { armed = true; b.textContent = 'Click again: erases their progress'; setTimeout(() => { armed = false; b.textContent = 'Remove'; }, 4000); return; }
      const { error: e4 } = await sb!.from('students').delete().eq('id', b.dataset.del);
      if (e4) alertMain(e4.message); else void renderRoster();
    });
  });
  const pb = document.getElementById('printCards');
  if (pb) pb.addEventListener('click', () => printCards(newPins));
  const copyClassList = document.getElementById('copyClassList');
  if (copyClassList) copyClassList.addEventListener('click', () => { void copyText(classListText(cls, students), copyClassList as HTMLButtonElement, $('#classListFallback') as HTMLTextAreaElement); });
  const printAll = document.getElementById('printAllCards');
  if (printAll) printAll.addEventListener('click', () => printCards(students.filter(s => s.pin_plain).map(s => ({name:s.display_name, pin:s.pin_plain!}))));
}
function classListText(cls: ClassRow, students: StudentRow[]) {
  return [`Pet Town — ${cls.name}`, `Go to: ${gameUrl()}`, `Class code: ${cls.join_code}`, '', ...students.map(s => `${s.display_name} — PIN ${s.pin_plain || '(click New PIN to show)'}`)].join('\n');
}
async function copyText(text: string, button: HTMLButtonElement, fallback: HTMLTextAreaElement) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied!'; setTimeout(() => { button.textContent = button.dataset.label || 'Copy'; }, 2000);
  } catch {
    fallback.hidden = false; fallback.value = text; fallback.focus(); fallback.select(); button.textContent = 'Select text';
  }
}
function pinCard(name: string, pin: string) {
  return `<div class="pincard"><div class="muted">${esc(current!.name)}</div><div class="nm">${esc(name)}</div>
    <div>Class code <b>${esc(current!.join_code)}</b></div><div>PIN <span class="pin">${esc(pin)}</span></div><div class="muted" style="word-break:break-all">${esc(gameUrl())}</div></div>`;
}
function printCards(pins: NewPin[]) {
  const area = $('#printArea');
  area.innerHTML = `<div class="cards">${pins.map(p => pinCard(p.name, p.pin)).join('')}</div>`;
  document.body.classList.add('print-cards');
  window.addEventListener('afterprint', () => { document.body.classList.remove('print-cards'); area.innerHTML = ''; }, { once: true });
  window.print();
}

/* ---------- class settings ---------- */
function renderSettings() {
  const pane = $('#pane'), cls = current!;
  const settings = mergeDrillSettings(cls.drill_settings);
  const openUnits = new Set(BUILDINGS.filter(b => b.open).map(b => b.id));
  const drillTypes = Object.entries(DRILLS).filter(([, drill]) => drill.unit === 'all' || openUnits.has(drill.unit));
  pane.innerHTML = `<div class="two">
    <div class="card"><h2>How students join</h2>
      <p>1. Go to <a href="${esc(gameUrl())}" target="_blank" rel="noopener">${esc(gameUrl())}</a></p>
      <p>2. Type the class code:</p><p class="joincode">${esc(cls.join_code)}</p>
      <p>3. Pick their name and type their 4-digit PIN.</p>
      <p class="muted">Signing in on a new computer brings their town with them.</p><div class="row"><button class="btn small" id="copyJoin" data-label="Copy join instructions">Copy join instructions</button></div><textarea id="joinFallback" class="copy-fallback" hidden readonly aria-label="Join instructions to copy"></textarea></div>
    <div class="card"><h2>Class settings</h2>
      <label for="cName">Class name</label><input type="text" id="cName" maxlength="60" value="${esc(cls.name)}">
      <label for="cStation">Unlock the café through</label>
      <select id="cStation">${STATIONS.map(s => `<option value="${s.id}" ${s.id === cls.min_station ? 'selected' : ''}>Station ${s.id}: ${esc(s.name)}</option>`).join('')}</select>
      <p class="muted">Later stations still open on their own after 6 orders at the one before.</p>
      <div class="row"><button class="btn primary" id="saveCls">Save</button><span class="status" id="setMsg"></span></div>
      <h2 style="margin-top:20px">Delete class</h2><p class="muted" style="margin-top:0">Removes the roster and all progress for this class.</p>
      <button class="btn small" id="delCls">Delete this class</button></div>
    <div class="card"><h2>Practice pop-ups</h2>
      <label><input type="checkbox" id="drillEnabled" ${settings.enabled ? 'checked' : ''}> Enable practice pop-ups</label>
      <h3>Drill types</h3>${drillTypes.map(([type, drill]) => `<label><input type="checkbox" data-drill-type="${type}" ${settings.types[type] === false ? '' : 'checked'}> ${esc(drill.name)}</label>`).join('')}
      <h3>Triggers</h3>
      <label><input type="checkbox" id="triggerMiss" ${settings.triggers.miss ? 'checked' : ''}> Missed answer</label>
      <label><input type="checkbox" id="triggerSlow" ${settings.triggers.slow ? 'checked' : ''}> Slow answer</label>
      <label><input type="checkbox" id="triggerSprint" ${settings.triggers.sprint ? 'checked' : ''}> End of sprint</label>
      <h3>Slow timing</h3>
      <label for="slowMode">Mode</label><select id="slowMode"><option value="adaptive" ${settings.slow.mode === 'adaptive' ? 'selected' : ''}>Adaptive</option><option value="fixed" ${settings.slow.mode === 'fixed' ? 'selected' : ''}>Fixed</option></select>
      <label for="slowIdea">Idea seconds</label><input id="slowIdea" type="number" min="5" max="60" step="1" value="${settings.slow.idea}">
      <label for="slowArith">Arithmetic seconds</label><input id="slowArith" type="number" min="5" max="60" step="1" value="${settings.slow.arith}">
      <label for="slowSprint">Sprint seconds</label><input id="slowSprint" type="number" min="3" max="20" step="1" value="${settings.slow.sprint}">
      <label for="readSeconds">Reading time before the tip timer starts</label><input id="readSeconds" type="number" min="0" max="20" step="1" value="${settings.readSeconds}">
      <label for="maxPerShift">Max pop-ups per shift</label><input id="maxPerShift" type="number" min="1" max="5" step="1" value="${settings.maxPerShift}">
      <div class="row"><button class="btn primary" id="saveDrills">Save</button><button class="btn" id="resetDrills">Reset to defaults</button><span class="status" id="drillMsg"></span></div>
    </div></div>`;
  $('#saveCls').addEventListener('click', async () => {
    const name = ($('#cName') as HTMLInputElement).value.trim(), min_station = +($('#cStation') as HTMLSelectElement).value;
    const { error } = await sb!.from('classes').update({ name, min_station }).eq('id', cls.id);
    if (error) { $('#setMsg').textContent = error.message; return; }
    await loadClasses(cls.id);
  });
  $('#copyJoin').addEventListener('click', () => { void copyText(`Go to: ${gameUrl()}\nClass code: ${cls.join_code}`, $('#copyJoin') as HTMLButtonElement, $('#joinFallback') as HTMLTextAreaElement); });
  $('#saveDrills').addEventListener('click', async () => {
    const types: Record<string, boolean> = {};
    pane.querySelectorAll<HTMLInputElement>('[data-drill-type]').forEach(input => { types[input.dataset.drillType!] = input.checked; });
    const drill_settings: DrillSettings = {
      enabled: ($('#drillEnabled') as HTMLInputElement).checked,
      types,
      triggers: {
        miss: ($('#triggerMiss') as HTMLInputElement).checked,
        slow: ($('#triggerSlow') as HTMLInputElement).checked,
        sprint: ($('#triggerSprint') as HTMLInputElement).checked
      },
      slow: {
        mode: ($('#slowMode') as HTMLSelectElement).value as 'fixed' | 'adaptive',
        idea: +($('#slowIdea') as HTMLInputElement).value,
        arith: +($('#slowArith') as HTMLInputElement).value,
        sprint: +($('#slowSprint') as HTMLInputElement).value
      },
      readSeconds: +($('#readSeconds') as HTMLInputElement).value,
      timeScale: settings.timeScale,
      maxPerShift: +($('#maxPerShift') as HTMLInputElement).value
    };
    const { error } = await sb!.from('classes').update({ drill_settings: mergeDrillSettings(drill_settings) }).eq('id', cls.id);
    if (error) { $('#drillMsg').textContent = error.message; return; }
    await loadClasses(cls.id);
  });
  $('#resetDrills').addEventListener('click', async () => {
    const { error } = await sb!.from('classes').update({ drill_settings: {} }).eq('id', cls.id);
    if (error) { $('#drillMsg').textContent = error.message; return; }
    await loadClasses(cls.id);
  });
  let armed = false;
  $('#delCls').addEventListener('click', async e => {
    const b = e.currentTarget as HTMLButtonElement;
    if (!armed) { armed = true; b.textContent = `Click again to delete ${cls.name}`; setTimeout(() => { armed = false; b.textContent = 'Delete this class'; }, 5000); return; }
    const { error } = await sb!.from('classes').delete().eq('id', cls.id);
    if (error) { $('#setMsg').textContent = error.message; return; }
    current = null; tab = 'dashboard'; await loadClasses();
  });
}
