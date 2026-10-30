# 🦋 Life Cycle Lab (Biology Unit 4's game)

A standalone page at `public/arcade/life-cycle-lab/index.html`. It opens from a card at the bottom of the Biology Unit 4
page at the Butterfly House (`openLifeCycle`, `?from=bio4`) and from the 🕹️ Arcade (`life-cycle-lab` in `ARCADE_GAMES`,
`?arcadeRun=…`). Three rooms; each round is one room.

## 🐛 Raise a Butterfly (10 steps)

A random real butterfly each time: monarch, black swallowtail or painted lady, each with its own host plant, defense,
way of pupating and winter plan, all animated in SVG.

| # | Step | What she does |
|---|---|---|
| 1 | 🥚 Lay the egg | Pick the host plant from four of: milkweed, parsley and dill, thistle, passionflower, lawn grass. The butterfly flies to it and lays the egg. A wrong plant says whose host plant it is. |
| 2 | 🐣 Hatching day | The first meal (its eggshell). |
| 3 | 🍃 Grow, grow, grow | Feed and molt through 5 instars. The skin meter fills a different amount each bite; molt only when it is too tight (the old skin falls off), keep feeding when it isn't. Molting too early, feeding a too-tight caterpillar, or molting at full size are mistakes; done right with at most 1 mistake. |
| 4 | 🐦 A hungry bird | The species' real defense (milkweed toxins and warning stripes; bird-dropping look and the smelly osmeterium; a silk nest). |
| 5 | 😱 The food runs out | Move them to fresh host plant (not lettuce, sugar water, or pupating early). |
| 6 | 🪢 Time to pupate | Tap the 4 steps in order (J-hang from a silk pad, or upright in a silk girdle for the swallowtail); the 5th molt reveals the chrysalis. |
| 7 | 🔬 X-ray the chrysalis | What happens inside (imaginal discs build the adult). |
| 8 | ⏳ Watch the chrysalis | It turns clear: out within about a day. |
| 9 | 🦋 It's out! | Pump fluid into the wings and let them dry (the wings unfurl). |
| 10 | 🍂 The season changes | Monarchs migrate to Mexico, swallowtails overwinter as a chrysalis, painted ladies fly south. |

## 🔄 The Life Cycle Ring (6 rounds)

Six of: frog, grasshopper, ladybug, mosquito, cockroach, bean plant, chicken. Tap the stages around the ring in order (one
stage doesn't belong, like a pupa for a grasshopper), then name the kind: complete metamorphosis, incomplete
metamorphosis, metamorphosis but not an insect (frog), or no metamorphosis (bean, chicken).

## 🧬 The Chromosome Dance (6 rounds)

Chromatids are SVG bars (orange from the mother, blue from the father) that glide between poses.
- 🔎 Name that phase (twice): the cell moves into interphase, prophase, metaphase, anaphase or telophase.
- 🎬 Put the movie in order: four pictures of mitosis; then the whole movie plays.
- 🔢 Count the chromosomes (twice): a cell with 4 or 6 chromosomes divides by mitosis or meiosis; after answering, the division plays.
- 🎥 Which division is it?: watch mitosis (2 identical cells) or meiosis (homologous pairs separate, then sister chromatids, with one crossed-over chromosome, making 4 different cells with half the number); ▶ Replay.

## Rules, pay and records

- Each step has 2 tries (the ring's stages and its classification count separately); a miss shows the answer and why.
  Stars: every step right ⭐⭐⭐, all but 1 or 2 ⭐⭐, at least half ⭐.
- From the unit: `lifecycle:result` → 1 Pet World coin per step done right, up to 20 a day (`LIFECYCLE_COINS_PER_DAY`).
  Saved in `S.lifecycle = {best, day, coinsToday, games[]}` (each game keeps its room), a day-log event `lifecycle`
  (Ledger: Science), and the time counts for Biology Unit 4 (`course:bio4:…`).
- From the Arcade: `arcade:round-complete` with the stars as the score → 1 ticket per star, up to 3 a round.
- It never counts toward practice, quizzes, tests or unlocks.

## Tested (Oct 30, 2026)

Headless Chromium at 375 × 740: 165 full rounds played through the real page (40 all-right and 15 all-wrong per room):
all-right always scores every step, all-wrong always 0, no page errors, no sideways scrolling. Screenshots of every step
type for all three butterflies, the ring, every Chromosome Dance round and the mitosis and meiosis movies were checked.
In the game bundle, the unit card opened the lab in its overlay and a finished round paid coins and saved the record.
