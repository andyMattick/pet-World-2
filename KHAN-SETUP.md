# Setting up Pet World with Khan Academy

A one-page guide for a new teacher or family. How Khan works inside Pet World, and how to turn it off, is in [KHAN.md](KHAN.md).

**Khan is optional.** Pet World's practice, quizzes, unit tests and projects work without it. Khan adds two things:

- **Lessons:** the videos and articles behind each English, History and Biology block, and the math skills.
- **An outside check:** a Khan unit test after the Pet World unit test.

If you won't use Khan, skip this page and turn Khan off (see KHAN.md).

## 1. Set up Khan Academy (once)

1. Make a free Khan Academy account.
   - **Teacher:** create a Khan class, and have students join it with its class code.
   - **Family:** add your child to your parent account.
2. Add the Khan courses that match the Pet World buildings you'll use, from the table below. You only need the ones you'll use. Khan sometimes renames courses, so use the unit links if a name doesn't match.

## 2. Which Khan unit goes with which building

| Pet World building | Khan course | Khan unit(s) |
|---|---|---|
| Pet Café | [6th grade math](https://www.khanacademy.org/math/cc-sixth-grade-math) | [Ratios](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic) (unit 1) |
| Bakery | 6th grade math | [Arithmetic operations](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations) (unit 2) |
| Market Stall | 6th grade math | [Rates and percentages](https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages) (unit 3) |
| Clock Tower | 6th grade math | [Exponents and order of operations](https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-exponents-and-order-of-operations) (unit 4) |
| Ice Rink | 6th grade math | [Negative numbers](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-negative-number-topic) (unit 5) |
| Potion Lab | 6th grade math | [Variables and expressions](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-expressions-and-variables) (unit 6) |
| Pet Fair | 6th grade math | [Equations and inequalities](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-equations-and-inequalities) (unit 7) |
| Pet Houses | 6th grade math | [Plane figures](https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-plane-figures) (unit 8) |
| Pet Harbor | 6th grade math | [Coordinate plane](https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:coordinate-plane) (unit 9) |
| Pet Post Office | 6th grade math | [Volume and surface area](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-geometry-topic) (unit 10) |
| Pet Show | 6th grade math | [Data and statistics](https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-data-statistics) (unit 11) |
| Lemonade Stand, Toy Shop, Pizza Parlor, Garden Center | [4th grade math](https://www.khanacademy.org/math/cc-fourth-grade-math) | Place value, addition and subtraction, multiplication and division, fractions, decimals, measurement and data, area and perimeter. Each station links to its own exercise. |
| Story Corner Library (nouns) | Grammar | [The noun](https://www.khanacademy.org/humanities/grammar/parts-of-speech-the-noun) |
| Action Library (verbs) | Grammar | [The verb](https://www.khanacademy.org/humanities/grammar/parts-of-speech-the-verb) |
| Superhero Factory (punctuation) | Grammar | [Punctuation: end-of-sentence punctuation, the comma, and the apostrophe](https://www.khanacademy.org/humanities/grammar/punctuation-the-comma-and-the-apostrophe) |
| Origins of History Museum | World history | [Origins of history](https://www.khanacademy.org/humanities/world-history/x66f79d8a:origins-of-history) |
| Rift Valley Museum | World history | [Early humans](https://www.khanacademy.org/humanities/world-history/x66f79d8a:early-humans) |
| Nile Valley Museum | World history | [Early agrarian societies](https://www.khanacademy.org/humanities/world-history/x66f79d8a:early-agrarian-societies) |
| Rome Museum | World history | [Empires and belief systems](https://www.khanacademy.org/humanities/world-history/x66f79d8a:empires-and-belief-systems). Comparing portable belief systems and The rise and fall of empires link straight to Khan; the other lessons show a Khan search. |
| Nature Center (Biology) | Grade 6 science | [Life sciences](https://www.khanacademy.org/science/grade-6-science/x88f5990a7622d8f5:life-sciences) |
| Petting Zoo (Biology Unit 2) | Middle school biology | Organism growth and reproduction (a teacher can still paste their own links in Lessons) |

A few math stations borrow one exercise from another Khan course, such as 7th grade math or Algebra basics. Pet World links straight to that exercise, so you don't need to add those courses.

## 3. How a student uses both

1. Open a building. Each lesson in English, History or Biology has a **Watch or read this lesson on Khan Academy** link. The student watches or reads it, then does the Pet World practice under it.
2. Practice and quizzes happen in Pet World, where the teacher sees step-by-step results.
3. After passing the **Pet World unit test**, the student takes the matching **Khan unit test**.
4. **Teacher:** log the Khan score and the topics missed in Lessons & questions → **Khan unit test check**. A score counts as passed at 80% unless you change it.
   - Each missed topic sends its lessons back to the student as **🔁 Review** in Pet World.
   - A topic clears itself when the student passes those practices again.
   - Families without a class can skip the logging and just use the links.

## 4. Your own lessons instead of Khan's

For any lesson, Lessons & questions → **Lesson video or link** lets you paste your own YouTube video or page. Students see yours first. You choose whether the Khan link still shows under it.

## 5. Problems

| Problem | Fix |
|---|---|
| A Khan link opens the wrong page or "page not found" | Run `npm run check-links` (needs internet). It lists dead links and links Khan now redirects. Fix them in `src/shared/registry.ts` (math) or `KHAN_LINKS` in `src/shared/questionBanks.js`. `npm run verify` also checks that every link is a well-formed Khan address. |
| The school blocks Khan Academy | Turn Khan off for the class (KHAN.md), or give your own lesson links. |
| A student can't find a Khan unit test | Check the Khan course is added to the student's Khan class or parent account. Use the unit links in the table above. |
