# Pet Town

6th grade math practice games with step-level diagnostics for teachers. The Pet Café covers Khan Academy's 6th grade Unit 1 (Ratios), with 14 skills across 4 stations. Every problem is split into **idea** steps and **arithmetic** steps, 15 common mix-ups are detected, and missed times-table facts trigger a practice pop-up.

- **Students** join with a class code, their name, and a 4-digit PIN. No email is needed.
- **Teachers** sign in, build rosters, print PIN cards, and watch a live dashboard. It shows a skill grid, suggested small groups by mix-up, and class-wide times tables.

## Working with AI coding assistants

Read `AGENTS.md` first. Copies named `CLAUDE.md` and `.github/copilot-instructions.md` are read automatically by Claude Code and GitHub Copilot. Run `npm run verify` before every commit. It fails if the real code has been replaced.

## Stack

| Piece | What it does |
|---|---|
| Vite + TypeScript | Two pages: the game (`index.html`) and the teacher app (`teacher.html`) |
| Supabase Postgres | Classes, students, saves, and learning events. Row-level security keeps each teacher to their own classes |
| Supabase Auth | Email and password for teachers. Anonymous sessions for students, linked to a roster entry by PIN |
| Supabase Realtime | The dashboard refreshes as students finish problems |

## Project layout

```
index.html               game page
teacher.html             teacher page
src/shared/registry.ts   skills, stations, mix-ups: one source of truth for both pages
src/game/game.js         the game (generators, café engine, sprint, shop, Town Hall)
src/lib/supabase.ts      Supabase client setup
src/lib/studentBackend.ts  student join, save, and event logging (queued offline-safe)
src/teacher/main.ts      teacher app: auth, classes, roster, PIN cards, settings
src/teacher/report.ts    dashboard rendering
supabase/migrations/     database schema, security rules, functions
```

The game is JavaScript for now. It was ported directly from the working single-file version, and new code is TypeScript. `allowJs` is on, so the game can be converted file by file.

## Setup

### 1. Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste in `supabase/migrations/20260923000000_pet_town.sql`, and run it. If you use the Supabase CLI, run `supabase db push` instead.
3. Go to **Authentication → Sign In / Providers** and turn on **Allow anonymous sign-ins**. Students need this.
4. Also in **Authentication**, review the rate limits for anonymous sign-ins. Anyone who loads the page can start one. Leave CAPTCHA off for now: turning it on stops students from joining until the join screen has a CAPTCHA widget (see "Not yet verified" below).
5. Under **Authentication → URL Configuration**, set the Site URL to your deployed address, so teacher confirmation emails link back correctly.
6. Copy the **Project URL** and **anon public key** from **Project Settings → API**.

### 2. Run locally

```bash
cp .env.example .env      # paste the URL and anon key
npm install
npm run dev
```

- Game: http://localhost:5173/
- Teacher app: http://localhost:5173/teacher.html

### 3. Deploy

Push to GitHub, then import the repo in Vercel or Netlify. Both detect Vite automatically. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables. The teacher app lives at `/teacher.html`.

CI (`.github/workflows/ci.yml`) runs a type check and a build on every push.

## How it fits together

**Joining:** A teacher adds names, and the database stores only a hash of each PIN. A student types the class code, picks their name, and enters their PIN. The game creates an anonymous Supabase session, and `claim_student()` links it to that roster entry. Five wrong PINs lock the student for 10 minutes. The teacher can issue a new PIN at any time.

**Saving:** The whole town (coins, pets, progress) is one JSON row per student in `saves`. It's also cached on the device under a separate key per student, so shared classroom computers never mix towns. Whichever copy is newer wins when a student signs in.

**Learning events:** These go into three tables:
- `problems`: one row per finished order.
- `attempts`: one row per first try at a step, plus any later try that reveals a new mix-up, plus sprint answers.
- `practice_popups`: one row per times-table pop-up.

Events are queued in localStorage and sent in batches, so a dropped connection loses nothing.

**Dashboard:** `class_report()` aggregates everything in the database and returns one summary per student. A realtime subscription on `problems` refreshes the dashboard a few seconds after each finished order.

**Local mode:** If the build has no Supabase settings, the game runs entirely in the browser with a name screen instead of the join screen. That keeps a single-file version possible later.

## Moving an existing town in

The claude.ai version of Pet Town has a **Make a backup code** button at Town Hall. Sign in to the new game, go to **Town Hall → Restore from a backup code**, and paste the code. The name and class come from the roster, and everything else comes from the code.

## Adding a shop

1. Add the skills, a station list, and any new mix-ups to `src/shared/registry.ts`.
2. Add generators and a shop screen in `src/game/`.
3. Log events with `shop: 'bakery'` (or the new shop's name). The tables and the dashboard already work per skill.

## Planned: reward expansion

See [`docs/REWARDS.md`](docs/REWARDS.md). It's the build spec for themed animals and decorations in each unit, earned by mastery, stations, streaks, and sprints.

## Privacy notes

Students under 13 are covered by COPPA, and many districts require a signed student data privacy agreement before teachers can use a tool.

This app collects a display name and learning activity only. There are no student emails or passwords. Keep it that way, and write a short privacy policy before inviting other teachers.

Supabase offers a data processing agreement (DPA) for hosted projects.

## Not yet verified

- The SQL migration has not been run against a real Postgres database. Run it in a fresh Supabase project first. If anything errors, paste the message into Claude Code.
- The Supabase calls were tested against an in-memory stand-in, not a live project. This covered joining with a PIN, saving, event logging, the dashboard, and switching players.
- CAPTCHA isn't wired in yet. Before sharing beyond your own classes, add a Turnstile or hCaptcha widget to the join screen, pass its token to `signInAnonymously`, then turn CAPTCHA on in Supabase.
