/* 🧩 Sentence Snap (English Unit 8, the Sentence Library; docs/ENGLISH-UNIT8.md, docs/ARCADE-GAMES.md)
   A 90-second rush at one of four shelves, one shelf per block of the unit:
     intro     sort each sentence by its job (declarative, interrogative, imperative, exclamatory)
     types     snap clause pieces into the sentence each order asks for (simple, compound, complex, compound-complex)
     subjects  slice the complete subject from the complete predicate, and tap subjects and objects
     clauses   sort phrases and clauses, fix fragments, untangle misplaced phrases, pick relative pronouns
   A right answer scores 1 and moves on; every 5 in a row adds 5 seconds. A wrong answer costs 5 seconds, stops the
   clock, and shows why before she goes on. Stars come from the number right (SNAP_SHELVES[].stars).
   The unit (renderSentenceSnap in src/game/game.js) pays coins; the Arcade copy (arcade/sentence-snap/index.html) pays
   tickets. Both use createSnap() below, so there is one list of items and one set of rules. The game never counts
   toward quizzes, tests, mastery or unlocks. No DOM work happens until createSnap() is called. */

export const SNAP_SECONDS = 90, SNAP_PENALTY = 5, SNAP_STREAK = 5, SNAP_BONUS = 5;

export const SNAP_SHELVES = [
  {id:'intro', name:'Shelf 1: Sentence sorter', emoji:'❓', blurb:'Sort each sentence by its job before the clock runs out.', stars:[8, 14, 20]},
  {id:'types', name:'Shelf 2: Clause snapper', emoji:'🧩', blurb:'Snap clause pieces into exactly the sentence each order asks for.', stars:[2, 4, 6]},
  {id:'subjects', name:'Shelf 3: Sentence slicer', emoji:'✂️', blurb:'Slice the subject from the predicate, and find the objects.', stars:[7, 12, 17]},
  {id:'clauses', name:'Shelf 4: Fragment fixer', emoji:'🔧', blurb:'Sort phrases and clauses, fix fragments, and untangle silly sentences.', stars:[5, 9, 13]}
];
export const snapStars = (shelfId, right) => { const t = SNAP_SHELVES.find(s => s.id === shelfId)?.stars || [6, 10, 14]; return right >= t[2] ? 3 : right >= t[1] ? 2 : right >= t[0] ? 1 : 0; };

/* ---------- Shelf 1: sentence types ---------- */
const TYPE_BINS = ['📢 Declarative', '❓ Interrogative', '👉 Imperative', '❗ Exclamatory'];
const TYPE_WHY = ['It makes a statement.', 'It asks a question.', 'It gives a command or makes a request; the subject, you, is understood.', 'It shows strong feeling, starting with What or How.'];
const T = (text, a, why) => ({k:'sort', text, bins:TYPE_BINS, a, why:why || TYPE_WHY[a]});
const INTRO = [
  T('The library opens at nine.', 0), T('I wonder who returned this book.', 0, 'It tells what I wonder. It’s a statement about a question, not a question.'),
  T('Maya asked where the atlas was.', 0, 'It reports a question someone asked, so it’s a statement.'), T('Nobody knows why the shelf fell.', 0),
  T('The puzzle room is upstairs.', 0), T('Our librarian collects old maps.', 0), T('Ben wants to know the time.', 0, 'It tells what Ben wants. It doesn’t ask anything itself.'),
  T('Where is the poetry shelf?', 1), T('Can you reach the top shelf?', 1), T('Did anyone see my bookmark?', 1), T('Who left this note?', 1),
  T('Is the puzzle room open today?', 1), T('Why is the clock ticking so loudly?', 1), T('You finished the book, didn’t you?', 1, 'The tag at the end (didn’t you?) turns it into a question.'),
  T('Return your books by Friday.', 2), T('Please whisper in the reading room.', 2), T('Watch out for the falling books!', 2, 'It ends with !, but it still tells someone what to do, so it’s a command.'),
  T('Tell me where the atlas is.', 2, 'It sounds like a question, but it tells someone to do something.'), T('Hand me that bookmark, please.', 2),
  T('Don’t feed the library cat!', 2, 'It tells someone what not to do. The exclamation point adds feeling, but it’s still a command.'), T('Stack the puzzles on the cart.', 2),
  T('What a giant dictionary this is!', 3), T('How quiet the room is tonight!', 3), T('What a mess the puzzle table is!', 3),
  T('How fast you read that book!', 3), T('What a funny story that was!', 3), T('How tall the bookshelves are!', 3)
];

/* ---------- Shelf 2: snap the clauses ---------- */
/* Each scene: two independent clauses in story order (a, b), the joining word that fits them, and a dependent clause.
   Text is written as it looks in the middle of a sentence; the first letter of the finished sentence is capitalized. */
const SCENES = [
  {a:'the storm knocked out the power', b:'we lit candles', c:'so', d:'while the wind howled'},
  {a:'the library opened early', b:'the line was already long', c:'but', d:'because a famous author was visiting'},
  {a:'my dog dug a hole', b:'my cat watched from the fence', c:'and', d:'after the rain stopped'},
  {a:'Leo practiced his solo', b:'he still felt nervous', c:'yet', d:'before the concert started'},
  {a:'the bus was late', b:'we missed the first bell', c:'so', d:'because traffic was heavy'},
  {a:'Ava baked muffins', b:'her brother ate three of them', c:'and', d:'when she got home from school'},
  {a:'the river flooded the road', b:'the town closed the bridge', c:'so', d:'after it rained for three days'},
  {a:'we can play outside', b:'we can build a fort in the den', c:'or', d:'while Dad makes lunch'},
  {a:'the owl hooted all night', b:'nobody in the cabin slept', c:'and', d:'until the sun came up'},
  {a:'Mia studied the map', b:'she still took a wrong turn', c:'but', d:'before the hike began'},
  {a:'the puppy chewed my shoe', b:'I wasn’t even mad', c:'but', d:'while I was at school'},
  {a:'the lights went out', b:'the audience gasped', c:'and', d:'when the play reached its last scene'}
];
export const SNAP_GOALS = {
  simple:{name:'simple', need:'one independent clause'},
  compound:{name:'compound', need:'two independent clauses'},
  complex:{name:'complex', need:'one independent clause and one dependent clause'},
  'compound-complex':{name:'compound-complex', need:'two independent clauses and a dependent clause'}
};
/* the role patterns that make a correct sentence of each type (I independent clause, D dependent clause, C joining word) */
const PATTERNS = {
  simple:['I'],
  compound:['I,CI', 'I;I'],
  complex:['D,I', 'ID'],
  'compound-complex':['D,I,CI', 'ID,CI', 'I,CID', 'I,CD,I', 'I;ID', 'I;D,I', 'D,I;I', 'ID;I']
};
const GOAL_WEIGHTS = [['simple', 1], ['compound', 3], ['complex', 3], ['compound-complex', 4]];
export function snapScene(scene){
  return [{id:'a', role:'I', text:scene.a}, {id:'b', role:'I', text:scene.b}, {id:'c', role:'C', text:scene.c}, {id:'d', role:'D', text:scene.d},
    {id:'k1', role:',', text:','}, {id:'k2', role:',', text:','}, {id:'s', role:';', text:';'}];
}
export const snapSentence = tiles => {
  const s = tiles.reduce((out, t) => (t.role === ',' || t.role === ';') ? out + t.text : out ? `${out} ${t.text}` : t.text, '');
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}.` : '';
};
const typeOfRoles = roles => Object.keys(PATTERNS).find(g => PATTERNS[g].includes(roles)) || '';
/* Check a built sentence. Returns {ok, msg}. "ok" needs the asked-for type, a correct pattern, and the two independent
   clauses in story order. */
export function snapCheck(tiles, goal){
  const roles = tiles.map(t => t.role).join(''), type = typeOfRoles(roles);
  if (!tiles.length) return {ok:false, msg:'Tap pieces to build the sentence first.'};
  const ia = tiles.findIndex(t => t.id === 'a'), ib = tiles.findIndex(t => t.id === 'b');
  if (type && ia >= 0 && ib >= 0 && ib < ia) return {ok:false, msg:'The pieces fit, but the order mixes up the story. Put the first event first.'};
  if (type === goal) return {ok:true, msg:`A ${goal} sentence: ${SNAP_GOALS[goal].need}.`};
  if (type) return {ok:false, msg:`That’s a correct ${type} sentence, but the order asks for a ${goal} one: ${SNAP_GOALS[goal].need}.`};
  if (!roles.includes('I')) return {ok:false, msg:'A dependent clause or a joining word can’t stand alone. Every sentence needs an independent clause.'};
  if (/I,I/.test(roles)) return {ok:false, msg:'A comma alone can’t join two independent clauses (that’s a comma splice). Add a joining word, or use a semicolon.'};
  if (/II/.test(roles)) return {ok:false, msg:'Two independent clauses crashed together (a run-on). Join them with a comma and a joining word, or a semicolon.'};
  if (/IC/.test(roles)) return {ok:false, msg:'Put a comma before the joining word that links two independent clauses.'};
  if (/^DI|;DI/.test(roles)) return {ok:false, msg:'Put a comma after a dependent clause that comes first.'};
  if (/I,D$/.test(roles)) return {ok:false, msg:'No comma is needed when the dependent clause comes at the end.'};
  if (/;C|C;|,C,|C,/.test(roles)) return {ok:false, msg:'Use a semicolon or a comma plus a joining word, not both.'};
  if (/C$|,$|;$|^C|^,|^;/.test(roles)) return {ok:false, msg:'A sentence can’t start or end with a joining word or a mark.'};
  if (/D$/.test(roles) && !/I/.test(roles.replace(/D$/, ''))) return {ok:false, msg:'A dependent clause needs an independent clause to lean on.'};
  return {ok:false, msg:'Those pieces don’t snap into a correct sentence. Check each comma, semicolon and joining word.'};
}
/* one correct answer for each goal, shown after a miss */
export function snapExample(scene, goal){
  const t = Object.fromEntries(snapScene(scene).map(x => [x.id, x]));
  const seq = {simple:['a'], compound:['a', 'k1', 'c', 'b'], complex:['d', 'k1', 'a'], 'compound-complex':['d', 'k1', 'a', 'k2', 'c', 'b']}[goal];
  return snapSentence(seq.map(id => t[id]));
}

/* ---------- Shelf 3: subjects, predicates and objects ---------- */
const SL = (text, cut) => ({k:'slice', text, cut});   // cut = how many words the complete subject has
const TP = (ask, text, word, why) => ({k:'tap', ask, text, a:text.split(' ').findIndex(w => w.replace(/[.,?!’]+$/u, '') === word), why});
const SUBJECTS = [
  SL('The tall girl in the red coat waved at us.', 7), SL('My little brother loves trains.', 3), SL('Three hungry geese chased us across the park.', 3),
  SL('The kids on our street play tag every evening.', 5), SL('Lions, tigers, and bears live at the city zoo.', 4), SL('The book with the torn cover belongs to Ms. Lee.', 6),
  SL('Everyone in the library stopped to listen.', 4), SL('The puzzle that Jo finished had a thousand pieces.', 5), SL('My aunt and my uncle drove to the beach.', 5),
  SL('A tiny spider spun a web in the window.', 3), SL('The old clock in the hall ticked loudly all night.', 6), SL('Our neighbor’s noisy parrot sings every morning.', 4),
  SL('The muddy boots by the door belong to Dad.', 6), SL('Two of my friends joined the chess club.', 4),
  TP('Tap the direct object.', 'Nora painted a colorful picture.', 'picture', 'Picture answers “painted what?”'),
  TP('Tap the indirect object.', 'Grandma baked us some cookies.', 'us', 'Grandma baked cookies for us, so us is the indirect object.'),
  TP('Tap the direct object.', 'Grandma baked us some cookies.', 'cookies', 'Cookies answers “baked what?”'),
  TP('Tap the indirect object.', 'Mr. Ruiz gave the class a quiz.', 'class', 'He gave the quiz to the class.'),
  TP('Tap the direct object.', 'The coach handed each player a water bottle.', 'bottle', 'Bottle answers “handed what?” (water just describes it).'),
  TP('Tap the indirect object.', 'Will you lend me your bike?', 'me', 'You would lend the bike to me.'),
  TP('Tap the indirect object.', 'I sent my cousin a postcard.', 'cousin', 'I sent the postcard to my cousin.'),
  TP('Tap the direct object.', 'I sent my cousin a postcard.', 'postcard', 'Postcard answers “sent what?”'),
  TP('Tap the direct object.', 'Dev showed his mom the trophy.', 'trophy', 'Trophy answers “showed what?”'),
  TP('Tap the simple subject.', 'One of my friends has a pet snake.', 'One', 'One is the subject; “of my friends” is a phrase that describes it.'),
  TP('Tap the simple subject.', 'The muddy boots by the door belong to Dad.', 'boots', 'The boots are what the sentence is about; “by the door” describes them.'),
  TP('Tap the simple subject.', 'Across the field raced two muddy dogs.', 'dogs', 'The dogs did the racing, even though they come after the verb.'),
  TP('Tap the verb (the simple predicate).', 'Three hungry geese chased us across the park.', 'chased', 'Chased is what the geese did.')
];

/* ---------- Shelf 4: phrases and clauses ---------- */
const PC_BINS = ['Phrase', 'Dependent clause', 'Independent clause'];
const PC_WHY = ['No subject with its own verb, so it’s a phrase.', 'It has a subject and a verb, but its first word makes it lean on another clause.', 'It has a subject and a verb and can stand alone.'];
const P = (text, a, why) => ({k:'sort', text, bins:PC_BINS, a, why:why || PC_WHY[a]});
const PK = (ask, text, opts, why) => ({k:'pick', ask, text, opts, why});
const CLAUSES = [
  P('in the dusty attic', 0), P('running down the hall', 0, 'Running is a verb form, but nobody in it is doing the running. It’s a phrase.'), P('after the long meeting', 0, 'After can start a phrase too. “The long meeting” has no verb.'),
  P('the girl with the red kite', 0), P('because of the storm', 0, '“Because of” starts a phrase. There’s no verb.'), P('to win the prize', 0), P('under the creaky stairs', 0),
  P('because the storm was loud', 1), P('after the meeting ended', 1), P('when the bell rang', 1), P('who lives next door', 1, 'Who is the subject and lives is the verb, but it can’t stand alone.'),
  P('if you finish early', 1), P('although we were tired', 1),
  P('the bell rang', 2), P('we were tired', 2), P('then the lights went out', 2, 'Then isn’t a joining word, so this clause can stand alone.'), P('she won the prize', 2), P('the owls hooted all night', 2),
  PK('Which fixes this fragment?', 'Because the shelf was wobbly.', ['Because the shelf was wobbly, we fixed it.', 'Because the shelf was wobbly and old.', 'Because, the shelf was wobbly.'], 'The dependent clause needs an independent clause: we fixed it.'),
  PK('Which fixes this fragment?', 'Running down the hall.', ['Running down the hall, Jo slipped.', 'Running down the hall very quickly.', 'Running, down the hall.'], 'The phrase needs a subject and a verb to lean on: Jo slipped.'),
  PK('Which fixes this fragment?', 'When the movie ended.', ['When the movie ended, we clapped.', 'When the movie ended at nine.', 'When the movie, ended.'], 'A when-clause needs an independent clause: we clapped.'),
  PK('Which fixes this fragment?', 'The girl with the red kite.', ['The girl with the red kite ran up the hill.', 'The girl with the red kite on the hill.', 'With the red kite, the girl.'], 'The subject needs a verb: ran.'),
  PK('Which sentence is clear?', '', ['Riding the bus, I saw a deer.', 'Riding the bus, a deer ran past me.', 'A deer ran past me, riding the bus.'], 'I was riding the bus, so I has to come right after the phrase.'),
  PK('Which sentence is clear?', '', ['Sizzling in the pan, the pancakes smelled great.', 'Sizzling in the pan, Dad flipped the pancakes.', 'Dad, sizzling in the pan, flipped the pancakes.'], 'The pancakes were sizzling, not Dad.'),
  PK('Which sentence is clear?', '', ['We gave the cookies that we baked to the neighbors.', 'We gave the cookies to the neighbors that we baked.', 'That we baked, we gave the cookies to the neighbors.'], '“That we baked” describes the cookies, so it goes right after cookies.'),
  PK('Which sentence is clear?', '', ['The girl in the blue dress sang a song.', 'The girl sang a song in the blue dress.', 'In the blue dress, a song was sung by the girl.'], 'The girl wore the dress, not the song.'),
  PK('Which relative pronoun fits?', 'That’s the boy ___ backpack fell in the pond.', ['whose', 'who', 'which'], 'Whose shows the backpack belongs to the boy.'),
  PK('Which relative pronoun fits?', 'The coach ___ we thanked gave a speech.', ['whom', 'which', 'whose'], 'We thanked him, so the coach is an object: whom (for a person).'),
  PK('Which is punctuated correctly?', '', ['My grandpa, who was born in Peru, loves soccer.', 'My grandpa who was born in Peru, loves soccer.', 'My grandpa, who was born in Peru loves soccer.'], 'The clause adds extra information, so it needs a comma on both sides.'),
  TP('Tap the noun the relative clause describes.', 'The man who fixed our roof is my uncle’s friend.', 'man', '“Who fixed our roof” tells which man.'),
  TP('Tap the noun the relative clause describes.', 'I met a girl whose dog can skateboard.', 'girl', '“Whose dog can skateboard” tells which girl.'),
  TP('Tap the noun the relative clause describes.', 'The cake that Ana baked was delicious.', 'cake', '“That Ana baked” tells which cake.')
];

export const SNAP_ITEMS = {intro:INTRO, subjects:SUBJECTS, clauses:CLAUSES};
export const snapItemCount = shelf => shelf === 'types' ? SCENES.length * Object.keys(SNAP_GOALS).length : (SNAP_ITEMS[shelf] || []).length;
export { SCENES as SNAP_SCENES, PATTERNS as SNAP_PATTERNS };

/* ---------- the shift ---------- */
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickGoal = () => { const total = GOAL_WEIGHTS.reduce((s, [, w]) => s + w, 0); let r = Math.random() * total; for (const [g, w] of GOAL_WEIGHTS) { r -= w; if (r < 0) return g; } return 'compound'; };
export function snapDeck(shelf){
  if (shelf === 'types') return shuffle(SCENES).map(scene => ({k:'build', scene, goal:pickGoal()}));
  return shuffle(SNAP_ITEMS[shelf] || []);
}
const CSS = `
.snap{--snap-ok:#2E7D57; --snap-bad:#B83659}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .snap{--snap-ok:#7FD1B9; --snap-bad:#FF9DB6} }
:root[data-theme="dark"] .snap{--snap-ok:#7FD1B9; --snap-bad:#FF9DB6}
.snap-top{display:flex; gap:8px; align-items:center; flex-wrap:wrap; font-weight:700; margin:6px 0; position:sticky; top:0; z-index:2; background:var(--surface,#fff); padding:4px 0}
.snap-clock{flex:1 1 140px; height:16px; border:3px solid var(--edge,#333); border-radius:10px; overflow:hidden; background:var(--surface,#fff); min-width:120px}
.snap-clock i{display:block; height:100%; background:var(--berry,#E4577A); transition:width .25s linear}
.snap-clock.low i{background:var(--snap-bad)}
.snap-card{background:var(--surface,#fff); border:3px solid var(--edge,#333); border-radius:16px; padding:12px; margin-top:8px}
.snap-ask{font-weight:800; margin:0 0 6px}
.snap-text{font-size:1.25em; line-height:1.6; margin:4px 0 10px; overflow-wrap:anywhere}
.snap-bins{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px}
.snap-bins.three{grid-template-columns:1fr}
.snap-opts{display:grid; gap:8px}
.snap .sbtn{border:3px solid var(--edge,#333); background:var(--surface,#fff); color:inherit; border-radius:12px; padding:10px 10px; font:inherit; font-weight:700; text-align:center; cursor:pointer; min-height:46px}
.snap .sbtn.go{background:var(--berry,#E4577A); border-color:var(--berry-deep,#B83659); color:#fff}
.snap .sbtn.right{outline:4px solid var(--snap-ok)} .snap .sbtn.wrong{outline:4px dashed var(--snap-bad); text-decoration:line-through}
.snap .sbtn:disabled{cursor:default}
.snap-words{display:flex; flex-wrap:wrap; align-items:center; gap:2px 0; font-size:1.2em; line-height:1.4}
.snap-word{border:0; background:none; color:inherit; font:inherit; padding:4px 3px; border-radius:8px; cursor:pointer}
.snap-word.tap{border:2px dashed var(--dot,#ccc)}
.snap-word.right{background:var(--butter,#FFD76A); color:#3a2a00}
.snap-word.wrong{text-decoration:line-through; color:var(--snap-bad)}
.snap-cut{border:0; background:none; width:22px; height:34px; padding:0; cursor:pointer; position:relative; color:var(--ink-soft,#777)}
.snap-cut::before{content:""; position:absolute; left:10px; top:4px; bottom:4px; border-left:2px dotted currentColor}
.snap-cut.right::before{border-left:4px solid var(--snap-ok)} .snap-cut.wrong::before{border-left:4px solid var(--snap-bad)}
.snap-tray{min-height:58px; border:3px dashed var(--berry,#E4577A); border-radius:14px; padding:6px; display:flex; flex-wrap:wrap; gap:6px; align-items:center; background:var(--bg,#fafafa)}
.snap-tray:empty::before{content:"Tap pieces to snap them here"; color:var(--ink-soft,#777); font-style:italic}
.snap-pile{display:flex; flex-wrap:wrap; gap:6px; margin-top:8px}
.snap-tile{border:3px solid var(--edge,#333); border-radius:12px; padding:6px 10px; font:inherit; font-weight:700; cursor:pointer; color:#2a2a2a; min-height:42px}
.snap-tile.I{background:#BFE3F7} .snap-tile.D{background:#FFE29A} .snap-tile.C{background:#D8C9F5} .snap-tile.p{background:#F2F2F2; min-width:42px; font-size:1.2em}
.snap-preview{font-size:1.1em; margin:8px 0 0; min-height:1.5em}
.snap-msg{font-weight:700; margin:8px 0 0} .snap-msg.ok{color:var(--snap-ok)} .snap-msg.bad{color:var(--snap-bad)}
.snap-row{display:flex; gap:8px; flex-wrap:wrap; margin-top:10px}
.snap-legend{font-size:.85em; color:var(--ink-soft,#777); margin:6px 0 0}
.snap-legend b{padding:0 4px; border-radius:6px; color:#2a2a2a}
.snap-pop{animation:snapPop .35s ease}
@keyframes snapPop{0%{transform:scale(.96)} 60%{transform:scale(1.03)} 100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){ .snap-pop{animation:none} .snap-clock i{transition:none} }
`;
function addStyle(doc){ if (doc.getElementById('snap-style')) return; const st = doc.createElement('style'); st.id = 'snap-style'; st.textContent = CSS; doc.head.appendChild(st); }

/* Mount a shift in root. opts: {shelf, esc, onDone({shelf, right, wrong, stars, seconds}), sfx?(kind)}.
   Returns {stop}. The clock stops by itself if root leaves the page. */
export function createSnap(root, opts){
  const esc = opts.esc, sfx = opts.sfx || (() => {}), doc = root.ownerDocument;
  addStyle(doc);
  const run = {shelf:opts.shelf, deck:snapDeck(opts.shelf), i:0, right:0, wrong:0, streak:0, ends:Date.now() + SNAP_SECONDS * 1000, paused:0, done:false, item:null, state:null, msg:'', ok:null, flash:''};
  const left = () => run.paused ? run.pausedLeft : Math.max(0, run.ends - Date.now());
  function next(){
    if (run.i >= run.deck.length) { run.deck = snapDeck(run.shelf); run.i = 0; }
    run.item = run.deck[run.i++];
    run.state = run.item.k === 'build' ? {tray:[], tiles:shuffle(snapScene(run.item.scene))} : run.item.k === 'pick' ? {order:shuffle(run.item.opts.map((_, i) => i))} : {};
    run.msg = ''; run.ok = null; render();
  }
  function pause(){ run.pausedLeft = left(); run.paused = 1; }
  function resume(){ run.ends = Date.now() + run.pausedLeft; run.paused = 0; }
  function answer(ok, why){
    if (run.done || run.ok !== null) return;
    run.ok = ok;
    if (ok) {
      run.right++; run.streak++;
      run.flash = run.streak % SNAP_STREAK === 0 ? `🔥 ${run.streak} in a row! +${SNAP_BONUS}s` : '';
      if (run.flash) run.ends += SNAP_BONUS * 1000;
      run.msg = `✅ ${why}`; sfx('good'); render();
      setTimeout(() => { if (!run.done && root.isConnected && run.ok === true) next(); }, 900);
    } else {
      run.wrong++; run.streak = 0; run.flash = `−${SNAP_PENALTY}s`;
      run.ends -= SNAP_PENALTY * 1000; pause();
      run.msg = why; sfx('bad'); render();
    }
  }
  function finish(){
    if (run.done) return;
    run.done = true; clearInterval(timer);
    const stars = snapStars(run.shelf, run.right);
    root.innerHTML = '';
    opts.onDone?.({shelf:run.shelf, right:run.right, wrong:run.wrong, stars});
  }
  function clockHTML(){
    const ms = left(), pct = Math.round(100 * ms / (SNAP_SECONDS * 1000));
    return `<div class="snap-clock${ms < 15000 ? ' low' : ''}" role="timer" aria-label="${Math.ceil(ms / 1000)} seconds left"><i style="width:${Math.min(100, pct)}%"></i></div><span data-snap-secs>⏱️ ${Math.ceil(ms / 1000)}s</span>`;
  }
  function itemHTML(){
    const it = run.item, st = run.state, done = run.ok !== null;
    if (it.k === 'sort') {
      const picked = st.pick;
      return `<p class="snap-ask">What kind is it?</p><p class="snap-text">${esc(it.text)}</p>
        <div class="snap-bins${it.bins.length === 3 ? ' three' : ''}">${it.bins.map((b, i) => `<button type="button" class="sbtn${done && i === it.a ? ' right' : ''}${done && i === picked && i !== it.a ? ' wrong' : ''}" data-snap-bin="${i}" ${done ? 'disabled' : ''}>${esc(b)}</button>`).join('')}</div>`;
    }
    if (it.k === 'pick') {
      return `<p class="snap-ask">${esc(it.ask)}</p>${it.text ? `<p class="snap-text">${esc(it.text)}</p>` : ''}
        <div class="snap-opts">${st.order.map(i => `<button type="button" class="sbtn${done && i === 0 ? ' right' : ''}${done && i === st.pick && i !== 0 ? ' wrong' : ''}" data-snap-opt="${i}" ${done ? 'disabled' : ''}>${esc(it.opts[i])}</button>`).join('')}</div>`;
    }
    if (it.k === 'tap') {
      const words = it.text.split(' ');
      return `<p class="snap-ask">${esc(it.ask)}</p><div class="snap-words">${words.map((w, i) => `<button type="button" class="snap-word tap${done && i === it.a ? ' right' : ''}${done && i === st.pick && i !== it.a ? ' wrong' : ''}" data-snap-word="${i}" ${done ? 'disabled' : ''}>${esc(w)}</button>`).join(' ')}</div>`;
    }
    if (it.k === 'slice') {
      const words = it.text.split(' ');
      return `<p class="snap-ask">✂️ Tap the gap where the complete subject ends and the predicate begins.</p><div class="snap-words">${words.map((w, i) => `${i ? `<button type="button" class="snap-cut${done && i === it.cut ? ' right' : ''}${done && i === st.pick && i !== it.cut ? ' wrong' : ''}" data-snap-cut="${i}" aria-label="Cut before ${esc(w)}" ${done ? 'disabled' : ''}></button>` : ''}<span class="snap-word">${esc(w)}</span>`).join('')}</div>`;
    }
    /* build */
    const used = new Set(st.tray.map(t => t.id)), goal = SNAP_GOALS[it.goal];
    const tile = (t, where) => `<button type="button" class="snap-tile ${/[,;]/.test(t.role) ? 'p' : t.role}" data-snap-${where}="${t.id}" ${done ? 'disabled' : ''}>${esc(t.text)}</button>`;
    return `<p class="snap-ask">📋 Order: build a <u>${esc(goal.name)}</u> sentence.</p>
      <div class="snap-tray" aria-label="Your sentence">${st.tray.map(t => tile(t, 'out')).join('')}</div>
      <p class="snap-preview">${st.tray.length ? `“${esc(snapSentence(st.tray))}”` : ''}</p>
      <div class="snap-pile">${st.tiles.filter(t => !used.has(t.id)).map(t => tile(t, 'in')).join('')}</div>
      <p class="snap-legend"><b style="background:#BFE3F7">blue</b> independent clause · <b style="background:#FFE29A">yellow</b> dependent clause · <b style="background:#D8C9F5">purple</b> joining word. Use only the pieces you need; the period is added for you.</p>
      ${done ? '' : `<div class="snap-row"><button type="button" class="sbtn go" data-snap-check ${st.tray.length ? '' : 'disabled'}>🧩 Snap it!</button><button type="button" class="sbtn" data-snap-clear ${st.tray.length ? '' : 'disabled'}>Clear</button></div>`}`;
  }
  function render(){
    if (run.done) return;
    root.innerHTML = `<div class="snap">
      <div class="snap-top">${clockHTML()}<span>✅ ${run.right}</span><span>${run.streak >= 2 ? `🔥 ${run.streak}` : ''}</span></div>
      ${run.flash ? `<p class="snap-msg ${run.ok === false ? 'bad' : 'ok'}" style="margin:0">${esc(run.flash)}</p>` : ''}
      <div class="snap-card${run.ok === true ? ' snap-pop' : ''}">${itemHTML()}
        ${run.msg ? `<p class="snap-msg ${run.ok ? 'ok' : 'bad'}" role="status">${esc(run.msg)}</p>` : ''}
        ${run.ok === false ? `<div class="snap-row"><button type="button" class="sbtn go" data-snap-next>${left() > 0 ? 'Got it! Next ▶' : 'Finish 🏁'}</button></div>` : ''}
      </div><p class="snap-legend">5 in a row adds ${SNAP_BONUS}s · a miss costs ${SNAP_PENALTY}s</p></div>`;
  }
  root.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || run.done || !root.contains(b)) return;
    const it = run.item, st = run.state, d = b.dataset;
    if (d.snapNext != null) { resume(); run.flash = ''; if (left() <= 0) finish(); else next(); return; }
    if (run.ok !== null) return;
    if (d.snapBin != null) { st.pick = +d.snapBin; answer(st.pick === it.a, st.pick === it.a ? it.why : `Answer: ${it.bins[it.a].replace(/^[^\p{L}]+/u, '')}. ${it.why}`); return; }
    if (d.snapOpt != null) { st.pick = +d.snapOpt; answer(st.pick === 0, st.pick === 0 ? it.why : `The right one: “${it.opts[0]}” ${it.why}`); return; }
    if (d.snapWord != null) { st.pick = +d.snapWord; const w = it.text.split(' ')[it.a]; answer(st.pick === it.a, st.pick === it.a ? it.why : `It’s “${w.replace(/[.,?!]+$/, '')}.” ${it.why}`); return; }
    if (d.snapCut != null) {
      st.pick = +d.snapCut; const w = it.text.split(' ');
      const subj = w.slice(0, it.cut).join(' ').replace(/,$/, ''), pred = w.slice(it.cut).join(' ').replace(/[.?!]$/, '');
      answer(st.pick === it.cut, `Subject: “${subj}” · Predicate: “${pred}.”`); return;
    }
    if (d.snapIn) { const t = st.tiles.find(x => x.id === d.snapIn); if (t && !st.tray.includes(t)) st.tray.push(t); render(); return; }
    if (d.snapOut) { st.tray = st.tray.filter(x => x.id !== d.snapOut); render(); return; }
    if (d.snapClear != null) { st.tray = []; render(); return; }
    if (d.snapCheck != null) {
      const r = snapCheck(st.tray, it.goal);
      answer(r.ok, r.ok ? r.msg : `${r.msg} One way: “${snapExample(it.scene, it.goal)}”`);
    }
  });
  const timer = setInterval(() => {
    if (!root.isConnected) { clearInterval(timer); run.done = true; return; }
    if (run.done || run.paused) return;
    if (left() <= 0) { finish(); return; }
    const top = root.querySelector('.snap-top');
    if (top) { const c = top.querySelector('.snap-clock'), s = top.querySelector('[data-snap-secs]'); const ms = left(); if (c) { c.querySelector('i').style.width = `${Math.min(100, Math.round(100 * ms / (SNAP_SECONDS * 1000)))}%`; c.classList.toggle('low', ms < 15000); c.setAttribute('aria-label', `${Math.ceil(ms / 1000)} seconds left`); } if (s) s.textContent = `⏱️ ${Math.ceil(ms / 1000)}s`; }
  }, 250);
  next();
  return {stop(){ clearInterval(timer); run.done = true; }};
}
