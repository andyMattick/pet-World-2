/* 🎡 the spinning wheel (the original reveal) */
const COLORS = ['#f6b8c8', '#bfe3c9', '#bcd7f5', '#f8dc9b', '#d8c6f2', '#f5c3a3', '#b9e6e6', '#e6e2a8'];

export function wheelFaceHTML(labels, esc){
  const seg = 360 / labels.length;
  return `<div class="wf-spin" style="background:conic-gradient(${labels.map((_, i) => `${COLORS[i % COLORS.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(', ')})">${labels.map((t, i) => `<span class="wf-label" data-seg="${i}" style="transform:rotate(${(i + .5) * seg}deg) translateY(-62px) rotate(${-(i + .5) * seg}deg)">${esc(t)}</span>`).join('')}</div>`;
}
export const WHEEL_FACE_CSS = `
.wf-spin{position:relative; width:220px; height:220px; margin:0 auto; border-radius:50%; border:4px solid #fff; box-shadow:0 2px 10px rgba(0,0,0,.18)}
.wf-label{position:absolute; left:50%; top:50%; width:84px; margin:-.7em 0 0 -42px; font-size:.78rem; font-weight:700; line-height:1.15; text-align:center; color:#3b2a2a; pointer-events:none}
.wf-label.picked{text-decoration:underline; text-decoration-thickness:2px}
`;

export default {
  id:'wheel', title:'🎡 Spin the class wheel!',
  css:WHEEL_FACE_CSS + `
.reveal-wheel{height:236px; padding-top:12px}
.reveal-wheel .wf-pointer{position:absolute; top:-4px; left:50%; transform:translateX(-50%); font-size:1.6rem; color:var(--berry, #c2185b); z-index:2; line-height:1}
`,
  async run(stage, round, ctx){
    stage.innerHTML = `<div class="wf-pointer" aria-hidden="true">▼</div>${wheelFaceHTML(round.labels, ctx.esc)}`;
    if (ctx.first) await ctx.button('Spin! 🎡'); else await ctx.wait(400);
    const wheel = stage.querySelector('.wf-spin'), seg = 360 / round.labels.length; let turned = 0;
    for (const i of round.picks) {
      const target = 360 - (i + .5) * seg + (Math.random() - .5) * seg * .6;
      turned += 360 * (ctx.quick ? 1 : 4) + ((target - turned) % 360 + 360) % 360;
      wheel.style.transition = `transform ${ctx.quick ? .3 : 2.4}s cubic-bezier(.15,.7,.2,1)`; wheel.style.transform = `rotate(${turned}deg)`;
      await ctx.wait(2500);
      wheel.querySelector(`[data-seg="${i}"]`)?.classList.add('picked');
      ctx.reveal(i);
      await ctx.wait(500);
    }
  }
};
