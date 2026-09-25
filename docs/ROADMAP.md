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

### Checklist

- [x] 1. Sprint auto-advance: step A1
- [x] 2. Rewards display (5 steps)
- [x] 3. Drills: steps 1 through 5. At step 4, the owner runs `20260925000000_drills.sql` in Supabase
- [x] 4. Drill settings: steps 1 through 6. At step 1, the owner runs `20260926000000_drill_settings.sql` in Supabase
- [x] 5. Sprint skill mix: steps B1 through B4
- [ ] 6. Shop and Sticker Book merge: steps 1 through 3
- [ ] 7. Scaling down and simplest form: steps 1 through 4

## Before other teachers or classes use it

- [ ] Turn **Confirm email** back on in Supabase (Authentication → Sign In / Providers → Email)
- [ ] Add a CAPTCHA to the student join screen, then turn CAPTCHA on in Supabase (see the README)
- [ ] Write a short privacy policy: first names only, what's stored, who can see it, how to delete it
- [ ] Decide on a custom domain, if you want one (Vercel → Settings → Domains)
- [ ] Keep an eye on Supabase's free plan: it pauses after about a week with no activity

## After that

- [ ] **Unit 2: Bakery.** Decimals, dividing fractions, multiplying and dividing decimals, in Khan's order. Includes its drills (place value, moving the decimal, reciprocals, simplifying) and turns on its reward set. A plan will be written when we get there
- [ ] Selling: TPT listing or a teacher sign-up page
