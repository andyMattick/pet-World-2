# 🐄 Barn Breeder

Biology Unit 5's game (the Farm Barn, `docs/SCIENCE-UNIT5.md`). The county fair is coming, and five judges each want one special animal.

## How it plays

- A fair season is 5 judges' goals, easiest first: one single-gene goal (a calf with no horns, or a red Angus calf from an all-black herd), one codominance or incomplete dominance goal (a roan calf, a blue chick), two two-generation goals (a black lamb from a white ram and a black ewe, a single-comb chick from a rose-comb rooster), and the grand prize: a polled red calf from a PP BB bull and a pp bb cow (two genes, F1 then F2 or a backcross).
- Every animal wears a DNA tag with its genotype. She taps a female and a male, **predicts the chance that one baby has the target trait** (0, 1/4, 1/2, 3/4, 1; sixteenths for the two-gene goal), then breeds them.
- Each breeding gives a female and a male baby, rolled at random with one allele from each parent per gene. Babies join the barn (F1, F2…) and can be bred next. Each goal has a breeding limit (3 to 5).
- After each breeding she sees the Punnett square (two for the two-gene goal, with “multiply the chances”), the shaded boxes that have the trait, and whether her prediction was right.
- Stars: ⭐⭐⭐ for all 5 ribbons with at least 3 of 4 predictions right; ⭐⭐ for 4 ribbons; ⭐ for 2.

## Where it lives

- Logic: `src/game/barnBreeder.js` (no DOM). Page: `arcade/barn-breeder/index.html`, a Vite page listed in `vite.config.ts`, so the unit and the Arcade share it.
- In the unit: a card at the bottom of the Farm Barn page (`barnBreederCardHTML`, `openBarnBreeder`), an overlay iframe with `?from=bio5`. The result (`barn:result`) pays 1 coin per right prediction, up to 20 a day, saves `S.barnBreeder` (`{best, day, coinsToday, games}`), and logs a `barnBreeder` day-log event (Science in the ledger). Time in it counts as Biology Unit 5 time.
- In the Arcade: `barn-breeder` in `ARCADE_GAMES`; `arcade:round-complete` pays 1 ticket per star, up to 3 a season.
- It never counts toward practice, quizzes, tests, mastery or unlocks.

## Tested

- `node scripts/check-genetics.mjs` plays 1,000 seasons choosing the best pair each time and checks every prediction chance against its own Punnett code (exactly one chip matches), and that every baby's genotype is one its parents can make. A careful player reaches each goal 90% (polled red calf) to 100% (roan, blue) of the time.
- Playwright at 375 px: opened from the unit, a whole season played, the coins paid and saved, no sideways scrolling.
