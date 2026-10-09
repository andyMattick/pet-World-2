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
  {id:'basePlurals', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'Some nouns use the same form for one and for more than one.', name:'Irregular plural nouns: the base plural'},
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
    {prompt:'Two towns tell you different stories about the same battle. You are writing your history. What is a useful first step?',options:['Choose the older story automatically.','Compare each account’s perspective and supporting evidence.','Assume both accounts describe every detail.','Ignore the community that left fewer written records.'],answer:1},
    {prompt:'A sailor hands you a letter written by someone who saw the battle. What can this letter show you?',options:['One person’s perspective and some evidence about the event.','Every person’s experience of the event.','That the writer’s memory is perfectly accurate.','That no other sources are needed.'],answer:0},
    {prompt:'A visitor asks why your history of Greece starts in a different place than another writer’s. How do you explain it?',options:['A different starting point can highlight different people, changes, or questions.','Only one starting point is allowed in history.','The earliest date is always the most important.','Starting points change what actually happened.'],answer:0},
    {prompt:'You are deciding what to write in your history. Which statement is the best-supported claim?',options:['Everyone remembers the event the same way.','This source proves every detail about the past.','Several sources describe the change, though they emphasize different experiences.','One account is true because it is the longest.'],answer:2}
  ],
  historyScale:[
    {prompt:'In one town you write down a single family’s story of moving across the desert. Which scale is this?',options:['A close, local scale.','A global scale only.','A century-wide scale only.','A comparison with no people.'],answer:0},
    {prompt:'A reporter from the future asks what you notice when you “zoom out” and look at all your travels together.',options:['Patterns connecting many places or communities.','The exact thoughts of one person.','Details that no source records.','That local experiences do not matter.'],answer:0},
    {prompt:'A ruler claims the trade route you traveled changed many communities. How could you test that claim?',options:['Look for evidence from multiple connected places.','Use one object and assume it explains everything.','Ignore evidence that does not fit.','Ask only whether the route was long.'],answer:0},
    {prompt:'Your student asks why you keep switching between close-up stories and big-picture views. What do you say?',options:['Different scales reveal different details and patterns.','One scale makes all evidence unnecessary.','Wide views always prove local causes.','Close views cannot include evidence.'],answer:0}
  ],
  historyFrames:[
    {prompt:'You want to write about how families and villages built shared customs. Which frame fits best?',options:['Communities.','Networks.','Production and distribution.','Weather only.'],answer:0},
    {prompt:'You want to trace how silk, ideas, and news moved between places. Which frame fits best?',options:['Communities.','Networks.','One person’s daily routine only.','A list of rulers only.'],answer:1},
    {prompt:'You want to explain who made iron tools and how they reached farmers. Which frame fits best?',options:['Production and distribution.','Collective memory only.','A single battle only.','A family tree only.'],answer:0},
    {prompt:'A young scribe asks why you bother choosing a frame for a big, messy event. What do you tell them?',options:['It focuses attention on one useful set of details and questions.','It guarantees one complete explanation.','It removes the need to compare sources.','It makes every other perspective incorrect.'],answer:0}
  ],
  historyMemory:[
    {prompt:'A child asks you what “collective memory” means. What do you say?',options:['Ways a group remembers and tells stories about its past.','A list of dates that never changes.','A source that is always unbiased.','A record written by only one historian.'],answer:0},
    {prompt:'A visiting scholar asks why you would compare a remembered story with other evidence. What is your answer?',options:['To understand what it reveals and where accounts differ or are incomplete.','To prove memories are useless.','To make all accounts identical.','To avoid asking who created a source.'],answer:0},
    {prompt:'Someone digs up an old object that does not match a story everyone knows. What should a good historian do?',options:['Examine the artifact and compare it with other evidence.','Discard it because the old story is familiar.','Change the artifact to fit the account.','Assume disagreement makes all history unknowable.'],answer:0},
    {prompt:'You are teaching an apprentice griot. Which question helps them judge whether a history is complete?',options:['Who preserved this account, and whose experiences are missing?','Is this the only story I have heard?','Does the narrative avoid all disagreement?','Can I memorize it without checking evidence?'],answer:0}
  ]
};
// Phase 1 History Unit 1 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.
const histLevel = (difficulty, prompt, correct, ...wrong) => ({prompt, options:[correct, ...wrong], answer:0, difficulty});
const HISTORY_EXTRA_QUESTIONS = {
  historyStories:[
    histLevel(1,'A merchant says his city’s history begins when its first market opened. A farmer says it begins with the first harvest. What explains the difference?','Each chose a starting point that matters to them.','One of them must be lying about the past.','Cities have only one true starting date.','Markets are always older than farms.'),
    histLevel(1,'A visitor asks what makes a history different from a made-up story. What do you say?','It is based on evidence from the past.','It is always longer and more detailed.','It never includes anyone’s opinion.','It only describes kings and wars.'),
    histLevel(2,'You are sorting notes for your history. Which statement is a claim you could test with evidence?','Trade on the river grew after the bridge opened.','Our city is the greatest city ever built.','The gods chose our people to rule the land.','Long ago, life was simply better than now.'),
    histLevel(2,'Two travelers describe the same festival. One calls it joyful; the other calls it loud and crowded. What is the best conclusion?','Both may be accurate from different viewpoints.','The second traveler must have missed it.','Festivals can’t be studied by historians.','The first traveler is always the reliable one.'),
    histLevel(2,'Your history of a village starts with its founding. Another writer’s starts when a new road arrived. What does the second choice highlight?','How new connections changed village life.','Who founded the village first.','Why villages never really change.','Only the oldest events in the village.'),
    histLevel(2,'A historian writes about a war using only the winners’ letters. What is the biggest problem?','The losers’ experiences are left out.','Letters are too old to read clearly.','Winners rarely write any letters.','Wars are not part of real history.'),
    histLevel(3,'You claim the harbor town grew richer after 1200. Which evidence best supports your claim?','Tax records showing more ships each year.','A poem praising the town’s beauty.','A legend about the town’s founder.','A modern painting of the old harbor.'),
    histLevel(3,'A king’s official history says he won every war he fought. What should a careful historian ask first?','Who wrote it, and why?','How long is the history?','Which war was most exciting?','Was the handwriting neat?'),
    histLevel(3,'Three sources describe a flood. Two written that year say it lasted a week. One written 200 years later says a month. What is the most reasonable conclusion?','The flood likely lasted about a week.','The flood lasted exactly one month.','No flood happened at all.','All three sources are equally reliable.'),
    histLevel(3,'Which question would best help you choose a starting point for a history of your town?','What change do I want to explain?','What is the oldest date I can find?','Which story is the most exciting one?','Which event had the most famous guest?')
  ],
  historyScale:[
    histLevel(1,'A visitor asks what it means to “zoom out” in history. What do you say?','Look at a wider area or a longer time.','Look at one person’s single day.','Read only the newest sources.','Remove the dates from a story.'),
    histLevel(1,'You study how one market changed over ten years. What scale is this?','A small, local scale.','A global scale.','A scale of thousands of years.','A scale that leaves out places.'),
    histLevel(1,'You compare how farming spread across three continents. What scale is this?','A large, wide scale.','A single-family scale.','A one-day scale.','A one-village scale.'),
    histLevel(2,'Zooming in on one family’s letters helps a historian see what?','How big changes affected real people.','Patterns across the whole world.','Every event in that century.','Why all families felt the same way.'),
    histLevel(2,'A historian studies 10,000 years of human history at once. What is she most likely to miss?','Details of individual lives.','Long-term patterns.','Changes across regions.','Connections between places.'),
    histLevel(2,'Which question works best at a global scale?','How did ideas spread between continents?','What did one baker eat for breakfast?','Who lived in this one house?','What did one soldier write home?'),
    histLevel(3,'A writer claims one village’s drought caused a whole empire to fall. What is the best response?','Check evidence from across the empire.','Accept it, since droughts are serious.','Study only that one village more closely.','Ignore it, since villages are small.'),
    histLevel(3,'After a new road network was built, trade rose 40% in Village A, 35% in Village B, and 50% in Village C. Which claim fits this wider view?','The roads likely boosted trade across the region.','Only Village C gained anything from the roads.','The roads made trade fall in the region.','The roads did not affect any village.'),
    histLevel(3,'Why might a local story and a global pattern seem to disagree?','Local places can differ from the overall trend.','One of them must be made up.','Global patterns are not based on evidence.','Local stories are never accurate.'),
    histLevel(3,'You notice many port cities grew during the same century. What should you do next?','Zoom in on a few ports to check why.','Assume they all grew for one reason.','Stop, since the pattern proves itself.','Study only inland villages instead.')
  ],
  historyFrames:[
    histLevel(1,'You study how a city shared water and settled arguments between neighbors. Which frame fits best?','Communities.','Networks.','Production and distribution.','Collective memory.'),
    histLevel(2,'You study how salt was mined, packed, and sold, and who got rich from it. Which frame fits best?','Production and distribution.','Communities.','Networks.','Collective memory.'),
    histLevel(2,'A historian traces how a new religion spread along trade routes. Which frame is she using?','Networks.','Communities.','Production and distribution.','Collective memory.'),
    histLevel(2,'Which question fits the communities frame?','How did people in the town choose leaders?','How did spices travel from Asia to Europe?','How were cloth and grain made and sold?','How did a disease move between ports?'),
    histLevel(2,'Which question fits the networks frame?','How did papermaking move west?','Who did the farming in one village?','How did a town choose its rules?','What did one family grow each year?'),
    histLevel(2,'Which evidence best fits the production and distribution frame?','Records of how much grain each farm sold.','Letters between friends in distant cities.','A list of the town’s religious festivals.','A song about the town’s heroes.'),
    histLevel(3,'You study the Silk Roads with the production and distribution frame. Which question would you ask?','Who made silk, and who profited from it?','How did travelers share religious ideas?','How did caravan towns govern themselves?','What stories do people tell about the roads?'),
    histLevel(3,'Why might two historians studying the same city reach different conclusions?','They used different frames and questions.','One of them did not use any evidence.','Cities can only be studied one way.','Frames change what actually happened.'),
    histLevel(3,'A historian studies a village using only the networks frame. What might she overlook?','How villagers lived and worked together.','Connections to other places.','Goods moving along trade routes.','Ideas arriving from far away.'),
    histLevel(3,'A visitor says, “A frame is like a lens.” What does this mean?','Each frame brings certain details into focus.','Every frame shows the same evidence.','A frame shows the one true history.','A frame hides every source but one.')
  ],
  historyMemory:[
    histLevel(1,'A griot recites the history of a people from memory. What kind of source is this?','An oral tradition.','A written census.','An archaeological dig.','A government tax record.'),
    histLevel(1,'A town builds a statue to honor a local hero. What is this an example of?','Collective memory.','A trade network.','A production record.','A written census.'),
    histLevel(2,'A visitor asks why some histories have “silences,” or missing voices. What do you explain?','Some groups’ records were never kept.','Everyone’s story was always written down.','Historians erase voices on purpose.','People in the past rarely spoke.'),
    histLevel(2,'A museum shows only objects owned by rich families. What does the collection leave out?','The lives of ordinary people.','The lives of rich families.','Expensive objects from the past.','Objects that were well preserved.'),
    histLevel(2,'A city’s archive burned in a fire 300 years ago. How does this affect its history?','Some events may be hard to know about.','Nothing important happened in that city.','The city never kept any records.','All other sources become useless.'),
    histLevel(2,'Why can the people who choose what goes in a textbook shape what students learn?','They decide which stories are told.','They change what happened in the past.','They make all sources equally reliable.','They remove all evidence from books.'),
    histLevel(3,'A national holiday celebrates a great victory, but letters from both armies describe heavy losses. What is the best conclusion?','Memory of an event can differ from what happened.','The letters from both armies must be fake.','Holidays are the best evidence about wars.','Neither source tells us anything useful.'),
    histLevel(3,'Which source would best fill a silence about enslaved workers on a plantation?','Interviews with formerly enslaved people.','The owner’s list of buildings and tools.','A painting paid for by the owner.','A map of the plantation’s fields.'),
    histLevel(3,'Two groups remember the same treaty very differently. What should a historian do?','Study both memories and the treaty itself.','Choose the group that is larger today.','Ignore both memories entirely.','Use whichever version is more popular.'),
    histLevel(3,'You claim a city’s founding legend was shaped by later rulers. Which evidence best supports this?','It first appears in records 500 years later.','It is still very popular in the city today.','It includes many exciting details.','Some families still tell it aloud.')
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
    mc('A traveler asks how the small villages you visit are connected to each other. What do you say?','Through networks of exchange and communication','They were completely isolated','Only through written laws','Only through large empires'),
    mc('The traveler asks which groups the farming villages deal with. Who do you name?','Foragers, herders, and nomads','Only other farmers','No outsiders','Only rulers of empires'),
    mc('A villager asks why they should trade with a herder like you. What is the best reason?','They could exchange different goods and resources','Herders never traded','Villages produced nothing','Trade was impossible without writing'),
    mc('A reporter from the future asks what your trading trips show historians. What do you say?','That small communities were part of wider connections','That villages never changed','That all people lived the same way','That cities appeared first')
  ],
  firstCities:[
    mc('A farmer from the countryside asks how Uruk got so big. What happened as farming spread and grew stronger?','Communities grew and some villages became cities','All people returned to foraging','Cities disappeared','Trade stopped'),
    mc('A visitor asks what you mean when you say Uruk rules a “state.” What is a state?','A political organization that governs a territory and people','A single farming tool','A type of crop','A small family group'),
    mc('A merchant asks how cities like yours joined together into powerful states. What do you say?','Through connections such as trade, leadership, and shared institutions','By avoiding all contact','By staying separate villages','By ending farming'),
    mc('The visitor notices how crowded and busy Uruk is. Which change comes with growing cities?','More people living together and more complex societies','Smaller and simpler communities','Less need for organization','No new leadership')
  ],
  tradeNetworks:[
    mc('A young sailor asks which kind of trade is most common in your world. What do you tell them?','Local networks','Global airline routes','Only ocean liners','Digital markets'),
    mc('A reporter from the future asks which regions long-distance trade connects. What do you answer?','Afro-Eurasia and the Americas','Only one village','Only Antarctica','Only one river valley'),
    mc('Your apprentice asks why people pay so much for goods from far away. What do you say?','They might lack certain resources or want valued items','Distant goods were always identical to local ones','Trade prevented all contact','Only rulers could use goods'),
    mc('Historians find your Indus beads buried in a Mesopotamian city. What do they suggest?','Connections between distant communities','That the goods fell from the sky','That no one traveled','That trade never happened')
  ],
  earlyAgrarian:[
    mc('A young trader asks why every kingdom you visited grew up in its own way. What do you say?','Geographic context shaped their resources and choices','All used identical resources','Climate never mattered','They never farmed'),
    mc('The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?','Identify similarities and differences in farming, cities, and trade','Assume they were the same','Compare only their names','Ignore their environments'),
    mc('The trader asks what all those kingdoms had in common. Which similarity do you name?','Farming supported growing communities','None used farming','All had identical rulers','All were in the same place'),
    mc('A historian asks why you always explain where and when a society lived. Why is context important?','It helps explain why events and choices happened','It makes evidence unnecessary','It proves every society was equal in size','It removes differences between regions')
  ],
  mesopotamia:[
    mc('A visiting prince asks between which two rivers your land lies. What do you tell him?','The Tigris and Euphrates','The Nile and Congo','The Mississippi and Amazon','The Rhine and Danube'),
    mc('Your scribes ask which invention helps your government and merchants keep records. What is it?','Writing','Telephones','Printing presses','Airplanes'),
    mc('A judge asks why you had your law code carved in stone. What do law codes help do?','Set rules for behavior and settle disputes','Replace all farming','Prevent writing','End trade'),
    mc('A traveler sees the giant temple in the center of your city. How does religion shape your cities?','Temples and beliefs were central to community life','Cities had no beliefs','Religion banned cities','Temples were unrelated to leaders')
  ],
  shangChina:[
    mc('A soldier asks which technology makes Shang weapons and ritual vessels so strong. What is it?','Bronze','Steel skyscrapers','Plastic','Electricity'),
    mc('A child asks what Shang ancestor worship is about. What do you say?','Honoring ancestors in religious practice','Ignoring family history','Banning ceremonies','Worshiping only machines'),
    mc('A historian from the future asks what writing from your time they can study. What do you tell them?','Inscriptions on bones and bronze','Digital files','Printed newspapers','Typewritten letters'),
    mc('A visitor asks how the Shang king holds your society together. How does political power support it?','Rulers organized people, resources, and religion','Rulers had no role','Everyone governed separately','Farming was unnecessary')
  ],
  egyptNubia:[
    mc('A visitor asks which river shapes both your kingdom and Egypt. What do you answer?','The Nile','The Yangtze','The Rhine','The Seine'),
    mc('A farmer asks why the river matters so much for crops. What do you say?','Its flooding and water supported crops','It froze every year','It removed all soil','It had no effect'),
    mc('A reporter from the future asks how to describe Nubia and Egypt. What is the best description?','Neighboring societies that influenced each other','Societies with no contact','One society that never changed','Societies on different continents with no trade'),
    mc('A historian wants proof that Nubia and Egypt influenced each other. Which evidence could show it?','Shared artifacts, trade, and political contact','A modern map only','A single unlabeled rock','Nothing could show it')
  ],
  earlyAmericas:[
    mc('A visitor from the future asks the name of your people, one of the earliest complex societies in Mesoamerica. What are you called?','The Olmec','The Shang','The Sumerians','The Hittites'),
    mc('A traveler from the south tells you about a temple called Chavín de Huantar. Where is it?','The Andes of South America','The Nile Valley','Mesopotamia','The Arctic'),
    mc('The traveler asks why their society is so different from yours. What do you say?','They adapted to different environments and resources','All regions were identical','They had no farms','Geography did not matter'),
    mc('A historian from the future wants to learn about your society. How can they do it?','By studying artifacts, buildings, and other evidence','Only from modern novels','Only from one written law','They cannot study them')
  ],
  ancientIndia:[
    mc('A visitor asks which river valley your city sits in. What do you tell them?','The Indus','The Rhine','The Mississippi','The Seine'),
    mc('The visitor is amazed by your city. What is notable about many Indus Valley cities?','Planned layouts and drainage systems','No streets','No buildings','No trade'),
    mc('A merchant shows you a carved stone seal. What are seals and traded goods evidence of?','Trade networks and record-keeping practices','Modern computers','Only farming tools','A fully translated law code'),
    mc('A historian from the future cannot read your writing. How can they study your city?','By analyzing archaeological evidence such as buildings and artifacts','By guessing without evidence','By ignoring the society','By using only modern newspapers')
  ]
};
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
    {prompt:'The reporter asks: “For most of the 250,000 years of your species’ history, how did people mainly live?”',options:['As foragers','As farmers','As herders','As city dwellers'],answer:0},
    {prompt:'The reporter asks: “About how long ago did some people start experimenting with farming?”',options:['About 12,000 years ago','About 250 years ago','About 2,000 years ago','About 250,000 years ago'],answer:0},
    {prompt:'The reporter asks: “People in my time talk about the Neolithic Revolution. What was it?”',options:['The shift toward farming and settled life','The first use of metal tools and weapons','The move out of Africa to other continents','The rise of the first cities and kings'],answer:0},
    {prompt:'The reporter asks: “Why should I compare how people lived then with how we live now?”',options:['It shows what changed and what stayed the same','It proves that life today is better in every way','It shows that the past was just like today','It tells us which way of life was correct'],answer:0}
  ],
  migrationArt:[
    {prompt:'A visitor from the future asks: “Where did your people, Homo sapiens, first develop?”',options:['Africa','Europe','Asia','Australia'],answer:0},
    {prompt:'The visitor asks: “What can your paintings tell historians thousands of years from now?”',options:['Clues about our beliefs and skills','The exact thoughts of every painter','The names of the people who made them','A full record of everything we did'],answer:0},
    {prompt:'The visitor notices nobody here can write yet. What does your art show about that?',options:['People shared ideas in ways other than writing','Writing had already spread to every group','Art was made only for decoration, never for meaning','People could not think in symbols yet'],answer:0},
    {prompt:'A historian of the future finds your paintings. What is the best next step for them?',options:['Compare them with other evidence','Assume they explain the whole culture','Ignore them because they have no words','Use them to find the artist’s exact name'],answer:0}
  ],
  foragingSocieties:[
    {prompt:'A traveler asks what your way of life is also called. You tell them foraging is also called:',options:['Hunting and gathering','Planting and harvesting','Herding and trading','Fishing and farming'],answer:0},
    {prompt:'A young member of your band asks why foraging takes so much knowledge. What do you teach them?',options:['Food sources change with place and season','Food stays in the same spot all year','Only the band leader needs to know anything','Every wild plant is safe to eat anyway'],answer:0},
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
    {prompt:'A visitor asks which parts of life farming has changed in your village. What do you list?',options:['Diet, work, homes, and trade','Only the food people ate','Only the weather and seasons','Nothing except the tools people used'],answer:0},
    {prompt:'Someone says farming was “the biggest mistake” humans ever made. How should your village test that claim?',options:['Weigh benefits and costs for different people','Accept it because it sounds so dramatic','Look only at the problems that farming caused','Use one object from the village as proof'],answer:0},
    {prompt:'You want to show the visitor that the question has more than one side. Which statement shows that?',options:['Farming brought new benefits and new problems','Farming had no real effects on daily life','Everyone in the village experienced farming the same way','Farming solved every problem foragers had'],answer:0},
    {prompt:'A historian asks which frame helps most for studying how your village makes and shares food. What do you say?',options:['Production and distribution','Climate and geography','Leaders, laws, and government','Wars and battles'],answer:0}
  ]
};
// Phase 1 History Unit 2 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.
const HISTORY2_EXTRA_QUESTIONS = {
  earliestHumans:[
    histLevel(1,"The reporter asks: “Historians call your time the Paleolithic. What does that word mean?”","Old Stone Age","New Stone Age","Age of Bronze","Age of Writing"),
    histLevel(1,"The reporter asks: “What does your band mostly eat?”","Wild plants and hunted animals","Crops grown in our own fields","Food bought at markets","Bread from stored grain"),
    histLevel(2,"The reporter asks: “Humans have existed about 250,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”","More than 90 percent","About half","About 10 percent","Less than 1 percent"),
    histLevel(2,"The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”","Most tools were still made of stone","People lived only in stone caves","Stone was used as money","Writing was carved in stone"),
    histLevel(2,"The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?","Some parts of life stayed the same","Nothing has changed since your time","Your band lived exactly like us","Only changes matter in history"),
    histLevel(2,"The reporter asks: “Your band left no writing. How will historians in my time learn about you?”","From bones, tools, and old campsites","From the diaries your band kept each day","From newspapers of your time","From maps of your cities"),
    histLevel(3,"The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?","Campsites used at different times of year","A single cave painting of a horse herd","A modern film about cave people","A stone house used for centuries"),
    histLevel(3,"The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?","Early farm sites of very different ages","Old grinding stones from one village","Bones of wild animals at a campsite","Stories saying farming was hard"),
    histLevel(3,"The reporter asks you to compare your time with hers. Which statement is accurate?","Then most people found food; now most buy it","Then and now, most people grow their food","Then most people farmed; now most people hunt","Then, finding food took no knowledge"),
    histLevel(3,"The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?","Farming is a very recent part of history","Farming began at the start of history","Foraging lasted only a short time","Cities came before foraging")
  ],
  migrationArt:[
    histLevel(1,"A visitor from the future asks: “What do most of the oldest cave paintings show?”","Animals such as horses and bison","Maps of farms and fields","Kings sitting in their great palaces","Lists of goods to trade"),
    histLevel(1,"A visitor asks how your people first reached the Americas from Asia. What do you say?","Over a land bridge or along the coast","By sailing west across the Atlantic Ocean","Through a tunnel under the sea","They had always lived there"),
    histLevel(2,"The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”","Low sea levels uncovered land","The whole ocean froze solid","The rivers of Asia dried up","People built a long bridge"),
    histLevel(2,"Your group crossed open sea to reach Australia. What does this tell the visitor about your people?","They could build boats and plan trips","They walked the whole way on land","They had written maps to find the way","They had already started farming"),
    histLevel(2,"A visitor finds a small carved figure in your camp. Why does it matter to historians?","It shows people made symbolic objects","It tells the carver’s exact name","It shows writing had been invented","It proves everyone shared one religion"),
    histLevel(2,"Two experts disagree about why your people painted caves. One studied the caves for 30 years; the other read one article. Whose view should carry more weight?","The one who studied the evidence","The one who wrote most recently","The one with the most exciting idea","Both equally, since it is all a guess"),
    histLevel(3,"A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?","Remains of different ages along different routes","One skull found in a single cave","A painting of people walking","A legend about one great journey out of Africa"),
    histLevel(3,"Handprints in your cave are dated to about 40,000 years ago. What can historians reasonably conclude?","People were making art by that time","The artists also built cities","People had stopped migrating by then","Art began exactly 40,000 years ago"),
    histLevel(3,"A future historian says your paintings show what you ate every day. What is the problem with this claim?","Paintings may show what mattered, not meals","Paintings can never be dated","The painters never went hunting","Paintings are never a useful kind of evidence"),
    histLevel(3,"Why do historians use DNA, along with tools and bones, to study your people’s migration?","It can show how groups are related","It shows what people believed","It gives the exact date of each trip","It replaces all other evidence")
  ],
  foragingSocieties:[
    histLevel(1,"A traveler asks why your band moves camp during the year. What do you say?","We follow plants and animals by season","Farmers nearby keep forcing us to leave","We like to visit new cities","Our fields need rest each year"),
    histLevel(1,"The traveler asks how many people live in your band. What is a typical answer?","A few dozen","A few thousand","Tens of thousands","Just one person"),
    histLevel(2,"The traveler notices your band owns few belongings. Why?","Moving often makes it hard to carry much","Owning things is against the law","No tools had been invented yet","Traders took away everything you made"),
    histLevel(2,"A hunter brings back a large animal. What usually happens to the meat in your band?","It is shared across the band","It is sold at a market","The leader keeps all of it","It is stored for years in a granary"),
    histLevel(2,"Obsidian from a volcano 200 miles away is found at your camp. What does this suggest?","Your band traded with or met other groups","Your band lived beside the volcano","Obsidian forms naturally everywhere","Your band had built long roads to the volcano"),
    histLevel(2,"Your band meets another band each summer to share news and find marriage partners. Which frame fits this best?","Networks","Collective memory","Production and distribution","Scale"),
    histLevel(2,"A historian asks, “How did foragers get through a bad winter?” What is this question mainly asking about?","How foragers survived hard times","When winter starts each year","Which animals live in winter","Why farmers stored grain for winter"),
    histLevel(3,"Many foraging bands had no rich or poor members. Which evidence would best support this claim?","Burials with similar goods for everyone","One grave filled with gold and jewels","A large palace in the center of camp","A painting of a king on a throne"),
    histLevel(3,"Studies of modern foragers find they often spend fewer hours getting food than many farmers spend working. What can you reasonably infer?","Foraging was not always nonstop work","Foragers never worked at all","Farmers had more free time than foragers","Modern foragers live exactly like ancient ones"),
    histLevel(3,"Why must historians be careful using modern foraging groups as evidence about your band?","Modern groups have changed over time","Modern foragers refuse to talk to anyone","Ancient foragers left far more writing","Modern foraging groups no longer exist")
  ],
  agriculturalRevolution:[
    histLevel(1,"A forager asks what “domesticate” means. What do you say?","To tame and breed plants or animals","To hunt wild animals a new way","To move to a new home each season","To trade food with other villages"),
    histLevel(1,"Your village grew more food than it needed this year. What is the extra food called?","A surplus","A tribute","A shortage","A harvest tax"),
    histLevel(2,"Your village grows wheat and barley in Southwest Asia. What is this farming region often called?","The Fertile Crescent","The Silk Road","The Sahara Desert","The Great Plains"),
    histLevel(2,"A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?","Corn (maize)","Wheat","Rice","Sugar cane"),
    histLevel(2,"Farming began in several places that had no contact with each other. What does this show?","Many peoples began farming on their own","One group taught farming to the world","Farming spread only through trade","Farming began in only one place"),
    histLevel(2,"Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?","Specialization","Migration","Foraging","Domestication"),
    histLevel(2,"Which question about your village fits the production and distribution frame?","Who grows the grain, and who eats it?","What stories does the village tell?","Which gods does the village honor?","How does the village choose rules?"),
    histLevel(3,"At a dig site, older layers hold small wild wheat seeds and newer layers hold larger seeds. What does this best show?","People were slowly domesticating wheat","Wild wheat vanished all at once","Farmers abandoned the site for a new one","Seeds grow larger as they age"),
    histLevel(3,"A historian claims farming spread from Southwest Asia into Europe. Which evidence best supports this?","Farm sites get younger moving into Europe","Europe has the oldest farm sites","Europeans told many old stories about farming","Wheat grows well in Europe today"),
    histLevel(3,"At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?","It could support large, settled towns","Farmers still moved every season","Every farming town had a palace","Farming was first invented in this one town")
  ],
  biggestMistake:[
    histLevel(1,"A visitor asks how farming changed the number of people in the world. What do you say?","Populations grew much larger","Populations shrank to almost nothing","Populations stayed exactly the same","Only foragers had children"),
    histLevel(1,"Living close to your goats and cattle brings a new danger. What is it?","Diseases spread from animals to people","Animals eat all of the crops","Animals make the river flood","People forget how to make their stone tools"),
    histLevel(2,"Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?","Less varied diets based on a few crops","Farmers spent too much time traveling","Foragers ate only grain","Farmers ate too much meat"),
    histLevel(2,"Which change from farming helped make some people in your village richer than others?","Land and stored food could be owned","Everyone shared all the food equally","People stopped making tools","Bands moved every season"),
    histLevel(2,"You are drawing a cause-and-effect map for your village. Which chain fits what farming did?","More food → more people → larger villages","More food → fewer people → smaller villages","Less work → fewer crops → more travel","More travel → more crops → fewer villages"),
    histLevel(2,"One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?","Farming did more harm than good for many","Farming never really happened","Farming was invented by accident","Farming helped every single person equally"),
    histLevel(3,"Which evidence best supports the claim that farming was a mistake?","Farmers’ bones show more disease and wear","Farming villages had more people","Farming made writing possible much later","Farmers built permanent homes"),
    histLevel(3,"Which evidence best argues against the claim that farming was a mistake?","Surplus later supported cities and writing","Early farmers worked longer hours","Crop failures led to famine","Diseases spread to people from farm animals"),
    histLevel(3,"Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?","The answer depends on whose view you take","The question has one simple answer","Population is the only thing that matters","Individual lives tell us nothing"),
    histLevel(3,"Once your village depends on farming, why is it hard to go back to foraging?","Wild food can’t feed so many people","Foraging has been banned by law","All wild plants have disappeared","People are too busy writing books")
  ]
};
const HISTORY2_BUILT_IN_LEVELS = {"earliestHumans":[1,1,1,2],"migrationArt":[1,2,2,2],"foragingSocieties":[1,1,2,2],"agriculturalRevolution":[1,2,2,2],"biggestMistake":[1,2,2,2]};
Object.entries(HISTORY2_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY2_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));
Object.entries(HISTORY2_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY2_QUESTIONS[skillId] = [...(HISTORY2_QUESTIONS[skillId] || []), ...questions]; });
const HISTORY_UNIT4 = [
  {id:'portableBelief',name:'Portable Belief Systems | 4.2',lesson:'Portable belief systems travel with people, spreading along networks to new places and connecting diverse communities.'},
  {id:'hinduBuddhism',name:'Hinduism and Buddhism | 4.4',lesson:'Hinduism and Buddhism developed in South Asia; their ideas about duty, suffering, rebirth, and liberation shaped people\u2019s lives.'},
  {id:'judaismChristianity',name:'Judaism and Christianity | 4.5',lesson:'Judaism, Christianity, and Zoroastrianism developed in Southwest Asia and shaped later religious traditions and communities.'},
  {id:'islam',name:'Islam | 4.6',lesson:'Islam began in Arabia; the life of Muhammad and the early Muslim community shaped its core beliefs and spread.'},
  {id:'comparePortable',name:'Comparing Portable Belief Systems | 4.7',lesson:'Comparing portable belief systems helps explain why traditions spread across regions and connected diverse communities.'},
  {id:'persia',name:'Ancient Empires: Persians and Greeks | 4.9 \u00b7 Ancient Persia',lesson:'Persian rulers used political power, warfare, culture, and exchange to shape the ancient Mediterranean world.'},
  {id:'greece',name:'Ancient Empires: Persians and Greeks | 4.9 \u00b7 Classical Greece',lesson:'Greek, Macedonian, and Ptolemaic powers shaped the Mediterranean through politics, warfare, culture, and exchange.'},
  {id:'imperialChina',name:'Ancient Empires: Zhou and Qin | 4.11',lesson:'The Zhou and Qin dynasties developed new ideas about government, power, and social order that shaped later Chinese empires.'},
  {id:'compareEmpires',name:'Comparing Ancient Empires | 4.12',lesson:'Comparing empires shows different ways states expanded, governed diverse peoples, and justified their power.'},
  {id:'rome',name:'Ancient Empires: Rome and Han China | 4.13 \u00b7 Ancient Rome',lesson:'Roman rulers grew and maintained their empire through military power, roads, law, and administration.'},
  {id:'romeHan',name:'Ancient Empires: Rome and Han China | 4.13 \u00b7 Rome and Han China',lesson:'Comparing how Roman and Han rulers grew and maintained their empires.'},
  {id:'womenAncient',name:'Women in the Ancient World | 4.15',lesson:'The roles of women differed in ancient Rome and Han China.'}
];
const HISTORY4_LEARN_ONLY = {portableBelief:[{name:'Empires and Belief Systems | 4.1',lesson:'The rise of new empires and portable belief systems added complexity to human societies; belief systems and empires often helped each other spread.'}], hinduBuddhism:[{name:'Confucianism, Legalism, and Daoism | 4.3',lesson:'These traditions offered different answers about order, leadership, human nature, and how people should live.'}], comparePortable:[{name:'How Do Religions Grow and Change? | 4.8',lesson:'Belief systems transformed as they spread along networks.'}], imperialChina:[{name:'Ancient Empires: Mauryan and Gupta | 4.10',lesson:'The Mauryan and Gupta Empires built political power, supported religious and cultural change, and shaped life across South Asia.'}], womenAncient:[{name:'The Rise and Fall of Empires | 4.14',lesson:'Comparing the rise and fall of empires shows patterns of continuity and change in power, social organization, and belief systems.'}]};
const HISTORY_GROUPS4 = HISTORY_UNIT4.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id],extraLessons:HISTORY4_LEARN_ONLY[skill.id]}));
const HISTORY4_QUESTIONS = {
  portableBelief:[
    mc('A fellow traveler asks what makes a belief system “portable.” What do you say?','It can travel with people to new places','It is tied to one temple only','It forbids travel','It exists only in laws'),
    mc('The traveler asks how portable belief systems usually spread. What have you seen on your journeys?','Along trade and travel networks','Only through isolation','Only by farming','By avoiding contact'),
    mc('The traveler asks how one belief can link people in very different places. What do you say?','Shared beliefs and practices linked people across regions','They erased all differences','They required one language only','They stopped trade'),
    mc('You point to monks traveling in your caravan. Which is an example of a portable belief system?','Buddhism','A village boundary stone','A harvest tool','A trade price list')
  ],
  hinduBuddhism:[
    mc('A visiting monk asks if you know who founded Buddhism. What do you answer?','Siddhartha Gautama, the Buddha','Muhammad','Confucius','Cyrus'),
    mc('A Hindu adviser in your court talks about dharma. What does dharma refer to?','Duty and the right way of living','A kind of trade good','A military rank','A city wall'),
    mc('A child asks what the cycle of death and rebirth is called. What do you tell them?','Samsara','Mandate','Satrapy','Census'),
    mc('A traveler asks which idea is at the heart of Buddhism. What do you say?','Ending suffering by following the Eightfold Path','Building roads','Honoring emperors as gods only','Avoiding all teaching')
  ],
  judaismChristianity:[
    mc('A traveler asks what Judaism is known for believing. What do you say?','One God and a covenant with the Jewish people','Many city gods only','No sacred texts','Rule by emperors only'),
    mc('The traveler hears people speaking about a new group. Christianity developed from teachings about whom?','Jesus of Nazareth','Siddhartha Gautama','Confucius','Alexander'),
    mc('A reporter from the future asks in which region Judaism and Christianity developed. What do you answer?','Southwest Asia','Northern Europe','The Americas','Southeast Asia'),
    mc('A child asks you about the most important sacred text of Judaism. What is it?','The Torah','The Quran','The Analects','The Vedas only')
  ],
  islam:[
    mc('A traveler asks where Islam began. What do you tell them?','Arabia','China','Rome','Mesoamerica'),
    mc('The traveler sees people reciting from a book. What is the Quran?','The sacred text of Islam','A Roman law code','A Chinese dynasty','A trade route'),
    mc('The traveler asks who Muslims regard as the Prophet who received revelations. What do you answer?','Muhammad','Augustus','Darius','Laozi'),
    mc('The traveler asks what the Five Pillars of Islam are. What do you say?','Core practices of Muslim life','Five Roman roads','Five Greek cities','Five Chinese dynasties')
  ],
  comparePortable:[
    mc('Back home, a student asks why you compare the belief systems you met. What do you say?','To see similarities, differences, and why they spread','To prove they are identical','To ignore their histories','To avoid using evidence'),
    mc('The student asks what many portable belief systems have in common. Which similarity do you name?','Teachings about how people should live and treat others','They all began in one city','They all rejected travel','They all lacked communities'),
    mc('The student asks what helped beliefs travel as far as you did. What do you answer?','Trade routes, travelers, and sometimes empires','Isolation','Closed borders only','Avoiding networks'),
    mc('You saw Buddhism look different in each land you passed through. Which claim is best supported?','Traditions changed as they spread to new regions','Traditions never changed','Only one tradition spread','Spread had no causes')
  ],
  persia:[
    mc('A new governor asks how you rule such a huge territory. What do you tell him?','Through provinces called satrapies','Through a single village','Without officials','By avoiding roads'),
    mc('A royal messenger asks what the Royal Road is for. What do you say?','Communication and travel across the empire','A farming ritual','A battle formation','A religious holiday'),
    mc('A conquered city asks what kind of ruler you will be. What are rulers like you known for?','Allowing conquered peoples to keep many customs','Banning all travel','Ending trade','Destroying every city'),
    mc('A reporter from the future asks the name of the empire you founded. What do you answer?','Achaemenid Empire','Han Empire','Gupta Empire','Aksumite Empire')
  ],
  greece:[
    mc('A student asks how most Greek communities are organized. What do you say?','City-states','One national government','Nomadic bands only','Provinces of Rome'),
    mc('A visitor to Athens asks what your city is famous for developing. What is it?','An early form of democracy among citizens','A single emperor','Bronze oracle bones','The Mandate of Heaven'),
    mc('Your old student Alexander has marched far to the east. How did he spread Greek culture?','By conquering a large empire','By avoiding other lands','By closing trade','By ending the army'),
    mc('A student asks what Sparta is known for. What do you answer?','A military-focused society','Having no army','A mostly written law code','Being part of Han China')
  ],
  imperialChina:[
    mc('A scholar asks what the Mandate of Heaven means. What do you tell him?','The idea that rulers govern with approval that can be lost','A Roman road','A trade tax','A type of writing'),
    mc('An official asks how the Qin unified China. What do you answer?','By standardizing laws, writing, and money','By giving up power','By ending government','By closing all cities'),
    mc('A student asks which philosophy you follow, the one that favors strict laws and punishments. What is it?','Legalism','Daoism','Buddhism','Christianity'),
    mc('A historian asks which dynasty ruled before the Qin and used the Mandate of Heaven. What do you say?','The Zhou','The Gupta','The Ptolemaic','The Achaemenid')
  ],
  compareEmpires:[
    mc('The emperor asks why your report compares the empires you visited. What do you say?','To see how states expanded, governed diverse peoples, and justified power','To prove all were identical','To avoid evidence','To ignore geography'),
    mc('The emperor asks how rulers you met convinced people they had the right to rule. Which way did they use?','Claiming divine approval or successful leadership','Giving up all authority','Avoiding rules','Ignoring subjects'),
    mc('The emperor asks what helped those empires govern so many different peoples. What do you report?','Roads, officials, laws, and local arrangements','Isolation','No communication','Only farming tools'),
    mc('After all your travels, which claim is best supported by comparing empires?','Empires used different methods to expand and govern','All empires acted the same way','Empires never changed','Power had no sources')
  ],
  rome:[
    mc('A new recruit asks who became the first Roman emperor. What do you answer?','Augustus','Cyrus','Qin Shi Huangdi','Asoka'),
    mc('The recruit asks what people mean by the Pax Romana. What do you tell him?','A long period of relative peace and stability','A Chinese philosophy','A trade tax','A religious text'),
    mc('A merchant asks how Rome keeps control of such a huge territory. What do you say?','Roads, legions, and law','Isolation','No army','Only farming'),
    mc('A child asks what Rome was before it had emperors. Rome began as a:','Republic','Dynasty ruled by the Qin','Satrapy','Caliphate')
  ],
  romeHan:[
    mc('A new clerk asks which philosophy the Han emperors use to guide the government. What is it?','Confucianism','Legalism only','Christianity','Zoroastrianism'),
    mc('A merchant tells you about Rome. Which trade network connects your empire and Rome indirectly?','The Silk Road','The Royal Road only','The Mississippi','The Amazon'),
    mc('The merchant says Rome has problems too. Which problem do both Rome and Han China face?','Governing large territories and defending borders','No need for rulers','No trade','No farmers'),
    mc('The merchant asks how the Han fill government jobs. What do you tell him?','With educated officials in a bureaucracy','With no officials','Only with foreign armies','Only with priests')
  ],
  womenAncient:[
    mc('A student asks what Confucian ideas say about women’s roles in Han China. Women’s roles were often focused on:','The family and household hierarchy','Voting in assemblies','Leading all armies','Writing Roman laws'),
    mc('A traveler from Rome describes the lives of rich Roman women. What could elite Roman women often do?','Influence family affairs and manage property, but could not vote','Vote and hold every office','Have no family role','Govern the empire as consuls'),
    mc('Your student asks why you would compare women’s lives in Rome and Han China. What do you say?','To see how societies shaped opportunities and limits','To prove roles were identical','To avoid evidence','To ignore social class'),
    mc('After hearing about Rome, which statement is best supported?','Women\u2019s experiences differed by society and social class','Every woman had the same experience','Women left no influence','Evidence is unnecessary')
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
    mc('A parent asks you to put these in order from smallest to largest. Which sequence is right?','Cell, tissue, organ, organ system','Organ, cell, tissue, system','Tissue, organ, cell, system','System, organ, tissue, cell'),
    mc('A student points at a group of cells that all look alike. A group of similar cells working together is a:','Tissue','Cell part','Single organism only','Habitat'),
    mc('You show the group a pond water slide. Which of these living things is a single-celled organism?','Bacterium','Mushroom','Moss','Earthworm')
  ],
  cellPartsU:[
    mc('A visitor points to the big center of the model and asks which part directs the cell’s activities. What do you say?','Nucleus','Cell wall','Vacuole','Chloroplast'),
    mc('A kid asks which part releases energy from food for the cell. What do you point to?','Mitochondria','Cell membrane','Nucleus','Cytoplasm'),
    mc('A grandparent asks which part decides what gets in and out of the cell. What is it?','Cell membrane','Chloroplast','Nucleus','Vacuole'),
    mc('In the plant cell room, a visitor asks which part carries out photosynthesis. What do you show them?','Chloroplast','Mitochondria','Cell membrane','Nucleus')
  ],
  cellPartsA:[
    mc('A visitor asks how a plant cell stays stiff and keeps its shape. Which part helps most?','Cell wall','Mitochondria','Nucleolus only','Cytoplasm gel only'),
    mc('A runner on your tour asks about muscle cells, which need lots of energy. Which part would they have many of?','Mitochondria','Chloroplasts','Cell walls','Seeds'),
    mc('A visitor describes a cell that cannot make proteins because its instructions are damaged. Which part is most likely affected?','Nucleus','Cell wall','Vacuole','Cell membrane'),
    mc('A kid holds up a leaf and asks which part of its cells makes food from light. What do you say?','Chloroplast','Nucleus','Cell membrane','Cytoplasm')
  ],
  plantSuccessU:[
    mc('A kid asks what flowers are really for. What is the main purpose of a flower for many plants?','To help the plant reproduce','To absorb water from soil','To anchor the plant','To make roots'),
    mc('A visitor watches a bee land on a flower. What does the bee help move?','Pollen','Roots','Soil','Leaves'),
    mc('A parent asks why so many flowers are bright colors. What do you explain?','They attract pollinators','They scare pollinators away','They make seeds disappear','They stop photosynthesis'),
    mc('A visitor sees a plant covered in seeds. Why can making many seeds improve reproductive success?','More seeds may survive and grow','Seeds never need water','Every seed always grows','Parents stop needing sunlight')
  ],
  plantSuccessA:[
    mc('A visitor notices no bees are visiting one field of plants. What do you predict will happen?','Fewer seeds may form','More seeds always form','Roots stop growing','Leaves become flowers'),
    mc('A kid sniffs a sweet flower full of nectar. Which structure-and-function idea do you explain?','Features attract animals that carry pollen','Features stop reproduction','Nectar makes roots','Smell removes pollen'),
    mc('A visitor asks how a hard seed coat helps a seed that has to survive winter. What do you say?','It can protect the embryo until conditions improve','It makes the seed need no water ever','It turns into a flower','It stops growth permanently'),
    mc('A grandparent asks what could hurt a plant’s chances of reproducing. Which change could lower its success?','Loss of pollinators','More pollinators','Adequate water','Healthy soil')
  ],
  asexualPlants:[
    mc('A visitor asks how new plants made by asexual reproduction compare to the parent. Offspring are:','Genetically identical to the parent','Mixed from two different parents','Always different species','Made from pollen and eggs'),
    mc('A kid asks you for an example of asexual reproduction in plants. Which do you point to?','A strawberry plant sending out runners','A bee carrying pollen','A seed floating on wind','A flower attracting insects'),
    mc('A parent asks how many parents asexual reproduction needs. What do you say?','One','Two','Three','None'),
    mc('You show the group a stem cutting that grew roots and became a new plant. What is this an example of?','Asexual reproduction','Sexual reproduction','Pollination only','Seed dispersal')
  ],
  sexualPlants:[
    mc('A visitor asks what sexual reproduction in flowering plants involves. What do you explain?','Pollen and egg cells combining','One parent making a copy','A cutting growing roots','Runners spreading'),
    mc('A kid asks what “pollination” means. What do you say?','Moving pollen to the female part of a flower','A seed growing roots','Water entering a root','A leaf making food'),
    mc('A parent asks why sexual reproduction makes baby plants that look a little different from each other. What is the reason?','Offspring inherit traits from two parents','Offspring copy one parent exactly','No genes are involved','Seeds never form'),
    mc('You cut open a fruit to show the group. After fertilization, what can an ovule develop into?','Seed','Root hair','Stem','Petal')
  ],
  seedDispersal:[
    mc('A maple seed spins down past your tour group. A kid asks how it travels. What do you say?','By wind','By animals eating it','By water only','By exploding pods'),
    mc('A burr is stuck to a visitor’s dog. How is this seed dispersed?','By animals','By wind only','By water','By exploding pods'),
    mc('A visitor asks why it matters if seeds travel away from the parent plant. What do you explain?','Seeds can grow away from the crowded parent plant','Seeds always grow faster in the shade of the parent','It removes the need for water','It prevents germination'),
    mc('You show the group a coconut that washed up on a beach. How does it travel?','By water','By pollinators only','By roots','By leaves')
  ],
  digestionHumans:[
    mc('A visitor asks what the whole digestive system is for. What is its main job?','Break food down so nutrients can be absorbed','Pump blood','Exchange gases','Send nerve signals'),
    mc('A kid asks where digestion begins. What do you say?','The mouth','The large intestine','The stomach only','The esophagus'),
    mc('At the giant teeth, a visitor asks what chewing does. What do you explain?','Breaks food into smaller pieces','Absorbs all nutrients','Makes bile','Removes water from waste'),
    mc('Your group reaches the stomach model. How does the stomach help digestion?','Mixing food with acid and enzymes','Absorbing most water','Making blood cells','Filtering oxygen')
  ],
  digestionIntestines:[
    mc('A visitor asks where most nutrients are absorbed. What do you say?','Small intestine','Large intestine','Mouth','Esophagus'),
    mc('A kid asks what the large intestine mostly soaks up. What do you answer?','Water','Most protein','Most of the fat','Bile'),
    mc('You point to the tiny finger-like villi on the wall. Why does the small intestine have them?','They increase surface area for absorption','They crush food','They make acid','They store waste'),
    mc('At the end of the tunnel, a visitor asks what happens to food that was not digested. What do you say?','It is eliminated as waste','It is absorbed by the villi','It is stored in the liver','It goes back to the stomach')
  ],
  humanDigestion:[
    mc('A visitor asks you to trace the path food takes. Which path is correct?','Mouth, esophagus, stomach, small intestine, large intestine','Mouth, stomach, esophagus, large intestine, small intestine','Stomach, mouth, esophagus, intestines','Esophagus, mouth, stomach, intestines'),
    mc('A kid asks what the esophagus does. What do you explain?','Moves food from the mouth to the stomach','Absorbs nutrients','Makes bile','Stores waste'),
    mc('A grandparent asks which organ makes bile to help digest fats. What do you answer?','Liver','Stomach','Mouth','Esophagus'),
    mc('A visitor asks how the digestive system and circulatory system work together. What do you say?','The blood carries absorbed nutrients to cells','Blood digests food in the mouth','They are unrelated','The stomach pumps blood')
  ]
};
// Phase 1 Science bank: extra Biology Unit 1 questions, tagged by difficulty (1-3).
// They join the built-in pools above; practice still draws 4 at random and unit tests draw from the whole pool.
const mcLevel = (difficulty, prompt, correct, ...wrong) => ({...mc(prompt, correct, ...wrong), difficulty});
const BIO1_EXTRA_QUESTIONS = {
  cellsOrganisms:[
    mcLevel(1,'A kid asks what all living things have in common. What do you say?','They are made of one or more cells','They all have leaves','They all have bones','They are all made of one cell'),
    mcLevel(1,'A visitor asks where new cells come from. What do you explain?','From cells that already exist','From nonliving dust and dirt','From mixing air and water','From sunlight hitting soil'),
    mcLevel(1,'Your group stops at a model of a heart. What level of organization is the heart?','An organ','A single cell','An organism','An organ system'),
    mcLevel(2,'A visitor asks how a one-celled amoeba stays alive without organs. What do you explain?','Its one cell does every life job','It borrows organs from others','It never needs food or water','It is not truly alive'),
    mcLevel(2,'The stomach, intestines, and liver work together. What is a group of organs working together called?','An organ system','A tissue','A cell','A population'),
    mcLevel(2,'A parent asks why a skin cell and a nerve cell look so different. What do you say?','Each cell’s shape fits its job','One of them is not alive','Nerve cells come from plants','Skin cells have no parts'),
    mcLevel(2,'A student looks at two samples under a microscope. Sample A is a single cell. Sample B has thousands of cells forming roots and leaves. Which statement is supported?','A is unicellular; B is multicellular','A is multicellular; B is unicellular','Both are unicellular','Neither is made of cells'),
    mcLevel(3,'Your group builds a model of a dog. Which level of organization comes right above “organ system”?','Organism','Tissue','Organ','Cell'),
    mcLevel(3,'A student claims a mushroom is alive. Which evidence best supports the claim?','It is made of cells and grows','It is brown and soft to touch','It grows in shady places','It feels cool and damp'),
    mcLevel(3,'A visitor asks why other body systems suffer if the digestive system stops working. What is the best answer?','Body systems depend on each other','All systems are one organ','Cells do not need nutrients','Only the stomach needs food')
  ],
  cellPartsU:[
    mcLevel(1,'A kid asks what the jelly-like fluid filling a cell is called. What do you say?','Cytoplasm','Nucleus','Cell wall','Chloroplast'),
    mcLevel(1,'A visitor asks which part stores water in a plant cell. What do you point to?','The large vacuole','The nucleus','The cell membrane','The mitochondria'),
    mcLevel(1,'A kid asks which part holds the cell’s DNA. What do you point to?','Nucleus','Vacuole','Cytoplasm','Cell wall'),
    mcLevel(2,'A parent asks which two parts plant cells have that animal cells do not. What do you say?','Cell wall and chloroplasts','Nucleus and membrane','Mitochondria and cytoplasm','Membrane and cytoplasm'),
    mcLevel(2,'A visitor asks which parts both plant and animal cells have. Which answer is right?','Nucleus, membrane, mitochondria','Cell wall, chloroplast, vacuole','Chloroplast, nucleus, cell wall','Cell wall and membrane only'),
    mcLevel(2,'A kid asks what the cell wall does. What do you explain?','Gives the cell stiff support','Makes food from sunlight','Stores the cell’s DNA','Releases energy from food'),
    mcLevel(2,'A visitor asks which small parts build proteins for the cell. What do you say?','Ribosomes','Vacuoles','Cell walls','Chloroplasts'),
    mcLevel(2,'In a city model of a cell, the warehouse stores water and supplies. Which cell part is the warehouse like?','Vacuole','Nucleus','Mitochondria','Chloroplast'),
    mcLevel(3,'A student sees two cells under a microscope. Cell X has a cell wall, chloroplasts, and a large vacuole. Cell Y has none of these. Which conclusion is best supported?','X is a plant cell; Y is an animal cell','X is an animal cell; Y is a plant cell','Both are animal cells','Both are plant cells'),
    mcLevel(3,'A visitor asks why a root cell deep underground has no chloroplasts. What is the best explanation?','No light reaches roots to make food','Roots are not made of cells','Only animal cells have chloroplasts','Root cells have no nucleus')
  ],
  cellPartsA:[
    mcLevel(1,'A student wants to turn a plant cell model into an animal cell model. Which part should be removed?','Cell wall','Nucleus','Mitochondria','Cell membrane'),
    mcLevel(2,'A cell’s membrane is damaged and harmful substances leak in. Which job has failed?','Controlling what enters and leaves','Making food from light','Storing the cell’s DNA','Giving the cell stiff support'),
    mcLevel(2,'A plant droops after days without water. Which cell part has lost the most water?','The central vacuole','The nucleus','The cell membrane','The mitochondria'),
    mcLevel(2,'Which cell would likely have the most chloroplasts?','A cell from the top of a leaf','A cell from deep in a root','A cell from a human’s skin','A cell from a human muscle'),
    mcLevel(2,'A visitor asks why animal cells can change shape but plant cells mostly cannot. What do you explain?','Animal cells lack a rigid cell wall','Animal cells lack a nucleus','Plant cells lack a membrane','Plant cells lack cytoplasm'),
    mcLevel(2,'A kid’s scraped knee heals as new skin cells form. Where do the new cells come from?','Existing skin cells dividing','The bandage material','Blood turning into skin','Air touching the scrape'),
    mcLevel(3,'A poison stops a cell’s mitochondria from working. What is the most likely result?','The cell runs low on energy','The cell makes extra food','The cell wall grows thicker','The DNA copies faster'),
    mcLevel(3,'Scientists remove the nucleus from a cell. What will the cell most likely be unable to do?','Divide to make new cells','Keep cytoplasm inside','Keep its membrane','Take up space'),
    mcLevel(3,'Chloroplast counts in a leaf: top-layer cells average 40, bottom-layer cells average 10. Which statement is best supported?','Top cells likely get more light','Bottom cells make more food','Bottom cells have no nucleus','Top cells have no cell walls'),
    mcLevel(3,'A student’s cell model has a nucleus, membrane, cytoplasm, mitochondria, and a cell wall, but no chloroplasts. Which cell could it be?','A plant root cell','A human muscle cell','A human skin cell','A cell from a leaf’s top')
  ],
  plantSuccessU:[
    mcLevel(1,'A kid asks which flower part makes pollen. What do you point to?','The stamen','The pistil','The petal','The sepal'),
    mcLevel(1,'A visitor asks which flower part receives pollen and holds the ovules. What do you say?','The pistil','The stamen','The sepal','The stem'),
    mcLevel(1,'A visitor asks why many fruits taste sweet. What do you explain?','Animals eat them and spread seeds','Sweetness keeps animals away','It helps roots absorb water','It makes leaves greener'),
    mcLevel(2,'A flower smells like rotting meat. Which animal is it most likely trying to attract?','Flies','Bees','Hummingbirds','Butterflies'),
    mcLevel(2,'A visitor asks why wind-pollinated grasses have small, plain flowers. What is the best explanation?','They do not need to attract animals','They only grow at night','Their pollen is too heavy to move','They make no pollen at all'),
    mcLevel(2,'Which plant behavior helps reproductive success?','Flowers opening when bees are out','Leaves turning brown in winter','Roots growing deeper for water','Stems bending toward light'),
    mcLevel(2,'A hummingbird drinks nectar from a long red flower. How does this help the plant?','The bird carries pollen to other flowers','The bird eats the flower’s seeds','The bird waters the plant','The bird removes old petals'),
    mcLevel(2,'Students counted bee visits in one hour. Flower A (bright, scented): 42 visits. Flower B (pale, no scent): 6 visits. Which claim is best supported?','Bright, scented flowers attract more bees','Bees prefer pale flowers','Scent keeps bees away','Flower traits do not matter to bees'),
    mcLevel(3,'One plant makes 1,000 tiny seeds. Another makes 5 large seeds full of stored food. Which statement is true?','Both are strategies for reproductive success','Only the tiny seeds can grow','Only the large seeds are real seeds','Neither plant can reproduce'),
    mcLevel(3,'A farm loses most of its bees. Which crop would be hurt the least?','Wind-pollinated wheat','Bee-pollinated apples','Bee-pollinated squash','Bee-pollinated melons')
  ],
  plantSuccessA:[
    mcLevel(1,'A bee picks up pollen from one flower. What must happen next for the plant to make seeds?','Pollen reaches another flower’s pistil','Pollen falls down into the soil','The bee eats all of the pollen','Pollen turns into a new leaf'),
    mcLevel(2,'A gardener wants more tomatoes. Which action would most help pollination?','Plant bee-attracting flowers nearby','Use a spray that kills bees','Pick off all the flowers','Cover the plants in plastic'),
    mcLevel(2,'A plant grows beside a river, and its seeds have air pockets. How does this trait help it reproduce?','Its seeds can float to new places','Its seeds sink and rot faster','Its seeds attract more bees','Its seeds never need water'),
    mcLevel(2,'A flower has patterns that only bees can see. What is the best explanation?','The patterns guide bees to nectar','The patterns scare bees away','The patterns help roots grow','The patterns block sunlight'),
    mcLevel(2,'Which flower is most likely pollinated by bats?','Large and pale, opens at night','Small and green, wind-blown','Tiny and red, opens at noon','Blue and closed all night'),
    mcLevel(3,'Which trait would most help a plant that lives where very few insects live?','Pollen that blows in the wind','Bright, sweet-smelling petals','Lots of sugary nectar','Landing pads for bees'),
    mcLevel(3,'Students cover some apple blossoms with mesh bags so insects can’t reach them. Covered: 3 apples. Uncovered: 41 apples. What do the results show?','Insect pollination increases fruit','Mesh bags make apples bigger','Apples form without pollination','Insects damage apple flowers'),
    mcLevel(3,'A student wants to test whether scent attracts moths. Which setup is a fair test?','Two identical flowers, one scented','One red flower and one white flower','Flowers in sun and flowers in shade','Different flowers on different nights'),
    mcLevel(3,'Why might it help a bee-pollinated plant to bloom at the same time as others of its kind?','More pollen gets shared between them','Bees only fly during winter','Flowers last longer when alone','Its seeds need no pollen at all'),
    mcLevel(3,'A student claims large seeds with more stored food survive better in shade. Which evidence would best support this?','Large seeds sprout more often in shade','Small seeds blow farther in wind','Large seeds weigh more','Shade plants have fewer leaves')
  ],
  asexualPlants:[
    mcLevel(1,'A visitor asks what a potato “eye” can do when planted. What do you say?','Grow into a new potato plant','Make pollen for flowers','Turn into a seed','Attract pollinators'),
    mcLevel(1,'Which is an example of asexual reproduction?','A spider plant growing baby plantlets','A bee carrying pollen','A seed forming after pollination','A fruit forming from a flower'),
    mcLevel(2,'A farmer has a strawberry plant with perfect, sweet berries. Why might she grow new plants from its runners instead of seeds?','Runners make copies with the same traits','Runners make plants with new traits','Seeds always make identical copies','Runners need pollinators to work'),
    mcLevel(2,'A visitor asks for one downside of asexual reproduction. What do you explain?','One disease can harm every copy','It always needs two parents','It cannot make new plants','It only works for trees'),
    mcLevel(2,'A gardener sets a succulent leaf on soil, and it grows roots and a new plant. What does this show?','Some plants can grow from body parts','Leaves are a kind of seed','Succulents need pollen to grow','The plant reproduced sexually'),
    mcLevel(2,'Onions and tulips grow new bulbs underground from one parent bulb. What kind of reproduction is this?','Asexual reproduction','Sexual reproduction','Pollination','Seed dispersal'),
    mcLevel(2,'A kid asks if one plant can use both seeds and runners. What do you say?','Yes, strawberries do both','No, plants use only one way','Only trees can do both','Only animals can do both'),
    mcLevel(3,'In a field of identical banana plants, 90% got sick from one fungus. In a mixed field grown from seeds, 20% got sick. Which explanation fits best?','Identical plants share the same weakness','Seeds always prevent disease','The fungus only attacks mixed fields','Banana plants cannot get sick'),
    mcLevel(3,'Why can asexual reproduction help a plant spread quickly in a good habitat?','It needs no partner or pollinator','It always makes larger plants','It mixes traits from two parents','It only happens in winter'),
    mcLevel(3,'A grower wants to keep a rare orchid’s traits exactly the same. Which method should she use?','Take cuttings from the plant','Plant seeds from cross-pollination','Let bees pollinate it with others','Collect seeds from wild orchids')
  ],
  sexualPlants:[
    mcLevel(1,'A kid asks how many parents are usually involved in sexual reproduction. What do you say?','Two','One','Three','None'),
    mcLevel(1,'A visitor asks what grows inside most fruits. What do you say?','Seeds','Roots','Pollen','Leaves'),
    mcLevel(2,'After pollination, a sperm cell from the pollen joins an egg cell. What is this step called?','Fertilization','Germination','Dispersal','Photosynthesis'),
    mcLevel(2,'Which flower part grows into the fruit after fertilization?','The ovary','The petal','The stamen','The sepal'),
    mcLevel(2,'A visitor asks what is inside a seed. Which answer is best?','A tiny plant and stored food','Only water and air','Pollen and sweet nectar','A small flower and fruit'),
    mcLevel(2,'Which step comes right before fertilization in flowering plants?','Pollination','Seed dispersal','Germination','Fruit ripening'),
    mcLevel(2,'A flower’s petals fall off and a pod starts to swell. What is most likely happening?','Seeds are forming inside','The plant is dying','Roots are forming','Pollen is being made'),
    mcLevel(3,'A visitor asks for one benefit of sexual reproduction. What is the best answer?','Variety helps some offspring survive','Offspring are always identical','Only one parent is ever needed','No pollen is needed at all'),
    mcLevel(3,'Which order is correct for a flowering plant’s life cycle?','Pollination, fertilization, seed, germination','Germination, pollination, seed, fertilization','Seed, fertilization, pollination, germination','Fertilization, pollination, germination, seed'),
    mcLevel(3,'A red-flowered plant is crossed with a white-flowered plant. Of 40 offspring: 22 pink, 10 red, 8 white. What does this show?','Offspring can differ from both parents','All offspring copy one parent','Only one parent passed on traits','The plant reproduced asexually')
  ],
  seedDispersal:[
    mcLevel(1,'A squirrel buries acorns and forgets some. How does this help the oak tree?','Some acorns grow in new places','The acorns turn into leaves','The squirrel waters the tree','The tree stops making acorns'),
    mcLevel(1,'Dandelion seeds have fluffy parachutes. How are they dispersed?','By wind','By water','By animals eating them','By exploding pods'),
    mcLevel(2,'A bird eats berries and later drops the seeds far away in its waste. What does this show?','Animals can disperse seeds','Birds plant seeds on purpose','Seeds can’t survive digestion','Berries are not fruits'),
    mcLevel(2,'Some pea pods dry out and burst open, flinging seeds. How does this help the plant?','Seeds land away from the parent','Seeds stay right under the parent','It attracts pollinators','It keeps seeds from growing'),
    mcLevel(2,'A seed has a hard, waterproof coat and floats. Where would it most likely spread?','Along rivers and coasts','Only on mountaintops','Inside animal fur','Only under its parent'),
    mcLevel(2,'A plant grows on a cliff above the ocean. Which seed type would most help it spread?','Seeds that float','Seeds with hooks','Heavy seeds that drop','Seeds that need burying'),
    mcLevel(3,'Students dropped seeds in front of a fan. Average distance: Seed A (wings) 3.1 m, Seed B (round, smooth) 0.4 m, Seed C (fluffy) 4.8 m. Which seed is best adapted for wind?','Seed C','Seed A','Seed B','All are equal'),
    mcLevel(3,'Students test how far different seeds travel in wind from a fan. What should stay the same for every seed?','Drop height and fan speed','The type of seed','The distance traveled','The seed’s shape'),
    mcLevel(3,'Why do many fruits change from green to bright red when ripe?','To show animals seeds are ready','To keep hungry animals away','To catch more of the wind','To help the fruit float'),
    mcLevel(3,'A student claims animals that eat fruit help plants spread. Which evidence best supports this?','Seeds in droppings sprout far away','Animals also eat many leaves','Fruit rots if nobody eats it','Some animals dig up roots')
  ],
  digestionHumans:[
    mcLevel(1,'A visitor asks what saliva does. What do you say?','Starts breaking down food','Pumps food to the stomach','Absorbs nutrients','Stores bile'),
    mcLevel(1,'Which organ connects the mouth to the stomach?','Esophagus','Small intestine','Liver','Large intestine'),
    mcLevel(1,'A kid asks what the tongue does during digestion. What do you say?','Moves food and helps swallowing','Makes acid for the stomach','Absorbs water from food','Makes bile to digest fat'),
    mcLevel(1,'Which teeth are best for biting off pieces of food?','Incisors','Molars','Premolars','Wisdom teeth'),
    mcLevel(2,'Chewing is mechanical digestion. Which is an example of chemical digestion?','Saliva breaking down starch','Teeth grinding up food','The tongue moving food','Swallowing a big bite'),
    mcLevel(2,'When the stomach churns and squeezes food, what kind of digestion is it?','Mechanical digestion','Nutrient absorption','Waste elimination','Blood circulation'),
    mcLevel(3,'A kid notices a cracker starts to taste sweet after long chewing. What explains this?','Saliva breaks starch into sugar','Teeth add sugar to food','The tongue makes sugar','Air turns starch into sugar'),
    mcLevel(3,'A visitor asks how food moves down the esophagus, even when you lie down. What do you explain?','Muscles squeeze it along in waves','Gravity is the only force','Saliva pushes the food down','The stomach sucks it down'),
    mcLevel(3,'A visitor asks why stomach acid doesn’t digest the stomach itself. What do you explain?','A mucus lining protects it','The acid is not very strong','The stomach is made of bone','Food blocks all the acid'),
    mcLevel(3,'A student mixes starch with saliva in one tube and with water in another. After 10 minutes, the saliva tube has little starch left; the water tube has lots. What does this show?','Saliva breaks down starch','Water breaks down starch','Starch cannot be broken down','Both tubes acted the same')
  ],
  digestionIntestines:[
    mcLevel(1,'A visitor asks where absorbed nutrients go from the small intestine. What do you say?','Into the blood','Into the lungs','Back to the stomach','Into the bones directly'),
    mcLevel(1,'Which is the longest part of the digestive tract?','Small intestine','Large intestine','Stomach','Esophagus'),
    mcLevel(2,'What does the pancreas send to the small intestine?','Digestive enzymes','Saliva','Stomach acid','Blood cells'),
    mcLevel(2,'A kid asks what helpful bacteria in the large intestine do. What do you say?','Break down some leftover food','Make acid for the stomach','Grind food into pieces','Carry oxygen to cells'),
    mcLevel(2,'A visitor asks what bile does in the small intestine. What do you explain?','Breaks fat into small drops','Absorbs water','Kills all bacteria','Turns starch into sugar'),
    mcLevel(2,'After the large intestine absorbs water, where does the leftover waste go?','To the rectum to leave the body','Back to the small intestine','Into the blood','Back to the stomach'),
    mcLevel(3,'A person has very watery waste. Which organ is most likely not doing its job well?','Large intestine','Esophagus','Mouth','Liver'),
    mcLevel(3,'A student compares two tubes of the same length: one smooth inside, one with many folds. Which could absorb more?','The folded tube','The smooth tube','Both exactly the same','Neither tube'),
    mcLevel(3,'An illness flattens the villi in the small intestine. What would most likely happen?','Fewer nutrients would be absorbed','More water would be absorbed','Food would be chewed better','The stomach would shrink'),
    mcLevel(3,'Lab samples show protein is only partly broken down in the stomach, but protein, fat, and starch are fully broken down in the small intestine. Which conclusion fits?','Most digestion finishes in the small intestine','The stomach finishes all digestion','The small intestine does no digestion','Only the mouth breaks down protein')
  ],
  humanDigestion:[
    mcLevel(1,'A visitor asks why we need a digestive system at all. What do you say?','Cells need small nutrient pieces','Food is already small enough','It makes blood cells','It controls breathing'),
    mcLevel(2,'Which two organs make digestive juices but are not on food’s path?','Liver and pancreas','Stomach and esophagus','Mouth and tongue','Small and large intestine'),
    mcLevel(2,'Fiber is not digested. Why is it still useful?','It helps waste move through','It gives the most energy','It turns into muscle','It is absorbed into blood'),
    mcLevel(2,'Average time food spends in each organ: mouth 1 minute, stomach 3 hours, small intestine 5 hours, large intestine 30 hours. Where does food stay longest?','Large intestine','Stomach','Small intestine','Mouth'),
    mcLevel(2,'Which systems deliver the oxygen that digestive organs need?','Respiratory and circulatory','Skeletal and muscular','Nervous and skeletal','Digestive system alone'),
    mcLevel(3,'A person’s pancreas stops making enzymes. Which problem is most likely?','Food is not fully broken down','Food cannot be swallowed','Teeth stop working','The mouth absorbs no water'),
    mcLevel(3,'A visitor asks how the nervous system helps digestion. What do you explain?','It signals muscles to move food','It absorbs the nutrients','It makes bile for fats','It stores extra waste'),
    mcLevel(3,'Which pair shows mechanical digestion and then chemical digestion?','Teeth chewing, then enzymes acting','Enzymes acting, then absorption','Absorption, then chewing','Water absorbed, then chewing'),
    mcLevel(3,'Blood leaving the small intestine carries more nutrients than blood going in. What does this show?','Nutrients were absorbed there','Blood makes its own nutrients','The intestine removes nutrients','Nothing happens in the intestine'),
    mcLevel(3,'A student claims the small intestine is built for absorption. Which evidence best supports this?','It is long and lined with villi','It is next to the stomach','It is shaped like a tube','It contains some bacteria')
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
const KHAN = 'https://www.khanacademy.org/';
const GRAMMAR = `${KHAN}humanities/grammar/parts-of-speech-the-`, WORLD = `${KHAN}humanities/world-history/x66f79d8a:`, BIO6 = `${KHAN}science/grade-6-science/x88f5990a7622d8f5:life-sciences/x88f5990a7622d8f5:`;
const KHAN_LINKS = {
  nouns:{intro:`${GRAMMAR}noun/grammar-nouns/v/introduction-to-nouns-the-parts-of-speech-grammar-khan-academy`,types:`${GRAMMAR}noun/types-of-nouns/v/common-and-proper-nouns`,irregularBase:`${GRAMMAR}noun/irregular-plural-nouns-base-plurals-and-irregular-endings/v/irregular-plural-nouns-part-i-the-parts-of-speech-grammar-khan-academy`,irregularForeign:`${GRAMMAR}noun/irregular-plural-nouns-mutant-and-foreign-plurals/v/irregular-plural-nouns-part-iv-the-parts-of-speech-grammar`},
  verbs:{foundation:`${GRAMMAR}verb/introduction-to-verbs/v/introduction-to-verbs-the-parts-of-speech-grammar`,irregular:`${GRAMMAR}verb/irregular-verbs/v/introduction-to-irregular-verbs-the-parts-of-speech-grammar`,aspect:`${GRAMMAR}verb/verb-aspect-simple-progressive-and-perfect/v/intro-to-aspect`,aspectModal:`${GRAMMAR}verb/verb-aspect-and-modal-verbs/v/perfect-progressive-aspect-the-parts-of-speech-grammar`},
  history:{stories:`${WORLD}origins-of-history/x66f79d8a:history-stories-1-1/v/meet-oer-project-world-history`,frames:`${WORLD}origins-of-history/x66f79d8a:history-frames-1-3/v/frame-concept-introduction-world-history-project-beta`,memory:`${WORLD}origins-of-history/x66f79d8a:history-and-memory-1-4/a/activity-opener-worst-day-ever`},
  history2:{earliestHumans:`${WORLD}early-humans/x66f79d8a:the-earliest-humans-2-1/a/activity-opener-then-vs-now`,migrationArt:`${WORLD}early-humans/x66f79d8a:migration-and-art-2-2/a/activity-opener-who-s-an-authority`,foragingSocieties:`${WORLD}early-humans/x66f79d8a:foraging-societies-2-3/a/activity-opener-what-is-this-asking-introduction-origins`,agriculturalRevolution:`${WORLD}early-humans/x66f79d8a:the-agricultural-revolution-2-4/a/activity-opener-which-frame`,biggestMistake:`${WORLD}early-humans/x66f79d8a:the-biggest-mistake-humans-ever-made-2-5/a/activity-opener-casual-map-jack-and-the-giant-beanstalk`},
  history3:{earlyAmericas:`${WORLD}early-agrarian-societies/x66f79d8a:ancient-mesoamerica/a/article-ancient-agrarian-societies-mesoamerica-olmec-and-chavin-de-huantar`,ancientIndia:`${WORLD}early-agrarian-societies/x66f79d8a:indus-river-valley/a/article-ancient-agrarian-societies-indus-river-valley`,earlyAgrarian:`${WORLD}early-agrarian-societies/x66f79d8a:early-agrarian-societies-in-context/a/activity-contextualization-agrarian-societies`},
  bio1:{cells:`${BIO6}cellular-organization/v/ms-cells-and-organisms`,plants:`${BIO6}reproduction-in-plants/v/ms-plant-reproductive-success`,digestion:`${BIO6}human-digestive-system/e/digestion-in-humans-and-herbivores`}
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
    q('Which noun needs -es to make it plural?','watch','pen','cup','road')
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
    q('Which noun should begin with a capital letter?','Thursday','season','morning','week'),
    q('A proper noun names a specific person, place, or thing. Which is the best example?','Mount Everest','mountain','hill','peak')
  ],
  concreteAbstract:[
    q('Which noun is concrete?','pencil','freedom','honesty','courage'),
    q('Which noun is abstract?','friendship','bicycle','mountain','lantern'),
    q('Which noun in the sentence is abstract? The children felt great joy at the parade.','joy','children','parade','great'),
    q('Which noun can you detect with your five senses?','thunder','justice','loyalty','wisdom'),
    q('Which sentence has an abstract noun?','Her kindness made everyone smile.','Her backpack fell on the floor.','The puppy chased the ball.','He drank cold water.'),
    q('Which noun is abstract?','excitement','sandwich','window','blanket'),
    q('Which noun is concrete?','bakery','patience','curiosity','pride'),
    q('Is the noun "freedom" concrete or abstract?','Abstract: it names an idea','Concrete: you can touch it','Proper: it names a place','Plural: it names more than one'),
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
    q('What is the plural of person?','people','persons only','peoples','personen')
  ],
  basePlurals:[
    q('What is the plural of sheep?','sheep','sheeps','sheepes','sheepies'),
    q('What is the plural of deer?','deer','deers','deeres','deerses'),
    q('The hunter saw five ___ in the woods.','deer','deers','deeres','deerses'),
    q('Which sentence is correct?','Two fish swam by.','Two fishs swam by.','Two fishies swam by.','Two fishses swam by.'),
    q('Which word has the same singular and plural form?','series','book','leaf','tooth'),
    q('What is the plural of moose?','moose','mooses','meese','moosen'),
    q('Which sentence is correct?','We caught six salmon at the river.','We caught six salmons at the river.','We caught six salmones at the river.','We caught six salmonen at the river.'),
    q('What is the plural of aircraft?','aircraft','aircrafts','aircrafves','aircraften'),
    q('Which noun stays the same in the plural?','species','box','child','mouse'),
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
    q('Which sentence is correct?','The mice hid in the wall.','The mouses hid in the wall.','The mices hid in the wall.','The mouse hid in the wall.'),
    q('My shoes hurt my ___.','feet','foots','foot','feets')
  ],
  foreignPlurals:[
    q('What is the plural of cactus?','cacti','cactuses only','cactus','cactis'),
    q('What is the plural of criterion?','criteria','criterions','criteriones','criterias'),
    q('What is the plural of fungus?','fungi','funguses only','fungus','fungis'),
    q('What is the plural of alumnus?','alumni','alumnuses','alumnus','alumnis'),
    q('What is the plural of nucleus?','nuclei','nucleuses only','nucleus','nucleis'),
    q('What is the plural of phenomenon?','phenomena','phenomenons only','phenomenones','phenomenas'),
    q('What is the plural of analysis?','analyses','analysises','analysi','analysis'),
    q('What is the plural of crisis?','crises','crisises','crisi','crisis'),
    q('What is the plural of bacterium?','bacteria','bacteriums','bacteriae','bacterias'),
    q('What is the plural of radius?','radii','raduises','radiuses only','radius')
  ],
  pluralReview:[
    q('What is the plural of knife?','knives','knifes','knife','knivies'),
    q('What is the plural of child?','children','childs','childes','child'),
    q('What is the plural of mouse?','mice','mouses','mouse','mices'),
    q('What is the plural of sheep?','sheep','sheeps','sheepes','sheepies'),
    q('What is the plural of cactus?','cacti','cactis','cactus','cactuses only'),
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
    q('The team ___ practicing today.','is','are','were','be'),
    q('Neither of the boys ___ here.','is','are','were','be'),
    q('She ___ her homework every night.','does','do','doing','done'),
    q('The books on the shelf ___ new.','are','is','was','be'),
    q('Which sentence has correct subject-verb agreement?','The cats sleep on the couch.','The cats sleeps on the couch.','The cat sleep on the couch.','The cats is sleeping on the couch.'),
    q('A flock of geese ___ overhead.','flies','fly','flying','are fly')
  ],
  verbTense:[
    q('Which sentence is in the past tense?','We watched a movie.','We watch a movie.','We will watch a movie.','We are watching a movie.'),
    q('Which sentence is in the future tense?','I will visit my aunt.','I visited my aunt.','I visit my aunt.','I visiting my aunt.'),
    q('Yesterday, Sam ___ the fence.','painted','paints','will paint','painting'),
    q('Tomorrow, we ___ to the zoo.','will go','went','going','gone'),
    q('Right now, the cat ___ on the windowsill.','sits','sat','will sat','sitted'),
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
    q('Which sentence uses a linking verb?','The pie looks tasty.','The pie burned.','Mom baked a pie.','We ate the pie.'),
    q('Which is a helping verb?','will','run','happy','quickly'),
    q('In "They are playing outside," which word is the helping verb?','are','They','playing','outside'),
    q('In "Leo kicked the ball," what kind of verb is kicked?','action verb','linking verb','helping verb','noun'),
    q('Which of these is always a linking verb?','is','jump','throw','sing'),
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
    q('Which sentence is in the simple present?','Maya reads every night.','Maya is reading.','Maya has read.','Maya was reading.'),
    q('Which sentence is in the simple past?','The team won the game.','The team is winning the game.','The team has won the game.','The team will win the game.'),
    q('Which sentence is in the simple future?','We will visit Grandma.','We visited Grandma.','We are visiting Grandma.','We have visited Grandma.'),
    q('Simple present often shows a habit. Which sentence shows a habit?','He brushes his teeth every morning.','He is brushing his teeth.','He brushed his teeth.','He will brush his teeth.'),
    q('Choose the simple past: Last week, we ___ a fort.','built','build','are building','have built'),
    q('Which verb is simple future?','will bake','baked','is baking','bakes'),
    q('Water ___ at 100 degrees Celsius. (a fact)','boils','boiled','is boiling','will have boiled'),
    q('Which verb is simple past?','jumped','jumps','will jump','is jumping'),
    q('Which sentence is in the simple present?','The sun rises in the east.','The sun rose in the east.','The sun will rise in the east.','The sun was rising in the east.'),
    q('Yesterday, Dad ___ the car.','washed','washes','will wash','is washing')
  ],
  progressiveAspect:[
    q('Which sentence uses the present progressive?','Ana is writing a letter.','Ana writes a letter.','Ana wrote a letter.','Ana has written a letter.'),
    q('Which sentence uses the past progressive?','They were playing outside.','They played outside.','They are playing outside.','They will play outside.'),
    q('Which sentence uses the future progressive?','I will be studying at noon.','I study at noon.','I studied at noon.','I am studying at noon.'),
    q('Right now, the kids ___ in the pool.','are swimming','swam','will swim','have swum'),
    q('At 8 o\'clock last night, I ___ dinner.','was cooking','cook','am cooking','will cook'),
    q('Progressive verbs use a form of be plus which ending?','-ing','-ed','-s','-en'),
    q('Which verb phrase is progressive?','is running','runs','ran','has run'),
    q('Tomorrow at noon, we ___ on the bus.','will be riding','rode','ride','have ridden'),
    q('While I ___, the phone rang.','was sleeping','slept','sleep','will sleep'),
    q('Which sentence shows an action in progress right now?','The baby is crying.','The baby cried.','The baby will cry.','The baby cries.')
  ],
  perfectAspect:[
    q('Which sentence uses the present perfect?','I have finished my project.','I finish my project.','I am finishing my project.','I finished my project.'),
    q('Which sentence uses the past perfect?','She had left before we arrived.','She leaves before we arrive.','She has left before we arrive.','She will leave before we arrive.'),
    q('Which sentence uses the future perfect?','By Friday, I will have read the book.','By Friday, I read the book.','By Friday, I had read the book.','By Friday, I am reading the book.'),
    q('Perfect verbs use a form of have plus a ___.','past participle','base verb','-ing verb','noun'),
    q('We ___ lived here for five years.','have','has','had been','is'),
    q('Before the movie started, we ___ our seats.','had found','have found','will find','are finding'),
    q('Which is the past participle of eat?','eaten','ate','eating','eats'),
    q('By next June, they ___ the house.','will have built','built','have build','are building'),
    q('Which verb phrase is present perfect?','has walked','walked','is walking','had walked'),
    q('Which sentence is correct?','He has seen that movie twice.','He has saw that movie twice.','He have seen that movie twice.','He has see that movie twice.')
  ],
  perfectProgressive:[
    q('Which sentence uses the present perfect progressive?','She has been reading for an hour.','She is reading for an hour.','She had read for an hour.','She reads for an hour.'),
    q('Which sentence uses the past perfect progressive?','They had been waiting for ages.','They have been waiting for ages.','They were waiting for ages.','They waited for ages.'),
    q('Which sentence uses the future perfect progressive?','By noon, I will have been working for four hours.','By noon, I will work for four hours.','By noon, I have worked four hours.','By noon, I was working four hours.'),
    q('Perfect progressive verbs use have + been + a verb ending in what?','-ing','-ed','-s','-er'),
    q('It ___ raining all morning, and it is still raining.','has been','is being','had','was be'),
    q('When Dad got home, I ___ for two hours.','had been studying','have been studying','will be studying','am studying'),
    q('We ___ practicing since 3 o\'clock.','have been','has been','are','were being'),
    q('Which verb phrase is perfect progressive?','has been singing','has sung','is singing','sang'),
    q('Next month, she ___ here for a year.','will have been working','has working','is worked','had work'),
    q('Which sentence is correct?','He has been running since sunrise.','He has been run since sunrise.','He have been running since sunrise.','He has being running since sunrise.')
  ],
  tenseAspectTime:[
    q('Which sentence shows an action that finished before another past action?','I had eaten before she called.','I eat before she called.','I was eating before she called.','I will eat before she called.'),
    q('Which sentence shows an action that began in the past and continues now?','We have lived here since 2020.','We lived here since 2020.','We live here since 2020.','We will live here since 2020.'),
    q('Which sentence keeps the tense consistent?','She opened the door and walked inside.','She opened the door and walks inside.','She opens the door and walked inside.','She will open the door and walked inside.'),
    q('Choose the best verb: By the time we arrived, the show ___.','had started','starts','will start','is starting'),
    q('Choose the best verb: I ___ here since breakfast.','have been waiting','am waited','waited','will have wait'),
    q('Choose the best verb: At this moment, the chef ___ soup.','is stirring','stirred','had stirred','will have stirred'),
    q('Which sentence is about a future action in progress?','She will be flying home at noon.','She flew home at noon.','She has flown home.','She is flying home.'),
    q('Which sentence has a tense shift error?','Yesterday he runs to school and was late.','Yesterday he ran to school and was late.','Today he runs to school and is early.','Tomorrow he will run and be early.'),
    q('Which sentence says the action will be complete by a future time?','By May, I will have finished.','By May, I finished.','By May, I am finishing.','By May, I had finished.'),
    q('Choose the best verb: While Mom cooked, I ___ the table.','was setting','set now','will set','have setting')
  ],
  modalVerbs:[
    q('Which word is a modal verb?','might','run','happy','quickly'),
    q('Which modal shows ability? I ___ swim across the pool.','can','must','should','might'),
    q('Which modal shows necessity? You ___ wear a helmet.','must','can','may','could not'),
    q('Which modal shows a possibility? It ___ rain tonight.','might','must','shall','did'),
    q('Which modal gives permission? ___ I borrow your pen?','May','Will','Must','Did'),
    q('Which sentence is correct?','She can play the piano.','She can plays the piano.','She cans play the piano.','She can playing the piano.'),
    q('Which modal gives advice? You ___ drink more water.','should','can','did','are'),
    q('A modal verb is followed by the ___ form of the verb.','base','past','-ing','-s'),
    q('Which sentence is correct?','We should leave now.','We should to leave now.','We should leaving now.','We should left now.'),
    q('Which modal is the strongest (a rule or must-do)?','must','might','could','may')
  ]
};
/* ---------- end of the moved banks ---------- */

export {
  ENGLISH_UNIT1, ENGLISH_GROUPS, ENGLISH_UNIT2, ENGLISH_GROUPS2,
  HISTORY_UNIT1, HISTORY_GROUPS, HISTORY_UNIT2, HISTORY_GROUPS2, HISTORY_UNIT3, HISTORY_GROUPS3, HISTORY_UNIT4, HISTORY_GROUPS4,
  BIO_UNIT1, BIO_GROUPS,
  HISTORY_QUESTIONS, HISTORY2_QUESTIONS, HISTORY3_QUESTIONS, HISTORY4_QUESTIONS, BIO1_QUESTIONS, PLURAL_QUESTIONS, VERB_QUESTIONS,
  KHAN, KHAN_LINKS, mc
};

/* ---------- teacher lesson links and question edits (docs: LESSON-CONTENT.md) ---------- */

/* The courses that have question banks, in the order the teacher app lists them. */
export const LESSON_COURSES = [
  {id:'nouns', title:'English Unit 1: Nouns', skills:ENGLISH_UNIT1, groups:ENGLISH_GROUPS},
  {id:'verbs', title:'English Unit 2: Verbs', skills:ENGLISH_UNIT2, groups:ENGLISH_GROUPS2},
  {id:'history', title:'History Unit 1: Origins of History', skills:HISTORY_UNIT1, groups:HISTORY_GROUPS},
  {id:'history2', title:'History Unit 2: Early Humans', skills:HISTORY_UNIT2, groups:HISTORY_GROUPS2},
  {id:'history3', title:'History Unit 3: Early Agrarian Societies', skills:HISTORY_UNIT3, groups:HISTORY_GROUPS3},
  {id:'history4', title:'History Unit 4: Empires and Belief Systems', skills:HISTORY_UNIT4, groups:HISTORY_GROUPS4},
  {id:'bio1', title:'Biology Unit 1: Life Sciences', skills:BIO_UNIT1, groups:BIO_GROUPS}
];

/* The built-in bank for a course, the same lookup englishQuestions() uses in the game. */
export function builtInBank(courseId){
  return courseId === 'bio1' ? BIO1_QUESTIONS
    : courseId === 'history4' ? HISTORY4_QUESTIONS : courseId === 'history3' ? HISTORY3_QUESTIONS
    : courseId === 'history2' ? HISTORY2_QUESTIONS : courseId === 'history' ? HISTORY_QUESTIONS
    : courseId === 'verbs' ? VERB_QUESTIONS : PLURAL_QUESTIONS;
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
