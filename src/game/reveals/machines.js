/* 🎠🕹️🍬📬 machine reveal styles: the merry-go-round, the claw machine, the gumball machine and mail call.
   Every one of them only puts on the show: the classes are already picked (round.picks) and each style lands on
   those picks, in order. Random-looking bits (gumball spots, wobbles) are decoration only. See index.js. */

const BRIGHT = ['#ff5d73', '#ffb627', '#4cc9f0', '#7bd389', '#b388eb', '#ff8fab', '#f3e05a', '#ff9f1c'];
const PASTEL = ['#f6b8c8', '#bfe3c9', '#bcd7f5', '#f8dc9b', '#d8c6f2', '#f5c3a3', '#b9e6e6', '#e6e2a8'];
const ease = {
  out:p => 1 - Math.pow(1 - p, 3),
  inOut:p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  in:p => p * p
};

/* run fn(easedProgress) every frame for ms. A timer finishes it if frames stop (a hidden tab), so a show never hangs. */
function tween(ms, fn, e = ease.out){
  return new Promise(ok => {
    let done = false;
    const t0 = performance.now();
    const end = () => { if (done) return; done = true; fn(1); ok(); };
    if (!(ms > 0)) { end(); return; }
    const step = now => { if (done) return; const p = (now - t0) / ms; if (p >= 1) { end(); return; } fn(e(Math.max(0, p))); requestAnimationFrame(step); };
    requestAnimationFrame(step);
    setTimeout(end, ms + 500);
  });
}
const dur = (ctx, full, quick) => (ctx.quick ? quick : full);

/* a tap target that is live until she taps it once (data-done marks it used, for the preview's auto mode too) */
function tapOnce(el){
  delete el.dataset.done;
  el.classList.add('ready');
  return new Promise(ok => el.addEventListener('click', () => { el.dataset.done = '1'; el.classList.remove('ready'); ok(); }, {once:true}));
}
/* an element's box relative to another element */
function rel(el, base){
  const b = base.getBoundingClientRect(), r = el.getBoundingClientRect();
  return {x:r.left - b.left + r.width / 2, y:r.top - b.top + r.height / 2, top:r.top - b.top, bottom:r.bottom - b.top, left:r.left - b.left, w:r.width, h:r.height};
}

/* ───────────── 🎠 merry-go-round ───────────── */
export const merry = {
  id:'merry', title:'🎠 Ride the merry-go-round!',
  css:`
.reveal-merry{height:284px; overflow:hidden}
.reveal-merry .mg-top{position:absolute; left:3%; right:3%; top:16px; z-index:200; filter:drop-shadow(0 3px 2px rgba(0,0,0,.35))}
.reveal-merry .mg-flag{position:absolute; left:50%; top:-15px; margin-left:-3px; font-size:1rem; line-height:1}
.reveal-merry .mg-roof{height:40px; clip-path:polygon(50% 0,100% 45%,100% 100%,0 100%,0 45%); background:repeating-conic-gradient(from 0deg at 50% 0,#e4577a 0 6deg,#fff4f6 6deg 12deg)}
.reveal-merry .mg-band{height:13px; background:radial-gradient(circle,#fffbd0 0 2px,transparent 3px) 0 50%/14px 13px repeat-x,linear-gradient(#f2c14e,#c98d1c); border-radius:2px}
.reveal-merry .mg-scal{height:10px; background:radial-gradient(circle at 9px 0,#e4577a 0 8px,transparent 9px) 0 0/18px 10px repeat-x}
.reveal-merry .mg-pole{position:absolute; left:50%; top:70px; width:14px; height:140px; margin-left:-7px; z-index:50; border-radius:4px; background:repeating-linear-gradient(160deg,#f2c14e 0 8px,#fff4c2 8px 14px); box-shadow:inset -3px 0 0 rgba(0,0,0,.15)}
.reveal-merry .mg-floor{position:absolute; left:3%; right:3%; top:194px; height:44px; z-index:1; border-radius:50%; background:radial-gradient(ellipse at 50% 35%,#ffe9a8,#e0a93a 70%); box-shadow:0 6px 0 #9a6a45,0 10px 10px rgba(0,0,0,.35)}
.reveal-merry .mg-h{position:absolute; left:0; top:0; width:96px; text-align:center; transform-origin:50% 40%; will-change:transform}
.reveal-merry .mg-rod{position:absolute; left:50%; bottom:55%; width:4px; height:90px; margin-left:-2px; z-index:-1; background:linear-gradient(90deg,#c9971f,#fff1b8,#c9971f)}
.reveal-merry .mg-emo{font-size:2.1rem; line-height:1.05; filter:drop-shadow(0 2px 1px rgba(0,0,0,.35))}
.reveal-merry .mg-sign{display:inline-block; max-width:92px; padding:2px 6px; border-radius:8px; background:#fff; border:2px solid #e4577a; color:#3b2a2a; font-weight:700; font-size:.68rem; line-height:1.15; box-shadow:0 2px 3px rgba(0,0,0,.3); overflow-wrap:anywhere}
.reveal-merry .mg-h.got .mg-sign{border-color:#7bd389}
.reveal-merry .mg-h.on .mg-in{animation:merry-hop .55s ease-in-out 3}
.reveal-merry .mg-h.on .mg-sign{border-color:#ffd76a; background:#fff8d6; animation:merry-glow .8s ease-in-out infinite alternate}
.reveal-merry .mg-pet{position:absolute; left:50%; top:240px; margin-left:-1rem; font-size:2rem; line-height:1; z-index:120}
.reveal-merry .mg-pet.yay{animation:reveal-bounce .5s 2}
@keyframes merry-hop{0%,100%{transform:translateY(0)} 45%{transform:translateY(-14px) rotate(-6deg)}}
@keyframes merry-glow{from{box-shadow:0 0 0 3px #ffd76a,0 0 6px 2px rgba(255,215,106,.6)} to{box-shadow:0 0 0 3px #ffd76a,0 0 18px 8px rgba(255,215,106,.95)}}
`,
  async run(stage, round, ctx){
    const L = round.labels, n = L.length, step = 2 * Math.PI / n, RIDES = ['🐴', '🦄', '🦓', '🐎', '🦒', '🐘', '🦌', '🐖'];
    stage.innerHTML = `<div class="mg-top" aria-hidden="true"><span class="mg-flag">🚩</span><div class="mg-roof"></div><div class="mg-band"></div><div class="mg-scal"></div></div>
      <div class="mg-pole" aria-hidden="true"></div><div class="mg-floor" aria-hidden="true"></div>
      ${L.map((t, i) => `<div class="mg-h"><div class="mg-rod" aria-hidden="true"></div><div class="mg-in"><div class="mg-emo" aria-hidden="true">${RIDES[i % RIDES.length]}</div><div class="mg-sign">${ctx.esc(t)}</div></div></div>`).join('')}
      <div class="mg-pet" aria-hidden="true">${ctx.esc(ctx.pet)}</div>`;
    const hs = [...stage.querySelectorAll('.mg-h')], pet = stage.querySelector('.mg-pet');
    const W = stage.clientWidth || 300, CX = W / 2, RX = Math.min(112, W / 2 - 46), CY = 102, RY = 26;
    let A = 0;   // the carousel's turn: horse i sits at angle A + i*step, and angle 0 is the front center
    const draw = now => hs.forEach((h, i) => {
      const th = A + i * step, d = Math.cos(th), s = .6 + .4 * (d + 1) / 2;
      const y = CY + RY * d + (ctx.quick ? 0 : Math.sin(now / 260 + i * 1.9) * 5);
      h.style.transform = `translate(${CX + RX * Math.sin(th) - 48}px,${y}px) scale(${s})`;
      h.style.zIndex = String(50 + Math.round(d * 40));
      h.style.filter = d < -.2 ? 'brightness(.78)' : '';
    });
    const loop = now => { if (!hs[0].isConnected) return; draw(now); requestAnimationFrame(loop); };
    draw(performance.now()); requestAnimationFrame(loop);

    if (ctx.first) await ctx.button('Ride! 🎠'); else await ctx.wait(500);
    const mod = x => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    for (const i of round.picks) {
      ctx.hint('Round and round she goes… 🎶');
      hs.forEach(h => h.classList.remove('on')); pet.classList.remove('yay');
      const from = A, to = A + mod(-i * step - A) + 2 * Math.PI * (ctx.quick ? 0 : 2);
      let last = Math.round(from / step);
      await tween(dur(ctx, 3600, 500), p => {
        A = from + (to - from) * p;
        const f = Math.round(A / step);
        if (f !== last) { last = f; ctx.sfx('tick'); }
      }, p => 1 - Math.pow(1 - p, 2.6));
      A = to;
      hs[i].classList.add('on', 'got'); pet.classList.add('yay');
      ctx.hint('');
      ctx.sfx('good');
      ctx.reveal(i);
      await ctx.wait(1300);
    }
  }
};

/* ───────────── 🕹️ claw machine ───────────── */
export const claw = {
  id:'claw', title:'🕹️ Try the claw machine!',
  css:`
.reveal-claw .cl-cab{position:relative; height:244px; margin:0 2px; padding:30px 10px 26px; border-radius:18px 18px 8px 8px; background:linear-gradient(#9a6af0,#6a3fc4); box-shadow:inset 0 -6px 0 rgba(0,0,0,.2),0 4px 10px rgba(0,0,0,.35)}
.reveal-claw .cl-sign{position:absolute; left:0; right:0; top:6px; text-align:center; font-weight:800; font-size:.8rem; letter-spacing:.08em; color:#ffd76a; text-shadow:0 0 6px #ff5d73}
.reveal-claw .cl-sign::before,.reveal-claw .cl-sign::after{content:""; position:absolute; top:5px; width:56px; height:8px; background:radial-gradient(circle,#fffbd0 0 2.5px,transparent 3.5px) 0 0/11px 8px repeat-x; animation:claw-blink .8s steps(2) infinite}
.reveal-claw .cl-sign::before{left:10px}
.reveal-claw .cl-sign::after{right:10px; animation-delay:.4s}
.reveal-claw .cl-glass{position:relative; height:100%; overflow:hidden; border-radius:8px; border:3px solid #d9ccff; background:linear-gradient(180deg,#1d2a44,#33476b)}
.reveal-claw .cl-rail{position:absolute; left:0; right:0; top:0; height:8px; z-index:3; background:linear-gradient(#c8ccd6,#7d8494)}
.reveal-claw .cl-chute{position:absolute; left:0; bottom:0; width:56px; height:62px; z-index:1; display:flex; align-items:flex-end; justify-content:center; border:3px solid rgba(220,230,255,.75); border-bottom:0; border-left:0; background:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6))}
.reveal-claw .cl-chute span{margin-bottom:4px; font-size:.55rem; font-weight:800; letter-spacing:.06em; color:#ffd76a}
.reveal-claw .cl-pile{position:absolute; left:60px; right:2px; bottom:4px; z-index:2; display:flex; flex-wrap:wrap-reverse; align-items:flex-end}
.reveal-claw .cl-prize{padding:0 1px; text-align:center}
.reveal-claw .cl-plush{font-size:1.9rem; line-height:1.05; filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}
.reveal-claw .cl-tag{padding:2px 3px; border-radius:6px; color:#3b2a2a; font-weight:700; font-size:.62rem; line-height:1.1; overflow-wrap:anywhere; box-shadow:0 1px 2px rgba(0,0,0,.4)}
.reveal-claw .cl-prize.gone .cl-plush{visibility:hidden}
.reveal-claw .cl-prize.gone .cl-tag{opacity:.3}
.reveal-claw .cl-car{position:absolute; left:0; top:2px; width:44px; z-index:4; display:flex; flex-direction:column; align-items:center; will-change:transform}
.reveal-claw .cl-block{width:30px; height:12px; border-radius:4px; background:linear-gradient(#eef0f5,#9aa1b1); box-shadow:0 2px 2px rgba(0,0,0,.4)}
.reveal-claw .cl-str{width:2px; height:0; background:#d8dce6}
.reveal-claw .cl-head{position:relative; width:44px; height:40px; transform-origin:50% 0}
.reveal-claw .cl-head.wob{animation:claw-wobble .3s ease-in-out 2}
.reveal-claw .cl-hub{position:absolute; left:13px; top:0; width:18px; height:14px; z-index:2; border-radius:4px 4px 9px 9px; background:radial-gradient(circle at 40% 30%,#fff,#aab1c0 60%,#6d7485)}
.reveal-claw .cl-p{position:absolute; top:8px; width:14px; height:28px; z-index:2; border:4px solid #c4cad6; border-top:0; transition:transform .25s}
.reveal-claw .cl-p.l{left:7px; border-right:0; border-radius:0 0 0 14px; transform-origin:100% 0; transform:rotate(24deg)}
.reveal-claw .cl-p.r{right:7px; border-left:0; border-radius:0 0 14px 0; transform-origin:0 0; transform:rotate(-24deg)}
.reveal-claw .cl-head.shut .cl-p.l{transform:rotate(-4deg)}
.reveal-claw .cl-head.shut .cl-p.r{transform:rotate(4deg)}
.reveal-claw .cl-held{position:absolute; left:0; right:0; top:12px; z-index:1; text-align:center; font-size:1.7rem; line-height:1}
.reveal-claw .cl-fall{position:absolute; top:0; width:34px; z-index:2; text-align:center; font-size:1.7rem; line-height:1}
.reveal-claw .cl-glare{position:absolute; inset:0; z-index:5; pointer-events:none; background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.13) 38%,transparent 46%)}
.reveal-claw .cl-door{position:absolute; left:13px; bottom:5px; width:56px; height:15px; border-radius:4px; background:#2a1a4a; box-shadow:inset 0 3px 4px rgba(0,0,0,.6)}
.reveal-claw .cl-door.pop{animation:reveal-shake .1s 3}
.reveal-claw .cl-stick{position:absolute; right:14px; bottom:1px; font-size:1.2rem; line-height:1}
.reveal-claw .cl-got{display:flex; flex-wrap:wrap; justify-content:center; gap:4px; min-height:26px; margin-top:6px}
.reveal-claw .cl-won{padding:2px 8px; border-radius:10px; color:#3b2a2a; font-weight:700; font-size:.75rem; line-height:1.3; box-shadow:0 2px 3px rgba(0,0,0,.3); animation:reveal-pop .45s}
@keyframes claw-wobble{0%,100%{transform:rotate(0)} 25%{transform:rotate(-9deg)} 75%{transform:rotate(9deg)}}
@keyframes claw-blink{50%{opacity:.35}}
`,
  async run(stage, round, ctx){
    const L = round.labels, n = L.length, PL = ['🧸', '🐰', '🦊', '🐸', '🐼', '🐨', '🐷', '🐵'], per = Math.min(n, 4);
    stage.innerHTML = `<div class="cl-cab"><div class="cl-sign" aria-hidden="true">PRIZE CLAW</div>
      <div class="cl-glass"><div class="cl-rail" aria-hidden="true"></div><div class="cl-chute" aria-hidden="true"><span>PRIZE</span></div>
        <div class="cl-pile">${L.map((t, i) => `<div class="cl-prize" style="width:${(100 / per).toFixed(2)}%"><div class="cl-plush" aria-hidden="true">${PL[i % PL.length]}</div><div class="cl-tag" style="background:${PASTEL[i % PASTEL.length]}">${ctx.esc(t)}</div></div>`).join('')}</div>
        <div class="cl-car" aria-hidden="true"><div class="cl-block"></div><div class="cl-str"></div><div class="cl-head"><div class="cl-hub"></div><div class="cl-p l"></div><div class="cl-p r"></div><div class="cl-held"></div></div></div>
        <div class="cl-glare" aria-hidden="true"></div></div>
      <div class="cl-door" aria-hidden="true"></div><div class="cl-stick" aria-hidden="true">🕹️</div></div>
      <div class="cl-got"></div>`;
    const $ = s => stage.querySelector(s), glass = $('.cl-glass'), car = $('.cl-car'), str = $('.cl-str'), head = $('.cl-head'), held = $('.cl-held');
    const prizes = [...stage.querySelectorAll('.cl-prize')], chuteX = () => rel($('.cl-chute'), glass).x;
    let x = chuteX(), len = 0;
    const place = () => { car.style.transform = `translateX(${x - 22}px)`; str.style.height = `${len}px`; };
    place();
    for (const i of round.picks) {
      await ctx.button('Drop the claw! 🕹️');
      const prize = prizes[i], plush = prize.querySelector('.cl-plush'), to = rel(plush, glass).x, x0 = x;
      ctx.sfx('tick');
      await tween(dur(ctx, 1000, 250), p => { x = x0 + (to - x0) * p; place(); }, ease.inOut);
      const drop = Math.max(8, rel(plush, glass).top - 24);   // prongs close around the plush
      await tween(dur(ctx, 800, 200), p => { len = drop * p; place(); }, ease.out);
      if (!ctx.quick) { head.classList.add('wob'); await ctx.wait(650); head.classList.remove('wob'); }
      head.classList.add('shut'); ctx.sfx('tick');
      held.textContent = plush.textContent; prize.classList.add('gone');
      await ctx.wait(300);
      await tween(dur(ctx, 850, 200), p => { len = drop * (1 - p); place(); }, ease.inOut);
      const cx = chuteX(), x1 = x;
      await tween(dur(ctx, 950, 250), p => { x = x1 + (cx - x1) * p + (ctx.quick ? 0 : Math.sin(p * Math.PI * 3) * 3 * (1 - p)); place(); }, ease.inOut);
      head.classList.remove('shut'); held.textContent = '';
      const fall = document.createElement('div'), y0 = rel(held, glass).top;
      fall.className = 'cl-fall'; fall.textContent = plush.textContent; fall.style.left = `${cx - 17}px`;
      glass.appendChild(fall);
      const y1 = glass.clientHeight + 6;
      await tween(dur(ctx, 500, 150), p => { fall.style.transform = `translateY(${y0 + (y1 - y0) * p}px) rotate(${p * 90}deg)`; }, ease.in);
      fall.remove();
      const door = $('.cl-door'); door.classList.remove('pop'); void door.offsetWidth; door.classList.add('pop');
      ctx.sfx('coin');
      $('.cl-got').insertAdjacentHTML('beforeend', `<span class="cl-won" style="background:${PASTEL[i % PASTEL.length]}">${PL[i % PL.length]} ${ctx.esc(L[i])}</span>`);
      ctx.sfx('good');
      ctx.reveal(i);
      await ctx.wait(700);
    }
  }
};

/* ───────────── 🍬 gumball machine ───────────── */
export const gumball = {
  id:'gumball', title:'🍬 Turn the gumball crank!',
  css:`
.reveal-gumball .gb-mach{position:relative; width:300px; height:262px; margin-left:calc(50% - 150px)}
.reveal-gumball .gb-cap{position:absolute; left:83px; top:4px; width:40px; height:16px; z-index:3; border-radius:20px 20px 4px 4px; background:linear-gradient(#ff6b6b,#c62828)}
.reveal-gumball .gb-globe{position:absolute; left:18px; top:14px; width:170px; height:170px; z-index:2; overflow:hidden; border-radius:50%; border:3px solid rgba(255,255,255,.75); background:radial-gradient(circle at 50% 60%,rgba(190,230,255,.22),rgba(120,170,210,.3)); box-shadow:inset -10px -12px 24px rgba(0,0,0,.28)}
.reveal-gumball .gb-globe::after{content:""; position:absolute; left:20%; top:9%; width:30%; height:17%; z-index:3; border-radius:50%; background:rgba(255,255,255,.45); transform:rotate(-30deg)}
.reveal-gumball .gb-globe.jig{animation:reveal-shake .12s 3}
.reveal-gumball .gb-b{position:absolute; width:22px; height:22px; border-radius:50%; background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.8) 0 2px,var(--c) 5px); box-shadow:inset -2px -3px 3px rgba(0,0,0,.25); transition:transform .35s,opacity .35s}
.reveal-gumball .gb-b.gone{transform:translateY(46px) scale(.2); opacity:0}
.reveal-gumball .gb-neck{position:absolute; left:68px; top:178px; width:70px; height:12px; z-index:3; border-radius:3px; background:#a71d2a}
.reveal-gumball .gb-base{position:absolute; left:28px; top:186px; width:150px; height:72px; z-index:4; background:linear-gradient(90deg,#b71c1c,#ef5350 40%,#c62828); clip-path:polygon(10% 0,90% 0,100% 100%,0 100%)}
.reveal-gumball .gb-base::after{content:""; position:absolute; right:6px; bottom:6px; width:24px; height:26px; border-radius:13px 3px 3px 13px; background:#3a0d12; box-shadow:inset 0 3px 5px rgba(0,0,0,.7)}
.reveal-gumball .gb-lip{position:absolute; left:172px; top:248px; width:22px; height:6px; z-index:5; border-radius:3px; background:linear-gradient(#e6e9f0,#9aa1b1)}
.reveal-gumball .gb-tray{position:absolute; left:186px; top:238px; width:112px; height:22px; z-index:6; border-radius:0 0 56px 56px / 0 0 22px 22px; background:linear-gradient(#e6e9f0,#8a91a0); box-shadow:0 3px 4px rgba(0,0,0,.35)}
.reveal-gumball .gb-crank{position:absolute; left:78px; top:198px; width:50px; height:50px; padding:0; z-index:6; cursor:pointer; border-radius:50%; border:3px solid #7d8494; background:radial-gradient(circle at 40% 35%,#fff,#c9ced8 55%,#8a91a0); box-shadow:0 3px 0 #5b2026}
.reveal-gumball .gb-crank.ready{animation:gumball-pulse 1s ease-in-out infinite}
.reveal-gumball .gb-handle{position:absolute; left:50%; top:50%; width:40px; height:10px; margin:-5px 0 0 -20px; border-radius:5px; background:#5d4037; transition:transform .8s cubic-bezier(.4,0,.2,1)}
.reveal-gumball .gb-handle::after{content:""; position:absolute; right:-7px; top:-4px; width:14px; height:14px; border-radius:50%; background:#ffd76a; border:2px solid #5d4037}
.reveal-gumball .gb-ball{position:absolute; left:0; top:212px; width:34px; height:34px; z-index:3; will-change:transform}
.reveal-gumball .gb-ball .h{position:absolute; inset:0; border-radius:50%; background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.85) 0 3px,var(--c) 8px); box-shadow:inset -3px -4px 5px rgba(0,0,0,.25); transition:transform .4s cubic-bezier(.3,1.6,.5,1)}
.reveal-gumball .gb-ball .h.l{clip-path:inset(0 50% 0 0)}
.reveal-gumball .gb-ball .h.r{clip-path:inset(0 0 0 50%)}
.reveal-gumball .gb-ball.open .h.l{transform:translate(-13px,3px) rotate(-40deg)}
.reveal-gumball .gb-ball.open .h.r{transform:translate(13px,3px) rotate(40deg)}
.reveal-gumball .gb-open{position:absolute; left:188px; top:96px; width:110px; height:112px; z-index:7; display:flex; align-items:flex-end; justify-content:center}
.reveal-gumball .gb-tag{display:inline-block; padding:4px 8px; border-radius:10px; border:3px solid var(--c); background:#fff; color:#3b2a2a; font-weight:800; font-size:.82rem; line-height:1.2; text-align:center; overflow-wrap:anywhere; box-shadow:0 3px 6px rgba(0,0,0,.35); animation:reveal-pop .45s}
.reveal-gumball .gb-got{display:flex; flex-wrap:wrap; justify-content:center; gap:4px; min-height:24px; margin-top:4px}
.reveal-gumball .gb-won{display:inline-flex; align-items:center; gap:4px; padding:2px 8px 2px 4px; border-radius:10px; background:#fff; color:#3b2a2a; font-weight:700; font-size:.72rem; line-height:1.3; box-shadow:0 2px 3px rgba(0,0,0,.3); animation:reveal-pop .4s}
.reveal-gumball .gb-won i{display:inline-block; width:15px; height:8px; margin-top:6px; border-radius:0 0 8px 8px; background:var(--c); box-shadow:0 -2px 0 rgba(255,255,255,.7) inset}
@keyframes gumball-pulse{0%,100%{box-shadow:0 3px 0 #5b2026,0 0 0 0 rgba(255,215,106,.9)} 50%{box-shadow:0 3px 0 #5b2026,0 0 0 9px rgba(255,215,106,0)}}
`,
  async run(stage, round, ctx){
    const L = round.labels, n = L.length, color = i => BRIGHT[i % BRIGHT.length];
    const balls = [];   // packed in rows from the bottom of the globe (inside is 164px across)
    for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) {
      const x = 8 + col * 22 + (row % 2) * 11, y = 138 - row * 20, dx = x + 11 - 82, dy = y + 11 - 82;
      if (dx * dx + dy * dy < 68 * 68) balls.push({x, y, c:(col * 7 + row * 5 + col * row * 3) % n});
    }
    stage.innerHTML = `<div class="gb-mach"><div class="gb-cap" aria-hidden="true"></div>
      <div class="gb-globe" aria-hidden="true">${balls.map(b => `<i class="gb-b" data-c="${b.c}" style="left:${b.x}px; top:${b.y}px; --c:${color(b.c)}"></i>`).join('')}</div>
      <div class="gb-neck" aria-hidden="true"></div><div class="gb-base" aria-hidden="true"></div><div class="gb-lip" aria-hidden="true"></div>
      <div class="gb-tray" aria-hidden="true"></div><div class="gb-open"></div>
      <button type="button" class="gb-crank" data-tap data-done="1" aria-label="Turn the crank"><span class="gb-handle"></span></button></div>
      <div class="gb-got"></div>`;
    const $ = s => stage.querySelector(s), mach = $('.gb-mach'), crank = $('.gb-crank'), handle = $('.gb-handle'), open = $('.gb-open'), globe = $('.gb-globe');
    let turned = 0;
    for (const [j, i] of round.picks.entries()) {
      ctx.hint(j ? 'Another one! Turn the crank 🍬' : 'Tap the crank to turn it! 🍬');
      await tapOnce(crank);
      ctx.hint('');
      turned += 360; handle.style.transition = `transform ${ctx.quick ? .3 : .8}s cubic-bezier(.4,0,.2,1)`; handle.style.transform = `rotate(${turned}deg)`;
      ctx.sfx('tick');
      globe.classList.remove('jig'); void globe.offsetWidth; globe.classList.add('jig');
      const left = [...globe.querySelectorAll(`.gb-b[data-c="${i}"]:not(.gone)`)];
      left.sort((a, b) => parseFloat(b.style.top) - parseFloat(a.style.top))[0]?.classList.add('gone');
      await ctx.wait(ctx.quick ? 200 : 700);
      const ball = document.createElement('div');
      ball.className = 'gb-ball'; ball.style.setProperty('--c', color(i));
      ball.innerHTML = '<span class="h l"></span><span class="h r"></span>';
      mach.appendChild(ball);
      ctx.sfx('tick');
      await tween(dur(ctx, 1100, 250), p => {   // out of the door, down the lip, a little hop into the tray
        const hop = p > .7 ? Math.sin((p - .7) / .3 * Math.PI) * 10 : 0;
        ball.style.transform = `translate(${130 + 96 * p}px,${-hop}px) rotate(${720 * p}deg)`;
      }, ease.out);
      ctx.sfx('coin');
      await ctx.wait(ctx.quick ? 100 : 450);
      ball.classList.add('open');
      open.innerHTML = `<span class="gb-tag" style="--c:${color(i)}">${ctx.esc(L[i])}</span>`;
      ctx.sfx('good');
      ctx.reveal(i);
      await ctx.wait(1300);
      ball.remove(); open.innerHTML = '';
      $('.gb-got').insertAdjacentHTML('beforeend', `<span class="gb-won" style="--c:${color(i)}"><i aria-hidden="true"></i>${ctx.esc(L[i])}</span>`);
      await ctx.wait(250);
    }
  }
};

/* ───────────── 📬 mail call ───────────── */
export const mail = {
  id:'mail', title:'📬 Mail call!',
  css:`
.reveal-mail .ml-scene{position:relative; height:212px; overflow:hidden; border-radius:12px; background:linear-gradient(#7fc2f0,#d2eefb)}
.reveal-mail .ml-cloud{position:absolute; font-size:1.5rem; line-height:1; opacity:.95; animation:mail-drift 6s ease-in-out infinite alternate}
.reveal-mail .ml-grass{position:absolute; left:0; right:0; bottom:26px; height:40px; background:linear-gradient(#8fd17f,#62ad53)}
.reveal-mail .ml-road{position:absolute; left:0; right:0; bottom:0; height:26px; border-top:3px solid #d8d0bc; background:#5c5f66}
.reveal-mail .ml-road::after{content:""; position:absolute; left:0; right:0; top:10px; height:3px; background:repeating-linear-gradient(90deg,#ffd76a 0 16px,transparent 16px 30px)}
.reveal-mail .ml-post{position:absolute; right:76px; bottom:40px; width:12px; height:72px; z-index:3; background:linear-gradient(90deg,#7a4f31,#9a6a45)}
.reveal-mail .ml-box{position:absolute; right:44px; bottom:108px; width:76px; height:64px; padding:0; z-index:4; cursor:pointer; border:3px solid #1e4f99; border-radius:38px 38px 6px 6px; background:linear-gradient(90deg,#2f6cc4,#4f8fe6 45%,#2a5fae); box-shadow:0 4px 0 #173d77}
.reveal-mail .ml-box.ready{animation:mail-pulse 1s ease-in-out infinite}
.reveal-mail .ml-hole{position:absolute; left:6px; right:6px; top:6px; bottom:5px; overflow:hidden; display:flex; align-items:flex-end; justify-content:center; padding-bottom:2px; border-radius:28px 28px 3px 3px; background:#0f1f3a; font-size:.9rem; line-height:1; letter-spacing:-5px}
.reveal-mail .ml-door{position:absolute; left:4px; right:4px; top:4px; bottom:3px; display:flex; align-items:center; justify-content:center; padding-top:8px; border-radius:30px 30px 3px 3px; border:2px solid #1e4f99; background:linear-gradient(90deg,#3d7fdb,#6aa5f0 45%,#3570c4); color:#fff; font-size:.6rem; font-weight:800; letter-spacing:.06em; transform-origin:50% 100%; transition:transform .35s}
.reveal-mail .ml-door::before{content:""; position:absolute; left:50%; top:6px; width:16px; height:5px; margin-left:-8px; border-radius:3px; background:#d8dce6}
.reveal-mail .ml-box.open .ml-door{transform:perspective(170px) rotateX(-75deg)}
.reveal-mail .ml-flag{position:absolute; right:-10px; top:16px; width:5px; height:34px; background:#8a8f99; transform-origin:50% 100%; transform:rotate(90deg); transition:transform .45s cubic-bezier(.3,1.6,.5,1)}
.reveal-mail .ml-flag::after{content:""; position:absolute; left:5px; top:0; width:17px; height:12px; border-radius:0 2px 2px 0; background:#e53935}
.reveal-mail .ml-box.flag .ml-flag{transform:rotate(0)}
.reveal-mail .ml-pet{position:absolute; right:122px; bottom:42px; z-index:5; font-size:1.9rem; line-height:1}
.reveal-mail .ml-pet.yay{animation:reveal-bounce .5s 2}
.reveal-mail .ml-truck{position:absolute; left:0; bottom:3px; z-index:6; font-size:2.8rem; line-height:1; will-change:transform}
.reveal-mail .ml-truck span{display:inline-block}
.reveal-mail .ml-truck.drive span{animation:mail-rumble .22s infinite}
.reveal-mail .ml-fly{position:absolute; left:0; top:0; z-index:8; font-size:1.3rem; line-height:1}
.reveal-mail .ml-env{position:absolute; left:8px; top:68px; width:170px; height:104px; z-index:10}
.reveal-mail .ml-env.gone{opacity:0; transition:opacity .3s}
.reveal-mail .ml-face{position:absolute; inset:0}
.reveal-mail .ml-front{border-radius:6px; background:#fff6dc; box-shadow:0 4px 10px rgba(0,0,0,.35); color:#4a2e2a}
.reveal-mail .ml-stamp{position:absolute; right:8px; top:8px; width:30px; height:34px; display:flex; align-items:center; justify-content:center; border:2px dashed #e4577a; background:#ffe1ea; font-size:1rem}
.reveal-mail .ml-to{position:absolute; left:46px; top:52px; font-size:.8rem; font-weight:700; line-height:1.3; text-align:left}
.reveal-mail .ml-backs{display:none}
.reveal-mail .ml-env.back .ml-front{display:none}
.reveal-mail .ml-env.back .ml-backs{display:block}
.reveal-mail .ml-back{position:absolute; inset:0; border-radius:6px; background:#e9d3a0; box-shadow:0 4px 10px rgba(0,0,0,.35)}
.reveal-mail .ml-letter{position:absolute; left:10px; right:10px; top:6px; height:92px; z-index:2; display:flex; flex-direction:column; align-items:center; gap:2px; padding:5px 6px; border-radius:4px; background:#fff repeating-linear-gradient(transparent 0 15px,#e3eef9 15px 16px); color:#3b2a2a; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,.2); transition:transform .55s cubic-bezier(.3,1.3,.5,1)}
.reveal-mail .ml-letter small{font-size:.62rem; line-height:1.2; color:#7a5a55}
.reveal-mail .ml-letter b{font-size:.9rem; line-height:1.15; overflow-wrap:anywhere}
.reveal-mail .ml-env.lettered .ml-letter{transform:translateY(-72px)}
.reveal-mail .ml-pocket{position:absolute; inset:0; z-index:3; border-radius:6px; background:#fbe9bf; clip-path:polygon(0 0,50% 62%,100% 0,100% 100%,0 100%)}
.reveal-mail .ml-flap{position:absolute; left:0; right:0; top:0; height:62%; z-index:4; background:#f0d590; clip-path:polygon(0 0,100% 0,50% 100%); transform-origin:50% 0; transition:transform .45s}
.reveal-mail .ml-env.flapup .ml-flap{z-index:1; transform:perspective(300px) rotateX(180deg)}
.reveal-mail .ml-seal{position:absolute; left:50%; top:52%; z-index:5; margin:-10px 0 0 -10px; font-size:1.1rem; line-height:1}
.reveal-mail .ml-env.flapup .ml-seal{display:none}
.reveal-mail .ml-got{display:flex; flex-wrap:wrap; justify-content:center; gap:4px; min-height:26px; margin-top:6px}
.reveal-mail .ml-won{padding:2px 8px; border-radius:10px; background:#fff6dc; color:#3b2a2a; font-weight:700; font-size:.75rem; line-height:1.3; box-shadow:0 2px 3px rgba(0,0,0,.3); animation:reveal-pop .45s}
@keyframes mail-pulse{0%,100%{box-shadow:0 4px 0 #173d77,0 0 0 0 rgba(255,215,106,.95)} 50%{box-shadow:0 4px 0 #173d77,0 0 0 10px rgba(255,215,106,0)}}
@keyframes mail-rumble{0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)}}
@keyframes mail-drift{to{transform:translateX(14px)}}
`,
  async run(stage, round, ctx){
    const L = round.labels, picks = round.picks, k = picks.length, pet = ctx.esc(ctx.pet);
    stage.innerHTML = `<div class="ml-scene"><span class="ml-cloud" style="left:14px; top:10px" aria-hidden="true">☁️</span><span class="ml-cloud" style="left:44%; top:26px; animation-delay:-3s" aria-hidden="true">☁️</span>
      <div class="ml-grass" aria-hidden="true"></div><div class="ml-road" aria-hidden="true"></div><div class="ml-post" aria-hidden="true"></div>
      <button type="button" class="ml-box" data-tap data-done="1" aria-label="Check the mail"><span class="ml-hole" aria-hidden="true"></span><span class="ml-door" aria-hidden="true">MAIL</span><span class="ml-flag" aria-hidden="true"></span></button>
      <div class="ml-pet" aria-hidden="true">${pet}</div><div class="ml-truck" aria-hidden="true"><span>🚚</span></div>
      <div class="ml-env" hidden></div></div>
      <div class="ml-got"></div>`;
    const $ = s => stage.querySelector(s), scene = $('.ml-scene'), box = $('.ml-box'), hole = $('.ml-hole'), truck = $('.ml-truck'), env = $('.ml-env'), petEl = $('.ml-pet');
    const W = scene.clientWidth || 300, stop = Math.round(W * .2);
    const drive = (a, b, ms) => { truck.classList.add('drive'); return tween(ms, p => { truck.style.transform = `translateX(${a + (b - a) * p}px) scaleX(-1)`; }, ease.inOut).then(() => truck.classList.remove('drive')); };
    truck.style.transform = 'translateX(-90px) scaleX(-1)';

    if (ctx.first) await ctx.wait(300);
    ctx.hint('Here comes the mail truck… 🚚');
    await drive(-90, stop, dur(ctx, 1400, 300));
    for (let j = 0; j < k; j++) {   // one envelope per class, tossed into the mailbox
      const fly = document.createElement('span'), t = rel(truck, scene), h = rel(hole, scene);
      fly.className = 'ml-fly'; fly.textContent = '✉️'; scene.appendChild(fly);
      ctx.sfx('tick');
      await tween(dur(ctx, 550, 150), p => {
        const x = t.x + (h.x - t.x) * p - 10, y = t.top + (h.y - t.top) * p - 10 - Math.sin(Math.PI * p) * 50;
        fly.style.transform = `translate(${x}px,${y}px) rotate(${p * 360}deg) scale(${1 - p * .3})`;
      }, p => p);
      fly.remove();
      hole.textContent = '✉️'.repeat(j + 1);
    }
    box.classList.add('flag'); ctx.sfx('coin');
    await ctx.wait(300);
    drive(stop, W + 20, dur(ctx, 1200, 300)).then(() => { truck.hidden = true; });

    for (const [j, i] of picks.entries()) {
      ctx.hint(j ? 'More mail! Tap the mailbox 📬' : 'You’ve got mail! Tap the mailbox 📬');
      await tapOnce(box);
      ctx.hint('');
      box.classList.add('open'); ctx.sfx('tick');
      await ctx.wait(350);
      hole.textContent = '✉️'.repeat(k - j - 1);
      env.innerHTML = `<div class="ml-face ml-front"><span class="ml-stamp" aria-hidden="true">🐾</span><span class="ml-to">To: ${pet}<br>Pet World School</span></div>
        <div class="ml-face ml-backs"><div class="ml-back"></div><div class="ml-letter"><small>Dear ${pet}, today you have</small><b>${ctx.esc(L[i])}</b></div><div class="ml-pocket"></div><div class="ml-flap"></div><span class="ml-seal" aria-hidden="true">❤️</span></div>`;
      env.className = 'ml-env'; env.hidden = false;
      const from = rel(hole, scene), dx = from.x - (8 + 85), dy = from.y - (68 + 52);
      await tween(dur(ctx, 650, 200), p => {
        env.style.transform = `translate(${dx * (1 - p)}px,${dy * (1 - p) - Math.sin(Math.PI * p) * 30}px) scale(${.15 + .85 * p}) rotate(${(1 - p) * -30}deg)`;
      }, ease.out);
      box.classList.remove('open');
      await ctx.wait(ctx.quick ? 50 : 300);
      await tween(dur(ctx, 220, 80), p => { env.style.transform = `scaleX(${1 - p})`; }, ease.in);   // flip it over
      env.classList.add('back');
      await tween(dur(ctx, 220, 80), p => { env.style.transform = `scaleX(${p})`; }, ease.out);
      env.classList.add('flapup'); ctx.sfx('tick');
      await ctx.wait(450);
      env.classList.add('lettered');
      await ctx.wait(350);
      petEl.classList.remove('yay'); void petEl.offsetWidth; petEl.classList.add('yay');
      ctx.sfx('good');
      ctx.reveal(i);
      await ctx.wait(1400);
      env.classList.add('gone');
      $('.ml-got').insertAdjacentHTML('beforeend', `<span class="ml-won">✉️ ${ctx.esc(L[i])}</span>`);
      await ctx.wait(300);
      env.hidden = true;
    }
    box.classList.remove('flag');
  }
};
