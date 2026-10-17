// Biology Unit 1: clean up the answer choices (docs: Pet World Question Bank Roadmap, quality pass, October 2026).
// Run from the repo root:  node docs/bio1-cleanup.mjs
// What changes: only the WRONG answer choices of 88 questions, so the right answer is no longer the longest choice
// and wrong answers no longer give themselves away with words like "only", "always" or "never". Prompts, the right
// answers, their order and the difficulty tags stay the same, so teacher hides, edits and miss rates stay attached.
// One exception: "Pollen reaches another flower's pistil" becomes "Pollen reaches a flower's pistil", because
// self-pollinating plants make seeds too (found by the blind review).
// Every question is checked first; if any one can't be found exactly once, nothing is written. Running it twice does nothing.
import fs from 'node:fs';

const FILE = 'src/shared/questionBanks.js';
const FIXES = [
{
"skill": "cellsOrganisms",
"prompt": "A parent asks you to put these in order from smallest to largest. Which sequence is right?",
"right": "Cell, tissue, organ, organ system",
"newRight": "Cell, tissue, organ, organ system",
"wrong": [
"Tissue, cell, organ, organ system",
"Cell, organ, tissue, organ system",
"Organ system, organ, tissue, cell"
]
},
{
"skill": "cellsOrganisms",
"prompt": "A kid asks what all living things have in common. What do you say?",
"right": "They are made of one or more cells",
"newRight": "They are made of one or more cells",
"wrong": [
"They each make their own food",
"They each have a brain and a heartbeat",
"They are each made of many cells"
]
},
{
"skill": "cellsOrganisms",
"prompt": "A visitor asks where new cells come from. What do you explain?",
"right": "From cells that already exist",
"newRight": "From cells that already exist",
"wrong": [
"From nonliving dust and dirt",
"From food the body breaks down",
"From tiny pieces of other tissues"
]
},
{
"skill": "cellsOrganisms",
"prompt": "A visitor asks how a one-celled amoeba stays alive without organs. What do you explain?",
"right": "Its one cell does every life job",
"newRight": "Its one cell does every life job",
"wrong": [
"It shares organs with other amoebas",
"It takes in energy without needing food",
"Its tissues do the jobs of organs"
]
},
{
"skill": "cellsOrganisms",
"prompt": "The stomach, intestines, and liver work together. What is a group of organs working together called?",
"right": "An organ system",
"newRight": "An organ system",
"wrong": [
"A tissue group",
"An organism",
"A population"
]
},
{
"skill": "cellsOrganisms",
"prompt": "A parent asks why a skin cell and a nerve cell look so different. What do you say?",
"right": "Each cell’s shape fits its job",
"newRight": "Each cell’s shape fits its job",
"wrong": [
"Nerve cells have more DNA than skin cells",
"Skin cells change shape as they get old",
"One of the two cells is not alive"
]
},
{
"skill": "cellsOrganisms",
"prompt": "Your group builds a model of a dog. Which level of organization comes right above “organ system”?",
"right": "Organism",
"newRight": "Organism",
"wrong": [
"Tissue",
"Organ",
"Population"
]
},
{
"skill": "cellsOrganisms",
"prompt": "A visitor asks why other body systems suffer if the digestive system stops working. What is the best answer?",
"right": "Body systems depend on each other",
"newRight": "Body systems depend on each other",
"wrong": [
"Each system is really just one organ",
"The digestive system controls the others",
"Cells can store years of nutrients"
]
},
{
"skill": "cellPartsU",
"prompt": "A grandparent asks which part decides what gets in and out of the cell. What is it?",
"right": "Cell membrane",
"newRight": "Cell membrane",
"wrong": [
"Chloroplast",
"Nucleus",
"Cytoplasm gel"
]
},
{
"skill": "cellPartsU",
"prompt": "A kid asks what the cell wall does. What do you explain?",
"right": "Gives the cell stiff support",
"newRight": "Gives the cell stiff support",
"wrong": [
"Makes food from sunlight",
"Stores the cell’s DNA",
"Controls what enters the cell"
]
},
{
"skill": "cellPartsA",
"prompt": "A visitor asks how a plant cell stays stiff and keeps its shape. Which part helps most?",
"right": "Cell wall",
"newRight": "Cell wall",
"wrong": [
"Mitochondria",
"Nucleolus",
"Cytoplasm"
]
},
{
"skill": "cellPartsA",
"prompt": "A cell’s membrane is damaged and harmful substances leak in. Which job has failed?",
"right": "Controlling what enters and leaves",
"newRight": "Controlling what enters and leaves",
"wrong": [
"Making food from sunlight",
"Storing and copying the cell’s DNA",
"Giving the cell stiff support"
]
},
{
"skill": "cellPartsA",
"prompt": "A plant droops after days without water. Which cell part has lost the most water?",
"right": "The central vacuole",
"newRight": "The central vacuole",
"wrong": [
"The cell nucleus",
"The cell membrane",
"The chloroplasts"
]
},
{
"skill": "cellPartsA",
"prompt": "Which cell would likely have the most chloroplasts?",
"right": "A cell from the top of a leaf",
"newRight": "A cell from the top of a leaf",
"wrong": [
"A cell from deep in a root",
"A cell from a human’s skin",
"A cell from the inside of a stem"
]
},
{
"skill": "cellPartsA",
"prompt": "A visitor asks why animal cells can change shape but plant cells mostly cannot. What do you explain?",
"right": "Animal cells lack a rigid cell wall",
"newRight": "Animal cells lack a rigid cell wall",
"wrong": [
"Animal cells lack a nucleus inside",
"Plant cells lack a cell membrane",
"Plant cells lack cytoplasm inside"
]
},
{
"skill": "cellPartsA",
"prompt": "A kid’s scraped knee heals as new skin cells form. Where do the new cells come from?",
"right": "Existing skin cells dividing",
"newRight": "Existing skin cells dividing",
"wrong": [
"Blood cells turning into skin",
"Cells from the bandage material",
"Bone cells moving up to the skin"
]
},
{
"skill": "cellPartsA",
"prompt": "Scientists remove the nucleus from a cell. What will the cell most likely be unable to do?",
"right": "Divide to make new cells",
"newRight": "Divide to make new cells",
"wrong": [
"Keep its cytoplasm inside",
"Hold its shape with a membrane",
"Take up space in the tissue"
]
},
{
"skill": "cellPartsA",
"prompt": "Chloroplast counts in a leaf: top-layer cells average 40, bottom-layer cells average 10. Which statement is best supported?",
"right": "Top cells likely get more light",
"newRight": "Top cells likely get more light",
"wrong": [
"Bottom cells likely make more food",
"Bottom cells have a larger nucleus",
"Top cells likely need less energy"
]
},
{
"skill": "plantSuccessU",
"prompt": "A kid asks what flowers are really for. What is the main purpose of a flower for many plants?",
"right": "To help the plant reproduce",
"newRight": "To help the plant reproduce",
"wrong": [
"To absorb water from the soil",
"To store food for the winter",
"To make the leaves grow faster"
]
},
{
"skill": "plantSuccessU",
"prompt": "A visitor sees a plant covered in seeds. Why can making many seeds improve reproductive success?",
"right": "More seeds may survive and grow",
"newRight": "More seeds may survive and grow",
"wrong": [
"Each seed needs less water to grow",
"The parent plant needs less sunlight",
"Seeds protect the parent from insects"
]
},
{
"skill": "plantSuccessU",
"prompt": "A visitor asks why many fruits taste sweet. What do you explain?",
"right": "Animals eat them and spread seeds",
"newRight": "Animals eat them and spread seeds",
"wrong": [
"Sweetness keeps animals away from them",
"Sugar helps the roots absorb water",
"Sugar makes the leaves turn greener"
]
},
{
"skill": "plantSuccessU",
"prompt": "A visitor asks why wind-pollinated grasses have small, plain flowers. What is the best explanation?",
"right": "They do not need to attract animals",
"newRight": "They do not need to attract animals",
"wrong": [
"They bloom at night when it is dark",
"Their pollen is too heavy for wind",
"Small flowers make more nectar for bees"
]
},
{
"skill": "plantSuccessU",
"prompt": "Which plant behavior helps reproductive success?",
"right": "Flowers opening when bees are out",
"newRight": "Flowers opening when bees are out",
"wrong": [
"Leaves turning brown in the winter",
"Roots growing deeper to find water",
"Stems bending toward the sunlight"
]
},
{
"skill": "plantSuccessU",
"prompt": "A hummingbird drinks nectar from a long red flower. How does this help the plant?",
"right": "The bird carries pollen to other flowers",
"newRight": "The bird carries pollen to other flowers",
"wrong": [
"The bird eats seeds and drops the shells",
"The bird drinks extra water for the plant",
"The bird cleans old petals off the flower"
]
},
{
"skill": "plantSuccessU",
"prompt": "Students counted bee visits in one hour. Flower A (bright, scented): 42 visits. Flower B (pale, no scent): 6 visits. Which claim is best supported?",
"right": "Bright, scented flowers attract more bees",
"newRight": "Bright, scented flowers attract more bees",
"wrong": [
"Bees choose pale flowers when they can",
"Scent keeps most of the bees away",
"Bees visit flowers in a random order"
]
},
{
"skill": "plantSuccessU",
"prompt": "One plant makes 1,000 tiny seeds. Another makes 5 large seeds full of stored food. Which statement is true?",
"right": "Both are strategies for reproductive success",
"newRight": "Both are strategies for reproductive success",
"wrong": [
"The tiny seeds are too small to grow into plants",
"The large seeds will grow into larger flowers",
"Small seeds are a sign the plant is unhealthy"
]
},
{
"skill": "plantSuccessA",
"prompt": "A kid sniffs a sweet flower full of nectar. Which structure-and-function idea do you explain?",
"right": "Features attract animals that carry pollen",
"newRight": "Features attract animals that carry pollen",
"wrong": [
"Nectar feeds the roots during dry weather",
"The smell keeps insects from eating leaves",
"Features protect the flower from cold nights"
]
},
{
"skill": "plantSuccessA",
"prompt": "A visitor asks how a hard seed coat helps a seed that has to survive winter. What do you say?",
"right": "It can protect the embryo until conditions improve",
"newRight": "It can protect the embryo until conditions improve",
"wrong": [
"It lets the seed grow quickly through the snow",
"It stores water that the roots use in winter",
"It helps the seed attract animals to carry it"
]
},
{
"skill": "plantSuccessA",
"prompt": "A grandparent asks what could hurt a plant’s chances of reproducing. Which change could lower its success?",
"right": "Loss of pollinators",
"newRight": "Loss of pollinators",
"wrong": [
"Healthy, rich soil",
"More bees nearby",
"Plenty of warm sunlight"
]
},
{
"skill": "plantSuccessA",
"prompt": "A bee picks up pollen from one flower. What must happen next for the plant to make seeds?",
"right": "Pollen reaches another flower’s pistil",
"newRight": "Pollen reaches a flower’s pistil",
"wrong": [
"The pollen falls into the soil and grows",
"The bee carries the pollen back to its hive",
"The pollen sticks to the flower’s leaves"
]
},
{
"skill": "plantSuccessA",
"prompt": "A gardener wants more tomatoes. Which action would most help pollination?",
"right": "Plant bee-attracting flowers nearby",
"newRight": "Plant bee-attracting flowers nearby",
"wrong": [
"Spray the plants with a strong bug killer",
"Pick off the flowers so fruit grows bigger",
"Cover the plants with plastic at night"
]
},
{
"skill": "plantSuccessA",
"prompt": "A plant grows beside a river, and its seeds have air pockets. How does this trait help it reproduce?",
"right": "Its seeds can float to new places",
"newRight": "Its seeds can float to new places",
"wrong": [
"Its seeds sink and stay near the parent",
"Its seeds attract more bees to the flower",
"Its seeds can soak up extra river water"
]
},
{
"skill": "plantSuccessA",
"prompt": "A flower has patterns that only bees can see. What is the best explanation?",
"right": "The patterns guide bees to nectar",
"newRight": "The patterns guide bees to nectar",
"wrong": [
"The patterns warn bees to stay away",
"The patterns help the petals catch sunlight",
"The patterns keep the nectar cool"
]
},
{
"skill": "plantSuccessA",
"prompt": "Which flower is most likely pollinated by bats?",
"right": "Large and pale, opens at night",
"newRight": "Large and pale, opens at night",
"wrong": [
"Small and green, blown by wind",
"Tiny and red, opens at noon",
"Bright blue, closes before sunset"
]
},
{
"skill": "plantSuccessA",
"prompt": "Students cover some apple blossoms with mesh bags so insects can’t reach them. Covered: 3 apples. Uncovered: 41 apples. What do the results show?",
"right": "Insect pollination increases fruit",
"newRight": "Insect pollination increases fruit",
"wrong": [
"Mesh bags make the apples bigger",
"Apples form fine without pollination",
"Insects damage most of the apple flowers"
]
},
{
"skill": "plantSuccessA",
"prompt": "Why might it help a bee-pollinated plant to bloom at the same time as others of its kind?",
"right": "More pollen gets shared between them",
"newRight": "More pollen gets shared between them",
"wrong": [
"Bees fly farther when flowers are rare",
"Flowers last longer with fewer neighbors",
"Its seeds will need less water to sprout"
]
},
{
"skill": "plantSuccessA",
"prompt": "A student claims large seeds with more stored food survive better in shade. Which evidence would best support this?",
"right": "Large seeds sprout more often in shade",
"newRight": "Large seeds sprout more often in shade",
"wrong": [
"Small seeds blow farther in the wind",
"Large seeds weigh more than small seeds",
"Shade plants grow fewer leaves than others"
]
},
{
"skill": "asexualPlants",
"prompt": "A visitor asks how new plants made by asexual reproduction compare to the parent. Offspring are:",
"right": "Genetically identical to the parent",
"newRight": "Genetically identical to the parent",
"wrong": [
"A mix of traits from two parents",
"A new species unlike the parent",
"Grown from pollen and egg cells"
]
},
{
"skill": "asexualPlants",
"prompt": "A kid asks you for an example of asexual reproduction in plants. Which do you point to?",
"right": "A strawberry plant sending out runners",
"newRight": "A strawberry plant sending out runners",
"wrong": [
"A bee carrying pollen between flowers",
"A seed forming after pollination",
"A bright flower attracting a butterfly"
]
},
{
"skill": "asexualPlants",
"prompt": "You show the group a stem cutting that grew roots and became a new plant. What is this an example of?",
"right": "Asexual reproduction",
"newRight": "Asexual reproduction",
"wrong": [
"Sexual reproduction",
"Cross-pollination",
"Seed germination"
]
},
{
"skill": "asexualPlants",
"prompt": "A visitor asks what a potato “eye” can do when planted. What do you say?",
"right": "Grow into a new potato plant",
"newRight": "Grow into a new potato plant",
"wrong": [
"Make pollen for potato flowers",
"Turn into a seed in the soil",
"Grow roots that feed the old plant"
]
},
{
"skill": "asexualPlants",
"prompt": "Which is an example of asexual reproduction?",
"right": "A spider plant growing baby plantlets",
"newRight": "A spider plant growing baby plantlets",
"wrong": [
"A bee carrying pollen to a flower",
"A seed forming after pollination",
"A fruit forming from a pollinated flower"
]
},
{
"skill": "asexualPlants",
"prompt": "A farmer has a strawberry plant with perfect, sweet berries. Why might she grow new plants from its runners instead of seeds?",
"right": "Runners make copies with the same traits",
"newRight": "Runners make copies with the same traits",
"wrong": [
"Runners mix in traits from other plants",
"Seeds make copies that are exactly the same",
"Runners grow fruit faster than any seed"
]
},
{
"skill": "asexualPlants",
"prompt": "A visitor asks for one downside of asexual reproduction. What do you explain?",
"right": "One disease can harm every copy",
"newRight": "One disease can harm every copy",
"wrong": [
"It needs two parents to work",
"It takes many years to make one plant",
"It can only happen in a greenhouse"
]
},
{
"skill": "asexualPlants",
"prompt": "A gardener sets a succulent leaf on soil, and it grows roots and a new plant. What does this show?",
"right": "Some plants can grow from body parts",
"newRight": "Some plants can grow from body parts",
"wrong": [
"A leaf is really a kind of seed",
"Succulents need pollen to make leaves",
"The plant reproduced sexually"
]
},
{
"skill": "asexualPlants",
"prompt": "Onions and tulips grow new bulbs underground from one parent bulb. What kind of reproduction is this?",
"right": "Asexual reproduction",
"newRight": "Asexual reproduction",
"wrong": [
"Sexual reproduction",
"Cross-pollination",
"Seed dispersal"
]
},
{
"skill": "asexualPlants",
"prompt": "A kid asks if one plant can use both seeds and runners. What do you say?",
"right": "Yes, strawberries do both",
"newRight": "Yes, strawberries do both",
"wrong": [
"No, a plant picks just one way",
"Yes, but just trees can do both",
"No, runners stop it making seeds"
]
},
{
"skill": "asexualPlants",
"prompt": "In a field of identical banana plants, 90% got sick from one fungus. In a mixed field grown from seeds, 20% got sick. Which explanation fits best?",
"right": "Identical plants share the same weakness",
"newRight": "Identical plants share the same weakness",
"wrong": [
"Plants grown from seeds cannot get sick",
"The fungus prefers fields with mixed plants",
"Banana plants in the mixed field were older"
]
},
{
"skill": "asexualPlants",
"prompt": "Why can asexual reproduction help a plant spread quickly in a good habitat?",
"right": "It needs no partner or pollinator",
"newRight": "It needs no partner or pollinator",
"wrong": [
"It makes plants that are larger",
"It mixes traits from two parents",
"It makes seeds that travel farther"
]
},
{
"skill": "sexualPlants",
"prompt": "A visitor asks what sexual reproduction in flowering plants involves. What do you explain?",
"right": "Pollen and egg cells combining",
"newRight": "Pollen and egg cells combining",
"wrong": [
"One parent making a copy of itself",
"A cutting growing new roots",
"Runners spreading across the soil"
]
},
{
"skill": "sexualPlants",
"prompt": "A kid asks what “pollination” means. What do you say?",
"right": "Moving pollen to the female part of a flower",
"newRight": "Moving pollen to the female part of a flower",
"wrong": [
"A seed growing its first roots in the soil",
"Water moving from the roots up to the leaves",
"A leaf using sunlight to make food for it"
]
},
{
"skill": "sexualPlants",
"prompt": "A parent asks why sexual reproduction makes baby plants that look a little different from each other. What is the reason?",
"right": "Offspring inherit traits from two parents",
"newRight": "Offspring inherit traits from two parents",
"wrong": [
"Offspring copy the traits of one parent",
"The weather changes the seeds as they grow",
"Each seed is made by a different flower"
]
},
{
"skill": "sexualPlants",
"prompt": "A visitor asks what is inside a seed. Which answer is best?",
"right": "A tiny plant and stored food",
"newRight": "A tiny plant and stored food",
"wrong": [
"Pollen and sweet nectar",
"A small flower and fruit",
"Water, air, and a root"
]
},
{
"skill": "sexualPlants",
"prompt": "A flower’s petals fall off and a pod starts to swell. What is most likely happening?",
"right": "Seeds are forming inside",
"newRight": "Seeds are forming inside",
"wrong": [
"The plant is about to die",
"New roots are forming there",
"Pollen is being made inside"
]
},
{
"skill": "sexualPlants",
"prompt": "A visitor asks for one benefit of sexual reproduction. What is the best answer?",
"right": "Variety helps some offspring survive",
"newRight": "Variety helps some offspring survive",
"wrong": [
"Offspring are copies of one parent",
"Plants can make seeds without pollen",
"Offspring grow faster than their parents"
]
},
{
"skill": "sexualPlants",
"prompt": "A red-flowered plant is crossed with a white-flowered plant. Of 40 offspring: 22 pink, 10 red, 8 white. What does this show?",
"right": "Offspring can differ from both parents",
"newRight": "Offspring can differ from both parents",
"wrong": [
"Offspring copy one parent most of the time",
"Flower color is not passed on to offspring",
"The plant reproduced asexually this time"
]
},
{
"skill": "seedDispersal",
"prompt": "A squirrel buries acorns and forgets some. How does this help the oak tree?",
"right": "Some acorns grow in new places",
"newRight": "Some acorns grow in new places",
"wrong": [
"The acorns turn into new leaves",
"The squirrel helps water the tree",
"The tree makes fewer acorns next year"
]
},
{
"skill": "seedDispersal",
"prompt": "A seed has a hard, waterproof coat and floats. Where would it most likely spread?",
"right": "Along rivers and coasts",
"newRight": "Along rivers and coasts",
"wrong": [
"On dry mountaintops",
"Stuck in animal fur",
"Right under its parent"
]
},
{
"skill": "seedDispersal",
"prompt": "Students test how far different seeds travel in wind from a fan. What should stay the same for every seed?",
"right": "Drop height and fan speed",
"newRight": "Drop height and fan speed",
"wrong": [
"The type of seed tested",
"The distance each seed goes",
"The shape of each seed"
]
},
{
"skill": "seedDispersal",
"prompt": "Why do many fruits change from green to bright red when ripe?",
"right": "To show animals seeds are ready",
"newRight": "To show animals seeds are ready",
"wrong": [
"To keep hungry animals away",
"To catch more of the wind",
"To help the fruit float on water"
]
},
{
"skill": "seedDispersal",
"prompt": "A student claims animals that eat fruit help plants spread. Which evidence best supports this?",
"right": "Seeds in droppings sprout far away",
"newRight": "Seeds in droppings sprout far away",
"wrong": [
"Animals also eat many plant leaves",
"Fruit rots on the ground if not eaten",
"Some animals dig up roots to eat them"
]
},
{
"skill": "digestionHumans",
"prompt": "A visitor asks what the whole digestive system is for. What is its main job?",
"right": "Break food down so nutrients can be absorbed",
"newRight": "Break food down so nutrients can be absorbed",
"wrong": [
"Pump blood that carries oxygen to the cells",
"Take in oxygen and get rid of carbon dioxide",
"Send signals from the brain to the muscles"
]
},
{
"skill": "digestionHumans",
"prompt": "At the giant teeth, a visitor asks what chewing does. What do you explain?",
"right": "Breaks food into smaller pieces",
"newRight": "Breaks food into smaller pieces",
"wrong": [
"Absorbs the nutrients from food",
"Makes bile that breaks down fat",
"Removes extra water from waste"
]
},
{
"skill": "digestionHumans",
"prompt": "Your group reaches the stomach model. How does the stomach help digestion?",
"right": "Mixing food with acid and enzymes",
"newRight": "Mixing food with acid and enzymes",
"wrong": [
"Absorbing most of the water from food",
"Making new red blood cells",
"Filtering oxygen out of the air"
]
},
{
"skill": "digestionHumans",
"prompt": "A kid asks what the tongue does during digestion. What do you say?",
"right": "Moves food and helps swallowing",
"newRight": "Moves food and helps swallowing",
"wrong": [
"Makes the acid used by the stomach",
"Absorbs water from food you chew",
"Makes bile that helps digest fat"
]
},
{
"skill": "digestionHumans",
"prompt": "Chewing is mechanical digestion. Which is an example of chemical digestion?",
"right": "Saliva breaking down starch",
"newRight": "Saliva breaking down starch",
"wrong": [
"Teeth grinding up food",
"The tongue moving food",
"Swallowing a large bite"
]
},
{
"skill": "digestionHumans",
"prompt": "When the stomach churns and squeezes food, what kind of digestion is it?",
"right": "Mechanical digestion",
"newRight": "Mechanical digestion",
"wrong": [
"Chemical digestion",
"Absorption of nutrients",
"Blood circulation"
]
},
{
"skill": "digestionHumans",
"prompt": "A kid notices a cracker starts to taste sweet after long chewing. What explains this?",
"right": "Saliva breaks starch into sugar",
"newRight": "Saliva breaks starch into sugar",
"wrong": [
"Teeth add sugar to the food",
"The tongue makes extra sugar",
"Air turns the starch to sugar"
]
},
{
"skill": "digestionHumans",
"prompt": "A visitor asks how food moves down the esophagus, even when you lie down. What do you explain?",
"right": "Muscles squeeze it along in waves",
"newRight": "Muscles squeeze it along in waves",
"wrong": [
"Gravity pulls it down to the stomach",
"Saliva pushes the food down the tube",
"The stomach sucks the food downward"
]
},
{
"skill": "digestionIntestines",
"prompt": "You point to the tiny finger-like villi on the wall. Why does the small intestine have them?",
"right": "They increase surface area for absorption",
"newRight": "They increase surface area for absorption",
"wrong": [
"They crush food into a soft paste first",
"They make the acid that breaks down food",
"They store waste until it leaves the body"
]
},
{
"skill": "digestionIntestines",
"prompt": "What does the pancreas send to the small intestine?",
"right": "Digestive enzymes",
"newRight": "Digestive enzymes",
"wrong": [
"Saliva and mucus",
"Stomach acid",
"Red blood cells"
]
},
{
"skill": "digestionIntestines",
"prompt": "A kid asks what helpful bacteria in the large intestine do. What do you say?",
"right": "Break down some leftover food",
"newRight": "Break down some leftover food",
"wrong": [
"Make acid for the stomach",
"Grind food into smaller pieces",
"Carry oxygen to the body’s cells"
]
},
{
"skill": "digestionIntestines",
"prompt": "A visitor asks what bile does in the small intestine. What do you explain?",
"right": "Breaks fat into small drops",
"newRight": "Breaks fat into small drops",
"wrong": [
"Absorbs water from the food",
"Kills bacteria in the food",
"Turns starch into simple sugar"
]
},
{
"skill": "digestionIntestines",
"prompt": "After the large intestine absorbs water, where does the leftover waste go?",
"right": "To the rectum to leave the body",
"newRight": "To the rectum to leave the body",
"wrong": [
"Back up into the small intestine",
"Into the blood to be cleaned",
"Back to the stomach to be digested"
]
},
{
"skill": "digestionIntestines",
"prompt": "A person has very watery waste. Which organ is most likely not doing its job well?",
"right": "Large intestine",
"newRight": "Large intestine",
"wrong": [
"Esophagus",
"The stomach lining",
"Gallbladder"
]
},
{
"skill": "digestionIntestines",
"prompt": "An illness flattens the villi in the small intestine. What would most likely happen?",
"right": "Fewer nutrients would be absorbed",
"newRight": "Fewer nutrients would be absorbed",
"wrong": [
"More water would be absorbed",
"Food would be chewed more slowly",
"The stomach would make less acid"
]
},
{
"skill": "digestionIntestines",
"prompt": "Lab samples show protein is only partly broken down in the stomach, but protein, fat, and starch are fully broken down in the small intestine. Which conclusion fits?",
"right": "Most digestion finishes in the small intestine",
"newRight": "Most digestion finishes in the small intestine",
"wrong": [
"The stomach completes the digestion of these foods",
"The small intestine absorbs but does not digest",
"Protein digestion is finished before the stomach"
]
},
{
"skill": "humanDigestion",
"prompt": "A kid asks what the esophagus does. What do you explain?",
"right": "Moves food from the mouth to the stomach",
"newRight": "Moves food from the mouth to the stomach",
"wrong": [
"Absorbs nutrients from food into the blood",
"Makes bile that helps break down fats",
"Stores waste until it leaves the body"
]
},
{
"skill": "humanDigestion",
"prompt": "A visitor asks how the digestive system and circulatory system work together. What do you say?",
"right": "The blood carries absorbed nutrients to cells",
"newRight": "The blood carries absorbed nutrients to cells",
"wrong": [
"Blood breaks down food while it is in the stomach",
"The heart pushes food through the intestines",
"The stomach pumps blood out to the rest of the body"
]
},
{
"skill": "humanDigestion",
"prompt": "A visitor asks why we need a digestive system at all. What do you say?",
"right": "Cells need small nutrient pieces",
"newRight": "Cells need small nutrient pieces",
"wrong": [
"Food is already small enough for cells",
"It makes new blood cells from food",
"It controls how fast we breathe"
]
},
{
"skill": "humanDigestion",
"prompt": "Fiber is not digested. Why is it still useful?",
"right": "It helps waste move through",
"newRight": "It helps waste move through",
"wrong": [
"It gives the body the most energy",
"It is turned into new muscle",
"It is absorbed into the blood"
]
},
{
"skill": "humanDigestion",
"prompt": "Which systems deliver the oxygen that digestive organs need?",
"right": "Respiratory and circulatory",
"newRight": "Respiratory and circulatory",
"wrong": [
"Skeletal and muscular",
"Nervous and skeletal",
"Digestive and immune"
]
},
{
"skill": "humanDigestion",
"prompt": "A person’s pancreas stops making enzymes. Which problem is most likely?",
"right": "Food is not fully broken down",
"newRight": "Food is not fully broken down",
"wrong": [
"Food cannot be swallowed",
"Teeth stop grinding food",
"The stomach stops making acid"
]
},
{
"skill": "humanDigestion",
"prompt": "A visitor asks how the nervous system helps digestion. What do you explain?",
"right": "It signals muscles to move food",
"newRight": "It signals muscles to move food",
"wrong": [
"It absorbs the nutrients from food",
"It makes the bile that breaks down fat",
"It stores the waste until it leaves"
]
},
{
"skill": "humanDigestion",
"prompt": "Which pair shows mechanical digestion and then chemical digestion?",
"right": "Teeth chewing, then enzymes acting",
"newRight": "Teeth chewing, then enzymes acting",
"wrong": [
"Enzymes acting, then teeth chewing",
"Absorption, then teeth chewing",
"Water absorbed, then enzymes acting"
]
},
{
"skill": "humanDigestion",
"prompt": "A student claims the small intestine is built for absorption. Which evidence best supports this?",
"right": "It is long and lined with villi",
"newRight": "It is long and lined with villi",
"wrong": [
"It sits right next to the stomach",
"It is shaped like a long tube",
"It contains some helpful bacteria"
]
},
{
"skill": "seedDispersal",
"prompt": "A visitor asks why it matters if seeds travel away from the parent plant. What do you explain?",
"right": "Seeds can grow away from the crowded parent plant",
"newRight": "Seeds can grow away from the crowded parent plant",
"wrong": [
"Seeds near the parent get more of its water and food",
"Seeds that stay close need less sunlight",
"Seeds that move away stay dormant longer"
]
},
{
"skill": "cellPartsA",
"prompt": "A runner on your tour asks about muscle cells, which need lots of energy. Which part would they have many of?",
"right": "Mitochondria",
"newRight": "Mitochondria",
"wrong": [
"Chloroplasts",
"Cell walls",
"Vacuoles"
]
}
];

let src = fs.readFileSync(FILE, 'utf8');
const start = src.indexOf('const BIO1_QUESTIONS = {'), end = src.indexOf('// Difficulty tags (1-3) for the original Biology Unit 1 questions');
if (start < 0 || end < start) { console.log('NOT APPLIED: could not find the Biology Unit 1 banks. Nothing was changed.'); process.exit(1); }
let block = src.slice(start, end);
const q = s => `'${s}'`, re = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const done = f => block.includes(`${q(f.prompt)},${[f.newRight, ...f.wrong].map(q).join(',')})`);
if (FIXES.every(done)) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const problems = [];
for (const f of FIXES) {
  if (done(f)) continue;
  if ([f.newRight, ...f.wrong].some(c => c.includes("'"))) { problems.push(`${f.skill}: a choice contains a straight apostrophe`); continue; }
  if (new Set([f.newRight, ...f.wrong].map(c => c.toLowerCase())).size !== 4) { problems.push(`${f.skill}: choices are not 4 different answers`); continue; }
  const pattern = new RegExp(`${re(q(f.prompt))},${re(q(f.right))},'[^']*','[^']*','[^']*'\\)`, 'g');
  const matches = block.match(pattern) || [];
  if (matches.length !== 1) { problems.push(`${f.skill} "${f.prompt.slice(0, 50)}…": found ${matches.length} times (expected 1)`); continue; }
  block = block.replace(pattern, `${q(f.prompt)},${[f.newRight, ...f.wrong].map(q).join(',')})`);
}
if (problems.length) { console.log('NOT APPLIED. Nothing was changed:\n  ' + problems.join('\n  ')); process.exit(1); }
fs.writeFileSync(FILE, src.slice(0, start) + block + src.slice(end));
console.log(`Done: ${FIXES.length} Biology questions now have cleaned-up answer choices.`);
