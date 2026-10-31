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

/* Scenes for words a grown-up or teacher ADDED (docs/WORD-CARTOONS.md). draw.mjs writes them to
   public/vocab-pics/cartoons/class/<word>.svg; list each one in CLASS_CARTOONS in src/shared/wordPictures.js too.
   Key: the word in lower case. Same rules as above: pets act out the meaning, one idea, no words in the picture. */
/* ---------- small helpers shared by several added-word scenes ---------- */
const R = v => Math.round(v * 10) / 10;
const GL = '#E8F7FF';
/* an ear of grain on a stalk (barley) */
const stalkEar = (x, y, h = 70, rot = 0) => g(
  path(`M0 0V${-h}`, 'none', ` stroke="${C.green}" stroke-width="5"`) +
  [0, 1, 2, 3].map(i => ellipse(-5, -h - i * 10 + 4, 5, 8, C.butter, sw(3.5)) + ellipse(5, -h - i * 10 - 1, 5, 8, C.butter, sw(3.5))).join('') +
  path(`M-8 ${-h - 38}l-6 -22M0 ${-h - 44}v-22M8 ${-h - 40}l6 -22`, 'none', sw(3)), { x, y, rot });
/* a burr: a round brown seed with little hooked spikes */
const burr = (x, y, r = 14) => path(Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `M${R(x + (r - 2) * Math.cos(a))} ${R(y + (r - 2) * Math.sin(a))}L${R(x + (r + 7) * Math.cos(a))} ${R(y + (r + 7) * Math.sin(a))}`; }).join(''), 'none', sw(3.5)) + circle(x, y, r, C.woodDark) + circle(x - r * 0.3, y - r * 0.3, r * 0.22, C.wood, noStroke);
/* a fat fuzzy bumble bee, facing left, centred on (0,0) before g() moves it */
const bee = (x, y, s = 1) => g(
  ellipse(-6, -34, 15, 24, GL, ' transform="rotate(-20 -6 -34)"') + ellipse(16, -34, 15, 24, GL, ' transform="rotate(22 16 -34)"') +
  `<clipPath id="bbc"><ellipse cx="0" cy="0" rx="42" ry="32"/></clipPath>` +
  ellipse(0, 0, 42, 32, C.butter) +
  `<g clip-path="url(#bbc)">` + rect(-14, -40, 15, 80, C.dark, 0, noStroke) + rect(14, -40, 15, 80, C.dark, 0, noStroke) + `</g>` +
  ellipse(0, 0, 42, 32, 'none') +
  poly([[40, -5], [56, 0], [40, 5]], C.dark, sw(3.5)) +
  path('M-18 30l-4 12M0 32v12M18 30l4 12', 'none', sw(4)) +
  circle(-40, -2, 20, C.dark) + circle(-46, -6, 3.2, C.white, noStroke) + circle(-36, -6, 3.2, C.white, noStroke) + path('M-48 4q6 6 12 0', 'none', ` stroke="${C.white}" stroke-width="3"`) +
  path('M-48 -20q-6 -14 -16 -14M-34 -21q0 -14 8 -18', 'none', sw(3.5)) + circle(-64, -34, 3.5, C.ink, noStroke) + circle(-26, -39, 3.5, C.ink, noStroke), { x, y, s });
/* a flower: petals round a butter centre, stem and leaf */
const flower = (x, y, r = 14, petal = C.pink) => path(`M${x} ${y}V${y + 62}`, 'none', ` stroke="${C.green}" stroke-width="6"`) +
  Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return circle(x + r * 1.15 * Math.cos(a), y + r * 1.15 * Math.sin(a), r * 0.72, petal, sw(3.5)); }).join('') + circle(x, y, r * 0.8, C.butter, sw(3.5));
/* a germ: a spiky green blob with an angry little face */
const germ = (x, y, r = 12) => path(Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `M${R(x + (r - 2) * Math.cos(a))} ${R(y + (r - 2) * Math.sin(a))}L${R(x + (r + 6) * Math.cos(a))} ${R(y + (r + 6) * Math.sin(a))}`; }).join(''), 'none', sw(3.5)) + circle(x, y, r, C.grass2) +
  circle(x - r * 0.38, y - r * 0.1, 1.9, C.ink, noStroke) + circle(x + r * 0.38, y - r * 0.1, 1.9, C.ink, noStroke) + path(`M${R(x - r * 0.6)} ${R(y - r * 0.4)}l${R(r * 0.4)} ${R(r * 0.18)}M${R(x + r * 0.6)} ${R(y - r * 0.4)}l${R(-r * 0.4)} ${R(r * 0.18)}M${R(x - r * 0.3)} ${R(y + r * 0.45)}q${R(r * 0.3)} ${R(-r * 0.3)} ${R(r * 0.6)} 0`, 'none', sw(2.2));
/* a leg for the leg-part words: a dog's hind leg (rump, thigh, knee, shin, hock, paw) with its bones showing; segment 0..6 is lit
   up in red with a yellow halo (coxa, trochanter, femur, patella, tibia, tarsus, metatarsus) */
const seg = (x1, y1, x2, y2, w, fill, extra = '') => path(`M${x1} ${y1}L${x2} ${y2}`, 'none', ` stroke-width="${w + 7}"${extra}`) + path(`M${x1} ${y1}L${x2} ${y2}`, 'none', ` stroke="${fill}" stroke-width="${w}"${extra}`);
const legParts = (hi) => {
  const f = i => i === hi ? C.berry : C.white;
  const shapes = [
    (c, h = 0) => circle(58, 38, 13 + h, c, h ? ` stroke="${c}" stroke-width="2"` : ''),                          // coxa: the hip ball
    (c, h = 0) => seg(70, 52, 78, 60, 11 + h, c),                                                                // trochanter: the small bump under it
    (c, h = 0) => seg(82, 64, 108, 94, 17 + h, c),                                                               // femur: the long thigh bone
    (c, h = 0) => circle(118, 99, 9 + h, c, h ? ` stroke="${c}" stroke-width="2"` : ''),                          // patella: the kneecap, at the front of the knee
    (c, h = 0) => seg(106, 110, 86, 148, 14 + h, c),                                                             // tibia: the shin bone
    (c, h = 0) => seg(76, 154, 82, 162, 11 + h, c) + seg(86, 152, 90, 160, 11 + h, c),                           // tarsus: the small ankle (hock) bones
    (c, h = 0) => seg(82, 168, 88, 186, 9 + h, c) + seg(94, 166, 100, 184, 9 + h, c)                              // metatarsus: the long foot bones
  ];
  const at = [[58, 38, 'L'], [74, 56, 'L'], [95, 79, 'L'], [118, 99, 'R'], [96, 129, 'L'], [83, 157, 'L'], [91, 176, 'L']][hi];
  const lit = hi >= 0 ? shapes[hi](C.butter, 12) + shapes[hi](C.berry) : '';
  const body = circle(44, 30, 38, '#FFE3C4') + path('M62 38L110 98L84 156L96 188', 'none', ' stroke-width="52"') + path('M62 38L110 98L84 156L96 188', 'none', ' stroke="#FFE3C4" stroke-width="42"') +
    ellipse(106, 190, 26, 10, '#FFE3C4') + path('M96 192v-8M108 194v-8M120 192v-8', 'none', sw(3.5));
  const bones = shapes.map((sh, k) => k === hi ? '' : sh(C.white)).join('');
  const arrowEl = at[2] === 'L' ? arrow(4, at[1], at[0] + 14 - 4 > 40 ? at[0] - 24 + 24 : 40, at[1], C.deep, 7) : arrow(196, at[1], at[0] + 40, at[1], C.deep, 7);
  return g(body + bones + lit, { x: 20, y: 2 }) + (at[2] === 'L' ? arrow(4, at[1] + 2, Math.max(at[0] + 20 - 26, 30), at[1] + 2, C.deep, 7) : arrow(196, at[1] + 2, at[0] + 20 + 30, at[1] + 2, C.deep, 7)) +
    P({ kind: 'cat', mood: 'wow', look: -1, tail: false, arms: [[-34, -64], null] }, { x: 172, y: 196, s: 0.46 });
};

export const CLASS_SCENES = {
  barley: () => [
    // a field of golden barley with full ears of grain; a bunny holds one ear and nibbles it
    [[24, 172, 62, -4], [54, 174, 80, 3], [84, 172, 58, -3], [112, 174, 74, 4]].map(([x, y, h, r]) => stalkEar(x, y, h, r)).join('') +
    stalkEar(133, 160, 30, 8) + ground(172) +
    P({ kind: 'bunny', mood: 'happy', look: -1, arms: [[-34, -52], null] }, { x: 156, y: 190, s: 0.62 }),
    C.sky
  ],
  barely: () => [
    // a tall glass with only a thin splash of water left at the bottom; the cat peers in: hardly any
    ground(190, C.path) + rect(54, 176, 100, 10, C.wood, 5) +
    path('M70 36h60l-8 130q0 10 -10 10h-24q-10 0 -10 -10z', GL) + path('M77 154h46l-1.5 14q0 8 -8 8h-27q-8 0 -8 -8z', C.blue) +
    path('M100 118q-6 8 0 10q6 -2 0 -10z', C.blue, sw(3)) +
    P({ kind: 'cat', mood: 'sad', look: 1, arms: [null, [38, -84]] }, { x: 34, y: 196, s: 0.82 })
  ],
  interact: () => [
    // a cat tosses a ball and the dog tosses it back: each one responds to the other
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [null, [46, -76]] }, { x: 36, y: 192, s: 0.66 }) +
    P({ kind: 'dog', mood: 'happy', look: -1, arms: [[-46, -76], null] }, { x: 164, y: 192, s: 0.66 }) +
    curveArrow('M76 118Q100 52 124 114', [124, 114], 70) + curveArrow('M124 150Q100 184 76 152', [76, 152], 235) +
    ball(100, 84, 11)
  ],
  distribution: () => [
    // a cat hands out carrots from a basket: each of three friends in the row gets one
    `<defs><g id="dr">${pet({ kind: 'bunny', mood: 'happy', look: -1, tail: false, arms: [[-30, -50], null] })}</g></defs>` +
    P({ kind: 'cat', mood: 'happy', look: 1, tail: false, arms: [null, [46, -56]] }, { x: 70, y: 192, s: 0.74 }) +
    path('M6 158h46l-5 30h-36z', C.wood) + carrot(20, 150, 0.8, -10) + carrot(38, 150, 0.8, 10) +
    [112, 148, 184].map(x => `<use href="#dr" transform="translate(${x} 194) scale(.44)"/>` + carrot(x - 14, 166, 0.6, 15)).join('') +
    path('M108 130Q140 86 176 118', 'none', ' stroke-dasharray="2 9" stroke-width="5"')
  ],
  production: () => [
    // a machine with a smoking chimney makes cookies; they ride out on a belt while a bunny watches
    rect(10, 56, 74, 80, C.gray) + rect(52, 26, 16, 32, C.dark, 4) + circle(58, 14, 7, C.white) + circle(72, 6, 5.5, C.white) +
    circle(34, 88, 14, GL) + path('M34 80v8l6 4', 'none', sw(3)) + circle(58, 116, 6, C.berry, sw(3.5)) + rect(70, 108, 16, 26, C.dark, 3) +
    rect(80, 122, 114, 14, C.dark, 7) + [96, 124, 152, 180].map(x => circle(x, 146, 6, C.gray, sw(3.5))).join('') +
    cookie(108, 111, 10) + cookie(140, 111, 10) + cookie(172, 111, 10) + sparkle(120, 84, 8) +
    P({ kind: 'bunny', mood: 'wow', look: -1, arms: [[-30, -52], null] }, { x: 150, y: 200, s: 0.5 })
  ],
  participle: () => [
    // a verb in two forms: first the dog is eating from a heaped bowl, then the action is done (empty bowl, round full tummy)
    rect(8, 16, 88, 168, C.cream, 14) + rect(104, 16, 88, 168, GL, 14) +
    P({ kind: 'dog', mood: 'happy', look: 0, tail: false }, { x: 52, y: 148, s: 0.58 }) + path('M24 154h56q0 18 -28 18t-28 -18z', C.berry) + path('M32 154q20 -34 40 0z', C.wood, sw(3.5)) + circle(44, 140, 3.5, C.butter, noStroke) + circle(58, 138, 3.5, C.butter, noStroke) +
    arrow(88, 100, 112, 100) +
    P({ kind: 'dog', mood: 'smile', look: 0, tail: false, arms: [[-8, -32], null], extra: ellipse(0, -26, 28, 26, C.cream, ' fill-opacity=".9"') }, { x: 148, y: 148, s: 0.58 }) + path('M120 156h56q0 18 -28 18t-28 -18z', C.berry) + ellipse(148, 154, 24, 4, C.white, noStroke) + sparkle(172, 56, 9) + sparkle(124, 44, 7)
  ],
  regular: () => [
    // a tidy grid of identical, ordinary cats: nobody stands out, everything is normal
    `<defs><g id="rc">${pet({ kind: 'cat', mood: 'calm', tail: false })}</g></defs>` +
    [34, 78, 122, 166].map(x => [98, 186].map(y => `<use href="#rc" transform="translate(${x} ${y}) scale(.46)"/>`).join('')).join('')
  ],
  'bumble bee': () => [
    // a big round fuzzy striped bee hovers over a flower while a small bunny watches
    flower(54, 132, 14) + path('M30 168q-14 -10 -6 -24q14 4 18 20z', C.grass2, sw(3.5)) +
    path('M92 124Q70 140 64 126', 'none', ' stroke-dasharray="2 8" stroke-width="4"') +
    bee(122, 78, 0.95) +
    P({ kind: 'bunny', mood: 'wow', look: -1 }, { x: 158, y: 198, s: 0.56 }) + ground(198, C.grass),
    C.sky
  ],
  notable: () => [
    // a gray statue of a dog on a pedestal, a gold star over it: a hero people still remember
    rect(60, 140, 80, 44, C.gray, 6) + rect(74, 154, 52, 18, C.butter, 4, sw(3)) + star(100, 163, 6, C.white) +
    P({ kind: 'dog', color: C.gray, mood: 'happy', look: 0, arms: [[-30, -56], [30, -56]] }, { x: 100, y: 142, s: 0.72 }) +
    star(100, 18, 13) + sparkle(54, 40, 8) + sparkle(150, 48, 8) +
    P({ kind: 'bunny', mood: 'wow', look: 1 }, { x: 28, y: 196, s: 0.5 }) + P({ kind: 'cat', mood: 'wow', look: -1 }, { x: 172, y: 196, s: 0.5 }) + ground(190, C.path)
  ],
  burr: () => [
    // a round spiky burr seed has hooked onto a worried white dog's fur; more small burrs still hang on a weed beside it
    ground(192, C.grass) +
    path('M170 192V110M170 150q-16 -4 -20 -20M170 134q16 -4 20 -18', 'none', ` stroke="${C.green}" stroke-width="6"`) + burr(170, 100, 8) + burr(150, 126, 6) + burr(190, 112, 6) +
    P({ kind: 'dog', color: C.white, mood: 'worried', look: 1 }, { x: 78, y: 194, s: 1.0 }) + burr(106, 150, 17) + path('M120 138q8 -6 14 -2M122 158q8 2 14 8', 'none', sw(3.5))
  ],
  dispersed: () => [
    // a bunny blows a dandelion and its seeds drift away in every direction
    ground(192, C.grass) +
    path('M100 118Q108 134 86 142', 'none', ` stroke="${C.green}" stroke-width="5"`) +
    Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${R(100 + 12 * Math.cos(a))} ${R(100 + 12 * Math.sin(a))}L${R(100 + 20 * Math.cos(a))} ${R(100 + 20 * Math.sin(a))}" stroke-width="3"/>`; }).join('') + circle(100, 100, 11, C.white) +
    [[134, 80, 20], [158, 108, 70], [150, 50, -20], [176, 70, 10], [126, 140, 100], [172, 142, 60], [184, 30, 0]].map(([x, y, r]) =>
      g(path('M0 0v10', 'none', sw(3)) + path('M-7 -1q7 -11 14 0M0 -1v-8M-3.5 -1l-3 -7M3.5 -1l3 -7', 'none', sw(2.5)), { x, y, rot: r })).join('') +
    path('M76 112q8 -2 14 -8M76 120q10 0 16 -4', 'none', sw(3.5)) +
    P({ kind: 'bunny', mood: 'wow', look: 1, arms: [[50, -70], null] }, { x: 50, y: 194, s: 0.7 }),
    C.sky
  ],
  saliva: () => [
    // a cat licks her lips at a big cookie and her mouth is watering: a long string of drool hangs from her mouth
    P({ kind: 'cat', mood: 'wow', look: 1, tail: false, top: ellipse(0, -52, 6, 8, C.pink, sw(3)) + path('M7 -50q5 18 0 36', 'none', ` stroke="${C.blue}" stroke-width="5"`) + path('M7 -14q-6 9 0 12q6 -3 0 -12z', C.blue, sw(3)) }, { x: 84, y: 198, s: 1.35 }) +
    cookie(160, 60, 24) + sparkle(184, 28, 8) + sparkle(132, 26, 7)
  ],
  esophagus: () => [
    // the long tube from the mouth down to the stomach: a bite of cookie is squeezed along it, and a bunny pats its full tummy
    path('M80 -6V116', 'none', ' stroke-width="34"') + path('M80 -6V116', 'none', ` stroke="#F7A9BD" stroke-width="24"`) +
    ellipse(80, 54, 21, 17, '#F7A9BD') + circle(80, 54, 10, '#E3A55F', sw(3.5)) + path('M62 92h36M62 106h36', 'none', ` stroke="${C.deep}" stroke-width="4"`) +
    arrow(40, 26, 40, 58, C.deep, 6) + arrow(120, 26, 120, 58, C.deep, 6) +
    ellipse(94, 148, 52, 34, '#F7A9BD', ' transform="rotate(-10 94 148)"') + circle(78, 152, 5, '#E3A55F', sw(2.5)) + circle(98, 160, 5, '#E3A55F', sw(2.5)) + circle(112, 144, 5, '#E3A55F', sw(2.5)) +
    P({ kind: 'bunny', mood: 'happy', tail: false, arms: [[-14, -26], null] }, { x: 170, y: 196, s: 0.44 })
  ],
  digestive: () => [
    // a smiling stomach churns up a cookie; the food becomes energy (a gold bolt)
    rect(58, 6, 16, 56, '#F7A9BD', 7) + path('M156 118q16 -8 20 6t18 6', 'none', ' stroke-width="17"') + path('M156 118q16 -8 20 6t18 6', 'none', ` stroke="#F7A9BD" stroke-width="9"`) +
    ellipse(100, 108, 62, 44, '#F7A9BD', ' transform="rotate(-12 100 108)"') +
    circle(84, 86, 3.8, C.ink, noStroke) + circle(112, 82, 3.8, C.ink, noStroke) + path('M86 94q12 12 26 -2', 'none', sw(3.8)) + circle(76, 96, 5, C.pink, noStroke) + circle(122, 90, 5, C.pink, noStroke) +
    path('M66 122q10 -10 20 0t20 0t20 0', 'none', sw(3.5)) + circle(78, 134, 6, '#E3A55F', sw(3)) + circle(96, 138, 5, '#E3A55F', sw(3)) + circle(116, 132, 6, '#E3A55F', sw(3)) +
    poly([[150, 18], [132, 52], [146, 52], [136, 82], [166, 40], [150, 40], [160, 18]], C.butter, sw(4)) +
    P({ kind: 'bunny', mood: 'happy', arms: [[-14, -26], null] }, { x: 38, y: 198, s: 0.42 })
  ],
  agriculture: () => [
    // a bunny farmer digs the soil into rows and little green sprouts come up
    rect(0, 120, 200, 80, C.wood, 0, noStroke) + sun(164, 36, 13) +
    [[132, 144], [158, 144], [184, 144], [118, 174], [146, 174], [174, 174]].map(([x, y]) => path(`M${x} ${y}v-14M${x} ${y - 10}q-9 -2 -9 -10M${x} ${y - 10}q9 -2 9 -10`, 'none', ` stroke="${C.green}" stroke-width="5"`)).join('') +
    path('M100 150H200M92 180H200', 'none', ` stroke="${C.woodDark}" stroke-width="5"`) +
    path('M98 112L118 174', 'none', ` stroke="${C.woodDark}" stroke-width="7"`) + poly([[110, 172], [128, 176], [124, 190], [106, 188]], C.gray, sw(4)) + ellipse(86, 190, 14, 6, C.woodDark) +
    P({ kind: 'bunny', mood: 'determined', look: 1, arms: [[40, -62], null], top: ellipse(0, -100, 38, 8, C.butter) + path('M-24 -102q24 -36 48 0z', C.butter, sw(4)) }, { x: 60, y: 192, s: 0.74 }),
    C.sky
  ],
  surplus: () => [
    // two friends are full and pat their tummies, and a big pile of extra cookies is still left over (a plus sign)
    P({ kind: 'cat', mood: 'happy', look: 1, tail: false, arms: [[-4, -30], null] }, { x: 34, y: 192, s: 0.64 }) +
    P({ kind: 'dog', mood: 'happy', look: 1, tail: false, arms: [[-4, -30], null] }, { x: 84, y: 192, s: 0.64 }) +
    path('M118 192h76v-14h-76z', C.wood, sw(4)) +
    [[132, 168], [152, 168], [172, 168], [142, 150], [162, 150], [182, 150], [152, 132], [172, 132], [162, 114]].map(([x, y]) => cookie(x, y, 10)).join('') +
    path('M160 72h28M174 58v28', 'none', ` stroke="${C.green}" stroke-width="9"`)
  ],
  historian: () => [
    // a cat in glasses studies an old scroll and a clay pot, with a timeline of long-ago things (pyramid, tower, house) above
    path('M8 36H182', 'none', sw(5)) + path('M178 28l12 8l-12 8', 'none', sw(5)) + path('M30 36v6M76 36v6M124 36v6', 'none', sw(4)) +
    poly([[16, 30], [44, 30], [30, 8]], C.butter, sw(3.5)) + rect(64, 14, 24, 16, C.gray, 3, sw(3.5)) + rect(62, 8, 7, 8, C.gray, 2, sw(3)) + rect(73, 8, 7, 8, C.gray, 2, sw(3)) + rect(84, 8, 7, 8, C.gray, 2, sw(3)) +
    rect(110, 18, 28, 12, C.cream, 3, sw(3.5)) + poly([[106, 18], [124, 4], [142, 18]], C.berry, sw(3.5)) +
    rect(138, 176, 58, 8, C.wood, 4) + path('M150 176q-8 -22 6 -30h20q14 8 6 30z', C.orange) + path('M152 160h28', 'none', ` stroke="${C.deep}" stroke-width="4"`) +
    P({ kind: 'cat', mood: 'calm', look: 1, arms: [null, [46, -50]], top: circle(-12, -76, 10, 'none', sw(3.5)) + circle(12, -76, 10, 'none', sw(3.5)) + path('M-2 -76h4', 'none', sw(3.5)) }, { x: 52, y: 196, s: 0.78 }) +
    rect(92, 126, 48, 36, '#F3E3C3', 6) + path('M100 138h32M100 148h24', 'none', sw(3.5)) + rect(88, 122, 8, 44, C.wood, 4) + rect(136, 122, 8, 44, C.wood, 4)
  ],
  paleolithic: () => [
    // a dog in a fur wrap holds a stone axe next to a campfire, in front of a cave wall with a painted animal: the old stone age
    path('M22 200V94q0 -74 78 -74t78 74V200z', C.dark) +
    ellipse(96, 66, 18, 10, 'none', ` stroke="${C.white}" stroke-width="3.5"`) + circle(76, 62, 7, 'none', ` stroke="${C.white}" stroke-width="3.5"`) + path('M84 74v12M92 76v12M106 76v12M114 74v12M70 56l-6 -8', 'none', ` stroke="${C.white}" stroke-width="3.5"`) +
    P({ kind: 'dog', mood: 'happy', look: 1, arms: [null, [46, -70]], extra: path('M-26 -50L26 -22V-8L-26 -34z', '#C98B5E') + path('M-6 -40l6 -2M8 -30l6 -2', 'none', sw(3)) }, { x: 58, y: 194, s: 0.72 }) +
    path('M92 146L106 98', 'none', ` stroke="${C.wood}" stroke-width="7"`) + poly([[96, 94], [118, 86], [122, 106], [104, 106]], C.gray, sw(4)) +
    path('M122 192l32 -12M156 192l-32 -12', 'none', ` stroke="${C.wood}" stroke-width="9"`) + path('M140 180q-18 -16 -4 -34q4 12 14 10q10 14 -10 24z', C.orange, sw(4)) + path('M140 178q-6 -8 0 -16q4 6 4 10z', C.butter, noStroke),
    '#E9DCC8'
  ],
  counterargument: () => [
    // the cat says "yes" (green check); the dog holds up a paw and answers "no" (red X) that pushes back against it
    bubble(8, 10, 76, 58, 40, 112) + check(46, 40, 1.2) + bubble(116, 10, 76, 58, 160, 112) + cross(154, 40, 1.1) + arrow(110, 40, 92, 40, C.berry, 6) +
    P({ kind: 'cat', mood: 'happy', look: 1 }, { x: 42, y: 194, s: 0.62 }) +
    P({ kind: 'dog', mood: 'determined', look: -1, arms: [[-52, -78], null] }, { x: 158, y: 194, s: 0.62 }) + ground(194, C.path)
  ],
  diseases: () => [
    // a sick bunny lies in bed with a thermometer in its mouth, and angry little green germs float around it
    rect(8, 96, 16, 92, C.wood, 6) + rect(176, 130, 16, 58, C.wood, 6) + rect(20, 100, 62, 34, C.white, 14) +
    P({ kind: 'bunny', mood: 'sad', look: 0, tail: false, extra: path('M4 -58L40 -50', 'none', ' stroke-width="11"') + path('M4 -58L40 -50', 'none', ` stroke="${C.white}" stroke-width="6"`) + circle(41, -50, 5.5, C.berry, sw(3)) + sweat(26, -92) }, { x: 56, y: 150, s: 0.8 }) +
    rect(36, 128, 150, 50, C.butter, 14) + [[60, 148], [92, 156], [124, 146], [156, 156]].map(([x, y]) => circle(x, y, 5, C.berry, noStroke)).join('') + rect(8, 172, 184, 14, C.wood, 6) +
    germ(150, 60, 14) + germ(112, 34, 11) + germ(178, 100, 11) + germ(100, 84, 9)
  ],

  farming: () => [
    // a dog drives a tractor across a field of corn, with a barn behind: working the land
    path('M0 120Q100 96 200 124V200H0z', C.grass2, noStroke) + line(0, 120, 200, 124) +
    rect(10, 66, 58, 54, C.berry) + poly([[4, 68], [39, 36], [74, 68]], C.deep) + rect(28, 88, 22, 32, C.white, 3, sw(3.5)) + path('M28 88l22 32M50 88l-22 32', 'none', sw(3)) +
    [[24, 196], [50, 200]].map(([x, y]) => path(`M${x} ${y}V${y - 34}M${x} ${y - 20}q-12 -6 -14 -16M${x} ${y - 14}q12 -6 14 -16`, 'none', ` stroke="${C.green}" stroke-width="5"`) + ellipse(x, y - 38, 5, 11, C.butter, sw(3.5))).join('') +
    path('M82 112v-24', 'none', sw(5)) + rect(88, 100, 74, 36, C.berry, 8) + rect(112, 78, 40, 28, GL, 6) +
    P({ kind: 'dog', mood: 'happy', look: 1, tail: false }, { x: 132, y: 110, s: 0.34 }) +
    circle(98, 154, 22, C.dark) + circle(98, 154, 8, C.gray, sw(3.5)) + circle(154, 160, 13, C.dark) + circle(154, 160, 5, C.gray, sw(3)) +
    [[40, 196]].map(() => '').join('')
  ],
  enchanted: () => [
    // a dog in a wizard hat points a star wand and the cat floats off the ground, spellbound, sparkles swirling round her
    ellipse(148, 192, 26, 6, '#E8CBD4', noStroke) +
    P({ kind: 'dog', mood: 'happy', look: 1, arms: [null, [54, -76]], top: poly([[-26, -98], [0, -152], [26, -98]], C.blue, sw(4)) + ellipse(0, -98, 36, 8, C.blue) + star(0, -122, 7) }, { x: 38, y: 192, s: 0.62 }) +
    path('M72 140L104 108', 'none', ` stroke="${C.wood}" stroke-width="6"`) + star(108, 104, 10) +
    path('M118 100Q128 94 134 104', 'none', ` stroke="${C.butter}" stroke-width="5" stroke-dasharray="2 8"`) +
    P({ kind: 'cat', mood: 'sleepy', look: 0, arms: [[-30, -30], [30, -30]] }, { x: 150, y: 176, s: 0.68 }) +
    ellipse(150, 128, 38, 50, 'none', ` stroke="${C.butter}" stroke-width="5" stroke-dasharray="3 10"`) + sparkle(112, 150, 8) + sparkle(188, 100, 8) + sparkle(120, 56, 7) + sparkle(176, 40, 9) + star(190, 160, 7)
  , C.sky],
  peered: () => [
    // a cat holds binoculars up to her eyes and peers hard through a window at the bunny inside
    ground(192, C.grass) +
    rect(92, 24, 104, 132, C.wood, 10) + rect(102, 34, 84, 112, '#FFF4CC', 4) +
    P({ kind: 'bunny', mood: 'calm', look: -1 }, { x: 150, y: 144, s: 0.5 }) +
    path('M102 34h22q-6 54 0 112h-22z', C.berry, sw(3.5)) + rect(82, 150, 124, 14, C.wood, 6) +
    P({ kind: 'cat', mood: 'calm', look: 1, top: circle(-14, -76, 13, C.dark, sw(4)) + circle(14, -76, 13, C.dark, sw(4)) + rect(-6, -82, 12, 10, C.dark, 3, sw(3)) + circle(-17, -80, 3, C.white, noStroke) + circle(11, -80, 3, C.white, noStroke), arms: [[-26, -52], [26, -52]] }, { x: 44, y: 196, s: 0.88 })
  ],
  they: () => [
    // a cat points across to a group of other pets standing over there, far away: those others are "they"
    path('M70 172Q140 130 200 160V200H70z', C.grass2, noStroke) +
    [[112, 'dog', C.wood], [146, 'bunny', C.white], [180, 'cat', C.gray]].map(([x, k, c]) => P({ kind: k, color: c, mood: 'calm', look: -1, tail: false }, { x, y: 170, s: 0.4 })).join('') +
    P({ kind: 'cat', mood: 'smile', look: 1, arms: [null, [52, -66]] }, { x: 36, y: 196, s: 0.74 })
  , C.sky],
  someone: () => [
    // someone is at the door: one dark silhouette stands in the doorway with a question mark over it, and a bunny inside looks on
    rect(96, 14, 94, 174, C.wood, 8) + rect(106, 24, 74, 164, C.sky, 4) +
    P({ kind: 'cat', color: C.ink, mood: 'calm', tail: false }, { x: 144, y: 188, s: 0.66 }) +
    poly([[106, 24], [130, 32], [130, 180], [106, 188]], C.woodDark) + circle(124, 112, 4, C.butter, sw(3)) +
    text(152, 78, '?', 46, C.berry) +
    P({ kind: 'bunny', mood: 'wow', look: 1, arms: [[-30, -52], null] }, { x: 46, y: 192, s: 0.68 }) + ground(192, C.path)
  ],
  stories: () => [
    // a dog reads aloud from a big book; a picture of a castle with a star floats above while two friends listen
    bubble(24, 6, 152, 88, 100, 120) + rect(74, 44, 52, 38, C.gray, 4) + rect(66, 30, 16, 52, C.gray, 3) + rect(118, 30, 16, 52, C.gray, 3) + poly([[62, 32], [74, 14], [86, 32]], C.berry, sw(3.5)) + poly([[114, 32], [126, 14], [138, 32]], C.berry, sw(3.5)) + path('M94 82v-16q6 -8 12 0v16', C.dark, sw(3)) + star(150, 36, 9) + circle(44, 40, 3, C.butter, noStroke) +
    P({ kind: 'bunny', mood: 'happy', look: 1, tail: false }, { x: 26, y: 196, s: 0.5 }) + P({ kind: 'cat', mood: 'happy', look: -1, tail: false }, { x: 174, y: 196, s: 0.5 }) +
    P({ kind: 'dog', mood: 'happy', look: 0, tail: false }, { x: 100, y: 194, s: 0.6 }) + rect(68, 158, 34, 26, C.white, 4) + rect(98, 158, 34, 26, C.cream, 4) + path('M72 166h26M72 174h22M104 166h22M104 174h22', 'none', sw(2.5)) + ground(196, C.path)
  ],
  our: () => [
    // a cat and a dog stand close together, each with a paw on the same little house: it belongs to both of them
    poly([[44, 88], [100, 36], [156, 88]], C.berry) + rect(56, 86, 88, 66, '#FFF4CC', 4) + rect(90, 112, 20, 40, C.wood, 4) + rect(64, 98, 20, 18, GL, 3, sw(3.5)) + rect(116, 98, 20, 18, GL, 3, sw(3.5)) + heart(100, 64, 1.1) +
    P({ kind: 'cat', mood: 'happy', look: 1, arms: [null, [34, -62]] }, { x: 52, y: 196, s: 0.64 }) +
    P({ kind: 'dog', mood: 'happy', look: -1, arms: [[-34, -62], null] }, { x: 148, y: 196, s: 0.64 }) + ground(196, C.grass)
  ],
  mesopotamia: () => [
    // the land between two winding rivers, with a stepped mud-brick tower in the middle; a bunny explorer looks on
    path('M40 -6Q78 50 36 100T44 206', 'none', ` stroke="${C.grass2}" stroke-width="44" stroke-linecap="butt"`) + path('M160 -6Q122 50 164 100T156 206', 'none', ` stroke="${C.grass2}" stroke-width="44" stroke-linecap="butt"`) +
    path('M40 -6Q78 50 36 100T44 206', 'none', ' stroke-width="20"') + path('M40 -6Q78 50 36 100T44 206', 'none', ` stroke="${C.blue}" stroke-width="12"`) +
    path('M160 -6Q122 50 164 100T156 206', 'none', ' stroke-width="20"') + path('M160 -6Q122 50 164 100T156 206', 'none', ` stroke="${C.blue}" stroke-width="12"`) +
    rect(58, 128, 84, 26, '#E3C28A', 4) + rect(72, 104, 56, 26, '#E3C28A', 4) + rect(86, 82, 28, 24, '#E3C28A', 4) + rect(94, 92, 12, 14, C.woodDark, 3, sw(3)) + path('M100 154v-24', 'none', ` stroke="${C.woodDark}" stroke-width="5"`) +
    P({ kind: 'bunny', mood: 'wow', look: 0, tail: false }, { x: 100, y: 198, s: 0.38 })
  , '#F3E3C3'],
  societies: () => [
    // a village where everyone has a job and helps the others: a farmer, a builder and a teacher, with homes behind them
    sun(170, 26, 11) +
    [[34, 0], [100, 0], [166, 0]].map(([x]) => rect(x - 22, 90, 44, 32, '#FFF4CC', 4) + poly([[x - 28, 92], [x, 66], [x + 28, 92]], C.berry, sw(4)) + rect(x - 6, 104, 12, 18, C.wood, 3, sw(3.5))).join('') +
    P({ kind: 'cat', mood: 'happy', look: 1, tail: false, arms: [null, [36, -40]] }, { x: 34, y: 192, s: 0.6 }) + carrot(60, 160, 0.8, -10) +
    P({ kind: 'dog', mood: 'happy', look: 0, tail: false, arms: [null, [38, -66]] }, { x: 100, y: 192, s: 0.6 }) + path('M122 152L128 128', 'none', ` stroke="${C.wood}" stroke-width="5"`) + rect(118, 120, 20, 10, C.gray, 3, sw(3.5)) +
    P({ kind: 'bunny', mood: 'happy', look: -1, tail: false }, { x: 166, y: 192, s: 0.6 }) + rect(150, 158, 34, 22, C.white, 3) + path('M167 158v22', 'none', sw(3)) +
    heart(67, 150, 0.8) + heart(133, 150, 0.8) + ground(192, C.grass)
  ],
  reflexive: () => [
    // a cat gives herself a big hug, both paws wrapped round her own shoulders, with hearts: the action goes back to the one doing it
    P({ kind: 'cat', mood: 'happy', look: 0, arms: [[20, -50], [-20, -50]] }, { x: 100, y: 194, s: 1.0 }) +
    heart(38, 70, 1.4) + heart(164, 56, 1.2) + heart(152, 118, 0.8) + sparkle(30, 128, 9)
  ],
  library: () => [
    // shelves packed with books, a stack on the floor and a cat reading a book of her own
    rect(8, 8, 184, 124, C.wood, 8) + rect(16, 16, 168, 52, C.woodDark, 3, noStroke) + rect(16, 74, 168, 52, C.woodDark, 3, noStroke) +
    [0, 1].map(row => { let x = 20; return Array.from({ length: 11 }, (_, i) => { const w = [13, 11, 15, 12, 14, 12][i % 6], h = [36, 42, 32, 40, 34, 28][(i + row * 2) % 6], c = [C.berry, C.blue, C.mint, C.butter, C.orange, C.green, C.pink][(i * 3 + row * 2) % 7], bottom = row ? 126 : 68; const r = rect(x, bottom - h - 2, w, h, c, 2, sw(3)); x += w + 2; return r; }).join(''); }).join('') +
    rect(8, 126, 184, 8, C.wood, 3) + ground(194, C.path) +
    rect(20, 176, 60, 12, C.berry, 3) + rect(24, 164, 52, 12, C.blue, 3) + rect(28, 152, 44, 12, C.butter, 3) +
    P({ kind: 'cat', mood: 'happy', look: 0, tail: false }, { x: 138, y: 198, s: 0.6 }) + rect(110, 162, 56, 26, C.white, 4) + path('M138 162v26M118 172h14M144 172h14M118 180h14M144 180h14', 'none', sw(3)),
    C.cream
  ],
  coxa: () => [legParts(0)],
  trochanter: () => [legParts(1)],
  femur: () => [legParts(2)],
  patella: () => [legParts(3)],
  tibia: () => [legParts(4)],
  metatarsus: () => [legParts(6)],
  tarsus: () => [legParts(5)],
  diviners: () => [
    // a sleepy dog dreams (a moon and star in a cloud) and a cat in a turban reads the dream with a magnifier to say what it means
    thought(64, 58, 52, 38, 46, 128) + path('M52 40a15 15 0 1 0 15 20a12 12 0 1 1 -15 -20z', C.butter, sw(3.5)) + star(88, 64, 9) + star(82, 40, 5) +
    P({ kind: 'dog', mood: 'sleepy', look: 0, tail: false }, { x: 44, y: 194, s: 0.62 }) + path('M62 140q4 -8 0 -14M72 134q4 -8 0 -14', 'none', sw(3)) +
    P({ kind: 'cat', mood: 'calm', look: -1, arms: [[-46, -64], null], top: path('M-32 -92q32 -38 64 0z', C.mint) + rect(-33, -98, 66, 9, C.berry, 4) + circle(0, -112, 5, C.butter, sw(3)) }, { x: 154, y: 194, s: 0.62 }) +
    magnifier(104, 122, 16, 35)
  ],
  oracle: () => [
    // a cat in a starry wizard hat gazes into a crystal ball that shows what will happen next: a trophy
    P({ kind: 'cat', mood: 'calm', look: 0, arms: [[-36, -28], [36, -28]], top: poly([[-30, -96], [0, -156], [30, -96]], C.blue, sw(4)) + ellipse(0, -96, 38, 8, C.blue) + star(0, -124, 7) }, { x: 100, y: 172, s: 0.78 }) +
    path('M70 194q4 -20 30 -20t30 20z', C.wood) + circle(100, 154, 32, GL, ' fill-opacity=".55"') +
    path('M88 138h24q0 20 -12 20t-12 -20z', C.butter, sw(3.5)) + path('M88 142q-8 0 -6 8q2 4 8 4M112 142q8 0 6 8q-2 4 -8 4', 'none', sw(3)) + rect(94, 158, 12, 6, C.butter, 2, sw(3)) +
    sparkle(52, 120, 9) + sparkle(152, 112, 8) + sparkle(160, 160, 7) + star(44, 60, 8) + star(160, 48, 10),
    '#3E3350'
  ],
  'mohenjo-daro': () => [
    // a bird's-eye view of a city planned on straight streets: blocks of neat brick houses, trees at the corners and covered drains down the streets; a cat city planner holds the plan
    rect(6, 6, 188, 124, '#FBF3E2', 10) +
    [0, 1, 2].map(i => [0, 1].map(j => [0, 1].map(a => [0, 1].map(b => rect(14 + i * 62 + a * 26, 14 + j * 56 + b * 24, 22, 20, C.orange, 3, sw(3.5))).join('')).join('')).join('')).join('') +
    path('M8 64H192', 'none', ' stroke-width="11"') + path('M8 64H192', 'none', ` stroke="${C.blue}" stroke-width="5"`) + path('M8 120H192', 'none', ' stroke-width="11"') + path('M8 120H192', 'none', ` stroke="${C.blue}" stroke-width="5"`) +
    [[69, 41], [131, 41], [69, 97], [131, 97]].map(([x, y]) => circle(x, y, 8, C.grass2, sw(3.5))).join('') +
    rect(12, 140, 86, 50, C.white, 6) + path('M12 156H98M12 172H98M34 140V190M56 140V190M78 140V190', 'none', ` stroke="${C.blue}" stroke-width="2.5"`) +
    P({ kind: 'cat', mood: 'determined', look: -1, arms: [[-34, -40], null], top: path('M-30 -96q30 -26 60 0z', C.butter) + rect(-34, -98, 68, 8, C.butter, 4) }, { x: 150, y: 198, s: 0.55 })
  , '#F3E3C3'],
  wail: () => [
    // a dog throws back its head and cries loudly, big tears running down its cheeks
    ellipse(100, 188, 56, 8, '#CDE6F2', noStroke) +
    P({ kind: 'dog', mood: 'sad', look: 0, tail: false, top: path('M-14 -70q-10 14 -6 34M14 -70q10 14 6 34', 'none', ` stroke="${C.blue}" stroke-width="6"`) + ellipse(0, -54, 9, 11, C.deep, sw(3.5)) + ellipse(0, -50, 5, 4, C.pink, noStroke) }, { x: 100, y: 190, s: 1.2 }) +
    path('M26 70q-10 14 0 28M12 62q-14 22 0 44M174 70q10 14 0 28M188 62q14 22 0 44', 'none', sw(4.5)) + path('M30 150q-5 8 0 10q5 -2 0 -10z', C.blue, sw(3)) + path('M172 140q-5 8 0 10q5 -2 0 -10z', C.blue, sw(3))
  ],
  articles: () => [
    // a big newspaper page (a heading bar, a picture and columns of lines) and a cat who points at the story she is reading
    rect(14, 14, 118, 164, C.white, 6) + rect(22, 22, 102, 18, C.dark, 3) + rect(22, 48, 48, 40, '#CFE8F5', 3) + path('M24 84l14 -18l10 10l8 -12l12 20z', C.grass2, sw(3)) + circle(58, 58, 5, C.butter, sw(3)) +
    path('M78 54h42M78 64h42M78 74h42M78 84h34M22 98h98M22 110h98M22 122h60M92 122h28M22 136h98M22 148h98M22 160h70', 'none', sw(3.5)) +
    P({ kind: 'cat', mood: 'happy', look: -1, arms: [[-48, -60], null], tail: false }, { x: 164, y: 196, s: 0.62 })
  ],
  humans: () => [
    // three people (two grown-ups and a child) wave hello and a friendly dog looks up at them: humans
    `<g>${[[40, 196, 0.95, '#F3D9BF', C.dark, C.blue, C.dark], [92, 196, 0.7, '#C98B5E', C.woodDark, C.berry, C.blue], [140, 196, 0.95, '#E8B88F', '#B5651D', C.mint, C.wood]].map(([x, y, s, skin, hair, shirt, pants]) => g(
      rect(-12, -36, 10, 36, pants, 4) + rect(2, -36, 10, 36, pants, 4) + limb(-14, -66, -30, -44, shirt) + limb(14, -66, 30, -92, shirt) + rect(-16, -76, 32, 44, shirt, 10) +
      circle(0, -92, 18, skin) + path('M-18 -94q2 -22 18 -22t18 22q-12 -10 -36 0z', hair) + circle(-6, -90, 2.6, C.ink, noStroke) + circle(6, -90, 2.6, C.ink, noStroke) + path('M-5 -82q5 5 10 0', 'none', sw(3)), { x, y, s })).join('')}</g>` +
    P({ kind: 'dog', mood: 'happy', look: -1 }, { x: 184, y: 196, s: 0.4 }) + ground(196, C.grass)
  ],
  circulatory: () => [
    // a heart pumps blood round a loop: red blood leaves on one side and blue blood returns on the other
    path('M100 28A72 72 0 0 0 100 172', 'none', ' stroke-width="15"') + path('M100 28A72 72 0 0 0 100 172', 'none', ` stroke="${C.berry}" stroke-width="8"`) +
    path('M100 172A72 72 0 0 0 100 28', 'none', ' stroke-width="15"') + path('M100 172A72 72 0 0 0 100 28', 'none', ` stroke="${C.blue}" stroke-width="8"`) +
    g(path('M-10 -9L0 0L-10 9', 'none', ` stroke="${C.deep}" stroke-width="7"`), { x: 104, y: 172 }) + g(path('M-10 -9L0 0L-10 9', 'none', ` stroke="#3F8FBE" stroke-width="7"`), { x: 96, y: 28, rot: 180 }) +
    [[54, 45], [28, 100], [54, 155]].map(([x, y]) => circle(x, y, 5, C.deep, sw(2.5))).join('') + [[146, 45], [172, 100], [146, 155]].map(([x, y]) => circle(x, y, 5, '#3F8FBE', sw(2.5))).join('') +
    heart(100, 104, 3.4, C.berry) + path('M86 92q4 -8 12 -6', 'none', ` stroke="${C.white}" stroke-width="4"`)
  ],
  pancreas: () => [
    // a smiling pancreas (a long lumpy organ) squirts juice down onto the small intestine tube below
    path('M22 88q4 -26 44 -24q30 2 58 -6q40 -8 62 6q10 8 -6 18q-24 16 -70 20q-38 4 -64 8q-26 -2 -24 -22z', C.orange) +
    circle(50, 78, 3.6, C.ink, noStroke) + circle(72, 78, 3.6, C.ink, noStroke) + path('M56 86q5 5 10 0', 'none', sw(3.5)) + circle(40, 84, 4, C.pink, noStroke) + circle(82, 84, 4, C.pink, noStroke) +
    [[112, 118], [136, 126], [158, 118]].map(([x, y]) => path(`M${x} ${y}q-8 11 0 14q8 -3 0 -14z`, C.blue, sw(3.5))).join('') +
    path('M4 176Q40 150 76 172T150 170T200 176', 'none', ' stroke-width="20"') + path('M4 176Q40 150 76 172T150 170T200 176', 'none', ` stroke="#F7A9BD" stroke-width="12"`)
  ],
  enzymes: () => [
    // a cookie with big bites taken out of it: two tiny mint-green helpers with big mouths chomp it into crumbs; they break things down
    cookie(78, 100, 48) + circle(122, 66, 17, C.bg, noStroke) + circle(130, 100, 17, C.bg, noStroke) + circle(122, 134, 17, C.bg, noStroke) +
    [[152, 70], [156, 130]].map(([x, y]) => g(circle(0, 0, 21, C.mint) + circle(-3, -9, 3.4, C.ink, noStroke) + circle(9, -8, 3.4, C.ink, noStroke) + path('M-2 4L-24 -6L-24 16z', C.deep, sw(3.5)) + path('M-24 -6l8 4l4 -6M-24 16l8 -4l4 6', 'none', ` stroke="${C.white}" stroke-width="3.5"`), { x, y })).join('') +
    [[110, 30], [136, 36], [124, 170], [146, 164], [176, 100], [96, 190]].map(([x, y]) => circle(x, y, 5, '#E3A55F', sw(2.5))).join('')
  ],
  fertilization: () => [
    // a flower is fertilized: pollen drifts into its centre, and a new seed sprouts into a baby plant (new life)
    ground(190, C.grass) + flower(46, 72, 14) + path('M46 134q-18 -6 -22 -22q18 0 22 22z', C.grass2, sw(3.5)) +
    [[20, 28], [34, 20], [14, 46]].map(([x, y]) => circle(x, y, 5, C.butter, sw(3))).join('') + path('M28 36Q42 44 44 62', 'none', ` stroke="${C.orange}" stroke-width="4" stroke-dasharray="2 8"`) +
    arrow(86, 120, 112, 120, C.ink, 6) +
    ellipse(156, 178, 34, 12, C.wood) + path('M156 170V132', 'none', ` stroke="${C.green}" stroke-width="7"`) + path('M156 146q-26 -4 -26 -26q22 0 26 26zM156 136q26 -4 26 -26q-22 0 -26 26z', C.grass2, sw(4)) + sparkle(184, 70, 9) + heart(130, 78, 1)
  ],
  ovule: () => [
    // inside a flower's ovary: a cut-open bulb holds a few little round ovules, and a magnifier shows one up close
    path('M100 40V16', 'none', ` stroke="${C.green}" stroke-width="7"`) + circle(100, 14, 7, C.pink, sw(3.5)) +
    path('M100 40C44 40 46 172 100 172C154 172 156 40 100 40z', C.grass2) + path('M100 54C58 54 60 160 100 160C140 160 142 54 100 54z', C.cream, sw(3.5)) +
    [[84, 90], [116, 90], [84, 128], [116, 128]].map(([x, y]) => circle(x, y, 13, C.butter) + circle(x, y, 4.5, C.orange, noStroke)).join('') +
    magnifier(150, 128, 24, 40) + circle(150, 128, 11, C.butter, noStroke) + circle(150, 128, 4, C.orange, noStroke)
  ],
};
