/* Pet Town question types beyond plain multiple choice (docs: QUESTION-TYPES.md).
   No DOM here: the game draws the questions, this file checks answers, describes them, and gives them stable ids.

   Scored by Pet Town, mixed into practice, block quizzes and unit tests like any other question:
     multi  Select all that apply     {type:'multi', prompt, options:[…], answers:[i, …]}
     two    Part A, then Part B       {type:'two', prompt, options:[…], answer:i, partB:{prompt, options:[…], answer:i}}
     order  Put in order              {type:'order', prompt, items:[first, …, last]}           (shown shuffled)
     fill   Type the answer           {type:'fill', prompt, accept:['best answer', 'also right', …]}
     sort   Sort into groups          {type:'sort', prompt, groups:['A', 'B'], items:[[text, groupIndex], …]}
     pick   Tap the words             {type:'pick', prompt, sentence:'…', answers:[wordIndex, …]}
   Read by a grown-up (the teacher in the dashboard, or a parent at home behind the grown-up PIN):
     short  Short answer (1–3 sentences)   {type:'short', prompt, rubric:['…', …], model:'…', minWords}
     essay  Paragraph                      {type:'essay', prompt, rubric:['…', …], model:'…', minWords}
   Every question can also have difficulty (1–3). A question with no type is plain multiple choice. */
import { questionId } from './questionIds';

export const AUTO_TYPES = ['multi', 'two', 'order', 'fill', 'sort', 'pick'];
export const WRITTEN_TYPES = ['short', 'essay'];
export const TYPE_LABELS = { mc: 'Multiple choice', multi: 'Select all', two: 'Two-part', order: 'Put in order', fill: 'Type the answer', sort: 'Sort', pick: 'Tap the words', short: 'Short answer', essay: 'Paragraph' };
export const typeOf = question => (question && WRITTEN_TYPES.concat(AUTO_TYPES).includes(question.type) ? question.type : 'mc');
export const isWritten = question => WRITTEN_TYPES.includes(typeOf(question));

/* Typed answers: case, extra spaces (also around a fraction bar: 8 / 3), curly quotes and a final period don't matter. */
export const normalizeTyped = text => String(text ?? '').normalize('NFKC').toLowerCase()
  .replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').replace(/\s*\/\s*/g, '/').trim().replace(/[.!?]+$/, '').trim();
export const pickWords = sentence => String(sentence ?? '').split(/\s+/).filter(Boolean);
/* a word without the punctuation around it: "ball." -> "ball" */
export const bareWord = word => String(word).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
export const wordCount = text => (String(text ?? '').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const sameSet = (a, b) => Array.isArray(a) && a.length === b.length && [...a].sort((x, y) => x - y).join() === [...b].sort((x, y) => x - y).join();

/* The "correct answer" text that goes into the question's id. Plain multiple choice keeps options[answer],
   so the ids of every existing question stay the same. */
export function answerKey(question){
  switch (typeOf(question)) {
    case 'multi': return question.answers.map(i => question.options[i]).join(' | ');
    case 'two': return `${question.options[question.answer]} | ${question.partB.options[question.partB.answer]}`;
    case 'order': return question.items.join(' > ');
    case 'fill': return question.accept[0];
    case 'sort': return question.items.map(([text, group]) => `${text}=${question.groups[group]}`).join(' | ');
    case 'pick': return question.answers.map(i => bareWord(pickWords(question.sentence)[i])).join(' | ');
    case 'short': case 'essay': return typeOf(question);
    default: return question.options[question.answer];
  }
}
export const typedQuestionId = (courseId, skillId, question) => questionId(courseId, skillId, question.prompt, answerKey(question));

/* The right answer in words, for feedback and the teacher's list. */
export function answerText(question){
  switch (typeOf(question)) {
    case 'multi': return question.answers.map(i => question.options[i]).join(', ');
    case 'two': return `Part A: ${question.options[question.answer]} · Part B: ${question.partB.options[question.partB.answer]}`;
    case 'order': return question.items.join(' → ');
    case 'fill': return question.accept[0];
    case 'sort': return question.groups.map((group, g) => `${group}: ${question.items.filter(item => item[1] === g).map(item => item[0]).join(', ')}`).join(' · ');
    case 'pick': return question.answers.map(i => bareWord(pickWords(question.sentence)[i])).join(', ');
    case 'short': case 'essay': return question.model || '';
    default: return question.options[question.answer];
  }
}

/* What the student answered, in words. Answer shapes: multi and pick [indexes]; two [a, b]; order [item indexes in the
   student's order]; fill text; sort [group for each item]; mc an index. */
export function responseText(question, response){
  const list = Array.isArray(response) ? response : [];
  switch (typeOf(question)) {
    case 'multi': return list.map(i => question.options[i]).filter(Boolean).join(', ') || '(nothing picked)';
    case 'two': return `Part A: ${question.options[list[0]] ?? '–'} · Part B: ${question.partB.options[list[1]] ?? '–'}`;
    case 'order': return list.map(i => question.items[i]).join(' → ');
    case 'fill': return String(response ?? '').trim() || '(blank)';
    case 'sort': return question.groups.map((group, g) => `${group}: ${question.items.filter((_, i) => list[i] === g).map(item => item[0]).join(', ') || '–'}`).join(' · ');
    case 'pick': return list.map(i => bareWord(pickWords(question.sentence)[i])).join(', ') || '(nothing tapped)';
    case 'short': case 'essay': return String(response ?? '');
    default: return question.options[response] ?? '';
  }
}

/* Is the answer finished enough to check? (The Check button waits for this.) */
export function responseReady(question, response){
  const list = Array.isArray(response) ? response : [];
  switch (typeOf(question)) {
    case 'multi': case 'pick': return list.length > 0;
    case 'two': return Number.isInteger(list[0]) && Number.isInteger(list[1]);
    case 'order': return list.length === question.items.length;
    case 'fill': return normalizeTyped(response).length > 0;
    case 'sort': return question.items.every((_, i) => Number.isInteger(list[i]));
    case 'short': case 'essay': return wordCount(response) >= (question.minWords || 1);
    default: return Number.isInteger(response);
  }
}

/* Scored types only; a written answer is never "right" until a grown-up reads it. */
export function checkTyped(question, response){
  switch (typeOf(question)) {
    case 'multi': case 'pick': return sameSet(response, question.answers);
    case 'two': return Array.isArray(response) && response[0] === question.answer && response[1] === question.partB.answer;
    case 'order': return Array.isArray(response) && response.length === question.items.length && response.every((item, i) => item === i);
    case 'fill': return question.accept.some(ok => normalizeTyped(ok) === normalizeTyped(response));
    case 'sort': return Array.isArray(response) && question.items.every((item, i) => response[i] === item[1]);
    case 'short': case 'essay': return false;
    default: return response === question.answer;
  }
}

/* A shuffled copy for one student: choices move, the answer key moves with them. Order and sort are drawn
   in a random order by the game (the key stays in the question). */
export function shuffledCopy(question, shuffle){
  const type = typeOf(question);
  const remap = (options, answers) => { const order = shuffle(options.map((_, i) => i)); return { options: order.map(i => options[i]), map: i => order.indexOf(i) }; };
  if (type === 'multi') { const { options, map } = remap(question.options); return { ...question, options, answers: question.answers.map(map) }; }
  if (type === 'two') {
    const a = remap(question.options), b = remap(question.partB.options);
    return { ...question, options: a.options, answer: a.map(question.answer), partB: { ...question.partB, options: b.options, answer: b.map(question.partB.answer) } };
  }
  if (type === 'sort') return { ...question, items: shuffle(question.items) };
  if (type === 'mc') { const correct = question.options[question.answer], options = shuffle(question.options); return { ...question, options, answer: options.indexOf(correct) }; }
  return { ...question };
}

/* Checks one bank entry; returns a list of problems (empty when it's fine). Used by scripts/verify.mjs and the tests. */
export function typedProblems(question){
  const p = [], type = typeOf(question), text = s => typeof s === 'string' && s.trim().length > 0;
  if (!text(question?.prompt)) return ['missing prompt'];
  if (question.difficulty != null && ![1, 2, 3].includes(question.difficulty)) p.push('difficulty must be 1, 2 or 3');
  const choices = (options, count) => { if (!Array.isArray(options) || options.length < count || !options.every(text)) p.push(`needs at least ${count} choices`); else if (new Set(options.map(normalizeTyped)).size !== options.length) p.push('two choices are the same'); };
  const index = (i, options) => Number.isInteger(i) && i >= 0 && i < (options?.length || 0);
  if (type === 'mc') { choices(question.options, 2); if (!index(question.answer, question.options)) p.push('answer is not a choice'); }
  if (type === 'multi') { choices(question.options, 4); if (!Array.isArray(question.answers) || question.answers.length < 2 || question.answers.length >= (question.options?.length || 0) || !question.answers.every(i => index(i, question.options)) || new Set(question.answers).size !== question.answers.length) p.push('select-all needs at least 2 right answers and at least 1 wrong one'); }
  if (type === 'two') { choices(question.options, 3); if (!index(question.answer, question.options)) p.push('Part A answer is not a choice'); if (!text(question.partB?.prompt)) p.push('Part B needs a prompt'); else { choices(question.partB.options, 3); if (!index(question.partB.answer, question.partB.options)) p.push('Part B answer is not a choice'); } }
  if (type === 'order') { if (!Array.isArray(question.items) || question.items.length < 3 || question.items.length > 6 || !question.items.every(text)) p.push('order needs 3 to 6 items'); else if (new Set(question.items.map(normalizeTyped)).size !== question.items.length) p.push('two items are the same'); }
  if (type === 'fill') { if (!Array.isArray(question.accept) || !question.accept.length || !question.accept.every(text)) p.push('fill needs at least one accepted answer'); }
  if (type === 'sort') {
    if (!Array.isArray(question.groups) || question.groups.length < 2 || question.groups.length > 3 || !question.groups.every(text)) p.push('sort needs 2 or 3 groups');
    else if (!Array.isArray(question.items) || question.items.length < 4 || question.items.length > 8 || !question.items.every(item => Array.isArray(item) && text(item[0]) && index(item[1], question.groups))) p.push('sort needs 4 to 8 items, each with a group');
    else if (!question.groups.every((_, g) => question.items.some(item => item[1] === g))) p.push('every group needs at least one item');
  }
  if (type === 'pick') {
    const words = pickWords(question.sentence);
    if (words.length < 3) p.push('pick needs a sentence');
    else if (!Array.isArray(question.answers) || !question.answers.length || question.answers.length >= words.length || !question.answers.every(i => index(i, words) && bareWord(words[i]))) p.push('pick answers must be word positions in the sentence');
  }
  if (type === 'short' || type === 'essay') {
    if (!Array.isArray(question.rubric) || question.rubric.length < 2 || question.rubric.length > 4 || !question.rubric.every(text)) p.push('written questions need 2 to 4 rubric points');
    if (!text(question.model)) p.push('written questions need a model answer for the grown-up');
    if (!Number.isInteger(question.minWords) || question.minWords < 1) p.push('written questions need minWords');
  }
  return p;
}

/* One lesson's typed questions with ids, minus the ones this class hid (question_edits.hidden), plus the teacher's own
   (question_edits.addedTyped["<course>:<lesson>"] = [{id, status:'draft'|'approved', q:{…a question in the shapes above}}]).
   Students only get approved ones; the teacher app passes includeHidden and includeDrafts. */
export function typedQuestions(courseId, skillId, list, edits, { includeHidden = false, includeDrafts = false } = {}){
  const hidden = new Set(Array.isArray(edits?.hidden) ? edits.hidden : []);
  const builtIn = (list || []).filter(question => !typedProblems(question).length).map(question => {
    const id = typedQuestionId(courseId, skillId, question);
    return { ...question, id, source: 'built-in', hidden: hidden.has(id), skillId };
  }).filter(question => includeHidden || !question.hidden);
  const mine = edits?.addedTyped && typeof edits.addedTyped === 'object' ? edits.addedTyped[`${courseId}:${skillId}`] : null;
  const teacher = (Array.isArray(mine) ? mine : []).filter(entry => entry && typeof entry.id === 'string' && entry.q && typeof entry.q === 'object' && !typedProblems(entry.q).length
    && typeOf(entry.q) !== 'mc' && typeOf(entry.q) !== 'essay' && (entry.status === 'approved' || includeDrafts))
    .map(entry => ({ ...entry.q, id: entry.id, source: 'teacher', status: entry.status, hidden: false, skillId }));
  return [...builtIn, ...teacher];
}

/* ---------- teacher Copy prompt and Import for these types (docs: QUESTION-TYPES.md) ---------- */
export const TYPED_IMPORT_LIMIT = 12;
/** @param {{course: string, lesson: string, existing?: string[], count?: number}} info */
export function buildTypedPrompt({ course, lesson, existing = [], count = 6 }){
  return [
    `Write ${count} new questions for 4th to 6th grade students, using the question types below. Mix the types, and make one of them a short answer.`,
    '', `Course: ${course}`, `Lesson: ${lesson}`, '',
    'Rules:',
    '- Every question tests this lesson. Give each a level: 1 (easier), 2 (medium) or 3 (harder). About 2 in 5 should be level 3.',
    '- Wrong choices must be believable to a student who has not mastered the lesson, never silly. The right choice is not always the longest.',
    '- Write for a 6th grade reader: prompts under 40 words, choices under 120 characters. Use curly apostrophes (’).',
    '- Do not repeat or reword the existing questions listed below.',
    '- Before you reply, answer every question yourself and fix any with a wrong key or two right answers.',
    '',
    'Question types (exact JSON shapes; "answers" and "answer" count from 0):',
    '  Select all that apply: {"type": "multi", "prompt": "…", "options": ["…", "…", "…", "…"], "answers": [0, 2], "level": 2}   (4 to 6 options, at least 2 right, at least 1 wrong)',
    '  Two-part (claim, then evidence): {"type": "two", "prompt": "…", "options": ["…", "…", "…"], "answer": 1, "partB": {"prompt": "Which evidence supports your answer?", "options": ["…", "…", "…"], "answer": 0}, "level": 3}',
    '  Put in order: {"type": "order", "prompt": "Put these in order, first to last.", "items": ["first", "second", "third", "fourth"], "level": 2}   (3 to 6 items, listed in the right order)',
    '  Type the answer: {"type": "fill", "prompt": "…", "accept": ["best answer", "another accepted spelling"], "level": 1}   (one or two words)',
    '  Sort into groups: {"type": "sort", "prompt": "…", "groups": ["Group A", "Group B"], "items": [["item", 0], ["item", 1], ["item", 0], ["item", 1]], "level": 2}   (2 or 3 groups, 4 to 8 items)',
    '  Tap the words: {"type": "pick", "prompt": "Tap every noun.", "sentence": "The dog chased a ball.", "answers": [1, 4], "level": 1}   (answers are word positions; punctuation stays on its word)',
    '  Short answer, read by a grown-up: {"type": "short", "prompt": "…", "rubric": ["point a strong answer makes", "another point"], "model": "a model answer", "minWords": 15}',
    '',
    `Existing questions (${existing.length}):`, ...existing.map((q, i) => `${i + 1}. ${q}`), '',
    'Reply with only a JSON array of the questions, and no other text.'
  ].join('\n');
}
/* A pasted chatbot reply: a JSON array (extra text or a code fence around it is fine). Returns the questions that pass
   typedProblems and why any were skipped. "level" becomes difficulty. Multiple choice and paragraphs aren't imported here. */
export function parseTypedImport(text){
  const raw = String(text || ''), start = raw.indexOf('['), end = raw.lastIndexOf(']'), items = [], errors = [];
  if (start < 0 || end <= start) return { items, errors: ['No JSON list found. Paste the chatbot’s reply, starting with ['] };
  let list; try { list = JSON.parse(raw.slice(start, end + 1)); } catch { return { items, errors: ['That reply couldn’t be read as JSON. Ask the chatbot to reply with only the JSON array.'] }; }
  if (!Array.isArray(list)) return { items, errors: ['Expected a list of questions.'] };
  list.forEach((item, i) => {
    if (!item || typeof item !== 'object') { errors.push(`Question ${i + 1} skipped: not a question.`); return; }
    const { level, ...rest } = item, q = { ...rest, ...(level != null && rest.difficulty == null ? { difficulty: Number(level) } : {}) };
    const type = typeOf(q);
    if (type === 'mc' || type === 'essay') { errors.push(`Question ${i + 1} skipped: use the multiple-choice Import for multiple choice; paragraphs are built in.`); return; }
    if (String(q.prompt || '').length > 400) { errors.push(`Question ${i + 1} skipped: the prompt is too long.`); return; }
    const problems = typedProblems(q);
    if (problems.length) { errors.push(`Question ${i + 1} skipped: ${problems.join(', ')}.`); return; }
    items.push(q);
  });
  return { items, errors };
}

/* ---------- written answers and their review ----------
   The student's save keeps writtenAnswers: [{id, qid, courseId, skillId, type, prompt, rubric, model, text, at, where, parentReview?}].
   A parent's review is saved with the answer: {points:[0|1, …], comment, redo, at}.
   A teacher's review is saved in the student's quiz_overrides as written:<id> = "scored:<at>:<points like 101>:<redo 0|1>:<comment>".
   The teacher's review wins when both exist. */
export const WRITTEN_MAX = 120;
export function encodeTeacherReview(at, points, redo, comment){
  return `scored:${at}:${points.map(p => (p ? 1 : 0)).join('')}:${redo ? 1 : 0}:${String(comment || '').replace(/\s+/g, ' ').trim().slice(0, 500)}`;
}
export function decodeTeacherReview(value, at){
  const parts = String(value || '').split(':');
  if (parts[0] !== 'scored' || +parts[1] !== at || !/^[01]{1,4}$/.test(parts[2] || '')) return null;
  return { points: [...parts[2]].map(Number), redo: parts[3] === '1', comment: parts.slice(4).join(':'), by: 'teacher' };
}
export function writtenReview(entry, overrides){
  const teacher = decodeTeacherReview(overrides?.[`written:${entry.id}`], entry.at);
  if (teacher) return teacher;
  const parent = entry.parentReview;
  return parent && Array.isArray(parent.points) ? { points: parent.points.map(p => (p ? 1 : 0)), redo: !!parent.redo, comment: String(parent.comment || ''), by: 'parent' } : null;
}
export const reviewScore = review => (review ? review.points.reduce((sum, p) => sum + p, 0) : 0);
export function normalizeWrittenAnswers(list){
  const text = (s, max) => (typeof s === 'string' ? s.slice(0, max) : '');
  return (Array.isArray(list) ? list : []).filter(entry => entry && typeof entry === 'object' && typeof entry.id === 'string' && entry.id.length <= 40 && Number.isFinite(+entry.at)).map(entry => ({
    id: entry.id, qid: text(entry.qid, 80), courseId: text(entry.courseId, 20), skillId: text(entry.skillId, 40), type: entry.type === 'essay' ? 'essay' : 'short',
    prompt: text(entry.prompt, 600), rubric: (Array.isArray(entry.rubric) ? entry.rubric : []).slice(0, 4).map(r => text(r, 200)), model: text(entry.model, 1200),
    text: text(entry.text, 4000), at: +entry.at, where: entry.where === 'test' ? 'test' : 'practice',
    ...(entry.parentReview && Array.isArray(entry.parentReview.points) ? { parentReview: { points: entry.parentReview.points.slice(0, 4).map(p => (p ? 1 : 0)), comment: text(entry.parentReview.comment, 500), redo: !!entry.parentReview.redo, at: +entry.parentReview.at || 0 } } : {})
  })).slice(-WRITTEN_MAX);
}
