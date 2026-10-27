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
const KHAN = 'https://www.khanacademy.org/';
const GRAMMAR = `${KHAN}humanities/grammar/parts-of-speech-the-`, WORLD = `${KHAN}humanities/world-history/x66f79d8a:`, BIO6 = `${KHAN}science/grade-6-science/x88f5990a7622d8f5:life-sciences/x88f5990a7622d8f5:`;
/* every Khan video in each lesson (History and Biology: the videos come first; docs/PRACTICE-TIME.md). Checked Oct 27 2026. */
const KHAN_VIDEOS = {
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
  }
};
const KHAN_LINKS = {
  nouns:{intro:`${GRAMMAR}noun/grammar-nouns/v/introduction-to-nouns-the-parts-of-speech-grammar-khan-academy`,types:`${GRAMMAR}noun/types-of-nouns/v/common-and-proper-nouns`,irregularBase:`${GRAMMAR}noun/irregular-plural-nouns-base-plurals-and-irregular-endings/v/irregular-plural-nouns-part-i-the-parts-of-speech-grammar-khan-academy`,irregularForeign:`${GRAMMAR}noun/irregular-plural-nouns-mutant-and-foreign-plurals/v/irregular-plural-nouns-part-iv-the-parts-of-speech-grammar`},
  verbs:{foundation:`${GRAMMAR}verb/introduction-to-verbs/v/introduction-to-verbs-the-parts-of-speech-grammar`,irregular:`${GRAMMAR}verb/irregular-verbs/v/introduction-to-irregular-verbs-the-parts-of-speech-grammar`,aspect:`${GRAMMAR}verb/verb-aspect-simple-progressive-and-perfect/v/intro-to-aspect`,aspectModal:`${GRAMMAR}verb/verb-aspect-and-modal-verbs/v/perfect-progressive-aspect-the-parts-of-speech-grammar`},
  pronouns:{intro:`${GRAMMAR}pronoun/introduction-to-pronouns/v/what-is-a-pronoun-the-parts-of-speech-grammar`,possessive:`${GRAMMAR}pronoun/possessive-and-reflexive-pronouns/v/possessive-pronouns-the-parts-of-speech-grammar`,relative:`${GRAMMAR}pronoun/relative-pronouns/v/relative-pronouns-the-parts-of-speech-grammar`,caseNumber:`${GRAMMAR}pronoun/subject-object-person-and-number/v/subject-and-object-pronouns-the-parts-of-speech-grammar`,indefinite:`${GRAMMAR}pronoun/indefinite-pronouns-pronoun-vagueness-and-emphatic-pronouns/v/indefinite-pronouns-the-parts-of-speech-grammar`},
  modifiers:{intro:`${GRAMMAR}modifier/introduction-to-adjectives-and-articles/v/intro-to-adjectives-v1`,adverbs:`${GRAMMAR}modifier/introduction-to-adverbs/v/intro-to-adverbs`,order:`${GRAMMAR}modifier/adjective-order-and-commas-with-adjectives/v/adjective-order`,degree:`${GRAMMAR}modifier/comparative-superlative-intensifiers-and-adverbs-of-degree/v/intro-to-the-comparative-and-the-superlative-v2`},
  prepositions:{prepositions:'https://www.khanacademy.org/ela/5th-and-6th-grade-grammar/x90cef5375e9bcad6:prepositions-and-interjections-5/x90cef5375e9bcad6:prepositions-and-prepositional-phrases-5/v/meet-the-preposition',interjections:'https://www.khanacademy.org/ela/5th-and-6th-grade-grammar/x90cef5375e9bcad6:prepositions-and-interjections-5/x90cef5375e9bcad6:interjections-5/a/interjections-5'},
  punctuation:{endCommas:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/introduction-to-commas/v/three-ways-to-end-a-sentence-punctuation-khan-academy`,spaceTime:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/commas-in-space-and-time/v/salutations-and-valedictions-the-comma-punctuation-khan-academy`,moreCommas:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/more-ways-to-use-commas/v/more-uses-for-commas-the-comma-punctuation-khan-academy`,apostrophes:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/apostrophes-and-contractions/v/introduction-to-the-apostrophe-the-apostrophe-punctuation-khan-academy`,possessive:`${KHAN}humanities/grammar/punctuation-the-comma-and-the-apostrophe/introduction-to-the-possessive/v/introduction-to-the-possessive-the-apostrophe-punctuation-khan-academy`},
  history:{stories:`${WORLD}origins-of-history/x66f79d8a:history-stories-1-1/v/meet-oer-project-world-history`,frames:`${WORLD}origins-of-history/x66f79d8a:history-frames-1-3/v/frame-concept-introduction-world-history-project-beta`,memory:`${WORLD}origins-of-history/x66f79d8a:history-and-memory-1-4/a/activity-opener-worst-day-ever`},
  history2:{earliestHumans:`${WORLD}early-humans/x66f79d8a:the-earliest-humans-2-1/a/activity-opener-then-vs-now`,migrationArt:`${WORLD}early-humans/x66f79d8a:migration-and-art-2-2/a/activity-opener-who-s-an-authority`,foragingSocieties:`${WORLD}early-humans/x66f79d8a:foraging-societies-2-3/a/activity-opener-what-is-this-asking-introduction-origins`,agriculturalRevolution:`${WORLD}early-humans/x66f79d8a:the-agricultural-revolution-2-4/a/activity-opener-which-frame`,biggestMistake:`${WORLD}early-humans/x66f79d8a:the-biggest-mistake-humans-ever-made-2-5/a/activity-opener-casual-map-jack-and-the-giant-beanstalk`},
  history3:{earlyAmericas:`${WORLD}early-agrarian-societies/x66f79d8a:ancient-mesoamerica/a/article-ancient-agrarian-societies-mesoamerica-olmec-and-chavin-de-huantar`,ancientIndia:`${WORLD}early-agrarian-societies/x66f79d8a:indus-river-valley/a/article-ancient-agrarian-societies-indus-river-valley`,earlyAgrarian:`${WORLD}early-agrarian-societies/x66f79d8a:early-agrarian-societies-in-context/a/activity-contextualization-agrarian-societies`},
  history5:{overview5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:collapse-and-restructuring-5-1/a/activity-opener-vocabulary-match-up`,collapse5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:why-do-empires-collapse-5-2/a/activity-opener-causes-of-collapse-wh`,darkAges5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:assessing-the-dark-ages-5-3/a/activity-opener-what-s-in-a-name`,europe5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-europe-and-china-5-4/a/activity-opener-whom-do-you-trust`,china5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:systems-restructure-in-china-5-4/a/article-china-under-the-tang-and-ming-dynasties`,islam5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-islamic-world-5-6/a/activity-opener-mapping-beliefs`,silk5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:the-silk-roads-5-7/a/activity-opener-world-travelers`,expand5:`${KHAN}humanities/world-history/x66f79d8a:regional-webs/x66f79d8a:expanding-the-silk-roads-5-8/a/activity-opener-what-s-in-your-suitcase`},   // the start of each Khan lesson (checked on khanacademy.org, Oct 27 2026)
  history4:{overview4:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:empires-and-belief-systems-4-1/a/activity-opener-sacred-symbols`,portableBelief:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-portable-belief-systems/a/activity-opener-belief-vs-religion`,confucianism:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:china-confucianism-legalism-and-daoism-4-3/a/article-confucianism`,hinduBuddhism:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:hinduism-and-buddhism-4-4/a/article-hinduism`,judaismChristianity:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:judaism-and-christianity-4-5/a/article-judaism`,islam:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:islam-4-6/a/article-islam`,comparePortable:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-portable-belief-systems-4-7/a/activity-comparison-belief-systems`,religionsChange:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:how-do-religions-grow-and-change-4-3/a/activity-opener-spot-the-difference`,persiaGreece:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-persians-and-greeks/a/activity-opener-organizing-evidence`,mauryaGupta:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-mauryan-and-gupta/a/article-the-mauryan-and-gupta-empires`,imperialChina:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:ancient-empires-zhou-and-qin/a/article-the-zhou-and-qin-empires`,compareEmpires:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:comparing-ancient-empires-4-4/a/activity-empire-building`,romeAndHan:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:rome-and-han-china-4-5/a/activity-opener-trade-in-the-ancient-world`,riseFall:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:the-rise-and-fall-of-empires/v/comparison-rise-of-empires`,womenAncient:`${KHAN}humanities/world-history/x66f79d8a:empires-and-belief-systems/x66f79d8a:women-in-the-ancient-world-4-15/a/activity-opener-take-a-guess`},   // the start of each Khan lesson (checked on khanacademy.org, Oct 27 2026)
  bio1:{cells:`${BIO6}cellular-organization/v/ms-cells-and-organisms`,plants:`${BIO6}reproduction-in-plants/v/ms-plant-reproductive-success`,digestion:`${BIO6}human-digestive-system/e/digestion-in-humans-and-herbivores`},
  bio2:{traits:`${KHAN}science/ms-biology/x0c5bb03129646fd6:organism-growth-and-reproduction/x0c5bb03129646fd6:sexual-and-asexual-reproduction/v/ms-sexual-and-asexual-reproduction`,growth:`${KHAN}science/ms-biology/x0c5bb03129646fd6:organism-growth-and-reproduction/x0c5bb03129646fd6:plant-reproductive-success/v/ms-plant-reproductive-success`}   // Middle school biology, checked Oct 20 2026
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
/* ---------- end of the moved banks ---------- */

export {
  ENGLISH_UNIT1, ENGLISH_GROUPS, ENGLISH_UNIT2, ENGLISH_GROUPS2, ENGLISH_UNIT3, ENGLISH_GROUPS3, ENGLISH_UNIT4, ENGLISH_GROUPS4, ENGLISH_UNIT5, ENGLISH_GROUPS5, ENGLISH_UNIT6, ENGLISH_GROUPS6,
  HISTORY_UNIT1, HISTORY_GROUPS, HISTORY_UNIT2, HISTORY_GROUPS2, HISTORY_UNIT3, HISTORY_GROUPS3, HISTORY_UNIT4, HISTORY_GROUPS4, HISTORY_UNIT5, HISTORY_GROUPS5,
  BIO_UNIT1, BIO_GROUPS, BIO_UNIT2, BIO_GROUPS2,
  HISTORY_QUESTIONS, HISTORY2_QUESTIONS, HISTORY3_QUESTIONS, HISTORY4_QUESTIONS, HISTORY5_QUESTIONS, BIO1_QUESTIONS, BIO2_QUESTIONS, PLURAL_QUESTIONS, VERB_QUESTIONS, PRONOUN_QUESTIONS, MODIFIER_QUESTIONS, PREPOSITION_QUESTIONS, PUNCTUATION_QUESTIONS,
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
  {id:'history', title:'History Unit 1: Origins of History', skills:HISTORY_UNIT1, groups:HISTORY_GROUPS},
  {id:'history2', title:'History Unit 2: Early Humans', skills:HISTORY_UNIT2, groups:HISTORY_GROUPS2},
  {id:'history3', title:'History Unit 3: Early Agrarian Societies', skills:HISTORY_UNIT3, groups:HISTORY_GROUPS3},
  {id:'history4', title:'History Unit 4: Empires and Belief Systems', skills:HISTORY_UNIT4, groups:HISTORY_GROUPS4},
  {id:'history5', title:'History Unit 5: Regional Webs', skills:HISTORY_UNIT5, groups:HISTORY_GROUPS5},
  {id:'bio1', title:'Biology Unit 1: Life Sciences', skills:BIO_UNIT1, groups:BIO_GROUPS},
  {id:'bio2', title:'Biology Unit 2: Organism Growth and Reproduction', skills:BIO_UNIT2, groups:BIO_GROUPS2}
];

/* The built-in bank for a course, the same lookup englishQuestions() uses in the game. */
export function builtInBank(courseId){
  return courseId === 'bio1' ? BIO1_QUESTIONS : courseId === 'bio2' ? BIO2_QUESTIONS
    : courseId === 'history5' ? HISTORY5_QUESTIONS : courseId === 'history4' ? HISTORY4_QUESTIONS : courseId === 'history3' ? HISTORY3_QUESTIONS
    : courseId === 'history2' ? HISTORY2_QUESTIONS : courseId === 'history' ? HISTORY_QUESTIONS
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
