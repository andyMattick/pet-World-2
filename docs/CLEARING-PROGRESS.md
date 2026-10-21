# Clearing progress a student didn't earn

A full **Reset** wipes a student's whole town. To take back only part of it (a unit someone else clicked through, a quiz that shouldn't count), add a **clear** to the student's `quiz_overrides`:

```
"clear:<any id>": "<what to clear, comma-separated>"
```

| Token | Clears |
|---|---|
| `ela:<course>` | An English unit (`pronouns`, `modifiers`, `prepositions`, `verbs`): practice, quizzes, unit test, written answers, projects |
| `shop:<shop>` | A math shop: every station's orders, quizzes, 🧠 Think it through, review, unit test, and the shop's skill mastery |
| `station:<shop>:<n>` | One station: its orders, quiz, Think it through, and its skills' mastery |
| `quiz:<shop>:<n>` / `quiz:<shop>:test` | One station quiz or the unit test, and its review |
| `think:<shop>:<n>` | One station's 🧠 Think it through result |
| `skill:<id>` | One math skill's mastery record |
| `rec:<store>:<key>` | One lesson record in `elaProgress`, `historyProgress` or `scienceProgress` |
| `word:<word>` | One Word Workshop word's answer history |

The game applies each clear once per save copy and records it in `state.clearsDone`. It clears both copies before merging two devices' saves (`enterAs`, `Backend.onRemoteSave`), and checks for new clears whenever settings refresh (`Backend.onSettings`), so an old copy on a tablet can't bring the work back. Code: `applyClears()` in `src/game/game.js`.

The report tables (`assessments`, `problems`, `attempts`) aren't part of the save; delete those rows in SQL. Example: `supabase/one-off/2026-10-20-clear-abigail.sql`.

Locks follow from the cleared results: a math shop opens when the shop before it has its unit test passed, and English opens every library through the one she is on (the first open one after the last unit test she passed).

## Why Abigail's town had work she never did (Oct 20, 2026)

Her browser's saved copy had the demo class's **Maya R.** in it: the same Pronouns written answers (same ids), 36 identical English records, and the same Café unit test (best 93, one try). That test unlocked the Bakery, so the plan sent her there.

How: every tab of Pet World on one browser shares one sign-in. Someone opened the demo student view on that browser and signed in as Maya (DEMO26), which re-pointed the shared sign-in at Maya. Abigail's tab, still open, asked the server for its newest save, got Maya's, treated it as "her own work from another device," and merged it in (`Backend.onRemoteSave` → `mergeWork`). Her next sign-in sent the merged town to the server.

Guardrails added:
- `refreshSettings()` checks the returned student is the one this tab signed in as. If not, the tab stops saving, logging and merging (`Backend.onAccountSwitch`) and reloads as whoever is signed in now. A `storage` listener makes other tabs notice right away.
- Every save is stamped with its student (`state.owner`), and `mergeWork()` refuses a town stamped for someone else (or, for older saves, with a different name).
- The demo pass page tells visitors to use a private window, since signing in there signs out any student on that browser.

## Why it came back (Oct 21, 2026)

The morning after the Oct 20 clears, the Bakery and English Units 3–4 were open again with Maya R.'s scores. Her records matched Maya's from the Oct 19 demo reset exactly (dates shifted by the daily reset), so it was the same demo copy, not new work.

How: a Chrome browser on Windows had been signed in as Abigail since Oct 19, 2:09 PM (the afternoon the demo class was built). A Pet World tab there stayed open, still running Oct 19's code, which has no clears and no guardrails. It woke up at about 5:50 AM, merged its old copy (with Maya's work in it) into the server copy, which was already marked as cleared (`clearsDone`), and saved it. Newer code saw the clears marked done and skipped them.

Guardrails added:
- **Clears are checked again.** A clear that's done runs again on every copy, every time, for dated records (quizzes and tests, lesson records, Think it through, written answers, projects): anything dated before the clear's date (the `YYYY-MM-DD` in its id) is dropped. Work dated on or after that day, and undated records, stay. Order counts, skill mastery and word history are cleared only the first time.
- **Old tabs reload.** When the town comes back on screen, and every 10 minutes, the game checks the published page. If it loads a newer game build than the tab is running, the tab stops saving (`Backend.pause()`), keeps its copy on the device only, and reloads into the new code.
- `supabase/one-off/2026-10-21-clear-abigail-3.sql` repeats both Oct 20 clears as one new clear.

To avoid it entirely: open the demo only in a private window or a separate Chrome profile, never in a browser a student uses.
