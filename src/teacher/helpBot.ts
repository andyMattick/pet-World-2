/* 🤖 Teacher app helper (docs/HELP-BOT.md): a round button bottom-right that answers "where is…/how do I…/turn off…"
   from the app's own tabs and settings, and takes you there (switches the tab, scrolls to the setting and highlights it).
   It never changes a setting itself. Settings come from the shared list (src/teacher/settingsList.ts), plus the bot's own list of every Settings control and one entry per Arcade game, brain game, move and theme day. */
import { buildIndex, ask, suggestWords, teacherEntries, teacherItemSettings, fromSharedSettings, TEACHER_SETTINGS, type HelpEntry, type HelpIndex, type SharedSetting, type TeacherSetting } from '../shared/helpBot';
import { ARCADE_GAMES } from '../shared/registry';
import { BRAIN_GAMES } from '../shared/brainGames';
import { MOVES } from '../shared/moveBreaks';
import { THEME_DAYS } from '../shared/themeDays';
import { TEACHER_SETTINGS as SHARED_SETTINGS, SETTING_GROUPS } from './settingsList';

export interface TeacherBotApi {
  goTab: (tab: string) => void;                          // switch tabs through the app's own renderMain()
  state: () => { ready: boolean; hasClass: boolean; tab: string; lang: string };
}

/* the shared settings list (src/teacher/settingsList.ts, docs/QUICK-SETUP.md): the same list Quick setup and Settings use */
function sharedSettings(): TeacherSetting[] {
  return fromSharedSettings(SHARED_SETTINGS as unknown as SharedSetting[], SETTING_GROUPS);
}

const STYLE = `
.hb-btn{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:60;width:52px;height:52px;border-radius:50%;border:3px solid #fff;background:#2f6fdb;color:#fff;font-size:24px;line-height:1;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer}
.hb-btn:focus-visible{outline:3px solid #ffb703;outline-offset:2px}
.hb-panel{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:78px;z-index:61;width:min(360px,calc(100vw - 24px));max-height:min(500px,calc(100vh - 110px));display:flex;flex-direction:column;background:#fff;color:#1d2433;border-radius:16px;box-shadow:0 10px 34px rgba(0,0,0,.28);overflow:hidden;font-size:15px}
.hb-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#2f6fdb;color:#fff}
.hb-head b{flex:1}
.hb-head button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
.hb-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:#f3f6fc}
.hb-msg{max-width:90%;padding:8px 11px;border-radius:12px;line-height:1.35}
.hb-bot{align-self:flex-start;background:#fff;border:1px solid #dbe4f5}
.hb-me{align-self:flex-end;background:#2f6fdb;color:#fff}
.hb-msg small{display:block;color:#5b6474;margin-top:3px}
.hb-go,.hb-pick{display:inline-block;margin:6px 6px 0 0;padding:5px 10px;border-radius:999px;border:2px solid #2f6fdb;background:#fff;color:#1f55b3;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
.hb-go{background:#2f6fdb;color:#fff}
.hb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px 0;background:#fff}
.hb-chips button{padding:4px 9px;border-radius:999px;border:1px solid #c3d3f3;background:#f3f6fc;color:#1f3f80;font:inherit;font-size:13px;cursor:pointer}
.hb-form{display:flex;gap:6px;padding:8px 10px 10px;background:#fff}
.hb-form input{flex:1;min-width:0;padding:8px 10px;border:2px solid #cfdbf3;border-radius:10px;font:inherit;font-size:16px}
.hb-form button{padding:0 12px;border:0;border-radius:10px;background:#2f6fdb;color:#fff;font:inherit;font-weight:700;cursor:pointer}
.hb-flash{outline:4px solid #ffb703!important;outline-offset:3px;border-radius:8px;animation:hbFlash 1.2s ease-in-out 2}
@keyframes hbFlash{50%{outline-color:rgba(255,183,3,.2)}}
@media (prefers-reduced-motion:reduce){.hb-flash{animation:none}}
@media print{.hb-root{display:none!important}}
`;

let api: TeacherBotApi, index: HelpIndex | null = null, root: HTMLElement, open = false, lastHits: HelpEntry[] = [];
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const CHIPS = ['Add students', 'Reset a PIN', 'Turn off brain stretches', 'Quick setup'];

export function initTeacherHelpBot(options: TeacherBotApi) {
  api = options;
  const style = document.createElement('style'); style.textContent = STYLE; document.head.appendChild(style);
  root = document.createElement('div'); root.className = 'hb-root';
  root.innerHTML = `<button type="button" class="hb-btn" aria-haspopup="dialog" aria-expanded="false" aria-label="Helper: find a page or setting" title="Helper">❓</button>`;
  document.body.appendChild(root);
  root.querySelector('.hb-btn')!.addEventListener('click', () => toggle());
  const sync = () => { const st = api.state(), detail = document.getElementById('detail'); const hide = !st.ready || (!!detail && !detail.hidden); root.hidden = hide; if (hide && open) toggle(false); };
  setInterval(sync, 700); sync();
}

function buildOnce() {
  if (!index) index = buildIndex(teacherEntries([...sharedSettings(), ...TEACHER_SETTINGS, ...teacherItemSettings({ ARCADE_GAMES, BRAIN_GAMES, MOVES, THEME_DAYS })]));
  return index;
}

function toggle(force?: boolean) {
  open = force ?? !open;
  root.querySelector('.hb-btn')!.setAttribute('aria-expanded', String(open));
  let panel = root.querySelector<HTMLElement>('.hb-panel');
  if (!open) { panel?.remove(); return; }
  buildOnce();
  panel = document.createElement('div'); panel.className = 'hb-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Helper');
  panel.innerHTML = `<div class="hb-head"><span aria-hidden="true">❓</span><b>Helper</b><button type="button" data-hb-close aria-label="Close">✕</button></div>
    <div class="hb-log" aria-live="polite"></div>
    <div class="hb-chips">${CHIPS.map(q => `<button type="button" data-hb-ask="${esc(q)}">${esc(q)}</button>`).join('')}</div>
    <form class="hb-form"><input type="text" maxlength="140" autocomplete="off" enterkeyhint="send" aria-label="Ask where a page or setting is" placeholder="Find a page or setting…"><button type="submit">Ask</button></form>`;
  root.appendChild(panel);
  say(api.state().hasClass ? 'Hi! Ask me where a page or setting is, or how to do something (e.g. “turn off the Arcade”).' : 'Hi! Start by adding a class on the left (type a name, then Add class). Then ask me anything about setting it up.');
  panel.addEventListener('click', onClick);
  panel.querySelector('form')!.addEventListener('submit', e => { e.preventDefault(); const input = panel!.querySelector('input')!; const q = input.value.trim(); if (!q) return; input.value = ''; question(q); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); root.querySelector<HTMLElement>('.hb-btn')!.focus(); } });
  setTimeout(() => panel!.querySelector('input')?.focus(), 30);
}

function onClick(e: Event) {
  const el = e.target as Element;
  if (el.closest('[data-hb-close]')) { toggle(false); return; }
  const chip = el.closest<HTMLElement>('[data-hb-ask]'); if (chip) { question(chip.dataset.hbAsk || ''); return; }
  const pick = el.closest<HTMLElement>('[data-hb-pick]'); if (pick) { const entry = lastHits[+(pick.dataset.hbPick || 0)]; if (entry) { me(entry.title); answer(entry); } return; }
  const go = el.closest<HTMLElement>('[data-hb-go]'); if (go) { const where = go.dataset.hbGo || ''; toggle(false); setTimeout(() => goTo(where), 0); }
}
function say(html: string) { const log = root.querySelector('.hb-log'); if (!log) return; const m = document.createElement('div'); m.className = 'hb-msg hb-bot'; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; }
function me(text: string) { const log = root.querySelector('.hb-log'); if (!log) return; const m = document.createElement('div'); m.className = 'hb-msg hb-me'; m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; }

function question(q: string) {
  me(q);
  const r = ask(index!, q);
  if (r.status === 'hello') { say('Hi! Try “add students”, “reset a PIN”, “turn off brain stretches” or “where are grades?”'); return; }
  if (r.status === 'thanks') { say('You’re welcome!'); return; }
  if (r.status === 'next') { say(api.state().hasClass ? 'A good start: 🧭 Quick setup (every on/off choice on one page), then add students on the Roster.<br><button type="button" class="hb-go" data-hb-go="tab:setup">Open Quick setup</button>' : 'Add a class on the left first: type a name, then Add class. Quick setup opens next.'); return; }
  if (r.status === 'sure') { const top = r.hits[0]; answer(top.entry, r.hits.slice(1).filter(h => h.score > top.score * 0.85 && h.entry.go && h.entry.title !== top.entry.title).map(h => h.entry)); return; }
  if (r.status === 'maybe') { lastHits = r.hits.map(h => h.entry); say(`Did you mean…<br>${lastHits.map((e, i) => `<button type="button" class="hb-pick" data-hb-pick="${i}">${esc(e.emoji || '')} ${esc(e.title)}</button>`).join('')}`); return; }
  const words = suggestWords(index!, q);
  say(`I’m not sure.${words.length ? ` Did you mean “${esc(words.join(' '))}”?` : ''} Try a tab (“Roster”), a setting (“Arcade”, “music”), or “how do I reset a PIN?”`);
}

function answer(entry: HelpEntry, also: HelpEntry[] = []) {
  const needsClass = !!entry.go && !api.state().hasClass;
  let html = `<b>${esc(entry.emoji || '')} ${esc(entry.title)}</b><br>${esc(entry.text)}`;
  if (needsClass) html += '<small>Add a class on the left first.</small>';
  else if (entry.go) html += `<br><button type="button" class="hb-go" data-hb-go="${esc(entry.go)}">Take me there</button>`;
  if (also.length) { lastHits = also; html += `<small>Also:</small>${also.map((e, i) => `<button type="button" class="hb-pick" data-hb-pick="${i}">${esc(e.emoji || '')} ${esc(e.title)}</button>`).join('')}`; }
  say(html);
}

function flash(el: Element | null) {
  document.querySelectorAll('.hb-flash').forEach(x => x.classList.remove('hb-flash'));
  if (!el) return;
  for (let d = el.parentElement?.closest('details'); d; d = d.parentElement?.closest('details') || null) d.open = true;   // a setting inside a folded section
  const forLabel = el.id && !el.closest('label') ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;   // <label for> next to its input
  const boxes = forLabel ? [forLabel, el] : [el.closest('label, .setup-item') || el];
  boxes[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); boxes.forEach(b => b.classList.add('hb-flash'));
  if (el instanceof HTMLElement && (/SELECT|BUTTON/.test(el.tagName) || ['checkbox', 'radio'].includes((el as HTMLInputElement).type))) setTimeout(() => el.focus({ preventScroll: true }), 400);
  setTimeout(() => boxes.forEach(b => b.classList.remove('hb-flash')), 2800);
}
/* wait for a tab's pane to draw (some load data first), then highlight */
function whenThere(sel: string, tries = 25) {
  const el = document.querySelector(`#pane ${sel}`) || document.querySelector(sel);
  if (el) { flash(el); return; }
  if (tries > 0) setTimeout(() => whenThere(sel, tries - 1), 120);
}
function goTo(go: string) {
  const i = go.indexOf(':'), kind = go.slice(0, i), id = go.slice(i + 1);
  if (kind === 'tab') { api.goTab(id); document.getElementById('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (kind === 'setup') { api.goTab('setup'); whenThere(`[data-setup="${CSS.escape(id)}"]`); return; }
  if (kind === 'sel') {
    const quick = /^\[data-setup=/.test(id);
    api.goTab(quick ? 'setup' : 'settings'); whenThere(id);
  }
}
