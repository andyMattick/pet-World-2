/* Pet World Word Workshop: 🐾 This Week's Paw Path (owner, Oct 30, 2026; docs/VOCAB.md "This week's word path").
   "She gets 20 a week with 5 distinct skills/games testing different parts of teaching the words and definitions, then
   Friday she proves her mastery and we move on." No DOM here, so scripts/check-word-path.mjs can test it on its own.

   The path: 5 skill nodes, unlocked in order, each a few short lessons (about 5 words each, so every skill covers all
   the week's words), then the 🏆 Friday node (the existing Friday mastery check, unchanged).
     👂 meet   Meet the words: hear it, see its meaning (and an example), then "which word means…"
     🔗 match  Match it: tap word ↔ meaning pairs, "what does … mean?", then a mixed board (3 of the lesson's words and
               2 others from this week) read from the meanings side
     🧩 build  Build it: word parts (build the word from part chips, what a part means, which word has a part); a word
               with no parts, in any language, is built from letter tiles, then "which one is spelled right?"
     ✏️ use    Use it: a NEW sentence (never the example she met), then a look-alike pair (taught, then asked both ways)
               or the Meet example with the word in it: "what does it mean in this sentence?"
     🔤 spell  Spell it: Listen first + type, then type it from the meaning
   Language-neutral: a word is data ({w, d, s, u?, pos?, lang?}). Nothing here assumes English except the built-in
   English data below (second sentences, parts of speech, look-alike items) and word parts (wordParts.js), which other
   languages don't have: their words get letter tiles, look-alike spellings and typed items instead, and wrong answers
   come only from words in the same language. A word with too few other words in its language for fair wrong answers
   gets a typed item, so every word is in every skill.

   Fair questions (CONTENT-RULES.md): every choice item has exactly one right answer; wrong answers are other words
   (same part of speech when there are enough), never a near-synonym of the answer (NEAR), never a word that appears
   in the prompt, never clashing with "a"/"an" before the blank; definitions offered as choices are picked close to the
   right one's length. scripts/check-word-path.mjs builds thousands of lessons and runs a test-wise bot on them. */
import { WORD_PARTS } from './wordParts.js';

export const PATH_SKILLS = [
  { id: 'meet', emoji: '👂', name: 'Meet the words', short: 'Meet', how: 'Hear each word, see what it means, then tap the word that matches.' },
  { id: 'match', emoji: '🔗', name: 'Match it', short: 'Match', how: 'Tap a word, then the meaning that goes with it.' },
  { id: 'build', emoji: '🧩', name: 'Build it', short: 'Build', how: 'Put words together from their parts and learn what the parts mean.' },
  { id: 'use', emoji: '✏️', name: 'Use it', short: 'Use', how: 'Use each word in new sentences and pick it over a look-alike word.' },
  { id: 'spell', emoji: '🔤', name: 'Spell it', short: 'Spell', how: 'Listen to each word and type it, then type it from its meaning.' },
];
export const SKILL_IDS = PATH_SKILLS.map(s => s.id);
export const skillInfo = id => PATH_SKILLS.find(s => s.id === id) || null;
export const LESSON_WORDS = 5, XP_LESSON = 10, XP_PERFECT = 5;
const key = w => String(w || '').trim().toLowerCase();
/* a word's language: its first tag ("es-MX" → "es"); no language means English */
export const langOf = v => String(v?.lang || 'en').split('-')[0].toLowerCase();
const isEnglish = v => langOf(v) === 'en';
const sameLang = (a, b) => langOf(a) === langOf(b);

/* ---------- built-in data: part of speech and a second sentence for every built-in word ----------
   pos: v verb, n noun, a adjective, r adverb. The second sentence (u) is never the example she sees in Meet the words
   or the flashcards; the blank is the plain word (no -s or -ed), and no "a"/"an" sits right before it. */
const PD = `analyze|v|Before writing her report, Mia will ___ the bug, looking at its legs, wings and eyes one at a time.
compare|v|Let’s ___ the two puppies to see how they are alike and how they are different.
contrast|v|In her poem, she wants to ___ the hot desert with the icy pole to show how different they are.
describe|v|Use your five senses to ___ the beach: the warm sand, the salty smell, the loud waves.
evidence|n|The detective found ___ that the cat ate the fish: bones under the couch and a smell of tuna.
predict|v|Look at the cover and ___ what will happen in the story before you start reading.
summarize|v|In just two sentences, ___ the main idea of the movie for your little brother.
infer|v|Nobody said Dad was tired, but from his yawns we could ___ that he needed a nap.
explain|v|Can you ___ why the ice melted, so the whole class understands how it happened?
identify|v|The ranger helped us ___ the snake by naming it from the stripes on its back.
abundant|a|Berries were so ___ on the hill that we filled ten buckets and left plenty for the birds.
scarce|a|Food was ___ in winter, so the deer searched for hours to find a few bites.
fragile|a|The bird’s egg is ___, so hold it gently or it will crack.
sturdy|a|The tree house is ___ enough to hold four kids without even shaking.
ancient|a|Scientists studied ___ bones that were thousands of years old.
modern|a|Our school has ___ laptops that came out just this year.
enormous|a|The whale was so ___ that it was longer than our school bus.
minute|a|The ___ seed was so small that I could barely see it on my fingertip.
reluctant|a|The puppy was ___ to take a bath and hid under the bed when it saw the tub.
eager|a|The kids were ___ to start the game and kept asking, “Can we play now?”
cautious|a|The ___ hiker tested each rock with her foot before stepping on it.
confident|a|After weeks of practice, Leo felt ___ that he could play the song without a mistake.
curious|a|The ___ kitten sniffed every box in the room to find out what was inside.
generous|a|Our ___ coach shared her snacks with the whole team after the game.
honest|a|Be ___ and tell the truth, even when it’s hard.
patient|a|Fishing takes someone ___ who can sit calmly for hours waiting for a bite.
persistent|a|The ___ woodpecker kept pecking at the tree all day until it made a hole.
responsible|a|Since Kim is ___ for the class plant, she waters it every Monday.
timid|a|The ___ mouse peeked out of its hole and ran back in at the smallest sound.
grateful|a|We were so ___ for the ride home in the rain that we wrote the driver a thank-you note.
accurate|a|Her map was ___: every street and park was in exactly the right place.
approximate|a|The ___ length of the trail is two miles, give or take a little.
estimate|v|Without counting, ___ how many people are in the crowd.
calculate|v|Add the prices to ___ how much the three books cost.
pattern|n|The tiles go blue, white, blue, white, so the ___ repeats across the whole floor.
equivalent|a|Four quarters are ___ to one dollar because they have the same value.
interpret|v|Can you ___ this graph and tell us what it means?
data|n|The class collected ___ on how many hours each student sleeps, then made a chart of the numbers.
survey|n|We gave every family on our street the same ___ with five questions about recycling.
conclusion|n|After testing all three paper airplanes, our ___ was that the heaviest one flew farthest.
habitat|n|The polar bear’s ___ is the cold Arctic, where it finds ice, water and seals.
adapt|v|When we moved to a hot city, it took weeks for our dog to ___ to the heat.
migrate|v|Whales ___ thousands of miles each year to reach warm water for the winter.
predator|n|The fox is the ___ that hunts the rabbits in this field.
prey|n|Small fish are ___ for the hungry heron.
organism|n|Every ___ in the pond, from the tiny algae to the big turtle, is alive.
environment|n|Fish need a clean ___ with fresh water all around them to stay healthy.
erosion|n|Waves crashing on the cliff caused ___, wearing the rock away little by little.
nutrient|n|Spinach gives your body iron, an important ___ for healthy blood.
observe|v|Sit quietly by the feeder and ___ the birds to learn what they eat.
century|n|The oak tree in the park is more than one ___ old; it was planted when my great-great-grandpa was a baby.
civilization|n|The Maya built cities, roads and temples and had kings and writing: they were one great ___.
culture|n|Dancing, stories and special foods are all part of our family’s ___.
empire|n|One emperor ruled many countries, so his ___ stretched across the whole map.
trade|v|At lunch, I’ll ___ my apple for your crackers.
tradition|n|Every year we plant a tree on the first day of spring; it’s our family ___.
artifact|n|The arrowhead we dug up is an old ___ made by people who lived here long ago.
source|n|For your report, use a book or a website as your ___ of facts, and write down where you found them.
conflict|n|The ___ between the two neighbors over the fence turned into a big argument.
migration|n|Every spring, the ___ of the birds brings them back north.
consequence|n|If you don’t study, the ___ might be a low grade on the test.
cooperate|v|The two teams had to ___ to lift the heavy log together.
determine|v|We used a thermometer to ___ how hot the water was.
essential|a|Oxygen is ___ for breathing; we can’t live without it.
frequent|a|We take ___ breaks, about one every ten minutes.
influence|v|Bright ads can ___ what snacks kids want to buy.
obstacle|n|The fallen log was the only ___ blocking our bike path.
opinion|n|In my ___, pizza is the best food, but you might think tacos are better.
reveal|v|Pull off the cloth to ___ the surprise hidden underneath.
require|v|Fish ___ clean water, so we change it every week.
astonished|a|Grandpa was ___ when he opened the door and saw the whole family yelling “Surprise!”
distinct|a|Each bird has its own ___ song, so you can tell them apart by listening.
drowsy|a|After the long car ride, the baby was so ___ that her eyes kept closing.
eventually|r|We waited and waited, and ___ the bus came around the corner.
hesitate|v|Did you ___ at the top of the slide before going down?
immense|a|The mountain was ___, rising so high that clouds covered its top.
peculiar|a|Our cat’s habits are ___: she sleeps in the sink, and of all the bowls in the house, she will only drink out of a teacup.
rapid|a|The cheetah’s ___ run lets it catch up to almost any animal.
vivid|a|Her dream was so ___ that she could remember every bright color and sound.
wander|v|On Saturday we like to ___ around the market with no plan, just looking.
accomplish|v|If you work a little every day, you can ___ your goal of reading twenty books.
demonstrate|v|Our science teacher will ___ how a volcano erupts by showing us a model.
expand|v|Put the bread dough in a warm place, and in an hour it will ___ to twice its size.
improve|v|If you read every night, your spelling scores will ___ from 6 out of 10 to 9 out of 10.
investigate|v|For a whole month, the scientists will ___ the lake, testing the water and studying the sick fish to learn what is wrong.
locate|v|Use the map to ___ the closest library.
perform|v|The band will ___ three songs on stage tonight.
protect|v|Sunscreen will ___ your skin from a bad sunburn.
survive|v|Camels can ___ for days in the desert without drinking water.
transform|v|With paint and new curtains, we will ___ the plain room into a jungle.
boundary|n|The river forms the ___ between the two states.
compromise|n|Neither of us got everything we wanted, but we reached a fair ___: we each picked one game.
debate|n|During the class ___, each team gave reasons for its side about longer recess.
emphasize|v|Use bold letters to ___ the most important rule on the sign.
perspective|n|From the ant’s ___, the puddle looked like a giant lake.
precise|a|Medicine needs ___ measuring, down to the exact drop.
relevant|a|A fact about sharks is not ___ to your report on birds.
sequence|n|Follow the ___ of the steps: first mix, then pour, then bake.
significant|a|The difference was ___: after we planted a hundred trees, the bare hill turned green.
thorough|a|The vet’s checkup was ___: she looked at the puppy’s eyes, ears, teeth and paws.
prepare|v|Let’s ___ for the trip by packing our bags the night before.
prevent|v|Washing your hands can ___ a cold from spreading.
previous|a|I liked this book more than the ___ one I read last week.
perhaps|r|Bring an umbrella; ___ it will rain this afternoon.
permit|v|Our library does not ___ food near the computers.
persuade|v|I gave three good reasons to ___ Mom to let us stay up late.
produce|v|Bees ___ honey inside their hive.
promise|v|I ___ I will give your book back by Friday.
believe|v|I ___ that you can win the race if you keep practicing.
receive|v|You will ___ a medal if you finish the race.
neighbor|n|Our ___ next door lent us her ladder.
piece|n|Can I have one ___ of your orange?
ceiling|n|The balloon floated up and stuck to the ___ of the room.
field|n|The horses ran across the open ___ of grass.
necessary|a|Is it ___ to bring a coat, or will it be warm?
tomorrow|r|Pack your swimsuit tonight, because we leave for the beach ___ morning.
occasion|n|Her graduation was a special ___, so the whole family came.
address|n|Write your street and city on the envelope so the letter goes to the right ___.
success|n|After many tries, the rocket launch was finally one big ___.
beginning|n|The ___ of the movie was slow, but the end was exciting.
important|a|It is ___ to wear a helmet when you ride your bike.
different|a|The twins look alike, but they have ___ favorite colors.
patience|n|Building the puzzle took lots of ___ because it had a thousand pieces.
distance|n|The ___ from my house to school is about one mile.
excellent|a|Your science project was ___; it won first prize!
assistant|n|The chef’s ___ chopped the onions to help.
comfortable|a|The soft couch is so ___ that I fell asleep on it.
possible|a|Is it ___ to see the moon in the daytime? Look up on a clear morning and you might spot it.
valuable|a|The gold ring is ___, so keep it in a safe place.
visible|a|On a clear night, many stars are ___ in the sky.
terrible|a|The storm was ___ and knocked down three trees.
reliable|a|Our old car is ___; it starts every single morning.
question|n|Mia wrote her ___ on a sticky note for the scientist: “Why do cats purr?”
vacation|n|We went camping for a week on our summer ___.
decision|n|Choosing between the two puppies was a hard ___.
television|n|We watched the parade on ___ because it was too cold to go.
musician|n|The ___ played the guitar and sang at the party.
attention|n|The teacher clapped to get the class’s ___.
circle|n|We sat in one big ___ so everyone could see each other’s faces.
notice|v|Did you ___ that the bird’s feathers changed color?
decide|v|You have to ___ between the red bike and the blue one.
concert|n|We bought tickets to the ___ to hear the orchestra play.
cycle|n|The moon’s phases are one ___ that repeats every month.`;
export const PATH_DATA = Object.fromEntries(PD.split('\n').map(line => { const [w, pos, u] = line.split('|'); return [w, { pos, u }]; }));
/* Near-synonyms (or meanings close enough to confuse): never wrong answers for each other, never on the same lesson
   board. Checked by hand against the built-in definitions in vocab.js. */
export const NEAR = [
  ['enormous', 'immense'], ['compare', 'contrast'], ['estimate', 'approximate'], ['accurate', 'precise'], ['precise', 'thorough'],
  ['migrate', 'migration'], ['migrate', 'wander'], ['data', 'evidence'], ['conflict', 'debate'], ['essential', 'significant'], ['essential', 'require'],
  ['determine', 'identify'], ['determine', 'investigate'], ['determine', 'locate'], ['identify', 'locate'], ['analyze', 'investigate'], ['analyze', 'observe'], ['investigate', 'observe'],
  ['explain', 'interpret'], ['explain', 'demonstrate'], ['explain', 'describe'], ['reveal', 'demonstrate'], ['reluctant', 'hesitate'], ['timid', 'reluctant'],
  ['patient', 'patience'], ['eager', 'curious'], ['peculiar', 'distinct'], ['civilization', 'culture'], ['civilization', 'empire'], ['culture', 'empire'],
  ['culture', 'tradition'], ['habitat', 'environment'], ['adapt', 'transform'], ['accomplish', 'perform'], ['accomplish', 'success'], ['opinion', 'perspective'],
  ['cooperate', 'compromise'], ['prevent', 'protect'], ['persuade', 'influence'], ['necessary', 'essential'], ['necessary', 'require'],
  ['important', 'essential'], ['important', 'significant'], ['different', 'distinct'], ['visible', 'distinct'], ['reliable', 'honest'], ['reliable', 'responsible'],
  ['decision', 'conclusion'], ['decide', 'determine'], ['notice', 'observe'], ['cycle', 'pattern'], ['cycle', 'circle'], ['sequence', 'pattern'],
  ['consequence', 'conclusion'], ['estimate', 'calculate'], ['predict', 'infer'], ['predict', 'estimate'], ['source', 'evidence'], ['survey', 'data'],
  ['question', 'survey'], ['trade', 'tradition'], ['predator', 'prey'], ['cautious', 'timid'], ['generous', 'grateful'], ['patient', 'persistent'],
  ['expand', 'improve'], ['frequent', 'rapid'], ['vivid', 'visible'], ['summarize', 'describe'], ['abundant', 'enormous'], ['permit', 'require'],
  ['ancient', 'previous'], ['valuable', 'important'], ['excellent', 'significant'], ['astonished', 'curious'], ['field', 'habitat'], ['boundary', 'distance'],
];
const nearMap = new Map();
for (const [a, b] of NEAR) { (nearMap.get(a) || nearMap.set(a, new Set()).get(a)).add(b); (nearMap.get(b) || nearMap.set(b, new Set()).get(b)).add(a); }
export const isNear = (a, b) => !!nearMap.get(key(a))?.has(key(b));

/* Word vs near-synonym: a sentence where only the word fits, and why (shown after she answers). */
const NU = `compare|contrast|Let’s ___ the two cats to see how they are alike.|Compare looks at how things are alike (and different); contrast is only how they differ.
contrast|compare|Can you ___ the two cities and show only how they differ?|Contrast is only about differences; compare also looks for what is alike.
abundant|enormous|Rain was ___ this spring, so there was more than enough water for every garden.|Abundant means there is plenty of something; enormous means very big in size.
enormous|abundant|The ___ elephant was taller than the truck.|Enormous is about size; abundant means there is more than enough of something.
accurate|approximate|Your answer must be ___, with no mistakes at all.|Accurate means exactly right; approximate means close but not exact.
approximate|accurate|We don’t need the exact number; an ___ count is fine.|Approximate means close but not exact; accurate means exactly right.
estimate|calculate|Without doing the math, ___ how many beans are in the jar.|You estimate with a careful guess; you calculate when you work out the exact answer.
calculate|estimate|Use the exact prices to ___ the total, down to the penny.|Calculate means work out the exact answer; estimate is a careful guess.
predator|prey|The owl is the ___ hunting the mouse.|The predator does the hunting; the prey is the animal being hunted.
prey|predator|The mouse is the ___ that the owl is hunting.|Prey is the animal being hunted; the predator is the hunter.
timid|cautious|The ___ boy was too shy to say hello to the new kids.|Timid means shy and easily scared; cautious means careful to stay safe.
cautious|timid|A ___ driver slows down on icy roads to stay safe.|Cautious means careful about danger; timid means shy and easily scared.
curious|eager|I was ___ about how the magician did the trick, so I read about it.|Curious means wanting to know or find out; eager means wanting very much to do something.
eager|curious|The dog was ___ to go on the walk and waited by the door with its leash.|Eager means wanting very much to do something; curious means wanting to know.
migrate|wander|Each fall, the butterflies ___ south, the same way every year.|Migrate means a planned move with the seasons; wander means moving around with no plan.
wander|migrate|We let the goats ___ around the farm wherever they liked.|Wander means moving around with no plan; migrate is a move to another place, often with the seasons.
infer|predict|From the wet umbrella by the door, I ___ that it rained while I was asleep.|You infer what already happened from clues; you predict what will happen next.
predict|infer|Before the game starts, ___ which team will win.|You predict what will happen later; you infer something from clues.
describe|summarize|___ the puppy in lots of detail: its fur, its ears and its tail.|Describe means tell what it is like with details; summarize means give only the main ideas.
summarize|describe|In one short sentence, ___ the whole book.|Summarize means give just the main ideas in a short way; describe means tell lots of details.
frequent|rapid|We make ___ trips to the park, almost every day.|Frequent means happening often; rapid means very fast.
rapid|frequent|The ___ river carried the boat downstream in seconds.|Rapid means very fast; frequent means happening often.
precise|thorough|Give me the ___ time: 3:07, not just “about three.”|Precise means exact; thorough means careful and complete, with nothing left out.
thorough|precise|Do a ___ search, checking every room and every drawer.|Thorough means complete, with nothing left out; precise means exact.
generous|grateful|The ___ girl gave half her lunch to a friend.|Generous means happy to give; grateful means thankful for what you get.
grateful|generous|I am ___ for your help, so thank you!|Grateful means thankful; generous means happy to give.
patient|persistent|Be ___ and wait quietly for your turn.|Patient means waiting calmly; persistent means not giving up.
persistent|patient|The ___ puppy kept scratching at the door until we let it in.|Persistent means you keep trying and don’t give up; patient means waiting calmly.
adapt|transform|Lizards ___ to the desert heat by hiding under rocks at noon.|Adapt means change to fit a place; transform means change completely into something else.
transform|adapt|The caterpillar will ___ into a butterfly, changing completely.|Transform means change completely; adapt means change to fit a new place.
identify|locate|Can you ___ this leaf? Tell me what kind of tree it’s from.|Identify means find out and name what something is; locate means find where it is.
locate|identify|I can’t ___ my keys; do you know where they are?|Locate means find where something is; identify means name what it is.
debate|conflict|In the class ___, each side gave three reasons for its view.|A debate is a discussion with reasons for each side; a conflict is a fight or struggle.
conflict|debate|The ___ between the two kingdoms turned into a long war.|A conflict is a fight or struggle; a debate is a discussion with reasons.
consequence|conclusion|Missing the bus had a ___: I was late for school.|A consequence is what happens because of something; a conclusion is what you decide after thinking.
conclusion|consequence|After reading all the clues, the detective came to a ___: the butler did it.|A conclusion is what you decide from the facts; a consequence is what happens because of something.
expand|improve|The balloon will ___ as you fill it with air.|Expand means get bigger; improve means get better.
improve|expand|Practice will ___ your handwriting, making it neater.|Improve means make better; expand means make bigger.
prevent|protect|Brushing your teeth can ___ cavities from forming.|Prevent means stop something from happening; protect means keep something safe.
protect|prevent|A fence will ___ the garden from hungry rabbits.|Protect means keep something safe from harm; prevent means stop something from happening.
circle|cycle|Draw a ___ around the right answer.|A circle is a round shape; a cycle is a set of events that repeats.
cycle|circle|Spring, summer, fall, winter: the seasons are a ___ that repeats.|A cycle is a set of events that repeats; a circle is a round shape.
visible|vivid|The island was ___ from the boat, far away but easy to see.|Visible means able to be seen; vivid means bright and clear.
vivid|visible|Her painting used ___ colors, bright and bold.|Vivid means bright and strong; visible only means you can see it.`;
export const NUANCE = Object.fromEntries(NU.split('\n').map(line => { const [w, near, s, why] = line.split('|'); return [w, { near, s, why }]; }));

/* ---------- a word as the path sees it ---------- */
/* part of speech: the word's own `pos`, the built-in data, or a guess from an English definition ("to …" is a verb);
   '' when unknown (then any word can be a wrong answer next to it) */
export function posOf(v){
  const own = String(v?.pos || '').toLowerCase(); if (/^[vnar]$/.test(own)) return own;
  const known = PATH_DATA[key(v?.w)]; if (known) return known.pos;
  if (!v?.lang || /^en/i.test(v.lang)) { if (/^to\s/i.test(String(v?.d || ''))) return 'v'; if (/^(a|an|the|someone|something)\s/i.test(String(v?.d || ''))) return 'n'; }
  return '';
}
/* {key, w, d, s, u, pos, lang}: `u` is a second sentence (the word's own `u`, or the built-in one), never the example */
export function pathWord(v){
  const k = key(v?.w), data = PATH_DATA[k];
  const u = typeof v?.u === 'string' && v.u.includes('___') ? v.u : data && (!v.lang || /^en/i.test(v.lang)) ? data.u : '';
  return { key: k, w: String(v?.w || ''), d: String(v?.d || ''), s: typeof v?.s === 'string' && v.s.includes('___') ? v.s : '', u: u && u !== v?.s ? u : '', pos: posOf(v), lang: v?.lang || '' };
}

/* ---------- small helpers ---------- */
export function seededRand(seed){
  let h = 1779033703 ^ String(seed).length;
  for (const ch of String(seed)) { h = Math.imul(h ^ ch.charCodeAt(0), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const shuffleR = (rand, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* the start of a word that counts as "the word" showing up in a prompt (predict → predi, survive → survi, data → data) */
export const stemOf = w => { const k = key(w); return k.length <= 5 ? k : k.slice(0, Math.max(5, k.length - 3)); };
export function mentions(text, word){
  const st = stemOf(word); if (!st) return false;
  return new RegExp(`(^|[^\\p{L}])${st.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'iu').test(String(text || ''));
}
/* "a ___" needs a word starting with a consonant sound, "an ___" a vowel (a simple first-letter rule) */
function articleBefore(sentence){ const m = String(sentence).match(/\b(a|an|A|An)\s+_{3}/); return m ? m[1].toLowerCase() : ''; }
const vowelStart = w => /^[aeiou]/i.test(String(w));
const articleOk = (art, w) => !art || (art === 'an' ? vowelStart(w) : !vowelStart(w));
export const fillBlank = (sentence, w) => String(sentence).replace(/_{3}/, m => w).replace(/^([a-z])/, c => c.toUpperCase());
/* part meanings without the notes in brackets: "equal (Latin par)" → "equal" */
const cleanMeaning = m => String(m || '').replace(/\s*\([^)]*\)/g, '').trim();
/* ideas that are too close to be told apart as choices (see / look, say / tell…) */
const IDEAS = [['see', 'look', 'watch', 'seen', 'visible', 'show', 'plain', 'clear'], ['say', 'speak', 'tell', 'call', 'voice', 'answer', 'promise'], ['carry', 'bring', 'lead', 'send'],
  ['break', 'loosen', 'apart', 'cut'], ['with', 'together', 'completely', 'all'], ['not', 'without', 'against', 'opposite'], ['before', 'first', 'forward', 'ahead', 'earlier'],
  ['out', 'away', 'off', 'from', 'down'], ['back', 'again'], ['in', 'into', 'on', 'within', 'upon'], ['full', 'having', 'much'], ['make', 'do', 'doing', 'done', 'act', 'cause'],
  ['being', 'state', 'quality', 'condition'], ['stand', 'stay', 'remain'], ['care', 'careful', 'guard'], ['move', 'go', 'come', 'turn', 'run'], ['small', 'little', 'tiny'],
  ['large', 'great', 'big'], ['through', 'across', 'beyond'], ['under', 'below', 'beneath'], ['above', 'over', 'super'], ['same', 'equal', 'like'], ['write', 'mark', 'sign'],
  ['life', 'live', 'alive'], ['hold', 'keep', 'take'], ['able', 'can'], ['thing', 'something'], ['trust', 'believe', 'faith'], ['strong', 'firm'], ['place', 'land', 'earth']];
const STOP = new Set(['to', 'a', 'an', 'the', 'of', 'or', 'and', 'be', 'is', 'it', 'one', 'who', 'that', 'what', 'word', 'way', 'very', 'for', 'as', 'by', 'at', 'its']);
const ideaMap = new Map(); IDEAS.forEach((g, i) => g.forEach(t => ideaMap.set(t, i)));
const ideas = text => new Set(String(text).toLowerCase().split(/[^a-z]+/).filter(t => t && !STOP.has(t)).map(t => ideaMap.has(t) ? `#${ideaMap.get(t)}` : t.replace(/(ing|ed|s)$/, '')));
const sameIdea = (a, b) => { const A = ideas(a); for (const t of ideas(b)) if (A.has(t)) return true; return false; };

/* the hand-checked parts of a word (wordParts.js), only when there are 2 or more: [{text, type, meaning}] */
export function partsOf(word){
  const e = WORD_PARTS[key(word)]; if (!e || !Array.isArray(e.parts) || e.parts.length < 2) return null;
  return e.parts.map(x => ({ text: x.text, type: x.type, meaning: cleanMeaning(x.meaning) }));
}
const PART_POOL = (() => {
  const by = { prefix: new Map(), root: new Map(), suffix: new Map() };
  /* parts of split words only: a one-part word's "part" is the whole word (rapid), which would be an odd chip */
  for (const [w, e] of Object.entries(WORD_PARTS)) if ((e.parts || []).length >= 2) for (const x of e.parts) { const m = cleanMeaning(x.meaning); if (m && x.text) { by[x.type].set(x.text, m); by[x.type].set(`#${m}`, w); } }
  return by;
})();
const meaningsOf = type => [...new Set([...PART_POOL[type].entries()].filter(([k]) => !k.startsWith('#')).map(([, m]) => m))];
const textsOf = type => [...PART_POOL[type].keys()].filter(k => !k.startsWith('#'));

/* ---------- lesson groups ----------
   The week's words in lessons of about 5 (20 words → 4 lessons), the same groups in every skill all week, shuffled by
   the week's id; near-synonyms go in different lessons so a match board never has two meanings that fit one word. */
export function lessonCount(n){ return n <= 0 ? 0 : Math.max(1, Math.round(n / LESSON_WORDS)); }
export function lessonGroups(words, weekId = ''){
  const list = shuffleR(seededRand(`groups:${weekId}`), [...new Map(words.map(v => [key(v.w ?? v), v])).values()]);
  const L = lessonCount(list.length); if (!L) return [];
  const groups = Array.from({ length: L }, () => []);
  list.forEach((v, i) => groups[i % L].push(v));
  const clash = (g, v) => g.some(x => x !== v && isNear(x.w ?? x, v.w ?? v));
  for (let pass = 0; pass < 4; pass++) for (let gi = 0; gi < L; gi++) for (const v of groups[gi].slice()) {
    if (!clash(groups[gi], v)) continue;
    outer: for (let gj = 0; gj < L; gj++) { if (gj === gi) continue; for (const x of groups[gj]) {
      if (!clash(groups[gj].filter(y => y !== x), v) && !clash(groups[gi].filter(y => y !== v), x)) { groups[gi][groups[gi].indexOf(v)] = x; groups[gj][groups[gj].indexOf(x)] = v; break outer; }
    } }
  }
  return groups;
}

/* ---------- choosing wrong answers ----------
   Other words: this week's first, then her other words; same part of speech when there are enough; never the word,
   a near-synonym, a word the prompt mentions, a repeat, or one that clashes with "a"/"an" before a blank. */
function pickOthers(target, pools, n, { prompt = '', article = '', samePos = true, text = v => v.w, avoidText = [], close = null, rand }){
  const seen = new Set([target.key]), seenText = new Set([text(target).toLowerCase(), ...avoidText.map(x => String(x).toLowerCase())]);
  const okBase = v => v.key && !seen.has(v.key) && !isNear(v.key, target.key) && text(v) && !seenText.has(text(v).toLowerCase())
    && !mentions(prompt, v.w) && !mentions(prompt, text(v)) && !mentions(text(v), target.w) && articleOk(article, v.w) && sameLang(v, target);
  const tiers = [];
  if (samePos && target.pos) for (const pool of pools) tiers.push(pool.filter(v => v.pos === target.pos));
  for (const pool of pools) tiers.push(pool);
  const out = [], take = v => { if (out.length >= n || seen.has(v.key) || seenText.has(text(v).toLowerCase()) || out.some(o => isNear(o.key, v.key))) return; out.push(v); seen.add(v.key); seenText.add(text(v).toLowerCase()); };
  /* close: balanced lengths. The right answer's place among the lengths is picked at random (shortest, 2nd, … longest),
     then the nearest shorter and longer wrong answers fill around it, so no length rule (longest, shortest, middle) finds it. */
  if (close) {
    /* nearest first within each tier (same part of speech and this week's words first), tiers in order */
    const near = list => list.map(v => [v, Math.abs(close(v)) + rand() * 3]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    const lo = [], hi = [];
    for (const tier of tiers) { const c = shuffleR(rand, tier.filter(okBase)), l = c.filter(v => close(v) < 0 || (close(v) === 0 && rand() < 0.5)); lo.push(...near(l)); hi.push(...near(c.filter(v => !l.includes(v)))); }
    const shorter = Math.floor(rand() * (n + 1));
    for (const v of lo) { if (out.length >= shorter) break; take(v); }
    for (const v of hi) take(v);
    for (const v of lo) take(v);
    return out.length >= n ? out : null;
  }
  for (const tier of tiers) { shuffleR(rand, tier.filter(okBase)).forEach(take); if (out.length >= n) break; }
  return out.length >= n ? out : null;
}
/* a choice item, or null when there aren't enough fair wrong answers */
function choiceItem(rand, { kind, word, ask, prompt, sentence, right, wrong, why }){
  if (!wrong) return null;
  const choices = shuffleR(rand, [right, ...wrong]);
  return { type: 'pick', kind, word: word.key, ask, prompt, ...(sentence ? { sentence } : {}), choices, answer: choices.indexOf(right), ...(why ? { why } : {}) };
}

/* ---------- the exercises ---------- */
const CHOICES = 4;
function def2word(rand, v, pools){   // meaning → word
  return choiceItem(rand, { kind: 'def2word', word: v, ask: 'Which word means:', prompt: v.d, right: v.w, wrong: pickOthers(v, pools, CHOICES - 1, { prompt: v.d, close: x => x.w.length - v.w.length, rand })?.map(x => x.w) });
}
function word2def(rand, v, pools){   // word → meaning; wrong meanings close to the right one's length
  const wrong = pickOthers(v, pools, CHOICES - 1, { prompt: v.w, text: x => x.d, close: x => x.d.length - v.d.length, rand });
  return choiceItem(rand, { kind: 'word2def', word: v, ask: `What does “${v.w}” mean?`, prompt: v.w, right: v.d, wrong: wrong?.map(x => x.d) });
}
function blankItem(rand, v, pools, sentence, kind){   // which word fits the sentence
  if (!sentence) return null;
  const wrong = pickOthers(v, pools, CHOICES - 1, { prompt: sentence, article: isEnglish(v) ? articleBefore(sentence) : '', close: x => x.w.length - v.w.length, rand });
  return choiceItem(rand, { kind, word: v, ask: 'Which word fits best?', prompt: sentence, right: v.w, wrong: wrong?.map(x => x.w) });
}
/* Look-alike words (review, Oct 30): taught first, then asked both ways. A card shows both words and how they differ;
   then a sentence where only this week's word fits and the look-alike's own sentence where only it fits, in a random
   order, so "pick the word I've practiced all week" gets one of the two, not both. Every NUANCE pair goes both ways. */
function nuanceSet(rand, v, pools){
  const n = isEnglish(v) ? NUANCE[v.key] : null; if (!n) return null;
  const back = NUANCE[n.near]; if (!back || back.near !== v.key) return null;
  const other = pools.flat().find(x => x.key === n.near);
  const card = { type: 'pair', kind: 'pairIntro', word: v.key, a: { w: v.w, d: v.d }, b: { w: n.near, d: other?.d || '' }, why: n.why };
  const mine = choiceItem(rand, { kind: 'nuance', word: v, ask: 'Which word fits best?', prompt: n.s, right: v.w, wrong: [n.near], why: n.why });
  const theirs = choiceItem(rand, { kind: 'nuance', word: v, ask: 'Which word fits best?', prompt: back.s, right: n.near, wrong: [v.w], why: back.why });
  return [card, ...shuffleR(rand, [mine, { ...theirs, fix: n.near }])];
}
/* the word in a sentence she met before (the Meet example, never the sentence she just filled in): what does it mean
   here? Meaning from context, with wrong meanings close to the right one's length */
function inContextItem(rand, v, pools, sentence){
  if (!sentence) return null;
  const filled = fillBlank(sentence, v.w);
  const wrong = pickOthers(v, pools, CHOICES - 1, { prompt: filled, text: x => x.d, close: x => x.d.length - v.d.length, rand });
  return choiceItem(rand, { kind: 'inContext', word: v, ask: `What does “${v.w}” mean in this sentence?`, prompt: filled, right: v.d, wrong: wrong?.map(x => x.d) });
}
/* a part worth asking about: a prefix or root whose meaning doesn't give the part or the word away (musician: music = music) */
const fairPart = (x, v) => x.type !== 'suffix' && x.meaning && x.text.length >= 2 && !x.meaning.toLowerCase().includes(x.text.toLowerCase()) && !mentions(x.meaning, v.w) && !mentions(x.meaning, x.text)
  && !String(x.meaning).toLowerCase().split(/[^a-z]+/).some(t => t.length >= 3 && !STOP.has(t) && key(v.w).includes(t));   // artifact: “art” would give it away
/* a short plain meaning ("see", "carry", "not"): the only kind offered as a choice, so no odd gloss stands out */
const plainMeaning = m => !/[,;()]|\bor\b/.test(m) && m.split(/\s+/).length <= 3;
function partMeaningItem(rand, v, parts){   // "In predict, what does dict mean?"
  const pick = shuffleR(rand, parts.filter(x => fairPart(x, v) && plainMeaning(x.meaning)))[0]; if (!pick) return null;
  const pool = shuffleR(rand, meaningsOf(pick.type).filter(m => plainMeaning(m) && m !== pick.meaning && !sameIdea(m, pick.meaning) && !mentions(m, v.w)));
  const wrong = []; for (const m of pool) { if (wrong.length >= CHOICES - 1) break; if (!wrong.some(w => sameIdea(w, m))) wrong.push(m); }
  if (wrong.length < CHOICES - 1) return null;
  const label = pick.type === 'prefix' ? `${pick.text}-` : pick.text;
  /* a miss: she types the part's meaning ("see"), not the whole word */
  return { ...choiceItem(rand, { kind: 'partMeaning', word: v, ask: `In “${v.w}”, what does the part “${label}” mean?`, prompt: label, right: pick.meaning, wrong }), fix: pick.meaning };
}
function hasPartItem(rand, v, parts, pools){   // "Which word has a part that means: carry"
  const pick = shuffleR(rand, parts.filter(x => fairPart(x, v)))[0]; if (!pick) return null;
  const known = x => !!WORD_PARTS[x.key];
  const wrong = pickOthers(v, pools.map(p => p.filter(x => known(x) && !(WORD_PARTS[x.key].parts || []).some(y => sameIdea(cleanMeaning(y.meaning), pick.meaning)))), CHOICES - 1, { prompt: pick.meaning, samePos: false, close: x => x.w.length - v.w.length, rand });
  return choiceItem(rand, { kind: 'hasPart', word: v, ask: 'Which word has a part that means:', prompt: pick.meaning, right: v.w, wrong: wrong?.map(x => x.w) });
}
function buildChips(rand, v, parts){   // build the word from its part chips, plus 2 that don't belong
  const decoys = shuffleR(rand, [...textsOf('prefix'), ...textsOf('root'), ...textsOf('suffix')].filter(t => t.length >= 2 && !parts.some(p => p.text === t) && !key(v.w).includes(t))).slice(0, 2);
  return { type: 'build', kind: 'build', word: v.key, ask: 'Build the word that means:', prompt: v.d, chips: shuffleR(rand, [...parts.map(p => p.text), ...decoys]), parts: parts.map(p => p.text), answer: v.w };
}
/* ---------- any language: letter tiles and "which one is spelled right?" ----------
   A word with no word parts (any word in another language, or an English word that is one part) is built from tiles
   of its letters (pairs of letters for a long word) plus 2 tiles that don't belong, then picked from look-alike
   spellings that differ only in one vowel (all the same length, so no spelling looks odd one out). Letters are counted
   as the reader sees them (é, ñ, and letters with marks stay whole). */
export const graphemes = w => { try { return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(String(w))].map(x => x.segment); } catch { return [...String(w)]; } };
export function letterTiles(w){
  const g = graphemes(w); if (g.length < 2 || g.some(ch => /\s/.test(ch))) return null;
  if (g.length <= 6) return g;
  const out = []; for (let i = 0; i < g.length; i += 2) out.push(g.slice(i, i + 2).join(''));
  return out;
}
function letterBuild(rand, v, pools){
  const tiles = letterTiles(v.w); if (!tiles) return null;
  const size = tiles[0].length > 1 || graphemes(tiles[0]).length > 1 ? 2 : 1, own = new Set(tiles.map(t => t.toLowerCase()));
  const spare = [];
  for (const x of shuffleR(rand, pools.flat().filter(x => x.key !== v.key && sameLang(x, v)))) {
    for (const t of shuffleR(rand, letterTiles(x.w) || [])) if (graphemes(t).length === size && !own.has(t.toLowerCase()) && !spare.includes(t.toLowerCase())) { spare.push(t.toLowerCase()); break; }
    if (spare.length >= 2) break;
  }
  let chips = tiles.concat(spare);
  for (let i = 0; i < 6; i++) { chips = shuffleR(rand, chips); if (chips.slice(0, tiles.length).join('') !== v.w) break; }
  return { type: 'build', kind: 'letters', word: v.key, ask: 'Build the word that means:', prompt: v.d, chips, parts: tiles, answer: v.w };
}
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
function spellPickItem(rand, v, pools){
  const g = graphemes(v.w); if (g.length < 3 || g.some(ch => /\s/.test(ch))) return null;
  const known = new Set(pools.flat().map(x => x.key));
  /* a plain vowel inside the word: not the first letter, not the last (gato / gata are both words), and a vowel with
     an accent mark stays as it is in every choice */
  for (const i of shuffleR(rand, g.map((_, i) => i).filter(i => i > 0 && i < g.length - 1 && VOWELS.includes(g[i].toLowerCase())))) {
    const upper = g[i] !== g[i].toLowerCase(), wrong = [];
    for (const a of shuffleR(rand, VOWELS.filter(x => x !== g[i].toLowerCase()))) {
      const w = [...g.slice(0, i), upper ? a.toUpperCase() : a, ...g.slice(i + 1)].join('');
      if (!known.has(key(w)) && !wrong.includes(w)) wrong.push(w);
      if (wrong.length >= CHOICES - 1) break;
    }
    if (wrong.length >= CHOICES - 1) return choiceItem(rand, { kind: 'spellPick', word: v, ask: 'Which one is spelled right?', prompt: v.d, right: v.w, wrong });
  }
  return null;
}
const typeItem = (v, listen) => ({ type: 'type', kind: listen ? 'listen' : 'fromMeaning', word: v.key, ask: listen ? 'Listen, then type the word.' : 'Type the word that means:', prompt: v.d, listen, answer: v.w });
/* type the word that fits the sentence (her meaning shown too): for a word with too few other words in its language
   to make fair wrong answers, so it still gets a sentence in Use it */
const typeBlankItem = (v, sentence) => (sentence ? { type: 'type', kind: 'typeBlank', word: v.key, ask: 'Type the word that fits:', prompt: v.d, sentence, listen: false, answer: v.w } : null);

/** One lesson: `skill`, the lesson's words and the words to draw wrong answers from (`pools`: this week's, then all of
    hers), as pathWord entries or plain word entries. Returns the exercises in order. Intro cards, look-alike cards and
    match boards don't have choices; every `pick` item has `choices` and `answer`. Every word gets at least one
    exercise in every skill: when a word has too few other words in its language for fair wrong answers (2 Spanish
    words in an English week), it gets a typed exercise instead of a choice one. */
export function buildLesson(skill, lessonWords, pools, rand = Math.random){
  const words = lessonWords.map(x => (x && x.key ? x : pathWord(x))), P = pools.map(pool => pool.map(x => (x && x.key ? x : pathWord(x))));
  const out = [], add = x => { if (x) out.push(x); };
  if (skill === 'meet') {
    /* each new word, then a quick "which word means…" on the one before it, so she sees it, then uses it */
    const ask = v => def2word(rand, v, P) || typeItem(v, false);
    words.forEach((v, i) => { add({ type: 'intro', kind: 'intro', word: v.key, w: v.w, d: v.d, s: v.u ? v.s : '' }); if (i > 0) add(ask(words[i - 1])); });
    add(ask(words[words.length - 1]));
    if (words.length >= 3) add(def2word(rand, words[0], P));   // the first word once more, a few cards later
  } else if (skill === 'match') {
    const board = (list, fromMeaning) => ({ type: 'match', kind: fromMeaning ? 'matchMeaning' : 'matchWord', words: list.map(v => v.key), pairs: list.map(v => ({ key: v.key, w: v.w, d: v.d })),
      left: shuffleR(rand, list.map(v => v.key)), right: shuffleR(rand, list.map(v => v.key)), fromMeaning });
    if (words.length >= 2) add(board(words, false));
    shuffleR(rand, words).forEach(v => add(word2def(rand, v, P) || def2word(rand, v, P) || typeItem(v, false)));
    /* the second board is a mixed review: 3 of this lesson's words and 2 others from this week she met in Meet the
       words, read from the meanings side, so it isn't the same 5 pairs a third time */
    if (words.length >= 3) {
      const extra = [];
      for (const x of shuffleR(rand, (P[0] || []).filter(x => x.d && !words.some(w => w.key === x.key || isNear(w.key, x.key) || w.d === x.d)))) {
        if (extra.length >= 2) break;
        if (!extra.some(y => y.key === x.key || isNear(y.key, x.key) || y.d === x.d)) extra.push(x);
      }
      add(board(shuffleR(rand, [...shuffleR(rand, words).slice(0, words.length - extra.length), ...extra]), true));
    } else if (words.length === 2) add(board(words, true));
  } else if (skill === 'build') {
    for (const v of words) {
      const parts = isEnglish(v) ? partsOf(v.w) : null;
      if (parts) { add(buildChips(rand, v, parts)); add((rand() < 0.5 ? partMeaningItem(rand, v, parts) || hasPartItem(rand, v, parts, P) : hasPartItem(rand, v, parts, P) || partMeaningItem(rand, v, parts)) || def2word(rand, v, P)); }
      else { add(letterBuild(rand, v, P) || typeItem(v, false)); add(spellPickItem(rand, v, P) || def2word(rand, v, P)); }
    }
  } else if (skill === 'use') {
    /* first the second sentence (never the example from Meet the words); a word with only one sentence uses that one
       here, because Meet the words didn't show it */
    for (const v of words) add(blankItem(rand, v, P, v.u || v.s, 'blank') || typeBlankItem(v, v.u || v.s) || def2word(rand, v, P) || typeItem(v, false));
    /* then a look-alike pair (taught, then asked both ways), or the word in the Meet example: what does it mean there? */
    for (const v of shuffleR(rand, words)) {
      const pair = nuanceSet(rand, v, P);
      if (pair) pair.forEach(add);
      else add((v.u && v.s ? inContextItem(rand, v, P, v.s) : null) || def2word(rand, v, P));
    }
  } else if (skill === 'spell') {
    words.forEach(v => add(typeItem(v, true)));
    shuffleR(rand, words).forEach(v => add(typeItem(v, false)));
  }
  return out;
}
/* a choice item asked again at the end of the lesson after a miss: same question, choices mixed again */
export function againItem(item, rand = Math.random){
  if (item.type !== 'pick') return { ...item, again: true };
  const right = item.choices[item.answer], choices = shuffleR(rand, item.choices);
  return { ...item, choices, answer: choices.indexOf(right), again: true };
}
/* after a match board: a quick "what does it mean?" for a word she paired wrong */
export function matchRetryItem(wordEntry, pools, rand = Math.random){
  const v = wordEntry.key ? wordEntry : pathWord(wordEntry);
  return word2def(rand, v, pools.map(pool => pool.map(x => (x && x.key ? x : pathWord(x))))) || def2word(rand, v, pools.map(pool => pool.map(x => (x && x.key ? x : pathWord(x)))));
}

/* ---------- the path's saved state (S.vocab.path) ----------
   {wk: week id, n: lessons per skill this week, lessons: {skill: [{xp, acc}|null, …]}, xp: this week's XP,
    days: days this week with a lesson done (the streak), acc: {skill: {r: right first try, t: asked}}} */
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;
export function normalizePath(p){
  const o = p && typeof p === 'object' ? p : {};
  const lessons = {}, acc = {};
  for (const id of SKILL_IDS) {
    const list = Array.isArray(o.lessons?.[id]) ? o.lessons[id].slice(0, 8) : [];
    lessons[id] = list.map(x => (x && typeof x === 'object' ? { xp: Math.max(0, Math.min(99, Math.round(+x.xp || 0))), acc: Math.max(0, Math.min(100, Math.round(+x.acc || 0))) } : null));
    const a = o.acc?.[id]; acc[id] = { r: Math.max(0, Math.round(+a?.r || 0)), t: Math.max(0, Math.round(+a?.t || 0)) }; if (acc[id].r > acc[id].t) acc[id].r = acc[id].t;
  }
  return { wk: DAY_KEY.test(o.wk) ? o.wk : '', n: Math.max(0, Math.min(8, Math.round(+o.n || 0))), lessons, xp: Math.max(0, Math.min(99999, Math.round(+o.xp || 0))),
    days: (Array.isArray(o.days) ? o.days : []).filter(d => DAY_KEY.test(d)).filter((d, i, a) => a.indexOf(d) === i).slice(-7), acc };
}
/* the path for this week: last week's progress starts over on Monday */
export function pathForWeek(p, weekId, n){
  const cur = normalizePath(p);
  if (cur.wk !== weekId) return { ...normalizePath({}), wk: weekId, n };
  return { ...cur, n: n || cur.n };
}
export const lessonsDone = (path, skill) => (path.lessons[skill] || []).filter(Boolean).length;
export const skillDone = (path, skill) => path.n > 0 && lessonsDone(path, skill) >= path.n;
/* where she is: each node's state ('done', 'current', 'locked'), the next lesson in each, and the current skill */
export function pathNodes(path){
  let open = true;
  const nodes = PATH_SKILLS.map(s => {
    const done = lessonsDone(path, s.id), full = skillDone(path, s.id), state = full ? 'done' : open ? 'current' : 'locked';
    if (!full) open = false;
    const next = (path.lessons[s.id] || []).findIndex(x => !x), nextLesson = full ? -1 : next < 0 ? Math.min(done, Math.max(0, path.n - 1)) : next;
    return { ...s, done, total: path.n, state, nextLesson };
  });
  return { nodes, current: nodes.find(x => x.state === 'current') || null, allDone: nodes.every(x => x.state === 'done') };
}
/** Saves a finished lesson (in place). right / asked: first-try answers; XP 10, +5 for no misses. Returns {xp, first}
    (first: the first time this lesson was finished this week). */
export function recordLesson(path, skill, index, { right, asked, day }){
  if (!SKILL_IDS.includes(skill) || !(index >= 0 && index < 8)) return { xp: 0, first: false };
  const acc = asked ? Math.round((100 * right) / asked) : 100, xp = XP_LESSON + (asked && right === asked ? XP_PERFECT : 0);
  const list = path.lessons[skill] || (path.lessons[skill] = []);
  while (list.length <= index) list.push(null);
  const first = !list[index];
  list[index] = { xp: Math.max(xp, list[index]?.xp || 0), acc: Math.max(acc, list[index]?.acc || 0) };
  path.xp = (path.xp || 0) + xp;
  path.acc[skill] = { r: (path.acc[skill]?.r || 0) + right, t: (path.acc[skill]?.t || 0) + asked };
  if (DAY_KEY.test(day) && !path.days.includes(day)) path.days = [...path.days, day].slice(-7);
  return { xp, first };
}
/* for grown-ups and the teacher: which skills she has finished this week and her first-try accuracy in each */
export function pathSummary(p, weekId){
  const path = normalizePath(p);
  if (!path.wk || (weekId && path.wk !== weekId)) return { started: false, done: [], skills: [], xp: 0, days: 0 };
  const skills = PATH_SKILLS.map(s => ({ id: s.id, emoji: s.emoji, name: s.name, lessons: lessonsDone(path, s.id), total: path.n, done: skillDone(path, s.id),
    acc: path.acc[s.id]?.t ? Math.round((100 * path.acc[s.id].r) / path.acc[s.id].t) : null }));
  return { started: skills.some(s => s.lessons > 0), done: skills.filter(s => s.done).map(s => s.id), skills, xp: path.xp, days: path.days.length };
}
export function pathSummaryText(p, weekId){
  const s = pathSummary(p, weekId);
  if (!s.started) return '🐾 Paw Path: not started this week';
  return `🐾 Paw Path: ${s.done.length} of 5 skills done · ${s.xp} XP · ${s.days} day${s.days === 1 ? '' : 's'} · ` + s.skills.filter(x => x.lessons > 0).map(x => `${x.emoji} ${x.name} ${x.done ? '✅' : `${x.lessons}/${x.total}`}${x.acc != null ? ` ${x.acc}%` : ''}`).join(' · ');
}
