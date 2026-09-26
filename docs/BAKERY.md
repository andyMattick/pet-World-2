# Unit 2: The Bakery (Arithmetic with rational numbers)

**Status: in progress.** Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

The Bakery follows Khan Academy 6th grade Unit 2 in order, as **5 stations covering 16 Khan skills**. Every problem is split into idea steps and arithmetic steps, like the café. Mistakes get named. Division and multiplication slips trigger drills.

## The 5 stations

| # | Station | Khan skills (in Khan's order) | New input needed |
|---|---|---|---|
| 1 | ⚖️ **The Scale** | Adding decimals · Subtracting decimals · Adding & subtracting decimals word problems | decimal answers, **`.` key on the number pad** |
| 2 | 🥧 **Sharing Pans** | Divide fractions by whole numbers · Divide whole numbers by fractions | **fraction answers** (`3/4`, `1 1/2`) |
| 3 | 📦 **Boxing Treats** | Dividing fractions · Divide mixed numbers · Interpret fraction division · Dividing fractions word problems | fraction answers |
| 4 | 🧾 **The Register** | Decimal multiplication place value · Multiplying decimals · Division by 2 digits · Multi-digit division | long-division layout |
| 5 | 🚚 **Bulk Orders** | Divide whole numbers to get a decimal · Dividing decimals: hundredths · Dividing decimals: thousandths | long-division layout with decimals |

Each station opens after 6 orders at the one before it, the same as the café.

## Build order (one plan file each)

| Plan | What | Status |
|---|---|---|
| `BAKERY-0-ENGINE.md` | Let the game run more than one shop: shared station screen, per-shop progress, logging, dashboard tabs | **ready** |
| `BAKERY-1-SCALE.md` | Station 1, with tested generator code, 3 new mix-ups, and the place-value drill | **ready** |
| `BAKERY-2-PANS.md` | Station 2 plus the fraction answer type | written next |
| `BAKERY-3-BOXES.md` | Station 3 plus the reciprocal and simplify drills | later |
| `BAKERY-4-REGISTER.md` | Station 4 plus the long-division layout and the decimal-shift drill | later |
| `BAKERY-5-BULK.md` | Station 5 | later |

Every plan's generator code is written and stress-tested before it reaches the coder. **Paste it as written; don't rewrite generator code.**

## Khan practice links

| Skill id | Khan skill | Link |
|---|---|---|
| addDec | Adding decimals: thousandths | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-decimals/e/adding_decimals_2 |
| subDec | Subtracting decimals: thousandths | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-sub-decimals/e/subtracting_decimals_2 |
| decWord | Adding & subtracting decimals word problems | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-sub-decimals-word-problems/e/adding_and_subtracting_decimals_word_problems |
| fracDivWhole | Divide fractions by whole numbers | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/x0267d782:dividing-fractions-and-whole-numbers/e/divide-fractions-by-whole-numbers |
| wholeDivFrac | Divide whole numbers by fractions | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/x0267d782:dividing-fractions-and-whole-numbers/e/divide-whole-numbers-by-fractions |
| fracDiv | Dividing fractions | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/dividing_fractions_1.5 |
| mixedDiv | Divide mixed numbers | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/divide-mixed-numbers |
| fracInterp | Interpret fraction division | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/interpret-fraction-division |
| fracWord | Dividing fractions word problems | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-fractions/e/dividing-fractions-by-fractions-word-problems |
| mulDecPlace | Decimal multiplication place value | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-multiplying-decimals/e/multiplying_decimals_1 |
| mulDec | Multiplying decimals | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-multiplying-decimals/e/multiplying_decimals |
| div2 | Division by 2 digits | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-div-whole-numbers/e/division_3 |
| divMulti | Multi-digit division | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-div-whole-numbers/e/division_4 |
| divToDec | Divide whole numbers to get a decimal | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals_0.5 |
| divDec2 | Dividing decimals: hundredths | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals_3 |
| divDec3 | Dividing decimals: thousandths | https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-dividing-decimals/e/dividing_decimals |

The **Bakery rewards** (the hedgehog welcome gift, station unlocks, and the legendary raccoon and gold medal) are already in `REWARDS.md`, keyed to stations 2 to 4. Leave them as they are. Station 5 just doesn't have its own reward.
