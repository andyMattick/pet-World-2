# 💬 Messages with a grown-up

A grown-up (a parent or teacher) can write to a student from the teacher app, and she can write back. Owner decision (Oct 26, 2026): messages are always labeled with the grown-up's name. The chat never says it's a bot.

## Teacher app

- **💬 Messages** is on the class **Dashboard**, above the report (`messagesPanel` in `src/teacher/chat.ts`, added to the page by `renderDashboard` in `main.ts`). It moved there from each student's page on Oct 26, 2026.
- Every student in the class is a button. A red **"2 new"** counts replies since you last opened that student's messages (remembered on this device). A 💬 means there's a conversation.
- Tap a student to open the conversation (`startChatCard`). Type your name once (like "Dad"; it's remembered on this device), write, and press Send (or Ctrl/⌘+Enter).
- The panel stays put through the dashboard's live refreshes, so a message you're typing isn't lost. A reply that arrives while you're typing doesn't wipe it either.
- Messages are saved in `quiz_overrides` as `chat`: `{"msgs":[{"id","at","from","text"}]}` (the last 60). This is the same pipe as Bible verses and help answers, so no new tables or functions.
- Her replies come from her save. They show right away from the dashboard's load, then get checked every 20 seconds while the conversation is open. "✓ She has seen your last message" shows once she opens it.
- **Clear my messages** removes your messages from her screen. Her replies stay in her save.

## In her town

- A 💬 button shows in the bottom-right corner when there are messages, with the number of new ones (it bounces a few times). A note pops up when a new one arrives: "💬 New message from Dad".
- The town checks for new messages every 30 seconds while it's open (`Backend.refreshSettings`). It also picks them up whenever it refreshes settings anyway.
- Tapping 💬 opens **Messages from Dad**: every message with who wrote it and when, her replies on the right, and a box to write back. Her time is paused while it's open, like ✋ questions.
- Saved state: `S.chat = {seenAt, replies:[{id, at, text}]}` (the last 60 replies).
- Not shown in Look-only mode, or in local mode (no sign-in).
