/* Teacher app: Vocabulary tab (docs: VOCAB.md). The class word list lives in classes.game_settings.vocab
   ({builtIn, words, focus}), which students already receive, so no new database column is needed. */
import { esc } from './report';
import { pathSummaryText } from '../shared/wordPath';
import { VOCAB_WORDS, VOCAB_LIMITS, vocabList, wordKey, wordStatus, STATUS_TEXT, parseVocabImport, missingLines, validWord, findWord, blankSentence, PATTERN_WORDS, normalizeVocabState, wordBuckets, masteredAmong, validListen, LISTEN_DEFAULT, LISTEN_MAX, keepPictures, setDayInfo, SET_DAYS } from '../shared/vocab';
import { patternSummary, patternById } from '../shared/spellingPatterns';
import { dictLinkHTML } from './wordPick';
import { pictureFor, suggestEmoji, validPictureEmoji, needsCartoon, cartoonRequest } from '../shared/wordPictures';
import { searchPhotos, photoChoice, photoResultsHTML } from '../shared/photoSearch';

interface WordPhoto { src: string; credit: string; license: string; licenseVersion?: string; source: string; title?: string; creator?: string }
interface VocabWord { w: string; d: string; s?: string; set?: string; syl?: string[]; pic?: string; noPic?: boolean; photo?: WordPhoto }   // syl: syllables typed with + (ap+ples); pic / noPic / photo: the word's picture (F92)
export interface ClassVocab { builtIn?: boolean; listenSec?: number; words?: VocabWord[]; focus?: string[]; dismissed?: string[] }   // dismissed: flagged words the teacher said no to
interface VocabClass { id: string; name: string; game_settings: { vocab?: ClassVocab; [key: string]: unknown } | null }
type SaveVocab = (vocab: ClassVocab) => Promise<string | null>;
/* each student's answer history per word (state.vocab.stats), or null if it couldn't be loaded */
export type VocabRoster = { id?: string; name: string; stats: Record<string, { r: number[] }>; flagged?: { w: string; ctx?: string }[]; mistakes?: { w: string; typed: string; kinds: string[] }[]; spellFocus?: string[]; saved?: unknown; pendingBack?: string[] }[] | null | undefined;
/** saves the words picked for one student's spelling patterns (students.quiz_overrides.spellFocus); [] clears them */
export type SaveSpellFocus = (studentId: string, words: string[]) => Promise<string | null>;
/** moves mastered words back to one student's practice list (a one-time clear in students.quiz_overrides); null when saved */
export type SaveUnmaster = (studentId: string, words: string[]) => Promise<string | null>;

/* ---------- moving mastered words back to practice (owner, Oct 30, 2026; docs/VOCAB.md "Moving words back to practice") ----------
   The teacher's move is saved as a clear in the student's quiz_overrides, the same way other teacher-to-student changes
   reach the game: "clear:vocab-back-<time>" = "unmaster:<word>,unmaster:<word>" (words URI-encoded). The game applies a
   clear once per save copy and records it in state.clearsDone (applyClears in game.js), so it never fights with her
   mastering the word again later. */
const BACK_PREFIX = 'clear:vocab-back-';
export function unmasterClear(words: string[], now = Date.now()): [string, string] | null {
  const keys = [...new Set(words.map(wordKey).filter(Boolean))];
  return keys.length ? [`${BACK_PREFIX}${now}`, keys.map(k => `unmaster:${encodeURIComponent(k)}`).join(',')] : null;
}
/** words moved back by the teacher that the student's game hasn't applied yet (their clear isn't in her clearsDone) */
export function pendingBackOf(overrides: Record<string, unknown> | null | undefined, clearsDone: unknown): string[] {
  const done = new Set(Array.isArray(clearsDone) ? clearsDone.map(String) : []), out: string[] = [];
  for (const [k, v] of Object.entries(overrides || {})) {
    if (!k.startsWith(BACK_PREFIX) || done.has(k) || typeof v !== 'string') continue;
    for (const t of v.split(',')) if (t.startsWith('unmaster:')) { try { out.push(wordKey(decodeURIComponent(t.slice(9)))); } catch { /* a bad token is skipped */ } }
  }
  return [...new Set(out)];
}
const backNotes = new Map<string, string>();   /* per student: the result of a move, shown in her box after the redraw */

/* ---------- 🖼️ pictures for class words (owner, Oct 30, 2026; ROADMAP F92, docs/VOCAB.md "Pictures for added words") ----------
   Each class word's 🖼️ Picture opens a box: 🔍 Find a photo (Openverse from the browser: free licenses only, safe search,
   6 results; the teacher picks one or none, nothing is ever picked automatically) or an emoji (suggested from the
   meaning; use it, change it or turn it off). A class word's photo is saved as its https address with its credit,
   license and source, inside the class word list the tab already saves (classes.game_settings.vocab.words; no new
   table). 🎨 Needs a cartoon lists class words with no cartoon yet and copies a request for Claude. */
type PhotoResult = Parameters<typeof photoChoice>[0];
let picEdit: { w: string; q?: string; results?: PhotoResult[] | null; busy?: boolean; err?: string } | null = null;
function picHTML(v: VocabWord): string {
  const p = pictureFor(v.w, v) as { kind: string; emoji: string; src?: string; alt: string; credit?: string; suggested?: boolean } | null;
  if (!p) return '<span class="muted">none</span>';
  const art = p.src ? `<img class="vb-pic-img" src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" referrerpolicy="no-referrer">` : `<span class="vb-pic-emoji" role="img" aria-label="${esc(p.alt)}">${esc(p.emoji)}</span>`;
  return `<span class="vb-pic">${art}${p.credit ? `<small class="vb-pic-credit">📷 ${esc(p.credit)}</small>` : p.suggested ? '<small class="muted">suggested</small>' : ''}</span>`;
}
function picEditorRow(v: VocabWord): string {
  const ed = picEdit!, sug = suggestEmoji(v.w, v.d);
  return `<tr class="vb-pic-row"><td colspan="5"><div class="vb-pic-editor" id="vbPicEditor"><b>🖼️ Picture for “${esc(v.w)}”</b>
    <div class="row" style="align-items:center">${picHTML(v)}${v.photo ? `<span class="muted">📷 ${esc(v.photo.credit)} · <a href="${esc(v.photo.source)}" target="_blank" rel="noopener noreferrer">source ↗</a></span> <button class="btn small" type="button" data-vbp-photo-remove>Remove photo</button>` : ''}</div>
    <p style="margin:8px 0 4px"><b>🔍 Find a photo</b></p><div class="row"><input type="search" id="vbPicQ" maxlength="60" value="${esc(ed.q ?? v.w)}" aria-label="Search words for the photo"><button class="btn small primary" type="button" data-vbp-search ${ed.busy ? 'disabled' : ''}>${ed.busy ? 'Searching…' : '🔍 Find a photo'}</button></div>
    ${ed.err ? `<p class="err">${esc(ed.err)}</p>` : ''}${ed.results ? `<div class="vb-pic-results">${photoResultsHTML(ed.results, ed.q || v.w)}</div>` : ''}
    <p style="margin:8px 0 4px"><b>🙂 Or an emoji</b> ${sug && !v.pic ? `<span class="muted">Suggested from the meaning:</span> <span class="vb-pic-emoji">${esc(sug)}</span> <button class="btn small" type="button" data-vbp-use-sug>Use it</button>` : !sug ? '<span class="muted">No suggestion for this word.</span>' : ''}</p>
    <div class="row"><input type="text" id="vbPicEmoji" maxlength="12" value="${esc(v.pic || '')}" placeholder="${esc(sug || '🍎')}" aria-label="1 to 3 emoji"><button class="btn small" type="button" data-vbp-emoji-save>Save emoji</button><button class="btn small" type="button" data-vbp-none>No picture</button><button class="btn small" type="button" data-vbp-close>Done</button></div>
    <p class="status" id="vbPicMsg"></p></div></td></tr>`;
}
function cartoonCardHTML(words: VocabWord[]): string {
  const need = needsCartoon(words) as VocabWord[];
  if (!need.length) return '';
  return `<div class="card vb-cartoons"><h2>🎨 Needs a cartoon (${need.length})</h2><p class="muted" style="margin-top:0">Class words with no cartoon yet. Until one is drawn they show their photo or emoji. <b>Copy request for Claude</b> copies a ready-to-paste request with each word’s meaning and example sentence; Claude draws them in Pet World’s style and sends back a patch.</p>
    <p>${need.map(v => `<span class="chip">${esc(v.w)}</span>`).join(' ')}</p>
    <div class="row"><button class="btn primary" type="button" id="vbCartoonCopy">📋 Copy request for Claude</button><span class="status" id="vbCartoonMsg"></span></div><div id="vbCartoonText"></div></div>`;
}

let flash = '';
let spNote: { id: string; text: string } | null = null;   /* the result of “Add to focus and practice”, shown in that student's box after the redraw */
let leftover = '';   /* words that still need a meaning, put back in the import box after a save */
export function renderVocabTab(pane: HTMLElement, cls: VocabClass, save: SaveVocab, roster: VocabRoster, saveSpellFocus?: SaveSpellFocus, saveUnmaster?: SaveUnmaster) {
  const vocab: ClassVocab = cls.game_settings?.vocab || {};
  const builtIn = vocab.builtIn !== false, words = (vocab.words || []).map(validWord).filter(Boolean) as VocabWord[];
  const { all } = vocabList({ classVocab: vocab }) as { all: VocabWord[] };
  const focusSet = new Set((vocab.focus || []).map(wordKey));
  const message = flash; flash = '';
  const refill = leftover; leftover = '';
  const progress = roster === undefined ? '<p class="muted">Loading students…</p>' : roster === null ? '<p class="err">Students’ progress could not be loaded right now.</p>'
    : !roster.length ? '<p class="muted">No students yet.</p>'
    : `<table class="steptable"><tr><th>Student</th><th>Solid</th><th>Getting there</th><th>Needs practice</th><th>Not seen</th><th>Words to reteach</th></tr>${roster.map(st => {
        const count = (s: string) => all.filter(v => wordStatus(st.stats[wordKey(v.w)]) === s).length;
        const weak = all.filter(v => wordStatus(st.stats[wordKey(v.w)]) === 'work').slice(0, 6).map(v => esc(v.w)).join(', ');
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
    ${studentListsHTML(roster, vocab)}
    <div class="card"><h2>Vocabulary (Word Workshop)</h2>
      <p class="muted" style="margin-top:0">Students practice these words with cards, a 60-second sprint and spelling in the 🔤 Word Workshop. Changes apply to <b>${esc(cls.name)}</b>. Parents can also add words at home behind the grown-up PIN.</p>
      <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="vbBuiltIn" ${builtIn ? 'checked' : ''}> Include Pet World’s word list (${VOCAB_WORDS.length} grade 4–6 academic words, written for Pet World)</label>
      <p><label>👂 Listening time on spelling cards <select id="vbListen">${[`<option value=""${validListen(vocab.listenSec) == null ? ' selected' : ''}>Default (${LISTEN_DEFAULT} seconds)</option>`, ...[0, 3, 5, 8, 10, 12, 15, LISTEN_MAX].map(n => `<option value="${n}"${validListen(vocab.listenSec) === n ? ' selected' : ''}>${n ? `${n} seconds` : 'Off (0)'}</option>`)].join('')}</select></label><br><span class="muted">On every spelling card, Pet World says the word, how many syllables it has, and each syllable, then the answer box stays locked this long so students keep listening (they can replay it). A parent’s setting at home wins over this one.</span></p>
      <h3>Add or import words</h3><p class="muted" style="margin-top:0">Words you add go in every student’s <b>Unmastered</b> list and can be drawn the next Monday. One per line: <code>word - meaning</code>, with an optional example sentence that uses ___ for the word: <code>word - meaning - The ___ was here.</code> To put words in a set, add a line like <code>Set: Lesson 4</code> above them; use an existing name such as <code>Set: Set 3</code> to add to one of Pet World’s sets (otherwise they go in “My words”). Headings like <code>Set 11:</code> or <code>Lesson 4</code> work too, and bullets or numbers at the start of a line are ignored. You can paste just the words (one per line, or <code>Set 11: abundant, scarce, eager</code>): Pet World fills in its own meaning when it has the word, and the rest come back in the box as <code>word - </code> for you to finish. You can paste two or three columns from a spreadsheet, or a JSON list with a <code>"set"</code> field. Use your own wording or your curriculum’s word list; Pet World doesn’t include published programs’ definitions. <b>Other languages:</b> put a line like <code>Language: Spanish</code> above the words (and <code>Language: English</code> to switch back); they’re read aloud in that language. For the 🐾 Paw Path you can add a second sentence as a fourth part, and the part of speech after the word: <code>árbol (n) - tree - El pájaro está en el ___. - Hay un ___ en el patio.</code></p>
      <p class="muted"><b>Type syllables with + to help Pet World say them: <code>ap+ples</code></b> (or <code>cel+e+bra+tion - a big party</code>). The word is saved without the +’s; the pieces set the syllable count, the dots and what the voice says. Students never see the pieces before they answer.</p>
      <textarea id="vbImport" rows="6" style="width:100%; font-family:inherit">${esc(refill)}</textarea>
      <div class="row"><button class="btn primary" id="vbAdd">Add these words</button><span class="status" id="vbMsg"></span></div>
      ${words.length ? `<details class="vb-classwords"><summary><b>Class words you added (${words.length})</b> <span class="muted">· tap to see or remove them. They’re part of each student’s Unmastered list above.</span></summary><table class="steptable"><tr><th>Word</th><th>Meaning</th><th>Sentence</th><th>Picture</th><th></th></tr>${words.map(v => `<tr><td><b>${esc(v.w)}</b>${v.syl ? `<br><span class="muted">${esc(v.syl.join('+'))}</span>` : ''}<br>${dictLinkHTML(v.w)}</td><td>${esc(v.d)}</td><td class="muted">${esc(v.s || '')}</td><td>${picHTML(v)}<br><button class="btn small" type="button" data-vb-pic="${esc(v.w)}">🖼️ Picture</button></td><td><button class="btn small" data-vb-remove="${esc(v.w)}">Remove</button></td></tr>${picEdit && wordKey(picEdit.w) === wordKey(v.w) ? picEditorRow(v) : ''}`).join('')}</table></details>` : ''}
    </div>
    ${cartoonCardHTML(words)}${flaggedCard}${spellingCard(roster, all, focusSet)}
    <div class="card"><h2>Class progress on all words</h2>${progress}</div>${wordsCard}`;
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
    const st = roster?.find(r => r.id === id), bumped = st ? await bumpMastered(words, [st]) : '';
    spNote = { id, text: said + bumped };
    if (newWords.length || unfocused.length) {
      void commit({ ...vocab, words: [...(vocab.words || []), ...newWords.map(v => ({ w: v.w, d: v.d, ...(v.s ? { s: v.s } : {}), set: 'Spelling patterns' }))], focus: focusSet.size ? [...new Set([...focusSet, ...words.map(wordKey)])] : [] }, said + bumped);
    } else renderVocabTab(pane, cls, save, roster, saveSpellFocus, saveUnmaster);
  }));

  /* adding a word a student already mastered moves it back to her practice list (each student it affected gets a note) */
  async function bumpMastered(added: string[], who = roster || []): Promise<string> {
    if (!saveUnmaster) return '';
    const notes: string[] = [];
    for (const st of who) {
      if (!st.id || !st.saved) continue;
      const pending = new Set(st.pendingBack || []), hit = masteredAmong(normalizeVocabState(JSON.parse(JSON.stringify(st.saved))), added).filter(k => !pending.has(k));
      if (!hit.length) continue;
      const err = await saveUnmaster(st.id, hit);
      if (err) { notes.push(`Couldn’t move ${hit.join(', ')} back for ${st.name}: ${err}`); continue; }
      st.pendingBack = [...pending, ...hit];
      notes.push(...hit.map(k => `📌 ${k} was mastered by ${st.name}, so it’s back on her practice list.`));
    }
    return notes.length ? ` ${notes.join(' ')}` : '';
  }
  const commit = async (next: ClassVocab, done: string) => {
    const error = await save(next);
    if (error) { leftover = ''; const m = pane.querySelector('#vbMsg'); if (m) { m.textContent = error; m.className = 'status err'; } return; }
    flash = done;
    cls.game_settings = { ...(cls.game_settings || {}), vocab: next };
    renderVocabTab(pane, cls, save, roster, saveSpellFocus, saveUnmaster);   // keep the spelling-pattern save hooked up after a redraw
  };
  pane.querySelector('#vbBuiltIn')!.addEventListener('change', e => { void commit({ ...vocab, builtIn: (e.target as HTMLInputElement).checked }, 'Saved.'); });
  pane.querySelector('#vbListen')!.addEventListener('change', e => {
    const n = validListen((e.target as HTMLSelectElement).value), next: ClassVocab = { ...vocab }; delete next.listenSec; if (n != null) next.listenSec = n;
    void commit(next, `Listening time saved: ${n ?? LISTEN_DEFAULT} seconds${n === 0 ? ' (off)' : ''}.`);
  });
  pane.querySelector('#vbAdd')!.addEventListener('click', () => {
    const box = pane.querySelector('#vbImport') as HTMLTextAreaElement, m = pane.querySelector('#vbMsg')!;
    const { words: added, errors, missing } = parseVocabImport(box.value) as { words: VocabWord[]; errors: string[]; missing: { w: string; set?: string }[] };
    /* words with no meaning yet go back in the box as "word - " lines, under their set heading */
    const needs = missing.length ? ` ${missing.length} word${missing.length === 1 ? ' still needs' : 's still need'} a meaning: type it after the dash in the box, then add again.` : '';
    if (!added.length) {
      if (missing.length) { box.value = missingLines(missing); m.textContent = needs.trim(); m.className = 'status'; return; }
      m.textContent = errors[0] || 'Nothing to add yet.'; m.className = 'status err'; return;
    }
    const merged = [...words.filter(v => !added.some(a => wordKey(a.w) === wordKey(v.w))), ...(keepPictures(words, added) as VocabWord[])].slice(0, VOCAB_LIMITS.list);   // a word added again keeps its picture
    const nextFocus = focusSet.size ? [...new Set([...focusSet, ...added.map(a => wordKey(a.w))])] : [];
    leftover = missing.length ? missingLines(missing) : '';
    void bumpMastered(added.map(a => a.w)).then(bumped => commit({ ...vocab, words: merged, focus: nextFocus }, `${added.length} word${added.length === 1 ? '' : 's'} added${errors.length ? `; ${errors.length} line(s) skipped` : ''}.${needs}${bumped}`));
  });
  /* 🖼️ a class word's picture */
  const redraw = () => renderVocabTab(pane, cls, save, roster, saveSpellFocus, saveUnmaster);
  const setWord = (w: string, change: (v: VocabWord) => VocabWord, done: string) => {
    const next = words.map(v => (wordKey(v.w) === wordKey(w) ? change({ ...v }) : v));
    if (picEdit) picEdit.results = null;
    void commit({ ...vocab, words: next }, done);
  };
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-pic]').forEach(b => b.addEventListener('click', () => {
    picEdit = picEdit && wordKey(picEdit.w) === wordKey(b.dataset.vbPic!) ? null : { w: b.dataset.vbPic! };
    redraw();
    pane.querySelector('#vbPicEditor')?.scrollIntoView?.({ block: 'nearest' });
  }));
  const editor = pane.querySelector<HTMLElement>('#vbPicEditor'), editing = picEdit && words.find(v => wordKey(v.w) === wordKey(picEdit!.w));
  if (editor && editing && picEdit) {
    const ed = picEdit, v = editing, msg = editor.querySelector('#vbPicMsg')!;
    editor.addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!b) return;
      if (b.hasAttribute('data-vbp-close')) { picEdit = null; redraw(); keepOpen(); return; }
      if (b.hasAttribute('data-vbp-search')) {
        const q = ((editor.querySelector('#vbPicQ') as HTMLInputElement).value || v.w).trim() || v.w;
        Object.assign(ed, { q, busy: true, err: '', results: null }); redraw(); keepOpen();
        searchPhotos(q).then(r => { ed.results = r as PhotoResult[]; }, (err: Error) => { ed.err = err.message; }).finally(() => { ed.busy = false; if (picEdit === ed) { redraw(); keepOpen(); } });
        return;
      }
      if (b.hasAttribute('data-photo-none')) { ed.results = null; redraw(); keepOpen(); return; }   // nothing picked
      if (b.dataset.photoUse != null) {
        const r = ed.results?.[+b.dataset.photoUse]; if (!r) return;
        setWord(v.w, x => { const { noPic, ...rest } = x; void noPic; return { ...rest, photo: photoChoice(r, r.thumb) as WordPhoto }; }, `📷 Photo saved for ${v.w}: ${photoChoice(r, r.thumb).credit}.`);
        return;
      }
      if (b.hasAttribute('data-vbp-photo-remove')) { setWord(v.w, x => { const { photo, ...rest } = x; void photo; return rest; }, `Photo removed from ${v.w}.`); return; }
      if (b.hasAttribute('data-vbp-use-sug')) { const em = suggestEmoji(v.w, v.d); if (em) setWord(v.w, x => { const { noPic, ...rest } = x; void noPic; return { ...rest, pic: em }; }, `${em} saved for ${v.w}.`); return; }
      if (b.hasAttribute('data-vbp-emoji-save')) {
        const em = validPictureEmoji((editor.querySelector('#vbPicEmoji') as HTMLInputElement).value);
        if (!em) { msg.textContent = 'Type 1 to 3 emoji, and nothing else.'; return; }
        setWord(v.w, x => { const { noPic, ...rest } = x; void noPic; return { ...rest, pic: em }; }, `${em} saved for ${v.w}.`); return;
      }
      if (b.hasAttribute('data-vbp-none')) { setWord(v.w, x => { const { pic, ...rest } = x; void pic; return { ...rest, noPic: true }; }, `No emoji for ${v.w}.`); return; }
    });
  }
  function keepOpen(){ pane.querySelector('.vb-classwords')?.setAttribute('open', ''); }
  if (picEdit) keepOpen();
  pane.querySelector('#vbCartoonCopy')?.addEventListener('click', async () => {
    const text = cartoonRequest(words.map(v => ({ ...v, from: 'class word' }))), m = pane.querySelector('#vbCartoonMsg')!;
    try { await navigator.clipboard.writeText(text); m.textContent = `✅ Copied: ${(needsCartoon(words) as unknown[]).length} words. Paste it to Claude.`; }
    catch { const host = pane.querySelector('#vbCartoonText')!; host.innerHTML = `<textarea readonly rows="8" style="width:100%">${esc(text)}</textarea>`; host.querySelector('textarea')!.select(); m.textContent = 'Copy the request below.'; }
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
    void bumpMastered([entry.w]).then(bumped => commit({ ...vocab, words: merged, focus: focusSet.size ? [...new Set([...focusSet, wordKey(entry.w)])] : [] }, `${entry.w} added to the class list.${bumped}`));
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-flag-dismiss]').forEach(b => b.addEventListener('click', () => {
      const dismissed = [...new Set([...(vocab.dismissed || []), wordKey(b.dataset.vbFlagDismiss)])].slice(-300);
      void commit({ ...vocab, dismissed }, `${b.dataset.vbFlagDismiss} dismissed.`);
    }));
  /* a student's ⭐ Mastered word → "Move to unmastered": ask first, then save it for her game */
  pane.querySelectorAll<HTMLButtonElement>('[data-vb-back]').forEach(b => b.addEventListener('click', () => {
    const box = b.closest<HTMLElement>('[data-vb-student]'), ask = box?.querySelector<HTMLElement>('[data-vb-back-ask]'), st = roster?.find(r => r.id === box?.dataset.vbStudent);
    if (!box || !ask || !st) return;
    const w = b.dataset.vbBack!;
    ask.innerHTML = `Move <b>${esc(w)}</b> back to ${esc(st.name)}’s <b>Unmastered</b> list? It’s first in line for her next set’s 20 words. <button class="btn small primary" type="button" data-vb-back-yes="${esc(w)}">Move to unmastered</button> <button class="btn small" type="button" data-vb-back-no>Cancel</button>`;
    ask.querySelector('[data-vb-back-no]')!.addEventListener('click', () => { ask.innerHTML = ''; });
    ask.querySelector<HTMLButtonElement>('[data-vb-back-yes]')!.addEventListener('click', async e => {
      const yes = e.currentTarget as HTMLButtonElement; yes.disabled = true; yes.textContent = 'Saving…';
      const err = saveUnmaster ? await saveUnmaster(st.id!, [w]) : 'reload the page and try again';
      if (err) { ask.textContent = `Couldn’t save: ${err}`; return; }
      st.pendingBack = [...new Set([...(st.pendingBack || []), wordKey(w)])];
      backNotes.set(st.id!, `✅ ${w} moves back to ${st.name}’s Unmastered list (first in line for her next set) the next time Pet World opens for her.`);
      renderVocabTab(pane, cls, save, roster, saveSpellFocus, saveUnmaster);
    });
  }));
}

/* ---------- each student's three lists (owner, Oct 28, 2026; docs/VOCAB.md "Words of the week") ----------
   All her words are one list: Mastered (her 🏆 Hall of Fame), Unmastered (everything else, including words just
   added), and This week's words (up to 20 unmastered, carried-over first, plus 5 mastered to review), read from her save
   (saves.state->vocab). The old focus-word picker is gone: the game no longer narrows practice to focus words. */
const TAG_TEXT: Record<string, string> = { carried: '🔁 carried over', new: '🆕 new', review: '🔄 review' };
function studentListsHTML(roster: VocabRoster, vocab: ClassVocab): string {
  const intro = `<p class="muted" style="margin-top:0">Each student’s words are one list. <b>Her words</b> come in sets that last <b>${SET_DAYS} practice days</b> (a day counts when she does any Word Workshop work; missed days, weekends and holidays don’t): up to 20 unmastered words (the ones she didn’t master in the last set carry over first and count toward the 20; the rest are drawn at random) plus 5 mastered words to review. The mastery check on her day ${SET_DAYS} (📇 flashcards, then she types each word from its meaning) moves the ones she gets right to <b>Mastered</b>; a review word she misses goes back to <b>Unmastered</b>. Then she sees a recap of the words moving out and in, and the next set starts on her next day. Words you add below go in <b>Unmastered</b>. <b>Tap a mastered word</b> to move it back to Unmastered (first in line for her next set); adding a word she already mastered moves it back too.</p>`;
  if (roster === undefined) return `<div class="card"><h2>📚 Each student’s words</h2>${intro}<p class="muted">Loading students…</p></div>`;
  if (roster === null) return `<div class="card"><h2>📚 Each student’s words</h2>${intro}<p class="err">Students’ words could not be loaded right now.</p></div>`;
  if (!roster.length) return `<div class="card"><h2>📚 Each student’s words</h2>${intro}<p class="muted">No students yet.</p></div>`;
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const rows = roster.map(st => {
    const saved = normalizeVocabState(st.saved && typeof st.saved === 'object' ? JSON.parse(JSON.stringify(st.saved)) : {}) as Parameters<typeof wordBuckets>[0] & { home?: { builtIn?: boolean; words?: VocabWord[] } };
    const list = vocabList({ classVocab: vocab, home: saved.home }) as { all: VocabWord[] };
    const extra = (st.spellFocus || []).map(w => findWord([...list.all, ...(PATTERN_WORDS as VocabWord[])], w)).filter((v): v is VocabWord => !!v && !findWord(list.all, v.w));
    const b = wordBuckets(saved, [...list.all, ...extra]) as { mastered: VocabWord[]; unmastered: VocabWord[]; week: (VocabWord & { tag: string; right: boolean; result: number | null })[]; weekId: string; checkDone: boolean; cards: { first: number; n: number; skipped?: boolean } | null; back: string[] };
    const n = (tag: string) => b.week.filter(x => x.tag === tag).length, right = b.week.filter(x => x.right).length;
    const friday = b.checkDone ? `⭐ ${b.week.filter(x => x.result === 1 && x.tag !== 'review').length} mastered, ${b.week.filter(x => x.result === 0).length} stay${b.cards && !b.cards.skipped ? ` · 📇 ${b.cards.first}/${b.cards.n} cards first try` : ''}`  : !b.weekId ? 'no word set yet' : (sd => sd.due ? `🏁 day ${SET_DAYS}: mastery check due` : `📅 day ${sd.day} of ${SET_DAYS}, check on day ${SET_DAYS}`)(setDayInfo((saved as { week?: { days?: string[] } }).week, today));
    const wkSaved = (saved as { week?: { days?: string[]; check?: { done?: boolean; day?: string }; next?: { words?: string[]; added?: string[] } } }).week;
    const stale = b.checkDone && wkSaved?.next?.words?.length ? ` <span class="muted">(her next set of ${wkSaved.next.words.length} words, ${(wkSaved.next.added || []).length} new, starts the next day she opens Pet World)</span>` : b.weekId ? ` <span class="muted">(set started ${esc(b.weekId)} · practice days: ${(wkSaved?.days || []).length} of ${SET_DAYS})</span>` : '';
    const st3 = (v: VocabWord) => { const s = wordStatus(st.stats[wordKey(v.w)]); return s === 'solid' ? '✅' : s === 'close' ? '🟡' : s === 'work' ? '🔴' : ''; };
    const box = (title: string, body: string) => `<div class="vb-list"><h3>${title}</h3><div class="vb-scroll">${body}</div></div>`;
    const weekBody = b.week.length ? `<table class="steptable"><tr><th>Word</th><th>Kind</th><th>Right in this set</th><th>Day ${SET_DAYS} check</th></tr>${b.week.map(x => `<tr><td title="${esc(x.d)}"><b>${esc(x.w)}</b></td><td>${TAG_TEXT[x.tag]}</td><td>${x.right ? '✅' : '<span class="muted">–</span>'}</td><td>${x.result === 1 ? '⭐ mastered' : x.result === 0 ? (x.tag === 'review' ? '↩️ back to unmastered' : '↩️ stays') : '<span class="muted">–</span>'}</td></tr>`).join('')}</table>` : '<p class="muted">No list yet: it’s drawn the first time she opens Pet World.</p>';
    const chips = (xs: VocabWord[], mark: (v: VocabWord) => string) => xs.length ? xs.map(v => `<span class="chip" title="${esc(v.d || '')}">${mark(v)} ${esc(v.w)}</span>`).join(' ') : '<span class="muted">None yet.</span>';
    const active = b.week.length > 0 || Object.keys(st.stats || {}).length > 0 || backNotes.has(st.id || '');   // open for any student who has words this week or has practiced
    const pending = new Set(st.pendingBack || []), note = backNotes.get(st.id || ''); backNotes.delete(st.id || '');
    const masteredBody = b.mastered.length ? `<p class="muted" style="margin:0 0 4px">Tap a word to move it back to Unmastered.</p>${b.mastered.map(v => pending.has(wordKey(v.w)) ? `<span class="chip" title="Moves back to Unmastered the next time she opens Pet World">⏳ ${esc(v.w)} <small class="muted">moving back</small></span>` : st.id ? `<button type="button" class="chip vb-back" data-vb-back="${esc(v.w)}" title="${esc(v.d || '')}: tap to move it back to Unmastered">⭐ ${esc(v.w)}</button>` : `<span class="chip">⭐ ${esc(v.w)}</span>`).join(' ')}` : '<span class="muted">None yet.</span>';
    return `<details${active ? ' open' : ''} class="vb-student" data-vb-student="${esc(st.id || '')}"><summary><b>${esc(st.name)}</b> <span class="muted">⭐ ${b.mastered.length} mastered · ${b.unmastered.length} unmastered · this set ${b.week.length} (${n('carried')} carried over, ${n('new')} new, ${n('review')} review) · ✅ ${right} right in this set · ${friday}</span></summary>${stale}
      <p class="vb-path">${esc(pathSummaryText((saved as { path?: unknown }).path, b.weekId))}</p>
      <div class="vb-lists">${box(`This set’s words (${b.week.length})`, weekBody)}${box(`Unmastered (${b.unmastered.length})`, `<p class="muted" style="margin:0 0 4px">✅ solid · 🟡 getting there · 🔴 needs practice</p>${chips(b.unmastered, v => `${b.back.includes(wordKey(v.w)) ? '🔁' : ''}${st3(v)}`)}`)}${box(`⭐ Mastered (${b.mastered.length})`, masteredBody)}</div><p class="status" data-vb-back-ask>${note ? esc(note) : ''}</p></details>`;
  }).join('');
  return `<div class="card"><h2>📚 Each student’s words</h2>${intro}${rows}</div>`;
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
