# 🏆 Pet Show Awards

**Status: built, Oct 26, 2026 (Andy's idea).** A Pet Show game for Khan 6th grade Unit 11 (data and statistics). It's at `public/arcade/pet-show/index.html` (one standalone file), opened from 🏆 Best in Show, the last Pet Show station (`openPetShow` in `src/game/game.js`), and in the 🕹️ Arcade (`pet-show` in `ARCADE_GAMES`).

## How it plays

She's the head judge. Each award goes to the pet whose stat is **closest to a target value**. She finds the target first (2 tries), then taps the pet closest to it to pin on the 🎀 ribbon.

| # | Award | Target | Khan skill |
|---|---|---|---|
| 1 | Most Average (weight, height, tail, jump or speed) | the mean of the 5 pets on stage | Calculating the mean |
| 2 | Middle of the Pack | the median of 5 or 7 pets (unsorted on stage) | Calculating the median |
| 3 | Crowd Favorite | the median number of tricks, from a frequency table of 11 to 15 entrants | Median from data displays |
| 4 | Balance Point Award | the mean carrots eaten, from a dot plot of 8 or 10 rabbits | Mean from data displays |
| 5 | Top Quarter or Steady Starter | Q3 or Q1 of 7 or 11 pets | Quartiles |
| 6 | The Lost Score Card | the missing judge's score, given the mean | Missing value given the mean |

- **Feedback:** a wrong first try names the mix-up (the total instead of the mean, the median instead of the mean, an unsorted middle, Q1 for Q3, the mean as the missing card). A second miss shows the target worked out, and she still picks the winner.
- **The closest pet is always unique.** Medians and quartiles use odd counts, so the target is a pet's own value; an even count would leave two pets tied.
- **Points:** 11 (one for each target, one for each right ribbon). 10 or more is ⭐⭐⭐, 8 or more is ⭐⭐, 4 or more is ⭐.

## Testing

- 3,000 rounds of each award were generated. Every target is a positive number, the winner is the unique closest pet, and there are no repeated pets or NaN in any text.
- Two full shows were played in the browser: every answer right scored 11 of 11 and 6 ribbons (⭐⭐⭐); every answer wrong scored 0. There were no page errors.
- Screenshots were checked at 375 px.
- In the unit: the button is only at Best in Show, coins are paid, the daily cap holds, and the day log gets an event.

## Pay

- **From the Pet Show** (`?from=show`): posts `petshow:result`. Pays 1 Pet World coin per right answer, up to 20 a day. Saved in `S.petshow` (best stars, last 30 shows with missed skills). The day log gets a `petshow` event, which counts as math time.
- **From the Arcade** (`?arcadeRun=…`): 1 ticket per star, up to 3.
- It never counts toward station orders, skill mastery, quizzes or unlocks.
