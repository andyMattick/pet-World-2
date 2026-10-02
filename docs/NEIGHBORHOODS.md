# Neighborhoods: one town, every grade

**Status: engine built** (`NEIGHBORHOODS-0-ENGINE.md`). 4th grade has its first shop, so the switcher shows. Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## The decision

Pet Town is **one town per student**, with **one neighborhood per grade**. Each neighborhood contains classes (subjects such as Math, History, Biology, and English), and each class contains its own ordered units. A student never starts over: moving up a grade adds a neighborhood next to the ones she already has.

- **One save** per student: one coin purse, one Sticker Book, one Fact Sprint record.
- **Each class** has its own buildings, stations, quizzes, unit tests, and reward sets (pets and decorations), like the Café and Bakery today. Unit unlocking proceeds within that grade and class only.
- **Students can walk between neighborhoods** any time, to review an earlier grade or peek ahead.
- **Home grade:** the class sets its students' home neighborhood (at home, the grown-up's class does). The town opens to that grade's class list, and the dashboard shows it first. Local mode asks once, when the town is named.
- **Nothing is lost when a grade is added.** Progress is saved by skill id and shop id, and every skill id is unique across the whole game.

## Neighborhoods, in order

| Neighborhood | Follows | Status |
|---|---|---|
| 4th grade | Sadlier *Progress Mathematics* Grade 4 + Khan 4th grade (`GRADE4.md`): Lemonade Stand ✅, Toy Shop ✅, Pizza Parlor ✅, Garden Center (stations 1 and 2) | building |
| 5th grade | Khan 5th grade | later |
| **6th grade** | Math: Café ✅, Bakery ✅, Market ✅, Clock Tower ✅, Ice Rink ✅, Potion Lab ✅, Pet Houses ✅, Pet Show ✅; History, Biology, English classes planned | building |
| 7th grade | Khan 7th grade (needed for next school year) | next year |
| 8th grade | Khan 8th grade | later |
| Algebra 1 | Khan Algebra 1 | later |
| Geometry | Khan High school geometry | later |
| Algebra 2 | Khan Algebra 2 | later |
| Precalculus | Khan Precalculus | later |
| Calculus | Khan AP Calculus AB | later |

The order of Geometry and Algebra 2 can follow the school's sequence. Neighborhoods don't depend on each other, so any order works.

## Engine changes (built: see `NEIGHBORHOODS-0-ENGINE.md`)

- **Registry:** `NEIGHBORHOODS` contains grades; `SUBJECTS` defines reusable classes; every `BUILDINGS` entry belongs to a grade and subject. `SHOPS`, unit tests, and reward sets stay grouped by their existing unique ids.
- **Save:** add `S.home` (default `'g6'`, so every existing save keeps working unchanged). Progress keeps living under shop and skill ids, so adding neighborhoods changes nothing that's already saved.
- **Town screen:** a grade switcher leads to that grade's class tiles; choosing a class shows its ordered units. Unit unlocks are independent by grade and subject. Arcade, Pet Room, and town services remain central.
- **Classes:** `classes.game_settings.home` sets a class's home grade. At-home students join a class the grown-up makes (no family accounts). No new tables.
- **Teacher dashboard:** reports and settings remain grouped by grade, home first.
- **Grade trophy:** passing every unit test in every class in a neighborhood gives a trophy for the Sticker Book.
- **Verify:** checks that `g6` still lists the Café and Bakery and that `S.home` defaults to `'g6'`.

## Big reviews (fluency practice)

Big reviews are the quick, rote-memory skills that sit under many problems (like times tables). Each one is a practice pop-up type (`DRILLS.md` rule: practice the earliest part of a problem) **and** a Fact Sprint category. A review unlocks when its neighborhood's station is reached, then stays in the sprint mix everywhere.

| Review | Grades | Status |
|---|---|---|
| Times tables and division facts | 3 to 6 | ✅ built |
| Decimal place value | 5 to 6 | ✅ built (mixed places) |
| Lining up decimals | 5 to 6 | ✅ built |
| Word problems to math (story → equation) | all | ✅ built (Bakery and Café ratio stories) |
| Simplifying fractions, mixed numbers, reciprocals | 4 to 7 | ✅ built |
| **Addition facts to 20** | K to 3 | not yet (needed for younger kids) |
| **Subtraction facts to 20** | K to 3 | not yet |
| Whole-number place value and rounding | 3 to 4 | ✅ rounding built (Toy Shop) |
| Equivalent fractions, compare fractions | 3 to 5 | with 4th grade |
| Multiply and divide by 10, 100, 1000 (moving the decimal) | 5 to 6 | ✅ built (Bakery station 4) |
| Factors, multiples, primes, GCF and LCM | 4 to 6 | ✅ factor pairs built (Lemonade Stand); GCF and LCM with 6th grade |
| Fraction, decimal, percent equivalents (1/4 = 0.25 = 25%) | 6 to 7 | with the Market |
| **Order of operations** | 5 to 7 | with the Clock Tower |
| Squares, cubes, and square roots | 6 to 8 | with the Clock Tower |
| Integer rules (adding, subtracting, multiplying negatives) | 6 to 7 | with the Ice Rink |
| Inverse operations and one-step equations | 6 to 7 | with the Potion Lab |
| Unit conversions | 4 to 6 | with 4th grade (Garden Center) |
| Distributing and combining like terms | 7 to Algebra 1 | 7th grade |
| Exponent rules, slope from two points, factoring x² + bx + c | 8 to Algebra 2 | later |
| Special angles and unit-circle values | Geometry to Precalculus | later |
| Derivative rules | Calculus | later |

**Addition and subtraction facts** would be the first review built for younger kids. They work like times tables: a ladder (8 + 1 … 8 + 10), the same weak-fact tracking, and a sprint category.
