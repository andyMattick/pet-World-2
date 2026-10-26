# 🩺 Dr. Paws' Surgery Center

A Bakery and Clock Tower practice game (Khan 6th grade Unit 2, arithmetic with rational numbers, and Unit 4, exponents and order of operations). File: `public/arcade/pet-surgery/index.html`.

## Where it opens

- **Bakery → 🚚 Bulk Orders station** (the last Bakery station): the "🩺 Dr. Paws' Surgery" button. It opens as `?from=bakery` in an overlay (`openSurgery` in `src/game/game.js`). It pays Pet World coins: 1 for each step done right, up to `SURGERY_COINS_PER_DAY` (20) a day.
- **Clock Tower → 🕰️ Clock Face station** (the last Clock Tower station): the same button opens it as `?from=clock`, with only 📜 secret formulas (below). Coins and the daily cap are shared with the Bakery.
- **Arcade**: `pet-surgery` in `ARCADE_GAMES` (`src/shared/registry.ts`). It pays 1 ticket per 3 patients healed, up to 3 a shift (`arcadeModuleMessage`).

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

See `ARCADE-GAMES.md` for the rule that every unit game is in the Arcade too.

## How it plays

Each patient has a chart with 3 steps. Each step uses the answer from the step before, so she has to do them in order and get each one right.

| Chart | Steps (Pet World skills) |
|---|---|
| 💧 Medicine in mL (decimals) | 3 different steps from: add thousandths (`addDec`), subtract (`subDec`), multiply by a decimal (`mulDec`), divide by a whole number to get a decimal (`divToDec`), divide by a decimal (`divDec2`) |
| 🩹 Bandage in inches (fractions) | whole ÷ fraction (`wholeDivFrac`), then 2 of: fraction ÷ whole (`fracDivWhole`), ÷ a fraction (`fracDiv`), ÷ a mixed number (`mixedDiv`) |
| 💊 Vitamin crumbs (level 2 and up) | long division by a 2-digit number (`div2`), then ÷ a whole number to a decimal (`divToDec`), then × a decimal (`mulDec`) |

- Every value is kept as an exact fraction, so there's no rounding. Decimal answers end within 3 places, and fraction denominators stay at 12 or less.
- Fraction answers have to be in simplest form, as a mixed number when they're more than 1. If she types the right amount in another form, she's asked to rewrite it, and it doesn't count as a miss.
- Wrong answer: "Bzzt!" and one more try. A second miss, or running out of time on the heart monitor, costs a ❤️. Dr. Paws then shows the right value so she can keep going. Lose 3 ❤️ and the shift ends.
- Every 3 patients the level goes up, which means less time per patient (120 s at first, never under 60 s).
- The end screen lists the skills she missed most ("Worth another look").

## 📜 Secret formulas (Clock Tower)

A patient's chart is a formula like `(6 + 2)² − 17` or `(3/4)² × 32 + 6`, kept as a small expression tree. She taps the operation that comes next, works it out, and the formula shrinks, until one number is left (2 or 3 operations).
- What counts as next: ready operations (both sides are numbers) of the most urgent kind: parentheses, then exponents, then × and ÷, then + and −. When two are equally urgent (`4 × 5 + 3 × 2`), either is fine; a chain like `37 − 9 + 11` is already left to right in the tree.
- A wrong tap: "Bzzt! That's not next", one more try; a second wrong tap costs a ❤️ and Dr. Paws does the right operation. Wrong values work like the other charts.
- Skills: `orderNoExp` (no exponents, level 1 on), `orderOps` (whole-number exponents), `orderFracExp` (fraction and decimal bases, level 2 on), and each exponent step counts as `powWhole` or `powFrac`.
- From the Clock Tower she gets only formulas; in the Arcade, formulas mix with the Bakery charts; from the Bakery, no formulas.

## Saved state and reports

- `S.surgery = {best, day, coinsToday, games:[{t, healed, perfect, steps, right, missed}]}` (the last 30 shifts).
- Day log event `k:'surgery'`; place `surgery`, counted as math time. The teacher ledger maps `surgery` to math.
