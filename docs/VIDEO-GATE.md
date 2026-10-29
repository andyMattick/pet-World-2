# 🎬 Today’s video and 🛑 Time to get help

Owner requests, Oct 28, 2026:

- “When she comes into the subject, tell her to pick a video and get her mom’s signature … to move on to the practice.”
- “Put a watcher in the subjects that tells her to stop the subject and go find a parent / teacher … I don’t want to see 8 for 30 when I get home. A parent can sign her back in after she has got help / watched video.”
- “Parents can also override the videos in case there aren’t any good ones.”

## 🎬 Today’s video

**Where it applies:** every math shop, and every History and Biology unit (`videoFirstCourse`). English units are not included.

**When it applies:** the first practice of the day in that unit:
- math: **Open for business** and **Review practice**
- History and Biology: a lesson’s practice

Quizzes and tests keep their own review-and-PIN gates (docs/TEST-GATE.md).

**Steps** (`videoGateThen` → `openVideoPicker` in `src/game/game.js`):
1. **Pick a video** from the unit. The station or lesson she tapped comes first; the rest of the unit is under “More videos in this unit.”
   - Khan videos open in a new tab, and watching counts as class time (`startWatching` / `markKhanOpened`).
   - A teacher’s own YouTube link, or a Pet World video, plays inside Pet World.
2. **Watch all of it.**
3. **✍️ Mom’s signature:** this button opens only after she has picked a video. A grown-up’s PIN (`askGrownUp`) signs it off, and the day log records “✍️ Grown-up signed off today’s video: …”.

**After the signature:** the pass is saved as `S.videoPass[<shop or course id>] = {day, title, picked, signed}`. Practice in that unit is open for the rest of the day.

**Seeing it:**
- The shop or unit page shows a banner: “🎬 Before practice today …”, or “✅ Today’s video: …” once signed.
- Each open math station has a **🎬 Lesson videos** button. It’s pink until today’s video is signed.

**Grown-up override:** if no video fits, **🔐 Grown-up: no good video today, open practice** takes the PIN and opens practice for the day. The day log records it.

**No skip for her:** the old “I already watched it” button is gone. `watchFirstThen` now calls `videoGateThen`.

### Where the videos come from

**Math:** `src/shared/mathVideos.js`, read from the 24 Khan unit pages on Oct 28, 2026. It covers 140 lessons and 358 videos, keyed by the lesson part of each skill’s Khan link. Every math skill has videos.

To refresh the list, open each unit page in a browser and collect the links whose text says “(Opens a modal)” and that contain `/v/`, grouped by the lesson slug just before `/v/`.

**History and Biology:**
- `KHAN_VIDEOS` for each lesson
- else the lesson’s `KHAN_LINKS` page
- else a teacher’s or Pet World video (`studentVideo`)

## 🛑 Time to get help

**What counts** (`noteAnswer`):
- every practice answer in English, History and Biology (not quizzes or tests)
- every math practice order: an order with a wrong try counts as a miss, and hints don’t

Answers are kept per subject in `S.helpWatch[subject]`.

**The rule** (`struggleCheck`, `src/shared/mathVideos.js`): she stops when either
- her last 4 answers are all misses, or
- she has at least 6 answers and 60% of her last 10 are misses (4 of 6, 5 of 8, 6 of 10).

**What happens when she stops:**
- The practice set ends and a 🛑 card says: stop this subject, go find Mom, Dad or your teacher, get help or watch a video together, then a grown-up signs you back in.
- `S.helpLock[subject]` is set. Practice and station quizzes in that subject show the 🛑 card until a grown-up signs her back in. Other subjects stay open.
- The lock stays across days.

**Signing her back in** (`helpSignIn`):
1. The grown-up picks what she did: got help, watched a video, or both.
2. The grown-up enters the PIN.

Both the stop and the sign-in go in the day log.

## Tested

`gate-e2e` at 375px, all 19 checks passed:
- **Math, Pet Harbor:** the banner shows, the station buttons show, and the picker lists 13 real videos. Signing stays locked until she picks a video. The signature starts the shift, and the pass is saved.
- **History 4:**
  - The picker shows, with no skip button.
  - Practice starts after the signature.
  - Misses bring up the 🛑 card, and the practice set ends.
  - Practice stays blocked until a grown-up signs her back in, then opens with no new picker.
- **Override:** the grown-up skip opens math practice.

Also passed: verify, check-content, check-typed and smoke.
