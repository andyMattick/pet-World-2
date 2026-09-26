# Teacher tools: copy the class list, and reset a student

**Status: planned.** Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## What teachers get

1. **See and copy PINs.** The Roster tab shows each student's PIN, and has a **Copy class list** button that copies everything needed to hand out logins:
   ```
   Pet Town — Period 3
   Go to: https://pet-world-2.vercel.app/
   Class code: K7MX2Q

   Abi — PIN 4821
   Ben T. — PIN 0937
   Carmen R. — PIN (click New PIN to show)
   ```
   Also add a **Print all PIN cards** button (every student with a visible PIN). On the Settings tab, add **Copy join instructions** (the link and class code only, with no PINs), for posting in Google Classroom.
2. **Reset a student.** From the Roster tab, or the student's detail view on the Dashboard, the teacher can start a student over. There are two choices:
   - **Reset town:** coins, pets, decorations, stations, and streaks go back to the start. The dashboard **keeps** their learning history.
   - **Reset everything:** the same as Reset town, plus their learning history is erased from the dashboard.

   Both keep the student on the roster with the **same PIN and the same extra-time settings**. It takes effect the next time the student opens the game or starts a shift.

### PIN privacy

PINs used to be stored only scrambled, so they could never be shown again. Now a readable copy is also stored in `students.pin_plain`.
- **Only the teacher can read it.** Students have no access to the `students` table, and `class_roster()` returns names only.
- Existing students show "(click New PIN to show)" until the teacher gives them a new PIN once.
- Logging in still checks the scrambled PIN.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open**. Then `git push` and paste `git log -1 --stat`.

### Step 1: Database

1. Add the provided file `supabase/migrations/20260927000000_teacher_tools.sql` **exactly as given**. Don't edit it or any older migration.
2. The owner runs it in the Supabase SQL Editor, after the drill-settings migration. It adds `pin_plain` and `reset_at`, stores readable PINs in `add_students()` and `reset_pin()`, adds `reset_student(p_student, p_clear_history)`, and makes `my_student()` return `reset_at`. Old app versions keep working.

Commit: `Add teacher tools migration`

### Step 2: Copy and print (teacher app)

In `src/teacher/main.ts`:
1. **Roster query:** add `pin_plain` to the students query in `renderRoster()`. Show a **PIN** column: the PIN, or "click New PIN to show" when it's null.
2. **Copy class list** button on the Roster tab. It copies the text exactly in the format shown above (class name, game link from `gameUrl()`, class code, a blank line, then one line per student in roster order). Use `navigator.clipboard.writeText`. If that fails, fall back to a selectable text box. Show "Copied!" for 2 seconds.
3. **Print all PIN cards** button. It reuses `printCards()` with every student that has a `pin_plain`.
4. **Copy join instructions** on the Settings tab: two lines, `Go to: <link>` and `Class code: <code>`.
5. After **Add and make PINs** or **New PIN**, the roster reloads so the PIN column updates.

Commit: `Copy and print class logins`

### Step 3: Reset a student (teacher app)

1. **On the Roster tab,** each student row gets a **Reset** button next to New PIN and Remove.
2. **In the student detail view** (`openDetail` in `src/teacher/report.ts`), add the same **Reset** button. Pass an `onResetStudent(id, clearHistory)` callback from `main.ts`, like the drill-settings callback. **Don't create a second Supabase client.**
3. **Reset opens a small confirm panel** with two choices, **Reset town** and **Reset everything**, plus **Cancel**. It explains in one line what each keeps. **Reset everything** needs a second click ("Click again to erase all of Abi's history").
4. **Both call** `sb.rpc('reset_student', {p_student: id, p_clear_history: <boolean>})`. Then show "Abi's town was reset" and reload the roster or dashboard.

Commit: `Reset a student from the teacher app`

### Step 4: The game honors resets

In `src/lib/studentBackend.ts`, add `reset_at: string | null` to `StudentInfo`, and have `refreshSettings()` also update `this.me.reset_at`.

In `src/game/game.js`:
1. **In `enterAs(me)`:** if `me.reset_at` is set and `(local.savedAt || 0) < Date.parse(me.reset_at)`, discard the local town and start from `fresh()`, keeping only `name` and `minStation`. The server copy was already deleted by the reset. Remember `S.resetSeen = me.reset_at`, and call `save()` so the fresh town is written to the server.
2. **At the start of `startShift()`,** after `refreshSettings()` resolves: if `Backend.me.reset_at` is newer than `S.resetSeen`, reset the town the same way, show the toast "Your teacher reset your town. Fresh start!", and go to the town screen instead of starting the shift. It **must not** interrupt a shift that's already running.
3. **Add `resetSeen: null`** to `fresh()` and make sure `normalize()` keeps it.
4. Local mode (no class) is unaffected.

**Browser test** with two windows: the teacher app, and the game signed in as Tester in a private window.
- Tester earns some coins.
- The teacher clicks **Reset town**.
- Tester starts a new shift: the toast appears, coins are back to 0, and nothing else breaks.
- Reload Tester's game. It stays reset, and the old town doesn't come back from the browser's copy.

Commit: `Game honors teacher resets`

### Step 5: Safety check

In `scripts/verify.mjs`, **add** these checks without removing any:
- `src/teacher/main.ts` contains `reset_student` and `pin_plain`.
- `game.js` contains `reset_at`.
- Some migration contains `function public.reset_student(`.

Update the protected-files table in exactly `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`, keeping them identical.

Commit: `Verify covers teacher tools`

## Acceptance checks

1. New students show their PIN on the Roster tab. Existing students show "click New PIN to show" until they get a new PIN.
2. **Copy class list** pastes into a document in the exact format above.
3. **Print all PIN cards** prints a card for every student with a visible PIN.
4. **Copy join instructions** pastes the link and class code only.
5. **Reset town:** the student's coins, pets, and stations go back to the start at their next shift or reload. The dashboard still shows their past work. Their PIN and extra time are unchanged.
6. **Reset everything:** the same, and the dashboard shows the student as if new.
7. A reset never interrupts a shift already in progress.
8. A student can't see any PIN, including their own, anywhere in the game.
9. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
