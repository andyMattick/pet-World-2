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
