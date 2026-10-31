/* 🤖 Help bot (docs/HELP-BOT.md): a non-AI helper for the student app and the teacher app.
   No network, no API calls: it matches a typed question against an index built from the apps' own data
   (BUILDINGS, SHOPS, ARCADE_GAMES, BRAIN_GAMES, the town spots, the teacher tabs and settings), so it can't go stale.
   This file has no imports: the apps pass their data in, and scripts/check-help-bot.mjs runs it in node.

   How it matches: normalize (lowercase, no accents or punctuation), phrase aliases ("reset password" → "reset pin"),
   word synonyms (kids → student, disable → off, Spanish words), a light stemmer, typo tolerance (edit distance),
   idf weights (rare words count more than "pet"), an intent from the question's shape ("where is", "how do I",
   "what is", "turn off", "what next"), and a confidence cutoff with a "did you mean" fallback. */

export type HelpIntent = 'where' | 'how' | 'what' | 'on' | 'off' | 'next' | 'hello' | 'thanks' | null;
export type HelpKind = 'place' | 'unit' | 'station' | 'skill' | 'game' | 'brain' | 'spot' | 'faq' | 'tab' | 'setting' | 'class' | 'grade';

export interface HelpEntry {
  id: string;            // unique in the index
  kind: HelpKind;
  title: string;         // what the answer is about ("Arcade", "Bakery", "Brain stretches")
  emoji?: string;
  text: string;          // the short answer
  keys?: string[];       // extra words and phrases people use for it
  go?: string;           // destination token the app knows how to open ('spot:arcade', 'building:bakery', 'tab:roster', 'setting:brainEnabled')
  hood?: string;         // student neighborhood (grade) it belongs to
  subject?: string;
  parent?: string;       // e.g. the shop a skill belongs to (a little extra context for matching)
  intents?: HelpIntent[];// intents this entry answers best (FAQ "how" answers, settings "on"/"off")
  boost?: number;        // hand weight (default 1)
}

export interface HelpContext {
  hood?: string;                        // the student's grade neighborhood
  screen?: string;                      // the screen or tab on now
  hidden?: (entry: HelpEntry) => boolean; // teacher-hidden things are left out
}

export interface HelpHit { entry: HelpEntry; score: number; confidence: number }
export interface HelpAnswer { intent: HelpIntent; status: 'sure' | 'maybe' | 'none' | 'next' | 'hello' | 'thanks'; hits: HelpHit[]; query: string }

/* ---------- text ---------- */
const STOP = new Set(('a an the i me my mine we our you your it its is are am was be been do does did can could would should will ' +
  'to of in on at for from with and or but so if then than that this these those there here please pls plz just really ' +
  'want wanna need get got have has had let lets go going some any thing things stuff kind sort about into up out work works working ' +
  'he she they them his her their who whom which im ive id dont cant isnt how where what when why find show tell take open see look ' +
  'el la los las de del en un una y o que por para con mi me es').split(/\s+/));

/* phrases first (on normalized text), then single words */
const PHRASES: [RegExp, string][] = [
  [/\b(show me around|show me how (this|it) works|how does (this|it|pet world)( all)? work|how do(es)? (this|pet world) work|give me a tour|tour guide|guided tour|walk ?through|walk me through|new here|im new|i am new)\b/g, ' tour '],   // 🧭 docs/TOUR.md
  [/\b(pass ?word|pass ?code|passcode|log ?in code|secret number)\b/g, 'pin'],
  [/\btimes tables?\b|\bmultiplication facts?\b|\bmath facts?\b/g, 'sprint facts'],
  [/\bfact sprint\b|\bsprint track\b/g, 'sprint'],
  [/\b(brain (break|stretch|stretches|games?)|stretch games?)\b/g, 'brainstretch'],
  [/\b(stand(ing)? (and|n) stretch|move(ment)? breaks?|exercise breaks?|stretch breaks?)\b/g, 'movebreak'],
  [/\b(read ?aloud|read it to me|read to me|text to speech|listen)\b/g, 'readaloud'],
  [/\b(pet room|my room|my pet room|bedroom)\b/g, 'petroom'],
  [/\b(sticker book|pet shop)\b/g, 'stickerbook'],
  [/\b(town hall|backups?)\b/g, 'townhall'],
  [/\b(word workshop|vocab(ulary)?|spelling( words)?|paw path)\b/g, 'wordworkshop'],
  [/\b(reading log|book log|my books)\b/g, 'readinglog'],
  [/\b(science lab|hands on|experiments?|nature journal)\b/g, 'sciencelab'],
  [/\b(art studio|paint(ing)?|draw(ing)?)\b/g, 'artstudio'],
  [/\b(quick set ?up|set ?up menu|setup)\b/g, 'quicksetup'],
  [/\b(still there|idle|inactive|afk)\b/g, 'idlenudge'],
  [/\b(theme days?|dress up days?)\b/g, 'themedays'],
  [/\b(free play)\b/g, 'freeplay'],
  [/\b(class code|join code)\b/g, 'classcode'],
  [/\b(daily plan|todays plan|today plan|my plan|to do list|todo list|checklist)\b/g, 'plan'],
  [/\b(khan( academy)?)\b/g, 'khan'],
  [/\b(you ?tube)\b/g, 'youtube'],
  [/\b(turn(ed)? off|shut off|switch off|turn it off|no more|get rid of|opt out|not allowed)\b/g, ' off '],
  [/\b(turn(ed)? on|switch on|let them|allow)\b/g, ' on '],
  [/\b(what should i do|what do i do|what now|what next|whats next|what is next|where do i start|where should i start|what to do|im bored|i am bored|start here|first thing)\b/g, ' whatnext '],
  [/\b(where is|wheres|where are|where can i|take me( to)?|go to|bring me|how do i get to|how to get to|find|show me|open|navigate)\b/g, ' wherex '],
  [/\b(how do i|how can i|how to|how does|how do you|how do|how can)\b/g, ' howx '],
  [/\b(why is|why are|why cant i|why can t i|why does|why|what is|whats|what are|what does|what s|explain|meaning of|tell me about)\b/g, ' whatx '],
  [/\b(student info|lock(ed)? out)\b/g, ' locked student ']
];
const SYN: Record<string, string> = {
  kid: 'student', kids: 'student', child: 'student', children: 'student', pupil: 'student', pupils: 'student', students: 'student',
  learner: 'student', learners: 'student', daughter: 'student', son: 'student', classmate: 'student',
  disable: 'off', disabled: 'off', deactivate: 'off', stop: 'off', hide: 'off', remove: 'off', block: 'off', mute: 'off', pause: 'off', end: 'off',
  enable: 'on', enabled: 'on', activate: 'on', unhide: 'on', unmute: 'on', allowed: 'on', start: 'on',
  exam: 'test', exams: 'test', assessment: 'test', assessments: 'test', final: 'test', tests: 'test',
  quizzes: 'quiz', checkup: 'quiz',
  money: 'coin', coins: 'coin', cash: 'coin', gold: 'coin', points: 'coin', ticket: 'tickets',
  song: 'music', songs: 'music', soundtrack: 'music', sounds: 'sound', sfx: 'sound', volume: 'music',
  password: 'pin', passwords: 'pin', pins: 'pin', code: 'pin',
  reset: 'reset', change: 'change', forgot: 'reset', forgotten: 'reset', lost: 'reset', new: 'new',
  add: 'add', enroll: 'add', invite: 'add', create: 'add', make: 'add', join: 'add',
  roster: 'roster', list: 'roster', class: 'class', classes: 'class', period: 'class',
  locked: 'locked', lock: 'locked', closed: 'locked', grey: 'locked', gray: 'locked', greyed: 'locked', unavailable: 'locked', cant: 'locked', blocked: 'locked',
  unlock: 'unlock', opens: 'unlock', opening: 'unlock',
  games: 'game', gaming: 'game', play: 'game', playing: 'game', fun: 'game', videogame: 'game', videogames: 'game',
  grades: 'grade', score: 'grade', scores: 'grade', marks: 'grade', report: 'report', reports: 'report', progress: 'report',
  dashboard: 'dashboard', live: 'dashboard', home: 'town', town: 'town', map: 'town', main: 'town', menu: 'town', back: 'town',
  video: 'video', videos: 'video', movie: 'video', watch: 'video',
  reward: 'reward', rewards: 'reward', prize: 'reward', prizes: 'reward', sticker: 'stickerbook', stickers: 'stickerbook',
  helper: 'helper', pet: 'pet', pets: 'pet', animal: 'pet', animals: 'pet',
  bible: 'bible', verse: 'bible', verses: 'bible', scripture: 'bible', devotional: 'bible', journal: 'bible',
  science: 'biology', bio: 'biology', biology: 'biology', life: 'biology',
  grammar: 'english', ela: 'english', writing: 'english', language: 'english', english: 'english',
  social: 'history', studies: 'history', museum: 'history', museums: 'history',
  maths: 'math', arithmetic: 'math', numbers: 'math',
  ledger: 'ledger', transcript: 'transcript', transcripts: 'transcript',
  spanish: 'spanish', espanol: 'spanish', translate: 'spanish',
  /* a little Spanish (the language toggle) */
  donde: 'wherex', esta: '', estan: '', hay: '', puedo: '', quiero: '', como: 'howx', que: 'whatx', juego: 'game', juegos: 'game', jugar: 'game', examen: 'test', prueba: 'test',
  musica: 'music', lectura: 'readinglog', ayuda: 'help', biblia: 'bible', apagar: 'off', desactivar: 'off', encender: 'on', activar: 'on',
  contrasena: 'pin', clave: 'pin', estudiantes: 'student', estudiante: 'student', alumnos: 'student', monedas: 'coin', tienda: 'shop',
  ciencia: 'biology', historia: 'history', ingles: 'english', matematicas: 'math', empezar: 'whatnext', siguiente: 'whatnext'
};

export function normalize(text: string): string {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/* a light stemmer: enough to make fractions/fraction, dividing/divide, stations/station meet */
export function stem(word: string): string {
  let w = word;
  if (w.length <= 3 || /^\d+$/.test(w)) return w;
  if (w.endsWith('ies') && w.length > 4) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('sses')) w = w.slice(0, -2);
  else if (w.endsWith('es') && /(ch|sh|x|z|ss)es$/.test(w)) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 5 && w.endsWith('ly')) w = w.slice(0, -2);
  if (w.length > 5 && w.endsWith('ation')) w = w.slice(0, -5) + 'e';
  if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

export function editDistance(a: string, b: string, max = 3): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({length: a.length + 1}, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);   // swapped letters count once
      best = Math.min(best, d[i][j]);
    }
    if (best > max) return max + 1;
  }
  return d[a.length][b.length];
}

const KEEP_WORDS = new Set(['tour', 'brainstretch', 'movebreak', 'petroom', 'stickerbook', 'townhall', 'wordworkshop', 'readinglog', 'sciencelab', 'artstudio', 'themedays', 'freeplay', 'classcode']);
const INTENT_WORDS: Record<string, HelpIntent> = { wherex: 'where', howx: 'how', whatx: 'what', on: 'on', off: 'off', whatnext: 'next' };

/* words from text, with phrase aliases and synonyms applied (used for both questions and entries) */
export function words(text: string, keepIntent = false): string[] {
  let t = ' ' + normalize(text) + ' ';
  for (const [re, to] of PHRASES) t = t.replace(re, KEEP_WORDS.has(to) ? ' $& ' + to + ' ' : ' ' + to + ' ');   // a place name keeps its words too
  const out: string[] = [];
  for (const raw of t.split(' ')) {
    if (!raw) continue;
    const w = raw in SYN ? SYN[raw] : raw;
    if (!w) continue;
    if (!keepIntent && INTENT_WORDS[w] !== undefined) continue;
    if (STOP.has(w)) continue;
    out.push(w);
  }
  return out;
}

export function parseIntent(text: string): HelpIntent {
  const n = normalize(text);
  if (/^(hi|hello|hey|hola|yo|good (morning|afternoon)|help|ayuda|\?)$/.test(n)) return 'hello';
  if (/^(thanks|thank you|thx|ty|gracias|ok|okay|cool|got it)\b/.test(n)) return 'thanks';
  const ws = words(text, true);
  for (const k of ['whatnext', 'off', 'on', 'howx', 'wherex', 'whatx']) if (ws.includes(k)) return INTENT_WORDS[k];
  return null;
}

/* ---------- the index ---------- */
interface Doc { entry: HelpEntry; title: Set<string>; keys: Set<string>; body: Set<string>; titleNorm: string; keyNorms: string[] }
export interface HelpIndex { docs: Doc[]; df: Map<string, number>; vocab: string[] }

const stems = (text: string) => new Set(words(text).map(stem).filter(Boolean));

export function buildIndex(entries: HelpEntry[]): HelpIndex {
  const docs: Doc[] = entries.map(entry => ({
    entry,
    title: stems(entry.title),
    keys: stems((entry.keys || []).join(' ') + ' ' + (entry.parent || '')),
    body: stems(entry.text),
    titleNorm: normalize(entry.title),
    keyNorms: (entry.keys || []).map(normalize).filter(k => k.length > 2)
  }));
  const df = new Map<string, number>();
  for (const d of docs) for (const w of new Set([...d.title, ...d.keys])) df.set(w, (df.get(w) || 0) + 1);
  return { docs, df, vocab: [...df.keys()] };
}

/* how well one query word matches a set of entry words: 1 exact, 0.85 prefix, 0.7 one typo, 0.55 two typos (long words) */
function wordMatch(q: string, set: Set<string>): number {
  if (set.has(q)) return 1;
  let best = 0;
  for (const w of set) {
    const short = Math.min(q.length, w.length), long = Math.max(q.length, w.length);
    if (short >= 4 && short / long >= 0.6 && (w.startsWith(q) || q.startsWith(w))) best = Math.max(best, 0.85);
    else if (q.length >= 4 && w.length >= 3) {
      const d = editDistance(q, w, 2);
      if (d === 1) best = Math.max(best, 0.7);
      else if (d === 2 && q.length >= 7) best = Math.max(best, 0.55);
    }
    if (best >= 0.85) break;
  }
  return best;
}

export function search(index: HelpIndex, question: string, ctx: HelpContext = {}): HelpHit[] {
  const intent = parseIntent(question);
  const qn = normalize(question);
  const qs = [...new Set(words(question).map(stem))];
  const n = index.docs.length || 1;
  const idf = (w: string) => Math.log(1 + n / (1 + (index.df.get(w) || 0)));
  const hits: HelpHit[] = [];
  for (const d of index.docs) {
    if (ctx.hidden?.(d.entry)) continue;
    let got = 0, total = 0, titleHits = 0;
    for (const q of qs) {
      const weight = Math.max(0.6, idf(q));
      total += weight;
      const t = wordMatch(q, d.title), k = wordMatch(q, d.keys), b = wordMatch(q, d.body);
      const m = Math.max(t, k * 0.95, b * 0.45);
      if (t > 0.6) titleHits++;
      got += weight * m;
    }
    let score = total ? got / total : 0;
    /* whole-title or whole-alias phrase in the question: strong signal */
    if (d.titleNorm.length > 2 && (` ${qn} `).includes(` ${d.titleNorm} `)) score += 0.45;
    else if (d.keyNorms.some(k => (` ${qn} `).includes(` ${k} `))) score += 0.35;
    if (titleHits && titleHits === d.title.size) score += 0.1;   // every word of the title asked for
    if (!score) continue;
    const e = d.entry;
    score *= e.boost ?? 1;
    if (intent && e.intents?.includes(intent)) score *= 1.25;
    if ((intent === 'where') && (e.kind === 'faq')) score *= 0.85;
    if ((intent === 'how' || intent === 'what') && e.kind === 'faq') score *= 1.1;
    if ((intent === 'on' || intent === 'off') && e.kind === 'setting') score *= 1.2;
    if (ctx.hood && e.hood) score *= e.hood === ctx.hood ? 1.2 : 0.8;
    hits.push({ entry: e, score, confidence: Math.min(1, score) });
  }
  hits.sort((a, b) => b.score - a.score);
  /* one row per destination: a shop's skills and stations fold into the shop */
  const seen = new Set<string>(), out: HelpHit[] = [];
  for (const h of hits) { const k = h.entry.go || h.entry.id; if (seen.has(k)) continue; seen.add(k); out.push(h); }
  return out;
}

export const SURE = 0.62, MAYBE = 0.3;

export function ask(index: HelpIndex, question: string, ctx: HelpContext = {}): HelpAnswer {
  const intent = parseIntent(question), query = question.trim();
  if (intent === 'hello') return { intent, status: 'hello', hits: [], query };
  if (intent === 'thanks') return { intent, status: 'thanks', hits: [], query };
  const hits = search(index, question, ctx);
  const left = words(question).length;
  if (intent === 'next' && (!hits.length || hits[0].score < SURE || left <= 1)) return { intent, status: 'next', hits: hits.slice(0, 3), query };
  if (!hits.length || hits[0].score < MAYBE) return { intent, status: 'none', hits: hits.slice(0, 3), query };
  if (hits[0].score >= SURE && (hits.length < 2 || hits[0].score - hits[1].score > 0.08 || hits[0].score >= 1)) return { intent, status: 'sure', hits: hits.slice(0, 3), query };
  return { intent, status: 'maybe', hits: hits.slice(0, 3), query };
}

/* "did you mean": the closest known words to the ones that matched nothing */
export function suggestWords(index: HelpIndex, question: string): string[] {
  const out: string[] = [];
  for (const q of words(question).map(stem)) {
    if (index.df.has(q) || q.length < 4) continue;
    let best = '', bestD = 3;
    for (const w of index.vocab) { if (w.length < 4) continue; const d = editDistance(q, w, 2); if (d < bestD) { bestD = d; best = w; } }
    if (best && bestD <= (q.length >= 7 ? 2 : 1)) out.push(best);
  }
  return out;
}

/* ---------- student knowledge (built from the registry) ---------- */
interface NamedThing { id: string; name: string; emoji: string }
export interface StudentData {
  BUILDINGS: (NamedThing & { unit: string; hood: string; subject: string; open?: boolean })[];
  NEIGHBORHOODS: NamedThing[];
  SUBJECTS: NamedThing[];
  SHOPS: Record<string, NamedThing & { unitLabel: string; stations: { id: number; name: string; emoji: string; kid: string; skills: string[] }[] }>;
  SKILLS?: Record<string, { name: string; short: string; shop?: string }>;
  ARCADE_GAMES: (NamedThing & { description: string; available: boolean })[];
  BRAIN_GAMES: (NamedThing & { skill: string })[];
}

/* the town spots: every non-unit tile on the town page (scripts/verify.mjs checks each data-open in renderHome is here) */
export const STUDENT_SPOTS: { id: string; emoji: string; name: string; text: string; keys: string[]; boost?: number }[] = [
  { id: 'bible', emoji: '✝️', name: 'Bible', text: 'Bible comes first each day: your journal, the verse, and books of the Bible.', keys: ['bible', 'verse', 'journal', 'books of the bible', 'devotion', 'pray', 'god', 'jesus'] },
  { id: 'sprint', emoji: '⚡', name: 'Sprint Track', text: 'Fact Sprint: 60 seconds of times tables. Right answers power up your tips.', keys: ['sprint', 'sprint facts', 'multiply', 'multiplication', 'facts', 'fast math', 'power', 'tips', 'race'] },
  { id: 'vocab', emoji: '🔤', name: 'Word Workshop', text: 'Your words of the week: the Paw Path, the word game of the day, and the mastery check on your 5th practice day.', keys: ['wordworkshop', 'words', 'word', 'spelling', 'definitions', 'word game', 'crossword', 'word search', 'mastery check', 'hall of fame'] },
  { id: 'reading', emoji: '📖', name: 'Reading Log', text: 'Log the books you read, write chapter notes, and take Reading Quizzes once a grown-up checks your notes.', keys: ['readinglog', 'reading', 'read', 'books', 'book', 'chapter', 'notes', 'reading quiz', 'novel'] },
  { id: 'artstudio', emoji: '🎨', name: 'Art Studio', text: 'Paint pictures, buy frames, and hang your art in your Pet Room.', keys: ['artstudio', 'art', 'paint', 'draw', 'frame', 'picture', 'color'] },
  { id: 'room', emoji: '🏠', name: 'My Pet Room', text: 'Decorate your room with stickers you earned and dress up your pets.', keys: ['petroom', 'room', 'decorate', 'decorations', 'furniture', 'dress up', 'clothes', 'hat', 'wardrobe'] },
  { id: 'book', emoji: '🛍️', name: 'Pet Shop & Sticker Book', text: 'See every sticker (pets and decorations) for each building and how to earn it.', keys: ['stickerbook', 'stickers', 'collection', 'pet shop', 'buy', 'shop', 'store', 'reward'] },
  { id: 'hall', emoji: '🏛️', name: 'Town Hall', text: 'Backups and your progress report.', keys: ['townhall', 'backup', 'save', 'saved', 'progress', 'report', 'restore'] },
  { id: 'arcade', emoji: '🕹️', name: 'Arcade', text: 'Games you play with the practice time you earn. Your teacher decides if it is open.', keys: ['arcade', 'game', 'games', 'play', 'fun', 'tickets', 'free play', 'video games'], boost: 1.2 },
  { id: 'scienceLab', emoji: '🔬', name: 'Science Lab', text: 'Every Biology lab, one a week. It is on the Biology class page once a Biology unit is open.', keys: ['sciencelab', 'lab', 'experiment', 'hands on', 'nature journal', 'biology lab'] },
  { id: 'prepRecall', emoji: '🔗', name: 'Name All 48 Prepositions', text: 'The prep test: type every preposition you can remember before time runs out.', keys: ['prepositions', 'preposition test', 'prep test', 'name all 48', '48 prepositions'] }
];

export const STUDENT_FAQ: { id: string; title: string; text: string; keys: string[]; intents?: HelpIntent[]; go?: string }[] = [
  { id: 'test', title: 'How tests work', text: 'Every unit test starts with a 📇 review. When you finish the review, a grown-up types the PIN to start the test. There is no skip, only Cancel. Find the test at the bottom of the unit page.', keys: ['test', 'unit test', 'take a test', 'start test', 'khan test', 'review', 'grown up', 'pin'], intents: ['how', 'what'] },
  { id: 'quiz', title: 'How quizzes work', text: 'Each station has a quiz after you practice. Pass it to show you know the station. Quizzes are at the station in your shop or under each group of lessons.', keys: ['quiz', 'station quiz', 'pass quiz'], intents: ['how', 'what'] },
  { id: 'locked', title: 'Why is something locked?', text: 'A building opens when you pass the Unit Test of the one before it, or when your teacher opens it. A station opens after 6 orders at the one before it. Things your teacher turned off say so.', keys: ['locked', 'lock', 'cant open', 'greyed out', 'unlock', 'opening soon', 'closed', 'why locked'], intents: ['how', 'what'] },
  { id: 'coins', title: 'Coins and rewards', text: 'You earn 🪙 coins and tips for each order you serve. Faster service earns bigger tips, and Fact Sprint powers them up. Coins buy stickers in the Pet Shop; stickers go in your Pet Room and display case.', keys: ['coin', 'tips', 'earn', 'reward', 'buy', 'spend', 'how many coins', 'rich'], intents: ['how', 'what'], go: 'spot:book' },
  { id: 'tickets', title: 'Arcade tickets and time', text: 'Practice time opens Arcade time. Games pay 🎟️ tickets you can trade for Pet Room furniture. With Free Play on, there are no coins or tickets.', keys: ['tickets', 'arcade time', 'how long arcade', 'admission', 'free play'], intents: ['how', 'what'], go: 'spot:arcade' },
  { id: 'readaloud', title: 'Read aloud', text: 'Tap the 🔊 speaker button next to a question or lesson to hear it read aloud. The 🔊 at the top turns sound effects on or off.', keys: ['readaloud', 'read aloud', 'hear', 'speaker', 'voice', 'audio', 'sound'], intents: ['how', 'what', 'on', 'off'] },
  { id: 'music', title: 'Music', text: 'Tap 🎵 at the top to pick a song or change the volume. If it shows 🔇, your teacher turned music off.', keys: ['music', 'song', 'volume', 'quiet', 'loud', 'sound'], intents: ['how', 'on', 'off'] },
  { id: 'video', title: 'Today’s video', text: 'The first practice each day in Math, History or Biology starts with a video: pick one, watch it, and a grown-up signs with the PIN. Then practice opens.', keys: ['video', 'watch', 'today video', 'cant practice', 'video first'], intents: ['how', 'what'] },
  { id: 'brain', title: 'Brain stretches', text: 'Once a day, after your first subject, you play 3 short brain games. They come by themselves and can’t be skipped.', keys: ['brainstretch', 'brain', 'brain games', 'stretch'], intents: ['what', 'how', 'off'] },
  { id: 'move', title: 'Stand-and-stretch breaks', text: 'After your third subject, your pet leads a short movement break. Stand up and follow along!', keys: ['movebreak', 'stretch', 'exercise', 'move'], intents: ['what', 'how', 'off'] },
  { id: 'plan', title: 'Today’s plan', text: 'Today’s plan is at the top of your town. Do the rows in order: Bible first, then warm-up, then your subjects. Tap Go on a row to open it.', keys: ['plan', 'today', 'schedule', 'list', 'what to do', 'order'], intents: ['what', 'how', 'next'], go: 'screen:home' },
  { id: 'done', title: 'I’m done for today', text: 'When your plan is done, tap ✅ I’m done for today on the town page so your grown-up gets today’s record.', keys: ['done', 'finished', 'finish', 'end day', 'record', 'stop for today'], intents: ['how'], go: 'screen:home' },
  { id: 'question', title: 'Ask your teacher', text: 'Stuck on an assignment? Tap the ✋ I have a question button on it. Your teacher gets it and answers on your plan.', keys: ['question', 'ask teacher', 'stuck', 'broken', 'confused', 'dont understand', 'hand'], intents: ['how'] },
  { id: 'grade', title: 'Change grade (neighborhood)', text: 'Your town has a neighborhood for each grade. Use the grade buttons on the town page to switch.', keys: ['grade', 'neighborhood', '4th grade', '6th grade', 'fourth', 'sixth', 'switch grade'], intents: ['how', 'where'], go: 'screen:home' },
  { id: 'helper', title: 'Helper pet and display case', text: 'Tap My helper on the town page to pick the pet that helps you, and tap a shelf to show off a decoration.', keys: ['helper', 'pet', 'display', 'case', 'shelf', 'choose pet'], intents: ['how'], go: 'screen:home' },
  { id: 'spanish', title: 'Español', text: 'Tap Español at the top to see Pet World in Spanish. Tap English to switch back.', keys: ['spanish', 'language', 'espanol', 'translate'], intents: ['how', 'on', 'off'] },
  { id: 'tour', title: '🧭 Take the tour', text: 'A quick walk around your town: Today’s plan, your classes, your words, coins, the Arcade and me. Skip it any time.', keys: ['tour', 'show me around', 'how does this work', 'guide', 'walkthrough', 'new here', 'first time', 'help me start'], go: 'tour:town', intents: ['how', 'what', 'where'] },
  { id: 'grownup', title: 'Grown-up page', text: 'The 👩‍🏫 button at the top opens the teacher and parent page. It needs the grown-up PIN.', keys: ['grown up', 'parent', 'teacher page', 'parent page', 'settings'], intents: ['where', 'how'] }
];

export function studentEntries(data: StudentData): HelpEntry[] {
  const out: HelpEntry[] = [];
  const hoodName = (id: string) => data.NEIGHBORHOODS.find(n => n.id === id)?.name || id;
  const subjectName = (id: string) => data.SUBJECTS.find(s => s.id === id)?.name || id;
  for (const s of STUDENT_SPOTS) out.push({ id: 'spot:' + s.id, kind: 'spot', title: s.name, emoji: s.emoji, text: s.text, keys: s.keys, go: 'spot:' + s.id, intents: ['where'], boost: s.boost });
  for (const f of STUDENT_FAQ) out.push({ id: 'faq:' + f.id, kind: 'faq', title: f.title, text: f.text, keys: f.keys, go: f.go, intents: f.intents });
  for (const n of data.NEIGHBORHOODS) out.push({ id: 'grade:' + n.id, kind: 'grade', title: n.name, emoji: n.emoji, text: `The ${n.name} neighborhood of your town.`, keys: [n.name, n.id, 'grade', 'neighborhood'], go: 'grade:' + n.id, boost: 0.8 });
  for (const s of data.SUBJECTS) out.push({ id: 'class:' + s.id, kind: 'class', title: s.name, emoji: s.emoji, text: `Your ${s.name} class: every ${s.name} unit in your grade.`, keys: [s.name, s.id, 'class', 'subject'], go: 'class:' + s.id, intents: ['where'] });
  for (const b of data.BUILDINGS) {
    const shop = data.SHOPS[b.id];
    out.push({ id: 'building:' + b.id, kind: 'unit', title: b.name, emoji: b.emoji, go: 'building:' + b.id, hood: b.hood, subject: b.subject, intents: ['where'],
      text: `${b.unit} (${subjectName(b.subject)}, ${hoodName(b.hood)}).` + (b.open ? '' : ' Coming soon.'),
      keys: [b.unit, subjectName(b.subject), shop?.unitLabel || '', b.id] });
    if (shop) {
      for (const st of shop.stations) out.push({ id: `station:${b.id}:${st.id}`, kind: 'station', title: st.name, emoji: st.emoji, go: 'building:' + b.id, hood: b.hood, subject: b.subject, parent: b.name,
        text: `A station in the ${b.name}: ${st.kid}.`, keys: [st.kid, ...st.skills.map(id => data.SKILLS?.[id]?.name || '')], boost: 0.95 });
    }
  }
  if (data.SKILLS) for (const [id, s] of Object.entries(data.SKILLS)) {
    const shopId = s.shop || 'cafe', b = data.BUILDINGS.find(x => x.id === shopId); if (!b) continue;
    out.push({ id: 'skill:' + id, kind: 'skill', title: s.name, go: 'building:' + shopId, hood: b.hood, subject: b.subject, parent: b.name, text: `Practice ${s.name.toLowerCase()} in the ${b.name}.`, keys: [s.short], boost: 0.9 });
  }
  for (const g of data.ARCADE_GAMES) if (g.available) out.push({ id: 'game:' + g.id, kind: 'game', title: g.name, emoji: g.emoji, go: 'game:' + g.id, text: `An Arcade game: ${g.description}`, keys: ['arcade', 'arcade game'], intents: ['where'] });
  for (const g of data.BRAIN_GAMES) out.push({ id: 'brain:' + g.id, kind: 'brain', title: g.name, emoji: g.emoji, text: `A brain stretch game (${g.skill}). Brain games come once a day in your brain stretch, after your first subject.`, keys: ['brainstretch', 'brain game'] });
  return out;
}

/* ---------- teacher knowledge ---------- */
export interface TeacherSetting { id: string; emoji?: string; name: string; what: string; tab?: string; keys?: string[]; sel?: string; toggle?: boolean }   // sel: a CSS selector to highlight when there's no element with this id
export const TEACHER_TABS: { id: string; name: string; emoji: string; text: string; keys: string[] }[] = [
  { id: 'dashboard', name: 'Dashboard', emoji: '📊', text: 'The live class dashboard: who is working, struggles, mix-ups, practice time and alerts.', keys: ['dashboard', 'live', 'report', 'progress', 'grade', 'struggle', 'mix ups', 'alerts', 'who is online', 'practice time', 'insights', 'student page', 'ledger', 'transcript'] },
  { id: 'roster', name: 'Roster', emoji: '👥', text: 'Add students, print PIN cards, reset a PIN, unlock a locked-out student, reset progress, and 👀 Look at a student’s town.', keys: ['roster', 'student', 'add student', 'pin card', 'print', 'names', 'look', 'look only', 'view student', 'reset student'] },
  { id: 'settings', name: 'Settings', emoji: '⚙️', text: 'Everything for this class: units and stations, music, Khan, brain stretches, breaks, theme days, Arcade, quizzes, tests and practice pop-ups.', keys: ['settings', 'options', 'preferences', 'configure'] },
  { id: 'lessons', name: 'Lessons & questions', emoji: '📚', text: 'Lesson links and videos, question edits and stats, Khan results.', keys: ['lessons', 'questions', 'edit question', 'links', 'videos', 'khan results', 'question stats'] },
  { id: 'vocab', name: 'Vocabulary', emoji: '🔤', text: 'Each student’s words of the week, spelling focus and mastered words.', keys: ['vocab', 'wordworkshop', 'words', 'spelling', 'word list'] },
  { id: 'setup', name: 'Quick setup', emoji: '🧭', text: 'Every on/off choice for the class on one page, with what each does.', keys: ['quicksetup', 'setup', 'quick setup', 'get started', 'first time', 'new class', 'onboarding'] }
];

/* the Settings page controls (by element id). scripts/verify.mjs fails if a control in renderSettings() isn't here
   (or in the shared settings list once it exists), so a new setting can't be missed by the bot. */
export const TEACHER_SETTINGS: TeacherSetting[] = [
  { id: 'openSetup', name: 'Quick setup', what: 'Open the one-page list of every on/off choice.', keys: ['quicksetup'] },
  { id: 'copyJoin', name: 'Class code link', what: 'Copy the join link with your class code for students.', keys: ['classcode', 'join link', 'share', 'invite link'] },
  { id: 'joinFallback', name: 'Class code (manual)', what: 'The class code students type to join.', keys: ['classcode'] },
  { id: 'cName', name: 'Class name', what: 'Rename the class.', keys: ['rename', 'name class'] },
  { id: 'cStation', name: 'Starting station', what: 'Which station new students start on.', keys: ['station', 'start station', 'skip ahead', 'min station'] },
  { id: 'cHome', name: 'Home grade', what: 'The grade neighborhood students start in (4th or 6th grade).', keys: ['grade level', 'neighborhood', 'home grade', '4th grade', '6th grade'] },
  { id: 'unitToggles', name: 'Open units for the class', what: 'Open later units for everyone without the unit test.', keys: ['open unit', 'unlock unit', 'units', 'skip unit', 'open units'], sel: '[data-open-unit]' },
  { id: 'minStations', name: 'Starting station per shop', what: 'Start the class at a later station in a shop.', keys: ['station', 'start station', 'skip station'], sel: '[data-min-station]' },
  { id: 'allowMusic', name: 'Background music', what: 'Let students turn music on. Sound effects stay up to each student.', keys: ['music', 'song'] },
  { id: 'useKhan', name: 'Khan Academy links', what: 'Khan videos and the Khan unit test check. Off keeps students inside Pet World.', keys: ['khan'] },
  { id: 'requireThink', name: 'Require Think it through', what: 'Each math station’s reasoning set must be passed before the next station opens.', keys: ['think it through', 'reasoning'] },
  { id: 'useYouTube', name: 'YouTube video searches', what: 'A backup "Find videos on YouTube" link on each lesson.', keys: ['youtube', 'video search'] },
  { id: 'brainEnabled', name: 'Brain stretches', what: 'One brain break a day: 3 short brain games after the first subject. Pick the games below it.', keys: ['brainstretch', 'brain games', 'brain'] },
  { id: 'planShuffle', name: 'Random first subject (Order of the day)', what: 'Mark one subject ⭐ Start here each day and move quizzes and tests to the end of the plan.', keys: ['order of the day', 'shuffle', 'random', 'start here'] },
  { id: 'extrasFirst', name: 'Warm-up first', what: 'Fact Sprint and Word Workshop rounds come first each day, after Bible.', keys: ['warm up', 'warmup', 'extras', 'sprint', 'wordworkshop'] },
  { id: 'themesEnabled', name: 'Theme days', what: 'A fun theme day when a grown-up says yes each morning.', keys: ['themedays', 'theme'] },
  { id: 'themesWhen', name: 'Theme days: how often', what: 'Every day or Fridays only.', keys: ['themedays', 'friday', 'how often'] },
  { id: 'themesSpecial', name: 'Theme days: special days', what: 'Holiday and special theme days.', keys: ['themedays', 'holiday', 'special'] },
  { id: 'moveEnabled', name: 'Stand-and-stretch breaks', what: 'One movement break a day after the third subject. Pick the moves below it.', keys: ['movebreak', 'exercise', 'stretch', 'moves'] },
  { id: 'moveMinutes', name: 'Stand-and-stretch: minutes', what: 'Subject minutes before the break comes.', keys: ['movebreak', 'minutes', 'when'] },
  { id: 'idleOn', name: '“Still there?” and pause', what: 'Ask “Still there?” after no taps, then pause so idle time doesn’t count.', keys: ['idlenudge', 'pause', 'idle', 'popup', 'nudge'] },
  { id: 'idleNudge', name: '“Still there?”: minutes', what: 'Minutes with no taps before the pet asks.', keys: ['idlenudge', 'minutes'] },
  { id: 'idlePause', name: 'Pause: minutes', what: 'Minutes after the nudge before Pet World pauses.', keys: ['idlenudge', 'pause', 'minutes'] },
  { id: 'insightsOn', name: 'Daily insights email', what: 'An evening email with every student’s Insights.', keys: ['email', 'insights', 'daily email', 'summary'] },
  { id: 'insightsHour', name: 'Insights email time', what: 'The hour the insights email goes out.', keys: ['email', 'insights', 'time', 'hour'] },
  { id: 'arcadeEnabled', name: 'Arcade', what: 'Open the Arcade. Pick which games below it.', keys: ['arcade', 'game'] },
  { id: 'arcadeFreePlay', name: 'Arcade Free Play', what: 'No coin admission or tickets: practice time alone opens the Arcade.', keys: ['freeplay', 'free play', 'arcade'] },
  { id: 'arcadeGames', name: 'Arcade games on/off', what: 'Turn single Arcade games on or off.', keys: ['arcade', 'game', 'which games', 'close game'], sel: '[data-arcade-game]' },
  { id: 'brainGames', name: 'Brain stretch games on/off', what: 'Pick which brain games can come in a brain stretch.', keys: ['brainstretch', 'brain games', 'which games'], sel: '[data-brain-game]' },
  { id: 'moveList', name: 'Stand-and-stretch moves', what: 'Pick which moves the pet can lead.', keys: ['movebreak', 'moves', 'exercises'], sel: '[data-move]' },
  { id: 'themeDayList', name: 'Theme days on/off', what: 'Pick which theme days can come up.', keys: ['themedays', 'which themes'], sel: '[data-themeday]' },
  { id: 'arcadeCorsairRate', name: 'Arcade: Corsair points per ticket', what: 'Corsair’s Cove points needed for one ticket.', keys: ['corsair', 'tickets', 'arcade'] },
  { id: 'arcadeWhackTickets', name: 'Arcade: Whack-a-Mole tickets', what: 'Tickets per Whack-a-Mole round.', keys: ['whack', 'tickets', 'arcade'] },
  { id: 'arcadeMineReward', name: 'Arcade: Mine Walker tickets', what: 'Tickets per Mine Walker reward.', keys: ['mine walker', 'tickets', 'arcade'] },
  { id: 'arcadeMineRows', name: 'Arcade: Mine Walker rows per ticket', what: 'Endless rows needed for one ticket.', keys: ['mine walker', 'rows', 'tickets'] },
  { id: 'arcadeTicketCap', name: 'Arcade: tickets per day', what: 'The most tickets a student can earn in a day.', keys: ['tickets', 'limit', 'cap', 'max'] },
  { id: 'arcadeGameOfDayBonus', name: 'Arcade: game of the day bonus', what: 'Extra tickets for the game of the day.', keys: ['game of the day', 'bonus', 'tickets'] },
  { id: 'saveCls', name: 'Save class settings', what: 'Save the class settings above.', keys: ['save'] },
  { id: 'delCls', name: 'Delete class', what: 'Delete this class (asks first).', keys: ['delete class', 'remove class'] },
  { id: 'quizShowSteps', name: 'Quizzes: show steps', what: 'Show the worked steps in station quizzes.', keys: ['quiz', 'steps'] },
  { id: 'quizPassPct', name: 'Quiz and test pass mark', what: 'The percent needed to pass a quiz or test.', keys: ['pass mark', 'passing score', 'percent', 'quiz', 'test'] },
  { id: 'quizPerSkill', name: 'Station quizzes: questions per skill', what: 'Questions per skill in a station quiz.', keys: ['quiz', 'questions', 'length'] },
  { id: 'quizMin', name: 'Station quizzes: fewest questions', what: 'The fewest questions in a station quiz.', keys: ['quiz', 'minimum'] },
  { id: 'quizMax', name: 'Station quizzes: most questions', what: 'The most questions in a station quiz.', keys: ['quiz', 'maximum'] },
  { id: 'testPerSkill', name: 'Unit tests: questions per skill', what: 'Questions per skill in a unit test.', keys: ['test', 'questions', 'length'] },
  { id: 'testMin', name: 'Unit tests: fewest questions', what: 'The fewest questions in a unit test.', keys: ['test', 'minimum'] },
  { id: 'testMax', name: 'Unit tests: most questions', what: 'The most questions in a unit test.', keys: ['test', 'maximum'] },
  { id: 'reviewPerfect', name: 'Review must be perfect', what: 'The test review must be all right before the test.', keys: ['review', 'perfect', 'test'] },
  { id: 'requireQuiz', name: 'Require quizzes', what: 'Station quizzes must be passed to move on.', keys: ['quiz', 'require'] },
  { id: 'saveQuizSettings', name: 'Save quiz settings', what: 'Save the quiz and test settings.', keys: ['save', 'quiz'] },
  { id: 'resetQuizSettings', name: 'Reset quiz settings', what: 'Put the quiz and test settings back to the defaults.', keys: ['reset', 'default', 'quiz'] },
  { id: 'drillEnabled', name: 'Practice pop-ups (drills)', what: 'Short practice pop-ups on the earliest step of a problem.', keys: ['drill', 'pop up', 'popups', 'practice pop ups'] },
  { id: 'drillTypes', name: 'Practice pop-ups: drill types', what: 'Which kinds of practice pop-ups can show.', keys: ['drill', 'pop up', 'types'], sel: '[data-drill-type]' },
  { id: 'triggerMiss', name: 'Pop-ups after a miss', what: 'Show a practice pop-up after a wrong answer.', keys: ['drill', 'miss', 'wrong'] },
  { id: 'triggerSlow', name: 'Pop-ups when slow', what: 'Show a practice pop-up when a step is slow.', keys: ['drill', 'slow'] },
  { id: 'triggerSprint', name: 'Pop-ups from Fact Sprint', what: 'Use Fact Sprint misses for practice pop-ups.', keys: ['drill', 'sprint'] },
  { id: 'slowMode', name: 'Slow timing', what: 'How “slow” is decided for pop-ups.', keys: ['slow', 'timing'] },
  { id: 'slowIdea', name: 'Slow timing: idea steps', what: 'Seconds before an idea step counts as slow.', keys: ['slow', 'seconds'] },
  { id: 'slowArith', name: 'Slow timing: arithmetic steps', what: 'Seconds before an arithmetic step counts as slow.', keys: ['slow', 'seconds'] },
  { id: 'slowSprint', name: 'Slow timing: sprint facts', what: 'Seconds before a sprint fact counts as slow.', keys: ['slow', 'sprint'] },
  { id: 'readSeconds', name: 'Reading time allowance', what: 'Extra seconds for reading the problem.', keys: ['reading', 'seconds', 'allowance', 'read first'] },
  { id: 'maxPerShift', name: 'Most pop-ups per shift', what: 'The most practice pop-ups in one shift.', keys: ['drill', 'limit', 'max'] },
  { id: 'saveDrills', name: 'Save pop-up settings', what: 'Save the practice pop-up settings.', keys: ['save', 'drill'] },
  { id: 'resetDrills', name: 'Reset pop-up settings', what: 'Put the practice pop-up settings back to the defaults.', keys: ['reset', 'default', 'drill'] }
];

export const TEACHER_FAQ: { id: string; title: string; text: string; keys: string[]; go?: string; intents?: HelpIntent[]; boost?: number }[] = [
  { id: 'addStudents', title: 'Add students', text: 'Roster tab → type names (one per line) → Add. Each student gets a PIN; print the PIN cards for them.', keys: ['add student', 'new student', 'enroll', 'names', 'add'], go: 'tab:roster', intents: ['how'] },
  { id: 'resetPin', title: 'Reset a PIN', text: 'Roster tab → find the student → Reset PIN. The new PIN shows on screen and on their PIN card. A locked-out student can be unlocked there too.', keys: ['reset pin', 'forgot pin', 'new pin', 'change pin', 'pin', 'locked', 'locked out', 'cant log in', 'cant sign in'], go: 'tab:roster', intents: ['how'] },
  { id: 'look', title: 'See a student’s town (👀 Look)', text: 'Roster tab → 👀 Look next to a student opens their town in a new tab. Nothing you do there is saved.', keys: ['look', 'look only', 'see student', 'view as student', 'student view'], go: 'tab:roster', intents: ['how'] },
  { id: 'resetStudent', title: 'Reset a student’s progress', text: 'Roster tab → the student’s row → Reset progress (asks first). This can’t be undone.', keys: ['reset progress', 'start over', 'clear progress', 'reset student'], go: 'tab:roster', intents: ['how'] },
  { id: 'openUnit', title: 'Open a unit for the class', text: 'Settings → open units: turn on a later unit to open it for everyone without the unit test.', keys: ['open unit', 'unlock unit', 'skip unit', 'unlock'], go: 'setting:unitToggles', intents: ['how', 'on'] },
  { id: 'grades', title: 'Grades and reports', text: 'Dashboard → tap a student for their page: grades, struggles, practice time, transcript and Ledger.', keys: ['grade', 'report', 'progress', 'transcript', 'ledger', 'struggle', 'scores'], go: 'tab:dashboard', intents: ['how', 'where'], boost: 1.15 },
  { id: 'pinRule', title: 'Why tests ask for a PIN', text: 'Every test review and test needs a grown-up’s PIN (no skip, only Cancel). It’s an owner rule so a test is always supervised. The PIN is the teacher lock PIN set with 🔒 at the top.', keys: ['test pin', 'grown up pin', 'why pin', 'supervise', 'test'], intents: ['what', 'how'] },
  { id: 'teacherLock', title: 'Teacher lock PIN', text: 'Tap 🔒 at the top to set a PIN on this computer so a student can’t open the teacher app. Forgot it? Sign in again with your email.', keys: ['lock', 'teacher pin', 'lock app', 'grown up pin', 'forgot pin'], intents: ['how'] },
  { id: 'newClass', title: 'Make a new class', text: 'On the left, type a class name and tap Add class. It opens Quick setup.', keys: ['new class', 'add class', 'create class', 'another class'], intents: ['how'] },
  { id: 'classCode', title: 'Class code', text: 'The class code is at the top right of every tab. Students type it to join, or use the 🐾 Student view link.', keys: ['classcode', 'join', 'code', 'student link'], go: 'setting:copyJoin', intents: ['what', 'where'] },
  { id: 'tour', title: '🧭 Take the tour', text: 'A one-minute walk around the teacher app: the dashboard, each student’s page, Waiting for a grown-up, the Roster, Settings and Quick setup. Skip it any time.', keys: ['tour', 'show me around', 'how does this work', 'guide', 'walkthrough', 'new here', 'getting started tour'], go: 'tour:teacher', intents: ['how', 'what', 'where'] },
  { id: 'messages', title: 'Messages and ✋ questions', text: 'Student questions show as ✋ alerts on the Dashboard and on the student’s page. Answer there to reopen what they asked about.', keys: ['message', 'chat', 'question', 'alert', 'hand', 'help request'], go: 'tab:dashboard', intents: ['how', 'where'] }
];

/* Quinn's shared list (src/teacher/settingsList.ts: id, kind, group, emoji, name, what, where, settingsIds) → bot settings.
   Its entries and the bot's own control list both point at a Settings control, so the search folds them into one row. */
export interface SharedSetting { id: string; scope?: string; kind?: string; group?: string; emoji?: string; name: string; what: string; where?: string; quick?: boolean; settingsIds?: string[] }
export function fromSharedSettings(list: SharedSetting[], groups: { id: string; name: string }[] = []): TeacherSetting[] {
  return list.map(s => {
    const where = s.where || '', group = groups.find(g => g.id === s.group)?.name || '';
    const sel = s.settingsIds?.[0] || (/^Lessons/.test(where) ? 'tab:lessons' : /^Vocabulary/.test(where) ? 'tab:vocab' : /^Dashboard/.test(where) ? 'tab:dashboard' : undefined);
    return { id: s.id, tab: 'shared', emoji: s.emoji, name: s.name, what: where ? `${s.what} (${where})` : s.what, keys: [group, s.id], sel: sel || 'tab:settings', toggle: s.kind === 'switch' };
  });
}

/* one setting per Arcade game, brain game, move and theme day, from the apps' own lists */
export function teacherItemSettings(data: { ARCADE_GAMES?: NamedThing[]; BRAIN_GAMES?: NamedThing[]; MOVES?: { id: string; name: string; emoji?: string }[]; THEME_DAYS?: { id: string; name: string; emoji?: string }[] }): TeacherSetting[] {
  const out: TeacherSetting[] = [];
  for (const g of data.ARCADE_GAMES || []) out.push({ id: 'arcade-game:' + g.id, emoji: g.emoji, name: `${g.name} (Arcade game)`, what: `Open or close ${g.name} for the class (Settings → Arcade, or 🧭 Quick setup → Arcade games).`, keys: [g.name, 'arcade', 'game', 'open', 'close'], sel: `[data-arcade-game="${g.id}"]` });
  for (const g of data.BRAIN_GAMES || []) out.push({ id: 'brain-game:' + g.id, emoji: g.emoji, name: `${g.name} (brain game)`, what: `Turn ${g.name} on or off in brain stretches (Settings → Brain stretches).`, keys: [g.name, 'brainstretch', 'brain game'], sel: `[data-brain-game="${g.id}"]` });
  for (const m of data.MOVES || []) out.push({ id: 'move:' + m.id, emoji: m.emoji, name: `${m.name} (stand-and-stretch move)`, what: `Turn the ${m.name} move on or off (Settings → Stand-and-stretch breaks).`, keys: [m.name, 'movebreak', 'move'], sel: `[data-move="${m.id}"]` });
  for (const t of data.THEME_DAYS || []) out.push({ id: 'theme:' + t.id, emoji: t.emoji, name: `${t.name} (theme day)`, what: `Turn ${t.name} on or off (Settings → Theme days).`, keys: [t.name, 'themedays', 'theme'], sel: `[data-themeday="${t.id}"]` });
  return out;
}

/* settings that are numbers, names or buttons, not on/off switches ("turn off" questions skip them) */
const NOT_SWITCHES = /^(openSetup|copyJoin|joinFallback|cName|cStation|cHome|minStations|themesWhen|moveMinutes|idleNudge|idlePause|insightsHour|arcadeCorsairRate|arcadeWhackTickets|arcadeMineReward|arcadeMineRows|arcadeTicketCap|arcadeGameOfDayBonus|saveCls|delCls|quizPassPct|quizPerSkill|quizMin|quizMax|testPerSkill|testMin|testMax|saveQuizSettings|resetQuizSettings|slowMode|slowIdea|slowArith|slowSprint|readSeconds|maxPerShift|saveDrills|resetDrills)$/;

export function teacherEntries(settings: TeacherSetting[], setupChoices: { id: string; emoji?: string; name: string; what: string }[] = []): HelpEntry[] {
  const out: HelpEntry[] = [];
  for (const t of TEACHER_TABS) out.push({ id: 'tab:' + t.id, kind: 'tab', title: t.name, emoji: t.emoji, text: t.text, keys: t.keys, go: 'tab:' + t.id, intents: ['where'] });
  for (const s of settings) out.push({ id: (s.tab === 'shared' ? 'shared:' : 'setting:') + s.id, kind: 'setting', title: s.name, emoji: s.emoji, text: s.what, keys: s.keys, go: s.sel?.startsWith('tab:') ? s.sel : 'sel:' + (s.sel || '#' + s.id), intents: NOT_SWITCHES.test(s.id) || s.toggle === false ? ['where', 'how'] : ['on', 'off', 'where', 'how'], boost: s.id.includes(':') ? 0.95 : 1 });
  for (const c of setupChoices) out.push({ id: 'setup:' + c.id, kind: 'setting', title: c.name, emoji: c.emoji, text: c.what + ' (Quick setup)', keys: ['quicksetup'], go: 'setup:' + c.id, intents: ['on', 'off'], boost: 0.9 });
  for (const f of TEACHER_FAQ) out.push({ id: 'faq:' + f.id, kind: 'faq', title: f.title, text: f.text, keys: f.keys, go: f.go, intents: f.intents, boost: f.boost });
  return out;
}
