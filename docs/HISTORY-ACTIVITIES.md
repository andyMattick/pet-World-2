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

## ⛏️ Dig Sites: how it works (built)

- **Where:** a "⛏️ Dig" card on each History unit page (Units 1–4), plus the **🦖 Before History: Fossil Dig** bonus on Unit 1. Content lives in `src/game/historyData.js` (`DIG_SITES`, `DIG_PLACES`, the world map outline).
- **The dig:** a 6 × 5 grid of dirt. Tap or drag to brush; each square takes two layers. Six famous finds are hidden at random, plus one modern tin can (trash from today, which teaches that not everything in the ground belongs to the site).
- **Identify it:** each find shows a card with when it was made and a clue. She taps a place on a world map (the site's six places plus two others), then "That's my answer." A wrong answer gets a hint (which part of the world), then a second try; after that the answer is shown. Then a fact explains the find.
- **Museum shelf:** finds she has placed are listed under the dig, with ⭐ for first-try answers.
- **Coins (first time through each site only):** 5 for a first-try answer, 3 for a second try, 1 when shown, and 20 for finishing. She can dig a site again for practice.
- **Record:** finishing a site logs "Finished the … Dig: N of 6 placed on the first try" to the day log and Ledger. Time counts as History.
- **Sites:** Unit 1 Clues to the Past (Rosetta Stone, Lascaux, Blombos ochre, Ishango bone, Inca khipu, Sutton Hoo helmet); Before History (Sue the T. rex, the Fighting Dinosaurs, Archaeopteryx, Argentinosaurus, Mary Anning's ichthyosaur, Lucy); Unit 2 Early Humans (Olduvai hand axe, Clovis point, Göbekli Tepe, Jiahu flute, Jōmon pot, Ötzi's axe); Unit 3 River Valleys (Hammurabi's laws, Tutankhamun's mask, the unicorn seal, an oracle bone, an Olmec head, a Kerma beaker); Unit 4 Empires (Terracotta soldier, gold daric, Ashoka's lions, Pompeii bread, Antikythera mechanism, Dead Sea Scrolls).
- **To add a site** for a new unit: add an entry to `DIG_SITES` with its `course` and six finds; add any new places to `DIG_PLACES`.

## ✍️ Scribe School: how it works (built)

- **Where:** a card on the Unit 3 and Unit 4 pages. Four tabs: 🧱 cuneiform on a clay tablet (wedge stamps, spelled with the Ugaritic cuneiform alphabet), 📜 hieroglyphs on papyrus (black and red ink, one-sound signs), 🐢 oracle bone writing (pick picture signs to make a question, carve them, then "heat the bone" for cracks), 🏺 Greek letters on an ostrakon.
- Her name (or the signs she picked) shows as a key; "Show a tracing guide" draws the signs faintly on the surface.
- **Saving:** goes to the Art Studio gallery, so it can be framed and hung in the Pet Room; 10 coins the first time for each kind of writing, and it's logged to the day log.
- Hieroglyph and Ugaritic signs use the Noto fonts from Google Fonts (Windows also has them in Segoe UI Historic).

## Still to do

- Museum curator and timeline sort to pair with each dig site.
- Dig sites for Units 5–9 as they open.
