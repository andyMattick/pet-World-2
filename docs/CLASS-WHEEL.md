# 🎡 Class wheel

Each school day (Monday to Friday) she spins a wheel for the day's classes. It looks random to her. The picks follow rules a grown-up sets, so the week comes out close to even.

## When it spins

Bible → morning brain stretch → the grown-up's theme and end-of-day question → **🎡 the wheel** → ☀️ warm-up → today's plan. She taps **Spin!**, and the wheel lands on each class in turn. Then she taps **Let's go!**. On a weekend there's no wheel, and the plan stays as it is.

## The classes

- **Core** (on Pet World): ➗ Math, 📚 English, 🏛️ History, 🦁 Biology. By default, 3 meet each day.
- **Electives** (away from Pet World): Spanish, Art, Computer Science. By default, 1 meets each day. Its plan row has a **Write it** button that opens ➕ Outside work with the course filled in. She writes what she did and the minutes, and can add photos. A grown-up checks it in the Ledger. The row shows ⏳ once she sends it, and ✅ once it's checked.

## What it does to Today's plan

A core class the wheel didn't pick loses its time and practice rows that day. Its quiz, test and project rows stay. A picked class with no row gets one (30 minutes by default). Each elective gets a row. Rows carried from an earlier day stay. The top of the plan shows "🎡 Today's classes: …" with **Grown-up: change**.

## The rules (the defaults)

- **Core:** one class sits out each day: the one that has sat out the fewest times this week, with ties picked at random. So over a week, three classes meet 4 times and one meets 3 times.
- **Tests:** a class with its Pet World review or test waiting always meets. That means its Pet World review is done and the test is waiting, or every quiz in its current unit is passed (the review and the Pet World test are next). A Khan unit test waiting doesn't count: the Pet World test gets priority, Khan tests don't.
- **Rest after a test:** that class sits out the next school day, unless its test is still waiting. If two classes had tests the same day, only one can sit out the next day (3 of 4 still meet).
- **A class that sat out the last school day** meets today.
- **Monday:** the class that met the fewest times last week meets on Monday, and it isn't the one that sits out twice again. The same goes for the elective that met the fewest times.
- **Electives:** an elective that hasn't met in the last 2 school days meets today, so each one meets at least once every 3 school days. Otherwise the wheel picks the one that has met the fewest times this week (not yesterday's). That's 2, 2 and 1 a week.
- A test or a grown-up's change can make a week uneven (3, 3, 4, 5, say). The next days work from what really happened.

A simulation of 60 weeks with no tests came out 4-4-4-3 for core and 2-2-1 for electives every week, with no elective going more than 3 school days without meeting. With tests, every test class met.

## For a grown-up

- **Change today's classes:** "Grown-up: change today's classes" on the wheel, or **Grown-up: change** on the plan, with the grown-up PIN. Check the classes for today. The day log gets "🎡 A grown-up changed today's classes: …".
- **Change the rules:** teacher app → the student's page → 🗓️ Daily plan → **🎡 Class wheel**. You can turn it on or off, and set:
  - which core classes are on the wheel and how many meet a day
  - the minutes for a core class with none on the plan
  - the electives (names, separated by commas), how many meet a day, and their minutes
  - each rule above (Pet World tests meet, rest after a test, sat out meets next, fewest first on Monday, every elective at least once every N school days)
  
  **Use the usual rules** puts the defaults back.

## Code

- `src/shared/classWheel.ts`: `WheelRules` / `wheelRules` / `DEFAULT_WHEEL`, `pickClasses(day, log, rules, tests)`, `normalizeWheelLog`, `isSchoolDay`.
- `src/game/game.js`: `wheelPolicy`, `wheelPick`, `openWheel`, `changeWheel`, `wheelItems` (in `planItems`), `wheelSatOut` (time goals), `testWaiting`, `wheelPlanRow`, the `elective` plan item, `openOutsideForm(row, preset)`. Save: `S.wheelLog["YYYY-MM-DD"] = {c, e, t?, o?}` (the last 40 days), `S.wheelSeen`.
- `src/teacher/plan.ts`: the 🎡 Class wheel rules, saved in the plan JSON (`quiz_overrides.plan.wheel`).
