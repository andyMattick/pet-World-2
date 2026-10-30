# Biology Unit 4: Cell Division and Life Cycles (the Butterfly House)

The student is a tour guide at the Pet World Butterfly House (building `bioDivide`, course `bio4`). It opens after the
Biology Unit 3 test, like every unit. Everything here is built ahead of time. Nothing calls an AI while the student plays.

## Which Khan unit this follows

Khan's **Middle school biology** has no unit on cell division or life cycles (its units are Cells and organisms, Organism
growth and reproduction, Matter and energy in organisms, Interactions in ecosystems, Matter and energy in ecosystems,
Ecosystem dynamics, Inheritance and variation, and Natural selection). Khan teaches mitosis and meiosis in **High school
biology**. This unit follows the lessons of Khan's High school biology unit **Reproduction and cell division**, in order,
pitched for 6th grade (harder than the middle school units, on purpose), and adds a Pet World practice on life cycles and
metamorphosis, which Khan doesn't have as a lesson.

| Khan lesson (High school biology, Reproduction and cell division) | Pet World practice | Quiz |
|---|---|---|
| Chromosome structure and numbers | Chromosome structure and numbers (`chromosomes4`) | Quiz 1 (`bio4:quiz:cellcycle4`) |
| The cell cycle and mitosis | The cell cycle and mitosis (`mitosis4`) | Quiz 1 |
| Meiosis | Meiosis (`meiosis4`) | Quiz 2 (`bio4:quiz:sexrepro4`) |
| Types of reproduction | Types of reproduction (`reproTypes4`) | Quiz 2 |
| Fertilization and development | Fertilization and development (`development4`) | Quiz 3 (`bio4:quiz:lifecycle4`) |
| (Pet World) | Life cycles and metamorphosis (`lifeCycles4`) | Quiz 3 |

**Not confirmed (open question for Andy, `questions-butterfly.md` Q1):**
- Khan's pages need JavaScript, so the build sandbox could not open them. The lesson names above come from a published
  copy of Khan's unit list; the order inside the unit and Khan's quiz placement could not be checked. Pet World puts a quiz
  after every two practices, like Unit 2.
- Videos (`KHAN_VIDEOS.bio4`) come from Khan's Biology library cell division tutorials (Chromosomes, chromatids,
  chromatin; Interphase; Phases of mitosis; Mitosis; Phases of meiosis; Comparing mitosis and meiosis; Zygote
  differentiating into somatic and germ cells) and the middle school "Sexual and asexual reproduction" video. Only the
  "Mitosis" video and the middle school video addresses were confirmed. Run `npm run check-links` (it opens every link)
  and fix any that are gone; a teacher can also paste exact links in Lessons.
- Khan unit test (`KHAN_UNIT_TESTS.bio4`, KHAN-SETUP.md): Khan's High school biology unit **The cell cycle and
  differentiation** (the unit test is at the end of that page). Its exact test address could not be read.

## The unit

- 6 practices, 14 multiple-choice questions each (84; level 1: 18, level 2: 30, level 3: 36, so 43% at level 3), plus
  3 newer-type questions per practice (`TYPED_QUESTIONS.bio4`: sort, put in order, type the answer, select all, two-part,
  and a short answer each). Review list: `bio4-review.md`.
- Unit test: 4 questions per practice (24), pass at 20, plus the unit paragraph (follow the monarchs from one generation
  to the next with meiosis, fertilization, mitosis and the four stages).
- Quizzes and the test use the shared library code, so they get the 📇 review, the grown-up PIN and the test review.
- **Why it matters.** Each lesson opens with a true story: Walther Flemming naming mitosis after the "threads" in
  salamander cells (1882); why mules almost never have offspring (63 chromosomes); the monarch generations that return
  to Mexico without ever having been there. Each practice has a "Why care?" line.
- Role play (`ROLE_CARDS`): the Microscope Window, the Growth Lab, the Egg Lab (twice), the Butterfly House Garden and
  the Chrysalis Window (stage scenes `lab`, `greenhouse` and `garden`).
- 📇 Review first: 19 term cards (`TERM_CARDS.bio4`).
- Rewards (`LIBRARY_SETS`, docs/REWARDS.md): 🪱 Loamy the earthworm, 🪰 Zippy the hoverfly, 🪲 Scarab the beetle,
  🕷️ Webster the garden spider, 🧚 Flutter the garden fairy; 🪻 Lavender pots, 🎐 Wind chime, 🪷 Lotus pond,
  🔭 Butterfly-spotting scope, 🏵️ Golden rosette. 🦋 was already the Potion Lab's.

## 🦋 Life Cycle Lab (the unit's game)

A card at the bottom of the unit page opens it, and it is in the 🕹️ Arcade. See `LIFE-CYCLE-LAB.md`.

## 🔬 Hands-on and projects

- Hands-on at home (`src/shared/handsOn.js`, `HANDS-ON.md`): 🧬 Pipe-Cleaner Mitosis (lesson 1), 🧦 Sock Chromosomes:
  Meiosis on the Floor (lesson 2), 🔎 Life Cycle Hunt (lesson 3).
- Projects (sent to the teacher, same review flow as the other projects):

| Key | Title | Notes |
|---|---|---|
| `bio4` | Butterfly House Life Cycle Wheel | ends with a photo of a hand-drawn wheel with meiosis, fertilization and mitosis marked |
| `bio4lab` | Experiment: Mealworm Metamorphosis | about 3 weeks; warm vs cool containers, larvae, pupae and beetles counted every 3 days in a data table with a live chart. Safety in the summary (pet-store mealworms, air holes, wash hands, never release them). |

## Facts checked (October 2026)

- Human body cells have 46 chromosomes (23 pairs); eggs and sperm have 23. Dog 78, cat 38, potato 48, fruit fly 8,
  gorilla 48, horse 64, donkey 62, mule 63. Down syndrome: three copies of chromosome 21, 47 in most cells.
- Walther Flemming studied stained salamander cells and named mitosis (Greek for thread) in 1882.
- Dolly the sheep (born 1996) was cloned from an adult udder (mammary gland) cell nucleus.
- Monarchs: caterpillars eat milkweed (and almost nothing else) and store its toxins; 5 instars; the 5th molt uncovers the
  chrysalis, which hangs from a silk pad in a J shape; eggs hatch in about 3 to 5 days; the chrysalis lasts about 8 to
  15 days and turns clear about a day before the adult comes out. Eastern monarchs' fall generation flies up to about
  3,000 miles to central Mexico and lives about 8 months; summer adults live about 2 to 6 weeks.
- Black swallowtails: host plants in the carrot family (parsley, dill, fennel); young caterpillars look like bird
  droppings; older ones have an osmeterium; they pupate upright with a silk girdle and spend cold winters as a chrysalis.
- Painted ladies: host plants include thistles and mallows; caterpillars feed inside loose silk nests; they can't survive
  a hard freeze and many fly south in fall.
- Gulf fritillaries use passionflower; skipper caterpillars eat grasses. Newly hatched caterpillars usually eat their
  eggshell first. Inside the pupa, imaginal discs build the adult's wings, legs and eyes.
- Aphids reproduce asexually in summer and sexually in fall, laying eggs that overwinter. Ladybugs, mosquitoes, bees and
  flies have complete metamorphosis; grasshoppers, dragonflies and cockroaches have incomplete metamorphosis.

## Tested (Oct 30, 2026)

- `node scripts/verify.mjs`, `check-content` (0 warnings), `check-typed`, `check-links` (offline) pass; the bundle builds
  (esbuild stand-in for Vite). Changed TypeScript type-checked with a temporary tsconfig (no new errors). Andy still needs
  `npm run typecheck && npm run build` in Codespaces.
- In headless Chromium at 375 × 740 (local mode, unit opened): the Biology class page shows the Butterfly House, the
  unit page with its 3 lessons, videos, quizzes, test, projects, hands-on and game card; Quiz 1 starts in the test view
  (no hint or helper), the welcome reward (🪱 Loamy) appears in the room, the game pays coins and saves `S.lifecycle`.
- Content review: the test view without keys was solved item by item (not a truly blind second reviewer: no subagent was
  available in this build), and 3 items were fixed (see `bio4-review.md`).
