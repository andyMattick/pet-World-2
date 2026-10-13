# Getting started with Pet Town

There are two ways to set up Pet Town. Both use the same website and the same teacher app.

| You are… | Use | Who checks the work |
|---|---|---|
| **A teacher with students** | Part A: a class with many students | You, in the teacher app. Parents can also check work at home with a grown-up PIN. |
| **A family, no teacher** | Part B: a class of one, with you as the "teacher" | You, either in the game (grown-up PIN) or in the teacher app |

In both, the student signs in with a **class code, their name and a PIN**. Their work saves to the server, so they can switch between a tablet and a computer.

You'll need two addresses: the **game** (your Pet Town site) and the **teacher app** (the same site with `/teacher` at the end, for example `pet-world-2.vercel.app/teacher`). The game's sign-in screen also has a **Teacher or parent? Open the dashboard** link.

---

## Part A: A teacher and a class

### 1. Make your teacher account (once)
Open the teacher app, type your email and a password, and tap **Create an account**. If it says to check your email, click the link in the email, then sign in.

### 2. Make a class
Type a class name (for example "Period 3") and tap **Add class**. The **class code** shows at the top of the page.

### 3. Add students and print PIN cards
- **Roster** tab → **Add students**: type the names, one per line. First name and last initial works well ("Maya M."). No emails are needed.
- Each student gets a 4-digit PIN. **Print PIN cards** right away. You can also tap **Copy class list** later to see the PINs again.
- If a student forgets their PIN, or gets locked out after 5 wrong tries (they're locked out for 10 minutes), tap **New PIN** next to their name.

### 4. Choose class settings
Settings tab → Class settings:
- **Home grade**, and how far each building is unlocked.
- **Allow music**.
- **Use Khan Academy.** Leave it on if you'll use Khan's videos and unit tests; see KHAN-SETUP.md. Turn it off if you won't.
- **Arcade.**

Tap **Save**. The Settings tab also shows how students join, with a button to copy the instructions.

### 5. Students join (first time on each device)
On the game site, they type the **class code**, tap their **name**, and type their **PIN**. After that, the device remembers them. "Not you? Switch player" in Town Hall signs them out.

### 6. Day to day
- **Dashboard:** who's practicing now, practice time, skills to reteach, and the **🧑‍🏫 Waiting for a grown-up** card. That card lists projects, Reading Log chapters, reading essays and written answers to check. Tap one to open that student at the right tab.
- **A student's page** (tap their name): the subject tabs, 📁 Projects, ✍️ Written answers and 📖 Reading Log. This is where you **Verify** work or request a revision. Your verdict replaces a parent's.
- **Excusing a quiz or test, or opening a unit's tests early:** on the student's page, use **Excuse quiz** or **Open all tests**.

### 7. Optional
- **Lessons & questions:** use your own video or link for a lesson, hide or edit questions, and log Khan unit test results.
- **Vocabulary:** the class word list (`Set: Lesson 4` headings make your own sets), focus words, and the words students flagged while reading.

---

## Part B: A family, no teacher

You set up a class of one and act as the teacher. It takes about 5 minutes, and it lets your child use more than one device.

### 1. Set up (once, on your computer)
Do Part A, steps 1 to 4, with these changes:
- Name the class something like "Home".
- Add just your child in the Roster tab, and **keep the PIN card**.
- In Class settings, turn off **Use Khan Academy** if you won't use Khan.

### 2. Your child signs in
On each device, open the game site and enter the class code, their name and the PIN.

### 3. Make your grown-up PIN (in the game)
The first time you open a grown-up area, Pet Town asks you to **make a 4-digit grown-up PIN**. The grown-up areas are Town Hall → **Open the progress report**, and Word Workshop → **For grown-ups**. The grown-up PIN is separate from your child's sign-in PIN, so don't share it.

### 4. Check work right where your child is
You don't have to go to the teacher app:

- **Projects and labs:** after your child submits, open the project and type the grown-up PIN under it, then tap **Verify** or **Request revision**. If the unit test is waiting on a project, this is what unlocks it.
- **Reading Log chapters:** same, in the chapter. The buttons are **Notes match the book** and **Needs fixing**.
- **Written answers:** Town Hall → progress report.
- **Word Workshop → For grown-ups:** add your own words (for example from Wordly Wise, in your own wording) and add meanings for the words your child flagged while reading.

Everything you check this way also shows in the teacher app as "Verified by a parent".

### 5. When you want the bigger picture
The teacher app's Dashboard and your child's page show practice time, skills, mix-ups, and everything that's waiting.

---

## Good habits (everyone)

- **Use one device at a time.** Before switching devices, let Pet Town sit for a few seconds after the last answer so it can save. Pet Town merges projects, reading notes and written answers from two devices. Practice counts still use the most recent save.
- **Don't keep Pet Town open in two tabs** on the same student.
- **The grown-up PIN is for grown-ups.** Anything checked with it counts as checked.

## Without a server (rare)

A copy of Pet Town running without Supabase (no `.env`) works in **local mode**:
- There's a name screen instead of a class code, and no teacher app.
- Progress is saved only in that one browser.
- The progress report then has **Unlock every station** and **Show Khan Academy links** switches.

Use this only for trying Pet Town out. A class of one (Part B) is better for real use.

## More help

- Khan Academy setup, and which Khan unit goes with which building: **KHAN-SETUP.md**
- Turning Khan off: **KHAN.md**
- Vocabulary and word lists: **VOCAB.md**
- Written answers and the newer question types: **QUESTION-TYPES.md**
