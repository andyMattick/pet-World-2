/* ✍️ Red Pen Desk, the Arcade copy (docs/RED-PEN-DESK.md, docs/ARCADE-GAMES.md). Same papers and grading as Word
   Workshop (src/shared/redPen.js); 9 papers a round; 1 ticket per 3 papers graded perfectly, up to 3 a round (paid by
   arcadeModuleMessage in src/game/game.js). Never coins, never mastery. */
import { makeRedPenRound, tapIsRight, spellingIsRight, patternIsRight, PATTERN_SHORT, plainWord } from '../../src/shared/redPen.js';
import { patternById } from '../../src/shared/spellingPatterns.js';
import { VOCAB_WORDS, PATTERN_WORDS } from '../../src/shared/vocab.js';
import { wordPartsFor } from '../../src/shared/wordParts.js';

const params = new URLSearchParams(location.search), ARCADE_RUN = params.get('arcadeRun') || '';
const app = document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const PAPERS = 9;
let best = 0; try { best = +localStorage.getItem('red-pen:best') || 0; } catch (e) {}
let words = null, fromWeek = false, run = null;

/* her words of the week from the Arcade (Word Workshop), or 20 of Pet World's words when opened on its own */
const builtIn = () => shuffle([...VOCAB_WORDS, ...PATTERN_WORDS].filter(v => plainWord(v.w))).slice(0, 20);
function askForWords(){
  return new Promise(resolve => {
    if (!ARCADE_RUN || window.parent === window) { resolve(null); return; }
    const done = list => { window.removeEventListener('message', on); clearTimeout(timer); resolve(list); };
    const on = e => { const d = e.data; if (e.origin === location.origin && d?.type === 'arcade:words' && d.runId === ARCADE_RUN && Array.isArray(d.words)) done(d.words.filter(v => v && plainWord(v.w)).map(v => ({ w: String(v.w), d: String(v.d || ''), s: String(v.s || '') }))); };
    const timer = setTimeout(() => done(null), 800);
    window.addEventListener('message', on);
    try { window.parent.postMessage({ type: 'arcade:words-request', gameId: 'red-pen', runId: ARCADE_RUN }, location.origin); } catch (e) { done(null); }
  });
}

function renderStart(){
  run = null;
  app.innerHTML = `<div class="rp-top"><h1>✍️ Red Pen Desk</h1></div>
    <div class="rp-card"><p>You’re the teacher! Pet students turn in papers with ${fromWeek ? 'your words of the week' : 'Pet World words'}. Most papers have <b>one</b> misspelled word. Some have none.</p>
    <ol><li>Tap the misspelled word (or ✅ Looks good!)</li><li>Write it the right way</li><li>Pick what kind of mistake it was</li></ol>
    <p class="muted">${PAPERS} papers. 🎟️ 1 ticket for every 3 papers graded perfectly (up to 3).${best ? ` Your best: ⭐ ${best}.` : ''}</p>
    <div class="row"><button type="button" class="btn berry" data-start>Start grading ▶</button></div></div>`;
}
function start(){
  const papers = makeRedPenRound(words, Math.random, { papers: PAPERS });
  run = { papers, order: papers.map(p => p.id), back: {}, graded: [], streak: 0, bestStreak: 0, cur: null };
  next();
}
const left = () => run.order.filter(id => !run.graded.some(g => g.id === id));
function next(){
  const id = left()[0];
  if (!id) { finish(); return; }
  run.cur = { id, step: 'tap', slip: !!run.back[id], msg: '' };
  render();
}
const paperOf = id => run.papers.find(p => p.id === id);
function render(){
  const r = run.cur, paper = paperOf(r.id), t = paper.target, fixed = r.step === 'kind' || r.step === 'done', circled = !['tap', 'back'].includes(r.step) && t >= 0;
  const slot = i => { const sl = paper.slots[i];
    if (r.step === 'tap') return `<button type="button" class="rp-word" data-tap="${i}">${esc(sl.shown)}</button>`;
    if (i === t && fixed) return `<span class="rp-word rp-fixed"><s>${esc(sl.shown)}</s> <b>${esc(sl.right)}</b></span>`;
    return `<span class="rp-word${i === t && circled ? ' rp-circled' : ''}">${esc(sl.shown)}</span>`; };
  const lines = paper.lines.map(line => `<li>${line.map(x => (x.slot != null ? slot(x.slot) : esc(x.text))).join('')}</li>`).join('');
  const wrong = t >= 0 ? paper.slots[t].shown : '', right = t >= 0 ? paper.slots[t].right : '';
  let step = '';
  if (r.step === 'tap') step = `<p><b>Step 1:</b> tap the spelling word that’s misspelled. No mistake? Tap Looks good!</p><div class="row"><button type="button" class="btn rp-ok" data-tap="-1">✅ Looks good! No mistakes</button></div>`;
  else if (r.step === 'back') step = `<p class="rp-msg" role="status">${r.msg}</p><p class="muted">📥 This paper goes back on your pile. You’ll check it again in a little bit.</p><div class="row"><button type="button" class="btn berry" data-next>Next paper ▶</button></div>`;
  else if (r.step === 'spell') step = `${r.msg ? `<p class="rp-msg" role="status">${r.msg}</p>` : ''}<form class="rp-spell" data-spell><label for="rpSpell"><b>Step 2:</b> ✍️ How should “${esc(wrong)}” be spelled?</label><div class="row"><input id="rpSpell" type="text" class="typed-input" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="submit" class="btn berry">Check</button></div></form>`;
  else if (r.step === 'fix') step = `${r.msg}<form class="fix-it" data-fix><p>✍️ Type <b>${esc(right)}</b> to keep going:</p><div class="row"><input type="text" class="typed-input" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type ${esc(right)}"><button type="submit" class="btn berry">OK</button></div></form>`;
  else if (r.step === 'kind') step = `${r.msg ? `<p class="rp-msg ok" role="status">${r.msg}</p>` : ''}<p><b>Step 3:</b> what kind of mistake did ${esc(paper.pet.n)} make? <span class="rp-pair"><s>${esc(wrong)}</s> → <b>${esc(right)}</b></span></p><div class="rp-kinds">${paper.choices.map(id => `<button type="button" class="btn" data-kind="${esc(id)}">${esc(PATTERN_SHORT[id])}</button>`).join('')}</div>`;
  else if (r.step === 'done') step = `<p class="rp-msg${r.kindOk === false ? '' : ' ok'}" role="status">${r.msg}</p><p class="rp-thanks">${esc(paper.pet.e)} <b>${esc(paper.pet.n)}:</b> “${t >= 0 ? `Thanks, teacher! I fixed it: ${esc(right)}.` : 'Thanks, teacher! I checked every word.'}” ${r.slip ? '✔️' : '⭐'}</p><div class="row"><button type="button" class="btn berry" data-next>${left().length ? 'Next paper ▶' : 'Finish ▶'}</button></div>`;
  const stack = run.graded.length ? `<div class="rp-stack">${run.graded.map((g, i) => `<span class="rp-done${g.star ? ' star' : ''}" style="--i:${i}">${esc(paperOf(g.id).pet.e)}<b>${g.star ? '⭐' : '✔️'}</b></span>`).join('')}</div>` : '';
  app.innerHTML = `<div class="rp-top"><h1>✍️ Red Pen Desk</h1><button type="button" class="btn small" data-quit>Stop</button></div>
    <p class="rp-bar"><span>📝 ${run.graded.length} of ${run.papers.length} graded</span><span>⭐ ${run.graded.filter(g => g.star).length}</span>${run.streak > 1 ? `<span>🔥 ${run.streak} in a row</span>` : ''}</p>
    <div class="rp-card rp-desk"><div class="rp-from"><span class="rp-pet" aria-hidden="true">${esc(paper.pet.e)}</span><span><b>${esc(paper.pet.n)}</b> turned in ${paper.kind === 'list' ? 'a spelling list' : `${paper.slots.length} sentences`}${run.back[paper.id] && r.step !== 'back' ? ' <span class="muted">(back from your pile)</span>' : ''}</span></div>
    <div class="rp-paper"><p class="rp-name">${esc(paper.pet.n)} · ${paper.kind === 'list' ? 'Spelling list' : 'Use each spelling word in a sentence'}</p><ol class="rp-lines ${paper.kind === 'list' ? 'rp-list' : 'rp-sents'}">${lines}</ol>${r.step === 'done' ? `<span class="rp-stamp${r.slip ? ' help' : ''}" aria-hidden="true">${r.slip ? '✔️' : '⭐'}</span>` : ''}</div>
    <div class="rp-step">${step}</div>${stack}</div>`;
  app.querySelector('form input')?.focus();
}
function grade(){
  const r = run.cur; if (run.graded.some(g => g.id === r.id)) return;
  run.graded.push({ id: r.id, star: !r.slip });
  run.streak = r.slip ? 0 : run.streak + 1; run.bestStreak = Math.max(run.bestStreak, run.streak);
  r.step = 'done';
}
function sendBack(id){
  const order = run.order.filter(x => x !== id), l = order.filter(x => !run.graded.some(g => g.id === x)), after = l[Math.min(1, l.length - 1)];
  order.splice(after ? order.indexOf(after) + 1 : order.length, 0, id); run.order = order; run.back[id] = (run.back[id] || 0) + 1;
}
function tap(i){
  const r = run.cur, paper = paperOf(r.id); if (r.step !== 'tap') return;
  if (tapIsRight(paper, i)) {
    if (paper.target < 0) { r.msg = '✅ Right! Every word on this paper is spelled correctly.'; grade(); }
    else { r.step = 'spell'; r.msg = `🖍️ You found it! “${esc(paper.slots[i].shown)}” is misspelled.`; }
    render(); return;
  }
  r.slip = true;
  const said = i >= 0 ? `“${esc(paper.slots[i].shown)}” is spelled right.` : 'One word on this paper is misspelled.';
  if (!run.back[r.id]) { r.msg = paper.target < 0 && i >= 0 ? `${said} Read every word again when this paper comes back.` : `Hmm, not that one. ${said}`; r.step = 'back'; sendBack(r.id); render(); return; }
  if (paper.target < 0) { r.msg = `${said} This paper has no mistakes, so it Looks good!`; grade(); render(); return; }
  r.step = 'spell'; r.msg = `${said} Here’s the misspelled one, circled in red: “${esc(paper.slots[paper.target].shown)}”.`; render();
}
function partsHTML(k){
  const e = wordPartsFor(k, words.map(v => v.w.toLowerCase()));
  if (!e || !e.parts || e.parts.length < 2) return '';
  return `<p class="muted">🧩 ${e.parts.map(x => `<b>${esc(x.show || x.text)}</b> (${esc(x.meaning)})`).join(' + ')}${e.gloss ? ` → ${esc(e.gloss)}` : ''}</p>`;
}
function spell(typed){
  const r = run.cur, paper = paperOf(r.id), sl = paper.slots[paper.target];
  if (spellingIsRight(paper, typed)) { r.step = 'kind'; r.msg = `✅ Yes! It’s spelled <b>${esc(sl.right)}</b>.`; render(); return; }
  r.slip = true; const v = words.find(x => x.w.toLowerCase() === sl.k);
  r.step = 'fix'; r.msg = `<p class="ela-feedback">Not quite. It’s spelled “<b>${esc(sl.right)}</b>”${v?.d ? `: ${esc(v.d)}` : '.'}</p>${partsHTML(sl.k)}`;
  render();
}
function kind(id){
  const r = run.cur, paper = paperOf(r.id), ok = patternIsRight(paper, id), pat = patternById(paper.pattern);
  if (!ok) r.slip = true; r.kindOk = ok;
  r.msg = `${ok ? `✅ Yes! <b>${esc(PATTERN_SHORT[paper.pattern])}.</b> ` : `Not quite: it was <b>${esc(PATTERN_SHORT[paper.pattern])}</b>. `}${pat ? esc(pat.tip) : ''}`;
  grade(); render();
}
function finish(){
  const stars = run.graded.filter(g => g.star).length, tickets = Math.min(3, Math.floor(stars / 3));
  if (stars > best) { best = stars; try { localStorage.setItem('red-pen:best', String(best)); } catch (e) {} }
  try { if (ARCADE_RUN && window.parent !== window) window.parent.postMessage({ type: 'arcade:round-complete', gameId: 'red-pen', runId: ARCADE_RUN, roundId: `round-${Date.now()}`, score: stars }, location.origin); } catch (e) {}
  app.innerHTML = `<div class="rp-top"><h1>✍️ Red Pen Desk</h1></div><div class="rp-card"><div class="big-emoji">${stars === PAPERS ? '🎉' : '📝'}</div>
    <h2>⭐ ${stars} of ${PAPERS} papers graded perfectly!</h2>${run.bestStreak > 1 ? `<p>🔥 Best streak: ${run.bestStreak} in a row</p>` : ''}
    <div class="rp-stack">${run.graded.map((g, i) => `<span class="rp-done${g.star ? ' star' : ''}" style="--i:${i}">${esc(paperOf(g.id).pet.e)}<b>${g.star ? '⭐' : '✔️'}</b></span>`).join('')}</div>
    ${ARCADE_RUN ? `<p>🎟️ ${tickets ? `${tickets} ticket${tickets === 1 ? '' : 's'}` : 'No tickets this time (1 for every 3 ⭐ papers)'}${tickets ? '!' : '.'}</p>` : ''}
    <div class="row"><button type="button" class="btn berry" data-start>🔁 Grade another stack</button></div></div>`;
  run = null;
}
app.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-start')) { start(); return; }
  if (!run) return;
  if (b.hasAttribute('data-quit')) { renderStart(); return; }
  if (b.dataset.tap != null) { tap(+b.dataset.tap); return; }
  if (b.dataset.kind) { kind(b.dataset.kind); return; }
  if (b.hasAttribute('data-next') && ['done', 'back'].includes(run.cur?.step)) next();
});
app.addEventListener('submit', e => {
  e.preventDefault(); if (!run) return;
  const f = e.target, inp = f.querySelector('input'), typed = inp.value; if (!typed.trim()) return;
  if (f.hasAttribute('data-spell')) { spell(typed); return; }
  if (f.hasAttribute('data-fix')) {
    const paper = paperOf(run.cur.id);
    if (!spellingIsRight(paper, typed)) { inp.classList.add('incorrect'); inp.select(); return; }
    run.cur.step = 'kind'; run.cur.msg = ''; render();
  }
});
app.innerHTML = '<p class="muted">Getting the papers…</p>';
askForWords().then(list => {
  fromWeek = !!(list && list.length >= 6);
  words = fromWeek ? list : builtIn();
  renderStart();
});
