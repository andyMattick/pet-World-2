# 🔒 The teacher app's grown-up lock

On a computer the student also uses, the teacher app stays signed in, so a student could open it. A 4-digit grown-up PIN locks it on that computer.

- **From Pet World:** the 👩‍🏫 button in the top bar asks for the grown-up PIN, then opens the teacher app in the same tab, already unlocked. It checks the teacher app's lock on this computer if there is one, otherwise the student's grown-up PIN (the one for the progress report and theme days). If neither exists, the first PIN typed becomes both. If the teacher app isn't locked yet, it gets locked with that PIN.
- **In the teacher app:** a locked computer shows "🔒 Grown-ups only" until the PIN is typed. The unlock lasts for that browser tab. **🔒 Lock** in the header locks it again; **🔒 Set a PIN** opens a small form in the header to lock a computer that has no PIN yet.
- **Forgot the PIN:** "Sign in again" on the lock screen signs out; signing in with the email and password removes the PIN from that computer.
- **Code:** `src/shared/grownupLock.ts`. Only a hash of the PIN is kept, in the browser's localStorage (`pw-teacher-lock`), using the same hash as the game's grown-up PIN; an unlocked tab is remembered in sessionStorage.
- This keeps students out on a shared computer. The teacher app's data is still protected by the Supabase sign-in.
