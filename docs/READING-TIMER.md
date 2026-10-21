# ⏱️ Reading timer

Reading a paper book has no taps or clicks. Pet World's active-time clock only counts a minute when there was a tap, click or key in it (so time isn't counted for a tab left open), so reading time stopped counting about a minute after she put the mouse down.

## How it works

- **Reading Log → Start reading timer.** The start time is saved in her town, so the timer keeps counting by the real clock while the screen sleeps, the tab is closed or the computer is off. A small 📖 chip in the corner shows the time on every screen; tapping it opens the Reading Log.
- **Stop and add the minutes** adds the time to Reading (today's Reading time and the plan's Reading row), up to 3 hours at a time. **Cancel** stops it without adding anything.
- **Used another timer?** She types the minutes (1 to 180) and a grown-up enters the PIN. They're added the same way.
- While the timer runs, Reading time isn't also counted by the active-time clock, so nothing is counted twice.
- Each one goes in the day log: "📖 Reading (timer): 25 min", or "(another timer)" with "🔐 Grown-up OK: …".

Code: `readTimerHTML`, `stopReadTimer`, `creditReading`, `renderReadChip`, `S.readTimer` in `src/game/game.js`.
