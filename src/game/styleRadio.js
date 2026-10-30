/* 🎙️ WPET Style Radio (English Unit 10, the 🪶 Style Library; docs/ENGLISH-UNIT10.md)
   The Style Library runs a radio station, WPET. She is the DJ and editor. Pets call in with lines for the air, and each
   call is a short chain of steps:
     tap    tap every word in the line that does something (all the alliterating words, every onomatopoeia, the slang
            that slipped into a formal letter). A wrong tap is a mistake; she has to find every one.
     pick   choose one of three answers (the device, the kind of irony, the formal rewrite). Every wrong one says why.
     order  tap messages from the most casual to the most formal (or as the step asks).
   A mistake drops the call ("the caller will call back"): it goes to the end of the show and comes back until it is
   finished with no mistakes or finished after a call-back. A call finished with no mistakes is "perfect"; perfect calls
   in a row multiply the listeners (📻 ratings), and stars come from perfect calls (starsFor). Four shows: the Sound
   Booth (under The sound of language), the Formality Dial and Twist and Volume (under Style and technique), then Prime
   Time, which mixes everything.

   No DOM and no saving here: the game screen is renderStyleRadio in src/game/game.js, and the Arcade copy is
   arcade/style-radio/index.html. Both use newRadioRun, radioAct and radioHTML, so there is one game to fix.

   A call: show, level (1 to 3, shown as "Round"), caller (emoji and name), title, line (what goes on the air; '' when the
   steps carry their own text), note (the situation, shown above the line), steps. Answers: tap words are matched without
   punctuation and case, and every word in the line that matches one is a target; pick options are [text, why] with the
   first one right; order items are listed in the right order. */

export const RADIO_SHOWS = [
  {id:'sound', group:'sound', name:'Show 1: The Sound Booth', emoji:'🔊', blurb:'Callers want lines that sound great. Find the alliteration, assonance and onomatopoeia by ear, not by spelling.'},
  {id:'dial', group:'technique', name:'Show 2: The Formality Dial', emoji:'🎛️', blurb:'Turn messages up and down the scale of formality, from a text to a friend to a letter to the mayor.'},
  {id:'twist', group:'technique', name:'Show 3: Twist and Volume', emoji:'🎭', blurb:'Overstatement turns it up, understatement turns it down, and irony twists it.'},
  {id:'prime', group:'technique', name:'Show 4: Prime Time', emoji:'🌟', blurb:'Everything at once: the trickiest calls of the night.'}
];

const ALLIT = 'Tap every word that alliterates (starts with the same sound).';
export const RADIO_CALLS = [
  /* Show 1: The Sound Booth */
  {show:'sound', level:1, caller:'🐝 Bea the bee', title:'The Honey Jingle', line:'Busy bees bring the best honey.', steps:[
    {tap:ALLIT, words:['Busy', 'bees', 'bring', 'best'], miss:'Listen for the sound at the start of each word: which ones start with b?'},
    {ask:'What do the words you tapped show?', options:[['Alliteration', 'Yes! Four words close together start with the b sound.'], ['Assonance', 'Assonance repeats a vowel sound inside words. These share their first consonant sound.'], ['Onomatopoeia', 'None of these words imitates a noise.']]}]},
  {show:'sound', level:1, caller:'🐄 Moo-Moo the cow', title:'The Farm Report', line:'At dawn the hens clucked, the pigs oinked, and the gate creaked.', steps:[
    {tap:'Tap every word that is onomatopoeia.', words:['clucked', 'oinked', 'creaked'], miss:'Onomatopoeia sounds like the noise it names. Say the word out loud: does it sound like the noise?'},
    {ask:'Why do those words count as onomatopoeia?', options:[['They sound like the noises they name.', 'Right! You can hear the hens, the pigs and the gate.'], ['They all start with the same sound.', 'Clucked, oinked and creaked start with different sounds. Onomatopoeia is about copying a noise.'], ['They all share the same vowel sound in the middle.', 'Their vowel sounds are different. Onomatopoeia is about copying a noise.']]}]},
  {show:'sound', level:1, caller:'🦉 Professor Hoot', title:'Night on the Hill', line:'The old owl roamed the cold grove.', steps:[
    {ask:'Which vowel sound repeats in old, roamed, cold and grove?', options:[['Long o, as in “go”', 'Yes! All four have the long o sound.'], ['Short o, as in “hot”', 'Say them out loud: old, roamed, cold and grove all have long o, as in “go.”'], ['oo, as in “moon”', 'None of them has the oo sound. They have long o, as in “go.”']]},
    {ask:'So the line is built on…', options:[['Assonance', 'Right! The same vowel sound repeats inside nearby words.'], ['Alliteration', 'Alliteration repeats the first sound. Old, roamed, cold and grove start with different sounds.'], ['Onomatopoeia', 'None of the words imitates a noise.']]}]},
  {show:'sound', level:2, caller:'🐍 Sly the snake', title:'City Slither', line:'Cindy’s city cat sat on a sunny step.', steps:[
    {tap:'Tap every word that starts with the s sound.', words:['Cindy’s', 'city', 'sat', 'sunny', 'step'], miss:'Say each word out loud. Some c’s sound like s, and some sound like k.'},
    {ask:'Why doesn’t “cat” join the alliteration?', options:[['Its c sounds like k, not s.', 'Exactly! Alliteration is about sounds, not letters.'], ['It is too short to alliterate.', 'Short words can alliterate. The problem is its sound: the c in cat sounds like k.'], ['It is the subject of the sentence.', 'Any word can alliterate. The c in cat sounds like k, not s.']]}]},
  {show:'sound', level:2, caller:'🐸 Rosa the frog', title:'Pond Mix', line:'Ribbit! The green toad leaped into the reeds.', steps:[
    {tap:'Tap the word that is onomatopoeia.', words:['Ribbit!'], miss:'Which word sounds like a noise a frog or toad makes?'},
    {ask:'Green, leaped and reeds add another device. Which one?', options:[['Assonance', 'Yes! They repeat the long e sound.'], ['Alliteration', 'Green, leaped and reeds start with different sounds. They share a vowel sound instead.'], ['Overstatement', 'Nothing is made bigger than it is. Listen to the vowels.']]}]},
  {show:'sound', level:2, caller:'🦜 Polly the parrot', title:'The Shop Slogan', line:'', note:'Polly wants a slogan for her shop that sounds great on the radio.', steps:[
    {ask:'Which word adds alliteration? Polly’s ___ pet shop', options:[['perfect', 'Polly’s perfect pet shop: four p sounds in a row.'], ['photo', 'Photo starts with p, but it sounds like f. Alliteration is about sounds.'], ['famous', 'Famous starts with the f sound, but Polly and pet start with p.']]},
    {ask:'Now add onomatopoeia: Polly’s perfect pet shop, where the parrots ___!', options:[['squawk', 'Squawk sounds like the noise a parrot makes.'], ['talk', 'Talk names something parrots do, but it doesn’t sound like the noise.'], ['play', 'Play doesn’t imitate any sound.']]}]},
  {show:'sound', level:3, caller:'🦇 Echo the bat', title:'Sounds, Not Letters', line:'', note:'Echo hears everything. Can you?', steps:[
    {ask:'Which pair alliterates?', options:[['gentle giant', 'Yes! Both start with the j sound, even though they’re spelled with g.'], ['gentle goat', 'Same letter, different sounds: gentle starts with a j sound, goat with a hard g.'], ['knotty kite in the park', 'The k in knotty is silent, so it starts with n. Kite starts with k.']]},
    {ask:'Which pair shares a vowel sound (assonance)?', options:[['boat and show', 'Yes! Both have long o, spelled two different ways.'], ['food and good', 'Same letters, different sounds: food rhymes with mood, good rhymes with hood.'], ['bread and bead', 'Bread has a short e, bead has a long e.']]}]},
  {show:'sound', level:3, caller:'🐳 Splash the whale', title:'The Big Wave', line:'Whoosh! Waves washed over the white whale.', steps:[
    {tap:'Tap every word that starts with the w sound.', words:['Whoosh!', 'Waves', 'washed', 'white', 'whale.'], miss:'Say the line out loud. Some w sounds are spelled wh.'},
    {ask:'One of those words does double duty as onomatopoeia. Which one?', options:[['Whoosh', 'Yes! Whoosh sounds like rushing water.'], ['washed', 'Washed names what the water did, but it doesn’t copy the sound.'], ['whale', 'Whale names an animal. It doesn’t copy a sound.']]}]},

  /* Show 2: The Formality Dial */
  {show:'dial', level:1, caller:'🐔 Hattie the hen', title:'A Letter to the Mayor', line:'', note:'Hattie is writing to the mayor to ask for a new park.', steps:[
    {order:'Tap the greetings from the most casual to the most formal.', items:['Sup, Mayor!', 'Hey there, Mayor Ruiz!', 'Dear Mayor Ruiz,'], miss:'Casual is how you talk to a friend; formal is how you write to an official.'},
    {ask:'Which greeting fits Hattie’s letter?', options:[['Dear Mayor Ruiz,', 'Yes! A letter to an official starts with a formal greeting.'], ['Hey there, Mayor Ruiz!', 'That’s friendly, but too casual for a letter asking the mayor for something.'], ['Sup, Mayor!', 'That’s slang, much too casual for the mayor.']]}]},
  {show:'dial', level:1, caller:'🐶 Biscuit the pup', title:'Text or Letter?', line:'can’t come 2nite, sry 😢', steps:[
    {ask:'Who should get this message?', options:[['A best friend', 'Right! Short spellings and emojis fit a text to a friend.'], ['A teacher', 'A teacher should get complete words and sentences, with no “2nite” or “sry.”'], ['A newspaper editor', 'An editor expects formal writing, not texting shortcuts.']]},
    {ask:'Which version would fit an email to a coach?', options:[['I am sorry, but I cannot come tonight.', 'Yes! Complete words, a complete sentence, and a polite tone.'], ['cant come tonite sorry', 'Still texting style: no capital, no apostrophe, and a shortcut spelling.'], ['Sorry, can’t make it to practice tonight, lol.', '“lol” is texting slang. It’s too casual for a coach.']]}]},
  {show:'dial', level:1, caller:'🐢 Shelly the turtle', title:'The Thank-You Letter', line:'The museum trip was super cool.', note:'Shelly is writing a thank-you letter to the museum director.', steps:[
    {tap:'Tap the two words that are too casual for this letter.', words:['super', 'cool.'], miss:'Look for slang: words you’d say to a friend but not write to a director.'},
    {ask:'Which words should replace them?', options:[['very interesting', 'Yes! Clear, polite words that fit a letter.'], ['totally awesome and super cool', 'Still slang, and still too casual for a director.'], ['lit', 'Lit is slang. It’s even more casual.']]}]},
  {show:'dial', level:2, caller:'🐰 Clover the rabbit', title:'The Slip', line:'Dear Ms. Park, thank you for visiting our class. Your talk about rabbits was awesome sauce. We learned a great deal.', steps:[
    {tap:'Tap the words that slip out of the formal style.', words:['awesome', 'sauce.'], miss:'The letter is formal everywhere except one slangy phrase. Find it.'},
    {ask:'Which rewrite keeps the letter formal?', options:[['Your talk about rabbits was fascinating.', 'Yes! It fits the rest of the letter.'], ['Your talk about rabbits was totally epic.', '“Totally epic” is slang too.'], ['Your talk about rabbits rocked.', '“Rocked” is too casual for this letter.']]}]},
  {show:'dial', level:2, caller:'🦊 Rusty the fox', title:'Hold, Please', line:'', note:'Rusty answers the station phone.', steps:[
    {order:'Tap from the most casual to the most formal.', items:['Gimme a sec.', 'Hang on a minute.', 'Please wait a moment.', 'Kindly allow me a moment.'], miss:'Slang and shortcuts are the most casual; polite, careful words are the most formal.'}]},
  {show:'dial', level:2, caller:'🐱 Duchess the cat', title:'Too Fancy?', line:'Dear Jordan, I would be most grateful if you would attend my birthday party.', note:'Duchess is texting her best friend.', steps:[
    {ask:'What’s wrong with this text?', options:[['It’s far more formal than a text to a best friend needs.', 'Right! Writing should match its reader, and this reader is a best friend.'], ['It’s much too casual and slangy to send to a best friend.', 'It’s the opposite: “most grateful” and “attend” are very formal.'], ['It uses too much slang.', 'There’s no slang at all. It’s far too formal.']]},
    {ask:'Which text fits better?', options:[['Hey Jordan, wanna come to my party Saturday?', 'Yes! Friendly and casual, just right for a best friend.'], ['Jordan. Attend my party.', 'That’s short, but it sounds like an order, not a friendly invitation.'], ['Dear Sir or Madam, I kindly request that you attend my party.', 'Still far too formal for a best friend.']]}]},
  {show:'dial', level:3, caller:'🐘 Judge Ellie', title:'The Noise Complaint', line:'Dear Judge Ross, I am writing about the noise from the factory. It has been driving everyone nuts. The noise begins at 5 a.m. each day.', steps:[
    {tap:'Tap the slang word.', words:['nuts.'], miss:'One word turns a formal letter into a chat with a friend. Find it.'},
    {ask:'Which sentence should replace “It has been driving everyone nuts”?', options:[['It has disturbed many families on our street.', 'Yes! Formal and specific.'], ['It’s super annoying, honestly, and everybody hates it.', '“Super” and “honestly” are casual. They don’t fit a letter to a judge.'], ['It drives us all bananas.', 'Bananas is slang too.']]}]},
  {show:'dial', level:3, caller:'🦉 Professor Hoot', title:'The Form Reminder', line:'', note:'Four ways to remind people about a form.', steps:[
    {order:'Tap from the most casual to the most formal.', items:['Yo, hand in the forms by Friday.', 'Hey, turn in your forms by Friday, okay?', 'Please turn in your forms by Friday.', 'All forms must be submitted no later than Friday.'], miss:'Start with the slang. End with the words you’d see on an official notice.'},
    {ask:'Which words make the last version sound the most formal?', options:[['“submitted” and “no later than”', 'Yes! Those are careful, official words in place of “turn in” and “by.”'], ['“forms” and “Friday”', 'Every version uses forms and Friday.'], ['“All” and “the” at the very start of the sentence', 'Those are everyday words. The formal ones are “submitted” and “no later than.”']]}]},

  /* Show 3: Twist and Volume */
  {show:'twist', level:1, caller:'🐻 Bruno the bear', title:'The Snack Report', line:'I’m so hungry I could eat a whole forest!', steps:[
    {ask:'What is Bruno’s line?', options:[['An overstatement', 'Yes! He’s turning the volume way up.'], ['An understatement', 'An understatement makes something sound smaller. Bruno makes his hunger sound huge.'], ['A plain statement of fact', 'Bruno can’t really eat a forest. He’s exaggerating.']]},
    {ask:'What does Bruno really mean?', options:[['He is very hungry.', 'Right! The overstatement shows how hungry he is.'], ['He wants to eat trees.', 'Read past the exaggeration: he means he’s very hungry.'], ['He just ate a big meal.', 'It’s the opposite: he’s very hungry.']]}]},
  {show:'twist', level:1, caller:'🐧 Pip the penguin', title:'Cold Snap', line:'Bit nippy today.', note:'It’s 40 degrees below zero.', steps:[
    {ask:'What is Pip’s line?', options:[['An understatement', 'Yes! Forty below is far worse than “a bit nippy.”'], ['An overstatement', 'Pip makes the cold sound smaller, not bigger.'], ['A plain statement of fact', '“A bit nippy” is far from the truth at forty below.']]}]},
  {show:'twist', level:1, caller:'🦔 Spike the hedgehog', title:'Field Day', line:'Perfect weather for field day.', note:'It’s pouring rain on field day, and Spike groans as he says it.', steps:[
    {ask:'What kind of irony is this?', options:[['Verbal irony', 'Yes! Spike says the opposite of what he means.'], ['Situational irony', 'Situational irony is about what happens. Here the twist is in what Spike says.'], ['Dramatic irony', 'Dramatic irony needs the reader to know something a character doesn’t. Everyone can see the rain.']]}]},
  {show:'twist', level:2, caller:'🐵 Coco the monkey', title:'Breaking News', line:'The town’s fire station burned down last night.', steps:[
    {ask:'What kind of irony is this?', options:[['Situational irony', 'Yes! The opposite of what you’d expect happened.'], ['Verbal irony, because of what the reporter says', 'Nobody is saying the opposite of what they mean. The twist is in what happened.'], ['Dramatic irony', 'There’s no secret the reader knows. The twist is in what happened.']]},
    {ask:'Why is it ironic and not just bad luck?', options:[['A fire station is the last place you’d expect a fire to win.', 'Right! The event is the opposite of what a fire station is for.'], ['Fires are bad news for any town.', 'That’s true, but it would make every fire ironic. This one is the opposite of what you’d expect.'], ['The news reporter on TV didn’t really mean what she said about it.', 'The reporter means it. The twist is in the event itself.']]}]},
  {show:'twist', level:2, caller:'🐭 Squeak the mouse', title:'The Cheese Shop', line:'', note:'In the story, the cat hides behind the cheese shop door. We can see it, but Squeak skips toward the door, humming.', steps:[
    {ask:'What kind of irony is this?', options:[['Dramatic irony', 'Yes! We know something Squeak doesn’t.'], ['Situational irony', 'Nothing unexpected has happened yet. The gap is between what we know and what Squeak knows.'], ['Verbal irony', 'Squeak isn’t saying anything she doesn’t mean.']]},
    {ask:'What do readers know that Squeak doesn’t?', options:[['The cat is waiting behind the door.', 'Right! That’s the gap that makes it dramatic irony.'], ['Squeak likes cheese.', 'Squeak knows that too!'], ['The shop sells cheese from all over the world.', 'Squeak knows that. She doesn’t know about the cat.']]}]},
  {show:'twist', level:2, caller:'🦒 Tallulah the giraffe', title:'Championship Night', line:'', note:'Tallulah’s team just won the state championship. Three players talk to WPET.', steps:[
    {ask:'Which player uses understatement?', options:[['“We did okay, I guess.”', 'Yes! A state title is much more than “okay.”'], ['“We’re the greatest team in the universe!”', 'That turns the volume up. It’s an overstatement.'], ['“We won the state championship tonight.”', 'That’s a plain statement of fact.']]},
    {ask:'Which player uses overstatement?', options:[['“We’re the greatest team in the universe!”', 'Yes! That’s way bigger than the truth.'], ['“We did okay, I guess.”', 'That turns the volume down. It’s an understatement.'], ['“We won the state championship tonight, and it feels great.”', 'That’s a plain statement of fact.']]}]},
  {show:'twist', level:3, caller:'🐺 Wolfgang the wolf', title:'Bad Luck or Irony?', line:'', note:'Wolfgang says everything bad is “ironic.” Is it?', steps:[
    {ask:'Which one is situational irony?', options:[['A pilot who is afraid of heights', 'Yes! You’d expect a pilot to be the last person afraid of heights.'], ['Rain on the day of a picnic', 'That’s bad luck. Rain can happen any day; it isn’t the opposite of what you’d expect.'], ['A flat tire on the way to school', 'That’s bad luck, not the opposite of what you’d expect.']]},
    {ask:'Why isn’t rain on a picnic day situational irony?', options:[['Rain can fall on any day, so it isn’t the opposite of what you’d expect.', 'Right! Irony needs a twist, not just bad luck.'], ['Nobody said anything sarcastic about the rain.', 'That would be about verbal irony. The question is about what happened.'], ['The readers didn’t know ahead of time that it was going to rain that day.', 'That would be about dramatic irony. The question is whether the event is a twist.']]}]},
  {show:'twist', level:3, caller:'🐙 Inky the octopus', title:'The Surprise Party', line:'I bet nobody even remembers my birthday.', note:'Inky’s friends planned a surprise party, and the readers know the whole town is hiding in her living room. Inky has no idea.', steps:[
    {ask:'What kind of irony is this?', options:[['Dramatic irony', 'Yes! The readers know about the party, and Inky doesn’t.'], ['Verbal irony', 'Inky means what she says: she really thinks nobody remembers.'], ['Situational irony', 'The gap is between what the readers know and what Inky knows.']]},
    {ask:'Which change would make Inky’s line verbal irony?', options:[['Inky knows about the party, winks, and says, “I bet nobody remembers my birthday.”', 'Yes! Now she says the opposite of what she means.'], ['Inky says, “I bet nobody remembers my birthday,” and cries a little.', 'She still means it, so it isn’t verbal irony.'], ['Inky says, “I hope somebody remembers my birthday this year, like they did when I was little.”', 'She means that too. Verbal irony says the opposite of what you mean.']]}]},

  /* Show 4: Prime Time */
  {show:'prime', level:2, caller:'🦚 Pavo the peacock', title:'Feather Report', line:'Look at Pavo’s perfectly pretty plumes!', steps:[
    {tap:ALLIT, words:['Pavo’s', 'perfectly', 'pretty', 'plumes'], miss:'Listen for the sound that starts the words.'},
    {ask:'Pavo adds, “My tail is the most beautiful thing in the history of the universe.” What is that?', options:[['An overstatement', 'Yes! Even for a peacock, that’s turning the volume way up.'], ['An understatement', 'It makes the tail sound bigger, not smaller.'], ['Verbal irony', 'Pavo means it. He really is that proud.']]}]},
  {show:'prime', level:2, caller:'🦆 DJ Ducky', title:'The Weather Desk', line:'', note:'DJ Ducky reads the weather for the mayor’s office.', steps:[
    {ask:'Which line fits a report for the mayor’s office?', options:[['Heavy rain is expected this afternoon.', 'Yes! Clear and formal.'], ['It’s gonna pour like crazy later.', '“Gonna” and “like crazy” are too casual for the mayor’s office.'], ['Rain, rain, and more rain all afternoon, ugh, so gross.', '“Ugh” is casual. It doesn’t fit a formal report.']]},
    {ask:'That night a hurricane hits, and Ducky says, “Looks a little damp out there.” What is that?', options:[['An understatement', 'Yes! A hurricane is much more than “a little damp.”'], ['An overstatement', 'Ducky makes the storm sound smaller, not bigger.'], ['Dramatic irony about the storm', 'Everyone knows about the hurricane. Ducky is turning it down.']]}]},
  {show:'prime', level:3, caller:'🐝 Bea the bee', title:'Garden Hour', line:'The big bee buzzed by the blue blossoms.', steps:[
    {tap:'Tap the word that is onomatopoeia.', words:['buzzed'], miss:'Which word sounds like the noise a bee makes?'},
    {tap:'Now tap every word that starts with the b sound.', words:['big', 'bee', 'buzzed', 'by', 'blue', 'blossoms.'], miss:'Go word by word and listen for b.'}]},
  {show:'prime', level:3, caller:'🐱 Duchess the cat', title:'Quiet, Please', line:'Everyone, be QUIET!', note:'A sign in the library says “Quiet, please.” The loudest voice in the room is the librarian, shouting:', steps:[
    {ask:'What kind of irony is this?', options:[['Situational irony', 'Yes! The person who should be quietest is the loudest.'], ['Verbal irony', 'The librarian means it: she wants quiet. The twist is in what is happening.'], ['Dramatic irony, because of the sign', 'Nobody is missing a secret. The twist is in what is happening.']]}]},
  {show:'prime', level:3, caller:'🐶 Biscuit the pup', title:'The Museum Thank-You', line:'', note:'Biscuit is writing to the museum director.', steps:[
    {order:'Tap from the most casual to the most formal.', items:['Thx for the tour!!', 'Thank you for the tour.', 'We are grateful for the informative tour you provided.'], miss:'Shortcuts first, then plain and polite, then the most careful, official words.'},
    {ask:'Which one is too casual for a letter to the director?', options:[['Thx for the tour!!', 'Yes! “Thx” and the double exclamation point are texting style.'], ['Thank you for the tour.', 'That’s polite and complete. It fits a letter.'], ['We are grateful for the informative tour you provided.', 'That’s formal. It fits a letter to a director.']]}]},
  {show:'prime', level:3, caller:'🦉 Professor Hoot', title:'The Final Ear Test', line:'', note:'The professor only trusts your ears.', steps:[
    {ask:'Which pair does NOT alliterate?', options:[['city and cats', 'Right! City starts with an s sound, cats with a k sound.'], ['knot and nap', 'The k in knot is silent, so both start with n. They alliterate.'], ['phone and fan', 'Ph sounds like f, so both start with f. They alliterate.']]},
    {ask:'Which pair shares a vowel sound?', options:[['blue and shoe', 'Yes! Both have the oo sound, spelled two different ways.'], ['hood and food', 'Same letters, different sounds: hood rhymes with good, food rhymes with mood.'], ['pint and mint', 'Pint has a long i, mint has a short i.']]}]},
  {show:'prime', level:3, caller:'🦁 King Leo', title:'Smoke on the Tower', line:'Something smells a bit smoky.', note:'The castle tower is on fire. The king yawns and says:', steps:[
    {ask:'What is the king’s line?', options:[['An understatement', 'Yes! A burning tower is far worse than “a bit smoky.”'], ['An overstatement', 'He makes the fire sound smaller, not bigger.'], ['Dramatic irony about the fire', 'The king can see the fire too. He’s turning it down.']]},
    {tap:'His line uses another device too. Tap the words that alliterate.', words:['Something', 'smells', 'smoky.'], miss:'Listen for the sound that starts the words.'}]},
  {show:'prime', level:3, caller:'🐼 Bao the panda', title:'The Big Finale', line:'The drums went boom, boom, boom, and the band blasted brassy tunes.', steps:[
    {tap:'Tap every word that is onomatopoeia.', words:['boom,'], miss:'Which word copies a sound you can hear?'},
    {ask:'Band, blasted and brassy add which device?', options:[['Alliteration', 'Yes! They all start with the b sound.'], ['Assonance', 'They share their first sound, b. Assonance repeats vowel sounds.'], ['Understatement', 'Nothing is made to sound smaller.']]},
    {ask:'The DJ says the crowd was “a little excited” while they screamed for three hours. What is that?', options:[['An understatement', 'Yes! Three hours of screaming is much more than “a little excited.”'], ['An overstatement', 'It makes the crowd sound calmer, not wilder.'], ['Situational irony', 'Nothing turned out opposite to what you’d expect. The DJ is turning it down.']]}]}
];

export const callsOn = show => RADIO_CALLS.filter(c => c.show === show);
export const radioWords = text => String(text).split(' ').filter(Boolean);
export const bareWord = w => String(w).replace(/[^\p{L}\p{N}’'-]/gu, '').toLowerCase();
/* every word index in the line that a tap step is after */
export const tapTargets = (c, step) => { const want = step.words.map(bareWord); return radioWords(c.line).map((w, i) => i).filter(i => want.includes(bareWord(radioWords(c.line)[i]))); };

const BOOTH = ['🎧', '📻', '🎚️', '🎛️'];
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* a new show: calls in order (easy to hard), dropped calls come back at the end */
export function newRadioRun(show, rnd = Math.random){
  const list = callsOn(show);
  const run = {show, list, queue:list.map((_, i) => i), missed:new Set(), drops:{}, done:false, finished:0, perfect:0, streak:0, bestStreak:0, listeners:0, rnd};
  openCall(run); return run;
}
function openCall(run){
  run.cur = run.queue.shift(); run.step = 0; run.phase = 'step'; run.msg = ''; run.ok = null;
  startStep(run);
}
function startStep(run){
  const s = run.list[run.cur].steps[run.step];
  run.found = []; run.placed = [];
  run.optOrder = s.options ? shuffled(s.options.map((_, i) => i), run.rnd) : [];
  run.itemOrder = s.items ? shuffled(s.items.map((_, i) => i), run.rnd) : [];
}
/* a mistake drops the call; it calls back at the end. On the third drop the producer reads the answer and airs it, so
   every show ends (and she still sees the right answer) */
function drop(run, why){
  const c = run.list[run.cur], s = c.steps[run.step];
  run.missed.add(run.cur); run.streak = 0; run.ok = false;
  run.drops[run.cur] = (run.drops[run.cur] || 0) + 1;
  if (run.drops[run.cur] >= 3) {
    const answer = s.tap ? tapTargets(c, s).map(i => radioWords(c.line)[i].replace(/[^\p{L}\p{N}’'-]/gu, '')).join(', ') : s.options ? s.options[0][0] : s.items.join(' → ');
    run.phase = 'producer'; run.finished++; run.listeners += 25;
    run.msg = `${why} 🎚️ The producer steps in: the answer is ${answer}. Read it once more, then take the next call.`;
    return;
  }
  run.queue.push(run.cur); run.phase = 'dropped';
  run.msg = `${why} 📞 The caller will call back at the end of the show.`;
}
function stepDone(run, msg){
  const c = run.list[run.cur];
  if (run.step + 1 < c.steps.length) { run.step++; run.msg = msg; run.ok = true; startStep(run); return; }
  run.phase = 'aired'; run.ok = true; run.finished++;
  if (!run.missed.has(run.cur)) { run.perfect++; run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak); run.listeners += 100 * Math.min(run.streak, 5); }
  else run.listeners += 50;
  run.msg = `${msg} 🎙️ On the air!`;
}
/* one action: {tap:i} {opt:i} {item:i} {next:true}. Returns 'good', 'bad', 'done' or ''. */
export function radioAct(run, a){
  if (run.done) return '';
  const c = run.list[run.cur], s = c.steps[run.step];
  if (a.next) {
    if (run.phase !== 'aired' && run.phase !== 'dropped' && run.phase !== 'producer') return '';
    if (!run.queue.length) { run.done = true; return 'done'; }
    openCall(run); return '';
  }
  if (run.phase !== 'step') return '';
  if (s.tap && a.tap != null) {
    const targets = tapTargets(c, s);
    if (!targets.includes(a.tap)) { drop(run, `“${radioWords(c.line)[a.tap] || ''}” isn’t one of them. ${s.miss}`); return 'bad'; }
    if (!run.found.includes(a.tap)) run.found.push(a.tap);
    if (targets.every(i => run.found.includes(i))) { stepDone(run, 'Got them all!'); return 'good'; }
    run.msg = `🎯 ${run.found.length} of ${targets.length} found.`; run.ok = true; return 'good';
  }
  if (s.options && a.opt != null) {
    const o = s.options[a.opt]; if (!o) return '';
    if (a.opt !== 0) { drop(run, `Not quite: ${o[1]}`); return 'bad'; }
    stepDone(run, o[1]); return 'good';
  }
  if (s.items && a.item != null) {
    if (run.placed.includes(a.item) || !s.items[a.item]) return '';
    if (a.item !== run.placed.length) { drop(run, `“${s.items[a.item]}” doesn’t go there. ${s.miss}`); return 'bad'; }
    run.placed.push(a.item);
    if (run.placed.length === s.items.length) { stepDone(run, 'The dial is set!'); return 'good'; }
    run.msg = `🎛️ ${run.placed.length} of ${s.items.length} in place.`; run.ok = true; return 'good';
  }
  return '';
}

/* the game's HTML for the current run (buttons carry data-sr-*; the caller turns clicks into radioAct actions) */
export function radioHTML(run, esc){
  const c = run.list[run.cur], s = c.steps[run.step], total = run.list.length, live = run.phase === 'step';
  const words = radioWords(c.line).map((w, i) => live && s.tap
    ? `<button type="button" class="sr-word${run.found.includes(i) ? ' sr-found' : ''}" data-sr-tap="${i}"${run.found.includes(i) ? ' disabled' : ''}>${esc(w)}</button>`
    : `<span class="sr-word${run.found.includes(i) ? ' sr-found' : ''}">${esc(w)}</span>`).join(' ');
  let ask = '';
  if (live && s.tap) ask = `<p class="sr-ask">👆 ${esc(s.tap)}</p>`;
  else if (live && s.options) ask = `<p class="sr-ask">${esc(s.ask)}</p><div class="sr-list">${run.optOrder.map(i => `<button type="button" class="btn sr-opt" data-sr-opt="${i}">${esc(s.options[i][0])}</button>`).join('')}</div>`;
  else if (live && s.items) ask = `<p class="sr-ask">🎛️ ${esc(s.order)}</p>
      ${run.placed.length ? `<ol class="sr-placed">${run.placed.map(i => `<li>${esc(s.items[i])}</li>`).join('')}</ol>` : ''}
      <div class="sr-list">${run.itemOrder.filter(i => !run.placed.includes(i)).map(i => `<button type="button" class="btn sr-opt" data-sr-item="${i}">${esc(s.items[i])}</button>`).join('')}</div>
      <p class="sr-dial" aria-hidden="true"><span>casual</span><span class="sr-needle" style="left:${Math.round(100 * run.placed.length / s.items.length)}%">▼</span><span>formal</span></p>`;
  const next = run.phase === 'aired' || run.phase === 'dropped' || run.phase === 'producer'
    ? `<div class="row"><button type="button" class="btn berry" data-sr-next>${run.queue.length ? (run.phase === 'aired' ? 'Next caller' : 'Next caller (this one calls back)') : 'End the show'}</button></div>` : '';
  const steps = c.steps.length > 1 ? ` · step ${Math.min(run.step + 1, c.steps.length)} of ${c.steps.length}` : '';
  return `<p class="sr-status"><b>📞 ${run.finished} of ${total} calls on the air</b> · ⭐ ${run.perfect} perfect · 📻 ${run.listeners.toLocaleString('en-US')} listeners${run.streak >= 2 ? ` · 🔥 ${run.streak} in a row` : ''}${run.queue.length ? ` · ☎️ ${run.queue.length} waiting` : ''}</p>
    <div class="sr-booth"><p class="sr-top"><span class="sr-onair${live ? ' sr-live' : ''}">● ON AIR</span> <span class="sr-round">Round ${c.level}</span> <span class="sr-meter" aria-hidden="true">${BOOTH.join('')}</span></p>
      <p class="sr-caller">${esc(c.caller)}: <b>${esc(c.title)}</b>${run.missed.has(run.cur) && run.step === 0 && live ? ' <span class="muted">(calling back)</span>' : ''}${steps}</p>
      ${c.note ? `<p class="sr-note">🗒️ ${esc(c.note)}</p>` : ''}
      ${c.line ? `<p class="sr-line">${words}</p>` : ''}</div>
    ${ask}
    ${run.msg ? `<p class="${run.ok === false ? 'sr-bad' : 'sr-good'}" role="status">${esc(run.msg)}</p>` : ''}
    ${next}`;
}

/* shared look for the game and its Arcade copy (both pages define --berry, --butter, --edge, --ink-soft) */
export const RADIO_CSS = `
.sr-status{margin:6px 0}
.sr-booth{border:3px solid var(--edge, #2F3A4A); border-radius:16px; padding:10px 12px; margin:8px 0; background:linear-gradient(#26324a, #1c2537); color:#eef3ff}
.sr-top{display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin:0 0 6px}
.sr-onair{font-weight:800; font-size:.85em; padding:2px 8px; border-radius:6px; background:#4a5068; color:#c9cfdd; letter-spacing:.05em}
.sr-onair.sr-live{background:#e23d4f; color:#fff; box-shadow:0 0 10px #e23d4f}
.sr-round{font-size:.8em; padding:1px 8px; border-radius:999px; background:#eef3ff; color:#1c2537}
.sr-meter{margin-left:auto; letter-spacing:.1em}
.sr-caller{margin:2px 0; font-size:1.05em}
.sr-note{margin:4px 0; color:#c9d6f2}
.sr-line{font-size:1.3em; line-height:1.9; margin:8px 0 4px; padding:6px 10px; border-radius:12px; background:#fffbe9; color:#2f2a14; overflow-wrap:anywhere}
.sr-word{font:inherit; color:inherit; border:0; background:none; padding:0; border-radius:8px}
button.sr-word{padding:0 .1em; border-bottom:3px dotted var(--berry, #E4577A); cursor:pointer; min-height:36px}
button.sr-word:hover, button.sr-word:focus{background:var(--butter, #FFD76A)}
.sr-found, button.sr-word.sr-found{background:#c7f0d8; border-bottom-color:#2E7D57}
.sr-ask{font-weight:700; margin:10px 0 4px}
.sr-list{display:grid; gap:8px; margin:6px 0}
.sr-list .btn{text-align:left; white-space:normal}
.sr-placed{margin:4px 0 6px; padding-left:1.4em}
.sr-placed li{margin:2px 0; font-weight:600}
.sr-dial{position:relative; display:flex; justify-content:space-between; margin:6px 0; padding:14px 2px 2px; border-top:4px solid; border-image:linear-gradient(90deg, #7FD1B9, #FFD76A, #E4577A) 1; font-size:.85em; color:var(--ink-soft, #5E6B7D)}
.sr-needle{position:absolute; top:-6px; transform:translateX(-50%); font-size:1em; color:var(--ink, #2F3A4A); transition:left .3s}
.sr-good{font-weight:700; color:#2E7D57}
.sr-bad{font-weight:700; color:#B83659}
@media (prefers-color-scheme: dark){ .sr-good{color:#7FD1B9} .sr-bad{color:#FF9DB6} }
`;
