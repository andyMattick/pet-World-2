/* Teacher app: Vocabulary tab (docs: VOCAB.md). The class word list lives in classes.game_settings.vocab
   ({builtIn, words, focus}), which students already receive, so no new database column is needed. */
import { esc } from './report';
import { VOCAB_WORDS, VOCAB_LIMITS, vocabList, wordKey, wordStatus, parseVocabImport, validWord } from '../shared/vocab';

interface VocabWord { w: string; d: string; s?: string; set?: string }
export interface ClassVocab { builtIn?: boolean; words?: VocabWord[]; focus?: string[] }
interface VocabClass { id: string; name: string; game_settings: { vocab?: ClassVocab; [key: string]: unknown } | null }
type SaveVocab = (vocab: ClassVocab) => Promise<string | null>;
/* each student's answer history per word (state.vocab.stats), or null if it couldn't be loaded */
export type VocabRoster = { name: string; stats: Record<string, { r: number[] }> }[] | null | undefined;

let flash = '';
export function renderVocabTab(pane: HTMLElement, cls: VocabClass, save: SaveVocab, roster: VocabRoster) {
  const vocab: ClassVocab = cls.game_settings?.vocab || {};
  const builtIn = vocab.builtIn !== false, words = (vocab.words || []).map(validWord).filter(Boolean) as VocabWord[];
  const { all, focus } = vocabList({ classVocab: vocab }) as { all: VocabWord[]; focus: VocabWord[] };
  const focusSet = new Set((vocab.focus || []).map(wordKey)), allFocus = !focusSet.size;
  const sets = [...new Set(all.map(v => v.set || 'My words'))];
  const message = flash; flash = '';
  const progress = roster === undefined ? '<p class="muted">Loading students…</p>' : roster === null ? '<p class="err">Students’ progress could not be loaded right now.</p>'
    : !roster.length ? '<p class="muted">No students yet.</p>'
    : `<table class="steptable"><tr><th>Student</th><th>Solid</th><th>Getting there</th><th>Needs practice</th><th>Not seen</th><th>Words to reteach</th></tr>${roster.map(st => {
        const count = (s: string) => focus.filter(v => wordStatus(st.stats[wordKey(v.w)]) === s).length;
        const weak = focus.filter(v => wordStatus(st.stats[wordKey(v.w)]) === 'work').slice(0, 6).map(v => esc(v.w)).join(', ');
        return `<tr><td>${esc(st.name)}</td><td>${count('solid')}</td><td>${count('close')}</td><td>${count('work')}</td><td>${count('new')}</td><td>${weak || '<span class="muted">–</span>'}</td></tr>`; }).join('')}</table>`;
  pane.innerHTML = `${message ? `<p class="status">${esc(message)}</p>` : ''}
    <div class="card"><h2>Vocabulary (Word Workshop)</h2>
      <p class="muted" style="margin-top:0">Students practice these words with cards, a 60-second sprint and spelling in the 🔤 Word Workshop. Changes apply to <b>${esc(cls.name)}</b>. Parents can also add words at home behind the grown-up PIN.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="vbBuiltIn" ${builtIn ? 'checked' : ''}> Include Pet Town’s word list (${VOCAB_WORDS.length} grade 4–6 academic words, written for Pet Town)</label>
      <h3>Add or import words</h3><p class="muted" style="margin-top:0">One per line: <code>word - meaning</code>, with an optional example sentence that uses ___ for the word: <code>word - meaning - The ___ was here.</code> You can paste two or three columns from a spreadsheet, or a JSON list. Use your own wording or your curriculum’s word list; Pet Town doesn’t include published programs’ definitions.</p>
      <textarea id="vbImport" rows="6" style="width:100%; font-family:inherit"></textarea>
      <div class="row"><button class="btn primary" id="vbAdd">Add these words</button><span class="status" id="vbMsg"></span></div>
      ${words.length ? `<h3>Class words (${words.length})</h3><table class="steptable"><tr><th>Word</th><th>Meaning</th><th>Sentence</th><th></th></tr>${words.map(v => `<tr><td><b>${esc(v.w)}</b></td><td>${esc(v.d)}</td><td class="muted">${esc(v.s || '')}</td><td><button class="btn small" data-vb-remove="${esc(v.w)}">Remove</button></td></tr>`).join('')}</table>` : ''}
    </div>
    <div class="card"><h2>Focus words</h2><p class="muted" style="margin-top:0">${allFocus ? 'All words are in focus (the default).' : `${focusSet.size} of ${all.length} words are in focus.`} Students practice only focus words. A parent’s focus choice at home wins on that student’s device.</p>
      <div class="row"><button class="btn small" id="vbAll">Tick all</button><button class="btn small" id="vbNone">Untick all</button></div>
      ${sets.map(set => `<details${set === 'My words' ? ' open' : ''}><summary><b>${esc(set)}</b></summary><div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:4px; margin:6px 0">${all.filter(v => (v.set || 'My words') === set).map(v => `<label title="${esc(v.d)}" style="display:flex; gap:6px; align-items:center"><input type="checkbox" data-vb-focus="${esc(v.w)}" ${allFocus || focusSet.has(wordKey(v.w)) ? 'checked' : ''}> ${esc(v.w)}</label>`).join('')}</div></details>`).join('')}
      <div class="row"><button class="btn primary" id="vbSaveFocus">Save focus words</button></div>
    </div>
    <div class="card"><h2>Class progress on focus words</h2>${progress}</div>`;

  const commit = async (next: ClassVocab, done: string) => {
    const error = await save(next);
    if (error) { const m = pane.querySelector('#vbMsg'); if (m) { m.textContent = error; m.className = 'status err'; } return; }
    flash = done;
    cls.game_settings = { ...(cls.game_settings || {}), vocab: next };
    renderVocabTab(pane, cls, save, roster);
  };
  pane.querySelector('#vbBuiltIn')!.addEventListener('change', e => { void commit({ ...vocab, builtIn: (e.target as HTMLInputElement).checked }, 'Saved.'); });
  pane.querySelector('#vbAdd')!.addEventListener('click', () => {
    const { words: added, errors } = parseVocabImport((pane.querySelector('#vbImport') as HTMLTextAreaElement).value) as { words: VocabWord[]; errors: string[] };
    if (!added.length) { const m = pane.querySelector('#vbMsg')!; m.textContent = errors[0] || 'Nothing to add yet.'; m.className = 'status err'; return; }
    const merged = [...words.filter(v => !added.some(a => wordKey(a.w) === wordKey(v.w))), ...added].slice(0, VOCAB_LIMITS.list);
    const nextFocus = focusSet.size ? [...new Set([...focusSet, ...added.map(a => wordKey(a.w))])] : [];
    void commit({ ...vocab, words: merged, focus: nextFocus }, `${added.length} word${added.length === 1 ? '' : 's'} added${errors.length ? `; ${errors.length} line(s) skipped` : ''}.`);
  });
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-remove]').forEach(b => b.addEventListener('click', () => {
    void commit({ ...vocab, words: words.filter(v => v.w !== b.dataset.vbRemove), focus: (vocab.focus || []).filter(f => f !== wordKey(b.dataset.vbRemove)) }, 'Word removed.');
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
