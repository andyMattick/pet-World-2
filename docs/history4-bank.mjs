// History Unit 4 question bank. Run from the repo root:  node docs/history4-bank.mjs
// 1. Rewrites the answer choices of the 48 original questions so the right answer is never the longest choice
//    and no wrong answer is silly. Prompts stay the same. (A teacher's hide or edit of an original question stops
//    applying, because question ids come from the prompt and correct answer; check the Lessons & questions tab if teachers already changed this unit.)
// 2. Tags the 48 originals by difficulty and adds 10 questions to each of the 12 lessons (4 -> 14).
// Works on src/shared/questionBanks.js. Every change is checked first: if anything is missing, nothing is written.
// Running it twice does nothing. Each question lists the correct answer first; the game shuffles options.
import fs from 'node:fs';
const FILE = 'src/shared/questionBanks.js';
let src = fs.readFileSync(FILE, 'utf8');
if (src.includes('const HISTORY4_EXTRA_QUESTIONS')) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const ANCHOR = 'const BIO_UNIT1 = [';
const start = src.indexOf('const HISTORY4_QUESTIONS = {'), at = src.indexOf(ANCHOR);
if (start < 0 || at < start || src.split(ANCHOR).length !== 2) { console.log('NOT APPLIED: could not find the History Unit 4 bank in ' + FILE + '. Nothing changed.'); process.exit(1); }

// [lesson, current line, new line]
const FIXES = [
[
"portableBelief",
"mc('A fellow traveler asks what makes a belief system “portable.” What do you say?','It can travel with people to new places','It is tied to one temple only','It forbids travel','It exists only in laws')",
"mc('A fellow traveler asks what makes a belief system “portable.” What do you say?',\"It travels with people to new places\",\"It is tied to one temple only\",\"It is only practiced by one family\",\"It can only be followed inside one city\")"
],
[
"portableBelief",
"mc('The traveler asks how portable belief systems usually spread. What have you seen on your journeys?','Along trade and travel networks','Only through isolation','Only by farming','By avoiding contact')",
"mc('The traveler asks how portable belief systems usually spread. What have you seen on your journeys?',\"Along trade and travel routes\",\"Only through farming villages\",\"Only through written laws\",\"By keeping away from others\")"
],
[
"portableBelief",
"mc('The traveler asks how one belief can link people in very different places. What do you say?','Shared beliefs and practices linked people across regions','They erased all differences','They required one language only','They stopped trade')",
"mc('The traveler asks how one belief can link people in very different places. What do you say?',\"Followers share beliefs and practices\",\"They all speak the very same language everywhere\",\"They all live under one king\",\"They stop trading with outsiders\")"
],
[
"portableBelief",
"mc('You point to monks traveling in your caravan. Which is an example of a portable belief system?','Buddhism','A village boundary stone','A harvest tool','A trade price list')",
"mc('You point to monks traveling in your caravan. Which is an example of a portable belief system?',\"Buddhism\",\"A local river god\",\"A single town’s festival\",\"A family’s house shrine\")"
],
[
"hinduBuddhism",
"mc('A visiting monk asks if you know who founded Buddhism. What do you answer?','Siddhartha Gautama, the Buddha','Muhammad','Confucius','Cyrus')",
"mc('A visiting monk asks if you know who founded Buddhism. What do you answer?',\"Siddhartha Gautama\",\"Confucius of China\",\"Mahavira of India\",\"Laozi of China\")"
],
[
"hinduBuddhism",
"mc('A Hindu adviser in your court talks about dharma. What does dharma refer to?','Duty and the right way of living','A kind of trade good','A military rank','A city wall')",
"mc('A Hindu adviser in your court talks about dharma. What does dharma refer to?',\"Duty and the right way to live\",\"Wealth earned through trade\",\"The power held by a king\",\"Freedom from the cycle of rebirth\")"
],
[
"hinduBuddhism",
"mc('A child asks what the cycle of death and rebirth is called. What do you tell them?','Samsara','Mandate','Satrapy','Census')",
"mc('A child asks what the cycle of death and rebirth is called. What do you tell them?',\"Samsara\",\"Nirvana\",\"Karma\",\"Dharma\")"
],
[
"hinduBuddhism",
"mc('A traveler asks which idea is at the heart of Buddhism. What do you say?','Ending suffering by following the Eightfold Path','Building roads','Honoring emperors as gods only','Avoiding all teaching')",
"mc('A traveler asks which idea is at the heart of Buddhism. What do you say?',\"Ending suffering through the Eightfold Path\",\"Gaining wealth to escape all suffering\",\"Obeying the king as a living god\",\"Keeping each person in a fixed caste forever\")"
],
[
"judaismChristianity",
"mc('A traveler asks what Judaism is known for believing. What do you say?','One God and a covenant with the Jewish people','Many city gods only','No sacred texts','Rule by emperors only')",
"mc('A traveler asks what Judaism is known for believing. What do you say?',\"One God and a covenant with Him\",\"Many gods, one for each city\",\"No sacred writings at all\",\"The Roman emperor as a living god\")"
],
[
"judaismChristianity",
"mc('The traveler hears people speaking about a new group. Christianity developed from teachings about whom?','Jesus of Nazareth','Siddhartha Gautama','Confucius','Alexander')",
"mc('The traveler hears people speaking about a new group. Christianity developed from teachings about whom?',\"Jesus of Nazareth\",\"Moses the lawgiver\",\"Siddhartha Gautama\",\"Zoroaster of Persia\")"
],
[
"judaismChristianity",
"mc('A reporter from the future asks in which region Judaism and Christianity developed. What do you answer?','Southwest Asia','Northern Europe','The Americas','Southeast Asia')",
"mc('A reporter from the future asks in which region Judaism and Christianity developed. What do you answer?',\"Southwest Asia\",\"South Asia\",\"North Africa\",\"Southern Europe\")"
],
[
"judaismChristianity",
"mc('A child asks you about the most important sacred text of Judaism. What is it?','The Torah','The Quran','The Analects','The Vedas only')",
"mc('A child asks you about the most important sacred text of Judaism. What is it?',\"The Torah\",\"The Quran\",\"The Vedas\",\"The Avesta\")"
],
[
"islam",
"mc('A traveler asks where Islam began. What do you tell them?','Arabia','China','Rome','Mesoamerica')",
"mc('A traveler asks where Islam began. What do you tell them?',\"Arabia\",\"Persia\",\"Egypt\",\"India\")"
],
[
"islam",
"mc('The traveler sees people reciting from a book. What is the Quran?','The sacred text of Islam','A Roman law code','A Chinese dynasty','A trade route')",
"mc('The traveler sees people reciting from a book. What is the Quran?',\"The sacred text of Islam\",\"A book of laws written by a caliph\",\"A list of the trade routes to Mecca\",\"A collection of poems about battles\")"
],
[
"islam",
"mc('The traveler asks who Muslims regard as the Prophet who received revelations. What do you answer?','Muhammad','Augustus','Darius','Laozi')",
"mc('The traveler asks who Muslims regard as the Prophet who received revelations. What do you answer?',\"Muhammad\",\"Abu Bakr\",\"Zoroaster\",\"Constantine\")"
],
[
"islam",
"mc('The traveler asks what the Five Pillars of Islam are. What do you say?','Core practices of Muslim life','Five Roman roads','Five Greek cities','Five Chinese dynasties')",
"mc('The traveler asks what the Five Pillars of Islam are. What do you say?',\"Core duties of every Muslim\",\"Five holy cities in Arabia\",\"Five chapters of the Quran\",\"Five rulers who came after Muhammad\")"
],
[
"comparePortable",
"mc('Back home, a student asks why you compare the belief systems you met. What do you say?','To see similarities, differences, and why they spread','To prove they are identical','To ignore their histories','To avoid using evidence')",
"mc('Back home, a student asks why you compare the belief systems you met. What do you say?',\"To see what is alike, what differs, and why\",\"To prove all the faiths are exactly the same\",\"To decide which faith is the only true one\",\"To forget their histories\")"
],
[
"comparePortable",
"mc('The student asks what many portable belief systems have in common. Which similarity do you name?','Teachings about how people should live and treat others','They all began in one city','They all rejected travel','They all lacked communities')",
"mc('The student asks what many portable belief systems have in common. Which similarity do you name?',\"Teachings about how to live and treat others\",\"They all began in the very same city\",\"They all forbid their followers to travel to other lands\",\"They all have no followers or communities\")"
],
[
"comparePortable",
"mc('The student asks what helped beliefs travel as far as you did. What do you answer?','Trade routes, travelers, and sometimes empires','Isolation','Closed borders only','Avoiding networks')",
"mc('The student asks what helped beliefs travel as far as you did. What do you answer?',\"Trade routes, travelers, and empires\",\"Staying at home and avoiding all strangers\",\"Closed borders and high walls\",\"Living far from any roads\")"
],
[
"comparePortable",
"mc('You saw Buddhism look different in each land you passed through. Which claim is best supported?','Traditions changed as they spread to new regions','Traditions never changed','Only one tradition spread','Spread had no causes')",
"mc('You saw Buddhism look different in each land you passed through. Which claim is best supported?',\"Faiths changed as they spread to new lands\",\"Faiths never change, no matter where they move\",\"Only one faith ever spread far\",\"Faiths spread for no reason at all\")"
],
[
"persia",
"mc('A new governor asks how you rule such a huge territory. What do you tell him?','Through provinces called satrapies','Through a single village','Without officials','By avoiding roads')",
"mc('A new governor asks how you rule such a huge territory. What do you tell him?',\"Through provinces called satrapies\",\"Through city-states that rule themselves\",\"Through one army camp in each town\",\"Through the priests of each temple\")"
],
[
"persia",
"mc('A royal messenger asks what the Royal Road is for. What do you say?','Communication and travel across the empire','A farming ritual','A battle formation','A religious holiday')",
"mc('A royal messenger asks what the Royal Road is for. What do you say?',\"Sending messages fast across the empire\",\"Carrying water to the farm fields in dry seasons\",\"Marching armies only to Greece\",\"Holding races during holidays\")"
],
[
"persia",
"mc('A conquered city asks what kind of ruler you will be. What are rulers like you known for?','Allowing conquered peoples to keep many customs','Banning all travel','Ending trade','Destroying every city')",
"mc('A conquered city asks what kind of ruler you will be. What are rulers like you known for?',\"Letting conquered peoples keep their customs\",\"Forcing everyone to speak Persian\",\"Destroying the temples of each city\",\"Moving every person they conquered to Persia\")"
],
[
"persia",
"mc('A reporter from the future asks the name of the empire you founded. What do you answer?','Achaemenid Empire','Han Empire','Gupta Empire','Aksumite Empire')",
"mc('A reporter from the future asks the name of the empire you founded. What do you answer?',\"Achaemenid Empire\",\"Babylonian Empire\",\"Assyrian Empire\",\"Macedonian Empire\")"
],
[
"greece",
"mc('A student asks how most Greek communities are organized. What do you say?','City-states','One national government','Nomadic bands only','Provinces of Rome')",
"mc('A student asks how most Greek communities are organized. What do you say?',\"City-states\",\"One empire under a king\",\"Bands of nomads\",\"Provinces of Persia\")"
],
[
"greece",
"mc('A visitor to Athens asks what your city is famous for developing. What is it?','An early form of democracy among citizens','A single emperor','Bronze oracle bones','The Mandate of Heaven')",
"mc('A visitor to Athens asks what your city is famous for developing. What is it?',\"Democracy, rule by the citizens\",\"Rule by a single emperor\",\"Rule by the priests of the city temple\",\"Rule by the Mandate of Heaven\")"
],
[
"greece",
"mc('Your old student Alexander has marched far to the east. How did he spread Greek culture?','By conquering a large empire','By avoiding other lands','By closing trade','By ending the army')",
"mc('Your old student Alexander has marched far to the east. How did he spread Greek culture?',\"By conquering a large empire\",\"By staying home in Macedonia\",\"By closing every trade route\",\"By sending teachers but no army\")"
],
[
"greece",
"mc('A student asks what Sparta is known for. What do you answer?','A military-focused society','Having no army','A mostly written law code','Being part of Han China')",
"mc('A student asks what Sparta is known for. What do you answer?',\"A military-focused society\",\"A city with no army\",\"A city ruled by philosophers\",\"A city known for its theaters\")"
],
[
"imperialChina",
"mc('A scholar asks what the Mandate of Heaven means. What do you tell him?','The idea that rulers govern with approval that can be lost','A Roman road','A trade tax','A type of writing')",
"mc('A scholar asks what the Mandate of Heaven means. What do you tell him?',\"Heaven’s approval to rule, which can be lost\",\"A law that gives every single ruler power forever\",\"A tax that farmers pay to the emperor\",\"A rule that only priests may govern\")"
],
[
"imperialChina",
"mc('An official asks how the Qin unified China. What do you answer?','By standardizing laws, writing, and money','By giving up power','By ending government','By closing all cities')",
"mc('An official asks how the Qin unified China. What do you answer?',\"By making laws, writing, and coins the same\",\"By letting each state keep all of its own rules\",\"By giving power back to local lords\",\"By teaching kindness instead of laws\")"
],
[
"imperialChina",
"mc('A student asks which philosophy you follow, the one that favors strict laws and punishments. What is it?','Legalism','Daoism','Buddhism','Christianity')",
"mc('A student asks which philosophy you follow, the one that favors strict laws and punishments. What is it?',\"Legalism\",\"Daoism\",\"Confucianism\",\"Buddhism\")"
],
[
"imperialChina",
"mc('A historian asks which dynasty ruled before the Qin and used the Mandate of Heaven. What do you say?','The Zhou','The Gupta','The Ptolemaic','The Achaemenid')",
"mc('A historian asks which dynasty ruled before the Qin and used the Mandate of Heaven. What do you say?',\"The Zhou\",\"The Han\",\"The Tang\",\"The Shang\")"
],
[
"compareEmpires",
"mc('The emperor asks why your report compares the empires you visited. What do you say?','To see how states expanded, governed diverse peoples, and justified power','To prove all were identical','To avoid evidence','To ignore geography')",
"mc('The emperor asks why your report compares the empires you visited. What do you say?',\"To learn how rulers grow, govern, and hold power\",\"To prove that all of the empires were exactly alike\",\"To pick which empire is the strongest\",\"To avoid using any evidence at all\")"
],
[
"compareEmpires",
"mc('The emperor asks how rulers you met convinced people they had the right to rule. Which way did they use?','Claiming divine approval or successful leadership','Giving up all authority','Avoiding rules','Ignoring subjects')",
"mc('The emperor asks how rulers you met convinced people they had the right to rule. Which way did they use?',\"Claiming the gods or Heaven chose them\",\"Letting the people vote them out each year\",\"Giving up all their authority\",\"Ignoring the people they ruled\")"
],
[
"compareEmpires",
"mc('The emperor asks what helped those empires govern so many different peoples. What do you report?','Roads, officials, laws, and local arrangements','Isolation','No communication','Only farming tools')",
"mc('The emperor asks what helped those empires govern so many different peoples. What do you report?',\"Roads, officials, and laws\",\"Staying apart from other peoples\",\"Having no way to send messages\",\"Using only farming tools\")"
],
[
"compareEmpires",
"mc('After all your travels, which claim is best supported by comparing empires?','Empires used different methods to expand and govern','All empires acted the same way','Empires never changed','Power had no sources')",
"mc('After all your travels, which claim is best supported by comparing empires?',\"Empires ruled and grew in different ways\",\"All empires acted in exactly the same way\",\"Empires never changed over time\",\"Power came from nowhere at all\")"
],
[
"rome",
"mc('A new recruit asks who became the first Roman emperor. What do you answer?','Augustus','Cyrus','Qin Shi Huangdi','Asoka')",
"mc('A new recruit asks who became the first Roman emperor. What do you answer?',\"Augustus\",\"Julius Caesar\",\"Constantine\",\"Nero\")"
],
[
"rome",
"mc('The recruit asks what people mean by the Pax Romana. What do you tell him?','A long period of relative peace and stability','A Chinese philosophy','A trade tax','A religious text')",
"mc('The recruit asks what people mean by the Pax Romana. What do you tell him?',\"A long time of peace across the empire\",\"A great war that lasted two hundred years\",\"The Roman law code carved on tablets\",\"The road from Rome to the frontier\")"
],
[
"rome",
"mc('A merchant asks how Rome keeps control of such a huge territory. What do you say?','Roads, legions, and law','Isolation','No army','Only farming')",
"mc('A merchant asks how Rome keeps control of such a huge territory. What do you say?',\"Roads, legions, and law\",\"Letting each city have its own army\",\"Closing the borders to all trade\",\"Asking the Senate to vote each day\")"
],
[
"rome",
"mc('A child asks what Rome was before it had emperors. Rome began as a:','Republic','Dynasty ruled by the Qin','Satrapy','Caliphate')",
"mc('A child asks what Rome was before it had emperors. Rome began as a:',\"Republic\",\"Province of Persia\",\"Greek city-state\",\"Colony of Carthage\")"
],
[
"romeHan",
"mc('A new clerk asks which philosophy the Han emperors use to guide the government. What is it?','Confucianism','Legalism only','Christianity','Zoroastrianism')",
"mc('A new clerk asks which philosophy the Han emperors use to guide the government. What is it?',\"Confucianism\",\"Strict Legalism\",\"Daoism\",\"Buddhism\")"
],
[
"romeHan",
"mc('A merchant tells you about Rome. Which trade network connects your empire and Rome indirectly?','The Silk Road','The Royal Road only','The Mississippi','The Amazon')",
"mc('A merchant tells you about Rome. Which trade network connects your empire and Rome indirectly?',\"The Silk Road\",\"The Royal Road\",\"The Appian Way\",\"The Nile River\")"
],
[
"romeHan",
"mc('The merchant says Rome has problems too. Which problem do both Rome and Han China face?','Governing large territories and defending borders','No need for rulers','No trade','No farmers')",
"mc('The merchant says Rome has problems too. Which problem do both Rome and Han China face?',\"Ruling huge lands and guarding borders\",\"Having no rulers at all\",\"Having no trade with anyone\",\"Having far too few people in the empire to govern\")"
],
[
"romeHan",
"mc('The merchant asks how the Han fill government jobs. What do you tell him?','With educated officials in a bureaucracy','With no officials','Only with foreign armies','Only with priests')",
"mc('The merchant asks how the Han fill government jobs. What do you tell him?',\"With educated officials who pass tests\",\"With lords who inherit their jobs from their fathers\",\"With soldiers from foreign armies\",\"With priests chosen by temples\")"
],
[
"womenAncient",
"mc('A student asks what Confucian ideas say about women’s roles in Han China. Women’s roles were often focused on:','The family and household hierarchy','Voting in assemblies','Leading all armies','Writing Roman laws')",
"mc('A student asks what Confucian ideas say about women’s roles in Han China. Women’s roles were often focused on:',\"The family and household hierarchy\",\"Voting in the assemblies of the cities\",\"Leading the army into battle\",\"Running the imperial exams\")"
],
[
"womenAncient",
"mc('A traveler from Rome describes the lives of rich Roman women. What could elite Roman women often do?','Influence family affairs and manage property, but could not vote','Vote and hold every office','Have no family role','Govern the empire as consuls')",
"mc('A traveler from Rome describes the lives of rich Roman women. What could elite Roman women often do?',\"Own property, but not vote or hold office\",\"Vote in elections and hold any office they wanted\",\"Lead the legions as generals\",\"Serve in the Senate as members\")"
],
[
"womenAncient",
"mc('Your student asks why you would compare women’s lives in Rome and Han China. What do you say?','To see how societies shaped opportunities and limits','To prove roles were identical','To avoid evidence','To ignore social class')",
"mc('Your student asks why you would compare women’s lives in Rome and Han China. What do you say?',\"To see how each society shaped their lives\",\"To prove that women everywhere lived the same way\",\"To show that women had no influence\",\"To ignore differences of rich and poor\")"
],
[
"womenAncient",
"mc('After hearing about Rome, which statement is best supported?','Women\\u2019s experiences differed by society and social class','Every woman had the same experience','Women left no influence','Evidence is unnecessary')",
"mc('After hearing about Rome, which statement is best supported?',\"Women’s lives differed by society and class\",\"Every woman in every land lived exactly the same life\",\"Women had no influence at all\",\"Class made no difference to women\")"
]
];
// [difficulty, prompt, correct, wrong, wrong, wrong]
const Q = {
"portableBelief": [
[
1,
"A traveler asks what your caravans carry besides silk and spices. What do you say?",
"Travelers and their beliefs",
"Only empty sacks",
"Soldiers sent by the emperor to guard us",
"Grain for distant farms"
],
[
1,
"Which belief system have you seen spread along the Silk Road from India to China?",
"Buddhism",
"Shinto",
"Olmec religion",
"Greek city gods"
],
[
1,
"A trader asks where people often first hear about a new faith. What do you say?",
"At markets and trading towns",
"Only in their home villages",
"Only inside the king’s own palace",
"Only from books they buy"
],
[
2,
"A young trader asks why merchants carry their beliefs so far from home. What do you say?",
"They travel long distances for trade",
"They are paid to preach by kings",
"Beliefs are sold as trade goods",
"Their faiths forbid them to stay at home for long"
],
[
2,
"The ruler of an oasis city wants more trade. Why might he welcome traveling monks and teachers?",
"They bring visitors, ideas, and links",
"They pay every one of the city’s taxes",
"They build his army for free",
"They forbid trade with outsiders"
],
[
2,
"Empires and belief systems often helped each other spread. How might an empire help a faith?",
"Its roads and peace made travel safer",
"It banned all travel between lands",
"It kept every belief in one city",
"It made all trade with outsiders illegal"
],
[
3,
"A historian claims Buddhism reached China along the Silk Road. Which evidence best supports this?",
"Buddhist cave temples at oasis towns on the route",
"Buddhist temples built only in the south of India itself",
"Silk found in Roman markets",
"Chinese farm tools from the same years"
],
[
3,
"Someone says beliefs spread only when armies forced them on people. Which evidence would challenge this?",
"Merchants and monks spreading faiths peacefully",
"Records of soldiers forcing a faith on a captured city",
"An emperor ordering everyone to convert",
"Walls built around a temple"
],
[
3,
"What would most likely happen to the spread of beliefs if the Silk Road closed for many years?",
"Beliefs would spread more slowly",
"Beliefs would spread faster than ever",
"Every faith would disappear at once",
"Trade goods would carry the beliefs"
],
[
3,
"A faith arrives in a new land and mixes with local customs. What does this show?",
"Beliefs can change as they spread",
"Beliefs never change when they move",
"Local people reject all new ideas",
"The faith disappears right away"
]
],
"hinduBuddhism": [
[
1,
"A visitor asks what you carved on pillars across your empire. What do you say?",
"Messages about right living",
"Lists of the taxes owed",
"Maps of all the trade roads",
"Stories of my great battles"
],
[
1,
"A child asks what karma means. What do you say?",
"Actions have effects, now and later",
"Every person has the same fate",
"The gods alone decide everything that happens",
"Rebirth only happens to kings"
],
[
1,
"A monk asks in which region both Hinduism and Buddhism began. What do you say?",
"South Asia",
"East Asia",
"Southwest Asia",
"North Africa"
],
[
2,
"A monk asks why you turned to Buddhism after your war in Kalinga. What do you say?",
"You were sorry for the suffering it caused",
"You wanted to conquer even more lands, faster",
"Your army refused to fight any longer",
"Buddhism promised you more gold"
],
[
2,
"A monk asks what nirvana means in Buddhism. What do you say?",
"Freedom from suffering and rebirth",
"A heaven for kings and soldiers",
"The duty of each person in society",
"A great festival held each spring"
],
[
2,
"A Hindu adviser says each person has duties that fit their place and stage of life. Which idea is this?",
"Dharma",
"Nirvana",
"Samsara",
"The Eightfold Path"
],
[
3,
"A historian claims you spread Buddhist ideas across your empire. Which evidence best supports this?",
"Pillars with your Buddhist messages in many regions",
"A single statue of you standing in your capital city",
"Records of the taxes you collected",
"Coins with your name on them"
],
[
3,
"Your pillars praise your own goodness. Why should a historian be careful with them?",
"You wrote them to make yourself look good",
"They were carved after you died",
"Nobody in the empire could read them at the time",
"They say nothing about your rule"
],
[
3,
"A historian compares Hinduism and Buddhism. Which statement is accurate?",
"Both teach about rebirth and escaping it",
"Only Hinduism teaches about rebirth",
"Both were founded by the same teacher",
"Buddhism began in China, Hinduism in India"
],
[
3,
"What would most likely happen to Buddhism if your empire stopped supporting monks and missionaries?",
"It would spread more slowly",
"It would spread faster than ever",
"It would vanish overnight",
"It would become the only faith"
]
],
"judaismChristianity": [
[
1,
"A traveler asks why so many pilgrims come to Jerusalem. What do you say?",
"To worship at the Temple",
"To buy silk from China",
"To sign up for the Roman army",
"To see the pyramids"
],
[
1,
"A traveler asks what the Ten Commandments are. What do you say?",
"Rules from God given through Moses",
"Laws written down by a Roman emperor",
"Sayings collected by Confucius",
"Ten steps on the path to nirvana"
],
[
1,
"A visitor asks which faith from Persia also teaches about a struggle between good and evil. What do you say?",
"Zoroastrianism",
"Buddhism",
"Greek city religion",
"Hinduism"
],
[
2,
"Many followers of Jesus are Jewish, like Jesus himself. What does this show about early Christianity?",
"It grew out of Judaism",
"It began far away in India",
"It had no link to Judaism",
"It started in ancient Greece"
],
[
2,
"Followers of Jesus travel to Greece and Rome to teach. Why can Christianity spread so far?",
"Roman roads and sea routes linked many lands",
"The Roman emperors ordered everyone to join it",
"Only one city was allowed to hear it",
"People were not allowed to travel"
],
[
2,
"Jews living far from Jerusalem still follow the Torah. What makes this possible?",
"The Torah goes wherever they go",
"They return to Jerusalem every week",
"The Romans teach them the Torah",
"They cannot practice outside the city"
],
[
3,
"A historian claims Christianity spread quickly to cities around the Mediterranean. Which evidence best supports this?",
"Letters to Christian groups in many cities",
"One church found in a single village",
"Roman coins that show the face of the emperor",
"A Greek play performed in Athens"
],
[
3,
"A Roman writer calls the Christians troublemakers. Why should a historian be careful with this?",
"He may have been biased against them",
"He was a Christian leader himself",
"Romans never wrote anything about Christians",
"It was written in the year 1900"
],
[
3,
"A historian compares Judaism and Christianity. Which statement is accurate?",
"Both believe in one God and share sacred texts",
"Both teach that there are many gods in every city",
"Christianity is older than Judaism",
"Neither has any sacred writings"
],
[
3,
"What would most likely happen to worship if the Temple in Jerusalem were destroyed?",
"People would find new ways to worship",
"Everyone would stop believing",
"The Temple would move to Rome",
"Nothing at all about the way people worship would change"
]
],
"islam": [
[
1,
"A traveler asks what the Kaaba in Mecca is. What do you say?",
"A holy shrine Muslims pray toward",
"The palace of the caliph",
"A busy market for spices and silk from Asia",
"A tomb for the kings of Arabia"
],
[
1,
"A traveler asks what the hajj is. What do you say?",
"A pilgrimage to Mecca",
"A tax paid to the caliph",
"A month of feasting",
"A prayer said at sunset"
],
[
1,
"A child asks what a mosque is. What do you say?",
"A place where Muslims pray",
"A school for traders",
"A house where the caliph lives",
"A tomb for the prophets"
],
[
2,
"Muhammad and his followers moved from Mecca to Medina in 622. What is this journey called?",
"The Hijra",
"The Hajj",
"The Kaaba",
"The Ramadan"
],
[
2,
"A traveler asks why Islam spread so quickly from Arabia. Which reason do you give?",
"Trade routes and new Muslim rulers",
"Every merchant was forced to join",
"Arabia had no contact with others",
"It was spread only by sailors from China"
],
[
2,
"A visitor sees people fasting from dawn to sunset for a whole month. Which month is it?",
"Ramadan",
"Muharram",
"The Hijra",
"The Hajj"
],
[
3,
"A historian claims Islam spread along trade routes. Which evidence best supports this?",
"Early mosques in port and market towns",
"A mosque built in Mecca itself",
"Arabic poems that were written before Islam",
"A map of the deserts of Arabia"
],
[
3,
"Islam teaches that Muhammad was the last of a line of prophets that includes Abraham, Moses, and Jesus. What does this show?",
"Islam shares roots with Judaism and Christianity",
"Islam has no link at all to any other faith before it",
"Islam began long before Judaism",
"Muslims reject all earlier prophets"
],
[
3,
"A historian reads a story about Muhammad written 200 years after his death. What is a limit of this source?",
"Details may have changed over time",
"It was written too close to his life",
"It cannot tell us anything at all",
"It was written by Roman emperors"
],
[
3,
"What would most likely happen to Mecca’s markets if fewer pilgrims came for the hajj?",
"Its markets would earn less money",
"Its markets would earn far more money than before",
"The Kaaba would move to Medina",
"Arabia would stop all farming"
]
],
"comparePortable": [
[
1,
"A student asks why you walked all the way to India. What do you say?",
"To study Buddhism where it began",
"To sell silk in the big markets of India",
"To lead an army for the emperor",
"To find a new route to Rome"
],
[
1,
"A student asks which faith began recently in Arabia, far from the lands you visited. What do you say?",
"Islam",
"Buddhism",
"Hinduism",
"Confucianism"
],
[
1,
"Which faith you met in India teaches dharma, karma, and worship of many gods?",
"Hinduism",
"Islam",
"Judaism",
"Christianity"
],
[
2,
"You bring hundreds of Buddhist texts back to China and translate them. Why does this matter?",
"More people can read the teachings",
"Fewer people can learn about Buddhism",
"The texts can only be read in India",
"China will stop all trade with India"
],
[
2,
"A student asks what Buddhism, Christianity, and Islam have in common. What do you say?",
"They welcome people from many lands",
"They all began in the very same region",
"They are all tied to one family",
"They all worship the same founder"
],
[
2,
"A student asks why Buddhist temples in China look different from those in India. What do you say?",
"Builders mixed in their own local styles",
"Chinese law banned all temples",
"Indian monks built every temple in China",
"Buddhism does not allow buildings"
],
[
3,
"A historian claims Buddhism changed as it reached China. Which evidence best supports this?",
"Chinese Buddhist art showing local styles",
"Buddhist texts that stayed only in India forever",
"Silk sold in the markets of India",
"Temples in India built before the Buddha"
],
[
3,
"Your travel diary describes India for the Chinese emperor. What is a limit of it as a source?",
"It shows India through one traveler’s eyes",
"It was written centuries after the trip ended",
"It describes only China, not India",
"Its writer never left China at all"
],
[
3,
"Someone says a faith can only grow if a ruler forces it on people. Which evidence would challenge this?",
"Faiths spread by monks, merchants, and teachers",
"A ruler ordering a whole conquered city to convert",
"An army bringing a faith into a land",
"A law that bans all other beliefs"
],
[
3,
"What would most likely happen to a faith that stayed only in its home region?",
"It would reach far fewer people",
"It would reach far more people",
"It would spread along trade routes",
"It would change faster than others"
]
],
"persia": [
[
1,
"A visitor asks how far your empire stretches. What do you say?",
"From Egypt to India",
"From Rome to China",
"From Greece to Spain",
"Only across Persia"
],
[
1,
"A new official asks what a satrap is. What do you say?",
"A governor of a province",
"A soldier in the royal guard",
"A priest of the sun god",
"A merchant on the Royal Road"
],
[
1,
"After you take Babylon, what do you do for the Jewish people who were held captive there?",
"Let them return home to Jerusalem",
"Keep them all as slaves forever",
"Send every one of them to fight in Greece",
"Force them to worship your gods"
],
[
2,
"A general asks why you let conquered peoples keep their own religions. What do you say?",
"It makes them less likely to rebel",
"Persia has no religion of its own",
"Our army is too small to fight",
"My own priests ordered me to do it"
],
[
2,
"A messenger rides the Royal Road, changing horses at each station. What is the main advantage?",
"News crosses the empire in days",
"Messengers never need to rest at all",
"Armies no longer need horses",
"Trade on the road is stopped"
],
[
2,
"Your empire collects taxes from every province. What do the taxes pay for?",
"Armies, roads, and officials",
"Gifts for the Greek cities",
"Nothing; they are simply stored",
"Only the king’s private feasts"
],
[
3,
"A historian claims the Persians respected local customs. Which evidence best supports this?",
"A record of Cyrus restoring local temples",
"Records of Persian soldiers marching to war",
"A map of the Royal Road",
"Greek stories calling Persians cruel"
],
[
3,
"Greek writers called the Persian kings proud and cruel. Why should a historian be careful with this?",
"The Greeks were Persia’s enemies",
"The Greeks never met any Persians",
"It was written by Persian kings",
"Greek writers always praised Persia"
],
[
3,
"What would most likely happen if the satraps stopped obeying the king?",
"The empire could break into parts",
"The empire would grow much larger",
"Trade on the roads would double",
"The king would gain more power"
],
[
3,
"A historian compares Persian rule with Assyrian rule, which was known for harsh punishments. Which statement is accurate?",
"Persia ruled more through tolerance than fear",
"Persia ruled only through fear and terror",
"Both empires let every city completely rule itself",
"Assyria was the more tolerant of the two"
]
],
"greece": [
[
1,
"A student asks who could vote in Athens. What do you say?",
"Free adult men who were citizens",
"Every person living in Athens",
"Only the richest family in the city",
"Women, men, and enslaved people"
],
[
1,
"A student asks which philosopher taught your own teacher, Plato. What do you say?",
"Socrates",
"Homer",
"Pericles",
"Alexander"
],
[
1,
"A visitor asks where Greek city-states sent ships to start new colonies. What do you say?",
"Around the Mediterranean Sea",
"Up the rivers of northern Europe",
"Along the coast of India",
"Only to the islands near Athens"
],
[
2,
"After Alexander died, his generals split his empire. Which land did Ptolemy take?",
"Egypt",
"Persia",
"Greece",
"India"
],
[
2,
"A student asks why the Greek city-states joined together in the wars against Persia. What do you say?",
"To face a common enemy",
"They were ruled by one king",
"Persia ordered them to unite",
"They had no armies of their own"
],
[
2,
"A student asks why Greek ideas have spread as far as Egypt and India. What do you say?",
"Alexander’s conquests carried them",
"Greek merchants never left home",
"Egypt and India sent teachers to Greece",
"Persian kings banned Greek ideas"
],
[
3,
"A historian claims Greek culture spread after Alexander’s conquests. Which evidence best supports this?",
"Greek-style cities and coins found in Egypt and Asia",
"Greek temples built in Athens",
"Persian palaces built long before Alexander was even born",
"Spartan soldiers training at home"
],
[
3,
"You write that some people are slaves by nature. Why must historians read your views with care?",
"Writers reflect the beliefs of their time",
"You never wrote anything down at all",
"Everyone in Athens agreed with every word you wrote",
"Slavery did not exist in Athens"
],
[
3,
"A historian compares Athens and Sparta. Which statement is accurate?",
"Athens valued debate; Sparta valued military training",
"Sparta valued debate; Athens valued military training",
"Both cities were ruled by the same king",
"Neither city had any citizens at all"
],
[
3,
"What would most likely happen to democracy in Athens if few citizens came to the assembly?",
"A small group could make all decisions",
"Every citizen would gain more power",
"The city would get an emperor at once",
"Sparta would hold the votes for Athens"
]
],
"imperialChina": [
[
1,
"A scholar asks what title your ruler took after uniting China. What do you say?",
"First Emperor",
"Son of the Buddha",
"King of the Zhou",
"Great Satrap"
],
[
1,
"A builder asks what the emperor ordered built to protect the north. What do you say?",
"Long defensive walls",
"A royal road to Persia",
"Huge pyramids for tombs",
"A canal to India"
],
[
1,
"A student asks what Confucius taught about ruling well. What do you say?",
"Rulers should set a good example",
"Rulers should use harsh punishments",
"Rulers should avoid all duties",
"Rulers should obey the farmers"
],
[
2,
"An official asks why all of China must now use the same written characters. What do you say?",
"So orders can be read everywhere",
"So no one can ever learn to read",
"So merchants can avoid taxes",
"So each state can keep its own"
],
[
2,
"A Daoist hermit says rulers should do less and follow nature. How does your Legalism differ?",
"It wants strict laws and harsh punishments",
"It agrees completely that rulers should do less",
"It says nature should rule the land",
"It says there should be no rulers"
],
[
2,
"Under the Zhou, lords ruled their own lands for the king. What problem did this cause?",
"Lords grew strong and fought each other",
"The king had far too much power over them",
"There were no lords at all",
"Farmers ruled over the lords"
],
[
3,
"A historian claims the Qin ruled harshly. Which evidence best supports this?",
"Records of burned books and forced labor",
"Coins that looked the same all across China",
"Roads connecting distant regions",
"Walls built along the northern border"
],
[
3,
"Later Han historians wrote that the Qin were cruel. Why should a historian be careful with this?",
"The Han took over and wanted to look better",
"The Han never wrote about the Qin",
"Han historians lived long before the Qin did",
"The Qin wrote the Han histories"
],
[
3,
"What would most likely happen if the Qin made laws harsher while the people suffered from hunger?",
"People would rebel against the emperor",
"People would thank the emperor",
"The empire would grow more and more peaceful",
"Farmers would grow more rice"
],
[
3,
"A historian compares Zhou and Qin rule. Which statement is accurate?",
"The Qin ruled more strictly from the center",
"The Zhou ruled far more strictly than the Qin",
"Both let lords rule with no king",
"The Qin gave lords more power"
]
],
"compareEmpires": [
[
1,
"The emperor asks what animals you saw in Ferghana that he wants for his army. What do you say?",
"Strong, fast horses",
"War elephants",
"Camels for the desert",
"Trained hunting dogs"
],
[
1,
"The emperor asks which road your journey helped open between China and the West. What do you say?",
"The Silk Road",
"The Royal Road",
"The Appian Way",
"The Grand Canal"
],
[
1,
"A young official asks what an empire is. What do you say?",
"One ruler governing many lands and peoples",
"A single city that governs only itself and no others",
"A village ruled by its elders",
"A group of traders on a road"
],
[
2,
"You saw empires let local leaders keep some power. Why might rulers do this?",
"It is hard to rule faraway lands directly",
"Local leaders never paid any taxes at all",
"Rulers did not want any power",
"Faraway lands had no people"
],
[
2,
"Why do large empires build roads and post stations?",
"To move armies, messages, and goods",
"To keep all of the people from traveling",
"To mark where farming ends",
"To stop trade with outsiders"
],
[
2,
"You were held captive by the Xiongnu nomads for years. Why does the Han care so much about them?",
"They raid Han lands from the north",
"They are Han farmers living in the south",
"They rule the Roman Empire",
"They are monks spreading Buddhism"
],
[
3,
"A historian claims empires used religion to justify power. Which evidence best supports this?",
"Rulers calling themselves chosen by gods or Heaven",
"Roads built from one end of the empire to the other",
"Taxes collected from farmers",
"Armies guarding the border"
],
[
3,
"Your reports describe foreign lands for the Han emperor. What is a limit of them as a source?",
"They show other lands from a Han point of view",
"They were written by the rulers of Rome",
"They describe only the Han capital",
"They were written a thousand years after the trip"
],
[
3,
"Someone says every empire ruled by force alone. Which evidence would challenge this?",
"Empires that won loyalty with tolerance and trade",
"Armies that conquered many new lands in a few years",
"Walls built to keep out raiders",
"Rulers who punished rebels harshly"
],
[
3,
"What would most likely happen to an empire whose rulers lost the support of their officials?",
"It would become harder to govern",
"It would become much easier to rule",
"It would conquer more lands at once",
"Its taxes would double right away"
]
],
"rome": [
[
1,
"A new recruit asks what a legion is. What do you say?",
"A large unit of Roman soldiers",
"A Roman law about taxes",
"A road built by the army",
"A temple built for all the Roman gods"
],
[
1,
"A recruit asks which language is spoken across the western empire. What do you say?",
"Latin",
"Greek",
"Persian",
"Arabic"
],
[
1,
"A recruit asks why the army builds roads everywhere. What do you say?",
"So soldiers can march quickly",
"So farmers can avoid paying taxes",
"So enemies can reach Rome faster",
"So the roads can be sold to traders"
],
[
2,
"Conquered people could become Roman citizens. Why would this help the empire?",
"It made them more loyal to Rome",
"It meant they paid no taxes at all",
"It let them leave the empire",
"It ended the need for an army"
],
[
2,
"A merchant asks how Roman law helps trade across the empire. What do you say?",
"The same laws apply in every province",
"Each town has completely different rules",
"Only soldiers may buy and sell goods",
"Trade is banned outside the city of Rome"
],
[
2,
"A recruit asks why Rome keeps so many soldiers on the frontier. What do you say?",
"To defend the borders from raids",
"To attack the city of Rome itself",
"To collect silk from Han China",
"To keep farmers from leaving Italy"
],
[
3,
"A historian claims Roman roads held the empire together. Which evidence best supports this?",
"Roads linking Rome to its farthest provinces",
"A handful of roads found only close to Rome itself",
"Roman coins found in a single city",
"Paintings of emperors in palaces"
],
[
3,
"A Roman historian praises the emperor who pays him. Why should a historian be careful with this source?",
"He may flatter the emperor to keep his pay",
"He was known as the emperor’s greatest enemy",
"He wrote nothing about the emperor",
"He lived in Han China"
],
[
3,
"What would most likely happen if the army stopped guarding the frontier?",
"Raiders could cross into the empire",
"Trade with Han China would end at once",
"The empire would grow much larger",
"Rome would become a republic again"
],
[
3,
"A historian compares the Roman Republic with the Roman Empire. Which statement is accurate?",
"The Republic elected leaders; the Empire had one ruler",
"The Empire elected leaders; the Republic had one ruler",
"Both were ruled by the same family of kings",
"Neither had any laws or any army"
]
],
"romeHan": [
[
1,
"A clerk asks what you studied to pass your exams. What do you say?",
"The Confucian classics",
"Legalist books of punishment",
"Roman law codes",
"Buddhist texts from India"
],
[
1,
"A merchant asks which product China is most famous for sending west. What do you say?",
"Silk",
"Glass",
"Olive oil",
"Wool"
],
[
1,
"A clerk asks which city is the capital of the Han. What do you say?",
"Luoyang",
"Rome",
"Babylon",
"Athens"
],
[
2,
"Rome uses legions and the Han use large armies on their borders. What does this show?",
"Both had to defend long frontiers",
"Neither empire had any enemies",
"Only Rome had to guard borders",
"Both empires were peaceful islands"
],
[
2,
"A clerk asks why the Han prefer officials chosen by tests. What do you say?",
"Tests pick people for skill, not family",
"Tests let the rich buy every job",
"Tests were the only way to read",
"Tests kept every scholar far away from power"
],
[
2,
"Merchants tell you about Rome, but no Han official has been there. Why not?",
"Parthia sits between and controls trade",
"Rome forbids all trade with China",
"China and Rome are right next to each other",
"The Silk Road ends in India"
],
[
3,
"A historian claims Rome and Han China traded indirectly. Which evidence best supports this?",
"Chinese silk worn by rich Romans",
"Han coins found only in Luoyang",
"Roman roads built in Britain",
"Han officials who lived in the city of Rome"
],
[
3,
"Roman writers complain that buying silk wastes money. Why might they say this?",
"Rome sent so much gold east to buy it",
"Silk was cheap and easy to find",
"Romans could not wear any cloth",
"The Han emperors gave all their silk away for free"
],
[
3,
"A historian compares how Rome and the Han chose officials. Which statement is accurate?",
"The Han used tests; Rome relied on rank and wealth",
"Rome used tests; the Han relied on rank and wealth",
"Both chose officials by drawing names",
"Neither empire had any officials"
],
[
3,
"What would most likely happen to the Han if officials were chosen only for their family?",
"Government work would be done less well",
"Officials would become far more skilled",
"The exams would become much harder",
"Rome would invade the Han at once"
]
],
"womenAncient": [
[
1,
"A student asks what famous history you finished for your brother. What do you say?",
"The history of the Han dynasty",
"A history of the Roman Empire in the west",
"A book of Buddhist teachings",
"The laws of the Qin dynasty"
],
[
1,
"A student asks what your book Lessons for Women teaches. What do you say?",
"How women should behave in the family",
"How women can lead the emperor’s armies in war",
"How women can pass the exams",
"How women can rule the empire"
],
[
1,
"A visitor asks if girls in Han China usually go to school. What is true?",
"Few girls got an education",
"All girls went to state schools",
"Girls took the official exams",
"Girls studied in Rome"
],
[
2,
"You are an educated woman who advises the empress. What does this show?",
"Some elite women gained influence",
"All women held government jobs",
"Women could never read or write",
"Only men could ever advise rulers"
],
[
2,
"A Roman visitor says wealthy Roman women can own businesses. What does this show?",
"Some Roman women had economic power",
"No Roman woman could ever own any property",
"Roman women ruled the Senate",
"Every Roman woman was rich"
],
[
2,
"A student asks how a poor farm woman’s life differs from an empress’s. What do you say?",
"She works the fields and has little power",
"She has even more power than the empress does",
"Their lives are exactly the same",
"She takes the official exams"
],
[
3,
"A historian claims elite Han women could gain influence. Which evidence best supports this?",
"Records of empresses guiding young emperors",
"Farm tools found in a village house",
"A law banning women from the exams",
"A painting of a soldier riding a horse into battle"
],
[
3,
"Your Lessons for Women was written by an elite woman. What is a limit of it as a source?",
"It may not show the lives of poor women",
"It was written by a Roman man",
"It says nothing about women at all",
"It was written a thousand years after the Han"
],
[
3,
"A historian compares women in Rome and Han China. Which statement is accurate?",
"In both, men held power but some women had influence",
"In both empires, women held all of the government offices",
"Roman women voted, but Han women could not",
"Han women ruled, but Roman women could not"
],
[
3,
"Under Confucian family rules, what would most likely happen to a Han widow with no sons?",
"She would depend on her husband’s family",
"She would become the head of the whole government",
"She would join the army as a general",
"She would gain all of the family’s land"
]
]
};
const BUILT_IN_LEVELS = {"portableBelief": [1, 1, 2, 1], "hinduBuddhism": [1, 1, 1, 2], "judaismChristianity": [1, 1, 1, 1], "islam": [1, 1, 1, 1], "comparePortable": [2, 2, 1, 3], "persia": [1, 1, 2, 1], "greece": [1, 1, 2, 1], "imperialChina": [1, 2, 1, 1], "compareEmpires": [2, 1, 2, 3], "rome": [1, 1, 1, 1], "romeHan": [1, 1, 2, 2], "womenAncient": [1, 2, 2, 3]};

let block = src.slice(start, at);
const problems = [];
for (const [lesson, oldLine, newLine] of FIXES) {
  const count = block.split(oldLine).length - 1;
  if (count !== 1) { problems.push(`${lesson}: original question found ${count} times: ${oldLine.slice(0, 70)}`); continue; }
  block = block.replace(oldLine, newLine);
}
if (problems.length) { console.log('NOT APPLIED. Nothing changed:\n  ' + problems.join('\n  ')); process.exit(1); }

const lines = Object.entries(Q).map(([skillId, list]) => `  ${skillId}:[\n` + list.map(([d, ...text]) => `    histLevel(${d},${text.map(s => JSON.stringify(s)).join(',')})`).join(',\n') + '\n  ]');
const BLOCK = '// Phase 1 History Unit 4 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.\n'
  + 'const HISTORY4_EXTRA_QUESTIONS = {\n' + lines.join(',\n') + '\n};\n'
  + `const HISTORY4_BUILT_IN_LEVELS = ${JSON.stringify(BUILT_IN_LEVELS)};\n`
  + 'Object.entries(HISTORY4_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY4_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));\n'
  + 'Object.entries(HISTORY4_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY4_QUESTIONS[skillId] = [...(HISTORY4_QUESTIONS[skillId] || []), ...questions]; });\n';
src = src.slice(0, start) + block + BLOCK + src.slice(at);
fs.writeFileSync(FILE, src);
console.log('Done: 48 History Unit 4 originals fixed and tagged, 120 questions added. Run `npm run build`, then try a History Unit 4 practice.');
