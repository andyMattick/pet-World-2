# Hands-on Biology (Oct 27, 2026)

The owner asked to make Biology more hands-on, with at least one hands-on activity every week. There are three kinds.

## 1. 🔬 This week's experiment (`src/shared/handsOn.js`)

- **The plan row:** the daily plan has one row for the week, "🔬 Hands-on Biology this week: …". It turns ✅ once she sends one experiment or nature journal page that week (Monday to Sunday). It shows only while a Biology unit is open.
- **The week's pick:** `weekHandsOn` chooses the next experiment she hasn't sent from her current Biology unit, then any experiment she hasn't sent. After all 23 are done, it picks the 🌿 Nature Journal, which can be done every week.
- **On the unit page:** one small “This week’s lab” card (Oct 30, 2026); every experiment is in the 🔬 Science Lab (see “The Science Lab” below), so she can still do more than one in a week.

**The experiments.** Each one has what you need, a safety line, steps, and three lab notes: predict, what happened, and explain.

| Unit | Lesson | Experiments |
|---|---|---|
| Biology 1 | Cells | 🧅 Onion Skin Cells, 🍮 Edible Cell Model, 🍓 Strawberry DNA |
| Biology 1 | Plants | 🫘 Bean in a Bag, 🌸 Flower Dissection, 🥬 Celery Food Coloring |
| Biology 1 | Digestion | 🛍️ Stomach in a Bag, 🍘 Chew a Cracker, 📏 How Long Are Your Intestines? |
| Biology 2 | Traits | 👪 Family Traits Survey, 🔍 Fingerprint Detective |
| Biology 2 | Growth | 🥔 Potato Sprouts, 🧂 Salty Seeds, 🍞 Bread Mold Race |
| Biology 3 | Photosynthesis | 🫧 Leaf Bubbles in the Sun, 🍃 The Leaf in the Shade |
| Biology 3 | Food and energy | 🥬 Red Cabbage Breath Test |
| Biology 4 | Chromosomes and the cell cycle | 🧬 Pipe-Cleaner Mitosis |
| Biology 4 | Meiosis and reproduction | 🧦 Sock Chromosomes: Meiosis on the Floor |
| Biology 4 | Fertilization, development, and life cycles | 🔎 Life Cycle Hunt |
| Biology 5 | Chromosomes | 🧦 Sock Chromosome Pairs |
| Biology 5 | Mutations | 📝 Copy-Machine Mutations |
| Biology 5 | Reproduction and genetic variation | 🫘 Bean Bag Babies |

**Sending it.**
- She writes all three notes, with at least 3 words each. Signed in, she also adds 1 to 3 photos.
- The photos are shrunk to JPEGs, the same as outside work.
- **Send to a grown-up** saves it as outside work (Biology). It goes to the grown-up's outside-work list with the photos.
- She gets +5 coins, and a 🔬 line goes in the day log (Ledger, Science).
- "Save my notes" keeps a draft in `S.handsOn.entries`.

**Saved as:** `S.handsOn.entries[key] = {id, answers{predict, observe, explain}, minutes, sentAt, outsideId, week}`. The key is the experiment id, or `nature:<week>` for the journal.

## 2. 🧪 On-screen labs (`src/game/scienceSims.js`)

These work like the Unit 2 labs. Each one has missions, then two "What did you find?" questions. The first time she finishes a lab, she gets +15 coins and a 🧪 line in the log.

- **🧫 Build-a-Cell** (Biology 1, Cells).
  - She builds an animal cell (4 parts), then a plant cell (7 parts).
  - Each step shows a part's job, and she picks the part from all 7.
  - Picking a plant-only part for the animal cell explains why it doesn't belong.
- **🐶 Punnett Square Puppy Lab** (Biology 2, Traits).
  - B is brown fur, which is dominant; b is white.
  - She picks the parents, fills in the 4 boxes, and checks her square. Wrong boxes turn red.
  - Then she raises a litter of 12 to compare with her prediction.
  - Missions:
    - fill in a square with no mistakes
    - two brown parents who can have a white puppy (both Bb)
    - one white parent and all brown puppies (BB × bb)
- **🕸️ Meadow Food Web** (Biology 2, Growth).
  - She first draws the web by tapping what each of 6 animals eats.
  - Then she takes one living thing away. The diagram and a list show who goes up and who goes down.
  - The model is `removeEffect`: what it ate goes up, its eaters go down, and the change passes along the web.
  - Missions:
    - draw the web
    - make the grasshoppers boom
    - find the living thing whose loss hurts the most (the grass)

## 🔬 The Science Lab (Oct 30, 2026)

Andy: “if she goes to another unit, will the labs change or carry over? Can we make a lab unit that tells her to do 1 per week instead of cramming them all in unit 1?” Before this, each Biology unit page listed all of its labs (9 in Unit 1), which looked like homework to finish before the unit test.

- **Where:** a 🔬 Science Lab tile in the Biology class (6th grade), right after the open Biology units. It shows this week’s ⭐ or “✅ This week’s lab is done”. It opens with `data-open="scienceLab"` (`renderScienceLab` in `src/game/game.js`).
- **Not a unit.** It is not in `BUILDINGS`, like the Reading Log, Arcade, Art Studio and Bible. No quizzes, test, Khan link, test gate, stickers or unlock chain, so the unit counts, `prevBuilding`/`nextBuilding`, the teacher report and verify are unchanged.
- **On the page:**
  - the rule in one line: one lab a week; the ⭐ follows the unit she’s on; finished labs stay finished when she moves to the next unit; any lab, any time
  - **⭐ This week’s lab**: the weekly pick (`handsOnPick` → `weekHandsOn`: the first unsent lab of her current Biology unit, then any unsent lab, then the Nature Journal). After she sends one that week it says “✅ This week’s is done!” and names next week’s ⭐.
  - a **shelf per unit** (Units 1 to 5, in order) with the lesson, time and status of each lab (Not started, Started, ⏳ Sent, ✅ Checked, 🔁 Fix it) and Start / Keep going / Open. Her current unit says “📍 Your unit now”; a unit she hasn’t opened says “Goes with Unit N”, and its labs stay open (labs never gate anything); a passed unit says “Unit done”.
  - **🌿 Any week**: the Nature Journal.
- **Carry over:** labs are saved by id (`S.handsOn`), not by unit, so a sent lab stays ✅ after she moves on. When her current unit changes (`nextUnit('biology')`: the first open unit whose test isn’t passed), the ⭐ moves to that unit’s first unsent lab.
- **Unit pages** show one small card instead of the list: “🔬 This week’s lab: …” (or ✅ done), how many of the unit’s labs are done, a Start button for the ⭐ and a 🔬 Science Lab button (`handsOnUnitCardHTML`). The on-screen labs (🧪 Build-a-Cell, Punnett Puppy Lab, Meadow Food Web, Life Cycle Lab, Barn Breeder, Greenhouse Keeper) stay on their unit pages.
- **Today’s plan** row is unchanged: Go opens the week’s lab directly. The experiment page has “Back to the Science Lab” and “Biology unit” buttons.
- **Time:** the Science Lab and the experiment pages count as Science time for her current unit (`course:<bio unit>:🔬 Science Lab` and `course:<bio unit>:🔬 <lab>` in the day log). Room: `scienceLab` in `src/game/rooms.js` (lab tiles, test tubes, her pets visit).

## Tested

Playwright at 375 px:
- the plan row, the experiment page, the note and photo checks, sending, the unit page, the plan ✅, and next week's pick
- all three labs through every mission, the wrong-answer feedback, no sideways scrolling, and the save after a reload
- the Science Lab (Oct 30): the Biology class tile, the ⭐ and all 5 shelves plus the Nature Journal, sending a lab from the ⭐ (+5 coins, ✅ for the week), the Unit 1 page's one card, and passing Unit 1's test moving the ⭐ to a Unit 2 lab while the sent Unit 1 lab stays sent; no sideways scrolling, no page errors
