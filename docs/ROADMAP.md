# Pet Town roadmap

Work top to bottom. Each plan has its own step-by-step file in `docs/`. Give the AI coder **one step at a time**, and check `git log -1 --stat` after each.

## Done

- [x] Unit 1: Pet Café, 4 stations and 14 Khan skills, with step-level diagnostics and mix-up detection
- [x] Times-table practice pop-ups, Fact Sprint, music, backups
- [x] Supabase backend: class codes, PINs, saves, live teacher dashboard
- [x] Deployed on Vercel
- [x] Rewards: unlock rules, celebration, shop by unit, collections (`REWARDS.md`, `TASK-rewards.md`)
- [x] Visible tip timer and counting accuracy

## Next up

| # | Work | Plan | Depends on | Size |
|---|---|---|---|---|
| 1 | **Sprint auto-advance** when the answer is right | `SPRINT.md`, Part A | nothing | small |
| 2 | **Rewards you can see:** Sticker Book with boxes to fill, town display case, set-completion bonuses, bigger celebrations | `REWARDS-DISPLAY.md` | nothing | medium |
| 3 | **Drills:** turn the times-table pop-up into a general drill system | `DRILLS.md` + run `20260925000000_drills.sql` | nothing | medium |
| 4 | **Drill settings:** adaptive pop-ups, teacher on/off and timing, extra time for individual students, "not helping" flags | `DRILL-SETTINGS.md` + run `20260926000000_drill_settings.sql` | #3 | large |
| 5 | **Sprint includes unlocked skills** | `SPRINT.md`, Part B | #3, #4 | medium |
| 6 | **Merge the Pet Shop and Sticker Book** into one screen | `SHOP-BOOK.md` | #2 | small |
| 7 | **Scaling down and simplest form** in the café (ratio tables going down, simplest form at the Counter and Kitchen) | `SIMPLIFY.md` | nothing | small |
| 8 | **Phones and tablets:** on-screen number pad, Check buttons, ladder auto-advance, small-screen layout | `PHONE.md` | nothing | medium |
| 9 | **Read the order first:** a prominent question ticket, a visible step plan, reading time that doesn't cost tips, read-aloud | `READ-FIRST.md` | nothing | medium |
| 10 | **Teacher tools:** copy the class list with PINs, print all PIN cards, reset a student | `TEACHER-TOOLS.md` + run `20260927000000_teacher_tools.sql` | #4 | medium |
| 11 | **Unit 2: Bakery** (5 stations, 16 Khan skills) | `BAKERY.md`, then `BAKERY-0-ENGINE.md`, `BAKERY-1-SCALE.md`, … | #3, #4 | large |
| 12 | **Practice time:** sign-ins and active minutes per student, weekly totals, and a 4-week chart on the dashboard | `PRACTICE-TIME.md` + run `20260929000000_practice_time.sql` | quizzes SQL | medium |
| 13 | **Music:** 4 tracks to choose from, a volume slider, and a teacher "Allow music" switch | `MUSIC.md` | #12 SQL for step 3 only | small |
| 14 | **4th grade version** (follows the workbook, with Khan links, same class features) | planned after the Bakery starts | #11 step 0 | large |

### Checklist

- [x] 1. Sprint auto-advance: step A1
- [x] 2. Rewards display (5 steps)
- [x] 3. Drills: steps 1 through 5. At step 4, the owner runs `20260925000000_drills.sql` in Supabase
- [x] 4. Drill settings: steps 1 through 6. At step 1, the owner runs `20260926000000_drill_settings.sql` in Supabase
- [x] 5. Sprint skill mix: steps B1 through B4
- [x] 6. Shop and Sticker Book merge: steps 1 through 3
- [x] 7. Scaling down and simplest form: steps 1 through 4
- [x] 8. Phones and tablets: steps 1 through 4
- [x] 9. Read the order first: steps 1 through 4, plus read-aloud and adjustable reading time
- [X] 10. Teacher tools: steps 1 through 5. At step 1, the owner runs `20260927000000_teacher_tools.sql` in Supabase
- [ ] 11. Bakery
  - [ ] Step 0: engine for more than one shop (`BAKERY-0-ENGINE.md`, 5 steps)
  - [ ] Station quizzes and unit tests for every shop (`QUIZZES.md`, 7 steps; run `20260928000000_quizzes.sql` after the teacher-tools SQL)
  - [ ] Station 1: The Scale (`BAKERY-1-SCALE.md`, 4 steps)
  - [ ] Stations 2 to 5 (plans to come)
- [ ] 12. Practice time: steps 1 through 5
- [ ] 13. Music: steps 1 through 4
- [ ] 14. 4th grade version (plan to come)

## Database files, in the order they must be run

1. `20260923000000_pet_town.sql` ✅
2. `20260925000000_drills.sql` ✅
3. `20260926000000_drill_settings.sql` ✅
4. `20260927000000_teacher_tools.sql` (item 10)
5. `20260928000000_quizzes.sql` (quizzes)
6. `20260929000000_practice_time.sql` (item 12)

All six were run in this order on real PostgreSQL 16 with no errors, and tested as a teacher, a student, and a stranger.

## Before other teachers or classes use it

- [ ] Turn **Confirm email** back on in Supabase (Authentication → Sign In / Providers → Email)
- [ ] Add a CAPTCHA to the student join screen, then turn CAPTCHA on in Supabase (see the README)
- [ ] Write a short privacy policy: first names only, what's stored, who can see it, how to delete it
- [ ] Decide on a custom domain, if you want one (Vercel → Settings → Domains)
- [ ] Keep an eye on Supabase's free plan: it pauses after about a week with no activity

## After that

- [ ] Selling: TPT listing or a teacher sign-up page
