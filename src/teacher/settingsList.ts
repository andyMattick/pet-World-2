/* Every teacher setting in one list (docs/QUICK-SETUP.md).
   🧭 Quick setup draws its switches from this list, Settings takes its switch labels from it, and the help bot can search it.
   Adding a class setting? Add it here first. `npm run verify` fails when a Settings checkbox, or a game_settings key the
   game reads, is missing from this list. Plain data only (no imports), so any part of the app can use it. */

export type SettingScope = 'class' | 'student';
export type SettingKind = 'switch' | 'choice' | 'number' | 'list' | 'tab';

export interface TeacherSetting {
  id: string;                 // stable id (Quick setup uses it as data-setup="…")
  scope: SettingScope;        // class: one for the whole class; student: on each student's page
  kind: SettingKind;
  group: string;              // one of SETTING_GROUPS
  emoji: string;
  name: string;               // short label
  what: string;               // one line: what it does
  saved: string;              // where it is saved, e.g. 'game_settings.brain.enabled'
  where: string;              // where a teacher finds it in the teacher app
  quick?: boolean;            // shown in 🧭 Quick setup
  settingsIds?: string[];     // the Settings controls for it ("#id" or "[data-attr]"); scripts/verify.mjs checks these
  quickIds?: string[];        // its controls in 🧭 Quick setup, for a quick 'list' entry; scripts/verify.mjs checks these
  choices?: { value: string; label: string }[];   // for kind 'choice' in Quick setup
}

export const SETTING_GROUPS: { id: string; emoji: string; name: string }[] = [
  { id: 'day', emoji: '📅', name: 'The school day' },
  { id: 'breaks', emoji: '🧘', name: 'Breaks' },
  { id: 'learning', emoji: '📘', name: 'Learning rules' },
  { id: 'videos', emoji: '🎬', name: 'Videos and links' },
  { id: 'fun', emoji: '🕹️', name: 'Arcade and music' },
  { id: 'you', emoji: '✉️', name: 'For you' },
  { id: 'units', emoji: '🗺️', name: 'Units and stations' },
  { id: 'student', emoji: '👤', name: 'Per student' }
];

const S = 'Settings';
export const TEACHER_SETTINGS: TeacherSetting[] = [
  /* 📅 the school day */
  { id: 'planShuffle', scope: 'class', kind: 'switch', group: 'day', emoji: '⭐', name: 'Random first subject', what: 'One subject a day is marked ⭐ Start here; quizzes and tests move to the end of Today’s plan.', saved: 'game_settings.planShuffle', where: `${S} → ⭐ Order of the day`, quick: true, settingsIds: ['#planShuffle'] },
  { id: 'extrasFirst', scope: 'class', kind: 'switch', group: 'day', emoji: '☀️', name: 'Warm-up first', what: 'After Bible, each student’s timed extras (Fact Sprint, Word Workshop) come before any subject.', saved: 'game_settings.extrasFirst', where: `${S} → ☀️ Warm-up first`, quick: true, settingsIds: ['#extrasFirst'] },
  { id: 'themes', scope: 'class', kind: 'switch', group: 'day', emoji: '🎉', name: 'Theme days', what: 'A fun theme for the day (Pajama Day, Detective Day…) with something to wear or make.', saved: 'game_settings.themes.enabled', where: `${S} → 🎉 Theme days`, quick: true, settingsIds: ['#themesEnabled'] },
  { id: 'themesWhen', scope: 'class', kind: 'choice', group: 'day', emoji: '📆', name: 'Theme days: how often', what: 'Earned (a grown-up decides each morning), every school day, or Fridays.', saved: 'game_settings.themes.when', where: `${S} → 🎉 Theme days → How often`, quick: true, settingsIds: ['#themesWhen'],
    choices: [{ value: 'earned', label: 'Earned: a grown-up decides' }, { value: 'every', label: 'Every school day' }, { value: 'fri', label: 'Fridays only' }] },
  { id: 'themesSpecial', scope: 'class', kind: 'switch', group: 'day', emoji: '🥧', name: 'Special days on their dates', what: 'Pi Day, the 100th day of school and the other special days show on their dates.', saved: 'game_settings.themes.special', where: `${S} → 🎉 Theme days`, quick: true, settingsIds: ['#themesSpecial'] },
  { id: 'themeList', scope: 'class', kind: 'list', group: 'day', emoji: '🎭', name: 'Themes in the rotation', what: 'Pick which theme days can come up.', saved: 'game_settings.themes.themes', where: `${S} → 🎉 Theme days → Themes in the rotation`, settingsIds: ['[data-themeday]'] },

  /* 🧘 breaks */
  { id: 'brain', scope: 'class', kind: 'switch', group: 'breaks', emoji: '🧠', name: 'Brain stretches', what: '3 short brain games once a day, after the first subject. No skip button.', saved: 'game_settings.brain.enabled', where: `${S} → 🧠 Brain stretches`, quick: true, settingsIds: ['#brainEnabled'] },
  { id: 'brainGames', scope: 'class', kind: 'list', group: 'breaks', emoji: '🧩', name: 'Brain games in the cycle', what: 'Pick which brain games can come up.', saved: 'game_settings.brain.games', where: `${S} → 🧠 Brain stretches → Games in the cycle`, settingsIds: ['[data-brain-game]'] },
  { id: 'move', scope: 'class', kind: 'switch', group: 'breaks', emoji: '🤸', name: 'Stand-and-stretch breaks', what: 'Once a day, after the third subject, their pet leads a 1½-minute movement break. No skip button.', saved: 'game_settings.move.enabled', where: `${S} → 🤸 Stand-and-stretch breaks`, quick: true, settingsIds: ['#moveEnabled'] },
  { id: 'moveMinutes', scope: 'class', kind: 'number', group: 'breaks', emoji: '⏲️', name: 'Minutes before a subject counts', what: 'How long a subject must last to count as one of the three before the break.', saved: 'game_settings.move.minutes', where: `${S} → 🤸 Stand-and-stretch breaks`, settingsIds: ['#moveMinutes'] },
  { id: 'moveList', scope: 'class', kind: 'list', group: 'breaks', emoji: '🧦', name: 'Moves in the cycle', what: 'Pick which stretches and fun moves can come up.', saved: 'game_settings.move.moves', where: `${S} → 🤸 Stand-and-stretch breaks → Moves in the cycle`, settingsIds: ['[data-move]'] },
  { id: 'idle', scope: 'class', kind: 'switch', group: 'breaks', emoji: '⏸️', name: '“Still there?” and pause', what: 'After a few minutes with no taps their pet checks in, then Pet World pauses; that time isn’t practice.', saved: 'game_settings.idle.on', where: `${S} → ⏸️ “Still there?” and pause`, quick: true, settingsIds: ['#idleOn'] },
  { id: 'idleMinutes', scope: 'class', kind: 'number', group: 'breaks', emoji: '⏱️', name: '“Still there?” minutes', what: 'Minutes before it asks, and before it pauses. A family’s own setting wins.', saved: 'game_settings.idle.nudge, game_settings.idle.pause', where: `${S} → ⏸️ “Still there?” and pause`, settingsIds: ['#idleNudge', '#idlePause'] },

  /* 📘 learning rules */
  { id: 'requireThink', scope: 'class', kind: 'switch', group: 'learning', emoji: '💭', name: 'Require 🧠 Think it through', what: 'Each math station’s reasoning set must be passed before the next station opens.', saved: 'game_settings.requireThink', where: `${S} → Class settings`, quick: true, settingsIds: ['#requireThink'] },
  { id: 'requireQuiz', scope: 'class', kind: 'switch', group: 'learning', emoji: '🔓', name: 'Station quiz opens the next station', what: 'Passing a station’s quiz opens the next one (it still opens after 6 orders).', saved: 'quiz_settings.requireQuiz', where: `${S} → Quizzes and tests`, quick: true, settingsIds: ['#requireQuiz'] },
  { id: 'quizSteps', scope: 'class', kind: 'choice', group: 'learning', emoji: '📝', name: 'Quiz style', what: 'Quizzes ask for the answer only, or show every step.', saved: 'quiz_settings.showSteps', where: `${S} → Quizzes and tests → Quiz style`, quick: true, settingsIds: ['#quizShowSteps'],
    choices: [{ value: 'false', label: 'Answer only' }, { value: 'true', label: 'Show steps' }] },
  { id: 'quizNumbers', scope: 'class', kind: 'number', group: 'learning', emoji: '🔢', name: 'Quiz and test sizes, pass mark', what: 'Pass mark, problems per skill, smallest and largest quiz and test, review problems.', saved: 'quiz_settings', where: `${S} → Quizzes and tests`, settingsIds: ['#quizPassPct'] },
  { id: 'drills', scope: 'class', kind: 'switch', group: 'learning', emoji: '💡', name: 'Practice pop-ups', what: 'A short practice of the missed part (times tables, place value…) after a miss or a slow answer.', saved: 'drill_settings.enabled', where: `${S} → Practice pop-ups`, quick: true, settingsIds: ['#drillEnabled'] },
  { id: 'drillDetails', scope: 'class', kind: 'list', group: 'learning', emoji: '🎚️', name: 'Pop-up types, triggers and timing', what: 'Which pop-ups, what starts one (miss, slow, end of sprint), and how slow is slow.', saved: 'drill_settings', where: `${S} → Practice pop-ups`, settingsIds: ['[data-drill-type]', '#triggerMiss', '#triggerSlow', '#triggerSprint', '#slowMode'] },

  /* 🎬 videos and links */
  { id: 'khan', scope: 'class', kind: 'switch', group: 'videos', emoji: '🎓', name: 'Use Khan Academy', what: 'Khan videos and the Khan unit test check. Off keeps students inside Pet World.', saved: 'game_settings.khan', where: `${S} → Class settings → Use Khan Academy`, quick: true, settingsIds: ['#useKhan'] },
  { id: 'youtube', scope: 'class', kind: 'switch', group: 'videos', emoji: '▶️', name: 'Show YouTube video searches', what: 'A backup “Find videos on YouTube” link on each lesson.', saved: 'game_settings.youtube', where: `${S} → Class settings`, quick: true, settingsIds: ['#useYouTube'] },
  { id: 'lessonLinks', scope: 'class', kind: 'tab', group: 'videos', emoji: '🔗', name: 'Your own lesson links and question edits', what: 'Swap in your own videos or links, and edit or hide questions, for this class.', saved: 'lesson_links, question_edits', where: 'Lessons & questions tab' },

  /* 🕹️ arcade and music */
  { id: 'arcade', scope: 'class', kind: 'switch', group: 'fun', emoji: '🕹️', name: 'Arcade', what: 'Games students play with the practice time they earn. Off puts a lock on its town tile.', saved: 'game_settings.arcade.enabled', where: `${S} → Arcade`, quick: true, settingsIds: ['#arcadeEnabled'] },
  { id: 'freePlay', scope: 'class', kind: 'switch', group: 'fun', emoji: '🎟️', name: 'Arcade Free Play', what: 'No coin admission or tickets: practice time alone opens the Arcade.', saved: 'game_settings.arcade.freePlay', where: `${S} → Arcade`, quick: true, settingsIds: ['#arcadeFreePlay'] },
  { id: 'arcadeGames', scope: 'class', kind: 'list', group: 'fun', emoji: '🎮', name: 'Open or close each Arcade game', what: 'Pick which Arcade games students can play. A closed game ends within a minute.', saved: 'game_settings.arcade.games', where: `${S} → Arcade → Games students can play, or 🧭 Quick setup → Arcade games`, quick: true, settingsIds: ['[data-arcade-game]'], quickIds: ['[data-setup-game]'] },
  { id: 'arcadeTickets', scope: 'class', kind: 'number', group: 'fun', emoji: '🎫', name: 'Ticket rewards', what: 'Tickets per game, the daily cap, and the Game of the Day bonus (paid entry only).', saved: 'game_settings.arcade (ticket numbers)', where: `${S} → Arcade → Ticket rewards`, settingsIds: ['#arcadeTicketCap'] },
  { id: 'allowMusic', scope: 'class', kind: 'switch', group: 'fun', emoji: '🎵', name: 'Allow music', what: 'Students can turn music on. Sound effects stay up to each student.', saved: 'game_settings.allowMusic', where: `${S} → Class settings → Allow music`, quick: true, settingsIds: ['#allowMusic'] },

  /* ✉️ for you */
  { id: 'insightsEmail', scope: 'class', kind: 'switch', group: 'you', emoji: '✉️', name: 'Daily insights email', what: 'Each evening, an email with every student’s 📈 Insights. Needs the one-time setup in docs/INSIGHTS.md.', saved: 'game_settings.insightsEmail.on', where: `${S} → ✉️ Daily insights email`, quick: true, settingsIds: ['#insightsOn'] },
  { id: 'insightsHour', scope: 'class', kind: 'choice', group: 'you', emoji: '🕖', name: 'Insights email time', what: 'The hour the daily email goes out (7 PM unless changed).', saved: 'game_settings.insightsEmail.hour, game_settings.insightsEmail.tz', where: `${S} → ✉️ Daily insights email → Send at`, settingsIds: ['#insightsHour'] },

  /* 🗺️ units and stations (Settings only: one control per unit) */
  { id: 'openUnits', scope: 'class', kind: 'list', group: 'units', emoji: '🚪', name: 'Open a unit for everyone', what: 'Otherwise each student opens it by passing the unit test before it.', saved: 'game_settings.openUnits', where: `${S} → Class settings`, settingsIds: ['[data-open-unit]'] },
  { id: 'minStations', scope: 'class', kind: 'choice', group: 'units', emoji: '🏁', name: 'Unlock stations through', what: 'Open each shop’s stations up to the one you pick.', saved: 'min_station, game_settings.minStations', where: `${S} → Class settings`, settingsIds: ['#cStation', '[data-min-station]'] },
  { id: 'home', scope: 'class', kind: 'choice', group: 'units', emoji: '🏡', name: 'Home grade', what: 'The grade the town opens in (shown once two grades are built).', saved: 'game_settings.home', where: `${S} → Class settings → Home grade`, settingsIds: ['#cHome'] },
  { id: 'vocab', scope: 'class', kind: 'tab', group: 'units', emoji: '📚', name: 'Class word list', what: 'Words for Word Workshop, listening time, and pictures for added words.', saved: 'game_settings.vocab', where: 'Vocabulary tab' },

  /* 👤 per student (on each student's page, from the Dashboard) */
  { id: 'plan', scope: 'student', kind: 'list', group: 'student', emoji: '🗓️', name: 'Daily plan and subject minutes', what: 'What’s on her plan each weekday, and minutes for each subject.', saved: 'quiz_overrides.plan, quiz_overrides.subjectGoals', where: 'Dashboard → student → 🗓️ Daily plan' },
  { id: 'wheel', scope: 'student', kind: 'switch', group: 'student', emoji: '🎡', name: 'Class wheel', what: 'The wheel picks which core classes are on each school day.', saved: 'quiz_overrides.plan.wheel', where: 'Dashboard → student → 🗓️ Daily plan → 🎡 Class wheel' },
  { id: 'extras', scope: 'student', kind: 'list', group: 'student', emoji: '⚡', name: 'Extras (warm-up rounds)', what: 'Fact Sprint and Word Workshop, and how long each timed round is.', saved: 'quiz_overrides.extras', where: 'Dashboard → student → 📋 Extras' },
  { id: 'bible', scope: 'student', kind: 'switch', group: 'student', emoji: '✝️', name: 'Bible first each day', what: 'A ✝️ Bible spot that comes first each day: devotion, journal, memory verse.', saved: 'quiz_overrides.bible', where: 'Dashboard → student → ✝️ Bible' },
  { id: 'studentDrills', scope: 'student', kind: 'list', group: 'student', emoji: '💡', name: 'Her practice pop-ups', what: 'Change the class pop-up settings for one student.', saved: 'students.drill_settings', where: 'Dashboard → student → Practice pop-ups' },
  { id: 'spellFocus', scope: 'student', kind: 'list', group: 'student', emoji: '🔤', name: 'Spelling-pattern words', what: 'Extra words for one student’s spelling practice.', saved: 'quiz_overrides.spellFocus', where: 'Vocabulary tab → each student’s words' }
];

/** The switches and choices shown in 🧭 Quick setup, in group order. A quick 'list' entry (the Arcade games) is a folded
    set of switches, one per item, under its group; Quick setup shows the Arcade games only while the Arcade is on. */
export const QUICK_SETUP = TEACHER_SETTINGS.filter(s => s.quick);
export const settingById = (id: string) => TEACHER_SETTINGS.find(s => s.id === id);
/** Settings' label for a switch: the same short name Quick setup shows. */
export const settingName = (id: string) => settingById(id)?.name || id;
/** For the help bot: settings whose name, explanation or place match every word of the question. */
export function findTeacherSettings(question: string): TeacherSetting[] {
  const words = question.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
  if (!words.length) return [];
  return TEACHER_SETTINGS.map(s => { const text = `${s.name} ${s.what} ${s.where} ${s.id}`.toLowerCase(); return { s, n: words.filter(w => text.includes(w)).length }; })
    .filter(x => x.n > 0).sort((a, b) => b.n - a.n).map(x => x.s);
}
