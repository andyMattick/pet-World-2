/* 🤖 Pet World helper: the student app's help bot (docs/HELP-BOT.md).
   A round button in the bottom-right corner opens a small chat. It answers from an index built (on first open) from the
   app's own lists, so new buildings and games show up by themselves. "Take me there" goes through the app's normal
   doors (the town tiles and their click handlers), so every gate stays: the Bible-first card, the warm-up, the grown-up
   PIN, today's video, locks and teacher-closed games. A locked or closed place is explained, never opened.
   It saves nothing (no storage at all), so look-only mode stays look-only. It hides during tests, quizzes, test reviews,
   brain stretches, stand-and-stretch breaks, Arcade play and other pop-ups. */
import { buildIndex, ask, suggestWords, studentEntries, normalize } from '../shared/helpBot';

const ES = {
  'Ask me where something is…': 'Pregúntame dónde está algo…', 'Take me there': 'Llévame', 'Helper': 'Ayudante', 'Close': 'Cerrar',
  'Where do I start?': '¿Por dónde empiezo?', 'Find the Arcade': 'Buscar el Arcade', 'How do I take a test?': '¿Cómo hago una prueba?', 'Send': 'Enviar'
};

let api = null, index = null, root = null, open = false;
const t = s => (api?.state().lang === 'es' && ES[s]) || s;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const STYLE = `
.hb-btn{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:60;width:52px;height:52px;border-radius:50%;border:3px solid #fff;background:#6b4fd8;color:#fff;font-size:26px;line-height:1;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center}
.hb-btn:focus-visible{outline:3px solid #ffb703;outline-offset:2px}
body.look-only .hb-btn,body.look-only .hb-panel{bottom:76px}
.hb-panel{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:76px;z-index:61;width:min(340px,calc(100vw - 24px));max-height:min(480px,calc(100vh - 110px));display:flex;flex-direction:column;background:#fff;color:#2b2140;border-radius:18px;box-shadow:0 10px 34px rgba(0,0,0,.28);overflow:hidden;font-size:15px}
body.look-only .hb-panel{bottom:136px}
.hb-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#6b4fd8;color:#fff}
.hb-head b{flex:1;font-size:16px}
.hb-head button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;padding:2px 6px}
.hb-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:#f6f3ff}
.hb-msg{max-width:88%;padding:8px 11px;border-radius:14px;line-height:1.35}
.hb-bot{align-self:flex-start;background:#fff;border:1px solid #e3dcff}
.hb-me{align-self:flex-end;background:#6b4fd8;color:#fff}
.hb-msg small{display:block;color:#6a5f80;margin-top:3px}
.hb-lock{display:block;margin-top:4px;color:#9a3412;font-weight:600}
.hb-go,.hb-pick{display:inline-block;margin:6px 6px 0 0;padding:5px 10px;border-radius:999px;border:2px solid #6b4fd8;background:#fff;color:#4b32b8;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
.hb-go{background:#6b4fd8;color:#fff}
.hb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px 0;background:#fff}
.hb-chips button{padding:4px 9px;border-radius:999px;border:1px solid #c9bdf5;background:#f6f3ff;color:#3c2a8f;font:inherit;font-size:13px;cursor:pointer}
.hb-form{display:flex;gap:6px;padding:8px 10px 10px;background:#fff}
.hb-form input{flex:1;min-width:0;padding:8px 10px;border:2px solid #d8cff8;border-radius:12px;font:inherit;font-size:16px}
.hb-form button{padding:0 12px;border:0;border-radius:12px;background:#6b4fd8;color:#fff;font:inherit;font-weight:700;cursor:pointer}
.hb-flash{outline:4px solid #ffb703!important;outline-offset:3px;border-radius:12px;animation:hbFlash 1.2s ease-in-out 2}
@keyframes hbFlash{50%{outline-color:rgba(255,183,3,.2)}}
@media (prefers-reduced-motion:reduce){.hb-flash{animation:none}}
`;

export function initHelpBot(options){
  api = options;
  const style = document.createElement('style'); style.textContent = STYLE; document.head.appendChild(style);
  root = document.createElement('div'); root.className = 'hb-root';
  root.innerHTML = `<button type="button" class="hb-btn" aria-haspopup="dialog" aria-expanded="false" aria-label="Helper: ask where something is" title="Helper">🐾</button>`;
  document.body.appendChild(root);
  root.querySelector('.hb-btn').addEventListener('click', () => toggle());
  setInterval(syncVisible, 600);
  syncVisible();
}

function syncVisible(){
  if (!api || !root) return;
  const st = api.state(), hide = st.busy || !st.signedIn;
  root.hidden = hide;
  if (hide && open) toggle(false);
}

function buildOnce(){
  if (!index) index = buildIndex(studentEntries(api.data));
  return index;
}

function toggle(force){
  open = force ?? !open;
  root.querySelector('.hb-btn').setAttribute('aria-expanded', String(open));
  let panel = root.querySelector('.hb-panel');
  if (!open) { panel?.remove(); return; }
  buildOnce();
  const st = api.state();
  panel = document.createElement('div'); panel.className = 'hb-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', t('Helper'));
  panel.innerHTML = `<div class="hb-head"><span aria-hidden="true">🐾</span><b>${esc(t('Helper'))}</b><button type="button" data-hb-close aria-label="${esc(t('Close'))}">✕</button></div>
    <div class="hb-log" aria-live="polite"></div>
    <div class="hb-chips">${['Where do I start?', 'Find the Arcade', 'How do I take a test?'].map(q => `<button type="button" data-hb-ask="${esc(q)}">${esc(t(q))}</button>`).join('')}</div>
    <form class="hb-form"><input type="text" maxlength="120" autocomplete="off" enterkeyhint="send" aria-label="${esc(t('Ask me where something is…'))}" placeholder="${esc(t('Ask me where something is…'))}"><button type="submit">${esc(t('Send'))}</button></form>`;
  root.appendChild(panel);
  say(st.lang === 'es' ? `¡Hola${st.name ? ', ' + esc(st.name) : ''}! Pregúntame dónde está algo o cómo funciona.` : `Hi${st.name ? ' ' + esc(st.name) : ''}! Ask me where something is or how something works.${st.lookOnly ? ' <small>(Look only: nothing here is saved.)</small>' : ''}`);
  panel.addEventListener('click', onPanelClick);
  panel.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const input = panel.querySelector('input'); const q = input.value.trim(); if (!q) return; input.value = ''; question(q); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); root.querySelector('.hb-btn').focus(); } });
  setTimeout(() => panel.querySelector('input')?.focus(), 30);
}

let lastHits = [];
function onPanelClick(e){
  if (e.target.closest('[data-hb-close]')) { toggle(false); return; }
  const chip = e.target.closest('[data-hb-ask]'); if (chip) { question(chip.dataset.hbAsk); return; }
  const pick = e.target.closest('[data-hb-pick]'); if (pick) { const h = lastHits[+pick.dataset.hbPick]; if (h) { me(h.entry.title); answerFor(h.entry); } return; }
  const go = e.target.closest('[data-hb-go]'); if (go) { const where = go.dataset.hbGo; toggle(false); setTimeout(() => goTo(where), 0); }
}

function say(html){ const log = root.querySelector('.hb-log'); if (!log) return; const m = document.createElement('div'); m.className = 'hb-msg hb-bot'; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; }
function me(text){ const log = root.querySelector('.hb-log'); if (!log) return; const m = document.createElement('div'); m.className = 'hb-msg hb-me'; m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; }

function question(q){
  me(q);
  const st = api.state();
  const r = ask(index, q, { hood: st.hood, hidden: e => hiddenFor(e, st) });
  if (r.status === 'hello') { say('Hi! Try “Where is the Bakery?”, “How do coins work?” or “What should I do next?”'); return; }
  if (r.status === 'thanks') { say('You’re welcome! 🐾'); return; }
  if (r.status === 'next') { whatNext(st); return; }
  if (r.status === 'sure') { answerFor(r.hits[0].entry, st, r.hits.slice(1).filter(h => h.score > r.hits[0].score * 0.85 && h.entry.go && h.entry.title !== r.hits[0].entry.title)); return; }
  if (r.status === 'maybe') {
    lastHits = r.hits;
    say(`Did you mean…<br>${r.hits.map((h, i) => `<button type="button" class="hb-pick" data-hb-pick="${i}">${esc(h.entry.emoji || '')} ${esc(h.entry.title)}</button>`).join('')}`);
    return;
  }
  const words = suggestWords(index, q);
  say(`I’m not sure about that one.${words.length ? ` Did you mean “${esc(words.join(' '))}”?` : ''} Try a place (“Bakery”, “Arcade”), a skill (“fractions”), or “how do tests work?”`);
}

/* is it something she can't see at all? (teacher-closed Arcade games are left out) */
function hiddenFor(entry, st){
  if (entry.kind === 'game') return !st.arcadeGames.includes(entry.go.slice(5));
  return false;
}

/* what's in the way, in plain words ('' when nothing) */
function blocker(go, st){
  const [kind, id] = [go.slice(0, go.indexOf(':')), go.slice(go.indexOf(':') + 1)];
  if (kind === 'building') {
    const b = api.data.BUILDINGS.find(x => x.id === id); if (!b) return '';
    if (!b.open) return `The ${b.name} is coming soon.`;
    if (!st.unitOpen(id)) return `🔒 ${st.lockedText(b)}`;
    return '';
  }
  if (kind === 'spot') {
    if (id === 'arcade' && !st.arcadeOn) return '🔒 Your teacher has not opened the Arcade.';
    if (id === 'bible' && !st.bibleOn) return 'Bible isn’t turned on for you.';
    if (id === 'scienceLab' && !st.bioOpen) return '🔒 The Science Lab opens with your first Biology unit.';
    if (id === 'prepRecall' && !st.arcadeGames.includes('prep-recall')) return 'The prepositions test is on Today’s plan during English Unit 5.';
  }
  if (kind === 'game' && !st.arcadeOn) return '🔒 Your teacher has not opened the Arcade.';
  if (kind === 'grade' && !st.hoods.includes(id)) return 'That grade isn’t in your town yet.';
  return '';
}

function answerFor(entry, st = api.state(), also = []){
  const block = entry.go ? blocker(entry.go, st) : '';
  /* a locked building still gets a button: it goes to its class page and points at the locked tile */
  const goable = entry.go && (!block || entry.go.startsWith('building:'));
  const label = entry.go?.startsWith('building:') && block ? 'Show me' : t('Take me there');
  let html = `<b>${esc(entry.emoji || '')} ${esc(entry.title)}</b><br>${esc(entry.text)}`;
  if (block) html += `<span class="hb-lock">${esc(block)}</span>`;
  if (entry.id === 'faq:locked' || entry.id === 'faq:test') {   // name the next locked place in her grade, if any
    const next = api.data.BUILDINGS.find(b => b.hood === st.hood && b.open && !st.unitOpen(b.id));
    if (next && entry.id === 'faq:locked') html += `<small>For example: ${esc(next.emoji)} ${esc(next.name)}: ${esc(st.lockedText(next))}</small>`;
  }
  if (goable) html += `<br><button type="button" class="hb-go" data-hb-go="${esc(entry.go)}">${esc(label)}</button>`;
  if (also.length) { lastHits = also; html += `<small>Also:</small>${also.map((h, i) => `<button type="button" class="hb-pick" data-hb-pick="${i}">${esc(h.entry.emoji || '')} ${esc(h.entry.title)}</button>`).join('')}`; }
  say(html);
}

function whatNext(st){
  const n = st.next;
  if (n) { say(`Next on Today’s plan: <b>${esc(n.label)}</b>${n.open ? `<br><button type="button" class="hb-go" data-hb-go="${esc(api.data.BUILDINGS.some(b => b.id === n.open) ? 'building:' + n.open : 'spot:' + n.open)}">${esc(t('Take me there'))}</button>` : ''}`); return; }
  if (st.planDone) { say('Today’s plan is done! 🎉 Tap ✅ I’m done for today on the town page, or ask about the Arcade.'); return; }
  const first = api.data.BUILDINGS.find(b => b.hood === st.hood && b.subject === 'math' && b.open && st.unitOpen(b.id) && !st.unitPassed(b.id));
  say(`Start with Today’s plan at the top of your town.${first ? ` A good next step: ${esc(first.emoji)} <b>${esc(first.name)}</b>.<br><button type="button" class="hb-go" data-hb-go="building:${esc(first.id)}">${esc(t('Take me there'))}</button>` : ''}`);
}

/* ---------- going places: only through the app's own doors ---------- */
function flash(el){ document.querySelectorAll('.hb-flash').forEach(x => x.classList.remove('hb-flash')); if (!el) return; el.scrollIntoView({behavior:'smooth', block:'center'}); el.classList.add('hb-flash'); setTimeout(() => el.classList.remove('hb-flash'), 2600); }
function goTo(go){
  const st = api.state(), i = go.indexOf(':'), kind = go.slice(0, i), id = go.slice(i + 1);
  const block = blocker(go, st);
  if (kind === 'screen') { api.home(); return; }
  if (kind === 'class') { api.showClass(id); return; }
  if (kind === 'grade') { if (!block) api.showGrade(id); return; }
  if (kind === 'building') {
    const b = api.data.BUILDINGS.find(x => x.id === id); if (!b) return;
    if (block) {   // locked or not built: the class page, pointing at its tile
      if (b.hood !== st.hood && st.hoods.includes(b.hood)) api.showGrade(b.hood);
      api.showClass(b.subject);
      setTimeout(() => flash([...document.querySelectorAll('#town .tile')].find(el => normalize(el.querySelector('.tn')?.textContent || '') === normalize(b.name))), 60);
      return;
    }
    if (b.hood !== st.hood && st.hoods.includes(b.hood)) api.showGrade(b.hood);
    api.openSpot(id); return;
  }
  if (kind === 'spot') { if (!block) api.openSpot(id); return; }
  if (kind === 'game') {
    if (block) return;
    api.openSpot('arcade');
    setTimeout(() => flash(document.querySelector(`#arcadeWrap [data-arcade-start="${CSS.escape(id)}"]`)?.closest('.arcade-card')), 400);
  }
}
