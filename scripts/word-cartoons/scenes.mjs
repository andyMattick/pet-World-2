/* One scene per cartoon word (docs/WORD-PICTURES.md). Each returns [inner SVG, background color?].
   Pets act out the meaning; one clear idea per picture; no words in the picture unless marked (TEXT_OK). */
import { C, g, circle, ellipse, rect, path, poly, line, noStroke, sw, text, limb, pet, P, heart, star, sparkle, check, cross, arrow, curveArrow,
  bubble, thought, magnifier, carrot, cookie, ball, cloud, sun, ground, sweat, motion, bulb, paw } from './lib.mjs';

/* sunglasses for influence: dark lenses with a light frame and shine, so they show on a brown dog too */
const SHADES = path('M-28 -82h22q0 14 -11 14t-11 -14zM6 -82h22q0 14 -11 14t-11 -14z', C.ink, ` stroke="${C.butter}" stroke-width="3"`) + path('M-6 -80h12', 'none', ` stroke="${C.butter}" stroke-width="3"`) + path('M-22 -78l4 -2M12 -78l4 -2', 'none', ` stroke="${C.white}" stroke-width="2.5"`);

/* words whose picture has big, essential text (numbers): the check script allows these */
export const TEXT_OK = { estimate: '50?', century: '100', perspective: '6 / 9 (a 6 lying flat, seen from both sides)', sequence: '1 2 3' };

export const SCENES = {
  /* ---------- Set 1 ---------- */
  analyze: () => [
    // a toy robot taken apart into pieces on a table; the cat holds a magnifying glass over one piece to study it
    rect(78, 146, 118, 14, C.wood, 6) + path('M88 160v26M186 160v26', 'none', sw(5)) +
    rect(92, 118, 28, 26, C.gray, 5) + circle(101, 129, 3.5, C.ink, noStroke) + circle(111, 129, 3.5, C.ink, noStroke) + path('M106 118v-8', 'none', sw(3)) + circle(106, 108, 4, C.berry, sw(3)) +
    rect(132, 116, 26, 30, C.blue, 5) + circle(145, 128, 4, C.butter, sw(3)) +
    rect(166, 132, 22, 9, C.gray, 4, sw(3)) + rect(166, 104, 9, 22, C.gray, 4, sw(3)) + circle(184, 116, 9, C.dark, sw(3.5)) +
    path('M124 108l4 -4M160 100l3 4', 'none', sw(3)) +
    P({ kind: 'cat', mood: 'calm', look: 1, arms: [null, [52, -54]] }, { x: 44, y: 188, s: 0.72 }) +
    magnifier(106, 126, 20, -35) + ground(188, C.path)
  ],
  compare: () => [
    // two circles that overlap: a cat in one, a dog in the other, the thing they share in the middle
    circle(72, 104, 60, '#FFE3C4', ' fill-opacity=".85"') + circle(128, 104, 60, '#D9F3EA', ' fill-opacity=".85"') +
    circle(72, 104, 60, 'none') + circle(128, 104, 60, 'none') +
    g(pet({ kind: 'cat', mood: 'happy', tail: false }), { x: 56, y: 150, s: 0.5 }) +
    g(pet({ kind: 'dog', mood: 'happy', tail: false }), { x: 144, y: 150, s: 0.5 }) +
    heart(100, 106, 1.2)
  ],
  contrast: () => [
    // night and day, a dark cat and a white cat back to back: how they are different
    path('M28 0H100V200H28Q0 200 0 172V28Q0 0 28 0z', '#3E3350', noStroke) + path('M100 0H172Q200 0 200 28V172Q200 200 172 200H100z', '#FFF4CC', noStroke) +
    path('M100 6V194', 'none', sw(5)) +
    path('M56 30a14 14 0 1 0 14 18a11 11 0 1 1 -14 -18z', C.butter, sw(3.5)) + star(26, 54, 6, C.white) + sun(158, 42, 13) +
    P({ kind: 'cat', color: C.dark, mood: 'calm', look: -1 }, { x: 52, y: 182, s: 0.85 }) +
    P({ kind: 'cat', color: C.white, mood: 'smile', look: 1 }, { x: 148, y: 182, s: 0.85, flip: true })
  ],
  describe: () => [
    // a dog tells three things about a ball: its color (red), its size (big), and how it bounces
    bubble(70, 10, 124, 70, 74, 104) + path('M111 18v54M152 18v54', 'none', sw(3)) +
    circle(90, 45, 13, C.berry) +
    path('M118 26h26', 'none', sw(3.5)) + path('M123 21l-5 5l5 5M139 21l5 5l-5 5', 'none', sw(3.5)) + circle(131, 52, 13, C.white) +
    path('M158 34q8 -18 14 6q6 -18 12 0', 'none', ' stroke-dasharray="1 6" stroke-width="4"') + circle(186, 62, 6, C.berry, sw(3)) + path('M176 72h18', 'none', sw(3)) +
    ball(150, 156, 22) + ground(178) +
    P({ kind: 'dog', mood: 'happy', arms: [null, [52, -56]] }, { x: 58, y: 178, s: 0.8 })
  ],
  evidence: () => [
    // a detective dog holds up a clue bag with a paw print in it, and a check: this shows what really happened
    rect(92, 34, 84, 100, '#EAF6FB', 10) + rect(92, 34, 84, 16, C.berry, 6) +
    g(ellipse(0, 6, 14, 11, C.ink, noStroke) + ellipse(-15, -9, 5, 6.5, C.ink, noStroke) + ellipse(-5, -17, 5, 6.5, C.ink, noStroke) + ellipse(6, -17, 5, 6.5, C.ink, noStroke) + ellipse(16, -9, 5, 6.5, C.ink, noStroke), { x: 134, y: 92 }) +
    check(160, 150, 1.4) +
    P({ kind: 'dog', mood: 'smile', look: 1, arms: [null, [50, -84]], top: path('M-34 -96q34 -26 68 0z', '#6B8F7E') + rect(-36, -100, 72, 8, '#6B8F7E', 4) }, { x: 56, y: 190, s: 0.8 })
  ],
  predict: () => [
    // a cat sees dark clouds and thinks "rain is coming", so she holds an umbrella before it rains
    cloud(52, 36, 1.2, '#9C8A97') + cloud(88, 28, 1, '#B5A8B2') +
    thought(150, 52, 38, 30, 118, 104) + cloud(150, 44, 0.75, C.blue) + path('M138 64l-4 9M152 64l-4 9M166 64l-4 9', 'none', ` stroke="${C.blue}" stroke-width="4"`) +
    ground(182) +
    P({ kind: 'cat', mood: 'calm', look: 1, arms: [[-30, -50], null] }, { x: 100, y: 182, s: 0.8 }) +
    path('M70 146V100', 'none', sw(5)) + path('M44 104q26 -34 52 0q-6 -6 -13 0q-6 -6 -13 0q-6 -6 -13 0q-6 -6 -13 0z', C.berry, sw(4)) + path('M70 146q0 8 -7 6', 'none', sw(5))
  ],
  summarize: () => [
    // a tall stack of pages goes in, one small card with the main ideas comes out
    rect(20, 46, 64, 16, C.white, 3) + rect(16, 62, 64, 16, C.cream, 3) + rect(22, 78, 64, 16, C.white, 3) + rect(16, 94, 64, 16, C.cream, 3) + rect(20, 110, 64, 16, C.white, 3) + rect(16, 126, 64, 16, C.cream, 3) +
    arrow(92, 92, 120, 92) +
    rect(128, 66, 58, 52, C.butter, 8) + path('M138 80h38M138 92h38M138 104h24', 'none', sw(4)) + star(184, 64, 10) +
    P({ kind: 'bunny', mood: 'happy', arms: [[-28, -46], null] }, { x: 154, y: 196, s: 0.5 })
  ],
  infer: () => [
    // an empty cookie jar with its lid off, a trail of crumbs into a bush, and a dog's tail wagging out of the bush: the cat figures out who did it
    path('M70 118h38v42q0 10 -10 10h-18q-10 0 -10 -10z', '#E8F7FF') + rect(74, 108, 30, 12, C.white, 4) + circle(89, 144, 11, C.white, sw(3)) + cookie(89, 144, 8) +
    g(rect(-17, -5, 34, 10, C.wood, 5) + circle(0, -9, 5, C.wood, sw(3.5)), { x: 112, y: 100, rot: 35 }) +
    [[114, 166], [126, 160], [138, 167]].map(([x, y]) => circle(x, y, 5.5, '#E3A55F', sw(3))).join('') +
    path('M130 172q-10 -36 16 -42q14 -24 30 -4q8 8 4 46z', C.grass2) +
    path('M184 138q14 -10 6 -40', 'none', ' stroke-width="18"') + path('M184 138q14 -10 6 -40', 'none', ` stroke="${C.wood}" stroke-width="8"`) +
    ellipse(180, 150, 16, 15, C.wood) + ellipse(184, 168, 10, 5.5, C.wood) + path('M176 92q-8 6 -4 18M168 86q-12 10 -6 26', 'none', sw(4)) +
    ground(172) +
    thought(78, 46, 46, 34, 40, 104) + g(pet({ kind: 'dog', mood: 'happy', tail: false }), { x: 70, y: 76, s: 0.38 }) + text(108, 62, '!', 34, C.berry) +
    P({ kind: 'cat', mood: 'calm', look: 1 }, { x: 34, y: 172, s: 0.52 })
  ],
  explain: () => [
    // a dog at a board shows how a seed becomes a flower, step by step; the bunny gets it (light bulb)
    rect(10, 18, 128, 82, C.board, 10) +
    g(ellipse(0, 0, 6, 4, C.wood, sw(3)), { x: 30, y: 62 }) + arrow(42, 60, 58, 60, C.chalk, 4) +
    path('M74 70v-16M74 58q-8 -10 -12 -2M74 58q8 -10 12 -2', 'none', ` stroke="${C.grass2}" stroke-width="4"`) + arrow(92, 60, 106, 60, C.chalk, 4) +
    path('M120 78v-18', 'none', ` stroke="${C.grass2}" stroke-width="4"`) + circle(120, 52, 8, C.pink, sw(3)) + circle(120, 52, 3, C.butter, noStroke) +
    P({ kind: 'dog', mood: 'happy', look: -1, arms: [[-50, -70], null] }, { x: 66, y: 192, s: 0.62 }) +
    P({ kind: 'bunny', mood: 'happy', look: -1 }, { x: 162, y: 192, s: 0.62 }) +
    circle(162, 40, 13, C.butter, sw(4)) + rect(156, 52, 12, 8, C.gray, 2, sw(3)) + path('M144 24l-6 -6M180 24l6 -6M162 18v-6', 'none', ` stroke="${C.orange}" stroke-width="4"`)
  ],
  identify: () => [
    // birds in a row; the dog points at one and holds its name tag
    line(10, 104, 190, 104, sw(5)) +
    [30, 74, 118, 162].map((x, i) => g(ellipse(0, -16, 16, 15, i === 2 ? C.berry : C.blue) + circle(4, -22, 2.8, C.ink, noStroke) + poly([[14, -20], [24, -16], [14, -13]], C.butter, sw(3)) + path('M-4 -2v7M4 -2v7', 'none', sw(3)), { x, y: 98 })).join('') +
    circle(118, 82, 25, 'none', ` stroke="${C.green}" stroke-width="6"`) +
    P({ kind: 'dog', mood: 'happy', look: 1, arms: [null, [52, -72]] }, { x: 70, y: 196, s: 0.6 }) +
    rect(132, 136, 54, 30, C.white, 6) + circle(140, 151, 4, C.ink, noStroke) + path('M148 151h28', 'none', sw(4)) + line(118, 110, 140, 136, sw(3))
  ],

  /* ---------- Set 2 ---------- */
  abundant: () => [
    // a basket overflowing with carrots, carrots all around: more than enough
    [[30, 150, -20], [60, 158, 10], [150, 156, -10], [176, 150, 20], [44, 124, -40], [160, 120, 35]].map(([x, y, r]) => carrot(x, y, 1, r)).join('') +
    [[66, 74, -20], [84, 68, 0], [100, 64, 10], [118, 70, 20], [134, 76, 30], [76, 86, -5], [94, 82, 5], [110, 84, 15], [126, 86, 25]].map(([x, y, r]) => carrot(x, y, 1, r)).join('') +
    path('M50 92h100l-12 62h-76z', C.wood) + path('M60 110h80M64 130h72', 'none', ` stroke="${C.woodDark}" stroke-width="4"`) +
    P({ kind: 'bunny', mood: 'happy', arms: [[-46, -70], [46, -70]] }, { x: 100, y: 196, s: 0.42 })
  ],
  scarce: () => [
    // the same basket, almost empty: just one carrot left lying in it, and the bunny is worried
    ellipse(80, 112, 50, 9, C.woodDark) + carrot(80, 100, 1.3, 90) +
    path('M30 112h100l-12 62h-76z', C.wood) + path('M40 130h80M44 150h72', 'none', ` stroke="${C.woodDark}" stroke-width="4"`) +
    P({ kind: 'bunny', mood: 'sad', look: -1, extra: sweat(30, -92) }, { x: 160, y: 182, s: 0.66 }) + ground(182, C.path)
  ],
  reluctant: () => [
    // a kind cat gently pulls a dog toward the bath, but the dog leans way back with its paws dug in: it doesn't want to go
    path('M130 116h64v18q0 22 -22 22h-20q-22 0 -22 -22z', C.white) + path('M138 160l-4 10M186 160l4 10', 'none', sw(5)) +
    circle(140, 108, 9, '#E8F7FF', sw(3)) + circle(156, 104, 11, '#E8F7FF', sw(3)) + circle(174, 106, 10, '#E8F7FF', sw(3)) + circle(188, 110, 7, '#E8F7FF', sw(3)) + circle(166, 82, 5, '#E8F7FF', sw(3)) +
    path('M36 152L77 151', 'none', ` stroke="${C.berry}" stroke-width="6"`) +
    P({ kind: 'cat', mood: 'smile', look: -1, arms: [[-46, -50], null] }, { x: 104, y: 180, s: 0.58 }) +
    g(pet({ kind: 'dog', mood: 'worried', look: 1, legs: [[18, -2], [34, 0]], extra: sweat(-40, -96) }), { x: 44, y: 178, s: 0.64, rot: -26 }) +
    ground(180, C.path) + path('M8 184h22M14 192h14', 'none', sw(3)) + circle(66, 172, 5, C.path, sw(3)) + circle(74, 166, 3.5, C.path, sw(3))
  ],
  eager: () => [
    // a dog jumps by the door with its leash in its mouth, tail wagging: it can't wait to go
    rect(132, 30, 56, 142, C.wood, 6) + circle(176, 104, 5, C.butter, sw(3)) +
    P({ kind: 'dog', mood: 'happy', look: 1, wag: true, legs: [[-16, 6], [14, 2]], arms: [[-54, -96], [54, -92]], extra: path('M54 -92q14 30 -2 52q-10 10 -14 -2q0 -10 12 -6', 'none', ` stroke="${C.berry}" stroke-width="6"`) }, { x: 76, y: 150, s: 0.8 }) +
    ground(176, C.path) + path('M50 182q26 6 52 0', 'none', sw(3)) + sparkle(24, 40, 10) + sparkle(116, 26, 8)
  ],

  /* ---------- Set 3 ---------- */
  cautious: () => [
    // a cat tiptoes across a log over the water, arms out, watching each step
    rect(0, 120, 200, 80, C.blue, 0, noStroke) + path('M16 150q12 -6 24 0M120 170q12 -6 24 0M150 140q12 -6 24 0', 'none', ` stroke="${C.white}" stroke-width="4"`) +
    rect(-10, 112, 220, 16, C.wood, 8) +
    P({ kind: 'cat', mood: 'worried', look: 0, legs: [[-14, 0], [12, -4]], arms: [[-46, -48], [46, -48]] }, { x: 100, y: 112, s: 0.72 })
  , C.sky],
  confident: () => [
    // a dog stands tall on a stage, chest out, paws on hips, big smile
    rect(20, 150, 160, 30, C.berry, 8) + path('M20 150h160', 'none') + star(36, 40, 12) + star(166, 50, 10) + sparkle(150, 22, 8) +
    P({ kind: 'dog', mood: 'happy', arms: [[-28, -24, [-40, -40]], [28, -24, [40, -40]]] }, { x: 100, y: 150, s: 0.95 })
  ],
  generous: () => [
    // a cat with two cookies hands one to a bunny, and a heart floats up
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [[-40, -50], [44, -52]] }, { x: 54, y: 184, s: 0.62 }) + cookie(84, 151, 11) + cookie(27, 152, 9) +
    P({ kind: 'bunny', mood: 'happy', look: -1, arms: [[-36, -48], null] }, { x: 146, y: 184, s: 0.62 }) + heart(100, 46, 1.6)
  ],
  honest: () => [
    // next to a big broken vase, a dog raises its paw and says "it was me"; the cat smiles
    path('M86 174q-12 -20 0 -32l6 8l7 -10l7 10l6 -8q12 12 0 32z', C.blue) + path('M84 158h40', 'none', ` stroke="${C.white}" stroke-width="4"`) +
    poly([[130, 172], [138, 156], [150, 160], [146, 174]], C.blue) + poly([[64, 174], [70, 160], [80, 166], [76, 176]], C.blue) +
    bubble(8, 10, 84, 52, 44, 92) + paw(30, 38, 0.95) + arrow(46, 36, 60, 36, C.ink, 4) + path('M66 52q-6 -12 2 -20l4 4l4 -6l4 6l4 -4q8 8 2 20z', C.blue, sw(3)) +
    P({ kind: 'dog', mood: 'shy', look: 1, arms: [[-52, -100], null] }, { x: 40, y: 182, s: 0.6 }) +
    P({ kind: 'cat', mood: 'happy', look: -1 }, { x: 164, y: 182, s: 0.6 }) + heart(164, 76, 1.2) + ground(182, C.path)
  ],
  persistent: () => [
    // a bunny pushes a big rock up a steep hill, sweating but still going
    path('M0 200V178L200 70V200z', C.grass2) +
    circle(132, 74, 26, C.gray) + path('M120 66l8 4M136 86l6 -4', 'none', sw(3)) +
    g(pet({ kind: 'bunny', mood: 'determined', look: 1, legs: [[-24, 4], [6, -4]], arms: [[38, -50], [36, -36]], extra: sweat(-30, -96) + sweat(-40, -80) }), { x: 82, y: 136, s: 0.62, rot: 28 }) +
    path('M184 34v40', 'none', sw(4)) + path('M184 34l-18 7l18 7z', C.berry, sw(3))
  , C.sky],
  timid: () => [
    // a shy bunny hides behind a tree and peeks out while a dog waves hello
    P({ kind: 'dog', mood: 'happy', look: 1, arms: [[-54, -98], null] }, { x: 56, y: 182, s: 0.66 }) +
    P({ kind: 'bunny', mood: 'shy', look: -1 }, { x: 154, y: 182, s: 0.66 }) +
    rect(156, 30, 40, 154, C.wood, 6) + circle(176, 30, 30, C.grass2) + ground(182) +
    g(ellipse(0, 0, 7, 9, C.white, sw(4)), { x: 154, y: 124 })
  ],
  grateful: () => [
    // a cat hugs a present to its chest with happy closed eyes and hearts around
    P({ kind: 'cat', mood: 'happy', arms: [[-14, -36], [14, -36]] }, { x: 100, y: 190, s: 0.85 }) +
    rect(78, 120, 44, 36, C.mint) + path('M100 120v36M78 138h44', 'none', ` stroke="${C.berry}" stroke-width="6"`) + path('M100 120q-14 -14 -14 0zM100 120q14 -14 14 0z', C.berry, sw(3.5)) +
    circle(80, 132, 6, C.orange, sw(4)) + circle(120, 132, 6, C.orange, sw(4)) +
    heart(34, 50, 1.2) + heart(168, 40, 1) + heart(160, 98, 0.8)
  ],

  /* ---------- Set 4 ---------- */
  accurate: () => [
    // an arrow right in the bullseye
    circle(108, 92, 66, C.white, sw(5)) + circle(108, 92, 48, C.berry) + circle(108, 92, 30, C.white) + circle(108, 92, 13, C.berry) +
    path('M108 92L184 160', 'none', sw(6)) + path('M176 150l14 4l-4 14M170 156l14 4l-4 14', 'none', ` stroke="${C.orange}" stroke-width="5"`) +
    sparkle(72, 34, 10) + sparkle(160, 28, 8) +
    P({ kind: 'cat', mood: 'happy', tail: false }, { x: 36, y: 196, s: 0.42 })
  ],
  approximate: () => [
    // an arrow that landed close to the middle, but clearly not in it (it's in the next ring out)
    circle(100, 92, 66, C.white, sw(5)) + circle(100, 92, 48, C.berry) + circle(100, 92, 30, C.white) + circle(100, 92, 13, C.berry) +
    path('M132 112L190 160', 'none', sw(6)) + path('M182 150l14 4l-4 14M176 156l14 4l-4 14', 'none', ` stroke="${C.orange}" stroke-width="5"`) +
    P({ kind: 'cat', mood: 'smile', tail: false }, { x: 36, y: 196, s: 0.42 })
  ],
  estimate: () => [
    // a dog looks at a big jar of gumballs and makes a careful guess: about 50?
    path('M30 76h64v90q0 12 -12 12h-40q-12 0 -12 -12z', '#E8F7FF') + rect(36, 64, 52, 14, C.wood, 4) +
    [[42, 166, C.berry], [58, 166, C.butter], [74, 166, C.mint], [84, 152, C.berry], [50, 152, C.mint], [66, 150, C.orange], [42, 136, C.butter], [58, 136, C.berry], [76, 136, C.blue], [48, 120, C.orange], [66, 120, C.mint], [82, 118, C.butter], [42, 102, C.berry], [58, 104, C.blue], [76, 100, C.berry]]
      .map(([x, y, c]) => circle(x, y, 7, c, sw(3))).join('') +
    thought(150, 44, 40, 28, 140, 104) + text(150, 56, '50?', 34, C.deep) +
    P({ kind: 'dog', mood: 'calm', look: -1 }, { x: 150, y: 192, s: 0.6 })
  ],
  equivalent: () => [
    // a balance: one half of a pizza on one side, two quarters on the other, perfectly level
    poly([[100, 70], [86, 170], [114, 170]], C.wood) + rect(66, 166, 68, 12, C.wood, 6) +
    line(14, 84, 186, 84, sw(7)) + circle(100, 84, 7, C.butter, sw(4)) +
    path('M24 84v28M76 84v28M124 84v28M176 84v28', 'none', sw(3)) + path('M12 112h76q0 22 -38 22t-38 -22z', C.gray) + path('M112 112h76q0 22 -38 22t-38 -22z', C.gray) +
    path('M20 110a30 30 0 0 1 60 0z', C.butter, sw(4)) + circle(36, 98, 4, C.berry, noStroke) + circle(54, 90, 4, C.berry, noStroke) + circle(64, 102, 4, C.berry, noStroke) +
    path('M120 110a28 28 0 0 1 28 -28v28z', C.butter, sw(4)) + path('M152 110a28 28 0 0 1 28 -28v28z', C.butter, sw(4)) + circle(134, 100, 4, C.berry, noStroke) + circle(166, 100, 4, C.berry, noStroke) +
    text(100, 50, '=', 46, C.green)
  ],
  interpret: () => [
    // a dog wags its tail hard; the cat figures out what the wag means: the dog is happy
    P({ kind: 'dog', mood: 'calm', look: 1, wag: true }, { x: 50, y: 186, s: 0.7 }) +
    path('M86 138q14 8 8 26M96 128q22 12 12 42', 'none', sw(4.5)) +
    path('M110 130Q120 104 124 80', 'none', ' stroke-dasharray="2 9" stroke-width="5"') +
    P({ kind: 'cat', mood: 'calm', look: -1 }, { x: 160, y: 186, s: 0.58 }) +
    thought(136, 44, 44, 34, 160, 104) + g(pet({ kind: 'dog', mood: 'happy', tail: false }), { x: 130, y: 72, s: 0.34 }) + heart(164, 34, 0.7) +
    ground(186, C.path)
  ],
  conclusion: () => [
    // three big clues (a chewed shoe, muddy paw prints, an empty bowl tipped over) all point to one answer: the puppy did it
    rect(6, 8, 64, 56, C.white, 10) + path('M14 52q0 -24 16 -24l12 8l16 4q8 2 8 12z', C.berry, sw(4)) + path('M14 52h52', 'none', sw(4)) + path('M48 32l3 6l3 -5l3 6', 'none', sw(3)) +
    rect(6, 72, 64, 56, C.white, 10) + paw(22, 112, 0.7, C.wood) + paw(38, 96, 0.7, C.wood) + paw(56, 112, 0.7, C.wood) +
    rect(6, 136, 64, 56, C.white, 10) + g(path('M-18 -10h36q-2 20 -18 20t-18 -20z', C.blue, sw(4)) + ellipse(0, -10, 18, 4, C.white, sw(3.5)), { x: 38, y: 166, rot: -80 }) +
    arrow(76, 40, 108, 84) + arrow(76, 100, 108, 100) + arrow(76, 160, 108, 116) +
    circle(152, 100, 40, C.butter) + g(pet({ kind: 'dog', mood: 'happy', tail: false }), { x: 152, y: 136, s: 0.46 }) + check(180, 148, 1.1)
  ],
  survey: () => [
    // a cat with a clipboard asks three friends the same question and marks each answer
    rect(14, 60, 46, 60, C.white, 6) + rect(26, 54, 22, 10, C.gray, 3, sw(3)) + check(30, 80, 0.5) + check(30, 96, 0.5) + cross(30, 110, 0.4) + path('M40 80h12M40 96h12M40 110h12', 'none', sw(3)) +
    P({ kind: 'cat', mood: 'smile', look: 1, arms: [[-34, -54], null] }, { x: 48, y: 192, s: 0.55 }) +
    P({ kind: 'dog', mood: 'happy' }, { x: 104, y: 192, s: 0.4 }) + P({ kind: 'bunny', mood: 'happy' }, { x: 142, y: 192, s: 0.4 }) + P({ kind: 'cat', color: C.gray, mood: 'calm' }, { x: 180, y: 192, s: 0.4 }) +
    bubble(86, 70, 36, 30, 102, 118) + check(104, 86, 0.7) + bubble(124, 50, 36, 30, 140, 104) + check(142, 66, 0.7) + bubble(162, 70, 34, 30, 178, 118) + cross(179, 85, 0.6)
  ],

  /* ---------- Set 5 ---------- */
  adapt: () => [
    // the same cat moves from a sunny place to a snowy one and puts on a hat and scarf to fit in
    rect(0, 0, 100, 200, '#FFF4CC', 0, noStroke) + rect(100, 0, 100, 200, '#EAF6FB', 0, noStroke) + line(100, 6, 100, 194) + sun(30, 34, 12) +
    [120, 150, 180, 136, 168].map((x, i) => circle(x, 26 + i * 16 % 50, 4, C.white, sw(3))).join('') +
    P({ kind: 'cat', mood: 'smile' }, { x: 52, y: 184, s: 0.6 }) + arrow(82, 104, 118, 104) +
    P({ kind: 'cat', mood: 'happy', top: path('M-32 -94q32 -40 64 0z', C.berry) + circle(0, -122, 8, C.white) + rect(-34, -98, 68, 10, C.white, 5), extra: rect(-24, -48, 48, 12, C.mint, 6) + rect(10, -46, 10, 26, C.mint, 4) }, { x: 150, y: 184, s: 0.6 })
  ],

  /* ---------- Set 6 ---------- */
  century: () => [
    // a birthday cake with 100 on it: a hundred years
    rect(30, 100, 140, 70, C.pink, 12) + path('M30 118q17 14 35 0q17 14 35 0q17 14 35 0q17 14 35 0', C.white, sw(4)) + ellipse(100, 172, 84, 10, C.white) + rect(30, 100, 140, 70, 'none', 12) +
    [56, 80, 100, 120, 144].map(x => rect(x - 4, 74, 8, 26, C.blue, 3, sw(3)) + path(`M${x} 74q-7 -10 0 -18q7 8 0 18z`, C.orange, sw(3))).join('') +
    text(100, 158, '100', 40, C.deep) + sparkle(24, 40, 10) + sparkle(176, 50, 9)
  ],
  source: () => [
    // ideas (a page, a star, a light bulb) flow out of an open book and into the cat's thoughts: the book is where they came from
    path('M14 162q30 -14 54 0v-62q-24 -14 -54 0z', C.white) + path('M68 162q24 -14 54 0v-62q-30 -14 -54 0z', C.white) + path('M24 116h34M24 130h34M24 144h34M78 116h34M78 130h34', 'none', sw(3)) +
    path('M68 96Q74 40 128 40', 'none', ` stroke="${C.berry}" stroke-width="4" stroke-dasharray="3 9"`) +
    rect(62, 64, 16, 20, C.white, 3, sw(3.5)) + star(84, 44, 9) + bulb(110, 34, 0.9) +
    thought(160, 46, 34, 28, 168, 104) + star(150, 46, 9) + bulb(172, 44, 0.85) +
    rect(0, 162, 200, 38, C.path, 0, noStroke) + line(4, 162, 196, 162) +
    P({ kind: 'cat', mood: 'wow', look: -1, tail: false }, { x: 170, y: 180, s: 0.46 })
  ],
  conflict: () => [
    // a cat and a dog pull on the same toy and growl at each other
    path('M70 136h60', 'none', ` stroke="${C.berry}" stroke-width="10"`) + circle(100, 136, 9, C.butter, sw(4)) +
    P({ kind: 'cat', mood: 'angry', look: 1, arms: [[30, -44], [52, -56]], legs: [[-20, 0], [4, 0]] }, { x: 40, y: 178, s: 0.72, rot: -8 }) +
    P({ kind: 'dog', mood: 'angry', look: -1, arms: [[-52, -56], [-30, -44]], legs: [[-4, 0], [20, 0]] }, { x: 162, y: 178, s: 0.72, rot: 8 }) +
    [[70, 40], [130, 40]].map(([x, y]) => path(`M${x - 10} ${y - 4}q6 0 6 -6M${x + 10} ${y - 4}q-6 0 -6 -6M${x - 10} ${y + 4}q6 0 6 6M${x + 10} ${y + 4}q-6 0 -6 6`, 'none', ` stroke="${C.berry}" stroke-width="4.5"`)).join('') +
    ground(180, C.path)
  ],

  /* ---------- Set 7 ---------- */
  consequence: () => [
    // first a dog splashes in mud, then (because of that) the dog has to have a bath
    rect(8, 12, 88, 176, C.cream, 14) + rect(104, 12, 88, 176, C.sky, 14) +
    ellipse(52, 162, 40, 10, C.wood) + P({ kind: 'dog', mood: 'happy', legs: [[-18, -6], [18, -6]], extra: circle(-14, -30, 5, C.woodDark, noStroke) + circle(10, -60, 5, C.woodDark, noStroke) + circle(-8, -96, 4, C.woodDark, noStroke) }, { x: 52, y: 150, s: 0.55 }) +
    circle(18, 120, 4, C.wood) + circle(86, 110, 4, C.wood) +
    arrow(88, 100, 116, 100, C.berry, 7) +
    P({ kind: 'dog', mood: 'sad', tail: false }, { x: 150, y: 168, s: 0.55 }) + rect(110, 132, 80, 44, C.white, 14) + path('M114 136q8 -14 18 -2q8 -14 20 -2q8 -14 20 0q8 -10 14 2', C.white, sw(4)) + circle(176, 60, 6, '#E8F7FF', sw(3))
  ],
  cooperate: () => [
    // a cat and a dog carry one big heavy box together
    rect(62, 98, 76, 60, C.wood) + path('M62 116h76', 'none', ` stroke="${C.woodDark}" stroke-width="4"`) +
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [[34, -52], [36, -78]] }, { x: 34, y: 186, s: 0.66 }) +
    P({ kind: 'dog', mood: 'happy', look: -1, arms: [[-36, -78], [-34, -52]] }, { x: 166, y: 186, s: 0.66 }) +
    heart(100, 40, 1) + ground(186, C.path)
  ],
  influence: () => [
    // one cat puts on sunglasses, and both its friends copy it and put theirs on too
    P({ kind: 'cat', mood: 'happy', top: SHADES }, { x: 54, y: 186, s: 0.7 }) +
    star(54, 30, 12) +
    curveArrow('M88 70q20 -24 42 -6', [130, 64], 40) + curveArrow('M96 112q24 -2 40 14', [136, 126], 40) +
    P({ kind: 'bunny', mood: 'smile', top: SHADES }, { x: 160, y: 104, s: 0.46 }) +
    P({ kind: 'dog', mood: 'smile', top: SHADES }, { x: 162, y: 194, s: 0.46 })
  ],
  opinion: () => [
    // the same plate of broccoli: the cat thinks it is yummy (heart), the dog thinks it is yucky (X)
    ellipse(100, 168, 36, 9, C.white) +
    path('M94 166l3 -22h8l3 22z', '#B9E3A0', sw(4)) +
    circle(88, 140, 10, C.green) + circle(112, 140, 10, C.green) + circle(94, 128, 11, C.green) + circle(108, 128, 11, C.green) + circle(101, 120, 10, C.green) +
    thought(40, 46, 34, 26, 46, 98) + g(path('M-2 12l1 -8h4l1 8z', '#B9E3A0', sw(2.5)) + circle(-4, 0, 6, C.green, sw(2.5)) + circle(4, 0, 6, C.green, sw(2.5)) + circle(0, -6, 6, C.green, sw(2.5)), { x: 26, y: 46 }) + heart(54, 50, 1) +
    thought(160, 46, 34, 26, 154, 98) + g(path('M-2 12l1 -8h4l1 8z', '#B9E3A0', sw(2.5)) + circle(-4, 0, 6, C.green, sw(2.5)) + circle(4, 0, 6, C.green, sw(2.5)) + circle(0, -6, 6, C.green, sw(2.5)), { x: 146, y: 46 }) + cross(174, 46, 0.8) +
    P({ kind: 'cat', mood: 'happy', look: 1 }, { x: 40, y: 190, s: 0.6 }) + P({ kind: 'dog', mood: 'angry', look: -1 }, { x: 160, y: 190, s: 0.6 })
  ],
  reveal: () => [
    // a cat lifts the lid off a box and shows the surprise hidden inside: a bunny pops out
    P({ kind: 'bunny', mood: 'happy', arms: [[-48, -80], [48, -80]] }, { x: 126, y: 132, s: 0.6 }) +
    rect(88, 118, 76, 60, C.berry) + path('M126 118v60', 'none', ` stroke="${C.butter}" stroke-width="10"`) +
    g(rect(-42, -8, 84, 18, C.berry, 5) + path('M0 -8v18', 'none', ` stroke="${C.butter}" stroke-width="10"`), { x: 86, y: 52, rot: -28 }) +
    P({ kind: 'cat', mood: 'wow', look: 1, arms: [null, [50, -150]] }, { x: 40, y: 188, s: 0.6 }) +
    sparkle(176, 60, 10) + sparkle(100, 92, 7) + sparkle(182, 120, 7) + ground(188, C.path)
  ],

  /* ---------- Set 8 ---------- */
  astonished: () => [
    // a dog's eyes go huge and its mouth falls open when it sees a giant bone
    path('M102 60h74', 'none', ' stroke-width="34"') + path('M102 60h74', 'none', ` stroke="${C.white}" stroke-width="24"`) + circle(100, 48, 15) + circle(100, 72, 15) + circle(178, 48, 15) + circle(178, 72, 15) + path('M106 60h66', 'none', ` stroke="${C.white}" stroke-width="24"`) +
    text(28, 66, '!', 44, C.berry) +
    P({ kind: 'dog', mood: 'wow', look: 1, arms: [[-30, -56], [30, -56]] }, { x: 80, y: 192, s: 0.85 })
  ],
  distinct: () => [
    // a row of gray cats, and one bright orange cat that stands out
    `<defs><g id="c">${pet({ kind: 'cat', color: C.gray, mood: 'calm', tail: false })}</g></defs>` +
    [[36, 92], [100, 92], [164, 92], [36, 182], [164, 182]].map(([x, y]) => `<use href="#c" transform="translate(${x} ${y}) scale(.46)"/>`).join('') +
    circle(100, 150, 38, C.butter, sw(4)) + P({ kind: 'cat', mood: 'happy', tail: false }, { x: 100, y: 182, s: 0.46 })
  ],
  eventually: () => [
    // a snail crawls a long, long path and finally reaches the flag
    path('M14 60h150q22 0 22 22t-22 22H36q-22 0 -22 22t22 22h140', 'none', ` stroke="${C.path}" stroke-width="22"`) +
    path('M14 60h150q22 0 22 22t-22 22H36q-22 0 -22 22t22 22h120', 'none', ' stroke-dasharray="2 12"') +
    path('M182 170v-64', 'none', sw(5)) + path('M182 106l-24 10l24 10z', C.berry, sw(4)) +
    g(ellipse(0, 0, 22, 8, C.butter) + circle(4, -12, 13, C.orange) + path('M4 -12a6 6 0 1 0 6 6', 'none', sw(3)) + path('M-16 -2l-6 -14M-20 -4l-12 -10', 'none', sw(3)) + circle(-24, -6, 2, C.ink, noStroke), { x: 144, y: 148, s: 1.4, flip: true }) +
    sparkle(130, 30, 8) + sparkle(30, 30, 8)
  , C.grass],
  hesitate: () => [
    // a bunny stops at the end of a diving board, one foot out, not sure about jumping
    rect(0, 150, 200, 50, C.blue, 0, noStroke) + path('M130 168q10 -6 20 0q10 -6 20 0', 'none', ` stroke="${C.white}" stroke-width="4"`) +
    rect(-10, 112, 132, 14, C.white, 6) + rect(20, 126, 16, 70, C.gray, 2) +
    P({ kind: 'bunny', mood: 'worried', look: 1, legs: [[-10, 0], [24, -10]], arms: [[-34, -40], [34, -38]], extra: sweat(30, -112) }, { x: 90, y: 112, s: 0.66 }) +
    text(156, 64, '?', 40, C.berry)
  , C.sky],

  /* ---------- Set 9 ---------- */
  accomplish: () => [
    // a dog reaches the top of a mountain and plants its flag: done!
    path('M0 200L100 92L200 200z', C.grass2) + path('M80 114l20 -22l20 22l-10 -4l-10 8l-10 -8z', C.white, sw(4)) +
    path('M138 20v56', 'none', sw(4)) + path('M138 20l30 10l-30 10z', C.berry, sw(3.5)) +
    P({ kind: 'dog', mood: 'happy', arms: [[-54, -100], [52, -66]] }, { x: 100, y: 96, s: 0.6 }) +
    sparkle(30, 40, 10) + sparkle(176, 76, 8) + star(56, 74, 8)
  , C.sky],
  improve: () => [
    // three drawings of a sun by the same bunny, each one better than the last
    rect(8, 40, 54, 54, C.white, 6) + path('M24 70q4 -18 14 -12q12 6 0 18q-10 8 -14 -6z', 'none', ` stroke="${C.orange}" stroke-width="4"`) +
    rect(72, 40, 54, 54, C.white, 6) + circle(99, 67, 12, C.butter, ` stroke="${C.orange}" stroke-width="4"`) + path('M99 47v4M117 67h-4M85 67h-4', 'none', ` stroke="${C.orange}" stroke-width="4"`) +
    rect(136, 40, 54, 54, C.white, 6) + sun(163, 67, 10) +
    star(163, 26, 11) + path('M22 120Q100 130 176 108', 'none', sw(5)) + path('M166 102l12 6l-8 12', 'none', sw(5)) +
    P({ kind: 'bunny', mood: 'happy', look: 1, arms: [null, [34, -56]] }, { x: 70, y: 196, s: 0.42 })
  ],

  /* ---------- Set 10 ---------- */
  compromise: () => [
    // a cat and a dog both wanted the whole pizza; they each give a little and share it half and half
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [null, [40, -60]] }, { x: 40, y: 186, s: 0.66 }) +
    P({ kind: 'dog', mood: 'happy', look: -1, arms: [[-40, -60], null] }, { x: 160, y: 186, s: 0.66 }) +
    path('M94 74a30 30 0 0 0 0 60z', C.butter, sw(4)) + path('M106 74a30 30 0 0 1 0 60z', C.butter, sw(4)) +
    circle(84, 92, 4, C.berry, noStroke) + circle(84, 114, 4, C.berry, noStroke) + circle(116, 98, 4, C.berry, noStroke) + circle(116, 118, 4, C.berry, noStroke) +
    heart(100, 40, 1) + ground(186, C.path)
  ],
  perspective: () => [
    // a number lies flat on the floor between a cat and a dog: from the cat's side it is a 6, from the dog's side it is a 9
    ellipse(100, 158, 58, 24, C.white) + `<g transform="translate(100 158) scale(1 .5) rotate(90)">${text(0, 24, '6', 76, C.deep)}</g>` +
    path('M48 124L72 148M152 124L128 148', 'none', ' stroke-dasharray="2 8" stroke-width="4"') +
    P({ kind: 'cat', mood: 'calm', look: 1 }, { x: 34, y: 182, s: 0.52 }) +
    P({ kind: 'dog', mood: 'calm', look: -1 }, { x: 166, y: 182, s: 0.52 }) +
    bubble(10, 16, 60, 56, 30, 100) + text(40, 60, '6', 42) + bubble(130, 16, 60, 56, 170, 100) + text(160, 60, '9', 42)
  ],
  relevant: () => [
    // packing for the beach (picture at the top): sunglasses and a sand pail belong, a winter hat does not
    rect(30, 8, 140, 70, C.sky, 12) + path('M32 60q34 -10 68 0t68 0v6q0 10 -10 10H42q-10 0 -10 -10z', '#F3D9A0', sw(4)) + sun(58, 32, 9) +
    path('M130 62V30', 'none', sw(4)) + path('M106 32q24 -26 48 0z', C.berry, sw(4)) + path('M118 32q12 -20 12 0', 'none', sw(3)) +
    g(path('M-28 0h22q0 16 -11 16t-11 -16zM6 0h22q0 16 -11 16t-11 -16zM-6 2h12', C.ink, sw(3)), { x: 38, y: 110 }) + check(38, 160) +
    path('M84 102h32l-5 36h-22z', C.mint) + path('M86 102q14 -20 28 0', 'none', sw(4)) + path('M120 136l8 -38', 'none', ` stroke="${C.wood}" stroke-width="5"`) + path('M124 98l4 -14l6 2l-2 14z', C.butter, sw(3)) + check(100, 160) +
    path('M140 134q0 -34 22 -34t22 34z', C.blue) + rect(138, 126, 48, 12, C.white, 5, sw(4)) + circle(162, 96, 7, C.white, sw(4)) + path('M150 112h24', 'none', ` stroke="${C.white}" stroke-width="4"`) + cross(162, 160)
  ],
  sequence: () => [
    // first an egg, then it cracks, then a chick: things in order
    ellipse(34, 108, 20, 26, C.white) + text(34, 168, '1', 30) +
    ellipse(100, 108, 20, 26, C.white) + path('M80 102l8 6l6 -8l6 8l6 -8l6 8l8 -6', 'none', sw(4)) + text(100, 168, '2', 30) +
    ellipse(166, 114, 20, 20, C.butter) + circle(166, 92, 14, C.butter) + circle(162, 88, 2.5, C.ink, noStroke) + circle(172, 88, 2.5, C.ink, noStroke) + poly([[164, 94], [172, 94], [168, 100]], C.orange, sw(3)) + text(166, 168, '3', 30) +
    arrow(58, 108, 76, 108) + arrow(124, 108, 142, 108)
  ],
  thorough: () => [
    // a bunny checks every box on the cleaning list and even sweeps under the bed
    rect(110, 18, 76, 96, C.white, 8) + [38, 62, 86].map(y => rect(118, y - 8, 16, 16, C.white, 3, sw(3.5)) + check(126, y - 2, 0.6) + path(`M140 ${y}h36`, 'none', sw(3.5))).join('') +
    rect(10, 136, 90, 24, C.berry, 6) + path('M14 160v20M96 160v20', 'none', sw(5)) + rect(10, 124, 24, 14, C.white, 6) +
    P({ kind: 'bunny', mood: 'determined', look: -1, arms: [[-30, -24], [-24, -44]] }, { x: 150, y: 192, s: 0.6 }) +
    path('M128 150L98 182', 'none', ` stroke="${C.wood}" stroke-width="6"`) + path('M98 182l-14 8l10 -16z', C.butter, sw(4)) +
    sparkle(60, 186, 7) + sparkle(36, 108, 7) + sparkle(88, 104, 6)
  ],

  /* ---------- spelling-pattern words ---------- */
  persuade: () => [
    // a cat gives three good ideas (light bulbs), and the dog changes its mind from no to yes
    bubble(6, 12, 96, 46, 48, 112) + bulb(26, 32, 1) + bulb(54, 32, 1) + bulb(82, 32, 1) +
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [[-50, -92], null] }, { x: 50, y: 192, s: 0.56 }) +
    thought(150, 46, 44, 28, 150, 100) +
    circle(124, 46, 17, '#F8C9D4', sw(3.5)) + cross(124, 46, 0.75) + arrow(144, 46, 158, 46, C.ink, 4) + circle(176, 46, 17, '#CFF0E2', sw(3.5)) + check(176, 46, 0.75) +
    P({ kind: 'dog', mood: 'happy', look: -1 }, { x: 150, y: 192, s: 0.56 })
  ],
  decision: () => [
    // a cat stands where the path splits in two and picks one way
    path('M100 200V130L40 70M100 130L160 70', 'none', ` stroke="${C.path}" stroke-width="34"`) +
    path('M40 70V30M160 70V30', 'none', sw(4)) + rect(14, 14, 52, 32, C.white, 6) + rect(134, 14, 52, 32, C.white, 6) +
    g(path('M-14 0q14 -12 24 0q-10 12 -24 0zM10 0l8 -7v14z', C.blue, sw(3)), { x: 38, y: 30 }) + ball(160, 30, 10, C.berry) +
    P({ kind: 'cat', mood: 'happy', look: -1, arms: [[-50, -72], null] }, { x: 108, y: 196, s: 0.52 }) + check(60, 66, 0.9)
  , C.grass]
};
