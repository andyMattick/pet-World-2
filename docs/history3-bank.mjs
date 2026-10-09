// History Unit 3 question bank. Run from the repo root:  node docs/history3-bank.mjs
// 1. Rewrites the answer choices of the 36 original questions so the right answer is never the longest choice
//    and no wrong answer is silly. Prompts stay the same. (A teacher's hide or edit of an original question stops
//    applying, because question ids come from the prompt and correct answer; none exist yet for this unit.)
// 2. Tags the 36 originals by difficulty and adds 10 questions to each of the 9 lessons (4 -> 14).
// Works on src/shared/questionBanks.js. Every change is checked first: if anything is missing, nothing is written.
// Running it twice does nothing. Each question lists the correct answer first; the game shuffles options.
import fs from 'node:fs';
const FILE = 'src/shared/questionBanks.js';
let src = fs.readFileSync(FILE, 'utf8');
if (src.includes('const HISTORY3_EXTRA_QUESTIONS')) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const ANCHOR = 'const HISTORY_UNIT2 = [';
const start = src.indexOf('const HISTORY3_QUESTIONS = {'), at = src.indexOf(ANCHOR);
if (start < 0 || at < start || src.split(ANCHOR).length !== 2) { console.log('NOT APPLIED: could not find the History Unit 3 bank in ' + FILE + '. Nothing changed.'); process.exit(1); }

// [lesson, current line, new line]
const FIXES = [
[
"villageNetworks",
"mc('A traveler asks how the small villages you visit are connected to each other. What do you say?','Through networks of exchange and communication','They were completely isolated','Only through written laws','Only through large empires')",
"mc('A traveler asks how the small villages you visit are connected to each other. What do you say?',\"Through trade and shared news\",\"They were cut off from each other\",\"Only through written letters\",\"Only through a ruling empire\")"
],
[
"villageNetworks",
"mc('The traveler asks which groups the farming villages deal with. Who do you name?','Foragers, herders, and nomads','Only other farmers','No outsiders','Only rulers of empires')",
"mc('The traveler asks which groups the farming villages deal with. Who do you name?',\"Foragers, herders, and nomads\",\"Only farmers from other villages\",\"Only the kings of big cities\",\"No outsiders at all\")"
],
[
"villageNetworks",
"mc('A villager asks why they should trade with a herder like you. What is the best reason?','They could exchange different goods and resources','Herders never traded','Villages produced nothing','Trade was impossible without writing')",
"mc('A villager asks why they should trade with a herder like you. What is the best reason?',\"To swap goods each side lacks\",\"Herders are not allowed to trade\",\"Villages already make everything\",\"Trade only works with writing\")"
],
[
"villageNetworks",
"mc('A reporter from the future asks what your trading trips show historians. What do you say?','That small communities were part of wider connections','That villages never changed','That all people lived the same way','That cities appeared first')",
"mc('A reporter from the future asks what your trading trips show historians. What do you say?',\"Small villages had wide connections\",\"Villages never changed over time\",\"Everyone everywhere lived the same way of life\",\"Cities came before villages did\")"
],
[
"firstCities",
"mc('A farmer from the countryside asks how Uruk got so big. What happened as farming spread and grew stronger?','Communities grew and some villages became cities','All people returned to foraging','Cities disappeared','Trade stopped')",
"mc('A farmer from the countryside asks how Uruk got so big. What happened as farming spread and grew stronger?',\"Villages grew into cities\",\"People went back to foraging\",\"Farmers moved to the mountains\",\"Trade between villages stopped\")"
],
[
"firstCities",
"mc('A visitor asks what you mean when you say Uruk rules a “state.” What is a state?','A political organization that governs a territory and people','A single farming tool','A type of crop','A small family group')",
"mc('A visitor asks what you mean when you say Uruk rules a “state.” What is a state?',\"A government that rules land and people\",\"A large family that farms together\",\"A market where farmers trade goods\",\"A temple where the priests hold their ceremonies\")"
],
[
"firstCities",
"mc('A merchant asks how cities like yours joined together into powerful states. What do you say?','Through connections such as trade, leadership, and shared institutions','By avoiding all contact','By staying separate villages','By ending farming')",
"mc('A merchant asks how cities like yours joined together into powerful states. What do you say?',\"Through trade, leaders, and shared laws\",\"By cutting off contact with others\",\"By staying as small villages that rarely met\",\"By giving up farming for hunting\")"
],
[
"firstCities",
"mc('The visitor notices how crowded and busy Uruk is. Which change comes with growing cities?','More people living together and more complex societies','Smaller and simpler communities','Less need for organization','No new leadership')",
"mc('The visitor notices how crowded and busy Uruk is. Which change comes with growing cities?',\"More people and more complex jobs\",\"Smaller and simpler communities\",\"Less need for leaders or rules\",\"Fewer kinds of work, since everyone farms\")"
],
[
"tradeNetworks",
"mc('A young sailor asks which kind of trade is most common in your world. What do you tell them?','Local networks','Global airline routes','Only ocean liners','Digital markets')",
"mc('A young sailor asks which kind of trade is most common in your world. What do you tell them?',\"Trade with nearby towns\",\"Trade across whole oceans\",\"Trade by long caravans only\",\"Trade between far continents\")"
],
[
"tradeNetworks",
"mc('A reporter from the future asks which regions long-distance trade connects. What do you answer?','Afro-Eurasia and the Americas','Only one village','Only Antarctica','Only one river valley')",
"mc('A reporter from the future asks which regions long-distance trade connects. What do you answer?',\"Afro-Eurasia and the Americas\",\"Only towns along a single river\",\"Only the island of Bahrain\",\"Only Europe and nowhere else\")"
],
[
"tradeNetworks",
"mc('Your apprentice asks why people pay so much for goods from far away. What do you say?','They might lack certain resources or want valued items','Distant goods were always identical to local ones','Trade prevented all contact','Only rulers could use goods')",
"mc('Your apprentice asks why people pay so much for goods from far away. What do you say?',\"They lack those goods at home\",\"Far-off goods are just like local ones\",\"Kings forbid people to buy local goods\",\"Trade keeps groups from meeting\")"
],
[
"tradeNetworks",
"mc('Historians find your Indus beads buried in a Mesopotamian city. What do they suggest?','Connections between distant communities','That the goods fell from the sky','That no one traveled','That trade never happened')",
"mc('Historians find your Indus beads buried in a Mesopotamian city. What do they suggest?',\"Trade between distant places\",\"The beads fell into the river there\",\"No one traveled in those days\",\"The beads were made in Mesopotamia\")"
],
[
"mesopotamia",
"mc('A visiting prince asks between which two rivers your land lies. What do you tell him?','The Tigris and Euphrates','The Nile and Congo','The Mississippi and Amazon','The Rhine and Danube')",
"mc('A visiting prince asks between which two rivers your land lies. What do you tell him?',\"The Tigris and Euphrates\",\"The Nile and the Jordan\",\"The Indus and the Ganges\",\"The Yellow and the Yangtze\")"
],
[
"mesopotamia",
"mc('Your scribes ask which invention helps your government and merchants keep records. What is it?','Writing','Telephones','Printing presses','Airplanes')",
"mc('Your scribes ask which invention helps your government and merchants keep records. What is it?',\"Cuneiform writing\",\"The wheel and axle\",\"Bronze sickles\",\"Mud-brick houses\")"
],
[
"mesopotamia",
"mc('A judge asks why you had your law code carved in stone. What do law codes help do?','Set rules for behavior and settle disputes','Replace all farming','Prevent writing','End trade')",
"mc('A judge asks why you had your law code carved in stone. What do law codes help do?',\"Set rules and settle arguments\",\"Replace the need for farming\",\"Keep people from learning to write\",\"Stop all trade with other lands\")"
],
[
"mesopotamia",
"mc('A traveler sees the giant temple in the center of your city. How does religion shape your cities?','Temples and beliefs were central to community life','Cities had no beliefs','Religion banned cities','Temples were unrelated to leaders')",
"mc('A traveler sees the giant temple in the center of your city. How does religion shape your cities?',\"Temples sat at the center of city life\",\"Cities had no gods or temples at all\",\"Religion was banned inside city walls\",\"Temples were far from where people lived\")"
],
[
"shangChina",
"mc('A soldier asks which technology makes Shang weapons and ritual vessels so strong. What is it?','Bronze','Steel skyscrapers','Plastic','Electricity')",
"mc('A soldier asks which technology makes Shang weapons and ritual vessels so strong. What is it?',\"Bronze\",\"Iron\",\"Steel\",\"Copper\")"
],
[
"shangChina",
"mc('A child asks what Shang ancestor worship is about. What do you say?','Honoring ancestors in religious practice','Ignoring family history','Banning ceremonies','Worshiping only machines')",
"mc('A child asks what Shang ancestor worship is about. What do you say?',\"Honoring family members who died\",\"Forgetting family history\",\"Worshiping only the sun and the moon\",\"Obeying only living elders\")"
],
[
"shangChina",
"mc('A historian from the future asks what writing from your time they can study. What do you tell them?','Inscriptions on bones and bronze','Digital files','Printed newspapers','Typewritten letters')",
"mc('A historian from the future asks what writing from your time they can study. What do you tell them?',\"Inscriptions on bones and bronze\",\"Printed books and newspapers\",\"Long letters written on paper scrolls\",\"Carvings on pyramid walls\")"
],
[
"shangChina",
"mc('A visitor asks how the Shang king holds your society together. How does political power support it?','Rulers organized people, resources, and religion','Rulers had no role','Everyone governed separately','Farming was unnecessary')",
"mc('A visitor asks how the Shang king holds your society together. How does political power support it?',\"The king led armies, rituals, and work\",\"The king had no real role at all\",\"Each family ruled itself with no one in charge\",\"Priests ruled and the king farmed\")"
],
[
"egyptNubia",
"mc('A visitor asks which river shapes both your kingdom and Egypt. What do you answer?','The Nile','The Yangtze','The Rhine','The Seine')",
"mc('A visitor asks which river shapes both your kingdom and Egypt. What do you answer?',\"The Nile\",\"The Jordan\",\"The Niger\",\"The Tigris\")"
],
[
"egyptNubia",
"mc('A farmer asks why the river matters so much for crops. What do you say?','Its flooding and water supported crops','It froze every year','It removed all soil','It had no effect')",
"mc('A farmer asks why the river matters so much for crops. What do you say?',\"Floods left rich soil for crops\",\"It froze solid every winter\",\"Its floods washed away all soil\",\"Rain fell there every day\")"
],
[
"egyptNubia",
"mc('A reporter from the future asks how to describe Nubia and Egypt. What is the best description?','Neighboring societies that influenced each other','Societies with no contact','One society that never changed','Societies on different continents with no trade')",
"mc('A reporter from the future asks how to describe Nubia and Egypt. What is the best description?',\"Neighbors who shaped each other\",\"Societies with no contact at all\",\"One society that never changed\",\"Rivals on two distant continents\")"
],
[
"egyptNubia",
"mc('A historian wants proof that Nubia and Egypt influenced each other. Which evidence could show it?','Shared artifacts, trade, and political contact','A modern map only','A single unlabeled rock','Nothing could show it')",
"mc('A historian wants proof that Nubia and Egypt influenced each other. Which evidence could show it?',\"Shared styles, trade goods, and rulers\",\"A modern map of the Nile Valley\",\"A single unlabeled rock found in the desert\",\"Nothing could ever show it\")"
],
[
"earlyAmericas",
"mc('A visitor from the future asks the name of your people, one of the earliest complex societies in Mesoamerica. What are you called?','The Olmec','The Shang','The Sumerians','The Hittites')",
"mc('A visitor from the future asks the name of your people, one of the earliest complex societies in Mesoamerica. What are you called?',\"The Olmec\",\"The Shang\",\"The Sumerians\",\"The Hittites\")"
],
[
"earlyAmericas",
"mc('A traveler from the south tells you about a temple called Chavín de Huantar. Where is it?','The Andes of South America','The Nile Valley','Mesopotamia','The Arctic')",
"mc('A traveler from the south tells you about a temple called Chavín de Huantar. Where is it?',\"The Andes of South America\",\"The deserts of North Africa\",\"The plains of North America\",\"The jungles of Central America\")"
],
[
"earlyAmericas",
"mc('The traveler asks why their society is so different from yours. What do you say?','They adapted to different environments and resources','All regions were identical','They had no farms','Geography did not matter')",
"mc('The traveler asks why their society is so different from yours. What do you say?',\"They live in a very different land\",\"Every land in the world is exactly the same\",\"They have no farms at all\",\"Land and weather never matter\")"
],
[
"earlyAmericas",
"mc('A historian from the future wants to learn about your society. How can they do it?','By studying artifacts, buildings, and other evidence','Only from modern novels','Only from one written law','They cannot study them')",
"mc('A historian from the future wants to learn about your society. How can they do it?',\"By studying ruins, carvings, and tools\",\"Only by reading novels written in modern times\",\"Only from one written law code\",\"There is no way to study them\")"
],
[
"ancientIndia",
"mc('A visitor asks which river valley your city sits in. What do you tell them?','The Indus','The Rhine','The Mississippi','The Seine')",
"mc('A visitor asks which river valley your city sits in. What do you tell them?',\"The Indus\",\"The Ganges\",\"The Tigris\",\"The Yellow River\")"
],
[
"ancientIndia",
"mc('The visitor is amazed by your city. What is notable about many Indus Valley cities?','Planned layouts and drainage systems','No streets','No buildings','No trade')",
"mc('The visitor is amazed by your city. What is notable about many Indus Valley cities?',\"Planned streets and covered drains\",\"Huge pyramids for the kings\",\"Walls made of stone and gold\",\"Twisting streets that wind with no plan at all\")"
],
[
"ancientIndia",
"mc('A merchant shows you a carved stone seal. What are seals and traded goods evidence of?','Trade networks and record-keeping practices','Modern computers','Only farming tools','A fully translated law code')",
"mc('A merchant shows you a carved stone seal. What are seals and traded goods evidence of?',\"Trade and keeping records\",\"Modern computer use\",\"Only farming tools\",\"A full law code we can read today\")"
],
[
"ancientIndia",
"mc('A historian from the future cannot read your writing. How can they study your city?','By analyzing archaeological evidence such as buildings and artifacts','By guessing without evidence','By ignoring the society','By using only modern newspapers')",
"mc('A historian from the future cannot read your writing. How can they study your city?',\"By studying ruins and artifacts\",\"By guessing without any evidence\",\"By ignoring your city completely\",\"By reading modern newspapers\")"
],
[
"earlyAgrarian",
"mc('A young trader asks why every kingdom you visited grew up in its own way. What do you say?','Geographic context shaped their resources and choices','All used identical resources','Climate never mattered','They never farmed')",
"mc('A young trader asks why every kingdom you visited grew up in its own way. What do you say?',\"Each land had its own rivers and resources\",\"All of them used exactly the same resources\",\"Climate never mattered to farmers\",\"None of the kingdoms farmed at all\")"
],
[
"earlyAgrarian",
"mc('The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?','Identify similarities and differences in farming, cities, and trade','Assume they were the same','Compare only their names','Ignore their environments')",
"mc('The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?',\"Look for what is alike and what is different\",\"Assume that all four were the same in every way\",\"Compare only their names\",\"Ignore where each one was found\")"
],
[
"earlyAgrarian",
"mc('The trader asks what all those kingdoms had in common. Which similarity do you name?','Farming supported growing communities','None used farming','All had identical rulers','All were in the same place')",
"mc('The trader asks what all those kingdoms had in common. Which similarity do you name?',\"Farming fed growing cities\",\"None of them farmed\",\"All of them shared one ruler\",\"All were in one place\")"
],
[
"earlyAgrarian",
"mc('A historian asks why you always explain where and when a society lived. Why is context important?','It helps explain why events and choices happened','It makes evidence unnecessary','It proves every society was equal in size','It removes differences between regions')",
"mc('A historian asks why you always explain where and when a society lived. Why is context important?',\"It helps explain why things happened\",\"It makes evidence unnecessary\",\"It proves every society was the same size\",\"It erases differences between lands\")"
]
];
// [difficulty, prompt, correct, wrong, wrong, wrong]
const Q = {
"villageNetworks": [
[
1,
"The traveler asks what you bring to the villages to trade. What is most likely?",
"Wool, milk, and animals",
"Bronze swords and coins",
"Printed books and paper",
"Glass windows and iron"
],
[
1,
"A villager asks what a nomad is. What do you say?",
"Someone who moves from place to place",
"Someone who rules over several villages",
"Someone who only grows wheat",
"Someone who lives in one big city"
],
[
1,
"The villagers live in one spot all year. What lets them stay in one place?",
"Their fields and stored grain",
"Their herds of wild horses",
"Their trips to faraway cities",
"Their money in the bank"
],
[
2,
"Obsidian from a faraway volcano turns up in this village. What does that show?",
"Goods moved between distant groups",
"The village sits beside a volcano",
"Obsidian forms in every field",
"The village had no visitors at all"
],
[
2,
"A villager asks why farmers and herders depend on each other. What do you say?",
"Each has things the other needs",
"Herders rule over the villages",
"Villages cannot grow any food",
"Herders must live inside villages"
],
[
2,
"Besides goods, what else travels with you between villages?",
"Ideas, news, and skills",
"Nothing but heavy stones",
"Only orders from kings",
"Only written letters"
],
[
3,
"A historian claims these villages were linked to faraway groups. Which evidence best supports this?",
"Seashells found in villages far inland",
"Seeds of wheat found in one storage pit",
"A modern drawing of a busy village market",
"A story written thousands of years later"
],
[
3,
"Someone says early villages were cut off from the world. Which evidence would show this is wrong?",
"Goods in the village from far-off places",
"Houses built from local mud bricks",
"Village fields close to the houses",
"Grain grown in the fields next to the village"
],
[
3,
"What would most likely happen if herders like you stopped visiting the villages?",
"Villages would lose wool, milk, and news",
"Villages would grow far more wheat",
"Villages would turn into large cities",
"The village farmers would all become nomads"
],
[
3,
"A historian compares a farming village with a herding camp. Which statement is accurate?",
"Villages stayed put; herders moved with the seasons",
"Both groups moved every few days to new land",
"Both groups lived in large walled cities",
"Villagers moved with the seasons; herders stayed put"
]
],
"firstCities": [
[
1,
"A farmer asks what feeds all of Uruk’s builders and scribes. What do you say?",
"Surplus food from farmers",
"Gold dug up from the riverbanks",
"Taxes paid by factories",
"Fish from the open ocean"
],
[
1,
"A child asks what a scribe does in Uruk. What do you say?",
"Writes and keeps records",
"Grows barley in the fields",
"Builds the city walls",
"Leads the army in battle"
],
[
1,
"Which job is new in a city like Uruk, compared with a small village?",
"Full-time priest",
"Barley farmer",
"Goat herder",
"Wild plant gatherer"
],
[
2,
"A visitor asks why Uruk built strong walls. What is the best reason?",
"To protect its people and stored food",
"To keep farmers from leaving to forage",
"To mark where the rivers would flood",
"To show where the desert begins"
],
[
2,
"Why does a growing city need more organization than a village?",
"More people must share food and water",
"Cities have fewer people to feed",
"Cities do not need any farmland",
"Village life already had kings, armies and laws"
],
[
2,
"A merchant asks what makes Uruk a “state” and not just a big town. What do you say?",
"It rules nearby land and collects taxes",
"It has more houses than a village",
"It has a market for trading grain",
"It is built right beside a large river for water"
],
[
3,
"A historian claims Uruk had powerful leaders. Which evidence best supports this?",
"Huge temples that needed thousands of workers",
"Small houses made from mud bricks",
"Clay pots used for cooking at home",
"Seeds of barley found in the fields around the city"
],
[
3,
"What would most likely happen to Uruk if the farms around it had several bad harvests?",
"Food would run short for city workers",
"The city would grow faster than ever",
"Scribes would stop needing to write",
"More villages would move into the city"
],
[
3,
"A writer says cities made life better for everyone. Which evidence argues against this?",
"Records of heavy taxes and forced labor",
"Records of new jobs for skilled workers",
"Temples built for the city’s gods",
"Walls that protected the city"
],
[
3,
"A historian compares a farming village with Uruk. Which statement is accurate?",
"Uruk had more people and more kinds of jobs",
"The village had more people than Uruk did",
"Both had the same leaders and the same laws",
"Uruk had no farms nearby, so it bought food"
]
],
"tradeNetworks": [
[
1,
"A buyer asks what goods your ships usually carry. What do you say?",
"Copper, pearls, and dates",
"Silk, paper, and tea",
"Iron, coal, and steel",
"Corn, potatoes, and chocolate"
],
[
1,
"Your apprentice asks why Dilmun is such a busy port. What is the best reason?",
"It sits between two trading regions",
"It is the capital of a huge empire",
"It has the largest farms in the world",
"It is the only island in the sea"
],
[
1,
"A sailor asks how heavy goods travel fastest between your ports. What do you say?",
"By boat over the water",
"By horse-drawn train",
"By road in wagons only",
"By carrying them on foot"
],
[
2,
"Your apprentice asks why long-distance trade is rarer than local trade. What do you say?",
"It is slow, costly, and risky",
"Kings ban all local trade",
"Distant goods cost nothing",
"Boats had not been invented yet anywhere"
],
[
2,
"A Mesopotamian buyer asks why your copper is so valuable to them. What do you say?",
"Their land has very little metal",
"Copper is easy to find in their fields",
"Their kings collect only copper coins",
"They need it for printing books"
],
[
2,
"You press your seal into clay tablets to record each deal. What does this show?",
"Trade needed careful record-keeping",
"Traders could not count goods",
"Writing was used only for poems and prayers",
"Merchants never trusted writing"
],
[
3,
"A historian claims Dilmun traded with the Indus Valley. Which evidence best supports this?",
"Indus-style seals and weights found in Dilmun",
"Date palms growing all over the island",
"Old stories about a paradise island",
"Mesopotamian pots found in many Mesopotamian cities"
],
[
3,
"A trader claims long-distance trade made every town rich. Which evidence would challenge this?",
"Records of towns that never saw distant goods",
"Records of ships carrying copper and pearls",
"Rich tombs filled with fine goods from far-off lands",
"Seals used to mark goods for sale"
],
[
3,
"What would most likely happen to Dilmun if the Indus cities stopped trading by sea?",
"Dilmun’s trade and wealth would shrink",
"Dilmun would quickly grow into a huge empire",
"Mesopotamia would make its own copper",
"Dilmun’s date farms would disappear"
],
[
3,
"A historian compares local trade with long-distance trade. Which statement is accurate?",
"Long-distance trade mostly moved rare, costly goods",
"Local trade mostly moved rare, costly goods",
"Long-distance trade moved bread and water",
"Both kinds of trade moved the very same everyday goods"
]
],
"mesopotamia": [
[
1,
"A citizen asks what the name Mesopotamia means. What do you say?",
"“Land between the rivers”",
"“Land of the high mountains”",
"“Land of endless sand”",
"“Land beside the sea”"
],
[
1,
"A farmer asks how to water crops when it rarely rains. What do you tell them?",
"Dig canals from the rivers",
"Wait for the spring snow",
"Plant only cactus and palms",
"Carry seawater to the fields"
],
[
1,
"Your scribe asks what to put your laws on so everyone can see them. What do you choose?",
"A tall stone pillar",
"A long silk banner",
"A small clay tablet",
"A painted wooden board"
],
[
2,
"Your laws give different punishments depending on who was harmed. What does this show about Babylon?",
"People of different ranks were treated differently",
"Every single person was treated in exactly the same way",
"Only the king could ever be punished",
"There were no rules about harming people"
],
[
2,
"A judge asks why your laws mention fields, canals, and stolen animals so often. What do you say?",
"Farming was central to daily life",
"Most people in Babylon were sailors",
"Babylon had no farms of its own",
"Laws were written only for merchants"
],
[
2,
"A merchant asks why a city like Babylon needs writing. What is the best answer?",
"To keep track of taxes, trade, and laws",
"To write long stories that people read for fun",
"To replace speaking out loud",
"To send letters to people in the future"
],
[
3,
"A historian claims your laws were meant for everyone to know. Which evidence best supports this?",
"The laws were carved on a stone set in public",
"The laws were written in a secret code",
"Only priests were allowed to read them",
"The stone was buried deep under the palace floor"
],
[
3,
"Your law stone shows the sun god Shamash giving you the laws. Why might you show this?",
"To show the laws had the gods’ approval",
"To prove that you could not read or write",
"To show the laws would end very soon",
"To blame the god if the laws failed"
],
[
3,
"What would most likely happen if the canals were not cleaned and repaired for years?",
"Crops would fail and food would run short",
"Farms would get more water than ever before",
"The rivers would stop flooding forever",
"Cities would grow faster than before"
],
[
3,
"A historian has your law code but no records of real court cases. What is a limit of this source?",
"It shows the rules, not how they were used",
"It proves that every law was always obeyed by all",
"It was written long after you died",
"It tells nothing about Babylon at all"
]
],
"shangChina": [
[
1,
"A visitor asks which river valley the Shang kingdom grew up in. What do you say?",
"The Yellow River valley",
"The Nile River valley",
"The Indus River valley",
"The Tigris River valley"
],
[
1,
"A priest asks what oracle bones are for. What do you explain?",
"Asking the ancestors about the future",
"Making strong bronze weapons",
"Counting grain stored in the king’s storehouses",
"Building walls around cities"
],
[
1,
"A soldier asks which metal is made by mixing copper and tin. What do you say?",
"Bronze",
"Iron",
"Steel",
"Silver"
],
[
2,
"A young noble asks why bronze vessels are used in ceremonies. What do you say?",
"To offer food and drink to ancestors",
"To cook meals for the soldiers",
"To store water for the farm fields in summer",
"To trade with far-off kingdoms"
],
[
2,
"A noble asks why only rich families own many bronze objects. What do you say?",
"Bronze was costly and took skill to make",
"Bronze was found lying on the ground",
"Poor families were not allowed to cook any food",
"Bronze was invented by poor farmers"
],
[
2,
"Your tomb will hold weapons, bronze, and jade. What will it tell historians about you?",
"You held high rank and power",
"You lived as a poor farmer",
"The Shang had no metal tools",
"Tombs were only for children"
],
[
3,
"A historian claims the Shang king relied on religion to rule. Which evidence best supports this?",
"Oracle bones with the king’s questions",
"Farm tools made from stone and wood",
"Pottery used every day in ordinary homes",
"Chariot wheels found in a pit"
],
[
3,
"Oracle bones were written for the king by his diviners. What is a limit of them as a source?",
"They show mostly the king’s concerns",
"They are too new to tell us anything",
"They were written in modern Chinese",
"They describe the lives of farmers in detail"
],
[
3,
"A historian compares Shang writing with Chinese writing today. Which statement is accurate?",
"Many modern characters grew from Shang ones",
"Shang writing has no link at all to Chinese today",
"Shang people wrote with a Latin alphabet",
"Modern Chinese was invented in the 1900s"
],
[
3,
"What would most likely happen if the Shang could no longer get tin?",
"They could not make much new bronze",
"They would stop farming millet",
"Oracle bones would stop working",
"Their writing would disappear overnight"
]
],
"egyptNubia": [
[
1,
"A traveler asks what your kingdom in Nubia is also called. What do you say?",
"Kush",
"Sumer",
"Shang",
"Olmec"
],
[
1,
"A visitor asks what Nubia is famous for trading north to Egypt. What do you say?",
"Gold, ivory, and ebony",
"Silk, tea, and paper",
"Copper, pearls, dates",
"Corn, beans, and squash"
],
[
1,
"A scribe asks why so many people live close to the Nile. What do you say?",
"Its water and soil support farming",
"The desert is cooler than the river",
"The river is too dangerous to visit",
"Kings forbid living near water"
],
[
2,
"You build pyramids for your family’s tombs, like Egypt’s pharaohs. What does this show?",
"Egyptian ideas spread into Nubia",
"Nubia never had contact with Egypt",
"Pyramids were first built in China",
"Nubians did not bury their dead"
],
[
2,
"A soldier asks why Egypt and Nubia have fought over the land between them. What do you say?",
"Both wanted its gold and trade routes",
"Both wanted to stop all farming along the river",
"Neither kingdom had an army",
"The land was covered in snow"
],
[
2,
"You, a king of Kush, now rule Egypt as pharaoh. What does this show about the two lands?",
"Power could move in both directions",
"Egypt always ruled over Nubia, never the reverse",
"Nubia had no kings of its own",
"The two lands never met at all"
],
[
3,
"A historian claims Nubia shaped Egypt, not only the other way around. Which evidence best supports this?",
"Records of Kushite kings ruling Egypt",
"Egyptian pyramids built near Cairo",
"Egyptian writing found on temples all over Egypt",
"Old paintings of the Nile flooding"
],
[
3,
"An old Egyptian record calls Kush “wretched.” Why should a historian be careful with this source?",
"It was written by a rival with a bias",
"It is the only record ever found",
"Egyptians never once wrote anything about Nubia",
"It was written after Nubia ended"
],
[
3,
"What would most likely happen if the Nile’s floods failed for several years?",
"Harvests would fail along the river",
"The desert would turn into forest",
"Both kingdoms would grow more wheat",
"Trade on the river would grow"
],
[
3,
"A historian compares Nubia and Egypt. Which statement is accurate?",
"Both depended on the Nile and traded",
"Only Egypt depended on the Nile",
"Neither kingdom had any farming",
"Nubia was in Asia, far away from Egypt and the Nile"
]
],
"earlyAmericas": [
[
1,
"A visitor asks who the giant stone heads you carve show. What do you say?",
"Our rulers",
"Our enemies",
"Animals of the forest",
"Gods of the rain"
],
[
1,
"A farmer asks which crop feeds most of your people. What do you say?",
"Maize",
"Rice",
"Wheat",
"Barley"
],
[
1,
"A child asks where your giant stones come from. What do you say?",
"Mountains far away, moved by people",
"They fell from the sky in a storm",
"They grew out of the ground here",
"Traders shipped them all the way from Egypt"
],
[
2,
"A visitor asks why later peoples in Mexico use ideas like yours. What do you say?",
"Olmec ideas spread and lasted",
"Olmec people ruled all of Mexico forever",
"Later people never met anyone",
"Ideas cannot spread between groups"
],
[
2,
"Moving stones that weigh many tons takes thousands of workers. What does this show?",
"Leaders could organize large projects",
"Olmec people used modern machines",
"Each family only ever worked for itself",
"The stones were actually very light"
],
[
2,
"Jade and other goods from far away are found in your city. What does this show?",
"Your people traded across a wide area",
"Jade forms in every river in Mexico",
"Your people never left the city",
"The goods were made by your sculptors"
],
[
3,
"A historian claims the Olmec influenced later peoples. Which evidence best supports this?",
"Olmec-style art found at later sites",
"Olmec maize fields near San Lorenzo",
"A legend told in Mexico in modern times",
"Stone tools found in Olmec homes"
],
[
3,
"Your people left very little writing. How will historians learn about your beliefs?",
"From carvings, figures, and sacred sites",
"From the long history books the Olmec wrote",
"From interviews with Olmec people",
"They cannot learn anything at all"
],
[
3,
"A historian compares the Olmec with Chavín in the Andes. Which statement is accurate?",
"Both built religious centers in different lands",
"Both were in the very same river valley in Mexico",
"Chavín was built in the Nile Valley",
"Neither society had leaders or beliefs"
],
[
3,
"What would most likely happen if the rivers near your city changed course?",
"Farming and trade there would suffer",
"The city would grow faster than ever",
"People would switch to growing rice",
"Nothing, since rivers did not matter"
]
],
"ancientIndia": [
[
1,
"A builder asks what most houses in your city are made of. What do you say?",
"Baked bricks",
"Carved marble",
"Bamboo poles",
"Steel beams"
],
[
1,
"A visitor asks what the covered drains under your streets are for. What do you say?",
"Carrying away dirty water",
"Hiding gold from thieves",
"Storing grain for winter",
"Bringing water from the sea"
],
[
1,
"A merchant asks why your stone weights all come in set sizes. What do you say?",
"So trade is fair and measured",
"So soldiers can lift them easily",
"So children can play games",
"So the king can count gold"
],
[
2,
"Your bricks are the same shape as bricks in Indus cities far away. What does this suggest?",
"The cities shared standards and ideas",
"Each city made its bricks in its own way",
"Bricks were bought from Egypt",
"The cities had no contact at all"
],
[
2,
"A historian from the future asks why no one can read your writing. What is the reason?",
"It has not been decoded yet",
"There was never any writing",
"It was burned by later kings",
"It is too long to read"
],
[
2,
"A trader asks where your seals have turned up far from home. What do you say?",
"In Mesopotamia and Dilmun",
"In the cities of Shang China",
"In Rome and in Greece",
"In Olmec towns in Mexico"
],
[
3,
"Few weapons and no grand palaces have been found in your city. What can historians fairly conclude?",
"Power may have worked differently here",
"The city had no leaders of any kind",
"The people here never had any conflicts at all",
"The palaces were all taken to Egypt"
],
[
3,
"A historian claims your city was carefully planned. Which evidence best supports this?",
"Straight streets laid out in a grid",
"Pottery found in many of the houses",
"Seals carved with animal pictures",
"Beads found in Mesopotamian cities"
],
[
3,
"Historians cannot read your writing. What is the biggest limit this creates for them?",
"We know little about beliefs and rulers",
"We cannot even tell where the cities were",
"We cannot know what people built",
"We cannot study any objects at all"
],
[
3,
"What would most likely happen in your city if the drains were not kept clean?",
"Dirty water would spread sickness",
"The rivers would dry up at once",
"Trade with Dilmun would grow much larger",
"The bricks would turn into stone"
]
],
"earlyAgrarian": [
[
1,
"A buyer asks what Mesopotamia, Egypt, the Indus Valley, and Shang China all grew up beside. What do you say?",
"Large rivers",
"High mountains",
"Thick forests",
"Frozen lakes"
],
[
1,
"The buyer asks which of the kingdoms you visited used oracle bones. What do you say?",
"Shang China",
"Egypt",
"Mesopotamia",
"The Indus Valley"
],
[
1,
"Which kingdom you visited built its cities between the Tigris and Euphrates?",
"Mesopotamia",
"Egypt",
"Shang China",
"The Indus Valley"
],
[
2,
"All four kingdoms you visited used writing. Why might growing societies need it?",
"To track taxes, trade, and laws",
"To write stories for fun only",
"Because farmers asked for books",
"To talk with people far in the future"
],
[
2,
"The buyer asks why Egypt’s deserts helped its people. What do you say?",
"They made attacks harder for enemies",
"They were full of farmland",
"They brought heavy rain to Egypt every year",
"They made trade with others easy"
],
[
2,
"Shang China built with bronze tools and the Indus Valley with baked brick. What explains differences like these?",
"Each place had different resources",
"Every place had the same materials",
"Traders refused to share anything",
"Kings chose materials at random"
],
[
3,
"A historian claims river floods shaped all four kingdoms. Which evidence best supports this?",
"Canals and flood records in each valley",
"Bronze weapons found in Shang tombs",
"Indus seals found in Mesopotamia",
"Paintings of kings on the walls of temples"
],
[
3,
"Someone says every early kingdom grew in exactly the same way. Which evidence would challenge this?",
"Very different buildings, writing, and rulers",
"All four kingdoms grew up beside large rivers",
"All four kingdoms farmed grain",
"All four kingdoms had cities"
],
[
3,
"What would most likely happen to a river kingdom if its river moved far away?",
"Farming would fail and people would leave",
"The kingdom would grow much richer",
"People would start farming in the river",
"Nothing would change, since rivers were not important"
],
[
3,
"A historian compares Egypt and the Indus Valley. Which statement is accurate?",
"We can read Egypt’s writing but not the Indus",
"We can read Indus writing but not the writing of Egypt",
"Neither left behind any buildings",
"Both were ruled by Shang kings"
]
]
};
const BUILT_IN_LEVELS = {"villageNetworks": [1, 1, 2, 2], "firstCities": [1, 1, 2, 2], "tradeNetworks": [1, 1, 2, 2], "mesopotamia": [1, 1, 1, 2], "shangChina": [1, 1, 1, 2], "egyptNubia": [1, 1, 2, 2], "earlyAmericas": [1, 1, 2, 1], "ancientIndia": [1, 1, 2, 2], "earlyAgrarian": [2, 2, 1, 2]};

let block = src.slice(start, at);
const problems = [];
for (const [lesson, oldLine, newLine] of FIXES) {
  const count = block.split(oldLine).length - 1;
  if (count !== 1) { problems.push(`${lesson}: original question found ${count} times: ${oldLine.slice(0, 70)}`); continue; }
  block = block.replace(oldLine, newLine);
}
if (problems.length) { console.log('NOT APPLIED. Nothing changed:\n  ' + problems.join('\n  ')); process.exit(1); }

const lines = Object.entries(Q).map(([skillId, list]) => `  ${skillId}:[\n` + list.map(([d, ...text]) => `    histLevel(${d},${text.map(s => JSON.stringify(s)).join(',')})`).join(',\n') + '\n  ]');
const BLOCK = '// Phase 1 History Unit 3 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.\n'
  + 'const HISTORY3_EXTRA_QUESTIONS = {\n' + lines.join(',\n') + '\n};\n'
  + `const HISTORY3_BUILT_IN_LEVELS = ${JSON.stringify(BUILT_IN_LEVELS)};\n`
  + 'Object.entries(HISTORY3_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY3_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));\n'
  + 'Object.entries(HISTORY3_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY3_QUESTIONS[skillId] = [...(HISTORY3_QUESTIONS[skillId] || []), ...questions]; });\n';
src = src.slice(0, start) + block + BLOCK + src.slice(at);
fs.writeFileSync(FILE, src);
console.log('Done: 36 History Unit 3 originals fixed and tagged, 90 questions added. Run `npm run build`, then try a History Unit 3 practice.');
