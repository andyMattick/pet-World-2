/* Grammar games for English Unit 5 (the Link Library): Pet Hide-and-Seek (prepositions of place), Cross It Out
   (subject-verb agreement with prepositional phrases) and the Comic Strip Studio (interjections and their punctuation).
   Data and checks only, no DOM: game.js draws them (renderGgame) and keeps scores in S.grammarGames.
   Docs: docs/ENGLISH-UNIT5.md */

export const GGAMES = [
  {id:'hide', course:'prepositions', group:'prepositions', emoji:'🐾', name:'Pet Hide-and-Seek',
    intro:'Two ways to play, 4 levels each. 📍 Find and place: read the clues and put your pet, then the circus animals, in the right spot. ✍️ Say where: pick the animal and the preposition that tell where everyone is. Lots of prepositions: beneath, atop, alongside, through, toward, beyond, among and more.'},
  {id:'cross', course:'prepositions', group:'prepositions', emoji:'✂️', name:'Cross It Out',
    intro:'The subject of a sentence is never inside a prepositional phrase. Tap every word of each prepositional phrase to cross it out, then pick the verb that agrees with the subject. 10 sentences, each harder than the last.'},
  {id:'comic', course:'prepositions', group:'interjections', emoji:'💥', name:'Comic Strip Studio',
    intro:'Make a comic! For each panel, pick an interjection that fits the feeling and the right punctuation: an exclamation point for a strong feeling, a comma for a mild one.'}
];
export const ggameById = id => GGAMES.find(g => g.id === id);
/* stars from first-try answers: 3 for 9+ of 10 (or all 8 comic panels), 2 for 70%+, 1 for finishing */
export const starsFor = (firstTry, total) => firstTry >= Math.ceil(total * 0.9) ? 3 : firstTry >= Math.ceil(total * 0.7) ? 2 : 1;

/* ---------- 🐾 Pet Hide-and-Seek ----------
   A living room. Each hiding spot has a place on the picture (left %, top %), whether the pet is drawn behind the
   furniture there, and every prepositional phrase that correctly says where it is. */
export const ROOM = [
  {id:'window', emoji:'🪟', x:13, y:30, size:5.2},
  {id:'picture', emoji:'🖼️', x:48, y:16, size:3.6},
  {id:'shelf', emoji:'📚', x:88, y:36, size:4.6, shelf:true},
  {id:'couch', emoji:'🛋️', x:25, y:66, size:8},
  {id:'table', emoji:'', x:66, y:66, table:true},
  {id:'box', emoji:'📦', x:7, y:82, size:4.6},
  {id:'basket', emoji:'🧺', x:41, y:84, size:3.8},
  {id:'plant', emoji:'🪴', x:91, y:78, size:5.2},
  {id:'rug', emoji:'', x:52, y:93, rug:true}
];
export const SPOTS = [
  {id:'underTable', x:66, y:78, phrases:['under the table', 'beneath the table', 'below the table']},
  {id:'onTable', x:66, y:52, phrases:['on the table', 'on top of the table']},
  {id:'inBox', x:7, y:76, behind:true, phrases:['in the box', 'inside the box']},
  {id:'onCouch', x:21, y:57, phrases:['on the couch', 'on top of the couch']},
  {id:'behindPlant', x:93, y:70, behind:true, phrases:['behind the plant']},
  {id:'between', x:46, y:70, phrases:['between the couch and the table']},
  {id:'onShelf', x:88, y:20, phrases:['on the shelf', 'on top of the shelf']},
  {id:'nextBasket', x:34, y:85, phrases:['next to the basket', 'beside the basket', 'near the basket']},
  {id:'window', x:13, y:41, phrases:['in front of the window', 'near the window']},
  {id:'onRug', x:57, y:91, phrases:['on the rug']}
];
export const HIDE_PREPS = ['in', 'inside', 'on', 'on top of', 'under', 'beneath', 'below', 'behind', 'between', 'next to', 'beside', 'near', 'in front of'];
export const HIDE_OBJECTS = ['the table', 'the box', 'the couch', 'the plant', 'the shelf', 'the basket', 'the window', 'the rug', 'the couch and the table'];
export const HIDE_ROUNDS = 10;
/* the living room levels (hideSeek.js: p1 find, s1 say). newHideRounds is the first version's 10 mixed rounds */
export function newHideRounds(rand = Math.random){
  const order = [...SPOTS].sort(() => rand() - 0.5);
  return Array.from({length:HIDE_ROUNDS}, (_, i) => {
    const spot = order[i % order.length];
    return {mode:i % 2 ? 'tell' : 'find', spot:spot.id, clue:spot.phrases[Math.floor(rand() * spot.phrases.length)]};
  });
}
export const spotById = id => SPOTS.find(s => s.id === id);
export const tellIsRight = (spotId, prep, obj) => !!spotById(spotId)?.phrases.includes(`${prep} ${obj}`);

/* ---------- ✂️ Cross It Out ----------
   [brackets] mark each prepositional phrase, ^ marks the subject, ___ is the verb. verbs: [right, wrong]. */
export const CROSS_SENTENCES = [
  {text:'The box^ [of crayons] ___ on my desk.', verbs:['is', 'are']},
  {text:'The leaves^ [on the old oak tree] ___ turning orange.', verbs:['are', 'is']},
  {text:'The sound^ [of the drums] ___ really loud.', verbs:['is', 'are']},
  {text:'A basket^ [with three kittens] ___ by the door.', verbs:['sits', 'sit']},
  {text:'The players^ [on the soccer team] ___ ready.', verbs:['are', 'is']},
  {text:'The noise^ [from the trucks] ___ the baby awake.', verbs:['keeps', 'keep']},
  {text:'One^ [of my friends] ___ a pet snake.', verbs:['has', 'have']},
  {text:'The keys^ [to the car] ___ [in the drawer].', verbs:['are', 'is']},
  {text:'Each^ [of the puppies] [in the litter] ___ a name.', verbs:['has', 'have']},
  {text:'The pictures^ [on the wall] [of my room] ___ crooked.', verbs:['are', 'is']}
];
/* words: [{w, phrase (index or -1), subject, blank}] */
export function parseCross(text){
  const words = []; let phrase = -1, count = -1;
  for (const raw of text.split(/\s+/)) {
    let w = raw;
    if (w.startsWith('[')) { count++; phrase = count; w = w.slice(1); }
    const closes = /\]/.test(w); w = w.replace(']', '');
    const subject = w.includes('^'); w = w.replace('^', '');
    words.push({w, phrase, subject, blank:w.startsWith('___')});
    if (closes) phrase = -1;
  }
  return words;
}
export const crossTargets = words => words.map((x, i) => (x.phrase >= 0 ? i : -1)).filter(i => i >= 0);

/* ---------- 💥 Comic Strip Studio ----------
   feel: 'strong' needs an exclamation point, 'mild' needs a comma, 'either' takes both. */
export const COMIC_PANELS = [
  {scene:'🏆📝🎉', setup:'You just won the spelling bee.', feel:'strong', fits:['Hooray', 'Yay', 'Wow', 'Yippee'], rest:'I won', end:'!'},
  {scene:'🐝💪😨', setup:'A bee lands on your arm.', feel:'strong', fits:['Yikes', 'Eek', 'Oh no'], rest:'Get it off', end:'!'},
  {scene:'🍦⬇️😢', setup:'Your ice cream slides off the cone.', feel:'either', fits:['Oops', 'Oh no', 'Ugh', 'Aw'], rest:'my ice cream fell', end:'.'},
  {scene:'🍨🍫🤔', setup:'Your friend asks which ice cream flavor is the best.', feel:'mild', fits:['Hmm', 'Well', 'Um'], rest:'let me think about that', end:'.'},
  {scene:'📚🗣️🤫', setup:'Your little brother is shouting in the library.', feel:'mild', fits:['Shh', 'Hey'], rest:'people are reading', end:'.'},
  {scene:'🦶🧱💥', setup:'You stub your toe on a brick.', feel:'strong', fits:['Ouch', 'Ow'], rest:'That really hurts', end:'!'},
  {scene:'🥾⛰️😮‍💨', setup:'You finally reach the top of a long, steep hike.', feel:'either', fits:['Phew', 'Whew', 'Wow'], rest:'we made it', end:'.'},
  {scene:'🎆🌃✨', setup:'Fireworks light up the whole sky.', feel:'strong', fits:['Wow', 'Whoa', 'Ooh'], rest:'Look at that', end:'!'}
];
export const COMIC_WORDS = ['Hooray', 'Yay', 'Yippee', 'Wow', 'Whoa', 'Ooh', 'Yikes', 'Eek', 'Oh no', 'Oops', 'Ugh', 'Aw', 'Hmm', 'Well', 'Um', 'Shh', 'Hey', 'Ouch', 'Ow', 'Phew', 'Whew'];
/* what's wrong with a choice: '' if right, or 'word' / 'mark' */
export function comicCheck(panel, word, mark){
  if (!panel.fits.includes(word)) return 'word';
  if (panel.feel === 'strong' && mark !== '!') return 'mark';
  if (panel.feel === 'mild' && mark !== ',') return 'mark';
  return '';
}
/* the finished line: "Ouch! That really hurts!" or "Oops, my ice cream fell." */
export function comicLine(panel, word, mark){
  const rest = mark === '!' ? panel.rest.charAt(0).toUpperCase() + panel.rest.slice(1) : panel.rest.charAt(0).toLowerCase() + panel.rest.slice(1);
  const keepCap = /^(I|I’m)\b/.test(panel.rest) ? panel.rest : rest;
  return `${word}${mark} ${keepCap}${panel.end}`;
}
