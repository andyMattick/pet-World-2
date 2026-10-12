# Biology Unit 1 cleanup: review list

88 of 154 questions get new **wrong** answers. The question and the **right answer** stay the same, so hides, edits and miss rates in the teacher app stay attached. The one exception is marked ⚠.

**Before:**
- the right answer was the longest choice in 84 questions (55%);
- 14 questions had wrong answers that gave themselves away with "only", "always" or "never".

**After:**
- the right answer is the longest choice in 15 questions (10%);
- no wrong answer gives itself away with "only", "always" or "never".

**Blind check:** a separate reviewer solved all 154 questions without the key and agreed on every one. Its four concerns are fixed here: Q60 (self-pollination), Q71 (dandelions can make seeds without pollen), Q100 and Q29.

Run from the repo root: `node docs/bio1-cleanup.mjs`. Nothing changes unless every question is found exactly once, and running it twice does nothing.


## Cells and organisms

- A parent asks you to put these in order from smallest to largest. Which sequence is right?
  - **Cell, tissue, organ, organ system**
  - New wrong: Tissue, cell, organ, organ system · Cell, organ, tissue, organ system · Organ system, organ, tissue, cell
  - Was: Organ, cell, tissue, system · Tissue, organ, cell, system · System, organ, tissue, cell
- A kid asks what all living things have in common. What do you say?
  - **They are made of one or more cells**
  - New wrong: They each make their own food · They each have a brain and a heartbeat · They are each made of many cells
  - Was: They all have leaves · They all have bones · They are all made of one cell
- A visitor asks where new cells come from. What do you explain?
  - **From cells that already exist**
  - New wrong: From nonliving dust and dirt · From food the body breaks down · From tiny pieces of other tissues
  - Was: From nonliving dust and dirt · From mixing air and water · From sunlight hitting soil
- A visitor asks how a one-celled amoeba stays alive without organs. What do you explain?
  - **Its one cell does every life job**
  - New wrong: It shares organs with other amoebas · It takes in energy without needing food · Its tissues do the jobs of organs
  - Was: It borrows organs from others · It never needs food or water · It is not truly alive
- The stomach, intestines, and liver work together. What is a group of organs working together called?
  - **An organ system**
  - New wrong: A tissue group · An organism · A population
  - Was: A tissue · A cell · A population
- A parent asks why a skin cell and a nerve cell look so different. What do you say?
  - **Each cell’s shape fits its job**
  - New wrong: Nerve cells have more DNA than skin cells · Skin cells change shape as they get old · One of the two cells is not alive
  - Was: One of them is not alive · Nerve cells come from plants · Skin cells have no parts
- Your group builds a model of a dog. Which level of organization comes right above “organ system”?
  - **Organism**
  - New wrong: Tissue · Organ · Population
  - Was: Tissue · Organ · Cell
- A visitor asks why other body systems suffer if the digestive system stops working. What is the best answer?
  - **Body systems depend on each other**
  - New wrong: Each system is really just one organ · The digestive system controls the others · Cells can store years of nutrients
  - Was: All systems are one organ · Cells do not need nutrients · Only the stomach needs food

## Cell parts (understand)

- A grandparent asks which part decides what gets in and out of the cell. What is it?
  - **Cell membrane**
  - New wrong: Chloroplast · Nucleus · Cytoplasm gel
  - Was: Chloroplast · Nucleus · Vacuole
- A kid asks what the cell wall does. What do you explain?
  - **Gives the cell stiff support**
  - New wrong: Makes food from sunlight · Stores the cell’s DNA · Controls what enters the cell
  - Was: Makes food from sunlight · Stores the cell’s DNA · Releases energy from food

## Cell parts (apply)

- A visitor asks how a plant cell stays stiff and keeps its shape. Which part helps most?
  - **Cell wall**
  - New wrong: Mitochondria · Nucleolus · Cytoplasm
  - Was: Mitochondria · Nucleolus only · Cytoplasm gel only
- A cell’s membrane is damaged and harmful substances leak in. Which job has failed?
  - **Controlling what enters and leaves**
  - New wrong: Making food from sunlight · Storing and copying the cell’s DNA · Giving the cell stiff support
  - Was: Making food from light · Storing the cell’s DNA · Giving the cell stiff support
- A plant droops after days without water. Which cell part has lost the most water?
  - **The central vacuole**
  - New wrong: The cell nucleus · The cell membrane · The chloroplasts
  - Was: The nucleus · The cell membrane · The mitochondria
- Which cell would likely have the most chloroplasts?
  - **A cell from the top of a leaf**
  - New wrong: A cell from deep in a root · A cell from a human’s skin · A cell from the inside of a stem
  - Was: A cell from deep in a root · A cell from a human’s skin · A cell from a human muscle
- A visitor asks why animal cells can change shape but plant cells mostly cannot. What do you explain?
  - **Animal cells lack a rigid cell wall**
  - New wrong: Animal cells lack a nucleus inside · Plant cells lack a cell membrane · Plant cells lack cytoplasm inside
  - Was: Animal cells lack a nucleus · Plant cells lack a membrane · Plant cells lack cytoplasm
- A kid’s scraped knee heals as new skin cells form. Where do the new cells come from?
  - **Existing skin cells dividing**
  - New wrong: Blood cells turning into skin · Cells from the bandage material · Bone cells moving up to the skin
  - Was: The bandage material · Blood turning into skin · Air touching the scrape
- Scientists remove the nucleus from a cell. What will the cell most likely be unable to do?
  - **Divide to make new cells**
  - New wrong: Keep its cytoplasm inside · Hold its shape with a membrane · Take up space in the tissue
  - Was: Keep cytoplasm inside · Keep its membrane · Take up space
- Chloroplast counts in a leaf: top-layer cells average 40, bottom-layer cells average 10. Which statement is best supported?
  - **Top cells likely get more light**
  - New wrong: Bottom cells likely make more food · Bottom cells have a larger nucleus · Top cells likely need less energy
  - Was: Bottom cells make more food · Bottom cells have no nucleus · Top cells have no cell walls

## Plant reproductive success (understand)

- A kid asks what flowers are really for. What is the main purpose of a flower for many plants?
  - **To help the plant reproduce**
  - New wrong: To absorb water from the soil · To store food for the winter · To make the leaves grow faster
  - Was: To absorb water from soil · To anchor the plant · To make roots
- A visitor sees a plant covered in seeds. Why can making many seeds improve reproductive success?
  - **More seeds may survive and grow**
  - New wrong: Each seed needs less water to grow · The parent plant needs less sunlight · Seeds protect the parent from insects
  - Was: Seeds never need water · Every seed always grows · Parents stop needing sunlight
- A visitor asks why many fruits taste sweet. What do you explain?
  - **Animals eat them and spread seeds**
  - New wrong: Sweetness keeps animals away from them · Sugar helps the roots absorb water · Sugar makes the leaves turn greener
  - Was: Sweetness keeps animals away · It helps roots absorb water · It makes leaves greener
- A visitor asks why wind-pollinated grasses have small, plain flowers. What is the best explanation?
  - **They do not need to attract animals**
  - New wrong: They bloom at night when it is dark · Their pollen is too heavy for wind · Small flowers make more nectar for bees
  - Was: They only grow at night · Their pollen is too heavy to move · They make no pollen at all
- Which plant behavior helps reproductive success?
  - **Flowers opening when bees are out**
  - New wrong: Leaves turning brown in the winter · Roots growing deeper to find water · Stems bending toward the sunlight
  - Was: Leaves turning brown in winter · Roots growing deeper for water · Stems bending toward light
- A hummingbird drinks nectar from a long red flower. How does this help the plant?
  - **The bird carries pollen to other flowers**
  - New wrong: The bird eats seeds and drops the shells · The bird drinks extra water for the plant · The bird cleans old petals off the flower
  - Was: The bird eats the flower’s seeds · The bird waters the plant · The bird removes old petals
- Students counted bee visits in one hour. Flower A (bright, scented): 42 visits. Flower B (pale, no scent): 6 visits. Which claim is best supported?
  - **Bright, scented flowers attract more bees**
  - New wrong: Bees choose pale flowers when they can · Scent keeps most of the bees away · Bees visit flowers in a random order
  - Was: Bees prefer pale flowers · Scent keeps bees away · Flower traits do not matter to bees
- One plant makes 1,000 tiny seeds. Another makes 5 large seeds full of stored food. Which statement is true?
  - **Both are strategies for reproductive success**
  - New wrong: The tiny seeds are too small to grow into plants · The large seeds will grow into larger flowers · Small seeds are a sign the plant is unhealthy
  - Was: Only the tiny seeds can grow · Only the large seeds are real seeds · Neither plant can reproduce

## Plant reproductive success (apply)

- A kid sniffs a sweet flower full of nectar. Which structure-and-function idea do you explain?
  - **Features attract animals that carry pollen**
  - New wrong: Nectar feeds the roots during dry weather · The smell keeps insects from eating leaves · Features protect the flower from cold nights
  - Was: Features stop reproduction · Nectar makes roots · Smell removes pollen
- A visitor asks how a hard seed coat helps a seed that has to survive winter. What do you say?
  - **It can protect the embryo until conditions improve**
  - New wrong: It lets the seed grow quickly through the snow · It stores water that the roots use in winter · It helps the seed attract animals to carry it
  - Was: It makes the seed need no water ever · It turns into a flower · It stops growth permanently
- A grandparent asks what could hurt a plant’s chances of reproducing. Which change could lower its success?
  - **Loss of pollinators**
  - New wrong: Healthy, rich soil · More bees nearby · Plenty of warm sunlight
  - Was: More pollinators · Adequate water · Healthy soil
- A bee picks up pollen from one flower. What must happen next for the plant to make seeds? ⚠ right answer reworded (self-pollinating plants make seeds too)
  - **Pollen reaches a flower’s pistil**
  - New wrong: The pollen falls into the soil and grows · The bee carries the pollen back to its hive · The pollen sticks to the flower’s leaves
  - Was: Pollen falls down into the soil · The bee eats all of the pollen · Pollen turns into a new leaf
- A gardener wants more tomatoes. Which action would most help pollination?
  - **Plant bee-attracting flowers nearby**
  - New wrong: Spray the plants with a strong bug killer · Pick off the flowers so fruit grows bigger · Cover the plants with plastic at night
  - Was: Use a spray that kills bees · Pick off all the flowers · Cover the plants in plastic
- A plant grows beside a river, and its seeds have air pockets. How does this trait help it reproduce?
  - **Its seeds can float to new places**
  - New wrong: Its seeds sink and stay near the parent · Its seeds attract more bees to the flower · Its seeds can soak up extra river water
  - Was: Its seeds sink and rot faster · Its seeds attract more bees · Its seeds never need water
- A flower has patterns that only bees can see. What is the best explanation?
  - **The patterns guide bees to nectar**
  - New wrong: The patterns warn bees to stay away · The patterns help the petals catch sunlight · The patterns keep the nectar cool
  - Was: The patterns scare bees away · The patterns help roots grow · The patterns block sunlight
- Which flower is most likely pollinated by bats?
  - **Large and pale, opens at night**
  - New wrong: Small and green, blown by wind · Tiny and red, opens at noon · Bright blue, closes before sunset
  - Was: Small and green, wind-blown · Tiny and red, opens at noon · Blue and closed all night
- Students cover some apple blossoms with mesh bags so insects can’t reach them. Covered: 3 apples. Uncovered: 41 apples. What do the results show?
  - **Insect pollination increases fruit**
  - New wrong: Mesh bags make the apples bigger · Apples form fine without pollination · Insects damage most of the apple flowers
  - Was: Mesh bags make apples bigger · Apples form without pollination · Insects damage apple flowers
- Why might it help a bee-pollinated plant to bloom at the same time as others of its kind?
  - **More pollen gets shared between them**
  - New wrong: Bees fly farther when flowers are rare · Flowers last longer with fewer neighbors · Its seeds will need less water to sprout
  - Was: Bees only fly during winter · Flowers last longer when alone · Its seeds need no pollen at all
- A student claims large seeds with more stored food survive better in shade. Which evidence would best support this?
  - **Large seeds sprout more often in shade**
  - New wrong: Small seeds blow farther in the wind · Large seeds weigh more than small seeds · Shade plants grow fewer leaves than others
  - Was: Small seeds blow farther in wind · Large seeds weigh more · Shade plants have fewer leaves

## Asexual reproduction

- A visitor asks how new plants made by asexual reproduction compare to the parent. Offspring are:
  - **Genetically identical to the parent**
  - New wrong: A mix of traits from two parents · A new species unlike the parent · Grown from pollen and egg cells
  - Was: Mixed from two different parents · Always different species · Made from pollen and eggs
- A kid asks you for an example of asexual reproduction in plants. Which do you point to?
  - **A strawberry plant sending out runners**
  - New wrong: A bee carrying pollen between flowers · A seed forming after pollination · A bright flower attracting a butterfly
  - Was: A bee carrying pollen · A seed floating on wind · A flower attracting insects
- You show the group a stem cutting that grew roots and became a new plant. What is this an example of?
  - **Asexual reproduction**
  - New wrong: Sexual reproduction · Cross-pollination · Seed germination
  - Was: Sexual reproduction · Pollination only · Seed dispersal
- A visitor asks what a potato “eye” can do when planted. What do you say?
  - **Grow into a new potato plant**
  - New wrong: Make pollen for potato flowers · Turn into a seed in the soil · Grow roots that feed the old plant
  - Was: Make pollen for flowers · Turn into a seed · Attract pollinators
- Which is an example of asexual reproduction?
  - **A spider plant growing baby plantlets**
  - New wrong: A bee carrying pollen to a flower · A seed forming after pollination · A fruit forming from a pollinated flower
  - Was: A bee carrying pollen · A seed forming after pollination · A fruit forming from a flower
- A farmer has a strawberry plant with perfect, sweet berries. Why might she grow new plants from its runners instead of seeds?
  - **Runners make copies with the same traits**
  - New wrong: Runners mix in traits from other plants · Seeds make copies that are exactly the same · Runners grow fruit faster than any seed
  - Was: Runners make plants with new traits · Seeds always make identical copies · Runners need pollinators to work
- A visitor asks for one downside of asexual reproduction. What do you explain?
  - **One disease can harm every copy**
  - New wrong: It needs two parents to work · It takes many years to make one plant · It can only happen in a greenhouse
  - Was: It always needs two parents · It cannot make new plants · It only works for trees
- A gardener sets a succulent leaf on soil, and it grows roots and a new plant. What does this show?
  - **Some plants can grow from body parts**
  - New wrong: A leaf is really a kind of seed · Succulents need pollen to make leaves · The plant reproduced sexually
  - Was: Leaves are a kind of seed · Succulents need pollen to grow · The plant reproduced sexually
- Onions and tulips grow new bulbs underground from one parent bulb. What kind of reproduction is this?
  - **Asexual reproduction**
  - New wrong: Sexual reproduction · Cross-pollination · Seed dispersal
  - Was: Sexual reproduction · Pollination · Seed dispersal
- A kid asks if one plant can use both seeds and runners. What do you say?
  - **Yes, strawberries do both**
  - New wrong: No, a plant picks just one way · Yes, but just trees can do both · No, runners stop it making seeds
  - Was: No, plants use only one way · Only trees can do both · Only animals can do both
- In a field of identical banana plants, 90% got sick from one fungus. In a mixed field grown from seeds, 20% got sick. Which explanation fits best?
  - **Identical plants share the same weakness**
  - New wrong: Plants grown from seeds cannot get sick · The fungus prefers fields with mixed plants · Banana plants in the mixed field were older
  - Was: Seeds always prevent disease · The fungus only attacks mixed fields · Banana plants cannot get sick
- Why can asexual reproduction help a plant spread quickly in a good habitat?
  - **It needs no partner or pollinator**
  - New wrong: It makes plants that are larger · It mixes traits from two parents · It makes seeds that travel farther
  - Was: It always makes larger plants · It mixes traits from two parents · It only happens in winter

## Sexual reproduction

- A visitor asks what sexual reproduction in flowering plants involves. What do you explain?
  - **Pollen and egg cells combining**
  - New wrong: One parent making a copy of itself · A cutting growing new roots · Runners spreading across the soil
  - Was: One parent making a copy · A cutting growing roots · Runners spreading
- A kid asks what “pollination” means. What do you say?
  - **Moving pollen to the female part of a flower**
  - New wrong: A seed growing its first roots in the soil · Water moving from the roots up to the leaves · A leaf using sunlight to make food for it
  - Was: A seed growing roots · Water entering a root · A leaf making food
- A parent asks why sexual reproduction makes baby plants that look a little different from each other. What is the reason?
  - **Offspring inherit traits from two parents**
  - New wrong: Offspring copy the traits of one parent · The weather changes the seeds as they grow · Each seed is made by a different flower
  - Was: Offspring copy one parent exactly · No genes are involved · Seeds never form
- A visitor asks what is inside a seed. Which answer is best?
  - **A tiny plant and stored food**
  - New wrong: Pollen and sweet nectar · A small flower and fruit · Water, air, and a root
  - Was: Only water and air · Pollen and sweet nectar · A small flower and fruit
- A flower’s petals fall off and a pod starts to swell. What is most likely happening?
  - **Seeds are forming inside**
  - New wrong: The plant is about to die · New roots are forming there · Pollen is being made inside
  - Was: The plant is dying · Roots are forming · Pollen is being made
- A visitor asks for one benefit of sexual reproduction. What is the best answer?
  - **Variety helps some offspring survive**
  - New wrong: Offspring are copies of one parent · Plants can make seeds without pollen · Offspring grow faster than their parents
  - Was: Offspring are always identical · Only one parent is ever needed · No pollen is needed at all
- A red-flowered plant is crossed with a white-flowered plant. Of 40 offspring: 22 pink, 10 red, 8 white. What does this show?
  - **Offspring can differ from both parents**
  - New wrong: Offspring copy one parent most of the time · Flower color is not passed on to offspring · The plant reproduced asexually this time
  - Was: All offspring copy one parent · Only one parent passed on traits · The plant reproduced asexually

## Seed dispersal

- A squirrel buries acorns and forgets some. How does this help the oak tree?
  - **Some acorns grow in new places**
  - New wrong: The acorns turn into new leaves · The squirrel helps water the tree · The tree makes fewer acorns next year
  - Was: The acorns turn into leaves · The squirrel waters the tree · The tree stops making acorns
- A seed has a hard, waterproof coat and floats. Where would it most likely spread?
  - **Along rivers and coasts**
  - New wrong: On dry mountaintops · Stuck in animal fur · Right under its parent
  - Was: Only on mountaintops · Inside animal fur · Only under its parent
- Students test how far different seeds travel in wind from a fan. What should stay the same for every seed?
  - **Drop height and fan speed**
  - New wrong: The type of seed tested · The distance each seed goes · The shape of each seed
  - Was: The type of seed · The distance traveled · The seed’s shape
- Why do many fruits change from green to bright red when ripe?
  - **To show animals seeds are ready**
  - New wrong: To keep hungry animals away · To catch more of the wind · To help the fruit float on water
  - Was: To keep hungry animals away · To catch more of the wind · To help the fruit float
- A student claims animals that eat fruit help plants spread. Which evidence best supports this?
  - **Seeds in droppings sprout far away**
  - New wrong: Animals also eat many plant leaves · Fruit rots on the ground if not eaten · Some animals dig up roots to eat them
  - Was: Animals also eat many leaves · Fruit rots if nobody eats it · Some animals dig up roots

## Digestion in humans

- A visitor asks what the whole digestive system is for. What is its main job?
  - **Break food down so nutrients can be absorbed**
  - New wrong: Pump blood that carries oxygen to the cells · Take in oxygen and get rid of carbon dioxide · Send signals from the brain to the muscles
  - Was: Pump blood · Exchange gases · Send nerve signals
- At the giant teeth, a visitor asks what chewing does. What do you explain?
  - **Breaks food into smaller pieces**
  - New wrong: Absorbs the nutrients from food · Makes bile that breaks down fat · Removes extra water from waste
  - Was: Absorbs all nutrients · Makes bile · Removes water from waste
- Your group reaches the stomach model. How does the stomach help digestion?
  - **Mixing food with acid and enzymes**
  - New wrong: Absorbing most of the water from food · Making new red blood cells · Filtering oxygen out of the air
  - Was: Absorbing most water · Making blood cells · Filtering oxygen
- A kid asks what the tongue does during digestion. What do you say?
  - **Moves food and helps swallowing**
  - New wrong: Makes the acid used by the stomach · Absorbs water from food you chew · Makes bile that helps digest fat
  - Was: Makes acid for the stomach · Absorbs water from food · Makes bile to digest fat
- Chewing is mechanical digestion. Which is an example of chemical digestion?
  - **Saliva breaking down starch**
  - New wrong: Teeth grinding up food · The tongue moving food · Swallowing a large bite
  - Was: Teeth grinding up food · The tongue moving food · Swallowing a big bite
- When the stomach churns and squeezes food, what kind of digestion is it?
  - **Mechanical digestion**
  - New wrong: Chemical digestion · Absorption of nutrients · Blood circulation
  - Was: Nutrient absorption · Waste elimination · Blood circulation
- A kid notices a cracker starts to taste sweet after long chewing. What explains this?
  - **Saliva breaks starch into sugar**
  - New wrong: Teeth add sugar to the food · The tongue makes extra sugar · Air turns the starch to sugar
  - Was: Teeth add sugar to food · The tongue makes sugar · Air turns starch into sugar
- A visitor asks how food moves down the esophagus, even when you lie down. What do you explain?
  - **Muscles squeeze it along in waves**
  - New wrong: Gravity pulls it down to the stomach · Saliva pushes the food down the tube · The stomach sucks the food downward
  - Was: Gravity is the only force · Saliva pushes the food down · The stomach sucks it down

## The intestines

- You point to the tiny finger-like villi on the wall. Why does the small intestine have them?
  - **They increase surface area for absorption**
  - New wrong: They crush food into a soft paste first · They make the acid that breaks down food · They store waste until it leaves the body
  - Was: They crush food · They make acid · They store waste
- What does the pancreas send to the small intestine?
  - **Digestive enzymes**
  - New wrong: Saliva and mucus · Stomach acid · Red blood cells
  - Was: Saliva · Stomach acid · Blood cells
- A kid asks what helpful bacteria in the large intestine do. What do you say?
  - **Break down some leftover food**
  - New wrong: Make acid for the stomach · Grind food into smaller pieces · Carry oxygen to the body’s cells
  - Was: Make acid for the stomach · Grind food into pieces · Carry oxygen to cells
- A visitor asks what bile does in the small intestine. What do you explain?
  - **Breaks fat into small drops**
  - New wrong: Absorbs water from the food · Kills bacteria in the food · Turns starch into simple sugar
  - Was: Absorbs water · Kills all bacteria · Turns starch into sugar
- After the large intestine absorbs water, where does the leftover waste go?
  - **To the rectum to leave the body**
  - New wrong: Back up into the small intestine · Into the blood to be cleaned · Back to the stomach to be digested
  - Was: Back to the small intestine · Into the blood · Back to the stomach
- A person has very watery waste. Which organ is most likely not doing its job well?
  - **Large intestine**
  - New wrong: Esophagus · The stomach lining · Gallbladder
  - Was: Esophagus · Mouth · Liver
- An illness flattens the villi in the small intestine. What would most likely happen?
  - **Fewer nutrients would be absorbed**
  - New wrong: More water would be absorbed · Food would be chewed more slowly · The stomach would make less acid
  - Was: More water would be absorbed · Food would be chewed better · The stomach would shrink
- Lab samples show protein is only partly broken down in the stomach, but protein, fat, and starch are fully broken down in the small intestine. Which conclusion fits?
  - **Most digestion finishes in the small intestine**
  - New wrong: The stomach completes the digestion of these foods · The small intestine absorbs but does not digest · Protein digestion is finished before the stomach
  - Was: The stomach finishes all digestion · The small intestine does no digestion · Only the mouth breaks down protein

## Human digestive system

- A kid asks what the esophagus does. What do you explain?
  - **Moves food from the mouth to the stomach**
  - New wrong: Absorbs nutrients from food into the blood · Makes bile that helps break down fats · Stores waste until it leaves the body
  - Was: Absorbs nutrients · Makes bile · Stores waste
- A visitor asks how the digestive system and circulatory system work together. What do you say?
  - **The blood carries absorbed nutrients to cells**
  - New wrong: Blood breaks down food while it is in the stomach · The heart pushes food through the intestines · The stomach pumps blood out to the rest of the body
  - Was: Blood digests food in the mouth · They are unrelated · The stomach pumps blood
- A visitor asks why we need a digestive system at all. What do you say?
  - **Cells need small nutrient pieces**
  - New wrong: Food is already small enough for cells · It makes new blood cells from food · It controls how fast we breathe
  - Was: Food is already small enough · It makes blood cells · It controls breathing
- Fiber is not digested. Why is it still useful?
  - **It helps waste move through**
  - New wrong: It gives the body the most energy · It is turned into new muscle · It is absorbed into the blood
  - Was: It gives the most energy · It turns into muscle · It is absorbed into blood
- Which systems deliver the oxygen that digestive organs need?
  - **Respiratory and circulatory**
  - New wrong: Skeletal and muscular · Nervous and skeletal · Digestive and immune
  - Was: Skeletal and muscular · Nervous and skeletal · Digestive system alone
- A person’s pancreas stops making enzymes. Which problem is most likely?
  - **Food is not fully broken down**
  - New wrong: Food cannot be swallowed · Teeth stop grinding food · The stomach stops making acid
  - Was: Food cannot be swallowed · Teeth stop working · The mouth absorbs no water
- A visitor asks how the nervous system helps digestion. What do you explain?
  - **It signals muscles to move food**
  - New wrong: It absorbs the nutrients from food · It makes the bile that breaks down fat · It stores the waste until it leaves
  - Was: It absorbs the nutrients · It makes bile for fats · It stores extra waste
- Which pair shows mechanical digestion and then chemical digestion?
  - **Teeth chewing, then enzymes acting**
  - New wrong: Enzymes acting, then teeth chewing · Absorption, then teeth chewing · Water absorbed, then enzymes acting
  - Was: Enzymes acting, then absorption · Absorption, then chewing · Water absorbed, then chewing
- A student claims the small intestine is built for absorption. Which evidence best supports this?
  - **It is long and lined with villi**
  - New wrong: It sits right next to the stomach · It is shaped like a long tube · It contains some helpful bacteria
  - Was: It is next to the stomach · It is shaped like a tube · It contains some bacteria

## Seed dispersal

- A visitor asks why it matters if seeds travel away from the parent plant. What do you explain?
  - **Seeds can grow away from the crowded parent plant**
  - New wrong: Seeds near the parent get more of its water and food · Seeds that stay close need less sunlight · Seeds that move away stay dormant longer
  - Was: Seeds always grow faster in the shade of the parent · It removes the need for water · It prevents germination

## Cell parts (apply)

- A runner on your tour asks about muscle cells, which need lots of energy. Which part would they have many of?
  - **Mitochondria**
  - New wrong: Chloroplasts · Cell walls · Vacuoles
  - Was: Chloroplasts · Cell walls · Seeds
