# Pet Town roadmap

Work top to bottom. Each plan has its own step-by-step file in `docs/`.

**How we work:** the owner gives the AI coder **one step at a time**. After each push, Claude reviews the diff and tests it in a browser before the next step starts. The coder's reply always ends with `git log -1 --stat`.

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
- [x] Quizzes, steps 1 to 6b (`QUIZZES.md`): rules and state, quiz and test mode, station cards and quiz unlocking, unit tests, logging, the teacher settings card, and dashboard quiz columns

## Next up

| # | Work | Plan | Depends on | Size |
|---|---|---|---|---|
| 1 | **Owner review: quizzes on the live site.** Hard-refresh the game on the production address and confirm the new version loads. You should see "Pass each station quiz to open the next station", and 📝 Station Quiz on The Counter for a student with Basic ratios mastered. Play one quiz as Abi. | — | 6b | small |
| 2 | **Small fixes** (one commit each): (a) "the The Kitchen quiz" wording; (b) log queue: a rejected batch shouldn't block every later log | — | nothing | small |
| 3 | **Quizzes 6c:** student detail quiz history, **Excuse quiz**, **Clear review** | `QUIZZES.md` step 6 | 6b | medium |
| 4 | **Quizzes 7:** verify checks for quizzes | `QUIZZES.md` step 7 | 6c | small |
| 5 | **Bakery station 1: The Scale** (add, subtract, decimal word problems; opens the Bakery) | `BAKERY-1-SCALE.md` | #4 | medium |
| 6 | **Practice time:** sign-ins and active minutes, weekly totals, 4-week chart | `PRACTICE-TIME.md` | SQL already run | medium |
| 7 | **Music:** 4 tracks, a volume slider, and a teacher "Allow music" switch | `MUSIC.md` | #6 | small |
| 8 | **Bakery stations 2 to 5** | plans to come | #5 | large |
| 9 | **4th grade version** (follows the workbook, with Khan links, same class features) | plan to come | #5 | large |

### Checklist

- [X] 1. Owner review of quizzes on the live site
- [X] 2. Small fixes: (a) wording, (b) log queue
- [X] 3. Quizzes 6c
- [X] 4. Quizzes 7
- [X] 5. The Scale: steps 1 through 4. Step 1 fills `BAKERY_STATIONS[0].skills` in the same commit that adds the skills. The last step adds `open: true` to the Bakery entry in the `BUILDINGS` **list**
- [ ] 6. Practice time: steps 1 through 5
- [ ] 7. Music: steps 1 through 4
- [ ] 8. Bakery stations 2 to 5 (plans to come)
- [ ] 9. 4th grade version (plan to come)

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

## Before other teachers or classes use it

- [ ] Turn **Confirm email** back on in Supabase (Authentication → Sign In / Providers → Email)
- [ ] Add a CAPTCHA to the student join screen, then turn CAPTCHA on in Supabase (see the README)
- [ ] Write a short privacy policy: first names only, what's stored, who can see it, how to delete it
- [ ] Decide on a custom domain, if you want one (Vercel → Settings → Domains)
- [ ] Keep an eye on Supabase's free plan: it pauses after about a week with no activity

## After that

- [ ] Selling: TPT listing or a teacher sign-up page
