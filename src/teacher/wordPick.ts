/* Teacher app: add a word from a student's own writing to the class vocabulary list (docs: VOCAB.md).
   While reviewing written work in a student's page (written answers, essays, reading notes, projects), the teacher
   highlights a word (double-click, or press and hold) and taps "📌 Add to vocab". A small box asks for a kid-friendly
   meaning, with the student's own sentence as the example (___ for the word) and a dictionary link to help. Saving
   adds it to the class list (classes.game_settings.vocab), the same list the Vocabulary tab edits, so students get it
   in the Word Workshop. */
import { esc } from './report';
import { vocabList, findWord, wordKey, validWord, blankSentence, VOCAB_LIMITS } from '../shared/vocab';
import type { ClassVocab } from './vocab';

interface VocabWord { w: string; d: string; s?: string; set?: string }
export interface WordPickTarget { vocab: ClassVocab; save: (vocab: ClassVocab) => Promise<string | null> }

export const dictUrl = (w: string) => `https://www.merriam-webster.com/dictionary/${encodeURIComponent(w)}`;
export const dictLinkHTML = (w: string) => `<a class="dict-link" href="${dictUrl(w)}" target="_blank" rel="noopener noreferrer" title="Look up “${esc(w)}” in the dictionary">📖 Dictionary ↗</a>`;

/* her writing on the student page: written-answer quotes and the notes, essays and project answers in <dd> */
const WRITING = '#detailSheet blockquote, #detailSheet dd';
const ONE_WORD = /^[\p{L}][\p{L}'’-]{1,29}$/u;

export function installWordPick(target: () => WordPickTarget | null) {
  const btn = document.createElement('button'), pop = document.createElement('div');
  btn.type = 'button'; btn.className = 'word-pick-btn'; btn.hidden = true; btn.textContent = '📌 Add to vocab';
  pop.className = 'word-pick-pop'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Add a word to the class vocabulary');
  document.body.append(btn, pop);
  let pick: { w: string; ctx: string } | null = null, timer: ReturnType<typeof setTimeout> | undefined;

  const check = () => {
    const sel = window.getSelection(), text = String(sel?.toString() || '').trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
    const node = sel?.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement : sel?.anchorNode as Element | null;
    const block = node?.closest?.(WRITING);
    if (!sel || sel.isCollapsed || !block || !ONE_WORD.test(text) || !target()) { btn.hidden = true; pick = null; return; }
    /* the sentence around the word, for the example */
    const all = String(block.textContent || '').replace(/\s+/g, ' ').trim();
    const sentence = all.split(/(?<=[.!?])\s+/).find(s => new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(s)) || all;
    pick = { w: text, ctx: sentence.slice(0, VOCAB_LIMITS.sentence) };
    const box = sel.getRangeAt(0).getBoundingClientRect();
    btn.hidden = false;
    btn.style.left = `${Math.max(8, Math.min(window.innerWidth - btn.offsetWidth - 8, box.left + box.width / 2 - btn.offsetWidth / 2))}px`;
    btn.style.top = `${box.top - btn.offsetHeight - 8 < 8 ? box.bottom + 8 : box.top - btn.offsetHeight - 8}px`;
  };
  document.addEventListener('selectionchange', () => { clearTimeout(timer); timer = setTimeout(check, 250); });
  btn.addEventListener('pointerdown', e => e.preventDefault());   // keep the selection while tapping

  btn.addEventListener('click', () => {
    const t = target();
    if (!pick || !t) return;
    const { w, ctx } = pick, { all } = vocabList({ classVocab: t.vocab }) as { all: VocabWord[] }, found = findWord(all, w) as VocabWord | null;
    pop.innerHTML = found
      ? `<p style="margin:0"><b>${esc(found.w)}</b> is already on the list: ${esc(found.d)}</p><div class="row">${dictLinkHTML(found.w)}<button type="button" class="btn small" data-wp-close>Close</button></div>`
      : `<label>Word <input type="text" data-wp-word maxlength="${VOCAB_LIMITS.word}" value="${esc(w.toLowerCase())}"></label>
        <label>Kid-friendly meaning <input type="text" data-wp-def maxlength="${VOCAB_LIMITS.def}" placeholder="What it means, in her words"></label>
        <label>Example sentence (___ for the word) <input type="text" data-wp-sentence maxlength="${VOCAB_LIMITS.sentence}" value="${esc(blankSentence(ctx, w))}"></label>
        <div class="row"><button type="button" class="btn small primary" data-wp-add>Add to the class list</button>${dictLinkHTML(w)}<button type="button" class="btn small" data-wp-close>Cancel</button></div>
        <p class="status" data-wp-msg></p>`;
    pop.hidden = false;
    pop.style.left = `${Math.max(8, Math.min(window.innerWidth - 360, parseFloat(btn.style.left)))}px`;
    pop.style.top = `${Math.max(8, Math.min(window.innerHeight - 260, parseFloat(btn.style.top)))}px`;
    btn.hidden = true; window.getSelection()?.removeAllRanges();
    (pop.querySelector<HTMLInputElement>('[data-wp-def]') || pop.querySelector<HTMLElement>('[data-wp-close]'))?.focus();
  });

  pop.addEventListener('click', async e => {
    const el = e.target as HTMLElement;
    if (el.closest('[data-wp-close]')) { pop.hidden = true; return; }
    const add = el.closest<HTMLButtonElement>('[data-wp-add]'), t = target();
    if (!add || !t) return;
    const word = pop.querySelector<HTMLInputElement>('[data-wp-word]')!.value.trim(), typed = pop.querySelector<HTMLInputElement>('[data-wp-sentence]')!.value;
    const msg = pop.querySelector<HTMLElement>('[data-wp-msg]')!;
    const entry = validWord({ w: word, d: pop.querySelector<HTMLInputElement>('[data-wp-def]')!.value, s: typed.includes('___') ? typed : blankSentence(typed, word) }) as VocabWord | null;
    if (!entry) { msg.textContent = 'Type a word and what it means.'; msg.className = 'status err'; pop.querySelector<HTMLInputElement>('[data-wp-def]')!.focus(); return; }
    const words = (t.vocab.words || []).map(validWord).filter(Boolean) as VocabWord[], focus = t.vocab.focus || [];
    const next: ClassVocab = { ...t.vocab, words: [...words.filter(v => wordKey(v.w) !== wordKey(entry.w)), entry].slice(0, VOCAB_LIMITS.list), focus: focus.length ? [...new Set([...focus, wordKey(entry.w)])] : [] };
    add.disabled = true; add.textContent = 'Saving…';
    const err = await t.save(next);
    if (err) { add.disabled = false; add.textContent = 'Add to the class list'; msg.textContent = `Couldn’t save: ${err}`; msg.className = 'status err'; return; }
    pop.innerHTML = `<p style="margin:0">✅ <b>${esc(entry.w)}</b> is on the class list. Students will see it in the 🔤 Word Workshop.</p><div class="row"><button type="button" class="btn small" data-wp-close>Close</button></div>`;
  });
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !(e.target as HTMLElement).closest('.word-pick-pop')) pop.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') pop.hidden = true; });
}
