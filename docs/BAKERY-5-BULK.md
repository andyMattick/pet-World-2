# Bakery station 5: Bulk Orders (divide decimals)

**Status: draft plan.** The generator code isn't written yet. Before any building starts, it gets written and stress-tested and pasted into this file. Needs the long-division layout from `BAKERY-4-REGISTER.md`. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `divToDec` | Divide whole numbers to get a decimal | 7 kg of dough into 4 equal batches: 7 ÷ 4 = 1.75 |
| `divDec2` | Dividing decimals: hundredths | 3.25 ÷ 0.05 = 65 |
| `divDec3` | Dividing decimals: thousandths | 0.378 ÷ 0.9 = 0.42 |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** splitting bulk ingredients into equal batches, and "how many 0.05 kg bags can we fill?"
- **Steps (on the long-division layout from station 4):**
  1. *Idea (decimal divisors):* move the decimal point in both numbers until the divisor is whole (3.25 ÷ 0.05 → 325 ÷ 5). Shown as a choice at level 1, typed at level 2+.
  2. *Idea:* where the point goes in the quotient (straight up from the dividend).
  3. *Arithmetic:* the long-division digits, as in station 4.
  4. *Arithmetic (`divToDec`):* "write a 0 and keep going" when there's a remainder, until it divides evenly (answers end within 3 decimal places).
- **Levels:** level 1 is whole ÷ whole ending in tenths or hundredths. Level 2 has hundredths divisors. Level 3 has thousandths and zeros in the quotient.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `remainderNotDecimal` | Stops with a remainder instead of continuing | 7 ÷ 4 answered as 1 R3 or 1.3 | "Put a point and a 0 after 7, and keep dividing." | Show 7 as 7.00 before starting. |
| `shiftOneOnly` | Moves the point in the divisor but not the dividend | 3.25 ÷ 0.05 answered as 0.65 | "Whatever you do to the divisor, do to the dividend." | Write both as a fraction, then multiply top and bottom by 100. |
| `pointMisplaced` | Puts the quotient's point in the wrong place | 0.378 ÷ 0.9 answered as 4.2 or 0.042 | "Line the point up straight above the dividend's point." | Estimate: 0.4 ÷ 1 is about 0.4. |
| `missingZero` | Leaves out a zero in the quotient | (from station 4) | (from station 4) | (from station 4) |

## Drills

- **Moving the decimal** (`decimalShift`): after `shiftOneOnly` or `pointMisplaced`.

## Rewards and the unit test

- There's no station 5 reward (see `REWARDS.md`).
- **When this station is built, every Bakery station has skills**, so the 🏆 Bakery Unit Test appears (16 questions, 1 per skill). Passing it opens the Market Stall once that's built, gives the Bakery Master stamp, and unlocks the legendary 🦝 raccoon and 🏅 gold medal.
- Before building, check the unit test's question plan with 16 skills at iPhone SE size.

## Build steps (one commit each)

1. **Registry:** 3 skills, the new mix-ups, station 5's `skills` in the **same commit**, `UNIT_SKILLS.bakery`.
2. **Generators:** paste the tested code.
3. **Unit test check:** play the Bakery Unit Test end to end (all 16 skills), and check the Bakery Master stamp and the "Market Stall" message.
4. **Verify:** checks for the generators; update the three instruction files and move the Bakery to Done on the roadmap.

## Acceptance checks

1. Every quotient matches an independent calculation using exact math, and ends within 3 decimal places.
2. Each mix-up fires only on its wrong answer.
3. The Bakery Unit Test appears only after all 5 station quizzes, and passing it gives the stamp and legendary items.
