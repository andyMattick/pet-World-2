# Pet Town lesson videos (the video engine)

Goal: every Pet Town lesson teaches with **our own video** instead of sending students to Khan Academy. Khan stays in two places only: the **order** of units and lessons (Pet Town already follows it), and the **Khan unit test check** (step 10), which stays as the outside benchmark.

Videos come in two waves for each lesson:

1. **Placeholder**: built automatically from a lesson script: narrated slides with the lesson's own pictures (number lines, area models, data tables), a computer voice, and captions. Every lesson gets one quickly, so Khan links can go away early.
2. **Recorded**: Andy records the lesson himself, using the same script as an outline. It replaces the placeholder in place. Nothing else changes.

Same rules as the question bank roadmap: no live AI and no API key at run time, Khan stays the fallback until a lesson has a video, and existing code is edited in place (CLAUDE.md).

## Scale

| Area | Lessons | Where the Khan link lives today |
|---|---|---|
| Math (4th grade, 6th grade) | 200 skills | `SKILLS[id].url` in `src/shared/registry.ts`, shown on the skill rows |
| English, History, Biology | 62 lessons in 40 blocks, plus 9 extra readings | `KHAN_LINKS` and `lesson.url` in `src/shared/questionBanks.js`, shown by `khanLinkHTML()` in `game.js` |

Math does not need 200 separate videos. One video per **station** (about 4 to 6 skills that share a method) is the target, with a short clip per skill only where a skill needs its own example. That is about 60 math videos and 49 non-math videos: **about 110 videos** for full coverage.

## The four parts

### 1. Lesson catalog: `src/shared/lessonVideos.js`

One list, in Khan order, of every lesson that should have a video. It is the single place that says what a student watches.

```js
export const LESSON_VIDEOS = {
  // key: the same key lesson_links uses ("<courseId>:<groupId>" or ":<n>"), or "math:<shop>:<stationId>" / "math:<skillId>"
  'bio1:cells': {
    title: 'Cells: the building blocks of life',
    order: 'bio1.1',                         // Khan order: course.unit.lesson, used for sorting and the status report
    script: 'content/lessons/bio1/cells.json',
    video: { youtube: '<youtube video id>', kind: 'placeholder', minutes: 4.5, updated: '2026-10-12' }   // kind: 'placeholder' | 'recorded'
  }
};
export function lessonVideo(key) { /* the entry, or null if this lesson has no video yet */ }
```

- A lesson with no `video` keeps its Khan link exactly as today.
- A teacher's own link (`lesson_links`, Phase 2) still wins for that class.
- Math skills look up their station's video unless the skill has its own entry.

### 2. Lesson scripts: `content/lessons/<course>/<lesson>.json`

Written with Claude in chat, the same way the question banks were: no API key, reviewed by Andy before use. A script is what both the placeholder builder and Andy's recording use.

```json
{
  "key": "bio1:cells",
  "title": "Cells: the building blocks of life",
  "goal": "Students can say what a cell is and name the levels from cell to organism.",
  "scenes": [
    { "say": "Every living thing is made of cells…", "show": { "type": "title", "text": "What is a cell?" } },
    { "say": "Here is a skin cell under a microscope…", "show": { "type": "image", "src": "content/images/bio1/skin-cell.png", "credit": "Public domain, Wikimedia Commons" } },
    { "say": "Let's put these in order, from smallest to largest.", "show": { "type": "steps", "items": ["Cell", "Tissue", "Organ", "Organ system", "Organism"] } },
    { "say": "Try this one before you go on.", "show": { "type": "check", "question": "bio1:cellsOrganisms:tm4c6p" } }
  ]
}
```

Scene types:

- `title`, `bullets`, `steps`: plain text slides.
- `image`: public-domain or our own images only, with a credit line.
- `visual`: a picture drawn by Pet Town's own code, so math videos show exactly what students practice. Examples are `numberLineSVG`, `areaHTML` and `pvTableHTML`, with fixed numbers given in the scene.
- `worked`: a worked example that reveals one step at a time.
- `check`: shows a bank question by its id (from the Lessons & questions tab) and pauses for 5 seconds before the answer.

Script rules, which go into the prompt Claude uses:

- **Original wording only.** Never copy or paraphrase a Khan video's transcript; Khan sets the topic and order, not the words.
- **Length:** 3 to 6 minutes, 6th grade reading level, one idea per scene.
- **Vocabulary:** use the same words Pet Town's questions use.
- **Practice:** end with one `check` scene that uses a level 2 question from the lesson's bank.

### 3. Placeholder builder: `scripts/build-video.mjs`

This runs in the Codespace with no account and no API key, and turns a script into an MP4 plus captions:

```
node scripts/build-video.mjs content/lessons/bio1/cells.json      →  videos/out/bio1-cells.mp4 + .vtt
node scripts/build-video.mjs --course bio1                         →  every script in the course
```

1. **Slides:** each scene is rendered as a 1280×720 slide in headless Chromium (Playwright). `visual` scenes call Pet Town's own drawing functions, so math pictures match practice exactly.
2. **Voice:** narration comes from **Piper**, a free, offline text-to-speech program (one voice file, about 60 MB, downloaded once; `espeak-ng` is the fallback). Each scene's audio sets how long its slide stays on screen.
3. **Video:** `ffmpeg` joins the slides and audio into an MP4, and the `say` text becomes a captions file with the right timings.
4. **Label:** the first slide says "Pet Town lesson · computer voice", so students and teachers can tell it's a placeholder.

`videos/` is git-ignored; videos live on YouTube, not in the repo.

### 4. Publishing and the student player

- **Upload:** each MP4 goes to YouTube as **unlisted** in a "Pet Town lessons" playlist, with the `.vtt` captions file added.
  - Version 1 is a manual upload.
  - Later, a YouTube Data API upload script could be added. It would need Andy's Google OAuth sign-in in the Codespace only, never in the app.
- **Record the video id:** `node scripts/set-video.mjs bio1:cells <youtubeId> --kind placeholder --minutes 4.5` writes it into `lessonVideos.js`.
- **Player:** the student sees a **▶ Watch the lesson** button. It opens the video in Pet Town, using the `youtube-nocookie.com` embed with captions on and related videos limited, instead of sending the student to Khan.
- **Khan link:** when a lesson has a video, the Khan link is not shown to students. Only the teacher can see it, in the Lessons & questions tab, as a reference.
- **Watched:** after 80% of the video has played (YouTube player events), the lesson is marked watched in the student's save, as `state.videosWatched[key] = date`. Later, the teacher report can show "watched before practicing."
- **YouTube blocked at school:** the player says so and offers the teacher's link if the class has one. A school-hosted MP4 copy is a later option (Phase 5 idea).

### Status report: `scripts/video-status.mjs`

Prints every lesson in Khan order with its state:

```
bio1.1  Cells                         recorded     4:30
bio1.2  Cell parts                    placeholder  3:50
bio1.3  Body systems                  script only
bio1.4  Plant and animal cells        Khan link    (no script yet)
Coverage: 2 of 49 with video (1 recorded) · math 0 of 60
```

This is the to-do list for recording: record the lessons with the most practice first.

## Order of work

| # | Step | What it delivers |
|---|---|---|
| 13 | Catalog and player | `lessonVideos.js`, the in-Pet-Town player, the Khan link hidden when a video exists, `set-video.mjs`, and watched tracking. Tested with one hand-made video. |
| 14 | Script format and builder | `build-video.mjs`, set up with Piper and ffmpeg in the Codespace, and `video-status.mjs`. Prototype: one Biology lesson and one math station, end to end on YouTube. **Andy decides if placeholder quality is good enough before step 15.** |
| 15 | Scripts, unit by unit | Written with Claude in chat, reviewed, then built: Biology, then History 1 to 4, then English, then math stations (6th grade, then 4th). One patch per unit, like the question banks. |
| 16 | Recording swaps | Andy records over placeholders, starting with the lessons most used in practice; `set-video.mjs --kind recorded`. |
| 17 | Teacher view | The Lessons & questions tab shows each lesson's video (placeholder or recorded) and how many students watched it. The report shows "watched before practicing" next to practice results. |

## Decisions

**Settled:**

- **Videos are made two ways:** auto-built placeholders first, then recorded by Andy.
- **Hosting:** YouTube, unlisted, embedded in Pet Town.
- **Khan's role:** the Khan unit test check stays as the outside benchmark. Khan's order stays; Khan's videos go.

**Still open:**

- **Voice:** the free offline voice (Piper) or a paid, more natural voice for placeholders? The paid voice would be used only while building, never at run time.
- **Avatar:** do recorded videos show Andy on camera, or a screen with his voice?
- **TPT version:** for classes outside Andy's school, ship the video links (YouTube) or the MP4 files?
