/* ✝️ Bible on a student's page (docs/BIBLE.md): turn it on for this student, set the verse of the week, and read her
   devotion journal, her verse practice and her books-game progress. Settings are saved in quiz_overrides as "bible" (JSON
   {on, verses:[{week, ref, version, text}]}); the journal and progress come from her save (S.bible). */
import { BOOK_LEVELS, RECALL_SECTIONS, BIBLE_SECTIONS, VERSE_PLAN, parseBibleSettings, weekOf, verseWords, versePractice, type BibleSettings, type WeekVerse } from '../shared/bible';
import { subjectDayKey } from '../shared/subjectTime';

interface JournalEntry { day: string; passage?: string; learned?: string; prayer?: string; updatedAt?: number }
interface BibleSave {
  journal?: JournalEntry[];
  books?: { level?: number; streak?: number; mastered?: boolean; done?: Record<string, string[]>; rounds?: { t: number; level: number; right: number; total: number; perfect: boolean; section?: string }[] };
  verse?: Record<string, { week?: string; ref?: string; tries?: number; mistakes?: number; total?: number; mode?: string; blanks?: number; done?: boolean }>;
  skipped?: string;
}
const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const longDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
const shortDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' });
const addDays = (d: string, n: number) => { const x = new Date(`${d}T12:00:00`); x.setDate(x.getDate() + n); return subjectDayKey(x); };
let editWeek = '';   // the week whose verse is in the form

export function renderBibleCard(el: HTMLElement, name: string, saveRaw: unknown, getRaw: () => unknown, save: (value: string | null) => Promise<void>) {
  const s = parseBibleSettings(getRaw()), b = (saveRaw && typeof saveRaw === 'object' ? saveRaw : {}) as BibleSave, today = subjectDayKey(), thisWeek = weekOf(today);
  if (!editWeek) editWeek = thisWeek;
  const editing = s.verses.find(v => v.week === editWeek);
  const weeks = [thisWeek, addDays(thisWeek, 7), addDays(thisWeek, 14), addDays(thisWeek, 21)];
  const journal = (b.journal || []).slice().sort((x, y) => (x.day < y.day ? 1 : -1));
  const books = b.books || {}, level = Math.max(1, Math.min(5, books.level || 1)), rounds = (books.rounds || []).slice(-8).reverse();
  const verseDays = Object.entries(b.verse || {}).filter(([d]) => d >= addDays(thisWeek, -7)).sort((x, y) => (x[0] < y[0] ? 1 : -1));
  const secName = (id?: string) => BIBLE_SECTIONS.find(x => x.id === id)?.name || '';
  const plan = editing ? VERSE_PLAN.map((p, i) => { const pr = versePractice(editing.text, addDays(editWeek, i)); return `${p.name.slice(0, 3)}: ${pr.mode === 'full' ? 'whole verse' : `${pr.blanks} blank${pr.blanks === 1 ? '' : 's'}`}`; }).join(' · ') : '';
  el.innerHTML = `<h3>✝️ Bible for ${esc(name)}</h3>
    <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="bibleOn" ${s.on ? 'checked' : ''}> Bible first thing every day</label>
    <p class="muted" style="margin-top:0">When it’s on, a ✝️ Bible spot shows in ${esc(name)}’s town and comes first each day, before the morning brain stretch, the theme question and the warm-up. Done for the day: a devotion journal entry, plus the verse of the week or a round of the books game. A grown-up can skip one day with the grown-up PIN (it shows in the Ledger).${b.skipped === today ? ' <b>Skipped today.</b>' : ''}</p>
    <h3>💬 Verse of the week</h3>
    <div class="row">${weeks.map(w => `<button type="button" class="btn small subject-tab" data-bible-week="${w}" aria-pressed="${w === editWeek}">${w === thisWeek ? 'This week' : `Week of ${esc(shortDay(w))}`}${s.verses.some(v => v.week === w) ? ' ✅' : ''}</button>`).join('')}</div>
    <div class="bible-verse-form">
      <p class="muted" style="margin:6px 0">Week of ${esc(longDay(editWeek))}. Type it in the translation you use. Each day has more blanks, and from Friday she writes the whole verse.</p>
      <div class="row"><label>Reference <input id="bvRef" maxlength="80" value="${esc(editing?.ref || '')}" placeholder="John 3:16"></label><label>Translation <input id="bvVersion" maxlength="40" value="${esc(editing?.version || '')}" placeholder="ESV" style="width:90px"></label></div>
      <label for="bvText">Verse</label><textarea id="bvText" rows="4" maxlength="2000" style="width:100%">${esc(editing?.text || '')}</textarea>
      ${editing ? `<p class="muted" style="margin:4px 0">${verseWords(editing.text)} words. ${esc(plan)}</p>` : ''}
      <div class="row"><button type="button" class="btn small primary" id="bvSave">Save verse</button>${editing ? '<button type="button" class="btn small" id="bvRemove">Remove</button>' : ''}</div>
    </div>
    ${s.verses.length ? `<details><summary>All verses (${s.verses.length})</summary><ul>${s.verses.slice().reverse().map(v => `<li>${esc(shortDay(v.week))}: <b>${esc(v.ref)}</b> ${esc(v.version)}</li>`).join('')}</ul></details>` : ''}
    ${verseDays.length ? `<h4>Verse practice, last two weeks</h4><table class="steptable"><tr><th>Day</th><th>Verse</th><th>Practice</th><th>Best</th><th>Tries</th></tr>${verseDays.map(([d, v]) => `<tr><td>${esc(shortDay(d))}</td><td>${esc(v.ref || '')}</td><td>${v.mode === 'full' ? 'Whole verse' : `${v.blanks || 0} blanks`}</td><td>${v.total ? `${(v.total || 0) - (v.mistakes || 0)} of ${v.total}` : '—'} ${v.done ? '✅' : ''}</td><td>${v.tries || 0}</td></tr>`).join('')}</table>` : ''}
    <h3>📚 Books of the Bible</h3>
    <p style="margin:4px 0">Level ${level} of ${BOOK_LEVELS.length}: <b>${esc(BOOK_LEVELS[level - 1].name)}</b>${books.mastered ? ' · ⭐ mastered' : ''}. Sections named from memory: ${(books.done?.['3'] || []).length} of ${RECALL_SECTIONS.length}. Sections put in order: ${(books.done?.['4'] || []).length} of ${RECALL_SECTIONS.length}.</p>
    ${rounds.length ? `<table class="steptable"><tr><th>When</th><th>Level</th><th>Score</th></tr>${rounds.map(r => `<tr><td>${esc(new Date(r.t).toLocaleDateString([], { month: 'short', day: 'numeric' }))}</td><td>${r.level}. ${esc(BOOK_LEVELS[r.level - 1]?.name || '')}${r.section ? ` · ${esc(secName(r.section))}` : ''}</td><td>${r.right} of ${r.total}${r.perfect ? ' 🌟' : ''}</td></tr>`).join('')}</table>` : '<p class="muted">No rounds yet.</p>'}
    <h3>📝 Devotion journal</h3>
    ${journal.length ? journal.slice(0, 60).map((j, i) => `<details${i < 3 ? ' open' : ''} style="margin:6px 0"><summary><b>${esc(longDay(j.day))}</b>${j.passage ? ` · ${esc(j.passage)}` : ''}</summary><p style="margin:4px 0"><b>What she learned:</b> ${esc(j.learned || '').replace(/\n/g, '<br>')}</p>${j.prayer ? `<p style="margin:4px 0"><b>Thoughts or prayer:</b> ${esc(j.prayer).replace(/\n/g, '<br>')}</p>` : ''}</details>`).join('') : '<p class="muted">No entries yet.</p>'}
    <p class="status" id="bibleMsg"></p>`;
  const again = () => renderBibleCard(el, name, saveRaw, getRaw, save);
  const store = async (next: BibleSettings, msg: string) => {
    await save(next.on || next.verses.length ? JSON.stringify(next) : null);
    again(); const m = el.querySelector('#bibleMsg'); if (m) m.textContent = msg;
  };
  el.querySelector<HTMLInputElement>('#bibleOn')!.addEventListener('change', e => { void store({ ...s, on: (e.target as HTMLInputElement).checked }, (e.target as HTMLInputElement).checked ? 'Bible is on. It comes first tomorrow (or the next time she opens Pet World).' : 'Bible is off.'); });
  el.querySelectorAll<HTMLButtonElement>('[data-bible-week]').forEach(btn => btn.addEventListener('click', () => { editWeek = btn.dataset.bibleWeek!; again(); }));
  el.querySelector('#bvSave')!.addEventListener('click', () => {
    const v: WeekVerse = { week: editWeek, ref: el.querySelector<HTMLInputElement>('#bvRef')!.value.trim(), version: el.querySelector<HTMLInputElement>('#bvVersion')!.value.trim(), text: el.querySelector<HTMLTextAreaElement>('#bvText')!.value.trim().replace(/\s+/g, ' ') };
    const m = el.querySelector('#bibleMsg');
    if (!v.ref || !v.text) { if (m) m.textContent = 'Type the reference and the verse.'; return; }
    const verses = [...s.verses.filter(x => x.week !== editWeek), v].sort((a, c) => (a.week < c.week ? -1 : 1)).slice(-80);
    void store({ ...s, verses }, `Saved the verse for the week of ${shortDay(editWeek)}.`);
  });
  el.querySelector('#bvRemove')?.addEventListener('click', () => { void store({ ...s, verses: s.verses.filter(x => x.week !== editWeek) }, 'Removed.'); });
}
