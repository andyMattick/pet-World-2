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

## Next up

| # | Work | Plan | Depends on | Size |
|---|---|---|---|---|
| 1 | **Practice time:** sign-ins and active minutes, weekly totals, 4-week chart | `PRACTICE-TIME.md` | SQL already run | medium |
| 2 | **Music:** 4 tracks, a volume slider, and a teacher "Allow music" switch | `MUSIC.md` | #1 | small |
| 3 | **Bakery stations 2 to 5** | plans to come | The Scale | large |
| 4 | **4th grade version** (follows the workbook, with Khan links, same class features) | plan to come | The Scale | large |

### Checklist

- [ ] 1. Practice time: steps 2 through 5 (step 1, the database file, is done)
- [ ] 2. Music: steps 1 through 4
- [ ] 3. Bakery stations 2 to 5 (plans to come)
- [ ] 4. 4th grade version (plan to come)

## Database files, in the order they were run

1. `20260923000000_pet_town.sql` ✅
2. `20260925000000_drills.sql` ✅
3. `20260926000000_drill_settings.sql` ✅
4. `20260927000000_teacher_tools.sql` ✅
5. `20260928000000_quizzes.sql` ✅
6. `20260929000000_practice_time.sql` ✅

All six are run in Supabase. Never edit one of these files. Any change goes in a **new** migration file.

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
