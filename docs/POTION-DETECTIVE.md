# 🔍 Potion Detective

A Potion Lab game for Khan 6th grade Unit 6 (variables and expressions). File: `public/arcade/potion-detective/index.html`.

## Where it opens

- **Potion Lab → 🍶 Potion Shelf** (the last Unit 6 station): the "🔍 Potion Detective" button. It opens with `?from=potion` in an overlay (`openDetective` in `src/game/game.js`). It pays Pet World coins: 1 for each clue she solves, up to `DETECTIVE_COINS_PER_DAY` (20) a day.
- **Arcade**: `potion-detective` in `ARCADE_GAMES`. It pays 1 ticket per case solved, up to 3. See `ARCADE-GAMES.md`.

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

## How it plays

- 3 cases. In each one, a potion was stolen and there are 6 suspects. Each suspect card lists 5 pieces of evidence: 🔐 locker number, 🐾 paw print size, 🕐 arrival time, 🧥 coat buttons, and 📜 the note they carry (an expression).
- 5 clues, one for each kind of evidence. Each clue is a Unit 6 problem whose **answer is the thief's evidence**. For example: "The thief's locker number is the value of 4x + 4 when x = 7" (32), or "The thief's note shows 4(m + 3) with no parentheses" (pick 4m + 12).
- One try per clue. A right answer is logged, and every suspect who doesn't match is ruled out (✗). A wrong answer smudges the clue: it rules nobody out. The wrong answers are mistakes students really make (34 for 3x when x = 4, the GCF instead of the LCM, 4m + 3), and innocent suspects carry them, so a careless answer can point at the wrong pet.
- She can name the thief at any time after the first clue. The more clues she solves, the better her guess: every innocent matches the thief on 2 to 4 pieces of evidence, never all 5. With all 5 solved, exactly one suspect fits. With 3 solved, about 40% of cases have one suspect left and most of the rest have two or three.
- After each case, the case file shows every clue with its answer.

| Evidence | Clues (Unit 6 skills) |
|---|---|
| 🔐 Locker | ax + b at a value (`evalOne`), ax + y (`evalMulti`), the LCM of two numbers (`lcm`) |
| 🐾 Paw print | x² + b (`evalExp`), the GCF (`gcf`), xy with x = 1/p (`evalMultiFrac`) |
| 🕐 Arrival time (1 to 12 o'clock) | a formula like h = 13 − 2t (`evalWord`), the coefficient after combining like terms (`combineLike`), a(x + b) (`evalOne`) |
| 🧥 Coat buttons | terms, a coefficient, or the constant (`exprParts`), 24 + 36 = 12(2 + ▢) (`factorDist`), x × y with a fraction (`evalMultiFrac`) |
| 📜 Note (pick the expression) | words to an expression (`writeBasic`, `writeExpr`), distributing (`distVar`), factoring with the GCF (`factorVar`), combining like terms (`combineLike`) |

**Checked:** 3,000 generated cases. Every case has exactly one thief, every answer is a whole number, arrival times stay from 1 to 12, and with all 5 clues solved exactly one suspect fits.

## Saved state and reports

- `S.detective = {best (cases solved), day, coinsToday, games:[{t, solved, right, tries, missed}]}` (the last 30 games).
- Day log event `k:'detective'`; place `detective`, counted as math time. The teacher ledger maps `detective` to math.
