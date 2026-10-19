/* Teacher app: sign in, manage classes and rosters, print PIN cards, live class dashboard. */
import type { RealtimeChannel } from '@supabase/supabase-js';
import { makeClient } from '../lib/supabase';
import { installLanguage, type Language } from '../shared/language';
import { BRAIN_GAMES, brainSettings, type BrainSettings } from '../shared/brainGames';
import { THEME_DAYS, SPECIAL_DAYS, themeSettings, type ThemeSettings } from '../shared/themeDays';
import { MOVES, MOVES_PER_BREAK, MOVE_SECONDS, MOVE_MINUTES_MAX, moveSettings, type MoveSettings } from '../shared/moveBreaks';
import { BUILDINGS, SHOPS, DRILLS, ARCADE_GAMES, arcadeSettings, prevBuilding, builtHoods, validHood, DEFAULT_HOME, QUIZ_DEFAULTS, quizSettings, mergeDrillSettings, STATIONS, type ArcadeSettings, type DrillSettings, type QuizSettings } from '../shared/registry';
import { renderClassReport, setReportClass, esc, type StudentReport } from './report';
import { setLedgerClass } from './ledger';
import { renderApprovals, waitingCount } from './approvals';
import { renderVocabTab, type VocabRoster, type ClassVocab } from './vocab';
import { renderLessons, sumQuestionStats, type LessonLink, type QuestionEdits, type QuestionStats, type KhanData, type KhanResults, type RosterRow } from './lessons';

interface ClassRow { id: string; name: string; join_code: string; min_station: number; drill_settings: Partial<DrillSettings> | null; quiz_settings: Partial<QuizSettings> | null; game_settings: { openUnits?: string[]; allowMusic?: boolean; [key: string]: unknown } | null; lesson_links?: Record<string, LessonLink> | null; question_edits?: QuestionEdits | null; created_at: string }
interface StudentRow { id: string; display_name: string; pin_plain: string | null; failed_attempts: number; locked_until: string | null }
interface NewPin { name: string; pin: string }

const sb = makeClient('pt-teacher');
const app = document.getElementById('app') as HTMLElement;
const $ = (s: string) => document.querySelector(s) as HTMLElement;
let teacherLanguage: Language = 'en';
try { teacherLanguage = localStorage.getItem('pettown:teacher-language') === 'es' ? 'es' : 'en'; } catch {}
const refreshLanguage = installLanguage(document.body, () => teacherLanguage);
document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === teacherLanguage)));
document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-language]');
  if (!button || !['en','es'].includes(button.dataset.language || '')) return;
  teacherLanguage = button.dataset.language as Language;
  try { localStorage.setItem('pettown:teacher-language', teacherLanguage); } catch {}
  refreshLanguage();
  document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach(control => control.setAttribute('aria-pressed', String(control.dataset.language === teacherLanguage)));
});

let classes: ClassRow[] = [];
let current: ClassRow | null = null;
let tab: 'dashboard' | 'roster' | 'settings' | 'lessons' | 'vocab' | 'setup' = 'dashboard';
let isAdmin = false, adminView = false, waitingN = 0;   // the Approvals page, for accounts in app_admins (ROADMAP F4)
let channel: RealtimeChannel | null = null;
let reloadTimer: ReturnType<typeof setTimeout> | null = null;
const gameUrl = () => new URL('./', location.href).href;
/* the student side with a class code filled in (the game reads ?code=) */
const studentViewUrl = (code: string) => `${gameUrl()}?code=${encodeURIComponent(code)}`;
/* a class made from now on starts with these (existing classes keep what they have) */
const NEW_CLASS_SETTINGS = { brain: { enabled: true }, move: { enabled: true }, themes: { enabled: true } };

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
    $('#authMsg').textContent = error ? error.message : data.session ? '' : 'Check your email to confirm your account, then sign in. New accounts are approved by hand before they can make a class.';
  });
}

/* ---------- waiting for approval ---------- */
async function renderWaiting() {
  stopLive();
  const email = (await sb!.auth.getUser()).data.user?.email || 'Your account';
  app.innerHTML = `<div class="card authcard"><h2>Waiting for approval</h2>
    <p>Thanks for signing up! <b>${esc(email)}</b> is waiting to be approved before it can make a class.</p>
    <p class="muted">You'll get in as soon as it's approved. Check back later, or tap Check again.</p>
    <div class="row"><button class="btn primary" id="checkAgain">Check again</button><button class="btn" id="signOut">Sign out</button></div>
    <p class="status muted" id="authMsg"></p></div>`;
  $('#checkAgain').addEventListener('click', () => { $('#authMsg').textContent = 'Checking…'; void loadClasses(); });
  $('#signOut').addEventListener('click', () => { void sb!.auth.signOut(); });
}

/* ---------- classes ---------- */
async function loadClasses(selectId?: string) {
  /* a new parent account waits for the owner's approval: is_approved_parent() in Supabase gates every classes policy.
     If the function can't be called (older database), carry on as before. (ROADMAP F4) */
  const approved = await sb!.rpc('is_approved_parent');
  if (!approved.error && approved.data !== true) { void renderWaiting(); return; }
  const admin = await sb!.rpc('is_app_admin');   // before the approvals migration this errors, and the page stays hidden
  isAdmin = !admin.error && admin.data === true; waitingN = isAdmin ? await waitingCount(sb!) : 0;
  /* lesson_links and question_edits come from the lesson-content migration; until it is run, load the classes without them */
  const withLessons: string = 'id,name,join_code,min_station,drill_settings,quiz_settings,game_settings,lesson_links,question_edits,created_at';
  const full = await sb!.from('classes').select(withLessons).order('created_at');
  const { data, error } = full.error && /lesson_links|question_edits/.test(full.error.message) ? await sb!.from('classes').select('id,name,join_code,min_station,drill_settings,quiz_settings,game_settings,created_at').order('created_at') : full;
  if (error) { renderAuth(error.message); return; }
  classes = (data || []) as ClassRow[];
  current = classes.find(c => c.id === (selectId || current?.id)) || classes[0] || null;
  renderShell();
}
function renderShell() {
  app.innerHTML = `<div class="shell">
    <aside class="side"><h2>Classes</h2>
      ${classes.map(c => `<button class="classbtn ${!adminView && current && c.id === current.id ? 'on' : ''}" data-id="${c.id}">${esc(c.name)}</button>`).join('') || '<p class="muted" style="margin:4px">No classes yet.</p>'}
      ${isAdmin ? `<button class="classbtn ${adminView ? 'on' : ''}" id="approvalsBtn">${approvalsLabel()}</button>` : ''}
      <div class="row"><input type="text" id="newClass" placeholder="New class name, e.g. Period 3" maxlength="60"></div>
      <div class="row"><button class="btn small primary" id="addClass">Add class</button><button class="btn small" id="signOut">Sign out</button></div>
    </aside>
    <section id="main"></section></div>`;
  app.querySelectorAll<HTMLButtonElement>('.classbtn[data-id]').forEach(b => b.addEventListener('click', () => { adminView = false; current = classes.find(c => c.id === b.dataset.id) || null; renderShell(); }));
  document.getElementById('approvalsBtn')?.addEventListener('click', () => { adminView = true; renderShell(); });
  $('#addClass').addEventListener('click', addClass);
  ($('#newClass') as HTMLInputElement).addEventListener('keydown', e => { if (e.key === 'Enter') void addClass(); });
  $('#signOut').addEventListener('click', () => { void sb!.auth.signOut(); });
  renderMain();
}
async function addClass() {
  const name = ($('#newClass') as HTMLInputElement).value.trim(); if (!name) return;
  const { data, error } = await sb!.from('classes').insert({ name, game_settings: NEW_CLASS_SETTINGS }).select('id').single();
  if (error) { alertMain(error.message); return; }
  tab = 'setup'; await loadClasses((data as { id: string }).id);   // a new class starts on the setup menu
}
function alertMain(msg: string) { const m = document.getElementById('main'); if (m) m.insertAdjacentHTML('afterbegin', `<p class="err">${esc(msg)}</p>`); }

const approvalsLabel = () => `🔑 Approvals${waitingN ? ` <span class="tag a">${waitingN} waiting</span>` : ''}`;
function renderMain() {
  const main = $('#main');
  if (adminView && isAdmin) {
    stopLive(); main.innerHTML = '<div id="pane"></div>';
    void renderApprovals($('#pane'), sb!, async () => { waitingN = await waitingCount(sb!); const b = document.getElementById('approvalsBtn'); if (b) b.innerHTML = approvalsLabel(); });
    return;
  }
  if (!current) { stopLive(); main.innerHTML = '<div class="card empty">Add your first class on the left to get a class code.</div>'; return; }
  main.innerHTML = `<div class="tabs">${(['dashboard', 'roster', 'settings', 'lessons', 'vocab'] as const).map(t => `<button class="tab ${tab === t ? 'on' : ''}" data-tab="${t}">${t === 'lessons' ? 'Lessons &amp; questions' : t === 'vocab' ? 'Vocabulary' : t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
    <span style="flex:1"></span><a class="btn small" href="${esc(studentViewUrl(current.join_code))}" target="_blank" rel="noopener" title="Opens Pet World with this class code filled in">🐾 Student view</a><span class="muted">Class code <b>${esc(current.join_code)}</b></span></div><div id="pane"></div>`;
  main.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab as typeof tab; renderMain(); }));
  if (tab === 'dashboard') void renderDashboard(); else { stopLive(); if (tab === 'roster') void renderRoster(); else if (tab === 'lessons') renderLessonsTab(); else if (tab === 'vocab') renderVocabularyTab(); else if (tab === 'setup') renderSetup(); else renderSettings(); }
}

/* ---------- dashboard (live) ---------- */
async function renderDashboard() {
  const pane = $('#pane'), cls = current!;
  if (!pane.innerHTML) pane.innerHTML = '<p class="muted">Loading…</p>';
  const { data, error } = await sb!.rpc('class_report', { p_class: cls.id, p_tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
  if (current?.id !== cls.id || tab !== 'dashboard') return;
  if (error) { pane.innerHTML = `<p class="err">${esc(error.message)}</p>`; return; }
  const reports = (data || []) as StudentReport[];
  const ids = reports.map(student => student.id);
  const {data:saves, error:saveError} = ids.length ? await sb!.from('saves').select('student_id,state').in('student_id', ids) : {data:[], error:null};
  if (current?.id !== cls.id || tab !== 'dashboard') return;
  const savedByStudent = new Map<string, Record<string, unknown>>();
  (saves || []).forEach(row => { if (row.state && typeof row.state === 'object') savedByStudent.set(row.student_id, row.state as Record<string, unknown>); });
  reports.forEach(student => {
    const state = savedByStudent.get(student.id);
    student.readingBooks = Array.isArray(state?.readingBooks) ? state.readingBooks as NonNullable<StudentReport['readingBooks']> : [];
    student.elaProgress = state?.elaProgress && typeof state.elaProgress === 'object' ? state.elaProgress as NonNullable<StudentReport['elaProgress']> : {};
    student.historyProgress = state?.historyProgress && typeof state.historyProgress === 'object' ? state.historyProgress as NonNullable<StudentReport['historyProgress']> : {};
    student.historyProjects = state?.historyProjects && typeof state.historyProjects === 'object' ? state.historyProjects as NonNullable<StudentReport['historyProjects']> : {};
    student.scienceProgress = state?.scienceProgress && typeof state.scienceProgress === 'object' ? state.scienceProgress as NonNullable<StudentReport['scienceProgress']> : {};
    student.scienceProjects = state?.scienceProjects && typeof state.scienceProjects === 'object' ? state.scienceProjects as NonNullable<StudentReport['scienceProjects']> : {};
    student.writtenAnswers = Array.isArray(state?.writtenAnswers) ? state.writtenAnswers as NonNullable<StudentReport['writtenAnswers']> : [];
    student.mathThink = state?.mathThink && typeof state.mathThink === 'object' ? state.mathThink as NonNullable<StudentReport['mathThink']> : {};
    student.subjectTime = state?.subjectTime && typeof state.subjectTime === 'object' ? state.subjectTime as NonNullable<StudentReport['subjectTime']> : {};
    student.dayLog = state?.dayLog && typeof state.dayLog === 'object' ? state.dayLog as NonNullable<StudentReport['dayLog']> : {};   // the last 14 days in detail (the 📅 Ledger tab)
    student.brain = state?.brain ?? null;   // brain stretches (the 🧠 Brain tab)
    student.brainOn = brainSettings(cls.game_settings?.brain as Partial<BrainSettings> | undefined);
  });
  pane.innerHTML = `<p class="live noprint"><i></i>Live. Updates as students finish problems, quizzes, and tests. Last updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.</p>${saveError ? '<p class="err">English and Reading Log data could not be loaded.</p>' : ''}<div id="report"></div>`;
  setReportClass(cls.id, cls.game_settings?.home, cls.game_settings?.khan, cls.game_settings?.requireThink);
  setLedgerClass(sb, cls.id);
  renderClassReport($('#report'), reports, saveStudentDrills, async (id, clearHistory) => { await resetStudent(id, clearHistory); await renderDashboard(); const student = reports.find(row => row.id === id); alertMain(`${student?.n || 'Student'} was reset.`); }, saveQuizOverride);
  startLive(cls.id);
}
async function saveStudentDrills(id: string, settings: Partial<DrillSettings> | null) {
  const { error } = await sb!.from('students').update({ drill_settings: settings }).eq('id', id);
  if (error) throw error;
}
async function saveQuizOverride(id: string, overrides: Record<string, string> | null) {
  const { error } = await sb!.from('students').update({ quiz_overrides: overrides }).eq('id', id);
  if (error) throw error;
}
async function resetStudent(id: string, clearHistory: boolean) {
  const { error } = await sb!.rpc('reset_student', { p_student: id, p_clear_history: clearHistory });
  if (error) throw error;
}
function startLive(classId: string) {
  if (channel && channel.topic.endsWith(classId)) return;
  stopLive();
  const refresh = () => {
    if (reloadTimer) clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => { if (tab === 'dashboard' && current?.id === classId) void renderDashboard(); }, 3000);
  };
  channel = sb!.channel('class-' + classId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'problems', filter: `class_id=eq.${classId}` }, refresh)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assessments', filter: `class_id=eq.${classId}` }, refresh)
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
          <td style="text-align:right"><button class="btn small" data-reset="${s.id}" data-name="${esc(s.display_name)}">New PIN</button> <button class="btn small" data-reset-student="${s.id}" data-name="${esc(s.display_name)}">Reset</button> <button class="btn small" data-del="${s.id}">Remove</button></td></tr><tr data-reset-row="${s.id}" hidden><td colspan="3"><div class="reset-panel" data-reset-panel="${s.id}"></div></td></tr>`).join('')}</tbody></table>`
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
  pane.querySelectorAll<HTMLButtonElement>('[data-reset-student]').forEach(b => b.addEventListener('click', () => {
    const row = pane.querySelector(`[data-reset-row="${b.dataset.resetStudent}"]`) as HTMLElement;
    showResetPanel(row.querySelector('.reset-panel') as HTMLElement, b.dataset.resetStudent!, b.dataset.name || '', async clearHistory => {
      await resetStudent(b.dataset.resetStudent!, clearHistory); await renderRoster(); $('#rosterMsg').textContent = `${b.dataset.name || 'Student'} was reset.`;
    });
  }));
  const pb = document.getElementById('printCards');
  if (pb) pb.addEventListener('click', () => printCards(newPins));
  const copyClassList = document.getElementById('copyClassList');
  if (copyClassList) copyClassList.addEventListener('click', () => { void copyText(classListText(cls, students), copyClassList as HTMLButtonElement, $('#classListFallback') as HTMLTextAreaElement); });
  const printAll = document.getElementById('printAllCards');
  if (printAll) printAll.addEventListener('click', () => printCards(students.filter(s => s.pin_plain).map(s => ({name:s.display_name, pin:s.pin_plain!}))));
}
function showResetPanel(host: HTMLElement, id: string, name: string, onReset: (clearHistory: boolean) => Promise<void>) {
  const row = host.closest('[data-reset-row]') as HTMLElement;
  row.hidden = false;
  host.innerHTML = `<strong>Reset ${esc(name)}?</strong><p>Reset town clears the town but keeps learning history. Reset everything also erases learning history.</p><div class="row"><button class="btn small primary" data-reset-town>Reset town</button><button class="btn small" data-reset-all>Reset everything</button><button class="btn small" data-reset-cancel>Cancel</button></div><p class="status" data-reset-status></p>`;
  let armed = false, armTimer: ReturnType<typeof setTimeout> | null = null;
  const finish = async (clearHistory: boolean) => {
    host.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = true; });
    try { await onReset(clearHistory); } catch (error) { const status = host.querySelector('[data-reset-status]') as HTMLElement; status.textContent = String(error); host.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = false; }); }
  };
  host.querySelector('[data-reset-town]')?.addEventListener('click', () => { void finish(false); });
  host.querySelector('[data-reset-all]')?.addEventListener('click', e => {
    const button = e.currentTarget as HTMLButtonElement;
    if (!armed) { armed = true; button.textContent = `Click again to erase all of ${name}'s history`; armTimer = setTimeout(() => { armed = false; button.textContent = 'Reset everything'; }, 5000); return; }
    if (armTimer) clearTimeout(armTimer); void finish(true);
  });
  host.querySelector('[data-reset-cancel]')?.addEventListener('click', () => { if (armTimer) clearTimeout(armTimer); row.hidden = true; host.innerHTML = ''; });
}
function classListText(cls: ClassRow, students: StudentRow[]) {
  return [`Pet World — ${cls.name}`, `Go to: ${gameUrl()}`, `Class code: ${cls.join_code}`, '', ...students.map(s => `${s.display_name} — PIN ${s.pin_plain || '(click New PIN to show)'}`)].join('\n');
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

/* ---------- lessons & questions (src/teacher/lessons.ts) ---------- */
/* per class: the miss-rate tallies and the Khan-check roster, from the students' saves, plus classes.khan_results */
interface LessonExtras { stats: QuestionStats | null; khan: KhanData }
const lessonExtrasCache = new Map<string, LessonExtras>();
function renderLessonsTab() {
  const cls = current!;
  const draw = () => { const extras = lessonExtrasCache.get(cls.id); renderLessons($('#pane'), cls, classes.filter(c => c.id !== cls.id), async (id, patch) => {
    const { error } = await sb!.from('classes').update(patch).eq('id', id);
    return error ? error.message : null;
  }, () => loadClasses(cls.id), extras?.stats, extras?.khan); };
  draw();
  void loadLessonExtras(cls.id).then(extras => {
    const shape = (x?: LessonExtras) => JSON.stringify(x ? [x.stats, x.khan.roster, x.khan.results] : 'none');
    const before = shape(lessonExtrasCache.get(cls.id));
    lessonExtrasCache.set(cls.id, extras);
    if (current?.id === cls.id && tab === 'lessons' && shape(extras) !== before) draw();
  });
}
/* Only the parts of each save that this tab needs are fetched (question tallies and unit test progress), not the whole town. */
async function loadLessonExtras(classId: string): Promise<LessonExtras> {
  const saveKhan = async (next: KhanResults) => {
    const { error } = await sb!.from('classes').update({ khan_results: next }).eq('id', classId);
    if (error) return error.message;
    const cached = lessonExtrasCache.get(classId); if (cached) cached.khan.results = next;
    return null;
  };
  /* review marks go in the student's quiz_overrides (review:<course>:<lesson> = when the Khan result was logged), which the game already receives */
  const saveReviews = async (studentId: string, courseId: string, reviews: Record<string, number>) => {
    const { data, error } = await sb!.from('students').select('quiz_overrides').eq('id', studentId).single();
    if (error) return error.message;
    const current = ((data as { quiz_overrides?: Record<string, string> | null } | null)?.quiz_overrides) || {};
    const next = Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`review:${courseId}:`)));
    for (const [skill, at] of Object.entries(reviews)) next[`review:${courseId}:${skill}`] = String(at);
    const { error: saveError } = await sb!.from('students').update({ quiz_overrides: Object.keys(next).length ? next : null }).eq('id', studentId);
    return saveError ? saveError.message : null;
  };
  const khanRow = await sb!.from('classes').select('khan_results').eq('id', classId).single();
  const results: KhanResults | null = khanRow.error ? null : ((khanRow.data as { khan_results?: KhanResults } | null)?.khan_results || {});
  const { data: kids, error } = await sb!.from('students').select('id,display_name').eq('class_id', classId).order('display_name');
  if (error) return { stats: null, khan: { roster: null, results, save: saveKhan, saveReviews } };
  const list = (kids || []) as { id: string; display_name: string }[];
  if (!list.length) return { stats: { students: 0, byId: {} }, khan: { roster: [], results, save: saveKhan, saveReviews } };
  const { data, error: saveError } = await sb!.from('saves')
    .select('student_id, qs:state->questionStats, ela:state->elaProgress, hist:state->historyProgress, sci:state->scienceProgress').in('student_id', list.map(k => k.id));
  if (saveError) return { stats: null, khan: { roster: null, results, save: saveKhan, saveReviews } };
  type Row = { student_id: string; qs?: unknown; ela?: unknown; hist?: unknown; sci?: unknown };
  const rows = (data || []) as Row[], byStudent = new Map(rows.map(row => [row.student_id, row]));
  const obj = (v: unknown) => v && typeof v === 'object' ? v as RosterRow['progress'][string] : undefined;
  const roster: RosterRow[] = list.map(k => { const row = byStudent.get(k.id);
    return { id: k.id, name: k.display_name, progress: { elaProgress: obj(row?.ela), historyProgress: obj(row?.hist), scienceProgress: obj(row?.sci) } }; });
  return { stats: sumQuestionStats(rows.map(row => row.qs)), khan: { roster, results, save: saveKhan, saveReviews } };
}

/* ---------- vocabulary (docs: VOCAB.md): the class list is saved in classes.game_settings.vocab ---------- */
function renderVocabularyTab() {
  const cls = current!;
  const save = async (vocab: ClassVocab) => {
    const game_settings = { ...(cls.game_settings || {}), vocab };
    const { error } = await sb!.from('classes').update({ game_settings }).eq('id', cls.id);
    if (!error) cls.game_settings = game_settings;
    return error ? error.message : null;
  };
  let roster: VocabRoster;
  const draw = () => { if (current?.id === cls.id && tab === 'vocab') renderVocabTab($('#pane'), cls, save, roster); };
  draw();
  void (async () => {
    const { data: kids, error } = await sb!.from('students').select('id,display_name').eq('class_id', cls.id).order('display_name');
    if (error) { roster = null; draw(); return; }
    const list = (kids || []) as { id: string; display_name: string }[];
    const { data, error: saveError } = list.length ? await sb!.from('saves').select('student_id, vocab:state->vocab').in('student_id', list.map(k => k.id)) : { data: [], error: null };
    if (saveError) { roster = null; draw(); return; }
    const byStudent = new Map(((data || []) as { student_id: string; vocab?: { stats?: Record<string, { r: number[] }>; flagged?: { w: string; ctx?: string }[] } }[]).map(row => [row.student_id, row.vocab || {}]));
    roster = list.map(k => ({ name: k.display_name, stats: byStudent.get(k.id)?.stats || {}, flagged: Array.isArray(byStudent.get(k.id)?.flagged) ? byStudent.get(k.id)!.flagged! : [] }));
    draw();
  })();
}

/* ---------- quick setup (shown after a class is made, and from Settings) ----------
   Every on/off choice for the class on one page, with what each one does. It saves into the same game_settings
   that Settings uses, so the two always agree; the finer controls (units, stations, ticket rules) stay in Settings. */
interface SetupChoice { id: string; emoji: string; name: string; what: string; on: (g: ClassRow['game_settings']) => boolean }
const SETUP_CHOICES: SetupChoice[] = [
  { id: 'brain', emoji: '🧠', name: 'Brain stretches', what: '3 short brain games each morning and after each subject on the daily plan. Results go to each student’s 🧠 Brain tab.', on: g => brainSettings(g?.brain as Partial<BrainSettings> | undefined).enabled },
  { id: 'move', emoji: '🤸', name: 'Stand-and-stretch breaks', what: 'When a student finishes one subject and goes to start another, their pet leads a 1½-minute movement break. Pick the moves and minutes in Settings.', on: g => moveSettings(g?.move as Partial<MoveSettings> | undefined).enabled },
  { id: 'themes', emoji: '🎉', name: 'Theme days', what: 'A fun theme for the day (Pajama Day, Detective Day, Pi Day, the 100th day of school…), announced right after the morning brain stretch. Choose every day or Fridays in Settings.', on: g => themeSettings(g?.themes as Partial<ThemeSettings> | undefined).enabled },
  { id: 'arcade', emoji: '🕹️', name: 'Arcade', what: 'Games students play with the practice time they earn. Pick which games in Settings.', on: g => arcadeSettings(g?.arcade as Partial<ArcadeSettings> | undefined).enabled },
  { id: 'freePlay', emoji: '🎟️', name: 'Arcade Free Play', what: 'No coin admission or tickets: practice time alone opens the Arcade.', on: g => arcadeSettings(g?.arcade as Partial<ArcadeSettings> | undefined).freePlay },
  { id: 'allowMusic', emoji: '🎵', name: 'Background music', what: 'Students can turn music on. Sound effects stay up to each student.', on: g => g?.allowMusic !== false },
  { id: 'requireThink', emoji: '💭', name: 'Require Think it through', what: 'Each math station’s reasoning set must be passed before the next station opens.', on: g => g?.requireThink !== false },
  { id: 'khan', emoji: '🎓', name: 'Khan Academy links', what: 'Khan videos and the Khan unit test check. Off keeps students inside Pet World.', on: g => g?.khan !== false },
  { id: 'youtube', emoji: '▶️', name: 'YouTube video searches', what: 'A backup "Find videos on YouTube" link on each lesson.', on: g => g?.youtube !== false }
];
function renderSetup() {
  const pane = $('#pane'), cls = current!, g = cls.game_settings;
  pane.innerHTML = `<div class="card setup-menu"><h2>🧭 Set up ${esc(cls.name)}</h2>
    <p class="muted" style="margin-top:0">Choose what this class uses. You can change any of these later here or in Settings.</p>
    <div class="setup-list">${SETUP_CHOICES.map(c => `<label class="setup-item"><input type="checkbox" data-setup="${c.id}" ${c.on(g) ? 'checked' : ''}><span class="setup-emoji" aria-hidden="true">${c.emoji}</span><span><b>${esc(c.name)}</b><br><span class="muted">${esc(c.what)}</span></span></label>`).join('')}</div>
    <div class="row"><button class="btn primary" id="setupSave">Save and add students →</button><button class="btn" id="setupSaveStay">Save</button><button class="btn" id="setupMore">More settings</button></div>
    <p class="status muted" id="setupMsg"></p></div>`;
  const val = (id: string) => (pane.querySelector(`[data-setup="${id}"]`) as HTMLInputElement).checked;
  const save = async (next: typeof tab | null) => {
    const old = cls.game_settings || {};
    const game_settings = { ...old, allowMusic: val('allowMusic'), requireThink: val('requireThink'), khan: val('khan'), youtube: val('youtube'),
      brain: { ...brainSettings(old.brain as Partial<BrainSettings> | undefined), enabled: val('brain') },
      move: { ...moveSettings(old.move as Partial<MoveSettings> | undefined), enabled: val('move') },
      themes: { ...themeSettings(old.themes as Partial<ThemeSettings> | undefined), enabled: val('themes') },
      arcade: { ...arcadeSettings(old.arcade as Partial<ArcadeSettings> | undefined), enabled: val('arcade'), freePlay: val('freePlay') } };
    $('#setupMsg').textContent = 'Saving…';
    const { error } = await sb!.from('classes').update({ game_settings }).eq('id', cls.id);
    if (error) { $('#setupMsg').textContent = error.message; return; }
    cls.game_settings = game_settings;
    if (next) { tab = next; renderMain(); } else $('#setupMsg').textContent = 'Saved.';
  };
  $('#setupSave').addEventListener('click', () => { void save('roster'); });
  $('#setupSaveStay').addEventListener('click', () => { void save(null); });
  $('#setupMore').addEventListener('click', () => { tab = 'settings'; renderMain(); });
}

/* ---------- class settings ---------- */
function renderSettings() {
  const pane = $('#pane'), cls = current!;
  const settings = mergeDrillSettings(cls.drill_settings);
  const quizzes = quizSettings(cls.quiz_settings || QUIZ_DEFAULTS);
  const arcade = arcadeSettings(cls.game_settings?.arcade as Partial<ArcadeSettings> | undefined);
  const brain = brainSettings(cls.game_settings?.brain as Partial<BrainSettings> | undefined);
  const move = moveSettings(cls.game_settings?.move as Partial<MoveSettings> | undefined);
  const themes = themeSettings(cls.game_settings?.themes as Partial<ThemeSettings> | undefined);
  const openUnits = new Set(BUILDINGS.filter(b => b.open).map(b => b.id));
  const drillTypes = Object.entries(DRILLS).filter(([, drill]) => drill.unit === 'all' || openUnits.has(drill.unit));
  pane.innerHTML = `<div class="card setup-callout"><div class="row" style="margin:0; align-items:center"><span style="flex:1"><b>🧭 Quick setup</b> <span class="muted">· everything you can turn on or off, on one page</span></span><button type="button" class="btn small primary" id="openSetup">Open quick setup</button></div></div><div class="two">
    <div class="card"><h2>How students join</h2>
      <p>1. Go to <a href="${esc(gameUrl())}" target="_blank" rel="noopener">${esc(gameUrl())}</a></p>
      <p>2. Type the class code:</p><p class="joincode">${esc(cls.join_code)}</p>
      <p>3. Pick their name and type their 4-digit PIN.</p>
      <p class="muted">Signing in on a new computer brings their town with them.</p><div class="row"><button class="btn small" id="copyJoin" data-label="Copy join instructions">Copy join instructions</button></div><textarea id="joinFallback" class="copy-fallback" hidden readonly aria-label="Join instructions to copy"></textarea></div>
    <div class="card"><h2>Class settings</h2>
      <label for="cName">Class name</label><input type="text" id="cName" maxlength="60" value="${esc(cls.name)}">
      ${builtHoods().map(n => { const inHood = BUILDINGS.filter(b => b.hood === n.id && b.open); return `<div class="grade-set"><h3>${n.emoji} ${esc(n.name)}</h3>${inHood.map(b => b.id === 'cafe'
        ? `<label for="cStation">Unlock the café through</label><select id="cStation">${STATIONS.map(s => `<option value="${s.id}" ${s.id === cls.min_station ? 'selected' : ''}>Station ${s.id}: ${esc(s.name)}</option>`).join('')}</select>`
        : SHOPS[b.id] ? (shop => { const m = (cls.game_settings?.minStations as Record<string, number> | undefined)?.[shop.id] || 1; return `<label for="minSt-${shop.id}">Unlock the ${esc(shop.name)} through</label><select id="minSt-${shop.id}" data-min-station="${shop.id}">${shop.stations.filter(st => st.skills.length).map(st => `<option value="${st.id}" ${st.id === m ? 'selected' : ''}>Station ${st.id}: ${esc(st.name)}</option>`).join('')}</select>`; })(SHOPS[b.id]) : '').join('')}${inHood.filter(b => prevBuilding(b.id)).map(b => { const prev = prevBuilding(b.id)!; return `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-open-unit="${b.id}" ${(cls.game_settings?.openUnits || []).includes(b.id) ? 'checked' : ''}> Open the ${esc(b.name)} for everyone</label><p class="muted" style="margin-top:0">Otherwise each student opens it by passing the ${esc(prev.name)} Unit Test.</p>`; }).join('')}</div>`; }).join('')}
      <p class="muted">Later stations still open on their own: after 6 orders at the one before, or after its quiz when quizzes open stations. Skipped stations are open right away. The unit test still needs every station quiz passed, or excused on a student's page.</p>
      ${builtHoods().length > 1 ? `<label for="cHome">Home grade</label><select id="cHome">${builtHoods().map(n => `<option value="${n.id}" ${(validHood(cls.game_settings?.home) ? cls.game_settings?.home : DEFAULT_HOME) === n.id ? 'selected' : ''}>${n.emoji} ${esc(n.name)}</option>`).join('')}</select><p class="muted">The town opens here, and students can still walk to the other grades.</p>` : ''}
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="allowMusic" ${cls.game_settings?.allowMusic === false ? '' : 'checked'}> Allow music</label><p class="muted" style="margin-top:0">When it's off, background music never plays for this class. Students keep control of sound effects.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="useKhan" ${cls.game_settings?.khan === false ? '' : 'checked'}> Use Khan Academy</label><p class="muted" style="margin-top:0">When it's off, students and families never see Khan links or mentions, and the Khan unit test check is hidden. Lessons keep their own text, Pet World videos, and your own lesson links. Nothing is deleted, so you can turn it back on any time.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="requireThink" ${cls.game_settings?.requireThink === false ? '' : 'checked'}> Require 🧠 Think it through</label><p class="muted" style="margin-top:0">When it's on, each math station's Think it through set (select all, sort, two-part and more) has to be passed, every question right, before the next station opens. Stations a student already worked at, and stations you opened, stay open.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="useYouTube" ${cls.game_settings?.youtube === false ? '' : 'checked'}> Show YouTube video searches</label><p class="muted" style="margin-top:0">Each lesson gets a "Find videos on YouTube" link as a backup (and the only video link when Khan is off). Pet World doesn't check what YouTube shows, so turn this off if your school blocks YouTube or you'd rather students stay off it.</p>
      <h3>🧠 Brain stretches</h3>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="brainEnabled" ${brain.enabled ? 'checked' : ''}> Brain stretches</label>
      <p class="muted" style="margin-top:0">3 short brain games in a row: one when a student opens Pet World each day, and one each time a subject or unit on their daily plan is done. There's no skip button. Each game starts at its easiest level and moves up after 3 scores in a row of 85% or better. Results are on each student's 🧠 Brain tab.</p>
      <h4>Games in the cycle</h4><div class="row"><button type="button" class="btn small" data-brain-all="1">Use all</button><button type="button" class="btn small" data-brain-all="0">Block all</button></div>${BRAIN_GAMES.map(game => `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-brain-game="${game.id}" ${brain.games[game.id] ? 'checked' : ''}> ${game.emoji} ${esc(game.name)} <span class="muted">· ${esc(game.skill)}</span></label>`).join('')}
      <h3>🎉 Theme days</h3>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="themesEnabled" ${themes.enabled ? 'checked' : ''}> Theme days</label>
      <p class="muted" style="margin-top:0">A fun theme for the day, like Pajama Day or Detective Day, with something to wear and a small challenge. Students see it right after the morning brain stretch, and it stays in Today’s plan all day. The same theme shows for everyone in the class.</p>
      <label for="themesWhen">How often</label><select id="themesWhen"><option value="every" ${themes.when === 'every' ? 'selected' : ''}>Every school day (Monday to Friday)</option><option value="fri" ${themes.when === 'fri' ? 'selected' : ''}>Fridays only</option></select>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="themesSpecial" ${themes.special ? 'checked' : ''}> Special days on their dates: ${SPECIAL_DAYS.map(s => `${s.emoji} ${esc(s.name)}`).join(', ')}</label>
      <p class="muted" style="margin-top:0">The 100th day of school counts weekdays from the school year’s start date on each student’s Transcript tab (holidays aren’t skipped).</p>
      <h4>Themes in the rotation</h4><div class="row"><button type="button" class="btn small" data-theme-all="1">Use all</button><button type="button" class="btn small" data-theme-all="0">Block all</button></div>${THEME_DAYS.map(th => `<label style="display:flex; gap:8px; align-items:center" title="${esc(th.wear)} ${esc(th.challenge)}"><input type="checkbox" data-themeday="${th.id}" ${themes.themes[th.id] ? 'checked' : ''}> ${th.emoji} ${esc(th.name)}</label>`).join('')}
      <h3>🤸 Stand-and-stretch breaks</h3>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="moveEnabled" ${move.enabled ? 'checked' : ''}> Stand-and-stretch breaks</label>
      <p class="muted" style="margin-top:0">When a student finishes one subject and goes to start a different one, their pet leads ${MOVES_PER_BREAK} moves (half stretches, half fun ones like a staring contest or sock basketball), about ${MOVE_SECONDS} seconds each, before the new subject. There's no skip button. Walking around town or the Arcade in between doesn't count as a new subject, and break time doesn't count toward any subject.</p>
      <label for="moveMinutes">Minutes in a subject before switching brings a break (0 = every switch)</label><input type="number" id="moveMinutes" min="0" max="${MOVE_MINUTES_MAX}" step="1" value="${move.minutes}">
      <h4>Moves in the cycle</h4><div class="row"><button type="button" class="btn small" data-move-all="1">Use all</button><button type="button" class="btn small" data-move-all="0">Block all</button></div>${([['stretch', 'Stretches'], ['fun', 'Fun ones']] as const).map(([kind, title]) => `<p style="margin:8px 0 2px"><b>${title}</b></p>${MOVES.filter(m => m.kind === kind).map(m => `<label style="display:flex; gap:8px; align-items:center" title="${esc(m.cue)}"><input type="checkbox" data-move="${m.id}" ${move.moves[m.id] ? 'checked' : ''}> ${m.emoji} ${esc(m.name)}</label>`).join('')}`).join('')}
      <h3>Arcade</h3>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="arcadeEnabled" ${arcade.enabled ? 'checked' : ''}> Open the Arcade</label>
      <p class="muted" style="margin-top:0">When it's off, the Arcade is closed and students see a lock on its town tile. Students already playing are sent back within a minute.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="arcadeFreePlay" ${arcade.freePlay ? 'checked' : ''}> Free Play: banked math time only, no admission or tickets</label>
      <p class="muted" style="margin-top:0">Free Play needs only practice time banked today. Without it, students pay 🪙 100 once a day and earn tickets.</p>
      <h4>Games students can play</h4><div class="row"><button type="button" class="btn small" data-arcade-all="1">Open all</button><button type="button" class="btn small" data-arcade-all="0">Close all</button></div>${ARCADE_GAMES.map(game => `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-arcade-game="${game.id}" ${arcade.games[game.id] ? 'checked' : ''}> ${game.emoji} ${esc(game.name)}</label>`).join('')}
      <p class="muted" style="margin-top:0">These switches apply in Free Play and paid entry. A game you close mid-play ends for that student within a minute.</p>
      <h4>Ticket rewards (paid-entry mode)</h4>
      <label for="arcadeCorsairRate">Corsair's Cove points per ticket</label><input type="number" id="arcadeCorsairRate" min="1000" max="100000" step="1000" value="${arcade.corsairPointsPerTicket}">
      <label for="arcadeWhackTickets">Tickets per completed Whack-a-Mole round</label><input type="number" id="arcadeWhackTickets" min="0" max="5" step="1" value="${arcade.whackTicketsPerRound}">
      <label for="arcadeMineReward">Tickets per Mine Walker reward (each level clear or medal pays once, ever)</label><input type="number" id="arcadeMineReward" min="0" max="5" step="1" value="${arcade.mineTicketsPerReward}">
      <label for="arcadeMineRows">Mine Walker Endless rows per ticket</label><input type="number" id="arcadeMineRows" min="5" max="200" step="5" value="${arcade.mineRowsPerTicket}">
      <label for="arcadeTicketCap">Maximum Arcade tickets per student each day</label><input type="number" id="arcadeTicketCap" min="0" max="100" step="1" value="${arcade.maxTicketsPerDay}">
      <label for="arcadeGameOfDayBonus">Bonus tickets for completing the Game of the Day</label><input type="number" id="arcadeGameOfDayBonus" min="0" max="5" step="1" value="${arcade.gameOfDayBonusTickets}">
      <p class="muted" style="margin-top:0">The bonus is deterministic, counts toward the daily ticket cap, and is disabled in Free Play.</p>
      <div class="row"><button class="btn primary" id="saveCls">Save</button><span class="status" id="setMsg"></span></div>
      <h2 style="margin-top:20px">Delete class</h2><p class="muted" style="margin-top:0">Removes the roster and all progress for this class.</p>
      <button class="btn small" id="delCls">Delete this class</button></div>
    <div class="card"><h2>Quizzes and tests</h2>
      <label for="quizShowSteps">Quiz style</label><select id="quizShowSteps"><option value="false" ${quizzes.showSteps ? '' : 'selected'}>Answer only</option><option value="true" ${quizzes.showSteps ? 'selected' : ''}>Show steps</option></select>
      <label for="quizPassPct">Pass mark (%)</label><input type="number" id="quizPassPct" min="50" max="100" step="1" value="${quizzes.passPct}">
      <h3>Station quizzes</h3>
      <label for="quizPerSkill">Problems per skill</label><input type="number" id="quizPerSkill" min="1" max="4" step="1" value="${quizzes.quizPerSkill}">
      <label for="quizMin">Minimum quiz problems</label><input type="number" id="quizMin" min="3" max="20" step="1" value="${quizzes.quizMin}">
      <label for="quizMax">Maximum quiz problems</label><input type="number" id="quizMax" min="3" max="20" step="1" value="${quizzes.quizMax}">
      <h3>Unit tests</h3>
      <label for="testPerSkill">Problems per skill</label><input type="number" id="testPerSkill" min="1" max="3" step="1" value="${quizzes.testPerSkill}">
      <label for="testMin">Minimum test problems</label><input type="number" id="testMin" min="4" max="30" step="1" value="${quizzes.testMin}">
      <label for="testMax">Maximum test problems</label><input type="number" id="testMax" min="4" max="30" step="1" value="${quizzes.testMax}">
      <label for="reviewPerfect">Perfect review problems per missed skill</label><input type="number" id="reviewPerfect" min="1" max="5" step="1" value="${quizzes.reviewPerfect}">
      <label><input type="checkbox" id="requireQuiz" ${quizzes.requireQuiz ? 'checked' : ''}> Passing a station quiz opens the next station</label>
      <div class="row"><button class="btn primary" id="saveQuizSettings">Save</button><button class="btn" id="resetQuizSettings">Reset to defaults</button><span class="status" id="quizSettingsMsg"></span></div>
    </div>
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
    const openUnits = [...pane.querySelectorAll<HTMLInputElement>('[data-open-unit]')].filter(input => input.checked).map(input => input.dataset.openUnit!);
    const allowMusic = ($('#allowMusic') as HTMLInputElement).checked, khan = ($('#useKhan') as HTMLInputElement).checked, youtube = ($('#useYouTube') as HTMLInputElement).checked, requireThink = ($('#requireThink') as HTMLInputElement).checked;
    const brainGames: Record<string, boolean> = {};
    pane.querySelectorAll<HTMLInputElement>('[data-brain-game]').forEach(input => { brainGames[input.dataset.brainGame!] = input.checked; });
    const brainSettingsForClass = brainSettings({ enabled: ($('#brainEnabled') as HTMLInputElement).checked, games: brainGames });
    const moves: Record<string, boolean> = {};
    pane.querySelectorAll<HTMLInputElement>('[data-move]').forEach(input => { moves[input.dataset.move!] = input.checked; });
    const moveSettingsForClass = moveSettings({ enabled: ($('#moveEnabled') as HTMLInputElement).checked, minutes: +($('#moveMinutes') as HTMLInputElement).value, moves });
    const themeChecks: Record<string, boolean> = {};
    pane.querySelectorAll<HTMLInputElement>('[data-themeday]').forEach(input => { themeChecks[input.dataset.themeday!] = input.checked; });
    const themeSettingsForClass = themeSettings({ enabled: ($('#themesEnabled') as HTMLInputElement).checked, when: ($('#themesWhen') as HTMLSelectElement).value === 'fri' ? 'fri' : 'every', special: ($('#themesSpecial') as HTMLInputElement).checked, themes: themeChecks });
    const arcadeGames: Record<string, boolean> = {};
    pane.querySelectorAll<HTMLInputElement>('[data-arcade-game]').forEach(input => { arcadeGames[input.dataset.arcadeGame!] = input.checked; });
    const arcadeSettingsForClass = arcadeSettings({
      enabled: ($('#arcadeEnabled') as HTMLInputElement).checked,
      freePlay: ($('#arcadeFreePlay') as HTMLInputElement).checked,
      games: arcadeGames,
      corsairPointsPerTicket: +($('#arcadeCorsairRate') as HTMLInputElement).value,
      whackTicketsPerRound: +($('#arcadeWhackTickets') as HTMLInputElement).value,
      mineTicketsPerReward: +($('#arcadeMineReward') as HTMLInputElement).value,
      mineRowsPerTicket: +($('#arcadeMineRows') as HTMLInputElement).value,
      maxTicketsPerDay: +($('#arcadeTicketCap') as HTMLInputElement).value,
      gameOfDayBonusTickets: +($('#arcadeGameOfDayBonus') as HTMLInputElement).value
    });
    const homeSel = pane.querySelector<HTMLSelectElement>('#cHome');
    const minStations: Record<string, number> = {};
    pane.querySelectorAll<HTMLSelectElement>('[data-min-station]').forEach(sel => { minStations[sel.dataset.minStation!] = +sel.value; });
    const game_settings = { ...(cls.game_settings || {}), openUnits, allowMusic, khan, youtube, requireThink, minStations, arcade: arcadeSettingsForClass, brain: brainSettingsForClass, move: moveSettingsForClass, themes: themeSettingsForClass, ...(homeSel ? { home: homeSel.value } : {}) };
    const { error } = await sb!.from('classes').update({ name, min_station, game_settings }).eq('id', cls.id);
    if (error) { $('#setMsg').textContent = error.message; return; }
    await loadClasses(cls.id);
  });
  pane.querySelectorAll<HTMLButtonElement>('[data-brain-all]').forEach(button => button.addEventListener('click', () => { pane.querySelectorAll<HTMLInputElement>('[data-brain-game]').forEach(input => { input.checked = button.dataset.brainAll === '1'; }); }));
  pane.querySelectorAll<HTMLButtonElement>('[data-theme-all]').forEach(button => button.addEventListener('click', () => { pane.querySelectorAll<HTMLInputElement>('[data-themeday]').forEach(input => { input.checked = button.dataset.themeAll === '1'; }); }));
  pane.querySelectorAll<HTMLButtonElement>('[data-move-all]').forEach(button => button.addEventListener('click', () => { pane.querySelectorAll<HTMLInputElement>('[data-move]').forEach(input => { input.checked = button.dataset.moveAll === '1'; }); }));
  pane.querySelectorAll<HTMLButtonElement>('[data-arcade-all]').forEach(button => button.addEventListener('click', () => { pane.querySelectorAll<HTMLInputElement>('[data-arcade-game]').forEach(input => { input.checked = button.dataset.arcadeAll === '1'; }); }));
  $('#openSetup').addEventListener('click', () => { tab = 'setup'; renderMain(); });
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
  $('#saveQuizSettings').addEventListener('click', async () => {
    const quiz_settings = quizSettings({
      passPct: ($('#quizPassPct') as HTMLInputElement).valueAsNumber,
      quizPerSkill: ($('#quizPerSkill') as HTMLInputElement).valueAsNumber,
      quizMin: ($('#quizMin') as HTMLInputElement).valueAsNumber,
      quizMax: ($('#quizMax') as HTMLInputElement).valueAsNumber,
      testPerSkill: ($('#testPerSkill') as HTMLInputElement).valueAsNumber,
      testMin: ($('#testMin') as HTMLInputElement).valueAsNumber,
      testMax: ($('#testMax') as HTMLInputElement).valueAsNumber,
      reviewPerfect: ($('#reviewPerfect') as HTMLInputElement).valueAsNumber,
      requireQuiz: ($('#requireQuiz') as HTMLInputElement).checked,
      showSteps: ($('#quizShowSteps') as HTMLSelectElement).value === 'true'
    });
    const { error } = await sb!.from('classes').update({ quiz_settings }).eq('id', cls.id);
    if (error) { $('#quizSettingsMsg').textContent = error.message; return; }
    await loadClasses(cls.id);
  });
  $('#resetQuizSettings').addEventListener('click', async () => {
    const { error } = await sb!.from('classes').update({ quiz_settings: {} }).eq('id', cls.id);
    if (error) { $('#quizSettingsMsg').textContent = error.message; return; }
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
