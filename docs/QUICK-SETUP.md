# 🧭 Quick setup and the one list of teacher settings

Quick setup (teacher app → Settings → **Open quick setup**, and the first page of a new class) is every class on/off choice on one page, in groups:

| Group | Switches and choices |
|---|---|
| 📅 The school day | ⭐ Random first subject · ☀️ Warm-up first · 🎉 Theme days · how often (earned, every day, Fridays) · 🥧 Special days on their dates |
| 🧘 Breaks | 🧠 Brain stretches · 🤸 Stand-and-stretch breaks · ⏸️ “Still there?” and pause |
| 📘 Learning rules | Require 🧠 Think it through · 🔓 Station quiz opens the next station · 📝 Quiz style · 💡 Practice pop-ups |
| 🎬 Videos and links | 🎓 Use Khan Academy · ▶️ Show YouTube video searches |
| 🕹️ Arcade and music | Arcade · Arcade Free Play · Allow music |
| ✉️ For you | Daily insights email |

Below them, three folded lists: **🔧 Finer controls** (which brain games, moves, themes and Arcade games, minutes, ticket rules, units and stations, home grade, quiz sizes, pop-up details, the class word list, your own lesson links: each with where to find it), **👤 Set per student** (daily plan and subject minutes, 🎡 class wheel, extras, ✝️ Bible, her pop-ups, spelling words), and **✅ Always on** (review before tests with the grown-up PIN, today’s video, and the rest).

Quick setup saves into the same `game_settings`, `drill_settings` and `quiz_settings` that Settings uses, keeping every other key, so the two pages always agree.

## One list: `src/teacher/settingsList.ts`

`TEACHER_SETTINGS` has one entry per teacher setting: `id`, `scope` (class or student), `kind`, `group`, `emoji`, a short `name`, a one-line `what`, where it is `saved` (for example `game_settings.brain.enabled`), `where` a teacher finds it, `quick` (shown in Quick setup), the Settings controls (`settingsIds`) and, for menus, `choices`. Also exported: `QUICK_SETUP`, `SETTING_GROUPS`, `settingById`, `settingName` (Settings uses it for its switch labels) and `findTeacherSettings(question)` (for the help bot). The module is plain data with no imports.

**Adding a class setting:** add its entry to `TEACHER_SETTINGS` (with `quick: true` if it is a simple on/off), add one `SETUP_READ` line in `src/teacher/main.ts` for a Quick setup entry, and save it in Quick setup’s `save`. `npm run verify` fails when:
- a checkbox or menu in Settings has no entry (`settingsIds`), or an entry names a control Settings doesn’t have;
- `src/game/game.js` reads a `game_settings.<key>` that no entry’s `saved` mentions;
- a Quick setup entry has no `SETUP_READ` line.
