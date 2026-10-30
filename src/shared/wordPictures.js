/* Pet World Word Workshop: 🖼️ a picture for every word (docs/WORD-PICTURES.md). No DOM here.

   WORD_PICTURES has one entry for every built-in word (VOCAB_WORDS and PATTERN_WORDS in vocab.js), in the same order:
   {w, kind:'photo'|'cartoon'|'emoji', emoji, svg?, photo?, alt}
   - kind is the picture the word is MEANT to have: a real photo where a photo shows the meaning well, a cartoon
     (pets acting out the meaning) for words a photo can't show (analyze, infer, scarce...), emoji where neither works.
   - emoji: a 1–3 emoji scene that shows the meaning (never a sound-alike pun). Every word has one: it's the fallback.
   - svg: 'cartoons/<word>.svg' under public/vocab-pics/ (drawn by scripts/word-cartoons/, checked by
     scripts/check-word-pictures.mjs).
   - photo: {file, credit, license, source, alt?}. Empty until the photos are added (free licenses only, stored in
     public/vocab-pics/photos/ so it works offline). A photo word shows its emoji until then.
   - alt: one plain sentence describing the picture that shows now, for read-aloud.

   pictureFor(word, entry?) gives the best picture there is (photo → cartoon → emoji) as
   {w, kind, emoji, src?, alt, credit?}. For a word a teacher or grown-up added, pass its entry: its chosen photo, a
   cartoon drawn later (CLASS_CARTOONS), the emoji they chose (entry.pic) or else a suggested one (suggestEmoji), in that
   order (see "pictures for words a grown-up or teacher ADDS" below). Unknown words with none of those give null. */

const E = (w, kind, emoji, alt) => ({ w, kind, emoji, ...(kind === 'cartoon' ? { svg: `cartoons/${w}.svg` } : {}), ...(kind === 'photo' ? { photo: {} } : {}), alt });
const CA = 'cartoon', PH = 'photo', EM = 'emoji';

export const WORD_PICTURES = [
  /* Set 1 */
  E('analyze', CA, '🔍🧩', 'A cat holds a magnifying glass over one piece of a toy robot that was taken apart.'),
  E('compare', CA, '🍎↔️🍐', 'Two circles overlap: a cat in one, a dog in the other, and a heart in the middle that they both share.'),
  E('contrast', CA, '☀️↔️🌙', 'A dark cat at night and a white cat in the sunshine sit back to back.'),
  E('describe', CA, '🐶💬🔴', 'A dog tells three things about a red ball: its color, how big it is, and how it bounces.'),
  E('evidence', CA, '🐾🔍✅', 'A detective dog holds up a clue bag with a paw print in it, next to a green check.'),
  E('predict', CA, '🌧️➡️☂️', 'A cat sees dark clouds, thinks of rain, and holds up an umbrella before the rain starts.'),
  E('summarize', CA, '📚➡️📝', 'A tall stack of pages goes in and one small card with the main ideas comes out.'),
  E('infer', CA, '🍪🐾🤔', 'An empty cookie jar, a trail of crumbs, and a dog’s wagging tail sticking out of a bush: the cat figures out who ate the cookies.'),
  E('explain', CA, '🧑‍🏫💡', 'A dog at a board shows how a seed grows into a flower, and the bunny gets it, with a light bulb over its head.'),
  E('identify', CA, '👉🐦🏷️', 'Birds sit in a row and a dog points at one red bird that is circled, with a name tag.'),
  /* Set 2 */
  E('abundant', CA, '🥕🥕🧺', 'A basket overflows with carrots and more carrots lie all around a happy bunny.'),
  E('scarce', CA, '🧺🥕😟', 'A worried bunny looks at a basket with just one carrot left in it.'),
  E('fragile', PH, '🥚⚠️', 'An egg and a warning sign: careful, it breaks easily.'),
  E('sturdy', PH, '🧱💪', 'A brick and a strong arm: something strong that won’t break.'),
  E('ancient', PH, '🏛️🏺', 'An old stone temple and a clay pot from long ago.'),
  E('modern', PH, '📱🏙️', 'A smartphone and a city of tall glass buildings from today.'),
  E('enormous', PH, '🐋🌊', 'A giant whale in the ocean.'),
  E('minute', PH, '🐜🔍', 'A tiny ant under a magnifying glass.'),
  E('reluctant', CA, '🛁🐕😖', 'A kind cat gently pulls a dog toward a bubble bath, but the dog leans way back with its paws dug in.'),
  E('eager', CA, '🐕🦮🤩', 'A dog jumps by the door with its leash in its mouth and its tail wagging.'),
  /* Set 3 */
  E('cautious', CA, '👀🚸', 'A cat tiptoes across a log over the water with its arms out, watching every step.'),
  E('confident', CA, '😎💪', 'A dog stands tall on a stage with its paws on its hips and a big smile.'),
  E('curious', PH, '🐈❓', 'A cat and a question mark: wanting to find out.'),
  E('generous', CA, '🍪🤲❤️', 'A cat with two cookies hands one to a bunny, and a heart floats above them.'),
  E('honest', CA, '🙋💔🏺', 'Next to a big broken vase, a dog raises its paw and says it did it, and the cat smiles.'),
  E('patient', EM, '⏳🙂', 'An hourglass and a calm smile: waiting without getting upset.'),
  E('persistent', CA, '🧗💦🚩', 'A sweaty bunny keeps pushing a big rock up a steep hill toward a flag.'),
  E('responsible', PH, '🧒🥣🐶', 'A child filling a dog’s food bowl.'),
  E('timid', CA, '🐰🙈', 'A shy bunny peeks out from behind a tree while a dog waves hello.'),
  E('grateful', CA, '🎁🥰🙏', 'A cat hugs a present with happy closed eyes and hearts all around.'),
  /* Set 4 */
  E('accurate', CA, '🎯', 'An arrow right in the middle of a target.'),
  E('approximate', CA, '🎯🤏', 'An arrow that landed close to the middle of the target, in the next ring out, but not in the middle.'),
  E('estimate', CA, '🫙🍬🤔', 'A dog looks at a jar of gumballs and thinks “50?”'),
  E('calculate', PH, '🧮➕', 'An abacus and a plus sign: working out an answer with math.'),
  E('pattern', PH, '🔴🔵🔴', 'Red, blue, red: something that repeats.'),
  E('equivalent', CA, '🍕⚖️🍕', 'A balance holds half a pizza on one side and two quarters on the other, perfectly level.'),
  E('interpret', CA, '🐕〰️😊', 'A dog wags its tail hard, and the cat figures out what the wag means: the dog is happy.'),
  E('data', EM, '📊📋', 'A bar chart and a clipboard of numbers that were collected.'),
  E('survey', CA, '📋🙋🙋', 'A cat with a clipboard asks three friends the same question and marks each answer.'),
  E('conclusion', CA, '🧠➡️✅', 'Three clues, a chewed shoe, muddy paw prints and a tipped-over empty bowl, all point to one answer: the puppy.'),
  /* Set 5 */
  E('habitat', PH, '🐸🌿💧', 'A frog among plants by the water, where it lives.'),
  E('adapt', CA, '☀️➡️🧣', 'A cat moves from a sunny place to a snowy one and puts on a hat and scarf.'),
  E('migrate', PH, '🪿➡️☀️', 'A goose flying toward the warm sun.'),
  E('predator', PH, '🦁😋', 'A hungry lion licking its lips.'),
  E('prey', PH, '🐇🏃💨', 'A rabbit running away fast.'),
  E('organism', PH, '🐛🌱🍄', 'A caterpillar, a sprout and a mushroom: all living things.'),
  E('environment', PH, '🌳🏞️☀️', 'Trees, a river and the sun: everything around living things.'),
  E('erosion', PH, '🌊🪨', 'Waves wearing away a rock.'),
  E('nutrient', PH, '🥦🍎💪', 'Broccoli and an apple that help you grow strong.'),
  E('observe', PH, '👀🐦📓', 'Eyes watching a bird and a notebook to write down what you see.'),
  /* Set 6 */
  E('century', CA, '🎂💯', 'A birthday cake with “100” on it: a hundred years.'),
  E('civilization', PH, '🏛️🏙️👑', 'A temple, a city and a crown: a big society with cities and leaders.'),
  E('culture', PH, '🎎🍜🎶', 'Dolls, a bowl of noodles and music: a group’s way of life.'),
  E('empire', EM, '👑🗺️', 'A crown over a map: many lands ruled by one leader.'),
  E('trade', PH, '🍎🔄🍪', 'An apple swapped for a cookie.'),
  E('tradition', PH, '🦃👵👧', 'A holiday turkey, a grandma and a girl: a custom passed down.'),
  E('artifact', PH, '🏺', 'A clay pot made by people long ago.'),
  E('source', CA, '📖➡️💡', 'A page, a star and a light bulb float out of an open book and into a surprised cat’s thoughts.'),
  E('conflict', CA, '😾🪢🐶', 'An angry cat and an angry dog pull on the same toy.'),
  E('migration', PH, '🦬🦬➡️', 'A herd of animals moving to a new place.'),
  /* Set 7 */
  E('consequence', CA, '🟫➡️🛁', 'First a dog splashes in mud, then, because of that, it has to take a bath.'),
  E('cooperate', CA, '🤝📦', 'A cat and a dog carry one big heavy box together.'),
  E('determine', EM, '🪙🔍', 'A coin and a magnifying glass: flipping a coin to find out who goes first.'),
  E('essential', EM, '💧🍞', 'Water and bread: things you really need.'),
  E('frequent', EM, '🔁🔁🔁', 'Repeat arrows again and again: happening often.'),
  E('influence', CA, '😎➡️😎', 'One cat puts on sunglasses, and both of its friends copy it and put theirs on too.'),
  E('obstacle', PH, '🚧🪨', 'A road block and a big rock in the way.'),
  E('opinion', CA, '🥦😋😖', 'The same plate of broccoli: the cat thinks it is yummy, the dog thinks it is yucky.'),
  E('reveal', CA, '🎁✨🐰', 'A cat lifts a cloth and shows the surprise hidden underneath: a bunny.'),
  E('require', EM, '🌱💧☀️', 'A little plant with water and sunshine: the things it needs to grow.'),
  /* Set 8 */
  E('astonished', CA, '😲', 'A dog’s eyes go huge and its mouth falls open when it sees a giant bone.'),
  E('distinct', CA, '⚪🔴⚪', 'A row of gray cats, and one bright orange cat that stands out.'),
  E('drowsy', PH, '🥱😴', 'A big yawn and sleepy eyes.'),
  E('eventually', CA, '🐌🛤️🏁', 'A snail crawls a long, winding path and finally reaches the flag.'),
  E('hesitate', CA, '🤔🛑', 'A bunny stops at the end of a diving board with one foot out, not sure about jumping.'),
  E('immense', PH, '🏔️🧍', 'A huge mountain next to a tiny person: really, really big.'),
  E('peculiar', PH, '🤨👽', 'A puzzled face and an alien: something strange.'),
  E('rapid', PH, '🐆💨', 'A cheetah running very fast.'),
  E('vivid', PH, '🌈🌺', 'A bright rainbow and a bright flower.'),
  E('wander', PH, '🚶〰️🌲', 'Someone walking a wiggly path through the trees with no plan.'),
  /* Set 9 */
  E('accomplish', CA, '🏔️🚩🎉', 'A dog reaches the top of a mountain and plants its flag.'),
  E('demonstrate', PH, '🧑‍🏫🧪👀', 'A teacher shows an experiment while someone watches.'),
  E('expand', PH, '🎈↔️', 'A balloon stretching wider as it fills up and gets bigger.'),
  E('improve', CA, '📈⭐', 'Three drawings of a sun by the same bunny, each one better than the last.'),
  E('investigate', PH, '🕵️🔍', 'A detective with a magnifying glass looking for the truth.'),
  E('locate', EM, '🗺️📍', 'A map with a pin on the spot.'),
  E('perform', PH, '🎭🎤👏', 'A show on a stage with a microphone and clapping.'),
  E('protect', PH, '🛡️🐣', 'A shield in front of a baby chick.'),
  E('survive', PH, '🌵☀️', 'A cactus staying alive in the hot desert sun.'),
  E('transform', PH, '🐛➡️🦋', 'A caterpillar that becomes a butterfly.'),
  /* Set 10 */
  E('boundary', PH, '🏡🛑', 'A house and a stop sign: this is where the yard ends.'),
  E('compromise', CA, '🍕🤝', 'A cat and a dog who both wanted the pizza each take half.'),
  E('debate', PH, '🗣️🆚🗣️', 'Two speakers on different sides.'),
  E('emphasize', EM, '📝🖍️', 'A page and a marker: coloring over the part that matters most.'),
  E('perspective', CA, '👁️6️⃣9️⃣', 'A number lies flat on the floor between a cat and a dog: the cat sees a 6, and the dog on the other side sees a 9.'),
  E('precise', PH, '📏🎯', 'A ruler and a bullseye: exact and careful.'),
  E('relevant', CA, '🏖️🕶️✅', 'Packing for the beach: sunglasses and a sand pail get a check, a winter hat gets an X.'),
  E('sequence', CA, '🥚🐣🐔', 'An egg, then the egg cracking, then a chick, numbered 1, 2, 3.'),
  E('significant', EM, '🐘🐭', 'A huge elephant next to a tiny mouse: a difference big enough to notice.'),
  E('thorough', CA, '🧹✅✅', 'A bunny checks every box on the cleaning list and sweeps under the bed too.'),
  /* spelling-pattern words */
  E('prepare', PH, '🎒✅', 'A packed backpack with a check: ready to go.'),
  E('prevent', PH, '⛑️🚲', 'A helmet for riding a bike, to stop you from getting hurt.'),
  E('previous', EM, '⏮️📅', 'A back button and a calendar: the one before.'),
  E('perhaps', EM, '🤷', 'A shrug: maybe.'),
  E('permit', EM, '👍✅', 'A thumbs up and a check: yes, you are allowed.'),
  E('persuade', CA, '🗣️👍', 'A cat shares three good ideas, and the dog changes its mind from no to yes.'),
  E('produce', PH, '🚜🌽', 'A tractor and corn growing on a farm.'),
  E('promise', EM, '🤝💬', 'A handshake and words: saying you will surely do it.'),
  E('believe', EM, '💬🤔👍', 'Hearing what someone says, thinking about it, and agreeing it is true.'),
  E('receive', PH, '📦🤲', 'Hands getting a package.'),
  E('neighbor', PH, '🏠👋🏠', 'Two houses side by side and a wave hello.'),
  E('piece', PH, '🧩🍕', 'A puzzle piece and a slice of pizza: one part of something.'),
  E('ceiling', PH, '🏠⬆️🕷️', 'A house, an up arrow and a spider: the spider hangs from the top of the room.'),
  E('field', PH, '🌾🌻', 'An open area of grass and sunflowers.'),
  E('necessary', EM, '🔑🔒', 'A key and a lock: you need the key to open it.'),
  E('tomorrow', EM, '📅➡️🌅', 'A calendar and an arrow to the next sunrise.'),
  E('occasion', PH, '🎉🎂', 'A party with a cake: a special event.'),
  E('address', PH, '🏠📫', 'A house and its mailbox.'),
  E('success', PH, '🏆🎉', 'A trophy and a celebration.'),
  E('beginning', EM, '🚦🏃', 'A green light and a runner starting.'),
  E('important', EM, '📌⭐', 'A pin and a star: this matters a lot, so keep it in mind.'),
  E('different', EM, '🍎🍌', 'An apple and a banana: not the same.'),
  E('patience', EM, '⏳🙂', 'An hourglass and a calm smile.'),
  E('distance', PH, '📍↔️📍', 'Two pins with an arrow between them: how far apart they are.'),
  E('excellent', EM, '🌟💯', 'A gold star and a hundred points.'),
  E('assistant', PH, '🤝🧰', 'A helping hand passing a toolbox.'),
  E('comfortable', PH, '🛋️😌', 'A soft couch and a relaxed face.'),
  E('possible', EM, '🏊✅', 'A swimmer and a check: yes, it can happen.'),
  E('valuable', PH, '💎💰', 'A diamond and a bag of money: worth a lot.'),
  E('visible', EM, '🌕👀', 'A bright full moon and eyes: you can see it in the sky.'),
  E('terrible', EM, '😫⛈️', 'An upset face and a storm: very bad.'),
  E('reliable', PH, '🐕‍🦺🤝', 'A service dog you can count on.'),
  E('question', EM, '❓🙋', 'A question mark and a raised hand.'),
  E('vacation', PH, '🏖️🧳', 'A beach and a suitcase.'),
  E('decision', CA, '🛤️🤔', 'A cat stands where the path splits in two and picks one way.'),
  E('television', PH, '📺', 'A TV screen.'),
  E('musician', PH, '🧑‍🎤🎸', 'A singer and a guitar.'),
  E('attention', EM, '👀👂', 'Eyes and an ear: watching and listening carefully.'),
  E('circle', EM, '⭕', 'A round ring.'),
  E('notice', EM, '👀🪧', 'Eyes spotting a new sign.'),
  E('decide', EM, '📚👉', 'A finger pointing at one book: making up your mind which one to read.'),
  E('concert', PH, '🎤🎶🎸', 'A microphone, music notes and a guitar: a music show.'),
  E('cycle', EM, '🔄💧', 'A circle of arrows and a water drop: something that repeats.')
];

const BY_WORD = new Map(WORD_PICTURES.map(p => [p.w, p]));
export const PICTURE_BASE = '/vocab-pics/';

/* an emoji scene a grown-up typed for their own word: 1–3 emoji, nothing else (letters and digits are dropped) */
export function validPictureEmoji(text){
  const s = String(text ?? '').trim();
  if (!s || s.length > 40) return '';
  let parts;
  try { parts = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].map(x => x.segment); }
  catch { parts = [...s]; }
  const emoji = parts.filter(c => /\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/u.test(c));
  return emoji.length && emoji.length <= 3 && emoji.length === parts.filter(c => c.trim()).length ? emoji.join('') : '';
}

/* ---------- pictures for words a grown-up or teacher ADDS (owner, Oct 30, 2026; ROADMAP F92, docs/VOCAB.md "Pictures for
   added words"). Built-in words keep their own pictures above. For an added word the entry can carry:
   - photo: {src, credit, license, licenseVersion?, source, title?, creator?}: a free-license photo the grown-up or
     teacher picked from 🔍 Find a photo (photoSearch.js). Nothing is ever picked for them. src is a small JPEG data URL
     (a family's words, saved with her town) or the photo's https address (a class's words, in classes.game_settings).
   - pic: the 1–3 emoji they chose; noPic: true when they said "No picture" (then no emoji is suggested).
   pictureFor's order for them: photo → cartoon (CLASS_CARTOONS, drawn later) → chosen emoji → suggested emoji → none. */
export const PHOTO_LICENSES = { cc0: 'CC0', pdm: 'public domain', by: 'CC BY', 'by-sa': 'CC BY-SA' };
export const PHOTO_DATA_MAX = 30000;   // a saved photo's data URL, in characters (about 22 KB of JPEG)
const httpsURL = x => typeof x === 'string' && x.length <= 600 && /^https:\/\/[^\s"'<>]+$/.test(x);
const cut = (x, n) => String(x ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
export function validWordPhoto(p){
  if (!p || typeof p !== 'object') return null;
  const src = String(p.src || ''), license = String(p.license || '').toLowerCase(), credit = cut(p.credit, 200);
  const okSrc = (src.length <= PHOTO_DATA_MAX && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src)) || httpsURL(src);
  if (!okSrc || !PHOTO_LICENSES[license] || !credit || !httpsURL(p.source)) return null;
  const v = cut(p.licenseVersion, 8);
  return { src, credit, license, ...(/^[\d.]+$/.test(v) ? { licenseVersion: v } : {}), source: p.source, ...(p.title ? { title: cut(p.title, 120) } : {}), ...(p.creator ? { creator: cut(p.creator, 80) } : {}) };
}

/* Cartoons drawn later for added words (class or family words), with the same kit and checks as the built-in ones
   (docs/WORD-CARTOONS.md). Key: the word in lower case. svg: 'cartoons/class/<word>.svg' under public/vocab-pics/. */
export const CLASS_CARTOONS = {
  /* apples: { svg: 'cartoons/class/apples.svg', emoji: '🍎', alt: 'A bunny picks round red apples from a tree.' }, */
};

/* 🙂 A suggested emoji from the word and its meaning, for added words: a small keyword table, meanings only (no
   sound-alike puns). Conservative on purpose:
   - THINGS (fruit, water, dog, book, music…) count anywhere in the meaning, and when there is one, only things are
     used ("a small boat you paddle" is ⛵, not 🐜⛵). DESCRIBING words (big, fast, sad, sleepy, see…) count only when
     there's no thing, and only in a short meaning (6 words or fewer, like "very big"), since in a long one they're
     often about something else ("a large, organized society").
   - Words with more than one everyday meaning are left out (time, little, say, help, find, grow, key, present, fall…).
   - Whole words only, at most 2 emoji, and nothing at all when the meaning says not, no, without, opposite, less, lack
     or un-something (so "not big" never gets 🐘), or when nothing matches. */
const THING_EMOJI = [
  ['🍎', 'apple fruit fruits'], ['🍌', 'banana'], ['🍓', 'berry berries strawberry'], ['🥕', 'carrot vegetable vegetables veggie'],
  ['🍞', 'bread loaf'], ['🍰', 'cake dessert'], ['🍪', 'cookie cookies'], ['🍕', 'pizza'], ['🥛', 'milk'], ['🍽️', 'food meal meals dinner lunch breakfast'],
  ['💧', 'water liquid'], ['🌊', 'ocean sea'], ['🌧️', 'rain storm'], ['❄️', 'snow ice'], ['🔥', 'fire flame'],
  ['☀️', 'sun sunshine'], ['🌙', 'moon'], ['⭐', 'star stars'], ['🌍', 'earth planet globe'], ['⛰️', 'mountain mountains hill'],
  ['🌳', 'tree trees forest woods'], ['🌸', 'flower flowers blossom'], ['🌱', 'plant plants seed seeds sprout'], ['🍂', 'leaf leaves autumn'],
  ['🪨', 'rock rocks stone stones'], ['🏜️', 'desert sand'], ['🏝️', 'island'], ['🌋', 'volcano lava'], ['🌈', 'rainbow'], ['💨', 'wind'],
  ['🐶', 'dog dogs puppy'], ['🐱', 'cat cats kitten'], ['🐦', 'bird birds'], ['🐟', 'fish'], ['🐎', 'horse horses'], ['🐄', 'cow cows cattle'], ['🐾', 'animal animals pet pets'],
  ['🐝', 'bee bees insect insects'], ['🦋', 'butterfly'], ['🐍', 'snake'],
  ['🏠', 'house home'], ['🏫', 'school classroom'], ['🏰', 'castle king queen kingdom'], ['🏙️', 'city'], ['🛣️', 'road street'], ['🌉', 'bridge'],
  ['🚗', 'car cars'], ['🚌', 'bus'], ['🚂', 'train'], ['✈️', 'airplane plane'], ['⛵', 'boat ship sailboat'], ['🚀', 'rocket spaceship'],
  ['📚', 'book books story stories'], ['✏️', 'pencil'], ['🎨', 'painting art artist'], ['🎵', 'music song songs'],
  ['⚽', 'ball soccer sport sports'], ['💰', 'money coin coins'], ['⏰', 'clock'], ['📅', 'day days week month year years calendar'],
  ['🎁', 'gift'], ['🎉', 'party celebration'], ['💡', 'idea'], ['🧪', 'experiment science'], ['🔢', 'number numbers'], ['🏆', 'trophy prize']
];
const DESCRIBE_EMOJI = [
  ['🐘', 'big huge giant enormous'], ['🐜', 'tiny small'], ['⚡', 'fast quick quickly'], ['🐢', 'slow slowly'],
  ['😊', 'happy glad cheerful joyful'], ['😢', 'sad unhappy crying'], ['😠', 'angry mad furious'], ['😨', 'scared afraid frightened'],
  ['😴', 'sleep sleepy asleep tired'], ['🤔', 'think thinks thinking wonder puzzled'], ['😲', 'surprised amazed shocked'], ['❤️', 'love loves'],
  ['❄️', 'cold frozen'], ['🔥', 'hot burning'], ['💧', 'wet'], ['🕊️', 'fly flies flying'], ['🏃', 'run runs running'], ['🏊', 'swim swims swimming'],
  ['👀', 'see look watch'], ['👂', 'hear listen'], ['🗣️', 'speak talk'], ['🤝', 'together share friend friends'], ['💪', 'strong strength'],
  ['⚖️', 'equal weigh'], ['🎵', 'sing singing'], ['📖', 'read reading'], ['✏️', 'write writing']
];
const keyMap = list => new Map(list.flatMap(([e, words]) => words.split(' ').map(w => [w, e])));
const THING_KEYS = keyMap(THING_EMOJI), DESCRIBE_KEYS = keyMap(DESCRIBE_EMOJI);
const NEGATION = /\b(not|no|never|without|opposite|less|lack|lacks|lacking|isn['’]t|aren['’]t|don['’]t|doesn['’]t|can['’]t|un(?!der|til|it|ion|ique|iverse)\w+)\b/i;
const lookUp = (map, t) => map.get(t) || (t.length > 3 && t.endsWith('s') ? map.get(t.slice(0, -1)) : '') || '';
export function suggestEmoji(word, meaning){
  const w = String(word ?? '').trim().toLowerCase(), d = String(meaning ?? '').toLowerCase().replace(/\([^)]*\)/g, ' ');
  if (!w || NEGATION.test(d)) return '';
  const words = d.match(/[a-z]+/g) || [], short = words.length <= 6, pick = list => [...new Set(list.filter(Boolean))].slice(0, 2).join('');
  /* a thing in the word or meaning wins ("a small boat" is ⛵, not 🐜⛵); describing words only when there's no thing */
  return pick([w, ...words].map(t => lookUp(THING_KEYS, t))) || pick([lookUp(DESCRIBE_KEYS, w), ...(short ? words.map(t => lookUp(DESCRIBE_KEYS, t)) : [])]);
}

/* 🎨 Added words that have no cartoon yet (not built in, not in CLASS_CARTOONS), each once, in the order given */
export function needsCartoon(words){
  const seen = new Set();
  return (Array.isArray(words) ? words : []).filter(v => {
    const k = String(v?.w ?? '').trim().toLowerCase();
    if (!k || seen.has(k) || BY_WORD.has(k) || CLASS_CARTOONS[k]) return false;
    seen.add(k); return true;
  });
}
/* 📋 the ready-to-paste request for Claude: the words with their meanings and example sentences, naming the skill */
export function cartoonRequest(words){
  const list = needsCartoon(words);
  if (!list.length) return '';
  const line = (v, i) => `${i + 1}. ${v.w}: means "${String(v.d || '').trim()}"${v.s ? `. Example: "${String(v.s).replace(/___/g, v.w)}"` : ''}${v.from ? ` (${v.from})` : ''}`;
  return [`Please draw Pet World word cartoons for ${list.length === 1 ? 'this word' : `these ${list.length} words`} that a grown-up or teacher added. Use the pet-world-word-cartoons skill (docs/WORD-CARTOONS.md): draw each one with the kit in scripts/word-cartoons in the same style (flat, thick rounded outlines, the Pet World palette, pets acting out the meaning, square, under 6 KB, readable at 120px, no answer text), render the contact sheets and look at them, get a fresh-eyes review for meaning and misreads, fix what it finds, run node scripts/check-word-pictures.mjs and npm run verify, and send me a patch that adds them to CLASS_CARTOONS in src/shared/wordPictures.js.`,
    '', 'Words:', ...list.map(line)].join('\n');
}

export function pictureFor(word, entry){
  const key = String(word ?? '').trim().toLowerCase();
  const p = BY_WORD.get(key);
  if (!p) {
    const photo = validWordPhoto(entry?.photo), cartoon = CLASS_CARTOONS[key];
    const chosen = validPictureEmoji(entry?.pic), emoji = chosen || (entry && !entry.noPic ? suggestEmoji(key, entry.d) : '');
    if (photo) return { w: key, kind: 'photo', emoji: emoji || cartoon?.emoji || '🖼️', src: photo.src, alt: `A photo for ${key}${photo.title ? `: ${photo.title}` : ''}.`, credit: photo.credit, source: photo.source };
    if (cartoon) return { w: key, kind: 'cartoon', emoji: cartoon.emoji, src: PICTURE_BASE + cartoon.svg, alt: cartoon.alt };
    return emoji ? { w: key, kind: 'emoji', emoji, ...(chosen ? {} : { suggested: true }), alt: cut(entry?.picAlt, 200) || `A picture to help with the word ${key}.` } : null;
  }
  if (p.photo?.file) return { w: p.w, kind: 'photo', emoji: p.emoji, src: PICTURE_BASE + p.photo.file, alt: p.photo.alt || p.alt, credit: p.photo.credit };
  if (p.svg) return { w: p.w, kind: 'cartoon', emoji: p.emoji, src: PICTURE_BASE + p.svg, alt: p.alt };
  return { w: p.w, kind: 'emoji', emoji: p.emoji, alt: p.alt };
}
