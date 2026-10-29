/* 🥤 🎣 🏖️ 🪙 🥚 🥠 the "find the hidden thing" reveal styles: cups, fishing, dig, scratch, eggs, fortune.
   Tap-to-pick: one hidden thing per class on the round, she taps any one, and it shows the NEXT pick in round.picks
   (whatever she taps). Each one only puts on a show (see the top of index.js). The only randomness here is cosmetic
   (how the cups shuffle, fish colors and swim speeds, which way sand and crumbs fly) and never changes which class
   shows. Leftover things become untappable at the end (a pet treat under leftover cups, the rest fade). */

const rand = (a, b) => a + Math.random() * (b - a);   // cosmetic only
const FISH_COLORS = ['#ff8a3d', '#ffd23f', '#ff6fa8', '#7ee081', '#b28dff', '#5ad1e8', '#ff5e5b'];
const BABIES = ['🐣', '🐥', '🦖', '🐢', '🐤', '🐧', '🦕', '🐊'];
const SAND = ['#f2d38b', '#e3b860', '#d9a441', '#fbe7b5'];
const CRUMBS = ['#e9b35f', '#d18f3a', '#f5d08a'];
const SPARKS = ['#ffd76a', '#ff8fa3', '#7fd1b9', '#ffffff', '#9cc3f5'];

/* the bits every style here shares: the class tag, little particle bursts, leftovers, reduced motion */
const common = id => `
.reveal-${id} [data-tap]{-webkit-tap-highlight-color:transparent; touch-action:manipulation; font:inherit; color:inherit}
.reveal-${id} [data-done]{cursor:default}
.reveal-${id} .hd-left{opacity:.4; filter:saturate(.4)}
.reveal-${id} .hd-tag{display:inline-block; max-width:100%; padding:3px 6px; border-radius:9px; background:#fffdf5; color:#3b2a2a; font-weight:800;
  font-size:.68rem; line-height:1.15; text-align:center; white-space:normal; overflow-wrap:anywhere; box-shadow:0 2px 4px rgba(0,0,0,.35);
  animation:${id}-pop .45s cubic-bezier(.3,1.6,.5,1) both}
.reveal-${id} .hd-treat{background:#ffe9b0}
@keyframes ${id}-pop{0%{transform:scale(.2); opacity:0} 70%{transform:scale(1.12); opacity:1} 100%{transform:scale(1)}}
.reveal-${id} .hd-p{position:absolute; border-radius:50%; pointer-events:none; z-index:9; line-height:1; animation:${id}-burst var(--t,.7s) cubic-bezier(.2,.7,.4,1) forwards}
@keyframes ${id}-burst{0%{transform:translate(0,0) scale(1); opacity:1} 55%{transform:translate(var(--dx),var(--dy)) rotate(var(--r)); opacity:1}
  100%{transform:translate(calc(var(--dx) * 1.2), calc(var(--dy) + 28px)) scale(.5) rotate(var(--r)); opacity:0}}
.reveal-${id}.hd-q *, .reveal-${id}.hd-q *::before, .reveal-${id}.hd-q *::after{transition-duration:.15s !important; animation-duration:.2s !important; animation-iteration-count:1 !important}
`;

const tagHTML = (ctx, label, cls = '') => `<span class="hd-tag ${cls}">${ctx.esc(label)}</span>`;

/* a little burst of dots (or characters) flying out of (x, y), in the parent's own pixels; the parent must be positioned */
function burst(parent, x, y, {n = 10, colors = SPARKS, up = 46, spread = 42, size = 7, ms = 700, chars = null} = {}){
  for (let j = 0; j < n; j++) {
    const p = document.createElement('span');
    p.className = 'hd-p';
    p.setAttribute('aria-hidden', 'true');
    const dx = rand(-spread, spread), dy = -up * rand(.45, 1.15);
    p.style.cssText = `left:${x - size / 2}px; top:${y - size / 2}px; width:${size}px; height:${size}px; --dx:${dx.toFixed(1)}px; --dy:${dy.toFixed(1)}px; --r:${Math.round(rand(-200, 200))}deg; --t:${ms}ms;` +
      (chars ? `font-size:${size * 1.6}px; width:auto; height:auto; border-radius:0` : `background:${colors[j % colors.length]}`);
    if (chars) p.textContent = chars[j % chars.length];
    parent.appendChild(p);
    setTimeout(() => p.remove(), ms + 120);
  }
}

/* where an element sits inside another (positioned) element, in its pixels */
function boxIn(parent, el){
  const s = parent.getBoundingClientRect(), r = el.getBoundingClientRect();
  return {l:r.left - s.left, t:r.top - s.top, w:r.width, h:r.height, x:r.left - s.left + r.width / 2, y:r.top - s.top + r.height / 2};
}

/* tap-to-pick: every [data-tap] in the stage is a hidden thing. Whatever she taps shows the next pick; taps while one is
   opening are ignored, so the picks always come out in order. open(btn, labelIndex, n, show) plays the show and calls
   show() the moment the class is visible. Resolves after the last pick and the leftovers. */
function tapLoop(stage, round, ctx, {hint, again, open, leftover}){
  return new Promise(done => {
    const items = [...stage.querySelectorAll('[data-tap]')];
    let k = 0, busy = false;
    ctx.hint(hint);
    const finish = async () => {
      const rest = items.filter(b => !b.hasAttribute('data-done'));
      rest.forEach(b => { b.setAttribute('data-done', ''); b.setAttribute('aria-disabled', 'true'); b.tabIndex = -1; });
      if (leftover && rest.length) await leftover(rest);
      else rest.forEach(b => b.classList.add('hd-left'));
      await ctx.wait(700);
      done();
    };
    if (!round.picks.length) { finish(); return; }
    items.forEach(btn => btn.addEventListener('click', async () => {
      if (busy || btn.hasAttribute('data-done') || k >= round.picks.length) return;
      busy = true;
      btn.setAttribute('data-done', '');
      ctx.hint('');
      const i = round.picks[k], n = k++;
      let shown = false;
      const show = () => {
        if (shown) return;
        shown = true; ctx.reveal(i);
        btn.setAttribute('aria-label', round.labels[i]);
      };
      try { await open(btn, i, n, show); } catch (e) { console.warn(e); }
      show();
      if (k < round.picks.length) { busy = false; ctx.hint(again || hint); return; }
      finish();
    }));
  });
}

/* ───────────────────────── 🥤 cups ───────────────────────── */
export const cups = {
  id:'cups', title:'🥤 Find the classes under the cups!',
  css:common('cups') + `
.reveal-cups{height:206px}
.reveal-cups .cups-table{position:absolute; left:-4px; right:-4px; bottom:0; height:92px; border-radius:18px 18px 10px 10px;
  background:repeating-linear-gradient(90deg, transparent 0 44px, rgba(0,0,0,.09) 44px 46px), linear-gradient(#c99063, #a96e40 60%, #8a5530);
  box-shadow:inset 0 5px 0 #e0ab7e, 0 6px 0 #5e3a20, 0 10px 16px rgba(0,0,0,.35)}
.reveal-cups .cups-cup{position:absolute; bottom:28px; height:172px; padding:0; border:0; background:none; cursor:pointer; transition:left var(--sw,.45s) ease-in-out}
.reveal-cups .cups-cup::before{content:''; position:absolute; left:50%; bottom:-5px; width:62px; height:12px; margin-left:-31px; border-radius:50%; background:rgba(0,0,0,.3)}
.reveal-cups .cups-body{position:absolute; left:50%; bottom:0; width:56px; height:72px; margin-left:-28px; transform-origin:25% 100%; z-index:2;
  transition:transform .45s cubic-bezier(.3,1.5,.5,1); filter:drop-shadow(0 3px 2px rgba(0,0,0,.35))}
.reveal-cups .cups-shape{position:absolute; inset:0; clip-path:polygon(20% 0, 80% 0, 100% 100%, 0 100%);
  background:linear-gradient(90deg, #8e1414, #d32f2f 20%, #ff7676 36%, #e53935 50%, #b71c1c 78%, #7f1010)}
.reveal-cups .cups-shape::before{content:''; position:absolute; left:0; right:0; top:24%; height:16%; background:linear-gradient(rgba(0,0,0,.22), transparent 40%, rgba(255,255,255,.18))}
.reveal-cups .cups-shape::after{content:''; position:absolute; left:0; right:0; bottom:0; height:12px; background:linear-gradient(#fff, #e6ddd5)}
.reveal-cups .cups-under{position:absolute; left:0; right:0; bottom:2px; display:flex; justify-content:center; align-items:flex-end; padding:0 2px; z-index:1; min-height:20px}
.reveal-cups .cups-q{font-size:22px; line-height:1}
.reveal-cups .cups-cup.up .cups-body{transform:translateY(-72px) rotate(-15deg)}
.reveal-cups .cups-cup.hop{z-index:3; animation:cups-hop var(--sw) ease-in-out}
.reveal-cups .cups-cup.dip{z-index:1; animation:cups-dip var(--sw) ease-in-out}
@keyframes cups-hop{50%{transform:translateY(-16px) scale(1.08)}}
@keyframes cups-dip{50%{transform:translateY(4px) scale(.9)}}
.reveal-cups .cups-cup.ready:not([data-done]) .cups-body{animation:cups-nudge 2.6s ease-in-out var(--dl,0s) infinite}
@keyframes cups-nudge{0%,78%,100%{transform:none} 86%{transform:translateY(-7px) rotate(-4deg)} 93%{transform:translateY(-2px) rotate(3deg)}}
.reveal-cups .cups-cup.hd-left{opacity:1; filter:none}
.reveal-cups .cups-cup.hd-left .cups-body{filter:saturate(.6) drop-shadow(0 3px 2px rgba(0,0,0,.35))}
`,
  async run(stage, round, ctx){
    const n = round.labels.length;
    if (ctx.quick) stage.classList.add('hd-q');
    stage.innerHTML = `<div class="cups-table" aria-hidden="true"></div>` + round.labels.map((_, j) =>
      `<button type="button" class="cups-cup" data-tap aria-label="Cup ${j + 1}" style="width:${100 / n}%; left:${j * 100 / n}%; --dl:${(j * .35).toFixed(2)}s">` +
      `<span class="cups-under"></span><span class="cups-body"><span class="cups-shape"></span></span></button>`).join('');
    const btns = [...stage.querySelectorAll('.cups-cup')], slot = btns.map((_, j) => j);
    if (!ctx.quick && n > 1) {
      ctx.hint('Watch the cups… 👀');
      btns.forEach(b => { b.querySelector('.cups-under').innerHTML = '<span class="cups-q">❓</span>'; });
      await ctx.wait(350);
      btns.forEach(b => b.classList.add('up')); ctx.sfx('tick');
      await ctx.wait(850);
      btns.forEach(b => b.classList.remove('up'));
      await ctx.wait(500);
      btns.forEach(b => { b.querySelector('.cups-under').innerHTML = ''; });
      for (const t of [520, 470, 420, 380, 340, 310, 290, 290]) {
        const a = Math.floor(Math.random() * n), c = (a + 1 + Math.floor(Math.random() * (n - 1))) % n;
        stage.style.setProperty('--sw', `${t}ms`);
        [slot[a], slot[c]] = [slot[c], slot[a]];
        btns[a].style.left = `${slot[a] * 100 / n}%`; btns[c].style.left = `${slot[c] * 100 / n}%`;
        btns[a].classList.add('hop'); btns[c].classList.add('dip');
        ctx.sfx('tick');
        await ctx.wait(t + 40);
        btns[a].classList.remove('hop'); btns[c].classList.remove('dip');
      }
      btns.map((b, j) => [slot[j], b]).sort((x, y) => x[0] - y[0]).forEach(([, b]) => stage.appendChild(b));   // tab order = what she sees
    }
    btns.forEach(b => b.classList.add('ready'));
    await tapLoop(stage, round, ctx, {
      hint:'Tap a cup! 🥤', again:'Tap another cup!',
      async open(btn, i, k, show){
        btn.querySelector('.cups-under').innerHTML = tagHTML(ctx, round.labels[i]);
        btn.classList.add('up'); ctx.sfx('tick');
        await ctx.wait(380);
        show(); ctx.sfx('coin');
        burst(btn, btn.clientWidth / 2, btn.clientHeight - 18, {n:9});
        await ctx.wait(700);
      },
      async leftover(rest){
        await ctx.wait(400);
        rest.forEach(b => { b.classList.add('hd-left', 'up'); b.querySelector('.cups-under').innerHTML = tagHTML(ctx, '🦴 Pet treat!', 'hd-treat'); });
        ctx.sfx('good');
        ctx.hint(`${ctx.pet} Yum, a treat!`);
        await ctx.wait(900);
      }
    });
  }
};

/* ───────────────────────── 🎣 fishing ───────────────────────── */
export const fishing = {
  id:'fishing', title:'🎣 Go fishing!',
  css:common('fishing') + `
.reveal-fishing{height:276px}
.reveal-fishing .fishing-pond{position:absolute; left:0; right:0; top:84px; bottom:0; border-radius:44% 52% 38% 42% / 24% 28% 20% 22%;
  background:radial-gradient(ellipse at 38% 28%, #7fd0f0, #3398cc 55%, #1f6e9e); border:5px solid #e8d39c; box-shadow:inset 0 8px 16px rgba(0,0,0,.25), 0 4px 0 #b99d5f; overflow:hidden}
.reveal-fishing .fishing-wave{position:absolute; width:60px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.35); border-color:rgba(255,255,255,.4) transparent transparent; animation:fishing-wave 3.2s ease-in-out infinite}
@keyframes fishing-wave{0%,100%{transform:translateX(0); opacity:.3} 50%{transform:translateX(14px); opacity:.9}}
.reveal-fishing .fishing-reed{position:absolute; font-size:22px; line-height:1; pointer-events:none; z-index:3}
.reveal-fishing .fishing-dock{position:absolute; left:-4px; top:52px; width:86px; height:15px; border-radius:3px; z-index:3;
  background:repeating-linear-gradient(90deg, #b17a46 0 13px, #7d4f28 13px 15px); box-shadow:0 3px 0 #5b3719}
.reveal-fishing .fishing-dock::before, .reveal-fishing .fishing-dock::after{content:''; position:absolute; top:15px; width:7px; height:30px; background:#6b421f; left:12px; border-radius:0 0 2px 2px}
.reveal-fishing .fishing-dock::after{left:64px}
.reveal-fishing .fishing-pet{position:absolute; left:6px; top:16px; font-size:34px; line-height:1; z-index:4}
.reveal-fishing .fishing-pet.pull{animation:fishing-pull .3s ease-in-out 2}
@keyframes fishing-pull{50%{transform:translateX(-4px) rotate(-8deg)}}
.reveal-fishing .fishing-rod{position:absolute; left:40px; top:8px; width:4px; height:46px; border-radius:2px; z-index:4; background:linear-gradient(#4a2e16, #b17a46);
  transform-origin:50% 100%; transform:rotate(26deg); transition:transform .28s ease-out}
.reveal-fishing .fishing-rod i{position:absolute; left:0; top:0; width:4px; height:4px}
.reveal-fishing .fishing-rod.back{transform:rotate(-42deg)}
.reveal-fishing .fishing-rod.out{transform:rotate(58deg)}
.reveal-fishing .fishing-fish{position:absolute; width:52px; height:34px; padding:0; border:0; background:none; cursor:pointer; z-index:2;
  animation:fishing-swim var(--dur) ease-in-out var(--del) infinite}
@keyframes fishing-swim{0%{transform:translate(0,0)} 23%{transform:translate(calc(var(--d) / 2), -4px)} 46%,50%{transform:translate(var(--d),0)}
  73%{transform:translate(calc(var(--d) / 2), 4px)} 96%,100%{transform:translate(0,0)}}
.reveal-fishing .fishing-b{position:absolute; left:13px; top:7px; width:34px; height:20px; animation:fishing-face var(--dur) linear var(--del) infinite}
@keyframes fishing-face{0%,47%{transform:scaleX(1)} 49%,97%{transform:scaleX(-1)} 99%,100%{transform:scaleX(1)}}
.reveal-fishing .fishing-body{position:absolute; inset:0; border-radius:55% 65% 65% 55% / 50%; background:var(--c);
  box-shadow:inset 0 -5px 0 rgba(255,255,255,.4), inset 0 3px 0 rgba(255,255,255,.25), 0 2px 3px rgba(0,0,0,.25)}
.reveal-fishing .fishing-body::before{content:''; position:absolute; left:-11px; top:2px; border-left:13px solid var(--c); border-top:8px solid transparent; border-bottom:8px solid transparent}
.reveal-fishing .fishing-body::after{content:''; position:absolute; right:6px; top:5px; width:6px; height:6px; border-radius:50%; background:radial-gradient(circle at 60% 50%, #222 0 45%, #fff 50%)}
.reveal-fishing .fishing-body i{position:absolute; left:9px; top:-5px; width:13px; height:8px; border-radius:80% 20% 0 0; background:var(--c); filter:brightness(.8)}
.reveal-fishing .fishing-fish.caught, .reveal-fishing .fishing-fish.caught .fishing-b{animation:none}
.reveal-fishing .fishing-fish.caught{z-index:6; transition:left .5s ease-in-out, top .5s ease-in-out}
.reveal-fishing .fishing-fish.caught .fishing-b{transition:transform .35s}
.reveal-fishing .fishing-fish.wiggle .fishing-b{animation:fishing-wiggle .16s linear 4}
@keyframes fishing-wiggle{50%{transform:rotate(12deg)}}
.reveal-fishing .fishing-fish.hooked .fishing-b{transform:rotate(-62deg)}
.reveal-fishing .fishing-fish.landed .fishing-b{transform:rotate(-8deg) scale(.85)}
.reveal-fishing .fishing-fish.landed{transition-duration:.55s; animation:fishing-flop .5s ease-in-out .55s 2}
@keyframes fishing-flop{50%{transform:translateY(-4px) rotate(6deg)}}
.reveal-fishing .fishing-line{position:absolute; height:1.5px; background:#f4f1e6; transform-origin:0 50%; z-index:5; animation:fishing-draw .3s ease-out both}
@keyframes fishing-draw{from{transform:rotate(var(--a)) scaleX(0)} to{transform:rotate(var(--a)) scaleX(1)}}
.reveal-fishing .fishing-drop{position:absolute; width:1.5px; background:rgba(244,241,230,.75); z-index:1; transition:height .5s ease-in-out}
.reveal-fishing .fishing-bob{position:absolute; width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%; z-index:5;
  background:linear-gradient(#e53935 0 50%, #fff 50%); border:1px solid #333; animation:fishing-pop .3s ease-out both}
@keyframes fishing-pop{from{transform:scale(0)} to{transform:scale(1)}}
.reveal-fishing .fishing-bob.dip{animation:fishing-dip .7s ease-in-out}
@keyframes fishing-dip{0%,50%,100%{transform:translateY(0)} 25%{transform:translateY(8px)} 75%{transform:translateY(6px)}}
.reveal-fishing .fishing-slot{position:absolute; top:34px; display:flex; justify-content:center; padding:0 2px; z-index:6}
.reveal-fishing.hd-q .fishing-fish:not(.caught), .reveal-fishing.hd-q .fishing-b, .reveal-fishing.hd-q .fishing-wave{animation:none}
`,
  async run(stage, round, ctx){
    const n = round.labels.length, m = Math.max(1, round.picks.length);
    if (ctx.quick) stage.classList.add('hd-q');
    const W = stage.clientWidth || 300, colors = [...FISH_COLORS].sort(() => Math.random() - .5);
    const lane = j => 110 + (n > 1 ? j * 118 / (n - 1) : 50);
    stage.innerHTML = `<div class="fishing-pond" aria-hidden="true"><span class="fishing-wave" style="left:20%; top:30%"></span>` +
      `<span class="fishing-wave" style="left:60%; top:58%; animation-delay:-1.4s"></span><span class="fishing-wave" style="left:34%; top:82%; animation-delay:-2.2s"></span></div>` +
      `<span class="fishing-reed" style="right:-2px; top:70px" aria-hidden="true">🌿</span><span class="fishing-reed" style="left:-6px; bottom:-2px" aria-hidden="true">🌿</span>` +
      `<div class="fishing-dock" aria-hidden="true"></div><span class="fishing-pet" aria-hidden="true">${ctx.esc(ctx.pet)}</span>` +
      `<span class="fishing-rod" aria-hidden="true"><i></i></span>` +
      round.labels.map((_, j) => {
        const dur = rand(5.5, 8.5);
        return `<button type="button" class="fishing-fish" data-tap aria-label="Fish ${j + 1}" style="left:${(ctx.quick ? 8 + j * 52 / Math.max(1, n - 1) : rand(5, 26)).toFixed(1)}%; top:${lane(j)}px;` +
          ` --c:${colors[j % colors.length]}; --d:${Math.round(W * .42)}px; --dur:${dur.toFixed(2)}s; --del:${(-rand(0, dur)).toFixed(2)}s">` +
          `<span class="fishing-b"><span class="fishing-body"><i></i></span></span></button>`;
      }).join('');
    const rod = stage.querySelector('.fishing-rod'), pet = stage.querySelector('.fishing-pet');
    const add = (cls, css) => { const e = document.createElement('span'); e.className = cls; e.style.cssText = css; e.setAttribute('aria-hidden', 'true'); stage.appendChild(e); return e; };
    await tapLoop(stage, round, ctx, {
      hint:'Tap a fish to catch it! 🐟', again:'Catch another fish!',
      async open(fish, i, k, show){
        // stop the fish right where it is
        const at = boxIn(stage, fish), b = fish.querySelector('.fishing-b');
        const flipped = (getComputedStyle(b).transform || '').startsWith('matrix(-1');
        fish.classList.add('caught');
        fish.style.transition = 'none';
        fish.style.left = `${at.l}px`; fish.style.top = `${at.t}px`;
        b.style.transform = flipped ? 'scaleX(-1)' : '';
        void fish.offsetWidth; fish.style.transition = '';
        // cast
        rod.classList.add('back'); ctx.sfx('tick');
        await ctx.wait(260);
        rod.classList.remove('back'); rod.classList.add('out');
        await ctx.wait(320);
        const tip = boxIn(stage, rod.querySelector('i')), bx = at.x, by = 94;
        const dx = bx - tip.x, dy = by - tip.y;
        const line = add('fishing-line', `left:${tip.x}px; top:${tip.y}px; width:${Math.hypot(dx, dy)}px; --a:${Math.atan2(dy, dx)}rad`);
        await ctx.wait(300);
        const bob = add('fishing-bob', `left:${bx}px; top:${by}px`);
        burst(stage, bx, by, {n:7, colors:['#ffffff', '#bfe9ff', '#7fd0f0'], up:24, spread:18, size:5, ms:500});
        const drop = add('fishing-drop', `left:${bx}px; top:${by}px; height:0`);
        void drop.offsetWidth; drop.style.height = `${Math.max(0, at.t + 10 - by)}px`;
        await ctx.wait(450);
        // a bite!
        bob.classList.add('dip'); fish.classList.add('wiggle'); ctx.sfx('tick');
        await ctx.wait(700);
        // reel it up
        fish.classList.remove('wiggle'); b.style.transform = '';
        fish.classList.add('hooked'); pet.classList.add('pull');
        fish.style.top = `${by - 22}px`; drop.style.height = '0px'; bob.style.opacity = '0';
        await ctx.wait(520);
        line.remove(); bob.remove(); drop.remove(); pet.classList.remove('pull');
        rod.classList.remove('out');
        // into the catch row, holding the class tag
        const left = W * .3 + (k + .5) * (W * .7 / m);
        fish.classList.remove('hooked'); fish.classList.add('landed');
        fish.style.left = `${left - 30}px`; fish.style.top = '0px';
        await ctx.wait(500);
        add('fishing-slot', `left:${W * .3 + k * W * .7 / m}px; width:${W * .7 / m}px`).innerHTML = tagHTML(ctx, round.labels[i]);
        show(); ctx.sfx('coin');
        burst(stage, left, 40, {n:10});
        await ctx.wait(650);
      }
    });
  }
};

/* ───────────────────────── 🏖️ dig ───────────────────────── */
function scatter(n){   // where each X sits in the sandbox (percent of its box), zigzagging so it looks dropped by hand
  const cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols);
  return Array.from({length:n}, (_, j) => {
    const r = Math.floor(j / cols), c = j % cols, inRow = r === rows - 1 ? n - r * cols : cols;
    return [(c + .5) / inRow * 100 + (r % 2 ? 5 : -5), (r + .5) / rows * 100 + (c % 2 ? -5 : 5)];
  });
}

export const dig = {
  id:'dig', title:'🏖️ Dig for treasure!',
  css:common('dig') + `
.reveal-dig{height:246px}
.reveal-dig .dig-box{position:absolute; inset:0; border-radius:16px; border:8px solid #8a5a35; box-shadow:inset 0 0 0 2px #6b4224, inset 0 6px 12px rgba(0,0,0,.2), 0 5px 0 #5e3a20;
  background:radial-gradient(circle, rgba(160,110,40,.35) 1px, transparent 1.5px) 0 0/9px 9px, radial-gradient(circle, rgba(255,255,255,.45) 1px, transparent 1.5px) 4px 5px/11px 11px, linear-gradient(160deg, #f8dea0, #edc672)}
.reveal-dig .dig-deco{position:absolute; font-size:20px; line-height:1; opacity:.85; pointer-events:none}
.reveal-dig .dig-spot{position:absolute; width:100px; height:100px; margin:-60px 0 0 -50px; padding:0; border:0; background:none; cursor:pointer}
.reveal-dig .dig-x{position:absolute; left:50%; bottom:22px; width:34px; height:34px; margin-left:-17px; transition:opacity .3s, transform .3s; animation:dig-pulse 2s ease-in-out var(--dl,0s) infinite}
.reveal-dig .dig-x::before, .reveal-dig .dig-x::after{content:''; position:absolute; left:50%; top:50%; width:38px; height:8px; margin:-4px 0 0 -19px; border-radius:5px; background:#d7372f; box-shadow:0 2px 0 #8e1d18; transform:rotate(45deg)}
.reveal-dig .dig-x::after{transform:rotate(-45deg)}
@keyframes dig-pulse{0%,100%{transform:scale(1)} 50%{transform:scale(1.12)}}
.reveal-dig .dig-spot:focus-visible{outline-offset:-6px}
.reveal-dig .dig-spot.digging .dig-x{opacity:0; transform:scale(.4); animation:none}
.reveal-dig .dig-hole{position:absolute; left:50%; bottom:16px; width:64px; height:20px; margin-left:-32px; border-radius:50%; transform:scale(0); transition:transform .4s;
  background:radial-gradient(ellipse at 50% 35%, #6e4b1c, #a77a36 70%, #d9b066)}
.reveal-dig .dig-spot.digging .dig-hole{transform:scale(1)}
.reveal-dig .dig-pet{position:absolute; right:-8px; bottom:18px; font-size:26px; line-height:1; opacity:0; transition:opacity .2s; z-index:3}
.reveal-dig .dig-tool{position:absolute; right:20px; bottom:30px; font-size:28px; line-height:1; opacity:0; transform-origin:80% 80%; z-index:4}
.reveal-dig .dig-spot.digging .dig-pet{opacity:1; animation:dig-hop .4s ease-in-out 3}
.reveal-dig .dig-spot.digging .dig-tool{opacity:1; animation:dig-swing .4s ease-in-out 3}
.reveal-dig .dig-spot.found .dig-pet, .reveal-dig .dig-spot.found .dig-tool{opacity:0; animation:none}
@keyframes dig-hop{50%{transform:translateY(-6px)}}
@keyframes dig-swing{0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(-70deg) translate(-4px,-4px)}}
.reveal-dig .dig-chest{position:absolute; left:50%; bottom:20px; width:46px; height:32px; margin-left:-23px; z-index:2; opacity:0; transform:translateY(16px) scale(.6)}
.reveal-dig .dig-spot.found .dig-chest{opacity:1; animation:dig-rise .45s cubic-bezier(.3,1.6,.5,1) both}
@keyframes dig-rise{from{opacity:0; transform:translateY(16px) scale(.6)} to{opacity:1; transform:none}}
.reveal-dig .dig-base, .reveal-dig .dig-lid{position:absolute; left:0; right:0; border:2px solid #4a2a12;
  background:linear-gradient(90deg, transparent 16%, #f5c542 16% 25%, transparent 25% 75%, #f5c542 75% 84%, transparent 84%), linear-gradient(#b0703a, #7a4420)}
.reveal-dig .dig-base{bottom:0; height:20px; border-radius:2px 2px 5px 5px}
.reveal-dig .dig-base::after{content:''; position:absolute; left:50%; top:-1px; width:8px; height:8px; margin-left:-4px; border-radius:2px; background:#f5c542; border:1px solid #9a6d12}
.reveal-dig .dig-lid{bottom:18px; height:14px; border-radius:14px 14px 2px 2px; transform-origin:2px 100%; transition:transform .35s cubic-bezier(.3,1.6,.5,1)}
.reveal-dig .dig-spot.open .dig-lid{transform:rotate(-40deg) translate(-3px,-2px)}
.reveal-dig .dig-glow{position:absolute; left:50%; bottom:30px; width:70px; height:70px; margin-left:-35px; border-radius:50%; opacity:0; pointer-events:none;
  background:radial-gradient(circle, rgba(255,230,120,.95), rgba(255,215,90,.35) 45%, transparent 70%); transition:opacity .4s}
.reveal-dig .dig-spot.open .dig-glow{opacity:1}
.reveal-dig .dig-scroll{position:absolute; left:-4px; right:-4px; bottom:54px; display:flex; justify-content:center; z-index:5}
.reveal-dig .dig-scroll .hd-tag{background:#fbeec1; border-radius:3px; border-left:5px solid #d9bd7a; border-right:5px solid #d9bd7a; color:#5a3a12}
`,
  async run(stage, round, ctx){
    if (ctx.quick) stage.classList.add('hd-q');
    const spots = scatter(round.labels.length);
    stage.innerHTML = `<div class="dig-box" aria-hidden="true"><span class="dig-deco" style="left:46%; bottom:4px">🐚</span><span class="dig-deco" style="right:8px; top:6px">🦀</span>` +
      `<span class="dig-deco" style="left:4px; top:4px; font-size:16px">⭐</span></div>` +
      `<div style="position:absolute; inset:12px 8px 4px">` + spots.map(([x, y], j) =>
        `<button type="button" class="dig-spot" data-tap aria-label="Dig spot ${j + 1}" style="left:${x}%; top:${y + 2}%; --dl:${(j * .4).toFixed(1)}s">` +
        `<span class="dig-hole"></span><span class="dig-x"></span><span class="dig-glow"></span>` +
        `<span class="dig-chest"><span class="dig-base"></span><span class="dig-lid"></span></span>` +
        `<span class="dig-scroll"></span><span class="dig-pet">${ctx.esc(ctx.pet)}</span><span class="dig-tool">⛏️</span></button>`).join('') + `</div>`;
    await tapLoop(stage, round, ctx, {
      hint:'Tap an ❌ to dig! ⛏️', again:'Dig up another one!',
      async open(spot, i, k, show){
        spot.classList.add('digging');
        for (let d = 0; d < 3; d++) {
          ctx.sfx('tick');
          burst(spot, 50, 82, {n:8, colors:SAND, up:44, spread:38, size:6, ms:600});
          await ctx.wait(400);
        }
        spot.classList.add('found');
        await ctx.wait(420);
        spot.classList.add('open'); ctx.sfx('tick');
        await ctx.wait(250);
        spot.querySelector('.dig-scroll').innerHTML = tagHTML(ctx, `📜 ${round.labels[i]}`);
        show(); ctx.sfx('coin');
        burst(spot, 50, 64, {n:12, colors:['#ffd76a', '#fff3b0', '#f5c542', '#ffffff']});
        await ctx.wait(650);
      }
    });
  }
};

/* ───────────────────────── 🪙 scratch ───────────────────────── */
export const scratch = {
  id:'scratch', title:'🪙 Scratch-off ticket!',
  css:common('scratch') + `
.reveal-scratch .scratch-ticket{position:relative; margin:4px 6px; padding:10px 14px 8px; border-radius:10px; color:#7a1f1f;
  background:radial-gradient(circle at 20% 15%, rgba(255,255,255,.55), transparent 40%), linear-gradient(135deg, #ffe58a, #ffc83d 45%, #ffb020);
  box-shadow:0 6px 0 #c47f00, 0 10px 18px rgba(0,0,0,.4); transform:rotate(-1.2deg)}
.reveal-scratch .scratch-ticket::before, .reveal-scratch .scratch-ticket::after{content:''; position:absolute; top:8px; bottom:8px; width:10px;
  background:radial-gradient(circle at 50% 50%, var(--board, #2F4A3E) 3.5px, transparent 4px) 0 0/10px 12px repeat-y}
.reveal-scratch .scratch-ticket::before{left:-5px}
.reveal-scratch .scratch-ticket::after{right:-5px}
.reveal-scratch .scratch-head{font-weight:900; font-size:.82rem; letter-spacing:.06em; text-align:center; text-shadow:0 1px 0 #fff6; margin-bottom:6px}
.reveal-scratch .scratch-head small{display:block; font-size:.62rem; font-weight:700; letter-spacing:.02em; color:#9a4a10}
.reveal-scratch .scratch-grid{display:flex; flex-wrap:wrap; justify-content:center; gap:8px}
.reveal-scratch .scratch-spot{position:relative; flex:0 0 calc(50% - 4px); height:62px; padding:0; border:2px solid #b8860b; border-radius:9px; overflow:hidden;
  background:repeating-linear-gradient(45deg, #fffaf0 0 6px, #fff3da 6px 12px); cursor:pointer; touch-action:none}
.reveal-scratch .scratch-prize{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; padding:2px 4px;
  color:#3b2a2a; font-weight:800; font-size:.72rem; line-height:1.12; overflow-wrap:anywhere}
.reveal-scratch .scratch-prize em{font-style:normal; font-size:.58rem; color:#b83659; letter-spacing:.04em}
.reveal-scratch canvas{position:absolute; inset:0; width:100%; height:100%; transition:opacity .35s; touch-action:none}
.reveal-scratch .scratch-spot.cleared canvas{opacity:0}
.reveal-scratch .scratch-spot.cleared .scratch-prize{animation:scratch-pop .45s cubic-bezier(.3,1.6,.5,1)}
.reveal-scratch .scratch-spot.cleared{border-color:#e4577a; box-shadow:0 0 0 2px #ffd76a}
@keyframes scratch-pop{0%{transform:scale(.6)} 70%{transform:scale(1.1)} 100%{transform:scale(1)}}
.reveal-scratch .scratch-spot.nudge{animation:scratch-nudge .3s ease-in-out 2}
@keyframes scratch-nudge{25%{transform:translateX(-3px)} 75%{transform:translateX(3px)}}
.reveal-scratch .scratch-foot{margin-top:6px; display:flex; justify-content:space-between; font-size:.58rem; font-weight:700; color:#9a4a10}
`,
  run(stage, round, ctx){
    if (ctx.quick) stage.classList.add('hd-q');
    stage.innerHTML = `<div class="scratch-ticket"><div class="scratch-head">★ LUCKY CLASS TICKET ★<small>Scratch a silver spot to see a class!</small></div>` +
      `<div class="scratch-grid">${round.labels.map((_, j) => `<button type="button" class="scratch-spot" data-tap aria-label="Scratch spot ${j + 1}"><span class="scratch-prize"></span><canvas></canvas></button>`).join('')}</div>` +
      `<div class="scratch-foot"><span>No. ${String(1000 + round.labels.length * 37).slice(-4)}</span><span>${ctx.esc(ctx.pet)} Pet World Lotto</span></div></div>`;
    const spots = [...stage.querySelectorAll('.scratch-spot')];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const S = spots.map(btn => {
      const cv = btn.querySelector('canvas'), w = cv.clientWidth || 130, h = cv.clientHeight || 62;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const g = cv.getContext('2d');
      g.scale(dpr, dpr);
      const grad = g.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#b9bec2'); grad.addColorStop(.45, '#eef1f3'); grad.addColorStop(.55, '#d4d8db'); grad.addColorStop(1, '#9ea5aa');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      for (let d = 0; d < 70; d++) { g.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.55)' : 'rgba(90,96,100,.25)'; g.fillRect(rand(0, w), rand(0, h), 1.5, 1.5); }
      g.fillStyle = '#6f777c'; g.font = '800 12px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('✦ SCRATCH ✦', w / 2, h / 2);
      g.globalCompositeOperation = 'destination-out'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 22;
      return {btn, cv, g, w, h, label:-1, drawing:false, moved:0, last:null, moves:0, auto:false, finished:false};
    });
    return new Promise(done => {
      let k = 0, active = null;
      ctx.hint('Scratch a silver spot! 🪙');
      const cleared = s => {
        const data = s.g.getImageData(0, 0, s.cv.width, s.cv.height).data;
        let gone = 0, all = 0;
        for (let p = 3; p < data.length; p += 32) { all++; if (data[p] < 40) gone++; }
        return all ? gone / all : 0;
      };
      const pt = (s, e) => { const r = s.cv.getBoundingClientRect(); return {x:(e.clientX ?? -99) - r.left, y:(e.clientY ?? -99) - r.top}; };
      const scrape = (s, a, b) => { s.g.beginPath(); s.g.moveTo(a.x, a.y); s.g.lineTo(b.x + .1, b.y); s.g.stroke(); };
      const claim = s => {   // the first touch on a spot decides its class: always the next pick
        if (s.finished || s.auto) return false;
        if (active && active !== s) { active.btn.classList.remove('nudge'); void active.btn.offsetWidth; active.btn.classList.add('nudge'); ctx.hint('Finish this spot first! 🪙'); return false; }
        if (s.label < 0) {
          if (k >= round.picks.length) return false;
          s.label = round.picks[k++]; active = s;
          s.btn.querySelector('.scratch-prize').innerHTML = `<em>YOU GOT</em>${ctx.esc(round.labels[s.label])}`;
          ctx.hint('Keep scratching! ✨');
        }
        return true;
      };
      const finish = async s => {
        if (s.finished) return;
        s.finished = true; s.drawing = false;
        s.btn.classList.add('cleared'); s.btn.setAttribute('data-done', ''); s.btn.setAttribute('aria-label', round.labels[s.label]);
        ctx.reveal(s.label); ctx.sfx('coin');
        burst(s.btn.parentElement, s.btn.offsetLeft + s.btn.offsetWidth / 2, s.btn.offsetTop + s.btn.offsetHeight / 2, {n:12});
        active = null;
        if (k < round.picks.length) { ctx.hint('Scratch another spot!'); return; }
        S.filter(o => !o.finished).forEach(o => { o.finished = true; o.btn.setAttribute('data-done', ''); o.btn.setAttribute('aria-disabled', 'true'); o.btn.tabIndex = -1; o.btn.classList.add('hd-left'); });
        ctx.hint('');
        await ctx.wait(900);
        done();
      };
      const autoScratch = async s => {   // a tap, click or Enter: scratch it for her
        if (s.auto || s.finished) return;
        s.auto = true; s.drawing = false;
        const steps = ctx.quick ? 4 : 10;
        let prev = {x:4, y:6};
        for (let d = 1; d <= steps; d++) {
          const next = {x:d % 2 ? s.w - 4 : 4, y:6 + (s.h - 12) * d / steps};
          scrape(s, prev, next); prev = next;
          if (d % 3 === 1) ctx.sfx('tick');
          await new Promise(ok => setTimeout(ok, ctx.quick ? 30 : 55));
        }
        finish(s);
      };
      if (!round.picks.length) { S.forEach(s => { s.btn.setAttribute('data-done', ''); s.btn.classList.add('hd-left'); }); ctx.wait(300).then(done); return; }
      S.forEach(s => {
        const b = s.btn;
        b.addEventListener('pointerdown', e => {
          if (!claim(s)) return;
          s.drawing = true; s.moved = 0; s.last = pt(s, e);
          try { b.setPointerCapture(e.pointerId); } catch {}
          scrape(s, s.last, s.last);
        });
        b.addEventListener('pointermove', e => {
          if (!s.drawing || s.finished || s.auto) return;
          const p = pt(s, e);
          s.moved += Math.hypot(p.x - s.last.x, p.y - s.last.y);
          scrape(s, s.last, p); s.last = p;
          if (++s.moves % 4 === 0) { if (s.moves % 12 === 0) ctx.sfx('tick'); if (cleared(s) >= .45) finish(s); }
        });
        const up = () => { if (!s.drawing) return; s.drawing = false; if (!s.finished && !s.auto && cleared(s) >= .45) finish(s); };
        b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
        b.addEventListener('click', () => {
          if (s.finished || s.auto) return;
          if (s.label < 0 && !claim(s)) return;
          if (active && active !== s) { claim(s); return; }
          if (s.moved < 12) autoScratch(s);   // a tap (or the keyboard), not a real scratch
          s.moved = 0;
        });
      });
    });
  }
};

/* ───────────────────────── 🥚 eggs ───────────────────────── */
const EGG_PATTERNS = [
  'radial-gradient(circle, #e8739a 3px, transparent 3.5px) 0 0/15px 15px, radial-gradient(circle, #e8739a 2px, transparent 2.5px) 7px 7px/15px 15px, #ffd3e2',
  'linear-gradient(135deg, #5fb8dc 25%, transparent 25%) -7px 0/14px 14px, linear-gradient(225deg, #5fb8dc 25%, transparent 25%) -7px 0/14px 14px, #d6f0fa',
  'repeating-linear-gradient(0deg, #ffe48a 0 7px, #ffb74d 7px 12px)',
  'radial-gradient(circle, #6b8f5e 1.5px, transparent 2px) 0 0/9px 11px, radial-gradient(circle, #6b8f5e 1px, transparent 1.5px) 4px 5px/9px 11px, #cdeec0',
  'repeating-linear-gradient(60deg, #c9a7f0 0 6px, #eadcff 6px 13px)',
  'radial-gradient(circle at 30% 70%, #ff9f43 5px, transparent 5.5px) 0 0/20px 20px, #fff1c9'
];
function zig(teeth = 8, mid = 47, amp = 6){
  return Array.from({length:teeth + 1}, (_, j) => [j * 100 / teeth, mid + (j % 2 ? amp : -amp)]);
}
const ZIG = zig();
const EGG_TOP = `polygon(0 0, 100% 0, ${[...ZIG].reverse().map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
const EGG_BOT = `polygon(${ZIG.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0 100%)`;

export const eggs = {
  id:'eggs', title:'🥚 Hatch the eggs!',
  css:common('eggs') + `
.reveal-eggs{height:216px}
.reveal-eggs .eggs-rim{position:absolute; left:3%; right:3%; bottom:52px; height:34px; border-radius:50%; background:#6e431e; box-shadow:inset 0 6px 10px rgba(0,0,0,.45)}
.reveal-eggs .eggs-nest{position:absolute; left:1%; right:1%; bottom:6px; height:66px; border-radius:12px 12px 50% 50% / 12px 12px 100% 100%; z-index:3; pointer-events:none;
  background:repeating-linear-gradient(18deg, transparent 0 5px, rgba(60,30,8,.45) 5px 7px), repeating-linear-gradient(-24deg, #a8743f 0 4px, #8d5a2b 4px 8px, #c08b4f 8px 10px);
  box-shadow:0 6px 10px rgba(0,0,0,.35), inset 0 4px 0 #c99a5c}
.reveal-eggs .eggs-row{position:absolute; left:4%; right:4%; bottom:58px; top:0; display:flex; z-index:2}
.reveal-eggs .eggs-item{position:relative; flex:1 1 0; min-width:0; padding:0; border:0; background:none; cursor:pointer}
.reveal-eggs .eggs-egg{position:absolute; left:50%; bottom:0; width:50px; height:64px; margin-left:-25px; transform-origin:50% 90%}
.reveal-eggs .eggs-item.ready:not([data-done]) .eggs-egg{animation:eggs-idle 3s ease-in-out var(--dl,0s) infinite}
@keyframes eggs-idle{0%,84%,100%{transform:none} 88%{transform:rotate(-6deg)} 94%{transform:rotate(5deg)}}
.reveal-eggs .eggs-half{position:absolute; inset:0; border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; background:var(--pat);
  box-shadow:inset -6px -6px 10px rgba(0,0,0,.18), inset 5px 4px 8px rgba(255,255,255,.5); transition:transform .5s cubic-bezier(.3,1.3,.5,1), opacity .5s}
.reveal-eggs .eggs-top{clip-path:${EGG_TOP}; z-index:2}
.reveal-eggs .eggs-bot{clip-path:${EGG_BOT}; z-index:2}
.reveal-eggs .eggs-crack{position:absolute; inset:0; width:100%; height:100%; z-index:3; overflow:visible}
.reveal-eggs .eggs-crack polyline{fill:none; stroke:#4e342e; stroke-width:2.5; stroke-linejoin:round; vector-effect:non-scaling-stroke; stroke-dasharray:100; stroke-dashoffset:100; transition:stroke-dashoffset .4s ease-out}
.reveal-eggs .eggs-item.wobble .eggs-egg{animation:eggs-wobble .3s ease-in-out 3}
@keyframes eggs-wobble{0%,100%{transform:rotate(0)} 25%{transform:rotate(-11deg)} 75%{transform:rotate(11deg)}}
.reveal-eggs .eggs-item.cracked polyline{stroke-dashoffset:0}
.reveal-eggs .eggs-item.hatched .eggs-top{transform:translate(-14px,-38px) rotate(-38deg); opacity:0}
.reveal-eggs .eggs-item.hatched polyline{opacity:0}
.reveal-eggs .eggs-baby{position:absolute; left:50%; bottom:14px; width:44px; margin-left:-22px; font-size:36px; line-height:1; text-align:center; z-index:1; opacity:0; transform:translateY(20px)}
.reveal-eggs .eggs-item.hatched .eggs-baby{opacity:1; animation:eggs-out .5s cubic-bezier(.3,1.6,.5,1) forwards}
@keyframes eggs-out{from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(-22px)}}
.reveal-eggs .eggs-sign{position:absolute; left:-3px; right:-3px; bottom:82px; display:flex; flex-direction:column; align-items:center; z-index:4}
.reveal-eggs .eggs-sign:empty::after{display:none}
.reveal-eggs .eggs-sign::after{content:''; width:3px; height:12px; background:#8d5a2b; border-radius:2px; animation:eggs-pop .3s .1s both}
`,
  async run(stage, round, ctx){
    if (ctx.quick) stage.classList.add('hd-q');
    const pts = ZIG.map(([x, y]) => `${x},${y}`).join(' ');
    stage.innerHTML = `<div class="eggs-rim" aria-hidden="true"></div><div class="eggs-row">` + round.labels.map((_, j) =>
      `<button type="button" class="eggs-item ready" data-tap aria-label="Egg ${j + 1}" style="--pat:${EGG_PATTERNS[j % EGG_PATTERNS.length]}; --dl:${(j * .5).toFixed(1)}s">` +
      `<span class="eggs-baby"></span><span class="eggs-egg"><span class="eggs-half eggs-top"></span><span class="eggs-half eggs-bot"></span>` +
      `<svg class="eggs-crack" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" pathLength="100"/></svg></span>` +
      `<span class="eggs-sign"></span></button>`).join('') + `</div><div class="eggs-nest" aria-hidden="true"></div>`;
    await tapLoop(stage, round, ctx, {
      hint:'Tap an egg to hatch it! 🥚', again:'Hatch another egg!',
      async open(item, i, k, show){
        item.querySelector('.eggs-baby').textContent = BABIES[k % BABIES.length];
        item.classList.add('wobble'); ctx.sfx('tick');
        await ctx.wait(500);
        item.classList.add('cracked'); ctx.sfx('tick');
        await ctx.wait(500);
        item.classList.remove('wobble'); item.classList.add('hatched');
        const e = boxIn(item, item.querySelector('.eggs-egg'));
        burst(item, e.x, e.t + 26, {n:8, colors:['#fffaf0', '#f3e7d3', '#ffffff'], up:36, spread:30, size:6, ms:550});
        await ctx.wait(380);
        item.querySelector('.eggs-sign').innerHTML = tagHTML(ctx, round.labels[i]);
        show(); ctx.sfx('good');
        burst(item, e.x, e.t - 10, {n:10});
        await ctx.wait(650);
      }
    });
  }
};

/* ───────────────────────── 🥠 fortune ───────────────────────── */
export const fortune = {
  id:'fortune', title:'🥠 Crack a fortune cookie!',
  css:common('fortune') + `
.reveal-fortune{height:212px}
.reveal-fortune .fortune-plate{position:absolute; left:0; right:0; top:4px; bottom:8px; border-radius:50%;
  background:radial-gradient(ellipse at center, #ffffff 0 56%, #dbe7f3 58% 61%, #3d72b8 62% 64.5%, #f7fbff 65.5% 100%);
  box-shadow:0 6px 0 #b9c9da, 0 12px 20px rgba(0,0,0,.4)}
.reveal-fortune .fortune-row{position:absolute; left:6%; right:6%; top:42px; bottom:14px; display:flex; gap:2px}
.reveal-fortune .fortune-item{position:relative; flex:1 1 0; min-width:0; padding:0; border:0; background:none; cursor:pointer}
.reveal-fortune .fortune-cookie{position:absolute; left:50%; top:4px; width:56px; height:50px; margin-left:-28px}
.reveal-fortune .fortune-half{position:absolute; inset:0; font-size:42px; line-height:50px; text-align:center; filter:drop-shadow(0 3px 2px rgba(0,0,0,.25));
  transition:transform .45s cubic-bezier(.3,1.4,.5,1)}
.reveal-fortune .fortune-half.l{clip-path:inset(0 50% 0 0)}
.reveal-fortune .fortune-half.r{clip-path:inset(0 0 0 50%)}
.reveal-fortune .fortune-item.ready:not([data-done]) .fortune-cookie{animation:fortune-idle 3.2s ease-in-out var(--dl,0s) infinite}
@keyframes fortune-idle{0%,82%,100%{transform:none} 88%{transform:translateY(-6px) rotate(-6deg)} 94%{transform:translateY(0) rotate(4deg)}}
.reveal-fortune .fortune-item.shake .fortune-cookie{animation:fortune-shake .12s linear 5}
@keyframes fortune-shake{0%,100%{transform:translateX(0) rotate(0)} 25%{transform:translateX(-3px) rotate(-5deg)} 75%{transform:translateX(3px) rotate(5deg)}}
.reveal-fortune .fortune-item.cracked .fortune-half.l{transform:translate(-13px, 6px) rotate(-24deg)}
.reveal-fortune .fortune-item.cracked .fortune-half.r{transform:translate(13px, 6px) rotate(24deg)}
.reveal-fortune .fortune-slip{position:absolute; left:-2px; right:-2px; top:46px; display:none; z-index:3}
.reveal-fortune .fortune-item.slip .fortune-slip{display:block; animation:fortune-slide .5s cubic-bezier(.3,1.3,.5,1) both}
@keyframes fortune-slide{0%{clip-path:inset(0 50% 0 50%); transform:translateY(-18px) scaleY(.6)} 100%{clip-path:inset(0 0 0 0); transform:rotate(var(--tilt,-2deg))}}
.reveal-fortune .fortune-paper{display:block; padding:4px 3px 5px; background:#fffdf6; color:#b83659; border-radius:2px; text-align:center; line-height:1.15;
  box-shadow:0 3px 5px rgba(0,0,0,.3); background-image:linear-gradient(90deg, transparent 4px, rgba(184,54,89,.15) 4px 5px, transparent 5px calc(100% - 5px), rgba(184,54,89,.15) calc(100% - 5px) calc(100% - 4px), transparent calc(100% - 4px))}
.reveal-fortune .fortune-paper small{display:block; font-size:.56rem; font-style:italic; color:#7a5a55}
.reveal-fortune .fortune-paper b{display:block; font-size:.68rem; color:#3b2a2a; overflow-wrap:anywhere}
`,
  async run(stage, round, ctx){
    if (ctx.quick) stage.classList.add('hd-q');
    stage.innerHTML = `<div class="fortune-plate" aria-hidden="true"></div><div class="fortune-row">` + round.labels.map((_, j) =>
      `<button type="button" class="fortune-item ready" data-tap aria-label="Fortune cookie ${j + 1}" style="--dl:${(j * .45).toFixed(2)}s; --tilt:${j % 2 ? 2 : -2}deg">` +
      `<span class="fortune-cookie"><span class="fortune-half l">🥠</span><span class="fortune-half r">🥠</span></span>` +
      `<span class="fortune-slip"></span></button>`).join('') + `</div>`;
    await tapLoop(stage, round, ctx, {
      hint:'Tap a cookie to crack it! 🥠', again:'Crack another cookie!',
      async open(item, i, k, show){
        item.classList.add('shake'); ctx.sfx('tick');
        await ctx.wait(600);
        item.classList.remove('shake'); item.classList.add('cracked'); ctx.sfx('tick');
        const c = boxIn(item, item.querySelector('.fortune-cookie'));
        burst(item, c.x, c.y, {n:9, colors:CRUMBS, up:30, spread:30, size:5, ms:550});
        await ctx.wait(300);
        item.querySelector('.fortune-slip').innerHTML = `<span class="fortune-paper"><small>Your fortune:</small><b>${ctx.esc(round.labels[i])}</b></span>`;
        item.classList.add('slip');
        await ctx.wait(250);
        show(); ctx.sfx('coin');
        burst(item, c.x, c.y + 40, {n:10});
        await ctx.wait(650);
      }
    });
  }
};
