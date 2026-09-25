# Drill settings: adaptive pop-ups and teacher controls

**Status: planned.** Build this **after** every step of `DRILLS.md` is done, because it uses the drill ids (`times:7`) and `DRILL_IMPL` from that plan.

Read `AGENTS.md` first. The same rules apply: **edit in place, never rewrite a file, and stop and ask if a step seems to need a rewrite.**

## Part 1: Design

### Goals

1. **Pop-ups adapt to each student.** A student who's solid on a fact doesn't get interrupted for one slip. A student who's struggling gets the full ladder. What counts as "slow" is based on each student's own pace.
2. **Teachers control pop-ups** for the whole class, with per-student overrides for accommodations.
3. **Teachers see whether pop-ups are helping,** and the game stops repeating a drill that clearly isn't working. Those students need reteaching, not more pop-ups.

### Settings

One settings object. The class has defaults, and a student can override any part of them:

```json
{
  "enabled": true,
  "types":    { "times": true, "placeValue": true, "decimalShift": true, "reciprocal": true, "simplify": true },
  "triggers": { "miss": true, "slow": true, "sprint": true },
  "slow":     { "mode": "adaptive", "idea": 15, "arith": 10, "sprint": 6 },
  "timeScale": 1,
  "maxPerShift": 3
}
```

| Setting | Meaning |
|---|---|
| `enabled` | Turns all pop-ups on or off |
| `types` | Turns individual drill types on or off. A type missing from the object counts as on |
| `triggers` | Which events can start a pop-up: a missed answer, a slow answer, the end of a sprint |
| `slow.mode` | `fixed`: slow means over the seconds below. `adaptive`: based on the student's own pace (see below), using these seconds as a guide |
| `slow.idea` / `arith` / `sprint` | Seconds. Allowed ranges: idea 5 to 60, arith 5 to 60, sprint 3 to 20 |
| `timeScale` | Multiplies every time limit. Use 1.5 or 2 for extended time. Range 1 to 3 |
| `maxPerShift` | The most pop-ups in one 5-customer shift, 1 to 5. The existing once-per-drill-per-shift rule still applies |

**Where settings live**
- **Hosted:**
  - Class defaults: `classes.drill_settings`.
  - Student overrides: `students.drill_settings`, which is null when the student uses the class settings.
  - The game gets both from `my_student()`, then merges them over the built-in defaults: built-in first, then class, then student.
- **Local mode (no Supabase):** `S.drillSettings` in the save. It's edited in the grown-ups progress report.

### How pop-ups adapt

**When a miss triggers a pop-up**
- If the fact or drill area is `solid` (see `factStatus`) and this is the student's **first** miss on it this shift, treat it as a slip. There's no pop-up, and the times-table stats still record the miss.
- Otherwise, open the pop-up as usual.

**When a slow answer triggers a pop-up**
- `fixed` mode: slow means over `seconds × timeScale`.
- `adaptive` mode: the game keeps the student's last 20 first-try response times for each step type (`S.pace.idea`, `S.pace.arith`, `S.pace.sprint`, in milliseconds). Slow means over `clamp(1.8 × median, 0.6 × seconds, 2 × seconds) × timeScale`. With fewer than 5 saved times, it uses fixed mode.
- A slow answer never opens a pop-up for a student whose drill area is `work` (needs practice) **and** who already had a pop-up this shift. Don't pile on.

**Ladder length**
- Area is `new` or `work`: the full ladder, as today.
- Area is `close` or `solid` (reached through a slow answer): a short ladder of 5 rows centered on the target, for example 7 × 6 through 7 × 10 for a missed 7 × 8. It starts at row 1 if the target is small.

**"Not helping" rule**
For each drill id, `S.drillLog[id]` gains two more counts:
- `popups`: how many times it opened.
- `missesAfter`: misses in that drill's area **after** the most recent pop-up for it.

When `popups >= 3` **and** `missesAfter >= popups`, mark the drill **reteach**. The game stops opening it automatically. The student sees nothing negative. The teacher sees a flag, and "Clear" (below) resets it.

- **Hosted:** the teacher's Clear sets `students.drill_settings.resetAt` to an ISO timestamp. On load, the game clears reteach flags that were set before `resetAt`.
- **Local:** Clear resets the flags directly.

### What teachers see and change

**Class Settings tab: a new "Practice pop-ups" card**
- On/off for all pop-ups.
- A checkbox for each drill type. Show `times` plus the types for units that are open.
- Checkboxes for the three triggers.
- Slow timing: **Adaptive** (recommended) or **Fixed**, with three seconds inputs.
- Max per shift, from 1 to 5.
- **Save** and **Reset to defaults**.

**Student detail (the progress check), in the class dashboard: a new "Practice pop-ups for [name]" card**
- **Mode:** Use class settings, Extra time ×1.5, Extra time ×2, or Pop-ups off.
- **Advanced**, collapsed by default: any individual setting.
- **A drill history table:** drill (`drillLabel`), pop-ups, misses after, and status: *helping*, *watching*, or **reteach**. Include a **Clear** button for reteach rows.

**Dashboard: a new card, "Pop-ups that aren't helping"**
It lists students and drills marked **reteach**, with each drill's teacher label, and it sits next to the small groups.

### What the student sees

- Hosted: the game's progress report shows the settings as read-only, for example "Your teacher set practice pop-ups to extra time."
- Local mode: the grown-ups can change them there.

## Part 2: Build steps

Commit after each step with the message given. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and paste `git log -1 --stat`.

### Step 1: Database

1. Add the provided migration file `supabase/migrations/20260926000000_drill_settings.sql` exactly as given. Don't edit it or any older migration.
2. Tell the owner to run it in the Supabase SQL Editor, **after** `20260925000000_drills.sql`.
3. It adds the two settings columns, `my_student()` now returns `class_drills` and `student_drills`, and `class_report()` now returns `ds` (the student's override) and `dl` (drill history). Old app versions keep working.

Commit: `Add drill settings columns`

### Step 2: Settings model in the registry

In `src/shared/registry.ts`, **add** the following. Don't change anything that's already there.

```ts
export interface DrillSettings {
  enabled: boolean;
  types: Record<string, boolean>;
  triggers: { miss: boolean; slow: boolean; sprint: boolean };
  slow: { mode: 'fixed' | 'adaptive'; idea: number; arith: number; sprint: number };
  timeScale: number;
  maxPerShift: number;
  resetAt?: string;
}
export const DEFAULT_DRILL_SETTINGS: DrillSettings = {
  enabled: true,
  types: {},
  triggers: { miss: true, slow: true, sprint: true },
  slow: { mode: 'adaptive', idea: 15, arith: 10, sprint: 6 },
  timeScale: 1,
  maxPerShift: 3
};
const clampNum = (v: unknown, lo: number, hi: number, dflt: number) => {
  const n = typeof v === 'number' && isFinite(v) ? v : dflt;
  return Math.min(hi, Math.max(lo, n));
};
/** Built-in defaults, then class settings, then student override. Values are range-checked. */
export function mergeDrillSettings(...layers: (Partial<DrillSettings> | null | undefined)[]): DrillSettings {
  const out: DrillSettings = JSON.parse(JSON.stringify(DEFAULT_DRILL_SETTINGS));
  for (const l of layers) {
    if (!l || typeof l !== 'object') continue;
    if (typeof l.enabled === 'boolean') out.enabled = l.enabled;
    if (l.types && typeof l.types === 'object') Object.assign(out.types, l.types);
    if (l.triggers && typeof l.triggers === 'object') Object.assign(out.triggers, l.triggers);
    if (l.slow && typeof l.slow === 'object') Object.assign(out.slow, l.slow);
    if (l.timeScale !== undefined) out.timeScale = l.timeScale as number;
    if (l.maxPerShift !== undefined) out.maxPerShift = l.maxPerShift as number;
    if (typeof l.resetAt === 'string') out.resetAt = l.resetAt;
  }
  out.slow.mode = out.slow.mode === 'fixed' ? 'fixed' : 'adaptive';
  out.slow.idea = clampNum(out.slow.idea, 5, 60, 15);
  out.slow.arith = clampNum(out.slow.arith, 5, 60, 10);
  out.slow.sprint = clampNum(out.slow.sprint, 3, 20, 6);
  out.timeScale = clampNum(out.timeScale, 1, 3, 1);
  out.maxPerShift = Math.round(clampNum(out.maxPerShift, 1, 5, 3));
  return out;
}
/** A drill type is on unless explicitly set to false. */
export const drillTypeOn = (s: DrillSettings, type: string) => s.enabled && s.types[type] !== false;
```

Commit: `Add drill settings model`

### Step 3: Game logic

In `src/game/game.js`:

1. **Current settings:** add `function drillSettings()`.
   - Hosted: `mergeDrillSettings(Backend.me.class_drills, Backend.me.student_drills)`.
   - Local: `mergeDrillSettings(S.drillSettings)`.
   - In `src/lib/studentBackend.ts`, add `class_drills` and `student_drills` to `StudentInfo`, and add `async refreshSettings()`. It calls `my_student` and updates **only** those two fields plus `min_station` on `this.me`, never the saved state. Call it at the start of `startShift()` without waiting on it, so teacher changes apply at the next shift.
2. **Pace tracking:** add `pace: {idea: [], arith: [], sprint: []}` to `fresh()` and `normalize()`. In `submit()`, record the first-try milliseconds for idea and arith steps. In the sprint answer handler, record sprint times. Keep the last 20 of each.
3. **Slow threshold:** replace the fixed `SLOW_MS` lookups in `submit()` and the sprint handler with `slowLimit(kind)`, which follows the rules in Part 1. Keep `SLOW_MS` as the fallback.
4. **The gate:** make `queueDrill(st, reason)` and the sprint-end pop-up go through a new `shouldDrill(drill, reason)` that checks, in order:
   1. `drillTypeOn`
   2. `triggers[reason]`
   3. the shift's pop-up count is under `maxPerShift`
   4. this drill hasn't run this shift
   5. the drill isn't marked reteach
   6. the solid-slip rule
   7. the don't-pile-on rule for slow answers

   Count pop-ups per shift in `shift.popups`.
5. **Ladder length:** give `DRILL_IMPL.times.build` a `{short}` option for the 5-row ladder. Pass `short: true` when the drill area is `close` or `solid`.
6. **Drill history:** in `S.drillLog[id]`, add `popups` and `missesAfter` (and `reteach: true` when the rule is met). Keep the existing `miss`, `slow`, and `sprint` counts. Count `missesAfter` in `submit()` when a missed step's drill area matches a drill that has had a pop-up. On load, apply `resetAt` (hosted) to clear old reteach flags.

Test in local mode:
- A first slip on a solid fact doesn't open a pop-up.
- With `maxPerShift: 1`, only one pop-up opens per shift.
- With `enabled: false`, none open.
- `timeScale: 2` doubles the slow limit.

Commit: `Adaptive drill triggers`

### Step 4: Teacher app

1. **Class Settings tab** (`renderSettings()` in `src/teacher/main.ts`): add the "Practice pop-ups" card from Part 1. It saves with `sb.from('classes').update({drill_settings})`. **Reset to defaults** saves `{}`.
2. **Student detail** (`openDetail()` in `src/teacher/report.ts`): add the "Practice pop-ups for [name]" card.
   - Mode choices save a partial override with `sb.from('students').update({drill_settings}).eq('id', …)`:
     - Use class settings: `null`
     - Extra time ×1.5: `{timeScale:1.5}`
     - Extra time ×2: `{timeScale:2}`
     - Pop-ups off: `{enabled:false}`
   - `report.ts` has no Supabase client today. Pass an `onSaveStudentDrills(id, settings)` callback from `main.ts` into `renderClassReport` and `openDetail`. Don't create a second client.
   - Build the history table from `r.dl` and the current mode from `r.ds`. Add `ds` and `dl` to `StudentReport`.
   - Clear sets `resetAt` to now in the student's override, keeping the rest of the override.
3. **Dashboard:** add the "Pop-ups that aren't helping" card from each student's `r.dl` entries with `reteach: true`.

Commit: `Teacher controls for practice pop-ups`

### Step 5: Game progress report

In `renderParent()`, add a "Practice pop-ups" panel.
- **Hosted:** read-only, in words. For example: "Your teacher set pop-ups to extra time (×1.5)."
- **Local:** the same controls as the teacher's student card, saved to `S.drillSettings`.
- Both show the drill history with *helping*, *watching*, or *reteach*.

Commit: `Pop-up settings in the progress report`

### Step 6: Safety check and instructions

1. In `scripts/verify.mjs`, add these checks without removing any:
   - `registry.ts` contains `export function mergeDrillSettings`.
   - `game.js` contains `function shouldDrill(` and `function slowLimit(`.
   - Some migration contains `drill_settings`.
2. Update the protected-files table in all three instruction files. Keep them identical.

Commit: `Verify covers drill settings`

## Acceptance checks

1. **Defaults:** with no settings saved anywhere, pop-ups behave as they do after `DRILLS.md`. The one difference is that `adaptive` slow timing starts after 5 recorded answers.
2. **Solid slip:** missing a fact that's `solid` once doesn't open a pop-up. Missing it again in the same shift does.
3. **Class off:** the teacher turns pop-ups off for the class. At the student's next shift there are none, with no reload needed.
4. **Extra time:** "Extra time ×2" on one student doubles their slow limit, and other students are unaffected.
5. **Max per shift:** set to 1, and a shift never shows more than one pop-up.
6. **Short ladder:** a slow answer on a `close` fact shows 5 rows centered on it.
7. **Reteach:** after 3 pop-ups for the 7s with 3 or more misses after, the 7s stop popping up. The teacher sees the flag, clicks Clear, and they can pop up again.
8. **Local mode:** the same controls work from the grown-ups progress report.
9. **Old saves:** these load with no errors, and old app versions keep logging.
10. `npm run verify`, `npm run typecheck`, and `npm run build` pass.
