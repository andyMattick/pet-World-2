# Hands-on Biology (Oct 27, 2026)

The owner asked to make Biology more hands-on, with at least one hands-on activity every week. There are three kinds.

## 1. 🔬 This week's experiment (`src/shared/handsOn.js`)

- **The plan row:** the daily plan has one row for the week, "🔬 Hands-on Biology this week: …". It turns ✅ once she sends one experiment or nature journal page that week (Monday to Sunday). It shows only while a Biology unit is open.
- **The week's pick:** `weekHandsOn` chooses the next experiment she hasn't sent from her current Biology unit, then any experiment she hasn't sent. After all 23 are done, it picks the 🌿 Nature Journal, which can be done every week.
- **On the unit page:** the "Hands-on at home" cards show all the experiments for each lesson, so she can do more than one in a week.

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

## Tested

Playwright at 375 px:
- the plan row, the experiment page, the note and photo checks, sending, the unit page, the plan ✅, and next week's pick
- all three labs through every mission, the wrong-answer feedback, no sideways scrolling, and the save after a reload
