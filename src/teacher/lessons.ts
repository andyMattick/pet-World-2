/* Teacher app: Lessons & questions tab (docs: LESSON-CONTENT.md).
   Per class: the teacher's own lesson link in place of (or above) the Khan link, and hiding, editing and
   adding bank questions. Copy prompt and Import bring in questions written by any chatbot as drafts, which the
   teacher approves one by one; students only ever see approved questions. Built-in questions are never deleted, only hidden (Restore) or edited (Undo edit).
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
interface Shown extends BankQuestion { id: string; source: 'built-in' | 'edited' | 'teacher'; hidden?: boolean; status?: 'approved' | 'draft' }
interface LinkSlot { key: string; name: string; khan: string; skills: string[] }

/* How often students in this class answered and missed each bank question, summed from their saves
   (state.questionStats, written by the game). undefined while loading, null if it couldn't be loaded. */
export interface QuestionStats { students: number; byId: Record<string, [number, number]> }
export const MISS_FLAG = { minAnswers: 5, rate: 0.6 };
export function sumQuestionStats(perStudent: unknown[]): QuestionStats {
  const byId: Record<string, [number, number]> = {};
  let students = 0;
  for (const stats of perStudent) {
    if (!stats || typeof stats !== 'object') continue;
    let any = false;
    for (const [id, v] of Object.entries(stats as Record<string, unknown>)) {
      if (!Array.isArray(v) || v.length !== 2 || !v.every(n => Number.isInteger(n) && n >= 0) || v[1] > v[0]) continue;
      const total = byId[id] || (byId[id] = [0, 0]);
      total[0] += v[0]; total[1] += v[1]; any = true;
    }
    if (any) students++;
  }
  return { students, byId };
}
/* the same key the game uses: an edited built-in question starts a new count */
const statKey = (q: { id: string; source: string }) => q.source === 'edited' ? `${q.id}~e` : q.id;

/* ---------- Khan unit test results (roadmap step 10; saved in classes.khan_results, teacher only) ---------- */
interface KhanEntry { date: string; score: number | null; missed: string[]; cleared?: string[] }
export interface KhanResults { passScore?: number; students?: Record<string, Record<string, KhanEntry>> }
interface UnitTestRecord { passed?: boolean; best?: number; tries?: number; questionCount?: number }
export interface RosterRow { id: string; name: string; progress: Record<string, Record<string, UnitTestRecord> | undefined> }
/* roster: null if it couldn't be loaded. results: null when the khan_results column doesn't exist yet (migration not run). */
export interface KhanData { roster: RosterRow[] | null; results: KhanResults | null; save: (next: KhanResults) => Promise<string | null> }
const DEFAULT_KHAN_PASS = 80;
/* where the game keeps each course's unit test result in a student's save */
export const UNIT_TESTS: Record<string, [string, string]> = {
  nouns: ['elaProgress', 'final-test'], verbs: ['elaProgress', 'verbs:final-test'],
  history: ['historyProgress', 'history:final-test'], history2: ['historyProgress', 'history2:final-test'],
  history3: ['historyProgress', 'history3:final-test'], history4: ['historyProgress', 'history4:final-test'],
  bio1: ['scienceProgress', 'bio1:final-test']
};
/* the Khan topics for a course: one per block, keyed like lesson_links ("<courseId>:<groupId>") */
const khanTopics = (courseId: string) => (lessonLinkSlots(courseId) as LinkSlot[]).filter(slot => slot.key.split(':').length === 2);
const openTopics = (entry?: KhanEntry) => entry ? entry.missed.filter(key => !(entry.cleared || []).includes(key)) : [];
export function khanStatus(unit: UnitTestRecord | undefined, entry: KhanEntry | undefined, passScore: number) {
  const open = openTopics(entry), unitPassed = !!unit?.passed;
  const khanPassed = !!entry && entry.score != null && entry.score >= passScore;
  const badge = khanPassed && !open.length ? 'passed' : open.length ? 'reteach' : unitPassed ? 'ready' : 'notyet';
  return { open, unitPassed, khanPassed, badge };
}
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

const COURSES = LESSON_COURSES as unknown as Course[];
const MIN_QUESTIONS = 4;
const pick = { course: COURSES[0].id, skill: COURSES[0].skills[0].id, slot: '' };
let flash = '';   // message shown once after a save reloads the page

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value ?? {})) as T;
const shownQuestions = (cls: LessonClass, includeHidden: boolean) =>
  applyQuestionEdits(pick.course, pick.skill, (builtInBank(pick.course) as unknown as Record<string, BankQuestion[]>)[pick.skill] || [], cls.question_edits || {}, { includeHidden, includeDrafts: includeHidden }) as unknown as Shown[];

/* ---------- Copy prompt and Import (no API key: the teacher pastes the prompt into any chatbot) ---------- */
export const IMPORT_LIMIT = 40;   // questions per import
const MAX_DRAFTS = 80;            // drafts waiting in one lesson
const CSV_TEMPLATE = 'question,correct,wrong 1,wrong 2,wrong 3,level\n"Which part of a cell holds its DNA?","Nucleus","Cell membrane","Cytoplasm","Cell wall",1\n';
const norm = (text: string) => String(text ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = (text: string) => String(text).trim().split(/\s+/).filter(Boolean).length;
export interface ImportedQuestion { prompt: string; correct: string; wrong: string[]; level?: number }

/* The prompt a teacher pastes into Claude, ChatGPT or any chatbot. The reply format is exactly what Import reads. */
export function buildCopyPrompt(info: { course: string; lesson: string; khanTopic: string; khanUrl: string; existing: { prompt: string; correct: string }[]; count?: number; missedBy?: number }) {
  const count = info.count || 10;
  return [
    `Write ${count} new multiple-choice questions for 6th grade students.`,
    '',
    `Course: ${info.course}`,
    `Lesson: ${info.lesson}`,
    `Khan Academy topic: ${info.khanTopic}${info.khanUrl ? ` (${info.khanUrl})` : ''}`,
    ...(info.missedBy ? ['', `${info.missedBy} student${info.missedBy === 1 ? '' : 's'} in this class missed this topic on the Khan Academy unit test. Aim the questions at the parts of this topic that Khan's unit test asks about, so these students can close the gap.`] : []),
    '',
    'Rules:',
    '- Match the level of the Khan Academy unit test for this topic. About 2 in 5 questions should be harder (level 3): data or experiment questions, claim and evidence, "what would happen if", or comparing two things.',
    '- Each question has exactly one correct answer and three wrong answers. Wrong answers must be believable to a student who has not mastered the lesson, never silly.',
    '- Keep the correct answer about the same length as the wrong answers. Do not use "all of the above", "none of the above", or "both A and B".',
    '- Write for a 6th grade reader: questions under 40 words and 300 characters, answers under 120 characters.',
    '- Do not repeat or reword any of the existing questions listed below.',
    '- Give each question a level: 1 (easier), 2 (medium) or 3 (harder).',
    '- Before you reply, solve every question yourself. Fix or replace any question where the marked answer is wrong or where two answers could be right.',
    '',
    `Existing questions (${info.existing.length}):`,
    ...info.existing.map((q, i) => `${i + 1}. ${q.prompt} [answer: ${q.correct}]`),
    '',
    'Reply with only a JSON array in this exact format, and no other text:',
    '[',
    '  {"question": "…", "correct": "…", "wrong": ["…", "…", "…"], "level": 2}',
    ']'
  ].join('\n');
}

/* A pasted chatbot reply (JSON, even with extra text or a code fence around it) or a CSV file:
   question, correct, wrong 1, wrong 2, wrong 3, level. Returns the questions found and why any were skipped. */
export function parseImport(text: string): { items: ImportedQuestion[]; errors: string[] } {
  const raw = String(text || '').trim(), items: ImportedQuestion[] = [], errors: string[] = [];
  if (!raw) return { items, errors: ['Paste the chatbot reply or choose a CSV file first.'] };
  const str = (v: unknown) => typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '';
  const level = (v: unknown) => { const n = Number(v); return [1, 2, 3].includes(n) ? n : undefined; };
  const start = raw.indexOf('['), end = raw.lastIndexOf(']');
  if (start >= 0 && end > start && /^\s*\{/.test(raw.slice(start + 1))) {
    let list: unknown;
    try { list = JSON.parse(raw.slice(start, end + 1)); } catch { return { items, errors: ['The reply looks like JSON but could not be read. Ask the chatbot to reply with only the JSON array.'] }; }
    (Array.isArray(list) ? list : []).forEach((q, i) => {
      const o = (q && typeof q === 'object' ? q : {}) as Record<string, unknown>;
      const options = Array.isArray(o.options) ? o.options.map(str) : null, at = Number(o.answer);
      const prompt = str(o.question ?? o.prompt);
      const correct = options && Number.isInteger(at) && options[at] ? options[at] : str(o.correct ?? o.answer);
      const wrong = options && Number.isInteger(at) ? options.filter((_, k) => k !== at) : (Array.isArray(o.wrong ?? o.wrongs ?? o.incorrect) ? ((o.wrong ?? o.wrongs ?? o.incorrect) as unknown[]).map(str) : []);
      if (!prompt || !correct) { errors.push(`Question ${i + 1}: missing the question or the correct answer.`); return; }
      items.push({ prompt, correct, wrong, level: level(o.level ?? o.difficulty) });
    });
    return { items, errors };
  }
  /* CSV: quoted fields may hold commas, quotes ("") and line breaks */
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (quoted) { if (ch === '"' && raw[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = false; else cell += ch; continue; }
    if (ch === '"') quoted = true; else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && raw[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += ch;
  }
  row.push(cell); rows.push(row);
  const data = rows.filter(r => r.some(c => c.trim()));
  if (data.length && /question/i.test(data[0][0] || '')) data.shift();
  if (!data.length || data.every(r => r.length < 5)) return { items, errors: ['No questions found. Paste the JSON reply, or use the CSV template: question, correct, wrong 1, wrong 2, wrong 3, level.'] };
  data.forEach((r, i) => {
    const [prompt, correct, w1, w2, w3, lv] = r.map(c => c.trim());
    if (!prompt || !correct) { errors.push(`Row ${i + 1}: missing the question or the correct answer.`); return; }
    items.push({ prompt, correct, wrong: [w1, w2, w3].filter(w => w !== undefined), level: level(lv) });
  });
  return { items, errors };
}

/* The in-app checks. An error means the question can't be saved; warnings are shown on the draft for the teacher to judge. */
export function checkImported(q: ImportedQuestion, known: Set<string>): { error?: string; warnings: string[] } {
  const wrong = q.wrong.filter(w => w);
  if (wrong.length !== 3) return { error: 'needs exactly three wrong answers', warnings: [] };
  const options = [q.correct, ...wrong];
  if (new Set(options.map(norm)).size < 4) return { error: 'two of its answers are the same', warnings: [] };
  if (q.prompt.length >= QUESTION_LIMITS.prompt) return { error: `the question is ${QUESTION_LIMITS.prompt} characters or longer`, warnings: [] };
  if (options.some(o => o.length >= QUESTION_LIMITS.answer)) return { error: `an answer is ${QUESTION_LIMITS.answer} characters or longer`, warnings: [] };
  if (!validQuestion({ prompt: q.prompt, options, difficulty: q.level })) return { error: 'it is not complete', warnings: [] };
  return { warnings: draftWarnings(q.prompt, options, known) };
}
export function draftWarnings(prompt: string, options: string[], known: Set<string>): string[] {
  const warnings: string[] = [];
  if (known.has(norm(prompt))) warnings.push('Matches a question already in this lesson');
  const longestWrong = Math.max(...options.slice(1).map(o => o.length));
  if (options[0].length > longestWrong * 1.5 && options[0].length - longestWrong >= 12) warnings.push('Right answer is much longer than the wrong ones');
  if (words(prompt) > 40) warnings.push('Long for 6th grade');
  if (options.slice(1).some(o => /\b(all|none) of the above\b|\bboth [a-d] and [a-d]\b/i.test(o))) warnings.push('Uses "all/none of the above"');
  return warnings;
}

export function renderLessons(pane: HTMLElement, cls: LessonClass, others: LessonClass[], save: SaveClass, reload: () => Promise<void>, stats?: QuestionStats | null, khan?: KhanData) {
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
  const all = shownQuestions(cls, true), visible = all.filter(q => !q.hidden && q.status !== 'draft'), drafts = all.filter(q => q.status === 'draft');
  /* warnings for a draft: compared with every other question in the lesson */
  const warningsFor = (q: Shown) => draftWarnings(q.prompt, [q.options[q.answer], ...q.options.filter((_, i) => i !== q.answer)], new Set(all.filter(o => o.id !== q.id).map(o => norm(o.prompt))));
  const cleanDrafts = drafts.filter(q => !warningsFor(q).length);
  const message = flash; flash = '';
  /* Khan results for this course */
  const topics = khanTopics(course.id), passScore = khan?.results?.passScore ?? DEFAULT_KHAN_PASS;
  const khanFor = (studentId: string) => khan?.results?.students?.[studentId]?.[course.id];
  const [store, finalKey] = UNIT_TESTS[course.id] || ['', ''];
  const rows = (khan?.roster || []).map(st => ({ st, unit: st.progress[store]?.[finalKey], entry: khanFor(st.id) })).map(r => ({ ...r, status: khanStatus(r.unit, r.entry, passScore) }));
  const khanTopicCounts: Record<string, number> = {};
  rows.forEach(r => r.status.open.forEach(key => { khanTopicCounts[key] = (khanTopicCounts[key] || 0) + 1; }));
  const lessonTopic = topics.find(t => t.skills.includes(pick.skill));
  const topicName = (key: string) => topics.find(t => t.key === key)?.name || key;

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
      <p class="muted">${stats === undefined ? 'Loading how often each question is missed…' : stats === null ? 'Miss rates could not be loaded right now.'
        : `<b>Missed</b> counts this class's answers (${stats.students} student${stats.students === 1 ? '' : 's'} so far). A question missed ${Math.round(MISS_FLAG.rate * 100)}% of the time or more, after ${MISS_FLAG.minAnswers}+ answers, is flagged: check its wording and answer, then Edit or Hide it. Editing a question starts its count over.`}</p>
      <div class="row" style="margin-top:0"><button class="btn small primary" id="lqAdd">Add a question</button><button class="btn small" id="lqPrompt">Copy prompt</button><button class="btn small" id="lqImportOpen">Import questions</button><span class="status" id="lqMsg"></span></div>
      <div id="lqPromptBox" hidden><p class="muted">Paste this into Claude, ChatGPT or any chatbot, then bring the reply back with <b>Import questions</b>. If copying is blocked, select the text below and copy it.</p><textarea id="lqPromptText" readonly style="width:100%; min-height:140px; font-family:inherit; font-size:.85rem"></textarea></div>
      <div id="lqImport" class="card" style="margin:8px 0" hidden><h3 style="margin-top:0">Import questions</h3>
        <p class="muted" style="margin-top:0">Paste the chatbot's reply, or choose a CSV file (<a href="#" id="lqTemplate">download the CSV template</a>). Up to ${IMPORT_LIMIT} at a time. Each question comes in as a <b>draft</b>: students don't see it until you approve it.</p>
        <textarea id="lqImportText" style="width:100%; min-height:120px; font-family:inherit; font-size:.85rem" placeholder='[{"question": "…", "correct": "…", "wrong": ["…", "…", "…"], "level": 2}]'></textarea>
        <div class="row"><input type="file" id="lqImportFile" accept=".csv,.json,.txt,text/csv,application/json,text/plain"><button class="btn primary" id="lqImportGo">Import as drafts</button><button class="btn" id="lqImportCancel">Cancel</button></div>
        <p class="status err" id="lqImportMsg"></p></div>
      ${drafts.length ? `<p><b>${drafts.length}</b> draft${drafts.length === 1 ? '' : 's'} waiting for review. Read each one, then Approve, Edit or Reject it.${cleanDrafts.length ? ` <button class="btn small" id="lqApproveClean">Approve the ${cleanDrafts.length} without warnings</button>` : ''}</p>` : ''}
      <div id="lqForm"></div>
      <table class="steptable" style="margin-top:10px"><thead><tr><th>Question</th><th>Level</th><th>Missed</th><th></th><th></th></tr></thead><tbody>
      ${all.map(q => {
        const correct = q.options[q.answer], wrong = q.options.filter((_, i) => i !== q.answer);
        const isDraft = q.status === 'draft', warns = isDraft ? warningsFor(q) : [];
        const [answered, missed] = (!isDraft && stats?.byId[statKey(q)]) || [0, 0];
        const flagged = answered >= MISS_FLAG.minAnswers && missed / answered >= MISS_FLAG.rate;
        const missCell = isDraft || !stats ? '–' : !answered ? '<span class="muted">no answers yet</span>'
          : `<span${answered < MISS_FLAG.minAnswers ? ' class="muted"' : ''}>${missed} of ${answered}${answered >= MISS_FLAG.minAnswers ? ` (${Math.round(100 * missed / answered)}%)` : ''}</span>`;
        const badge = isDraft ? 'Draft' : q.hidden ? 'Hidden' : q.source === 'edited' ? 'Edited' : q.source === 'teacher' ? 'Mine' : 'Built-in';
        const actions = isDraft
          ? `<button class="btn small primary" data-q-approve="${esc(q.id)}">Approve</button> <button class="btn small" data-q-edit="${esc(q.id)}">Edit</button> <button class="btn small" data-q-reject="${esc(q.id)}">Reject</button>`
          : q.source === 'teacher'
          ? `<button class="btn small" data-q-edit="${esc(q.id)}">Edit</button> <button class="btn small" data-q-delete="${esc(q.id)}">Delete</button>`
          : q.hidden ? `<button class="btn small" data-q-restore="${esc(q.id)}">Restore</button>`
          : `<button class="btn small" data-q-edit="${esc(q.id)}">Edit</button>${q.source === 'edited' ? ` <button class="btn small" data-q-undo="${esc(q.id)}">Undo edit</button>` : ''} <button class="btn small" data-q-hide="${esc(q.id)}">Hide</button>`;
        return `<tr${q.hidden ? ' style="opacity:.5"' : isDraft ? ' style="background:#FFFBEA"' : ''}><td>${esc(q.prompt)}<br><b>${esc(correct)}</b> · <span class="muted">${wrong.map(esc).join(' · ')}</span>${warns.map(w => `<br><span class="tag a">⚠ ${esc(w)}</span>`).join('')}${flagged && !q.hidden ? '<br><span class="tag a">⚠ Often missed: check the wording and the answer</span>' : ''}</td><td>${q.difficulty || '–'}</td><td style="white-space:nowrap">${missCell}</td><td style="white-space:nowrap"><span class="tag ${q.source === 'built-in' && !q.hidden && !isDraft ? 'i' : 'a'}">${badge}</span></td><td style="text-align:right; white-space:nowrap">${actions}</td></tr><tr data-q-form-row="${esc(q.id)}" hidden><td colspan="5"></td></tr>`;
      }).join('')}
      </tbody></table>
    </div>
    ${khanCardHTML()}`;

  function khanCardHTML() {
    const head = `<h2>Khan unit test check</h2><p class="muted" style="margin-top:0">After a student passes the Pet Town unit test for <b>${esc(course.title)}</b>, they take the matching Khan Academy unit test. Log their score and the Khan topics they missed (topic names only). <b>Khan-ready</b> means the Pet Town unit test is passed and no missed topics are still open.</p>`;
    if (khan === undefined) return `<div class="card">${head}<p class="muted">Loading students…</p></div>`;
    if (khan.results === null) return `<div class="card">${head}<p class="err">The database needs the Khan results column first. Run <code>supabase/migrations/20261010000000_khan_results.sql</code> in Supabase, then reload this page.</p></div>`;
    if (!khan.roster) return `<div class="card">${head}<p class="err">Students could not be loaded right now.</p></div>`;
    if (!khan.roster.length) return `<div class="card">${head}<p class="muted">This class has no students yet.</p></div>`;
    const counts = { ready: rows.filter(r => r.status.badge === 'ready').length, passed: rows.filter(r => r.status.badge === 'passed').length };
    const missedSummary = Object.entries(khanTopicCounts).sort((a, b) => b[1] - a[1]).map(([key, n]) => `<span class="tag a">${esc(topicName(key))} · ${n}</span>`).join(' ');
    const badgeHTML = (b: string) => b === 'passed' ? '<span class="tag i">✅ Passed Khan</span>' : b === 'ready' ? '<span class="tag i">Khan-ready</span>' : b === 'reteach' ? '<span class="tag a">Reteach first</span>' : '<span class="muted">Not yet</span>';
    return `<div class="card">${head}
      <div class="row" style="margin-top:0"><label for="khPass" style="margin:0">A Khan unit test counts as passed at</label><input type="number" id="khPass" min="50" max="100" step="5" value="${passScore}" style="width:5em"> %<button class="btn small" id="khPassSave">Save</button><span class="status" id="khMsg"></span></div>
      <p><b>${counts.ready}</b> Khan-ready · <b>${counts.passed}</b> passed Khan · ${rows.length} student${rows.length === 1 ? '' : 's'}</p>
      ${missedSummary ? `<p>Open missed topics: ${missedSummary}<br><span class="muted">Copy prompt adds a lesson's missed topic, so imported questions aim at it.</span></p>` : ''}
      <table class="steptable"><thead><tr><th>Student</th><th>Pet Town unit test</th><th>Khan unit test</th><th></th><th></th></tr></thead><tbody>
      ${rows.map(({ st, unit, entry, status }) => `<tr><td>${esc(st.name)}</td>
        <td>${status.unitPassed ? `Passed${unit?.best != null && unit?.questionCount ? ` (${unit.best} of ${unit.questionCount})` : ''}` : unit?.tries ? '<span class="muted">Not passed yet</span>' : '<span class="muted">Not taken</span>'}</td>
        <td>${entry ? `${entry.score != null ? `${entry.score}%` : 'No score'} · <span class="muted">${esc(entry.date)}</span>${status.open.map(key => `<br><span class="tag a">${esc(topicName(key))}</span> <button class="btn small" data-kh-clear="${esc(st.id)}" data-kh-topic="${esc(key)}" title="Mark as retaught">Retaught</button>`).join('')}` : '<span class="muted">Not logged</span>'}</td>
        <td style="white-space:nowrap">${badgeHTML(status.badge)}</td>
        <td style="text-align:right; white-space:nowrap"><button class="btn small" data-kh-log="${esc(st.id)}">${entry ? 'Update' : 'Log result'}</button></td></tr>
        <tr data-kh-form-row="${esc(st.id)}" hidden><td colspan="5"></td></tr>`).join('')}
      </tbody></table></div>`;
  }

  const $ = (sel: string) => pane.querySelector(sel) as HTMLElement;
  const edits = () => clone<QuestionEdits>(cls.question_edits || {});
  const lessonKey = `${course.id}:${pick.skill}`;
  async function saveEdits(next: QuestionEdits, done: string, statusSel = '#lqMsg') {
    const error = await save(cls.id, { question_edits: next });
    if (error) { $(statusSel).textContent = error; return; }
    flash = done; await reload();
  }

  $('#lqCourse').addEventListener('change', e => { pick.course = (e.target as HTMLSelectElement).value; pick.skill = ''; pick.slot = ''; renderLessons(pane, cls, others, save, reload, stats, khan); });
  $('#lqSkill').addEventListener('change', e => { pick.skill = (e.target as HTMLSelectElement).value; pick.slot = ''; renderLessons(pane, cls, others, save, reload, stats, khan); });
  pane.querySelector('#lqSlot')?.addEventListener('change', e => { pick.slot = (e.target as HTMLSelectElement).value; renderLessons(pane, cls, others, save, reload, stats, khan); });

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
    host.innerHTML = `<div class="card" style="margin:8px 0"><h3 style="margin-top:0">${existing ? (existing.status === 'draft' ? 'Edit this draft (it stays a draft until you approve it)' : existing.source === 'teacher' ? 'Edit my question' : 'Edit this question for my class') : 'Add a question'}</h3>
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
        const item: TeacherQuestion = { id: existing?.id || `t-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, prompt, options, difficulty, status: existing?.status === 'draft' ? 'draft' : 'approved' };
        const at = existing ? list.findIndex(q => q.id === existing.id) : -1;
        if (at >= 0) list[at] = item; else list.push(item);
        next.added = { ...(next.added || {}), [lessonKey]: list };
      }
      const error = await save(cls.id, { question_edits: next });
      if (error) { msg.textContent = error; return; }
      flash = existing?.status === 'draft' ? 'Draft saved. Approve it when it is ready.' : existing ? 'Question saved.' : 'Question added.'; await reload();
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

  /* ---- drafts: approve, reject ---- */
  const setStatus = (ids: string[], status: 'approved') => {
    const next = edits();
    next.added = { ...(next.added || {}), [lessonKey]: (next.added?.[lessonKey] || []).map(q => ids.includes(q.id) ? { ...q, status } : q) };
    return next;
  };
  pane.querySelectorAll<HTMLButtonElement>('[data-q-approve]').forEach(b => b.addEventListener('click', () =>
    void saveEdits(setStatus([b.dataset.qApprove!], 'approved'), 'Draft approved. Students will see it.')));
  pane.querySelector('#lqApproveClean')?.addEventListener('click', () =>
    void saveEdits(setStatus(cleanDrafts.map(q => q.id), 'approved'), `${cleanDrafts.length} draft${cleanDrafts.length === 1 ? '' : 's'} approved.`));
  pane.querySelectorAll<HTMLButtonElement>('[data-q-reject]').forEach(b => b.addEventListener('click', () => {
    const next = edits();
    next.added = { ...(next.added || {}), [lessonKey]: (next.added?.[lessonKey] || []).filter(q => q.id !== b.dataset.qReject) };
    void saveEdits(next, 'Draft rejected.');
  }));

  /* ---- Copy prompt ---- */
  $('#lqPrompt').addEventListener('click', async () => {
    const lesson = course.skills.find(s => s.id === pick.skill)?.name || pick.skill;
    const text = buildCopyPrompt({ course: course.title, lesson, khanTopic: slot?.name || lesson, khanUrl: slot ? slot.khan || khanSearchUrl(slot.name) : '',
      existing: all.filter(q => !q.hidden).map(q => ({ prompt: q.prompt, correct: q.options[q.answer] })), missedBy: lessonTopic ? (khanTopicCounts[lessonTopic.key] || 0) : 0 });
    const box = $('#lqPromptBox'), area = $('#lqPromptText') as HTMLTextAreaElement;
    area.value = text; box.hidden = false;
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { area.focus(); area.select(); }
    $('#lqMsg').className = 'status'; $('#lqMsg').textContent = copied ? 'Prompt copied. Paste it into any chatbot.' : 'Select the prompt below and copy it.';
  });

  /* ---- Import ---- */
  $('#lqImportOpen').addEventListener('click', () => { $('#lqImport').hidden = false; ($('#lqImportText') as HTMLTextAreaElement).focus(); });
  $('#lqImportCancel').addEventListener('click', () => { $('#lqImport').hidden = true; });
  $('#lqTemplate').addEventListener('click', e => {
    e.preventDefault();
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: 'text/csv' })); a.download = 'pet-town-questions-template.csv';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  $('#lqImportFile').addEventListener('change', async e => {
    const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
    if (file.size > 200000) { $('#lqImportMsg').textContent = 'That file is too big. Import up to 40 questions at a time.'; return; }
    ($('#lqImportText') as HTMLTextAreaElement).value = await file.text();
  });
  $('#lqImportGo').addEventListener('click', async () => {
    const msg = $('#lqImportMsg');
    const { items, errors } = parseImport(($('#lqImportText') as HTMLTextAreaElement).value);
    if (!items.length) { msg.textContent = errors.join(' ') || 'No questions found.'; return; }
    if (items.length > IMPORT_LIMIT) { msg.textContent = `That is ${items.length} questions. Import up to ${IMPORT_LIMIT} at a time.`; return; }
    if (drafts.length + items.length > MAX_DRAFTS) { msg.textContent = `This lesson already has ${drafts.length} drafts. Approve or reject some first (up to ${MAX_DRAFTS} waiting at once).`; return; }
    const known = new Set(all.map(q => norm(q.prompt))), skipped = [...errors], added: TeacherQuestion[] = [];
    items.forEach((q, i) => {
      const check = checkImported(q, known);
      if (check.error) { skipped.push(`Question ${i + 1} skipped: ${check.error}.`); return; }
      known.add(norm(q.prompt));
      added.push({ id: `t-${Date.now().toString(36)}${i.toString(36)}${Math.random().toString(36).slice(2, 6)}`, prompt: q.prompt.trim(), options: [q.correct, ...q.wrong.filter(w => w)].map(o => o.trim()), difficulty: q.level, status: 'draft' });
    });
    if (!added.length) { msg.textContent = skipped.join(' '); return; }
    const next = edits();
    next.added = { ...(next.added || {}), [lessonKey]: [...(next.added?.[lessonKey] || []), ...added] };
    const error = await save(cls.id, { question_edits: next });
    if (error) { msg.textContent = error; return; }
    flash = `${added.length} question${added.length === 1 ? '' : 's'} imported as drafts.${skipped.length ? ` ${skipped.join(' ')}` : ''}`; await reload();
  });

  /* ---- Khan unit test results ---- */
  if (khan?.results && khan.roster) {
    const results = khan.results;
    const saveKhan = async (next: KhanResults, done: string, msgEl: HTMLElement) => {
      const error = await khan.save(next);
      if (error) { msgEl.textContent = error; msgEl.className = 'status err'; return; }
      flash = done; await reload();
    };
    const withEntry = (studentId: string, entry: KhanEntry | null): KhanResults => {
      const next = clone<KhanResults>(results), students = next.students || (next.students = {});
      const mine = students[studentId] || (students[studentId] = {});
      if (entry) mine[course.id] = entry; else delete mine[course.id];
      if (!Object.keys(mine).length) delete students[studentId];
      return next;
    };
    pane.querySelector('#khPassSave')?.addEventListener('click', () => {
      const value = Math.round(+($('#khPass') as HTMLInputElement).value);
      if (!(value >= 50 && value <= 100)) { $('#khMsg').textContent = 'Pick a score from 50 to 100.'; $('#khMsg').className = 'status err'; return; }
      void saveKhan({ ...clone<KhanResults>(results), passScore: value }, `A Khan unit test now counts as passed at ${value}%.`, $('#khMsg'));
    });
    pane.querySelectorAll<HTMLButtonElement>('[data-kh-clear]').forEach(b => b.addEventListener('click', () => {
      const entry = clone<KhanEntry>(khanFor(b.dataset.khClear!) as KhanEntry); if (!entry.missed) return;
      entry.cleared = [...new Set([...(entry.cleared || []), b.dataset.khTopic!])];
      void saveKhan(withEntry(b.dataset.khClear!, entry), `${topicName(b.dataset.khTopic!)} marked as retaught.`, $('#khMsg'));
    }));
    pane.querySelectorAll<HTMLButtonElement>('[data-kh-log]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.khLog!, st = khan.roster!.find(x => x.id === id); if (!st) return;
      pane.querySelectorAll<HTMLElement>('[data-kh-form-row]').forEach(row => { row.hidden = true; (row.firstElementChild as HTMLElement).innerHTML = ''; });
      const row = pane.querySelector(`[data-kh-form-row="${CSS.escape(id)}"]`) as HTMLElement, host = row.firstElementChild as HTMLElement, entry = khanFor(id);
      host.innerHTML = `<div class="card" style="margin:8px 0"><h3 style="margin-top:0">Khan unit test: ${esc(st.name)}</h3>
        <div class="two"><div><label for="khDate">Date taken</label><input type="date" id="khDate" value="${esc(entry?.date || todayKey())}"></div>
        <div><label for="khScore">Score (%)</label><input type="number" id="khScore" min="0" max="100" value="${entry?.score ?? ''}" placeholder="e.g. 85"></div></div>
        <p style="margin-bottom:4px"><b>Khan topics missed</b> <span class="muted">(tick each topic with a missed question)</span></p>
        ${topics.map(t => `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" data-kh-topic-pick="${esc(t.key)}" ${entry && openTopics(entry).includes(t.key) ? 'checked' : ''}> ${esc(t.name)}</label>`).join('')}
        <div class="row"><button class="btn primary" id="khSave">Save result</button><button class="btn" id="khCancel">Cancel</button>${entry ? '<button class="btn" id="khRemove">Remove result</button>' : ''}<span class="status err" id="khFormMsg"></span></div></div>`;
      row.hidden = false;
      host.querySelector('#khCancel')!.addEventListener('click', () => { host.innerHTML = ''; row.hidden = true; });
      host.querySelector('#khRemove')?.addEventListener('click', () => void saveKhan(withEntry(id, null), `Khan result removed for ${st.name}.`, host.querySelector('#khFormMsg') as HTMLElement));
      host.querySelector('#khSave')!.addEventListener('click', () => {
        const msg = host.querySelector('#khFormMsg') as HTMLElement;
        const date = (host.querySelector('#khDate') as HTMLInputElement).value, scoreText = (host.querySelector('#khScore') as HTMLInputElement).value.trim();
        const score = scoreText === '' ? null : Math.round(+scoreText);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { msg.textContent = 'Pick the date the test was taken.'; return; }
        if (score !== null && !(score >= 0 && score <= 100)) { msg.textContent = 'The score is a percent from 0 to 100.'; return; }
        const missed = [...host.querySelectorAll<HTMLInputElement>('[data-kh-topic-pick]')].filter(x => x.checked).map(x => x.dataset.khTopicPick!);
        if (score === null && !missed.length) { msg.textContent = 'Enter the score, the missed topics, or both.'; return; }
        void saveKhan(withEntry(id, { date, score, missed }), `Khan result saved for ${st.name}.`, msg);
      });
    }));
  }

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
