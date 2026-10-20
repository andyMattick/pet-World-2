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
