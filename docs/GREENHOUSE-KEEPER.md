# 🌺 Greenhouse Keeper (Biology Unit 3's game)

A standalone page at `public/arcade/greenhouse-keeper/index.html`. It opens from a card at the bottom of the Biology Unit 3
page (`openGreenhouse`, `?from=bio3`) and from the 🕹️ Arcade (`greenhouse-keeper` in `ARCADE_GAMES`, `?arcadeRun=…`).

## A shift: 8 jobs

| # | Job | Practice it uses |
|---|---|---|
| 1 | ⚡ Power up the leaf: load what goes in and what comes out of photosynthesis, then pick the chloroplast | Understand: Photosynthesis |
| 2 | 🏷️ Label the residents: plants and algae do photosynthesis AND cellular respiration; animals and mushrooms do respiration only | Understand: Food and energy |
| 3 | 📈 Read the gas sensor: carbon dioxide in a sealed room over a day (falls with the lights on, rises in the dark) | Apply: Photosynthesis |
| 4 | ⚡ Power up the cell: cellular respiration's inputs and outputs, then the mitochondrion | Understand: Food and energy |
| 5 | 🔬 Help at the Plant Lab: lamp-and-bubbles data, van Helmont's willow, Priestley's mouse and mint, hours-of-light data | Apply: Photosynthesis |
| 6 | ⚡ Follow the energy: tap 5 steps in order, from the sun to a rabbit, hummingbird or tadpole (one slip allowed) | Apply: Food and energy |
| 7 | 🏃 Fitness Trail: breathing-rate difference (typed) or why the heart beats faster | Apply: Food and energy |
| 8 | ⚡ A twist: a plant at night or a sprouting potato in the dark (respiration), or a fern under grow lights (photosynthesis) | Understand: Food and energy |

- Each job has 2 tries; a miss shows the answer and a short explanation. Every job done right grows a plant in the top bar.
- Stars: 8 right ⭐⭐⭐, 6–7 ⭐⭐, 4–5 ⭐.
- The 7 items (light energy, water, carbon dioxide, oxygen, sugar, energy for the cell, soil minerals) cycle with each tap: goes in → comes out → back. Soil minerals belong to neither process.

## Pay and records

- From the unit: `greenhouse:result` → 1 Pet World coin per job done right, up to 20 a day (`GREENHOUSE_COINS_PER_DAY`). Saved in `S.greenhouse = {best, day, coinsToday, games[]}`, a day-log event `greenhouse` (Ledger: Science), and the time counts for Biology Unit 3 (`course:bio3:…`).
- From the Arcade: `arcade:round-complete` with the stars as the score → 1 ticket per star, up to 3 a shift (`arcadeModuleMessage`).
- It never counts toward practice, quizzes, tests or unlocks.

## Tested (Oct 29, 2026)

Headless Chromium at 375 × 667: the intro, every job type played right and wrong (screenshots checked), 42 full shifts
with all-right and all-wrong play (8 of 8 and 0 of 8, 15 tries when everything is missed), no page errors, and no sideways
scrolling. The Pet World side (the card, the coins and the day log) could not be run here because the Vite build needs
packages this sandbox can't download.
