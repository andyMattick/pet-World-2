# 4th grade Pet Town

**Status: draft plan.** No code yet. Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## Goal

A 4th grade version of Pet Town, first for a student at home (joining with a class code, below), with the same class features (class code and PIN, teacher dashboard, quizzes, practice time, music). It follows the **Sadlier *Progress Mathematics* Grade 4** workbook in chapter order, with a Khan Academy 4th grade practice link for every skill.

It uses the **same game engine** as the 6th grade town: shops, stations, step-by-step orders, mix-ups, drills, quizzes, and rewards. Only the content is new.

## Owner decisions

1. **Workbook: not confirmed yet.** This plan uses Sadlier *Progress Mathematics* Grade 4 (36 lessons in 5 units, below). The owner checks the lesson titles against the workbook later. The Lemonade Stand (lessons 1 to 5) is built first and doesn't depend on the uncertain lessons.
2. **Shop names:** the names below are final.
3. **Home, with class features:** the at-home student gets the class features (saves, dashboard, quizzes) by joining a class the grown-up makes (see below).
4. **Read-aloud:** off by default. Students turn it on themselves.
5. **Order:** the Bakery (stations 2 to 5) is finished first, then the neighborhood engine (`NEIGHBORHOODS.md`), then 4th grade starting with the Lemonade Stand.
6. **4th grade is a neighborhood** in the same town, not a separate town (`NEIGHBORHOODS.md`). A student can move between 4th and 6th grade and keeps all progress.

## At home: a class code, no family accounts (owner decision)

There are **no family accounts**. An at-home student uses a **class code**, exactly like a school class:

- The grown-up signs up in the teacher app with email, the same as a teacher, and makes a class (for example "Abi at home").
- The kids join with that class code, their name, and a PIN, so saves, quizzes, practice time, and the dashboard all work unchanged.
- The class's **Home grade** (class settings) sets where the town opens. A family with a 4th grader and a 6th grader makes two classes, one per grade. Students can still walk to the other neighborhood any time.
- A grown-up sets it up, not the child, which keeps it right for kids under 13.
- No new tables, columns, or sign-up screens.

## Sadlier units → shops

| Shop (placeholder) | Sadlier unit | Lessons |
|---|---|---|
| 🍋 **Lemonade Stand** | Operations & Algebraic Thinking | 1–5 |
| 🧸 **Toy Shop** | Number & Operations in Base Ten | 6–13 |
| 🍕 **Pizza Parlor** | Number & Operations: Fractions | 14–25 |
| 🌱 **Garden Center** | Measurement & Data | 26–33 |
| 🎨 **Art Studio** | Geometry | 34–36 |

Each shop opens after the Unit Test of the shop before it, like the Bakery. Each has its own reward set (5 pets and 5 decorations, like `REWARDS.md`).

## Stations and Khan skills

Lesson titles are from Sadlier's Grade 4 correlation document. **Check them against the workbook**, especially lesson 17. Khan skills are from Khan Academy's 4th grade course, in Khan's order within each station.

### 🍋 Lemonade Stand (lessons 1–5)

| # | Station | Sadlier lessons | Khan skills |
|---|---|---|---|
| 1 | Pitchers | 1 Interpret multiplication as comparison · 2 Multiplication and division comparisons | Compare with multiplication · Compare with multiplication word problems |
| 2 | Big Orders | 3 Multistep problems | Multiplication and division word problems · 2-step estimation word problems · Represent multi-step word problems using equations · Multi-step word problems with whole numbers |
| 3 | Cup Stacks | 4 Factors and multiples | Factor pairs · Identify factors · Relate factors and multiples · Identify multiples · Identify prime numbers · Identify composite numbers · Prime and composite numbers |
| 4 | Sign Patterns | 5 Number and shape patterns | Patterns with numbers · Patterns with shapes |

### 🧸 Toy Shop (lessons 6–13)

| # | Station | Sadlier lessons | Khan skills |
|---|---|---|---|
| 1 | Stock Room | 6 Place value · 7 Read, write, and compare | Place value blocks · Place value tables · Identify value of a digit · Creating largest or smallest number · Write whole numbers in expanded form · Write numbers in written form · Write whole numbers in different forms · Regroup whole numbers · Multiply whole numbers by 10 · Divide whole numbers by 10 · Compare multi-digit numbers · Compare multi-digit numbers written in different forms |
| 2 | Price Tags | 8 Rounding · 9 Add and subtract | Round whole numbers · Round whole numbers to different place values · Round whole numbers word problems · Multi-digit addition · Multi-digit subtraction |
| 3 | Toy Crates | 10–11 Multiply | Multiply 1-digit numbers by 10, 100, and 1000 · Multiply 2-digits by 1-digit with area models · Multiply 3- and 4-digits by 1-digit with distributive property · Estimate products · Multiply with regrouping · Multiply 2-digit numbers with area models · Multiply with partial products (2-digit numbers) · Multiply 2-digit numbers |
| 4 | Sharing Shelves | 12–13 Divide | Estimate to divide by 1-digit numbers · Interpret remainders · Divide with remainders (2-digit by 1-digit) · Divide using place value · Divide by 1-digit numbers with area models · Estimate quotients · Divide multi-digit numbers by 2, 3, 4, and 5 · Divide multi-digit numbers by 6, 7, 8, and 9 |

The Toy Shop is big (8 lessons). The first station may split into two if its quiz gets too long.

### 🍕 Pizza Parlor (lessons 14–25)

| # | Station | Sadlier lessons | Khan skills |
|---|---|---|---|
| 1 | Slices | 14–15 Equivalent fractions | Equivalent fractions (fraction models) · Equivalent fractions (number lines) · Equivalent fractions · Fractions of different wholes · Common denominators |
| 2 | Which Is Bigger? | 16 Compare fractions | Visually compare fractions with unlike denominators · Compare fractions using benchmarks · Compare fractions with different numerators and denominators · Compare fractions word problems |
| 3 | Toppings | 17–20 Add and subtract fractions and mixed numbers | Decompose fractions visually · Decompose fractions · Add fractions with common denominators · Subtract fractions with common denominators · Add and subtract fractions word problems · Write mixed numbers and improper fractions · Add and subtract mixed numbers (no regrouping, with regrouping) · mixed number word problems |
| 4 | Party Orders | 21–23 Multiply fractions by whole numbers | Multiply fractions and whole numbers with fraction models · on the number line · Multiply unit fractions and whole numbers · Multiply fractions and whole numbers · Multiply mixed numbers and whole numbers · word problems |
| 5 | Pizza Money | 24–25 Tenths, hundredths, and decimals | Equivalent fractions (denominators 10 & 100) · Add fractions (denominators 10 & 100) · Write decimals and fractions shown on grids and number lines · Decimals in words · Decimals on the number line · Write decimals as fractions · Compare decimals (tenths and hundredths) |

### 🌱 Garden Center (lessons 26–33)

| # | Station | Sadlier lessons | Khan skills |
|---|---|---|---|
| 1 | Measuring Cups | 26–28 Convert units and measurement problems | Convert to smaller units (g and kg, oz and lb, mL and L, c/pt/qt/gal, mm/cm/m/km, in/ft/yd/mi, sec/min/hr) · Time, money, metric, and customary conversion word problems |
| 2 | Garden Beds | 29 Area and perimeter | Area and perimeter situations · Represent rectangle measurements · Area & perimeter of rectangles word problems |
| 3 | Seed Survey | 30 Line plots | Graph data on line plots (through 1/8 of a unit) · Interpret line plots · Interpret line plots with fraction addition and subtraction |
| 4 | Sprinkler Angles | 31–33 Angles | Angles in circles · Benchmark angles · Types of angles by measure · Measure angles · Draw angles · Estimate angle measures · Decompose angles |

### 🎨 Art Studio (lessons 34–36)

| # | Station | Sadlier lessons | Khan skills |
|---|---|---|---|
| 1 | Lines | 34 Points, lines, and angles | Identify points, lines, line segments, rays, and angles · Name angles · Angle basics · Angle types · Identify parallel and perpendicular lines |
| 2 | Shapes | 35 Classify figures | Classify triangles by angles, by side lengths, and by both · Classify shapes by line and angle types |
| 3 | Mirrors | 36 Lines of symmetry | Identify line symmetry |

Khan practice links: each skill's exercise URL goes in the registry when its station is built (the same way `BAKERY.md` lists them). Links come from the Khan course page `khanacademy.org/math/cc-fourth-grade-math`.

## Engine changes (step G4-0)

**Replaced by `NEIGHBORHOODS.md`:** 4th grade is a neighborhood in the same town, with a home grade per student instead of one course per town. In the notes below, read "course" as "home grade".

Original notes:

- **Courses in the registry:** `COURSES = { g6: { name: '6th grade', shops: ['cafe', 'bakery', …] }, g4: { name: '4th grade', shops: ['lemonade', 'toys', …] } }`. `BUILDINGS`, `SHOPS`, and rewards are grouped by course.
- **Which course a town follows:**
  - Class: `classes.game_settings.course` (`'g6'` by default), set by the teacher when creating the class. This needs no database change, because `game_settings` is already there.
  - At home: the grown-up's class sets it, like any class.
  - Local mode: the grown-ups pick 4th or 6th grade when naming the town.
  - Saved as `S.course`. Old saves are `'g6'`.
- **The town screen, Sticker Book, unit tests, and shop-opening rule** read the course's shops instead of all shops. "Opens after the unit test of the shop before" uses the course's order.
- **Teacher dashboard:** shop tabs come from the class's course.
- **Fact Sprint and drills:** times tables stay for both courses. 4th-grade drills (like place value to 10,000 and equivalent fractions) are added with their stations.
- **Nothing changes for 6th grade players.** Verify gets a check that `g6` still lists the café and Bakery.

## New step types 4th grade needs

| Needed by | New step or picture |
|---|---|
| Toy Shop | Place-value blocks and tables, area models for multiplication and division |
| Pizza Parlor | Fraction bars and number lines (reusing the Bakery's fraction answers) |
| Garden Center | Line plots, a protractor picture for angles |
| Art Studio | Tap-to-choose points, lines, and shapes; symmetry lines |

Each is built inside the station plan that first needs it, the same way the Bakery builds fraction answers in station 2.

## Build order (one plan file each, written later)

| Plan | What |
|---|---|
| `NEIGHBORHOODS-0-ENGINE.md` | Neighborhoods in the engine (see `NEIGHBORHOODS.md`). Built |
| `GRADE4-1-LEMONADE.md` | Lemonade Stand, 4 stations, and its reward set |
| `GRADE4-2-TOYS.md` | Toy Shop, 4 stations |
| `GRADE4-3-PIZZA.md` | Pizza Parlor, 5 stations (after the Bakery's fraction answers exist) |
| `GRADE4-4-GARDEN.md` | Garden Center, 4 stations |
| `GRADE4-5-ART.md` | Art Studio, 3 stations |

Like the Bakery, every station's generator code is written and stress-tested before it reaches the coder.

## Sources

- Sadlier, *Progress Mathematics* Grade 4 correlation to the Common Core: https://www.sadlier.com/hubfs/docs/Gr4_Progress_Math-CCSS_correlation.pdf
- Khan Academy 4th grade math: https://www.khanacademy.org/math/cc-fourth-grade-math
