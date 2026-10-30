# Biology Unit 5: Inheritance and Variation (the Farm Barn)

Follows Khan Academy's middle school biology unit **Inheritance and variation** (chromosomes, mutations, sexual reproduction, genetics vocabulary and Punnett squares). The student is a tour guide at the Pet World Farm Barn (building `bioGenes`, course `bio5`). It opens after the Butterfly House unit test, like every unit (the course number assumes the Butterfly House is `bio4`).

Owner goal for this unit: **rigorous and fun**. Questions reach Khan's difficulty or go past it, and the genetics problems are generated, so every practice, quiz and test try is new.

## Lessons (Khan's order, read from Khan's lesson sitemaps, Oct 30, 2026)

| Khan lesson | Pet World practices (Khan exercise names) | Videos (`KHAN_VIDEOS.bio5`) | Quiz |
|---|---|---|---|
| Chromosomes (`chrom5`) | Understand: Chromosomes (`chromU`); Apply: Chromosomes (`chromA`) | Chromosomes and genes; Chromosome pairs | |
| Mutations (`mut5`) | Apply: Mutations (`mutA`) | Mutations | Quiz 1 (`bio5:quiz:mut5`: chromU, chromA, mutA) |
| Reproduction and genetic variation (`repro5`) | Understand: Sexual reproduction and genetic variation (`sexVarU`); Apply: Genetics vocabulary (`vocabA`); Apply: Punnett squares (`punnettA`) | Sexual reproduction and genetic variation; Genetics vocabulary; Worked examples: Punnett squares | Quiz 2 (`bio5:quiz:repro5`) |

- Khan URLs: `https://www.khanacademy.org/science/ms-biology/x0c5bb03129646fd6:inheritance-and-variation/…` (`MIV` in `questionBanks.js`). Each lesson's `KHAN_LINKS.bio5` entry opens its first video; every video is its own ▶ button. Each lesson also has an article on Khan.
- **Not confirmed:** where Khan puts its quizzes in this unit (the unit page needs JavaScript). Pet World uses Quiz 1 after Mutations and Quiz 2 after the last lesson (question for Andy). Khan's Mutations sitemap lists only the Apply exercise, so that lesson has one practice.
- Khan unit test: `KHAN_UNIT_TESTS.bio5` (Khan's “Inheritance and variation: Unit test”) and `KHAN-SETUP.md`.
- Pet World unit test: 4 questions per practice (24), pass at 19, plus the unit paragraph (the horned calf from two polled parents). Review first and the grown-up PIN come from the shared course code.
- Each practice has 14 multiple-choice questions (43% at level 3), 2 newer-type questions and 1 short answer (`TYPED_QUESTIONS.bio5`). Review list with answers in bold: `bio5-review.md`.
- **Why it matters.** Chromosomes opens with Barbara McClintock's jumping genes in corn (Nobel Prize 1983), Mutations with Belgian Blue cattle's myostatin mutation, and Reproduction with Gregor Mendel's pea plants (1856 to 1863).
- Role play: `ROLE_CARDS` puts her at the Farm Barn's microscope corner, stable, cattle stalls, piglet pen, sheep fold and breeding board (stage scene `barn`).
- 📇 Review first: 21 term cards (`TERM_CARDS.bio5`).

## 🧬 Generated genetics problems (`src/shared/genetics.js`)

Every practice, quiz and test try adds one fresh problem of each kind to the lesson's pool (`englishQuestions` in `game.js`), with a stable id per kind (`gen:bio5:<skill>:<kind>`) so the teacher's miss rates add up by kind. All animals and traits are real farm genetics: polled (P) over horned cattle, black (B) over red Angus, white (W) over black wool, rose (R) over single comb chickens, roan Shorthorn cattle (codominance, RW), blue Andalusian chickens (incomplete dominance, BW).

| Practice | Kind (level) | What she does |
|---|---|---|
| Apply: Chromosomes | `gamete` (1), `pairs` (1), `fromParent` (2), `whichCell` (2), `spermAllele` (3), `mule` (3) | Real chromosome counts for 12 farm animals; egg and sperm halves; which cell she sees; the fraction of a bull's sperm with an allele; a mule's or hinny's 63 |
| Apply: Mutations | `kind` (1), `effect` (2), `count` (3) | Compares a real DNA gene before and after a mutation; reads both 3 letters at a time with a codon key (the real genetic code) to say what happens to the protein (same, one amino acid, early stop, frameshift), then counts the changed amino acids |
| Apply: Genetics vocabulary | `pheno` (1), `zyg` (1), `sortZyg` (2), `genoFromPheno` (2), `carrier` (3), `alleleCount` (3) | Genotype to phenotype under each kind of dominance; sorts genotypes into homozygous and heterozygous; which pair could have a recessive baby; counts alleles in a herd |
| Apply: Punnett squares | `build` (1), `prob` (1), `buildG` (2), `ratio` (2), `expected` (2), `testcross` (3), `f2` (3), `two` (3), `pedigree` (3), `pedProb` (3) | **Builds the square by typing alleles** (a new answer type, `punnett`; at level 2 she types the parents' alleles on the edges too, including roan and blue crosses), probabilities as fractions or percents, phenotype ratios, expected counts in a litter, a test cross, F1 to F2 (including “of the polled F2, what fraction are carriers?” = 2/3), two babies in a row (1/16, 3/16, 9/16), and family trees (pedigrees: squares, circles, filled shapes) |
| Understand: Sexual reproduction | `clone` (2), `eggTypes` (3) | A clone's genotype; how many allele combinations a hen heterozygous for 2 to 4 genes can put in her eggs |

**The new answer type `punnett`** (`src/shared/questionTypes.js`): she types the two alleles in each box. Capital letters matter, the order inside a box doesn't (“bB” counts as “Bb”), and with typed edges a square drawn with a parent's alleles swapped still counts (the boxes are checked against her own edges). Wrong boxes turn red. Typed answers for probabilities accept the fraction, an equivalent fraction over 4, 8 or 16, the percent (with or without %), and the decimal.

### How it was tested

- `node scripts/check-genetics.mjs`: about **3,000 problems of each of the 27 kinds**. An independent solver (its own Punnett code, its own copy of the genetic code, its own family-tree search) reads only what she sees on a test (the prompt, the DNA letters and codon key, the family-tree picture, the choices) and works out the answer. All 81,000 matched, with no NaN/undefined, no repeated choices, the right choice never the longest, and no give-away words in wrong choices. `--break` breaks one key on purpose and the checker catches it.
- Family trees are drawn from real genotypes, then the question is asked only about an animal whose answer the picture forces (the checker lists every genotype assignment that fits the picture).
- Kinds with small answer spaces repeat more often (for example `mule` has 2 versions and `eggTypes` 3); the Punnett, pedigree, mutation and allele-count kinds are nearly always new.

## 🐄 Barn Breeder (the unit's game)

A card at the bottom of the unit page opens it, and it is in the 🕹️ Arcade. See `BARN-BREEDER.md`.

## 🔬 Hands-on and projects

- Hands-on at home (`src/shared/handsOn.js`, `HANDS-ON.md`): 🧦 Sock Chromosome Pairs (Chromosomes), 📝 Copy-Machine Mutations (Mutations), 🫘 Bean Bag Babies (Reproduction).
- Projects (sent to the teacher, same review flow): `bio5` Barn Family Tree: Follow One Trait (a hand-drawn pedigree photo), and `bio5lab` Experiment: Coin-Toss Calves (40 coin-toss calves in a data table, compared with a Punnett square).
- The Punnett Square Puppy Lab (Biology Unit 2) stays where it is; the Farm Barn levels it up with typed squares, codominance and incomplete dominance, F2 crosses and pedigrees.

## Rewards

A `LIBRARY_SETS` line in `registry.ts` (docs/REWARDS.md): 🐏 🦃 🫏 🐃 🐂 pets and 🪣 🪺 🧶 🚜 🧬 decor.

## Facts checked (October 2026)

- Body-cell chromosome counts: cattle 60, goats 60, sheep 54, pigs 38, horses 64, donkeys 62, chickens 78, turkeys 80, ducks 80, rabbits 44, cats 38, alpacas 74. Mules and hinnies have 63.
- The polled gene is on cattle chromosome 1; polled is dominant. Black is dominant over red in Angus; white over black wool in sheep; rose comb over single comb in chickens. Shorthorn roan is the classic codominance example; blue Andalusian chickens the classic incomplete dominance example (BB black, WW splash white).
- Belgian Blue cattle: an 11-letter deletion in the myostatin gene (described in 1997) causes double muscling.
- The slick-coat mutation helps cattle stay cool in hot climates.
- Barbara McClintock: transposable (“jumping”) genes in corn in the 1940s, Nobel Prize 1983.
- Gregor Mendel grew about 28,000 pea plants from 1856 to 1863; his work was rediscovered in 1900.
- Dolly the sheep was born in 1996, cloned from a body cell of an adult ewe.
- The codon key uses the standard genetic code (ATG = Met; TAA, TAG, TGA = stop).
