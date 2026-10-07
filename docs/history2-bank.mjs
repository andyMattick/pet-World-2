// History Unit 2 question bank. Run from the repo root:  node docs/history2-bank.mjs
// Adds 10 questions to each of the 5 History Unit 2 lessons (4 -> 14), tagged by difficulty,
// and tags the original 20. Inserted just before `const HISTORY_UNIT4 = [`. Nothing existing is changed.
// Each question lists the correct answer first; the game shuffles options when it shows them.
import fs from 'node:fs';
const FILE = 'src/game/game.js';
let src = fs.readFileSync(FILE, 'utf8');
if (src.includes('const HISTORY2_EXTRA_QUESTIONS')) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const ANCHOR = 'const HISTORY_UNIT4 = [';
const before = src.indexOf('const HISTORY2_QUESTIONS = {'), at = src.indexOf(ANCHOR);
if (src.split(ANCHOR).length !== 2 || before < 0 || at < before) { console.log('NOT APPLIED: could not find the History Unit 2 question bank. game.js was not changed.'); process.exit(1); }

const Q = {
  earliestHumans: [
    [1, 'The reporter asks: “Historians call your time the Paleolithic. What does that word mean?”', 'Old Stone Age', 'New Stone Age', 'Age of Bronze', 'Age of Writing'],
    [1, 'The reporter asks: “What does your band mostly eat?”', 'Wild plants and hunted animals', 'Crops grown in our own fields', 'Food bought at markets', 'Bread from stored grain'],
    [2, 'The reporter asks: “Humans have existed about 250,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”', 'More than 90 percent', 'About half', 'About 10 percent', 'Less than 1 percent'],
    [2, 'The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”', 'Most tools were still made of stone', 'People lived only in stone caves', 'Stone was used as money', 'Writing was carved in stone'],
    [2, 'The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?', 'Some parts of life stayed the same', 'Nothing has changed since your time', 'Your band lived exactly like us', 'Only changes matter in history'],
    [2, 'The reporter asks: “Your band left no writing. How will historians in my time learn about you?”', 'From bones, tools, and old campsites', 'From the diaries your band kept each day', 'From newspapers of your time', 'From maps of your cities'],
    [3, 'The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?', 'Campsites used at different times of year', 'A single cave painting of a horse herd', 'A modern film about cave people', 'A stone house used for centuries'],
    [3, 'The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?', 'Early farm sites of very different ages', 'Old grinding stones from one village', 'Bones of wild animals at a campsite', 'Stories saying farming was hard'],
    [3, 'The reporter asks you to compare your time with hers. Which statement is accurate?', 'Then most people found food; now most buy it', 'Then and now, most people grow their food', 'Then most people farmed; now most people hunt', 'Then, finding food took no knowledge'],
    [3, 'The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?', 'Farming is a very recent part of history', 'Farming began at the start of history', 'Foraging lasted only a short time', 'Cities came before foraging']
  ],
  migrationArt: [
    [1, 'A visitor from the future asks: “What do most of the oldest cave paintings show?”', 'Animals such as horses and bison', 'Maps of farms and fields', 'Kings sitting in their great palaces', 'Lists of goods to trade'],
    [1, 'A visitor asks how your people first reached the Americas from Asia. What do you say?', 'Over a land bridge or along the coast', 'By sailing west across the Atlantic Ocean', 'Through a tunnel under the sea', 'They had always lived there'],
    [2, 'The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”', 'Low sea levels uncovered land', 'The whole ocean froze solid', 'The rivers of Asia dried up', 'People built a long bridge'],
    [2, 'Your group crossed open sea to reach Australia. What does this tell the visitor about your people?', 'They could build boats and plan trips', 'They walked the whole way on land', 'They had written maps to find the way', 'They had already started farming'],
    [2, 'A visitor finds a small carved figure in your camp. Why does it matter to historians?', 'It shows people made symbolic objects', 'It tells the carver’s exact name', 'It shows writing had been invented', 'It proves everyone shared one religion'],
    [2, 'Two experts disagree about why your people painted caves. One studied the caves for 30 years; the other read one article. Whose view should carry more weight?', 'The one who studied the evidence', 'The one who wrote most recently', 'The one with the most exciting idea', 'Both equally, since it is all a guess'],
    [3, 'A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?', 'Remains of different ages along different routes', 'One skull found in a single cave', 'A painting of people walking', 'A legend about one great journey out of Africa'],
    [3, 'Handprints in your cave are dated to about 40,000 years ago. What can historians reasonably conclude?', 'People were making art by that time', 'The artists also built cities', 'People had stopped migrating by then', 'Art began exactly 40,000 years ago'],
    [3, 'A future historian says your paintings show what you ate every day. What is the problem with this claim?', 'Paintings may show what mattered, not meals', 'Paintings can never be dated', 'The painters never went hunting', 'Paintings are never a useful kind of evidence'],
    [3, 'Why do historians use DNA, along with tools and bones, to study your people’s migration?', 'It can show how groups are related', 'It shows what people believed', 'It gives the exact date of each trip', 'It replaces all other evidence']
  ],
  foragingSocieties: [
    [1, 'A traveler asks why your band moves camp during the year. What do you say?', 'We follow plants and animals by season', 'Farmers nearby keep forcing us to leave', 'We like to visit new cities', 'Our fields need rest each year'],
    [1, 'The traveler asks how many people live in your band. What is a typical answer?', 'A few dozen', 'A few thousand', 'Tens of thousands', 'Just one person'],
    [2, 'The traveler notices your band owns few belongings. Why?', 'Moving often makes it hard to carry much', 'Owning things is against the law', 'No tools had been invented yet', 'Traders took away everything you made'],
    [2, 'A hunter brings back a large animal. What usually happens to the meat in your band?', 'It is shared across the band', 'It is sold at a market', 'The leader keeps all of it', 'It is stored for years in a granary'],
    [2, 'Obsidian from a volcano 200 miles away is found at your camp. What does this suggest?', 'Your band traded with or met other groups', 'Your band lived beside the volcano', 'Obsidian forms naturally everywhere', 'Your band had built long roads to the volcano'],
    [2, 'Your band meets another band each summer to share news and find marriage partners. Which frame fits this best?', 'Networks', 'Collective memory', 'Production and distribution', 'Scale'],
    [2, 'A historian asks, “How did foragers get through a bad winter?” What is this question mainly asking about?', 'How foragers survived hard times', 'When winter starts each year', 'Which animals live in winter', 'Why farmers stored grain for winter'],
    [3, 'Many foraging bands had no rich or poor members. Which evidence would best support this claim?', 'Burials with similar goods for everyone', 'One grave filled with gold and jewels', 'A large palace in the center of camp', 'A painting of a king on a throne'],
    [3, 'Studies of modern foragers find they often spend fewer hours getting food than many farmers spend working. What can you reasonably infer?', 'Foraging was not always nonstop work', 'Foragers never worked at all', 'Farmers had more free time than foragers', 'Modern foragers live exactly like ancient ones'],
    [3, 'Why must historians be careful using modern foraging groups as evidence about your band?', 'Modern groups have changed over time', 'Modern foragers refuse to talk to anyone', 'Ancient foragers left far more writing', 'Modern foraging groups no longer exist']
  ],
  agriculturalRevolution: [
    [1, 'A forager asks what “domesticate” means. What do you say?', 'To tame and breed plants or animals', 'To hunt wild animals a new way', 'To move to a new home each season', 'To trade food with other villages'],
    [1, 'Your village grew more food than it needed this year. What is the extra food called?', 'A surplus', 'A tribute', 'A shortage', 'A harvest tax'],
    [2, 'Your village grows wheat and barley in Southwest Asia. What is this farming region often called?', 'The Fertile Crescent', 'The Silk Road', 'The Sahara Desert', 'The Great Plains'],
    [2, 'A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?', 'Corn (maize)', 'Wheat', 'Rice', 'Sugar cane'],
    [2, 'Farming began in several places that had no contact with each other. What does this show?', 'Many peoples began farming on their own', 'One group taught farming to the world', 'Farming spread only through trade', 'Farming began in only one place'],
    [2, 'Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?', 'Specialization', 'Migration', 'Foraging', 'Domestication'],
    [2, 'Which question about your village fits the production and distribution frame?', 'Who grows the grain, and who eats it?', 'What stories does the village tell?', 'Which gods does the village honor?', 'How does the village choose rules?'],
    [3, 'At a dig site, older layers hold small wild wheat seeds and newer layers hold larger seeds. What does this best show?', 'People were slowly domesticating wheat', 'Wild wheat vanished all at once', 'Farmers abandoned the site for a new one', 'Seeds grow larger as they age'],
    [3, 'A historian claims farming spread from Southwest Asia into Europe. Which evidence best supports this?', 'Farm sites get younger moving into Europe', 'Europe has the oldest farm sites', 'Europeans told many old stories about farming', 'Wheat grows well in Europe today'],
    [3, 'At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?', 'It could support large, settled towns', 'Farmers still moved every season', 'Every farming town had a palace', 'Farming was first invented in this one town']
  ],
  biggestMistake: [
    [1, 'A visitor asks how farming changed the number of people in the world. What do you say?', 'Populations grew much larger', 'Populations shrank to almost nothing', 'Populations stayed exactly the same', 'Only foragers had children'],
    [1, 'Living close to your goats and cattle brings a new danger. What is it?', 'Diseases spread from animals to people', 'Animals eat all of the crops', 'Animals make the river flood', 'People forget how to make their stone tools'],
    [2, 'Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?', 'Less varied diets based on a few crops', 'Farmers spent too much time traveling', 'Foragers ate only grain', 'Farmers ate too much meat'],
    [2, 'Which change from farming helped make some people in your village richer than others?', 'Land and stored food could be owned', 'Everyone shared all the food equally', 'People stopped making tools', 'Bands moved every season'],
    [2, 'You are drawing a cause-and-effect map for your village. Which chain fits what farming did?', 'More food → more people → larger villages', 'More food → fewer people → smaller villages', 'Less work → fewer crops → more travel', 'More travel → more crops → fewer villages'],
    [2, 'One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?', 'Farming did more harm than good for many', 'Farming never really happened', 'Farming was invented by accident', 'Farming helped every single person equally'],
    [3, 'Which evidence best supports the claim that farming was a mistake?', 'Farmers’ bones show more disease and wear', 'Farming villages had more people', 'Farming made writing possible much later', 'Farmers built permanent homes'],
    [3, 'Which evidence best argues against the claim that farming was a mistake?', 'Surplus later supported cities and writing', 'Early farmers worked longer hours', 'Crop failures led to famine', 'Diseases spread to people from farm animals'],
    [3, 'Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?', 'The answer depends on whose view you take', 'The question has one simple answer', 'Population is the only thing that matters', 'Individual lives tell us nothing'],
    [3, 'Once your village depends on farming, why is it hard to go back to foraging?', 'Wild food can’t feed so many people', 'Foraging has been banned by law', 'All wild plants have disappeared', 'People are too busy writing books']
  ]
};
// Difficulty tags for the original 4 questions in each lesson, in their order.
const BUILT_IN_LEVELS = {earliestHumans:[1,1,1,2], migrationArt:[1,2,2,2], foragingSocieties:[1,1,2,2], agriculturalRevolution:[1,2,2,2], biggestMistake:[1,2,2,2]};

const lines = Object.entries(Q).map(([skillId, list]) => `  ${skillId}:[\n` + list.map(([d, prompt, ...options]) => `    histLevel(${d},${[prompt, ...options].map(s => JSON.stringify(s)).join(',')})`).join(',\n') + '\n  ]');
const BLOCK = '// Phase 1 History Unit 2 bank: extra questions, tagged by difficulty (1-3). They join the built-in pools above.\n'
  + 'const HISTORY2_EXTRA_QUESTIONS = {\n' + lines.join(',\n') + '\n};\n'
  + `const HISTORY2_BUILT_IN_LEVELS = ${JSON.stringify(BUILT_IN_LEVELS)};\n`
  + 'Object.entries(HISTORY2_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => { const question = HISTORY2_QUESTIONS[skillId]?.[index]; if (question && question.difficulty == null) question.difficulty = level; }));\n'
  + 'Object.entries(HISTORY2_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { HISTORY2_QUESTIONS[skillId] = [...(HISTORY2_QUESTIONS[skillId] || []), ...questions]; });\n';
src = src.slice(0, at) + BLOCK + src.slice(at);
fs.writeFileSync(FILE, src);
console.log('Done: 50 History Unit 2 questions added. Run `npm run build`, then try a History Unit 2 practice.');
