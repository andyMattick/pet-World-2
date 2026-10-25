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

/* ---------- the verse of the week (set by a grown-up in the teacher app) ---------- */
export interface WeekVerse { week: string; ref: string; version: string; text: string }
export interface BibleSettings { on: boolean; verses: WeekVerse[] }
const DAY = /^\d{4}-\d{2}-\d{2}$/;
export function parseBibleSettings(raw: unknown): BibleSettings {
  let v: unknown = raw;
  try { if (typeof raw === 'string') v = JSON.parse(raw); } catch { v = null; }
  const o = v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
  const verses = (Array.isArray(o.verses) ? o.verses : []).filter((x): x is WeekVerse => !!x && typeof x === 'object' && DAY.test(String((x as WeekVerse).week)) && !!String((x as WeekVerse).text || '').trim())
    .map(x => ({ week: x.week, ref: String(x.ref || '').slice(0, 80), version: String(x.version || '').slice(0, 40), text: String(x.text).slice(0, 2000) }))
    .sort((a, b) => (a.week < b.week ? -1 : 1));
  return { on: o.on === true, verses };
}
/** The Monday that starts the week holding this day ("YYYY-MM-DD"). */
export function weekOf(day: string): string {
  const d = new Date(`${day}T12:00:00`), back = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - back);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** This week's verse, or null when the grown-up hasn't set one for this week. */
export const verseForDay = (s: BibleSettings, day: string) => s.verses.find(v => v.week === weekOf(day)) || null;
/** Days since the week's Monday: 0 on Monday … 6 on Sunday. */
export const dayOfWeek = (day: string) => (new Date(`${day}T12:00:00`).getDay() + 6) % 7;

/* How much of the verse is blank each day: Monday a fifth of the words, more each day, and from Friday on she writes the
   whole verse from memory. */
export const VERSE_PLAN: { blanks: number; full: boolean; name: string }[] = [
  { blanks: 0.2, full: false, name: 'Monday' }, { blanks: 0.35, full: false, name: 'Tuesday' }, { blanks: 0.5, full: false, name: 'Wednesday' },
  { blanks: 0.7, full: false, name: 'Thursday' }, { blanks: 1, full: true, name: 'Friday' }, { blanks: 1, full: true, name: 'Saturday' }, { blanks: 1, full: true, name: 'Sunday' }
];
export const verseWords = (text: string) => String(text || '').trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/** Today's practice: write the whole verse, or fill in this many blanks. */
export function versePractice(text: string, day: string): { mode: 'blanks' | 'full'; blanks: number } {
  const p = VERSE_PLAN[dayOfWeek(day)], words = verseWords(text);
  if (p.full) return { mode: 'full', blanks: words };
  return { mode: 'blanks', blanks: Math.max(1, Math.min(words, Math.round(words * p.blanks))) };
}
/** A practice counts for the day when at most a tenth of it is wrong (rounded down), or after 3 tries. */
export const verseGood = (mistakes: number, total: number) => mistakes <= Math.floor(total / 10);
export const VERSE_TRIES_FOR_DONE = 3;
