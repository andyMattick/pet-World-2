/* 🧭 The teacher app's tour guide (docs/TOUR.md). The engine and step lists are in src/shared/tour.ts.
   - "Teacher tour" the first time a teacher or parent account sees the class dashboard (with a class).
   - "Getting started" the first time an account has no class yet (how to make a class and add students).
   Remembered per teacher account in this browser's localStorage (petworld-tour:<user id>). A 🧭 Tour button in the
   header and "🧭 Take the tour" in the helper replay it. It only points at things: nothing is opened or changed. */
import { TOURS, runTour, tourRunning, pendingSteps, markSeen, normTours, type TourStore } from '../shared/tour';
import { translateText } from '../shared/language';

export interface TeacherTourApi {
  state: () => { ready: boolean; hasClass: boolean; adminView: boolean; tab: string };
  userId: () => Promise<string | null>;
  goTab: (tab: string) => void;     // through the app's own renderMain()
}
let api: TeacherTourApi, uid: string | null = null, checking = false;
const key = () => `petworld-tour:${uid}`;
function load(): TourStore { try { return normTours(JSON.parse(localStorage.getItem(key()) || '{}')); } catch { return {}; } }
function store(s: TourStore) { try { localStorage.setItem(key(), JSON.stringify(s)); } catch { /* private mode: it shows again next time */ } }

const detailOpen = () => { const d = document.getElementById('detail'); return !!d && !d.hidden; };
function whichTour(): 'teacher' | 'teacherStart' | null {
  const st = api.state();
  if (!st.ready || st.adminView || detailOpen()) return null;
  if (st.hasClass) return st.tab === 'dashboard' && document.querySelector('#report .summary') ? 'teacher' : null;
  return document.querySelector('#main .empty') ? 'teacherStart' : null;
}
function run(id: 'teacher' | 'teacherStart', replay: boolean) {
  if (tourRunning() || !uid) return false;
  const def = TOURS[id], steps = replay ? def.steps : pendingSteps(def, load()[id]);
  if (!steps.length) return false;
  return runTour(def, { steps, translate: translateText, onEnd: () => store(markSeen(load(), def)) });
}
async function tick() {
  if (checking || tourRunning()) return;
  checking = true;
  try {
    const id = whichTour(); if (!id) return;
    if (!uid) uid = await api.userId();
    if (uid) run(id, false);
  } finally { checking = false; }
}
/* the helper's "🧭 Take the tour" and the header button */
export function replayTeacherTour() {
  const st = api.state();
  if (!st.ready || tourRunning()) return;
  const start = async () => {
    if (!uid) uid = await api.userId();
    if (!st.hasClass) { run('teacherStart', true); return; }
    if (st.tab !== 'dashboard') api.goTab('dashboard');
    let tries = 30;   // the dashboard loads its report first
    const wait = () => { if (document.querySelector('#report .summary')) run('teacher', true); else if (tries-- > 0) setTimeout(wait, 150); };
    wait();
  };
  void start();
}
function addHeaderButton() {
  const row = document.querySelector('header.top .row');
  if (!row || row.querySelector('[data-tour-replay]')) return;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'btn small'; b.dataset.tourReplay = ''; b.title = 'Take the tour'; b.textContent = '🧭 Tour';
  b.addEventListener('click', replayTeacherTour);
  row.insertBefore(b, row.querySelector('.language-toggle'));
}
export function initTeacherTour(options: TeacherTourApi) {
  api = options;
  addHeaderButton();
  setInterval(() => {
    addHeaderButton();
    const ready = api.state().ready, b = document.querySelector<HTMLElement>('header.top [data-tour-replay]');
    if (b) b.hidden = !ready;
    if (!ready) uid = null;   // signed out: the next account has its own tours
    void tick();
  }, 800);
}
