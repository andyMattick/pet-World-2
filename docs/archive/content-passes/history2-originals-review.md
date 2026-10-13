# History Unit 2: fixes to the original questions

The roadmap asks to fix the original questions where the right answer is the longest choice. In 19 of the 20 originals it was, often by a lot (up to 62 characters against 36), and several wrong answers were silly ("As factory workers", "Building and printing", "A battle map"). Prompts, difficulty tags and question order stay the same. Only the choices change, and question 2 in earliestHumans was already fine.

The correct answer is in **bold**. After the fix, the right answer is never the longest choice. Apply with `node docs/history2-fix-originals.mjs` from the repo root.

## earliestHumans

1. (L1) The reporter asks: “For most of the 250,000 years of your species’ history, how did people mainly live?”  
   Before: **As foragers** · As city dwellers · As factory workers · As farmers  
   After: **As foragers** · As farmers · As herders · As city dwellers

2. (L1) The reporter asks: “About how long ago did some people start experimenting with farming?”  
   Unchanged: **About 12,000 years ago** · About 250 years ago · About 2,000 years ago · About 250,000 years ago

3. (L1) The reporter asks: “People in my time talk about the Neolithic Revolution. What was it?”  
   Before: **The shift toward farming and settled life** · The invention of the printing press · A war between empires · The first use of writing  
   After: **The shift toward farming and settled life** · The first use of metal tools and weapons · The move out of Africa to other continents · The rise of the first cities and kings

4. (L2) The reporter asks: “Why should I compare how people lived then with how we live now?”  
   Before: **It reveals changes and continuities in how people live** · It proves the past was identical to today · It removes the need for evidence · It shows foragers had no knowledge  
   After: **It shows what changed and what stayed the same** · It proves that life today is better in every way · It shows that the past was just like today · It tells us which way of life was correct

## migrationArt

1. (L1) A visitor from the future asks: “Where did your people, Homo sapiens, first develop?”  
   Before: **Africa** · Antarctica · Australia only · North America  
   After: **Africa** · Europe · Asia · Australia

2. (L2) The visitor asks: “What can your paintings tell historians thousands of years from now?”  
   Before: **Clues about beliefs, skills, and communities, though not everything** · The exact thoughts of every person · That writing already existed everywhere · Nothing, because art is not evidence  
   After: **Clues about our beliefs and skills** · The exact thoughts of every painter · The names of the people who made them · A full record of everything we did

3. (L2) The visitor notices nobody here can write yet. What does your art show about that?  
   Before: **People communicated and expressed ideas in ways other than writing** · Only written sources are reliable · Early humans could not think symbolically · Art always shows daily meals  
   After: **People shared ideas in ways other than writing** · Writing had already spread to every group · Art was made only for decoration, never for meaning · People could not think in symbols yet

4. (L2) A historian of the future finds your paintings. What is the best next step for them?  
   Before: **Compare them with other evidence about the people and place** · Assume the paintings explain all of their culture · Ignore them because they have no words · Decide the artist’s exact name  
   After: **Compare them with other evidence** · Assume they explain the whole culture · Ignore them because they have no words · Use them to find the artist’s exact name

## foragingSocieties

1. (L1) A traveler asks what your way of life is also called. You tell them foraging is also called:  
   Before: **Hunting and gathering** · Mining and trading · Planting and harvesting · Building and printing  
   After: **Hunting and gathering** · Planting and harvesting · Herding and trading · Fishing and farming

2. (L1) A young member of your band asks why foraging takes so much knowledge. What do you teach them?  
   Before: **People needed to know plants, animals, seasons, and places** · Food always stayed in one spot · Tools were never used · Communities never shared information  
   After: **Food sources change with place and season** · Food stays in the same spot all year · Only the band leader needs to know anything · Every wild plant is safe to eat anyway

3. (L2) The traveler asks how your community helps everyone survive. What do you say?  
   Before: **By sharing skills, knowledge, and support** · By avoiding all cooperation · By storing food in factories · By depending on one person only  
   After: **By sharing skills, knowledge, and support** · By having each family hunt on its own · By storing food in large stone granaries · By following orders from one powerful chief

4. (L2) The traveler asks how meeting other bands helps you. How could networks help foraging communities?  
   Before: **They could exchange information, goods, and help** · They prevented all movement · They made tools unnecessary · They ended communication  
   After: **They could trade goods and share news** · They kept each band from ever moving · They made learning new skills unnecessary · They let one band rule all the others

## agriculturalRevolution

1. (L1) A forager passing by asks what this “agriculture” thing is. How do you explain it?  
   Before: **Growing crops and raising animals for food** · Collecting wild food only · Traveling without settling · Trading written records  
   After: **Growing crops and raising animals for food** · Gathering wild plants and hunting game · Moving with the herds from season to season · Trading food with neighboring bands

2. (L2) Your neighbor asks why you should keep farming. Which advantage do you point to?  
   Before: **It can produce more food in one place** · It guarantees perfect health · It removes the risk of drought · It ends all conflict  
   After: **It can produce more food in one place** · It guarantees good health for everyone · It removes the danger of drought · It means less work than foraging

3. (L2) Your neighbor worries about farming. Which disadvantage might come true?  
   Before: **Crops could fail and diets could become less varied** · Nobody needed to plan ahead · Communities always became smaller · Tools disappeared  
   After: **Crops could fail in a bad year** · People would no longer plan ahead · Villages would shrink every year · Diets would include more kinds of food

4. (L2) A reporter from the future asks why your farm matters for the history that comes after. What do you say?  
   Before: **Reliable food supported settled communities** · It made people stop using resources · It prevented trade · It required no cooperation  
   After: **Reliable food supported settled communities** · It made trade between groups impossible · It ended the need for people to work together · It allowed people to stop using tools

## biggestMistake

1. (L1) A visitor asks which parts of life farming has changed in your village. What do you list?  
   Before: **Diet, communities, lifestyles, networks, and production** · Only the weather · Only the length of days · Nothing beyond food  
   After: **Diet, work, homes, and trade** · Only the food people ate · Only the weather and seasons · Nothing except the tools people used

2. (L2) Someone says farming was “the biggest mistake” humans ever made. How should your village test that claim?  
   Before: **Compare evidence about benefits and costs for different people** · Accept it because it sounds dramatic · Ignore all disadvantages · Use only one object as proof  
   After: **Weigh benefits and costs for different people** · Accept it because it sounds so dramatic · Look only at the problems that farming caused · Use one object from the village as proof

3. (L2) You want to show the visitor that the question has more than one side. Which statement shows that?  
   Before: **Farming created new possibilities and new problems** · Farming had no effects · Foraging never required skill · Everyone experienced agriculture the same way  
   After: **Farming brought new benefits and new problems** · Farming had no real effects on daily life · Everyone in the village experienced farming the same way · Farming solved every problem foragers had

4. (L2) A historian asks which frame helps most for studying how your village makes and shares food. What do you say?  
   Before: **Production and distribution** · Weather only · A single ruler · A battle map  
   After: **Production and distribution** · Climate and geography · Leaders, laws, and government · Wars and battles
