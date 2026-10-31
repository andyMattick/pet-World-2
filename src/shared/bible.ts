/* ✝️ Bible (docs/BIBLE.md): the books of the Bible by testament and section, the verse-of-the-week settings a grown-up
   saves for one student (quiz_overrides "bible"), and how many blanks each day of the verse week gets.
   Shared by the game (src/game/game.js) and the teacher app (src/teacher/bible.ts). */

export type Testament = 'OT' | 'NT';
export interface BibleSection { id: string; t: Testament; name: string; emoji: string }
export interface BibleBook { name: string; t: Testament; s: string }

export const TESTAMENTS: Record<Testament, string> = { OT: 'Old Testament', NT: 'New Testament' };

export const BIBLE_SECTIONS: BibleSection[] = [
  { id: 'law', t: 'OT', name: 'The Law', emoji: '📜' },
  { id: 'otHistory', t: 'OT', name: 'History (Old Testament)', emoji: '🏰' },
  { id: 'poetry', t: 'OT', name: 'Poetry and Wisdom', emoji: '🎵' },
  { id: 'major', t: 'OT', name: 'Major Prophets', emoji: '📣' },
  { id: 'minor', t: 'OT', name: 'Minor Prophets', emoji: '🗣️' },
  { id: 'gospels', t: 'NT', name: 'The Gospels', emoji: '✝️' },
  { id: 'ntHistory', t: 'NT', name: 'History (New Testament)', emoji: '🔥' },
  { id: 'paul', t: 'NT', name: 'Letters of Paul', emoji: '✉️' },
  { id: 'general', t: 'NT', name: 'General Letters', emoji: '📨' },
  { id: 'prophecy', t: 'NT', name: 'Prophecy', emoji: '👑' }
];

const LIST: [Testament, string, string[]][] = [
  ['OT', 'law', ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy']],
  ['OT', 'otHistory', ['Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther']],
  ['OT', 'poetry', ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon']],
  ['OT', 'major', ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel']],
  ['OT', 'minor', ['Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi']],
  ['NT', 'gospels', ['Matthew', 'Mark', 'Luke', 'John']],
  ['NT', 'ntHistory', ['Acts']],
  ['NT', 'paul', ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon']],
  ['NT', 'general', ['Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude']],
  ['NT', 'prophecy', ['Revelation']]
];
/** All 66 books, in Bible order. */
export const BIBLE_BOOKS: BibleBook[] = LIST.flatMap(([t, s, names]) => names.map(name => ({ name, t, s })));
export const booksIn = (sectionId: string) => BIBLE_BOOKS.filter(b => b.s === sectionId);
export const sectionOf = (id: string) => BIBLE_SECTIONS.find(s => s.id === id) || null;
/** Sections with enough books to list from memory or put in order (levels 3 and 4). */
export const RECALL_SECTIONS = BIBLE_SECTIONS.filter(s => booksIn(s.id).length >= 4).map(s => s.id);

/* the four levels of the books game */
export const BOOK_LEVELS: { n: number; name: string; what: string }[] = [
  { n: 1, name: 'Old or New?', what: 'Sort books into the Old Testament or the New Testament.' },
  { n: 2, name: 'Which section?', what: 'Sort books into their sections: the Law, History, Poetry, the Prophets, the Gospels, the Letters…' },
  { n: 3, name: 'Name them all', what: 'Type every book in a section from memory, in any order.' },
  { n: 4, name: 'In order', what: 'Put the books of a section in Bible order.' },
  { n: 5, name: 'Neighbors', what: 'You get a book: type the 2 books before it and the 2 books after it.' }
];
/** Level 5: books per round, and perfect rounds in a row that count as mastered. */
export const NEIGHBOR_ROUND = 5;
/** The books just before and after one book, in Bible order (fewer at the very start and end). */
export function neighborsOf(name: string, reach = 2): { before: string[]; after: string[] } {
  const i = BIBLE_BOOKS.findIndex(b => b.name === name);
  if (i < 0) return { before: [], after: [] };
  return { before: BIBLE_BOOKS.slice(Math.max(0, i - reach), i).map(b => b.name), after: BIBLE_BOOKS.slice(i + 1, i + 1 + reach).map(b => b.name) };
}
/** Perfect sorting rounds in a row that move her up from level 1 or 2. */
export const SORT_STREAK = 2;

/* Typing a book name (levels 3 and 5, like the 48 prepositions game: type it, and it fills in when it's right).
   "1st Kings", "First Kings", "I Kings", "1Kings" and "1 kings" are all 1 Kings; "Psalm", "Revelations" and "Song of
   Songs" count too. Returns the book's real name, or '' when it isn't a book. */
const ALIASES: Record<string, string> = { psalm: 'Psalms', revelations: 'Revelation', songofsongs: 'Song of Solomon', songofsong: 'Song of Solomon', canticles: 'Song of Solomon', qoheleth: 'Ecclesiastes', acts: 'Acts', actsoftheapostles: 'Acts', theactsoftheapostles: 'Acts' };
const squash = (s: string) => s.toLowerCase().trim().replace(/^the\s+/, '').replace(/^book\s+of\s+(the\s+)?/, '').replace(/[^a-z0-9]/g, '');
function typedKey(raw: string): string {
  let s = String(raw || '').trim().toLowerCase().replace(/[’'.]/g, '');
  s = s.replace(/^(first|1st|i)\s+/, '1 ').replace(/^(second|2nd|ii)\s+/, '2 ').replace(/^(third|3rd|iii)\s+/, '3 ');
  return squash(s);
}
const BOOK_KEYS = [...BIBLE_BOOKS.map(b => squash(b.name)), ...Object.keys(ALIASES)];
export function bookFromTyped(raw: string): string {
  const key = typedKey(raw);
  if (!key) return '';
  if (ALIASES[key]) return ALIASES[key];
  return BIBLE_BOOKS.find(b => squash(b.name) === key)?.name || '';
}
/** True when what's typed so far is a book but could still be the start of a longer name ("Psalm" → "Psalms",
    "Acts" → "Acts of the Apostles"), so the game waits a moment before filling it in. */
export function typedMayContinue(raw: string): boolean {
  const key = typedKey(raw);
  return !!key && BOOK_KEYS.some(k => k.length > key.length && k.startsWith(key));
}

/* ---------- memory verses (a grown-up types them in the teacher app, in order) ----------
   She works on one verse at a time: the first one in the list she hasn't learned yet. Each day she practices it 5 times in
   the Verse Memorizer (fill in the blanks, then Check). The blanks start at 10% of the words. When her last 5 tries at a
   step average 90% or better, the next day goes up a step: 10% → 20% → 35% → 50% → 70% → the whole verse. Writing the
   whole verse with a 90% average over 5 tries means she's learned it, and the next verse in the list starts the next day.
   There's no deadline: a verse carries on into the next week. When she's learned every verse, the grown-up gets an alert
   to add the next one. */
export interface MemoryVerse { id: string; ref: string; version: string; text: string }
export interface BibleSettings { on: boolean; verses: MemoryVerse[]; removed?: string[] }
export interface VerseTry { t: number; day: string; step: number; pct: number }
export interface VerseProgress { step: number; up: string; tries: VerseTry[]; learned: string; aside?: string; kept?: string; days?: string[]; seen?: { round: number; day: string } }
export const VERSE_STEPS = [0.1, 0.2, 0.35, 0.5, 0.7, 1];
export const FULL_STEP = VERSE_STEPS.length - 1;
export const VERSE_TRIES_A_DAY = 5;
export const VERSE_MOVE_UP = 90;   // average percent over the last 5 tries at a step
export function parseBibleSettings(raw: unknown): BibleSettings {
  let v: unknown = raw;
  try { if (typeof raw === 'string') v = JSON.parse(raw); } catch { v = null; }
  const o = v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
  const list = (Array.isArray(o.verses) ? o.verses : []).filter(x => x && typeof x === 'object' && String((x as MemoryVerse).text || '').trim()) as (MemoryVerse & { week?: string })[];
  if (list.some(x => x.week) && !list.some(x => x.id)) list.sort((a, b) => String(a.week) < String(b.week) ? -1 : 1);   // the first version kept verses by week
  const verses = list.map((x, i) => ({ id: String(x.id || x.week || `v${i}`).slice(0, 40), ref: String(x.ref || '').slice(0, 80), version: String(x.version || '').slice(0, 40), text: String(x.text).slice(0, 2000) }));
  const removed = (Array.isArray(o.removed) ? o.removed : []).map(x => String(x).slice(0, 40)).filter(Boolean).slice(-200);
  return { on: o.on === true, verses, ...(removed.length ? { removed } : {}) };
}
export function normalizeVerseProgress(raw: unknown): VerseProgress {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Partial<VerseProgress>;
  return {
    step: Math.max(0, Math.min(FULL_STEP, Math.round(+(o.step || 0)) || 0)), up: typeof o.up === 'string' ? o.up.slice(0, 10) : '', learned: typeof o.learned === 'string' ? o.learned.slice(0, 10) : '',
    ...(typeof o.aside === 'string' && o.aside ? { aside: o.aside.slice(0, 10) } : {}),
    ...(typeof o.kept === 'string' && o.kept ? { kept: o.kept.slice(0, 10) } : {}),
    /* days: every day she practiced this verse, kept apart from the 60-try cap so the 5-day rounds never shift.
       seen: the last round whose recap she was shown, and the day (the recap stays up for the rest of that day) */
    ...(Array.isArray(o.days) ? { days: [...new Set(o.days.map(d => String(d).slice(0, 10)).filter(d => /^\d{4}-\d\d-\d\d$/.test(d)))].sort().slice(-400) } : {}),
    ...(o.seen && typeof o.seen === 'object' && Number.isFinite(+o.seen.round) ? { seen: { round: Math.max(0, Math.round(+o.seen.round)), day: String(o.seen.day || '').slice(0, 10) } } : {}),
    tries: (Array.isArray(o.tries) ? o.tries : []).filter(t => t && Number.isFinite(+t.t)).slice(-60).map(t => ({ t: +t.t, day: String(t.day || '').slice(0, 10), step: Math.max(0, Math.min(FULL_STEP, Math.round(+t.step) || 0)), pct: Math.max(0, Math.min(100, Math.round(+t.pct) || 0)) }))
  };
}
/** The step to practice on this day: a move up earned on an earlier day applies from the next day on. */
export const stepOn = (p: VerseProgress, day: string) => (p.up && p.up < day ? Math.min(FULL_STEP, p.step + 1) : p.step);
/** The average percent of the last 5 tries at a step (null with fewer than 5). */
export function lastFiveAverage(p: VerseProgress, step: number): number | null {
  const last = p.tries.filter(t => t.step === step).slice(-VERSE_TRIES_A_DAY);
  return last.length < VERSE_TRIES_A_DAY ? null : Math.round(last.reduce((a, t) => a + t.pct, 0) / last.length);
}
/** The verse she's learning: the first one in the list not learned yet (null when there are none, or all are learned). */
export function currentVerse(s: BibleSettings, progress: Record<string, unknown> | undefined): MemoryVerse | null {
  return s.verses.find(v => { const p = normalizeVerseProgress(progress?.[v.id]); return !p.learned && !p.aside; }) || null;
}

/* ---------- the 5-day verse cycle (owner, Oct 31, 2026; docs/BIBLE.md "5 practice days") ----------
   Like the Word Workshop's word sets, a verse is looked at every 5 days she practiced it (days with a try; missed days
   don't count). On the 5th day, after that day's 5 tries, she sees a recap: the step she reached, her tries and last-5
   average, and whether she learned it, with a grown-up link (behind the PIN) to write the next verse. If she hasn't learned
   it, the grown-up can keep it another 5 days (nothing changes: it carries on, as always) or write a new one (the old one
   is set aside: `aside`, and kept with its tries). A grown-up's verse is saved in her save (S.bible.added: {id, ref,
   version, text, after, at}) and joins her list right after the verse it followed, so the teacher app sees it. */
export const VERSE_CYCLE = 5;
export interface AddedVerse extends MemoryVerse { after: string; at: number }
export function normalizeAddedVerses(raw: unknown): AddedVerse[] {
  return (Array.isArray(raw) ? raw : []).filter(x => x && typeof x === 'object' && String((x as AddedVerse).text || '').trim() && String((x as AddedVerse).ref || '').trim() && (x as AddedVerse).id)
    .map(x => { const a = x as AddedVerse; return { id: String(a.id).slice(0, 40), ref: String(a.ref).trim().slice(0, 80), version: String(a.version || '').trim().slice(0, 40), text: String(a.text).trim().replace(/\s+/g, ' ').slice(0, 2000), after: String(a.after || '').slice(0, 40), at: Number.isFinite(+a.at) ? +a.at : 0 }; })
    .filter((a, i, all) => all.findIndex(b => b.id === a.id) === i).slice(-100);
}
/** Her verse list: the teacher's verses, with each grown-up verse from her save placed right after the verse it followed
    (at the end when that one is gone). A verse the teacher saved with the same id, or removed, isn't added again. */
export function withAddedVerses(s: BibleSettings, added: unknown): BibleSettings {
  const have = new Set([...s.verses.map(v => v.id), ...(s.removed || [])]), list = [...s.verses];
  for (const a of normalizeAddedVerses(added).sort((x, y) => x.at - y.at)) {
    if (have.has(a.id)) continue;
    have.add(a.id);
    const v = { id: a.id, ref: a.ref, version: a.version, text: a.text }, i = list.findIndex(x => x.id === a.after);
    if (i < 0) list.push(v); else list.splice(i + 1, 0, v);
  }
  return { ...s, verses: list };
}
/** The same checks as the teacher app's verse form: a reference and the verse are needed; spaces are tidied. */
export function verseFormError(ref: string, text: string): string {
  if (!String(ref || '').trim()) return 'Type the reference (like John 3:16) first. Nothing was saved yet.';
  if (!String(text || '').trim()) return 'Type the verse first. Nothing was saved yet.';
  return '';
}
/** Where a verse's 5-day round stands on `day`: practice days so far (days with a try), the day of this round (1–5),
    the finished rounds, and whether today is a 5th day with the day's tries done (the recap shows). */
/** Every day she practiced this verse: the saved days plus the days of her kept tries. */
export const verseDays = (p: VerseProgress) => [...new Set([...(p.days || []), ...p.tries.map(t => t.day)])].filter(Boolean).sort();
/** Counts a day as practiced (in place). */
export function markVerseDay(p: VerseProgress, day: string) { if (!/^\d{4}-\d\d-\d\d$/.test(day)) return; p.days = verseDays(p); if (!p.days.includes(day)) p.days = [...p.days, day].sort().slice(-400); }
export function verseCycle(p: VerseProgress, day: string) {
  const days = verseDays(p), upTo = days.filter(d => d <= day), n = upTo.length, practiced = days.includes(day);
  const dayInRound = n ? ((n - 1) % VERSE_CYCLE) + 1 : 0, todayTries = p.tries.filter(t => t.day === day).length;
  return { days: n, practiced, day: practiced ? dayInRound : (n % VERSE_CYCLE) + 1, rounds: Math.floor(n / VERSE_CYCLE), recapToday: practiced && dayInRound === VERSE_CYCLE && todayTries >= VERSE_TRIES_A_DAY };
}
/** The recap of a verse's latest 5 practice days (up to `day`): the step she reached, its name, tries, the last-5
    average at that step, and whether she learned it. */
export function verseRecap(p: VerseProgress, day: string) {
  const days = verseDays(p).filter(d => d <= day), last5 = days.slice(-VERSE_CYCLE);
  const tries = p.tries.filter(t => last5.includes(t.day)), step = tries.length ? Math.max(...tries.map(t => t.step)) : p.step;
  const avg = lastFiveAverage(p, step);
  return { step, name: stepName(step), level: step + 1, levels: VERSE_STEPS.length, tries: tries.length, days: last5.length, from: last5[0] || '', avg, learned: !!p.learned, learnedDay: p.learned, aside: p.aside || '' };
}
/** She has learned every verse (or none was ever added): a grown-up should add the next one. */
export const needsNewVerse = (s: BibleSettings, progress: Record<string, unknown> | undefined) => s.on && !currentVerse(s, progress);
export const verseWords = (text: string) => String(text || '').trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/** A step's practice: this many blanks, or the whole verse. */
export function verseStepPractice(text: string, step: number): { mode: 'blanks' | 'full'; blanks: number } {
  const words = verseWords(text);
  if (step >= FULL_STEP) return { mode: 'full', blanks: words };
  return { mode: 'blanks', blanks: Math.max(1, Math.min(words, Math.round(words * VERSE_STEPS[step]))) };
}
export const stepName = (step: number) => (step >= FULL_STEP ? 'the whole verse' : `${Math.round(VERSE_STEPS[step] * 100)}% blanks`);
