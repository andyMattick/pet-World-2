/* Teacher app: Vocabulary tab (docs: VOCAB.md). The class word list lives in classes.game_settings.vocab
   ({builtIn, words, focus}), which students already receive, so no new database column is needed. */
import { esc } from './report';
import { VOCAB_WORDS, VOCAB_LIMITS, vocabList, wordKey, wordStatus, STATUS_TEXT, parseVocabImport, missingLines, validWord, findWord, blankSentence, PATTERN_WORDS } from '../shared/vocab';
import { patternSummary, patternById } from '../shared/spellingPatterns';
import { dictLinkHTML } from './wordPick';

interface VocabWord { w: string; d: string; s?: string; set?: string }
export interface ClassVocab { builtIn?: boolean; words?: VocabWord[]; focus?: string[]; dismissed?: string[] }   // dismissed: flagged words the teacher said no to
interface VocabClass { id: string; name: string; game_settings: { vocab?: ClassVocab; [key: string]: unknown } | null }
type SaveVocab = (vocab: ClassVocab) => Promise<string | null>;
/* each student's answer history per word (state.vocab.stats), or null if it couldn't be loaded */
export type VocabRoster = { id?: string; name: string; stats: Record<string, { r: number[] }>; flagged?: { w: string; ctx?: string }[]; mistakes?: { w: string; typed: string; kinds: string[] }[]; spellFocus?: string[] }[] | null | undefined;
/** saves the words picked for one student's spelling patterns (students.quiz_overrides.spellFocus); [] clears them */
export type SaveSpellFocus = (studentId: string, words: string[]) => Promise<string | null>;

let flash = '';
let spNote: { id: string; text: string } | null = null;   /* the result of “Add to focus and practice”, shown in that student's box after the redraw */
let leftover = '';   /* words that still need a meaning, put back in the import box after a save */
export function renderVocabTab(pane: HTMLElement, cls: VocabClass, save: SaveVocab, roster: VocabRoster, saveSpellFocus?: SaveSpellFocus) {
  const vocab: ClassVocab = cls.game_settings?.vocab || {};
  const builtIn = vocab.builtIn !== false, words = (vocab.words || []).map(validWord).filter(Boolean) as VocabWord[];
  const { all, focus } = vocabList({ classVocab: vocab }) as { all: VocabWord[]; focus: VocabWord[] };
  const focusSet = new Set((vocab.focus || []).map(wordKey)), allFocus = !focusSet.size;
  const sets = [...new Set(all.map(v => v.set || 'My words'))];
  const message = flash; flash = '';
  const refill = leftover; leftover = '';
  const progress = roster === undefined ? '<p class="muted">Loading students…</p>' : roster === null ? '<p class="err">Students’ progress could not be loaded right now.</p>'
    : !roster.length ? '<p class="muted">No students yet.</p>'
    : `<table class="steptable"><tr><th>Student</th><th>Solid</th><th>Getting there</th><th>Needs practice</th><th>Not seen</th><th>Words to reteach</th></tr>${roster.map(st => {
        const count = (s: string) => focus.filter(v => wordStatus(st.stats[wordKey(v.w)]) === s).length;
        const weak = focus.filter(v => wordStatus(st.stats[wordKey(v.w)]) === 'work').slice(0, 6).map(v => esc(v.w)).join(', ');
        return `<tr><td>${esc(st.name)}</td><td>${count('solid')}</td><td>${count('close')}</td><td>${count('work')}</td><td>${count('new')}</td><td>${weak || '<span class="muted">–</span>'}</td></tr>`; }).join('')}</table>`;
  /* words students flagged (📌) that no list has yet: one row per word, with who flagged it and where */
  const flaggedMap = new Map<string, { names: string[]; ctx: string }>(), dismissedSet = new Set((vocab.dismissed || []).map(wordKey));
  for (const st of roster || []) for (const f of st.flagged || []) {
    if (findWord(all, f.w) || dismissedSet.has(wordKey(f.w))) continue;
    const entry = flaggedMap.get(f.w) || { names: [], ctx: f.ctx || '' }; entry.names.push(st.name); flaggedMap.set(f.w, entry);
  }
  const flaggedCard = flaggedMap.size ? `<div class="card"><h2>📌 Words students flagged (${flaggedMap.size})</h2><p class="muted" style="margin-top:0">Students highlight a word they don’t know anywhere in Pet World and tap 📌. Add a meaning, check the example sentence (taken from where they found the word, with ___ in its place), and it joins the class list. <b>Dismiss</b> a word you don’t want; it drops off the students’ flagged lists too.</p>
  <table class="steptable"><tr><th>Word</th><th>Flagged by · where</th><th>Meaning and example sentence</th><th></th></tr>${[...flaggedMap.entries()].map(([w, f]) => `<tr data-vb-flag-row="${esc(w)}"><td><b>${esc(w)}</b><br>${dictLinkHTML(w)}</td><td>${esc(f.names.join(', '))}${f.ctx ? `<br><span class="muted">“${esc(f.ctx)}”</span>` : ''}</td>
  <td><input type="text" data-vb-flag-def maxlength="200" placeholder="Kid-friendly meaning" style="width:100%"><input type="text" data-vb-flag-sentence maxlength="200" placeholder="Example sentence with ___ for the word (optional)" style="width:100%; margin-top:4px" value="${esc(blankSentence(f.ctx, w).split(/\s+/).length >= 4 ? blankSentence(f.ctx, w) : '')}"></td><td style="white-space:nowrap"><button class="btn small primary" data-vb-flag-add="${esc(w)}">Add to class list</button> <button class="btn small" data-vb-flag-dismiss="${esc(w)}">Dismiss</button></td></tr>`).join('')}</table></div>` : '';
  /* word by word, like the times tables: right / tried over each student's last 8 tries of a word (ROADMAP F5) */
    const tally = new Map<string, { right: number; tried: number; who: Set<string> }>();
    const triesOf = (st: NonNullable<VocabRoster>[number], w: string) => st.stats[wordKey(w)]?.r || [];
    const rightOf = (r: number[]) => r.filter(Boolean).length;
    for (const st of roster || []) for (const v of all) {
      const r = triesOf(st, v.w); if (!r.length) continue;
      const t = tally.get(v.w) || { right: 0, tried: 0, who: new Set<string>() };
      t.right += rightOf(r); t.tried += r.length; if (rightOf(r) < r.length) t.who.add(st.name); tally.set(v.w, t);
    }
    const hardest = [...tally.entries()].filter(([, t]) => t.right < t.tried)
      .sort((a, b) => (b[1].tried - b[1].right) - (a[1].tried - a[1].right) || a[1].right / a[1].tried - b[1].right / b[1].tried).slice(0, 12);
    const mark: Record<string, string> = { solid: '✅', close: '🟡', work: '🔴', new: '' };
    const perStudent = (roster || []).map(st => {
      const seen = all.map(v => ({ v, r: triesOf(st, v.w) })).filter(x => x.r.length).sort((a, b) => rightOf(a.r) / a.r.length - rightOf(b.r) / b.r.length);
      const weak = seen.filter(x => wordStatus({ r: x.r }) === 'work').length;
      return `<details><summary><b>${esc(st.name)}</b> <span class="muted">${seen.length} word${seen.length === 1 ? '' : 's'} practiced${weak ? ` · ${weak} need${weak === 1 ? 's' : ''} practice` : ''}</span></summary><p style="margin:6px 0">${seen.length ? seen.map(x => { const s = wordStatus({ r: x.r }); return `<span class="chip" title="${esc((STATUS_TEXT as Record<string, string>)[s])}">${mark[s]} ${esc(x.v.w)}: ${rightOf(x.r)}/${x.r.length}</span>`; }).join(' ') : '<span class="muted">No words practiced yet.</span>'}</p></details>`;
    }).join('');
    const wordsCard = roster && roster.length ? `<div class="card"><h2>Word by word</h2><p class="muted" style="margin-top:0">Like the times tables: right / tried over each student’s last 8 tries of a word, weakest first. ✅ solid · 🟡 getting there · 🔴 needs practice.</p>
  <h3>Hardest words for the class</h3>${hardest.length ? `<table class="steptable"><tr><th>Word</th><th>Right / tried</th><th>Students who missed it</th></tr>${hardest.map(([w, t]) => `<tr><td><b>${esc(w)}</b></td><td>${t.right}/${t.tried}</td><td>${esc([...t.who].join(', '))}</td></tr>`).join('')}</table>` : '<p class="muted">No missed words yet.</p>'}
  <h3>Each student</h3>${perStudent}</div>` : '';
    pane.innerHTML = `${message ? `<p class="status">${esc(message)}</p>` : ''}
    <div class="card"><h2>Vocabulary (Word Workshop)</h2>
      <p class="muted" style="margin-top:0">Students practice these words with cards, a 60-second sprint and spelling in the 🔤 Word Workshop. Changes apply to <b>${esc(cls.name)}</b>. Parents can also add words at home behind the grown-up PIN.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="vbBuiltIn" ${builtIn ? 'checked' : ''}> Include Pet World’s word list (${VOCAB_WORDS.length} grade 4–6 academic words, written for Pet World)</label>
      <h3>Add or import words</h3><p class="muted" style="margin-top:0">One per line: <code>word - meaning</code>, with an optional example sentence that uses ___ for the word: <code>word - meaning - The ___ was here.</code> To put words in a set, add a line like <code>Set: Lesson 4</code> above them; use an existing name such as <code>Set: Set 3</code> to add to one of Pet World’s sets (otherwise they go in “My words”). Headings like <code>Set 11:</code> or <code>Lesson 4</code> work too, and bullets or numbers at the start of a line are ignored. You can paste just the words (one per line, or <code>Set 11: abundant, scarce, eager</code>): Pet World fills in its own meaning when it has the word, and the rest come back in the box as <code>word - </code> for you to finish. You can paste two or three columns from a spreadsheet, or a JSON list with a <code>"set"</code> field. Use your own wording or your curriculum’s word list; Pet World doesn’t include published programs’ definitions.</p>
      <textarea id="vbImport" rows="6" style="width:100%; font-family:inherit">${esc(refill)}</textarea>
      <div class="row"><button class="btn primary" id="vbAdd">Add these words</button><span class="status" id="vbMsg"></span></div>
      ${words.length ? `<h3>Class words (${words.length})</h3><table class="steptable"><tr><th>Word</th><th>Meaning</th><th>Sentence</th><th></th></tr>${words.map(v => `<tr><td><b>${esc(v.w)}</b><br>${dictLinkHTML(v.w)}</td><td>${esc(v.d)}</td><td class="muted">${esc(v.s || '')}</td><td><button class="btn small" data-vb-remove="${esc(v.w)}">Remove</button></td></tr>`).join('')}</table>` : ''}
    </div>
    <div class="card"><h2>Focus words</h2><p class="muted" style="margin-top:0">${allFocus ? 'All words are in focus (the default).' : `${focusSet.size} of ${all.length} words are in focus.`} Students practice only focus words. A parent’s focus choice at home wins on that student’s device.</p>
      <div class="row"><button class="btn small" id="vbAll">Tick all</button><button class="btn small" id="vbNone">Untick all</button></div>
      ${sets.map(set => `<details${set === 'My words' ? ' open' : ''}><summary><b>${esc(set)}</b></summary><div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:4px; margin:6px 0">${all.filter(v => (v.set || 'My words') === set).map(v => `<label title="${esc(v.d)}" style="display:flex; gap:6px; align-items:center"><input type="checkbox" data-vb-focus="${esc(v.w)}" ${allFocus || focusSet.has(wordKey(v.w)) ? 'checked' : ''}> ${esc(v.w)}</label>`).join('')}</div></details>`).join('')}
      <div class="row"><button class="btn primary" id="vbSaveFocus">Save focus words</button></div>
    </div>
    ${flaggedCard}${spellingCard(roster, all, focusSet)}
    <div class="card"><h2>Class progress on focus words</h2>${progress}</div>${wordsCard}`;
  /* spelling patterns: practice the suggested words */
  /* spelling patterns: the ticked words go on the student's practice list, and any that aren't on the class list or in
     the focus words are added there too, so she practices them in every mode */
  pane.querySelectorAll<HTMLButtonElement>('[data-sp-save]').forEach(b => b.addEventListener('click', async () => {
    const id = b.dataset.spSave!, box = b.closest('[data-sp-student]')!, words = [...box.querySelectorAll<HTMLInputElement>('[data-sp-word]:checked')].map(i => i.value);
    const name = (roster?.find(st => st.id === id)?.name || 'this student').replace(/\.$/, ''), msg = box.querySelector('[data-sp-msg]');
    if (!saveSpellFocus) { if (msg) msg.textContent = 'Couldn’t save: reload the page and try again.'; return; }
    b.disabled = true; b.textContent = 'Saving…';
    const err = await saveSpellFocus(id, words);
    if (err) { b.disabled = false; b.textContent = `Add to focus and practice with ${name}`; if (msg) msg.textContent = `Couldn’t save: ${err}`; return; }
    const newWords = words.filter(w => !findWord(all, w)).map(w => findWord(PATTERN_WORDS as VocabWord[], w)).filter(Boolean) as VocabWord[];
    const unfocused = focusSet.size ? words.filter(w => !focusSet.has(wordKey(w))) : [];
    const said = !words.length ? `Cleared ${name}’s practice words.` : `✅ ${words.length} word${words.length === 1 ? '' : 's'} saved for ${name}. They come up more often in Word Workshop.${newWords.length ? ` Added ${newWords.length} to the class list (set “Spelling patterns”).` : ''}${unfocused.length ? ` Added ${unfocused.length} to the focus words.` : ''}`;
    spNote = { id, text: said };
    if (newWords.length || unfocused.length) {
      void commit({ ...vocab, words: [...(vocab.words || []), ...newWords.map(v => ({ w: v.w, d: v.d, ...(v.s ? { s: v.s } : {}), set: 'Spelling patterns' }))], focus: focusSet.size ? [...new Set([...focusSet, ...words.map(wordKey)])] : [] }, said);
    } else renderVocabTab(pane, cls, save, roster, saveSpellFocus);
  }));

  const commit = async (next: ClassVocab, done: string) => {
    const error = await save(next);
    if (error) { leftover = ''; const m = pane.querySelector('#vbMsg'); if (m) { m.textContent = error; m.className = 'status err'; } return; }
    flash = done;
    cls.game_settings = { ...(cls.game_settings || {}), vocab: next };
    renderVocabTab(pane, cls, save, roster, saveSpellFocus);   // keep the spelling-pattern save hooked up after a redraw
  };
  pane.querySelector('#vbBuiltIn')!.addEventListener('change', e => { void commit({ ...vocab, builtIn: (e.target as HTMLInputElement).checked }, 'Saved.'); });
  pane.querySelector('#vbAdd')!.addEventListener('click', () => {
    const box = pane.querySelector('#vbImport') as HTMLTextAreaElement, m = pane.querySelector('#vbMsg')!;
    const { words: added, errors, missing } = parseVocabImport(box.value) as { words: VocabWord[]; errors: string[]; missing: { w: string; set?: string }[] };
    /* words with no meaning yet go back in the box as "word - " lines, under their set heading */
    const needs = missing.length ? ` ${missing.length} word${missing.length === 1 ? ' still needs' : 's still need'} a meaning: type it after the dash in the box, then add again.` : '';
    if (!added.length) {
      if (missing.length) { box.value = missingLines(missing); m.textContent = needs.trim(); m.className = 'status'; return; }
      m.textContent = errors[0] || 'Nothing to add yet.'; m.className = 'status err'; return;
    }
    const merged = [...words.filter(v => !added.some(a => wordKey(a.w) === wordKey(v.w))), ...added].slice(0, VOCAB_LIMITS.list);
    const nextFocus = focusSet.size ? [...new Set([...focusSet, ...added.map(a => wordKey(a.w))])] : [];
    leftover = missing.length ? missingLines(missing) : '';
    void commit({ ...vocab, words: merged, focus: nextFocus }, `${added.length} word${added.length === 1 ? '' : 's'} added${errors.length ? `; ${errors.length} line(s) skipped` : ''}.${needs}`);
  });
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-remove]').forEach(b => b.addEventListener('click', () => {
    void commit({ ...vocab, words: words.filter(v => v.w !== b.dataset.vbRemove), focus: (vocab.focus || []).filter(f => f !== wordKey(b.dataset.vbRemove)) }, 'Word removed.');
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-flag-add]').forEach(b => b.addEventListener('click', () => {
    const row = b.closest('tr')!, typed = (row.querySelector('[data-vb-flag-sentence]') as HTMLInputElement).value;
        /* a sentence typed with the word itself gets ___ put in its place */
        const entry = validWord({ w: b.dataset.vbFlagAdd, d: (row.querySelector('[data-vb-flag-def]') as HTMLInputElement).value, s: typed.includes('___') ? typed : blankSentence(typed, b.dataset.vbFlagAdd) }) as VocabWord | null;
    if (!entry) { (row.querySelector('[data-vb-flag-def]') as HTMLInputElement).focus(); return; }
    const merged = [...words.filter(v => wordKey(v.w) !== wordKey(entry.w)), entry].slice(0, VOCAB_LIMITS.list);
    void commit({ ...vocab, words: merged, focus: focusSet.size ? [...new Set([...focusSet, wordKey(entry.w)])] : [] }, `${entry.w} added to the class list.`);
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-flag-dismiss]').forEach(b => b.addEventListener('click', () => {
      const dismissed = [...new Set([...(vocab.dismissed || []), wordKey(b.dataset.vbFlagDismiss)])].slice(-300);
      void commit({ ...vocab, dismissed }, `${b.dataset.vbFlagDismiss} dismissed.`);
    }));
    const boxes = () => [...pane.querySelectorAll<HTMLInputElement>('[data-vb-focus]')];
  pane.querySelector('#vbAll')!.addEventListener('click', () => boxes().forEach(x => { x.checked = true; }));
  pane.querySelector('#vbNone')!.addEventListener('click', () => boxes().forEach(x => { x.checked = false; }));
  pane.querySelector('#vbSaveFocus')!.addEventListener('click', () => {
    const picked = boxes().filter(x => x.checked).map(x => wordKey(x.dataset.vbFocus));
    if (picked.length < 4) { alert('Pick at least 4 focus words.'); return; }
    void commit({ ...vocab, focus: picked.length === boxes().length ? [] : picked }, 'Focus words saved.');
  });
}

/* ---------- spelling patterns (docs/VOCAB.md, "Spelling patterns") ----------
   Each student's spelling misses in Word Workshop, grouped by the kind of mistake (pre for per, a missing double
   letter, -ant for -ent…), with examples, a tip, and suggested words that practice the same pattern. Ticked words
   are saved for that student and come up more often in her practice, at any level. */
function spellingCard(roster: VocabRoster, all: VocabWord[], focusSet: Set<string>): string {
  const note = spNote; spNote = null;
  if (!roster || !roster.some(st => (st.mistakes || []).length)) return '';
  const rows = roster.filter(st => (st.mistakes || []).length).map(st => {
    const sum = patternSummary(st.mistakes || []).slice(0, 4), picked = new Set((st.spellFocus || []).map(wordKey));
    if (!sum.length) return `<details><summary><b>${esc(st.name)}</b> <span class="muted">${(st.mistakes || []).length} misspelling${(st.mistakes || []).length === 1 ? '' : 's'}, no clear pattern yet</span></summary></details>`;
    const top = sum.map(x => patternById(x.id)!).filter(Boolean);
    const pool: VocabWord[] = [...all, ...(PATTERN_WORDS as VocabWord[]).filter(v => !all.some(a => wordKey(a.w) === wordKey(v.w)))];
    const solid = (w: string) => wordStatus(st.stats[wordKey(w)]) === 'solid';
    /* for each pattern: the words she missed, then words built to practice it, then others from the lists; 5 each */
    const missed = new Set((st.mistakes || []).map(m => wordKey(m.w))), built = new Set((PATTERN_WORDS as VocabWord[]).map(v => wordKey(v.w)));
    const rank = (v: VocabWord) => (missed.has(wordKey(v.w)) ? 0 : built.has(wordKey(v.w)) ? 1 : 2);
    const suggest = [...new Map(top.flatMap(p => pool.filter(v => p.words(wordKey(v.w)) && !solid(v.w)).sort((a, b) => rank(a) - rank(b)).slice(0, 5)).map(v => [wordKey(v.w), v])).values()].slice(0, 16);
    return `<details open data-sp-student="${esc(st.id || '')}"><summary><b>${esc(st.name)}</b> <span class="muted">${(st.mistakes || []).length} recent misspellings</span></summary>
      <table class="steptable"><tr><th>Pattern</th><th>Times</th><th>What she wrote</th><th>How to teach it</th></tr>${sum.map(x => { const p = patternById(x.id)!; return `<tr><td><b>${esc(p.name)}</b></td><td>${x.n}</td><td>${x.examples.map((e: { typed: string; w: string }) => `<s>${esc(e.typed)}</s> → ${esc(e.w)}`).join('<br>')}</td><td class="muted">${esc(p.tip)}</td></tr>`; }).join('')}</table>
      ${suggest.length && st.id ? `<p style="margin:8px 0 4px"><b>Suggested words to practice</b> <span class="muted">(same patterns; untick any you don’t want)</span></p>
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:4px">${suggest.map(v => `<label title="${esc(v.d)}" style="display:flex; gap:6px; align-items:center"><input type="checkbox" data-sp-word value="${esc(v.w)}" ${!picked.size || picked.has(wordKey(v.w)) ? 'checked' : ''}> ${esc(v.w)}${!findWord(all, v.w) ? ' <small class="muted" title="Not on the class list yet: it will be added">➕ new</small>' : focusSet.size && !focusSet.has(wordKey(v.w)) ? ' <small class="muted" title="On the list but not a focus word: it will be added to the focus words">○ not in focus</small>' : ''}</label>`).join('')}</div>
      <div class="row" style="margin-top:6px"><button class="btn small primary" type="button" data-sp-save="${esc(st.id)}">Add to focus and practice with ${esc(st.name)}</button>${picked.size ? ` <span class="muted">Now practicing: ${esc([...picked].join(', '))}</span>` : ''}</div><p class="status" data-sp-msg>${note && note.id === st.id ? esc(note.text) : ''}</p>` : ''}</details>`;
  }).join('');
  return `<div class="card"><h2>✏️ Spelling patterns</h2><p class="muted" style="margin-top:0">When a student misspells a word in Word Workshop, Pet World names the kind of mistake: per for pre, a missing double letter, ie for ei, -ant for -ent, a missing syllable. Most common first, from each student’s last 80 misspellings. Pick words that practice the same pattern; they come up more often in that student’s Word Workshop.</p>${rows}</div>`;
}
