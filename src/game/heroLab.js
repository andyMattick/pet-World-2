/* ⚡ Punctuation Power Lab (English Unit 6, the Superhero Factory; docs/ENGLISH-UNIT6.md)
   Each mission is a sentence with glowing spots. Tapping a spot swaps its punctuation (or a word like its / it’s), and the
   hero on screen changes with it: a period makes a calm hero, an exclamation point an alarmed one, a missing comma turns a
   dinner invitation into a hungry monster. She launches when the hero matches the mission. One pack of 6 missions per
   block of the unit. No DOM here: the game screen is in src/game/game.js (renderHeroLab).

   A mission: text with {0}, {1}… for the spots; spots: the choices for each spot ('' means nothing there); outcomes: the
   hero for a set of choices, keyed by the choices joined with '|'; goal: the key that completes the mission. Any set of
   choices without an outcome shows the Glitch robot. */

export const HERO_PACKS = [
  {id:'endCommas', name:'Power Pack 1: End marks and commas', emoji:'❗'},
  {id:'spaceTime', name:'Power Pack 2: Letters, dates, places, and introductions', emoji:'🗓️'},
  {id:'moreCommas', name:'Power Pack 3: Dialogue, names, and appositives', emoji:'🎙️'},
  {id:'apostrophes', name:'Power Pack 4: Apostrophes and contractions', emoji:'🧷'},
  {id:'possessive', name:'Power Pack 5: Possessives, and its or it’s', emoji:'🛡️'}
];

/* moods color the hero card: calm, alarm, curious, friendly, villain, sad, proud, mixed-up */
const H = (emoji, name, mood, text) => ({emoji, name, mood, text});
export const GLITCH = H('🤖❓', 'Glitch', 'glitch', 'The factory robots can’t read this sentence. Something is off. Try another mark!');

export const HERO_MISSIONS = [
  /* Pack 1: end marks and commas */
  {pack:'endCommas', mission:'A volcano is about to blow! Make the hero sound the alarm.', text:'The volcano is erupting{0}', spots:[['.', '!', '?']],
    outcomes:{'.':H('📺🦸', 'Reporter Ray', 'calm', 'Reporter Ray calmly tells the news, like a weather report.'), '!':H('🚨🦸‍♀️🌋', 'Alarm Blaze', 'alarm', 'Alarm Blaze shouts the warning and flies toward the volcano!'), '?':H('🤔🦸', 'Curious Comet', 'curious', 'Curious Comet isn’t sure. Is it really erupting?')}, goal:'!'},
  {pack:'endCommas', mission:'The mayor isn’t sure the hero really saved the city. Make her ask.', text:'You saved the whole city{0}', spots:[['.', '!', '?']],
    outcomes:{'.':H('🏙️🦸', 'Steady Volt', 'calm', 'The mayor states a plain fact: the city was saved.'), '!':H('🎉🦸‍♂️', 'Cheering Volt', 'proud', 'The mayor cheers! Confetti everywhere!'), '?':H('🤨🦸‍♂️', 'Doubting Mayor', 'curious', 'The mayor raises an eyebrow. Did you really?')}, goal:'?'},
  {pack:'endCommas', mission:'Captain is your guest. Invite Captain to dinner, and don’t eat Captain!', text:'Let’s eat{0} Captain!', spots:[['', ',']],
    outcomes:{'':H('👹🍴🦸', 'Hungry Monster', 'villain', 'Uh-oh. With no comma, Captain is what’s for dinner!'), ',':H('🦸🍝👋', 'Friendly Host', 'friendly', 'The comma shows you’re talking TO Captain. Dinner is served!')}, goal:','},
  {pack:'endCommas', mission:'Say thank you to four different people: your parents, the Mayor, and Captain Comet.', text:'I thank my parents, the Mayor{0} and Captain Comet.', spots:[['', ',']],
    outcomes:{'':H('😲👨‍👩‍👧', 'Surprise Family', 'glitch', 'Wait, is it saying the Mayor and Captain Comet ARE your parents?'), ',':H('🙏🦸🦸‍♀️', 'Thankful Team', 'friendly', 'Four separate thank-yous. The comma before “and” keeps them apart.')}, goal:','},
  {pack:'endCommas', mission:'A hero loves three things: cooking, their family, and their pets. Make it say that!', text:'Blaze loves cooking{0} her family{1} and her pets.', spots:[['', ','], ['', ',']],
    outcomes:{'|':H('👹🍳', 'Monster Chef', 'villain', 'Yikes! Blaze is cooking her family and her pets!'), ',|,':H('🦸‍♀️🍳💕🐶', 'Kind Blaze', 'friendly', 'Blaze loves three things: cooking, her family, and her pets.'), ',|':H('🤔🍳', 'Mixed-up Blaze', 'glitch', 'Is “her family and her pets” one thing she loves? Add the last comma.'), '|,':H('👹🍳', 'Monster Chef', 'villain', 'Blaze is still cooking her family. The first comma is missing!')}, goal:',|,'},
  {pack:'endCommas', mission:'Ask the new hero if they’re ready to fly.', text:'Are you ready to fly{0}', spots:[['.', '!', '?']],
    outcomes:{'.':GLITCH, '!':H('😤🦸', 'Bossy Coach', 'alarm', 'That sounds like shouting, not asking.'), '?':H('🦸‍♂️✈️❓', 'Coach Comet', 'curious', 'A real question. The new hero gives a thumbs up!')}, goal:'?'},
  /* Pack 2: letters, dates, places, and introductions */
  {pack:'spaceTime', mission:'The robot sneezed, and the whole factory shook. Make the sentence say that.', text:'When the robot sneezed{0} the factory shook.', spots:[['', ',']],
    outcomes:{'':H('🤖🤧🏭', 'Sneezing Bot', 'glitch', 'Did the robot sneeze the factory? With no comma, it reads that way!'), ',':H('🤖💨🏭', 'Sneezing Bot', 'calm', 'The comma ends the introduction. The robot sneezed; the factory shook.')}, goal:','},
  {pack:'spaceTime', mission:'Volt was cooking dinner when the cat jumped on the counter. Keep the cat safe!', text:'While Volt was cooking{0} the cat jumped on the counter.', spots:[['', ',']],
    outcomes:{'':H('😱🍳🐱', 'Uh-oh Volt', 'villain', 'Is Volt cooking the cat?! A reader might stumble on that.'), ',':H('🦸‍♂️🍳🐱', 'Chef Volt', 'friendly', 'The comma ends the introduction, so the cat is safe on the counter.')}, goal:','},
  {pack:'spaceTime', mission:'Say that the villain escaped anyway (however = but).', text:'However{0} the villain escaped.', spots:[['', ',']],
    outcomes:{'':H('🕵️‍♀️❓', 'Detective Ray', 'curious', 'With no comma, “however” means “in what way.” HOW did the villain escape? The sentence isn’t finished.'), ',':H('🦹💨', 'Sneaky Villain', 'alarm', 'The comma makes “However” mean “but.” The villain got away!')}, goal:','},
  {pack:'spaceTime', mission:'The factory opened on May 4, 2026. Write the date so the robots can read it.', text:'The factory opened on May 4{0} 2026{1} and built ten heroes.', spots:[['', ','], ['', ',']],
    outcomes:{',|,':H('🏭🎂', 'Birthday Bot', 'proud', 'Happy birthday, factory! The date is clear: May 4, 2026.'), '|':H('🤖🔢', 'Counting Bot', 'glitch', 'May 4 2026? Is that 42,026 heroes? Add commas around the year.'), ',|':H('🤖🔢', 'Counting Bot', 'glitch', 'Almost! A comma also goes after the year, because the sentence keeps going.'), '|,':H('🤖🔢', 'Counting Bot', 'glitch', 'The day and the year still run together. Add a comma after 4.')}, goal:',|,'},
  {pack:'spaceTime', mission:'Comet flew from Dallas, Texas, to Reno, Nevada. Give the navigator clear directions.', text:'Comet flew from Dallas{0} Texas{1} to Reno, Nevada.', spots:[['', ','], ['', ',']],
    outcomes:{',|,':H('🧭🦸‍♂️✈️', 'Navigator Comet', 'proud', 'Clear: from Dallas, Texas, to Reno, Nevada.'), '|':H('🧭❓', 'Lost Navigator', 'glitch', 'Is “Dallas Texas” a city? Put a comma between the city and the state.'), ',|':H('🧭❓', 'Lost Navigator', 'glitch', 'Almost! After the state, the sentence keeps going, so it needs another comma.'), '|,':H('🧭❓', 'Lost Navigator', 'glitch', 'The city and the state still run together. Add a comma after Dallas.')}, goal:',|,'},
  {pack:'spaceTime', mission:'Start a friendly fan letter to Captain Comet.', text:'Dear Captain Comet{0}', spots:[['', ',', '!', '?']],
    outcomes:{',':H('💌🦸', 'Happy Comet', 'friendly', 'A friendly letter greeting ends with a comma. Comet can’t wait to read it!'), '':H('🤖✉️', 'Glitch', 'glitch', 'The greeting needs a mark after it.'), '!':H('📣🦸', 'Startled Comet', 'alarm', 'Whoa, that greeting is shouting!'), '?':H('🤔🦸', 'Confused Comet', 'curious', 'Is the letter asking whether it’s Captain Comet?')}, goal:','},
  /* Pack 3: dialogue, names, and appositives */
  {pack:'moreCommas', mission:'Tell Captain (talk TO Captain) that the robot is ready.', text:'Captain{0} the robot is ready.', spots:[['', ',']],
    outcomes:{'':H('🤖🎖️', 'Captain Robot', 'glitch', 'With no comma, “Captain the robot” sounds like a robot named Captain!'), ',':H('🦸📢🤖', 'Ready Crew', 'friendly', 'The comma shows you’re talking to Captain about the robot.')}, goal:','},
  {pack:'moreCommas', mission:'Comet shouts a warning: the villain is near!', text:'“The villain is near{0}” said Comet.', spots:[[',', '!', '.']],
    outcomes:{',':H('🦸🗣️', 'Calm Comet', 'calm', 'Comet says it calmly. Correct punctuation, but no alarm in it.'), '!':H('🚨🦸', 'Alarm Comet', 'alarm', 'Comet shouts the warning! The exclamation point replaces the comma.'), '.':H('🤖✂️', 'Glitch', 'glitch', 'A period inside the quotation ends the whole sentence too soon. Use a comma, or ! or ? for feeling.')}, goal:'!'},
  {pack:'moreCommas', mission:'You have only ONE sidekick, and its name is Robo.', text:'My sidekick{0} Robo{1} can fly.', spots:[['', ','], ['', ',']],
    outcomes:{',|,':H('🦸🤖', 'One Sidekick', 'friendly', 'Commas around Robo: you have one sidekick, and by the way, its name is Robo.'), '|':H('🦸🤖🤖🤖', 'Sidekick Squad', 'curious', 'No commas: you have several sidekicks, and the one named Robo can fly.'), ',|':H('🤖✂️', 'Glitch', 'glitch', 'An appositive in the middle needs commas on both sides.'), '|,':H('🤖✂️', 'Glitch', 'glitch', 'An appositive in the middle needs commas on both sides.')}, goal:',|,'},
  {pack:'moreCommas', mission:'Answer “no” to the question “Is the jetpack empty?” The jetpack still has power!', text:'No{0} power is left in the jetpack.', spots:[['', ',']],
    outcomes:{'':H('🪫😢', 'Empty Jetpack', 'sad', 'No comma: “No power is left.” The jetpack is empty!'), ',':H('🔋🚀', 'Charged Jetpack', 'proud', 'The comma makes “No” the answer. Power IS left. Blast off!')}, goal:','},
  {pack:'moreCommas', mission:'The villain is speaking, and the villain says the hero is a genius.', text:'The hero{0} said the villain{1} is a genius.', spots:[['', ','], ['', ',']],
    outcomes:{',|,':H('🦹💬🦸🧠', 'Grudging Villain', 'curious', 'The villain says it: the hero is a genius!'), '|':H('🦸💬🦹🧠', 'Kind Hero', 'friendly', 'No commas: the hero says the villain is a genius.'), ',|':GLITCH, '|,':GLITCH}, goal:',|,'},
  {pack:'moreCommas', mission:'Check with the new hero: you’re sure they’re new, aren’t you?', text:'You’re the new hero{0} aren’t you?', spots:[['', ',', '.']],
    outcomes:{',':H('🦸‍♀️👋', 'Welcome Crew', 'friendly', 'A comma before the tag question. The new hero nods.'), '':GLITCH, '.':H('🤖✂️', 'Glitch', 'glitch', 'The period ends the sentence before the tag question.')}, goal:','},
  /* Pack 4: apostrophes and contractions */
  {pack:'apostrophes', mission:'A whole team of heroes is getting ready to go.', text:'The hero{0} ready to go.', spots:[['es are', '’s', 'es’']],
    outcomes:{'es are':H('🦸🦸‍♀️🦸‍♂️', 'Hero Team', 'proud', 'Heroes: a plain plural, no apostrophe. The whole team is ready!'), '’s':H('🦸', 'One Hero', 'calm', '“The hero’s ready” means one hero is ready (hero is).'), 'es’':H('🤖✂️', 'Glitch', 'glitch', 'Heroes’ shows the heroes own something, but nothing comes after it.')}, goal:'es are'},
  {pack:'apostrophes', mission:'Say that we ARE going to win (right now, not in the past).', text:'{0} going to win!', spots:[['Were', 'We’re', 'Where']],
    outcomes:{'We’re':H('🦸🦸‍♀️🏆', 'Winning Team', 'proud', 'We’re = we are. We are going to win!'), 'Were':H('⏪😢', 'Past Team', 'sad', '“Were going to win” sounds like it’s in the past, and it’s missing who.'), 'Where':H('🗺️❓', 'Lost Team', 'curious', 'Where going to win? That asks about a place.')}, goal:'We’re'},
  {pack:'apostrophes', mission:'Tell the new recruit they are the best hero.', text:'{0} the best hero!', spots:[['Your', 'You’re', 'Yours']],
    outcomes:{'You’re':H('🦸‍♀️🥇', 'Champion', 'proud', 'You’re = you are. You are the best hero!'), 'Your':H('🤖❓', 'Glitch', 'glitch', 'Your the best hero what? “Your” shows belonging, but nothing belongs here.'), 'Yours':GLITCH}, goal:'You’re'},
  {pack:'apostrophes', mission:'The hero lost her powers. Make her say she can’t fly today.', text:'I can{0} fly today.', spots:[['', '’t']],
    outcomes:{'':H('🦸‍♀️🚀', 'Soaring Blaze', 'proud', 'I can fly! Up, up, and away!'), '’t':H('🦸‍♀️😢🚶', 'Grounded Blaze', 'sad', 'Can’t = can not. The apostrophe stands in for the missing letters.')}, goal:'’t'},
  {pack:'apostrophes', mission:'There are three robots, and all of them are charged.', text:'The robot{0} charged.', spots:[['s are', '’s', 's’ are']],
    outcomes:{'s are':H('🤖🤖🤖🔋', 'Robot Squad', 'proud', 'Robots: a plain plural, no apostrophe.'), '’s':H('🤖🔋', 'One Robot', 'calm', '“The robot’s charged” means one robot is charged.'), 's’ are':H('🤖✂️', 'Glitch', 'glitch', 'Robots’ needs something the robots own. For a plain plural, no apostrophe.')}, goal:'s are'},
  {pack:'apostrophes', mission:'Make the hero promise: we will win.', text:'{0} win this together.', spots:[['Well', 'We’ll', 'Will']],
    outcomes:{'We’ll':H('🤝🦸🦸‍♂️', 'Promise Pals', 'friendly', 'We’ll = we will. A promise!'), 'Well':H('🤷', 'Unsure Hero', 'curious', '“Well win this”? Well is a different word. It needs the apostrophe for “we will.”'), 'Will':H('🤔🦸', 'Curious Comet', 'curious', '“Will win this together” is missing who will win.')}, goal:'We’ll'},
  /* Pack 5: possessives, and its or it’s */
  {pack:'possessive', mission:'Each of the three heroes has one cape.', text:'The {0} capes are hanging up.', spots:[['hero’s', 'heroes’', 'heros’']],
    outcomes:{'heroes’':H('🦸🦸‍♀️🦸‍♂️🧣🧣🧣', 'Hero Team', 'proud', 'Heroes’ capes: many heroes, so the apostrophe goes after the s.'), 'hero’s':H('🦸🧣🧣🧣', 'Cape Collector', 'curious', 'Hero’s capes: ONE hero owns all the capes!'), 'heros’':GLITCH}, goal:'heroes’'},
  {pack:'possessive', mission:'The factory lost the power that belongs to it.', text:'The factory lost {0} power.', spots:[['its', 'it’s']],
    outcomes:{'its':H('🏭🪫', 'Dark Factory', 'sad', 'Its = belonging to it, like his or her. The factory is dark.'), 'it’s':H('🤖✂️', 'Glitch', 'glitch', '“The factory lost it is power”? It’s always means it is or it has.')}, goal:'its'},
  {pack:'possessive', mission:'Tell everyone: it is time to suit up!', text:'{0} time to suit up!', spots:[['Its', 'It’s']],
    outcomes:{'It’s':H('🦸‍♀️🦸‍♂️⚡', 'Suit-Up Squad', 'alarm', 'It’s = it is. Time to suit up!'), 'Its':H('🤖✂️', 'Glitch', 'glitch', '“Its time” would mean time that belongs to it. You mean it is.')}, goal:'It’s'},
  {pack:'possessive', mission:'You have TWO sisters, and they share their friends.', text:'My {0} friends came to the show.', spots:[['sister’s', 'sisters’']],
    outcomes:{'sisters’':H('👧👧👫', 'Sister Squad', 'friendly', 'Sisters’ friends: more than one sister.'), 'sister’s':H('👧👫', 'One Sister', 'calm', 'Sister’s friends: the friends of ONE sister.')}, goal:'sisters’'},
  {pack:'possessive', mission:'Comet and Blaze share ONE lair.', text:'{0} and Blaze’s {1} underground.', spots:[['Comet’s', 'Comet'], ['lairs are', 'lair is']],
    outcomes:{'Comet|lair is':H('🦸‍♂️🦸‍♀️🏠', 'Shared Lair', 'friendly', 'Only the last name gets ’s when two people share one thing.'), 'Comet’s|lairs are':H('🦸‍♂️🏠 🦸‍♀️🏠', 'Two Lairs', 'curious', 'Comet’s and Blaze’s lairs: each one has a separate lair.'), 'Comet’s|lair is':H('🤖✂️', 'Glitch', 'glitch', 'When both names get ’s, each owns a separate one. Here they share one.'), 'Comet|lairs are':GLITCH}, goal:'Comet|lair is'},
  {pack:'possessive', mission:'The robot is happy, so it wags its tail.', text:'The robot wags {0} tail because {1} happy.', spots:[['its', 'it’s'], ['its', 'it’s']],
    outcomes:{'its|it’s':H('🤖🐕💕', 'Happy Bot', 'friendly', 'Its tail (belonging) and it’s happy (it is). Perfect!'), 'it’s|its':H('🤖🔀', 'Backwards Bot', 'glitch', 'Swap them! The tail belongs to it, and it is happy.'), 'its|its':H('🤖❓', 'Glitch', 'glitch', '“Because its happy” needs it is: it’s.'), 'it’s|it’s':H('🤖❓', 'Glitch', 'glitch', '“Wags it’s tail” would mean “wags it is tail.”')}, goal:'its|it’s'}
];
export const missionsIn = pack => HERO_MISSIONS.filter(m => m.pack === pack);
export const heroKey = choices => choices.join('|');
export const heroOutcome = (m, choices) => m.outcomes[heroKey(choices)] || GLITCH;
/* the sentence with the choices filled in (choices[i] is the text for spot i) */
export const heroSentence = (m, choices) => m.text.replace(/\{(\d)\}/g, (_, i) => choices[+i] ?? '');
/* a new run of a pack: its missions in order, each starting on its first choice for every spot (never the goal) */
export function startChoices(m){
  const first = m.spots.map(s => s[0]);
  if (heroKey(first) !== m.goal) return first;
  return m.spots.map(s => s[1] ?? s[0]);
}
