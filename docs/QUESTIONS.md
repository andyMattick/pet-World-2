# ✋ I have a question

A big yellow **✋ I have a question** button sits in the bottom-left corner of every assignment: shops and station quizzes, the Fact Sprint, Word Workshop, the Reading Log, lessons, quizzes and tests, projects, labs and dig sites. It is hidden on the town map, the pet room and the menus.

## What the student does

1. She taps the button. Her practice time **stops** while the box is open.
2. She picks one:
   - 🐞 Something isn’t working
   - 🤔 I don’t know how to do this
3. She writes what happened.
4. She can add a picture of the screen, either way:
   - **📸 Take a picture of this screen.** The browser asks which tab to share and takes one picture. This works in Chrome, Edge and Firefox on a computer. The button is hidden where the browser can’t do it.
   - **🖼️ Add a screenshot.** Use a screenshot she already took (for example, on an iPad).

   The picture is shrunk to a small JPEG (140 KB or less) and saved with the question.
5. When she sends it, she sees “Your question was sent!” and goes back to her plan.

## While it waits

- The place she asked about (the shop, the unit building, the Word Workshop, the Sprint Track…) stays **closed**. Opening it shows “Your question is waiting.”
- Today’s plan shows **✋ Question waiting for your teacher** at the top, with her question. That place’s plan row shows “✋ waiting for your teacher” instead of Go.
- Everything else is open, so she can do something else on her plan.

## Answering

- **Teacher app:**
  - A ✋ alert pops up (and a browser notification, if those are on).
  - The dashboard shows **✋ Questions waiting**.
  - On her page, the ✋ Questions card has her question, the picture, quick replies and an answer box. **Send answer** opens the place again.
- **At home:** a grown-up can answer on the grown-up page (Progress report) or from the “Your question is waiting” box, with the grown-up PIN.

Her plan then shows **💬 Your teacher answered…** until she taps **Got it**. When a question is waiting, the game checks for an answer every 30 seconds.

## How it’s saved

- Questions are in the save as `S.help`: the last 12, each `{id, at, kind, text, where, label, open, shot, localAnswer, seen, told}`.
- `open` is the town button (`data-open`) that leads back to that place.
- The teacher’s answer is in `quiz_overrides["help:<id>"] = "answered:<text>"`.
- The day log gets a `help` event. That is how the teacher app’s alerts see it.
- Pictures on questions answered at home more than a week ago are dropped.
- No database change is needed.
