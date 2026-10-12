# Khan Academy in Pet Town

New to Pet Town? Start with [KHAN-SETUP.md](KHAN-SETUP.md), which covers accounts, which Khan unit goes with which building, and the Khan unit test check.

Pet Town only **links** to Khan Academy. It never copies or embeds Khan's content, and it uses no Khan API or key. Khan is **on by default**. A class or a family that doesn't use Khan can turn it off, and everything else keeps working.

## Where Khan shows up

| Who sees it | Where | What |
|---|---|---|
| Students | English, History and Biology lessons | "Watch or read this lesson on Khan Academy" under each block, and "Also on Khan Academy" under a teacher's link |
| Students | Course page | The "How it works" note and the 🔁 review banner mention Khan |
| Parents | Progress report, math skills | "Khan practice" links |
| Teacher | Lessons & questions tab | The **Khan unit test check** card (scores and missed topics, saved in `classes.khan_results`) |
| Teacher | Dashboard | "Khan practice:" under mix-ups, "Assign on Khan Academy" under skills to reteach, and the Khan column in a student's skill table |

## Turning it off

- **A class:** teacher app → Class settings → untick **Use Khan Academy** → Save. This is saved as `game_settings.khan = false`, which students already receive, so there's no migration.
- **A family at home (no class):** Progress report → Settings → untick **Show Khan Academy links**. This is saved in the student's save as `noKhan`.

When Khan is off:

- Every Khan link and mention in the table above is hidden.
- Lessons keep their own text, Pet Town's videos, and the teacher's own lesson links.
- Nothing is deleted. Khan scores already logged stay in `classes.khan_results`, and turning Khan back on shows them again.
- Unit tests, projects, practice and unlocking work the same. None of them depend on Khan.

## Checking links

- `npm run verify` checks that every Khan link is a well-formed khanacademy.org address. It runs offline.
- `npm run check-links` opens every link (needs internet) and lists dead links and links that now redirect somewhere else. A link it can't reach is listed as not checked, never as dead.

## Code

- `src/game/game.js`: `khanOn()` (search for "Khan Academy on or off"), used by `khanLinkHTML()`, the course page, and the parent report.
- `src/teacher/main.ts`: the **Use Khan Academy** checkbox in Class settings.
- `src/teacher/lessons.ts`: `khanUsed` hides the Khan unit test check.
- `src/teacher/report.ts`: `reportKhan` hides the dashboard's Khan links.
