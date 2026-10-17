# History activities made in the app (ROADMAP F12)

**Goal:** hands-on History activities like the 🎨 Cave Painting Studio, where the student makes or investigates something and then explains it like a historian. Each one sits next to its unit's project, is open from the start, and is checked by a grown-up the same way projects are (sent, then verified or sent back).

**Owner decisions so far:**
- The dig is about **famous ancient finds**: she uncovers them, then works out where each came from by **tapping the place on a map**. One dig site per unit, so it repeats with each unit, and it pairs with the museum curator and the timeline sort.
- A **🦖 dinosaur fossil dig** is a bonus level in History Unit 1, clearly labeled "Before History" (fossils, not artifacts).
- **Scribe School** covers four kinds of writing: cuneiform on clay, hieroglyphs on papyrus, Shang oracle bones, and Greek letters.
- The **forager game** (gather enough to settle, farm and trade) and the **chase game** (original, not Carmen Sandiego) may be built outside this repo by the owner.

## Build order

1. **⛏️ Archaeology Dig (Units 1–2, then every unit).** Find ancient items, use the clues to work out where they came from, and tap it on the map. Repeatable by unit; pair it with the museum curator and the timeline sort. Reuses the cave painting's canvas and practices evidence skills.
2. **✍️ Write like a scribe (Unit 3).** Reuses the drawing tool, so it's quick to build. A natural sequel to the cave painting.
3. **🗺️ The Lost Treasures Chase.** The biggest and most replayable of the three; build it once she reaches Units 4–5. A treasure is stolen; clues about goods, landmarks and beliefs point to the next city on a map; three wrong guesses and the trail goes cold.

## All the ideas, by unit

- **Unit 1, Origins:** 🏛️ *Museum curator.* She arranges 5 artifacts into an exhibit and writes the label for each one. Practices sourcing and explaining.
- **Unit 2, Early Humans:** 🏹 *Forager or farmer for a day.* She makes choices (hunt, gather, plant, store food, move camp) and sees the tradeoffs over "seasons." Ties into the existing Unit 2 project question.
- **Unit 3, Early Agrarian Societies:**
  - 🌊 *Build a river city.* Place the river, fields, granary, temple and walls on a map, and explain why each goes where it does.
  - ✍️ *Write in cuneiform or hieroglyphs* with the drawing tool (Scribe School, build order 2).
- **Unit 4, Empires and Belief Systems:**
  - 🪙 *Coin designer.* Draw a coin for an emperor and explain the symbols.
  - 🛣️ *Road builder.* Connect an empire's cities and see how roads help trade, armies and the spread of beliefs.
- **Unit 5, Regional Webs:** the 🗺️ chase game fits best here, with 🐫 *Silk Road trading*: buy low, sell high, and watch ideas and diseases travel along with the goods.
- **Unit 6, The First Global Age:** ⛵ *Plan a voyage.* Choose supplies, route and season, and see what happens.
- **Any unit:**
  - 📅 *Timeline sort.* Drag events into order. Quick, and good for review.
  - 🔍 *Primary source detective.* A short source with questions like "Who made this? Why? What's missing?"

## ⛏️ Archaeology Dig: plan

**Where:** History Unit 2 (Early Humans), as a project next to "Forager or Farmer? Evidence Case", open from the start. (It also fits the end of Unit 1, which is about evidence; Unit 2 gives it real sites.)

**Round 1, the dig (about 10 minutes):**
- A dig site drawn as a 6 × 6 grid of soil squares over a hidden layout. Tap a square with the brush tool to clear it a little at a time (2 to 3 taps per square), so it feels like careful work, not a race.
- Hidden in the site: 6 to 8 artifacts from one real kind of place, for example a forager camp (hand axe, scraper, burned bones by a hearth, shell beads, a bone needle) or an early farming village (grinding stone, sickle blade, pottery shard, seeds, a mud-brick corner).
- Each find opens a short card: what it is, what it's made of, and a drawing. She records it in a field notebook: the square (like C4) and a guess at what it was used for.
- Two "trap" finds teach care: a modern bottle cap near the surface (it doesn't belong to the site) and a find that needs its layer noted (deeper is older).

**Round 2, the report (sent to a grown-up):**
1. Which finds were near each other, and what might people have done there? (Pick a cluster on the map.)
2. Forager camp or farming village? Give three pieces of evidence.
3. One thing these finds **can't** tell us about these people (beliefs, names, language, feelings), and why.
4. Why do archaeologists record exactly where each thing was found, instead of just collecting the objects?

**Checking:** sent to the teacher app like other projects; the grown-up verifies it or sends it back. Written answers use the existing project review.

**Built from what exists:** the project framework (`HISTORY_PROJECTS`, steps, review states); a new step kind `kind:'dig'` for the grid (the same pattern as `kind:'draw'`); the notebook is stored in the project's answers. No database change.

**Size:** about the cave painting's size: one new step kind, one site layout per variant (start with the forager camp), and the four report questions.

**Questions before building:** which site first (forager camp or farming village); whether finishing the dig gives a sticker or coins; and whether Caleb's grade needs an easier version (fewer squares, picture choices instead of writing).
