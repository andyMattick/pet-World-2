# 🩺 Dr. Paws' Surgery Center

A Bakery practice game (Khan 6th grade Unit 2, arithmetic with rational numbers). File: `public/arcade/pet-surgery/index.html`.

## Where it opens

- **Bakery → 🚚 Bulk Orders station** (the last Bakery station): the "🩺 Dr. Paws' Surgery" button. It opens as `?from=bakery` in an overlay (`openSurgery` in `src/game/game.js`). It pays Pet World coins: 1 for each step done right, up to `SURGERY_COINS_PER_DAY` (20) a day.
- **Arcade**: `pet-surgery` in `ARCADE_GAMES` (`src/shared/registry.ts`). It pays 1 ticket per 3 patients healed, up to 3 a shift (`arcadeModuleMessage`).

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

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

## Saved state and reports

- `S.surgery = {best, day, coinsToday, games:[{t, healed, perfect, steps, right, missed}]}` (the last 30 shifts).
- Day log event `k:'surgery'`; place `surgery`, counted as math time. The teacher ledger maps `surgery` to math.
