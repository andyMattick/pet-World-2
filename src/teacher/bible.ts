/* ✝️ Bible on a student's page (docs/BIBLE.md): turn it on for this student, line up her memory verses, and read her
   devotion journal, her verse progress and her books-game progress. Settings are saved in quiz_overrides as "bible" (JSON
   {on, verses:[{id, ref, version, text}]}); the journal and progress come from her save (S.bible). */
import { BOOK_LEVELS, RECALL_SECTIONS, BIBLE_SECTIONS, VERSE_TRIES_A_DAY, VERSE_MOVE_UP, FULL_STEP, parseBibleSettings, normalizeVerseProgress, currentVerse, stepOn, stepName, lastFiveAverage, verseWords, withAddedVerses, normalizeAddedVerses, verseCycle, verseRecap, verseFormError, VERSE_CYCLE, type BibleSettings, type MemoryVerse } from '../shared/bible';
import { subjectDayKey } from '../shared/subjectTime';

interface JournalEntry { day: string; passage?: string; learned?: string; prayer?: string; updatedAt?: number }
interface BibleSave {
  journal?: JournalEntry[];
  books?: { level?: number; streak?: number; mastered?: boolean; done?: Record<string, string[]>; rounds?: { t: number; level: number; right: number; total: number; perfect: boolean; section?: string }[] };
  vp?: Record<string, unknown>;
  skipped?: string;
  added?: unknown;   // verses a grown-up wrote on her 5th-day recap (docs/BIBLE.md "5 practice days")
}
const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const longDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
const shortDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' });
let editId = '';   // the verse in the form ('' = a new one)

/** Where her memory verse stands, for the dashboard's "Waiting for a grown-up" card and this tab. */
export function bibleVerseStatus(qxBible: unknown, saveRaw: unknown) {
  const b = (saveRaw && typeof saveRaw === 'object' ? saveRaw : {}) as BibleSave, s = withAddedVerses(parseBibleSettings(qxBible), b.added), today = subjectDayKey();
  const cur = currentVerse(s, b.vp), p = cur ? normalizeVerseProgress(b.vp?.[cur.id]) : null, step = p ? stepOn(p, today) : 0;
  return { on: s.on, needsVerse: s.on && !cur, cur, p, step, avg: p ? lastFiveAverage(p, step) ?? lastFiveAverage(p, p.step) : null, today: p ? p.tries.filter(t => t.day === today).length : 0 };
}

export function renderBibleCard(el: HTMLElement, name: string, saveRaw: unknown, getRaw: () => unknown, save: (value: string | null) => Promise<void>) {
  const b = (saveRaw && typeof saveRaw === 'object' ? saveRaw : {}) as BibleSave, s = withAddedVerses(parseBibleSettings(getRaw()), b.added), today = subjectDayKey();
  const home = new Set(normalizeAddedVerses(b.added).map(a => a.id).filter(id => !parseBibleSettings(getRaw()).verses.some(v => v.id === id)));
  const st = bibleVerseStatus(getRaw(), saveRaw), editing = s.verses.find(v => v.id === editId);
  const journal = (b.journal || []).slice().sort((x, y) => (x.day < y.day ? 1 : -1));
  const books = b.books || {}, level = Math.max(1, Math.min(5, books.level || 1)), rounds = (books.rounds || []).slice(-8).reverse();
  const secName = (id?: string) => BIBLE_SECTIONS.find(x => x.id === id)?.name || '';
  const progressOf = (v: MemoryVerse) => normalizeVerseProgress(b.vp?.[v.id]);
  const verseRow = (v: MemoryVerse, i: number) => {
    const p = progressOf(v), now = st.cur?.id === v.id;
    const status = (home.has(v.id) ? '✍️ <small class="muted">written at home</small> ' : '') + (p.learned ? `⭐ Learned ${esc(shortDay(p.learned))}` : p.aside ? `⏸️ Set aside by a grown-up ${esc(shortDay(p.aside))}` : now ? `▶️ Learning now: ${esc(stepName(st.step))}${st.avg != null ? `, last 5 tries ${st.avg}%` : ''}` : '⏳ Up next');
    return `<tr><td>${i + 1}</td><td><b>${esc(v.ref)}</b> <span class="muted">${esc(v.version)}</span></td><td>${status}</td><td style="white-space:nowrap">${i && !p.learned ? `<button class="btn small" data-verse-up="${esc(v.id)}" aria-label="Move up">↑</button> ` : ''}<button class="btn small" data-verse-edit="${esc(v.id)}">Edit</button></td></tr>`;
  };
  const tries = st.p ? st.p.tries.slice(-10).reverse() : [];
  /* 🏁 the 5-day recap (owner, Oct 31, 2026): the verse she practiced last, the day of its 5-day round, and her latest
     finished round: the level she reached, tries, last-5 average, learned or not, with "write the next verse" */
  const lastTry = (v: MemoryVerse) => Math.max(0, ...progressOf(v).tries.map(t => t.t));
  const rv = s.verses.filter(v => progressOf(v).tries.length).sort((x, y) => lastTry(y) - lastTry(x))[0];
  const recapHTML = (() => {
    if (!rv) return '';
    const p = progressOf(rv), c = verseCycle(p, today), rc = verseRecap(p, today), finished = c.rounds > 0 || !!p.learned || !!p.aside;
    const round = p.learned || p.aside ? '' : `📅 Day ${c.day} of ${VERSE_CYCLE} of this round${c.practiced ? ' (practiced today)' : ''}. `;
    const last = finished ? `🏁 <b>${c.recapToday || p.learned === today || p.aside === today ? 'Today’s 5-day recap' : 'Her last 5-day round'}:</b> level <b>${rc.level} of ${rc.levels}</b> (${esc(rc.name)}), ${rc.tries} tries over ${rc.days} days${rc.avg != null ? `, last 5 tries ${rc.avg}%` : ''}. ${rc.learned ? '⭐ Learned.' : p.aside ? '⏸️ Set aside for a new verse.' : 'Not learned yet: it carries on (a grown-up can keep it 5 more days or write a new one).'}${p.kept ? ` A grown-up kept it 5 more days on ${esc(shortDay(p.kept))}.` : ''}` : `On day ${VERSE_CYCLE} she sees how far she got, and a grown-up can write the next verse.`;
    return `<div class="bible-recap-t"><p style="margin:4px 0"><b>${esc(rv.ref)}</b>: ${round}${last}</p><button type="button" class="btn small" id="bvWriteNext">✍️ Write the next verse</button></div>`;
  })();
  el.innerHTML = `<h3>✝️ Bible for ${esc(name)}</h3>
    <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="bibleOn" ${s.on ? 'checked' : ''}> Bible first thing every day</label>
    <p class="status" id="bibleMsg" role="status" style="margin:2px 0"></p>
    <p class="muted" style="margin-top:0">When it’s on, a ✝️ Bible spot shows in ${esc(name)}’s town and comes first each day, before the morning brain stretch, the theme question and the warm-up. In order: a devotion journal entry, a round of the books game, then 5 tries at her memory verse. A grown-up can skip one day with the grown-up PIN (it shows in the Ledger).${b.skipped === today ? ' <b>Skipped today.</b>' : ''}</p>
    ${st.needsVerse ? `<p class="review-banner">💬 ${esc(name)} ${s.verses.length ? 'has learned every verse on her list' : 'doesn’t have a memory verse yet'}. Add the next one below.</p>` : ''}
    <h3>💬 Memory verses</h3>
    <p class="muted" style="margin-top:0">She learns them in this order, one at a time, with 5 tries a day. The blanks start at 10% of the words. When her last 5 tries average ${VERSE_MOVE_UP}% or better, the next day has more blanks: 10% → 20% → 35% → 50% → 70% → the whole verse. Writing the whole verse at ${VERSE_MOVE_UP}% means she’s learned it, and the next verse starts the next day. There’s no deadline; a verse carries on until she learns it. Every ${VERSE_CYCLE} days she practices it, she sees a recap (the level she reached, her tries and average), and a grown-up at home can keep the verse ${VERSE_CYCLE} more days or write the next one there, behind the grown-up PIN; those show here as ✍️ written at home. You’ll get an alert when she moves up and when she needs a new verse.</p>
    ${st.cur && st.p ? `<p style="margin:4px 0"><b>Now:</b> ${esc(st.cur.ref)} at ${esc(stepName(st.step))}. Today: ${Math.min(st.today, VERSE_TRIES_A_DAY)} of ${VERSE_TRIES_A_DAY} tries.${st.avg != null ? ` Last 5 tries: <b>${st.avg}%</b>${st.p.up === today && st.step < FULL_STEP ? ` (moves up to ${esc(stepName(st.step + 1))} tomorrow)` : ''}.` : ''}</p>` : ''}
    ${recapHTML}
    ${s.verses.length ? `<table class="steptable"><tr><th></th><th>Verse</th><th>Progress</th><th></th></tr>${s.verses.map(verseRow).join('')}</table>` : ''}
    ${tries.length ? `<details><summary>Her last ${tries.length} tries on ${esc(st.cur?.ref || '')}</summary><table class="steptable"><tr><th>When</th><th>Practice</th><th>Right</th></tr>${tries.map(t => `<tr><td>${esc(shortDay(t.day))} ${esc(new Date(t.t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))}</td><td>${esc(stepName(t.step))}</td><td>${t.pct}%</td></tr>`).join('')}</table></details>` : ''}
    <div class="bible-verse-form">
      <h4 style="margin:10px 0 4px">${editing ? `Edit ${esc(editing.ref)}` : 'Add a verse'}</h4>
      <div class="row"><label>Reference <input id="bvRef" maxlength="80" value="${esc(editing?.ref || '')}" placeholder="e.g. John 3:16"></label><label>Translation <input id="bvVersion" maxlength="40" value="${esc(editing?.version || '')}" placeholder="e.g. ESV" style="width:110px"></label></div>
      <label for="bvText">Verse <span class="muted">(type it in the translation you use)</span></label><textarea id="bvText" rows="4" maxlength="2000" style="width:100%">${esc(editing?.text || '')}</textarea>
      ${editing ? `<p class="muted" style="margin:4px 0">${verseWords(editing.text)} words. Changing the words keeps her progress on this verse.</p>` : ''}
      <div class="row"><button type="button" class="btn small primary" id="bvSave">${editing ? 'Save changes' : 'Add to her list'}</button>${editing ? '<button type="button" class="btn small" id="bvCancel">Cancel</button><button type="button" class="btn small" id="bvRemove">Remove</button>' : ''}</div>
      <p class="status" id="bvMsg" role="status" style="margin:4px 0"></p>
    </div>
    <h3>📚 Books of the Bible</h3>
    <p style="margin:4px 0">Level ${level} of ${BOOK_LEVELS.length}: <b>${esc(BOOK_LEVELS[level - 1].name)}</b>${books.mastered ? ' · ⭐ mastered' : ''}. Sections named from memory: ${(books.done?.['3'] || []).length} of ${RECALL_SECTIONS.length}. Sections put in order: ${(books.done?.['4'] || []).length} of ${RECALL_SECTIONS.length}.</p>
    ${rounds.length ? `<table class="steptable"><tr><th>When</th><th>Level</th><th>Score</th></tr>${rounds.map(r => `<tr><td>${esc(new Date(r.t).toLocaleDateString([], { month: 'short', day: 'numeric' }))}</td><td>${r.level}. ${esc(BOOK_LEVELS[r.level - 1]?.name || '')}${r.section ? ` · ${esc(secName(r.section))}` : ''}</td><td>${r.right} of ${r.total}${r.perfect ? ' 🌟' : ''}</td></tr>`).join('')}</table>` : '<p class="muted">No rounds yet.</p>'}
    <h3>📝 Devotion journal</h3>
    ${journal.length ? journal.slice(0, 60).map((j, i) => `<details${i < 3 ? ' open' : ''} style="margin:6px 0"><summary><b>${esc(longDay(j.day))}</b>${j.passage ? ` · ${esc(j.passage)}` : ''}</summary><p style="margin:4px 0"><b>What she learned:</b> ${esc(j.learned || '').replace(/\n/g, '<br>')}</p>${j.prayer ? `<p style="margin:4px 0"><b>Thoughts or prayer:</b> ${esc(j.prayer).replace(/\n/g, '<br>')}</p>` : ''}</details>`).join('') : '<p class="muted">No entries yet.</p>'}
    `;
  const again = () => renderBibleCard(el, name, saveRaw, getRaw, save);
  /* save, then check it really saved (a failed save is otherwise silent on this tab); messages show where the change was made */
  const store = async (next: BibleSettings, msg: string, where = '#bvMsg') => {
    const want = next.on || next.verses.length ? JSON.stringify(next) : null;
    try { await save(want); } catch { /* checked below */ }
    const got = getRaw(), ok = (got == null ? null : String(got)) === want;
    again();
    const m = el.querySelector<HTMLElement>(where);
    if (m) { m.textContent = ok ? `✅ ${msg}` : '❌ That didn’t save. Reload the teacher app and try again.'; m.style.color = ok ? '' : '#b3261e'; m.style.fontWeight = '700'; }
  };
  el.querySelector<HTMLInputElement>('#bibleOn')!.addEventListener('change', e => { const on = (e.target as HTMLInputElement).checked; void store({ ...s, on }, on ? 'Bible is on. She’ll see it the next time Pet World loads.' : 'Bible is off.', '#bibleMsg'); });
  el.querySelectorAll<HTMLButtonElement>('[data-verse-edit]').forEach(btn => btn.addEventListener('click', () => { editId = btn.dataset.verseEdit!; again(); el.querySelector<HTMLInputElement>('#bvRef')?.focus(); }));
  el.querySelectorAll<HTMLButtonElement>('[data-verse-up]').forEach(btn => btn.addEventListener('click', () => {
    const i = s.verses.findIndex(v => v.id === btn.dataset.verseUp); if (i < 1) return;
    const verses = [...s.verses]; [verses[i - 1], verses[i]] = [verses[i], verses[i - 1]];
    void store({ ...s, verses }, 'Moved.');
  }));
  el.querySelector('#bvCancel')?.addEventListener('click', () => { editId = ''; again(); });
  el.querySelector('#bvSave')!.addEventListener('click', () => {
    const ref = el.querySelector<HTMLInputElement>('#bvRef')!.value.trim(), version = el.querySelector<HTMLInputElement>('#bvVersion')!.value.trim(), text = el.querySelector<HTMLTextAreaElement>('#bvText')!.value.trim().replace(/\s+/g, ' ');
    const m = el.querySelector<HTMLElement>('#bvMsg'), missing = !ref ? '#bvRef' : !text ? '#bvText' : '';
    if (missing) { if (m) { m.textContent = `❌ ${verseFormError(ref, text)}`; m.style.color = '#b3261e'; m.style.fontWeight = '700'; } el.querySelector<HTMLElement>(missing)?.focus(); return; }
    const verses = editing ? s.verses.map(v => (v.id === editing.id ? { ...v, ref, version, text } : v)) : [...s.verses, { id: `v${Date.now().toString(36)}`, ref, version, text }].slice(-100);
    editId = '';
    void store({ ...s, verses }, editing ? 'Saved.' : `Added ${ref} to ${name}’s list.`);
  });
  el.querySelector('#bvRemove')?.addEventListener('click', () => { const id = editId; editId = ''; void store({ ...s, verses: s.verses.filter(x => x.id !== id), ...(home.has(id) || s.removed?.length ? { removed: [...new Set([...(s.removed || []), ...(home.has(id) ? [id] : [])])] } : {}) }, 'Removed.'); });
  el.querySelector('#bvWriteNext')?.addEventListener('click', () => { editId = ''; again(); const f = el.querySelector<HTMLInputElement>('#bvRef'); f?.scrollIntoView({ block: 'center' }); f?.focus(); });
}
