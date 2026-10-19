# Demo class

A pretend class for showing Pet World to other teachers. They sign in to a demo teacher account and see a class of 8 made-up students with about 6 weeks of work. Every page has something on it: the dashboard, small groups, pop-ups, the skill grid, the Ledger, Grades, the Transcript, written answers, projects, Reading Logs, brain stretches, Khan results and outside work with photos. They can also open the student side as any of the 8 kids.

Nothing here touches real students. The demo lives in its own teacher account.

## The students

| Student | What a visitor will see |
|---|---|
| Maya R. | Ahead in everything; on right now (🟢 Right now); a waiting piano log with a photo; earned a Pajama Day |
| Jonah K. | Steady; doing math right now, so he counts as "active"; Spanish outside work, already checked |
| Priya S. | Strong in English, mixes up ratio order in math; a Germination Lab waiting for review |
| Eli M. | Struggling: the 7s and 8s pop-ups aren't helping, adds instead of multiplies, a quiz in review, a written answer sent back for a redo, a Ledger day a teacher added a note to |
| Sofia L. | Science co-op with photos waiting, a math-workbook photo sent back ("page 53 is missing") |
| Theo B. | Misses a lot of days; a project waiting; a quiz in review |
| Ava W. | Reading Log with a reading-quiz essay to check; an extra PE course on her Grades tab |
| Leo D. | Joined last week, so only a few days of work |

## Set it up (once)

1. **Make the demo account.** Supabase → **Authentication → Users → Add user → Create new user**. Email `demo@petworld.example`, a password (the card uses `PetWorldDemo26`), and tick **Auto Confirm User**. Don't use your own account: a reset deletes every class the demo account owns.
2. **Load the demo.** The data is too big for one SQL Editor query, so it comes in 9 files in `supabase/demo/`. In Supabase → **SQL Editor**, run each one in a new query, in order:
   - `demo-0-functions.sql`
   - `demo-1-data.sql`, `demo-2-data.sql`, and on through the last data file

   Each file says "part 3 of 8" (and so on) on its first line.
3. **Build the class.** In a new query:
   ```sql
   select public.demo_reset('demo@petworld.example');
   ```
   It answers "Demo class ready: 8 students, class code DEMO26…".

If a part is missed, step 3 says which ones: "Only 6 of the 8 demo data files have been run. Missing: demo-5-data.sql…". Running a part twice is fine.

Or load them all from the Codespace terminal with the database connection string (Supabase → **Connect** → **Session pooler** URI):
```
sudo apt-get install -y postgresql-client
for f in supabase/demo/demo-*.sql; do psql "postgresql://postgres.…" -f "$f"; done
```

## Keep it fresh

`demo_reset` puts everything back: students someone removed, PINs someone changed, grades someone edited. It also moves the dates up so the work looks like it happened this week, with Maya and Jonah on right now. Run the `select public.demo_reset(...)` line before showing it to someone.

To reset it every school morning automatically, turn on **pg_cron** (Database → Extensions) and run once:
```sql
select cron.schedule('pet-world-demo', '0 15 * * 1-5', $$select public.demo_reset('demo@petworld.example')$$);
```
`0 15 * * 1-5` is weekdays at 15:00 UTC (pg_cron uses UTC): 11 AM in New York, 10 AM in winter. Dates follow New York time; for another time zone, pass it: `demo_reset('demo@petworld.example', 'America/Chicago')`.

## Changing the demo

The data comes from `scripts/make-demo.mjs`: the students, how fast each one learns, their written answers, projects, reading notes and outside work. After changing it:
```
node --experimental-strip-types scripts/make-demo.mjs
```
That rewrites the data files in `supabase/demo/`. Run the data files and step 3 again (the functions file only when it changes). The script uses the real question banks, so the Lessons tab's miss rates line up with real questions.

## Safety

- The demo functions can only be run from the SQL editor (or pg_cron), not through the app.
- `demo_reset` refuses an admin account.
- The `demo_seed_part` table has no policies, so the app can't read it.
