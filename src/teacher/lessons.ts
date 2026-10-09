/* Teacher app: Lessons & questions tab (docs: LESSON-CONTENT.md).
   Per class: the teacher's own lesson link in place of (or above) the Khan link, and hiding, editing and
   adding bank questions. Built-in questions are never deleted, only hidden (Restore) or edited (Undo edit).
   Everything is saved on the class (classes.lesson_links, classes.question_edits); students get it through my_student(). */
import { esc } from './report';
import { LESSON_COURSES, builtInBank, lessonLinkSlots, khanSearchUrl, validLessonLink, validQuestion, applyQuestionEdits, QUESTION_LIMITS } from '../shared/questionBanks';

export interface LessonLink { url: string; title?: string; note?: string; showKhan?: boolean }
interface QuestionText { prompt: string; options: string[]; difficulty?: number }
interface TeacherQuestion extends QuestionText { id: string; status: 'approved' | 'draft' }
export interface QuestionEdits { hidden?: string[]; edited?: Record<string, QuestionText>; added?: Record<string, TeacherQuestion[]> }
export interface LessonClass { id: string; name: string; lesson_links?: Record<string, LessonLink> | null; question_edits?: QuestionEdits | null }
/* saves columns on one class and returns an error message, or null when it worked */
type SaveClass = (classId: string, patch: { lesson_links?: Record<string, LessonLink>; question_edits?: QuestionEdits }) => Promise<string | null>;

interface Course { id: string; title: string; skills: { id: string; name: string }[] }
interface BankQuestion { prompt: string; options: string[]; answer: number; difficulty?: number }
interface Shown extends BankQuestion { id: string; source: 'built-in' | 'edited' | 'teacher'; hidden?: boolean }
interface LinkSlot { key: string; name: string; khan: string; skills: string[] }

const COURSES = LESSON_COURSES as unknown as Course[];
const MIN_QUESTIONS = 4;
const pick = { course: COURSES[0].id, skill: COURSES[0].skills[0].id, slot: '' };
let flash = '';   // message shown once after a save reloads the page

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value ?? {})) as T;
const shownQuestions = (cls: LessonClass, includeHidden: boolean) =>
  applyQuestionEdits(pick.course, pick.skill, (builtInBank(pick.course) as unknown as Record<string, BankQuestion[]>)[pick.skill] || [], cls.question_edits || {}, { includeHidden }) as unknown as Shown[];

export function renderLessons(pane: HTMLElement, cls: LessonClass, others: LessonClass[], save: SaveClass, reload: () => Promise<void>) {
  if (!('lesson_links' in cls) || !('question_edits' in cls)) {
    pane.innerHTML = `<div class="card"><h2>Lessons &amp; questions</h2><p class="err">The database needs the new lesson columns first. Run <code>supabase/migrations/20261007000000_lesson_content.sql</code> in Supabase, then reload this page.</p></div>`;
    return;
  }
  const course = COURSES.find(c => c.id === pick.course) || COURSES[0];
  if (!course.skills.some(s => s.id === pick.skill)) pick.skill = course.skills[0].id;
  pick.course = course.id;
  const slots = (lessonLinkSlots(course.id) as LinkSlot[]).filter(slot => slot.skills.includes(pick.skill));
  if (!slots.some(slot => slot.key === pick.slot)) pick.slot = slots[0]?.key || '';
  const slot = slots.find(s => s.key === pick.slot);
  const links = cls.lesson_links || {};
  const mine = slot ? validLessonLink(links[slot.key]) : null;
  const all = shownQuestions(cls, true), visible = all.filter(q => !q.hidden);
  const message = flash; flash = '';

  pane.innerHTML = `${message ? `<p class="status">${esc(message)}</p>` : ''}
    <div class="card"><h2>Lessons &amp; questions</h2>
      <p class="muted" style="margin-top:0">Changes apply to <b>${esc(cls.name)}</b> only. Khan Academy and the built-in questions stay the default until you change something.</p>
      <div class="two"><div><label for="lqCourse">Course</label><select id="lqCourse">${COURSES.map(c => `<option value="${c.id}" ${c.id === course.id ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select></div>
      <div><label for="lqSkill">Lesson</label><select id="lqSkill">${course.skills.map(s => `<option value="${s.id}" ${s.id === pick.skill ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></div></div>
    </div>
    <div class="two">
      <div class="card"><h2>Lesson link</h2>
        ${slots.length > 1 ? `<label for="lqSlot">Link shown for</label><select id="lqSlot">${slots.map(s => `<option value="${esc(s.key)}" ${s.key === pick.slot ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select>` : slot ? `<p class="muted" style="margin-top:0">Shown at the top of <b>${esc(slot.name)}</b>${slot.skills.length > 1 ? ', for all of its lessons' : ''}.</p>` : ''}
        ${slot ? `<p>Khan default: <a href="${esc(slot.khan || khanSearchUrl(slot.name))}" target="_blank" rel="noopener noreferrer">${slot.khan ? 'Khan Academy lesson' : 'Khan Academy search'}</a>${mine ? ' <span class="tag i">Students see your link first</span>' : ''}</p>
        <label for="lqUrl">My link (https://)</label><input type="url" id="lqUrl" maxlength="500" placeholder="https://www.youtube.com/watch?v=…" value="${esc(mine?.url || '')}">
        <label for="lqTitle">Title</label><input type="text" id="lqTitle" maxlength="100" placeholder="Watch your teacher’s lesson" value="${esc(mine?.title || '')}">
        <label for="lqNote">Note (up to 200 characters)</label><input type="text" id="lqNote" maxlength="200" placeholder="Watch this before you practice." value="${esc(mine?.note || '')}">
        <label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="lqShowKhan" ${mine && !mine.showKhan ? '' : 'checked'}> Also show the Khan link</label>
        <div class="row"><button class="btn primary" id="lqSaveLink">Save</button>${links[slot.key] ? '<button class="btn" id="lqBackToKhan">Back to Khan</button>' : ''}<span class="status" id="lqLinkMsg"></span></div>`
        : '<p class="muted">This lesson has no Khan link to replace.</p>'}
      </div>
      <div class="card"><h2>Copy to my other classes</h2>
        <p class="muted" style="margin-top:0">Copies this class's links and question changes for <b>${esc(course.title)}</b>. Hidden questions are combined, and links, edits and your own questions from this class win.</p>
        ${others.length ? `${others.map(o => `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-copy-to="${o.id}"> ${esc(o.name)}</label>`).join('')}
        <div class="row"><button class="btn" id="lqCopy">Copy to selected classes</button><span class="status" id="lqCopyMsg"></span></div>` : '<p class="muted">You have no other classes.</p>'}
      </div>
    </div>
    <div class="card"><h2>Questions</h2>
      <p>Students see <b>${visible.length}</b> question${visible.length === 1 ? '' : 's'} in this lesson. Practice picks 4 at random; quizzes and the unit test draw from all of them.</p>
      <div class="row" style="margin-top:0"><button class="btn small primary" id="lqAdd">Add a question</button><span class="status" id="lqMsg"></span></div>
      <div id="lqForm"></div>
      <table class="steptable" style="margin-top:10px"><thead><tr><th>Question</th><th>Level</th><th></th><th></th></tr></thead><tbody>
      ${all.map(q => {
        const correct = q.options[q.answer], wrong = q.options.filter((_, i) => i !== q.answer);
        const badge = q.hidden ? 'Hidden' : q.source === 'edited' ? 'Edited' : q.source === 'teacher' ? 'Mine' : 'Built-in';
        const actions = q.source === 'teacher'
          ? `<button class="btn small" data-q-edit="${esc(q.id)}">Edit</button> <button class="btn small" data-q-delete="${esc(q.id)}">Delete</button>`
          : q.hidden ? `<button class="btn small" data-q-restore="${esc(q.id)}">Restore</button>`
          : `<button class="btn small" data-q-edit="${esc(q.id)}">Edit</button>${q.source === 'edited' ? ` <button class="btn small" data-q-undo="${esc(q.id)}">Undo edit</button>` : ''} <button class="btn small" data-q-hide="${esc(q.id)}">Hide</button>`;
        return `<tr${q.hidden ? ' style="opacity:.5"' : ''}><td>${esc(q.prompt)}<br><b>${esc(correct)}</b> · <span class="muted">${wrong.map(esc).join(' · ')}</span></td><td>${q.difficulty || '–'}</td><td style="white-space:nowrap"><span class="tag ${q.source === 'built-in' && !q.hidden ? 'i' : 'a'}">${badge}</span></td><td style="text-align:right; white-space:nowrap">${actions}</td></tr><tr data-q-form-row="${esc(q.id)}" hidden><td colspan="4"></td></tr>`;
      }).join('')}
      </tbody></table>
    </div>`;

  const $ = (sel: string) => pane.querySelector(sel) as HTMLElement;
  const edits = () => clone<QuestionEdits>(cls.question_edits || {});
  const lessonKey = `${course.id}:${pick.skill}`;
  async function saveEdits(next: QuestionEdits, done: string, statusSel = '#lqMsg') {
    const error = await save(cls.id, { question_edits: next });
    if (error) { $(statusSel).textContent = error; return; }
    flash = done; await reload();
  }

  $('#lqCourse').addEventListener('change', e => { pick.course = (e.target as HTMLSelectElement).value; pick.skill = ''; pick.slot = ''; renderLessons(pane, cls, others, save, reload); });
  $('#lqSkill').addEventListener('change', e => { pick.skill = (e.target as HTMLSelectElement).value; pick.slot = ''; renderLessons(pane, cls, others, save, reload); });
  pane.querySelector('#lqSlot')?.addEventListener('change', e => { pick.slot = (e.target as HTMLSelectElement).value; renderLessons(pane, cls, others, save, reload); });

  /* ---- lesson link ---- */
  if (slot) {
    $('#lqSaveLink').addEventListener('click', async () => {
      const link = validLessonLink({ url: ($('#lqUrl') as HTMLInputElement).value, title: ($('#lqTitle') as HTMLInputElement).value, note: ($('#lqNote') as HTMLInputElement).value, showKhan: ($('#lqShowKhan') as HTMLInputElement).checked });
      if (!link) { $('#lqLinkMsg').textContent = 'Paste a full link that starts with https://'; $('#lqLinkMsg').className = 'status err'; return; }
      const next = { ...clone<Record<string, LessonLink>>(links), [slot.key]: link };
      const error = await save(cls.id, { lesson_links: next });
      if (error) { $('#lqLinkMsg').textContent = error; return; }
      flash = 'Lesson link saved.'; await reload();
    });
    pane.querySelector('#lqBackToKhan')?.addEventListener('click', async () => {
      const next = clone<Record<string, LessonLink>>(links); delete next[slot.key];
      const error = await save(cls.id, { lesson_links: next });
      if (error) { $('#lqLinkMsg').textContent = error; return; }
      flash = 'Back to the Khan Academy link.'; await reload();
    });
  }

  /* ---- questions ---- */
  function openForm(host: HTMLElement, existing: Shown | null) {
    pane.querySelectorAll<HTMLElement>('[data-q-form-row]').forEach(row => { row.hidden = true; (row.firstElementChild as HTMLElement).innerHTML = ''; });
    $('#lqForm').innerHTML = '';
    const correct = existing ? existing.options[existing.answer] : '';
    const wrong = existing ? existing.options.filter((_, i) => i !== existing.answer) : ['', '', ''];
    const level = existing?.difficulty || (existing ? 1 : 2);
    host.innerHTML = `<div class="card" style="margin:8px 0"><h3 style="margin-top:0">${existing ? (existing.source === 'teacher' ? 'Edit my question' : 'Edit this question for my class') : 'Add a question'}</h3>
      <label for="qfPrompt">Question</label><textarea id="qfPrompt" maxlength="${QUESTION_LIMITS.prompt}" style="font-family:inherit; font-size:.95rem; min-height:60px">${esc(existing?.prompt || '')}</textarea>
      <label for="qfCorrect">Correct answer</label><input type="text" id="qfCorrect" maxlength="${QUESTION_LIMITS.answer}" value="${esc(correct)}">
      ${wrong.map((w, i) => `<label for="qfWrong${i}">Wrong answer ${i + 1}</label><input type="text" id="qfWrong${i}" maxlength="${QUESTION_LIMITS.answer}" value="${esc(w)}">`).join('')}
      <label for="qfLevel">Difficulty</label><select id="qfLevel">${[1, 2, 3].map(n => `<option value="${n}" ${n === level ? 'selected' : ''}>${n} · ${['easier', 'medium', 'harder'][n - 1]}</option>`).join('')}</select>
      <p class="muted">Keep the correct answer about the same length as the wrong ones. Students see the answers in a random order.</p>
      <div class="row"><button class="btn primary" id="qfSave">Save question</button><button class="btn" id="qfCancel">Cancel</button><span class="status err" id="qfMsg"></span></div></div>`;
    const row = host.closest<HTMLElement>('[data-q-form-row]'); if (row) row.hidden = false;
    (host.querySelector('#qfPrompt') as HTMLTextAreaElement).focus();
    host.querySelector('#qfCancel')!.addEventListener('click', () => { host.innerHTML = ''; if (row) row.hidden = true; });
    host.querySelector('#qfSave')!.addEventListener('click', async () => {
      const val = (sel: string) => (host.querySelector(sel) as HTMLInputElement).value.trim();
      const prompt = val('#qfPrompt'), options = [val('#qfCorrect'), val('#qfWrong0'), val('#qfWrong1'), val('#qfWrong2')], difficulty = +val('#qfLevel');
      const msg = host.querySelector('#qfMsg') as HTMLElement;
      if (!prompt || options.some(o => !o)) { msg.textContent = 'Fill in the question and all four answers.'; return; }
      if (new Set(options.map(o => o.toLowerCase())).size < 4) { msg.textContent = 'The four answers must all be different.'; return; }
      if (prompt.length >= QUESTION_LIMITS.prompt) { msg.textContent = `Keep the question under ${QUESTION_LIMITS.prompt} characters.`; return; }
      if (options.some(o => o.length >= QUESTION_LIMITS.answer)) { msg.textContent = `Keep each answer under ${QUESTION_LIMITS.answer} characters.`; return; }
      if (!validQuestion({ prompt, options, difficulty })) { msg.textContent = 'This question is not complete.'; return; }
      const next = edits();
      if (existing && existing.source !== 'teacher') {
        next.edited = { ...(next.edited || {}), [existing.id]: { prompt, options, difficulty } };
      } else {
        const list = [...(next.added?.[lessonKey] || [])];
        const item: TeacherQuestion = { id: existing?.id || `t-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, prompt, options, difficulty, status: 'approved' };
        const at = existing ? list.findIndex(q => q.id === existing.id) : -1;
        if (at >= 0) list[at] = item; else list.push(item);
        next.added = { ...(next.added || {}), [lessonKey]: list };
      }
      const error = await save(cls.id, { question_edits: next });
      if (error) { msg.textContent = error; return; }
      flash = existing ? 'Question saved.' : 'Question added.'; await reload();
    });
  }
  $('#lqAdd').addEventListener('click', () => openForm($('#lqForm'), null));
  const byId = (id: string | undefined) => all.find(q => q.id === id) || null;
  pane.querySelectorAll<HTMLButtonElement>('[data-q-edit]').forEach(b => b.addEventListener('click', () => {
    const q = byId(b.dataset.qEdit); if (!q) return;
    const row = pane.querySelector(`[data-q-form-row="${CSS.escape(q.id)}"]`) as HTMLElement;
    openForm(row.firstElementChild as HTMLElement, q);
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-q-hide]').forEach(b => b.addEventListener('click', () => {
    if (visible.length - 1 < MIN_QUESTIONS) { $('#lqMsg').textContent = 'A lesson needs at least 4 questions for practice.'; $('#lqMsg').className = 'status err'; return; }
    const next = edits(); next.hidden = [...new Set([...(next.hidden || []), b.dataset.qHide!])];
    void saveEdits(next, 'Question hidden. Restore brings it back.');
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-q-restore]').forEach(b => b.addEventListener('click', () => {
    const next = edits(); next.hidden = (next.hidden || []).filter(id => id !== b.dataset.qRestore);
    void saveEdits(next, 'Question restored.');
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-q-undo]').forEach(b => b.addEventListener('click', () => {
    const next = edits(); if (next.edited) delete next.edited[b.dataset.qUndo!];
    void saveEdits(next, 'Back to the built-in question.');
  }));
  pane.querySelectorAll<HTMLButtonElement>('[data-q-delete]').forEach(b => {
    let armed = false;
    b.addEventListener('click', () => {
      if (visible.length - 1 < MIN_QUESTIONS) { $('#lqMsg').textContent = 'A lesson needs at least 4 questions for practice.'; $('#lqMsg').className = 'status err'; return; }
      if (!armed) { armed = true; b.textContent = 'Click again to delete'; setTimeout(() => { armed = false; b.textContent = 'Delete'; }, 4000); return; }
      const next = edits();
      next.added = { ...(next.added || {}), [lessonKey]: (next.added?.[lessonKey] || []).filter(q => q.id !== b.dataset.qDelete) };
      void saveEdits(next, 'Question deleted.');
    });
  });

  /* ---- copy to other classes (this course only) ---- */
  const copyButton = pane.querySelector<HTMLButtonElement>('#lqCopy');
  if (copyButton) {
    let armed = false;
    copyButton.addEventListener('click', async () => {
      const targets = others.filter(o => (pane.querySelector(`[data-copy-to="${o.id}"]`) as HTMLInputElement)?.checked);
      if (!targets.length) { $('#lqCopyMsg').textContent = 'Tick at least one class.'; return; }
      if (!armed) { armed = true; copyButton.textContent = `Click again to copy to ${targets.length} class${targets.length === 1 ? '' : 'es'}`; setTimeout(() => { armed = false; copyButton.textContent = 'Copy to selected classes'; }, 5000); return; }
      copyButton.disabled = true;
      const failed: string[] = [];
      for (const target of targets) {
        const merged = mergeCourse(course.id, cls, target);
        const error = await save(target.id, merged);
        if (error) failed.push(`${target.name}: ${error}`);
      }
      if (failed.length) { copyButton.disabled = false; $('#lqCopyMsg').textContent = failed.join(' · '); return; }
      flash = `Copied to ${targets.map(t => t.name).join(', ')}.`; await reload();
    });
  }
}

/* This class's links and question changes for one course, merged into another class's:
   hidden lists are combined; links, edits and added questions (joined by id) from the source win. */
export function mergeCourse(courseId: string, from: LessonClass, into: LessonClass) {
  const mine = (key: string) => key.startsWith(`${courseId}:`);
  const src = from.question_edits || {}, dst = clone<QuestionEdits>(into.question_edits || {});
  const lesson_links = { ...clone<Record<string, LessonLink>>(into.lesson_links || {}) };
  Object.entries(from.lesson_links || {}).forEach(([key, link]) => { if (mine(key)) lesson_links[key] = link; });
  const hidden = [...new Set([...(dst.hidden || []), ...(src.hidden || []).filter(mine)])];
  const edited = { ...(dst.edited || {}) };
  Object.entries(src.edited || {}).forEach(([id, edit]) => { if (mine(id)) edited[id] = edit; });
  const added = { ...(dst.added || {}) };
  Object.entries(src.added || {}).forEach(([key, list]) => {
    if (!mine(key)) return;
    const byId = new Map((added[key] || []).map(q => [q.id, q]));
    list.forEach(q => byId.set(q.id, q));
    added[key] = [...byId.values()];
  });
  return { lesson_links, question_edits: { ...dst, hidden, edited, added } };
}
