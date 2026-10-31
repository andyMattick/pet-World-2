/* 🧭 Tour guide (docs/TOUR.md): a short, non-AI, coach-mark walk-through the first time each kind of person arrives.
   It dims the page, rings one real element, and shows a small bubble with 1–2 plain sentences (Back / Next / Skip tour).
   It only points: the overlay takes every tap, so nothing on the page can be opened through it, and no gate (PIN,
   today's video, locks, Bible first) is touched. A step whose element isn't on screen (a folded section, a locked or
   teacher-hidden thing) is left out by itself, so the tour never breaks when the page changes.
   Spanish: every title and text below is a key in src/shared/language.ts (tourTranslations); the apps' installLanguage
   translates the bubble like the rest of the page. scripts/check-tour.mjs checks the selectors, step counts and Spanish.
   No imports (the apps pass their translator in), so the check runs this file in node. */

export interface TourCtx { hood?: string; [key: string]: unknown }
export interface TourStep {
  id: string;            // stable: a new tour version re-shows only step ids not seen before
  sel: string;           // CSS selector of the element to ring ('' = a centered bubble with no ring)
  has?: string;          // ...the first match whose text contains this (for cards without an id or class)
  title: string;
  text: string;
  when?: (ctx: TourCtx) => boolean;
}
export interface TourDef { id: string; version: number; name: string; steps: TourStep[] }
export interface TourRecord { v: number; seen: string[]; at: number }
export type TourStore = Record<string, TourRecord>;

const notG4 = (c: TourCtx) => c.hood !== 'g4', g4 = (c: TourCtx) => c.hood === 'g4';

export const TOURS: Record<string, TourDef> = {
  /* a student's first time in her town (renderHome). 6th and 4th grade get their own classes step. */
  town: { id: 'town', version: 1, name: 'Town tour', steps: [
    { id: 'plan', sel: '#scr-home .plan-card', title: '👋 Welcome! Start with Today’s plan', text: 'Come here first every day. Do the rows from top to bottom and tap Go to open each one.' },
    { id: 'classes6', sel: '#scr-home .class-grid', when: notG4, title: '🏫 Your classes', text: 'Math, History, Biology and English. Tap a class to see its units, which open one at a time as you pass each test.' },
    { id: 'classes4', sel: '#scr-home .class-tile[data-class="math"]', when: g4, title: '➗ Your 4th grade Math', text: 'Tap Math to see your units. The 🍋 Lemonade Stand comes first, and a new unit opens when you pass the test of the one before.' },
    { id: 'words', sel: '#scr-home .wow-card', title: '📚 Words of the Week', text: 'Your new words for 5 practice days. Tap 🐾 Practice for today’s Paw Path.' },
    { id: 'helper', sel: '#scr-home .helper-box', title: '🐾 Your helper pet', text: 'Your pet helps you in every shop, and you can tap it to pick a different helper. Decorations you earn go on the shelf beside it.' },
    { id: 'coins', sel: '#coinCount', title: '🪙 Coins', text: 'You earn coins and tips when you practice. Spend them in the 🛍️ Pet Shop on stickers for your room.' },
    { id: 'arcade', sel: '#scr-home .tile[data-open="arcade"]', title: '🕹️ Arcade', text: 'Practice time opens Arcade time. Your teacher decides when the Arcade is open.' },
    { id: 'helpbot', sel: '.hb-btn', title: '🐾 Ask the helper', text: 'Lost? Tap here and ask “Where is the Arcade?”, or tap 🧭 Take the tour to see this again.' }
  ] },
  /* "I'm just here for the games" guests (the games-only Arcade) */
  games: { id: 'games', version: 1, name: 'Arcade tour', steps: [
    { id: 'pick', sel: '#arcadeWrap .arcade-card', title: '🕹️ Pick a game', text: 'Tap Play on any card to start. Each game explains its own rules.' },
    { id: 'rules', sel: '#arcadeWrap .arcade-summary', title: '🎟️ Games only', text: 'No time limit, and no coins or tickets. Nothing from this visit is saved.' },
    { id: 'exit', sel: '#arcadeWrap [data-games-only-exit]', title: '🚪 Exit games', text: 'Tap Exit games to go back to the sign-in screen.' }
  ] },
  /* the grown-up progress report in the student app (renderParent, from Town Hall) */
  parent: { id: 'parent', version: 1, name: 'Progress report tour', steps: [
    { id: 'ideas', sel: '#scr-parent .panel', has: 'Ideas or arithmetic?', title: '💡 Ideas or arithmetic?', text: 'Shows whether her misses come from understanding the problem or from the arithmetic.' },
    { id: 'time', sel: '#scr-parent .panel', has: 'Practice time', title: '⏱️ Practice time', text: 'Only active minutes count. The bars show the last two weeks.' },
    { id: 'units', sel: '#scr-parent .prog-report', title: '📊 Progress by subject and unit', text: 'Each unit shows what is mastered, still practicing or not started. Tap a unit to open it.' },
    { id: 'idle', sel: '#idleParent', title: '⏸️ “Still there?”', text: 'Choose when her pet asks “Still there?” and when Pet World pauses, so idle time doesn’t count.' },
    { id: 'back', sel: '#scr-parent [data-go="home"]', title: '🏠 Back to town', text: 'Tap here when you’re done. The 👩‍🏫 button at the top opens the full teacher page.' }
  ] },
  /* a teacher's or parent's first time in the teacher app, with a class */
  teacher: { id: 'teacher', version: 1, name: 'Teacher tour', steps: [
    { id: 'dashboard', sel: '#report .summary', title: '📊 Your class dashboard', text: 'It updates live as students practice. Struggles, mix-ups, practice time and alerts are all on this page.' },
    { id: 'students', sel: '#report .student-jump', title: '👤 Each student’s page', text: 'Tap a name for that student’s grades, work, practice time, transcript and settings.' },
    { id: 'waiting', sel: '#report .card', has: 'Waiting for a grown-up', title: '🧑‍🏫 Waiting for a grown-up', text: 'Projects, chapter notes and written answers nobody has checked yet. Tap one to open it.' },
    { id: 'roster', sel: '#main .tab[data-tab="roster"]', title: '👥 Roster and PIN cards', text: 'Add students, print their PIN cards, reset a PIN, and 👀 Look at a student’s town.' },
    { id: 'settings', sel: '#main .tab[data-tab="settings"]', title: '⚙️ Settings and 🧭 Quick setup', text: 'Every class choice lives here. 🧭 Quick setup at the top lists every on/off switch on one page.' },
    { id: 'code', sel: '#main .tabs .muted b', title: '🔑 Class code', text: 'Students type this code to join. 🐾 Student view opens Pet World with it filled in.' },
    { id: 'helpbot', sel: '.hb-btn', title: '❓ Ask the helper', text: 'Ask “How do I reset a PIN?” or “Turn off the Arcade” and it takes you there. You can replay this tour from it, or from 🧭 Tour at the top.' }
  ] },
  /* the teacher app before there is a class */
  teacherStart: { id: 'teacherStart', version: 1, name: 'Getting started tour', steps: [
    { id: 'welcome', sel: '#main .empty', title: '👋 Welcome to Pet World for Teachers', text: 'First make a class. Then you add students and choose what they can use.' },
    { id: 'name', sel: '#newClass', title: '✏️ Name your class', text: 'Type a name here, like “Period 3” or “Our homeschool”.' },
    { id: 'add', sel: '#addClass', title: '➕ Add class', text: 'This makes your class code and opens 🧭 Quick setup, where you turn things on or off.' },
    { id: 'students', sel: '.side', title: '👥 Then add students', text: 'Your class shows here. Open it, go to the Roster tab, type one name per line, and print the PIN cards.' },
    { id: 'helpbot', sel: '.hb-btn', title: '❓ Ask the helper', text: 'Ask “How do I add students?” any time. 🧭 Tour at the top replays this.' }
  ] }
};

/* the words around the bubble (also keys in language.ts) */
export const TOUR_UI = { back: 'Back', next: 'Next', done: 'Done', skip: 'Skip tour', kicker: '🧭 Tour' };

/* ---------- what's remembered ---------- */
export function normTours(raw: unknown): TourStore {
  const out: TourStore = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, r] of Object.entries(raw as Record<string, any>)) {
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(id) || !r || typeof r !== 'object') continue;
    out[id] = { v: Math.max(0, Math.floor(+r.v || 0)), seen: Array.isArray(r.seen) ? [...new Set(r.seen.filter((s: unknown) => typeof s === 'string' && s.length <= 30))].slice(0, 40) as string[] : [], at: Math.max(0, +r.at || 0) };
  }
  return out;
}
/* two devices: a tour seen on either counts as seen (newest version, every step id seen on either) */
export function mergeTours(a: unknown, b: unknown): TourStore {
  const x = normTours(a), y = normTours(b), out: TourStore = { ...x };
  for (const [id, r] of Object.entries(y)) {
    const m = out[id];
    out[id] = m ? { v: Math.max(m.v, r.v), seen: [...new Set([...m.seen, ...r.seen])].slice(0, 40), at: Math.max(m.at, r.at) } : r;
  }
  return out;
}
/* steps still to show: all of them the first time; after a new version only the step ids not seen before; else none */
export function pendingSteps(def: TourDef, rec: TourRecord | undefined): TourStep[] {
  if (!rec) return def.steps;
  if (rec.v >= def.version) return [];
  return def.steps.filter(s => !rec.seen.includes(s.id));
}
export function markSeen(store: TourStore, def: TourDef, now = Date.now()): TourStore {
  const old = store[def.id];
  return { ...store, [def.id]: { v: def.version, seen: [...new Set([...(old?.seen || []), ...def.steps.map(s => s.id)])], at: now } };
}

/* ---------- the overlay ---------- */
const STYLE = `
.tour-root{position:fixed;inset:0;z-index:2000;touch-action:none}
.tour-shade{position:fixed;inset:0;background:rgba(24,14,44,.58)}
.tour-hole{position:fixed;border-radius:14px;box-shadow:0 0 0 200vmax rgba(24,14,44,.58);outline:3px solid #ffb703;outline-offset:2px;pointer-events:none;transition:left .25s,top .25s,width .25s,height .25s}
.tour-bubble{position:fixed;width:min(340px,calc(100vw - 24px));box-sizing:border-box;background:#fff;color:#2b2140;border-radius:16px;padding:14px 16px 12px;box-shadow:0 12px 34px rgba(0,0,0,.35);font:15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;transition:left .25s,top .25s}
.tour-bubble:focus{outline:3px solid #6b4fd8;outline-offset:2px}
.tour-kicker{margin:0 0 2px;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#6b4fd8}
.tour-bubble h2{margin:0 0 4px;font-size:17px;line-height:1.25}
.tour-bubble p.tour-text{margin:0}
.tour-dots{display:flex;gap:5px;justify-content:center;margin:10px 0 8px}
.tour-dots i{width:8px;height:8px;border-radius:50%;background:#d8cff8}
.tour-dots i.on{background:#6b4fd8}
.tour-btns{display:flex;gap:8px;align-items:center}
.tour-btns .tour-gap{flex:1}
.tour-btns button{font:inherit;font-size:14px;font-weight:700;border-radius:999px;padding:7px 14px;cursor:pointer;border:2px solid #6b4fd8;background:#fff;color:#4b32b8;min-height:36px}
.tour-btns button[data-tour-next]{background:#6b4fd8;color:#fff}
.tour-btns button[data-tour-skip]{border-color:transparent;background:none;color:#5d5470;padding-left:4px;padding-right:4px;text-decoration:underline}
.tour-btns button:focus-visible{outline:3px solid #ffb703;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.tour-hole,.tour-bubble{transition:none}}
@media print{.tour-root{display:none!important}}
`;

let running: null | { close: (how: 'skip' | 'done') => void } = null;
export const tourRunning = () => !!running;
export function closeTour() { running?.close('skip'); }

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const visible = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[hidden]'); };
export function findTarget(step: TourStep, translate: (s: string) => string = s => s, doc: Document = document): Element | null {
  if (!step.sel) return null;
  const has = step.has ? [step.has, translate(step.has).trim()] : [];   // the page may be in Spanish
  for (const el of doc.querySelectorAll(step.sel)) if (visible(el) && (!has.length || has.some(h => (el.textContent || '').includes(h)))) return el;
  return null;
}
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface RunOptions { ctx?: TourCtx; steps?: TourStep[]; translate?: (s: string) => string; onEnd?: (how: 'done' | 'skip', shown: number) => void }
/* runs a tour; returns false (and calls nothing) when none of its steps is on screen */
export function runTour(def: TourDef, opts: RunOptions = {}): boolean {
  if (running) return false;
  const ctx = opts.ctx || {};
  /* steps whose element is drawn at all; one that is hidden when its turn comes (folded, locked, not shown yet) is left out
     then, so a corner button that appears a moment later (the helper) still gets its step */
  const list = (opts.steps || def.steps).filter(s => (!s.when || s.when(ctx)) && (!s.sel || document.querySelector(s.sel))).slice(0, 7);
  const ok = (s: TourStep) => !s.sel || !!findTarget(s, opts.translate);
  while (list.length && !ok(list[0])) list.shift();
  if (!list.length) return false;
  if (!document.getElementById('tour-style')) { const st = document.createElement('style'); st.id = 'tour-style'; st.textContent = STYLE; document.head.appendChild(st); }
  const before = document.activeElement as HTMLElement | null;
  const root = document.createElement('div'); root.className = 'tour-root';
  root.innerHTML = `<div class="tour-hole" hidden></div><div class="tour-shade" hidden></div>
    <div class="tour-bubble" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourText" tabindex="-1"></div>`;
  document.body.appendChild(root);
  const hole = root.querySelector<HTMLElement>('.tour-hole')!, shade = root.querySelector<HTMLElement>('.tour-shade')!, bubble = root.querySelector<HTMLElement>('.tour-bubble')!;
  let i = 0, target: Element | null = null, raf = 0, timer = 0;

  const place = () => {
    const vw = innerWidth, vh = innerHeight, pad = 6, gap = 12, bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    if (!target || !target.isConnected) {
      hole.hidden = true; shade.hidden = false;
      bubble.style.left = Math.max(12, (vw - bw) / 2) + 'px'; bubble.style.top = Math.max(12, (vh - bh) / 2) + 'px'; return;
    }
    const r = target.getBoundingClientRect();
    const top = Math.max(4, r.top - pad), bottom = Math.min(vh - 4, r.bottom + pad), left = Math.max(4, r.left - pad), right = Math.min(vw - 4, r.right + pad);
    shade.hidden = true; hole.hidden = false;
    Object.assign(hole.style, { left: left + 'px', top: top + 'px', width: Math.max(0, right - left) + 'px', height: Math.max(0, bottom - top) + 'px' });
    let y: number;
    if (vh - bottom >= bh + gap) y = bottom + gap;            // below
    else if (top >= bh + gap) y = top - gap - bh;             // above
    else y = vh - bh - 12;                                    // tall target: the bubble sits at the bottom, over it
    const x = Math.min(vw - bw - 12, Math.max(12, (left + right) / 2 - bw / 2));
    bubble.style.left = x + 'px'; bubble.style.top = Math.max(12, Math.min(vh - bh - 12, y)) + 'px';
  };
  const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };

  const draw = () => {
    const s = list[i], last = i === list.length - 1;
    target = findTarget(s, opts.translate);
    bubble.innerHTML = `<p class="tour-kicker">${esc(TOUR_UI.kicker)}</p><h2 id="tourTitle">${esc(s.title)}</h2><p class="tour-text" id="tourText">${esc(s.text)}</p>
      ${list.length > 1 ? `<div class="tour-dots" role="img" aria-label="${esc(`Step ${i + 1} of ${list.length}`)}">${list.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>` : '<div style="height:10px"></div>'}
      <div class="tour-btns">${last ? '' : `<button type="button" data-tour-skip>${esc(TOUR_UI.skip)}</button>`}<span class="tour-gap"></span>${i > 0 ? `<button type="button" data-tour-back>${esc(TOUR_UI.back)}</button>` : ''}<button type="button" data-tour-next>${esc(last ? TOUR_UI.done : TOUR_UI.next)}</button></div>`;
    const bring = (behavior: ScrollBehavior) => {
      if (!target) return;
      const r = target.getBoundingClientRect(), tall = r.height > innerHeight * 0.55;
      const fixed = (() => { for (let e: Element | null = target; e; e = e.parentElement) if (getComputedStyle(e).position === 'fixed') return true; return false; })();
      if (!fixed && (r.top < 70 || r.bottom > innerHeight - 40) && !(tall && r.top >= 0 && r.top < innerHeight * 0.4)) target.scrollIntoView({ block: tall ? 'start' : 'center', behavior });
    };
    bring(reduced() ? 'auto' : 'smooth');
    place(); clearTimeout(timer);
    timer = window.setTimeout(() => { bring('auto'); place(); }, reduced() ? 30 : 450);   // a smooth scroll that got cut short
    bubble.focus({ preventScroll: true });
  };
  const close = (how: 'skip' | 'done') => {
    if (!running) return;
    running = null; clearTimeout(timer); cancelAnimationFrame(raf);
    removeEventListener('resize', onMove); removeEventListener('scroll', onMove, true);
    root.remove();
    try { before?.focus?.({ preventScroll: true }); } catch { /* gone */ }
    opts.onEnd?.(how, list.length);
  };
  const go = (d: number) => {
    let n = i + d;
    while (n >= 0 && n < list.length && !ok(list[n])) { list.splice(n, 1); if (d < 0) n--; if (n < i) i--; }
    if (n < 0) return;
    if (n >= list.length) { close('done'); return; }
    i = n; draw();
  };
  root.addEventListener('click', e => {
    const el = e.target as Element;
    if (el.closest('[data-tour-next]')) go(1); else if (el.closest('[data-tour-back]')) go(-1); else if (el.closest('[data-tour-skip]')) close('skip');
    e.stopPropagation();
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close('skip'); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return; }
    if (e.key === 'Tab') {   // keep focus inside the bubble
      const f = [...bubble.querySelectorAll<HTMLElement>('button')]; if (!f.length) return;
      const at = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && at <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && at === f.length - 1) { e.preventDefault(); f[0].focus(); }
      else if (at < 0) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
    }
  });
  addEventListener('resize', onMove); addEventListener('scroll', onMove, true);
  running = { close };
  draw();
  return true;
}
