# 🎪 Carnival Midway

The Pet Fair's game (Khan 6th grade Unit 7, equations and inequalities). File: `public/arcade/carnival/index.html`.

## Where it opens

- **Pet Fair → 🏆 Prize Counter** (the last Pet Fair station): the "🎪 Carnival Midway" button. It opens with `?from=fair` in an overlay (`openCarnival` in `src/game/game.js`). It pays Pet World coins: 1 for each right answer, up to `CARNIVAL_COINS_PER_DAY` (20) a day.
- **Arcade**: `carnival` in `ARCADE_GAMES`. Each booth played pays 1 ticket per star, up to 3. See `ARCADE-GAMES.md`.

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

## The booths

Each booth has 5 throws. Every skill in the booth comes up in a round, so all 22 Pet Fair skills get tested. There's one throw per question: a miss shows why the right answer works. Stars: ⭐⭐⭐ for 5 right, ⭐⭐ for 4, ⭐ for 3.

| Booth | Pet Fair station | Skills | How it plays |
|---|---|---|---|
| 🎈 Balloon Pop | 🎟️ Ticket Booth | `testSol`, `tapeEq`, `hangerEq`, `visualSolve` | Pop the balloon with the right x, the equation a tape diagram or hanger shows, or what one 🟧 is worth |
| 🎯 Ring Toss | 🎯 Ring Toss | `oneStepAdd`, `oneStepAddFrac`, `oneStepMult`, `oneStepMultFrac` | Toss a ring on the bottle with the solution |
| 🔮 Fortune Teller | 🎪 Story Tent | `eqMistake`, `translateEq`, `eqWrite`, `eqModel` | Pick the card: where the mistake is, the equation for the words or story, or the answer |
| 📏 Height Check | 🎢 Ride Line | `testIneq`, `graphIneq`, `ineqFromGraph`, `plotIneq`, `ineqWord` | Tap every pet tall enough for the ride sign (h ≥ 48), pick a graph or sign, or say how to plot it |
| 🎡 Ferris Wheel | 🎡 Ferris Wheel | `tableEq`, `depIndep`, `graphEq` | Type a car's y from the rule, name the dependent variable, or match points to an equation |
| 🦆 Duck Pond | 🏆 Prize Counter | `relQuant`, `analyzeRel` | Pick the duck with the equation for a story or table, or predict y at x = 10 |

**Checked:** 2,000 rounds of every skill. Every choice round has exactly one right answer and no repeated choices. Every Height Check line has at least one pet who can ride and one who can't.

## Saved state and reports

- `S.carnival = {best:{booth: stars}, day, coinsToday, games:[{t, booth, right, tries, stars, missed}]}` (the last 40 booth plays).
- Day log event `k:'carnival'`; place `carnival`, counted as math time. The teacher ledger maps `carnival` to math.
