# Pet World roadmap

Work top to bottom. Each plan has its own step-by-step file in `docs/`.

**How we work:** one step at a time. Each step is reviewed and tested in a browser before the next one starts, and every commit runs `npm run verify`, `npm run typecheck`, and `npm run build`.

## Done

- [x] Unit 1: Pet Café, 4 stations and 14 Khan skills, with step-level diagnostics and mix-up detection
- [x] Times-table practice pop-ups, Fact Sprint, music, backups
- [x] Times-table drill pop-ups practice facts out of order and read each problem and answer aloud before advancing
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
- [x] Reading Quiz in the Story Corner Library: chapter notes are checked by a grown-up (teacher app, or a parent PIN in local mode) before they can be quizzed; multiple-choice, true-or-false, and essay questions are built from the checked notes (`READING-QUIZ.md`)
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
- [x] 3q. Reading Quiz with grown-up verification (`READING-QUIZ.md`). Still to check on the live site: a teacher verdict round trip
- [ ] 3p. Next: finish the My Pet Room and Dress-up MVP (`PET-ROOM.md`), then complete Arcade prize handling and browser review before scheduling more post-6th-grade work
- [ ] 4. 7th grade: plan from Khan 7th grade, then build before next school year
- [ ] 3r. Math 🧠 Think it through with fresh numbers: turn each station's fixed set into number templates (`QUESTION-TYPES.md`). Details below

### 3r. Think it through with fresh numbers

**Why:** each math station's 🧠 Think it through set is 2 hand-written questions with fixed numbers, so a retry repeats the answers the student just saw. Since a set now has to be passed before the next station opens, and a missed set comes back as "Practice again", a retry should be new questions.

**Plan:**

- Each station gets 4 to 6 **templates** that make new numbers and contexts every try (for example "7 kittens and 3 puppies…", then "5 muffins and 9 juices…"), in different types (select all, two-part, sort, put in order, type the answer). Each try draws 3.
- Wrong choices are built from the station's real mix-ups (reversed order, part vs. total, adding instead of multiplying), following `CONTENT-RULES.md`: fair wrong answers, the right answer not always the longest.
- Each template has a stable id, so the "Missed" stats and the parent and teacher reports keep working. The "explain your thinking" answer and teacher-added questions stay as they are.
- Each batch comes with a review list of sample questions (right answers in bold) for the owner to read before applying.

**Order:** a pilot in the ☕ Pet Café (4 stations), then the rest of 6th grade shop by shop, then 4th grade. 52 stations in all.

### Family features (owner list, October 15, 2026)

Quickest first. Each gets its own plan file before it's built. **Still open:** where this list goes relative to 3p (owner decision).

- [ ] F1. Vocab import: headings like `Set 11:` and `Lesson 4`, bullets and numbers ignored, and words pasted with no meaning yet (Pet World fills in its own meaning when it has the word; the rest go back in the box as `word - `)
- [x] F2. Archive accepted work (teacher app, student page): accepted written answers, verified projects and reading chapters, and accepted reading-quiz essays fold into a closed ✅ Accepted section at the bottom of their tab. Sent-back work stays until it's turned in again
- [x] F3. Suggested vocab words: the teacher app's 📌 flagged words get a Dismiss button (it drops off the students' flagged lists too) and an editable example sentence, prefilled from where the word was found; a sentence typed with the word itself gets ___ in its place (also on the grown-up PIN screen)
- [x] F4. Parent sign-in: a "Waiting for approval" screen (with Check again and Sign out) when a signed-in account isn't approved yet, using `is_approved_parent()`, the Supabase function behind every classes policy. Admins approve or remove accounts from the teacher app's 🔑 Approvals page; the setup is saved as a migration (docs/APPROVALS.md)
- [x] F5. Vocabulary analysis like the math-facts view (teacher app, Vocabulary tab, "Word by word"): the class's hardest words with right / tried and who missed them, and each student's words as chips (✅ 🟡 🔴, right / tried), weakest first. Saves keep only each word's last 8 tries and no dates, so "last practiced" isn't shown
- [x] F6. History unit 1: 🎨 Cave Painting Studio, a project next to the Source Investigator (open from the start). Round 1: paint on a cave wall in earth colors with a finger or mouse, hand stencils, undo, and send it with no words. The teacher writes what they think it shows (teacher app, Projects tab: Send my guess). Round 2: the student compares the guess with what they meant and what would make it clearer, and names something a cave painting could never show a historian; then the teacher verifies. The picture is a small JPEG saved in the project's answers (no new database setup). The guess needs the hosted teacher app; in local mode a grown-up can only verify the painting
- [x] F7. Extras for one student (teacher app, student page, 📋 Extras): a Fact Sprint with chosen skills and times tables (specific tables or a mix), or a Word Workshop exercise (practice cards, word sprint, spell it), for a set number of minutes a day. They show on the student's town page as "📋 Today's extras" with minutes done and a ✅, and reset each day. Saved in quiz_overrides as `extras` (no migration). The daily plan (F10) will pick these up
- [x] F8. Daily minutes per subject (teacher app, student page, 🎯 Time goals): an every-day number for each subject and changes for single days (0 too). The student sees "🎯 Today's time goals" on the town page with active minutes done and a ✅. Saved in quiz_overrides as `subjectGoals` (no migration needed after all)
- [x] F9. The Ledger in Pet World, automated from what she does in the app (`LEDGER.md`, 8 steps): a day log with time per lesson and every score, "I'm done for today" with the day's summary, a record in Supabase, outside work, importing the old Ledger files, and courses with suggested grades the grown-up can override or add to. Feeds F10 and F11
- [x] F10. Student daily plan: assigned work linked to the real activities, marked ✓ done, ⏳ waiting for feedback, or to do; time per subject from Practice time; a "finished" summary of time and specific work to confirm before it goes to the Ledger
- [x] F11. Year transcript built from the Ledger (LEDGER.md step 7: the 📜 Transcript tab)
- [ ] F12. More make-it-in-the-app History activities like the cave painting (plan: `HISTORY-ACTIVITIES.md`). Build order:
  - [x] F12a. ⛏️ Dig Sites (one per unit, Units 1–4 built): find famous ancient items, use the clues to work out where they came from, and tap it on a world map. A 🦖 "Before History" fossil dig is a bonus in Unit 1. Still to pair with the museum curator and the timeline sort.
  - [x] F12b. ✍️ Scribe School (Units 3–4): cuneiform on clay, hieroglyphs on papyrus, Shang oracle bones and Greek letters, saved to the Art Studio gallery.
  - [ ] F12c. 🗺️ The Lost Treasures Chase (Units 4–5): an original detective chase (not Carmen Sandiego), with Silk Road trading in Unit 5. The owner built it outside this repo as "Treasure Chase": next, bring in its code and decide where it opens (History activity or Arcade).
  - [ ] Ideas for later, by unit (details in `HISTORY-ACTIVITIES.md`): museum curator (Unit 1); forager or farmer for a day (Unit 2, may be built outside this repo); build a river city (Unit 3); coin designer and road builder (Unit 4); Silk Road trading (Unit 5); plan a voyage (Unit 6); timeline sort and primary source detective (any unit).
- [x] F13. 🎨 Art Studio and gallery: paint any time on the cave-wall canvas (separate from the History project); save paintings to a gallery (about 8 to 10, kept in the save), reopen or delete them; frame one for the Pet Room for Pet World coins (about 50) as a placeable decoration. More colors and stencils to buy with coins as they become available (for example, opened by later History units). The project painting gets "Save to my gallery" next to Send to teacher
- [x] F14. 📋 More detail in "I'm done for today": list the skills she mastered that day and the tests and quizzes she passed (with scores), on her day screen and in her saved Ledger day, so the teacher Ledger and transcript (F9 to F11) can use them.
- [x] F15. 🧠 Brain stretches (`BRAIN-GAMES.md`): 12 brain games (source `src/brain-games`, built to `public/brain-games`), not in the Arcade. 3 random games each morning and after each core subject on the daily plan, with no skipping; the teacher blocks games from the cycle in class settings. Each game starts easy and moves up after 3 results in a row at 85%+. Results go to the teacher's 🧠 Brain tab and the Ledger, and the time to its own 🧠 Brain stretch row
  - [ ] Still to do: plainer, kid-friendly wording inside the games (their screens still say things like "Right Inferior Frontal Gyrus"). Word Builder and Pattern Matrix are done
  - [x] Fresh puzzles every round (Pattern Matrix from rules, Word Builder's bigger word list), levels that go down as well as up, extra time at the easiest level, and "Your best yet!" (`BRAIN-GAMES.md`, "Never crushing")
- [x] F16. 🕹️ Arcade open and close: "Open the Arcade" is the one main switch and Free Play only sets how students get in; each game's switch works in Free Play too (Open all / Close all); a student playing a game the teacher closes is sent back within a minute
- [ ] F17. 🖼️ Fix Museum Caper (source `src/arcade/museum-caper`, built to `public/arcade/museum-caper`): the owner will describe what's broken
- [x] F18. 🧭 Teacher Quick setup: a new class starts with brain stretches on and opens on one page of every on/off choice; Settings links back to it
- [x] F19. 🐾 Teacher ⇄ student: Open Pet World and Student view (class code filled in) in the teacher app; a clearer teacher button on the join screen
- [x] F20. 📦 `npm run import-game` for Arcade and Brain Games built outside Pet World (`IMPORT-GAMES.md`)
- [x] F21. 🤸 Stand-and-stretch breaks (`MOVE-BREAKS.md`): when a student finishes one subject and starts another, her pet leads 4 moves (20 seconds each), no skip; teachers switch it on or off, set the minutes, and pick the moves
- [x] F22. 🪞 English Unit 3: Pronouns in the new Mirror Library (Khan Grammar Unit 3, all 11 skills in Khan’s order, 5 block quizzes, unit test pass 9 of 11). It opens after the Verbs unit test; the Poetry Library (adjectives and adverbs, Khan Unit 4) moves to fourth. Review list: `PRONOUNS-review.md`
- [x] F23. 🎓 After an English unit test is passed, the unit page links to Khan’s matching unit test (when Khan is on); a sent-back written answer has a Fix it button on the unit page too, and still opens if the question was reworded or hidden since
- [x] F24. 📚 English libraries follow Khan Academy Grammar unit by unit: 4 Adjectives and adverbs (🎨 Poetry), 5 Prepositions and conjunctions (🔗 Link), 6 End marks, commas, and apostrophes (✏️ Punctuation), 7 Colons, semicolons, and more (⏸️ Pause), 8 Sentences and clauses (🧩 Sentence), 9 Conventions of standard English (📏 Rule), 10 Usage and style (🪶 Style). Vocabulary, reading and writing libraries come after. Only unbuilt units moved.
- [x] F25. 🎉 Theme days (`THEME-DAYS.md`): 18 rotating themes and 6 special days (Pi Day, Earth Day, Space Day, Pirate Day, Costume Day, the 100th day of school), earned by finishing the whole plan the day before when a grown-up says yes (grown-up PIN), announced after the morning brain stretch; teachers can choose every school day or Fridays instead, and which themes
- [x] F26. 🎨 English Unit 4: Adjectives and Adverbs in the Poetry Library (Khan Grammar Unit 4, all 10 skills in Khan’s order, 4 block quizzes, unit test pass 8 of 10, then the Khan unit test link). Review list: `MODIFIERS-review.md`
- [x] F27. 📎 Outside work: she adds it on Today's plan (course, activity, minutes, grade, up to 3 photos); teacher reviews it in the Ledger (✅ or 🔁 redo with a note). Needs migration `20261020000000_outside_work.sql`. See `OUTSIDE-WORK.md`
- [x] F28. 🎭 Demo class for showing other teachers: 8 made-up students, 6 weeks of work, class code DEMO26, PIN 1234, reset with `select public.demo_reset(...)`. See `DEMO.md`
- [x] F29. 📇 Review for the test: optional flashcards of each English unit's terms (gerund, aspect, antecedent…), then 8 mixed questions, before the Pet World test or the Khan test. See `TEST-REVIEW.md`
- [x] F30. 🔤 Word Workshop: any Word Workshop minutes count toward a Word Workshop extra (fixes a stuck warm-up); grown-up PIN skips the warm-up for a day; best device voice, a voice picker, and 🐢 by-syllable reading with syllables shown after each answer. See `VOCAB.md`
- [x] F31. 🔤 Word Workshop adapts: word levels (easier, middle, harder) that drop after 2 misses and rise after 4 right; spelling mistakes named by pattern (pre/per, doubles, -ant/-ent…) with a tip; teacher Vocabulary tab suggests words per pattern; bigger spelling box. See `VOCAB.md`
- [x] F32. 🔁 Fix first: anything sent back goes at the top of Today's plan every day until it's fixed; the plan isn't done (no theme day) while one is open; "I'm done for today" lists them. See `DAILY-PLAN.md`
- [x] F33. 🐑 Biology Unit 2 at the Petting Zoo (Organism growth and reproduction): 8 lessons with “why it matters” stories, 2 quizzes, a 24-question unit test, tour-guide role play, review flashcards, three in-browser labs (Clone Island vs. Mix Island, Parenting Strategy Lab, Duck Pond Lake Lab), a field guide project and three kitchen labs with data tables and photos. See `SCIENCE-UNIT2.md`
- [x] F34. ✋ I have a question: a big button on every assignment; she describes the problem and can add a picture of the screen, time stops, and she goes back to her plan with that place closed until the teacher (or a grown-up with the PIN) answers. Ledger days are shorter: one time line, one plan line, each lesson once with its tries merged. See `QUESTIONS.md`, `LEDGER.md`

## Database files, in the order they were run

1. `20260923000000_pet_town.sql` ✅
2. `20260925000000_drills.sql` ✅
3. `20260926000000_drill_settings.sql` ✅
4. `20260927000000_teacher_tools.sql` ✅
5. `20260928000000_quizzes.sql` ✅
6. `20260929000000_practice_time.sql` ✅
7. `20260930000000_report_null_keys.sql` ✅
8. `20261017000000_ledger.sql` ✅ (Ledger step 3)
9. `20261018000000_art.sql` ⏳ run this one in Supabase (Art Studio gallery, F13)

All seven are run in Supabase. Never edit one of these files. Any change goes in a **new** migration file.

## Notes from reviews

- Quizzes appear only after **every skill in a station is mastered**. With "Passing a station quiz opens the next station" on (the default), the next station opens only after that quiz is passed. Stations that were open before the quiz update stay open.
- Skill mastery is a rolling recent-results rule: at least 4 problems attempted and at least 75% perfect across the most recent 8. Older results roll out as new problems are completed.
- During quizzes, right and wrong answers both show a neutral "Answer saved". ✓/✗ appears only on the summary.
- Quiz and test problems are **not** logged to `problems`, so the teacher's skill grid stays practice-only. Quiz results live in `assessments`.
- Quiz settings rules live in one place (`registry.ts`) and are shared by the game and the teacher app.
- The Scale's line-up step only appears when the two numbers have different decimal places; otherwise both choices look the same.
- Each new shop opens for a student only after she passes the Unit Test of the shop before it (a teacher can excuse the test, or open the shop for the whole class in Settings). Local mode's "Unlock every station and shop" opens everything.
- When Free Play is explicitly selected, it ignores the Arcade master/game switches and coin admission; students can launch any available game while today's banked math time remains. Paid-entry mode retains the Arcade and per-game switches, daily admission, and ticket rules. Neither mode has a once-a-day launch limit.

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

- [ ] **My Pet Room:** MVP in progress (`PET-ROOM.md`). Students can place owned decorations, drag or keyboard-nudge them, and tap their larger helper for a reaction. Existing display-case stickers seed the first room; room decorations are image-only with accessible labels. Arcade-ticket furniture is cataloged but held until ticket awards are secure.
- [ ] **Dress-up:** MVP in progress (`PET-ROOM.md`). Wearables have separate saved ownership/equipment and movable saved positions, coin purchases, a math-streak reward, and Arcade-ticket exclusives held until ticket awards are secured.
- [ ] **Arcade:** in progress. Teacher class settings can enable the Arcade and individual games, select Free Play (no admission or ticket rewards) or paid mode, and configure Corsair tickets per 10,000 points, Whack tickets per completed round, Mine Walker tickets per reward (each paid once, ever) and Endless rows per ticket (`docs/ARCADE-MINE-WALKER.md`), a Game-of-the-Day bonus, and a daily cap. Paid mode charges 100 coins once daily and allows one arcade minute per completed practice order. The host validates same-origin iframe/run IDs, deduplicates round reports, calculates ticket awards, and limits them to the class cap; server-side anti-tamper validation and browser review remain. Corsair's Cove has grid-path chasing, faster guard pursuit, and corrected tunnel navigation; Whack-a-Mole counts dazed-mole clicks as misses, blocks duplicate hits, and caps freeze bonuses at 30 seconds per round. Museum Caper (source in `src/arcade/museum-caper`, built to `public/arcade/museum-caper`) saves and resumes through the host and reports paintings stolen when a game ends; it earns only the Game-of-the-Day bonus. Triad Arcade (`src/arcade/triad-arcade`, built to `public/arcade/triad-arcade`) reports each finished game the same way; its profile, achievements and leaderboard stay in the browser's local storage.
- [ ] **English/Spanish localization:** Global language toggles are in the student and teacher headers. The student choice is saved with student progress; the teacher choice is saved in that browser. Shared interface strings and selected generated prompts are translated, but full reviewed Spanish coverage remains for generated problems, teacher reports/settings, and both embedded Arcade games. Untranslated strings currently remain in English.
- [ ] **House tours:** not built.
- [ ] **Pet Trips, Greenhouse, and Class Party Jar:** not built.

The owner's preferred order remains **My Pet Room and Dress-up first**, then the Arcade. The room and wardrobe MVP are underway; Arcade development is also in progress following the later decision to bring in the two game prototypes. The catalog and Game of the Day rotation should stay open to additional games.

1. Things to do with the pets and decorations they own
🏠 My Pet Room. Kids drag their decorations anywhere in a room: rug, fountain, trophy shelf, pizza oven. Their pets wander around, nap on the rug and splash in the fountain. Tapping a pet makes it do a trick or show a little speech bubble ("I love this cactus!"). More stickers means a busier, livelier room.
🎩 Dress-up. Cheap accessories like hats, bows, sunglasses and a cape to put on the helper pet. The pet wears them while "helping" at the shops.
🏡 House tours. A class gallery where kids visit each other's rooms and leave a ❤️ or a stamp like "cute fountain!" Stamps are picked from a set list, with no typing, so nothing needs moderating. Being seen is a strong reason to keep decorating.
2. The Arcade: games that spend coins and award arcade-only prizes

Pet World coins stay the reward for math. Arcade admission costs 100 coins once per day; after admission, the student can play for one minute per completed math practice order that day. No additional coins are charged between games. Arcade tickets are a separate currency for arcade-only prizes and never convert to Pet World coins.

🏴‍☠️ Corsair's Cove: a maze chase where math refills the ship's ammo.
🔨 Whack-a-Mole Stats Lab: a timed round with score statistics.

**Future arcade ideas (not yet scheduled):**
- 🧠 Sticker Memory: a memory-matching game using stickers the student owns.
- 🎲 Computer-vs-human Bingo.
- 🔤 Hangman-style word game.
- 🐾 Pet Dash: the helper pet runs and hops over cones (like geometry dash)
- 🎯 Treat Toss: flick treats into the pet's bowl (like angry birds)
- 🏁 Pet Race: a quick-tap race (like subway surfer)
- 🧭 Minefield Run: guide a character across a map; solve math to clear mines or use movement tools.
- 🪽 Flappy Answer: guide a character through the opening labeled with the answer to a displayed problem.
- 🕵️ Squad Sneak: guide a stick-figure squad past patrols; solve math to open routes or use gadgets.
- ⚓ Another original maze-chase game in the Corsair's Cove spirit.

Games can award arcade tickets or trophies, never Pet World coins, so arcade play cannot replace math as a way to earn coins or play time.

3. Reasons to come back tomorrow
✈️ Pet Trips. Send a pet on a trip, like the beach or the mountains. It comes back after a real day with a postcard for a travel scrapbook. The postcards are fixed, not a random prize draw.
🌱 Greenhouse. Buy seeds and plants grow over several days. Each finished order waters them. A fully grown plant becomes a decoration.
🎉 Class Party Jar. Everyone can drop coins in a shared jar. When it's full, the whole class unlocks something, like confetti in the town or a party hat for every pet. You could pair it with a real classroom reward.
A few guardrails I'd build in
No random paid prizes, so nothing like loot boxes for kids.
Math practice is the only way to earn Pet World coins and unlock arcade minutes.
Arcade tickets cannot pay admission or be converted to Pet World coins.
Short play sessions, with teacher controls for the arcade and its daily limit.
Everything stays out of the way during quizzes.

### Prep: finishing 3p (Pet Room, Dress-up, Arcade)

Build steps 1 to 4 in `PET-ROOM.md` are done. What is left, in order:

1. **Owner decision first: how secure do tickets need to be?** Today tickets, like Pet World coins, live in the student's saved state, which the student's own browser writes. Two options:
   - **A. Keep tickets client-side (small).** Same trust level as coins. Add only sanity limits in `normalize` (tickets can't exceed a ceiling, `ticketsEarnedToday` can't exceed the class cap). Turn on the ticket wearables and furniture.
   - **B. Server-side tickets (medium).** New migration with an `arcade_rounds` table (student, game, run id, score, tickets, day) and an `arcade_award(run_id, game, score)` function that checks the run id is new, recomputes tickets from the class settings, and enforces the daily cap; the game shows the server's ticket balance. Ticket purchases go through a second function. This is `PET-ROOM.md` step 5 as written.
2. **Browser review** (`PET-ROOM.md` step 6) at iPhone SE size and on a laptop: room dragging and keyboard nudging, stickers in and out of the room, dress-up positions, Free Play vs paid mode, admission once a day, minutes per completed order, ticket cap, prize shop, and both games inside the Arcade frame.
3. **Hidden during quizzes:** confirm the room, dress-up, and Arcade can't be opened mid-quiz or mid-test.
4. Then mark My Pet Room, Dress-up, and the Arcade done here and in `PET-ROOM.md`.

After 3p: House tours (needs a read-only class gallery: a new Supabase function that returns classmates' room layouts, no free text), then Pet Trips, Greenhouse, and the Class Party Jar, and the 7th grade plan before next school year.

**Owner decision:** My Pet Room and Dress-up are the preferred next major features. Arcade work is already in progress to integrate the two imported game prototypes; finish its prize shop, secure round-result handling, teacher controls, and browser review before calling it done.