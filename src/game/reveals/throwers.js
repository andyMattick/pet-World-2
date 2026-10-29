/* 🎯 🎈 🔻 🎰 the "throw / drop / pull" reveal styles: darts, balloons, plinko, slots.
   Each one only puts on a show: it always lands on round.picks, in order (see the top of index.js). The only
   randomness here is cosmetic (where in the right wedge a dart sticks, which way confetti flies, a plinko chip's
   zigzag) and never changes which class shows. */

const COLORS = ['#ff8fa3', '#7fd1b9', '#ffd76a', '#9cc3f5', '#c9a7f0', '#ffb37a', '#8fe0e0', '#e8e27a'];
const BALLOON_COLORS = ['#ff6b8b', '#4fc3f7', '#ffd54f', '#81c784', '#ba68c8', '#ff9f43', '#4dd0e1', '#f06292'];
const rand = (a, b) => a + Math.random() * (b - a);   // cosmetic only
const deg = r => r * 180 / Math.PI;

/* where an element's center sits inside the stage, in stage pixels */
function centerIn(stage, el){
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
  return {x:r.left - s.left + r.width / 2, y:r.top - s.top + r.height / 2, w:r.width, h:r.height};
}
/* a little CSS dart (tip at the element's top-center, pointing up) */
const dartCSS = id => `
.reveal-${id} .${id}-dart{position:absolute; left:-7px; top:0; width:14px; height:42px; transform-origin:50% 0; pointer-events:none; filter:drop-shadow(0 2px 2px rgba(0,0,0,.45)); z-index:5}
.reveal-${id} .${id}-dart i{display:block; width:100%; height:100%; background:linear-gradient(#f2f2f2 0 22%, #e4577a 22% 66%, #ffd76a 66%);
  clip-path:polygon(50% 0, 64% 22%, 58% 22%, 58% 64%, 100% 84%, 100% 100%, 50% 90%, 0 100%, 0 84%, 42% 64%, 42% 22%, 36% 22%)}
`;
const dartAt = (x, y, rot, s) => `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s})`;

/* ───────────────────────── 🎯 darts ───────────────────────── */
function boardBG(n, hits){
  const seg = 360 / n;
  return `conic-gradient(${Array.from({length:n}, (_, i) => `${hits.has(i) ? '#fffdf0' : COLORS[i % COLORS.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(', ')})`;
}

export const darts = {
  id:'darts', title:'🎯 Throw darts for today\'s classes!',
  css:dartCSS('darts') + `
.reveal-darts{height:282px}
.reveal-darts .darts-wrap{position:absolute; left:50%; top:6px; width:214px; height:214px; margin-left:-107px; border-radius:50%; background:#2b2b2b; padding:7px;
  box-shadow:0 6px 14px rgba(0,0,0,.4), inset 0 0 0 3px #555}
.reveal-darts .darts-board{position:relative; width:200px; height:200px; border-radius:50%; will-change:transform}
.reveal-darts .darts-rings{position:absolute; inset:0; border-radius:50%; pointer-events:none;
  background:radial-gradient(circle, transparent 0 30px, rgba(0,0,0,.18) 30px 33px, transparent 33px 74px, rgba(0,0,0,.14) 74px 76px, transparent 76px 91px, rgba(255,255,255,.35) 91px 93px, transparent 93px)}
.reveal-darts .darts-line{position:absolute; left:50%; top:0; width:2px; height:50%; margin-left:-1px; background:rgba(0,0,0,.25); transform-origin:50% 100%}
.reveal-darts .darts-label{position:absolute; left:50%; top:50%; width:72px; margin:-.75em 0 0 -36px; font-size:.7rem; font-weight:800; line-height:1.1;
  text-align:center; color:#3b2a2a; pointer-events:none; text-shadow:0 1px 0 rgba(255,255,255,.6); transition:font-size .2s}
.reveal-darts .darts-label.hit b{display:inline-block; background:#fff; border-radius:8px; padding:1px 4px; box-shadow:0 1px 4px rgba(0,0,0,.35); animation:reveal-pop .45s ease-out}
.reveal-darts .darts-label b{font-weight:inherit}
.reveal-darts .darts-bull{position:absolute; left:50%; top:50%; width:22px; height:22px; margin:-11px 0 0 -11px; border-radius:50%;
  background:radial-gradient(circle, #e4577a 0 5px, #fff 5px 6px, #2f9e6e 6px); box-shadow:0 0 0 2px #fff; z-index:2}
.reveal-darts .darts-pet{position:absolute; left:50%; bottom:2px; width:48px; margin-left:-24px; font-size:2.3rem; line-height:1; text-align:center; z-index:4}
.reveal-darts .darts-pet.windup{animation:darts-windup .32s ease-in-out}
.reveal-darts .darts-wrap.thud{animation:reveal-shake .18s linear 2}
@keyframes darts-windup{0%,100%{transform:translateY(0) rotate(0)} 45%{transform:translateY(6px) rotate(-14deg)} 75%{transform:translateY(-6px) rotate(10deg)}}
`,
  async run(stage, round, ctx){
    const n = round.labels.length, seg = 360 / n, hits = new Set();
    stage.innerHTML = `<div class="darts-wrap"><div class="darts-board" style="background:${boardBG(n, hits)}">
      ${Array.from({length:n}, (_, i) => `<span class="darts-line" style="transform:rotate(${i * seg}deg)"></span>`).join('')}
      <span class="darts-rings"></span>
      ${round.labels.map((t, i) => `<span class="darts-label" data-seg="${i}"><b>${ctx.esc(t)}</b></span>`).join('')}
    </div><span class="darts-bull"></span></div><div class="darts-pet">${ctx.esc(ctx.pet)}</div>`;
    const wrap = stage.querySelector('.darts-wrap'), board = stage.querySelector('.darts-board'), pet = stage.querySelector('.darts-pet');
    const labels = [...stage.querySelectorAll('.darts-label')];
    /* the board's angle is a pure function of time, so a throw can aim where the wedge WILL be */
    const speed = ctx.quick ? 0 : 38, t0 = performance.now();
    const angleAt = t => ((t - t0) / 1000) * speed;
    let spinning = true;
    const paint = th => {
      board.style.transform = `rotate(${th}deg)`;
      labels.forEach((l, i) => { const a = (i + .5) * seg; l.style.transform = `rotate(${a}deg) translateY(-47px) rotate(${-a - th}deg)`; });
    };
    const frame = () => { if (!spinning) return; paint(angleAt(performance.now())); requestAnimationFrame(frame); };
    frame();

    ctx.hint(`${ctx.pet} is ready to throw!`);
    if (ctx.first) await ctx.button('Throw! 🎯'); else await ctx.wait(500);
    ctx.hint('');
    for (const [k, i] of round.picks.entries()) {
      pet.classList.remove('windup'); void pet.offsetWidth; pet.classList.add('windup');
      await ctx.wait(ctx.quick ? 120 : 300);
      const flight = ctx.quick ? 280 : 560;
      const local = (i + .5) * seg + rand(-.22, .22) * seg, r = rand(86, 91);
      const hitAngle = local + angleAt(performance.now() + flight);       // where that spot will be at impact
      const c = centerIn(stage, board), p = centerIn(stage, pet);
      const tx = c.x + r * Math.sin(hitAngle * Math.PI / 180), ty = c.y - r * Math.cos(hitAngle * Math.PI / 180);
      const sx = p.x, sy = p.y - 22, rot = deg(Math.atan2(tx - sx, -(ty - sy)));
      const dart = document.createElement('div'); dart.className = 'darts-dart'; dart.innerHTML = '<i></i>';
      stage.appendChild(dart); ctx.sfx('tick');
      await dart.animate([
        {transform:dartAt(sx, sy, rot - 8, 1.15)},
        {transform:dartAt((sx + tx) / 2, (sy + ty) / 2 - 18, rot, .9), offset:.55},
        {transform:dartAt(tx, ty, rot, .62)}
      ], {duration:flight, easing:'cubic-bezier(.3,.1,.6,1)', fill:'forwards'}).finished;
      /* stick it to the board (in board coordinates, so it spins along), clamped inside the wedge */
      const th = angleAt(performance.now());
      let a = ((tx - c.x) || (ty - c.y)) ? deg(Math.atan2(tx - c.x, -(ty - c.y))) - th : local;
      a = ((a % 360) + 360) % 360;
      if (a < i * seg + 4 || a > (i + 1) * seg - 4) a = local;
      dart.remove();
      const stuck = document.createElement('div'); stuck.className = 'darts-dart';
      stuck.innerHTML = '<i></i>';
      stuck.style.left = `${100 + r * Math.sin(a * Math.PI / 180) - 7}px`; stuck.style.top = `${100 - r * Math.cos(a * Math.PI / 180)}px`;
      stuck.style.transform = `rotate(${rot - th}deg) scale(.62)`;
      board.appendChild(stuck);
      stuck.animate([{transform:`rotate(${rot - th - 9}deg) scale(.62)`}, {transform:`rotate(${rot - th + 6}deg) scale(.62)`}, {transform:`rotate(${rot - th}deg) scale(.62)`}], {duration:260});
      wrap.classList.remove('thud'); void wrap.offsetWidth; wrap.classList.add('thud');
      hits.add(i); board.style.background = boardBG(n, hits);
      labels[i].classList.add('hit');
      ctx.sfx('coin'); ctx.reveal(i);
      await ctx.wait(k === round.picks.length - 1 ? 700 : 750);
    }
    ctx.sfx('good');
    await ctx.wait(400);
    spinning = false;
  }
};

/* ───────────────────────── 🎈 balloons ───────────────────────── */
export const balloons = {
  id:'balloons', title:'🎈 Pop a balloon!',
  css:dartCSS('balloons') + `
.reveal-balloons{height:244px; overflow:hidden; border-radius:12px; background:linear-gradient(#3f6a8f00, rgba(140,200,255,.12))}
.reveal-balloons .balloons-wall{display:flex; flex-wrap:wrap; justify-content:center; gap:8px 6px; padding:22px 4px 0}
.reveal-balloons .balloons-b{position:relative; width:var(--w, 66px); height:132px; padding:0; border:0; background:none; cursor:pointer; color:inherit;
  animation:balloons-bob 2.4s ease-in-out var(--d, 0s) infinite; -webkit-tap-highlight-color:transparent}
.reveal-balloons .balloons-b:focus-visible{outline:3px solid #fff; outline-offset:2px; border-radius:12px}
.reveal-balloons .balloons-body{position:absolute; left:50%; top:4px; width:56px; height:68px; margin-left:-28px; border-radius:50% 50% 47% 47% / 56% 56% 44% 44%;
  background:radial-gradient(circle at 33% 28%, rgba(255,255,255,.75) 0 7px, rgba(255,255,255,0) 15px), radial-gradient(circle at 60% 70%, rgba(0,0,0,0), rgba(0,0,0,.18) 80%), var(--c);
  box-shadow:0 4px 8px rgba(0,0,0,.3); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.3rem; color:rgba(255,255,255,.85); text-shadow:0 1px 2px rgba(0,0,0,.3)}
.reveal-balloons .balloons-body::after{content:""; position:absolute; left:50%; bottom:-6px; margin-left:-5px; border:5px solid transparent; border-bottom:7px solid var(--c); transform:rotate(180deg) translateY(-1px)}
.reveal-balloons .balloons-str{position:absolute; left:50%; top:78px; width:2px; height:48px; margin-left:-1px; background:linear-gradient(rgba(255,255,255,.8), rgba(255,255,255,.2)); border-radius:2px; transform-origin:50% 0; animation:balloons-sway 1.8s ease-in-out var(--d, 0s) infinite}
.reveal-balloons .balloons-b:hover:not([data-done]) .balloons-body{filter:brightness(1.08)}
.reveal-balloons .balloons-b:active:not([data-done]) .balloons-body{transform:scale(.94)}
.reveal-balloons .balloons-b[data-done]{cursor:default; animation:none}
.reveal-balloons .balloons-tag{position:absolute; left:50%; top:26px; transform:translateX(-50%); width:max-content; max-width:86px; white-space:normal; text-align:center; font-size:.76rem; z-index:3}
.reveal-balloons .balloons-tag b{display:block; animation:reveal-pop .45s ease-out}
.reveal-balloons .balloons-boom{position:absolute; left:50%; top:38px; transform:translate(-50%, -50%); font-size:2.4rem; pointer-events:none; z-index:4; animation:balloons-boom .45s ease-out forwards}
.reveal-balloons .balloons-bit{position:absolute; width:7px; height:10px; border-radius:2px; pointer-events:none; z-index:4}
.reveal-balloons .balloons-pet{position:absolute; left:50%; bottom:4px; width:48px; margin-left:-24px; font-size:2.2rem; line-height:1; text-align:center}
.reveal-balloons .balloons-pet.windup{animation:balloons-windup .3s ease-in-out}
.reveal-balloons .balloons-b.away{animation:balloons-away 1.6s ease-in forwards; pointer-events:none}
.reveal-balloons.many .balloons-b{height:112px}
.reveal-balloons.many .balloons-body{width:46px; height:56px; margin-left:-23px}
.reveal-balloons.many .balloons-str{top:64px; height:40px}
@keyframes balloons-bob{0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}}
@keyframes balloons-sway{0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)}}
@keyframes balloons-boom{0%{transform:translate(-50%, -50%) scale(.3); opacity:1} 60%{transform:translate(-50%, -50%) scale(1.35); opacity:1} 100%{transform:translate(-50%, -50%) scale(1.6); opacity:0}}
@keyframes balloons-away{0%{transform:translateY(0) rotate(0); opacity:1} 100%{transform:translateY(-260px) rotate(var(--tilt, 8deg)); opacity:0}}
@keyframes balloons-windup{0%,100%{transform:translateY(0) rotate(0)} 45%{transform:translateY(6px) rotate(-14deg)} 75%{transform:translateY(-6px) rotate(10deg)}}
`,
  run(stage, round, ctx){
    const L = round.labels.length, many = L > 5;
    if (many) stage.classList.add('many');
    const w = Math.max(48, Math.min(76, Math.floor(296 / Math.min(L, many ? Math.ceil(L / 2) : L)) - 6));
    stage.innerHTML = `<div class="balloons-wall">${round.labels.map((_, k) => `<button type="button" class="balloons-b" data-tap aria-label="Balloon ${k + 1}" style="--c:${BALLOON_COLORS[k % BALLOON_COLORS.length]}; --d:${(k * .37) % 1.2}s; --w:${w}px; --tilt:${k % 2 ? -12 : 12}deg"><span class="balloons-body">?</span><span class="balloons-str"></span></button>`).join('')}</div><div class="balloons-pet">${ctx.esc(ctx.pet)}</div>`;
    const pet = stage.querySelector('.balloons-pet'), all = [...stage.querySelectorAll('.balloons-b')];
    const left = () => round.picks.length - n;
    let n = 0, busy = false;
    const say = () => ctx.hint(left() === 1 ? 'Tap a balloon to pop it! 🎈' : `Tap a balloon to pop it! 🎈 (${left()} to go)`);
    say();
    return new Promise(done => {
      stage.addEventListener('click', async e => {
        const b = e.target.closest('.balloons-b');
        if (!b || busy || b.hasAttribute('data-done') || n >= round.picks.length) return;
        busy = true; b.setAttribute('data-done', ''); b.setAttribute('aria-disabled', 'true');
        const pick = round.picks[n++];
        /* her pet throws a pin */
        pet.classList.remove('windup'); void pet.offsetWidth; pet.classList.add('windup');
        const body = b.querySelector('.balloons-body'), t = centerIn(stage, body), p = centerIn(stage, pet);
        const sx = p.x, sy = p.y - 20, tx = t.x, ty = t.y + 8, rot = deg(Math.atan2(tx - sx, -(ty - sy)));
        const pin = document.createElement('div'); pin.className = 'balloons-dart'; pin.innerHTML = '<i></i>';
        stage.appendChild(pin); ctx.sfx('tick');
        await pin.animate([{transform:dartAt(sx, sy, rot, .9)}, {transform:dartAt(tx, ty, rot, .7)}],
          {duration:ctx.quick ? 160 : 380, easing:'cubic-bezier(.4,.1,.7,1)', fill:'forwards'}).finished;
        pin.remove();
        /* pop! */
        body.animate([{transform:'scale(1)', opacity:1}, {transform:'scale(1.35)', opacity:0}], {duration:120, fill:'forwards'});
        b.querySelector('.balloons-str').animate([{transform:'translateY(0)', opacity:1}, {transform:'translateY(50px)', opacity:0}], {duration:500, easing:'ease-in', fill:'forwards'});
        b.insertAdjacentHTML('beforeend', `<span class="balloons-boom" aria-hidden="true">💥</span>`);
        if (!ctx.quick) for (let k = 0; k < 14; k++) {
          const bit = document.createElement('span'); bit.className = 'balloons-bit';
          bit.style.left = `${t.x - 3}px`; bit.style.top = `${t.y - 5}px`;
          bit.style.background = k % 3 ? BALLOON_COLORS[(k * 3) % BALLOON_COLORS.length] : body.parentElement.style.getPropertyValue('--c');
          stage.appendChild(bit);
          const a = rand(0, Math.PI * 2), d = rand(30, 70);
          bit.animate([{transform:'translate(0,0) rotate(0)', opacity:1},
            {transform:`translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 30}px) rotate(${rand(-400, 400)}deg)`, opacity:0}],
            {duration:rand(600, 900), easing:'cubic-bezier(.2,.7,.4,1)', fill:'forwards'}).finished.then(() => bit.remove());
        }
        ctx.sfx('coin');
        await ctx.wait(140);
        b.insertAdjacentHTML('beforeend', `<span class="reveal-tag balloons-tag"><b>${ctx.esc(round.labels[pick])}</b></span>`);
        ctx.reveal(pick);
        await ctx.wait(450);
        if (n < round.picks.length) { busy = false; say(); return; }
        /* all picked: the rest float away */
        ctx.hint('');
        all.forEach(o => {
          if (o.hasAttribute('data-done')) return;
          o.setAttribute('data-done', ''); o.disabled = true; o.classList.add('away');
        });
        ctx.sfx('good');
        await ctx.wait(1100);
        done();
      });
    });
  }
};

/* ───────────────────────── 🔻 plinko ───────────────────────── */
export const plinko = {
  id:'plinko', title:'🔻 Drop the Plinko chip!',
  css:`
.reveal-plinko{height:258px}
.reveal-plinko .plinko-board{position:relative; margin:0 auto; height:254px; border-radius:14px; overflow:hidden;
  background:radial-gradient(circle at 50% 0, #4a3b8f, #2b2350 75%); box-shadow:inset 0 0 0 3px #ffd76a, 0 6px 14px rgba(0,0,0,.35)}
.reveal-plinko .plinko-peg{position:absolute; width:7px; height:7px; margin:-3.5px 0 0 -3.5px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #fff, #c9c3e8); box-shadow:0 1px 2px rgba(0,0,0,.5)}
.reveal-plinko .plinko-peg.ping{animation:plinko-ping .35s ease-out}
.reveal-plinko .plinko-slot{position:absolute; bottom:0; height:76px; display:flex; align-items:flex-end; justify-content:center; padding:0 2px 5px;
  border-left:3px solid #ffd76a; background:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08)); transition:background .3s}
.reveal-plinko .plinko-slot:first-of-type{border-left:0}
.reveal-plinko .plinko-slot span{display:block; font-size:.72rem; font-weight:800; line-height:1.1; color:#f4f1e6; text-align:center; overflow-wrap:anywhere}
.reveal-plinko .plinko-slot.lit{background:linear-gradient(rgba(255,215,106,.3), #ffd76a 70%); box-shadow:inset 0 0 14px #ffd76a}
.reveal-plinko .plinko-slot.lit span{color:#3b2a2a; animation:reveal-pop .45s ease-out}
.reveal-plinko .plinko-chip{position:absolute; left:0; top:0; border-radius:50%; display:flex; align-items:center; justify-content:center; line-height:1; z-index:3;
  background:radial-gradient(circle at 35% 30%, #fff6c8, #ffd76a 45%, #e8a92c); box-shadow:0 2px 4px rgba(0,0,0,.5), inset 0 0 0 2px #fff8}
.reveal-plinko .plinko-chute{position:absolute; top:2px; left:0; font-size:1rem; line-height:1; transition:transform .35s ease-in-out; z-index:2; filter:drop-shadow(0 1px 1px #000)}
@keyframes plinko-ping{0%{transform:scale(1); background:#fff} 40%{transform:scale(2); background:#ffd76a; box-shadow:0 0 8px #ffd76a} 100%{transform:scale(1)}}
`,
  async run(stage, round, ctx){
    const N = round.labels.length, W = Math.max(240, Math.min(300, stage.clientWidth || 300)), h = W / (4 * N);
    const R = 6, y0 = 40, dy = 24, pegR = 3.5, chip = Math.max(12, Math.min(20, 2 * h - 8)), slotTop = 254 - 76;
    let pegs = '';
    for (let k = 0; k < R; k++) for (let m = k % 2 ? 1 : 2; m <= 4 * N - 1; m += 2) pegs += `<i class="plinko-peg" data-p="${k}-${m}" style="left:${m * h}px; top:${y0 + k * dy}px"></i>`;
    stage.innerHTML = `<div class="plinko-board" style="width:${W}px">${pegs}
      ${round.labels.map((t, j) => `<div class="plinko-slot" data-slot="${j}" style="left:${j * W / N}px; width:${W / N}px"><span>${ctx.esc(t)}</span></div>`).join('')}
      <div class="plinko-chute" aria-hidden="true">🔻</div></div>`;
    const board = stage.querySelector('.plinko-board'), chute = stage.querySelector('.plinko-chute');
    const chuteTo = x => { chute.style.transform = `translate(${x - 8}px, 0)`; };
    chuteTo(W / 2);
    ctx.hint(`Drop ${ctx.pet}'s chip!`);
    if (ctx.first) await ctx.button('Drop! 🔻'); else await ctx.wait(500);
    ctx.hint('');
    const at = (x, y) => `translate(${x - chip / 2}px, ${y - chip / 2}px)`;
    for (const [k, j] of round.picks.entries()) {
      /* plan a zigzag that ends in slot j (lattice units of h; slot j's center is 4j+2) */
      const nT = 4 * j + 2, starts = [];
      for (let m = 2; m <= 4 * N - 2; m += 2) if (Math.abs(m - nT) <= R) starts.push(m);
      let m = starts[Math.floor(Math.random() * starts.length)];
      const path = [m];
      for (let s = 0; s < R; s++) {
        const rem = R - s, diff = nT - m;
        let step;
        if (Math.abs(diff) >= rem) step = Math.sign(diff);
        else {
          const ok = [-1, 1].filter(d => m + d >= 1 && m + d <= 4 * N - 1 && Math.abs(nT - (m + d)) <= rem - 1);
          step = ok[Math.floor(Math.random() * ok.length)];
        }
        m += step; path.push(m);
      }
      chuteTo(path[0] * h);
      await ctx.wait(ctx.quick ? 100 : 400);
      const c = document.createElement('div'); c.className = 'plinko-chip';
      c.style.width = c.style.height = `${chip}px`; c.style.fontSize = `${chip * .62}px`;
      c.textContent = ctx.pet;
      board.appendChild(c);
      const contact = s => ({x:path[s] * h, y:y0 + s * dy - pegR - chip / 2});
      const land = {x:nT * h, y:slotTop + 14 + chip / 2};
      if (ctx.quick) {
        await c.animate([{transform:at(path[0] * h, 6)}, ...path.slice(0, R).map((_, s) => ({transform:at(contact(s).x, contact(s).y)})), {transform:at(land.x, land.y)}],
          {duration:420, easing:'ease-in', fill:'forwards'}).finished;
      } else {
        await c.animate([{transform:at(path[0] * h, 6)}, {transform:at(contact(0).x, contact(0).y)}], {duration:260, easing:'cubic-bezier(.5,0,1,1)', fill:'forwards'}).finished;
        for (let s = 0; s < R; s++) {
          board.querySelector(`[data-p="${s}-${path[s]}"]`)?.classList.add('ping');
          setTimeout(((p) => () => p?.classList.remove('ping'))(board.querySelector(`[data-p="${s}-${path[s]}"]`)), 360);
          ctx.sfx('tick');
          const a = contact(s), b = s < R - 1 ? contact(s + 1) : land, mx = (a.x + b.x) / 2;
          await c.animate([
            {transform:at(a.x, a.y), easing:'cubic-bezier(.2,.6,.4,1)'},
            {transform:at(a.x + (mx - a.x) * .7, a.y - 7), offset:.32, easing:'cubic-bezier(.5,0,1,1)'},
            {transform:at(b.x, b.y)}
          ], {duration:s < R - 1 ? 230 : 380, fill:'forwards'}).finished;
        }
      }
      c.style.transform = at(land.x, land.y);
      c.animate([{transform:at(land.x, land.y - 6)}, {transform:at(land.x, land.y)}], {duration:200, easing:'ease-out'});
      board.querySelector(`[data-slot="${j}"]`).classList.add('lit');
      ctx.sfx('coin'); ctx.reveal(j);
      await ctx.wait(k === round.picks.length - 1 ? 600 : 700);
    }
    chute.style.opacity = '0';
    ctx.sfx('good');
    await ctx.wait(300);
  }
};

/* ───────────────────────── 🎰 slots ───────────────────────── */
export const slots = {
  id:'slots', title:'🎰 Pull the lever!',
  css:`
.reveal-slots{padding:4px 0 6px}
.reveal-slots .slots-cab{position:relative; width:100%; max-width:300px; margin:0 auto; padding:8px 50px 10px 10px; border-radius:18px 18px 12px 12px;
  background:linear-gradient(#e4577a, #b83659); box-shadow:inset 0 0 0 3px #ffd76a, 0 6px 0 #7d2440, 0 10px 18px rgba(0,0,0,.4)}
.reveal-slots .slots-top{display:flex; justify-content:space-between; align-items:center; margin:0 0 6px; gap:4px}
.reveal-slots .slots-name{font-weight:800; font-size:.8rem; letter-spacing:.06em; color:#fff6c8; text-shadow:0 1px 0 #7d2440}
.reveal-slots .slots-bulb{width:8px; height:8px; border-radius:50%; background:#ffd76a; box-shadow:0 0 6px #ffd76a; animation:slots-blink 1s steps(1) infinite}
.reveal-slots .slots-bulb:nth-child(even){animation-delay:.5s}
.reveal-slots.party .slots-bulb{animation-duration:.25s}
.reveal-slots .slots-reels{display:grid; align-content:center; min-height:104px; gap:6px; padding:6px; border-radius:10px; background:#3b2a2a; box-shadow:inset 0 2px 6px rgba(0,0,0,.6)}
.reveal-slots .slots-win{position:relative; height:40px; overflow:hidden; border-radius:7px; background:#fffdf4; transition:box-shadow .2s, background .2s}
.reveal-slots .slots-win::after{content:""; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.35))}
.reveal-slots .slots-win.won{background:#fff6a8; box-shadow:0 0 0 3px #ffd76a, 0 0 12px #ffd76a}
.reveal-slots .slots-strip{will-change:transform}
.reveal-slots .slots-item{height:40px; display:flex; align-items:center; justify-content:center; padding:0 6px; font-weight:800; font-size:.98rem; color:#3b2a2a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.reveal-slots.tight .slots-item{font-size:.86rem}
.reveal-slots .slots-win.won .slots-item{animation:reveal-pop .4s ease-out}
.reveal-slots .slots-lever{position:absolute; right:6px; top:24px; bottom:22px; width:36px; padding:0; border:0; background:none; cursor:pointer}
.reveal-slots .slots-lever[data-done]{cursor:default}
.reveal-slots .slots-lever:focus-visible{outline:3px solid #fff; outline-offset:2px; border-radius:10px}
.reveal-slots .slots-base{position:absolute; left:4px; bottom:0; width:28px; height:22px; border-radius:6px; background:linear-gradient(#ccc, #777); box-shadow:inset 0 0 0 2px #555}
.reveal-slots .slots-arm{position:absolute; left:15px; bottom:12px; width:6px; height:calc(100% - 26px); border-radius:3px; background:linear-gradient(90deg, #888, #eee, #888); transform-origin:50% 100%}
.reveal-slots .slots-knob{position:absolute; left:50%; top:-14px; width:22px; height:22px; margin-left:-11px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #ffb3c4, #e4577a 50%, #8a1f3e); box-shadow:0 2px 4px rgba(0,0,0,.4)}
.reveal-slots .slots-lever:not([data-done]) .slots-knob{animation:reveal-bounce 1s ease-in-out infinite}
.reveal-slots .slots-tray{margin:8px auto 0; height:16px; width:60%; border-radius:0 0 10px 10px; background:#3b2a2a; box-shadow:inset 0 3px 4px rgba(0,0,0,.6)}
.reveal-slots .slots-pet{position:absolute; right:-6px; bottom:-14px; font-size:1.7rem; line-height:1; pointer-events:none}
@keyframes slots-blink{0%{opacity:1} 50%{opacity:.25}}
`,
  async run(stage, round, ctx){
    const L = round.labels.length, P = round.picks.length, H = 40, esc = ctx.esc;
    if (round.labels.some(t => t.length > 16)) stage.classList.add('tight');
    const bulbs = n => Array.from({length:n}, () => '<span class="slots-bulb"></span>').join('');
    stage.innerHTML = `<div class="slots-cab">
      <div class="slots-top">${bulbs(3)}<span class="slots-name">★ CLASS-O-MATIC ★</span>${bulbs(3)}</div>
      <div class="slots-reels">${round.picks.map((_, k) => `<div class="slots-win"><div class="slots-strip"><div class="slots-item">${esc(round.labels[(k * 2 + 1) % L])}</div></div></div>`).join('')}</div>
      <button type="button" class="slots-lever" data-tap aria-label="Pull the lever"><span class="slots-base"></span><span class="slots-arm"><span class="slots-knob"></span></span></button>
      <div class="slots-tray"></div><span class="slots-pet">${esc(ctx.pet)}</span></div>`;
    const lever = stage.querySelector('.slots-lever'), arm = stage.querySelector('.slots-arm');
    ctx.hint('Pull the lever! 👉');
    await new Promise(ok => lever.addEventListener('click', ok, {once:true}));
    lever.setAttribute('data-done', ''); lever.setAttribute('aria-disabled', 'true');
    ctx.hint('');
    ctx.sfx('tick');
    await arm.animate([{transform:'scaleY(1)'}, {transform:'scaleY(-.55)'}, {transform:'scaleY(1)'}],
      {duration:ctx.quick ? 200 : 520, easing:'cubic-bezier(.4,0,.3,1)'}).finished;
    /* every reel spins together and stops in order, each on its pick */
    const wins = [...stage.querySelectorAll('.slots-win')], spins = wins.map((win, k) => {
      const strip = win.querySelector('.slots-strip'), items = [(k * 2 + 1) % L];
      const loops = ctx.quick ? 1 : 3 + k;
      for (let c = 0; c < loops; c++) for (let j = 0; j < L; j++) items.push((j + k + 2) % L);
      items.push(round.picks[k], (round.picks[k] + 1) % L);
      strip.innerHTML = items.map(i => `<div class="slots-item">${esc(round.labels[i])}</div>`).join('');
      const end = -(items.length - 2) * H;
      return strip.animate([
        {transform:'translateY(0)', filter:'blur(0)'},
        {filter:'blur(2px)', offset:.15},
        {filter:'blur(1.5px)', offset:.75},
        {transform:`translateY(${end}px)`, filter:'blur(0)'}
      ], {duration:ctx.quick ? 300 + k * 150 : 1300 + k * 650, easing:'cubic-bezier(.15,.55,.3,1.06)', fill:'forwards'});
    });
    let ticking = !ctx.quick && setInterval(() => ctx.sfx('tick'), 180);
    for (const [k, anim] of spins.entries()) {
      await anim.finished;
      wins[k].classList.add('won');
      ctx.sfx('coin'); ctx.reveal(round.picks[k]);
      if (k === P - 1 && ticking) { clearInterval(ticking); ticking = false; }
    }
    stage.classList.add('party'); ctx.sfx('good');
    await ctx.wait(800);
  }
};
