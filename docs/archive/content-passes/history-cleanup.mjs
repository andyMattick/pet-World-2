// History Units 1-4: clean up the answer choices (docs: Pet World Question Bank Roadmap, quality pass, October 2026).
// Run from the repo root:  node docs/history-cleanup.mjs
// What changes: mostly the WRONG answer choices of 124 questions, so the right answer is no longer the longest choice and
// wrong answers no longer give themselves away with words like "only", "always", "never" or "every". Prompts, right
// answers, their order and the difficulty tags stay the same, so teacher hides, edits and miss rates stay attached.
// Seven accuracy fixes from the blind review also change a prompt or a right answer (those 7 questions get new ids):
//   250,000 -> 300,000 years (2 prompts), the Gulf trade answer, the Shang/Indus building prompt, the flood evidence
//   answer, how far Persia reached, and what Rome was just before the emperors.
// Every question is checked first; if any one can't be found exactly once, nothing is written. Running it twice does nothing.
import fs from 'node:fs';

const FILE = 'src/shared/questionBanks.js';
const FIXES = [
{
"course": "history",
"skill": "historyStories",
"prompt": "Two towns tell you different stories about the same battle. You are writing your history. What is a useful first step?",
"newPrompt": "Two towns tell you different stories about the same battle. You are writing your history. What is a useful first step?",
"right": "Compare each account’s perspective and supporting evidence.",
"newRight": "Compare each account’s perspective and supporting evidence.",
"wrong": [
"Choose the older story, since it is closer to the battle.",
"Combine both stories into one by keeping the exciting parts.",
"Use the story from the larger town, since more people saw it."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "A sailor hands you a letter written by someone who saw the battle. What can this letter show you?",
"newPrompt": "A sailor hands you a letter written by someone who saw the battle. What can this letter show you?",
"right": "One person’s perspective and some evidence about the event.",
"newRight": "One person’s perspective and some evidence about the event.",
"wrong": [
"How the soldiers on both sides felt about the battle.",
"The exact number of people who fought, with no mistakes.",
"Which side was right to start the battle in the first place."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "A visitor asks why your history of Greece starts in a different place than another writer’s. How do you explain it?",
"newPrompt": "A visitor asks why your history of Greece starts in a different place than another writer’s. How do you explain it?",
"right": "A different starting point can highlight different people, changes, or questions.",
"newRight": "A different starting point can highlight different people, changes, or questions.",
"wrong": [
"Historians are required to begin with the oldest date that anyone has recorded.",
"The other writer probably found sources that prove your starting point is wrong.",
"Where a history starts changes what actually happened in the past, not just the story."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "You are deciding what to write in your history. Which statement is the best-supported claim?",
"newPrompt": "You are deciding what to write in your history. Which statement is the best-supported claim?",
"right": "Several sources describe the change, though they emphasize different experiences.",
"newRight": "Several sources describe the change, though they emphasize different experiences.",
"wrong": [
"The change happened because one source written by a king says it was a good idea.",
"People remember the change the same way, so the sources must agree on the details.",
"The longest account of the change is the most trustworthy, so it should be followed."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "A merchant says his city’s history begins when its first market opened. A farmer says it begins with the first harvest. What explains the difference?",
"newPrompt": "A merchant says his city’s history begins when its first market opened. A farmer says it begins with the first harvest. What explains the difference?",
"right": "Each chose a starting point that matters to them.",
"newRight": "Each chose a starting point that matters to them.",
"wrong": [
"One of them must have the facts about the past wrong.",
"The city began on one official date set by its rulers.",
"Markets are usually older than farms in most cities."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "A visitor asks what makes a history different from a made-up story. What do you say?",
"newPrompt": "A visitor asks what makes a history different from a made-up story. What do you say?",
"right": "It is based on evidence from the past.",
"newRight": "It is based on evidence from the past.",
"wrong": [
"It is longer and has many more details.",
"It leaves out the writer’s own opinions.",
"It mostly describes kings and their wars."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "You are sorting notes for your history. Which statement is a claim you could test with evidence?",
"newPrompt": "You are sorting notes for your history. Which statement is a claim you could test with evidence?",
"right": "Trade on the river grew after the bridge opened.",
"newRight": "Trade on the river grew after the bridge opened.",
"wrong": [
"Our city is the most beautiful city on the river.",
"The gods chose our people to rule the river valley.",
"Life long ago was happier and simpler than now."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "Two travelers describe the same festival. One calls it joyful; the other calls it loud and crowded. What is the best conclusion?",
"newPrompt": "Two travelers describe the same festival. One calls it joyful; the other calls it loud and crowded. What is the best conclusion?",
"right": "Both may be accurate from different viewpoints.",
"newRight": "Both may be accurate from different viewpoints.",
"wrong": [
"The second traveler probably arrived at a different festival.",
"Festivals are too noisy for historians to study well.",
"The first traveler is more reliable because they were happy."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "Your history of a village starts with its founding. Another writer’s starts when a new road arrived. What does the second choice highlight?",
"newPrompt": "Your history of a village starts with its founding. Another writer’s starts when a new road arrived. What does the second choice highlight?",
"right": "How new connections changed village life.",
"newRight": "How new connections changed village life.",
"wrong": [
"Who founded the village and in what year.",
"Why the village stayed the same over time.",
"Which families are the oldest in the village."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "A historian writes about a war using only the winners’ letters. What is the biggest problem?",
"newPrompt": "A historian writes about a war using only the winners’ letters. What is the biggest problem?",
"right": "The losers’ experiences are left out.",
"newRight": "The losers’ experiences are left out.",
"wrong": [
"Letters are too old to read clearly today.",
"Winners usually exaggerate their own losses.",
"Wars are better studied through maps than letters."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "You claim the harbor town grew richer after 1200. Which evidence best supports your claim?",
"newPrompt": "You claim the harbor town grew richer after 1200. Which evidence best supports your claim?",
"right": "Tax records showing more ships each year.",
"newRight": "Tax records showing more ships each year.",
"wrong": [
"A poem praising the town’s beautiful harbor.",
"A legend about the brave sailor who founded it.",
"A modern painting of the busy old harbor at dawn."
]
},
{
"course": "history",
"skill": "historyStories",
"prompt": "Three sources describe a flood. Two written that year say it lasted a week. One written 200 years later says a month. What is the most reasonable conclusion?",
"newPrompt": "Three sources describe a flood. Two written that year say it lasted a week. One written 200 years later says a month. What is the most reasonable conclusion?",
"right": "The flood likely lasted about a week.",
"newRight": "The flood likely lasted about a week.",
"wrong": [
"The flood likely lasted about a month.",
"The flood probably did not happen.",
"The three sources are equally reliable."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "In one town you write down a single family’s story of moving across the desert. Which scale is this?",
"newPrompt": "In one town you write down a single family’s story of moving across the desert. Which scale is this?",
"right": "A close, local scale.",
"newRight": "A close, local scale.",
"wrong": [
"A global scale.",
"A century-wide scale.",
"A regional comparison."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "A reporter from the future asks what you notice when you “zoom out” and look at all your travels together.",
"newPrompt": "A reporter from the future asks what you notice when you “zoom out” and look at all your travels together.",
"right": "Patterns connecting many places or communities.",
"newRight": "Patterns connecting many places or communities.",
"wrong": [
"The exact thoughts of one person on one day.",
"Details about a single village’s weekly market.",
"Which local leaders you liked and disliked most."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "Your student asks why you keep switching between close-up stories and big-picture views. What do you say?",
"newPrompt": "Your student asks why you keep switching between close-up stories and big-picture views. What do you say?",
"right": "Different scales reveal different details and patterns.",
"newRight": "Different scales reveal different details and patterns.",
"wrong": [
"Switching scales keeps the student from getting bored.",
"The big picture proves what caused each close-up story.",
"Close-up stories are more reliable than the big picture."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "A visitor asks what it means to “zoom out” in history. What do you say?",
"newPrompt": "A visitor asks what it means to “zoom out” in history. What do you say?",
"right": "Look at a wider area or a longer time.",
"newRight": "Look at a wider area or a longer time.",
"wrong": [
"Look closely at one person’s single day.",
"Read the newest sources before older ones.",
"Remove the dates and focus on the story."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "Zooming in on one family’s letters helps a historian see what?",
"newPrompt": "Zooming in on one family’s letters helps a historian see what?",
"right": "How big changes affected real people.",
"newRight": "How big changes affected real people.",
"wrong": [
"Patterns of trade across the whole world.",
"The major events in that whole century.",
"Why millions of families moved in that century."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "A historian studies 10,000 years of human history at once. What is she most likely to miss?",
"newPrompt": "A historian studies 10,000 years of human history at once. What is she most likely to miss?",
"right": "Details of individual lives.",
"newRight": "Details of individual lives.",
"wrong": [
"Long-term patterns of change.",
"Changes across many regions.",
"Connections between places."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "Which question works best at a global scale?",
"newPrompt": "Which question works best at a global scale?",
"right": "How did ideas spread between continents?",
"newRight": "How did ideas spread between continents?",
"wrong": [
"What did one baker eat for breakfast today?",
"Who lived in this one house on the corner?",
"What did one soldier write home in his letter?"
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "After a new road network was built, trade rose 40% in Village A, 35% in Village B, and 50% in Village C. Which claim fits this wider view?",
"newPrompt": "After a new road network was built, trade rose 40% in Village A, 35% in Village B, and 50% in Village C. Which claim fits this wider view?",
"right": "The roads likely boosted trade across the region.",
"newRight": "The roads likely boosted trade across the region.",
"wrong": [
"Village C gained the most, so the roads helped it more than others.",
"The roads likely made trade fall across the region.",
"The rise in trade was not connected to the roads."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "Why might a local story and a global pattern seem to disagree?",
"newPrompt": "Why might a local story and a global pattern seem to disagree?",
"right": "Local places can differ from the overall trend.",
"newRight": "Local places can differ from the overall trend.",
"wrong": [
"One of them is probably a made-up story.",
"Global patterns are usually based on guesses.",
"Local stories are told by people with no evidence."
]
},
{
"course": "history",
"skill": "historyScale",
"prompt": "You notice many port cities grew during the same century. What should you do next?",
"newPrompt": "You notice many port cities grew during the same century. What should you do next?",
"right": "Zoom in on a few ports to check why.",
"newRight": "Zoom in on a few ports to check why.",
"wrong": [
"Assume they grew for one shared reason.",
"Stop, since the pattern proves itself.",
"Study the inland villages instead."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "You want to trace how silk, ideas, and news moved between places. Which frame fits best?",
"newPrompt": "You want to trace how silk, ideas, and news moved between places. Which frame fits best?",
"right": "Networks.",
"newRight": "Networks.",
"wrong": [
"Communities.",
"Collective memory.",
"A single person’s life."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "You want to explain who made iron tools and how they reached farmers. Which frame fits best?",
"newPrompt": "You want to explain who made iron tools and how they reached farmers. Which frame fits best?",
"right": "Production and distribution.",
"newRight": "Production and distribution.",
"wrong": [
"Collective memory.",
"Communities and families.",
"A single battle and its leaders."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "A young scribe asks why you bother choosing a frame for a big, messy event. What do you tell them?",
"newPrompt": "A young scribe asks why you bother choosing a frame for a big, messy event. What do you tell them?",
"right": "It focuses attention on one useful set of details and questions.",
"newRight": "It focuses attention on one useful set of details and questions.",
"wrong": [
"It gives one complete explanation that ends the arguments about it.",
"It means you do not need to compare different sources about the event.",
"It shows that the other perspectives on the event are incorrect."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "You study how salt was mined, packed, and sold, and who got rich from it. Which frame fits best?",
"newPrompt": "You study how salt was mined, packed, and sold, and who got rich from it. Which frame fits best?",
"right": "Production and distribution.",
"newRight": "Production and distribution.",
"wrong": [
"Communities and families.",
"Networks and connections.",
"Collective memory of the town."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "Why might two historians studying the same city reach different conclusions?",
"newPrompt": "Why might two historians studying the same city reach different conclusions?",
"right": "They used different frames and questions.",
"newRight": "They used different frames and questions.",
"wrong": [
"One of them did not look at any evidence.",
"The city changed between their two visits.",
"Frames change what actually happened there."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "A historian studies a village using only the networks frame. What might she overlook?",
"newPrompt": "A historian studies a village using only the networks frame. What might she overlook?",
"right": "How villagers lived and worked together.",
"newRight": "How villagers lived and worked together.",
"wrong": [
"Connections to other places.",
"Goods moving along the trade routes.",
"Ideas arriving from faraway cities and lands."
]
},
{
"course": "history",
"skill": "historyFrames",
"prompt": "A visitor says, “A frame is like a lens.” What does this mean?",
"newPrompt": "A visitor says, “A frame is like a lens.” What does this mean?",
"right": "Each frame brings certain details into focus.",
"newRight": "Each frame brings certain details into focus.",
"wrong": [
"Each frame shows the same evidence the same way.",
"A frame shows the one true history of a place.",
"A frame hides the sources that disagree with it."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "A child asks you what “collective memory” means. What do you say?",
"newPrompt": "A child asks you what “collective memory” means. What do you say?",
"right": "Ways a group remembers and tells stories about its past.",
"newRight": "Ways a group remembers and tells stories about its past.",
"wrong": [
"A list of dates that historians agree on and rarely change.",
"A source that is unbiased because many people remember it.",
"A record written down by one historian for later readers."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "A visiting scholar asks why you would compare a remembered story with other evidence. What is your answer?",
"newPrompt": "A visiting scholar asks why you would compare a remembered story with other evidence. What is your answer?",
"right": "To understand what it reveals and where accounts differ or are incomplete.",
"newRight": "To understand what it reveals and where accounts differ or are incomplete.",
"wrong": [
"To prove that remembered stories are less reliable than written records are.",
"To change the remembered story so that it matches the written evidence.",
"To find out which storyteller first told it, so that you can credit them."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "Someone digs up an old object that does not match a story everyone knows. What should a good historian do?",
"newPrompt": "Someone digs up an old object that does not match a story everyone knows. What should a good historian do?",
"right": "Examine the artifact and compare it with other evidence.",
"newRight": "Examine the artifact and compare it with other evidence.",
"wrong": [
"Set the object aside because the old story is well known.",
"Change the date of the object so that it fits the story.",
"Decide that the story was invented and should be forgotten."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "You are teaching an apprentice griot. Which question helps them judge whether a history is complete?",
"newPrompt": "You are teaching an apprentice griot. Which question helps them judge whether a history is complete?",
"right": "Who preserved this account, and whose experiences are missing?",
"newRight": "Who preserved this account, and whose experiences are missing?",
"wrong": [
"Is this the story I have heard most often from my own teachers?",
"Does the story avoid disagreement so that listeners will enjoy it?",
"Can I memorize it quickly without checking other evidence?"
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "A city’s archive burned in a fire 300 years ago. How does this affect its history?",
"newPrompt": "A city’s archive burned in a fire 300 years ago. How does this affect its history?",
"right": "Some events may be hard to know about.",
"newRight": "Some events may be hard to know about.",
"wrong": [
"Little of importance happened in that city.",
"The city’s history must be made up now.",
"Other sources about the city are useless."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "Why can the people who choose what goes in a textbook shape what students learn?",
"newPrompt": "Why can the people who choose what goes in a textbook shape what students learn?",
"right": "They decide which stories are told.",
"newRight": "They decide which stories are told.",
"wrong": [
"They change what happened in the past.",
"They make the sources more reliable.",
"They check that each story is popular."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "A national holiday celebrates a great victory, but letters from both armies describe heavy losses. What is the best conclusion?",
"newPrompt": "A national holiday celebrates a great victory, but letters from both armies describe heavy losses. What is the best conclusion?",
"right": "Memory of an event can differ from what happened.",
"newRight": "Memory of an event can differ from what happened.",
"wrong": [
"The letters from both armies are probably forged.",
"Holidays are the best evidence we have about wars.",
"The victory must have happened with no losses."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "Which source would best fill a silence about enslaved workers on a plantation?",
"newPrompt": "Which source would best fill a silence about enslaved workers on a plantation?",
"right": "Interviews with formerly enslaved people.",
"newRight": "Interviews with formerly enslaved people.",
"wrong": [
"The owner’s list of buildings and tools.",
"A painting of the plantation paid for by the owner.",
"A map of the plantation’s fields and roads."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "Two groups remember the same treaty very differently. What should a historian do?",
"newPrompt": "Two groups remember the same treaty very differently. What should a historian do?",
"right": "Study both memories and the treaty itself.",
"newRight": "Study both memories and the treaty itself.",
"wrong": [
"Choose the memory of the group that is larger.",
"Set both memories aside as too biased to use.",
"Use whichever version is more popular today."
]
},
{
"course": "history",
"skill": "historyMemory",
"prompt": "You claim a city’s founding legend was shaped by later rulers. Which evidence best supports this?",
"newPrompt": "You claim a city’s founding legend was shaped by later rulers. Which evidence best supports this?",
"right": "It first appears in records 500 years later.",
"newRight": "It first appears in records 500 years later.",
"wrong": [
"It is still very popular in the city today.",
"It includes many exciting, colorful details.",
"Some old families in the city still tell it."
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter asks: “For most of the 250,000 years of your species’ history, how did people mainly live?”",
"newPrompt": "The reporter asks: “For most of the 300,000 years of your species’ history, how did people mainly live?”",
"right": "As foragers",
"newRight": "As foragers",
"wrong": [
"As farmers",
"As herders",
"As city dwellers"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter asks: “What does your band mostly eat?”",
"newPrompt": "The reporter asks: “What does your band mostly eat?”",
"right": "Wild plants and hunted animals",
"newRight": "Wild plants and hunted animals",
"wrong": [
"Crops grown in our own fields",
"Food traded at a busy market",
"Bread baked from grain we store up"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter asks: “Humans have existed about 250,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”",
"newPrompt": "The reporter asks: “Humans have existed about 300,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”",
"right": "More than 90 percent",
"newRight": "More than 90 percent",
"wrong": [
"About half of it",
"About 10 percent",
"Less than 1 percent of it"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”",
"newPrompt": "The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”",
"right": "Most tools were still made of stone",
"newRight": "Most tools were still made of stone",
"wrong": [
"People lived mostly in stone caves",
"Stone was used as a kind of money",
"Laws and writing were carved in stone"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?",
"newPrompt": "The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?",
"right": "Some parts of life stayed the same",
"newRight": "Some parts of life stayed the same",
"wrong": [
"Little has changed since your time",
"Your band lived the same way we do",
"Changes matter more than continuities"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?",
"newPrompt": "The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?",
"right": "Campsites used at different times of year",
"newRight": "Campsites used at different times of year",
"wrong": [
"A single cave painting of a horse herd",
"A modern film about life in the Ice Age",
"A stone house that a family used for centuries"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?",
"newPrompt": "The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?",
"right": "Early farm sites of very different ages",
"newRight": "Early farm sites of very different ages",
"wrong": [
"Old grinding stones from one early village",
"Bones of wild animals found at a campsite",
"Stories that say farming was very hard work"
]
},
{
"course": "history2",
"skill": "earliestHumans",
"prompt": "The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?",
"newPrompt": "The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?",
"right": "Farming is a very recent part of history",
"newRight": "Farming is a very recent part of history",
"wrong": [
"Farming began near the start of history",
"Foraging lasted a short time in our history",
"Cities came before the first foragers did"
]
},
{
"course": "history2",
"skill": "migrationArt",
"prompt": "The visitor notices nobody here can write yet. What does your art show about that?",
"newPrompt": "The visitor notices nobody here can write yet. What does your art show about that?",
"right": "People shared ideas in ways other than writing",
"newRight": "People shared ideas in ways other than writing",
"wrong": [
"Writing had already spread to most nearby groups",
"Art was made for decoration rather than meaning",
"People could not think in symbols yet"
]
},
{
"course": "history2",
"skill": "migrationArt",
"prompt": "The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”",
"newPrompt": "The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”",
"right": "Low sea levels uncovered land",
"newRight": "Low sea levels uncovered land",
"wrong": [
"The Pacific Ocean froze solid",
"The rivers of Asia dried up",
"People built a long land bridge"
]
},
{
"course": "history2",
"skill": "migrationArt",
"prompt": "A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?",
"newPrompt": "A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?",
"right": "Remains of different ages along different routes",
"newRight": "Remains of different ages along different routes",
"wrong": [
"One skull found in a single cave in East Africa",
"A cave painting of a group of people walking",
"A legend about one single great journey out of Africa"
]
},
{
"course": "history2",
"skill": "migrationArt",
"prompt": "A future historian says your paintings show what you ate every day. What is the problem with this claim?",
"newPrompt": "A future historian says your paintings show what you ate every day. What is the problem with this claim?",
"right": "Paintings may show what mattered, not meals",
"newRight": "Paintings may show what mattered, not meals",
"wrong": [
"Paintings this old are very hard to date",
"The painters did not go hunting themselves",
"Paintings are less useful than written records"
]
},
{
"course": "history2",
"skill": "foragingSocieties",
"prompt": "A young member of your band asks why foraging takes so much knowledge. What do you teach them?",
"newPrompt": "A young member of your band asks why foraging takes so much knowledge. What do you teach them?",
"right": "Food sources change with place and season",
"newRight": "Food sources change with place and season",
"wrong": [
"Food stays in the same spot through the year",
"The band leader is the one who needs to know",
"Most wild plants are safe to eat anyway"
]
},
{
"course": "history2",
"skill": "foragingSocieties",
"prompt": "The traveler notices your band owns few belongings. Why?",
"newPrompt": "The traveler notices your band owns few belongings. Why?",
"right": "Moving often makes it hard to carry much",
"newRight": "Moving often makes it hard to carry much",
"wrong": [
"Owning things was against the band’s laws",
"Tools had not been invented yet",
"Traders took away the things you made"
]
},
{
"course": "history2",
"skill": "foragingSocieties",
"prompt": "Many foraging bands had no rich or poor members. Which evidence would best support this claim?",
"newPrompt": "Many foraging bands had no rich or poor members. Which evidence would best support this claim?",
"right": "Burials with similar goods for everyone",
"newRight": "Burials with similar goods for everyone",
"wrong": [
"One grave filled with gold and jewels",
"A large palace in the center of the camp",
"A painting of a chief sitting on a throne"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "A forager asks what “domesticate” means. What do you say?",
"newPrompt": "A forager asks what “domesticate” means. What do you say?",
"right": "To tame and breed plants or animals",
"newRight": "To tame and breed plants or animals",
"wrong": [
"To hunt wild animals in a new way",
"To move to a new home with each season",
"To trade food with the other villages"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "Your village grows wheat and barley in Southwest Asia. What is this farming region often called?",
"newPrompt": "Your village grows wheat and barley in Southwest Asia. What is this farming region often called?",
"right": "The Fertile Crescent",
"newRight": "The Fertile Crescent",
"wrong": [
"The Silk Road route",
"The Sahara Desert",
"The Great Rift Valley"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?",
"newPrompt": "A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?",
"right": "Corn (maize)",
"newRight": "Corn (maize)",
"wrong": [
"Wheat and barley",
"Rice",
"Sugar cane"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "Farming began in several places that had no contact with each other. What does this show?",
"newPrompt": "Farming began in several places that had no contact with each other. What does this show?",
"right": "Many peoples began farming on their own",
"newRight": "Many peoples began farming on their own",
"wrong": [
"One group taught farming to the others",
"Farming spread mainly through trade",
"Farming began in one place, then spread"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?",
"newPrompt": "Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?",
"right": "Specialization",
"newRight": "Specialization",
"wrong": [
"Migration",
"Domestication",
"Surplus trading"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "Which question about your village fits the production and distribution frame?",
"newPrompt": "Which question about your village fits the production and distribution frame?",
"right": "Who grows the grain, and who eats it?",
"newRight": "Who grows the grain, and who eats it?",
"wrong": [
"What stories does the village tell?",
"Which gods does the village honor?",
"How does the village choose its rules?"
]
},
{
"course": "history2",
"skill": "agriculturalRevolution",
"prompt": "At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?",
"newPrompt": "At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?",
"right": "It could support large, settled towns",
"newRight": "It could support large, settled towns",
"wrong": [
"Farmers there still moved with the seasons",
"Each farming town needed a palace",
"Farming was invented in that town"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "A visitor asks which parts of life farming has changed in your village. What do you list?",
"newPrompt": "A visitor asks which parts of life farming has changed in your village. What do you list?",
"right": "Diet, work, homes, and trade",
"newRight": "Diet, work, homes, and trade",
"wrong": [
"The food people ate",
"The weather and the seasons",
"The tools and weapons people used"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "A visitor asks how farming changed the number of people in the world. What do you say?",
"newPrompt": "A visitor asks how farming changed the number of people in the world. What do you say?",
"right": "Populations grew much larger",
"newRight": "Populations grew much larger",
"wrong": [
"Populations shrank quickly",
"Populations stayed about the same",
"Foragers had more children"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?",
"newPrompt": "Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?",
"right": "Less varied diets based on a few crops",
"newRight": "Less varied diets based on a few crops",
"wrong": [
"Farmers spent too much time traveling",
"Foragers ate mostly grain and bread",
"Farmers ate too much meat in their meals"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "Which change from farming helped make some people in your village richer than others?",
"newPrompt": "Which change from farming helped make some people in your village richer than others?",
"right": "Land and stored food could be owned",
"newRight": "Land and stored food could be owned",
"wrong": [
"Food was shared equally by the village",
"People stopped making new tools",
"Bands moved to new land each season"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?",
"newPrompt": "One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?",
"right": "Farming did more harm than good for many",
"newRight": "Farming did more harm than good for many",
"wrong": [
"Farming did not really happen that way",
"Farming was invented by accident long ago",
"Farming helped each person in equal ways"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "Which evidence best supports the claim that farming was a mistake?",
"newPrompt": "Which evidence best supports the claim that farming was a mistake?",
"right": "Farmers’ bones show more disease and wear",
"newRight": "Farmers’ bones show more disease and wear",
"wrong": [
"Farming villages had many more people",
"Farming made writing possible later on",
"Farmers built homes that lasted for many years"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?",
"newPrompt": "Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?",
"right": "The answer depends on whose view you take",
"newRight": "The answer depends on whose view you take",
"wrong": [
"The question has one simple answer",
"Population growth is what matters most here",
"Individual lives tell us very little"
]
},
{
"course": "history2",
"skill": "biggestMistake",
"prompt": "Once your village depends on farming, why is it hard to go back to foraging?",
"newPrompt": "Once your village depends on farming, why is it hard to go back to foraging?",
"right": "Wild food can’t feed so many people",
"newRight": "Wild food can’t feed so many people",
"wrong": [
"Foraging had been banned by the chief",
"Wild plants had disappeared from the land",
"People were too busy building temples"
]
},
{
"course": "history3",
"skill": "villageNetworks",
"prompt": "A traveler asks how the small villages you visit are connected to each other. What do you say?",
"newPrompt": "A traveler asks how the small villages you visit are connected to each other. What do you say?",
"right": "Through trade and shared news",
"newRight": "Through trade and shared news",
"wrong": [
"They were cut off from each other",
"Through letters written in clay",
"Through the orders of an empire"
]
},
{
"course": "history3",
"skill": "villageNetworks",
"prompt": "The traveler asks which groups the farming villages deal with. Who do you name?",
"newPrompt": "The traveler asks which groups the farming villages deal with. Who do you name?",
"right": "Foragers, herders, and nomads",
"newRight": "Foragers, herders, and nomads",
"wrong": [
"Armies from large empires far away",
"The kings of the big cities",
"Traders from across the far sea"
]
},
{
"course": "history3",
"skill": "villageNetworks",
"prompt": "Obsidian from a faraway volcano turns up in this village. What does that show?",
"newPrompt": "Obsidian from a faraway volcano turns up in this village. What does that show?",
"right": "Goods moved between distant groups",
"newRight": "Goods moved between distant groups",
"wrong": [
"The village sits beside a volcano",
"Obsidian forms in most farm fields",
"The village had few visitors"
]
},
{
"course": "history3",
"skill": "villageNetworks",
"prompt": "Besides goods, what else travels with you between villages?",
"newPrompt": "Besides goods, what else travels with you between villages?",
"right": "Ideas, news, and skills",
"newRight": "Ideas, news, and skills",
"wrong": [
"Heavy building stones",
"Orders from city kings",
"Written letters and laws"
]
},
{
"course": "history3",
"skill": "tradeNetworks",
"prompt": "A reporter from the future asks which regions long-distance trade connects. What do you answer?",
"newPrompt": "A reporter from the future asks which regions long-distance trade connects. What do you answer?",
"right": "Afro-Eurasia and the Americas",
"newRight": "Mesopotamia and the Indus Valley, by way of the Gulf",
"wrong": [
"Towns along a single river valley",
"Egypt and China, by way of the Red Sea and the Indian coast",
"Europe and the Middle East"
]
},
{
"course": "history3",
"skill": "tradeNetworks",
"prompt": "Your apprentice asks why long-distance trade is rarer than local trade. What do you say?",
"newPrompt": "Your apprentice asks why long-distance trade is rarer than local trade. What do you say?",
"right": "It is slow, costly, and risky",
"newRight": "It is slow, costly, and risky",
"wrong": [
"Kings ban most local trade",
"Distant goods cost very little",
"Boats had not been invented yet"
]
},
{
"course": "history3",
"skill": "tradeNetworks",
"prompt": "You press your seal into clay tablets to record each deal. What does this show?",
"newPrompt": "You press your seal into clay tablets to record each deal. What does this show?",
"right": "Trade needed careful record-keeping",
"newRight": "Trade needed careful record-keeping",
"wrong": [
"Traders could not count their goods",
"Writing was used for poems and prayers",
"Merchants did not trust each other"
]
},
{
"course": "history3",
"skill": "mesopotamia",
"prompt": "Your laws give different punishments depending on who was harmed. What does this show about Babylon?",
"newPrompt": "Your laws give different punishments depending on who was harmed. What does this show about Babylon?",
"right": "People of different ranks were treated differently",
"newRight": "People of different ranks were treated differently",
"wrong": [
"Each person was treated in the same way by the law",
"The king could be punished by the courts like anyone",
"Harming someone was not against the law in Babylon"
]
},
{
"course": "history3",
"skill": "mesopotamia",
"prompt": "A historian has your law code but no records of real court cases. What is a limit of this source?",
"newPrompt": "A historian has your law code but no records of real court cases. What is a limit of this source?",
"right": "It shows the rules, not how they were used",
"newRight": "It shows the rules, not how they were used",
"wrong": [
"It proves the laws were obeyed by the people",
"It was written long after the king died",
"It tells us little about life in Babylon"
]
},
{
"course": "history3",
"skill": "shangChina",
"prompt": "A child asks what Shang ancestor worship is about. What do you say?",
"newPrompt": "A child asks what Shang ancestor worship is about. What do you say?",
"right": "Honoring family members who died",
"newRight": "Honoring family members who died",
"wrong": [
"Forgetting old family history",
"Worshiping the sun and the moon",
"Obeying the oldest living elders"
]
},
{
"course": "history3",
"skill": "egyptNubia",
"prompt": "A farmer asks why the river matters so much for crops. What do you say?",
"newPrompt": "A farmer asks why the river matters so much for crops. What do you say?",
"right": "Floods left rich soil for crops",
"newRight": "Floods left rich soil for crops",
"wrong": [
"It froze solid each winter",
"Its floods washed the soil away",
"Rain fell there most days"
]
},
{
"course": "history3",
"skill": "egyptNubia",
"prompt": "A reporter from the future asks how to describe Nubia and Egypt. What is the best description?",
"newPrompt": "A reporter from the future asks how to describe Nubia and Egypt. What is the best description?",
"right": "Neighbors who shaped each other",
"newRight": "Neighbors who shaped each other",
"wrong": [
"Societies with little contact",
"One society that changed little",
"Rivals on two distant continents"
]
},
{
"course": "history3",
"skill": "egyptNubia",
"prompt": "You, a king of Kush, now rule Egypt as pharaoh. What does this show about the two lands?",
"newPrompt": "You, a king of Kush, now rule Egypt as pharaoh. What does this show about the two lands?",
"right": "Power could move in both directions",
"newRight": "Power could move in both directions",
"wrong": [
"Egypt ruled Nubia for its whole history",
"Nubia had no kings of its own",
"The two lands had little contact"
]
},
{
"course": "history3",
"skill": "egyptNubia",
"prompt": "An old Egyptian record calls Kush “wretched.” Why should a historian be careful with this source?",
"newPrompt": "An old Egyptian record calls Kush “wretched.” Why should a historian be careful with this source?",
"right": "It was written by a rival with a bias",
"newRight": "It was written by a rival with a bias",
"wrong": [
"It is the oldest record ever found",
"Egyptians rarely wrote about Nubia",
"It was written after the kingdom of Kush had ended"
]
},
{
"course": "history3",
"skill": "earlyAmericas",
"prompt": "The traveler asks why their society is so different from yours. What do you say?",
"newPrompt": "The traveler asks why their society is so different from yours. What do you say?",
"right": "They live in a very different land",
"newRight": "They live in a very different land",
"wrong": [
"Most lands in the world are alike",
"They have not learned to farm yet",
"Land and weather matter very little"
]
},
{
"course": "history3",
"skill": "earlyAmericas",
"prompt": "A historian from the future wants to learn about your society. How can they do it?",
"newPrompt": "A historian from the future wants to learn about your society. How can they do it?",
"right": "By studying ruins, carvings, and tools",
"newRight": "By studying ruins, carvings, and tools",
"wrong": [
"By reading novels written in modern times",
"From one written law code",
"There is no way to study them"
]
},
{
"course": "history3",
"skill": "earlyAmericas",
"prompt": "A visitor asks why later peoples in Mexico use ideas like yours. What do you say?",
"newPrompt": "A visitor asks why later peoples in Mexico use ideas like yours. What do you say?",
"right": "Olmec ideas spread and lasted",
"newRight": "Olmec ideas spread and lasted",
"wrong": [
"Olmec kings ruled most of Mexico",
"Later people met few outsiders",
"Ideas rarely spread between groups"
]
},
{
"course": "history3",
"skill": "earlyAmericas",
"prompt": "Jade and other goods from far away are found in your city. What does this show?",
"newPrompt": "Jade and other goods from far away are found in your city. What does this show?",
"right": "Your people traded across a wide area",
"newRight": "Your people traded across a wide area",
"wrong": [
"Jade forms in most rivers in Mexico",
"Your people rarely left the city",
"The goods were made by your sculptors"
]
},
{
"course": "history3",
"skill": "ancientIndia",
"prompt": "Few weapons and no grand palaces have been found in your city. What can historians fairly conclude?",
"newPrompt": "Few weapons and no grand palaces have been found in your city. What can historians fairly conclude?",
"right": "Power may have worked differently here",
"newRight": "Power may have worked differently here",
"wrong": [
"The city had no leaders of any kind",
"The people here had no conflicts",
"The palaces were later carried off to Egypt"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "A young trader asks why every kingdom you visited grew up in its own way. What do you say?",
"newPrompt": "A young trader asks why every kingdom you visited grew up in its own way. What do you say?",
"right": "Each land had its own rivers and resources",
"newRight": "Each land had its own rivers and resources",
"wrong": [
"They used the same resources in the same way",
"Climate mattered very little to farmers",
"The kingdoms did not need to farm"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?",
"newPrompt": "The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?",
"right": "Look for what is alike and what is different",
"newRight": "Look for what is alike and what is different",
"wrong": [
"Assume the four were alike in most ways",
"Compare the names of their kings and gods",
"Study the one that left the most written records"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "The trader asks what all those kingdoms had in common. Which similarity do you name?",
"newPrompt": "The trader asks what all those kingdoms had in common. Which similarity do you name?",
"right": "Farming fed growing cities",
"newRight": "Farming fed growing cities",
"wrong": [
"They did not need farming",
"They shared a single ruler",
"They were in the same place"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "Shang China built with bronze tools and the Indus Valley with baked brick. What explains differences like these?",
"newPrompt": "Shang China built with rammed earth and timber, and the Indus Valley with baked brick. What explains differences like these?",
"right": "Each place had different resources",
"newRight": "Each place had different resources",
"wrong": [
"Each place had the same materials",
"Traders refused to share their building goods",
"Kings chose materials at random"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "A historian claims river floods shaped all four kingdoms. Which evidence best supports this?",
"newPrompt": "A historian claims river floods shaped all four kingdoms. Which evidence best supports this?",
"right": "Canals and flood records in each valley",
"newRight": "Canals and flood-control works along each river",
"wrong": [
"Bronze weapons found in Shang tombs",
"Indus seals found in Mesopotamia",
"Paintings of kings on the walls of their temples and palaces"
]
},
{
"course": "history3",
"skill": "earlyAgrarian",
"prompt": "Someone says every early kingdom grew in exactly the same way. Which evidence would challenge this?",
"newPrompt": "Someone says every early kingdom grew in exactly the same way. Which evidence would challenge this?",
"right": "Very different buildings, writing, and rulers",
"newRight": "Very different buildings, writing, and rulers",
"wrong": [
"The four kingdoms grew up beside large rivers",
"The four kingdoms each farmed grain",
"Each of the four kingdoms had cities"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "A fellow traveler asks what makes a belief system “portable.” What do you say?",
"newPrompt": "A fellow traveler asks what makes a belief system “portable.” What do you say?",
"right": "It travels with people to new places",
"newRight": "It travels with people to new places",
"wrong": [
"It is tied to one temple",
"It is practiced by one family line",
"It can be followed in one holy city or shrine"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "The traveler asks how portable belief systems usually spread. What have you seen on your journeys?",
"newPrompt": "The traveler asks how portable belief systems usually spread. What have you seen on your journeys?",
"right": "Along trade and travel routes",
"newRight": "Along trade and travel routes",
"wrong": [
"Through farming villages",
"Through written laws and courts",
"By keeping away from others"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "The traveler asks how one belief can link people in very different places. What do you say?",
"newPrompt": "The traveler asks how one belief can link people in very different places. What do you say?",
"right": "Followers share beliefs and practices",
"newRight": "Followers share beliefs and practices",
"wrong": [
"They speak the same language",
"They live under one king and his laws",
"They stop trading with outsiders"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "A trader asks where people often first hear about a new faith. What do you say?",
"newPrompt": "A trader asks where people often first hear about a new faith. What do you say?",
"right": "At markets and trading towns",
"newRight": "At markets and trading towns",
"wrong": [
"In their home villages",
"Inside the king’s palace",
"From the books they buy at home"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "Empires and belief systems often helped each other spread. How might an empire help a faith?",
"newPrompt": "Empires and belief systems often helped each other spread. How might an empire help a faith?",
"right": "Its roads and peace made travel safer",
"newRight": "Its roads and peace made travel safer",
"wrong": [
"It banned travel between its many lands",
"It kept each faith inside one city",
"It made trade with outsiders illegal"
]
},
{
"course": "history4",
"skill": "portableBelief",
"prompt": "A faith arrives in a new land and mixes with local customs. What does this show?",
"newPrompt": "A faith arrives in a new land and mixes with local customs. What does this show?",
"right": "Beliefs can change as they spread",
"newRight": "Beliefs can change as they spread",
"wrong": [
"Beliefs stay the same as they move",
"Local people reject new ideas",
"The faith disappears right away"
]
},
{
"course": "history4",
"skill": "hinduBuddhism",
"prompt": "A child asks what karma means. What do you say?",
"newPrompt": "A child asks what karma means. What do you say?",
"right": "Actions have effects, now and later",
"newRight": "Actions have effects, now and later",
"wrong": [
"People are born with the same fate",
"The gods decide what happens to you",
"Rebirth happens to kings and priests"
]
},
{
"course": "history4",
"skill": "islam",
"prompt": "A traveler asks why Islam spread so quickly from Arabia. Which reason do you give?",
"newPrompt": "A traveler asks why Islam spread so quickly from Arabia. Which reason do you give?",
"right": "Trade routes and new Muslim rulers",
"newRight": "Trade routes and new Muslim rulers",
"wrong": [
"Merchants were forced to join it",
"Arabia had little contact with others",
"It was spread by sailors from China"
]
},
{
"course": "history4",
"skill": "islam",
"prompt": "Islam teaches that Muhammad was the last of a line of prophets that includes Abraham, Moses, and Jesus. What does this show?",
"newPrompt": "Islam teaches that Muhammad was the last of a line of prophets that includes Abraham, Moses, and Jesus. What does this show?",
"right": "Islam shares roots with Judaism and Christianity",
"newRight": "Islam shares roots with Judaism and Christianity",
"wrong": [
"Islam has no link to any faith that came before it",
"Islam began long before Judaism did",
"Muslims reject the earlier prophets as false"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "Back home, a student asks why you compare the belief systems you met. What do you say?",
"newPrompt": "Back home, a student asks why you compare the belief systems you met. What do you say?",
"right": "To see what is alike, what differs, and why",
"newRight": "To see what is alike, what differs, and why",
"wrong": [
"To prove the faiths are the same",
"To decide which faith is the true one",
"To find which faith has the most followers today"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "The student asks what many portable belief systems have in common. Which similarity do you name?",
"newPrompt": "The student asks what many portable belief systems have in common. Which similarity do you name?",
"right": "Teachings about how to live and treat others",
"newRight": "Teachings about how to live and treat others",
"wrong": [
"They began in the same city",
"They forbid their followers to travel far from home",
"They have few followers or communities"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "You saw Buddhism look different in each land you passed through. Which claim is best supported?",
"newPrompt": "You saw Buddhism look different in each land you passed through. Which claim is best supported?",
"right": "Faiths changed as they spread to new lands",
"newRight": "Faiths changed as they spread to new lands",
"wrong": [
"Faiths stay the same wherever they move",
"One faith spread much farther than the others",
"Faiths spread for reasons that are unclear"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "You bring hundreds of Buddhist texts back to China and translate them. Why does this matter?",
"newPrompt": "You bring hundreds of Buddhist texts back to China and translate them. Why does this matter?",
"right": "More people can read the teachings",
"newRight": "More people can read the teachings",
"wrong": [
"Fewer people can learn about Buddhism",
"The texts can be read by monks in India",
"China will stop trading with India"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "A student asks what Buddhism, Christianity, and Islam have in common. What do you say?",
"newPrompt": "A student asks what Buddhism, Christianity, and Islam have in common. What do you say?",
"right": "They welcome people from many lands",
"newRight": "They welcome people from many lands",
"wrong": [
"They began in the same region",
"They are tied to one family line",
"They worship the same founder and god"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "A student asks why Buddhist temples in China look different from those in India. What do you say?",
"newPrompt": "A student asks why Buddhist temples in China look different from those in India. What do you say?",
"right": "Builders mixed in their own local styles",
"newRight": "Builders mixed in their own local styles",
"wrong": [
"Chinese law banned temples from India",
"Indian monks built each temple in China",
"Buddhism does not allow large stone buildings"
]
},
{
"course": "history4",
"skill": "comparePortable",
"prompt": "Your travel diary describes India for the Chinese emperor. What is a limit of it as a source?",
"newPrompt": "Your travel diary describes India for the Chinese emperor. What is a limit of it as a source?",
"right": "It shows India through one traveler’s eyes",
"newRight": "It shows India through one traveler’s eyes",
"wrong": [
"It was written many centuries after the trip",
"It describes China rather than India",
"Its writer did not actually visit India"
]
},
{
"course": "history4",
"skill": "persia",
"prompt": "A visitor asks how far your empire stretches. What do you say?",
"newPrompt": "A visitor asks how far the Persian Empire reached at its height. What do you say?",
"right": "From Egypt to India",
"newRight": "From Egypt to India",
"wrong": [
"From Rome to China",
"From Greece to Spain",
"Across Persia and Mesopotamia"
]
},
{
"course": "history4",
"skill": "persia",
"prompt": "After you take Babylon, what do you do for the Jewish people who were held captive there?",
"newPrompt": "After you take Babylon, what do you do for the Jewish people who were held captive there?",
"right": "Let them return home to Jerusalem",
"newRight": "Let them return home to Jerusalem",
"wrong": [
"Keep them as slaves in Babylon",
"Send them to fight in Greece",
"Force them to worship your own gods"
]
},
{
"course": "history4",
"skill": "persia",
"prompt": "Your empire collects taxes from every province. What do the taxes pay for?",
"newPrompt": "Your empire collects taxes from every province. What do the taxes pay for?",
"right": "Armies, roads, and officials",
"newRight": "Armies, roads, and officials",
"wrong": [
"Gifts for the Greek cities",
"Gold stored in the palace vaults",
"The king’s private feasts"
]
},
{
"course": "history4",
"skill": "persia",
"prompt": "Greek writers called the Persian kings proud and cruel. Why should a historian be careful with this?",
"newPrompt": "Greek writers called the Persian kings proud and cruel. Why should a historian be careful with this?",
"right": "The Greeks were Persia’s enemies",
"newRight": "The Greeks were Persia’s enemies",
"wrong": [
"The Greeks rarely met any Persians",
"It was written by Persian kings",
"Greek writers usually praised Persia"
]
},
{
"course": "history4",
"skill": "persia",
"prompt": "A historian compares Persian rule with Assyrian rule, which was known for harsh punishments. Which statement is accurate?",
"newPrompt": "A historian compares Persian rule with Assyrian rule, which was known for harsh punishments. Which statement is accurate?",
"right": "Persia ruled more through tolerance than fear",
"newRight": "Persia ruled more through tolerance than fear",
"wrong": [
"Persia ruled mainly through fear and harsh terror",
"Both empires let each city rule itself",
"Assyria was the more tolerant of the two"
]
},
{
"course": "history4",
"skill": "greece",
"prompt": "A student asks who could vote in Athens. What do you say?",
"newPrompt": "A student asks who could vote in Athens. What do you say?",
"right": "Free adult men who were citizens",
"newRight": "Free adult men who were citizens",
"wrong": [
"Each adult living in Athens",
"The richest families in the city",
"Women, men, and enslaved people"
]
},
{
"course": "history4",
"skill": "greece",
"prompt": "You write that some people are slaves by nature. Why must historians read your views with care?",
"newPrompt": "You write that some people are slaves by nature. Why must historians read your views with care?",
"right": "Writers reflect the beliefs of their time",
"newRight": "Writers reflect the beliefs of their time",
"wrong": [
"You did not write anything down",
"Each person in Athens agreed with you",
"Slavery did not exist in Athens during your life"
]
},
{
"course": "history4",
"skill": "imperialChina",
"prompt": "A scholar asks what the Mandate of Heaven means. What do you tell him?",
"newPrompt": "A scholar asks what the Mandate of Heaven means. What do you tell him?",
"right": "Heaven’s approval to rule, which can be lost",
"newRight": "Heaven’s approval to rule, which can be lost",
"wrong": [
"A law that gives each new ruler power for life",
"A tax that farmers pay to the emperor",
"A rule that priests must govern China"
]
},
{
"course": "history4",
"skill": "compareEmpires",
"prompt": "The emperor asks why your report compares the empires you visited. What do you say?",
"newPrompt": "The emperor asks why your report compares the empires you visited. What do you say?",
"right": "To learn how rulers grow, govern, and hold power",
"newRight": "To learn how rulers grow, govern, and hold power",
"wrong": [
"To prove that the empires were alike",
"To pick which empire is the strongest of them",
"To list each emperor’s name and dates in time order"
]
},
{
"course": "history4",
"skill": "compareEmpires",
"prompt": "After all your travels, which claim is best supported by comparing empires?",
"newPrompt": "After all your travels, which claim is best supported by comparing empires?",
"right": "Empires ruled and grew in different ways",
"newRight": "Empires ruled and grew in different ways",
"wrong": [
"Empires acted in the same way",
"Empires stayed the same over time",
"Power came from luck rather than choices"
]
},
{
"course": "history4",
"skill": "rome",
"prompt": "A child asks what Rome was before it had emperors. Rome began as a:",
"newPrompt": "A child asks what Rome was before it had emperors. Just before the emperors, Rome was a:",
"right": "Republic",
"newRight": "Republic",
"wrong": [
"Province of Persia",
"Greek city-state",
"Colony of Carthage"
]
},
{
"course": "history4",
"skill": "romeHan",
"prompt": "A clerk asks why the Han prefer officials chosen by tests. What do you say?",
"newPrompt": "A clerk asks why the Han prefer officials chosen by tests. What do you say?",
"right": "Tests pick people for skill, not family",
"newRight": "Tests pick people for skill, not family",
"wrong": [
"Tests let the rich buy the best jobs",
"Tests were the way most people learned to read",
"Tests kept scholars away from power"
]
},
{
"course": "history4",
"skill": "womenAncient",
"prompt": "After hearing about Rome, which statement is best supported?",
"newPrompt": "After hearing about Rome, which statement is best supported?",
"right": "Women’s lives differed by society and class",
"newRight": "Women’s lives differed by society and class",
"wrong": [
"Women in each land lived the same life",
"Women had little influence in any ancient society",
"Class made little difference to women"
]
},
{
"course": "history4",
"skill": "womenAncient",
"prompt": "You are an educated woman who advises the empress. What does this show?",
"newPrompt": "You are an educated woman who advises the empress. What does this show?",
"right": "Some elite women gained influence",
"newRight": "Some elite women gained influence",
"wrong": [
"Most women held government jobs",
"Women could not read or write",
"Men were the ones who advised rulers"
]
}
];

let src = fs.readFileSync(FILE, 'utf8');
const start = src.indexOf('const HISTORY_QUESTIONS = {'), end = src.indexOf('const HISTORY4_BUILT_IN_LEVELS');
if (start < 0 || end < start) { console.log('NOT APPLIED: could not find the History banks. Nothing was changed.'); process.exit(1); }
let block = src.slice(start, end);

// The History banks use three styles: {prompt:'…',options:[…],answer:n}, mc('…','…',…) and histLevel(n,"…","…",…).
// Read one quoted string at position i (either quote, with escapes) -> {value, quote, end} or null.
function readString(text, i){
  const quote = text[i]; if (quote !== "'" && quote !== '"') return null;
  let value = '';
  for (let k = i + 1; k < text.length; k++){
    if (text[k] === '\\') { value += text[++k]; continue; }
    if (text[k] === quote) return { value, quote, end: k + 1 };
    value += text[k];
  }
  return null;
}
// Every place a prompt appears as a whole string, with the four choices that follow it.
function findQuestions(prompt){
  const hits = [];
  for (const quote of ["'", '"']) {
    let from = 0;
    for (;;) {
      const at = block.indexOf(quote + prompt.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote) + quote, from);
      if (at < 0) break; from = at + 1;
      const p = readString(block, at); if (!p || p.value !== prompt) continue;
      let k = p.end, object = false;
      if (block.startsWith(',options:[', k)) { object = true; k += ',options:['.length; } else if (block[k] === ',') k += 1; else continue;
      const choices = [];
      while (choices.length < 4) {
        const c = readString(block, k); if (!c) break;
        choices.push(c); k = c.end;
        if (choices.length < 4) { if (block[k] !== ',') break; k += 1; }
      }
      if (choices.length !== 4) continue;
      let answer = 0;
      if (object) { const m = block.slice(k).match(/^\],answer:(\d)/); if (!m) continue; answer = Number(m[1]); }
      else if (block[k] !== ')') continue;
      hits.push({ start: at, end: k, quote, choices: choices.map(c => c.value), choiceQuote: choices[0].quote, answer, object });
    }
  }
  return hits;
}
const lit = (s, quote) => quote + s.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
// Wrong answers keep their places; the right answer stays where it is, so nothing else in the entry moves.
function rebuilt(hit, f){
  const choices = hit.choices.slice(); let w = 0;
  for (let n = 0; n < 4; n++) choices[n] = n === hit.answer ? f.newRight : f.wrong[w++];
  return lit(f.newPrompt, hit.quote) + (hit.object ? ',options:[' : ',') + choices.map(c => lit(c, hit.choiceQuote)).join(',');
}
const isDone = f => findQuestions(f.newPrompt).some(h => h.choices[h.answer] === f.newRight && [...h.choices].filter((c, n) => n !== h.answer).join('|') === f.wrong.join('|'));
if (FIXES.every(isDone)) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const problems = [];
for (const f of FIXES) {
  if (isDone(f)) continue;
  if (new Set([f.newRight, ...f.wrong].map(c => c.toLowerCase())).size !== 4) { problems.push(`${f.skill}: choices are not 4 different answers`); continue; }
  const hits = findQuestions(f.prompt).filter(h => h.choices[h.answer] === f.right);
  if (hits.length !== 1) { problems.push(`${f.course}/${f.skill} "${f.prompt.slice(0, 50)}…": found ${hits.length} times (expected 1)`); continue; }
  const h = hits[0];
  block = block.slice(0, h.start) + rebuilt(h, f) + block.slice(h.end);
}
if (problems.length) { console.log('NOT APPLIED. Nothing was changed:\n  ' + problems.join('\n  ')); process.exit(1); }
fs.writeFileSync(FILE, src.slice(0, start) + block + src.slice(end));
console.log(`Done: ${FIXES.length} History questions now have cleaned-up answer choices.`);
