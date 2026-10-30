/* ⚖️ Rule Court (English Unit 9, the 📏 Rule Library; docs/ENGLISH-UNIT9.md, docs/RULE-COURT.md)
   Sentences are on trial for breaking the rules of standard English. She is the judge. Each case climbs three steps:
     1. The verdict: guilty (it breaks a rule) or not guilty (it follows every rule; some innocent sentences look guilty).
     2. The charge: which rule it broke. Then, for most cases, she points to the culprit word in the sentence.
     3. The sentence: she picks the fix. Every wrong fix says why it doesn't work.
   Any mistake sends the case back for a retrial at the end of the docket, so every session ends with every case closed.
   A case closed with no mistakes is "perfect"; stars come from perfect cases (starsFor). Four dockets: one per Khan
   lesson, easy to hard inside each, then the Supreme Court mixes all six rules with three charges to choose from.

   No DOM and no saving here: the game screen is renderRuleCourt in src/game/game.js, and the Arcade copy is
   arcade/rule-court/index.html. Both use newCourtRun, courtAct and courtHTML, so there is one game to fix.

   A case: text (the sentence on trial), guilty, charge (a CHARGES id), culprit (the word or words to point at, matched
   without punctuation; null skips that step, as for fragments, where something is missing instead), fixes ([text, why],
   the first one right), why (shown when the case closes), note (an extra fact the judge needs). */

export const CHARGES = {
  agree:{name:'Subject-verb agreement', emoji:'🔁', rule:'A verb has to match its subject: singular with singular, plural with plural.', tap:'Tap the verb that doesn’t match its subject.'},
  pronoun:{name:'Pronoun-antecedent agreement', emoji:'👉', rule:'A pronoun has to match the word it stands for: it or its for one thing, they or their for more than one.', tap:'Tap the pronoun that doesn’t match.'},
  fragment:{name:'Sentence fragment', emoji:'🧩', rule:'A sentence needs a subject, a verb, and a complete thought.'},
  runon:{name:'Run-on or comma splice', emoji:'🚂', rule:'Two complete sentences need a period, a semicolon, or a comma plus a joining word between them.', tap:'Tap the last word of the first sentence, where the crash happens.'},
  dangling:{name:'Dangling modifier', emoji:'🪝', rule:'An opening phrase describes whoever comes right after the comma, so the right doer has to be there.', tap:'Tap the word the opening phrase wrongly describes.'},
  parallel:{name:'Parallel structure', emoji:'🛤️', rule:'Items in a list or a pair have to be in the same form.', tap:'Tap the word that breaks the pattern.'}
};

export const COURT_DOCKETS = [
  {id:'agreement', name:'Docket 1: Agreement Court', emoji:'🔁', charges:['agree', 'pronoun'], blurb:'Verbs and pronouns that don’t match the words they go with.'},
  {id:'fragments', name:'Docket 2: Night Court', emoji:'🌙', charges:['fragment', 'runon'], blurb:'Sentences with parts missing, and sentences that crash into each other.'},
  {id:'modifiers', name:'Docket 3: Appeals Court', emoji:'🪝', charges:['dangling', 'parallel'], blurb:'Phrases that describe the wrong thing, and lists that don’t match.'},
  {id:'supreme', name:'Docket 4: Supreme Court', emoji:'🏛️', charges:Object.keys(CHARGES), blurb:'All six rules, the trickiest cases, and three charges to choose from.'}
];

export const COURT_CASES = [
  /* Docket 1: Agreement Court */
  {docket:'agreement', level:1, title:'The Barking Beagles', text:'The beagles next door barks all night.', guilty:true, charge:'agree', culprit:['barks'],
    fixes:[['The beagles next door bark all night.', 'Beagles is plural, so the verb is bark.'], ['The beagles next door is barking all night.', 'Is is singular, but beagles is plural.'], ['The beagle next door bark all night.', 'Now the subject is one beagle, so it would need barks.']]},
  {docket:'agreement', level:1, title:'The Muffin Tray', text:'Each of the muffins has a blueberry on top.', guilty:false, charge:'agree',
    why:'Each is singular, so has is right. The words “of the muffins” don’t change the subject.'},
  {docket:'agreement', level:1, title:'The Lost Leash', text:'The puppy lost their leash at the park.', guilty:true, charge:'pronoun', culprit:['their'],
    fixes:[['The puppy lost its leash at the park.', 'One puppy, so the pronoun is its.'], ['The puppy lost it’s leash at the park.', 'It’s means it is. The pronoun that shows owning is its.'], ['The puppy lost they’re leash at the park.', 'They’re means they are, and there is only one puppy.']]},
  {docket:'agreement', level:2, title:'The Crayon Box', text:'The box of crayons are on the top shelf.', guilty:true, charge:'agree', culprit:['are'],
    fixes:[['The box of crayons is on the top shelf.', 'Cross out “of crayons”: the subject is box, so the verb is is.'], ['The box of crayons were on the top shelf.', 'Were is plural too. The subject is one box.'], ['The boxes of crayon is on the top shelf.', 'Now the subject is boxes, which is plural, so is doesn’t fit.']]},
  {docket:'agreement', level:2, title:'The Twin Trophies', text:'Ava and Zoe polished their trophies.', guilty:false, charge:'pronoun',
    why:'Two people joined by and are plural, so their fits.'},
  {docket:'agreement', level:2, title:'The Scoreboard', text:'Neither the coach nor the players knows the score.', guilty:true, charge:'agree', culprit:['knows'],
    fixes:[['Neither the coach nor the players know the score.', 'With nor, the verb matches the closer subject. Players is plural, so know.'], ['Neither the coach nor the players is knowing the score.', 'Is is singular, and the closer subject, players, is plural.'], ['Neither the coach or the players knows the score.', 'Swapping nor for or doesn’t fix it. The closer subject is still players, so know.']]},
  {docket:'agreement', level:3, title:'The Garden Gnomes', text:'One of the gnomes in the garden lost their hat.', guilty:true, charge:'pronoun', culprit:['their'],
    fixes:[['One of the gnomes in the garden lost its hat.', 'The antecedent is one, which is singular, so its.'], ['One of the gnomes in the garden lost they’re hat.', 'They’re means they are.'], ['One of the gnome in the garden lost their hat.', 'The antecedent is still one, so the pronoun has to be its.']]},
  {docket:'agreement', level:3, title:'The Hidden Socks', text:'Under the couch was two socks and a sandwich.', guilty:true, charge:'agree', culprit:['was'],
    fixes:[['Under the couch were two socks and a sandwich.', 'The subject comes after the verb: two socks and a sandwich, which is plural.'], ['Under the couch was two sock and a sandwich.', 'Two things joined by and are still plural.'], ['Under the couch is two socks and a sandwich.', 'Is is singular too, and the subject is plural.']]},

  /* Docket 2: Night Court */
  {docket:'fragments', level:1, title:'The Runaway Runner', text:'Ran all the way home.', guilty:true, charge:'fragment', culprit:null,
    fixes:[['Max ran all the way home.', 'Now it has a subject, Max, to go with the verb ran.'], ['Ran all the way home, quickly.', 'It still doesn’t say who ran.'], ['Running all the way home.', 'Still no subject, and running alone isn’t a full verb.']]},
  {docket:'fragments', level:1, title:'The Movie Night', text:'The movie ended, we clapped.', guilty:true, charge:'runon', culprit:['ended'],
    fixes:[['The movie ended, and we clapped.', 'A comma plus and can join two complete sentences.'], ['The movie ended we clapped.', 'Taking out the comma makes it a run-on.'], ['The movie, ended, we clapped.', 'More commas can’t hold two sentences together.']]},
  {docket:'fragments', level:1, title:'The Quiet Command', text:'Close the door.', guilty:false, charge:'fragment',
    why:'A command has an understood subject, you. “(You) close the door” is a complete sentence.'},
  {docket:'fragments', level:2, title:'The Burned Cake', text:'Because the cake was burned.', guilty:true, charge:'fragment', culprit:null,
    fixes:[['We ate pie because the cake was burned.', 'Now the because part is attached to a complete sentence.'], ['Because the cake was burned and smoky.', 'It still starts with because and never finishes the thought.'], ['Because, the cake was burned.', 'A comma doesn’t finish the thought.']]},
  {docket:'fragments', level:2, title:'The Thunderstorm', text:'The thunder boomed the dog hid under the bed.', guilty:true, charge:'runon', culprit:['boomed'],
    fixes:[['The thunder boomed; the dog hid under the bed.', 'A semicolon joins two complete sentences.'], ['The thunder boomed, the dog hid under the bed.', 'A comma alone makes a comma splice.'], ['The thunder boomed the dog, hid under the bed.', 'That comma is in the wrong place. The two sentences still crash.']]},
  {docket:'fragments', level:2, title:'The Cookie Jar', text:'Who ate the last cookie?', guilty:false, charge:'fragment',
    why:'A question can be a complete sentence. Who is the subject, and ate is the verb.'},
  {docket:'fragments', level:3, title:'The Hard Test', text:'I studied all week, however, the test was hard.', guilty:true, charge:'runon', culprit:['week'],
    fixes:[['I studied all week; however, the test was hard.', 'However isn’t a joining word, so it needs a semicolon before it.'], ['I studied all week, however the test was hard.', 'A comma before however still makes a comma splice.'], ['I studied all week however, the test was hard.', 'With no mark before however, it’s a run-on.']]},
  {docket:'fragments', level:3, title:'The Spelling Champ', text:'The girl who won the spelling bee last spring.', guilty:true, charge:'fragment', culprit:null,
    fixes:[['The girl who won the spelling bee last spring is my cousin.', 'Now the girl has a verb: is.'], ['The girl, who won the spelling bee last spring.', 'Commas don’t add the missing verb.'], ['The girl who won the spelling bee last spring and the one before.', 'It’s longer, but the girl still has no verb.']]},

  /* Docket 3: Appeals Court */
  {docket:'modifiers', level:1, title:'The Flying Buildings', text:'Flying over the city, the buildings looked tiny.', guilty:true, charge:'dangling', culprit:['buildings'],
    fixes:[['Flying over the city, we thought the buildings looked tiny.', 'We were flying, so “we” comes right after the comma.'], ['Flying over the city, the buildings looked very tiny.', 'The buildings still seem to be flying.'], ['The buildings, flying over the city, looked tiny.', 'Now the buildings are flying even more clearly.']]},
  {docket:'modifiers', level:1, title:'The Picnic Basket', text:'We packed sandwiches, apples, and lemonade.', guilty:false, charge:'parallel',
    why:'All three things in the list are nouns, so the list is parallel.'},
  {docket:'modifiers', level:1, title:'The Lopsided List', text:'I like reading, swimming, and to bake.', guilty:true, charge:'parallel', culprit:['to', 'bake'],
    fixes:[['I like reading, swimming, and baking.', 'All three are -ing words now.'], ['I like reading, to swim, and to bake.', 'Now reading doesn’t match the other two.'], ['I like reading, swimming, and to baking.', 'To baking isn’t a form that matches anything.']]},
  {docket:'modifiers', level:2, title:'The Muddy Puppy', text:'Covered in mud, Dad hosed off the puppy.', note:'Witness statement: the puppy was the muddy one, not Dad.', guilty:true, charge:'dangling', culprit:['Dad'],
    fixes:[['Dad hosed off the puppy, which was covered in mud.', 'Now covered in mud describes the puppy.'], ['Covered in mud, Dad hosed off the puppy fast.', 'It still says Dad was covered in mud.'], ['Covered in mud, the hose was used on the puppy.', 'Now the hose is covered in mud.']]},
  {docket:'modifiers', level:2, title:'The Talent Show', text:'Tia can sing, dance, and juggle.', guilty:false, charge:'parallel',
    why:'Sing, dance, and juggle are all the same kind of verb, so the list is parallel.'},
  {docket:'modifiers', level:2, title:'The Homework Hero', text:'After finishing my homework, the TV was turned on.', guilty:true, charge:'dangling', culprit:['TV'],
    fixes:[['After finishing my homework, I turned on the TV.', 'I finished the homework, so “I” comes right after the comma.'], ['After finishing my homework, the TV turned on.', 'The TV didn’t do the homework.'], ['The TV was turned on after finishing my homework.', 'It still never says who finished the homework.']]},
  {docket:'modifiers', level:3, title:'The School Bus', text:'You can either take the bus or walking to school.', guilty:true, charge:'parallel', culprit:['walking'],
    fixes:[['You can either take the bus or walk to school.', 'Take and walk match after either and or.'], ['You can either take the bus or to walk to school.', 'To walk doesn’t match take.'], ['Either you can take the bus or walking to school.', 'Moving either doesn’t fix walking.']]},
  {docket:'modifiers', level:3, title:'The Championship', text:'Holding the trophy high, the crowd cheered for Coach Kim.', note:'Witness statement: Coach Kim was the one holding the trophy.', guilty:true, charge:'dangling', culprit:['crowd'],
    fixes:[['Holding the trophy high, Coach Kim waved to the cheering crowd.', 'Coach Kim held the trophy, so Coach Kim comes right after the comma.'], ['Holding the trophy high, the crowd cheered loudly for Coach Kim.', 'The crowd still seems to be holding the trophy.'], ['The crowd, holding the trophy high, cheered for Coach Kim.', 'Now the crowd is holding the trophy for sure.']]},

  /* Docket 4: Supreme Court (all six rules) */
  {docket:'supreme', level:2, title:'The Choir', text:'One of the singers in the choir have a cold.', guilty:true, charge:'agree', culprit:['have'],
    fixes:[['One of the singers in the choir has a cold.', 'The subject is one, so the verb is has.'], ['One of the singers in the choir are having a cold.', 'Are is plural, and one is singular.'], ['One of the singer in the choir have a cold.', 'The subject is still one, so have doesn’t fit.']]},
  {docket:'supreme', level:2, title:'The Field Trip', text:'Although the bus was late, we still made it to the museum.', guilty:false, charge:'fragment',
    why:'The although part is finished by a complete sentence: we still made it to the museum.'},
  {docket:'supreme', level:2, title:'The Bake Sale', text:'Either the cupcakes or the pie will lose their frosting.', guilty:true, charge:'pronoun', culprit:['their'],
    fixes:[['Either the cupcakes or the pie will lose its frosting.', 'With or, the pronoun matches the closer word, pie, which is singular.'], ['Either the cupcakes or the pie will lose it’s frosting.', 'It’s means it is.'], ['Either the cupcakes or the pies will lose its frosting.', 'Now the closer word, pies, is plural, so its doesn’t match.']]},
  {docket:'supreme', level:3, title:'The Snow Day', text:'Hoping for a snow day, the weather report was on all night.', guilty:true, charge:'dangling', culprit:['weather', 'report'],
    fixes:[['Hoping for a snow day, we left the weather report on all night.', 'We were hoping, so “we” comes right after the comma.'], ['Hoping for a snow day, the weather report stayed on all night long.', 'The weather report still seems to be hoping.'], ['The weather report, hoping for a snow day, was on all night.', 'Now the report is hoping even more clearly.']]},
  {docket:'supreme', level:3, title:'The Science Fair', text:'The judges liked her poster, her model, and that she explained it clearly.', guilty:true, charge:'parallel', culprit:['that'],
    fixes:[['The judges liked her poster, her model, and her clear explanation.', 'Three noun phrases in the same form.'], ['The judges liked her poster, her model, and explaining it clearly.', 'Explaining doesn’t match her poster and her model.'], ['The judges liked her poster, her model, and how she explained it so clearly.', 'A how clause still doesn’t match the two nouns.']]},
  {docket:'supreme', level:3, title:'The Craft Table', text:'The jar of glitter and the box of beads are on the craft table.', guilty:false, charge:'agree',
    why:'The subject is two things joined by and: the jar and the box. That’s plural, so are fits.'},
  {docket:'supreme', level:3, title:'The Mountain Trail', text:'The trail was steep we kept climbing anyway.', guilty:true, charge:'runon', culprit:['steep'],
    fixes:[['The trail was steep, but we kept climbing anyway.', 'A comma plus but joins the two sentences and shows the contrast.'], ['The trail was steep, we kept climbing anyway.', 'A comma alone is a comma splice.'], ['The trail was steep, therefore we kept climbing anyway.', 'Therefore isn’t a joining word, so this is still a comma splice.']]},
  {docket:'supreme', level:3, title:'The Rainy Bus Stop', text:'Waiting for the bus in the rain while the thunder rolled.', guilty:true, charge:'fragment', culprit:null,
    fixes:[['We waited for the bus in the rain while the thunder rolled.', 'Now there’s a subject, we, and a verb, waited.'], ['Waiting for the bus, in the rain, while the thunder rolled.', 'More commas don’t add a subject or a verb.'], ['While the thunder rolled, waiting for the bus in the rain.', 'It still has no subject doing the waiting.']]}
];

export const casesOn = docket => COURT_CASES.filter(c => c.docket === docket);
export const courtWords = text => String(text).split(' ');
const bare = w => String(w).replace(/[^\p{L}\p{N}’'-]/gu, '').toLowerCase();
/* true when word i of the sentence is (part of) the culprit */
export const isCulprit = (c, i) => !!c.culprit && c.culprit.map(bare).includes(bare(courtWords(c.text)[i]));

const JURY = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'];
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* a new session of one docket: cases in docket order (easy to hard), mistakes come back at the end */
export function newCourtRun(docket, rnd = Math.random){
  const list = casesOn(docket);
  const run = {docket, list, queue:list.map((_, i) => i), missed:new Set(), closed:0, perfect:0, streak:0, bestStreak:0, rnd, done:false};
  openCase(run); return run;
}
function openCase(run){
  run.cur = run.queue.shift();
  const c = run.list[run.cur], d = COURT_DOCKETS.find(k => k.id === run.docket);
  run.phase = 'verdict'; run.msg = ''; run.ok = null; run.taps = [];
  /* the charges to choose from: the docket's two, or (Supreme Court) the right one and two others */
  run.chargeOrder = d.charges.length <= 2 ? shuffled(d.charges, run.rnd) : shuffled([c.charge, ...shuffled(d.charges.filter(k => k !== c.charge), run.rnd).slice(0, 2)], run.rnd);
  run.fixOrder = c.fixes ? shuffled(c.fixes.map((_, i) => i), run.rnd) : [];
}
function mistake(run, why){
  const c = run.list[run.cur];
  run.missed.add(run.cur); run.queue.push(run.cur);   // back on the docket every time, until it's closed
  run.streak = 0; run.ok = false; run.phase = 'retrial';
  run.msg = `${why} This case goes back on the docket for a retrial.`;
  return c;
}
function closeCase(run, msg){
  run.phase = 'closed'; run.ok = true; run.closed++;
  if (!run.missed.has(run.cur)) { run.perfect++; run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak); }
  run.msg = msg;
}
/* one action: {verdict:'guilty'|'innocent'} {charge:id} {tap:i} {fix:i} {next:true}. Returns 'good', 'bad', 'done' or ''. */
export function courtAct(run, a){
  if (run.done) return '';
  const c = run.list[run.cur];
  if (a.next && (run.phase === 'closed' || run.phase === 'retrial')) {
    if (!run.queue.length) { run.done = true; return 'done'; }
    openCase(run); return '';
  }
  if (run.phase === 'verdict' && a.verdict) {
    const saysGuilty = a.verdict === 'guilty';
    if (saysGuilty !== c.guilty) {
      mistake(run, c.guilty ? 'Objection! This sentence breaks one of the rules. Read it again slowly and look at how its parts fit together.' : `Not so fast! This sentence follows the rules. ${c.why}`);
      return 'bad';
    }
    if (!c.guilty) { closeCase(run, `🔨 Case dismissed! ${c.why}`); return 'good'; }
    run.phase = 'charge'; run.msg = 'Guilty! Now name the charge.'; run.ok = true; return 'good';
  }
  if (run.phase === 'charge' && a.charge) {
    if (a.charge !== c.charge) { mistake(run, `That isn’t the charge. ${CHARGES[a.charge]?.name || 'That rule'}: ${CHARGES[a.charge]?.rule || ''}`.trim()); return 'bad'; }
    run.phase = c.culprit ? 'culprit' : 'fix';
    run.msg = c.culprit ? `${CHARGES[c.charge].emoji} ${CHARGES[c.charge].name}! ${CHARGES[c.charge].tap}` : `${CHARGES[c.charge].emoji} ${CHARGES[c.charge].name}! Something is missing. Pick the fix.`;
    run.ok = true; return 'good';
  }
  if (run.phase === 'culprit' && a.tap != null) {
    if (!isCulprit(c, a.tap)) { mistake(run, `That word is following the rules. Look for the word that breaks this one: ${CHARGES[c.charge].rule}`); return 'bad'; }
    run.taps = courtWords(c.text).map((_, i) => i).filter(i => isCulprit(c, i));
    run.phase = 'fix'; run.msg = '🎯 Caught it! Now pick the fix.'; run.ok = true; return 'good';
  }
  if (run.phase === 'fix' && a.fix != null) {
    const f = c.fixes[a.fix]; if (!f) return '';
    if (a.fix !== 0) { mistake(run, `That fix doesn’t work: ${f[1]}`); return 'bad'; }
    closeCase(run, `🔨 Guilty as charged, and fixed! ${f[1]}`); return 'good';
  }
  return '';
}

/* the game's HTML for the current run (buttons carry data-rc-*; the caller turns clicks into courtAct actions) */
export function courtHTML(run, esc){
  const c = run.list[run.cur], total = run.list.length;
  const words = courtWords(c.text).map((w, i) => run.phase === 'culprit'
    ? `<button type="button" class="rc-word" data-rc-tap="${i}">${esc(w)}</button>`
    : `<span class="rc-word${run.taps.includes(i) ? ' rc-caught' : ''}">${esc(w)}</span>`).join(' ');
  const fixed = run.phase === 'closed' && c.guilty;
  const jury = run.ok === false ? JURY.map(() => '😱').join('') : run.phase === 'closed' ? `${JURY.join('')} 👏` : JURY.join('');
  let ask = '';
  if (run.phase === 'verdict') ask = `<p class="rc-ask">How do you find this sentence?</p><div class="row rc-choices"><button type="button" class="btn berry" data-rc-verdict="guilty">🔨 Guilty</button><button type="button" class="btn" data-rc-verdict="innocent">🕊️ Not guilty</button></div>`;
  else if (run.phase === 'charge') ask = `<p class="rc-ask">What’s the charge?</p><div class="rc-list">${run.chargeOrder.map(k => `<button type="button" class="btn" data-rc-charge="${k}">${CHARGES[k].emoji} ${esc(CHARGES[k].name)}</button>`).join('')}</div>`;
  else if (run.phase === 'culprit') ask = `<p class="rc-ask">👆 ${esc(CHARGES[c.charge].tap)}</p>`;
  else if (run.phase === 'fix') ask = `<p class="rc-ask">Which fix makes it follow the rule?</p><div class="rc-list">${run.fixOrder.map(i => `<button type="button" class="btn rc-fix" data-rc-fix="${i}">${esc(c.fixes[i][0])}</button>`).join('')}</div>`;
  const next = run.phase === 'closed' || run.phase === 'retrial'
    ? `<div class="row"><button type="button" class="btn berry" data-rc-next>${run.queue.length ? (run.phase === 'closed' ? 'Next case' : 'Next case (this one comes back)') : 'Close the docket'}</button></div>` : '';
  return `<p class="rc-status"><b>⚖️ ${run.closed} of ${total} closed</b> · ⭐ ${run.perfect} perfect${run.streak >= 2 ? ` · 🔥 ${run.streak} in a row` : ''}${run.queue.length ? ` · 📂 ${run.queue.length} waiting` : ''}</p>
    <div class="rc-bench"><p class="rc-title">📜 The People v. ${esc(c.title)}${run.missed.has(run.cur) && run.phase === 'verdict' ? ' <span class="muted">(retrial)</span>' : ''} <span class="rc-round">Round ${c.level}</span></p>
      ${c.note ? `<p class="muted rc-note">🗒️ ${esc(c.note)}</p>` : ''}
      <p class="rc-sentence${fixed ? ' rc-fixed' : ''}">${fixed ? esc(c.fixes[0][0]) : words}</p>
      <p class="rc-jury" aria-hidden="true">${jury}</p></div>
    ${ask}
    ${run.msg ? `<p class="${run.ok === false ? 'rc-bad' : 'rc-good'}" role="status">${esc(run.msg)}</p>` : ''}
    ${next}`;
}

/* shared look for the game and its Arcade copy (both pages define --berry, --butter, --edge, --ink-soft) */
export const COURT_CSS = `
.rc-status{margin:6px 0}
.rc-bench{border:3px solid var(--edge, #2F3A4A); border-radius:16px; padding:10px 12px; margin:8px 0; background:linear-gradient(#f6ead7, #efe0c6); color:#3a2a10}
.rc-title{font-weight:800; margin:0 0 4px}
.rc-round{display:inline-block; font-size:.8em; padding:1px 8px; border-radius:999px; background:#3a2a10; color:#fff; margin-left:4px; vertical-align:middle}
.rc-note{margin:2px 0; color:#5b4523}
.rc-sentence{font-size:1.3em; line-height:1.9; margin:8px 0 4px; overflow-wrap:anywhere}
.rc-sentence{text-align:left; word-spacing:normal}
.rc-word{font:inherit; color:inherit; border:0; background:none; padding:0; border-radius:8px}
button.rc-word{padding:0 .1em}
button.rc-word{border-bottom:3px dotted var(--berry, #E4577A); cursor:pointer; min-height:36px}
button.rc-word:hover, button.rc-word:focus{background:var(--butter, #FFD76A)}
.rc-caught{background:#ffd0d0; text-decoration:line-through wavy #c0392b}
.rc-fixed{color:#1f6b45; font-weight:700}
.rc-jury{font-size:1.4em; letter-spacing:.15em; margin:4px 0 0}
.rc-ask{font-weight:700; margin:10px 0 4px}
.rc-list{display:grid; gap:8px; margin:6px 0}
.rc-list .btn{text-align:left; white-space:normal}
.rc-good{font-weight:700; color:#2E7D57}
.rc-bad{font-weight:700; color:#B83659}
@media (prefers-color-scheme: dark){ .rc-good{color:#7FD1B9} .rc-bad{color:#FF9DB6} }
`;
