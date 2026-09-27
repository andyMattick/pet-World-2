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

| # | Work | Plan | Depends on | Size |
|---|---|---|---|---|
| 3 | **4th grade neighborhood** (follows the Sadlier workbook, with Khan links, same class features; at home, a grown-up makes a class and the kids use its class code) | `GRADE4.md` (draft plan) | Neighborhoods | large |
| 4 | **7th grade neighborhood** (for next school year) | to be written | Neighborhoods | large |
| 5 | **Big reviews** (fluency practice like times tables): addition and subtraction facts for younger kids, order of operations, integer rules, and more, each added with the neighborhood that needs it | `NEIGHBORHOODS.md` (list) | as listed | small each |

Draft plans have the skills, steps, mix-ups, drills, and build steps. Before each one is built, its generator code gets written and stress-tested and pasted into the plan, like `BAKERY-1-SCALE.md`.

**Owner decisions made:** the Bakery came first (done); mixed numbers are required in simplest form; 4th grade shop names are final; at-home students use a class code (no family accounts); read-aloud starts off. **Still open:** check the 4th grade lesson titles against the workbook (the Lemonade Stand doesn't depend on them).

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
- [ ] 3c. 4th grade: the Toy Shop (`GRADE4-2-TOYS.md`, to be written), then the Pizza Parlor, Garden Center, and Art Studio
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
