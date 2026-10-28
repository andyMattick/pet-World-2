# 📈 Insights: the last 5 days, read for you (and emailed)

Owner's ask (Oct 28, 2026): one place to open at the end of a day that sums up everything coming in, with recommendations from her struggles over the last 5 days (rolling) and ideas for the app from where she spends her time, the order she does things, when she struggles, the problems she misses most, and whether she uses the tools.

- **Where:** the first section of each student's page in the teacher app (tap a name on the dashboard).
- **How:** built-in rules, no AI. Same data in, same answer out.
- **Email:** ✉️ **Email me this now** on the section, and an optional daily email at an hour you pick (Settings → ✉️ Daily insights email, or the switch on Quick setup). The email needs the one-time setup below.

## What it shows

1. **Today:** minutes, % right on scored work, the first subject, tests passed, and warnings (a lesson under 70% today, a quiz not passed, ✋ questions).
2. **Last 5 days** (today and the 4 days before):
   - two small charts: active minutes per day and % right per day;
   - **Struggles**, ranked by how many misses back them up;
   - **Missed most**: the actual prompts she missed twice or more (and the math steps, with an example of what she typed and the answer);
   - **When she struggles**: by time of day, by place in her day (first subject, middle, last), before and after breaks, and by day of the week (2 weeks);
   - **Time and order**: minutes per subject against the plan's goal, her order of subjects each day, lessons vs. unit games vs. Arcade, idle time, weekdays with no work, lessons left partway, and screens she may be stuck on;
   - **Tools**: 📌 word flags, 📖 meaning look-ups, ✋ questions, 💡 written-answer hints, 🎬 lesson videos, 📇 review flashcards, 🧠 brain stretches and 🤸 breaks. "Not used in 5 days" shows once there's a work day in the window;
   - **Worth noting**: tests passed, mastered skills and first passes, lessons she turned around, math skills now 4-in-a-row perfect, streaks, plan items finished.
3. **Recommendations**, in two lists: **For her plan** and **Ideas for the app**. Each one shows its numbers and a confidence (●●● strong, ●●○ good, ●○○ just enough).

The section redraws with fresh numbers each time the dashboard reloads (it reloads when a student finishes a problem, quiz or test).

## The rules and minimums

All in `INSIGHT_RULES` at the top of `src/shared/insights.ts`. Nothing is said below these.

| What | Rule |
|---|---|
| Window | today and the 4 days before; day of the week looks back 14 days |
| A work day | 5+ active minutes, or any scored work |
| Math struggle | a skill with 5+ orders in the window and under 60% perfect (by skill from the problems list; by station from the day log if the list isn't loaded) |
| Lesson struggle | 6+ answers in practice or Think it through, under 70% right |
| Quiz or test | tried in the window, not passed, and not passed since |
| Mix-up | the same mix-up 2+ times in the window |
| Words to re-teach | 2+ words, each with 3+ tries and a third or fewer right |
| Spelling pattern | the same kind of slip 3+ times in the window |
| Missed most | a prompt or math step missed 2+ times in the window |
| Time pattern | 12+ scored answers in each group and a 15-point gap between best and weakest; otherwise "not enough data yet" or "no clear difference" |
| Breaks | answers 30 minutes before and after a 🧠/🤸 break or a 30-minute pause |
| Usual order | 3+ days with 2 or more subjects |
| Time vs. goal | 3+ work days with a goal of 10+ min/day; 1.5× or more is "takes longer", 60% or less is "falls short" |
| "Not used" ideas | after 3+ work days in the window |
| Arcade idea | Arcade at 25%+ of her time, out of 60+ minutes |
| Left partway | 2+ minutes in a lesson or quiz with no finish that day, 3+ times on 2+ days in one subject |
| Stuck | 15+ minutes on one screen with nothing finished |
| Idle | 35%+ idle, out of 60+ minutes on screen |

Confidence: ●●● at 3× the minimum, ●●○ at 1.5×, ●○○ at the minimum.

## Where the data comes from

- `class_report()` (the dashboard's report): quizzes and tests (`qz`), mix-ups, practice sessions (`ss`), her settings and plan (`qx`).
- Her save: the day log (`dayLog`: time per lesson, every score with its time, breaks, ✋ questions, finished plan items), time by subject, Word Workshop (`vocab`: 📌 flags, look-ups, spelling slips, answer history per word), lesson videos watched, reading quizzes, written answers, Think it through, ✋ questions, and the **miss log**.
- The `problems` and `attempts` tables, last 6 days: each math order with its time (for time-of-day and order patterns), and first-try misses (for "missed most" and mix-ups).
- **Miss log (new, Oct 28, 2026):** the game now keeps the last 80 lesson prompts she missed, with when (`S.missLog`, written in `recordEnglishAnswer`). Prompts missed before this version aren't in it.

Not tracked, so not shown: clicks on the Merriam-Webster 📖 link (only 📌 look-ups are saved), math step hints (they're part of every order), and time between taps inside a single question.

## Code

| File | What |
|---|---|
| `src/shared/insights.ts` | The analysis. Pure: no DOM, no Supabase, **no imports**, so the email function can use a copy of it. Also the email's HTML (`insightsEmailHTML`). |
| `src/teacher/insightsCard.ts` | The section on the student's page, and the ✉️ button. |
| `src/teacher/report.ts` | `openDetail` puts the section first; `renderClassReport` refreshes it after a reload. |
| `src/teacher/main.ts` | Loads the extra save fields and the last 6 days of problems and attempts; the Settings and Quick setup switch; calls the function for ✉️. |
| `supabase/functions/daily-insights/index.ts` | The Edge Function: builds the same Insights for a class and sends them with Resend. |
| `supabase/migrations/20261028000000_insights_email.sql` | `insights_class_report()` (class_report for the function) and the hourly pg_cron job. |
| `scripts/copy-insights.mjs` | Copies `insights.ts` and `registry.ts` into `supabase/functions/_shared/` before a deploy (that folder isn't committed). |

The class setting is `classes.game_settings.insightsEmail = {on, hour, tz}` (no new table). `tz` is the time zone of the computer that saved Settings.

## Setting up the email (one time, about 15 minutes)

You need: the Supabase project the app already uses, and a terminal on your computer in the Pet World folder (the one with `package.json`). Everything below is done by you; nothing here can be done from the app.

### 1. Make a Resend account and an API key
1. Go to <https://resend.com> and sign up **with the same email you sign in to the teacher app with**. (Until you add your own domain, Resend only delivers to your own Resend account's email. That's fine for you.)
2. In Resend: **API Keys → Create API Key**. Name it `pet-world`, permission **Sending access**. Copy the key (it starts with `re_`). You only see it once.
3. Optional, later: **Domains → Add Domain** to send from your own address (for example `insights@yourdomain.com`) and to send to other people. Then do step 3's optional line.

### 2. Sign in to Supabase from the terminal
```
npx supabase login
npx supabase link --project-ref <your-project-ref>
```
The project ref is the part of your Supabase URL before `.supabase.co` (also in Supabase → Project Settings → General).

### 3. Set the function's secrets
Make up a long random password for the hourly job (for example from a password manager). Then:
```
npx supabase secrets set RESEND_API_KEY=re_your_key_here
npx supabase secrets set INSIGHTS_CRON_SECRET=your-long-random-password
```
Optional:
```
npx supabase secrets set INSIGHTS_FROM="Pet World <insights@yourdomain.com>"   # only after your domain is verified in Resend
npx supabase secrets set APP_URL=https://your-pet-world-site.vercel.app         # adds an "Open the teacher app" link to the email
```
(`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already there; Supabase provides them.)

### 4. Deploy the function
```
npm run deploy:insights
```
That copies `src/shared/insights.ts` and `registry.ts` into `supabase/functions/_shared/` and runs `npx supabase functions deploy daily-insights --no-verify-jwt`. (`--no-verify-jwt` is needed: the function checks your sign-in itself, and the hourly job has no sign-in.) Run it again whenever `insights.ts` or the registry changes, so the email matches the page.

### 5. Turn on the hourly job
1. Supabase → **Database → Extensions**: turn on **pg_cron** and **pg_net** (the migration also tries, but the switches make sure).
2. Supabase → **SQL Editor**, run (with your project ref and the same password as `INSIGHTS_CRON_SECRET`):
   ```sql
   select vault.create_secret('https://<your-project-ref>.supabase.co', 'pet_world_project_url');
   select vault.create_secret('your-long-random-password', 'pet_world_insights_secret');
   ```
3. Still in the SQL Editor, open `supabase/migrations/20261028000000_insights_email.sql`, paste the whole file, and run it. (Or `npx supabase db push` if you use migrations from the CLI.)
4. Check it: `select jobname, schedule from cron.job;` shows `pet-world-daily-insights | 0 * * * *`.

### 6. Test it
1. Open the teacher app, tap a student, and press **✉️ Email me this now** at the top. It says "Sent to …" and the email arrives within a minute (check spam the first time).
2. Settings → **✉️ Daily insights email**: tick it, pick the hour, **Save**. At that hour (in the time zone shown) you get one email with every student.
3. If something's wrong:
   - "The email isn't set up yet (the daily-insights function is not deployed yet)": step 4 didn't finish.
   - "RESEND_API_KEY is not set": step 3.
   - "class report: … Has … insights_email.sql been run?": step 5.3.
   - "Resend said 403 …": you're sending to an address other than your Resend account's email without a verified domain (step 1.3).
   - No daily email: Supabase → Database → Cron jobs (or `select * from cron.job_run_details order by start_time desc limit 5;`) and Edge Functions → daily-insights → Logs. The function's answer lists `due`, `sent` and any `problems`.

To change the secret later, set both the function secret (step 3) and the Vault secret (`select vault.update_secret((select id from vault.secrets where name = 'pet_world_insights_secret'), 'new-password');`).
