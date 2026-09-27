/* Pet Town game (Unit 1: Ratios). Runs in two modes:
   - hosted: students join a class (code + name + PIN) and everything saves to Supabase
   - local: no backend configured, the town saves in the browser (the single-file build) */
import { SKILLS, SKILL_ORDER, STATIONS, SHOPS, UNLOCK_AT, MIS, REWARDS, UNIT_SKILLS, BUILDINGS, NEIGHBORHOODS, DEFAULT_HOME, buildingsIn, prevBuilding, nextBuilding, builtHoods, validHood, DRILLS, QUIZ_DEFAULTS, quizSettings, drillLabel, mergeDrillSettings, drillTypeOn } from '../shared/registry';
import { Backend, ActivityTracker } from '../lib/studentBackend';

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
const fresh = () => ({v:1, name:'', sid:'s'+Math.random().toString(36).slice(2,10), coins:0, power:1, home:DEFAULT_HOME, sprintBest:0, sprintPick:['times'], bestStreak:0,
  owned:['cat'], decor:[], pet:'cat', unlocked:[], seenUnlocks:[], seenCollection:[], completedSets:[], muted:false, music:true, musicTrack:'cafe', musicVolume:70, streak:0, day:1, orders:0, perfect:0, timeMs:0,
  facts:{}, divFacts:{}, practiceLog:{}, drillLog:{}, pace:{idea:[], arith:[], sprint:[]}, ks:{}, kr:{}, kn:{}, mis:{},
  review:{}, quizzes:{}, stationsOpenedBefore:{}, sessions:[],
  cafe:{st:{1:0,2:0,3:0,4:0}}, bakery:{st:{1:0,2:0,3:0,4:0,5:0}}, displayed:Array(8).fill(null), minStation:1, unlockAll:false, resetSeen:null, sync:{url:'', wkey:'', cls:'', last:0}, savedAt:0});
/* fill in any fields an older save is missing */
function normalize(raw){
  const f = fresh(), s = Object.assign(f, raw || {});
  s.cafe = Object.assign({st:{}}, s.cafe || {}); s.cafe.st = Object.assign({1:0,2:0,3:0,4:0}, s.cafe.st || {});
  s.bakery = Object.assign({st:{}}, s.bakery || {}); s.bakery.st = Object.assign({1:0,2:0,3:0,4:0,5:0}, s.bakery.st || {});
  ['review','quizzes'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  if (!raw || !Object.prototype.hasOwnProperty.call(raw, 'stationsOpenedBefore') || raw.stationsOpenedBefore === null) {
    s.stationsOpenedBefore = Object.fromEntries(Object.values(SHOPS).map(shop => [shop.id,
      shop.stations.filter(st => st.skills.length && (st.id === 1 || (shop.id === 'cafe' && st.id <= s.minStation) || (s[shop.id]?.st?.[st.id-1] || 0) >= UNLOCK_AT)).map(st => st.id)
    ]));
  }
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
  if (!Array.isArray(s.sprintPick)) s.sprintPick = ['times'];
  if (!validHood(s.home)) s.home = DEFAULT_HOME;                 // every save from before neighborhoods is 6th grade
  if (!['cafe','park','stars','arcade'].includes(s.musicTrack)) s.musicTrack = 'cafe';
  s.musicVolume = Number.isFinite(Number(s.musicVolume)) ? Math.min(100, Math.max(0, Math.round(Number(s.musicVolume)))) : 70;
  s.sessions = Array.isArray(s.sessions) ? s.sessions.filter(x => x && typeof x.start === 'number' && typeof x.active === 'number').slice(-30) : [];
  if (!Array.isArray(s.seenCollection)) s.seenCollection = [];
  if (!Array.isArray(s.completedSets)) s.completedSets = [];
  s.resetSeen = typeof s.resetSeen === 'string' ? s.resetSeen : null;
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
/* A built unit (BUILDINGS entry with open:true) opens for a student once the unit before it
   in BUILDINGS order has its Unit Test passed or excused, or when the teacher opens it for the
   class (game_settings.openUnits), or in local mode with "Unlock every station". The café is always open. */
function unitOpen(unit){
  const building = BUILDINGS.find(b => b.id === unit), prev = prevBuilding(unit);
  if (!building || !building.open) return false;
  if (!prev) return true;                                    // the first shop of every neighborhood is open
  if (!Backend.me && S.unlockAll) return true;
  const classOpen = Backend.me?.game_settings?.openUnits;
  if (Array.isArray(classOpen) && classOpen.includes(unit)) return true;
  return unitTestPassed(prev.id);
}
/* what a locked building says: built ones name the unit test that opens them */
function unitLockedText(building){
  const prev = prevBuilding(building.id);
  return building.open && prev ? `Pass the ${prev.name} Unit Test to open the ${building.name}.` : `Opens with the ${building.name}.`;
}
function unitTestPassed(unit){
  const key = `${unit}:test`;
  return !!S.quizzes[key]?.passed || Backend.me?.quiz_overrides?.[key] === 'excused';
}
function ruleMet(reward){
  const rule = reward.unlock;
  if (rule.type === 'start') return true;
  if (rule.type === 'unit') return unitOpen(reward.unit);
  if (rule.type === 'station') return (shopProgress(reward.unit)?.st?.[rule.station] || 0) >= UNLOCK_AT;
  if (rule.type === 'mastery') return rule.skills.every(skill => skillStatus(skill) === 'mastered');
  if (rule.type === 'unitMastery') {
    if (unitTestPassed(reward.unit)) return true;
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
  hoodTrophies().forEach(n => {
    const key = `hood:${n.id}`;
    if (!S.completedSets.includes(key)) { S.completedSets.push(key); S.coins += 200; bonuses.push(`${n.name} trophy +200`); if (announce) toast(`🏆 ${n.name} trophy! Every unit test passed. +200 🪙`); }
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
function shopProgress(shop){ return S[shop]; }
/* "cleared" (legacy) always counts; "cleared:<epoch>" only counts if newer than the last attempt */
function reviewClearedAt(key){
  const v = Backend.me?.quiz_overrides?.[key];
  if (v === 'cleared') return Infinity;
  const m = typeof v === 'string' && /^cleared:(\d+)$/.exec(v);
  return m ? +m[1] : null;
}
function reviewCleared(key){ const at = reviewClearedAt(key); return at != null && at > (S.quizzes[key]?.lastAt || 0); }
function reviewSkillsNeeded(key){
  if (reviewCleared(key)) return [];
  return Object.entries(S.review[key] || {}).filter(([, count]) => count > 0).map(([skill]) => skill);
}
function reviewComplete(key){ return reviewCleared(key) || reviewDone(S, key); }
/* stations the teacher opened for the class: the café through min_station, other shops through game_settings.minStations */
function minStationFor(shop){
  if (shop === 'cafe') return S.minStation || 1;
  const m = Backend.me?.game_settings?.minStations?.[shop];
  return Number.isInteger(m) && m > 0 ? m : 1;
}
function stationOpen(shop, n){
  const stations = SHOPS[shop]?.stations || [], station = stations.find(s => s.id === n), progress = shopProgress(shop);
  if (!station || !station.skills.length) return false;
  if (n === 1) return true;
  const settings = quizSettings(Backend.me ? Backend.me.quiz_settings : S.quizSettings || QUIZ_DEFAULTS);
  if (settings.requireQuiz) {
    const previousKey = assessKey(shop, n - 1);
    return (Array.isArray(S.stationsOpenedBefore?.[shop]) && S.stationsOpenedBefore[shop].includes(n)) || !!S.quizzes[previousKey]?.passed || Backend.me?.quiz_overrides?.[previousKey] === 'excused' || n <= minStationFor(shop) || (!Backend.me && S.unlockAll);
  }
  return (!Backend.me && S.unlockAll) || n <= minStationFor(shop) || (progress?.st?.[n-1] || 0) >= UNLOCK_AT;
}
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
  if (shift && shift.mode !== 'practice') return false;
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
/* ===== Station quizzes and unit tests: rules (no DOM) ===== */
/* list of skill ids, one per question: every skill appears, spread evenly, shuffled */
function assessmentPlan(skills, perSkill, min, max){
  if (!skills.length) return [];
  let n = Math.min(max, Math.max(min, skills.length * perSkill));
  n = Math.max(n, skills.length);                      // never leave a skill out
  const order = shuffle(skills.slice()), out = [];
  for (let i = 0; i < n; i++) out.push(order[i % order.length]);
  return shuffle(out);
}
/* results: [{skill, correct}] — a problem is correct only if every step was right on the first try */
function gradeAssessment(results, settings){
  const total = results.length, score = results.filter(r => r.correct).length;
  const passed = total > 0 && score * 100 >= settings.passPct * total;
  const missed = [...new Set(results.filter(r => !r.correct).map(r => r.skill))];
  return {score, total, passed, missed, review: passed ? [] : missed};
}
/* review tracking: S.review[key] = {skillId: perfectStillNeeded} */
const assessKey = (shop, station) => station == null ? `${shop}:test` : `${shop}:${station}`;
function startReview(S, key, skills, settings){
  if (!skills.length) { delete S.review[key]; return; }
  S.review[key] = Object.fromEntries(skills.map(sk => [sk, settings.reviewPerfect]));
}
function reviewCredit(S, skill, perfect){       // call after every practice problem
  if (!perfect) return;
  for (const key of Object.keys(S.review)) if (S.review[key][skill] > 0) S.review[key][skill]--;
}
const reviewDone = (S, key) => !S.review[key] || Object.values(S.review[key]).every(v => v <= 0);
const HELPER_STEP = /multiplier|divisor|jump/i;
function answerStepsFor(p){
  const s = p.steps;
  if (Array.isArray(p.answerSteps) && p.answerSteps.length) return p.answerSteps.map(i => s[i]).filter(Boolean);
  const fills = s.filter(st => st.slot && !HELPER_STEP.test(st.name));
  if (fills.length) return fills;
  const plots = s.filter(st => st.kind === 'grid');
  if (plots.length) return [...plots, s[s.length - 1]];
  const choice = s.findIndex(st => st.kind === 'choice');
  if (choice === 0 && s.length > 1 && /name the (multiplier|divisor)/i.test(s[s.length - 1].name)) return [s[choice]];
  const last = s[s.length - 1];
  if (/simplest form/i.test(last.name) && s.length > 1) return [s[s.length - 2], last];
  return [last];
}

/* ===== Bakery station 1: The Scale (add and subtract decimals, word problems) =====
   Exact decimal math: amounts are whole-number counts of thousandths, so 0.1 + 0.2 is exactly 0.3. */
const DEC = {
  k: s => { const [w, f = ''] = String(s).split('.'); return Number(w) * 1000 + Number((f + '000').slice(0, 3)); },
  fmt: k => { const w = Math.floor(k / 1000), f = String(k % 1000).padStart(3, '0').replace(/0+$/, ''); return w + (f ? '.' + f : ''); },
  places: s => (String(s).split('.')[1] || '').length,
  eq: k => v => typeof v === 'number' && isFinite(v) && Math.round(v * 1000) === k
};
function randDec(minW, maxW, places){
  const w = rand(minW, maxW);
  if (!places) return String(w);
  let f = ''; for (let i = 0; i < places; i++) f += i === places - 1 ? rand(1, 9) : rand(0, 9);
  return `${w}.${f}`;
}
/* the wrong answers students really give */
function rightAlignK(a, b, op){            // lines up right edges: 3.47 + 12.086 is done as 347 + 12086
  const p = Math.max(DEC.places(a), DEC.places(b));
  const ia = Number(a.replace('.', '')), ib = Number(b.replace('.', ''));
  const r = op === '+' ? ia + ib : ia - ib;
  return r * Math.pow(10, 3 - p);
}
function columnWiseK(ka, kb, fn){          // digit by digit, no regrouping
  let out = 0, place = 1, x = ka, y = kb;
  while (x > 0 || y > 0) { out += fn(x % 10, y % 10) * place; x = Math.floor(x / 10); y = Math.floor(y / 10); place *= 10; }
  return out;
}
const noCarryK = (ka, kb) => columnWiseK(ka, kb, (p, q) => (p + q) % 10);
const smallerFromLargerK = (ka, kb) => columnWiseK(ka, kb, (p, q) => Math.abs(p - q));
const PLACE_NAMES = ['ones', 'tenths', 'hundredths', 'thousandths'];
const deepestPlace = (...nums) => PLACE_NAMES[Math.max(...nums.map(DEC.places))];
/* vertical setup; byPoint=false shows the mistake (right edges lined up) */
function columnHTML(a, b, op, byPoint){
  let rows;
  if (byPoint) {
    const [wa, fa = ''] = a.split('.'), [wb, fb = ''] = b.split('.');
    const W = Math.max(wa.length, wb.length), F = Math.max(fa.length, fb.length);
    const cells = (w, f) => [...w.padStart(W, ' '), ...(F ? ['.'] : []), ...f.padEnd(F, '0')];   // trailing zeros fill the empty places (1.7 → 1.70)
    rows = [cells(wa, fa), cells(wb, fb)];
  } else {
    const L = Math.max(a.length, b.length);
    rows = [[...a.padStart(L, ' ')], [...b.padStart(L, ' ')]];
  }
  const td = c => `<td>${c === ' ' ? '' : esc(c)}</td>`;
  return `<table class="colmath"><tr><td></td>${rows[0].map(td).join('')}</tr><tr><td>${op === '+' ? '+' : '−'}</td>${rows[1].map(td).join('')}</tr></table>`;
}
function estimateOptions(a, b, op){
  const ra = Math.round(DEC.k(a) / 1000), rb = Math.round(DEC.k(b) / 1000), est = op === '+' ? ra + rb : ra - rb;
  return shuffle([
    {html:`about ${est}`, text:`about ${est}`, ok:true, mis:null},
    {html:`about ${est * 10}`, text:`about ${est * 10}`, ok:false, mis:'estimateOff'},
    {html:`about ${DEC.fmt(est * 100)}`, text:`about ${DEC.fmt(est * 100)}`, ok:false, mis:'estimateOff'}
  ]);
}
/* one answer box per column, under the lined-up problem (step kind 'digits') */
function digitLayout(a, b, op, exactK){
  const [wa, fa = ''] = a.split('.'), [wb, fb = ''] = b.split('.');
  const F = Math.max(fa.length, fb.length), W = Math.max(wa.length, wb.length) + (op === '+' ? 1 : 0);
  const [wr, fr = ''] = DEC.fmt(exactK).split('.');
  return {a, b, op, F, W, top:[wa.padStart(W, ' '), fa.padEnd(F, '0')], bot:[wb.padStart(W, ' '), fb.padEnd(F, '0')],
    ans:[wr.padStart(W, ' '), fr.padEnd(F, '0')]};
}
const INT_PLACES = ['ones', 'tens', 'hundreds', 'thousands'];
function digitBoxesHTML(d){
  const cell = ch => `<td>${ch === ' ' ? '' : esc(ch)}</td>`;
  const row = ([w, f]) => [...w].map(cell).join('') + (d.F ? '<td>.</td>' + [...f].map(cell).join('') : '');
  const boxes = (cls, extra) => { let h = '';
    for (let i = 0; i < d.W; i++) h += `<td><input class="${cls}" data-p="i${d.W - 1 - i}" ${extra} aria-label="${cls === 'dig' ? INT_PLACES[d.W - 1 - i] || 'digit' : 'carry'}"></td>`;
    if (d.F) { h += `<td>${cls === 'dig' ? '.' : ''}</td>`; for (let i = 0; i < d.F; i++) h += `<td><input class="${cls}" data-p="f${i}" ${extra} aria-label="${cls === 'dig' ? PLACE_NAMES[i + 1] : 'carry'}"></td>`; }
    return h; };
  return `<table class="colmath digits"><tr class="carry-row"><td></td>${boxes('carry', 'tabindex="-1" maxlength="2" inputmode="numeric" autocomplete="off"')}</tr>
    <tr><td></td>${row(d.top)}</tr><tr class="opline"><td>${d.op === '+' ? '+' : '−'}</td>${row(d.bot)}</tr>
    <tr><td></td>${boxes('dig', 'maxlength="1" inputmode="numeric" autocomplete="off"')}</tr></table>
    <div class="frac-tip">Fill the answer from the right. The small boxes on top are for carrying or borrowing, if you want them.</div>`;
}
/* columns that don't match the right answer, rightmost first */
function wrongDigitCols(d){
  const want = {}; [...d.ans[0]].forEach((c, i) => { want['i' + (d.W - 1 - i)] = c; }); [...d.ans[1]].forEach((c, i) => { want['f' + i] = c; });
  return $$('#stepInput input.dig').filter(inp => { const w = want[inp.dataset.p], v = inp.value;
    return w === ' ' ? !(v === '' || v === '0') : v !== w; }).reverse();
}
const placeOf = p => p[0] === 'i' ? INT_PLACES[+p.slice(1)] || 'left' : PLACE_NAMES[+p.slice(1) + 1];
function decSteps(a, b, op, lvl, withEstimate){
  const ka = DEC.k(a), kb = DEC.k(b), exact = op === '+' ? ka + kb : ka - kb;
  const wrongRA = rightAlignK(a, b, op);
  const wrongCol = op === '+' ? noCarryK(ka, kb) : smallerFromLargerK(ka, kb);
  const place = deepestPlace(a, b), drill = {type:'placeValue', key:place}, lineUp = {type:'lineUp', key:place};
  const steps = [];
  if (withEstimate && lvl >= 2) steps.push({name:'Estimate', type:'concept', kind:'choice',
    prompt:'About how much will the answer be? Round each number to the nearest whole number first.',
    options:estimateOptions(a, b, op), hint:() => `${a} is about ${Math.round(ka / 1000)}, and ${b} is about ${Math.round(kb / 1000)}.`});
  if (DEC.places(a) !== DEC.places(b)) steps.push({name:'Line up the decimals', type:'concept', kind:'choice',
    prompt:'Which one is set up correctly?', drill,
    options:shuffle([
      {html:columnHTML(a, b, op, true), text:'decimal points lined up', ok:true, mis:null},
      {html:columnHTML(a, b, op, false), text:'right edges lined up', ok:false, mis:'rightAlign'}]),
    hint:() => 'The decimal points must make one straight column.'});
  steps.push({name:op === '+' ? 'Add' : 'Subtract', type:'compute', kind:'num', prompt:`${a} ${op === '+' ? '+' : '−'} ${b} = ?`,
    answer:DEC.fmt(exact), eq:DEC.eq(exact), drill:lineUp, slowOK:true,           // slow is fine here: they may work it on paper
    kind:'digits', dig:digitLayout(a, b, op, exact),
    mis:v => { if (typeof v !== 'number') return null; const k = Math.round(v * 1000);
      if (k === wrongRA && wrongRA !== exact) return 'rightAlign';
      if (k === wrongCol && wrongCol !== exact) return op === '+' ? 'noRegroup' : 'smallerFromLarger';
      return null; },
    hint:() => op === '+' ? 'Line up the points. Add each column from the right, and carry when a column makes 10 or more.'
                          : 'Line up the points and fill empty places with zeros. Subtract from the right, and regroup when the top digit is smaller.'});
  return {steps, exact};
}
function scaleNumbers(lvl, op){
  const cfg = [{w:[1, 12], p:[1, 2]}, {w:[1, 25], p:[1, 3]}, {w:[2, 60], p:[1, 3]}][lvl - 1];
  for (let t = 0; t < 80; t++){
    const a = randDec(cfg.w[0], cfg.w[1], rand(cfg.p[0], cfg.p[1])), b = randDec(cfg.w[0], cfg.w[1], rand(cfg.p[0], cfg.p[1]));
    if (lvl >= 2 && DEC.places(a) === DEC.places(b) && Math.random() < 0.7) continue;   // mostly uneven decimals from level 2
    if (op === '-' && Math.round(DEC.k(a) / 1000) - Math.round(DEC.k(b) / 1000) < 1) continue;
    return [a, b];
  }
  return op === '+' ? ['3.4', '1.25'] : ['5.2', '1.75'];
}
const BAKERY_WEIGH = [['🌾','flour'],['🍬','sugar'],['🧈','butter'],['🍫','chocolate chips'],['🥜','nuts'],['🍓','berries']];
const SCALE_GEN = {
  addDec(lvl){
    const [a, b] = scaleNumbers(lvl, '+');
    const [i1, i2] = shuffle(BAKERY_WEIGH).slice(0, 2);
    return {title:'The Scale', ctx:`${a} + ${b}`,
      bubble:`I put ${a} kg of ${i1[1]} and ${b} kg of ${i2[1]} in the bowl. How many kilograms is that altogether?`,
      helper:'Line up the decimal points before you add.',
      visual:`<div style="text-align:center; font-size:1.6rem">${i1[0]} ${a} kg + ${i2[0]} ${b} kg</div>`,
      steps:decSteps(a, b, '+', lvl, true).steps};
  },
  subDec(lvl){
    const [a, b] = scaleNumbers(lvl, '-'), [e, n] = pick(BAKERY_WEIGH);
    return {title:'The Scale', ctx:`${a} − ${b}`,
      bubble:`The bag had ${a} kg of ${n}. I used ${b} kg. How many kilograms are left?`,
      helper:'Line up the decimal points, and fill empty places with zeros.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} kg − ${b} kg</div>`,
      steps:decSteps(a, b, '-', lvl, true).steps};
  },
  decWord(lvl){
    const money = Math.random() < 0.5, op = Math.random() < 0.5 ? '+' : '-';
    let a, b, bubble;
    if (money) {
      const price = () => `${rand(lvl === 1 ? 1 : 3, lvl === 1 ? 9 : 19)}.${String(rand(1, 99)).padStart(2, '0')}`;
      if (op === '+') { a = price(); b = price();
        bubble = `A cake costs $${a} and a box of cookies costs $${b}. How much do they cost together?`; }
      else { b = price(); const bill = [5, 10, 20, 50].find(x => x * 1000 > DEC.k(b) + 1000); a = `${bill}.00`;
        bubble = `The treats cost $${b}. I paid with a $${bill} bill. How much change should I get?`; }
    } else {
      [a, b] = scaleNumbers(lvl, op);
      bubble = op === '+' ? `One ribbon is ${a} m long and another is ${b} m long. How long are they end to end?`
                          : `A ribbon is ${a} m long. I cut off ${b} m for a cake box. How much ribbon is left?`;
    }
    const opts = [{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'},
                  {html:'Subtract ( − )', text:'Subtract', ok:op === '-', mis:op === '-' ? null : 'wrongOperation'}];
    return {title:money ? 'The Register' : 'Ribbon Table', ctx:`${a} ${op === '+' ? '+' : '−'} ${b} (${money ? 'money' : 'meters'})`, bubble,
      helper:'Decide what the story is asking, then line up the decimal points.',
      visual:`<div style="text-align:center; font-size:1.5rem">${money ? '💵' : '🎀'}</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Do we add or subtract?', options:opts, drill:{type:'story', key:'addSub'},
        hint:() => op === '+' ? 'The story puts two amounts together.' : 'The story takes an amount away, or finds what is left.'},
        ...decSteps(a, b, op, Math.max(1, lvl - 1), false).steps]};
  }
};
/* rows for the place-value drill (DRILL_IMPL.placeValue); key is 'ones', 'tenths', 'hundredths' or 'thousandths' */
function placeValueRows(key){
  const first = Math.max(1, PLACE_NAMES.indexOf(key)), order = [first, ...shuffle([1, 2, 3].filter(i => i !== first))];
  const rows = [];
  for (let i = 0; i < 6; i++){
    const idx = order[i % 3];
    let f; do { f = `${rand(0, 9)}${rand(0, 9)}${rand(1, 9)}`; } while (new Set(f).size < 3);   // three different digits, so each place has its own answer
    const n = `${rand(10, 99)}.${f}`;
    rows.push({label:`In ${n}, the ${PLACE_NAMES[idx]} digit is`, answer:f[idx - 1], place:PLACE_NAMES[idx]});
  }
  return rows;
}
/* two numbers to line up: one with P decimal places, one with fewer (a whole number when P is 1) */
function lineUpPair(key){
  const P = Math.max(1, PLACE_NAMES.indexOf(key)), long = randDec(1, 30, P), shortP = rand(0, P - 1), short = randDec(1, 30, shortP);
  const padded = shortP ? short + '0'.repeat(P - shortP) : `${short}.${'0'.repeat(P)}`;
  const [a, b] = Math.random() < 0.5 ? [short, long] : [long, short];
  const options = shuffle([{html:columnHTML(a, b, '+', true), text:'decimal points lined up', ok:true}, {html:columnHTML(a, b, '+', false), text:'right edges lined up', ok:false}]);
  return {short, long, padded, a, b, options, answer:String(options.findIndex(o => o.ok))};
}
/* rows for the lining-up drill: pick the setup that is lined up correctly, then fill in the zeros */
function lineUpRows(key, pairs){
  const rows = [];
  for (let i = 0; i < pairs; i++){
    const q = lineUpPair(key);
    rows.push({label:`Which is lined up correctly?`, options:q.options.map(o => o.html), html:true, answer:q.answer, rightText:`${q.a} + ${q.b}: points in one column`});
    rows.push({label:`Fill in the zeros: ${q.short} →`, answer:q.padded});
  }
  return rows;
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
      {name:'Find the multiplier', type:'concept', kind:'num', prompt:'How many batches is that?', answer:k, fact:{x:base[g], y:k, div:true}, storyDrill:{key:'ratio', mis:['additive']},
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
      {name:'Find the multiplier', type:'concept', kind:'num', prompt:`${A[0]} went from ${a} to ${x}. What was it multiplied by?`, answer:k, fact:{x:a, y:k, div:true}, storyDrill:{key:'ratio', mis:['additive']},
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
      {name:'Pick the operation', type:'concept', kind:'choice', prompt:`To change ${from} into ${to}, do we multiply or divide by ${f}?`, options:opts, drill:{type:'story', key:'ratio'},
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
        {name:'Count total parts', type:'concept', kind:'num', prompt:'How many parts make up the whole platter?', answer:n, drill:{type:'story', key:'ratio'},
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
      {name:'Count total parts', type:'concept', kind:'num', prompt:'How many parts make up the whole platter?', answer:n, drill:{type:'story', key:'ratio'},
        mis:v => (v === a || v === b) ? 'partsCount' : null, hint:() => `${a} + ${b}.`},
      {name:'Find the whole', type:'compute', kind:'num', prompt:'How many treats on the whole platter?', answer:T, fact:{x:n, y:u},
        mis:v => v === G + othN ? 'additive' : v === othN*u ? 'wrongPart' : null, hint:() => `${n} parts × ${u} each.`}
    ]};
}
};
Object.assign(GEN, SCALE_GEN);
/* ===== Bakery station 2: Sharing Pans (divide fractions and whole numbers) =====
   A fraction answer is [whole, numerator, denominator] from the three boxes (whole number only: [w, 0, 1]).
   All math is whole numbers, so nothing rounds. */
const FRAC = {
  imp: v => [v[0] * v[2] + v[1], v[2]],
  red: (p, q) => { const g = gcd(p, q) || 1; return [p / g, q / g]; },
  ok: v => Array.isArray(v) && v.length === 3 && v.every(x => Number.isInteger(x) && x >= 0) && v[2] > 0,
  same: (v, p, q) => FRAC.ok(v) && FRAC.imp(v)[0] * q === p * FRAC.imp(v)[1],
  canon: v => FRAC.ok(v) && (v[1] === 0 ? v[2] === 1 : v[1] < v[2] && gcd(v[1], v[2]) === 1),
  simplest: (p, q) => { const [a, b] = FRAC.red(p, q); return b === 1 ? [a, 0, 1] : [Math.floor(a / b), a % b, b]; },
  fmt: v => !Array.isArray(v) ? String(v) : v[1] === 0 ? String(v[0]) : (v[0] ? `${v[0]} ` : '') + `${v[1]}/${v[2]}`,
  txt: (a, b) => `${a}/${b}`,
  part: (b, many) => { const n = ['', '', 'half', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'][b] || `1/${b} part`;
    return !many ? n : b === 2 ? 'halves' : n + 's'; }
};
/* the first known wrong answer that matches v; wrongs: [[misId, p, q]] */
function fracMis(v, p, q, wrongs){
  if (!FRAC.ok(v)) return null;
  const hit = wrongs.find(([, wp, wq]) => wp * q !== p * wq && FRAC.same(v, wp, wq));
  return hit ? hit[0] : null;
}
function fracSimplestStep(p, q){
  const ans = FRAC.simplest(p, q), [rp, rq] = FRAC.red(p, q), over = rq > 1 && rp > rq;
  const right = v => FRAC.canon(v) && FRAC.same(v, p, q);
  const g = gcd(p, q), drill = over ? {type:'mixed', key:rq} : g >= 2 ? {type:'simplify', key:g} : undefined;   // practice pop-up after a miss
  return {name:'Simplest form', type:'concept', kind:'frac', answer:ans, eq:right, skipIf:right, drill,
    prompt:ans[1] === 0 ? 'Now write it as a whole number.' : over ? 'Now write it as a mixed number in simplest form.' : 'Now write it in simplest form.',
    mis:v => !FRAC.same(v, p, q) ? null : v[1] >= v[2] ? 'notMixed' : 'notSimplest',
    hint:() => ans[1] === 0 ? `How many wholes is ${FRAC.txt(p, q)}? Put it in the whole-number box.`
      : over ? `${rp}/${rq}: how many times does ${rq} go into ${rp}? That's the whole number. What's left over goes on top.`
      : 'What number goes into both the top and the bottom? Divide both by it.'};
}
function panHTML(b, a, e){
  return `<div class="pan" aria-label="A pan cut into ${b} equal pieces, ${a} left">${Array.from({length:b}, (_, i) => `<span${i < a ? ' class="full"' : ''}>${i < a ? e : ''}</span>`).join('')}</div>`;
}
function cupsHTML(n, a, b, e){
  return `<div class="cups" aria-label="${n} cups, each cut into ${b} equal parts">${Array.from({length:n}, () => `<span class="cup">${'<i></i>'.repeat(b)}</span>`).join('')}</div><div class="cups-note">${e} 1 serving = ${FRAC.txt(a, b)} cup</div>`;
}
/* whole, part, then the problem. wp: [right whole/part, wrong whole/part]; eqs: [text, ok, mis, sameAs?] */
function fracIdeaSteps(wp, eqs){
  return [
    {name:'Whole and part', type:'concept', kind:'choice', prompt:"What's the whole, and what's the part?", drill:{type:'story', key:'divide'},
      options:shuffle([{html:wp[0], text:wp[0], ok:true, mis:null}, {html:wp[1], text:wp[1], ok:false, mis:'reversedDivision'}]),
      hint:() => 'The whole is everything we start with. The part is one share, one serving, or the number of equal parts.'},
    {name:'Pick the equation', type:'concept', kind:'choice', prompt:'Which equation matches the order?', drill:{type:'story', key:'divide'},
      options:shuffle(eqs.map(([t, ok, mis, same]) => ({html:t, text:same ? `${t} (same as ${same})` : t, ok, mis}))),
      hint:() => 'Whole ÷ part: divide the whole by the size of one part, or by the number of parts.'}
  ];
}
/* a ÷ c/d written as multiplying by the flip */
const flipText = (a, c, d) => `${a} × ${c === 1 ? d : `${d}/${c}`}`;
const PAN_TREATS = [['🍫','brownies'],['🥧','pie'],['🍰','cake'],['🍞','cornbread'],['🍪','cookie bars'],['🧁','crumb cake']];
const BATTERS = [['🧁','muffin','batter'],['🥞','pancake','batter'],['🍰','cake','frosting'],['🍪','cookie','dough']];
const PANS_GEN = {
  fracDivWhole(lvl){
    let a = 1, b = 2, k = 2;
    for (let t = 0; t < 200; t++){
      b = lvl === 1 ? rand(2, 5) : rand(3, lvl === 2 ? 8 : 10);
      a = lvl === 1 ? 1 : rand(2, b - 1);
      k = rand(2, lvl === 1 ? 4 : 6);
      if (gcd(a, b) !== 1) continue;
      if (lvl === 2 && (gcd(a, k) !== 1 || b * k > 40)) continue;    // level 2: already simplest
      if (lvl === 3 && gcd(a, k) === 1) continue;                     // level 3: needs simplifying
      break;
    }
    const [e, n] = pick(PAN_TREATS), p = a, q = b * k, fr = FRAC.txt(a, b);
    const steps = fracIdeaSteps([`Whole: ${fr} of a pan. It's split into ${k} equal parts, one for each friend.`, `Whole: ${k} pans. Each part is ${fr} of a pan.`],
      [[`${fr} ÷ ${k}`, true, null, `${fr} × 1/${k}`], [`${k} ÷ ${fr}`, false, 'reversedDivision'], [`${fr} × ${k}`, false, 'divAsMult']]);
    steps.push({name:'Divide', type:'compute', kind:'frac', prompt:`${fr} ÷ ${k} = ?`, answer:FRAC.simplest(p, q),
      eq:v => FRAC.same(v, p, q), fact:{x:b, y:k},
      mis:v => fracMis(v, p, q, [['divAsMult', a * k, b], ['reversedDivision', b * k, a]]),
      hint:() => `Cut each ${FRAC.part(b)} of the pan into ${k} equal pieces. Now the whole pan has ${b} × ${k} pieces.`});
    steps.push(fracSimplestStep(p, q));               // skipped when the answer was already in simplest form
    return {title:'Sharing Pans', ctx:`${fr} ÷ ${k}`,
      bubble:`There's ${fr} of a pan of ${n} left. ${k} friends share it equally. What fraction of the whole pan does each friend get?`,
      helper:'Sharing a fraction makes each share smaller than what you started with.',
      visual:`${panHTML(b, a, e)}<div class="cups-note">${'🧒'.repeat(k)} share it</div>`, steps};
  },
  wholeDivFrac(lvl){
    let a = 1, b = 2, N = 2;
    for (let t = 0; t < 200; t++){
      b = rand(2, lvl === 1 ? 4 : lvl === 2 ? 6 : 8);
      a = lvl === 1 ? 1 : rand(2, b - 1);
      if (a >= b || gcd(a, b) !== 1) continue;
      N = lvl === 1 ? rand(2, 5) : lvl === 2 ? a * rand(1, 3) : rand(2, 9);
      if (N > 12 || N < 2) continue;
      if (lvl === 3 && (N * b) % a === 0) continue;                   // level 3: answer is a mixed number
      break;
    }
    const [e, thing, stuff] = pick(BATTERS), p = N * b, q = a, fr = FRAC.txt(a, b);
    const steps = fracIdeaSteps([`Whole: ${N} cups of ${stuff}. Part: one ${thing} uses ${fr} cup.`, `Whole: ${fr} cup of ${stuff}. It's split into ${N} equal parts.`],
      [[`${N} ÷ ${fr}`, true, null, flipText(N, a, b)], [`${fr} ÷ ${N}`, false, 'reversedDivision'], [`${N} × ${fr}`, false, 'divAsMult']]);
    steps.push({name:'Divide', type:'compute', kind:'frac', prompt:`${N} ÷ ${fr} = ?`, answer:FRAC.simplest(p, q),
      eq:v => FRAC.same(v, p, q), fact:{x:N, y:b},
      mis:v => fracMis(v, p, q, [['divAsMult', N * a, b], ['denomOnly', N * b, 1], ['numerOnly', N, a], ['reversedDivision', a, N * b]]),
      hint:() => a === 1 ? `Each cup holds ${b} servings. How many servings in ${N} cups?` : `Each cup has ${b} ${FRAC.part(b, true)}, so ${N} cups have ${N} × ${b} of them. Each serving uses ${a} of them.`});
    steps.push(fracSimplestStep(p, q));               // skipped when the answer was already in simplest form
    const part = (N * b) % a !== 0;
    return {title:'Sharing Pans', ctx:`${N} ÷ ${fr}`,
      bubble:`I have ${N} cups of ${stuff}. Each ${thing} uses ${fr} cup. How many ${thing}s can I make?${part ? ' (Part of one counts too.)' : ''}`,
      helper:'Dividing by a fraction smaller than 1 gives you more than you started with.',
      visual:cupsHTML(N, a, b, e), steps};
  }
};
Object.assign(GEN, PANS_GEN);
/* ===== Bakery station 3: Boxing Treats (divide fractions by fractions) ===== */
const fracStr = (w, n, d) => w ? `${w} ${n}/${d}` : `${n}/${d}`;
/* a proper fraction n/d in lowest terms, d from dMin..dMax */
function properFrac(dMin, dMax){
  for (let t = 0; t < 100; t++){ const d = rand(dMin, dMax), n = rand(1, d - 1); if (gcd(n, d) === 1) return [n, d]; }
  return [1, 2];
}
function flipStep(c, d, firstP, firstQ){
  return {name:'Flip the divisor', type:'concept', kind:'frac', prompt:`Dividing by ${c}/${d} is the same as multiplying by what?`,
    answer:FRAC.simplest(d, c), eq:v => FRAC.same(v, d, c), drill:{type:'reciprocal', key:'flip'},
    mis:v => FRAC.same(v, c, d) && c !== d ? 'noFlip' : FRAC.same(v, firstQ, firstP) && firstQ * c !== d * firstP ? 'flipWrong' : null,
    hint:() => `Swap the top and bottom of ${c}/${d}.`};
}
/* the multiply step for p1/q1 ÷ c/d */
function flipMultiplyStep(p1, q1, c, d, extraWrongs = []){
  const P = p1 * d, Q = q1 * c;
  return {name:'Multiply', type:'compute', kind:'frac', prompt:`${FRAC.txt(p1, q1)} × ${FRAC.txt(d, c)} = ?`, answer:FRAC.simplest(P, Q),
    eq:v => FRAC.same(v, P, Q), fact:{x:p1, y:d},
    mis:v => fracMis(v, P, Q, [...extraWrongs, ['noFlip', p1 * c, q1 * d], ['flipWrong', q1 * c, p1 * d]]),
    hint:() => `Multiply the tops (${p1} × ${d}) and the bottoms (${q1} × ${c}).`};
}
function biggerStep(a, b, c, d){
  const more = a * d > b * c;        // more than 1 when more than one c/d fits in a/b
  return {name:'More or less than 1?', type:'concept', kind:'choice', prompt:`Will ${FRAC.txt(a, b)} ÷ ${FRAC.txt(c, d)} be more or less than 1?`,
    options:shuffle([
      {html:'More than 1', text:'more than 1', ok:more, mis:null},
      {html:'Less than 1', text:'less than 1', ok:!more, mis:null}]),
    hint:() => `Which is bigger, ${FRAC.txt(a, b)} or ${FRAC.txt(c, d)}? If ${FRAC.txt(c, d)} fits more than once, the answer is more than 1.`};
}
/* numbers for a ÷ b by level: lvl 1 whole answers with a unit divisor, lvl 2 fraction answers, lvl 3 answers that need simplifying */
function fracDivNumbers(lvl){
  for (let t = 0; t < 300; t++){
    let a, b, c, d;
    if (lvl === 1) { [a, b] = properFrac(2, 6); c = 1; d = b * rand(2, 3); }
    else { [a, b] = properFrac(2, 9); [c, d] = properFrac(2, lvl === 2 ? 9 : 12); }
    if (a * d === b * c) continue;                         // same fraction: answer 1
    const P = a * d, Q = b * c, g = gcd(P, Q);
    if (lvl === 1 && P % Q) continue;
    if (lvl === 2 && (Q / g === 1 || g > 1)) continue;     // a fraction, already simplest
    if (lvl === 3 && (g === 1 || Q / g === 1)) continue;   // needs simplifying, not whole
    if (lvl >= 2 && (P > 99 || Q > 99)) continue;
    return [a, b, c, d];
  }
  return lvl === 1 ? [3, 4, 1, 8] : lvl === 2 ? [2, 3, 3, 4] : [5, 6, 2, 9];
}
const BOX_TREATS = [['🍬','fudge','pound'],['🍪','cookie dough','pound'],['🥜','trail mix','pound'],['🍫','chocolate','pound'],['🍓','berries','pound']];
function boxesStory(a, b, c, d){
  const [e, what, unit] = pick(BOX_TREATS);
  return {e, how:`We have ${FRAC.txt(a, b)} ${unit} of ${what}. Each box holds ${FRAC.txt(c, d)} ${unit}. How many boxes can we fill?`,
    rev:`We have ${FRAC.txt(c, d)} ${unit} of ${what}. Each box holds ${FRAC.txt(a, b)} ${unit}. How many boxes can we fill?`,
    of:`What is ${FRAC.txt(c, d)} of ${FRAC.txt(a, b)} ${unit} of ${what}?`};
}
const BOXES_GEN = {
  fracDiv(lvl){
    const [a, b, c, d] = fracDivNumbers(lvl), P = a * d, Q = b * c;
    const steps = [biggerStep(a, b, c, d), flipStep(c, d, a, b), flipMultiplyStep(a, b, c, d), fracSimplestStep(P, Q)];
    const e = pick(BOX_TREATS)[0];
    return {title:'Boxing Treats', ctx:`${a}/${b} ÷ ${c}/${d}`,
      bubble:`Can you work out ${a}/${b} ÷ ${c}/${d} for my boxes?`,
      helper:'Keep the first fraction, change ÷ to ×, and flip the second fraction.',
      visual:lvl === 1 ? `${panHTML(d, a * d / b, e)}<div class="cups-note">${a}/${b} = ${a * d / b}/${d}. How many ${c}/${d}s fit?</div>`
        : `<div style="text-align:center; font-size:1.8rem">${e} ${a}/${b} ÷ ${c}/${d}</div>`, steps};
  },
  mixedDiv(lvl){
    let W, r, b, c, d, X = 0;
    for (let t = 0; t < 300; t++){
      W = rand(1, lvl === 3 ? 4 : 5); [r, b] = properFrac(2, lvl === 1 ? 4 : 6);
      if (lvl === 1) { c = 1; d = b * rand(1, 3); if (d < 2) continue; }
      else if (lvl === 2) { [c, d] = properFrac(2, 8); }
      else { X = rand(1, 2); let s; [s, d] = properFrac(2, 5); c = X * d + s; }
      const P = (W * b + r) * d, Q = b * c;
      if (P === Q) continue;
      if (lvl === 1 && P % Q) continue;
      if (lvl >= 2 && (P % Q === 0 || P > 150 || Q > 150)) continue;
      break;
    }
    const p1 = W * b + r, P = p1 * d, Q = b * c, [e, what] = pick(BOX_TREATS);
    const first = fracStr(W, r, b), second = X ? fracStr(X, c - X * d, d) : FRAC.txt(c, d);
    const steps = [{name:'Write as a fraction', type:'setup', kind:'frac', prompt:`Write ${first} as a fraction.`, answer:[0, p1, b],
      eq:v => FRAC.same(v, p1, b), fact:{x:W, y:b},
      mis:v => FRAC.same(v, r, b) || FRAC.same(v, W + r, b) ? 'mixedAsParts' : null,
      hint:() => `${W} whole${W > 1 ? 's' : ''} = ${W} × ${b} = ${W * b} ${FRAC.part(b, true)}. Add the ${r} more.`}];
    if (X) steps.push({name:'Write as a fraction', type:'setup', kind:'frac', prompt:`Write ${second} as a fraction.`, answer:[0, c, d],
      eq:v => FRAC.same(v, c, d), fact:{x:X, y:d},
      mis:v => FRAC.same(v, c - X * d, d) || FRAC.same(v, X + c - X * d, d) ? 'mixedAsParts' : null,
      hint:() => `${X} whole${X > 1 ? 's' : ''} = ${X * d} ${FRAC.part(d, true)}. Add the ${c - X * d} more.`});
    steps.push(flipStep(c, d, p1, b));
    steps.push(flipMultiplyStep(p1, b, c, d, X ? [] : [['mixedAsParts', W * b * c + r * d, b * c]]));
    steps.push(fracSimplestStep(P, Q));
    return {title:'Boxing Treats', ctx:`${first} ÷ ${second}`,
      bubble:`I have ${first} pounds of ${what}. Each box holds ${second} pound${X ? 's' : ''}. How many boxes can I fill?${P % Q ? ' (Part of a box counts too.)' : ''}`,
      helper:'Turn mixed numbers into fractions first. Then keep, change, flip.',
      visual:`<div style="text-align:center; font-size:1.8rem">${e} ${first} ÷ ${second}</div>`, steps};
  },
  fracInterp(lvl){
    const [a, b, c, d] = fracDivNumbers(lvl), P = a * d, Q = b * c, S = boxesStory(a, b, c, d), eq = `${a}/${b} ÷ ${c}/${d}`;
    const storyFirst = Math.random() < 0.5;
    const pickStep = storyFirst
      ? {name:'Match the equation', type:'concept', kind:'choice', prompt:'Which equation matches the story?', drill:{type:'story', key:'divide'},
          options:shuffle([{html:eq, text:`${eq} (same as ${flipText(`${a}/${b}`, c, d)})`, ok:true, mis:null}, {html:`${c}/${d} ÷ ${a}/${b}`, text:`${c}/${d} ÷ ${a}/${b}`, ok:false, mis:'reversedDivision'},
                           {html:`${a}/${b} × ${c}/${d}`, text:`${a}/${b} × ${c}/${d}`, ok:false, mis:'divAsMult'}]),
          hint:() => 'Whole: the amount you have. Part: one box. Whole ÷ part.'}
      : {name:'Match the story', type:'concept', kind:'choice', prompt:`Which story matches ${eq}?`, drill:{type:'story', key:'divide'},
          options:shuffle([{html:S.how, text:'how many boxes fit', ok:true, mis:null}, {html:S.rev, text:'the numbers swapped', ok:false, mis:'reversedDivision'},
                           {html:S.of, text:'a fraction of an amount', ok:false, mis:'divAsMult'}]),
          hint:() => `${eq} asks: how many ${c}/${d}s fit in ${a}/${b}?`};
    const steps = [pickStep, {...flipMultiplyStep(a, b, c, d), name:'Solve', prompt:`${eq} = ?`,
      hint:() => `Keep ${a}/${b}, change ÷ to ×, flip ${c}/${d} to ${d}/${c}.`}, fracSimplestStep(P, Q)];
    return {title:'Boxing Treats', ctx:eq, answerSteps:[0, 1, 2],
      bubble:storyFirst ? S.how : `My recipe card just says ${eq}. What does that mean?`,
      helper:'Dividing by a fraction asks how many of that size fit.',
      visual:`<div style="text-align:center; font-size:1.8rem">${S.e} ${storyFirst ? '?' : eq}</div>`, steps};
  },
  fracWord(lvl){
    const [a, b, c, d] = fracDivNumbers(lvl), P = a * d, Q = b * c, [e, what, unit] = pick(BOX_TREATS);
    const perWhole = lvl >= 2 && Math.random() < 0.4;      // "how much for 1 whole" story
    const bubble = perWhole
      ? `${a}/${b} ${unit} of ${what} fills ${c}/${d} of a big tin. How many ${unit}s fill the whole tin?`
      : `We have ${a}/${b} ${unit} of ${what}. Each bag holds ${c}/${d} ${unit}. How many bags can we fill?${P % Q ? ' (Part of a bag counts too.)' : ''}`;
    const eq = `${a}/${b} ÷ ${c}/${d}`;
    const steps = [{name:'Pick the equation', type:'concept', kind:'choice', prompt:'Which equation matches the order?', drill:{type:'story', key:'divide'},
        options:shuffle([{html:eq, text:`${eq} (same as ${flipText(`${a}/${b}`, c, d)})`, ok:true, mis:null}, {html:`${c}/${d} ÷ ${a}/${b}`, text:`${c}/${d} ÷ ${a}/${b}`, ok:false, mis:'reversedDivision'},
                         {html:`${a}/${b} × ${c}/${d}`, text:`${a}/${b} × ${c}/${d}`, ok:false, mis:'divAsMult'}]),
        hint:() => perWhole ? `The whole tin is what we want. We know a part: ${a}/${b} pound is ${c}/${d} of it. Divide by ${c}/${d}.` : 'Whole: how much we have. Part: one bag. Whole ÷ part.'},
      flipStep(c, d, a, b), flipMultiplyStep(a, b, c, d), fracSimplestStep(P, Q)];
    return {title:'Boxing Treats', ctx:eq, bubble, helper:'Find the equation first, then keep, change, flip.',
      visual:`<div style="text-align:center; font-size:1.8rem">${e}</div>`, steps};
  }
};
Object.assign(GEN, BOXES_GEN);

/* ===== Bakery station 4: The Register (multiply decimals, long division) =====
   Exact math only: decimals are kept as a whole number plus a count of decimal places (2.4 is {i:24, p:1}),
   so no answer ever depends on floating-point rounding. */
const XD = {
  parse: s => { const [w, f = ''] = String(s).split('.'); return {i:Number(w + f), p:f.length}; },
  fmt: (i, p) => { if (!p) return String(i); const s = String(i).padStart(p + 1, '0'), w = s.slice(0, -p), f = s.slice(-p).replace(/0+$/, ''); return w + (f ? '.' + f : ''); },
  eq: (i, p) => v => typeof v === 'number' && isFinite(v) && Math.abs(v * Math.pow(10, p) - i) < 1e-6
};
const DEC_PLACES = s => (String(s).split('.')[1] || '').length;
const noZeroDigits = n => !String(n).includes('0');
/* a decimal with w whole-number digits (value range) and p places, ending in a non-zero digit */
function regDec(minW, maxW, p){
  const w = rand(minW, maxW); if (!p) return String(w);
  let f = ''; for (let k = 0; k < p; k++) f += k === p - 1 ? rand(1, 9) : rand(0, 9);
  return `${w}.${f}`;
}
/* the whole-number layout: top × bottom, one row per bottom digit (right to left), then the sum */
function mulLayout(a, b){
  let A = XD.parse(a), B = XD.parse(b);
  let top = a, bot = b;
  if (String(B.i).length > String(A.i).length) { [A, B] = [B, A]; [top, bot] = [b, a]; }   // the longer number goes on top
  const bd = [...String(B.i)].reverse().map(Number);
  const rows = bd.map((dg, r) => A.i * dg * Math.pow(10, r));
  const flat = bd.map(dg => A.i * dg);                     // the same rows without the place shift (the partialShift mix-up)
  return {top, bot, A:A.i, B:B.i, rows, flat, sum:A.i * B.i, places:A.p + B.p, maxPlaces:Math.max(A.p, B.p),
    width:Math.max(String(A.i * B.i).length, String(A.i).length + 1, ...rows.map(r => String(r).length)) + 1};
}
function mulSteps(L, lvl, withEstimate, a, b){
  const steps = [], AB = L.sum, n = L.places, multi = L.rows.length > 1;
  const skip = lvl >= 3 && multi ? (v => v === AB) : undefined;   // level 3: typing the whole product skips the rows
  if (withEstimate && lvl >= 2) {
    const ra = Math.max(1, Math.round(XD.parse(a).i / Math.pow(10, XD.parse(a).p))), rb = Math.max(1, Math.round(XD.parse(b).i / Math.pow(10, XD.parse(b).p))), est = ra * rb;
    steps.push({name:'Estimate', type:'concept', kind:'choice', prompt:'About how much will the answer be? Round each number to the nearest whole number first.',
      options:shuffle([{html:`about ${est}`, text:`about ${est}`, ok:true, mis:null},
        {html:`about ${est * 10}`, text:`about ${est * 10}`, ok:false, mis:'estimateOff'},
        {html:`about ${XD.fmt(est, 1)}`, text:`about ${XD.fmt(est, 1)}`, ok:false, mis:'estimateOff'}]),
      hint:() => `${a} is about ${ra}, and ${b} is about ${rb}. ${ra} × ${rb} = ${est}.`});
  }
  const bd = [...String(L.B)].reverse().map(Number), topMax = Math.max(...String(L.A).split('').map(Number));
  if (!multi) {
    steps.push({name:'Multiply', type:'compute', kind:'mulrow', mul:L, row:0, prompt:`Multiply as whole numbers: ${L.A} × ${L.B} = ?`,
      answer:AB, eq:v => v === AB, fact:{x:bd[0], y:topMax}, slowOK:true,
      hint:() => `Multiply each digit of ${L.A} by ${L.B}, starting on the right. Carry when a column makes 10 or more.`});
  } else {
    L.rows.forEach((rv, r) => steps.push({name:`Row ${r + 1}`, type:'compute', kind:'mulrow', mul:L, row:r,
      prompt: r === 0 ? `Row 1: ${L.A} × ${bd[0]} = ?${skip ? ' (Or type the whole product in the last row.)' : ''}` : `Row ${r + 1}: ${L.A} × ${bd[r]} ${r === 1 ? 'tens' : 'hundreds'} = ?`,
      answer:rv, eq: r === 0 && skip ? (v => v === rv || v === AB) : (v => v === rv), skipIf: r > 0 ? skip : undefined,
      fact:{x:bd[r], y:topMax}, slowOK:true,
      mis:v => (r > 0 && v === L.flat[r] && v !== rv) ? 'partialShift' : null,
      hint:() => r === 0 ? `Multiply each digit of ${L.A} by ${bd[0]}, starting on the right.` : `This row is for the ${r === 1 ? 'tens' : 'hundreds'} digit, so it starts with ${r === 1 ? 'a zero' : 'two zeros'} on the right. Then multiply ${L.A} by ${bd[r]}.`}));
    const flatSum = L.flat.reduce((s, x) => s + x, 0);
    steps.push({name:'Add the rows', type:'compute', kind:'mulrow', mul:L, row:'sum', prompt:`Add the rows: ${L.rows.join(' + ')} = ?`,
      answer:AB, eq:v => v === AB, skipIf:skip, slowOK:true,
      mis:v => (v === flatSum && v !== AB) ? 'partialShift' : null,
      hint:() => 'Add each column from the right, and carry when a column makes 10 or more.'});
  }
  steps.push({name:'Count the decimal places', type:'concept', kind:'num', prompt:`How many digits are after the decimal points in ${L.top} and ${L.bot} altogether?`,
    answer:n, eq:v => v === n, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
    mis:v => (v === L.maxPlaces && v !== n) ? 'pointLikeAdding' : null,
    hint:() => `${L.top} has ${XD.parse(L.top).p}, and ${L.bot} has ${XD.parse(L.bot).p}. Add them.`});
  const ans = XD.fmt(AB, n);
  steps.push({name:'Place the point', type:'compute', kind:'num', prompt:`${a} × ${b} = ?`, answer:ans, eq:XD.eq(AB, n), decimal:true,
    drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
    mis:v => { if (typeof v !== 'number') return null; const right = XD.eq(AB, n);
      if (right(v)) return null;
      if (XD.eq(AB, L.maxPlaces)(v)) return 'pointLikeAdding';
      if (XD.eq(AB, n - 1)(v) || XD.eq(AB, n + 1)(v)) return 'placesMiscount';
      const flatSum = L.flat.reduce((s, x) => s + x, 0);
      if (multi && flatSum !== AB && XD.eq(flatSum, n)(v)) return 'partialShift';
      return null; },
    hint:() => `Start from ${AB} and count ${n} place${n === 1 ? '' : 's'} in from the right.`});
  return steps;
}
/* long division, one quotient digit at a time; returns the layout and the steps */
function longDivision(N, d){
  const s = String(N); let k = 1, cur = Number(s.slice(0, 1));
  while (cur < d && k < s.length) { cur = cur * 10 + Number(s[k]); k++; }
  const work = [], q = [];
  let col = k - 1;                                          // the dividend column the current number ends under
  for (;;){
    const qd = Math.floor(cur / d), m = qd * d, r = cur - m;
    q.push(qd); work.push({col, cur, qd, mul:m, sub:r});
    if (col + 1 >= s.length) break;
    col++; cur = r * 10 + Number(s[col]);
  }
  return {N:s, d, q, startCol:k - 1, work, quotient:Math.floor(N / d), rem:N % d};
}
function divSteps(D, lvl){
  const steps = [], d = D.d, boxes = lvl >= 2;             // levels 2 and 3 get the optional carry and borrow boxes
  D.work.forEach((w, i) => {
    steps.push({name:`Digit ${i + 1}`, type:'concept', kind:'ldiv', div:D, cell:{step:i, part:'q'}, boxes,
      prompt: w.cur < d ? `How many ${d}s fit in ${w.cur}?` : `How many ${d}s fit in ${w.cur}? Write the digit on top.`,
      answer:w.qd, eq:v => v === w.qd,
      mis:v => { if (typeof v !== 'number' || v === w.qd) return null;
        if (w.qd === 0 && v > 0) return 'missingZero';
        if (v > w.qd) return 'quotientTooBig';
        if (v < w.qd && w.cur - v * d >= d) return 'quotientTooSmall';
        return null; },
      hint:() => w.cur < d ? `${w.cur} is less than ${d}, so no ${d}s fit. Write 0.` : `Round ${d} to ${Math.round(d / 10) * 10}. About how many of those fit in ${w.cur}? Then check: that many ${d}s can't be more than ${w.cur}.`});
    if (w.qd === 0) return;                                 // a zero digit needs no multiply or subtract row
    steps.push({name:'Multiply', type:'compute', kind:'ldiv', div:D, cell:{step:i, part:'mul'}, boxes,
      prompt:`${w.qd} × ${d} = ?`, answer:w.mul, eq:v => v === w.mul, fact: d <= 12 ? {x:w.qd, y:d} : {x:w.qd, y:d % 10 || 10},
      hint:() => `${w.qd} × ${d}: multiply the ones, then the tens.`});
    steps.push({name:'Subtract', type:'compute', kind:'ldiv', div:D, cell:{step:i, part:'sub'}, boxes,
      prompt:`${w.cur} − ${w.mul} = ?`, answer:w.sub, eq:v => v === w.sub,
      hint:() => `Subtract from the right. If the answer is ${d} or more, the digit on top was too small.`});
  });
  const qz = D.quotient, r = D.rem;
  const dropZeros = Number(String(qz).replace(/0/g, '') || '0');
  steps.push(r ? {name:'The answer', type:'compute', kind:'qr', prompt:`${D.N} ÷ ${d} = ? R ?`, answer:[qz, r], eq:v => Array.isArray(v) && v[0] === qz && v[1] === r,
      mis:v => Array.isArray(v) && v[0] === dropZeros && dropZeros !== qz ? 'missingZero' : null, skipIf:() => true,
      hint:() => 'The number on top is the answer. What was left at the end is the remainder.'}
    : {name:'The answer', type:'compute', kind:'num', prompt:`${D.N} ÷ ${d} = ?`, answer:qz, eq:v => v === qz,
      mis:v => v === dropZeros && dropZeros !== qz ? 'missingZero' : null, skipIf:() => true,
      hint:() => 'The number on top is the answer.'});
  return steps;
}
/* dividend and divisor for each level; quotient zeros and remainders only where the level allows them */
function divNumbers(skill, lvl){
  const cfg = skill === 'div2'
    ? [{d:[11, 25], q:[3, 9], nd:3, zero:false, rem:false}, {d:[12, 39], q:[11, 89], nd:[3, 4], zero:false, rem:false}, {d:[12, 59], q:[11, 99], nd:[3, 4], zero:true, rem:true}][lvl - 1]
    : [{d:[12, 39], q:[101, 399], nd:4, zero:false, rem:false}, {d:[12, 59], q:[101, 499], nd:4, zero:true, rem:false}, {d:[13, 99], q:[101, 899], nd:4, zero:true, rem:true}][lvl - 1];
  for (let t = 0; t < 400; t++){
    const d = rand(cfg.d[0], cfg.d[1]), qz = rand(cfg.q[0], cfg.q[1]);
    if (d % 10 === 0) continue;
    const r = cfg.rem && Math.random() < 0.5 ? rand(1, d - 1) : 0, N = qz * d + r, len = String(N).length;
    const nd = Array.isArray(cfg.nd) ? cfg.nd : [cfg.nd, cfg.nd];
    if (len < nd[0] || len > nd[1]) continue;
    const D = longDivision(N, d);
    if (!cfg.zero && D.q.includes(0)) continue;
    if (cfg.zero && lvl >= 2 && skill === 'divMulti' && !D.q.slice(1).includes(0) && Math.random() < 0.5) continue;   // lean toward zeros in the quotient
    return D;
  }
  return longDivision(skill === 'div2' ? 336 : 8256, skill === 'div2' ? 12 : 24);
}
const REG_ITEMS = [['🧀', 'cheese'], ['🍇', 'grapes'], ['🍫', 'chocolate'], ['🥜', 'nuts'], ['🍓', 'strawberries'], ['🧈', 'butter']];
const REG_TREATS = [['🍪', 'cookies'], ['🧁', 'cupcakes'], ['🥐', 'croissants'], ['🍩', 'donut holes'], ['🥨', 'pretzels'], ['🍬', 'candies']];
const REGISTER_GEN = {
  mulDecPlace(lvl){
    let x, y, pa, pb;
    for (let t = 0; t < 200; t++){
      x = lvl === 3 ? rand(11, 49) : lvl === 2 ? rand(11, 29) : rand(2, 9); y = lvl === 3 ? rand(11, 29) : rand(2, 9);
      if (x % 10 === 0 || y % 10 === 0) continue;
      [pa, pb] = [rand(0, lvl === 1 ? 1 : 2), rand(lvl === 1 ? 1 : 0, lvl === 3 ? 3 : 2)];
      const n = pa + pb; if (n < 1 || n > (lvl === 1 ? 2 : lvl === 2 ? 3 : 4) || (lvl >= 2 && n < 2)) continue;
      break;
    }
    const a = XD.fmt(x, pa), b = XD.fmt(y, pb), P = x * y, n = pa + pb, ans = XD.fmt(P, n), max = Math.max(pa, pb);
    return {title:'The Register', ctx:`${a} × ${b}, from ${x} × ${y}`,
      bubble:`You know ${x} × ${y} = ${P}. What is ${a} × ${b}?`,
      helper:'The digits are the same. Only the decimal point moves.',
      visual:`<div style="text-align:center; font-size:1.6rem">${x} × ${y} = ${P}<br>${a} × ${b} = ?</div>`,
      steps:[
        {name:'Count the decimal places', type:'concept', kind:'num', prompt:`How many digits are after the decimal points in ${a} and ${b} altogether?`,
          answer:n, eq:v => v === n, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))}, mis:v => (v === max && v !== n) ? 'pointLikeAdding' : null,
          hint:() => `${a} has ${pa}, and ${b} has ${pb}. Add them.`},
        {name:'Place the point', type:'compute', kind:'num', prompt:`${a} × ${b} = ?`, answer:ans, eq:XD.eq(P, n), decimal:true, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
          mis:v => { if (typeof v !== 'number' || XD.eq(P, n)(v)) return null;
            if (max !== n && XD.eq(P, max)(v)) return 'pointLikeAdding';
            if (XD.eq(P, n - 1)(v) || XD.eq(P, n + 1)(v)) return 'placesMiscount';
            return null; },
          hint:() => `Start from ${P} and count ${n} place${n === 1 ? '' : 's'} in from the right. Write zeros in front if you run out of digits.`}]};
  },
  mulDec(lvl){
    let a, b, kind;
    for (let t = 0; t < 300; t++){
      kind = lvl === 1 ? pick(['count', 'count', 'part']) : 'price';
      if (kind === 'count') { a = Math.random() < 0.5 ? regDec(1, 9, 2) : regDec(1, 9, 1); b = String(rand(2, 9)); }   // $2.45 × 3 bags, or 1.5 kg × 4 trays
      else if (kind === 'part') { a = regDec(2, 9, 1); b = `0.${rand(2, 9)}`; }                                        // 0.6 of a 7.5 kg block
      else { a = regDec(lvl === 2 ? 1 : 2, lvl === 2 ? 9 : 19, 2); b = lvl === 3 && Math.random() < 0.5 ? `0.${rand(1, 9)}${rand(1, 9)}` : `${rand(1, 9)}.${rand(1, 9)}`; }
      const L = mulLayout(a, b);
      if (!noZeroDigits(L.B)) continue;                    // no zero digits on the bottom: every row has work in it
      if (L.width > 8) continue;                            // fits an iPhone SE
      if (lvl >= 2 && L.rows.length < 2) continue;
      break;
    }
    const L = mulLayout(a, b), [e, item] = pick(REG_ITEMS), [te, treat] = pick(REG_TREATS);
    const bubble = kind === 'count' ? (DEC_PLACES(a) === 2 ? `A box of ${treat} costs $${a}. I want ${b} boxes. How much is that?` : `One tray holds ${a} kg of ${item}. How many kilograms are on ${b} trays?`)
      : kind === 'part' ? `A block of ${item} weighs ${a} kg. I need ${b} of the block. How many kilograms is that?`
      : `${item[0].toUpperCase() + item.slice(1)} ${/s$/.test(item) ? 'cost' : 'costs'} $${a} a kilogram. I want ${b} kg. How much is that, before the register rounds to the nearest cent?`;
    return {title:'The Register', ctx:`${a} × ${b}`, bubble,
      helper:'Multiply as whole numbers, then count the decimal places.',
      visual:`<div style="text-align:center; font-size:1.6rem">${kind === 'count' && DEC_PLACES(a) === 2 ? te : e} ${a} × ${b}</div>`,
      steps:mulSteps(L, lvl, true, a, b)};
  },
  div2(lvl){ return registerDivision('div2', lvl); },
  divMulti(lvl){ return registerDivision('divMulti', lvl); }
};
function registerDivision(skill, lvl){
  const D = divNumbers(skill, lvl), [e, item] = pick(REG_TREATS), steps = divSteps(D, lvl);
  const bubble = D.rem ? `We made ${D.N} ${item}. Each box holds ${D.d}. How many full boxes, and how many are left over?`
                       : `We made ${D.N} ${item}. Each box holds ${D.d}. How many boxes do we fill?`;
  return {title:'The Register', ctx:`${D.N} ÷ ${D.d}${D.rem ? ' (remainder)' : ''}`, bubble,
    helper:'One digit at a time: how many fit, multiply, subtract, bring down.',
    visual:`<div style="text-align:center; font-size:1.6rem">${e} ${D.N} ÷ ${D.d}</div>`,
    steps, answerSteps:[steps.length - 1]};
}
Object.assign(GEN, REGISTER_GEN);

/* ===== Bakery station 5: Bulk Orders (divide decimals) =====
   Exact math: every number is a whole number plus a count of decimal places (XD), and the long division runs on
   whole-number digits with the decimal point drawn straight up from the dividend. */
/* long division of a decimal dividend by a whole number; s = the dividend's digits (zeros already added), pt = digits before the point */
function longDivisionDec(s, d, pt){
  let k = 1, cur = Number(s[0]);
  while (cur < d && k < pt) { cur = cur * 10 + Number(s[k]); k++; }   // never pass the ones digit, so the point always has a digit above it
  const work = [];
  let col = k - 1;
  for (;;){
    const qd = Math.floor(cur / d), m = qd * d, r = cur - m;
    work.push({col, cur, qd, mul:m, sub:r, auto: col === 0 && cur === 0});   // "how many 4s in 0" is filled in for the student
    if (col + 1 >= s.length) break;
    col++; cur = r * 10 + Number(s[col]);
  }
  const qi = Number(s) / d;                                // exact: s is a multiple of d by construction
  return {N:s, d, pt, work, q:work.map(w => w.qd), startCol:k - 1, quotient:qi, rem:Number(s) % d, places:s.length - pt};
}
/* the dividend written with p decimal places (7 → "700", pt 1, for 7.00) */
function decDigits(x, p){ const {i, p:xp} = XD.parse(x); const whole = String(i * Math.pow(10, p - xp)).padStart(p + 1, '0'); return {s:whole, pt:whole.length - p}; }
function bulkSteps(a, b, lvl, skill){
  const B = XD.parse(b), m = B.p, bw = B.i;                // move the point m places: b becomes the whole number bw
  const A = XD.parse(a), aMoved = XD.fmt(A.i * (A.p >= m ? 1 : Math.pow(10, m - A.p)), Math.max(0, A.p - m));
  const Ai = XD.parse(aMoved);
  let P = Ai.p; while ((Ai.i * Math.pow(10, P - Ai.p)) % bw !== 0) P++;   // quotient places: keep adding zeros until it divides evenly
  const {s, pt} = decDigits(aMoved, P), D = longDivisionDec(s, bw, pt);
  const qI = Ai.i * Math.pow(10, P - Ai.p) / bw, ans = XD.fmt(qI, P), right = XD.eq(qI, P);
  const steps = [];
  if (m > 0) {
    const opts = shuffle([{html:`${aMoved} ÷ ${bw}`, text:`${aMoved} ÷ ${bw}`, ok:true, mis:null},
      {html:`${a} ÷ ${bw}`, text:`${a} ÷ ${bw}`, ok:false, mis:'shiftOneOnly'},
      {html:`${XD.fmt(A.i, Math.max(0, A.p - m + 1))} ÷ ${bw}`, text:`moved ${m - 1 || 'no'} place${m - 1 === 1 ? '' : 's'}`, ok:false, mis:'pointMisplaced'}]
      .filter((o, k, arr) => arr.findIndex(x => x.html === o.html) === k));
    steps.push(lvl === 1
      ? {name:'Make the divisor whole', type:'concept', kind:'choice', prompt:`Move the decimal point so ${b} becomes a whole number. Which problem is the same as ${a} ÷ ${b}?`, options:opts,
          drill:{type:'decimalShift', key:String(Math.pow(10, m))}, hint:() => `${b} × ${Math.pow(10, m)} = ${bw}. Do the same to ${a}.`}
      : {name:'Make the divisor whole', type:'concept', kind:'num', prompt:`Move both points ${m} place${m === 1 ? '' : 's'} to the right: ${a} ÷ ${b} = ? ÷ ${bw}`,
          answer:aMoved, eq:XD.eq(Ai.i, Ai.p), decimal:true, drill:{type:'decimalShift', key:String(Math.pow(10, m))},
          mis:v => { if (typeof v !== 'number' || XD.eq(Ai.i, Ai.p)(v)) return null;
            if (XD.eq(A.i, A.p)(v)) return 'shiftOneOnly';
            if (XD.eq(Ai.i, Ai.p + 1)(v) || XD.eq(Ai.i, Ai.p - 1)(v)) return 'pointMisplaced';
            return null; },
          hint:() => `${b} × ${Math.pow(10, m)} = ${bw}. Now multiply ${a} by ${Math.pow(10, m)} too.`});
  }
  if (P > Ai.p) steps.push({name:'Keep dividing', type:'concept', kind:'choice',
    prompt:`${bw} doesn't go into ${aMoved} evenly. What do we do?`,
    options:shuffle([{html:`Write ${aMoved} as ${s.slice(0, pt)}.${s.slice(pt)} and keep dividing`, text:'add zeros and keep dividing', ok:true, mis:null},
      {html:'Stop and write the remainder', text:'stop with a remainder', ok:false, mis:'remainderNotDecimal'}]),
    hint:() => 'A decimal can have zeros added at the end without changing its value: 7 = 7.0 = 7.00.'});
  const digits = divSteps(D, lvl);
  digits.pop();                                            // station 4's final answer step is replaced by placing the point
  digits.forEach(st => { if (st.kind === 'ldiv' && D.work[st.cell.step].auto) st.skipAuto = true; });
  steps.push(...digits.filter(st => !st.skipAuto));
  const stopped = Math.floor(Ai.i / bw), rem = Ai.i % bw;   // stopping early: 7 ÷ 4 = 1 R3, often written 1.3
  const flat = Number(String(qI).replace(/0/g, '') || '0');
  steps.push({name:'Place the point', type:'concept', kind:'num', prompt:`${a} ÷ ${b} = ?`, answer:ans, eq:right, decimal:true,
    drill:{type:'decimalShift', key:'10'},
    mis:v => { if (typeof v !== 'number' || right(v)) return null;
      if (m > 0 && Math.abs(v * bw - A.i / Math.pow(10, A.p)) < 1e-9) return 'shiftOneOnly';   // divided the unmoved dividend by the whole divisor
      if (XD.eq(qI, P + 1)(v) || XD.eq(qI, P - 1)(v) || XD.eq(qI, P + 2)(v) || (P >= 2 && XD.eq(qI, P - 2)(v))) return 'pointMisplaced';
      if (P > Ai.p && rem && (XD.eq(stopped, Ai.p)(v) || (Ai.p === 0 && (XD.eq(stopped * 10 + rem, 1)(v) || XD.eq(stopped * 100 + rem, 2)(v))))) return 'remainderNotDecimal';
      if (flat !== qI && (XD.eq(flat, P)(v) || XD.eq(flat, P - 1)(v))) return 'missingZero';
      return null; },
    hint:() => 'The point in the answer goes straight up from the point in the dividend.'});
  return {steps, D, ans, P, aMoved, bw, m};
}
const BULK_ITEMS = [['🌾', 'flour'], ['🍬', 'sugar'], ['🧈', 'butter'], ['🍫', 'chocolate chips'], ['🥜', 'nuts'], ['🍓', 'berries']];
/* a decimal string that is exactly q × b, from whole-number parts */
const xdMul = (x, y) => { const X = XD.parse(x), Y = XD.parse(y); return XD.fmt(X.i * Y.i, X.p + Y.p); };
function bulkFits(a, b, lvl){
  const r = bulkSteps(a, b, lvl);
  return r.D.N.length + String(r.bw).length <= 7 && r.P <= 3 && r.steps.length <= (lvl === 1 ? 10 : 12) ? r : null;   // fits an iPhone SE, and no order runs past 12 steps
}
const BULK_GEN = {
  divToDec(lvl){
    let a, b, r;
    for (let t = 0; t < 400; t++){
      const d = lvl === 1 ? pick([2, 4, 5]) : lvl === 2 ? pick([4, 5, 8, 20, 25]) : pick([8, 16, 20, 25, 40, 50, 80]);
      const N = lvl === 1 ? rand(3, 49) : rand(10, lvl === 2 ? 199 : 399);
      if (N % d === 0) continue;
      a = String(N); b = String(d); r = bulkFits(a, b, lvl);
      if (!r) continue;
      if (lvl === 1 && r.P > 2) continue;
      if (lvl === 3 && r.P < 2) continue;
      break;
    }
    const [e, item] = pick(BULK_ITEMS);
    return {title:'Bulk Orders', ctx:`${a} ÷ ${b}`,
      bubble:`We have ${a} kg of ${item} to split into ${b} equal batches. How many kilograms go in each batch?`,
      helper:'When it doesn\'t divide evenly, add a point and zeros and keep going.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} kg ÷ ${b}</div>`,
      steps:r.steps, answerSteps:[r.steps.length - 1]};
  },
  divDec2(lvl){ return bulkDecimal('divDec2', lvl); },
  divDec3(lvl){ return bulkDecimal('divDec3', lvl); }
};
function bulkDecimal(skill, lvl){
  let a, b, r;
  for (let t = 0; t < 3000; t++){
    r = null;
    if (skill === 'divDec2') {
      b = lvl === 1 ? `0.0${rand(2, 9)}` : lvl === 2 ? `0.${rand(1, 9)}${rand(1, 9)}` : pick([`0.${rand(1, 9)}${rand(1, 9)}`, `${rand(1, 4)}.${rand(0, 9)}${rand(1, 9)}`]);
      const q = lvl === 1 ? String(rand(3, 99)) : lvl === 2 ? pick([String(rand(2, 60)), `${rand(1, 20)}.${rand(1, 9)}`]) : pick([`${rand(1, 20)}.${rand(1, 9)}`, `${rand(1, 9)}.0${rand(1, 9)}`, `${rand(1, 9)}0.${rand(1, 9)}`, `${rand(1, 9)}.${rand(1, 9)}${rand(1, 9)}`]);
      a = xdMul(q, b);
      if (XD.parse(a).p > 2) continue;                                        // hundredths in the problem
    } else {
      b = lvl === 1 ? String(rand(2, 9)) : lvl === 2 ? `0.${rand(2, 9)}` : pick([`0.0${rand(2, 9)}`, `0.${rand(1, 9)}${rand(1, 9)}`, `0.00${rand(2, 9)}`]);
      const q = lvl === 1 ? `0.${rand(0, 9)}${rand(0, 9)}${rand(1, 9)}` : lvl === 2 ? `0.${rand(1, 9)}${rand(1, 9)}` : pick([`${rand(0, 9)}.${rand(0, 9)}${rand(1, 9)}`, `${rand(1, 30)}.0${rand(1, 9)}`]);
      a = xdMul(q, b);
      if (lvl < 3 ? XD.parse(a).p !== 3 : XD.parse(a).p < 2 || XD.parse(a).p > 3) continue;   // thousandths in the problem
    }
    if (Number(a) < 0.1 || /^0\.00/.test(a)) continue;
    r = bulkFits(a, b, lvl);
    if (!r) continue;
    if (skill === 'divDec2' && XD.parse(a).p > 2) continue;                 // hundredths
    if (lvl === 3 && !r.D.q.slice(1).includes(0) && Math.random() < 0.5) continue;   // lean toward zeros in the quotient
    break;
  }
  if (!r) { [a, b] = skill === 'divDec2' ? ['3.25', '0.05'] : ['0.378', '0.9']; r = bulkSteps(a, b, lvl); }   // never reached in testing
  const [e, item] = pick(BULK_ITEMS), whole = !b.includes('.');
  return {title:'Bulk Orders', ctx:`${a} ÷ ${b}`,
    bubble: whole ? `We have ${a} kg of ${item} to share equally among ${b} batches. How many kilograms go in each?`
                  : `We have ${a} kg of ${item}. Each bag holds ${b} kg. How many bags can we fill?`,
    helper: whole ? 'Divide as usual, and put the point straight up from the dividend\'s point.' : 'Make the divisor a whole number first: move both points the same number of places.',
    visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} ÷ ${b}</div>`,
    steps:r.steps, answerSteps:[r.steps.length - 1]};
}
Object.assign(GEN, BULK_GEN);

/* ----- The Register layouts: multiplication rows (kind 'mulrow') and the long-division bus stop (kind 'ldiv') ----- */
/* digit cells for a number as written (2.45): the point rides on the digit before it, so the digits stay in whole-number columns */
function writtenCells(str){ const out = []; for (const ch of String(str)) { if (ch === '.') out[out.length - 1].pt = true; else out.push({c:ch}); } return out; }
const regTd = (cell, cls = '') => `<td class="${cls}">${cell && cell.c ? esc(cell.c) : ''}${cell && cell.pt ? '<b class="mpt">.</b>' : ''}</td>`;
const regBox = (small, label) => small ? `<td><input class="carry" tabindex="-1" maxlength="2" inputmode="numeric" autocomplete="off" aria-label="carry"></td>`
  : `<td><input class="dig" maxlength="1" inputmode="numeric" autocomplete="off" aria-label="${esc(label || 'digit')}"></td>`;
function mulGrid(L){ return Math.max(String(L.sum).length, String(L.A).length, String(L.B).length, ...L.rows.map(r => String(r).length)); }
/* the whole multiplication, with answer boxes in the row being worked */
function mulRowsHTML(st){
  const L = st.mul, W = mulGrid(L), multi = L.rows.length > 1, active = st.row === 'sum' ? L.rows.length : st.row;
  const right = cells => [...Array(Math.max(0, W - cells.length)).fill(null), ...cells];
  const line = (sign, cells, cls = '') => `<tr class="${cls}"><td>${sign}</td>${right(cells).map(c => regTd(c)).join('')}</tr>`;
  const boxRow = (sign, zeros, cls = '') => { let h = `<tr class="${cls}"><td>${sign}</td>`;
    for (let c = 0; c < W; c++) h += c >= W - zeros ? '<td class="zero">0</td>' : regBox(false, INT_PLACES[W - 1 - c] || 'digit');
    return h + '</tr>'; };
  let h = `<table class="colmath digits mulgrid"><tr class="carry-row"><td></td>${Array.from({length:W}, () => regBox(true)).join('')}</tr>`;
  h += line('', writtenCells(L.top)) + line('×', writtenCells(L.bot), 'opline');
  if (!multi) h += boxRow('', 0);
  else {
    L.rows.forEach((rv, r) => {
      const last = r === L.rows.length - 1, cls = last && st.row === 'sum' ? 'opline' : '', sign = last && st.row === 'sum' ? '+' : '';
      if (r < active) h += line(sign, writtenCells(String(rv)), cls);
      else if (r === active) h += boxRow('', r);
    });
    if (st.row === 'sum') h += boxRow('', 0);
  }
  return h + `</table><div class="frac-tip">Fill the answer from the right. The small boxes on top are for carrying, if you want them.</div>`;
}
/* the expected digits in the boxes being worked, left to right ('' where a box should stay empty) */
function regWant(st){
  if (st.kind === 'mulrow') {
    const L = st.mul, W = mulGrid(L), zeros = st.row === 'sum' ? 0 : (L.rows.length > 1 ? st.row : 0);
    const v = String(st.row === 'sum' || L.rows.length === 1 ? L.sum : L.rows[st.row]).slice(0, zeros ? -zeros : undefined);
    return [...v.padStart(W - zeros, ' ')].map(c => c === ' ' ? '' : c);
  }
  const w = st.div.work[st.cell.step];
  if (st.cell.part === 'q') return [String(w.qd)];
  const n = String(w.cur).length, v = String(st.cell.part === 'mul' ? w.mul : w.sub);
  return [...v.padStart(n, ' ')].map(c => c === ' ' ? '' : c);
}
/* read the boxes left to right: empty boxes are allowed only in front of the first digit */
function readRegBoxes(st){
  const vals = $$('#stepInput input.dig').map(inp => inp.value);
  let s = '', started = false;
  for (const v of vals) { if (!v) { if (started) return null; continue; } started = true; s += v; }
  if (!s) return null;
  const zeros = st.kind === 'mulrow' && st.row !== 'sum' && st.mul.rows.length > 1 ? st.row : 0;
  return Number(s + '0'.repeat(zeros));
}
function wrongRegBoxes(st){
  const want = regWant(st), boxes = $$('#stepInput input.dig');
  return boxes.filter((inp, k) => { const w = want[k] || '', v = inp.value; return w === '' ? !(v === '' || v === '0') : v !== w; }).reverse();
}
const LD_PART = {q:0, mul:1, sub:2};
/* the bus stop, drawn up to the step being worked */
function ldivHTML(st){
  const D = st.div, dl = String(D.d).length, n = D.N.length, cols = 1 + dl + 1 + n, at = st.cell;
  const done = (i, part) => i < at.step || (i === at.step && LD_PART[part] < LD_PART[at.part]);
  const col = c => 1 + dl + 1 + c;                                   // table column of dividend column c
  const blank = () => Array.from({length:cols}, () => ({html:'<td></td>'}));
  const put = (row, endCol, str, cls = '') => { const ds = String(str); [...ds].forEach((ch, k) => { row[col(endCol - ds.length + 1 + k)] = {html:`<td class="${cls}">${ch}</td>`}; }); };
  const putBoxes = (row, endCol, count, small) => { for (let k = 0; k < count; k++) row[col(endCol - count + 1 + k)] = {html:regBox(small, 'digit')}; };
  const q = blank(); D.work.forEach((w, i) => { if (done(i, 'q') || w.auto) q[col(w.col)] = {html:`<td>${w.qd}</td>`}; else if (i === at.step && at.part === 'q') q[col(w.col)] = {html:regBox(false, 'quotient digit')}; });
  const top = blank(); [...String(D.d)].forEach((ch, k) => { top[1 + k] = {html:`<td>${ch}</td>`}; }); top[1 + dl] = {html:'<td class="brk">)</td>'};
  [...D.N].forEach((ch, c) => { top[col(c)] = {html:`<td class="dvd">${ch}</td>`}; });
  if (D.pt && D.pt < n) [q, top].forEach(r => { const c = r[col(D.pt - 1)]; c.html = c.html.replace(/<\/td>$/, '<b class="mpt">.</b></td>'); });   // the point, straight up from the dividend's point
  const rows = [q, top]; let curRow = 1;                             // the row holding the number being divided right now
  for (let i = 0; i < D.work.length && i <= at.step; i++) {
    const w = D.work[i], next = D.work[i + 1];
    if (w.qd === 0) {                                                  // no rows: bring the next digit down onto the current line
      if (done(i, 'q') && next && curRow > 1) { const r = rows[curRow]; put(r, next.col, next.cur); }
      continue;
    }
    if (!done(i, 'q')) break;
    const width = String(w.cur).length, mulRow = blank();
    if (i === at.step && at.part === 'mul') {
      if (st.boxes) { const c = blank(); putBoxes(c, w.col, width, true); rows.push(c); }
      putBoxes(mulRow, w.col, width, false);
    } else put(mulRow, w.col, w.mul, 'uline');
    mulRow[col(w.col - (i === at.step && at.part === 'mul' ? width : String(w.mul).length))] = {html:'<td>−</td>'};
    rows.push(mulRow);
    if (!done(i, 'mul')) break;
    const subRow = blank();
    if (i === at.step && at.part === 'sub') {
      if (st.boxes) { const c = blank(); putBoxes(c, w.col, width, true); rows.splice(curRow, 0, c); }
      putBoxes(subRow, w.col, width, false);
    } else put(subRow, next ? next.col : w.col, next ? next.cur : w.sub);
    rows.push(subRow); curRow = rows.length - 1;
    if (!done(i, 'sub')) break;
  }
  return `<table class="colmath digits ldiv">${rows.map(r => `<tr>${r.map(c => c.html).join('')}</tr>`).join('')}</table>
    <div class="frac-tip">${at.part === 'q' ? 'Write one digit on top.' : 'Fill the answer from the right.'}${st.boxes && at.part !== 'q' ? ` The small boxes are for ${at.part === 'mul' ? 'carrying' : 'borrowing'}, if you want them.` : ''}</div>`;
}
/* the finished layout, shown in the done list once its last box is filled */
function regDoneHTML(st, v){
  if (st.kind === 'ldiv') return ldivHTML({...st, boxes:false, cell:{step:st.div.work.length, part:'q'}}).replace(/<div class="frac-tip">[\s\S]*$/, '');
  const L = st.mul, W = mulGrid(L), right = cells => [...Array(Math.max(0, W - cells.length)).fill(null), ...cells];
  const line = (sign, cells, cls = '') => `<tr class="${cls}"><td>${sign}</td>${right(cells).map(c => regTd(c)).join('')}</tr>`;
  const rows = L.rows.length > 1 && !(st.row === 0 && v === L.sum) ? L.rows.map((rv, r) => line(r === L.rows.length - 1 ? '+' : '', writtenCells(String(rv)), r === L.rows.length - 1 ? 'opline' : '')).join('') : '';
  return `<table class="colmath digits mulgrid">${line('', writtenCells(L.top))}${line('×', writtenCells(L.bot), 'opline')}${rows}${line('', writtenCells(String(L.sum)))}</table>`;
}
function wireRegBoxes(){
  const digs = $$('#stepInput input.dig'), move = (inp, dir) => { const k = digs.indexOf(inp) + dir; if (digs[k]) { digs[k].focus(); digs[k].select(); } };
  digs.forEach(inp => {
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(-1); inp.classList.remove('wrong'); if (inp.value) move(inp, -1); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); checkCurrent(); }
      else if (e.key === 'Backspace' && !inp.value) { e.preventDefault(); move(inp, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); move(inp, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); move(inp, 1); }
    });
  });
  $$('#stepInput input.carry').forEach(inp => inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); }));
  setTimeout(() => digs[digs.length - 1]?.focus(), 40);
}

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
let currentShop = 'cafe';
const SCREENS = ['loading','join','name','home','cafe','shift','sprint','book','summary','shop','hall','parent'];
function show(id){
  SCREENS.forEach(s => $('#scr-'+s).hidden = (s !== id));
  Music.setTempo(id === 'sprint' ? SPRINT_RATE : 1);
  updateHeader();
  if (id === 'home') renderHome();
  if (id === 'cafe') renderShopFloor(currentShop);
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
  const allowed = musicAllowed();
  $('#musicBtn').textContent = allowed ? '🎵' : '🔇';
  $('#musicBtn').classList.toggle('off', !S.music || !allowed);
  $('#musicBtn').setAttribute('aria-label', !allowed ? 'Music: your teacher turned music off' : S.music ? 'Music settings (music is on)' : 'Music settings (music is off)');
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
/* Background music tracks. Each is 4 bars of 8 eighth notes, looped.
   chords: 4 chords (MIDI notes), bass: 4 root notes, arp: which chord note plays on each eighth
   (null = rest), melA / melB: 32 melody eighths (null = rest). The first loop plays chords only,
   then melA, melA, melB, repeating (same pattern as the original café tune). */
const TRACKS = {
  cafe:   { name: 'Café Stroll', emoji: '☕', tempo: 96, key: 'C major', lead: 'sine', pad: 'triangle',
    chords: [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]], bass: [36,33,41,43], arp: [0,1,2,3,2,1,2,1],
    melA: [76,null,79,null,81,79,76,null, 72,null,76,null,74,null,72,null, 69,null,72,null,74,72,69,null, 71,null,74,null,79,null,null,null],
    melB: [79,null,76,79,81,null,79,null, 76,null,72,null,76,74,null,null, 72,null,69,72,74,null,76,null, 74,null,71,null,67,null,null,null] },
  park:   { name: 'Sunny Park', emoji: '🌳', tempo: 108, key: 'G major', lead: 'triangle', pad: 'triangle',
    chords: [[55,59,62,67],[50,54,57,62],[52,55,59,64],[48,52,55,60]], bass: [43,38,40,36], arp: [0,2,1,3,0,2,1,2],
    melA: [71,null,74,null,79,null,74,null, 74,null,69,null,74,76,74,null, 71,null,76,null,79,76,71,null, 72,null,76,null,74,72,71,null],
    melB: [79,null,78,76,74,null,71,null, 69,null,74,null,78,null,74,null, 76,null,79,76,71,null,67,null, 72,74,76,null,72,null,67,null] },
  stars:  { name: 'Starry Night', emoji: '🌙', tempo: 72, key: 'A minor', lead: 'sine', pad: 'sine',
    chords: [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]], bass: [45,41,36,43], arp: [0,null,2,null,1,null,3,null],
    melA: [76,null,null,null,72,null,null,null, 72,null,null,null,69,null,null,null, 67,null,null,null,72,null,null,null, 74,null,null,null,71,null,null,null],
    melB: [72,null,74,null,76,null,null,null, 77,null,76,null,72,null,null,null, 76,null,74,null,72,null,null,null, 71,null,null,null,67,null,null,null] },
  arcade: { name: 'Arcade Hop', emoji: '🕹️', tempo: 128, key: 'C major', lead: 'square', pad: 'triangle',
    chords: [[60,64,67,72],[57,60,64,69],[50,53,57,62],[55,59,62,67]], bass: [36,33,38,43], arp: [0,1,2,1,3,1,2,1],
    melA: [72,74,76,79,76,74,72,null, 69,72,76,null,72,69,67,null, 69,72,74,77,74,72,69,null, 71,74,79,null,74,71,67,null],
    melB: [79,null,79,77,76,null,72,null, 76,null,76,74,72,null,69,null, 74,null,77,76,74,null,72,null, 74,76,74,71,67,null,null,null] }
};
const SPRINT_RATE = 1.375;   // the sprint speeds music up from 96 to 132 beats per minute, as before tracks existed
const Music = (() => {
  let ctx, master, melBus, timer = null, step = 0, nextTime = 0, rate = 1, playing = false;
  let track = TRACKS.cafe, pendingTrack = null, volume = 70;
  const level = () => Math.max(0.0001, 0.13 * volume / 100);   // 70 gives about 0.09; the fade can't aim at exactly 0
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
    while (nextTime < ctx.currentTime + 0.15) {
      if (pendingTrack && step % 8 === 0) { track = pendingTrack; pendingTrack = null; }   // switch at the next bar
      const e8 = 60 / (track.tempo * rate) / 2;
      const bar = Math.floor(step/8) % 4, s8 = step % 8, loop = Math.floor(step/32), ch = track.chords[bar], a = track.arp[s8];
      if (s8 === 0 || s8 === 4) note(track.bass[bar], nextTime, e8*3.5, 'sine', 0.45);
      if (a != null) note(ch[a], nextTime, e8*1.5, track.pad, 0.09);
      if (rate > 1 && s8 % 2 === 0) note(ch[3]+12, nextTime, 0.05, 'square', 0.015);   // sprint tick
      const mel = loop % 4 === 0 ? null : (loop % 4 === 3 ? track.melB : track.melA), m = mel && mel[step % 32];
      if (m) note(m, nextTime, e8*1.8, track.lead, track.lead === 'square' ? 0.11 : 0.22, melBus);
      nextTime += e8; step++;
    }
  }
  return {
    start(){ try { if (!ctx) init(); if (playing) return; playing = true; getCtx(); nextTime = ctx.currentTime + 0.05; timer = setInterval(schedule, 25);
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(level(), ctx.currentTime + 1.2); } catch(e){} },
    stop(){ if (!playing || !ctx) return; playing = false; master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime); master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      const t = timer; timer = null; setTimeout(() => clearInterval(t), 450); },
    setTempo(mult){ rate = mult; },
    /* switch track at the next bar without stopping */
    setTrack(id){ const t = TRACKS[id] || TRACKS.cafe; if (!playing) { track = t; pendingTrack = null; } else if (t !== track) pendingTrack = t; else pendingTrack = null; },
    /* 0 to 100; 0 is silent */
    setVolume(v){
      const next = Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
      if (next === volume) return;
      volume = next;
      if (playing && ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime); master.gain.exponentialRampToValueAtTime(level(), ctx.currentTime + 0.15); }
    }
  };
})();
function applyMusicPrefs(){ Music.setTrack(S.musicTrack); Music.setVolume(S.musicVolume); }
/* a teacher can turn music off for the whole class (MUSIC.md step 3) */
function musicAllowed(){ return Backend.me?.game_settings?.allowMusic !== false; }
function kickMusic(){ if (!musicAllowed()) { Music.stop(); return; } if (S.music && !document.hidden) { applyMusicPrefs(); Music.start(); } }
['pointerdown','keydown'].forEach(ev => document.addEventListener(ev, kickMusic));
document.addEventListener('visibilitychange', () => { if (document.hidden) Music.stop(); else kickMusic(); });
$('#muteBtn').addEventListener('click', () => { S.muted = !S.muted; save(); updateHeader(); if (!S.muted) sfx('tick'); });
$('#musicBtn').addEventListener('pointerdown', e => e.stopPropagation());
/* ---------- music menu (MUSIC.md step 2): tracks, volume, and music on/off ---------- */
function renderMusicMenu(){
  $('#musicMenu').innerHTML = `<div class="mm-head"><b>Music</b><label class="mm-switch"><input type="checkbox" id="mmOn" ${S.music ? 'checked' : ''}> Music on</label></div>
    <div class="mm-tracks" role="radiogroup" aria-label="Track">${Object.entries(TRACKS).map(([id, t]) => `<button type="button" class="mm-track${id === S.musicTrack ? ' on' : ''}" role="radio" aria-checked="${id === S.musicTrack}" data-track="${id}"><span aria-hidden="true">${t.emoji}</span> ${esc(t.name)}${id === S.musicTrack ? '<b aria-hidden="true">✓</b>' : ''}</button>`).join('')}</div>
    <label class="mm-vol" for="mmVol">Volume <input type="range" id="mmVol" min="0" max="100" step="5" value="${S.musicVolume}"></label>`;
}
function openMusicMenu(){
  const menu = $('#musicMenu'), r = $('#musicBtn').getBoundingClientRect();
  renderMusicMenu(); menu.hidden = false;
  const w = menu.offsetWidth, top = r.bottom + 8;
  menu.style.top = top + 'px';
  menu.style.left = Math.max(12, Math.min(r.right - w, innerWidth - w - 12)) + 'px';
  menu.style.maxHeight = Math.max(160, innerHeight - top - 12) + 'px';
  $('#musicBtn').setAttribute('aria-expanded', 'true');
  ($('#musicMenu .mm-track.on') || $('#mmOn')).focus();
}
function closeMusicMenu(returnFocus){
  if ($('#musicMenu').hidden) return;
  $('#musicMenu').hidden = true; $('#musicBtn').setAttribute('aria-expanded', 'false');
  if (returnFocus) $('#musicBtn').focus();
}
$('#musicBtn').addEventListener('click', e => { e.stopPropagation(); if (!musicAllowed()) { Music.stop(); toast('Your teacher turned music off.'); return; } if ($('#musicMenu').hidden) openMusicMenu(); else closeMusicMenu(false); });
$('#musicMenu').addEventListener('click', e => {
  const b = e.target.closest('[data-track]'); if (!b) return;
  if (!musicAllowed()) { closeMusicMenu(false); return; }
  S.musicTrack = b.dataset.track;
  if (!S.music) S.music = true;              // choosing a track starts music if it was off
  save(); updateHeader(); applyMusicPrefs(); Music.start();
  renderMusicMenu(); $(`#musicMenu [data-track="${S.musicTrack}"]`).focus();
});
$('#musicMenu').addEventListener('change', e => {
  if (e.target.id === 'mmOn') { S.music = e.target.checked; save(); updateHeader(); if (S.music && musicAllowed()) { applyMusicPrefs(); Music.start(); } else Music.stop(); }
  if (e.target.id === 'mmVol') save();
});
$('#musicMenu').addEventListener('input', e => { if (e.target.id === 'mmVol') { S.musicVolume = Number(e.target.value); Music.setVolume(S.musicVolume); } });
document.addEventListener('pointerdown', e => { if (!e.target.closest('#musicMenu, #musicBtn')) closeMusicMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMusicMenu(true); });
window.addEventListener('scroll', () => closeMusicMenu(false), {passive:true});

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
function openName(){
  $('#nameInput').value = S.name; updatePreview();
  const hoods = builtHoods(), wrap = $('#homeWrap');                // local mode asks for the grade once there are two to pick from
  wrap.hidden = hoods.length < 2 || !!Backend.me;
  $('#homeSelect').innerHTML = hoods.map(n => `<option value="${n.id}" ${n.id === S.home ? 'selected' : ''}>${n.emoji} ${esc(n.name)}</option>`).join('');
  show('name'); setTimeout(() => $('#nameInput').focus(), 50);
}
function updatePreview(){ const v = $('#nameInput').value.trim(); $('#namePreview').textContent = v ? v + "'s Pet Town" : 'Your Pet Town'; }
$('#nameInput').addEventListener('input', updatePreview);
$('#nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#nameSave').click(); });
$('#nameSave').addEventListener('click', () => {
  const v = $('#nameInput').value.trim().slice(0,20);
  if (!v) { toast('Type your name first'); $('#nameInput').focus(); return; }
  S.name = v; if (!$('#homeWrap').hidden && validHood($('#homeSelect').value)) { S.home = $('#homeSelect').value; viewHood = null; }
  save(); sfx('good'); show('home');
});

/* ---------- neighborhoods ---------- */
/* the class (or grown-up) sets the home grade; local mode uses the one picked when the town was named */
function homeHood(){ const cls = Backend.me?.game_settings?.home; return validHood(cls) ? cls : S.home; }
let viewHood = null;                                         // the neighborhood on screen; starts at home each visit
const currentHood = () => viewHood && builtHoods().some(n => n.id === viewHood) ? viewHood : homeHood();
function hoodSwitchHTML(){
  const hoods = builtHoods(); if (hoods.length < 2) return '';
  const home = homeHood(), sorted = [...hoods.filter(n => n.id === home), ...hoods.filter(n => n.id !== home)];
  return `<div class="hood-switch" role="tablist" aria-label="Neighborhood">${sorted.map(n => `<button type="button" role="tab" class="hood-tab${n.id === currentHood() ? ' active' : ''}" aria-selected="${n.id === currentHood()}" data-hood="${n.id}">${n.emoji} ${esc(n.name)}${n.id === home ? ' <small>home</small>' : ''}</button>`).join('')}</div>`;
}
/* a grade trophy for the Sticker Book once every unit test in a neighborhood is passed */
function hoodTrophies(){ return NEIGHBORHOODS.filter(n => { const list = buildingsIn(n.id); return list.length && list.every(b => b.open && unitTestPassed(b.id)); }); }

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
  let h = hoodSwitchHTML();
  buildingsIn(currentHood()).forEach(b => {
    const rewards = REWARDS.filter(r => r.unit === b.id), owned = rewards.filter(owns).length;
    const open = unitOpen(b.id);
    const stickers = open ? `<span class="tile-stickers" aria-label="${owned} of ${rewards.length} stickers">${rewards.map(r => `<i class="${owns(r) ? 'filled' : ''}" title="${esc(r.name)}"></i>`).join('')}</span>` : '';
    const progress = open ? `<span class="tile-collection">${owned}/${rewards.length}</span>${stickers}` : '';
    h += open
      ? `<button class="tile" data-open="${b.id}"><span class="te">${b.emoji}</span><span class="tn">${b.name}</span><span class="tu">${b.unit}</span>${progress}</button>`
      : `<div class="tile locked" aria-disabled="true"><span class="te">${b.emoji}</span><span class="tn">${b.name}</span><span class="tu">${b.unit}</span>${progress}<span class="soon">${b.open ? `🔒 Pass the ${prevBuilding(b.id)?.name || 'last'} Unit Test` : 'Opening soon'}</span></div>`;
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
  const hood = e.target.closest('[data-hood]'); if (hood) { viewHood = hood.dataset.hood; sfx('tick'); renderHome(); const t = $(`#town [data-hood="${viewHood}"]`); if (t) t.focus(); return; }
  const b = e.target.closest('[data-open]'); if (!b) return;
  const id = b.dataset.open;
  if (SHOPS[id] && unitOpen(id)) {
    currentShop = id;
    void Backend.refreshSettings().then(() => { if (currentShop === id && !$('#scr-cafe').hidden && !shift) show('cafe'); });
    show('cafe');
  }
  else if (id === 'sprint') openSprint();
  else if (id === 'shop') show('book');
  else if (id === 'book') show('book');
  else if (id === 'hall') { renderHall(); show('hall'); }
});

/* ---------- shop stations ---------- */
function renderShopFloor(shop){
  const config = SHOPS[shop] || SHOPS.cafe, progress = shopProgress(config.id) || {st:{}};
  const settings = quizSettings(Backend.me ? Backend.me.quiz_settings : S.quizSettings || QUIZ_DEFAULTS);
  currentShop = config.id;
  $('#scr-cafe h2').textContent = `${config.emoji} ${config.name}`;
  $('#scr-cafe > p').textContent = settings.requireQuiz ? `${config.unitLabel}. Pass each station quiz to open the next station.` : `${config.unitLabel}. Each station opens after ${UNLOCK_AT} orders at the one before it.`;
  const allStationsBuilt = config.stations.every(st => st.skills.length > 0);
  const allStationQuizzesPassed = allStationsBuilt && config.stations.every(st => {
    const key = assessKey(config.id, st.id);
    return !!S.quizzes[key]?.passed || Backend.me?.quiz_overrides?.[key] === 'excused';
  });
  const testKey = assessKey(config.id, null), testReviewSkills = reviewSkillsNeeded(testKey), testPassed = unitTestPassed(config.id);
  const testReviewStation = config.stations.find(st => st.skills.some(skill => testReviewSkills.includes(skill)))?.id ?? 1;
  const unitTestCard = !allStationsBuilt ? '' : `<div class="station unit-test${allStationQuizzesPassed || testPassed ? '' : ' locked'}">
    <div class="se">🏆</div><h3>Unit Test</h3>${testPassed ? '<p class="muted" style="margin:0">✅ Unit Test passed</p>'
      : testReviewSkills.length ? `<p class="muted" style="margin:0">🔁 Review: ${testReviewSkills.length} skill${testReviewSkills.length === 1 ? '' : 's'} to practice</p><button class="btn" data-review-key="${esc(testKey)}" data-review-station="${testReviewStation}" data-shop="${config.id}">Review practice</button>`
      : S.quizzes[testKey]?.tries && reviewComplete(testKey) ? `<button class="btn" data-unit-test data-shop="${config.id}">Retake unit test</button>`
      : allStationQuizzesPassed ? `<p class="muted" style="margin:0">Every station quiz is passed.</p><button class="btn berry" data-unit-test data-shop="${config.id}">Start Unit Test</button>`
      : '<p class="muted" style="margin:0">Pass every station quiz first</p>'}</div>`;
  $('#stations').innerHTML = unitTestCard + config.stations.map(st => {
    const open = stationOpen(config.id, st.id), done = progress.st[st.id] || 0;
    const prev = st.id > 1 ? (progress.st[st.id-1] || 0) : 0;
    const quizKey = assessKey(config.id, st.id), quiz = S.quizzes[quizKey], override = Backend.me?.quiz_overrides?.[quizKey];
    const reviewSkills = reviewSkillsNeeded(quizKey), passed = !!quiz?.passed || override === 'excused';
    const mastered = st.skills.length > 0 && st.skills.every(skill => skillStatus(skill) === 'mastered');
    const prevName = config.stations[st.id-2]?.name || 'previous station';
    const lock = !st.skills.length
      ? '<p class="muted" style="margin:0">Coming soon</p>'
      : open ? '' : settings.requireQuiz
        ? `<p class="muted" style="margin:0">Pass ${prevName.startsWith('The ') ? '' : 'the '}${esc(prevName)} quiz to open this station.</p>`
        : `<p class="muted" style="margin:0">Opens after ${UNLOCK_AT} orders at ${config.stations[st.id-2].name} (${Math.min(prev, UNLOCK_AT)} of ${UNLOCK_AT}).</p>`;
    const skills = st.skills.map(sk => { const s = skillStatus(sk); return `<li><span class="pill p-${s}">${s === 'new' ? 'new' : s}</span>${esc(SKILLS[sk].name)}</li>`; }).join('');
    let quizCard = '';
    if (passed) quizCard = `<p class="muted" style="margin:0">✅ Quiz passed${quiz?.best ? ` (${quiz.best}%)` : ''}</p>`;
    else if (reviewSkills.length) quizCard = `<p class="muted" style="margin:0">🔁 Review: ${reviewSkills.length} skill${reviewSkills.length === 1 ? '' : 's'} to practice</p><button class="btn" data-review-key="${esc(quizKey)}" data-review-station="${st.id}" data-shop="${config.id}">Review practice</button>`;
    else if (quiz?.tries) quizCard = `<button class="btn" data-quiz="${st.id}" data-shop="${config.id}">Retake quiz</button>`;
    else if (open && mastered) quizCard = `<button class="btn" data-quiz="${st.id}" data-shop="${config.id}">📝 Station Quiz</button>`;
    return `<div class="station ${open ? '' : 'locked'}"><div class="se">${st.emoji}</div><h3>${st.id}. ${st.name}</h3><p class="muted" style="margin:0">${st.kid}</p>
      <ul class="skilllist">${skills}</ul>${lock}<p class="muted" style="margin:0">${done} orders served here</p>
      <button class="btn ${open ? 'berry' : ''}" data-shop="${config.id}" data-station="${st.id}" ${open ? '' : 'disabled'}>${open ? 'Open for business' : st.skills.length ? 'Locked' : 'Coming soon'}</button>${quizCard}</div>`;
  }).join('');
}
$('#stations').addEventListener('click', e => {
  const unitTest = e.target.closest('[data-unit-test]');
  if (unitTest && !unitTest.disabled) { void startAssessment(unitTest.dataset.shop, null); return; }
  const review = e.target.closest('[data-review-key]');
  if (review && !review.disabled) { void startShift(review.dataset.shop, +review.dataset.reviewStation, review.dataset.reviewKey); return; }
  const quiz = e.target.closest('[data-quiz]');
  if (quiz && !quiz.disabled) { void startAssessment(quiz.dataset.shop, +quiz.dataset.quiz); return; }
  const station = e.target.closest('[data-station]');
  if (station && !station.disabled) void startShift(station.dataset.shop, +station.dataset.station);
});

/* ---------- shift engine ---------- */
let shift = null, order = null;
let patienceTimer = null;
function resetTown(resetAt){
  const me = Backend.me;
  S = Object.assign(fresh(), {name:me?.name || S.name, minStation:me?.min_station || S.minStation || 1, resetSeen:resetAt});
}
async function startShift(shop, station, reviewKey = null){
  const config = SHOPS[shop] || SHOPS.cafe;
  await Backend.refreshSettings();
  const resetAt = Backend.me?.reset_at, resetMs = resetAt ? Date.parse(resetAt) : NaN;
  if (resetAt && Number.isFinite(resetMs) && resetMs > (Date.parse(S.resetSeen || '') || 0)) {
    resetTown(resetAt); save(); toast('Your teacher reset your town. Fresh start!'); show('home'); return;
  }
  shift = {shop:config.id, station, mode:'practice', reviewKey, n:0, total:5, earned:0, perfect:0, missed:[], power:S.power, practiced:new Set(), drillMisses:new Set(), popups:0, lastSkill:null};
  $('#helperPet').textContent = petEmoji();
  $('#shiftStation').textContent = config.emoji + ' ' + config.name + ' · ' + config.stations[station-1].emoji + ' ' + config.stations[station-1].name;
  $('#leaveShift').textContent = config.id === 'bakery' ? 'Close the bakery early' : 'Close the café early';
  show('shift'); nextCustomer();
}
async function startAssessment(shop, station){
  const config = SHOPS[shop]; if (!config) return;
  const isTest = station == null, stationConfig = isTest ? null : config.stations.find(st => st.id === station);
  const skills = isTest ? config.stations.flatMap(st => st.skills) : stationConfig?.skills || [];
  if (!skills.length) return;
  await Backend.refreshSettings();
  const settings = quizSettings(Backend.me ? Backend.me.quiz_settings : S.quizSettings || QUIZ_DEFAULTS);
  const plan = isTest
    ? assessmentPlan(skills, settings.testPerSkill, settings.testMin, settings.testMax)
    : assessmentPlan(skills, settings.quizPerSkill, settings.quizMin, settings.quizMax);
  if (!plan.length) return;
  shift = {shop:config.id, station, mode:isTest ? 'test' : 'quiz', plan, results:[], settings, showSteps:settings.showSteps,
    n:0, total:plan.length, earned:0, perfect:0, missed:[], power:S.power, practiced:new Set(), drillMisses:new Set(), popups:0, lastSkill:null};
  $('#helperPet').textContent = petEmoji();
  $('#shiftStation').textContent = isTest ? `${config.emoji} ${config.name} · Unit Test` : `${config.emoji} ${config.name} · ${stationConfig.emoji} ${stationConfig.name}`;
  $('#leaveShift').textContent = isTest ? 'Leave the test' : 'Leave the quiz';
  show('shift'); nextCustomer();
}
function renderDots(){
  if (shift.mode === 'quiz' || shift.mode === 'test') {
    $('#dots').textContent = `Question ${shift.n} of ${shift.total}`;
    $('#dots').setAttribute('aria-label', 'Assessment progress');
    return;
  }
  $('#dots').setAttribute('aria-label', 'Customers served');
  let h = ''; for (let i=1;i<=shift.total;i++) h += `<i class="${i < shift.n ? 'done' : i === shift.n ? 'now' : ''}"></i>`; $('#dots').innerHTML = h;
}
function setHelper(msg){ $('#helperSay').textContent = petName() + ': ' + msg; }
function startPatience(seconds, fromPct, showStartCue = false){
  const p = $('#patience'), label = $('#patienceLabel'), total = order && order.limit || seconds;
  if (patienceTimer) clearInterval(patienceTimer);
  const endAt = performance.now() + seconds * 1000;
  const cueUntil = showStartCue ? performance.now() + 600 : 0;
  const tick = () => {
    const left = Math.max(0, (endAt - performance.now()) / 1000), pct = Math.max(0, left / total);
    p.classList.toggle('tip-warn', pct <= .5 && pct > .2); p.classList.toggle('tip-danger', pct <= .2);
    label.textContent = cueUntil && performance.now() < cueUntil ? '⏱ Speed bonus running' : left > 0 ? `⏱ ${Math.ceil(left)}s for a speed bonus` : 'No speed bonus, but take your time!';
    if (!left) { clearInterval(patienceTimer); patienceTimer = null; }
  };
  p.classList.remove('tip-warn','tip-danger'); p.style.transition = 'none'; p.style.width = (fromPct == null ? 100 : fromPct) + '%'; void p.offsetWidth;
  p.style.transition = `width ${seconds}s linear`; p.style.width = '0%'; tick(); patienceTimer = setInterval(tick, 100);
}
function freezePatience(){ const p = $('#patience'); if (patienceTimer) { clearInterval(patienceTimer); patienceTimer = null; } const w = getComputedStyle(p).width; p.style.transition = 'none'; p.style.width = w; }
function chooseSkill(){
  const W = {new:3, struggling:5, practicing:3, mastered:1};
  const skills = shift.reviewKey ? reviewSkillsNeeded(shift.reviewKey) : SHOPS[shift.shop].stations[shift.station-1].skills;
  let list = skills.filter(s => s !== shift.lastSkill); if (!list.length) list = skills;
  return weightedPick(list, s => W[skillStatus(s)]);
}
function cancelReadFirst(target){
  if (!target) return;
  if (target.readTimer) { clearTimeout(target.readTimer); target.readTimer = null; }
  if (target.readyTimer) { clearTimeout(target.readyTimer); target.readyTimer = null; }
  if (target.readyKey) { document.removeEventListener('keydown', target.readyKey); target.readyKey = null; }
}
function stopOrderSpeech(){
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel(); if (order) order.speaking = false;
}
function readOrder(){
  if (!order || typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return;
  if (order.speaking) { stopOrderSpeech(); return; }
  const currentOrder = order, utterance = new SpeechSynthesisUtterance(currentOrder.p.bubble);
  utterance.rate = .95; currentOrder.speaking = true;
  utterance.onend = () => { if (order === currentOrder) currentOrder.speaking = false; };
  utterance.onerror = utterance.onend;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}
function ticketHTML(text){
  const bold = s => s.replace(/(&#?[a-z0-9]+;)|(\d+(?:\.\d+)?)/gi, (m, ent, num) => ent ? ent : `<b>${num}</b>`);
  const safe = esc(text);
  const parts = (safe.match(/(?:[^.!?]|[.!?](?=\S))+[.!?]*/g) || [safe]).map(s => s.trim()).filter(Boolean);   // a point inside a number (2.4) is not the end of a sentence
  let qi = -1; parts.forEach((s, i) => { if (s.endsWith('?')) qi = i; });
  const story = parts.filter((_, i) => i !== qi).join(' ');
  return (story ? `<div class="ticket-story">${bold(story)}</div>` : '') +
    (qi >= 0 ? `<div class="ticket-find">❓ Find: ${bold(parts[qi])}</div>` : '');
}
function nextCustomer(){
  if (shift.mode === 'practice' && shift.reviewKey && reviewComplete(shift.reviewKey)) { endShift(); return; }
  if (shift.n >= shift.total) { endShift(); return; }
  stopOrderSpeech(); cancelReadFirst(order);
  shift.n++; renderDots();
  const c = pick(CUSTOMERS), assessment = shift.mode === 'quiz' || shift.mode === 'test';
  const sk = assessment ? shift.plan[shift.n-1] : chooseSkill(); shift.lastSkill = sk;
  const p = GEN[sk](assessment ? Math.max(2, lvlOf(sk)) : lvlOf(sk)); p.skill = sk;
  if (assessment && !shift.showSteps) p.steps = answerStepsFor(p);
  order = {p, cust:c, i:0, tries:0, hints:0, missed:[], done:false, start:null, pending:null, readTimer:null, speaking:false, assessmentCorrect:true};
  const ce = $('#custEmoji'); ce.textContent = c[0]; ce.classList.remove('enter'); void ce.offsetWidth; ce.classList.add('enter');
  $('#custName').textContent = c[1];
  const plan = p.steps.map((st, i) => `<span class="chip${i === 0 ? ' now' : ''}" data-plan-step="${i}">${i + 1}. ${esc(st.name)}</span>`).join('<span class="plan-arrow" aria-hidden="true">→</span>');
  $('#custBubble').textContent = pick(['Here\'s my order!','Order up, please!','Can you help me with this one?']);
  if (!assessment) setHelper(p.helper || 'Take it one step at a time.');
  $('#board').innerHTML = `<div class="board-title">${esc(p.title)}</div><div class="skill-tag">${esc(SKILLS[sk].name)}</div>
    <div class="ticket"><div class="ticket-customer"><span>${c[0]}</span><b>${esc(c[1])}</b></div><div id="ticketText"></div><button class="ticket-read" id="readOrderBtn" type="button" hidden>🔊 Read it to me</button></div>
    <div class="plan" id="plan" aria-label="Order plan"${assessment && !shift.showSteps ? ' hidden' : ''}>${plan}</div>
    <div class="visual">${p.visual}</div><div class="done-list" id="doneList"></div>
    <div class="step-prompt" id="stepPrompt"></div><div class="step-input" id="stepInput"></div><div class="chalk-note" id="chalkNote" aria-live="polite"></div>`;
  $('#ticketText').innerHTML = ticketHTML(p.bubble);
  const readButton = $('#readOrderBtn');
  if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) { readButton.hidden = false; readButton.addEventListener('click', readOrder); }
  $('#boardActions').innerHTML = '<button class="btn berry" id="checkBtn">Check</button><button class="btn" id="hintBtn">Hint</button>';
  $('#hintBtn').hidden = assessment;
  $('#patience').parentElement.hidden = assessment;
  $('#patienceLabel').hidden = assessment;
  $('#helperPet').parentElement.hidden = assessment;
  $('#checkBtn').addEventListener('click', checkCurrent);
  $('#hintBtn').addEventListener('click', hint);
  const svg = $('#gridsvg');
  if (svg) svg.addEventListener('click', e => {
    const c = e.target.closest('.ghit'); if (!c) return;
    const st = order.p.steps[order.i]; if (!st || st.kind !== 'grid' || order.done) return;
    submit([+c.dataset.x, +c.dataset.y]);
  });
  order.limit = p.steps.length * 12;
  const currentOrder = order;
  activateStep(0);
  if (assessment) return;
  const settings = drillSettings(), readingSeconds = settings.readSeconds * (settings.timeScale || 1);
  const startTiming = () => {
    if (order !== currentOrder || order.done) return;
    const startedAt = performance.now();
    order.start = startedAt; order.p.steps[0].t0 = startedAt; order.p.steps[order.i].t0 = startedAt;
    const patience = $('#patience'); patience.classList.remove('reading','tip-warn','tip-danger','start-pulse'); void patience.offsetWidth; patience.classList.add('start-pulse');
    startPatience(order.limit, undefined, true);
  };
  const patience = $('#patience'); patience.classList.remove('reading','tip-warn','tip-danger','start-pulse'); patience.style.transition = 'none'; patience.style.width = '100%';
  if (readingSeconds > 0) {
    order.readTimer = setTimeout(startTiming, readingSeconds * 1000);
    patience.classList.add('reading');
    $('#patienceLabel').textContent = '📖 Reading time: take a look at the order.';
  } else startTiming();
}
const slotEl = id => document.querySelector(`#board [data-slot="${id}"]`);
function numInput(id, label){ return `<input class="cell" id="${id}" inputmode="decimal" autocomplete="off" maxlength="8" aria-label="${esc(label)}">`; }
function wireNum(inp, onEnter){
  inp.addEventListener('input', () => { inp.value = inp.value.replace(/[^\d.]/g,''); inp.classList.remove('wrong'); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); onEnter(); } });
}
function numberPad(input, onSubmit, {decimal = false} = {}){
  if (!matchMedia('(pointer: coarse)').matches) return null;
  const existing = input.nextElementSibling;
  if (existing?.classList.contains('number-pad')) { existing.hidden = false; return existing; }
  input.setAttribute('inputmode', 'none');            // no phone keyboard over the pad, but a real keyboard still types
  const pad = document.createElement('div'); pad.className = 'number-pad'; pad.setAttribute('aria-label', 'Number pad');
  const keys = ['7','8','9','4','5','6','1','2','3','⌫','0']; if (decimal) keys.push('.'); keys.push('✓');
  keys.forEach(key => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'number-key'; button.textContent = key;
    button.setAttribute('aria-label', key === '⌫' ? 'Delete' : key === '✓' ? 'Check' : key);
    button.addEventListener('click', () => {
      sfx('tick');
      if (key === '⌫') input.value = input.value.slice(0, -1);
      else if (key !== '✓' && (key !== '.' || !input.value.includes('.'))) input.value += key;
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
    if (st.slot) { const sl = slotEl(st.slot); sl.classList.add('active'); sl.innerHTML = html; } else box.innerHTML = (st.work ? `<div class="step-work">${st.work}</div>` : '') + html;
    const inp = $('#cur'); wireNum(inp, checkCurrent); setTimeout(() => inp.focus(), 40);
  } else if (st.kind === 'ratio') {
    box.innerHTML = `<span class="rlbl">${st.labels[0]}</span>${numInput('curA','first number')}<span class="colon">:</span>${numInput('curB','second number')}<span class="rlbl">${st.labels[1]}</span>`;
    wireNum($('#curA'), () => { if (!$('#curB').value) $('#curB').focus(); else checkCurrent(); });
    wireNum($('#curB'), checkCurrent);
    setTimeout(() => $('#curA').focus(), 40);
  } else if (st.kind === 'choice') {
    box.innerHTML = `<div class="opts">${st.options.map((o,k) => `<button class="opt" data-k="${k}"><span class="okey" aria-hidden="true">${k + 1}</span>${o.html}</button>`).join('')}</div>`;
    box.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { if (!b.disabled) submit(+b.dataset.k); }));
    setTimeout(() => { const f = box.querySelector('.opt'); if (f) f.focus(); }, 40);
  } else if (st.kind === 'grid') {
    box.innerHTML = `<span style="font-size:1.1rem">Or type it: (</span>${numInput('gx','x')}<span>,</span>${numInput('gy','y')}<span>)</span>`;
    wireNum($('#gx'), () => $('#gy').focus()); wireNum($('#gy'), checkCurrent);
  } else if (st.kind === 'digits') {
    box.innerHTML = digitBoxesHTML(st.dig);
    const digs = $$('#stepInput input.dig'), move = (inp, dir) => { const k = digs.indexOf(inp) + dir; if (digs[k]) { digs[k].focus(); digs[k].select(); } };
    digs.forEach(inp => {
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(-1); inp.classList.remove('wrong'); if (inp.value) move(inp, -1); });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); checkCurrent(); }
        else if (e.key === 'Backspace' && !inp.value) { e.preventDefault(); move(inp, 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); move(inp, -1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); move(inp, 1); }
      });
    });
    $$('#stepInput input.carry').forEach(inp => inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); }));
    setTimeout(() => digs[digs.length - 1].focus(), 40);
  } else if (st.kind === 'mulrow' || st.kind === 'ldiv') {
    box.innerHTML = st.kind === 'mulrow' ? mulRowsHTML(st) : ldivHTML(st);
    wireRegBoxes();
  } else if (st.kind === 'qr') {
    box.innerHTML = `${numInput('qrQ', 'quotient')}<span class="colon">R</span>${numInput('qrR', 'remainder')}`;
    wireNum($('#qrQ'), () => { if (!$('#qrR').value) $('#qrR').focus(); else checkCurrent(); });
    wireNum($('#qrR'), checkCurrent);
    setTimeout(() => $('#qrQ').focus(), 40);
  } else if (st.kind === 'frac') {
    const fin = (id, label) => `<input class="cell sm" id="${id}" inputmode="numeric" autocomplete="off" maxlength="4" aria-label="${label}">`;
    box.innerHTML = `<span class="fracin">${fin('fracW','whole number (leave empty if none)')}<span class="fstack">${fin('fracN','top number')}<span class="fbar"></span>${fin('fracD','bottom number')}</span></span><span class="frac-tip">Whole number box: fill only if you need it.</span>`;
    const [w, n, d] = ['#fracW', '#fracN', '#fracD'].map(id => $(id));
    [w, n, d].forEach(inp => {
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); inp.classList.remove('wrong'); });
      inp.addEventListener('keydown', e => { if (e.key !== 'Enter') return; e.preventDefault();
        if (inp === w && !n.value && !d.value && w.value) checkCurrent(); else if (inp !== d && !(inp === w ? n : d).value) (inp === w ? n : d).focus(); else checkCurrent(); });
    });
    setTimeout(() => n.focus(), 40);
  }
}
function readCurrent(st){
  const num = id => { const el = $(id); if (!el || el.value === '') return null; const n = Number(el.value); return isNaN(n) ? null : n; };
  if (st.kind === 'num') return num('#cur');
  if (st.kind === 'ratio') { const a = num('#curA'), b = num('#curB'); return (a === null || b === null) ? null : [a, b]; }
  if (st.kind === 'grid') { const x = num('#gx'), y = num('#gy'); return (x === null || y === null) ? null : [x, y]; }
  if (st.kind === 'digits') {
    const val = p => ($(`#stepInput input.dig[data-p="${p}"]`) || {}).value || '';
    let w = ''; for (let i = st.dig.W - 1; i >= 0; i--) { const c = val('i' + i); if (!c && w) return null; w += c; }
    let f = ''; for (let i = 0; i < st.dig.F; i++) { const c = val('f' + i); if (!c) return null; f += c; }
    return Number(`${w || '0'}${f ? '.' + f : ''}`);
  }
  if (st.kind === 'mulrow' || st.kind === 'ldiv') return readRegBoxes(st);
  if (st.kind === 'qr') { const q = num('#qrQ'), r = num('#qrR'); return (q === null || r === null) ? null : [q, r]; }
  if (st.kind === 'frac') {
    const w = num('#fracW'), n = num('#fracN'), d = num('#fracD');
    if (n === null && d === null) return w === null ? null : [w, 0, 1];
    return (n === null || d === null) ? null : [w || 0, n, d];
  }
  return null;
}
function checkCurrent(){
  if (!order || order.done || pr) return;
  const st = order.p.steps[order.i], v = readCurrent(st);
  if (v === null) { const f = $('#cur') || $('#curA') || $('#gx') || ['#qrQ', '#qrR'].map(id => $(id)).find(el => el && !el.value) || ['#fracN', '#fracD'].map(id => $(id)).find(el => el && !el.value) || $$('#stepInput input.dig').reverse().find(el => !el.value); if (f) f.focus(); return; }
  submit(v);
}
const fmtV = (v, st) => st.kind === 'frac' ? FRAC.fmt(v) : st.kind === 'qr' && Array.isArray(v) ? `${v[0]} R ${v[1]}` : st.kind === 'choice' ? (st.options[v] ? st.options[v].text : '?') : Array.isArray(v) ? (st.kind === 'grid' ? `(${v[0]}, ${v[1]})` : `${v[0]}:${v[1]}`) : String(v);
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
  Backend.log('attempts', {mode:shift.mode || 'practice', shop:shift.shop, skill:order.p.skill, step:st.name, step_type:STEP_TYPE[st.type] || 'setup',
    correct:ok, first_try:first, slow, answer:String(fmtV(v, st)).slice(0,60), expected:String(right).slice(0,60),
    misconception:misId || null, context:context ? context.slice(0,300) : null,
    fact_a:st.fact ? st.fact.x : null, fact_b:st.fact ? st.fact.y : null, fact_div:st.fact ? !!st.fact.div : null, ms:Math.round(ms)});
}
function completeAssessmentQuestion(correct, delay = 0){
  if (!order || !shift || (shift.mode !== 'quiz' && shift.mode !== 'test')) return;
  const currentOrder = order;
  currentOrder.done = true;
  shift.results.push({skill:currentOrder.p.skill, correct});
  save();
  const next = () => {
    if (order !== currentOrder || !shift) return;
    if (shift.n < shift.total) { nextCustomer(); return; }
    finishAssessment();
  };
  if (delay) setTimeout(next, delay); else next();
}
function finishAssessment(){
  if (!shift || (shift.mode !== 'quiz' && shift.mode !== 'test')) return;
  const finished = shift, shop = finished.shop, station = finished.station, config = SHOPS[shop];
  const result = gradeAssessment(finished.results, finished.settings), key = assessKey(shop, station);
  const previous = S.quizzes[key] || {}, percent = Math.round(100 * result.score / result.total);
  S.quizzes[key] = {passed:result.passed, best:Math.max(previous.best || 0, percent), tries:(previous.tries || 0) + 1, lastAt:Date.now()};
  if (result.passed) delete S.review[key];
  else startReview(S, key, result.review, finished.settings);
  Backend.log('assessments', {shop, station, kind:finished.mode, score:result.score, total:result.total, passed:result.passed, missed_skills:result.missed});
  const payout = result.passed ? (finished.mode === 'test' ? 150 : 50) : 10;
  if (finished.mode === 'test' && result.passed) checkUnlocks({announce:true});
  if (finished.mode === 'test' && result.passed) {
    const next = nextBuilding(shop);
    if (next && unitOpen(next.id)) setTimeout(() => toast(`${next.emoji} The ${next.name} is open!`), 900);
  }
  S.coins += payout; save(); updateHeader();
  const skillIds = [...new Set(finished.plan)];
  const skillRows = skillIds.map(skill => {
    const correct = finished.results.filter(item => item.skill === skill).every(item => item.correct);
    return `<li>${correct ? '✓' : '✗'} ${esc(SKILLS[skill].name)}${!correct && result.passed ? ' <span class="muted">Keep practicing</span>' : ''}</li>`;
  }).join('');
  const reviewStation = station ?? config.stations.find(st => st.skills.some(skill => result.review.includes(skill)))?.id ?? 1;
  const reviewButton = !result.passed && !reviewComplete(key) ? '<button class="btn berry" id="reviewAssessment">Review practice</button>' : '';
  const retakeButton = !result.passed && reviewComplete(key) ? '<button class="btn" id="retakeAssessment">Retake</button>' : '';
  $('#summaryCard').innerHTML = `<div class="big-emoji">${result.passed ? '✅' : '📝'}</div><h2>${finished.mode === 'test' ? 'Unit Test' : 'Station Quiz'} ${result.passed ? 'passed' : 'complete'}</h2>
    <p>Score: <b>${result.score} of ${result.total} (${percent}%)</b></p><p>${result.passed ? `You earned ${payout} 🪙.` : `You earned ${payout} 🪙. Practice the missed skills before your retake.`}</p>
    <ul class="list">${skillRows}</ul><div class="row">${reviewButton}${retakeButton}<button class="btn" id="backToAssessmentShop">Back to the shop</button></div>`;
  shift = null; order = null; currentShop = shop;
  show('summary');
  if (finished.mode === 'test' && result.passed) setTimeout(showNextUnlock, 0);
  if (!result.passed && !reviewComplete(key)) $('#reviewAssessment').addEventListener('click', () => { void startShift(shop, reviewStation, key); });
  if (!result.passed && reviewComplete(key)) $('#retakeAssessment').addEventListener('click', () => { void startAssessment(shop, station); });
  $('#backToAssessmentShop').addEventListener('click', () => show('cafe'));
}
function submit(v){
  if (!order || order.done || order.assessmentPending || pr) return;
  const st = order.p.steps[order.i], first = !st.tried; st.tried = true;
  let ok;
  if (st.kind === 'choice') ok = !!(st.options[v] && st.options[v].ok);
  else ok = st.eq ? st.eq(v) : v === st.answer;
  const timingStarted = order.start !== null, ms = timingStarted ? performance.now() - st.t0 : 0;
  if (first && timingStarted && st.type !== 'setup') recordPace(STEP_TYPE[st.type], ms);
  const slow = timingStarted && ok && first && st.type !== 'setup' && ms > slowLimit(STEP_TYPE[st.type]);
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
  if (shift.mode === 'quiz' || shift.mode === 'test') {
    order.assessmentPending = true;
    const note = $('#chalkNote'); note.className = 'chalk-note'; note.textContent = 'Answer saved';
    if (!ok) {
      order.assessmentCorrect = false;
      completeAssessmentQuestion(false, 500);
      return;
    }
    stepRight(st, v, {quiet:true});
    save();
    const currentOrder = order;
    setTimeout(() => {
      if (order !== currentOrder || !shift) return;
      currentOrder.assessmentPending = false;
      const j = nextStepIndex(true);
      if (j < currentOrder.p.steps.length) activateStep(j);
      else completeAssessmentQuestion(currentOrder.assessmentCorrect);
    }, 500);
    return;
  }
  if ((!ok || slow) && st.type !== 'setup') {
    if (first) order.missed.push(`${SKILLS[order.p.skill].name}: ${st.name.toLowerCase()}`);
    if ((!ok ? first : !st.slowOK)) queueDrill(st, ok ? 'slow' : 'miss', misId);
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
function stepRight(st, v, {quiet = false} = {}){
  order.lastV = v;
  if (!quiet) {
    const note = $('#chalkNote'); note.className = 'chalk-note good'; note.textContent = pick(['Yes!','Nice!','Correct!','You got it!']);
    const planStep = $(`#plan [data-plan-step="${order.i}"]`); if (planStep) planStep.classList.add('done');
  }
  if (st.slot) { const sl = slotEl(st.slot); sl.classList.remove('active'); sl.classList.add('filled'); sl.innerHTML = `<span class="slotval">${fmtV(v, st)}</span>`; }
  else if (st.kind === 'choice') {
    if (!quiet) {
      $$('#stepInput .opt').forEach((b,k) => { b.disabled = true; if (k === v) b.classList.add('yes'); });
      $('#doneList').insertAdjacentHTML('beforeend', `<div>✓ ${esc(st.name)}: ${esc(st.options[v].text)}</div>`);
    }
  } else if (!quiet && st.kind !== 'mulrow' && st.kind !== 'ldiv') $('#doneList').insertAdjacentHTML('beforeend', `<div>✓ ${esc(st.name)}: ${esc(fmtV(v, st))}</div>`);   // the layout already shows these
  if (st.kind === 'grid') plotDot(v, 'gdot');
  if (!quiet && (st.kind === 'mulrow' || st.kind === 'ldiv') && !order.p.steps.slice(order.i + 1).some(x => x.kind === st.kind && !(x.skipIf && x.skipIf(v))))
    $('#doneList').insertAdjacentHTML('beforeend', `<div class="reg-done">${regDoneHTML(st, v)}</div>`);
  if (st.fill) $$('#board ' + st.fill.sel).forEach(b => { b.textContent = st.fill.text; b.classList.add('filled'); });
  if (!quiet) sfx('good');
}
function stepWrong(st, v, misId){
  order.tries++; S.streak = 0;
  const note = $('#chalkNote'); note.className = 'chalk-note oops';
  note.textContent = (misId && MIS[misId]) ? MIS[misId].kid : 'Not quite. Try again, or tap Hint.';
  if (st.kind === 'digits') {
    const bad = wrongDigitCols(st.dig);
    bad.forEach(inp => { inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); });
    if (bad.length) note.textContent += ` Check the ${placeOf(bad[0].dataset.p)} column.`;
  }
  if (st.kind === 'mulrow' || st.kind === 'ldiv') wrongRegBoxes(st).forEach(inp => { inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); });
  if (st.kind === 'choice') { const b = $$('#stepInput .opt')[v]; if (b) { b.disabled = true; b.classList.add('no'); } }
  else if (st.kind === 'grid') plotDot(v, 'gbad');
  $$('#board input.cell').forEach(inp => { inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); });
  sfx('bad'); refocus(st);
}
function refocus(st){
  if (st.kind === 'choice') { const b = $$('#stepInput .opt').find(x => !x.disabled); if (b) b.focus(); return; }
  const el = $('#cur') || $('#curA') || $('#gx') || $('#qrQ') || $('#fracN') || $('#stepInput input.dig.wrong') || $$('#stepInput input.dig').pop(); if (el) { el.focus(); if (el.select) el.select(); }
}
/* next step to show; a step with skipIf is passed over when the step before already did its job */
function nextStepIndex(quiet){
  const steps = order.p.steps;
  let j = order.i + 1;
  while (j < steps.length && steps[j].skipIf && steps[j].skipIf(order.lastV)) {
    if (!quiet) {
      const chip = $(`#plan [data-plan-step="${j}"]`); if (chip) chip.classList.add('done');
      $('#doneList').insertAdjacentHTML('beforeend', `<div>✓ ${esc(steps[j].name)}: already done</div>`);
    }
    j++;
  }
  return j;
}
function advance(){ const j = nextStepIndex(false); if (j < order.p.steps.length) activateStep(j); else completeOrder(); }
function hint(){
  if (!order || order.done) return;
  const st = order.p.steps[order.i]; order.hints++;
  setHelper(st.hint ? st.hint() : 'Read the question again, one part at a time.'); sfx('tick'); refocus(st);
}
function queueDrill(st, reason, misId){
  if (order.pending) return;
  let drill;
  if (st.storyDrill && misId && st.storyDrill.mis.includes(misId)) drill = {type:'story', key:st.storyDrill.key, reason};   // the story was misread, not the fact
  else if (st.drill) drill = {...st.drill, key:String(st.drill.key), reason};
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
  stopOrderSpeech(); const wasReading = order.start === null; cancelReadFirst(order); order.done = true; freezePatience();
  if (wasReading) { const patience = $('#patience'); patience.classList.remove('reading','start-pulse','tip-warn','tip-danger'); patience.style.width = '100%'; $('#patienceLabel').textContent = ''; }
  const p = order.p, perfect = order.tries === 0 && order.hints === 0;
  recordProblem(p.skill, perfect);
  reviewCredit(S, p.skill, perfect);
  const stations = SHOPS[shift.shop].stations, progress = shopProgress(shift.shop);
  const before = stations.map(s => stationOpen(shift.shop, s.id));
  progress.st[shift.station] = (progress.st[shift.station]||0) + 1;
  const secs = order.start === null ? 0 : (performance.now() - order.start) / 1000;
  S.timeMs += Math.min(secs, 300) * 1000;
  let tip = 4 + p.steps.length*2 + Math.max(0, Math.round(6 * (1 - secs/order.limit)));
  if (perfect) { S.streak++; tip += Math.min(5, S.streak); S.perfect++; shift.perfect++; }
  else tip = Math.max(3, tip - order.tries - order.hints);
  S.bestStreak = Math.max(S.bestStreak || 0, S.streak);
  tip = Math.round(tip * shift.power);
  S.coins += tip; S.orders++; shift.earned += tip; shift.missed.push(...order.missed);
  checkUnlocks({announce:true});
  if (shift.mode === 'practice') Backend.log('problems', {shop:shift.shop, station:shift.station, skill:p.skill, perfect, steps:p.steps.length, secs:Math.round(secs)});
  save(); updateHeader();
  const n = $('#chalkNote'); n.className = 'chalk-note good';
  n.textContent = perfect ? 'Perfect order!' + (S.streak > 1 ? ` ${S.streak} in a row!` : '') : 'Order up!';
  $('#stepPrompt').innerHTML = ''; $('#stepInput').innerHTML = '';
  $('#custBubble').textContent = pick(['Yum! That looks perfect.','Wow, just right!','My friends are going to love this!','Thank you so much!']) + ` Here's ${tip} 🪙`;
  sfx('coin'); coinBurst($('#board'), Math.ceil(tip/3));
  stations.forEach((s,i) => { if (!before[i] && stationOpen(shift.shop, s.id)) setTimeout(() => toast(`New station open: ${s.name}!`), 900); });
  const last = shift.n >= shift.total;
  $('#boardActions').innerHTML = `<button class="btn mint" id="nextBtn">${last ? 'Close up for the day' : 'Next customer'}</button>`;
  $('#nextBtn').addEventListener('click', nextCustomer); setTimeout(() => $('#nextBtn').focus(), 60); setTimeout(showNextUnlock, 0);
}
function endShift(){
  const pw = shift.power; S.day++; S.power = 1; save(); updateHeader(); Backend.flush();
  const miss = [...new Set(shift.missed)];
  const shop = shift.shop, config = SHOPS[shop];
  const reviewKey = shift.reviewKey, reviewFinished = !!reviewKey && reviewComplete(reviewKey);
  const retakeStation = reviewKey?.endsWith(':test') ? null : Number(reviewKey?.slice(reviewKey.lastIndexOf(':') + 1));
  const retakeLabel = reviewKey?.endsWith(':test') ? 'Retake unit test' : 'Retake quiz';
  $('#summaryCard').innerHTML = `<div class="big-emoji">🌙</div><h2>${config.name} closed for the day</h2>
    <p>You earned <b>${shift.earned}</b> coins${pw > 1 ? ` with a ×${fmtPow(pw)} sprint boost` : ''}.</p>
    <p>Perfect orders: <b>${shift.perfect}</b> of ${shift.total}</p>
    ${miss.length ? `<p class="muted">Keep practicing</p><div class="factchips">${miss.map(m => `<span>${esc(m)}</span>`).join('')}</div>` : '<p>No mistakes today. Amazing!</p>'}
    <div class="row">${reviewFinished ? `<button class="btn berry" id="sumRetakeQuiz">${retakeLabel}</button>` : '<button class="btn berry" id="sumAgain">Another shift</button>'}<button class="btn" data-go="home">Back to town</button></div>`;
  const station = shift.station, nextButton = reviewFinished ? '#sumRetakeQuiz' : '#sumAgain'; shift = null; currentShop = shop;
  show('summary');
  if (reviewFinished) $('#sumRetakeQuiz').addEventListener('click', () => { void startAssessment(shop, retakeStation); });
  else $('#sumAgain').addEventListener('click', () => { void startShift(shop, station, reviewKey); });
  sfx('good'); setTimeout(() => $(nextButton).focus(), 60);
}
$('#leaveShift').addEventListener('click', () => {
  if (shift && (shift.mode === 'quiz' || shift.mode === 'test')) {
    const name = shift.mode === 'test' ? 'test' : 'quiz';
    if (!confirm(`Leave the ${name}? Your answers won't count. You'll start fresh next time.`)) return;
    stopOrderSpeech(); cancelReadFirst(order); currentShop = shift.shop; shift = null; order = null; show('cafe'); return;
  }
  stopOrderSpeech(); cancelReadFirst(order); freezePatience(); const patience = $('#patience'); patience.classList.remove('reading','start-pulse','tip-warn','tip-danger'); patience.style.width = '100%'; $('#patienceLabel').textContent = ''; currentShop = shift?.shop || currentShop; shift = null; order = null; show('cafe');
});

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
  },
  placeValue:{
    sprintKeys:['tenths', 'hundredths', 'thousandths'],
    sprintItem(key){
      const row = placeValueRows(key)[0], n = row.label.match(/In ([\d.]+),/)[1];
      return {prompt:`Which digit is in the ${row.place} place of ${n}?`, answer:row.answer, drillId:`placeValue:${row.place}`};
    },
    build(drill, {short = false} = {}){
    const key = drill.key, idx = Math.max(0, PLACE_NAMES.indexOf(key));
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'miss' ? `That one needed the ${key} place. Let's find some ${key} digits!`
        : drill.reason === 'slow' ? `Let's get faster at finding the ${key} place!`
        : `That one needed the ${key} place. Let's find some ${key} digits!`,
      rows: placeValueRows(key).slice(0, short ? 3 : 6),
      targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex];
        return wrongs >= 2 ? `It's ${r.answer}. Type ${r.answer}.` : `Count places after the decimal point: tenths (1st), hundredths (2nd), thousandths (3rd). This one wants the ${r.place}.`;
      },
      finishLine: 'Nice! Decimal places line up by their names.',
      tieLine: `The ${key} place is ${idx} after the decimal point. Tenths, hundredths, thousandths: 1st, 2nd, 3rd.`
    };
    }
  },
  simplify:{
    sprintItem(key){
      const k = +key >= 2 ? +key : rand(2, 5), [top, bot] = coprimePair(5, 9, 1).sort((x, y) => x - y);
      return {prompt:`${top * k}/${bot * k} = ?/${bot}`, answer:String(top), drillId:`simplify:${k}`};
    },
    build(drill, {short = false} = {}){
    const k = Math.max(2, +drill.key || 2), rows = [], seen = new Set();
    for (let t = 0; rows.length < (short ? 3 : 5) && t < 60; t++){
      const [top, bot] = coprimePair(5, 9, 1).sort((x, y) => x - y);
      if (top === bot || seen.has(top + '/' + bot)) continue; seen.add(top + '/' + bot);
      rows.push({label:`${top * k}/${bot * k} = ?/${bot}`, answer:String(top)});
    }
    return {
      title: DRILLS[drill.type].kidTitle(String(k)),
      why: drill.reason === 'slow' ? `Let's get faster at dividing the top and bottom by ${k}.` : `That fraction could still be divided by ${k}. Let's practice!`,
      rows, targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex], top = r.label.split('/')[0];
        return wrongs >= 2 ? `It's ${r.answer}. Type ${r.answer}.` : `Divide the top by ${k}: ${top} ÷ ${k} = ?`;
      },
      finishLine: `You divided top and bottom by ${k} every time! +3 🪙`,
      tieLine: 'Simplest form: keep dividing until no number bigger than 1 goes into both.'
    };
    }
  },
  mixed:{
    sprintItem(key){
      const d = +key >= 2 ? +key : rand(2, 6), w = rand(1, 9), r = rand(1, d - 1);
      return {prompt:`${w * d + r}/${d} = ? and ${r}/${d}`, answer:String(w), drillId:`mixed:${d}`};
    },
    build(drill, {short = false} = {}){
    const d = Math.max(2, +drill.key || 2), rows = [], seen = new Set();
    for (let t = 0; rows.length < (short ? 4 : 6) && t < 60; t++){
      const w = rand(1, 9), r = rand(1, d - 1), top = w * d + r;
      if (seen.has(top)) continue; seen.add(top);
      rows.push({label:`How many wholes in ${top}/${d}?`, answer:String(w)});
      rows.push({label:`${top}/${d} = ${w} and ?/${d}`, answer:String(r)});
    }
    return {
      title: DRILLS[drill.type].kidTitle(String(d)),
      why: drill.reason === 'slow' ? "Let's get faster at pulling out the wholes." : 'That answer had wholes hiding inside it. Let\'s find them!',
      rows, targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex], top = +r.label.match(/(\d+)\/\d+/)[1];
        if (wrongs >= 2) return `It's ${r.answer}. Type ${r.answer}.`;
        return rowIndex % 2 === 0 ? `How many ${d}s fit in ${top}? ${d} × ? is as close to ${top} as you can get without going over.`
          : `Take away the wholes: ${top} − ${d} × ${Math.floor(top / d)} = ?`;
      },
      finishLine: 'You found all the wholes! +3 🪙',
      tieLine: `Divide the top by the bottom. The answer is the whole number, and what's left over goes on top.`
    };
    }
  },
  reciprocal:{
    sprintItem(){
      if (Math.random() < 0.25) { const n = rand(2, 12); return {prompt:`Flip ${n}: 1/?`, answer:String(n), drillId:'reciprocal:flip'}; }
      const [n, d] = properFrac(2, 12); return {prompt:`Flip ${n}/${d}: ?/${n}`, answer:String(d), drillId:'reciprocal:flip'};
    },
    build(drill, {short = false} = {}){
    const rows = [], seen = new Set();
    for (let t = 0; rows.length < (short ? 3 : 6) && t < 80; t++){
      const whole = rows.length === 2, [n, d] = whole ? [rand(2, 9), 1] : properFrac(2, 12);
      if (seen.has(n + '/' + d)) continue; seen.add(n + '/' + d);
      rows.push(whole ? {label:`Flip ${n}. It's 1/?`, answer:String(n)} : {label:`Flip ${n}/${d}. It's ?/${n}`, answer:String(d)});
    }
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'slow' ? "Let's get faster at flipping fractions." : 'To divide by a fraction, you multiply by its flip. Let\'s practice flipping!',
      rows, targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex];
        return wrongs >= 2 ? `It's ${r.answer}. Type ${r.answer}.` : /1\/\?/.test(r.label) ? 'A whole number is over 1. Flip it and it goes on the bottom.' : 'The bottom number moves to the top.';
      },
      finishLine: 'You flipped them all! +3 🪙',
      tieLine: 'Flip means swap the top and bottom. 3/5 flipped is 5/3.'
    };
    }
  },
  lineUp:{
    sprintKeys:['tenths', 'hundredths', 'thousandths'],
    sprintItem(key){
      const place = ['tenths', 'hundredths', 'thousandths'].includes(key) ? key : pick(['tenths', 'hundredths', 'thousandths']), q = lineUpPair(place);
      return {prompt:'Which is lined up correctly?', options:q.options, answer:q.answer, drillId:`lineUp:${place}`, reveal:`${q.a} + ${q.b}: line up the points`};
    },
    build(drill, {short = false} = {}){
    const key = PLACE_NAMES.includes(drill.key) && drill.key !== 'ones' ? drill.key : 'hundredths';
    return {
      title: DRILLS[drill.type].kidTitle(key),
      why: drill.reason === 'slow' ? "Let's make lining up quick, so the adding is easy." : 'Lining up comes first. Let\'s practice it!',
      rows: lineUpRows(key, short ? 2 : 3), targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex];
        if (r.options) return wrongs >= 2 ? 'Pick the one where the decimal points make one straight column.' : 'Look at the decimal points. They must be right on top of each other.';
        if (wrongs >= 2) return `It's ${r.answer}. Type ${r.answer}.`;
        return 'Add zeros at the end until it has as many decimal places as the other number. A whole number gets a point first.';
      },
      finishLine: 'Lined up! +3 🪙',
      tieLine: 'Give both numbers the same number of decimal places, and the points line up by themselves.'
    };
    }
  },
  decimalShift:{
    sprintKeys:['10', '100', '1000'],
    sprintItem(key){
      const row = decimalShiftRows(['10', '100', '1000'].includes(key) ? key : pick(['10', '100', '1000']), 1)[0];
      return {prompt:row.label.replace(/ =$/, ''), answer:row.answer, drillId:`decimalShift:${row.key}`};
    },
    build(drill, {short = false} = {}){
    const key = ['10', '100', '1000'].includes(String(drill.key)) ? String(drill.key) : '10', m = key.length - 1;
    return {
      title: DRILLS[drill.type].kidTitle(key),
      why: drill.reason === 'slow' ? `Let's get faster at moving the decimal point.` : `That one needed the decimal point in the right place. Let's slide it!`,
      rows: decimalShiftRows(key, short ? 4 : 6), targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex];
        return wrongs >= 2 ? `It's ${r.answer}. Type ${r.answer}.` : r.label.includes('×') ? `Times ${key}: the point moves ${m} place${m === 1 ? '' : 's'} to the right. Add zeros if you run out of digits.` : `Divided by ${key}: the point moves ${m} place${m === 1 ? '' : 's'} to the left. Put zeros in front if you need them.`;
      },
      finishLine: 'You slid the point every time! +3 🪙',
      tieLine: `Times ${key} moves the point ${m} to the right. Divided by ${key} moves it ${m} to the left.`
    };
    }
  },
  story:{
    build(drill, {short = false} = {}){
    const rows = storyRows(['divide', 'ratio'].includes(drill.key) ? drill.key : 'addSub', short ? 3 : 4);
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'slow' ? "Let's get quicker at turning stories into math." : 'Every word problem starts by turning the story into math. Let\'s practice just that part!',
      rows, targetIndex: 0,
      hint(rowIndex, wrongs){
        const r = this.rows[rowIndex];
        return wrongs >= 2 ? `It's ${r.options[+r.answer]}.` : r.tip;
      },
      finishLine: 'Story to math, every time! +3 🪙',
      tieLine: drill.key === 'ratio' ? 'Say what is compared, in the order asked. Then ask: how many batches (÷), how many in all (+), or how much for more batches (×)?'
        : 'Find the starting amount first. Then ask: are we putting together, taking away, sharing, or seeing how many fit?'
    };
    }
  }
};
/* rows for the moving-the-decimal drill: × or ÷ by 10, 100, or 1000, answered exactly */
function decimalShiftRows(key, n){
  const m = String(key).length - 1, rows = [], seen = new Set();
  for (let t = 0; rows.length < n && t < 80; t++){
    const x = pick([regDec(0, 9, rand(1, 2)), regDec(10, 99, 1), String(rand(2, 99))]), times = rows.length % 2 === 0;
    const {i, p} = XD.parse(x), ans = times ? (p >= m ? XD.fmt(i, p - m) : String(i * Math.pow(10, m - p))) : XD.fmt(i, p + m);
    if (seen.has(x + times)) continue; seen.add(x + times);
    rows.push({label:`${x} ${times ? '×' : '÷'} ${key} =`, answer:ans, key:String(key)});
  }
  return rows;
}
/* short stories for the story drill; each row: {label, options, answer (index), tip} */
function storyRows(kind, n){
  const rows = [];
  const add = (label, right, wrongs, tip, also) => { const opts = shuffle([right, ...wrongs]); rows.push({label, options:opts, answer:String(opts.indexOf(right)), tip, also}); };
  const ratio = [
    () => { const [a, b] = coprimePair(5, 5, 2), k = rand(2, 6), [x, y] = pick([['cups of flour', 'eggs'], ['lemons', 'cups of sugar'], ['scoops of cocoa', 'cups of milk']]);
      add(`A recipe uses ${a} ${x} for every ${b} ${y}. Today we used ${a * k} ${x}. How many batches is that?`, `${a * k} ÷ ${a}`, [`${a * k} − ${a}`, `${a * k} × ${a}`], 'Batches are how many groups of the recipe fit. Divide, don\'t subtract.'); },
    () => { const [a, b] = coprimePair(5, 5, 2), k = rand(2, 5), [x, y] = pick([['lemons', 'cups of sugar'], ['red beads', 'blue beads'], ['cats', 'dogs']]);
      add(`There are ${a} ${x} for every ${b} ${y}. We make ${k} batches. How many ${y}?`, `${b} × ${k}`, [`${b} + ${k}`, `${a} × ${k}`], `Each batch has ${b} ${y}. ${k} batches means ${k} groups of ${b}.`); },
    () => { const [a, b] = coprimePair(5, 5, 2), [x, y] = pick([['muffins', 'cookies'], ['apples', 'pears'], ['pups', 'kittens']]);
      add(`A platter has ${x} and ${y} in a ${a} to ${b} ratio. How many parts make the whole platter?`, `${a} + ${b}`, [`${a} × ${b}`, `${b}`], 'Part + part = whole.'); },
    () => { const [a, b] = coprimePair(6, 6, 2), [x, y] = pick([['eggs', 'cups of flour'], ['red tiles', 'white tiles'], ['boys', 'girls']]);
      add(`A mix has ${a} ${x} and ${b} ${y}. What is the ratio of ${y} to ${x}?`, `${b} : ${a}`, [`${a} : ${b}`], 'Write the numbers in the order the question asks for them.'); },
    () => { const [a, b] = coprimePair(6, 6, 2), [x, y] = pick([['cats', 'dogs'], ['red marbles', 'green marbles'], ['cupcakes', 'cookies']]);
      add(`We have ${a} ${x} and ${b} ${y}. What is the ratio of ${x} to all of them?`, `${a} : ${a + b}`, [`${a} : ${b}`], `"All of them" is the whole: ${a} + ${b}.`); },
    () => { const [big, small, f] = pick([['feet', 'inches', 12], ['yards', 'feet', 3], ['hours', 'minutes', 60], ['meters', 'centimeters', 100]]), n = rand(2, 9);
      if (Math.random() < 0.5) add(`Change ${n} ${big} into ${small}. There are ${f} ${small} in one of the ${big}.`, `${n} × ${f}`, [`${n} ÷ ${f}`], 'Smaller units means more of them. Multiply.');
      else add(`Change ${n * f} ${small} into ${big}. There are ${f} ${small} in one of the ${big}.`, `${n * f} ÷ ${f}`, [`${n * f} × ${f}`], 'Bigger units means fewer of them. Divide.'); }
  ];
  const makers = kind === 'ratio' ? ratio : kind === 'addSub' ? [
    () => { const a = randDec(2, 15, 2), b = randDec(1, 9, 2); add(`Ana has $${a}. She earns $${b} more. How much does she have now?`, `${a} + ${b}`, [`${a} − ${b}`], 'Earning more puts money together.'); },
    () => { const b = randDec(1, 4, 1), a = randDec(5, 12, 2); add(`A ribbon is ${a} m long. We cut off ${b} m. How much is left?`, `${a} − ${b}`, [`${a} + ${b}`, `${b} − ${a}`], 'Cutting off takes away. Start with the whole ribbon.'); },
    () => { const a = randDec(1, 6, 3), b = randDec(1, 6, 1); add(`One bag of flour weighs ${a} kg and another weighs ${b} kg. How much do they weigh together?`, `${a} + ${b}`, [`${a} − ${b}`], '"Together" means add.'); },
    () => { const b = randDec(1, 9, 2), a = [10, 20][rand(0, 1)] + '.00'; add(`The treats cost $${b}. You pay with $${a}. How much change do you get?`, `${a} − ${b}`, [`${a} + ${b}`, `${b} − ${a}`], 'Change is what is left of the money you paid.'); },
    () => { const a = randDec(3, 9, 1), b = randDec(1, 2, 2); add(`A jug holds ${a} L of lemonade. We pour out ${b} L. How much is still in the jug?`, `${a} − ${b}`, [`${a} + ${b}`], 'Pouring out takes away.'); },
    () => { const a = randDec(1, 5, 1), b = randDec(1, 5, 2); add(`Sam walks ${a} km to the park and then ${b} km to the bakery. How far does he walk?`, `${a} + ${b}`, [`${a} − ${b}`], 'Two trips put together make the whole walk.'); }
  ] : [
    () => { const [a, b] = properFrac(2, 6), d = b * rand(2, 3); add(`We have ${a}/${b} pound of fudge. Each box holds 1/${d} pound. How many boxes can we fill?`, `${a}/${b} ÷ 1/${d}`, [`1/${d} ÷ ${a}/${b}`, `${a}/${b} × 1/${d}`], 'Whole: the fudge. Part: one box. Whole ÷ part.', `${a}/${b} × ${d}`); },
    () => { const [a, b] = properFrac(2, 6), k = rand(2, 5); add(`${a}/${b} of a pan of brownies is shared equally by ${k} friends. How much of the pan does each friend get?`, `${a}/${b} ÷ ${k}`, [`${k} ÷ ${a}/${b}`, `${a}/${b} × ${k}`], `Whole: the brownies. It's split into ${k} equal parts. Whole ÷ number of parts.`, `${a}/${b} × 1/${k}`); },
    () => { const [a, b] = properFrac(2, 5), N = rand(2, 6); add(`We have ${N} cups of batter. Each muffin uses ${a}/${b} cup. How many muffins can we make?`, `${N} ÷ ${a}/${b}`, [`${a}/${b} ÷ ${N}`, `${N} × ${a}/${b}`], 'Whole: the batter. Part: one muffin. Whole ÷ part.', flipText(N, a, b)); },
    () => { const [a, b] = properFrac(2, 6), [c, d] = properFrac(2, 5); add(`What is ${c}/${d} of ${a}/${b} pound of nuts?`, `${c}/${d} × ${a}/${b}`, [`${a}/${b} ÷ ${c}/${d}`], '"Of" a known amount means multiply. No whole is being split into parts.'); },
    () => { const [a, b] = properFrac(2, 6); let c, d; do { [c, d] = properFrac(2, 5); } while (c * b === a * d); add(`${a}/${b} pound of berries fills ${c}/${d} of a tin. How many pounds fill the whole tin?`, `${a}/${b} ÷ ${c}/${d}`, [`${c}/${d} ÷ ${a}/${b}`, `${a}/${b} × ${c}/${d}`], `The whole tin is what we want. We know a part: ${a}/${b} pound is ${c}/${d} of it. Divide by ${c}/${d}.`, flipText(`${a}/${b}`, c, d)); }
  ];
  const order = shuffle(makers.map((m, i) => i));
  for (let i = 0; i < n; i++) makers[order[i % makers.length]]();
  return rows;
}
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
  $('#ladder').innerHTML = model.rows.map((row, i) => `<div class="lrow${i === model.targetIndex ? ' target' : ''}${row.options || row.label.length > 34 ? ' story' : ''}" id="lr${i}"><span>${row.label}</span><span class="ans" id="la${i}"></span></div>`).join('');
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
  if (row.options) {                                   // a choice row: tap the right one
    $('#la'+pr.i).innerHTML = row.options.map((o, k) => `<button class="btn small lopt" type="button" data-k="${k}"><span class="okey" aria-hidden="true">${k + 1}</span>${row.html ? o : esc(o)}</button>`).join('');
    $$('#la' + pr.i + ' .lopt').forEach(b => b.addEventListener('click', () => {
      if (+b.dataset.k === +row.answer) ladderRight(row.rightText || row.options[+row.answer] + (row.also ? ` (same as ${row.also})` : ''));
      else { pr.wrongs++; sfx('bad'); b.disabled = true; $('#prHint').textContent = pr.model.hint(pr.i, pr.wrongs); }
    }));
    const first = $('#la' + pr.i + ' .lopt'); if (first) first.focus(); if (rowEl.scrollIntoView) rowEl.scrollIntoView({block:'nearest'});
    return;
  }
  $('#la'+pr.i).innerHTML = `<input id="lin" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="${esc(row.label)}"><button class="btn small" id="prCheck" type="button">Check</button>`;
  const inp = $('#lin');
  const allowText = /[./-]/.test(row.answer);
  inp.addEventListener('input', () => { inp.value = inp.value.replace(allowText ? /[^\d./-]/g : /\D/g,''); inp.classList.remove('wrong'); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ladderCheck(); } });
  $('#prCheck').addEventListener('click', ladderCheck);
  const pad = numberPad(inp, ladderCheck, {decimal:/\./.test(row.answer)});
  if (/\./.test(row.answer)) inp.classList.add('wide');
  if (pad) $('#prCheck').insertAdjacentElement('afterend', pad);
  inp.focus(); if (rowEl.scrollIntoView) rowEl.scrollIntoView({block:'nearest'});
}
function ladderCheck(){
  const inp = $('#lin'); if (!inp || !inp.value) return;
  const row = pr.model.rows[pr.i], answer = String(row.answer).trim();
  if (inp.value.trim() === answer) ladderRight(answer);
  else {
    pr.wrongs++; sfx('bad'); inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); inp.select();
    $('#prHint').textContent = pr.model.hint(pr.i, pr.wrongs);
  }
}
/* number keys 1 to 9 pick a choice, in orders and in practice pop-ups */
document.addEventListener('keydown', e => {
  if (!/^[1-9]$/.test(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const sel = pr ? '#la' + pr.i + ' .lopt' : (sp && sp.item?.options && !$('#scr-sprint').hidden) ? '#spOpts .opt' : (order && !order.done && order.p.steps[order.i]?.kind === 'choice' && !$('#scr-shift').hidden) ? '#stepInput .opt' : null;
  const b = sel && $$(sel)[+e.key - 1];
  if (b && !b.disabled) { e.preventDefault(); b.click(); }
});
function ladderRight(text){
  $('#la'+pr.i).textContent = text; $('#lr'+pr.i).classList.remove('now'); $('#lr'+pr.i).classList.add('done');
  $('#prHint').textContent = ''; pr.wrongs = 0; sfx(pr.i === pr.model.targetIndex ? 'good' : 'tick');
  if (pr.i + 1 < pr.model.rows.length) { pr.i++; ladderStep(); } else ladderDone();
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
  $('#spOpts').hidden = true; $('#spOpts').innerHTML = '';
  $('#spNote').textContent = 'Answer as many as you can in 60 seconds. Every right answer powers up your tips.';
  renderSprintPick();
  show('sprint'); setTimeout(() => $('#spStart').focus(), 60);
}
/* the student picks which skills go in the sprint; more skills earn more coins */
const sprintCoinsFor = (correct, skills) => Math.round(correct * skills / 2);   // every 2 right answers earn 1 coin per skill picked
function sprintPicked(){
  const types = sprintDrillTypes(), picked = (S.sprintPick || []).filter(t => types.includes(t));
  return picked.length ? picked : [types[0] || 'times'];
}
function renderSprintPick(){
  const types = sprintDrillTypes(), picked = sprintPicked(), wrap = $('#spPick');
  const n = picked.length;
  wrap.innerHTML = `${types.length > 1 ? `<p class="sp-pick-q">Which skills do you want in this sprint?</p>
    <div class="sp-chips">${types.map(t => `<button type="button" class="sp-chip" data-type="${t}" aria-pressed="${picked.includes(t)}">${picked.includes(t) ? '✓ ' : ''}${esc(DRILLS[t].name)}</button>`).join('')}</div>` : ''}
    <p class="sp-bonus">${n} skill${n === 1 ? '' : 's'}: every 2 right answers earn <b>🪙 ${n}</b>${types.length > n ? '. Pick more skills for more coins!' : ''}</p>`;
  $$('#spPick .sp-chip').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.type, cur = sprintPicked();
    S.sprintPick = cur.includes(t) ? (cur.length > 1 ? cur.filter(x => x !== t) : cur) : [...cur, t];
    save(); sfx('tick'); renderSprintPick();
    const again = $(`#spPick .sp-chip[data-type="${t}"]`); if (again) again.focus();
  }));
}
function sprintPad(){ const pad = $('#spInput').nextElementSibling; return pad?.classList.contains('number-pad') ? pad : null; }
function stopSprintTimer(){ if (spTimer) { clearInterval(spTimer); spTimer = null; } }
$('#spStart').addEventListener('click', () => {
  sp = {end:performance.now() + 60000, correct:0, missed:[], slow:[], queue:[], item:null, shown:0, lock:false, hadWrong:false, wrongValue:'', types:sprintPicked()};
  $('#spStartWrap').hidden = true; $('#spInput').hidden = false; $('#spCheck').hidden = false; $('#spNote').textContent = 'Type the answer. It moves on by itself when it\'s right. Press Enter to check a different answer.';
  const pad = $('#spInput').nextElementSibling; if (pad?.classList.contains('number-pad')) pad.hidden = false;
  nextFact(); spTimer = setInterval(sprintTick, 100);
});
function sprintDrillTypes(){
  return Object.keys(DRILL_IMPL).filter(type => {
    if (!DRILL_IMPL[type].sprintItem) return false;       // choice-only pop-ups (stories) stay out of the sprint
    const d = DRILLS[type], unlock = !d.sprintUnlock || (S[d.sprintUnlock.unit]?.st?.[d.sprintUnlock.station] || 0) > 0;
    return unlock && drillTypeOn(drillSettings(), type);
  });
}
function sprintDrillKey(type){
  const keys = Object.keys(S.drillLog).filter(id => id.startsWith(type + ':')).map(id => id.slice(type.length + 1));
  const all = [...new Set([...(DRILL_IMPL[type].sprintKeys || []), ...keys])];   // every place, not only the ones missed before
  if (!all.length) return 'default';
  return weightedPick(all, key => { const log = S.drillLog[type + ':' + key] || {}; return 1 + Math.min(2, (log.miss||0) + (log.slow||0)); });
}
function nextFact(){
  const types = sp.types;
  let type = types[0] || 'times';
  if (types.length > 1) { const others = types.filter(t => t !== sp.lastType); type = pick(others.length ? others : types); }   // take turns, never the same skill twice in a row
  sp.lastType = type;
  sp.item = DRILL_IMPL[type].sprintItem(sprintDrillKey(type)); sp.shown = performance.now(); sp.lock = false; sp.hadWrong = false; sp.wrongValue = '';
  const ft = $('#factText'); ft.classList.remove('oops'); ft.classList.toggle('long', sp.item.prompt.length > 14); ft.textContent = sp.item.prompt;
  const inp = $('#spInput'), opts = $('#spOpts'), choice = !!sp.item.options, pad = sprintPad();
  inp.hidden = choice; $('#spCheck').hidden = choice; if (pad) pad.hidden = choice; opts.hidden = !choice;
  if (choice) {
    opts.innerHTML = sp.item.options.map((o, k) => `<button class="opt" type="button" data-k="${k}"><span class="okey" aria-hidden="true">${k + 1}</span>${o.html}</button>`).join('');
    $$('#spOpts .opt').forEach(b => b.addEventListener('click', () => sprintAnswer(b.dataset.k)));
    const first = $('#spOpts .opt'); if (first) first.focus();
    inp.value = '';
  } else { opts.innerHTML = ''; inp.value = ''; inp.disabled = false; inp.focus(); }
  $('#spNote').textContent = choice ? 'Tap the right one, or press its number key.' : 'Type the answer. It moves on by itself when it\'s right. Press Enter to check a different answer.';
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
  const loggedCorrect = ok && !corrected, loggedAnswer = item.options ? (item.options[+value]?.text || value) : corrected ? sp.wrongValue : value;
  const wrong = times ? [x,y] : {type:item.drillId.split(':')[0], key:item.drillId.slice(item.drillId.indexOf(':') + 1), prompt:item.prompt, answer:item.answer, reveal:item.reveal};
  if (times) { logFact(x, y, loggedCorrect, ms, 'facts', slow); if (slow) sp.slow.push(wrong); }
  else if (slow) sp.slow.push(wrong);
  const type = item.drillId.split(':')[0], key = item.drillId.slice(type.length + 1);
  Backend.log('attempts', times
    ? {mode:shift?.mode || 'practice', shop:'sprint', skill:'times-tables', step:`${Math.min(x,y)}x${Math.max(x,y)}`, step_type:'fact', correct:loggedCorrect, first_try:!corrected, slow,
      answer:loggedAnswer.slice(0,6), expected:String(x*y), misconception:null, context:null, fact_a:x, fact_b:y, fact_div:false, ms:Math.round(ms)}
    : {mode:shift?.mode || 'practice', shop:'sprint', skill:'drill:' + type, step:key, step_type:'fact', correct:loggedCorrect, first_try:!corrected, slow,
      answer:loggedAnswer.slice(0,60), expected:item.options ? item.options[+answer].text : answer, misconception:null, context:null, fact_a:null, fact_b:null, fact_div:null, ms:Math.round(ms)});
  if (ok) {
    if (corrected) { sp.missed.push(wrong); if (times) sp.queue.push([x,y]); }
    sp.correct++; $('#spCorrect').textContent = sp.correct; sfx('good');
    inp.classList.add('flash-good'); setTimeout(() => inp.classList.remove('flash-good'), 150); nextFact();
  } else {
    sp.missed.push(wrong); if (times) sp.queue.push([x,y]); sfx('bad'); inp.disabled = true;
    if (item.options) $$('#spOpts .opt').forEach(b => { b.disabled = true; if (+b.dataset.k === +answer) b.classList.add('right'); });
    const ft = $('#factText'); ft.classList.add('oops'); ft.textContent = times ? `${x} × ${y} = ${x*y}` : item.reveal || `${item.prompt} = ${item.answer}`;
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
  const skills = run.types.length, coins = sprintCoinsFor(run.correct, skills); S.coins += coins;
  const best = run.correct > S.sprintBest; if (best) S.sprintBest = run.correct;
  checkUnlocks({announce:true});
  save(); updateHeader();
  Backend.log('sprints', {correct:run.correct}); Backend.flush();
  const seen = new Set(), chips = [];
  run.missed.forEach(entry => { const id = Array.isArray(entry) ? fkey(entry[0], entry[1]) : `${entry.type}:${entry.key}`; if (!seen.has(id)) { seen.add(id); chips.push(Array.isArray(entry) ? `<span>${entry[0]} × ${entry[1]} = ${entry[0]*entry[1]}</span>` : `<span>${esc(entry.reveal || `${entry.prompt} = ${entry.answer}`)}</span>`); } });
  $('#summaryCard').innerHTML = `<div class="big-emoji">⚡</div><h2>${run.correct} correct!</h2>
    ${best ? '<p><b>New personal best!</b></p>' : `<p class="muted">Your best is ${S.sprintBest}</p>`}
    ${coins ? `<p>You earned <b>🪙 ${coins}</b> (${skills} skill${skills === 1 ? '' : 's'}).</p>` : ''}
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
    if (!unitOpen(building.id)) return unitLockedText(building);
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
    if (!unitOpen(building.id)) return unitLockedText(building);
    const rule = reward.unlock;
    if (rule.type === 'station') return `Serve ${UNLOCK_AT} orders at ${STATIONS[rule.station - 1].name}`;
    if (rule.type === 'mastery') return `Master ${rule.skills.map(skill => SKILLS[skill]?.name || skill).join(' and ')}`;
    if (rule.type === 'unitMastery') return `Master every ${building.name} skill`;
    if (rule.type === 'sprint') return `Reach ${rule.best} in the Fact Sprint`;
    if (rule.type === 'streak') return `Get ${rule.n} perfect orders in a row`;
    return 'Available from the beginning';
  };
  const box = reward => {
    const state = !unitOpen(building.id) ? 'soon' : owns(reward) ? 'owned' : available(reward) ? 'ready' : 'locked';
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
  const bookHoods = new Set(builtHoods().map(n => n.id));
  const tabs = BUILDINGS.filter(b => bookHoods.has(b.hood)).map(b => `<button type="button" class="book-tab${b.id === building.id ? ' active' : ''}" data-book-unit="${b.id}">${b.emoji}<span>${esc(b.name)}</span></button>`).join('');
  const pageComplete = rewards.length && rewards.every(owns);
  const masterStamp = pageComplete || unitTestPassed(building.id);
  const pageClass = `${!unitOpen(building.id) ? ' book-page-soon' : ''}${pageComplete ? ' book-page-complete' : ''}`;
  const trophies = NEIGHBORHOODS.filter(n => S.completedSets.includes(`hood:${n.id}`)).map(n => `<span class="book-trophy">🏆 ${esc(n.name)}</span>`).join('');
  $('#bookWrap').innerHTML = `<div class="backrow"><h2>📒 Sticker Book</h2><button class="btn small" data-go="home">Back to town</button></div>${trophies ? `<div class="book-trophies">${trophies}</div>` : ''}<div class="book-tabs">${tabs}</div><div class="book-page${pageClass}">${!unitOpen(building.id) ? `<div class="book-soon-banner">${esc(unitLockedText(building))}</div>` : ''}<div class="book-page-head"><span class="book-building">${building.emoji}</span><div><h2>${esc(building.name)}</h2><p>${owned} of ${rewards.length} stickers</p></div>${masterStamp ? `<div class="book-stamp">${esc(building.name)}<br>Master</div>` : ''}</div>${row('pet','Pets')}${row('decor','Decorations')}<p class="book-hint" id="bookHint" aria-live="polite"></p></div>`;
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
  if ($('#switchPlayer')) $('#switchPlayer').addEventListener('click', async () => { await townTracker.report(); townTracker.stop(); await Backend.signOut(); storeKey = LOCAL_KEY; S = fresh(); openJoin(); });
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
function practiceTimePanel(){
  const list = S.sessions || [], now = new Date();
  const midnight = daysAgo => { const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - daysAgo); return d.getTime(); };
  const minutesBetween = (from, to) => Math.round(list.filter(x => x.start >= from && x.start < to).reduce((a, x) => a + x.active, 0) / 60);
  const today = minutesBetween(midnight(0), Infinity), week = minutesBetween(midnight(6), Infinity);
  const last = list.length ? Math.max(...list.map(x => x.start)) : null;
  const lastTxt = last === null ? 'not yet'
    : last >= midnight(0) ? 'today ' + new Date(last).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})
    : last >= midnight(1) ? 'yesterday'
    : `${Math.round((midnight(0) - new Date(last).setHours(0, 0, 0, 0)) / 86400000)} days ago`;
  const days = Array.from({length:14}, (_, i) => {
    const back = 13 - i, from = midnight(back), mins = minutesBetween(from, back === 0 ? Infinity : midnight(back - 1));
    return {mins, label:new Date(from).toLocaleDateString([], {weekday:'narrow'}), date:new Date(from).toLocaleDateString()};
  });
  const top = Math.max(10, ...days.map(d => d.mins));
  const bars = days.map(d => `<div class="pt-day" title="${esc(d.date)}: ${d.mins} min"><span class="pt-bar" style="height:${Math.round(100 * d.mins / top)}%"></span><small>${esc(d.label)}</small></div>`).join('');
  return `<div class="panel"><h3>Practice time</h3><div class="stats">
      <div class="stat"><b>${today} min</b>today</div>
      <div class="stat"><b>${week} min</b>in the last 7 days</div></div>
    <p>Last played: <b>${esc(lastTxt)}</b>. Only active time counts: the game has to be on screen, with a tap or key press in the last minute.</p>
    <div class="pt-bars" aria-label="Minutes practiced each day for the last 14 days">${bars}</div>
    ${Backend.me ? '<p class="muted">Your teacher sees the full practice history.</p>' : ''}</div>`;
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
  const openUnits = new Set(BUILDINGS.filter(b => unitOpen(b.id)).map(b => b.id));
  const localDrillControls = !Backend.me ? `<div class="parent-drill-settings">
    <label><input type="checkbox" id="parentDrillEnabled" ${drillSettingsNow.enabled ? 'checked' : ''}> Enable practice pop-ups</label>
    <h4>Drill types</h4>${Object.entries(DRILLS).filter(([,d]) => d.unit === 'all' || openUnits.has(d.unit)).map(([type,d]) => `<label><input type="checkbox" data-parent-drill-type="${type}" ${drillSettingsNow.types[type] === false ? '' : 'checked'}> ${esc(d.name)}</label>`).join('')}
    <h4>Triggers</h4><label><input type="checkbox" id="parentTriggerMiss" ${drillSettingsNow.triggers.miss ? 'checked' : ''}> Missed answer</label><label><input type="checkbox" id="parentTriggerSlow" ${drillSettingsNow.triggers.slow ? 'checked' : ''}> Slow answer</label><label><input type="checkbox" id="parentTriggerSprint" ${drillSettingsNow.triggers.sprint ? 'checked' : ''}> End of sprint</label>
    <h4>Slow timing</h4><select id="parentSlowMode"><option value="adaptive" ${drillSettingsNow.slow.mode === 'adaptive' ? 'selected' : ''}>Adaptive</option><option value="fixed" ${drillSettingsNow.slow.mode === 'fixed' ? 'selected' : ''}>Fixed</option></select>
    <label>Idea seconds <input id="parentSlowIdea" type="number" min="5" max="60" value="${drillSettingsNow.slow.idea}"></label><label>Arithmetic seconds <input id="parentSlowArith" type="number" min="5" max="60" value="${drillSettingsNow.slow.arith}"></label><label>Sprint seconds <input id="parentSlowSprint" type="number" min="3" max="20" value="${drillSettingsNow.slow.sprint}"></label><label>Reading time before the tip timer starts <input id="parentReadSeconds" type="number" min="0" max="20" step="1" value="${drillSettingsNow.readSeconds}"></label><label>Max pop-ups per shift <input id="parentMaxPerShift" type="number" min="1" max="5" value="${drillSettingsNow.maxPerShift}"></label>
    <div class="row"><button class="btn small primary" id="saveParentDrills">Save</button><button class="btn small" id="resetParentDrills">Reset to defaults</button></div></div>` : `<p class="muted">${settingSummary}</p>`;
  const collections = BUILDINGS.filter(b => unitOpen(b.id)).map(b => {
    const rewards = REWARDS.filter(r => r.unit === b.id), owned = rewards.filter(owns).length;
    return `<div class="collection-row"><b>${esc(b.name)}</b><span>${owned} of ${rewards.length} items</span></div>`;
  }).join('');
  const legendary = REWARDS.filter(r => r.legendary && owns(r));
  $('#parentWrap').innerHTML = `<div class="backrow"><h2>Progress report: ${esc(S.name)}</h2><button class="btn small" data-go="home">Back to town</button></div>
    <div class="panel"><h3>Ideas or arithmetic?</h3><div class="stats">
      <div class="stat"><b>${cP === null ? '–' : cP + '%'}</b>idea steps right on the first try (${cc} of ${ca})</div>
      <div class="stat"><b>${mP === null ? '–' : mP + '%'}</b>arithmetic steps right on the first try (${mc} of ${ma})</div></div><p>${verdict}</p></div>
    <p class="counting-stat">Counting and reading the picture: <b>${setupC} of ${setupA}</b> right on first try.</p>
    ${practiceTimePanel()}
    <div class="panel"><h3>Rewards</h3><div class="collection-list">${collections}</div><p><b>Legendary items:</b> ${legendary.length ? legendary.map(r => `${r.emoji} ${esc(r.name)}`).join(', ') : 'None yet.'}</p><p><b>Longest perfect streak:</b> ${S.bestStreak}</p></div>
    <div class="panel"><h3>Mix-ups we've spotted</h3>${mis.length ? '<ul class="list">' + mis.map(([id,m]) => `<li><b>${esc(MIS[id].name)}</b> (${m.n} time${m.n === 1 ? '' : 's'})<br><span class="muted">Example: ${esc(m.ex[0] || '')}</span><br><span class="muted">Try: ${esc(MIS[id].tip)}</span></li>`).join('') + '</ul>' : '<p class="muted">None yet.</p>'}</div>
    <div class="panel"><h3>Khan Academy skills (Unit 1: Ratios)</h3><p class="muted">Mastered means at least 4 tries and 75% of the last 8 perfect.</p>${skills}</div>
    <div class="two"><div class="panel"><h3>Times tables</h3>
      <div style="display:flex; gap:8px; flex-wrap:wrap"><button class="btn small ${heatView === 'facts' ? 'mint' : ''}" data-heat="facts">Multiplying</button><button class="btn small ${heatView === 'divFacts' ? 'mint' : ''}" data-heat="divFacts">Dividing</button></div>
      <div class="heatwrap" style="margin-top:10px">${heatTable(heatView)}</div>
      <div class="legend"><span><i class="st-solid"></i>Solid</span><span><i class="st-close"></i>Getting there</span><span><i class="st-work"></i>Needs practice</span><span><i class="st-new"></i>Not seen yet</span></div></div>
    <div class="panel"><h3>Practice pop-ups</h3>${localDrillControls}${drillHistory}
      <h3>Settings</h3>
      ${!Backend.me ? `<label style="display:flex; gap:8px; align-items:center"><input type="checkbox" id="unlockAll" ${S.unlockAll ? 'checked' : ''}> Unlock every station and shop</label>` : `<p class="muted">Your teacher has unlocked ${S.minStation === 1 ? 'station 1' : 'stations 1 to ' + S.minStation}.</p>`}
      <button class="btn small" id="resetBtn">Reset all progress</button></div></div>`;
  $$('[data-heat]').forEach(b => b.addEventListener('click', () => { heatView = b.dataset.heat; renderParent(); }));
  if ($('#unlockAll')) $('#unlockAll').addEventListener('change', e => { S.unlockAll = e.target.checked; save(); });
  if ($('#saveParentDrills')) $('#saveParentDrills').addEventListener('click', () => {
    const types = {}; $$('[data-parent-drill-type]').forEach(input => { types[input.dataset.parentDrillType] = input.checked; });
    S.drillSettings = mergeDrillSettings({
      enabled: $('#parentDrillEnabled').checked, types,
      triggers: {miss:$('#parentTriggerMiss').checked, slow:$('#parentTriggerSlow').checked, sprint:$('#parentTriggerSprint').checked},
      slow: {mode:$('#parentSlowMode').value, idea:+$('#parentSlowIdea').value, arith:+$('#parentSlowArith').value, sprint:+$('#parentSlowSprint').value},
      readSeconds:+$('#parentReadSeconds').value,
      timeScale:drillSettingsNow.timeScale, maxPerShift:+$('#parentMaxPerShift').value
    });
    save(); renderParent();
  });
  if ($('#resetParentDrills')) $('#resetParentDrills').addEventListener('click', () => { S.drillSettings = {}; save(); renderParent(); });
  let armed = false, armT;
  $('#resetBtn').addEventListener('click', e => {
    if (!armed) { armed = true; e.target.textContent = 'Click again to erase everything'; armT = setTimeout(() => { armed = false; e.target.textContent = 'Reset all progress'; }, 4000); return; }
    clearTimeout(armT); const keep = {muted:S.muted, music:S.music, musicTrack:S.musicTrack, musicVolume:S.musicVolume, minStation:S.minStation, name:Backend.me ? S.name : ''};
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
/* ---------- practice time kept in the town (PRACTICE-TIME.md step 3) ----------
   Both modes keep the last 30 sessions in S.sessions as {start, end, active} (ms, ms, seconds).
   Signed-in students also report to Supabase through Backend.startSession(). A new session
   starts each time the town is opened, and after 30 idle minutes. */
let localSession = null;
const townTracker = new ActivityTracker(seconds => {
  const now = Date.now();
  if (!localSession || !S.sessions.includes(localSession) || now - localSession.end > 30 * 60000) {
    localSession = {start: now - seconds * 1000, end: now, active: 0};
    S.sessions.push(localSession);
    if (S.sessions.length > 30) S.sessions = S.sessions.slice(-30);
  }
  localSession.end = now; localSession.active += seconds; save();
  return true;
});
function startTownTracker(){ localSession = null; townTracker.start(); }
function enterAs(me){
  storeKey = 'pettown:v1:' + me.student_id;
  const local = loadState(storeKey);
  const remote = me.state && typeof me.state === 'object' ? me.state : null;
  const resetAt = me.reset_at, resetMs = resetAt ? Date.parse(resetAt) : NaN;
  if (resetAt && Number.isFinite(resetMs) && (local.savedAt || 0) < resetMs) resetTown(resetAt);
  else {
    S = (remote && (remote.savedAt || 0) > (local.savedAt || 0)) ? normalize(remote) : local;
    S.name = me.name; S.minStation = me.min_station || 1; S.resetSeen = resetAt || S.resetSeen || null;
  }
  drillSettings();
  checkUnlocks({announce:false});
  save(); show('home');
  startTownTracker();
  void Backend.startSession();
}

/* ---------- boot ---------- */
(async function boot(){
  if (!Backend.enabled) { S = loadState(LOCAL_KEY); drillSettings(); checkUnlocks({announce:false}); save(); startTownTracker(); if (!S.name) openName(); else show('home'); return; }
  show('loading');
  let me = null;
  try { me = await Backend.restore(); } catch(e){}
  if (me) enterAs(me); else openJoin();
})();
