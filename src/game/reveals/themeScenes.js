/* Theme-day scenes: a small animated scene for the theme-day announcement card, starring the student's pet.
   Data-driven: each scene in THEME_SCENES lists a background, a few CSS-drawn decorations, the pet (with a motion and
   things it wears), props, particle groups and an optional line of text. themeSceneHTML() turns one into markup and
   addThemeSceneCSS() adds the styles once. CSS animations only. Every looping animation starts at a negative delay, so
   with prefers-reduced-motion the scene freezes into a still picture mid-motion; one-shot drops just sit in place.

   Prop / particle fields: e (emoji or text) or c (a CSS shape class), x / y (% of the box, or a CSS length string),
   s (px), a (animation key below), d (seconds), dl (delay seconds, negative = already running), z, f (flip),
   o (transform-origin), v (extra CSS custom properties), once (play one time and stay).
   Particle groups: n copies with random x / y / s / d picked from [min, max] ranges and random negative delays. */

const TAU = 360;

/* animation key -> [keyframes, default seconds, timing] */
const ANIMS = {
  float: ['ts-float', 3], bob: ['ts-bob', 2.4], bounce: ['ts-bounce', 1.1, 'cubic-bezier(.3,.7,.4,1)'], hop: ['ts-hop', 1.4],
  fall: ['ts-fall', 5, 'linear'], rise: ['ts-rise', 4, 'ease-out'], drift: ['ts-drift', 12, 'linear'], driftL: ['ts-driftL', 12, 'linear'],
  walk: ['ts-walk', 14, 'linear'], orbit: ['ts-orbit', 6, 'linear'], sparkle: ['ts-sparkle', 2.2], twinkle: ['ts-twinkle', 1.8],
  spin: ['ts-spin', 6, 'linear'], spinR: ['ts-spinR', 6, 'linear'], sway: ['ts-sway', 2.6], rock: ['ts-rock', 3],
  flicker: ['ts-flicker', .5, 'linear'], blink: ['ts-blink', 1], pulse: ['ts-pulse', 2], pop: ['ts-pop', 4, 'ease-out'],
  flip: ['ts-flip', 2.2], steam: ['ts-steam', 2.6, 'ease-out'], sweep: ['ts-sweep', 5], launch: ['ts-launch', 5, 'ease-in'],
  streak: ['ts-streak', 1.6, 'linear'], grow: ['ts-grow', 5], swish: ['ts-swish', 3, 'linear'], drop: ['ts-drop', .9, 'ease-in'],
  wob: ['ts-wob', 2.2], step: ['ts-step', 4, 'linear'], burst: ['ts-burst', 2.6, 'cubic-bezier(.15,.8,.3,1)'],
  firefly: ['ts-ffly', 4], flutter: ['ts-flutter', 4, 'ease-out'], glow: ['ts-glow', 1.6], cape: ['ts-cape', .6],
  reveal: ['ts-reveal', 1.8, 'ease-out'], waves: ['ts-waves', 3, 'linear'], flap: ['ts-flap', .35], peck: ['ts-peck', 1.2],
  /* pet motions */
  sleep: ['ts-sleep', 3.2], fly: ['ts-fly', 6, 'linear'], moonwalk: ['ts-moonwalk', 5, 'linear'], pspin: ['ts-pspin', 3],
  mirror: ['ts-mirror', 2.4], robo: ['ts-robo', 2, 'steps(1,end)'], popup: ['ts-popup', 4], slide: ['ts-slide', 5],
  breathe: ['ts-breathe', 2.6], zerog: ['ts-zerog', 7], none: ['', 1]
};

/* reusable wear */
const W = {
  nightcap: {c:'ts-cone ts-nightcap', x:.18, y:-.62, s:1, r:28},
  party: {c:'ts-cone ts-party', x:.05, y:-.68, s:1, r:-12},
  witch: {c:'ts-cone ts-witch', x:0, y:-.66, s:1, r:-8},
  chef: {c:'ts-chef', x:0, y:-.55, s:1},
  beret: {c:'ts-beret', x:.06, y:-.5, s:1, r:-14},
  helmet: {c:'ts-helmet', x:0, y:0, s:1, z:2},
  antenna: {c:'ts-ant', x:0, y:-.5, s:1},
  cape: {c:'ts-cape', x:.55, y:.08, s:1, z:-1, a:'cape'}
};

export const THEME_SCENES = {
  pajamas: {
    bg:'linear-gradient(#141b44,#2c3577 70%,#3d3f86)', deco:['stars'], ground:'linear-gradient(#5b4b8a,#463a73)', gh:22,
    pet:{x:46, y:66, s:46, m:'sleep', wear:[W.nightcap]},
    props:[{e:'🌙', x:84, y:22, s:34, a:'float', d:5}, {c:'ts-pillow', x:46, y:86, s:46, z:1}],
    parts:[{e:['💤'], n:3, a:'rise', x:[54, 70], s:[16, 22], d:[3.5, 5], v:{'--h':'-120px'}},
      {e:['⭐', '✨'], n:5, a:'sparkle', x:[6, 94], y:[8, 55], s:[10, 16], d:[2, 3.4]}]
  },
  stuffies: {
    bg:'linear-gradient(#ffd9e6,#ffc2d6)', ground:'repeating-linear-gradient(90deg,#e7a6c0 0 14px,#efb6cc 14px 28px)', gh:24,
    pet:{x:50, y:64, s:44, m:'hop'},
    props:[{e:'🧸', x:28, y:66, s:44, a:'sway', d:2.4, o:'50% 90%'}, {e:'🧸', x:72, y:66, s:44, a:'sway', d:2.4, dl:-1.2, o:'50% 90%', f:1},
      {e:'🐰', x:10, y:74, s:26, a:'float', d:3}, {e:'🦄', x:91, y:72, s:26, a:'float', d:3.4, dl:-1}],
    parts:[{e:['💗', '💕', '❤️', '💖'], n:7, a:'rise', x:[12, 88], s:[12, 20], d:[3.5, 5.5]}]
  },
  bookCharacter: {
    bg:'radial-gradient(circle at 50% 110%,#ffe9b0 0 30%,transparent 60%),linear-gradient(#6b3f2a,#8a5638)', deco:['shelves'],
    pet:{x:50, y:58, s:44, m:'popup', z:2, wear:[{e:'🎩', x:0, y:-.62, s:.6, r:-8}]},
    props:[{e:'📖', x:50, y:88, s:84, z:3}, {e:'🪄', x:76, y:54, s:24, a:'sway', d:1.6, z:2}],
    parts:[{e:['📄', '📃'], n:5, a:'flutter', x:[30, 70], y:[78, 78], s:[14, 18], d:[3, 4.5], z:4},
      {e:['✨'], n:5, a:'sparkle', x:[10, 90], y:[10, 50], s:[12, 16], d:[1.8, 3]}]
  },
  sports: {
    bg:'linear-gradient(#8fd3ff,#c8ecff 62%)', ground:'repeating-linear-gradient(90deg,#5fb85a 0 22px,#6cc566 22px 44px)', gh:26,
    deco:['hoop'],
    pet:{x:'calc(100% - 196px)', y:66, s:44, m:'hop', wear:[{e:'🧢', x:-.08, y:-.5, s:.55, r:-12}]},
    props:[{e:'🏀', x:'calc(100% - 180px)', y:58, s:22, a:'swish', d:3, z:3},
      {e:'⚽', x:12, y:84, s:18, a:'bounce', d:1, dl:-.3}, {e:'🎾', x:'calc(100% - 90px)', y:86, s:14, a:'bounce', d:.8, dl:-.5}],
    parts:[{e:['☁️'], n:2, a:'drift', y:[8, 22], s:[20, 26], d:[18, 24], z:0}]
  },
  crazyHat: {
    bg:'radial-gradient(circle at 50% 120%,#ffd76a 0 25%,transparent 55%),linear-gradient(#7b3fbf,#b04fc1)', deco:['rays'],
    pet:{x:50, y:78, s:44, m:'breathe', wear:[
      {e:'🎩', x:0, y:-.66, s:.62, a:'drop', dl:.3, once:'wob', r:-6},
      {e:'🧢', x:.06, y:-1.12, s:.56, a:'drop', dl:1.1, once:'wob'},
      {e:'👒', x:-.04, y:-1.52, s:.6, a:'drop', dl:1.9, once:'wob'},
      {e:'🎓', x:.04, y:-1.92, s:.52, a:'drop', dl:2.7, once:'wob'}]},
    parts:[{e:['🎀', '🪶', '✨'], n:6, a:'sparkle', x:[6, 94], y:[10, 70], s:[12, 18], d:[2, 3.2]}]
  },
  mismatch: {
    bg:'repeating-linear-gradient(45deg,#ffe08a 0 16px,#ffb3c7 16px 32px,#a9e4ff 32px 48px,#c8f2b0 48px 64px)',
    pet:{x:50, y:66, s:46, m:'bob', wear:[{e:'🧦', x:.1, y:-.58, s:.55, r:30}]},
    parts:[{e:['🧦'], n:10, a:'fall', x:[4, 96], s:[16, 24], d:[4, 6.5], hue:1}]
  },
  backwards: {
    bg:'linear-gradient(#2e1f5e,#5a3b8c)', ground:'repeating-linear-gradient(90deg,#3b2a63 0 18px,#46327a 18px 36px)', gh:24,
    deco:['spot'],
    pet:{x:50, y:66, s:44, m:'moonwalk'},
    text:{t:'!yaD sdrawkcaB', x:50, y:18, s:20, a:'wob', d:2.6, cls:'ts-chalk'},
    parts:[{e:['🔄', '⏪', '✨'], n:5, a:'sparkle', x:[6, 94], y:[30, 70], s:[12, 16], d:[2, 3]}]
  },
  rainbow: {
    bg:'linear-gradient(#bfe6ff,#e9f7ff)', ground:'linear-gradient(#8fd17a,#74bf62)', gh:10, deco:['rainbow'],
    pet:{x:50, y:'calc(100% - 15px)', s:34, m:'slide'},
    props:[{e:'☁️', x:'calc(50% - 104px)', y:'calc(100% - 20px)', s:34, a:'bob', d:3, z:3}, {e:'☁️', x:'calc(50% + 104px)', y:'calc(100% - 20px)', s:34, a:'bob', d:3, dl:-1.5, z:3},
      {e:'☀️', x:90, y:16, s:26, a:'spin', d:14}],
    parts:[{e:['✨', '💜', '💙', '💚', '💛', '🧡', '❤️'], n:7, a:'sparkle', x:[6, 94], y:[6, 40], s:[10, 14], d:[2, 3.2]}]
  },
  detective: {
    bg:'radial-gradient(ellipse at 50% 40%,#53606e 0 30%,#252c35 75%)', ground:'#3a3128', gh:22,
    pet:{x:24, y:58, s:42, m:'bob', wear:[{e:'🎩', x:.02, y:-.6, s:.6, r:-10}]},
    props:[{e:'🔍', x:58, y:52, s:34, a:'sweep', d:5, z:4},
      ...[0, 1, 2, 3, 4, 5].map(i => ({e:'🐾', x:40 + i * 10, y:i % 2 ? 80 : 90, s:13, a:'step', d:4, dl:-4 + i * .45, z:2, r:90}))],
    parts:[{e:['❓', '❔'], n:3, a:'float', x:[60, 92], y:[14, 30], s:[14, 18], d:[2.6, 3.4]}]
  },
  chef: {
    bg:'repeating-conic-gradient(#fff6e8 0 25%,#ffe3c2 0 50%) 0 0/28px 28px', ground:'linear-gradient(#b07a4f,#8d5c38)', gh:24,
    pet:{x:48, y:58, s:44, m:'bob', wear:[W.chef]},
    props:[{e:'🍳', x:18, y:84, s:34, z:3}, {e:'🥞', x:18, y:72, s:22, a:'flip', d:2.2, z:2},
      {e:'🍲', x:80, y:80, s:36, z:3}, {e:'🥄', x:62, y:72, s:20, a:'sway', d:1.4}],
    parts:[{c:'ts-puff', n:5, a:'steam', x:[74, 86], y:[70, 70], s:[10, 16], d:[2.2, 3], z:2}]
  },
  camping: {
    bg:'linear-gradient(#0d1530,#1d2a52 70%)', deco:['stars', 'fireglow'], ground:'linear-gradient(#21402d,#183222)', gh:26,
    pet:{x:46, y:72, s:38, m:'breathe'},
    props:[{e:'⛺', x:20, y:68, s:52, z:1}, {e:'🌲', x:4, y:60, s:40, z:0}, {e:'🌲', x:92, y:58, s:46, z:0},
      {e:'🔥', x:68, y:76, s:32, a:'flicker', d:.5, o:'50% 100%', z:3}, {e:'🌙', x:84, y:18, s:22, a:'float', d:5}],
    parts:[{c:'ts-ffly', n:8, a:'firefly', x:[8, 92], y:[30, 70], s:[5, 7], d:[3, 5]}]
  },
  superhero: {
    bg:'repeating-conic-gradient(from 0deg at 50% 50%,#4aa8ff 0 10deg,#62b7ff 10deg 20deg)', deco:['clouds'],
    pet:{x:50, y:54, s:44, m:'fly', wear:[W.cape]},
    props:[{c:'ts-burstbg', x:80, y:26, s:56, a:'pop', d:3, dl:-1.4, z:3}],
    text:{t:'POW!', x:80, y:26, s:20, a:'pop', d:3, dl:-1.4, cls:'ts-pow', z:4},
    parts:[{e:['💥'], n:1, a:'pop', x:[16, 22], y:[70, 78], s:[22, 22], d:[3, 3]}, {e:['✨'], n:3, a:'sparkle', x:[8, 60], y:[10, 40], s:[12, 14], d:[2, 3]}]
  },
  beach: {
    bg:'linear-gradient(#7fd3ff,#c6efff 55%)', deco:['waves'], ground:'linear-gradient(#f5dc9c,#eac57a)', gh:20,
    pet:{x:40, y:68, s:42, m:'bob', wear:[{e:'🕶️', x:-.02, y:-.08, s:.6}]},
    props:[{e:'☀️', x:86, y:18, s:34, a:'spin', d:12}, {e:'🌴', x:9, y:58, s:52, a:'sway', d:3.2, o:'50% 100%', z:1},
      {e:'🏐', x:70, y:72, s:22, a:'bounce', d:1.3, z:3}, {e:'🦀', x:0, y:90, s:16, a:'walk', d:16, z:4}],
    parts:[{e:['🕊️'], n:1, a:'driftL', y:[12, 18], s:[16, 16], d:[14, 14]}]
  },
  artist: {
    bg:'linear-gradient(#fffaf0,#f6ead6)', ground:'linear-gradient(#cdb08a,#b8976d)', gh:16,
    pet:{x:38, y:62, s:44, m:'bob', wear:[W.beret, {e:'🖌️', x:.6, y:.12, s:.45, a:'sway', r:-30}]},
    props:[{e:'🖼️', x:78, y:54, s:56, z:1}, {e:'🎨', x:14, y:80, s:32, a:'sway', d:2.8}],
    parts:[{c:'ts-splat', n:9, a:'pop', x:[6, 94], y:[8, 82], s:[12, 22], d:[3.5, 5], colors:['#ff5a6a', '#ffb347', '#ffd84d', '#4cc38a', '#4a8fe0', '#9b6bd6', '#ff7ac8']}]
  },
  robot: {
    bg:'linear-gradient(#5b6b80,#3b4757)', deco:['grid'], ground:'repeating-linear-gradient(90deg,#2b3440 0 10px,#323d4b 10px 20px)', gh:18,
    pet:{x:52, y:62, s:44, m:'robo', wear:[W.antenna]},
    props:[{e:'⚙️', x:12, y:26, s:40, a:'spin', d:5}, {e:'⚙️', x:24, y:46, s:26, a:'spinR', d:3.3}, {e:'⚙️', x:88, y:74, s:34, a:'spin', d:4.5},
      ...['#ff5a6a', '#ffd84d', '#4cd98a', '#4ab3ff'].map((c, i) => ({c:'ts-led', x:70 + i * 7, y:16, s:9, a:'blink', d:1 + i * .3, dl:-i * .25, v:{'--c':c}}))],
    text:{t:'BEEP BOOP', x:80, y:32, s:12, a:'blink', d:1.6, cls:'ts-mono'},
    parts:[{e:['⚡'], n:3, a:'sparkle', x:[30, 80], y:[30, 55], s:[12, 14], d:[1.6, 2.6]}]
  },
  royal: {
    bg:'radial-gradient(circle at 50% 30%,#a05bd6,#5a2a8a 75%)', deco:['curtains'], ground:'linear-gradient(#c6283d,#9b1c2e)', gh:18,
    pet:{x:50, y:66, s:46, m:'breathe', wear:[{e:'👑', x:0, y:-.6, s:.6, a:'drop', dl:.4, once:'wob'}]},
    props:[{e:'🎺', x:18, y:50, s:26, a:'sway', d:1.6, f:1}, {e:'🎺', x:82, y:50, s:26, a:'sway', d:1.6, dl:-.8}],
    parts:[{e:['✨', '💎', '⭐'], n:8, a:'sparkle', x:[6, 94], y:[8, 70], s:[10, 16], d:[1.8, 3]}]
  },
  twin: {
    bg:'linear-gradient(90deg,#ffc6d9 0 50%,#bdeee0 50% 100%)', ground:'linear-gradient(#f4e2c8,#e8d1b0)', gh:18,
    pet:{x:32, y:64, s:42, m:'mirror', wear:[{e:'🎀', x:.12, y:-.5, s:.4}]},
    pet2:{x:68, y:64, s:42, m:'mirror', f:1, wear:[{e:'🎀', x:.12, y:-.5, s:.4}]},
    props:[{e:'💞', x:50, y:34, s:22, a:'float', d:2.4}],
    parts:[{e:['✨'], n:6, a:'sparkle', x:[6, 94], y:[8, 60], s:[10, 14], d:[1.8, 3]}]
  },
  farm: {
    bg:'linear-gradient(#a8dcff,#dff3ff 60%)', deco:['fence'], ground:'linear-gradient(#9bd36f,#7fbf55)', gh:26,
    pet:{x:50, y:68, s:40, m:'hop', wear:[{e:'👒', x:.02, y:-.56, s:.58, r:-8}]},
    props:[{e:'☀️', x:12, y:16, s:28, a:'spin', d:14}, {e:'🌾', x:8, y:84, s:24, a:'sway', d:2.4, o:'50% 100%'}, {e:'🌾', x:92, y:84, s:24, a:'sway', d:2.4, dl:-1, o:'50% 100%'},
      {e:'🐄', x:0, y:72, s:34, a:'walk', d:16, dl:-4, z:1}, {e:'🐔', x:0, y:88, s:20, a:'walk', d:11, dl:-8, z:4}],
    parts:[{e:['☁️'], n:2, a:'drift', y:[8, 20], s:[18, 24], d:[20, 26], z:0}]
  },
  piDay: {
    bg:'linear-gradient(#24324f,#3c4f7a)',
    pet:{x:50, y:58, s:40, m:'popup', z:2},
    props:[{e:'🥧', x:50, y:84, s:56, z:3}],
    parts:[{e:['3', '.', '1', '4', '1', '5', '9', '2', '6', '5'], n:10, a:'rise', x:[6, 94], s:[14, 20], d:[4, 6], cls:'ts-chalk', seq:1},
      {e:['π'], n:3, a:'float', x:[12, 88], y:[14, 40], s:[22, 28], d:[2.6, 3.6], cls:'ts-chalk ts-gold'},
      {c:'ts-puff', n:3, a:'steam', x:[44, 56], y:[70, 70], s:[8, 12], d:[2.2, 3], z:2}]
  },
  earthDay: {
    bg:'linear-gradient(#6fc3ff,#b9e6ff 60%)', ground:'linear-gradient(#7cc95e,#5fae47)', gh:22,
    pet:{x:24, y:68, s:40, m:'bob', wear:[{e:'🌱', x:.04, y:-.56, s:.45}]},
    props:[{e:'🌍', x:62, y:46, s:58, a:'spin', d:16}, {e:'🌱', x:40, y:84, s:22, a:'grow', d:5, o:'50% 100%'},
      {e:'♻️', x:88, y:80, s:22, a:'spin', d:8}, {e:'🌳', x:90, y:60, s:34}],
    parts:[{e:['🍃', '🌿', '🌸'], n:7, a:'fall', x:[0, 100], s:[12, 18], d:[5, 8], v:{'--sx':'-70px'}}]
  },
  spaceDay: {
    bg:'radial-gradient(circle at 80% 20%,#3b2a7a 0 20%,transparent 50%),linear-gradient(#070b24,#1b1747)', deco:['stars'],
    pet:{x:62, y:58, s:40, m:'zerog', wear:[W.helmet]},
    props:[{e:'🪐', x:14, y:24, s:34, a:'float', d:4}, {e:'🌕', x:88, y:20, s:20, a:'float', d:5},
      {e:'🚀', x:0, y:100, s:30, a:'launch', d:5, dl:-1.6, z:4}],
    parts:[{c:'ts-streak', n:5, a:'streak', x:[50, 110], y:[0, 40], s:[30, 50], d:[1.4, 2.4]}]
  },
  pirateDay: {
    bg:'linear-gradient(#ffb36b,#ffd6a0 35%,#9fd6f0 60%)', deco:['waves'],
    pet:{x:46, y:54, s:40, m:'rock', wear:[{c:'ts-mast', x:-.62, y:-.5, s:1, z:-1}, {e:'🏴‍☠️', x:-.44, y:-1.12, s:.55, a:'sway', o:'0 100%'},
      {c:'ts-hull', x:0, y:.52, s:1, z:2}, {e:'🦜', x:.95, y:.05, s:.5}]},
    props:[{e:'☀️', x:86, y:14, s:26, a:'float', d:4}, {e:'🦈', x:0, y:88, s:20, a:'walk', d:13, dl:-3, z:5}],
    parts:[{e:['🪙', '✨'], n:4, a:'sparkle', x:[8, 92], y:[10, 40], s:[10, 14], d:[2, 3]}]
  },
  costumeDay: {
    bg:'radial-gradient(circle at 82% 22%,#fff3b0 0 8%,transparent 30%),linear-gradient(#2b1748,#6a2f68 70%,#b2532f)', ground:'linear-gradient(#2a1f2c,#1b141d)', gh:18,
    pet:{x:50, y:64, s:44, m:'bob', wear:[W.witch]},
    props:[{e:'🌕', x:82, y:22, s:28, a:'float', d:6}, {e:'🎃', x:14, y:80, s:30, a:'pulse', d:2}, {e:'🎃', x:86, y:82, s:26, a:'pulse', d:2, dl:-1},
      {e:'🎃', x:30, y:88, s:18, a:'pulse', d:2.4, dl:-.5}, {e:'👻', x:72, y:44, s:22, a:'float', d:3}],
    parts:[{e:['🦇'], n:4, a:'driftL', y:[10, 40], s:[14, 20], d:[7, 11], in:'flap'}]
  },
  hundredDay: {
    bg:'radial-gradient(circle at 50% 45%,#fff7c2 0 25%,#ffd36b 70%)', deco:['rays'],
    pet:{x:50, y:72, s:42, m:'bounce', wear:[W.party]},
    props:[{e:'💯', x:50, y:26, s:40, a:'pulse', d:1.6, z:4}, {e:'🎉', x:12, y:78, s:28, a:'sway', d:1.8}, {e:'🎉', x:88, y:78, s:28, a:'sway', d:1.8, dl:-.9, f:1}],
    parts:[{c:'ts-conf', n:18, a:'burst', x:[50, 50], y:[30, 30], s:[6, 9], d:[2.2, 3], burst:1, colors:['#ff5a6a', '#4a8fe0', '#4cc38a', '#ffd84d', '#9b6bd6', '#ff9a3c']}]
  }
};

/* a generic confetti scene for any id we don't know */
const GENERIC = {
  bg:'linear-gradient(#ffe3ef,#fff5d6)',
  pet:{x:50, y:64, s:46, m:'bounce', wear:[W.party]},
  props:[{e:'🎉', x:14, y:76, s:28, a:'sway', d:1.8}, {e:'🎉', x:86, y:76, s:28, a:'sway', d:1.8, dl:-.9, f:1}],
  parts:[{c:'ts-conf', n:14, a:'fall', x:[2, 98], s:[6, 9], d:[3, 5], colors:['#ff5a6a', '#4a8fe0', '#4cc38a', '#ffd84d', '#9b6bd6', '#ff9a3c']}]
};

/* ---------- markup ---------- */
function rng(seed){
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const pos = v => typeof v === 'number' ? `${v}%` : v;
const num = n => Math.round(n * 100) / 100;
const vars = v => v ? Object.entries(v).map(([k, val]) => `${k}:${val};`).join('') : '';

function anim(key, d, dl, iter = 'infinite'){
  const a = ANIMS[key]; if (!a || !a[0]) return '';
  const imp = iter === 'infinite' ? ' !important;animation-play-state:var(--ts-ps,running) !important' : '';
  return `animation:${a[0]} ${num(d ?? a[1])}s ${a[2] || 'ease-in-out'} ${num(dl ?? 0)}s ${iter} both${imp};`;
}
/* looping: start part-way through (negative delay) so reduced motion freezes on a real frame */
function loopAnim(key, d, dl){ const a = ANIMS[key]; const dur = d ?? (a ? a[1] : 2); return anim(key, dur, dl ?? -dur * .37); }

function item(p, esc, extraCls = ''){
  const inner = p.c ? '' : esc(p.e);
  const style = `font-size:${p.s || 24}px;${p.o ? `transform-origin:${p.o};` : ''}${p.r != null ? `--rot:${p.r}deg;` : ''}${vars(p.v)}${p.a ? loopAnim(p.a, p.d, p.dl) : ''}`;
  const body = p.in ? `<span class="ts-j" style="${loopAnim(p.in)}">${inner}</span>` : inner;
  return `<div class="ts-at${p.f ? ' ts-f' : ''}" style="left:${pos(p.x)};top:${pos(p.y)};z-index:${p.z ?? 2}"><div class="ts-i ${p.c || ''} ${p.cls || ''} ${extraCls}" style="${style}">${body}</div></div>`;
}

function wearHTML(w, esc){
  const anim1 = w.once ? `${anim(w.a, w.d, w.dl, 1)}` : (w.a ? loopAnim(w.a, w.d, w.dl) : '');
  const wob = w.once ? `animation:${ANIMS[w.a][0]} ${ANIMS[w.a][1]}s ${ANIMS[w.a][2]} ${w.dl || 0}s 1 both,${ANIMS[w.once][0]} ${ANIMS[w.once][1]}s ease-in-out ${num((w.dl || 0) + ANIMS[w.a][1])}s infinite;` : anim1;
  return `<span class="ts-w ${w.c || ''}${w.once ? ' ts-once' : ''}" style="left:calc(50% + ${w.x || 0}em);top:calc(50% + ${w.y || 0}em);font-size:${w.s || 1}em;z-index:${w.z ?? 1};--rot:${w.r || 0}deg;${w.o ? `transform-origin:${w.o};` : ''}${wob}">${w.c ? '' : esc(w.e)}</span>`;
}

function petHTML(p, pet, esc){
  const a = ANIMS[p.m] || ANIMS.bob;
  const dur = p.d ?? a[1];
  const dl = p.m === 'fly' || p.m === 'moonwalk' ? -dur * .5 : p.m === 'slide' ? -dur * .7 : -dur * .3;
  const wear = (p.wear || []).map(w => wearHTML(w, esc)).join('');
  return `<div class="ts-at${p.f ? ' ts-f' : ''}" style="left:${pos(p.x)};top:${pos(p.y)};z-index:${p.z ?? 3}"><div class="ts-i ts-pet" style="font-size:${p.s || 44}px;${a[0] ? anim(p.m, dur, dl) : ''}"><span class="ts-pe">${esc(pet)}</span>${wear}</div></div>`;
}

function partsHTML(g, r, esc){
  const pick = ([lo, hi]) => lo + (hi - lo) * r();
  let out = '';
  for (let i = 0; i < g.n; i++) {
    const d = pick(g.d || [3, 5]), e = g.e ? g.e[g.seq ? i % g.e.length : Math.floor(r() * g.e.length)] : '';
    const a = g.a, edge = a === 'fall' ? -8 : a === 'rise' || a === 'flutter' ? null : undefined;
    const x = a === 'drift' || a === 'driftL' ? 0 : g.burst ? 50 : num(pick(g.x || [4, 96]));
    const y = edge === -8 ? -8 : a === 'rise' && !g.y ? 104 : num(pick(g.y || [10, 80]));
    const v = {...(g.v || {})};
    if (a === 'fall' && !v['--sx']) v['--sx'] = `${Math.round(r() * 40 - 20)}px`;
    if (a === 'fall' || a === 'burst') v['--r'] = `${Math.round(r() * 720 - 360)}deg`;
    if (a === 'rise' || a === 'flutter') v['--sx'] = `${Math.round(r() * 30 - 15)}px`;
    if (g.burst) { const ang = (i / g.n) * TAU * Math.PI / 180 + r() * .3, len = 70 + r() * 70; v['--tx'] = `${Math.round(Math.cos(ang) * len)}px`; v['--ty'] = `${Math.round(Math.sin(ang) * len * .7 + 20)}px`; }
    if (g.colors) v['--c'] = g.colors[i % g.colors.length];
    if (g.hue) v.filter = `hue-rotate(${Math.round(r() * 360)}deg)`;
    if (g.c === 'ts-splat') v['--br'] = `${40 + Math.round(r() * 30)}% ${30 + Math.round(r() * 40)}% ${45 + Math.round(r() * 30)}% ${35 + Math.round(r() * 30)}%`;
    const s = num(pick(g.s || [14, 20]));
    out += item({e, c:g.c, cls:g.cls, x, y, s, a, d, dl:-d * r(), z:g.z ?? 2, v, in:g.in}, esc, 'ts-pt');
  }
  return out;
}

export function themeSceneHTML(id, pet, esc){
  const sc = THEME_SCENES[id] || GENERIC, r = rng(id || 'x');
  esc = esc || (s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c])));
  pet = pet || '🐾';
  const deco = (sc.deco || []).map(d => `<div class="ts-deco ts-d-${d}"></div>`).join('');
  const ground = sc.ground ? `<div class="ts-ground" style="height:${sc.gh || 22}%;background:${sc.ground}"></div>` : '';
  const props = (sc.props || []).map(p => item(p, esc)).join('');
  const parts = (sc.parts || []).map(g => partsHTML(g, r, esc)).join('');
  const t = sc.text;
  const text = t ? item({e:t.t, x:t.x, y:t.y, s:t.s, a:t.a, d:t.d, dl:t.dl, cls:`ts-txt ${t.cls || ''}`, z:t.z ?? 5}, esc) : '';
  const pets = petHTML(sc.pet, pet, esc) + (sc.pet2 ? petHTML(sc.pet2, pet, esc) : '');
  return `<div class="theme-scene ts-${esc(THEME_SCENES[id] ? id : 'generic')}" aria-hidden="true" style="background:${sc.bg}">${deco}${ground}${props}${pets}${parts}${text}</div>`;
}

/* ---------- styles ---------- */
const CSS = `
.theme-scene{position:relative; width:100%; max-width:300px; height:150px; margin:6px auto 8px; border-radius:16px; overflow:hidden;
  box-shadow:inset 0 0 0 2px rgba(0,0,0,.18), 0 3px 0 rgba(0,0,0,.25); isolation:isolate; line-height:1; text-align:left;
  -webkit-user-select:none; user-select:none; pointer-events:none; contain:paint}
.theme-scene .ts-at{position:absolute; width:0; height:0}
.theme-scene .ts-f{transform:scaleX(-1)}
.theme-scene .ts-i{position:absolute; left:0; top:0; translate:-50% -50%; white-space:nowrap; line-height:1; will-change:transform}
.theme-scene .ts-j{display:inline-block}
.theme-scene .ts-pet{display:block}
.theme-scene .ts-pe{display:block; position:relative; z-index:1; filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}
.theme-scene .ts-w{position:absolute; translate:-50% -50%; rotate:var(--rot,0deg); line-height:1}
.theme-scene .ts-ground{position:absolute; left:0; right:0; bottom:0; z-index:1; box-shadow:0 -2px 0 rgba(0,0,0,.12)}
.theme-scene .ts-deco{position:absolute; inset:0; z-index:0}
.theme-scene .ts-txt{font-weight:800; letter-spacing:.02em}
.theme-scene .ts-chalk{font-family:var(--chalkfont,'Comic Sans MS',cursive); color:#f4f1e6; text-shadow:0 2px 0 rgba(0,0,0,.35)}
.theme-scene .ts-gold{color:#ffd76a}
.theme-scene .ts-mono{font-family:ui-monospace,Menlo,Consolas,monospace; color:#7dffb0; text-shadow:0 0 6px #2bff8a}
.theme-scene .ts-pow{font-family:Impact,'Arial Black',var(--font),sans-serif; color:#ffe14d; font-style:italic;
  text-shadow:2px 2px 0 #d62839,-1px -1px 0 #d62839,1px -1px 0 #d62839,-1px 1px 0 #d62839,3px 3px 0 #1d1d1d}

/* decorations */
.theme-scene .ts-d-stars{background:
  radial-gradient(1.5px 1.5px at 12% 18%,#fff 98%,transparent),radial-gradient(1px 1px at 28% 40%,#fff 98%,transparent),
  radial-gradient(1.5px 1.5px at 44% 12%,#fff 98%,transparent),radial-gradient(1px 1px at 60% 34%,#fff 98%,transparent),
  radial-gradient(1.5px 1.5px at 72% 8%,#fff 98%,transparent),radial-gradient(1px 1px at 90% 44%,#fff 98%,transparent),
  radial-gradient(1px 1px at 6% 52%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 36% 60%,#fff 98%,transparent);
  animation:ts-twinkle 2.6s ease-in-out -1s infinite}
.theme-scene .ts-d-stars::after{content:""; position:absolute; inset:0; background:
  radial-gradient(1px 1px at 20% 30%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 52% 24%,#fff 98%,transparent),
  radial-gradient(1px 1px at 66% 54%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 82% 30%,#fff 98%,transparent),
  radial-gradient(1px 1px at 96% 12%,#fff 98%,transparent);
  animation:ts-twinkle 1.9s ease-in-out -.4s infinite}
.theme-scene .ts-d-rays{background:repeating-conic-gradient(from 0deg at 50% 110%,rgba(255,255,255,.14) 0 8deg,transparent 8deg 16deg)}
.theme-scene .ts-d-spot{background:radial-gradient(ellipse 40% 70% at 50% 75%,rgba(255,240,180,.35),transparent 70%); animation:ts-glow 2.4s ease-in-out -1s infinite}
.theme-scene .ts-d-fireglow{background:radial-gradient(circle at 68% 80%,rgba(255,150,60,.45),transparent 38%); animation:ts-glow 1.2s ease-in-out -.3s infinite}
.theme-scene .ts-d-grid{background:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px) 0 0/16px 16px,linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px) 0 0/16px 16px}
.theme-scene .ts-d-shelves{background:repeating-linear-gradient(#6b3f2a 0 34px,#4e2c1d 34px 38px); opacity:.6;
  -webkit-mask:linear-gradient(#000,transparent 70%); mask:linear-gradient(#000,transparent 70%)}
.theme-scene .ts-d-curtains{background:linear-gradient(90deg,#b8203a 0 9%,transparent 14% 86%,#b8203a 91%),
  repeating-linear-gradient(90deg,rgba(0,0,0,.15) 0 4px,transparent 4px 9px); -webkit-mask:linear-gradient(90deg,#000 0 14%,transparent 15% 85%,#000 86%); mask:linear-gradient(90deg,#000 0 14%,transparent 15% 85%,#000 86%)}
.theme-scene .ts-d-clouds{background:radial-gradient(ellipse 30px 12px at 20% 80%,#fff 95%,transparent),radial-gradient(ellipse 24px 10px at 26% 74%,#fff 95%,transparent),
  radial-gradient(ellipse 34px 12px at 78% 86%,#fff 95%,transparent),radial-gradient(ellipse 22px 10px at 72% 80%,#fff 95%,transparent);
  background-size:200% 100%; animation:ts-bgpan 6s linear infinite}
.theme-scene .ts-d-fence{top:auto; bottom:22%; height:26px; z-index:1;
  background:linear-gradient(transparent 6px,#fff 6px 10px,transparent 10px 16px,#fff 16px 20px,transparent 20px),
  repeating-linear-gradient(90deg,transparent 0 18px,#fff 18px 24px)}
.theme-scene .ts-d-waves{top:auto; height:30%; z-index:1; background:linear-gradient(#3fa7d6,#1f6fa8)}
.theme-scene .ts-d-waves::before,.theme-scene .ts-d-waves::after{content:""; position:absolute; left:-30px; right:-30px; top:-8px; height:16px;
  background:radial-gradient(circle at 15px 16px,#3fa7d6 11px,transparent 12px) 0 0/30px 16px repeat-x; animation:ts-waves 2.6s linear infinite}
.theme-scene .ts-d-waves::after{top:6px; background:radial-gradient(circle at 15px 16px,#2d8cc2 11px,transparent 12px) 0 0/30px 16px repeat-x; animation-duration:1.8s; animation-direction:reverse}
.theme-scene.ts-beach .ts-d-waves{height:34%; bottom:20%}
.theme-scene.ts-pirateDay .ts-d-waves{height:28%; z-index:4}
.theme-scene .ts-d-rainbow{inset:auto; left:50%; bottom:10%; translate:-50% 0; width:212px; height:106px; border-radius:106px 106px 0 0;
  background:radial-gradient(circle at 50% 100%,transparent 0 54px,#9b6bd6 54px 62px,#4a8fe0 62px 70px,#4cc38a 70px 78px,#ffd84d 78px 86px,#ff9a3c 86px 94px,#ff5a6a 94px 102px,transparent 102px);
  animation:ts-reveal 1.8s ease-out .2s 1 both}
.theme-scene .ts-d-hoop{inset:auto; right:28px; top:22px; width:44px; height:52px; z-index:4}
.theme-scene .ts-d-hoop::before{content:""; position:absolute; right:-14px; top:-14px; width:12px; height:46px; background:#fff; border:2px solid #c9d3dc; border-radius:3px}
.theme-scene .ts-d-hoop::after{content:""; position:absolute; left:2px; top:14px; width:40px; height:24px; border-top:4px solid #ff6a1f;
  background:repeating-linear-gradient(60deg,transparent 0 5px,rgba(255,255,255,.95) 5px 6.5px),repeating-linear-gradient(-60deg,transparent 0 5px,rgba(255,255,255,.95) 5px 6.5px);
  clip-path:polygon(0 0,100% 0,82% 100%,18% 100%)}

/* shapes */
.theme-scene .ts-pillow{width:2.2em; height:.5em; border-radius:.25em; background:#f2e9ff; box-shadow:inset 0 -4px 0 #cdbdf0}
.theme-scene .ts-cone{width:0; height:0; border-left:.26em solid transparent; border-right:.26em solid transparent; border-bottom:.62em solid var(--c,#4a8fe0); translate:-50% -60%}
.theme-scene .ts-cone::after{content:""; position:absolute; left:-.09em; top:-.12em; width:.18em; height:.18em; border-radius:50%; background:var(--pom,#fff)}
.theme-scene .ts-nightcap{--c:#6c8cff}
.theme-scene .ts-party{--c:#ff5a8a; --pom:#ffd84d}
.theme-scene .ts-witch{--c:#3b2350; --pom:transparent; border-bottom-width:.7em}
.theme-scene .ts-witch::before{content:""; position:absolute; left:-.5em; top:.62em; width:1em; height:.14em; border-radius:50%; background:#3b2350; box-shadow:0 -.06em 0 #8e44ad inset}
.theme-scene .ts-chef{width:.6em; height:.24em; background:#fff; border-radius:.04em; box-shadow:0 .03em 0 #ccc}
.theme-scene .ts-chef::before{content:""; position:absolute; left:.15em; top:-.26em; width:.3em; height:.3em; border-radius:50%; background:#fff; box-shadow:-.17em .06em 0 #fff,.17em .06em 0 #fff}
.theme-scene .ts-beret{width:.72em; height:.24em; border-radius:50% 50% 35% 35%; background:#d6304a; box-shadow:inset 0 -.04em 0 #a51f35}
.theme-scene .ts-beret::after{content:""; position:absolute; left:.33em; top:-.08em; width:.06em; height:.1em; background:#a51f35; border-radius:.03em}
.theme-scene .ts-helmet{width:1.42em; height:1.42em; border-radius:50%; border:.05em solid rgba(220,240,255,.9);
  background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.55) 0 .1em,transparent .14em),rgba(170,215,255,.16)}
.theme-scene .ts-ant{width:.05em; height:.34em; background:#b8c2cc; translate:-50% -80%}
.theme-scene .ts-ant::after{content:""; position:absolute; left:-.06em; top:-.1em; width:.17em; height:.17em; border-radius:50%; background:#ff4d5e; box-shadow:0 0 .12em #ff4d5e; animation:ts-blink 1s steps(1,end) infinite}
.theme-scene .ts-cape{width:.95em; height:.62em; background:linear-gradient(90deg,#d62839,#ff4f5e); translate:0 -50%; transform-origin:0 50%;
  clip-path:polygon(0 20%,100% 0,88% 30%,100% 55%,86% 75%,100% 100%,0 80%)}
.theme-scene .ts-mast{width:.07em; height:1.5em; background:#6b4226}
.theme-scene .ts-hull{width:2.1em; height:.6em; background:repeating-linear-gradient(#8b5a2b 0 .14em,#6e4420 .14em .18em); clip-path:polygon(0 0,100% 0,84% 100%,16% 100%)}
.theme-scene .ts-puff{width:1em; height:1em; border-radius:50%; background:rgba(255,255,255,.85); filter:blur(1.5px)}
.theme-scene .ts-ffly{width:1em; height:1em; border-radius:50%; background:#fff59a; box-shadow:0 0 6px 3px rgba(255,240,120,.7)}
.theme-scene .ts-conf{width:1em; height:1.6em; background:var(--c); border-radius:1px}
.theme-scene .ts-splat{width:1em; height:1em; background:var(--c); border-radius:var(--br,50%); box-shadow:.35em .2em 0 -.3em var(--c),-.3em -.25em 0 -.32em var(--c)}
.theme-scene .ts-led{width:1em; height:1em; border-radius:50%; background:var(--c); box-shadow:0 0 6px var(--c)}
.theme-scene .ts-streak{width:1em; height:2px; background:linear-gradient(90deg,#fff,transparent); border-radius:2px}
.theme-scene .ts-burstbg{width:1em; height:.8em; background:#fff; clip-path:polygon(50% 0,60% 28%,90% 8%,76% 38%,100% 50%,74% 62%,92% 92%,60% 74%,50% 100%,40% 74%,8% 92%,26% 62%,0 50%,24% 38%,10% 8%,40% 28%)}

/* motions */
@keyframes ts-float{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-7px) rotate(4deg)}}
@keyframes ts-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ts-hop{0%,100%{transform:translateY(0) scale(1.04,.96)}15%{transform:translateY(0) scale(1)}45%{transform:translateY(-12px) scale(.98,1.02)}75%{transform:translateY(0) scale(1)}}
@keyframes ts-bounce{0%,100%{transform:translateY(0) scale(1.1,.9)}12%{transform:translateY(0) scale(1)}50%{transform:translateY(-26px) scale(.96,1.04)}88%{transform:translateY(0) scale(1)}}
@keyframes ts-fall{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(var(--sx,0px),190px) rotate(var(--r,180deg))}}
@keyframes ts-rise{0%{transform:translate(0,0) scale(.6); opacity:0}15%{opacity:1; transform:translate(calc(var(--sx,0px)*-1),calc(var(--h,-160px)*.15)) scale(1)}
  50%{transform:translate(var(--sx,0px),calc(var(--h,-160px)*.5)) scale(1)}85%{opacity:1}100%{transform:translate(0,var(--h,-160px)) scale(1.05); opacity:0}}
@keyframes ts-flutter{0%{transform:translate(0,0) rotateY(0) rotate(0); opacity:0}15%{opacity:1}100%{transform:translate(calc(var(--sx,0px)*4),-120px) rotateY(720deg) rotate(40deg); opacity:0}}
@keyframes ts-drift{0%{transform:translate(-40px,0)}50%{transform:translate(150px,-4px)}100%{transform:translate(340px,0)}}
@keyframes ts-driftL{0%{transform:translate(340px,0)}50%{transform:translate(150px,6px)}100%{transform:translate(-40px,0)}}
@keyframes ts-walk{0%{transform:translate(340px,0) rotate(0)}6.25%{transform:translate(315px,-3px) rotate(-5deg)}12.5%{transform:translate(290px,0) rotate(0)}18.75%{transform:translate(265px,-3px) rotate(5deg)}
  25%{transform:translate(240px,0) rotate(0)}31.25%{transform:translate(215px,-3px) rotate(-5deg)}37.5%{transform:translate(190px,0) rotate(0)}43.75%{transform:translate(165px,-3px) rotate(5deg)}
  50%{transform:translate(140px,0) rotate(0)}56.25%{transform:translate(115px,-3px) rotate(-5deg)}62.5%{transform:translate(90px,0) rotate(0)}68.75%{transform:translate(65px,-3px) rotate(5deg)}
  75%{transform:translate(40px,0) rotate(0)}81.25%{transform:translate(15px,-3px) rotate(-5deg)}87.5%{transform:translate(-10px,0) rotate(0)}93.75%{transform:translate(-35px,-3px) rotate(5deg)}100%{transform:translate(-60px,0) rotate(0)}}
@keyframes ts-orbit{0%{transform:rotate(0) translateX(var(--rad,30px)) rotate(0)}100%{transform:rotate(360deg) translateX(var(--rad,30px)) rotate(-360deg)}}
@keyframes ts-sparkle{0%,100%{transform:scale(0) rotate(0); opacity:0}50%{transform:scale(1) rotate(90deg); opacity:1}}
@keyframes ts-twinkle{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes ts-spin{to{transform:rotate(360deg)}}
@keyframes ts-spinR{to{transform:rotate(-360deg)}}
@keyframes ts-sway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes ts-wob{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes ts-rock{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(6deg) translateY(-4px)}}
@keyframes ts-flicker{0%,100%{transform:scale(1,1); opacity:1}25%{transform:scale(1.07,.9); opacity:.9}50%{transform:scale(.94,1.1)}75%{transform:scale(1.04,.95); opacity:.95}}
@keyframes ts-blink{0%,49%{opacity:1}50%,100%{opacity:.2}}
@keyframes ts-pulse{0%,100%{transform:scale(1); filter:drop-shadow(0 0 2px rgba(255,160,40,.6))}50%{transform:scale(1.12); filter:drop-shadow(0 0 10px rgba(255,160,40,.95))}}
@keyframes ts-glow{0%,100%{opacity:.65}50%{opacity:1}}
@keyframes ts-pop{0%{transform:scale(0) rotate(-12deg); opacity:0}10%{transform:scale(1.25) rotate(6deg); opacity:1}18%{transform:scale(1) rotate(0)}80%{transform:scale(1); opacity:1}100%{transform:scale(.85); opacity:0}}
@keyframes ts-flip{0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-40px) rotate(200deg)}70%{transform:translateY(0) rotate(360deg)}}
@keyframes ts-steam{0%{transform:translate(0,0) scale(.5); opacity:0}20%{opacity:.85}60%{transform:translate(6px,-34px) scale(1.2)}100%{transform:translate(-4px,-60px) scale(1.7); opacity:0}}
@keyframes ts-sweep{0%,100%{transform:translate(-40px,8px) rotate(-12deg)}25%{transform:translate(0,-12px) rotate(4deg)}50%{transform:translate(70px,6px) rotate(14deg)}75%{transform:translate(20px,18px) rotate(0)}}
@keyframes ts-launch{0%{transform:translate(-40px,30px) rotate(18deg) scale(.8); opacity:0}10%{opacity:1}75%{transform:translate(330px,-170px) rotate(18deg) scale(1); opacity:1}100%{transform:translate(330px,-170px) rotate(18deg); opacity:0}}
@keyframes ts-streak{0%{transform:translate(0,0) rotate(-26.6deg); opacity:0}15%{opacity:1}100%{transform:translate(-220px,110px) rotate(-26.6deg); opacity:0}}
@keyframes ts-grow{0%{transform:scale(0)}30%{transform:scale(1.15)}40%,85%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes ts-swish{0%{transform:translate(0,0) scale(1); opacity:1}10%{transform:translate(0,-8px)}45%{transform:translate(75px,-62px) rotate(200deg)}66%{transform:translate(124px,-26px) rotate(320deg) scale(.9)}
  78%{transform:translate(124px,8px) rotate(360deg) scale(.9); opacity:1}86%,100%{transform:translate(124px,40px) scale(.8); opacity:0}}
@keyframes ts-drop{0%{transform:translateY(-160px) rotate(0)}70%{transform:translateY(0) scale(1.15,.8)}85%{transform:translateY(-8px) scale(.95,1.05)}100%{transform:translateY(0) scale(1)}}
@keyframes ts-step{0%{opacity:0; transform:scale(.5)}8%{opacity:1; transform:scale(1.1)}14%,60%{opacity:1; transform:scale(1)}80%,100%{opacity:0}}
@keyframes ts-burst{0%{transform:translate(0,0) scale(.3) rotate(0); opacity:1}70%{opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(1) rotate(var(--r,180deg)); opacity:0}}
@keyframes ts-ffly{0%,100%{transform:translate(0,0); opacity:.2}25%{transform:translate(10px,-8px); opacity:1}50%{transform:translate(-6px,-14px); opacity:.35}75%{transform:translate(-12px,-2px); opacity:1}}
@keyframes ts-cape{0%,100%{transform:skewY(0) scaleX(1)}50%{transform:skewY(-10deg) scaleX(1.12)}}
@keyframes ts-reveal{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
@keyframes ts-waves{to{transform:translateX(30px)}}
@keyframes ts-bgpan{to{background-position:-200% 0}}
@keyframes ts-flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.55)}}
@keyframes ts-sleep{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(-6deg) scale(1.05,.96)}}
@keyframes ts-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes ts-fly{0%{transform:translate(190px,10px) rotate(-6deg)}20%{transform:translate(70px,-14px) rotate(-10deg)}35%,50%{transform:translate(0,4px) rotate(-4deg)}42%{transform:translate(0,-6px) rotate(-8deg)}70%{transform:translate(-80px,-12px) rotate(-10deg)}100%{transform:translate(-190px,6px) rotate(-6deg)}}
@keyframes ts-moonwalk{0%{transform:translate(-64px,0) scaleX(1)}11%{transform:translate(-32px,-4px) scaleX(1)}22%{transform:translate(0,0) scaleX(1)}33%{transform:translate(32px,-4px) scaleX(1)}44%{transform:translate(64px,0) scaleX(1)}
  50%{transform:translate(64px,-10px) scaleX(-1) rotate(10deg)}56%{transform:translate(64px,0) scaleX(-1)}67%{transform:translate(32px,-4px) scaleX(-1)}78%{transform:translate(0,0) scaleX(-1)}89%{transform:translate(-32px,-4px) scaleX(-1)}
  94%{transform:translate(-64px,0) scaleX(-1)}97%{transform:translate(-64px,-10px) scaleX(1) rotate(-10deg)}100%{transform:translate(-64px,0) scaleX(1)}}
@keyframes ts-pspin{0%{transform:translateY(0) rotate(0)}30%{transform:translateY(-20px) rotate(0)}60%{transform:translateY(-20px) rotate(360deg)}80%,100%{transform:translateY(0) rotate(360deg)}}
@keyframes ts-mirror{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(0) rotate(-14deg)}50%{transform:translateY(-14px) rotate(0)}75%{transform:translateY(0) rotate(14deg)}}
@keyframes ts-robo{0%{transform:rotate(0)}25%{transform:rotate(-10deg)}50%{transform:translateY(-5px) rotate(0)}75%{transform:rotate(10deg)}100%{transform:rotate(0)}}
@keyframes ts-popup{0%,100%{transform:translateY(34px) scale(.9)}25%{transform:translateY(-10px) scale(1.05)}33%,78%{transform:translateY(0) scale(1)}}
@keyframes ts-zerog{0%{transform:translate(0,0) rotate(-10deg)}25%{transform:translate(-10px,-8px) rotate(8deg)}50%{transform:translate(4px,-14px) rotate(20deg)}75%{transform:translate(10px,-4px) rotate(0)}100%{transform:translate(0,0) rotate(-10deg)}}
@keyframes ts-slide{0%{transform:rotate(-78deg) translateY(-118px) rotate(78deg); opacity:0}6%{opacity:1}
  22%{transform:rotate(-8deg) translateY(-118px) rotate(8deg)}26%{transform:rotate(-4deg) translateY(-130px) rotate(0)}30%{transform:rotate(0) translateY(-118px) rotate(0)}
  42%{transform:rotate(30deg) translateY(-118px) rotate(-10deg)}54%{transform:rotate(62deg) translateY(-118px) rotate(-20deg)}62%{transform:rotate(80deg) translateY(-118px) rotate(-40deg)}
  70%{transform:translate(128px,-26px) rotate(-10deg)}78%{transform:translate(128px,-8px) rotate(0); opacity:1}92%{transform:translate(128px,-8px); opacity:1}100%{transform:translate(128px,-8px); opacity:0}}

@media (prefers-reduced-motion: reduce){
  /* game.css turns every animation off here; looping scene parts keep theirs (inline !important) but freeze on a
     mid-motion frame, and one-shot drops just sit where they land */
  .theme-scene{--ts-ps:paused}
  .theme-scene .ts-once, .theme-scene .ts-d-rainbow{animation:none !important}
}
`;

export function addThemeSceneCSS(){
  if (typeof document === 'undefined' || document.getElementById('theme-scene-css')) return;
  const st = document.createElement('style'); st.id = 'theme-scene-css'; st.textContent = CSS;
  document.head.appendChild(st);
}
