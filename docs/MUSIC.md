# Music: choose a track, set the volume

**Status: ready.** Steps 1 and 2 need no database change. Step 3 needs `20260929000000_practice_time.sql` (item 12; it adds `classes.game_settings`). Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## What students get

- **Tapping 🎵** opens a small music menu instead of just switching music on and off:
  - **4 tracks:** ☕ Café Stroll (today's tune, the default), 🌳 Sunny Park, 🌙 Starry Night (slow and calm), and 🕹️ Arcade Hop (fast).
  - Tapping a track switches to it right away.
  - A **volume slider** (0 to 100).
  - A **Music off** switch.
- The **Fact Sprint** still speeds the current track up: tempo × 1.35, the same as today's jump from 96 to about 130.
- **Choices are saved** with the town: `S.musicTrack` (default `'cafe'`) and `S.musicVolume` (default 70). They follow the student between devices when signed in.
- The 🔊 sound-effects button doesn't change.
- The menu works at iPhone SE size, with tap targets of at least 44px, and closes when tapping outside it.

## What teachers get (step 3)

- **Settings tab → a new "Game" card:** an **Allow music** switch, saved in `classes.game_settings.allowMusic`. It's on by default.
- When it's off, music never plays for that class. The 🎵 button shows 🔇 and "Your teacher turned music off." Sound effects stay under the student's control.

## The tracks

Each track is 4 bars, looped. Every note of the three new tracks was checked against its key and chords; the strong beats of Starry Night and Arcade Hop land on chord notes every time. Café Stroll is today's tune, copied exactly. **Paste it exactly:**

```js
/* Background music tracks. Each is 4 bars of 8 eighth notes, looped.
   chords: 4 chords (MIDI notes), bass: 4 root notes, arp: which chord note plays on each eighth
   (null = rest), melA / melB: 32 melody eighths (null = rest). The first loop plays chords only,
   then melA, melA, melB, repeating (same pattern as the original café tune). */
const TRACKS = {
  cafe:   { name: 'Café Stroll', emoji: '☕', tempo: 96, key: 'C major', lead: 'sine', pad: 'triangle',
    chords: [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]], bass: [36,33,41,43], arp: [0,1,2,3,2,1,2,1],
    melA: [76,null,79,null,81,79,76,null, 72,null,76,null,74,null,72,null, 69,null,72,null,74,72,69,null, 71,null,74,null,79,null,null,null],
    melB: [79,null,76,79,81,null,79,null, 76,null,72,null,76,74,null,null, 72,null,69,72,74,null,76,null, 74,null,71,null,67,null,null,null] },
  park:   { name: 'Sunny Park', emoji: '🌳', tempo: 108, key: 'G major', lead: 'triangle', pad: 'triangle',
    chords: [[55,59,62,67],[50,54,57,62],[52,55,59,64],[48,52,55,60]], bass: [43,38,40,36], arp: [0,2,1,3,0,2,1,2],
    melA: [71,null,74,null,79,null,74,null, 74,null,69,null,74,76,74,null, 71,null,76,null,79,76,71,null, 72,null,76,null,74,72,71,null],
    melB: [79,null,78,76,74,null,71,null, 69,null,74,null,78,null,74,null, 76,null,79,76,71,null,67,null, 72,74,76,null,72,null,67,null] },
  stars:  { name: 'Starry Night', emoji: '🌙', tempo: 72, key: 'A minor', lead: 'sine', pad: 'sine',
    chords: [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]], bass: [45,41,36,43], arp: [0,null,2,null,1,null,3,null],
    melA: [76,null,null,null,72,null,null,null, 72,null,null,null,69,null,null,null, 67,null,null,null,72,null,null,null, 74,null,null,null,71,null,null,null],
    melB: [72,null,74,null,76,null,null,null, 77,null,76,null,72,null,null,null, 76,null,74,null,72,null,null,null, 71,null,null,null,67,null,null,null] },
  arcade: { name: 'Arcade Hop', emoji: '🕹️', tempo: 128, key: 'C major', lead: 'square', pad: 'triangle',
    chords: [[60,64,67,72],[57,60,64,69],[50,53,57,62],[55,59,62,67]], bass: [36,33,38,43], arp: [0,1,2,1,3,1,2,1],
    melA: [72,74,76,79,76,74,72,null, 69,72,76,null,72,69,67,null, 69,72,74,77,74,72,69,null, 71,74,79,null,74,71,67,null],
    melB: [79,null,79,77,76,null,72,null, 76,null,76,74,72,null,69,null, 74,null,77,76,74,null,72,null, 74,76,74,71,67,null,null,null] }
};
```

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open, including at iPhone SE size**. Then `git push` and paste `git log -1 --stat`.

### Step 1: Tracks in the music engine

1. Paste the `TRACKS` block just above the `Music` module in `src/game/game.js`.
2. Change the `Music` module to play `TRACKS[S.musicTrack] || TRACKS.cafe`, replacing its fixed `CH`, `BASS`, `ARP`, `MA`, and `MB` arrays and its 96/132 tempos:
   - The chord arpeggio uses `track.arp`, where `null` is a rest, and the `track.pad` waveform.
   - The melody uses `track.melA` and `track.melB` with the `track.lead` waveform. For a `square` lead, lower the melody's volume by half, so it isn't harsh.
   - The tempo is `track.tempo`, or `track.tempo × 1.35` during the sprint (`setTempo` takes a multiplier instead of a number).
   - Add `Music.setTrack(id)`, which switches at the next bar without stopping, and `Music.setVolume(v)`, where 0 to 100 maps to a master gain of 0 to 0.13 (70 gives about 0.09, today's level).
3. Add `musicTrack: 'cafe'` and `musicVolume: 70` to `fresh()` and `normalize()`.

**Test:** the café tune sounds exactly like before, and the sprint still speeds it up.

Commit: `Music tracks`

### Step 2: Music menu

- The 🎵 button opens a small popover: the track list (emoji and name, with the current one checked), the volume slider, and the Music off switch.
- The **music on/off setting (`S.music`) keeps working as today**.
- Choosing a track starts music if it was off.
- The menu closes when tapping outside it or pressing Escape.

Commit: `Music menu`

### Step 3: Teacher "Allow music"

- In `src/lib/studentBackend.ts`, add `game_settings` to `StudentInfo`, and refresh it in `refreshSettings()`.
- In the game, when `Backend.me?.game_settings?.allowMusic === false`, stop the music, keep it off, and make the 🎵 button show 🔇 with the note "Your teacher turned music off" instead of the menu.
- In the teacher app, add the **Game** card on the Settings tab with the Allow music switch, saved to `classes.game_settings`, and keep any other keys already in it.

Commit: `Teacher can turn off music`

### Step 4: Safety check

In `scripts/verify.mjs`, **add** checks without removing any: `game.js` contains `const TRACKS = {` and `musicTrack`. Update the three instruction files, keeping them identical.

Commit: `Verify covers music`

## Acceptance checks

1. All 4 tracks play, switch smoothly, and loop. Café Stroll sounds exactly like before.
2. The volume slider changes the music but not the sound effects. 0 is silent.
3. The sprint speeds up whichever track is playing, and it returns to normal speed after.
4. Choices are remembered after a reload and on another device when signed in.
5. With Allow music off, no music plays for anyone in the class, and students see why.
6. The menu works on a phone.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
