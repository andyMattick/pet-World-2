/* Pet World Word Workshop (docs: VOCAB.md): the built-in word list, importing a list, and word mastery. No DOM here.
   Word entry: {w:'word', d:'kid-friendly definition', s:'example sentence with ___ where the word goes', set:'Set 1'}.
   The built-in list is Pet World's own: grade 4–6 academic words with our own definitions and sentences (never copied
   from a published program). Teachers (class game_settings.vocab) and parents (the save's vocab.home) add their own
   words, for example from a Wordly Wise lesson, and choose focus words; all words are in focus by default. */

const W = (set, w, d, s) => ({ w, d, s, set });
export const VOCAB_WORDS = [
  W('Set 1', 'analyze', 'to study something closely, part by part, to understand it', 'Scientists ___ each part of the water sample to learn what it contains.'),
  W('Set 1', 'compare', 'to look at how two or more things are alike and different', 'Let’s ___ the two maps to see which town is bigger.'),
  W('Set 1', 'contrast', 'to show how two things are different', 'The story ___s the noisy city with the quiet farm.'),
  W('Set 1', 'describe', 'to tell what something is like using details', 'Can you ___ the dog you saw at the park?'),
  W('Set 1', 'evidence', 'facts or details that show something is true', 'The muddy paw prints were ___ that the puppy had come inside.'),
  W('Set 1', 'predict', 'to say what you think will happen before it happens', 'Based on the dark clouds, I ___ it will rain soon.'),
  W('Set 1', 'summarize', 'to tell the most important ideas in a short way', 'Please ___ the chapter in three sentences.'),
  W('Set 1', 'infer', 'to figure something out from clues instead of being told', 'No one told me, but from her big smile I could ___ that she won.'),
  W('Set 1', 'explain', 'to make something clear by telling how or why', 'Can you ___ how you solved the problem?'),
  W('Set 1', 'identify', 'to find and name something', 'Use the field guide to ___ the bird.'),
  W('Set 2', 'abundant', 'more than enough; found in large amounts', 'Apples were ___ in the fall, so we made pies.'),
  W('Set 2', 'scarce', 'hard to find because there is very little', 'Water was ___ during the long drought.'),
  W('Set 2', 'fragile', 'easy to break or harm', 'Wrap the ___ glass ornaments in paper.'),
  W('Set 2', 'sturdy', 'strong and hard to break', 'We built a ___ table that could hold the heavy fish tank.'),
  W('Set 2', 'ancient', 'very, very old; from long ago', 'The museum has ___ pottery from Egypt.'),
  W('Set 2', 'modern', 'new, or from the present time', 'The ___ train is much faster than the old steam engine.'),
  W('Set 2', 'enormous', 'very large', 'The ___ pumpkin was too heavy for three people to lift.'),
  W('Set 2', 'minute', 'very, very small (said my-NOOT)', 'You need a magnifying glass to see the ___ letters.'),
  W('Set 2', 'reluctant', 'not wanting to do something', 'Max was ___ to jump into the cold lake.'),
  W('Set 2', 'eager', 'wanting very much to do something', 'Sam was ___ to open his birthday present.'),
  W('Set 3', 'cautious', 'careful to avoid danger or mistakes', 'Be ___ when you cross the icy sidewalk.'),
  W('Set 3', 'confident', 'sure that you can do something well', 'After practicing, she felt ___ about her speech.'),
  W('Set 3', 'curious', 'wanting to know or learn about something', 'I was ___ about what was inside the locked box.'),
  W('Set 3', 'generous', 'happy to give or share', 'Our ___ neighbor gave us tomatoes from her garden.'),
  W('Set 3', 'honest', 'telling the truth and not cheating', 'He was ___ and admitted he broke the vase.'),
  W('Set 3', 'patient', 'able to wait calmly without getting upset', 'Be ___; the cookies need ten more minutes.'),
  W('Set 3', 'persistent', 'keeping on trying even when it is hard', 'The ___ climber reached the top on her third try.'),
  W('Set 3', 'responsible', 'having the job of taking care of something or someone', 'Ana is ___ for feeding the fish every morning.'),
  W('Set 3', 'timid', 'shy and easily scared', 'The ___ rabbit hid behind its mother.'),
  W('Set 3', 'grateful', 'thankful for something', 'I am ___ for the help with my project.'),
  W('Set 4', 'accurate', 'correct and exact, with no mistakes', 'The weather report was ___; it rained just as it said.'),
  W('Set 4', 'approximate', 'close to the exact amount, but not exact', 'The ___ number of people at the game was 2,000.'),
  W('Set 4', 'estimate', 'to make a careful guess about an amount', 'Can you ___ how many jelly beans are in the jar?'),
  W('Set 4', 'calculate', 'to find an answer using math', 'Use multiplication to ___ the area of the rectangle.'),
  W('Set 4', 'pattern', 'something that repeats in a way you can predict', 'Red, blue, red, blue is a ___.'),
  W('Set 4', 'equivalent', 'equal in value or meaning', 'One half is ___ to two fourths.'),
  W('Set 4', 'interpret', 'to explain what something means', 'Can you ___ what the dog means when it wags its tail?'),
  W('Set 4', 'data', 'facts and numbers collected to learn something', 'We recorded the temperature ___ every hour.'),
  W('Set 4', 'survey', 'a set of questions you ask many people', 'Our class did a ___ about favorite lunches.'),
  W('Set 4', 'conclusion', 'what you decide after thinking about the facts', 'Our ___ was that plants grow faster in sunlight.'),
  W('Set 5', 'habitat', 'the place where a plant or animal naturally lives and finds what it needs', 'A pond is the ___ of frogs and turtles.'),
  W('Set 5', 'adapt', 'to change in order to fit a new place or situation', 'Animals ___ to the cold by growing thicker fur.'),
  W('Set 5', 'migrate', 'to move from one place to another, often with the seasons', 'Every fall, geese ___ south to warmer places.'),
  W('Set 5', 'predator', 'an animal that hunts other animals for food', 'The hawk is a ___ that hunts mice.'),
  W('Set 5', 'prey', 'an animal that is hunted for food', 'Mice are ___ for owls and hawks.'),
  W('Set 5', 'organism', 'any living thing', 'A bacterium is a tiny ___, and a whale is a giant one.'),
  W('Set 5', 'environment', 'everything around a living thing that affects it', 'Plants need a sunny ___ to grow well.'),
  W('Set 5', 'erosion', 'the slow wearing away of land by water, wind, or ice', 'Over millions of years, ___ carved the canyon.'),
  W('Set 5', 'nutrient', 'something in food that helps a living thing grow and stay healthy', 'Milk has calcium, a ___ that builds strong bones.'),
  W('Set 5', 'observe', 'to watch carefully to learn something', 'We ___d the caterpillar every day until it made a cocoon.'),
  W('Set 6', 'century', 'a period of 100 years', 'The old oak tree is more than a ___ old.'),
  W('Set 6', 'civilization', 'a large, organized society with cities, government, and culture', 'Ancient Egypt was a great ___ along the Nile.'),
  W('Set 6', 'culture', 'the beliefs, customs, and way of life of a group of people', 'Food, music, and holidays are part of a ___.'),
  W('Set 6', 'empire', 'a group of lands and peoples ruled by one powerful leader or government', 'The Roman ___ stretched across many countries.'),
  W('Set 6', 'trade', 'to give one thing to get another', 'Merchants would ___ cloth for spices.'),
  W('Set 6', 'tradition', 'a custom passed down from older people to younger people', 'Baking bread on holidays is a family ___.'),
  W('Set 6', 'artifact', 'an object made by people long ago', 'The clay pot with handles was the oldest ___ in the dig.'),
  W('Set 6', 'source', 'where information comes from', 'A diary from the war is a good ___ for historians.'),
  W('Set 6', 'conflict', 'a fight, struggle, or disagreement', 'The two kingdoms were in ___ over the river.'),
  W('Set 6', 'migration', 'a move by a group of people or animals to a new place', 'The ___ of monarch butterflies covers thousands of miles.'),
  W('Set 7', 'consequence', 'what happens because of something you did', 'Being late to the bus had a ___: we missed the field trip.'),
  W('Set 7', 'cooperate', 'to work together to get something done', 'If we ___, we can clean the room in five minutes.'),
  W('Set 7', 'determine', 'to find out or decide', 'Let’s ___ who will go first by flipping a coin.'),
  W('Set 7', 'essential', 'needed; very important', 'Water is ___ for all living things.'),
  W('Set 7', 'frequent', 'happening often', 'We make ___ trips to the library.'),
  W('Set 7', 'influence', 'to have an effect on someone or something', 'Good friends can ___ you to try new things.'),
  W('Set 7', 'obstacle', 'something that gets in the way', 'A fallen tree was the biggest ___ on our hike.'),
  W('Set 7', 'opinion', 'what someone thinks or believes, which may not be a fact', 'In my ___, summer is the best season.'),
  W('Set 7', 'reveal', 'to show or make known something that was hidden', 'The magician will ___ the card in your pocket.'),
  W('Set 7', 'require', 'to need', 'Most plants ___ sunlight and water.'),
  W('Set 8', 'astonished', 'very surprised', 'We were ___ when the tiny dog pulled the big sled.'),
  W('Set 8', 'distinct', 'clearly different or easy to notice', 'Each zebra has a ___ pattern of stripes.'),
  W('Set 8', 'drowsy', 'sleepy', 'The warm sun made the cat ___.'),
  W('Set 8', 'eventually', 'in the end, after some time', 'The rain ___ stopped, and we went outside.'),
  W('Set 8', 'hesitate', 'to stop for a moment because you are unsure', 'Don’t ___ to ask if you need help.'),
  W('Set 8', 'immense', 'huge; very great in size', 'The ocean seemed ___, stretching farther than we could see.'),
  W('Set 8', 'peculiar', 'strange or unusual', 'There was a ___ smell coming from the fridge.'),
  W('Set 8', 'rapid', 'very fast', 'The river’s ___ current swept the leaf away.'),
  W('Set 8', 'vivid', 'bright and clear, easy to picture', 'She painted the sunset in ___ oranges and pinks.'),
  W('Set 8', 'wander', 'to move around without a plan or a goal', 'We liked to ___ through the garden after dinner.'),
  W('Set 9', 'accomplish', 'to finish something successfully', 'We can ___ a lot if we start early.'),
  W('Set 9', 'demonstrate', 'to show how something works or is done', 'The coach will ___ the kick so we can copy her moves.'),
  W('Set 9', 'expand', 'to grow larger or spread out', 'A balloon will ___ when you blow air into it.'),
  W('Set 9', 'improve', 'to make or get better', 'Practice will ___ your free throws.'),
  W('Set 9', 'investigate', 'to look into something carefully to find the truth', 'The detective came to ___ the missing cake.'),
  W('Set 9', 'locate', 'to find where something is', 'I couldn’t ___ my shoes, so I looked under the bed.'),
  W('Set 9', 'perform', 'to do something, often in front of others', 'Our class will ___ a play for the parents.'),
  W('Set 9', 'protect', 'to keep safe from harm', 'Helmets ___ your head when you ride a bike.'),
  W('Set 9', 'survive', 'to stay alive through a hard or dangerous time', 'Cactuses ___ in the desert by storing water.'),
  W('Set 9', 'transform', 'to change completely', 'A caterpillar will ___ into a butterfly.'),
  W('Set 10', 'boundary', 'a line or edge that marks where something ends', 'The fence marks the ___ of our yard.'),
  W('Set 10', 'compromise', 'an agreement where each side gives up a little', 'We made a ___: I picked the movie and she picked the snack.'),
  W('Set 10', 'debate', 'a discussion where people give reasons for different sides', 'In the ___, one team argued for uniforms and the other argued against them.'),
  W('Set 10', 'emphasize', 'to show that something is especially important', 'Teachers ___ safety during science labs.'),
  W('Set 10', 'perspective', 'a way of seeing or thinking about something', 'From the bird’s ___, the city looked tiny.'),
  W('Set 10', 'precise', 'exact and careful', 'The builder took ___ measurements, down to the last millimeter.'),
  W('Set 10', 'relevant', 'connected to what is being talked about', 'Only include facts that are ___ to your topic.'),
  W('Set 10', 'sequence', 'the order in which things happen', 'Put the story events in the right ___.'),
  W('Set 10', 'significant', 'important or large enough to notice', 'Losing our best player made a ___ difference in the game.'),
  W('Set 10', 'thorough', 'careful and complete, with nothing left out', 'Do a ___ job cleaning your room.'),
];

export const VOCAB_LIMITS = { word: 40, def: 200, sentence: 200, list: 300 };
const clean = (text, max) => String(text ?? '').replace(/\s+/g, ' ').trim().replace(/'/g, '’').slice(0, max);
export const wordKey = word => String(word || '').trim().toLowerCase();

/* One entry, cleaned, or null. A sentence only counts if it has a ___ blank. */
export function validWord(entry){
  if (!entry || typeof entry !== 'object') return null;
  const w = clean(entry.w ?? entry.word, VOCAB_LIMITS.word), d = clean(entry.d ?? entry.definition ?? entry.def, VOCAB_LIMITS.def);
  if (!w || !d || /\s{2,}/.test(w)) return null;
  const s = clean(entry.s ?? entry.sentence, VOCAB_LIMITS.sentence);
  return { w, d, ...(s.includes('___') ? { s } : {}), ...(entry.set ? { set: clean(entry.set, 40) } : {}) };
}

/* Paste in a list: one word per line as "word - definition", "word: definition", "word<TAB>definition" or "word, definition"
   (a third part after another separator is an example sentence with ___), or a JSON array of {word, definition, set}.
   Headings put the words under them in a set: "Set: Lesson 4", "# Lesson 4", "Set 11:", "Lesson 4", "Unit 3: Ancient Egypt",
   or any short line ending in a colon. A heading can carry its words on the same line: "Set 11: abundant, scarce, fragile".
   Before any heading words go in "My words". Bullets and numbers at the start of a line ("1.", "•", "-", "[i]") are ignored.
   A word with no meaning yet ("abundant", "abundant -", or a list like "abundant, scarce, fragile") takes Pet World's meaning
   if the built-in list has the word; otherwise it comes back in `missing` so the screen can ask for its meaning.
   To add the word "set" itself, write it with a dash: "set - a group of things that go together". */
const BULLET = /^(?:[-*•▪◦·]+\s*|\d{1,3}[.)]\s*|\[[^\]\s]{0,3}\]\s*|\([a-z0-9]{1,3}\)\s+)/i;
const NAMED_SET = /^((?:set|lesson|unit|week|list|chapter)(?:\s+|\s*#\s*|(?=\d))[\w.]{1,12})\s*(?::\s*(.*))?$/i;
const SINGLE = /^[\p{L}][\p{L}'’-]{0,39}$/u;
function readHeading(t){
  const m = t.match(/^#+\s*(.+)$/) || t.match(/^set\s*:\s*(.+)$/i);
  if (m) return { set: m[1], rest: '' };
  const named = t.match(NAMED_SET);
  if (named) return { set: named[1], rest: (named[2] || '').trim() };
  const colon = t.match(/^([^:,\t]{1,40}):$/);
  return colon ? { set: colon[1], rest: '' } : null;
}
export function parseVocabImport(text){
  const raw = String(text || '').trim(), words = [], errors = [], missing = [];
  let set = '';
  if (!raw) return { words, errors, missing };
  if (/^\[\s*[{\]]/.test(raw)) {   // a JSON list (not a line that starts with a bullet like "[i]")
    try { for (const item of JSON.parse(raw)) { const v = validWord(item); if (v) words.push(v); else errors.push(`Skipped: ${JSON.stringify(item).slice(0, 60)}`); } return { words, errors, missing }; }
    catch { errors.push('That looked like JSON but couldn’t be read.'); return { words, errors, missing }; }
  }
  const builtIn = new Map(VOCAB_WORDS.map(v => [wordKey(v.w), v]));
  const bareWord = w => {
    const known = builtIn.get(wordKey(w)), entry = known ? validWord({ ...known, set: set || known.set }) : null;
    if (entry) words.push(entry);
    else if (!missing.some(m => wordKey(m.w) === wordKey(w))) missing.push({ w: clean(w, VOCAB_LIMITS.word), ...(set ? { set } : {}) });
  };
  /* one entry line; `listOf` is how many single words separated by commas count as a list of words with no meanings */
  const readLine = (t, listOf) => {
    const bare = t.replace(/\s*[-–—:,]\s*$/, '');
    if (SINGLE.test(bare)) { bareWord(bare); return; }
    const list = t.split(/\s*[,;]\s*/).filter(Boolean);
    if (!t.includes('\t') && !/ [-–—] /.test(t) && !t.includes(':') && list.length >= listOf && list.every(x => SINGLE.test(x))) { list.forEach(bareWord); return; }
    const parts = t.includes('\t') ? t.split('\t') : / [-–—] /.test(t) ? t.split(/ [-–—] /) : t.includes(':') ? t.split(/:(.*)/s).filter(x => x !== undefined && x !== '') : t.split(/,(.*)/s).filter(x => x !== undefined && x !== '');
    const [w, d, ...rest] = parts.map(p => p.trim().replace(/^"|"$/g, ''));
    const v = validWord({ w, d, s: rest.join(' '), set });
    if (v) words.push(v); else errors.push(`Skipped: “${t.slice(0, 60)}” (use word - definition)`);
  };
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim().replace(BULLET, '').trim(); if (!t || /^word\s*[,\t]\s*definition/i.test(t)) continue;
    const heading = readHeading(t);
    if (!heading) { readLine(t, 3); continue; }
    if (heading.rest && !/[,;\t]| [-–—] /.test(heading.rest) && !SINGLE.test(heading.rest)) { set = clean(`${heading.set}: ${heading.rest}`, 40); continue; }
    set = clean(heading.set, 40);
    if (heading.rest) readLine(heading.rest, 2);
  }
  return { words, errors, missing };
}
/* words still waiting for a meaning, written back as "word - " lines (under their set headings) for the import box */
export function missingLines(missing){
  const out = []; let set;
  for (const m of missing) {
    if ((m.set || '') !== set) { set = m.set || ''; if (set) out.push(`Set: ${set}`); }
    out.push(`${m.w} - `);
  }
  return out.join('\n');
}

/* The words a student practices: built-in (unless turned off), then the class's, then the family's; the same word
   once (a later list's definition wins). Focus: the family's choice, else the class's, else every word. */
export function vocabList({ classVocab, home } = {}){
  const useBuiltIn = classVocab?.builtIn !== false && home?.builtIn !== false;
  const byKey = new Map();
  for (const entry of [...(useBuiltIn ? VOCAB_WORDS : []), ...(classVocab?.words || []), ...(home?.words || [])]) {
    const v = validWord(entry); if (v) byKey.set(wordKey(v.w), { ...v, set: v.set || 'My words' });
  }
  const all = [...byKey.values()];
  const pickFrom = list => (Array.isArray(list) && list.length ? new Set(list.map(wordKey)) : null);
  const focusSet = pickFrom(home?.focus) || pickFrom(classVocab?.focus);
  const focus = focusSet ? all.filter(v => focusSet.has(wordKey(v.w))) : all;
  return { all, focus: focus.length ? focus : all };
}

/* Mastery from a word's answer history (1 right, 0 wrong, newest last): solid = last 3 right; close = mostly right. */
export function wordStatus(stat){
  const recent = Array.isArray(stat?.r) ? stat.r : [];
  if (!recent.length) return 'new';
  if (recent.length >= 3 && recent.slice(-3).every(Boolean)) return 'solid';
  return recent.filter(Boolean).length / recent.length >= 0.6 ? 'close' : 'work';
}
export const STATUS_TEXT = { new: 'Not seen yet', work: 'Needs practice', close: 'Getting there', solid: 'Solid' };
/* the word as written in a book or question, matched to a list word: "erupted" finds "erupt", "cities" finds "city" */
export function findWord(list, raw){
  const w = wordKey(raw).replace(/[’']s$/, ''), byKey = new Map(list.map(v => [wordKey(v.w), v]));
  const tries = [w, w.replace(/ies$/, 'y'), w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/ied$/, 'y'), w.replace(/ed$/, ''), w.replace(/d$/, ''), w.replace(/ing$/, ''), w.replace(/ing$/, 'e'), w.replace(/ly$/, '')];
  for (const t of tries) if (t && byKey.has(t)) return byKey.get(t);
  return null;
}
/* an example sentence from where the word was found, with ___ in its place (empty if the word isn't in it) */
export function blankSentence(ctx, word){
  const text = clean(ctx, VOCAB_LIMITS.sentence), re = new RegExp(`\\b${String(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return re.test(text) ? text.replace(re, '___') : '';
}
/* weaker words come up more often */
export const wordWeight = stat => ({ new: 3, work: 4, close: 2, solid: 1 })[wordStatus(stat)];

export function normalizeVocabState(v){
  const out = v && typeof v === 'object' ? v : {};
  const stats = {};
  for (const [k, s] of Object.entries(out.stats && typeof out.stats === 'object' ? out.stats : {}).slice(-VOCAB_LIMITS.list)) {
    if (k.length <= VOCAB_LIMITS.word && s && Array.isArray(s.r)) stats[k] = { r: s.r.slice(-8).map(x => (x ? 1 : 0)) };
  }
  const home = out.home && typeof out.home === 'object' ? out.home : {};
  /* words the student flagged while reading (highlight → 📌), waiting for a grown-up to add the meaning */
  const flagged = (Array.isArray(out.flagged) ? out.flagged : []).filter(f => f && typeof f.w === 'string' && /^[\p{L}][\p{L}'’-]{0,39}$/u.test(f.w.trim()))
    .map(f => ({ w: f.w.trim().toLowerCase(), ctx: clean(f.ctx, VOCAB_LIMITS.sentence), at: Number.isFinite(+f.at) ? +f.at : 0 })).slice(-60);
  /* words the student looked up with 📌 that were already on a list: they join practice and come up more often */
  const lookedUp = (Array.isArray(out.lookedUp) ? out.lookedUp : []).filter(f => f && typeof f.w === 'string' && f.w.length <= VOCAB_LIMITS.word)
    .map(f => ({ w: wordKey(f.w), at: Number.isFinite(+f.at) ? +f.at : 0 })).slice(-60);
  return {
    flagged, lookedUp, stats, sprintBest: Number.isFinite(+out.sprintBest) ? Math.max(0, Math.floor(+out.sprintBest)) : 0,
    home: { builtIn: home.builtIn !== false, words: (Array.isArray(home.words) ? home.words : []).map(validWord).filter(Boolean).slice(0, VOCAB_LIMITS.list),
      focus: (Array.isArray(home.focus) ? home.focus : []).map(wordKey).filter(Boolean).slice(0, VOCAB_LIMITS.list) }
  };
}

/* ---------- syllables and how to say them (docs/VOCAB.md, "Hearing the word") ----------
   For each built-in word: the dictionary syllable breaks to show ("an·a·lyze"), and the same syllables respelled
   so a computer voice says each one clearly when they are read one at a time ("an|uh|lize"). An optional third part
   is how to say the whole word when the plain spelling fools the voice (minute, meaning tiny, is "my noot"). */
const SYLLABLE_DATA = `analyze=an·a·lyze=an|uh|lize
compare=com·pare=kum|pair
contrast=con·trast=kon|trast
describe=de·scribe=dih|scribe
evidence=ev·i·dence=ev|ih|dense
predict=pre·dict=prih|dict
summarize=sum·ma·rize=sum|uh|rize
infer=in·fer=in|fur
explain=ex·plain=ex|plane
identify=i·den·ti·fy=eye|den|tih|fye
abundant=a·bun·dant=uh|bun|dent
scarce=scarce=scarce
fragile=frag·ile=fraj|ul
sturdy=stur·dy=stur|dee
ancient=an·cient=ain|shent
modern=mod·ern=mod|ern
enormous=e·nor·mous=ih|nor|mus
minute=mi·nute=my|noot=my noot
reluctant=re·luc·tant=rih|luck|tent
eager=ea·ger=ee|gur
cautious=cau·tious=caw|shus
confident=con·fi·dent=kon|fih|dent
curious=cu·ri·ous=kyoor|ee|us
generous=gen·er·ous=jen|ur|us
honest=hon·est=on|ist
patient=pa·tient=pay|shent
persistent=per·sis·tent=pur|sis|tent
responsible=re·spon·si·ble=rih|spon|sih|bul
timid=tim·id=tim|id
grateful=grate·ful=grate|ful
accurate=ac·cu·rate=ak|yur|it
approximate=ap·prox·i·mate=uh|prox|ih|mit
estimate=es·ti·mate=es|tih|mate
calculate=cal·cu·late=kal|kyoo|late
pattern=pat·tern=pat|urn
equivalent=e·quiv·a·lent=ih|kwiv|uh|lent
interpret=in·ter·pret=in|tur|prit
data=da·ta=day|tuh
survey=sur·vey=sur|vay
conclusion=con·clu·sion=kun|kloo|zhun
habitat=hab·i·tat=hab|ih|tat
adapt=a·dapt=uh|dapt
migrate=mi·grate=my|grate
predator=pred·a·tor=pred|uh|tur
prey=prey=pray
organism=or·gan·ism=or|guh|niz|um
environment=en·vi·ron·ment=en|vye|run|ment
erosion=e·ro·sion=ih|ro|zhun
nutrient=nu·tri·ent=noo|tree|ent
observe=ob·serve=ub|zurv
century=cen·tu·ry=sen|chur|ee
civilization=civ·i·li·za·tion=siv|uh|luh|zay|shun
culture=cul·ture=kul|chur
empire=em·pire=em|pire
trade=trade=trade
tradition=tra·di·tion=truh|dish|un
artifact=ar·ti·fact=ar|tih|fact
source=source=source
conflict=con·flict=kon|flict
migration=mi·gra·tion=my|gray|shun
consequence=con·se·quence=kon|sih|kwence
cooperate=co·op·er·ate=ko|op|ur|ate
determine=de·ter·mine=dih|tur|min
essential=es·sen·tial=ih|sen|shul
frequent=fre·quent=free|kwent
influence=in·flu·ence=in|floo|ence
obstacle=ob·sta·cle=ob|stuh|kul
opinion=o·pin·ion=uh|pin|yun
reveal=re·veal=rih|veel
require=re·quire=rih|kwire
astonished=as·ton·ished=uh|ston|isht
distinct=dis·tinct=dis|tinkt
drowsy=drow·sy=drow|zee
eventually=e·ven·tu·al·ly=ih|ven|choo|uh|lee
hesitate=hes·i·tate=hez|ih|tate
immense=im·mense=ih|mense
peculiar=pe·cul·iar=pih|kyool|yur
rapid=rap·id=rap|id
vivid=viv·id=viv|id
wander=wan·der=won|dur
accomplish=ac·com·plish=uh|kom|plish
demonstrate=dem·on·strate=dem|un|strate
expand=ex·pand=ik|spand
improve=im·prove=im|proov
investigate=in·ves·ti·gate=in|ves|tih|gate
locate=lo·cate=lo|kate
perform=per·form=pur|form
protect=pro·tect=pruh|tect
survive=sur·vive=sur|vive
transform=trans·form=trans|form
boundary=bound·a·ry=bown|duh|ree
compromise=com·pro·mise=kom|pruh|mize
debate=de·bate=dih|bate
emphasize=em·pha·size=em|fuh|size
perspective=per·spec·tive=pur|spek|tiv
precise=pre·cise=prih|sise
relevant=rel·e·vant=rel|uh|vent
sequence=se·quence=see|kwence
significant=sig·nif·i·cant=sig|nif|ih|kent
thorough=thor·ough=thur|oh`;
const SYLLABLES = new Map(SYLLABLE_DATA.split('\n').map(line => { const [w, show, say, whole] = line.split('='); return [w, { show: show.split('·'), say: say.split('|'), whole: whole || w }]; }));
export const SYLLABLE_WORDS = [...SYLLABLES.keys()];

/** A word's syllables to show and to say. Words without built-in data (a teacher's or a parent's own) are split by
    a simple vowel-group rule, and the voice says those pieces as written. */
export function syllablesOf(word){
  const key = String(word || '').trim().toLowerCase(), known = SYLLABLES.get(key);
  if (known) return { ...known, known: true };
  if (/\s/.test(key) || key.length < 4) return { show: [key], say: [key], whole: key, known: false };
  /* one consonant between vowels goes with the next syllable, two or more split after the first; a final silent e stays put */
  const DIGRAPHS = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'qu'], code = DIGRAPHS.reduce((s, d, i) => s.split(d).join(String.fromCharCode(0x2460 + i)), key);   // a digraph counts as one consonant
  const parts = [], re = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/g;
  let m; while ((m = re.exec(code)) && m[0]) parts.push(m[0].replace(/[\u2460-\u2467]/g, c => DIGRAPHS[c.charCodeAt(0) - 0x2460]));
  if (parts.join('') !== key || parts.length < 2) return { show: [key], say: [key], whole: key, known: false };
  const last = parts[parts.length - 1]; if (/^[^aeiouy]*e$/.test(last)) { parts.pop(); parts[parts.length - 1] += last; }
  return { show: parts, say: parts, whole: key, known: false };
}
