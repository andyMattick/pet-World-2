# History activities made in the app (ROADMAP F12)

**Goal:** hands-on History activities like the 🎨 Cave Painting Studio, where the student makes or investigates something and then explains it like a historian. Each one sits next to its unit's project, is open from the start, and is checked by a grown-up the same way projects are (sent, then verified or sent back).

**Owner decisions so far:** no dinosaurs in the History course (they are millions of years before people); an archaeology dig instead. The detective chase is an original game with its own thief and name, not Carmen Sandiego.

## Build order

1. **⛏️ Archaeology Dig (Units 1–2)**, below.
2. **𒀭 Write like a scribe (Unit 3):** a clay tablet (cuneiform wedges) or papyrus (hieroglyphs) background for the drawing step, with a key of signs to copy; write your name, then answer why writing mattered to early cities.
3. **🗺️ The Lost Treasures Chase (Units 4–5, then each later unit):** a treasure is stolen; clues about goods, landmarks and beliefs point to the next city on a map; three wrong guesses and the trail goes cold; catch the thief to finish the case. One case per unit, built from that unit's places and facts.

Later ideas: museum curator (Unit 1), forager or farmer for a day (Unit 2), build a river city (Unit 3), coin designer and road builder (Unit 4), Silk Road trader (Unit 5), plan a voyage (Unit 6), timeline sort and primary source detective (any unit).

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
