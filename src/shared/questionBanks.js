/* Question banks, lesson lists and Khan links for English, History and Biology.
   Moved here unchanged from src/game/game.js so the game and the teacher app share them.
   The banks below the import are a byte-for-byte cut and paste: scripts/question-counts.mjs checks the counts. */
import { questionId } from './questionIds';

const ENGLISH_UNIT1 = [
  {id:'identifyNouns', group:'Introduction to nouns', lesson:'Nouns name people, places, things, and ideas. A noun can be singular (one) or plural (more than one).', name:'Identifying nouns'},
  {id:'singularPlural', group:'Introduction to nouns', lesson:'Most nouns form a plural with -s or -es. Some spelling patterns change when a noun becomes plural.', name:'Singular and plural nouns'},
  {id:'commonProper', group:'Types of nouns', lesson:'Common nouns name general people, places, or things. Proper nouns name a specific one and begin with a capital letter.', name:'Common and proper nouns'},
  {id:'concreteAbstract', group:'Types of nouns', lesson:'Concrete nouns can be experienced with the senses. Abstract nouns name ideas, feelings, or qualities.', name:'Concrete and abstract nouns'},
  {id:'fToVes', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'Some nouns ending in f or fe change to -ves in the plural.', name:'Irregular plural nouns: f to -ves plurals'},
  {id:'enPlurals', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'A few nouns form their plural with -en or another special ending.', name:'Irregular plural nouns: -en plurals'},
  {id:'basePlurals', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'Some nouns use the same form for one and for more than one, especially animals people fish or hunt: sheep, deer, moose, fish, salmon, trout, cod, and squid.', name:'Irregular plural nouns: the base plural'},
  {id:'mutantPlurals', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Some plurals change the inside of the word instead of adding an ending.', name:'Irregular plural nouns: mutant plurals'},
  {id:'foreignPlurals', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Some nouns borrowed from other languages keep a plural form from that language.', name:'Irregular plural nouns: foreign plurals'},
  {id:'pluralReview', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Review regular and irregular plural patterns, including words that change or stay the same.', name:'Irregular plural nouns review'}
];
const ENGLISH_GROUPS = [
  {id:'intro', name:'Introduction to nouns', learn:'Nouns name people, places, things, and ideas. Practice spotting nouns and choosing singular or plural forms.', skills:['identifyNouns','singularPlural']},
  {id:'types', name:'Types of nouns', learn:'Sort nouns by what they name: general or specific, tangible or abstract.', skills:['commonProper','concreteAbstract']},
  {id:'irregularBase', name:'Irregular plural nouns: base plurals and irregular endings', learn:'Explore plurals that change their spelling, add unusual endings, or stay the same.', skills:['fToVes','enPlurals','basePlurals']},
  {id:'irregularForeign', name:'Irregular plural nouns: mutant and foreign plurals', learn:'Practice internal vowel changes, borrowed plurals, and mixed review.', skills:['mutantPlurals','foreignPlurals','pluralReview']}
];
const ENGLISH_UNIT2 = [
  {id:'verbIdentify',name:'Identifying verbs',lesson:'Verbs show actions or states of being.'},
  {id:'verbAgreement',name:'Introduction to verb agreement',lesson:'A verb agrees with its subject in number: singular subjects use singular verbs, and plural subjects use plural verbs.'},
  {id:'verbTense',name:'Introduction to verb tense',lesson:'Verb tense locates an action in the present, past, or future.'},
  {id:'actionLinkHelping',name:'Action, linking, and helping verbs',lesson:'Action verbs show what a subject does; linking verbs connect a subject to a description; helping verbs work with a main verb.'},
  {id:'irregularVerbs',name:'Irregular verbs',lesson:'Irregular verbs form their past tense in ways that do not follow the usual -ed pattern.'},
  {id:'simpleAspect',name:'Simple verb aspect',lesson:'Simple aspect presents an action as a fact, habit, or completed event.'},
  {id:'progressiveAspect',name:'Progressive verb aspect',lesson:'Progressive aspect uses a form of be plus an -ing verb to show an ongoing action.'},
  {id:'perfectAspect',name:'Perfect verb aspect',lesson:'Perfect aspect uses have plus a past participle to connect an action to another time.'},
  {id:'perfectProgressive',name:'Perfect progressive verb aspect',lesson:'Perfect progressive uses have, been, and an -ing verb to show an ongoing action over time.'},
  {id:'tenseAspectTime',name:'Managing time with tense and aspect',lesson:'Choose tense and aspect to show when an action happens and how it relates to another event.'},
  {id:'modalVerbs',name:'Modal verbs',lesson:'Modal verbs such as can, might, and must express ability, possibility, or necessity.'}
];
const ENGLISH_GROUPS2 = [
  {id:'foundation',quizName:'Quiz 1',name:'Introduction to verbs, tense, linking and helping verbs',learn:'Identify verbs, match verbs to their subjects, and recognize tense and verb types.',skills:['verbIdentify','verbAgreement','verbTense','actionLinkHelping']},
  {id:'irregular',quizName:'Irregular verbs Quiz',name:'Irregular verbs',learn:'Practice past-tense verbs that do not use the regular -ed ending.',skills:['irregularVerbs']},
  {id:'aspect',quizName:'Verb aspect Quiz',name:'Verb aspect: simple, progressive, and perfect',learn:'Compare simple, progressive, and perfect forms.',skills:['simpleAspect','progressiveAspect','perfectAspect']},
  {id:'aspectModal',quizName:'Aspect and modal verbs Quiz',name:'Verb aspect and modal verbs',learn:'Use perfect progressive aspect to manage time and choose modal verbs for meaning.',skills:['perfectProgressive','tenseAspectTime','modalVerbs']}
];
const HISTORY_UNIT1 = [
  {id:'historyStories',name:'History Stories',lesson:'Compare the stories people tell about the past. Different starting points and perspectives shape what a history includes.'},
  {id:'historyScale',name:'History of Many Shapes and Sizes',lesson:'Switch scale to study local details or wider patterns, and test claims against evidence.',url:'https://www.khanacademy.org/humanities/world-history/x66f79d8a:origins-of-history/x66f79d8a:history-of-many-shapes-and-sizes-1-2/a/activity-opener-what-is-world-history-zooming-out'},
  {id:'historyFrames',name:'History Frames',lesson:'Use frames such as communities, networks, and production and distribution to focus a historical question.'},
  {id:'historyMemory',name:'History and Memory',lesson:'Assess historical narratives by examining evidence, memory, and multiple accounts.'}
];
const HISTORY_GROUPS = [
  {id:'stories',name:'History Stories | 1.1',quizName:'History Stories Quiz',learn:'Where does history begin? Compare starting points and perspectives; distinguish a historical story from the evidence used to support it.',skills:['historyStories'],quizSkills:['historyStories','historyScale'],extraLessons:[HISTORY_UNIT1[1]]},
  {id:'frames',name:'History Frames | 1.3',quizName:'History Frames Quiz',learn:'Explore communities, expanding and contracting networks, and how production and distribution shape societies.',skills:['historyFrames']},
  {id:'memory',name:'History and Memory | 1.4',quizName:'History and Memory Quiz',learn:'Assess narratives by comparing evidence, collective memory, and whose accounts are preserved.',skills:['historyMemory']}
];
const HISTORY_QUESTIONS = {
  historyStories:[
    {prompt:'Two towns tell you different stories about the same battle. You are writing your history. What is a useful first step?',options:['Choose the older story, since it is closer to the battle.','Compare each account’s perspective and supporting evidence.','Combine both stories into one by keeping the exciting parts.','Use the story from the larger town, since more people saw it.'],answer:1},
    {prompt:'A sailor hands you a letter written by someone who saw the battle. What can this letter show you?',options:['One person’s perspective and some evidence about the event.','How the soldiers on both sides felt about the battle.','The exact number of people who fought, with no mistakes.','Which side was right to start the battle in the first place.'],answer:0},
    {prompt:'A visitor asks why your history of Greece starts in a different place than another writer’s. How do you explain it?',options:['A different starting point can highlight different people, changes, or questions.','Historians are required to begin with the oldest date that anyone has recorded.','The other writer probably found sources that prove your starting point is wrong.','Where a history starts changes what actually happened in the past, not just the story.'],answer:0},
    {prompt:'You are deciding what to write in your history. Which statement is the best-supported claim?',options:['The change happened because one source written by a king says it was a good idea.','People remember the change the same way, so the sources must agree on the details.','Several sources describe the change, though they emphasize different experiences.','The longest account of the change is the most trustworthy, so it should be followed.'],answer:2}
  ],
  historyScale:[
    {prompt:'In one town you write down a single family’s story of moving across the desert. Which scale is this?',options:['A close, local scale.','A global scale.','A century-wide scale.','A regional comparison.'],answer:0},
    {prompt:'A reporter from the future asks what you notice when you “zoom out” and look at all your travels together.',options:['Patterns connecting many places or communities.','The exact thoughts of one person on one day.','Details about a single village’s weekly market.','Which local leaders you liked and disliked most.'],answer:0},
    {prompt:'A ruler claims the trade route you traveled changed many communities. How could you test that claim?',options:['Look for evidence from multiple connected places.','Use one object and assume it explains everything.','Ignore evidence that does not fit.','Ask only whether the route was long.'],answer:0},
    {prompt:'Your student asks why you keep switching between close-up stories and big-picture views. What do you say?',options:['Different scales reveal different details and patterns.','Switching scales keeps the student from getting bored.','The big picture proves what caused each close-up story.','Close-up stories are more reliable than the big picture.'],answer:0}
  ],
  historyFrames:[
    {prompt:'You want to write about how families and villages built shared customs. Which frame fits best?',options:['Communities.','Networks.','Production and distribution.','Weather only.'],answer:0},
    {prompt:'You want to trace how silk, ideas, and news moved between places. Which frame fits best?',options:['Communities.','Networks.','Collective memory.','A single person’s life.'],answer:1},
    {prompt:'You want to explain who made iron tools and how they reached farmers. Which frame fits best?',options:['Production and distribution.','Collective memory.','Communities and families.','A single battle and its leaders.'],answer:0},
    {prompt:'A young scribe asks why you bother choosing a frame for a big, messy event. What do you tell them?',options:['It focuses attention on one useful set of details and questions.','It gives one complete explanation that ends the arguments about it.','It means you do not need to compare different sources about the event.','It shows that the other perspectives on the event are incorrect.'],answer:0}
  ],
  historyMemory:[
    {prompt:'A child asks you what “collective memory” means. What do you say?',options:['Ways a group remembers and tells stories about its past.','A list of dates that historians agree on and rarely change.','A source that is unbiased because many people remember it.','A record written down by one historian for later readers.'],answer:0},
    {prompt:'A visiting scholar asks why you would compare a remembered story with other evidence. What is your answer?',options:['To understand what it reveals and where accounts differ or are incomplete.','To prove that remembered stories are less reliable than written records are.','To change the remembered story so that it matches the written evidence.','To find out which storyteller first told it, so that you can credit them.'],answer:0},
    {prompt:'Someone digs up an old object that does not match a story everyone knows. What should a good historian do?',options:['Examine the artifact and compare it with other evidence.','Set the object aside because the old story is well known.','Change the date of the object so that it fits the story.','Decide that the story was invented and should be forgotten.'],answer:0},
    {prompt:'You are teaching an apprentice griot. Which question helps them judge whether a history is complete?',options:['Who preserved this account, and whose experiences are missing?','Is this the story I have heard most often from my own teachers?','Does the story avoid disagreement so that listeners will enjoy it?','Can I memorize it quickly without checking other evidence?'],answer:0}
  ]
};
// Phase 1 History Unit 1 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.
const histLevel = (difficulty, prompt, correct, ...wrong) => ({prompt, options:[correct, ...wrong], answer:0, difficulty});
const HISTORY_EXTRA_QUESTIONS = {
  historyStories:[
    histLevel(1,'A merchant says his city’s history begins when its first market opened. A farmer says it begins with the first harvest. What explains the difference?','Each chose a starting point that matters to them.','One of them must have the facts about the past wrong.','The city began on one official date set by its rulers.','Markets are usually older than farms in most cities.'),
    histLevel(1,'A visitor asks what makes a history different from a made-up story. What do you say?','It is based on evidence from the past.','It is longer and has many more details.','It leaves out the writer’s own opinions.','It mostly describes kings and their wars.'),
    histLevel(2,'You are sorting notes for your history. Which statement is a claim you could test with evidence?','Trade on the river grew after the bridge opened.','Our city is the most beautiful city on the river.','The gods chose our people to rule the river valley.','Life long ago was happier and simpler than now.'),
    histLevel(2,'Two travelers describe the same festival. One calls it joyful; the other calls it loud and crowded. What is the best conclusion?','Both may be accurate from different viewpoints.','The second traveler probably arrived at a different festival.','Festivals are too noisy for historians to study well.','The first traveler is more reliable because they were happy.'),
    histLevel(2,'Your history of a village starts with its founding. Another writer’s starts when a new road arrived. What does the second choice highlight?','How new connections changed village life.','Who founded the village and in what year.','Why the village stayed the same over time.','Which families are the oldest in the village.'),
    histLevel(2,'A historian writes about a war using only the winners’ letters. What is the biggest problem?','The losers’ experiences are left out.','Letters are too old to read clearly today.','Winners usually exaggerate their own losses.','Wars are better studied through maps than letters.'),
    histLevel(3,'You claim the harbor town grew richer after 1200. Which evidence best supports your claim?','Tax records showing more ships each year.','A poem praising the town’s beautiful harbor.','A legend about the brave sailor who founded it.','A modern painting of the busy old harbor at dawn.'),
    histLevel(3,'A king’s official history says he won every war he fought. What should a careful historian ask first?','Who wrote it, and why?','How long is the history?','Which war was most exciting?','Was the handwriting neat?'),
    histLevel(3,'Three sources describe a flood. Two written that year say it lasted a week. One written 200 years later says a month. What is the most reasonable conclusion?','The flood likely lasted about a week.','The flood likely lasted about a month.','The flood probably did not happen.','The three sources are equally reliable.'),
    histLevel(3,'Which question would best help you choose a starting point for a history of your town?','What change do I want to explain?','What is the oldest date I can find?','Which story is the most exciting one?','Which event had the most famous guest?')
  ],
  historyScale:[
    histLevel(1,'A visitor asks what it means to “zoom out” in history. What do you say?','Look at a wider area or a longer time.','Look closely at one person’s single day.','Read the newest sources before older ones.','Remove the dates and focus on the story.'),
    histLevel(1,'You study how one market changed over ten years. What scale is this?','A small, local scale.','A global scale.','A scale of thousands of years.','A scale that leaves out places.'),
    histLevel(1,'You compare how farming spread across three continents. What scale is this?','A large, wide scale.','A single-family scale.','A one-day scale.','A one-village scale.'),
    histLevel(2,'Zooming in on one family’s letters helps a historian see what?','How big changes affected real people.','Patterns of trade across the whole world.','The major events in that whole century.','Why millions of families moved in that century.'),
    histLevel(2,'A historian studies 10,000 years of human history at once. What is she most likely to miss?','Details of individual lives.','Long-term patterns of change.','Changes across many regions.','Connections between places.'),
    histLevel(2,'Which question works best at a global scale?','How did ideas spread between continents?','What did one baker eat for breakfast today?','Who lived in this one house on the corner?','What did one soldier write home in his letter?'),
    histLevel(3,'A writer claims one village’s drought caused a whole empire to fall. What is the best response?','Check evidence from across the empire.','Accept it, since droughts are serious.','Study only that one village more closely.','Ignore it, since villages are small.'),
    histLevel(3,'After a new road network was built, trade rose 40% in Village A, 35% in Village B, and 50% in Village C. Which claim fits this wider view?','The roads likely boosted trade across the region.','Village C gained the most, so the roads helped it more than others.','The roads likely made trade fall across the region.','The rise in trade was not connected to the roads.'),
    histLevel(3,'Why might a local story and a global pattern seem to disagree?','Local places can differ from the overall trend.','One of them is probably a made-up story.','Global patterns are usually based on guesses.','Local stories are told by people with no evidence.'),
    histLevel(3,'You notice many port cities grew during the same century. What should you do next?','Zoom in on a few ports to check why.','Assume they grew for one shared reason.','Stop, since the pattern proves itself.','Study the inland villages instead.')
  ],
  historyFrames:[
    histLevel(1,'You study how a city shared water and settled arguments between neighbors. Which frame fits best?','Communities.','Networks.','Production and distribution.','Collective memory.'),
    histLevel(2,'You study how salt was mined, packed, and sold, and who got rich from it. Which frame fits best?','Production and distribution.','Communities and families.','Networks and connections.','Collective memory of the town.'),
    histLevel(2,'A historian traces how a new religion spread along trade routes. Which frame is she using?','Networks.','Communities.','Production and distribution.','Collective memory.'),
    histLevel(2,'Which question fits the communities frame?','How did people in the town choose leaders?','How did spices travel from Asia to Europe?','How were cloth and grain made and sold?','How did a disease move between ports?'),
    histLevel(2,'Which question fits the networks frame?','How did papermaking move west?','Who did the farming in one village?','How did a town choose its rules?','What did one family grow each year?'),
    histLevel(2,'Which evidence best fits the production and distribution frame?','Records of how much grain each farm sold.','Letters between friends in distant cities.','A list of the town’s religious festivals.','A song about the town’s heroes.'),
    histLevel(3,'You study the Silk Roads with the production and distribution frame. Which question would you ask?','Who made silk, and who profited from it?','How did travelers share religious ideas?','How did caravan towns govern themselves?','What stories do people tell about the roads?'),
    histLevel(3,'Why might two historians studying the same city reach different conclusions?','They used different frames and questions.','One of them did not look at any evidence.','The city changed between their two visits.','Frames change what actually happened there.'),
    histLevel(3,'A historian studies a village using only the networks frame. What might she overlook?','How villagers lived and worked together.','Connections to other places.','Goods moving along the trade routes.','Ideas arriving from faraway cities and lands.'),
    histLevel(3,'A visitor says, “A frame is like a lens.” What does this mean?','Each frame brings certain details into focus.','Each frame shows the same evidence the same way.','A frame shows the one true history of a place.','A frame hides the sources that disagree with it.')
  ],
  historyMemory:[
    histLevel(1,'A griot recites the history of a people from memory. What kind of source is this?','An oral tradition.','A written census.','An archaeological dig.','A government tax record.'),
    histLevel(1,'A town builds a statue to honor a local hero. What is this an example of?','Collective memory.','A trade network.','A production record.','A written census.'),
    histLevel(2,'A visitor asks why some histories have “silences,” or missing voices. What do you explain?','Some groups’ records were never kept.','Everyone’s story was always written down.','Historians erase voices on purpose.','People in the past rarely spoke.'),
    histLevel(2,'A museum shows only objects owned by rich families. What does the collection leave out?','The lives of ordinary people.','The lives of rich families.','Expensive objects from the past.','Objects that were well preserved.'),
    histLevel(2,'A city’s archive burned in a fire 300 years ago. How does this affect its history?','Some events may be hard to know about.','Little of importance happened in that city.','The city’s history must be made up now.','Other sources about the city are useless.'),
    histLevel(2,'Why can the people who choose what goes in a textbook shape what students learn?','They decide which stories are told.','They change what happened in the past.','They make the sources more reliable.','They check that each story is popular.'),
    histLevel(3,'A national holiday celebrates a great victory, but letters from both armies describe heavy losses. What is the best conclusion?','Memory of an event can differ from what happened.','The letters from both armies are probably forged.','Holidays are the best evidence we have about wars.','The victory must have happened with no losses.'),
    histLevel(3,'Which source would best fill a silence about enslaved workers on a plantation?','Interviews with formerly enslaved people.','The owner’s list of buildings and tools.','A painting of the plantation paid for by the owner.','A map of the plantation’s fields and roads.'),
    histLevel(3,'Two groups remember the same treaty very differently. What should a historian do?','Study both memories and the treaty itself.','Choose the memory of the group that is larger.','Set both memories aside as too biased to use.','Use whichever version is more popular today.'),
    histLevel(3,'You claim a city’s founding legend was shaped by later rulers. Which evidence best supports this?','It first appears in records 500 years later.','It is still very popular in the city today.','It includes many exciting, colorful details.','Some old families in the city still tell it.')
  ]
};
// Difficulty tags for the original 4 questions in each lesson, in their order.
const HISTORY_BUILT_IN_LEVELS = {historyStories:[2,2,2,2], historyScale:[1,1,2,2], historyFrames:[1,1,1,2], historyMemory:[1,2,2,2]};
Object.entries(HISTORY_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));
Object.entries(HISTORY_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY_QUESTIONS[skillId] = [...(HISTORY_QUESTIONS[skillId] || []), ...questions]; });
const mc = (prompt, correct, ...wrong) => ({prompt, options:[correct, ...wrong], answer:0});
const HISTORY_UNIT3 = [
  {id:'villageNetworks',name:'Foragers and Village Networks | 3.2',lesson:'Early farming villages were small but connected through networks, and interacted with foragers, herders, and nomads.'},
  {id:'firstCities',name:'The First Cities, States, and Empires | 3.3',lesson:'As agriculture spread, villages grew into cities that linked into powerful states and complex networks.'},
  {id:'tradeNetworks',name:'Ancient Trade Networks | 3.4',lesson:'Local networks were more common, but long-distance trade also linked societies across Afro-Eurasia and the Americas.'},
  {id:'mesopotamia',name:'Ancient Mesopotamia | 3.6',lesson:'Farming, cities, writing, laws, and religion shaped one of the earliest complex societies.'},
  {id:'shangChina',name:'Shang Dynasty China | 3.7',lesson:'The Shang used farming, bronze technology, writing, ancestor worship, and political power to build an early agrarian society.'},
  {id:'egyptNubia',name:'Nubia and Ancient Egypt | 3.8',lesson:'The Nile shaped Nubia and ancient Egypt, and the two societies influenced one another.'},
  {id:'earlyAmericas',name:'Ancient Americas | 3.10',lesson:'Early societies in Mesoamerica, South America, and North America adapted to different environments and built complex communities, such as the Olmec and Chavín de Huantar.'},
  {id:'ancientIndia',name:'Indus River Valley | 3.11',lesson:'People in the Indus River Valley built organized cities and trade networks; historians rely on archaeological evidence because the society left few readable written records.'},
  {id:'earlyAgrarian',name:'Early Agrarian Societies in Context | 3.12',lesson:'Compare similarities and differences among early agrarian societies to see how geographic context influenced their development.'}
];
const HISTORY3_LEARN_ONLY = {villageNetworks:[{name:'Cities, Societies, and Empires | 3.1',lesson:'Small groups grew into large, complex societies, states, and empires that shaped life inside and beyond them.'}], mesopotamia:[{name:'Early Agrarian Societies | 3.5',lesson:'Complex agricultural societies emerged independently in different regions, each shaped by its geography, climate, and resources.'}], earlyAmericas:[{name:'Aksum and Nok Society | 3.9',lesson:'Aksum and Nok society show the diversity of early African agrarian societies through trade, technology, culture, and regional connections.'}]};
const HISTORY_GROUPS3 = HISTORY_UNIT3.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id],extraLessons:HISTORY3_LEARN_ONLY[skill.id]}));
const HISTORY3_QUESTIONS = {
  villageNetworks:[
    mc('A traveler asks how the small villages you visit are connected to each other. What do you say?',"Through trade and shared news","They were cut off from each other","Through letters written in clay","Through the orders of an empire"),
    mc('The traveler asks which groups the farming villages deal with. Who do you name?',"Foragers, herders, and nomads","Armies from large empires far away","The kings of the big cities","Traders from across the far sea"),
    mc('A villager asks why they should trade with a herder like you. What is the best reason?',"To swap goods each side lacks","Herders are not allowed to trade","Villages already make everything","Trade only works with writing"),
    mc('A reporter from the future asks what your trading trips show historians. What do you say?',"Small villages had wide connections","Villages never changed over time","Everyone everywhere lived the same way of life","Cities came before villages did")
  ],
  firstCities:[
    mc('A farmer from the countryside asks how Uruk got so big. What happened as farming spread and grew stronger?',"Villages grew into cities","People went back to foraging","Farmers moved to the mountains","Trade between villages stopped"),
    mc('A visitor asks what you mean when you say Uruk rules a “state.” What is a state?',"A government that rules land and people","A large family that farms together","A market where farmers trade goods","A temple where the priests hold their ceremonies"),
    mc('A merchant asks how cities like yours joined together into powerful states. What do you say?',"Through trade, leaders, and shared laws","By cutting off contact with others","By staying as small villages that rarely met","By giving up farming for hunting"),
    mc('The visitor notices how crowded and busy Uruk is. Which change comes with growing cities?',"More people and more complex jobs","Smaller and simpler communities","Less need for leaders or rules","Fewer kinds of work, since everyone farms")
  ],
  tradeNetworks:[
    mc('A young sailor asks which kind of trade is most common in your world. What do you tell them?',"Trade with nearby towns","Trade across whole oceans","Trade by long caravans only","Trade between far continents"),
    mc('A reporter from the future asks which regions long-distance trade connects. What do you answer?',"Mesopotamia and the Indus Valley, by way of the Gulf","Towns along a single river valley","Egypt and China, by way of the Red Sea and the Indian coast","Europe and the Middle East"),
    mc('Your apprentice asks why people pay so much for goods from far away. What do you say?',"They lack those goods at home","Far-off goods are just like local ones","Kings forbid people to buy local goods","Trade keeps groups from meeting"),
    mc('Historians find your Indus beads buried in a Mesopotamian city. What do they suggest?',"Trade between distant places","The beads fell into the river there","No one traveled in those days","The beads were made in Mesopotamia")
  ],
  earlyAgrarian:[
    mc('A young trader asks why every kingdom you visited grew up in its own way. What do you say?',"Each land had its own rivers and resources","They used the same resources in the same way","Climate mattered very little to farmers","The kingdoms did not need to farm"),
    mc('The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?',"Look for what is alike and what is different","Assume the four were alike in most ways","Compare the names of their kings and gods","Study the one that left the most written records"),
    mc('The trader asks what all those kingdoms had in common. Which similarity do you name?',"Farming fed growing cities","They did not need farming","They shared a single ruler","They were in the same place"),
    mc('A historian asks why you always explain where and when a society lived. Why is context important?',"It helps explain why things happened","It makes evidence unnecessary","It proves every society was the same size","It erases differences between lands")
  ],
  mesopotamia:[
    mc('A visiting prince asks between which two rivers your land lies. What do you tell him?',"The Tigris and Euphrates","The Nile and the Jordan","The Indus and the Ganges","The Yellow and the Yangtze"),
    mc('Your scribes ask which invention helps your government and merchants keep records. What is it?',"Cuneiform writing","The wheel and axle","Bronze sickles","Mud-brick houses"),
    mc('A judge asks why you had your law code carved in stone. What do law codes help do?',"Set rules and settle arguments","Replace the need for farming","Keep people from learning to write","Stop all trade with other lands"),
    mc('A traveler sees the giant temple in the center of your city. How does religion shape your cities?',"Temples sat at the center of city life","Cities had no gods or temples at all","Religion was banned inside city walls","Temples were far from where people lived")
  ],
  shangChina:[
    mc('A soldier asks which technology makes Shang weapons and ritual vessels so strong. What is it?',"Bronze","Iron","Steel","Copper"),
    mc('A child asks what Shang ancestor worship is about. What do you say?',"Honoring family members who died","Forgetting old family history","Worshiping the sun and the moon","Obeying the oldest living elders"),
    mc('A historian from the future asks what writing from your time they can study. What do you tell them?',"Inscriptions on bones and bronze","Printed books and newspapers","Long letters written on paper scrolls","Carvings on pyramid walls"),
    mc('A visitor asks how the Shang king holds your society together. How does political power support it?',"The king led armies, rituals, and work","The king had no real role at all","Each family ruled itself with no one in charge","Priests ruled and the king farmed")
  ],
  egyptNubia:[
    mc('A visitor asks which river shapes both your kingdom and Egypt. What do you answer?',"The Nile","The Jordan","The Niger","The Tigris"),
    mc('A farmer asks why the river matters so much for crops. What do you say?',"Floods left rich soil for crops","It froze solid each winter","Its floods washed the soil away","Rain fell there most days"),
    mc('A reporter from the future asks how to describe Nubia and Egypt. What is the best description?',"Neighbors who shaped each other","Societies with little contact","One society that changed little","Rivals on two distant continents"),
    mc('A historian wants proof that Nubia and Egypt influenced each other. Which evidence could show it?',"Shared styles, trade goods, and rulers","A modern map of the Nile Valley","A single unlabeled rock found in the desert","Nothing could ever show it")
  ],
  earlyAmericas:[
    mc('A visitor from the future asks the name of your people, one of the earliest complex societies in Mesoamerica. What are you called?',"The Olmec","The Shang","The Sumerians","The Hittites"),
    mc('A traveler from the south tells you about a temple called Chavín de Huantar. Where is it?',"The Andes of South America","The deserts of North Africa","The plains of North America","The jungles of Central America"),
    mc('The traveler asks why their society is so different from yours. What do you say?',"They live in a very different land","Most lands in the world are alike","They have not learned to farm yet","Land and weather matter very little"),
    mc('A historian from the future wants to learn about your society. How can they do it?',"By studying ruins, carvings, and tools","By reading novels written in modern times","From one written law code","There is no way to study them")
  ],
  ancientIndia:[
    mc('A visitor asks which river valley your city sits in. What do you tell them?',"The Indus","The Ganges","The Tigris","The Yellow River"),
    mc('The visitor is amazed by your city. What is notable about many Indus Valley cities?',"Planned streets and covered drains","Huge pyramids for the kings","Walls made of stone and gold","Twisting streets that wind with no plan at all"),
    mc('A merchant shows you a carved stone seal. What are seals and traded goods evidence of?',"Trade and keeping records","Modern computer use","Only farming tools","A full law code we can read today"),
    mc('A historian from the future cannot read your writing. How can they study your city?',"By studying ruins and artifacts","By guessing without any evidence","By ignoring your city completely","By reading modern newspapers")
  ]
};
// Phase 1 History Unit 3 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.
const HISTORY3_EXTRA_QUESTIONS = {
  villageNetworks:[
    histLevel(1,"The traveler asks what you bring to the villages to trade. What is most likely?","Wool, milk, and animals","Bronze swords and coins","Printed books and paper","Glass windows and iron"),
    histLevel(1,"A villager asks what a nomad is. What do you say?","Someone who moves from place to place","Someone who rules over several villages","Someone who only grows wheat","Someone who lives in one big city"),
    histLevel(1,"The villagers live in one spot all year. What lets them stay in one place?","Their fields and stored grain","Their herds of wild horses","Their trips to faraway cities","Their money in the bank"),
    histLevel(2,"Obsidian from a faraway volcano turns up in this village. What does that show?","Goods moved between distant groups","The village sits beside a volcano","Obsidian forms in most farm fields","The village had few visitors"),
    histLevel(2,"A villager asks why farmers and herders depend on each other. What do you say?","Each has things the other needs","Herders rule over the villages","Villages cannot grow any food","Herders must live inside villages"),
    histLevel(2,"Besides goods, what else travels with you between villages?","Ideas, news, and skills","Heavy building stones","Orders from city kings","Written letters and laws"),
    histLevel(3,"A historian claims these villages were linked to faraway groups. Which evidence best supports this?","Seashells found in villages far inland","Seeds of wheat found in one storage pit","A modern drawing of a busy village market","A story written thousands of years later"),
    histLevel(3,"Someone says early villages were cut off from the world. Which evidence would show this is wrong?","Goods in the village from far-off places","Houses built from local mud bricks","Village fields close to the houses","Grain grown in the fields next to the village"),
    histLevel(3,"What would most likely happen if herders like you stopped visiting the villages?","Villages would lose wool, milk, and news","Villages would grow far more wheat","Villages would turn into large cities","The village farmers would all become nomads"),
    histLevel(3,"A historian compares a farming village with a herding camp. Which statement is accurate?","Villages stayed put; herders moved with the seasons","Both groups moved every few days to new land","Both groups lived in large walled cities","Villagers moved with the seasons; herders stayed put")
  ],
  firstCities:[
    histLevel(1,"A farmer asks what feeds all of Uruk’s builders and scribes. What do you say?","Surplus food from farmers","Gold dug up from the riverbanks","Taxes paid by factories","Fish from the open ocean"),
    histLevel(1,"A child asks what a scribe does in Uruk. What do you say?","Writes and keeps records","Grows barley in the fields","Builds the city walls","Leads the army in battle"),
    histLevel(1,"Which job is new in a city like Uruk, compared with a small village?","Full-time priest","Barley farmer","Goat herder","Wild plant gatherer"),
    histLevel(2,"A visitor asks why Uruk built strong walls. What is the best reason?","To protect its people and stored food","To keep farmers from leaving to forage","To mark where the rivers would flood","To show where the desert begins"),
    histLevel(2,"Why does a growing city need more organization than a village?","More people must share food and water","Cities have fewer people to feed","Cities do not need any farmland","Village life already had kings, armies and laws"),
    histLevel(2,"A merchant asks what makes Uruk a “state” and not just a big town. What do you say?","It rules nearby land and collects taxes","It has more houses than a village","It has a market for trading grain","It is built right beside a large river for water"),
    histLevel(3,"A historian claims Uruk had powerful leaders. Which evidence best supports this?","Huge temples that needed thousands of workers","Small houses made from mud bricks","Clay pots used for cooking at home","Seeds of barley found in the fields around the city"),
    histLevel(3,"What would most likely happen to Uruk if the farms around it had several bad harvests?","Food would run short for city workers","The city would grow faster than ever","Scribes would stop needing to write","More villages would move into the city"),
    histLevel(3,"A writer says cities made life better for everyone. Which evidence argues against this?","Records of heavy taxes and forced labor","Records of new jobs for skilled workers","Temples built for the city’s gods","Walls that protected the city"),
    histLevel(3,"A historian compares a farming village with Uruk. Which statement is accurate?","Uruk had more people and more kinds of jobs","The village had more people than Uruk did","Both had the same leaders and the same laws","Uruk had no farms nearby, so it bought food")
  ],
  tradeNetworks:[
    histLevel(1,"A buyer asks what goods your ships usually carry. What do you say?","Copper, pearls, and dates","Silk, paper, and tea","Iron, coal, and steel","Corn, potatoes, and chocolate"),
    histLevel(1,"Your apprentice asks why Dilmun is such a busy port. What is the best reason?","It sits between two trading regions","It is the capital of a huge empire","It has the largest farms in the world","It is the only island in the sea"),
    histLevel(1,"A sailor asks how heavy goods travel fastest between your ports. What do you say?","By boat over the water","By horse-drawn train","By road in wagons only","By carrying them on foot"),
    histLevel(2,"Your apprentice asks why long-distance trade is rarer than local trade. What do you say?","It is slow, costly, and risky","Kings ban most local trade","Distant goods cost very little","Boats had not been invented yet"),
    histLevel(2,"A Mesopotamian buyer asks why your copper is so valuable to them. What do you say?","Their land has very little metal","Copper is easy to find in their fields","Their kings collect only copper coins","They need it for printing books"),
    histLevel(2,"You press your seal into clay tablets to record each deal. What does this show?","Trade needed careful record-keeping","Traders could not count their goods","Writing was used for poems and prayers","Merchants did not trust each other"),
    histLevel(3,"A historian claims Dilmun traded with the Indus Valley. Which evidence best supports this?","Indus-style seals and weights found in Dilmun","Date palms growing all over the island","Old stories about a paradise island","Mesopotamian pots found in many Mesopotamian cities"),
    histLevel(3,"A trader claims long-distance trade made every town rich. Which evidence would challenge this?","Records of towns that never saw distant goods","Records of ships carrying copper and pearls","Rich tombs filled with fine goods from far-off lands","Seals used to mark goods for sale"),
    histLevel(3,"What would most likely happen to Dilmun if the Indus cities stopped trading by sea?","Dilmun’s trade and wealth would shrink","Dilmun would quickly grow into a huge empire","Mesopotamia would make its own copper","Dilmun’s date farms would disappear"),
    histLevel(3,"A historian compares local trade with long-distance trade. Which statement is accurate?","Long-distance trade mostly moved rare, costly goods","Local trade mostly moved rare, costly goods","Long-distance trade moved bread and water","Both kinds of trade moved the very same everyday goods")
  ],
  mesopotamia:[
    histLevel(1,"A citizen asks what the name Mesopotamia means. What do you say?","“Land between the rivers”","“Land of the high mountains”","“Land of endless sand”","“Land beside the sea”"),
    histLevel(1,"A farmer asks how to water crops when it rarely rains. What do you tell them?","Dig canals from the rivers","Wait for the spring snow","Plant only cactus and palms","Carry seawater to the fields"),
    histLevel(1,"Your scribe asks what to put your laws on so everyone can see them. What do you choose?","A tall stone pillar","A long silk banner","A small clay tablet","A painted wooden board"),
    histLevel(2,"Your laws give different punishments depending on who was harmed. What does this show about Babylon?","People of different ranks were treated differently","Each person was treated in the same way by the law","The king could be punished by the courts like anyone","Harming someone was not against the law in Babylon"),
    histLevel(2,"A judge asks why your laws mention fields, canals, and stolen animals so often. What do you say?","Farming was central to daily life","Most people in Babylon were sailors","Babylon had no farms of its own","Laws were written only for merchants"),
    histLevel(2,"A merchant asks why a city like Babylon needs writing. What is the best answer?","To keep track of taxes, trade, and laws","To write long stories that people read for fun","To replace speaking out loud","To send letters to people in the future"),
    histLevel(3,"A historian claims your laws were meant for everyone to know. Which evidence best supports this?","The laws were carved on a stone set in public","The laws were written in a secret code","Only priests were allowed to read them","The stone was buried deep under the palace floor"),
    histLevel(3,"Your law stone shows the sun god Shamash giving you the laws. Why might you show this?","To show the laws had the gods’ approval","To prove that you could not read or write","To show the laws would end very soon","To blame the god if the laws failed"),
    histLevel(3,"What would most likely happen if the canals were not cleaned and repaired for years?","Crops would fail and food would run short","Farms would get more water than ever before","The rivers would stop flooding forever","Cities would grow faster than before"),
    histLevel(3,"A historian has your law code but no records of real court cases. What is a limit of this source?","It shows the rules, not how they were used","It proves the laws were obeyed by the people","It was written long after the king died","It tells us little about life in Babylon")
  ],
  shangChina:[
    histLevel(1,"A visitor asks which river valley the Shang kingdom grew up in. What do you say?","The Yellow River valley","The Nile River valley","The Indus River valley","The Tigris River valley"),
    histLevel(1,"A priest asks what oracle bones are for. What do you explain?","Asking the ancestors about the future","Making strong bronze weapons","Counting grain stored in the king’s storehouses","Building walls around cities"),
    histLevel(1,"A soldier asks which metal is made by mixing copper and tin. What do you say?","Bronze","Iron","Steel","Silver"),
    histLevel(2,"A young noble asks why bronze vessels are used in ceremonies. What do you say?","To offer food and drink to ancestors","To cook meals for the soldiers","To store water for the farm fields in summer","To trade with far-off kingdoms"),
    histLevel(2,"A noble asks why only rich families own many bronze objects. What do you say?","Bronze was costly and took skill to make","Bronze was found lying on the ground","Poor families were not allowed to cook any food","Bronze was invented by poor farmers"),
    histLevel(2,"Your tomb will hold weapons, bronze, and jade. What will it tell historians about you?","You held high rank and power","You lived as a poor farmer","The Shang had no metal tools","Tombs were only for children"),
    histLevel(3,"A historian claims the Shang king relied on religion to rule. Which evidence best supports this?","Oracle bones with the king’s questions","Farm tools made from stone and wood","Pottery used every day in ordinary homes","Chariot wheels found in a pit"),
    histLevel(3,"Oracle bones were written for the king by his diviners. What is a limit of them as a source?","They show mostly the king’s concerns","They are too new to tell us anything","They were written in modern Chinese","They describe the lives of farmers in detail"),
    histLevel(3,"A historian compares Shang writing with Chinese writing today. Which statement is accurate?","Many modern characters grew from Shang ones","Shang writing has no link at all to Chinese today","Shang people wrote with a Latin alphabet","Modern Chinese was invented in the 1900s"),
    histLevel(3,"What would most likely happen if the Shang could no longer get tin?","They could not make much new bronze","They would stop farming millet","Oracle bones would stop working","Their writing would disappear overnight")
  ],
  egyptNubia:[
    histLevel(1,"A traveler asks what your kingdom in Nubia is also called. What do you say?","Kush","Sumer","Shang","Olmec"),
    histLevel(1,"A visitor asks what Nubia is famous for trading north to Egypt. What do you say?","Gold, ivory, and ebony","Silk, tea, and paper","Copper, pearls, dates","Corn, beans, and squash"),
    histLevel(1,"A scribe asks why so many people live close to the Nile. What do you say?","Its water and soil support farming","The desert is cooler than the river","The river is too dangerous to visit","Kings forbid living near water"),
    histLevel(2,"You build pyramids for your family’s tombs, like Egypt’s pharaohs. What does this show?","Egyptian ideas spread into Nubia","Nubia never had contact with Egypt","Pyramids were first built in China","Nubians did not bury their dead"),
    histLevel(2,"A soldier asks why Egypt and Nubia have fought over the land between them. What do you say?","Both wanted its gold and trade routes","Both wanted to stop all farming along the river","Neither kingdom had an army","The land was covered in snow"),
    histLevel(2,"You, a king of Kush, now rule Egypt as pharaoh. What does this show about the two lands?","Power could move in both directions","Egypt ruled Nubia for its whole history","Nubia had no kings of its own","The two lands had little contact"),
    histLevel(3,"A historian claims Nubia shaped Egypt, not only the other way around. Which evidence best supports this?","Records of Kushite kings ruling Egypt","Egyptian pyramids built near Cairo","Egyptian writing found on temples all over Egypt","Old paintings of the Nile flooding"),
    histLevel(3,"An old Egyptian record calls Kush “wretched.” Why should a historian be careful with this source?","It was written by a rival with a bias","It is the oldest record ever found","Egyptians rarely wrote about Nubia","It was written after the kingdom of Kush had ended"),
    histLevel(3,"What would most likely happen if the Nile’s floods failed for several years?","Harvests would fail along the river","The desert would turn into forest","Both kingdoms would grow more wheat","Trade on the river would grow"),
    histLevel(3,"A historian compares Nubia and Egypt. Which statement is accurate?","Both depended on the Nile and traded","Only Egypt depended on the Nile","Neither kingdom had any farming","Nubia was in Asia, far away from Egypt and the Nile")
  ],
  earlyAmericas:[
    histLevel(1,"A visitor asks who the giant stone heads you carve show. What do you say?","Our rulers","Our enemies","Animals of the forest","Gods of the rain"),
    histLevel(1,"A farmer asks which crop feeds most of your people. What do you say?","Maize","Rice","Wheat","Barley"),
    histLevel(1,"A child asks where your giant stones come from. What do you say?","Mountains far away, moved by people","They fell from the sky in a storm","They grew out of the ground here","Traders shipped them all the way from Egypt"),
    histLevel(2,"A visitor asks why later peoples in Mexico use ideas like yours. What do you say?","Olmec ideas spread and lasted","Olmec kings ruled most of Mexico","Later people met few outsiders","Ideas rarely spread between groups"),
    histLevel(2,"Moving stones that weigh many tons takes thousands of workers. What does this show?","Leaders could organize large projects","Olmec people used modern machines","Each family only ever worked for itself","The stones were actually very light"),
    histLevel(2,"Jade and other goods from far away are found in your city. What does this show?","Your people traded across a wide area","Jade forms in most rivers in Mexico","Your people rarely left the city","The goods were made by your sculptors"),
    histLevel(3,"A historian claims the Olmec influenced later peoples. Which evidence best supports this?","Olmec-style art found at later sites","Olmec maize fields near San Lorenzo","A legend told in Mexico in modern times","Stone tools found in Olmec homes"),
    histLevel(3,"Your people left very little writing. How will historians learn about your beliefs?","From carvings, figures, and sacred sites","From the long history books the Olmec wrote","From interviews with Olmec people","They cannot learn anything at all"),
    histLevel(3,"A historian compares the Olmec with Chavín in the Andes. Which statement is accurate?","Both built religious centers in different lands","Both were in the very same river valley in Mexico","Chavín was built in the Nile Valley","Neither society had leaders or beliefs"),
    histLevel(3,"What would most likely happen if the rivers near your city changed course?","Farming and trade there would suffer","The city would grow faster than ever","People would switch to growing rice","Nothing, since rivers did not matter")
  ],
  ancientIndia:[
    histLevel(1,"A builder asks what most houses in your city are made of. What do you say?","Baked bricks","Carved marble","Bamboo poles","Steel beams"),
    histLevel(1,"A visitor asks what the covered drains under your streets are for. What do you say?","Carrying away dirty water","Hiding gold from thieves","Storing grain for winter","Bringing water from the sea"),
    histLevel(1,"A merchant asks why your stone weights all come in set sizes. What do you say?","So trade is fair and measured","So soldiers can lift them easily","So children can play games","So the king can count gold"),
    histLevel(2,"Your bricks are the same shape as bricks in Indus cities far away. What does this suggest?","The cities shared standards and ideas","Each city made its bricks in its own way","Bricks were bought from Egypt","The cities had no contact at all"),
    histLevel(2,"A historian from the future asks why no one can read your writing. What is the reason?","It has not been decoded yet","There was never any writing","It was burned by later kings","It is too long to read"),
    histLevel(2,"A trader asks where your seals have turned up far from home. What do you say?","In Mesopotamia and Dilmun","In the cities of Shang China","In Rome and in Greece","In Olmec towns in Mexico"),
    histLevel(3,"Few weapons and no grand palaces have been found in your city. What can historians fairly conclude?","Power may have worked differently here","The city had no leaders of any kind","The people here had no conflicts","The palaces were later carried off to Egypt"),
    histLevel(3,"A historian claims your city was carefully planned. Which evidence best supports this?","Straight streets laid out in a grid","Pottery found in many of the houses","Seals carved with animal pictures","Beads found in Mesopotamian cities"),
    histLevel(3,"Historians cannot read your writing. What is the biggest limit this creates for them?","We know little about beliefs and rulers","We cannot even tell where the cities were","We cannot know what people built","We cannot study any objects at all"),
    histLevel(3,"What would most likely happen in your city if the drains were not kept clean?","Dirty water would spread sickness","The rivers would dry up at once","Trade with Dilmun would grow much larger","The bricks would turn into stone")
  ],
  earlyAgrarian:[
    histLevel(1,"A buyer asks what Mesopotamia, Egypt, the Indus Valley, and Shang China all grew up beside. What do you say?","Large rivers","High mountains","Thick forests","Frozen lakes"),
    histLevel(1,"The buyer asks which of the kingdoms you visited used oracle bones. What do you say?","Shang China","Egypt","Mesopotamia","The Indus Valley"),
    histLevel(1,"Which kingdom you visited built its cities between the Tigris and Euphrates?","Mesopotamia","Egypt","Shang China","The Indus Valley"),
    histLevel(2,"All four kingdoms you visited used writing. Why might growing societies need it?","To track taxes, trade, and laws","To write stories for fun only","Because farmers asked for books","To talk with people far in the future"),
    histLevel(2,"The buyer asks why Egypt’s deserts helped its people. What do you say?","They made attacks harder for enemies","They were full of farmland","They brought heavy rain to Egypt every year","They made trade with others easy"),
    histLevel(2,"Shang China built with rammed earth and timber, and the Indus Valley with baked brick. What explains differences like these?","Each place had different resources","Each place had the same materials","Traders refused to share their building goods","Kings chose materials at random"),
    histLevel(3,"A historian claims river floods shaped all four kingdoms. Which evidence best supports this?","Canals and flood-control works along each river","Bronze weapons found in Shang tombs","Indus seals found in Mesopotamia","Paintings of kings on the walls of their temples and palaces"),
    histLevel(3,"Someone says every early kingdom grew in exactly the same way. Which evidence would challenge this?","Very different buildings, writing, and rulers","The four kingdoms grew up beside large rivers","The four kingdoms each farmed grain","Each of the four kingdoms had cities"),
    histLevel(3,"What would most likely happen to a river kingdom if its river moved far away?","Farming would fail and people would leave","The kingdom would grow much richer","People would start farming in the river","Nothing would change, since rivers were not important"),
    histLevel(3,"A historian compares Egypt and the Indus Valley. Which statement is accurate?","We can read Egypt’s writing but not the Indus","We can read Indus writing but not the writing of Egypt","Neither left behind any buildings","Both were ruled by Shang kings")
  ]
};
const HISTORY3_BUILT_IN_LEVELS = {"villageNetworks":[1,1,2,2],"firstCities":[1,1,2,2],"tradeNetworks":[1,1,2,2],"mesopotamia":[1,1,1,2],"shangChina":[1,1,1,2],"egyptNubia":[1,1,2,2],"earlyAmericas":[1,1,2,1],"ancientIndia":[1,1,2,2],"earlyAgrarian":[2,2,1,2]};
Object.entries(HISTORY3_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY3_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));
Object.entries(HISTORY3_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY3_QUESTIONS[skillId] = [...(HISTORY3_QUESTIONS[skillId] || []), ...questions]; });
const HISTORY_UNIT2 = [
  {id:'earliestHumans',name:'The Earliest Humans | 2.1',lesson:'For most of human history people foraged. About 12,000 years ago some began farming, starting the Neolithic Revolution.'},
  {id:'migrationArt',name:'Migration and Art | 2.2',lesson:'Homo sapiens began in Africa and later migrated to other regions, leaving art and other evidence long before writing.'},
  {id:'foragingSocieties',name:'Foraging Societies | 2.3',lesson:'Foraging required deep knowledge and skill, supported by communities and networks.'},
  {id:'agriculturalRevolution',name:'The Agricultural Revolution | 2.4',lesson:'The move from foraging to agriculture laid the foundation for the first agricultural societies, with advantages and disadvantages.'},
  {id:'biggestMistake',name:'The Biggest Mistake Humans Ever Made? | 2.5',lesson:'Farming changed diets, communities, lifestyles, networks, and production and distribution, with lasting consequences.'}
];
const HISTORY_GROUPS2 = HISTORY_UNIT2.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id]}));
const HISTORY2_QUESTIONS = {
  earliestHumans:[
    {prompt:'The reporter asks: “For most of the 300,000 years of your species’ history, how did people mainly live?”',options:['As foragers','As farmers','As herders','As city dwellers'],answer:0},
    {prompt:'The reporter asks: “About how long ago did some people start experimenting with farming?”',options:['About 12,000 years ago','About 250 years ago','About 2,000 years ago','About 250,000 years ago'],answer:0},
    {prompt:'The reporter asks: “People in my time talk about the Neolithic Revolution. What was it?”',options:['The shift toward farming and settled life','The first use of metal tools and weapons','The move out of Africa to other continents','The rise of the first cities and kings'],answer:0},
    {prompt:'The reporter asks: “Why should I compare how people lived then with how we live now?”',options:['It shows what changed and what stayed the same','It proves that life today is better in every way','It shows that the past was just like today','It tells us which way of life was correct'],answer:0}
  ],
  migrationArt:[
    {prompt:'A visitor from the future asks: “Where did your people, Homo sapiens, first develop?”',options:['Africa','Europe','Asia','Australia'],answer:0},
    {prompt:'The visitor asks: “What can your paintings tell historians thousands of years from now?”',options:['Clues about our beliefs and skills','The exact thoughts of every painter','The names of the people who made them','A full record of everything we did'],answer:0},
    {prompt:'The visitor notices nobody here can write yet. What does your art show about that?',options:['People shared ideas in ways other than writing','Writing had already spread to most nearby groups','Art was made for decoration rather than meaning','People could not think in symbols yet'],answer:0},
    {prompt:'A historian of the future finds your paintings. What is the best next step for them?',options:['Compare them with other evidence','Assume they explain the whole culture','Ignore them because they have no words','Use them to find the artist’s exact name'],answer:0}
  ],
  foragingSocieties:[
    {prompt:'A traveler asks what your way of life is also called. You tell them foraging is also called:',options:['Hunting and gathering','Planting and harvesting','Herding and trading','Fishing and farming'],answer:0},
    {prompt:'A young member of your band asks why foraging takes so much knowledge. What do you teach them?',options:['Food sources change with place and season','Food stays in the same spot through the year','The band leader is the one who needs to know','Most wild plants are safe to eat anyway'],answer:0},
    {prompt:'The traveler asks how your community helps everyone survive. What do you say?',options:['By sharing skills, knowledge, and support','By having each family hunt on its own','By storing food in large stone granaries','By following orders from one powerful chief'],answer:0},
    {prompt:'The traveler asks how meeting other bands helps you. How could networks help foraging communities?',options:['They could trade goods and share news','They kept each band from ever moving','They made learning new skills unnecessary','They let one band rule all the others'],answer:0}
  ],
  agriculturalRevolution:[
    {prompt:'A forager passing by asks what this “agriculture” thing is. How do you explain it?',options:['Growing crops and raising animals for food','Gathering wild plants and hunting game','Moving with the herds from season to season','Trading food with neighboring bands'],answer:0},
    {prompt:'Your neighbor asks why you should keep farming. Which advantage do you point to?',options:['It can produce more food in one place','It guarantees good health for everyone','It removes the danger of drought','It means less work than foraging'],answer:0},
    {prompt:'Your neighbor worries about farming. Which disadvantage might come true?',options:['Crops could fail in a bad year','People would no longer plan ahead','Villages would shrink every year','Diets would include more kinds of food'],answer:0},
    {prompt:'A reporter from the future asks why your farm matters for the history that comes after. What do you say?',options:['Reliable food supported settled communities','It made trade between groups impossible','It ended the need for people to work together','It allowed people to stop using tools'],answer:0}
  ],
  biggestMistake:[
    {prompt:'A visitor asks which parts of life farming has changed in your village. What do you list?',options:['Diet, work, homes, and trade','The food people ate','The weather and the seasons','The tools and weapons people used'],answer:0},
    {prompt:'Someone says farming was “the biggest mistake” humans ever made. How should your village test that claim?',options:['Weigh benefits and costs for different people','Accept it because it sounds so dramatic','Look only at the problems that farming caused','Use one object from the village as proof'],answer:0},
    {prompt:'You want to show the visitor that the question has more than one side. Which statement shows that?',options:['Farming brought new benefits and new problems','Farming had no real effects on daily life','Everyone in the village experienced farming the same way','Farming solved every problem foragers had'],answer:0},
    {prompt:'A historian asks which frame helps most for studying how your village makes and shares food. What do you say?',options:['Production and distribution','Climate and geography','Leaders, laws, and government','Wars and battles'],answer:0}
  ]
};
// Phase 1 History Unit 2 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.
const HISTORY2_EXTRA_QUESTIONS = {
  earliestHumans:[
    histLevel(1,"The reporter asks: “Historians call your time the Paleolithic. What does that word mean?”","Old Stone Age","New Stone Age","Age of Bronze","Age of Writing"),
    histLevel(1,"The reporter asks: “What does your band mostly eat?”","Wild plants and hunted animals","Crops grown in our own fields","Food traded at a busy market","Bread baked from grain we store up"),
    histLevel(2,"The reporter asks: “Humans have existed about 300,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”","More than 90 percent","About half of it","About 10 percent","Less than 1 percent of it"),
    histLevel(2,"The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”","Most tools were still made of stone","People lived mostly in stone caves","Stone was used as a kind of money","Laws and writing were carved in stone"),
    histLevel(2,"The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?","Some parts of life stayed the same","Little has changed since your time","Your band lived the same way we do","Changes matter more than continuities"),
    histLevel(2,"The reporter asks: “Your band left no writing. How will historians in my time learn about you?”","From bones, tools, and old campsites","From the diaries your band kept each day","From newspapers of your time","From maps of your cities"),
    histLevel(3,"The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?","Campsites used at different times of year","A single cave painting of a horse herd","A modern film about life in the Ice Age","A stone house that a family used for centuries"),
    histLevel(3,"The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?","Early farm sites of very different ages","Old grinding stones from one early village","Bones of wild animals found at a campsite","Stories that say farming was very hard work"),
    histLevel(3,"The reporter asks you to compare your time with hers. Which statement is accurate?","Then most people found food; now most buy it","Then and now, most people grow their food","Then most people farmed; now most people hunt","Then, finding food took no knowledge"),
    histLevel(3,"The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?","Farming is a very recent part of history","Farming began near the start of history","Foraging lasted a short time in our history","Cities came before the first foragers did")
  ],
  migrationArt:[
    histLevel(1,"A visitor from the future asks: “What do most of the oldest cave paintings show?”","Animals such as horses and bison","Maps of farms and fields","Kings sitting in their great palaces","Lists of goods to trade"),
    histLevel(1,"A visitor asks how your people first reached the Americas from Asia. What do you say?","Over a land bridge or along the coast","By sailing west across the Atlantic Ocean","Through a tunnel under the sea","They had always lived there"),
    histLevel(2,"The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”","Low sea levels uncovered land","The Pacific Ocean froze solid","The rivers of Asia dried up","People built a long land bridge"),
    histLevel(2,"Your group crossed open sea to reach Australia. What does this tell the visitor about your people?","They could build boats and plan trips","They walked the whole way on land","They had written maps to find the way","They had already started farming"),
    histLevel(2,"A visitor finds a small carved figure in your camp. Why does it matter to historians?","It shows people made symbolic objects","It tells the carver’s exact name","It shows writing had been invented","It proves everyone shared one religion"),
    histLevel(2,"Two experts disagree about why your people painted caves. One studied the caves for 30 years; the other read one article. Whose view should carry more weight?","The one who studied the evidence","The one who wrote most recently","The one with the most exciting idea","Both equally, since it is all a guess"),
    histLevel(3,"A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?","Remains of different ages along different routes","One skull found in a single cave in East Africa","A cave painting of a group of people walking","A legend about one single great journey out of Africa"),
    histLevel(3,"Handprints in your cave are dated to about 40,000 years ago. What can historians reasonably conclude?","People were making art by that time","The artists also built cities","People had stopped migrating by then","Art began exactly 40,000 years ago"),
    histLevel(3,"A future historian says your paintings show what you ate every day. What is the problem with this claim?","Paintings may show what mattered, not meals","Paintings this old are very hard to date","The painters did not go hunting themselves","Paintings are less useful than written records"),
    histLevel(3,"Why do historians use DNA, along with tools and bones, to study your people’s migration?","It can show how groups are related","It shows what people believed","It gives the exact date of each trip","It replaces all other evidence")
  ],
  foragingSocieties:[
    histLevel(1,"A traveler asks why your band moves camp during the year. What do you say?","We follow plants and animals by season","Farmers nearby keep forcing us to leave","We like to visit new cities","Our fields need rest each year"),
    histLevel(1,"The traveler asks how many people live in your band. What is a typical answer?","A few dozen","A few thousand","Tens of thousands","Just one person"),
    histLevel(2,"The traveler notices your band owns few belongings. Why?","Moving often makes it hard to carry much","Owning things was against the band’s laws","Tools had not been invented yet","Traders took away the things you made"),
    histLevel(2,"A hunter brings back a large animal. What usually happens to the meat in your band?","It is shared across the band","It is sold at a market","The leader keeps all of it","It is stored for years in a granary"),
    histLevel(2,"Obsidian from a volcano 200 miles away is found at your camp. What does this suggest?","Your band traded with or met other groups","Your band lived beside the volcano","Obsidian forms naturally everywhere","Your band had built long roads to the volcano"),
    histLevel(2,"Your band meets another band each summer to share news and find marriage partners. Which frame fits this best?","Networks","Collective memory","Production and distribution","Scale"),
    histLevel(2,"A historian asks, “How did foragers get through a bad winter?” What is this question mainly asking about?","How foragers survived hard times","When winter starts each year","Which animals live in winter","Why farmers stored grain for winter"),
    histLevel(3,"Many foraging bands had no rich or poor members. Which evidence would best support this claim?","Burials with similar goods for everyone","One grave filled with gold and jewels","A large palace in the center of the camp","A painting of a chief sitting on a throne"),
    histLevel(3,"Studies of modern foragers find they often spend fewer hours getting food than many farmers spend working. What can you reasonably infer?","Foraging was not always nonstop work","Foragers never worked at all","Farmers had more free time than foragers","Modern foragers live exactly like ancient ones"),
    histLevel(3,"Why must historians be careful using modern foraging groups as evidence about your band?","Modern groups have changed over time","Modern foragers refuse to talk to anyone","Ancient foragers left far more writing","Modern foraging groups no longer exist")
  ],
  agriculturalRevolution:[
    histLevel(1,"A forager asks what “domesticate” means. What do you say?","To tame and breed plants or animals","To hunt wild animals in a new way","To move to a new home with each season","To trade food with the other villages"),
    histLevel(1,"Your village grew more food than it needed this year. What is the extra food called?","A surplus","A tribute","A shortage","A harvest tax"),
    histLevel(2,"Your village grows wheat and barley in Southwest Asia. What is this farming region often called?","The Fertile Crescent","The Silk Road route","The Sahara Desert","The Great Rift Valley"),
    histLevel(2,"A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?","Corn (maize)","Wheat and barley","Rice","Sugar cane"),
    histLevel(2,"Farming began in several places that had no contact with each other. What does this show?","Many peoples began farming on their own","One group taught farming to the others","Farming spread mainly through trade","Farming began in one place, then spread"),
    histLevel(2,"Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?","Specialization","Migration","Domestication","Surplus trading"),
    histLevel(2,"Which question about your village fits the production and distribution frame?","Who grows the grain, and who eats it?","What stories does the village tell?","Which gods does the village honor?","How does the village choose its rules?"),
    histLevel(3,"At a dig site, older layers hold small wild wheat seeds and newer layers hold larger seeds. What does this best show?","People were slowly domesticating wheat","Wild wheat vanished all at once","Farmers abandoned the site for a new one","Seeds grow larger as they age"),
    histLevel(3,"A historian claims farming spread from Southwest Asia into Europe. Which evidence best supports this?","Farm sites get younger moving into Europe","Europe has the oldest farm sites","Europeans told many old stories about farming","Wheat grows well in Europe today"),
    histLevel(3,"At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?","It could support large, settled towns","Farmers there still moved with the seasons","Each farming town needed a palace","Farming was invented in that town")
  ],
  biggestMistake:[
    histLevel(1,"A visitor asks how farming changed the number of people in the world. What do you say?","Populations grew much larger","Populations shrank quickly","Populations stayed about the same","Foragers had more children"),
    histLevel(1,"Living close to your goats and cattle brings a new danger. What is it?","Diseases spread from animals to people","Animals eat all of the crops","Animals make the river flood","People forget how to make their stone tools"),
    histLevel(2,"Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?","Less varied diets based on a few crops","Farmers spent too much time traveling","Foragers ate mostly grain and bread","Farmers ate too much meat in their meals"),
    histLevel(2,"Which change from farming helped make some people in your village richer than others?","Land and stored food could be owned","Food was shared equally by the village","People stopped making new tools","Bands moved to new land each season"),
    histLevel(2,"You are drawing a cause-and-effect map for your village. Which chain fits what farming did?","More food → more people → larger villages","More food → fewer people → smaller villages","Less work → fewer crops → more travel","More travel → more crops → fewer villages"),
    histLevel(2,"One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?","Farming did more harm than good for many","Farming did not really happen that way","Farming was invented by accident long ago","Farming helped each person in equal ways"),
    histLevel(3,"Which evidence best supports the claim that farming was a mistake?","Farmers’ bones show more disease and wear","Farming villages had many more people","Farming made writing possible later on","Farmers built homes that lasted for many years"),
    histLevel(3,"Which evidence best argues against the claim that farming was a mistake?","Surplus later supported cities and writing","Early farmers worked longer hours","Crop failures led to famine","Diseases spread to people from farm animals"),
    histLevel(3,"Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?","The answer depends on whose view you take","The question has one simple answer","Population growth is what matters most here","Individual lives tell us very little"),
    histLevel(3,"Once your village depends on farming, why is it hard to go back to foraging?","Wild food can’t feed so many people","Foraging had been banned by the chief","Wild plants had disappeared from the land","People were too busy building temples")
  ]
};
const HISTORY2_BUILT_IN_LEVELS = {"earliestHumans":[1,1,1,2],"migrationArt":[1,2,2,2],"foragingSocieties":[1,1,2,2],"agriculturalRevolution":[1,2,2,2],"biggestMistake":[1,2,2,2]};
Object.entries(HISTORY2_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY2_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));
Object.entries(HISTORY2_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY2_QUESTIONS[skillId] = [...(HISTORY2_QUESTIONS[skillId] || []), ...questions]; });
const HISTORY_UNIT4 = [   // Khan's practice exercises, in order (checked on khanacademy.org, Oct 27 2026)
  {id:'portableBelief',name:'Portable Belief Systems',lesson:'Portable belief systems travel with people, spreading along networks to new places and connecting diverse communities.'},
  {id:'hinduBuddhism',name:'Early Hinduism and Early Buddhism',lesson:'Hinduism and Buddhism developed in South Asia; their ideas about duty, suffering, rebirth, and liberation shaped people\u2019s lives.'},
  {id:'judaismChristianity',name:'Early Judaism and Early Christianity',lesson:'Judaism, Christianity, and Zoroastrianism developed in Southwest Asia and shaped later religious traditions and communities.'},
  {id:'islam',name:'The origins of Islam',lesson:'Islam began in Arabia; the life of Muhammad and the early Muslim community shaped its core beliefs and spread.'},
  {id:'comparePortable',name:'Comparing Portable Belief Systems',lesson:'Comparing portable belief systems helps explain why traditions spread across regions and connected diverse communities.'},
  {id:'persia',name:'Ancient Persia',lesson:'Persian rulers used political power, warfare, culture, and exchange to shape the ancient Mediterranean world.'},
  {id:'greece',name:'Classical Greece',lesson:'Greek, Macedonian, and Ptolemaic powers shaped the Mediterranean through politics, warfare, culture, and exchange.'},
  {id:'imperialChina',name:'Ancient and Imperial China',lesson:'The Zhou and Qin dynasties developed new ideas about government, power, and social order that shaped later Chinese empires.'},
  {id:'compareEmpires',name:'Comparing Ancient Empires',lesson:'Comparing empires shows different ways states expanded, governed diverse peoples, and justified their power.'},
  {id:'rome',name:'Ancient Rome',lesson:'Roman rulers grew and maintained their empire through military power, roads, law, and administration.'},
  {id:'romeHan',name:'Rome and Han China',lesson:'Comparing how Roman and Han rulers grew and maintained their empires.'},
  {id:'womenAncient',name:'Women in the Ancient World',lesson:'The roles of women differed in ancient Rome and Han China.'}
];
/* Khan's lessons 4.1 to 4.15 in order, each its own block (with its videos), and Khan's four quizzes where Khan has
   them: Quiz 1 after 4.4, Quiz 2 after 4.8, Quiz 3 after 4.11, Quiz 4 after 4.14 (docs/HISTORY-UNIT4.md). A block with
   noQuiz opens the next one when its practice is passed; a quiz covers every practice since the last quiz (quizSkills). */
const HISTORY_GROUPS4 = [
  {id:'overview4',name:'Empires and Belief Systems | 4.1',noQuiz:true,skills:[],learn:'From 600 BCE to 700 CE, new empires grew larger than ever, and belief systems that could travel with people spread along their roads and trade routes. Empires and beliefs often helped each other spread.'},
  {id:'portableBelief',name:'Portable Belief Systems | 4.2',noQuiz:true,skills:['portableBelief'],learn:'A portable belief system travels with people. Merchants, missionaries, and pilgrims carried faiths along trade routes to new places, connecting different communities.'},
  {id:'confucianism',name:'Confucianism, Legalism, and Daoism | 4.3',noQuiz:true,skills:[],learn:'Three Chinese traditions answered the same question differently: how do we bring order? Confucianism: good leaders and family duty. Legalism: strict laws and harsh punishments. Daoism: live simply, in harmony with nature (the Dao).'},
  {id:'hinduBuddhism',name:'Hinduism and Buddhism | 4.4',quizName:'Quiz 1',quizSkills:['portableBelief','hinduBuddhism'],skills:['hinduBuddhism'],learn:'Hinduism grew from the Vedic traditions of South Asia: dharma (duty), karma, samsara (rebirth), and moksha (release). The Buddha taught the Four Noble Truths and the Eightfold Path to end suffering. Emperor Ashoka helped Buddhism spread.'},
  {id:'judaismChristianity',name:'Judaism and Christianity | 4.5',noQuiz:true,skills:['judaismChristianity'],learn:'Judaism, Christianity, and Zoroastrianism developed in Southwest Asia. Judaism teaches belief in one God and the Torah; Christianity grew from the teachings of Jesus and spread across the Roman Empire; Zoroastrianism taught a struggle between good and evil.'},
  {id:'islam',name:'Islam | 4.6',noQuiz:true,skills:['islam'],learn:'Islam began in Arabia in the early 600s CE. Muslims believe Muhammad received revelations from God, gathered in the Quran. The Five Pillars shape Muslim life, and by 650 CE Muslim rule had spread across Southwest Asia and North Africa.'},
  {id:'comparePortable',name:'Comparing Portable Belief Systems | 4.7',noQuiz:true,skills:['comparePortable'],learn:'Comparing founders, sacred texts, beliefs about God or gods, and how each faith spread helps explain why some traditions crossed many regions.'},
  {id:'religionsChange',name:'How Do Religions Grow and Change? | 4.8',quizName:'Quiz 2',quizSkills:['judaismChristianity','islam','comparePortable'],skills:[],learn:'As faiths spread, they changed. Syncretism means blending beliefs and customs from different cultures, like Buddhist art taking on Greek and Chinese styles.'},
  {id:'persiaGreece',name:'Ancient Empires: Persians and Greeks | 4.9',noQuiz:true,skills:['persia','greece'],learn:'Persia built a huge empire with satraps, roads, and tolerance for local customs. The Greek city-states fought off Persian invasions; later Alexander of Macedonia conquered Persia, and Greek culture spread across a Hellenistic world.'},
  {id:'mauryaGupta',name:'Ancient Empires: Mauryan and Gupta | 4.10',noQuiz:true,skills:[],learn:'Chandragupta Maurya united much of India; his grandson Ashoka ruled by Buddhist ideas after a bloody war. Later, the Gupta Empire was a golden age of science and math, including a number system with zero and place value.'},
  {id:'imperialChina',name:'Ancient Empires: Zhou and Qin | 4.11',quizName:'Quiz 3',quizSkills:['persia','greece','imperialChina'],skills:['imperialChina'],learn:'The Zhou claimed the Mandate of Heaven. After the Warring States, the Qin united China with Legalist rule and standard laws, money, and writing, but fell quickly. The Han kept much of the Qin system and honored Confucian ideas.'},
  {id:'compareEmpires',name:'Comparing Ancient Empires | 4.12',noQuiz:true,skills:['compareEmpires'],learn:'Empires grew and held power in different ways: armies, roads, officials, money, laws, and beliefs that made rulers’ power seem right.'},
  {id:'romeAndHan',name:'Ancient Empires: Rome and Han China | 4.13',noQuiz:true,skills:['rome','romeHan'],learn:'Rome went from a republic to an empire ruled by emperors; Han China ruled with Confucian-trained officials. Both built roads, traded along routes across Asia, and faced trouble from inside and from the frontier.'},
  {id:'riseFall',name:'The Rise and Fall of Empires | 4.14',quizName:'Quiz 4',quizSkills:['compareEmpires','rome','romeHan'],skills:[],learn:'Empires often rose through strong armies and good organization, and declined through costly wars, weak or divided government, powerful landowners, and pressure on their borders.'},
  {id:'womenAncient',name:'Women in the Ancient World | 4.15',noQuiz:true,skills:['womenAncient'],learn:'Women’s lives in Rome and Han China were shaped by family, law, and class. Sources like Ban Zhao’s writings and Babatha’s legal papers show real women’s lives.'}
];
/* History Unit 4 bank, revised Oct 27, 2026 after a blind review (docs/HISTORY-UNIT4.md): accurate Han officials, faith claims
   as what followers believe, plausible wrong answers, Khan's missing topics, and short adapted sources in every lesson. */
const HISTORY4_QUESTIONS = {
  portableBelief:[
    histLevel(1,"A fellow traveler asks what makes a belief system “portable.” What do you say?","It travels with people to new places","It is tied to one temple","It is practiced by one family line","It can be followed in one holy city or shrine"),
    histLevel(1,"The traveler asks how portable belief systems usually spread. What have you seen on your journeys?","Along trade and travel routes","Through farming villages","Through written laws and courts","By keeping away from others"),
    histLevel(2,"The traveler asks how one belief can link people in very different places. What do you say?","Followers share beliefs and practices","They speak the same language","They live under one king and his laws","They stop trading with outsiders"),
    histLevel(1,"You point to monks traveling in your caravan. Which is an example of a portable belief system?","Buddhism","A local river god","A single town’s festival","A family’s house shrine"),
    histLevel(1,"A traveler asks what your caravans carry besides silk and spices. What do you say?","Travelers and their beliefs","Gold to pay the emperor’s taxes","Soldiers sent by the emperor to guard us","Grain for distant farms"),
    histLevel(1,"Which belief system have you seen spread along the Silk Road from India to China?","Buddhism","Confucianism","Zoroastrianism","Daoism"),
    histLevel(1,"A trader asks where people often first hear about a new faith. What do you say?","At markets and trading towns","In their home villages","Inside the king’s palace","From the books they buy at home"),
    histLevel(2,"A young trader asks why merchants carry their beliefs so far from home. What do you say?","They travel long distances for trade","They are paid to preach by kings","Beliefs are sold as trade goods","Their faiths forbid them to stay at home for long"),
    histLevel(2,"The ruler of an oasis city wants more trade. Why might he welcome traveling monks and teachers?","They bring visitors, ideas, and links","They promise to pay the city’s taxes","They bring soldiers to defend the city","They teach that trade with strangers is wrong"),
    histLevel(2,"Empires and belief systems often helped each other spread. How might an empire help a faith?","Its roads and peace made travel safer","Its army forced every subject to join the faith","Its officials kept travelers out of its cities","It made the faith’s teachers pay heavy tolls"),
    histLevel(3,"A historian claims Buddhism reached China along the Silk Road. Which evidence best supports this?","Buddhist cave temples at oasis towns on the route","Buddhist temples built only in the south of India itself","Silk found in Roman markets","Chinese farm tools from the same years"),
    histLevel(3,"Someone says beliefs spread only when armies forced them on people. Which evidence would challenge this?","Merchants and monks spreading faiths peacefully","Records of soldiers forcing a faith on a captured city","An emperor ordering everyone to convert","Walls built around a temple"),
    histLevel(3,"In the 300s CE, Christianity grows fastest in Roman cities linked by roads and sea routes. Which best explains why?","Travelers and traders carried it between connected cities","Roman law required every city in the empire to build a church","Christianity began in the city of Rome","Villages far from the roads heard it first"),
    histLevel(3,"In Rome, Christians begin meeting in basilicas, a kind of Roman public hall, and worship in Latin. What does this show?","Christianity took on Roman customs as it spread","Christians refused everything Roman","Christianity began in the city of Rome","Romans stopped using their public halls for courts and markets"),
    histLevel(2,"Chinese Buddhist teachers explain the Buddha’s teaching using Daoist words like “the Way.” Why would they do this?","To help Chinese readers understand a new faith","Laozi founded Buddhism in China","The emperor banned all Indian words from Chinese books","Buddhism began in China"),
    histLevel(3,"A Chinese monk wrote (adapted): “I traveled to India for many years with merchants, by land and by sea, to find Buddhist books.” What does this show about how Buddhism spread?","Monks used the same land and sea routes as traders","Indian kings sent armies to carry Buddhism to China","Buddhist books were easy to find in China","Travel between China and India was quick and safe"),
    histLevel(2,"Painted notes in a Buddhist cave at Dunhuang name the merchant families who paid for it. What does this suggest?","Merchants helped pay for Buddhist sites along the route","Monks avoided the trade routes","The caves were built by the Roman army as forts along the route","Only kings could pay for temples")
  ],
  hinduBuddhism:[
    histLevel(1,"A visiting monk asks if you know who founded Buddhism. What do you answer?","Siddhartha Gautama","Confucius of China","Mahavira of India","Laozi of China"),
    histLevel(1,"A Hindu adviser in your court talks about dharma. What does dharma refer to?","Duty and the right way to live","Wealth earned through trade","The power held by a king","Freedom from the cycle of rebirth"),
    histLevel(1,"A child asks what the cycle of death and rebirth is called. What do you tell them?","Samsara","Nirvana","Karma","Dharma"),
    histLevel(2,"A traveler asks which idea is at the heart of Buddhism. What do you say?","Ending suffering through the Eightfold Path","Gaining wealth to escape all suffering","Obeying the king as a living god","Keeping each person in a fixed caste forever"),
    histLevel(1,"A visitor asks what you carved on pillars across your empire. What do you say?","Messages about right living","Lists of the taxes owed","Maps of all the trade roads","Stories of my great battles"),
    histLevel(1,"A child asks what karma means. What do you say?","Actions have effects, now and later","People are born with the same fate","The gods decide what happens to you","Rebirth happens to kings and priests"),
    histLevel(1,"A monk asks in which region both Hinduism and Buddhism began. What do you say?","South Asia","East Asia","Southwest Asia","North Africa"),
    histLevel(2,"A monk asks why you turned to Buddhism after your war in Kalinga. What do you say?","You were sorry for the suffering it caused","You wanted to conquer even more lands, faster","Your army refused to fight any longer","Buddhism promised you more gold"),
    histLevel(2,"A monk asks what nirvana means in Buddhism. What do you say?","Freedom from suffering and rebirth","A heaven for kings and soldiers","The duty of each person in society","A great festival held each spring"),
    histLevel(2,"A monk asks what the Buddha taught in the Four Noble Truths. What do you say?","Life has suffering; it is caused by craving and can end","Each varna must keep its duty forever, and suffering is the price","The king is a living god to be obeyed","Only priests can escape rebirth"),
    histLevel(3,"A historian claims you spread Buddhist ideas across your empire. Which evidence best supports this?","Pillars with your Buddhist messages in many regions","A single statue of you standing in your capital city","Records of the taxes you collected","Coins with your name on them"),
    histLevel(3,"Your pillars praise your own goodness. Why should a historian be careful with them?","You wrote them to make yourself look good","They were carved after you died","Nobody in the empire could read them at the time","They say nothing about your rule"),
    histLevel(3,"A historian compares Hinduism and Buddhism. Which statement is accurate?","Both teach about rebirth and escaping it","Only Hinduism teaches about rebirth","Both were founded by the same teacher","Buddhism began in China, Hinduism in India"),
    histLevel(3,"You send Buddhist monks to Sri Lanka, and within a century Buddhism is strong there. Which best explains this?","Royal support sent missionaries and paid for monasteries","Your army conquered Sri Lanka and forced its people to convert","Buddhism had begun in Sri Lanka long before","Hindu priests asked you to spread a new faith"),
    histLevel(2,"A Brahmin priest says society has four varnas. How was the Buddha’s teaching different?","He taught that people of any varna could reach nirvana","He said only Brahmins could reach nirvana","He added a fifth varna for monks","He taught that varna decides who is reborn as a god or a king"),
    histLevel(2,"A scribe asks why you carved this on rocks (adapted): “In Kalinga, 100,000 were killed. The Beloved of the Gods feels deep sorrow.” What do you say?","To show your regret and teach rule by dhamma","To warn rebels of harsh punishments in every province","To record the taxes Kalinga must pay","To praise the gods of the Vedas"),
    histLevel(3,"Another of your edicts says (adapted): “Honor other faiths. By honoring them, you help your own.” What does this suggest about how you ruled?","You wanted different faiths to live in peace","You banned faiths other than Buddhism in your lands","You let Brahmins alone teach in the temples","You moved the monks to the capital"),
    histLevel(1,"Brahmin priests recite very old hymns in Sanskrit. Which sacred texts are these?","The Vedas","The Torah","The Avesta","The Analects"),
    histLevel(2,"Your Hindu adviser speaks of moksha. What does moksha mean?","Release from the cycle of rebirth","Duty that fits one’s place in life","The effects of one’s actions","A gift given to temple priests"),
    histLevel(2,"A monk says the Buddha taught a “Middle Way.” What did the Buddha mean?","A life between too much comfort and too much hardship","Living halfway between India and China","Following both the Hindu gods and the teachings of the Buddha","Giving half of your wealth to monks")
  ],
  judaismChristianity:[
    histLevel(1,"A traveler asks what Judaism is known for believing. What do you say?","One God and a covenant with Him","Many gods, one for each city","The Buddha’s path to nirvana","The Roman emperor as a living god"),
    histLevel(1,"The traveler hears people speaking about a new group. Christianity developed from teachings about whom?","Jesus of Nazareth","Moses the lawgiver","Siddhartha Gautama","Zoroaster of Persia"),
    histLevel(1,"A reporter from the future asks in which region Judaism and Christianity developed. What do you answer?","Southwest Asia","South Asia","North Africa","Southern Europe"),
    histLevel(1,"A child asks you about the most important sacred text of Judaism. What is it?","The Torah","The Quran","The Vedas","The Avesta"),
    histLevel(1,"A traveler asks why so many pilgrims come to Jerusalem. What do you say?","To worship at the Temple","To buy silk from China","To sign up for the Roman army","To see the pyramids"),
    histLevel(1,"A traveler asks what the Ten Commandments are. What do you say?","Laws that Jews believe God gave to Moses","Laws written down by a Roman emperor for the provinces","Sayings collected by Confucius","Ten steps on the path to nirvana"),
    histLevel(1,"A visitor describes a faith whose followers believe in a struggle between good and evil, keep sacred fires burning, and expect a final judgment. Which faith is it?","Zoroastrianism","Judaism","Buddhism","Hinduism"),
    histLevel(2,"Many followers of Jesus are Jewish, like Jesus himself. What does this show about early Christianity?","It grew out of Judaism","It began far away in India","It had no link to Judaism","It started in ancient Greece"),
    histLevel(2,"Followers of Jesus travel to Greece and Rome to teach. Why can Christianity spread so far?","Roman roads and sea routes linked many lands","Roman emperors ordered everyone to join it","Persian kings paid its teachers to travel","Its teachers stayed in Jerusalem, and visitors came to them"),
    histLevel(2,"Jews living far from Jerusalem still follow the Torah. What makes this possible?","The Torah goes wherever they go","Roman judges enforce the Torah everywhere","Priests offer sacrifices in every town","The Romans teach them the Torah"),
    histLevel(3,"A historian claims Christianity spread quickly to cities around the Mediterranean. Which evidence best supports this?","Letters to Christian groups in many cities","One church found in a single village","Roman coins that show the face of the emperor","A Greek play performed in Athens"),
    histLevel(3,"A Roman writer calls the Christians troublemakers. Why should a historian be careful with this?","He may have been biased against them","He wrote about Christians in Latin","He lived in the Roman Empire","Romans wrote very little about Christians"),
    histLevel(3,"A historian compares Judaism and Christianity. Which statement is accurate?","Both believe in one God and share the Hebrew scriptures","Both see Jesus as the Messiah","Christianity is older than Judaism","Both spread mainly by sending missionaries to every land"),
    histLevel(3,"Looking back: in 70 CE the Romans destroyed the Temple in Jerusalem. How did Jewish communities keep their faith afterward?","Prayer and Torah study in synagogues, led by rabbis","Offering sacrifices at a new Temple built in the city of Rome","Following Roman gods to stay safe","Moving the Torah to Persia for safekeeping"),
    histLevel(2,"Looking back: it is 313 CE, and Emperor Constantine has issued the Edict of Milan. What changes for Christians?","They may worship openly without punishment","They must move to Jerusalem","They must worship the emperor as a god","They may no longer read the Hebrew scriptures"),
    histLevel(3,"Paul writes to Christians in Galatia (adapted): “There is neither Jew nor Greek, slave nor free; you are all one in Christ.” What does this suggest about early Christianity?","It welcomed people from different backgrounds","It was only for Jews living in Jerusalem","It was the official faith of Rome","It kept slaves and free people apart in worship"),
    histLevel(3,"A Roman governor wrote (about 112 CE, adapted): “Christians meet before dawn, sing to Christ, and promise not to steal or lie. I found only a strange superstition.” What can a historian learn from it?","What early Christian worship and promises were like","That Christianity was already Rome’s official religion by then","That Christians lived only in Jerusalem","That the governor himself became a Christian"),
    histLevel(2,"A Persian traveler says his people worship one supreme god, Ahura Mazda, as Zoroaster taught. Which empire’s kings followed this faith?","Persia","Rome","Han China","The Maurya Empire"),
    histLevel(3,"Looking back: about 30 CE, Christianity was a small movement; by 380 CE it was Rome’s official religion. Which best explains the change?","Centuries of growth, then support from emperors like Constantine","Jesus was named a Roman emperor","The Persians conquered Rome and spread the new faith to every province","Judaism and Christianity joined into one faith")
  ],
  islam:[
    histLevel(1,"A traveler asks where Islam began. What do you tell them?","Arabia","Persia","Egypt","India"),
    histLevel(1,"The traveler sees people reciting from a book. What is the Quran?","The sacred text of Islam","A book of laws written by a caliph","A list of the trade routes to Mecca","A collection of poems about battles"),
    histLevel(1,"The traveler asks who Muslims regard as the Prophet who received revelations. What do you answer?","Muhammad","Abu Bakr","Zoroaster","Constantine"),
    histLevel(1,"The traveler asks what the Five Pillars of Islam are. What do you say?","Core duties of every Muslim","Five holy cities in Arabia","Five chapters of the Quran","Five rulers who came after Muhammad"),
    histLevel(1,"A traveler asks what the Kaaba in Mecca is. What do you say?","A holy shrine Muslims pray toward","The palace of the caliph","A busy market for spices and silk from Asia","A tomb for the kings of Arabia"),
    histLevel(1,"A traveler asks what the hajj is. What do you say?","A pilgrimage to Mecca","A tax paid to the caliph","A month of feasting","A prayer said at sunset"),
    histLevel(1,"A child asks what a mosque is. What do you say?","A place where Muslims pray","A school for traders","A house where the caliph lives","A tomb for the prophets"),
    histLevel(2,"Muhammad and his followers moved from Mecca to Medina in 622. What is this journey called?","The Hijra","The Hajj","The Kaaba","Ramadan"),
    histLevel(2,"A traveler asks why Islam spread so quickly from Arabia. Which reason do you give?","Trade routes and new Muslim rulers","Merchants were forced to join it","Arabia had little contact with others","It was spread by sailors from China"),
    histLevel(2,"A visitor sees people fasting from dawn to sunset for a whole month. Which month is it?","Ramadan","Muharram","The Hijra","The Hajj"),
    histLevel(3,"A historian claims Islam spread along trade routes. Which evidence best supports this?","Early mosques in port and market towns","A mosque built in Mecca itself","Arabic poems that were written before Islam","A map of the deserts of Arabia"),
    histLevel(3,"Islam teaches that Muhammad was the last of a line of prophets that includes Abraham, Moses, and Jesus. What does this show?","Islam shares roots with Judaism and Christianity","Islam has no link to any faith that came before it","Islam began long before Judaism did","Muslims reject the earlier prophets as false"),
    histLevel(3,"A historian reads a story about Muhammad written 200 years after his death. What is a limit of this source?","Details may have changed over time","It was written too close to his life","It was written in Arabic","It describes life in Mecca"),
    histLevel(3,"Within about 20 years of Muhammad’s death in 632, Muslim armies won Syria, Egypt, and Persia. Which best explains how they won so much so fast?","Long wars had worn out the Byzantine and Persian empires","Arabia had far more people and soldiers than both empires together","The Han emperor sent troops to help them","Mecca’s merchants paid both empires to leave"),
    histLevel(1,"Muslims believe Muhammad received his first revelation from God about 610 CE in a cave near which city?","Mecca","Medina","Jerusalem","Damascus"),
    histLevel(2,"It is 650 CE. Arab Muslim armies now hold Syria, Egypt, and much of Persia. Which empires lost these lands?","The Byzantine (Eastern Roman) and Sasanian Persian empires","The Han and Qin empires","The Mauryan and Gupta empires","The old Achaemenid Persian and Assyrian empires of Southwest Asia"),
    histLevel(2,"Under early Muslim rulers, Jews and Christians are called “People of the Book.” What does this usually mean for them?","They may keep their faith if they pay a special tax","They must convert to Islam","They may not trade or own shops in the markets of Muslim cities","They help choose the caliph in each new generation"),
    histLevel(2,"After Muhammad died in 632, who led the Muslim community?","Caliphs, starting with Abu Bakr","The Byzantine emperor in Constantinople","A council of Persian priests","The kings of Yemen"),
    histLevel(3,"A traveler reads in the Quran (adapted): “There is no compulsion in religion.” Which statement does this best support?","Islam teaches that faith should not be forced","Muslims are to pray five times each day, facing Mecca","Islam began in Medina","Only Arabs may become Muslims"),
    histLevel(2,"You read in the Quran (adapted): “Call the people to the pilgrimage; they will come on foot and on camels from every distant road.” What does this suggest about Mecca?","Pilgrims would come to Mecca from faraway lands","Mecca would close to outsiders","Pilgrims had to live in Mecca","Only people born in Mecca could make the hajj each year")
  ],
  comparePortable:[
    histLevel(1,"Back home, a student asks why you compare the belief systems you met. What do you say?","To see what is alike, what differs, and why","To prove the faiths are the same","To decide which faith is the true one","To find which faith has the most followers today"),
    histLevel(2,"The student asks what many portable belief systems have in common. Which similarity do you name?","Teachings about how to live and treat others","They began in the same city","They forbid their followers to travel far from home","They have few followers or communities"),
    histLevel(1,"The student asks what helped beliefs travel as far as you did. What do you answer?","Trade routes, travelers, and empires","Laws that made one faith the same everywhere","Teachers who stayed in their home temples","Wars that closed the trade roads"),
    histLevel(3,"In Gandhara you saw statues of the Buddha in Greek-style robes; in China, Buddhist temples look like Chinese palaces. Which claim is best supported?","Buddhism blended with local art and customs as it spread","Buddhism spread only where armies forced it on people","Buddhism began in Greece and moved east to India and China","Buddhist art looked the same everywhere"),
    histLevel(1,"A student asks why you walked all the way to India. What do you say?","To study Buddhism where it began","To sell silk in the big markets of India","To lead an army for the emperor","To find a new route to Rome"),
    histLevel(1,"A student asks which faith began recently in Arabia, far from the lands you visited. What do you say?","Islam","Buddhism","Hinduism","Confucianism"),
    histLevel(1,"Which faith you met in India has no single founder and teaches dharma, karma, and samsara?","Hinduism","Islam","Judaism","Christianity"),
    histLevel(2,"You bring hundreds of Buddhist texts back to China and translate them. Why does this matter?","More people can read the teachings","Fewer people can learn about Buddhism","The texts can be read by monks in India","China will stop trading with India"),
    histLevel(2,"A student asks what Buddhism, Christianity, and Islam have in common. What do you say?","They welcome people from many lands","They began in the same region","They are tied to one family line","They worship the same founder and god"),
    histLevel(2,"A student asks why Buddhist temples in China look different from those in India. What do you say?","Builders mixed in their own local styles","Chinese law banned temples from India","Indian monks built each temple in China","Buddhism does not allow large stone buildings"),
    histLevel(3,"A historian claims Buddhism changed as it reached China. Which evidence best supports this?","Chinese Buddhist art showing local styles","Buddhist texts that stayed only in India forever","Silk sold in the markets of India","Temples in India built before the Buddha"),
    histLevel(3,"Your travel diary describes India for the Chinese emperor. What is a limit of it as a source?","It shows India through one traveler’s eyes","It was written many centuries after the trip","It describes China rather than India","Its writer did not actually visit India"),
    histLevel(2,"A student asks which three faiths teach belief in one God. What do you say?","Judaism, Christianity, and Islam","Hinduism, Buddhism, and Daoism","Judaism, Buddhism, and Islam","Christianity, Hinduism, and Confucianism"),
    histLevel(3,"In India you find many Buddhist monasteries half empty, while back home Buddhism is growing. What does this show?","A faith can grow in new lands while fading in its homeland","Buddhism began in China and moved to India","Indian kings had banned all travel and trade with China","Chinese monks built India’s first monasteries and temples long ago"),
    histLevel(2,"A student asks you to match a faith with its founder. Which pair is correct?","Buddhism and Siddhartha Gautama","Islam and Abraham","Christianity and Moses the lawgiver","Hinduism and Confucius"),
    histLevel(2,"You wrote (adapted): “At Nalanda, thousands of monks study day and night, and scholars come from many lands to ask questions.” What does this show?","Buddhist learning drew students from many lands","Nalanda was a Chinese palace for visiting scholars","Monks in India did not study texts","Buddhism was banned in India"),
    histLevel(2,"Which faith mainly passed from parents to children within one people, rather than sending missionaries far away?","Judaism","Buddhism","Christianity","Islam")
  ],
  persia:[
    histLevel(1,"A new governor asks how you rule such a huge territory. What do you tell him?","Through provinces called satrapies","Through city-states that rule themselves","Through one army camp in each town","Through the priests of each temple"),
    histLevel(1,"A royal messenger asks what the Royal Road is for. What do you say?","Sending messages fast across the empire","Carrying water to the farm fields in dry seasons","Marching armies only to Greece","Carrying silk from Han China"),
    histLevel(2,"A conquered city asks what kind of ruler you will be. What are rulers like you known for?","Letting conquered peoples keep their customs","Forcing everyone to speak Persian","Destroying the temples of each city","Moving every person they conquered to Persia"),
    histLevel(1,"A reporter from the future asks the name of the empire you founded. What do you answer?","Achaemenid Empire","Babylonian Empire","Assyrian Empire","Macedonian Empire"),
    histLevel(1,"A visitor asks how far the Persian Empire reached at its height. What do you say?","From Egypt to India","From Rome to China","From Greece to Spain","Across Persia and Mesopotamia"),
    histLevel(1,"A new official asks what a satrap is. What do you say?","A governor of a province","A soldier in the royal guard","A priest of the sun god","A merchant on the Royal Road"),
    histLevel(1,"After you take Babylon, what do you do for the Jewish people who were held captive there?","Let them return home to Jerusalem","Keep them as slaves in Babylon","Send them to fight in Greece","Force them to worship your own gods"),
    histLevel(2,"A general asks why you let conquered peoples keep their own religions. What do you say?","It makes them less likely to rebel","Persia has no religion of its own","Our army is too small to fight","My own priests ordered me to do it"),
    histLevel(2,"A messenger rides the Royal Road, changing horses at each station. What is the main advantage?","News crosses the empire in days","Messengers never need to rest at all","Armies no longer need horses","Trade on the road is stopped"),
    histLevel(2,"Your empire collects taxes from every province. What do the taxes pay for?","Armies, roads, and officials","Gifts for the Greek cities","Roads and forts in faraway Han China","The king’s private feasts"),
    histLevel(3,"A historian claims the Persians respected local customs. Which evidence best supports this?","A record of Cyrus restoring local temples","Records of Persian soldiers marching to war","A map of the Royal Road","Greek stories calling Persians cruel"),
    histLevel(3,"Greek writers called the Persian kings proud and cruel. Why should a historian be careful with this?","The Greeks were Persia’s enemies","The Greeks had never fought the Persians","Persian records agree with them","Greek writers usually praised Persia"),
    histLevel(3,"Looking back: Persia’s satraps ruled far from the king. Which step did Darius I take to keep them loyal?","He sent royal inspectors called the “king’s eyes and ears”","He let each satrap raise armies and mint coins freely","He made every satrap live at the palace in Persepolis all year","He closed the Royal Road to stop rebels"),
    histLevel(3,"A historian compares how the Assyrians and the Persians treated conquered peoples. Which statement is accurate?","Persia often let peoples keep their gods; Assyria often used terror","Assyria let peoples keep their gods and customs; Persia ruled by terror","Both forced every conquered people to worship their gods","Neither empire collected taxes from conquered lands"),
    histLevel(2,"A scribe asks why you had this written on a clay cylinder (adapted): “I returned the gods to their homes and let their people go back to their towns.” What do you say?","To show I am a fair ruler who respects local gods","To announce that Babylon has defeated Persia","To warn that I will destroy the temples of every city that rebels","To show that Persia has no gods of its own"),
    histLevel(3,"Darius I had this carved on a cliff (adapted): “By the favor of Ahura Mazda I am king. The lands obeyed me and brought tribute.” What purpose did it serve?","To claim his god chose him and to show his power","To record a trade deal with the Greek city-states","To list the crops grown by Persian farmers each year","To apologize for a lost war"),
    histLevel(2,"Looking back: which Persian king organized the satrapies, built Persepolis, and issued gold coins called darics?","Darius I","Cyrus II","Ashoka","Pericles"),
    histLevel(3,"Looking back: Xerxes’ fleet lost at Salamis in 480 BCE, and his army lost at Plataea the next year. What was the result?","Persia stopped trying to conquer mainland Greece","Persia ruled Athens and Sparta for the next hundred years","Sparta became a Persian satrapy","Alexander became king of Persia")
  ],
  greece:[
    histLevel(1,"A student asks how most Greek communities are organized. What do you say?","City-states","One empire under a king","Bands of nomads","Provinces of Persia"),
    histLevel(1,"A visitor to Athens asks what your city is famous for developing. What is it?","Democracy, rule by the citizens","Rule by a single emperor","Rule by the priests of the city temple","Rule by the Mandate of Heaven"),
    histLevel(2,"Your old student Alexander has marched far to the east. How did he spread Greek culture?","By conquering a large empire","By trading only with Rome","By defeating Sparta at Thermopylae","By sending teachers but no army"),
    histLevel(1,"A student asks what Sparta is known for. What do you answer?","A military-focused society","A city with no army","A city ruled by philosophers","A city known for its theaters"),
    histLevel(1,"A student asks who could vote in Athens. What do you say?","Free adult men who were citizens","Each adult living in Athens","The richest families in the city","Women, men, and enslaved people"),
    histLevel(1,"A student asks which philosopher taught your own teacher, Plato. What do you say?","Socrates","Homer","Pericles","Alexander"),
    histLevel(1,"A visitor asks where Greek city-states sent ships to start new colonies. What do you say?","Around the Mediterranean Sea","Up the rivers of northern Europe","Along the coast of India","Only to the islands near Athens"),
    histLevel(2,"After Alexander died, his generals split his empire. Which land did Ptolemy take?","Egypt","Persia","Greece","India"),
    histLevel(2,"A student asks why Athens, Sparta, and many other city-states fought side by side against Persia. What do you say?","To face a common enemy","They were ruled by one king","Persia ordered them to unite","They had no armies of their own"),
    histLevel(2,"A student asks why Greek ideas have spread as far as Egypt and India. What do you say?","Alexander’s conquests carried them","Greek merchants never left home","Egypt and India sent teachers to Greece","Persian kings banned Greek ideas"),
    histLevel(3,"A historian claims Greek culture spread after Alexander’s conquests. Which evidence best supports this?","Greek-style cities and coins found in Egypt and Asia","Greek temples built in Athens","Persian palaces built long before Alexander was even born","Spartan soldiers training at home"),
    histLevel(3,"You write that some people are slaves by nature. Why must historians read your views with care?","Writers reflect the beliefs of their time","You did not write anything down","Each person in Athens agreed with you","Slavery did not exist in Athens during your life"),
    histLevel(3,"A historian compares Athens and Sparta. Which statement is accurate?","Athens was a democracy; Sparta had two kings and a council of elders","Both let every adult resident vote","Sparta valued open debate; Athens valued military training above the rest","Both were ruled by Persian satraps"),
    histLevel(3,"Athens grew rich leading the Delian League, a group of allies against Persia. Which best explains why many allies turned against Athens?","Athens used the league’s money and power to rule over them","Athens refused to fight Persia","Sparta was a democracy that wanted to free the allies from Athens","Macedonia had already conquered Athens"),
    histLevel(2,"Looking back: why did the Athenian leader Pericles spend Delian League money on the Parthenon?","To glorify Athens and show its power","To pay tribute to Persia","To honor Sparta","To build a palace for a king of Athens"),
    histLevel(3,"Pericles said in a speech for Athens’ war dead (adapted): “Our government is called a democracy because power is in the hands of the many, not the few.” What was his purpose?","To make Athenians proud of their city during the war","To ask Sparta for peace","To explain to the Athenians how Persian law and courts worked","To argue that Athens should be ruled by one king"),
    histLevel(3,"Sparta defeated Athens in 404 BCE after 27 years of war. What was one long-term effect?","The weakened city-states were later conquered by Macedonia","Athens went on to conquer Persia","Greece united under Sparta for centuries and never fought again","Rome took over Athens at once"),
    histLevel(2,"In 480 BCE, a small Greek force led by Spartans held the pass at Thermopylae against Persia’s huge army. Which war was this part of?","The Persian Wars","The Peloponnesian War","The Punic Wars","Alexander’s conquest of Persia"),
    histLevel(2,"After Alexander, Greek-speaking kingdoms ruled from Egypt to Afghanistan. What do historians call this world?","The Hellenistic world","The Pax Romana","The Warring States","The Classical Age of Athens")
  ],
  imperialChina:[
    histLevel(1,"A scholar asks what the Mandate of Heaven means. What do you tell him?","Heaven’s approval to rule, which can be lost","A law that gives each new ruler power for life","A tax that farmers pay to the emperor","A rule that priests must govern China"),
    histLevel(2,"An official asks how the Qin unified China. What do you answer?","By making laws, writing, and coins the same","By letting each state keep all of its own rules","By giving power back to local lords","By teaching kindness instead of laws"),
    histLevel(1,"A student asks which philosophy you follow, the one that favors strict laws and punishments. What is it?","Legalism","Daoism","Confucianism","Buddhism"),
    histLevel(1,"A historian asks which dynasty ruled before the Qin and used the Mandate of Heaven. What do you say?","The Zhou","The Han","The Tang","The Shang"),
    histLevel(1,"A scholar asks what title your ruler took after uniting China. What do you say?","First Emperor","Son of the Buddha","King of the Zhou","Great Satrap"),
    histLevel(1,"A builder asks what the emperor ordered built to protect the north. What do you say?","Long defensive walls","A royal road to Persia","Huge pyramids for tombs","A canal to India"),
    histLevel(1,"A student asks what Confucius taught about ruling well. What do you say?","Rulers should set a good example","Rulers should use harsh punishments","Rulers should avoid all duties","Rulers should obey the farmers"),
    histLevel(2,"An official asks why all of China must now use the same written characters. What do you say?","So orders can be read everywhere","So scholars can write poetry","So merchants can avoid taxes","So each state can keep its own laws"),
    histLevel(2,"A Daoist hermit says rulers should do less and follow nature. How does your Legalism differ?","It wants strict laws and harsh punishments","It agrees completely that rulers should do less","It says nature should rule the land","It says there should be no rulers"),
    histLevel(2,"Under the Zhou, lords ruled their own lands for the king. What problem did this cause?","Lords grew strong and fought each other","The king had far too much power over them","Nomads chose who would be king","Farmers stopped paying taxes to the lords"),
    histLevel(3,"A historian claims the Qin ruled harshly. Which evidence best supports this?","Records of burned books and forced labor","Coins that looked the same all across China","Roads connecting distant regions","Walls built along the northern border"),
    histLevel(3,"Later Han historians wrote that the Qin were cruel. Why should a historian be careful with this?","The Han took over and wanted to look better","Qin officials wrote the Han histories for them","The Han and Qin were the same dynasty","Han historians copied Greek books"),
    histLevel(3,"Looking back: the Qin fell in 206 BCE, only 15 years after uniting China. Which best explains its quick fall?","Harsh laws, heavy taxes, and forced labor led to revolts","The Han conquered it from Korea","Buddhist monks turned people against it","Its new writing system was too hard for officials to learn"),
    histLevel(3,"A historian compares Zhou and Qin rule. Which statement is accurate?","The Zhou let lords rule; the Qin sent officials loyal to the emperor","The Qin let lords rule their own lands; the Zhou sent loyal officials","The Zhou followed Legalism; the Qin followed Confucianism","Both kept powerful lords in charge of each region"),
    histLevel(2,"Why did Confucius, Laozi, and Han Feizi all teach during the Zhou’s long years of war?","Constant war pushed thinkers to find ways to restore order","The Qin paid them to write","Buddhism had just arrived from India","China was at peace, so thinkers had lots of free time to write"),
    histLevel(2,"A saying from the Daodejing (adapted): “The more laws are made, the more thieves there will be.” Which thinker’s ideas does it fit?","Laozi and Daoism","Han Feizi and Legalism","Confucius and Confucianism","The Buddha"),
    histLevel(3,"Confucius said (adapted): “Lead people with laws and punishments, and they avoid crime but feel no shame. Lead them with virtue, and they will be good.” What is he arguing?","A ruler’s good example works better than harsh laws","Harsh punishments are the best way to make people good","Rulers should do nothing at all","People should obey temple priests"),
    histLevel(3,"Looking back: the Han kept the Qin’s provinces, officials, and coins but softened the punishments and honored Confucius. What does this show?","Continuity and change from Qin to Han","A complete break with the Qin","Han rule copied the Qin with no changes","A return to rule by lords, as under the Zhou")
  ],
  compareEmpires:[
    histLevel(1,"The emperor asks why your report compares the empires you visited. What do you say?","To learn how rulers grow, govern, and hold power","To prove that the empires were alike","To pick which empire is the strongest of them","To list each emperor’s name and dates in time order"),
    histLevel(1,"The emperor asks how rulers you met convinced people they had the right to rule. Which way did they use?","Claiming the gods or Heaven chose them","Letting the people vote them out each year","Giving up all their authority","Ignoring the people they ruled"),
    histLevel(2,"The emperor asks what helped those empires govern so many different peoples. What do you report?","Roads, officials, and laws","Making every people speak one language","Letting each city choose its own king","Taxing the capital city but not the provinces"),
    histLevel(3,"Persia let conquered peoples keep their customs and ruled through satraps. The Qin forced the same laws, money, and writing on everyone. What does this comparison show?","Persia relied more on tolerance; the Qin relied more on uniform control","The Qin relied more on tolerance, and Persia relied more on uniform control","Both empires claimed the Mandate of Heaven","Both let local lords ignore the ruler"),
    histLevel(1,"The emperor asks what animals you saw in Ferghana that he wants for his army. What do you say?","Strong, fast horses","War elephants","Camels for the desert","Trained hunting dogs"),
    histLevel(1,"The emperor asks which trade routes your journey helped open between China and the West. What do you say?","The routes west through Central Asia (later called the Silk Roads)","The Royal Road built by the Persian kings across their huge empire","The Appian Way","The Grand Canal"),
    histLevel(1,"A young official asks what an empire is. What do you say?","One ruler governing many lands and peoples","A single city that governs only itself and no others","A village ruled by its elders","A group of traders on a road"),
    histLevel(2,"You saw empires let local leaders keep some power. Why might rulers do this?","It is hard to rule faraway lands directly","Local leaders always had bigger armies than the ruler","The Mandate of Heaven required it","Faraway peoples chose the emperor"),
    histLevel(2,"Why do large empires build roads and post stations?","To move armies, messages, and goods","To keep people from moving between provinces","To mark the borders of farms","To collect tolls for local lords"),
    histLevel(2,"You were held captive by the Xiongnu nomads for years. Why does the Han care so much about them?","They raid Han lands from the north","They are Persian merchants who trade silk","They are Han soldiers who rebelled","They are monks spreading Buddhism"),
    histLevel(3,"A historian claims empires used religion to justify rulers’ power. Which pair of evidence best supports this?","Zhou kings citing the Mandate of Heaven, and Roman emperors honored as gods","Buddhist monks on the trade routes, and Christians meeting in each other’s homes","Persian roads, and Roman roads","Han Confucian schools, and Athenian assemblies"),
    histLevel(3,"Your reports describe foreign lands for the Han emperor. What is a limit of them as a source?","They show other lands from a Han point of view","They were written by the rulers of Rome","They describe only the Han capital","They were written a thousand years after the trip"),
    histLevel(3,"Someone says every empire ruled by force alone. Which evidence would challenge this?","Empires that won loyalty with tolerance and trade","Armies that conquered many new lands in a few years","Walls built to keep out raiders","Rulers who punished rebels harshly"),
    histLevel(2,"Chandragupta Maurya’s adviser Kautilya wrote a guide to ruling with strict control and many spies. Which Chinese philosophy is it most like?","Legalism","Daoism","Confucianism","Buddhism"),
    histLevel(1,"Gupta scholars in India are famous for which achievement?","A number system with zero and place value","The first democracy, with assemblies of citizens","The Royal Road","Paper money"),
    histLevel(2,"Persia divided its empire into satrapies, and the Han into commanderies. What did both systems do?","Divided the empire into regions run by officials","Let each region choose its own king","Gave all power in each region to the local priests","Kept each region free from taxes"),
    histLevel(3,"Kautilya’s Arthashastra (adapted) says a king should keep spies everywhere, punish strictly, and know that “in the happiness of his subjects lies his happiness.” Which best describes its advice?","Strict control, but also a duty to the people’s welfare","Rule only through kindness and gifts, with no punishments at all","Let the priests run the government","Leave each village to rule itself"),
    histLevel(2,"A Gupta scholar named Aryabhata worked out that the Earth spins on its axis. What does this suggest about the Gupta period?","It was a time of great science and learning","It was a time of constant war","Gupta rulers banned the study of the sky and stars","Indian scholars copied this from Rome")
  ],
  rome:[
    histLevel(1,"A new recruit asks who became the first Roman emperor. What do you answer?","Augustus","Julius Caesar","Constantine","Nero"),
    histLevel(1,"The recruit asks what people mean by the Pax Romana. What do you tell him?","A long time of peace across the empire","A great war that lasted two hundred years","The Roman law code carved on tablets","The road from Rome to the frontier"),
    histLevel(1,"A merchant asks how Rome keeps control of such a huge territory. What do you say?","Roads, legions, and law","Letting each city have its own army","Closing the borders to all trade","Asking the Senate to vote each day"),
    histLevel(1,"A child asks what Rome was before it had emperors. Just before the emperors, Rome was a:","Republic","Province of Persia","Greek city-state","Colony of Carthage"),
    histLevel(1,"A new recruit asks what a legion is. What do you say?","A large unit of Roman soldiers","A Roman law about taxes","A road built by the army","A temple built for all the Roman gods"),
    histLevel(1,"A recruit asks which language is spoken across the western empire. What do you say?","Latin","Greek","Persian","Arabic"),
    histLevel(1,"A recruit asks why the army builds roads everywhere. What do you say?","So soldiers can march quickly","So farmers can avoid paying taxes","So the Senate can meet in each province","So Rome can trade directly with the Han"),
    histLevel(2,"Conquered people could become Roman citizens. Why would this help the empire?","It made them more loyal to Rome","It meant they paid no taxes at all","It let them leave the empire","It gave each of them a seat in the Senate"),
    histLevel(2,"A merchant asks how Roman rule makes trade easier across the empire. What do you say?","One common coin, safe roads, and peace at sea","Each town keeps its own coins, weights, and trading rules","Only soldiers may buy and sell goods","Trade is banned outside the city of Rome"),
    histLevel(2,"A recruit asks why Rome keeps so many soldiers on the frontier. What do you say?","To defend the borders from raids","To guard the Senate in Rome","To collect silk from Han China","To keep farmers from leaving Italy"),
    histLevel(3,"A historian claims Roman roads held the empire together. Which evidence best supports this?","Roads linking Rome to its farthest provinces","A handful of roads found only close to Rome itself","Roman coins found in a single city","Paintings of emperors in palaces"),
    histLevel(3,"A Roman historian praises the emperor who pays him. Why should a historian be careful with this source?","He may flatter the emperor to keep his pay","He wrote in Latin","He lived in the city of Rome near the emperor’s palace","He wrote about many emperors"),
    histLevel(3,"Looking back: in the 400s CE, Rome pulled soldiers off the Rhine frontier to fight civil wars. What most likely followed?","Germanic groups crossed the border and took over western provinces","Persia’s Achaemenid kings invaded Italy","Han China sent armies west to help Rome","Trade across the Mediterranean ended forever, and every city emptied"),
    histLevel(3,"A historian compares the Roman Republic with the Roman Empire. Which statement is accurate?","Republic: elected officials led. Empire: an emperor held real power","Both were led by two consuls elected each year","The Empire got rid of the Senate","Empire: elected officials led and the Senate ruled. Republic: one ruler held all power for life"),
    histLevel(2,"Looking back: in 218 BCE, Hannibal crossed the Alps with elephants to attack Rome. What were Rome and Carthage fighting over?","Control of the western Mediterranean","Control of the Silk Roads and the silk trade with China","Control of Athens","Control of the Nile’s pyramids"),
    histLevel(2,"Looking back: in 44 BCE, senators killed Julius Caesar. Why?","They feared he would end the Republic and rule alone","He had lost the war against Carthage","He tried to make Christianity the official religion of Rome","He wanted to give the Senate more power"),
    histLevel(3,"Augustus wrote about himself (adapted): “I gave the Republic back to the Senate and people. After that I had more influence than all, but no more power.” What should a historian notice?","He presents himself as the Republic’s protector while holding real power","He openly says that he ended the Republic and made himself the king of Rome","He wrote it to praise the Senate’s leaders","It proves Rome had no emperor"),
    histLevel(2,"Looking back: in 476 CE the last western emperor was removed. What part of Rome survived?","The Eastern Roman Empire, ruled from Constantinople","The Roman Republic","Carthage’s old empire in North Africa, Spain, and the islands","Every western province"),
    histLevel(3,"The Roman writer Tacitus has a British chief say about Rome (adapted): “They make a desert and call it peace.” What point of view does this show?","Some conquered peoples saw Roman “peace” as destruction","The Britons welcomed Roman rule, Roman soldiers, and Roman roads","Roman soldiers were paid too little","Britain was mostly desert")
  ],
  romeHan:[
    histLevel(1,"A new clerk asks which philosophy the Han emperors use to guide the government. What is it?","Confucianism","Strict Legalism","Daoism","Buddhism"),
    histLevel(1,"A merchant tells you about Rome. Which trade network connects your empire and Rome indirectly?","The routes through Central Asia (later called the Silk Roads)","The Royal Road built by the Persian kings from Sardis to Susa","The Appian Way","The Nile River"),
    histLevel(2,"The merchant says Rome has problems too. Which problem do both Rome and Han China face?","Ruling huge lands and guarding borders","Fighting each other’s armies","Paying tribute to Persia","Having far too few people in the empire to govern"),
    histLevel(2,"The merchant asks how the Han fill government jobs. What do you tell him?","With men recommended for virtue and Confucian learning","With lords who inherited their jobs and lands from their fathers","With soldiers from foreign armies","With priests chosen by temples"),
    histLevel(1,"A clerk asks what you studied at the Imperial Academy. What do you say?","The Confucian classics","Legalist books of punishment","Roman law codes","Buddhist texts from India"),
    histLevel(1,"A merchant asks which product China is most famous for sending west. What do you say?","Silk","Glass","Olive oil","Wool"),
    histLevel(1,"A clerk of the later (Eastern) Han asks which city is the capital. What do you say?","Luoyang","Rome","Babylon","Athens"),
    histLevel(2,"Rome uses legions and the Han use large armies on their borders. What does this show?","Both had to defend long frontiers","Rome and the Han fought each other often","Only the Han had to guard borders","Both empires had stopped growing"),
    histLevel(2,"A clerk asks why the Han emperor wants officials trained in the Confucian classics. What do you say?","So officials serve with loyalty and set a good example","So officials rule with strict, harsh punishments","So officials can read the Buddhist texts brought from India","So rich families can buy the best jobs"),
    histLevel(2,"Merchants tell you about Rome, but no Han official has been there. Why not?","Parthia sits between and controls trade","Rome forbids all trade with China","Han law forbids officials to leave China","The trade routes end in India"),
    histLevel(3,"A historian claims Rome and Han China traded indirectly. Which evidence best supports this?","Chinese silk worn by rich Romans","Han coins found only in Luoyang","Roman roads built in Britain","Han officials who lived in the city of Rome"),
    histLevel(3,"Roman writers complain that buying silk wastes money. Why might they say this?","Rome sent so much gold east to buy it","Silk was made in Italy","Romans thought silk was too rough and too heavy to wear","Silk was cheap and easy to find"),
    histLevel(3,"A historian compares how Rome and the Han chose officials. Which statement is accurate?","The Han valued Confucian learning in officials; Rome relied more on rank and wealth","Both let citizens vote for the officials who ran the provinces","Both gave most offices to army generals","Rome valued learning in the classics; the Han relied mostly on family rank and wealth"),
    histLevel(3,"Looking back: near their ends, the Han (fell 220 CE) and the Western Roman Empire both saw what problem?","Powerful generals and landowners weakening the central government","Conquest by Alexander the Great","A switch to democracy","The rise of Islam inside their borders and a new faith at the court"),
    histLevel(3,"The Han history Hou Hanshu describes Daqin (Rome) as a land of honest people whose kings are chosen for merit. Why should a historian be careful?","Its writers never saw Rome and relied on travelers’ stories","It was written by Roman emperors","It was written in Latin","It describes only Luoyang, the Han capital, and its markets"),
    histLevel(2,"In 97 CE a Han officer named Gan Ying traveled west to reach Rome but turned back at a great sea. What does this show?","Han and Rome knew of each other but had little direct contact","Han armies had conquered Rome","Romans often visited the Han capital to trade and to study the classics","The Han had no interest in the west"),
    histLevel(3,"The Roman writer Pliny complained (adapted) that India, China, and Arabia take 100 million coins from Rome each year for luxuries. What does this best show?","Rome’s demand for eastern luxuries like silk was large","Rome sold far more goods to China than it ever bought from it","Silk was cheap in Rome","Romans traded directly with Han officials")
  ],
  womenAncient:[
    histLevel(1,"A student asks what Confucian ideas say about women’s roles in Han China. Women’s roles were often focused on:","The family and household hierarchy","Voting in the assemblies of the cities","Leading the army into battle","Serving as officials in the provinces"),
    histLevel(2,"A traveler from Rome describes the lives of rich Roman women. What could elite Roman women often do?","Own property, but not vote or hold office","Vote in elections and hold any office they wanted","Lead the legions as generals","Serve in the Senate as members"),
    histLevel(1,"Your student asks why you would compare women’s lives in Rome and Han China. What do you say?","To see how each society shaped their lives","To prove that women everywhere lived the same way","To show that women had no influence","To ignore differences of rich and poor"),
    histLevel(3,"You learn that rich Roman women could own land and run businesses, while poor farm women in Rome and Han China worked long hours with little say. Which statement is best supported?","Women’s lives differed by society and class","Women in each land lived the same life","Women had little influence in any ancient society","Class made little difference to women"),
    histLevel(1,"A student asks what famous history you finished for your brother. What do you say?","The history of the Han dynasty","A history of the Roman Empire in the west","A book of Buddhist teachings","The laws of the Qin dynasty"),
    histLevel(1,"A student asks what your book Lessons for Women teaches. What do you say?","How women should behave in the family","How women can lead the emperor’s armies in war","How women can become officials","How women can rule the empire"),
    histLevel(1,"A visitor asks if girls in Han China usually go to school. What is true?","Few girls got an education","Girls went to state schools","Girls studied at the Imperial Academy","Girls learned mainly from Buddhist monks"),
    histLevel(2,"You are an educated woman who advises the empress. What does this show?","Some elite women gained influence","Most women held government jobs","Women could not read or write","Men were the ones who advised rulers"),
    histLevel(2,"A Roman visitor says wealthy Roman women can own businesses. What does this show?","Some Roman women had economic power","No Roman woman could ever own any property","Roman women ruled the Senate","Every Roman woman was rich"),
    histLevel(2,"A student asks how a poor farm woman’s life differs from an empress’s. What do you say?","She works the fields and has little power","She gives orders to palace officials and servants","She is free from family duties","She studies the classics at court"),
    histLevel(3,"A historian claims elite Han women could gain influence. Which evidence best supports this?","Records of empresses guiding young emperors","Farm tools found in a village house","A law banning women from the exams","A painting of a soldier riding a horse into battle"),
    histLevel(3,"Your Lessons for Women was written by an elite woman. What is a limit of it as a source?","It may not show the lives of poor women","It was written by a Roman man","It says nothing about women at all","It was written a thousand years after the Han"),
    histLevel(3,"A historian compares women in Rome and Han China. Which statement is accurate?","In both, men held power but some women had influence","Han women could own land and run shops; Roman women never could","Roman women voted, but Han women could not","Han women ruled, but Roman women could not"),
    histLevel(3,"Under Confucian family rules, what would most likely happen to a Han widow with no sons?","She would depend on her husband’s family","She would inherit and run all the family land","She would be free to marry anyone she chose","She would serve as an official"),
    histLevel(2,"Babatha, a Jewish woman in Rome’s province of Arabia around 120 CE, left legal papers found in a cave. What do they show?","Some women in Roman lands owned property and went to court","Women in Roman lands often served as judges in the provincial courts","No woman in Roman lands could own land","Babatha governed the province"),
    histLevel(3,"Why are Babatha’s papers especially useful to historians?","They show a real woman’s legal affairs, not a male writer’s opinion","She was a Roman empress","They were written by Ban Zhao about her own family and life in Luoyang","They describe life in Han China"),
    histLevel(3,"In Lessons for Women you write (adapted): “Let a woman be humble and yielding. Yet girls, like boys, should be taught to read.” What does this show about your views?","You accepted women’s lower place but wanted girls educated","You wanted women to rule the empire","You thought girls should not be taught to read or write at all","You were writing about Roman women"),
    histLevel(2,"In Rome, the oldest man of a family, the paterfamilias, had legal power over his household. How is this like Han China?","Both gave fathers great power over family members","Both let women head most families","Both let children choose their own marriages without asking anyone","Both made the emperor head of each family")
  ]
};
const HISTORY_UNIT5 = [   // Khan's practice exercises, in order (checked on khanacademy.org, Oct 27 2026)
  {id:'collapseEmpires',name:"Why Do Empires Collapse?",lesson:"Empires fall from a mix of internal causes (corruption, civil war, heavy taxes, weak rulers) and external causes (invasions and raids). Rome in the West and the Han in China both fell this way."},
  {id:'byzantine',name:"The Byzantine Empire",lesson:"The Eastern Roman (Byzantine) Empire lasted until 1453. It kept Roman law and emperors but was Christian and Greek-speaking, ruled from Constantinople; Justinian and Theodora are famous rulers."},
  {id:'darkAges',name:"Assessing the Dark Ages",lesson:"Some writers called the centuries after Rome a “dark age.” Towns and trade shrank in the West, but monks, Charlemagne, Byzantium, and the Islamic world kept learning alive, so many historians question the label."},
  {id:'serfdom',name:"Serfdom in Europe",lesson:"Under feudalism and the manor system, serfs farmed a lord’s land and owed him labor and crops; in return the lord gave protection and land. Serfs could not leave without permission."},
  {id:'peasantRevolts',name:"Peasant Revolts in Europe",lesson:"After the Black Death made workers scarce, peasants pushed back against low wages, taxes, and serfdom, as in the Jacquerie (1358) and the English Peasants’ Revolt (1381)."},
  {id:'europeChina',name:"Systems Restructure in Europe and China",lesson:"After collapse, Western Europe split into kingdoms tied together by the Church and feudalism, while China was reunited by the Sui and Tang, with an emperor and officials chosen by exams."},
  {id:'islamicWorld',name:"The Islamic World",lesson:"The caliphates (Umayyad, Abbasid, Fatimid) ruled a huge Dar al-Islam linked by faith, Arabic, and trade. Sunni and Shia Muslims split over leadership, and the Crusades brought conflict and exchange."},
  {id:'islamGoldenAge',name:"The Golden Age of Islam",lesson:"In Abbasid Baghdad, scholars at the House of Wisdom translated Greek, Persian, and Indian works and made advances in algebra, medicine, and astronomy."},
  {id:'silkRoad',name:"The Silk Road",lesson:"The Silk Roads were many land routes linking China, Central Asia, Persia, and the Mediterranean. Merchants like the Sogdians passed goods, religions, ideas, and diseases along them."},
  {id:'expandingRoutes',name:"Expanding the Silk Routes",lesson:"Trade grew by sea across the Indian Ocean with the monsoon winds, and across the Sahara with camels carrying gold and salt. Travelers like Ibn Battuta and Zheng He crossed these networks."},
  {id:'songChina',name:"Song China",lesson:"Song China grew rich with fast-ripening rice, paper money, printing, the compass, and sea trade. Officials were chosen by exams, and neighbors like Japan borrowed Chinese ideas."}
];
/* Khan's lessons 5.1 to 5.8, each its own block with its videos, and Khan's two quizzes: Quiz 1 after 5.3, Quiz 2 after 5.6;
   the unit test comes after 5.8 (docs/HISTORY-UNIT5.md). */
const HISTORY_GROUPS5 = [
  {id:'overview5',name:'Collapse and Restructuring | 5.1',noQuiz:true,skills:[],learn:'How have societies restructured after empires collapse? After Rome and the Han fell, people built new governments, faiths spread, and trade webs connected regions more than ever.'},
  {id:'collapse5',name:'Why Do Empires Collapse? | 5.2',noQuiz:true,skills:['collapseEmpires','byzantine'],learn:'Empires collapse from internal causes (corruption, civil war, taxes) and external causes (invasions). Rome fell in the West in 476, but the Byzantine Empire in the East lasted until 1453.'},
  {id:'darkAges5',name:'Assessing the Dark Ages | 5.3',quizName:'Quiz 1',quizSkills:['collapseEmpires','byzantine','darkAges'],skills:['darkAges'],learn:'Did Europe go through a dark age after Rome fell? Weigh the evidence: shrinking towns, but also monks, Charlemagne, and thriving Byzantium and Baghdad.'},
  {id:'europe5',name:'Systems Restructure in Europe | 5.4',noQuiz:true,skills:['serfdom','peasantRevolts'],learn:'Europe restructured around the Church, feudalism, and manors with serfs. Later, the Black Death and peasant revolts shook that system.'},
  {id:'china5',name:'Systems Restructure in China | 5.5',noQuiz:true,skills:['europeChina'],learn:'China was reunited under the Sui and Tang, with an emperor, officials chosen by exams, and later Neo-Confucian ideas.'},
  {id:'islam5',name:'The Islamic World | 5.6',quizName:'Quiz 2',quizSkills:['serfdom','peasantRevolts','europeChina','islamicWorld','islamGoldenAge'],skills:['islamicWorld','islamGoldenAge'],learn:'The caliphates ruled a vast Dar al-Islam linked by faith, Arabic, and trade, and Baghdad became a center of learning.'},
  {id:'silk5',name:'The Silk Roads | 5.7',noQuiz:true,skills:['silkRoad'],learn:'The Silk Roads were many routes. Merchants passed goods, faiths, ideas, and diseases from China to the Mediterranean.'},
  {id:'expand5',name:'Expanding the Silk Roads | 5.8',noQuiz:true,skills:['expandingRoutes','songChina'],learn:'Trade expanded across the Indian Ocean and the Sahara, and Song China grew rich from new crops, inventions, and trade.'}
];
/* History Unit 5 bank (Oct 27, 2026; docs/HISTORY-UNIT5.md): role play, plausible wrong answers, adapted sources in every lesson. */
const HISTORY5_QUESTIONS = {
  collapseEmpires:[
    histLevel(1,"A neighbor asks what historians call causes of collapse that come from inside an empire, like corruption or civil war. What do you say?","Internal causes","External causes","Natural causes","Foreign causes from beyond the borders"),
    histLevel(1,"Which is an external cause of an empire’s collapse?","Invasions by groups from beyond the borders","Officials taking bribes","Rival generals fighting each other for the emperor’s throne","Rising taxes on farmers"),
    histLevel(2,"Looking back: the Han dynasty fell in 220 CE. Which problems helped bring it down?","Weak emperors, power struggles at court, and the Yellow Turban Rebellion","An invasion by Roman legions that marched across Central Asia from the west","A war with Alexander’s generals","The arrival of Islam in China"),
    histLevel(2,"Germanic groups like the Goths settle inside the empire and later fight Rome. What kind of cause is this?","External pressure on the borders","A disease","Internal corruption","A change in the empire’s official religion"),
    histLevel(1,"In 476 CE, a Germanic general removed the last emperor in the West. Who was that emperor?","Romulus Augustulus","Augustus","Julius Caesar","Constantine the Great"),
    histLevel(2,"A traveler asks why the Roman Empire in the East is still standing. What do you say?","It is richer and easier to defend, with Constantinople’s walls","The eastern provinces have no borders that enemies can reach by land","Its emperors moved the army to Britain","The Goths promised to stay in the West"),
    histLevel(3,"A Roman priest named Salvian wrote (about 440 CE, adapted): “Poor farmers flee to the Goths, because they cannot bear Rome’s tax collectors.” What cause of collapse does this point to?","Heavy taxes turned people against the empire","Disease killed most of the farmers","The Goths refused to let anyone settle with them","Farmers wanted to move to Constantinople"),
    histLevel(3,"Salvian was a Christian priest who blamed Rome’s troubles on Romans’ own sins. How might this shape his account?","He may stress Roman wrongdoing to make a moral point","He may praise the tax collectors to please the emperor","He could not have known anything about taxes","He wrote it to describe life in Han China"),
    histLevel(3,"Historians say Rome and the Han both fell from many causes, not one. Which pair best shows this?","Rebellions and weak rulers inside; invasions and raids from outside","Plague in Rome, and floods in Han China, with no other troubles","Rome fell when Persia conquered it; the Han fell when Rome conquered it","Both fell when Islam spread into their lands"),
    histLevel(2,"As Rome weakens, many city families like yours move to country estates for safety. What is changing?","Trade and town life are shrinking in much of the West","Cities are growing larger than ever before","Farmers have stopped growing food","The Senate is moving from Rome to Gaul to be safer from the Goths"),
    histLevel(2,"A traveler asks what the Huns did to the peoples north of Rome. What do you say?","Their attacks pushed groups like the Goths into Roman lands","They became Roman citizens, and their leaders sat in the Senate","They built roads and forts for the Roman army","They traded silk with the Goths"),
    histLevel(3,"Which evidence best supports the claim that civil wars weakened Rome?","In the 200s CE, dozens of emperors ruled, and most were killed","Roman roads still reached Britain","Christianity spread to many cities and towns across the empire","Rome traded with Han China for silk"),
    histLevel(2,"Looking back: after 476, the Western Empire was gone, but Latin, Roman law, and the Church lived on. What does this show?","Some things continued even after the empire collapsed","Nothing Roman survived the collapse in the West","The Western Empire was rebuilt right away by a new emperor","Latin was replaced by Greek across the West"),
    histLevel(1,"Which city was the capital of the Roman Empire in the East?","Constantinople","Ravenna","Carthage","Antioch"),
    histLevel(2,"Looking back: what does “restructuring” mean after an empire collapses?","People build new kinds of governments and ways of life","Everyone goes back to hunting and gathering","The old empire is rebuilt exactly as it was, with the same rulers","People stop farming and trading")
  ],
  byzantine:[
    histLevel(1,"A visitor asks which city you and Justinian rule from. What do you say?","Constantinople","Rome","Ravenna","Alexandria"),
    histLevel(1,"A scholar asks what language most people in your empire speak at home. What do you say?","Greek","Latin","Arabic","Persian"),
    histLevel(2,"Justinian ordered scholars to collect and organize centuries of Roman laws. What is this work called?","Justinian’s Code","The Twelve Tables","The Quran","The Magna Carta"),
    histLevel(2,"A visitor marvels at the huge domed church you and Justinian built. What is it called?","Hagia Sophia","The Parthenon","The Colosseum","St. Peter’s Basilica"),
    histLevel(2,"During the Nika riot of 532, Justinian wanted to flee the city. What did you advise?","To stay and fight for the throne","To flee to Rome and rule from there","To give the throne to the rioters’ leader","To let the Senate choose a new emperor"),
    histLevel(3,"The historian Procopius wrote that you said (adapted): “Royalty is a good burial cloth.” What did you mean?","It is better to die as empress than to run away","Emperors should be buried in purple cloth","You planned to give up the throne and leave the city by ship","Royal clothes should be sold to pay the army"),
    histLevel(3,"Procopius praised Justinian in one book but attacked him and you in a secret history. What should historians conclude?","His accounts must be checked against other sources","His book of praise can be trusted completely","Neither book tells us anything useful","He must have been writing about two different emperors and empresses"),
    histLevel(2,"How was your Byzantine Empire like the old Roman Empire?","It kept Roman law, roads, and the title of emperor","It kept Latin as everyone’s daily language","It kept the old Roman gods as the official religion of the empire","It kept Rome itself as its capital"),
    histLevel(2,"How was your Byzantine Empire different from the old Roman Empire?","It was Christian and mostly Greek-speaking","It had no emperor and no army","It was ruled from the city of Rome","It followed the religion of the Persian kings it fought"),
    histLevel(3,"Justinian’s generals retook Italy and North Africa. What happened soon after?","Costly wars and a terrible plague left the empire weaker","Rome became the capital of the empire again","Persia handed over all of its land","The empire went on to hold Britain and Gaul for centuries"),
    histLevel(2,"Looking back: the Byzantine Church grew into which church, led by the patriarch in Constantinople?","The Eastern Orthodox Church","The Roman Catholic Church","The Church of England","The Church of the East in China"),
    histLevel(3,"Looking back: the Byzantine Empire lasted until 1453. Which best explains its long survival?","Strong walls, a rich trading capital, and skilled diplomacy","It fought no wars at all after 476","Its emperors ruled from faraway Rome","The Abbasid caliphs protected it from its enemies in the north"),
    histLevel(2,"A merchant asks why Constantinople is so rich. What do you say?","It sits on trade routes between Europe and Asia","It has the largest gold and silver mines in the whole world","Its rulers have banned trade with Asia","It is the one city in Europe with farmland"),
    histLevel(3,"Looking back: envoys from the Rus visited Hagia Sophia in 987 and said (adapted): “We knew not whether we were in heaven or on earth.” What does this suggest?","Byzantine faith and art impressed its neighbors","The envoys were lost inside the city","Hagia Sophia was built in Kiev","The Rus had no buildings of their own and had never seen stone"),
    histLevel(1,"What title did Byzantine rulers like Justinian use?","Emperor","Pharaoh","Caliph","Shogun")
  ],
  darkAges:[
    histLevel(1,"A visitor asks what you do all day in the monastery. What do you say?","Pray, work, and copy books by hand","Train soldiers for the king","Collect taxes from farmers for the emperor in Rome","Trade silk with merchants from China"),
    histLevel(2,"Why are monasteries like yours important to historians?","Monks copied and saved old texts that might have been lost","Monks wrote the first books in human history","Monasteries were where every king in Europe was crowned and buried","Monks invented the printing press"),
    histLevel(2,"Looking back: the writer Petrarch (1300s) called the centuries after Rome a time of “darkness.” Why might he say that?","He admired ancient Rome and saw later times as a decline","He lived through those centuries himself and saw the darkness firsthand","No one wrote anything at all for 500 years","Smoke from fires hid the sun for centuries"),
    histLevel(3,"Which evidence challenges the idea of a “Dark Age” in Europe?","Charlemagne’s schools and books like the Book of Kells","Fewer people lived in the old Roman cities than in Roman times","Trade along the old Roman roads shrank","Germanic kingdoms often fought one another"),
    histLevel(3,"Which evidence supports the idea that Western Europe declined after Rome fell?","Cities shrank, and trade and stone building fell off","Monks copied books like the Book of Kells","Baghdad’s House of Wisdom translated Greek books into Arabic","Charlemagne set up schools at his court"),
    histLevel(2,"While Western Europe struggled, which places were thriving?","The Byzantine Empire, the caliphates, and Tang China","Rome, Carthage, and Athens under the Caesars","The Mongol and Ming empires, which began in those years","The Aztec and Inca empires of the Americas"),
    histLevel(3,"Why do many historians today avoid the term “Dark Ages”?","It ignores real achievements and judges a whole era unfairly","Historians agree that nothing important happened in those centuries","Charlemagne himself invented the term to describe his own time","The period lasted about ten years, too short to name"),
    histLevel(1,"Who was crowned emperor by the pope in 800 CE and supported learning?","Charlemagne","Justinian","Constantine","Augustus"),
    histLevel(2,"A traveler asks what the Book of Kells is. What do you say?","A beautifully decorated copy of the Gospels","A law code written for Justinian in Constantinople","A Viking map of the North Sea","A list of taxes owed to the king"),
    histLevel(3,"Einhard, Charlemagne’s friend, wrote (adapted): “He tried to learn to write, keeping tablets under his pillow, but he began too late.” What does this suggest?","Charlemagne valued learning even though he struggled with it","Charlemagne could not speak or understand any written language","Einhard disliked Charlemagne","Writing had not been invented yet"),
    histLevel(2,"Einhard was Charlemagne’s friend and courtier. How might that shape his biography?","He may show Charlemagne in a mostly positive light","He could not have known Charlemagne well","He wrote it to make Charlemagne look foolish","He wrote it many centuries after Charlemagne had died"),
    histLevel(1,"What do historians call the period between ancient times and the Renaissance in Europe?","The Middle Ages","The Stone Age","The Bronze Age","The Industrial Age"),
    histLevel(2,"Viking raiders attack monasteries like yours. Why do they choose them?","Monasteries hold gold and silver with few guards","Monks pay the Vikings to visit","Monasteries are built far from any river or sea, so raids are easy","Vikings want to copy books"),
    histLevel(3,"A historian says, “Whether it was a dark age depends on where you look.” Which example supports this?","Western towns shrank while Baghdad and Constantinople thrived","Every region of the world declined at the same time","Europe was the richest region of the world in 700","Baghdad and Constantinople were left empty and ruined around 700")
  ],
  serfdom:[
    histLevel(1,"A visitor asks what a serf is. What do you say?","A farmer bound to a lord’s land","A knight who fights for the king","A merchant who travels between towns","A monk who copies books"),
    histLevel(1,"A traveler asks who owns the land you farm. What do you say?","The lord of the manor","You and your family","The merchants in town","The emperor in Constantinople"),
    histLevel(2,"A visitor asks what you owe your lord. What do you say?","Work on his fields and a share of my crops","A yearly payment of Chinese silk","Service as a knight in battle whenever the king calls","Nothing, since I am free to leave"),
    histLevel(2,"What does your lord give you in return?","Protection and strips of land to farm","A salary paid in gold coins","Freedom to move to any town","A seat on the king’s council in Paris"),
    histLevel(2,"A merchant asks if you can leave the manor to work in a town. What do you say?","Not without the lord’s permission","Yes, whenever I want to","Yes, once my crops are sold","Only after serving the king as a knight"),
    histLevel(3,"In feudalism, a lord gave land to a knight. What did the knight owe in return?","Loyalty and military service","Rent paid in silk","Work on the serfs’ fields at harvest time","Taxes paid to the pope"),
    histLevel(2,"Looking back: why did serfdom spread in Europe after Rome’s collapse?","Weak governments led farmers to trade freedom for safety","Kings forced the merchants to become farmers","The Church banned ordinary people from owning any land at all","Serfs chose it to avoid paying any taxes"),
    histLevel(3,"A typical manor rule (adapted): “The serf must plow the lord’s field three days a week, give him a hen at Christmas, and grind grain at the lord’s mill for a fee.” What does it show?","Serfs owed labor, goods, and fees to their lord","Serfs were paid wages for their work","Serfs owned the mill and charged the lord","Serfs worked on their own land and owed nothing"),
    histLevel(3,"What is one limit of manor records as sources about serfs’ lives?","Lords’ clerks wrote them, so serfs’ own views are missing","They were written in Chinese characters that no one in Europe could read","They describe the lord’s horses but leave out the farm work","Serfs wrote them in their own words at the end of each year"),
    histLevel(2,"How was a serf different from an enslaved person?","A serf was tied to the land, not sold apart from it","A serf could be sold on his own at any market in any town","A serf owned the manor and its fields","A serf was free to move anywhere at any time"),
    histLevel(1,"What is a manor?","A lord’s estate with fields, a village, and often a church","A walled city ruled by merchants","A school where monks taught the sons of knights to read and write","A market where knights bought horses"),
    histLevel(3,"Looking back: the Black Death (1347 to 1351) killed about a third of Europe’s people. How did it affect serfs who survived?","Workers were scarce, so many could demand better pay and terms","Lords freed their serfs that same year out of kindness","Serfs had to work twice as long for the lords, with no pay at all","Farms were abandoned, and no one farmed for a generation"),
    histLevel(1,"In a feudal kingdom, who stood at the top?","The king","The serfs","The knights","The merchants"),
    histLevel(2,"Your lord holds a court on the manor. What does it do?","It settles disputes and fines people who break manor rules","It elects the king of France","It translates Greek and Arabic books into Latin for the lord","It sets prices for silk from China")
  ],
  peasantRevolts:[
    histLevel(1,"A neighbor asks why you are marching to London. What do you say?","To protest unfair taxes and the rules of serfdom","To crown a new pope","To join a crusade to Jerusalem","To sell our wool to the merchants from Flanders at the London fair"),
    histLevel(2,"Which tax made many English peasants angry in 1381?","A poll tax charged on each adult","A tax on silk from China","A tax paid by serving as knights","A tax on candles in the churches"),
    histLevel(3,"The preacher John Ball asked (adapted): “When Adam dug and Eve spun, who was then the gentleman?” What did he mean?","At the beginning, there were no lords; people were equal","Lords have always ruled since Adam","People should spin more cloth to pay the king’s new taxes","Gentlemen should farm their own fields"),
    histLevel(1,"Who led the rebels to meet the young King Richard II?","Wat Tyler","Charlemagne","Joan of Arc","William the Conqueror"),
    histLevel(2,"Looking back: how did the revolt of 1381 end?","Wat Tyler was killed, and the king broke his promises","The peasants took over England","Serfdom ended that same year","The king gave up his throne and handed the crown to the rebels"),
    histLevel(3,"Why did peasants feel stronger after the Black Death?","So many had died that their work was worth more","Lords had given them weapons","The plague had killed most of the lords and their knights","Kings had promised to give each peasant land of their own"),
    histLevel(3,"Looking back: which evidence shows the revolt still changed things over time?","Serfdom faded in England during the next century","The poll tax was raised again and again in the years that followed","Wat Tyler became king of England","No one in England paid taxes after 1381"),
    histLevel(2,"In France in 1358, peasants rose up against nobles. What is that revolt called?","The Jacquerie","The Crusades","The Reconquista","The Nika riot"),
    histLevel(3,"A chronicler on the lords’ side called the rebels “wild beasts.” Why should a historian be careful?","He took the lords’ side and may exaggerate","He was one of the rebel leaders marching beside Wat Tyler","He wrote in French","He never mentioned the rebels"),
    histLevel(1,"What is a revolt?","An uprising against those in power","A trade fair in a town","A tax paid to a lord","A ceremony held in a church to crown a new king"),
    histLevel(2,"What did the rebels ask King Richard II for?","An end to serfdom and fair rents for land","A new crusade to Jerusalem","More taxes to pay for the long war against France","Silk and spices from Asia"),
    histLevel(3,"How were the English revolt of 1381 and the Yellow Turban revolt in Han China alike?","Both were uprisings by farmers in hard times","Both were led by kings against their own nobles","Both happened in the same year","Both ended serfdom at once"),
    histLevel(2,"After the Black Death, lords passed laws to keep wages low. Why?","They wanted workers to keep working for the old pay","They wanted to pay workers more","They wanted serfs to move to the towns","They wanted to end farming on the manors and raise sheep instead"),
    histLevel(2,"Looking back: why do historians call 1381 a “revolt” and not just a riot?","Thousands joined with shared demands to change how they were ruled","It happened in one village street for one afternoon and then stopped","It was led by the king","It was about a sports game")
  ],
  europeChina:[
    histLevel(1,"A visitor asks which dynasty you serve. What do you say?","The Tang","The Han","The Qin","The Ming"),
    histLevel(2,"How are many officials like you chosen under the Tang?","By exams on the Confucian classics","Each lord picks his own sons","Officials buy their posts from the emperor","Priests choose them in the temples"),
    histLevel(2,"A merchant asks what the Grand Canal is for. What do you say?","Carrying rice and goods between south and north","Bringing water to the Gobi Desert","Defending the empire from the Xiongnu raiders in the north","Linking China to the Indian Ocean"),
    histLevel(2,"Looking back: in Western Europe after Rome fell, what group held authority across many kingdoms?","The Roman Catholic Church","The Senate of Rome","The Byzantine army","The guilds of merchants in the towns"),
    histLevel(3,"Looking back: after collapse, how did China and Western Europe restructure differently?","China rebuilt a strong central state; Europe split into many kingdoms","Europe rebuilt a strong central state; China split into many kingdoms","Both were united again under one emperor","Neither had kings or emperors again"),
    histLevel(2,"Looking back: what was Neo-Confucianism?","Confucian ideas mixed with some Buddhist and Daoist ideas","A new religion that came to China from India","Legalist laws made even harsher than the Qin dynasty’s laws","A Christian teaching from Europe"),
    histLevel(2,"Looking back: who was a leading Neo-Confucian thinker in Song China?","Zhu Xi","Laozi","Confucius","Han Feizi"),
    histLevel(3,"A Ming emperor’s edict (adapted) warned that officials who take bribes or harm the people will be punished severely. What does this suggest?","Emperors worried about corrupt officials","Officials were paid in silk","The people chose their own officials by voting each year","Bribes were legal in Ming China"),
    histLevel(2,"Du Huan, a Tang soldier, was captured at the Battle of Talas in 751 and traveled through Abbasid lands. What does his story show?","Tang China and the Islamic world were in contact","China conquered the Abbasid caliphate and ruled Baghdad","The Tang had never heard of Islam","Talas was a city in Western Europe"),
    histLevel(1,"Looking back: which dynasty ruled China after the Mongols, starting in 1368?","The Ming","The Tang","The Han","The Qin"),
    histLevel(3,"Which evidence best supports the claim that Tang China was open to foreign ideas?","Foreign merchants, Buddhist temples, and Persian goods in Chang’an","The Great Wall was repaired along the northern border by soldiers and farmers","Officials studied the same Confucian classics as in Han times","The Grand Canal carried rice north"),
    histLevel(2,"Looking back: in medieval Europe, who crowned emperors and could excommunicate kings?","The pope","The patriarch of the Orthodox Church","The caliph","The guild master"),
    histLevel(3,"From Han to Tang, what stayed the same in how China was ruled?","An emperor ruling through Confucian-educated officials","Powerful lords ruling their own lands with no emperor over them","A Senate that elected the emperor","Rule by Buddhist monks"),
    histLevel(2,"Looking back: in Europe, a lord’s promise to protect his vassals in return for loyalty was part of what system?","Feudalism","The civil service exams","The Mandate of Heaven","The caliphate")
  ],
  islamicWorld:[
    histLevel(1,"A traveler asks what “Dar al-Islam” means. What do you say?","The lands where Islam and Muslim rule were established","A mosque in Mecca","A book of Islamic law used by judges in Baghdad and Cairo","A tax paid by merchants"),
    histLevel(1,"A traveler asks what a caliph is. What do you say?","A ruler who leads the Muslim community","A judge in a village court","A teacher of the Quran in a school for young children","A merchant who leads a caravan"),
    histLevel(2,"Which family of caliphs built Baghdad as their capital?","The Abbasids","The Umayyads","The Fatimids","The Ottomans"),
    histLevel(2,"Looking back: the Umayyad caliphs ruled from which city?","Damascus","Baghdad","Cairo","Mecca"),
    histLevel(2,"Sunni and Shia Muslims first split over what question?","Who should lead the community after Muhammad","Whether to pray toward Mecca or toward Jerusalem each day","Whether to fast during Ramadan","Whether to trade with Christians"),
    histLevel(3,"Shia Muslims believed leadership should pass through which line?","Muhammad’s family, through his cousin Ali","The Byzantine emperors","Merchants of Mecca chosen by an elected council","The Persian kings of old"),
    histLevel(2,"Why can a merchant like you travel from Spain to India and feel at home?","Shared faith, Arabic, and Islamic law link these lands","One caliph rules every one of these lands directly from Baghdad","Everyone in these lands speaks Persian","The roads are owned by Christian kings"),
    histLevel(2,"Looking back: the Crusades began in 1096. What were they?","Wars by European Christians to take Jerusalem","Trade fairs held in Cairo for merchants from Europe and Asia","Muslim pilgrimages to Rome","Mongol invasions of Europe"),
    histLevel(3,"Which was one consequence of the Crusades?","More trade and exchange of goods and ideas with Europe","Jerusalem stayed under European rule for the next thousand years","Islam disappeared from Southwest Asia","Europe stopped trading with Muslim lands"),
    histLevel(3,"Usama ibn Munqidh (1100s, adapted) wrote that some Franks who had lived long in the East became more like local people. What does this suggest?","People of different cultures living together changed each other","Franks kept their old ways no matter how long they stayed in the East","Usama had never met any Franks","Local people gave up their customs and became Franks"),
    histLevel(3,"Under Muslim rule, Jews and Christians could keep their faith by paying a special tax. What was it called?","Jizya","Zakat","Hajj","Tithe"),
    histLevel(2,"Islam spread across North Africa, Persia, and Spain. What helped it keep spreading after the conquests?","Trade, preaching, and the benefits of joining Muslim society","Forcing each person in a conquered city to convert on the spot","Roman roads built for Muslim armies","Orders from the Byzantine emperor"),
    histLevel(3,"Which statement about the caliphates around 1000 CE is accurate?","Rival caliphs ruled in Baghdad, Cairo, and Córdoba","One caliph ruled every Muslim land from Baghdad until 1500","The caliphs ruled from Rome","There were no caliphs after Muhammad"),
    histLevel(2,"Looking back: Saladin retook Jerusalem in 1187. Who was he?","A Muslim sultan who united Egypt and Syria","A Byzantine emperor","A Mongol khan","A crusader king from France who ruled the city")
  ],
  islamGoldenAge:[
    histLevel(1,"A visitor asks where you work. What is the House of Wisdom?","A library and center of learning in Baghdad","A palace where the caliph lives","A mosque in the holy city of Mecca for pilgrims","A market for silk and spices"),
    histLevel(2,"What do you and other scholars do with old Greek, Persian, and Indian books?","Translate them into Arabic and add new ideas","Burn them to make room for new books","Sell them to merchants from Europe","Hide them away so that no one else can ever read them"),
    histLevel(2,"Your fellow scholar al-Khwarizmi is famous for what?","Writing about algebra","Building the Grand Canal","Writing the Quran","Leading the first Crusade"),
    histLevel(2,"Scholars in Baghdad spread a number system that came from India. What do we call those numerals today?","Arabic numerals (0 to 9)","Roman numerals","Greek letters","Chinese characters (one for each number)"),
    histLevel(2,"Looking back: Ibn Sina wrote The Canon of Medicine. How was it used?","Doctors in Muslim lands and Europe studied it for centuries","It was banned in the lands where people first tried to read it","It was a book of poems about war","It was read by caliphs but kept from doctors"),
    histLevel(3,"Which best explains why Baghdad became a center of learning?","Caliphs paid scholars, and trade brought books and paper","It was the only city in the world that had any library at all","Greek philosophers moved there in 400 BCE","Scholars were forced to live there"),
    histLevel(2,"Paper making spread to Baghdad around 800. Where did it come from?","China","Egypt","Greece","Rome"),
    histLevel(3,"The scholar al-Kindi wrote (adapted): “We should not be ashamed to take truth from wherever it comes, even from distant peoples.” What attitude does this show?","Openness to learning from other cultures","Distrust of foreign ideas from Greece and India","A wish to keep knowledge secret","Interest in Arabic poetry rather than science"),
    histLevel(3,"How did the Golden Age of Islam affect Europe later?","Arabic books helped bring Greek learning back","Europe banned Arabic books and refused to read them","It ended trade between Europe and Asia","It ended the trade between Europe and Asia for good"),
    histLevel(1,"Which city was the Abbasid capital and home of the House of Wisdom?","Baghdad","Damascus","Mecca","Cairo"),
    histLevel(2,"Astronomers in the Islamic world improved which tool for finding stars and directions?","The astrolabe","The telescope","The printing press","The steam engine"),
    histLevel(3,"Looking back: the Mongols sacked Baghdad in 1258. What happened to its libraries?","Many were destroyed, and countless books were lost","They were moved safely to Rome before the Mongols arrived","The Mongols added to them","Nothing happened to the city"),
    histLevel(2,"Why did a shared language help scholars across the Islamic world?","Scholars from many lands could read the same books","Each scholar was born and trained in Baghdad itself","Arabic had no written form","The caliph banned scholars from using other languages"),
    histLevel(3,"How was Baghdad’s House of Wisdom like the old library at Alexandria?","Both gathered knowledge from many cultures in one place","Both were built by Alexander the Great and his generals","Both were destroyed by the Romans","Both kept books only in Latin")
  ],
  silkRoad:[
    histLevel(1,"A visitor asks what goods you carry west from China. What do you say?","Silk, paper, and fine pottery","Wool, olive oil, and wine","Gold and salt from Africa","Furs and timber from the forests of Russia"),
    histLevel(1,"Which animals carry your goods across the deserts and mountains?","Two-humped Bactrian camels","Elephants","Horses brought from Arabia across the sea","Llamas"),
    histLevel(2,"Do you carry goods all the way from China to Constantinople yourself?","No, goods pass from trader to trader along the way","Yes, I make the whole trip from Chang’an to the Mediterranean","Yes, but I go by sea around India instead","No, the emperor carries them himself"),
    histLevel(2,"Besides goods, what else travels along the Silk Roads?","Religions, ideas, inventions, and diseases","Silk and spices, and little else of any kind","Soldiers and their armies on their way to war","Letters carried between the kings of each land"),
    histLevel(2,"Why are oasis cities like Samarkand important?","Caravans stop there for water, rest, and trade","They are the capitals of the Roman and Persian empires","They have no markets at all","They are ports on the Indian Ocean"),
    histLevel(2,"Your people, the Sogdians, are famous for what?","Being merchants and go-betweens on the Silk Roads","Building the Great Wall of China for the Tang emperors","Founding the city of Rome","Sailing to the Americas"),
    histLevel(3,"Looking back: what helped Silk Roads trade boom again around 600 to 750?","The Tang and the caliphates kept large regions safe","The Roman Empire reunited the West","The Silk Roads were paved with stone from China to Rome","Every bandit had been caught"),
    histLevel(3,"Why do historians often say “Silk Roads” instead of “Silk Road”?","There were many routes by land and sea, not one road","It was a single paved road","Silk was the only thing traded","The road was built by one empire, so it had one name"),
    histLevel(3,"Looking back: the Black Death reached Europe in 1347. How do historians think it spread?","Along trade routes, with traders and fleas on rats","Through letters sent by kings","From a volcano in Europe","It began in Europe and was carried east by crusaders"),
    histLevel(3,"A Sogdian woman stuck in Dunhuang wrote (about 313 CE, adapted) that her merchant husband had left her with no money for years. What does this letter show?","Long-distance trade could split families for years","Merchants always took their families with them on every trip","Women could not write in Sogdian","Dunhuang was a city in Europe"),
    histLevel(1,"Which dynasty rules China at the eastern end of the Silk Roads in your time?","The Tang dynasty","The Han dynasty","The Roman Empire","The Maurya Empire"),
    histLevel(3,"Which evidence best supports the claim that the Silk Roads spread religions?","Buddhist caves, churches, and mosques along the routes","Chinese silk found in the graves of rich Romans and Egyptians","Roman coins found in India","Camels bred in Central Asia"),
    histLevel(2,"What is a caravanserai?","An inn where caravans stopped to rest","A ship for crossing the Indian Ocean","A tax on silk","A Buddhist temple where pilgrims slept"),
    histLevel(3,"Looking back: compared with Han times, what was new on the Silk Roads by 1000 CE?","Islam had spread along many of the routes","Silk was no longer traded","China had stopped making paper and bought it from Baghdad","Camels were no longer used")
  ],
  expandingRoutes:[
    histLevel(1,"A ship captain asks which winds sailors use to cross the Indian Ocean. What do you say?","The monsoon winds","The Atlantic trade winds","The cold north wind of Russia","Winds from the Sahara Desert"),
    histLevel(2,"Why do the monsoon winds matter so much to sailors?","They change direction by season, so ships can time trips","They blow the same way all year, so ships sail when they like","They stop ships from leaving port","They blow near China but not near Africa or Arabia"),
    histLevel(1,"Which animal makes trade across the Sahara possible?","The camel","The horse","The elephant","The ox"),
    histLevel(2,"What two goods are traded most across the Sahara?","Gold from the south and salt from the north","Silk from China and wool from England and Flanders","Spices from India and furs from Russia","Paper from China and glass from Venice"),
    histLevel(2,"Mansa Musa of Mali made a famous pilgrimage to Mecca in 1324. What happened in Cairo?","He gave away so much gold that its value fell","He conquered the city for Mali","He refused to spend any of his gold while in Egypt","He traded his gold for silk"),
    histLevel(3,"You wrote about Mali (adapted): “Its people are seldom unjust; the land is safe, and travelers need not fear robbers.” What can a historian learn from this?","Mali was well governed and safe for traders, as one visitor saw it","Mali had no ruler or laws","You never visited Mali","Mali was at war with its neighbors, and travel was dangerous there"),
    histLevel(3,"What is one limit of your travel book as a source?","You told it years later, partly from memory, to a scribe","You wrote it in Chinese","It describes only one city","It was written before you left home, from other people’s stories"),
    histLevel(2,"Which city in Mali was a famous center of trade and Islamic learning?","Timbuktu","Baghdad","Venice","Kaifeng"),
    histLevel(2,"Looking back: Zheng He led huge Chinese fleets in the early 1400s. Where did they sail?","Across the Indian Ocean to India, Arabia, and East Africa","Across the Atlantic to the Americas","Up the rivers of Russia and across to the Baltic Sea and Sweden","Around the tip of South America to the coast of Peru"),
    histLevel(3,"Looking back: why did Ming China stop Zheng He’s voyages after 1433?","They cost a lot, and the court turned to threats in the north","The fleets had found no new lands, so the emperor lost interest","Zheng He became emperor","European navies blocked the ports"),
    histLevel(2,"Medieval England sold huge amounts of which product to cloth makers in Flanders and Italy?","Wool","Silk","Porcelain","Gold"),
    histLevel(2,"What were guilds in medieval towns?","Groups of craftsmen or merchants who set trade rules","Armies paid by the king","Monasteries for monks","Courts run by lords on their manors to settle quarrels"),
    histLevel(3,"How were England’s wool trade and China’s silk trade alike?","Both made one product that tied the region to wider trade","Both used camels to cross the Sahara","Both were controlled by the caliph in Baghdad and his officials","Both ended when Rome fell"),
    histLevel(2,"How did Islam spread into West Africa?","Through Muslim traders and scholars on trans-Saharan routes","Through Roman armies","Through Viking raids","Through Chinese fleets that landed on the coast of West Africa"),
    histLevel(1,"Which ocean linked East Africa, Arabia, India, and Southeast Asia by sea?","The Indian Ocean","The Atlantic Ocean","The Arctic Ocean","The Pacific Ocean")
  ],
  songChina:[
    histLevel(1,"A visitor asks which dynasty rules China now. What do you say?","The Song","The Tang","The Han","The Ming"),
    histLevel(2,"Why are so many young men in Kaifeng studying so hard?","To pass the civil service exams","To become knights and serve the emperor in battle","To become monks in India","To sail with the navy to Africa"),
    histLevel(2,"What new kind of money helps merchants like you?","Paper money","Gold coins from Rome","Salt bars","Silk bolts only"),
    histLevel(2,"A fast-ripening rice from Champa (in Vietnam) is planted in the south. What is the result?","More harvests and a growing population","Famine across the empire","Farmers move to the cities","Rice is banned in the north to save it for the army"),
    histLevel(2,"Which Song invention helps sailors find their direction at sea?","The magnetic compass","The telescope","The astrolabe","The steam-powered engine"),
    histLevel(2,"Song printers use woodblocks and movable type. What is the result?","Books become cheaper and more people read","Fewer books are made than before, since printing is slow","The emperor alone may own printed books","Books are now written in Arabic instead of Chinese"),
    histLevel(3,"Which best explains why Song China grew rich?","More rice, new tools, busy markets, and trade by land and sea","It conquered lands as far west as the Roman Empire","It closed its ports to foreign traders to protect its farmers","It had few cities and lived mostly from farming"),
    histLevel(3,"A Song painting of Kaifeng, Along the River During the Qingming Festival, shows crowded shops, boats, and streets. What does it suggest about Song cities?","They were crowded, busy centers of trade","They were empty and poor","They had no rivers or boats","They were ruled by merchant councils, not officials"),
    histLevel(2,"Looking back: what problem did Song China face despite its wealth?","Northern invaders, like the Jurchen, who took the north in 1127","A lack of good farmland and fresh water in the south of the empire","No trade with any other land","Rebellions by Roman soldiers"),
    histLevel(2,"Nobles in Heian Japan borrowed ideas from China. What did they adopt?","Chinese writing, Buddhism, and court styles","The Roman Senate and law","Islam, the Arabic alphabet, and Persian poetry","Greek democracy"),
    histLevel(3,"Looking back: who was the shogun in Japan’s Middle Ages?","A military leader who held real power","The emperor’s chief priest","A merchant who ran the ports","A Buddhist monk who taught the samurai to read and write"),
    histLevel(3,"Looking back: how was Japanese feudalism like European feudalism?","Warriors served lords in return for land and protection","Both were run by the pope and his bishops from the city of Rome","Both had elected kings","Neither had any farmers"),
    histLevel(2,"How did the civil service exams shape who governed Song China?","Officials were chosen more for learning than for family","Officials were chosen by drawing names from a jar each year","Only soldiers could become officials","Officials were elected by merchants"),
    histLevel(1,"What famous product did Song China send abroad along the sea routes?","Porcelain","Wool","Olive oil","Furs")
  ]
};
/* ---------- History Unit 6: The First Global Age (1200 to 1750 CE), Oct 28, 2026 (docs/HISTORY-UNIT6.md) ---------- */
const HISTORY_UNIT6 = [   // Khan's practice exercises, in order (checked on khanacademy.org, Oct 28 2026)
  {id:'mongolEmpire',name:"The Silk Roads and the Mongol Empire",lesson:"Temüjin (Genghis Khan) united the Mongols in 1206, and his horse archers built the largest land empire in history. Relay stations (the yam), travel passes, and tolerance for many faiths kept the Silk Roads busy under the Pax Mongolica."},
  {id:'blackDeath',name:"The Mongol Empire and The Black Death",lesson:"The Black Death was a plague caused by bacteria spread by fleas on rats and by very sick people. It traveled along trade routes across Mongol lands and by ship from Kaffa, killing a third or more of Europe’s people from 1347 to 1351."},
  {id:'afroEurasia',name:"Cultural Exchange in Afro-Eurasia",lesson:"Trade carried goods, faiths, and inventions like gunpowder and paper across Afro-Eurasia. In Europe, trade wealth and Greek learning fed the Renaissance, and the printing press spread Martin Luther’s Reformation after 1517."},
  {id:'americasStates',name:"The Americas: Maya, Aztec, and Inca",lesson:"The Mexica (Aztec) ruled from Tenochtitlan, an island city with chinampa fields, and collected tribute from conquered peoples. The Inca ruled the Andes from Cusco, with roads, chasqui runners, quipu records, and mit’a labor."},
  {id:'americasTrade',name:"Trade Routes in the Americas",lesson:"Before 1492, people in the Americas traded over long distances without horses or oxen. Macaws and cacao reached Chaco Canyon, copper and shells reached Cahokia, and pochteca traders, canoes, and llamas carried goods."},
  {id:'empiresExpand',name:"Empires Expand",lesson:"Gunpowder helped land empires grow: the Ottomans took Constantinople in 1453, the Safavids made Persia Shia, and the Mughals ruled India. Ming and Qing China and Russia under the tsars also expanded."},
  {id:'ageExploration',name:"Age of Exploration",lesson:"European monarchs paid for voyages to reach Asian riches by sea. Columbus crossed the Atlantic in 1492, da Gama reached India in 1498, and Portugal used forts to control an Indian Ocean trade that Asian, Arab, and African merchants had long sailed."},
  {id:'columbianExchange',name:"The Columbian Exchange",lesson:"After 1492, crops, animals, and diseases crossed between the hemispheres. Maize, potatoes, and sweet potatoes fed growing populations in Afro-Eurasia, while smallpox and other diseases killed millions of Indigenous people in the Americas."},
  {id:'exploreColumbian',name:"Exploration and the Columbian Exchange",lesson:"Spanish conquistadors conquered the Mexica (1521) and the Inca (1530s), helped by disease, Indigenous allies, and steel weapons. Forced labor in mines like Potosí sent silver around the world and linked a global economy."},
  {id:'slaveTrade',name:"The Transatlantic Slave Trade",gate:true,quiet:true,lesson:"From the 1500s to the 1860s, about 12.5 million Africans were forced onto ships and taken across the Atlantic, mostly to work on sugar plantations in Brazil and the Caribbean. It tore apart families and communities in Africa, and enslaved people resisted in many ways."}
];
/* Khan's lessons 6.1 to 6.10, each its own block with its videos, and Khan's three quizzes: Quiz 1 after 6.3, Quiz 2 after 6.6,
   Quiz 3 after 6.9; 6.10 has no quiz and comes right before the unit test (docs/HISTORY-UNIT6.md). */
const HISTORY_GROUPS6 = [
  {id:'overview6',name:'The First Global Age | 6.1',noQuiz:true,skills:[],learn:'How did the first lasting connections between the hemispheres change the world? Between 1200 and 1750, land empires and ocean voyages linked Afro-Eurasia and the Americas, bringing new wealth, new foods, and terrible losses.'},
  {id:'mongol6',name:'The Mongol Empire | 6.2',noQuiz:true,skills:['mongolEmpire'],learn:'How did the Mongols build and hold the largest land empire in history? Fast horse archers conquered it, and relay stations, travel passes, and tolerance for many faiths held it together.'},
  {id:'plague6',name:'The Black Death | 6.3',quizName:'Quiz 1',quizSkills:['mongolEmpire','blackDeath'],skills:['blackDeath'],learn:'What caused the Black Death? Bacteria carried by fleas and rats traveled along busy trade routes across Mongol lands and by ship, killing a third or more of Europe’s people in a few years.'},
  {id:'exchange6',name:'Cultural Exchange in Afro-Eurasia | 6.4',noQuiz:true,skills:['afroEurasia'],learn:'How did trade connections change cultures? Goods, faiths, and inventions moved across Afro-Eurasia. Greek learning and trade wealth fed the Renaissance, and the printing press spread the Reformation.'},
  {id:'americas6',name:'Communities in the Americas | 6.5',noQuiz:true,skills:['americasStates'],learn:'How were communities organized in the Americas? The Mexica (Aztec) collected tribute from Tenochtitlan, the Inca ruled the Andes with roads and labor service, and Maya city-states and Ancestral Puebloan communities organized in their own ways.'},
  {id:'trade6',name:'Trade Routes in the Americas | 6.6',quizName:'Quiz 2',quizSkills:['afroEurasia','americasStates','americasTrade'],skills:['americasTrade'],learn:'Trade linked regions of the Americas long before 1492: macaws and cacao reached Chaco Canyon, copper and shells reached Cahokia, and porters, canoes, and llamas carried goods.'},
  {id:'empires6',name:'Empires Expand | 6.7',noQuiz:true,skills:['empiresExpand'],learn:'Land empires grew with gunpowder: the Ottomans, Safavids, and Mughals, along with Ming and Qing China and Russia, ruled huge lands with many peoples.'},
  {id:'explore6',name:'Age of Exploration | 6.8',noQuiz:true,skills:['ageExploration'],learn:'Why did European monarchs fund voyages of exploration and conquest? They wanted Asian spices and riches without middlemen. Portugal sailed around Africa to India, and Spain crossed the Atlantic.'},
  {id:'columbian6',name:'The Columbian Exchange | 6.9',quizName:'Quiz 3',quizSkills:['empiresExpand','ageExploration','columbianExchange','exploreColumbian'],skills:['columbianExchange','exploreColumbian'],learn:'What were the causes and effects of the Columbian Exchange? After 1492, plants, animals, people, and diseases crossed between the hemispheres. New crops fed growing populations, while epidemics and conquest devastated Indigenous peoples of the Americas.'},
  {id:'slavery6',name:'The Transatlantic Slave Trade | 6.10',noQuiz:true,skills:['slaveTrade'],learn:'What were the causes and effects of the Atlantic slaving system? From the 1500s to the 1860s, about 12.5 million Africans were forced onto ships to work in the Americas. They and their descendants resisted and kept their cultures alive.'}
];
/* History Unit 6 bank (Oct 28, 2026; docs/HISTORY-UNIT6.md): role play (none in 6.10), plausible wrong answers, adapted sources in every lesson. */
const HISTORY6_QUESTIONS = {
  mongolEmpire:[
    histLevel(1,"Travelers ask who united the Mongol tribes in 1206 and took the title Chinggis (Genghis) Khan. What do you say?","Temüjin","Kublai Khan","Ögedei","Timur (Tamerlane)"),
    histLevel(1,"A merchant asks what the yam is, the system you ride for. What do you say?","A chain of relay stations with fresh horses for messengers","A tax that farming villages paid in horses and grain","A wall of forts built to keep raiders out of the Mongol homeland","A school where Mongol princes learned to read"),
    histLevel(2,"A merchant shows you a paiza, a metal tablet from the khan. Why does it help him?","It shows he travels under the khan’s protection","It is a coin worth more than a bar of silver","It proves he has become a Buddhist monk","It is a map of the roads to Karakorum and beyond"),
    histLevel(2,"Why did trade on the Silk Roads grow under Mongol rule?","One empire ruled most of the routes and kept them safer","The Mongols stopped taxing goods that crossed their lands","Merchants switched from camels to wagons pulled by oxen","The Mongols closed the sea routes, so land routes were busier"),
    histLevel(2,"Historians call the long stretch of order across Mongol lands the Pax Mongolica. What does it mean?","The Mongol peace","The Mongol tax","The Mongol road","The Mongol army code"),
    histLevel(3,"The Mongols destroyed cities that resisted, yet they welcomed traders and allowed many religions. Which statement best fits this evidence?","They were brutal in conquest but practical in ruling","They were peaceful and rarely fought wars against cities","They were cruel rulers who blocked trade across Asia","They forced conquered peoples to follow one Mongol faith"),
    histLevel(3,"William of Rubruck, a friar from Flanders, visited the khan’s court at Karakorum in 1254. He wrote (adapted): “At court I met Muslims, Buddhists, and Christians, and the khan listened to each of them.” What does this show?","The Mongol court allowed many religions","The khan made Christianity the law of the empire","Karakorum was a small village with few visitors","Religious leaders were banned from the khan’s court"),
    histLevel(3,"Rubruck was a Christian friar who hoped to convert the Mongols. How might that shape his account?","He may pay close attention to how Christians were treated","He could not have understood anything he saw at court","He was writing to describe life in Ming China","He probably copied his whole report from an older Roman book"),
    histLevel(2,"Sorqoqtani Beki was the mother of Kublai Khan and three other rulers. What is she remembered for?","Running her lands wisely and helping her sons become rulers","Writing the first history of the whole Mongol Empire","Leading the Mongol fleets that attacked Japan in 1274 and 1281","Building the Great Wall to keep the Mongols out"),
    histLevel(2,"Rashid al-Din, a Persian official who served the Mongol rulers of Iran, wrote a giant book. What was it?","A history of the world’s peoples","A guide to growing rice","A collection of laws for the yam riders","A book of Mongol war songs"),
    histLevel(1,"Which grandson of Genghis Khan conquered China and founded the Yuan dynasty?","Kublai Khan","Batu Khan","Hulagu Khan","Temüjin"),
    histLevel(3,"Which evidence best supports the claim that the Mongol Empire connected Afro-Eurasia?","Marco Polo traveled from Venice to Kublai Khan’s court","The Mongols lived in felt tents called gers","Genghis Khan united the Mongol tribes in 1206","Mongol soldiers were skilled horse archers who rode for days"),
    histLevel(3,"A visitor asks why the Mongol armies were so hard to stop. What is the best answer?","Fast horse archers, strict discipline, and skilled siege engineers","They had a navy larger than any other in Afro-Eurasia","Their enemies had no armies or city walls","They fought on foot in tight rows, much like the old Roman legions had"),
    histLevel(2,"After about 1260, the empire split into four parts called khanates. Which was one of them?","The Golden Horde","The Ottoman Empire","The Mughal Empire","The Song dynasty"),
    histLevel(3,"Looking back: the Silk Roads were busy long before the Mongols. What changed under Mongol rule?","More people and goods moved over longer distances","The routes were used for the first time","Silk stopped being traded to the west","Merchants stopped using the routes and sailed instead")
  ],
  blackDeath:[
    histLevel(1,"Your neighbor asks what causes the sickness. What do scientists today know caused the Black Death?","Bacteria called Yersinia pestis","A virus spread by mosquitoes","Bad air rising from swamps and old graves","A lack of salt in people’s food"),
    histLevel(1,"How did the plague usually reach new people?","Through flea bites and the coughs of very sick people","Through drinking water from rivers and wells","Through eating grain grown in the plague year","Through touching coins from foreign lands and markets"),
    histLevel(2,"Genoese ships carried the plague to Italy in 1347 from which Black Sea trading port?","Kaffa, in Crimea","Venice, in Italy","Lisbon, in Portugal","Alexandria, in Egypt"),
    histLevel(2,"Why did the plague spread so far so fast?","Busy trade routes carried people, goods, and fleas","Doctors moved from town to town to spread their cures","Cold winters made the fleas multiply faster","Farmers moved into cities when their crops failed"),
    histLevel(1,"About how much of Europe’s population died in the Black Death?","About one third to one half","About one tenth","About nine out of ten","Fewer than one in a hundred"),
    histLevel(3,"Ibn al-Wardi, a writer in Aleppo, Syria, wrote in 1348 (adapted): “The plague began in the land of darkness and has spread to China and India, and now it has come to us.” What does this source show?","The plague hit Asia and the Middle East, not just Europe","The plague started in Italy and then moved east into Syria","People in Syria knew little about lands to the east","The plague in Aleppo was a mild illness"),
    histLevel(3,"Boccaccio, a writer in Florence, wrote (adapted): “People fled the city and left even their own families behind, so great was their fear.” What effect does this show?","Fear broke apart families and communities","Cities grew because people moved in","Families moved closer together for safety","The sickness was gone from Florence by the next spring"),
    histLevel(3,"Boccaccio wrote this a few years after the plague, at the start of a book of stories. How should a historian use his description?","Use it with care and compare it with other records","Ignore it, since storytellers cannot describe real events","Trust each detail fully, since he lived in Florence then","Use it to learn about the Mongol army"),
    histLevel(2,"So many workers died that there were not enough left to farm. What did this mean for the peasants who survived?","They could ask for higher wages","They were paid less than before","They lost their land to the Mongol armies","They moved to China for work"),
    histLevel(2,"Looking back: the plague helped spark which revolt from Unit 5?","The English Peasants’ Revolt of 1381","The Yellow Turban Rebellion","The Nika riot in Constantinople","The Protestant Reformation of 1517 in Germany"),
    histLevel(3,"In some towns, Christians falsely blamed their Jewish neighbors for the plague and attacked them. What does this show?","Fear led people to blame and attack innocent people","Doctors had found the real cause of the plague","The plague was over by the time the attacks began","Towns worked together to care for the sick and the poor"),
    histLevel(2,"Scientists have studied DNA from skeletons in plague graves. Why is this useful?","It confirms which germ caused the disease","It tells us the names of the people buried there","It proves the plague did not reach China","It shows the victims were mostly soldiers"),
    histLevel(3,"Which statement best links the Mongol Empire and the Black Death?","Trade across Mongol lands helped carry the plague west","The Mongols ended the plague by closing their borders","The plague began in Europe and spread east to Mongolia","Mongol rulers sent doctors west to stop the plague"),
    histLevel(3,"Gabriele de’ Mussis wrote that Mongol soldiers attacking Kaffa threw plague-infected bodies over the walls. He was not there himself. How should historians treat this story?","As possible, but needing support from other evidence","As proven fact, since he wrote it down in 1348","As the single cause that brought the plague into Europe","As a story about the Inca, not the Mongols")
  ],
  afroEurasia:[
    histLevel(1,"A customer in your Venice bookshop asks who began printing with movable metal type in Europe, around 1450. What do you say?","Johannes Gutenberg","Martin Luther","Leonardo da Vinci","Michelangelo Buonarroti"),
    histLevel(1,"The word Renaissance means what?","Rebirth","Discovery","Reform","Revolution"),
    histLevel(2,"Why did the Renaissance begin in Italian cities like Florence and Venice?","Trade made them rich, and they had Roman ruins and books","They were ruled by the Mongols, who paid artists","They had no trade with the Islamic world or Byzantium at the time","They had the biggest farming villages in Europe"),
    histLevel(2,"Greek scholars moved to Italy as the Ottomans closed in on Constantinople, which fell in 1453. What did many of them bring?","Ancient Greek books and learning","Printing presses from China","Spices from the Americas","Paper money from the Song dynasty in China"),
    histLevel(2,"In 1517, a monk named Martin Luther wrote the 95 Theses. What was he protesting?","The Church selling indulgences","The Ottoman capture of Constantinople","The printing of books in German","The rule of the Mongol khans"),
    histLevel(3,"Copies of Luther’s ideas spread across Germany within weeks. Which invention best explains why?","The printing press","The magnetic compass","The caravel","Paper money"),
    histLevel(3,"The poet Rumi’s family left Balkh, in Central Asia, around 1218 and later settled in Anatolia. What danger was moving toward Balkh at the time?","The Mongol armies","The Black Death","The Spanish fleet","The Ottoman navy"),
    histLevel(3,"Rumi, a Sufi poet, wrote in Persian in the 1200s. Today his poems are read in many languages around the world. What does this show about cultural exchange?","Ideas can travel far beyond where they began","Persian was the main language of Europe","Poems cannot be translated into other languages","Rumi traveled to the Americas to share his work"),
    histLevel(2,"Which technology from China reached Europe through trade and war and changed how battles were fought?","Gunpowder","Porcelain","Silk weaving","The caravel"),
    histLevel(3,"The traveler Ibn Battuta wrote (adapted, 1300s): “In city after city of the Muslim lands, judges and scholars welcomed me and gave me work.” What helped him travel so far?","Shared faith, law, and Arabic across many lands","A pass from the Pope in Rome","A map printed by Gutenberg","A Mongol army that guarded him the whole way there"),
    histLevel(3,"Which statement best compares the Renaissance and the Reformation?","Both questioned old authorities, helped by the printing press","Both were wars between the Ottomans and Venice","Both began in Ming China and spread west along the Silk Roads","Both ended trade between Europe and Asia"),
    histLevel(2,"The Protestant Reformation divided which religious community?","Western Christianity","The Mongol Empire","Islam into Sunni and Shia","The Ottoman army"),
    histLevel(3,"A customer asks about the downside of closer connections across Afro-Eurasia. Which is a harmful effect?","Diseases like the plague spread faster","New crops and foods reached more places","Scholars shared ideas in math and medicine","Poems and stories were translated"),
    histLevel(1,"Between 1200 and 1450, merchants and scholars carried which faith to Mali and to the trading ports of Southeast Asia?","Islam","Christianity","Buddhism","Daoism")
  ],
  americasStates:[
    histLevel(1,"Travelers ask where your city, Tenochtitlan, was built. What do you say?","On an island in Lake Texcoco","High in the Andes Mountains","On the coast of the Yucatán Peninsula","Beside the Mississippi River"),
    histLevel(1,"A visitor asks what chinampas are, the fields your family farms. What do you say?","Raised garden beds built up from the lake’s mud","Stone terraces cut into mountainsides","Fields cleared by cutting and burning the forest trees","Desert farms watered by deep wells"),
    histLevel(2,"How did the Mexica (Aztec) Empire get goods from the peoples it conquered?","It demanded regular tribute","It paid them in silver coins","It bought goods with paper money","It asked them to send their soldiers to Spain"),
    histLevel(2,"The Inca built about 40,000 km (25,000 miles) of roads. Who ran along them carrying messages?","Chasqui runners","Pochteca traders","Samurai","Yam riders"),
    histLevel(2,"The Inca did not have a writing system like the Maya’s. How did they keep records?","With knotted cords called quipu","With clay tablets in cuneiform","With books of folded bark paper","With paper money and receipts"),
    histLevel(2,"How did the Inca get work done on roads and terraces?","Through mit’a, a labor tax owed to the state","Through paid workers hired from Spain and Portugal","Through monks who built for free","Through Mongol engineers"),
    histLevel(3,"In this period, the Maya lived in separate city-states, not one big empire. How were they different from the Inca?","The Inca ruled one large empire from Cusco","The Inca also lived in separate city-states","The Inca lived on islands in a lake","The Inca had a written script like the Maya"),
    histLevel(3,"Bernal Díaz, a Spanish soldier, wrote about the great market near your city (adapted): “We were amazed at the crowds and the order. Each kind of goods had its own place.” What does this show?","The Mexica had a large, well-organized market","Spanish soldiers thought the city was small and poor","The Mexica had no trade with other peoples","The market sold goods from Europe and Asia"),
    histLevel(3,"Díaz wrote this about fifty years later, as an old man. How might that shape his account?","Memory can fade, so details should be checked","He was a Mexica merchant, so he favored the market","He wrote it before the Spanish arrived","He was describing the Inca city of Cusco"),
    histLevel(2,"Macuilxochitl was a Mexica woman from a noble family. What is she known for?","Writing poetry in Nahuatl","Leading the Inca army","Founding Tenochtitlan","Building the great roads of the Inca"),
    histLevel(3,"Which statement best compares the Mexica (Aztec) and Inca Empires?","Both ruled many peoples and collected goods or labor from them","Both were built on islands in a lake in Mexico","Both used the same language and calendar","Both were small separate city-states that had no kings or rulers"),
    histLevel(3,"Ancestral Puebloan communities often moved and rebuilt in new places. Which best explains why?","Droughts and changing resources made moving a way to survive","The Inca army forced them to move south","They were moving to be closer to the big Maya cities in the south","They moved to escape Spanish soldiers in the 1200s"),
    histLevel(1,"Which mountains were home to the Inca Empire?","The Andes","The Rockies","The Himalayas","The Alps"),
    histLevel(2,"The Inca grew crops on stepped fields cut into mountainsides. What are these fields called?","Terraces","Chinampas","Paddies","Oases"),
    histLevel(3,"Mexica tribute records list feathers, cotton cloth, and cacao sent from distant provinces. What can historians learn from them?","How far the empire reached and what it took from others","What Spanish soldiers ate on the march","How the Inca chose their rulers","What the Maya scribes wrote in their calendar books long before")
  ],
  americasTrade:[
    histLevel(1,"Your goods travel on the backs of porters. Why don’t you use horses or oxen?","There were no horses or oxen in the Americas yet","Horses were too costly for traders like you to buy","The emperor banned animals from the roads","Oxen could not cross the lake bridges"),
    histLevel(1,"In the Andes, which animal carried goods for Inca traders and armies?","The llama","The camel","The horse","The elephant"),
    histLevel(2,"Archaeologists found scarlet macaw bones at Pueblo Bonito in Chaco Canyon, far from where macaws live. What does this show?","Chaco traded with people far to the south","Macaws once lived wild in the desert","Chaco people kept macaws for food","Spanish ships brought macaws to Chaco Canyon"),
    histLevel(2,"Traces of cacao were found in jars at Chaco Canyon. Why is this surprising?","Cacao grew far south in Mesoamerica","Cacao was first grown in Europe","Chaco people did not drink anything warm","Cacao came to the Americas from Africa"),
    histLevel(2,"Chaco Canyon became a center for working which blue-green stone that was traded far and wide?","Turquoise","Jade","Obsidian","Lapis lazuli"),
    histLevel(2,"Cahokia, near today’s St. Louis, was the largest city of which culture?","The Mississippian culture","The Maya","The Inca","The Ancestral Puebloan culture"),
    histLevel(3,"At Cahokia, archaeologists found copper from the Great Lakes and seashells from the Gulf of Mexico. What claim does this evidence support?","Cahokia was part of a long-distance trade network","Cahokia people sailed across the ocean to Europe for copper","Copper and shells were made at Cahokia itself","Cahokia traded with the Inca by sea"),
    histLevel(1,"A visitor asks what you do as a pochteca. What do you say?","Trade goods over long distances","Run messages on Inca roads","Lead prayers at the Great Temple","Build chinampa fields in the lake"),
    histLevel(3,"Pochteca like you often bring news about faraway lands back to the Mexica rulers. Why do the rulers value this news?","It helps them plan trade, tribute, and wars","It tells them how to plant chinampas","It lets them write letters to the king of Spain","It helps them learn to sail to Africa"),
    histLevel(3,"How was trade in the Inca Empire different from trade in the Mexica Empire?","The Inca state controlled more of it, with fewer big markets","The Inca used paper money, while the Mexica paid with gold coins","The Inca traded by sea with China","The Mexica had no markets, while the Inca had many"),
    histLevel(2,"In Mexica markets, what could people use like money?","Cacao beans and cotton cloth","Silver coins from Spain","Paper money","Gold coins stamped with the emperor’s face"),
    histLevel(3,"Which statement best compares trade in the Americas and on the Silk Roads before 1492?","Both moved goods far, but the Americas had no pack horses or camels","The Americas had no long-distance trade before 1492","Both used camels to carry goods across deserts","Trade in the Americas depended on big sailing ships like those from China"),
    histLevel(2,"Maya traders along the coast of the Yucatán carried goods how?","In large dugout canoes","On camels","In wagons pulled by oxen","On horseback"),
    histLevel(3,"Obsidian, a volcanic glass, was used for sharp tools. Obsidian from one source in Mexico has been found hundreds of miles away. How do archaeologists know where it came from?","Each source has its own chemical makeup","Each piece was stamped with the trader’s name","Obsidian is found in just one place on Earth","The pieces were found in their original boxes")
  ],
  empiresExpand:[
    histLevel(1,"In 1453, which city did the Ottomans capture and make their capital?","Constantinople","Baghdad","Isfahan","Delhi"),
    histLevel(1,"Historians call the Ottoman, Safavid, and Mughal empires “gunpowder empires.” Why?","They used cannons and guns to expand","They invented gunpowder","They traded gunpowder to the Americas","They banned guns in their lands"),
    histLevel(2,"Which faith did the Safavids make the official religion of Persia (Iran)?","Shia Islam","Sunni Islam","Zoroastrianism","Christianity"),
    histLevel(2,"Who founded the Mughal Empire in India in 1526?","Babur","Akbar","Süleyman","Shah Abbas"),
    histLevel(2,"Akbar ruled the Mughal Empire, where most people were Hindu. What policy is he known for?","Tolerance toward many faiths","Making Christianity the law across India","Closing Hindu temples across India","Banning trade with Persia"),
    histLevel(2,"Which dynasty overthrew the Ming and ruled China from 1644?","The Qing","The Song","The Tang","The Yuan"),
    histLevel(3,"Ogier de Busbecq, an ambassador from Austria, visited Süleyman’s court in the 1550s. He wrote (adapted): “Here, a man’s rank comes from his skill, not his birth.” What is he praising?","Ottomans promoted officials for their talent","The Ottomans gave offices to the sons of nobles","The Ottomans elected the sultan each year","The Ottomans hired officials from Austria"),
    histLevel(3,"In Busbecq’s Europe, a person’s birth mattered more. How might this shape his account?","He may praise the Ottomans to criticize Europe","He could not have known anything about life in Europe","He was an Ottoman official praising himself","He wrote it to describe Ming China"),
    histLevel(2,"The Russian ruler Ivan IV took a new title that comes from “caesar.” What was it?","Tsar","Sultan","Shah","Khan"),
    histLevel(3,"Which statement best compares the Ottoman, Safavid, and Mughal empires?","All three were Muslim-ruled land empires that used gunpowder weapons","All three were ruled from Europe by Christian kings","All three were sea empires whose fleets traded mainly with the Americas","All three began when the Mongols conquered them"),
    histLevel(3,"Khanzada Begum, Babur’s older sister, was a respected adviser at the Mughal court. What does her story show?","Royal women could have real influence in Mughal politics","Royal Mughal women had no role at court or in family affairs","Women ruled the Mughal Empire alone","She founded the Safavid Empire"),
    histLevel(2,"Russia grew from the small state of Muscovy into a huge empire. Which way did it expand most by 1700?","East across Siberia to the Pacific","South into India","West across the Atlantic Ocean to America","North into Scandinavia"),
    histLevel(3,"Which best explains why land empires like the Ottomans grew so large after 1450?","Cannons broke city walls, and strong armies held new lands","Their rivals had no armies after the Black Death","The Mongols handed over their lands in a treaty","New ocean ships let them carry their armies across the Atlantic"),
    histLevel(2,"Shah Jahan, a Mughal emperor, built a white marble tomb for his wife Mumtaz Mahal. What is it called?","The Taj Mahal","The Hagia Sophia","The Forbidden City","The Blue Mosque"),
    histLevel(3,"The Ming built the Forbidden City in Beijing and rebuilt the Great Wall in stone. What do these projects show?","A strong state that could organize huge numbers of workers","China had stopped worrying about raids from the northern steppe","China was ruled by the Mongols at the time","The Ming were too weak to build anything new")
  ],
  ageExploration:[
    histLevel(1,"Which Portuguese captain sails into your port of Malindi in 1498, on his way to India?","Vasco da Gama","Christopher Columbus","Ferdinand Magellan","Zheng He"),
    histLevel(1,"A neighbor asks why European kings and queens pay for voyages like this one. What do you say?","To reach Asian spices and riches by sea","To escape the Black Death in Europe","To return Greek books to Constantinople","To help the Mongols send armies to Africa"),
    histLevel(2,"The Portuguese used a small, fast ship that could sail far down Africa’s coast and back. What was it called?","The caravel","The junk","The longship","The trireme"),
    histLevel(2,"Before the Portuguese arrived, who carried most of the trade in the Indian Ocean?","Many Asian, Arab, and African merchants","The Spanish navy","A Dutch trading company based in Amsterdam","The Ottoman army"),
    histLevel(2,"In 1494, Spain and Portugal signed the Treaty of Tordesillas. What did it do?","Split newly claimed lands between them","Ended the Black Death","Gave Constantinople to the Ottomans","Made peace with the Inca and the Aztec"),
    histLevel(3,"Zheng He’s fleets sailed from China to East Africa between 1405 and 1433, and an inscription from 1431 says (adapted): “We crossed more than 100,000 li of ocean and saw lands far beyond the horizon.” What does this show?","Large ocean voyages in Asia came before Europe’s","China was the last to explore the oceans","Zheng He sailed to the Americas first","Europe’s ships had already reached India by 1400"),
    histLevel(3,"After 1500, the Portuguese built forts at ports like Goa and Malacca and made ships buy passes. What does this show about their goals?","They wanted to control trade, not just join it","They wanted to protect local merchants from pirates","They wanted to settle farmers there like in Brazil","They wanted to learn the Swahili language"),
    histLevel(3,"Columbus wrote to the Spanish king and queen in 1493 (adapted): “The islands are rich in gold, spices, and cotton, and the people could be made to serve us.” What do his words show?","He hoped to profit from the land and its people","He wanted to learn the Taíno language and culture","He thought the islands had little of value","He believed he had reached the coast of Africa"),
    histLevel(2,"Ferdinand Magellan’s expedition (1519–1522) was the first to do what?","Sail all the way around the world","Reach India by sailing around Africa","Cross the Atlantic Ocean from Europe","Find the Pacific Ocean from Mexico"),
    histLevel(2,"Yasuke was a man from Africa who came to Japan with Portuguese Jesuits in 1579. What is he known for?","Serving the Japanese warlord Oda Nobunaga","Leading the first Portuguese voyage to India","Founding a trading port in Malindi","Sailing with Zheng He’s treasure fleet"),
    histLevel(3,"What does Yasuke’s story show about ocean connections in the 1500s?","People from many lands crossed paths far from home","Japan had no contact with Europeans before 1800","Africans did not travel across oceans in this period","Ocean trade stayed inside the Atlantic"),
    histLevel(3,"Spanish galleons carried silver from Mexico across the Pacific to Manila, starting in 1571. Where did much of that silver end up?","In China, to buy silk and porcelain","In Mali, to buy gold","In Russia, to buy furs","In England, to build its new navy and ports"),
    histLevel(3,"Which best explains why Portugal led European exploration at first?","Its rulers paid for voyages down Africa’s coast, step by step","It was the largest and richest kingdom in Europe","It had already conquered the Ottoman Empire","Its sailors used old Viking maps that showed the way to India"),
    histLevel(1,"Which ocean did Columbus cross in 1492?","The Atlantic","The Pacific","The Indian","The Southern Ocean")
  ],
  columbianExchange:[
    histLevel(1,"You plant sweet potatoes and maize. Where did these crops first come from?","The Americas","Africa","Europe","Southeast Asia"),
    histLevel(1,"What do historians call the movement of plants, animals, and diseases between the hemispheres after 1492?","The Columbian Exchange","The Commercial Revolution","The Renaissance","The Pax Mongolica"),
    histLevel(2,"Which animals did Europeans bring to the Americas?","Horses, cattle, and pigs","Llamas and alpacas","Turkeys and guinea pigs","Jaguars and scarlet macaws"),
    histLevel(2,"Why did your village grow after farmers began planting sweet potatoes and maize?","They grew on hills and dry land where rice could not","They did not need any water or sunlight to grow","They were carried to China by Zheng He’s fleet from Africa","They replaced rice because rice stopped growing"),
    histLevel(2,"Which crop from the Americas became a main food for many people in Europe, especially in Ireland?","The potato","Rice","Wheat","The banana"),
    histLevel(3,"Why were diseases like smallpox so deadly for Indigenous peoples of the Americas?","They had no immunity, since the diseases were new to them","The Spanish carried a cure but kept it for themselves","The diseases came from llamas and other animals of the Americas","Smallpox was a mild illness that rarely caused harm"),
    histLevel(3,"In the century after 1492, the Indigenous population of the Americas fell sharply, in some places by as much as 90 percent. What was the biggest cause?","Diseases from Afro-Eurasia, along with war and forced labor","Famines caused by new crops from Europe","Hurricanes and earthquakes that struck across the two continents","People moving away to Europe and Africa"),
    histLevel(3,"A historian says the Columbian Exchange helped some people and devastated others. Which pair best supports this?","New crops fed growing populations; epidemics killed millions in the Americas","Horses helped farmers plow fields in Europe, while potatoes would not grow in China","Silk reached Europe; spices reached Africa","Tomatoes reached Italy; wheat reached Ireland"),
    histLevel(2,"Amonute, known today as Pocahontas, belonged to which Native nation in Virginia?","The Powhatan","The Mexica","The Inca","The Mississippians"),
    histLevel(3,"Amonute traveled to England in 1616 and died there in 1617. What does her life show about this era?","Native peoples were drawn into new contacts, often at great cost","English colonists and the Powhatan people had little contact","Native nations of Virginia easily kept the English settlers off their land","Most people in England had already visited Virginia"),
    histLevel(2,"Sugarcane was brought to Brazil and the Caribbean to grow on large plantations. Where did it first come from?","New Guinea and India","The islands of the Caribbean Sea","Northern Europe","The Andes Mountains"),
    histLevel(3,"Mapping a meal: spaghetti with tomato sauce in Italy uses wheat from Southwest Asia and tomatoes from the Americas. What does this show?","Many “traditional” foods are results of the exchange","Italy grew tomatoes long before 1492","Pasta was invented in the Americas","Tomatoes came to Italy from China along the Silk Roads"),
    histLevel(1,"Which food went FROM the Americas to the rest of the world?","Chocolate (cacao)","Wheat","Rice","Oranges and lemons"),
    histLevel(3,"Horses spread north from Spanish Mexico. How did they change life on the Great Plains by the 1700s?","Many nations, like the Comanche, used them to hunt bison","Plains nations stopped hunting bison and became corn farmers","Horses were kept for pulling Spanish wagons","Bison herds disappeared within ten years")
  ],
  exploreColumbian:[
    histLevel(1,"Elders tell you about the Spanish leader who arrived in 1519 and fought the Mexica. Who was he?","Hernán Cortés","Francisco Pizarro","Vasco da Gama","Ferdinand Magellan"),
    histLevel(1,"Which Spanish conquistador captured the Inca ruler Atahualpa in 1532?","Francisco Pizarro","Hernán Cortés","Bartolomé de las Casas","Christopher Columbus"),
    histLevel(2,"Many Indigenous people, like the Tlaxcalans, fought alongside the Spanish against the Mexica. Why?","They were longtime enemies of the Mexica Empire","The Spanish paid them in gold coins from Spain","They wanted to move to Spain after the war","They had been conquered by the Inca army and wanted to get revenge"),
    histLevel(2,"The elders describe a sickness in 1520 that covered people with sores and killed many in the city. What was it?","Smallpox","The Black Death","Malaria","Influenza"),
    histLevel(3,"The book you are helping to make, now called the Florentine Codex, records Nahua elders’ memories of the conquest. Why is it valuable?","It gives the view of the conquered, not just the conquerors","It was written by Cortés himself","It was written down during the battles, so its details are exact","It shows how the Inca saw the conquest"),
    histLevel(3,"Why should historians still check the Florentine Codex against other sources?","Memories fade, and a Spanish friar guided the project","Nahuatl cannot be translated into other languages","It was written in Spain by people who had not visited Mexico","It was written by Inca scribes in Cusco"),
    histLevel(2,"Under the encomienda system, Spanish colonists were given what?","The right to demand labor and tribute from Indigenous people","Land in Spain for fighting in the war","Ships to trade with China","Money from the Spanish king to build new schools in Mexica towns"),
    histLevel(3,"Bartolomé de las Casas, a Spanish priest, wrote in 1542 (adapted): “The native peoples are treated cruelly and worked to death in the mines and fields.” What was his goal?","To convince the king to protect Indigenous people","To praise the encomienda system","To ask the king to send many more workers to the mines","To describe trade in the Indian Ocean"),
    histLevel(3,"Las Casas wanted the king to change his laws. How might that shape his account?","He may stress the worst events to persuade the king","He would hide abuses to protect the colonists","He could not have seen anything in the colonies himself","He was writing about Ming China"),
    histLevel(2,"The Spanish found a mountain of silver at Potosí, in the Andes, in 1545. Who did most of the dangerous mining?","Indigenous workers forced through the mita","Spanish soldiers who were paid very high wages","Chinese miners who sailed to Peru","Machines powered by steam engines"),
    histLevel(3,"Silver from Potosí and Mexico flowed to Europe and across the Pacific to China. Which claim does this support?","American silver helped link a global economy","Silver was used for trade inside the Americas alone","China sent its silver to Spain","Spain kept the silver hidden in Mexico"),
    histLevel(3,"Which best explains how a few hundred Spanish soldiers defeated the Mexica Empire?","Disease, Indigenous allies, and steel weapons all played a part","The Mexica had no army or weapons of their own","The Mexica welcomed Spanish rule and gave up without fighting at all","Cortés brought an army of 50,000 Spaniards"),
    histLevel(2,"Malintzin (also called La Malinche) was a Nahua woman who was given to the Spanish as a captive. What role did she play?","Interpreter and adviser to Cortés","Ruler of Tenochtitlan","Captain of a Spanish ship","Inca princess who met Pizarro in Peru"),
    histLevel(1,"After the conquest, what city did the Spanish build on top of Tenochtitlan?","Mexico City","Santo Domingo","Cusco","Havana")
  ],
  /* 6.10 is a hard lesson (gate + quiet; docs/HARD-LESSONS.md): no role play, factual wording, no graphic detail, victims named as people. */
  slaveTrade:[
    histLevel(1,"Between about 1500 and the 1860s, about how many African people were forced onto ships in the transatlantic slave trade?","About 12.5 million","About 125,000","About 1 million","More than 100 million"),
    histLevel(1,"What do historians call the voyage across the Atlantic on slave ships?","The Middle Passage","The Silk Road","The Northwest Passage","The Grand Tour"),
    histLevel(2,"Where were most enslaved Africans taken?","Brazil and the Caribbean","The colonies that became the United States","Western Europe","The Ottoman Empire"),
    histLevel(2,"Which crop drove much of the demand for enslaved workers in Brazil and the Caribbean?","Sugar","Wheat","Potatoes","Tea"),
    histLevel(2,"Slavery existed in many societies before 1500. Which feature made Atlantic slavery different?","It was based on race, and children were born into slavery","Enslaved people in the Americas were paid fair wages for work","It lasted a few years for each person, then ended","It happened in one small region of Africa"),
    histLevel(2,"Captives were chained below deck in crowded ships for weeks or months. Of the 12.5 million people forced aboard, about how many died during the crossing?","Nearly 2 million people","About 2,000 people","About 200,000 people","About 20 million people"),
    histLevel(3,"In 1526, Afonso I, king of Kongo, wrote to the king of Portugal (adapted): “Merchants are taking our people every day, even our own relatives and nobles. We ask you to stop it.” What does this source show?","An African ruler protested the trade and its harm","Kongo’s king asked for more ships to come","The trade had little effect on Kongo","Afonso wrote to thank the king of Portugal for the trade"),
    histLevel(3,"Why is Afonso’s letter especially useful to historians?","It shows an African leader’s view at the time","It was written by a ship captain","It was written centuries later","It lists the names of the people who were taken away"),
    histLevel(2,"Domingos Álvares was a healer from the kingdom of Dahomey in West Africa. What happened to him?","He was enslaved and taken to Brazil, where he kept healing","He sailed to Portugal as an ambassador from Dahomey","He became king of Dahomey and ended the trade in his lands","He was a sailor who traded in the Indian Ocean"),
    histLevel(3,"Why do historians tell the life stories of people like Domingos Álvares?","They show enslaved people as individuals with skills and beliefs","They prove the trade was much smaller than historians once thought","They are easier to find than ship records","They show how kings in Europe lived"),
    histLevel(3,"West and Central Africa lost millions of people, most of them young adults. Which effect does this help explain?","Fewer young people to farm, build, and raise families","Faster population growth in Africa than anywhere in Europe","More African sailors trading in the Indian Ocean","Stronger ties between Kongo and the Inca"),
    histLevel(2,"Some enslaved people escaped and built their own free communities, like Palmares in Brazil. What are such communities called?","Maroon communities","Missions","Encomienda estates","Chinampas"),
    histLevel(3,"In his book Capitalism and Slavery (1944), the historian Eric Williams argued that profits from slavery helped Britain grow rich. What kind of claim is this?","An argument about causes that historians still discuss","A primary source written by a ship captain in the 1600s","A fact that no historian has ever questioned","A description of the Middle Passage"),
    histLevel(2,"Cape Coast Castle in Ghana is now a museum. What happened there during the slave trade?","Captives were held there before being forced onto ships","It was a palace for the Ottoman sultans","It was a school where Portuguese sailors learned to navigate","Sugar was grown and sold there"),
    histLevel(3,"Why do many Ghanaians and people of African descent visit castles like Cape Coast today?","To remember the people who suffered and honor their ancestors","To see where Portuguese explorers first landed on their way to Asia","To study how sugar was grown in the Caribbean","To learn about Mongol trade routes in Africa")
  ]
};
/* ---------- end of History Unit 6 ---------- */
/* ---------- History Unit 7: The Long Nineteenth Century (1750 to 1914 CE) (Oct 28, 2026; docs/HISTORY-UNIT7.md) ---------- */
const HISTORY_UNIT7 = [   // Khan's practice exercises, in order (checked on khanacademy.org, Oct 28 2026)
  {id:'enlightenRev',name:"Enlightenment and Revolution",lesson:"Enlightenment thinkers trusted reason. Locke said people have natural rights and may replace a government that abuses them, Montesquieu urged separate branches, and Burke warned that sudden revolution could bring chaos."},
  {id:'atlanticRevs',name:"Atlantic Revolutions",lesson:"From 1775 to 1825, revolutions in the United States, France, Haiti, and Latin America used ideas of rights and self-rule. Haiti was the first nation founded by people who freed themselves from slavery."},
  {id:'nationalism19',name:"Nationalism",lesson:"Nationalism is the idea that people who share a language, culture, and history should have their own state. It united Italy (1861) and Germany (1871) but pulled apart empires that ruled many peoples."},
  {id:'industrialRev',name:"The Industrial Revolution",lesson:"Starting in Britain in the late 1700s, machines powered by coal moved work from homes into factories. Coal, colonies, trade, and money to invest helped it start there, and cities grew fast."},
  {id:'egyptJapan',name:"Comparing Industrialization in Egypt and Japan",lesson:"In both Egypt and Japan the government led industrialization. Muhammad Ali’s factories faded under British pressure, while Meiji Japan built lasting industry and a strong army."},
  {id:'workingClass',name:"The Working Class",lesson:"Factory workers faced long hours, low pay, and danger. They responded with unions, strikes, and new ideas like socialism, and governments began to pass laws to protect them."},
  {id:'reformMovements',name:"Reform Movements",lesson:"Reformers worked to end slavery, limit child labor, and win the vote for women. Slavery ended through moral campaigns, economic change, and the resistance of enslaved people themselves."},
  {id:'newImperialism',name:"Industrial Imperialism",lesson:"Industrial nations took colonies for raw materials and markets, using steamships, railways, and new weapons. They divided Africa at the Berlin Conference and forced unequal treaties on China after the Opium Wars."},
  {id:'resistColonial',name:"Resisting Colonialism",lesson:"Colonized people resisted in many ways: the 1857 uprising in India, Yaa Asantewaa’s defense of the Golden Stool, Ethiopia’s victory at Adwa, and peaceful petitions and newspapers."}
];
/* Khan's lessons 7.1 to 7.10, each its own block with its videos, and Khan's three quizzes: Quiz 1 after 7.3, Quiz 2 after 7.6,
   Quiz 3 after 7.9; the unit test comes after 7.10 (docs/HISTORY-UNIT7.md). */
const HISTORY_GROUPS7 = [
  {id:'overview7',name:'The Long Nineteenth Century | 7.1',noQuiz:true,skills:[],learn:'What were the engines of change that created our modern world? New ideas about rights, new machines and factories, new nations, and new empires changed how people lived, worked, and were ruled.'},
  {id:'enlighten7',name:'Enlightenment and Revolution | 7.2',noQuiz:true,skills:['enlightenRev'],learn:'How did Enlightenment ideas help spark revolution? Thinkers used reason to question kings who claimed power from God and argued that power comes from the people.'},
  {id:'atlantic7',name:'Atlantic Revolutions | 7.3',quizName:'Quiz 1',quizSkills:['enlightenRev','atlanticRevs'],skills:['atlanticRevs'],learn:'Why was 1750 to 1825 an “Age of Revolution”? Revolutions spread around the Atlantic, from the United States to France, Haiti, and Latin America.'},
  {id:'nation7',name:'Nationalism | 7.4',noQuiz:true,skills:['nationalism19'],learn:'Why do we live in a world of nation-states? Nationalism spread after the French Revolution, sparked the revolutions of 1848, and united Italy and Germany.'},
  {id:'industry7',name:'The Industrial Revolution | 7.5',noQuiz:true,skills:['industrialRev'],learn:'How did the Industrial Revolution begin and spread? Coal-powered machines and factories started in Britain and spread to Europe, the United States, and beyond.'},
  {id:'egyptJapan7',name:'Comparing Industrialization in Egypt and Japan | 7.6',quizName:'Quiz 2',quizSkills:['nationalism19','industrialRev','egyptJapan'],skills:['egyptJapan'],learn:'How did Egypt and Japan industrialize? In both, the government led the way, but Japan’s industry lasted while Egypt’s faded under foreign pressure.'},
  {id:'workers7',name:'The Working Class | 7.7',noQuiz:true,skills:['workingClass'],learn:'How did workers respond to industrial life? They formed unions, went on strike, and supported new ideas like socialism.'},
  {id:'reform7',name:'Reform Movements | 7.8',noQuiz:true,skills:['reformMovements'],learn:'How did industrialization lead to calls for reform? Reformers fought to end slavery and child labor and to win the vote for women.'},
  {id:'imperial7',name:'Industrial Imperialism | 7.9',quizName:'Quiz 3',quizSkills:['workingClass','reformMovements','newImperialism'],skills:['newImperialism'],learn:'How did industrialization change empires? Factories needed raw materials and markets, and new technology let a few nations take over much of Africa and Asia.'},
  {id:'resist7',name:'Resisting Colonialism | 7.10',noQuiz:true,skills:['resistColonial'],learn:'How did colonized people resist? They fought, organized, wrote, and petitioned, from India in 1857 to the Asante in 1900 and Ethiopia at Adwa.'}
];
/* History Unit 7 bank (Oct 28, 2026; docs/HISTORY-UNIT7.md): role play, plausible wrong answers, adapted sources in every lesson. */
const HISTORY7_QUESTIONS = {
  enlightenRev:[
    histLevel(1,"A customer asks what Enlightenment writers trusted most to understand the world. What do you say?","Human reason and evidence","Ancient traditions passed down from the past","The commands of the king and his court","Old stories about luck and fate"),
    histLevel(1,"A customer wants the book that says people are born with natural rights to life, liberty, and property. Whose book is it?","John Locke’s","Isaac Newton’s","Edmund Burke’s","Napoleon Bonaparte’s"),
    histLevel(2,"A lawyer orders a book by Montesquieu. What idea is Montesquieu known for?","Splitting government power among separate branches","Giving one ruler full control so the laws are clear","Letting the Church write the kingdom’s laws","Ending the tax on bread and salt"),
    histLevel(2,"What does “sovereignty” mean?","The supreme power to rule and make laws","A trade route between two kingdoms","A tax collected on salt and grain","A church service held for the king and his family"),
    histLevel(2,"The king of France says he rules by “divine right.” What does he mean?","His power comes from God, not from the people","He was chosen by a vote of the citizens","He must obey a parliament of nobles","He was chosen by the nobles, who can remove him"),
    histLevel(3,"You print a book in which Locke argues (adapted): “If a government breaks the people’s trust, the people may set up a new one.” Which idea does this support?","People may replace a government that abuses its power","Kings receive their power directly from God","Subjects should obey their rulers in every case","Scientists should run the government instead of kings"),
    histLevel(3,"You print Rousseau’s famous line (adapted): “People are born free, but everywhere they are in chains.” What is he criticizing?","Governments and customs that take away people’s freedom","Children who do not obey their parents at home","Merchants who charge too much for printed books","Scientists who ignore new evidence about the natural world"),
    histLevel(3,"In 1792, Mary Wollstonecraft argued that women only seemed less capable because they were kept from education. How did she use Enlightenment ideas?","She argued that reason and rights belong to women too","She argued that kings should rule by divine right","She argued that tradition matters more than reason","She argued that schooling should be kept for landowners’ sons"),
    histLevel(2,"Voltaire is famous for defending which ideas?","Free speech and religious tolerance","The Church’s right to ban books","The divine right of the French king","Strict rules about what people may read"),
    histLevel(3,"At first, which group gained the most from Enlightenment ideas about rights?","Mostly educated men who owned property","Enslaved people in the colonies, who were freed at once","Women, who won the right to vote across Europe","Peasants, who were given land in each kingdom"),
    histLevel(3,"In 1790, Edmund Burke wrote about the French Revolution. What was his main warning?","Tearing down old institutions at once could bring chaos and violence","France should bring back divine-right kings in every European country","Reason was useless, so people should stop reading the new books","Revolutions make life better, so Britain should have one too"),
    histLevel(3,"Some people wanted revolution (fast change); others wanted evolution (slow change). Which is an example of evolution?","A parliament slowly widening the vote over many years","Crowds storming a royal prison and overthrowing the king","Rebels declaring a new country in a single summer","An army seizing the capital and crowning a new ruler"),
    histLevel(1,"Where do people in Paris often gather to talk about the new ideas you print?","Salons and coffeehouses","Royal prisons and forts","Army camps outside the city","Monasteries closed to visitors"),
    histLevel(2,"Looking back: how did the Scientific Revolution help lead to the Enlightenment?","Science showed that reason and observation could explain nature, so thinkers used reason on society","Science proved that the Sun moves around the Earth, so thinkers trusted ancient books even more","It ended trade between Europe and Asia","Science showed that nature cannot be understood, so thinkers stopped asking questions about society"),
    histLevel(1,"How does your printing press help spread the new ideas?","Books and pamphlets reach many readers","It prints money for the king’s army","It replaces schools and teachers","It keeps the new ideas secret from the public")
  ],
  atlanticRevs:[
    histLevel(1,"In 1776, which document declared the American colonies free from Britain?","The Declaration of Independence","The US Constitution","The Declaration of the Rights of Man","The Magna Carta"),
    histLevel(1,"In July 1789, you hear that a Paris crowd stormed a royal fortress and prison. What was it called?","The Bastille","Versailles","The Louvre","The Conciergerie"),
    histLevel(1,"Who was the formerly enslaved general who became the best-known leader of the Haitian Revolution?","Toussaint Louverture","Simón Bolívar","Napoleon Bonaparte","Francisco de Miranda"),
    histLevel(2,"In 1804, Haiti declared independence. What made it unique?","It was the first nation founded by people who freed themselves from slavery","It was the first colony in the Americas to break away from Spain and choose a king of its own","It was ruled by a king sent from France","It was the first country with a written constitution"),
    histLevel(2,"In the port of Cartagena, people praise Simón Bolívar. What is he known for?","Leading independence wars in northern South America","Writing the US Constitution in Philadelphia","Leading the crowd that stormed the Bastille","Leading the first revolt against Spain in central Mexico"),
    histLevel(2,"Why was the French government short of money in the 1780s?","Costly wars, including help for the American Revolution, left huge debts","Its colonies had stopped growing sugar and coffee","Its colonies had all won independence, so the taxes from them stopped coming in","The Church had taken over the royal treasury"),
    histLevel(3,"The US Declaration said (adapted) that “all men are created equal,” but slavery stayed legal. What does this show?","The revolution’s ideals were not applied to everyone at first","Americans in 1776 did not think about slavery at all","The Declaration ended slavery in the thirteen states","The Declaration was written mostly to end the slave trade from Africa"),
    histLevel(3,"France’s Declaration of the Rights of Man (1789) said (adapted): “Men are born and remain free and equal in rights.” How did enslaved people in Saint-Domingue respond to ideas like this?","They claimed those rights for themselves and fought for their freedom","They decided the declaration was meant for French nobles and stayed out of the fighting","They asked France to lower the taxes on sugar","They waited for France to free them and did not act on their own"),
    histLevel(3,"Historians call 1775 to 1825 an “Age of Revolution.” Which evidence best supports that name?","Revolutions spread from North America to France, Haiti, and Latin America","Britain and Spain kept firm control of their colonies in the Americas for the next hundred years","A single revolution changed France","Spain conquered new colonies in the Americas"),
    histLevel(2,"What was the Reign of Terror (1793–1794)?","A time when the government executed people it called enemies of the revolution","A war in which Britain conquered Paris","A plague that spread through French cities and killed many people in Paris and Lyon","A peaceful time after Napoleon became emperor, when the old nobles returned to rule"),
    histLevel(3,"After years of upheaval, Napoleon took power in 1799. Which best explains why many French people accepted him?","He promised order and kept some revolutionary changes, like equal laws","He promised to bring back the old king and all of the nobles’ special privileges","He was elected by the kings of Europe","He disbanded the French army"),
    histLevel(2,"In 1808, Napoleon conquered Spain. How did this affect Spain’s colonies in the Americas?","It weakened Spain’s control, and creoles began pushing for self-rule","It made Spain’s grip on its colonies in the Americas stronger than ever before","It ended the slave trade in Brazil","It handed the colonies over to Britain"),
    histLevel(1,"Manuela Sáenz fought for independence alongside which leader?","Simón Bolívar","George Washington","Toussaint Louverture","Napoleon Bonaparte"),
    histLevel(3,"Jonotas and Natan were enslaved women of African descent who rode with Manuela Sáenz, but historians know much less about them. Which best explains why?","Fewer records were kept about enslaved and working women","They lived a century before Manuela Sáenz","They chose not to take part in the wars","Their letters were written in a secret code that has never been read"),
    histLevel(3,"The US Constitution (1787) set up three branches of government that check each other. Whose idea does that follow?","Montesquieu’s","Edmund Burke’s","Napoleon’s","King Louis XVI’s")
  ],
  nationalism19:[
    histLevel(1,"What is a nation-state?","A country where most people share an identity and govern themselves","An empire that rules many different peoples from a faraway capital city","A city ruled by a bishop","A trading company with its own army"),
    histLevel(1,"In which year did revolutions break out in France, the German states, the Austrian Empire, and Italy?","1848","1776","1914","1688"),
    histLevel(1,"Which country was unified in 1871 under the leadership of Prussia?","Germany","Italy","Spain","Austria"),
    histLevel(2,"Who was the Prussian leader who unified Germany through a series of wars?","Otto von Bismarck","Giuseppe Garibaldi","Napoleon Bonaparte","Karl Marx"),
    histLevel(2,"Why do you and the other Red Shirts fight for Garibaldi?","To unite the Italian states into one country","To hand Sicily over to the Austrian Empire","To bring back the Roman emperors","To make the Italian states part of the French Empire"),
    histLevel(3,"Mazzini, an Italian nationalist, wrote (adapted): “God gave us a country when he gave us one language and one land.” What idea does this express?","People who share a language and homeland should form a nation","Kings receive their power from God","Italy should stay divided into small states, each with its own ruler","Language has little to do with a nation"),
    histLevel(3,"In 1862, Bismarck said (adapted) that the great questions would be settled “by iron and blood,” not by speeches. What did he mean?","Germany would be united through military power and war","Germany should be built by peaceful votes in a parliament","Iron factories would pay for new schools","Germans should stop trading with other nations"),
    histLevel(2,"How did the French Revolution and Napoleon help spread nationalism?","People began to see themselves as citizens of a nation, and some rose up against French rule","They convinced Europeans to forget their own languages and customs and become loyal French citizens","They made the Holy Roman Empire stronger","They gave power back to the old nobles"),
    histLevel(3,"Why was nationalism a danger to the Austrian Empire?","It ruled many peoples with different languages, and some wanted their own states","It had one language and one people, so nationalism made it too strong to govern","Its people wanted to join the United States, so they left the empire in large numbers","It had no army to defend its borders"),
    histLevel(2,"Most of the 1848 revolutions failed within two years. Which change from 1848 lasted?","Serfdom ended in the Austrian Empire","Germany became one country in 1848","The kings of Europe gave up their thrones","Italy became an empire"),
    histLevel(3,"The revolutions of 1848 reached beyond Europe. Which happened that year?","France ended slavery in its colonies","Japan opened its ports to American ships","The United States ended slavery","India won independence from Britain"),
    histLevel(3,"Which is an example of nationalism dividing people instead of uniting them?","A government forcing minority groups to give up their language","Writers collecting old folk tales in the language most people speak at home","Neighbors celebrating a shared holiday","A poet writing songs in the people’s language"),
    histLevel(2,"How did newspapers and schools help build nationalism?","They spread a common language and shared stories about the nation’s past","They taught every lesson in Latin","They kept news and new ideas from reaching ordinary people in the countryside","They were banned by most governments"),
    histLevel(1,"Which is an example of nationalism?","Italians celebrating their new united country in 1861","A merchant shipping spices from India to sell in London markets","A farmer selling grain at a market","A scientist studying the stars"),
    histLevel(2,"Looking back: why do we live in a world of nation-states today?","Nationalism spread, and many peoples formed their own countries","The Roman Empire created them","Every country was founded in 1848","The Mongols divided their empire into nations that still exist today")
  ],
  industrialRev:[
    histLevel(1,"In which country did the Industrial Revolution begin?","Britain","China","France","Russia"),
    histLevel(1,"What fuel powers the steam engines you work on?","Coal","Oil","Wind","Electricity"),
    histLevel(1,"James Watt is famous for what?","Improving the steam engine","Inventing the telephone","Building the first airplane","Discovering gravity"),
    histLevel(2,"Where did spinning and weaving move during the Industrial Revolution?","From homes and small workshops into factories","From factories back into people’s homes and small family farms","From Britain to Spain and Portugal","From villages into monasteries"),
    histLevel(2,"Manchester has grown quickly. Why are so many families moving here?","To find jobs in the new factories","To find cheap farmland near the city","To farm the land inside the city","To work at the royal court"),
    histLevel(3,"Which set of conditions best explains why industrialization began in Britain?","Coal and iron, money to invest, colonies and trade, and new inventions","Gold mines, a huge population of farmers, and a ban on foreign trade","Warm weather, few rivers, and a ruler who ran every business","A lack of colonies and trade, which forced Britain to make everything at home"),
    histLevel(3,"A French visitor wrote about Manchester in 1835 (adapted): “From this filthy drain, the greatest stream of human industry flows out to the whole world.” What two sides of the city does he describe?","Dirt and poor living conditions, but huge production and wealth","Clean streets and fresh air, but very little production or trade","Beautiful parks and almost no trade","Quiet farms and small villages"),
    histLevel(2,"The Liverpool and Manchester Railway opened in 1830. How did railways change life?","Goods and people moved faster and more cheaply over land","Travel became slower but much safer","Ships stopped carrying goods between countries, because trains were cheaper","Trains carried the king and his officials"),
    histLevel(3,"Manchester’s mills turn cotton into cloth. Where did much of that raw cotton come from by the 1830s?","Plantations in the US South, worked by enslaved people","Small family farms in northern England that grew cotton in the cool, rainy climate","Sheep farms in Scotland","Rice fields in China"),
    histLevel(3,"How did cheap British machine-made cloth affect hand-weavers in India in the 1800s?","Many lost work, because they could not match the low prices","They grew rich selling hand-woven cloth to the new British factories","They moved to Manchester to run the mills","They moved to Britain to teach weaving in the new mills"),
    histLevel(2,"What does “urbanization” mean?","The growth of cities as people move from the countryside","The building of new farms and villages out in the countryside","People moving from cities back to villages","Passing laws to protect factory workers"),
    histLevel(3,"Before industrialization, most work was powered by muscles, wind, and water. What was the biggest change?","Machines ran on coal, so far more goods could be made","People stopped using machines and returned to hand tools","Wind became the main source of power in factories","Animals did more of the work in cities"),
    histLevel(2,"Why were many of the first cotton mills built beside fast rivers?","Water wheels could power the machines","Rivers kept the mills cool in summer","Rivers protected the mills from fire","The law required mills to be near bridges"),
    histLevel(2,"Before factories, much cloth was made in the “putting-out” system. What was that?","Families spun and wove at home for merchants who brought them materials","Workers lived in cottages owned by the factory and paid rent to the owner every week","Farmers put their sheep out to graze","Merchants sold cloth door to door"),
    histLevel(3,"Historians call the Industrial Revolution a “global” change. Which evidence best supports this?","Raw materials came from around the world, and factory goods were sold worldwide","It changed how farmers in Britain grew wheat, but it had little effect on other lands","It ended trade between Europe and Asia","It happened in China first and then in Britain")
  ],
  egyptJapan:[
    histLevel(1,"Who ruled Egypt from 1805 and built factories and a modern army?","Muhammad Ali","Napoleon Bonaparte","Emperor Meiji","Iwasaki Yatarō"),
    histLevel(1,"In 1868, leaders in Japan returned power to the emperor and began rapid change. What is this called?","The Meiji Restoration","The Tokugawa Shogunate","The Opium War","The Glorious Revolution"),
    histLevel(1,"Which crop became Egypt’s most important export in the 1800s?","Cotton","Rice","Tea","Tobacco"),
    histLevel(2,"In 1853, American warships under Commodore Perry arrived in Japan. What did they demand?","That Japan open its ports to trade","That Japan give up its emperor","That Japan join the British Empire","That Japan stop building ships"),
    histLevel(2,"Japan’s new leaders used the slogan “Rich country, strong army.” What did it mean?","Build industry and a modern military to stay independent","Return to the old samurai way of life and close the ports again","Conquer Europe before Europe conquers Japan","Trade only with China and Korea"),
    histLevel(3,"Japan’s Charter Oath of 1868 said (adapted): “Knowledge shall be sought throughout the world.” Which action fits this promise?","Sending officials and students abroad to study Western industry and schools","Hiring foreign teachers but forbidding Japanese students to travel or read about other nations","Banning foreign books in Japan","Closing Japan’s ports to foreign ships"),
    histLevel(2,"Muhammad Ali sent you to study in Paris in 1826. Why did he send students to Europe?","To learn science, engineering, and languages to modernize Egypt","To recruit French officers and soldiers to lead his army in Egypt","To sell Egyptian cotton in Paris shops","To find a European king for Egypt"),
    histLevel(3,"Muhammad Ali’s factories struggled. Which best explains why?","Egypt lacked coal and skilled workers, and Britain pushed to end his control of trade","Egyptian workers were paid much more than European workers, so the factories lost money","Egypt grew no cotton for the mills","He closed them because he disliked machines"),
    histLevel(3,"In 1838, Britain and the Ottoman Empire signed a treaty that forced open markets, including Egypt’s. How did this hurt Egypt’s factories?","Cheap British goods flooded in, and Egypt could not protect its industry","It banned Egypt from growing cotton, so the mills had nothing to spin into cloth","It made Egypt pay Britain for each new factory","It made Egypt’s factories so big that Britain could no longer compete with them"),
    histLevel(2,"Iwasaki Yatarō started a shipping business that grew into which famous company?","Mitsubishi","Toyota","Sony","Honda"),
    histLevel(3,"The Meiji government built factories, then sold many of them to private businesses. What did this lead to?","Large family-run companies that led Japan’s industry","The end of all factories in Japan","Foreign companies from Britain and America owning most of Japan’s industry","Samurai taking over the factories"),
    histLevel(3,"Which is a similarity between industrialization in Egypt and Japan?","In both, the government led the push to build factories","Both were colonized by Britain before 1850 and ruled by British governors","Both banned foreign advisers","Both conquered Korea"),
    histLevel(3,"Which describes a key difference by 1900?","Japan had become an industrial power, while Egypt fell into debt and under British control","Egypt had defeated Russia in a war, while Japan had become a British colony with no factories","Egypt built railways, while Japan built none","Japan grew cotton for Egypt’s mills"),
    histLevel(2,"In 1869, a canal opened in Egypt linking the Mediterranean Sea and the Red Sea. What was it?","The Suez Canal","The Panama Canal","The Grand Canal","The Erie Canal"),
    histLevel(1,"Before 1853, Japan’s rulers kept contact with foreigners very limited. Who held power in Japan then?","The Tokugawa shoguns","British governors","The Ming emperors","The Meiji emperor’s prime minister")
  ],
  workingClass:[
    histLevel(1,"What did Marx call the class of workers who sell their labor for wages?","The proletariat","The bourgeoisie","The nobility","The clergy"),
    histLevel(1,"What is a labor union?","A group of workers who join together to bargain for better pay and conditions","A club of factory owners who agree together on what prices to charge for their goods","A bank that lends money to factories","A school for engineers"),
    histLevel(1,"What is a strike?","Workers stopping work together to demand changes","Owners closing a factory to move it to a cheaper town","A machine breaking down","A vote for parliament"),
    histLevel(2,"In capitalism, who mostly owns factories and businesses?","Private owners and investors, who aim to make a profit","The workers, who share the profits equally among themselves","The Church and its bishops","The king and his ministers"),
    histLevel(2,"What change did socialists want?","Workers or the public to share ownership of factories and resources","Factory owners to keep the profits so they can build more factories","Children to work longer hours","Kings to own the factories"),
    histLevel(3,"In 1848, Marx and Engels wrote (adapted): “Workers of the world, unite!” What were they calling for?","Workers everywhere to join together against the owners","Workers to obey their employers","Each nation’s workers to fight the workers of other nations","Workers to move to America"),
    histLevel(3,"In 1832, a young mill worker told a British committee (adapted): “We worked from six in the morning until nine at night and were punished if we fell behind.” What would reformers use this to argue?","Laws were needed to limit children’s working hours","Factories needed more child workers","Children should work at night instead","Schools should close so that children can work longer in the mills"),
    histLevel(2,"Between 1811 and 1816, some English cloth workers called Luddites broke machines. Why?","Machines were taking their jobs and lowering their pay","They wanted the factories to run faster","The government paid them to test whether the new machines were safe","They wanted to sell the machines’ metal for scrap"),
    histLevel(3,"You sew collars at home and are paid for each piece. Why is it hard for home workers like you to organize?","Home workers are spread out and rarely meet each other","Home workers earn too much to need a union","Home workers were protected by law from working long hours at night","Sewing machines were against the law"),
    histLevel(3,"Women factory workers in the 1800s often faced what extra problem?","They were paid less than men and still did most of the housework","They earned more than men, so the men refused to work beside them","They were not allowed to work at all","They had shorter workdays than men"),
    histLevel(2,"In the 1880s, Bismarck set up health and accident insurance for German workers. Why?","To win workers’ support and weaken the socialists","Because socialists controlled the German government at the time","To punish the factory owners","Because workers had won a revolution"),
    histLevel(3,"Which best describes the “pyramid” of industrial society?","A few rich owners at the top, a middle class, and many workers at the bottom","Many rich owners at the top, a few workers in the middle, and kings at the bottom","Workers at the top and owners at the bottom","Every class is equal in size"),
    histLevel(2,"On an assembly line, how is the work divided?","Each worker does one small step over and over","One worker builds the whole product","Machines do each step with no workers","Workers vote each morning on what the factory will make that day"),
    histLevel(3,"Which claim about workers’ responses to industrial life is best supported?","Workers responded in many ways: unions, strikes, new parties, and reform laws","Workers mostly left the factories and went back to farming in the countryside, where pay was higher","Workers accepted their conditions without protest","Workers asked for longer hours"),
    histLevel(1,"Who wrote The Communist Manifesto with Friedrich Engels?","Karl Marx","Adam Smith","Otto von Bismarck","Robert Owen")
  ],
  reformMovements:[
    histLevel(1,"What was the goal of abolitionists?","To end slavery","To end factory work","To stop women from voting","To bring back kings"),
    histLevel(1,"In 1893, which country became the first self-governing nation where women could vote in national elections?","New Zealand","The United States","Britain","France"),
    histLevel(1,"In 1848, where did reformers meet to demand rights, including the vote, for women in the United States?","Seneca Falls, New York","Gettysburg, Pennsylvania","Boston, Massachusetts","Charleston, South Carolina"),
    histLevel(2,"What did Britain’s Factory Act of 1833 do?","Banned young children from textile mills and limited hours for older children","Gave factory workers the right to vote in national elections and run for Parliament","Closed the cotton mills","Raised wages for adult workers"),
    histLevel(2,"You helped start the Philadelphia Female Anti-Slavery Society in 1833. What did groups like yours do?","Raised money, signed petitions, and spread anti-slavery writing","Bought plantations so that they could run them more kindly","Ran their own candidates for president and Congress in every election","Built factories in the South"),
    histLevel(3,"One theory says slavery ended mainly because of moral and religious arguments. Which evidence supports that theory?","Quakers and other religious groups led early campaigns against the slave trade","Enslaved people in Haiti won their freedom by fighting a long war against France","Sugar from slave plantations became less profitable","Factory owners wanted free workers who could buy goods"),
    histLevel(3,"Another theory says enslaved people’s own resistance helped end slavery. Which evidence best supports this?","Revolts in Haiti and Jamaica made slavery harder and costlier to keep","Quakers sent petitions to Parliament asking it to end the slave trade","Factories made cloth more cheaply","Women in New Zealand signed petitions asking for the right to vote"),
    histLevel(3,"A third theory says economic changes mattered. Which evidence fits that theory?","Some British leaders argued free workers and free trade would earn more profit","Frederick Douglass spoke across the North about his own escape from slavery","Enslaved people in Jamaica rose up in 1831 and demanded wages and their freedom","Quaker meetings declared slavery a sin"),
    histLevel(2,"Frederick Douglass escaped slavery and became famous for what?","Speaking and writing powerfully against slavery","Leading the Haitian Revolution","Writing the Declaration of Independence in Philadelphia","Inventing the cotton gin"),
    histLevel(2,"In which year did the 13th Amendment end slavery in the United States?","1865","1776","1807","1920"),
    histLevel(3,"Olaudah Equiano wrote a book (1789) about being kidnapped as a child in Africa and sold into slavery. Why was it powerful for abolitionists?","It told the truth of slavery from someone who lived through it","It was written by a slave-ship captain who defended the trade as good business","It was a novel with made-up characters","It argued slavery helped the economy"),
    histLevel(2,"Why did many reformers want to end child labor?","Children were hurt in dangerous mills and missed school","Children were paid more than adults","Factories had too few workers","Children asked to work longer hours so their families could buy more goods"),
    histLevel(3,"How did industrialization help lead to reform movements?","Factory problems were easy to see, and a growing middle class had newspapers and time to organize","Factories ended poverty in cities, so there was little left to fix and people turned to other causes","Kings ordered their subjects to form reform groups","Industry ended slavery right away"),
    histLevel(3,"Many women who fought slavery, like you, later worked for women’s right to vote. Which best explains this link?","Abolition taught women to organize and showed them they were denied rights too","Abolition leaders paid women to start voting campaigns after slavery ended in the United States","Women were paid to join both movements","Voting was needed to free enslaved people"),
    histLevel(1,"Which was the last country in the Americas to end slavery, in 1888?","Brazil","Haiti","Mexico","Canada")
  ],
  newImperialism:[
    histLevel(1,"What drug were British merchants selling illegally in China in the 1830s?","Opium","Tea","Silk","Tobacco"),
    histLevel(1,"At the Berlin Conference (1884–1885), European leaders divided which continent among themselves?","Africa","South America","Australia","Europe"),
    histLevel(1,"After the First Opium War, China had to hand which island over to Britain?","Hong Kong","Taiwan","Singapore","Sri Lanka"),
    histLevel(2,"You wrote to Queen Victoria (adapted): “You do not allow opium to harm your own people. Why sell it to ours?” What is your main argument?","Britain is harming China with a drug it bans at home","China wants to buy more opium from Britain at a lower price","Britain should sell tea to China instead","China should join the British Empire"),
    histLevel(2,"Why did industrial nations want colonies in the late 1800s?","To get raw materials like rubber and cotton, and markets for factory goods","To find land for wheat because Europe’s farms had stopped growing enough food","To send away their extra coal and iron","To end the slave trade in Europe"),
    histLevel(3,"Which tools of industry made it easier for Europeans to take over much of Africa and Asia?","Steamships, railways, telegraphs, malaria medicine, and machine guns","Sailing ships, swords, and the compass, which Europeans had just invented","Paper money and printing","Horses and chariots"),
    histLevel(3,"Many imperialists claimed it was their duty to “civilize” the peoples they ruled; a famous 1899 poem urged this. How did they justify empire, and why was that reasoning wrong?","They claimed to be superior to the peoples they ruled; this was racist and false, and it hid conquest for profit","They said colonized peoples had asked to be ruled by Europe, and most historians today agree that this claim was true","They said empire cost them money, which is why few nations wanted colonies","They said trade would be equal for both sides, and it was"),
    histLevel(2,"What does “economic imperialism” mean?","Controlling a country’s trade and money without fully ruling it","Ruling a colony directly with soldiers, governors, and new laws","Buying and selling goods at a local market","A country building its own factories"),
    histLevel(3,"After the Opium Wars, British citizens in China were judged in British courts, not Chinese ones. Why did the Chinese call these treaties “unequal”?","China was forced to give up rights and got nothing in return","China gained more land and ports than Britain did from the treaties","The treaties were written in Chinese alone","Britain paid China for Hong Kong"),
    histLevel(2,"By 1914, which two African countries were still independent?","Ethiopia and Liberia","Egypt and Kenya","Nigeria and Ghana","South Africa and Congo"),
    histLevel(3,"Jomo Kenyatta, who later led independent Kenya, told a fable (1938) about an elephant who asks to shelter in a man’s hut, pushes the man out, and then has a committee of animals rule in its favor. What is the fable criticizing?","Colonizers taking African land and setting up unfair systems to keep it","Farmers who refuse to share their huts with animals that need shelter during storms","Elephants damaging crops","Kenyan kings who taxed their people"),
    histLevel(2,"Which Asian country also built an empire, taking Taiwan in 1895 and Korea in 1910?","Japan","China","India","Thailand"),
    histLevel(3,"A famous 1892 cartoon showed Cecil Rhodes, a British businessman, standing over Africa with one foot in Cairo and one in Cape Town. What does it suggest?","Britain wanted to control Africa from north to south","Britain planned to leave Africa","Egypt and South Africa had united against Britain","Britain wanted to share Africa equally with Africans"),
    histLevel(3,"How was industrial imperialism different from empire building in the First Global Age?","Factories needed huge amounts of raw materials, and new technology let a few nations seize most of Africa","Europeans had never built overseas empires before 1850, so every colony after that was the first of its kind","Empires stopped using armies","Spain and Portugal ruled most of Africa"),
    histLevel(1,"What is a colony?","A land ruled by a distant country","A city-state ruled by its own king and council","A ship that trades between ports","A factory that makes cloth")
  ],
  resistColonial:[
    histLevel(1,"What sacred object did a British governor demand from the Asante in 1900?","The Golden Stool","The Peacock Throne","A gold mine","The king’s palace"),
    histLevel(1,"In 1857, who began a large uprising against the British East India Company?","Indian soldiers called sepoys","Chinese sailors in British ships","French troops","Asante farmers"),
    histLevel(1,"Which African country defeated an Italian army at the Battle of Adwa in 1896?","Ethiopia","Egypt","Kenya","Morocco"),
    histLevel(2,"Why do you call the Asante to fight in 1900?","To defend the Golden Stool and the Asante people’s freedom","To help the British find the Golden Stool and end the fighting quickly","To win a gold mine for your own family","To join the uprising in India"),
    histLevel(2,"What sparked the 1857 uprising among the sepoys?","Rumors that new cartridges were greased with fat offensive to Hindus and Muslims","A new law that let sepoys vote for the British Parliament and run for office there","A new tax on salt and tea that the Company collected from soldiers’ pay each month","A drop in the price of Indian cotton"),
    histLevel(3,"Historians say the 1857 uprising had deeper causes than the cartridges. Which is one?","The Company had taken over Indian kingdoms and disrespected local customs","Indian soldiers were paid much more than the British soldiers who served with them","The Mughal emperor had ordered an attack","Britain had banned trade with India"),
    histLevel(3,"What was one result of the 1857 uprising?","The British government took direct control of India from the Company","India became independent from Britain and chose a new emperor","The Mughal Empire grew stronger and took back control of Delhi and Bengal","Britain left India"),
    histLevel(2,"Who was the rani (queen) of Jhansi who fought the British in 1857–1858?","Lakshmibai","Yaa Asantewaa","Manuela Sáenz","Victoria"),
    histLevel(3,"The rebels of 1857 named the elderly Mughal emperor, Bahadur Shah Zafar, as their leader. Why?","He was a symbol that could unite Hindus and Muslims against Company rule","He commanded the strongest and best-trained army in all of northern India","The British had chosen him to lead","He had planned the uprising for years"),
    histLevel(3,"A motive is why people act; a goal is what they hope to achieve. Which is a goal of the 1857 rebels?","To drive out the Company and restore Indian rulers","Anger at the Company’s disrespect for their religions","Fear of losing their land","Resentment of high taxes"),
    histLevel(2,"The Indian National Congress, founded in 1885, resisted British rule in what way?","Through meetings, petitions, and newspapers asking for a bigger voice for Indians","Through an armed uprising led by sepoys who wanted to bring back the Mughal emperor","By joining the British army and fighting in its wars overseas in very large numbers","By moving to Africa"),
    histLevel(3,"Which best explains why Ethiopia stayed independent when most of Africa was colonized?","Menelik II built a strong army with modern rifles and united the country","Europeans did not know where Ethiopia was","Italy gave Ethiopia to Britain","Ethiopia had no land, gold, or other resources that any European nation wanted"),
    histLevel(3,"Which claim about the War of the Golden Stool (1900) is best supported?","The British won, but they never captured the Golden Stool, which the Asante still honor","The British captured the Golden Stool and took it to London, where it can still be seen today","The Asante won and drove the British out","The war never happened"),
    histLevel(2,"Which is an example of nonviolent resistance to colonial rule?","Writing newspapers and petitions that demand self-rule","The Battle of Adwa","The 1857 uprising","Leading soldiers into battle to defend the Golden Stool"),
    histLevel(2,"Looking back: which stayed the same from the First Global Age to the long nineteenth century?","European powers built empires overseas, and people resisted them","The Aztec and Inca Empires still ruled their lands in the Americas","Africa had no contact with Europe","Most people lived in large cities")
  ]
};
/* ---------- end of History Unit 7 ---------- */
/* ---------- History Unit 8: Global Conflict (1914 to 1991 CE), Oct 28 2026 (docs/HISTORY-UNIT8.md) ----------
   Khan's practice exercises, in order (checked on khanacademy.org, Oct 28 2026). 8.7 The Holocaust is a hard lesson:
   gate (a grown-up previews it with the PIN) and quiet (no celebration, no arcade minutes), with no role card (docs/HARD-LESSONS.md). */
const HISTORY_UNIT8 = [
  {id:'wwiCauses',name:"Causes of the First World War",lesson:"World War I (1914–1918) grew from four long-term causes, remembered as MAIN: militarism, alliances, imperialism, and nationalism. The spark was the killing of Archduke Franz Ferdinand in Sarajevo in June 1914, and the alliances pulled the great powers in."},
  {id:'wwiTotalWar',name:"The First Total War",lesson:"In a total war, a country puts its whole society to work for the war: factories, farms, women workers, colonies, and propaganda. World War I was fought in trenches, at sea, and across empires, with new weapons like machine guns, poison gas, tanks, and airplanes."},
  {id:'worldRemade',name:"A World Remade",lesson:"The Treaty of Versailles (1919) blamed Germany, took its land and colonies, made it pay reparations, and set up the League of Nations. Old empires broke apart, Britain and France took over Ottoman Arab lands, and revolutions remade Russia and Mexico."},
  {id:'interwarIdeologies',name:"Interwar Ideologies",lesson:"The Great Depression (from 1929) left millions out of work. In some countries people turned to fascism: one all-powerful leader, extreme nationalism, no rival parties, and violence against opponents. Mussolini in Italy and Hitler in Germany took power this way, while the League of Nations tried to keep the peace."},
  {id:'secondWorldWar',name:"The Second World War",lesson:"World War II (1939–1945) began after appeasement failed to stop the aggression of Germany, Italy, and Japan. The Allies, including Britain, the Soviet Union, the United States, and China, defeated the Axis. More than 70 million people died, most of them civilians, and the war in Asia ended after U.S. atomic bombs struck Hiroshima and Nagasaki."},
  {id:'holocaust',name:"The Holocaust",gate:true,quiet:true,lesson:"The Holocaust was the Nazi German state’s planned murder of about six million Jewish people. It began with laws that took away Jewish people’s rights and grew into mass murder during the war; Roma, disabled people, and others were also murdered. Most countries did too little to help, but rescuers like Chiune Sugihara saved lives, and Nazi leaders were later put on trial."},
  {id:'coldWar',name:"The Cold War",lesson:"After 1945, the United States (democracy and capitalism) and the Soviet Union (communism and one-party rule) became rival superpowers. They never fought each other directly, but they raced to build nuclear weapons and reach space and backed opposite sides in wars like Korea and Vietnam. The Cold War ended when the Soviet Union broke apart in 1991."},
  {id:'decolonization',name:"Decolonization",lesson:"After World War II, most colonies in Asia and Africa won independence, some mainly through nonviolent protest (India, Ghana) and some through long wars (Vietnam, Algeria). The superpowers competed for the new nations, and many joined the Non-Aligned Movement to stay out of either side."}
];
/* Khan's lessons 8.1 to 8.9, each its own block with its videos, and Khan's three quizzes: Quiz 1 after 8.3, Quiz 2 after 8.5,
   Quiz 3 after 8.7; the unit test comes after 8.9 (docs/HISTORY-UNIT8.md). */
const HISTORY_GROUPS8 = [
  {id:'overview8',name:'Century of Conflict | 8.1',noQuiz:true,skills:[],learn:'What caused the global conflicts from 1914 to 1991, and how did people live through them? Two world wars, a long Cold War, and the end of colonial empires shaped the century.'},
  {id:'causes8',name:'Causes of the First World War | 8.2',noQuiz:true,skills:['wwiCauses'],learn:'Militarism, alliances, imperialism, and nationalism built up the danger. One assassination in Sarajevo in 1914 set it off.'},
  {id:'totalWar8',name:'The First Total War | 8.3',quizName:'Quiz 1',quizSkills:['wwiCauses','wwiTotalWar'],skills:['wwiTotalWar'],learn:'World War I put whole societies to work. Soldiers, nurses, factory workers, and people in the colonies all lived through it in different ways.'},
  {id:'remade8',name:'A World Remade | 8.4',noQuiz:true,skills:['worldRemade'],learn:'The peace treaties redrew the map, empires fell, and revolutions changed Russia and Mexico.'},
  {id:'interwar8',name:'Interwar Ideologies | 8.5',quizName:'Quiz 2',quizSkills:['worldRemade','interwarIdeologies'],skills:['interwarIdeologies'],learn:'The Great Depression and anger over the peace helped extreme ideas like fascism grow between the wars.'},
  {id:'ww2War8',name:'The Second World War | 8.6',noQuiz:true,skills:['secondWorldWar'],learn:'Aggression by Germany, Italy, and Japan and the failure of appeasement led to a second, even deadlier world war.'},
  {id:'holocaust8',name:'The Holocaust | 8.7',quizName:'Quiz 3',quizSkills:['secondWorldWar','holocaust'],skills:['holocaust'],learn:'How did the world respond to Nazi crimes? Study the sources about the people who were persecuted, the people who helped, and the countries that turned refugees away.'},
  {id:'coldWar8',name:'The Cold War | 8.8',noQuiz:true,skills:['coldWar'],learn:'After 1945 the United States and the Soviet Union competed around the world without fighting each other directly.'},
  {id:'decolon8',name:'Decolonization | 8.9',noQuiz:true,skills:['decolonization'],learn:'Colonies in Asia and Africa won independence, and the Cold War pulled on the new nations.'}
];
/* History Unit 8 bank (Oct 28, 2026; docs/HISTORY-UNIT8.md): role play (none in 8.7), plausible wrong answers, adapted sources in every lesson. */
const HISTORY8_QUESTIONS = {
  wwiCauses:[
    histLevel(1,"A reader asks whose killing on June 28, 1914, set off the war. What do you say?","Archduke Franz Ferdinand","Kaiser Wilhelm II of Germany","Tsar Nicholas II of Russia","King Peter I of Serbia"),
    histLevel(1,"Historians remember four long-term causes of the war with the letters MAIN. What do they stand for?","Militarism, alliances, imperialism, nationalism","Monarchy, armies, industry, navies","Migration, agriculture, inflation, and newspapers","Money, artillery, invasions, neutrality"),
    histLevel(1,"In 1914, Britain, France, and Russia were on one side. What was the other side, led by Germany and Austria-Hungary, called?","The Central Powers","The Axis Powers","The Warsaw Pact","The Triple Entente"),
    histLevel(2,"The young man who fired the shots belonged to a group that wanted Bosnia’s South Slavs to join Serbia. Which cause of war does this show?","Nationalism","Militarism","Imperialism","Industrialization"),
    histLevel(2,"Germany and Britain are racing to build bigger battleships, and generals have detailed plans ready for war. Which cause of war is this?","Militarism","Nationalism","Alliances","Appeasement"),
    histLevel(2,"Britain, France, and Germany have been competing for colonies in Africa and Asia. Which cause of war is this?","Imperialism","Militarism","Isolationism","Communism"),
    histLevel(2,"After Austria-Hungary declares war on Serbia, Russia, Germany, France, and Britain join within days. Why?","Alliances and war plans pulled each great power in","Serbia attacked each of them in the same week","The League of Nations ordered them to join","They had agreed to divide up Serbia’s colonies among themselves"),
    histLevel(3,"Britain’s foreign secretary, Sir Edward Grey, said in August 1914 (adapted): “The lamps are going out all over Europe; we shall not see them lit again in our lifetime.” What did he mean?","He feared a long war that would change Europe for good","He was warning about a shortage of oil for the city’s street lamps","He expected a short war that would be over by Christmas","He was celebrating that Britain would win quickly"),
    histLevel(3,"In July 1914, Germany told Austria-Hungary it would back it no matter what. Historians call this the “blank check.” Why did it matter?","It made Austria-Hungary bolder in its threats to Serbia","It meant Britain would stay out of the war","It ended the alliance between Germany and Austria-Hungary","It forced Serbia to give up its army"),
    histLevel(3,"Austria-Hungary’s ultimatum to Serbia (July 1914, adapted) demanded that Austro-Hungarian officials help run the investigation inside Serbia. Serbia accepted most demands but refused this one. Why?","It would let a foreign power act inside Serbia and weaken its independence","Serbia had no police force that could run an investigation","The demand was written in German, a language Serbian officials were unable to read","Serbia had already joined the Central Powers"),
    histLevel(3,"Why do historians call World War I a global war, even though much of the fighting was in Europe?","Empires brought in soldiers, workers, and fighting from around the world","Most of the battles were fought in Africa and South America","It began with a Japanese attack in the Pacific and then spread west into Europe","It was the first war fought only at sea"),
    histLevel(2,"Before 1914, Austria-Hungary and the Ottoman Empire ruled many different peoples. Why did this make war more likely?","Groups inside them wanted nations of their own, causing unrest","They had just defeated Britain and France in a long and costly war","Their many peoples spoke a single shared language","They had given up their armies after 1900"),
    histLevel(1,"In what year did World War I begin?","1914","1939","1917","1905"),
    histLevel(3,"A historian studies World War I using the networks frame. Which question fits that frame?","How did alliances and empires link countries and spread the war?","Who made the weapons, and who profited from selling them to armies?","How did families in one French village get through the war years?","In what year did the fighting finally stop?"),
    histLevel(3,"One historian argues Germany was most to blame for the war. Another argues the great powers shared the blame. What should a careful historian do?","Weigh the evidence about each country’s choices before deciding","Pick the view of the more famous historian","Accept whichever of the two views was published first in a book","Decide that nobody’s choices caused the war")
  ],
  wwiTotalWar:[
    histLevel(1,"Many of your patients come from long ditches the armies dug along the front line. What were these called?","Trenches","Bunkers","Canals","Tunnels"),
    histLevel(1,"A visitor asks what a “total war” is. What do you say?","A war where a country uses its whole society and economy to fight","A war fought by professional soldiers while life at home stays the same","A war that ends in a single big battle","A war fought between just two countries on one small battlefield"),
    histLevel(2,"At home, many British women took jobs making shells for the army. Why?","Men had left for the front, and the war needed huge amounts of weapons","Women were required by law to join the army","Factories had closed and needed new owners","The government had passed a law banning men from working in any factory"),
    histLevel(2,"Which new weapons made World War I so deadly?","Machine guns, poison gas, and heavy artillery","Atomic bombs, jet fighters, and guided rockets","Muskets loaded one shot at a time","Radar and computers"),
    histLevel(2,"Why did the Western Front barely move for years?","Trenches, barbed wire, and machine guns made attacks very costly","Both armies signed an agreement to stop fighting until the year 1918","Soldiers refused to leave their trenches","Snow covered the battlefield year-round"),
    histLevel(1,"Which country joined the Allies in 1917 after German submarines attacked its ships?","The United States","Japan","Italy","The Ottoman Empire"),
    histLevel(2,"Japan joined the Allies in 1914. What did it gain from the war?","German colonies and bases in China and the Pacific","Control of the Suez Canal","Land in the American Southwest that Germany had promised it","Most of India from Britain"),
    histLevel(3,"An Indian soldier in France wrote home in 1915 (adapted from letters collected by British army censors): “This is not war. It is the ending of the world.” What does this source show?","Soldiers from the colonies fought in Europe and were shocked by the war","Indian soldiers stayed in India for the whole war","The war in France was short and easy for soldiers who came from the colonies","Indian soldiers were not allowed to write home"),
    histLevel(3,"Why must historians be careful when they use letters like that one?","Army censors read them, so soldiers may not have written everything","They were written long after the war ended","They were written by newspaper reporters who pretended to be soldiers","They were written in code that no one has broken"),
    histLevel(3,"Helen Fairchild, an American nurse, worked at a hospital close to the front in 1917 and died there in early 1918 after falling ill. What does her story show about total war?","Women who were not soldiers also served near the front and faced danger","Nurses were kept in safe hospitals far away in their own home countries","Women were kept out of the war","The war was mostly over by 1917"),
    histLevel(3,"Rosa Luxemburg, a socialist in Germany, spoke out against the war and was sent to prison. What does her story show?","Some people opposed the war, and governments punished them","Germans agreed that the war was a good idea","Germany let critics protest freely and printed their speeches in newspapers","Socialists were in charge of the German army"),
    histLevel(3,"A British poster shows an officer pointing at the reader with the words “Join your country’s army!” Why did governments make posters like this?","To build support and recruit soldiers for the war","To advertise new jobs in other countries","To warn young men to stay home and avoid joining the army","To sell tickets to war films"),
    histLevel(2,"How was the Eastern Front different from the Western Front?","It moved more, with armies advancing and retreating over long distances","It was fought mostly by ships in the North Sea","It stayed locked in the same trenches across northern France from 1914 to 1918","It was fought between Britain and the United States"),
    histLevel(2,"How did the fighting in World War I stop in November 1918?","Germany, worn out and short of food, signed an armistice","Germany captured Paris and won the war","The Treaty of Versailles was signed on the very same day as the ceasefire","Russia defeated Germany on the Eastern Front"),
    histLevel(1,"Which Allied country fought Austria-Hungary high in the mountains of the Alps?","Italy","Spain","Japan","Sweden")
  ],
  worldRemade:[
    histLevel(1,"Readers ask which treaty with Germany was signed at the peace conference in 1919. What do you say?","The Treaty of Versailles","The Treaty of Westphalia","The Munich Agreement","The Treaty of Tordesillas"),
    histLevel(1,"Which new organization did the peace plan create to settle arguments between nations?","The League of Nations","The United Nations","NATO","The Congress of Vienna"),
    histLevel(2,"Article 231 of the treaty (adapted) said Germany and its allies were responsible for the loss and damage of the war. What did this lead to?","Germany had to pay large reparations and felt humiliated","Germany received money from France","Germany joined the League of Nations right away","Germany was given new colonies in Africa to make up for its losses"),
    histLevel(2,"U.S. President Woodrow Wilson proposed the Fourteen Points. Which idea was one of them?","Self-determination: peoples choosing their own governments","Splitting Germany into four zones run by the winning countries","Building a wall across Berlin","Letting each winner keep the land it had taken"),
    histLevel(3,"Wilson spoke of self-determination, yet most colonies in Africa and Asia did not get independence in 1919. How did many colonized people react?","They felt let down, and independence movements grew stronger","They were satisfied with the treaty and dropped their demands for freedom","They moved to Europe to work for the League","They declared war on the United States"),
    histLevel(2,"During the war, Britain and France secretly agreed to divide the Ottoman Empire’s Arab lands between them. What was this deal called?","The Sykes-Picot Agreement","The Balfour Declaration","The Treaty of Versailles","The Treaty of Brest-Litovsk"),
    histLevel(3,"Britain had also told Arab leaders they would get independence if they revolted against the Ottomans. Why did many Arabs feel betrayed after the war?","Their lands became British and French mandates instead","The Ottoman Empire won the war in the Middle East and kept its lands","Britain gave Arabia to Germany","The League made them join the Soviet Union"),
    histLevel(3,"Britain’s Balfour Declaration (1917, adapted) supported “a national home for the Jewish people” in Palestine while protecting the rights of the people already living there. Why did it lead to conflict later?","Arab and Jewish communities both had hopes for the same land","It handed control of Palestine to France as part of the Sykes-Picot deal","It was cancelled the next week","It moved the Arab people of Palestine to Egypt"),
    histLevel(2,"In 1917, Russian workers and soldiers were tired of war and hunger. Which slogan did Lenin’s Bolsheviks use to win their support?","Peace, land, and bread","Liberty, equality, fraternity","Blood and iron","No taxation without representation"),
    histLevel(3,"After the Bolsheviks took power, what did Russia do?","It left the war and set up a communist state, later the Soviet Union","It joined Germany and Austria-Hungary in a brand-new attack on France and Britain","It elected a new tsar","It became a colony of Britain"),
    histLevel(2,"The Mexican Revolution (1910–1920) was fought partly over land. What did leaders like Emiliano Zapata demand?","Land returned to poor farmers and villages","A new king for Mexico","Rule by Spain again","Bigger estates for the wealthy landowners and their families"),
    histLevel(3,"How were the Mexican and Russian Revolutions alike?","Both grew from poor people’s anger over land and power","Both brought back a monarchy","Both happened because World War II had left the countries in ruins","Both turned their countries into colonies"),
    histLevel(3,"Some writers after the war were called a “lost generation.” Why?","Many young people felt the war had destroyed their hopes and beliefs","They had moved to colonies in Asia and Africa","They refused to write about the war","They were too young to remember any of the fighting from the war years"),
    histLevel(2,"Which empires broke apart because of World War I?","Austria-Hungary, the Ottoman Empire, and the Russian Empire","The British Empire, the French Empire, and the Empire of Japan","The Mughal and Ming Empires","The Roman and Han Empires")
  ],
  interwarIdeologies:[
    histLevel(1,"In 1929, the U.S. stock market crashed. Listeners ask what worldwide crisis followed. What do you say?","The Great Depression","The Cold War","The Industrial Revolution","The Dust Bowl"),
    histLevel(1,"Who led the Fascist Party in Italy and took power in 1922?","Benito Mussolini","Adolf Hitler","Joseph Stalin","Francisco Franco"),
    histLevel(2,"Which best describes fascism?","One all-powerful leader, extreme nationalism, and no rival parties","Free elections with many parties and a free press","Workers sharing ownership of farms and factories","Rule by a king or queen who shares power with an elected parliament"),
    histLevel(2,"Why did many Germans support the Nazis in the early 1930s?","The Depression left millions jobless, and the Nazis promised jobs and national pride","The Nazis promised to pay even more reparations to France and Britain for the next fifty years","Germany had just won World War I","The Nazis promised to give up Germany’s army"),
    histLevel(2,"In January 1933, how did Hitler become chancellor of Germany?","He was appointed after the Nazis became the largest party in elections","He led a large private army that marched in and captured Berlin by force","He was chosen by the League of Nations","He was born into Germany’s royal family"),
    histLevel(3,"Once in power, how did the Nazis turn Germany into a dictatorship?","They banned other parties, took over the press, and used terror against opponents","They let independent courts and a free press check and overrule Hitler’s decisions","They held free elections each year","They shared power with the Communists"),
    histLevel(3,"Mussolini wrote (paraphrased, 1932) that the state is everything and a person matters as part of the state. Which feature of fascism does this show?","The state controls people’s lives instead of protecting their rights","People can freely criticize their government","Power is shared among many parties chosen in free and fair elections","Each region rules itself"),
    histLevel(2,"Between the wars, which idea did the League of Nations stand for?","Internationalism: nations working together to keep peace","Isolationism: staying out of world affairs","Imperialism: building bigger empires by conquest of others","Fascism: one leader ruling by force"),
    histLevel(3,"Why did the League of Nations fail to stop aggression in the 1930s?","It had no army, and the United States never joined","It had the strongest army in the world","It was run by Germany and Italy, who used it to plan their attacks","It had broken up before 1930"),
    histLevel(3,"From 1939, Thailand’s prime minister, Plaek Phibunsongkhram, issued rules on how people should dress and speak and promoted a national dish, pad thai. Which interwar idea does this show?","A nationalist leader using culture to unite and control people","A king giving his power to elected leaders","A colony in Southeast Asia winning its freedom from British and French rule","Communism taking over farms"),
    histLevel(2,"From 1911 to 1949, which two groups fought for control of China?","The Nationalists (Guomindang) and the Communists","The emperors of the Ming dynasty and the Qing dynasty","The British and the French","Japan and Korea"),
    histLevel(3,"Why did Mussolini’s Italy and Hitler’s Germany become allies in the 1930s?","Both were fascist states that wanted to expand by force","Both had lost World War I and wanted to stay out of new wars","Both were communist states","Both were ruled by the League of Nations"),
    histLevel(1,"What is propaganda?","Information spread to push people toward one view","A secret police force","A kind of election","A trade agreement signed between two or more countries"),
    histLevel(3,"A historian says fascism grew out of a crisis. Which context best supports this?","War losses, anger over the peace, and the Depression made people want strong leaders","Europe was peaceful and rich, and nearly everyone had a good, steady job in the 1930s","Most countries had just become democracies with few problems","The League of Nations had banned elections")
  ],
  secondWorldWar:[
    histLevel(1,"Your neighbors ask which event started World War II in Europe in September 1939. What do you say?","Germany invaded Poland","Japan attacked Pearl Harbor","Germany invaded the Soviet Union","Italy invaded Ethiopia"),
    histLevel(1,"What was appeasement?","Giving in to an aggressive country’s demands to avoid war","Forming an alliance with friendly countries to attack an enemy first","Paying workers during a depression","Sending troops to defend a neighbor"),
    histLevel(2,"After the Munich Agreement in 1938, Britain’s prime minister, Neville Chamberlain, said (adapted): “I believe it is peace for our time.” What happened next?","Germany took the rest of Czechoslovakia and then invaded Poland","Germany gave up its army and rejoined the League of Nations the next year","Peace in Europe lasted twenty years","Britain declared war that same day"),
    histLevel(1,"Which countries led the Axis?","Germany, Italy, and Japan","Britain, France, and the Soviet Union","The United States, China, and Britain","Spain, Sweden, and Switzerland"),
    histLevel(2,"Why did the United States enter the war in December 1941?","Japan attacked the U.S. naval base at Pearl Harbor","Germany invaded Mexico","Britain asked it to free Poland from Germany right away","The Soviet Union attacked Alaska"),
    histLevel(2,"Your factory switched from making cars to making tanks and planes, and millions of women took factory jobs. What does this show?","Total war again put whole economies to work for victory","The Great Depression got worse during the war years in the U.S.","Women were kept out of war work","Factories closed because of the war"),
    histLevel(3,"In December 1940, a year before the U.S. was fighting, President Franklin Roosevelt said (adapted): “We must be the great arsenal of democracy.” What did he mean?","The U.S. would make weapons and supplies for the countries fighting the Axis","The U.S. would send its army to Germany at once","The U.S. would stay neutral and keep trading with every side in the war equally","The U.S. would build a wall along its coasts"),
    histLevel(3,"Which piece of evidence best supports the claim that World War II was even more of a total war than World War I?","Civilians made up most of the dead, from bombing, hunger, and mass killing","It ended with an armistice in November","Soldiers spent most of the war fighting from the same trenches in northern France","It began with an assassination"),
    histLevel(2,"By 1942, Japan had conquered much of East and Southeast Asia. Which sea battle in June 1942 turned the tide in the Pacific?","Midway","Stalingrad","Normandy","Verdun"),
    histLevel(2,"Which battle (1942–1943) was a turning point where the Soviet Union stopped the German army?","Stalingrad","Midway","Gallipoli","Hastings"),
    histLevel(3,"In August 1945, the United States dropped atomic bombs on Hiroshima and Nagasaki, and Japan surrendered days later. Which statement is accurate?","The bombs killed well over 100,000 people, most of them civilians","The bombs were aimed at army camps far from where any civilians lived","Japan had already surrendered before the bombs were dropped","The bombs were first used against Germany"),
    histLevel(3,"In 1939, Albert Einstein signed a letter to Roosevelt (adapted): “It may become possible to set up a nuclear chain reaction… and extremely powerful bombs may be built.” What did this letter help start?","The U.S. program to build an atomic bomb","The space race between the U.S. and the Soviet Union","The United Nations","The League of Nations"),
    histLevel(2,"What new organization did the winners create in 1945 to keep the peace?","The United Nations","The League of Nations","The Warsaw Pact","The European Union"),
    histLevel(3,"Which is the strongest claim about the causes of World War II?","Several causes combined: the harsh 1919 peace, the Depression, fascist aggression, and failed appeasement","It had one cause and no others: Germany’s invasion of Poland on September 1, 1939, which came as a total surprise to everyone","It was caused by the Cold War","It began because the League of Nations attacked Germany"),
    histLevel(2,"Before the war began in Europe, which Axis power invaded China in 1937?","Japan","Italy","Germany","The Soviet Union")
  ],
  /* 8.7: no role card. She reads the sources as a historian. Factual, no graphic detail, victims named as people. */
  holocaust:[
    histLevel(1,"What was the Holocaust?","The Nazi German state’s planned murder of about six million Jewish people","A long battle between German and Soviet armies across Eastern Europe in the war","A famine in Eastern Europe during the war","A law that sent people to work in factories"),
    histLevel(1,"Historians use the word antisemitism. What does it mean?","Hatred of or prejudice against Jewish people","Opposition to war and armies","Support for one strong leader who rules without elections","Fear of people from other countries"),
    histLevel(2,"Germany’s Nuremberg Laws of 1935 (adapted) said Jewish people could no longer be citizens of Germany and banned marriages between Jews and other Germans. What step does this source show?","Hatred became law, taking away Jewish people’s rights","Germany protected the rights of minorities","Germany gave Jewish people new rights as full citizens of the state","Germany ended its army"),
    histLevel(2,"On November 9–10, 1938, Nazis attacked Jewish homes, shops, and synagogues across Germany. What is this event called?","Kristallnacht, the “Night of Broken Glass”","The Munich Agreement","The Beer Hall Putsch, Hitler’s failed Munich revolt","The Night of the Long Knives"),
    histLevel(2,"Besides Jewish people, which groups did the Nazis also persecute and murder?","Roma people, disabled people, and political opponents","Citizens of Germany’s allies, Italy and Japan, living in Berlin","Factory owners who made weapons for the army","Soldiers in the German army"),
    histLevel(1,"Anne Frank was a Jewish girl who hid with her family in Amsterdam for two years and kept a diary. What happened to her?","She was found, deported, and died in the Bergen-Belsen camp in 1945","She escaped by ship to the United States and later became a famous writer there","She stayed hidden safely in Amsterdam until the war ended","She was taken to Switzerland by the Red Cross"),
    histLevel(2,"In 1938, delegates from 32 countries met at Évian, France, to discuss Jewish refugees trying to leave Germany. What happened?","Most countries refused to take in many more refugees","The countries declared war on Germany","Germany agreed to stop its attacks on Jewish people right away","The countries opened their borders to the refugees"),
    histLevel(3,"In 1939, the ship St. Louis carried more than 900 Jewish refugees from Germany. Cuba, the United States, and Canada turned it away, and it sailed back to Europe. What does this show about the world’s response?","Many countries closed their doors to people fleeing the Nazis","Refugees were welcomed wherever they went","Germany refused to let the ship leave its port in Hamburg harbor","The ship was carrying soldiers, not refugees"),
    histLevel(3,"Manuel Quezon, president of the Philippines (then under U.S. control), helped about 1,300 Jewish refugees settle in Manila between 1937 and 1941. What does his story show?","Some leaders chose to help, even when most of the world did little","The Philippines was part of Nazi Germany","Refugees could travel freely to any country they wanted at the time","The United States stopped the plan"),
    histLevel(3,"In 1940, Chiune Sugihara, a Japanese diplomat in Lithuania, wrote more than 2,000 travel visas for Jewish refugees against his government’s orders. Historians call people like him...","Rescuers","Bystanders","Perpetrators","Collaborators"),
    histLevel(2,"Historians use the word “bystander” for someone who...","Saw what was happening but did not act to help","Hid Jewish families in their home","Fought against Germany as a soldier in the Allied armies","Wrote visas for refugees"),
    histLevel(3,"In December 1942, the Allies publicly declared (adapted) that Germany was carrying out its plan to destroy the Jewish people of Europe, and promised to punish those responsible. Why is this source important to historians?","It shows Allied leaders knew about the mass murder during the war","It proves that the Allies first learned of the killings in May 1945","It was written by Nazi leaders","It ended the Holocaust right away"),
    histLevel(3,"After the war, Nazi leaders were put on trial at Nuremberg (1945–1946). What idea did these trials help establish?","Leaders can be held responsible for crimes against humanity","Following orders from a leader is an excuse for committing any crime","Soldiers are the ones who can be tried for war crimes","A country’s leaders cannot be judged by other nations"),
    histLevel(3,"Historians found that many ordinary people, such as police officers, clerks, and railway workers, took part in carrying out the Holocaust. Why does this matter?","Genocide needs many people’s help, so each person’s choices matter","It shows Hitler carried out the killing by himself","It shows the killing took place on battlefields between two armies at war","It shows ordinary people knew nothing about it"),
    histLevel(2,"The word “genocide” was created in 1944 by Raphael Lemkin, a Polish Jewish lawyer. What does it mean?","Acts meant to destroy a national, ethnic, racial, or religious group","A war between two countries that ends with one side surrendering to the other","A law that takes away the right to vote","Moving people to new farms")
  ],
  coldWar:[
    histLevel(1,"A visitor asks which two superpowers led the two sides of the Cold War. What do you say?","The United States and the Soviet Union","The British Empire and the French Empire","Germany and Japan","China and India"),
    histLevel(1,"Why was it called a “cold” war?","The two superpowers never fought each other directly","Most of its battles were fought in the Arctic","It happened mostly in winter","Both sides had agreed to stop making weapons in 1946"),
    histLevel(2,"Which describes communism as it worked in the Soviet Union?","The government owned businesses and planned the economy, and one party ruled","Private companies competed in a free market and voters chose among many parties","A king shared power with a parliament","Each state made its own laws"),
    histLevel(2,"In 1946, Winston Churchill said (adapted): “An iron curtain has come down across the continent of Europe.” What did he mean?","Europe was split between a Soviet-controlled east and a democratic west","A real metal wall had been built from the Baltic Sea down to the Adriatic Sea","France had closed its borders","The war in Europe had just ended"),
    histLevel(2,"After 1947, the United States gave billions of dollars to rebuild Western Europe (the Marshall Plan). Why?","To help economies recover and keep communism from spreading","To pay back debts it owed Germany","To buy land in Europe that could become new American states","To pay for the Soviet army"),
    histLevel(1,"What did the Berlin Wall (1961–1989) do?","Divided communist East Berlin from West Berlin","Protected Berlin from Nazi armies","Separated Germany from Poland","Kept Soviet soldiers out of East Germany for good"),
    histLevel(2,"The Korean War (1950–1953) ended with Korea...","Still divided, near the 38th parallel","United under one communist government","United as a U.S. territory","Ruled by Japan again"),
    histLevel(3,"In October 1962, President Kennedy said (adapted): any nuclear missile launched from Cuba against any nation in the Western Hemisphere would be treated as an attack by the Soviet Union on the United States. Why was this moment so dangerous?","Both superpowers had nuclear weapons, and a mistake could start a nuclear war","Cuba’s army was about to invade Florida by sea using a large fleet of Soviet ships","Kennedy was planning to give Cuba to the Soviets","The missiles were aimed at Europe"),
    histLevel(2,"How did the Cuban Missile Crisis end?","The Soviets removed the missiles; the U.S. promised not to invade Cuba","The United States invaded Cuba and removed Castro","Cuba joined NATO and broke with the Soviets","The United Nations took control of Cuba and ran it until the year 1970"),
    histLevel(2,"In 1957, the Soviet Union launched Sputnik, the first artificial satellite. Why did many Americans worry?","A rocket that reached space could also carry nuclear weapons","Sputnik was dropping bombs on cities","It meant the Soviets had already landed astronauts on the moon","Sputnik blocked TV signals"),
    histLevel(3,"Historians call the Korean and Vietnam Wars “proxy wars” of the Cold War. Why?","The superpowers backed opposite sides instead of fighting each other directly","They were fought head-on between the American and Soviet armies on the battlefields of Asia","They were fought over oil in Europe","Both superpowers stayed neutral"),
    histLevel(3,"In 1973, Chile’s elected socialist president, Salvador Allende, was overthrown in a military coup, and General Augusto Pinochet ruled as a dictator who jailed and killed thousands of opponents. The U.S. government had worked against Allende. What pattern does this show?","The U.S. sometimes backed harsh anti-communist rulers to stop the left","The U.S. always supported whichever leaders voters had chosen in free elections","The Soviet Union put Pinochet in power","Chile became a close Soviet ally"),
    histLevel(2,"How did the Vietnam War end?","North Vietnam took over the South in 1975, uniting Vietnam under communism","The U.S. won, and Vietnam became a democracy","Vietnam was split into four countries","France took back control of Vietnam and made it a colony once again in 1975"),
    histLevel(3,"Which best explains why the Cold War ended in 1991?","The Soviet economy struggled, Eastern Europe broke away, and the Soviet Union split apart","The United States and the Soviet Union fought one final great battle in the city of Berlin","China conquered the Soviet Union","The United Nations banned communism"),
    histLevel(1,"In what year did the Berlin Wall fall?","1989","1945","1961","1975")
  ],
  decolonization:[
    histLevel(1,"Friends ask what decolonization means. What do you say?","Colonies winning independence from the empires that ruled them","Empires taking over new colonies","Countries joining the United Nations after the Second World War","Moving people from cities to farms"),
    histLevel(1,"Which country won independence from Britain in 1947, led by a movement known for nonviolent protest?","India","Algeria","Vietnam","Kenya"),
    histLevel(2,"Mohandas Gandhi led protests like the Salt March (1930). What method did he use?","Nonviolent resistance, such as marches and boycotts","Guerrilla war in the mountains","Asking the Soviet Union to send its army into India","Voting in British elections"),
    histLevel(2,"When British India became independent in 1947, it was divided. What happened?","India and Pakistan were created, and millions fled amid deadly violence","India and Bangladesh were created peacefully","India rejoined the British Empire","India split into a communist north and a democratic south, like Korea after the war"),
    histLevel(1,"In 1957, Kwame Nkrumah led the Gold Coast to independence. What was the new country named?","Ghana","Nigeria","Kenya","Algeria"),
    histLevel(3,"In his independence speech (adapted), Nkrumah said Ghana’s freedom meant little unless the rest of Africa also became free. What does this show?","He hoped Ghana’s independence would inspire other African colonies","He wanted Ghana’s army to march out, take over, and rule the rest of Africa","He planned to rejoin the British Empire","He thought the rest of Africa was already free"),
    histLevel(2,"In 1945, Ho Chi Minh declared Vietnam’s independence, beginning (adapted): “All men are created equal.” Which document was he quoting?","The U.S. Declaration of Independence","The Treaty of Versailles of 1919","The Charter of the United Nations of 1945","The Magna Carta"),
    histLevel(3,"Why was Vietnam’s fight for independence pulled into the Cold War?","Ho Chi Minh was a communist, so the U.S. backed his opponents","Vietnam was a colony of the Soviet Union","The United States wanted to make Vietnam into a colony of its own","France had become a communist country"),
    histLevel(3,"Algeria won independence from France in 1962 after a long, violent war (1954–1962). Why was France so unwilling to leave?","About a million French settlers lived there, and France treated Algeria as part of France","Algeria had few ties to France","France wanted to give Algeria to Britain","The United Nations had voted to order France to keep ruling Algeria for another hundred years"),
    histLevel(2,"Nigeria became independent from Britain in 1960. What challenge did it face, like many new nations?","Uniting many ethnic groups inside borders drawn by a colonial power","Having too few people living in the country to run a working government","Being too small to have neighbors","Being ruled by the Soviet Union"),
    histLevel(3,"At the Bandung Conference (1955), leaders of Asian and African countries met. Many later joined the Non-Aligned Movement. What did that mean?","Not formally joining either the U.S. side or the Soviet side","Joining NATO in order to help the United States fight communism","Agreeing to become colonies again","Joining together as one country"),
    histLevel(3,"Historians note that women in many independence movements organized protests, carried messages, and sometimes fought. What does this show?","Decolonization was carried out by many kinds of people, not just famous male leaders","Women mostly worked for the colonial governments that the movements were fighting against","Women took no part in independence movements","Women led the colonial governments"),
    histLevel(2,"How did the Cold War affect many newly independent countries?","Both superpowers offered aid and weapons to win them as allies","They were ignored by both superpowers","They had to join the Soviet Union as brand-new member republics in Asia","They had to join NATO"),
    histLevel(1,"In which decades did most colonies in Africa win independence?","The 1950s and 1960s","The 1800s","The 1910s and 1920s","The 1990s and 2000s")
  ]
};
/* ---------- end of History Unit 8 ---------- */
/* ---------- History Unit 9: Globalization (1900 CE to the present) (Oct 28, 2026; docs/HISTORY-UNIT9.md) ----------
   Khan's 7 practices, in order (checked on khanacademy.org, Oct 28 2026). Owner rule for this unit: debates are shown as
   views people hold (never a keyed opinion), and the contested topics in 9.6–9.8 (genocides since 1945, 9/11, Standing Rock,
   climate change and the Anthropocene) are introduced lightly: scored questions stay on definitions, dates and reading a
   short source, and the 🔎 Research it short answers send her to research them with a grown-up. */
const HISTORY_UNIT9 = [
  {id:'globalGoodBad',name:"Is Globalization Good or Bad?",lesson:"Globalization is the growing web of trade, travel, and ideas that links the world. Supporters point to cheaper goods, new jobs, and shared technology; critics point to lost jobs, low wages, and harm to small farmers and local cultures."},
  {id:'globalEconomy',name:"Economics in the Global Age",lesson:"Most products now move along global supply chains, made by multinational companies with parts and workers in many countries. People debate whether this makes the world “flat” (more equal chances) or “spiky” (wealth gathered in a few places)."},
  {id:'greatAccel',name:"The Great Acceleration",lesson:"After about 1950, population, energy use, cities, and technology all grew faster than ever before: the Great Acceleration. The Green Revolution raised harvests, and vaccination wiped out smallpox by 1980."},
  {id:'globalCommunities',name:"Global Communities",lesson:"After World War II, countries founded the United Nations (1945) and adopted the Universal Declaration of Human Rights (1948), whose drafting Eleanor Roosevelt led. Movements against racial injustice, like the US civil rights movement, worked to make those rights real."},
  {id:'globalConflicts',name:"Global Conflicts",lesson:"Nationalism is loyalty to one’s nation, and transnationalism means ties that cross borders. Genocide, a word Raphael Lemkin made up in 1944, means acts meant to destroy a group of people; the UN made it a crime in 1948."},
  {id:'experiencingGlobal',name:"Experiencing Globalization",lesson:"A refugee is someone who flees their country because of war or persecution; by 2022, more than 100 million people had been forced from their homes. Repatriation means returning objects or remains to the people they came from."},
  {id:'anthropocene',name:"The Anthropocene?",lesson:"The Anthropocene is a proposed name for a time in Earth’s history shaped by humans. In 2024, geologists voted not to make it official, so we are still officially in the Holocene epoch."}
];
/* Khan's lessons 9.1 to 9.8, each its own block with its videos: Quiz 1 after 9.3, Quiz 2 after 9.6, the unit test after 9.8. */
const HISTORY_GROUPS9 = [
  {id:'overview9',name:'Our Interconnected World | 9.1',noQuiz:true,skills:[],learn:'What does it mean to live in a global world? Since 1900, trade, travel, and communication have linked people more closely than ever, and this unit asks how that has helped and challenged them.'},
  {id:'goodBad9',name:'Is Globalization Good or Bad? | 9.2',noQuiz:true,skills:['globalGoodBad'],learn:'What are the benefits and challenges of globalization? Hear what supporters and critics each say.'},
  {id:'economy9',name:'The Global Economy | 9.3',quizName:'Quiz 1',quizSkills:['globalGoodBad','globalEconomy'],skills:['globalEconomy'],learn:'Follow products along global supply chains, and compare the “flat world” and “spiky world” views of the global economy.'},
  {id:'accel9',name:'The Great Acceleration | 9.4',noQuiz:true,skills:['greatAccel'],learn:'Why has change sped up since 1945? Population, cities, energy use, and technology all grew faster than ever.'},
  {id:'communities9',name:'Global Communities | 9.5',noQuiz:true,skills:['globalCommunities'],learn:'After World War II, countries built the United Nations and wrote the Universal Declaration of Human Rights, and movements worked to end racial injustice.'},
  {id:'conflicts9',name:'Global Conflicts | 9.6',quizName:'Quiz 2',quizSkills:['greatAccel','globalCommunities','globalConflicts'],skills:['globalConflicts'],learn:'Nationalism and transnationalism, the meaning of genocide, and the attacks of September 11, 2001. Learn the words and dates here, then research the events with a grown-up.'},
  {id:'experiencing9',name:'Experiencing Globalization | 9.7',noQuiz:true,skills:['experiencingGlobal'],learn:'Refugees, migrants, and communities working to protect their heritage, from returning museum objects to the protests at Standing Rock.'},
  {id:'anthro9',name:'The Anthropocene? | 9.8',noQuiz:true,skills:['anthropocene'],learn:'Have humans changed Earth enough to name a new epoch after us? Learn what the idea means, and research what scientists and others say.'}
];
/* History Unit 9 bank: plausible wrong answers, adapted sources, debates shown as views (docs/history9-review.md). */
const HISTORY9_QUESTIONS = {
  globalGoodBad:[
    histLevel(1,"A visitor at the port asks what “globalization” means. What do you say?","Growing connections of trade, people, and ideas around the world","One powerful country ruling over the governments of the other nations","Countries closing their borders to trade and travel","A single currency shared by the whole world"),
    histLevel(1,"In 1956, a ship carried goods packed in big metal boxes of one standard size from New Jersey to Texas. What were these boxes?","Shipping containers","Wooden steamer trunks","Railroad boxcars","Wooden barrels"),
    histLevel(3,"A visitor asks why dockworkers like you say containers changed world trade. What do you say?","Loading ships became faster and much cheaper","Ships no longer needed crews to sail them","Containers made the goods inside weigh less","Ports stopped charging ships for their cargo"),
    histLevel(1,"What is a tariff?","A tax on goods brought in from another country","A ban on selling goods to other countries","A loan from one country’s bank to another country","A ship that carries goods across an ocean"),
    histLevel(2,"What do “free trade” agreements usually do?","Lower tariffs and other barriers to trade","Raise taxes on goods from other countries","Stop companies from selling goods abroad","Set the same price for goods in different countries"),
    histLevel(2,"On January 1, 1994, a trade deal called NAFTA took effect. Which countries did it link?","Mexico, the United States, and Canada","Mexico, Brazil, and Argentina","The United States, Britain, and France","Canada, Japan, and China"),
    histLevel(2,"On the day NAFTA began, the Zapatistas rose up in Chiapas, Mexico. Who were most of them?","Indigenous Maya farmers","Factory owners from Mexico City","Soldiers from the United States","Bankers from Mexico’s big cities"),
    histLevel(3,"The Zapatistas said in 1994 (adapted): “This trade deal is a death certificate for the Indigenous peoples of Mexico.” What were they worried about?","Open trade would hurt poor Indigenous farmers like them","Mexico would stop selling its oil to other countries","New factories would pay farmers too much money","The deal would close Mexico’s southern border with Guatemala"),
    histLevel(3,"Which argument would a supporter of globalization most likely make?","Trade lowers prices and brings jobs to exporting countries","Trade sends factory jobs away from towns that depended on them","Big companies pay workers abroad too little","Local cultures fade as global brands spread"),
    histLevel(3,"Which argument would a critic of globalization most likely make?","Factories may move to wherever wages are lowest","Cheaper goods help families stretch their money","Trade spreads new medicines and technology around the world","Selling goods abroad can lift workers out of poverty"),
    histLevel(2,"In 1999, thousands of people protested a World Trade Organization meeting. In which city?","Seattle","Geneva","New York","Davos"),
    histLevel(1,"Which organization, started in 1995, sets rules for trade between countries?","The World Trade Organization","The United Nations Security Council","The World Health Organization","The International Red Cross"),
    histLevel(3,"Some countries deep in debt were told to practice “austerity.” What does that mean?","Cutting government spending to pay debts","Printing more money to pay for new schools and roads","Raising the pay of government workers","Closing borders to goods from abroad"),
    histLevel(2,"K-pop music from South Korea now has fans all over the world. This is an example of:","Cultural globalization","Economic austerity","A protective trade tariff","Isolationism"),
    histLevel(3,"Looking back: before 1914, steamships and the telegraph had already linked the world’s markets. What does this show?","Globalization has roots older than the last few decades","Global trade first began with the internet in the 1990s","Steamships slowed down trade between countries","The telegraph was invented after World War II")
  ],
  globalEconomy:[
    histLevel(1,"A reader asks what a “supply chain” is. What do you say?","The steps and places that make a product and bring it to you","A group of stores owned by one family in many different towns","A rule limiting how many goods a country can bring in","A line of ships waiting outside a busy port"),
    histLevel(1,"A company with offices and factories in many countries is called a:","Multinational corporation","Family-run cooperative farm","Merchant guild","Colony"),
    histLevel(2,"Smartphones like the iPhone are designed in California. Where are most of them put together?","In factories in China","In factories in California","In factories in Brazil","In factories in Germany"),
    histLevel(2,"Your article follows a cup of coffee. Which country grows the most coffee in the world?","Brazil","Italy","The United States","France"),
    histLevel(3,"A coffee farmer gets a small share of the price of a café latte. Why might that be?","Shippers, roasters, and cafés each add costs and take a share","Coffee beans cost more than everything else in the drink combined","Farmers are paid after the café closes for the year","The price of coffee is set by the farmer’s own village"),
    histLevel(2,"What does a “fair trade” label on coffee or chocolate promise?","The farmers were paid at least a set minimum price","The product was grown and made in the buyer’s own country","The product has no sugar or milk added to it","The farmers own the stores that sell it"),
    histLevel(1,"Money that migrant workers send home to their families is called:","Remittances","Tariffs","Austerity","Dividends"),
    histLevel(3,"In 2005, the writer Thomas Friedman said “the world is flat.” What did he mean?","Technology lets people almost anywhere compete for work","Countries around the world now earn about the same income","Trade has stopped growing since the internet arrived","Maps are more useful than globes for planning trade"),
    histLevel(3,"The writer Richard Florida answered that the world is “spiky.” What did he mean?","Wealth and new ideas cluster in a few big city regions","Prices jump up and down because of trade wars","Mountains and oceans still block most of the world’s trade routes","Most new businesses start in small farming towns"),
    histLevel(3,"Which example would a supporter of the “flat world” view most likely point to?","Engineers in India writing code for companies in the US","Most new patents come from a handful of big cities","Silicon Valley holds a huge share of tech companies","Rural regions have far fewer jobs that can be done online"),
    histLevel(3,"Which example would a supporter of the “spiky world” view most likely point to?","A few city regions produce most new inventions","A student in Kenya takes an online class from a US university","A worker in the Philippines answers calls for a US company","A shop owner in Peru sells crafts to buyers around the world"),
    histLevel(2,"By World Bank measures, what happened to the share of the world’s people living in extreme poverty from 1990 to 2019?","It fell from over a third to about one in ten","It rose from about one in ten to over a third","It stayed about the same for the whole period","It fell to zero across Asia, Africa, and the Americas"),
    histLevel(3,"Some people say globalization makes the world more equal; others say it makes the world less equal. What would make the strongest case for either side?","Data, such as incomes and poverty rates over many years","The opinion of one famous company leader","How many people have shared or liked it on social media sites","A single story about one person’s life"),
    histLevel(2,"The 2008 financial crisis began in the US housing market. What happened next?","It spread to banks and economies around the world","It stayed inside the United States and ended quickly","It mainly hurt farmers in South America","It made housing in the US much cheaper to build"),
    histLevel(1,"When a company moves a factory to another country, this is called:","Offshoring","Importing","Nationalizing","Recycling")
  ],
  greatAccel:[
    histLevel(1,"What do historians call the fast speed-up in population, energy use, and production after about 1950?","The Great Acceleration","The Industrial Revolution","The Agricultural Revolution","The Great Depression"),
    histLevel(1,"About how many people lived on Earth in 1950?","About 2.5 billion","About 8 billion","About 500 million","About 15 billion"),
    histLevel(2,"In what year did the United Nations say the world reached 8 billion people?","2022","1950","1999","2010"),
    histLevel(3,"Looking back: in 1965, Gordon Moore predicted that the number of tiny switches (transistors) on a computer chip would:","Keep doubling every year or two","Stop growing after about ten years","Grow by one or two each year","Shrink as the chips got faster"),
    histLevel(2,"In the 1960s, your team bred new kinds of wheat and rice. What made these seeds part of the Green Revolution?","They grew much more grain in each field","They grew well in dry fields without watering","They grew wild without any farmers","They were grown in gardens in big cities"),
    histLevel(1,"Which scientist, called the father of the Green Revolution, won the 1970 Nobel Peace Prize?","Norman Borlaug","Alexander Fleming","Edward Jenner","Gordon Moore"),
    histLevel(2,"Besides new seeds, what did the Green Revolution depend on?","Fertilizer and irrigation","Horses pulling wooden plows","Slash-and-burn farming","Hunting and gathering"),
    histLevel(3,"A visitor says the Green Revolution had costs as well as benefits. Which cost do critics often name?","Heavy use of water and fertilizer can harm soil and rivers","Harvests became too small to feed the growing number of people","Farmers in India stopped growing rice and wheat","It brought back hunting and gathering in some places"),
    histLevel(1,"In 1980, the World Health Organization announced that which disease had been wiped out?","Smallpox","Polio","Malaria","Measles"),
    histLevel(3,"Looking back: how did health workers end smallpox?","They found each case and vaccinated the people around it","They gave everyone in the world a full course of antibiotics","They moved sick people to hospitals on faraway islands","They drained the swamps where the disease was spreading"),
    histLevel(3,"Smallpox spread only from person to person. What else made it possible to wipe out?","A vaccine protected people for many years","It could survive for years inside animals","It caused no signs that doctors could see","It was carried from place to place by mosquitoes"),
    histLevel(2,"Since about 2007, more than half of the world’s people have lived in:","Cities and towns","Farming villages","Nomadic camps","Small islands"),
    histLevel(2,"Which city had the most people in the world in 1900?","London","Beijing","Mexico City","Lagos"),
    histLevel(3,"Looking back: which best explains why change sped up after World War II?","New technology, cheap energy, and more trade fed one another","Population fell, so each family had more land to farm","Countries stopped trading with one another for years after the war","Factories closed, and people moved back to farms"),
    histLevel(3,"Around the world, people lived about 32 years on average in 1900. About how long do they live on average today?","More than 70 years","About 32 years","About 45 years","More than 110 years")
  ],
  globalCommunities:[
    histLevel(1,"Which organization, founded in 1945, took the place of the League of Nations?","The United Nations","The World Bank","NATO","The European Union"),
    histLevel(3,"A visitor asks why leaders created the United Nations after World War II. What do you say?","To prevent another world war and work on shared problems","To rebuild the old empires of Europe and their many colonies","To set one price for oil and wheat around the world","To choose a single ruler for the world’s nations"),
    histLevel(1,"A visitor asks who led the committee that wrote the Universal Declaration of Human Rights. Who was she?","Eleanor Roosevelt","Margaret Thatcher","Marie Curie","Golda Meir"),
    histLevel(1,"In what year did the United Nations adopt the Universal Declaration of Human Rights?","1948","1918","1945","1964"),
    histLevel(2,"What does “universal” mean in “universal human rights”?","The rights belong to every person","The rights belong to citizens of rich countries","The rights belong to adults who can vote","The rights are granted by a king or emperor"),
    histLevel(3,"Article 1 of the Declaration says (adapted): “All people are born free and equal in dignity and rights.” Which idea does it express?","Each person has the same basic worth","People earn their rights by working hard","Rights come from belonging to a powerful nation","Some groups deserve more rights than others"),
    histLevel(3,"The Universal Declaration is a declaration, not a treaty. What does that mean?","It set goals, but it did not legally bind countries","It was written by one country without help from any others","It was not voted on by the United Nations","It applies to the people who work at the UN"),
    histLevel(2,"The Declaration passed with 48 votes for, none against, and 8 abstentions. What is an abstention?","Choosing not to vote yes or no","Voting against the proposal","Leaving the United Nations","Using a veto to block the vote"),
    histLevel(3,"Some people say human rights are “universal”; others say rights are “relative.” What does the relative view say?","Rights should fit each culture’s own values and traditions","Rights belong to everyone everywhere in exactly the same way","Rights belong to governments instead of to people","Rights can be bought and sold like goods"),
    histLevel(2,"The IMF and the World Bank were planned at a meeting in 1944. What was their main job?","To steady the world economy and lend money for rebuilding","To command armies that keep the peace between the world’s nations","To write the human rights laws of each country","To manage fishing in the world’s oceans"),
    histLevel(2,"Groups like Amnesty International and Doctors Without Borders are not run by governments. What are they called?","NGOs","Treaties","Embassies","Tariffs"),
    histLevel(3,"During World War II, many Black Americans called for a “Double V.” What did it stand for?","Victory over fascism abroad and racism at home","Victory in Europe and victory in the Pacific","Votes for women and votes for veterans","Victory for the Allies and for the Soviet Union"),
    histLevel(1,"Which 1964 US law banned discrimination in public places and in hiring?","The Civil Rights Act","The Voting Rights Act","The Bill of Rights","The New Deal"),
    histLevel(3,"Brazil’s leaders once called it a “racial democracy” with no racism. What did activists like Abdias do Nascimento answer?","Black Brazilians still faced unfair treatment","Brazil should copy the segregation laws of the US","Racism in Brazil had ended when it became a republic","Brazil’s problems came from its trade with Europe"),
    histLevel(2,"South Africa’s system of racial segregation, which ended in the early 1990s, was called:","Apartheid","Austerity","Feudalism","Colonialism")
  ],
  globalConflicts:[
    histLevel(1,"What is a nation-state?","A country whose people share an identity and a government","A city that rules itself without being part of a larger country","A group of countries that share one army","A company that does business in many countries"),
    histLevel(1,"What is nationalism?","Strong loyalty to one’s nation and its identity","Loyalty to a world government above any nation","A trade deal between neighboring countries in a region","The belief that borders should disappear"),
    histLevel(3,"What does “transnationalism” describe?","Ties and identities that cross national borders","Loyalty to one nation above any other","Moving a country’s capital from one city to a brand-new city","Taxes on goods that come from abroad"),
    histLevel(3,"A stateless person is someone who:","Is not a citizen of any country","Lives in a city without a mayor","Travels to many countries for work","Has passports from two countries"),
    histLevel(1,"Who made up the word “genocide” in 1944?","Raphael Lemkin, a Polish Jewish lawyer","Eleanor Roosevelt, a US diplomat","Winston Churchill, the British prime minister","Kofi Annan, a leader of the UN"),
    histLevel(3,"The 1948 Genocide Convention (adapted) defines genocide as acts done “with intent to destroy, in whole or in part, a national, ethnic, racial or religious group.” By this definition, what must be present?","An intent to destroy a group of people","A war between two or more countries","A vote by the United Nations","A ruler who was elected by a vote of the people"),
    histLevel(1,"In what year did the United Nations adopt the Genocide Convention?","1948","1918","1964","1994"),
    histLevel(2,"After the Holocaust, people around the world made a promise in two words. What was it?","“Never again”","“Peace now”","“One world”","“Freedom first”"),
    histLevel(3,"Which court, opened in The Hague in 2002, tries individual people for genocide and war crimes?","The International Criminal Court","The United States Supreme Court in Washington","The World Trade Organization","The European Parliament"),
    histLevel(1,"In what year did the genocide against the Tutsi people of Rwanda take place?","1994","1945","1975","2011"),
    histLevel(1,"On September 11, 2001, terrorists hijacked four airplanes. About how many people were killed? (Their names are on the National September 11 Memorial in New York.)","Nearly 3,000","About 300","About 30,000","About 300,000"),
    histLevel(2,"Which terrorist group carried out the attacks of September 11, 2001?","Al-Qaeda","The Taliban","The Khmer Rouge","The IRA"),
    histLevel(2,"After September 11, 2001, the US created a new agency to screen airline passengers and bags. What is it?","The TSA","The FAA","The CIA","NASA"),
    histLevel(3,"The 9/11 Commission wrote in 2004 (adapted): “The most important failure was one of imagination. Leaders did not grasp how serious the threat was.” According to this passage, what was the main failure?","Leaders did not imagine how serious the threat was","The airplanes were not built strongly enough to be safe","The police were too slow to reach New York","Too few people were willing to fly that year")
  ],
  experiencingGlobal:[
    histLevel(1,"A visitor to your exhibit asks what a refugee is. What do you say?","A person who flees their country because of war or persecution","A person who moves abroad to find a better-paying job","A person who visits another country for a long summer vacation","A person who moves to a new city in the same country"),
    histLevel(3,"A person forced from home who stays inside their own country is called:","An internally displaced person","A refugee who has crossed a border","A tourist visiting family abroad","An ambassador from another country"),
    histLevel(2,"The UN agency that helps refugees, started in 1950, is called:","UNHCR, the UN Refugee Agency","UNICEF, the UN Children’s Fund","WHO, the World Health Organization","WTO, the World Trade Organization"),
    histLevel(3,"The 1951 Refugee Convention (adapted) says a refugee is someone outside their country who cannot go back because of a real fear of persecution for their race, religion, nationality, social group, or political opinion. Who fits this definition?","A writer who fled abroad after being jailed for her opinions","A family that moved abroad to find better schools","A worker whose company sent her to an office overseas","A family that fled a flood to another town inside their own country"),
    histLevel(2,"Why did millions of Syrians become refugees after 2011?","A civil war broke out in Syria","Syria’s factories moved to China","A famine struck Syria’s farms","Syria joined the European Union"),
    histLevel(2,"Which country took in more Syrian refugees than any other?","Turkey","Germany","Canada","Brazil"),
    histLevel(1,"By 2022, the UN said the number of people forced from their homes around the world had passed:","100 million","1 million","10 million","1.5 billion"),
    histLevel(1,"In 1947, the Partition of British India created which two countries?","India and Pakistan","India and Bangladesh","Pakistan and Afghanistan","India and Sri Lanka"),
    histLevel(2,"Benazir Bhutto made history in 1988 when she became:","Pakistan’s first woman prime minister","India’s first woman prime minister","Pakistan’s first president after independence","Head of the United Nations"),
    histLevel(1,"When a museum returns an object to the people or country it came from, this is called:","Repatriation","Restoration","Offshoring","Excavation"),
    histLevel(3,"In 1897, British soldiers took thousands of brass and bronze artworks from the Kingdom of Benin. In which modern country was that kingdom?","Nigeria","The modern country of Benin","Ghana","Kenya"),
    histLevel(3,"A 1990 US law called NAGPRA requires many museums to:","Return Native American remains and sacred objects","Buy more art from countries around the world","Close their exhibits about Native American history","Charge visitors more to see sacred objects"),
    histLevel(1,"In 2016, members of the Standing Rock Sioux Tribe and their supporters protested a project near their reservation in North Dakota. What was it?","The Dakota Access Pipeline","A new interstate highway and bridge","A national park","A coal power plant"),
    histLevel(3,"What is a diaspora?","A community of people living far from their homeland","A law about who can become a citizen of a new country","A camp for refugees at a border","A museum about the world’s cultures")
  ],
  anthropocene:[
    histLevel(1,"A visitor at your research station asks what “Anthropocene” means. What do you say?","A proposed name for a time in Earth’s history shaped by humans","A new kind of energy that comes from the sun","The first age of the dinosaurs, hundreds of millions of years ago","A climate treaty signed by many countries in Paris"),
    histLevel(1,"The word “Anthropocene” comes from the Greek word “anthropos.” What does it mean?","Human","Earth","Ice","New"),
    histLevel(2,"Who made the name “Anthropocene” well known in 2000?","Paul Crutzen, a Nobel Prize–winning chemist","Norman Borlaug, a scientist who bred new wheat","Gordon Moore, a computer engineer","Charles Darwin, a naturalist"),
    histLevel(3,"Officially, geologists say we live in which epoch, the one that began about 11,700 years ago?","The Holocene","The Pleistocene","The Jurassic","The Anthropocene"),
    histLevel(3,"In 2024, a group of geologists voted on the Anthropocene. What did they decide?","Not to make it an official epoch","To make it official, starting in 1800","To rename the Holocene after humans","To wait another 100 years to vote"),
    histLevel(2,"Fossil fuels like coal and oil formed from:","The remains of ancient plants and tiny sea creatures","Volcanic rock that cooled long ago","Salt left behind by dried-up oceans","Minerals that fell to Earth long ago inside giant meteorites"),
    histLevel(1,"Energy from sources that nature keeps replacing, like sunlight and wind, is called:","Renewable energy","Fossil fuel energy","Nonrenewable energy","Nuclear fission energy"),
    histLevel(3,"Since 1958, scientists have measured carbon dioxide in the air at Mauna Loa in Hawaii. What have the measurements shown?","The amount has risen year after year","The amount has stayed about the same","The amount has fallen by about half","The amount goes up and down with no trend"),
    histLevel(3,"Paul Crutzen wrote in 2002 (adapted): “Humans have become a major force shaping the Earth, so it seems fitting to name a new epoch for us.” What is his main claim?","Human impact is big enough to name an epoch after it","Humans should stop studying the history of Earth’s rocks and layers","Earth has not changed since the last ice age","Epochs should be named after famous scientists"),
    histLevel(2,"What does “climate change” mean?","A long-term shift in Earth’s temperatures and weather patterns","One very hot summer in a single country","The daily change from warm daytime to cool nighttime temperatures","The change from one season to the next"),
    histLevel(2,"Looking back: which fuel powered most of the Industrial Revolution?","Coal","Solar power","Natural gas","Wind"),
    histLevel(1,"Looking back: before fossil fuels, where did most of the energy for work come from?","The muscles of people and animals","Electric power lines and generators","Gasoline engines","Nuclear power plants"),
    histLevel(3,"You drill ice cores in Antarctica. Why are they useful to scientists?","Air bubbles in the ice hold samples of air from the past","The ice holds the fossils of dinosaurs","The ice shows exactly where fossil fuels are buried under Antarctica","The ice tells how old the ocean’s fish are")
  ]
};
/* ---------- end of History Unit 9 ---------- */
const BIO_UNIT1 = [
  {id:'cellsOrganisms',name:'Understand: Cells and organisms',lesson:'Cells are the basic unit of life. Cells form tissues, tissues form organs, organs form systems, and systems work together in an organism.'},
  {id:'cellPartsU',name:'Understand: Cell parts and functions',lesson:'Each cell part has a function, such as the nucleus directing the cell and mitochondria releasing energy.'},
  {id:'cellPartsA',name:'Apply: Cell parts and functions',lesson:'Use what you know about cell parts to explain how a cell carries out life processes.'},
  {id:'plantSuccessU',name:'Understand: Plant reproductive success',lesson:'Plants have structures and behaviors that help them reproduce successfully.'},
  {id:'plantSuccessA',name:'Apply: Plant reproductive success',lesson:'Use plant structures and environments to explain reproductive success.'},
  {id:'asexualPlants',name:'Asexual reproduction',lesson:'In asexual reproduction one parent produces offspring that are genetically identical to it.'},
  {id:'sexualPlants',name:'Sexual reproduction',lesson:'In sexual reproduction, pollen and egg cells combine so offspring inherit traits from two parents.'},
  {id:'seedDispersal',name:'Dispersal of seeds',lesson:'Wind, water, animals, and other methods carry seeds to new places.'},
  {id:'digestionHumans',name:'Digestion in humans',lesson:'The digestive system breaks food down so the body can absorb nutrients.'},
  {id:'digestionIntestines',name:'Digestion in the intestines',lesson:'The small intestine absorbs nutrients and the large intestine absorbs water.'},
  {id:'humanDigestion',name:'Human digestion',lesson:'Follow food through the organs of the digestive system and explain what each organ does.'}
];
const BIO_GROUPS = [
  {id:'cells',name:'Cellular organization and cell parts',quizName:'Quiz 1',learn:'Recognize cells as the basic unit of life, how they organize into tissues, organs, systems, and organisms, and what cell parts do.',skills:['cellsOrganisms','cellPartsU','cellPartsA']},
  {id:'plants',name:'Reproduction in plants',quizName:'Quiz 2',learn:'Explore plant reproductive success, asexual and sexual reproduction, and seed dispersal.',skills:['plantSuccessU','plantSuccessA','asexualPlants','sexualPlants','seedDispersal']},
  {id:'digestion',name:'Human digestive system',quizName:'Quiz 3',learn:'Follow digestion through the human body and the intestines.',skills:['digestionHumans','digestionIntestines','humanDigestion']}
];
const BIO1_QUESTIONS = {
  cellsOrganisms:[
    mc('A kid on your tour asks: “What is the basic unit of life?”','The cell','The organ','The system','The tissue'),
    mc('A parent asks you to put these in order from smallest to largest. Which sequence is right?','Cell, tissue, organ, organ system','Tissue, cell, organ, organ system','Cell, organ, tissue, organ system','Organ system, organ, tissue, cell'),
    mc('A student points at a group of cells that all look alike. A group of similar cells working together is a:','Tissue','Cell part','Single organism only','Habitat'),
    mc('You show the group a pond water slide. Which of these living things is a single-celled organism?','Bacterium','Mushroom','Moss','Earthworm')
  ],
  cellPartsU:[
    mc('A visitor points to the big center of the model and asks which part directs the cell’s activities. What do you say?','Nucleus','Cell wall','Vacuole','Chloroplast'),
    mc('A kid asks which part releases energy from food for the cell. What do you point to?','Mitochondria','Cell membrane','Nucleus','Cytoplasm'),
    mc('A grandparent asks which part decides what gets in and out of the cell. What is it?','Cell membrane','Chloroplast','Nucleus','Cytoplasm gel'),
    mc('In the plant cell room, a visitor asks which part carries out photosynthesis. What do you show them?','Chloroplast','Mitochondria','Cell membrane','Nucleus')
  ],
  cellPartsA:[
    mc('A visitor asks how a plant cell stays stiff and keeps its shape. Which part helps most?','Cell wall','Mitochondria','Nucleolus','Cytoplasm'),
    mc('A runner on your tour asks about muscle cells, which need lots of energy. Which part would they have many of?','Mitochondria','Chloroplasts','Cell walls','Vacuoles'),
    mc('A visitor describes a cell that cannot make proteins because its instructions are damaged. Which part is most likely affected?','Nucleus','Cell wall','Vacuole','Cell membrane'),
    mc('A kid holds up a leaf and asks which part of its cells makes food from light. What do you say?','Chloroplast','Nucleus','Cell membrane','Cytoplasm')
  ],
  plantSuccessU:[
    mc('A kid asks what flowers are really for. What is the main purpose of a flower for many plants?','To help the plant reproduce','To absorb water from the soil','To store food for the winter','To make the leaves grow faster'),
    mc('A visitor watches a bee land on a flower. What does the bee help move?','Pollen','Roots','Soil','Leaves'),
    mc('A parent asks why so many flowers are bright colors. What do you explain?','They attract pollinators','They scare pollinators away','They make seeds disappear','They stop photosynthesis'),
    mc('A visitor sees a plant covered in seeds. Why can making many seeds improve reproductive success?','More seeds may survive and grow','Each seed needs less water to grow','The parent plant needs less sunlight','Seeds protect the parent from insects')
  ],
  plantSuccessA:[
    mc('A visitor notices no bees are visiting one field of plants. What do you predict will happen?','Fewer seeds may form','More seeds always form','Roots stop growing','Leaves become flowers'),
    mc('A kid sniffs a sweet flower full of nectar. Which structure-and-function idea do you explain?','Features attract animals that carry pollen','Nectar feeds the roots during dry weather','The smell keeps insects from eating leaves','Features protect the flower from cold nights'),
    mc('A visitor asks how a hard seed coat helps a seed that has to survive winter. What do you say?','It can protect the embryo until conditions improve','It lets the young seed grow quickly up through the snow','It stores water that the roots use in winter','It helps the seed attract animals to carry it'),
    mc('A grandparent asks what could hurt a plant’s chances of reproducing. Which change could lower its success?','Loss of pollinators','Healthy, rich soil','More bees nearby','Plenty of warm sunlight')
  ],
  asexualPlants:[
    mc('A visitor asks how new plants made by asexual reproduction compare to the parent. Offspring are:','Genetically identical to the parent','A mix of traits from two different parents','A new species unlike the parent','Grown from pollen and egg cells'),
    mc('A kid asks you for an example of asexual reproduction in plants. Which do you point to?','A strawberry plant sending out runners','A bee carrying pollen between flowers','A seed forming after pollination','A bright flower attracting a butterfly'),
    mc('A parent asks how many parents asexual reproduction needs. What do you say?','One','Two','Three','None'),
    mc('You show the group a stem cutting that grew roots and became a new plant. What is this an example of?','Asexual reproduction','Sexual reproduction','Cross-pollination','Seed germination in the soil')
  ],
  sexualPlants:[
    mc('A visitor asks what sexual reproduction in flowering plants involves. What do you explain?','Pollen and egg cells combining','One parent making a copy of itself','A cutting growing new roots','Runners spreading across the soil'),
    mc('A kid asks what “pollination” means. What do you say?','Moving pollen to the female part of a flower','A seed growing its first roots in the soil','Water moving from the roots up to the leaves','A leaf using sunlight to make food for it'),
    mc('A parent asks why sexual reproduction makes baby plants that look a little different from each other. What is the reason?','Offspring inherit traits from two parents','Offspring copy the traits of one parent','The weather changes the seeds as they grow','Each seed is made by a different flower'),
    mc('You cut open a fruit to show the group. After fertilization, what can an ovule develop into?','Seed','Root hair','Stem','Petal')
  ],
  seedDispersal:[
    mc('A maple seed spins down past your tour group. A kid asks how it travels. What do you say?','By wind','By animals eating it','By water only','By exploding pods'),
    mc('A burr is stuck to a visitor’s dog. How is this seed dispersed?','By animals','By wind only','By water','By exploding pods'),
    mc('A visitor asks why it matters if seeds travel away from the parent plant. What do you explain?','Seeds can grow away from the crowded parent plant','Seeds near the parent get more of its water and food','Seeds that stay close need less sunlight','Seeds that move away stay dormant longer'),
    mc('You show the group a coconut that washed up on a beach. How does it travel?','By water','By pollinators only','By roots','By leaves')
  ],
  digestionHumans:[
    mc('A visitor asks what the whole digestive system is for. What is its main job?','Break food down so nutrients can be absorbed','Pump blood that carries oxygen to the cells','Take in oxygen and get rid of carbon dioxide','Send signals from the brain to the muscles'),
    mc('A kid asks where digestion begins. What do you say?','The mouth','The large intestine','The stomach only','The esophagus'),
    mc('At the giant teeth, a visitor asks what chewing does. What do you explain?','Breaks food into smaller pieces','Absorbs the nutrients from food','Makes bile that breaks down fat','Removes extra water from waste'),
    mc('Your group reaches the stomach model. How does the stomach help digestion?','Mixing food with acid and enzymes','Absorbing most of the water from food','Making new red blood cells','Filtering oxygen out of the air')
  ],
  digestionIntestines:[
    mc('A visitor asks where most nutrients are absorbed. What do you say?','Small intestine','Large intestine','Mouth','Esophagus'),
    mc('A kid asks what the large intestine mostly soaks up. What do you answer?','Water','Most protein','Most of the fat','Bile'),
    mc('You point to the tiny finger-like villi on the wall. Why does the small intestine have them?','They increase surface area for absorption','They crush food into a soft paste first','They make the acid that breaks down food','They store waste until it leaves the body'),
    mc('At the end of the tunnel, a visitor asks what happens to food that was not digested. What do you say?','It is eliminated as waste','It is absorbed by the villi','It is stored in the liver','It goes back to the stomach')
  ],
  humanDigestion:[
    mc('A visitor asks you to trace the path food takes. Which path is correct?','Mouth, esophagus, stomach, small intestine, large intestine','Mouth, stomach, esophagus, large intestine, small intestine','Stomach, mouth, esophagus, intestines','Esophagus, mouth, stomach, intestines'),
    mc('A kid asks what the esophagus does. What do you explain?','Moves food from the mouth to the stomach','Absorbs nutrients from food into the blood','Makes bile that helps break down fats','Stores waste until it leaves the body'),
    mc('A grandparent asks which organ makes bile to help digest fats. What do you answer?','Liver','Stomach','Mouth','Esophagus'),
    mc('A visitor asks how the digestive system and circulatory system work together. What do you say?','The blood carries absorbed nutrients to cells','Blood breaks down food while it is in the stomach','The heart pushes food through the intestines','The stomach pumps blood out to the rest of the body')
  ]
};
// Phase 1 Science bank: extra Biology Unit 1 questions, tagged by difficulty (1-3).
// They join the built-in pools above; practice still draws 4 at random and unit tests draw from the whole pool.
const mcLevel = (difficulty, prompt, correct, ...wrong) => ({...mc(prompt, correct, ...wrong), difficulty});
/* Reserved test pool (owner, Oct 30, 2026; docs/BLIND-REVIEW.md): questions written only for the unit test. They are
   marked testOnly:true, so practice, quizzes, the test review and the games never show them, and the unit test draws from
   them (testOnlyIds and pickTestItems in questionTypes.js). Each one was blind-solved by a fresh reviewer before it went in. */
const reserveForTest = (bank, reserved) => { for (const [skill, list] of Object.entries(reserved)) (bank[skill] = bank[skill] || []).push(...list.map(question => ({...question, testOnly:true}))); };
const BIO1_EXTRA_QUESTIONS = {
  cellsOrganisms:[
    mcLevel(1,'A kid asks what all living things have in common. What do you say?','They are made of one or more cells','They each make their own food','They each have a brain and a heartbeat','They are each made of many cells'),
    mcLevel(1,'A visitor asks where new cells come from. What do you explain?','From cells that already exist','From nonliving dust and dirt','From food the body breaks down','From tiny pieces of other tissues'),
    mcLevel(1,'Your group stops at a model of a heart. What level of organization is the heart?','An organ','A single cell','An organism','An organ system'),
    mcLevel(2,'A visitor asks how a one-celled amoeba stays alive without organs. What do you explain?','Its one cell does every life job','It shares organs with other amoebas','It takes in energy without needing food','Its tissues do the jobs of organs'),
    mcLevel(2,'The stomach, intestines, and liver work together. What is a group of organs working together called?','An organ system','A group of tissues','An organism','A population'),
    mcLevel(2,'A parent asks why a skin cell and a nerve cell look so different. What do you say?','Each cell’s shape fits its job','Nerve cells have more DNA than skin cells','Skin cells change shape as they get old','One of the two cells is not alive'),
    mcLevel(2,'A student looks at two samples under a microscope. Sample A is a single cell. Sample B has thousands of cells forming roots and leaves. Which statement is supported?','A is unicellular; B is multicellular','A is multicellular; B is unicellular','Both are unicellular','Neither is made of cells'),
    mcLevel(3,'Your group builds a model of a dog. Which level of organization comes right above “organ system”?','Organism','Tissue','Organ','Population'),
    mcLevel(3,'A student claims a mushroom is alive. Which evidence best supports the claim?','It is made of cells and grows','It is brown and soft to touch','It grows in shady places','It feels cool and damp'),
    mcLevel(3,'A visitor asks why other body systems suffer if the digestive system stops working. What is the best answer?','Body systems depend on each other','Each system is really just one organ','The digestive system controls the others','Cells can store years of nutrients')
  ],
  cellPartsU:[
    mcLevel(1,'A kid asks what the jelly-like fluid filling a cell is called. What do you say?','Cytoplasm','Nucleus','Cell wall','Chloroplast'),
    mcLevel(1,'A visitor asks which part stores water in a plant cell. What do you point to?','The large vacuole','The nucleus','The cell membrane','The mitochondria'),
    mcLevel(1,'A kid asks which part holds the cell’s DNA. What do you point to?','Nucleus','Vacuole','Cytoplasm','Cell wall'),
    mcLevel(2,'A parent asks which two parts plant cells have that animal cells do not. What do you say?','Cell wall and chloroplasts','Nucleus and membrane','Mitochondria and cytoplasm','Membrane and cytoplasm'),
    mcLevel(2,'A visitor asks which parts both plant and animal cells have. Which answer is right?','Nucleus, membrane, mitochondria','Cell wall, chloroplast, vacuole','Chloroplast, nucleus, cell wall','Cell wall and membrane only'),
    mcLevel(2,'A kid asks what the cell wall does. What do you explain?','Gives the cell stiff support','Makes food from sunlight','Stores the cell’s DNA','Controls what enters the cell'),
    mcLevel(2,'A visitor asks which small parts build proteins for the cell. What do you say?','Ribosomes','Vacuoles','Cell walls','Chloroplasts'),
    mcLevel(2,'In a city model of a cell, the warehouse stores water and supplies. Which cell part is the warehouse like?','Vacuole','Nucleus','Mitochondria','Chloroplast'),
    mcLevel(3,'A student sees two cells under a microscope. Cell X has a cell wall, chloroplasts, and a large vacuole. Cell Y has none of these. Which conclusion is best supported?','X is a plant cell; Y is an animal cell','X is an animal cell; Y is a plant cell','Both are animal cells','Both are plant cells'),
    mcLevel(3,'A visitor asks why a root cell deep underground has no chloroplasts. What is the best explanation?','No light reaches roots to make food','Roots are not made of cells','Only animal cells have chloroplasts','Root cells have no nucleus')
  ],
  cellPartsA:[
    mcLevel(1,'A student wants to turn a plant cell model into an animal cell model. Which part should be removed?','Cell wall','Nucleus','Mitochondria','Cell membrane'),
    mcLevel(2,'A cell’s membrane is damaged and harmful substances leak in. Which job has failed?','Controlling what enters and leaves','Making food from sunlight','Storing and copying the cell’s DNA','Giving the cell stiff support'),
    mcLevel(2,'A plant droops after days without water. Which cell part has lost the most water?','The central vacuole','The cell nucleus','The cell membrane','The chloroplasts in its leaves'),
    mcLevel(2,'Which cell would likely have the most chloroplasts?','A cell from the top of a leaf','A cell from deep in a root','A cell from a human’s skin','A cell from the inside of a stem'),
    mcLevel(2,'A visitor asks why animal cells can change shape but plant cells mostly cannot. What do you explain?','Animal cells lack a rigid cell wall','Animal cells lack a nucleus inside','Plant cells lack a flexible cell membrane','Plant cells lack cytoplasm inside'),
    mcLevel(2,'A kid’s scraped knee heals as new skin cells form. Where do the new cells come from?','Existing skin cells dividing','Blood cells turning into skin','Cells from the bandage material','Bone cells moving up to the skin'),
    mcLevel(3,'A poison stops a cell’s mitochondria from working. What is the most likely result?','The cell runs low on energy','The cell makes extra food','The cell wall grows thicker','The DNA copies faster'),
    mcLevel(3,'Scientists remove the nucleus from a cell. What will the cell most likely be unable to do?','Divide to make new cells','Keep its cytoplasm inside','Hold its shape with a membrane','Take up space in the tissue'),
    mcLevel(3,'Chloroplast counts in a leaf: top-layer cells average 40, bottom-layer cells average 10. Which statement is best supported?','Top cells likely get more light','Bottom cells likely make more food','Bottom cells have a larger nucleus','Top cells likely need less energy'),
    mcLevel(3,'A student’s cell model has a nucleus, membrane, cytoplasm, mitochondria, and a cell wall, but no chloroplasts. Which cell could it be?','A plant root cell','A human muscle cell','A human skin cell','A cell from a leaf’s top')
  ],
  plantSuccessU:[
    mcLevel(1,'A kid asks which flower part makes pollen. What do you point to?','The stamen','The pistil','The petal','The sepal'),
    mcLevel(1,'A visitor asks which flower part receives pollen and holds the ovules. What do you say?','The pistil','The stamen','The sepal','The stem'),
    mcLevel(1,'A visitor asks why many fruits taste sweet. What do you explain?','Animals eat them and spread seeds','Sweetness keeps animals away from them','Sugar helps the roots absorb water','Sugar makes the leaves turn greener'),
    mcLevel(2,'A flower smells like rotting meat. Which animal is it most likely trying to attract?','Flies','Bees','Hummingbirds','Butterflies'),
    mcLevel(2,'A visitor asks why wind-pollinated grasses have small, plain flowers. What is the best explanation?','They do not need to attract animals','They bloom at night when it is dark','Their pollen is too heavy for wind','Small flowers make more nectar for bees'),
    mcLevel(2,'Which plant behavior helps reproductive success?','Flowers opening when bees are out','Leaves turning brown in the winter','Roots growing deeper to find water','Stems bending toward the sunlight'),
    mcLevel(2,'A hummingbird drinks nectar from a long red flower. How does this help the plant?','The bird carries pollen to other flowers','The bird eats seeds and drops the shells','The bird drinks extra water for the plant','The bird cleans old petals off the flower'),
    mcLevel(2,'Students counted bee visits in one hour. Flower A (bright, scented): 42 visits. Flower B (pale, no scent): 6 visits. Which claim is best supported?','Bright, scented flowers attract more bees','Bees choose pale flowers whenever they can','Scent keeps most of the bees away','Bees visit flowers in a random order'),
    mcLevel(3,'One plant makes 1,000 tiny seeds. Another makes 5 large seeds full of stored food. Which statement is true?','Both are strategies for reproductive success','The tiny seeds are too small to grow into plants','The large seeds will grow into larger flowers','Small seeds are a sign the plant is unhealthy'),
    mcLevel(3,'A farm loses most of its bees. Which crop would be hurt the least?','Wind-pollinated wheat','Bee-pollinated apples','Bee-pollinated squash','Bee-pollinated melons')
  ],
  plantSuccessA:[
    mcLevel(1,'A bee picks up pollen from one flower. What must happen next for the plant to make seeds?','Pollen reaches a flower’s pistil','The pollen falls into the soil and grows','The bee carries the pollen back to its hive','The pollen sticks to the flower’s leaves'),
    mcLevel(2,'A gardener wants more tomatoes. Which action would most help pollination?','Plant bee-attracting flowers nearby','Spray the plants with a strong bug killer','Pick off the flowers so fruit grows bigger','Cover the plants with plastic at night'),
    mcLevel(2,'A plant grows beside a river, and its seeds have air pockets. How does this trait help it reproduce?','Its seeds can float to new places','Its seeds sink and stay near the parent','Its seeds attract more bees to the flower','Its seeds can soak up extra river water'),
    mcLevel(2,'A flower has patterns that only bees can see. What is the best explanation?','The patterns guide bees to nectar','The patterns warn bees to stay away','The patterns help the petals catch sunlight','The patterns keep the nectar cool'),
    mcLevel(2,'Which flower is most likely pollinated by bats?','Large and pale, opens at night','Small and green, blown by wind','Tiny and red, opens at noon','Bright blue, closes before sunset'),
    mcLevel(3,'Which trait would most help a plant that lives where very few insects live?','Pollen that blows in the wind','Bright, sweet-smelling petals','Lots of sugary nectar','Landing pads for bees'),
    mcLevel(3,'Students cover some apple blossoms with mesh bags so insects can’t reach them. Covered: 3 apples. Uncovered: 41 apples. What do the results show?','Insect pollination increases fruit','Mesh bags make the apples bigger','Apples form fine without pollination','Insects damage most of the apple flowers'),
    mcLevel(3,'A student wants to test whether scent attracts moths. Which setup is a fair test?','Two identical flowers, one scented','One red flower and one white flower','Flowers in sun and flowers in shade','Different flowers on different nights'),
    mcLevel(3,'Why might it help a bee-pollinated plant to bloom at the same time as others of its kind?','More pollen gets shared between them','Bees fly farther when flowers are rare','Flowers last longer with fewer neighbors','Its seeds will need less water to sprout'),
    mcLevel(3,'A student claims large seeds with more stored food survive better in shade. Which evidence would best support this?','Large seeds sprout more often in shade','Small seeds blow farther in the wind','Large seeds weigh more than small seeds','Shade plants grow fewer leaves than others')
  ],
  asexualPlants:[
    mcLevel(1,'A visitor asks what a potato “eye” can do when planted. What do you say?','Grow into a new potato plant','Make pollen for potato flowers','Turn into a seed in the soil','Grow roots that feed the old plant'),
    mcLevel(1,'Which is an example of asexual reproduction?','A spider plant growing baby plantlets','A bee carrying pollen to a flower','A seed forming after pollination','A fruit forming from a pollinated flower'),
    mcLevel(2,'A farmer has a strawberry plant with perfect, sweet berries. Why might she grow new plants from its runners instead of seeds?','Runners make copies with the same traits','Runners mix in traits from other plants','Seeds make copies that are exactly the same','Runners grow fruit faster than any seed'),
    mcLevel(2,'A visitor asks for one downside of asexual reproduction. What do you explain?','One disease can harm every copy','It needs two parents to work','It takes many years to make one plant','It can only happen in a greenhouse'),
    mcLevel(2,'A gardener sets a succulent leaf on soil, and it grows roots and a new plant. What does this show?','Some plants can grow from body parts','A leaf is really a kind of seed','Succulents need pollen to make leaves','The plant reproduced sexually'),
    mcLevel(2,'Onions and tulips grow new bulbs underground. How many parents does each new bulb come from?','Just one parent bulb','Two parent bulbs','Two bulbs from nearby plants','One bulb plus pollen from a bee'),
    mcLevel(2,'A kid asks if one plant can use both seeds and runners. What do you say?','Yes, strawberries do both','No, a plant picks just one way','Yes, but just trees can do both','No, runners stop it making seeds'),
    mcLevel(3,'In a field of identical banana plants, 90% got sick from one fungus. In a mixed field grown from seeds, 20% got sick. Which explanation fits best?','Identical plants share the same weakness','Plants grown from seeds cannot get sick','The fungus prefers fields with mixed plants','Banana plants in the mixed field were older'),
    mcLevel(3,'Why can asexual reproduction help a plant spread quickly in a good habitat?','It needs no partner or pollinator','It makes plants that are larger','It mixes traits from two parents','It makes seeds that travel farther'),
    mcLevel(3,'A grower wants to keep a rare orchid’s traits exactly the same. Which method should she use?','Take cuttings from the plant','Plant seeds from cross-pollination','Let bees pollinate it with others','Collect seeds from wild orchids')
  ],
  sexualPlants:[
    mcLevel(1,'A kid asks how many parents are usually involved in sexual reproduction. What do you say?','Two','One','Three','None'),
    mcLevel(1,'A visitor asks what grows inside most fruits. What do you say?','Seeds','Roots','Pollen','Leaves'),
    mcLevel(2,'After pollination, a sperm cell from the pollen joins an egg cell. What is this step called?','Fertilization','Germination','Dispersal','Photosynthesis'),
    mcLevel(2,'Which flower part grows into the fruit after fertilization?','The ovary','The petal','The stamen','The sepal'),
    mcLevel(2,'A visitor asks what is inside a seed. Which answer is best?','A tiny plant and stored food','Pollen and sweet nectar for bees','A small flower and fruit','Water, air, and a root'),
    mcLevel(2,'Which step comes right before fertilization in flowering plants?','Pollination','Seed dispersal','Germination','Fruit ripening'),
    mcLevel(2,'A flower’s petals fall off and a pod starts to swell. What is most likely happening?','Seeds are forming inside','The plant is about to die','New roots are forming there','Pollen is being made inside'),
    mcLevel(3,'A visitor asks for one benefit of sexual reproduction. What is the best answer?','Variety helps some offspring survive','Offspring are copies of one parent','Plants can make seeds without pollen','Offspring grow faster than their parents'),
    mcLevel(3,'Which order is correct for a flowering plant’s life cycle?','Pollination, fertilization, seed, germination','Germination, pollination, seed, fertilization','Seed, fertilization, pollination, germination','Fertilization, pollination, germination, seed'),
    mcLevel(3,'A red-flowered plant is crossed with a white-flowered plant. Of 40 offspring: 22 pink, 10 red, 8 white. What does this show?','Offspring can differ from both parents','Offspring copy one parent most of the time','Flower color is not passed on to offspring','The plant reproduced asexually this time')
  ],
  seedDispersal:[
    mcLevel(1,'A squirrel buries acorns and forgets some. How does this help the oak tree?','Some acorns grow in new places','The acorns turn into new leaves','The squirrel helps water the tree','The tree makes fewer acorns next year'),
    mcLevel(1,'Dandelion seeds have fluffy parachutes. How are they dispersed?','By wind','By water','By animals eating them','By exploding pods'),
    mcLevel(2,'A bird eats berries and later drops the seeds far away in its waste. What does this show?','Animals can disperse seeds','Birds plant seeds on purpose','Seeds can’t survive digestion','Berries are not fruits'),
    mcLevel(2,'Some pea pods dry out and burst open, flinging seeds. How does this help the plant?','Seeds land away from the parent','Seeds stay right under the parent','It attracts pollinators','It keeps seeds from growing'),
    mcLevel(2,'A seed has a hard, waterproof coat and floats. Where would it most likely spread?','Along rivers and coasts','On dry mountaintops','Stuck in the fur of passing animals','Right under its parent'),
    mcLevel(2,'A plant grows on a cliff above the ocean. Which seed type would most help it spread?','Seeds that float','Seeds with hooks','Heavy seeds that drop','Seeds that need burying'),
    mcLevel(3,'Students dropped seeds in front of a fan. Average distance: Seed A (wings) 3.1 m, Seed B (round, smooth) 0.4 m, Seed C (fluffy) 4.8 m. Which seed is best adapted for wind?','Seed C','Seed A','Seed B','All are equal'),
    mcLevel(3,'Students test how far different seeds travel in wind from a fan. What should stay the same for every seed?','Drop height and fan speed','The type of seed tested','The distance each seed goes','The shape of each seed'),
    mcLevel(3,'Why do many fruits change from green to bright red when ripe?','To show animals seeds are ready','To keep hungry animals away','To catch more of the wind','To help the fruit float on water'),
    mcLevel(3,'A student claims animals that eat fruit help plants spread. Which evidence best supports this?','Seeds in droppings sprout far away','Animals also eat many plant leaves','Fruit rots on the ground if not eaten','Some animals dig up roots to eat them')
  ],
  digestionHumans:[
    mcLevel(1,'A visitor asks what saliva does. What do you say?','Starts breaking down food','Pumps food to the stomach','Absorbs nutrients','Stores bile'),
    mcLevel(1,'Which organ connects the mouth to the stomach?','Esophagus','Small intestine','Liver','Large intestine'),
    mcLevel(1,'A kid asks what the tongue does during digestion. What do you say?','Moves food and helps swallowing','Makes the acid used by the stomach','Absorbs water from food you chew','Makes bile that helps digest fat'),
    mcLevel(1,'Which teeth are best for biting off pieces of food?','Incisors','Molars','Premolars','Wisdom teeth'),
    mcLevel(2,'Chewing is mechanical digestion. Which is an example of chemical digestion?','Saliva breaking down starch','Teeth grinding food into small pieces','The tongue moving food','Swallowing a large bite'),
    mcLevel(2,'When the stomach churns and squeezes food, what kind of digestion is it?','Mechanical digestion','Chemical digestion','Absorption of nutrients','Blood circulation'),
    mcLevel(2,'Your group asks where chemical digestion of protein begins. What do you say?','In the stomach','In the mouth','In the large intestine','In the esophagus'),
    mcLevel(3,'A visitor asks how food moves down the esophagus, even when you lie down. What do you explain?','Muscles squeeze it along in waves','Gravity pulls it down to the stomach','Saliva pushes the food down the tube','The stomach sucks the food downward'),
    mcLevel(3,'A visitor asks why stomach acid doesn’t digest the stomach itself. What do you explain?','A mucus lining protects it','The acid is not very strong','The stomach is made of bone','Food blocks all the acid'),
    mcLevel(3,'A student mixes starch with saliva in one tube and with water in another. After 10 minutes, the saliva tube has little starch left; the water tube has lots. What does this show?','Saliva breaks down starch','Water breaks down starch','Starch cannot be broken down','Both tubes acted the same')
  ],
  digestionIntestines:[
    mcLevel(1,'A visitor asks where absorbed nutrients go from the small intestine. What do you say?','Into the blood','Into the lungs','Back to the stomach','Into the bones directly'),
    mcLevel(1,'Which is the longest part of the digestive tract?','Small intestine','Large intestine','Stomach','Esophagus'),
    mcLevel(2,'What does the pancreas send to the small intestine?','Digestive enzymes','Saliva and mucus','Extra stomach acid','Red blood cells'),
    mcLevel(2,'A kid asks what helpful bacteria in the large intestine do. What do you say?','Break down some leftover food','Make acid for the stomach','Grind food into smaller pieces','Carry oxygen to the body’s cells'),
    mcLevel(2,'A visitor asks what bile does in the small intestine. What do you explain?','Breaks fat into small drops','Absorbs water from the food','Kills bacteria in the food','Turns starch into simple sugar'),
    mcLevel(2,'After the large intestine absorbs water, where does the leftover waste go?','To the rectum to leave the body','Back up into the small intestine','Into the blood to be cleaned','Back to the stomach to be digested'),
    mcLevel(3,'A person has very watery waste. Which organ is most likely not doing its job well?','Large intestine','Esophagus','The stomach lining','Gallbladder'),
    mcLevel(3,'A student compares two tubes of the same length: one smooth inside, one with many folds. Which could absorb more?','The folded tube','The smooth tube','Both exactly the same','Neither tube'),
    mcLevel(3,'An illness flattens the villi in the small intestine. What would most likely happen?','Fewer nutrients would be absorbed','More water would be absorbed','Food would be chewed more slowly','The stomach would make much less acid'),
    mcLevel(3,'Lab samples show protein is only partly broken down in the stomach, but protein, fat, and starch are fully broken down in the small intestine. Which conclusion fits?','Most digestion finishes in the small intestine','The stomach completes the digestion of these foods','The small intestine absorbs but does not digest','Protein digestion is finished before the stomach')
  ],
  humanDigestion:[
    mcLevel(1,'A visitor asks why we need a digestive system at all. What do you say?','Cells need small nutrient pieces','Food is already small enough for cells','It makes new blood cells from food','It controls how fast we breathe'),
    mcLevel(2,'Which two organs make digestive juices but are not on food’s path?','Liver and pancreas','Stomach and esophagus','Mouth and tongue','Small and large intestine'),
    mcLevel(2,'Fiber is not digested. Why is it still useful?','It helps waste move through','It gives the body the most energy','It is turned into new muscle','It is absorbed into the blood'),
    mcLevel(2,'Average time food spends in each organ: mouth 1 minute, stomach 3 hours, small intestine 5 hours, large intestine 30 hours. Where does food stay longest?','Large intestine','Stomach','Small intestine','Mouth'),
    mcLevel(2,'Which systems deliver the oxygen that digestive organs need?','Respiratory and circulatory','Skeletal and muscular','Nervous and skeletal','Digestive and immune systems'),
    mcLevel(3,'A person’s pancreas stops making enzymes. Which problem is most likely?','Food is not fully broken down','Food cannot be swallowed','Teeth stop grinding food','The stomach stops making acid'),
    mcLevel(3,'A visitor asks how the nervous system helps digestion. What do you explain?','It signals muscles to move food','It absorbs the nutrients from food','It makes the bile that breaks down fat','It stores the waste until it leaves'),
    mcLevel(3,'Which pair shows mechanical digestion and then chemical digestion?','Teeth chewing, then enzymes acting','Enzymes acting, then teeth chewing','Absorption, then teeth chewing','Water absorbed, then enzymes acting'),
    mcLevel(3,'Blood leaving the small intestine carries more nutrients than blood going in. What does this show?','Nutrients were absorbed there','Blood makes its own nutrients','The intestine removes nutrients','Nothing happens in the intestine'),
    mcLevel(3,'A student claims the small intestine is built for absorption. Which evidence best supports this?','It is long and lined with villi','It sits right next to the stomach','It is shaped like a long tube','It contains some helpful bacteria')
  ]
};
Object.entries(BIO1_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { BIO1_QUESTIONS[skillId] = [...(BIO1_QUESTIONS[skillId] || []), ...questions]; });
// Difficulty tags (1-3) for the original Biology Unit 1 questions, in their order in BIO1_QUESTIONS.
const BIO1_BUILT_IN_LEVELS = {
  cellsOrganisms:[1,2,1,2], cellPartsU:[1,1,1,1], cellPartsA:[1,2,2,1], plantSuccessU:[1,1,1,2],
  plantSuccessA:[2,2,2,2], asexualPlants:[1,1,1,1], sexualPlants:[1,1,2,2], seedDispersal:[1,1,2,1],
  digestionHumans:[1,1,1,1], digestionIntestines:[1,1,2,1], humanDigestion:[2,1,1,2]
};
Object.entries(BIO1_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => {
  const question = BIO1_QUESTIONS[skillId]?.[index];
  if (question && question.difficulty == null) question.difficulty = level;
}));
// Biology Unit 2: Organism growth and reproduction (Khan Academy middle school biology). The student is a tour guide at
// the Pet World Petting Zoo. Each group has a "hook" (a true story about why this matters) and each skill a "why" line;
// both are shown on the unit page above the practice. Docs: docs/SCIENCE-UNIT2.md
const BIO_UNIT2 = [
  {id:'traitsReproU',name:'Understand: Traits and reproduction',lesson:'Offspring inherit traits from their parents through genes. In sexual reproduction, two parents each give half their genes, so offspring vary. In asexual reproduction, one parent makes offspring with the same genes as itself. Acquired traits (a scar, a learned trick) are not passed on.',why:'It explains why you look like your family, but not exactly like anyone in it.'},
  {id:'traitsReproA',name:'Apply: Traits and reproduction',lesson:'Use what you know about genes and reproduction to predict offspring. Clones are fast and predictable, but they share every weakness. Variety from sexual reproduction makes it more likely that some offspring survive a change.',why:'Farmers choose between clones and seeds every season, and the banana story shows what is at stake.'},
  {id:'animalBehaviorU',name:'Understand: Animal behavior and reproductive success',lesson:'Animals have behaviors that raise their chances of having offspring that survive: courtship displays and songs to attract mates, building nests, guarding and feeding young, living in herds, and migrating to safe places to raise young.',why:'An emperor penguin dad stands through the Antarctic winter for about two months with an egg on his feet, eating nothing. A behavior that hard only lasts because it helps babies survive.'},
  {id:'animalBehaviorA',name:'Apply: Animal behavior and reproductive success',lesson:'Use evidence to explain how a behavior helps offspring survive. Some animals have many young and give no care; others have a few young and give lots of care. Both strategies can work in the right environment.',why:'Wildlife scientists use these ideas to protect animals, like keeping beaches dark at night so baby sea turtles can find the ocean.'},
  {id:'plantStructuresU',name:'Understand: Plant structures and reproductive success',lesson:'Plants have special structures that help them reproduce: bright petals, scent, and nectar attract pollinators; fruit, hooks, wings, and fluff help seeds travel. Animals that visit plants often help them reproduce.',why:'About one out of every three bites of food you eat depends on pollinators like bees.'},
  {id:'plantStructuresA',name:'Apply: Plant structures and reproductive success',lesson:'Use evidence to explain how a plant structure or an animal’s behavior raises a plant’s chance of making seeds and spreading them.',why:'Velcro was invented after an engineer, George de Mestral, studied the burrs stuck to his dog. Seed structures solve real problems.'},
  {id:'growthEnvU',name:'Understand: Organism growth and the environment',lesson:'How big an organism grows depends on genetic factors (the genes from its parents) and environmental factors (food, water, light, space, temperature). Genes set the range; the environment decides where in that range an organism ends up.',why:'Two puppies from the same litter can grow to different sizes if one gets less food.'},
  {id:'growthEnvA',name:'Apply: Organism growth and the environment',lesson:'Use data to explain how a change in the environment changes growth. For example, extra nutrients and warm water can make algae grow so fast they harm a whole lake.',why:'The same rules that make a garden grow can turn a lake green and dangerous, like Lake Erie in 2014.'}
];
const BIO_GROUPS2 = [
  {id:'traits',name:'Traits, reproduction, and animal behavior',quizName:'Quiz 1',learn:'How offspring inherit traits from one or two parents, why variety matters, and how animal behaviors help young survive.',skills:['traitsReproU','traitsReproA','animalBehaviorU','animalBehaviorA'],
    hook:{emoji:'🍌',title:'The banana that disappeared',story:'Your great-great-grandparents ate a different banana, the Gros Michel. Every Gros Michel plant was a clone, grown from a piece of another plant, so they all had the same weakness. When a soil fungus called Panama disease spread in the early 1900s, it wiped out farm after farm, and by the 1960s growers had switched to the Cavendish banana. Almost every banana in stores today is a Cavendish, also a clone, and a new strain of the fungus called TR4 is spreading. How living things reproduce decides whether a population can survive a surprise.'}},
  {id:'growth',name:'Plant reproduction and growth in the environment',quizName:'Quiz 2',learn:'How flowers, fruit, and seeds help plants reproduce with help from animals, and how genes and the environment work together to decide how organisms grow.',skills:['plantStructuresU','plantStructuresA','growthEnvU','growthEnvA'],
    hook:{emoji:'🚱',title:'The city that couldn’t drink its water',story:'In August 2014, about 400,000 people in and around Toledo, Ohio, were told not to drink their tap water for three days. The reason was algae. Fertilizer washing off farms and lawns fed a huge algae bloom in Lake Erie, right where the city takes in its water, and the bloom made a toxin. Living things grow according to their genes and their environment. Change the environment (more nutrients, warmer water) and you change how fast things grow, sometimes in ways nobody wanted.'}}
];
const BIO2_QUESTIONS = {
  traitsReproU:[
    mc('A kid on your tour asks: “Why does this lamb look like its mom but not exactly like her?”','It inherited genes from both parents','It copied each of its traits from its mom','It chose its traits while it was growing','It got its genes from its dad and no one else'),
    mc('A visitor asks what an inherited trait is. What do you say?','A trait passed from parents through genes','A skill an animal learns by watching other animals around it','A change caused by an injury or accident','A trait an animal gets from the food it eats'),
    mc('A grandparent points at the goat with a torn ear from a fence and asks if her kids will have torn ears. What do you say?','No, it happened during the goat’s life','Yes, so its kids will be born with torn ears','Yes, because goats inherit their ears','No, ears are not passed from parents'),
    mc('A kid asks how many parents give genes to a baby made by sexual reproduction. What do you say?','Two','One','Three','None')
  ],
  traitsReproA:[
    mc('A farmer on your tour wants every new apple tree to taste exactly like her best tree. What do you suggest?','Grow new trees from cuttings of that tree','Plant the seeds from that tree’s own apples','Let bees pollinate it with other trees','Plant seeds from a neighbor’s tree'),
    mc('A visitor asks why one disease could wipe out a whole field of cloned plants. What do you explain?','Every plant has the same weakness','The plants grow too close together','Clones never get any sunlight','Clones need more water than others'),
    mc('A kid asks which group is more likely to have some survivors after a brand-new disease arrives. What do you say?','A herd made by sexual reproduction','A field of identical clones','A greenhouse of cuttings from one plant','A patch of runners from one strawberry'),
    mc('A parent asks which plants usually grow in number faster in good weather with no disease. What do you say?','Plants that reproduce asexually','Plants that need a pollinator','Animals that need to find a mate','Animals that raise one baby a year')
  ],
  animalBehaviorU:[
    mc('A kid on your tour watches a peacock spread its tail and asks: “Why does he do that?”','To attract a mate','To scare away the rain','To cool off on a hot day','To find food in the grass'),
    mc('A visitor asks why the mother hen sits on her eggs all day. What do you say?','She keeps the eggs warm so they develop','She is too tired to leave the nest','She is hiding from the other hens','She is waiting for the eggs to grow bigger'),
    mc('A parent asks what “parental care” means. What do you explain?','Parents feeding and protecting their young','Young animals taking care of their parents','Parents leaving eggs and swimming away','Animals choosing where to sleep at night'),
    mc('A kid asks why geese fly south together every fall and come back in spring. Which behavior is this?','Migration','Courtship','Nest building','Hibernation')
  ],
  animalBehaviorA:[
    mc('A kid asks: “Two duck pairs nest by the pond. One guards its ducklings and one doesn’t. Which will probably raise more ducklings?”','The pair that guards its ducklings','The pair that does not guard them','Both pairs will raise exactly the same number','Neither pair will raise any'),
    mc('A visitor asks why some fish lay thousands of eggs. What is the best explanation?','Most eggs get eaten, so a few survive','Fish can only lay eggs in big piles','The eggs need each other to stay warm','Big piles of eggs scare away predators'),
    mc('A parent reads that birds that sing longer songs attract more mates. Which prediction fits?','Long-song males will have more chicks','Short-song males will have more chicks','Song length will not affect chicks','Females will stop singing too'),
    mc('A grandparent asks why bright beach lights are bad for baby sea turtles. What do you explain?','Hatchlings head toward light and get lost','The light makes the eggs hatch much too early','Lights make the sand too hot','Turtles are afraid of electricity')
  ],
  plantStructuresU:[
    mc('A kid in the Feed Garden asks why the squash flowers are big and bright yellow. What do you say?','They attract bees that carry pollen','They keep the leaves cool in the sun','They store water for dry days','They scare away hungry rabbits'),
    mc('A visitor asks what nectar is for. What do you explain?','It rewards animals that carry pollen','It feeds the plant’s own roots','It keeps the flower from freezing','It helps the flower’s seeds grow bigger'),
    mc('A burr sticks to a goat’s fur. A grandparent asks how this helps the plant. What do you say?','The goat moves the seed somewhere new','The goat waters the seed with its fur','The burr protects the goat from bugs','The burr helps the goat stay warm'),
    mc('A kid asks why apple trees grow sweet fruit around their seeds. What is the main reason?','Animals eat it and spread the seeds','The fruit feeds the tree during winter','The fruit keeps the seeds from sprouting','Sweet fruit attracts bees to the flowers')
  ],
  plantStructuresA:[
    mc('A visitor notices that bees never visit one tomato bed. What do you predict?','That bed will make fewer tomatoes','That bed will make more tomatoes','The bed will grow much taller roots','The leaves will turn into fruit'),
    mc('A kid asks why the zoo plants flowers that bloom at different times all summer. What do you explain?','Bees have food all season, so they stay','Flowers that bloom late make the soil softer','Different flowers keep goats out of the garden','It makes the garden need less water each day'),
    mc('A grandparent asks how the zoo’s squirrels help the oak trees. What do you say?','They bury acorns and forget some','They eat the oak’s old leaves each fall','They water the oak roots after it rains','They pollinate the acorns in spring'),
    mc('Students bagged some squash flowers so insects could not reach them. Bagged: 1 squash. Open: 9 squash. A parent asks what that shows. What do you say?','Insect visits help squash form','Bags make squash grow much larger','Squash grows best in the dark','Insects eat squash flowers')
  ],
  growthEnvU:[
    mc('A kid asks why two lambs from the same mom grew to different sizes. What is one likely reason?','One got more food than the other','One was born on a different day of the week','Lambs grow only when it rains','One lamb chose to stop growing'),
    mc('A visitor asks what “environmental factors” are. What do you say?','Conditions around it, like food and light','The genes it got from its two parents','The species name it was given','How old its parents were when it was born'),
    mc('A grandparent asks if genes alone decide how tall a plant grows. What is the best answer?','No, light, water, and soil matter too','Yes, genes decide how tall it grows','No, the weather is the one thing that matters','Yes, but just for trees'),
    mc('A parent asks: “Two identical clone plants grew in sun and shade, and the sun plant grew bigger. What caused the difference?”','The environment','Their genes','Their species','How old the plants are')
  ],
  growthEnvA:[
    mc('At the Duck Pond, a kid asks why the water turned bright green this summer. What do you explain?','Fertilizer and warm water fed an algae bloom','The ducks stirred green mud up from the bottom','Cold weather made the water change color','Fish turned the water green by eating plants'),
    mc('A visitor asks where extra nutrients in a lake often come from. What do you say?','Fertilizer washing off farms and lawns','Fish breathing underwater','Snow melting on mountains very far away','Sunlight hitting the water'),
    mc('A grandparent asks how algae can kill fish when algae don’t eat fish. What do you explain?','Dead algae rot and use up the oxygen','Algae wrap around fish in long sticky threads','The algae eat all the fish food','The algae make the water too cold'),
    mc('A parent asks which change would most help stop algae blooms in a lake near farms. What do you say?','Grass strips that catch runoff','Adding more fertilizer to the fields','Removing all the fish from the lake','Painting the lake bottom white')
  ]
};
const BIO2_EXTRA_QUESTIONS = {
  traitsReproU:[
    mcLevel(1,'A visitor asks what offspring are. What do you say?','The young made by parents','The oldest animals in a herd','The food parents bring to babies','The place where babies are born'),
    mcLevel(1,'A kid asks how many parents each offspring has in asexual reproduction. What do you say?','One','Two','Three','Four'),
    mcLevel(1,'A kid asks which trait a chick inherits rather than learns. Which is it?','The color of its feathers','Which bowl it eats from','The name the keepers gave it','Where it likes to nap'),
    mcLevel(2,'A visitor asks why offspring from sexual reproduction aren’t identical to each other. What do you explain?','Each gets its own mix of the parents’ genes','Each one eats different food in the barn','Each one copies a different older relative','Their genes change as they grow older each year'),
    mcLevel(2,'Offspring made by asexual reproduction are best described as:','Genetically identical to the parent','A blend of two parents’ traits','Always bigger and stronger than the parent','A brand new kind of living thing'),
    mcLevel(2,'A bunny was born with long ears like its dad. Later it learned to come when called. Which trait is acquired?','Coming when called','Its long floppy ears','Its gray fur color','Its brown eye color'),
    mcLevel(3,'A student says, “Asexual reproduction is useless because there is no variation.” What is the best reply?','It makes many offspring fast without a partner','It makes healthier offspring than sexual reproduction','It mixes genes from two parents','It happens just in plants'),
    mcLevel(3,'About what share of its genes does a sexually produced offspring get from its mother?','About half','Almost all of them','Hardly any of them','About one tenth'),
    mcLevel(3,'Two black goats have a white kid. What is the best explanation?','Both parents carried a hidden gene for white','The kid’s color came from the food its mother ate','The kid copied the color of a nearby goat','White fur was caused by cold weather')
  ],
  traitsReproA:[
    mcLevel(1,'A gardener plants a piece of potato and gets a new plant. Its traits will be:','The same as the parent potato','A mix of two parent potatoes','Totally different from the parent','Picked by the gardener'),
    mcLevel(2,'Kittens from the same litter look different from each other. Which kind of reproduction made them?','Sexual reproduction','Asexual reproduction','Budding','Cloning from cuttings'),
    mcLevel(2,'Why do farmers who grow only one banana variety, all clones, worry about new diseases?','One disease could harm every plant','Clones cannot make any fruit at all','Clones grow too slowly to sell','Bananas need two parents to grow'),
    mcLevel(2,'A piece of coral breaks off and grows into a new coral. What does this show?','Asexual reproduction','Sexual reproduction','Cross-pollination by bees','Seasonal migration'),
    mcLevel(3,'Island A has 50 identical clone plants. Island B has 50 plants grown from seeds. A cold snap kills every plant without cold resistance, and Island A’s clones lack it. What most likely happens?','Island A loses all its plants; Island B keeps some','Both islands lose all their plants','Island B loses all its plants; Island A keeps some','Neither island loses any plants'),
    mcLevel(3,'Gros Michel bananas were all clones. In the 1900s, Panama disease spread through the farms. Why did growers have to switch to a new banana?','The fungus could infect every plant','The bananas became too sweet to sell','People stopped liking yellow fruit','The plants started making seeds'),
    mcLevel(3,'A plant can reproduce both by runners and by seeds. Which is the best reason this helps?','It spreads fast but still has varied seeds','It never needs any sunlight or water to grow','Its runners make seeds grow faster','Both ways make identical offspring'),
    mcLevel(3,'A scientist wants to test a new fertilizer, with no genetic differences between her plants. Which plants should she use?','Clones of one plant','Seeds from many plants','Plants of many species','Wild plants from different places')
  ],
  animalBehaviorU:[
    mcLevel(1,'A visitor asks why male songbirds sing in spring. What is one main reason?','To attract a mate','To help feathers grow back','To warm up their bodies','To call the rain'),
    mcLevel(1,'A visitor sees a bird carrying twigs. What is it most likely doing?','Building a nest','Migrating south','Getting ready to hibernate','Hunting for worms'),
    mcLevel(1,'Which is an example of parental care?','A cow licking and feeding her calf','A frog laying eggs and leaving','A fish swimming away from its eggs','A turtle burying eggs and leaving'),
    mcLevel(2,'Elephants live in herds that keep calves in the middle. How does this behavior help reproductive success?','More calves survive to adulthood','Calves grow their tusks much faster','Adults need less food each day','The herd moves more slowly'),
    mcLevel(2,'A sea turtle lays about 100 eggs in the sand, then swims away. Which statement best explains this strategy?','Many eggs make up for no care','Turtles cannot count their eggs','The eggs need cold water to hatch','The mother protects them from far away'),
    mcLevel(2,'Male birds with the brightest feathers attract the most mates. What most likely happens to this trait over many generations?','It becomes more common','It disappears quickly','It stays exactly as rare','It turns into a new behavior'),
    mcLevel(3,'An emperor penguin dad keeps an egg on his feet for about two months in the Antarctic winter, eating nothing. Why does this behavior help?','The egg would freeze without his warmth','He is too heavy to walk back to the sea','The egg needs to stay cold so it can hatch','He wants to keep the egg away from mom'),
    mcLevel(3,'Which pair shows the trade-off between two parenting strategies?','Lots of eggs, no care vs. one baby, lots of care','Big parents vs. small parents','Day animals vs. night animals','Animals that eat plants vs. animals that eat meat'),
    mcLevel(3,'Wolves hunt in packs and bring food to pups at the den. Which result best supports that this behavior helps reproductive success?','More pups survive in packs that share food','Wolves in packs howl much more loudly at night','Pack wolves grow thicker winter fur','Lone wolves walk farther each day')
  ],
  animalBehaviorA:[
    mcLevel(1,'Which behavior helps the most baby birds survive?','Parents feeding and guarding the nest','Parents leaving the nest alone for a week','Parents building nests in the open','Parents singing all night'),
    mcLevel(2,'A bowerbird decorates a “bower” with blue objects. Females choose males with the best bowers. What is the bower for?','To attract a mate','To store food','To hide from hawks','To keep eggs warm'),
    mcLevel(2,'Data: in nests guarded by parents, 8 of 10 chicks survived. In unguarded nests, 2 of 10 survived. What do the data show?','Guarding helps chicks survive','Guarding makes chicks grow slower','Chicks survive better alone','Guarding has no effect'),
    mcLevel(2,'Salmon swim hundreds of miles upstream to lay eggs in the stream where they hatched. How does this help their offspring?','Eggs land in clean, safe gravel streams','Salmon parents feed every baby by themselves','The long swim makes the eggs bigger','Rivers are warmer than the ocean'),
    mcLevel(3,'A frog lays 2,000 eggs. A kangaroo raises one joey at a time in its pouch. Which statement is true?','Both strategies can work','The frog’s strategy works and the kangaroo’s fails','The kangaroo’s strategy works and the frog’s fails','Neither animal has offspring that survive'),
    mcLevel(3,'Scientists want to know if a hen’s clucking helps chicks find her. Which is a fair test?','Clucks for some chicks, silence for the rest','Use a different breed of chick in each of the pens','Test some of the chicks by day and others at night','Give some of the chicks more food than the others'),
    mcLevel(3,'Species A lays 6 eggs and feeds its chicks for 2 weeks. Species B lays 2 eggs and feeds its chicks for 8 weeks. Which is most likely true?','B gives each chick more care','A gives each chick more care','Both give exactly equal care','Neither species cares for chicks'),
    mcLevel(3,'A storm destroys many nests in a bird colony early in spring. Which behavior would most help the birds still raise chicks this year?','Building a new nest and laying again','Flying away to a new colony for good','Stopping their singing and courtship','Leaving the eggs out on bare rock')
  ],
  plantStructuresU:[
    mcLevel(1,'Which flower part makes pollen?','Stamen','Pistil','Petal','Root'),
    mcLevel(1,'Which animal helps pollinate flowers?','Bee','Earthworm','Fish','Snail'),
    mcLevel(2,'A flower is red and tube-shaped, with nectar deep inside. Which pollinator is it best shaped for?','Hummingbird','Beetle','Earthworm','Ant'),
    mcLevel(2,'Some seeds have a hard coat and pass through an animal’s gut unharmed. How does the hard coat help?','The seed survives and is dropped far away','The seed gets more food while inside the gut','The coat makes the fruit taste sweeter','The coat helps the seed float on water'),
    mcLevel(2,'About one out of every three bites of food people eat depends on pollinators. Which crop would be hurt most if honeybees disappeared?','Almonds','Wheat','Corn','Rice'),
    mcLevel(2,'A pine tree makes clouds of light, dusty pollen. How is its pollen moved?','By wind','By bees','By hummingbirds','By water'),
    mcLevel(3,'Which structure helps a plant reproduce where there are no pollinators?','Light pollen carried by the wind','Bright petals with sweet nectar','A strong scent that attracts flies','Landing pads for bees on petals'),
    mcLevel(3,'Velcro was invented after an engineer studied burrs stuck to his dog. Which plant structure inspired it?','Tiny hooks on seed burrs','Sticky sap on pine tree bark','Sharp thorns on rose stems','Fuzzy hairs on lamb’s ear leaves')
  ],
  plantStructuresA:[
    mcLevel(1,'A gardener wants more pumpkins. What should she plant nearby?','Flowers that attract bees','Plants that keep bees away','Tall plants that block the sun','Weeds that use up the water'),
    mcLevel(2,'A plant on a windy prairie has seeds with fluffy tufts. How does this trait help?','Wind carries the seeds far away','The tufts keep seeds from moving','The tufts attract bees','The tufts store water'),
    mcLevel(2,'A flower blooms only at night and smells sweet. Which pollinator does it most likely depend on?','Moths','Bees','Butterflies','Hummingbirds'),
    mcLevel(2,'A student counts bee visits for 30 minutes: purple flowers 24, white flowers 5. Which is the best conclusion?','Bees visited purple flowers more often','Bees dislike all white things','Purple flowers make more seeds than any plant','White flowers do not have pollen'),
    mcLevel(3,'A student tests whether flower color changes bee visits. What should stay the same?','Flower size, scent, and location','Flower color','The number of bee visits counted','The colors of the flowers tested'),
    mcLevel(3,'Bee numbers drop near an orchard. Which action would best protect the apple harvest?','Plant wildflowers and stop using bug spray','Spray more bug killer on each of the blossoms','Pick every flower off the trees by hand','Cut down the trees closest to the beehives'),
    mcLevel(3,'Some fruits stay green and sour until the seeds are ready, then turn red and sweet. Why?','So animals eat them when seeds are ready','Red fruit stays on the tree a lot longer','Sour fruit grows faster in the shade','Green fruit attracts more bees'),
    mcLevel(3,'A burr plant grows mostly along a deer trail. Which claim best explains where it grows?','Deer carry its hooked seeds along the trail','Deer plant the seeds there on purpose','The burrs grow best in soil deer have trampled','Wind blows the seeds along the trail')
  ],
  growthEnvU:[
    mcLevel(1,'Which is an environmental factor for a plant?','Sunlight','Its seed type','Its species','Its genes'),
    mcLevel(1,'A chick gets plenty of food and space. What will most likely happen?','It grows healthy and strong','It stops growing','It grows feathers on its feet','It turns into a duck'),
    mcLevel(2,'A Great Dane puppy and a Chihuahua puppy get the same food. The Great Dane grows much bigger. What mainly explains this?','Genetic factors','The amount of food','The weather','The size of the yard'),
    mcLevel(2,'Plants in crowded pots grow smaller than the same plants spaced apart. What is limiting their growth?','Space and shared resources','The color of the pots they are in','Their genes','The day they were planted'),
    mcLevel(2,'A seed needs water, the right temperature, and oxygen to start growing. What is this first growth called?','Germination','Pollination','Migration','Fertilization'),
    mcLevel(3,'Bean seedlings in a dark closet grew taller but were pale and thin. Seedlings in light were shorter and green. What does this show?','Light changes how seedlings grow','Genes made the dark plants taller','Darkness is best for plant health','Light stops plants from growing'),
    mcLevel(3,'A student grows identical bean plants with 0, 1, or 2 spoons of fertilizer. Which variable is she changing?','The amount of fertilizer','The height of the plants','The type of beans','The amount of light'),
    mcLevel(3,'Fish in a pond grow faster in summer than in winter. Which explanation fits?','Temperature affects how fast they grow','Fish genes change at the start of each summer','Winter water has more food','Fish stop eating in summer')
  ],
  growthEnvA:[
    mcLevel(1,'Algae are living things that grow in water. What do they need to grow?','Light and nutrients','Darkness and salt','Ice and cold snow','Sand and strong wind'),
    mcLevel(2,'A lake got fertilizer runoff after heavy spring rain. By summer, algae covered it. Which order is correct?','Runoff, more nutrients, algae bloom','Algae bloom, runoff, more nutrients','More nutrients, runoff, algae bloom','Algae bloom, more nutrients, runoff'),
    mcLevel(2,'In 2014, about 400,000 people in Toledo, Ohio, could not drink their tap water for three days. What caused it?','A toxic algae bloom in Lake Erie','A broken dam upriver','Salt water flooding the city','A snowstorm that froze the pipes'),
    mcLevel(2,'Pond oxygen: week 1, 9 mg/L; week 4, 6 mg/L; week 6 (after the bloom died), 2 mg/L. What most likely happened to the fish by week 6?','Many fish died or swam away','The fish grew much faster','More fish hatched','Nothing changed for the fish'),
    mcLevel(3,'Warm water holds less oxygen than cold water. Why are fish kills from algae blooms most common in late summer?','Water is warm and blooms are dying','The fish are hibernating in the mud','Winter ice traps the oxygen','Algae grow best in winter'),
    mcLevel(3,'A student puts pond water in 3 jars with 0, 1, and 3 drops of plant fertilizer, all in the same sunny window. After 2 weeks, which result fits the bloom idea?','The 3-drop jar is the greenest','The 0-drop jar is the greenest','All jars look exactly alike','The 1-drop jar has no algae'),
    mcLevel(3,'A town wants to protect its lake. Which plan uses what you know about growth and the environment?','Cut runoff so algae get fewer nutrients','Add fertilizer so the fish have more food','Drain the lake each summer','Remove the plants along the shore'),
    mcLevel(3,'Why is an algae bloom an example of the environment changing how organisms grow?','More nutrients let algae grow much faster','Algae change their genes so they can grow faster','Algae grow the same no matter what','Fish make the algae grow larger')
  ]
};
Object.entries(BIO2_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { BIO2_QUESTIONS[skillId] = [...(BIO2_QUESTIONS[skillId] || []), ...questions]; });
// Difficulty tags for the four starter questions in each Biology Unit 2 skill.
const BIO2_BUILT_IN_LEVELS = {
  traitsReproU:[1,1,2,1], traitsReproA:[2,2,2,2], animalBehaviorU:[1,1,1,1], animalBehaviorA:[2,2,2,2],
  plantStructuresU:[1,1,1,1], plantStructuresA:[2,2,1,2], growthEnvU:[1,1,2,2], growthEnvA:[1,1,2,2]
};
Object.entries(BIO2_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => {
  const question = BIO2_QUESTIONS[skillId]?.[index];
  if (question && question.difficulty == null) question.difficulty = level;
}));
// Biology Unit 3: Matter and energy in organisms (Khan Academy middle school biology, Unit 3: photosynthesis and cellular
// respiration). The student is a tour guide at the Pet World Greenhouse. Khan's lessons, in order (checked on
// khanacademy.org, Oct 29 2026): 3.1 Photosynthesis in organisms, 3.2 Food and energy in organisms (each with an
// Understand and an Apply practice), then the Unit 3 phenomenon-based activity. Docs: docs/SCIENCE-UNIT3.md, docs/bio3-review.md
const BIO_UNIT3 = [
  {id:'photoOrgU',name:'Understand: Photosynthesis in organisms',lesson:'Plants, algae, and some bacteria do photosynthesis. In their chloroplasts, light energy turns carbon dioxide and water into sugar (glucose), and oxygen is given off. The atoms are rearranged, not made new, and the light’s energy is stored in the sugar.',why:'Almost every breath of oxygen you take and every bite of food you eat traces back to photosynthesis.'},
  {id:'photoOrgA',name:'Apply: Photosynthesis in organisms',lesson:'Use evidence to explain photosynthesis. Most of a plant’s dry matter is built from carbon dioxide in the air, not from the soil. A plant uses its sugar to build its body and for energy, and more light (up to a point) means more photosynthesis.',why:'Greenhouse farmers add lights and extra carbon dioxide so their tomatoes grow faster.'},
  {id:'foodEnergyU',name:'Understand: Food and energy in organisms',lesson:'Food gives living things matter to grow and repair their bodies, and energy to live. In cellular respiration, cells (in their mitochondria) use oxygen to break down sugar, releasing energy and giving off carbon dioxide and water. Plants and animals both do it.',why:'Every heartbeat, step, and thought runs on energy your cells release from food.'},
  {id:'foodEnergyA',name:'Apply: Food and energy in organisms',lesson:'Use evidence to explain how cells use food. When you exercise, your cells need more energy, so you breathe faster and your heart beats faster to bring oxygen and sugar and carry carbon dioxide away. The matter in food is rearranged, not destroyed.',why:'Coaches measure breathing and heart rate to plan workouts, like Khan’s fitness-goal activity.'}
];
const BIO_GROUPS3 = [
  {id:'photo3',name:'Photosynthesis in organisms',noQuiz:true,skills:['photoOrgU','photoOrgA'],learn:'How plants, algae, and some bacteria use light energy to make sugar from carbon dioxide and water, and where a plant’s mass really comes from.',
    hook:{emoji:'🌳',title:'The tree that didn’t eat its dirt',story:'In the 1600s, a scientist named Jan Baptist van Helmont planted a willow sapling that weighed about 5 pounds in a pot holding 200 pounds of dried soil. For five years he gave it only water. The tree grew to about 169 pounds, but when he dried and weighed the soil again, it had lost only about 2 ounces. So where did the tree come from? Van Helmont guessed water. Scientists later found the biggest part of the answer floating all around us: carbon dioxide in the air.'}},
  {id:'food3',name:'Food and energy in organisms',quizName:'Quiz 1',quizSkills:['photoOrgU','photoOrgA','foodEnergyU','foodEnergyA'],skills:['foodEnergyU','foodEnergyA'],learn:'Why living things need food, and how cellular respiration in the mitochondria releases the energy stored in sugar.',
    hook:{emoji:'🚀',title:'The astronauts who almost ran out of air',story:'In April 1970, an explosion damaged the Apollo 13 spacecraft on its way to the Moon. The three astronauts moved into the small lunar module, but their own cellular respiration was a problem: every breath out added carbon dioxide, and the lunar module’s air filters were made for two people for two days. The spare filters from the main ship were square, and the holes were round. Engineers on the ground invented a fix from plastic bags, cardboard, a sock and duct tape, the astronauts built it, and all three came home safely.'}},
  {id:'activity3',name:'Unit 3 phenomenon-based activity',noQuiz:true,skills:[],learn:'Khan’s activity: How can measuring cellular respiration help us reach a fitness goal? With a grown-up, measure your breathing and heart rate at rest and after exercise, and explain what your cells are doing.'}
];
const BIO3_QUESTIONS = {
  photoOrgU:[
    mcLevel(1,'A visitor at the Sunlight Bench asks what photosynthesis makes for the plant. What do you say?','Sugar (glucose) for its food','Carbon dioxide gas for breathing','Soil minerals for its roots','Water for its leaves'),
    mcLevel(1,'A kid asks which gas plants take in from the air to do photosynthesis. Which is it?','Carbon dioxide','Oxygen','Nitrogen','Water vapor from the clouds'),
    mcLevel(1,'A visitor asks which gas the greenhouse plants give off during photosynthesis. What do you say?','Oxygen','Carbon dioxide','Nitrogen','Methane'),
    mcLevel(1,'A kid asks where in a plant cell photosynthesis happens. What do you say?','In the chloroplasts','In the cell wall','In the nucleus','In the mitochondria'),
    mcLevel(2,'A visitor asks what gives a plant the energy it needs to make sugar. What do you say?','Light from the sun','Heat from the soil around its roots','Minerals in the water','Oxygen from the air'),
    mcLevel(2,'A grandparent asks which living things can do photosynthesis. What do you say?','Plants, algae, and some bacteria','Plants and mushrooms','Animals that live in very sunny places','Mushrooms, molds, and yeast'),
    mcLevel(2,'A kid asks what green substance in the chloroplasts captures the light. What is it called?','Chlorophyll','Glucose','Cellulose','Starch'),
    mcLevel(2,'A visitor asks how a sunflower gets the water it uses in photosynthesis. What do you say?','Its roots take it in from the soil','Its flowers catch it from the rain','Its leaves make it from sunlight','Its seeds store it from the spring'),
    mcLevel(3,'A visitor asks how carbon dioxide gets inside a leaf. What do you say?','Through tiny openings called stomata','Through the roots, from the soil','Through the stem, from rainwater','Through the thick cell walls of its roots'),
    mcLevel(3,'A kid asks what happens to the atoms in carbon dioxide and water during photosynthesis. What do you explain?','They are rearranged into sugar and oxygen','They are destroyed and turned into energy','They stay the same molecules inside the leaf','They are made into brand-new kinds of atoms'),
    mcLevel(3,'A visitor asks where the energy from the sunlight goes after photosynthesis. What do you say?','It is stored in the sugar the plant made','It is used up and gone from the plant','It is turned into the oxygen the plant gave off','It is saved as water in the roots'),
    mcLevel(3,'Which are the inputs (the starting materials) of photosynthesis?','Carbon dioxide, water, and light energy','Sugar, oxygen, and light energy from the sun','Oxygen, water, and soil','Sugar and carbon dioxide'),
    mcLevel(3,'A visitor asks why scientists call plants “producers.” What do you say?','They make their own food from simple materials','They produce many seeds and flowers every spring','They eat other living things for energy','They grow fruit that animals eat'),
    mcLevel(3,'A kid asks what kinds of atoms make up a sugar (glucose) molecule. What do you say?','Carbon, hydrogen, and oxygen','Carbon, nitrogen, and iron','Hydrogen and oxygen','Oxygen, nitrogen, and calcium atoms')
  ],
  photoOrgA:[
    mcLevel(1,'A seedling was left in a dark closet for two weeks, and it turned pale and weak. A visitor asks why. What do you say?','It couldn’t make enough sugar without light','The dark closet had no carbon dioxide in it','Darkness made its roots stop taking in water','Plants need cold air to make chlorophyll'),
    mcLevel(1,'A kid asks which part of a plant does most of its photosynthesis. Which is it?','The leaves','The roots','The flowers','The seeds'),
    mcLevel(1,'A visitor asks how a plant uses the sugar it makes. What is one way?','It builds new leaves, stems, and roots','It turns the sugar back into sunlight at night','It pumps the sugar out of its leaves as oxygen','It uses it to soak up carbon dioxide'),
    mcLevel(2,'Students put a water plant under a lamp and count the oxygen bubbles. They move the lamp closer. What will they most likely see?','More bubbles each minute','Fewer bubbles each minute','The same number of bubbles','Bubbles of carbon dioxide instead'),
    mcLevel(2,'Which setup would best test whether a plant needs light to grow?','Two matching plants, one in light and one in dark','One plant in light with lots of fertilizer','Two different kinds of plants, both kept in the dark','One plant moved from room to room each day'),
    mcLevel(2,'Why are most leaves wide and flat?','To catch more light for photosynthesis','To hold more water than the roots','To keep the whole plant from blowing over in wind','To store seeds for the next spring'),
    mcLevel(2,'A visitor says, “Plants get their food from the soil.” What is the best reply?','Plants make their food; soil gives water and a few minerals','Yes, roots soak up sugar and food that is already made in the soil','Plants get their food from the insects they catch','Yes, the soil slowly turns into the plant’s leaves'),
    mcLevel(3,'Van Helmont’s willow gained about 164 pounds in five years, but its soil lost only about 2 ounces. What does this show?','The tree’s mass did not come mainly from the soil','Trees take most of their mass from the minerals in soil','The soil was too dry to feed the tree','Willow trees can grow without any water'),
    mcLevel(3,'In the lamp-and-bubbles test, which is the variable the students change on purpose?','The distance to the lamp','The number of bubbles','The kind of water plant','The size of the water container'),
    mcLevel(3,'In 1771, Joseph Priestley found that a mouse in a sealed jar with a mint plant lived longer than a mouse in a jar alone. What is the best explanation?','The plant gave off oxygen the mouse needed','The plant gave the mouse food to eat','The plant soaked up the extra heat in the jar','The smell of mint kept the mouse calm'),
    mcLevel(3,'A greenhouse farmer adds extra carbon dioxide to the air inside. Why might the tomatoes grow faster?','More carbon dioxide lets them make more sugar','Carbon dioxide keeps hungry insects off the plants','Carbon dioxide adds minerals to the soil','The plants need less light and water then'),
    mcLevel(3,'A plant sits in a sealed jar in bright light all day. A sensor shows the carbon dioxide in the jar going down. Why?','The plant is using it to make sugar','The plant is breathing out extra of it','The light breaks it apart in the air','The light heats it until it disappears'),
    mcLevel(3,'The same sealed jar is kept dark all night, and now the carbon dioxide goes up. Why?','The plant keeps respiring but can’t do photosynthesis','The plant makes carbon dioxide from the light it saved','Cold night air turns the oxygen into carbon dioxide','The soil gives off carbon dioxide when it is dark'),
    mcLevel(3,'Plants were given 2, 4, 6, or 8 hours of light a day. They grew 3 cm, 6 cm, 9 cm, and 9 cm. What is the best conclusion?','More light helped up to 6 hours, then it stopped helping','Growth kept going up by 3 cm with every extra 2 hours of light','Light did not change how much the plants grew','The plants grew best with 2 hours of light')
  ],
  foodEnergyU:[
    mcLevel(1,'A kid at the Hummingbird Feeder asks why animals need to eat. What do you say?','Food gives energy and building materials','Food gives them oxygen for their blood','Food is mainly for keeping them full of water','Food helps them make sugar from sunlight'),
    mcLevel(1,'A visitor asks what cellular respiration is. What do you say?','Cells breaking down sugar to release energy','Lungs pulling air in and pushing it out','Leaves using light to make sugar','The stomach breaking food into small pieces'),
    mcLevel(1,'A kid asks which gas cells use in cellular respiration. Which is it?','Oxygen','Carbon dioxide','Nitrogen','Water vapor'),
    mcLevel(1,'A visitor asks which part of a cell does most of the cellular respiration. What do you say?','The mitochondria','The chloroplasts','The cell membrane','The nucleus'),
    mcLevel(2,'A visitor asks what comes out of cellular respiration. What do you say?','Carbon dioxide, water, and energy','Sugar and oxygen','Oxygen, water, and light','Sugar, carbon dioxide, and light energy'),
    mcLevel(2,'A grandparent asks, “Do plants do cellular respiration too?” What do you say?','Yes, their cells need energy from sugar too','No, photosynthesis does that job for plants instead','Just in their roots, which get no light','Just when they are flowering in spring'),
    mcLevel(2,'Before cells can use food, the digestive system breaks it into small molecules. A kid asks how those molecules reach the cells. What do you say?','The blood carries them','They travel along the nerves','The lungs pass them along','They soak in through the skin'),
    mcLevel(2,'A runner asks where her leg muscles get the energy to run. What do you say?','From sugar broken down in the muscle cells','From oxygen burning in the lungs','From sunlight absorbed by the skin','From carbon dioxide stored up in the blood and muscles'),
    mcLevel(3,'A visitor asks how breathing and cellular respiration are connected. What do you explain?','Breathing brings in oxygen and removes the carbon dioxide cells make','Breathing is just another name for cellular respiration','Breathing makes the sugar that cells use for energy','Breathing pulls in carbon dioxide so the cells can use it to make energy'),
    mcLevel(3,'A kid asks what happens to the atoms in sugar during cellular respiration. What do you explain?','They are rearranged into carbon dioxide and water','They are destroyed, and that is what makes the energy','They turn into oxygen gas atoms','They stay inside the cell as sugar forever'),
    mcLevel(3,'A visitor asks what animals use the energy from cellular respiration for. What do you say?','Moving, growing, and keeping warm','Making new atoms for the body','Turning carbon dioxide into oxygen','Storing sunlight inside the bones'),
    mcLevel(3,'Photosynthesis ______ energy in sugar, and cellular respiration ______ it. Which pair fills in the blanks?','stores; releases','releases; stores','stores; stores','releases; releases'),
    mcLevel(3,'A hummingbird beats its wings dozens of times a second. A kid asks why it needs to drink so much nectar. What do you explain?','Its cells use lots of energy, so they need lots of sugar','Nectar gives its wing muscles the oxygen they need to flap so fast','It stores the nectar in its wings for later','Nectar helps it make chlorophyll in its feathers'),
    mcLevel(3,'A bean seed is sprouting in dark soil and has no leaves yet. Where does it get the energy to grow?','From food stored in the seed, broken down in respiration','From photosynthesis in its roots','From sunlight that shines down through the dark soil to reach it','From oxygen that is stored in the seed coat')
  ],
  foodEnergyA:[
    mcLevel(1,'Right after a fast run, a visitor is breathing hard. She asks why. What do you say?','Your muscle cells need more oxygen for respiration','Your lungs are making extra sugar for your legs to use while you run','Running fills your lungs with water','Your heart needs less blood when you run'),
    mcLevel(1,'A kid asks why your heart beats faster when you exercise. What do you say?','To deliver oxygen and sugar to cells faster','To cool the blood down','To push extra carbon dioxide into the working muscles','To make the blood thicker'),
    mcLevel(1,'A runner eats a big bowl of pasta the night before a race. How does it help her?','Her cells can break down its sugars for energy','Pasta gives her lungs extra oxygen','Pasta turns straight into water inside her leg muscles','Pasta makes her heart beat slower'),
    mcLevel(2,'Students measured a breathing rate of 16 breaths a minute at rest and 32 after jumping jacks. What does the data suggest?','Exercise raised the cells’ need for oxygen','Jumping jacks lowered the need for oxygen','Breathing rate does not change with activity','The students made a mistake in counting'),
    mcLevel(2,'Yeast in warm sugar water make a balloon on top of the bottle blow up. Which gas fills the balloon?','Carbon dioxide','Oxygen','Nitrogen','Water vapor from the warm water'),
    mcLevel(2,'A visitor asks why you get warm when you exercise. What do you explain?','Respiration releases energy, and some of it becomes heat','Your lungs pull warm air from the room into your chest and blood','Your blood fills up with sunlight','Sweat warms up your skin'),
    mcLevel(2,'A rabbit in the greenhouse garden eats clover. Where did the energy in the rabbit’s muscles first come from?','The sun','The soil','The clover’s roots','The air the rabbit breathes'),
    mcLevel(3,'In the breathing-rate test, what should stay the same to make it a fair test?','The person, the counting time, and the room','The amount of exercise done before each of the counts','The breathing rate after exercise','Whether the person rests or exercises'),
    mcLevel(3,'When the body uses stored fat for energy, where does most of that matter go?','Out as carbon dioxide you breathe out','It turns into energy and then disappears from the body','Out as sweat through the skin','Into the muscles as new protein'),
    mcLevel(3,'Bottle A has yeast, warm water, and sugar. Bottle B has yeast and warm water but no sugar. Only A’s balloon grows. What does this show?','Yeast need food (sugar) to release energy and make gas','Sugar is a gas that rises up into the balloon','Yeast are plants that make oxygen from sugar','Warm water alone makes balloons grow if you wait long enough'),
    mcLevel(3,'A mouse and a plant are each in their own sealed jar in the dark. What happens to the oxygen in both jars?','It goes down in both jars','It goes up in the plant’s jar and down in the mouse’s','It stays the same in both jars','It goes down in the mouse’s jar and stays the same in the plant’s'),
    mcLevel(3,'Which is the best evidence that plants do cellular respiration?','In the dark, a plant gives off carbon dioxide','In the light, a plant gives off oxygen','A plant’s leaves are green','A plant grows and bends toward a bright window over time'),
    mcLevel(3,'A coach measures how much oxygen an athlete uses while she runs. Why is that useful?','It shows how much respiration her cells are doing','It shows how much food she ate at breakfast that morning','It shows how tall she will grow','It shows how much water is in her food'),
    mcLevel(3,'The carbon dioxide you breathe out could later become part of what?','Sugar in a plant’s leaf','Oxygen in the air','Water in a lake','Minerals deep in the soil under a forest')
  ]
};
/* ---------- end of Biology Unit 3 ---------- */
// Biology Unit 4: Cell division and life cycles (the 🦋 Butterfly House). Khan's middle school biology has no unit on
// cell division, so this unit follows the lessons of Khan's High school biology unit "Reproduction and cell division"
// (chromosome structure and numbers, the cell cycle and mitosis, meiosis, types of reproduction, fertilization and
// development), pitched for 6th grade, plus a Pet World practice on life cycles and metamorphosis. The student is a tour
// guide at the Pet World Butterfly House. Docs: docs/SCIENCE-UNIT4.md, docs/bio4-review.md
const BIO_UNIT4 = [
  {id:'chromosomes4',name:'Chromosome structure and numbers',lesson:'A chromosome is a long, coiled strand of DNA wrapped around proteins. Human body cells have 46 chromosomes in 23 pairs, one of each pair from each parent. Before a cell divides, every chromosome is copied, so it looks like an X made of two identical sister chromatids joined at the centromere. Body cells have two sets (diploid); egg and sperm have one set (haploid).',why:'Doctors count chromosomes to find conditions like Down syndrome, which comes from a third copy of chromosome 21.'},
  {id:'mitosis4',name:'The cell cycle and mitosis',lesson:'The cell cycle is a cell’s life: in interphase it grows and copies its DNA; in mitosis (prophase, metaphase, anaphase, telophase) the copies are pulled apart, and each separated chromatid counts as its own chromosome; then cytokinesis splits the cell in two. Mitosis makes two identical cells with the same number of chromosomes as the parent. Living things use it to grow, heal, and replace cells.',why:'Every scraped knee heals by mitosis, and cancer is what happens when cells keep dividing when they should stop.'},
  {id:'meiosis4',name:'Meiosis',lesson:'Meiosis makes sex cells (eggs and sperm). The DNA is copied once, then the cell divides twice, making four cells that each have half the chromosomes: one from every pair. Crossing over and the way the pairs line up make every sex cell different. Fertilization brings the full number back.',why:'Meiosis is why brothers and sisters with the same parents can look so different.'},
  {id:'reproTypes4',name:'Types of reproduction',lesson:'Asexual reproduction needs one parent and makes offspring that are genetically identical to it (binary fission, budding, runners, cuttings, or regrowing from a piece). Sexual reproduction joins an egg and a sperm from two parents, so each offspring is a new mix of genes. Asexual is fast; sexual makes variation that helps a group survive changes like a new disease.',why:'Every Honeycrisp apple tree is grafted from another one, so they all carry the same genes.'},
  {id:'development4',name:'Fertilization and development',lesson:'Fertilization is when a sperm joins an egg, making a zygote with a full set of chromosomes. The zygote divides again and again by mitosis into an embryo. Then its cells differentiate: they become skin, muscle, or nerve cells by using different genes, even though every cell has the same DNA.',why:'Scientists study stem cells, which haven’t specialized yet, to try to repair hearts and spinal cords.'},
  {id:'lifeCycles4',name:'Life cycles and metamorphosis',lesson:'A life cycle is the set of stages from a fertilized egg to an adult that makes new offspring. Butterflies, beetles, and flies have complete metamorphosis (egg, larva, pupa, adult); grasshoppers and dragonflies have incomplete metamorphosis (egg, nymph, adult). Frogs change from tadpoles with gills to adults with lungs, and flowering plants go from seed to flower to seed.',why:'Monarch caterpillars eat milkweed and almost nothing else, so planting milkweed helps monarchs survive.'}
];
const BIO_GROUPS4 = [
  {id:'cellcycle4',name:'Chromosomes and the cell cycle',quizName:'Quiz 1',quizSkills:['chromosomes4','mitosis4'],skills:['chromosomes4','mitosis4'],learn:'What chromosomes are, how many a cell has, and how one cell copies its DNA and splits into two identical cells by mitosis.',
    hook:{emoji:'🔬',title:'The threads inside a salamander',story:'In the late 1870s, a German doctor named Walther Flemming stained cells from salamander larvae with dye and looked at them under a microscope. Inside the nucleus he saw thread-like shapes that thickened, lined up, and split apart as the cell divided in two. In 1882 he named the process mitosis, from the Greek word for thread. He didn’t know it yet, but those threads were chromosomes, carrying the instructions for building the salamander.'}},
  {id:'sexrepro4',name:'Meiosis and types of reproduction',quizName:'Quiz 2',quizSkills:['meiosis4','reproTypes4'],skills:['meiosis4','reproTypes4'],learn:'How meiosis makes egg and sperm cells with half the chromosomes, and how asexual and sexual reproduction compare.',
    hook:{emoji:'🫏',title:'Why mules almost never have babies',story:'A mule is the offspring of a horse and a donkey. Horses have 64 chromosomes and donkeys have 62, so a mule gets 32 + 31 = 63. Mules are strong and healthy, but when a mule’s cells try to make egg or sperm cells by meiosis, the chromosomes can’t all line up in matching pairs. That is why mules are almost always unable to have offspring of their own.'}},
  {id:'lifecycle4',name:'Fertilization, development, and life cycles',quizName:'Quiz 3',quizSkills:['development4','lifeCycles4'],skills:['development4','lifeCycles4'],learn:'How a fertilized egg becomes an embryo of specialized cells, and how butterflies, grasshoppers, frogs, and plants grow through their life cycles.',
    hook:{emoji:'🦋',title:'The great-grandchildren come home',story:'Every fall, monarch butterflies from the eastern United States and Canada fly as far as 3,000 miles to the same mountain forests in central Mexico. Summer monarchs live only about two to six weeks, but this special fall generation can live about eight months. In spring they head north, lay eggs on milkweed, and die. It takes several generations to get back to Canada, so the butterflies that return to Mexico the next fall have never been there before.'}}
];
const BIO4_QUESTIONS = {
  chromosomes4:[
    mcLevel(1,'A visitor at the Microscope Window asks what a chromosome is made of. What do you say?','DNA wrapped around proteins','Sugar wrapped around fat','Water inside a membrane','Tiny cells packed together'),
    mcLevel(1,'How many chromosomes are in a typical human body cell, like a skin cell?','46','23','92','48'),
    mcLevel(1,'Where in an animal cell are the chromosomes kept?','In the nucleus','In the cell membrane','In the central vacuole','In the ribosomes'),
    mcLevel(2,'Human body cells have 23 pairs of chromosomes. Where did the two chromosomes in each pair come from?','One from the mother and one from the father','Both from the mother','Both from the father','One from each grandparent'),
    mcLevel(2,'A copied chromosome looks like an X. What are its two identical halves called?','Sister chromatids','Homologous pairs','Centromeres','Two daughter cells'),
    mcLevel(2,'Dog body cells have 78 chromosomes. How many pairs is that?','39','78','156','76'),
    mcLevel(2,'Two chromosomes that carry genes for the same traits, one from each parent, are called what?','A homologous pair','A pair of sister chromatids','A centromere and two arms','Daughter chromosomes'),
    mcLevel(2,'Which cell is haploid (it has one set of chromosomes instead of two)?','A sperm cell','A cheek skin cell','A muscle cell','A cell from the liver'),
    mcLevel(3,'A cat has 38 chromosomes in each body cell, and a potato has 48. What can you conclude?','The number of chromosomes doesn’t show how complex a living thing is','Potatoes are more complex living things than cats','Potatoes must be more closely related to humans than cats are','Potato cells must be bigger, because they need room for extra chromosomes'),
    mcLevel(3,'A chromosome in a skin cell has just been copied. How many DNA molecules does it hold now?','2, one in each sister chromatid','1, since it is one chromosome','4, two from each parent','46, one for each chromosome'),
    mcLevel(3,'A human cell is getting ready to divide, and all 46 of its chromosomes have been copied. How many sister chromatids does it have?','92','46','23','184'),
    mcLevel(3,'Fruit fly body cells have 8 chromosomes. How many chromosomes are in a fruit fly egg cell?','4','8','16','2'),
    mcLevel(3,'A person has three copies of chromosome 21 instead of two. How many chromosomes are in most of their body cells?','47','46','69','48'),
    mcLevel(3,'A horse has 64 chromosomes and a donkey has 62. A mule gets half of each parent’s set. How many chromosomes does a mule have?','63','126','62','64')
  ],
  mitosis4:[
    mcLevel(1,'A visitor at the Growth Lab asks what mitosis makes. What do you say?','Two cells identical to the parent cell','Four new cells, each with half the chromosomes','One giant cell with double the DNA','Two cells that are each different'),
    mcLevel(1,'Which is a job of mitosis in your body?','Healing a cut on your knee','Making new egg or sperm cells','Digesting your lunch','Pumping blood to your muscles'),
    mcLevel(1,'Which step finally splits one cell into two separate cells?','Cytokinesis','Interphase','Prophase','Metaphase'),
    mcLevel(2,'During which part of the cell cycle is the DNA copied?','Interphase','Metaphase','Anaphase','Telophase'),
    mcLevel(2,'The chromosomes line up in a single row across the middle of the cell. Which phase is this?','Metaphase','Prophase','Anaphase','Telophase'),
    mcLevel(2,'The sister chromatids are pulled apart toward opposite ends of the cell. Which phase is this?','Anaphase','Metaphase','Prophase','Interphase'),
    mcLevel(2,'Which list puts the phases of mitosis in order?','Prophase, metaphase, anaphase, telophase','Metaphase, prophase, anaphase, telophase','Prophase, anaphase, metaphase, telophase','Telophase, anaphase, metaphase, prophase'),
    mcLevel(2,'A skin cell with 46 chromosomes divides by mitosis. How many chromosomes does each new cell have?','46','23','92','48'),
    mcLevel(3,'Two new nuclei form around the chromosomes at each end of the cell. Which phase is this?','Telophase','Prophase','Anaphase','Metaphase'),
    mcLevel(3,'A cut on a lizard’s side heals, and new skin covers it. Why is the new skin’s DNA the same as the old skin’s?','The DNA is copied exactly, then mitosis gives each cell a full set','Each new cell gets half its DNA from each parent lizard','Meiosis shuffles the chromosomes into a new mix','Skin cells don’t have any DNA in them'),
    mcLevel(3,'An onion root tip has many cells in mitosis, but a grown onion leaf has very few. What does this tell you?','The root tip is a place where the plant is growing','Leaf cells divide by meiosis instead of mitosis','Root cells must have more chromosomes than the leaf cells do','Leaf cells are dead, so they can’t divide'),
    mcLevel(3,'A cell with 8 chromosomes is in anaphase of mitosis. How many chromosomes are moving toward EACH end of the cell?','8','4','16','2'),
    mcLevel(3,'Cancer cells keep dividing when normal cells would stop. What has gone wrong?','The controls that tell a cell when to stop dividing','The step that pulls the sister chromatids apart in anaphase','The membrane that forms around the new nuclei','The way a cell takes in food from the blood'),
    mcLevel(3,'A cell copied its DNA and finished mitosis, but cytokinesis never happened. What would you see?','One cell with two nuclei','Two cells with one nucleus each','Four cells with half the DNA','One cell with no nucleus at all')
  ],
  meiosis4:[
    mcLevel(1,'A visitor at the Egg Lab asks what meiosis makes in animals. What do you say?','Egg and sperm cells','Skin and muscle cells','Brand-new blood cells','Cells that heal cuts'),
    mcLevel(1,'In a male butterfly, meiosis turns one starting cell into sperm cells. How many cells does it make?','4','2','1','8'),
    mcLevel(1,'Compared with the parent cell, how many chromosomes does each cell made by meiosis have?','Half as many','The same number','Twice as many','A quarter as many'),
    mcLevel(2,'A human egg cell has 23 chromosomes. A sperm cell joins it. How many chromosomes are in the fertilized egg?','46','23','92','69'),
    mcLevel(2,'In meiosis I, partner chromosomes trade pieces with each other. What is this called?','Crossing over','Cytokinesis','Fertilization','DNA copying'),
    mcLevel(2,'Which is true of meiosis but NOT mitosis?','Homologous pairs are separated into different cells','The DNA is copied before division begins','The cell membrane pinches the cell in two','Chromosomes line up in the middle of the cell'),
    mcLevel(2,'Why is it important that egg and sperm cells have half the usual number of chromosomes?','So the baby ends up with the normal number after fertilization','So the egg and sperm can swim faster','So the cells use less energy','So the baby has fewer chromosomes than its parents'),
    mcLevel(2,'Which cells in a person’s body go through meiosis?','Cells in the ovaries or testes','Cells in the skin','Cells in the bone marrow that make blood','Cells in the stomach lining'),
    mcLevel(2,'A dog body cell has 78 chromosomes. How many chromosomes are in each cell made by meiosis?','39','78','156','19'),
    mcLevel(3,'A cell with 12 chromosomes goes through meiosis. How many cells are made, and how many chromosomes are in each?','4 cells with 6 chromosomes each','2 cells with 12 chromosomes each','4 cells with 12 chromosomes each','2 cells with 6 chromosomes each'),
    mcLevel(3,'Two sisters have the same parents but look different. Which part of meiosis helps explain this?','Crossing over mixes pieces of partner chromosomes','Mitosis copies the DNA exactly','Cytokinesis splits each new cell into two unequal halves','The chromosomes double in number'),
    mcLevel(3,'A mule has 63 chromosomes, an odd number. Why can’t its cells usually finish meiosis normally?','Some chromosomes have no partner to pair with','Mules have no DNA in their sex cells','Mules can’t copy their chromosomes before the cells divide','Mitosis stops working in mules'),
    mcLevel(3,'A human cell with 46 chromosomes finishes meiosis I. How many chromosomes are in each of the two new cells?','23, each still 2 chromatids','46, each now just 1 chromatid','46, each still 2 chromatids','23, each now just 1 chromatid'),
    mcLevel(3,'Which statement compares mitosis and meiosis correctly?','Mitosis makes identical body cells; meiosis makes different sex cells','Mitosis makes sex cells; meiosis makes body cells','Both make four new cells that each have half the chromosomes of the parent cell','Mitosis happens in plants, and meiosis happens in animals')
  ],
  reproTypes4:[
    mcLevel(1,'A visitor in the Butterfly Garden asks for an example of asexual reproduction. Which do you point to?','A potato sprouting new plants from its eyes','Two monarch butterflies mating','A bee carrying pollen to a flower','A frog laying eggs that get fertilized'),
    mcLevel(1,'How many parents does asexual reproduction need?','1','2','3','4'),
    mcLevel(1,'In sexual reproduction, where do the offspring get their genes?','From two parents, mixed together','From one parent, copied exactly','From the food the parents eat','From where they grow up'),
    mcLevel(2,'A bacterium splits into two identical cells. What is this called?','Binary fission','Budding','Fertilization','Sexual reproduction'),
    mcLevel(2,'A yeast cell grows a small bump that breaks off into a new yeast cell. What is this called?','Budding','Binary fission','Fertilization','Pollination'),
    mcLevel(2,'Which is an advantage of asexual reproduction?','One parent can make many offspring quickly','The offspring are each different from one another','Two parents can share the work of raising them','It mixes the genes of two different parents together'),
    mcLevel(2,'Which is an advantage of sexual reproduction?','Variety in the offspring helps some survive a new disease','It is faster than asexual reproduction','It needs just one parent','The offspring are copies, so they are strong'),
    mcLevel(2,'Which offspring would be genetically identical to its parent?','A new plant grown from a cutting','A puppy born to a mother and father dog','A seed from a flower that pollinated itself','A twin calf that grew from the same egg as its twin'),
    mcLevel(3,'A sea star loses an arm, and the arm (with part of the center) grows into a whole new sea star. What kind of reproduction is this?','Asexual, by regrowing from a piece','Sexual, because the arm joins with a cell from another star','Budding, like yeast','Binary fission, like bacteria'),
    mcLevel(3,'A farm grows a field of identical banana plants (clones). A new fungus kills one plant. What is most likely to happen?','The fungus can kill the rest, because they have the same weakness','The other plants survive, because each clone grows its own new defenses','The plants switch to sexual reproduction to escape it','The fungus can’t spread from one plant to another'),
    mcLevel(3,'Aphids reproduce asexually all summer, then sexually in the fall, laying eggs that last the winter. Why might switching help?','Fast asexual growth fills the summer; sexual eggs add variety for a harsh season','Summer heat stops their sex cells from forming, so they just clone themselves until fall','Asexual young are tougher in the cold; sexual eggs hatch faster in summer','Mating in the fall gives eggs that are exact copies of the mother, so they are safe'),
    mcLevel(3,'A hydra grows a small hydra off its side that breaks free. How do the new hydra’s chromosomes compare with its parent’s?','The same, because they came from mitosis','Half as many, due to meiosis','A new mix of chromosomes from two different parents','Twice as many, because it grew from a bud'),
    mcLevel(3,'Which pair is matched correctly?','Asexual: offspring are clones; Sexual: offspring have variation','Asexual: offspring have variation; Sexual: offspring are clones','Asexual: uses meiosis to make clones; Sexual: offspring have variation','Asexual: offspring are clones; Sexual: one parent gives all the genes'),
    mcLevel(3,'A gardener wants 50 rose bushes just like her prize-winning rose. Which method should she use?','Take cuttings from the prize rose and root them','Plant seeds from the prize rose after it pollinates itself','Let bees pollinate the prize rose','Take cuttings from a young rose grown from the prize rose’s seeds')
  ],
  development4:[
    mcLevel(1,'A visitor at the Egg Lab asks what fertilization is. What do you say?','A sperm cell joining with an egg cell','A cell splitting into two new cells by mitosis','A caterpillar turning into a butterfly','A seed sprouting in the soil'),
    mcLevel(1,'What is the single cell made by fertilization called?','A zygote','A gamete (sex cell)','A chromatid','A young larva'),
    mcLevel(1,'After fertilization, how does the zygote grow into an embryo with many cells?','By dividing again and again by mitosis','By dividing by meiosis to make sex cells','By joining with more sperm cells','By getting bigger without dividing'),
    mcLevel(2,'How many chromosomes does a human zygote have?','46','23','92','69'),
    mcLevel(2,'Your nerve cells and skin cells have the same DNA. Why do they look and work so differently?','Each type of cell uses different genes','Nerve cells have more chromosomes','Skin cells lost some of their DNA as they grew up','They came from different zygotes'),
    mcLevel(2,'What is a cell called when it can still become many kinds of cells?','A stem cell','A sex cell (egg or sperm)','A nerve cell','A red blood cell'),
    mcLevel(2,'What is it called when cells become specialized, like turning into muscle or nerve cells?','Differentiation','Fertilization','Pollination','Cellular respiration'),
    mcLevel(2,'Most frogs lay hundreds of eggs in water, and the male fertilizes them there. Why do frogs lay so many?','Many eggs and tadpoles get eaten or don’t survive','Each egg must be fertilized by many different sperm cells to develop','Frogs can’t lay just one egg at a time','Water makes eggs grow faster'),
    mcLevel(3,'Identical twins form when one early embryo splits into two. Why do identical twins have the same DNA?','Both came from the same zygote, copied by mitosis','Each came from a different egg and sperm','Meiosis made two sex cells, both identical','Both got the same food before birth'),
    mcLevel(3,'Fraternal twins form when two eggs are fertilized by two different sperm. How alike are their genes?','About as alike as any brother and sister','Exactly the same as each other, like identical twins','Totally different, with no genes in common','Half the same as their mother’s, half random'),
    mcLevel(3,'In 1996, scientists put the nucleus from an adult sheep’s udder cell into an egg whose own nucleus was removed, and it grew into Dolly the lamb. What does this show?','A specialized cell still has all the DNA needed to make a whole animal','Udder cells contain a special extra set of chromosomes just for making new lambs','Meiosis is needed to make every animal','Eggs make their own DNA after fertilization'),
    mcLevel(3,'Which order shows how a chick develops?','Fertilization → zygote → mitosis makes many cells → cells differentiate → hatching','Zygote → fertilization → cells differentiate → mitosis makes many cells → hatching','Fertilization → cells differentiate → zygote → mitosis makes many cells → hatching','Mitosis makes many cells → fertilization → zygote → cells differentiate → hatching'),
    mcLevel(3,'A zygote divides 3 times by mitosis, and every cell divides each time. How many cells are there?','8','6','3','9'),
    mcLevel(3,'A sea urchin egg is fertilized by two sperm at once. Why is that a problem?','The zygote would have too many sets of chromosomes','It would make identical twins','The sperm would use up the egg’s food','Fertilization can’t happen in water')
  ],
  lifeCycles4:[
    mcLevel(1,'Which shows the stages of complete metamorphosis in order?','Egg, larva, pupa, adult','Egg, nymph, pupa, adult','Larva, egg, pupa, adult','Egg, pupa, larva, adult'),
    mcLevel(1,'A visitor points at a caterpillar. Which life cycle stage is it?','Larva','Pupa','Nymph','Adult'),
    mcLevel(1,'What do monarch caterpillars eat?','Milkweed leaves','Nectar from flowers','Parsley and dill','Small insects and aphids'),
    mcLevel(2,'A caterpillar’s skin can’t stretch much. How does it keep growing?','It molts, shedding its old skin for a bigger one','It splits in two, making smaller caterpillars','It spins a silk chrysalis after each meal to have room to grow','Its skin grows new cells by meiosis'),
    mcLevel(2,'Which animal goes through incomplete metamorphosis (egg, nymph, adult)?','Grasshopper','Butterfly','Ladybug beetle','Housefly'),
    mcLevel(2,'What happens inside a butterfly’s chrysalis?','Much of the caterpillar’s body breaks down and is rebuilt into adult parts','The caterpillar sleeps and grows, but its parts stay the same','The butterfly lays its eggs','The caterpillar eats leaves stored inside'),
    mcLevel(2,'How is a tadpole different from an adult frog?','A tadpole breathes with gills and has a tail','A tadpole breathes with lungs and has four legs','A tadpole flies away and lays eggs of its own','A tadpole is a different species from the adult frog'),
    mcLevel(2,'Which stage of a flowering plant’s life cycle comes right after pollination?','Fertilization','Germination','Seed dispersal','Flowering'),
    mcLevel(3,'A monarch caterpillar molts 4 times as it grows, then molts once more. What does that last molt reveal?','The chrysalis (pupa)','A bigger caterpillar','A fully grown butterfly','A nymph (young insect)'),
    mcLevel(3,'Why don’t a monarch caterpillar and an adult monarch compete for food?','The caterpillar chews leaves, and the adult sips nectar','They eat the same leaves, just at different times','Adult butterflies don’t eat','Caterpillars eat other insects'),
    mcLevel(3,'Ladybugs, bees, and flies go through complete metamorphosis. What is one way this can help an insect species?','Young and adults use different foods and places, so they don’t compete','The pupa stage lets the insect rest and skip eating for the rest of its life','Nymphs can fly away from danger','Adults can lay eggs without mating'),
    mcLevel(3,'A milkweed patch is mowed down while monarch caterpillars are still eating. What is most likely to happen to them?','Many will starve, because they can’t eat other plants','They’ll switch to eating the grass and weeds that are left behind','They’ll sip nectar instead, because they can’t find leaves','They’ll turn into butterflies right away to find new food'),
    mcLevel(3,'Which life cycle is matched with the right stages?','Frog: egg, tadpole, froglet, adult','Grasshopper: egg, larva, pupa, adult','Butterfly: egg, nymph, adult','Ladybug: egg, nymph, adult'),
    mcLevel(3,'A painted lady butterfly lays her eggs on thistle, not on milkweed. Why does she choose so carefully?','Her caterpillars can’t travel far and must eat the right host plant','Thistle flowers have the sweetest nectar for her to drink when she’s older','Milkweed leaves are too smooth for eggs to stick','Eggs can only hatch on prickly leaves')
  ]
};
/* Biology Unit 4 (Butterfly House): reserved test pool, Oct 30, 2026 (48 test-only questions; docs/bio4-review.md, "Reserved test pool"). */
reserveForTest(BIO4_QUESTIONS, {
  chromosomes4:[
    mcLevel(2,"Each leaf cell of a garden pea plant holds 7 homologous pairs of chromosomes. How many of the chromosomes in one leaf cell came from the pollen that fertilized the egg the plant grew from?","7","14","2","28"),
    mcLevel(3,"At the Microscope Window, a guide points to the pinched spot where the two sister chromatids of a copied chromosome are held together. What is that spot called, and what happens to it in anaphase?","The centromere; it splits so the sister chromatids separate","The centromere; it holds the homologous pair together for good","The chromatid; it splits so the centromeres separate","The spindle; it splits so the homologous pairs separate"),
    mcLevel(2,"A rabbit sperm cell has 22 chromosomes. How many chromosomes are in one of that rabbit’s ear skin cells?","44","22","11","88"),
    mcLevel(2,"If the DNA from one human cell were stretched out end to end, it would be about 2 meters long, yet it fits inside a nucleus far too small to see. How?","It is coiled tightly around proteins","The cell cuts it into millions of tiny pieces","It is stored outside the nucleus","The cell keeps just the genes it is using"),
    mcLevel(3,"Corn leaf cells have 20 chromosomes. A scientist finds a healthy corn cell with exactly 10 chromosomes. Which kind of cell is it most likely to be?","A sex cell made in the flower","A root cell","A cell that has just finished mitosis","A seedling’s stem cell"),
    mcLevel(3,"In honeybees, females grow from fertilized eggs and have 32 chromosomes in their body cells. Males grow from eggs that were never fertilized. How many chromosomes are in a male honeybee’s body cells?","16","32","64","8"),
    mcLevel(3,"A mouse cell has 40 chromosomes. Every one of them has been copied, and the cell hasn’t started dividing yet. How many centromeres does the cell have?","40","80","20","160"),
    mcLevel(3,"Which two pieces of DNA carry the exact same version of every gene?","The sister chromatids of one copied chromosome","The two chromosomes in one homologous pair of a body cell","Mom’s chromosome 1 and Mom’s chromosome 2","A man’s X chromosome and his Y chromosome")
  ],
  mitosis4:[
    mcLevel(2,"A cell has just finished interphase. Compared with when it first formed, what has changed?","It is bigger, with twice the DNA","It has split its nucleus into two parts","It is smaller and has half as much DNA","It has the same DNA but more chromosome pairs"),
    mcLevel(2,"Which of these depends on mitosis?","A puppy’s leg bones growing longer","A frog’s body making egg cells","A sperm cell joining with an egg","Partner chromosomes trading pieces"),
    mcLevel(2,"A cell has just finished anaphase. What happens next?","New nuclei form around the two sets of chromosomes","The chromosomes line up across the middle","The sister chromatids pull apart toward opposite ends","The DNA is copied so each chromosome gets two chromatids"),
    mcLevel(2,"Why does a cell copy its DNA before mitosis instead of after?","So each new cell gets a full set","So each new cell gets half of the DNA","So the copies can trade pieces with their partners","So the cell keeps double the chromosomes for good"),
    mcLevel(3,"A pig skin cell has 38 chromosomes. It goes through the whole cell cycle, and then both new cells do it again. How many cells are there, and how many chromosomes does each have?","4 cells with 38 each","4 cells with 19 each","2 cells with 38 each","4 cells with 76 each"),
    mcLevel(3,"A cell with 10 chromosomes is in metaphase of mitosis. How many sister chromatids are lined up across the middle of the cell?","20","10","5","40"),
    mcLevel(3,"A drug stops cells from copying their DNA. Which cells in the body would it harm the most?","Cells that divide often, like those lining the gut","Grown nerve cells, which seldom divide after childhood","Egg cells waiting in the ovaries","Fat cells that store energy"),
    mcLevel(3,"During anaphase in a cell with 46 chromosomes, one pair of sister chromatids fails to separate, and both go to the same end. How many chromosomes do the two new cells get?","47 in one cell and 45 in the other","46 in each cell","23 in each cell","47 in each cell")
  ],
  meiosis4:[
    mcLevel(2,"Bacteria never go through meiosis. Why don’t they need it?","They reproduce asexually, so no sex cells join","They have no DNA to copy","Their cells are too small to divide twice","They make their sex cells by mitosis instead"),
    mcLevel(3,"Meiosis has two divisions. What is pulled apart in meiosis II?","Sister chromatids","The homologous pairs","The nuclear membrane and the DNA","Chromosomes from Mom and from Dad"),
    mcLevel(2,"Besides crossing over, what else in meiosis makes each sex cell different?","Pairs line up in random directions","The DNA is copied with lots of mistakes","Each cell gets a random number of chromosomes","The cell divides once"),
    mcLevel(3,"A species has 3 pairs of chromosomes. In meiosis, each pair can line up 2 ways. Ignoring crossing over, how many different chromosome combinations can its sex cells get?","8","6","3","9"),
    mcLevel(2,"In a flowering plant, where does meiosis happen?","In the flower, where its pollen and egg cells form","In the root tip, where new root cells are made","In the leaves, where the plant makes its food","In the growing tip of the stem, where it gets taller"),
    mcLevel(3,"A cell with 16 chromosomes finishes meiosis II. How many chromosomes are in each new cell, and how do the new cells compare?","8, and they are genetically different","8, and the four new cells are identical","16, and they are genetically different","4, and they are each genetically different"),
    mcLevel(3,"A student says, “Meiosis is just mitosis done twice.” What is the best correction?","In meiosis I, partner chromosomes separate, so the number is cut in half","Meiosis copies the DNA twice, once before each division","Meiosis happens in plants, and mitosis happens in animals","In meiosis, the cell doesn’t copy its DNA"),
    mcLevel(2,"A bull’s sperm cells each have 30 chromosomes. How many chromosomes were in the cell that started meiosis?","60","30","15","120")
  ],
  reproTypes4:[
    mcLevel(2,"A strawberry plant sends out a runner, a stem along the ground that roots and grows a new plant. How do the new plant’s genes compare with the parent’s?","They are identical","They are a new mix from two plants","They are half of the parent’s genes","They differ"),
    mcLevel(2,"Which of these is sexual reproduction?","A tulip seed forming after a bee brings pollen from another tulip","A spider plant growing baby plants on long stems","A sea anemone splitting down the middle","A tulip bulb growing new bulbs"),
    mcLevel(2,"Duckweed plants on a calm pond often reproduce by budding. Why is asexual reproduction a good fit for spreading across the pond?","It makes lots of new plants quickly","It mixes genes","It lets each new plant grow larger than its parent","It helps the plants survive a change in the pond"),
    mcLevel(2,"A planarian flatworm is cut in two, and each half regrows into a whole worm. Which describes this?","Asexual; both worms have the same genes","Sexual; both worms have the same genes","Asexual; each worm has a new mix of genes","Sexual; each worm has a new mix of genes"),
    mcLevel(3,"A gardener crosses a red rose with a yellow rose and plants 20 of the seeds. What will the seedlings be like?","Each will have its own mix of the parents’ genes","Ten will copy the red parent, and ten the yellow","Each will be a copy of the red mother plant","They will be identical to one another"),
    mcLevel(2,"In which pair are both examples asexual reproduction?","An amoeba splitting and an aspen tree sprouting from its roots","An amoeba splitting and a salmon’s eggs being fertilized in a stream","A pollinated apple flower and a potato eye","A frog’s eggs and a hydra’s bud"),
    mcLevel(3,"Over 50 years, a lake slowly gets warmer. Snail population A reproduces only asexually, and population B reproduces sexually. Which is more likely to still live there, and why?","B, since some of its varied young may handle warmth","A, because its young vary and some will handle warmth","A, because it makes more young each year","B, because its young may copy the best parent"),
    mcLevel(3,"One bacterium splits in two every 20 minutes, and every new cell keeps splitting. After 2 hours, how many bacteria are there, and how are their genes related?","64, with the same genes","64, each with a new mix of genes","12, with the same genes","32, with the same genes")
  ],
  development4:[
    mcLevel(2,"A rooster’s body cells each have 78 chromosomes. How many chromosomes does a chicken zygote have when one of his sperm fertilizes a hen’s egg?","78","39","156","117"),
    mcLevel(2,"A zygote divides into 2 cells, then 4, then 8. How do the chromosomes in each of the 8 cells compare with the zygote’s?","The same","One-eighth as many","Half as many","A new mix, like a sex cell’s"),
    mcLevel(2,"A person’s skin cells carry the gene for making insulin, but only pancreas cells make insulin. Why don’t skin cells make it?","Skin cells keep that gene switched off","Skin cells lost that gene during mitosis","Pancreas cells have the insulin gene, but skin cells don’t","Skin cells have fewer chromosomes than pancreas cells"),
    mcLevel(2,"A scientist takes cells from a 5-day-old embryo and grows them into beating heart muscle cells in a dish. What kind of cells did she start with?","Stem cells that hadn’t specialized yet","Heart cells","Sex cells made by meiosis","Zygotes with half the usual chromosomes"),
    mcLevel(3,"In 1891 a scientist shook apart the two cells of a 2-cell sea urchin embryo, and each cell grew into a small but complete larva. What does this show about those early cells?","Neither cell had differentiated yet","Each cell had already differentiated into half a larva","Each held a different half of the DNA","They were already sex cells made by meiosis"),
    mcLevel(3,"An embryo has 64 cells. Since the zygote, every cell has divided once in each round of mitosis. How many rounds have there been?","6","32","8","7"),
    mcLevel(2,"Which happens first after a human egg is fertilized?","The zygote divides into two cells by mitosis","The cells differentiate into nerve and skin","The zygote makes sex cells by meiosis","The embryo forms a heart"),
    mcLevel(3,"When a salamander loses a leg, cells near the wound lose their special jobs, divide many times, and then become bone, muscle, and skin again. Which two processes rebuild the leg, in order?","Mitosis, then differentiation","Meiosis, then fertilization","Fertilization, then mitosis","Differentiation, then meiosis")
  ],
  lifeCycles4:[
    mcLevel(2,"A housefly maggot is white, has no legs, and looks nothing like an adult fly. Which life cycle stage is a maggot?","Larva","Nymph","Pupa","Egg"),
    mcLevel(2,"A grasshopper nymph molts several times before it becomes an adult. What is the main difference between the last nymph stage and the adult?","The adult has full-sized wings","The nymph breathes with gills","The nymph has no legs yet","The nymph eats nectar while the adult eats leaves"),
    mcLevel(2,"A mealworm is the larva of a darkling beetle. What does a full-grown mealworm turn into next?","A pupa that doesn’t eat","A nymph with small wing buds","An adult beetle that lays eggs","A winged larva"),
    mcLevel(3,"Why does a butterfly do almost all of its growing as a caterpillar?","Adult butterflies don’t molt, so they can’t get bigger","The pupa eats the most food, so it grows the fastest of all","Adults can’t eat, so they can’t grow","Larvae grow by meiosis, which is faster"),
    mcLevel(2,"A froglet has four legs and a short tail stub. Which change has already happened since it was a young tadpole?","Lungs have replaced its gills","It has already laid its first eggs","It has grown a longer tail for swimming","It has pupated"),
    mcLevel(3,"A bean seed is planted. Which list puts the next steps of its life cycle in order?","Germination, flowering, pollination, new seeds","Flowering, germination, pollination, new seeds","Germination, pollination, flowering, new seeds","Pollination, germination, flowering, new seeds"),
    mcLevel(3,"Japanese beetle grubs live in the soil and eat grass roots; the adults eat rose leaves. A gardener sprays the rose leaves all summer, but beetles come back the next year. What is the most likely reason?","Grubs living in the soil were never reached by the spray","Beetle nymphs hatching on the leaves resist the spray","The beetles skip the larva stage when sprayed","Pupae on the rose leaves are protected"),
    mcLevel(3,"A cicada nymph lives underground for years, then climbs a tree and molts into a winged adult. Which statement about cicadas is accurate?","They have no pupa stage, so it’s incomplete metamorphosis","The underground stage is a larva, so it’s complete metamorphosis","The adult is a pupa until its wings dry","The nymph spins a chrysalis before it molts")
  ]
});
/* ---------- end of Biology Unit 4 ---------- */
// Biology Unit 5: Inheritance and variation (Khan Academy middle school biology, "Inheritance and variation"). The
// student is a tour guide at the Pet World Farm Barn. Khan's lessons, in order (checked from Khan's lesson sitemaps,
// Oct 30 2026): Chromosomes (Understand and Apply), Mutations (Apply), Reproduction and genetic variation (Understand:
// Sexual reproduction and genetic variation, Apply: Genetics vocabulary, Apply: Punnett squares), then the unit test.
// Each lesson also gets new generated problems every try (src/shared/genetics.js). Docs: docs/SCIENCE-UNIT5.md, docs/bio5-review.md
const BIO_UNIT5 = [
  {id:'chromU',name:'Understand: Chromosomes',lesson:'Chromosomes are long, coiled strands of DNA in the nucleus. A gene is a section of DNA with the instructions for a protein, and proteins build the body and do the cell’s work. Body cells have chromosomes in pairs, one of each pair from each parent.',why:'Every trait on the farm, from a calf’s coat to a hen’s comb, starts with instructions on a chromosome.'},
  {id:'chromA',name:'Apply: Chromosomes',lesson:'Use chromosome counts and pairs to explain inheritance. A sex cell (egg or sperm) gets one chromosome from each pair, so it has half the body-cell number; when egg and sperm join, the pairs are whole again. The two chromosomes of a pair carry the same genes but can carry different alleles.',why:'Breeders use chromosome counts to explain why a mule can’t usually have foals.'},
  {id:'mutA',name:'Apply: Mutations',lesson:'A mutation is a change in the DNA of a gene. It can change the protein the gene makes, which can change a trait in a harmful, helpful, or neutral way. A cell reads DNA three letters at a time, so adding or removing one letter shifts every group after it. Only mutations in egg or sperm cells can be passed to offspring.',why:'One small mutation gives Belgian Blue cattle their huge muscles.'},
  {id:'sexVarU',name:'Understand: Sexual reproduction and genetic variation',lesson:'In sexual reproduction, an egg and a sperm from two parents join, so each offspring gets a new mix of alleles: brothers and sisters differ. In asexual reproduction one parent makes offspring with copies of its own genes. Variation helps some of a group survive changes like a new disease.',why:'Farmers mix breeds and keep seed varieties so one disease can’t wipe out everything.'},
  {id:'vocabA',name:'Apply: Genetics vocabulary',lesson:'An allele is one version of a gene. The genotype is the pair of alleles (like Pp); the phenotype is the trait you see (no horns). Homozygous means two of the same allele, heterozygous two different. A dominant allele shows with one copy; a recessive one shows only with two. In codominance both show (roan); in incomplete dominance they blend (blue).',why:'Breeders read genotypes on paperwork the way you read a recipe.'},
  {id:'punnettA',name:'Apply: Punnett squares',lesson:'A Punnett square puts one parent’s two alleles across the top and the other’s down the side; each of the 4 boxes is one equally likely genotype. Count boxes to find a probability (3 of 4 boxes = 3/4 = 75%). Probabilities predict, but a small litter can still come out differently.',why:'Dairy farmers use these odds to breed calves that won’t need their horns removed.'}
];
const BIO_GROUPS5 = [
  {id:'chrom5',name:'Chromosomes',noQuiz:true,skills:['chromU','chromA'],learn:'What chromosomes, genes, and proteins are, why body cells have chromosomes in pairs, and why egg and sperm cells have half as many.',
    hook:{emoji:'🌽',title:'The genes that jumped',story:'In the 1940s, a scientist named Barbara McClintock grew corn with speckled kernels and studied its chromosomes under a microscope. She found that some pieces of DNA could move from one place on a chromosome to another, switching genes on and off and changing the kernels’ colors. Many scientists didn’t believe her for years. In 1983, she won the Nobel Prize for discovering these “jumping genes.”'}},
  {id:'mut5',name:'Mutations',quizName:'Quiz 1',quizSkills:['chromU','chromA','mutA'],skills:['mutA'],learn:'How a change in a gene’s DNA can change a protein and a trait, and why only mutations in egg and sperm cells are inherited.',
    hook:{emoji:'🐂',title:'The cattle with double muscles',story:'Belgian Blue cattle look like bodybuilders. In 1997, scientists found out why: they have a mutation in the gene for myostatin, a protein that tells muscles when to stop growing. Eleven DNA letters are missing, so the cell makes a broken protein that can’t do its job, and the muscles keep growing. The same gene has been found changed in some whippet dogs and even in one very strong German boy.'}},
  {id:'repro5',name:'Reproduction and genetic variation',quizName:'Quiz 2',quizSkills:['sexVarU','vocabA','punnettA'],skills:['sexVarU','vocabA','punnettA'],learn:'Why offspring from two parents vary, the words geneticists use (allele, genotype, phenotype, dominant, recessive), and how a Punnett square predicts the odds of each trait.',
    hook:{emoji:'🫛',title:'The monk who counted peas',story:'From 1856 to 1863, Gregor Mendel, a monk in what is now the Czech Republic, grew about 28,000 pea plants in his monastery garden. He crossed tall and short plants, green and yellow peas, and counted every kind of offspring. The ratios, like 3 to 1, showed that traits come in pairs of “factors,” one from each parent. Almost no one paid attention until 1900, sixteen years after he died. Today his factors are called genes.'}}
];
const BIO5_QUESTIONS = {
  chromU:[
    mcLevel(1,'A visitor at the Barn Microscope asks where an animal’s chromosomes are found. What do you say?','In the nucleus of its cells','In the blood plasma between its cells','In the mitochondria of its muscle cells','In the cell membrane'),
    mcLevel(1,'A kid asks what a chromosome is made of. What do you say?','A long, tightly coiled strand of DNA','A chain of sugar molecules','A bundle of thin, stretchy fibers','A small bubble of water and salt'),
    mcLevel(1,'A visitor asks what a gene is. What do you say?','A section of DNA with instructions for a protein','A whole chromosome made of many cells','A protein that carries oxygen in the blood','The part of a cell that makes sugar'),
    mcLevel(1,'A grandparent asks how many copies of each chromosome a cow’s body cells have. What do you say?','Two, one from each parent','One, from its mother','Four, two from each parent','It depends on how big the cow grows'),
    mcLevel(2,'A kid asks what proteins do in a calf’s body. Which answer is best?','They do much of the cell’s work and build body parts','They store all the DNA instructions inside the nucleus','They carry sunlight energy to the calf’s muscles and bones','They are the chromosomes the calf got from its father'),
    mcLevel(2,'Two chromosomes in a pair have the same genes in the same places. A visitor asks if they must carry the same alleles. What do you say?','No, each can carry a different version of a gene','Yes, the two chromosomes in a pair are exact copies','No, the two chromosomes in a pair can carry different genes','Yes, unless the animal is a clone made in a science lab'),
    mcLevel(2,'A kid asks what an allele is. What do you say?','One version of a gene, such as red or black coat','A whole pair of chromosomes from one parent','A cell that has half the usual chromosomes','The protein a coat-color gene makes'),
    mcLevel(2,'A sheep’s body cells have 54 chromosomes. A visitor asks how many pairs that is. What do you say?','27 pairs','54 pairs','108 pairs','13 pairs'),
    mcLevel(3,'A visitor asks how a change in a gene can change a trait. Which chain is right?','Different gene → different protein → different trait','Different trait → different gene → different protein','Different protein → different chromosome → different gene','Different chromosome → different trait → different protein'),
    mcLevel(3,'A kid asks why a calf looks a bit like its mother and a bit like its father. What do you explain?','It has one chromosome of each pair from each parent','It has all of its mother’s genes and none of its father’s','It copies the traits it sees while it grows up','Its father’s genes take over half of its body cells'),
    mcLevel(3,'Two calves have the same parents but look different. A visitor asks why. What do you explain?','Each got a different mix of its parents’ chromosomes','One of them got genes from a third animal in the herd','Each got the same chromosomes from its parents','The older calf was born first and used up the best genes'),
    mcLevel(3,'A gene for coat color sits on one chromosome pair. How many copies of that gene are in one of a cow’s body cells?','Two, one on each chromosome of the pair','One, on one chromosome of the pair','Sixty, one on each of her chromosomes','One, made by mixing her mother’s and father’s copies'),
    mcLevel(3,'A visitor asks why a cow’s skin cells and muscle cells both have the coat-color gene. What do you explain?','Nearly every body cell has the full set of chromosomes','Each kind of body cell gets its own set of genes for its job','The gene travels around the body in the blood','Cells keep just the genes they use, and both of these use it'),
    mcLevel(3,'Which sentence about genes and proteins is accurate?','Genes hold instructions, and cells use them to make proteins','Proteins hold instructions, and cells use them to make genes','Genes are proteins that carry the instructions for traits','Each protein is a piece of a gene that the cell cut off and used')
  ],
  chromA:[
    mcLevel(1,'A cow’s body cells have 60 chromosomes. How many are in one of her egg cells?','30','60','120','15'),
    mcLevel(1,'A calf got 30 chromosomes from its mother. How many did it get from its father?','30','60','15','0'),
    mcLevel(1,'Which of a rooster’s cells has half the usual number of chromosomes?','A sperm cell','A muscle cell','A skin cell','A blood cell'),
    mcLevel(1,'A visitor sees two chromosomes with the same size, shape, and list of genes. What are they?','A chromosome pair','Two alleles','Two proteins','Two copies of one sex cell'),
    mcLevel(2,'A goat is born with an extra copy of one chromosome. Why might that cause health problems?','Extra genes can mean too much of some proteins','An extra chromosome erases some of the goat’s other genes','The extra chromosomes take up space the blood needs','The extra chromosome turns into a second nucleus'),
    mcLevel(2,'A lamb has a white body like its mother and a dark face like its father. What explains this best?','It got alleles from both parents, and in each trait a different one showed','It picked which parent to look like before birth','Its mother’s genes build its body, and its father’s build its head','It copied its father by staying near him'),
    mcLevel(2,'Each egg from a hen gets one chromosome from each pair. Why does that matter when the egg joins a sperm?','The chick ends up with full pairs again','The chick ends up with twice the normal number','The chick gets no chromosomes from the hen','The egg can then grow without a sperm cell'),
    mcLevel(2,'Holstein cattle are black and white. A breeder says the pattern comes from the calf’s genes. Where are those genes?','On chromosomes in the nucleus of its cells','On chromosomes in its skin cells, but not in its other cells','In its blood, which carries the genes out to the skin','In the milk the calf drinks from its mother'),
    mcLevel(3,'A mule has 63 chromosomes, from a horse (64) and a donkey (62). Why can mules almost never have foals?','Their chromosomes can’t pair up evenly to make sex cells','Mules have no genes for making eggs or sperm','Horses and donkeys have totally different genes','Their chromosomes are too long to fit in a sex cell'),
    mcLevel(3,'A Bb bull has B on one chromosome of a pair and b on the other. What fraction of his sperm cells get the b allele?','1/2','1/4','3/4','All of them'),
    mcLevel(3,'The polled (no horns) gene is on chromosome 1 in cattle. A Pp bull passes P to some calves and p to others. Why?','Each sperm gets just one chromosome 1 from his pair','He passes it to bull calves but not heifers','The P allele is used up after his first few calves','Each calf chooses which of his alleles it wants'),
    mcLevel(3,'A pig has 38 chromosomes in each body cell. After an egg and a sperm join, how many chromosomes does the piglet’s first cell have?','38','19','76','57'),
    mcLevel(3,'Which two cells from the same ram both have 54 chromosomes?','A skin cell and a muscle cell','A sperm cell and a skin cell','Two of his sperm cells','A sperm and a muscle cell'),
    mcLevel(3,'A breeder says, “Genes decide a lot, but the environment matters too.” Which example shows the environment changing a trait?','A calf with genes for large size stays small on poor feed','A calf with genes for red hair is born red to black parents','A calf gets one allele from each parent','A lamb gets 27 chromosomes from its mother')
  ],
  mutA:[
    mcLevel(1,'A visitor asks what a mutation is. What do you say?','A change in the DNA of a gene','A brand-new chromosome that appears from nowhere','An injury, like a broken leg or a cut','A trait an animal learns while growing'),
    mcLevel(1,'A kid asks if mutations are harmful. What do you say?','They can be harmful, helpful, or have no effect','Yes, mutations make animals sick','No, mutations make animals stronger','Yes, because a changed protein can’t work'),
    mcLevel(1,'A visitor asks what can cause a mutation. What do you say?','A mistake when DNA is copied, or things like UV light','Eating food that has a lot of protein in it','Exercising the muscles very hard','Living in a barn with many other animals'),
    mcLevel(1,'A mutation happens in one of a cow’s skin cells. A kid asks if her calves can inherit it. What do you say?','No, only mutations in egg or sperm cells pass on','Yes, mutations in any cell pass to the calves','Yes, but just to her female calves','No, mutations in cows fade before calving'),
    mcLevel(2,'Belgian Blue cattle have a mutation that breaks the gene for myostatin, a protein that limits muscle growth. What trait do they show?','Extra-large muscles','Very small muscles','No horns','A roan coat'),
    mcLevel(2,'A mutation changes one DNA letter, but the protein comes out the same. How can that be?','The new three-letter code stands for the same amino acid','The cell fixes the protein after it is made by checking it','Proteins are not made from the instructions in genes','One letter is too small for the cell to read'),
    mcLevel(2,'A mutation was in the egg that became a calf. A visitor asks why the mutation is in nearly every cell of the calf. What do you explain?','All its cells came from copies of that first cell','The mutation spread through the blood like a cold','The calf caught it from its mother’s milk','Mutations copy themselves into new cells over the years'),
    mcLevel(2,'Which is an example of a helpful mutation for a farm animal?','A mutation that helps cattle resist a disease','A mutation that makes calves too weak to stand','A mutation that stops a hen from making strong eggshells','A mutation that changes a DNA letter but leaves the protein the same'),
    mcLevel(3,'A gene reads ATG GCA TTC AAA. A mutation adds one letter right after ATG. Why does this usually change more than one amino acid?','Every three-letter group after it shifts','The added letter becomes a new chromosome','One extra letter doubles the protein’s size','The cell reads the gene backward after a mutation'),
    mcLevel(3,'Polled (hornless) Holsteins carry a natural mutation. A dairy farmer chooses polled bulls. What is one benefit?','Calves won’t need their horns removed','Calves will grow twice as fast','The cows will produce milk with more protein','The bulls can’t pass on any other mutations'),
    mcLevel(3,'A mutation changes the shape of a protein. Which outcome could happen?','The protein may work worse, better, or about the same','The protein will turn into a different chromosome','The animal’s other genes may mutate too','The protein will change the DNA in the nucleus'),
    mcLevel(3,'A cow has a mutation in her udder cells. Which of her calves could inherit that mutation?','None of them, since udder cells aren’t sex cells','The female calves, which grow udders too','Half of them, like any other allele','The ones born after the mutation happened'),
    mcLevel(3,'A mutation gives some cattle a short, slick hair coat that helps them stay cool. Where would cattle with this mutation most likely do better?','Herds in hot places, where slick-coated cows stay cool','Herds in cold places, where a slick coat keeps cows warm','Any herd, since cows everywhere need to stay cool in summer','Herds kept in cool barns with fans, where the cows stay cool'),
    mcLevel(3,'Which change is NOT a mutation?','A cow’s muscles getting bigger from exercise','A DNA letter swapped in one of a bull’s sperm cells','A DNA letter lost while a cell copies its DNA','UV light changing a DNA letter in a cow’s skin cell')
  ],
  sexVarU:[
    mcLevel(1,'A visitor asks how many parents an animal made by sexual reproduction has. What do you say?','Two','One','Three','It depends on the season'),
    mcLevel(1,'A kid asks how the offspring’s genes compare to the parent’s in asexual reproduction. What do you say?','They are copies of the parent’s genes','Half are from each of two parents','They are a new mix each time','They come from many different parents'),
    mcLevel(1,'Which two cells join in sexual reproduction?','An egg cell and a sperm cell','Two body cells','Two egg cells from one hen','A sperm cell and a skin cell'),
    mcLevel(1,'A strawberry plant by the barn sends out a runner that grows into a new plant. What kind of reproduction is this?','Asexual','Sexual','Pollination','Fertilization'),
    mcLevel(2,'A visitor asks why the piglets in one litter look different from each other. What do you explain?','Each got a different mix of genes from the two parents','The biggest piglet took the best genes first','Piglets copy the look of the piglet next to them','They each got different food first'),
    mcLevel(2,'What is one advantage of sexual reproduction for a herd?','Variety makes it likelier that some survive a new disease','It needs just one parent to make offspring','Some offspring are exact copies of a strong parent','It is faster and makes more offspring'),
    mcLevel(2,'What is one advantage of asexual reproduction?','One parent can make many offspring quickly','Offspring are more varied','Offspring can survive any new disease','It needs a male and a female'),
    mcLevel(2,'Dolly the sheep (born 1996) was cloned from a body cell of a ewe. How did the genes in Dolly’s nucleus compare with that ewe’s?','They were the same as that ewe’s genes','Half from the ewe, half from a ram','They were a new mix, like any lamb’s','She had no genes until she was born'),
    mcLevel(3,'A farmer grows one kind of potato, and every plant is a clone. A new fungus arrives. Why is the farm at high risk?','The plants have the same genes, so all could get sick','Clones grow too slowly and stay too small to fight off a fungus','Clones can’t make the proteins plants use to fight a fungus','Plants grown from pieces of a potato have weaker cells than seedlings'),
    mcLevel(3,'Two black Angus parents have a red calf. A visitor asks how. What do you say?','Each parent passed on a hidden red allele','The calf’s coat changed color after it was born','Red calves come from a new mutation in the calf','The calf got its genes from one parent'),
    mcLevel(3,'Why is a calf not an exact copy of either parent?','It got half its chromosomes from each, in a new mix','From the stronger parent, it got its chromosomes','Calves make new chromosomes as they grow','It got its four grandparents’ chromosomes'),
    mcLevel(3,'A hen has two alleles for a gene, B and b. Each egg gets one of them. What does this mean for her chicks?','Some chicks can get B and others b','Each chick gets both B and b','Each chick gets B, since it is the dominant one','The chicks get no alleles from the hen'),
    mcLevel(3,'Which group of offspring is most likely to have a lot of genetic variety?','Lambs from many ewes and rams','Cuttings from one rose bush','Lambs from one ewe and one ram','Chicks hatched from one hen’s eggs and fathered by one rooster'),
    mcLevel(3,'A breeder wants calves just like her best cow. Which method gives the closest match?','Cloning the cow from one of her body cells','Breeding her with her own brother','Breeding her with the best bull at the fair','Breeding her with a bull from her own family line, many times')
  ],
  vocabA:[
    mcLevel(1,'A calf’s genotype is Pp. A kid asks what “genotype” means. What do you say?','The two alleles it has for a gene','What the calf looks like','How many chromosomes it has','The kind of food its mother ate'),
    mcLevel(1,'A calf has no horns. Is “no horns” a genotype or a phenotype?','A phenotype, because it is a trait you can see','A genotype, because you can count it','An allele, because it is passed on','A chromosome, because it is in every cell'),
    mcLevel(1,'A visitor asks what “dominant allele” means. What do you say?','An allele that shows its trait even with one copy','An allele that makes the animal bigger','An allele found in more animals than any other','An allele that comes from the father'),
    mcLevel(1,'Which genotype is heterozygous?','Bb','BB','bb'),
    mcLevel(2,'In sheep, white wool (W) is dominant over black wool (w). A ewe’s genotype is ww. What is her phenotype?','Black wool','White wool','Gray wool','Black and white spots'),
    mcLevel(2,'A red Angus calf has two red alleles. Which words describe it?','Homozygous recessive','Heterozygous','Homozygous dominant','Heterozygous dominant'),
    mcLevel(2,'A roan Shorthorn has red hairs and white hairs mixed together. Which pattern of inheritance is this?','Codominance','Incomplete dominance','Complete dominance','A mutation'),
    mcLevel(2,'A blue Andalusian chick has a black parent and a splash white parent. Its feathers are a blend of the two colors. What is this called?','Incomplete dominance','Codominance','Complete dominance','Asexual reproduction'),
    mcLevel(3,'Two calves have no horns. One is PP and one is Pp. Which is true?','Same phenotype, different genotypes','Same genotype, different phenotypes','Different genotypes and different phenotypes','Same genotype and same phenotype'),
    mcLevel(3,'Why can’t you tell a black Angus bull’s genotype just by looking at him?','BB and Bb both give a black coat','Genotypes change as the bull gets older','Black hides all of the bull’s alleles','Black bulls have three alleles for coat color'),
    mcLevel(3,'In Shorthorn cattle, red (R) and white (W) are codominant. A breeder wants every calf to be roan. Which pair should she breed?','A red cow and a white bull','Two roan cattle','A roan cow and a red bull','A roan cow and a white bull'),
    mcLevel(3,'Why does a roan × roan cross give some red, some roan, and some white calves?','Each parent can pass on either R or W','Roan is a mutation that comes and goes','The calves mix colors as they grow up','Roan parents can carry three alleles each'),
    mcLevel(3,'Which statement about dominant alleles is true?','A dominant allele can be rare in a herd','A dominant allele is the most common one in a herd','A dominant allele is healthier','A dominant allele turns recessive alleles into copies of itself'),
    mcLevel(3,'In chickens, a rose comb (R) is dominant over a single comb (r). A rose-comb hen has a single-comb chick. What is the hen’s genotype?','Rr','RR','rr','RR or Rr, no way to tell')
  ],
  punnettA:[
    mcLevel(1,'A visitor asks what each box of a Punnett square shows. What do you say?','One possible genotype for an offspring','One parent’s whole set of genes','The exact number of babies born','A different trait the parents have'),
    mcLevel(1,'What goes along the top and the side of a Punnett square?','The alleles each parent can pass on','The phenotypes of all the grandparents','The number of offspring they can expect','The genotypes of the four offspring born'),
    mcLevel(1,'A Bb × bb Punnett square has 2 boxes of Bb and 2 boxes of bb. What is the chance of a bb calf?','1/2','1/4','3/4','0'),
    mcLevel(1,'In cattle, P (polled, no horns) is dominant over p (horns). A Pp × Pp square has PP, Pp, Pp, and pp. How many of the 4 boxes have no horns?','3','1','2','4'),
    mcLevel(2,'Two Pp cattle have 4 calves. Which statement is true?','Each calf has a 1/4 chance of having horns','Exactly 1 of the 4 calves will have horns','At least 1 of the 4 calves will have horns','The first calf will be the one with horns'),
    mcLevel(1,'A Punnett square predicts that 3/4 of the calves will be black. What percent is that?','75%','34%','25%','3.4%'),
    mcLevel(2,'In sheep, white wool (W) is dominant over black wool (w). A WW ram and a ww ewe have a lamb. What is its genotype?','Ww','WW','ww','WW or ww'),
    mcLevel(2,'In Shorthorn cattle, an RW calf is roan and an RR calf is red. A roan cow (RW) and a red bull (RR) have calves. What fraction should be roan?','1/2','1/4','3/4','1'),
    mcLevel(3,'Two blue Andalusian chickens (BW) have 40 chicks. BB chicks are black. About how many chicks are black?','10','20','30','0'),
    mcLevel(3,'A Punnett square says 1/2 of the lambs should be black, but 3 of 4 lambs were black. Is the square wrong?','No, small groups often differ from the prediction by chance','Yes, the square should have shown 3/4','Yes, Punnett squares work for cattle but not sheep','Yes, the parents’ genotypes must have changed'),
    mcLevel(3,'Two Pp cattle have a calf with no horns. What is the chance this calf is Pp?','2/3','1/2','3/4','1/4'),
    mcLevel(3,'A horned cow (pp) and a polled bull have a horned calf. What must the bull’s genotype be?','Pp','PP','pp','PP or Pp'),
    mcLevel(3,'A Pp cow and a Pp bull have two calves. What is the chance that both have horns?','1/16','1/4','1/8','1/2'),
    mcLevel(3,'In Angus cattle, black (B) is dominant over red (b). A black bull is bred to 20 red cows, and all 20 calves are black. What is the best conclusion?','He is most likely BB','He must be Bb, a carrier','He must be bb, like the cows','He is most likely Bb')
  ]
};
/* Biology Unit 5 (Farm Barn): reserved test pool, Oct 30, 2026 (36 test-only questions; docs/bio5-review.md, "Reserved test pool"). */
reserveForTest(BIO5_QUESTIONS, {
  chromU:[
    mcLevel(2,"A goat’s horn cells make keratin, the tough protein that builds horns. Where do those cells get the instructions for making keratin?","From the keratin gene on one of the goat’s chromosomes","From keratin in the goat’s food, which the cell copies","From proteins already in the horn, which make more keratin","From the goat’s blood, which carries instructions to the horn"),
    mcLevel(2,"A rabbit’s gene for fur color and its gene for ear length both sit on the same chromosome. What does this show?","One chromosome holds many different genes","Fur color and ear length are controlled by one gene","The two genes make one protein together","A chromosome is a single gene that is very long"),
    mcLevel(3,"A goat’s hoof cells and stomach cells have the same chromosomes, so both carry the keratin gene. Hoof cells make lots of keratin, but stomach cells make almost none. What explains this?","Each kind of cell uses some of its genes and leaves others switched off","The stomach cells lost the keratin gene as they grew","Keratin made in the stomach is carried to the hooves by the blood","Stomach cells keep the keratin gene in the wrong part of the nucleus"),
    mcLevel(3,"Alpacas have 74 chromosomes in each body cell, and people have 46. A visitor says, “So an alpaca must have more genes than a person.” What is the best reply?","Chromosome count doesn’t tell you how many genes an animal has","Each chromosome carries one gene, so the alpaca has 74","An animal with more chromosomes has more genes to fit inside them","Animals with more genes need fewer chromosomes"),
    mcLevel(2,"Calves digest the sugar in milk with lactase, a protein. A calf is born with both copies of its lactase gene broken. What would most likely happen?","It would have trouble digesting the sugar in its milk","It would have trouble digesting the fat in its milk","Its other body cells would make extra lactase for its gut","It would digest milk normally, using its mother’s lactase gene"),
    mcLevel(3,"A barn vet explains that a cow’s red blood cells push out their nucleus as they mature. What is true of one of her mature red blood cells?","It no longer holds her chromosomes","It holds half her chromosomes, like an egg","It keeps her chromosomes in its cell membrane","It stores her chromosomes in the blood around it")
  ],
  chromA:[
    mcLevel(2,"A rabbit’s egg cell has 22 chromosomes. How many chromosomes are in one of that rabbit’s skin cells?","44","22","11","88"),
    mcLevel(2,"Ducks have 80 chromosomes in each body cell. A duck egg and a duck sperm join. How many chromosome pairs does the duckling’s first cell have?","40 pairs","20 pairs","80 pairs","160 pairs"),
    mcLevel(3,"A billy goat has alleles A and a for a gene on one chromosome pair, and alleles B and b for a gene on a different pair. Which set of alleles could one of his sperm cells carry?","A and b","A and a","B and b","A, a, B, and b"),
    mcLevel(3,"Corn plants have 20 chromosomes in each body cell. A pollen grain’s sperm normally brings 10 to the egg. If a mistake gave one sperm 20 chromosomes, how many would the new corn embryo have?","30","20","40","15"),
    mcLevel(2,"A doe rabbit got a short-fur allele on chromosome 2 from her mother and a long-fur allele on chromosome 2 from her father. Which is true about the eggs she makes?","About half get the short-fur allele, and half get the long-fur one","Each egg gets both alleles, one on each chromosome 2","About three in four get the allele that shows in her fur","Each egg gets her mother’s allele, since eggs come from mothers"),
    mcLevel(3,"A goat’s egg cell has 30 chromosomes. A student says, “That’s 15 pairs.” What is the mistake?","Each of its 30 chromosomes is from a different pair","The egg has 30 pairs, because it came from a cell with 30 pairs","The egg has 60 chromosomes, the same as the goat’s body cells","The egg has 15 pairs, but each pair is missing one of its genes")
  ],
  mutA:[
    mcLevel(3,"Siamese cats carry a mutation in a gene for a fur-color protein. The changed protein works well only where the skin is cool and poorly where it is warm. Which parts of a Siamese cat’s coat are darkest?","The ears, paws, and tail, the coolest parts","The belly, chest, and back, the warmest parts","The back and head, where the sun hits most","The whole coat evenly, since each skin cell has the mutation"),
    mcLevel(3,"A mutation removes three DNA letters in a row from the middle of a gene: exactly one whole three-letter group. What most likely happens to the protein?","It is missing one amino acid, and the rest of the protein stays the same","The amino acids after the cut change, as with a one-letter loss","It is cut short right where the three letters were removed","It stays the same, since the cell reads letters in threes"),
    mcLevel(2,"In which of a ewe’s cells could a new mutation be passed on to her future lambs?","A cell in her ovary that will become an egg","A cell in her udder that makes milk for her lambs","A cell in her womb, where her lambs will grow","A blood cell that carries food to her unborn lambs"),
    mcLevel(2,"A mutation changes one DNA letter in a stretch of a goat’s DNA that is not part of any gene. What is the most likely result?","No protein changes, so the goat’s traits likely stay the same","The protein made by the nearest gene turns into a new protein","A new gene forms at that spot and gives the goat a new trait","The goat’s chromosome breaks apart at that spot"),
    mcLevel(3,"Two calves each have a one-letter deletion in the same 900-letter gene. In calf A, it is near the start of the gene; in calf B, it is in the last few letters. Whose protein is likely more changed?","Calf A’s, since more three-letter groups come after its deletion","Calf B’s, since the end of the gene is read last","Neither, since one letter is too small to matter","They change by the same amount, since each calf lost just one letter"),
    mcLevel(2,"A visitor says, “The goats needed thicker coats for a cold winter, so their genes mutated to give them thicker coats.” What is wrong with that idea?","Mutations happen by chance, not because an animal needs them","Coat thickness is a trait that genes don’t control","Mutations can make a coat thinner but not thicker","Genes can mutate in young goats but not in grown ones")
  ],
  sexVarU:[
    mcLevel(2,"One farmer plants garlic cloves split from a single bulb. Another plants seeds from pumpkin flowers that bees pollinated. Which crop will most likely show more genetic variety, and why?","The pumpkins, since each seed got a new mix from two parents","The garlic, since each clove grows in its own spot in the soil","The pumpkins, since bees add genes of their own to the seeds","The garlic, since a bulb holds cloves from many parent plants"),
    mcLevel(2,"In summer, the aphids on the barn’s rose bushes are females that give birth to daughters without mating. How do the daughters’ genes compare with their mother’s?","They are nearly identical to their mother’s genes, like clones","They are a new mix","Each daughter has a new mix of her mother’s genes","Each daughter has half as many genes as her mother"),
    mcLevel(3,"In which situation would asexual reproduction most likely help a plant more than sexual reproduction would?","Spreading fast across a field where conditions stay steady","Surviving a new plant disease that has just reached the farm this year","Coping with weather that changes a lot from year to year","Producing seedlings with many new mixes of traits"),
    mcLevel(3,"Two goat kids have the same mother and father. One has its mother’s long, droopy ears, and the other doesn’t. Both got 30 chromosomes from their mother. What best explains the difference?","The two eggs got different mixes of their mother’s chromosomes during meiosis","One kid got more of its mother’s chromosomes than the other did","The ear genes of the second kid mutated after it was born","Long ears show up in the kid that was born first"),
    mcLevel(3,"A rancher has five clones made from her prize mare. The clones grow up with slightly different white markings on their faces. What best explains this?","Each clone’s markings also depended on chance as it developed","Each clone got a new mix of the mare’s alleles","Each clone’s genes mutated into a new set as it grew","Each clone got half of its genes from a stallion"),
    mcLevel(2,"Which pair is most likely to be genetically identical?","Two plants grown from cuttings of one geranium","Two ducklings from one nest, with the same parents","Two kittens born in the same litter to one mother","Two corn plants grown from kernels on one ear")
  ],
  vocabA:[
    mcLevel(2,"In rabbits, a gene for hair length comes in a short-hair version (L) and a long angora-hair version (l). What are L and l?","Two alleles of one gene","Two genes on different chromosomes","Two phenotypes of one rabbit","Two genotypes for hair length"),
    mcLevel(2,"In snapdragons, a red-flowered plant (RR) crossed with a white-flowered plant (WW) gives pink-flowered plants. Which choice names the pattern and the pink plants’ genotype?","Incomplete dominance; RW","Codominance; RW","Incomplete dominance; RR","Complete dominance; RR"),
    mcLevel(2,"A gardener crosses a plant with red flowers and a plant with white flowers. Which offspring would show codominance?","Plants whose flowers have red patches and white patches","Plants whose flowers are an even pink","Plants whose flowers are deep red, like one parent","Some plants with red flowers and some with white flowers"),
    mcLevel(3,"Two goats with wattles (small flaps of skin on the neck) have a kid without wattles. What is the most likely explanation about the no-wattles allele?","It is recessive, since it was hidden in both parents","It is dominant, since it showed up in the kid","It is codominant, since both traits appear in the family","It is a new mutation, since neither parent showed it"),
    mcLevel(3,"In horses, the allele E is dominant over e. A horse with at least one E can make black pigment; an ee horse is chestnut, a reddish color. Two chestnut horses have a foal. Which is true?","The foal is ee and chestnut, like both parents","The foal could be EE, Ee, or ee, like any foal","The foal is Ee, so it carries black but looks chestnut","The foal has a 1 in 4 chance of making black pigment"),
    mcLevel(3,"In Shorthorn cattle, red (R) and white (W) are codominant. Why can a breeder tell any calf’s genotype just by looking at its coat?","Each of the three genotypes, RR, RW and WW, gives a different coat color","Shorthorn calves are homozygous for coat color","Red is dominant, so a red calf has to be RR","The white allele hides the red allele in a roan calf")
  ],
  punnettA:[
    mcLevel(2,"In rabbits, short hair (L) is dominant over long angora hair (l). An Ll doe and an ll buck have 12 kits over a few litters. About how many kits would you expect to have angora hair?","6","3","9","12"),
    mcLevel(2,"In snapdragons, red (RR) and white (WW) show incomplete dominance, so RW plants are pink. A pink plant is crossed with a white plant. What percent of the offspring should have red flowers?","0%","25%","50%","75%"),
    mcLevel(3,"In sheep, white wool (W) is dominant over black wool (w). A white ram and a black ewe have a black lamb. What is the chance that their next lamb is black?","1/2","1/4","3/4","0"),
    mcLevel(3,"In goats, wattles (W) are dominant over no wattles (w). Two Ww goats have two kids, one after the other. What is the probability that both kids have wattles?","9/16","3/4","3/16","1/2"),
    mcLevel(2,"A Punnett square has W and W across the top and W and w down the side. What do its four boxes show?","2 WW and 2 Ww","1 WW, 2 Ww, and 1 ww","4 Ww","3 WW and 1 Ww"),
    mcLevel(2,"In rabbits, short hair (L) is dominant over angora hair (l). Two Ll rabbits have had three kits, and each of the three has short hair. What is the chance their next kit has angora hair?","1/4","1/2","0","3/4")
  ]
});
/* ---------- end of Biology Unit 5 ---------- */
const KHAN = 'https://www.khanacademy.org/';
const GRAMMAR = `${KHAN}humanities/grammar/parts-of-speech-the-`, WORLD = `${KHAN}humanities/world-history/x66f79d8a:`, BIO6 = `${KHAN}science/grade-6-science/x88f5990a7622d8f5:life-sciences/x88f5990a7622d8f5:`;
const MEO = `${KHAN}science/ms-biology/x0c5bb03129646fd6:matter-and-energy-in-organisms/x0c5bb03129646fd6:`;   // Middle school biology, Unit 3
const MIV = `${KHAN}science/ms-biology/x0c5bb03129646fd6:inheritance-and-variation/x0c5bb03129646fd6:`;   // Middle school biology, Inheritance and variation (the Farm Barn)
const CDIV = `${KHAN}science/biology/cellular-molecular-biology/`;   // Biology Unit 4: Khan's Biology library, cell division (docs/SCIENCE-UNIT4.md)
const STYLE_KHAN = `${KHAN}humanities/grammar/usage-and-style/style/`;   // English Unit 10: Khan's one lesson, Style! (docs/ENGLISH-UNIT10.md)
/* every Khan video in each lesson (History and Biology: the videos come first; docs/PRACTICE-TIME.md). Checked Oct 27 2026. */
const KHAN_VIDEOS = {
  /* English Unit 10 (the 🪶 Style Library): every video in Khan's lesson Style!, in Khan's order (Khan's lesson sitemap,
     Oct 30 2026). Pet World splits the lesson at its first practice: the sound video, then the other three. */
  style:{
    sound:[["The sound of language: alliteration, assonance, and onomatopoeia", `${STYLE_KHAN}v/alliteration-assonance-and-onomatopoeia`]],
    technique:[["The scale of formality", `${STYLE_KHAN}v/scale-of-formality`], ["Under- and overstatement", `${STYLE_KHAN}v/under-and-overstatement-final`], ["Irony", `${STYLE_KHAN}v/irony-final`]]
  },
  /* Biology Unit 3 (Matter and energy in organisms): every video in each Khan lesson, checked Oct 29 2026 (Khan's lesson
     sitemaps). Each lesson also has a “Key points” article; the Unit 3 activity is an article with no video. */
  bio3:{
    photo3:[["Photosynthesis in organisms", `${MEO}photosynthesis-in-organisms/v/ms-photosynthesis-in-organisms`]],
    food3:[["Food and energy in organisms", `${MEO}food-and-energy-in-organisms/v/food-and-energy-in-organisms-ms`], ["Cellular respiration", `${MEO}food-and-energy-in-organisms/v/cellular-respiration-ms`]],
    activity3:[]
  },
  /* Biology Unit 4 (Cell division and life cycles): Khan's cell division videos (Biology library: mitosis and meiosis
     tutorials) and middle school biology's reproduction video. Khan's pages need JavaScript, so only the "Mitosis" and
     the middle school video addresses could be confirmed from the build sandbox; run npm run check-links (docs/SCIENCE-UNIT4.md). */
  bio4:{
    cellcycle4:[["Chromosomes, chromatids, chromatin, etc.", `${CDIV}mitosis/v/chromosomes-chromatids-chromatin-etc`], ["Interphase", `${CDIV}mitosis/v/interphase`], ["Phases of mitosis", `${CDIV}mitosis/v/phases-of-mitosis`], ["Mitosis", `${CDIV}mitosis/v/mitosis`]],
    sexrepro4:[["Phases of meiosis", `${CDIV}meiosis/v/phases-of-meiosis`], ["Comparing mitosis and meiosis", `${CDIV}meiosis/v/comparing-mitosis-and-meiosis`], ["Sexual and asexual reproduction", `${KHAN}science/ms-biology/x0c5bb03129646fd6:organism-growth-and-reproduction/x0c5bb03129646fd6:sexual-and-asexual-reproduction/v/ms-sexual-and-asexual-reproduction`]],
    lifecycle4:[["Zygote differentiating into somatic and germ cells", `${CDIV}meiosis/v/zygote-differentiating-into-somatic-and-germ-cells`]]
  },
  /* Biology Unit 5 (Inheritance and variation, the Farm Barn): every video in each Khan lesson, checked Oct 30 2026 (Khan's
     lesson sitemaps). Each lesson also has an article (key points, or genetics vocabulary and Punnett squares). */
  bio5:{
    chrom5:[["Chromosomes and genes", `${MIV}chromosomes/v/chromosomes-and-genes`], ["Chromosome pairs", `${MIV}chromosomes/v/chromosome-pairs`]],
    mut5:[["Mutations", `${MIV}mutations/v/mutations`]],
    repro5:[["Sexual reproduction and genetic variation", `${MIV}reproduction-and-genetic-variation/v/sexual-reproduction-and-genetic-variation`], ["Genetics vocabulary", `${MIV}reproduction-and-genetic-variation/v/genetics-vocabulary`], ["Worked examples: Punnett squares", `${MIV}reproduction-and-genetic-variation/v/worked-examples-punnett-squares`]]
  },
  history6:{   // History Unit 6, checked on khanacademy.org Oct 28 2026; 6.3 has no videos on Khan
    overview6:[["The First Global Age (1200 to 1750 CE): Unit 6 Overview", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-first-global-age-6-1/v/the-first-global-age-1200-to-1750-ce-unit-6-overview`], ["Frames in Unit 6", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-first-global-age-6-1/v/watch-frames-in-unit-6-origins`]],
    mongol6:[["Genghis Khan and the Mongol Empire", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-mongol-empire-6-2/v/genghis-khan-and-the-mongol-empire`], ["Why were the Mongols so effective?", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-mongol-empire-6-2/v/why-were-the-mongols-so-effective-world-history-khan-academy`]],
    plague6:[],
    exchange6:[["The Protestant Reformation", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:cultural-exchange-in-afro-eurasia-6-4/v/watch-the-protestant-reformation`]],
    americas6:[["Communities of Movement: Ancestral Puebloans", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:communities-in-the-americas-6-5/v/watch-communities-of-movement-ancestral-puebloans-world-history-project`], ["The Aztec Empire", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:communities-in-the-americas-6-5/v/aztec-empire`], ["The Inca Empire", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:communities-in-the-americas-6-5/v/inca-empire-overview`]],
    trade6:[["World of Chaco", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:trade-routes-in-the-americas-6-6/v/watch-the-world-of-chaco-world-history-project`]],
    empires6:[["Ottoman, Safavid and Mughal Empires", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:empires-expand-6-8/v/ottoman-safavid-and-mughal-empires-world-history-khan-academy`], ["Mughal rule in India", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:empires-expand-6-8/v/mughal-rule-in-india`]],
    explore6:[["Spain, Portugal, and the creation of a global economy", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:age-of-exploration-6-7/v/spain-portugal-and-the-creation-of-a-global-economy`]],
    columbian6:[["The Columbian Exchange", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-columbian-exchange-6-8/v/watch-the-columbian-exchange`]],
    slavery6:[["Impact of the Slave Trade Through a Ghanaian Lens", `${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-transatlantic-slave-trade-6-9/v/impact-of-the-slave-trade-through-a-ghanaian-lens-world-history-project-beta`]]
  },
  history5:{
    overview5:[["Unit 5 Overview", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:collapse-and-restructuring-5-1/v/watch-regional-webs-200-to-1500-ce-unit-5-overview`], ["Frames in Unit 5", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:collapse-and-restructuring-5-1/v/watch-frames-in-unit-5`]],
    collapse5:[["Justinian and the Byzantine Empire", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:why-do-empires-collapse-5-2/v/justinian-and-the-byzantine-empire`], ["Comparing Roman and Byzantine Empires", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:why-do-empires-collapse-5-2/v/comparing-roman-and-byzantine-empires`]],
    darkAges5:[],
    europe5:[["Overview of the Middle Ages", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/v/overview-of-the-middle-ages`], ["Feudal system during the Middle Ages", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/v/feudal-system-during-the-middle-ages`], ["Peasant revolts", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/v/peasant-revolts`], ["Introduction to the Crusades", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/v/introduction-to-the-crusades`], ["How did Russia begin?", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/v/how-did-russia-begin`]],
    china5:[["Neo-Confucianism and Zhu Xi", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-china-5-4/v/neo-confucianism-and-zhu-xi`]],
    islam5:[["The Emergence of Islam", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/v/the-emergence-of-islam`], ["Causes and Consequences of the Crusades", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/v/causes-and-consequences-of-the-crusades-oer-project`], ["Golden age of Islam", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/v/golden-age-of-islam`], ["Sunni and Shia Islam, part 1", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/v/sunni-and-shia-islam-part-1`], ["Sunni and Shia Islam, part 2", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/v/sunni-and-shia-islam-part-2`]],
    silk5:[["Rebuilding the Silk Road", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-silk-roads-5-7/v/watch-rebuilding-the-silk-road-world-history-project-beta`], ["The Silk Road", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-silk-roads-5-7/v/early-silk-road`]],
    expand5:[["Silk and the Song Dynasty", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/silk-and-the-song-dynasty`], ["Guilds, Wool, and Trade: Medieval England", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/watch-guilds-wool-and-trade-medieval-england-in-a-global-economy`], ["Mansa Musa and Islam in Africa", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/mansa-musa-and-islam-in-africa-crash-course-world-history-16`], ["Prosperity in Song China (960–1279)", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/prosperity-in-song-china-960-1279`], ["Classical Japan during the Heian Period", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/classical-japan-during-the-heian-period-world-history-khan-academy`], ["Shoguns, samurai and the Japanese Middle Ages", `${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/v/shoguns-samurai-and-the-japanese-middle-ages`]]
  },
  history4:{
    portableBelief:[], comparePortable:[], religionsChange:[], compareEmpires:[],   // these lessons have no videos on Khan
    overview4:[['Unit 4 Overview', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:empires-and-belief-systems-4-1/v/watch-empires-and-belief-systems-600-bce-to-700-ce-unit-4-overview`]],
    confucianism:[['Confucius and the Hundred Schools of Thought', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:china-confucianism-legalism-and-daoism-4-3/v/confucius-and-confucianism`]],
    hinduBuddhism:[['The Vedic Period', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/v/introduction-to-the-vedic-period`], ['Hinduism: Brahman, Atman, Samsara and Moksha', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/v/hinduism-introduction-core-ideas-of-brahman-atman-samsara-and-moksha`], ['Early Buddhism', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/v/buddhism`], ['Core spiritual ideas of Buddhism', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/v/core-spiritual-ideas-of-buddhism`]],
    judaismChristianity:[['Zoroastrianism', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/v/zoroastrianism`], ['Early Judaism, part 1', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/v/overview-of-early-judaism-part-1`], ['Early Judaism, part 2', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/v/overview-of-early-judaism-part-2`], ['Early Christianity', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/v/jesus-christ-and-christianity`], ['The spread of Christianity', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/v/paul-apostles-christianity`]],
    islam:[['Introduction to Islam', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:islam-4-6/v/introduction-to-islam`], ['The spread of Islam', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:islam-4-6/v/spread-of-islam`]],
    persiaGreece:[['Ancient Persia', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/overview-of-ancient-persia`], ['Greco-Persian Wars', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/beginning-of-the-greco-persian-wars`], ['Classical Greece', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/overview-of-ancient-greece`], ['Classical Greek Society and Culture', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/golden-age-of-athens-pericles-and-greek-culture`], ['The Peloponnesian War', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/the-peloponnesian-war`], ['Alexander the Great takes power', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/alexander-the-great-takes-power`], ['Alexander the Great conquers Persia', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/v/alexander-the-great-conquers-persia`]],
    mauryaGupta:[['The rise of empires in India', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-mauryan-and-gupta/v/chandragupta-ashoka-and-the-maurya-empire`], ['Gupta Dynasty', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-mauryan-and-gupta/v/gupta-dynasty`]],
    imperialChina:[['Zhou, Qin and Han Dynasties', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-zhou-and-qin/v/zhou-qin-and-han-dynasties`]],
    romeAndHan:[['Chinese Imperial Dynasties', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/v/chinese-imperial-dynasties`], ['An Overview of Ancient Rome', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/v/overview-of-the-roman-empire`], ['Punic Wars between Rome and Carthage', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/v/punic-wars-between-rome-and-carthage`], ['Emperors of Pax Romana', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/v/emperors-of-pax-romana`], ['Fall of the Roman Empire', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/v/fall-of-the-roman-empire`]],
    riseFall:[['Comparison: Rise of empires', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:the-rise-and-fall-of-empires/v/comparison-rise-of-empires`], ['Comparison: Fall of empires', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:the-rise-and-fall-of-empires/v/the-fall-of-empires`]],
    womenAncient:[['Comparative roles of women in Rome and Han China', `${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:women-in-the-ancient-world-4-15/v/comparative-roles-of-women-in-rome-and-han-china`]]
  },
  history7:{   // History Unit 7: every video in each Khan lesson (checked Oct 28 2026)
    overview7:[["Unit 7 Overview", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-long-nineteenth-century-7-1/v/watch-unit-7-overview`], ["Unit 7 Frames", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-long-nineteenth-century-7-1/v/watch-unit-7-frames`]],
    enlighten7:[["The Scientific Revolution and the Age of Enlightenment", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:enlightenment-and-revolution-7-2/v/watch-the-scientific-revolution-and-the-age-of-enlightenment-world-history-khan-academy`]],
    atlantic7:[["The Haitian Revolution", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/the-haitian-revolution`], ["Background and introduction to the United States Declaration of Independence", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/background-and-introduction-to-the-united-states-declaration-of-independence`], ["Birth of the US Constitution", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/birth-of-the-us-constitution`], ["French Revolution (part 1)", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/french-revolution-part-1`], ["French Revolution (part 2)", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/french-revolution-part-2`], ["French Revolution (part 3) - Reign of Terror", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/french-revolution-part-3-reign-of-terror`], ["French Revolution (part 4) - The Rise of Napoleon Bonaparte", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/french-revolution-part-4-the-rise-of-napoleon-bonaparte`], ["Latin American independence movements", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/latin-america-indepence`], ["Haitian Revolution (Part 1)", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/haitian-revolution-part-1`], ["Haitian Revolution (Part 2)", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/v/haitian-revolution-part-2`]],
    nation7:[["Nationalism", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:nationalism-7-4/v/nationalism`]],
    industry7:[["Origins of the Industrial Revolution", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-industrial-revolution-7-5/v/origins-of-the-industrial-revolution`]],
    egyptJapan7:[["Japan's Home Run: The Meiji Restoration", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:comparing-industrialization-in-egypt-and-japan-7-6/v/japans-home-run-the-meiji-restoration`]],
    workers7:[["Capitalism and Socialism", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-working-class-7-7/v/capitalism-and-socialism-crash-course-world-history-33-beta`]],
    reform7:[],
    imperial7:[["Industrialization and imperialism", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:industrial-imperialism-7-9/v/industrialization-and-imperialism`], ["Opium Wars", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:industrial-imperialism-7-9/v/watch-opium-wars-world-history-khan-academy`], ["Japanese Imperialism", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:industrial-imperialism-7-9/v/japanese-imperialism-world-history-khan-academy`]],
    resist7:[["Experiencing Colonialism: Through a Ghanaian Lens", `${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:resisting-colonialism-7-10/v/experiencing-colonialism-through-a-ghanaian-lens-world-history-project-beta`]]
  },
  /* History Unit 8 (Global Conflict): every Khan video per lesson, checked Oct 28 2026; 8.7 has none */
  history8:{
    overview8:[["Global Conflict (1914 to 1991 CE): Unit 8 Overview", `${WORLD}global-conflict/x66f79d8a:century-of-conflict-8-1/v/global-conflict-1914-to-1991-ce-unit-8-overview`], ["Unit 8 Frames Part 1", `${WORLD}global-conflict/x66f79d8a:century-of-conflict-8-1/v/unit-8-frames-part-1`], ["Unit 8 Frames Part 2", `${WORLD}global-conflict/x66f79d8a:century-of-conflict-8-1/v/unit-8-frames-part-2`]],
    causes8:[["How a Wrong Turn Started World War I", `${WORLD}global-conflict/x66f79d8a:causes-of-the-first-world-war-8-2/v/how-a-wrong-turn-started-world-war-i`], ["Empires before World War I", `${WORLD}global-conflict/x66f79d8a:causes-of-the-first-world-war-8-2/v/empires-before-world-war-i`], ["Alliances leading to World War I", `${WORLD}global-conflict/x66f79d8a:causes-of-the-first-world-war-8-2/v/alliances-leading-to-world-war-i`], ["The Great War begins", `${WORLD}global-conflict/x66f79d8a:causes-of-the-first-world-war-8-2/v/the-great-war-begins`]],
    totalWar8:[["Britain and World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/watch-britain-and-world-war-i-beta`], ["Italian front in World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/italian-front-in-world-war-i`], ["Japan in World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/japan-in-world-war-i`], ["United States enters World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/united-states-enters-world-war-i`], ["Comparing the Eastern and Western fronts in WWI", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/comparing-the-eastern-and-western-fronts-in-wwi`], ["Closing stages of World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/closing-stages-of-world-war-i`], ["Technology in World War I", `${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/v/technology-in-world-war-i`]],
    remade8:[["Sykes-Picot Agreement and the Balfour Declaration", `${WORLD}global-conflict/x66f79d8a:a-world-remade-8-4/v/sykes-picot-agreement-and-the-balfour-declaration`], ["Arabia after World War I", `${WORLD}global-conflict/x66f79d8a:a-world-remade-8-4/v/arabia-after-world-war-i`], ["Paris Peace Conference and Treaty of Versailles", `${WORLD}global-conflict/x66f79d8a:a-world-remade-8-4/v/paris-peace-conference-and-treaty-of-versailles`]],
    interwar8:[["What is Fascism?", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/what-is-fascism-world-history-project-beta`], ["Internationalism Between the Wars", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/internationalism-between-the-wars-world-history-project-beta`], ["Initial rise of Hitler and the Nazis", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/initial-rise-of-hitler-and-the-nazis`], ["Hitler and the Nazis come to power", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/hitler-and-the-nazis-come-to-power`], ["Nazi aggression and appeasement", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/nazi-aggression-and-appeasement`], ["Fascism and Mussolini", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/fascism-and-mussolini`], ["Mussolini becomes absolute dictator (Il Duce)", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/mussolini-becomes-absolute-dictator-il-duce`], ["Mussolini aligns with Hitler", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/mussolini-aligns-with-hitler`], ["Overview of Chinese history 1911 - 1949", `${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/v/overview-of-chinese-history-1911-1949`]],
    ww2War8:[["Beginning of World War II", `${WORLD}global-conflict/x66f79d8a:the-second-world-war-8-6/v/beginning-of-world-war-ii`], ["World War II in the Pacific", `${WORLD}global-conflict/x66f79d8a:the-second-world-war-8-6/v/world-war-ii-in-the-pacific-in-1942`], ["End of World War II", `${WORLD}global-conflict/x66f79d8a:the-second-world-war-8-6/v/1945-end-of-world-war-ii`]],
    holocaust8:[],
    coldWar8:[["What Was the Cold War?", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/what-was-the-cold-war`], ["Communism", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/communism`], ["Korean War overview", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/korean-war-overview`], ["Cuban Missile Crisis", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/cuban-missile-crisis`], ["Vietnam War", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/vietnam-war`], ["Allende and Pinochet in Chile", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/allende-and-pinochet-in-chile`], ["Pattern of US Cold War interventions", `${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/v/pattern-of-us-cold-war-interventions`]],
    decolon8:[["Resisting Colonialism Through a Ghanaian Lens", `${WORLD}global-conflict/x66f79d8a:decolonization-8-9/v/resisting-colonialism-through-a-ghanaian-lens-world-history-project-beta`], ["Independence movements in the 20th Century", `${WORLD}global-conflict/x66f79d8a:decolonization-8-9/v/independence-movements-in-the-20th-century`]]
  },
  /* History Unit 9: every video in each Khan lesson (checked on khanacademy.org, Oct 28 2026); 9.3 and 9.6 have none */
  history9:{
    overview9:[["Unit 9 Overview", `${WORLD}globalization/x66f79d8a:our-interconnected-world-9-1/v/watch-unit-9-overview-origins`], ["Frames in Unit 9", `${WORLD}globalization/x66f79d8a:our-interconnected-world-9-1/v/watch-frames-in-unit-9`]],
    goodBad9:[["Globalization I: The Upside", `${WORLD}globalization/x66f79d8a:is-globalization-good-or-bad-9-2/v/globalization-i-the-upside-crash-course-world-history-41-beta`]],
    economy9:[],
    accel9:[["Green Revolution", `${WORLD}globalization/x66f79d8a:the-great-acceleration-9-4/v/watch-green-revolution`], ["Eradicating Smallpox", `${WORLD}globalization/x66f79d8a:the-great-acceleration-9-4/v/watch-eradicating-smallpox`]],
    communities9:[["International Human Rights", `${WORLD}globalization/x66f79d8a:global-communities-9-5/v/international-human-rights`]],
    conflicts9:[],
    experiencing9:[["Benazir Bhutto: Democracy, Islam, and Power in Pakistan", `${WORLD}globalization/x66f79d8a:experiencing-globalization-9-7/v/benazir-bhutto-democracy-islam-and-power-in-pakistan-oer-project`], ["Preserving the Past", `${WORLD}globalization/x66f79d8a:experiencing-globalization-9-7/v/watch-preserving-the-past-world-history-project`]],
    anthro9:[["Humans and Energy", `${WORLD}globalization/x66f79d8a:the-anthropocene-9-8/v/humans-and-energy-crash-course-world-history-207-beta`]]
  }
};
const KHAN_LINKS = {
  nouns:{intro:`${GRAMMAR}noun/grammar-nouns/v/introduction-to-nouns-the-parts-of-speech-grammar-khan-academy`,types:`${GRAMMAR}noun/types-of-nouns/v/common-and-proper-nouns`,irregularBase:`${GRAMMAR}noun/irregular-plural-nouns-base-plurals-and-irregular-endings/v/irregular-plural-nouns-part-i-the-parts-of-speech-grammar-khan-academy`,irregularForeign:`${GRAMMAR}noun/irregular-plural-nouns-mutant-and-foreign-plurals/v/irregular-plural-nouns-part-iv-the-parts-of-speech-grammar`},
  verbs:{foundation:`${GRAMMAR}verb/introduction-to-verbs/v/introduction-to-verbs-the-parts-of-speech-grammar`,irregular:`${GRAMMAR}verb/irregular-verbs/v/introduction-to-irregular-verbs-the-parts-of-speech-grammar`,aspect:`${GRAMMAR}verb/verb-aspect-simple-progressive-and-perfect/v/intro-to-aspect`,aspectModal:`${GRAMMAR}verb/verb-aspect-and-modal-verbs/v/perfect-progressive-aspect-the-parts-of-speech-grammar`},
  pronouns:{intro:`${GRAMMAR}pronoun/introduction-to-pronouns/v/what-is-a-pronoun-the-parts-of-speech-grammar`,possessive:`${GRAMMAR}pronoun/possessive-and-reflexive-pronouns/v/possessive-pronouns-the-parts-of-speech-grammar`,relative:`${GRAMMAR}pronoun/relative-pronouns/v/relative-pronouns-the-parts-of-speech-grammar`,caseNumber:`${GRAMMAR}pronoun/subject-object-person-and-number/v/subject-and-object-pronouns-the-parts-of-speech-grammar`,indefinite:`${GRAMMAR}pronoun/indefinite-pronouns-pronoun-vagueness-and-emphatic-pronouns/v/indefinite-pronouns-the-parts-of-speech-grammar`},
  modifiers:{intro:`${GRAMMAR}modifier/introduction-to-adjectives-and-articles/v/intro-to-adjectives-v1`,adverbs:`${GRAMMAR}modifier/introduction-to-adverbs/v/intro-to-adverbs`,order:`${GRAMMAR}modifier/adjective-order-and-commas-with-adjectives/v/adjective-order`,degree:`${GRAMMAR}modifier/comparative-superlative-intensifiers-and-adverbs-of-degree/v/intro-to-the-comparative-and-the-superlative-v2`},
  prepositions:{prepositions:'https://www.khanacademy.org/ela/5th-and-6th-grade-grammar/x90cef5375e9bcad6:prepositions-and-interjections-5/x90cef5375e9bcad6:prepositions-and-prepositional-phrases-5/v/meet-the-preposition',interjections:'https://www.khanacademy.org/ela/5th-and-6th-grade-grammar/x90cef5375e9bcad6:prepositions-and-interjections-5/x90cef5375e9bcad6:interjections-5/a/interjections-5'},
  punctuation:{endCommas:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/introduction-to-commas/v/three-ways-to-end-a-sentence-punctuation-khan-academy`,spaceTime:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/commas-in-space-and-time/v/salutations-and-valedictions-the-comma-punctuation-khan-academy`,moreCommas:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/more-ways-to-use-commas/v/more-uses-for-commas-the-comma-punctuation-khan-academy`,apostrophes:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/apostrophes-and-contractions/v/introduction-to-the-apostrophe-the-apostrophe-punctuation-khan-academy`,possessive:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/introduction-to-the-possessive/v/introduction-to-the-possessive-the-apostrophe-punctuation-khan-academy`},
  colons:{colons:`${KHAN}humanities/grammar/punctuation-the-colon-semicolon-and-more/introduction-to-colons/v/linking-function-of-the-colon-the-colon-and-semicolon-punctuation-khan-academy`,semicolons:`${KHAN}humanities/grammar/punctuation-the-colon-semicolon-and-more/introduction-to-semicolons/v/introduction-to-the-semicolon-the-colon-and-semicolon-punctuation-khan-academy`,formatting:`${KHAN}humanities/grammar/punctuation-the-colon-semicolon-and-more/formatting-styles/v/italics-and-underlining`,dashes:`${KHAN}humanities/grammar/punctuation-the-colon-semicolon-and-more/hyphens-dashes-and-ellipses/v/dashes`},
  sentences:{intro:`${KHAN}humanities/grammar/syntax-sentences-and-clauses/introduction-to-sentences/v/what-is-a-sentence-syntax-khan-academy`,types:`${KHAN}humanities/grammar/syntax-sentences-and-clauses/types-of-sentences/v/simple-and-compound-sentences-syntax-khan-academy`,subjects:`${KHAN}humanities/grammar/syntax-sentences-and-clauses/subjects-and-predicates/v/subjects-and-predicates-syntax-khan-academy`,clauses:`${KHAN}humanities/grammar/syntax-sentences-and-clauses/phrases-and-clauses/v/phrases-and-clauses-syntax-khan-academy`},   // English Unit 8, Khan's lesson sitemaps, Oct 30 2026
  conventions:{agreement:`${KHAN}humanities/grammar/syntax-conventions-of-standard-english/subject-verb-agreement-and-pronoun-antecedent-agreement/v/subject-verb-agreement-syntax-khan-academy`,fragments:`${KHAN}humanities/grammar/syntax-conventions-of-standard-english/fragments-and-run-ons/v/recognizing-fragments-syntax-khan-academy`,modifiers:`${KHAN}humanities/grammar/syntax-conventions-of-standard-english/dangling-modifiers-and-parallel-structure/v/dangling-modifiers-syntax-khan-academy`},   // English Unit 9 (docs/ENGLISH-UNIT9.md)
  style:{sound:`${STYLE_KHAN}v/alliteration-assonance-and-onomatopoeia`,technique:`${STYLE_KHAN}v/scale-of-formality`},   // English Unit 10 (docs/ENGLISH-UNIT10.md)
  history:{stories:`${WORLD}origins-of-history/x66f79d8a:history-stories-1-1/v/meet-oer-project-world-history`,frames:`${WORLD}origins-of-history/x66f79d8a:history-frames-1-3/v/frame-concept-introduction-world-history-project-beta`,memory:`${WORLD}origins-of-history/x66f79d8a:history-and-memory-1-4/a/activity-opener-worst-day-ever`},
  history2:{earliestHumans:`${WORLD}early-humans/x66f79d8a:the-earliest-humans-2-1/a/activity-opener-then-vs-now`,migrationArt:`${WORLD}early-humans/x66f79d8a:migration-and-art-2-2/a/activity-opener-who-s-an-authority`,foragingSocieties:`${WORLD}early-humans/x66f79d8a:foraging-societies-2-3/a/activity-opener-what-is-this-asking-introduction-origins`,agriculturalRevolution:`${WORLD}early-humans/x66f79d8a:the-agricultural-revolution-2-4/a/activity-opener-which-frame`,biggestMistake:`${WORLD}early-humans/x66f79d8a:the-biggest-mistake-humans-ever-made-2-5/a/activity-opener-casual-map-jack-and-the-giant-beanstalk`},
  history3:{earlyAmericas:`${WORLD}early-agrarian-societies/x66f79d8a:ancient-mesoamerica/a/article-ancient-agrarian-societies-mesoamerica-olmec-and-chavin-de-huantar`,ancientIndia:`${WORLD}early-agrarian-societies/x66f79d8a:indus-river-valley/a/article-ancient-agrarian-societies-indus-river-valley`,earlyAgrarian:`${WORLD}early-agrarian-societies/x66f79d8a:early-agrarian-societies-in-context/a/activity-contextualization-agrarian-societies`},
  history6:{overview6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-first-global-age-6-1/a/activity-opener-impacts-of-the-global-age`,mongol6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-mongol-empire-6-2/a/activity-opener-expanding-an-empire-part-1`,plague6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-black-death-6-3/a/activity-opener-what-caused-the-black-death`,exchange6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:cultural-exchange-in-afro-eurasia-6-4/a/activity-opener-review-and-preview`,americas6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:communities-in-the-americas-6-5/a/activity-opener-what-is-this-asking`,trade6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:trade-routes-in-the-americas-6-6/a/activity-opener-networks-in-the-americas`,empires6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:empires-expand-6-8/a/activity-expanding-your-empire`,explore6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:age-of-exploration-6-7/a/activity-opener-quick-vocab`,columbian6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-columbian-exchange-6-8/a/activity-opener-mapping-a-meal`,slavery6:`${KHAN}humanities/world-history/x66f79d8a:the-first-global-age/x66f79d8a:the-transatlantic-slave-trade-6-9/a/activity-opener-primary-source-preview`},   // History Unit 6: each lesson opens at its start on Khan (Oct 28 2026)
  history5:{overview5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:collapse-and-restructuring-5-1/a/activity-opener-vocabulary-match-up`,collapse5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:why-do-empires-collapse-5-2/a/activity-opener-causes-of-collapse-wh`,darkAges5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:assessing-the-dark-ages-5-3/a/activity-opener-what-s-in-a-name`,europe5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/a/activity-opener-whom-do-you-trust`,china5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-china-5-4/a/article-china-under-the-tang-and-ming-dynasties`,islam5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/a/activity-opener-mapping-beliefs`,silk5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-silk-roads-5-7/a/activity-opener-world-travelers`,expand5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/a/activity-opener-what-s-in-your-suitcase`},   // the start of each Khan lesson (checked on khanacademy.org, Oct 27 2026)
  history4:{overview4:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:empires-and-belief-systems-4-1/a/activity-opener-sacred-symbols`,portableBelief:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-portable-belief-systems/a/activity-opener-belief-vs-religion`,confucianism:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:china-confucianism-legalism-and-daoism-4-3/a/article-confucianism`,hinduBuddhism:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/a/article-hinduism`,judaismChristianity:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/a/article-judaism`,islam:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:islam-4-6/a/article-islam`,comparePortable:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-portable-belief-systems-4-7/a/activity-comparison-belief-systems`,religionsChange:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:how-do-religions-grow-and-change-4-3/a/activity-opener-spot-the-difference`,persiaGreece:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/a/activity-opener-organizing-evidence`,mauryaGupta:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-mauryan-and-gupta/a/article-the-mauryan-and-gupta-empires`,imperialChina:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-zhou-and-qin/a/article-the-zhou-and-qin-empires`,compareEmpires:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-ancient-empires-4-4/a/activity-empire-building`,romeAndHan:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/a/activity-opener-trade-in-the-ancient-world`,riseFall:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:the-rise-and-fall-of-empires/v/comparison-rise-of-empires`,womenAncient:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:women-in-the-ancient-world-4-15/a/activity-opener-take-a-guess`},   // the start of each Khan lesson (checked on khanacademy.org, Oct 27 2026)
  history9:{overview9:`${WORLD}globalization/x66f79d8a:our-interconnected-world-9-1/a/activity-opener-word-cloud`,goodBad9:`${WORLD}globalization/x66f79d8a:is-globalization-good-or-bad-9-2/a/activity-opener-quick-vocab-origins`,economy9:`${WORLD}globalization/x66f79d8a:the-global-economy-9-3/a/activity-opener-global-economic-challenges`,accel9:`${WORLD}globalization/x66f79d8a:the-great-acceleration-9-4/a/activity-opener-what-s-new`,communities9:`${WORLD}globalization/x66f79d8a:global-communities-9-5/a/activity-opener-what-are-rights`,conflicts9:`${WORLD}globalization/x66f79d8a:global-conflicts-9-6/a/activity-opener-never-again`,experiencing9:`${WORLD}globalization/x66f79d8a:experiencing-globalization-9-7/a/activity-opener-repatriation`,anthro9:`${WORLD}globalization/x66f79d8a:the-anthropocene-9-8/a/activity-opener-the-world-in-2050`},   // History Unit 9: the start of each Khan lesson (checked on khanacademy.org, Oct 28 2026)
  bio1:{cells:`${BIO6}cellular-organization/v/ms-cells-and-organisms`,plants:`${BIO6}reproduction-in-plants/v/ms-plant-reproductive-success`,digestion:`${BIO6}human-digestive-system/e/digestion-in-humans-and-herbivores`},
  bio2:{traits:`${KHAN}science/ms-biology/x0c5bb03129646fd6:organism-growth-and-reproduction/x0c5bb03129646fd6:sexual-and-asexual-reproduction/v/ms-sexual-and-asexual-reproduction`,growth:`${KHAN}science/ms-biology/x0c5bb03129646fd6:organism-growth-and-reproduction/x0c5bb03129646fd6:plant-reproductive-success/v/ms-plant-reproductive-success`},   // Middle school biology, checked Oct 20 2026
  bio4:{cellcycle4:`${CDIV}mitosis/v/chromosomes-chromatids-chromatin-etc`,sexrepro4:`${CDIV}meiosis/v/phases-of-meiosis`,lifecycle4:`${CDIV}meiosis/v/zygote-differentiating-into-somatic-and-germ-cells`},   // Biology Unit 4 (docs/SCIENCE-UNIT4.md)
  bio3:{photo3:`${MEO}photosynthesis-in-organisms/v/ms-photosynthesis-in-organisms`,food3:`${MEO}food-and-energy-in-organisms/v/food-and-energy-in-organisms-ms`,activity3:`${MEO}unit-3-phenomenon-based-activities/a/activity-how-can-measuring-cellular-respiration-help-us-reach-a-fitness-goal`},   // Middle school biology Unit 3, checked Oct 29 2026
  bio5:{chrom5:`${MIV}chromosomes/v/chromosomes-and-genes`,mut5:`${MIV}mutations/v/mutations`,repro5:`${MIV}reproduction-and-genetic-variation/v/sexual-reproduction-and-genetic-variation`},   // Middle school biology, Inheritance and variation, checked Oct 30 2026
  history7:{overview7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-long-nineteenth-century-7-1/a/activity-opener-vocab-preview`,enlighten7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:enlightenment-and-revolution-7-2/a/activity-opener-revolution-or-evolution`,atlantic7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:atlantic-revolutions-7-3/a/activity-opener-so-you-want-a-revolution`,nation7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:nationalism-7-4/a/activity-opener-i-think-i-know`,industry7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-industrial-revolution-7-5/a/activity-opener-picturing-change`,egyptJapan7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:comparing-industrialization-in-egypt-and-japan-7-6/a/activity-opener-what-if`,workers7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:the-working-class-7-7/a/activity-opener-pyramids-of-society`,reform7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:reform-movements-7-8/a/activity-opener-harriet-forten-purvis-first-glance`,imperial7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:industrial-imperialism-7-9/a/activity-opener-matching-cause-and-effect-origins`,resist7:`${KHAN}humanities/world-history/x66f79d8a:the-long-nineteenth-century/x66f79d8a:resisting-colonialism-7-10/a/activity-opener-motive-goal-or-both`},   // History Unit 7: the start of each Khan lesson (checked on khanacademy.org, Oct 28 2026)
  history8:{overview8:`${WORLD}global-conflict/x66f79d8a:century-of-conflict-8-1/a/activity-opener-the-path-to-global-conflict`,causes8:`${WORLD}global-conflict/x66f79d8a:causes-of-the-first-world-war-8-2/v/how-a-wrong-turn-started-world-war-i`,totalWar8:`${WORLD}global-conflict/x66f79d8a:world-war-i-around-the-world-8-3/a/activity-opener-defining-total-war`,remade8:`${WORLD}global-conflict/x66f79d8a:a-world-remade-8-4/a/activity-opener-planning-for-peace`,interwar8:`${WORLD}global-conflict/x66f79d8a:interwar-ideologies-8-5/a/activity-opener-a-nation-in-crisis`,ww2War8:`${WORLD}global-conflict/x66f79d8a:the-second-world-war-8-6/a/activity-opener-who-am-i-origins`,holocaust8:`${WORLD}global-conflict/x66f79d8a:the-holocaust-8-7/a/activity-opener-responsibility-and-compassion`,coldWar8:`${WORLD}global-conflict/x66f79d8a:the-cold-war-8-8/a/activity-opener-sort-it-out`,decolon8:`${WORLD}global-conflict/x66f79d8a:decolonization-8-9/a/activity-opener-ideological-tug-of-war`},   // History Unit 8: each lesson opens at its start on Khan
};
const q = (prompt, correct, ...wrong) => ({prompt, options:[correct, ...wrong], answer:0});
const PLURAL_QUESTIONS = {
  identifyNouns:[
    q('Which word is a noun in this sentence? The dog barked loudly.','dog','barked','loudly','The'),
    q('Which word is a noun in this sentence? Our teacher smiled happily.','teacher','smiled','happily','Our'),
    q('Which word names a place? We ate lunch at the park.','park','ate','We','at'),
    q('Which word names a person? Our coach blew the whistle.','coach','blew','Our','the'),
    q('Which word names a thing? The sailor held a lantern.','lantern','held','The','a'),
    q('Which word names an idea or feeling? Her bravery inspired the team.','bravery','inspired','Her','the'),
    q('Which of these is NOT a noun?','quickly','garden','teacher','happiness'),
    q('How many nouns are in this sentence? The cat chased a mouse.','2','1','3','4'),
    q('Which word is a noun?','harbor','swiftly','under','sing'),
    q('Nouns name people, places, things, and ideas. Which word names an idea?','freedom','window','doctor','kitchen')
  ],
  singularPlural:[
    q('What is the plural of bus?','buses','buss','busies',"bus's"),
    q('What is the plural of dish?','dishes','dishs','dishies',"dish's"),
    q('What is the plural of city?','cities','citys','cityes','citis'),
    q('What is the plural of toy?','toys','toies','toyes','toyies'),
    q('Which sentence uses the correct plural?','We bought two boxes of berries.','We bought two boxs of berries.','We bought two boxes of berrys.','We bought two boxes of berryes.'),
    q('Which noun is singular?','bridge','wishes','lakes','hats'),
    q('Which noun is plural?','foxes','fox','box','glass'),
    q('What is the plural of class?','classes','classs','classies',"class's"),
    q('What is the plural of potato?','potatoes','potatos','potatoies','potatoz'),
    q('Which noun needs -es to make it plural?',"watch","plant","chair","robot")
  ],
  commonProper:[
    q('Which word is a proper noun? We visited Chicago last summer.','Chicago','summer','visited','last'),
    q('Which sentence capitalizes the proper noun correctly?','My cousin lives in Texas.','my cousin lives in texas.','My cousin lives in texas.','My Cousin lives in Texas.'),
    q('Which word is a common noun?','river','Nile','Paris','Ms. Lee'),
    q('Which proper noun could replace the common noun "city"?','Denver','town','street','village'),
    q('Which common noun could replace the proper noun "Lincoln Elementary"?','school','Monday','Ohio','Lincoln'),
    q('Which sentence contains a proper noun?','Our class read about Harriet Tubman.','Our class read about a brave woman.','Our class read about a famous leader.','Our class read about the past.'),
    q('Which of these is a proper noun?','Mexico','country','mountain','ocean'),
    q('In "The dog named Max ran home," which word is the proper noun?','Max','dog','home','ran'),
    q('Which noun should begin with a capital letter?',"Thursday","weekend","birthday","vacation"),
    q('A proper noun names a specific person, place, or thing. Which is the best example?',"Mount Everest","a tall mountain","the highest peak","a snowy volcano")
  ],
  concreteAbstract:[
    q('Which noun is concrete?','pencil','freedom','honesty','courage'),
    q('Which noun is abstract?',"friendship","playground","skateboard","toothbrush"),
    q('Which noun in the sentence is abstract? The children felt great joy at the parade.','joy','children','parade','great'),
    q('Which noun can you detect with your five senses?','thunder','justice','loyalty','wisdom'),
    q('Which sentence has an abstract noun?',"Her kindness made everyone smile.","Her backpack fell onto the kitchen floor.","The puppy chased the ball around.","He drank a glass of cold water."),
    q('Which noun is abstract?',"excitement","toothpaste","sunglasses","motorcycle"),
    q('Which noun is concrete?','bakery','patience','curiosity','pride'),
    q('Is the noun "freedom" concrete or abstract?','Abstract: it names an idea','Concrete: you can touch it','Concrete: it names a place','Abstract: it names a person'),
    q('Which noun is concrete?','mitten','hope','fear','talent'),
    q('Which pair has one concrete noun and one abstract noun?','tree, beauty','chair, table','honor, trust','river, hill')
  ],
  fToVes:[
    q('What is the plural of leaf?','leaves','leafs','leavs','leafes'),
    q('What is the plural of life?','lives','lifes','lifs','livs'),
    q('What is the plural of half?','halves','halfs','halfes','halvs'),
    q('What is the plural of wolf?','wolves','wolfs','wolfes','wolvs'),
    q('What is the plural of knife?','knives','knifes','knifves','knifs'),
    q('The baker made three ___ of bread.','loaves','loafs','loafes','loavs'),
    q('Which plural is spelled correctly?','elves','elfs','elvs','elfes'),
    q('What is the plural of thief?','thieves','thiefs','thiefes','thievs'),
    q('Which noun does NOT change f to v in the plural?','roof','shelf','calf','wife'),
    q('What is the plural of self?','selves','selfs','selfes','selvs')
  ],
  enPlurals:[
    q('What is the plural of child?','children','childs','childes','childrens'),
    q('What is the plural of ox?','oxen','oxes','oxs','oxens'),
    q('What is the plural of man?','men','mans','manes','manen'),
    q('What is the plural of woman?','women','womans','womanes','womens'),
    q('The farmer has two strong ___.','oxen','oxes','oxs','oxens'),
    q('Which sentence is correct?','The children are playing outside.','The childs are playing outside.','The childrens are playing outside.','The childes are playing outside.'),
    q('What is the singular of oxen?','ox','oxe','oxn','oxens'),
    q('What is the singular of children?','child','childe','childs','childre'),
    q('Which sentence is correct?','Three women waited in line.','Three womans waited in line.','Three womens waited in line.','Three womanes waited in line.'),
    q('What is the plural of person?',"people","peoplen","personen","personses")
  ],
  basePlurals:[
    q('What is the plural of sheep?','sheep','sheeps','sheepes','sheepies'),
    q('What is the plural of deer?','deer','deers','deeres','deerses'),
    q('The hunter saw five ___ in the woods.','deer','deers','deeres','deerses'),
    q('Which sentence is correct?','Two fish swam by.','Two fishs swam by.','Two fishies swam by.','Two fishses swam by.'),
    q('Which word has the same singular and plural form?',"series","bridge","kitten","window"),
    q('What is the plural of moose?','moose','mooses','meese','moosen'),
    q('Which sentence is correct?','We caught six salmon at the river.','We caught six salmons at the river.','We caught six salmones at the river.','We caught six salmonen at the river.'),
    q('What is the plural of aircraft?','aircraft','aircrafts','aircrafves','aircraften'),
    q('Which noun stays the same in the plural?',"species","dolphin","teacher","pumpkin"),
    q('One sheep is in the barn. Five ___ are in the field.','sheep','sheeps','sheepes','sheepen')
  ],
  mutantPlurals:[
    q('What is the plural of mouse?','mice','mouses','mouse','mices'),
    q('What is the plural of goose?','geese','gooses','goose','geeses'),
    q('What is the plural of tooth?','teeth','tooths','toothes','teeths'),
    q('What is the plural of foot?','feet','foots','footes','feets'),
    q('The baby has two new ___.','teeth','tooths','toothes','tooth'),
    q('A flock of ___ flew over the pond.','geese','gooses','goose','geeses'),
    q('Which plural changes the vowels inside the word?','geese','dishes','cats','boxes'),
    q('What is the plural of louse?','lice','louses','louse','lices'),
    q('Which sentence is correct?','The mice hid in the wall.','The mouses hid in the wall.','The mices hid in the wall.','A mice hid in the wall.'),
    q('My shoes hurt my ___.','feet','foots','foot','feets')
  ],
  foreignPlurals:[
    q('What is the plural of cactus?',"cacti","cactae","cactis","cactus"),
    q('What is the plural of criterion?','criteria','criterions','criteriones','criterias'),
    q('What is the plural of fungus?',"fungi","fungae","fungis","fungus"),
    q('What is the plural of alumnus?','alumni','alumnuses','alumnus','alumnis'),
    q('What is the plural of nucleus?',"nuclei","nucleae","nucleis","nucleus"),
    q('What is the plural of phenomenon?',"phenomena","phenomenae","phenomenones","phenomenas"),
    q('What is the plural of analysis?','analyses','analysises','analysi','analysis'),
    q('What is the plural of crisis?','crises','crisises','crisi','crisis'),
    q('What is the plural of bacterium?','bacteria','bacteriums','bacteriae','bacterias'),
    q('What is the plural of radius?',"radii","radiae","radis","radius")
  ],
  pluralReview:[
    q('What is the plural of knife?','knives','knifes','knife','knivies'),
    q('What is the plural of child?',"children","childs","childes","childrens"),
    q('What is the plural of mouse?','mice','mouses','mouse','mices'),
    q('What is the plural of sheep?','sheep','sheeps','sheepes','sheepies'),
    q('What is the plural of cactus?',"cacti","cactis","cactus","cactae"),
    q('Which sentence uses all the plurals correctly?','The women saw geese near the lakes.','The womans saw geese near the lakes.','The women saw gooses near the lakes.','The womens saw geese near the lakes.'),
    q('Which word is spelled correctly?','wolves','wolfs','wolfes','wolvs'),
    q('Which noun has the same singular and plural form?','deer','tooth','ox','leaf'),
    q('Which plural is correct?','crises','crisises','crisis','crisi'),
    q('Which pair is correct (singular, plural)?','foot, feet','foot, foots','goose, gooses','ox, oxes')
  ]
};
const VERB_QUESTIONS = {
  verbIdentify:[
    q('Which word is the verb? The dog chased the ball.','chased','dog','ball','The'),
    q('Which word is the verb? Maria paints a mural.','paints','Maria','mural','a'),
    q('Which word is the verb? The birds sing at dawn.','sing','birds','dawn','at'),
    q('Which word is a verb?','jump','happy','under','table'),
    q('Which sentence shows a state of being?','The soup is hot.','The soup boiled.','Dad stirred the soup.','We ate the soup.'),
    q('Which word is the verb? My brother is tall.','is','brother','tall','My'),
    q('Which word is NOT a verb?','careful','whisper','build','travel'),
    q('Which word is the verb? Clouds drifted across the sky.','drifted','Clouds','across','sky'),
    q('How many verbs are in this sentence? She ran home and called her mom.','2','1','3','4'),
    q('Which word is the verb? The students were nervous.','were','students','nervous','The')
  ],
  verbAgreement:[
    q('The dog ___ in the yard.','barks','bark','barking','barked are'),
    q('The dogs ___ in the yard.','bark','barks','barking','is bark'),
    q('My sister and I ___ to school.','walk','walks','walking','is walk'),
    q('Everyone ___ ready for the trip.','is','are','were','be'),
    q('In American English, the team ___ practicing today.','is','are','were','be'),
    q('Neither of the boys ___ here.','is','are','were','be'),
    q('She ___ her homework every night.','does','do','doing','done'),
    q('The books on the shelf ___ new.','are','is','was','be'),
    q('Which sentence has correct subject-verb agreement?','The cats sleep on the couch.','The cats sleeps on the couch.','The cat sleep on the couch.','The cats is sleeping on the couch.'),
    q('In American English, a flock of geese ___ overhead.','flies','fly','flying','are fly')
  ],
  verbTense:[
    q('Which sentence is in the past tense?','We watched a movie.','We watch a movie.','We will watch a movie.','We are watching a movie.'),
    q('Which sentence is in the future tense?',"I will visit my aunt.","I visited my aunt.","I have visited my aunt.","I visit my aunt every day."),
    q('Yesterday, Sam ___ the fence.','painted','paints','will paint','painting'),
    q('Tomorrow, we ___ to the zoo.',"will go","have gone","were going","had gone"),
    q('Every afternoon, the cat ___ on the windowsill.','sits','sitting','will sat','sitted'),
    q('Which verb is in the present tense?','plays','played','will play','had played'),
    q('Change to past tense: "She walks to the park."','She walked to the park.','She will walk to the park.','She walks to the park.','She walking to the park.'),
    q('Change to future tense: "He cooks dinner."','He will cook dinner.','He cooked dinner.','He cooking dinner.','He has cooked dinner.'),
    q('Which word signals the past tense?','yesterday','tomorrow','next week','soon'),
    q('Which word signals the future tense?','tomorrow','yesterday','last year','ago')
  ],
  actionLinkHelping:[
    q('Which word is an action verb? The runner sprinted to the finish.','sprinted','runner','finish','to'),
    q('Which word is a linking verb? The soup smells delicious.','smells','soup','delicious','The'),
    q('Which word is a helping verb? She has finished her essay.','has','finished','essay','She'),
    q('Which verb is a linking verb in "The sky became dark"?','became','sky','dark','The'),
    q('Which sentence uses a linking verb?',"The pie looks tasty.","The pie burned.","Mom baked a pie.","We ate the whole pie fast."),
    q('Which is a helping verb?','will','run','happy','quickly'),
    q('In "They are playing outside," which word is the helping verb?','are','They','playing','outside'),
    q('In "Leo kicked the ball," what kind of verb is kicked?','action verb','linking verb','helping verb','noun'),
    q('Which of these verbs is a form of “be,” a common linking verb?','is','jump','throw','sing'),
    q('In "I can swim," which word is the helping verb?','can','I','swim','none')
  ],
  irregularVerbs:[
    q('What is the past tense of go?','went','goed','gone','going'),
    q('What is the past tense of eat?','ate','eated','eaten','eating'),
    q('What is the past tense of run?','ran','runned','run','running'),
    q('What is the past tense of bring?','brought','brung','bringed','braught'),
    q('Yesterday, I ___ my lunch at home.','forgot','forgetted','forget','forgotten'),
    q('She ___ a beautiful song last night.','sang','sing','singed','sung had'),
    q('What is the past tense of buy?','bought','buyed','boughted','buyt'),
    q('Which sentence is correct?','He drew a picture.','He drawed a picture.','He draw a picture.','He drawn a picture.'),
    q('What is the past tense of swim?','swam','swimmed','swum','swimed'),
    q('Which sentence is correct?','The bell rang loudly.','The bell ringed loudly.','The bell rung loudly yesterday.','The bell ring loudly.')
  ],
  simpleAspect:[
    q('Which sentence is in the simple present?',"Maya reads every night.","Maya is reading every night.","Maya has read every night.","Maya was reading last night."),
    q('Which sentence is in the simple past?','The team won the game.','The team is winning the game.','The team has won the game.','The team will win the game.'),
    q('Which sentence is in the simple future?','We will visit Grandma.','We visited Grandma.','We are visiting Grandma.','We have visited Grandma.'),
    q('Simple present often shows a habit. Which sentence shows a habit?',"He brushes his teeth every morning.","He is brushing his teeth right now.","He brushed his teeth this morning.","He will brush his teeth after lunch."),
    q('Choose the simple past: Last week, we ___ a fort.','built','build','are building','have built'),
    q('Which verb is simple future?','will bake','baked','is baking','bakes'),
    q('Water ___ at 100 degrees Celsius. (a fact)','boils','boiled','is boiling','will have boiled'),
    q('Which verb is simple past?','jumped','jumps','will jump','is jumping'),
    q('Which sentence is in the simple present?','The sun rises in the east.','The sun rose in the east.','The sun will rise in the east.','The sun was rising in the east.'),
    q('Yesterday, Dad ___ the car.','washed','washes','will wash','is washing')
  ],
  progressiveAspect:[
    q('Which sentence uses the present progressive?','Ana is writing a letter.','Ana writes a letter.','Ana wrote a letter.','Ana has written a letter.'),
    q('Which sentence uses the past progressive?',"They were playing outside.","They have played outside.","They are playing outside.","They will have played outside."),
    q('Which sentence uses the future progressive?',"I will be studying at noon.","I will have studied at noon.","I was studying at noon.","I am studying at noon."),
    q('Right now, the kids ___ in the pool.',"are swimming","have swum","will swim","had been swimming"),
    q('At 8 o\'clock last night, I ___ dinner.',"was cooking","am cooking","will cook","have been cooking"),
    q('Progressive verbs use a form of be plus which ending?',"-ing","-ed","-en","-est"),
    q('Which verb phrase is progressive?',"is running","runs","ran","will have run"),
    q('Tomorrow at noon, we ___ on the bus.',"will be riding","will have ridden","rode","ride"),
    q('While I ___, the phone rang.',"was sleeping","will sleep","sleep","have been sleeping"),
    q('Which sentence shows an action in progress right now?',"The baby is crying.","The baby cried.","The baby will cry.","The baby has cried all day.")
  ],
  perfectAspect:[
    q('Which sentence uses the present perfect?',"I have finished my project.","I was finishing my project.","I am finishing my project.","I finished my project."),
    q('Which sentence uses the past perfect?','She had left before we arrived.','She leaves before we arrive.','She has left before we arrive.','She will leave before we arrive.'),
    q('Which sentence uses the future perfect?',"By Friday, I will have read the book.","By Friday, I read the book.","By Friday, I had read the book.","By Friday, I will be reading the book."),
    q('Perfect verbs use a form of have plus a ___.',"past participle","present participle","base verb","-ing verb"),
    q('We ___ lived here for five years.','have','has','had been','is'),
    q('Before the movie started, we ___ our seats.','had found','have found','will find','are finding'),
    q('Which is the past participle of eat?','eaten','ate','eating','eats'),
    q('By next June, they ___ the house.',"will have built","will be building","have built","are building"),
    q('Which verb phrase is present perfect?','has walked','walked','is walking','had walked'),
    q('Which sentence is correct?','He has seen that movie twice.','He has saw that movie twice.','He have seen that movie twice.','He has see that movie twice.')
  ],
  perfectProgressive:[
    q('Which sentence uses the present perfect progressive?',"She has been reading for an hour.","She had read for an hour.","She is reading for an hour.","She was reading for an hour or so."),
    q('Which sentence uses the past perfect progressive?','They had been waiting for ages.','They have been waiting for ages.','They were waiting for ages.','They waited for ages.'),
    q('Which sentence uses the future perfect progressive?',"By noon, I will have been working for four hours.","By noon, I will be working for four hours.","By noon, I had been working for four hours.","By noon, I will have worked for four whole hours."),
    q('Perfect progressive verbs use have + been + a verb ending in what?',"-ing","-ed","-en","-est"),
    q('It ___ raining all morning, and it is still raining.','has been','is being','had','was be'),
    q('When Dad got home, I ___ for two hours.','had been studying','have been studying','will be studying','am studying'),
    q('We ___ practicing since 3 o\'clock.','have been','has been','are','were being'),
    q('Which verb phrase is perfect progressive?',"has been singing","had already sung","is singing","sang"),
    q('Next month, she ___ here for a year.',"will have been working","will be working","had been working","would have been working"),
    q('Which sentence is correct?','He has been running since sunrise.','He has been run since sunrise.','He have been running since sunrise.','He has being running since sunrise.')
  ],
  tenseAspectTime:[
    q('Which sentence shows an action that finished before another past action?','I had eaten before she called.','I eat before she called.','I was eating before she called.','I will eat before she called.'),
    q('Which sentence shows an action that began in the past and continues now?',"We have lived here since 2020.","We lived here since 2020.","We had been living here in 2020.","We will live here since 2020."),
    q('Which sentence keeps the tense consistent?','She opened the door and walked inside.','She opened the door and walks inside.','She opens the door and walked inside.','She will open the door and walked inside.'),
    q('Choose the best verb: By the time we arrived, the show ___.','had started','starts','will start','is starting'),
    q('Choose the best verb: I ___ here since breakfast.',"have been waiting","had been waiting","will be waiting","would have been waiting"),
    q('Choose the best verb: At this moment, the chef ___ soup.','is stirring','stirred','had stirred','will have stirred'),
    q('Which sentence is about a future action in progress?',"She will be flying home at noon.","She flew home at noon.","She has been flying home since noon.","She is flying home."),
    q('Which sentence has a tense shift error?',"Yesterday he runs to school and was late.","Yesterday he ran to school and was late.","Today he runs to school and is early.","Tomorrow he will run to school and be early."),
    q('Which sentence says the action will be complete by a future time?',"By May, I will have finished.","By May, I finished.","By May, I will be finishing it.","By May, I had finished."),
    q('Choose the best verb: While Mom cooked, I ___ the table.','was setting','set now','will set','have setting')
  ],
  modalVerbs:[
    q('Which word is a modal verb?','might','run','happy','quickly'),
    q('Which modal shows ability? I ___ swim across the pool.','can','must','should','might'),
    q('Which modal shows necessity? You ___ wear a helmet.','must','can','may','could not'),
    q('Which modal shows a possibility? It ___ rain tonight.','might','must','shall','did'),
    q('Which modal gives permission? ___ I borrow your pen?','May','Will','Must','Did'),
    q('Which sentence is correct?','She can play the piano.','She can plays the piano.','She cans play the piano.','She can playing the piano.'),
    q('Which modal gives advice? You ___ drink more water.',"should","did not","might","are"),
    q('A modal verb is followed by the ___ form of the verb.','base','past','-ing','-s'),
    q('Which sentence is correct?','We should leave now.','We should to leave now.','We should leaving now.','We should left now.'),
    q('Which modal is the strongest (a rule or must-do)?','must','might','could','may')
  ]
};
// Phase 1 English banks: difficulty tags (1-3) for the built-in questions, and 4 harder questions per lesson.
const qLevel = (difficulty, prompt, correct, ...wrong) => ({...q(prompt, correct, ...wrong), difficulty});
const PLURAL_EXTRA_QUESTIONS = {
  identifyNouns:[
    qLevel(2,"Which sentence has exactly three nouns?","The girl put her book on the desk.","The girl quickly ran to her desk.","She sang loudly and happily all day.","The tall boy and his sister laughed."),
    qLevel(3,"Which word is used as a noun? We went for a long swim.","swim","went","long","for"),
    qLevel(3,"In which sentence is “light” used as a noun?","Turn on the light, please.","This box is very light.","We light the candles at dinner.","She packed a light jacket."),
    qLevel(2,"Which sentence has a noun that names an idea?","Their courage surprised the coach.","The team bus arrived at the school.","The coach blew a loud whistle.","Our dog sleeps under the table.")
  ],
  singularPlural:[
    qLevel(2,"Which sentence uses the correct plurals?","The ponies ate apples from two bushes.","The ponys ate apples from two bushes.","The ponies ate apples from two bushs.","The ponyes ate apples from two bushes."),
    qLevel(2,"What is the plural of monkey?","monkeys","monkies","monkeyes","monkeis"),
    qLevel(3,"Which sentence needs a correction?","Three wishs came true for the girl.","Three wishes came true for the girl.","Two lunches sat on the table.","The babies napped after lunch."),
    qLevel(3,"Fix the sentence: “The family bought two new sofaes and three lamps.”","The family bought two new sofas and three lamps.","The family bought two new sofaies and three lamps.","The family bought two new sofas and three lampes.","The family bought two new sofa and three lamps.")
  ],
  commonProper:[
    qLevel(2,"Which sentence capitalizes every proper noun correctly?","We flew to Florida on Monday.","We flew to florida on Monday.","We flew to Florida on monday.","We Flew to Florida on Monday."),
    qLevel(2,"Which group of words is all proper nouns?","Ohio, Friday, Ms. Diaz","Ohio, river, Ms. Diaz","state, Friday, teacher","city, holiday, teacher"),
    qLevel(3,"Which sentence needs a capital letter fixed?","Our class visited the grand canyon.","Our class visited a big canyon.","Our class visited Arizona in May.","Our teacher, Mr. Ortiz, drove the bus."),
    qLevel(3,"Fix the sentence: “On saturday, my Aunt took me to the Museum.”","On Saturday, my aunt took me to the museum.","On saturday, my aunt took me to the museum.","On Saturday, my Aunt took me to the Museum.","On Saturday, My Aunt took me to the Museum.")
  ],
  concreteAbstract:[
    qLevel(2,"Which word is an abstract noun made from the adjective “brave”?","bravery","bravely","braver","braving"),
    qLevel(2,"Which noun is abstract? The students showed respect for the visitor.","respect","students","visitor","showed"),
    qLevel(3,"Which sentence has one concrete noun and one abstract noun?","The gift filled her with joy.","The gift was in the box.","Her joy turned into pride.","The box and the shiny gift fell over."),
    qLevel(3,"Which abstract noun best completes the sentence? “Winning the race filled Leo with ___.”","pride","medals","sneakers","trophies")
  ],
  fToVes:[
    qLevel(2,"What is the plural of calf?","calves","calfs","calfes","calvs"),
    qLevel(2,"Which sentence uses the correct plurals?","The wolves hid behind the shelves.","The wolfs hid behind the shelves.","The wolves hid behind the shelfs.","The wolfes hid behind the shelves."),
    qLevel(3,"Which noun keeps its f in the plural?","chief","loaf","wife","shelf"),
    qLevel(3,"Fix the sentence: “The thiefs took both of our knifes.”","The thieves took both of our knives.","The thieves took both of our knifes.","The thiefs took both of our knives.","The thiefes took both of our knives.")
  ],
  enPlurals:[
    qLevel(2,"Which sentence is correct?","The men and women cheered.","The mens and women cheered.","The men and womans cheered.","The mans and women cheered."),
    qLevel(2,"What is the singular of women?","woman","women","womans","womon"),
    qLevel(3,"Which sentence needs a correction?","The childrens played with the oxen.","The children played next to the oxen.","The men fed the oxen hay.","Two women led the children home."),
    qLevel(3,"Fix the sentence: “Two womans and three childs waited for the bus.”","Two women and three children waited for the bus.","Two women and three childs waited for the bus.","Two womans and three children waited for the bus.","Two womens and three childrens waited for the bus.")
  ],
  basePlurals:[
    qLevel(2,"The fishing boat came back with dozens of ___.","squid","squides","squidden","squiddes"),
    qLevel(2,"Which sentence is correct?","The farmer counted twelve sheep.","The farmer counted twelve sheeps.","The farmer counted twelve sheepes.","The farmer counted twelve sheepen."),
    qLevel(2,"Which noun is the same in the singular and the plural?","trout","goose","wolf","mouse"),
    qLevel(3,"Which sentence needs a correction?","Many deers ran across the road.","Many deer ran across the road.","Two moose drank from the cold lake.","We saw three salmon jump."),
    qLevel(3,"Fix the sentence: “We saw four mooses and many sheeps at the farm.”","We saw four moose and many sheep at the farm.","We saw four mooses and many sheep at the farm.","We saw four moose and many sheeps at the farm.","We saw four meese and many sheep at the farm.")
  ],
  mutantPlurals:[
    qLevel(2,"Which sentence is correct?","The geese hissed at the mice.","The gooses hissed at the mice.","The geese hissed at the mouses.","The geeses hissed at the mices."),
    qLevel(2,"What is the singular of teeth?","tooth","teeth","tooths","teethe"),
    qLevel(3,"Which sentence needs a correction?","My two front tooths are loose.","My two front teeth are loose.","Both of my feet are cold and wet.","The mice ran past my feet."),
    qLevel(3,"Fix the sentence: “The cat chased three mouses past the gooses.”","The cat chased three mice past the geese.","The cat chased three mice past the gooses.","The cat chased three mouses past the geese.","The cat chased three mices past the geeses.")
  ],
  foreignPlurals:[
    qLevel(2,"What is the plural of stimulus?","stimuli","stimulae","stimulis","stimulus"),
    qLevel(2,"Scientists collect data. What is the singular of data?","datum","datas","dati","datae"),
    qLevel(3,"Which sentence uses the correct plural?","The scientists studied two fungi.","The scientists studied two fungis.","The scientists studied two fungae.","The scientists studied two funguss."),
    qLevel(3,"Fix the sentence: “The team faced two crisises and checked three criterions.”","The team faced two crises and checked three criteria.","The team faced two crises and checked three criterions.","The team faced two crisises and checked three criteria.","The team faced two crisis and checked three criterias.")
  ],
  pluralReview:[
    qLevel(2,"Which word is spelled correctly?","halves","halfs","halfes","halvs"),
    qLevel(2,"Which noun forms its plural by changing its vowels?","tooth","deer","knife","cactus"),
    qLevel(3,"Which sentence uses every plural correctly?","The children fed the geese and the sheep.","The childs fed the geese and the sheep.","The children fed the gooses and the sheep.","The children fed the geese and the sheeps."),
    qLevel(3,"Which sentence needs a correction?","The elfs put loaves on the shelves.","The elves put loaves on the shelves.","The women put loaves on the shelves.","The men put two loaves on the shelf.")
  ]
};
const VERB_EXTRA_QUESTIONS = {
  verbIdentify:[
    qLevel(2,"Which sentence has two verbs?","Leo laughed and clapped.","Leo and Mia laughed.","The happy boy laughed.","Leo laughed at the clown."),
    qLevel(2,"Which word is the verb? The sunset was beautiful.","was","sunset","beautiful","The"),
    qLevel(3,"In which sentence is “watch” used as a verb?","We watch the game every Sunday.","My watch stopped at noon.","He wore a gold watch.","The new watch was a gift from my dad."),
    qLevel(3,"How many verbs are in this sentence? The dogs bark and jump when the doorbell rings.","3","1","2","4")
  ],
  verbAgreement:[
    qLevel(2,"The puppies and their mother ___ in the barn.","sleep","sleeps","sleeping","is sleeping"),
    qLevel(2,"Each of the students ___ a pencil.","has","have","having","are having"),
    qLevel(3,"Which sentence needs a correction?","The box of crayons are on the desk.","The box of crayons is on the desk.","The boxes of crayons are on the desk.","My crayons are on the desk."),
    qLevel(3,"Fix the sentence: “Neither my brother nor my sisters likes spinach.”","Neither my brother nor my sisters like spinach.","Neither my brother nor my sisters is liking spinach.","Neither my brother nor my sister like spinach.","Neither my brothers nor my sisters likes spinach.")
  ],
  verbTense:[
    qLevel(2,"Which sentence is in the future tense?","The bus will leave at noon.","The bus left at noon.","The bus leaves every day at noon.","The bus was leaving at noon."),
    qLevel(2,"Last summer, my family ___ to the beach.","drove","drives","will drive","is driving"),
    qLevel(3,"Which sentence needs a correction?","Yesterday, we will plant a tree.","Yesterday, we planted a tree.","Tomorrow, we will plant a tree.","Today, we plant a tree together."),
    qLevel(3,"Fix the sentence: “Last night, Tia finishes her book and goes to bed.”","Last night, Tia finished her book and went to bed.","Last night, Tia finished her book and goes to bed.","Last night, Tia finishes her book and went to bed.","Last night, Tia will finish her book and go to bed.")
  ],
  actionLinkHelping:[
    qLevel(2,"Which sentence uses “felt” as a linking verb?","The blanket felt soft.","She felt the soft blanket.","He felt his way in the dark.","I felt a raindrop fall."),
    qLevel(2,"Which sentence has a helping verb?","We are building a fort.","We built a fort in the yard.","We love our fort.","Our new fort is very big and strong."),
    qLevel(3,"In “The soup tasted salty,” what kind of verb is tasted?","linking verb","action verb","helping verb","modal verb"),
    qLevel(3,"Which sentence has both a helping verb and an action verb?","Maya will bake a cake.","Maya seems tired today.","Maya is a good baker.","Maya bakes cakes.")
  ],
  irregularVerbs:[
    qLevel(2,"What is the past tense of teach?","taught","teached","tought","teacht"),
    qLevel(2,"Last week, we ___ a nest in the tree.","found","finded","founded","find"),
    qLevel(3,"Which sentence needs a correction?","She throwed the ball to me.","She threw the ball to me.","He caught the ball with both hands.","They took the ball home."),
    qLevel(3,"Fix the sentence: “Yesterday I writed a letter and sended it.”","Yesterday I wrote a letter and sent it.","Yesterday I wrote a letter and sended it.","Yesterday I writed a letter and sent it.","Yesterday I written a letter and sent it.")
  ],
  simpleAspect:[
    qLevel(2,"Which sentence states a fact in the simple present?","Bees make honey.","Bees are making honey.","Bees have made honey.","Bees were making honey."),
    qLevel(2,"Choose the simple future: Next year, my sister ___ middle school.","will start","started","was starting","has started"),
    qLevel(3,"Which sentence needs a correction?","Every morning, Sam walk his dog.","Every morning, Sam walks his dog.","Last night, Sam walked his dog.","Tomorrow, Sam will walk his dog."),
    qLevel(3,"Which sentence uses the simple aspect for all of its verbs?","She opened the box, smiled, and laughed.","She was opening the box and smiling at us.","She has opened the box and smiled.","She is opening the box and laughing.")
  ],
  progressiveAspect:[
    qLevel(2,"Which sentence uses the past progressive?","We were eating when it rained.","We are eating while it rains.","We ate after it rained.","We will be eating after it rains."),
    qLevel(2,"Choose the present progressive: Listen! The birds ___.","are singing","sang","were singing","have sung"),
    qLevel(3,"Which sentence needs a correction?","Right now, the kids are play soccer.","Right now, the kids are playing soccer.","Yesterday, the kids were playing soccer.","Soon, the kids will be playing soccer."),
    qLevel(3,"Fix the sentence: “At noon tomorrow, we will riding the train.”","At noon tomorrow, we will be riding the train.","At noon tomorrow, we were riding the train.","At noon tomorrow, we will rode the train.","At noon tomorrow, we will been riding the train.")
  ],
  perfectAspect:[
    qLevel(2,"Which sentence uses the past perfect?","The game had ended when we arrived.","The game has ended now that we are here.","The game ends when we arrive.","The game will end before we arrive."),
    qLevel(2,"What is the past participle of write?","written","wrote","writed","writing"),
    qLevel(3,"Which sentence needs a correction?","I have went to that park before.","I have gone to that park before.","I had gone to the park before lunch.","I will have gone to the park by noon."),
    qLevel(3,"Fix the sentence: “By the time we got there, the bus has left.”","By the time we got there, the bus had left.","By the time we got there, the bus has leaved.","By the time we got there, the bus will have left.","By the time we got there, the bus has been leaving.")
  ],
  perfectProgressive:[
    qLevel(2,"Which sentence uses the past perfect progressive?","He had been practicing before the show.","He has been practicing for the show.","He was practicing before the show.","He will have practiced before the show."),
    qLevel(2,"Choose the best verb: My aunt ___ at the bakery for ten years now.","has been working","had been working","will be working","was working"),
    qLevel(3,"Which sentence needs a correction?","We have been wait for the bus.","We have been waiting for the bus.","We had been waiting for the bus.","We will have been waiting an hour."),
    qLevel(3,"Fix the sentence: “By June, Kai will have be training for a year.”","By June, Kai will have been training for a year.","By June, Kai will have been trained for a whole year.","By June, Kai has been training for a year.","By June, Kai will be have training for a year.")
  ],
  tenseAspectTime:[
    qLevel(2,"Choose the best verb: When the alarm rang, I ___ for an hour.","had been sleeping","have been sleeping","will be sleeping","am sleeping"),
    qLevel(2,"Which sentence shows an action in progress at a moment in the past?","At 9 p.m., I was reading.","At 9 p.m., I will read.","At 9 p.m., I have read.","At 9 p.m., I will be reading."),
    qLevel(3,"Which sentence needs a correction to keep the tense consistent?","She finished lunch and goes outside.","She finished lunch and went outside.","She finishes lunch and goes outside.","She will finish lunch and go outside."),
    qLevel(3,"Fix the sentence: “I have been living here since I am six.”","I have been living here since I was six.","I had been living here since I am six.","I am living here since I was six.","I have been living here since I will be six.")
  ],
  modalVerbs:[
    qLevel(2,"Which modal shows a strong guess? The lights are off, so they ___ be asleep.","must","can","shall","may not"),
    qLevel(2,"Which sentence uses a modal to give advice?","You should rest your ankle.","You rested your ankle.","You are resting your ankle.","You will rest your ankle today."),
    qLevel(3,"Which sentence needs a correction?","We must to finish our project.","We must finish our project.","We should finish our project.","We might finish our project soon."),
    qLevel(3,"Which sentence shows the weakest possibility?","It might snow tomorrow.","It will snow tomorrow.","It must snow tomorrow.","It is going to snow tomorrow.")
  ]
};
const ENGLISH_BUILT_IN_LEVELS = {"identifyNouns":[1,1,1,1,1,2,2,2,1,1],"singularPlural":[1,1,1,1,2,1,1,1,2,2],"commonProper":[1,2,1,2,2,2,1,1,1,1],"concreteAbstract":[1,1,2,1,2,1,1,1,1,2],"fToVes":[1,1,1,1,1,2,1,1,2,1],"enPlurals":[1,1,1,1,2,2,1,1,2,1],"basePlurals":[1,1,2,2,2,1,2,1,2,1],"mutantPlurals":[1,1,1,1,2,2,2,1,2,2],"foreignPlurals":[1,2,2,2,2,3,2,2,2,2],"pluralReview":[1,1,1,1,2,3,1,2,2,2],"verbIdentify":[1,1,1,1,2,2,1,1,2,2],"verbAgreement":[1,1,2,2,2,3,1,2,2,3],"verbTense":[1,1,1,1,1,1,2,2,1,1],"actionLinkHelping":[1,2,2,2,2,1,2,1,2,1],"irregularVerbs":[1,1,1,1,2,2,1,2,1,2],"simpleAspect":[1,1,1,2,2,1,2,1,1,1],"progressiveAspect":[1,2,2,1,2,1,1,2,2,1],"perfectAspect":[2,2,2,1,2,2,1,2,2,2],"perfectProgressive":[2,2,3,1,2,3,2,2,3,2],"tenseAspectTime":[2,2,2,2,2,2,2,3,2,2],"modalVerbs":[1,1,1,1,1,2,1,2,2,2]};
[PLURAL_QUESTIONS, VERB_QUESTIONS].forEach(bank => Object.entries(ENGLISH_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = bank[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; })));
Object.entries(PLURAL_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { PLURAL_QUESTIONS[skillId] = [...(PLURAL_QUESTIONS[skillId] || []), ...questions]; });
Object.entries(VERB_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { VERB_QUESTIONS[skillId] = [...(VERB_QUESTIONS[skillId] || []), ...questions]; });
/* ---------- English Unit 3: Pronouns (Khan Academy Grammar, Unit 3: Parts of speech: the pronoun) ----------
   One lesson per Khan skill, in Khan's order, grouped by Khan's lessons. Every question has a level: 1 (easier),
   2 (medium) or 3 (Khan unit test level and up). The right answer is listed first; the game shuffles the choices. */
const ENGLISH_UNIT3 = [
  {id:'questionWord',name:'The question word',lesson:'Who, whom, whose, what, and which can start a question and stand in for the answer you don’t know yet. Who asks about a person, what about a thing, whose about an owner, and which about a choice.'},
  {id:'personalPronoun',name:'Meet the personal pronoun',lesson:'Personal pronouns (I, you, he, she, it, we, they, me, him, her, us, them) take the place of a noun that was already named, so you don’t repeat it.'},
  {id:'possessivePronoun',name:'Possessive pronouns and adjectives',lesson:'My, your, his, her, its, our, and their go before a noun (my bike). Mine, yours, his, hers, ours, and theirs stand alone (the bike is mine). Its never takes an apostrophe; it’s means it is.'},
  {id:'reflexivePronoun',name:'Reflexive pronouns',lesson:'A reflexive pronoun (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) is used when the subject does something to itself: She taught herself to knit.'},
  {id:'relativePronoun',name:'Relative pronouns',lesson:'Who, whom, whose, which, and that start a clause that tells more about a noun. Use who and whom for people, which and that for things, and whose to show ownership.'},
  {id:'pronounCase',name:'Choosing between subject and object pronouns',lesson:'Subject pronouns (I, he, she, we, they) do the action. Object pronouns (me, him, her, us, them) receive it or come after words like to, with, and between. Cover up the other person to check: Mia and I went; Dad drove Mia and me.'},
  {id:'pronounPerson',name:'Pronoun person',lesson:'First person is the speaker (I, we), second person is the listener (you), and third person is anyone else (he, she, it, they). Don’t switch person partway through a sentence.'},
  {id:'pronounNumber',name:'Pronoun number',lesson:'A pronoun must match the noun it stands for: one thing takes a singular pronoun (it, he, she), more than one takes a plural pronoun (they, them).'},
  {id:'indefinitePronoun',name:'Indefinite pronouns',lesson:'Indefinite pronouns don’t name a certain person or thing: someone, anybody, nothing, each, few, several, all. Words ending in -one, -body, and -thing, plus each and either, are singular.'},
  {id:'pronounVagueness',name:'Pronoun vagueness',lesson:'A pronoun is vague when a reader can’t tell which noun it means. If “she” could be two different girls, use a name instead.'},
  {id:'emphaticPronoun',name:'Emphatic pronouns',lesson:'An emphatic pronoun looks like a reflexive pronoun but only adds emphasis: The mayor herself cut the ribbon. You can take it out and the sentence still makes sense.'}
];
const ENGLISH_GROUPS3 = [
  {id:'intro',quizName:'Introduction to pronouns Quiz',name:'Introduction to pronouns',learn:'Spot pronouns, use them to stand in for nouns, and use question words to ask about people and things.',skills:['questionWord','personalPronoun']},
  {id:'possessive',quizName:'Possessive and reflexive pronouns Quiz',name:'Possessive and reflexive pronouns',learn:'Show who owns something, and use -self and -selves pronouns when the subject acts on itself.',skills:['possessivePronoun','reflexivePronoun']},
  {id:'relative',quizName:'Relative pronouns Quiz',name:'Relative pronouns',learn:'Use who, whom, whose, which, and that to add information about a noun.',skills:['relativePronoun']},
  {id:'caseNumber',quizName:'Subject, object, person, and number Quiz',name:'Subject, object, person, and number',learn:'Choose I or me, keep the same person, and match each pronoun to its noun.',skills:['pronounCase','pronounPerson','pronounNumber']},
  {id:'indefinite',quizName:'Indefinite, vague, and emphatic pronouns Quiz',name:'Indefinite pronouns, pronoun vagueness, and emphatic pronouns',learn:'Match verbs to words like everyone and several, fix pronouns that could mean two people, and use pronouns for emphasis.',skills:['indefinitePronoun','pronounVagueness','emphaticPronoun']}
];
const PRONOUN_QUESTIONS = {
  questionWord:[
    qLevel(1,"Which word asks about a person? ___ left the gate open?","Who","What","Which","Whose"),
    qLevel(1,"Which question word fits? ___ is your favorite sandwich?","What","Who","Whom","Whose"),
    qLevel(1,"Which question word fits? ___ jacket is on the floor?","Whose","Who’s","Who","Whom"),
    qLevel(1,"Which word is the question word in this sentence? Who knocked on the door?","Who","knocked","door","the"),
    qLevel(2,"You have three flavors to choose from. Which question fits best?","Which flavor do you want?","Whose flavor do you want?","Who flavor do you want?","Whom flavor do you want?"),
    qLevel(2,"Which sentence is correct?","Who’s coming to the game?","Whose coming to the game?","Whos coming to the game?","Who’se coming to the game?"),
    qLevel(2,"Which question word fits? ___ of these two paintings did you make?","Which","Who","Whose","Whom"),
    qLevel(2,"In “What fell off the shelf?”, what does “What” stand for?","the thing that fell, which the speaker doesn’t know yet","the shelf, because that is the place where the thing fell from","the person asking","a thing the speaker already named"),
    qLevel(3,"Which question word fits? To ___ did you give the note?","whom","who","whose","which"),
    qLevel(3,"Which sentence uses a question word correctly?","Whom did you invite to the party?","Whom is knocking so loudly at the front door?","Whom ate my sandwich?","Whom wants to play?"),
    qLevel(3,"“Who” and “whom” both ask about people. When do you use “whom”?","When the person receives the action, like “Whom did you call?”","When the person does the action, like “Whom called you?”","When the person owns something, as in “Whom backpack is sitting here?”","When the question is about a thing"),
    qLevel(3,"Which question is about who owns something?","Whose idea was this?","Who had this idea?","What was the idea?","Which idea was this?"),
    qLevel(3,"Which sentence is correct?","Whose turn is it to feed the fish?","Who’s turn is it to feed the fish?","Whos turn is it to feed the fish?","Who turn is it to feed the fish?"),
    qLevel(3,"Which question word fits? ___ of you finished the puzzle first?","Which","Whose","Whom","What")
  ],
  personalPronoun:[
    qLevel(1,"Which word is a pronoun? Maya lost her ball, so she looked under the porch.","she","Maya","ball","porch"),
    qLevel(1,"Which pronoun can replace the underlined words? MY DAD AND I built a birdhouse.","We","They","Us","Them"),
    qLevel(1,"Which pronoun can replace “the backpack”? The backpack was too heavy to carry.","It","They","He","Them"),
    qLevel(1,"Which word is a personal pronoun?","them","table","quickly","jump"),
    qLevel(2,"Which pronoun can replace “Jordan and Eli”? Jordan and Eli raced to the corner.","They","Them","He","We"),
    qLevel(2,"How many personal pronouns are in this sentence? She told us that they would bring it.","4","3","2","5"),
    qLevel(2,"In “Grandpa called, and Mom answered him,” who is “him”?","Grandpa","Mom","the speaker","nobody named"),
    qLevel(2,"Which sentence uses a pronoun to avoid repeating a noun?","Leo found a shell and showed it to Ana.","Leo found a shell and showed the shell to Ana.","Leo found a shell and Ana found a shell.","Leo and Ana found shells on the beach."),
    qLevel(3,"Which word is NOT a personal pronoun?","this","us","her","it"),
    qLevel(3,"Which pronoun should replace the blank? The coach gave the twins a high five, and ___ smiled.","they","them","we","it"),
    qLevel(3,"Read: “The book was heavy, so Kim put it down.” What noun does “it” replace?","book","Kim","down","heavy"),
    qLevel(3,"Which sentence uses a pronoun correctly to replace “Sara”?","Sara was tired, so she went to bed early.","Sara was tired, so her went to bed early.","Sara was tired, so it went to bed early.","Sara was tired, so herself went to bed early."),
    qLevel(3,"In “When the twins got home, they ate dinner,” what does “they” replace?","the twins","home","dinner","the speaker and the twins"),
    qLevel(3,"Which sentence fixes the repeated noun? “The students turned in the students’ projects.”","The students turned in their projects.","The students turned in its projects.","The students turned in they projects.","The students turned in them projects yesterday.")
  ],
  possessivePronoun:[
    qLevel(1,"Which word fits? That red bike is ___.","mine","my","me","I"),
    qLevel(1,"Which word fits? The cat licked ___ paw.","its","it’s","its’","it is"),
    qLevel(1,"Which word fits? We cleaned ___ room.","our","ours","us","we"),
    qLevel(1,"Which word shows that the backpack belongs to Lily? That backpack is ___.","hers","her’s","hers’","she"),
    qLevel(2,"Which sentence is correct?","It’s raining, so the dog stayed in its house.","Its raining, so the dog stayed in it’s house.","It’s raining, so the dog stayed in it’s house.","Its raining, so the dog stayed in its house."),
    qLevel(2,"Which sentence is correct?","The blue towels are theirs.","The blue towels are their’s.","The blue towels are theirs’.","The blue towels are their."),
    qLevel(2,"Which word is a possessive adjective (it goes before a noun)?","your","yours","you","you’re"),
    qLevel(2,"Which word is a possessive pronoun that stands alone?","yours","your","you’re","you"),
    qLevel(3,"Which sentence is correct?","Is this pencil yours or mine?","Is this pencil your’s or mine?","Is this pencil yours or my?","Is this pencil your or mine?"),
    qLevel(3,"Which word fits both blanks? I lost ___ hat, so Dad let me borrow ___.","my, his","mine, his","my, him","mine, he"),
    qLevel(3,"Which sentence needs a correction?","The team lost it’s first game.","The team lost its first game.","It’s the team’s first game.","The team says it’s ready for the next game."),
    qLevel(3,"Which sentence is correct?","Their house is next to ours.","There house is next to ours.","Their house is next to our’s.","They’re house is next to ours."),
    qLevel(3,"Which words fit? The dog wagged ___ tail because ___ time for a walk.","its, it’s","it’s, its","its, its","it’s, it’s"),
    qLevel(3,"Which sentence uses a possessive adjective, not a possessive pronoun?","Your idea won the contest.","The winning idea was yours.","The prize is ours to share.","Is that seat hers or mine?")
  ],
  reflexivePronoun:[
    qLevel(1,"Which word fits? I made ___ a sandwich.","myself","me","mine","I"),
    qLevel(1,"Which word fits? The kids cleaned up after ___.","themselves","them","theirselves","themself"),
    qLevel(1,"Which word is a reflexive pronoun?","herself","her","hers","she"),
    qLevel(1,"Which word fits? Be careful! You might hurt ___.","yourself","you","your","yours"),
    qLevel(2,"Which sentence is correct?","He taught himself to juggle.","He taught hisself to juggle.","He taught heself to juggle.","He taught himselves to juggle."),
    qLevel(2,"Which word fits? We gave ___ a high five after the game.","ourselves","ourself","us","ourselfs"),
    qLevel(2,"Which word fits? The robot can charge ___.","itself","it","its","itselves"),
    qLevel(2,"When do you use a reflexive pronoun like “herself”?","When the subject acts on itself, as in “She saw herself in the mirror.”","Any time you mean “her,” as in “Mom drove herself and me to school.”","To show that something belongs to her, as in “That jacket is herself’s.”","At the start of a sentence, as in “Herself and I went to the store yesterday.”"),
    qLevel(3,"Which sentence uses a reflexive pronoun correctly?","Mia and I made ourselves a snack.","Mia and myself fixed the bike.","Mom drove Mia and myself to school.","Myself and Mia fixed the bike."),
    qLevel(3,"Which sentence needs a correction?","Please give the papers to Mr. Ruiz or myself.","Please give the papers to Mr. Ruiz or me.","I gave myself a break after the test.","Mr. Ruiz reminded himself to check the papers."),
    qLevel(3,"Which sentence is correct?","The twins dressed themselves for the play.","The twins dressed theirselves for the play.","The twins dressed themself for the play.","The twins dressed theirself for the play."),
    qLevel(3,"Which word fits? You two should be proud of ___.","yourselves","yourself","yourselfs","you"),
    qLevel(3,"Which sentence is correct?","Lucas and I quizzed ourselves before the test.","Lucas and I quizzed myself before the test.","Lucas and I quizzed ourself before the test.","Lucas and myself quizzed each other before the big test."),
    qLevel(3,"Which sentence uses a reflexive pronoun?","The kitten saw itself in the mirror and hissed.","The kitten itself is tiny enough to fit in a cup.","The kitten hissed at it in the mirror.","Its reflection made the kitten hiss.")
  ],
  relativePronoun:[
    qLevel(1,"Which word fits? The girl ___ won the race is my cousin.","who","which","whose","whom"),
    qLevel(1,"Which word fits? I lost the book ___ you lent me.","that","who","whose","whom"),
    qLevel(1,"Which word is the relative pronoun? The man who fixed our sink was friendly.","who","man","fixed","friendly"),
    qLevel(1,"Which word fits? That’s the boy ___ dog chased the mail truck.","whose","who’s","who","which"),
    qLevel(2,"Which sentence is correct?","The teacher who coaches soccer also teaches art.","The teacher which coaches soccer also teaches art.","The teacher whose coaches soccer also teaches art.","The teacher whom coaches soccer also teaches art."),
    qLevel(2,"Which word fits? Our school bus, ___ is usually on time, came late today.","which","that","who","whose"),
    qLevel(2,"In “I found the keys that you dropped,” what does “that” refer to?","the keys","you","I","the act of dropping something"),
    qLevel(2,"Which word fits? The artist ___ paintings hang in the hall visited our class.","whose","who","that","which"),
    qLevel(3,"Which word fits? The friend ___ I called last night is moving.","whom","who’s","which","whose"),
    qLevel(3,"Which sentence uses a comma and a relative pronoun correctly?","My bike, which is ten years old, still works.","My bike, that is ten years old, still works.","My bike which, is ten years old, still works.","My bike, who is ten years old, still works."),
    qLevel(3,"Which sentence needs a correction?","The dog who’s collar is red belongs to Sam.","The dog whose collar is red belongs to Sam.","The dog that has a red collar belongs to Sam.","The dog, which has a red collar, belongs to Sam."),
    qLevel(3,"Which word fits? The coach, to ___ we gave the card, smiled.","whom","who","which","that"),
    qLevel(3,"Which sentence is correct?","The trail that we hiked was muddy.","The trail who we hiked was muddy.","The trail whom we hiked was muddy.","The trail whose we hiked was muddy."),
    qLevel(3,"Which sentence needs commas around its relative clause?","Mount Everest which is the tallest mountain on Earth is in Asia.","The mountain that we climbed was steep.","The hikers who reached the top of the tallest peak cheered loudly.","The map that I drew had a mistake.")
  ],
  pronounCase:[
    qLevel(1,"Which word fits? ___ and Grace walked to the library.","She","Her","Me","Him"),
    qLevel(1,"Which word fits? Grandma made pancakes for ___.","us","we","our","ours"),
    qLevel(1,"Which sentence is correct?","She and I like to draw.","Her and me like to draw.","Me and her like to draw.","Her and I like to draw."),
    qLevel(1,"Which word fits? The coach told ___ to stretch.","them","they","their","theirs"),
    qLevel(2,"Which sentence is correct?","Dad drove Ella and me to practice.","Dad drove Ella and I to practice.","Dad drove I and Ella to practice.","Dad drove Ella and myself to practice."),
    qLevel(2,"Which sentence is correct?","Keep this secret between you and me.","Keep this secret between you and I.","Keep this secret between I and you.","Keep this secret between yourself and I."),
    qLevel(2,"Which word fits in formal writing? It was ___ who left the cookies for you.","we","us","our","ours"),
    qLevel(2,"Which trick helps you choose between “Ben and I” and “Ben and me”?","Cover “Ben and” and see whether “I” or “me” sounds right alone","Put “I” at the end of the list of people, since that is polite","Use “me” whenever the pronoun comes right after the word “and”","Use whichever sounds more polite"),
    qLevel(3,"Which sentence is correct?","The teacher asked him and her to hand out papers.","The teacher asked he and she to hand out papers.","The teacher asked him and she to hand out papers.","The teacher asked he and her to hand out papers."),
    qLevel(3,"Which sentence is correct?","We students cleaned the park.","Us students cleaned the park.","Ours students cleaned the park.","Us student’s cleaned the park."),
    qLevel(3,"Which sentence is correct?","The principal gave us students a reward.","The principal gave we students a reward.","The principal gave we student a reward.","The principal gave students us a reward."),
    qLevel(3,"Which sentence needs a correction?","Him and his brother built a fort.","He and his brother built a fort.","His brother and he built a fort.","They built a fort with his brother."),
    qLevel(3,"Which sentence is correct?","Mom and she are making tacos.","Mom and her are making tacos.","Her and Mom are making tacos.","Mom and herself are making tacos."),
    qLevel(3,"Which word fits? Our neighbors invited my brother and ___ to swim.","me","I","myself","mine")
  ],
  pronounPerson:[
    qLevel(1,"Which pronoun is first person?","we","you","they","she"),
    qLevel(1,"Which pronoun is second person?","you","I","he","them"),
    qLevel(1,"Which pronoun is third person?","they","we","I","you"),
    qLevel(1,"A story that uses “I” and “me” for the narrator is told in which person?","first person","second person","third person","first and third person mixed"),
    qLevel(2,"Which list has only third-person pronouns?","he, she, it, they","I, me, we, us","you, your, yours","him, her, it, them, and also you"),
    qLevel(2,"Which sentence is in second person?","You should stretch before you run.","I stretch before I run.","She stretches before she runs.","They stretch for ten minutes before they run."),
    qLevel(2,"Which pronoun fits? When I study, ___ like to play quiet music.","I","you","they","he"),
    qLevel(2,"Which pronoun fits? When people visit the zoo, ___ should bring water.","they","you","we","I"),
    qLevel(3,"Which sentence switches person by mistake?","When I swim in the lake, you get cold fast.","When I swim in the lake, I get cold fast.","When you swim in the lake, you get cold fast.","When we swim in the lake, we get cold fast."),
    qLevel(3,"Fix the shift in person: “If a student studies, you will do better.”","If a student studies, he or she will do better.","If a student studies, we will do better.","If a student studies, I will do better.","If a student studies, you and I will both do better."),
    qLevel(3,"Which sentence keeps the same person all the way through?","Our class planted trees, and we watered them every week.","Our class planted trees, and you watered them every week.","When I plant trees, you have to water them every week.","If a person plants a tree, you should water it every week."),
    qLevel(3,"A narrator says, “She opened the door and saw a fox.” What person is the story told in?","third person","first person","second person","first and second person mixed"),
    qLevel(3,"Which revision fixes the shift? “I love the library because you can find any book there.”","I love the library because I can find any book there.","I love the library because they can find any book there.","You love the library because I can find any book there.","I love the library because we can find you any book there."),
    qLevel(3,"Which sentence is in first person plural?","We packed our bags for camp.","I packed my bag for camp.","You packed your bags for camp.","They packed their bags for camp.")
  ],
  pronounNumber:[
    qLevel(1,"Which pronoun fits? The dogs barked until ___ got tired.","they","it","he","she"),
    qLevel(1,"Which pronoun fits? The kite got stuck, so we pulled ___ down.","it","them","they","us"),
    qLevel(1,"Which pronoun fits? My sisters said ___ would help.","they","she","it","her"),
    qLevel(1,"Which pronoun is plural?","them","him","her","it"),
    qLevel(2,"Which sentence is correct?","The plants need water, so I watered them.","The plants need water, so I watered it.","The plants need water, so I watered its.","The plants need water, so I watered it with the hose."),
    qLevel(2,"Which pronoun fits? The class finished ___ project early. (Think of the class as one group.)","its","their","they’re","it’s"),
    qLevel(2,"Which pronoun fits? Each of the boys brought ___ own lunch.","his","their","its","they"),
    qLevel(2,"Which pronoun fits? Lin and Rosa said ___ would be late.","they","she","her","it"),
    qLevel(3,"Which sentence has a pronoun that doesn’t match its noun?","The team cheered when they won its trophy.","The team cheered when it won its trophy.","The players cheered when they won their trophy.","The team cheered when it won the trophy."),
    qLevel(3,"Which sentence is correct?","My grandparents sold their old car.","My grandparents sold its old car.","My grandparents sold them old car.","My grandparents sold they’re old car."),
    qLevel(3,"Which pronoun fits? The library closes ___ doors at six.","its","their","it’s","they"),
    qLevel(3,"Which sentence needs a correction?","A bird built their nest in our tree.","A bird built its nest in our tree.","Two birds built their nest in our tree.","The birds built their nests in our tree."),
    qLevel(3,"Which word fits? Either the cat or the dog left ___ toy on the stairs.","its","their","they’re","them"),
    qLevel(3,"What does “them” refer to? The kids found two kittens and took them home.","the kittens","the kids","home","the kids and the kittens")
  ],
  indefinitePronoun:[
    qLevel(1,"Which word is an indefinite pronoun?","someone","Sam","she","sister"),
    qLevel(1,"Which word fits? Everyone ___ ready for the field trip.","is","are","were","be"),
    qLevel(1,"Which word is an indefinite pronoun? Nobody heard the bell.","Nobody","heard","bell","the"),
    qLevel(1,"Which word fits? Several of the cookies ___ broken.","are","is","was","has been"),
    qLevel(2,"Which word fits? Each of the students ___ a locker.","has","have","are having","were having"),
    qLevel(2,"Which indefinite pronoun is always plural?","both","everyone","each","nobody"),
    qLevel(2,"Which sentence is correct?","Somebody left a jacket on the bus.","Somebody leave a jacket on the bus.","Somebody have left a jacket on the bus.","Somebody were leaving a jacket on the bus."),
    qLevel(2,"Which word fits? Few of the players ___ ever won a trophy.","have","has","is","was"),
    qLevel(3,"Which sentence is correct?","All of the pizza is gone.","All of the pizza are gone.","All of the pizza were gone.","All of the pizza have gone."),
    qLevel(3,"Which sentence is correct?","All of the pencils are sharp.","All of the pencils is sharp.","All of the pencils was sharp.","All of the pencils has been sharp."),
    qLevel(3,"Which sentence needs a correction?","Either of the routes are fine.","Either of the routes is fine.","Both of the routes are fine.","Neither of the routes is long or hard to follow."),
    qLevel(3,"Which word fits? Nothing in these boxes ___ to me.","belongs","belong","are belonging","have belonged"),
    qLevel(3,"Which sentence is correct in formal writing?","Neither of the answers is right.","Neither of the answers are right.","Neither of the answers were right.","Neither of the answers have been right."),
    qLevel(3,"Which word fits? Some of the milk ___ spilled.","was","were","are","have been")
  ],
  pronounVagueness:[
    qLevel(1,"Which sentence has a vague pronoun?","When Mia met Ana at the park, she laughed.","When Mia met Ana at the park, Mia laughed.","Mia laughed when she met Ana at the park.","Ana laughed when Mia arrived at the park."),
    qLevel(1,"What makes a pronoun vague?","A reader can’t tell which noun it stands for","It names a place","It is plural","It comes at the very end of the sentence, after the verb"),
    qLevel(1,"Which sentence is clear?","Dad pointed out that Leo’s shoe was untied.","Dad told Leo that his shoe was untied.","He told him that his shoe was untied.","Dad told him his shoe was untied, and he tied it."),
    qLevel(1,"In “Sam gave Tom his pencil,” why is “his” vague?","It could mean Sam’s pencil or Tom’s pencil","Pencils can’t belong to people","“His” should be “him”","There is no noun anywhere before “his” in the sentence"),
    qLevel(2,"Which revision fixes the vague pronoun? “The vase fell off the shelf, and it broke.”","The vase fell off the shelf, and the vase broke.","The vase fell off the shelf, and they broke.","It fell off the shelf, and it broke.","The vase fell off the shelf, and then they both broke."),
    qLevel(2,"Which sentence has a vague pronoun?","They say it will snow tomorrow.","The weather report says it will snow tomorrow.","Mr. Diaz says it will snow tomorrow.","The news says snow is coming tomorrow."),
    qLevel(2,"Which sentence is clear?","Rosa asked Kayla, “May I borrow your scarf?”","Rosa asked Kayla to borrow her scarf.","She asked her to borrow her scarf.","Rosa asked her if she could borrow her blue scarf tomorrow."),
    qLevel(2,"Which revision makes this clear? “Jake’s dog chased the cat until it got tired.”","Jake’s dog chased the cat until the dog got tired.","Jake’s dog chased the cat until they got tired.","It chased the cat until it got tired.","Jake’s dog chased the cat around the yard until it got tired."),
    qLevel(3,"Which sentence has a vague pronoun?","I put the plate on the table and then cleaned it.","I put the plate on the table and then cleaned the plate.","I cleaned the plate and put it on the table.","After I cleaned the table, I set the plate on it."),
    qLevel(3,"Which sentence has a vague “this”?","Our bus was late and it rained. This made me grumpy.","Our bus was late. This delay made me grumpy.","The late bus made me grumpy.","I was grumpy all morning because the bus was late and it rained."),
    qLevel(3,"Which revision is clearest? “When the coach talked to the player, he was upset.”","The coach was upset when he talked to the player.","When the coach talked to the player, they were upset.","When he talked to him, he was upset.","When the coach talked to the player, him was upset."),
    qLevel(3,"Which sentence has NO vague pronoun?","Ana handed the map to Ben so Ben could read it.","Ana handed the map to Ben so she could read it.","Ana handed it to Ben so he could read it.","She handed the map to him so they could read it."),
    qLevel(3,"Which sentence is clear?","After the bike hit the fence, its front tire went flat.","After the bike hit the fence, it was damaged.","When the bike hit the fence, it fell over.","After the bike hit the fence, it needed to be fixed by Dad."),
    qLevel(3,"Why is “it” vague in “Put the milk in the fridge when it is cold”?","It could mean the milk or the fridge","“It” should be “them” because milk is more than one thing","It should be “they”","It comes at the end of the sentence")
  ],
  emphaticPronoun:[
    qLevel(1,"Which word is an emphatic pronoun? The chef herself served our dinner.","herself","chef","served","dinner"),
    qLevel(1,"Which sentence uses an emphatic pronoun?","I myself saw the eagle.","I saw myself in the window.","I saw the eagle.","I saw it by the lake."),
    qLevel(1,"What does an emphatic pronoun do?","It adds emphasis, and the sentence still works without it","It shows who owns something","It replaces the subject","It replaces a noun that was never named anywhere earlier in the sentence"),
    qLevel(1,"Which word fits? The president ___ called to say thank you.","himself","hisself","him","his"),
    qLevel(2,"Which sentence still makes sense if you remove the word in capitals?","The players THEMSELVES chose the team name.","The players taught THEMSELVES the song.","The players saw THEMSELVES on TV.","The players made THEMSELVES a big lunch after practice."),
    qLevel(2,"Is “itself” emphatic or reflexive in “The cat cleaned itself”?","reflexive, because the cat does the action to itself","emphatic, because you can remove it","emphatic, because it is at the end","neither, because “itself” is a possessive pronoun for animals"),
    qLevel(2,"Is “myself” emphatic or reflexive in “I painted the whole fence myself”?","emphatic, because the sentence still works without it","reflexive, because I painted myself","possessive, because it shows the fence is mine","reflexive, because the subject “I” does the painting to the fence"),
    qLevel(2,"Which sentence is correct?","We built the robot ourselves.","We built the robot ourself.","We built the robot ourselfs.","We built the robot by ourself for the science fair."),
    qLevel(3,"Which sentence uses an emphatic pronoun correctly?","The author herself signed my book.","The author signed my book and herself.","Herself signed my book.","The author signed herself’s book."),
    qLevel(3,"Which sentence uses “themselves” for emphasis, not as a reflexive pronoun?","The kids themselves raised the money.","The kids hurt themselves on the slide.","The kids gave themselves a break.","The kids saw themselves in the photo."),
    qLevel(3,"Which sentence needs a correction?","The mayor and myself cut the ribbon.","The mayor herself cut the ribbon.","I cut the ribbon myself with a giant pair of scissors.","The mayor cut the ribbon herself."),
    qLevel(3,"Which word fits? You ___ said the test would be easy.","yourself","yourselfs","yourself’s","your"),
    qLevel(3,"Which sentence uses an emphatic pronoun?","I wrote the song myself, without any help.","I taught myself the song.","I sang the song to myself.","I bought myself a guitar and a book of songs."),
    qLevel(3,"Which sentence is correct?","The students themselves planned the bake sale.","The students theirselves planned the bake sale.","The students themself planned the bake sale.","Themselves planned the bake sale.")
  ]
};
/* ---------- English Unit 4: Adjectives and Adverbs (Khan Academy Grammar, Unit 4: Parts of speech: the modifier) ----------
   One lesson per Khan skill, in Khan's order, grouped by Khan's lessons. 14 questions a lesson: 4 at level 1, 4 at
   level 2, 6 at level 3 (Khan unit test level). The right answer is listed first; the game shuffles the choices. */
const ENGLISH_UNIT4 = [
  {id:'meetAdjective',name:'Meet the adjective',lesson:'An adjective describes a noun or pronoun. It tells what kind (a muddy boot), how many (three boots), or which one (the left boot). It can come before the noun or after a linking verb: the soup tastes salty.'},
  {id:'meetArticle',name:'Meet the article',lesson:'A, an, and the are articles, a small kind of adjective that comes before a noun (sometimes with other adjectives in between): the tall tree, an old map.'},
  {id:'definiteIndefinite',name:'Choosing between definite and indefinite articles',lesson:'The points to one particular thing the reader knows about. A and an mean any one. Use an before a vowel sound (an hour, an umbrella) and a before a consonant sound (a unicorn, a one-way street).'},
  {id:'meetAdverb',name:'Meet the adverb',lesson:'An adverb describes a verb, an adjective, or another adverb. It tells how (slowly), when (tomorrow), where (outside), how often (always), or how much (very). Many end in -ly, but not all: soon, fast, well.'},
  {id:'adverbOrAdjective',name:'Using adverbs and adjectives',lesson:'Use an adjective to describe a noun (a careful driver) and an adverb to describe an action (she drives carefully). After linking verbs like feel, look, smell, and taste, use an adjective: the pie smells delicious.'},
  {id:'relativeAdverbs',name:'Identifying relative adverbs',lesson:'Where, when, and why are relative adverbs when they start a clause that describes a noun: the park where we met, the day when it snowed, the reason why she laughed. When they ask a question, they are not relative adverbs.'},
  {id:'adjectiveOrder',name:'Adjective order',lesson:'When adjectives stack up, they usually go in this order: number, opinion, size, age, shape, color, origin, material, purpose. That is why we say “a lovely little old wooden house.”'},
  {id:'commasAdjectives',name:'Commas and adjectives',lesson:'Put a comma between two adjectives only if you could switch them or join them with “and”: a cold, rainy day (a rainy and cold day). No comma when you can’t: a big red barn, a heavy winter coat.'},
  {id:'comparativeSuperlative',name:'Comparative and superlative adjectives and adverbs',lesson:'Compare two with -er or more (taller, more careful). Compare three or more with -est or most (tallest, most careful). Some are irregular: good, better, best; bad, worse, worst. Never use both: not “more taller.”'},
  {id:'intensifiers',name:'Intensifiers and adverbs of degree',lesson:'Adverbs of degree tell how much: very, extremely, quite, almost, barely, too. They make an adjective or adverb stronger (extremely cold) or weaker (slightly cold). Too means more than is good: too hot to drink.'}
];
const ENGLISH_GROUPS4 = [
  {id:'intro',quizName:'Adjectives and articles Quiz',name:'Introduction to adjectives and articles',learn:'Find adjectives and articles, and choose a, an, or the.',skills:['meetAdjective','meetArticle','definiteIndefinite']},
  {id:'adverbs',quizName:'Adverbs Quiz',name:'Introduction to adverbs',learn:'Find adverbs, choose between an adjective and an adverb, and spot relative adverbs.',skills:['meetAdverb','adverbOrAdjective','relativeAdverbs']},
  {id:'order',quizName:'Adjective order and commas Quiz',name:'Adjective order and commas with adjectives',learn:'Put adjectives in the right order, and decide when they need a comma between them.',skills:['adjectiveOrder','commasAdjectives']},
  {id:'degree',quizName:'Comparing and intensifying Quiz',name:'Comparative, superlative, intensifiers, and adverbs of degree',learn:'Compare with -er and -est (or more and most), and make words stronger or weaker.',skills:['comparativeSuperlative','intensifiers']}
];
const MODIFIER_QUESTIONS = {
  meetAdjective:[
    qLevel(1,"Which word is an adjective? The tired puppy slept on the rug.","tired","puppy","slept","rug"),
    qLevel(1,"Which word is an adjective? We climbed a steep hill.","steep","climbed","hill","We"),
    qLevel(1,"Which word describes the noun “jacket”? Mom bought a waterproof jacket.","waterproof","bought","Mom","jacket"),
    qLevel(1,"Which word could describe a noun?","noisy","noise","quickly","under"),
    qLevel(2,"What question does the adjective answer? Three goats crossed the bridge.","How many?","What kind?","Which one?","Where?"),
    qLevel(2,"Which word is an adjective? The soup in the bowl smells delicious.","delicious","smells","soup","bowl"),
    qLevel(2,"Not counting a, an, and the, how many adjectives are in this sentence? A small brown bird sang a cheerful song.","3","2","4","1"),
    qLevel(2,"In which sentence is “light” an adjective?","She packed a light suitcase.","Please light the candle.","The light flickered all night.","Turn off the light before bed."),
    qLevel(3,"Which word does the adjective “brave” describe? The firefighter was brave during the storm.","firefighter","storm","was","during"),
    qLevel(3,"Which sentence has an adjective that comes after the noun it describes?","The lemonade tasted sour.","The sour lemonade spilled on the table.","We made lemonade today.","Dad poured the lemonade slowly."),
    qLevel(3,"Which pair of words are both adjectives? The old wooden bench creaked loudly near the quiet lake.","old, quiet","wooden, loudly","bench, quiet","creaked, old"),
    qLevel(3,"Why does “Spanish” start with a capital letter in “We ate Spanish rice”?","It is an adjective made from a proper noun","It is the first important word in the sentence","It is a verb that names an action","It tells how many people ate"),
    qLevel(3,"In which sentence is “cold” an adjective?","The cold wind stung my face.","I caught a cold last week.","My cold kept me home from school.","A cold can last about a week."),
    qLevel(3,"Which word is an adjective made from a noun?","sunny","sun","sunshine","sunbathe")
  ],
  meetArticle:[
    qLevel(1,"Which words in this sentence are articles? The owl caught a mouse.","The, a","owl, mouse","caught, a","The, owl"),
    qLevel(1,"Which list has only articles?","a, an, the","a, and, the","an, on, the","the, this, that"),
    qLevel(1,"Which word is an article? She found an old coin.","an","old","found","coin"),
    qLevel(1,"Which phrase uses an article?","the blue kite","my blue kite","two blue kites","her blue kite"),
    qLevel(2,"Articles are a special kind of which part of speech?","adjective","verb","adverb","pronoun"),
    qLevel(2,"In “the tallest tree,” which word is the article?","the","tallest","tree","there is no article"),
    qLevel(2,"How many articles are in this sentence? An hour later, the bus finally reached a small town.","3","2","4","1"),
    qLevel(2,"Which sentence uses its articles correctly?","We saw an eagle at the lake.","We saw a eagle at the lake.","We saw an eagle at an lake.","We saw a eagle and an hawk at the lake."),
    qLevel(3,"Which word comes before a noun but is NOT an article? My friend brought a cake to the party.","My","a","the","both a and the"),
    qLevel(3,"Which sentence is missing an article?","I need pencil for the test.","I need a pencil for the test.","I need the pencil on the desk.","I need pencils for the test."),
    qLevel(3,"Which sentence has an extra article that should be taken out?","She is a my best friend.","She is my best friend.","She is a good friend.","She is the best friend I have had."),
    qLevel(3,"Which sentence uses no article and is still correct?","Dogs need exercise every day.","Dog needs exercise every day.","The dogs need an exercise every day.","A dogs need exercise every day."),
    qLevel(3,"How many articles are in “An apple a day keeps the doctor away”?","3","2","1","4"),
    qLevel(3,"Which word in “Give me the red one” is an article?","the","me","red","one")
  ],
  definiteIndefinite:[
    qLevel(1,"Choose the correct phrase.","an elephant","a elephant","an elephants","a elephants"),
    qLevel(1,"Choose the correct phrase.","a banana","an banana","a bananas","an bananas"),
    qLevel(1,"Which article points to one particular thing the reader already knows about?","the","a","an","a or an"),
    qLevel(1,"Which sentence talks about any dog, not one particular dog?","I want a dog someday.","I want the dog in that window.","The dog next door barks.","Feed the dog before school."),
    qLevel(2,"Which sentence is correct?","We waited an hour.","We waited a hour.","We waited an hours.","We waited a hours."),
    qLevel(2,"Which words fit? Mia read ___ book last night. ___ book was about volcanoes.","a, The","the, A","an, The","a, A"),
    qLevel(2,"Which sentence uses its articles correctly?","An owl and a hawk sat on the fence.","A owl and a hawk sat on the fence.","An owl and an hawk sat on the fence.","A owl and an hawk sat on a fence."),
    qLevel(2,"Which article fits? Please pass me ___ salt shaker sitting by your plate.","the","a","an","no article"),
    qLevel(3,"Choose the correct phrase.","a university","an university","a universities","an universities"),
    qLevel(3,"Why does “an” come before “honest”?","Honest starts with a vowel sound because the h is silent","Honest starts with the letter h, and h always takes “an”","Honest is an adjective, and adjectives take “an”","“An” goes before words that start with the letter h"),
    qLevel(3,"Choose the correct phrase.","a one-way street","an one-way street","a one-ways street","an one-ways street"),
    qLevel(3,"Choose the correct phrase.","an X-ray","a X-ray","an X-rays","a X-rays"),
    qLevel(3,"Which sentence is correct?","It was an unusual day.","It was a unusual day.","It was an usual day.","It was a unusual days."),
    qLevel(3,"Which sentence is correct?","We planned a European trip.","We planned an European trip.","We planned a European trips.","We planned an European trips.")
  ],
  meetAdverb:[
    qLevel(1,"Which word is the adverb? The turtle moved slowly across the yard.","slowly","turtle","moved","across"),
    qLevel(1,"Which word is the adverb? We will leave tomorrow.","tomorrow","leave","will","We"),
    qLevel(1,"Which word tells where? The kids played games outside.","outside","played","kids","games"),
    qLevel(1,"Which word is an adverb?","gently","gentle","gentleness","gentlest"),
    qLevel(2,"What question does the adverb answer? She always brushes her teeth.","How often?","Where?","What kind?","How many?"),
    qLevel(2,"Which word does “carefully” describe? Leo carefully carried the tray.","carried","Leo","tray","the"),
    qLevel(2,"Which word is the adverb? The test was very hard.","very","test","hard","was"),
    qLevel(2,"How many adverbs are in this sentence? Yesterday, the dog barked loudly outside.","3","2","1","4"),
    qLevel(3,"In “The singer sang extremely well,” what does “extremely” describe?","the adverb “well”","the verb “sang”","the noun “singer”","the whole sentence at once"),
    qLevel(3,"Which sentence uses “fast” as an adverb?","Jamal ran fast.","Jamal is a fast runner.","The fast car zoomed by.","That was a fast game."),
    qLevel(3,"Which word is an adverb even though it doesn’t end in -ly?","soon","lovely","friendly","silly"),
    qLevel(3,"Which word is NOT an adverb?","lonely","quietly","early","often"),
    qLevel(3,"Which sentence uses “well” as an adverb?","Marta plays the violin well.","Marta feels well today.","The old well behind the barn was very deep.","Well, let’s get started."),
    qLevel(3,"Which word in this sentence is an adverb? Surprisingly, nobody noticed the huge mistake.","Surprisingly","nobody","noticed","huge")
  ],
  adverbOrAdjective:[
    qLevel(1,"Which sentence is correct?","The baby slept peacefully.","The baby slept peaceful.","The peacefully baby slept.","The baby peaceful slept."),
    qLevel(1,"Which sentence is correct?","Ava answered the question correctly.","Ava answered the question correct.","Ava correct answered the question.","Ava answered the correctly question."),
    qLevel(1,"Which word fits? The ___ dog chased its tail.","playful","playfully","play","playfulness"),
    qLevel(1,"Which sentence is correct?","The cheetah is a quick animal.","The cheetah is a quickly animal.","The quickly cheetah ran.","The cheetah is an quick animal."),
    qLevel(2,"Which sentence is correct?","The pie smells delicious.","The pie smells deliciously.","The pie smell delicious.","The pie is smelling deliciously."),
    qLevel(2,"Which sentence is correct?","You did well on the quiz.","You did good on the quiz.","You done well on the quiz.","You did real good on the quiz."),
    qLevel(2,"Which sentence uses an adjective after a linking verb?","The water felt cold.","She quickly drank the water.","The water flowed quickly.","He poured water into a glass."),
    qLevel(2,"Which word fits? The choir sang ___ at the concert.","beautifully","beautiful","beauty","beautifuler"),
    qLevel(3,"Which word goes in the blank, and why? The kids worked ___ on the project.","quietly, because it describes the verb “worked”","quiet, because it describes the verb “worked”","quietly, because it describes the noun “kids”","quiet, because it describes the noun “project” at the end"),
    qLevel(3,"Which sentence is correct?","Sam looks happy today.","Sam looks happily today.","Sam happy looks today.","Sam looks happiness today."),
    qLevel(3,"Which sentence is correct?","The detective looked carefully at the footprints.","The detective looked careful at the footprints.","The detective looked at the carefully footprints.","The detective carefully looked careful at the footprints."),
    qLevel(3,"Which sentence is written in standard English?","This puzzle is really hard.","This puzzle is real hard.","This puzzle is really hardly.","This puzzle is real hardly."),
    qLevel(3,"Which sentence is correct in formal writing?","I feel bad that I forgot your birthday.","I feel badly that I forgot your birthday.","I feel badness that I forgot your birthday.","I bad feel that I forgot your birthday."),
    qLevel(3,"Which sentence is correct?","The music was surprisingly loud.","The music was surprising loud.","The music was surprisingly loudly.","The music surprisingly was loudly.")
  ],
  relativeAdverbs:[
    qLevel(1,"Which word is a relative adverb? This is the park where we met.","where","This","park","met"),
    qLevel(1,"Which relative adverb fits? I remember the day ___ we got our puppy.","when","where","why","what"),
    qLevel(1,"Which relative adverb fits? That’s the store ___ Dad buys fresh bread.","where","when","why","who"),
    qLevel(1,"Which words can be relative adverbs?","where, when, why","who, what, which","here, there, now","and, but, or"),
    qLevel(2,"Which relative adverb fits? Tell me the reason ___ you were late.","why","where","when","how"),
    qLevel(2,"In which sentence is “where” a relative adverb?","We visited the town where my mom grew up.","Where did you put my shoes?","Where is the nearest library in this town?","Where are we going for dinner?"),
    qLevel(2,"In which sentence is “when” a relative adverb?","Summer is the season when we swim every day.","When does the movie start?","When will we get to Grandma’s house tonight?","When is your birthday?"),
    qLevel(2,"Which sentence combines these correctly? “This is the lake. We caught three fish there.”","This is the lake where we caught three fish.","This is the lake when we caught three fish.","This is the lake why we caught three fish.","This is where the lake we caught three fish."),
    qLevel(3,"What does the relative clause describe? I found the box where Grandma kept her letters.","the noun “box”","the verb “found”","the noun “letters”","the pronoun “I”"),
    qLevel(3,"In “Do you know the place where the trail ends?”, what job does “where” do?","It starts a clause that describes the noun “place”","It asks a question all by itself, like “Where is it?”","It names a place on the map","It describes the verb “ends”"),
    qLevel(3,"Which sentence uses a relative adverb correctly?","Nobody knows the reason why the lights went out.","Nobody knows the reason where the lights went out.","Nobody knows the reason when the lights went out.","Nobody knows the time why the lights went out."),
    qLevel(3,"Which sentence has a relative adverb?","That was the year when I learned to swim.","When I learned to swim, I was only six years old.","I learned to swim at camp.","Did you learn to swim at camp?"),
    qLevel(3,"What is “why” doing in “Why did the bell ring early?”","It asks a question","It joins a clause to the noun “reason”","It describes a noun in the sentence","It names a time"),
    qLevel(3,"Which relative adverb fits? Saturday is the day ___ the library opens late.","when","where","why","which")
  ],
  adjectiveOrder:[
    qLevel(1,"Which phrase sounds right?","a big red ball","a red big ball","a ball big red","a big ball red"),
    qLevel(1,"Which phrase is in the right order?","a cute little puppy","a little cute puppy","a puppy cute little","a cute puppy little"),
    qLevel(1,"Which phrase is in the right order?","an old wooden chair","a wooden old chair","an old chair wooden","a wooden chair old"),
    qLevel(1,"Which phrase sounds right?","two shiny coins","shiny two coins","two coins shiny","coins two shiny"),
    qLevel(2,"Which phrase is in the right order?","a beautiful old Italian painting","an Italian old beautiful painting","an old beautiful Italian painting","a beautiful Italian old painting"),
    qLevel(2,"Which phrase is in the right order?","a small round wooden table","a round small wooden table","a wooden small round table","a small wooden round table"),
    qLevel(2,"Which kind of adjective usually comes first in a list?","an opinion word, like lovely or ugly","a color word, like blue or green","a material word, like cotton or wool","a purpose word, like “sleeping” in sleeping bag"),
    qLevel(2,"Why does “a big old house” sound right but “an old big house” sound odd?","Size words usually come before age words","Shorter words always come before longer ones","Age words go at the very end of the list","Adjectives go in ABC order"),
    qLevel(3,"Which phrase is in the right order?","a new blue sleeping bag","a blue new sleeping bag","a sleeping new blue bag","a new sleeping blue bag"),
    qLevel(3,"Which phrase is in the right order?","a tall young Canadian athlete","a young tall Canadian athlete","a Canadian tall young athlete","a tall Canadian young athlete"),
    qLevel(3,"Which sentence has its adjectives in the right order?","We found a strange tiny green bug.","We found a tiny strange green bug.","We found a green strange tiny bug.","We found a strange green tiny bug."),
    qLevel(3,"Which phrase is in the wrong order?","a cotton white shirt","a soft white shirt","a large white cotton shirt","a new white shirt"),
    qLevel(3,"Which phrase is in the right order?","three delicious square chocolate cookies","three square delicious chocolate cookies","delicious three square chocolate cookies","three delicious chocolate square cookies"),
    qLevel(3,"Which phrase is in the right order?","an ugly old green sweater","an old ugly green sweater","a green ugly old sweater","an ugly green old sweater")
  ],
  commasAdjectives:[
    qLevel(1,"Which sentence is punctuated correctly?","It was a cold, rainy morning.","It was a cold rainy, morning.","It was a, cold rainy morning.","It was a cold, rainy, morning."),
    qLevel(1,"Which sentence is punctuated correctly?","She owns three gray cats.","She owns three, gray cats.","She owns three gray, cats.","She owns, three gray cats."),
    qLevel(1,"Which phrase is punctuated correctly?","a happy, excited crowd","a happy excited, crowd","a, happy excited crowd","a happy, excited, crowd"),
    qLevel(1,"Which phrase is punctuated correctly?","a soft, fluffy blanket","a soft fluffy, blanket","a soft, fluffy, blanket","a, soft fluffy blanket"),
    qLevel(2,"Which test tells you to put a comma between two adjectives?","You can switch their order and put “and” between them","Both adjectives are long words with three or more syllables","The adjectives come after the noun they describe","One of the adjectives ends in -y"),
    qLevel(2,"Which phrase needs a comma?","a friendly helpful neighbor","a small brown dog next door","three red apples","a big wooden box"),
    qLevel(2,"Which sentence is punctuated correctly?","We watched a long, boring movie.","We watched a long boring, movie.","We watched, a long boring movie.","We watched a long, boring, movie."),
    qLevel(2,"Where does the comma go in “a bright cheerful smile”?","between “bright” and “cheerful”","after “a”","between “cheerful” and “smile”","nowhere, because no comma is needed in this phrase"),
    qLevel(3,"Why is there no comma in “a big wooden box”?","“A wooden big box” and “a big and wooden box” both sound wrong","Both adjectives are short words","“Wooden” is really a noun in this phrase","Commas never go between two adjectives that come before a noun"),
    qLevel(3,"Which sentence uses commas correctly?","The tired, hungry hikers reached the old stone cabin.","The tired hungry hikers reached the old, stone cabin.","The tired, hungry hikers reached the old, stone cabin.","The tired hungry, hikers reached the old stone cabin."),
    qLevel(3,"Which sentence needs a comma between two adjectives?","It was a dark stormy night.","It was a bright summer day.","We ate two warm muffins.","She wore a red wool hat."),
    qLevel(3,"Comma or no comma in “a heavy winter coat”?","No comma: “winter coat” is one idea, so the words can’t switch","A comma, because there are two adjectives before the noun “coat”","A comma, because “coat” is a noun","No comma, because “heavy” is a long word"),
    qLevel(3,"Which sentence is punctuated correctly?","Our clever, playful puppy learned a new trick.","Our clever playful, puppy learned a new trick.","Our, clever playful puppy learned a new trick.","Our clever, playful, puppy learned a new trick."),
    qLevel(3,"Which phrase should NOT have a comma between its adjectives?","two small kittens","a warm sunny afternoon","a kind patient teacher","a soft fluffy pillow")
  ],
  comparativeSuperlative:[
    qLevel(1,"Which word fits? My dog is ___ than your dog.","smaller","small","smallest","more small"),
    qLevel(1,"Which word fits? Of all the planets, Jupiter is the ___.","largest","larger","most large","large"),
    qLevel(1,"Which word compares two things?","taller","tall","tallest","most tall"),
    qLevel(1,"Which sentence uses a superlative?","Today is the hottest day of the summer.","Today is hotter than yesterday and the day before.","Today is very hot.","Today is hot and sunny."),
    qLevel(2,"Which sentence is correct?","This test was easier than the last one.","This test was more easier than the last one.","This test was easiest than the last one.","This test was more easy than the last one."),
    qLevel(2,"Which sentence is correct?","This is the most exciting book I have read.","This is the excitingest book I have read.","This is the more exciting book I have read.","This is the most excitingest book I have read."),
    qLevel(2,"Which sentence is correct?","My cold is worse today than yesterday.","My cold is badder today than yesterday.","My cold is worst today than yesterday.","My cold is more bad today than yesterday."),
    qLevel(2,"Which sentence is correct?","Of the three runners, Kai ran the fastest.","Of the three runners, Kai ran the faster.","Of the three runners, Kai ran the most fast.","Of the three runners, Kai ran more fast."),
    qLevel(3,"Which sentence compares two actions correctly?","Lena speaks more softly than her sister.","Lena speaks softlier than her sister.","Lena speaks most softly than her sister.","Lena speaks more softer than her sister."),
    qLevel(3,"You are comparing only two pizzas. Which is correct in formal writing?","This pizza is the better of the two.","This pizza is the best of the two.","This pizza is the most good of the two.","This pizza is the gooder of the two."),
    qLevel(3,"Which sentence has a mistake?","Our team is more stronger this year.","Our team is stronger this year.","Our team is the strongest in the league.","Our team plays more confidently this year."),
    qLevel(3,"Which sentence is correct?","Grandma lives farther from school than we do.","Grandma lives farer from school than we do.","Grandma lives farthest from school than we do.","Grandma lives more far from school than we do."),
    qLevel(3,"Which sentence is correct?","Of all my friends, Rosa draws the most carefully.","Of all my friends, Rosa draws the carefulest.","Of all my friends, Rosa draws more carefully than anyone.","Of all my friends, Rosa draws the most careful."),
    qLevel(3,"Which sentence is correct?","I have less homework than my brother.","I have littler homework than my brother.","I have least homework than my brother.","I have more little homework than my brother.")
  ],
  intensifiers:[
    qLevel(1,"Which word is an adverb of degree? The soup is very hot.","very","soup","hot","is"),
    qLevel(1,"Which word tells how much? I am almost finished.","almost","I","am","finished"),
    qLevel(1,"Which word makes “tired” stronger? I was ___ tired after the race.","extremely","slightly","somewhat","a little"),
    qLevel(1,"Which sentence uses an intensifier?","The water was incredibly cold.","The water was cold.","The cold water splashed.","We swam in the cold water of the lake."),
    qLevel(2,"Which word makes the adjective weaker? The movie was ___ funny.","somewhat","very","really","incredibly"),
    qLevel(2,"Which sentence means the box is more than you can lift?","The box is too heavy for me to lift.","The box is very heavy, but I can lift it.","The box is quite heavy.","The box is heavy enough to hold the door open."),
    qLevel(2,"Which word does “really” describe? The puppy is really small.","small","puppy","is","the"),
    qLevel(2,"Which word tells to what degree? She barely made it to the bus.","barely","made","bus","She"),
    qLevel(3,"Which sentence uses an adverb of degree to describe another adverb?","He spoke quite slowly.","He spoke slowly.","He is quite tall for his age.","He was slow."),
    qLevel(3,"Which sentence means the cookies are not finished baking?","The cookies are nearly done.","The cookies are completely done.","The cookies are totally done.","The cookies are done."),
    qLevel(3,"Which word is NOT an adverb of degree?","quickly","very","rather","extremely"),
    qLevel(3,"Which sentence avoids a mistake in formal writing?","Every snowflake is unique.","Every snowflake is very unique.","Every snowflake is extremely unique.","Every snowflake is really very unique."),
    qLevel(3,"Which sentence uses “too” to mean “more than is good”?","The bath water is too hot to get in.","I want to come too.","She has two cats and a dog.","Can I have some ice cream and a cookie too?"),
    qLevel(3,"Which sentence shows the smallest amount?","I am slightly hungry.","I am very hungry.","I am extremely hungry.","I am really hungry.")
  ]
};
// English Unit 5: Prepositions and interjections (Khan Academy 5th and 6th grade grammar). The Link Library.
// "Preposition or adverb?" is a Pet World challenge lesson past Khan's unit. Docs: docs/ENGLISH-UNIT5.md
const ENGLISH_UNIT5 = [
  {id:'meetPreposition',name:'Meet the preposition',lesson:'A preposition shows how a noun or pronoun is related to the rest of the sentence: where (under the bed), when (after lunch), or how (with a spoon). Common ones: about, above, across, after, against, along, among, around, at, before, behind, below, beneath, beside, between, but (meaning except), by, during, except, for, from, in, inside, into, like, near, of, off, on, onto, out, over, past, since, through, to, toward, under, until, up, with, within, without. Some are more than one word: in front of, next to, because of.',tip:'Squirrel test: most prepositions are something a squirrel can do with a tree. It can run up it, around it, under it, or behind it. (Time words like during and until don’t pass the test, but they are prepositions too.)'},
  {id:'prepPhrases',name:'Prepositional phrases',lesson:'A prepositional phrase starts with a preposition and ends with its object, a noun or pronoun: under the old bridge, with her, after the long game. A phrase can work like an adjective and describe a noun (the girl with red boots) or like an adverb and tell when, where, or how (we ate after the game). Pronoun objects take the object form: between you and me, with him and her.'},
  {id:'prepPurpose',name:'What prepositions tell',lesson:'Prepositions show time (before, during, until, since, for), place or position (on, in, under, between, beside, among), direction (to, into, toward, across, through), and manner or means (by, with, like, without). The exact one changes the meaning: in the box is not on the box. Since goes with a starting point (since Monday); for goes with an amount of time (for three days). Between is for two; among is for three or more.'},
  {id:'prepAgreement',name:'Subject-verb agreement with prepositional phrases',lesson:'The subject of a sentence is never inside a prepositional phrase. Cross out the phrase and the subject is easy to see: The box (of crayons) is on the desk. The leaders (of the club) are here. One (of my friends) has a snake. Then make the verb agree with the subject, not with the noun closest to it.'},
  {id:'prepOrAdverb',name:'⭐ Challenge: Preposition or adverb?',lesson:'Some words, like up, down, inside, around, over, and before, can be prepositions or adverbs. If the word has an object after it, it is a preposition: She ran up the stairs. If it stands alone, it is an adverb: She looked up.'},
  {id:'meetInterjection',name:'Meet the interjection',lesson:'An interjection is a word or short phrase that shows a feeling: wow, oops, ouch, hooray, yikes, phew, ugh, hmm, oh, well, hey, shh. It isn’t connected to the grammar of the rest of the sentence, so you could take it out and the sentence would still work.'},
  {id:'interjectionPunct',name:'Punctuating interjections',lesson:'A strong feeling gets an exclamation point, and the interjection stands alone; the next word starts a new sentence with a capital letter: Ouch! That hurts. A mild feeling gets a comma and joins the sentence: Well, I guess so. Oh, I forgot my lunch. An interjection in the middle of a sentence gets commas on both sides: I think, um, it’s seven.'},
  {id:'prepInterjMix',name:'Prepositions and interjections: mixed practice',lesson:'Put it all together: find prepositions and their phrases, pick the one that fits, keep subjects and verbs in agreement, and choose and punctuate interjections.'}
];
const ENGLISH_GROUPS5 = [
  {id:'prepositions',quizName:'Prepositions Quiz',name:'Prepositions and prepositional phrases',learn:'Find prepositions and their objects, use prepositional phrases, choose the preposition that fits, and keep subjects and verbs in agreement when a phrase gets in the way.',skills:['meetPreposition','prepPhrases','prepPurpose','prepAgreement','prepOrAdverb'],
    extraLessons:[{name:'Building knowledge: the words in this unit',lesson:'A quick glossary: preposition, object of the preposition, prepositional phrase, interjection.',url:'https://www.khanacademy.org/ela/5th-and-6th-grade-grammar/x90cef5375e9bcad6:prepositions-and-interjections-5/x90cef5375e9bcad6:prepositions-and-interjections-building-knowledge-5/a/glossary-prepositions-and-interjections-5'}]},
  {id:'interjections',quizName:'Interjections and mixed practice Quiz',name:'Interjections',learn:'Find and use interjections, punctuate them for strong and mild feelings, and mix everything from this unit.',skills:['meetInterjection','interjectionPunct','prepInterjMix']}
];
const PREPOSITION_QUESTIONS = {
  meetPreposition:[
    qLevel(1,"Which word is a preposition? The cat slept under the porch.","under","cat","slept","porch"),
    qLevel(1,"Which word is a preposition? We walked to the library.","to","walked","We","library"),
    qLevel(1,"Which of these words is a preposition?","beneath","quickly","happy","jump"),
    qLevel(1,"Which word is a preposition? Grandma baked cookies for us.","for","baked","cookies","Grandma"),
    qLevel(2,"Which word is a preposition? The dog behind the fence barked loudly.","behind","fence","barked","loudly"),
    qLevel(2,"How many prepositions are in this sentence? After dinner, we walked across the field to the pond.","Three","Two","One","Four"),
    qLevel(2,"Which word is NOT a preposition?","quietly","among","during","toward"),
    qLevel(2,"Which word is a preposition? Nobody except Maya finished the puzzle.","except","Nobody","finished","puzzle"),
    qLevel(2,"Which is a preposition made of more than one word?","in front of","ran far away","very soon now","and then some"),
    qLevel(3,"Which word is a preposition? Since the storm, the road has been closed.","Since","storm","road","closed"),
    qLevel(3,"Which word is used as a preposition? The puppy spun like a top.","like","spun","puppy","top"),
    qLevel(3,"Which word is a preposition? Everyone but Leo wanted pizza.","but","Everyone","wanted","pizza"),
    qLevel(3,"In which sentence is “before” a preposition?","We ate before the movie.","I have seen that movie before.","Before you go, call me.","She had left long before.")
  ],
  prepPhrases:[
    qLevel(1,"Which words make up the prepositional phrase? The bird sat on the fence.","on the fence","The bird sat","bird sat on the","sat on the"),
    qLevel(1,"What is the object of the preposition? She hid the gift under the bed.","bed","under","gift","She"),
    qLevel(1,"Which group of words is a prepositional phrase?","across the river","ran very quickly","the tall tree","she laughed"),
    qLevel(2,"Which prepositional phrase is in this sentence? The boy with the red hat won the race.","with the red hat","won the big race","The boy with the","the red hat won the"),
    qLevel(2,"Which word does the prepositional phrase describe? The house on the corner is painted blue.","house","corner","painted","blue"),
    qLevel(2,"What does the prepositional phrase tell? We played soccer after school.","When we played","Which soccer ball","Who played","What we played"),
    qLevel(2,"How many prepositional phrases are in this sentence? The keys to the car are in the drawer by the sink.","Three","Two","One","Four"),
    qLevel(2,"Which sentence has a prepositional phrase that tells where?","The kite flew over the trees.","The kite flew high yesterday.","The kite was bright red and blue.","Our kite is the best one here."),
    qLevel(3,"Which sentence uses a prepositional phrase like an adjective?","The girl in the blue coat waved.","The girl waved in the cold rain.","The girl waved at noon today.","The girl waved with both of her hands."),
    qLevel(3,"Which sentence adds a prepositional phrase to “The puppy slept”?","The puppy slept by the fire.","The tired little puppy slept.","The puppy slept very soundly.","The puppy slept and snored loudly."),
    qLevel(3,"What is the object of the preposition “for”? The tickets for my sister and me are on the table.","my sister and me","The tickets for my","the table","are on the table"),
    qLevel(3,"Which pronoun correctly finishes the phrase? The secret stays between you and ___.","me","I","myself","mine")
  ],
  prepPurpose:[
    qLevel(1,"Which preposition tells WHEN? We will leave ___ lunch.","after","under","beside","across"),
    qLevel(1,"Which preposition tells WHERE? The shoes are ___ the bed.","under","during","until","since"),
    qLevel(1,"Which preposition shows DIRECTION? The ball rolled ___ the street.","across","during","of","since"),
    qLevel(2,"What does the preposition show? We cut the paper with scissors.","How it was done","When it was done","Where it was done","Which direction it went"),
    qLevel(2,"Choose the best prepositions: The library is open ___ 9:00 a.m. ___ 5:00 p.m.","from … to","in … on","at … under","by … over"),
    qLevel(2,"Which sentence uses the right preposition of time?","My birthday is in May.","My birthday is at May.","My birthday is on May.","My birthday is by May."),
    qLevel(2,"Choose the best preposition: I have lived here ___ 2020.","since","for","during","until"),
    qLevel(2,"Choose the best preposition: I have lived here ___ three years.","for","since","at","among"),
    qLevel(3,"Which sentence means the cat is INSIDE the box?","The cat is in the box.","The cat is on the box.","The cat is by the box.","The cat is near the box."),
    qLevel(3,"Choose the best preposition: Share the snacks ___ all five of your friends.","among","between","beside","onto"),
    qLevel(3,"Choose the best preposition: The diver jumped ___ the pool.","into","at","among","until"),
    qLevel(3,"Which sentence shows that Kai did NOT bring his dog?","Kai came without his dog.","Kai came along with his dog.","Kai came over near his dog.","Kai came behind his dog.")
  ],
  prepAgreement:[
    qLevel(1,"Choose the verb: The box of crayons ___ on the desk.","is","are","were"),
    qLevel(1,"Choose the verb: The leaves on the tree ___ turning red.","are","is","was"),
    qLevel(1,"What is the subject of this sentence? The cookies in the jar smell delicious.","cookies","jar","smell","delicious"),
    qLevel(2,"Choose the verb: The sound of the drums ___ loud.","is","are","were"),
    qLevel(2,"Choose the verb: The players on the team ___ excited.","are","is","was"),
    qLevel(2,"Which sentence is correct?","The bag of apples is heavy.","The bag of apples are heavy.","The bags of apples is heavy.","The bag of apples were heavy."),
    qLevel(2,"Choose the verb: A basket with three kittens ___ by the door.","sits","sit","are sitting"),
    qLevel(2,"Which words should you cross out to find the subject? The flowers in Grandma’s garden need water.","in Grandma’s garden","The flowers in Grandma’s","need water every day","flowers in Grandma’s"),
    qLevel(3,"Choose the verb: One of my friends ___ a pet snake.","has","have","are having"),
    qLevel(3,"Choose the verb: Each of the students ___ a locker.","has","have","are getting"),
    qLevel(3,"Which sentence is correct?","The list of chores is on the fridge.","The list of chores are on the fridge.","The lists of chores is on the fridge.","The list of chore are on the fridge."),
    qLevel(3,"Choose the verb: The pictures on the wall of my bedroom ___ crooked.","are","is","was"),
    qLevel(3,"Find the mistake: The noise from the trucks outside keep waking the baby.","keep should be keeps","noise should be noises","trucks should be truck","waking should be wakes")
  ],
  prepOrAdverb:[
    qLevel(1,"What comes after a preposition?","A noun or pronoun, its object","Nothing at all, ever","A verb that ends in the letters -ly","An exclamation point or comma"),
    qLevel(1,"In which sentence is “up” a preposition?","She ran up the hill.","She looked up at once.","Hurry up, please!","The sun is already up."),
    qLevel(2,"What is “inside” in this sentence? The kids played inside.","An adverb, because it has no object","A preposition, because it has an object","An interjection, because it shows feeling","A noun, because it names a place"),
    qLevel(2,"What is “around” in this sentence? We walked around the lake.","A preposition, because “the lake” is its object","An adverb, because it tells us where they walked","An adverb, because no noun or pronoun follows it","A preposition, because it is a short little word"),
    qLevel(2,"In which sentence is “down” an adverb?","The kite came down.","She skied down the slope.","Rain ran down the window.","We walked down the street."),
    qLevel(2,"Which sentence uses “below” as a preposition?","The fish swam below the boat.","The fish swam below.","See the chart below.","From below, we heard a splash."),
    qLevel(3,"Which “over” is a preposition? We climbed over the wall and fell over.","The first one","The second one","Both of them","Neither of them"),
    qLevel(3,"In which sentence is “before” an adverb?","I have been here before.","I arrived before noon.","Wash up before dinner.","She stood before the crowd."),
    qLevel(3,"Which test tells you a word is a preposition?","It has a noun or pronoun object","It ends in the letters -ly","It describes a verb in the sentence","It starts the sentence with a capital"),
    qLevel(3,"Which sentence uses “across” as a preposition?","We swam across the lake.","We swam across.","He walked across to say hi.","Come across when you are ready.")
  ],
  meetInterjection:[
    qLevel(1,"Which word is an interjection? Wow! That fireworks show was amazing.","Wow","show","amazing","That"),
    qLevel(1,"Which word is an interjection? Oops, I spilled the milk.","Oops","spilled","milk","I"),
    qLevel(1,"Which of these is an interjection?","Hooray","happy","above","slowly"),
    qLevel(1,"What does an interjection show?","A feeling","A place","An action","A time"),
    qLevel(2,"Which interjection fits? ___! I stubbed my toe.","Ouch","Hooray","Hmm","Shh"),
    qLevel(2,"Which interjection fits? ___, the baby is sleeping.","Shh","Hooray","Yikes","Bravo"),
    qLevel(2,"Which interjection fits? ___! We won the championship!","Hooray","Ugh","Oops","Hmm"),
    qLevel(2,"Which interjection usually shows thinking?","Hmm","Yikes","Hooray","Ouch"),
    qLevel(2,"Which sentence has an interjection?","Phew, that test was hard.","That test was really hard.","The test was very, very hard.","Was the test hard for you?"),
    qLevel(3,"Which word is an interjection? Well, I think we should go home.","Well","think","should","home"),
    qLevel(3,"In which sentence is “well” an interjection?","Well, I suppose you can come.","She sings very well on stage.","I feel well today, thank you.","Water came up from the old well."),
    qLevel(3,"Where can “oh” go so it works as an interjection?","Oh, I forgot my coat.","I oh forgot my winter coat.","I forgot oh my winter coat.","My coat oh I forgot it."),
    qLevel(3,"Why is “Ugh” an interjection in “Ugh! The bus is late again.”?","It shows annoyance and stands apart","It names the bus that is late again","It tells when the late bus finally came","It is the subject of the sentence")
  ],
  interjectionPunct:[
    qLevel(1,"Which is punctuated correctly for a strong feeling?","Yikes! A spider!","Yikes, a spider.","Yikes a spider.","Yikes. a spider"),
    qLevel(1,"Which is punctuated correctly for a mild feeling?","Oh, that’s nice.","Oh! that’s nice.","Oh that’s, nice.","Oh. That’s, nice."),
    qLevel(2,"What punctuation usually follows a mild interjection at the start of a sentence?","A comma","A period","A question mark","A colon"),
    qLevel(2,"Which sentence is punctuated correctly?","Hooray! We’re going to the beach.","Hooray we’re going to the beach.","Hooray, we’re going! to the beach.","Hooray. we’re going to the beach."),
    qLevel(2,"Which sentence is punctuated correctly?","Well, we could try again.","Well we could try again.","Well! we could try again.","Well, we could, try again."),
    qLevel(2,"Which shows the STRONGEST feeling?","Wow! Look at that!","Wow, look at that.","Look at that, wow.","Look at that."),
    qLevel(2,"After an interjection with an exclamation point, how does the next word start?","With a capital letter","With a lowercase letter","With a comma","With a number"),
    qLevel(3,"Which sentence is punctuated correctly?","Oh no! I left my homework at home.","Oh no, I left! my homework at home.","Oh! no I left my homework at home.","Oh no. i left my homework at home."),
    qLevel(3,"Where does the comma go? Hey you dropped your glove.","After “Hey”","After “you”","After “dropped”","After “your”"),
    qLevel(3,"Which sentence is punctuated correctly?","Ah, so that’s how it works.","Ah so, that’s how it works.","Ah! so that’s how it works.","Ah so that’s how, it works."),
    qLevel(3,"Which sentence is punctuated correctly?","I think, um, the answer is seven.","I think um, the answer is seven.","I think, um the answer is seven.","I think um the answer, is seven, okay.")
  ],
  prepInterjMix:[
    qLevel(1,"Which word is a preposition? Yay, we are going to the zoo!","to","Yay","going","zoo"),
    qLevel(2,"Which word is the interjection, and which is the preposition? Hey! The ball is under the car.","Hey is the interjection; under is the preposition","under is the interjection; Hey is the preposition","ball is the interjection; car is the preposition","The is the interjection; is is the preposition"),
    qLevel(2,"Which sentence has both a prepositional phrase and an interjection?","Whoa, look at the eagle above the lake!","Look at that eagle over there, everyone.","The eagle flew away quickly and quietly.","Whoa, that eagle is huge and very fast!"),
    qLevel(2,"Choose the verb: Wow, the stack of books ___ taller than me!","is","are","were"),
    qLevel(2,"Which choice is a prepositional phrase?","through the tunnel","Hooray, we made it","ran fast and far","the long dark tunnel"),
    qLevel(2,"Which word is an interjection? Hmm, which path goes around the mountain?","Hmm","around","path","mountain"),
    qLevel(3,"Which preposition tells WHEN? Oops, I fell asleep during the movie on the couch.","during","on","Oops","asleep"),
    qLevel(3,"Which sentence is correct?","Phew, the box of old toys is finally packed.","Phew the box of old toys are finally packed.","Phew, the box of old toys are finally packed.","Phew! the box of old toys is finally packed."),
    qLevel(3,"How many prepositional phrases? Hooray, the parade marched down Main Street, past the bakery, and into the park!","Three","Two","Four","One"),
    qLevel(3,"Which sentence uses “like” as a preposition?","She sings like a bird.","I like apples a whole lot.","Like, I don’t really know.","We like to swim in summer.")
  ]
};
// English Unit 6: Punctuation: end-of-sentence punctuation, the comma, and the apostrophe (Khan Academy Grammar). The Punctuation Library.
// Docs: docs/ENGLISH-UNIT6.md
const ENGLISH_UNIT6 = [
  {id:'endMarks',name:'Three ways to end a sentence',lesson:'Every sentence ends with one end mark. A statement (it tells something) and a command (it tells someone to do something) end with a period. A question ends with a question mark. A sentence that shows strong feeling, like surprise or alarm, ends with an exclamation point. A sentence that only reports a question, like “She asked if I was hungry,” is a statement, so it ends with a period.'},
  {id:'meetComma',name:'Meet the comma',lesson:'A comma marks a small pause inside a sentence and keeps words that belong apart from running together. Commas separate items in a list, come after an introduction, set off the name of someone you are talking to, and join two complete sentences when a joining word like and, but, or so comes after the comma. A comma never ends a sentence, and it never goes between a subject and its verb.'},
  {id:'listCommas',name:'Punctuating lists',lesson:'Put a comma after each item in a list of three or more: We packed apples, cheese, and crackers. Pet World uses a comma before the last and (the serial or Oxford comma), because it can keep the meaning clear; some writers leave it out. A list of only two items gets no comma: apples and cheese. Adjectives that each describe the noun on their own get commas too: a long, cold, rainy day.'},
  {id:'letterCommas',name:'Salutations, valedictions, dates, and addresses',lesson:'A friendly letter opens with a greeting (salutation) followed by a comma: Dear Grandpa, and closes with a sign-off (valediction) followed by a comma (Love, or Sincerely,). A date gets a comma between the day and the year (May 4, 2026), and another comma after the year when the sentence keeps going. A place gets a comma between the city and the state (Austin, Texas), and another after the state when the sentence keeps going. No comma goes between a month and a year alone (May 2026) or between a state and a ZIP code.'},
  {id:'introCommas',name:'Commas and introductory elements',lesson:'When a sentence starts with an introduction before the main part, put a comma after the introduction. It can be a word (However, Finally, Yes), a phrase (After the long game, To get ready for the trip), or a clause, a part with its own subject and verb that can’t stand alone (When the bell rang, Because it rained). The comma shows where the introduction ends and the main sentence begins.'},
  {id:'dialogueCommas',name:'Commas in dialogue, tag questions, direct address, and yes-or-no responses',lesson:'In dialogue, a comma separates the speaker tag from the quotation: Mia said, “Let’s go.” or “Let’s go,” Mia said. (A question mark or exclamation point inside the quotation replaces the comma.) A tag question at the end gets a comma: You’re coming, aren’t you? Use commas to set off the name of someone you are talking to (Leo, come here. Thanks, Mom.) and words like yes, no, and well at the start of an answer (Yes, I finished.).'},
  {id:'appositives',name:'Appositives',lesson:'An appositive is a noun or noun phrase right next to another noun that renames it: My dog, a lazy beagle, sleeps all day. When the appositive just adds extra information, set it off with commas on both sides (or one comma if it ends the sentence). When it is needed to tell which one you mean, use no commas: my friend Ava (when you have more than one friend), the poet Langston Hughes.'},
  {id:'meetApostrophe',name:'Meet the apostrophe',lesson:'The apostrophe (’) has two main jobs. It stands in for missing letters in a contraction (do not → don’t), and it shows that something belongs to someone (the cat’s bowl). An apostrophe almost never makes a word plural: one dog, two dogs, with no apostrophe.'},
  {id:'contractions',name:'Introduction to contractions',lesson:'A contraction squeezes two words into one, and the apostrophe goes exactly where letters were taken out: is not → isn’t, I am → I’m, they are → they’re, we will → we’ll, you have → you’ve. A few are unusual: will not → won’t, cannot → can’t. Contractions sound friendly, so formal writing often spells both words out.'},
  {id:'apostrophePlurals',name:'Apostrophes and plurals',lesson:'To make most nouns plural, add -s or -es, with no apostrophe: two cats, three boxes, the Lopezes, the 1990s. An apostrophe before the s shows that something belongs to someone, not that there is more than one. Before you write ’s, ask: Does something belong to it? If not, leave the apostrophe out.'},
  {id:'possessive',name:'Introduction to the possessive',lesson:'To show that something belongs to one person or thing, add an apostrophe and s: the girl’s coat, the dog’s leash, Ben’s idea. Read it as “the coat of the girl.” Possessive pronouns like his, hers, its, ours, yours, theirs, and whose never take an apostrophe.'},
  {id:'pluralPossessive',name:'Advanced (plural) possession',lesson:'For a plural noun that already ends in s, add only an apostrophe after the s: the girls’ team (more than one girl), the birds’ nests. For a plural that doesn’t end in s, add apostrophe and s: the children’s books, the people’s choice, the mice’s cheese. To decide, write the plural first, then add the possessive. When two people share one thing, only the second name gets ’s: Mia and Leo’s project.'},
  {id:'itsVsIts',name:'Choosing between its and it’s',lesson:'It’s always means it is or it has: It’s raining. It’s been a long day. Its, with no apostrophe, means belonging to it, like his or her: The dog wagged its tail. Test it: if you can say “it is” or “it has” in its place, write it’s; if not, write its.'}
];
const ENGLISH_GROUPS6 = [
  {id:'endCommas',hook:{emoji:'🏭',title:'Welcome to the Superhero Factory',story:'Every hero in this factory is built from a sentence, and punctuation is the power source. One missing comma, and Captain Comet invites Grandma to dinner... or tries to eat her. Your job: install the right marks so every hero does exactly what the city needs.'},quizName:'End marks and commas Quiz',name:'End marks, the comma, and lists',learn:'End sentences with the right mark, learn what commas do, and punctuate lists.',skills:['endMarks','meetComma','listCommas']},
  {id:'spaceTime',hook:{emoji:'📬',title:'The hero mail room',story:'Fan letters pour into the factory every day, and the robots that sort them read every comma. Write May 4 2026 with no commas, and a robot counts 42,026 heroes. Write “When the robot sneezed the factory shook,” and a reader thinks the robot sneezed the whole factory.'},quizName:'Commas in space and time Quiz',name:'Commas in space and time',learn:'Use commas in letters, dates, and addresses, and after introductory words, phrases, and clauses.',skills:['letterCommas','introCommas']},
  {id:'moreCommas',hook:{emoji:'🎙️',title:'Who said that?',story:'“The hero said the villain is a genius.” Add two commas, “The hero, said the villain, is a genius,” and now the villain is the one talking. In this block, commas decide who is speaking, who is being spoken to, and how many sidekicks a hero has.'},quizName:'More ways to use commas Quiz',name:'More ways to use commas',learn:'Use commas in dialogue, tag questions, direct address, yes-or-no answers, and around appositives.',skills:['dialogueCommas','appositives']},
  {id:'apostrophes',hook:{emoji:'🧷',title:'The missing-letter patch',story:'When the factory squeezes two words into one, “we are” into “we’re,” the apostrophe patches the spot where letters were cut out. Put a patch where nothing is missing, “Two Hero’s Wanted,” and the sign stops making sense.'},quizName:'Apostrophes and contractions Quiz',name:'Apostrophes and contractions',learn:'Learn what apostrophes do, write contractions, and keep apostrophes out of plurals.',skills:['meetApostrophe','contractions','apostrophePlurals']},
  {id:'possessive',hook:{emoji:'🛡️',title:'Whose cape is it?',story:'The hero’s capes belong to one hero. The heroes’ capes belong to the whole team. One little mark tells the factory who owns what, and its and it’s decide whether the robot is wagging its tail or saying it’s happy.'},quizName:'Possessives Quiz',name:'The possessive, and its versus it’s',learn:'Show who owns something with singular and plural possessives, and choose between its and it’s.',skills:['possessive','pluralPossessive','itsVsIts'],
    extraLessons:[{name:'Its versus it’s (video)',lesson:'A short video on choosing between its and it’s.',url:'https://www.khanacademy.org/humanities/grammar/punctuation-the-comma-and-the-apostrophe/its-vs-its/v/choosing-between-its-and-its-the-apostrophe-punctuation-khan-academy'}]}
];
const PUNCTUATION_QUESTIONS = {
  endMarks:[
    qLevel(1,"Which end mark belongs at the end? Where did you put my sneakers___","?",".","!",","),
    qLevel(1,"Which sentence is punctuated correctly?","Our class is going to the zoo on Friday.","Our class is going to the zoo on Friday?","Our class is going to the zoo on Friday,","Our class is going, to the zoo on Friday."),
    qLevel(1,"Which end mark shows strong feeling?","An exclamation point","A period at the very end","A question mark","A comma"),
    qLevel(1,"Which sentence is a question?","Have you ever seen a shooting star?","I have never seen a shooting star.","What a bright shooting star that was!","Look at that shooting star over there."),
    qLevel(2,"Which sentence should end with a question mark?","Can you hand me the glue","Please hand me the glue","I wonder where the glue went","Hand me the glue right now"),
    qLevel(2,"What kind of sentence is this, and how should it end? Close the door, please","A command, so it ends with a period","A question, so it ends with a question mark","A statement, so it ends with a question mark","An exclamation, so it ends with a comma"),
    qLevel(2,"Choose the end mark that shows the speaker is shouting with excitement: We won the championship___","!","?",",",":"),
    qLevel(2,"Which sentence uses its end mark correctly?","Watch out for that bike!","What time does the bus leave!","Did you remember your lunch.","Is this seat taken."),
    qLevel(2,"What kind of sentence ends with a period?","A statement that tells something","A question that asks something","A sentence that asks for an answer","A sentence that shows great surprise"),
    qLevel(3,"Which sentence is punctuated correctly?","Maya asked whether the pool was open.","Maya asked whether the pool was open?","Maya asked, whether the pool was open?","Maya asked whether the pool, was open."),
    qLevel(3,"Which sentence should end with a period?","I wonder if it will snow tonight","Will it snow tonight","Do you think it will snow tonight","Is it going to snow tonight"),
    qLevel(3,"Which end mark should finish this sentence? Sam wanted to know who ate the last slice of pie___",".","?","!",","),
    qLevel(3,"Which sentence has the wrong end mark?","Please sit in the front row?","Are you sitting in the front row?","I sat in the front row with Kai.","Wow, the front row is so close!"),
    qLevel(3,"Which sentence is punctuated correctly?","Did you hear that loud noise?","Did you hear that loud noise?.","Did you hear that loud noise.?","Did you hear, that loud noise?")
  ],
  meetComma:[
    qLevel(1,"What does a comma usually show?","A short pause inside a sentence","The very end of a sentence","That a question is being asked of someone","That letters are missing"),
    qLevel(1,"Which sentence uses a comma correctly?","After lunch, we played tag.","After lunch we, played tag.","After, lunch we played tag.","After lunch we played, tag."),
    qLevel(1,"Which is a comma?",",",".","’","?"),
    qLevel(2,"Which sentence uses a comma to join two complete sentences correctly?","I wanted to swim, but the pool was closed.","I wanted to swim but, the pool was closed.","I wanted, to swim but the pool was closed.","I wanted to swim but the pool, was closed."),
    qLevel(2,"Where does the comma belong? Kai can you help me carry this box?","After “Kai”","After “help”","After “carry”","After “this”"),
    qLevel(2,"Which sentence has a comma that should NOT be there?","My little brother, likes trains.","My little brother likes trains, buses, and boats.","Yes, my little brother likes trains.","My little brother likes trains, and I like boats."),
    qLevel(2,"Why does this sentence need a comma? “Let’s eat Grandma” should be “Let’s eat, Grandma.”","The comma shows we are talking to Grandma, not about eating her.","The comma shows that the sentence is a question.","The comma shows that the word “eat” is a noun.","The comma shows that some letters are missing from the word Grandma."),
    qLevel(2,"Which sentence uses a comma correctly?","Yes, I fed the fish.","Yes I fed, the fish.","Yes I, fed the fish.","Yes I fed the fish,"),
    qLevel(3,"Which sentence is punctuated correctly?","The sky turned dark, so we went inside.","The sky turned dark so, we went inside.","The sky, turned dark so we went inside.","The sky turned dark, so, we went inside."),
    qLevel(3,"Which sentence shows a comma between a subject and its verb, which is a mistake?","The girl in the yellow raincoat, waved to us.","The girl waved to us, and then we both waved back.","Waving to us, the girl smiled.","The girl, my cousin, waved to us."),
    qLevel(3,"Which sentence needs a comma?","We can play outside or we can bake cookies.","We can play outside or bake some cookies.","We played outside and then baked cookies together.","We played outside until dinner."),
    qLevel(3,"Which sentence uses a comma in place of an end mark, which is a mistake?","The bus was late, we walked to school.","The bus was late, so we walked to school.","Because the bus was late, we walked to school.","The bus was late; we walked to school."),
    qLevel(3,"How many commas does this sentence need? Mom I packed snacks and water.","One","Two","Three","None")
  ],
  listCommas:[
    qLevel(1,"Which sentence punctuates the list correctly?","We saw lions, zebras, and giraffes.","We saw lions zebras and giraffes.","We saw, lions, zebras, and giraffes.","We saw lions, zebras and, giraffes."),
    qLevel(1,"How many items are in this list? I need flour, sugar, eggs, and butter.","Four","Three","Two","Five"),
    qLevel(1,"Which list of two items is punctuated correctly?","I ordered a sandwich and a salad.","I ordered a sandwich, and a salad.","I ordered, a sandwich and a salad.","I ordered a sandwich and, a salad."),
    qLevel(2,"Which sentence is punctuated correctly?","My favorite colors are red, orange, and purple.","My favorite colors are red, orange, and, purple.","My favorite colors are, red, orange, and purple.","My favorite colors, are red orange and purple."),
    qLevel(2,"Where are commas needed? Pack a toothbrush pajamas and a pillow.","After “toothbrush” and after “pajamas”","After “Pack” and after “toothbrush” and “a”","After “pajamas” and after “and”","After “a” and after “pajamas”"),
    qLevel(2,"Which sentence punctuates a list of actions correctly?","She jumped, spun, and landed on her feet.","She jumped spun, and landed, on her feet.","She jumped, spun and, landed on her feet.","She, jumped, spun, and landed on her feet."),
    qLevel(2,"What is the comma before the last “and” in a list called?","The serial (Oxford) comma","The ending comma","The question comma","The apostrophe-and-list comma"),
    qLevel(2,"Which sentence uses commas between describing words correctly?","It was a long, cold, rainy day.","It was a long cold, rainy, day.","It was, a long, cold, rainy day.","It was a long, cold, rainy, day."),
    qLevel(3,"Why can a comma before the last “and” help? I thank my parents, Ms. Lee, and Coach Ray.","It shows these are three separate people, not that Ms. Lee and Coach Ray are my parents.","It shows that Coach Ray is the most important and most honored person in the whole list.","It shows that the sentence is really a question.","It shows that Ms. Lee and Coach Ray belong to my parents."),
    qLevel(3,"Which sentence is punctuated correctly?","For lunch we had soup, grilled cheese, and peanut butter and jelly.","For lunch we had soup, grilled cheese, and peanut butter, and jelly.","For lunch we had soup grilled, cheese, and peanut butter and jelly.","For lunch, we had, soup, grilled cheese, and peanut butter and jelly."),
    qLevel(3,"Which sentence needs NO commas?","Leo and Ava painted the fence.","Leo Ava and Max painted the fence.","Leo painted Ava sanded and Max cleaned up.","We bought nails screws and glue."),
    qLevel(3,"Which sentence lists three places correctly?","This summer we visited Boston, New York, and Washington.","This summer we visited Boston, New, York, and Washington.","This summer we visited, Boston, New York and, Washington.","This summer, we visited Boston New York and Washington."),
    qLevel(3,"Which sentence is NOT punctuated correctly?","I like to read, draw and, swim.","I like to read, draw, and swim.","I like to read and swim.","I like reading, drawing, and swimming.")
  ],
  letterCommas:[
    qLevel(1,"Which greeting for a friendly letter is punctuated correctly?","Dear Aunt Rosa,","Dear, Aunt Rosa","Dear Aunt, Rosa","Dear Aunt Rosa."),
    qLevel(1,"Which closing for a letter is punctuated correctly?","Your friend,","Your, friend","Your friend.","Your, friend,"),
    qLevel(1,"Which date is written correctly?","June 12, 2026","June, 12 2026","June 12 2026,","June, 12, 2026"),
    qLevel(1,"Which place is written correctly?","Denver, Colorado","Denver Colorado,","Denver, Colorado,,","Den, ver Colorado"),
    qLevel(2,"Which sentence is punctuated correctly?","On July 4, 1776, the colonies declared independence.","On July 4 1776, the colonies declared independence.","On July, 4, 1776 the colonies declared independence.","On July 4, 1776 the colonies, declared independence."),
    qLevel(2,"Which sentence is punctuated correctly?","My cousin moved to Tulsa, Oklahoma, last spring.","My cousin moved to Tulsa Oklahoma, last spring.","My cousin moved to Tulsa, Oklahoma last spring.","My cousin moved, to Tulsa, Oklahoma, last spring."),
    qLevel(2,"Which date needs NO comma?","March 2027","March 3 2027","Friday March 3","Friday March 3 2027"),
    qLevel(2,"Which closing is punctuated correctly?","Love,","Love.","Love:","Love;"),
    qLevel(2,"Which address line is written correctly?","Miami, FL 33101","Miami FL, 33101","Miami, FL, 33101","Miami FL 33101,"),
    qLevel(3,"Which sentence is punctuated correctly?","Grandpa was born on Monday, May 2, 1960, in Ohio.","Grandpa was born on Monday May 2, 1960, in Ohio.","Grandpa was born on Monday, May 2 1960 in Ohio.","Grandpa was born, on Monday, May, 2, 1960, in Ohio."),
    qLevel(3,"Which sentence is punctuated correctly?","Paris, France, is famous for its bakeries.","Paris France, is famous for its bakeries.","Paris, France is famous for its bakeries.","Paris, France, is famous, for its bakeries."),
    qLevel(3,"Which sentence uses commas correctly?","In August 2025, we moved to a new house.","In August, 2025, we moved to a new house.","In, August 2025 we moved to a new house.","In August 2025 we, moved to a new house."),
    qLevel(3,"Which sentence is punctuated correctly?","We drove from Reno, Nevada, to Boise, Idaho.","We drove from Reno Nevada, to Boise Idaho.","We drove from Reno, Nevada to Boise, Idaho.","We drove, from Reno, Nevada, to Boise, Idaho,"),
    qLevel(3,"Which letter is punctuated correctly from greeting to closing?","Dear Coach Kim, Thank you for a great season! Your player, Jada","Dear Coach Kim. Thank you for a great season! Your player. Jada","Dear, Coach Kim Thank you for a great season! Your player Jada","Dear Coach Kim Thank you for a great season, Your player, Jada")
  ],
  introCommas:[
    qLevel(1,"Which sentence uses a comma after an introductory word?","Finally, the rain stopped.","Finally the rain, stopped.","Finally the, rain stopped.","Finally the rain stopped,"),
    qLevel(1,"Where does the comma go? However the store was already closed.","After “However”","After “store”","After “was”","After “already”"),
    qLevel(1,"Which sentence is punctuated correctly?","After the long game, we ate pizza.","After the long game we, ate pizza.","After, the long game we ate pizza.","After the long, game we ate pizza."),
    qLevel(2,"Which sentence is punctuated correctly?","When the bell rang, everyone ran outside.","When the bell rang everyone, ran outside.","When, the bell rang everyone ran outside.","When the bell, rang everyone ran outside."),
    qLevel(2,"Which sentence needs a comma?","Because it was raining we stayed inside.","We stayed inside because it was raining.","We stayed inside all afternoon.","We stayed inside and played games."),
    qLevel(2,"What is the introductory part of this sentence? To get ready for the trip, Mom made a checklist.","To get ready for the trip","Mom made a checklist for it","made a checklist","for the trip, Mom made a"),
    qLevel(2,"Which sentence is punctuated correctly?","Excited about the news, Lena called her best friend.","Excited about the news Lena, called her best friend.","Excited, about the news Lena called her best friend.","Excited about the news, Lena called, her best friend."),
    qLevel(2,"Which word at the start of a sentence needs a comma after it?","Meanwhile","Dogs","Seven","Running"),
    qLevel(3,"Which sentence is punctuated correctly?","If you finish your homework early, we can go to the park.","If you finish your homework early we can, go to the park.","If you finish, your homework early we can go to the park.","If you finish your homework, early we can go to the park."),
    qLevel(3,"In which sentence is the comma missing after the introduction?","While the cake baked we cleaned the kitchen.","While the cake baked, we cleaned the kitchen.","We cleaned the kitchen while the cake baked.","The cake baked while we cleaned the kitchen."),
    qLevel(3,"Which sentence is punctuated correctly?","Without saying a word, Theo handed me the note.","Without saying a word Theo handed, me the note.","Without, saying a word Theo handed me the note.","Without saying a word, Theo handed me, the note."),
    qLevel(3,"Why does this sentence need a comma? “While we were eating the dog barked” becomes “While we were eating, the dog barked.”","Without it, a reader might think we were eating the dog.","Without it, the sentence would be a question.","Without it, the dog would become the subject of the word eating.","Without it, the sentence would have no verb."),
    qLevel(3,"Which sentence uses commas correctly?","After school on Tuesday, Kai and I built a fort.","After school on Tuesday Kai, and I built a fort.","After school, on Tuesday, Kai, and I built a fort.","After school on Tuesday Kai and I, built a fort.")
  ],
  dialogueCommas:[
    qLevel(1,"Which sentence uses a comma correctly with someone’s name?","Leo, please close the window.","Leo please, close the window.","Leo please close, the window.","Leo please close the window,"),
    qLevel(1,"Which answer is punctuated correctly?","No, I didn’t see your hat.","No I, didn’t see your hat.","No I didn’t see, your hat.","No I didn’t see your hat,"),
    qLevel(1,"Which sentence is punctuated correctly?","Mia said, “Let’s go to the park.”","Mia said “Let’s go, to the park.”","Mia, said “Let’s go to the park.”","Mia said “, Let’s go to the park.”"),
    qLevel(2,"Which sentence is punctuated correctly?","“I’m hungry,” said Theo.","“I’m hungry” said, Theo.","“I’m hungry.” said Theo.","“I’m, hungry” said Theo."),
    qLevel(2,"Which tag question is punctuated correctly?","You finished the book, didn’t you?","You finished the book didn’t, you?","You finished, the book didn’t you?","You finished the book didn’t you?,"),
    qLevel(2,"Which sentence uses commas correctly to talk to someone?","Thanks for the ride, Mrs. Diaz.","Thanks for the ride Mrs., Diaz.","Thanks, for the ride Mrs. Diaz.","Thanks for, the ride Mrs. Diaz."),
    qLevel(2,"Which sentence is punctuated correctly?","No, the library isn’t open today.","No the library, isn’t open today.","No the library isn’t, open today.","No the library isn’t open, today."),
    qLevel(2,"Which sentence is punctuated correctly?","“Can I come too?” asked Ruby.","“Can I come too?,” asked Ruby.","“Can I come too,” asked Ruby?","“Can I come too” asked, Ruby."),
    qLevel(3,"Which sentence needs commas on both sides of a name?","I think, Sam, that you’re right.","I think Sam is right about that.","Sam thinks that I’m right.","I told Sam that he was right."),
    qLevel(3,"Which sentence is punctuated correctly?","“If we hurry,” said Dad, “we can catch the early train.”","“If we hurry” said Dad “we can catch the early train.”","“If we hurry,” said Dad. “we can catch the early train.”","“If we hurry, said Dad, we can catch the early train.”"),
    qLevel(3,"Which sentence is punctuated correctly?","Well, I guess we can try again.","Well I guess, we can try again.","Well I guess we, can try again.","Well I, guess we can try again."),
    qLevel(3,"In which sentence is “Mom” the person being spoken to?","I’m ready to go, Mom.","My mom is ready to go.","Mom is ready, and so am I.","I told Mom I was ready."),
    qLevel(3,"Which sentence is punctuated correctly?","It’s cold outside, isn’t it?","It’s cold outside isn’t it.","It’s cold, outside isn’t it?","It’s cold outside, isn’t it.")
  ],
  appositives:[
    qLevel(1,"What is the appositive in this sentence? My dog, a lazy beagle, sleeps all day.","a lazy beagle","My dog","sleeps in the sun","My dog sleeps"),
    qLevel(1,"What does an appositive do?","It renames a noun right next to it.","It ends a sentence with strong feeling.","It joins two complete sentences.","It shows that something belongs to someone."),
    qLevel(1,"Which sentence uses commas around the appositive correctly?","Ms. Patel, our music teacher, plays the cello.","Ms. Patel our music teacher, plays the cello.","Ms. Patel, our music teacher plays the cello.","Ms. Patel our, music teacher, plays the cello."),
    qLevel(2,"Which sentence is punctuated correctly?","We visited Yellowstone, a famous national park.","We visited Yellowstone a famous national park.","We visited, Yellowstone, a famous national park.","We visited Yellowstone a famous, national park."),
    qLevel(2,"Which noun does the appositive rename? The pizza, a giant pepperoni pie, disappeared fast.","pizza","pie","pepperoni","fast"),
    qLevel(2,"Which sentence has an appositive?","Jupiter, the largest planet, has many moons.","Jupiter is a very large planet with many moons.","Jupiter has many moons and big storms.","Many moons circle Jupiter quickly."),
    qLevel(2,"Which sentence is punctuated correctly?","Our neighbor, a retired firefighter, fixed our fence.","Our neighbor a retired firefighter, fixed our fence.","Our neighbor, a retired, firefighter fixed our fence.","Our neighbor, a retired firefighter fixed, our fence."),
    qLevel(3,"Which sentence correctly uses NO commas because the appositive tells which one?","The author Roald Dahl wrote Matilda.","The author, Roald Dahl wrote Matilda.","The author Roald Dahl, wrote Matilda.","The, author Roald Dahl wrote Matilda."),
    qLevel(3,"Kai has only one sister. Which sentence is punctuated correctly?","Kai’s sister, Nora, plays soccer.","Kai’s sister Nora plays, soccer.","Kai’s sister Nora, plays on a soccer team.","Kai’s, sister Nora plays soccer."),
    qLevel(3,"Which sentence is punctuated correctly?","I lent my book, a mystery about a lost ring, to Theo.","I lent my book, a mystery about a lost ring to Theo.","I lent my book a mystery, about a lost ring, to Theo.","I lent my book a mystery about a lost ring, to Theo."),
    qLevel(3,"Which sentence uses an appositive at the start?","A talented artist, Ruby painted the whole mural.","Ruby painted the whole mural in less than a week.","Ruby, who loves art, painted the mural.","The mural that Ruby painted is huge."),
    qLevel(3,"Why does this sentence need commas? Mount Everest, the tallest mountain on Earth, is in Asia.","The appositive adds extra information about a mountain already named.","The appositive is needed to tell exactly which mountain we are talking about.","The appositive is the subject of the sentence.","The commas show that the mountain belongs to Earth."),
    qLevel(3,"You have only one best friend. Which sentence is punctuated correctly?","My best friend, Ava, lives next door.","My best friend Ava, lives next door.","My best friend, Ava lives, next door.","My, best friend Ava lives next door.")
  ],
  meetApostrophe:[
    qLevel(1,"Which mark is an apostrophe?","’",",",".","\""),
    qLevel(1,"What are the two main jobs of an apostrophe?","To show missing letters and to show that something belongs to someone","To end a sentence and to join two complete sentences together into one longer one","To make words plural and to show a question","To separate items in a list and set off a name"),
    qLevel(1,"In “don’t,” what does the apostrophe show?","Letters are missing","Something belongs to someone","There is more than one","The sentence is a question"),
    qLevel(1,"In “the cat’s bowl,” what does the apostrophe show?","The bowl belongs to the cat","There is more than one cat","Letters are missing from cat","The cat is a question"),
    qLevel(2,"Which sentence uses an apostrophe correctly?","The bird’s nest fell from the tree.","The bird’s flew south for the winter.","The birds’ is singing outside.","The bird flew to it’s nest."),
    qLevel(2,"Which sentence needs an apostrophe?","Kims dog has a red leash.","I have three dogs at home.","The dogs barked at the mail truck.","Two dogs ran across the yard."),
    qLevel(2,"Which word is a contraction?","can’t","cats","cats’","cast"),
    qLevel(2,"Which sentence has an apostrophe that should NOT be there?","I bought three apple’s at the store.","I bought my brother’s favorite apples.","I didn’t buy any apples today.","The apple’s skin was shiny and red."),
    qLevel(3,"What does the apostrophe show in each word? Sam’s / isn’t","Sam’s shows belonging; isn’t shows missing letters.","Both show that letters are missing.","Both show that something belongs to someone.","Sam’s shows missing letters; isn’t shows belonging."),
    qLevel(3,"Which sentence uses apostrophes correctly?","Mia’s bike isn’t in the garage.","Mias bike isnt in the garage.","Mia’s bike is’nt in the garage.","Mias’ bike isn’t in the garage."),
    qLevel(3,"Which sentence uses an apostrophe to show that letters are missing?","We’re going to the beach.","Jen’s towel is on the sand.","The waves’ sound is calm.","The beach’s sand is warm."),
    qLevel(3,"“Kim’s” can mean two different things. Which pair shows both meanings?","Kim’s coat (the coat of Kim) and Kim’s late (Kim is late)","Kim’s coat (two Kims) and Kim’s late (Kim was late)","Kim’s coat (Kim has a coat) and Kim’s late (the late of Kim)","Kim’s coat (Kim is coat) and Kim’s late (more than one Kim)"),
    qLevel(3,"Which word should NOT have an apostrophe?","Two pizza’s were delivered.","The pizza’s crust was crispy.","That pizza’s still warm.","Leo’s pizza had mushrooms.")
  ],
  contractions:[
    qLevel(1,"What is the contraction for “do not”?","don’t","do’nt","dont","d’ont"),
    qLevel(1,"What two words make the contraction “I’m”?","I am","I will","I have","I would"),
    qLevel(1,"What is the contraction for “they are”?","they’re","there","their","the’yre"),
    qLevel(1,"What two words make the contraction “we’ll”?","we will","we would","we all","well done"),
    qLevel(2,"Which contraction is spelled correctly?","shouldn’t","should’nt","shouldnt’","shoul’dnt"),
    qLevel(2,"What is the contraction for “will not”?","won’t","willn’t","wo’nt","willnt"),
    qLevel(2,"What two words make the contraction “you’ve”?","you have","you are","you will","you had"),
    qLevel(2,"Which sentence uses a contraction correctly?","She’s my best friend.","Shes’ my best friend.","She’is my best friend.","Sh’es my best friend."),
    qLevel(2,"Where does the apostrophe go in a contraction?","Where the letters were taken out","At the very end of the whole word","Right before the last letter","At the start of the second word"),
    qLevel(3,"“He’d” can stand for two different pairs of words. Which are they?","he had or he would","he did or he does","he dared or he dead","he and or he add"),
    qLevel(3,"Which sentence has a contraction spelled wrong?","They’re sure that it wasnt’ late.","I can’t find my other shoe anywhere.","We’ve already eaten lunch.","Who’s ready for the game?"),
    qLevel(3,"Which contraction means “let us”?","let’s","lets","let’us","le’ts"),
    qLevel(3,"What does “it’s” stand for in this sentence? It’s been raining all week.","it has","it is","it was","it will"),
    qLevel(3,"Which sentence would sound more formal in a report?","The volcano did not erupt last year.","The volcano didn’t erupt at all last year.","The volcano did’nt erupt last year.","The volcano didnt erupt last year.")
  ],
  apostrophePlurals:[
    qLevel(1,"Which sentence is correct?","I saw three rabbits in the garden.","I saw three rabbit’s in the garden.","I saw three rabbits’ in the garden.","I saw three rabbit in the garden."),
    qLevel(1,"How do you make most nouns plural?","Add -s or -es","Add an apostrophe and s","Add only an apostrophe","Add -ly"),
    qLevel(1,"Which word is a plural, meaning more than one?","boxes","box’s","boxe’s","boxs’"),
    qLevel(2,"Which sentence has an apostrophe that should NOT be there?","We ate taco’s for dinner.","We ate Dad’s tacos for dinner.","We didn’t eat tacos for dinner.","Our tacos were spicy."),
    qLevel(2,"Which sentence is correct?","The Garcias are coming to dinner.","The Garcia’s are coming to dinner.","The Garcias’ are coming to dinner.","The Garcia’s’ are coming to dinner."),
    qLevel(2,"Which sentence is correct?","My grandparents grew up in the 1960s.","My grandparents grew up in the 1960’s’.","My grandparent’s grew up in the 1960s.","My grandparents’ grew up in the 1960s."),
    qLevel(2,"Which question helps you decide if a word needs an apostrophe before the s?","Does something belong to it?","Is there more than one of it?","Is it at the end of the sentence?","Is it a long word?"),
    qLevel(2,"Which sentence is correct?","The puppies chased their tails.","The puppy’s chased their tails.","The puppies’ chased their tails.","The puppie’s chased their tails."),
    qLevel(3,"Which sign is punctuated correctly?","Fresh Peaches for Sale","Fresh Peache’s for Sale","Fresh Peaches’ for Sale","Fresh Peach’es for Sale"),
    qLevel(3,"Which sentence is correct?","Both of my brothers play the drums.","Both of my brother’s play the drums.","Both of my brothers’ play the drums.","Both of my brother’s’ play the drum’s."),
    qLevel(3,"Which sentence uses a plural AND a possessive correctly?","The teacher’s books are on the shelves.","The teacher’s book’s are on the shelves.","The teachers book’s are on the shelves.","The teacher’s books are on the shelve’s."),
    qLevel(3,"How many words in this sentence should be fixed? The kid’s ran to the swing’s after the bell’s rang.","Three","Two","One","None"),
    qLevel(3,"Which sentence is correct?","The Joneses have two cats.","The Jones’s have two cats.","The Jone’s have two cats.","The Joneses’ have two cat’s.")
  ],
  possessive:[
    qLevel(1,"Which phrase shows that the bike belongs to Sam?","Sam’s bike","Sams bike","Sams’ bike","Sam bike’s"),
    qLevel(1,"How do you show that something belongs to one person or thing?","Add an apostrophe and s","Add an s with no apostrophe","Add -es","Add a comma"),
    qLevel(1,"Which phrase means “the leash of the dog”?","the dog’s leash","the dogs leash","the dog leash’s","the dogs’s leash"),
    qLevel(2,"Which sentence is correct?","My sister’s room is painted green.","My sisters room is painted green.","My sister’s room’s is painted green.","My sisters’s room is painted green."),
    qLevel(2,"Which pronoun is spelled correctly?","hers","her’s","hers’","he’rs"),
    qLevel(2,"Which sentence is correct?","Is this backpack yours?","Is this backpack your’s?","Is this backpack yours’?","Is this backpack you’rs?"),
    qLevel(2,"Which phrase means “the roof of the house”?","the house’s roof","the houses roof","the house roof’s","the houses’s roof"),
    qLevel(2,"Which sentence is correct?","The teacher’s desk was covered in papers.","The teachers desk was covered in papers.","The teacher’s desk was covered in paper’s.","The teachers’s desk was covered in papers."),
    qLevel(3,"Which sentence is correct?","The decision is ours, not theirs.","The decision is our’s, not their’s.","The decision is ours’, not theirs’.","The decision is ours, not their’s."),
    qLevel(3,"Which sentence is correct?","The tree’s leaves turned red.","The trees leaves’ turned red.","The tree leave’s turned red.","The trees’s leaves turned red."),
    qLevel(3,"Rewrite using a possessive: the idea of my friend","my friend’s idea","my friends idea","my friend idea’s","my friends’s idea"),
    qLevel(3,"Which sentence is correct?","Whose jacket is this?","Who’s jacket is this?","Whos’ jacket is this?","Whose’ jacket is this?"),
    qLevel(3,"Which sentence uses a possessive noun correctly?","The baby’s smile made everyone laugh.","The babys smile made everyone laugh.","The baby smile’s made everyone laugh.","The babys’s smile made everyone laugh.")
  ],
  pluralPossessive:[
    qLevel(1,"Which phrase means “the toys of the two puppies”?","the puppies’ toys","the puppy’s toys","the puppies toys","the puppies’s toys"),
    qLevel(1,"How do you make a plural noun that ends in s possessive?","Add only an apostrophe after the s","Add an apostrophe and then another s","Add an apostrophe before the s","Add -es"),
    qLevel(1,"Which phrase is correct for books that belong to several children?","the children’s books","the childrens’ books","the childrens books","the children’ books"),
    qLevel(2,"Which sentence means more than one girl owns the team?","The girls’ team won the trophy.","The girl’s team won the trophy.","The girls team won the trophy.","The girls’s team won the trophy."),
    qLevel(2,"Which phrase is correct?","the people’s choice","the peoples’ choice","the peoples choice","the people choice’s"),
    qLevel(2,"Which phrase means “the nests of the birds”?","the birds’ nests","the bird’s nests","the birds nests’","the birds’s nests"),
    qLevel(2,"What should you write first when making a plural possessive?","The plural form of the noun","The possessive form of one","The word with an apostrophe","The word with a comma"),
    qLevel(2,"Which phrase is correct for cheese that belongs to many mice?","the mice’s cheese","the mices’ cheese","the mouses’ cheese","the mices cheese"),
    qLevel(3,"Mia and Leo built one project together. Which sentence is correct?","Mia and Leo’s project won first place.","Mia’s and Leo project won first place.","Mia and Leos’ project won first place.","Mias and Leos project won first place."),
    qLevel(3,"Mia and Leo each have their own bike. Which sentence is correct?","Mia’s and Leo’s bikes are both blue.","Mia and Leo’s bikes are both blue.","Mias and Leos bikes are both blue.","Mia’s and Leos’ bikes are both blue."),
    qLevel(3,"Which sentence is correct?","The teachers’ lounge is on the second floor.","The teachers lounge’s is on the second floor.","The teacher’s’ lounge is on the second floor.","The teacherses lounge is on the second floor."),
    qLevel(3,"Which sentence is correct?","All three classes’ field trips are in May.","All three class’s field trips are in May.","All three classes field trip’s are in May.","All three classes’s field trips are in May."),
    qLevel(3,"Which sentence is correct?","The women’s soccer team plays tonight.","The womens’ soccer team plays tonight.","The womens soccer team plays tonight.","The woman’s’ soccer team plays tonight."),
    qLevel(3,"Which phrase is correct for the wings of several geese?","the geese’s wings","the gooses’ wings","the geeses’ wings","the goose’s wing’s")
  ],
  itsVsIts:[
    qLevel(1,"What does “it’s” always mean?","it is or it has","belonging to it","more than one it","it was or it will"),
    qLevel(1,"Which word finishes the sentence? The cat licked ___ paw.","its","it’s","its’","it’is"),
    qLevel(1,"Which word finishes the sentence? ___ going to rain later.","It’s","Its","Its’","It’"),
    qLevel(2,"Which sentence is correct?","The tree lost its leaves.","The tree lost it’s leaves.","The tree lost its’ leaves.","The tree lost it’s’ leaves."),
    qLevel(2,"Which sentence is correct?","It’s been a long day.","Its been a long day.","Its’ been a long day.","It’ been a long day."),
    qLevel(2,"Which trick helps you choose between its and it’s?","Try saying “it is” or “it has” in its place.","Use it’s whenever something in the sentence belongs to it.","Use its at the start of every sentence.","Use it’s when the next word is a noun."),
    qLevel(2,"Which sentence is correct?","The team won its first game.","The team won it’s first game.","The team won its’ first game.","The team won it is first game."),
    qLevel(2,"Which word finishes the sentence? I think ___ time for lunch.","it’s","its","its’","it is’"),
    qLevel(3,"Which sentence uses both words correctly?","It’s clear that the dog wants its dinner.","Its clear that the dog wants it’s dinner.","It’s clear that the dog wants it’s dinner.","Its clear that the dog wants its dinner."),
    qLevel(3,"Which sentence has a mistake?","The bird flapped it’s wings.","It’s the bird with blue wings.","The bird flapped its wings.","It’s flapping its wings."),
    qLevel(3,"Why is “its” right in this sentence? The company changed its name.","The name belongs to the company.","It means “it is” here.","It means “it has” here.","It shows that there is more than one company."),
    qLevel(3,"Which word finishes the sentence? The phone is dead because ___ battery ran out.","its","it’s","its’","it’"),
    qLevel(3,"Which sentence is correct?","It’s got a crack in its screen.","Its got a crack in it’s screen.","It’s got a crack in it’s screen.","Its got a crack in its screen."),
    qLevel(3,"How many mistakes are in this sentence? Its sunny, and the garden is showing off it’s flowers.","Two","One","Three","None")
  ]
};
/* English Unit 7 (the ⏸️ Pause Library): Khan Academy Grammar, Punctuation: the colon, semicolon, and more.
   Khan's 9 practice exercises in Khan's order (checked on khanacademy.org, Oct 29 2026); Khan's Quiz 1 comes after the
   semicolon lesson. Docs: docs/ENGLISH-UNIT7.md, review list docs/ENGLISH-UNIT7-review.md */
const ENGLISH_UNIT7 = [
  {id:'introColons',name:'Introduction to colons',lesson:'A colon (:) says “here comes what I promised.” Use it after a complete sentence to introduce a list, an example, or an explanation: I need three things: paper, glue, and tape. The words before the colon must be able to stand alone as a sentence, so a colon never comes right after a verb like are or include. Colons also separate numbers and parts: 3:45, a 2:1 ratio, a title and its subtitle, and the greeting of a business letter (Dear Ms. Ruiz:).'},
  {id:'introSemicolons',name:'Introduction to semicolons',lesson:'A semicolon (;) joins two complete sentences that are closely related, with no and, but, or so between them: The rain stopped; the sun came out. Both sides of a semicolon must be able to stand alone as sentences. A semicolon also comes before a joining word like however or therefore, with a comma after that word (I studied; however, the test was hard), and it separates the items in a list when the items already have commas inside them.'},
  {id:'semicolonsCommas',name:'Using semicolons and commas',lesson:'There are two ways to join two complete sentences: a comma plus a joining word (and, but, or, so, yet, for, nor), or a semicolon with no joining word. A comma alone can’t hold two sentences together; that mistake is called a comma splice. If one part can’t stand alone, like “When the bell rang,” use a comma, not a semicolon.'},
  {id:'semicolonsColons',name:'Using semicolons and colons',lesson:'Both marks come after a complete sentence, but they do different jobs. A colon points ahead: what comes after it explains, names, or lists what the first part set up (I know what to bring: snacks). A semicolon balances two separate, related sentences of equal weight (I brought snacks; Ava brought drinks). Ask: Does the second part explain or list? Use a colon. Is it a second idea that could stand on its own? Use a semicolon.'},
  {id:'italicsQuotes',name:'Italics, underlines, and quotation marks',lesson:'Titles of long, whole works go in italics when you type and are underlined when you write by hand: books, movies, TV series, albums, magazines, newspapers, plays, and video games. Titles of short works, or of parts of a bigger work, go in quotation marks: songs, poems, short stories, chapters, articles, and single TV episodes. Ask: Is it a whole work, or a part of one?'},
  {id:'parentheses',name:'Introduction to parentheses',lesson:'Parentheses ( ) hold extra information the sentence could do without, like a side note: My cousin (the one who sings) is visiting. Read the sentence without the words in parentheses; it should still make sense. A comma or end mark that belongs to the main sentence goes after the closing parenthesis, but if a whole sentence is inside the parentheses, its end mark goes inside too. Parentheses also hold abbreviations, like the National Park Service (NPS), and numbers in a list.'},
  {id:'introDashes',name:'Introduction to dashes',lesson:'A dash (—) is a long line that makes the reader stop for something important or surprising. A pair of dashes sets off an interruption or extra detail in the middle of a sentence, more strongly than commas or parentheses: My sister—who hates cooking—made dinner. A single dash can set up a dramatic ending or a sudden change of thought: I opened the box and found—a frog! A dash is longer than a hyphen, and it doesn’t join words together.'},
  {id:'dashesHyphens',name:'Dashes and hyphens',lesson:'A hyphen (-) is short and joins words or word parts into one: a well-known song, forty-two, my ex-coach, self-control. Hyphenate two or more words that work together to describe a noun when they come before it (a ten-year-old dog), but not when they come after it (the dog is ten years old), and not after a word ending in -ly (a brightly lit room). A dash (—) is long and separates parts of a sentence to show a pause, an interruption, or a surprise.'},
  {id:'ellipses',name:'Introduction to ellipses',lesson:'An ellipsis is three dots (…) that show something was left out or that a voice trails off. When you quote someone and skip some of their words, put an ellipsis where the words were, and make sure the shorter quotation still means what the speaker meant. In dialogue and stories, an ellipsis can also show a pause, hesitation, or suspense: “Well… I guess so.”'}
];
const COLON_LESSON = `${KHAN}humanities/grammar/punctuation-the-colon-semicolon-and-more/`;
const ENGLISH_GROUPS7 = [
  {id:'colons',hook:{emoji:'⏸️',title:'Welcome to the Pause Library',story:'In the Pause Library, every mark tells the reader how to stop. A colon is a drumroll: it promises that something is coming next. “The library has one rule: whisper.” Without it, the reader never hears the drumroll before the big reveal.'},quizName:'Colons Quiz',name:'Introduction to colons',learn:'Use a colon after a complete sentence to point to a list, an example, or an explanation, and use colons in times, ratios, subtitles, and business letters.',skills:['introColons'],
    extraLessons:[{name:'The colon as a separator (video)',lesson:'A short video on colons in times, ratios, titles and subtitles, and business letters.',url:`${COLON_LESSON}introduction-to-colons/v/the-colon-as-a-separator-the-colon-and-semicolon-punctuation-khan-academy`}]},
  {id:'semicolons',hook:{emoji:'🌉',title:'The bridge between two shelves',story:'A semicolon is a little bridge. Each shelf on either side has to hold a whole sentence; a bridge to nowhere falls down. “The lights went out; the readers kept reading.” Swap the bridge for a comma, and the two sentences crash together.'},quizName:'Semicolons Quiz',name:'Introduction to semicolons',learn:'Join two related sentences with a semicolon, choose between a semicolon and a comma, and choose between a semicolon and a colon.',skills:['introSemicolons','semicolonsCommas','semicolonsColons'],
    extraLessons:[{name:'Semicolons and complex lists (video)',lesson:'A short video on using semicolons to separate list items that already have commas.',url:`${COLON_LESSON}introduction-to-semicolons/v/semicolons-and-complex-lists-the-colon-and-semicolon-punctuation-khan-academy`}]},
  {id:'formatting',hook:{emoji:'📚',title:'Big books and little stories',story:'The Pause Library shelves whole works, like novels and movies, in italics, and puts the short pieces inside them, like poems, songs, and chapters, in quotation marks. Parentheses are the sticky notes on the shelves: handy extra facts you could peel off and still read the sentence.'},quizName:'Formatting styles Quiz',name:'Formatting styles',learn:'Write titles in italics, underlined, or in quotation marks, and use parentheses for extra information.',skills:['italicsQuotes','parentheses'],
    extraLessons:[{name:'Using quotation marks in titles (video)',lesson:'A short video on which titles go in quotation marks.',url:`${COLON_LESSON}formatting-styles/v/quotation-marks`},{name:'Parentheses (video)',lesson:'A short video on using parentheses for extra information.',url:`${COLON_LESSON}formatting-styles/v/parentheses`}]},
  {id:'dashes',hook:{emoji:'✂️',title:'The long line, the short line, and the dots',story:'The library’s book doctor carries three tools. The dash cuts in to make a surprise—like this! The hyphen glues words together into one, like a well-loved book. And the ellipsis… quietly shows where words were snipped out or where a voice trails off.'},quizName:'Hyphens, dashes, and ellipses Quiz',name:'Hyphens, dashes, and ellipses',learn:'Use dashes for interruptions and surprises, hyphens to join words, and ellipses to show missing words or a pause.',skills:['introDashes','dashesHyphens','ellipses'],
    extraLessons:[{name:'Hyphens versus dashes (video)',lesson:'A short video on the difference between a hyphen and a dash.',url:`${COLON_LESSON}hyphens-dashes-and-ellipses/v/hyphens`},{name:'Ellipses (video)',lesson:'A short video on using an ellipsis.',url:`${COLON_LESSON}hyphens-dashes-and-ellipses/v/ellipses`}]}
];
const COLON_QUESTIONS = {
  introColons:[
    qLevel(1,"Which sentence uses a colon correctly?","I packed three snacks: grapes, crackers, and cheese.","I packed: grapes, crackers, and cheese for a snack.","I packed three: snacks, grapes, crackers, and cheese.","I packed three snacks, grapes: crackers, and cheese."),
    qLevel(1,"What does a colon after a complete sentence tell the reader?","A list, an example, or an explanation comes next.","The sentence is over, and a brand-new one begins.","Two words are being joined into one word.","Some of the letters in a word were left out."),
    qLevel(1,"Which mark belongs in the blank? The movie starts at 4___15 p.m.",":",";",",","-"),
    qLevel(2,"Which sentence uses a colon correctly?","Dad gave me one job: walk the dog.","Dad gave: me one job, walk the dog.","Dad gave me: one job, walk the dog.","Dad: gave me one job, walk the dog."),
    qLevel(2,"Which sentence uses a colon incorrectly?","My favorite fruits are: mangoes and pears.","I have two favorite fruits: mangoes and pears.","Here is my favorite snack: mango slices.","Remember the rule: wash the fruit first."),
    qLevel(2,"Which greeting for a business letter is punctuated correctly?","Dear Mr. Patel:","Dear Mr. Patel;","Dear: Mr. Patel","Dear Mr.: Patel"),
    qLevel(2,"Which shows a book title and its subtitle written correctly?","Ocean Giants: The Life of the Blue Whale","Ocean Giants; The Life of the Blue Whale","Ocean: Giants The Life of the Blue Whale","Ocean Giants The: Life of the Blue Whale"),
    qLevel(2,"Why is the colon correct in this sentence? We learned the secret of the trick: the coin was in his sleeve.","The second part explains the first part.","It sets apart a list of three or more things.","It separates the hour from the minutes.","It comes right after a verb like is."),
    qLevel(3,"Which sentence uses a colon incorrectly?","The recipe calls for: flour, sugar, and butter.","The recipe calls for three things: flour, sugar, and butter.","The recipe has one secret: brown butter.","Here is what the recipe needs: flour, sugar, and butter."),
    qLevel(3,"Which sentence is punctuated correctly?","The coach repeated her favorite rule: keep your eyes on the ball.","The coach: repeated her favorite rule, keep your eyes on the ball.","The coach repeated her favorite: rule keep your eyes on the ball.","The coach repeated: her favorite rule keep your eyes on the ball."),
    qLevel(3,"Where should the colon go? The museum has three new exhibits dinosaurs, gems, and rockets.","After “exhibits”","After “has”","After “museum”","After “dinosaurs”"),
    qLevel(3,"Which sentence uses a colon to introduce an explanation, not a list?","The plan failed for a simple reason: nobody brought the key.","We packed three things for the trip: a map, a key, and a flashlight.","Bring these: a map, a key, and a flashlight.","The trip had two stops: the lake and the cabin."),
    qLevel(3,"Which sentence uses colons correctly for a time and a ratio?","At 6:30, mix the paint in a 3:1 ratio.","At 6;30, mix the paint in a 3:1 ratio.","At 6:30, mix the paint in a 3;1 ratio.","At 6,30, mix the paint in a 3:1 ratio."),
    qLevel(3,"Which sentence is punctuated correctly?","One thing could wake my brother: the smell of bacon.","One thing could wake: my brother, the smell of bacon.","One thing: could wake my brother, the smell of bacon.","One thing could wake my brother, the smell: of bacon.")
  ],
  introSemicolons:[
    qLevel(1,"Which sentence uses a semicolon correctly?","The bus was late; we walked to school.","The bus; was late, we walked to school.","The bus was late we; walked to school.","Because the bus was late; we walked."),
    qLevel(1,"What can a semicolon join?","Two complete sentences that are closely related","A sentence and a word group that can’t stand alone","A greeting and the name of the person","Two words that make one describing word"),
    qLevel(1,"Which mark is a semicolon?",";",":",",","—"),
    qLevel(2,"Which sentence is punctuated correctly?","Maya loves soccer; her brother prefers chess.","Maya loves soccer; her brother, prefers chess.","Maya loves; soccer her brother prefers chess.","Maya loves soccer her brother; prefers chess."),
    qLevel(2,"Which sentence uses a semicolon incorrectly?","After the movie ended; we went home.","The movie ended; we went home.","The movie ended late; we got home at ten.","The movie was long; however, it was fun."),
    qLevel(2,"Which sentence correctly uses a semicolon with “however”?","I studied hard; however, the test was tricky.","I studied hard, however; the test was tricky.","I studied hard; however the test, was tricky.","I studied; hard however, the test was tricky."),
    qLevel(2,"Why are semicolons used in this sentence? We visited Austin, Texas; Tulsa, Oklahoma; and Denver, Colorado.","The list items already have commas inside them.","Each city is a complete sentence by itself.","A semicolon comes before each place name.","The list explains the first part of the sentence."),
    qLevel(2,"Which pair of sentences could be joined with a semicolon?","The lights went out. Everyone grabbed a flashlight.","The lights went out. Because of the storm.","When the lights in the gym went out. Everyone grabbed a flashlight.","The lights. Went out during the storm."),
    qLevel(3,"Which sentence is punctuated correctly?","The team practiced daily; as a result, they won the title.","The team practiced daily, as a result; they won the title.","The team practiced daily; as a result they won, the title.","The team practiced; daily as a result, they won the title."),
    qLevel(3,"Which list is punctuated correctly?","The winners were Ava, age 10; Ben, age 11; and Cy, age 12.","The winners were Ava; age 10, Ben; age 11, and Cy; age 12.","The winners were: Ava, age 10; Ben, age 11; and Cy, age 12.","The winners were Ava, age 10; Ben, age 11; and; Cy, age 12."),
    qLevel(3,"Which sentence needs a semicolon to be correct?","My cat sleeps by day she plays at night.","My cat sleeps by day, and she plays at night.","My cat sleeps by day but plays at night.","My cat sleeps by day and plays at night."),
    qLevel(3,"Where should the semicolon go? The library opens at nine the doors are locked until then.","After “nine”","After “library”","After “opens”","After “doors”"),
    qLevel(3,"Which sentence uses a semicolon correctly?","Leo forgot his lunch; luckily, Sam shared.","Leo forgot; his lunch luckily, Sam shared.","Leo forgot his lunch; luckily Sam, shared.","Since Leo forgot his lunch; Sam shared."),
    qLevel(3,"What must be true of the words on each side of a semicolon that joins two clauses?","Each side could stand alone as a sentence.","The second side starts with a capital letter.","The first side has to be a list of things.","The second side begins with and or but.")
  ],
  semicolonsCommas:[
    qLevel(1,"Which mark belongs in the blank? I wanted pizza___ my sister wanted tacos.",";",",",":","-"),
    qLevel(1,"Which mark belongs in the blank? I wanted pizza___ but my sister wanted tacos.",",",";",":","—"),
    qLevel(1,"What mistake does this sentence make? We ran to the bus, it had already left.","It joins two complete sentences with a comma alone.","It needs a colon before the word “it.”","It needs an apostrophe in the word “bus.”","It needs a colon after “bus” because a list comes next."),
    qLevel(2,"Which sentence is punctuated correctly?","The puppy was tired, so it took a nap.","The puppy was tired, it took a nap.","The puppy was tired so, it took a nap.","The puppy, was tired so it took a nap."),
    qLevel(2,"Which sentence is a comma splice?","The game ended, everyone cheered.","The game ended; everyone cheered.","The game ended, and everyone cheered.","When the game ended, everyone cheered."),
    qLevel(2,"How can you fix this sentence? The oven is hot, be careful.","Change the comma to a semicolon.","Add a comma after the word “be.”","Take out the comma and add nothing.","Add a semicolon after the word “be.”"),
    qLevel(2,"Which mark belongs in the blank? Although it was raining___ we played outside.",",",";",":","—"),
    qLevel(2,"Which sentence uses a semicolon correctly?","Ty finished his chores; then he called Ana.","Ty finished his chores; and called Ana.","Ty finished; his chores then he called Ana.","After Ty finished his chores; he called Ana."),
    qLevel(3,"Which sentence is punctuated correctly?","Ella can sing, and she can play the drums.","Ella can sing, she can play the drums.","Ella can sing and, she can play the drums.","Ella can sing; she can, play the drums."),
    qLevel(3,"Which sentence needs a comma, not a semicolon, in the blank?","Before the race started___ we stretched.","The race started___ we ran fast.","The race was long___ my legs were sore.","I trained for weeks___ the race felt easy."),
    qLevel(3,"Which joins these two sentences correctly? The storm knocked out the power. We played board games by candlelight.","The storm knocked out the power; we played board games by candlelight.","The storm knocked out the power, we played board games by candlelight.","The storm knocked out the power; so we played board games, by candlelight.","The storm knocked out; the power we played board games by candlelight."),
    qLevel(3,"Which sentence is punctuated correctly?","My uncle lives in Ohio; my aunt lives in Maine.","My uncle lives in Ohio, my aunt lives in Maine.","My uncle lives in Ohio; but, my aunt lives in Maine.","My uncle lives in Ohio my aunt, lives in Maine."),
    qLevel(3,"Which mark belongs in the blank? We could take the train___ or we could ride our bikes.",",",";",":","."),
    qLevel(3,"Which correctly fixes the comma splice? Marcus studied for hours, he still felt nervous.","Marcus studied for hours; he still felt nervous.","Marcus studied for hours; but, he still felt nervous.","Marcus studied for hours he still felt, nervous.","Marcus, studied for hours, he still felt nervous.")
  ],
  semicolonsColons:[
    qLevel(1,"Which mark belongs in the blank? I finally reached my goal___ running a full mile without stopping.",":",";","-"),
    qLevel(1,"Which mark belongs in the blank? Jada likes cats___ her sister likes dogs.",";",":",","),
    qLevel(1,"Which mark can introduce a list after a complete sentence?","A colon","A semicolon","A hyphen","An apostrophe"),
    qLevel(2,"Which mark belongs in the blank? We had one choice left___ start over.",":",";","-"),
    qLevel(2,"Which mark belongs in the blank? The museum opens at noon___ the gift shop opens at ten.",";",":",","),
    qLevel(2,"Which sentence uses a colon correctly?","Pack the essentials: a tent, a stove, and a lamp.","Pack the essentials; a tent, a stove, and a lamp.","Pack: the essentials, a tent, a stove, and a lamp.","Pack the essentials, a tent; a stove, and a lamp."),
    qLevel(2,"Which sentence uses a semicolon correctly?","The test was hard; I still passed it.","The test was hard; a math test.","The test was hard: I still passed it.","The test; was hard I still passed it."),
    qLevel(2,"When should you choose a colon instead of a semicolon?","When the second part explains or lists what the first part sets up","When the two parts are separate ideas of equal weight","When the second part begins with a joining word like however or therefore","When the items in a list already have commas inside them"),
    qLevel(3,"Which sentence is punctuated correctly?","Grandma gave me some advice: read the directions twice.","Grandma gave me: some advice, read the directions twice.","Grandma gave; me some advice read the directions twice.","Grandma gave me some advice, read; the directions twice."),
    qLevel(3,"Which sentence uses both marks correctly?","We invited three friends: Kai, who lives next door; Lena, from soccer; and Omar.","We invited three friends; Kai, who lives next door: Lena, from soccer: and Omar.","We invited three friends: Kai, who lives next door, Lena, from soccer, and Omar.","We invited: three friends; Kai, who lives next door; Lena, from soccer; and Omar."),
    qLevel(3,"Which mark belongs in the blank? There’s one problem with your plan___ the closed store on Main Street.",":",";","-"),
    qLevel(3,"Which mark belongs in the blank? The forecast called for rain___ however, the sky stayed clear.",";",":",","),
    qLevel(3,"Which sentence uses a colon incorrectly?","The two best players are: Rosa and Theo.","The two best players stood out: Rosa and Theo.","Our team had two stars: Rosa and Theo.","Remember this: Rosa and Theo pass first."),
    qLevel(3,"Which sentence would be correct with a semicolon, but not with a colon, in the blank?","Liam cooked dinner___ Zoe washed the dishes.","Liam cooked one thing___ spaghetti.","Liam had a simple job___ cook dinner.","Liam needed three things___ pasta, sauce, and cheese.")
  ],
  italicsQuotes:[
    qLevel(1,"When you type the title of a novel, how should it look?","In italics","In quotation marks","In parentheses","In capital letters"),
    qLevel(1,"How should you write the title of a song?","In quotation marks","In italics or underlined","In parentheses","With a colon after it"),
    qLevel(1,"When you write a movie title by hand, what do you do instead of using italics?","Underline it","Put it in quotation marks","Put it in parentheses","Write it in capital letters"),
    qLevel(2,"Which title belongs in quotation marks?","A poem called Rain on the Roof","A magazine called Kid Science","A movie called Space Pups","A video game called Pixel Farm"),
    qLevel(2,"Which title belongs in italics?","A newspaper called The Daily Star","A short story called The Lost Key","A song called Summer Nights","A chapter called The Long Walk"),
    qLevel(2,"Kenji read an article called Saving the Sea Turtles in a magazine called Ocean Life. How should the two titles look?","The article in quotation marks and the magazine in italics","The article in italics and the magazine in quotation marks","Both titles in quotation marks, since both are about the sea","Both titles in italics, since both of them were published"),
    qLevel(2,"How should you write the title of one episode of a TV series?","In quotation marks","In italics, like the series","Underlined, like a movie","In parentheses"),
    qLevel(2,"Which sentence formats the title correctly?","Our class read the poem “Snow on the Fence” today.","Our class read the novel “Snow on the Fence” today.","Our class watched the movie “Snow on the Fence” today.","Our class read the newspaper “Snow on the Fence” today."),
    qLevel(3,"Which title should NOT be in quotation marks?","a play called The Clockmaker","a poem called The Clockmaker","a short story called The Clockmaker","a song called The Clockmaker"),
    qLevel(3,"A chapter called The Storm is in a book called Island Days. Which is correct?","The chapter in quotation marks; the book in italics","The chapter in italics; the book in quotation marks","Both in quotation marks, because both are titles","Both in italics, because the chapter is part of a book"),
    qLevel(3,"Why does a song title go in quotation marks but an album title go in italics?","A song is a short work, and an album is a whole collection.","A song has words, and an album has instruments too.","A song is newer, and an album is older.","A song is sung by one person, and an album is made by a whole band."),
    qLevel(3,"Which list names three kinds of titles that go in italics?","a movie, a play, a video game","a movie, a poem, a video game","a song, a magazine, a newspaper","a novel, a chapter, a TV series"),
    qLevel(3,"Which sentence is formatted correctly?","My brother’s favorite song is “Thunder Road Trip.”","My brother’s favorite book is “Thunder Road Trip.”","My brother’s favorite movie is “Thunder Road Trip.”","My brother’s favorite magazine is “Thunder Road Trip.”"),
    qLevel(3,"You type a report about a TV series called Dino Detectives and one of its episodes, Fossil Mix-Up. How do you format them?","The series in italics, the episode in quotation marks","The series in quotation marks, the episode in italics","Both in italics, since they are from the same show","Both in quotation marks, since both are on TV")
  ],
  parentheses:[
    qLevel(1,"What do parentheses usually hold?","Extra information the sentence could do without","The main idea that the whole sentence depends on","The words someone says out loud","The title of a book or a movie"),
    qLevel(1,"Which sentence uses parentheses correctly?","My dog (a very lazy beagle) slept all day.","My dog (a very lazy beagle slept all day.)","My (dog a very lazy beagle) slept all day.","My dog a very (lazy beagle) slept all day."),
    qLevel(1,"Which pair of marks are parentheses?","( )","[ ]","“ ”","{ }"),
    qLevel(2,"Read each sentence without the part in parentheses. Which one still makes sense?","The museum (which opened last year) has a huge dinosaur.","The museum (has) a huge dinosaur from last year.","The museum which opened (last year has) a huge dinosaur.","The (museum which opened last year has) a huge dinosaur."),
    qLevel(2,"Which sentence is punctuated correctly?","We hiked to the falls (about two miles), and then we ate lunch.","We hiked to the falls, (about two miles) and then we ate lunch.","We hiked to the falls (about two miles,) and then we ate lunch.","We hiked to the falls (about two miles) and, then we ate lunch."),
    qLevel(2,"Which sentence is punctuated correctly?","Bring a jacket (it might rain).","Bring a jacket (it might rain.)","Bring a jacket. (it might rain)","Bring a jacket (It might rain)."),
    qLevel(2,"Which shows the correct way to introduce an abbreviation?","the Food and Drug Administration (FDA)","the (Food and Drug Administration) FDA","the FDA Food and Drug (Administration)","(the Food and Drug) Administration FDA"),
    qLevel(2,"Why are parentheses used in this sentence? Our science fair (the first one at our school) was a hit.","They add an extra detail about the science fair.","They show that someone is speaking.","They mark the title of the science fair.","They show the most important part of the sentence."),
    qLevel(3,"Which is punctuated correctly?","I finished my report. (It took four hours!)","I finished my report (It took four hours!).","I finished my report. (it took four hours)!","I finished my report (it took four hours!.)"),
    qLevel(3,"In which sentence could the words in parentheses be taken out without changing the main meaning?","Aunt Rosa (my mom’s sister) taught me to knit.","Aunt Rosa taught me (to knit).","Aunt Rosa (taught) me to knit.","Aunt Rosa taught me how to (knit) a scarf for my mom’s sister."),
    qLevel(3,"Which sentence is punctuated correctly?","When the puppy (only eight weeks old) saw the cat, it hid.","When the puppy, (only eight weeks old) saw the cat it hid.","When the puppy (only eight weeks old,) saw the cat it hid.","When the puppy (only eight weeks old) saw the cat it, hid."),
    qLevel(3,"Which sentence uses parentheses to number steps correctly?","To make slime, (1) pour the glue, (2) add the soda, and (3) stir.","To make slime, (1 pour the glue), (2 add the soda), and (3 stir).","To make slime (1), pour the glue (2), add the soda (3), and stir.","To make slime, 1) pour the glue (2 add the soda), and 3 stir."),
    qLevel(3,"Which sentence is punctuated correctly?","The quiz (on Friday) covers fractions.","The quiz (on Friday covers fractions.)","The quiz, (on Friday) covers fractions.","The quiz (on Friday), covers fractions."),
    qLevel(3,"Which sentence is correct?","Jamal (and his brother) is coming to the game.","Jamal (and his brother) are coming to the game.","Jamal (and his brother are) coming to the game.","Jamal and (his brother) is coming to the game.")
  ],
  introDashes:[
    qLevel(1,"Which mark is a dash?","—","-","_","~"),
    qLevel(1,"What does a dash do in a sentence?","It makes the reader pause for something important or surprising.","It joins two short words together to make one describing word, like well-known.","It shows that letters are missing from a word.","It ends a sentence that asks a question."),
    qLevel(1,"Which sentence uses a dash correctly?","I opened the door and saw—a giant cake!","I opened—the door and saw a giant cake!","I—opened the door and saw a giant cake!","I opened the door and saw a giant—cake!"),
    qLevel(2,"Which sentence uses a pair of dashes correctly?","My uncle—a real pilot—gave us a tour.","My uncle—a real pilot gave us a tour—.","My uncle a real—pilot gave—us a tour.","My—uncle a real pilot—gave us a tour."),
    qLevel(2,"Which marks could replace the commas and make the extra detail stand out more? Our coach, who is usually calm, jumped up and yelled.","A pair of dashes","A pair of quotation marks","A pair of apostrophes","A pair of semicolons"),
    qLevel(2,"Why is a dash used here? We searched the whole house for the keys and found them—in the fridge.","To set up a surprising ending","To join two words into one word","To show that letters are missing","To introduce a long list of items"),
    qLevel(2,"Which sentence is punctuated correctly?","There’s one thing I want for my birthday—a puppy.","There’s one—thing I want for my birthday a puppy.","There’s one thing I want—for my birthday a puppy.","There’s—one thing I want for my birthday a puppy."),
    qLevel(2,"Which other mark could replace the dash without changing the meaning much? I know what we need—more snacks.","A colon","A semicolon","A hyphen","An apostrophe"),
    qLevel(3,"Which sentence uses dashes correctly?","The test—all forty questions of it—took an hour.","The test—all forty questions of it, took an hour.","The test, all forty questions of it—took an hour.","The test—all forty questions—of it took an hour."),
    qLevel(3,"Which sentence uses a dash to show a sudden break in thought?","I was going to call you—wait, is that my phone ringing?","We need three things: paper, glue, and scissors.","My cousin (the one who lives in Utah) is visiting next week.","The well-known chef opened a new café downtown."),
    qLevel(3,"Why might a writer use dashes instead of commas here? The winner—to everyone’s shock—was the youngest player.","Dashes make the interruption stand out more.","Commas can’t set off extra information.","Dashes show that the sentence is a question.","Dashes join the words into one word."),
    qLevel(3,"Which sentence is punctuated correctly?","Three friends—Ana, Bo, and Cleo—came to the party.","Three friends, Ana, Bo, and Cleo—came to the party.","Three friends—Ana, Bo, and Cleo, came to the party.","Three friends—Ana, Bo—and Cleo came to the party."),
    qLevel(3,"Where should a dash go to set up the surprise? After hours of digging, the pirates found the treasure chest empty.","Before “empty”","Before “hours”","Before “the pirates”","Before “digging”"),
    qLevel(3,"Which sentence uses a dash incorrectly?","She is a well—known author.","She is a famous author—at least in our town.","She—a famous author—visited our school.","She wrote one book—and it became a hit.")
  ],
  dashesHyphens:[
    qLevel(1,"Which mark is a hyphen?","-","—",":",";"),
    qLevel(1,"What does a hyphen do?","It joins words or word parts into one.","It sets off a surprising ending.","It shows a pause or an interruption.","It introduces a list after a sentence."),
    qLevel(1,"Which number is written correctly?","forty-six","forty six","forty—six","fortysix"),
    qLevel(2,"What is the mark doing in this sentence? Our old dog—who still loves to fetch—ran across the yard.","It’s a dash that separates an extra detail.","It’s a hyphen that joins two words into one.","It’s a hyphen that shows letters are missing.","It’s a dash that joins two describing words."),
    qLevel(2,"What is the mark doing in this sentence? We watched a well-made movie.","It’s a hyphen that joins two words into one.","It’s a dash that sets off an interruption.","It’s a dash that shows a sudden surprise.","It’s a hyphen that splits a sentence in two."),
    qLevel(2,"Which sentence is punctuated correctly?","We adopted a three-year-old cat.","We adopted a three year-old cat.","We adopted a three—year—old cat.","We adopted a three-year old cat."),
    qLevel(2,"Which sentence is punctuated correctly?","The puppy is three months old.","The puppy is three-months-old.","The puppy is three—months—old.","The puppy is three months-old."),
    qLevel(2,"Which word is written correctly?","self-confident","self confident","self—confident","selfconfident"),
    qLevel(3,"Which sentence uses a hyphen and a dash correctly?","My best friend—a world-famous juggler—is visiting.","My best friend-a world—famous juggler-is visiting.","My best—friend a world-famous juggler—is visiting.","My best friend—a world famous—juggler is visiting."),
    qLevel(3,"Which sentence is punctuated correctly?","The brightly lit room was full of balloons.","The brightly-lit room was full of balloons.","The brightly—lit room was full of balloons.","The bright-ly lit room was full of balloons."),
    qLevel(3,"Which sentence is punctuated correctly?","She wrote a two-page letter.","She wrote a two page-letter.","She wrote a two—page letter.","She wrote a two page letter."),
    qLevel(3,"Which sentence uses hyphens correctly?","My great-grandmother is ninety-one.","My great grand-mother is ninety one.","My great-grand-mother is ninety-one.","My great grandmother is ninety-one."),
    qLevel(3,"Why does “chocolate-covered” have a hyphen in “a chocolate-covered pretzel”?","The two words work together to describe the pretzel.","The second word is a surprise, so a hyphen sets it apart.","A hyphen goes between any two long words.","It shows that some letters were left out."),
    qLevel(3,"Which sentence is punctuated correctly?","We got home at midnight—tired, cold, and happy.","We got home at midnight-tired, cold, and happy.","We got home at mid-night—tired, cold, and happy.","We got home at midnight—tired, cold—and happy.")
  ],
  ellipses:[
    qLevel(1,"Which mark is an ellipsis?","…",":","—",";"),
    qLevel(1,"When you shorten a quotation, what does an ellipsis show?","Where words were left out","Where the speaker got angry","Where a new speaker starts","Where the title of the book is"),
    qLevel(1,"How many dots make an ellipsis?","Three","Two","Four","Five"),
    qLevel(2,"Original: “Our town library, which opened in 1920, lends books, games, and even fishing poles.” Which shortened quotation uses the ellipsis correctly?","“Our town library … lends books, games, and even fishing poles.”","“Our town library, which opened … books.”","“Our town library … opened in 1920 games.”","“Our town library, which opened … in 1920, lends books and games.”"),
    qLevel(2,"Why might a writer use an ellipsis in a quotation?","To leave out words that aren’t needed","To add some words that the speaker didn’t say","To show the speaker was shouting","To change what the speaker meant"),
    qLevel(2,"What does the ellipsis show? “I… I didn’t mean to break it,” Tommy whispered.","Tommy is nervous and stops for a moment.","Some of Tommy’s words were left out of a quote.","Tommy is reading a title out loud.","Tommy is listing several things."),
    qLevel(2,"Which sentence shows someone pausing to think?","Maybe we could… no, let’s stay home.","Maybe we could: no, let’s stay home.","Maybe we could; no, let’s stay home.","Maybe we could (no), let’s stay home."),
    qLevel(2,"Original: “The storm knocked down trees, flooded three streets, and closed the school for two days.” Which shortened quotation is correct?","“The storm knocked down trees … and closed the school for two days.”","“The storm … closed three streets.”","“The storm knocked down … the school for two days.”","“The storm knocked down trees, flooded three … the school for two days.”"),
    qLevel(3,"Coach Lee said, “Practice does not make you perfect, but it does make you better.” Which shortened version changes what the coach meant?","“Practice does … make you perfect.”","“Practice … does make you better.”","“Practice does not make you perfect, but … make you better.”","“Practice does not make you perfect … but it does make you better.”"),
    qLevel(3,"Original: “The zoo, which is open every day, has over two hundred animals.” Ana wants to quote only the part about the animals. Which is correct?","“The zoo … has over two hundred animals.”","“The zoo, which is open every day … animals.”","“The zoo has over two hundred animals.”","“The zoo … is open … animals.”"),
    qLevel(3,"In which sentence does the ellipsis show that words were left out, not a pause in speech?","The sign read, “Visitors must … stay on the trail.”","“I was going to tell you, but… never mind,” Jo said.","Um… can I have another cookie?","“Wait… is that thunder?” Max asked."),
    qLevel(3,"Why should you check a shortened quotation against the original?","To make sure the ellipsis didn’t change what the speaker meant","To make sure the quote has at least two ellipses","To make sure each sentence ends with an ellipsis","To make sure the ellipsis is placed at the very end of each sentence"),
    qLevel(3,"What does the ellipsis show? I opened the fridge, reached for the cake, and… it was gone.","A pause that builds suspense","Words left out of a quotation","A list of items in the fridge","Two words joined into one"),
    qLevel(3,"Original: “Pandas spend most of the day eating, and they can eat about 40 pounds of bamboo.” Which shortened quotation is correct?","“Pandas … can eat about 40 pounds of bamboo.”","“Pandas spend … about 40 pounds of bamboo.”","“Pandas can eat about 40 pounds of bamboo.”","“Pandas spend most of the day … 40 pounds of bamboo eating.”")
  ]
};
/* English Unit 8 (the 🧩 Sentence Library): Khan Academy Grammar, Syntax: sentences and clauses.
   Khan's 10 practice exercises in Khan's order (lesson sitemaps on khanacademy.org, Oct 30 2026): Introduction to sentences,
   Types of sentences, Subjects and predicates, Phrases and clauses; the unit test sits in the last lesson.
   Docs: docs/ENGLISH-UNIT8.md, review list docs/ENGLISH-UNIT8-review.md */
const ENGLISH_UNIT8 = [
  {id:'sentenceTypes',name:'Declarative, interrogative, and imperative sentences',lesson:'A declarative sentence makes a statement (The bus is late.). An interrogative sentence asks a question (Is the bus late?). An imperative sentence gives a command or makes a request, and its subject, you, is understood but not written (Wait for the bus.). An exclamatory sentence shows strong feeling (What a long wait this is!). Judge a sentence by the job it does: “Watch out!” is still a command, and “I wonder if the bus is late.” is a statement, not a question.'},
  {id:'simpleCompound',name:'Simple and compound sentences',lesson:'A simple sentence has one independent clause: one subject-and-verb pair that can stand alone. It can still have a compound subject or a compound verb (Jo and Max ran and jumped.). A compound sentence joins two or more independent clauses, either with a comma and a joining word (for, and, nor, but, or, yet, so) or with a semicolon: The rain stopped, and the sun came out.'},
  {id:'rearrangeSentences',name:'Rearranging simple and compound sentences',lesson:'Join two simple sentences into a compound sentence with a comma and a joining word, or with a semicolon. Pick the joining word that shows how the ideas connect: and adds, but and yet show a contrast, so shows a result, or gives a choice. You can also split a compound sentence into two simple sentences, or combine sentences that share a subject into one simple sentence with a compound verb (Max swept. Max mopped. → Max swept and mopped.).'},
  {id:'complexSentences',name:'Complex and compound-complex sentences',lesson:'A dependent clause has a subject and a verb but can’t stand alone, because it starts with a word like because, when, although, if, since, after or until. A complex sentence has one independent clause and at least one dependent clause (When the bell rang, we left.). A compound-complex sentence has at least two independent clauses and at least one dependent clause (When the bell rang, we left, and the hall got quiet.). Put a comma after a dependent clause that starts the sentence.'},
  {id:'subjectPredicate',name:'Identifying subject and predicate',lesson:'The complete subject is who or what the sentence is about (The tall girl in the red coat). The complete predicate is the rest: what the subject does or is (waved at us from the bus). The simple subject is the main noun or pronoun (girl), and the simple predicate is the verb, with any helping verbs (waved, has been waving). In a question the subject can come after the first verb (Did your dog bark?), and in a command the subject, you, is understood.'},
  {id:'subjectObjects',name:'Identifying subject, direct object, and indirect object',lesson:'The direct object receives the action of the verb: it answers “what?” or “whom?” after the verb (Kai kicked the ball.). The indirect object tells to whom or for whom the action is done, and it sits between the verb and the direct object (Kai passed me the ball.). If the sentence says “to me” or “for me,” that is a prepositional phrase, not an indirect object. A sentence can’t have an indirect object without a direct object.'},
  {id:'phrasesClauses',name:'Introduction to phrases and clauses',lesson:'A clause is a group of words with a subject and its verb (the dog barked, when the dog barked). A phrase is a group of words that work together but don’t have a subject and its verb (in the morning, running down the hall, the big red barn). An independent clause can stand alone as a sentence. A phrase by itself is a fragment.'},
  {id:'depIndepClauses',name:'Dependent and independent clauses',lesson:'An independent clause can stand alone as a sentence (we went inside). A dependent clause has a subject and a verb but can’t stand alone, because it starts with a word like because, when, if, although, since or until, or a relative pronoun like who or which (because it started to rain). A dependent clause by itself is a fragment, so attach it to an independent clause.'},
  {id:'clausePlacement',name:'Phrase and clause placement',lesson:'Put a describing phrase or clause right next to the word it describes. If it lands next to the wrong word, the sentence says something silly: “Riding the bus, a deer ran past me” sounds like the deer was riding the bus. Fix it by moving the phrase next to the right word (Riding the bus, I saw a deer run past) or by turning it into a clause (While I was riding the bus, a deer ran past me).'},
  {id:'relativeClauses',name:'Relative clauses',lesson:'A relative clause is a dependent clause that describes a noun. It starts with a relative pronoun: who or whom for people, which for things, that for people or things, and whose to show belonging (the boy whose dog barks). If the clause is needed to tell which one you mean, use no commas: The book that I borrowed is overdue. If it adds extra information about a noun that is already clear, set it off with commas and use who or which: My grandma, who lives in Ohio, writes me letters.'}
];
const SYNTAX_LESSON = `${KHAN}humanities/grammar/syntax-sentences-and-clauses/`;
const ENGLISH_GROUPS8 = [
  {id:'intro',hook:{emoji:'🧩',title:'Welcome to the Sentence Library',story:'In the Sentence Library, every book is built from sentences, and every sentence is a puzzle with a job. Some tell, some ask, some give orders, and some shout. “The library is open.” “Is the library open?” “Open the library!” Same words, three different jobs.'},quizName:'Sentence types Quiz',name:'Introduction to sentences',learn:'Tell declarative, interrogative, imperative and exclamatory sentences apart by the job each one does.',skills:['sentenceTypes'],
    extraLessons:[{name:'Three types of sentence (video)',lesson:'A short video on statements, questions and commands.',url:`${SYNTAX_LESSON}introduction-to-sentences/v/three-types-of-sentence-syntax-khan-academy`},{name:'Exclamations (video)',lesson:'A short video on sentences that show strong feeling.',url:`${SYNTAX_LESSON}introduction-to-sentences/v/exclamations-syntax-khan-academy`}]},
  {id:'types',hook:{emoji:'🔗',title:'Snap the pieces together',story:'The library’s puzzle tables hold clause pieces. One independent clause is a simple sentence. Snap two together with a comma and a joining word, and you get a compound sentence. Clip on a dependent clause, a piece that can’t stand by itself, and the sentence becomes complex.'},quizName:'Types of sentences Quiz',name:'Types of sentences',learn:'Build and recognize simple, compound, complex and compound-complex sentences, and rearrange simple and compound sentences.',skills:['simpleCompound','rearrangeSentences','complexSentences'],
    extraLessons:[{name:'Complex sentences (video)',lesson:'A short video on sentences with a dependent clause.',url:`${SYNTAX_LESSON}types-of-sentences/v/complex-sentences-syntax-khan-academy`},{name:'Compound-complex sentences (video)',lesson:'A short video on sentences with two independent clauses and a dependent clause.',url:`${SYNTAX_LESSON}types-of-sentences/v/compound-complex-sentences-syntax-khan-academy`}]},
  {id:'subjects',hook:{emoji:'✂️',title:'The two halves of every sentence',story:'Every sentence in the library can be sliced in two. The subject half says who or what. The predicate half says what happens. Inside the predicate, the direct object catches the action, and the indirect object is who gets it: “The librarian handed me a book.”'},quizName:'Subjects and predicates Quiz',name:'Subjects and predicates',learn:'Find the subject and predicate of a sentence, and the subject, direct object and indirect object.',skills:['subjectPredicate','subjectObjects'],
    extraLessons:[{name:'Subject, direct object, and indirect object (video)',lesson:'A short video on who does the action, what receives it, and who gets it.',url:`${SYNTAX_LESSON}subjects-and-predicates/v/subject-direct-object-and-indirect-object-syntax-khan-academy`}]},
  {id:'clauses',hook:{emoji:'🔧',title:'Fragments on the repair cart',story:'Some pieces in the library look like sentences but can’t stand up alone: “Because the shelf fell.” “Running down the hall.” The repair crew knows the trick: a clause has a subject and a verb, a phrase doesn’t, and a dependent clause needs an independent clause to lean on.'},quizName:'Phrases and clauses Quiz',name:'Phrases and clauses',learn:'Tell phrases from clauses and dependent clauses from independent ones, put describing phrases in the right place, and use relative clauses.',skills:['phrasesClauses','depIndepClauses','clausePlacement','relativeClauses'],
    extraLessons:[{name:'Dependent and independent clauses (video)',lesson:'A short video on clauses that can and can’t stand alone.',url:`${SYNTAX_LESSON}phrases-and-clauses/v/dependent-and-independent-clauses-syntax-khan-academy`},{name:'Relative clauses (video)',lesson:'A short video on clauses that start with who, which, that and whose.',url:`${SYNTAX_LESSON}phrases-and-clauses/v/relative-clauses-syntax-khan-academy`}]}
];
const SENTENCE_QUESTIONS = {
  sentenceTypes:[
    qLevel(1,"What kind of sentence is this? The library closes at six.","Declarative","Interrogative","Imperative","Exclamatory"),
    qLevel(1,"What kind of sentence is this? Please return your books by Friday.","Imperative","Declarative","Interrogative","Exclamatory"),
    qLevel(1,"Which sentence is interrogative?","Where did you leave the map?","Please leave the map on the table.","The map is on the table, I think.","I left the map over there today."),
    qLevel(2,"What kind of sentence is this? Hand me the scissors, please.","Imperative","Interrogative","Declarative","Fragment"),
    qLevel(2,"Who is the subject of this sentence? Close the door quietly.","you","door","Close","quietly"),
    qLevel(2,"Which sentence is declarative?","I wonder whether the bus is late.","Is the bus late?","Call the bus company and ask about the delay.","How late the bus is!"),
    qLevel(2,"Which sentence is imperative?","Watch out for the falling books!","The falling books scared all of us!","Did the falling books land on you?","What a loud crash the books made!"),
    qLevel(2,"Which end mark belongs in the blank? Can you tell me where the gym is___","?",".","!",";"),
    qLevel(3,"What kind of sentence is this? Tell me why the sky is blue.","Imperative","Interrogative","Declarative","Fragment"),
    qLevel(3,"Which sentence should end with a period, not a question mark?","Maya asked whether the pool was open","Is the pool open","Did Maya ask if the pool was open today","Why is the pool closed"),
    qLevel(3,"How many of these are imperative sentences? (1) Sit down. (2) You sat down. (3) Please sit here. (4) Where should I sit?","Two","One","Three","Four"),
    qLevel(3,"Which sentence is exclamatory?","What a huge dog that is!","Look at that huge dog.","Is that dog huge?","That dog’s huge, right?"),
    qLevel(3,"Ana wrote, “Turn left at the bakery.” She wants to ask for directions instead of giving them. Which sentence does that?","Where should I turn after the bakery?","Turn left at the bakery, okay?","Please turn left when you get to the bakery.","Did you turn left at the bakery?"),
    qLevel(3,"Which sentence has the wrong end mark?","Do you know who wrote this book.","Tell me who wrote this book, please.","I know who wrote this book.","Who wrote this book for our class?")
  ],
  simpleCompound:[
    qLevel(1,"Which sentence is compound?","The dog barked, and the cat ran away.","When the dog barked, the cat ran.","The dog and the cat ran away.","The dog barked and ran away."),
    qLevel(1,"How many independent clauses does a simple sentence have?","One","Two","At least two","Three"),
    qLevel(1,"Which word can join two independent clauses after a comma?","but","because","when","although"),
    qLevel(2,"Is this sentence simple or compound? My aunt and my uncle drove to the beach and swam all day.","Simple, with a compound subject and a compound verb","Compound, with a compound subject and a compound verb","Compound, because it uses the word and twice","Simple, with a compound subject and just one verb"),
    qLevel(2,"Which sentence is a compound sentence?","I wanted to swim, but the pool was closed.","I wanted to swim in the big pool after lunch.","After lunch, I really wanted to swim in the pool.","My brother and I wanted to swim but stayed home."),
    qLevel(2,"Which compound sentence is punctuated correctly?","We packed lunch, and we drove to the lake.","We packed lunch and, we drove to the lake.","We packed lunch, we drove to the lake.","We packed, lunch and we drove to the lake."),
    qLevel(2,"Which joining word fits best? I studied hard, ___ I passed the test.","so","but","or","nor"),
    qLevel(2,"Which pair could be joined into a compound sentence?","The bell rang. Everyone ran outside.","The bell rang. Because it was noon by then.","When the bell rang. Everyone ran outside.","The bell. It rang very loudly at noon."),
    qLevel(3,"Which sentence is simple?","Lena and her cousins baked bread and sold it at the fair.","Lena baked bread, and her cousins sold it.","Lena baked bread; her cousins sold it at the fair.","Lena baked bread, so her cousins sold it at the fair."),
    qLevel(3,"Which sentence correctly joins two independent clauses?","The game ended; the fans went home.","The game ended, the fans then went home.","The game ended the fans all went home.","The game ended; and the fans went home."),
    qLevel(3,"How many independent clauses are in this sentence? The storm knocked out the power, so we lit candles, and Dad told stories.","Three","Two","One","Four"),
    qLevel(3,"Why is this sentence simple, not compound? The puppy chased the ball and brought it back.","It has one subject doing two actions.","It has two separate subject-and-verb pairs.","It has a comma before the word and.","It has a helping verb."),
    qLevel(3,"Which sentence is compound?","Sam had no pencil, nor did Ty have one.","Neither Sam nor Ty had a pencil.","Sam, like Ty, forgot his pencil.","Sam forgot his pencil and borrowed one from Ty."),
    qLevel(3,"Which sentence is compound?","The movie was long, yet nobody left early.","The long movie kept everybody in their seats.","Nobody left the long movie early.","Although the movie was long, nobody left early.")
  ],
  rearrangeSentences:[
    qLevel(1,"Which sentence combines these correctly? The sun set. The sky turned pink.","The sun set, and the sky turned pink.","The sun set, the sky turned pink.","The sun set and, the sky turned pink.","The sun set the sky, and turned pink."),
    qLevel(1,"Which joining word shows the contrast? I was tired, ___ I stayed up to finish my book.","but","so","or","nor"),
    qLevel(1,"Which shows this compound sentence split into two simple sentences? The lake froze, so we went skating.","The lake froze. We went skating.","The lake froze so. We went skating.","The lake. Froze, so we went skating.","The lake froze, so. We went skating."),
    qLevel(2,"Which sentence combines these into one simple sentence? Rosa washed the car. Rosa dried the car.","Rosa washed and dried the car.","Rosa washed the car, and Rosa dried the car.","Rosa washed the car and Rosa dried the car.","Rosa washed the car and then she dried it."),
    qLevel(2,"Which joining word shows a choice? We can walk to the park, ___ we can ride our bikes.","or","so","but","yet"),
    qLevel(2,"Which combined sentence keeps the meaning? It rained all morning. The game went on anyway.","It rained all morning, but the game went on anyway.","It rained all morning, so the game went on anyway.","It rained all morning, or the game went on anyway.","It rained all morning, for the game went on anyway."),
    qLevel(2,"Which sentence combines these correctly with a semicolon? Owls hunt at night. Hawks hunt during the day.","Owls hunt at night; hawks hunt during the day.","Owls hunt at night; and hawks hunt during the day.","Owls hunt; at night hawks hunt during the day.","Owls hunt at night, hawks; hunt during the day."),
    qLevel(2,"Which pair of sentences could become one simple sentence with a compound subject?","Lin plays the drums. Kofi plays the drums.","Lin plays the drums. Kofi plays soccer.","Lin plays the drums. She practices daily.","Lin plays the drums. They are loud."),
    qLevel(3,"Original: The bridge was closed. We took the long way home. Which combination changes the meaning?","The bridge was closed, yet we took the long way home.","The bridge was closed, so we took the long way home.","The bridge was closed; we took the long way home.","We took the long way home, for the bridge was closed."),
    qLevel(3,"Which sentence combines these into a simple sentence with a compound verb? The museum opens at nine. The museum closes at five.","The museum opens at nine and closes at five.","The museum opens at nine, and it closes at five.","The museum opens at nine; it closes at five.","Opening at nine, the museum, closes at five."),
    qLevel(3,"Which is NOT a correct way to combine these? Jamal set the table. His sister cooked dinner.","Jamal set the table, his sister cooked dinner.","Jamal set the table, and his sister cooked dinner.","Jamal set the table; his sister cooked dinner.","Jamal set the table while his sister cooked dinner."),
    qLevel(3,"Which correctly splits this into two simple sentences? The cat climbed the tree, but it couldn’t get down.","The cat climbed the tree. It couldn’t get down.","The cat climbed the tree. Couldn’t get down.","The cat climbed the tree, it couldn’t get down.","The cat climbed up. But couldn’t get down."),
    qLevel(3,"Which joining word fits? Maya didn’t like the soup, ___ did she like the salad.","nor","or","but","so"),
    qLevel(3,"Which rewrite turns this compound sentence into a simple sentence with the same meaning? Theo grabbed his coat, and he ran out the door.","Theo grabbed his coat and ran out the door.","Theo grabbed his coat, so he ran out the door.","Theo grabbed his coat; he ran out the door.","Theo grabbed his coat, and then he ran out.")
  ],
  complexSentences:[
    qLevel(1,"Which sentence is complex?","Because it was cold, we wore mittens.","It was cold, so all of us wore mittens.","It was very cold outside; we wore mittens.","We wore warm mittens and hats in the cold."),
    qLevel(1,"Which word often begins a dependent clause?","because","and","but","or"),
    qLevel(1,"What does a complex sentence have?","One independent clause and at least one dependent clause","Two independent clauses and a joining word","One subject and one verb, and nothing else","Two dependent clauses and no independent clause"),
    qLevel(2,"What is the dependent clause? We stayed inside until the storm passed.","until the storm passed","We stayed inside until","We stayed","the storm"),
    qLevel(2,"Which sentence is compound-complex?","After the game ended, Ana cheered, and Ben clapped.","After the game ended, Ana cheered loudly.","Ana cheered, and Ben clapped.","Ana and Ben cheered and clapped after the game ended."),
    qLevel(2,"Where does the comma go? When the bus finally came we all climbed aboard.","After “came”","After “bus”","After “When”","After “all”"),
    qLevel(2,"What kind of sentence is this? I’ll call you if the package arrives.","Complex","Compound","Simple","Compound-complex"),
    qLevel(2,"What kind of sentence is this? The lights flickered, and the dog barked because it was scared.","Compound-complex","Complex","Compound","Simple"),
    qLevel(3,"What kind of sentence is this? Although the trail was steep, we reached the top, but we were too tired to enjoy the view.","Compound-complex","Complex","Compound","Simple"),
    qLevel(3,"Which sentence is complex, not compound?","Since the store was closed, we went home.","The store was closed, so we went home.","The store was closed; we went home.","The store was closed, and we went home early."),
    qLevel(3,"Which sentence is NOT complex?","We waited for an hour, but the bus never came.","We waited until the bus came.","If the bus never comes, we’ll walk.","The bus that we waited for all morning finally came."),
    qLevel(3,"How many dependent clauses are in this sentence? When Grandpa visits, he tells stories that make us laugh.","Two","One","Three","Zero"),
    qLevel(3,"Which revision turns this compound sentence into a complex sentence? The power went out, so we played board games.","Because the power went out, we played board games.","The power went out at night; we played board games.","The power went out, and then we played board games.","The power went out, so we played many fun board games."),
    qLevel(3,"Which sentence is punctuated correctly?","Although Kim was nervous, she sang, and the crowd loved it.","Although Kim was nervous she sang and, the crowd loved it.","Although, Kim was nervous, she sang and the crowd loved it.","Although Kim was nervous, she sang the crowd loved it.")
  ],
  subjectPredicate:[
    qLevel(1,"What is the complete subject? My little brother loves trains.","My little brother","loves trains","My little brother loves","little"),
    qLevel(1,"What is the complete predicate? The old clock ticked loudly all night.","ticked loudly all night","The old clock","The old clock ticked loudly","all night"),
    qLevel(1,"What does the predicate of a sentence tell?","What the subject does or is","Who or what the sentence is about","Where the sentence takes place","When the sentence was written"),
    qLevel(2,"What is the simple subject? The muddy boots by the door belong to Dad.","boots","door","Dad","muddy"),
    qLevel(2,"What is the simple predicate? Three hungry geese chased us across the park.","chased","geese","across","park"),
    qLevel(2,"What is the complete subject? Under the bridge lived a grumpy troll.","a grumpy troll","Under the bridge","the bridge","lived a grumpy troll"),
    qLevel(2,"What is the simple subject? Did the bus leave already?","bus","Did","leave","already"),
    qLevel(2,"Which shows the sentence split correctly into complete subject | complete predicate?","The kids on our street | play tag every evening.","The kids | on our street play tag every evening.","The kids on our street play | tag every evening.","The kids on our | street play tag every evening."),
    qLevel(3,"What is the simple subject? One of my friends has a pet snake.","One","friends","snake","has"),
    qLevel(3,"What is the complete subject? Here comes the parade.","the parade","Here","Here comes","comes the parade"),
    qLevel(3,"What is the complete subject? Did the girl with the green backpack win the race?","the girl with the green backpack","the girl","the girl with the green backpack win","the girl with the backpack"),
    qLevel(3,"What is the simple predicate? My sister and I have been practicing all week.","have been practicing","practicing","have been practicing all week","I have been practicing"),
    qLevel(3,"What is the complete subject? Lions, tigers, and bears live at the city zoo.","Lions, tigers, and bears","Lions","Lions, tigers, and bears live","Lions, tigers, and bears at the city zoo"),
    qLevel(3,"Which sentence has a compound subject?","The coach and the players cheered.","The coach cheered and clapped loudly.","The coach cheered for all the players.","The coach’s players cheered loudly.")
  ],
  subjectObjects:[
    qLevel(1,"What is the direct object? Nora painted a picture.","picture","Nora","painted","a"),
    qLevel(1,"What is the subject? The puppy chewed my shoe.","puppy","shoe","chewed","my"),
    qLevel(1,"Which question does a direct object answer?","What? or Whom? after the verb","Where? or When? after the verb","How? after the verb","Who did the action?"),
    qLevel(2,"What is the indirect object? Mr. Ruiz gave the class a quiz.","class","quiz","Mr. Ruiz","gave"),
    qLevel(2,"What is the direct object? Grandma baked us cookies.","cookies","us","Grandma","baked"),
    qLevel(2,"Which sentence has an indirect object?","Dev showed his mom the trophy.","Dev showed the trophy to his mom.","Dev showed the trophy proudly.","Dev and his mom saw the trophy."),
    qLevel(2,"What is the direct object? The coach handed each player a water bottle.","bottle","player","coach","handed"),
    qLevel(2,"What job does “her” do in this sentence? I sent her a postcard.","Indirect object","Direct object","Subject of the sentence","Simple predicate"),
    qLevel(3,"What is the indirect object? Will you lend me your bike?","me","bike","you","lend"),
    qLevel(3,"Which sentence has a direct object but no indirect object?","Lila told a funny story to us.","Lila told us a really funny story.","Lila told her best friends a story.","Lila gave the muddy dog a bath."),
    qLevel(3,"What is the direct object? Whom did you invite?","Whom","you","invite","did"),
    qLevel(3,"Which sentence has no direct object?","The baby slept all afternoon.","The baby grabbed all my fingers.","The baby threw her rattle across the room.","The baby gave me a smile."),
    qLevel(3,"In which sentence is “Sam” an indirect object?","We bought Sam a new hat.","We bought a new hat for Sam.","Sam bought a new hat.","We saw Sam at the hat store."),
    qLevel(3,"Which words are the direct objects? The waiter brought my parents their menus and some water.","menus and water","parents and menus","waiter and parents","parents and water")
  ],
  phrasesClauses:[
    qLevel(1,"Which group of words is a clause?","the bird sang","in the tree","on a sunny day","singing loudly"),
    qLevel(1,"Which group of words is a phrase?","under the bed","the cat hid","she slept","we left early"),
    qLevel(1,"What does every clause have?","A subject and a verb","A comma and a period at the end","A joining word like and","At least ten words in a row"),
    qLevel(2,"Which group of words is a phrase?","after the long, boring meeting","after the meeting ended","the meeting ended","because the meeting ran late"),
    qLevel(2,"Is “running through the sprinklers” a phrase or a clause?","A phrase, because nobody in it is doing the running","A clause, because running is an action verb","A clause, because it has a subject and a verb in it","A phrase, because it has no nouns"),
    qLevel(2,"Which group of words is a clause?","until the sun came up","before sunrise","at the crack of dawn","with the rising sun"),
    qLevel(2,"How many clauses are in this sentence? We ate lunch after the show ended.","Two","One","Three","Four"),
    qLevel(2,"Which group of words can stand alone as a sentence?","The phone rang.","When the phone rang.","Ringing loudly.","The ringing phone in the kitchen."),
    qLevel(3,"Which group of words is a clause, even though it can’t stand alone?","because we were late","because of the rain","during the storm","after a long nap"),
    qLevel(3,"Which group of words is a prepositional phrase? The kite that I built flew over the trees.","over the trees","that I built","The kite that I built","I built"),
    qLevel(3,"Which group of words is NOT a clause?","to win the race","she won","if she wins the race","who won the race"),
    qLevel(3,"Which of these is a sentence fragment?","Hoping for a snow day.","We hoped for a snow day.","Hope for a snow day.","It snowed."),
    qLevel(3,"How many clauses are in this sentence? The book that you lent me was so good that I read it twice.","Three","Two","One","Four"),
    qLevel(3,"Which group of words is a phrase?","the dog with the spotted ears","the dog barked","dogs bark","when the dogs on our street bark")
  ],
  depIndepClauses:[
    qLevel(1,"Which is an independent clause?","the pizza arrived","when the pizza arrived","because the pizza was late","after the pizza"),
    qLevel(1,"Which is a dependent clause?","if you finish early","you finish your part early","you can finish your work early","finish your part early"),
    qLevel(1,"Why can’t “Because my alarm didn’t ring” stand alone?","It starts with because, so the thought is unfinished.","It is too short to be a sentence.","It has no subject.","It has no verb."),
    qLevel(2,"What is the independent clause? Unless it rains, we will hike tomorrow.","we will hike tomorrow","Unless it rains","it rains","Unless it rains, we will hike"),
    qLevel(2,"What is the dependent clause? The movie that we watched last night was scary.","that we watched last night","The movie was scary","The movie","The movie that we watched last night"),
    qLevel(2,"Which sentence has a dependent clause?","I smiled when I saw the puppy.","I smiled and then petted the puppy.","I smiled at the cute little puppy.","I saw the puppy, and I smiled."),
    qLevel(2,"Which word turns “the bus stopped” into a dependent clause?","after","and","the","so"),
    qLevel(2,"Which is a complete sentence?","We cheered when the team scored.","When the team scored.","Because our team scored.","The team that scored the goal."),
    qLevel(3,"Which group of words is a dependent clause?","who lives next door","next to the door","the woman next door","she lives next door"),
    qLevel(3,"Which is a fragment?","Although we practiced every day for a month.","We practiced every single day for a whole month, and it paid off.","Practice every day for a month.","We practiced, and we improved."),
    qLevel(3,"Which revision fixes this fragment? Since the library was closed.","Since the library was closed, we read at home.","Since the library was closed today.","Since the library, was closed.","Since the library was closed, and we read at home."),
    qLevel(3,"How many independent clauses are in this sentence? Before we left, Mom checked the stove, and Dad locked the door.","Two","One","Three","Four"),
    qLevel(3,"Which of these is an independent clause?","then the bell rang","when the bell rang","as soon as the bell rang","until the bell rang"),
    qLevel(3,"What does the dependent clause tell? We stayed inside because it was freezing.","Why we stayed inside","When we stayed inside","Where we stayed all day","Who stayed inside with us")
  ],
  clausePlacement:[
    qLevel(1,"Which sentence is clear?","Riding my bike, I saw a deer.","I saw a deer riding my bike.","A deer, riding my bike, I saw.","Riding my bike, a deer was seen by me."),
    qLevel(1,"What is wrong with this sentence? The boy fed the goat wearing a red cap.","It sounds like the goat is wearing the cap.","It needs commas after boy and goat.","It is missing a verb.","It has two subjects."),
    qLevel(1,"Where should a describing phrase go?","Right next to the word it describes","Far from the word it describes","At the very start of the sentence","Right after the verb"),
    qLevel(2,"Which sentence is clear?","Dad found his old coat hanging in the closet.","Hanging in the closet, Dad found his old coat.","Dad, hanging in the closet, found his old coat.","Dad hanging in the closet found his old coat."),
    qLevel(2,"Which revision fixes this sentence? We gave the cookies to the neighbors that we baked.","We gave the cookies that we baked to the neighbors.","We gave the neighbors that we baked the cookies.","That we baked, we gave the cookies to the neighbors.","We gave the cookies to the neighbors, which we baked."),
    qLevel(2,"Read it word for word. What does this sentence accidentally say? Covered in mud, Mom washed the dog.","Mom was covered in mud.","The dog was covered in mud.","Mom washed the dog because it was muddy.","Mom covered the dog in mud."),
    qLevel(2,"Which sentence is clear?","Barking loudly, the dog chased the mail truck.","Barking loudly, the mail truck was chased by the dog.","The mail truck, barking loudly, was chased by the dog.","Barking loudly, the mail truck sped away from the dog."),
    qLevel(2,"Which sentence puts “with a long tail” in the right place?","The monkey with a long tail ate a banana.","The monkey ate a banana with its long tail.","With a long tail, a banana was eaten by the monkey.","The monkey ate with a long tail a banana."),
    qLevel(3,"Which sentence is clear?","While I walked to the park, a dog followed me.","Walking to the park, a dog followed me.","While walking to the park, a dog followed me.","Walking to the park, a dog trailed me."),
    qLevel(3,"Which revision fixes this sentence? I read about the bear that escaped in the newspaper.","I read in the newspaper about the bear that escaped.","I read about the bear in the newspaper that escaped.","I read about the bear, which escaped in the newspaper.","I read about the bear in the newspaper, which escaped."),
    qLevel(3,"Which sentence is clear?","The girl in the blue dress sang a song.","The girl sang a song in the blue dress.","Wearing the blue dress, the song was sung by the girl.","The girl sang a song wearing the blue dress."),
    qLevel(3,"What is wrong with this sentence? After finishing my homework, the TV was turned on.","It doesn’t say who finished the homework.","It needs a semicolon after homework instead of a comma.","The verb is in the wrong tense.","It has too many commas in it."),
    qLevel(3,"Which revision fixes this sentence? Full of fresh water, the dog drank from the bowl.","The dog drank from the bowl full of fresh water.","The dog drank full of fresh water from the bowl.","The dog, full of fresh water, drank from the bowl.","Full of fresh water, the dog happily drank from its bowl."),
    qLevel(3,"Which sentence is clear?","Flying over the city, we spotted the stadium.","Flying over the city, the stadium was easy to spot.","The stadium, flying over the city, was easy to spot.","We spotted the stadium, which was flying over the city.")
  ],
  relativeClauses:[
    qLevel(1,"Which word begins the relative clause? The cake that Ana baked was delicious.","that","Ana","baked","cake"),
    qLevel(1,"Which relative pronoun fits? The girl ___ won the race is my cousin.","who","which","whose","whom"),
    qLevel(1,"What does a relative clause do?","It describes a noun.","It names the action.","It ends the sentence.","It joins two verbs together."),
    qLevel(2,"What is the relative clause? The bike that I wanted was sold out.","that I wanted","The bike","was sold out","I wanted was sold"),
    qLevel(2,"Which relative pronoun fits? That’s the boy ___ backpack fell in the pond.","whose","who","which","whom"),
    qLevel(2,"Which relative pronoun fits? Our class read a book ___ won a big award.","that","who","whose","whom"),
    qLevel(2,"Which noun does the relative clause describe? The man who fixed our roof is my uncle’s friend.","man","roof","uncle’s","friend"),
    qLevel(2,"Which sentence has a relative clause?","The dog that lives next door barks at birds.","The dog next door barks at birds.","The dog barks, and the birds fly away.","The dog barks at birds in the yard."),
    qLevel(3,"Which sentence is punctuated correctly?","My grandpa, who was born in Peru, loves soccer.","My grandpa who was born in Peru, loves soccer.","My grandpa, who was born in Peru loves soccer.","My grandpa who, was born in Peru, loves soccer."),
    qLevel(3,"Which relative pronoun is correct? The coach ___ we thanked gave a speech.","whom","which","whose","what"),
    qLevel(3,"Which sentence needs NO commas around its relative clause?","The students who finished early may read.","My mom who is a nurse may work late at night.","The Eiffel Tower which is in Paris is tall.","Lake Superior which is very cold is truly huge."),
    qLevel(3,"What is the relative clause? The house whose roof blew off is being fixed.","whose roof blew off","The house whose","is being fixed","roof blew off"),
    qLevel(3,"Which sentence uses “which” correctly?","Our car, which is ten years old, still runs well.","Our neighbor, which is ten years old, likes cars.","The car which, is ten years old, still runs very well.","The boy which owns the little red toy car is ten years old."),
    qLevel(3,"How many relative clauses are in this sentence? The girl who sits next to me has a cat that can open doors.","Two","One","Three","Four")
  ]
};
/* English Unit 8 (Sentence Library): reserved test pool, Oct 30, 2026 (80 test-only questions; docs/ENGLISH-UNIT8-review.md, "Reserved test pool"). */
reserveForTest(SENTENCE_QUESTIONS, {
  sentenceTypes:[
    mcLevel(2,"What kind of sentence is this? Let the soup cool before you taste it.","Imperative","Declarative","Exclamatory","Interrogative"),
    mcLevel(2,"Which sentence is interrogative?","Who left the ladder in the hallway?","Someone left the ladder in the hallway.","Please move the ladder out of the hallway.","I wonder who left that ladder."),
    mcLevel(3,"Which sentence is declarative?","Kenji asked his coach when practice would start.","When will practice start, Coach?","Ask the coach when practice will start on Saturday.","How early practice starts on Saturdays!"),
    mcLevel(2,"Which sentence is imperative?","Kindly keep your voices low in the museum.","Visitors keep their voices low in the museum.","Do visitors keep their voices low here?","How quietly the visitors walk!"),
    mcLevel(3,"Which sentence has the wrong end mark?","Please tell me where you bought that kite?","Where did you buy that bright red kite last weekend?","I asked where you bought that kite.","What a bright kite you bought!"),
    mcLevel(3,"What kind of sentence is this? How quickly the snow melted this morning!","Exclamatory","Interrogative","Declarative","Imperative"),
    mcLevel(2,"Ms. Okafor wants the class to line up. Which sentence gives that as a command?","Line up by the door, everyone.","Would everyone please line up by the door?","Everyone will line up by the door now.","I want everyone to line up by the door."),
    mcLevel(3,"How many of these are interrogative sentences? (1) Why is the gate open? (2) I wonder why the gate is open. (3) Is the gate locked? (4) Who left the gate open?","Three","Two","One","Four")
  ],
  simpleCompound:[
    mcLevel(2,"Which sentence is compound?","The ferry was late, so we missed the concert.","Because the ferry was late, we missed the concert.","The late ferry made us miss the concert.","We waited for the ferry and missed the concert."),
    mcLevel(3,"Which sentence is simple?","Before dawn, the farmers and their children milked the goats and fed the hens.","The farmers milked the goats, and their children fed the hens.","The farmers milked the goats; their children fed the hens.","The farmers milked the goats before their children fed the hens."),
    mcLevel(2,"Is this sentence simple or compound? The wind howled all night, but the tent stayed up.","Compound, with two independent clauses","Simple, with one subject and a compound verb","Simple, because but joins the two verbs","Compound, because it has a compound subject"),
    mcLevel(3,"How many independent clauses are in this sentence? Pedro and his twin sister painted the fence, washed the windows, and swept the porch.","One","Two","Three","Four"),
    mcLevel(2,"Which compound sentence is punctuated correctly?","The hikers were thirsty, yet they kept climbing.","The hikers were thirsty yet, they kept climbing.","The hikers were thirsty, they kept climbing.","The hikers, were thirsty yet they kept on climbing."),
    mcLevel(3,"Which sentence is compound?","Mia’s brother couldn’t swim, so he stayed on the dock.","Mia’s brother, who couldn’t swim, stayed on the dock all day.","Unable to swim, Mia’s brother stayed on the dock.","Mia’s brother couldn’t swim and stayed on the dock."),
    mcLevel(2,"Which sentence is compound?","The bakery sells bread; the café next door sells coffee.","The bakery sells bread and also serves coffee right next door.","The bakery and the café next door both sell bread and coffee.","The bakery sells bread that the café next door serves with coffee."),
    mcLevel(2,"Which sentence uses a comma and a joining word to make a compound sentence?","Ana forgot her lines, but the audience never noticed.","Ana forgot her lines but kept going anyway.","Ana forgot her lines, and stood still on the stage.","When Ana forgot her lines, nobody noticed.")
  ],
  rearrangeSentences:[
    mcLevel(2,"Which sentence combines these correctly? The oven beeped. Grandpa took out the bread.","The oven beeped, and Grandpa took out the bread.","The oven beeped, Grandpa took out the bread.","The oven beeped and, Grandpa took the bread.","The oven, beeped and Grandpa took out bread."),
    mcLevel(3,"Which joining word makes sense? We wore spikes on our boots, ___ the trail was icy.","for","so","yet","but"),
    mcLevel(2,"Which combined sentence keeps the meaning? The forecast called for sun. We packed umbrellas anyway.","The forecast called for sun, yet we packed umbrellas anyway.","The forecast called for sun, so we packed umbrellas anyway.","The forecast called for sun, for we packed umbrellas anyway.","The forecast called for sun, and so we packed umbrellas anyway."),
    mcLevel(2,"Which sentence combines these into one simple sentence with a compound subject? The goalie stretched before the game. The coach stretched before the game.","The goalie and the coach stretched before the game.","The goalie stretched before the game, and so did the coach.","The goalie stretched, and the coach stretched before the game.","The goalie stretched; the coach did too."),
    mcLevel(2,"Which combination is punctuated correctly? The museum was crowded. We left after an hour.","The museum was crowded; we left after an hour.","The museum was crowded; so we left after an hour.","The museum was crowded we left after an hour.","The museum was crowded so, we left after an hour."),
    mcLevel(3,"Which splits this into two simple sentences without changing the meaning? Nadia trained for months, yet she finished last.","Nadia trained for months. However, she finished last.","Nadia trained for months. So she finished last.","Nadia trained for months. Finished last.","Nadia trained for months, she finished last."),
    mcLevel(3,"Which sentence combines these into one simple sentence? The parrot whistled. The parrot bobbed its head. The parrot flapped its wings.","The parrot whistled, bobbed its head, and flapped its wings.","The parrot whistled, it bobbed its head, and it flapped its wings.","The parrot whistled; it bobbed its head; it flapped its wings.","The parrot whistled and it bobbed its head and flapped its wings."),
    mcLevel(3,"Which joining word gives a reason? We left the beach early, ___ a storm was rolling in.","for","so","yet","and so")
  ],
  complexSentences:[
    mcLevel(2,"Which sentence is complex?","The puppy whined until we opened the crate.","The puppy whined, so we finally opened the crate.","The puppy whined; we opened the crate for it.","The puppy whined and pawed at the crate door."),
    mcLevel(2,"What is the dependent clause? If the tide is low, we can walk to the island.","If the tide is low","we can walk to the island","If the tide is low, we can walk","can walk to the island"),
    mcLevel(3,"What kind of sentence is this? The goat that escaped from the pen ate Mom’s tulips.","Complex","Simple","Compound","Compound-complex"),
    mcLevel(3,"What kind of sentence is this? Jada practiced the solo for weeks, and she nailed it at the concert.","Compound","Complex","Compound-complex","Simple"),
    mcLevel(3,"Which sentence is compound-complex?","The cat hid under the bed, and the dog barked until the storm ended.","The cat hid under the bed while the dog barked at the storm.","The cat hid under the bed, and the dog barked at the storm.","When the storm began, the cat hid under the bed and shook all night long."),
    mcLevel(2,"Where does the comma go? Although the soup smelled strange it tasted wonderful.","After “strange”","After “Although”","After “tasted”","After “wonderful”"),
    mcLevel(2,"Which word group, added in the blank, makes this a complex sentence? ___, we ate dinner on the porch.","Because the kitchen was hot","The kitchen was hot","The kitchen being so hot","Hot from the oven"),
    mcLevel(3,"What kind of sentence is this? Stay inside until the thunder stops, or you could get hurt.","Compound-complex","Complex","Compound","Simple")
  ],
  subjectPredicate:[
    mcLevel(2,"What is the complete subject? The red bicycle with the flat tire leaned against the fence.","The red bicycle with the flat tire","The red bicycle","bicycle","The red bicycle with the flat tire leaned"),
    mcLevel(2,"What is the simple predicate? My cousins from Texas will arrive on Sunday.","will arrive","arrive","will arrive on Sunday","cousins"),
    mcLevel(3,"What is the simple subject? There are three owls in the barn.","owls","There","three","are"),
    mcLevel(3,"What is the complete subject? Where did your little brother hide the remote?","your little brother","the remote","your little brother hide","brother"),
    mcLevel(3,"What is the simple predicate? Will your grandparents visit us in July?","will visit","will your grandparents visit","visit us in July","grandparents"),
    mcLevel(2,"What is the complete predicate? The tired runners in the last row of the bus fell asleep before the first stop.","fell asleep before the first stop","fell asleep","The tired runners","of the bus fell asleep"),
    mcLevel(3,"What is the simple subject? A box of old photos sat in the attic.","box","photos","attic","A box of old photos"),
    mcLevel(2,"Which sentence has a compound verb?","The waves crashed against the rocks and soaked the fishermen.","The waves and the wind crashed against the rocks.","The waves crashed, and the fishermen got soaked.","The crashing waves soaked the fishermen on the rocks.")
  ],
  subjectObjects:[
    mcLevel(2,"What is the direct object? After the race, the winner hugged her exhausted coach.","coach","winner","hugged","exhausted"),
    mcLevel(2,"What is the indirect object? The museum guide showed the visitors an ancient map.","visitors","map","guide","showed"),
    mcLevel(3,"Which sentence has an indirect object?","Please pour your grandfather some tea.","Please pour some tea for Grandpa.","Please pour the tea into the cup.","Your grandfather sipped some tea."),
    mcLevel(3,"What job does “them” do in this sentence? The puppies followed them into the yard.","Direct object","Indirect object","Subject","Simple predicate"),
    mcLevel(2,"Which sentence has NO indirect object?","The magician pulled a coin from my ear.","The magician handed my little sister a coin.","The magician showed the whole crowd a card trick.","The magician threw my brother a silk scarf."),
    mcLevel(3,"What is the direct object? Did the shopkeeper sell you those apples?","apples","shopkeeper","you","sell"),
    mcLevel(3,"What is the simple subject? Across the river paddled a family of ducks.","family","river","ducks","paddled"),
    mcLevel(2,"Which words are the indirect object and the direct object, in that order? Coach Lee bought the team new jerseys.","team, jerseys","jerseys, team","Lee, team","Lee, jerseys")
  ],
  phrasesClauses:[
    mcLevel(2,"Which group of words is a clause?","while the kettle whistled","whistling on the stove","after a cup of tea","the whistling kettle on the stove"),
    mcLevel(2,"Which group of words is a phrase?","beneath the creaky stairs","the stairs creaked","as the stairs creaked","something creaked under me"),
    mcLevel(3,"How many clauses are in this sentence? When the music stopped, everyone froze, and Lily laughed.","Three","Two","One","Four"),
    mcLevel(3,"Which group of words is a clause?","whoever finishes first","finishing first","the first one to finish","to finish first"),
    mcLevel(2,"Is “because of the icy roads” a phrase or a clause?","A phrase, because it has no subject and verb","A clause, because it starts with the word because","A clause, because roads is its subject","A phrase, because it is short"),
    mcLevel(2,"Which sentence is made of one clause and some phrases, with no second clause?","In the spring, the geese return to the lake.","When spring comes, the geese return to the lake.","The geese return, and the lake fills up again.","The geese return to the lake when the ice melts."),
    mcLevel(3,"Lena wrote this as a sentence: “Waiting for the bus in the pouring rain.” What is it?","A phrase, so it is a fragment","A clause, so it is a full sentence","A dependent clause, so it is a fragment","An independent clause missing a period"),
    mcLevel(2,"Which pair lists a phrase first and then a clause?","near the river / the river rose quickly","the river rose / near the old dock","the river rose / after it rained","near the river / along the muddy bank")
  ],
  depIndepClauses:[
    mcLevel(2,"What is the independent clause? Whenever the doorbell rings, our parrot screams loudly.","our parrot screams loudly","Whenever the doorbell rings","the doorbell rings","Whenever the doorbell rings, our parrot"),
    mcLevel(2,"Which is a dependent clause?","once the paint dries","the paint dries quickly","dry paint on the wall","let the paint dry first"),
    mcLevel(2,"Which group of words is a dependent clause?","which floated down the river","floating down the river","the log floated down the river","down the river on a log"),
    mcLevel(3,"Which sentence has TWO dependent clauses?","If you see Ana, tell her that the bus is late.","If you see Ana, give her this note.","See Ana and tell her about the bus.","Ana is late, and the bus is late too."),
    mcLevel(2,"What does the dependent clause tell? Grandma will call us when the plane lands.","The time Grandma will call","The reason Grandma will call","The person who will call us","The place where the plane lands"),
    mcLevel(3,"How many independent clauses are in this sentence? Although the trail was muddy, we kept going because the view was worth it.","One","Two","Three","Zero"),
    mcLevel(3,"Which is a fragment?","The girl who found the lost puppy.","The girl found the lost puppy.","Who found the lost puppy?","Find the lost puppy."),
    mcLevel(2,"Which word starts the dependent clause? We will finish painting the mural unless it rains.","unless","painting","mural","will")
  ],
  clausePlacement:[
    mcLevel(2,"Which sentence is clear?","Hiking up the mountain, we saw an eagle.","Hiking up the mountain, an eagle was spotted by us.","Hiking up the mountain, an eagle flew over us.","An eagle, hiking up the mountain, flew over us."),
    mcLevel(2,"Which revision fixes this sentence? Sparkling in the sunlight, Mia admired the lake.","Mia admired the lake sparkling in the sunlight.","Mia, sparkling in the sunlight, admired the lake.","Sparkling, Mia admired the lake in the sunlight.","Mia sparkling in sunlight admired the lake."),
    mcLevel(2,"Which sentence is clear?","Swinging from branch to branch, the monkeys entertained the crowd.","Swinging from branch to branch, the crowd watched the monkeys.","Swinging from branch to branch, the crowd was entertained.","The crowd, swinging from branch to branch, watched the monkeys."),
    mcLevel(3,"Which revision fixes this sentence? Lucas found a wallet walking to school.","Walking to school, Lucas found a wallet.","Walking to school, a wallet was found by Lucas.","Lucas walking to school a wallet found.","A wallet walking to school was found by Lucas."),
    mcLevel(2,"Which revision fixes this sentence? The girl gave a cookie to the dog with braids.","The girl with braids gave a cookie to the dog.","The girl gave a cookie with braids to the dog.","With braids, the dog got a cookie from the girl.","The girl gave the dog with braids a cookie."),
    mcLevel(3,"What is wrong with this sentence? To win the science fair, the volcano had to erupt on cue.","It sounds like the volcano wants to win the fair.","It needs a comma after the word volcano.","It is a fragment with no main verb.","The phrase should come after the word erupt."),
    mcLevel(3,"Which revision fixes this sentence? We bought a puppy from a farmer that loves to chew socks.","From a farmer, we bought a puppy that loves to chew socks.","We bought a puppy from a farmer, who loves to chew socks.","We bought, from a farmer that loves to chew socks, a puppy.","That loves to chew socks, we bought a puppy from a farmer."),
    mcLevel(3,"Which sentence is clear?","Nervous about the test, Omar read his notes again.","Nervous about the test, Omar’s notes were read again.","Nervous about the test, the notes were read again by Omar.","Omar’s notes, nervous about the test, were read again.")
  ],
  relativeClauses:[
    mcLevel(2,"Which relative pronoun fits? The spider ___ web stretched across the door was huge.","whose","who","that","whom"),
    mcLevel(2,"What is the relative clause? The song that the band played last was my favorite.","that the band played last","The song that the band played","was my favorite","the band played last"),
    mcLevel(3,"Only the students who signed up early got front-row seats. Which sentence says that?","The students who signed up early got front-row seats.","The students, who signed up early, got front-row seats.","The students, who signed up early got front-row seats.","The students who signed up early, got front-row seats."),
    mcLevel(3,"In formal writing, which relative pronoun is correct? The scientist ___ the reporters interviewed studies volcanoes.","whom","who","which","whose"),
    mcLevel(3,"Which sentence uses “that” correctly?","The trophy that we won last spring sits in the office.","The trophy that we won it last spring sits in the office.","Our principal, that worked here for years, retired.","My dad, that drives a truck, picked us up today."),
    mcLevel(2,"Which noun does the relative clause describe? The poem that my sister wrote about the ocean won a prize.","poem","sister","ocean","prize"),
    mcLevel(3,"How many relative clauses are in this sentence? The vet who treated our cat said that the bandage must stay dry.","One","Two","Three","Zero"),
    mcLevel(2,"Which relative pronoun fits? Our neighbor’s barn, ___ was painted red last summer, burned down.","which","who","that","whom")
  ]
});
/* English Unit 9 (the 📏 Rule Library): Khan Academy Grammar, Syntax: conventions of standard English.
   Khan's 6 practice exercises in Khan's 3 lessons, in Khan's order (lesson and exercise list from khanacademy.org's
   sitemaps for the unit, Oct 30 2026). Docs: docs/ENGLISH-UNIT9.md, review list docs/ENGLISH-UNIT9-review.md */
const ENGLISH_UNIT9 = [
  {id:'subjVerbAgree',name:'Subject-verb agreement',lesson:'A verb has to match its subject: one subject takes a singular verb (The dog barks), and more than one takes a plural verb (The dogs bark). Find the real subject first. It is never inside a phrase like “of the books” or “with her friends,” so cross those out. Two subjects joined by and are plural; with or or nor, the verb matches the closer subject. Each, everyone, and one of are singular, and in a sentence that starts with There, Here, or a place phrase, the subject comes after the verb.'},
  {id:'pronAntecedent',name:'Pronoun-antecedent agreement',lesson:'A pronoun has to match the word it stands for, its antecedent: one thing takes it or its, and more than one takes they, them, or their. Find the antecedent first and skip over phrases like “of the trees.” Each, one of, and not one are singular. Two antecedents joined by and are plural; with or or nor, the pronoun matches the closer one.'},
  {id:'fragments',name:'Recognizing fragments',lesson:'A complete sentence needs a subject, a verb, and a complete thought. A fragment is missing one of them: it has no subject (Ran to the bus.), no verb (The puppy with the spotted ears.), or it starts with a word like because, when, or although and never finishes the thought (Because the bus was late.). A command like “Close the door.” is complete, because its subject, you, is understood. Fix a fragment by adding what is missing or by joining it to a complete sentence.'},
  {id:'runOns',name:'Recognizing run-ons and comma splices',lesson:'A run-on sentence jams two complete sentences together with nothing between them (The bell rang we ran outside). A comma splice joins them with only a comma (The bell rang, we ran outside). Fix either one with a period, a semicolon, a comma plus a joining word like and, but, or so, or by starting one part with a word like because or when. Words like however, then, and therefore can’t join two sentences with just a comma.'},
  {id:'danglingMods',name:'Dangling modifiers',lesson:'A describing phrase at the start of a sentence, like “Running to the bus,” describes the subject that comes right after the comma (the doer, not just the next word). If that subject can’t be doing the action, the modifier is dangling: “Running to the bus, my backpack fell open” says the backpack was running. Fix it by putting the real doer right after the comma (Running to the bus, I felt my backpack fall open) or by giving the phrase its own subject (While I was running to the bus, …).'},
  {id:'parallelStructure',name:'Parallel structure',lesson:'Parallel structure means the ideas in a list or a pair are written in the same form: all -ing words (hiking, swimming, and biking), all to-verbs, or all describing words. Pairs like either… or, neither… nor, and not only… but also need the same kind of words after each half, and a comparison compares the same kinds of things (Riding a bike is easier than driving a car).'}
];
const RULES_LESSON = `${KHAN}humanities/grammar/syntax-conventions-of-standard-english/`;
const ENGLISH_GROUPS9 = [
  {id:'agreement',hook:{emoji:'📏',title:'Welcome to the Rule Library',story:'In the Rule Library, every sentence has to follow the rules before it can go on a shelf. The first rule: words that work together have to match. “The puppies barks” sounds wrong because the subject and the verb don’t match. The library’s judge sends sentences like that to Rule Court.'},quizName:'Agreement Quiz',name:'Subject-verb agreement and pronoun-antecedent agreement',learn:'Make each verb match its subject and each pronoun match the word it stands for, even when a phrase sits in between.',skills:['subjVerbAgree','pronAntecedent'],
    extraLessons:[{name:'Pronoun-antecedent agreement (video)',lesson:'A short video on making a pronoun match the word it stands for.',url:`${RULES_LESSON}subject-verb-agreement-and-pronoun-antecedent-agreement/v/pronoun-antecedent-agreement-syntax-khan-academy`}]},
  {id:'fragments',hook:{emoji:'🧩',title:'Too little, too much',story:'Some sentences come to the Rule Library missing a piece: no subject, no verb, or a thought that just stops. Others arrive as two sentences crashed into one, with no mark to keep them apart. A fragment needs a missing piece; a run-on needs a fence.'},quizName:'Fragments and run-ons Quiz',name:'Fragments and run-ons',learn:'Tell a complete sentence from a fragment, and fix run-ons and comma splices.',skills:['fragments','runOns'],
    extraLessons:[{name:'Run-ons and comma splices (video)',lesson:'A short video on run-on sentences and comma splices, and how to fix them.',url:`${RULES_LESSON}fragments-and-run-ons/v/run-ons-and-comma-splices-syntax-khan-academy`}]},
  {id:'modifiers',hook:{emoji:'🪝',title:'Say what you mean',story:'“Flying over the city, the buildings looked tiny.” Were the buildings flying? A describing phrase hooks onto whatever comes right after the comma. And in a list, every item has to wear the same uniform: hiking, swimming, and biking, not hiking, swimming, and to bike.'},quizName:'Dangling modifiers and parallel structure Quiz',name:'Dangling modifiers and parallel structure',learn:'Put the right doer after an opening phrase, and keep lists and pairs in the same form.',skills:['danglingMods','parallelStructure'],
    extraLessons:[{name:'Parallel structure (video)',lesson:'A short video on keeping lists and pairs in the same form.',url:`${RULES_LESSON}dangling-modifiers-and-parallel-structure/v/parallel-structure-syntax-khan-academy`}]}
];
const RULE_QUESTIONS = {
  subjVerbAgree:[
    qLevel(1,"Which verb fits? The puppies in the window ___ at everyone who walks by.","bark","barks","is barking","has barked"),
    qLevel(1,"Which sentence has correct subject-verb agreement?","My sister plays the drums.","My sister play the drums.","My sisters plays drums.","My sister are drumming."),
    qLevel(1,"Which word is the subject that the verb has to agree with? The box of crayons is on the table.","box","crayons","table","crayons and table"),
    qLevel(2,"Which verb fits? Each of the kittens ___ its own blanket.","has","have","are having","were having"),
    qLevel(2,"Which verb fits? Neither my brothers nor my dad ___ seafood.","likes","like","are liking","were liking"),
    qLevel(2,"Which sentence is correct in formal writing?","There are three eggs in the nest.","There is three eggs in the nest.","There’s three eggs in the nest.","Here is three eggs in the nest."),
    qLevel(2,"Which verb fits? Maya and her cousin ___ to the library every Saturday.","walk","walks","is walking","has walked"),
    qLevel(2,"Which word is the subject of this sentence? Along the fence grow three tall sunflowers.","sunflowers","fence","grow","tall"),
    qLevel(3,"Which sentence has a subject-verb agreement error?","The list of chores are taped to the fridge.","The chores on the list are easy.","One of my chores is feeding the fish.","Everyone in my family has a chore."),
    qLevel(3,"Which verb fits? One of the girls who sing in the choir ___ a solo tonight.","has","have","get","were having"),
    qLevel(3,"Which verb fits? Either the twins or their older sister ___ the dog every morning.","walks","walk","are walking","have walked"),
    qLevel(3,"Which revision fixes the error? The flowers in the vase on the windowsill needs water.","The flowers in the vase on the windowsill need water.","The flowers in the vase on the windowsill needing water.","The flower in the vases on the windowsill need water.","The flowers in the vase on the windowsills needs water."),
    qLevel(3,"Which sentence is correct?","Everybody on both teams was cheering.","Everybody on both teams were cheering.","Everybody on both teams are cheering.","Everybody on both teams have cheered."),
    qLevel(3,"Which verb fits? Under the bed ___ a pair of socks and an old shoe.","are","is","was","has been")
  ],
  pronAntecedent:[
    qLevel(1,"Which pronoun fits? The girls packed ___ own lunches.","their","her","its","his"),
    qLevel(1,"What is the antecedent of “it”? The library lent me a book, and it was due on Friday.","book","library","me","Friday"),
    qLevel(1,"Which sentence is correct?","The dog wagged its tail.","The dog wagged their tail.","The dog wagged it’s tail.","The dog wagged they’re tail."),
    qLevel(2,"Which pronoun fits? Each of the bikes has a bell on ___ handlebars.","its","their","his","it’s"),
    qLevel(2,"Which pronoun fits? The class, working as one group, finished ___ mural before lunch.","its","their","it’s","they’re"),
    qLevel(2,"Which pronoun fits? Leo and Sam forgot ___ jackets on the bus.","their","his","there","they’re"),
    qLevel(2,"Which pronoun fits? Neither the cat nor the puppies ate ___ food.","their","its","her","his"),
    qLevel(2,"Which sentence has a pronoun that doesn’t agree with its antecedent?","One of the lamps lost their shade.","Both lamps lost their shades.","The lamp lost its shade.","Each lamp has its own price tag."),
    qLevel(3,"Which pronoun fits? Either Grandpa’s old trucks or his new car will need ___ tires checked.","its","their","it’s","they’re"),
    qLevel(3,"Which revision fixes the pronoun error? Every one of the trees dropped their leaves by November.","Every one of the trees dropped its leaves by November.","Every one of the trees dropped their leaves.","Every one of the tree dropped their leaves by November.","Every one of the trees dropped they’re leaves by November."),
    qLevel(3,"In which sentence does the pronoun agree with its antecedent?","The box of old letters has lost its lid.","The box of old letters has lost their lid.","The boxes of old letters have lost its lids.","The box of old letters lost their lid."),
    qLevel(3,"Which pronoun fits? The museum and the zoo both lowered ___ prices for kids.","their","its","her","his"),
    qLevel(3,"Which sentence has a pronoun error?","Neither of the windows had their screen in place.","Both windows had their screens in place.","No window in the hall had its screen.","The windows had lost their screens."),
    qLevel(3,"Which pronoun fits? Not one of the forty paintings in the gallery had ___ price on the wall.","its","their","it’s","his")
  ],
  fragments:[
    qLevel(1,"Which is a complete sentence?","The bus stopped at the corner.","Stopped at the corner.","The bus at the corner.","The yellow bus by the school."),
    qLevel(1,"What is missing from this fragment? Ran all the way to the park.","A subject","A verb","An end mark","A capital letter"),
    qLevel(1,"Which word group is a fragment?","After the game ended.","The game ended.","We left after the game ended.","The game ended at noon."),
    qLevel(2,"What is missing from this fragment? The tall girl with the red backpack.","A verb that tells what she did","A subject that tells who","A word like because","A comma after girl"),
    qLevel(2,"Why is this a fragment? When the lights went out.","It starts with when and doesn’t finish the thought.","It has no subject.","It is missing a verb.","It is too short to be a sentence."),
    qLevel(2,"Which revision fixes the fragment? Because it was raining.","Because it was raining, we played inside.","Because it was raining outside.","Because it was cold, wet, and raining.","Because it rained all afternoon."),
    qLevel(2,"Which is a complete sentence?","Running down the hall, Mia slipped.","Running down the hall to the gym after lunch.","Mia, running down the hall.","The girl running down the hall."),
    qLevel(2,"How many fragments are in this passage? We went to the zoo. Saw the lions. The baby giraffe was my favorite. Because it was so tall.","2","1","3","0"),
    qLevel(3,"Which is NOT a fragment?","Although it was late, the store was still open.","Although it was late and the store was still open.","The store, which was still open even though it was late.","Still open, although it was late at night."),
    qLevel(3,"Which revision fixes the fragment? The puppy chewed my shoe. Which was brand new.","The puppy chewed my shoe, which was brand new.","The puppy chewed my shoe. Which, was brand new.","The puppy chewed my shoe; which was brand new.","The puppy chewed. My shoe, which was brand new."),
    qLevel(3,"Which word group is a fragment?","The kids who built the tree house last summer.","The kids built the tree house last summer.","Last summer, the kids built a tree house in the yard.","Who built the tree house last summer?"),
    qLevel(3,"Which is a complete sentence?","Stop right there.","To stop right there.","Stopping right there.","The one stopping right there."),
    qLevel(3,"Which is a fragment?","Hoping to see a shooting star.","We hoped to see a shooting star.","Hope for a shooting star.","We were hoping to see one."),
    qLevel(3,"Which revision fixes the fragment? Our dog, a shaggy mutt named Biscuit.","Our dog is a shaggy mutt named Biscuit.","Our dog, who is a shaggy mutt named Biscuit.","A shaggy mutt named Biscuit, our pet dog.","Our dog and a shaggy mutt named Biscuit.")
  ],
  runOns:[
    qLevel(1,"Which is a run-on sentence?","The sun came out we went swimming.","The sun came out, and we went swimming.","The sun came out. We went swimming.","When the sun came out, we went swimming."),
    qLevel(1,"What is a comma splice?","Two sentences joined with only a comma","A list with too many commas in it","A sentence missing its verb","A comma between a city and a state"),
    qLevel(1,"Which sentence is a comma splice?","I love soup, it warms me up.","I love soup because it warms me up.","I love soup; it warms me up.","I love soup, for it warms me up."),
    qLevel(2,"Which revision fixes the run-on? The movie was long I fell asleep.","The movie was long, so I fell asleep.","The movie was long, I fell asleep.","The movie was long so, I fell asleep.","The movie, was long I fell asleep."),
    qLevel(2,"Which revision does NOT fix the comma splice? We packed the car, we drove to the lake.","We packed the car, then we drove to the lake.","We packed the car; we drove to the lake.","We packed the car, and we drove to the lake.","After packing the car, we drove to the lake."),
    qLevel(2,"Which sentence is correct?","My cat is shy; she hides under the bed.","My cat is shy, she hides under the bed.","My cat is shy she hides under the bed.","My cat is shy; and she hides under the bed."),
    qLevel(2,"What kind of error is in this sentence? Grandma baked bread, it smelled amazing.","A comma splice","A fragment","A dangling modifier","A pronoun error"),
    qLevel(2,"Which mark fixes the run-on? The bell rang___ the students rushed out.",";",",","?","no mark"),
    qLevel(3,"Which sentence is a run-on?","We wanted to play outside however it was raining.","We wanted to play outside; however, it was raining.","We wanted to play outside, but it was raining.","Although we wanted to play outside, it was raining."),
    qLevel(3,"Which sentence is correct?","Sam studied hard, so he aced the test.","Sam studied hard, he aced the test.","Sam studied hard, therefore he aced the test.","Sam studied hard he aced the test."),
    qLevel(3,"Which is NOT a run-on or a comma splice?","When the storm passed, we checked on the horses.","The storm passed, we checked on the horses.","The storm passed we checked on the horses.","The storm passed, then we checked on the horses."),
    qLevel(3,"Which revision fixes this run-on and correctly shows what caused what? The power went out the food in the freezer melted.","Because the power went out, the food in the freezer melted.","The power went out, the food in the freezer melted.","The power went out because the food in the freezer melted.","The power went out, because, the food in the freezer melted."),
    qLevel(3,"How many complete sentences are jammed into this run-on? My brother plays soccer my sister swims I take karate.","3","2","1","4"),
    qLevel(3,"Which sentence is a comma splice?","Mr. Diaz smiled at the class, everyone had passed.","Mr. Diaz smiled at the class, for everyone had passed.","Mr. Diaz smiled; everyone had passed.","Smiling at the class, Mr. Diaz said that everyone had passed.")
  ],
  danglingMods:[
    qLevel(1,"An opening phrase like “Walking home,” describes which part of the sentence?","The subject right after the comma","The noun at the very end","The verb in the sentence","The noun right before the comma"),
    qLevel(1,"Which sentence has a dangling modifier?","Barking loudly, the mail was dropped.","Barking loudly, the dog scared the mail carrier.","The dog barked loudly at the mail carrier.","The mail carrier dropped the mail."),
    qLevel(1,"Which sentence is correct?","Walking home, I saw a rainbow.","Walking home, a rainbow appeared.","Walking home, the rainbow was seen.","Walking home, a rainbow was in the sky."),
    qLevel(2,"Read it the way it is written: who or what is eating popcorn? Eating popcorn, the movie seemed even better to Jada.","The movie","Jada","The popcorn","The theater"),
    qLevel(2,"The dog, not Mom, is muddy. Which revision fixes the sentence? Covered in mud, Mom washed the dog.","Mom washed the dog, which was covered in mud.","Covered in mud, Mom washed the dog.","Covered in mud, the dog was washing Mom.","Mom, covered in mud, washed the dog."),
    qLevel(2,"Which sentence has a dangling modifier?","After finishing my homework, the TV was turned on.","After finishing my homework, I turned on the TV.","After I finished my homework, I turned on the TV.","I turned on the TV after finishing my homework."),
    qLevel(2,"Which sentence is correct?","While I was hiking up the hill, my legs got tired.","Hiking up the hill, my legs got tired.","Hiking up the hill, tiredness hit my legs.","While hiking up the hill, my legs got tired."),
    qLevel(2,"Why is this a dangling modifier? Flying over the city, the buildings looked tiny.","It says the buildings were flying.","It needs a semicolon.","The verb looked should be look.","Flying should be the word flew."),
    qLevel(3,"Which revision fixes the dangling modifier? Having lost the key, the door wouldn’t open.","Having lost the key, we couldn’t open the door.","Having lost the key, the door couldn’t be opened.","The door wouldn’t open, having lost the key.","Having lost the key, the door wouldn’t open for us."),
    qLevel(3,"Which sentence does NOT have a dangling modifier?","To win the contest, Ella practiced every day.","To win the contest, practice was needed every day.","To win the contest, every day was spent practicing.","To win the contest, daily practice was Ella’s plan."),
    qLevel(3,"Which sentence has a dangling modifier?","At the age of five, my family moved to Ohio.","At the age of five, I moved to Ohio with my family.","When I was five, my family moved to Ohio.","My family moved to Ohio when I was five."),
    qLevel(3,"Which revision keeps the meaning and fixes the error? Tired after the long game, the bus ride home felt endless.","Tired after the long game, the players felt the bus ride home was endless.","Tired after the long game, the bus ride home seemed to feel endless to all of us.","The bus ride home, tired after the long game, felt endless.","Tired after the long game, the bus felt the ride home was endless."),
    qLevel(3,"In which sentence does the opening phrase describe the right person?","Holding the trophy high, Coach Kim smiled for the camera.","Holding the trophy high, the camera flashed at Coach Kim.","Holding the trophy high, a smile spread across Coach Kim’s face.","Holding the trophy high, the photo showed Coach Kim smiling."),
    qLevel(3,"Which sentence is correct?","Once covered with frosting, the cake sat on the table.","Once covered with frosting, Dad set the cake on the table.","Once covered with frosting, the table held the birthday cake.","Once covered with frosting, we set out plates for the cake.")
  ],
  parallelStructure:[
    qLevel(1,"Which sentence has parallel structure?","I like hiking, swimming, and biking.","I like hiking, swimming, and to bike.","I like to hike, swimming, and biking.","I like hiking, to swim, and bike rides."),
    qLevel(1,"What does parallel structure mean?","Items in a list or pair use the same form.","Every sentence in a paragraph is about the same length.","Two sentences are joined by a semicolon.","Each item in a list starts with a capital."),
    qLevel(1,"Which word keeps the list parallel? Our dog likes running, digging, and ___.","napping","to nap","naps","a nap"),
    qLevel(2,"Which sentence is NOT parallel?","The coach told us to stretch, to drink water, and that we should rest.","The coach told us to stretch, drink water, and rest.","The coach told us to stretch, to drink water, and to rest.","The coach told us that we should stretch, drink water, and rest."),
    qLevel(2,"Which revision fixes the faulty parallelism? Mia is smart, funny, and has kindness.","Mia is smart, funny, and kind.","Mia is smart, funny, and acts kindly.","Mia is smart, being funny, and kind.","Mia is smart, funny, and kindly."),
    qLevel(2,"Which sentence is parallel?","We can walk to the park or ride our bikes.","We can walk to the park or riding bikes.","We can walk to the park or by bike.","We can walk to the park, or bike riding."),
    qLevel(2,"Which choice completes the sentence with parallel structure? The recipe says to chop the onions, stir the sauce, and ___.","boil the pasta","you should boil the pasta","boiling the pasta","boils the pasta"),
    qLevel(2,"Which sentence uses either… or correctly?","You can either read a book or write a story.","You can either read a book or writing a story.","Either you can read a book or write a story.","You can either read a book or a story to write."),
    qLevel(3,"Which sentence uses not only… but also correctly?","She not only sings but also plays the piano.","She not only sings but also playing the piano.","Not only does she sing but also plays the piano.","She not only sings but also the piano."),
    qLevel(3,"Which sentence has a parallel comparison?","Riding a bike is easier than driving a car.","Riding a bike is easier than to drive a car.","To ride a bike is easier than driving a car.","Riding a bike is easier than a car."),
    qLevel(3,"Which sentence is parallel?","The museum was crowded, noisy, and too warm.","The museum was crowded, noisy, and it was too warm.","The museum was crowded, had noise, and too warm.","The museum was crowded, noisy, and warmth."),
    qLevel(3,"Which revision fixes the faulty parallelism? Our goals are to read more, exercising daily, and that we eat better.","Our goals are to read more, to exercise daily, and to eat better.","Our goals are reading more, to exercise daily, and eating better.","Our goals are to read more, exercise daily, and that we eat better.","Our goals are to read more, exercising daily, and to eat better."),
    qLevel(3,"Which sentence uses neither… nor correctly?","The puppy neither ate its food nor drank its water.","The puppy neither ate its food nor its water.","Neither the puppy ate its food nor drank its water.","The puppy neither ate its food nor drinking its water."),
    qLevel(3,"Which sentence has parallel structure?","I would rather stay home than go to the mall.","I would rather stay home than going to the mall.","I would rather staying home than go to the mall.","I would rather stay home than a trip to the mall.")
  ]
};
/* English Unit 9 (Rule Library): reserved test pool, Oct 30, 2026 (48 test-only questions; docs/ENGLISH-UNIT9-review.md, "Reserved test pool"). */
reserveForTest(RULE_QUESTIONS, {
  subjVerbAgree:[
    mcLevel(2,"Which verb fits? The jar of buttons on Grandma’s sewing table ___ almost empty.","is","are","were","have been"),
    mcLevel(3,"Which verb fits? Neither the coach nor the players ___ happy with the referee’s call.","were","was","is","has been"),
    mcLevel(2,"Which sentence has correct subject-verb agreement?","The players on the soccer team practice after school.","The players on the soccer team practices after school.","The player on the soccer team practice after school.","The players on the soccer team is practicing after school."),
    mcLevel(3,"Which word is the subject that the verb has to agree with? Near the back of the old barn sits a rusty tractor with two flat tires.","tractor","barn","tires","back"),
    mcLevel(3,"Which sentence has a subject-verb agreement error?","The cost of the concert tickets were too high for us.","The tickets for the concert were too costly for us.","Each of the concert tickets was too costly for us.","Neither of the concert tickets was cheap enough for us."),
    mcLevel(3,"Which verb fits? A stack of old magazines and a broken lamp ___ in the corner of the attic.","sit","sits","is sitting","has sat"),
    mcLevel(2,"Which verb fits? Here ___ the keys to the shed that you asked for.","are","is","was","has been"),
    mcLevel(2,"Which revision fixes the error? One of the mugs in the cupboard have a chip on the rim.","One of the mugs in the cupboard has a chip on the rim.","One of the mugs in the cupboard have a chipped rim.","One of the mugs in the cupboard were chipped on the rim.","Both of the mugs in the cupboard has a chip on the rim.")
  ],
  pronAntecedent:[
    mcLevel(2,"Which pronoun fits? The robins in the maple tree are building ___ nest out of grass and string.","their","its","her","they’re"),
    mcLevel(2,"Which pronoun fits? One of the drawers in the old desk won’t close because ___ handle is loose.","its","their","it’s","they’re"),
    mcLevel(3,"Which pronoun fits? Neither the lamp nor the two fans had ___ cords plugged in.","their","its","it’s","they’re"),
    mcLevel(3,"Which sentence has a pronoun that does NOT agree with its antecedent?","Each of the puzzles was missing a few of their pieces.","Both puzzles were missing a few of their pieces.","The puzzle on the shelf was missing a few of its pieces.","The puzzle in the closet had most of its pieces."),
    mcLevel(2,"What is the antecedent of “their”? The kittens in the basket next to the old dog opened their eyes for the first time.","kittens","basket","dog","eyes"),
    mcLevel(3,"Which revision fixes the pronoun error? The chairs and the table had a layer of dust on it.","The chairs and the table had a layer of dust on them.","The chairs and the table had dust on its top.","The chairs and the table had dust on it’s top.","The chair and the tables had a layer of dust on it."),
    mcLevel(3,"Which pronoun fits? Either the hamsters or the rabbit will have ___ cage cleaned first.","its","their","it’s","there"),
    mcLevel(2,"Which sentence is correct?","Every window in the classroom had its blinds closed.","Every window in the classroom had their blinds closed.","Every window in the classroom had it’s blinds closed.","Every one of the windows had their blinds closed.")
  ],
  fragments:[
    mcLevel(3,"Which is a complete sentence?","Behind the shed grew a wild pumpkin vine.","Behind the old red shed, a wild pumpkin vine.","A wild pumpkin vine growing behind the shed.","The pumpkin vine that grew behind the shed."),
    mcLevel(2,"What is missing from this fragment? Carried the heavy boxes up to the attic.","A subject that tells who did it","A verb that tells the action","A joining word like and","A comma after boxes"),
    mcLevel(2,"Which word group is a fragment?","Since the library closes early on Sundays.","The library closes early on Sundays.","Since the library closes early, we went on Saturday.","Does the library close early on Sundays?"),
    mcLevel(3,"Which is NOT a fragment?","Whoever finishes first gets to pick the music.","Whoever finishes first and picks the music.","The kid who finishes first and gets to pick the music.","Because whoever finishes first gets to pick the music."),
    mcLevel(3,"How many fragments are in this passage? Our class planted a garden. Tomatoes, beans, and peppers. Water it every day. Unless it rains. Then we skip it. Which is fine with us.","3","2","4","1"),
    mcLevel(2,"Which revision fixes the fragment? The coach gave us a speech. Before the big game started.","Before the big game started, the coach gave us a speech.","The coach gave us a speech; before the big game had started.","The coach, before the big game started. Gave us a speech.","Before the big game started and the coach gave us a speech."),
    mcLevel(3,"Which word group is a fragment?","The trail that winds along the river past the old mill.","The trail winds along the river past the old mill.","Follow the trail along the river past the old mill.","Where does the trail along the river past the mill go?"),
    mcLevel(2,"Why is this a fragment? Shivering in the cold wind at the bus stop.","It has no subject or main verb.","It starts with a word like because or when.","It is missing a mark at the end.","It has too many describing words.")
  ],
  runOns:[
    mcLevel(2,"Which sentence is a run-on?","The puppy chased its tail it never caught it.","The puppy chased its tail but never caught it.","The puppy chased its tail, but it never caught it.","The puppy chased its tail; it never caught it."),
    mcLevel(3,"Which sentence is correct?","The trail was muddy; nevertheless, we finished the hike.","The trail was muddy, nevertheless, we still finished the hike.","The trail was muddy, nevertheless we finished the hike.","The trail was muddy nevertheless, we finished the hike."),
    mcLevel(2,"What kind of error is in this sentence? Our team lost the game we still had fun.","A run-on sentence","A comma splice","A fragment","A pronoun error"),
    mcLevel(2,"Which revision does NOT fix the run-on? The museum was closed we visited the park instead.","The museum was closed, we visited the park instead.","The museum was closed, so we visited the park instead.","Since the museum was closed, we visited the park instead.","The museum was closed, and we visited the park instead."),
    mcLevel(3,"Which sentence is a comma splice?","Lena wanted to join the band, she had never played an instrument.","Lena wanted to join the band, yet she had never played an instrument.","Lena wanted to join the band even though she had never played an instrument.","Lena, who had never played, wanted to join the band."),
    mcLevel(3,"Which revision fixes the comma splice and shows the right connection? The bridge was icy, the bus took the long way.","The bridge was icy, so the bus took the long way.","The bridge was icy, but the bus took the long way.","The bridge was icy, then the bus took the long way.","The bridge was icy, the bus, took the long way."),
    mcLevel(2,"How many complete sentences are jammed into this run-on? We opened the box inside was a tiny kitten.","2","1","3","4"),
    mcLevel(3,"Which sentence is NOT a run-on or a comma splice?","Dad fixed the sink and then cleaned up the kitchen.","Dad fixed the sink then he cleaned the kitchen.","Dad fixed the sink, then he cleaned the kitchen.","Dad fixed the sink, he cleaned up the kitchen.")
  ],
  danglingMods:[
    mcLevel(2,"Which sentence has a dangling modifier?","Stirring the soup, the kitchen filled with steam.","Stirring the soup, Abuela hummed a song.","While Abuela stirred the soup, the kitchen filled with steam.","The kitchen filled with steam as Abuela stirred the soup."),
    mcLevel(2,"Read it the way it is written: who or what is reading the map? Reading the map carefully, the campsite was easy for Dev to find.","The campsite","Dev","The map","The trail"),
    mcLevel(3,"Which revision fixes the dangling modifier? Painted bright red, the neighbors admired our new front door.","Painted bright red, our new front door impressed the neighbors.","Painted bright red, the neighbors admired our brand-new front door.","The neighbors, painted bright red, admired our new front door.","Painted bright red, our neighbors admired the new front door."),
    mcLevel(2,"Which sentence is correct?","Searching for her glasses, Grandma found them on her head.","Searching for her glasses, they were found on Grandma’s head.","Searching for her glasses, Grandma’s head was where they were.","Searching for her glasses, Grandma’s glasses turned up on her head."),
    mcLevel(3,"Which sentence does NOT have a dangling modifier?","Before leaving for school, Omar packed his lunch.","Before leaving for school, Omar’s lunch was packed.","Before leaving for school, his lunch was packed by Omar.","Before leaving for school, the lunch Omar packed was ready."),
    mcLevel(3,"Which sentence has a dangling modifier?","As a new student, the hallways confused me.","As a new student, I was confused by the hallways.","When I was a new student, the hallways confused me.","The hallways confused me when I was new."),
    mcLevel(2,"Read it the way it is written. What does this sentence say by mistake? Covered in sprinkles, I bit into the donut.","That I was covered in sprinkles","That the donut bit me","That the sprinkles bit the donut","That someone else ate the donut"),
    mcLevel(2,"Which revision fixes the dangling modifier? Sweating in the hot sun, the trail seemed to go on forever.","Sweating in the hot sun, the hikers thought the trail went on forever.","The trail, sweating in the hot sun, seemed to go on forever.","Sweating in the hot sun, the trail seemed to go on and on for the tired hikers.","Sweating in the hot sun, the trail went on forever for hikers.")
  ],
  parallelStructure:[
    mcLevel(2,"Which choice keeps the list parallel? At the beach, my little brother likes to build castles, to collect shells, and ___ in the waves.","to splash","splashing","splashes","splash around"),
    mcLevel(2,"Which sentence has parallel structure?","The guide told us to stay on the path, to watch for snakes, and to carry water.","The guide told us to stay on the path, watch for snakes, and that we should carry water.","The guide told us staying on the path, to watch for snakes, and carry water.","The guide told us to stay on the path, watch for snakes, and carrying water."),
    mcLevel(3,"Which sentence uses both… and correctly?","The new phone is both lighter and faster than the old one.","The new phone is both lighter and it is faster.","The new phone both is lighter and faster than mine.","Both the new phone is lighter and is faster than mine."),
    mcLevel(3,"Which sentence has a parallel comparison?","The library’s hours are longer than the museum’s.","The library’s hours are longer than the museum is.","The hours of the library are longer than the museum.","The library has hours that are longer than the museum."),
    mcLevel(2,"Which revision fixes the faulty parallelism? The new student was polite, helpful, and had a lot of patience.","The new student was polite, helpful, and patient.","The new student was polite, helpful, and patiently.","The new student was polite, helpful, and showed patience.","The new student was polite, being helpful, and patient."),
    mcLevel(3,"Which sentence is parallel?","Tomás couldn’t decide whether to join the chess club or to try out for the play.","Tomás couldn’t decide whether to join the chess club or a tryout for the play.","Tomás couldn’t decide whether joining the chess club or to try out for the play.","Tomás couldn’t decide whether to join the chess club or if he should try out for the play."),
    mcLevel(2,"Which choice completes the sentence with parallel structure? Before the trip, we washed the car, packed the snacks, and ___.","checked the tires","checking the tires","to check the tires","we check the tires"),
    mcLevel(2,"Which sentence is NOT parallel?","Ana enjoys painting with watercolors and to sketch in pencil.","Ana enjoys painting in watercolors and sketching in pencil.","Ana likes to paint with watercolors and to sketch in pencil.","Ana likes to paint with watercolors and sketch in pencil.")
  ]
});
/* English Unit 10 (the 🪶 Style Library): Khan Academy Grammar, Usage and style. Khan's unit has one lesson, Style!,
   with 4 videos and 2 practices (Khan's lesson sitemap, Oct 30 2026): the sound video and The sound of language, then
   the formality, under- and overstatement, and irony videos and Style and technique. Pet World splits that lesson at
   its first practice into two blocks so each practice gets its own quiz. Docs: docs/ENGLISH-UNIT10.md, review list
   docs/ENGLISH-UNIT10-review.md. 21 questions a practice (9 at level 3), because the unit has only two. */
const ENGLISH_UNIT10 = [
  {id:'soundOfLanguage',name:'The sound of language',lesson:'Writers use sound to make words stick. Alliteration repeats the same first consonant sound in words close together (silly snakes slither). Assonance repeats the same vowel sound inside nearby words (the rain came late). Onomatopoeia is a word that sounds like the noise it names (buzz, hiss, thud). Listen for sounds, not letters: “funny photos” alliterates because f and ph make the same sound, but “city cats” doesn’t, because the c in city sounds like s.'},
  {id:'styleTechnique',name:'Style and technique',lesson:'Match your words to your reader. The scale of formality runs from casual (a text to a friend: slang like “gonna” or “kinda”) to formal (a letter to a principal: complete sentences, no slang), and a piece of writing should stay at one level. Overstatement makes something sound much bigger than it is (my backpack weighs a ton); understatement makes something big sound small (calling a blizzard “a bit chilly”). Irony is a gap between what is said or expected and what is true: verbal irony says the opposite of what you mean, situational irony is when the opposite of what you expect happens (not just bad luck), and dramatic irony is when the reader knows something a character doesn’t.'}
];
const ENGLISH_GROUPS10 = [
  {id:'sound',hook:{emoji:'🎙️',title:'Welcome to the Style Library',story:'The Style Library runs its own radio station, WPET. On the radio, nobody can see the words, so they have to sound good. “Big brown bears” bounces. “The kettle hissed” lets you hear the kettle. Writers choose words for their sound, not just their meaning.'},quizName:'The sound of language Quiz',name:'The sound of language',learn:'Hear alliteration, assonance and onomatopoeia, and tell them apart by sound, not by spelling.',skills:['soundOfLanguage']},
  {id:'technique',hook:{emoji:'🎛️',title:'Turn the dial',story:'WPET’s callers write in every style. A text from a friend can say “gonna,” but a letter to the mayor can’t. A caller who says “I’ve told you a million times” is turning the volume up; one who calls a blizzard “a bit chilly” is turning it down. And sometimes a caller says “Great weather!” in a thunderstorm and means the opposite.'},quizName:'Style and technique Quiz',name:'Style and technique',learn:'Pick the right level of formality, spot overstatement and understatement, and tell verbal, situational and dramatic irony apart.',skills:['styleTechnique']}
];
const STYLE_QUESTIONS = {
  soundOfLanguage:[
    qLevel(1,"Which line uses alliteration?","Six slippery seals slid south.","The gray seal dove under the waves.","A tired otter napped beside a log.","Our dog barked at the mail truck."),
    qLevel(1,"Which word is an example of onomatopoeia?","thud","fall","heavy","floor"),
    qLevel(1,"What is assonance?","The same vowel sound repeated in words close together","The same first consonant sound repeated in words close together","A word that sounds like the noise it describes","Saying something big as if it were small"),
    qLevel(1,"Which word in this sentence is onomatopoeia? The bees buzzed and hovered over the garden all afternoon.","buzzed","hovered","garden","afternoon"),
    qLevel(2,"Which word starts with the same sound as “phone”?","fish","pony","hope","pail"),
    qLevel(2,"Which line is built mainly on assonance?","The rain came late to the valley.","Wild wolves wander the woods.","Bang! The door slammed shut.","Penny packed popcorn."),
    qLevel(2,"Why is “hiss” an example of onomatopoeia?","It sounds like the noise it names.","It starts with the same sound as the words near it.","It repeats a vowel sound from a nearby word.","It makes something sound much bigger than it is."),
    qLevel(2,"Which sentence uses onomatopoeia?","The kettle hissed on the stove.","The kettle sang on the stove.","The kettle was loud tonight.","The kettle made a noise."),
    qLevel(2,"Which device does this line use? Bright kites glide high in the sky.","assonance","alliteration","onomatopoeia","overstatement"),
    qLevel(2,"Which word would add alliteration to the sentence? The ___ snake slid across the sand.","sneaky","green","long","quiet"),
    qLevel(2,"Why might a writer use onomatopoeia in a story?","To let the reader hear what is happening","To make the story sound more formal and serious","To show a character means the opposite of what she says","To make a small problem sound like a huge one"),
    qLevel(2,"Which line has two examples of onomatopoeia?","The cows mooed while the gate creaked.","The cows ate while the farmer sang.","The cows mooed as the farmer slept.","The cows stood by the fence."),
    qLevel(3,"Which words in this line alliterate? Clever crows cawed, cackling from the roof.","clever, crows, cawed, and cackling","clever, crows, and cawed","crows, cawed, and roof","crows, cawed, cackling, and roof"),
    qLevel(3,"Which line has NO alliteration, even though its words start with the same letter?","Cindy chose cake.","Cindy sold cider.","Kate kept cookies.","Chris collected crabs."),
    qLevel(3,"Which pair of words shows assonance?","“goat” and “bowl”","“goat” and “gate”","“bowl” and “ball”","“gate” and “mat”"),
    qLevel(3,"Which line uses both alliteration and onomatopoeia?","The bees buzzed by the busy barn.","The busy bees flew by the big brown barn.","The kettle hissed on the stove.","The fat cat sat on a mat."),
    qLevel(3,"Which word repeats the vowel sound in “moon”?","blue","wood","mouse","moan"),
    qLevel(3,"Which of these words is NOT onomatopoeia?","shout","crash","thump","sizzle"),
    qLevel(3,"Which devices does this line use? “Splish, splash, the puppies played in puddles.”","onomatopoeia and alliteration","alliteration and irony","onomatopoeia and irony","assonance and understatement"),
    qLevel(3,"Which word could fill the blank to add assonance? The old boat ___ low in the water.","rode","bobbed","sat","dipped"),
    qLevel(3,"In which line does the alliteration use two different spellings for the same sound?","Funny photos fill the frame.","Pink peppers popped up.","Cool cats clapped.","Silly seals sang songs at sunset."),
    qLevel(2,"Which line repeats the same vowel sound in nearby words?","Sweet green leaves need sleep.","Big brown bears bounced around.","Crunch! The dry leaves broke apart.","The tired fox ran all the way home."),
    qLevel(2,"Which word in this sentence is onomatopoeia? The rain pattered and trickled down the tin roof all night.","pattered","trickled","roof","night"),
    qLevel(3,"Which line uses alliteration, assonance and onomatopoeia all at once?","Buzz! Busy bees seek sweet treats.","Busy bees seek sweet treats.","Buzz! The bees found some flowers.","Bees buzz near the blue bush."),
    qLevel(3,"Which pair of words does NOT alliterate?","“giant” and “goat”","“city” and “center”","“game” and “gold”","“chef” and “shoe”"),
    qLevel(3,"Which word could fill the blank to add onomatopoeia? The bacon ___ in the pan.","sizzled","cooked","browned","curled"),
    qLevel(3,"Which device is this line built on? The low tone of the foghorn rolled over the boats.","assonance (the long o sound)","alliteration (the f sound)","onomatopoeia (the word rolled)","overstatement (the foghorn is huge)")
  ],
  styleTechnique:[
    qLevel(1,"Which sentence is the most formal?","I would like to request a meeting with you on Friday.","Hey, can we meet up Friday?","Let’s meet up Friday after school.","Yo, so can we maybe meet up on Friday after school or whatever?"),
    qLevel(1,"Which sentence is an overstatement?","My backpack weighs a ton.","My backpack is heavy today.","My backpack has six books in it.","I carried my backpack to school."),
    qLevel(1,"What is verbal irony?","Saying the opposite of what you mean","When the reader knows something a character doesn’t","When the opposite of what you expect happens","Making something sound bigger than it is"),
    qLevel(1,"A tornado just tore the roof off the barn. Which comment is an understatement?","“Looks like we had a little wind.”","“That tornado destroyed everything we own!”","“The tornado tore the roof off the barn.”","“That was the worst storm in a million years.”"),
    qLevel(2,"Which word fits best in a letter to the mayor? Our class is ___ about the new park.","excited","psyched up","stoked","hyped"),
    qLevel(2,"Which revision makes this sentence more formal? The science fair was kinda awesome.","The science fair was impressive.","The science fair was super awesome.","The science fair was totally rad.","The science fair was, like, awesome."),
    qLevel(2,"A fire station burns down. What kind of irony is this?","Situational: the opposite of what you expect happens.","Verbal: someone says the opposite of what they mean.","Dramatic: the reader knows something a character doesn’t.","Understatement: something big is made to sound small."),
    qLevel(2,"In a movie, the audience sees the wolf hide in Grandma’s bed, but Red Riding Hood walks in smiling. What kind of irony is this?","dramatic irony","verbal irony","situational irony","overstatement"),
    qLevel(2,"Which sentence uses overstatement?","This homework will take me a thousand years.","This homework will take me about an hour.","This homework has twelve problems on it.","This homework is the last thing I have to do before I can go outside."),
    qLevel(2,"It is pouring rain. Max looks outside and says, “Great day for a picnic.” What is this?","verbal irony","dramatic irony","situational irony","onomatopoeia"),
    qLevel(2,"Which reader would expect the most formal writing?","A judge reading a letter about a court case","Your best friend reading a text","Your little cousin reading a birthday card","Your team reading a group chat about Saturday’s practice"),
    qLevel(2,"What does the overstatement really mean? “I’m so hungry I could eat a horse.”","The speaker is very hungry.","The speaker is joking.","The speaker is a little hungry.","The speaker would truly eat a horse."),
    qLevel(3,"Which sentence does NOT fit the style of this letter? Dear Principal Ortiz, I am writing to ask for a longer lunch period. Many students do not have enough time to finish eating. Honestly, the lines are bonkers. Thank you for considering this request.","Honestly, the lines are bonkers.","I am writing to ask for a longer lunch period.","Many students do not have enough time to finish eating.","Thank you for considering this request."),
    qLevel(3,"Which revision of “Honestly, the lines are bonkers.” fits a formal letter?","The lunch lines are often very long.","The lunch lines are often super long, for real.","The lunch lines are way too long.","The lines are bonkers, if you ask me."),
    qLevel(3,"Mia studies all week for the spelling bee. She spells every hard word right, then misspells her own last name. What kind of irony is this?","situational irony","verbal irony","dramatic irony","overstatement"),
    qLevel(3,"Which is the best example of situational irony?","A swimming coach who is afraid of water","A rainy day on the morning of a picnic","A girl who loses her keys at the mall","A dog that barks loudly at the mail carrier each day"),
    qLevel(3,"Which sentence is an understatement?","After running a marathon, Leo said, “My legs are a little tired.”","After a short walk, Leo said, “My legs are a little tired.”","After running a marathon, Leo said, “I could run a hundred more miles!”","After running a marathon, Leo said, “My legs are so sore that I can barely stand.”"),
    qLevel(3,"Which sentence is an overstatement, not a literal statement?","The line for the roller coaster stretched to the moon.","The line for the roller coaster took forty minutes.","The line for the roller coaster wrapped around the fence twice.","The line for the roller coaster was the longest in the park."),
    qLevel(3,"In which situation would “Nice job” most likely be verbal irony?","Your brother drops all the groceries, and you say, “Nice job.”","Your brother scores a goal, and you say, “Nice job.”","Your brother cleans his room, and you say, “Nice job.”","Your brother finishes a hard puzzle all by himself, and you say, “Nice job.”"),
    qLevel(3,"A text to a friend says, “Can’t make it, sry!” Which version fits an email to a teacher?","I’m sorry, but I won’t be able to attend.","Sorry!! I’m busy then, my bad.","Can’t make it, sorry, see ya.","Sorry, I can’t make it to that thing, so just count me out."),
    qLevel(3,"In a play, Theo plans a surprise party for his sister. Which detail creates dramatic irony?","The audience saw his sister find the invitation, but Theo thinks she has no clue.","Theo drops the cake and says, “Well, that went perfectly,” to his friends.","Theo’s sister, who plans parties for a living, forgets her own party.","Theo bakes a cake and hides it in the garage."),
    qLevel(2,"Which sentence is an understatement?","Winning the state title was pretty nice.","Winning the state title was the best thing ever.","We won the state title on Saturday.","Winning the state title made the whole world shake."),
    qLevel(2,"Which word fits best in a report for your science teacher? The results were ___.","surprising","totally wild","super weird","nuts"),
    qLevel(3,"A sign at the library says “Quiet, please!” in huge letters, and the librarian shouts it across the room. What kind of irony is this?","situational irony","verbal irony","dramatic irony","understatement"),
    qLevel(3,"In a story, readers know the bridge ahead is out, but the driver is happily singing. What kind of irony is this, and why?","Dramatic, because readers know what the driver doesn’t","Situational, because a bridge being out is unexpected","Verbal, because the driver says the opposite of what he means","Dramatic, because something bad is about to happen"),
    qLevel(3,"Which revision keeps this email to a coach formal? “hey coach, gonna miss practice, sorry!!”","Dear Coach Lee, I will miss practice today. I apologize.","Dear Coach Lee, gonna miss practice today, sorry!!","Hey Coach Lee, I am going to miss practice today, sorry about that!","Coach Lee, can’t make it today. Sorry about that!"),
    qLevel(3,"After a three-hour storm knocked out the power, Dad said, “Well, that was a little breezy.” What is Dad using?","understatement","overstatement","dramatic irony","onomatopoeia")
  ]
};
/* English Unit 10 (Style Library): reserved test pool, Oct 30, 2026 (20 test-only questions; docs/ENGLISH-UNIT10-review.md, "Reserved test pool"). */
reserveForTest(STYLE_QUESTIONS, {
  soundOfLanguage:[
    mcLevel(2,"Which word in this sentence is onomatopoeia? The campfire crackled and flickered while owls called from the pines.","crackled","flickered","called","pines"),
    mcLevel(2,"Which line is built mainly on alliteration?","Darting dragonflies dipped down to the ditch.","The deep green sea was clean.","Plop! A stone dropped into the lake.","A pair of dragonflies rested on a leaf near the water."),
    mcLevel(3,"Listen for sounds, not letters. Which pair of words alliterates (starts with the same sound)?","“gem” and “jar”","“gym” and “go”","“chorus” and “chair”","“cent” and “kite”"),
    mcLevel(3,"Listen for sounds, not spelling. Which pair of words shares a vowel sound?","“steak” and “grape”","“steak” and “beak”","“grape” and “grab”","“heard” and “hearth”"),
    mcLevel(2,"Which line is built mainly on assonance?","Joan sold her old coat.","Gus grabbed green grapes from the garden.","Squeak! The gate swung open in the wind.","Joan paid for the scarf with cash."),
    mcLevel(2,"What makes this line sound musical? Lou flew to the zoo in June.","The same vowel sound repeats in nearby words.","The same first sound repeats in nearby words.","One word in it imitates a noise.","The trip is made to sound much bigger than it was."),
    mcLevel(3,"Which devices does this line use? “Zip! Five bright kites rise high.”","onomatopoeia and assonance","onomatopoeia and alliteration","alliteration and understatement","assonance and overstatement"),
    mcLevel(3,"How many words in this line begin with the s sound? Cecil saw seven shiny circles.","four: Cecil, saw, seven, circles","five: Cecil, saw, seven, shiny, circles","three: saw, seven, shiny","two: saw and seven"),
    mcLevel(3,"Read the poem. Line 1: The brook babbles by the big stones. Line 2: Gurgle! Splash! goes the stream. Line 3: Slow and low it rolls through the meadow. Line 4: Down to a lake by the hill. Which line is built mainly on assonance?","Slow and low it rolls through the meadow.","The brook babbles by the big stones.","Gurgle! Splash! goes the stream.","Down to a lake by the hill."),
    mcLevel(2,"A writer wants readers to hear an old car. Which sentence does that with onomatopoeia?","The old car sputtered all the way up the hill.","The old car struggled up the hill.","The old car crept slowly up the steep hill.","The old car was noisy on the hill.")
  ],
  styleTechnique:[
    mcLevel(2,"Which sentence fits best in a thank-you note to the nurse who cared for your grandmother?","Thank you for the care you gave my grandmother last week.","Thanks a ton for the care you gave Grandma last week!","Thank you for being so awesome to my grandmother last week.","Thank you for the care you gave my grandma, you were the best!"),
    mcLevel(2,"Which words best fill the blank on a sign in a museum? Visitors may not ___ the paintings.","touch","lay a finger on","fiddle with","mess with"),
    mcLevel(3,"Which sentence keeps this news report at one level of formality? The city council met on Tuesday to discuss the new bus routes. Several residents spoke in favor of the plan. ___","The council will vote on the routes next month.","The council will vote on the routes next month, which is kinda soon.","They’ll vote on the whole deal soon.","The council’s gonna vote on the routes next month."),
    mcLevel(2,"Which sentence uses overstatement?","Grandpa’s truck is older than the dinosaurs.","Grandpa’s truck is older than I am.","Grandpa’s truck is thirty years old.","Grandpa’s truck is the oldest one on our street."),
    mcLevel(3,"Ana’s cake sank in the middle, burned black, and set off the smoke alarm. She says, “It’s not my best work.” What does Ana really mean?","The cake turned out terribly.","It was a bit off.","She is proud of how her cake came out.","The cake needs a few more minutes in the oven."),
    mcLevel(2,"Jonah gets a flat tire on his bike, then drops his phone in a puddle. Which line from Jonah is verbal irony?","“This is turning into a fantastic morning.”","“This morning keeps getting worse and worse.”","“My phone is wet and my tire is flat.”","“This is the worst morning in the history of the world.”"),
    mcLevel(3,"A town puts up a big new sign that says “Keep Our Park Clean.” Which detail would make the story situational irony?","The crew leaves a pile of trash right under the sign.","A storm knocks the sign over a week later.","The mayor points at some litter and jokes that the park is “spotless.”","Readers know a raccoon is hiding behind the sign, but the crew doesn’t."),
    mcLevel(2,"In a movie, Nora brags to her friends that her brother will never find her diary. The audience has already watched him read it. What kind of irony is this?","dramatic irony","situational irony","verbal irony","understatement"),
    mcLevel(3,"A student writes to the school librarian: “yo, can u hold that dragon book 4 me? thx.” Which revision is formal and still says which book she wants?","Could you please hold the dragon book for me? Thank you.","Could you please hold the dragon book for me? Thx!","Can you hold that dragon book for me? Thanks a bunch!","Please hold the book for me. Thank you."),
    mcLevel(2,"Which writing task calls for the most casual style?","A note on the fridge telling your brother you went to the park","An email asking your principal about joining the chess club","A letter to the newspaper about a pothole on your street","A thank-you letter to the author who visited your school")
  ]
});
/* ---------- end of the moved banks ---------- */

export {
  ENGLISH_UNIT1, ENGLISH_GROUPS, ENGLISH_UNIT2, ENGLISH_GROUPS2, ENGLISH_UNIT3, ENGLISH_GROUPS3, ENGLISH_UNIT4, ENGLISH_GROUPS4, ENGLISH_UNIT5, ENGLISH_GROUPS5, ENGLISH_UNIT6, ENGLISH_GROUPS6,
  ENGLISH_UNIT7, ENGLISH_GROUPS7, COLON_QUESTIONS,
  ENGLISH_UNIT8, ENGLISH_GROUPS8, SENTENCE_QUESTIONS,
  ENGLISH_UNIT9, ENGLISH_GROUPS9, RULE_QUESTIONS,
  ENGLISH_UNIT10, ENGLISH_GROUPS10, STYLE_QUESTIONS,
  HISTORY_UNIT1, HISTORY_GROUPS, HISTORY_UNIT2, HISTORY_GROUPS2, HISTORY_UNIT3, HISTORY_GROUPS3, HISTORY_UNIT4, HISTORY_GROUPS4, HISTORY_UNIT5, HISTORY_GROUPS5, HISTORY_UNIT6, HISTORY_GROUPS6,
  BIO_UNIT1, BIO_GROUPS, BIO_UNIT2, BIO_GROUPS2, BIO_UNIT3, BIO_GROUPS3, BIO3_QUESTIONS,
  BIO_UNIT4, BIO_GROUPS4, BIO4_QUESTIONS,
  BIO_UNIT5, BIO_GROUPS5, BIO5_QUESTIONS,
  HISTORY_UNIT7, HISTORY_GROUPS7, HISTORY7_QUESTIONS,
  HISTORY_QUESTIONS, HISTORY2_QUESTIONS, HISTORY3_QUESTIONS, HISTORY4_QUESTIONS, HISTORY5_QUESTIONS, BIO1_QUESTIONS, BIO2_QUESTIONS, PLURAL_QUESTIONS, VERB_QUESTIONS, PRONOUN_QUESTIONS, MODIFIER_QUESTIONS, PREPOSITION_QUESTIONS, PUNCTUATION_QUESTIONS, HISTORY6_QUESTIONS,
  HISTORY_UNIT8, HISTORY_GROUPS8, HISTORY8_QUESTIONS,
  HISTORY_UNIT9, HISTORY_GROUPS9, HISTORY9_QUESTIONS,
  KHAN, KHAN_LINKS, KHAN_VIDEOS, mc
};

/* ---------- teacher lesson links and question edits (docs: LESSON-CONTENT.md) ---------- */

/* The courses that have question banks, in the order the teacher app lists them. */
export const LESSON_COURSES = [
  {id:'nouns', title:'English Unit 1: Nouns', skills:ENGLISH_UNIT1, groups:ENGLISH_GROUPS},
  {id:'verbs', title:'English Unit 2: Verbs', skills:ENGLISH_UNIT2, groups:ENGLISH_GROUPS2},
  {id:'pronouns', title:'English Unit 3: Pronouns', skills:ENGLISH_UNIT3, groups:ENGLISH_GROUPS3},
  {id:'modifiers', title:'English Unit 4: Adjectives and Adverbs', skills:ENGLISH_UNIT4, groups:ENGLISH_GROUPS4},
  {id:'prepositions', title:'English Unit 5: Prepositions and Interjections', skills:ENGLISH_UNIT5, groups:ENGLISH_GROUPS5},
  {id:'punctuation', title:'English Unit 6: Punctuation', skills:ENGLISH_UNIT6, groups:ENGLISH_GROUPS6},
  {id:'colons', title:'English Unit 7: Colons, Semicolons, and More', skills:ENGLISH_UNIT7, groups:ENGLISH_GROUPS7},
  {id:'sentences', title:'English Unit 8: Sentences and Clauses', skills:ENGLISH_UNIT8, groups:ENGLISH_GROUPS8},
  {id:'conventions', title:'English Unit 9: Conventions of Standard English', skills:ENGLISH_UNIT9, groups:ENGLISH_GROUPS9},
  {id:'style', title:'English Unit 10: Usage and Style', skills:ENGLISH_UNIT10, groups:ENGLISH_GROUPS10},
  {id:'history', title:'History Unit 1: Origins of History', skills:HISTORY_UNIT1, groups:HISTORY_GROUPS},
  {id:'history2', title:'History Unit 2: Early Humans', skills:HISTORY_UNIT2, groups:HISTORY_GROUPS2},
  {id:'history3', title:'History Unit 3: Early Agrarian Societies', skills:HISTORY_UNIT3, groups:HISTORY_GROUPS3},
  {id:'history4', title:'History Unit 4: Empires and Belief Systems', skills:HISTORY_UNIT4, groups:HISTORY_GROUPS4},
  {id:'history5', title:'History Unit 5: Regional Webs', skills:HISTORY_UNIT5, groups:HISTORY_GROUPS5},
  {id:'history6', title:'History Unit 6: The First Global Age', skills:HISTORY_UNIT6, groups:HISTORY_GROUPS6},
  {id:'history7', title:'History Unit 7: The Long Nineteenth Century', skills:HISTORY_UNIT7, groups:HISTORY_GROUPS7},
  {id:'history9', title:'History Unit 9: Globalization', skills:HISTORY_UNIT9, groups:HISTORY_GROUPS9},
  {id:'bio1', title:'Biology Unit 1: Life Sciences', skills:BIO_UNIT1, groups:BIO_GROUPS},
  {id:'bio2', title:'Biology Unit 2: Organism Growth and Reproduction', skills:BIO_UNIT2, groups:BIO_GROUPS2},
  {id:'bio3', title:'Biology Unit 3: Matter and Energy in Organisms', skills:BIO_UNIT3, groups:BIO_GROUPS3},
  {id:'bio4', title:'Biology Unit 4: Cell Division and Life Cycles', skills:BIO_UNIT4, groups:BIO_GROUPS4},
  {id:'bio5', title:'Biology Unit 5: Inheritance and Variation', skills:BIO_UNIT5, groups:BIO_GROUPS5},
  {id:'history8', title:'History Unit 8: Global Conflict', skills:HISTORY_UNIT8, groups:HISTORY_GROUPS8}
];

/* The built-in bank for a course, the same lookup englishQuestions() uses in the game. */
export function builtInBank(courseId){
  if (courseId === 'history8') return HISTORY8_QUESTIONS;
  if (courseId === 'colons') return COLON_QUESTIONS;
  if (courseId === 'sentences') return SENTENCE_QUESTIONS;
  if (courseId === 'conventions') return RULE_QUESTIONS;
  if (courseId === 'style') return STYLE_QUESTIONS;
  if (courseId === 'bio4') return BIO4_QUESTIONS;
  if (courseId === 'bio5') return BIO5_QUESTIONS;
  return courseId === 'bio1' ? BIO1_QUESTIONS : courseId === 'bio2' ? BIO2_QUESTIONS : courseId === 'bio3' ? BIO3_QUESTIONS
    : courseId === 'history6' ? HISTORY6_QUESTIONS
    : courseId === 'history7' ? HISTORY7_QUESTIONS
    : courseId === 'history5' ? HISTORY5_QUESTIONS : courseId === 'history4' ? HISTORY4_QUESTIONS : courseId === 'history3' ? HISTORY3_QUESTIONS
    : courseId === 'history2' ? HISTORY2_QUESTIONS : courseId === 'history' ? HISTORY_QUESTIONS
    : courseId === 'history9' ? HISTORY9_QUESTIONS
    : courseId === 'verbs' ? VERB_QUESTIONS : courseId === 'pronouns' ? PRONOUN_QUESTIONS : courseId === 'modifiers' ? MODIFIER_QUESTIONS : courseId === 'prepositions' ? PREPOSITION_QUESTIONS : courseId === 'punctuation' ? PUNCTUATION_QUESTIONS : PLURAL_QUESTIONS;
}

/* Every place a lesson shows a Khan link: one per block, plus each extra reading in that block.
   The key is how lesson_links stores the teacher's link: "<courseId>:<groupId>" or "<courseId>:<groupId>:<n>". */
export function lessonLinkSlots(courseId){
  const course = LESSON_COURSES.find(item => item.id === courseId);
  if (!course) return [];
  return course.groups.flatMap(group => [
    {key:`${courseId}:${group.id}`, name:group.name, khan:KHAN_LINKS[courseId]?.[group.id] || '', skills:group.skills},
    ...(group.extraLessons || []).map((lesson, index) => ({key:`${courseId}:${group.id}:${index + 1}`, name:lesson.name, khan:lesson.url || '', skills:group.skills}))
  ]);
}
export const khanSearchUrl = name => `${KHAN}search?page_search_query=${encodeURIComponent(String(name).replace(/\s*[|·].*$/, ''))}`;

/* A teacher's lesson link, or null if it isn't usable. Only https:// links are accepted. */
export function validLessonLink(link){
  if (!link || typeof link !== 'object' || typeof link.url !== 'string') return null;
  let url;
  try { url = new URL(link.url.trim()); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  return {url:url.href, title:text(link.title, 100), note:text(link.note, 200), showKhan:link.showKhan !== false};
}

export const QUESTION_LIMITS = {prompt:300, answer:120};
/* A question from question_edits, or null if it is incomplete. options[0] is the correct answer. */
export function validQuestion(item){
  if (!item || typeof item !== 'object' || typeof item.prompt !== 'string' || !item.prompt.trim()) return null;
  if (!Array.isArray(item.options) || item.options.length !== 4 || item.options.some(option => typeof option !== 'string' || !option.trim())) return null;
  const difficulty = [1, 2, 3].includes(item.difficulty) ? item.difficulty : undefined;
  return {prompt:item.prompt.trim(), options:item.options.map(option => option.trim()), difficulty};
}

/* Built-in questions plus one class's question_edits, exactly as students get them.
   Each built-in question gets an id from its prompt and correct answer (two built-in questions in one
   lesson can share a prompt). Hidden ones are dropped, edited ones swapped in under the same id, and the
   teacher's approved questions added at the end. With {includeHidden:true} (teacher app) hidden questions
   stay in the list with hidden:true; with {includeDrafts:true} drafts are included too.
   Results have the shape mc() makes, plus id, difficulty and source ('built-in', 'edited' or 'teacher'). */
export function applyQuestionEdits(courseId, skillId, builtIn, edits, {includeHidden = false, includeDrafts = false} = {}){
  const safe = edits && typeof edits === 'object' ? edits : {};
  const hidden = new Set(Array.isArray(safe.hidden) ? safe.hidden : []);
  const edited = safe.edited && typeof safe.edited === 'object' ? safe.edited : {};
  const seen = new Map(), result = [];
  for (const question of builtIn || []) {
    let id = questionId(courseId, skillId, question.prompt, question.options[question.answer]);
    const copies = (seen.get(id) || 0) + 1; seen.set(id, copies);
    if (copies > 1) id += `-${copies}`;
    const isHidden = hidden.has(id);
    if (isHidden && !includeHidden) continue;
    const edit = validQuestion(edited[id]);
    const item = edit
      ? {...question, prompt:edit.prompt, options:edit.options, answer:0, difficulty:edit.difficulty ?? question.difficulty, id, source:'edited'}
      : {...question, options:[...question.options], id, difficulty:question.difficulty, source:'built-in'};
    if (includeHidden) item.hidden = isHidden;
    result.push(item);
  }
  const added = safe.added && typeof safe.added === 'object' ? safe.added[`${courseId}:${skillId}`] : null;
  for (const mine of Array.isArray(added) ? added : []) {
    const valid = validQuestion(mine);
    if (!valid || typeof mine.id !== 'string') continue;
    if (mine.status !== 'approved' && !includeDrafts) continue;
    result.push({prompt:valid.prompt, options:valid.options, answer:0, difficulty:valid.difficulty, id:mine.id, source:'teacher', status:mine.status});
  }
  return result;
}
