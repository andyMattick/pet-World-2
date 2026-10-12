# History Units 1–4: answer-choice cleanup

Run from the repo root:

```
node docs/history-cleanup.mjs && node scripts/question-counts.mjs && npm run verify && npm run build
```

## What changed

- 124 of the 420 History questions get new wrong answers. Prompts, right answers and difficulty tags stay the same, so teacher hides, edits and miss rates stay attached.
- Right answer is the longest choice: 51 questions before, 0 after.
- Two or more wrong answers with give-away words (only, always, never, all, every…) while the right answer has none: 0 after.
- A blind reviewer (no key) answered all 420 and matched the key on 419. The one miss was the Gulf trade question below, which had no fully correct answer. It has been fixed.
- 7 accuracy fixes change a prompt or a right answer. Those 7 questions get new ids, so any hide, edit or miss rate on them starts over. Counts stay at 62 lessons and 868 questions, and `npm run verify` passes.

## Accuracy fixes (7 new ids)

- **Unit 2 · earliestHumans**
  - Prompt was: The reporter asks: “For most of the 250,000 years of your species’ history, how did people mainly live?”
  - Prompt now: The reporter asks: “For most of the 300,000 years of your species’ history, how did people mainly live?”
- **Unit 2 · earliestHumans**
  - Prompt was: The reporter asks: “Humans have existed about 250,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”
  - Prompt now: The reporter asks: “Humans have existed about 300,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”
- **Unit 3 · tradeNetworks**
  - Right answer was: Afro-Eurasia and the Americas
  - Right answer now: **Mesopotamia and the Indus Valley, by way of the Gulf**
- **Unit 3 · earlyAgrarian**
  - Prompt was: Shang China built with bronze tools and the Indus Valley with baked brick. What explains differences like these?
  - Prompt now: Shang China built with rammed earth and timber, and the Indus Valley with baked brick. What explains differences like these?
- **Unit 3 · earlyAgrarian**
  - Right answer was: Canals and flood records in each valley
  - Right answer now: **Canals and flood-control works along each river**
- **Unit 4 · persia**
  - Prompt was: A visitor asks how far your empire stretches. What do you say?
  - Prompt now: A visitor asks how far the Persian Empire reached at its height. What do you say?
- **Unit 4 · rome**
  - Prompt was: A child asks what Rome was before it had emperors. Rome began as a:
  - Prompt now: A child asks what Rome was before it had emperors. Just before the emperors, Rome was a:

## For you to decide (not changed)

- **Unit 4 · romeHan (3 questions):** these say the Han chose officials “by tests.” Han officials were mostly recommended for character and learning, and some were examined on the Confucian classics. The full civil-service exam system came later, with the Sui and Tang. Many AP World resources use the simpler “Han exams” framing, so I left these alone. Changing them would give them new ids.
- **Unit 4 · persia:** the narrator is Cyrus (“the empire you founded,” freeing the captives in Babylon). The Royal Road and satraps were mostly Darius’s work. I only fixed the “Egypt to India” question, because Cyrus never ruled Egypt.

## Every changed question (right answer in bold)


### Unit 1

- Two towns tell you different stories about the same battle. You are writing your history. What is a useful first step?  
  **Compare each account’s perspective and supporting evidence.** · Choose the older story, since it is closer to the battle. · Combine both stories into one by keeping the exciting parts. · Use the story from the larger town, since more people saw it.  
  <sub>was: Choose the older story automatically. · Assume both accounts describe every detail. · Ignore the community that left fewer written records.</sub>
- A sailor hands you a letter written by someone who saw the battle. What can this letter show you?  
  **One person’s perspective and some evidence about the event.** · How the soldiers on both sides felt about the battle. · The exact number of people who fought, with no mistakes. · Which side was right to start the battle in the first place.  
  <sub>was: Every person’s experience of the event. · That the writer’s memory is perfectly accurate. · That no other sources are needed.</sub>
- A visitor asks why your history of Greece starts in a different place than another writer’s. How do you explain it?  
  **A different starting point can highlight different people, changes, or questions.** · Historians are required to begin with the oldest date that anyone has recorded. · The other writer probably found sources that prove your starting point is wrong. · Where a history starts changes what actually happened in the past, not just the story.  
  <sub>was: Only one starting point is allowed in history. · The earliest date is always the most important. · Starting points change what actually happened.</sub>
- You are deciding what to write in your history. Which statement is the best-supported claim?  
  **Several sources describe the change, though they emphasize different experiences.** · The change happened because one source written by a king says it was a good idea. · People remember the change the same way, so the sources must agree on the details. · The longest account of the change is the most trustworthy, so it should be followed.  
  <sub>was: Everyone remembers the event the same way. · This source proves every detail about the past. · One account is true because it is the longest.</sub>
- A merchant says his city’s history begins when its first market opened. A farmer says it begins with the first harvest. What explains the difference?  
  **Each chose a starting point that matters to them.** · One of them must have the facts about the past wrong. · The city began on one official date set by its rulers. · Markets are usually older than farms in most cities.  
  <sub>was: One of them must be lying about the past. · Cities have only one true starting date. · Markets are always older than farms.</sub>
- A visitor asks what makes a history different from a made-up story. What do you say?  
  **It is based on evidence from the past.** · It is longer and has many more details. · It leaves out the writer’s own opinions. · It mostly describes kings and their wars.  
  <sub>was: It is always longer and more detailed. · It never includes anyone’s opinion. · It only describes kings and wars.</sub>
- You are sorting notes for your history. Which statement is a claim you could test with evidence?  
  **Trade on the river grew after the bridge opened.** · Our city is the most beautiful city on the river. · The gods chose our people to rule the river valley. · Life long ago was happier and simpler than now.  
  <sub>was: Our city is the greatest city ever built. · The gods chose our people to rule the land. · Long ago, life was simply better than now.</sub>
- Two travelers describe the same festival. One calls it joyful; the other calls it loud and crowded. What is the best conclusion?  
  **Both may be accurate from different viewpoints.** · The second traveler probably arrived at a different festival. · Festivals are too noisy for historians to study well. · The first traveler is more reliable because they were happy.  
  <sub>was: The second traveler must have missed it. · Festivals can’t be studied by historians. · The first traveler is always the reliable one.</sub>
- Your history of a village starts with its founding. Another writer’s starts when a new road arrived. What does the second choice highlight?  
  **How new connections changed village life.** · Who founded the village and in what year. · Why the village stayed the same over time. · Which families are the oldest in the village.  
  <sub>was: Who founded the village first. · Why villages never really change. · Only the oldest events in the village.</sub>
- A historian writes about a war using only the winners’ letters. What is the biggest problem?  
  **The losers’ experiences are left out.** · Letters are too old to read clearly today. · Winners usually exaggerate their own losses. · Wars are better studied through maps than letters.  
  <sub>was: Letters are too old to read clearly. · Winners rarely write any letters. · Wars are not part of real history.</sub>
- You claim the harbor town grew richer after 1200. Which evidence best supports your claim?  
  **Tax records showing more ships each year.** · A poem praising the town’s beautiful harbor. · A legend about the brave sailor who founded it. · A modern painting of the busy old harbor at dawn.  
  <sub>was: A poem praising the town’s beauty. · A legend about the town’s founder. · A modern painting of the old harbor.</sub>
- Three sources describe a flood. Two written that year say it lasted a week. One written 200 years later says a month. What is the most reasonable conclusion?  
  **The flood likely lasted about a week.** · The flood likely lasted about a month. · The flood probably did not happen. · The three sources are equally reliable.  
  <sub>was: The flood lasted exactly one month. · No flood happened at all. · All three sources are equally reliable.</sub>
- In one town you write down a single family’s story of moving across the desert. Which scale is this?  
  **A close, local scale.** · A global scale. · A century-wide scale. · A regional comparison.  
  <sub>was: A global scale only. · A century-wide scale only. · A comparison with no people.</sub>
- A reporter from the future asks what you notice when you “zoom out” and look at all your travels together.  
  **Patterns connecting many places or communities.** · The exact thoughts of one person on one day. · Details about a single village’s weekly market. · Which local leaders you liked and disliked most.  
  <sub>was: The exact thoughts of one person. · Details that no source records. · That local experiences do not matter.</sub>
- Your student asks why you keep switching between close-up stories and big-picture views. What do you say?  
  **Different scales reveal different details and patterns.** · Switching scales keeps the student from getting bored. · The big picture proves what caused each close-up story. · Close-up stories are more reliable than the big picture.  
  <sub>was: One scale makes all evidence unnecessary. · Wide views always prove local causes. · Close views cannot include evidence.</sub>
- A visitor asks what it means to “zoom out” in history. What do you say?  
  **Look at a wider area or a longer time.** · Look closely at one person’s single day. · Read the newest sources before older ones. · Remove the dates and focus on the story.  
  <sub>was: Look at one person’s single day. · Read only the newest sources. · Remove the dates from a story.</sub>
- Zooming in on one family’s letters helps a historian see what?  
  **How big changes affected real people.** · Patterns of trade across the whole world. · The major events in that whole century. · Why millions of families moved in that century.  
  <sub>was: Patterns across the whole world. · Every event in that century. · Why all families felt the same way.</sub>
- A historian studies 10,000 years of human history at once. What is she most likely to miss?  
  **Details of individual lives.** · Long-term patterns of change. · Changes across many regions. · Connections between places.  
  <sub>was: Long-term patterns. · Changes across regions. · Connections between places.</sub>
- Which question works best at a global scale?  
  **How did ideas spread between continents?** · What did one baker eat for breakfast today? · Who lived in this one house on the corner? · What did one soldier write home in his letter?  
  <sub>was: What did one baker eat for breakfast? · Who lived in this one house? · What did one soldier write home?</sub>
- After a new road network was built, trade rose 40% in Village A, 35% in Village B, and 50% in Village C. Which claim fits this wider view?  
  **The roads likely boosted trade across the region.** · Village C gained the most, so the roads helped it more than others. · The roads likely made trade fall across the region. · The rise in trade was not connected to the roads.  
  <sub>was: Only Village C gained anything from the roads. · The roads made trade fall in the region. · The roads did not affect any village.</sub>
- Why might a local story and a global pattern seem to disagree?  
  **Local places can differ from the overall trend.** · One of them is probably a made-up story. · Global patterns are usually based on guesses. · Local stories are told by people with no evidence.  
  <sub>was: One of them must be made up. · Global patterns are not based on evidence. · Local stories are never accurate.</sub>
- You notice many port cities grew during the same century. What should you do next?  
  **Zoom in on a few ports to check why.** · Assume they grew for one shared reason. · Stop, since the pattern proves itself. · Study the inland villages instead.  
  <sub>was: Assume they all grew for one reason. · Stop, since the pattern proves itself. · Study only inland villages instead.</sub>
- You want to trace how silk, ideas, and news moved between places. Which frame fits best?  
  **Networks.** · Communities. · Collective memory. · A single person’s life.  
  <sub>was: Communities. · One person’s daily routine only. · A list of rulers only.</sub>
- You want to explain who made iron tools and how they reached farmers. Which frame fits best?  
  **Production and distribution.** · Collective memory. · Communities and families. · A single battle and its leaders.  
  <sub>was: Collective memory only. · A single battle only. · A family tree only.</sub>
- A young scribe asks why you bother choosing a frame for a big, messy event. What do you tell them?  
  **It focuses attention on one useful set of details and questions.** · It gives one complete explanation that ends the arguments about it. · It means you do not need to compare different sources about the event. · It shows that the other perspectives on the event are incorrect.  
  <sub>was: It guarantees one complete explanation. · It removes the need to compare sources. · It makes every other perspective incorrect.</sub>
- You study how salt was mined, packed, and sold, and who got rich from it. Which frame fits best?  
  **Production and distribution.** · Communities and families. · Networks and connections. · Collective memory of the town.  
  <sub>was: Communities. · Networks. · Collective memory.</sub>
- Why might two historians studying the same city reach different conclusions?  
  **They used different frames and questions.** · One of them did not look at any evidence. · The city changed between their two visits. · Frames change what actually happened there.  
  <sub>was: One of them did not use any evidence. · Cities can only be studied one way. · Frames change what actually happened.</sub>
- A historian studies a village using only the networks frame. What might she overlook?  
  **How villagers lived and worked together.** · Connections to other places. · Goods moving along the trade routes. · Ideas arriving from faraway cities and lands.  
  <sub>was: Connections to other places. · Goods moving along trade routes. · Ideas arriving from far away.</sub>
- A visitor says, “A frame is like a lens.” What does this mean?  
  **Each frame brings certain details into focus.** · Each frame shows the same evidence the same way. · A frame shows the one true history of a place. · A frame hides the sources that disagree with it.  
  <sub>was: Every frame shows the same evidence. · A frame shows the one true history. · A frame hides every source but one.</sub>
- A child asks you what “collective memory” means. What do you say?  
  **Ways a group remembers and tells stories about its past.** · A list of dates that historians agree on and rarely change. · A source that is unbiased because many people remember it. · A record written down by one historian for later readers.  
  <sub>was: A list of dates that never changes. · A source that is always unbiased. · A record written by only one historian.</sub>
- A visiting scholar asks why you would compare a remembered story with other evidence. What is your answer?  
  **To understand what it reveals and where accounts differ or are incomplete.** · To prove that remembered stories are less reliable than written records are. · To change the remembered story so that it matches the written evidence. · To find out which storyteller first told it, so that you can credit them.  
  <sub>was: To prove memories are useless. · To make all accounts identical. · To avoid asking who created a source.</sub>
- Someone digs up an old object that does not match a story everyone knows. What should a good historian do?  
  **Examine the artifact and compare it with other evidence.** · Set the object aside because the old story is well known. · Change the date of the object so that it fits the story. · Decide that the story was invented and should be forgotten.  
  <sub>was: Discard it because the old story is familiar. · Change the artifact to fit the account. · Assume disagreement makes all history unknowable.</sub>
- You are teaching an apprentice griot. Which question helps them judge whether a history is complete?  
  **Who preserved this account, and whose experiences are missing?** · Is this the story I have heard most often from my own teachers? · Does the story avoid disagreement so that listeners will enjoy it? · Can I memorize it quickly without checking other evidence?  
  <sub>was: Is this the only story I have heard? · Does the narrative avoid all disagreement? · Can I memorize it without checking evidence?</sub>
- A city’s archive burned in a fire 300 years ago. How does this affect its history?  
  **Some events may be hard to know about.** · Little of importance happened in that city. · The city’s history must be made up now. · Other sources about the city are useless.  
  <sub>was: Nothing important happened in that city. · The city never kept any records. · All other sources become useless.</sub>
- Why can the people who choose what goes in a textbook shape what students learn?  
  **They decide which stories are told.** · They change what happened in the past. · They make the sources more reliable. · They check that each story is popular.  
  <sub>was: They change what happened in the past. · They make all sources equally reliable. · They remove all evidence from books.</sub>
- A national holiday celebrates a great victory, but letters from both armies describe heavy losses. What is the best conclusion?  
  **Memory of an event can differ from what happened.** · The letters from both armies are probably forged. · Holidays are the best evidence we have about wars. · The victory must have happened with no losses.  
  <sub>was: The letters from both armies must be fake. · Holidays are the best evidence about wars. · Neither source tells us anything useful.</sub>
- Which source would best fill a silence about enslaved workers on a plantation?  
  **Interviews with formerly enslaved people.** · The owner’s list of buildings and tools. · A painting of the plantation paid for by the owner. · A map of the plantation’s fields and roads.  
  <sub>was: The owner’s list of buildings and tools. · A painting paid for by the owner. · A map of the plantation’s fields.</sub>
- Two groups remember the same treaty very differently. What should a historian do?  
  **Study both memories and the treaty itself.** · Choose the memory of the group that is larger. · Set both memories aside as too biased to use. · Use whichever version is more popular today.  
  <sub>was: Choose the group that is larger today. · Ignore both memories entirely. · Use whichever version is more popular.</sub>
- You claim a city’s founding legend was shaped by later rulers. Which evidence best supports this?  
  **It first appears in records 500 years later.** · It is still very popular in the city today. · It includes many exciting, colorful details. · Some old families in the city still tell it.  
  <sub>was: It is still very popular in the city today. · It includes many exciting details. · Some families still tell it aloud.</sub>

### Unit 2

- The reporter asks: “For most of the 300,000 years of your species’ history, how did people mainly live?”  
  **As foragers** · As farmers · As herders · As city dwellers  
  <sub>was: As farmers · As herders · As city dwellers</sub>
- The reporter asks: “What does your band mostly eat?”  
  **Wild plants and hunted animals** · Crops grown in our own fields · Food traded at a busy market · Bread baked from grain we store up  
  <sub>was: Crops grown in our own fields · Food bought at markets · Bread from stored grain</sub>
- The reporter asks: “Humans have existed about 300,000 years, and farming began about 12,000 years ago. How much of human history was spent foraging?”  
  **More than 90 percent** · About half of it · About 10 percent · Less than 1 percent of it  
  <sub>was: About half · About 10 percent · Less than 1 percent</sub>
- The reporter asks: “The farming age is called the Neolithic, or New Stone Age. Why is it still a Stone Age?”  
  **Most tools were still made of stone** · People lived mostly in stone caves · Stone was used as a kind of money · Laws and writing were carved in stone  
  <sub>was: People lived only in stone caves · Stone was used as money · Writing was carved in stone</sub>
- The reporter says: “People in my time still raise children, share food, and tell stories, just like your band.” What does this show?  
  **Some parts of life stayed the same** · Little has changed since your time · Your band lived the same way we do · Changes matter more than continuities  
  <sub>was: Nothing has changed since your time · Your band lived exactly like us · Only changes matter in history</sub>
- The reporter claims, “Early foragers moved with the seasons.” Which evidence best supports this claim?  
  **Campsites used at different times of year** · A single cave painting of a horse herd · A modern film about life in the Ice Age · A stone house that a family used for centuries  
  <sub>was: A single cave painting of a horse herd · A modern film about cave people · A stone house used for centuries</sub>
- The reporter says, “Farming began everywhere at the same moment.” Which evidence would show this is wrong?  
  **Early farm sites of very different ages** · Old grinding stones from one early village · Bones of wild animals found at a campsite · Stories that say farming was very hard work  
  <sub>was: Old grinding stones from one village · Bones of wild animals at a campsite · Stories saying farming was hard</sub>
- The reporter shows a timeline where all of human history is one 24-hour day. Foraging fills almost the whole day. What does this timeline show?  
  **Farming is a very recent part of history** · Farming began near the start of history · Foraging lasted a short time in our history · Cities came before the first foragers did  
  <sub>was: Farming began at the start of history · Foraging lasted only a short time · Cities came before foraging</sub>
- The visitor notices nobody here can write yet. What does your art show about that?  
  **People shared ideas in ways other than writing** · Writing had already spread to most nearby groups · Art was made for decoration rather than meaning · People could not think in symbols yet  
  <sub>was: Writing had already spread to every group · Art was made only for decoration, never for meaning · People could not think in symbols yet</sub>
- The visitor asks: “Why could people walk from Asia to North America during the Ice Age?”  
  **Low sea levels uncovered land** · The Pacific Ocean froze solid · The rivers of Asia dried up · People built a long land bridge  
  <sub>was: The whole ocean froze solid · The rivers of Asia dried up · People built a long bridge</sub>
- A scientist claims people left Africa in several waves, not all at once. Which evidence best supports this?  
  **Remains of different ages along different routes** · One skull found in a single cave in East Africa · A cave painting of a group of people walking · A legend about one single great journey out of Africa  
  <sub>was: One skull found in a single cave · A painting of people walking · A legend about one great journey out of Africa</sub>
- A future historian says your paintings show what you ate every day. What is the problem with this claim?  
  **Paintings may show what mattered, not meals** · Paintings this old are very hard to date · The painters did not go hunting themselves · Paintings are less useful than written records  
  <sub>was: Paintings can never be dated · The painters never went hunting · Paintings are never a useful kind of evidence</sub>
- A young member of your band asks why foraging takes so much knowledge. What do you teach them?  
  **Food sources change with place and season** · Food stays in the same spot through the year · The band leader is the one who needs to know · Most wild plants are safe to eat anyway  
  <sub>was: Food stays in the same spot all year · Only the band leader needs to know anything · Every wild plant is safe to eat anyway</sub>
- The traveler notices your band owns few belongings. Why?  
  **Moving often makes it hard to carry much** · Owning things was against the band’s laws · Tools had not been invented yet · Traders took away the things you made  
  <sub>was: Owning things is against the law · No tools had been invented yet · Traders took away everything you made</sub>
- Many foraging bands had no rich or poor members. Which evidence would best support this claim?  
  **Burials with similar goods for everyone** · One grave filled with gold and jewels · A large palace in the center of the camp · A painting of a chief sitting on a throne  
  <sub>was: One grave filled with gold and jewels · A large palace in the center of camp · A painting of a king on a throne</sub>
- A forager asks what “domesticate” means. What do you say?  
  **To tame and breed plants or animals** · To hunt wild animals in a new way · To move to a new home with each season · To trade food with the other villages  
  <sub>was: To hunt wild animals a new way · To move to a new home each season · To trade food with other villages</sub>
- Your village grows wheat and barley in Southwest Asia. What is this farming region often called?  
  **The Fertile Crescent** · The Silk Road route · The Sahara Desert · The Great Rift Valley  
  <sub>was: The Silk Road · The Sahara Desert · The Great Plains</sub>
- A traveler from the Americas describes the main crop farmers there domesticated. Which crop is it?  
  **Corn (maize)** · Wheat and barley · Rice · Sugar cane  
  <sub>was: Wheat · Rice · Sugar cane</sub>
- Farming began in several places that had no contact with each other. What does this show?  
  **Many peoples began farming on their own** · One group taught farming to the others · Farming spread mainly through trade · Farming began in one place, then spread  
  <sub>was: One group taught farming to the world · Farming spread only through trade · Farming began in only one place</sub>
- Because of the surplus, your neighbor stops farming and makes pots full time. What is this called?  
  **Specialization** · Migration · Domestication · Surplus trading  
  <sub>was: Migration · Foraging · Domestication</sub>
- Which question about your village fits the production and distribution frame?  
  **Who grows the grain, and who eats it?** · What stories does the village tell? · Which gods does the village honor? · How does the village choose its rules?  
  <sub>was: What stories does the village tell? · Which gods does the village honor? · How does the village choose rules?</sub>
- At Çatalhöyük, thousands of people lived in packed mud-brick houses. What does this site show about early farming?  
  **It could support large, settled towns** · Farmers there still moved with the seasons · Each farming town needed a palace · Farming was invented in that town  
  <sub>was: Farmers still moved every season · Every farming town had a palace · Farming was first invented in this one town</sub>
- A visitor asks which parts of life farming has changed in your village. What do you list?  
  **Diet, work, homes, and trade** · The food people ate · The weather and the seasons · The tools and weapons people used  
  <sub>was: Only the food people ate · Only the weather and seasons · Nothing except the tools people used</sub>
- A visitor asks how farming changed the number of people in the world. What do you say?  
  **Populations grew much larger** · Populations shrank quickly · Populations stayed about the same · Foragers had more children  
  <sub>was: Populations shrank to almost nothing · Populations stayed exactly the same · Only foragers had children</sub>
- Skeletons from early farming villages are often shorter than earlier foragers’. What is the most likely cause?  
  **Less varied diets based on a few crops** · Farmers spent too much time traveling · Foragers ate mostly grain and bread · Farmers ate too much meat in their meals  
  <sub>was: Farmers spent too much time traveling · Foragers ate only grain · Farmers ate too much meat</sub>
- Which change from farming helped make some people in your village richer than others?  
  **Land and stored food could be owned** · Food was shared equally by the village · People stopped making new tools · Bands moved to new land each season  
  <sub>was: Everyone shared all the food equally · People stopped making tools · Bands moved every season</sub>
- One writer called farming “the worst mistake in the history of the human race.” What does the writer mean?  
  **Farming did more harm than good for many** · Farming did not really happen that way · Farming was invented by accident long ago · Farming helped each person in equal ways  
  <sub>was: Farming never really happened · Farming was invented by accident · Farming helped every single person equally</sub>
- Which evidence best supports the claim that farming was a mistake?  
  **Farmers’ bones show more disease and wear** · Farming villages had many more people · Farming made writing possible later on · Farmers built homes that lasted for many years  
  <sub>was: Farming villages had more people · Farming made writing possible much later · Farmers built permanent homes</sub>
- Farming was harder for many individuals but helped human numbers grow. What does this show about the “mistake” question?  
  **The answer depends on whose view you take** · The question has one simple answer · Population growth is what matters most here · Individual lives tell us very little  
  <sub>was: The question has one simple answer · Population is the only thing that matters · Individual lives tell us nothing</sub>
- Once your village depends on farming, why is it hard to go back to foraging?  
  **Wild food can’t feed so many people** · Foraging had been banned by the chief · Wild plants had disappeared from the land · People were too busy building temples  
  <sub>was: Foraging has been banned by law · All wild plants have disappeared · People are too busy writing books</sub>

### Unit 3

- A traveler asks how the small villages you visit are connected to each other. What do you say?  
  **Through trade and shared news** · They were cut off from each other · Through letters written in clay · Through the orders of an empire  
  <sub>was: They were cut off from each other · Only through written letters · Only through a ruling empire</sub>
- The traveler asks which groups the farming villages deal with. Who do you name?  
  **Foragers, herders, and nomads** · Armies from large empires far away · The kings of the big cities · Traders from across the far sea  
  <sub>was: Only farmers from other villages · Only the kings of big cities · No outsiders at all</sub>
- Obsidian from a faraway volcano turns up in this village. What does that show?  
  **Goods moved between distant groups** · The village sits beside a volcano · Obsidian forms in most farm fields · The village had few visitors  
  <sub>was: The village sits beside a volcano · Obsidian forms in every field · The village had no visitors at all</sub>
- Besides goods, what else travels with you between villages?  
  **Ideas, news, and skills** · Heavy building stones · Orders from city kings · Written letters and laws  
  <sub>was: Nothing but heavy stones · Only orders from kings · Only written letters</sub>
- A reporter from the future asks which regions long-distance trade connects. What do you answer?  
  **Mesopotamia and the Indus Valley, by way of the Gulf** · Towns along a single river valley · Egypt and China, by way of the Red Sea and the Indian coast · Europe and the Middle East  
  <sub>was: Only towns along a single river · Only the island of Bahrain · Only Europe and nowhere else</sub>
- Your apprentice asks why long-distance trade is rarer than local trade. What do you say?  
  **It is slow, costly, and risky** · Kings ban most local trade · Distant goods cost very little · Boats had not been invented yet  
  <sub>was: Kings ban all local trade · Distant goods cost nothing · Boats had not been invented yet anywhere</sub>
- You press your seal into clay tablets to record each deal. What does this show?  
  **Trade needed careful record-keeping** · Traders could not count their goods · Writing was used for poems and prayers · Merchants did not trust each other  
  <sub>was: Traders could not count goods · Writing was used only for poems and prayers · Merchants never trusted writing</sub>
- Your laws give different punishments depending on who was harmed. What does this show about Babylon?  
  **People of different ranks were treated differently** · Each person was treated in the same way by the law · The king could be punished by the courts like anyone · Harming someone was not against the law in Babylon  
  <sub>was: Every single person was treated in exactly the same way · Only the king could ever be punished · There were no rules about harming people</sub>
- A historian has your law code but no records of real court cases. What is a limit of this source?  
  **It shows the rules, not how they were used** · It proves the laws were obeyed by the people · It was written long after the king died · It tells us little about life in Babylon  
  <sub>was: It proves that every law was always obeyed by all · It was written long after you died · It tells nothing about Babylon at all</sub>
- A child asks what Shang ancestor worship is about. What do you say?  
  **Honoring family members who died** · Forgetting old family history · Worshiping the sun and the moon · Obeying the oldest living elders  
  <sub>was: Forgetting family history · Worshiping only the sun and the moon · Obeying only living elders</sub>
- A farmer asks why the river matters so much for crops. What do you say?  
  **Floods left rich soil for crops** · It froze solid each winter · Its floods washed the soil away · Rain fell there most days  
  <sub>was: It froze solid every winter · Its floods washed away all soil · Rain fell there every day</sub>
- A reporter from the future asks how to describe Nubia and Egypt. What is the best description?  
  **Neighbors who shaped each other** · Societies with little contact · One society that changed little · Rivals on two distant continents  
  <sub>was: Societies with no contact at all · One society that never changed · Rivals on two distant continents</sub>
- You, a king of Kush, now rule Egypt as pharaoh. What does this show about the two lands?  
  **Power could move in both directions** · Egypt ruled Nubia for its whole history · Nubia had no kings of its own · The two lands had little contact  
  <sub>was: Egypt always ruled over Nubia, never the reverse · Nubia had no kings of its own · The two lands never met at all</sub>
- An old Egyptian record calls Kush “wretched.” Why should a historian be careful with this source?  
  **It was written by a rival with a bias** · It is the oldest record ever found · Egyptians rarely wrote about Nubia · It was written after the kingdom of Kush had ended  
  <sub>was: It is the only record ever found · Egyptians never once wrote anything about Nubia · It was written after Nubia ended</sub>
- The traveler asks why their society is so different from yours. What do you say?  
  **They live in a very different land** · Most lands in the world are alike · They have not learned to farm yet · Land and weather matter very little  
  <sub>was: Every land in the world is exactly the same · They have no farms at all · Land and weather never matter</sub>
- A historian from the future wants to learn about your society. How can they do it?  
  **By studying ruins, carvings, and tools** · By reading novels written in modern times · From one written law code · There is no way to study them  
  <sub>was: Only by reading novels written in modern times · Only from one written law code · There is no way to study them</sub>
- A visitor asks why later peoples in Mexico use ideas like yours. What do you say?  
  **Olmec ideas spread and lasted** · Olmec kings ruled most of Mexico · Later people met few outsiders · Ideas rarely spread between groups  
  <sub>was: Olmec people ruled all of Mexico forever · Later people never met anyone · Ideas cannot spread between groups</sub>
- Jade and other goods from far away are found in your city. What does this show?  
  **Your people traded across a wide area** · Jade forms in most rivers in Mexico · Your people rarely left the city · The goods were made by your sculptors  
  <sub>was: Jade forms in every river in Mexico · Your people never left the city · The goods were made by your sculptors</sub>
- Few weapons and no grand palaces have been found in your city. What can historians fairly conclude?  
  **Power may have worked differently here** · The city had no leaders of any kind · The people here had no conflicts · The palaces were later carried off to Egypt  
  <sub>was: The city had no leaders of any kind · The people here never had any conflicts at all · The palaces were all taken to Egypt</sub>
- A young trader asks why every kingdom you visited grew up in its own way. What do you say?  
  **Each land had its own rivers and resources** · They used the same resources in the same way · Climate mattered very little to farmers · The kingdoms did not need to farm  
  <sub>was: All of them used exactly the same resources · Climate never mattered to farmers · None of the kingdoms farmed at all</sub>
- The trader asks how to compare Mesopotamia, Egypt, the Indus Valley, and Shang China. What is a good way?  
  **Look for what is alike and what is different** · Assume the four were alike in most ways · Compare the names of their kings and gods · Study the one that left the most written records  
  <sub>was: Assume that all four were the same in every way · Compare only their names · Ignore where each one was found</sub>
- The trader asks what all those kingdoms had in common. Which similarity do you name?  
  **Farming fed growing cities** · They did not need farming · They shared a single ruler · They were in the same place  
  <sub>was: None of them farmed · All of them shared one ruler · All were in one place</sub>
- Shang China built with rammed earth and timber, and the Indus Valley with baked brick. What explains differences like these?  
  **Each place had different resources** · Each place had the same materials · Traders refused to share their building goods · Kings chose materials at random  
  <sub>was: Every place had the same materials · Traders refused to share anything · Kings chose materials at random</sub>
- A historian claims river floods shaped all four kingdoms. Which evidence best supports this?  
  **Canals and flood-control works along each river** · Bronze weapons found in Shang tombs · Indus seals found in Mesopotamia · Paintings of kings on the walls of their temples and palaces  
  <sub>was: Bronze weapons found in Shang tombs · Indus seals found in Mesopotamia · Paintings of kings on the walls of temples</sub>
- Someone says every early kingdom grew in exactly the same way. Which evidence would challenge this?  
  **Very different buildings, writing, and rulers** · The four kingdoms grew up beside large rivers · The four kingdoms each farmed grain · Each of the four kingdoms had cities  
  <sub>was: All four kingdoms grew up beside large rivers · All four kingdoms farmed grain · All four kingdoms had cities</sub>

### Unit 4

- A fellow traveler asks what makes a belief system “portable.” What do you say?  
  **It travels with people to new places** · It is tied to one temple · It is practiced by one family line · It can be followed in one holy city or shrine  
  <sub>was: It is tied to one temple only · It is only practiced by one family · It can only be followed inside one city</sub>
- The traveler asks how portable belief systems usually spread. What have you seen on your journeys?  
  **Along trade and travel routes** · Through farming villages · Through written laws and courts · By keeping away from others  
  <sub>was: Only through farming villages · Only through written laws · By keeping away from others</sub>
- The traveler asks how one belief can link people in very different places. What do you say?  
  **Followers share beliefs and practices** · They speak the same language · They live under one king and his laws · They stop trading with outsiders  
  <sub>was: They all speak the very same language everywhere · They all live under one king · They stop trading with outsiders</sub>
- A trader asks where people often first hear about a new faith. What do you say?  
  **At markets and trading towns** · In their home villages · Inside the king’s palace · From the books they buy at home  
  <sub>was: Only in their home villages · Only inside the king’s own palace · Only from books they buy</sub>
- Empires and belief systems often helped each other spread. How might an empire help a faith?  
  **Its roads and peace made travel safer** · It banned travel between its many lands · It kept each faith inside one city · It made trade with outsiders illegal  
  <sub>was: It banned all travel between lands · It kept every belief in one city · It made all trade with outsiders illegal</sub>
- A faith arrives in a new land and mixes with local customs. What does this show?  
  **Beliefs can change as they spread** · Beliefs stay the same as they move · Local people reject new ideas · The faith disappears right away  
  <sub>was: Beliefs never change when they move · Local people reject all new ideas · The faith disappears right away</sub>
- A child asks what karma means. What do you say?  
  **Actions have effects, now and later** · People are born with the same fate · The gods decide what happens to you · Rebirth happens to kings and priests  
  <sub>was: Every person has the same fate · The gods alone decide everything that happens · Rebirth only happens to kings</sub>
- A traveler asks why Islam spread so quickly from Arabia. Which reason do you give?  
  **Trade routes and new Muslim rulers** · Merchants were forced to join it · Arabia had little contact with others · It was spread by sailors from China  
  <sub>was: Every merchant was forced to join · Arabia had no contact with others · It was spread only by sailors from China</sub>
- Islam teaches that Muhammad was the last of a line of prophets that includes Abraham, Moses, and Jesus. What does this show?  
  **Islam shares roots with Judaism and Christianity** · Islam has no link to any faith that came before it · Islam began long before Judaism did · Muslims reject the earlier prophets as false  
  <sub>was: Islam has no link at all to any other faith before it · Islam began long before Judaism · Muslims reject all earlier prophets</sub>
- Back home, a student asks why you compare the belief systems you met. What do you say?  
  **To see what is alike, what differs, and why** · To prove the faiths are the same · To decide which faith is the true one · To find which faith has the most followers today  
  <sub>was: To prove all the faiths are exactly the same · To decide which faith is the only true one · To forget their histories</sub>
- The student asks what many portable belief systems have in common. Which similarity do you name?  
  **Teachings about how to live and treat others** · They began in the same city · They forbid their followers to travel far from home · They have few followers or communities  
  <sub>was: They all began in the very same city · They all forbid their followers to travel to other lands · They all have no followers or communities</sub>
- You saw Buddhism look different in each land you passed through. Which claim is best supported?  
  **Faiths changed as they spread to new lands** · Faiths stay the same wherever they move · One faith spread much farther than the others · Faiths spread for reasons that are unclear  
  <sub>was: Faiths never change, no matter where they move · Only one faith ever spread far · Faiths spread for no reason at all</sub>
- You bring hundreds of Buddhist texts back to China and translate them. Why does this matter?  
  **More people can read the teachings** · Fewer people can learn about Buddhism · The texts can be read by monks in India · China will stop trading with India  
  <sub>was: Fewer people can learn about Buddhism · The texts can only be read in India · China will stop all trade with India</sub>
- A student asks what Buddhism, Christianity, and Islam have in common. What do you say?  
  **They welcome people from many lands** · They began in the same region · They are tied to one family line · They worship the same founder and god  
  <sub>was: They all began in the very same region · They are all tied to one family · They all worship the same founder</sub>
- A student asks why Buddhist temples in China look different from those in India. What do you say?  
  **Builders mixed in their own local styles** · Chinese law banned temples from India · Indian monks built each temple in China · Buddhism does not allow large stone buildings  
  <sub>was: Chinese law banned all temples · Indian monks built every temple in China · Buddhism does not allow buildings</sub>
- Your travel diary describes India for the Chinese emperor. What is a limit of it as a source?  
  **It shows India through one traveler’s eyes** · It was written many centuries after the trip · It describes China rather than India · Its writer did not actually visit India  
  <sub>was: It was written centuries after the trip ended · It describes only China, not India · Its writer never left China at all</sub>
- A visitor asks how far the Persian Empire reached at its height. What do you say?  
  **From Egypt to India** · From Rome to China · From Greece to Spain · Across Persia and Mesopotamia  
  <sub>was: From Rome to China · From Greece to Spain · Only across Persia</sub>
- After you take Babylon, what do you do for the Jewish people who were held captive there?  
  **Let them return home to Jerusalem** · Keep them as slaves in Babylon · Send them to fight in Greece · Force them to worship your own gods  
  <sub>was: Keep them all as slaves forever · Send every one of them to fight in Greece · Force them to worship your gods</sub>
- Your empire collects taxes from every province. What do the taxes pay for?  
  **Armies, roads, and officials** · Gifts for the Greek cities · Gold stored in the palace vaults · The king’s private feasts  
  <sub>was: Gifts for the Greek cities · Nothing; they are simply stored · Only the king’s private feasts</sub>
- Greek writers called the Persian kings proud and cruel. Why should a historian be careful with this?  
  **The Greeks were Persia’s enemies** · The Greeks rarely met any Persians · It was written by Persian kings · Greek writers usually praised Persia  
  <sub>was: The Greeks never met any Persians · It was written by Persian kings · Greek writers always praised Persia</sub>
- A historian compares Persian rule with Assyrian rule, which was known for harsh punishments. Which statement is accurate?  
  **Persia ruled more through tolerance than fear** · Persia ruled mainly through fear and harsh terror · Both empires let each city rule itself · Assyria was the more tolerant of the two  
  <sub>was: Persia ruled only through fear and terror · Both empires let every city completely rule itself · Assyria was the more tolerant of the two</sub>
- A student asks who could vote in Athens. What do you say?  
  **Free adult men who were citizens** · Each adult living in Athens · The richest families in the city · Women, men, and enslaved people  
  <sub>was: Every person living in Athens · Only the richest family in the city · Women, men, and enslaved people</sub>
- You write that some people are slaves by nature. Why must historians read your views with care?  
  **Writers reflect the beliefs of their time** · You did not write anything down · Each person in Athens agreed with you · Slavery did not exist in Athens during your life  
  <sub>was: You never wrote anything down at all · Everyone in Athens agreed with every word you wrote · Slavery did not exist in Athens</sub>
- A scholar asks what the Mandate of Heaven means. What do you tell him?  
  **Heaven’s approval to rule, which can be lost** · A law that gives each new ruler power for life · A tax that farmers pay to the emperor · A rule that priests must govern China  
  <sub>was: A law that gives every single ruler power forever · A tax that farmers pay to the emperor · A rule that only priests may govern</sub>
- The emperor asks why your report compares the empires you visited. What do you say?  
  **To learn how rulers grow, govern, and hold power** · To prove that the empires were alike · To pick which empire is the strongest of them · To list each emperor’s name and dates in time order  
  <sub>was: To prove that all of the empires were exactly alike · To pick which empire is the strongest · To avoid using any evidence at all</sub>
- After all your travels, which claim is best supported by comparing empires?  
  **Empires ruled and grew in different ways** · Empires acted in the same way · Empires stayed the same over time · Power came from luck rather than choices  
  <sub>was: All empires acted in exactly the same way · Empires never changed over time · Power came from nowhere at all</sub>
- A child asks what Rome was before it had emperors. Just before the emperors, Rome was a:  
  **Republic** · Province of Persia · Greek city-state · Colony of Carthage  
  <sub>was: Province of Persia · Greek city-state · Colony of Carthage</sub>
- A clerk asks why the Han prefer officials chosen by tests. What do you say?  
  **Tests pick people for skill, not family** · Tests let the rich buy the best jobs · Tests were the way most people learned to read · Tests kept scholars away from power  
  <sub>was: Tests let the rich buy every job · Tests were the only way to read · Tests kept every scholar far away from power</sub>
- After hearing about Rome, which statement is best supported?  
  **Women’s lives differed by society and class** · Women in each land lived the same life · Women had little influence in any ancient society · Class made little difference to women  
  <sub>was: Every woman in every land lived exactly the same life · Women had no influence at all · Class made no difference to women</sub>
- You are an educated woman who advises the empress. What does this show?  
  **Some elite women gained influence** · Most women held government jobs · Women could not read or write · Men were the ones who advised rulers  
  <sub>was: All women held government jobs · Women could never read or write · Only men could ever advise rulers</sub>
