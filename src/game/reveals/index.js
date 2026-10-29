/* 🎡 How she sees the day's classes (docs/CLASS-WHEEL.md, "How she sees it").
   The classes are already picked (pickClasses in src/shared/classWheel.ts) before any of this runs. A reveal style is
   only the show: it must land on round.picks, in that order, whatever she taps. Nothing here changes the rules.

   A style is {id, title, kicker, css, run(stage, round, ctx)}:
   - stage: an empty <div class="reveal-stage reveal-<id>"> (fills the dialog width, max 320px) for the style to fill.
   - round: {labels:string[], picks:number[]}: every class on this round, and the indexes into labels she gets, in
     reveal order. Labels are plain text (with an emoji); always escape them with ctx.esc.
   - ctx: {quick (reduced motion: keep it short), wait(ms), button(text) (shows a big button under the stage and
     resolves when she taps it), hint(text) (a line under the stage), reveal(i) (call once for each pick, in order,
     the moment that class shows), pet (her pet's emoji), first (the first round of the day), esc, sfx(kind)}.
   - run resolves after the last ctx.reveal. Tap-to-pick styles: whatever she taps shows the next pick.
   - css: the style's own CSS, every rule scoped under .reveal-<id>. Added to the page once. */
import wheel from './wheel.js';
import { darts, balloons, plinko, slots } from './throwers.js';
import { merry, claw, gumball, mail } from './machines.js';
import { cups, fishing, dig, scratch, eggs, fortune } from './hidden.js';

export const REVEAL_STYLES = [wheel, darts, merry, cups, fishing, claw, gumball, balloons, dig, plinko, scratch, eggs, slots, fortune, mail];

const BASE_CSS = `
.reveal-stage{position:relative; width:100%; max-width:320px; margin:8px auto 4px; user-select:none; -webkit-user-select:none; touch-action:manipulation}
.reveal-round{margin:6px 0 0; font-size:.85rem; color:var(--chalk-dim, #b9c7bf); text-align:center}
.reveal-hint{min-height:1.3em; margin:2px 0; font-size:.95rem; text-align:center; color:var(--chalk, #f4f1e6)}
.reveal-go{display:flex; justify-content:center; margin:6px 0}
.reveal-tag{display:inline-block; padding:2px 8px; border-radius:10px; background:#fff; color:#3b2a2a; font-weight:700; font-size:.8rem; line-height:1.2; box-shadow:0 1px 3px rgba(0,0,0,.25); white-space:nowrap}
@keyframes reveal-pop{0%{transform:scale(.3); opacity:0} 70%{transform:scale(1.15); opacity:1} 100%{transform:scale(1)}}
@keyframes reveal-bounce{0%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)}}
@keyframes reveal-wobble{0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)}}
@keyframes reveal-shake{0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)}}
`;

let cssAdded = false;
export function addRevealCSS(){
  if (cssAdded || typeof document === 'undefined') return;
  cssAdded = true;
  const el = document.createElement('style');
  el.id = 'reveal-styles';
  el.textContent = BASE_CSS + REVEAL_STYLES.map(s => s.css || '').join('\n');
  document.head.appendChild(el);
}

/* the day's style: one style a day, picked at random but the same all day (so a reload shows the same show). The days
   go through a shuffled deck of every style, so she sees each one before any comes back, and never the same two days
   in a row. salt gives a second, different deck (the theme-day reveal uses one). */
function seeded(seed){ let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function deck(cycle, n, salt){
  const r = seeded(cycle * 7919 + salt * 104729 + 17), d = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
}
function styleIndex(n, len, salt){
  const cycle = Math.floor(n / len), at = ((n % len) + len) % len, d = deck(cycle, len, salt);
  if (len > 1 && at === 0 && d[0] === deck(cycle - 1, len, salt)[len - 1]) [d[0], d[1]] = [d[1], d[0]];   // no repeat across decks
  return d[at];
}
export function revealStyleFor(day, salt = 0){
  const n = Math.floor(Date.parse(`${day}T12:00:00Z`) / 864e5) || 0;
  return REVEAL_STYLES[styleIndex(n, REVEAL_STYLES.length, salt)];
}
export const revealStyle = id => REVEAL_STYLES.find(s => s.id === id) || null;

/* run every round in one box. box gets the stage, hint and button; reveal(roundIndex, labelIndex) is called per pick. */
export async function runReveal(style, box, rounds, opts){
  addRevealCSS();
  const quick = !!opts.quick, wait = ms => new Promise(ok => setTimeout(ok, quick ? Math.min(ms, 350) : ms));
  const caption = box.querySelector('.reveal-round'), stage = box.querySelector('.reveal-stage');
  const hintEl = box.querySelector('.reveal-hint'), go = box.querySelector('.reveal-go');
  for (const [ri, round] of rounds.entries()) {
    stage.className = `reveal-stage reveal-${style.id}`; stage.innerHTML = ''; stage.removeAttribute('style');
    if (caption) caption.textContent = round.caption || '';
    hintEl.textContent = ''; go.innerHTML = '';
    let next = 0;
    const ctx = {
      quick, wait, first:ri === 0, pet:opts.pet || '🐶', esc:opts.esc, sfx:opts.sfx || (() => {}),
      hint:text => { hintEl.textContent = text || ''; },
      button:text => new Promise(ok => {
        go.innerHTML = `<button type="button" class="btn berry">${opts.esc(text)}</button>`;
        const b = go.querySelector('button');
        b.addEventListener('click', () => { go.innerHTML = ''; ok(); }, {once:true});
        b.focus();
      }),
      reveal:i => {
        if (next >= round.picks.length) return;
        const want = round.picks[next++];
        opts.reveal(ri, i === want ? i : want);
      }
    };
    await style.run(stage, round, ctx);
    while (next < round.picks.length) ctx.reveal(round.picks[next]);   // a style that missed one still lists them all
    hintEl.textContent = '';
    if (ri < rounds.length - 1) await wait(900);
  }
}
