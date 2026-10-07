# Teacher lesson links and question editing

Read `CLAUDE.md` first. This feature adds to the existing game and teacher app. It does not replace anything. Built-in questions and Khan links stay as the defaults, and everything works as before for classes that change nothing.

## What it does

1. **Khan stays the default; teachers can drop in their own lesson.** For any lesson that shows a Khan link, a teacher can paste their own link (YouTube, Google Drive, their own site) with a title and a short note. Students see the teacher's lesson first, plus a small "Also on Khan Academy" link unless the teacher turns that off. **Back to Khan** removes the custom link.
2. **Teachers can review, edit, hide, add and delete questions** for every lesson that has a question bank (English, History, Biology). Built-in questions are never deleted. A teacher can **hide** one (with **Restore**) or **edit** their own copy (with **Undo edit**). Questions the teacher writes can be edited or deleted for good.
3. **Per class, with a copy button.** Changes are saved on one class. **Copy to my other classes** copies them to the teacher's other classes.

Math stations make new numbers every time, so they have no question bank to edit. If math stations show Khan links, include them in part 1. Otherwise part 1 covers English, History and Biology only.

## Where things are now (October 2026)

- Khan links: `KHAN_LINKS` and `khanLinkHTML(url, name)` in `src/game/game.js`. Lessons with their own link use `lesson.url`.
- Question banks: `mc(prompt, correct, ...wrong)` (answer is always index 0), `BIO1_QUESTIONS`, `BIO1_EXTRA_QUESTIONS` (from `bio1-question-bank.patch`, apply it first), `HISTORY_QUESTIONS`, `HISTORY2_QUESTIONS` to `HISTORY4_QUESTIONS`, `VERB_QUESTIONS`, `PLURAL_QUESTIONS` (and the noun bank) in `src/game/game.js`.
- Loading: `englishQuestions(skillId, courseId)` builds a lesson's pool and shuffles the options. Practice uses `shuffle(pool).slice(0,4)` and quits if `pool.length < 4`. Unit tests draw from the whole pool.
- Class settings already work this way for `quiz_settings`: a jsonb column on `classes`, returned to students by `my_student()`, stored on `StudentInfo` in `src/lib/studentBackend.ts`, refreshed in `refreshSettings()`, and edited in the Settings tab of `src/teacher/main.ts` (`ClassRow`, the `classes` select list, `sb.from('classes').update(...)`). **Follow that same pattern.** Do not add a new table.

## Part A: Database (one new migration file)

New file `supabase/migrations/20261007000000_lesson_content.sql`. Never edit an older migration.

```sql
alter table public.classes add column if not exists lesson_links jsonb not null default '{}'::jsonb;
alter table public.classes add column if not exists question_edits jsonb not null default '{}'::jsonb;
alter table public.classes add constraint classes_lesson_links_object check (jsonb_typeof(lesson_links) = 'object');
alter table public.classes add constraint classes_question_edits_object check (jsonb_typeof(question_edits) = 'object');
alter table public.classes add constraint classes_question_edits_size check (octet_length(question_edits::text) < 500000);
```

Then `create or replace` `my_student()` so it also returns `lesson_links` and `question_edits`. Copy the **latest** definition of `my_student()` (search every migration and use the newest one), and add only these two fields. The existing teacher security rules on `classes` already cover reading and updating the new columns. Check that this is true, and don't add new rules unless it isn't.

### Shapes

`lesson_links`, keyed by `"<courseId>:<lessonKey>"` (`lessonKey` is the group id for `KHAN_LINKS`, or the lesson id for lessons with `lesson.url`):

```json
{ "bio1:cells": { "url": "https://www.youtube.com/watch?v=...", "title": "Cells video", "note": "Watch before practice.", "showKhan": true } }
```

`question_edits`:

```json
{
  "hidden": ["bio1:cellsOrganisms:k3j9a2"],
  "edited": { "bio1:cellPartsU:9xq01m": { "prompt": "...", "options": ["correct", "wrong", "wrong", "wrong"], "difficulty": 2 } },
  "added": { "bio1:cellsOrganisms": [ { "id": "t-lq8z3w1x", "prompt": "...", "options": ["correct", "wrong", "wrong", "wrong"], "difficulty": 1, "status": "approved" } ] }
}
```

`options[0]` is always the correct answer, the same as `mc()`. `status` is `"approved"` or `"draft"`, and students only see approved ones. Drafts are not used yet, but Phase 2 import (Copy prompt, Import) will add drafts here.

## Part B: Shared code

1. **Question ids.** Add `src/shared/questionIds.ts` with `questionId(courseId, skillId, prompt)`. It returns `` `${courseId}:${skillId}:${hash}` ``, where `hash` is FNV-1a 32-bit in base 36 of the prompt (trimmed, lower-cased, spaces collapsed). Built-in questions get ids from their prompt, so the banks don't need editing. If a built-in prompt's text is later changed in code, any hide or edit for it stops applying. That's acceptable, but say so in a code comment.
2. **Move the banks so the teacher app can show them.** The teacher app needs the built-in questions and Khan links, which live in `game.js`. Move `mc`, the question bank constants listed above, `KHAN_LINKS` (with the URL constants it uses), and the lesson lists that hold names and `lesson.url` into `src/shared/questionBanks.js` as exports, and import them back into `game.js`. **Cut and paste the blocks exactly. Do not retype or "tidy" them.** Before and after the move, run a small node check that prints the number of questions per lesson and confirm the counts match. If any bank depends on game-only code (DOM, `S`, `Backend`), stop and ask the owner instead of reworking it.
3. **Merging.** Add `applyQuestionEdits(courseId, skillId, builtIn, edits)` in `src/shared/questionBanks.js`. It gives each built-in question its id, drops hidden ones, swaps in edited versions (same id), and appends `added[courseId:skillId]` items whose `status` is `approved`. It returns objects with the same shape `mc()` makes, plus `id`, `difficulty` and `source` (`built-in`, `edited`, `teacher`). Both apps use this, so the teacher sees exactly what students get.

## Part C: Game (`src/game/game.js`, small edits only)

1. In `englishQuestions(skillId, courseId)`, run each bank lookup through `applyQuestionEdits(courseId, skillId, bank, Backend.me?.question_edits || {})` before the existing `.map(question => ...)` that shuffles options. Keep the rest of the function as it is. In local mode (no backend), pass `{}`.
2. Change `khanLinkHTML(url, name)` to `khanLinkHTML(url, name, key)` and pass `` `${course.id}:${group.id}` `` (or the lesson key) at the call sites. If `Backend.me?.lesson_links?.[key]` has a valid `https://` url:
   - Render the teacher's link first: `▶ ${title || 'Watch your teacher’s lesson'}`, then the note as a short line.
   - If `showKhan !== false`, also render the Khan link with the smaller label "Also on Khan Academy".
   - Otherwise, behave exactly as now.
   - Escape everything with `esc()`, and use `target="_blank" rel="noopener noreferrer"`. Ignore any url that isn't `https://`.
3. Students pick up changes through the existing `refreshSettings()`. Add `lesson_links` and `question_edits` to `StudentInfo` and to `refreshSettings()` in `src/lib/studentBackend.ts`, the same way as `quiz_settings`.

## Part D: Teacher app (`src/teacher/main.ts`)

Add `lesson_links` and `question_edits` to `ClassRow` and to the `classes` select list. Add a new tab, **Lessons & questions**, next to the existing tabs, using the same styles. It works on the currently selected class.

1. **Pick a course and a lesson** (two dropdowns built from the shared lesson lists).
2. **Lesson link card.** Shows the Khan default as a link. Has fields for My link (url), Title and Note (up to 200 characters), plus an "Also show the Khan link" checkbox (on by default), **Save** and **Back to Khan**. Only `https://` links are accepted, and a bad link shows an error.
3. **Question list** for the lesson, built with `applyQuestionEdits`, but showing hidden questions too (greyed out):
   - Each row shows the prompt, the correct answer in bold, the three wrong answers, the difficulty, and a badge (Built-in, Edited, Mine, Hidden).
   - Built-in rows: **Edit**, **Hide** / **Restore**. Edited rows: **Edit**, **Undo edit**, **Hide**. Mine: **Edit**, **Delete** (with a confirm).
   - A line at the top: "Students see N questions in this lesson." If hiding a question would leave fewer than 4, block it with the message "A lesson needs at least 4 questions for practice."
4. **Add / Edit form:** the question, the correct answer, three wrong answers, and difficulty 1–3. Checks: every field filled, the four answers all different, the question under 300 characters, and each answer under 120. New questions get `id: 't-' + random` and `status: 'approved'`.
5. **Saving:** `sb.from('classes').update({ question_edits }).eq('id', cls.id)` and `update({ lesson_links })`, with the same error and success messages as the Settings tab.
6. **Copy to my other classes:** one button that copies this class's `lesson_links` and `question_edits` for the selected course to the teacher's other classes (shown as a checklist, with a confirm). It merges: hidden lists are combined, edits and links from this class win, and added questions are joined by `id`.

## Out of scope for now

- File uploads (teachers paste links only).
- Editing math questions (generated, so no bank).
- Copy prompt and Import (Phase 2). The `status: "draft"` field is ready for it.
- Logging question ids with answers and the miss-rate report (later roadmap steps).

## How to check it

1. `npm run typecheck`, `npm run build`, `npm run verify` all pass.
2. The before-and-after node check from Part B shows the same counts.
3. Without the migration run (or for a class that changes nothing), the game looks and plays exactly as before.
4. With a test class:
   - Add a link for Biology "cells". Students see it with the Khan link under it. **Back to Khan** restores the default.
   - Hide one built-in question, then confirm it never appears in 10 practice runs. **Restore** brings it back.
   - Edit a built-in question, and confirm students see the edited text.
   - Add a question, and confirm it appears in practice and the unit test. Delete it, and confirm it's gone.
   - Try to hide down to 3 questions. It's blocked.
   - Copy to a second class, and confirm the second class matches.
5. Another teacher can't read or change this class's links or questions (the existing class security rules).
