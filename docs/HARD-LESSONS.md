# Hard lessons and pick-one projects (Oct 28, 2026)

These are owner decisions for History Units 6–9. They're written so any unit can use them.

## Hard lessons: `gate` and `quiet`

A skill in a course's skill list (in `questionBanks.js`) can carry two flags.

- `gate:true`: a grown-up previews the lesson first. The lesson's questions are in the unit's review list.
  - The practice button asks for the grown-up PIN once ("Preview first").
  - After that the lesson stays unlocked. The unlock is saved in `S.gateOpen['<course>:<skill>']` and logged in the day log.
- `quiet:true`: progress, scores and mastery save as usual, but there's no celebration.
  - She earns no arcade minutes for its answers.
  - The result screen reads "📖 Lesson practice done" instead of "✅ Passed!".
  - Give the skill no role card, so the feedback stays plain ("That is right.").

Used for:
- the Transatlantic Slave Trade (Unit 6.10)
- the Holocaust (Unit 8.7)

Code: `gateThen`, `skillQuiet` and `skillOf` in `game.js`.

## Projects: pick one

A unit can offer several projects. Give each one `pick:true`, under the unit's project keys: `historyN`, `historyNlab`, `historyNlab2` and `historyNlab3`, which `projectKeys` already reads.

- The unit page shows "📁 Pick one project", then the choices.
- Once she sends one, the others step aside.
- They come back if the one she sent is taken back while it's still a draft.
- A grown-up reviews the project she sent, as usual.

Units 6–9 project keys are already in the save normalizer.

Code: `historyProjectCardHTML`.
