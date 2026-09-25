/* Pet Town game (Unit 1: Ratios). Runs in two modes:
   - hosted: students join a class (code + name + PIN) and everything saves to Supabase
   - local: no backend configured, the town saves in the browser (the single-file build) */
import { SKILLS, SKILL_ORDER, STATIONS, UNLOCK_AT, MIS, REWARDS, UNIT_SKILLS, BUILDINGS, DRILLS, drillLabel, mergeDrillSettings, drillTypeOn } from '../shared/registry';
import { Backend } from '../lib/studentBackend';

/* ===================== CORE (no DOM) ===================== */
const rand = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const gcd = (a,b) => b ? gcd(b, a % b) : a;
const shuffle = arr => { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function weightedPick(list, wf){
  const ws = list.map(wf); let r = Math.random() * ws.reduce((s,w)=>s+w,0);
  for (let i=0;i<list.length;i++){ r -= ws[i]; if (r <= 0) return list[i]; }
  return list[list.length-1];
}

/* ---------- content data ---------- */
const RECIPES = [
  {name:'Berry smoothie', items:[['🍓','scoops of berries'],['🥛','cups of milk']]},
  {name:'Carrot cupcakes', items:[['🥕','carrots'],['🥚','eggs']]},
  {name:'Honey tea', items:[['🍯','spoons of honey'],['🫖','cups of tea']]},
  {name:'Cheesy pizza', items:[['🧀','cups of cheese'],['🍅','tomatoes']]},
  {name:'Acorn cookies', items:[['🌰','acorns'],['🍪','cups of flour']]},
  {name:'Fishy tacos', items:[['🐟','fish'],['🌮','taco shells']]},
  {name:'Banana pancakes', items:[['🍌','bananas'],['🥞','scoops of batter']]},
  {name:'Hot cocoa', items:[['🍫','cocoa squares'],['☕','mugs of milk']]},
  {name:'Apple pie', items:[['🍎','apples'],['🧈','sticks of butter']]},
  {name:'Blueberry muffins', items:[['🫐','handfuls of blueberries'],['🧁','muffin cups']]}
];
const COUNTABLES = [['🍓','strawberries'],['🫐','blueberries'],['🍪','cookies'],['🧁','cupcakes'],['🍩','donuts'],['🥕','carrots'],['🍎','apples'],['🍌','bananas'],['🥨','pretzels'],['🍋','lemons'],['🍒','cherries'],['🥐','croissants']];
const CUSTOMERS = [['🐻','Biscuit'],['🐶','Waffles'],['🐭','Pip'],['🐨','Koko'],['🐯','Tigerlily'],['🦁','Leo'],['🐮','Daisy'],['🐷','Truffle'],['🐸','Ribbit'],['🐵','Coco'],['🐔','Nugget'],['🦉','Hoot'],['🦔','Spike'],['🦦','Otto'],['🐤','Sunny'],['🐢','Shelly'],['🦝','Bandit'],['🐑','Fluff']];

/* ---------- state ---------- */
const LOCAL_KEY = 'pettown:v1', OLD_KEY = 'petcafe:v1';
let storeKey = LOCAL_KEY;          // per-student key when signed in, so shared computers never mix towns
const SLOW_MS = {concept:15000, compute:10000, sprint:6000};
const fresh = () => ({v:1, name:'', sid:'s'+Math.random().toString(36).slice(2,10), coins:0, power:1, sprintBest:0, bestStreak:0,
  owned:['cat'], decor:[], pet:'cat', unlocked:[], seenUnlocks:[], seenCollection:[], completedSets:[], muted:false, music:true, streak:0, day:1, orders:0, perfect:0, timeMs:0,
  facts:{}, divFacts:{}, practiceLog:{}, drillLog:{}, pace:{idea:[], arith:[], sprint:[]}, ks:{}, kr:{}, kn:{}, mis:{},
  cafe:{st:{1:0,2:0,3:0,4:0}}, displayed:Array(8).fill(null), minStation:1, unlockAll:false, sync:{url:'', wkey:'', cls:'', last:0}, savedAt:0});
/* fill in any fields an older save is missing */
function normalize(raw){
  const f = fresh(), s = Object.assign(f, raw || {});
  s.cafe = Object.assign({st:{}}, s.cafe || {}); s.cafe.st = Object.assign({1:0,2:0,3:0,4:0}, s.cafe.st || {});
  s.sync = Object.assign(fresh().sync, s.sync || {});
  ['facts','divFacts','practiceLog','ks','kr','kn','mis'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  if (!raw || !Object.prototype.hasOwnProperty.call(raw, 'drillLog') || !s.drillLog || typeof s.drillLog !== 'object') {
    s.drillLog = {};
    Object.entries(s.practiceLog).forEach(([key, value]) => { s.drillLog['times:' + key] = value; });
  }
  s.pace = Object.assign({idea:[], arith:[], sprint:[]}, s.pace || {});
  ['idea','arith','sprint'].forEach(k => { s.pace[k] = Array.isArray(s.pace[k]) ? s.pace[k].slice(-20) : []; });
  if (!Array.isArray(s.owned) || !s.owned.length) s.owned = ['cat'];
  if (!Array.isArray(s.decor)) s.decor = [];
  if (!Array.isArray(s.unlocked)) s.unlocked = [];
  if (!Array.isArray(s.seenUnlocks)) s.seenUnlocks = [];
  if (!Array.isArray(s.seenCollection)) s.seenCollection = [];
  if (!Array.isArray(s.completedSets)) s.completedSets = [];
  if (!Array.isArray(raw?.displayed)) s.displayed = s.decor.slice(0,8);
  s.displayed = Array.from({length:8}, (_,i) => s.decor.includes(s.displayed[i]) ? s.displayed[i] : null);
  s.bestStreak = Math.max(0, Math.floor(+s.bestStreak || 0));
  s.coins = Math.max(0, Math.floor(+s.coins || 0));
  return s;
}
function loadState(key){
  try {
    const raw = localStorage.getItem(key || storeKey);
    if (raw) return normalize(JSON.parse(raw));
    const old = (key || storeKey) === LOCAL_KEY ? localStorage.getItem(OLD_KEY) : null;
    if (old) {
      const o = JSON.parse(old), s = fresh();
      ['coins','sprintBest','owned','decor','pet','muted','music','facts','divFacts','practiceLog','day'].forEach(k => { if (o[k] !== undefined) s[k] = o[k]; });
      s.name = o.cafeName || '';
      return normalize(s);
    }
  } catch(e){}
  return fresh();
}
let S = fresh();
function save(){ S.savedAt = Date.now(); try { localStorage.setItem(storeKey, JSON.stringify(S)); } catch(e){} if (Backend.me) Backend.saveSoon(S); }

/* ---------- facts (times tables) ---------- */
const fkey = (x,y) => Math.min(x,y) + 'x' + Math.max(x,y);
function logFact(x,y,ok,ms,store,slow){
  if (x<2 || y<2 || x>12 || y>12) return;
  const k = fkey(x,y); const f = S[store][k] || (S[store][k] = {a:0,c:0,t:0,n:0,s:0});
  f.a++; if (ok) f.c++; if (slow) f.s = (f.s||0) + 1;
  if (ms) { f.t += Math.min(ms, 15000); f.n++; }
}
function factStatus(x,y,store){
  const f = S[store || 'facts'][fkey(x,y)];
  if (!f || !f.a) return 'new';
  const acc = f.c / f.a, avg = f.n ? f.t / f.n : null, slowRate = (f.s||0) / f.a;
  if (f.a >= 2 && acc >= 0.9 && slowRate <= 0.25 && (avg === null || avg < 3500)) return 'solid';
  if (acc >= 0.7) return 'close';
  return 'work';
}
const FW = {new:3, work:7, close:3, solid:1};
const factWeight = (x,y) => Math.max(FW[factStatus(x,y,'facts')], FW[factStatus(x,y,'divFacts')]);
function pickK(base, min, max){ const ks = []; for (let k=min;k<=max;k++) ks.push(k); return weightedPick(ks, k => factWeight(base, k)); }
const ALLPAIRS = []; for (let x=2;x<=12;x++) for (let y=x;y<=12;y++) ALLPAIRS.push([x,y]);

/* ---------- skill stats ---------- */
function recordStep(skill, st, ok, slow){
  const K = S.ks[skill] || (S.ks[skill] = {});
  const e = K[st.name] || (K[st.name] = {a:0,c:0,s:0,t:st.type});
  e.a++; if (ok) e.c++; if (slow) e.s++;
}
function recordMis(id, ex){
  if (!MIS[id]) return;
  const m = S.mis[id] || (S.mis[id] = {n:0, ex:[]});
  m.n++; if (ex) { m.ex.unshift(ex); m.ex = m.ex.slice(0,3); }
}
function recordProblem(skill, perfect){
  S.kn[skill] = (S.kn[skill]||0) + 1;
  S.kr[skill] = ((S.kr[skill]||'') + (perfect ? '1' : '0')).slice(-10);
}
function statusFromRecent(r){
  if (!r) return 'new';
  const w = r.slice(-8), p = [...w].filter(c => c === '1').length / w.length;
  if (r.length >= 4 && p >= 0.75) return 'mastered';
  if (p >= 0.5) return 'practicing';
  return 'struggling';
}
const skillStatus = sk => statusFromRecent(S.kr[sk] || '');
const lvlOf = sk => { const n = S.kn[sk] || 0; return n < 4 ? 1 : n < 10 ? 2 : 3; };
let unlockQueue = [], unlockActive = null;
function unitOpen(unit){
  const building = BUILDINGS.find(b => b.id === unit);
  return !!(building && building.open);
}
function ruleMet(reward){
  const rule = reward.unlock;
  if (rule.type === 'start') return true;
  if (rule.type === 'unit') return unitOpen(reward.unit);
  if (rule.type === 'station') return reward.unit === 'cafe' && (S.cafe.st[rule.station] || 0) >= UNLOCK_AT;
  if (rule.type === 'mastery') return rule.skills.every(skill => skillStatus(skill) === 'mastered');
  if (rule.type === 'unitMastery') {
    const skills = UNIT_SKILLS[reward.unit] || [];
    return skills.length > 0 && skills.every(skill => skillStatus(skill) === 'mastered');
  }
  if (rule.type === 'sprint') return S.sprintBest >= rule.best;
  if (rule.type === 'streak') return S.bestStreak >= rule.n;
  return false;
}
function available(reward){ return unitOpen(reward.unit) && ruleMet(reward); }
function owns(reward){ return reward.kind === 'pet' ? S.owned.includes(reward.id) : S.decor.includes(reward.id); }
function checkSetCompletions({announce = false} = {}){
  const bonuses = [];
  BUILDINGS.forEach(building => {
    const rewards = REWARDS.filter(reward => reward.unit === building.id);
    ['pet','decor'].forEach(kind => {
      const key = `${building.id}:${kind}`, set = rewards.filter(reward => reward.kind === kind);
      if (set.length && set.every(owns) && !S.completedSets.includes(key)) {
        S.completedSets.push(key); S.coins += 50; bonuses.push(`${kind === 'pet' ? 'Pets' : 'Decorations'} +50`);
        if (announce) unlockQueue.push({kind:'set', id:key, unit:building.id, setKind:kind});
      }
    });
    if (rewards.length && rewards.every(owns) && !S.completedSets.includes(`${building.id}:all`)) {
      const key = `${building.id}:all`;
      S.completedSets.push(key); S.coins += 100; bonuses.push(`${building.name} Master +100`);
      if (announce) unlockQueue.push({kind:'set', id:key, unit:building.id, setKind:'all'});
    }
  });
  if (bonuses.length && !announce) toast('Set complete! ' + bonuses.join(', ') + ' 🪙');
  return bonuses.length;
}
function checkUnlocks({announce = false} = {}){
  const fresh = [];
  REWARDS.forEach(reward => {
    if (!available(reward) || S.unlocked.includes(reward.id)) return;
    S.unlocked.push(reward.id); fresh.push(reward.id);
    if (reward.price === 0 && !owns(reward)) {
      (reward.kind === 'pet' ? S.owned : S.decor).push(reward.id);
    }
    if (announce) unlockQueue.push(reward.id);
    else if (!S.seenUnlocks.includes(reward.id)) S.seenUnlocks.push(reward.id);
  });
  checkSetCompletions({announce});
  return fresh;
}
function unlockPreviewHTML(reward, entry){
  const unit = entry.unit || reward.unit, kind = entry.kind === 'set' ? entry.setKind : reward.kind;
  const items = kind === 'all' ? REWARDS.filter(item => item.unit === unit) : REWARDS.filter(item => item.unit === unit && item.kind === kind);
  return `<div class="unlock-preview-row">${items.map(item => `<span class="unlock-preview-box${item.id === (reward && reward.id) ? ' new' : ''}">${owns(item) ? item.emoji : '•'}</span>`).join('')}</div>`;
}
function showNextUnlock(){
  if (!unlockQueue.length || (order && !order.done) || pr) return;
  const next = unlockQueue.shift(), entry = typeof next === 'string' ? {kind:'reward', id:next} : next, reward = entry.kind === 'set' ? null : REWARDS.find(r => r.id === entry.id);
  if (entry.kind !== 'set' && !reward) { showNextUnlock(); return; }
  unlockActive = entry;
  if (reward && !S.seenUnlocks.includes(reward.id)) { S.seenUnlocks.push(reward.id); save(); }
  const building = BUILDINGS.find(b => b.id === (entry.unit || reward.unit));
  const isSet = entry.kind === 'set';
  $('#unlockModal').classList.toggle('gold', isSet || !!reward?.legendary);
  $('#unlockEmoji').textContent = isSet ? (building?.emoji || '🎉') : reward.emoji;
  $('#unlockTitle').textContent = isSet ? 'Set complete!' : reward.legendary ? 'LEGENDARY!' : reward.kind === 'pet' ? 'New pet!' : 'New decoration!';
  $('#unlockMessage').textContent = isSet ? `${building ? building.name : entry.unit} ${entry.setKind === 'all' ? 'Master' : entry.setKind === 'pet' ? 'Pets' : 'Decorations'}` : reward.name;
  $('#unlockPreview').innerHTML = unlockPreviewHTML(reward, entry);
  $('#unlockHelper').hidden = isSet || !reward || reward.kind !== 'pet' || reward.price > 0;
  $('#unlockDisplay').hidden = isSet || !reward || reward.kind !== 'decor' || reward.price > 0;
  $('#unlockShop').hidden = isSet || !reward || reward.price <= 0;
  const confettiCount = isSet || reward?.legendary ? 40 : 30;
  $('#unlockConfetti').innerHTML = reduceMotion() ? '' : Array.from({length:confettiCount}, (_,i) => `<span style="--x:${rand(-48,48)}%;--delay:${(i % 10) * .05}s">${pick(['🎉','✨',isSet ? '⭐' : reward.emoji])}</span>`).join('');
  $('#unlockModal').hidden = false; $('main').inert = true;
  sfx('unlock'); $('#unlockKeep').focus();
}
function closeUnlock(action = 'keep'){
  const entry = unlockActive, reward = entry && entry.kind === 'reward' ? REWARDS.find(item => item.id === entry.id) : null;
  $('#unlockModal').hidden = true; $('main').inert = false;
  if (action === 'helper' && reward?.kind === 'pet') { S.pet = reward.id; save(); }
  if (action === 'display' && reward?.kind === 'decor') {
    const slot = S.displayed.findIndex(id => id === null);
    if (slot >= 0) { S.displayed[slot] = reward.id; save(); }
    if (!$('#scr-home').hidden) renderHome();
  }
  if (action === 'shop' && reward) {
    renderBook(reward.unit); show('book');
  }
  unlockActive = null;
  setTimeout(showNextUnlock, 0);
}
function ccTotals(){
  let ca=0, cc=0, ma=0, mc=0;
  Object.values(S.ks).forEach(K => Object.values(K).forEach(e => {
    if (e.t === 'concept') { ca += e.a; cc += e.c; } else if (e.t === 'compute') { ma += e.a; mc += e.c; }
  }));
  return [ca, cc, ma, mc];
}
function stationOpen(n){ return n === 1 || (!Backend.me && S.unlockAll) || n <= S.minStation || (S.cafe.st[n-1]||0) >= UNLOCK_AT; }
let appliedDrillReset = '';
function drillSettings(){
  const settings = Backend.me ? mergeDrillSettings(Backend.me.class_drills, Backend.me.student_drills) : mergeDrillSettings(S.drillSettings);
  if (settings.resetAt && settings.resetAt !== appliedDrillReset) {
    const resetAt = Date.parse(settings.resetAt);
    Object.values(S.drillLog).forEach(log => {
      if (log.reteach && (!log.reteachAt || !resetAt || log.reteachAt < resetAt)) { log.reteach = false; delete log.reteachAt; }
    });
    appliedDrillReset = settings.resetAt; save();
  }
  return settings;
}
function recordPace(kind, ms){ const list = S.pace[kind]; if (!list) return; list.push(ms); if (list.length > 20) list.splice(0, list.length - 20); }
function slowLimit(kind){
  const fallback = SLOW_MS[kind] || SLOW_MS.compute;
  const settings = drillSettings(), seconds = settings.slow[kind] || fallback / 1000, scale = settings.timeScale || 1;
  const times = S.pace[kind] || [];
  if (settings.slow.mode !== 'adaptive' || times.length < 5) return seconds * 1000 * scale || fallback;
  const sorted = times.slice().sort((a,b) => a - b), mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return Math.min(2 * seconds * 1000, Math.max(0.6 * seconds * 1000, 1.8 * median)) * scale;
}
function drillId(drill){ return drill.type + ':' + drill.key; }
function drillArea(drill){ return drill.type === 'times' ? factStatus(+drill.key, drill.other, drill.div ? 'divFacts' : 'facts') : 'new'; }
function updateReteach(log){
  if (log.popups >= 3 && log.missesAfter >= log.popups) { log.reteach = true; log.reteachAt = Date.now(); }
}
function shouldDrill(drill, reason){
  const settings = drillSettings(), id = drillId(drill), area = drillArea(drill), log = S.drillLog[id] || {};
  if (!drillTypeOn(settings, drill.type)) return false;
  if (!settings.triggers[reason]) return false;
  if (shift && shift.popups >= settings.maxPerShift) return false;
  if (shift && shift.practiced.has(id)) return false;
  if (log.reteach) return false;
  if (reason === 'miss' && area === 'solid' && shift && !shift.drillMisses.has(id)) { shift.drillMisses.add(id); return false; }
  if (reason === 'slow' && area === 'work' && shift && shift.popups > 0) return false;
  drill.short = reason === 'slow' && (area === 'close' || area === 'solid');
  return true;
}
function recordDrillPopup(drill){
  const id = drillId(drill), log = S.drillLog[id] = S.drillLog[id] || {miss:0, slow:0, sprint:0};
  log.popups = (log.popups || 0) + 1; log.missesAfter = 0;
  if (shift) shift.popups++;
}

/* ===================== PROBLEM GENERATORS =====================
   Each returns {title, bubble, helper, visual, ctx, steps:[...]}
   step: {name, type:'concept'|'compute'|'setup', kind:'num'|'ratio'|'choice'|'grid',
          prompt, answer, eq?(v), mis?(v)->misId, hint?()->text, slot?, fact?{x,y,div},
          labels?[a,b], options?[{html,text,ok,mis}], fill?{sel,text}, plot?true} */
const slot = id => `<span class="slotbox" data-slot="${id}"></span>`;
const twoCountables = () => { const a = pick(COUNTABLES); let b = pick(COUNTABLES); while (b === a) b = pick(COUNTABLES); return [a, b]; };
function coprimePair(maxA, maxB, minV){
  minV = minV || 1;
  for (let t=0;t<80;t++){ const a = rand(minV,maxA), b = rand(minV,maxB); if (a !== b && gcd(a,b) === 1) return [a,b]; }
  return [2,3];
}
const kTop = lvl => [5,9,12][lvl-1];
const sameRatio = (v, t) => Array.isArray(v) && v[0] > 0 && v[1] > 0 && v[0]*t[1] === v[1]*t[0];
const ratioEq = t => v => Array.isArray(v) && v[0] === t[0] && v[1] === t[1];

function trayHTML(list){ return `<div class="tray" aria-label="Tray of treats">${list.map(e => `<span>${e}</span>`).join('')}</div>`; }
function tapeHTML(rows, total){
  return `<div class="tape">${rows.map(r => `<div class="tape-row"><span class="tape-lbl">${r.e}</span><div class="tape-boxes">${'<span class="tbox">?</span>'.repeat(r.n)}</div>${r.note ? `<span class="tape-note">${r.note}</span>` : ''}</div>`).join('')}${total ? `<div class="tape-total">${total}</div>` : ''}</div>`;
}
/* ticks: [{t, b}] where t/b is a number/string or {slot:id}; far: last tick sits past a gap */
function dnlHTML(eTop, eBot, ticks, far){
  const n = ticks.length;
  const pos = ticks.map((_,i) => far ? (i === n-1 ? 94 : 4 + i * (66 / Math.max(1, n-2))) : 4 + i * (90 / Math.max(1, n-1)));
  const cell = x => (x && typeof x === 'object') ? slot(x.slot) : x;
  return `<div class="dnl"><div class="dnl-lbls"><span>${eTop}</span><span>${eBot}</span></div><div class="dnl-area"><div class="dnl-line t"></div><div class="dnl-line b"></div>${
    ticks.map((tk,i) => `<div class="dnl-tick" style="left:${pos[i]}%"><span class="v t">${cell(tk.t)}</span><span class="m t"></span><span class="m b"></span><span class="v b">${cell(tk.b)}</span></div>`).join('')
  }${far ? '<div class="dnl-gap" style="left:82%">…</div>' : ''}</div></div>`;
}
function miniTable(h1, h2, rows){ return `<table class="mini"><tr><th>${h1}</th><th>${h2}</th></tr>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>`; }
function gridSVG(max, xl, yl, star){
  const W = 330, pad = 38, top = 12, sz = (W - pad - top) / max;
  const X = x => pad + x*sz, Y = y => W - pad - y*sz;
  const every = max > 8 ? 2 : 1;
  let g = '';
  for (let i=0;i<=max;i++){
    g += `<line class="gline" x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(max)}"/><line class="gline" x1="${X(0)}" y1="${Y(i)}" x2="${X(max)}" y2="${Y(i)}"/>`;
    if (i % every === 0) g += `<text class="glbl" x="${X(i)}" y="${Y(0)+16}" text-anchor="middle">${i}</text><text class="glbl" x="${X(0)-8}" y="${Y(i)+4}" text-anchor="end">${i}</text>`;
  }
  g += `<line class="gaxis" x1="${X(0)}" y1="${Y(0)}" x2="${X(max)}" y2="${Y(0)}"/><line class="gaxis" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(max)}"/>`;
  g += `<text class="gtitle" x="${X(max/2)}" y="${W-4}" text-anchor="middle">${xl} (x)</text><text class="gtitle" transform="translate(12 ${Y(max/2)}) rotate(-90)" text-anchor="middle">${yl} (y)</text>`;
  if (star) g += `<text x="${X(star[0])}" y="${Y(star[1])+7}" text-anchor="middle" font-size="20">⭐</text>`;
  g += '<g id="gdots"></g><g id="ghits">';
  for (let x=0;x<=max;x++) for (let y=0;y<=max;y++) g += `<circle class="ghit" cx="${X(x)}" cy="${Y(y)}" r="${Math.max(6, sz/2.3)}" data-x="${x}" data-y="${y}"/>`;
  g += '</g>';
  return `<div class="gridwrap"><svg id="gridsvg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="Coordinate grid" data-max="${max}" data-pad="${pad}" data-top="${top}">${g}</svg></div>`;
}

const divisorsOf = n => { const d = []; for (let i = 2; i <= n; i++) if (n % i === 0) d.push(i); return d; };
/* extra step for GEN.basic: only when the ratio can be simplified */
function simplestStep(target, labels){
  const g = gcd(target[0], target[1]);
  if (g < 2) return null;
  const s = [target[0] / g, target[1] / g];
  return {name:'Simplest form', type:'concept', kind:'ratio', labels,
    prompt:`Now write ${target[0]} : ${target[1]} in simplest form.`, answer:s,
    eq:v => Array.isArray(v) && v[0] === s[0] && v[1] === s[1],
    fact:{x:g, y:s[0] > 1 ? s[0] : s[1], div:true},
    mis:v => !Array.isArray(v) ? null
      : (v[0] === s[1] && v[1] === s[0]) ? 'reversed'
      : (v[0] * s[1] === v[1] * s[0] && gcd(v[0], v[1]) > 1) ? 'notSimplest'
      : ((v[0] === s[0] && v[1] === target[1]) || (v[0] === target[0] && v[1] === s[1])) ? 'oneSideOnly'
      : null,
    hint:() => `What number goes into both ${target[0]} and ${target[1]}? Divide both by it.`};
}
/* scale-down ratio table: start from a big batch and divide */
function tableDown(lvl){
  const r = pick(RECIPES), items = r.items;
  const [a, b] = coprimePair(lvl <= 2 ? 5 : 8, lvl <= 2 ? 5 : 8, 1);
  const m = weightedPick([4, 6, 8, 9, 10, 12].filter(x => x <= (lvl <= 2 ? 8 : 12)), x => factWeight(a > 1 ? a : b, x));
  const top = [a*m, b*m];
  const divs = divisorsOf(m).filter(d => d < m);
  const rowDivs = shuffle(divs).slice(0, lvl <= 2 ? 1 : 2).sort((p, q) => p - q);
  rowDivs.push(m);                                  // last row: all the way down to simplest form
  let tb = `<table class="ratio"><thead><tr><th>divide<br>by</th><th><span class="e">${items[0][0]}</span><br>${esc(items[0][1])}</th><th><span class="e">${items[1][0]}</span><br>${esc(items[1][1])}</th></tr></thead><tbody>
    <tr class="base"><td>big batch</td><td>${top[0]}</td><td>${top[1]}</td></tr>`;
  const steps = [];
  rowDivs.forEach((d, ri) => {
    const vals = [top[0]/d, top[1]/d], g = Math.random() < 0.5 ? 0 : 1, bl = 1 - g;
    const last = d === m;
    tb += `<tr><td><span class="times">÷</span>${slot('f'+ri)}</td>${[0,1].map(c => c === g ? `<td>${vals[c]}</td>` : `<td>${slot('v'+ri)}</td>`).join('')}</tr>`;
    steps.push({name:'Find the divisor', type:'concept', kind:'num', slot:'f'+ri,
      prompt:`Row ${ri+2}: the big batch was divided by what number?${last ? ' (This row is the smallest possible recipe.)' : ''}`,
      answer:d, fact:{x:vals[g], y:d, div:true},
      mis:v => v === top[g] - vals[g] ? 'additive' : null,
      hint:() => `${items[g][0]} went from ${top[g]} down to ${vals[g]}. ${top[g]} ÷ what = ${vals[g]}?`});
    steps.push({name:'Divide', type:'compute', kind:'num', slot:'v'+ri,
      prompt:`Row ${ri+2}: how many ${items[bl][0]} ${items[bl][1]}?`,
      answer:vals[bl], fact:{x:d, y:vals[bl], div:true},
      mis:v => v === top[bl] - (top[g] - vals[g]) ? 'additive' : v === top[bl] ? 'oneSideOnly' : null,
      hint:() => `This row is ÷${d}. ${top[bl]} ÷ ${d} = ?`});
  });
  tb += '</tbody></table>';
  return {title:`${r.name} (smaller batches)`, ctx:`${top[0]}:${top[1]}, ${rowDivs.map(d => '÷'+d).join(' ')}`,
    bubble:pick(["I made way too much! Can you shrink my recipe?", "I only need a small batch today. Help me scale it down!", "Let's find the smallest version of this recipe."]),
    helper:'Going down works the same way: find what the row was divided by, then divide the other amount.', visual:tb, steps};
}
/* extra choice problem for GEN.equiv at level 2+ */
function simplestChoice(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  const [a, b] = coprimePair(lvl <= 2 ? 5 : 7, lvl <= 2 ? 5 : 7, 2);
  const g = pickK(a, 2, lvl <= 2 ? 6 : 9), big = [a*g, b*g];
  const halfway = divisorsOf(g).filter(d => d < g);
  const opts = [{v:[a, b], ok:true, mis:null}, {v:[b, a], ok:false, mis:'reversed'}];
  if (halfway.length) { const d = pick(halfway); opts.push({v:[big[0]/d, big[1]/d], ok:false, mis:'notSimplest'}); }
  opts.push({v:[a, big[1]], ok:false, mis:'oneSideOnly'});
  const shown = shuffle(opts).map(o => ({html:`${o.v[0]} ${A[0]} : ${o.v[1]} ${B[0]}`, text:`${o.v[0]}:${o.v[1]}`, ok:o.ok, mis:o.mis}));
  return {title:'Simplest recipe', ctx:`${big[0]}:${big[1]}`,
    bubble:`My recipe card says ${big[0]} ${A[1]} to ${big[1]} ${B[1]}. What's the simplest way to write that?`,
    helper:'Simplest form: divide both numbers by the biggest number that goes into both.',
    visual:`<div style="text-align:center; font-size:1.8rem">${big[0]} ${A[0]} : ${big[1]} ${B[0]}</div>`,
    steps:[
      {name:'Pick simplest form', type:'concept', kind:'choice', prompt:`Which is ${big[0]} : ${big[1]} in simplest form?`, options:shown,
        hint:() => `What's the biggest number that goes into both ${big[0]} and ${big[1]}?`},
      {name:'Name the divisor', type:'compute', kind:'num', prompt:'Both numbers were divided by what?', answer:g, fact:{x:a, y:g},
        mis:v => v === big[0] - a ? 'additive' : null, hint:() => `${big[0]} ÷ what = ${a}?`}
    ]};
}
const GEN = {
/* ---------- Station 1 ---------- */
basic(lvl){
  const [X, Y] = twoCountables();
  const top = lvl === 1 ? 6 : 9;
  let x = rand(1, top), y = rand(1, top); if (x === y) y = y === top ? y - 1 : y + 1;
  const whole = lvl >= 2 && Math.random() < 0.45;
  const tray = shuffle([...Array(x).fill(X[0]), ...Array(y).fill(Y[0])]);
  const target = whole ? [x, x+y] : [x, y];
  const secondName = whole ? 'all the treats' : `${Y[0]} ${Y[1]}`;
  const p = {
    title:'The treat tray', ctx:`${x} ${X[1]}, ${y} ${Y[1]}${whole ? ', part to whole' : ''}`,
    bubble:`What's the ratio of ${X[1]} to ${whole ? 'all the treats' : Y[1]} on this tray?`,
    helper:'Count carefully, then write the numbers in the order they asked.',
    visual: trayHTML(tray),
    steps:[
      {name:'Count', type:'setup', kind:'num', prompt:`How many ${X[0]} ${X[1]} are on the tray?`, answer:x, hint:() => `Point at each ${X[0]} and count them.`},
      whole ? {name:'Count', type:'setup', kind:'num', prompt:'How many treats are on the tray in all?', answer:x+y, hint:() => 'Count every treat, both kinds.'}
            : {name:'Count', type:'setup', kind:'num', prompt:`How many ${Y[0]} ${Y[1]} are on the tray?`, answer:y, hint:() => `Point at each ${Y[0]} and count them.`},
      {name:'Write the ratio', type:'concept', kind:'ratio', labels:[X[0], whole ? '🧺' : Y[0]],
        prompt:`Write the ratio of ${X[0]} ${X[1]} to ${secondName}.`, answer:target, eq:v => sameRatio(v, target),
        mis:v => sameRatio(v, [target[1], target[0]]) ? 'reversed' : (!whole && sameRatio(v, [x, x+y])) ? 'partwhole' : (whole && sameRatio(v, [x, y])) ? 'partpart' : null,
        hint:() => `The first number is the ${X[1]}. The second is ${secondName}.`}
    ]
  };
  if (lvl >= 2) { const extra = simplestStep(target, [X[0], whole ? '🧺' : Y[0]]); if (extra) p.steps.push(extra); }
  return p;
},

/* ---------- Station 2 ---------- */
tape(lvl){
  const [A, B] = twoCountables();
  const [a, b] = coprimePair(lvl === 1 ? 3 : 5, lvl === 1 ? 3 : 5);
  const n = a + b, u = pickK(n, 2, kTop(lvl)), T = n*u;
  const askB = Math.random() < 0.5;
  const askE = askB ? B : A, askN = askB ? b : a, othE = askB ? A : B, othN = askB ? a : b;
  const givenPart = lvl >= 2 && Math.random() < 0.5;
  const rows = [{e:A[0], n:a}, {e:B[0], n:b}];
  const fill = {sel:'.tbox', text:String(u)};
  if (!givenPart) {
    return {
      title:'Snack cups', ctx:`${a}:${b}, total ${T}`,
      bubble:`My snack cups use ${A[1]} and ${B[1]} in the ratio ${a} to ${b}. I have ${T} treats. How many ${askE[1]} is that?`,
      helper:'Every box in the tape diagram is worth the same amount.',
      visual: tapeHTML(rows, `Total: ${T} treats`),
      steps:[
        {name:'Count the boxes', type:'concept', kind:'num', prompt:'How many equal boxes are there in all?', answer:n,
          mis:v => (v === a || v === b || v === a*b) ? 'partsCount' : null, hint:() => `Count the boxes in both rows: ${a} + ${b}.`},
        {name:'Value of one box', type:'compute', kind:'num', prompt:`${T} treats are shared equally by the boxes. How much is each box worth?`, answer:u, fact:{x:n, y:u, div:true}, fill,
          mis:v => ((T % a === 0 && v === T/a) || (T % b === 0 && v === T/b)) ? 'divideWrong' : null, hint:() => `${T} ÷ ${n} = ?`},
        {name:'Find the part', type:'compute', kind:'num', prompt:`How many ${askE[0]} ${askE[1]} are there?`, answer:askN*u, fact:{x:askN, y:u},
          mis:v => v === u ? 'oneBox' : v === othN*u ? 'wrongPart' : null, hint:() => `The ${askE[0]} row has ${askN} boxes of ${u}.`}
      ]
    };
  }
  const G = othN*u;
  rows[askB ? 0 : 1].note = `= ${G}`;
  return {
    title:'Snack cups', ctx:`${a}:${b}, ${othE[1]} = ${G}`,
    bubble:`My snack cups use ${A[1]} and ${B[1]} in the ratio ${a} to ${b}. I used ${G} ${othE[1]}. How many ${askE[1]} do I need?`,
    helper:'Every box in the tape diagram is worth the same amount.',
    visual: tapeHTML(rows, ''),
    steps:[
      {name:'Value of one box', type:'compute', kind:'num', prompt:`The ${othE[0]} row has ${othN} boxes that hold ${G}. How much is each box worth?`, answer:u, fact:{x:othN, y:u, div:true}, fill,
        mis:v => (G % n === 0 && v === G/n) ? 'divideWrong' : null, hint:() => `${G} ÷ ${othN} = ?`},
      {name:'Find the part', type:'compute', kind:'num', prompt:`How many ${askE[0]} ${askE[1]} are there?`, answer:askN*u, fact:{x:askN, y:u},
        mis:v => v === u ? 'oneBox' : v === G ? 'wrongPart' : (v === G + (askN - othN)) ? 'additive' : null, hint:() => `The ${askE[0]} row has ${askN} boxes of ${u}.`}
    ]
  };
},

groups(lvl){
  const [X, Y] = twoCountables();
  let a = rand(2,5), b = rand(1,5); if (a === b) b = b === 1 ? 2 : b - 1;
  const g = pickK(a, 2, kTop(lvl)), TX = a*g;
  return {
    title:'Treat boxes', ctx:`${a} ${X[1]} + ${b} ${Y[1]} per box, ${TX} ${X[1]}`,
    bubble:`Every box gets ${a} ${X[1]} and ${b} ${Y[1]}. We baked ${TX} ${X[1]}. How many ${Y[1]} do we need?`,
    helper:'Every box is packed exactly the same way.',
    visual:`<div style="text-align:center"><div class="tray" style="max-width:220px">${`<span>${X[0]}</span>`.repeat(a)}${`<span>${Y[0]}</span>`.repeat(b)}</div><div style="margin-top:6px">One box. We have ${TX} ${X[0]}.</div></div>`,
    steps:[
      {name:'Find the number of groups', type:'concept', kind:'num', prompt:'How many boxes can we fill?', answer:g, fact:{x:a, y:g, div:true},
        mis:v => v === TX - a ? 'additive' : null, hint:() => `Each box takes ${a} ${X[0]}. ${TX} ÷ ${a} = ?`},
      {name:'Scale the other part', type:'compute', kind:'num', prompt:`How many ${Y[0]} ${Y[1]} do we need for all the boxes?`, answer:b*g, fact:{x:b, y:g},
        mis:v => v === TX ? 'wrongPart' : v === g ? 'oneBox' : v === b + (TX - a) ? 'additive' : null, hint:() => `${g} boxes, ${b} ${Y[0]} in each.`}
    ]
  };
},

dnlCreate(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  let a = rand(2, lvl === 1 ? 5 : 9), b = rand(2, lvl === 1 ? 5 : 9); if (a === b) b = b === 2 ? 3 : b - 1;
  const last = lvl === 1 ? 3 : 4, topGiven = lvl >= 2;
  const ticks = [{t:0, b:0}, {t:a, b:b}], steps = [
    {name:'Find each jump', type:'concept', kind:'num', prompt:`Each jump on the ${A[0]} line adds ${a}. How much does each jump add on the ${B[0]} line?`, answer:b,
      mis:v => v === a ? 'dnlSame' : null, hint:() => `Look at the first jump: 0 to ${b} on the ${B[0]} line.`}
  ];
  for (let k=2;k<=last;k++){
    ticks.push({t: topGiven ? a*k : {slot:'t'+k}, b:{slot:'b'+k}});
    if (!topGiven) steps.push({name:'Fill in the line', type:'compute', kind:'num', slot:'t'+k, prompt:`Fill in the next ${A[0]} number (${k} jumps).`, answer:a*k, fact:{x:a, y:k},
      hint:() => `${a} × ${k} = ?`});
    steps.push({name:'Fill in the line', type:'compute', kind:'num', slot:'b'+k, prompt:`Fill in the ${B[0]} number under ${topGiven ? a*k : 'it'}.`, answer:b*k, fact:{x:b, y:k},
      mis:v => (v === a*k || v === b + (k-1)*a) ? 'dnlSame' : null, hint:() => `${b} × ${k} = ?`});
  }
  return {
    title:`${r.name} number line`, ctx:`${a}:${b}`,
    bubble:`My ${r.name.toLowerCase()} uses ${a} ${A[1]} for every ${b} ${B[1]}. Can you finish my double number line?`,
    helper:'Each line counts by its own number.',
    visual: dnlHTML(A[0], B[0], ticks, false), steps
  };
},

dnl(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  let a = rand(2, lvl === 1 ? 5 : 9), b = rand(2, lvl === 1 ? 5 : 9); if (a === b) b = b === 2 ? 3 : b - 1;
  const K = pickK(a, 4, Math.max(6, kTop(lvl)));
  const flip = lvl >= 2 && Math.random() < 0.4;              // given the bottom value instead
  const [gE, gN, fE, fN] = flip ? [B, b, A, a] : [A, a, B, b];
  const ticks = [0,1,2,3].map(k => ({t:a*k, b:b*k}));
  ticks.push(flip ? {t:{slot:'far'}, b:b*K} : {t:a*K, b:{slot:'far'}});
  return {
    title:`${r.name} number line`, ctx:`${a}:${b}, ${gN*K} ${gE[1]}`,
    bubble:`I'm making a huge batch with ${gN*K} ${gE[1]}. How many ${fE[1]} do I need?`,
    helper:'Find how many jumps it takes, then jump the other line the same number of times.',
    visual: dnlHTML(A[0], B[0], ticks, true),
    steps:[
      {name:'Find the multiplier', type:'concept', kind:'num', prompt:`How many jumps of ${gN} does it take to reach ${gN*K}?`, answer:K, fact:{x:gN, y:K, div:true},
        mis:v => v === gN*K - gN ? 'additive' : null, hint:() => `${gN} × what = ${gN*K}?`},
      {name:'Scale the other line', type:'compute', kind:'num', slot:'far', prompt:`Fill in the box: how many ${fE[0]} ${fE[1]}?`, answer:fN*K, fact:{x:fN, y:K},
        mis:v => v === fN + (gN*K - gN) ? 'additive' : v === gN*K ? 'dnlSame' : null, hint:() => `${K} jumps of ${fN}: ${fN} × ${K}.`}
    ]
  };
},

dnlTable(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  let a = rand(2, lvl === 1 ? 5 : 8), b = rand(2, lvl === 1 ? 5 : 8); if (a === b) b = b === 2 ? 3 : b - 1;
  const ks = [1,2,3];
  const opts = shuffle([
    {rows:ks.map(k => [a*k, b*k]), ok:true, mis:null},
    {rows:ks.map(k => [b*k, a*k]), ok:false, mis:'reversed'},
    {rows:ks.map(k => [a*k, b + (k-1)*a]), ok:false, mis:'additive'}
  ]).map((o,i) => ({html:`<div>Table ${'ABC'[i]}</div>${miniTable(A[0], B[0], o.rows)}`, text:`Table ${'ABC'[i]}`, ok:o.ok, mis:o.mis}));
  return {
    title:'Match the recipe card', ctx:`${a}:${b}`,
    bubble:'I wrote my recipe as a double number line. Which table shows the same recipe?',
    helper:'Read each pair of numbers straight down the number line.',
    visual: dnlHTML(A[0], B[0], [0,1,2,3].map(k => ({t:a*k, b:b*k})), false),
    steps:[{name:'Match line to table', type:'concept', kind:'choice', prompt:'Which ratio table matches the double number line?', options:opts,
      hint:() => `On the line, ${a} ${A[0]} goes with ${b} ${B[0]}. Find a table where every row keeps that pattern.`}]
  };
},

/* ---------- Station 3 ---------- */
table(lvl){
  if (lvl >= 2 && Math.random() < 0.35) return tableDown(lvl);
  const r = pick(RECIPES), items = r.items;
  const cfg = [{base:5,rows:2},{base:8,rows:3},{base:10,rows:3}][lvl-1];
  const pairs = []; for (let x=2;x<=cfg.base;x++) for (let k=2;k<=kTop(lvl);k++) pairs.push([x,k]);
  const [a0, k1] = weightedPick(pairs, p => factWeight(p[0], p[1]));
  const bOpts = []; for (let b=2;b<=cfg.base;b++) if (b !== a0 && gcd(a0,b) === 1) bOpts.push(b);
  let left = a0, right = bOpts.length ? pick(bOpts) : (a0 === 2 ? 3 : 2);
  if (Math.random() < 0.5) [left, right] = [right, left];
  const base = [left, right];
  const ks = new Set([k1]); let guard = 0;
  while (ks.size < cfg.rows && guard++ < 60) ks.add(rand(2, kTop(lvl)));
  const rows = [...ks].sort((p,q) => p-q).map(k => ({k, given: Math.random() < 0.5 ? 0 : 1}));
  let tb = `<table class="ratio"><thead><tr><th>multiply<br>by</th><th><span class="e">${items[0][0]}</span><br>${esc(items[0][1])}</th><th><span class="e">${items[1][0]}</span><br>${esc(items[1][1])}</th></tr></thead><tbody>
    <tr class="base"><td>1 batch</td><td>${left}</td><td>${right}</td></tr>`;
  const steps = [];
  rows.forEach((rw, ri) => {
    const g = rw.given, bl = 1 - g, gv = base[g]*rw.k;
    tb += `<tr><td><span class="times">×</span>${slot('f'+ri)}</td>${[0,1].map(c => c === g ? `<td>${base[c]*rw.k}</td>` : `<td>${slot('v'+ri)}</td>`).join('')}</tr>`;
    steps.push({name:'Find the multiplier', type:'concept', kind:'num', slot:'f'+ri, prompt:`Row ${ri+2}: what was the 1-batch row multiplied by?`, answer:rw.k, fact:{x:base[g], y:rw.k, div:true},
      mis:v => v === gv - base[g] ? 'additive' : null, hint:() => `${items[g][0]} went from ${base[g]} to ${gv}. ${base[g]} × what = ${gv}?`});
    steps.push({name:'Multiply', type:'compute', kind:'num', slot:'v'+ri, prompt:`Row ${ri+2}: how many ${items[bl][0]} ${items[bl][1]}?`, answer:base[bl]*rw.k, fact:{x:base[bl], y:rw.k},
      mis:v => v === base[bl] + (gv - base[g]) ? 'additive' : null, hint:() => `This row is ×${rw.k}. ${base[bl]} × ${rw.k} = ?`});
  });
  tb += '</tbody></table>';
  return {title:r.name, ctx:`${left}:${right}, ${rows.map(x => '×'+x.k).join(' ')}`,
    bubble:pick(["I'm having friends over! Can you fill in my recipe table?","Big order today. How much of everything do I need?","My whole family is coming. Help me scale up this recipe!"]),
    helper:'Step 1: find what the row was multiplied by. Step 2: multiply the other amount.', visual:tb, steps};
},

equiv(lvl){
  if (lvl >= 2 && Math.random() < 0.3) return simplestChoice(lvl);
  const r = pick(RECIPES), [A, B] = r.items;
  const [a, b] = coprimePair(lvl === 1 ? 5 : 7, lvl === 1 ? 5 : 7, 2);
  const k = pickK(a, 2, kTop(lvl));
  const cands = [
    {v:[a*k, b*k], ok:true, mis:null},
    {v:[a+k, b+k], ok:false, mis:'additive'},
    {v:[b*k, a*k], ok:false, mis:'reversed'},
    {v:[a*k, b*(k+1)], ok:false, mis:'mixedMultipliers'}
  ];
  const chosen = [cands[0], ...shuffle(cands.slice(1)).slice(0, lvl === 1 ? 2 : 3)];
  const opts = shuffle(chosen).map(o => ({html:`${o.v[0]} ${A[0]} : ${o.v[1]} ${B[0]}`, text:`${o.v[0]}:${o.v[1]}`, ok:o.ok, mis:o.mis}));
  return {title:'Same taste?', ctx:`${a}:${b}`,
    bubble:`My ${r.name.toLowerCase()} is ${a} ${A[1]} to ${b} ${B[1]}. Which bigger batch tastes exactly the same?`,
    helper:'Equivalent ratios multiply both amounts by the same number.',
    visual:`<div style="text-align:center; font-size:1.8rem">${a} ${A[0]} : ${b} ${B[0]}</div>`,
    steps:[
      {name:'Pick the equivalent ratio', type:'concept', kind:'choice', prompt:`Which ratio is equivalent to ${a} : ${b}?`, options:opts,
        hint:() => `Divide each first number by ${a}. Does the second number match ${b} × that?`},
      {name:'Name the multiplier', type:'compute', kind:'num', prompt:'Both amounts were multiplied by what number?', answer:k, fact:{x:a, y:k, div:true},
        mis:v => v === a*k - a ? 'additive' : null, hint:() => `${a} × what = ${a*k}?`}
    ]};
},

word(lvl){
  const r = pick(RECIPES), items = r.items, c = pick(CUSTOMERS);
  const [a, b] = coprimePair(lvl === 1 ? 5 : 8, lvl === 1 ? 5 : 8, 2);
  const base = [a, b], g = Math.random() < 0.5 ? 0 : 1, bl = 1 - g;
  const k = pickK(base[g], 2, kTop(lvl)), gv = base[g]*k;
  return {title:'A word problem', ctx:`${a}:${b}, ${gv} ${items[g][1]}`,
    bubble:`${c[1]}'s ${r.name.toLowerCase()} uses ${a} ${items[0][1]} for every ${b} ${items[1][1]}. Today ${c[1]} used ${gv} ${items[g][1]}. How many ${items[bl][1]} did ${c[1]} use?`,
    helper:'Find how many batches, then scale the other amount.',
    visual:`<div style="font-size:1.35rem">${c[0]} ${c[1]}'s recipe: <b>${a} ${items[0][0]}</b> for every <b>${b} ${items[1][0]}</b><br>Today: <b>${gv} ${items[g][0]}</b> and <b>? ${items[bl][0]}</b></div>`,
    steps:[
      {name:'Find the multiplier', type:'concept', kind:'num', prompt:'How many batches is that?', answer:k, fact:{x:base[g], y:k, div:true},
        mis:v => v === gv - base[g] ? 'additive' : null, hint:() => `${base[g]} × what = ${gv}?`},
      {name:'Scale the other part', type:'compute', kind:'num', prompt:`How many ${items[bl][0]} ${items[bl][1]}?`, answer:base[bl]*k, fact:{x:base[bl], y:k},
        mis:v => v === base[bl] + (gv - base[g]) ? 'additive' : v === gv ? 'wrongPart' : null, hint:() => `${k} batches × ${base[bl]} = ?`}
    ]};
},

realworld(lvl){
  const r = pick(RECIPES), [A, B] = r.items, c = pick(CUSTOMERS);
  const [a, b] = coprimePair(lvl === 1 ? 5 : 8, lvl === 1 ? 5 : 8, 2);
  const k = pickK(a, 2, kTop(lvl)), x = a*k;
  const same = Math.random() < 0.5;
  let y = b*k, kind = null;
  if (!same) { if (Math.random() < 0.55) { y = b + (x - a); kind = 'additive'; } else { y = b*(k + (Math.random() < 0.5 ? 1 : -1)); kind = 'mixedMultipliers'; } }
  const opts = [
    {html:'Same recipe', text:'Same recipe', ok:same, mis:same ? null : kind},
    {html:'Not the same', text:'Not the same', ok:!same, mis:same ? 'missedEquivalent' : null}
  ];
  return {title:'Taste test', ctx:`${a}:${b} vs ${x}:${y}`,
    bubble:`${c[1]} made ${r.name.toLowerCase()} with ${x} ${A[1]} and ${y} ${B[1]}. The recipe is ${a} to ${b}. Did ${c[1]} follow the recipe?`,
    helper:'Find the multiplier for each amount. Same multiplier means same recipe.',
    visual: `<table class="ratio"><thead><tr><th></th><th><span class="e">${A[0]}</span></th><th><span class="e">${B[0]}</span></th></tr></thead><tbody><tr class="base"><td>recipe</td><td>${a}</td><td>${b}</td></tr><tr><td>${c[0]}</td><td>${x}</td><td>${y}</td></tr></tbody></table>`,
    steps:[
      {name:'Find the multiplier', type:'concept', kind:'num', prompt:`${A[0]} went from ${a} to ${x}. What was it multiplied by?`, answer:k, fact:{x:a, y:k, div:true},
        mis:v => v === x - a ? 'additive' : null, hint:() => `${a} × what = ${x}?`},
      {name:'Decide if equivalent', type:'concept', kind:'choice', prompt:`Now check the ${B[0]}: is ${b} × ${k} equal to ${y}?`, options:opts,
        hint:() => `${b} × ${k} = ${b*k}. Compare that with ${y}.`}
    ]};
},

understand(lvl){
  const r = pick(RECIPES), [A, B] = r.items, c = pick(CUSTOMERS);
  const [a, b] = coprimePair(5, 5, 2), k = rand(2, lvl === 1 ? 4 : 6);
  let prompt, opts, bubble;
  if (Math.random() < 0.5) {
    bubble = `My ${r.name.toLowerCase()} uses ${a} ${A[1]} for every ${b} ${B[1]}. I want to make more. Which change keeps the taste exactly the same?`;
    prompt = 'Which change keeps the taste the same?';
    opts = [
      {html:`Use ${k} times as much of both`, ok:true, mis:null},
      {html:`Add ${k} more of each`, ok:false, mis:'additive'},
      {html:`Use ${k} times as much ${A[0]}, same ${B[0]}`, ok:false, mis:'oneSideOnly'},
      {html:`Add ${k} more ${A[0]} and use ${k} times as much ${B[0]}`, ok:false, mis:'mixedMultipliers'}
    ];
  } else {
    bubble = `${c[1]} used ${a*k} ${A[1]} and ${b*k} ${B[1]}. It tastes just like my ${a} to ${b} recipe. Why?`;
    prompt = 'Why does it taste the same?';
    opts = [
      {html:`Both amounts were multiplied by ${k}`, ok:true, mis:null},
      {html:`Both amounts went up by the same number`, ok:false, mis:'additive'},
      {html:`There is more ${A[0]} than before`, ok:false, mis:'oneSideOnly'},
      {html:`Bigger batches always taste the same`, ok:false, mis:'missedEquivalent'}
    ];
  }
  opts = shuffle(opts).slice(0).map(o => Object.assign(o, {text:o.html}));
  if (lvl === 1) { const right = opts.find(o => o.ok); opts = shuffle([right, ...opts.filter(o => !o.ok).slice(0,2)]); }
  return {title:'Think it through', ctx:`${a}:${b}, ×${k}`, bubble, helper:'Equivalent ratios keep the same relationship between the two amounts.',
    visual:`<div style="text-align:center; font-size:1.8rem">${a} ${A[0]} : ${b} ${B[0]}</div>`,
    steps:[{name:'Explain equivalence', type:'concept', kind:'choice', prompt, options:opts, hint:() => 'Think about what happens to BOTH amounts.'}]};
},

/* ---------- Station 4 ---------- */
coord(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  const lim = lvl === 1 ? 3 : 4;
  let a = rand(1, lim), b = rand(1, lim); if (a === b) b = b === 1 ? 2 : b - 1;
  const max = 12, kMaxHere = Math.floor(max / Math.max(a,b));
  const K = Math.min(kMaxHere, rand(4, Math.max(4, kMaxHere)));
  const plotKs = [2, 3];
  const rowsHTML = miniTable(`${A[0]} (x)`, `${B[0]} (y)`, [1,2,3].map(k => [a*k, b*k]));
  const starPt = [a*K, b*K];
  const steps = plotKs.map(k => ({name:'Plot a point', type:'concept', kind:'grid', prompt:`Plot the point for ${k} batches: (${A[0]}, ${B[0]}). Click the grid or type it.`, answer:[a*k, b*k],
    eq:v => v[0] === a*k && v[1] === b*k, plot:true, mis:v => (v[0] === b*k && v[1] === a*k) ? 'coordSwap' : null,
    hint:() => `Go across to ${a*k}, then up to ${b*k}.`}));
  steps.push({name:'Read a point', type:'compute', kind:'num', prompt:`The ⭐ point is on the same line. It has ${starPt[0]} ${A[0]}. How many ${B[0]} ${B[1]}?`, answer:starPt[1], fact:{x:b, y:K},
    mis:v => v === starPt[0] ? 'coordSwap' : null, hint:() => `Look straight up from ${starPt[0]} to the ⭐, then across to the y-axis.`});
  return {title:'Delivery map', ctx:`${a}:${b}`,
    bubble:`Plot my ${r.name.toLowerCase()} batches so the delivery driver can see the pattern!`,
    helper:'x goes across, y goes up. Every batch lands on the same straight line.',
    visual:`<div style="display:flex; gap:14px; flex-wrap:wrap; justify-content:center; align-items:center">${rowsHTML}${gridSVG(max, A[0], B[0], starPt)}</div>`, steps};
},

units(lvl){
  const CONV = [['cups','quart',4],['cups','pint',2],['teaspoons','tablespoon',3],['quarts','gallon',4],['inches','foot',12],['feet','yard',3],['ounces','pound',16],['minutes','hour',60]];
  const pool = lvl === 1 ? CONV.slice(0,4) : lvl === 2 ? CONV.slice(0,6) : CONV;
  const [small, big, f] = pick(pool);
  const n = pickK(f <= 12 ? f : 2, 2, f > 12 ? 6 : kTop(lvl));
  const bigToSmall = Math.random() < 0.5;
  const start = bigToSmall ? n : n*f, ans = bigToSmall ? n*f : n;
  const from = bigToSmall ? (n === 1 ? big : big + 's') : small, to = bigToSmall ? small : big + 's';
  const opts = [
    {html:`× ${f}`, text:`× ${f}`, ok:bigToSmall, mis:bigToSmall ? null : 'unitsDirection'},
    {html:`÷ ${f}`, text:`÷ ${f}`, ok:!bigToSmall, mis:bigToSmall ? 'unitsDirection' : null}
  ];
  return {title:'Measuring up', ctx:`1 ${big} = ${f} ${small}, ${start} ${from}`,
    bubble:`My recipe needs ${start} ${from}. My measuring tool only shows ${to}. How many ${to} is that?`,
    helper:`Remember: 1 ${big} = ${f} ${small}.`,
    visual:`<div style="text-align:center">${miniTable(big + 's', small, [[1, f],[2, 2*f],[3, 3*f]])}</div>`,
    steps:[
      {name:'Pick the operation', type:'concept', kind:'choice', prompt:`To change ${from} into ${to}, do we multiply or divide by ${f}?`, options:opts,
        hint:() => bigToSmall ? `A ${big} is bigger, so you need MORE ${small}.` : `A ${big} is bigger, so you need FEWER of them.`},
      {name:'Convert', type:'compute', kind:'num', prompt:`${start} ${from} = how many ${to}?`, answer:ans, fact:f <= 12 ? {x:f, y:n, div:!bigToSmall} : null,
        mis:v => (bigToSmall ? v === n : v === n*f*f) ? 'unitsDirection' : null, hint:() => bigToSmall ? `${n} × ${f} = ?` : `${n*f} ÷ ${f} = ?`}
    ]};
},

ppw(lvl){
  const [A, B] = twoCountables();
  const [a, b] = coprimePair(lvl === 1 ? 4 : 6, lvl === 1 ? 4 : 6);
  const n = a + b, u = pickK(n, 2, kTop(lvl)), T = n*u;
  const askB = Math.random() < 0.5, askE = askB ? B : A, askN = askB ? b : a, othN = askB ? a : b;
  if (lvl === 1 || Math.random() < 0.6) {
    return {title:'Party platter', ctx:`${a}:${b}, whole ${T}`,
      bubble:`My party platter has ${A[1]} and ${B[1]} in a ${a} to ${b} ratio. There are ${T} treats in all. How many ${askE[1]}?`,
      helper:'Part + part = whole. Find the value of one part.',
      visual:`<div style="text-align:center; font-size:1.4rem">${A[0]} : ${B[0]} = ${a} : ${b}<br>whole platter = ${T}</div>`,
      steps:[
        {name:'Count total parts', type:'concept', kind:'num', prompt:'How many parts make up the whole platter?', answer:n,
          mis:v => (v === a || v === b || v === a*b) ? 'partsCount' : null, hint:() => `${a} parts + ${b} parts.`},
        {name:'Value of one part', type:'compute', kind:'num', prompt:`${T} treats ÷ ${n} parts = how many in each part?`, answer:u, fact:{x:n, y:u, div:true},
          mis:v => ((T % a === 0 && v === T/a) || (T % b === 0 && v === T/b)) ? 'divideWrong' : null, hint:() => `${T} ÷ ${n} = ?`},
        {name:'Find the part', type:'compute', kind:'num', prompt:`How many ${askE[0]} ${askE[1]}?`, answer:askN*u, fact:{x:askN, y:u},
          mis:v => v === u ? 'oneBox' : v === othN*u ? 'wrongPart' : null, hint:() => `${askN} parts × ${u} each.`}
      ]};
  }
  const G = askN*u;
  return {title:'Party platter', ctx:`${a}:${b}, part ${G}`,
    bubble:`My platter has ${A[1]} and ${B[1]} in a ${a} to ${b} ratio. It has ${G} ${askE[1]}. How many treats are on the whole platter?`,
    helper:'Find the value of one part, then count all the parts.',
    visual:`<div style="text-align:center; font-size:1.4rem">${A[0]} : ${B[0]} = ${a} : ${b}<br>${askE[0]} = ${G}, whole = ?</div>`,
    steps:[
      {name:'Value of one part', type:'compute', kind:'num', prompt:`${G} ${askE[0]} fill ${askN} parts. How many in each part?`, answer:u, fact:{x:askN, y:u, div:true}, hint:() => `${G} ÷ ${askN} = ?`},
      {name:'Count total parts', type:'concept', kind:'num', prompt:'How many parts make up the whole platter?', answer:n,
        mis:v => (v === a || v === b) ? 'partsCount' : null, hint:() => `${a} + ${b}.`},
      {name:'Find the whole', type:'compute', kind:'num', prompt:'How many treats on the whole platter?', answer:T, fact:{x:n, y:u},
        mis:v => v === G + othN ? 'additive' : v === othN*u ? 'wrongPart' : null, hint:() => `${n} parts × ${u} each.`}
    ]};
}
};

/* ===================== UI ===================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const petReward = () => REWARDS.find(r => r.kind === 'pet' && r.id === S.pet) || REWARDS.find(r => r.kind === 'pet');
const petEmoji = () => petReward().emoji;
const petName = () => petReward().name.split(' ')[0];
const fmtPow = p => p.toFixed(2).replace(/0$/,'').replace(/\.0$/,'');
const townName = () => S.name ? S.name + "'s Pet Town" : 'Pet Town';
$('#unlockHelper').addEventListener('click', () => closeUnlock('helper'));
$('#unlockDisplay').addEventListener('click', () => closeUnlock('display'));
$('#unlockShop').addEventListener('click', () => closeUnlock('shop'));
$('#unlockKeep').addEventListener('click', () => closeUnlock(false));

let bookUnit = 'cafe';
const SCREENS = ['loading','join','name','home','cafe','shift','sprint','book','summary','shop','hall','parent'];
function show(id){
  SCREENS.forEach(s => $('#scr-'+s).hidden = (s !== id));
  Music.setTempo(id === 'sprint' ? 132 : 96);
  updateHeader();
  if (id === 'home') renderHome();
  if (id === 'cafe') renderCafe();
  if (id === 'book') renderBook(bookUnit);
  window.scrollTo(0,0);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) show(b.dataset.go); });
function updateHeader(){
  $('#townTitle').textContent = townName(); document.title = townName();
  $('#coinCount').textContent = S.coins;
  $('#powerChip').hidden = !(S.power > 1);
  $('#powerVal').textContent = '×' + fmtPow(S.power);
  $('#muteBtn').textContent = S.muted ? '🔇' : '🔊';
  $('#muteBtn').setAttribute('aria-label', S.muted ? 'Turn sound effects on' : 'Turn sound effects off');
  $('#musicBtn').classList.toggle('off', !S.music);
  $('#musicBtn').setAttribute('aria-label', S.music ? 'Turn music off' : 'Turn music on');
  $('#musicBtn').setAttribute('aria-pressed', String(S.music));
}
let toastTimer;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800); }
function coinBurst(el, n){
  if (reduceMotion() || !el) return;
  const r = el.getBoundingClientRect();
  for (let i=0;i<Math.min(n,8);i++){
    const s = document.createElement('span'); s.className = 'coinpop'; s.textContent = '🪙';
    s.style.left = (r.left + r.width/2 + rand(-90,90)) + 'px'; s.style.top = (r.top + r.height/3 + rand(-20,30)) + 'px';
    s.style.animationDelay = (i*70) + 'ms'; document.body.appendChild(s); setTimeout(() => s.remove(), 1500);
  }
}

/* ---------- audio ---------- */
let actx;
function getCtx(){ if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx; }
function sfx(kind){
  if (S.muted) return;
  try {
    const ctx = getCtx();
    const notes = {good:[660,880], coin:[988,1319,1568], unlock:[523,659,784,1047], bad:[240,190], tick:[523]}[kind] || [523];
    notes.forEach((f,i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = kind === 'bad' ? 'triangle' : 'sine'; o.frequency.value = f;
      const t = ctx.currentTime + i*0.09;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t+0.02); g.gain.exponentialRampToValueAtTime(0.0001, t+0.2);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.22);
    });
  } catch(e){}
}
const Music = (() => {
  let ctx, master, melBus, timer = null, step = 0, nextTime = 0, tempo = 96, playing = false;
  const CH = [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]], BASS = [36,33,41,43], ARP = [0,1,2,3,2,1,2,1];
  const MA = [76,null,79,null,81,79,76,null, 72,null,76,null,74,null,72,null, 69,null,72,null,74,72,69,null, 71,null,74,null,79,null,null,null];
  const MB = [79,null,76,79,81,null,79,null, 76,null,72,null,76,74,null,null, 72,null,69,72,74,null,76,null, 74,null,71,null,67,null,null,null];
  const mtof = m => 440 * Math.pow(2, (m-69)/12);
  function init(){
    ctx = getCtx(); master = ctx.createGain(); master.gain.value = 0.0001;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; master.connect(lp); lp.connect(ctx.destination);
    melBus = ctx.createGain(); melBus.connect(master);
    const d = ctx.createDelay(); d.delayTime.value = 0.31; const fb = ctx.createGain(); fb.gain.value = 0.22; const wet = ctx.createGain(); wet.gain.value = 0.28;
    melBus.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(master);
  }
  function note(m, t, dur, type, g, bus){
    const o = ctx.createOscillator(), a = ctx.createGain(); o.type = type; o.frequency.value = mtof(m);
    a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g, t+0.015); a.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    o.connect(a); a.connect(bus || master); o.start(t); o.stop(t+dur+0.05);
  }
  function schedule(){
    const e8 = 60 / tempo / 2;
    while (nextTime < ctx.currentTime + 0.15) {
      const bar = Math.floor(step/8) % 4, s8 = step % 8, loop = Math.floor(step/32), ch = CH[bar];
      if (s8 === 0 || s8 === 4) note(BASS[bar], nextTime, e8*3.5, 'sine', 0.45);
      note(ch[ARP[s8]], nextTime, e8*1.5, 'triangle', 0.09);
      if (tempo > 110 && s8 % 2 === 0) note(ch[3]+12, nextTime, 0.05, 'square', 0.015);
      const mel = loop % 4 === 0 ? null : (loop % 4 === 3 ? MB : MA), m = mel && mel[step % 32];
      if (m) note(m, nextTime, e8*1.8, 'sine', 0.22, melBus);
      nextTime += e8; step++;
    }
  }
  return {
    start(){ try { if (!ctx) init(); if (playing) return; playing = true; getCtx(); nextTime = ctx.currentTime + 0.05; timer = setInterval(schedule, 25);
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 1.2); } catch(e){} },
    stop(){ if (!playing || !ctx) return; playing = false; master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime); master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      const t = timer; timer = null; setTimeout(() => clearInterval(t), 450); },
    setTempo(t){ tempo = t; }
  };
})();
function kickMusic(){ if (S.music && !document.hidden) Music.start(); }
['pointerdown','keydown'].forEach(ev => document.addEventListener(ev, kickMusic));
document.addEventListener('visibilitychange', () => { if (document.hidden) Music.stop(); else kickMusic(); });
$('#muteBtn').addEventListener('click', () => { S.muted = !S.muted; save(); updateHeader(); if (!S.muted) sfx('tick'); });
$('#musicBtn').addEventListener('pointerdown', e => e.stopPropagation());
$('#musicBtn').addEventListener('click', e => { e.stopPropagation(); S.music = !S.music; save(); updateHeader(); if (S.music) Music.start(); else Music.stop(); });

function b64u(bytes){ let s = ''; for (let i=0;i<bytes.length;i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
/* replace the whole town with another save (from the account or a backup code) */
function adopt(state, fromBackup){
  S = normalize(state);
  save();
  if (!$('#scr-shift').hidden) return;
  if (!S.name) (Backend.me ? show('join') : openName());
  else if (!$('#scr-name').hidden || !$('#scr-home').hidden) show('home');
  else updateHeader();
}
async function packCode(prefix, json){
  try {
    if (window.CompressionStream) {
      const buf = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();
      return prefix + 'Z.' + b64u(new Uint8Array(buf));
    }
  } catch(e){}
  return prefix + 'J.' + b64u(new TextEncoder().encode(json));
}
async function unpackCode(code){
  const m = code.trim().match(/^PTS([ZJ])\.([A-Za-z0-9_-]+)$/); if (!m) throw new Error('not a backup code');
  let s = m[2].replace(/-/g,'+').replace(/_/g,'/'); while (s.length % 4) s += '=';
  const bin = atob(s), bytes = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  if (m[1] === 'J') return JSON.parse(new TextDecoder().decode(bytes));
  return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text());
}
const backupCode = () => packCode('PTS', JSON.stringify(S));

/* ---------- name ---------- */
function openName(){ $('#nameInput').value = S.name; updatePreview(); show('name'); setTimeout(() => $('#nameInput').focus(), 50); }
function updatePreview(){ const v = $('#nameInput').value.trim(); $('#namePreview').textContent = v ? v + "'s Pet Town" : 'Your Pet Town'; }
$('#nameInput').addEventListener('input', updatePreview);
$('#nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#nameSave').click(); });
$('#nameSave').addEventListener('click', () => {
  const v = $('#nameInput').value.trim().slice(0,20);
  if (!v) { toast('Type your name first'); $('#nameInput').focus(); return; }
  S.name = v; save(); sfx('good'); show('home');
});

/* ---------- town ---------- */
function renderHome(){
  const helper = petReward(), displayed = S.displayed.map(id => id ? REWARDS.find(reward => reward.id === id) : null);
  const ownedDecor = S.decor.map(id => REWARDS.find(reward => reward.id === id)).filter(Boolean);
  const stickerCount = REWARDS.filter(owns).length;
  const slots = displayed.map((reward, i) => reward
    ? `<button type="button" class="display-slot filled" data-case-slot="${i}" aria-label="${esc(reward.name)}"><span>${reward.emoji}</span><small>${esc(reward.name)}</small></button>`
    : `<button type="button" class="display-slot empty" data-case-slot="${i}" aria-label="Empty display slot"><span>+</span><small>${ownedDecor.length < 8 ? 'Earn more in the café!' : 'Add a decoration'}</small></button>`).join('');
  $('#displayCaseWrap').innerHTML = `<div class="display-case"><button type="button" class="helper-box" data-case-pet aria-label="Choose helper pet"><span class="helper-box-emoji">${helper.emoji}</span><strong>My helper</strong><small>${esc(helper.name)}</small></button><div class="case-main"><div class="display-shelves">${slots}</div></div></div><button type="button" class="display-progress" data-open="book">📒 Sticker Book: ${stickerCount} of ${REWARDS.length} stickers</button>`;
  $('#dayChip').textContent = 'Day ' + S.day;
  $('#ordersChip').textContent = S.orders + ' orders served';
  let h = '';
  BUILDINGS.forEach(b => {
    const rewards = REWARDS.filter(r => r.unit === b.id), owned = rewards.filter(owns).length;
    const stickers = b.open ? `<span class="tile-stickers" aria-label="${owned} of ${rewards.length} stickers">${rewards.map(r => `<i class="${owns(r) ? 'filled' : ''}" title="${esc(r.name)}"></i>`).join('')}</span>` : '';
    const progress = b.open ? `<span class="tile-collection">${owned}/${rewards.length}</span>${stickers}` : '';
    h += b.open
      ? `<button class="tile" data-open="${b.id}"><span class="te">${b.emoji}</span><span class="tn">${b.name}</span><span class="tu">${b.unit}</span>${progress}</button>`
      : `<div class="tile locked" aria-disabled="true"><span class="te">${b.emoji}</span><span class="tn">${b.name}</span><span class="tu">${b.unit}</span>${progress}<span class="soon">Opening soon</span></div>`;
  });
  h += `<button class="tile service" data-open="sprint"><span class="te">⚡</span><span class="tn">Sprint Track</span><span class="tu">${S.power > 1 ? 'Tips powered up ×' + fmtPow(S.power) : '60-second times tables'}</span></button>`;
  const bookNew = REWARDS.some(reward => owns(reward) && !S.seenCollection.includes(reward.id));
  h += `<button class="tile service" data-open="book"><span class="tile-new" ${bookNew ? '' : 'hidden'}>New!</span><span class="te">🛍️</span><span class="tn">Pet Shop & Sticker Book</span><span class="tu">${REWARDS.filter(owns).length} stickers filled</span></button>`;
  h += `<button class="tile service" data-open="hall"><span class="te">🏛️</span><span class="tn">Town Hall</span><span class="tu">Backups and progress</span></button>`;
  $('#town').innerHTML = h;
}
let pickerMode = '', pickerSlot = -1;
function openDisplayPicker(mode, slot){
  pickerMode = mode; pickerSlot = slot == null ? -1 : slot;
  const options = mode === 'pet'
    ? REWARDS.filter(reward => reward.kind === 'pet' && owns(reward)).map(reward => `<button type="button" class="picker-option" data-picker-id="${reward.id}"><span>${reward.emoji}</span>${esc(reward.name)}</button>`).join('')
    : REWARDS.filter(reward => reward.kind === 'decor' && owns(reward) && (!S.displayed.includes(reward.id) || S.displayed[pickerSlot] === reward.id)).map(reward => `<button type="button" class="picker-option" data-picker-id="${reward.id}"><span>${reward.emoji}</span>${esc(reward.name)}</button>`).join('');
  $('#displayPickerTitle').textContent = mode === 'pet' ? 'Choose your helper' : 'Choose a decoration';
  $('#displayPickerOptions').innerHTML = (mode === 'decor' && pickerSlot >= 0 && S.displayed[pickerSlot]) ? `<button type="button" class="picker-option picker-remove" data-picker-remove>Remove from display</button>${options}` : options;
  $('#displayPicker').hidden = false; $('main').inert = true;
}
function closeDisplayPicker(){ $('#displayPicker').hidden = true; $('main').inert = false; pickerMode = ''; pickerSlot = -1; }
$('#displayCaseWrap').addEventListener('click', e => {
  const button = e.target.closest('button'); if (!button) return;
  if (button.dataset.open === 'book') { show('book'); return; }
  if (button.dataset.casePet !== undefined) { openDisplayPicker('pet'); return; }
  if (button.dataset.caseSlot !== undefined) { openDisplayPicker('decor', +button.dataset.caseSlot); }
});
$('#displayPickerOptions').addEventListener('click', e => {
  const button = e.target.closest('button'); if (!button) return;
  if (pickerMode === 'pet' && button.dataset.pickerId) { S.pet = button.dataset.pickerId; save(); closeDisplayPicker(); renderHome(); updateHeader(); return; }
  if (pickerMode === 'decor' && button.dataset.pickerRemove !== undefined) { S.displayed[pickerSlot] = null; save(); closeDisplayPicker(); renderHome(); return; }
  if (pickerMode === 'decor' && button.dataset.pickerId) { S.displayed[pickerSlot] = button.dataset.pickerId; save(); closeDisplayPicker(); renderHome(); }
});
$('#displayPickerClose').addEventListener('click', closeDisplayPicker);
$('#town').addEventListener('click', e => {
  const b = e.target.closest('[data-open]'); if (!b) return;
  const id = b.dataset.open;
  if (id === 'cafe') show('cafe');
  else if (id === 'sprint') openSprint();
  else if (id === 'shop') show('book');
  else if (id === 'book') show('book');
  else if (id === 'hall') { renderHall(); show('hall'); }
});

/* ---------- café stations ---------- */
function renderCafe(){
  $('#stations').innerHTML = STATIONS.map(st => {
    const open = stationOpen(st.id), done = S.cafe.st[st.id] || 0;
    const prev = st.id > 1 ? (S.cafe.st[st.id-1] || 0) : 0;
    const lock = open ? '' : `<p class="muted" style="margin:0">Opens after ${UNLOCK_AT} orders at ${STATIONS[st.id-2].name} (${Math.min(prev, UNLOCK_AT)} of ${UNLOCK_AT}).</p>`;
    const skills = st.skills.map(sk => { const s = skillStatus(sk); return `<li><span class="pill p-${s}">${s === 'new' ? 'new' : s}</span>${esc(SKILLS[sk].name)}</li>`; }).join('');
    return `<div class="station ${open ? '' : 'locked'}"><div class="se">${st.emoji}</div><h3>${st.id}. ${st.name}</h3><p class="muted" style="margin:0">${st.kid}</p>
      <ul class="skilllist">${skills}</ul>${lock}<p class="muted" style="margin:0">${done} orders served here</p>
      <button class="btn ${open ? 'berry' : ''}" data-station="${st.id}" ${open ? '' : 'disabled'}>${open ? 'Open for business' : 'Locked'}</button></div>`;
  }).join('');
}
$('#stations').addEventListener('click', e => { const b = e.target.closest('[data-station]'); if (b && !b.disabled) startShift(+b.dataset.station); });

/* ---------- shift engine ---------- */
let shift = null, order = null;
let patienceTimer = null;
function startShift(station){
  void Backend.refreshSettings();
  shift = {station, n:0, total:5, earned:0, perfect:0, missed:[], power:S.power, practiced:new Set(), drillMisses:new Set(), popups:0, lastSkill:null};
  $('#helperPet').textContent = petEmoji();
  $('#shiftStation').textContent = STATIONS[station-1].emoji + ' ' + STATIONS[station-1].name;
  show('shift'); nextCustomer();
}
function renderDots(){ let h = ''; for (let i=1;i<=shift.total;i++) h += `<i class="${i < shift.n ? 'done' : i === shift.n ? 'now' : ''}"></i>`; $('#dots').innerHTML = h; }
function setHelper(msg){ $('#helperSay').textContent = petName() + ': ' + msg; }
function startPatience(seconds, fromPct){
  const p = $('#patience'), label = $('#patienceLabel'), total = order && order.limit || seconds;
  if (patienceTimer) clearInterval(patienceTimer);
  const endAt = performance.now() + seconds * 1000;
  const tick = () => {
    const left = Math.max(0, (endAt - performance.now()) / 1000), pct = Math.max(0, left / total);
    p.classList.toggle('tip-warn', pct <= .5 && pct > .2); p.classList.toggle('tip-danger', pct <= .2);
    label.textContent = left > 0 ? `⏱ ${Math.ceil(left)}s for a speed bonus` : 'No speed bonus, but take your time!';
    if (!left) { clearInterval(patienceTimer); patienceTimer = null; }
  };
  p.classList.remove('tip-warn','tip-danger'); p.style.transition = 'none'; p.style.width = (fromPct == null ? 100 : fromPct) + '%'; void p.offsetWidth;
  p.style.transition = `width ${seconds}s linear`; p.style.width = '0%'; tick(); patienceTimer = setInterval(tick, 100);
}
function freezePatience(){ const p = $('#patience'); if (patienceTimer) { clearInterval(patienceTimer); patienceTimer = null; } const w = getComputedStyle(p).width; p.style.transition = 'none'; p.style.width = w; }
function chooseSkill(){
  const W = {new:3, struggling:5, practicing:3, mastered:1};
  const skills = STATIONS[shift.station-1].skills;
  let list = skills.filter(s => s !== shift.lastSkill); if (!list.length) list = skills;
  return weightedPick(list, s => W[skillStatus(s)]);
}
function nextCustomer(){
  if (shift.n >= shift.total) { endShift(); return; }
  shift.n++; renderDots();
  const c = pick(CUSTOMERS), sk = chooseSkill(); shift.lastSkill = sk;
  const p = GEN[sk](lvlOf(sk)); p.skill = sk;
  order = {p, cust:c, i:0, tries:0, hints:0, missed:[], done:false, start:null, pending:null};
  const ce = $('#custEmoji'); ce.textContent = c[0]; ce.classList.remove('enter'); void ce.offsetWidth; ce.classList.add('enter');
  $('#custName').textContent = c[1];
  const ticketText = esc(p.bubble), questionEnd = ticketText.lastIndexOf('?');
  const questionStart = questionEnd < 0 ? -1 : Math.max(ticketText.lastIndexOf('.', questionEnd - 1), ticketText.lastIndexOf('!', questionEnd - 1), ticketText.lastIndexOf('?', questionEnd - 1)) + 1;
  const ticketLead = questionStart > 0 ? ticketText.slice(0, questionStart).trim() : '';
  const ticketQuestion = questionStart >= 0 ? ticketText.slice(questionStart).trim() : ticketText;
  const boldNumbers = text => text.replace(/\b\d+(?:\.\d+)?\b/g, '<b>$&</b>');
  const plan = p.steps.map((st, i) => `<span class="chip${i === 0 ? ' now' : ''}" data-plan-step="${i}">${i + 1}. ${esc(st.name)}</span>`).join('<span class="plan-arrow" aria-hidden="true">→</span>');
  $('#custBubble').textContent = pick(['Here\'s my order!','Order up, please!','Can you help me with this one?']);
  setHelper(p.helper || 'Take it one step at a time.');
  $('#board').innerHTML = `<div class="board-title">${esc(p.title)}</div><div class="skill-tag">${esc(SKILLS[sk].name)}</div>
    <div class="ticket"><div class="ticket-customer"><span>${c[0]}</span><b>${esc(c[1])}</b></div><div class="ticket-question">${ticketLead ? boldNumbers(ticketLead) + ' ' : ''}<span class="ticket-find">❓ Find: ${boldNumbers(ticketQuestion)}</span></div></div>
    <div class="plan" id="plan" aria-label="Order plan">${plan}</div>
    <div class="visual">${p.visual}</div><div class="done-list" id="doneList"></div>
    <div class="step-prompt" id="stepPrompt"></div><div class="step-input" id="stepInput"></div><div class="chalk-note" id="chalkNote" aria-live="polite"></div>`;
  $('#boardActions').innerHTML = '';
  $('#stepPrompt').hidden = true; $('#stepInput').hidden = true;
  const svg = $('#gridsvg');
  if (svg) svg.addEventListener('click', e => {
    const c = e.target.closest('.ghit'); if (!c) return;
    const st = order.p.steps[order.i]; if (!st || st.kind !== 'grid' || order.done) return;
    submit([+c.dataset.x, +c.dataset.y]);
  });
  order.limit = p.steps.length * 12;
  const currentOrder = order;
  const beginOrder = () => {
    if (order !== currentOrder || order.done || order.start !== null) return;
    document.removeEventListener('keydown', onReadyKey);
    order.start = performance.now();
    startPatience(order.limit);
    $('#stepPrompt').hidden = false; $('#stepInput').hidden = false;
    $('#boardActions').innerHTML = '<button class="btn berry" id="checkBtn">Check</button><button class="btn" id="hintBtn">Hint</button>';
    $('#checkBtn').addEventListener('click', checkCurrent);
    $('#hintBtn').addEventListener('click', hint);
    activateStep(0);
  };
  const onReadyKey = e => { if (e.key === 'Enter') { e.preventDefault(); beginOrder(); } };
  const readyTimer = setTimeout(() => {
    if (order !== currentOrder || order.done) return;
    $('#boardActions').innerHTML = '<button class="btn berry" id="readyBtn">I\'m ready, let\'s start!</button>';
    $('#readyBtn').addEventListener('click', beginOrder);
    $('#readyBtn').focus();
    document.addEventListener('keydown', onReadyKey);
  }, 1500);
  order.readyTimer = readyTimer;
  const patience = $('#patience'); patience.classList.remove('tip-warn','tip-danger'); patience.style.transition = 'none'; patience.style.width = '100%';
  $('#patienceLabel').textContent = 'Read your order, then start when you are ready.';
}
const slotEl = id => document.querySelector(`#board [data-slot="${id}"]`);
function numInput(id, label){ return `<input class="cell" id="${id}" inputmode="decimal" autocomplete="off" maxlength="6" aria-label="${esc(label)}">`; }
function wireNum(inp, onEnter){
  inp.addEventListener('input', () => { inp.value = inp.value.replace(/[^\d.]/g,''); inp.classList.remove('wrong'); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); onEnter(); } });
}
function numberPad(input, onSubmit){
  if (!matchMedia('(pointer: coarse)').matches) return null;
  const existing = input.nextElementSibling;
  if (existing?.classList.contains('number-pad')) { existing.hidden = false; return existing; }
  input.readOnly = true;
  const pad = document.createElement('div'); pad.className = 'number-pad'; pad.setAttribute('aria-label', 'Number pad');
  ['7','8','9','4','5','6','1','2','3','⌫','0','✓'].forEach(key => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'number-key'; button.textContent = key;
    button.setAttribute('aria-label', key === '⌫' ? 'Delete' : key === '✓' ? 'Check' : key);
    button.addEventListener('click', () => {
      sfx('tick');
      if (key === '⌫') input.value = input.value.slice(0, -1);
      else if (key !== '✓') input.value += key;
      if (key !== '✓') input.dispatchEvent(new Event('input', {bubbles:true}));
      else onSubmit();
    });
    pad.appendChild(button);
  });
  input.insertAdjacentElement('afterend', pad);
  return pad;
}
function activateStep(i){
  order.i = i; const st = order.p.steps[i]; st.t0 = performance.now();
  $$('#plan .chip').forEach((chip, index) => chip.classList.toggle('now', index === i));
  $('#stepPrompt').innerHTML = `<span class="stepnum">Step ${i+1} of ${order.p.steps.length}</span>${esc(st.prompt)}`;
  const box = $('#stepInput'); box.innerHTML = '';
  $('#checkBtn').hidden = st.kind === 'choice';
  if (st.kind === 'num') {
    const html = numInput('cur', st.prompt);
    if (st.slot) { const sl = slotEl(st.slot); sl.classList.add('active'); sl.innerHTML = html; } else box.innerHTML = html;
    const inp = $('#cur'); wireNum(inp, checkCurrent); setTimeout(() => inp.focus(), 40);
  } else if (st.kind === 'ratio') {
    box.innerHTML = `<span class="rlbl">${st.labels[0]}</span>${numInput('curA','first number')}<span class="colon">:</span>${numInput('curB','second number')}<span class="rlbl">${st.labels[1]}</span>`;
    wireNum($('#curA'), () => { if (!$('#curB').value) $('#curB').focus(); else checkCurrent(); });
    wireNum($('#curB'), checkCurrent);
    setTimeout(() => $('#curA').focus(), 40);
  } else if (st.kind === 'choice') {
    box.innerHTML = `<div class="opts">${st.options.map((o,k) => `<button class="opt" data-k="${k}">${o.html}</button>`).join('')}</div>`;
    box.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { if (!b.disabled) submit(+b.dataset.k); }));
    setTimeout(() => { const f = box.querySelector('.opt'); if (f) f.focus(); }, 40);
  } else if (st.kind === 'grid') {
    box.innerHTML = `<span style="font-size:1.1rem">Or type it: (</span>${numInput('gx','x')}<span>,</span>${numInput('gy','y')}<span>)</span>`;
    wireNum($('#gx'), () => $('#gy').focus()); wireNum($('#gy'), checkCurrent);
  }
}
function readCurrent(st){
  const num = id => { const el = $(id); if (!el || el.value === '') return null; const n = Number(el.value); return isNaN(n) ? null : n; };
  if (st.kind === 'num') return num('#cur');
  if (st.kind === 'ratio') { const a = num('#curA'), b = num('#curB'); return (a === null || b === null) ? null : [a, b]; }
  if (st.kind === 'grid') { const x = num('#gx'), y = num('#gy'); return (x === null || y === null) ? null : [x, y]; }
  return null;
}
function checkCurrent(){
  if (!order || order.done || pr) return;
  const st = order.p.steps[order.i], v = readCurrent(st);
  if (v === null) { const f = $('#cur') || $('#curA') || $('#gx'); if (f) f.focus(); return; }
  submit(v);
}
const fmtV = (v, st) => st.kind === 'choice' ? (st.options[v] ? st.options[v].text : '?') : Array.isArray(v) ? (st.kind === 'grid' ? `(${v[0]}, ${v[1]})` : `${v[0]}:${v[1]}`) : String(v);
function gridXY(x, y){
  const svg = $('#gridsvg'); const max = +svg.dataset.max, pad = +svg.dataset.pad, top = +svg.dataset.top, W = 330, sz = (W - pad - top) / max;
  return [pad + x*sz, W - pad - y*sz];
}
function plotDot(v, cls){
  const svg = $('#gridsvg'); if (!svg) return; const max = +svg.dataset.max;
  if (v[0] < 0 || v[1] < 0 || v[0] > max || v[1] > max) return;
  const [cx, cy] = gridXY(v[0], v[1]);
  const g = svg.querySelector('#gdots'); const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', 7); c.setAttribute('class', cls); g.appendChild(c);
  if (cls === 'gbad') setTimeout(() => c.remove(), 1200);
}
const STEP_TYPE = {concept:'idea', compute:'arith', setup:'setup'};
function logAttempt(st, v, ok, slow, first, misId, ms, context){
  // called for every first try, and for later tries only when they reveal a new mix-up
  if (!Backend.me) return;
  const right = st.kind === 'choice' ? (st.options.find(o => o.ok) || {}).text : fmtV(st.answer, st);
  Backend.log('attempts', {shop:'cafe', skill:order.p.skill, step:st.name, step_type:STEP_TYPE[st.type] || 'setup',
    correct:ok, first_try:first, slow, answer:String(fmtV(v, st)).slice(0,60), expected:String(right).slice(0,60),
    misconception:misId || null, context:context ? context.slice(0,300) : null,
    fact_a:st.fact ? st.fact.x : null, fact_b:st.fact ? st.fact.y : null, fact_div:st.fact ? !!st.fact.div : null, ms:Math.round(ms)});
}
function submit(v){
  if (!order || order.done || pr) return;
  const st = order.p.steps[order.i], first = !st.tried; st.tried = true;
  let ok;
  if (st.kind === 'choice') ok = !!(st.options[v] && st.options[v].ok);
  else ok = st.eq ? st.eq(v) : v === st.answer;
  const ms = performance.now() - st.t0;
  if (first && st.type !== 'setup') recordPace(STEP_TYPE[st.type], ms);
  const slow = ok && first && st.type !== 'setup' && ms > slowLimit(STEP_TYPE[st.type]);
  if (first) {
    recordStep(order.p.skill, st, ok, slow);
    if (st.fact) logFact(st.fact.x, st.fact.y, ok, 0, st.fact.div ? 'divFacts' : 'facts', slow);
  }
  let misId = null, newMis = null, ex = null;
  if (!ok) {
    misId = st.kind === 'choice' ? (st.options[v] && st.options[v].mis) : (st.mis ? st.mis(v) : null);
    if (!misId && st.fact && !st.fact.div && typeof v === 'number') {
      const {x, y} = st.fact; if ([x*(y-1), x*(y+1), (x-1)*y, (x+1)*y].includes(v)) misId = 'factSlip';
    }
    st.misSeen = st.misSeen || new Set();
    if (misId && !st.misSeen.has(misId)) {
      st.misSeen.add(misId);
      newMis = misId;
      ex = `${SKILLS[order.p.skill].name} (${order.p.ctx}): ${st.name.toLowerCase()}, answered ${fmtV(v, st)}` + (st.kind === 'choice' ? '' : `, correct ${fmtV(st.answer, st)}`);
      recordMis(misId, ex);
    }
  }
  if (first || newMis) logAttempt(st, v, ok, slow, first, newMis, ms, ex);
  if ((!ok || slow) && st.type !== 'setup') {
    if (first) order.missed.push(`${SKILLS[order.p.skill].name}: ${st.name.toLowerCase()}`);
    if ((!ok ? first : true)) queueDrill(st, ok ? 'slow' : 'miss');
  }
  if (ok) stepRight(st, v); else stepWrong(st, v, misId);
  save();
  if (order.pending) {
    const p = order.pending; order.pending = null; shift.practiced.add(p.type + ':' + p.key);
    setTimeout(() => openPractice(p, () => ok ? advance() : refocus(st)), ok ? 500 : 800);
    return;
  }
  if (ok) advance();
}
function stepRight(st, v){
  const note = $('#chalkNote'); note.className = 'chalk-note good'; note.textContent = pick(['Yes!','Nice!','Correct!','You got it!']);
  const planStep = $(`#plan [data-plan-step="${order.i}"]`); if (planStep) planStep.classList.add('done');
  if (st.slot) { const sl = slotEl(st.slot); sl.classList.remove('active'); sl.classList.add('filled'); sl.innerHTML = `<span class="slotval">${fmtV(v, st)}</span>`; }
  else if (st.kind === 'choice') {
    $$('#stepInput .opt').forEach((b,k) => { b.disabled = true; if (k === v) b.classList.add('yes'); });
    $('#doneList').insertAdjacentHTML('beforeend', `<div>✓ ${esc(st.name)}: ${esc(st.options[v].text)}</div>`);
  } else $('#doneList').insertAdjacentHTML('beforeend', `<div>✓ ${esc(st.name)}: ${esc(fmtV(v, st))}</div>`);
  if (st.kind === 'grid') plotDot(v, 'gdot');
  if (st.fill) $$('#board ' + st.fill.sel).forEach(b => { b.textContent = st.fill.text; b.classList.add('filled'); });
  sfx('good');
}
function stepWrong(st, v, misId){
  order.tries++; S.streak = 0;
  const note = $('#chalkNote'); note.className = 'chalk-note oops';
  note.textContent = (misId && MIS[misId]) ? MIS[misId].kid : 'Not quite. Try again, or tap Hint.';
  if (st.kind === 'choice') { const b = $$('#stepInput .opt')[v]; if (b) { b.disabled = true; b.classList.add('no'); } }
  else if (st.kind === 'grid') plotDot(v, 'gbad');
  $$('#board input.cell').forEach(inp => { inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); });
  sfx('bad'); refocus(st);
}
function refocus(st){
  if (st.kind === 'choice') { const b = $$('#stepInput .opt').find(x => !x.disabled); if (b) b.focus(); return; }
  const el = $('#cur') || $('#curA') || $('#gx'); if (el) { el.focus(); if (el.select) el.select(); }
}
function advance(){ if (order.i + 1 < order.p.steps.length) activateStep(order.i + 1); else completeOrder(); }
function hint(){
  if (!order || order.done) return;
  const st = order.p.steps[order.i]; order.hints++;
  setHelper(st.hint ? st.hint() : 'Read the question again, one part at a time.'); sfx('tick'); refocus(st);
}
function queueDrill(st, reason){
  if (order.pending) return;
  let drill;
  if (st.drill) drill = {...st.drill, key:String(st.drill.key), reason};
  else if (st.fact) {
    const {x, y, div} = st.fact;
    const weakness = n => { let a = 0, w = 0; ['facts','divFacts'].forEach(stn => Object.entries(S[stn]).forEach(([k,f]) => { if (k.split('x').map(Number).includes(n)) { a += f.a; w += f.a - f.c + (f.s||0); } })); return a ? w/a : 0; };
    const table = div ? x : (weakness(y) > weakness(x) ? y : x), other = table === x ? y : x;
    if (table < 2 || table > 12 || other < 1 || other > 12) return;
    drill = {type:'times', key:String(table), other, reason, div:!!div, text:div ? `${x*y} ÷ ${x} = ${y}` : `${x} × ${y} = ${x*y}`};
  } else return;
  const log = S.drillLog[drillId(drill)] = S.drillLog[drillId(drill)] || {miss:0, slow:0, sprint:0};
  if (reason === 'miss' && log.popups) { log.missesAfter = (log.missesAfter || 0) + 1; updateReteach(log); }
  if (!shouldDrill(drill, reason)) return;
  recordDrillPopup(drill);
  order.pending = drill;
}
function completeOrder(){
  order.done = true; freezePatience();
  const p = order.p, perfect = order.tries === 0 && order.hints === 0;
  recordProblem(p.skill, perfect);
  const before = STATIONS.map(s => stationOpen(s.id));
  S.cafe.st[shift.station] = (S.cafe.st[shift.station]||0) + 1;
  const secs = (performance.now() - order.start) / 1000;
  S.timeMs += Math.min(secs, 300) * 1000;
  let tip = 4 + p.steps.length*2 + Math.max(0, Math.round(6 * (1 - secs/order.limit)));
  if (perfect) { S.streak++; tip += Math.min(5, S.streak); S.perfect++; shift.perfect++; }
  else tip = Math.max(3, tip - order.tries - order.hints);
  S.bestStreak = Math.max(S.bestStreak || 0, S.streak);
  tip = Math.round(tip * shift.power);
  S.coins += tip; S.orders++; shift.earned += tip; shift.missed.push(...order.missed);
  checkUnlocks({announce:true});
  Backend.log('problems', {shop:'cafe', station:shift.station, skill:p.skill, perfect, steps:p.steps.length, secs:Math.round(secs)});
  save(); updateHeader();
  const n = $('#chalkNote'); n.className = 'chalk-note good';
  n.textContent = perfect ? 'Perfect order!' + (S.streak > 1 ? ` ${S.streak} in a row!` : '') : 'Order up!';
  $('#stepPrompt').innerHTML = ''; $('#stepInput').innerHTML = '';
  $('#custBubble').textContent = pick(['Yum! That looks perfect.','Wow, just right!','My friends are going to love this!','Thank you so much!']) + ` Here's ${tip} 🪙`;
  sfx('coin'); coinBurst($('#board'), Math.ceil(tip/3));
  STATIONS.forEach((s,i) => { if (!before[i] && stationOpen(s.id)) setTimeout(() => toast(`New station open: ${s.name}!`), 900); });
  const last = shift.n >= shift.total;
  $('#boardActions').innerHTML = `<button class="btn mint" id="nextBtn">${last ? 'Close up for the day' : 'Next customer'}</button>`;
  $('#nextBtn').addEventListener('click', nextCustomer); setTimeout(() => $('#nextBtn').focus(), 60); setTimeout(showNextUnlock, 0);
}
function endShift(){
  const pw = shift.power; S.day++; S.power = 1; save(); updateHeader(); Backend.flush();
  const miss = [...new Set(shift.missed)];
  $('#summaryCard').innerHTML = `<div class="big-emoji">🌙</div><h2>Café closed for the day</h2>
    <p>You earned <b>${shift.earned}</b> coins${pw > 1 ? ` with a ×${fmtPow(pw)} sprint boost` : ''}.</p>
    <p>Perfect orders: <b>${shift.perfect}</b> of ${shift.total}</p>
    ${miss.length ? `<p class="muted">Keep practicing</p><div class="factchips">${miss.map(m => `<span>${esc(m)}</span>`).join('')}</div>` : '<p>No mistakes today. Amazing!</p>'}
    <div class="row"><button class="btn berry" id="sumAgain">Another shift</button><button class="btn" data-go="home">Back to town</button></div>`;
  const station = shift.station; shift = null;
  show('summary'); $('#sumAgain').addEventListener('click', () => startShift(station));
  sfx('good'); setTimeout(() => $('#sumAgain').focus(), 60);
}
$('#leaveShift').addEventListener('click', () => { if (order?.readyTimer) clearTimeout(order.readyTimer); freezePatience(); shift = null; order = null; show('cafe'); });

/* ---------- times-table practice pop-up ---------- */
let pr = null;
const DRILL_IMPL = {
  times:{
    sprintItem(key){
      let pair;
      if (sp.queue.length && Math.random() < 0.5) pair = sp.queue.shift();
      else for (let t=0;t<5;t++) { pair = weightedPick(ALLPAIRS, p => factWeight(p[0], p[1])); if (!sp.item?.fact || fkey(...pair) !== fkey(sp.item.fact.x, sp.item.fact.y)) break; }
      if (Math.random() < 0.5) pair = [pair[1], pair[0]];
      return {prompt:`${pair[0]} × ${pair[1]}`, answer:String(pair[0] * pair[1]), drillId:`times:${Math.max(pair[0], pair[1])}`, fact:{x:pair[0], y:pair[1]}};
    },
    build(drill, {short = false} = {}){
    const table = +drill.key, top = Math.max(10, drill.other);
    const start = short ? Math.min(Math.max(1, drill.other - 2), top - 4) : 1;
    const count = short ? 5 : top;
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'miss' ? `That one was ${drill.text}. Counting up by ${table}s makes it easier.`
        : drill.reason === 'slow' ? `You got ${drill.text}, but it took a while. Let's make the ${table}s faster!`
        : `The ${table}s were tricky in that sprint. Let's practice them!`,
      rows: Array.from({length:count}, (_,i) => { const k = start + i; return {label:`${table} × ${k} =`, answer:String(table*k)}; }),
      targetIndex: drill.other - start,
      hint(rowIndex, wrongs){
        const answer = this.rows[rowIndex].answer;
        return wrongs >= 2 ? `It's ${answer}. Type ${answer}.` : rowIndex === 0 ? 'Anything times 1 stays the same.' : `Add ${table} to ${table*rowIndex}.`;
      },
      finishLine: `You counted all the way to ${table} × ${top}! +3 🪙`,
      tieLine: drill.div ? `${table*drill.other} ÷ ${table} = ${drill.other}, because ${table} × ${drill.other} = ${table*drill.other}.` : `${table} × ${drill.other} = ${table*drill.other}. Now you know it!`
    };
    }
  }
};
function openPractice(drill, onClose){
  const impl = DRILL_IMPL[drill.type]; if (!impl) return;
  const model = impl.build(drill, {short:!!drill.short});
  pr = {drill, model, onClose, i:0, wrongs:0, opened:performance.now()};
  const shiftOn = !$('#scr-shift').hidden && order && !order.done;
  if (shiftOn) { freezePatience(); pr.pausedOrder = order; }
  $('#prPet').textContent = petEmoji();
  $('#prTitle').textContent = model.title;
  $('#prWhy').textContent = model.why;
  $('#prDone').hidden = true; $('#prHint').textContent = '';
  $('#ladder').innerHTML = model.rows.map((row, i) => `<div class="lrow${i === model.targetIndex ? ' target' : ''}" id="lr${i}"><span>${row.label}</span><span class="ans" id="la${i}"></span></div>`).join('');
  const id = drill.type + ':' + drill.key, log = S.drillLog[id] = S.drillLog[id] || {miss:0, slow:0, sprint:0};
  log[drill.reason] = (log[drill.reason] || 0) + 1; save();
  Backend.log('practice_popups', {times_table:drill.type === 'times' ? Number(drill.key) : null,
    drill_type:drill.type, drill_key:String(drill.key), reason:drill.reason});
  $('main').inert = true; $('#practice').hidden = false;
  ladderStep();
}
function ladderStep(){
  const row = pr.model.rows[pr.i], rowEl = $('#lr'+pr.i);
  $$('.lrow.now').forEach(r => r.classList.remove('now')); rowEl.classList.add('now');
  $('#la'+pr.i).innerHTML = `<input id="lin" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="${esc(row.label)}"><button class="btn small" id="prCheck" type="button">Check</button>`;
  const inp = $('#lin');
  const allowText = /[./-]/.test(row.answer);
  inp.addEventListener('input', () => { inp.value = inp.value.replace(allowText ? /[^\d./-]/g : /\D/g,''); inp.classList.remove('wrong'); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ladderCheck(); } });
  $('#prCheck').addEventListener('click', ladderCheck);
  const pad = numberPad(inp, ladderCheck);
  if (pad) $('#prCheck').insertAdjacentElement('afterend', pad);
  inp.focus(); if (rowEl.scrollIntoView) rowEl.scrollIntoView({block:'nearest'});
}
function ladderCheck(){
  const inp = $('#lin'); if (!inp || !inp.value) return;
  const row = pr.model.rows[pr.i], answer = String(row.answer).trim();
  if (inp.value.trim() === answer) {
    $('#la'+pr.i).textContent = answer; $('#lr'+pr.i).classList.remove('now'); $('#lr'+pr.i).classList.add('done');
    $('#prHint').textContent = ''; pr.wrongs = 0; sfx(pr.i === pr.model.targetIndex ? 'good' : 'tick');
    if (pr.i + 1 < pr.model.rows.length) { pr.i++; ladderStep(); } else ladderDone();
  } else {
    pr.wrongs++; sfx('bad'); inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); inp.select();
    $('#prHint').textContent = pr.model.hint(pr.i, pr.wrongs);
  }
}
function ladderDone(){
  S.coins += 3; save(); updateHeader();
  $('#prDone').innerHTML = `<p>${pr.model.finishLine}</p><p class="big">${pr.model.tieLine}</p><button class="btn berry" id="prClose">${pr.pausedOrder ? 'Back to the order' : 'Keep going'}</button>`;
  $('#prDone').hidden = false; sfx('coin');
  $('#prClose').addEventListener('click', closePractice); $('#prClose').focus();
}
function closePractice(){
  const cur = pr; pr = null;
  $('#practice').hidden = true; $('main').inert = false;
  if (cur.pausedOrder && cur.pausedOrder === order && !order.done) {
    order.start += performance.now() - cur.opened;
    const remaining = Math.max(0, order.limit - (performance.now() - order.start)/1000);
    startPatience(remaining, 100 * remaining / order.limit);
  }
  if (cur.onClose) cur.onClose();
  setTimeout(showNextUnlock, 0);
}

/* ---------- fact sprint ---------- */
let sp = null, spTimer = null;
function openSprint(){
  stopSprintTimer(); sp = null;
  $('#factText').textContent = 'Ready?'; $('#factText').classList.remove('oops');
  $('#spInput').hidden = true; $('#spCheck').hidden = true; $('#spStartWrap').hidden = false;
  const pad = numberPad($('#spInput'), () => {
    const inp = $('#spInput'); if (!sp || sp.lock || !inp.value) return;
    sprintAnswer(inp.value);
  });
  if (pad) pad.hidden = true;
  $('#spCorrect').textContent = '0'; $('#spTime').textContent = '60'; $('#timerFill').style.width = '100%';
  $('#spNote').textContent = 'Answer as many as you can in 60 seconds. Every right answer powers up your tips.';
  show('sprint'); setTimeout(() => $('#spStart').focus(), 60);
}
function stopSprintTimer(){ if (spTimer) { clearInterval(spTimer); spTimer = null; } }
$('#spStart').addEventListener('click', () => {
  sp = {end:performance.now() + 60000, correct:0, missed:[], slow:[], queue:[], item:null, shown:0, lock:false, hadWrong:false, wrongValue:''};
  $('#spStartWrap').hidden = true; $('#spInput').hidden = false; $('#spCheck').hidden = false; $('#spNote').textContent = 'Type the answer. It moves on by itself when it\'s right. Press Enter to check a different answer.';
  const pad = $('#spInput').nextElementSibling; if (pad?.classList.contains('number-pad')) pad.hidden = false;
  nextFact(); spTimer = setInterval(sprintTick, 100);
});
function sprintDrillTypes(){
  return Object.keys(DRILL_IMPL).filter(type => {
    const d = DRILLS[type], unlock = !d.sprintUnlock || (S[d.sprintUnlock.unit]?.st?.[d.sprintUnlock.station] || 0) > 0;
    return unlock && drillTypeOn(drillSettings(), type);
  });
}
function sprintDrillKey(type){
  const keys = Object.keys(S.drillLog).filter(id => id.startsWith(type + ':')).map(id => id.slice(type.length + 1));
  if (!keys.length) return 'default';
  return weightedPick(keys, key => { const log = S.drillLog[type + ':' + key]; return 1 + (log.miss||0) + (log.slow||0); });
}
function nextFact(){
  const types = sprintDrillTypes(), otherTypes = types.filter(type => type !== 'times');
  let type = 'times'; if (otherTypes.length && Math.random() >= 0.6) type = weightedPick(otherTypes, drillType => 1 + Object.entries(S.drillLog).filter(([id]) => id.startsWith(drillType + ':')).reduce((sum,[,log]) => sum + (log.miss||0) + (log.slow||0), 0));
  sp.item = DRILL_IMPL[type].sprintItem(sprintDrillKey(type)); sp.shown = performance.now(); sp.lock = false; sp.hadWrong = false; sp.wrongValue = '';
  const ft = $('#factText'); ft.classList.remove('oops'); ft.textContent = sp.item.prompt;
  const inp = $('#spInput'); inp.value = ''; inp.disabled = false; inp.focus();
}
function sprintTick(){
  const left = Math.max(0, sp.end - performance.now());
  $('#spTime').textContent = Math.ceil(left/1000); $('#timerFill').style.width = (left/600) + '%';
  if (left <= 0) endSprint();
}
$('#spInput').addEventListener('input', e => {
  const currentAnswer = sp?.item?.answer || '', allowText = /[./-]/.test(currentAnswer);
  e.target.value = e.target.value.replace(allowText ? /[^\d./-]/g : /\D/g,'');
  if (!sp || sp.lock || !e.target.value) return;
  const answer = String(sp.item.answer).trim();
  if (e.target.value.length >= answer.length && e.target.value !== answer) {
    sp.hadWrong = true; sp.wrongValue = e.target.value;
  } else if (e.target.value === answer) {
    sprintAnswer(e.target.value, {corrected:sp.hadWrong});
  }
});
function sprintAnswer(value, {corrected = false} = {}) {
  if (!sp || sp.lock || !value) return;
  sp.lock = true;
  const inp = $('#spInput'), item = sp.item, times = !!item.fact, x = item.fact?.x, y = item.fact?.y, answer = String(item.answer).trim(), ok = times ? parseInt(value, 10) === x*y : value.trim() === answer;
  const ms = performance.now() - sp.shown; recordPace('sprint', ms);
  const slow = ok && ms > slowLimit('sprint');
  const loggedCorrect = ok && !corrected, loggedAnswer = corrected ? sp.wrongValue : value;
  const wrong = times ? [x,y] : {type:item.drillId.split(':')[0], key:item.drillId.slice(item.drillId.indexOf(':') + 1), prompt:item.prompt, answer:item.answer};
  if (times) { logFact(x, y, loggedCorrect, ms, 'facts', slow); if (slow) sp.slow.push(wrong); }
  else if (slow) sp.slow.push(wrong);
  const type = item.drillId.split(':')[0], key = item.drillId.slice(type.length + 1);
  Backend.log('attempts', times
    ? {shop:'sprint', skill:'times-tables', step:`${Math.min(x,y)}x${Math.max(x,y)}`, step_type:'fact', correct:loggedCorrect, first_try:!corrected, slow,
      answer:loggedAnswer.slice(0,6), expected:String(x*y), misconception:null, context:null, fact_a:x, fact_b:y, fact_div:false, ms:Math.round(ms)}
    : {shop:'sprint', skill:'drill:' + type, step:key, step_type:'fact', correct:loggedCorrect, first_try:!corrected, slow,
      answer:loggedAnswer.slice(0,60), expected:answer, misconception:null, context:null, fact_a:null, fact_b:null, fact_div:null, ms:Math.round(ms)});
  if (ok) {
    if (corrected) { sp.missed.push(wrong); if (times) sp.queue.push([x,y]); }
    sp.correct++; $('#spCorrect').textContent = sp.correct; sfx('good');
    inp.classList.add('flash-good'); setTimeout(() => inp.classList.remove('flash-good'), 150); nextFact();
  } else {
    sp.missed.push(wrong); if (times) sp.queue.push([x,y]); sfx('bad'); inp.disabled = true;
    const ft = $('#factText'); ft.classList.add('oops'); ft.textContent = times ? `${x} × ${y} = ${x*y}` : `${item.prompt} = ${item.answer}`;
    setTimeout(() => { if (sp) nextFact(); }, 1300);
  }
}
$('#spInput').addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !sp || sp.lock) return; e.preventDefault();
  const inp = $('#spInput'); if (!inp.value) return;
  sprintAnswer(inp.value);
});
$('#spCheck').addEventListener('click', () => {
  const inp = $('#spInput'); if (!sp || sp.lock || !inp.value) return;
  sprintAnswer(inp.value);
});
function endSprint(){
  stopSprintTimer(); if (!sp) return;
  const run = sp; sp = null;
  const pw = Math.round((1 + Math.min(run.correct, 20)*0.05)*100)/100;
  S.power = Math.max(S.power, pw);
  const best = run.correct > S.sprintBest; if (best) S.sprintBest = run.correct;
  checkUnlocks({announce:true});
  save(); updateHeader();
  Backend.log('sprints', {correct:run.correct}); Backend.flush();
  const seen = new Set(), chips = [];
  run.missed.forEach(entry => { const id = Array.isArray(entry) ? fkey(entry[0], entry[1]) : `${entry.type}:${entry.key}`; if (!seen.has(id)) { seen.add(id); chips.push(Array.isArray(entry) ? `<span>${entry[0]} × ${entry[1]} = ${entry[0]*entry[1]}</span>` : `<span>${entry.prompt} = ${entry.answer}</span>`); } });
  $('#summaryCard').innerHTML = `<div class="big-emoji">⚡</div><h2>${run.correct} correct!</h2>
    ${best ? '<p><b>New personal best!</b></p>' : `<p class="muted">Your best is ${S.sprintBest}</p>`}
    <p>Your tips are powered up <b>×${fmtPow(S.power)}</b> for your next café shift.</p>
    ${chips.length ? `<p class="muted">Tricky ones</p><div class="factchips">${chips.join('')}</div>` : ''}
    <div class="row"><button class="btn berry" data-go="cafe" id="sumCafe">Go to the café</button><button class="btn" data-go="home">Back to town</button></div>`;
  show('summary'); sfx('coin'); setTimeout(() => $('#sumCafe').focus(), 60);
  const trouble = run.missed.concat(run.slow);
  if (trouble.length) {
    const count = {}; trouble.forEach(entry => { if (Array.isArray(entry)) { count[`times:${entry[0]}`] = (count[`times:${entry[0]}`]||0) + 1; if (entry[1] !== entry[0]) count[`times:${entry[1]}`] = (count[`times:${entry[1]}`]||0) + 1; } else { const id = `${entry.type}:${entry.key}`; count[id] = (count[id]||0) + 1; } });
    const id = Object.keys(count).sort((a,b) => count[b] - count[a] || a.localeCompare(b))[0], sep = id.indexOf(':'), type = id.slice(0, sep), key = id.slice(sep + 1), f = trouble.find(entry => (Array.isArray(entry) ? entry[0] === +key || entry[1] === +key : `${entry.type}:${entry.key}` === id));
    const drill = type === 'times' ? {type, key, other:Array.isArray(f) ? (f[0] === +key ? f[1] : f[0]) : 1, reason:'sprint', div:false, text:Array.isArray(f) ? `${f[0]} × ${f[1]} = ${f[0]*f[1]}` : ''} : {type, key, reason:'sprint', text:f.prompt};
    if (shouldDrill(drill, 'sprint')) { recordDrillPopup(drill); setTimeout(() => openPractice(drill, () => $('#sumCafe').focus()), 900); }
    else setTimeout(showNextUnlock, 0);
  } else setTimeout(showNextUnlock, 0);
}
$('#spQuit').addEventListener('click', () => { stopSprintTimer(); sp = null; show('home'); });

/* ---------- pet shop ---------- */
function buyReward(id){
  const reward = REWARDS.find(r => r.id === id);
  if (!reward || reward.price <= 0 || !available(reward) || owns(reward) || S.coins < reward.price) return false;
  S.coins -= reward.price;
  (reward.kind === 'pet' ? S.owned : S.decor).push(reward.id);
  if (reward.kind === 'pet') S.pet = reward.id;
  const completed = checkSetCompletions({announce:true});
  save(); sfx('coin');
  if (!completed) toast(reward.kind === 'pet' ? reward.name + ' moved to town!' : reward.name + ' is in the town square!');
  return true;
}
function rewardTileHTML(reward, state){
  const building = BUILDINGS.find(b => b.id === reward.unit);
  const hint = () => {
    if (!building.open) return `Opens with the ${building.name}.`;
    const rule = reward.unlock;
    if (rule.type === 'station') return `Serve ${UNLOCK_AT} orders at ${STATIONS[rule.station - 1].name}`;
    if (rule.type === 'mastery') return `Master ${rule.skills.map(skill => SKILLS[skill]?.name || skill).join(' and ')}`;
    if (rule.type === 'unitMastery') return `Master every ${building.name} skill`;
    if (rule.type === 'sprint') return `Reach ${rule.best} in the Fact Sprint`;
    if (rule.type === 'streak') return `Get ${rule.n} perfect orders in a row`;
    return 'Available from the beginning';
  };
  const owned = state === 'owned', buyable = state === 'buyable', locked = state === 'locked';
  const active = owned && reward.kind === 'pet' && S.pet === reward.id;
  const classes = ['reward-tile', `reward-${state}`];
  if (active) classes.push('active');
  if (reward.legendary) classes.push('legendary');
  let action;
  if (owned) action = reward.kind === 'pet'
    ? (active ? '<span class="tag">Your helper</span>' : `<button class="btn small mint" data-pet="${reward.id}">Choose</button>`)
    : '<span class="tag">In your town</span>';
  else if (buyable) {
    const data = reward.kind === 'pet' ? 'data-buypet' : 'data-buydecor';
    action = `<span class="reward-price">🪙 ${reward.price}</span><button class="btn small butter" ${data}="${reward.id}" ${S.coins < reward.price ? 'disabled' : ''}>Buy for 🪙 ${reward.price}</button>`;
  } else if (locked || state === 'soon') action = `<span class="reward-hint"><span class="reward-lock">🔒</span>${esc(hint())}</span>`;
  else action = '<span class="tag">Earned when unlocked</span>';
  const emoji = owned || buyable ? reward.emoji : reward.emoji;
  return `<div class="reward-tile ${classes.join(' ')}" id="reward-${reward.id}">${reward.legendary ? '<span class="reward-ribbon">Legendary</span>' : ''}${locked ? '<span class="reward-lock reward-lock-corner">🔒</span>' : ''}<div class="reward-emoji">${emoji}</div><div class="reward-name">${esc(reward.name)}</div>${action}<span class="reward-new" hidden>New!</span></div>`;
}
function renderBook(unit){
  const building = BUILDINGS.find(b => b.id === unit) || BUILDINGS[0];
  bookUnit = building.id;
  const rewards = REWARDS.filter(reward => reward.unit === building.id), owned = rewards.filter(owns).length;
  const newIds = new Set(rewards.filter(reward => owns(reward) && !S.seenCollection.includes(reward.id)).map(reward => reward.id));
  const hint = reward => {
    if (!building.open) return `Opens with the ${building.name}.`;
    const rule = reward.unlock;
    if (rule.type === 'station') return `Serve ${UNLOCK_AT} orders at ${STATIONS[rule.station - 1].name}`;
    if (rule.type === 'mastery') return `Master ${rule.skills.map(skill => SKILLS[skill]?.name || skill).join(' and ')}`;
    if (rule.type === 'unitMastery') return `Master every ${building.name} skill`;
    if (rule.type === 'sprint') return `Reach ${rule.best} in the Fact Sprint`;
    if (rule.type === 'streak') return `Get ${rule.n} perfect orders in a row`;
    return 'Available from the beginning';
  };
  const box = reward => {
    const state = !building.open ? 'soon' : owns(reward) ? 'owned' : available(reward) ? 'ready' : 'locked';
    const complete = S.completedSets.includes(`${building.id}:${reward.kind}`);
    const classes = `book-box book-${state}${reward.legendary ? ' book-legendary' : ''}${newIds.has(reward.id) ? ' book-new' : ''}`;
    const hintText = hint(reward);
    const active = state === 'owned' && reward.kind === 'pet' && S.pet === reward.id;
    const displayed = state === 'owned' && reward.kind === 'decor' && S.displayed.includes(reward.id);
    const action = state === 'ready'
      ? `data-book-buy="${reward.id}"${S.coins < reward.price ? ' disabled' : ''}`
      : state === 'owned' && reward.kind === 'pet' && !active
        ? `data-book-helper="${reward.id}"`
        : state === 'owned' && reward.kind === 'decor'
          ? `data-book-display="${reward.id}"`
          : `data-book-hint="${esc(hintText)}"`;
    const actionText = state === 'ready'
      ? (S.coins < reward.price ? `Need ${reward.price - S.coins} more 🪙` : 'Buy')
      : state === 'owned' && reward.kind === 'pet'
        ? (active ? 'My helper' : 'Make it my helper')
        : state === 'owned' && reward.kind === 'decor'
          ? (displayed ? 'Take it off display' : 'Put it on display')
          : '';
    return `<button type="button" class="${classes}${active ? ' active' : ''}" ${action} aria-label="${esc(reward.name)}${actionText ? ': ' + actionText : ''}"><span class="book-emoji">${reward.emoji}</span><span class="book-name">${esc(reward.name)}</span>${state === 'ready' ? `<span class="book-price">🪙 ${reward.price}</span>` : state === 'locked' ? '<span class="book-lock">🔒</span>' : ''}${actionText ? `<span class="book-get">${actionText}</span>` : ''}${newIds.has(reward.id) ? '<span class="book-new-dot">New!</span>' : ''}</button>`;
  };
  const row = (kind, label) => {
    const set = rewards.filter(reward => reward.kind === kind), count = set.filter(owns).length, complete = count === set.length;
    return `<section class="book-row${complete ? ' complete' : ''}"><div class="book-row-head"><h3>${label}</h3><span>${count} of ${set.length}</span>${complete ? '<strong class="book-complete">✓ Complete!</strong>' : ''}</div><div class="book-grid">${set.map(box).join('')}</div></section>`;
  };
  const tabs = BUILDINGS.map(b => `<button type="button" class="book-tab${b.id === building.id ? ' active' : ''}" data-book-unit="${b.id}">${b.emoji}<span>${esc(b.name)}</span></button>`).join('');
  const pageComplete = rewards.length && rewards.every(owns);
  const pageClass = `${!building.open ? ' book-page-soon' : ''}${pageComplete ? ' book-page-complete' : ''}`;
  $('#bookWrap').innerHTML = `<div class="backrow"><h2>📒 Sticker Book</h2><button class="btn small" data-go="home">Back to town</button></div><div class="book-tabs">${tabs}</div><div class="book-page${pageClass}">${!building.open ? `<div class="book-soon-banner">Opens with the ${building.name}.</div>` : ''}<div class="book-page-head"><span class="book-building">${building.emoji}</span><div><h2>${esc(building.name)}</h2><p>${owned} of ${rewards.length} stickers</p></div>${pageComplete ? `<div class="book-stamp">${esc(building.name)}<br>Master</div>` : ''}</div>${row('pet','Pets')}${row('decor','Decorations')}<p class="book-hint" id="bookHint" aria-live="polite"></p></div>`;
  const seen = rewards.filter(reward => owns(reward) && !S.seenCollection.includes(reward.id)).map(reward => reward.id);
  if (seen.length) { S.seenCollection.push(...seen); save(); }
}
$('#bookWrap').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.bookUnit) { renderBook(b.dataset.bookUnit); return; }
  if (b.dataset.bookBuy) { buyReward(b.dataset.bookBuy); updateHeader(); renderBook(bookUnit); return; }
  if (b.dataset.bookHelper) {
    const reward = REWARDS.find(r => r.id === b.dataset.bookHelper);
    if (reward?.kind === 'pet' && owns(reward)) { S.pet = reward.id; save(); sfx('good'); toast(petName() + ' is your helper now!'); }
    updateHeader(); renderBook(bookUnit); return;
  }
  if (b.dataset.bookDisplay) {
    const id = b.dataset.bookDisplay, slot = S.displayed.indexOf(id);
    if (slot >= 0) { S.displayed[slot] = null; save(); toast('Decoration taken off display.'); }
    else {
      const empty = S.displayed.findIndex(item => item === null);
      if (empty >= 0) { S.displayed[empty] = id; save(); toast('Decoration is on display!'); }
      else toast('Your display case is full.');
    }
    renderBook(bookUnit); return;
  }
  if (b.dataset.bookHint) $('#bookHint').textContent = b.dataset.bookHint;
});
/* ---------- town hall (reports) ---------- */
function renderHall(){
  const me = Backend.me;
  $('#hallWrap').innerHTML = `<div class="backrow"><h2>🏛️ Town Hall</h2><button class="btn small" data-go="home">Back to town</button></div>
    ${me ? `<div class="panel"><h3>Signed in</h3><p>You're playing as <b>${esc(me.name)}</b> in <b>${esc(me.class_name)}</b>. Your town saves to your class automatically, and your teacher sees your progress as you play.</p>
      <button class="btn small" id="switchPlayer">Not you? Switch player</button></div>`
         : `<div class="panel"><h3>Your name</h3><p>This town belongs to <b>${esc(S.name)}</b>.</p><button class="btn small" id="rename">Change name</button></div>`}
    <div class="panel"><h3>Keep my town safe</h3>
      <p>${me ? 'Your town is saved with your class.' : 'Your town saves in this browser.'} A backup code is an extra copy you can keep anywhere, like a note or an email to yourself.</p>
      <button class="btn butter" id="makeBackup">Make a backup code</button>
      <div id="backupWrap" hidden style="margin-top:12px"><textarea class="code" id="backupBox" readonly aria-label="Backup code"></textarea>
        <div style="margin-top:8px"><button class="btn small" data-copy="backupBox">Copy backup code</button></div></div>
      <h3 style="margin-top:18px">Restore from a backup code</h3>
      <p class="muted" style="margin-top:0">This replaces the town you have now with the one in the code. Your coins, pets, and practice history come back.</p>
      <textarea class="code" id="restoreBox" style="min-height:70px" aria-label="Paste a backup code" placeholder="PTSZ.…"></textarea>
      <div style="margin-top:8px"><button class="btn small" id="restoreBtn">Restore my town</button></div>
    </div>
    <div class="panel"><h3>For grown-ups</h3><p>See which skills are strong, which step gets stuck, and which times tables need work.</p><button class="btn small" id="toParent">Open the progress report</button></div>`;
  if ($('#switchPlayer')) $('#switchPlayer').addEventListener('click', async () => { await Backend.signOut(); storeKey = LOCAL_KEY; S = fresh(); openJoin(); });
  if ($('#rename')) $('#rename').addEventListener('click', openName);
  $('#makeBackup').addEventListener('click', async () => { const code = await backupCode(); $('#backupWrap').hidden = false; $('#backupBox').value = code; $('#backupBox').select(); });
  $$('#hallWrap [data-copy]').forEach(b => b.addEventListener('click', async () => {
    const box = $('#' + b.dataset.copy); box.select();
    try { await navigator.clipboard.writeText(box.value); toast('Copied!'); } catch(e) { try { document.execCommand('copy'); toast('Copied!'); } catch(e2) { toast('Select the code and copy it'); } }
  }));
  let armed = false, armT;
  $('#restoreBtn').addEventListener('click', async e => {
    const txt = $('#restoreBox').value.trim();
    if (!txt) { toast('Paste a backup code first'); return; }
    let state;
    try { state = await unpackCode(txt); if (!state || typeof state !== 'object' || !('coins' in state)) throw 0; }
    catch(err) { toast("That doesn't look like a complete backup code."); return; }
    if (!armed) { armed = true; e.target.textContent = `Click again to restore ${state.name ? state.name + "'s" : 'this'} town`; armT = setTimeout(() => { armed = false; e.target.textContent = 'Restore my town'; }, 5000); return; }
    clearTimeout(armT);
    if (me) { state.name = me.name; state.minStation = me.min_station; }
    adopt(state, true); sfx('coin'); toast('Town restored!'); show('home');
  });
  $('#toParent').addEventListener('click', () => { renderParent(); show('parent'); });
}

/* ---------- grown-ups progress report ---------- */
let heatView = 'facts';
function heatTable(store){
  let g = '<table class="heat"><thead><tr><th>×</th>'; for (let y=2;y<=12;y++) g += `<th>${y}</th>`; g += '</tr></thead><tbody>';
  const label = {solid:'solid', close:'getting there', work:'needs practice', new:'not seen yet'};
  for (let x=2;x<=12;x++) { g += `<tr><th>${x}</th>`; for (let y=2;y<=12;y++) { const st = factStatus(x,y,store); g += `<td class="st-${st}" title="${store === 'facts' ? `${x} × ${y} = ${x*y}` : `${x*y} ÷ ${x} = ${y}`}: ${label[st]}">${x*y}</td>`; } g += '</tr>'; }
  return g + '</tbody></table>';
}
function renderParent(){
  const [ca, cc, ma, mc] = ccTotals(), pct = (c,a) => a ? Math.round(100*c/a) : null, cP = pct(cc,ca), mP = pct(mc,ma);
  let setupA = 0, setupC = 0;
  Object.values(S.ks).forEach(K => Object.values(K).forEach(e => { if (e.t === 'setup') { setupA += e.a; setupC += e.c; } }));
  let verdict = 'Not enough data yet. After a few shifts this shows whether the ideas or the arithmetic is harder.';
  if (ca >= 8 && ma >= 8) verdict = cP + 8 < mP ? `Understanding the ratio is the harder part (${cP}% vs ${mP}%). The arithmetic is fine. The trouble is seeing the relationship.`
    : mP + 8 < cP ? `The arithmetic is the harder part (${mP}% vs ${cP}%). The ideas are there, but facts slow things down. The Sprint Track helps most.`
    : `Ideas and arithmetic are about even (${cP}% vs ${mP}%).`;
  const skills = STATIONS.map(st => `<h3>${st.emoji} ${st.name}</h3>` + st.skills.map(sk => {
    const s = skillStatus(sk), n = S.kn[sk] || 0;
    const steps = S.ks[sk] ? Object.entries(S.ks[sk]).filter(([,e]) => e.t !== 'setup').map(([nm,e]) => `${nm}: ${e.c}/${e.a}`).join(', ') : '';
    return `<div class="skillrow"><div><span class="pill p-${s}">${s}</span><b>${esc(SKILLS[sk].name)}</b> <span class="muted">${n} tried${steps ? '. ' + esc(steps) : ''}</span></div><a href="${SKILLS[sk].url}" target="_blank" rel="noopener">Khan practice</a></div>`;
  }).join('')).join('');
  const mis = Object.entries(S.mis).sort((a,b) => b[1].n - a[1].n);
  const log = Object.entries(S.drillLog).map(([id,v]) => ({id, label:drillLabel(id), n:(v.miss||0)+(v.slow||0)+(v.sprint||0), v})).filter(x => x.n).sort((a,b) => b.n - a.n);
  const drillSettingsNow = drillSettings(), drillStatus = v => v.reteach ? 'reteach' : v.popups && (v.missesAfter || 0) < v.popups ? 'helping' : 'watching';
  const drillHistory = log.length ? '<ul class="list">' + log.map(x => `<li><b>${esc(x.label)}</b>: ${x.n} time${x.n === 1 ? '' : 's'} <span class="tag">${drillStatus(x.v)}</span></li>`).join('') + '</ul>' : '<p class="muted">None yet. A pop-up appears after a missed fact or one that takes more than about 10 seconds.</p>';
  const settingSummary = !drillSettingsNow.enabled ? 'Your teacher turned practice pop-ups off.' : drillSettingsNow.timeScale > 1 ? `Your teacher set pop-ups to extra time (×${drillSettingsNow.timeScale}).` : `Your teacher set pop-ups to ${drillSettingsNow.slow.mode} timing.`;
  const openUnits = new Set(BUILDINGS.filter(b => b.open).map(b => b.id));
  const localDrillControls = !Backend.me ? `<div class="parent-drill-settings">
    <label><input type="checkbox" id="parentDrillEnabled" ${drillSettingsNow.enabled ? 'checked' : ''}> Enable practice pop-ups</label>
    <h4>Drill types</h4>${Object.entries(DRILLS).filter(([,d]) => d.unit === 'all' || openUnits.has(d.unit)).map(([type,d]) => `<label><input type="checkbox" data-parent-drill-type="${type}" ${drillSettingsNow.types[type] === false ? '' : 'checked'}> ${esc(d.name)}</label>`).join('')}
    <h4>Triggers</h4><label><input type="checkbox" id="parentTriggerMiss" ${drillSettingsNow.triggers.miss ? 'checked' : ''}> Missed answer</label><label><input type="checkbox" id="parentTriggerSlow" ${drillSettingsNow.triggers.slow ? 'checked' : ''}> Slow answer</label><label><input type="checkbox" id="parentTriggerSprint" ${drillSettingsNow.triggers.sprint ? 'checked' : ''}> End of sprint</label>
    <h4>Slow timing</h4><select id="parentSlowMode"><option value="adaptive" ${drillSettingsNow.slow.mode === 'adaptive' ? 'selected' : ''}>Adaptive</option><option value="fixed" ${drillSettingsNow.slow.mode === 'fixed' ? 'selected' : ''}>Fixed</option></select>
    <label>Idea seconds <input id="parentSlowIdea" type="number" min="5" max="60" value="${drillSettingsNow.slow.idea}"></label><label>Arithmetic seconds <input id="parentSlowArith" type="number" min="5" max="60" value="${drillSettingsNow.slow.arith}"></label><label>Sprint seconds <input id="parentSlowSprint" type="number" min="3" max="20" value="${drillSettingsNow.slow.sprint}"></label><label>Max pop-ups per shift <input id="parentMaxPerShift" type="number" min="1" max="5" value="${drillSettingsNow.maxPerShift}"></label>
    <div class="row"><button class="btn small primary" id="saveParentDrills">Save</button><button class="btn small" id="resetParentDrills">Reset to defaults</button></div></div>` : `<p class="muted">${settingSummary}</p>`;
  const collections = BUILDINGS.filter(b => b.open).map(b => {
    const rewards = REWARDS.filter(r => r.unit === b.id), owned = rewards.filter(owns).length;
    return `<div class="collection-row"><b>${esc(b.name)}</b><span>${owned} of ${rewards.length} items</span></div>`;
  }).join('');
  const legendary = REWARDS.filter(r => r.legendary && owns(r));
  $('#parentWrap').innerHTML = `<div class="backrow"><h2>Progress report: ${esc(S.name)}</h2><button class="btn small" data-go="home">Back to town</button></div>
    <div class="panel"><h3>Ideas or arithmetic?</h3><div class="stats">
      <div class="stat"><b>${cP === null ? '–' : cP + '%'}</b>idea steps right on the first try (${cc} of ${ca})</div>
      <div class="stat"><b>${mP === null ? '–' : mP + '%'}</b>arithmetic steps right on the first try (${mc} of ${ma})</div></div><p>${verdict}</p></div>
    <p class="counting-stat">Counting and reading the picture: <b>${setupC} of ${setupA}</b> right on first try.</p>
    <div class="panel"><h3>Rewards</h3><div class="collection-list">${collections}</div><p><b>Legendary items:</b> ${legendary.length ? legendary.map(r => `${r.emoji} ${esc(r.name)}`).join(', ') : 'None yet.'}</p><p><b>Longest perfect streak:</b> ${S.bestStreak}</p></div>
    <div class="panel"><h3>Mix-ups we've spotted</h3>${mis.length ? '<ul class="list">' + mis.map(([id,m]) => `<li><b>${esc(MIS[id].name)}</b> (${m.n} time${m.n === 1 ? '' : 's'})<br><span class="muted">Example: ${esc(m.ex[0] || '')}</span><br><span class="muted">Try: ${esc(MIS[id].tip)}</span></li>`).join('') + '</ul>' : '<p class="muted">None yet.</p>'}</div>
    <div class="panel"><h3>Khan Academy skills (Unit 1: Ratios)</h3><p class="muted">Mastered means at least 4 tries and 75% of the last 8 perfect.</p>${skills}</div>
    <div class="two"><div class="panel"><h3>Times tables</h3>
      <div style="display:flex; gap:8px; flex-wrap:wrap"><button class="btn small ${heatView === 'facts' ? 'mint' : ''}" data-heat="facts">Multiplying</button><button class="btn small ${heatView === 'divFacts' ? 'mint' : ''}" data-heat="divFacts">Dividing</button></div>
      <div class="heatwrap" style="margin-top:10px">${heatTable(heatView)}</div>
      <div class="legend"><span><i class="st-solid"></i>Solid</span><span><i class="st-close"></i>Getting there</span><span><i class="st-work"></i>Needs practice</span><span><i class="st-new"></i>Not seen yet</span></div></div>
    <div class="panel"><h3>Practice pop-ups</h3>${localDrillControls}${drillHistory}
      <h3>Settings</h3>
      ${!Backend.me ? `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="unlockAll" ${S.unlockAll ? 'checked' : ''}> Unlock every café station</label>` : `<p class="muted">Your teacher has unlocked ${S.minStation === 1 ? 'station 1' : 'stations 1 to ' + S.minStation}.</p>`}
      <button class="btn small" id="resetBtn">Reset all progress</button></div></div>`;
  $$('[data-heat]').forEach(b => b.addEventListener('click', () => { heatView = b.dataset.heat; renderParent(); }));
  if ($('#unlockAll')) $('#unlockAll').addEventListener('change', e => { S.unlockAll = e.target.checked; save(); });
  if ($('#saveParentDrills')) $('#saveParentDrills').addEventListener('click', () => {
    const types = {}; $$('[data-parent-drill-type]').forEach(input => { types[input.dataset.parentDrillType] = input.checked; });
    S.drillSettings = mergeDrillSettings({
      enabled: $('#parentDrillEnabled').checked, types,
      triggers: {miss:$('#parentTriggerMiss').checked, slow:$('#parentTriggerSlow').checked, sprint:$('#parentTriggerSprint').checked},
      slow: {mode:$('#parentSlowMode').value, idea:+$('#parentSlowIdea').value, arith:+$('#parentSlowArith').value, sprint:+$('#parentSlowSprint').value},
      timeScale:drillSettingsNow.timeScale, maxPerShift:+$('#parentMaxPerShift').value
    });
    save(); renderParent();
  });
  if ($('#resetParentDrills')) $('#resetParentDrills').addEventListener('click', () => { S.drillSettings = {}; save(); renderParent(); });
  let armed = false, armT;
  $('#resetBtn').addEventListener('click', e => {
    if (!armed) { armed = true; e.target.textContent = 'Click again to erase everything'; armT = setTimeout(() => { armed = false; e.target.textContent = 'Reset all progress'; }, 4000); return; }
    clearTimeout(armT); const keep = {muted:S.muted, music:S.music, minStation:S.minStation, name:Backend.me ? S.name : ''};
    S = Object.assign(fresh(), keep); save(); toast('Progress reset'); if (Backend.me) show('home'); else openName();
  });
}

/* ---------- joining a class (hosted mode) ---------- */
const join = {code:'', roster:[], pick:null};
function openJoin(){
  join.code = ''; join.roster = []; join.pick = null;
  let last = ''; try { last = localStorage.getItem('pettown:lastCode') || ''; } catch(e){}
  $('#joinWrap').innerHTML = `<div class="card"><div class="big-emoji">🐾</div><h2>Welcome to Pet Town!</h2>
    <label for="codeInput">Type your class code</label>
    <input id="codeInput" class="textin" maxlength="8" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase; letter-spacing:.2em" value="${esc(last)}">
    <div class="row"><button class="btn berry" id="codeGo">Next</button></div><p class="muted" id="joinMsg" aria-live="polite"></p></div>`;
  show('join');
  const go = async () => {
    const code = $('#codeInput').value.trim().toUpperCase();
    if (code.length < 4) { $('#joinMsg').textContent = 'Ask your teacher for your class code.'; return; }
    $('#joinMsg').textContent = 'Looking for your class…';
    const roster = await Backend.roster(code);
    if (!roster || !roster.length) { $('#joinMsg').textContent = "We couldn't find that class. Check the code with your teacher."; return; }
    try { localStorage.setItem('pettown:lastCode', code); } catch(e){}
    join.code = code; join.roster = roster; pickName();
  };
  $('#codeGo').addEventListener('click', go);
  $('#codeInput').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  setTimeout(() => $('#codeInput').focus(), 50);
}
function pickName(){
  $('#joinWrap').innerHTML = `<div class="card"><h2>Who are you?</h2><p class="muted">${esc(join.roster[0].out_class)}</p>
    <div class="namegrid">${join.roster.map((r,i) => `<button class="btn" data-i="${i}">${esc(r.out_name)}</button>`).join('')}</div>
    <div class="row"><button class="link" id="backCode">Different class code</button></div></div>`;
  $$('#joinWrap [data-i]').forEach(b => b.addEventListener('click', () => { join.pick = join.roster[+b.dataset.i]; askPin(); }));
  $('#backCode').addEventListener('click', openJoin);
}
function askPin(){
  $('#joinWrap').innerHTML = `<div class="card"><h2>Hi, ${esc(join.pick.out_name)}!</h2>
    <label for="pinInput">Type your 4-digit PIN</label>
    <input id="pinInput" class="textin" inputmode="numeric" maxlength="4" autocomplete="off" style="letter-spacing:.4em; width:8em">
    <div class="row"><button class="btn berry" id="pinGo">Start playing</button><button class="link" id="notMe">That's not me</button></div>
    <p class="muted" id="joinMsg" aria-live="polite"></p></div>`;
  const pin = $('#pinInput');
  pin.addEventListener('input', () => { pin.value = pin.value.replace(/\D/g,''); });
  const go = async () => {
    if (!/^\d{4}$/.test(pin.value)) { $('#joinMsg').textContent = 'Your PIN has 4 numbers.'; return; }
    $('#pinGo').disabled = true; $('#joinMsg').textContent = 'Checking…';
    const res = await Backend.join(join.pick.out_id, pin.value);
    $('#pinGo').disabled = false;
    if (res === 'ok') { enterAs(Backend.me); return; }
    pin.value = ''; pin.focus();
    $('#joinMsg').textContent = res === 'bad_pin' ? "That PIN isn't right. Ask your teacher if you forgot it."
      : res === 'locked' ? 'Too many tries. Wait 10 minutes, or ask your teacher to reset your PIN.'
      : 'Something went wrong. Check your internet and try again.';
  };
  $('#pinGo').addEventListener('click', go);
  pin.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  numberPad(pin, go);
  $('#notMe').addEventListener('click', pickName);
  setTimeout(() => pin.focus(), 50);
}
/* load a signed-in student's town: whichever copy (this computer or the server) is newer wins */
function enterAs(me){
  storeKey = 'pettown:v1:' + me.student_id;
  const local = loadState(storeKey);
  const remote = me.state && typeof me.state === 'object' ? me.state : null;
  S = (remote && (remote.savedAt || 0) > (local.savedAt || 0)) ? normalize(remote) : local;
  S.name = me.name; S.minStation = me.min_station || 1;
  drillSettings();
  checkUnlocks({announce:false});
  save(); show('home');
}

/* ---------- boot ---------- */
(async function boot(){
  if (!Backend.enabled) { S = loadState(LOCAL_KEY); drillSettings(); checkUnlocks({announce:false}); save(); if (!S.name) openName(); else show('home'); return; }
  show('loading');
  let me = null;
  try { me = await Backend.restore(); } catch(e){}
  if (me) enterAs(me); else openJoin();
})();
