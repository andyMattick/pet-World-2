/* 🧭 The student app's tour guide (docs/TOUR.md). The engine and step lists are in src/shared/tour.ts.
   - Town tour: the first time she reaches her town. It runs before the daily pop-ups (Bible first card, brain stretch,
     theme question, warm-up): game.js's checks wait while tourHold() is true, and resume() runs them when it ends.
   - Progress report tour: the first time a grown-up opens the progress report (renderParent).
   - Arcade tour: the first time on this browser someone comes in with "I'm just here for the games".
   Remembered in her save (S.tour, merged across devices by mergeTours) or, for games guests, in this browser.
   Look-only mode never shows it and never saves it. It only points at things; every gate stays where it is. */
import { TOURS, runTour, tourRunning, pendingSteps, markSeen, normTours } from '../shared/tour';
import { translateText } from '../shared/language';

const GUEST_KEY = 'petworld-tour-games';
let api = null;

export const tourHold = () => tourRunning();

function guestStore(){ try { return normTours(JSON.parse(localStorage.getItem(GUEST_KEY) || '{}')); } catch(e){ return {}; } }

/* which tour belongs to this screen (or null) */
function tourFor(screen, st){
  if (st.gamesOnly) return screen === 'arcade' ? 'games' : null;
  if (screen === 'home') return 'town';
  if (screen === 'parent') return 'parent';
  return null;
}

function run(id, replay){
  if (!api || tourRunning()) return false;
  const st = api.state();
  if (st.lookOnly) return false;   // look only: never shown, never saved
  const def = TOURS[id];
  const store = id === 'games' ? guestStore() : normTours(st.tours);
  const steps = replay ? def.steps : pendingSteps(def, store[id]);
  if (!steps.length) return false;
  return runTour(def, { steps, ctx: { hood: st.hood }, translate: translateText, onEnd: () => {
    if (id === 'games') { try { localStorage.setItem(GUEST_KEY, JSON.stringify(markSeen(guestStore(), def))); } catch(e){} }
    else api.saveTours(markSeen(normTours(api.state().tours), def));
    api.resume();   // the daily pop-ups come now (they waited for the tour)
  } });
}

/* game.js's show() calls this for every screen, before its daily pop-up checks */
export function tourOnShow(screen){
  if (!api) return;
  const st = api.state();
  if (st.lookOnly || !st.signedIn && !st.gamesOnly) return;
  if (st.blocked) return;   // another pop-up is already open (e.g. a returning tab): don't stack on it
  const id = tourFor(screen, st);
  if (id) run(id, false);
}

/* replay: from the help bot ("🧭 Take the tour") or the small 🧭 links */
export function replayTour(which){
  if (!api) return false;
  const st = api.state();
  const id = which && TOURS[which] ? which : tourFor(st.screen, st) || 'town';
  if (id === 'town' && st.screen !== 'home') api.home();
  setTimeout(() => run(id, true), id === 'town' && st.screen !== 'home' ? 120 : 0);
  return true;
}

/* a small "🧭 Tour" button on the progress report and the games-only Arcade (the helper bot is hidden there) */
function addLinks(){
  if (!api || api.state().lookOnly) return;
  for (const [wrap, id, where] of [['#parentWrap .backrow', 'parent', 'beforeend'], ['#arcadeWrap .backrow', 'games', 'beforeend']]) {
    const row = document.querySelector(wrap);
    if (!row || row.querySelector('[data-tour-replay]')) continue;
    if (id === 'games' && !api.state().gamesOnly) continue;
    row.insertAdjacentHTML(where, `<button type="button" class="btn small" data-tour-replay="${id}" title="Take the tour">🧭 Tour</button>`);
  }
}

export function initStudentTour(options){
  api = options;
  document.addEventListener('click', e => { const b = e.target.closest('[data-tour-replay]'); if (b) { e.preventDefault(); replayTour(b.dataset.tourReplay); } });
  setInterval(addLinks, 700); addLinks();
  /* a town already on screen before this ran (local mode boots before the end of game.js) */
  const st = api.state();
  if (st.screen === 'home' && !st.blocked) setTimeout(() => { if (!tourRunning() && !api.state().blocked) tourOnShow('home'); }, 0);
}
