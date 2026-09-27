# Bakery station 4: The Register (multiply decimals, long division)

**Status: draft plan.** The generator code isn't written yet. Before any building starts, it gets written and stress-tested and pasted into this file. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `mulDecPlace` | Decimal multiplication place value | 0.3 × 0.02 = 0.006, given 3 × 2 = 6 |
| `mulDec` | Multiplying decimals (standard algorithm) | 2.4 kg of flour at $1.35 a kilogram |
| `div2` | Division by 2 digits | 336 cookies in boxes of 12 |
| `divMulti` | Multi-digit division | 8,256 ÷ 24 |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** ringing up orders at the register (price × weight), and packing big batches into boxes (division).
- **Multiplying decimals, steps:**
  1. *Arithmetic:* multiply as whole numbers (24 × 135 = 3240). The times-table facts inside are drill triggers.
  2. *Idea:* count the decimal places (1 + 2 = 3).
  3. *Arithmetic:* place the point (3.240, and 3.24 is accepted).
  4. *Idea (level 2+):* check with an estimate ("about 2 × 1 = 2, so 3.24 makes sense").
  - `mulDecPlace` problems are mostly steps 2 and 3, using a given whole-number fact.
- **Long division, steps:** a new **long-division layout**, one quotient digit at a time:
  1. *Idea:* estimate the digit ("How many 12s in 33?" → 2).
  2. *Arithmetic:* multiply (2 × 12 = 24).
  3. *Arithmetic:* subtract (33 − 24 = 9).
  4. *Arithmetic:* bring down and repeat.
  - Level 1 has 3-digit dividends with no zero digit in the quotient. Level 3 has 4-digit dividends and zeros in the quotient.
  - Remainders: level 1 to 2 divide evenly. Level 3 can have remainders, answered as "R" boxes.

## New input: the long-division layout

- A "bus stop" layout drawn in the board's chalk style, with the quotient row filling in digit by digit, and each multiply/subtract row appearing under the dividend.
- Each digit step is an ordinary number step pointing at a slot in the layout (like the café's ratio tables), so hints, mix-ups, and logging work unchanged.
- Quiz answer-only mode asks only for the final quotient (and remainder).
- Must fit an iPhone SE screen for 4-digit ÷ 2-digit problems.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `pointLikeAdding` | Lines up decimal points and keeps one point, like adding | 2.4 × 1.35 answered as 32.40 | "When multiplying, count all the decimal places." | Estimate first: 2 × 1 is about 2, so 32 can't be right. |
| `placesMiscount` | Counts decimal places wrong (off by one) | 0.3 × 0.02 answered as 0.06 or 0.0006 | "Count the digits after each point and add them." | Cover the points, multiply, then count places together. |
| `partialShift` | Forgets to shift the second partial product | 24 × 135 answered as 216 (120 + 72 + 24, with no place shifts) | "The tens row starts one place to the left." | Write the placeholder zero in the tens row. |
| `quotientTooSmall` | Picks a quotient digit that's too small, remainder ≥ divisor | 33 ÷ 12 digit 1, remainder 21 | "Your remainder is bigger than 12. Another 12 fits." | Compare each remainder with the divisor before moving on. |
| `quotientTooBig` | Picks a quotient digit that's too big | 33 ÷ 12 digit 3 (36 > 33) | "3 × 12 is more than 33. Try one less." | Estimate with rounded divisors (12 → 10). |
| `missingZero` | Leaves out a zero in the quotient | 8,160 ÷ 8 answered as 12 or 102 | "When a divisor doesn't fit, write a 0 before bringing down." | Use a place-value chart for the quotient. |

## Drills

- **Moving the decimal** (`decimalShift`, already registered): after `pointLikeAdding` or `placesMiscount`. Rows like "4.2 × 10", "35 ÷ 100".
- **Times tables** (existing): after multiplication fact slips inside steps.

## Rewards

Unchanged: the station 4 Bakery rewards in `REWARDS.md`.

## Build steps (one commit each)

1. **Long-division layout:** the layout and slot steps, tested with a throwaway problem at iPhone SE size.
2. **Registry:** 4 skills, the new mix-ups, station 4's `skills` in the **same commit**, `UNIT_SKILLS.bakery`, `decimalShift` sprint unlock at Bakery station 4.
3. **Generators:** paste the tested code.
4. **Decimal-shift drill:** the `DRILL_IMPL` entry, same shape as `times`.
5. **Verify:** checks for the layout, generators, and drill; update the three instruction files.

## Acceptance checks

1. Every product and quotient matches an independent calculation, using exact whole-number math (no floating-point rounding).
2. The long-division layout fits at iPhone SE size for 4-digit ÷ 2-digit.
3. Each mix-up fires only on its wrong answer.
4. Quizzes ask only for the final answer.
