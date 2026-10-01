# Pet Town roadmap

Work top to bottom. Each plan has its own step-by-step file in `docs/`.

**How we work:** one step at a time. Each step is reviewed and tested in a browser before the next one starts, and every commit runs `npm run verify`, `npm run typecheck`, and `npm run build`.

## Done

- [x] Unit 1: Pet Café, 4 stations and 14 Khan skills, with step-level diagnostics and mix-up detection
- [x] Times-table practice pop-ups, Fact Sprint, music, backups
- [x] Supabase backend: class codes, PINs, saves, live teacher dashboard
- [x] Deployed on Vercel (every push to `main` deploys automatically)
- [x] Rewards: unlock rules, celebration, shop by unit, collections (`REWARDS.md`, `TASK-rewards.md`)
- [x] Visible tip timer and counting accuracy
- [x] Sprint auto-advance and sprint skill mix (`SPRINT.md`)
- [x] Rewards display, and the Pet Shop and Sticker Book merged (`REWARDS-DISPLAY.md`, `SHOP-BOOK.md`)
- [x] Drills and drill settings (`DRILLS.md`, `DRILL-SETTINGS.md`)
- [x] Scaling down and simplest form (`SIMPLIFY.md`)
- [x] Phones and tablets (`PHONE.md`)
- [x] Read the order first, read-aloud, adjustable reading time (`READ-FIRST.md`)
- [x] Teacher tools: copy and print logins, reset a student (`TEACHER-TOOLS.md`)
- [x] Bakery step 0: the engine runs more than one shop, the decimal key, and dashboard shop tabs (`BAKERY-0-ENGINE.md`)
- [x] Quizzes, steps 1 to 7 (`QUIZZES.md`): rules and state, quiz and test mode, station cards and quiz unlocking, unit tests, logging, the teacher settings card, dashboard quiz columns, student history with Excuse quiz and Clear review, and verify checks
- [x] Small fixes: quiz wording, log queue
- [x] Owner review of quizzes on the live site
- [x] Bakery station 1: The Scale (`BAKERY-1-SCALE.md`)
- [x] Bakery station 2: Sharing Pans, with fraction answer boxes and the simplify and mixed-number practice pop-ups (`BAKERY-2-PANS.md`)
- [x] Bakery station 3: Boxing Treats, with the reciprocal practice pop-up (`BAKERY-3-BOXES.md`)
- [x] Bakery station 4: The Register, with multiplication rows (required on levels 1 and 2, optional on level 3), the long-division bus stop, optional carry and borrow boxes, answer-only quizzes, and the moving-the-decimal pop-up (`BAKERY-4-REGISTER.md`)
- [x] Bakery station 5: Bulk Orders, with the decimal point drawn straight up in the long-division layout (`BAKERY-5-BULK.md`). **The Bakery is done:** all 5 stations and the 🏆 Bakery Unit Test (16 questions, played end to end)
- [x] Word-problem pop-up for the Café: ratio stories (`story:ratio` in `DRILLS.md`)
- [x] Neighborhoods engine: one town, a neighborhood per grade, home grade, switcher, and grade trophies (`NEIGHBORHOODS-0-ENGINE.md`). Older saves open as 6th grade
- [x] Fixes: the dashboard's "field name must not be null" (migration 7), decimals in order tickets (2.4 no longer splits into two sentences), and teachers can open later stations in every shop, not just the Café
- [x] 4th grade opens: the 🍋 Lemonade Stand, 4 stations and 15 skills (`GRADE4-1-LEMONADE.md`). The town now shows the grade switcher
- [x] Toy Shop stations 1 and 2: place value (blocks and tables), writing and comparing numbers, rounding, adding and subtracting (`GRADE4-2-TOYS.md`)
- [x] Toy Shop stations 3 and 4: multiplying and dividing with area models, partial products, and long division by 1-digit numbers, plus factor-pair and rounding sprint skills (`GRADE4-2-TOYS.md`)
- [x] Pizza Parlor (all 5 stations): equivalent fractions, comparing, adding and subtracting fractions and mixed numbers, multiplying fractions by whole numbers, tenths, hundredths, and decimals, with fraction bars, number lines, and hundred grids (`GRADE4-3-PIZZA.md`)
- [x] Garden Center stations 1 and 2: converting units, area and perimeter (`GRADE4-4-GARDEN.md`)
- [x] 6th grade Market Stall (all 4 stations): unit rates, comparing deals, percents, percents as decimals and fractions, and percent problems with double number lines (`MARKET.md`)
- [x] 6th grade Clock Tower (all 3 stations): exponents, powers of fractions and decimals, order of operations with a step-by-step engine, comparing powers (`CLOCK.md`)
- [x] Dashboard shop tabs grouped by grade, opening on the class's home grade; class settings grouped by grade
- [x] Pet Shop & Sticker Book grouped by grade: a grade switch on top, and it opens on the grade the student is standing in
- [x] 6th grade Ice Rink (all 4 stations): negative numbers, number lines, opposites, comparing and ordering, absolute value, and negative answers with a ± button (`RINK.md`)
- [x] 6th grade Potion Lab stations 1 to 4 (unit 6): parts of expressions, evaluating, writing expressions, GCF and LCM, the distributive property, equivalent expressions (`POTION.md`)
- [x] 6th grade Potion Lab stations 5 and 6 (unit 7): one-step equations with a balance, inequalities with graphs, dependent and independent variables. The Potion Lab is complete (`POTION.md`)
- [x] 6th grade Pet Houses (all 6 stations): area of triangles, parallelograms, and composite shapes; the coordinate plane; volume with fractions; nets and surface area (`HOUSES.md`)
- [x] 6th grade Pet Show (all 5 stations): statistical questions, dot plots, histograms, mean, median, IQR, MAD, box plots, shape of data (`SHOW.md`). **6th grade is complete: 8 shops, Khan units 1 to 11**
- [x] Answer boxes under lined-up decimals: one box per column, filled right to left, with optional carry/borrow boxes on every level; a wrong answer names the column to check
- [x] Keyboard works everywhere (the number pad no longer locks typing, including the PIN), and number keys 1 to 9 pick choices
- [x] Whole and part wording in Sharing Pans and the word-problem pop-up, and "same as ×" notes after the right division equation
- [x] Pop-up rule: quick practice on the earliest part of a problem (`DRILLS.md`). The Scale shows the lined-up numbers when adding and subtracting, a new lining-up pop-up and a word-problem pop-up, and the place-value pop-up mixes tenths, hundredths, and thousandths
- [x] Each new shop opens after the Unit Test of the shop before it, with a teacher switch to open it early
- [x] Practice time (`PRACTICE-TIME.md`): active minutes tracked in the game and the town, a progress-report panel, and teacher dashboard columns, weekly card, and 4-week chart
- [x] Sprint: students pick the skills, more skills earn more coins, every decimal place, and "Which is lined up correctly?" (`SPRINT.md` part C)
- [x] Music (`MUSIC.md`): 4 tracks, a music menu with volume, and a teacher Allow music switch
- [x] Draft plans written for Bakery stations 2 to 5 (`BAKERY-2-PANS.md` to `BAKERY-5-BULK.md`) and the 4th grade version (`GRADE4.md`)

## Next up

**6th grade is complete** (all 8 shops). 4th grade is paused (owner decision) until the owner restarts it. Each shop follows Khan's 6th grade course, in order. Plan files are written as each shop is built.

| # | Work | Khan unit | Main topics | Plan | Size |
|---|---|---|---|---|---|
| 1 | ⛸️ ~~Ice Rink~~ ✅ | 5: Negative numbers | Built | `RINK.md` | done |
| 2 | 🧪 **Potion Lab** | 6 and 7: Variables and expressions, equations and inequalities | Parts of expressions, evaluating, writing expressions, GCF and LCM, the distributive property, equivalent expressions, one-step equations, inequalities, dependent and independent variables | to be written | large |
| 3 | 🏡 **Pet Houses** | 8 to 10: Plane figures, the coordinate plane, 3D figures | Area of parallelograms, triangles, and composite shapes; points and polygons in all four quadrants; nets, surface area, volume with fractional edges | to be written | large |
| 4 | 🏆 **Pet Show** | 11: Data and statistics | Statistical questions, dot plots and histograms, mean and median, range, IQR, MAD, box plots | to be written | medium |
| 5 | 4th grade, when it restarts: 🌱 **Garden Center** stations 3 and 4, then 🎨 **Art Studio** | Sadlier lessons 30 to 36 | Line plots, angles with a protractor picture; lines, shapes, symmetry | `GRADE4.md`, `GRADE4-4-GARDEN.md` | medium each |
| 6 | **7th grade neighborhood** (for next school year) | Khan 7th grade | to be planned | to be written | large |
| 7 | **Big reviews** (fluency practice like times tables): integer rules with the Ice Rink, and more, each added with the shop that needs it | | | `NEIGHBORHOODS.md` (list) | small each |

When the Pet Show is done, 6th grade is complete: 8 shops, Khan units 1 to 11.

Each shop's plan file has the stations, skills, steps, mix-ups, and the stress-tested generator code (like `MARKET.md` and `CLOCK.md`).

**Owner decisions made:** the Bakery came first (done); mixed numbers are required in simplest form; 4th grade shop names are final; at-home students use a class code (no family accounts); read-aloud starts off. Dashboard shop tabs are grouped by grade (done). 4th grade is paused; 6th grade comes first. **Still open:** check the 4th grade lesson titles against the workbook before 4th grade restarts.

### Checklist

- [x] 1a. Bakery station 2, Sharing Pans, with fraction answers
- [x] 1b. Bakery station 3, Boxing Treats, with the reciprocal drill
- [x] 1c. Bakery station 4, The Register, with the long-division layout
- [x] 1d. Bakery station 5, Bulk Orders, and the Bakery Unit Test
- [x] 2a. 4th grade: owner decisions (shop names, class codes at home, read-aloud off), except checking lesson titles against the workbook
- [x] 1e. Word-problem practice for the Café (ratio stories)
- [x] 2. Neighborhoods in the engine: home grade, switcher, grade trophy (`NEIGHBORHOODS-0-ENGINE.md`). Dashboard tabs by neighborhood come with the first 4th grade shop
- [x] 3a. 4th grade at home: no family accounts; a grown-up makes a class and sets its Home grade
- [x] 3b. 4th grade: the Lemonade Stand (`GRADE4-1-LEMONADE.md`)
- [x] 3c. 4th grade: the Toy Shop, stations 1 and 2 (`GRADE4-2-TOYS.md`)
- [x] 3d. 4th grade: Toy Shop stations 3 and 4 (multiplying and dividing, with area models), and the factor-pair and rounding sprint skills
- [x] 3e. 4th grade: Pizza Parlor stations 1 to 3 (`GRADE4-3-PIZZA.md`)
- [x] 3f. 4th grade: Pizza Parlor stations 4 and 5 (`GRADE4-3-PIZZA.md`)
- [x] 3g. 4th grade: Garden Center stations 1 and 2, converting units and area and perimeter (`GRADE4-4-GARDEN.md`)
- [ ] 3h. 4th grade (paused): Garden Center stations 3 (line plots) and 4 (angles), then the Art Studio
- [x] 3i. 6th grade: the Market Stall (`MARKET.md`)
- [x] 3j. 6th grade: the Clock Tower (`CLOCK.md`)
- [x] 3l. Dashboard shop tabs and class settings grouped by grade
- [x] 3k. 6th grade: the Ice Rink (`RINK.md`)
- [x] 3m. 6th grade: Potion Lab stations 1 to 4, unit 6 (`POTION.md`)
- [x] 3m2. 6th grade: Potion Lab stations 5 and 6, unit 7 (`POTION.md`)
- [x] 3n. 6th grade: Pet Houses (`HOUSES.md`)
- [x] 3o. 6th grade: the Pet Show (`SHOW.md`). 6th grade complete
- [ ] 3p. Next: owner's choice: restart 4th grade (Garden Center stations 3 and 4, Art Studio), plan 7th grade, or fluency reviews
- [ ] 4. 7th grade: plan from Khan 7th grade, then build before next school year

## Database files, in the order they were run

1. `20260923000000_pet_town.sql` ✅
2. `20260925000000_drills.sql` ✅
3. `20260926000000_drill_settings.sql` ✅
4. `20260927000000_teacher_tools.sql` ✅
5. `20260928000000_quizzes.sql` ✅
6. `20260929000000_practice_time.sql` ✅
7. `20260930000000_report_null_keys.sql` ✅

All seven are run in Supabase. Never edit one of these files. Any change goes in a **new** migration file.

## Notes from reviews

- Quizzes appear only after **every skill in a station is mastered**. With "Passing a station quiz opens the next station" on (the default), the next station opens only after that quiz is passed. Stations that were open before the quiz update stay open.
- During quizzes, right and wrong answers both show a neutral "Answer saved". ✓/✗ appears only on the summary.
- Quiz and test problems are **not** logged to `problems`, so the teacher's skill grid stays practice-only. Quiz results live in `assessments`.
- Quiz settings rules live in one place (`registry.ts`) and are shared by the game and the teacher app.
- The Scale's line-up step only appears when the two numbers have different decimal places; otherwise both choices look the same.
- Each new shop opens for a student only after she passes the Unit Test of the shop before it (a teacher can excuse the test, or open the shop for the whole class in Settings). Local mode's "Unlock every station and shop" opens everything.

## Before other teachers or classes use it

- [ ] Turn **Confirm email** back on in Supabase (Authentication → Sign In / Providers → Email)
- [ ] Add a CAPTCHA to the student join screen, then turn CAPTCHA on in Supabase (see the README)
- [ ] Write a short privacy policy: first names only, what's stored, who can see it, how to delete it
- [ ] Decide on a custom domain, if you want one (Vercel → Settings → Domains)
- [ ] Keep an eye on Supabase's free plan: it pauses after about a week with no activity

## After that

- [ ] Selling: TPT listing or a teacher sign-up page


## Post-6th-grade feature roadmap

### Current status

- [ ] **My Pet Room:** MVP in progress (`PET-ROOM.md`). Students can place owned decorations, drag or keyboard-nudge them, and tap their helper for a reaction. Existing display-case stickers seed the first room. More room interactions remain.
- [ ] **Dress-up:** MVP in progress (`PET-ROOM.md`). Wearables have separate saved ownership/equipment, coin purchases, a math-streak reward, and Arcade-ticket exclusives held until ticket awards are secured.
- [ ] **Arcade:** in progress. The host has a separate game catalog, a 100-coin daily admission, one arcade minute per completed practice order, separate arcade tickets, and a Game of the Day rotation. Corsair's Cove has grid-path chasing, faster guard pursuit, and corrected tunnel navigation; Whack-a-Mole ignores dazed-mole clicks, blocks duplicate hits, and caps freeze bonuses at 30 seconds per round. Ticket prizes, secure round-result handling, browser review, and teacher controls remain.
- [ ] **House tours:** not built.
- [ ] **Pet Trips, Greenhouse, and Class Party Jar:** not built.

The owner's preferred order remains **My Pet Room and Dress-up first**, then the Arcade. The room and wardrobe MVP are underway; Arcade development is also in progress following the later decision to bring in the two game prototypes. The catalog stays open to future games such as computer-vs-human Bingo, Sticker Memory, a Hangman-style game, and another Corsair-style game.

1. Things to do with the pets and decorations they own
🏠 My Pet Room. Kids drag their decorations anywhere in a room: rug, fountain, trophy shelf, pizza oven. Their pets wander around, nap on the rug and splash in the fountain. Tapping a pet makes it do a trick or show a little speech bubble ("I love this cactus!"). More stickers means a busier, livelier room.
🎩 Dress-up. Cheap accessories like hats, bows, sunglasses and a cape to put on the helper pet. The pet wears them while "helping" at the shops.
🏡 House tours. A class gallery where kids visit each other's rooms and leave a ❤️ or a stamp like "cute fountain!" Stamps are picked from a set list, with no typing, so nothing needs moderating. Being seen is a strong reason to keep decorating.
2. The Arcade: games that spend coins and award arcade-only prizes

Pet Town coins stay the reward for math. Arcade admission costs 100 coins once per day; after admission, the student can play for one minute per completed math practice order that day. No additional coins are charged between games. Arcade tickets are a separate currency for arcade-only prizes and never convert to Pet Town coins.

🏴‍☠️ Corsair's Cove: a maze chase where math refills the ship's ammo.
🔨 Whack-a-Mole Stats Lab: a timed round with score statistics.
🧠 Future ideas: computer-vs-human Bingo, Sticker Memory using owned stickers, a Hangman-style game, and more original arcade games.

Games can award arcade tickets or trophies, never Pet Town coins, so arcade play cannot replace math as a way to earn coins or play time.

3. Reasons to come back tomorrow
✈️ Pet Trips. Send a pet on a trip, like the beach or the mountains. It comes back after a real day with a postcard for a travel scrapbook. The postcards are fixed, not a random prize draw.
🌱 Greenhouse. Buy seeds and plants grow over several days. Each finished order waters them. A fully grown plant becomes a decoration.
🎉 Class Party Jar. Everyone can drop coins in a shared jar. When it's full, the whole class unlocks something, like confetti in the town or a party hat for every pet. You could pair it with a real classroom reward.
A few guardrails I'd build in
No random paid prizes, so nothing like loot boxes for kids.
Math practice is the only way to earn Pet Town coins and unlock arcade minutes.
Arcade tickets cannot pay admission or be converted to Pet Town coins.
Short play sessions, with teacher controls for the arcade and its daily limit.
Everything stays out of the way during quizzes.

**Owner decision:** My Pet Room and Dress-up are the preferred next major features. Arcade work is already in progress to integrate the two imported game prototypes; finish its prize shop, secure round-result handling, teacher controls, and browser review before calling it done.