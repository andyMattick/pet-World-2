/* Pet Town game (Unit 1: Ratios). Runs in two modes:
   - hosted: students join a class (code + name + PIN) and everything saves to Supabase
   - local: no backend configured, the town saves in the browser (the single-file build) */
import { SKILLS, SKILL_ORDER, STATIONS, SHOPS, UNLOCK_AT, MIS, REWARDS, UNIT_SKILLS, BUILDINGS, NEIGHBORHOODS, SUBJECTS, DEFAULT_HOME, buildingsIn, buildingsInClass, subjectsIn, prevBuilding, nextBuilding, builtHoods, townHoods, validHood, DRILLS, QUIZ_DEFAULTS, quizSettings, drillLabel, mergeDrillSettings, drillTypeOn, ARCADE_GAMES, arcadeGameOfTheDay, arcadeSettings, ACCESSORIES, ARCADE_ROOM_FURNITURE } from '../shared/registry';
import { Backend, ActivityTracker } from '../lib/studentBackend';
import { installLanguage, translateText } from '../shared/language';

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
const freshBase = () => ({v:1, name:'', sid:'s'+Math.random().toString(36).slice(2,10), coins:0, power:1, home:DEFAULT_HOME, sprintBest:0, sprintPick:['times'], bestStreak:0,
  owned:['cat'], decor:[], pet:'cat', unlocked:[], seenUnlocks:[], seenCollection:[], completedSets:[], muted:false, music:true, musicTrack:'cafe', musicVolume:70, streak:0, day:1, orders:0, perfect:0, timeMs:0,
  mathMinutes:{}, arcade:{tickets:0, playedSeconds:0, timerVersion:3, day:'', admittedDay:'', ticketDay:'', ticketsEarnedToday:0, completedRounds:[], gameSaves:{}},
  facts:{}, divFacts:{}, practiceLog:{}, drillLog:{}, practiceLanguage:'en', pace:{idea:[], arith:[], sprint:[]}, ks:{}, kr:{}, kn:{}, mis:{},
  review:{}, quizzes:{}, stationsOpenedBefore:{}, sessions:[], readingBooks:[], readingSelection:null, elaProgress:{}, historyProgress:{}, historyProjects:{}, scienceProgress:{}, scienceProjects:{},
  cafe:{st:{1:0,2:0,3:0,4:0}}, bakery:{st:{1:0,2:0,3:0,4:0,5:0}}, displayed:Array(8).fill(null), room:{initialized:false,placements:[],items:[]}, accessoriesOwned:['starter-clip'], accessoryPositions:{}, wearing:{hat:null,eyes:null,neck:null}, minStation:1, unlockAll:false, resetSeen:null, sync:{url:'', wkey:'', cls:'', last:0}, savedAt:0});
/* a new save, with a progress record for every shop (the Lemonade Stand and later ones too) */
const fresh = () => { const s = freshBase(); Object.values(SHOPS).forEach(shop => { if (!s[shop.id]) s[shop.id] = {st:Object.fromEntries(shop.stations.map(st => [st.id, 0]))}; }); return s; };
/* fill in any fields an older save is missing */
function normalizeProjectStore(raw, ids){
  return Object.fromEntries(ids.map(id => {
    const p = raw?.[id] || {}, answers = p.answers && typeof p.answers === 'object' ? p.answers : {};
    return [id, {answers:Object.fromEntries(Object.entries(answers).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k, v.slice(0,1500)]).slice(0,12)), status:p.status === 'submitted' ? 'submitted' : 'draft', submittedAt:Number.isFinite(+p.submittedAt) ? +p.submittedAt : 0, localReview:p.localReview === 'verified' || p.localReview === 'revise' ? p.localReview : ''}];
  }));
}
function normalize(raw){
  const f = fresh(), s = Object.assign(f, raw || {});
  s.cafe = Object.assign({st:{}}, s.cafe || {}); s.cafe.st = Object.assign({1:0,2:0,3:0,4:0}, s.cafe.st || {});
  s.bakery = Object.assign({st:{}}, s.bakery || {}); s.bakery.st = Object.assign({1:0,2:0,3:0,4:0,5:0}, s.bakery.st || {});
  Object.values(SHOPS).forEach(shop => {                          // every other shop (the Lemonade Stand and later ones) gets the same progress record
    if (shop.id === 'cafe' || shop.id === 'bakery') return;
    s[shop.id] = Object.assign({st:{}}, s[shop.id] || {}); s[shop.id].st = Object.assign(Object.fromEntries(shop.stations.map(st => [st.id, 0])), s[shop.id].st || {});
  });
  ['review','quizzes'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  s.readingBooks = Array.isArray(s.readingBooks) ? s.readingBooks.filter(book => book && typeof book.id === 'string' && typeof book.title === 'string').slice(0,100).map(book => ({
    id:book.id, title:book.title.slice(0,120), author:typeof book.author === 'string' ? book.author.slice(0,120) : '',
    chapters:Array.isArray(book.chapters) ? book.chapters.slice(0,200).filter(chapter => chapter && typeof chapter.id === 'string').map(chapter => ({
      id:chapter.id, label:typeof chapter.label === 'string' ? chapter.label.slice(0,100) : '',
      characters:typeof chapter.characters === 'string' ? chapter.characters.slice(0,600) : '',
      notableAction:typeof chapter.notableAction === 'string' ? chapter.notableAction.slice(0,600) : '',
      conflict:typeof chapter.conflict === 'string' ? chapter.conflict.slice(0,600) : '',
      interaction:typeof chapter.interaction === 'string' ? chapter.interaction.slice(0,600) : '',
      joy:typeof chapter.joy === 'string' ? chapter.joy.slice(0,600) : '',
      setting:typeof chapter.setting === 'string' ? chapter.setting.slice(0,600) : '',
      themes:typeof chapter.themes === 'string' ? chapter.themes.slice(0,600) : '',
      detail:typeof chapter.detail === 'string' ? chapter.detail.slice(0,600) : '',
      vocabulary:typeof chapter.vocabulary === 'string' ? chapter.vocabulary.slice(0,600) : ''
    })) : []
  })) : [];
  s.elaProgress = s.elaProgress && typeof s.elaProgress === 'object' ? s.elaProgress : {};
  s.historyProgress = s.historyProgress && typeof s.historyProgress === 'object' ? s.historyProgress : {};
  s.scienceProgress = s.scienceProgress && typeof s.scienceProgress === 'object' ? s.scienceProgress : {};
  s.historyProjects = normalizeProjectStore(s.historyProjects, ['history','history2','history3','history4']);
  s.scienceProjects = normalizeProjectStore(s.scienceProjects, ['bio1','bio1lab']);
  if (s.readingSelection && !s.readingBooks.some(book => book.id === s.readingSelection.bookId && (s.readingSelection.chapterId == null || book.chapters.some(chapter => chapter.id === s.readingSelection.chapterId)))) s.readingSelection = null;
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
  s.practiceLanguage = s.practiceLanguage === 'es' ? 'es' : 'en';
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
  s.room = Object.assign({initialized:false,placements:[],items:[]}, s.room || {});
  s.room.initialized = !!s.room.initialized;
  s.room.items = Array.isArray(s.room.items) ? [...new Set(s.room.items.filter(id => ARCADE_ROOM_FURNITURE.some(item => item.id === id)))] : [];
  const roomIds = new Set();
  s.room.placements = (Array.isArray(s.room.placements) ? s.room.placements : []).filter(item => {
    const ownedRoomItem = item && (s.decor.includes(item.id) || s.room.items.includes(item.id));
    if (!item || typeof item.id !== 'string' || !ownedRoomItem || roomIds.has(item.id) || !Number.isFinite(+item.x) || !Number.isFinite(+item.y)) return false;
    roomIds.add(item.id); return true;
  }).map(item => ({id:item.id, x:Math.max(4, Math.min(96, +item.x)), y:Math.max(8, Math.min(88, +item.y))}));
  s.accessoriesOwned = Array.isArray(s.accessoriesOwned) ? [...new Set(s.accessoriesOwned.filter(id => ACCESSORIES.some(item => item.id === id)))] : [];
  s.accessoryPositions = Object.fromEntries(Object.entries(s.accessoryPositions && typeof s.accessoryPositions === 'object' ? s.accessoryPositions : {})
    .filter(([id, point]) => s.accessoriesOwned.includes(id) && point && Number.isFinite(+point.x) && Number.isFinite(+point.y))
    .map(([id, point]) => [id, {x:Math.max(5, Math.min(95, +point.x)), y:Math.max(5, Math.min(95, +point.y))}]));
  s.wearing = Object.assign({hat:null,eyes:null,neck:null}, s.wearing || {});
  ['hat','eyes','neck'].forEach(slot => {
    const accessory = ACCESSORIES.find(item => item.id === s.wearing[slot]);
    if (accessory && (accessory.slot !== slot || !s.accessoriesOwned.includes(accessory.id))) s.wearing[slot] = null;
    else if (!accessory) s.wearing[slot] = null;
  });
  s.bestStreak = Math.max(0, Math.floor(+s.bestStreak || 0));
  s.coins = Math.max(0, Math.floor(+s.coins || 0));
  s.mathMinutes = s.mathMinutes && typeof s.mathMinutes === 'object' ? s.mathMinutes : {};
  s.arcade = Object.assign({tickets:0, playedSeconds:0, timerVersion:3, day:'', admittedDay:'', ticketDay:'', ticketsEarnedToday:0, completedRounds:[], gameSaves:{}}, s.arcade || {});
  if (raw?.arcade?.timerVersion !== 3) s.arcade.playedSeconds = 0;
  s.arcade.timerVersion = 3;
  s.arcade.tickets = Math.max(0, Math.floor(+s.arcade.tickets || 0));
  s.arcade.playedSeconds = Math.max(0, Math.floor(+s.arcade.playedSeconds || 0));
  s.arcade.day = typeof s.arcade.day === 'string' ? s.arcade.day : '';
  s.arcade.admittedDay = typeof s.arcade.admittedDay === 'string' ? s.arcade.admittedDay : '';
  s.arcade.ticketDay = typeof s.arcade.ticketDay === 'string' ? s.arcade.ticketDay : '';
  s.arcade.ticketsEarnedToday = Math.max(0, Math.floor(+s.arcade.ticketsEarnedToday || 0));
  s.arcade.completedRounds = Array.isArray(s.arcade.completedRounds) ? [...new Set(s.arcade.completedRounds.filter(id => typeof id === 'string'))].slice(-200) : [];
  s.arcade.gameSaves = Object.fromEntries(Object.entries(s.arcade.gameSaves && typeof s.arcade.gameSaves === 'object' ? s.arcade.gameSaves : {})
    .filter(([id, state]) => ARCADE_GAMES.some(game => game.id === id) && typeof state === 'string' && state.length <= 100000));
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
const refreshLanguage = installLanguage(document.body, () => S.practiceLanguage);
function syncLanguageControls(){
  refreshLanguage();
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === S.practiceLanguage)));
}
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
    return building.open && prev ? `Pass the ${prev.name} Unit Test to open the ${building.name}.` : `Opens with the ${building.name}.`; // Display the unit test requirement
}
function unitTestPassed(unit){
  if (HISTORY_BUILDING_COURSE[unit]) return !!progressStore(HISTORY_BUILDING_COURSE[unit])?.[`${HISTORY_BUILDING_COURSE[unit]}:final-test`]?.passed || Backend.me?.quiz_overrides?.[`${unit}:test`] === 'excused';
  if (unit === 'elaNouns' || unit === 'elaVerbs') {
    const key = unit === 'elaNouns' ? 'final-test' : 'verbs:final-test';
    return !!S.elaProgress?.[key]?.passed || Backend.me?.quiz_overrides?.[`${unit}:test`] === 'excused';
  }
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

/* ===== 4th grade, Lemonade Stand (Sadlier lessons 1 to 5): comparing, word problems, factors, patterns ===== */
const choiceOf = (right, wrongs) => shuffle([{html:right.text, text:right.text, ok:true, mis:null}, ...wrongs.filter(w => w.text !== right.text)
  .filter((w, i, arr) => arr.findIndex(x => x.text === w.text) === i).map(w => ({html:w.text, text:w.text, ok:false, mis:w.mis || null}))]);
const numStep = (name, type, prompt, answer, extra = {}) => ({name, type, kind:'num', prompt, answer, eq:v => v === answer, ...extra,
  ...(extra.mis ? {mis:v => v === answer ? null : extra.mis(v)} : {})});   // a mix-up never fires on the right answer (2 + 2 = 2 × 2)
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPrime = n => PRIMES.includes(n);
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95];
const smallestFactor = n => { for (let f = 2; f * f <= n; f++) if (n % f === 0) return f; return n; };
const LEMON_KIDS = [['🧒', 'Mia'], ['👦', 'Leo'], ['👧', 'Ava'], ['🧑', 'Sam'], ['👩', 'Rosa'], ['👨', 'Ben']];
const SHAPES = ['🔺', '🟦', '🟡', '⭐', '🟩', '🔶'];
const LEMON_GEN = {
  cmpMult(lvl){
    const a = rand(2, 9), k = rand(2, lvl === 1 ? 5 : 9), b = a * k;
    const ask = lvl === 1 ? 'none' : lvl === 2 ? 'big' : 'times';
    const say = ask === 'times' ? `${b} is ? times as many as ${a}.` : ask === 'big' ? `? is ${k} times as many as ${a}.` : `${b} is ${k} times as many as ${a}.`;
    const eqRight = ask === 'times' ? `${b} = ? × ${a}` : ask === 'big' ? `? = ${k} × ${a}` : `${b} = ${k} × ${a}`;
    const opts = choiceOf({text:eqRight}, ask === 'times' ? [{text:`${b} = ? + ${a}`, mis:'additiveCompare'}, {text:`${a} = ? × ${b}`, mis:'reversedCompare'}]
      : ask === 'big' ? [{text:`? = ${k} + ${a}`, mis:'additiveCompare'}, {text:`${a} = ${k} × ?`, mis:'reversedCompare'}]
      : [{text:`${b} = ${k} + ${a}`, mis:'additiveCompare'}, {text:`${a} = ${k} × ${b}`, mis:'reversedCompare'}]);
    const steps = [{name:'Pick the equation', type:'concept', kind:'choice', prompt:`Which equation says "${say}"`, options:opts,
      hint:() => '"Times as many" means multiply. The bigger amount is the one that is times as many.'}];
    if (ask === 'times') steps.push(numStep('Find how many times', 'compute', `${b} = ? × ${a}`, k, {fact:{x:a, y:k, div:true}, mis:v => v === b - a ? 'additiveCompare' : null, hint:() => `${a} × what = ${b}?`}));
    else steps.push(numStep('Multiply', 'compute', `${k} × ${a} = ?`, b, {fact:{x:k, y:a}, mis:v => v === a + k ? 'additiveCompare' : null, hint:() => `${k} groups of ${a}.`}));
    return {title:'Pitchers', ctx:`${say}`, bubble:`My sign says: ${say} Can you write it as math?`,
      helper:'"Times as many" is a multiplication comparison.', visual:`<div style="text-align:center; font-size:1.5rem">🍋 ${esc(say)}</div>`, steps};
  },
  cmpWord(lvl){
    const [e, n] = pick(LEMON_KIDS), small = rand(2, 9), k = rand(2, lvl === 1 ? 5 : 9), big = small * k;
    const kind = lvl === 1 ? pick(['bigger', 'bigger', 'smaller']) : pick(['bigger', 'smaller', 'times', ...(lvl === 3 ? ['more', 'more'] : ['more'])]);
    const more = rand(2, 9);
    const T = {
      bigger: {story:`${n}'s small pitcher holds ${small} cups. The big pitcher holds ${k} times as many cups. How many cups does the big pitcher hold?`, op:'×', ans:big, calc:`${small} × ${k}`},
      smaller:{story:`The big pitcher holds ${big} cups. That's ${k} times as many as ${n}'s small pitcher. How many cups does the small pitcher hold?`, op:'÷', ans:small, calc:`${big} ÷ ${k}`},
      times:  {story:`${n} sold ${big} cups on Saturday and ${small} cups on Friday. How many times as many cups did ${n} sell on Saturday?`, op:'÷', ans:k, calc:`${big} ÷ ${small}`},
      more:   {story:`${n} sold ${small} cups on Friday and ${more} more cups on Saturday than on Friday. How many cups on Saturday?`, op:'+', ans:small + more, calc:`${small} + ${more}`}
    }[kind];
    const ops = [{text:'Multiply ( × )', op:'×'}, {text:'Divide ( ÷ )', op:'÷'}, {text:'Add ( + )', op:'+'}];
    const opts = shuffle(ops.map(o => ({html:o.text, text:o.text, ok:o.op === T.op, mis:o.op === T.op ? null : kind === 'more' ? 'moreAsTimes' : o.op === '+' ? 'additiveCompare' : 'wrongOperation'})));
    return {title:'Pitchers', ctx:`${kind}: ${T.calc}`, bubble:T.story,
      helper:'"Times as many" multiplies or divides. "More than" adds.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋🥤</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Which operation answers the question?', options:opts, drill:{type:'story', key:'ratio'},
          hint:() => kind === 'more' ? '"More than" means add the extra amount.' : 'Find the smaller amount and the bigger amount. "Times as many" connects them with × or ÷.'},
        numStep('Solve', 'compute', `${T.calc} = ?`, T.ans, {fact:T.op === '×' ? {x:small, y:k} : T.op === '÷' ? {x:kind === 'times' ? small : k, y:kind === 'times' ? k : small, div:true} : undefined,
          mis:v => (T.op !== '+' && (v === small + k || v === big - small || v === big - k)) ? 'additiveCompare' : (T.op === '+' && v === small * more) ? 'moreAsTimes' : null,
          hint:() => `${T.calc}.`})]};
  },
  mdWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl < 3) {
      const mult = Math.random() < 0.5, per = lvl === 1 ? rand(2, 9) : rand(3, 9), groups = lvl === 1 ? rand(11, 30) : rand(101, 250), total = per * groups;
      const story = mult ? `${n} packs lemons in bags of ${per}. ${n} fills ${groups} bags. How many lemons is that?`
                         : `${n} has ${total} lemons and packs them in bags of ${per}. How many bags does ${n} fill?`;
      const opts = choiceOf({text:mult ? `${groups} × ${per}` : `${total} ÷ ${per}`}, mult ? [{text:`${groups} + ${per}`, mis:'wrongOperation'}, {text:`${groups} ÷ ${per}`, mis:'wrongOperation'}] : [{text:`${total} × ${per}`, mis:'wrongOperation'}, {text:`${total} − ${per}`, mis:'wrongOperation'}]);
      return {title:'Big Orders', ctx:mult ? `${groups} × ${per}` : `${total} ÷ ${per}`, bubble:story, helper:'Equal groups: multiply to find the total, divide to find the number of groups.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋 bags of ${per}</div>`,
        steps:[{name:'Pick the math', type:'concept', kind:'choice', prompt:'Which one matches the story?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => mult ? 'You know the bags and how many in each. Put the groups together.' : 'You know the total and how many in each bag. How many groups fit?'},
          numStep(mult ? 'Multiply' : 'Divide', 'compute', mult ? `${groups} × ${per} = ?` : `${total} ÷ ${per} = ?`, mult ? total : groups, {slowOK:true, hint:() => mult ? `Multiply the ones, then the tens${lvl === 2 ? ', then the hundreds' : ''}.` : `How many ${per}s are in ${total}?`})]};
    }
    const per = rand(3, 9), q = rand(8, 40), r = rand(1, per - 1), total = per * q + r, need = pick(['all', 'full', 'left']);
    const story = need === 'all' ? `${n} has ${total} cups to stack in towers of ${per}. How many towers does ${n} need to stack every cup?`
      : need === 'full' ? `${n} has ${total} lemons. Each pitcher uses ${per}. How many full pitchers can ${n} make?`
      : `${n} has ${total} straws and puts ${per} in each cup. How many straws are left over?`;
    const ans = need === 'all' ? q + 1 : need === 'full' ? q : r;
    return {title:'Big Orders', ctx:`${total} ÷ ${per}, ${need}`, bubble:story, helper:'Divide, then decide what the remainder means for the story.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${total} ÷ ${per}</div>`,
      steps:[{name:'Divide', type:'compute', kind:'qr', prompt:`${total} ÷ ${per} = ? R ?`, answer:[q, r], eq:v => Array.isArray(v) && v[0] === q && v[1] === r, slowOK:true, hint:() => `${per} × ${q} = ${per * q}. What's left?`},
        numStep('Use the remainder', 'concept', need === 'all' ? 'How many towers are needed?' : need === 'full' ? 'How many full pitchers?' : 'How many straws are left over?', ans,
          {mis:v => (need === 'all' && v === q) || (need === 'full' && v === q + 1) || (need === 'left' && v === q) ? 'remainderMeaning' : null,
           hint:() => need === 'all' ? `${q} towers hold ${per * q} cups. The ${r} extra cups need one more tower.` : need === 'full' ? `The ${r} leftover lemons aren't enough for another pitcher.` : 'The remainder is what is left over.'})],
      answerSteps:[1]};
  },
  estWord(lvl){
    const [e, n] = pick(LEMON_KIDS), place = lvl === 1 ? 10 : 100;
    const round = x => Math.round(x / place) * place;
    let a, b, op;
    for (let t = 0; t < 50; t++){
      op = lvl === 3 ? pick(['+', '−', '×']) : pick(['+', '−']);
      if (op === '×') { a = rand(12, 98); b = rand(11, 49); } else { a = lvl === 1 ? rand(21, 98) : rand(201, 989); b = lvl === 1 ? rand(11, 89) : rand(101, 689); }
      if (op === '−' && round(a) <= round(b)) continue;
      if (a % (op === '×' ? 10 : place) === 0 || b % (op === '×' ? 10 : place) === 0) continue;
      if (a % (op === '×' ? 10 : place) === (op === '×' ? 5 : place / 2)) continue;   // no ties when rounding
      if (b % (op === '×' ? 10 : place) === (op === '×' ? 5 : place / 2)) continue;
      break;
    }
    const P = op === '×' ? 10 : place, R = x => Math.round(x / P) * P, ra = R(a), rb = R(b), est = op === '+' ? ra + rb : op === '−' ? ra - rb : ra * rb;
    const wrongRound = x => Math.round(x / P) * P === Math.floor(x / P) * P ? Math.ceil(x / P) * P : Math.floor(x / P) * P;
    const story = op === '+' ? `${n} sold ${a} cups on Saturday and ${b} cups on Sunday. About how many cups is that in all?`
      : op === '−' ? `${n} made ${a} cups and sold ${b}. About how many cups are left?`
      : `${n} has ${a} boxes with ${b} cups in each box. About how many cups is that?`;
    const word = P === 10 ? 'ten' : 'hundred';
    return {title:'Big Orders', ctx:`${a} ${op} ${b}, estimate`, bubble:story, helper:`Round each number to the nearest ${word} first.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${e} about ${a} ${op} ${b}</div>`,
      steps:[numStep('Round the first number', 'concept', `Round ${a} to the nearest ${word}.`, ra, {mis:v => v === wrongRound(a) ? 'roundWrong' : null, hint:() => `Look at the digit to the right of the ${word}s place. 5 or more rounds up.`}),
        numStep('Round the second number', 'concept', `Round ${b} to the nearest ${word}.`, rb, {mis:v => v === wrongRound(b) ? 'roundWrong' : null, hint:() => 'Same rule: 5 or more rounds up.'}),
        numStep('Estimate', 'compute', `${ra} ${op} ${rb} = ?`, est, {hint:() => op === '×' ? `${ra / 10} × ${rb / 10}, then add two zeros.` : `Work with the ${word}s.`})]};
  },
  eqWord(lvl){
    const [e, n] = pick(LEMON_KIDS), L = pick(['c', 'n', 'p']);
    const T = pick([
      () => { const k = rand(2, 5), m = rand(3, 9), s = k * m + rand(5, lvl === 1 ? 30 : 60); return {story:`${n} had ${s} cups. ${n} used ${k} stacks of ${m} cups. ${L} is the number of cups left.`, right:`${L} = ${s} − ${k} × ${m}`, wrong:[`${L} = ${s} − ${k} + ${m}`, `${L} = ${k} × ${m} − ${s}`, `${L} = (${s} − ${k}) × ${m}`], val:s - k * m}; },
      () => { const k = rand(2, 6), m = rand(3, 9), x = rand(2, 12); return {story:`${n} bought ${k} bags of ${m} lemons and ${x} more loose lemons. ${L} is the number of lemons.`, right:`${L} = ${k} × ${m} + ${x}`, wrong:[`${L} = ${k} + ${m} + ${x}`, `${L} = ${k} × (${m} + ${x})`, `${L} = ${k} × ${m} × ${x}`], val:k * m + x}; },
      () => { const g = rand(2, 6), a = rand(10, 30), b = rand(5, 20), tot = a + b, t2 = tot - tot % g, a2 = t2 - b; return {story:`${n} made ${a2} cups in the morning and ${b} in the afternoon, then shared them equally among ${g} tables. ${L} is the number of cups at each table.`, right:`${L} = (${a2} + ${b}) ÷ ${g}`, wrong:[`${L} = ${a2} + ${b} ÷ ${g}`, `${L} = (${a2} + ${b}) × ${g}`, `${L} = ${g} ÷ (${a2} + ${b})`], val:(a2 + b) / g}; },
      () => { const p = rand(2, 5), k = rand(3, 9), paid = (p * k < 20 ? 20 : p * k < 50 ? 50 : 100); return {story:`${n} bought ${k} cups at $${p} each and paid with a $${paid} bill. ${L} is the change.`, right:`${L} = ${paid} − ${k} × ${p}`, wrong:[`${L} = ${paid} − ${k} + ${p}`, `${L} = ${k} × ${p} − ${paid}`, `${L} = (${paid} − ${k}) × ${p}`], val:paid - k * p}; }
    ])();
    const opts = choiceOf({text:T.right}, T.wrong.map(w => ({text:w, mis:'wrongEquation'})));
    const steps = [{name:'Pick the equation', type:'concept', kind:'choice', prompt:`Which equation finds ${L}?`, options:opts, drill:{type:'story', key:'ratio'}, hint:() => 'Say the story in order: what happens first, and what happens next? Parentheses show what to do first.'}];
    if (lvl >= 2) steps.push(numStep(`Find ${L}`, 'compute', `${T.right.replace(`${L} = `, '')} = ?`, T.val, {hint:() => 'Multiply or divide before you add or subtract, unless parentheses say otherwise.'}));
    return {title:'Big Orders', ctx:T.right, bubble:T.story, helper:'Turn the story into one equation with a letter for the unknown.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${L} = ?</div>`, steps};
  },
  multiStep(lvl){
    const [e, n] = pick(LEMON_KIDS);
    const T = pick([
      () => { const k = rand(3, lvl === 1 ? 6 : 9), m = rand(4, 9) * (lvl === 3 ? 2 : 1), g = rand(5, k * m - 5); return {story:`${n} buys ${k} packs of ${m} cups, then gives away ${g} cups. How many cups are left?`, s1:['How many cups in the packs?', `${k} × ${m} = ?`, k * m, {x:k, y:m}], s2:[`${k * m} − ${g} = ?`, k * m - g]}; },
      () => { const g = rand(2, 6), q = rand(4, lvl === 1 ? 9 : 15), tot = g * q, a = rand(1, tot - 1), friend = n === 'Rosa' ? 'Ben' : 'Rosa'; return {story:`${n} squeezed ${a} lemons and ${friend} squeezed ${tot - a}. They split them equally into ${g} pitchers. How many lemons per pitcher?`, s1:['How many lemons in all?', `${a} + ${tot - a} = ?`, tot, null], s2:[`${tot} ÷ ${g} = ?`, q, {x:g, y:q, div:true}]}; },
      () => { const p = rand(2, 5), k = rand(3, 9), p2 = rand(1, 4), k2 = rand(2, 8); return {story:`Lemonade is $${p} a cup and cookies are $${p2} each. ${n} buys ${k} cups and ${k2} cookies. How much does ${n} spend?`, s1:['How much for the lemonade?', `${k} × ${p} = ?`, k * p, {x:k, y:p}], s2:[`${k * p} + ${k2} × ${p2} = ?`, k * p + k2 * p2]}; }
    ])();
    return {title:'Big Orders', ctx:T.story.slice(0, 60), bubble:T.story, helper:'Two steps: find the first amount, then use it.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋 two steps</div>`,
      steps:[numStep('First step', 'compute', `${T.s1[0]} ${T.s1[1]}`, T.s1[2], T.s1[3] ? {fact:T.s1[3]} : {}),
        numStep('Second step', 'compute', T.s2[0], T.s2[1], {...(T.s2[2] ? {fact:T.s2[2]} : {}), hint:() => 'Use your answer from the first step.'})]};
  },
  factorPairs(lvl){
    let N, pairs;
    for (let t = 0; t < 100; t++){
      N = lvl === 1 ? rand(6, 30) : lvl === 2 ? rand(12, 60) : rand(24, 100);
      pairs = []; for (let f = 1; f * f <= N; f++) if (N % f === 0) pairs.push([f, N / f]);
      if (pairs.length >= (lvl === 1 ? 2 : 3) && pairs.length <= (lvl === 3 ? 6 : 4)) break;
    }
    const steps = pairs.map(([f, g]) => numStep(`${f} × ?`, 'compute', `${N} = ${f} × ?`, g, {fact:f > 1 ? {x:f, y:g, div:true} : undefined, drill:{type:'factors', key:'pairs'}, hint:() => `${N} ÷ ${f} = ?`}));
    steps.push(numStep('Count the pairs', 'concept', `How many factor pairs does ${N} have?`, pairs.length,
      {mis:v => { const factors = new Set(pairs.flat()).size; return v !== pairs.length && (v === pairs.length * 2 || v === factors) ? 'pairsDoubled' : null; }, hint:() => `Count the rows you filled: each one is a pair. 3 × 4 and 4 × 3 are the same pair.`}));
    return {title:'Cup Stacks', ctx:`factor pairs of ${N}`, bubble:`I have ${N} cups. What rectangles can I stack them in? Find every factor pair of ${N}.`,
      helper:'Start at 1 and go up. Stop when the pairs start repeating.', visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${N} cups</div>`, steps};
  },
  identFactors(lvl){
    let N, f;
    for (let t = 0; t < 100; t++){ N = pick(lvl === 1 ? [12, 16, 18, 20, 24, 30] : lvl === 2 ? [24, 28, 32, 36, 40, 42, 45, 48] : [54, 56, 60, 63, 64, 72, 75, 80, 84, 90, 96]);
      const fs = []; for (let x = 2; x < N; x++) if (N % x === 0) fs.push(x); f = pick(fs); if (f) break; }
    const non = []; for (let x = 2; x <= 12; x++) if (N % x !== 0) non.push(x);
    const wrongs = shuffle(non).slice(0, 2).map(x => ({text:String(x), mis:'notAFactor'}));
    wrongs.push({text:String(N * 2), mis:'factorMultipleSwap'});
    const opts = choiceOf({text:String(f)}, wrongs);
    const steps = [{name:'Pick the factor', type:'concept', kind:'choice', prompt:`Which number is a factor of ${N}?`, options:opts, hint:() => `A factor divides ${N} with nothing left over.`}];
    if (lvl >= 2) steps.push(numStep('Check it', 'compute', `${N} ÷ ${f} = ?`, N / f, {fact:{x:f, y:N / f, div:true}}));
    return {title:'Cup Stacks', ctx:`factor of ${N}`, bubble:`I want to stack ${N} cups in equal rows. Which row size works?`, helper:'Factors divide evenly. Multiples are bigger.',
      visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${N} cups</div>`, steps};
  },
  relateFM(lvl){
    const a = rand(2, 12), k = rand(2, 12), N = a * k;
    const opts = choiceOf({text:`${N} is a multiple of ${a}`}, [{text:`${a} is a multiple of ${N}`, mis:'factorMultipleSwap'}, {text:`${N} is a factor of ${a}`, mis:'factorMultipleSwap'}, {text:`${a} is a multiple of ${a + 1}`, mis:null}]);
    const opts2 = choiceOf({text:`${a} is a factor of ${N}`}, [{text:`${N} is a factor of ${a}`, mis:'factorMultipleSwap'}, {text:`${a} is a multiple of ${N}`, mis:'factorMultipleSwap'}]);
    const useFactor = Math.random() < 0.5;
    return {title:'Cup Stacks', ctx:`${a} × ${k} = ${N}`, bubble:`${a} × ${k} = ${N}. Which sentence is true?`, helper:`In ${a} × ${k} = ${N}, ${a} and ${k} are factors, and ${N} is a multiple of each.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${a} × ${k} = ${N}</div>`,
      steps:[{name:'Factor or multiple', type:'concept', kind:'choice', prompt:'Which sentence is true?', options:(useFactor ? opts2 : opts).filter(o => o.ok || o.mis), hint:() => 'The multiple is the product, the big number. The factors multiply to make it.'},
        numStep('Find the other factor', 'compute', `${a} × ? = ${N}`, k, {fact:{x:a, y:k, div:true}})].slice(0, lvl === 1 ? 1 : 2)};
  },
  identMultiples(lvl){
    const n = rand(3, lvl === 1 ? 6 : 12), k = rand(2, lvl === 1 ? 6 : 10), m = n * k;
    const facs = []; for (let x = 2; x < n; x++) if (n % x === 0) facs.push(x);
    const wrongs = [{text:String(m + 1), mis:'notAMultiple'}, {text:String(m - 1), mis:'notAMultiple'}, {text:String(n + k), mis:'notAMultiple'}];
    if (facs.length) wrongs[2] = {text:String(pick(facs)), mis:'factorMultipleSwap'};
    const opts = choiceOf({text:String(m)}, wrongs.filter(w => +w.text % n !== 0));
    const steps = [{name:'Pick the multiple', type:'concept', kind:'choice', prompt:`Which number is a multiple of ${n}?`, options:opts, hint:() => `Skip-count by ${n}s: ${n}, ${2 * n}, ${3 * n}, …`}];
    if (lvl >= 2) steps.push(numStep('Check it', 'compute', `${n} × ? = ${m}`, k, {fact:{x:n, y:k, div:true}}));
    return {title:'Cup Stacks', ctx:`multiple of ${n}`, bubble:`Cups come in stacks of ${n}. Which amount can I make with full stacks?`, helper:`Multiples of ${n} are ${n} times a whole number.`,
      visual:`<div style="text-align:center; font-size:1.6rem">🥤 stacks of ${n}</div>`, steps};
  },
  primeId(lvl){ return primeChoice('prime', lvl); },
  compositeId(lvl){ return primeChoice('composite', lvl); },
  primeComp(lvl){
    const pool = lvl === 1 ? [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 9, 15, 21, 25, 27, 12, 16, 18, 20, 22] : lvl === 2 ? [31, 37, 41, 43, 47, 53, 33, 35, 39, 45, 49, 51, 34, 38, 46] : [59, 61, 67, 71, 73, 79, 83, 89, 97, 57, 63, 69, 77, 87, 91, 93, 95, 1];
    const N = pick(pool), kind = N === 1 ? 'neither' : isPrime(N) ? 'prime' : 'composite';
    const opts = shuffle(['Prime', 'Composite', ...(lvl === 3 ? ['Neither'] : [])].map(t => ({html:t, text:t, ok:t.toLowerCase() === kind, mis:t.toLowerCase() === kind ? null : N === 1 ? 'oneIsPrime' : 'primeMixup'})));
    const steps = [{name:'Prime or composite', type:'concept', kind:'choice', prompt:`Is ${N} prime or composite?`, options:opts,
      hint:() => N === 1 ? '1 has only one factor, so it is neither.' : `Try dividing ${N} by 2, 3, 5, and 7.`}];
    if (kind === 'composite') { const f = smallestFactor(N); steps.push(numStep('Show a factor pair', 'compute', `${N} = ${f} × ?`, N / f, {fact:{x:f, y:N / f, div:true}})); }
    else if (kind === 'prime') steps.push(numStep('Its only factor pair', 'compute', `${N} = 1 × ?`, N));
    return {title:'Cup Stacks', ctx:`${N} prime or composite`, bubble:`Can ${N} cups be stacked in a rectangle with more than one row? Is ${N} prime or composite?`,
      helper:'A prime number has exactly two factors: 1 and itself.', visual:`<div style="text-align:center; font-size:1.8rem">🥤 ${N}</div>`, steps};
  },
  numPatterns(lvl){
    const a = rand(1, 12), d = rand(2, lvl === 1 ? 6 : 12);
    if (lvl === 3 && Math.random() < 0.5) {
      const m = rand(2, 3), s = rand(1, 4), seq = [s, s * m, s * m * m, s * m * m * m];
      const opts = choiceOf({text:`Multiply by ${m}`}, [{text:`Add ${seq[1] - seq[0]}`, mis:'patternWrongRule'}, {text:`Add ${m}`, mis:'patternWrongRule'}]);
      return {title:'Sign Patterns', ctx:`×${m} from ${s}`, bubble:`The sign counts ${seq.join(', ')}, … What's the rule, and what comes next?`, helper:'Check the rule on every pair of numbers, not just the first two.',
        visual:`<div style="text-align:center; font-size:1.6rem">🪧 ${seq.join(', ')}, ?</div>`,
        steps:[{name:'Find the rule', type:'concept', kind:'choice', prompt:'What is the rule?', options:opts, hint:() => `${seq[0]} to ${seq[1]}, then ${seq[1]} to ${seq[2]}. Is it the same amount added each time?`},
          numStep('Next number', 'compute', `${seq[3]} × ${m} = ?`, seq[3] * m, {mis:v => v === seq[3] + (seq[3] - seq[2]) ? 'patternWrongRule' : null})]};
    }
    const seq = [0, 1, 2, 3].map(i => a + i * d), nth = lvl === 1 ? 5 : rand(6, 8), val = a + (nth - 1) * d;
    const steps = lvl === 1
      ? [numStep('Next number', 'compute', `${seq.join(', ')}, ?`, a + 4 * d, {mis:v => v === a + 3 * d + 1 ? 'patternWrongRule' : null, hint:() => `Add ${d}.`})]
      : [numStep('Find the rule', 'concept', `${seq.join(', ')}, … What is added each time?`, d, {hint:() => `${seq[1]} − ${seq[0]} = ?`}),
         numStep(`The ${nth}th number`, 'compute', `What is the ${nth}th number?`, val, {mis:v => v === val - d || v === val + d ? 'patternOffByOne' : v === nth * d ? 'patternWrongRule' : null, hint:() => `Keep adding ${d} until you reach number ${nth}.`})];
    if (lvl >= 2) {
      const allOdd = seq.every(x => x % 2 === 1), allEven = seq.every(x => x % 2 === 0), right = allOdd ? 'All odd' : allEven ? 'All even' : 'Odd, even, odd, even';
      steps.push({name:'Odd or even', type:'concept', kind:'choice', prompt:'What do you notice about the numbers?', options:choiceOf({text:right}, ['All odd', 'All even', 'Odd, even, odd, even'].map(t => ({text:t, mis:'patternWrongRule'}))),
        hint:() => d % 2 === 0 ? `Adding an even number keeps odd numbers odd and even numbers even.` : 'Adding an odd number switches between odd and even.'});
    }
    return {title:'Sign Patterns', ctx:`start ${a}, add ${d}`, bubble:lvl === 1 ? `The sign counts ${seq.join(', ')}, … Rule: add ${d}. What comes next?` : `The sign counts ${seq.join(', ')}, …`,
      helper:'Find what changes from one number to the next.', visual:`<div style="text-align:center; font-size:1.6rem">🪧 ${seq.join(', ')}, …</div>`, steps};
  },
  shapePatterns(lvl){
    if (lvl === 3) {
      const start = rand(1, 5), d = rand(2, 4), nth = rand(5, 8), val = start + (nth - 1) * d;
      return {title:'Sign Patterns', ctx:`growing ${start} + ${d}`, bubble:`Figure 1 has ${start} cups, figure 2 has ${start + d}, figure 3 has ${start + 2 * d}. How many cups does figure ${nth} have?`,
        helper:'Find how many cups each new figure adds.', visual:`<div style="text-align:center; font-size:1.2rem; line-height:1.4">${[1, 2, 3].map(i => '🥤'.repeat(start + (i - 1) * d)).join('<br>')}</div>`,
        steps:[numStep('Cups added each time', 'concept', 'How many cups does each new figure add?', d),
          numStep(`Figure ${nth}`, 'compute', `How many cups in figure ${nth}?`, val, {mis:v => v === val - d || v === val + d ? 'patternOffByOne' : v === nth * d ? 'patternWrongRule' : null, hint:() => `Figure 3 has ${start + 2 * d}. Keep adding ${d}.`})]};
    }
    const len = lvl === 1 ? rand(2, 3) : rand(3, 4), core = shuffle(SHAPES).slice(0, len), nth = rand(len + 4, lvl === 1 ? 12 : 23), shape = core[(nth - 1) % len];
    const shown = Array.from({length:len * 2 + 1}, (_, i) => core[i % len]).join(' ');
    const near = [core[(nth - 2 + len) % len], core[nth % len]];
    const opts = shuffle(core.map(s => ({html:`<span style="font-size:1.6rem">${s}</span>`, text:s, ok:s === shape, mis:s === shape ? null : near.includes(s) ? 'patternOffByOne' : 'patternWrongRule'})));
    return {title:'Sign Patterns', ctx:`${core.join('')} #${nth}`, bubble:`My sign repeats these shapes. Which shape is number ${nth}?`,
      helper:'Find the part that repeats. Then count in groups of that size.', visual:`<div style="text-align:center; font-size:1.8rem">${shown} …</div>`,
      steps:[numStep('Shapes in the repeat', 'concept', 'How many shapes are in the part that repeats?', len, {hint:() => 'Find where the pattern starts over.'}),
        {name:`Shape ${nth}`, type:'compute', kind:'choice', prompt:`Which shape is number ${nth}?`, options:opts, hint:() => `${nth} ÷ ${len} = ${Math.floor(nth / len)} R ${nth % len}. The remainder tells you the place in the repeat${nth % len === 0 ? ' (0 means the last shape)' : ''}.`}]};
  }
};
function primeChoice(want, lvl){
  const top = lvl === 1 ? 30 : lvl === 2 ? 60 : 99;
  const primes = PRIMES.filter(p => p <= top && p > 2), comps = ODD_COMPOSITES.filter(c => c <= top);
  let right, wrongs;
  if (want === 'prime') {
    right = pick(primes);
    wrongs = shuffle(comps).slice(0, lvl === 1 ? 2 : 3).map(c => ({text:String(c), mis:'primeMixup'}));
    if (lvl >= 2) wrongs[wrongs.length - 1] = {text:'1', mis:'oneIsPrime'};
  } else {
    right = pick(comps);
    wrongs = shuffle(primes).slice(0, lvl === 1 ? 2 : 3).map(p => ({text:String(p), mis:'primeMixup'}));
    if (lvl >= 2) wrongs[wrongs.length - 1] = {text:'1', mis:'oneIsPrime'};
  }
  const opts = choiceOf({text:String(right)}, wrongs);
  const composite = want === 'prime' ? +(opts.find(o => !o.ok && o.text !== '1') || {text:'9'}).text : right;
  const f = smallestFactor(composite);
  return {title:'Cup Stacks', ctx:`which is ${want}: ${opts.map(o => o.text).join(', ')}`, bubble:`Which number is ${want}?`,
    helper:'Prime: exactly two factors (1 and itself). Composite: more than two.', visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${opts.map(o => o.text).join('  ')}</div>`,
    steps:[{name:`Pick the ${want} number`, type:'concept', kind:'choice', prompt:`Which number is ${want}?`, options:opts, hint:() => 'Odd numbers can be composite too: try dividing by 3, 5, and 7.'},
      numStep('Show a factor pair', 'compute', `${composite} is composite: ${composite} = ${f} × ?`, composite / f, {fact:{x:f, y:composite / f, div:true}})].slice(0, lvl === 1 ? 1 : 2)};
}
Object.assign(GEN, LEMON_GEN);

/* ===== 4th grade, Toy Shop stations 1 and 2 (Sadlier lessons 6 to 9): place value, rounding, adding and subtracting ===== */
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const PV_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
const PV_VALUES = [1, 10, 100, 1000, 10000, 100000];
const digitsFor = lvl => lvl === 1 ? 4 : lvl === 2 ? 5 : 6;
/* a whole number with n digits; zeros allowed inside (never first), at least `minNonZero` non-zero digits */
function pvNumber(n, {zeros = true, distinct = false} = {}){
  for (let t = 0; t < 200; t++){
    const d = [rand(1, 9)]; for (let i = 1; i < n; i++) d.push(zeros ? rand(0, 9) : rand(1, 9));
    if (distinct && new Set(d).size < n) continue;
    return Number(d.join(''));
  }
  return Number('123456'.slice(0, n));
}
const ONES_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_W = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function words3(n){   // 0..999
  const h = Math.floor(n / 100), r = n % 100, parts = [];
  if (h) parts.push(`${ONES_W[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES_W[r] : TENS_W[Math.floor(r / 10)] + (r % 10 ? '-' + ONES_W[r % 10] : ''));
  return parts.join(' ');
}
const numberWords = n => { const th = Math.floor(n / 1000), rest = n % 1000; return [th ? `${words3(th)} thousand` : '', rest ? words3(rest) : ''].filter(Boolean).join(' ') || 'zero'; };
const expandedParts = n => String(n).split('').map((d, i, a) => Number(d) * Math.pow(10, a.length - 1 - i)).filter(Boolean);
/* place-value blocks picture: 🟥 thousands, 🟧 hundreds, ▮ tens, ▪ ones */
const BLOCKS = [['▪', 'one'], ['▮', 'ten'], ['🟧', 'hundred'], ['🟥', 'thousand']];
function blocksHTML(counts){
  const groups = counts.map((c, i) => c ? `<div class="pv-group"><div class="pv-blocks">${BLOCKS[i][0].repeat(c)}</div><small>${c} ${BLOCKS[i][1]}${c === 1 ? '' : 's'}</small></div>` : '').reverse().join('');
  return `<div class="pv-pic">${groups}</div><div class="pv-key">🟥 = 1,000 · 🟧 = 100 · ▮ = 10 · ▪ = 1</div>`;
}
function pvTableHTML(n, hide){
  const s = String(n), cols = s.length;
  const head = PV_NAMES.slice(0, cols).reverse().map(p => `<th>${p.replace('hundred thousands', 'hundred th.').replace('ten thousands', 'ten th.')}</th>`).join('');
  const row = s.split('').map((d, i) => `<td>${hide === i ? '?' : d}</td>`).join('');
  return `<table class="pv-table"><tr>${head}</tr><tr>${row}</tr></table>`;
}
/* column addition and subtraction reuse the Scale's answer boxes (whole numbers have no decimal places) */
function wholeColumnStep(a, b, op){
  const exact = op === '+' ? a + b : a - b, sa = String(a), sb = String(b), k = x => x * 1000;
  const noCarry = op === '+' ? noCarryK(k(a), k(b)) / 1000 : smallerFromLargerK(k(a), k(b)) / 1000;
  return {name:op === '+' ? 'Add' : 'Subtract', type:'compute', kind:'digits', prompt:`${commas(a)} ${op === '+' ? '+' : '−'} ${commas(b)} = ?`,
    answer:String(exact), eq:v => v === exact, dig:digitLayout(sa, sb, op, k(exact)), slowOK:true,
    mis:v => v !== exact && v === noCarry ? (op === '+' ? 'noRegroup' : 'smallerFromLarger') : null,
    hint:() => op === '+' ? 'Add each column from the right. When a column makes 10 or more, carry the 1.' : 'Subtract from the right. When the top digit is smaller, regroup from the next column.'};
}
const TOY_ITEMS = [['🧸', 'teddy bears'], ['🪀', 'yo-yos'], ['🧩', 'puzzle pieces'], ['🎲', 'dice'], ['🪁', 'kites'], ['🚂', 'toy trains']];
const TOYS_GEN = {
  pvBlocks(lvl){
    const counts = lvl === 1 ? [rand(0, 9), rand(1, 9), rand(1, 9), 0] : lvl === 2 ? [rand(0, 9), rand(0, 9), rand(1, 9), rand(1, 4)] : [rand(0, 9), rand(0, 9), rand(0, 9), rand(1, 5)];
    if (lvl === 3 && Math.random() < 0.5) counts[rand(0, 2)] = rand(10, 13);          // more than 9 of a block: regroup in your head
    const n = counts.reduce((s, c, i) => s + c * PV_VALUES[i], 0);
    return {title:'Stock Room', ctx:`blocks ${counts.slice().reverse().join('-')}`, bubble:'I counted the blocks in the stock room. What number do they show?',
      helper:'Count each kind of block, then put the places together.', visual:blocksHTML(counts),
      steps:[{name:'Read the blocks', type:'concept', kind:'num', prompt:'What number do the blocks show?', answer:n, eq:v => v === n,
        mis:v => v !== n && v === Number(counts.slice().reverse().join('')) ? 'placeValueRegroup' : null,
        hint:() => counts.map((c, i) => c ? `${c} × ${commas(PV_VALUES[i])}` : '').filter(Boolean).reverse().join(' + ')}]};
  },
  pvTable(lvl){
    const n = pvNumber(digitsFor(lvl)), s = String(n), hide = rand(0, s.length - 1), place = s.length - 1 - hide;
    const read = Math.random() < 0.5;
    return {title:'Stock Room', ctx:`${commas(n)} table`, bubble:read ? 'This place-value table shows a number of toys. What is the number?' : `The table shows ${commas(n)}, with one digit hidden. What digit goes in the ${PV_NAMES[place]} place?`,
      helper:'Each column is a place. Read the digits from left to right.', visual:pvTableHTML(n, read ? -1 : hide),
      steps:[read ? {name:'Read the table', type:'concept', kind:'num', prompt:'What number does the table show?', answer:n, eq:v => v === n, hint:() => 'Read the digits across, left to right.'}
        : {name:'Find the digit', type:'concept', kind:'num', prompt:`What digit is in the ${PV_NAMES[place]} place of ${commas(n)}?`, answer:Number(s[hide]), eq:v => v === Number(s[hide]),
          mis:v => v !== Number(s[hide]) && v === Number(s[s.length - 1 - (place + 1)] ?? -1) ? 'placeValueName' : null, hint:() => `Count places from the right: ones, tens, hundreds, thousands…`}]};
  },
  digitValue(lvl){
    const n = pvNumber(digitsFor(lvl), {distinct:true}), s = String(n), i = rand(0, s.length - 2), d = Number(s[i]), place = s.length - 1 - i, val = d * PV_VALUES[place];
    return {title:'Stock Room', ctx:`value of ${d} in ${commas(n)}`, bubble:`The price code is ${commas(n)}. What is the value of the ${d}?`,
      helper:'The value of a digit is the digit times its place.', visual:pvTableHTML(n, -1),
      steps:[{name:'Name the place', type:'concept', kind:'choice', prompt:`Which place is the ${d} in?`,
          options:choiceOf({text:PV_NAMES[place]}, [PV_NAMES[place - 1], PV_NAMES[place + 1] || PV_NAMES[place - 2]].filter(Boolean).map(t => ({text:t, mis:'placeValueName'}))), hint:() => 'Count from the right: ones, tens, hundreds, thousands…'},
        {name:'Its value', type:'compute', kind:'num', prompt:`What is the value of the ${d} in ${commas(n)}?`, answer:val, eq:v => v === val,
          mis:v => v !== val && (v === d || v === d * PV_VALUES[place - 1] || v === d * (PV_VALUES[place + 1] || 0)) ? 'digitNotValue' : null, hint:() => `${d} × ${commas(PV_VALUES[place])}.`}]};
  },
  largestSmallest(lvl){
    const n = digitsFor(lvl) - (lvl === 1 ? 0 : 1), ds = shuffle(Array.from({length:10}, (_, i) => i)).slice(0, n);
    if (lvl >= 2 && !ds.includes(0)) ds[0] = 0;                                     // a zero, which can't go first
    const big = Number([...ds].sort((x, y) => y - x).join('')), nz = [...ds].sort((x, y) => x - y), first = nz.find(x => x > 0);
    const small = Number([first, ...nz.filter((x, i) => i !== nz.indexOf(first))].join(''));
    const askBig = Math.random() < 0.5, ans = askBig ? big : small;
    return {title:'Stock Room', ctx:`${askBig ? 'largest' : 'smallest'} from ${ds.join(',')}`, bubble:`Use each of these digits once: ${ds.join(', ')}. Make the ${askBig ? 'largest' : 'smallest'} number you can.`,
      helper:askBig ? 'Put the biggest digit in the biggest place.' : 'Put the smallest digit first, but a number can\'t start with 0.', visual:`<div style="text-align:center; font-size:1.8rem">${ds.map(d => `🔢${d}`).join(' ')}</div>`,
      steps:[{name:askBig ? 'Largest number' : 'Smallest number', type:'concept', kind:'num', prompt:`What is the ${askBig ? 'largest' : 'smallest'} number?`, answer:ans, eq:v => v === ans,
        mis:v => v !== ans && (askBig ? v === small : (v === big || v === Number(nz.join('')))) ? 'placeOrder' : null, hint:() => askBig ? 'Order the digits from biggest to smallest.' : 'Smallest non-zero digit first, then the rest from smallest to biggest.'}]};
  },
  expandedForm(lvl){
    let n; do { n = pvNumber(digitsFor(lvl)); } while (expandedParts(n).length < 3);
    const parts = expandedParts(n), hideI = rand(0, parts.length - 1), hid = parts[hideI], d = Number(String(hid)[0]);
    const shown = parts.map((p, i) => i === hideI ? '?' : commas(p)).join(' + ');
    return {title:'Stock Room', ctx:`${commas(n)} expanded`, bubble:`Write ${commas(n)} in expanded form.`, helper:'Expanded form adds the value of every digit.',
      visual:`<div style="text-align:center; font-size:1.4rem">${commas(n)} = ${shown}</div>`,
      steps:[{name:'Missing part', type:'concept', kind:'num', prompt:`${commas(n)} = ${shown}. What is the missing part?`, answer:hid, eq:v => v === hid,
        mis:v => v !== hid && (v === d || v === hid / 10 || v === hid * 10) ? 'digitNotValue' : null, hint:() => `Find the digit that's missing, then write its value with zeros.`}]};
  },
  writtenForm(lvl){
    const n = pvNumber(digitsFor(lvl)), w = numberWords(n), s = String(n);
    const swapped = Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1));
    const wrongs = [{text:numberWords(Number(s.slice(0, -1) + '0') + (Number(s.slice(-1)) + 1) % 10), mis:'numberWords'}, {text:numberWords(swapped), mis:'numberWords'},
      {text:w.replace(' thousand', ' hundred'), mis:'numberWords'}].filter(o => o.text !== w);
    const toWords = Math.random() < 0.5;
    const nums = [n, swapped, Number(s.slice(0, -1) + ((Number(s.slice(-1)) + 1) % 10))].map(commas);
    return {title:'Stock Room', ctx:`${commas(n)} in words`, bubble:toWords ? `How do you write ${commas(n)} in words?` : `Which number is "${w}"?`,
      helper:'Say the thousands part first, then the rest.', visual:`<div style="text-align:center; font-size:1.4rem">${toWords ? commas(n) : w}</div>`,
      steps:[toWords ? {name:'Number to words', type:'concept', kind:'choice', prompt:`Which words say ${commas(n)}?`, options:choiceOf({text:w}, wrongs), hint:() => `Split at the comma: ${commas(Math.floor(n / 1000))} thousand, then ${n % 1000}.`}
        : {name:'Words to number', type:'concept', kind:'num', prompt:`Write "${w}" as a number.`, answer:n, eq:v => v === n, mis:v => v !== n && nums.slice(1).map(x => Number(x.replace(/,/g, ''))).includes(v) ? 'numberWords' : null, hint:() => 'Write the thousands part, then three digits for the rest (use zeros if a place is empty).'}]};
  },
  differentForms(lvl){
    let n; do { n = pvNumber(digitsFor(lvl)); } while (!String(n).slice(1, -1).includes('0') && Math.random() < 0.7);
    const parts = expandedParts(n), exp = parts.map(commas).join(' + ');
    const noZero = Number(parts.map(p => String(p)[0]).join(''));                 // leaving out the zero placeholders
    const wrongs = [{text:commas(noZero), mis:'missingPlaceholder'}, {text:commas(n * 10), mis:'missingPlaceholder'}, {text:commas(Number(String(n).split('').reverse().join('')) || n + 1), mis:'placeOrder'}].filter(o => o.text !== commas(n));
    return {title:'Stock Room', ctx:`${exp}`, bubble:`Which number is ${exp}?`, helper:'Each part fills one place. Empty places get a 0.',
      visual:`<div style="text-align:center; font-size:1.4rem">${exp}</div>`,
      steps:[{name:'Standard form', type:'concept', kind:'choice', prompt:`Which number equals ${exp}?`, options:choiceOf({text:commas(n)}, wrongs), hint:() => 'Line up the parts by place. A place with no part gets a 0.'}]};
  },
  regroup(lvl){
    const places = lvl === 1 ? [2, 1] : lvl === 2 ? [3, 2] : pick([[3, 2], [4, 3], [2, 1]]), [hi, lo] = places;
    const a = rand(1, 9), b = rand(10, lvl === 1 ? 19 : 29), n = a * PV_VALUES[hi] + b * PV_VALUES[lo];
    return {title:'Stock Room', ctx:`${a} ${PV_NAMES[hi]} ${b} ${PV_NAMES[lo]}`, bubble:`A box holds ${a} ${PV_NAMES[hi]} and ${b} ${PV_NAMES[lo]}. What number is that?`,
      helper:`10 ${PV_NAMES[lo]} make 1 of the next place.`, visual:`<div style="text-align:center; font-size:1.4rem">${a} ${PV_NAMES[hi]} + ${b} ${PV_NAMES[lo]}</div>`,
      steps:[{name:'Regroup', type:'concept', kind:'num', prompt:`${b} ${PV_NAMES[lo]} = ? ${PV_NAMES[hi]} and ${b % 10} ${PV_NAMES[lo]}`, answer:Math.floor(b / 10), eq:v => v === Math.floor(b / 10), hint:() => `Every 10 ${PV_NAMES[lo]} make 1 of the ${PV_NAMES[hi]}.`},
        {name:'The number', type:'compute', kind:'num', prompt:`${a} ${PV_NAMES[hi]} and ${b} ${PV_NAMES[lo]} = ?`, answer:n, eq:v => v === n,
          mis:v => v !== n && v === Number(`${a}${b}`) * PV_VALUES[lo] ? 'placeValueRegroup' : null, hint:() => `${a} × ${commas(PV_VALUES[hi])} + ${b} × ${commas(PV_VALUES[lo])}.`}]};
  },
  mult10(lvl){
    const n = lvl === 1 ? rand(2, 99) : lvl === 2 ? rand(10, 999) * (Math.random() < 0.5 ? 10 : 1) : rand(100, 9999), times = lvl === 3 ? pick([10, 100]) : 10, ans = n * times;
    return {title:'Stock Room', ctx:`${n} × ${times}`, bubble:`Toys come in crates of ${times}. How many toys are in ${commas(n)} crates?`, helper:`Times 10 moves every digit one place to the left.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(n)} × ${times}</div>`,
      steps:[{name:'Multiply', type:'compute', kind:'num', prompt:`${commas(n)} × ${times} = ?`, answer:ans, eq:v => v === ans, mis:v => v !== ans && (v === n * times * 10 || v === n * times / 10 || v === n + times) ? 'shiftWrong' : null, hint:() => `Write ${commas(n)} and put ${times === 10 ? 'a 0' : 'two 0s'} on the end.`}]};
  },
  div10(lvl){
    const q = lvl === 1 ? rand(2, 99) : lvl === 2 ? rand(10, 999) : rand(100, 9999), by = lvl === 3 ? pick([10, 100]) : 10, n = q * by;
    return {title:'Stock Room', ctx:`${n} ÷ ${by}`, bubble:`${commas(n)} toys are packed into crates of ${by}. How many crates?`, helper:`Divided by 10 moves every digit one place to the right.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(n)} ÷ ${by}</div>`,
      steps:[{name:'Divide', type:'compute', kind:'num', prompt:`${commas(n)} ÷ ${by} = ?`, answer:q, eq:v => v === q, mis:v => v !== q && (v === q * 10 || v === q / 10 || v === n * by) ? 'shiftWrong' : null, hint:() => `Take ${by === 10 ? 'one 0' : 'two 0s'} off the end of ${commas(n)}.`}]};
  },
  compareNums(lvl){
    let a, b;
    const n = digitsFor(lvl);
    if (Math.random() < 0.4) { a = pvNumber(n); b = pvNumber(n - 1); if (Number(String(b)[0]) <= Number(String(a)[0])) b = Number('9' + String(b).slice(1)); }   // fewer digits but a bigger first digit
    else { a = pvNumber(n); const s = String(a).split(''), i = rand(1, n - 1); s[i] = String((Number(s[i]) + rand(1, 8)) % 10); b = Number(s.join('')); }
    if (Math.random() < 0.5) [a, b] = [b, a];
    if (a === b) b = a + 1;
    const right = a > b ? '>' : '<';
    const diffLen = String(a).length !== String(b).length;
    const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:diffLen ? 'moreDigitsBigger' : 'compareDigits'})));
    return {title:'Stock Room', ctx:`${commas(a)} ? ${commas(b)}`, bubble:`Which shelf has more toys: ${commas(a)} or ${commas(b)}?`, helper:'More digits means bigger. Same number of digits: compare from the left.',
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(a)} ◯ ${commas(b)}</div>`,
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${commas(a)} ◯ ${commas(b)}. Which symbol goes in the circle?`, options:opts.map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
        hint:() => diffLen ? 'Count the digits first. The number with more digits is bigger.' : 'Start at the left. Find the first place where the digits are different.'}]};
  },
  compareForms(lvl){
    const n = pvNumber(digitsFor(lvl) - 1), parts = expandedParts(n);
    const other = Math.random() < 0.3 ? n : n + pick([1, -1]) * PV_VALUES[rand(0, String(n).length - 2)];
    const form = pick(['expanded', 'words', 'units']);
    const show = form === 'expanded' ? parts.map(commas).join(' + ') : form === 'words' ? numberWords(n) : String(n).split('').map((d, i, a) => d !== '0' ? `${d} ${PV_NAMES[a.length - 1 - i]}` : '').filter(Boolean).join(' ');
    const right = n > other ? '>' : n < other ? '<' : '=';
    return {title:'Stock Room', ctx:`${show} ? ${commas(other)}`, bubble:`Compare: ${show} and ${commas(other)}.`, helper:'Write both as regular numbers first, then compare.',
      visual:`<div style="text-align:center; font-size:1.3rem">${show}<br>◯ ${commas(other)}</div>`,
      steps:[{name:'Write it as a number', type:'concept', kind:'num', prompt:`Write ${show} as a number.`, answer:n, eq:v => v === n, mis:v => v !== n && v === Number(parts.map(p => String(p)[0]).join('')) ? 'missingPlaceholder' : null, hint:() => 'Put each part in its place. Empty places get a 0.'},
        {name:'Compare', type:'concept', kind:'choice', prompt:`${commas(n)} ◯ ${commas(other)}`, options:choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:'compareDigits'}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})), hint:() => 'Compare from the left.'}]};
  },
  roundNum(lvl){ return roundProblem(lvl, false); },
  roundPlaces(lvl){ return roundProblem(lvl, true); },
  roundWord(lvl){
    const [e, item] = pick(TOY_ITEMS), place = lvl === 1 ? 1 : lvl === 2 ? 2 : 3, n = pvNumber(digitsFor(lvl)), r = roundTo(n, place), unit = PV_VALUES[place];
    const story = pick([`The toy shop sold ${commas(n)} ${item} this year. About how many is that, to the nearest ${PV_NAMES[place].replace(/s$/, '')}?`,
      `A crate holds ${commas(n)} ${item}. Round the number to the nearest ${PV_NAMES[place].replace(/s$/, '')} for the order form.`]);
    return {title:'Price Tags', ctx:`${commas(n)} to ${unit}`, bubble:story, helper:'Find the place, then look at the digit to its right.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(n)}</div>`,
      steps:roundSteps(n, place)};
  },
  addMulti(lvl){
    const n = digitsFor(lvl) - (lvl === 3 ? 1 : 0); let a, b;
    do { a = pvNumber(n); b = pvNumber(n - (Math.random() < 0.4 ? 1 : 0)); } while (lvl >= 2 && noCarryK(a * 1000, b * 1000) === (a + b) * 1000);   // levels 2 and 3 always carry
    const [e, item] = pick(TOY_ITEMS);
    return {title:'Price Tags', ctx:`${a} + ${b}`, bubble:`The shop had ${commas(a)} ${item} and got ${commas(b)} more. How many now?`, helper:'Line up the places and add from the right.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(a)} + ${commas(b)}</div>`, steps:[wholeColumnStep(a, b, '+')]};
  },
  subMulti(lvl){
    const n = digitsFor(lvl) - (lvl === 3 ? 1 : 0); let a, b;
    do { a = pvNumber(n); b = pvNumber(n - (Math.random() < 0.4 ? 1 : 0)); if (b > a) [a, b] = [b, a]; } while (a === b || (lvl >= 2 && smallerFromLargerK(a * 1000, b * 1000) === (a - b) * 1000));   // levels 2 and 3 always regroup
    if (lvl === 3 && Math.random() < 0.5) { a = Number(String(a)[0] + '0'.repeat(n - 1)); if (b >= a) b = pvNumber(n - 1); }   // across zeros: 5,000 − 1,234
    const [e, item] = pick(TOY_ITEMS);
    return {title:'Price Tags', ctx:`${a} − ${b}`, bubble:`The shop had ${commas(a)} ${item} and sold ${commas(b)}. How many are left?`, helper:'Line up the places and subtract from the right. Regroup when the top digit is smaller.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(a)} − ${commas(b)}</div>`, steps:[wholeColumnStep(a, b, '-')]};
  }
};
const roundTo = (n, place) => Math.round(n / PV_VALUES[place]) * PV_VALUES[place];
function roundSteps(n, place){
  const unit = PV_VALUES[place], lo = Math.floor(n / unit) * unit, hi = lo + unit, r = roundTo(n, place), look = Math.floor(n / PV_VALUES[place - 1]) % 10;
  const word = PV_NAMES[place].replace(/s$/, '');
  return [{name:'Between which two?', type:'concept', kind:'choice', prompt:`${commas(n)} is between which two ${PV_NAMES[place]}?`,
      options:choiceOf({text:`${commas(lo)} and ${commas(hi)}`}, [{text:`${commas(lo - unit)} and ${commas(lo)}`, mis:'roundWrong'}, {text:`${commas(hi)} and ${commas(hi + unit)}`, mis:'roundWrong'}]), hint:() => `Keep the digits up to the ${word}s place, then make the rest zeros.`},
    {name:'Round', type:'concept', kind:'num', prompt:`Round ${commas(n)} to the nearest ${word}.`, answer:r, eq:v => v === r, drill:['ten', 'hundred', 'thousand'].includes(word) ? {type:'rounding', key:word} : undefined,
      mis:v => v !== r && (v === (r === lo ? hi : lo) || v === Math.floor(n / PV_VALUES[place - 1]) * PV_VALUES[place - 1]) ? 'roundWrong' : null,
      hint:() => `Look at the ${PV_NAMES[place - 1]} digit: it's ${look}. ${look >= 5 ? '5 or more rounds up.' : 'Less than 5 rounds down.'}`}];
}
function roundProblem(lvl, anyPlace){
  const n = pvNumber(digitsFor(lvl)), maxPlace = String(n).length - 1, place = anyPlace ? rand(1, maxPlace) : (lvl === 1 ? pick([1, 2]) : lvl === 2 ? pick([2, 3]) : pick([3, 4]));
  return {title:'Price Tags', ctx:`${commas(n)} to ${PV_VALUES[place]}`, bubble:`Round the price code ${commas(n)} to the nearest ${PV_NAMES[place].replace(/s$/, '')}.`,
    helper:'Find the place, then look at the digit just to its right: 5 or more rounds up.', visual:`<div style="text-align:center; font-size:1.8rem">🏷️ ${commas(n)}</div>`,
    steps:roundSteps(n, Math.min(place, maxPlace))};
}
Object.assign(GEN, TOYS_GEN);

/* ===== 4th grade, Toy Shop stations 3 and 4 (Sadlier lessons 10 to 13): multiplying and dividing ===== */
/* area model: a rectangle split by place value; cells hold a value, '?' (being asked), or '' (not yet) */
function areaHTML(cols, rows, cells, {total = null} = {}){
  const w = cols.map(c => Math.max(3, Math.min(9, String(c).length * 2 + 1)));
  const head = `<tr><th></th>${cols.map((c, i) => `<th style="width:${w[i]}em">${commas(c)}</th>`).join('')}</tr>`;
  const body = rows.map((r, i) => `<tr><th>${commas(r)}</th>${cols.map((c, j) => { const v = cells[i]?.[j]; return `<td class="${v === '?' ? 'ask' : ''}">${v === '?' ? '?' : v === '' || v == null ? '' : commas(v)}</td>`; }).join('')}</tr>`).join('');
  return `<table class="area-model">${head}${body}</table>${total != null ? `<div class="area-total">Total area: ${commas(total)}</div>` : ''}`;
}
const splitPlaces = n => expandedParts(n);
const TOY_BOX = [['🧸', 'teddy bears'], ['🪀', 'yo-yos'], ['🎲', 'dice'], ['🪁', 'kites'], ['🚂', 'toy trains'], ['🧩', 'puzzles']];
/* the final answer step: skipped in practice (the layout already shows it), the only step in answer-only quizzes */
const finalAnswer = (prompt, answer) => answer && Array.isArray(answer)
  ? {name:'The answer', type:'compute', kind:'qr', prompt, answer, eq:v => Array.isArray(v) && v[0] === answer[0] && v[1] === answer[1], skipIf:() => true}
  : {name:'The answer', type:'compute', kind:'num', prompt, answer, eq:v => v === answer, skipIf:() => true};
const TOYS2_GEN = {
  mult1by10s(lvl){
    const d = rand(2, 9), p = lvl === 1 ? pick([10, 100]) : pick([10, 100, 1000]), m = lvl === 1 ? 1 : rand(1, 9), f = m * p, ans = d * f;
    const missing = lvl === 3 && Math.random() < 0.5;
    return {title:'Toy Crates', ctx:missing ? `${d} × ? = ${ans}` : `${d} × ${f}`, bubble:missing ? `${d} crates hold ${commas(ans)} toys. How many toys are in each crate?` : `There are ${d} crates with ${commas(f)} toys in each. How many toys?`,
      helper:'Multiply the basic fact, then write the zeros.', visual:`<div style="text-align:center; font-size:1.6rem">${d} × ${missing ? '?' : commas(f)}${missing ? ` = ${commas(ans)}` : ''}</div>`,
      steps:[missing
        ? {name:'Missing factor', type:'compute', kind:'num', prompt:`${d} × ? = ${commas(ans)}`, answer:f, eq:v => v === f, fact:{x:d, y:m, div:true}, mis:v => v !== f && (v === f * 10 || v === f / 10) ? 'shiftWrong' : null, hint:() => `${d} × ${m} = ${d * m}. How many zeros are left over?`}
        : {name:'Multiply', type:'compute', kind:'num', prompt:`${d} × ${commas(f)} = ?`, answer:ans, eq:v => v === ans, fact:{x:d, y:m}, mis:v => v !== ans && (v === ans * 10 || v === ans / 10) ? 'shiftWrong' : null, hint:() => `${d} × ${m} = ${d * m}, then write ${String(p).length - 1} zero${p === 10 ? '' : 's'}.`}]};
  },
  areaMult1(lvl){
    const n = lvl === 1 ? rand(12, 49) : lvl === 2 ? rand(21, 99) : rand(101, 399), d = rand(3, 9), parts = splitPlaces(n), prods = parts.map(p => p * d), total = n * d;
    const steps = parts.map((p, j) => ({name:`${commas(p)} × ${d}`, type:'compute', kind:'num', prompt:`${commas(p)} × ${d} = ?`, answer:p * d, eq:v => v === p * d,
      fact:{x:Number(String(p)[0]), y:d}, work:areaHTML(parts, [d], [prods.map((q, k) => k < j ? q : k === j ? '?' : '')]), hint:() => `${String(p)[0]} × ${d}, then the zeros.`}));
    steps.push({name:'Add the parts', type:'compute', kind:'num', prompt:`${prods.map(commas).join(' + ')} = ?`, answer:total, eq:v => v === total, work:areaHTML(parts, [d], [prods]),
      mis:v => v !== total && v === n + d ? 'addFactors' : null, hint:() => 'Add the areas of the parts.'});
    return {title:'Toy Crates', ctx:`${n} × ${d} area`, bubble:`A toy mat is ${n} squares long and ${d} squares wide. How many squares is it?`, helper:'Split the long side by place value, find each part, then add.',
      visual:`<div style="text-align:center; font-size:1.6rem">${n} × ${d}</div>`, steps, answerSteps:[steps.length - 1]};   // the area model is drawn with each step
  },
  distMult(lvl){
    const n = lvl === 1 ? rand(101, 999) : rand(1001, lvl === 2 ? 4999 : 9999), d = rand(3, 9), parts = splitPlaces(n), total = n * d;
    const right = parts.map(p => `${commas(p)} × ${d}`).join(' + ');
    const opts = choiceOf({text:right}, [{text:parts.map(commas).join(' + ') + ` + ${d}`, mis:'distributeWrong'}, {text:`${commas(parts[0])} × ${d} + ${parts.slice(1).map(commas).join(' + ')}`, mis:'distributeWrong'}]);
    return {title:'Toy Crates', ctx:`${n} × ${d} distributive`, bubble:`Break ${commas(n)} × ${d} into easier parts to find the answer.`, helper:'Split the big number by place value and multiply every part.',
      visual:`<div style="text-align:center; font-size:1.5rem">${commas(n)} × ${d}</div>`,
      steps:[{name:'Break it apart', type:'concept', kind:'choice', prompt:`Which is the same as ${commas(n)} × ${d}?`, options:opts, hint:() => `Every part of ${commas(n)} gets multiplied by ${d}.`},
        ...parts.map(p => ({name:`${commas(p)} × ${d}`, type:'compute', kind:'num', prompt:`${commas(p)} × ${d} = ?`, answer:p * d, eq:v => v === p * d, fact:{x:Number(String(p)[0]), y:d}})),
        {name:'Add', type:'compute', kind:'num', prompt:`${parts.map(p => commas(p * d)).join(' + ')} = ?`, answer:total, eq:v => v === total}]};
  },
  estProducts(lvl){
    const n = lvl === 1 ? rand(21, 98) : lvl === 2 ? rand(201, 989) : rand(2001, 9899), d = rand(3, 9), place = String(n).length - 1;
    const unit = PV_VALUES[place], r = Math.round(n / unit) * unit, est = r * d;
    if (n % unit === 0 || (n % unit) === unit / 2) return TOYS2_GEN.estProducts(lvl);
    return {title:'Toy Crates', ctx:`about ${n} × ${d}`, bubble:`About how many toys are in ${d} boxes of ${commas(n)}?`, helper:'Round to the biggest place, then multiply.',
      visual:`<div style="text-align:center; font-size:1.6rem">about ${commas(n)} × ${d}</div>`,
      steps:[{name:'Round', type:'concept', kind:'num', prompt:`Round ${commas(n)} to the nearest ${PV_NAMES[place].replace(/s$/, '')}.`, answer:r, eq:v => v === r, drill:{type:'rounding', key:PV_NAMES[place].replace(/s$/, '')},
          mis:v => v !== r && v === (r > n ? r - unit : r + unit) ? 'roundWrong' : null},
        {name:'Estimate', type:'compute', kind:'num', prompt:`${commas(r)} × ${d} = ?`, answer:est, eq:v => v === est, fact:{x:r / unit, y:d}, mis:v => v !== est && (v === est * 10 || v === est / 10) ? 'shiftWrong' : null}]};
  },
  multRegroup(lvl){
    let a, d;
    do { a = lvl === 1 ? rand(12, 99) : lvl === 2 ? rand(102, 999) : rand(1002, 9999); d = rand(3, 9); } while (String(a).split('').every(x => Number(x) * d < 10));   // at least one carry
    const L = mulLayout(String(a), String(d)), total = a * d;
    return {title:'Toy Crates', ctx:`${a} × ${d}`, bubble:`A shelf holds ${commas(a)} toys. How many toys are on ${d} shelves?`, helper:'Multiply each digit from the right. Carry the tens to the next place.',
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(a)} × ${d}</div>`,
      steps:[{name:'Multiply', type:'compute', kind:'mulrow', mul:L, row:0, prompt:`${commas(a)} × ${d} = ?`, answer:total, eq:v => v === total, fact:{x:d, y:Math.max(...String(a).split('').map(Number))}, slowOK:true,
          mis:v => v !== total && v === Number(String(a).split('').map(x => (Number(x) * d) % 10).join('')) ? 'noCarryMult' : null, hint:() => 'Multiply the ones first. Write the ones digit and carry the tens.'},
        finalAnswer(`${commas(a)} × ${d} = ?`, total)], answerSteps:[1]};
  },
  areaMult2(lvl){
    const a = lvl === 1 ? rand(11, 29) : rand(21, 99), b = lvl === 1 ? rand(11, 19) : rand(12, 99), A = splitPlaces(a), B = splitPlaces(b);
    const cells = B.map(r => A.map(c => r * c)), total = a * b, flat = cells.flat(), order = [];
    B.forEach((r, i) => A.forEach((c, j) => order.push([i, j])));
    const shown = k => B.map((r, i) => A.map((c, j) => { const idx = order.findIndex(([x, y]) => x === i && y === j); return idx < k ? cells[i][j] : idx === k ? '?' : ''; }));
    const steps = order.map(([i, j], k) => ({name:`${B[i]} × ${A[j]}`, type:'compute', kind:'num', prompt:`${B[i]} × ${A[j]} = ?`, answer:cells[i][j], eq:v => v === cells[i][j],
      fact:{x:Number(String(B[i])[0]), y:Number(String(A[j])[0])}, work:areaHTML(A, B, shown(k)), mis:v => v !== cells[i][j] && (v * 10 === cells[i][j] || v === cells[i][j] * 10) ? 'shiftWrong' : null}));
    steps.push({name:'Add the parts', type:'compute', kind:'num', prompt:`${flat.map(commas).join(' + ')} = ?`, answer:total, eq:v => v === total, work:areaHTML(A, B, cells),
      mis:v => v !== total && v === (A[0] * B[0] + A[A.length - 1] * B[B.length - 1]) ? 'partialMissing' : null, hint:() => 'Add all four parts.'});
    return {title:'Toy Crates', ctx:`${a} × ${b} area`, bubble:`The toy rug is ${a} squares by ${b} squares. How many squares is that?`, helper:'Split both numbers into tens and ones. Find all four parts, then add.',
      visual:`<div style="text-align:center; font-size:1.6rem">${a} × ${b}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  partialProd2(lvl){
    const a = lvl === 1 ? rand(11, 39) : rand(21, 99), b = lvl === 1 ? rand(11, 29) : rand(12, 99), [at, ao] = [a - a % 10, a % 10], [bt, bo] = [b - b % 10, b % 10];
    const pairs = [[bo, ao], [bo, at], [bt, ao], [bt, at]].filter(([x, y]) => x && y), total = a * b;
    const steps = pairs.map(([x, y]) => ({name:`${x} × ${y}`, type:'compute', kind:'num', prompt:`${x} × ${y} = ?`, answer:x * y, eq:v => v === x * y,
      fact:{x:Number(String(x)[0]), y:Number(String(y)[0])}, mis:v => v !== x * y && (v * 10 === x * y || v === x * y * 10) ? 'shiftWrong' : null}));
    steps.push({name:'Add the partial products', type:'compute', kind:'num', prompt:`${pairs.map(([x, y]) => commas(x * y)).join(' + ')} = ?`, answer:total, eq:v => v === total,
      mis:v => v !== total && v === at * bt + ao * bo ? 'partialMissing' : null});
    return {title:'Toy Crates', ctx:`${a} × ${b} partial products`, bubble:`Find ${a} × ${b} with partial products: multiply every part of one number by every part of the other.`, helper:'Ones × ones, ones × tens, tens × ones, tens × tens. Then add them all.',
      visual:`<div style="text-align:center; font-size:1.6rem">${a} × ${b}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  mult2digit(lvl){
    let a, b; do { a = rand(lvl === 1 ? 11 : 21, lvl === 3 ? 99 : 59); b = rand(12, lvl === 1 ? 29 : 99); } while (b % 10 === 0 || Math.floor(b / 10) === 0 || String(b).includes('0'));
    const L = mulLayout(String(a), String(b)), total = a * b;
    const steps = mulSteps(L, lvl, false, String(a), String(b)).filter(st => st.kind === 'mulrow');
    steps.push(finalAnswer(`${a} × ${b} = ?`, total));
    return {title:'Toy Crates', ctx:`${a} × ${b}`, bubble:`The toy shop orders ${a} boxes of ${b} toys. How many toys?`, helper:'Multiply by the ones digit, then by the tens digit (starting with a zero), then add.',
      visual:`<div style="text-align:center; font-size:1.6rem">${a} × ${b}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  estDiv(lvl){ return estimateDivision(lvl, false); },
  estQuot(lvl){ return estimateDivision(lvl, true); },
  interpRem(lvl){
    const [e, item] = pick(TOY_BOX), d = rand(3, 9), q = rand(lvl === 1 ? 3 : 8, lvl === 1 ? 9 : 30), r = rand(1, d - 1), N = d * q + r, kind = pick(['all', 'full', 'left']);
    const story = kind === 'all' ? `${N} ${item} go in boxes of ${d}. How many boxes are needed for all of them?` : kind === 'full' ? `${N} ${item} go in boxes of ${d}. How many boxes are full?` : `${N} ${item} go in boxes of ${d}. How many are left over?`;
    const ans = kind === 'all' ? q + 1 : kind === 'full' ? q : r;
    return {title:'Sharing Shelves', ctx:`${N} ÷ ${d} ${kind}`, bubble:story, helper:'Divide, then decide what the remainder means.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${N} ÷ ${d}</div>`,
      steps:[{name:'Divide', type:'compute', kind:'qr', prompt:`${N} ÷ ${d} = ? R ?`, answer:[q, r], eq:v => Array.isArray(v) && v[0] === q && v[1] === r, hint:() => `${d} × ${q} = ${d * q}.`},
        {name:'What it means', type:'concept', kind:'num', prompt:kind === 'all' ? 'How many boxes are needed?' : kind === 'full' ? 'How many boxes are full?' : 'How many are left over?', answer:ans, eq:v => v === ans,
          mis:v => v !== ans && [q, q + 1, r].includes(v) ? 'remainderMeaning' : null, hint:() => kind === 'all' ? `The ${r} extra need one more box.` : kind === 'full' ? `The ${r} extra don't fill a box.` : 'That\'s the remainder.'}], answerSteps:[1]};
  },
  divRem(lvl){
    const d = rand(3, 9), q = rand(lvl === 1 ? 2 : 5, lvl === 1 ? 9 : lvl === 2 ? 12 : 19), r = rand(1, d - 1), N = d * q + r;
    return {title:'Sharing Shelves', ctx:`${N} ÷ ${d}`, bubble:`Share ${N} marbles equally into ${d} bags. How many in each bag, and how many are left?`, helper:'Find the biggest multiple that fits, then what is left.',
      visual:`<div style="text-align:center; font-size:1.6rem">🔵 ${N} ÷ ${d}</div>`,
      steps:[{name:'How many fit', type:'compute', kind:'num', prompt:`How many ${d}s fit in ${N}? (the biggest number that isn't more than ${N})`, answer:q, eq:v => v === q, fact:{x:d, y:q},
          mis:v => v !== q && (v > q ? 'quotientTooBig' : N - v * d >= d ? 'quotientTooSmall' : null), hint:() => `${d} × ${q} = ${d * q}, and ${d} × ${q + 1} = ${d * (q + 1)} is too many.`},
        {name:'Remainder', type:'compute', kind:'num', prompt:`${N} − ${d * q} = ?`, answer:r, eq:v => v === r},
        finalAnswer(`${N} ÷ ${d} = ? R ?`, [q, r])], answerSteps:[2]};
  },
  divPV(lvl){
    const d = rand(2, 9);
    let parts; do { const q = lvl === 1 ? rand(11, 49) : rand(101, 499); parts = splitPlaces(q); } while (lvl === 1 && parts.length < 2);
    const q = parts.reduce((s, x) => s + x, 0), N = q * d, dParts = parts.map(p => p * d);
    return {title:'Sharing Shelves', ctx:`${N} ÷ ${d} place value`, bubble:`Share ${commas(N)} stickers among ${d} friends. Split ${commas(N)} into ${dParts.map(commas).join(' + ')} to make it easier.`, helper:'Divide each part, then add the answers.',
      visual:`<div style="text-align:center; font-size:1.4rem">${commas(N)} ÷ ${d}<br>= (${dParts.map(commas).join(' + ')}) ÷ ${d}</div>`,
      steps:[...dParts.map((p, i) => ({name:`${commas(p)} ÷ ${d}`, type:'compute', kind:'num', prompt:`${commas(p)} ÷ ${d} = ?`, answer:parts[i], eq:v => v === parts[i], fact:{x:d, y:Number(String(parts[i])[0]), div:true},
          mis:v => v !== parts[i] && (v * 10 === parts[i] || v === parts[i] * 10) ? 'shiftWrong' : null})),
        {name:'Add', type:'compute', kind:'num', prompt:`${parts.join(' + ')} = ?`, answer:q, eq:v => v === q}], answerSteps:[dParts.length]};
  },
  areaDiv(lvl){
    const d = rand(3, 9), q = lvl === 1 ? rand(12, 49) : rand(112, 399), parts = splitPlaces(q).filter(Boolean), areas = parts.map(p => p * d), N = q * d;
    const steps = parts.map((p, k) => ({name:`${commas(areas[k])} ÷ ${d}`, type:'compute', kind:'num', prompt:`This part has an area of ${commas(areas[k])} and a height of ${d}. How long is it?`, answer:p, eq:v => v === p,
      fact:{x:d, y:Number(String(p)[0]), div:true}, work:areaHTML(parts.map((x, i) => i < k ? x : '?'), [d], [areas]), mis:v => v !== p && (v * 10 === p || v === p * 10) ? 'shiftWrong' : null}));
    steps.push({name:'Add the lengths', type:'compute', kind:'num', prompt:`${parts.join(' + ')} = ?`, answer:q, eq:v => v === q, work:areaHTML(parts, [d], [areas])});
    return {title:'Sharing Shelves', ctx:`${N} ÷ ${d} area`, bubble:`A rug has an area of ${commas(N)} square feet and is ${d} feet wide. How long is it? The area is split into parts to help.`,
      helper:'Area ÷ width = length. Find each part\'s length, then add.', visual:`<div class="area-total">Total area: ${commas(N)}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  divBy2345(lvl){ return toyLongDivision(lvl, [2, 3, 4, 5]); },
  divBy6789(lvl){ return toyLongDivision(lvl, [6, 7, 8, 9]); }
};
function estimateDivision(lvl, big){
  const d = rand(3, 9), scale = big ? 100 : 10;
  for (let t = 0; t < 200; t++){
    const k = rand(2, 9), good = d * k * scale, N = good + pick([-1, 1]) * rand(1, scale - 1);   // near a friendly multiple of d
    if (N <= 0 || N % d === 0) continue;
    const easy = w => w % (d * scale) === 0;
    const wrongs = [Math.round(N / scale) * scale, good + scale, good - scale].filter((w, i, a) => w > 0 && w !== good && !easy(w) && a.indexOf(w) === i).map(w => ({text:commas(w), mis:'compatibleNumber'}));
    if (wrongs.length < 2) continue;
    const q = good / d;
    return {title:'Sharing Shelves', ctx:`about ${N} ÷ ${d}`, bubble:`About how many toys go on each of ${d} shelves if there are ${commas(N)} toys?`, helper:`Pick a number close to ${commas(N)} that ${d} divides easily.`,
      visual:`<div style="text-align:center; font-size:1.6rem">about ${commas(N)} ÷ ${d}</div>`,
      steps:[{name:'Friendly number', type:'concept', kind:'choice', prompt:`Which number is close to ${commas(N)} and easy to divide by ${d}?`, options:choiceOf({text:commas(good)}, wrongs.slice(0, 2)),
          hint:() => `Use a ${d} times table fact: ${d} × ${k} = ${d * k}.`},
        {name:'Estimate', type:'compute', kind:'num', prompt:`${commas(good)} ÷ ${d} = ?`, answer:q, eq:v => v === q, fact:{x:d, y:k, div:true}, mis:v => v !== q && (v === q * 10 || v * 10 === q) ? 'shiftWrong' : null}]};
  }
  return TOYS2_GEN.divRem(lvl);
}
function toyLongDivision(lvl, divisors){
  const d = pick(divisors);
  for (let t = 0; t < 300; t++){
    const q = lvl === 1 ? rand(12, 99) : rand(102, 999), r = lvl === 3 && Math.random() < 0.5 ? rand(1, d - 1) : 0, N = q * d + r;
    if (String(N).length > 4) continue;
    const D = longDivision(N, d);
    if (lvl < 3 && D.q.includes(0)) continue;
    const [e, item] = pick(TOY_BOX), steps = divSteps(D, lvl);
    return {title:'Sharing Shelves', ctx:`${N} ÷ ${d}`, bubble:r ? `${commas(N)} ${item} are shared equally by ${d} stores. How many does each store get, and how many are left?` : `${commas(N)} ${item} are shared equally by ${d} stores. How many does each store get?`,
      helper:'One digit at a time: how many fit, multiply, subtract, bring down.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(N)} ÷ ${d}</div>`, steps, answerSteps:[steps.length - 1]};
  }
  return TOYS2_GEN.divRem(lvl);
}
/* ----- 4th grade sprint and practice pop-ups: factor pairs and rounding ----- */
function factorRows(n){
  const N = n || pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 54, 56, 60, 64, 72]), rows = [];
  for (let f = 1; f * f <= N; f++) if (N % f === 0) rows.push({label:`${N} = ${f} × `, answer:String(N / f)});
  return rows;
}
function roundingRows(key, n){
  const places = {ten:1, hundred:2, thousand:3}, place = places[key] || pick([1, 2, 3]), rows = [], unit = PV_VALUES[place];
  for (let i = 0; i < n; i++){
    let x; do { x = rand(unit + 1, unit * 99); } while (x % unit === 0 || x % unit === unit / 2);
    rows.push({label:`Round ${commas(x)} to the nearest ${PV_NAMES[place].replace(/s$/, '')}:`, answer:String(Math.round(x / unit) * unit), key:PV_NAMES[place].replace(/s$/, '')});
  }
  return rows;
}
Object.assign(GEN, TOYS2_GEN);

/* ===== 4th grade, Pizza Parlor stations 1 to 3 (Sadlier lessons 14 to 20): equivalent fractions, comparing, adding and subtracting ===== */
/* fraction bar: d equal parts, the first n shaded (n may be more than d: extra whole bars are drawn) */
function fracBarSVG(n, d, {w = 240, label = true} = {}){
  const bars = Math.max(1, Math.ceil(n / d)), h = 28, gap = 8, pw = w / d;
  let g = '';
  for (let b = 0; b < bars; b++){
    const y = b * (h + gap);
    for (let i = 0; i < d; i++){ const on = b * d + i < n; g += `<rect x="${1 + i * pw}" y="${y + 1}" width="${pw}" height="${h}" class="${on ? 'fb-on' : 'fb-off'}"/>`; }
  }
  return `<svg class="frac-bar" viewBox="0 0 ${w + 2} ${bars * (h + gap)}" width="${w + 2}" role="img" aria-label="${n} of ${d} equal parts shaded">${g}</svg>${label ? '' : ''}`;
}
/* number line from 0 to `top` (whole numbers) split into d parts per whole; a dot at n/d (null for none) */
function numberLineSVG(d, n, {top = 1, w = 280, labels = 'ends'} = {}){
  const L = 14, R = w - 14, y = 30, parts = d * top, step = (R - L) / parts;
  let g = `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" class="nl-line"/>`;
  for (let i = 0; i <= parts; i++){
    const x = L + i * step, whole = i % d === 0;
    g += `<line x1="${x}" y1="${y - (whole ? 10 : 6)}" x2="${x}" y2="${y + (whole ? 10 : 6)}" class="nl-line"/>`;
    if (whole) g += `<text x="${x}" y="${y + 26}" class="nl-text">${i / d}</text>`;
    else if (labels === 'all') g += `<text x="${x}" y="${y + 26}" class="nl-text nl-small">${i}/${d}</text>`;
  }
  if (n != null) g += `<circle cx="${L + n * step}" cy="${y}" r="7" class="nl-dot"/>`;
  return `<svg class="num-line" viewBox="0 0 ${w} 62" width="${w}" role="img" aria-label="number line from 0 to ${top} in ${d}ths">${g}</svg>`;
}
const fracTxt = (n, d) => `${n}/${d}`;
const mixedTxt = (w, n, d) => n ? `${w ? w + ' ' : ''}${n}/${d}` : String(w);
const PIZZA_KIDS = [['🧒', 'Mia'], ['👦', 'Leo'], ['👧', 'Ava'], ['🧑', 'Sam'], ['👩', 'Rosa'], ['👨', 'Ben']];
/* a fraction answer box that takes any equal fraction or mixed number (4th grade doesn't require simplest form) */
const fracStep = (name, prompt, p, q, extra = {}) => ({name, type:'compute', kind:'frac', prompt, answer:FRAC.simplest(p, q), eq:v => FRAC.same(v, p, q) && (!extra.mixedOnly || v[1] < v[2]), ...extra});
const PIZZA_GEN = {
  eqFracModel(lvl){
    const [a, b] = lvl === 1 ? [1, pick([2, 3, 4])] : properFrac(2, 6), k = rand(2, lvl === 3 ? 4 : 3), big = b * k, top = a * k;
    const down = lvl >= 2 && Math.random() < 0.5;          // from the many small parts back to the few big parts
    return {title:'Slices', ctx:down ? `${top}/${big} = ?/${b}` : `${a}/${b} = ?/${big}`, bubble:down ? `This pizza is cut into ${big} slices and ${top} are left. How many ${FRAC.part(b, true)} is that?` : `This pizza is cut into ${FRAC.part(b, true)}, and ${a} ${a === 1 ? 'is' : 'are'} left. If I cut every slice into ${k}, how many of the ${big} slices are left?`,
      helper:'Same amount of pizza, different number of slices.', visual:`<div class="frac-pics">${fracBarSVG(down ? top : a, down ? big : b)}${fracBarSVG(down ? a : top, down ? b : big)}</div>`,
      steps:[{name:'Equivalent fraction', type:'concept', kind:'num', prompt:down ? `${top}/${big} = ?/${b}` : `${a}/${b} = ?/${big}`, answer:down ? a : top, eq:v => v === (down ? a : top),
        mis:v => v !== (down ? a : top) && v === (down ? top - (big - b) : a + (big - b)) ? 'additiveEquiv' : null, drill:{type:'simplify', key:String(k)},
        hint:() => down ? `Every ${k} small slices make 1 big slice. ${top} ÷ ${k} = ?` : `Each ${FRAC.part(b)} becomes ${k} slices. ${a} × ${k} = ?`}]};
  },
  eqFracLine(lvl){
    const b = pick(lvl === 1 ? [2, 3, 4] : [3, 4, 5, 6]), k = rand(2, lvl === 1 ? 2 : 3), a = rand(1, b - 1), big = b * k;
    return {title:'Slices', ctx:`${a}/${b} on ${big}ths`, bubble:`The dot on the top line is at ${a}/${b}. Where is the same spot on the bottom line?`, helper:'Equal fractions sit at the same spot on the number line.',
      visual:`<div class="frac-pics">${numberLineSVG(b, a, {labels:'all'})}${numberLineSVG(big, null)}</div>`,
      steps:[{name:'Same point', type:'concept', kind:'num', prompt:`${a}/${b} = ?/${big}`, answer:a * k, eq:v => v === a * k, mis:v => v !== a * k && v === a + big - b ? 'additiveEquiv' : null, hint:() => `Each ${FRAC.part(b)} on top is ${k} jumps on the bottom line.`}]};
  },
  eqFrac(lvl){
    const [a, b] = properFrac(2, lvl === 1 ? 6 : 10), k = rand(2, lvl === 1 ? 4 : 6), top = a * k, big = b * k;
    if (lvl === 3) {
      const wrongs = [{text:fracTxt(a + k, b + k), mis:'additiveEquiv'}, {text:fracTxt(top, b), mis:'onlyOneScaled'}, {text:fracTxt(a * k, b * (k + 1)), mis:'onlyOneScaled'}];
      return {title:'Slices', ctx:`equivalent to ${top}/${big}`, bubble:`Which fraction is the same amount as ${top}/${big}?`, helper:'Multiply or divide the top and bottom by the same number.',
        visual:`<div style="text-align:center; font-size:1.8rem">${top}/${big}</div>`,
        steps:[{name:'Pick the equal fraction', type:'concept', kind:'choice', prompt:`Which fraction equals ${top}/${big}?`, options:choiceOf({text:fracTxt(a, b)}, wrongs), drill:{type:'simplify', key:String(k)}, hint:() => `Divide the top and bottom of ${top}/${big} by the same number.`}]};
    }
    const missTop = lvl === 1 || Math.random() < 0.5;
    return {title:'Slices', ctx:missTop ? `${a}/${b} = ?/${big}` : `${a}/${b} = ${top}/?`, bubble:`Find the missing number so the fractions are equal.`, helper:'Whatever you multiply the bottom by, multiply the top by the same.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} = ${missTop ? '?' : top}/${missTop ? big : '?'}</div>`,
      steps:[{name:'Missing number', type:'compute', kind:'num', prompt:missTop ? `${a}/${b} = ?/${big}` : `${a}/${b} = ${top}/?`, answer:missTop ? top : big, eq:v => v === (missTop ? top : big),
        fact:{x:missTop ? a : b, y:k}, mis:v => v !== (missTop ? top : big) && v === (missTop ? a + big - b : b + top - a) ? 'additiveEquiv' : null, hint:() => `${missTop ? b : a} × ${k} = ${missTop ? big : top}, so multiply the ${missTop ? 'top' : 'bottom'} by ${k} too.`}]};
  },
  diffWholes(lvl){
    if (lvl === 3) {
      const [e, n] = pick(PIZZA_KIDS), f = pick(['1/2', '1/4', '3/4']);
      const opts = choiceOf({text:'No. The large pizza is bigger, so its piece is bigger.'}, [{text:`Yes. They both ate ${f}.`, mis:'wholesMatter'}, {text:'No. The small pizza piece is bigger.', mis:'wholesMatter'}]);
      return {title:'Slices', ctx:`${f} of different wholes`, bubble:`${n} ate ${f} of a small pizza. Sam ate ${f} of a large pizza. Did they eat the same amount?`, helper:'A fraction is always a fraction of some whole.',
        visual:`<div style="text-align:center; font-size:1.6rem">🍕 small · 🍕🍕 large</div>`, steps:[{name:'Same whole?', type:'concept', kind:'choice', prompt:'Did they eat the same amount of pizza?', options:opts, hint:() => 'Half of a big thing is more than half of a small thing.'}]};
    }
    const b = pick([3, 4, 5, 6, 8]), a = rand(1, b - 1), k = lvl === 1 ? 1 : rand(2, 3), shown = a * k, whole = b * k;
    return {title:'Slices', ctx:`${shown} parts = ${a}/${b}`, bubble:`These ${shown} squares are ${a}/${b} of a tray. How many squares are in the whole tray?`, helper:'Find how many squares make 1 part, then count all the parts.',
      visual:`<div class="frac-pics">${fracBarSVG(shown, shown, {w:Math.min(240, shown * 30)})}<div style="text-align:center">= ${a}/${b} of the tray</div></div>`,
      steps:[...(k > 1 ? [{name:'One part', type:'concept', kind:'num', prompt:`${shown} squares are ${a} parts. How many squares are in 1 part?`, answer:k, eq:v => v === k, fact:{x:a, y:k, div:true}}] : []),
        {name:'The whole', type:'compute', kind:'num', prompt:`The whole tray is ${b} parts. How many squares?`, answer:whole, eq:v => v === whole, mis:v => v !== whole && v === shown + b ? 'additiveEquiv' : null, hint:() => `${b} parts × ${k} square${k === 1 ? '' : 's'} each.`}]};
  },
  commonDen(lvl){
    let b1, b2; do { b1 = rand(2, lvl === 1 ? 6 : 10); b2 = rand(2, lvl === 1 ? 6 : 12); } while (b1 === b2 || b1 * b2 / gcd(b1, b2) > (lvl === 3 ? 60 : 36) || (lvl === 1 && b2 % b1 !== 0 && b1 % b2 !== 0 && Math.random() < 0.6));
    const L = b1 * b2 / gcd(b1, b2), a1 = rand(1, b1 - 1), a2 = rand(1, b2 - 1);
    return {title:'Slices', ctx:`${a1}/${b1} and ${a2}/${b2}`, bubble:`Rewrite ${a1}/${b1} and ${a2}/${b2} so they have the same denominator.`, helper:'Find a number both denominators go into.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a1}/${b1} · ${a2}/${b2}</div>`,
      steps:[{name:'Common denominator', type:'concept', kind:'num', prompt:`What is the smallest number that both ${b1} and ${b2} go into?`, answer:L, eq:v => v === L, mis:v => v !== L && v === b1 + b2 ? 'additiveEquiv' : null, hint:() => `List multiples of ${Math.max(b1, b2)} until ${Math.min(b1, b2)} goes in too.`},
        {name:`Rewrite ${a1}/${b1}`, type:'compute', kind:'num', prompt:`${a1}/${b1} = ?/${L}`, answer:a1 * L / b1, eq:v => v === a1 * L / b1, fact:{x:a1, y:L / b1}, mis:v => v !== a1 * L / b1 && v === a1 + L - b1 ? 'additiveEquiv' : null},
        {name:`Rewrite ${a2}/${b2}`, type:'compute', kind:'num', prompt:`${a2}/${b2} = ?/${L}`, answer:a2 * L / b2, eq:v => v === a2 * L / b2, fact:{x:a2, y:L / b2}, mis:v => v !== a2 * L / b2 && v === a2 + L - b2 ? 'additiveEquiv' : null}]};
  },
  cmpVisual(lvl){
    let a, b, c, d; do { [a, b] = properFrac(2, lvl === 1 ? 6 : 8); [c, d] = properFrac(2, lvl === 1 ? 6 : 8); } while (b === d || a * d === b * c && lvl === 1);
    const right = a * d > b * c ? '>' : a * d < b * c ? '<' : '=';
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d} bars`, bubble:`Two pizzas the same size. Which piece is bigger: ${a}/${b} or ${c}/${d}?`, helper:'The bars are the same size, so compare how much is shaded.',
      visual:`<div class="frac-pics">${fracBarSVG(a, b)}<div style="text-align:center">${a}/${b}</div>${fracBarSVG(c, d)}<div style="text-align:center">${c}/${d}</div></div>`,
      steps:[compareStep(a, b, c, d, right)]};
  },
  cmpBench(lvl){
    let a, b, c, d;
    do { [a, b] = properFrac(2, 12); [c, d] = properFrac(2, 12); } while (2 * a === b || 2 * c === d || (2 * a < b) === (2 * c < d));   // one below 1/2, one above
    const right = a * d > b * c ? '>' : '<', side = (x, y) => 2 * x < y ? 'Less than 1/2' : 'More than 1/2';
    const bench = (x, y) => ({name:`${x}/${y} and 1/2`, type:'concept', kind:'choice', prompt:`Is ${x}/${y} more or less than 1/2?`,
      options:choiceOf({text:side(x, y)}, [{text:side(x, y) === 'Less than 1/2' ? 'More than 1/2' : 'Less than 1/2', mis:'benchmarkWrong'}]), hint:() => `Half of ${y} is ${y / 2}. Is ${x} more or less than that?`});
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d} benchmark`, bubble:`Compare ${a}/${b} and ${c}/${d}. Use 1/2 to help.`, helper:'If one is less than 1/2 and the other is more, you know which is bigger.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} ◯ ${c}/${d}</div>`, steps:[bench(a, b), bench(c, d), compareStep(a, b, c, d, right)]};
  },
  cmpFrac(lvl){
    let a, b, c, d; do { [a, b] = properFrac(2, lvl === 1 ? 6 : 10); [c, d] = properFrac(2, lvl === 1 ? 6 : 10); } while (b === d || a * d === b * c);
    const L = b * d / gcd(b, d), n1 = a * L / b, n2 = c * L / d, right = n1 > n2 ? '>' : '<';
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d}`, bubble:`Which is bigger: ${a}/${b} or ${c}/${d}?`, helper:'Give them the same denominator, then compare the numerators.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} ◯ ${c}/${d}</div>`,
      steps:[{name:`Rewrite ${a}/${b}`, type:'compute', kind:'num', prompt:`${a}/${b} = ?/${L}`, answer:n1, eq:v => v === n1, fact:{x:a, y:L / b}},
        {name:`Rewrite ${c}/${d}`, type:'compute', kind:'num', prompt:`${c}/${d} = ?/${L}`, answer:n2, eq:v => v === n2, fact:{x:c, y:L / d}},
        compareStep(a, b, c, d, right)]};
  },
  cmpFracWord(lvl){
    const [[e1, n1], [e2, n2]] = shuffle(PIZZA_KIDS).slice(0, 2);
    let a, b, c, d; do { [a, b] = properFrac(2, 8); [c, d] = properFrac(2, 8); } while (b === d || a * d === b * c);
    const first = a * d > b * c, what = pick([['pizza', 'ate', 'more pizza'], ['mile', 'ran', 'farther'], ['pitcher of lemonade', 'drank', 'more lemonade']]);
    const opts = shuffle([{html:n1, text:n1, ok:first, mis:first ? null : 'biggerDenBigger'}, {html:n2, text:n2, ok:!first, mis:!first ? null : 'biggerDenBigger'}]);
    return {title:'Which Is Bigger?', ctx:`${a}/${b} vs ${c}/${d} story`, bubble:`${n1} ${what[1]} ${a}/${b} of a ${what[0]}. ${n2} ${what[1]} ${c}/${d} of a ${what[0]}. Who ${what[1]} ${what[2]}?`, helper:'Compare the fractions the way you would with numbers alone.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e1} ${a}/${b} · ${e2} ${c}/${d}</div>`,
      steps:[{name:'Who has more?', type:'concept', kind:'choice', prompt:`Who ${what[1]} ${what[2]}?`, options:opts, hint:() => 'Rewrite both with the same denominator, or compare each to 1/2.'}]};
  },
  decompVisual(lvl){
    const d = pick([4, 5, 6, 8, 10]), n = rand(3, d - 1), s1 = rand(1, n - 1), s2 = n - s1;
    const wrongs = [{text:`${s1}/${d} + ${s2 + 1}/${d}`, mis:'decomposeSum'}, {text:`${s1 + 1}/${d} + ${s2 + 1}/${d}`, mis:'decomposeSum'}, {text:`${s1}/${d} + ${s2}/${d} + 1/${d}`, mis:'decomposeSum'}];
    return {title:'Toppings', ctx:`${n}/${d} = ${s1}/${d} + ${s2}/${d}`, bubble:`${n}/${d} of the pizza has toppings. Which sum shows the same amount?`, helper:'The parts must add up to the same number of slices.',
      visual:`<div class="frac-pics">${fracBarSVG(n, d)}<div style="text-align:center">${n}/${d}</div></div>`,
      steps:[{name:'Break it apart', type:'concept', kind:'choice', prompt:`Which sum equals ${n}/${d}?`, options:choiceOf({text:`${s1}/${d} + ${s2}/${d}`}, wrongs), hint:() => 'Add the numerators. The size of the slices stays the same.'}]};
  },
  decomp(lvl){
    if (lvl === 3) {
      const d = pick([3, 4, 5, 6, 8]), w = rand(1, 3), n = rand(1, d - 1), total = w * d + n;
      return {title:'Toppings', ctx:`${w} ${n}/${d} decomposed`, bubble:`Break ${w} ${n}/${d} into ${FRAC.part(d, true)}.`, helper:`Each whole is ${d}/${d}.`, visual:`<div style="text-align:center; font-size:1.8rem">${w} ${n}/${d}</div>`,
        steps:[{name:'Wholes as fractions', type:'compute', kind:'num', prompt:`${w} whole${w === 1 ? '' : 's'} = ?/${d}`, answer:w * d, eq:v => v === w * d, fact:{x:w, y:d}},
          {name:'Break it apart', type:'compute', kind:'num', prompt:`${w} ${n}/${d} = ${w * d}/${d} + ?/${d}`, answer:n, eq:v => v === n}]};
    }
    const d = pick([4, 5, 6, 8, 10, 12]), n = rand(3, d - 1), s1 = rand(1, n - 1);
    return {title:'Toppings', ctx:`${n}/${d} = ${s1}/${d} + ?`, bubble:`Complete the sum: ${n}/${d} = ${s1}/${d} + ?/${d}`, helper:'The numerators add up to the total. The denominator stays the same.',
      visual:`<div class="frac-pics">${fracBarSVG(n, d)}</div>`,
      steps:[{name:'Missing part', type:'compute', kind:'num', prompt:`${n}/${d} = ${s1}/${d} + ?/${d}`, answer:n - s1, eq:v => v === n - s1, mis:v => v !== n - s1 && v === n + s1 ? 'decomposeSum' : null, hint:() => `${s1} + ? = ${n}`}]};
  },
  addLike(lvl){ return likeFractions(lvl, '+'); },
  subLike(lvl){ return likeFractions(lvl, '−'); },
  fracWordAS(lvl){
    const [e, n] = pick(PIZZA_KIDS), d = pick([4, 5, 6, 8, 10, 12]), op = pick(['+', '−']);
    let a = rand(1, d - 1), b = rand(1, d - 1); if (op === '−' && a < b) [a, b] = [b, a]; if (op === '−' && a === b) a = Math.min(d - 1, a + 1), b = Math.max(1, b - 1);
    if (op === '+' && lvl === 1 && a + b > d) b = d - a || 1;
    const p = op === '+' ? a + b : a - b;
    const story = op === '+' ? `${n} put ${a}/${d} of the cheese on one pizza and ${b}/${d} on another. How much of the cheese did ${n} use?` : `There was ${a}/${d} of a pizza left. ${n} ate ${b}/${d} of the pizza. How much is left now?`;
    const opts = shuffle([{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'}, {html:'Subtract ( − )', text:'Subtract', ok:op === '−', mis:op === '−' ? null : 'wrongOperation'}]);
    return {title:'Toppings', ctx:`${a}/${d} ${op} ${b}/${d} story`, bubble:story, helper:'Decide whether the story puts together or takes away.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍕</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Add or subtract?', options:opts, drill:{type:'story', key:'addSub'}, hint:() => op === '+' ? 'Two amounts are put together.' : 'Some is taken away.'},
        fracStep(op === '+' ? 'Add' : 'Subtract', `${a}/${d} ${op} ${b}/${d} = ?`, p, d, {mis:v => fracMis(v, p, d, op === '+' ? [['addDenominators', a + b, 2 * d]] : []), hint:() => `${op === '+' ? 'Add' : 'Subtract'} the numerators. The slices stay ${FRAC.part(d, true)}.`})]};
  },
  mixedImproper(lvl){
    const d = pick([2, 3, 4, 5, 6, 8]), w = rand(1, lvl === 1 ? 3 : 6), n = rand(1, d - 1), top = w * d + n;
    if (Math.random() < 0.5) return {title:'Toppings', ctx:`${w} ${n}/${d} to improper`, bubble:`Write ${w} ${n}/${d} as an improper fraction.`, helper:`Each whole is ${d}/${d}.`, visual:`<div class="frac-pics">${fracBarSVG(top, d, {w:200})}</div>`,
      steps:[{name:'Wholes to fractions', type:'compute', kind:'num', prompt:`${w} whole${w === 1 ? '' : 's'} = ?/${d}`, answer:w * d, eq:v => v === w * d, fact:{x:w, y:d}},
        {name:'Improper fraction', type:'compute', kind:'num', prompt:`${w} ${n}/${d} = ?/${d}`, answer:top, eq:v => v === top, mis:v => v !== top && (v === w + n || v === w * d || v === w * n + d) ? 'improperWrong' : null, hint:() => `${w * d} + ${n} = ?`}]};
    return {title:'Toppings', ctx:`${top}/${d} to mixed`, bubble:`Write ${top}/${d} as a mixed number.`, helper:`How many wholes (${d}/${d}) fit in ${top}/${d}?`, visual:`<div class="frac-pics">${fracBarSVG(top, d, {w:200})}</div>`,
      steps:[{name:'Wholes', type:'compute', kind:'num', prompt:`How many wholes are in ${top}/${d}?`, answer:w, eq:v => v === w, fact:{x:d, y:w, div:true}},
        fracStep('Mixed number', `${top}/${d} = ?`, top, d, {mixedOnly:true, mis:v => FRAC.ok(v) && FRAC.same(v, top, d) && v[1] >= v[2] ? 'notMixed' : null, hint:() => `${w} wholes and ${n}/${d} left over.`})]};
  },
  mixedAS(lvl){ return mixedProblem(lvl, false); },
  mixedASregroup(lvl){ return mixedProblem(lvl, true); },
  mixedWord(lvl){
    const [e, n] = pick(PIZZA_KIDS), p = mixedProblem(lvl, lvl === 3), [w1, n1, w2, n2, d, op] = p.nums;
    p.bubble = op === '+' ? `${n} used ${mixedTxt(w1, n1, d)} cups of flour for the dough and ${mixedTxt(w2, n2, d)} cups for the crust. How many cups in all?`
                          : `${n} had ${mixedTxt(w1, n1, d)} feet of ribbon and used ${mixedTxt(w2, n2, d)} feet to wrap pizza boxes. How much is left?`;
    p.visual = `<div style="text-align:center; font-size:1.6rem">${e} ${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}</div>`;
    p.ctx += ' story';
    p.steps.unshift({name:'Pick the operation', type:'concept', kind:'choice', prompt:'Add or subtract?', options:shuffle([{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'}, {html:'Subtract ( − )', text:'Subtract', ok:op === '−', mis:op === '−' ? null : 'wrongOperation'}]), drill:{type:'story', key:'addSub'}});
    p.answerSteps = [p.steps.length - 1];
    return p;
  }
};
function compareStep(a, b, c, d, right){
  const denWrong = (b > d ? '>' : '<') === right ? null : 'biggerDenBigger';
  return {name:'Compare', type:'concept', kind:'choice', prompt:`${a}/${b} ◯ ${c}/${d}`, options:choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === (b > d ? '>' : '<') && denWrong ? denWrong : 'compareFractions'}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
    hint:() => 'With the same denominator, the bigger numerator is bigger. With the same numerator, the smaller denominator means bigger slices.'};
}
function likeFractions(lvl, op){
  const d = pick(lvl === 1 ? [4, 5, 6, 8] : [5, 6, 8, 10, 12]);
  let a = rand(1, d - 1), b = rand(1, d - 1);
  if (op === '−' && a <= b) { [a, b] = [Math.max(a, b), Math.min(a, b)]; if (a === b) { a = d - 1; b = rand(1, d - 2); } }
  if (op === '+' && lvl === 1 && a + b > d) b = Math.max(1, d - a);
  const p = op === '+' ? a + b : a - b;
  if (lvl === 3 && op === '−') { const w = rand(1, 3); a += w * d; }                                  // 2 3/8 − 5/8 style: start from a mixed amount, as an improper fraction
  const P = op === '+' ? a + b : a - b;
  return {title:'Toppings', ctx:`${a}/${d} ${op} ${b}/${d}`, bubble:`${op === '+' ? 'Add' : 'Subtract'}: ${a}/${d} ${op} ${b}/${d}`, helper:'Same-size slices: add or subtract the numerators, keep the denominator.',
    visual:`<div class="frac-pics">${fracBarSVG(a, d)}</div>`,
    steps:[fracStep(op === '+' ? 'Add' : 'Subtract', `${a}/${d} ${op} ${b}/${d} = ?`, P, d, {mis:v => fracMis(v, P, d, op === '+' ? [['addDenominators', P, 2 * d]] : []),
      hint:() => `${a} ${op} ${b} = ${P}, so it's ${P}/${d}.${P > d ? ' You can write it as a mixed number too.' : ''}`})]};
}
/* mixed numbers with like denominators; regroup: adding makes more than a whole, or subtracting needs to borrow a whole */
function mixedProblem(lvl, regroup){
  const d = pick([3, 4, 5, 6, 8, 10]), op = pick(['+', '−']);
  let w1, n1, w2, n2;
  for (let t = 0; t < 100; t++){
    w1 = rand(1, lvl === 1 ? 3 : 6); w2 = rand(1, lvl === 1 ? 3 : 5); n1 = rand(1, d - 1); n2 = rand(1, d - 1);
    if (op === '−' && (w1 * d + n1) <= (w2 * d + n2)) continue;
    const over = op === '+' ? n1 + n2 > d : n1 < n2;
    if (op === '+' && n1 + n2 === d) continue;
    if (op === '−' && n1 === n2) continue;
    if (over === regroup) break;
  }
  const T1 = w1 * d + n1, T2 = w2 * d + n2, P = op === '+' ? T1 + T2 : T1 - T2, steps = [];
  if (op === '−' && regroup) steps.push({name:'Regroup a whole', type:'concept', kind:'num', prompt:`${mixedTxt(w1, n1, d)} = ${w1 - 1} ?/${d}`, answer:d + n1, eq:v => v === d + n1, mis:v => v !== d + n1 && v === n1 + 10 ? 'regroupTen' : null, hint:() => `Take 1 whole (${d}/${d}) and add it to ${n1}/${d}.`});
  steps.push({name:'Fractions', type:'compute', kind:'num', prompt:op === '+' ? `${n1}/${d} + ${n2}/${d} = ?/${d}` : `${regroup ? d + n1 : n1}/${d} − ${n2}/${d} = ?/${d}`, answer:op === '+' ? n1 + n2 : (regroup ? d + n1 : n1) - n2, eq:v => v === (op === '+' ? n1 + n2 : (regroup ? d + n1 : n1) - n2)});
  steps.push({name:'Wholes', type:'compute', kind:'num', prompt:op === '+' ? `${w1} + ${w2} = ?` : `${regroup ? w1 - 1 : w1} − ${w2} = ?`, answer:op === '+' ? w1 + w2 : (regroup ? w1 - 1 : w1) - w2, eq:v => v === (op === '+' ? w1 + w2 : (regroup ? w1 - 1 : w1) - w2)});
  steps.push(fracStep('The answer', `${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)} = ?`, P, d, {mixedOnly:true,
    mis:v => { if (!FRAC.ok(v)) return null; if (FRAC.same(v, P, d) && v[1] >= v[2]) return 'notMixed';
      if (op === '−' && regroup && FRAC.same(v, (w1 - w2) * d + (n2 - n1), d)) return 'smallerFromLarger'; return null; },
    hint:() => op === '+' && regroup ? `${n1 + n2}/${d} is more than 1 whole. Trade ${d}/${d} for 1 whole.` : 'Put the wholes and the fraction together.'}));
  return {title:'Toppings', ctx:`${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}`, nums:[w1, n1, w2, n2, d, op], bubble:`${op === '+' ? 'Add' : 'Subtract'}: ${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}`,
    helper:'Work with the fractions, then the wholes.', visual:`<div style="text-align:center; font-size:1.8rem">${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}</div>`, steps, answerSteps:[steps.length - 1]};
}
Object.assign(GEN, PIZZA_GEN);

/* ===== 4th grade, Pizza Parlor stations 4 and 5 (Sadlier lessons 21 to 25): multiplying fractions by whole numbers, tenths and hundredths ===== */
/* a 10 × 10 grid with the first n squares shaded (hundredths) */
function hundredGridSVG(n){
  let g = '';
  for (let i = 0; i < 100; i++){ const r = Math.floor(i / 10), c = i % 10; g += `<rect x="${1 + c * 16}" y="${1 + r * 16}" width="16" height="16" class="${i < n ? 'fb-on' : 'fb-off'}"/>`; }
  return `<svg class="frac-bar hundred-grid" viewBox="0 0 162 162" width="162" role="img" aria-label="${n} of 100 squares shaded">${g}</svg>`;
}
/* k jumps of a/b on a number line from 0 (whole numbers labeled) */
function jumpsLineSVG(a, b, k){
  const top = Math.max(1, Math.ceil(k * a / b)), w = 300, L = 14, R = w - 14, step = (R - L) / (top * b), y = 44;
  let g = `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" class="nl-line"/>`;
  for (let i = 0; i <= top * b; i++){ const x = L + i * step, whole = i % b === 0; g += `<line x1="${x}" y1="${y - (whole ? 10 : 6)}" x2="${x}" y2="${y + (whole ? 10 : 6)}" class="nl-line"/>`; if (whole) g += `<text x="${x}" y="${y + 26}" class="nl-text">${i / b}</text>`; }
  for (let j = 0; j < k; j++){ const x1 = L + j * a * step, x2 = L + (j + 1) * a * step; g += `<path d="M${x1} ${y - 4} Q${(x1 + x2) / 2} ${y - 34} ${x2} ${y - 4}" class="nl-jump"/>`; }
  return `<svg class="num-line" viewBox="0 0 ${w} 76" width="${w}" role="img" aria-label="${k} jumps of ${a}/${b}">${g}</svg>`;
}
const hund = v => Math.round(v * 100);                                    // hundredths as a whole number, exactly
const decStr = h => XD.fmt(h, 2).replace(/^(\d+)$/, '$1');                 // 45 → "0.45", 50 → "0.5"
const decEq = h => v => typeof v === 'number' && isFinite(v) && Math.abs(v * 100 - h) < 1e-6;
const DEC_WORDS = h => { const t = Math.floor(h / 10) % 10, o = h % 10, w = Math.floor(h / 100);
  const part = o === 0 ? `${ONES_W[t]} tenth${t === 1 ? '' : 's'}` : `${words3(h % 100)} hundredth${h % 100 === 1 ? '' : 's'}`;
  return (w ? `${words3(w)} and ` : '') + part; };
const PIZZA2_GEN = {
  multFracModel(lvl){
    const b = pick([3, 4, 5, 6, 8]), a = lvl === 1 ? 1 : rand(1, b - 1), k = rand(2, lvl === 3 ? 6 : 4), p = k * a;
    return {title:'Party Orders', ctx:`${k} × ${a}/${b} model`, bubble:`Each party plate gets ${a}/${b} of a pizza. There are ${k} plates. How much pizza is that?`, helper:`${k} groups of ${a}/${b}: count all the shaded ${FRAC.part(b, true)}.`,
      visual:`<div class="frac-pics">${Array.from({length:k}, () => fracBarSVG(a, b, {w:160})).join('')}</div>`,
      steps:[{name:'Count the pieces', type:'concept', kind:'num', prompt:`${k} × ${a}/${b} = ?/${b}`, answer:p, eq:v => v === p, fact:{x:k, y:a},
          mis:v => v !== p && v === k + a ? 'additiveEquiv' : null, hint:() => `${k} groups of ${a} ${FRAC.part(b, a > 1)} is ${k} × ${a} ${FRAC.part(b, true)}.`},
        ...(p > b ? [fracStep('As a mixed number', `${p}/${b} = ?`, p, b, {mixedOnly:true, mis:v => FRAC.ok(v) && FRAC.same(v, p, b) && v[1] >= v[2] ? 'notMixed' : null})] : [])]};
  },
  multFracLine(lvl){
    const b = pick([2, 3, 4, 5, 6]), a = lvl === 1 ? 1 : rand(1, b - 1), k = rand(2, lvl === 1 ? 4 : 6), p = k * a;
    return {title:'Party Orders', ctx:`${k} × ${a}/${b} jumps`, bubble:`A frog jumps ${a}/${b} of a meter, ${k} times. Where does it land?`, helper:'Count the jumps: each one is the same size.',
      visual:jumpsLineSVG(a, b, k),
      steps:[{name:'Where it lands', type:'concept', kind:'num', prompt:`${k} × ${a}/${b} = ?/${b}`, answer:p, eq:v => v === p, fact:{x:k, y:a}, mis:v => v !== p && v === k + a ? 'additiveEquiv' : null, hint:() => `Each jump is ${a} small step${a > 1 ? 's' : ''}. ${k} jumps.`}]};
  },
  multUnitFrac(lvl){
    const b = pick([2, 3, 4, 5, 6, 8, 10, 12]), k = rand(2, lvl === 1 ? b - 1 : 12);
    if (lvl >= 2 && Math.random() < 0.5) return {title:'Party Orders', ctx:`${k}/${b} as unit fractions`, bubble:`Write ${k}/${b} as a whole number times a unit fraction.`, helper:`${k}/${b} is ${k} copies of 1/${b}.`,
      visual:`<div class="frac-pics">${fracBarSVG(k, b, {w:200})}</div>`,
      steps:[{name:'How many unit fractions', type:'concept', kind:'num', prompt:`${k}/${b} = ? × 1/${b}`, answer:k, eq:v => v === k, mis:v => v !== k && v === b ? 'multBoth' : null}]};
    return {title:'Party Orders', ctx:`${k} × 1/${b}`, bubble:`Multiply: ${k} × 1/${b}`, helper:'A whole number times a unit fraction: the whole number goes on top.', visual:`<div style="text-align:center; font-size:1.8rem">${k} × 1/${b}</div>`,
      steps:[fracStep('Multiply', `${k} × 1/${b} = ?`, k, b, {mis:v => fracMis(v, k, b, [['multBoth', k, k * b]]), hint:() => `${k} copies of 1/${b} is ${k}/${b}.`})]};
  },
  multFracWhole(lvl){
    const b = pick([3, 4, 5, 6, 8, 10]), a = rand(2, b - 1), k = rand(2, lvl === 1 ? 5 : 9), p = k * a;
    return {title:'Party Orders', ctx:`${k} × ${a}/${b}`, bubble:`Multiply: ${k} × ${a}/${b}`, helper:'Multiply the whole number by the numerator. The denominator stays the same.', visual:`<div style="text-align:center; font-size:1.8rem">${k} × ${a}/${b}</div>`,
      steps:[{name:'Count unit fractions', type:'concept', kind:'num', prompt:`${k} × ${a}/${b} = ? × 1/${b}`, answer:p, eq:v => v === p, fact:{x:k, y:a}, mis:v => v !== p && v === k + a ? 'additiveEquiv' : null},
        fracStep('Multiply', `${k} × ${a}/${b} = ?`, p, b, {mis:v => fracMis(v, p, b, [['multBoth', p, k * b]]), hint:() => `${k} × ${a} = ${p}, so it's ${p}/${b}.${p > b ? ' That\'s more than 1: you can write it as a mixed number.' : ''}`})]};
  },
  multMixedWhole(lvl){
    const b = pick([2, 3, 4, 5, 6, 8]), w = rand(1, lvl === 1 ? 2 : 4), a = rand(1, b - 1), k = rand(2, lvl === 1 ? 4 : 6), top = w * b + a, P = k * top;
    return {title:'Party Orders', ctx:`${k} × ${w} ${a}/${b}`, bubble:`Each pizza box needs ${w} ${a}/${b} feet of ribbon. How much ribbon for ${k} boxes?`, helper:'Turn the mixed number into a fraction, then multiply.',
      visual:`<div style="text-align:center; font-size:1.8rem">${k} × ${w} ${a}/${b}</div>`,
      steps:[{name:'Improper fraction', type:'compute', kind:'num', prompt:`${w} ${a}/${b} = ?/${b}`, answer:top, eq:v => v === top, mis:v => v !== top && (v === w + a || v === w * a + b) ? 'improperWrong' : null},
        fracStep('Multiply', `${k} × ${top}/${b} = ?`, P, b, {mis:v => { const id = fracMis(v, P, b, [['multBoth', P, k * b], ['wholeOnly', k * w * b + a, b]]); return id; }, hint:() => `${k} × ${top} = ${P}, so ${P}/${b}.`})],
      answerSteps:[1]};
  },
  multFracWord(lvl){
    const [e, n] = pick(PIZZA_KIDS), b = pick([2, 3, 4, 8]), a = rand(1, b - 1), k = rand(2, lvl === 1 ? 5 : 9), p = k * a;
    const [thing, unit] = pick([['pizza', 'cup of cheese'], ['cake', 'cup of sugar'], ['batch of dough', 'cup of flour'], ['lap', 'mile']]);
    const story = unit === 'mile' ? `${n} runs ${a}/${b} of a mile each lap and runs ${k} laps. How far does ${n} run?` : `Each ${thing} needs ${a}/${b} ${unit}. ${n} makes ${k}. How much ${unit.replace(/^cup of /, '')} is that, in cups?`;
    const opts = choiceOf({text:`${k} × ${a}/${b}`}, [{text:`${k} + ${a}/${b}`, mis:'wrongOperation'}, {text:`${a}/${b} ÷ ${k}`, mis:'wrongOperation'}]);
    return {title:'Party Orders', ctx:`${k} × ${a}/${b} story`, bubble:story, helper:'Equal groups of a fraction: multiply.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} × ${a}/${b}</div>`,
      steps:[{name:'Pick the math', type:'concept', kind:'choice', prompt:'Which one matches the story?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => `${k} equal groups of ${a}/${b}.`},
        fracStep('Solve', `${k} × ${a}/${b} = ?`, p, b, {mis:v => fracMis(v, p, b, [['multBoth', p, k * b]])})]};
  },
  eqFrac10(lvl){
    const t = rand(1, 9), toHund = lvl === 1 || Math.random() < 0.5;
    return {title:'Pizza Money', ctx:toHund ? `${t}/10 = ?/100` : `${t * 10}/100 = ?/10`, bubble:toHund ? `Write ${t}/10 in hundredths.` : `Write ${t * 10}/100 in tenths.`, helper:'1 tenth is the same as 10 hundredths.',
      visual:`<div class="frac-pics">${hundredGridSVG(t * 10)}</div>`,
      steps:[{name:toHund ? 'Tenths to hundredths' : 'Hundredths to tenths', type:'concept', kind:'num', prompt:toHund ? `${t}/10 = ?/100` : `${t * 10}/100 = ?/10`, answer:toHund ? t * 10 : t, eq:v => v === (toHund ? t * 10 : t),
        mis:v => v !== (toHund ? t * 10 : t) && v === (toHund ? t : t * 10) ? 'tenthsHundredths' : null, hint:() => toHund ? `Each tenth is 10 hundredths. ${t} × 10 = ?` : `Every 10 hundredths make 1 tenth.`}]};
  },
  addFrac10(lvl){
    const t = rand(1, 9), h = rand(1, lvl === 1 ? 9 : 99), sum = t * 10 + h;
    if (h % 10 === 0 || sum > (lvl === 3 ? 199 : 100)) return PIZZA2_GEN.addFrac10(lvl);
    return {title:'Pizza Money', ctx:`${t}/10 + ${h}/100`, bubble:`Add: ${t}/10 + ${h}/100`, helper:'Change the tenths to hundredths first, then add.', visual:`<div style="text-align:center; font-size:1.8rem">${t}/10 + ${h}/100</div>`,
      steps:[{name:'Tenths to hundredths', type:'concept', kind:'num', prompt:`${t}/10 = ?/100`, answer:t * 10, eq:v => v === t * 10, mis:v => v !== t * 10 && v === t ? 'tenthsHundredths' : null},
        {name:'Add', type:'compute', kind:'num', prompt:`${t * 10}/100 + ${h}/100 = ?/100`, answer:sum, eq:v => v === sum, mis:v => v !== sum && v === t + h ? 'tenthsHundredths' : null, hint:() => `${t * 10} + ${h} = ?`}]};
  },
  decShown(lvl){
    const grid = Math.random() < 0.5, h = grid ? rand(1, 99) : rand(1, 9) * 10,   // number lines show tenths; the grid shows hundredths
 whole = lvl === 3 && !grid ? rand(1, 3) : 0, H = whole * 100 + h;
    const visual = grid ? `<div class="frac-pics">${hundredGridSVG(h)}</div>` : numberLineSVG(h % 10 === 0 ? 10 : 100, (h % 10 === 0 ? h / 10 : h) + (whole ? whole * (h % 10 === 0 ? 10 : 100) : 0), {top:whole + 1, w:300});
    return {title:'Pizza Money', ctx:`${grid ? 'grid' : 'line'} ${decStr(H)}`, bubble:grid ? 'What decimal does the shaded part of the grid show?' : 'What decimal is at the dot?', helper:grid ? 'The whole grid is 1. Each small square is one hundredth.' : 'Count the small steps between the whole numbers.',
      visual, steps:[{name:'As a decimal', type:'concept', kind:'num', prompt:'Write it as a decimal.', answer:decStr(H), eq:decEq(H), decimal:true,
        mis:v => { if (decEq(H)(v)) return null; if (h % 10 && decEq(whole * 100 + h * 10)(v)) return 'tenthsHundredths'; if (h % 10 === 0 && decEq(whole * 100 + h / 10)(v)) return 'tenthsHundredths'; return null; },
        hint:() => grid ? `${h} of 100 squares: ${h}/100.` : `Each small step is ${h % 10 === 0 ? 'one tenth' : 'one hundredth'}.`}]};
  },
  decWords(lvl){
    const h = lvl === 1 ? rand(1, 9) * 10 : rand(1, 99), w = lvl === 3 ? rand(1, 20) : 0, H = w * 100 + h, words = DEC_WORDS(H), d = decStr(H);
    const wrongH = h % 10 === 0 ? w * 100 + h / 10 : (h < 10 ? w * 100 + h * 10 : w * 100 + (h % 10) * 10 + Math.floor(h / 10));
    const toWords = Math.random() < 0.5;
    if (toWords) return {title:'Pizza Money', ctx:`${d} in words`, bubble:`How do you say ${d} in words?`, helper:'Read the number after the point, then say the last place: tenths or hundredths.', visual:`<div style="text-align:center; font-size:2rem">${d}</div>`,
      steps:[{name:'Decimal to words', type:'concept', kind:'choice', prompt:`Which words say ${d}?`, options:choiceOf({text:words}, [{text:DEC_WORDS(wrongH), mis:'tenthsHundredths'}, {text:words.includes('tenth') ? words.replace('tenth', 'hundredth') : words.replace('hundredth', 'tenth'), mis:'tenthsHundredths'}]), hint:() => `${d.split('.')[1].length === 1 ? 'One digit after the point: tenths.' : 'Two digits after the point: hundredths.'}`}]};
    return {title:'Pizza Money', ctx:`"${words}"`, bubble:`Write "${words}" as a decimal.`, helper:'Tenths use one place after the point, hundredths use two.', visual:`<div style="text-align:center; font-size:1.4rem">${words}</div>`,
      steps:[{name:'Words to decimal', type:'concept', kind:'num', prompt:`Write "${words}" as a decimal.`, answer:d, eq:decEq(H), decimal:true, mis:v => !decEq(H)(v) && decEq(wrongH)(v) ? 'tenthsHundredths' : null, hint:() => h < 10 ? 'Seven hundredths is 0.07: a zero holds the tenths place.' : 'Write the digits after the point.'}]};
  },
  decLine(lvl){
    if (lvl === 1) { const t = rand(1, 9); return {title:'Pizza Money', ctx:`line 0.${t}`, bubble:'The dot shows how full the pitcher is. What decimal is it at?', helper:'The line from 0 to 1 is split into 10 tenths.', visual:numberLineSVG(10, t),
      steps:[{name:'Read the line', type:'concept', kind:'num', prompt:'What decimal is at the dot?', answer:decStr(t * 10), eq:decEq(t * 10), decimal:true, mis:v => !decEq(t * 10)(v) && decEq(t)(v) ? 'tenthsHundredths' : null}]}; }
    const t = rand(0, 9), o = rand(1, 9), H = t * 10 + o;
    const L = 14, R = 286, step = (R - L) / 10, y = 30; let g = `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" class="nl-line"/>`;
    for (let i = 0; i <= 10; i++){ const x = L + i * step; g += `<line x1="${x}" y1="${y - (i % 10 === 0 ? 10 : 6)}" x2="${x}" y2="${y + (i % 10 === 0 ? 10 : 6)}" class="nl-line"/>`; if (i === 0 || i === 10) g += `<text x="${x}" y="${y + 26}" class="nl-text">${decStr(t * 10 + i)}</text>`; }
    g += `<circle cx="${L + o * step}" cy="${y}" r="7" class="nl-dot"/>`;
    return {title:'Pizza Money', ctx:`line ${decStr(H)}`, bubble:`The line is zoomed in between ${decStr(t * 10)} and ${decStr(t * 10 + 10)}. What decimal is at the dot?`, helper:'Between two tenths there are 10 hundredths.',
      visual:`<svg class="num-line" viewBox="0 0 300 62" width="300" role="img" aria-label="number line from ${decStr(t * 10)} to ${decStr(t * 10 + 10)}">${g}</svg>`,
      steps:[{name:'Read the line', type:'concept', kind:'num', prompt:'What decimal is at the dot?', answer:decStr(H), eq:decEq(H), decimal:true, mis:v => !decEq(H)(v) && (decEq(t * 10 + o * 10)(v) || decEq(o)(v)) ? 'tenthsHundredths' : null, hint:() => `Each small step is 0.01. Start at ${decStr(t * 10)} and count ${o}.`}]};
  },
  decToFrac(lvl){
    const tenth = lvl === 1 || Math.random() < 0.3, h = tenth ? rand(1, 9) * 10 : rand(1, 99), w = lvl === 3 ? rand(1, 9) : 0, d = decStr(w * 100 + h), den = tenth ? 10 : 100, num = tenth ? h / 10 : h;
    return {title:'Pizza Money', ctx:`${d} as a fraction`, bubble:`The pizza box weighs ${d} kilograms. Write ${d} as a fraction.`, helper:'One place after the point is tenths. Two places is hundredths.',
      visual:`<div style="text-align:center; font-size:2rem">${d}</div>`,
      steps:[{name:'Decimal to fraction', type:'concept', kind:'num', prompt:w ? `${d} = ${w} ?/${den}` : `${d} = ?/${den}`, answer:num, eq:v => v === num, mis:v => v !== num && (v === num * 10 || v * 10 === num) ? 'tenthsHundredths' : null,
        hint:() => `Read ${d} as "${DEC_WORDS(w * 100 + h)}".`}]};
  },
  cmpDec(lvl){
    let a, b;
    do { a = lvl === 1 ? rand(1, 9) * 10 : rand(1, 99); b = rand(1, 99); if (lvl >= 2 && Math.random() < 0.6) { a = rand(1, 9) * 10; b = a - rand(1, 9); if (Math.random() < 0.5) [a, b] = [b, a]; } } while (a === b || b <= 0);
    const right = a > b ? '>' : '<', sa = decStr(a), sb = decStr(b);
    const longer = sa.length > sb.length ? '>' : sa.length < sb.length ? '<' : null;       // "more digits is bigger": 0.45 > 0.5
    const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:longer && t === longer ? 'longerIsBigger' : 'compareDecimals'}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Pizza Money', ctx:`${sa} ? ${sb}`, bubble:`Which costs more: $${sa} or $${sb}?`, helper:'Line up the points. Compare tenths first, then hundredths.', visual:'',
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${sa} ◯ ${sb}`, options:opts, hint:() => `Write both with two places: ${decStr(a).padEnd(4, '0')} and ${decStr(b).padEnd(4, '0')}.`}]};
  }
};
Object.assign(GEN, PIZZA2_GEN);

/* ===== 4th grade, Garden Center stations 1 and 2 (Sadlier lessons 26 to 29): converting units, area and perimeter ===== */
/* [big unit, small unit, how many small in 1 big, big name, small name] */
const UNIT_PAIRS = {
  mass:   [['kg', 'g', 1000, 'kilograms', 'grams'], ['lb', 'oz', 16, 'pounds', 'ounces']],
  volume: [['L', 'mL', 1000, 'liters', 'milliliters'], ['gal', 'qt', 4, 'gallons', 'quarts'], ['qt', 'pt', 2, 'quarts', 'pints'], ['pt', 'c', 2, 'pints', 'cups'], ['gal', 'pt', 8, 'gallons', 'pints'], ['qt', 'c', 4, 'quarts', 'cups'], ['gal', 'c', 16, 'gallons', 'cups']],
  length: [['km', 'm', 1000, 'kilometers', 'meters'], ['m', 'cm', 100, 'meters', 'centimeters'], ['cm', 'mm', 10, 'centimeters', 'millimeters'], ['m', 'mm', 1000, 'meters', 'millimeters'], ['yd', 'ft', 3, 'yards', 'feet'], ['ft', 'in', 12, 'feet', 'inches'], ['yd', 'in', 36, 'yards', 'inches'], ['mi', 'yd', 1760, 'miles', 'yards'], ['mi', 'ft', 5280, 'miles', 'feet']],
  time:   [['hr', 'min', 60, 'hours', 'minutes'], ['min', 'sec', 60, 'minutes', 'seconds'], ['day', 'hr', 24, 'days', 'hours'], ['week', 'day', 7, 'weeks', 'days']]
};
/* a story sentence for each big unit, so the thing matches the size of the unit */
const CONV_ITEMS = {
  kg:['🥔 A sack of potatoes weighs #.', '🎃 A pumpkin weighs #.', '🍉 A crate of watermelons weighs #.'], lb:['🥔 A sack of potatoes weighs #.', '🎃 A pumpkin weighs #.', '🪴 A bag of soil weighs #.'],
  L:['🛢️ A rain barrel holds #.', '🪣 A watering can holds #.'], gal:['🛢️ A rain barrel holds #.', '🪣 A watering can holds #.'], qt:['🧃 A jug of plant food holds #.', '🫙 A pot of soup holds #.'], pt:['🫙 A jar of honey holds #.', '🧃 A bottle of plant food holds #.'],
  km:['🥾 The garden trail is # long.', '🚲 The bike ride to the farm is # long.'], mi:['🥾 The garden trail is # long.', '🚲 The bike ride to the farm is # long.'],
  m:['🪱 The garden hose is # long.', '🌻 The tallest sunflower is # tall.', '🌳 A row of trees is # long.'], yd:['🪱 The garden hose is # long.', '🪵 The fence is # long.'], ft:['🌻 The tallest sunflower is # tall.', '🪵 A fence board is # long.'],
  cm:['🌱 A seedling is # tall.', '🐛 A caterpillar is # long.'],
  hr:['🚿 The sprinklers ran for #.', '🐝 The bee tour lasted #.'], min:['🪣 The hose filled the pond in #.', '🧑‍🌾 The weeding took #.'], day:['🌱 The seeds took # to sprout.', '🥒 The cucumbers took # to grow.'], week:['🍅 The tomatoes took # to ripen.', '🎃 The pumpkins took # to grow.']
};
const unitWord = (n, w) => n !== 1 ? w : ({feet:'foot', inches:'inch'})[w] || w.replace(/s$/, '');
const unitAbbr = (n, a) => (a === 'day' || a === 'week') && n !== 1 ? a + 's' : a;
/* the other factors in the same family: using one of these is the wrongFactor mix-up */
const otherFactors = (kind, f) => [...new Set(UNIT_PAIRS[kind].map(u => u[2]).concat(kind === 'length' || kind === 'mass' || kind === 'volume' ? [10, 100, 1000] : [60, 100]))].filter(g => g !== f);
const convStep = (kind, [big, small, f]) => numStep('How many in 1', 'concept', `1 ${big} = ? ${small}`, f, {fact:undefined,
  mis:v => otherFactors(kind, f).includes(v) ? 'wrongFactor' : null, hint:() => `How many ${small} make 1 ${big}?`});
const convertGen = kind => lvl => {
  const pairs = UNIT_PAIRS[kind].filter(u => lvl === 3 || u[2] < 1760), U = pick(pairs), [big, small, f, bigW, smallW] = U;
  const n = f >= 1760 ? rand(2, 3) : f >= 100 ? rand(2, 9) : rand(2, lvl === 1 ? 9 : 12), item = pick(CONV_ITEMS[big]), total = n * f, B = unitAbbr(n, big);
  const say = amt => item.replace('#', amt);
  const fact = f <= 12 && n <= 12 ? {x:n, y:f} : undefined;
  if (lvl === 1) return {title:'Measuring Cups', ctx:`${n} ${B} = ? ${small}`, bubble:`${say(`${n} ${bigW}`)} How many ${smallW} is that?`,
    helper:'Going to a smaller unit? You need more of them, so multiply.', visual:`<div style="text-align:center; font-size:1.6rem">${n} ${B} = ? ${small}</div>`,
    steps:[convStep(kind, U), numStep('Convert', 'compute', `${n} × ${commas(f)} = ?`, total, {fact, mis:v => v === n ? 'unitsDirection' : otherFactors(kind, f).some(g => g * n === v) ? 'wrongFactor' : null, hint:() => `Each ${big} is ${commas(f)} ${small}. ${n} of them is ${n} × ${commas(f)}.`})],
    answerSteps:[1]};
  if (lvl === 2) {
    const m = rand(1, f - 1), all = total + m, joined = Number(`${n}${m}`);
    const Sm = unitAbbr(m, small);
    return {title:'Measuring Cups', ctx:`${n} ${B} ${m} ${Sm} = ? ${small}`, bubble:`${say(`${n} ${bigW} ${m} ${unitWord(m, smallW)}`)} How many ${smallW} is that?`,
      helper:'Change the big units to small units, then add the small units that were already there.', visual:`<div style="text-align:center; font-size:1.6rem">${n} ${B} ${m} ${Sm} = ? ${small}</div>`,
      steps:[convStep(kind, U), numStep(`${n} ${B}`, 'compute', `${n} ${B} = ? ${small}`, total, {fact, mis:v => otherFactors(kind, f).some(g => g * n === v) ? 'wrongFactor' : null, hint:() => `${n} × ${commas(f)}.`}),
        numStep('Add the rest', 'compute', `${commas(total)} + ${m} = ?`, all, {mis:v => v === joined ? 'joinedUnits' : v === total ? 'forgotSmallPart' : null, hint:() => `Don't forget the ${m} ${Sm}.`})],
      answerSteps:[2]};
  }
  let other; do { other = Math.max(1, total + pick([-1, 1]) * rand(0, Math.ceil(f / 2)) * (f >= 100 ? pick([1, 10]) : 1)); } while (other === total && Math.random() < 0.7);
  if (other === n) other = total + 1;
  const right = total > other ? '>' : total < other ? '<' : '=', raw = n > other ? '>' : n < other ? '<' : '=';
  const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === raw ? 'rawCompare' : null})));
  return {title:'Measuring Cups', ctx:`${n} ${B} ? ${other} ${small}`, bubble:`Which is ${{mass:'heavier', volume:'more', length:'longer', time:'longer'}[kind]}: ${n} ${bigW} or ${commas(other)} ${smallW}?`,
    helper:'Change both to the same unit before you compare.', visual:'',
    steps:[convStep(kind, U), numStep(`${n} ${B}`, 'compute', `${n} ${B} = ? ${small}`, total, {fact, hint:() => `${n} × ${commas(f)}.`}),
      {name:'Compare', type:'concept', kind:'choice', prompt:`${n} ${B} ◯ ${commas(other)} ${small}`, options:opts.map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
        hint:() => `${n} ${B} is ${commas(total)} ${small}. Compare ${commas(total)} and ${commas(other)}.`}],
    answerSteps:[2]};
};

/* ----- conversion word problems ----- */
const moneyTxt = c => c % 100 === 0 ? `$${c / 100}` : c < 100 ? `${c}¢` : `$${(c / 100).toFixed(2)}`;
const GARDEN_WORD = {
  timeWord(lvl){
    const [e, n] = pick(LEMON_KIDS), task = pick(['watered the garden', 'pulled weeds', 'planted seeds', 'raked leaves']);
    if (lvl === 1) {
      const U = pick(UNIT_PAIRS.time.slice(0, 3)), k = rand(2, U[2] === 24 ? 5 : 9);
      return {title:'Measuring Cups', ctx:`${k} ${unitAbbr(k, U[0])} = ? ${U[1]}`, bubble:`${n} ${task} for ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Bigger unit to smaller unit: multiply.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ⏱️ ${k} ${unitAbbr(k, U[0])}</div>`,
        steps:[convStep('time', U), numStep('Convert', 'compute', `${k} × ${U[2]} = ?`, k * U[2], {mis:v => v === k ? 'unitsDirection' : null, hint:() => `${k} groups of ${U[2]}.`})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const h = rand(1, 2), m1 = rand(1, 11) * 5, m2 = rand(3, 11) * 5, first = h * 60 + m1, add = Math.random() < 0.5, ans = add ? first + m2 : first - m2;
      return {title:'Measuring Cups', ctx:`${h} hr ${m1} min ${add ? '+' : '−'} ${m2} min`,
        bubble:add ? `${n} ${task} for ${h} hr ${m1} min on Saturday and ${m2} minutes on Sunday. How many minutes in all?` : `${n} planned to spend ${h} hr ${m1} min in the garden but finished ${m2} minutes early. How many minutes did ${n} spend?`,
        helper:'Change the hours to minutes first.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ⏱️ ${h} hr ${m1} min</div>`,
        steps:[numStep(`${h} hr ${m1} min`, 'compute', `${h} hr ${m1} min = ? min`, first, {mis:v => v === Number(`${h}${m1}`) || v === h * 100 + m1 ? 'joinedUnits' : v === h * 60 ? 'forgotSmallPart' : null, hint:() => `${h} hr is ${h * 60} min. Add the ${m1} min.`}),
          numStep(add ? 'Add' : 'Subtract', 'compute', `${first} ${add ? '+' : '−'} ${m2} = ?`, ans, {hint:() => add ? 'Put the times together.' : 'Take away the minutes saved.'})], answerSteps:[1]};
    }
    const a = rand(2, 4), s1 = rand(10, 55), s2 = rand(5, 55), A = a * 60 + s1, B = (a - 1) * 60 + s2;
    return {title:'Measuring Cups', ctx:`${a} min ${s1} sec − ${a - 1} min ${s2} sec`, bubble:`${n}'s wheelbarrow race took ${a} min ${s1} sec. Sam's took ${a - 1} min ${s2} sec. How many seconds faster was Sam?`,
      helper:'Change both times to seconds, then subtract.', visual:`<div style="text-align:center; font-size:1.6rem">🏁 ${a}:${String(s1).padStart(2, '0')} vs ${a - 1}:${String(s2).padStart(2, '0')}</div>`,
      steps:[numStep(`${a} min ${s1} sec`, 'compute', `${a} min ${s1} sec = ? sec`, A, {mis:v => v === a * 60 ? 'forgotSmallPart' : v === a * 100 + s1 ? 'joinedUnits' : null}),
        numStep(`${a - 1} min ${s2} sec`, 'compute', `${a - 1} min ${s2} sec = ? sec`, B, {mis:v => v === (a - 1) * 60 ? 'forgotSmallPart' : v === (a - 1) * 100 + s2 ? 'joinedUnits' : null}),
        numStep('Subtract', 'compute', `${A} − ${B} = ?`, A - B, {mis:v => v === (a * 100 + s1) - ((a - 1) * 100 + s2) ? 'joinedUnits' : null, hint:() => 'Subtract the smaller time from the bigger one.'})], answerSteps:[2]};
  },
  moneyWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const q = rand(1, 7), d = rand(1, 9), nk = rand(0, 5), tot = q * 25 + d * 10 + nk * 5;
      const coins = [`${q} quarter${q > 1 ? 's' : ''}`, `${d} dime${d > 1 ? 's' : ''}`, ...(nk ? [`${nk} nickel${nk > 1 ? 's' : ''}`] : [])];
      return {title:'Measuring Cups', ctx:`${q}q ${d}d ${nk}n`, bubble:`${n} has ${coins.slice(0, -1).join(', ')}${coins.length > 2 ? ',' : ''} and ${coins.at(-1)} for seed packets. How many cents is that?`,
        helper:'A quarter is 25¢, a dime is 10¢, a nickel is 5¢.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪙 × ${q + d + nk}</div>`,
        steps:[numStep('Quarters', 'compute', `${q} × 25 = ?`, q * 25, {hint:() => 'Each quarter is 25 cents.'}), numStep('Dimes', 'compute', `${d} × 10 = ?`, d * 10, {fact:{x:d, y:10}}),
          ...(nk ? [numStep('Nickels', 'compute', `${nk} × 5 = ?`, nk * 5, {fact:{x:nk, y:5}})] : []),
          numStep('Total', 'compute', `${[q * 25, d * 10, ...(nk ? [nk * 5] : [])].join(' + ')} = ?`, tot, {mis:v => v === q + d + nk ? 'forgotSmallPart' : null})], answerSteps:[nk ? 3 : 2]};
    }
    if (lvl === 2) {
      const have = rand(2, 9), k = rand(2, 5), each = rand(3, Math.floor(have * 100 / k / 5)) * 5, cost = k * each;
      if (cost >= have * 100 || each >= 100) return GARDEN_WORD.moneyWord(lvl);
      return {title:'Measuring Cups', ctx:`$${have} − ${k} × ${each}¢`, bubble:`${n} has $${have}. ${n} buys ${k} seed packets for ${each}¢ each. How much change does ${n} get, in cents?`,
        helper:'Change the dollars to cents so everything is in the same unit.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 💵 $${have} · 🌱 ${each}¢ × ${k}</div>`,
        steps:[numStep('Dollars to cents', 'compute', `$${have} = ? cents`, have * 100, {mis:v => v === have * 10 ? 'wrongFactor' : v === have ? 'unitsDirection' : null, hint:() => 'Each dollar is 100 cents.'}),
          numStep('Cost', 'compute', `${k} × ${each} = ?`, cost, {}),
          numStep('Change', 'compute', `${have * 100} − ${cost} = ?`, have * 100 - cost, {})], answerSteps:[2]};
    }
    const coin = pick([[10, 'dimes'], [5, 'nickels'], [25, 'quarters']]), cnt = rand(6, 30), c = cnt * coin[0];
    return {title:'Measuring Cups', ctx:`${moneyTxt(c)} in ${coin[1]}`, bubble:`${n} paid ${moneyTxt(c)} for a flower pot, all in ${coin[1]}. How many ${coin[1]} did ${n} use?`,
      helper:'Change the money to cents, then see how many coins make that many cents.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪴 ${moneyTxt(c)}</div>`,
      steps:[numStep('To cents', 'compute', `${moneyTxt(c)} = ? cents`, c, {mis:v => v === Math.floor(c / 100) ? 'unitsDirection' : null}),
        numStep('How many coins', 'compute', `${c} ÷ ${coin[0]} = ?`, cnt, {fact:coin[0] <= 12 && cnt <= 12 ? {x:coin[0], y:cnt, div:true} : undefined, mis:v => v === c * coin[0] ? 'unitsDirection' : null})], answerSteps:[1]};
  },
  metricWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const U = pick([UNIT_PAIRS.mass[0], UNIT_PAIRS.volume[0], UNIT_PAIRS.length[0], UNIT_PAIRS.length[1]]), k = rand(2, 9);
      const thing = {kg:'bag of soil weighs', L:'rain barrel holds', km:'garden trail is', m:'row of carrots is'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Metric units jump by 10, 100, or 1,000.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]}</div>`,
        steps:[convStep('length', U), numStep('Convert', 'compute', `${k} × ${commas(U[2])} = ?`, k * U[2], {mis:v => v === k ? 'unitsDirection' : [10, 100, 1000].some(g => g !== U[2] && g * k === v) ? 'wrongFactor' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const m = rand(2, 6), cm = rand(11, 95), add = rand(15, 95), tot = m * 100 + cm + add;
      return {title:'Measuring Cups', ctx:`${m} m ${cm} cm + ${add} cm`, bubble:`${n}'s hose is ${m} m ${cm} cm long. ${n} clips on a ${add} cm nozzle. How long is it now, in centimeters?`,
        helper:'Change meters to centimeters, then add.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪱 ${m} m ${cm} cm + ${add} cm</div>`,
        steps:[numStep(`${m} m ${cm} cm`, 'compute', `${m} m ${cm} cm = ? cm`, m * 100 + cm, {mis:v => v === m * 10 + cm || v === m * 1000 + cm ? 'wrongFactor' : v === m * 100 ? 'forgotSmallPart' : null}),
          numStep('Add', 'compute', `${m * 100 + cm} + ${add} = ?`, tot, {})], answerSteps:[1]};
    }
    const m = rand(2, 6), piece = pick([20, 25, 50]), cnt = m * 100 / piece;
    return {title:'Measuring Cups', ctx:`${m} m ÷ ${piece} cm`, bubble:`${n} has ${m} meters of twine to tie up tomato plants. Each tie uses ${piece} cm. How many ties can ${n} make?`,
      helper:'Change meters to centimeters, then divide.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍅 ${m} m ÷ ${piece} cm</div>`,
      steps:[numStep(`${m} m`, 'compute', `${m} m = ? cm`, m * 100, {mis:v => v === m * 10 || v === m * 1000 ? 'wrongFactor' : null}),
        numStep('Divide', 'compute', `${m * 100} ÷ ${piece} = ?`, cnt, {mis:v => v === m * 100 * piece ? 'unitsDirection' : null, hint:() => `How many ${piece}s are in ${m * 100}?`})], answerSteps:[1]};
  },
  customaryWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const U = pick([UNIT_PAIRS.volume[1], UNIT_PAIRS.volume[6], UNIT_PAIRS.length[4], UNIT_PAIRS.length[5], UNIT_PAIRS.mass[1]]), k = rand(2, 9);
      const thing = {gal:'watering can holds', yd:'flower bed is', ft:'bean pole is', lb:'bag of seeds weighs'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Know how many small units are in one big unit.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]}</div>`,
        steps:[convStep(U[0] === 'lb' ? 'mass' : U[0] === 'gal' ? 'volume' : 'length', U), numStep('Convert', 'compute', `${k} × ${U[2]} = ?`, k * U[2], {fact:U[2] <= 12 ? {x:k, y:U[2]} : undefined, mis:v => v === k ? 'unitsDirection' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const U = pick([UNIT_PAIRS.length[4], UNIT_PAIRS.length[5], UNIT_PAIRS.mass[1]]), k = rand(2, 9), r = rand(1, U[2] - 1), tot = k * U[2] + r;
      const thing = {yd:'garden path is', ft:'sunflower is', lb:'pumpkin weighs'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} ${r} ${U[1]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]} ${r} ${unitWord(r, U[4])}. How many ${U[4]} is that?`, helper:'Change the big units, then add the small units.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]} ${r} ${U[1]}</div>`,
        steps:[numStep(`${k} ${U[0]}`, 'compute', `${k} ${U[0]} = ? ${U[1]}`, k * U[2], {fact:U[2] <= 12 ? {x:k, y:U[2]} : undefined, mis:v => v === k * 10 || v === k * 100 ? 'wrongFactor' : null}),
          numStep('Add the rest', 'compute', `${k * U[2]} + ${r} = ?`, tot, {mis:v => v === Number(`${k}${r}`) ? 'joinedUnits' : null})], answerSteps:[1]};
    }
    const g = rand(2, 4), used = rand(5, g * 16 - 3);
    return {title:'Measuring Cups', ctx:`${g} gal − ${used} c`, bubble:`${n} made ${g} gallons of lemonade for the garden party and poured ${used} one-cup glasses. How many cups are left?`,
      helper:'1 gallon = 16 cups. Change the gallons to cups, then subtract.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🥤 ${g} gal − ${used} c</div>`,
      steps:[numStep(`${g} gal`, 'compute', `${g} gal = ? c`, g * 16, {mis:v => v === g * 4 || v === g * 8 ? 'wrongFactor' : null, hint:() => '1 gallon = 4 quarts, 1 quart = 4 cups.'}),
        numStep('Subtract', 'compute', `${g * 16} − ${used} = ?`, g * 16 - used, {})], answerSteps:[1]};
  }
};

/* ----- station 2: area and perimeter ----- */
/* a rectangle (l across, w down) with side labels; a unit-square grid when grid is true */
function rectSVG(l, w, {grid = false, top = null, side = null, unit = ''} = {}){
  const s = Math.min(22, 220 / l, 150 / w), W = l * s, H = w * s, x0 = 34, y0 = 26;
  let g = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" class="rect-fill"/>`;
  if (grid) { for (let i = 1; i < l; i++) g += `<line x1="${x0 + i * s}" y1="${y0}" x2="${x0 + i * s}" y2="${y0 + H}" class="rect-grid"/>`; for (let j = 1; j < w; j++) g += `<line x1="${x0}" y1="${y0 + j * s}" x2="${x0 + W}" y2="${y0 + j * s}" class="rect-grid"/>`; }
  g += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" class="rect-edge"/>`;
  const t = top ?? `${l}${unit ? ' ' + unit : ''}`, sd = side ?? `${w}${unit ? ' ' + unit : ''}`;
  if (t !== '') g += `<text x="${x0 + W / 2}" y="${y0 - 8}" class="rect-lbl">${t}</text>`;
  if (sd !== '') g += `<text x="${x0 - 6}" y="${y0 + H / 2 + 5}" class="rect-lbl" text-anchor="end">${sd}</text>`;
  return `<svg class="rect-pic" viewBox="0 0 ${x0 + W + 12} ${y0 + H + 12}" width="${x0 + W + 12}" role="img" aria-label="rectangle ${t} by ${sd}">${g}</svg>`;
}
const AP_SITUATIONS = [['a fence around the garden', 'P'], ['grass seed to cover the lawn', 'A'], ['a border of bricks around the flower bed', 'P'], ['tiles to cover the patio', 'A'],
  ['mulch to cover the vegetable bed', 'A'], ['edging around the pond', 'P'], ['a tarp to cover the sandbox', 'A'], ['ribbon around the edge of the sign', 'P'],
  ['a rope around the pumpkin patch', 'P'], ['a rug for the greenhouse floor', 'A'], ['paint for the shed wall', 'A'], ['a path all the way around the lawn', 'P']];
const apMis = (l, w, want) => v => want === 'A' ? (v === 2 * (l + w) ? 'areaPerimeterSwap' : v === l + w ? 'addFactors' : null) : (v === l * w ? 'areaPerimeterSwap' : v === l + w ? 'halfPerimeter' : null);
const areaStep = (l, w, unit, extra = {}) => numStep('Area', 'compute', `${l} × ${w} = ? square ${unit}`, l * w, {fact:l <= 12 && w <= 12 ? {x:l, y:w} : undefined, mis:apMis(l, w, 'A'), hint:() => 'Area = length × width.', ...extra});
const perimStep = (l, w, unit, extra = {}) => numStep('Perimeter', 'compute', `${l} + ${w} + ${l} + ${w} = ? ${unit}`, 2 * (l + w), {mis:apMis(l, w, 'P'), hint:() => 'Add all four sides: 2 lengths and 2 widths.', ...extra});
const GARDEN_AP = {
  apSituation(lvl){
    const [what, kind] = pick(AP_SITUATIONS), l = rand(3, lvl === 1 ? 9 : 12), w = rand(2, l - 1), unit = pick(['feet', 'meters', 'yards']);
    const opts = choiceOf({text:kind === 'A' ? 'Area' : 'Perimeter'}, [{text:kind === 'A' ? 'Perimeter' : 'Area', mis:'areaPerimeterSwap'}]);
    const steps = [{name:'Area or perimeter?', type:'concept', kind:'choice', prompt:`For ${what}, do you need the area or the perimeter?`, options:opts,
      hint:() => kind === 'A' ? 'It covers the whole inside: that is area.' : 'It goes around the edge: that is perimeter.'}];
    if (lvl >= 2) steps.push(kind === 'A' ? areaStep(l, w, unit) : perimStep(l, w, unit));
    return {title:'Garden Beds', ctx:`${what} (${kind})`, bubble:lvl === 1 ? `I need ${what}. Do I need to know the area or the perimeter?` : `I need ${what}. It is ${l} ${unit} long and ${w} ${unit} wide. How much do I need?`,
      helper:'Around the edge is perimeter. Covering the inside is area.', visual:lvl === 1 ? '<div style="text-align:center; font-size:2rem">🌱🟩🌱</div>' : rectSVG(l, w, {unit:unit.slice(0, 2) === 'fe' ? 'ft' : unit === 'meters' ? 'm' : 'yd'}),
      steps, ...(lvl >= 2 ? {answerSteps:[1]} : {})};
  },
  rectMeasure(lvl){
    const sq = lvl === 3 && Math.random() < 0.4, l = lvl === 1 ? rand(3, 8) : lvl === 2 ? rand(4, 12) : rand(11, 25), w = sq ? l : rand(2, lvl === 1 ? l - 1 : Math.min(l - 1, 9)), unit = lvl === 1 ? 'units' : pick(['feet', 'meters']);
    const short = unit === 'units' ? '' : unit === 'feet' ? 'ft' : 'm';
    return {title:'Garden Beds', ctx:`${l} × ${w} rectangle`, bubble:sq ? `This square garden bed is ${l} ${unit} on each side. What are its area and perimeter?` : `This garden bed is ${l} ${unit} long and ${w} ${unit} wide. What are its area and perimeter?`,
      helper:lvl === 1 ? 'Count the squares inside for area. Count the edges all the way around for perimeter.' : 'Area = length × width. Perimeter = add all four sides.',
      visual:rectSVG(l, w, {grid:lvl === 1, unit:short, side:sq ? '' : null}),
      steps:[areaStep(l, w, unit), perimStep(l, w, unit)]};
  },
  apMissing(lvl){
    const l = rand(3, 12), w = rand(2, 9), unit = pick(['feet', 'meters', 'yards']), short = {feet:'ft', meters:'m', yards:'yd'}[unit];
    const kind = lvl === 1 ? 'A' : lvl === 2 ? 'P' : 'AP';
    if (kind === 'A') return {title:'Garden Beds', ctx:`area ${l * w}, width ${w}`, bubble:`A garden bed has an area of ${l * w} square ${unit}. It is ${w} ${unit} wide. How long is it?`,
      helper:'Area = length × width, so divide the area by the width.', visual:rectSVG(l, w, {top:'?', unit:short}),
      steps:[numStep('Length', 'compute', `${l * w} ÷ ${w} = ?`, l, {fact:{x:w, y:l, div:true}, hint:() => `${w} × what = ${l * w}?`})]};
    if (kind === 'P') {
      const P = 2 * (l + w);
      return {title:'Garden Beds', ctx:`perimeter ${P}, width ${w}`, bubble:`${pick(LEMON_KIDS)[1]} used ${P} ${unit} of fence around a garden bed. The bed is ${w} ${unit} wide. How long is it?`,
        helper:'Take away both widths. What is left is the two lengths together.', visual:rectSVG(l, w, {top:'?', unit:short}),
        steps:[numStep('Both lengths', 'compute', `${P} − ${w} − ${w} = ?`, 2 * l, {mis:v => v === P - w ? 'halfPerimeter' : null, hint:() => `The two widths use ${2 * w} ${unit}.`}),
          numStep('One length', 'compute', `${2 * l} ÷ 2 = ?`, l, {hint:() => 'The two lengths are the same.'})], answerSteps:[1]};
    }
    return {title:'Garden Beds', ctx:`area ${l * w}, length ${l}: perimeter`, bubble:`A garden bed has an area of ${l * w} square ${unit} and is ${l} ${unit} long. How much fence goes around it?`,
      helper:'Find the missing side first, then add all four sides.', visual:rectSVG(l, w, {side:'?', unit:short}),
      steps:[numStep('Width', 'compute', `${l * w} ÷ ${l} = ?`, w, {fact:l <= 12 ? {x:l, y:w, div:true} : undefined, hint:() => `${l} × what = ${l * w}?`}),
        perimStep(l, w, unit)], answerSteps:[1]};
  },
  apWord(lvl){
    const [e, n] = pick(LEMON_KIDS), unit = pick(['feet', 'meters']);
    if (lvl === 1) {
      const l = rand(3, 10), w = rand(2, 9), ask = pick(['A', 'P']);
      return {title:'Garden Beds', ctx:`${l} × ${w} ${ask}`, bubble:ask === 'A' ? `${n}'s strawberry patch is ${l} ${unit} long and ${w} ${unit} wide. How many square ${unit} of straw cover it?` : `${n}'s strawberry patch is ${l} ${unit} long and ${w} ${unit} wide. How many ${unit} of fence go around it?`,
        helper:'Covering is area. Going around is perimeter.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍓 ${l} × ${w}</div>`, steps:[ask === 'A' ? areaStep(l, w, unit) : perimStep(l, w, unit)]};
    }
    if (lvl === 2) {
      const l1 = rand(4, 12), w1 = rand(2, 9), l2 = rand(4, 12), w2 = rand(2, 9);
      if (l1 * w1 === l2 * w2) return GARDEN_AP.apWord(lvl);
      const d = Math.abs(l1 * w1 - l2 * w2);
      return {title:'Garden Beds', ctx:`${l1}×${w1} vs ${l2}×${w2}`, bubble:`The pepper bed is ${l1} by ${w1} ${unit}. The bean bed is ${l2} by ${w2} ${unit}. How many more square ${unit} does the bigger bed have?`,
        helper:'Find each area, then subtract.', visual:`<div class="frac-pics">${rectSVG(l1, w1, {unit:unit === 'feet' ? 'ft' : 'm'})}${rectSVG(l2, w2, {unit:unit === 'feet' ? 'ft' : 'm'})}</div>`,
        steps:[areaStep(l1, w1, unit, {name:'Pepper bed'}), areaStep(l2, w2, unit, {name:'Bean bed'}), numStep('How many more', 'compute', `${Math.max(l1 * w1, l2 * w2)} − ${Math.min(l1 * w1, l2 * w2)} = ?`, d, {mis:v => v === Math.abs(2 * (l1 + w1) - 2 * (l2 + w2)) ? 'areaPerimeterSwap' : null})], answerSteps:[2]};
    }
    const w = rand(2, 9), l = rand(w + 1, 12), P = 2 * (l + w);
    return {title:'Garden Beds', ctx:`P ${P}, w ${w}: area`, bubble:`${n} put ${P} ${unit} of fence around a rectangle garden that is ${w} ${unit} wide. How many square ${unit} of soil does it need?`,
      helper:'Use the perimeter to find the length, then find the area.', visual:rectSVG(l, w, {top:'?', unit:unit === 'feet' ? 'ft' : 'm'}),
      steps:[numStep('Length', 'compute', `(${P} − ${w} − ${w}) ÷ 2 = ?`, l, {mis:v => v === P - w || v === P - 2 * w ? 'halfPerimeter' : null, hint:() => `Take away both widths (${2 * w}), then split what is left between the two lengths.`}),
        areaStep(l, w, unit)], answerSteps:[1]};
  }
};
const GARDEN_GEN = {convMass:convertGen('mass'), convVolume:convertGen('volume'), convLength:convertGen('length'), convTime:convertGen('time'), ...GARDEN_WORD, ...GARDEN_AP};
Object.assign(GEN, GARDEN_GEN);

/* ===== 6th grade, Market Stall (Khan unit 3): rates and percentages ===== */
const PRODUCE = [['🍎', 'apples', 'pound'], ['🍐', 'pears', 'pound'], ['🥕', 'carrots', 'bunch'], ['🍓', 'strawberries', 'basket'], ['🥔', 'potatoes', 'pound'], ['🍅', 'tomatoes', 'pound'], ['🌽', 'corn', 'ear'], ['🥬', 'lettuce', 'head']];
const BY_EACH = [['🍋', 'lemons'], ['🥝', 'kiwis'], ['🍑', 'peaches'], ['🥑', 'avocados'], ['🍊', 'oranges']];
const cash = c => c % 100 === 0 ? `$${c / 100}` : `$${(c / 100).toFixed(2)}`;      // cents → "$3" or "$2.50"
const dollars = c => XD.fmt(c, 2);                                                     // cents → "2.5" (typed answer)
const plural = (n, w) => n === 1 ? w : w === 'bunch' ? 'bunches' : w + 's';
/* a typed money answer in dollars, exact to the cent */
const moneyStep = (name, prompt, cents, extra = {}) => ({name, type:'compute', kind:'num', prompt, answer:dollars(cents), eq:XD.eq(cents, 2), decimal:true, ...extra,
  ...(extra.mis ? {mis:v => XD.eq(cents, 2)(v) ? null : extra.mis(v)} : {})});
/* a times-table fact for the practice log, only when both numbers are whole and in the table */
const fx = (x, y, div = false) => Number.isInteger(x) && Number.isInteger(y) && x >= 1 && y >= 1 && x <= 12 && y <= 12 ? {x, y, div} : undefined;
/* the double number line, shrunk to fit a phone (no sideways scrolling) */
const dnlFit = (...a) => `<div class="dnl-fit">${dnlHTML(...a)}</div>`;
const near = (v, x) => typeof v === 'number' && Math.abs(v - x) < 0.005;
const MARKET_GEN = {
  /* ----- station 1: Price Tags (rates) ----- */
  unitRate(lvl){
    const [e, what, unit] = pick(PRODUCE);
    if (lvl < 3) {
      const n = rand(2, 9), per = lvl === 1 ? rand(2, 12) * 100 : rand(3, 19) * 25, total = n * per;
      return {title:'Price Tags', ctx:`${cash(total)} for ${n} ${unit}`, bubble:`${n} ${plural(n, unit)} of ${what} cost ${cash(total)}. What is the price for 1 ${unit}?`,
        helper:'A unit rate is the amount for 1. Divide the total by how many.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${n} ${plural(n, unit)} = ${cash(total)}</div>`,
        steps:[moneyStep('Unit price', `${cash(total)} ÷ ${n} = ?`, per, {fact:lvl === 1 && per <= 1200 ? fx(n, per / 100, true) : undefined, slowOK:lvl > 1,
          mis:v => near(v, n / (total / 100)) ? 'rateUpsideDown' : near(v, total / 100 * n) ? 'wrongOperation' : null, hint:() => `Split ${cash(total)} into ${n} equal parts.`})]};
    }
    const [e2, what2] = pick(BY_EACH), r = pick([2, 4, 5, 10]), k = rand(2, 9), items = r * k, each = 100 / r;   // r items per dollar, so each costs 100/r cents
    return {title:'Price Tags', ctx:`${items} ${what2} for $${k}`, bubble:`${items} ${what2} cost $${k}. How many ${what2} do you get for $1? What is the price of 1?`,
      helper:'There are two unit rates: items per dollar and dollars per item.', visual:`<div style="text-align:center; font-size:1.6rem">${e2} ${items} for $${k}</div>`,
      steps:[numStep(`${what2} per dollar`, 'compute', `${items} ÷ ${k} = ?`, r, {fact:fx(k, r, true), mis:v => near(v, k / items) ? 'rateUpsideDown' : null, hint:() => `Share the ${items} ${what2} among the $${k}.`}),
        moneyStep('Price of 1', `$${k} ÷ ${items} = ?`, each, {mis:v => near(v, r) || near(v, items / k) ? 'rateUpsideDown' : null, hint:() => `$1 buys ${r}, so each one is $1 ÷ ${r}.`})],
      answerSteps:[1]};
  },
  rateProblems(lvl){
    const [e, what, unit] = pick(PRODUCE), n = rand(2, 6), per = lvl === 1 ? rand(2, 9) * 100 : rand(6, 45) * 10, total = n * per;
    if (lvl < 3) {
      let m; do { m = rand(2, 12); } while (m === n);
      return {title:'Price Tags', ctx:`${cash(total)} / ${n}, ${m}`, bubble:`${n} ${plural(n, unit)} of ${what} cost ${cash(total)}. How much do ${m} ${plural(m, unit)} cost?`,
        helper:'Find the price for 1 first, then multiply.', visual:dnlFit(`${e} ${unit}s`, '$', [{t:0, b:0}, {t:1, b:'?'}, {t:n, b:cash(total)}, {t:m, b:'?'}].sort((a, b) => a.t - b.t)),
        steps:[moneyStep('Price for 1', `${cash(total)} ÷ ${n} = ?`, per, {fact:lvl === 1 ? fx(n, per / 100, true) : undefined, mis:v => near(v, n / (total / 100)) ? 'rateUpsideDown' : null}),
          moneyStep(`Price for ${m}`, `${cash(per)} × ${m} = ?`, per * m, {fact:lvl === 1 ? fx(per / 100, m) : undefined, mis:v => near(v, total * m / 100) ? 'rateSkipUnit' : near(v, total / 100 + m) ? 'wrongOperation' : null,
            hint:() => `Each ${unit} is ${cash(per)}. ${m} of them is ${cash(per)} × ${m}.`})], answerSteps:[1]};
    }
    const m = rand(2, 12), budget = per * m;
    if (m === n) return MARKET_GEN.rateProblems(lvl);
    return {title:'Price Tags', ctx:`${cash(total)} / ${n}, budget ${cash(budget)}`, bubble:`${n} ${plural(n, unit)} of ${what} cost ${cash(total)}. How many ${plural(2, unit)} can you buy with ${cash(budget)}?`,
      helper:'Find the price for 1, then see how many of those fit in your money.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${n} for ${cash(total)} · 👛 ${cash(budget)}</div>`,
      steps:[moneyStep('Price for 1', `${cash(total)} ÷ ${n} = ?`, per, {mis:v => near(v, n / (total / 100)) ? 'rateUpsideDown' : null}),
        numStep(`How many ${unit}s`, 'compute', `${cash(budget)} ÷ ${cash(per)} = ?`, m, {slowOK:true, mis:v => near(v, budget * per / 10000) ? 'rateUpsideDown' : null, hint:() => `How many ${cash(per)}s are in ${cash(budget)}?`})],
      answerSteps:[1]};
  },
  compareRates(lvl){
    if (lvl === 3 && Math.random() < 0.5) {
      const names = shuffle(LEMON_KIDS).slice(0, 2), s = [rand(3, 8), 0]; do { s[1] = rand(3, 8); } while (s[1] === s[0]);
      let t = [rand(2, 9), rand(2, 9)]; if (s[0] * t[0] === s[1] * t[1]) t[1]++;
      if ((s[0] * t[0] > s[1] * t[1]) === (s[0] > s[1])) t = [t[1], t[0]];                       // the faster runner goes the shorter distance: a trap for comparing totals
      const d = [s[0] * t[0], s[1] * t[1]], fast = s[0] > s[1] ? 0 : 1, far = d[0] > d[1] ? 0 : 1;
      const opts = [0, 1].map(i => ({html:`${names[i][0]} ${names[i][1]}`, text:names[i][1], ok:i === fast, mis:i === fast ? null : i === far ? 'compareTotals' : null}));
      return {title:'Price Tags', ctx:`${d[0]}/${t[0]} vs ${d[1]}/${t[1]}`, bubble:`${names[0][1]} ran ${d[0]} meters in ${t[0]} seconds. ${names[1][1]} ran ${d[1]} meters in ${t[1]} seconds. Who is faster?`,
        helper:'Compare meters per second, not the total meters.', visual:`<div style="text-align:center; font-size:1.4rem">🏃 ${d[0]} m in ${t[0]} s · ${d[1]} m in ${t[1]} s</div>`,
        steps:[numStep(`${names[0][1]}'s speed`, 'compute', `${d[0]} ÷ ${t[0]} = ? meters per second`, s[0], {fact:fx(t[0], s[0], true), mis:v => near(v, t[0] / d[0]) ? 'rateUpsideDown' : null}),
          numStep(`${names[1][1]}'s speed`, 'compute', `${d[1]} ÷ ${t[1]} = ? meters per second`, s[1], {fact:fx(t[1], s[1], true), mis:v => near(v, t[1] / d[1]) ? 'rateUpsideDown' : null}),
          {name:'Who is faster?', type:'concept', kind:'choice', prompt:'Who is faster?', options:shuffle(opts), hint:() => 'More meters each second is faster.'}], answerSteps:[2]};
    }
    const [e, what, unit] = pick(PRODUCE), step = lvl === 1 ? 100 : lvl === 2 ? 25 : 5;
    const u = [rand(Math.ceil(100 / step), 600 / step) * step, 0]; do { u[1] = rand(Math.ceil(100 / step), 600 / step) * step; } while (u[1] === u[0] || Math.abs(u[1] - u[0]) > 300);
    let n = [rand(2, 8), rand(2, 8)]; if (n[0] === n[1]) n[1] = n[0] + 1;
    const cheap = u[0] < u[1] ? 0 : 1; if ((n[0] * u[0] < n[1] * u[1]) === (cheap === 0) && Math.random() < 0.7) n = [n[1], n[0]];   // usually the better buy costs more in total
    const tot = [n[0] * u[0], n[1] * u[1]], lowTotal = tot[0] < tot[1] ? 0 : tot[1] < tot[0] ? 1 : -1;
    const opts = ['A', 'B'].map((s, i) => ({html:`Stall ${s}`, text:`Stall ${s}`, ok:i === cheap, mis:i === cheap ? null : i === lowTotal ? 'compareTotals' : null}));
    return {title:'Price Tags', ctx:`${tot[0]}/${n[0]} vs ${tot[1]}/${n[1]}`, bubble:`Stall A sells ${n[0]} ${plural(n[0], unit)} of ${what} for ${cash(tot[0])}. Stall B sells ${n[1]} ${plural(n[1], unit)} for ${cash(tot[1])}. Which is the better buy?`,
      helper:'Find the price for 1 at each stall. The lower unit price is the better buy.', visual:`<div style="text-align:center; font-size:1.4rem">${e} A: ${n[0]} for ${cash(tot[0])} · B: ${n[1]} for ${cash(tot[1])}</div>`,
      steps:[moneyStep('Stall A, price for 1', `${cash(tot[0])} ÷ ${n[0]} = ?`, u[0], {mis:v => near(v, n[0] * 100 / tot[0]) ? 'rateUpsideDown' : null}),
        moneyStep('Stall B, price for 1', `${cash(tot[1])} ÷ ${n[1]} = ?`, u[1], {mis:v => near(v, n[1] * 100 / tot[1]) ? 'rateUpsideDown' : null}),
        {name:'Better buy', type:'concept', kind:'choice', prompt:'Which is the better buy?', options:opts, hint:() => `Compare ${cash(u[0])} and ${cash(u[1])} for 1 ${unit}.`}], answerSteps:[2]};
  },

  /* ----- station 2: Percent Signs (what a percent is) ----- */
  introPercent(lvl){
    const n = rand(3, 97), [e, what] = pick(BY_EACH);
    if (lvl === 1) return {title:'Percent Signs', ctx:`${n} of 100 shaded`, bubble:'What percent of the grid is shaded?', helper:'Percent means "out of 100". Each small square is 1%.',
      visual:`<div class="frac-pics">${hundredGridSVG(n)}</div>`,
      steps:[numStep('Percent shaded', 'concept', `${n} out of 100 = ?%`, n, {mis:v => v === 100 - n ? 'percentComplement' : null, hint:() => 'Count the shaded squares. Full rows are 10 each.'})]};
    if (lvl === 2) return {title:'Percent Signs', ctx:`${n} of 100, not shaded`, bubble:`Of 100 ${what} in the crate, ${n} are ripe. What percent are ripe? What percent are not ripe?`, helper:'The whole crate is 100%.',
      visual:`<div class="frac-pics">${hundredGridSVG(n)}</div>`,
      steps:[numStep('Percent ripe', 'concept', `${n} out of 100 = ?%`, n, {mis:v => v === 100 - n ? 'percentComplement' : null}),
        numStep('Percent not ripe', 'compute', `100% − ${n}% = ?%`, 100 - n, {mis:v => v === n ? 'percentComplement' : null, hint:() => 'The whole is 100%. Take away the ripe part.'})], answerSteps:[1]};
    const d = pick([10, 20, 25, 50]), k = rand(1, d - 1), p = k * 100 / d;
    return {title:'Percent Signs', ctx:`${k} of ${d}`, bubble:`${k} of the ${d} ${what} on the table are on sale. What percent is that?`, helper:'Make it "out of 100": multiply the top and bottom by the same number.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} out of ${d}</div>`,
      steps:[numStep('Out of 100', 'compute', `${k}/${d} = ?/100`, p, {fact:k <= 12 && d >= 10 ? fx(k, 100 / d) : undefined, mis:v => v === k ? 'percentNot100' : v === Number(`${k}${d}`) ? 'fractionDigitsPercent' : null, hint:() => `${d} × ${100 / d} = 100, so multiply ${k} by ${100 / d} too.`}),
        numStep('Percent', 'concept', `${k} out of ${d} = ?%`, p, {mis:v => v === k ? 'percentNot100' : null, skipIf:() => false})], answerSteps:[1]};
  },
  pctModel(lvl){
    const d = pick(lvl === 2 ? [20, 25] : [2, 4, 5, 10]), k = lvl === 3 ? d + rand(1, d - 1) : rand(1, d - 1), each = 100 / d, p = k * each;
    return {title:'Percent Signs', ctx:`${k}/${d} bar`, bubble:lvl === 3 ? 'Each bar is one whole. What percent is shaded?' : 'The bar is one whole. What percent is shaded?',
      helper:'The whole bar is 100%. Find the percent for one part first.', visual:`<div class="frac-pics">${fracBarSVG(k, d, {w:240})}</div>`,
      steps:[numStep('One part', 'concept', `100% ÷ ${d} = ?%`, each, {fact:d <= 12 && each <= 12 ? fx(d, each, true) : undefined, mis:v => v === d ? 'percentNot100' : null, hint:() => `${d} equal parts share 100%.`}),
        numStep('Shaded', 'compute', `${k} × ${each}% = ?%`, p, {mis:v => v === k ? 'percentNot100' : v === Number(`${k}${d}`) ? 'fractionDigitsPercent' : lvl === 3 && v === p - 100 ? 'percentComplement' : null, hint:() => `${k} parts, ${each}% each.`})],
      answerSteps:[1]};
  },

  /* ----- station 3: Sale Signs (percents, decimals, and fractions) ----- */
  pctConvert(lvl){
    const kind = lvl === 1 ? pick(['toDec', 'toPct']) : lvl === 2 ? pick(['pctFrac', 'fracPct']) : pick(['big', 'toDec', 'pctFrac']);
    if (kind === 'toDec' || kind === 'toPct') {
      const p = lvl === 1 ? rand(1, 99) : rand(101, 350), dec = XD.fmt(p, 2);
      if (kind === 'toDec') return {title:'Sale Signs', ctx:`${p}% → decimal`, bubble:`The sign says ${p}%. Write it as a decimal.`, helper:'Percent means out of 100: move the point 2 places left.',
        visual:`<div style="text-align:center; font-size:1.8rem">🪧 ${p}%</div>`,
        steps:[{name:'As a decimal', type:'concept', kind:'num', prompt:`${p}% = ?`, answer:dec, eq:XD.eq(p, 2), decimal:true, drill:{type:'decimalShift', key:'100'},
          mis:v => XD.eq(p, 2)(v) ? null : near(v, p / 10) || near(v, p / 1000) || near(v, p) ? 'percentShift' : null, hint:() => `${p}% is ${p} hundredths.`}]};
      return {title:'Sale Signs', ctx:`${dec} → percent`, bubble:`Write ${dec} as a percent.`, helper:'Multiply by 100: move the point 2 places right.', visual:`<div style="text-align:center; font-size:1.8rem">🪧 ${dec}</div>`,
        steps:[numStep('As a percent', 'concept', `${dec} = ?%`, p, {drill:{type:'decimalShift', key:'100'}, mis:v => near(v, p / 10) || near(v, p / 100) || near(v, p * 10) ? 'percentShift' : null, hint:() => `${dec} is ${p} hundredths.`})]};
    }
    if (kind === 'pctFrac' || kind === 'big') {
      let p; do { p = kind === 'big' ? rand(21, 70) * 5 : rand(1, 19) * 5; } while (p % 100 === 0);
      const steps = [numStep('Out of 100', 'concept', `${p}% = ?/100`, p, {mis:v => near(v, p / 100) ? 'percentShift' : null, hint:() => 'Percent means out of 100.'}), fracSimplestStep(p, 100)];
      if (kind === 'big') steps.unshift({name:'As a decimal', type:'concept', kind:'num', prompt:`${p}% = ?`, answer:XD.fmt(p, 2), eq:XD.eq(p, 2), decimal:true, mis:v => XD.eq(p, 2)(v) ? null : near(v, p / 10) || near(v, p / 1000) ? 'percentShift' : null});
      return {title:'Sale Signs', ctx:`${p}% → fraction`, bubble:kind === 'big' ? `Sales are up ${p}% of last week's. Write ${p}% as a decimal and as a fraction in simplest form.` : `The sign says ${p}% off. Write ${p}% as a fraction in simplest form.`,
        helper:'Write it over 100, then simplify.', visual:`<div style="text-align:center; font-size:1.8rem">🪧 ${p}%</div>`, steps, answerSteps:[steps.length - 1]};
    }
    const b = pick([2, 4, 5, 10, 20, 25, 50]), a = rand(1, b - 1), p = a * 100 / b;
    if (gcd(a, b) !== 1) return MARKET_GEN.pctConvert(lvl);
    return {title:'Sale Signs', ctx:`${a}/${b} → percent`, bubble:`${a}/${b} of the melons are sold. What percent is that?`, helper:'Make the bottom 100, then the top is the percent.',
      visual:`<div style="text-align:center; font-size:1.8rem">🍈 ${a}/${b}</div>`,
      steps:[numStep('Out of 100', 'compute', `${a}/${b} = ?/100`, p, {mis:v => v === a ? 'percentNot100' : v === Number(`${a}${b}`) ? 'fractionDigitsPercent' : null, hint:() => `${b} × ${100 / b} = 100.`}),
        numStep('Percent', 'concept', `${a}/${b} = ?%`, p, {mis:v => v === a ? 'percentNot100' : null})], answerSteps:[1]};
  },
  benchmarkPct(lvl){
    const B = lvl === 1 ? pick([[50, 2], [10, 10], [100, 1]]) : pick([[25, 4], [20, 5], [1, 100], [5, 20]]);
    if (lvl < 3) {
      const [P, div] = B, part = rand(2, lvl === 1 ? 30 : 25), N = part * div;
      return {title:'Sale Signs', ctx:`${P}% of ${N}`, bubble:`What is ${P}% of ${N}?`, helper:P === 100 ? '100% is the whole thing.' : `${P}% is 1/${div} of the whole.`,
        visual:`<div style="text-align:center; font-size:1.8rem">🧺 ${P}% of ${N}</div>`,
        steps:[numStep(`${P}%`, 'compute', `${P}% of ${N} = ?`, part, {fact:div <= 12 && part <= 12 ? fx(div, part, true) : undefined, mis:v => v === N * P || near(v, N / P) && P !== div ? 'percentAsNumber' : v === N - part ? 'percentComplement' : null,
          hint:() => P === 100 ? 'All of it.' : `Split ${N} into ${div} equal parts.`})]};
    }
    const [base, div, times, P] = pick([[10, 10, 3, 30], [10, 10, 7, 70], [25, 4, 3, 75], [20, 5, 3, 60], [10, 10, 4, 40], [5, 20, 3, 15], [20, 5, 4, 80]]), unit = rand(2, 15), N = unit * div;
    return {title:'Sale Signs', ctx:`${P}% of ${N}`, bubble:`What is ${P}% of ${N}? Use ${base}% to help.`, helper:`${P}% is ${times} groups of ${base}%.`, visual:`<div style="text-align:center; font-size:1.8rem">🧺 ${P}% of ${N}</div>`,
      steps:[numStep(`${base}%`, 'compute', `${base}% of ${N} = ?`, unit, {fact:div <= 12 && unit <= 12 ? fx(div, unit, true) : undefined, mis:v => near(v, N / base) && base !== div ? 'percentAsNumber' : null}),
        numStep(`${P}%`, 'compute', `${times} × ${unit} = ?`, unit * times, {fact:unit <= 12 ? fx(times, unit) : undefined, mis:v => v === N - unit * times ? 'percentComplement' : null})], answerSteps:[1]};
  },
  pctEquivalent(lvl){
    const P = lvl === 1 ? rand(1, 9) * 10 : rand(1, 19) * 5, u = P % 10 === 0 ? 10 : 20, N = rand(2, lvl === 1 ? 9 : 12) * u, part = P * N / 100;
    const [fn, fd] = FRAC.red(P, 100), dec = XD.fmt(P, 2);
    const right = pick([`${dec} × ${N}`, `${fn}/${fd} × ${N}`, `${N} ÷ 100 × ${P}`]);
    const wrongs = shuffle([{text:`${P} × ${N}`, mis:'percentAsNumber', val:P * N}, {text:`${N} ÷ ${P}`, mis:'percentAsNumber', val:N / P}, {text:`${XD.fmt(P, 3)} × ${N}`, mis:'percentShift', val:P * N / 1000}, {text:`${XD.fmt(P, 1)} × ${N}`, mis:'percentShift', val:P * N / 10}])
      .filter(w => Math.abs(w.val - part) > 1e-9).slice(0, 3);   // 10% of 80 is also 80 ÷ 10, so that one can't be a wrong answer
    const steps = [{name:'Same as', type:'concept', kind:'choice', prompt:`Which is the same as ${P}% of ${N}?`, options:choiceOf({text:right}, wrongs), hint:() => `${P}% = ${dec} = ${fn}/${fd}.`}];
    if (lvl >= 2) steps.push(numStep('Find it', 'compute', `${P}% of ${N} = ?`, part, {mis:v => v === P * N ? 'percentAsNumber' : v === N - part ? 'percentComplement' : null, hint:() => `${N} ÷ 100 × ${P}, or 10% is ${N / 10}.`}));
    return {title:'Sale Signs', ctx:`${P}% of ${N}: ${right}`, bubble:`A sign says ${P}% of the ${N} baskets are sold. Which math finds how many baskets are sold?${lvl >= 2 ? ' Then find it.' : ''}`,
      helper:'A percent can be written as a decimal or a fraction.', visual:`<div style="text-align:center; font-size:1.8rem">🧺 ${P}% of ${N}</div>`, steps, ...(lvl >= 2 ? {answerSteps:[1]} : {})};
  },

  /* ----- station 4: Discount Bin (percent problems) ----- */
  pctVisual(lvl){
    const seg = pick([4, 5]), stepP = 100 / seg, u = rand(2, 12) * (lvl === 3 ? 1 : 1), W = u * seg, j = rand(lvl === 3 ? 1 : 2, seg - 1), [e, what] = pick(BY_EACH);
    const ticks = Array.from({length:seg + 1}, (_, i) => ({t:`${i * stepP}%`, b:''}));
    if (lvl === 1) {
      ticks[0].b = 0; ticks[seg].b = W; ticks[j].b = '?';
      return {title:'Discount Bin', ctx:`${j * stepP}% of ${W}`, bubble:`The bin holds ${W} ${what}. What is ${j * stepP}% of ${W}?`, helper:`Split the whole into ${seg} equal jumps of ${stepP}%.`, visual:dnlFit('%', `${e}`, ticks, false),
        steps:[numStep(`One jump (${stepP}%)`, 'compute', `${W} ÷ ${seg} = ?`, u, {fact:fx(seg, u, true)}), numStep(`${j * stepP}%`, 'compute', `${j} × ${u} = ?`, j * u, {fact:fx(j, u), mis:v => v === W - j * u ? 'percentComplement' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      ticks[0].b = 0; ticks[j].b = j * u; ticks[seg].b = '?';
      return {title:'Discount Bin', ctx:`${j * u} is ${j * stepP}%`, bubble:`${j * u} ${what} are ${j * stepP}% of the bin. How many ${what} fill the whole bin?`, helper:`Find one jump of ${stepP}% first.`, visual:dnlFit('%', `${e}`, ticks, false),
        steps:[numStep(`One jump (${stepP}%)`, 'compute', `${j * u} ÷ ${j} = ?`, u, {fact:fx(j, u, true)}), numStep('100%', 'compute', `${seg} × ${u} = ?`, W, {fact:fx(seg, u), mis:v => v === j * u * j * stepP / 100 ? 'partWholeSwap' : null})], answerSteps:[1]};
    }
    ticks.forEach((t, i) => { t.b = i === 0 ? 0 : i === seg ? W : i === j ? j * u : ''; t.t = i === j ? '?' : t.t; });
    return {title:'Discount Bin', ctx:`${j * u} of ${W}`, bubble:`${j * u} of the ${W} ${what} are on sale. What percent are on sale?`, helper:'How many equal jumps from 0 to the dot? Each jump is the same percent.', visual:dnlFit('%', `${e}`, ticks, false),
      steps:[numStep('One jump', 'concept', `100% ÷ ${seg} = ?%`, stepP, {}), numStep('Percent', 'compute', `${j} × ${stepP}% = ?%`, j * stepP, {mis:v => v === j * u ? 'percentNot100' : v === 100 - j * stepP ? 'percentComplement' : null})], answerSteps:[1]};
  },
  findingPct(lvl){
    if (lvl === 1) {
      const P = rand(1, 9) * 10, W = rand(2, 30) * 10, ten = W / 10, part = ten * P / 10;
      return {title:'Discount Bin', ctx:`${P}% of ${W}`, bubble:`What is ${P}% of ${W}?`, helper:'Find 10% first, then build up.', visual:`<div style="text-align:center; font-size:1.8rem">${P}% of ${W}</div>`,
        steps:[numStep('10%', 'compute', `10% of ${W} = ?`, ten, {mis:v => v === W * 10 ? 'percentShift' : null}), numStep(`${P}%`, 'compute', `${P / 10} × ${ten} = ?`, part, {fact:ten <= 12 ? fx(P / 10, ten) : undefined, mis:v => v === P * W ? 'percentAsNumber' : v === W - part ? 'percentComplement' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const W = pick([20, 25, 50, 200, 300, 400, 500]), A = W < 100 ? rand(1, W - 1) : rand(1, W / 10 - 1) * 10, P = A * 100 / W;
      if (!Number.isInteger(P)) return MARKET_GEN.findingPct(lvl);
      return {title:'Discount Bin', ctx:`${A} of ${W} = ?%`, bubble:`${A} is what percent of ${W}?`, helper:'Write it as a fraction, then make the bottom 100.', visual:`<div style="text-align:center; font-size:1.8rem">${A} out of ${W}</div>`,
        steps:[numStep('Out of 100', 'compute', `${A}/${W} = ?/100`, P, {mis:v => v === A ? 'percentNot100' : near(v, W * 100 / A) ? 'partWholeSwap' : null, hint:() => W < 100 ? `${W} × ${100 / W} = 100.` : `${W} ÷ ${W / 100} = 100.`})]};
    }
    const [u, k] = pick([[10, rand(2, 9)], [5, rand(2, 9)], [20, rand(2, 4)], [25, rand(2, 3)]]), P = u * k, one = rand(2, 15), A = one * k, W = one * 100 / u;
    return {title:'Discount Bin', ctx:`${A} is ${P}% of ?`, bubble:`${A} is ${P}% of what number?`, helper:`${P}% is ${k} groups of ${u}%. Find ${u}%, then 100%.`, visual:`<div style="text-align:center; font-size:1.8rem">${A} = ${P}% of ?</div>`,
      steps:[numStep(`${u}%`, 'compute', `${A} ÷ ${k} = ?`, one, {fact:fx(k, one, true)}), numStep('100%', 'compute', `${one} × ${100 / u} = ?`, W, {fact:one <= 12 ? fx(one, 100 / u) : undefined, mis:v => near(v, A * P / 100) ? 'partWholeSwap' : v === A * P ? 'percentAsNumber' : null})],
      answerSteps:[1]};
  },
  pctWord(lvl){
    const [e, n] = pick(LEMON_KIDS), [pe, what] = pick(BY_EACH), kind = lvl === 1 ? 'part' : lvl === 2 ? pick(['part', 'pct']) : pick(['part', 'pct', 'whole', 'whole']);
    const P = pick([10, 20, 25, 30, 40, 50, 60, 75, 80]), W = rand(2, 12) * (P % 25 === 0 ? 4 : 10), A = P * W / 100;
    const T = {
      part:{story:pick([`${n}'s stall had ${W} ${what}. ${n} sold ${P}% of them. How many ${what} did ${n} sell?`, `A $${W} basket is ${P}% off. How many dollars do you save?`]), eqn:`${P}% of ${W} = ?`, ans:A},
      pct: {story:`${n} picked ${W} ${what}, and ${A} of them were too small to sell. What percent were too small?`, eqn:`?% of ${W} = ${A}`, ans:P},
      whole:{story:`${n} sold ${A} ${what} on Saturday. That was ${P}% of all the ${what} ${n} brought. How many ${what} did ${n} bring?`, eqn:`${P}% of ? = ${A}`, ans:W}
    }[kind];
    const all = [`${P}% of ${W} = ?`, `?% of ${W} = ${A}`, `${P}% of ? = ${A}`, `${P}% of ${A} = ?`];
    const shown = kind === 'part' ? [all[0], all[3], `?% of ${W} = ${P}`] : kind === 'pct' ? [all[1], `${A}% of ${W} = ?`, all[3]] : [all[2], `${P}% of ${A} = ?`, `?% of ${A} = ${P}`];
    const opts = choiceOf({text:T.eqn}, [...new Set(shown.slice(1))].map(t => ({text:t, mis:'partWholeSwap'})));
    const steps = [{name:'Pick the math', type:'concept', kind:'choice', prompt:'Which one matches the story?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => 'What do you know: the part, the percent, or the whole? What is missing?'},
      numStep('Solve', 'compute', T.eqn, T.ans, {slowOK:true, mis:v => kind === 'whole' && near(v, A * P / 100) ? 'partWholeSwap' : kind === 'part' && v === W - A ? 'percentComplement' : kind === 'pct' && v === A ? 'percentNot100' : null,
        hint:() => kind === 'part' ? `10% of ${W} is ${W / 10}.` : kind === 'pct' ? `${A} out of ${W} = ?/100.` : `${A} is ${P}%. Find 1 part, then 100%.`})];
    return {title:'Discount Bin', ctx:`${kind}: ${T.eqn}`, bubble:T.story, helper:'Part = percent × whole. Decide which one is missing.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${pe}</div>`, steps, answerSteps:[1]};
  }
};
Object.assign(GEN, MARKET_GEN);

/* ===== 6th grade, Clock Tower (Khan unit 4): exponents and order of operations ===== */
const SUP = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
/* exact rationals [p, q], q > 0, reduced */
const RQ = {
  of: (p, q = 1) => { const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; },
  add: (a, b) => RQ.of(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), sub: (a, b) => RQ.of(a[0] * b[1] - b[0] * a[1], a[1] * b[1]),
  mul: (a, b) => RQ.of(a[0] * b[0], a[1] * b[1]), div: (a, b) => b[0] === 0 ? null : RQ.of(a[0] * b[1] * Math.sign(b[0]), a[1] * Math.abs(b[0])),
  pow: (a, e) => RQ.of(Math.pow(a[0], e), Math.pow(a[1], e)),
  txt: a => a[1] === 1 ? String(a[0]) : a[0] > a[1] ? `${Math.floor(a[0] / a[1])} ${a[0] % a[1]}/${a[1]}` : `${a[0]}/${a[1]}`
};
/* order of operations engine: tokens are {n:[p,q]}, {op:'+'|'−'|'×'|'÷'|'^'}, {open:'('|'['}, {close:')'|']'} */
function ooParse(src, vals){
  const out = [];
  for (const t of src.split(' ')) {
    if (t === '(' || t === '[') out.push({open:t}); else if (t === ')' || t === ']') out.push({close:t});
    else if ('+−×÷^'.includes(t)) out.push({op:t});
    else if (/^\d+$/.test(t)) out.push({n:[+t, 1]});
    else out.push({n:vals[t]});
  }
  return out;
}
function ooText(tk, mark = null){
  let s = '';
  tk.forEach((x, i) => {
    const m0 = mark && i === mark[0] ? '⟨' : '', m1 = mark && i === mark[1] ? '⟩' : '';
    if (x.op === '^') return;
    if (tk[i - 1] && tk[i - 1].op === '^') { s += SUP(x.n[0]) + m1; return; }
    const piece = x.n ? (x.n[1] !== 1 && tk[i + 1] && tk[i + 1].op === '^' ? `(${RQ.txt(x.n)})` : RQ.txt(x.n)) : x.op ? ` ${x.op} ` : x.open || x.close;
    s += m0 + piece + m1;
  });
  s = s.replace(/\s+/g, ' ').replace(/([(\[]) /g, '$1').replace(/ ([)\]])/g, '$1').trim();
  return mark ? s : s.replace(/[⟨⟩]/g, '');
}
/* the expression with the part being worked on highlighted */
const ooHTML = (tk, lo, hi) => `<div class="oo-expr">${esc(ooText(tk, [lo, hi])).replace('⟨', '<mark>').replace('⟩', '</mark>')}</div>`;
/* the next operation by the order of operations: innermost grouping, then exponents, then × ÷ left to right, then + − left to right.
   opts: {noPrec} does every operation left to right, {noParens} ignores grouping, {expMul} treats a² as a × 2 (for spotting mix-ups) */
function ooNext(tk, opts = {}){
  let lo = 0, hi = tk.length - 1;
  if (!opts.noParens) { const c = tk.findIndex(x => x.close); if (c >= 0) { let o = c; while (!tk[o].open) o--; lo = o + 1; hi = c - 1; if (lo === hi) return {unwrap:[o, c]}; } }
  const inR = (f) => { for (let i = lo; i <= hi; i++) if (tk[i].op && f(tk[i].op)) return i; return -1; };
  let i = opts.noPrec ? inR(o => true) : inR(o => o === '^'); if (!opts.noPrec && i < 0) i = inR(o => o === '×' || o === '÷'); if (!opts.noPrec && i < 0) i = inR(o => o === '+' || o === '−');
  return i < 0 ? null : {i};
}
function ooApply(a, op, b, opts = {}){
  if (op === '^') return opts.expMul ? RQ.mul(a, b) : RQ.pow(a, b[0]);
  return op === '+' ? RQ.add(a, b) : op === '−' ? RQ.sub(a, b) : op === '×' ? RQ.mul(a, b) : RQ.div(a, b);
}
/* evaluate fully; returns {value, steps:[{a, op, b, r, lo, hi, before}]} or null if a step is impossible */
function ooEval(tk0, opts = {}){
  let tk = (opts.noParens ? tk0.filter(x => !x.open && !x.close) : tk0).slice(); const steps = [];
  for (let guard = 0; guard < 40; guard++) {
    if (tk.length === 1 && tk[0].n) return {value:tk[0].n, steps};
    const nx = ooNext(tk, opts); if (!nx) return null;
    if (nx.unwrap) { tk.splice(nx.unwrap[1], 1); tk.splice(nx.unwrap[0], 1); continue; }
    const i = nx.i, a = tk[i - 1], b = tk[i + 1]; if (!a || !b || !a.n || !b.n) return null;
    const r = ooApply(a.n, tk[i].op, b.n, opts); if (!r) return null;
    steps.push({a:a.n, op:tk[i].op, b:b.n, r, lo:i - 1, hi:i + 1, before:tk.slice()});
    tk.splice(i - 1, 3, {n:r});
  }
  return null;
}
const rqSame = (v, r) => FRAC.ok(v) && FRAC.same(v, r[0], r[1]);
/* a typed answer box for a rational: a number box for whole numbers, the fraction boxes otherwise */
function rqStep(name, prompt, r, {simplest = false, ...extra} = {}){
  if (r[1] === 1) return {name, type:'compute', kind:'num', prompt, answer:r[0], eq:v => v === r[0], ...extra, ...(extra.mis ? {mis:v => v === r[0] ? null : extra.mis([v, 1])} : {})};
  const ans = FRAC.simplest(r[0], r[1]);
  return {name, type:'compute', kind:'frac', prompt, answer:ans, eq:v => rqSame(v, r) && (!simplest || FRAC.canon(v)), ...extra,
    mis:v => { if (rqSame(v, r)) return simplest && !FRAC.canon(v) ? (v[1] >= v[2] ? 'notMixed' : 'notSimplest') : null; return extra.mis && FRAC.ok(v) ? extra.mis(FRAC.imp(v)) : null; }};
}
const opWord = s => s.op === '^' ? `${s.a[1] !== 1 ? `(${RQ.txt(s.a)})` : RQ.txt(s.a)}${SUP(s.b[0])}` : `${RQ.txt(s.a)} ${s.op} ${RQ.txt(s.b)}`;
/* build a whole order-of-operations problem from a template like 'a + b × c' */
function ooProblem(templates, fill, {title, check = () => true, fracOK = false}){
  for (let t = 0; t < 400; t++) {
    const src = pick(templates), vals = fill(src), tk = ooParse(src, vals), ev = ooEval(tk);
    if (!ev || ev.steps.length < 2) continue;
    if (ev.steps.some(s => s.r[0] <= 0 || (!fracOK && s.r[1] !== 1) || s.r[1] > 64 || Math.abs(s.r[0]) > 2000) || !check(ev)) continue;
    const text = ooText(tk), val = ev.value;
    /* wrong answers students really get: left to right, ignoring parentheses, a² as a × 2 */
    const alt = {leftToRight:ooEval(tk, {noPrec:true}), ignoresParens:ooEval(tk, {noParens:true}), expTimesBase:ooEval(tk, {expMul:true})};
    const finalMis = w => { for (const [id, e] of Object.entries(alt)) if (e && e.value[0] * w[1] === w[0] * e.value[1] && !(e.value[0] === val[0] && e.value[1] === val[1])) return id; return null; };
    /* "what do you do first?": every operation whose two sides are plain numbers, plus a² inside a squared group */
    const first = ev.steps[0], cands = [];
    const inPower = j => (tk[j - 1] && tk[j - 1].op === '^') || (tk[j + 1] && tk[j + 1].op === '^');   // 3 in 9 − 3² is not a plain number
    tk.forEach((x, i) => { if (x.op && tk[i - 1] && tk[i + 1] && tk[i - 1].n && tk[i + 1].n && (x.op === '^' || (!inPower(i - 1) && !inPower(i + 1)))) cands.push({text:opWord({a:tk[i - 1].n, op:x.op, b:tk[i + 1].n}), i}); });
    const rightText = opWord(first), lr = cands[0], firstI = first.lo + 1;
    const rank = o => o === '^' ? 3 : o === '×' || o === '÷' ? 2 : 1, rR = rank(first.op);
    const depth = j => tk.slice(0, j).filter(x => x.open).length - tk.slice(0, j).filter(x => x.close).length;
    /* a wrong first step must really give a different answer: a lower-level operation, one outside the parentheses, or the next one along after − or ÷ */
    const wrongs = cands.filter(c => c.i !== firstI && (depth(c.i) < depth(firstI) || rank(tk[c.i].op) < rR || (rank(tk[c.i].op) === rR && c.i === firstI + 2 && (first.op === '−' || first.op === '÷') && depth(c.i) === depth(firstI)))).map(c => {
      const inside = tk.slice(0, c.i).filter(x => x.open).length - tk.slice(0, c.i).filter(x => x.close).length > 0;
      const rightInside = tk.slice(0, firstI).filter(x => x.open).length - tk.slice(0, firstI).filter(x => x.close).length > 0;
      return {text:c.text, mis:rightInside && !inside ? 'ignoresParens' : first.op === '^' && c.i < firstI ? 'expLast' : c === lr ? 'leftToRight' : null};
    });
    const steps = [];
    const firstOpts = choiceOf({text:rightText}, wrongs);                 // two operations can read the same (4 + 4 twice): then there is nothing to choose
    if (firstOpts.length >= 2) steps.push({name:'Do first', type:'concept', kind:'choice', prompt:`${text}: what do you do first?`, options:firstOpts,
      hint:() => 'Grouping symbols first, then exponents, then × and ÷ from left to right, then + and − from left to right.'});
    ev.steps.forEach((s, k) => steps.push(rqStep(k === ev.steps.length - 1 ? 'Last step' : `Step ${k + 1}`, `${opWord(s)} = ?`, s.r, {work:ooHTML(s.before, s.lo, s.hi), slowOK:true,
      ...(s.a[1] === 1 && s.b[1] === 1 && s.r[1] === 1 ? {fact:s.op === '×' ? fx(s.a[0], s.b[0]) : s.op === '÷' ? fx(s.b[0], s.r[0], true) : undefined} : {}),
      ...(s.op === '^' ? {mis:w => w[0] * s.a[1] * s.b[0] === s.a[0] * s.b[0] * w[1] && s.b[0] !== 2 ? 'expTimesBase' : w[1] === 1 && s.a[1] === 1 && w[0] === s.a[0] * s.b[0] && s.a[0] !== 2 ? 'expTimesBase' : null} : {})})));
    const fin = rqStep('The answer', `${text} = ?`, val, {simplest:true, mis:finalMis}); fin.skipIf = () => true;       // quizzes ask only this; practice ends with the last step
    steps.push(fin);
    return {title, ctx:text, bubble:`Help me set the clock! What is ${text}?`, helper:'Grouping, exponents, × and ÷ left to right, then + and − left to right.',
      visual:`<div style="text-align:center; font-size:1.8rem">🕰️ ${esc(text)}</div>`, steps, answerSteps:[steps.length - 1]};
  }
  return null;
}
const OO_NOEXP = [
  ['a + b × c', 'a × b + c', 'a − b × c', 'a × b − c', 'a + b ÷ c', 'a ÷ b + c', '( a + b ) × c', 'a × ( b + c )', '( a − b ) × c', 'a − b + c', 'a ÷ b × c'],
  ['a + b × c − d', '( a + b ) × c − d', 'a × b ÷ c + d', 'a − ( b + c ) ÷ d', 'a × ( b − c ) + d', 'a + b ÷ c × d', '( a + b ) ÷ c + d', 'a − b × c + d'],
  ['a × ( b + c ) − d ÷ e', '( a − b ) × ( c + d )', 'a + b × ( c − d ) ÷ e', '[ ( a + b ) × c ] − d', 'a − b × c + d × e', '[ a + ( b − c ) ] × d ÷ e']];
const OO_EXP = [
  ['a ^ 2 + b', 'a + b ^ 2', 'a × b ^ 2', '( a + b ) ^ 2', 'a ^ 2 − b × c', 'a ^ 3 + b'],
  ['a + b × c ^ 2', '( a − b ) ^ 2 + c', 'a ^ 2 ÷ b + c', 'a ^ 3 − b × c', 'a × ( b + c ) ^ 2', 'a ^ 2 + b ^ 2'],
  ['a × ( b + c ) ^ 2 − d', '( a ^ 2 + b ) ÷ c', 'a ^ 2 + b ^ 2 × c', '[ a + ( b − c ) ^ 2 ] × d', 'a ^ 3 ÷ b − c × d', '( a + b ) ^ 2 − c ^ 2']];
const OO_FRAC = [
  ['F ^ 2', 'a × F', 'F ^ 2 × a', 'a ^ 2 × F', 'F ^ 3', 'F + F ^ 2'],
  ['F ^ 2 + F', 'a − F × b', 'F × ( a + b ) ^ 2', '( F ) ^ 2 × a + b', 'a ^ 2 × F − b', '( a − F ) × b'],
  ['F ^ 3 × a + b', '( F + F ) ^ 2', 'a ^ 2 × F − F', '( a − b ) ^ 2 ÷ F', 'F × a ^ 2 + F ^ 2', '[ a − F ] ^ 2']];
/* fill a template: letters get whole numbers (small bases before an exponent), F gets a proper fraction */
const ooFill = lvl => src => {
  const v = {}, tk = src.split(' '), top = [9, 12, 15][lvl - 1];
  tk.forEach((t, i) => { if (/^[a-e]$/.test(t)) { const e = tk[i + 1] === '^' ? +tk[i + 2] : tk[i + 1] === ')' && tk[i + 2] === '^' ? 0 : 1;
    v[t] = [e === 3 ? rand(2, 5) : e === 2 ? rand(2, lvl === 1 ? 9 : 12) : rand(2, top), 1]; } });
  let k = 0; const out = {...v}; src = src.replace(/F/g, () => `F${k++}`); for (let j = 0; j < k; j++) { const d = rand(2, 6), n = rand(1, d - 1); out[`F${j}`] = RQ.of(n, d); }
  return out;
};
function ooFracProblem(lvl){
  for (let t = 0; t < 400; t++) {
    const src0 = pick(OO_FRAC[lvl - 1]); let k = 0; const src = src0.replace(/F/g, () => `F${k++}`);
    const p = ooProblem([src], ooFill(lvl), {title:'Clock Face', fracOK:true, check:ev => ev.value[1] !== 1 || Math.random() < 0.3});
    if (p) return p;
  }
}
const CLOCK_GEN = {
  /* ----- station 1: Chimes (exponents) ----- */
  expMeaning(lvl){
    const b = rand(2, 9), e = rand(b === 2 ? 3 : 2, b >= 6 ? 3 : b >= 4 ? 4 : 5);   // 2² = 2 × 2 = 4 leaves no wrong answers
    if (lvl === 1) {
      const long = Array(e).fill(b).join(' × ');
      return {title:'Chimes', ctx:`${long} as a power`, bubble:`The bell rings ${b} times, and it does that ${e} times over: ${long}. Write it as a power.`, helper:'The base is the number being multiplied. The exponent counts how many times.',
        visual:`<div style="text-align:center; font-size:1.6rem">🔔 ${long}</div>`,
        steps:[{name:'As a power', type:'concept', kind:'choice', prompt:`${long} = ?`, options:choiceOf({text:`${b}${SUP(e)}`}, [{text:`${e}${SUP(b)}`, mis:'baseExpSwap', v:Math.pow(e, b)}, {text:`${b} × ${e}`, mis:'expTimesBase', v:b * e}].filter(w => w.v !== Math.pow(b, e))),
          hint:() => `${b} is multiplied ${e} times.`}]};
    }
    if (lvl === 2 && Math.random() < 0.7) {
      const long = Array(e).fill(b).join(' × ');
      return {title:'Chimes', ctx:`${b}${SUP(e)} meaning`, bubble:`What does ${b}${SUP(e)} mean? Then find its value.`, helper:'An exponent means repeated multiplication, not multiplying by the exponent.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 ${b}${SUP(e)}</div>`,
        steps:[{name:'What it means', type:'concept', kind:'choice', prompt:`${b}${SUP(e)} = ?`, options:choiceOf({text:long}, [{text:`${b} × ${e}`, mis:'expTimesBase', v:b * e}, {text:Array(b).fill(e).join(' × '), mis:'baseExpSwap', v:Math.pow(e, b)}, {text:Array(e).fill(b).join(' + '), mis:'expTimesBase', v:b * e}].filter(w => w.v !== Math.pow(b, e))),   // 2 × 2 is also 2², so it can't be a wrong answer
            hint:() => `Write ${b} down ${e} times with × between.`},
          numStep('Value', 'compute', `${long} = ?`, Math.pow(b, e), {slowOK:true, mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null})], answerSteps:[1]};
    }
    if (lvl === 2 || Math.random() < 0.4) {
      const z = pick([0, 1]), big = rand(2, 50);
      return {title:'Chimes', ctx:`${big}${SUP(z)}`, bubble:`What is ${big}${SUP(z)}?`, helper:z === 0 ? 'Any number (except 0) to the power 0 is 1.' : 'A number to the power 1 is itself.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 ${big}${SUP(z)}</div>`,
        steps:[numStep('Value', 'concept', `${big}${SUP(z)} = ?`, z === 0 ? 1 : big, {mis:v => z === 0 && (v === 0 || v === big) ? 'zeroExponent' : z === 1 && v === 1 ? 'zeroExponent' : null,
          hint:() => z === 0 ? `${big}³ ÷ ${big} = ${big}², ${big}² ÷ ${big} = ${big}¹, ${big}¹ ÷ ${big} = ?` : 'Just one copy of the number.'})]};
    }
    const bb = rand(2, 5), ee = rand(2, bb === 2 ? 6 : 4), val = Math.pow(bb, ee);
    return {title:'Chimes', ctx:`${bb}^? = ${val}`, bubble:`${bb} to what power is ${val}?`, helper:`Keep multiplying by ${bb} and count.`,
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${bb}<sup>?</sup> = ${val}</div>`,
      steps:[numStep('Exponent', 'concept', `${bb} to the power ? = ${val}`, ee, {mis:v => v * bb === val ? 'expTimesBase' : null, hint:() => `${bb}, ${bb * bb}, ${bb * bb * bb}, … count the ${bb}s.`})]};
  },
  powWhole(lvl){
    const [b, e] = lvl === 1 ? pick([[rand(2, 12), 2], [rand(2, 5), 3]]) : lvl === 2 ? pick([[rand(2, 4), rand(3, 5)], [rand(2, 9), 3], [10, rand(2, 6)]]) : pick([[rand(2, 3), rand(5, 7)], [rand(4, 6), 4], [rand(11, 15), 2], [rand(6, 9), 3]]);
    const val = Math.pow(b, e), steps = [];
    if (lvl === 1 || b === 10) steps.push(numStep('Value', 'compute', `${b}${SUP(e)} = ?`, val, {fact:e === 2 ? fx(b, b) : undefined, mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null,
      hint:() => b === 10 ? `1 followed by ${e} zeros.` : `${Array(e).fill(b).join(' × ')}.`}));
    else { let acc = b; for (let k = 2; k <= e; k++) { const nx = acc * b; steps.push(numStep(`${b}${SUP(k)}`, 'compute', `${acc} × ${b} = ?`, nx, {fact:fx(acc, b), slowOK:nx > 144})); acc = nx; }
      const fin = numStep('The answer', 'compute', `${b}${SUP(e)} = ?`, val, {mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null}); fin.skipIf = () => true; steps.push(fin); }
    return {title:'Chimes', ctx:`${b}${SUP(e)}`, bubble:`The tower bell rings ${b}${SUP(e)} times. How many rings is that?`, helper:'Multiply the base by itself, one time for each count of the exponent.',
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${b}${SUP(e)}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  powFrac(lvl){
    if (Math.random() < 0.5) {
      const d = rand(2, lvl === 1 ? 5 : 9), n = lvl === 1 ? 1 : rand(1, d - 1), e = lvl === 3 ? 3 : 2;
      if (gcd(n, d) !== 1) return CLOCK_GEN.powFrac(lvl);
      const P = Math.pow(n, e), Q = Math.pow(d, e);
      return {title:'Chimes', ctx:`(${n}/${d})${SUP(e)}`, bubble:`What is (${n}/${d})${SUP(e)}?`, helper:'Multiply the fraction by itself: top times top, bottom times bottom.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 (${n}/${d})${SUP(e)}</div>`,
        steps:[{name:'Value', type:'compute', kind:'frac', prompt:`(${n}/${d})${SUP(e)} = ${Array(e).fill(`${n}/${d}`).join(' × ')} = ?`, answer:[0, P, Q], eq:v => FRAC.same(v, P, Q) && FRAC.canon(v),
          mis:v => { if (!FRAC.ok(v)) return null; if (FRAC.same(v, P, Q)) return FRAC.canon(v) ? null : 'notSimplest'; const [a, b] = FRAC.imp(v); return a * d === P * b ? 'expOnlyTop' : a * d === n * e * b ? 'expTimesBase' : null; },
          hint:() => `${Array(e).fill(n).join(' × ')} on top, ${Array(e).fill(d).join(' × ')} on the bottom.`}]};
    }
    const t = lvl === 1 ? rand(1, 9) : lvl === 2 ? rand(1, 9) : rand(11, 19), e = lvl === 3 && t < 10 ? 3 : 2, base = XD.fmt(t, 1);   // t tenths
    const P = Math.pow(t, e), places = e, ans = XD.fmt(P, places);
    return {title:'Chimes', ctx:`${base}${SUP(e)}`, bubble:`What is ${base}${SUP(e)}?`, helper:'Multiply the digits, then count decimal places: each tenth adds one place.',
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${base}${SUP(e)}</div>`,
      steps:[{name:'Value', type:'compute', kind:'num', prompt:`${Array(e).fill(base).join(' × ')} = ?`, answer:ans, eq:XD.eq(P, places), decimal:true, drill:{type:'decimalShift', key:'10'},
        mis:v => XD.eq(P, places)(v) ? null : XD.eq(P, 1)(v) || XD.eq(P, places + 1)(v) ? 'decimalPower' : XD.eq(t * e, 1)(v) ? 'expTimesBase' : null,
        hint:() => `${Array(e).fill(t).join(' × ')} = ${P}. The answer has ${places} decimal places.`}]};
  },
  /* ----- station 2: Gears (order of operations) ----- */
  orderNoExp(lvl){ return ooProblem(OO_NOEXP[lvl - 1], ooFill(lvl), {title:'Gears'}); },
  orderOps(lvl){ return ooProblem(OO_EXP[lvl - 1], ooFill(lvl), {title:'Gears'}); },
  /* ----- station 3: Clock Face (fractions and exponents, comparing powers) ----- */
  orderFracExp(lvl){ return ooFracProblem(lvl); },
  compareExp(lvl){
    let A, B;
    if (lvl === 1) { const b = rand(3, 9), e = pick([2, 3]); A = [b, e]; B = [b, e, 'times']; }
    else if (lvl === 2) { let a, b; do { a = rand(2, 6); b = rand(2, 6); } while (a === b || Math.pow(a, b) > 5000 || Math.pow(b, a) > 5000); A = [a, b]; B = [b, a]; }
    else { const pairs = [[[2, 6], [4, 3]], [[3, 4], [9, 2]], [[2, 5], [3, 3]], [[2, 7], [5, 3]], [[3, 3], [5, 2]], [[2, 8], [4, 4]], [[4, 3], [8, 2]], [[6, 2], [3, 3]], [[7, 2], [2, 6]], [[10, 2], [5, 3]]]; [A, B] = shuffle(pick(pairs)); }
    const vA = Math.pow(A[0], A[1]), vB = B[2] === 'times' ? B[0] * B[1] : Math.pow(B[0], B[1]);
    const tA = `${A[0]}${SUP(A[1])}`, tB = B[2] === 'times' ? `${B[0]} × ${B[1]}` : `${B[0]}${SUP(B[1])}`;
    const right = vA > vB ? '>' : vA < vB ? '<' : '=', fA = A[0] * A[1], fB = B[0] * B[1], fake = fA > fB ? '>' : fA < fB ? '<' : '=';
    const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === fake ? 'expTimesBase' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Clock Face', ctx:`${tA} ? ${tB}`, bubble:`Which is bigger: ${tA} or ${tB}?`, helper:'Find the value of each side, then compare.', visual:'',
      steps:[numStep(tA, 'compute', `${tA} = ?`, vA, {slowOK:true, mis:v => v === A[0] * A[1] ? 'expTimesBase' : null}), numStep(tB, 'compute', `${tB} = ?`, vB, {slowOK:true, mis:v => B[2] !== 'times' && v === B[0] * B[1] ? 'expTimesBase' : null}),
        {name:'Compare', type:'concept', kind:'choice', prompt:`${tA} ◯ ${tB}`, options:opts, hint:() => `${tA} = ${vA} and ${tB} = ${vB}.`}], answerSteps:[2]};
  }
};
Object.assign(GEN, CLOCK_GEN);

/* ===== 6th grade, Ice Rink (Khan unit 5): negative numbers ===== */
const MINUS = '−';
const sgn = x => (x < 0 ? MINUS : '') + String(Math.abs(x));                                  // −7, 3
const sgnD = x => (x < 0 ? MINUS : '') + String(parseFloat(Math.abs(x).toFixed(3)));            // −1.25
/* t/den as text: −3/4, 1 1/2, −2 */
function sgnF(t, den){
  const g = gcd(Math.abs(t), den) || 1, p = Math.abs(t) / g, q = den / g, s = t < 0 ? MINUS : '';
  if (q === 1) return s + p; const w = Math.floor(p / q), r = p % q; return s + (w ? `${w} ${r}/${q}` : `${r}/${q}`);
}
/* a typed answer that may be negative: the ± button shows next to the box */
const negStep = (name, type, prompt, answer, extra = {}) => ({name, type, kind:'num', prompt, answer, neg:true, eq:v => typeof v === 'number' && Math.abs(v - answer) < 1e-9, ...extra,
  ...(extra.mis ? {mis:v => typeof v === 'number' && Math.abs(v - answer) < 1e-9 ? null : extra.mis(v)} : {})});
/* number line from lo to hi (in ticks of 1/den); labels every labelEvery ticks (0 always labeled); dots: [{t, name}] */
function iceLineSVG(lo, hi, den, {labelEvery = den, dots = [], w = 300, labelFn = null} = {}){
  const L = 16, R = w - 16, y = 30, n = hi - lo, step = (R - L) / n, X = t => L + (t - lo) * step;
  let g = `<line x1="${L - 8}" y1="${y}" x2="${R + 8}" y2="${y}" class="nl-line"/><path d="M${L - 8} ${y} l7 -5 v10 z M${R + 8} ${y} l-7 -5 v10 z" class="nl-arrow"/>`;
  for (let t = lo; t <= hi; t++) {
    const big = t % den === 0, lab = t === 0 || (t - lo) % labelEvery === 0 && (labelEvery > 0);
    g += `<line x1="${X(t)}" y1="${y - (big ? 9 : 5)}" x2="${X(t)}" y2="${y + (big ? 9 : 5)}" class="nl-line"/>`;
    if (lab) g += `<text x="${X(t)}" y="${y + 26}" class="nl-text${n > 24 ? ' nl-small' : ''}">${labelFn ? labelFn(t) : sgnF(t, den)}</text>`;
  }
  dots.forEach(d => { g += `<circle cx="${X(d.t)}" cy="${y}" r="7" class="nl-dot"/>${d.name ? `<text x="${X(d.t)}" y="${y - 14}" class="nl-text nl-name">${d.name}</text>` : ''}`; });
  return `<svg class="num-line" viewBox="0 0 ${w} 64" width="${w}" role="img" aria-label="number line from ${sgnF(lo, den)} to ${sgnF(hi, den)}">${g}</svg>`;
}
/* situations: [words with #, sign, what 0 means] */
const ICE_CONTEXTS = [
  ['The temperature is # degrees below zero.', -1, 'zero degrees'], ['The temperature is # degrees above zero.', 1, 'zero degrees'],
  ['A submarine is # meters below sea level.', -1, 'sea level'], ['A seagull flies # meters above sea level.', 1, 'sea level'],
  ['Mia owes her brother $#.', -1, 'owing nothing'], ['Sam put $# into his savings account.', 1, 'no change'],
  ['The hockey team lost # points in the standings.', -1, 'no change'], ['The team gained # yards on the play.', 1, 'no gain or loss'],
  ['The elevator went down # floors.', -1, 'staying on the same floor'], ['The skater climbed # steps up the bleachers.', 1, 'staying put'],
  ['The ice rink lost # visitors since last week.', -1, 'no change'], ['The rink earned $# from skate rentals.', 1, 'no money']];
const opposite = s => s.replace('below', '§').replace('above', 'below').replace('§', 'above').replace('Mia owes her brother $#', 'Mia\'s brother owes her $#').replace('put $# into', 'took $# out of')
  .replace('lost # points', 'gained # points').replace('gained # yards', 'lost # yards').replace('went down', 'went up').replace('climbed # steps up', 'climbed # steps down').replace('lost # visitors', 'gained # visitors').replace('earned $# from', 'spent $# on');
const RINK_GEN = {
  /* ----- station 1: Thermometer (what negative numbers mean) ----- */
  negIntro(lvl){
    const [txt, s, zero] = pick(ICE_CONTEXTS), n = rand(2, lvl === 1 ? 20 : 60), val = s * n, story = txt.replace('#', n);
    if (lvl === 1) return {title:'Thermometer', ctx:`${story} → ${sgn(val)}`, bubble:`${story} What number stands for that?`, helper:'Below, owing, losing, and down are negative. Above, earning, gaining, and up are positive.',
      visual:`<div style="text-align:center; font-size:1.6rem">🌡️ ${s < 0 ? '⬇️' : '⬆️'} ${n}</div>`,
      steps:[negStep('As a number', 'concept', 'Write it as a positive or negative number.', val, {mis:v => v === -val ? 'signWrong' : null, hint:() => `Is it ${s < 0 ? 'below' : 'above'} ${zero}? That makes it ${s < 0 ? 'negative' : 'positive'}.`})]};
    if (lvl === 2) {
      const pool = shuffle(ICE_CONTEXTS.filter(c => c[0] !== txt)), same = pool.find(c => c[1] === s);
      const right = story, wrong1 = opposite(txt).replace('#', n), wrong2 = same[0].replace('#', n + rand(1, 5));
      const opts = choiceOf({text:right}, [{text:wrong1, mis:'signWrong'}, {text:wrong2}]);
      return {title:'Thermometer', ctx:`${sgn(val)} means`, bubble:`Which one does ${sgn(val)} describe?`, helper:'The sign tells the direction. The number tells how far from 0.', visual:`<div style="text-align:center; font-size:2rem">🌡️ ${sgn(val)}</div>`,
        steps:[{name:'Which story', type:'concept', kind:'choice', prompt:`Which situation is ${sgn(val)}?`, options:opts, hint:() => `${sgn(val)} is ${n} ${s < 0 ? 'below' : 'above'} zero.`}]};
    }
    const opp = opposite(txt).replace('#', n);
    return {title:'Thermometer', ctx:`${story} / opposite`, bubble:`${story} Write that as a number. Then write the number for the opposite situation: ${opp}`,
      helper:'Opposite situations have opposite numbers: the same distance from 0 on the other side.', visual:`<div style="text-align:center; font-size:1.6rem">🌡️ ${n} ↔ ${n}</div>`,
      steps:[negStep('As a number', 'concept', story, val, {mis:v => v === -val ? 'signWrong' : null}), negStep('The opposite', 'concept', opp, -val, {mis:v => v === val ? 'signWrong' : null, hint:() => 'Same number, other sign.'})], answerSteps:[1]};
  },
  negLine(lvl){
    const [den, lo, hi, lab] = lvl === 1 ? [1, -10, 10, 5] : lvl === 2 ? [1, -20, 20, 10] : [1, -12, 12, 4];
    if (lvl < 3) {
      let t; do { t = rand(lo + 1, hi - 1); } while (t >= 0 && Math.random() < 0.75 || t === 0 || t % lab === 0);
      return {title:'Thermometer', ctx:`dot at ${sgn(t)}`, bubble:'The skater stopped at the dot. What number is it?', helper:'Numbers left of 0 are negative. Count the ticks from the nearest label.',
        visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:[{t}]}),
        steps:[negStep('Read the line', 'concept', 'What number is at the dot?', t, {mis:v => v === -t ? 'signWrong' : null, hint:() => `Start at ${sgn(t < 0 ? Math.ceil(t / lab) * lab : Math.floor(t / lab) * lab)} and count the ticks.`})]};
    }
    let a, b; do { a = rand(lo + 1, -1); b = rand(lo + 1, hi - 1); } while (b === a || b === -a || b === 0);
    const names = shuffle(['A', 'B', 'C']), pts = [a, b, -a], ask = a;
    const opts = [0, 1, 2].map(i => ({html:names[i], text:names[i], ok:pts[i] === ask, mis:pts[i] === -ask ? 'signWrong' : null}));
    return {title:'Thermometer', ctx:`find ${sgn(ask)}`, bubble:`Which point is at ${sgn(ask)}?`, helper:'Negative numbers are to the left of 0.',
      visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:pts.map((t, i) => ({t, name:names[i]}))}),
      steps:[{name:'Find the point', type:'concept', kind:'choice', prompt:`Which point is at ${sgn(ask)}?`, options:shuffle(opts), hint:() => `${sgn(ask)} is ${Math.abs(ask)} to the left of 0.`}]};
  },
  opposites(lvl){
    const n = rand(1, lvl === 1 ? 20 : 99), x = pick([n, -n]);
    if (lvl === 1) return {title:'Thermometer', ctx:`opposite of ${sgn(x)}`, bubble:`What is the opposite of ${sgn(x)}?`, helper:'The opposite is the same distance from 0 on the other side.',
      visual:iceLineSVG(-10, 10, 1, {labelEvery:5, dots:Math.abs(x) <= 10 ? [{t:x}] : []}),
      steps:[negStep('Opposite', 'concept', `The opposite of ${sgn(x)} is ?`, -x, {mis:v => v === x ? 'signWrong' : null})]};
    const k = lvl === 2 ? 2 : pick([2, 3]), expr = Array(k).fill(`${MINUS}(`).join('') + sgn(x) + ')'.repeat(k), val = k % 2 ? -x : x;
    const steps = [];
    let cur = x; for (let j = 1; j <= k; j++) { const inner = Array(j).fill(`${MINUS}(`).join('') + sgn(x) + ')'.repeat(j); cur = -cur;
      steps.push(negStep(j === k ? 'Value' : `Opposite ${j}`, 'concept', `${inner} = ?`, cur, {mis:w => w === -cur ? 'signWrong' : null, hint:() => `The opposite of ${sgn(-cur)}.`})); }
    return {title:'Thermometer', ctx:expr, bubble:`What is ${expr}?`, helper:`Each ${MINUS} in front means "the opposite of". Work from the inside out.`, visual:`<div style="text-align:center; font-size:2rem">🌡️ ${expr}</div>`, steps, answerSteps:[steps.length - 1]};
  },

  /* ----- station 2: Rink Lines (negative decimals and fractions) ----- */
  negDecLine(lvl){
    const [den, lo, hi, lab] = lvl === 1 ? [10, -10, 10, 5] : lvl === 2 ? [10, -20, 20, 10] : pick([[4, -8, 8, 4], [5, -10, 10, 5]]);
    let t; do { t = rand(lo + 1, hi - 1); } while (t % lab === 0 || t > 0 && Math.random() < 0.75);
    const val = t / den, txt = sgnD(val);
    return {title:'Rink Lines', ctx:`dot at ${txt}`, bubble:'The puck stopped at the dot. What decimal is it?', helper:`Each tick is ${sgnD(1 / den)}. Count from the nearest label.`,
      visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:[{t}], labelFn:u => sgnD(u / den)}),
      steps:[negStep('Read the line', 'concept', 'What decimal is at the dot?', val, {answer:txt.replace(MINUS, '-'), decimal:true, eq:v => typeof v === 'number' && Math.abs(v - val) < 1e-9,
        mis:v => Math.abs(v + val) < 1e-9 ? 'signWrong' : null, hint:() => `Each tick is ${sgnD(1 / den)}. It is left of 0, so it's negative.`})]};
  },
  negFracLine(lvl){
    const den = lvl === 1 ? pick([2, 4]) : lvl === 2 ? pick([3, 4, 6, 8]) : pick([2, 3, 4]), W = lvl === 3 ? 3 : 1, lo = -W * den, hi = W * den;
    let t; do { t = rand(lo + 1, hi - 1); } while (t % den === 0 || t > 0 && Math.random() < 0.7);
    const right = sgnF(t, den), wrongs = [{text:sgnF(-t, den), mis:'signWrong'}, {text:sgnF(t + (t < 0 ? 1 : -1), den)}, {text:sgnF(t < 0 ? t - 1 : t + 1, den)}];
    return {title:'Rink Lines', ctx:`dot at ${right}`, bubble:'The skate blade is at the dot. What number is it?', helper:`Each whole is cut into ${den} equal parts.`,
      visual:iceLineSVG(lo, hi, den, {labelEvery:den, dots:[{t}]}),
      steps:[{name:'Read the line', type:'concept', kind:'choice', prompt:'What number is at the dot?', options:choiceOf({text:right}, wrongs), hint:() => `Count the ${FRAC.part(den, true)} from 0. Left of 0 is negative.`}]};
  },

  /* ----- station 3: Race Board (comparing and ordering) ----- */
  cmpLine(lvl){
    let a, b; do { a = rand(-10, 10); b = rand(-10, 10); } while (a === b || Math.abs(a - b) < 2 || (a >= 0 && b >= 0) || (lvl >= 2 && (a > 0 || b > 0) && Math.random() < 0.7));
    const r = a > b ? '>' : '<', trap = Math.abs(a) > Math.abs(b) ? '>' : Math.abs(a) < Math.abs(b) ? '<' : null;
    const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === trap && t !== r ? 'negCompare' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Race Board', ctx:`${sgn(a)} ? ${sgn(b)}`, bubble:`Use the number line. Compare ${sgn(a)} and ${sgn(b)}.`, helper:'Farther right is greater.',
      visual:iceLineSVG(-10, 10, 1, {labelEvery:5, dots:[{t:a, name:sgn(a)}, {t:b, name:sgn(b)}]}),
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${sgn(a)} ◯ ${sgn(b)}`, options:opts, hint:() => `Which one is farther right?`}]};
  },
  cmpRational(lvl){
    const make = () => lvl === 1 ? rand(-30, 30) : lvl === 2 ? rand(-50, 50) / 10 : pick([rand(-40, 40) / 4, rand(-30, 30) / 10]);
    let a, b; do { a = make(); b = make(); } while (a === b || (a > 0 && b > 0) || Math.random() < 0.3 && !(a < 0 && b < 0));
    const txt = x => lvl === 3 && Math.round(x * 4) === x * 4 && Math.round(x * 10) !== x * 10 ? sgnF(Math.round(x * 4), 4) : sgnD(x);
    const r = a > b ? '>' : '<', trap = Math.abs(a) > Math.abs(b) ? '>' : '<';
    const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === trap && t !== r ? 'negCompare' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Race Board', ctx:`${txt(a)} ? ${txt(b)}`, bubble:`Which is greater: ${txt(a)} or ${txt(b)}?`, helper:'For negatives, the one closer to 0 is greater.', visual:'',
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${txt(a)} ◯ ${txt(b)}`, options:opts, hint:() => 'Picture them on a number line: farther right is greater.'}]};
  },
  orderNeg(lvl){
    const pool = new Set(); while (pool.size < 4) pool.add(lvl === 1 ? rand(-15, 15) : lvl === 2 ? rand(-60, 60) / 10 : rand(-20, 20) / 4);
    const vals = [...pool], txt = x => lvl === 3 && Math.round(x) !== x ? sgnF(Math.round(x * 4), 4) : sgnD(x);
    if (vals.filter(v => v < 0).length < 2) return RINK_GEN.orderNeg(lvl);
    const up = [...vals].sort((x, y) => x - y), byAbs = [...vals].sort((x, y) => Math.abs(x) - Math.abs(y) || x - y), down = [...up].reverse();
    const T = arr => arr.map(txt).join(', ');
    const digitsFirst = [...up.filter(v => v < 0).reverse(), ...up.filter(v => v >= 0)];      // −2, −8, 1, 5: negatives ordered by their digits
    const wrongs = [{text:T(byAbs), mis:'negCompare'}, {text:T(digitsFirst), mis:'negCompare'}, {text:T(down)}];
    return {title:'Race Board', ctx:`order ${T(vals)}`, bubble:`Put these race times (seconds ahead or behind) in order from least to greatest: ${T(vals)}.`, helper:'Least is farthest left on the number line. Negatives come first, and the most negative is least.',
      visual:`<div style="text-align:center; font-size:1.4rem">🏁 ${T(vals)}</div>`,
      steps:[{name:'Least to greatest', type:'concept', kind:'choice', prompt:'Which order goes from least to greatest?', options:choiceOf({text:T(up)}, wrongs), hint:() => 'The negative with the biggest digits is the least.'}]};
  },
  numIneq(lvl){
    const places = shuffle([['Fargo', '🏙️'], ['the rink', '⛸️'], ['Denver', '🏔️'], ['the lake', '🏞️'], ['Anchorage', '🌨️'], ['the pond', '🦆']]).slice(0, 2);
    let a, b; do { a = rand(-20, lvl === 1 ? 10 : 5); b = rand(-20, lvl === 1 ? 10 : 5); } while (a === b || (lvl >= 2 && (a >= 0 || b >= 0)));
    const colder = a < b ? 0 : 1, lo = Math.min(a, b), hi = Math.max(a, b);
    const say = pick(['colder', 'warmer']), who = say === 'colder' ? colder : 1 - colder;
    const right = say === 'colder' ? `${sgn(lo)} < ${sgn(hi)}` : `${sgn(hi)} > ${sgn(lo)}`;
    const wrongs = say === 'colder' ? [{text:`${sgn(lo)} > ${sgn(hi)}`, mis:'negCompare'}, {text:`${sgn(hi)} < ${sgn(lo)}`, mis:'negCompare'}] : [{text:`${sgn(hi)} < ${sgn(lo)}`, mis:'negCompare'}, {text:`${sgn(lo)} > ${sgn(hi)}`, mis:'negCompare'}];
    const T = [a, b];
    return {title:'Race Board', ctx:right, bubble:`It is ${sgn(T[0])}°F at ${places[0][0]} and ${sgn(T[1])}°F at ${places[1][0]}. ${places[who][0][0].toUpperCase() + places[who][0].slice(1)} is ${say}. Which inequality shows that?`,
      helper:'Colder is less. Warmer is greater.', visual:`<div style="text-align:center; font-size:1.4rem">${places[0][1]} ${sgn(T[0])}° · ${places[1][1]} ${sgn(T[1])}°</div>`,
      steps:[{name:'Write it', type:'concept', kind:'choice', prompt:'Which inequality matches?', options:choiceOf({text:right}, wrongs), hint:() => `${sgn(lo)} is farther left, so it is less.`}]};
  },

  /* ----- station 4: Ice Depth (absolute value) ----- */
  absVal(lvl){
    if (lvl < 3) {
      const x = lvl === 1 ? pick([-1, 1]) * rand(1, 30) : pick([-1, 1]) * rand(1, 99) / 10, t = sgnD(x);
      return {title:'Ice Depth', ctx:`|${t}|`, bubble:`What is |${t}|?`, helper:'Absolute value is the distance from 0, so it is never negative.', visual:`<div style="text-align:center; font-size:2rem">🧊 |${t}|</div>`,
        steps:[negStep('Distance from 0', 'concept', `|${t}| = ?`, Math.abs(x), {answer:sgnD(Math.abs(x)), decimal:lvl === 2, mis:v => Math.abs(v + Math.abs(x)) < 1e-9 ? 'absNegative' : null, hint:() => `How far is ${t} from 0?`})]};
    }
    const a = rand(1, 15), b = rand(1, 15), kind = pick(['negOut', 'sum', 'diff']);
    const [expr, val, parts] = kind === 'negOut' ? [`${MINUS}|${sgn(-a)}|`, -a, [[`|${sgn(-a)}|`, a]]] : kind === 'sum' ? [`|${sgn(-a)}| + |${sgn(b)}|`, a + b, [[`|${sgn(-a)}|`, a], [`|${sgn(b)}|`, b]]] : [`|${sgn(-a - b)}| ${MINUS} |${sgn(-b)}|`, a, [[`|${sgn(-a - b)}|`, a + b], [`|${sgn(-b)}|`, b]]];
    const steps = parts.map(([e, v]) => negStep(e, 'concept', `${e} = ?`, v, {mis:w => w === -v ? 'absNegative' : null}));
    steps.push(negStep('Value', 'compute', `${expr} = ?`, val, {mis:w => kind === 'negOut' && w === a ? 'absNegative' : kind === 'sum' && w === b - a ? 'absIgnored' : kind === 'diff' && w === -a ? 'absIgnored' : null,
      hint:() => kind === 'negOut' ? 'Find the absolute value first, then take its opposite.' : 'Find each absolute value first.'}));
    return {title:'Ice Depth', ctx:expr, bubble:`What is ${expr}?`, helper:'Do each absolute value first. A minus sign outside the bars stays.', visual:`<div style="text-align:center; font-size:2rem">🧊 ${expr}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  cmpAbs(lvl){
    let a, b; do { a = rand(-20, 20); b = rand(-20, 20); } while (a === b || Math.abs(a) === Math.abs(b) || (a > 0 && b > 0));
    if (lvl < 3) {
      const A = Math.abs(a), B = Math.abs(b), r = A > B ? '>' : '<', raw = a > b ? '>' : '<';
      const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === raw && t !== r ? 'absIgnored' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
      const steps = [];
      if (lvl === 1) steps.push(negStep(`|${sgn(a)}|`, 'concept', `|${sgn(a)}| = ?`, A, {mis:v => v === a && a < 0 ? 'absNegative' : null}), negStep(`|${sgn(b)}|`, 'concept', `|${sgn(b)}| = ?`, B, {mis:v => v === b && b < 0 ? 'absNegative' : null}));
      steps.push({name:'Compare', type:'concept', kind:'choice', prompt:`|${sgn(a)}| ◯ |${sgn(b)}|`, options:opts, hint:() => `Compare the distances ${A} and ${B}.`});
      return {title:'Ice Depth', ctx:`|${sgn(a)}| ? |${sgn(b)}|`, bubble:`Compare |${sgn(a)}| and |${sgn(b)}|.`, helper:'Compare the distances from 0.', visual:'', steps, ...(lvl === 1 ? {answerSteps:[2]} : {})};
    }
    const c = a + (a > 0 ? 1 : -1);        /* [text, value, the number inside without the bars] */
    const items = [[`|${sgn(a)}|`, Math.abs(a), a], [sgn(b), b, b], [`${MINUS}|${sgn(c)}|`, -Math.abs(c), c], [`|${sgn(b)}|`, Math.abs(b), b]];
    if (new Set(items.map(i => i[1])).size < 4) return RINK_GEN.cmpAbs(lvl);
    const up = [...items].sort((x, y) => x[1] - y[1]).map(i => i[0]).join(', '), noAbs = [...items].sort((x, y) => x[2] - y[2] || x[1] - y[1]).map(i => i[0]).join(', ');
    const down = [...items].sort((x, y) => y[1] - x[1]).map(i => i[0]).join(', ');
    return {title:'Ice Depth', ctx:`order ${items.map(i => i[0]).join(', ')}`, bubble:`Put these in order from least to greatest: ${shuffle(items.map(i => i[0])).join(', ')}.`, helper:'Find each value first. Absolute values are never negative, but a minus sign outside the bars makes it negative.', visual:'',
      steps:[{name:'Least to greatest', type:'concept', kind:'choice', prompt:'Which order goes from least to greatest?', options:choiceOf({text:up}, [{text:noAbs, mis:'absIgnored'}, {text:down}]), hint:() => items.map(i => `${i[0]} = ${sgn(i[1])}`).join(', ') + '.'}]};
  },
  absWord(lvl){
    if (lvl === 1) {
      const [txt, s] = pick(ICE_CONTEXTS.filter(c => c[1] < 0)), n = rand(3, 60), story = txt.replace('#', n);
      return {title:'Ice Depth', ctx:`|${sgn(-n)}| in words`, bubble:`${story} The number is ${sgn(-n)}. How far is that from 0?`, helper:'Absolute value is the size of the change or the distance, without the direction.',
        visual:`<div style="text-align:center; font-size:1.6rem">🧊 |${sgn(-n)}|</div>`,
        steps:[negStep('How far from 0', 'concept', `|${sgn(-n)}| = ?`, n, {mis:v => v === -n ? 'absNegative' : null})]};
    }
    if (lvl === 2) {
      let d, h; do { d = rand(5, 60); h = rand(5, 60); } while (d === h);
      const far = d > h ? 'The diver' : 'The bird';
      return {title:'Ice Depth', ctx:`${sgn(-d)} vs ${h}`, bubble:`A diver is at ${sgn(-d)} meters and a bird is at ${h} meters. Who is farther from sea level?`, helper:'Compare the absolute values: the distances from 0.',
        visual:`<div style="text-align:center; font-size:1.6rem">🤿 ${sgn(-d)} m · 🐦 ${h} m</div>`,
        steps:[negStep('Diver\'s distance', 'concept', `|${sgn(-d)}| = ?`, d, {mis:v => v === -d ? 'absNegative' : null}),
          {name:'Farther', type:'concept', kind:'choice', prompt:'Who is farther from sea level?', options:choiceOf({text:far}, [{text:far === 'The diver' ? 'The bird' : 'The diver', mis:d > h ? 'absIgnored' : null}]), hint:() => `${d} meters down vs ${h} meters up.`}], answerSteps:[1]};
    }
    const limit = rand(2, 9) * 5, bal = [-(limit + rand(1, 9)), -(limit - rand(1, 4)), limit + rand(1, 9)];
    const opts = choiceOf({text:`${MINUS}$${Math.abs(bal[0])}`}, [{text:`${MINUS}$${Math.abs(bal[1])}`}, {text:`$${bal[2]}`, mis:'absIgnored'}]);
    return {title:'Ice Depth', ctx:`debt more than ${limit}`, bubble:`A skate shop account shows a debt of more than $${limit}. Which balance could it be?`, helper:'A debt is a negative balance. A debt of more than $' + limit + ' is a balance less than ' + MINUS + '$' + limit + '.',
      visual:`<div style="text-align:center; font-size:1.6rem">🧾 debt &gt; $${limit}</div>`,
      steps:[{name:'Which balance', type:'concept', kind:'choice', prompt:`Which balance is a debt of more than $${limit}?`, options:opts, hint:() => `Owing more than $${limit} means the balance is below ${MINUS}$${limit}.`}]};
  }
};
Object.assign(GEN, RINK_GEN);

/* ===== 6th grade, Potion Lab part 1 (Khan unit 6): variables and expressions ===== */
const term = (c, v) => c === 1 ? v : `${c}${v}`;                                              // 1x → x, 3x
/* show an explicit-× expression the way it is written in algebra: 3 × x → 3x, x × y → xy, 3 × ( → 3( */
const algText = src => src.replace(/(\d+) × ([a-z])\b/g, '$1$2').replace(/([a-z]) × ([a-z])\b/g, '$1$2').replace(/(\d+|[a-z]) × \(/g, '$1(')
  .replace(/ \^ (\d)/g, (m, d) => SUP(d)).replace(/\( /g, '(').replace(/ \)/g, ')');
/* evaluate an expression like '3 × x + 2' at vals {x:[5, 1]}: one step per operation, the substituted expression shown with each step */
function evalProblem(src, vals, {title, bubble, helper}){
  const tk = ooParse(src, vals), ev = ooEval(tk);
  if (!ev || ev.steps.some(s => s.r[0] < 0 || s.r[1] > 64 || Math.abs(s.r[0]) > 5000)) return null;
  const val = ev.value, text = algText(src);
  /* wrong answers students really get: 3x read as 35 when x = 5, x² as x × 2, 3x² as (3x)², working left to right */
  const allWhole = Object.values(vals).every(v => v[1] === 1);
  const joined = allWhole ? src.replace(/(\d+) × ([a-z])\b/g, (m, n, v) => `${n}${vals[v][0]}`) : null;
  const inside = src.replace(/(\d+) × ([a-z]) \^ (\d)/g, '( $1 × $2 ) ^ $3');
  const alts = {coefDigits:joined && joined !== src ? ooEval(ooParse(joined, vals)) : null, expTimesBase:ooEval(tk, {expMul:true}),
    coefInsidePower:inside !== src ? ooEval(ooParse(inside, vals)) : null, leftToRight:ooEval(tk, {noPrec:true})};
  const finalMis = w => { for (const [id, e] of Object.entries(alts)) if (e && e.value[0] * w[1] === w[0] * e.value[1] && !(e.value[0] === val[0] && e.value[1] === val[1])) return id; return null; };
  const steps = ev.steps.map((s, k) => rqStep(k === ev.steps.length - 1 ? 'Last step' : `Step ${k + 1}`, `${opWord(s)} = ?`, s.r, {work:ooHTML(s.before, s.lo, s.hi), slowOK:true,
    ...(s.a[1] === 1 && s.b[1] === 1 && s.r[1] === 1 ? {fact:s.op === '×' ? fx(s.a[0], s.b[0]) : s.op === '÷' ? fx(s.b[0], s.r[0], true) : s.op === '^' && s.b[0] === 2 ? fx(s.a[0], s.a[0]) : undefined} : {})}));
  const fin = rqStep('The answer', `${text} = ?`, val, {simplest:true, mis:finalMis}); fin.skipIf = () => true;
  steps.push(fin);
  const given = Object.entries(vals).filter(([k]) => src.includes(k)).map(([k, v]) => `${k} = ${RQ.txt(v)}`).join(' and ');
  return {title, ctx:`${text}, ${given}`, bubble:bubble || `What is ${text} when ${given}?`, helper:helper || 'Put the number in for the letter, then use the order of operations.',
    visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${esc(text)}</div><div style="text-align:center">${esc(given)}</div>`, steps, answerSteps:[steps.length - 1]};
}
const tryGen = f => { for (let t = 0; t < 300; t++) { const p = f(); if (p) return p; } throw new Error('no problem'); };
/* an expression in x (and y) as text plus a function, so options can be checked for equivalence */
const EX = (text, f) => ({text, f});
const sameFn = (f, g) => [1, 2, 3, 5, 7, 0.5].every(x => [1, 4].every(y => Math.abs(f(x, y) - g(x, y)) < 1e-9));
/* choice options from expressions: wrong ones that are secretly equivalent to the right one are dropped */
const exprChoice = (right, wrongs) => choiceOf({text:right.text}, wrongs.filter(w => !sameFn(w.f, right.f)).map(w => ({text:w.text, mis:w.mis})));
const POTION_WORDS = [['🧪', 'drops of dragon dew'], ['🍄', 'glow mushrooms'], ['🪶', 'phoenix feathers'], ['💎', 'crystal shards'], ['🌿', 'moon leaves'], ['🫧', 'bubble beads']];
const POTION_GEN = {
  /* ----- station 1: Ingredients (parts of expressions, evaluating) ----- */
  exprParts(lvl){
    const a = rand(2, 9), b = rand(2, 9), c = rand(2, 20), one = Math.random() < 0.3;
    if (lvl === 1) {
      const nT = pick([2, 3]), text = nT === 2 ? `${term(a, 'x')} + ${c}` : `${term(a, 'x')} + ${term(b, 'y')} + ${c}`, ask = pick(['terms', 'constant']);
      return {title:'Ingredients', ctx:`${text}: ${ask}`, bubble:ask === 'terms' ? `The potion recipe is ${text}. How many terms does it have?` : `The potion recipe is ${text}. What is the constant term?`,
        helper:'Terms are the parts being added. The constant is the term with no letter.', visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
        steps:[ask === 'terms' ? numStep('Terms', 'concept', `How many terms are in ${text}?`, nT, {mis:v => v === nT + 1 || v === (nT === 2 ? 1 : 2) ? 'termCount' : null, hint:() => 'Count the parts separated by + signs.'})
          : numStep('Constant', 'concept', `What is the constant term in ${text}?`, c, {mis:v => v === a || v === b ? 'coefConstant' : null, hint:() => 'It is the number standing alone, with no letter.'})]};
    }
    if (lvl === 2) {
      const ca = one ? 1 : a, text = `${term(b, 'y')} + ${term(ca, 'x')} + ${c}`;
      return {title:'Ingredients', ctx:`${text}: coef x`, bubble:`In ${text}, what is the coefficient of x?`, helper:'The coefficient is the number multiplying the letter. x by itself means 1x.',
        visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
        steps:[numStep('Coefficient', 'concept', `The coefficient of x in ${text} is ?`, ca, {mis:v => ca === 1 && v === 0 ? 'coefOne' : v === c ? 'coefConstant' : v === b ? 'coefConstant' : null, hint:() => ca === 1 ? 'x means 1 × x.' : `What number is right in front of x?`})]};
    }
    const kinds = [
      [`${a}(x + ${b})`, 'a product of two factors', ['a sum of two terms', `a quotient of ${a} and x`], `${a} is multiplied by the whole (x + ${b}).`],
      [`${term(a, 'x')} + ${b}`, 'a sum of two terms', ['a product of two factors', 'a quotient of two terms'], `${term(a, 'x')} and ${b} are added.`],
      [`(x + ${a}) ÷ ${b}`, 'a quotient of two parts', ['a sum of two terms', 'a product of two factors'], `The whole (x + ${a}) is divided by ${b}.`],
      [`${a}(x − ${b})`, 'a product of two factors', ['a difference of two terms', 'a sum of two terms'], `${a} is multiplied by the whole (x − ${b}).`]];
    const [text, right, wrongs, why] = pick(kinds);
    return {title:'Ingredients', ctx:`${text}: describe`, bubble:`Which words describe ${text}?`, helper:'Look at the last thing you would do: multiply, add, subtract, or divide.',
      visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
      steps:[{name:'Describe it', type:'concept', kind:'choice', prompt:`${text} is…`, options:choiceOf({text:right}, wrongs.map(w => ({text:w, mis:'exprStructure'}))), hint:() => why}]};
  },
  evalOne(lvl){
    return tryGen(() => {
      const a = rand(2, 9), b = rand(1, 12), x = lvl === 3 ? pick([RQ.of(1, 2), RQ.of(3, 4), RQ.of(1, 3), RQ.of(2, 5), [rand(2, 9), 1]]) : [rand(2, lvl === 1 ? 10 : 12), 1];
      const srcs = lvl === 1 ? [`${a} × x`, `x + ${b}`, `${a} × x + ${b}`, `x − ${b}`] : [`${a} × x + ${b}`, `${a} × ( x + ${b} )`, `${a} × x − ${b}`, `x ÷ ${a} + ${b}`, `${b} + ${a} × x`];
      let src = pick(srcs);
      if (src.startsWith('x ÷') && x[1] === 1 && x[0] % a) src = `${a} × x + ${b}`;
      return evalProblem(src, {x}, {title:'Ingredients'});
    });
  },
  evalExp(lvl){
    return tryGen(() => {
      const a = rand(2, 6), b = rand(1, 10), x = [rand(2, lvl === 1 ? 6 : 9), 1];
      const srcs = lvl === 1 ? ['x ^ 2', `x ^ 2 + ${b}`, 'x ^ 3'] : lvl === 2 ? [`${a} × x ^ 2`, `x ^ 2 − ${b}`, `( x + ${b} ) ^ 2`, `x ^ 3 + ${b}`] : [`${a} × x ^ 2 + ${b}`, `x ^ 2 − ${a} × x`, `( x − ${a} ) ^ 2 + ${b}`, `${a} × x ^ 2 − x`];
      const src = pick(srcs); if (src.includes('^ 3') && x[0] > 5) return null;
      return evalProblem(src, {x}, {title:'Ingredients', helper:'Put the number in for x. Exponents come before multiplying: 3x² means 3 × x × x.'});
    });
  },
  evalMulti(lvl){
    return tryGen(() => {
      const a = rand(2, 9), b = rand(2, 9);
      const x = lvl === 3 ? pick([RQ.of(1, 2), RQ.of(3, 4), RQ.of(2, 3), [rand(2, 9), 1]]) : [rand(2, 12), 1], y = lvl === 3 ? pick([RQ.of(1, 4), RQ.of(1, 2), [rand(2, 6), 1]]) : [rand(2, 12), 1];
      const srcs = lvl === 1 ? ['x + y', 'x × y', `${a} × x + y`, 'x − y'] : [`${a} × x + ${b} × y`, `x × y − ${a}`, `${a} × x − y`, `x ÷ y + ${a}`, `${a} × ( x + y )`];
      const src = pick(srcs); if (src.includes('x ÷ y') && (x[1] !== 1 || y[1] !== 1 || x[0] % y[0])) return null;
      return evalProblem(src, {x, y}, {title:'Ingredients'});
    });
  },

  /* ----- station 2: Recipe Cards (writing expressions) ----- */
  writeBasic(lvl){
    const n = rand(2, 12), v = pick(['n', 'x', 'p']);
    const T = pick([
      [`${n} more than ${v}`, EX(`${v} + ${n}`, x => x + n), [EX(`${n}${v}`, x => n * x), EX(`${v} − ${n}`, x => x - n)]],
      [`${n} less than ${v}`, EX(`${v} − ${n}`, x => x - n), [{...EX(`${n} − ${v}`, x => n - x), mis:'lessThanOrder'}, EX(`${v} + ${n}`, x => x + n)]],
      [`${v} decreased by ${n}`, EX(`${v} − ${n}`, x => x - n), [{...EX(`${n} − ${v}`, x => n - x), mis:'lessThanOrder'}, EX(`${v} ÷ ${n}`, x => x / n)]],
      [`the product of ${n} and ${v}`, EX(`${n}${v}`, x => n * x), [{...EX(`${n} + ${v}`, x => n + x), mis:'wrongOperation'}, EX(`${v} ÷ ${n}`, x => x / n)]],
      [`${v} divided by ${n}`, EX(`${v} ÷ ${n}`, x => x / n), [{...EX(`${n} ÷ ${v}`, x => n / x), mis:'lessThanOrder'}, {...EX(`${n}${v}`, x => n * x), mis:'wrongOperation'}]],
      [`${n} times ${v}`, EX(`${n}${v}`, x => n * x), [{...EX(`${v} + ${n}`, x => x + n), mis:'wrongOperation'}, EX(`${v}${SUP(n)}`, x => Math.pow(x, n))]],
      [`${v} subtracted from ${n}`, EX(`${n} − ${v}`, x => n - x), [{...EX(`${v} − ${n}`, x => x - n), mis:'lessThanOrder'}, EX(`${n} + ${v}`, x => n + x)]]]);
    const [words, right, wrongs] = T, g = pick(POTION_WORDS);
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:`Which expression means "${words}"?`, options:exprChoice(right, wrongs.map(w => ({...w, mis:w.mis || null}))),
      hint:() => /less than|subtracted from/.test(words) ? 'Careful with order: "5 less than n" starts with n and takes 5 away.' : 'Find the operation word, then put the numbers in order.'}];
    if (lvl >= 2) { const val = rand(2, 12) * (words.includes('divided') ? n : 1), out = right.f(val); if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when ${v} = ${val}`, out, {})); }
    return {title:'Recipe Cards', ctx:`"${words}"`, bubble:`The recipe card says the number of ${g[1]} is "${words}." Which expression matches?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'More, sum, added: +. Less, difference, decreased: −. Times, product: ×. Divided, quotient: ÷.',
      visual:`<div style="text-align:center; font-size:1.6rem">${g[0]} "${words}"</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },
  writeExpr(lvl){
    const a = rand(2, 9), b = rand(2, 12), v = 'n';
    const T = pick([
      [`${a} times the sum of ${v} and ${b}`, EX(`${a}(${v} + ${b})`, x => a * (x + b)), [{...EX(`${a}${v} + ${b}`, x => a * x + b), mis:'missingParens'}, EX(`${a} + ${v} + ${b}`, x => a + x + b)]],
      [`${b} less than ${a} times ${v}`, EX(`${a}${v} − ${b}`, x => a * x - b), [{...EX(`${b} − ${a}${v}`, x => b - a * x), mis:'lessThanOrder'}, {...EX(`${a}(${v} − ${b})`, x => a * (x - b)), mis:'missingParens'}]],
      [`the sum of ${v} and ${b}, divided by ${a}`, EX(`(${v} + ${b}) ÷ ${a}`, x => (x + b) / a), [{...EX(`${v} + ${b} ÷ ${a}`, x => x + b / a), mis:'missingParens'}, EX(`${a} ÷ (${v} + ${b})`, x => a / (x + b))]],
      [`${a} times the difference of ${v} and ${b}`, EX(`${a}(${v} − ${b})`, x => a * (x - b)), [{...EX(`${a}${v} − ${b}`, x => a * x - b), mis:'missingParens'}, EX(`${a}(${b} − ${v})`, x => a * (b - x))]],
      [`${b} more than the quotient of ${v} and ${a}`, EX(`${v} ÷ ${a} + ${b}`, x => x / a + b), [{...EX(`(${v} + ${b}) ÷ ${a}`, x => (x + b) / a), mis:'missingParens'}, EX(`${a} ÷ ${v} + ${b}`, x => a / x + b)]],
      [`the product of ${a} and ${v}, plus ${b}`, EX(`${a}${v} + ${b}`, x => a * x + b), [{...EX(`${a}(${v} + ${b})`, x => a * (x + b)), mis:'missingParens'}, EX(`${a} + ${b}${v}`, x => a + b * x)]]]);
    const [words, right, wrongs] = T;
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:`Which expression means "${words}"?`, options:exprChoice(right, wrongs.map(w => ({...w, mis:w.mis || null}))),
      hint:() => /sum of|difference of/.test(words) && /times/.test(words) ? '"Times the sum" means the whole sum is multiplied: use parentheses.' : 'Decide what happens first and what happens last.'}];
    if (lvl >= 2) { let val = rand(b + 1, 20); if (words.includes('quotient') || words.includes('divided')) { val = a * rand(2, 8) - (words.includes('sum') ? b : 0); if (val <= 0) val += a * 3; } const out = right.f(val);
      if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when n = ${val}`, out, {slowOK:true})); }
    return {title:'Recipe Cards', ctx:`"${words}"`, bubble:`The spell book says: "${words}". Which expression matches?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'Words like "the sum of" and "the difference of" group two things together: use parentheses.',
      visual:`<div style="text-align:center; font-size:1.5rem">📜 "${words}"</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },
  writeWord(lvl){
    const [e, n] = pick(LEMON_KIDS), g = pick(POTION_WORDS), a = rand(2, 9), b = rand(10, 40);
    const T = pick(lvl === 1 ? [
      [`${n} had ${b} ${g[1]} and found d more.`, 'd', EX(`${b} + d`, x => b + x), [{...EX(`${b}d`, x => b * x), mis:'wrongOperation'}, {...EX(`${b} − d`, x => b - x), mis:'wrongOperation'}]],
      [`Each potion uses ${a} ${g[1]}. ${n} makes p potions.`, 'p', EX(`${a}p`, x => a * x), [{...EX(`${a} + p`, x => a + x), mis:'wrongOperation'}, EX(`p ÷ ${a}`, x => x / a)]],
      [`${n} shares c ${g[1]} equally among ${a} cauldrons.`, 'c', EX(`c ÷ ${a}`, x => x / a), [{...EX(`${a} ÷ c`, x => a / x), mis:'lessThanOrder'}, {...EX(`${a}c`, x => a * x), mis:'wrongOperation'}]],
      [`${n} had ${b} ${g[1]} and used u of them.`, 'u', EX(`${b} − u`, x => b - x), [{...EX(`u − ${b}`, x => x - b), mis:'lessThanOrder'}, {...EX(`${b} + u`, x => b + x), mis:'wrongOperation'}]]] : [
      [`${n} has $${b}. Each bottle costs $${a}. ${n} buys k bottles.`, 'k', EX(`${b} − ${a}k`, x => b - a * x), [{...EX(`${a}k − ${b}`, x => a * x - b), mis:'lessThanOrder'}, {...EX(`(${b} − ${a})k`, x => (b - a) * x), mis:'missingParens'}]],
      [`A cauldron holds ${b} ${g[1]}. ${n} adds ${a} more to each of m cauldrons.`, 'm', EX(`(${b} + ${a})m`, x => (b + a) * x), [{...EX(`${b} + ${a}m`, x => b + a * x), mis:'missingParens'}, EX(`${b}m + ${a}`, x => b * x + a)]],
      [`${n} pours ${b} drops, then ${a} drops for every spell s.`, 's', EX(`${b} + ${a}s`, x => b + a * x), [{...EX(`(${b} + ${a})s`, x => (b + a) * x), mis:'missingParens'}, EX(`${b}s + ${a}`, x => b * x + a)]]]);
    const [story, v, right, wrongs] = T;
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:'Which expression matches the story?', options:exprChoice(right, wrongs), drill:{type:'story', key:'addSub'}, hint:() => 'What happens to the starting amount? What changes with the letter?'}];
    if (lvl >= 2) { let val, out; for (let t = 0; t < 20; t++) { val = rand(2, 9); out = right.f(val); if (out >= 0 && Number.isInteger(out)) break; } if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when ${v} = ${val}`, out, {slowOK:true})); }
    return {title:'Recipe Cards', ctx:story, bubble:`${story} Which expression shows how many?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'The letter stands for the number that can change.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${g[0]}</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },

  /* ----- station 3: Mixing Bowl (GCF and LCM) ----- */
  gcf(lvl){
    let a, b, G; do { G = rand(2, lvl === 1 ? 6 : lvl === 2 ? 12 : 15); const m = rand(2, lvl === 1 ? 5 : 8); let k; do { k = rand(2, lvl === 1 ? 5 : 8); } while (gcd(m, k) !== 1 || k === m); a = G * m; b = G * k; } while (a > (lvl === 3 ? 120 : 60) || b > (lvl === 3 ? 120 : 60));
    const L = a * b / G, smaller = [...Array(G).keys()].map(i => i + 1).filter(d => G % d === 0 && d < G && d > 1);
    return {title:'Mixing Bowl', ctx:`GCF(${a}, ${b})`, bubble:`What is the greatest common factor of ${a} and ${b}?`, helper:'List the factors of each number. The biggest one on both lists is the GCF.',
      visual:`<div style="text-align:center; font-size:1.8rem">🥣 ${a} and ${b}</div>`,
      steps:[numStep('GCF', 'compute', `GCF of ${a} and ${b} = ?`, G, {drill:{type:'factors', key:'pairs'}, mis:v => v === L || v === a * b ? 'gcfLcmSwap' : smaller.includes(v) ? 'notGreatest' : null, hint:() => `Factors of ${a}: ${factorsOf(a).join(', ')}.`})]};
  },
  lcm(lvl){
    let a, b; do { a = rand(2, lvl === 1 ? 10 : 12); b = rand(2, lvl === 1 ? 10 : lvl === 2 ? 12 : 18); } while (a === b || a % b === 0 && lvl > 1 || b % a === 0 && lvl > 1 || (lvl === 3 && gcd(a, b) === 1));
    const G = gcd(a, b), L = a * b / G;
    return {title:'Mixing Bowl', ctx:`LCM(${a}, ${b})`, bubble:`What is the least common multiple of ${a} and ${b}?`, helper:'Count by each number. The first number on both lists is the LCM.',
      visual:`<div style="text-align:center; font-size:1.8rem">🥣 ${a} and ${b}</div>`,
      steps:[numStep('LCM', 'compute', `LCM of ${a} and ${b} = ?`, L, {mis:v => v === G && G !== L ? 'gcfLcmSwap' : v === a * b && G > 1 ? 'notLeast' : v % a === 0 && v % b === 0 && v > L ? 'notLeast' : null,
        hint:() => `Multiples of ${Math.max(a, b)}: ${[1, 2, 3, 4, 5].map(k => k * Math.max(a, b)).join(', ')}, …`})]};
  },
  gcfLcmWord(lvl){
    const useG = Math.random() < 0.5, [e, n] = pick(LEMON_KIDS);
    let a, b, story, ans;
    if (useG) { const G = rand(2, lvl === 1 ? 6 : 12); let m, k; do { m = rand(2, 7); k = rand(2, 7); } while (gcd(m, k) !== 1 || m === k); a = G * m; b = G * k; ans = G;
      story = pick([`${n} has ${a} glow mushrooms and ${b} moon leaves. ${n} wants to make identical potion kits with no leftovers. What is the greatest number of kits?`, `There are ${a} red crystals and ${b} blue crystals to put in matching bags, with none left over. What is the greatest number of bags?`]); }
    else { do { a = rand(3, lvl === 1 ? 8 : 12); b = rand(3, lvl === 1 ? 8 : 12); } while (a === b || a % b === 0 || b % a === 0); ans = a * b / gcd(a, b);
      story = pick([`Feathers come in packs of ${a} and bottles come in packs of ${b}. ${n} wants the same number of each. What is the least number of each ${n} can buy?`, `One potion bubbles every ${a} minutes and another every ${b} minutes. They just bubbled together. In how many minutes will they bubble together again?`]); }
    const opts = choiceOf({text:useG ? 'Greatest common factor (GCF)' : 'Least common multiple (LCM)'}, [{text:useG ? 'Least common multiple (LCM)' : 'Greatest common factor (GCF)', mis:'gcfLcmSwap'}]);
    const G = gcd(a, b), L = a * b / G;
    return {title:'Mixing Bowl', ctx:`${useG ? 'GCF' : 'LCM'} ${a}, ${b}`, bubble:story, helper:'Splitting into equal groups: GCF. Things lining up again, or buying equal amounts: LCM.',
      visual:`<div style="text-align:center; font-size:1.8rem">${e} ${a} and ${b}</div>`,
      steps:[{name:'GCF or LCM?', type:'concept', kind:'choice', prompt:'Which one answers the question?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => useG ? 'You are splitting into the most equal groups.' : 'You need a number both of them reach.'},
        numStep(useG ? 'GCF' : 'LCM', 'compute', `${useG ? 'GCF' : 'LCM'} of ${a} and ${b} = ?`, ans, {mis:v => useG ? (v === L ? 'gcfLcmSwap' : null) : (v === G ? 'gcfLcmSwap' : v === a * b && G > 1 ? 'notLeast' : null)})], answerSteps:[1]};
  },

  /* ----- station 4: Cauldron (distributive property, equivalent expressions) ----- */
  factorDist(lvl){
    let a, b, G; do { G = rand(2, lvl === 1 ? 6 : 12); const m = rand(2, 9); let k; do { k = rand(2, 9); } while (gcd(m, k) !== 1 || k === m); a = G * m; b = G * k; } while (a > 100 || b > 100);
    const [p, q] = [a / G, b / G], d = [...Array(G).keys()].map(i => i + 1).find(x => x > 1 && x < G && G % x === 0);
    const right = `${G}(${p} + ${q})`, wrongs = [{text:`${G}(${a} + ${b})`, mis:'distributeWrong'}, {text:`${G}(${p} + ${b})`, mis:'distributeWrong'}];
    if (d) wrongs.push({text:`${d}(${a / d} + ${b / d})`, mis:'notGreatest'});
    return {title:'Cauldron', ctx:`${a} + ${b} = ${right}`, bubble:`Write ${a} + ${b} as the GCF times a sum.`, helper:'Find the GCF, then divide each number by it.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${a} + ${b}</div>`,
      steps:[numStep('GCF', 'compute', `GCF of ${a} and ${b} = ?`, G, {mis:v => d && G % v === 0 && v < G && v > 1 ? 'notGreatest' : null}), numStep(`${a} ÷ ${G}`, 'compute', `${a} ÷ ${G} = ?`, p, {fact:fx(G, p, true)}), numStep(`${b} ÷ ${G}`, 'compute', `${b} ÷ ${G} = ?`, q, {fact:fx(G, q, true)}),
        {name:'Factored', type:'concept', kind:'choice', prompt:`${a} + ${b} = ?`, options:choiceOf({text:right}, wrongs), hint:() => `${G} × ${p} = ${a} and ${G} × ${q} = ${b}.`}], answerSteps:[3]};
  },
  distVar(lvl){
    const a = rand(2, 9), b = rand(1, 9), c = rand(2, 5), v = pick(['x', 'n', 'y']);
    if (lvl === 3) {
      const G = rand(2, 6); let m, k; do { m = rand(2, 7); k = rand(1, 7); } while (gcd(m, k) !== 1);
      const text = `${term(G * m, v)} + ${G * k}`, right = EX(`${G}(${term(m, v)} + ${k})`, x => G * (m * x + k));
      const wrongs = [{...EX(`${G}(${term(G * m, v)} + ${G * k})`, x => G * (G * m * x + G * k)), mis:'distributeWrong'}, {...EX(`${G}(${term(m, v)} + ${G * k})`, x => G * (m * x + G * k)), mis:'distributeWrong'}, {...EX(`${term(G * m + G * k, v)}`, x => (G * m + G * k) * x), mis:'likeTermsWrong'}];
      return {title:'Cauldron', ctx:`factor ${text}`, bubble:`Factor ${text} using the greatest common factor.`, helper:'Find the GCF of the numbers, then divide each term by it.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
        steps:[numStep('GCF', 'compute', `GCF of ${G * m} and ${G * k} = ?`, G, {mis:v2 => v2 > 1 && G % v2 === 0 && v2 < G ? 'notGreatest' : null}), {name:'Factored', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => `${G} × ${term(m, v)} = ${term(G * m, v)}, and ${G} × ${k} = ${G * k}.`}], answerSteps:[1]};
    }
    const inner = lvl === 1 ? `${v} + ${b}` : `${term(c, v)} + ${b}`, cv = lvl === 1 ? 1 : c;
    const text = `${a}(${inner})`, right = EX(`${term(a * cv, v)} + ${a * b}`, x => a * (cv * x + b));
    const wrongs = [{...EX(`${term(a * cv, v)} + ${b}`, x => a * cv * x + b), mis:'distributeWrong'}, {...EX(`${term(cv, v)} + ${a * b}`, x => cv * x + a * b), mis:'distributeWrong'}, {...EX(`${term(a * cv + a * b, v)}`, x => (a * cv + a * b) * x), mis:'likeTermsWrong'}];
    return {title:'Cauldron', ctx:`expand ${text}`, bubble:`Rewrite ${text} without parentheses.`, helper:'Multiply the number outside by every term inside.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
      steps:[numStep(`${a} × ${term(cv, v)}`, 'compute', `${a} × ${term(cv, v)} = ?${v}`, a * cv, {fact:fx(a, cv)}), numStep(`${a} × ${b}`, 'compute', `${a} × ${b} = ?`, a * b, {fact:fx(a, b)}),
        {name:'Expanded', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => `${a} × ${term(cv, v)} and ${a} × ${b}.`}], answerSteps:[2]};
  },
  equivExpr(lvl){
    const a = rand(2, 7), b = rand(2, 7), c = rand(1, 9), k = rand(2, 5);
    const T = lvl === 1 ? [`${term(a, 'x')} + ${term(b, 'x')}`, EX(`${term(a + b, 'x')}`, x => (a + b) * x), [{...EX(`${term(a * b, 'x')}`, x => a * b * x), mis:'likeTermsWrong'}, {...EX(`${a + b}x²`, x => (a + b) * x * x), mis:'likeTermsWrong'}, EX(`${term(a + b + 1, 'x')}`, x => (a + b + 1) * x)]]
      : lvl === 2 ? [`${term(a, 'x')} + ${c} + ${term(b, 'x')}`, EX(`${term(a + b, 'x')} + ${c}`, x => (a + b) * x + c), [{...EX(`${term(a + b + c, 'x')}`, x => (a + b + c) * x), mis:'likeTermsWrong'}, {...EX(`${term(a * b, 'x')} + ${c}`, x => a * b * x + c), mis:'likeTermsWrong'}, EX(`${term(a + b, 'x')} + ${c + 1}`, x => (a + b) * x + c + 1)]]
      : [`${k}(x + ${c}) + ${term(a, 'x')}`, EX(`${term(k + a, 'x')} + ${k * c}`, x => (k + a) * x + k * c), [{...EX(`${term(k + a, 'x')} + ${c}`, x => (k + a) * x + c), mis:'distributeWrong'}, {...EX(`${term(a + 1, 'x')} + ${k * c}`, x => (a + 1) * x + k * c), mis:'distributeWrong'}, {...EX(`${term(k + a + k * c, 'x')}`, x => (k + a + k * c) * x), mis:'likeTermsWrong'}]];
    const [text, right, wrongs] = T;
    return {title:'Cauldron', ctx:`equiv ${text}`, bubble:`Which expression is equivalent to ${text}?`, helper:'Combine like terms: x-terms with x-terms, numbers with numbers.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
      steps:[{name:'Equivalent', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => lvl === 3 ? 'Distribute first, then combine the x-terms.' : 'Only terms with the same letter can be combined.'}]};
  }
};
const factorsOf = n => [...Array(n).keys()].map(i => i + 1).filter(d => n % d === 0);
Object.assign(GEN, POTION_GEN);

/* ===== 6th grade, Potion Lab part 2 (Khan unit 7): equations and inequalities ===== */
const balanceHTML = (left, right) => `<div class="balance"><span class="pan-l">${esc(left)}</span><span class="beam">⚖️</span><span class="pan-r">${esc(right)}</span></div>`;
/* an inequality on a number line: circle at c (filled for ≤ ≥, open for < >) and a ray in its direction */
function ineqSVG(op, c, {lo = c - 5, hi = c + 5, w = 280} = {}){
  const L = 16, R = w - 16, y = 26, step = (R - L) / (hi - lo), X = t => L + (t - lo) * step, right = op === '>' || op === '≥', closed = op === '≥' || op === '≤';
  let g = `<line x1="${L - 8}" y1="${y}" x2="${R + 8}" y2="${y}" class="nl-line"/>`;
  for (let t = lo; t <= hi; t++) { g += `<line x1="${X(t)}" y1="${y - 6}" x2="${X(t)}" y2="${y + 6}" class="nl-line"/>`; if ((t - lo) % 2 === 0 || t === c) g += `<text x="${X(t)}" y="${y + 22}" class="nl-text nl-small">${sgn(t)}</text>`; }
  g += `<line x1="${X(c)}" y1="${y}" x2="${right ? R + 6 : L - 6}" y2="${y}" class="nl-ray"/><path d="${right ? `M${R + 10} ${y} l-10 -7 v14 z` : `M${L - 10} ${y} l10 -7 v14 z`}" class="nl-ray-head"/>`;
  g += `<circle cx="${X(c)}" cy="${y}" r="7" class="${closed ? 'nl-dot' : 'nl-open'}"/>`;
  return `<svg class="num-line ineq" viewBox="0 0 ${w} 56" width="${w}" role="img" aria-label="x ${op} ${c}">${g}</svg>`;
}
const INEQ_FLIP = {'>':'<', '<':'>', '≥':'≤', '≤':'≥'}, INEQ_OPEN = {'>':'≥', '≥':'>', '<':'≤', '≤':'<'};
const ineqTrue = (x, op, c) => op === '>' ? x > c : op === '<' ? x < c : op === '≥' ? x >= c : x <= c;
/* one-step equation shapes: [text, solve, inverse words, the answer you get by doing the wrong thing] */
const EQ_FORMS = {
  add: (a, x) => [`x + ${a} = ${x + a}`, `Subtract ${a} from both sides`, `Add ${a} to both sides`, x + 2 * a],
  addL: (a, x) => [`${a} + x = ${x + a}`, `Subtract ${a} from both sides`, `Add ${a} to both sides`, x + 2 * a],
  sub: (a, x) => [`x ${MINUS} ${a} = ${x - a}`, `Add ${a} to both sides`, `Subtract ${a} from both sides`, x - 2 * a],
  mul: (a, x) => [`${a}x = ${a * x}`, `Divide both sides by ${a}`, `Multiply both sides by ${a}`, a * a * x],
  div: (a, x) => [`x ÷ ${a} = ${x / a}`, `Multiply both sides by ${a}`, `Divide both sides by ${a}`, x / (a * a)]
};
const POTION2_GEN = {
  /* ----- station 5: Balance Scale (one-step equations) ----- */
  testSol(lvl){
    const a = rand(2, 9), b = rand(1, 15), x = rand(1, 10), kind = pick(lvl === 1 ? ['add', 'mul'] : ['lin', 'lin', 'mul', 'sub']);
    const [text, f] = kind === 'add' ? [`x + ${b} = ${x + b}`, v => v + b] : kind === 'mul' ? [`${a}x = ${a * x}`, v => a * v] : kind === 'sub' ? [`${a}x ${MINUS} ${b} = ${a * x - b}`, v => a * v - b] : [`${a}x + ${b} = ${a * x + b}`, v => a * v + b];
    if (kind === 'sub' && a * x - b < 0) return POTION2_GEN.testSol(lvl);
    const target = Number(text.split(' = ')[1]);
    if (lvl === 1) {
      const tryV = Math.random() < 0.5 ? x : x + pick([-1, 1, 2]) || x + 1, out = f(tryV), yes = out === target;
      const lhs = text.split(' = ')[0].replace(/(\d+)x/, `$1(${tryV})`).replace(/^x/, String(tryV));
      return {title:'Balance Scale', ctx:`${text}, x = ${tryV}`, bubble:`Is x = ${tryV} a solution of ${text}?`, helper:'Put the number in for x. If both sides are equal, it is a solution.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
        steps:[numStep('Put it in', 'compute', `${lhs} = ?`, out, {hint:() => `Replace x with ${tryV}.`}),
          {name:'Solution?', type:'concept', kind:'choice', prompt:`Is x = ${tryV} a solution?`, options:choiceOf({text:yes ? 'Yes' : 'No'}, [{text:yes ? 'No' : 'Yes'}]), hint:() => `Does ${out} equal ${target}?`}], answerSteps:[1]};
    }
    const cands = shuffle([...new Set([x, x + 1, x - 1, x + 2, target, Math.max(0, x - 2)])].filter(v => v >= 0 && (v === x || f(v) !== target))).slice(0, 3);
    if (!cands.includes(x)) cands[0] = x;
    const opts = shuffle(cands).map(v => ({html:`x = ${v}`, text:`x = ${v}`, ok:v === x, mis:v === target && v !== x ? 'solutionIsTotal' : null}));
    return {title:'Balance Scale', ctx:`${text}: which x`, bubble:`Which value of x makes ${text} true?`, helper:'Try each value in the equation.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
      steps:[{name:'Which value', type:'concept', kind:'choice', prompt:`Which one is a solution of ${text}?`, options:opts, hint:() => `Put each value in for x and check if the left side is ${target}.`}]};
  },
  oneStepAdd(lvl){
    if (lvl === 3) {
      const a = rand(11, 99) / 10, x = rand(11, 99) / 10, sub = Math.random() < 0.5, A = sgnD(a), rhs = sub ? x - a : x + a;
      if (rhs <= 0) return POTION2_GEN.oneStepAdd(lvl);
      const text = sub ? `x ${MINUS} ${A} = ${sgnD(rhs)}` : `x + ${A} = ${sgnD(rhs)}`, xi = Math.round(x * 10);
      return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:'Do the opposite operation to both sides.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
        steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:sub ? `Add ${A}` : `Subtract ${A}`}, [{text:sub ? `Subtract ${A}` : `Add ${A}`, mis:'inverseWrong'}]), hint:() => sub ? `x had ${A} taken away. Add it back.` : `${A} was added to x. Take it away.`},
          {name:'Solve', type:'compute', kind:'num', prompt:`x = ${sgnD(rhs)} ${sub ? '+' : MINUS} ${A} = ?`, answer:sgnD(x), eq:XD.eq(xi, 1), decimal:true, mis:v => XD.eq(xi, 1)(v) ? null : Math.abs(v - (sub ? rhs - a : rhs + a)) < 1e-9 ? 'inverseWrong' : null}], answerSteps:[1]};
    }
    const form = pick(['add', 'addL', 'sub']), a = rand(2, lvl === 1 ? 15 : 60), x = rand(lvl === 1 ? 1 : 10, lvl === 1 ? 20 : 90);
    if (form === 'sub' && x - a < 0) return POTION2_GEN.oneStepAdd(lvl);
    const [text, right, wrong, wrongX] = EQ_FORMS[form](a, x), rhs = text.split(' = ')[1];
    return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:'Keep the scale balanced: whatever you do to one side, do to the other.', visual:balanceHTML(text.split(' = ')[0], rhs),
      steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:right}, [{text:wrong, mis:'inverseWrong'}]), hint:() => form === 'sub' ? `x had ${a} taken away. Add it back.` : `${a} was added to x. Take it away.`},
        numStep('Solve', 'compute', `x = ${rhs} ${form === 'sub' ? '+' : MINUS} ${a} = ?`, x, {mis:v => v === wrongX ? 'inverseWrong' : null})], answerSteps:[1]};
  },
  oneStepMult(lvl){
    if (lvl === 3 && Math.random() < 0.6) {
      const [p, q] = pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]]), k = rand(2, 9), x = q * k, rhs = p * k;
      const text = `(${p}/${q})x = ${rhs}`;
      return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:`Undo multiplying by ${p}/${q}: divide by ${p}/${q}, which is the same as multiplying by ${q}/${p}.`, visual:balanceHTML(`${p}/${q} × x`, String(rhs)),
        steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:`Multiply by ${q}/${p}`}, [{text:`Multiply by ${p}/${q}`, mis:'inverseWrong'}, {text:`Subtract ${p}/${q}`, mis:'inverseWrong'}]), drill:{type:'reciprocal', key:'flip'}, hint:() => `${q}/${p} is the reciprocal of ${p}/${q}.`},
          numStep('Solve', 'compute', `x = ${rhs} × ${q}/${p} = ?`, x, {mis:v => Math.abs(v - rhs * p / q) < 1e-9 ? 'inverseWrong' : null, hint:() => `${rhs} ÷ ${p} × ${q}.`})], answerSteps:[1]};
    }
    const form = pick(['mul', 'mul', 'div']), a = rand(2, lvl === 1 ? 9 : 12), x = form === 'div' ? a * rand(1, lvl === 1 ? 9 : 12) : rand(1, lvl === 1 ? 10 : 25);
    const [text, right, wrong, wrongX] = EQ_FORMS[form](a, x), rhs = text.split(' = ')[1];
    return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:form === 'mul' ? `${a}x means ${a} times x. Divide both sides by ${a}.` : `x was divided by ${a}. Multiply both sides by ${a}.`, visual:balanceHTML(text.split(' = ')[0], rhs),
      steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:right}, [{text:wrong, mis:'inverseWrong'}, {text:form === 'mul' ? `Subtract ${a} from both sides` : `Add ${a} to both sides`, mis:'inverseWrong'}]), hint:() => 'Do the opposite operation.'},
        numStep('Solve', 'compute', `x = ${rhs} ${form === 'mul' ? '÷' : '×'} ${a} = ?`, x, {fact:form === 'mul' ? fx(a, x, true) : fx(a, x / a), mis:v => v === wrongX ? 'inverseWrong' : form === 'mul' && v === Number(rhs) - a ? 'inverseWrong' : null})], answerSteps:[1]};
  },
  eqModel(lvl){
    const [e, n] = pick(LEMON_KIDS), g = pick(POTION_WORDS), a = rand(2, 9), x = rand(2, 12);
    const T = pick([
      [`${n} had some ${g[1]}. ${n} made ${a + 3} more and now has ${x + a + 3}. How many did ${n} have at first?`, `x + ${a + 3} = ${x + a + 3}`, [`x ${MINUS} ${a + 3} = ${x + a + 3}`, `${a + 3}x = ${x + a + 3}`], x],
      [`Each crate holds ${a} bottles. ${n} filled some crates with ${a * x} bottles. How many crates?`, `${a}x = ${a * x}`, [`x + ${a} = ${a * x}`, `x ÷ ${a} = ${a * x}`], x],
      [`${n} gave away ${a} ${g[1]} and has ${x} left. How many did ${n} start with?`, `x ${MINUS} ${a} = ${x}`, [`x + ${a} = ${x}`, `${a}x = ${x}`], x + a],
      [`${n} shared some ${g[1]} equally into ${a} bags. Each bag got ${x}. How many were there?`, `x ÷ ${a} = ${x}`, [`${a}x = ${x}`, `x ${MINUS} ${a} = ${x}`], a * x]]);
    const [story, right, wrongs, ans] = T;
    return {title:'Balance Scale', ctx:right, bubble:story, helper:'Let x be the unknown amount. What happened to it?', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${g[0]} x = ?</div>`,
      steps:[{name:'Pick the equation', type:'concept', kind:'choice', prompt:'Which equation matches the story?', options:choiceOf({text:right}, wrongs.map(w => ({text:w, mis:'wrongOperation'}))), drill:{type:'story', key:'addSub'}, hint:() => 'Start with x and do what the story does to it.'},
        numStep('Solve', 'compute', `${right}, x = ?`, ans, {slowOK:true, mis:v => v !== ans && (v === Number(right.split(' = ')[1]) - a || v === Number(right.split(' = ')[1]) + a) && lvl > 0 ? 'inverseWrong' : null})], answerSteps:[1]};
  },

  /* ----- station 6: Potion Limits (inequalities, dependent and independent variables) ----- */
  testIneq(lvl){
    const op = pick(lvl === 1 ? ['>', '<'] : ['>', '<', '≥', '≤']), c = lvl === 3 ? rand(-6, 6) : rand(2, 15), side = op === '>' || op === '≥' ? 1 : -1, strict = op === '>' || op === '<';
    const visual = `<div style="text-align:center; font-size:2rem">🚦 x ${op} ${sgn(c)}</div>`, helper = strict ? 'Without the line under the sign, the number itself does not count.' : 'The line under the sign means the number itself counts too.';
    if (Math.random() < 0.5) {                                             // is this one value a solution?
      const v = c + pick([-3, -1, 0, 0, 1, 3]), yes = ineqTrue(v, op, c);
      return {title:'Potion Limits', ctx:`x ${op} ${sgn(c)}, x = ${sgn(v)}`, bubble:`Is x = ${sgn(v)} a solution of x ${op} ${sgn(c)}?`, helper, visual,
        steps:[{name:'True?', type:'concept', kind:'choice', prompt:`Is ${sgn(v)} ${op} ${sgn(c)} true?`, options:choiceOf({text:yes ? 'Yes' : 'No'}, [{text:yes ? 'No' : 'Yes', mis:v === c ? 'boundaryWrong' : null}]),
          hint:() => `Where is ${sgn(v)} compared with ${sgn(c)} on a number line?`}]};
    }
    const right = !strict && Math.random() < 0.4 ? c : c + side * rand(1, 3);
    const wrongs = [{v:c - side * rand(1, 3), mis:'ineqDirection'}, strict ? {v:c, mis:'boundaryWrong'} : {v:c - side * rand(4, 5), mis:'ineqDirection'}];
    const opts = choiceOf({text:`x = ${sgn(right)}`}, wrongs.map(w => ({text:`x = ${sgn(w.v)}`, mis:w.mis})));
    return {title:'Potion Limits', ctx:`x ${op} ${sgn(c)}: pick`, bubble:`The potion works when x ${op} ${sgn(c)}. Which value makes it true?`, helper, visual,
      steps:[{name:'Which value', type:'concept', kind:'choice', prompt:`Which makes x ${op} ${sgn(c)} true?`, options:opts, hint:() => `Is it ${side > 0 ? 'more' : 'less'} than ${sgn(c)}${strict ? '' : ', or equal'}?`}]};
  },
  plotIneq(lvl){
    const op = pick(['>', '<', '≥', '≤']), c = lvl === 1 ? rand(1, 8) : rand(-6, 6);
    const words = {'>':'more than', '<':'less than', '≥':'at least', '≤':'at most'}[op];
    const ask = lvl === 3 ? `The potion must be kept at ${words} ${sgn(c)} degrees. Which graph shows the temperatures that work?` : `Which graph shows x ${op} ${sgn(c)}?`;
    const opts = shuffle([[op, null], [INEQ_FLIP[op], 'ineqDirection'], [INEQ_OPEN[op], 'circleWrong']]).map(([o, mis]) => ({html:ineqSVG(o, c), text:`x ${o} ${sgn(c)}`, ok:o === op, mis}));
    return {title:'Potion Limits', ctx:`graph x ${op} ${sgn(c)}`, bubble:ask, helper:'Open circle: the number is not included (< or >). Filled circle: it is included (≤ or ≥). The arrow points to the numbers that work.',
      visual:`<div style="text-align:center; font-size:2rem">🚦 ${lvl === 3 ? words + ' ' + sgn(c) : `x ${op} ${sgn(c)}`}</div>`,
      steps:[{name:'Pick the graph', type:'concept', kind:'choice', prompt:lvl === 3 ? `Which graph shows "${words} ${sgn(c)}"?` : `Which graph shows x ${op} ${sgn(c)}?`, options:opts,
        hint:() => `${op === '>' || op === '≥' ? 'Greater: the arrow points right.' : 'Less: the arrow points left.'} ${op.includes('≥') || op.includes('≤') ? 'The circle is filled.' : 'The circle is open.'}`}]};
  },
  depIndep(lvl){
    const [e, n] = pick(LEMON_KIDS), k = rand(2, 9), b = rand(2, 12);
    const S = pick([
      {story:`${n} earns $${k} for every potion sold.`, ind:'the number of potions sold', dep:'the money earned', f:x => k * x, rule:`y = ${k}x`, wrongRule:[`y = x + ${k}`, `x = ${k}y`], xs:'potions', ys:'dollars'},
      {story:`A cauldron heats up ${k} degrees every minute, starting at ${b} degrees.`, ind:'the minutes', dep:'the temperature', f:x => k * x + b, rule:`y = ${k}x + ${b}`, wrongRule:[`y = ${b}x + ${k}`, `y = ${k + b}x`], xs:'minutes', ys:'degrees'},
      {story:`Each bag holds ${k} crystals.`, ind:'the number of bags', dep:'the number of crystals', f:x => k * x, rule:`y = ${k}x`, wrongRule:[`y = x + ${k}`, `y = x ÷ ${k}`], xs:'bags', ys:'crystals'},
      {story:`${n} is ${b} years older than a little cousin.`, ind:"the cousin's age", dep:`${n}'s age`, f:x => x + b, rule:`y = x + ${b}`, wrongRule:[`y = ${b}x`, `x = y + ${b}`], xs:'cousin', ys:n}]);
    if (lvl === 1) return {title:'Potion Limits', ctx:`${S.story} dep?`, bubble:`${S.story} Which is the dependent variable?`, helper:'The dependent variable depends on the other one. It is what you find out.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} 🧪</div>`,
      steps:[{name:'Dependent', type:'concept', kind:'choice', prompt:'Which one depends on the other?', options:choiceOf({text:S.dep}, [{text:S.ind, mis:'depIndepSwap'}]), hint:() => `Does ${S.dep} change because of ${S.ind}, or the other way around?`}]};
    const xs = [1, 2, 3, 4, 5].map(i => i + (lvl === 3 ? rand(0, 1) * 0 : 0)), miss = rand(2, 4);
    const table = `<table class="xy-table"><tr><th>${esc(S.xs)} (x)</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>${esc(S.ys)} (y)</th>${xs.map((x, i) => `<td>${lvl === 2 && i === miss ? '?' : S.f(x)}</td>`).join('')}</tr></table>`;
    if (lvl === 2) return {title:'Potion Limits', ctx:`${S.rule} table`, bubble:`${S.story} Fill in the missing number in the table.`, helper:'Find the pattern from x to y, then use it.', visual:table,
      steps:[numStep('Missing y', 'compute', `When x = ${xs[miss]}, y = ?`, S.f(xs[miss]), {mis:v => v === S.f(xs[miss - 1]) + 1 ? 'patternWrongRule' : null, hint:() => `When x = 1, y = ${S.f(1)}. When x = 2, y = ${S.f(2)}.`})]};
    return {title:'Potion Limits', ctx:`${S.rule} rule`, bubble:`${S.story} Which equation matches the table?`, helper:'Check the rule with every column of the table.', visual:table,
      steps:[{name:'Independent', type:'concept', kind:'choice', prompt:'Which is the independent variable (x)?', options:choiceOf({text:S.ind}, [{text:S.dep, mis:'depIndepSwap'}]), hint:() => 'The independent variable is the one you choose or that changes on its own.'},
        {name:'The rule', type:'concept', kind:'choice', prompt:'Which equation matches?', options:choiceOf({text:S.rule}, S.wrongRule.map(t => ({text:t, mis:t.startsWith('x') ? 'depIndepSwap' : 'patternWrongRule'}))), hint:() => `Try x = 1: y should be ${S.f(1)}. Try x = 2: y should be ${S.f(2)}.`}], answerSteps:[1]};
  }
};
Object.assign(GEN, POTION2_GEN);

/* ===== 6th grade, Pet Houses part 1 (Khan units 8 and 9): area of plane figures, the coordinate plane ===== */
/* whole-number side lengths with a whole slant: [run, rise, slant] */
const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 9, 15]];
const half = n => n % 2 ? `${Math.floor(n / 2)}.5` : String(n / 2);
/* a typed area answer that may end in .5 */
const halfAreaStep = (name, prompt, v2, extra = {}) => ({name, type:'compute', kind:'num', prompt, answer:half(v2), eq:v => typeof v === 'number' && Math.abs(v * 2 - v2) < 1e-9, decimal:v2 % 2 === 1, slowOK:true, ...extra,
  ...(extra.mis ? {mis:v => typeof v === 'number' && Math.abs(v * 2 - v2) < 1e-9 ? null : extra.mis(v)} : {})});
/* draw shapes given in units; fits them into 280 × 170 with labels */
function shapeSVG(polys, labels = [], dashes = []){
  const pts = polys.flat(), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const s = Math.min(240 / (maxX - minX || 1), 140 / (maxY - minY || 1)), P = ([x, y]) => [20 + (x - minX) * s, 20 + (maxY - y) * s];
  let g = polys.map((poly, i) => `<polygon points="${poly.map(P).map(p => p.join(',')).join(' ')}" class="shape-fill${i ? ' shape-2' : ''}"/>`).join('');
  g += dashes.map(([a, b]) => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="shape-dash"/>`; }).join('');
  g += labels.map(([pt, t, anchor = 'middle']) => { const [x, y] = P(pt); return `<text x="${x}" y="${y}" class="shape-lbl" text-anchor="${anchor}">${t}</text>`; }).join('');
  const W = 40 + (maxX - minX) * s, H = 40 + (maxY - minY) * s;
  return `<svg class="shape-pic" viewBox="-10 -6 ${W + 20} ${H + 12}" width="${W + 20}" role="img" aria-label="shape with its measurements">${g}</svg>`;
}
/* the coordinate plane from -R to R with named points and an optional polygon */
function planeSVG(R, pts = [], poly = null){
  const w = 280, c = w / 2, s = (w - 30) / (2 * R), P = (x, y) => [c + x * s, c - y * s];
  let g = '';
  for (let i = -R; i <= R; i++) { const [x] = P(i, 0), [, y] = P(0, i); g += `<line x1="${x}" y1="${c - R * s}" x2="${x}" y2="${c + R * s}" class="grid-line"/><line x1="${c - R * s}" y1="${y}" x2="${c + R * s}" y2="${y}" class="grid-line"/>`; }
  g += `<line x1="${c - R * s - 6}" y1="${c}" x2="${c + R * s + 6}" y2="${c}" class="axis-line"/><line x1="${c}" y1="${c - R * s - 6}" x2="${c}" y2="${c + R * s + 6}" class="axis-line"/>`;
  const step = R > 6 ? 2 : 1;
  for (let i = -R; i <= R; i += step) if (i) { const [x] = P(i, 0), [, y] = P(0, i); g += `<text x="${x}" y="${c + 14}" class="grid-num">${sgn(i)}</text><text x="${c - 5}" y="${y + 4}" class="grid-num" text-anchor="end">${sgn(i)}</text>`; }
  g += `<text x="${c + R * s + 4}" y="${c - 6}" class="grid-num">x</text><text x="${c + 6}" y="${c - R * s}" class="grid-num">y</text>`;
  if (poly) g += `<polygon points="${poly.map(([x, y]) => P(x, y).join(',')).join(' ')}" class="plane-poly"/>`;
  pts.forEach(p => { const [x, y] = P(p.x, p.y); g += `<circle cx="${x}" cy="${y}" r="6" class="nl-dot"/>${p.name ? `<text x="${x + 8}" y="${y - 8}" class="grid-name">${p.name}</text>` : ''}`; });
  return `<svg class="plane-pic" viewBox="0 0 ${w} ${w}" width="${w}" role="img" aria-label="coordinate plane">${g}</svg>`;
}
const pt = (x, y) => `(${sgn(x)}, ${sgn(y)})`;
const quadOf = (x, y) => x === 0 || y === 0 ? (x === 0 && y === 0 ? 'the origin' : x === 0 ? 'the y-axis' : 'the x-axis') : x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : (y > 0 ? 'Quadrant II' : 'Quadrant III');
const nz = r => { let v; do { v = rand(-r, r); } while (v === 0); return v; };
const HOUSES_GEN = {
  /* ----- station 1: Floor Plans (parallelograms and triangles) ----- */
  areaPara(lvl){
    const b = rand(4, lvl === 1 ? 10 : 15), [run, h, sl] = lvl === 1 ? [rand(1, 3), rand(2, 8), null] : pick(TRIPLES), A = b * h;
    const poly = [[0, 0], [b, 0], [b + run, h], [run, h]];
    const labels = [[[b / 2, -0.9], `${b}`], [[run + 0.25, h / 2], `${h}`, 'start']]; if (sl) labels.push([[run / 2 - 0.6, h / 2], `${sl}`, 'end']);
    return {title:'Floor Plans', ctx:`parallelogram b ${b} h ${h}`, bubble:`The dog run is a parallelogram. Its base is ${b} m${sl ? `, its slanted side is ${sl} m,` : ''} and its height is ${h} m. What is its area?`, helper:'Area of a parallelogram = base × height. The height is the straight-up distance, not the slanted side.',
      visual:shapeSVG([poly], labels, [[[run, 0], [run, h]]]),
      steps:[halfAreaStep('Area', `${b} × ${h} = ? square meters`, 2 * A, {fact:fx(b, h), mis:v => sl && v === b * sl ? 'slantHeight' : v === 2 * (b + (sl || h)) ? 'areaPerimeterSwap' : Math.abs(v * 2 - A) < 1e-9 ? 'halfWrong' : null})]};
  },
  areaRightTri(lvl){
    const [a, b, c] = lvl === 1 ? [rand(2, 10), rand(2, 10), null] : pick(TRIPLES), A2 = a * b;
    const labels = [[[a / 2, -0.9], `${a}`], [[-0.4, b / 2], `${b}`, 'end']]; if (c) labels.push([[a / 2 + 0.5, b / 2 + 0.5], `${c}`, 'start']);
    return {title:'Floor Plans', ctx:`right triangle ${a} × ${b}`, bubble:`A corner of the cat's bed is a right triangle with legs ${a} cm and ${b} cm${c ? ` (the long side is ${c} cm)` : ''}. What is its area?`, helper:'A right triangle is half of a rectangle: ½ × base × height.',
      visual:shapeSVG([[[0, 0], [a, 0], [0, b]]], labels),
      steps:[numStep('Rectangle', 'compute', `${a} × ${b} = ?`, A2, {fact:fx(a, b), mis:v => c && (v === a * c || v === b * c) ? 'slantHeight' : null}),
        halfAreaStep('Half of it', `${A2} ÷ 2 = ? square cm`, A2, {mis:v => v === A2 ? 'halfWrong' : null, hint:() => 'The triangle is half the rectangle.'})], answerSteps:[1]};
  },
  areaTri(lvl){
    const b = rand(4, 14), h = rand(2, 10), off = lvl === 1 ? rand(1, b - 1) : lvl === 2 ? rand(1, b - 1) : pick([-rand(1, 3), b + rand(1, 3)]), A2 = b * h;
    const poly = [[0, 0], [b, 0], [off, h]], dash = [[off, 0], [off, h]];
    const extra = off < 0 || off > b ? [[[off, 0], [off < 0 ? 0 : b, 0]]] : [];
    return {title:'Floor Plans', ctx:`triangle b ${b} h ${h}`, bubble:`The roof window is a triangle with base ${b} in. and height ${h} in.${off < 0 || off > b ? ' The height is drawn outside the triangle.' : ''} What is its area?`, helper:'Area of a triangle = ½ × base × height.',
      visual:shapeSVG([poly], [[[b / 2, -0.9], `${b}`], [[off + 0.3, h / 2], `${h}`, 'start']], [dash, ...extra]),
      steps:[halfAreaStep('Area', `½ × ${b} × ${h} = ? square inches`, A2, {mis:v => v === A2 ? 'halfWrong' : null, hint:() => `${b} × ${h} = ${A2}, then half of that.`})]};
  },

  /* ----- station 2: Rooms (composite shapes) ----- */
  areaComposite(lvl){
    const W = rand(6, 14), H = rand(5, 12), w = rand(2, W - 2), h = rand(2, H - 2), big = W * H, cut = w * h;
    if (lvl === 1) {
      const poly = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]];
      return {title:'Rooms', ctx:`L ${W}×${H} minus ${w}×${h}`, bubble:`The pet house floor is L-shaped. Split it into two rectangles to find its area.`, helper:'Split the shape into rectangles, find each area, then add.',
        visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[W - w / 2, H - h + 0.4], `${w}`], [[W + 0.3, (H - h) / 2], `${H - h}`, 'start']], [[[W - w, 0], [W - w, H - h]]]),
        steps:[numStep('Left part', 'compute', `${W - w} × ${H} = ?`, (W - w) * H, {fact:fx(W - w, H)}), numStep('Right part', 'compute', `${w} × ${H - h} = ?`, w * (H - h), {fact:fx(w, H - h)}),
          numStep('Total', 'compute', `${(W - w) * H} + ${w * (H - h)} = ? square feet`, big - cut, {mis:v => v === big ? 'compositeWrong' : v === big + cut ? 'compositeWrong' : null})], answerSteps:[2]};
    }
    const cx = rand(1, W - w - 1), poly = [[0, 0], [W, 0], [W, H], [cx + w, H], [cx + w, H - h], [cx, H - h], [cx, H], [0, H]];
    return {title:'Rooms', ctx:`${W}×${H} minus notch ${w}×${h}`, bubble:`The play pen is a ${W} ft by ${H} ft rectangle with a ${w} ft by ${h} ft notch cut out of the top. What is its area?`, helper:'Find the area of the whole rectangle, then subtract the piece that is missing.',
      visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[cx + w / 2, H - h - 0.9], `${w}`], [[cx + w + 0.3, H - h / 2], `${h}`, 'start']]),
      steps:[numStep('Whole rectangle', 'compute', `${W} × ${H} = ?`, big, {fact:fx(W, H)}), numStep('Missing piece', 'compute', `${w} × ${h} = ?`, cut, {fact:fx(w, h)}),
        numStep('Area', 'compute', `${big} − ${cut} = ? square feet`, big - cut, {mis:v => v === big + cut ? 'compositeWrong' : v === big ? 'compositeWrong' : null})], answerSteps:[2]};
  },
  decompTri(lvl){
    const W = rand(4, 12), H = rand(3, 9), r = rand(2, 6), rect = W * H, tri2 = W * r;
    if (lvl < 3) {
      const poly = [[0, 0], [W, 0], [W, H], [W / 2, H + r], [0, H]];
      return {title:'Rooms', ctx:`house ${W}×${H} roof ${r}`, bubble:`The dog house front is a ${W} ft by ${H} ft rectangle with a triangle roof ${r} ft tall. What is the area of the whole front?`, helper:'Rectangle + triangle. The triangle is ½ × base × height.',
        visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[W / 2 + 0.3, H + r / 2], `${r}`, 'start']], [[[0, H], [W, H]], [[W / 2, H], [W / 2, H + r]]]),
        steps:[numStep('Rectangle', 'compute', `${W} × ${H} = ?`, rect, {fact:fx(W, H)}), halfAreaStep('Roof triangle', `½ × ${W} × ${r} = ?`, tri2, {mis:v => v === tri2 ? 'halfWrong' : null}),
          halfAreaStep('Total', `${rect} + ${half(tri2)} = ? square feet`, 2 * rect + tri2, {mis:v => Math.abs(v - (rect + tri2)) < 1e-9 ? 'halfWrong' : null})], answerSteps:[2]};
    }
    const t = rand(1, 4), top = rand(3, 9), bot = top + 2 * t, h = rand(3, 9);          // trapezoid = rectangle + two right triangles
    const poly = [[0, 0], [bot, 0], [bot - t, h], [t, h]];
    return {title:'Rooms', ctx:`trapezoid ${top}/${bot} h ${h}`, bubble:`The ramp side is a trapezoid: ${top} ft across the top, ${bot} ft across the bottom, and ${h} ft tall. Split it into a rectangle and two triangles.`, helper:'Each triangle has a base of (bottom − top) ÷ 2.',
      visual:shapeSVG([poly], [[[bot / 2, -0.9], `${bot}`], [[bot / 2, h + 0.4], `${top}`], [[t + 0.3, h / 2], `${h}`, 'start']], [[[t, 0], [t, h]], [[bot - t, 0], [bot - t, h]]]),
      steps:[numStep('Rectangle', 'compute', `${top} × ${h} = ?`, top * h, {fact:fx(top, h)}), halfAreaStep('Both triangles', `2 × ½ × ${t} × ${h} = ?`, 2 * t * h, {mis:v => v === 2 * t * h ? 'halfWrong' : null}),
        numStep('Total', 'compute', `${top * h} + ${t * h} = ? square feet`, top * h + t * h, {mis:v => v === top * h + 2 * t * h ? 'halfWrong' : null})], answerSteps:[2]};
  },

  /* ----- station 3: Yard Map (points and quadrants) ----- */
  pointsId(lvl){
    const R = lvl === 1 ? 6 : 8; let x, y; do { x = lvl === 1 ? rand(1, R) * pick([1, -1]) : nz(R); y = nz(R); } while (Math.abs(x) === Math.abs(y));
    const opts = choiceOf({text:pt(x, y)}, [{text:pt(y, x), mis:'coordSwap'}, {text:pt(-x, y), mis:'signWrong'}, {text:pt(x, -y), mis:'signWrong'}]);
    return {title:'Yard Map', ctx:`point ${pt(x, y)}`, bubble:'Where is the bone buried? Give the coordinates of point A.', helper:'(x, y): go left or right first (x), then up or down (y).', visual:planeSVG(R, [{x, y, name:'A'}]),
      steps:[{name:'Coordinates', type:'concept', kind:'choice', prompt:'What are the coordinates of A?', options:opts, hint:() => `Start at the origin. How far ${x > 0 ? 'right' : 'left'}? Then how far ${y > 0 ? 'up' : 'down'}?`}]};
  },
  graphQuad(lvl){
    let x = nz(9), y = nz(9); if (lvl === 3 && Math.random() < 0.3) { if (Math.random() < 0.5) x = 0; else y = 0; }
    const right = quadOf(x, y), all = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', ...(lvl === 3 ? ['the x-axis', 'the y-axis'] : [])];
    const swapQ = quadOf(y, x), flipQ = quadOf(-x, -y);
    const opts = choiceOf({text:right}, shuffle(all.filter(q => q !== right)).slice(0, 3).map(q => ({text:q, mis:q === swapQ ? 'coordSwap' : q === flipQ || q === quadOf(-x, y) || q === quadOf(x, -y) ? 'quadrantWrong' : null})));
    return {title:'Yard Map', ctx:`${pt(x, y)} in`, bubble:`The cat's ball is at ${pt(x, y)}. Where is it?`, helper:'Quadrant I is top right (+, +). Go counterclockwise: II (−, +), III (−, −), IV (+, −). A 0 means the point is on an axis.',
      visual:lvl === 1 ? planeSVG(9, [{x, y, name:'●'}]) : `<div style="text-align:center; font-size:2rem">📍 ${pt(x, y)}</div>`,
      steps:[{name:'Where', type:'concept', kind:'choice', prompt:`Where is ${pt(x, y)}?`, options:opts, hint:() => `x is ${x > 0 ? 'positive' : x < 0 ? 'negative' : '0'} and y is ${y > 0 ? 'positive' : y < 0 ? 'negative' : '0'}.`}]};
  },
  reflect(lvl){
    let x = nz(8), y = nz(8); while (Math.abs(x) === Math.abs(y)) y = nz(8);
    const axis = lvl === 3 ? pick(['x-axis', 'y-axis', 'both axes']) : pick(['x-axis', 'y-axis']);
    const ans = axis === 'x-axis' ? [x, -y] : axis === 'y-axis' ? [-x, y] : [-x, -y];
    const wrongs = [[axis === 'x-axis' ? -x : x, axis === 'x-axis' ? y : -y, 'reflectAxisWrong'], [-x, -y, 'reflectAxisWrong'], [x, -y, 'reflectAxisWrong'], [-x, y, 'reflectAxisWrong'], [y, x, 'coordSwap']];
    const opts = choiceOf({text:pt(...ans)}, wrongs.map(([a, b, m]) => ({text:pt(a, b), mis:m})).filter((w, i, arr) => w.text !== pt(x, y) && w.text !== pt(...ans) && arr.findIndex(u => u.text === w.text) === i).slice(0, 3));
    const across = axis === 'both axes' ? 'both axes' : `the ${axis}`;
    return {title:'Yard Map', ctx:`${pt(x, y)} over ${axis}`, bubble:`Reflect the doghouse at ${pt(x, y)} across ${across}. Where does it land?`, helper:'Across the x-axis, y changes sign. Across the y-axis, x changes sign.',
      visual:planeSVG(8, [{x, y, name:'D'}]),
      steps:[{name:'Reflection', type:'concept', kind:'choice', prompt:`${pt(x, y)} reflected across ${across} = ?`, options:opts, hint:() => axis === 'x-axis' ? 'Flip up or down: same x, opposite y.' : axis === 'y-axis' ? 'Flip left or right: opposite x, same y.' : 'Both numbers change sign.'}]};
  },

  /* ----- station 4: Fence Lines (distance, polygons, word problems) ----- */
  distPoints(lvl){
    const horiz = Math.random() < 0.5, k = nz(7); let a, b; do { a = lvl === 1 ? rand(0, 8) : rand(-8, 8); b = rand(-8, 8); } while (a === b || (lvl >= 2 && Math.sign(a) === Math.sign(b) && Math.random() < 0.7) || (lvl === 1 && b < 0 && a < 0));
    const P1 = horiz ? [a, k] : [k, a], P2 = horiz ? [b, k] : [k, b], d = Math.abs(a - b), fake = Math.abs(Math.abs(a) - Math.abs(b));
    return {title:'Fence Lines', ctx:`${pt(...P1)} to ${pt(...P2)}`, bubble:`How long is a fence from ${pt(...P1)} to ${pt(...P2)}? Each unit is 1 meter.`, helper:'Same ' + (horiz ? 'y' : 'x') + ', so count along the other coordinate. On opposite sides of 0, add the distances from 0.',
      visual:planeSVG(8, [{x:P1[0], y:P1[1], name:'P'}, {x:P2[0], y:P2[1], name:'Q'}]),
      steps:[numStep('Distance', 'compute', `Distance from ${pt(...P1)} to ${pt(...P2)} = ?`, d, {mis:v => v === fake && fake !== d ? 'negDistance' : null, hint:() => Math.sign(a) !== Math.sign(b) && a && b ? `${Math.abs(a)} to 0, then ${Math.abs(b)} more.` : `Subtract: ${Math.max(a, b)} − ${Math.min(a, b)}.`})]};
  },
  areaCoord(lvl){
    let x1, x2, y1, y2; do { x1 = rand(-7, 5); x2 = rand(x1 + 2, 7); y1 = rand(-7, 5); y2 = rand(y1 + 2, 7); } while (lvl >= 2 && !(x1 < 0 && x2 > 0 || y1 < 0 && y2 > 0));
    const w = x2 - x1, h = y2 - y1, ask = lvl === 3 ? 'perimeter' : 'area', corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    return {title:'Fence Lines', ctx:`rect ${pt(x1, y1)} ${pt(x2, y2)} ${ask}`, bubble:`A garden has corners at ${corners.map(c => pt(...c)).join(', ')}. What is its ${ask}? Each unit is 1 yard.`, helper:'Find the length and width by counting between the coordinates.',
      visual:planeSVG(8, corners.map(([x, y]) => ({x, y})), corners),
      steps:[numStep('Width', 'compute', `From x = ${sgn(x1)} to x = ${sgn(x2)} = ?`, w, {mis:v => v === Math.abs(Math.abs(x2) - Math.abs(x1)) && v !== w ? 'negDistance' : null}),
        numStep('Height', 'compute', `From y = ${sgn(y1)} to y = ${sgn(y2)} = ?`, h, {mis:v => v === Math.abs(Math.abs(y2) - Math.abs(y1)) && v !== h ? 'negDistance' : null}),
        ask === 'area' ? numStep('Area', 'compute', `${w} × ${h} = ? square yards`, w * h, {fact:fx(w, h), mis:v => v === 2 * (w + h) ? 'areaPerimeterSwap' : null})
          : numStep('Perimeter', 'compute', `${w} + ${h} + ${w} + ${h} = ? yards`, 2 * (w + h), {mis:v => v === w * h ? 'areaPerimeterSwap' : v === w + h ? 'halfPerimeter' : null})], answerSteps:[2]};
  },
  coordWord(lvl){
    const places = shuffle([['🦴', 'the bone'], ['🐾', 'the pet door'], ['🥣', 'the food bowl'], ['🧸', 'the toy box'], ['🌳', 'the tree']]).slice(0, 2);
    const same = Math.random() < 0.5 ? 'x' : 'y', k = nz(6); let a, b; do { a = rand(-8, 8); b = rand(-8, 8); } while (a === b || (lvl >= 2 && Math.sign(a) === Math.sign(b)));
    const P1 = same === 'y' ? [a, k] : [k, a], P2 = same === 'y' ? [b, k] : [k, b], d = Math.abs(a - b);
    const move = lvl === 3 ? rand(1, 4) : 0, end = same === 'y' ? [P2[0], P2[1] + move] : [P2[0] + move, P2[1]];
    const bubble = lvl === 3 ? `The map is in meters. ${places[0][1].replace(/^./, m => m.toUpperCase())} is at ${pt(...P1)} and ${places[1][1]} is at ${pt(...P2)}. The dog walks from ${places[0][1]} to ${places[1][1]}, then ${move} m ${same === 'y' ? 'up' : 'right'}. How far does the dog walk?`
      : `The map is in meters. ${places[0][1].replace(/^./, m => m.toUpperCase())} is at ${pt(...P1)} and ${places[1][1]} is at ${pt(...P2)}. How far apart are they?`;
    const total = d + move;
    return {title:'Fence Lines', ctx:`${pt(...P1)} ${pt(...P2)} +${move}`, bubble, helper:'Points with the same x (or the same y) line up. Count the distance between the other coordinates.',
      visual:planeSVG(8, [{x:P1[0], y:P1[1], name:places[0][0]}, {x:P2[0], y:P2[1], name:places[1][0]}]),
      steps:[numStep('Distance', 'compute', `${places[0][1]} to ${places[1][1]} = ? m`, d, {mis:v => v === Math.abs(Math.abs(a) - Math.abs(b)) && v !== d ? 'negDistance' : null}),
        ...(move ? [numStep('Total walk', 'compute', `${d} + ${move} = ? m`, total, {})] : [])], answerSteps:[move ? 1 : 0]};
  }
};
Object.assign(GEN, HOUSES_GEN);

/* ===== 6th grade, Pet Houses part 2 (Khan unit 10): volume and surface area ===== */
/* a box drawn at a slant: l across, h up, w back; labels are text */
function boxSVG(lt, wt, ht, {l = 5, w = 3, h = 3} = {}){
  const s = Math.min(170 / (l + w * 0.6), 110 / (h + w * 0.5)), dx = w * 0.6 * s, dy = w * 0.5 * s, L = l * s, H = h * s, x0 = 56, y0 = 20 + dy;   // room on the left for the height label
  const f = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + H], [x0, y0 + H]], t = [[x0, y0], [x0 + dx, y0 - dy], [x0 + L + dx, y0 - dy], [x0 + L, y0]], r = [[x0 + L, y0], [x0 + L + dx, y0 - dy], [x0 + L + dx, y0 + H - dy], [x0 + L, y0 + H]];
  const poly = (p, c) => `<polygon points="${p.map(q => q.join(',')).join(' ')}" class="${c}"/>`;
  return `<svg class="shape-pic" viewBox="0 0 ${x0 + L + dx + 60} ${y0 + H + 30}" width="${x0 + L + dx + 60}" role="img" aria-label="box ${lt} by ${wt} by ${ht}">${poly(t, 'shape-fill shape-2')}${poly(r, 'shape-fill shape-3')}${poly(f, 'shape-fill')}`
    + `<text x="${x0 + L / 2}" y="${y0 + H + 20}" class="shape-lbl" text-anchor="middle">${lt}</text><text x="${x0 + L + dx / 2 + 8}" y="${y0 + H - dy / 2 + 14}" class="shape-lbl" text-anchor="start">${wt}</text><text x="${x0 - 6}" y="${y0 + H / 2}" class="shape-lbl" text-anchor="end">${ht}</text></svg>`;
}
/* nets: each is a list of polygons in grid units */
const NETS = {
  'rectangular prism':[[[1, 0], [3, 0], [3, 1], [1, 1]], [[0, 1], [1, 1], [1, 3], [0, 3]], [[1, 1], [3, 1], [3, 3], [1, 3]], [[3, 1], [4, 1], [4, 3], [3, 3]], [[4, 1], [6, 1], [6, 3], [4, 3]], [[1, 3], [3, 3], [3, 4], [1, 4]]],
  'cube':[[[1, 0], [2, 0], [2, 1], [1, 1]], [[0, 1], [1, 1], [1, 2], [0, 2]], [[1, 1], [2, 1], [2, 2], [1, 2]], [[2, 1], [3, 1], [3, 2], [2, 2]], [[3, 1], [4, 1], [4, 2], [3, 2]], [[1, 2], [2, 2], [2, 3], [1, 3]]],
  'square pyramid':[[[1, 1], [2, 1], [2, 2], [1, 2]], [[1, 1], [2, 1], [1.5, 0]], [[2, 1], [2, 2], [3, 1.5]], [[1, 2], [2, 2], [1.5, 3]], [[1, 1], [1, 2], [0, 1.5]]],
  'triangular prism':[[[0, 1], [1, 1], [1, 3], [0, 3]], [[1, 1], [2, 1], [2, 3], [1, 3]], [[2, 1], [3, 1], [3, 3], [2, 3]], [[1, 1], [2, 1], [1.5, 0.15]], [[1, 3], [2, 3], [1.5, 3.85]]],
  'triangular pyramid':[[[0, 0], [1, 0], [0.5, 0.87]], [[1, 0], [2, 0], [1.5, 0.87]], [[0.5, 0.87], [1.5, 0.87], [1, 1.73]], [[1, 0], [1.5, 0.87], [0.5, 0.87]]]
};
function netSVG(name){
  const polys = NETS[name], pts = polys.flat(), mx = Math.max(...pts.map(p => p[0])), my = Math.max(...pts.map(p => p[1])), s = Math.min(200 / mx, 150 / my);
  return `<svg class="shape-pic" viewBox="-6 -6 ${mx * s + 12} ${my * s + 12}" width="${mx * s + 12}" role="img" aria-label="a net">${polys.map(p => `<polygon points="${p.map(([x, y]) => `${x * s},${y * s}`).join(' ')}" class="shape-fill net-face"/>`).join('')}</svg>`;
}
const qt = r => RQ.txt(r);                                               // 5/2 → 2 1/2
const HALVES = [RQ.of(1, 2), RQ.of(3, 2), RQ.of(5, 2), RQ.of(1, 4), RQ.of(3, 4), RQ.of(5, 4), [2, 1], [3, 1], [4, 1], RQ.of(7, 2)];
const HOUSES2_GEN = {
  /* ----- station 5: Toy Boxes (volume) ----- */
  volPrism(lvl){
    const d = lvl === 1 ? [[rand(2, 9), 1], [rand(2, 9), 1], [rand(2, 6), 1]] : lvl === 2 ? [pick(HALVES.slice(0, 3)), [rand(2, 6), 1], [rand(2, 5), 1]] : [pick(HALVES), pick(HALVES), pick(HALVES)];
    const [l, w, h] = d, base = RQ.mul(l, w), V = RQ.mul(base, h);
    if (V[1] > 64) return HOUSES2_GEN.volPrism(lvl);
    const lw = [l[0] / l[1], w[0] / w[1], h[0] / h[1]];
    return {title:'Toy Boxes', ctx:`box ${qt(l)} × ${qt(w)} × ${qt(h)}`, bubble:`A pet toy box is ${qt(l)} ft long, ${qt(w)} ft wide, and ${qt(h)} ft tall. What is its volume?`, helper:'Volume = length × width × height. Find the area of the bottom first.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, `${qt(h)} ft`, {l:Math.max(1, lw[0]), w:Math.max(1, lw[1]), h:Math.max(1, lw[2])}),
      steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ?`, base, {fact:l[1] === 1 && w[1] === 1 ? fx(l[0], w[0]) : undefined}),
        rqStep('Volume', `${qt(base)} × ${qt(h)} = ? cubic feet`, V, {simplest:true, mis:w2 => { const s = RQ.add(RQ.add(l, w), h); return w2[0] * s[1] === s[0] * w2[1] ? 'volumeAddWrong' : null; }}),
        (() => { const f = rqStep('The answer', `${qt(l)} × ${qt(w)} × ${qt(h)} = ?`, V, {simplest:true}); f.skipIf = () => true; return f; })()], answerSteps:[2]};
  },
  volCubes(lvl){
    const n = [rand(1, lvl === 1 ? 4 : 6), rand(1, 4), rand(1, lvl === 3 ? 5 : 3)], k = lvl === 3 ? pick([2, 4]) : 2;     // edges are n/k units, cubes are 1/k on a side
    if (n.every(x => x % k === 0)) n[0]++;
    const edges = n.map(x => RQ.of(x, k)), cubes = n[0] * n[1] * n[2], V = RQ.of(cubes, k * k * k);
    return {title:'Toy Boxes', ctx:`cubes 1/${k} in ${edges.map(qt).join('×')}`, bubble:`A treat box is ${edges.map(e => qt(e)).join(' in. by ')} in. It is packed with cubes that are 1/${k} in. on each side. How many cubes fit? What is the volume?`,
      helper:`Each cube is 1/${k} × 1/${k} × 1/${k} = 1/${k * k * k} cubic inch.`, visual:boxSVG(`${qt(edges[0])} in.`, `${qt(edges[1])} in.`, `${qt(edges[2])} in.`, {l:n[0], w:n[1], h:n[2]}),
      steps:[numStep('Cubes along each edge', 'compute', `${n[0]} × ${n[1]} × ${n[2]} = ?`, cubes, {hint:() => `${qt(edges[0])} in. holds ${n[0]} cubes of 1/${k} in.`}),
        rqStep('Volume', `${cubes} × 1/${k * k * k} = ? cubic inches`, V, {simplest:true, mis:w => w[1] === 1 && w[0] === cubes ? 'fracVolumeWrong' : null})], answerSteps:[1]};
  },
  volWord(lvl){
    const [e, n] = pick(LEMON_KIDS), D = [RQ.of(3, 2), [2, 1], RQ.of(5, 2), [3, 1], RQ.of(7, 2), [4, 1]], H = [[1, 1], RQ.of(3, 2), [2, 1], RQ.of(5, 2), RQ.of(3, 4), RQ.of(5, 4)];
    const l = pick(D), w = pick(D.slice(0, 4)), h = pick(H), base = RQ.mul(l, w), V = RQ.mul(base, h);
    if (lvl === 1) return {title:'Toy Boxes', ctx:`fish tank ${qt(l)}×${qt(w)}×${qt(h)}`, bubble:`${n}'s fish tank is ${qt(l)} ft long, ${qt(w)} ft wide, and ${qt(h)} ft deep. How much water fills it?`, helper:'Volume = length × width × height.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, `${qt(h)} ft`, {l:3, w:2, h:2}), steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ? square feet`, base), rqStep('Volume', `${qt(base)} × ${qt(h)} = ? cubic feet`, V, {simplest:true})], answerSteps:[1]};
    return {title:'Toy Boxes', ctx:`V ${qt(V)} base ${qt(l)}×${qt(w)}`, bubble:`${n}'s hamster cage holds ${qt(V)} cubic feet. Its floor is ${qt(l)} ft by ${qt(w)} ft. How tall is it?`, helper:'Volume = base area × height, so height = volume ÷ base area.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, '? ft', {l:3, w:2, h:2}),
      steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ? square feet`, base), rqStep('Height', `${qt(V)} ÷ ${qt(base)} = ? feet`, h, {simplest:true, mis:w2 => { const p = RQ.mul(V, base); return w2[0] * p[1] === p[0] * w2[1] ? 'fracVolumeWrong' : null; }})], answerSteps:[1]};
  },
  /* ----- station 6: Wrapping Paper (nets and surface area) ----- */
  netsId(lvl){
    const names = Object.keys(NETS), right = pick(lvl === 1 ? ['cube', 'rectangular prism', 'square pyramid'] : names);
    const wrongs = shuffle(names.filter(nm => nm !== right)).slice(0, 3).map(nm => ({text:nm, mis:'netWrong'}));
    return {title:'Wrapping Paper', ctx:`net of ${right}`, bubble:'Fold up this net. What shape does it make?', helper:'Count the faces and look at their shapes: squares, rectangles, or triangles.', visual:netSVG(right),
      steps:[{name:'Which shape', type:'concept', kind:'choice', prompt:'What 3D shape does the net make?', options:choiceOf({text:right}, wrongs), hint:() => right.includes('pyramid') ? 'Triangles meet at a point: a pyramid.' : right.includes('triangular') ? 'Two triangle ends and rectangles around the side.' : 'Six faces, all rectangles (or all squares).'}]};
  },
  surfaceArea(lvl){
    const l = rand(2, lvl === 1 ? 6 : 10), w = rand(2, 8), h = lvl === 1 ? w : rand(2, 9), a = l * w, b = l * h, c = w * h, SA = 2 * (a + b + c);
    return {title:'Wrapping Paper', ctx:`SA ${l}×${w}×${h}`, bubble:`How much wrapping paper covers a gift box ${l} in. by ${w} in. by ${h} in., with no overlap?`, helper:'Surface area = the area of all 6 faces. Opposite faces match, so find 3 areas and double each.',
      visual:boxSVG(`${l} in.`, `${w} in.`, `${h} in.`, {l, w, h}),
      steps:[numStep('Top and bottom', 'compute', `2 × ${l} × ${w} = ?`, 2 * a, {fact:fx(l, w), mis:v => v === a ? 'surfaceMissingFaces' : null}), numStep('Front and back', 'compute', `2 × ${l} × ${h} = ?`, 2 * b, {mis:v => v === b ? 'surfaceMissingFaces' : null}),
        numStep('Left and right', 'compute', `2 × ${w} × ${h} = ?`, 2 * c, {mis:v => v === c ? 'surfaceMissingFaces' : null}),
        numStep('Surface area', 'compute', `${2 * a} + ${2 * b} + ${2 * c} = ? square inches`, SA, {mis:v => v === a + b + c ? 'surfaceMissingFaces' : v === l * w * h ? 'volumeAddWrong' : null})], answerSteps:[3]};
  },
  surfacePyramid(lvl){
    const s = rand(2, lvl === 1 ? 6 : 12), t = rand(s, s + 8), base = s * s, tri2 = s * t;                 // t is the height of each triangle face
    return {title:'Wrapping Paper', ctx:`pyramid ${s} slant ${t}`, bubble:`A pet tent is a square pyramid. The square base is ${s} ft on each side, and each triangle face is ${t} ft tall. What is the surface area, including the floor?`, helper:'1 square + 4 triangles. Each triangle is ½ × base × height.',
      visual:netSVG('square pyramid'),
      steps:[numStep('Square base', 'compute', `${s} × ${s} = ?`, base, {fact:fx(s, s)}), halfAreaStep('One triangle', `½ × ${s} × ${t} = ?`, tri2, {mis:v => v === tri2 ? 'halfWrong' : null}),
        numStep('Four triangles', 'compute', `4 × ${half(tri2)} = ?`, 2 * tri2, {mis:v => v * 2 === tri2 ? 'surfaceMissingFaces' : null}),
        numStep('Surface area', 'compute', `${base} + ${2 * tri2} = ? square feet`, base + 2 * tri2, {mis:v => v === 2 * tri2 ? 'surfaceMissingFaces' : v === base + tri2 ? 'surfaceMissingFaces' : null})], answerSteps:[3]};
  }
};
Object.assign(GEN, HOUSES2_GEN);

/* ===== 6th grade, Pet Show (Khan unit 11): data and statistics ===== */
const sortN = a => [...a].sort((x, y) => x - y);
const medianOf = a => { const s = sortN(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/* quartiles the 6th grade way: medians of the lower and upper halves, leaving out the middle value when n is odd */
const quartiles = a => { const s = sortN(a), n = s.length, lo = s.slice(0, Math.floor(n / 2)), hi = s.slice(Math.ceil(n / 2)); return [medianOf(lo), medianOf(hi)]; };
const sumOf = a => a.reduce((x, y) => x + y, 0);
const numTxt = x => String(parseFloat(x.toFixed(3)));
/* a typed answer that may be a decimal (a median of 7.5, a MAD of 2.25) */
const statStep = (name, prompt, v, extra = {}) => ({name, type:'compute', kind:'num', prompt, answer:numTxt(v), eq:u => typeof u === 'number' && Math.abs(u - v) < 1e-9, decimal:!Number.isInteger(v), slowOK:true, ...extra,
  ...(extra.mis ? {mis:u => typeof u === 'number' && Math.abs(u - v) < 1e-9 ? null : extra.mis(u)} : {})});
const near2 = (u, x) => typeof u === 'number' && Math.abs(u - x) < 1e-9;
/* dot plot: a dot for each value, stacked */
function dotPlotSVG(data, {lo = Math.min(...data), hi = Math.max(...data), label = ''} = {}){
  const w = 290, L = 18, R = w - 18, n = hi - lo || 1, step = (R - L) / n, X = v => L + (v - lo) * step, counts = {}, maxC = Math.max(...Object.values(data.reduce((c, v) => (c[v] = (c[v] || 0) + 1, c), {})));
  const r = Math.min(7, step / 2.4), dy = Math.min(2 * r + 2, 110 / maxC), base = 20 + maxC * dy;
  let g = `<line x1="${L - 6}" y1="${base}" x2="${R + 6}" y2="${base}" class="nl-line"/>`;
  for (let v = lo; v <= hi; v++) { g += `<line x1="${X(v)}" y1="${base - 4}" x2="${X(v)}" y2="${base + 4}" class="nl-line"/>`; if (n <= 14 || (v - lo) % 2 === 0) g += `<text x="${X(v)}" y="${base + 18}" class="nl-text nl-small">${v}</text>`; }
  data.forEach(v => { counts[v] = (counts[v] || 0) + 1; g += `<circle cx="${X(v)}" cy="${base - 4 - r - (counts[v] - 1) * dy}" r="${r}" class="dp-dot"/>`; });
  if (label) g += `<text x="${w / 2}" y="${base + 34}" class="nl-text nl-small">${esc(label)}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${base + (label ? 40 : 26)}" width="${w}" role="img" aria-label="dot plot">${g}</svg>`;
}
/* histogram: bins [[from, to, count]] */
function histSVG(bins, label){
  const w = 290, L = 34, R = w - 10, top = 14, bot = 150, maxC = Math.max(...bins.map(b => b[2])), bw = (R - L) / bins.length, Y = c => bot - c * (bot - top) / maxC;
  let g = `<line x1="${L}" y1="${top - 4}" x2="${L}" y2="${bot}" class="nl-line"/><line x1="${L}" y1="${bot}" x2="${R}" y2="${bot}" class="nl-line"/>`;
  for (let c = 0; c <= maxC; c++) if (maxC <= 10 || c % 2 === 0) g += `<text x="${L - 6}" y="${Y(c) + 4}" class="nl-text nl-small" text-anchor="end">${c}</text><line x1="${L}" y1="${Y(c)}" x2="${R}" y2="${Y(c)}" class="grid-line"/>`;
  bins.forEach(([a, b, c], i) => { g += `<rect x="${L + i * bw + 2}" y="${Y(c)}" width="${bw - 4}" height="${bot - Y(c)}" class="hist-bar"/><text x="${L + (i + 0.5) * bw}" y="${bot + 16}" class="nl-text nl-small">${a}–${b}</text>`; });
  g += `<text x="${(L + R) / 2}" y="${bot + 32}" class="nl-text nl-small">${esc(label)}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${bot + 38}" width="${w}" role="img" aria-label="histogram">${g}</svg>`;
}
/* box plot from a five-number summary */
function boxPlotSVG([mn, q1, md, q3, mx], {lo = mn - 2, hi = mx + 2} = {}){
  const w = 290, L = 16, R = w - 16, X = v => L + (v - lo) * (R - L) / (hi - lo), y = 30, span = hi - lo, step = span > 40 ? 10 : span > 20 ? 5 : span > 10 ? 2 : 1;
  let g = `<line x1="${X(mn)}" y1="${y}" x2="${X(q1)}" y2="${y}" class="nl-line"/><line x1="${X(q3)}" y1="${y}" x2="${X(mx)}" y2="${y}" class="nl-line"/>`
    + `<rect x="${X(q1)}" y="${y - 14}" width="${X(q3) - X(q1)}" height="28" class="box-rect"/><line x1="${X(md)}" y1="${y - 14}" x2="${X(md)}" y2="${y + 14}" class="box-med"/>`
    + `<line x1="${X(mn)}" y1="${y - 8}" x2="${X(mn)}" y2="${y + 8}" class="nl-line"/><line x1="${X(mx)}" y1="${y - 8}" x2="${X(mx)}" y2="${y + 8}" class="nl-line"/>`
    + `<line x1="${L}" y1="${y + 30}" x2="${R}" y2="${y + 30}" class="nl-line"/>`;
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) g += `<line x1="${X(v)}" y1="${y + 26}" x2="${X(v)}" y2="${y + 34}" class="nl-line"/><text x="${X(v)}" y="${y + 48}" class="nl-text nl-small">${v}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${y + 56}" width="${w}" role="img" aria-label="box plot">${g}</svg>`;
}
/* [emoji, pets, what the dot plot measures, how to say a value in a question] */
const PETS = [['🐕', 'dogs', 'weight (pounds)', n => `weigh ${n} pounds`], ['🐈', 'cats', 'age (years)', n => `are ${n} years old`], ['🐇', 'rabbits', 'carrots eaten', n => `ate ${n} carrots`], ['🐹', 'hamsters', 'wheel laps (hundreds)', n => `ran ${n} hundred laps`], ['🐦', 'birds', 'songs sung', n => `sang ${n} songs`]];
const listTxt = a => a.join(', ');
/* a data set of n values from lo to hi */
const dataSet = (n, lo, hi) => Array.from({length:n}, () => rand(lo, hi));
const STAT_QS = [
  ['How many hours do the students in my class sleep on school nights?', 'How many hours did Mia sleep last night?'],
  ['How much do the dogs at the pet show weigh?', 'How much does Rex the dog weigh?'],
  ['How many pets do the families on our street have?', 'How many pets does the Lopez family have?'],
  ['How long are the cats\' tails at the shelter?', 'Is the shelter open on Sundays?'],
  ['How many carrots does each rabbit at the farm eat in a day?', 'What color is the tallest rabbit?'],
  ['What are the ages of the horses in the parade?', 'How old is the oldest horse in the parade?']];
const SHOW_GEN = {
  /* ----- station 1: Judges' Table (statistical questions, dot plots, histograms) ----- */
  statQ(lvl){
    const [yes, no] = pick(STAT_QS);
    if (lvl === 1) { const ask = pick([yes, no]), isStat = ask === yes;
      return {title:"Judges' Table", ctx:`statQ ${isStat}`, bubble:`Is this a statistical question? "${ask}"`, helper:'A statistical question expects answers that vary: it asks about a group, not one thing.', visual:'<div style="text-align:center; font-size:2rem">🏅❓</div>',
        steps:[{name:'Statistical?', type:'concept', kind:'choice', prompt:`"${ask}"`, options:choiceOf({text:isStat ? 'Yes, it is statistical' : 'No, it has one answer'}, [{text:isStat ? 'No, it has one answer' : 'Yes, it is statistical', mis:'statQWrong'}]), hint:() => 'Would different members of the group give different answers?'}]}; }
    const others = shuffle(STAT_QS.filter(q => q[0] !== yes)).slice(0, 2).map(q => q[1]);
    return {title:"Judges' Table", ctx:`statQ pick`, bubble:'Which one is a statistical question?', helper:'A statistical question expects answers that vary.', visual:'<div style="text-align:center; font-size:2rem">🏅❓</div>',
      steps:[{name:'Which one', type:'concept', kind:'choice', prompt:'Which is a statistical question?', options:choiceOf({text:yes}, [no, ...others].map(t => ({text:t, mis:'statQWrong'}))), hint:() => 'Look for the question about a whole group, where answers vary.'}]};
  },
  readDot(lvl){
    const [e, what, label, say] = pick(PETS), lo = rand(1, 5), hi = lo + rand(6, 9), data = dataSet(rand(10, 18), lo, hi), cut = rand(lo + 2, hi - 2);
    const kind = lvl === 1 ? pick(['count', 'value']) : pick(['more', 'atMost', 'value']);
    const counts = {}; data.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const T = {count:[`How many ${what} are in the show?`, data.length, null], value:[`How many ${what} ${say(`exactly ${cut}`)}?`, counts[cut] || 0, null],
      more:[`How many ${what} ${say(`more than ${cut}`)}?`, data.filter(v => v > cut).length, data.filter(v => v >= cut).length], atMost:[`How many ${what} ${say(`at most ${cut}`)}?`, data.filter(v => v <= cut).length, data.filter(v => v < cut).length]}[kind];
    if (T[1] === 0) return SHOW_GEN.readDot(lvl);
    return {title:"Judges' Table", ctx:`dot ${kind} ${cut}`, bubble:`The dot plot shows the ${label} of the ${what} at the pet show. ${T[0]}`, helper:'Each dot is one pet.', visual:dotPlotSVG(data, {lo, hi, label}),
      steps:[numStep('Count', 'concept', T[0], T[1], {mis:v => T[2] !== null && v === T[2] && T[2] !== T[1] ? 'boundaryCount' : null, hint:() => kind === 'more' ? `Do not count the ${cut}s.` : kind === 'atMost' ? `Count the ${cut}s too.` : 'Count the dots.'})]};
  },
  readHist(lvl){
    const [e, what] = pick(PETS), w = pick([5, 10]), start = w === 5 ? 0 : 10, bins = Array.from({length:rand(4, 6)}, (_, i) => [start + i * w, start + i * w + w - 1, rand(1, 9)]);   // [from, to, count]
    const label = w === 5 ? 'age (years)' : 'weight (pounds)', k = rand(1, bins.length - 2), from = bins[k][0];
    if (lvl === 1) {
      const top = Math.max(...bins.map(b => b[2])); if (bins.filter(b => b[2] === top).length > 1) return SHOW_GEN.readHist(lvl);
      const best = bins.find(b => b[2] === top);
      return {title:"Judges' Table", ctx:`hist most`, bubble:`The histogram shows the ${label} of the ${what}. Which interval has the most ${what}?`, helper:'The tallest bar has the most.', visual:histSVG(bins, label),
        steps:[{name:'Tallest bar', type:'concept', kind:'choice', prompt:'Which interval has the most?', options:choiceOf({text:`${best[0]}–${best[1]}`}, shuffle(bins.filter(b => b !== best)).slice(0, 3).map(b => ({text:`${b[0]}–${b[1]}`, mis:'binRead'}))), hint:() => 'Find the tallest bar, then read the interval under it.'}]};
    }
    const ans = sumOf(bins.slice(k).map(b => b[2])), inBin = bins[k][2];
    return {title:"Judges' Table", ctx:`hist ≥ ${from}`, bubble:`The histogram shows the ${label} of the ${what}. How many ${what} are ${from} or more?`, helper:'Add the heights of every bar from that interval on.', visual:histSVG(bins, label),
      steps:[numStep('Add the bars', 'compute', `${bins.slice(k).map(b => b[2]).join(' + ')} = ?`, ans, {mis:v => v === inBin && bins.length - k > 1 ? 'binRead' : v === bins.slice(k).length ? 'binRead' : null, hint:() => `The bars from ${from} on are ${bins.slice(k).map(b => b[2]).join(', ')}.`})]};
  },

  /* ----- station 2: Score Cards (mean and median) ----- */
  meanCalc(lvl){
    const n = rand(4, lvl === 1 ? 5 : 8), m = rand(3, lvl === 3 ? 40 : 15); let data;
    do { data = Array.from({length:n - 1}, () => m + rand(-m + 1, m)); const last = m * n - sumOf(data); data.push(last); } while (data.some(v => v <= 0) || new Set(data).size < 3 || medianOf(data) === m);
    data = shuffle(data); const [e, what] = pick(PETS), S = sumOf(data);
    return {title:'Score Cards', ctx:`mean of ${listTxt(data)}`, bubble:`The judges gave ${n} ${what} these scores: ${listTxt(data)}. What is the mean score?`, helper:'Mean = add all the values, then divide by how many there are.', visual:`<div style="text-align:center; font-size:1.5rem">${e} ${listTxt(data)}</div>`,
      steps:[numStep('Add them', 'compute', `${data.join(' + ')} = ?`, S, {}), numStep('Divide', 'compute', `${S} ÷ ${n} = ?`, m, {fact:fx(n, m, true), mis:v => v === S ? 'meanNoDivide' : v === medianOf(data) ? 'meanMedianSwap' : null})], answerSteps:[1]};
  },
  meanDisplay(lvl){
    const [e, what, label] = pick(PETS); let data, m;
    for (let t = 0; t < 500; t++) { const lo = rand(1, 6); data = dataSet(rand(5, lvl === 1 ? 8 : 12), lo, lo + rand(3, 6)); if (sumOf(data) % data.length === 0) { m = sumOf(data) / data.length; break; } }
    if (m === undefined) return SHOW_GEN.meanDisplay(lvl);
    const counts = {}; data.forEach(v => counts[v] = (counts[v] || 0) + 1); const vals = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const S = sumOf(data), n = data.length, parts = vals.map(v => counts[v] > 1 ? `${counts[v]} × ${v}` : `${v}`);
    return {title:'Score Cards', ctx:`mean dot ${listTxt(sortN(data))}`, bubble:`The dot plot shows the ${label} of the ${what}. What is the mean?`, helper:'Several dots on one number means that value several times.', visual:dotPlotSVG(data, {label}),
      steps:[numStep('How many', 'concept', 'How many dots are there?', n, {}), numStep('Total', 'compute', `${parts.join(' + ')} = ?`, S, {mis:v => v === sumOf(vals) ? 'meanNoDivide' : null, hint:() => 'Multiply each value by its number of dots, then add.'}),
        numStep('Mean', 'compute', `${S} ÷ ${n} = ?`, m, {fact:fx(n, m, true), mis:v => v === S ? 'meanNoDivide' : v === medianOf(data) && v !== m ? 'meanMedianSwap' : null})], answerSteps:[2]};
  },
  medianDisplay(lvl){
    const [e, what, label] = pick(PETS), n = lvl === 3 ? pick([6, 8, 10, 12]) : pick([5, 7, 9, 11]), lo = rand(1, 8); let data; do { data = dataSet(n, lo, lo + rand(5, 12)); } while (new Set(data).size < 3);
    const med = medianOf(data);
    const unsorted = n % 2 ? data[(n - 1) / 2] : (data[n / 2 - 1] + data[n / 2]) / 2, mean = sumOf(data) / n;
    const showDot = lvl === 2;
    return {title:'Score Cards', ctx:`median ${listTxt(data)}`, bubble:showDot ? `The dot plot shows the ${label} of the ${what}. What is the median?` : `The ${what} scored ${listTxt(data)}. What is the median score?`, helper:'Put the values in order. The median is the middle one (or halfway between the two middle ones).',
      visual:showDot ? dotPlotSVG(data, {label}) : `<div style="text-align:center; font-size:1.4rem">${e} ${listTxt(data)}</div>`,
      steps:[{name:'In order', type:'concept', kind:'choice', prompt:'Which list is in order?', options:choiceOf({text:listTxt(sortN(data))}, [{text:listTxt(sortN(data).reverse())}, {text:listTxt(data), mis:'medianUnsorted'}, {text:listTxt([...sortN(data).slice(1), sortN(data)[0]])}]), hint:() => 'Smallest to largest.'},
        statStep('Median', `The median of ${listTxt(sortN(data))} = ?`, med, {mis:v => near2(v, unsorted) && unsorted !== med ? 'medianUnsorted' : near2(v, mean) && mean !== med ? 'meanMedianSwap' : null, hint:() => n % 2 ? `There are ${n} values: the middle one is number ${(n + 1) / 2}.` : `There are ${n} values: take halfway between numbers ${n / 2} and ${n / 2 + 1}.`})], answerSteps:[1]};
  },

  /* ----- station 3: Ribbon Ranges (IQR and MAD) ----- */
  iqr(lvl){
    const n = lvl === 1 ? pick([8, 10]) : pick([7, 9, 10, 11, 12]), lo = rand(1, 20), data = dataSet(n, lo, lo + rand(10, 30)), shown = lvl === 1 ? sortN(data) : data, [q1, q3] = quartiles(data), s = sortN(data);
    return {title:'Ribbon Ranges', ctx:`iqr ${listTxt(data)}`, bubble:`The ${pick(PETS)[1]} jumped these distances (inches): ${listTxt(shown)}. What is the interquartile range (IQR)?`, helper:'Order the data. Q1 is the median of the lower half, Q3 is the median of the upper half. IQR = Q3 − Q1.',
      visual:`<div style="text-align:center; font-size:1.3rem">📏 ${listTxt(shown)}</div>`,
      steps:[statStep('Q1', `Median of the lower half (${listTxt(s.slice(0, Math.floor(n / 2)))}) = ?`, q1, {}), statStep('Q3', `Median of the upper half (${listTxt(s.slice(Math.ceil(n / 2)))}) = ?`, q3, {}),
        statStep('IQR', `${numTxt(q3)} − ${numTxt(q1)} = ?`, q3 - q1, {mis:v => near2(v, s[n - 1] - s[0]) ? 'rangeNotIqr' : null})], answerSteps:[2]};
  },
  mad(lvl){
    const n = pick(lvl === 1 ? [4, 5] : [4, 5, 8, 10]); let data, m;
    for (let t = 0; t < 1000; t++) { m = rand(4, 20); data = Array.from({length:n - 1}, () => m + rand(-5, 5)); data.push(m * n - sumOf(data)); if (data.every(v => v > 0) && new Set(data).size > 2) break; }
    data = shuffle(data); const dev = data.map(v => Math.abs(v - m)), D = sumOf(dev), M = D / n;
    if (!Number.isInteger(M * 1000)) return SHOW_GEN.mad(lvl);
    return {title:'Ribbon Ranges', ctx:`mad ${listTxt(data)}`, bubble:`The ${pick(PETS)[1]} scored ${listTxt(data)}. What is the mean absolute deviation (MAD)?`, helper:'Find the mean, find how far each value is from the mean, then find the mean of those distances.',
      visual:`<div style="text-align:center; font-size:1.4rem">📏 ${listTxt(data)}</div>`,
      steps:[numStep('Mean', 'compute', `(${data.join(' + ')}) ÷ ${n} = ?`, m, {mis:v => v === sumOf(data) ? 'meanNoDivide' : null}), numStep('Distances', 'compute', `${dev.join(' + ')} = ?`, D, {hint:() => `Each distance from ${m}: ${data.map(v => `|${v} − ${m}| = ${Math.abs(v - m)}`).join(', ')}.`}),
        statStep('MAD', `${D} ÷ ${n} = ?`, M, {mis:v => v === D ? 'madNoDivide' : null})], answerSteps:[2]};
  },

  /* ----- station 4: Box Seats (box plots) ----- */
  readBox(lvl){
    const mn = rand(2, 20), q1 = mn + rand(2, 8), md = q1 + rand(1, 8), q3 = md + rand(1, 8), mx = q3 + rand(2, 10), five = [mn, q1, md, q3, mx], [e, what] = pick(PETS);
    const kind = lvl === 1 ? 'median' : lvl === 2 ? pick(['iqr', 'range']) : pick(['above', 'below', 'between']);
    const vis = boxPlotSVG(five);
    if (kind === 'median') return {title:'Box Seats', ctx:`box median ${five}`, bubble:`The box plot shows the scores of the ${what}. What is the median score?`, helper:'The line inside the box is the median.', visual:vis,
      steps:[numStep('Median', 'concept', 'Median = ?', md, {mis:v => v === q1 || v === q3 ? 'boxReadWrong' : v === Math.round((mn + mx) / 2) && v !== md ? 'boxReadWrong' : null})]};
    if (kind !== 'above' && kind !== 'below' && kind !== 'between') { const ans = kind === 'iqr' ? q3 - q1 : mx - mn;
      return {title:'Box Seats', ctx:`box ${kind} ${five}`, bubble:`The box plot shows the scores of the ${what}. What is the ${kind === 'iqr' ? 'interquartile range' : 'range'}?`, helper:kind === 'iqr' ? 'IQR = the right edge of the box − the left edge (Q3 − Q1).' : 'Range = maximum − minimum (the ends of the whiskers).', visual:vis,
        steps:[numStep(kind === 'iqr' ? 'IQR' : 'Range', 'compute', kind === 'iqr' ? `${q3} − ${q1} = ?` : `${mx} − ${mn} = ?`, ans, {mis:v => kind === 'iqr' && v === mx - mn ? 'rangeNotIqr' : kind === 'range' && v === q3 - q1 ? 'rangeNotIqr' : null})]}; }
    const Q = kind === 'above' ? [`What percent of the ${what} scored more than ${q3}?`, '25%'] : kind === 'below' ? [`What percent of the ${what} scored less than ${md}?`, '50%'] : [`What percent of the ${what} scored between ${q1} and ${q3}?`, '50%'];
    return {title:'Box Seats', ctx:`box ${kind} ${five}`, bubble:`The box plot shows the scores of the ${what}. ${Q[0]}`, helper:'Each whisker and each half of the box holds about 25% of the data.', visual:vis,
      steps:[{name:'What percent', type:'concept', kind:'choice', prompt:Q[0], options:choiceOf({text:Q[1]}, ['25%', '50%', '75%', '100%'].map(t => ({text:t, mis:'boxReadWrong'}))), hint:() => 'The four parts (whisker, half box, half box, whisker) each hold a quarter of the data.'}]};
  },
  makeBox(lvl){
    const n = lvl === 1 ? pick([7, 9]) : pick([8, 10, 11]), lo = rand(1, 15); let data; do { data = dataSet(n, lo, lo + rand(12, 25)); } while (new Set(data).size < n - 2);
    const s = sortN(data), [q1, q3] = quartiles(data), md = medianOf(data), five = [s[0], q1, md, q3, s[n - 1]];
    const hasHalf = five.some(v => !Number.isInteger(v)); if (hasHalf && lvl === 1) return SHOW_GEN.makeBox(lvl);
    const wrongB = [s[0], q1, (s[0] + s[n - 1]) / 2, q3, s[n - 1]];
    const range = {lo:s[0] - 2, hi:s[n - 1] + 2};
    const pics = [[five, true, null], [wrongB, false, 'boxReadWrong'], [[s[0], s[1], md, s[n - 2], s[n - 1]], false, 'boxReadWrong']].filter((p, i, arr) => arr.findIndex(q => q[0].join() === p[0].join()) === i);
    const opts = shuffle(pics.map(([f, ok, mis], i) => ({html:boxPlotSVG(f, range), text:`box ${f.join(' ')}`, ok, mis})));
    return {title:'Box Seats', ctx:`make box ${listTxt(data)}`, bubble:`Make a box plot of the ${pick(PETS)[1]}' scores: ${listTxt(data)}.`, helper:'Order the data and find the five numbers: minimum, Q1, median, Q3, maximum.',
      visual:`<div style="text-align:center; font-size:1.3rem">📦 ${listTxt(data)}</div>`,
      steps:[statStep('Median', `Median of ${listTxt(s)} = ?`, md, {mis:v => near2(v, (s[0] + s[n - 1]) / 2) && md !== (s[0] + s[n - 1]) / 2 ? 'boxReadWrong' : null}), statStep('Q1', `Q1 (median of ${listTxt(s.slice(0, Math.floor(n / 2)))}) = ?`, q1, {}),
        statStep('Q3', `Q3 (median of ${listTxt(s.slice(Math.ceil(n / 2)))}) = ?`, q3, {}), ...(opts.length >= 2 ? [{name:'Pick the plot', type:'concept', kind:'choice', prompt:`Which box plot shows ${five.map(numTxt).join(', ')}?`, options:opts, hint:() => 'Whiskers at the minimum and maximum, the box from Q1 to Q3, and the line at the median.'}] : [])],
      answerSteps:[opts.length >= 2 ? 3 : 0]};
  },

  /* ----- station 5: Best in Show (shape of data, choosing a display) ----- */
  shapeDist(lvl){
    const shape = pick(lvl === 1 ? ['symmetric', 'skewed right'] : ['symmetric', 'skewed right', 'skewed left']), lo = 1, hi = 11, data = [];
    const w = shape === 'symmetric' ? [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1] : shape === 'skewed right' ? [2, 5, 6, 5, 4, 3, 2, 2, 1, 1, 1] : [1, 1, 1, 2, 2, 3, 4, 5, 6, 5, 2];
    w.forEach((c, i) => { const k = Math.max(0, c + rand(-1, 0)); for (let j = 0; j < k; j++) data.push(lo + i); });
    const tail = {symmetric:'The data are about the same on both sides of the middle.', 'skewed right':'The data pile up on the left and trail off to the right.', 'skewed left':'The data pile up on the right and trail off to the left.'};
    return {title:'Best in Show', ctx:`shape ${shape}`, bubble:`What is the shape of this data?`, helper:'Skewed means a long tail. The tail\'s side names the skew: a tail to the right is skewed right.', visual:dotPlotSVG(data, {lo, hi, label:'score'}),
      steps:[{name:'Shape', type:'concept', kind:'choice', prompt:'Which describes the shape?', options:choiceOf({text:tail[shape]}, Object.entries(tail).filter(([k]) => k !== shape).map(([k, t]) => ({text:t, mis:(k === 'skewed left' && shape === 'skewed right') || (k === 'skewed right' && shape === 'skewed left') ? 'skewDirection' : null}))), hint:() => 'Where is the tall pile? Which way does the thin tail go?'}]};
  },
  cmpDisplays(lvl){
    const Q = pick([
      ['Which display shows every single value?', 'Dot plot', ['Histogram', 'Box plot']],
      ['Which display shows the median and the quartiles directly?', 'Box plot', ['Dot plot', 'Histogram']],
      ['Which display groups the values into equal intervals?', 'Histogram', ['Dot plot', 'Box plot']],
      ['Which display can you use to find the mean exactly?', 'Dot plot', ['Histogram', 'Box plot']],
      ['Which display lets you read the IQR without any math on the list?', 'Box plot', ['Histogram', 'Dot plot']]]);
    return {title:'Best in Show', ctx:Q[0], bubble:Q[0], helper:'Dot plots show each value. Histograms show counts in intervals. Box plots show the five-number summary.', visual:'<div style="text-align:center; font-size:2rem">📊 🟢 📦</div>',
      steps:[{name:'Which display', type:'concept', kind:'choice', prompt:Q[0], options:choiceOf({text:Q[1]}, Q[2].map(t => ({text:t, mis:'displayWrong'}))), hint:() => 'Think about what you can and can\'t see in each one.'}]};
  }
};
Object.assign(GEN, SHOW_GEN);

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
const SCREENS = ['loading','join','name','home','room','cafe','shift','sprint','book','library','summary','shop','hall','parent','arcade'];
function show(id){
  if (id !== 'room' && roomDrag) finishRoomDrag();
  if (id === 'arcade' && !arcadePolicy().enabled) { toast('Your teacher has not opened the Arcade.'); id = 'home'; }
  SCREENS.forEach(s => $('#scr-'+s).hidden = (s !== id));
  Music.setTempo(id === 'sprint' ? SPRINT_RATE : 1);
  updateHeader();
  if (id === 'home') renderHome();
  if (id === 'room') renderPetRoom();
  if (id === 'cafe') renderShopFloor(currentShop);
  if (id === 'book') { const b = BUILDINGS.find(x => x.id === bookUnit), hood = currentHood(), list = viewSubject ? buildingsInClass(hood, viewSubject) : buildingsIn(hood); renderBook(b && b.hood === hood && (!viewSubject || b.subject === viewSubject) ? bookUnit : list[0].id); }
  if (id === 'library') renderEnglishLibrary();
  if (id === 'arcade') renderArcade();
  window.scrollTo(0,0);
}
document.addEventListener('click', e => {
  const gamesOnlyButton = e.target.closest('[data-games-only]');
  if (gamesOnlyButton) { const form = gamesOnlyButton.closest('#scr-join, #scr-name')?.querySelector('[data-games-only-form]'); if (form) { form.hidden = false; form.querySelector('input').focus(); } return; }
  if (e.target.closest('[data-games-only-exit]')) { exitGamesOnly(); return; }
  const b = e.target.closest('[data-go]'); if (b) { if (b.dataset.go === 'arcade') void openArcade(); else show(b.dataset.go); }
});
document.addEventListener('submit', e => {
  const form = e.target.closest('[data-games-only-form]');
  if (form) { e.preventDefault(); enterGamesOnly(form); }
});
function updateHeader(){
  $('#townTitle').textContent = gamesOnlyMode ? 'Arcade' : townName(); document.title = gamesOnlyMode ? 'Arcade' : townName();
  $('#coinCount').textContent = S.coins;
  $('#coinCount').parentElement.hidden = gamesOnlyMode;
  $('#powerChip').hidden = gamesOnlyMode || !(S.power > 1);
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
const arcadeEntryCost = 100;
let gamesOnlyMode = false, gamesOnlyReturn = 'join';
let activeArcadeRun = null, arcadeTimer = null;
const arcadePolicy = () => gamesOnlyMode ? arcadeSettings({enabled:true, freePlay:true}) : Backend.me ? arcadeSettings(Backend.me.game_settings?.arcade) : arcadeSettings({enabled:true, freePlay:true});
const arcadeGamesForClass = () => {
  const policy = arcadePolicy();
  return ARCADE_GAMES.filter(game => game.available && (policy.freePlay || policy.games[game.id]));
};
const arcadeTicketPrizesEnabled = () => { const policy = arcadePolicy(); return policy.enabled && !policy.freePlay; };
async function openArcade(){
  if (Backend.me) await Backend.refreshSettings();
  const policy = arcadePolicy();
  if (!policy.freePlay && !policy.enabled) { toast('Your teacher has not opened the Arcade.'); return; }
  show('arcade');
}
function enterGamesOnly(form){
  const input = form.querySelector('[name="secretWord"]'), error = form.querySelector('[data-games-only-error]');
  if (input.value.trim().toUpperCase() !== 'GAMEZ') { error.textContent = 'That secret word did not match.'; input.value = ''; input.focus(); return; }
  gamesOnlyReturn = form.closest('#scr-join') ? 'join' : 'name';
  gamesOnlyMode = true;
  show('arcade');
}
function exitGamesOnly(){
  gamesOnlyMode = false;
  if (gamesOnlyReturn === 'join') openJoin(); else openName();
}
const arcadeDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
function arcadeToday(){
  const day = arcadeDateKey();
  if (S.arcade.day !== day) { S.arcade.day = day; S.arcade.playedSeconds = 0; S.arcade.admittedDay = ''; }
  if (S.arcade.ticketDay !== day) { S.arcade.ticketDay = day; S.arcade.ticketsEarnedToday = 0; }
  return day;
}
function arcadeMathMinutes(){ return Math.floor(Number(S.mathMinutes[arcadeToday()] || 0)); }
function arcadeRemainingSeconds(){
  if (S.arcade.timerVersion !== 3) { S.arcade.playedSeconds = 0; S.arcade.timerVersion = 3; save(); }
  return Math.max(0, arcadeMathMinutes() * 60 - S.arcade.playedSeconds);
}
function arcadeAdmitted(){ return S.arcade.admittedDay === arcadeToday(); }
function arcadeFurnitureCard(item){
  const policy = arcadePolicy(), owned = S.room.items.includes(item.id), prizesEnabled = arcadeTicketPrizesEnabled(), canBuy = prizesEnabled && !owned && S.arcade.tickets >= item.ticketPrice;
  const action = owned ? '<span class="tag">Owned</span>' : prizesEnabled
    ? `<button class="btn small butter" data-arcade-furniture="${item.id}" ${canBuy ? '' : 'disabled'}>${canBuy ? `Buy · 🎟️ ${item.ticketPrice}` : `Need 🎟️ ${item.ticketPrice}`}</button>`
    : `<span class="tag">${policy.freePlay ? 'Disabled in Free Play' : 'Prize shop coming soon'}</span>`;
  return `<div class="wardrobe-item${owned ? '' : ' locked'}"><span class="accessory-emoji">${item.emoji}</span><strong>${esc(item.name)}</strong><small>Pet Room furniture</small>${action}</div>`;
}
function buyArcadeFurniture(id){
  if (!arcadeTicketPrizesEnabled()) return;
  const item = ARCADE_ROOM_FURNITURE.find(furniture => furniture.id === id);
  if (!item || S.room.items.includes(id) || S.arcade.tickets < item.ticketPrice) return;
  S.arcade.tickets -= item.ticketPrice; S.room.items.push(id); save(); renderArcade(); toast(`${item.name} added to your Pet Room!`);
}
function arcadeModuleMessage(event){
  const frame = $('#arcadeFrame');
  const run = activeArcadeRun, data = event.data, policy = arcadePolicy();
  if (!frame || !run || event.origin !== location.origin || event.source !== frame.contentWindow || !data || data.runId !== run.id || data.gameId !== run.gameId) return;
  if (data.type === 'arcade:state-load-request') {
    event.source.postMessage({type:'arcade:state-load', gameId:run.gameId, runId:run.id, state:S.arcade.gameSaves[run.gameId] || null}, event.origin);
    return;
  }
  if (data.type === 'arcade:state-save') {
    if (typeof data.state !== 'string' || data.state.length > 100000) return;
    S.arcade.gameSaves[run.gameId] = data.state; save(); return;
  }
  if (data.type === 'arcade:state-clear') { delete S.arcade.gameSaves[run.gameId]; save(); return; }
  if (data.type !== 'arcade:round-complete' || run.freePlay || policy.freePlay || !policy.enabled || !policy.games[run.gameId]) return;
  const roundId = typeof data.roundId === 'string' ? data.roundId.slice(0,80) : '';
  const score = Math.floor(Number(data.score));
  if (!roundId || !Number.isFinite(score) || score < 0) return;
  const roundKey = `${run.id}:${roundId}`;
  if (run.completed.has(roundKey) || S.arcade.completedRounds.includes(roundKey)) return;
  run.completed.add(roundKey); S.arcade.completedRounds.push(roundKey); S.arcade.completedRounds = S.arcade.completedRounds.slice(-200);
  let earned = 0;
  if (run.gameId === 'corsairs-cove') {
    const oldMilestones = Math.floor(run.highestScore / policy.corsairPointsPerTicket);
    run.highestScore = Math.max(run.highestScore, score);
    earned = Math.floor(run.highestScore / policy.corsairPointsPerTicket) - oldMilestones;
  } else if (run.gameId === 'whack-a-mole') earned = policy.whackTicketsPerRound;
  if (run.gameOfDay) earned += policy.gameOfDayBonusTickets;
  const cap = Math.max(0, policy.maxTicketsPerDay - S.arcade.ticketsEarnedToday);
  const tickets = Math.min(cap, earned);
  if (tickets > 0) {
    S.arcade.tickets += tickets; S.arcade.ticketsEarnedToday += tickets;
    save(); renderArcade(); toast(`You earned ${tickets} arcade ticket${tickets === 1 ? '' : 's'}!`);
  } else save();
}
window.addEventListener('message', arcadeModuleMessage);
function arcadeCard(game, daily, policy){
  const remaining = gamesOnlyMode ? 0 : arcadeRemainingSeconds(), admitted = policy.freePlay || arcadeAdmitted();
  const playable = gamesOnlyMode || (remaining > 0 && (policy.freePlay || admitted || S.coins >= arcadeEntryCost));
  const action = gamesOnlyMode ? 'Play' : policy.freePlay ? 'Play free' : admitted ? 'Play' : `Enter for 🪙 ${arcadeEntryCost}`;
  return `<article class="arcade-card${daily ? ' arcade-daily' : ''}"><div class="arcade-card-top"><span class="arcade-emoji">${game.emoji}</span><span class="arcade-badge" ${daily ? '' : 'hidden'}>Game of the day</span></div><h3>${esc(game.name)}</h3><p>${esc(game.description)}</p><button class="btn berry" data-arcade-start="${esc(game.id)}" ${playable ? '' : 'disabled'}>${playable ? action : remaining ? `Need ${arcadeEntryCost} 🪙` : 'No arcade time left today'}</button></article>`;
}
function renderArcade(){
  const policy = arcadePolicy(), games = arcadeGamesForClass(), daily = arcadeGameOfTheDay(new Date(), games);
  const minutes = gamesOnlyMode ? 0 : arcadeMathMinutes(), remaining = gamesOnlyMode ? 0 : arcadeRemainingSeconds();
  const arcadeStats = gamesOnlyMode ? `<div><b>Games only</b><span>No Pet Town coins or tickets</span></div>` : policy.freePlay
    ? `<div><b>Free Play</b><span>no coins or rewards</span></div>`
    : `<div><b>🎟️ ${S.arcade.tickets}</b><span>arcade tickets</span></div>`;
  const timeStats = gamesOnlyMode
    ? `<div><b>Unlimited</b><span>no math-time limit</span></div><div><b>No rewards</b><span>games only</span></div>`
    : `<div><b>${minutes} min</b><span>practice time unlocked today</span></div><div><b>${Math.floor(remaining / 60)} min</b><span>arcade time left</span></div>`;
  const prizeShop = policy.freePlay ? '' : `<section class="arcade-prizes"><div class="backrow"><h3>Furniture stickers for My Pet Room</h3><span>🎟️ ${S.arcade.tickets}</span></div><div class="wardrobe-grid">${ARCADE_ROOM_FURNITURE.map(arcadeFurnitureCard).join('')}</div><p class="wardrobe-note">Earn tickets in Arcade games. Ticket purchases use Arcade tickets only.</p></section>`;
  $('#arcadeWrap').innerHTML = `<div class="backrow"><h2>🕹️ Arcade</h2>${gamesOnlyMode ? '<button class="btn small" data-games-only-exit>Exit games</button>' : '<button class="btn small" data-go="home">Back to town</button>'}</div>
    <div class="arcade-summary">${timeStats}${arcadeStats}</div>
    <p class="muted">${gamesOnlyMode ? 'Games-only session: no practice timer, Pet Town coins, Arcade tickets, or prize shop.' : policy.freePlay ? 'Free Play is on: no Pet Town coins or Arcade tickets. Learning practice unlocks play time.' : `Arcade admission costs 🪙 ${arcadeEntryCost} once per day. Then play any game while your practice time remains. Ticket prizes are separate from Pet Town coins.`}</p>
    <div class="arcade-grid">${games.map(game => arcadeCard(game, daily?.id === game.id, policy)).join('') || '<p class="muted">Your teacher has not enabled any Arcade games.</p>'}</div>
    ${prizeShop}
    <div id="arcadePlayWrap" class="arcade-play" hidden></div>`;
}
function startArcadeGame(id){
  const policy = arcadePolicy(), game = arcadeGamesForClass().find(item => item.id === id), remaining = gamesOnlyMode ? 0 : arcadeRemainingSeconds();
  if (!game || (!gamesOnlyMode && remaining <= 0) || (!gamesOnlyMode && !policy.freePlay && (!policy.enabled || !policy.games[id] || !arcadeAdmitted() && S.coins < arcadeEntryCost))) return;
  if (!policy.freePlay && !arcadeAdmitted()) { S.coins -= arcadeEntryCost; S.arcade.admittedDay = arcadeToday(); save(); updateHeader(); }
  if (arcadeTimer) clearInterval(arcadeTimer);
  const runId = `${S.sid}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
  activeArcadeRun = {id:runId, gameId:game.id, freePlay:policy.freePlay, gameOfDay:arcadeGameOfTheDay(new Date(), arcadeGamesForClass())?.id === game.id, highestScore:0, completed:new Set()};
  const play = $('#arcadePlayWrap');
  play.hidden = false;
  play.innerHTML = `<div class="arcade-play-head"><strong>${game.emoji} ${esc(game.name)}</strong><span id="arcadeClock">${gamesOnlyMode ? 'Games only' : `${Math.ceil(remaining / 60)} min left`}</span><button class="btn small" id="arcadeClose">Leave game</button></div><iframe id="arcadeFrame" title="${esc(game.name)}" src="${esc(game.src)}?student=${encodeURIComponent(S.sid)}&arcadeRun=${encodeURIComponent(runId)}" loading="eager"></iframe>`;
  $('#arcadeClose').addEventListener('click', () => { if (arcadeTimer) clearInterval(arcadeTimer); activeArcadeRun = null; play.hidden = true; play.innerHTML = ''; renderArcade(); });
  if (gamesOnlyMode) return;
  const started = performance.now();
  let elapsedPreviously = 0;
  arcadeTimer = setInterval(() => {
    const used = Math.floor((performance.now() - started) / 1000);
    const elapsed = Math.max(0, used - elapsedPreviously);
    elapsedPreviously = used;
    S.arcade.playedSeconds = Math.min(arcadeMathMinutes() * 60, S.arcade.playedSeconds + elapsed);
    save();
    const left = arcadeRemainingSeconds();
    const clock = $('#arcadeClock'); if (clock) clock.textContent = `${Math.ceil(left / 60)} min left`;
    if (!left) { clearInterval(arcadeTimer); arcadeTimer = null; activeArcadeRun = null; play.hidden = true; play.innerHTML = ''; renderArcade(); toast('Today\'s arcade time is used up.'); }
  }, 1000);
}
$('#arcadeWrap').addEventListener('click', event => {
  const button = event.target.closest('[data-arcade-start]');
  if (button) startArcadeGame(button.dataset.arcadeStart);
  const furniture = event.target.closest('[data-arcade-furniture]');
  if (furniture) buyArcadeFurniture(furniture.dataset.arcadeFurniture);
});
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
  syncLanguageControls();
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
  viewHood = null; viewSubject = null;
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
const currentHood = () => viewHood && townHoods().some(n => n.id === viewHood) ? viewHood : homeHood();
let viewSubject = null;
function hoodSwitchHTML(){
  const hoods = townHoods(); if (hoods.length < 2) return '';
  const home = homeHood(), sorted = hoods;                        // grade order (4th, then 6th), with the home grade marked
  return `<div class="hood-switch" role="tablist" aria-label="Grade">${sorted.map(n => `<button type="button" role="tab" class="hood-tab${n.id === currentHood() ? ' active' : ''}" aria-selected="${n.id === currentHood()}" data-hood="${n.id}">${n.emoji} ${esc(n.name)}${n.id === home ? ' <small>home</small>' : ''}</button>`).join('')}</div>`;
}
/* neighborhoods whose buildings have a pin (History) get a world map; each pin opens its museum like the tile below it */
const MAP_LAND = ['8,14 20,10 30,14 33,24 28,34 24,44 20,40 14,30 9,24', '34,6 42,6 40,14 35,12', '24,48 32,50 34,62 29,80 26,70 23,56', '44,18 52,14 58,16 60,24 54,32 47,30 43,25', '46,36 56,34 62,42 62,56 57,72 52,66 49,52 44,42', '60,14 75,12 90,16 92,28 86,40 80,48 74,38 66,40 62,32 58,22', '80,62 90,60 92,70 84,74 79,69'];
function worldMapHTML(hood, subject){
  const pinned = buildingsInClass(hood, subject).filter(b => b.pin); if (!pinned.length) return '';
  const pins = pinned.map((b, i) => {
    const open = unitOpen(b.id), style = `left:${b.pin.x}%;top:${b.pin.y}%`, label = `${i + 1}. ${esc(b.name)}: ${esc(b.unit)}${open ? '' : ', opening soon'}`;
    return open ? `<button type="button" class="map-pin" style="${style}" data-open="${b.id}" aria-label="${label}" title="${label}">${b.emoji}<small>${i + 1}</small></button>`
      : `<span class="map-pin locked" style="${style}" role="img" aria-label="${label}" title="${label}">${b.emoji}<small>${i + 1}</small></span>`;
  }).join('');
  return `<div class="world-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${MAP_LAND.map(p => `<polygon points="${p}"/>`).join('')}</svg>${pins}</div>`;
}
/* a grade trophy for the Sticker Book once every unit test in a neighborhood is passed */
function hoodTrophies(){ return NEIGHBORHOODS.filter(n => { const list = buildingsIn(n.id); return list.length && list.every(b => b.open && unitTestPassed(b.id)); }); }

/* ---------- Pet Room and Dress-up ---------- */
function roomPoint(index){
  return {x:12 + (index % 4) * 24, y:54 + Math.floor(index / 4) * 24};
}
const ROOM_PET_ART = {cat:'🐈', bunny:'🐇', penguin:'🐧', chick:'🐥', dog:'🐕', goat:'🐐', turtle:'🐢', llama:'🦙', rooster:'🐓', bat:'🦇', squirrel:'🐿️', eagle:'🦅', dragon:'🐉', deer:'🦌', wolf:'🐺', whale:'🐋', shark:'🦈', swan:'🦢', frog:'🐸', snake:'🐍', lizard:'🦎', octopus:'🐙', butterfly:'🦋', snail:'🐌', ladybug:'🐞', bee:'🐝', badger:'🦡', peacock:'🦚', poodle:'🐩', giraffe:'🦒', zebra:'🦓', lion:'🦁'};
function roomPetArt(){ return ROOM_PET_ART[S.pet] || petEmoji(); }
function accessoryPoint(item){
  return S.accessoryPositions[item.id] || (item.slot === 'hat' ? {x:50,y:10} : item.slot === 'eyes' ? {x:50,y:42} : {x:50,y:82});
}
function roomItem(id){ return REWARDS.find(item => item.id === id) || ARCADE_ROOM_FURNITURE.find(item => item.id === id) || null; }
function ensureRoom(){
  if (S.room.initialized) return;
  S.room.placements = S.displayed.filter(id => id && S.decor.includes(id)).map((id, i) => ({id, ...roomPoint(i)}));
  S.room.initialized = true; save();
}
function roomAccessoryCard(item){
  const owned = S.accessoriesOwned.includes(item.id), worn = S.wearing[item.slot] === item.id;
  let action = '';
  if (owned) action = `<button class="btn small ${worn ? '' : 'mint'}" data-room-wear="${item.id}">${worn ? 'Remove' : 'Wear'}</button>`;
  else if (item.source === 'coins') action = `<button class="btn small butter" data-room-buy="${item.id}" ${S.coins < item.price ? 'disabled' : ''}>🪙 ${item.price}</button>`;
  else if (item.source === 'practice') action = S.bestStreak >= (item.streakRequired || Infinity)
    ? `<button class="btn small mint" data-room-claim="${item.id}">Claim</button>`
    : `<small>Earn with ${item.streakRequired} perfect orders in a row</small>`;
  else action = `<small>🎟️ ${item.price}<br>Arcade prizes coming soon</small>`;
  return `<div class="wardrobe-item${item.source === 'arcade' ? ' locked' : ''}"><span class="accessory-emoji">${item.emoji}</span><strong>${esc(item.name)}</strong><small>${esc(item.slot)}</small>${action}</div>`;
}
function roomWear(id){
  const item = ACCESSORIES.find(accessory => accessory.id === id);
  if (!item || !S.accessoriesOwned.includes(id)) return;
  if (S.wearing[item.slot] === id) S.wearing[item.slot] = null;
  else {
    S.wearing[item.slot] = id;
    if (!S.accessoryPositions[id]) S.accessoryPositions[id] = accessoryPoint(item);
  }
  save(); renderPetRoom(); sfx('good');
}
function roomObtainAccessory(id){
  const item = ACCESSORIES.find(accessory => accessory.id === id);
  if (!item || S.accessoriesOwned.includes(id)) return;
  if (item.source === 'coins') {
    if (S.coins < item.price) return;
    S.coins -= item.price;
  } else if (item.source === 'practice') {
    if (S.bestStreak < (item.streakRequired || Infinity)) return;
  } else return;
  S.accessoriesOwned.push(id); save(); updateHeader(); renderPetRoom(); sfx('coin');
  toast(item.source === 'practice' ? `${item.name} earned!` : `${item.name} added to Dress-up!`);
}
function renderPetRoom(){
  ensureRoom();
  const placed = new Set(S.room.placements.map(item => item.id));
  const positions = S.room.placements.map(place => {
    const reward = roomItem(place.id);
    return reward ? `<button type="button" class="room-decor-item" data-room-decor="${reward.id}" style="left:${place.x}%;top:${place.y}%" aria-label="Move ${esc(reward.name)}; use arrow keys to nudge"><span class="room-decor-emoji" aria-hidden="true">${reward.emoji}</span></button>` : '';
  }).join('');
  const inventory = [...S.decor, ...S.room.items].filter(id => !placed.has(id)).map(id => {
    const reward = roomItem(id);
    return reward ? `<button type="button" data-room-add="${id}" aria-label="Place ${esc(reward.name)}" title="Place ${esc(reward.name)}"><span class="room-inventory-emoji" aria-hidden="true">${reward.emoji}</span></button>` : '';
  }).join('');
  const roomInventory = S.room.placements.map(place => {
    const reward = roomItem(place.id);
    return reward ? `<div class="room-placed-item"><span class="room-inventory-emoji" aria-hidden="true">${reward.emoji}</span><button type="button" class="room-remove" data-room-remove="${reward.id}" aria-label="Take ${esc(reward.name)} out of the room" title="Take out of room">×</button></div>` : '';
  }).join('');
  const wear = slot => {
    const item = ACCESSORIES.find(accessory => accessory.id === S.wearing[slot]); if (!item) return '';
    const point = accessoryPoint(item);
    return `<span class="room-wear" data-room-accessory="${item.id}" role="button" tabindex="0" style="left:${point.x}%;top:${point.y}%" aria-label="Move ${esc(item.name)}; arrow keys to nudge, Enter to remove"><span aria-hidden="true">${item.emoji}</span></span>`;
  };
  $('#roomWrap').innerHTML = `<div class="backrow"><h2>🏠 My Pet Room</h2><button class="btn small" data-go="home">Back to town</button></div>
    <div class="room-layout"><div><div id="roomScene" class="room-scene" aria-label="Your room. Drag decorations or focus one and use the arrow keys to move it."><div id="roomBubble" class="room-bubble" role="status">${esc(petName())}: My room!</div><div class="room-rug" aria-hidden="true"></div>
      <div class="room-pet" data-room-pet role="button" tabindex="0" aria-label="Tap ${esc(petName())}, your helper pet"><span id="roomPetArt" class="room-pet-art"><span class="room-pet-emoji" aria-hidden="true">${roomPetArt()}</span>${wear('hat')}${wear('eyes')}${wear('neck')}</span></div>${positions}</div>
      <div class="room-panel"><h3>Decorations</h3><div class="room-inventory">${inventory || '<p class="muted">All your decorations are in the room.</p>'}</div><h4 class="room-subhead">In the room</h4><div class="room-placed-list">${roomInventory || '<span class="muted">No stickers placed yet.</span>'}</div></div></div>
      <aside class="room-side"><section class="room-panel"><h3>Dress-up</h3><div class="wardrobe-grid">${ACCESSORIES.map(roomAccessoryCard).join('')}</div><p class="wardrobe-note">Coin items can be bought here. Practice rewards are earned by math. Arcade-ticket items unlock with the secure Arcade prize shop.</p></section></aside></div>`;
}
let roomDrag = null;
$('#roomWrap').addEventListener('pointerdown', event => {
  const accessory = event.target.closest('[data-room-accessory]'), petArt = $('#roomPetArt');
  if (accessory && petArt && event.button === 0) {
    event.preventDefault(); event.stopPropagation();
    roomDrag = {kind:'accessory', id:accessory.dataset.roomAccessory, pointerId:event.pointerId, rect:petArt.getBoundingClientRect()};
    accessory.classList.add('dragging'); accessory.setPointerCapture(event.pointerId); return;
  }
  const item = event.target.closest('[data-room-decor]'), scene = $('#roomScene');
  if (!item || !scene || event.button !== 0) return;
  event.preventDefault();
  roomDrag = {kind:'decor', id:item.dataset.roomDecor, pointerId:event.pointerId, rect:scene.getBoundingClientRect()};
  item.classList.add('dragging'); item.setPointerCapture(event.pointerId);
});
$('#roomWrap').addEventListener('pointermove', event => {
  if (!roomDrag || roomDrag.pointerId !== event.pointerId) return;
  const min = roomDrag.kind === 'accessory' ? 5 : 4, max = roomDrag.kind === 'accessory' ? 95 : 96;
  const x = Math.max(min, Math.min(max, 100 * (event.clientX - roomDrag.rect.left) / roomDrag.rect.width));
  const y = Math.max(min, Math.min(roomDrag.kind === 'accessory' ? 95 : 88, 100 * (event.clientY - roomDrag.rect.top) / roomDrag.rect.height));
  roomDrag.x = x; roomDrag.y = y;
  const selector = roomDrag.kind === 'accessory' ? '[data-room-accessory]' : '[data-room-decor]';
  const root = roomDrag.kind === 'accessory' ? $('#roomPetArt') : $('#roomScene');
  const item = [...(root?.querySelectorAll(selector) || [])].find(button => button.dataset.roomAccessory === roomDrag.id || button.dataset.roomDecor === roomDrag.id);
  if (item) { item.style.left = `${x}%`; item.style.top = `${y}%`; roomDrag.x = x; roomDrag.y = y; }
});
function finishRoomDrag(event){
  if (!roomDrag || (event?.pointerId != null && roomDrag.pointerId !== event.pointerId)) return;
  if (Number.isFinite(roomDrag.x) && Number.isFinite(roomDrag.y)) {
    if (roomDrag.kind === 'accessory') S.accessoryPositions[roomDrag.id] = {x:roomDrag.x, y:roomDrag.y};
    else {
      const item = S.room.placements.find(place => place.id === roomDrag.id);
      if (item) { item.x = roomDrag.x; item.y = roomDrag.y; }
    }
    save();
  }
  const root = roomDrag.kind === 'accessory' ? $('#roomPetArt') : $('#roomScene');
  const selector = roomDrag.kind === 'accessory' ? '[data-room-accessory]' : '[data-room-decor]';
  [...(root?.querySelectorAll(selector) || [])].find(node => node.dataset.roomAccessory === roomDrag.id || node.dataset.roomDecor === roomDrag.id)?.classList.remove('dragging');
  roomDrag = null;
}
$('#roomWrap').addEventListener('pointerup', finishRoomDrag);
$('#roomWrap').addEventListener('pointercancel', finishRoomDrag);
window.addEventListener('pagehide', () => finishRoomDrag());
$('#roomWrap').addEventListener('keydown', event => {
  const pet = event.target.closest('[data-room-pet]');
  if (pet && !event.target.closest('[data-room-accessory]') && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault(); $('#roomBubble').textContent = pick([`${petName()}: I love my room!`, `${petName()}: Look what I can do!`, `${petName()}: This is my favorite place!`]); sfx('good'); return;
  }
  const wearable = event.target.closest('[data-room-accessory]');
  if (wearable && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); roomWear(wearable.dataset.roomAccessory); return; }
  const button = event.target.closest('[data-room-decor],[data-room-accessory]');
  const delta = {ArrowLeft:[-3,0],ArrowRight:[3,0],ArrowUp:[0,-3],ArrowDown:[0,3]}[event.key];
  if (!button || !delta) return;
  event.preventDefault();
  if (button.dataset.roomAccessory) {
    const accessory = ACCESSORIES.find(item => item.id === button.dataset.roomAccessory); if (!accessory) return;
    const point = accessoryPoint(accessory);
    S.accessoryPositions[button.dataset.roomAccessory] = {x:Math.max(5, Math.min(95, point.x + delta[0])), y:Math.max(5, Math.min(95, point.y + delta[1]))};
  } else {
    const item = S.room.placements.find(place => place.id === button.dataset.roomDecor); if (!item) return;
    item.x = Math.max(4, Math.min(96, item.x + delta[0])); item.y = Math.max(8, Math.min(88, item.y + delta[1]));
  }
  const id = button.dataset.roomAccessory || button.dataset.roomDecor;
  save(); renderPetRoom(); [...$('#roomScene').querySelectorAll('[data-room-decor],[data-room-accessory]')].find(node => node.dataset.roomAccessory === id || node.dataset.roomDecor === id)?.focus();
});
$('#roomWrap').addEventListener('click', event => {
  if (event.target.closest('[data-room-accessory]')) return;
  const pet = event.target.closest('[data-room-pet]');
  if (pet) { $('#roomBubble').textContent = pick([`${petName()}: I love my room!`, `${petName()}: Look what I can do!`, `${petName()}: This is my favorite place!`]); sfx('good'); return; }
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.roomRemove) {
    S.room.placements = S.room.placements.filter(place => place.id !== button.dataset.roomRemove);
    save(); renderPetRoom(); sfx('tick'); return;
  }
  if (button.dataset.roomAdd) {
    const id = button.dataset.roomAdd;
    if (!(S.decor.includes(id) || S.room.items.includes(id)) || S.room.placements.some(item => item.id === id)) return;
    const point = roomPoint(S.room.placements.length); S.room.placements.push({id, ...point}); save(); renderPetRoom(); return;
  }
  if (button.dataset.roomBuy) { roomObtainAccessory(button.dataset.roomBuy); return; }
  if (button.dataset.roomClaim) { roomObtainAccessory(button.dataset.roomClaim); return; }
  if (button.dataset.roomWear) roomWear(button.dataset.roomWear);
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
  const hood = currentHood(), selectedSubject = subjectsIn(hood).some(subject => subject.id === viewSubject) ? viewSubject : null;
  let h = hoodSwitchHTML();
  if (!selectedSubject) {
    h += `<div class="class-heading"><h2>${esc(NEIGHBORHOODS.find(n => n.id === hood)?.name || 'Grade')} classes</h2></div><div class="class-grid">`;
    subjectsIn(hood).forEach(subject => {
      const units = buildingsInClass(hood, subject.id), open = units.filter(unit => unitOpen(unit.id)).length;
      h += `<button type="button" class="tile class-tile" data-class="${subject.id}"><span class="te">${subject.emoji}</span><span class="tn">${esc(subject.name)}</span><span class="tu">${units.length} units · ${open} open</span></button>`;
    });
    h += '</div>';
  } else {
    const subject = SUBJECTS.find(item => item.id === selectedSubject);
    h += `<div class="class-heading"><button type="button" class="btn small" data-class-back>All classes</button><h2>${subject?.emoji || ''} ${esc(subject?.name || selectedSubject)}</h2></div>`;
    h += worldMapHTML(hood, selectedSubject);
    buildingsInClass(hood, selectedSubject).forEach(b => {
      const rewards = REWARDS.filter(r => r.unit === b.id), owned = rewards.filter(owns).length;
      const open = unitOpen(b.id);
      const stickers = open && rewards.length ? `<span class="tile-stickers" aria-label="${owned} of ${rewards.length} stickers">${rewards.map(r => `<i class="${owns(r) ? 'filled' : ''}" title="${esc(r.name)}"></i>`).join('')}</span>` : '';
      const progress = open && rewards.length ? `<span class="tile-collection">${owned}/${rewards.length}</span>${stickers}` : '';
      h += open
        ? `<button class="tile" data-open="${b.id}"><span class="te">${b.emoji}</span><span class="tn">${esc(b.name)}</span><span class="tu">${esc(b.unit)}</span>${progress}</button>`
        : `<div class="tile locked" aria-disabled="true"><span class="te">${b.emoji}</span><span class="tn">${esc(b.name)}</span><span class="tu">${esc(b.unit)}</span>${progress}<span class="soon">${b.open ? `🔒 Pass the ${prevBuilding(b.id)?.name || 'last'} Unit Test` : 'Opening soon'}</span></div>`;
    });
  }
  h += `<button class="tile service" data-open="sprint"><span class="te">⚡</span><span class="tn">Sprint Track</span><span class="tu">${S.power > 1 ? 'Tips powered up ×' + fmtPow(S.power) : '60-second times tables'}</span></button>`;
  h += `<button class="tile service" data-open="room"><span class="te">🏠</span><span class="tn">My Pet Room</span><span class="tu">${S.room.initialized ? S.room.placements.length : S.displayed.filter(Boolean).length} decorations · Dress-up</span></button>`;
  const bookNew = REWARDS.some(reward => owns(reward) && !S.seenCollection.includes(reward.id));
  h += `<button class="tile service" data-open="book"><span class="tile-new" ${bookNew ? '' : 'hidden'}>New!</span><span class="te">🛍️</span><span class="tn">Pet Shop & Sticker Book</span><span class="tu">${REWARDS.filter(owns).length} stickers filled</span></button>`;
  h += `<button class="tile service" data-open="hall"><span class="te">🏛️</span><span class="tn">Town Hall</span><span class="tu">Backups and progress</span></button>`;
  const arcade = arcadePolicy();
  h += arcade.enabled || arcade.freePlay
    ? `<button class="tile service" data-open="arcade"><span class="te">🕹️</span><span class="tn">Arcade</span><span class="tu">${arcade.freePlay ? 'Free Play' : S.arcade.tickets + ' arcade tickets'}</span></button>`
    : `<button class="tile service locked" data-open="arcade" aria-disabled="true"><span class="te">🕹️</span><span class="tn">Arcade</span><span class="tu">Closed by your teacher</span><span class="soon">🔒</span></button>`;
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
  const classBack = e.target.closest('[data-class-back]'); if (classBack) { viewSubject = null; renderHome(); return; }
  const classTile = e.target.closest('[data-class]'); if (classTile) { viewSubject = classTile.dataset.class; sfx('tick'); renderHome(); return; }
  const hood = e.target.closest('[data-hood]'); if (hood) { viewHood = hood.dataset.hood; viewSubject = null; sfx('tick'); renderHome(); const t = $(`#town [data-hood="${viewHood}"]`); if (t) t.focus(); return; }
  const b = e.target.closest('[data-open]'); if (!b) return;
  const id = b.dataset.open;
  if (SHOPS[id] && unitOpen(id)) {
    currentShop = id;
    void Backend.refreshSettings().then(() => { if (currentShop === id && !$('#scr-cafe').hidden && !shift) show('cafe'); });
    show('cafe');
  }
  else if (id === 'sprint') openSprint();
  else if (id === 'room') show('room');
  else if (id === 'elaNouns' || id === 'elaVerbs') { show('library'); renderEnglishUnit(id === 'elaVerbs' ? 'verbs' : 'nouns'); }
  else if (HISTORY_BUILDING_COURSE[id]) { show('library'); renderEnglishUnit(HISTORY_BUILDING_COURSE[id]); }
  else if (id === 'shop') show('book');
  else if (id === 'book') show('book');
  else if (id === 'hall') { renderHall(); show('hall'); }
  else if (id === 'arcade') void openArcade();
});

const ENGLISH_UNIT1 = [
  {id:'identifyNouns', group:'Introduction to nouns', lesson:'Nouns name people, places, things, and ideas. A noun can be singular (one) or plural (more than one).', name:'Identifying nouns'},
  {id:'singularPlural', group:'Introduction to nouns', lesson:'Most nouns form a plural with -s or -es. Some spelling patterns change when a noun becomes plural.', name:'Singular and plural nouns'},
  {id:'commonProper', group:'Types of nouns', lesson:'Common nouns name general people, places, or things. Proper nouns name a specific one and begin with a capital letter.', name:'Common and proper nouns'},
  {id:'concreteAbstract', group:'Types of nouns', lesson:'Concrete nouns can be experienced with the senses. Abstract nouns name ideas, feelings, or qualities.', name:'Concrete and abstract nouns'},
  {id:'fToVes', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'Some nouns ending in f or fe change to -ves in the plural.', name:'Irregular plural nouns: f to -ves plurals'},
  {id:'enPlurals', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'A few nouns form their plural with -en or another special ending.', name:'Irregular plural nouns: -en plurals'},
  {id:'basePlurals', group:'Irregular plural nouns: base plurals and irregular endings', lesson:'Some nouns use the same form for one and for more than one.', name:'Irregular plural nouns: the base plural'},
  {id:'mutantPlurals', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Some plurals change the inside of the word instead of adding an ending.', name:'Irregular plural nouns: mutant plurals'},
  {id:'foreignPlurals', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Some nouns borrowed from other languages keep a plural form from that language.', name:'Irregular plural nouns: foreign plurals'},
  {id:'pluralReview', group:'Irregular plural nouns: mutant and foreign plurals', lesson:'Review regular and irregular plural patterns, including words that change or stay the same.', name:'Irregular plural nouns review'}
];
const ENGLISH_GROUPS = [
  {id:'intro', name:'Introduction to nouns', learn:'Nouns name people, places, things, and ideas. Practice spotting nouns and choosing singular or plural forms.', skills:['identifyNouns','singularPlural']},
  {id:'types', name:'Types of nouns', learn:'Sort nouns by what they name: general or specific, tangible or abstract.', skills:['commonProper','concreteAbstract']},
  {id:'irregularBase', name:'Irregular plural nouns: base plurals and irregular endings', learn:'Explore plurals that change their spelling, add unusual endings, or stay the same.', skills:['fToVes','enPlurals','basePlurals']},
  {id:'irregularForeign', name:'Irregular plural nouns: mutant and foreign plurals', learn:'Practice internal vowel changes, borrowed plurals, and mixed review.', skills:['mutantPlurals','foreignPlurals','pluralReview']}
];
const ENGLISH_UNIT2 = [
  {id:'verbIdentify',name:'Identifying verbs',lesson:'Verbs show actions or states of being.'},
  {id:'verbAgreement',name:'Introduction to verb agreement',lesson:'A verb agrees with its subject in number: singular subjects use singular verbs, and plural subjects use plural verbs.'},
  {id:'verbTense',name:'Introduction to verb tense',lesson:'Verb tense locates an action in the present, past, or future.'},
  {id:'actionLinkHelping',name:'Action, linking, and helping verbs',lesson:'Action verbs show what a subject does; linking verbs connect a subject to a description; helping verbs work with a main verb.'},
  {id:'irregularVerbs',name:'Irregular verbs',lesson:'Irregular verbs form their past tense in ways that do not follow the usual -ed pattern.'},
  {id:'simpleAspect',name:'Simple verb aspect',lesson:'Simple aspect presents an action as a fact, habit, or completed event.'},
  {id:'progressiveAspect',name:'Progressive verb aspect',lesson:'Progressive aspect uses a form of be plus an -ing verb to show an ongoing action.'},
  {id:'perfectAspect',name:'Perfect verb aspect',lesson:'Perfect aspect uses have plus a past participle to connect an action to another time.'},
  {id:'perfectProgressive',name:'Perfect progressive verb aspect',lesson:'Perfect progressive uses have, been, and an -ing verb to show an ongoing action over time.'},
  {id:'tenseAspectTime',name:'Managing time with tense and aspect',lesson:'Choose tense and aspect to show when an action happens and how it relates to another event.'},
  {id:'modalVerbs',name:'Modal verbs',lesson:'Modal verbs such as can, might, and must express ability, possibility, or necessity.'}
];
const ENGLISH_GROUPS2 = [
  {id:'foundation',quizName:'Quiz 1',name:'Introduction to verbs, tense, linking and helping verbs',learn:'Identify verbs, match verbs to their subjects, and recognize tense and verb types.',skills:['verbIdentify','verbAgreement','verbTense','actionLinkHelping']},
  {id:'irregular',quizName:'Irregular verbs Quiz',name:'Irregular verbs',learn:'Practice past-tense verbs that do not use the regular -ed ending.',skills:['irregularVerbs']},
  {id:'aspect',quizName:'Verb aspect Quiz',name:'Verb aspect: simple, progressive, and perfect',learn:'Compare simple, progressive, and perfect forms.',skills:['simpleAspect','progressiveAspect','perfectAspect']},
  {id:'aspectModal',quizName:'Aspect and modal verbs Quiz',name:'Verb aspect and modal verbs',learn:'Use perfect progressive aspect to manage time and choose modal verbs for meaning.',skills:['perfectProgressive','tenseAspectTime','modalVerbs']}
];
const VERB_QUESTIONS = {
  verbIdentify:(c) => [
    {prompt:`For a sentence about ${c.name} in ${c.place}, which word is a verb?`,options:[c.name,'explores','quietly','near'],answer:1},
    {prompt:`Your chapter notes mention “${c.action}.” Which word below is an action verb?`,options:['curious','discovers','beside','gentle'],answer:1},
    {prompt:`Which word is the verb in “${c.name} feels joy after the conflict”?`,options:[c.name,'feels','joy','conflict'],answer:1},
    {prompt:`Which word tells what the character does in “${c.name} searches near ${c.place}”?`,options:['near','searches',c.name,c.place],answer:1}
  ],
  verbAgreement:(c) => [
    {prompt:`The main character ___ near ${c.place}.`,options:['walk','walks','walking','have walked'],answer:1},
    {prompt:`The characters ___ together when ${c.conflict} begins.`,options:['plans','plan','planning','was plan'],answer:1},
    {prompt:`A character and a friend ___ the clue.`,options:['finds','find','finding','has find'],answer:1},
    {prompt:`The joy in the chapter ___ the character hopeful.`,options:['make','makes','making','were make'],answer:1}
  ],
  verbTense:(c) => [
    {prompt:`A summary describes a finished event: “${c.name} ___ the clue.”`,options:['finds','found','will find','is finding'],answer:1},
    {prompt:`The chapter is happening now: “${c.name} ___ near ${c.place}.”`,options:['walked','walks','will walked','has walks'],answer:1},
    {prompt:`The character plans for tomorrow: “${c.name} ___ the note.”`,options:['reads yesterday','read now','will read','has read yesterday'],answer:2},
    {prompt:`Which sentence is in the past tense?`,options:[`${c.name} notices the clue.`,`${c.name} noticed the clue.`,`${c.name} will notice the clue.`,`${c.name} is noticing the clue.`],answer:1}
  ],
  actionLinkHelping:(c) => [
    {prompt:`In “${c.name} searches near ${c.place},” which word is the action verb?`,options:[c.name,'searches','near',c.place],answer:1},
    {prompt:`In “${c.name} feels hopeful,” which verb links the character to a description?`,options:[c.name,'feels','hopeful','the'],answer:1},
    {prompt:`In “${c.name} has found a clue,” which word helps the main verb?`,options:[c.name,'has','found','clue'],answer:1},
    {prompt:`Which sentence uses a linking verb?`,options:[`${c.name} runs toward ${c.place}.`,`${c.name} seems joyful.`,`${c.name} has found a clue.`,`${c.name} will search.`],answer:1}
  ],
  irregularVerbs:(c) => [
    {prompt:`Yesterday, ${c.name} ___ a clue.`,options:['finded','found','finds','finding'],answer:1},
    {prompt:`In the past, the characters ___ the map.`,options:['saw','seed','seeing','sees'],answer:0},
    {prompt:`Choose the correct past tense: “The character ___ a letter.”`,options:['writed','wrote','written yesterday','writes yesterday'],answer:1},
    {prompt:`After ${c.conflict}, ${c.name} ___ the book home.`,options:['taked','took','taking','takes yesterday'],answer:1}
  ],
  simpleAspect:(c) => [
    {prompt:`Which sentence uses simple present aspect?`,options:[`${c.name} is reading near ${c.place}.`,`${c.name} reads near ${c.place}.`,`${c.name} has read near ${c.place}.`,`${c.name} will be reading near ${c.place}.`],answer:1},
    {prompt:`A completed chapter event is summarized in simple past:`,options:[`${c.name} was finding a clue.`,`${c.name} found a clue.`,`${c.name} has found a clue.`,`${c.name} will find a clue.`],answer:1},
    {prompt:`Which verb phrase shows a regular habit?`,options:[`${c.name} searched once.`,`${c.name} searches each morning.`,`${c.name} has been searching.`,`${c.name} will search later.`],answer:1},
    {prompt:`Choose the simple future form.`,options:[`${c.name} finds the path.`,`${c.name} found the path.`,`${c.name} will find the path.`,`${c.name} has found the path.`],answer:2}
  ],
  progressiveAspect:(c) => [
    {prompt:`The action is happening right now: “${c.name} ___ near ${c.place}.”`,options:['searches','is searching','has searched','will search'],answer:1},
    {prompt:`Which phrase uses progressive aspect?`,options:['noticed the clue','has noticed the clue','was noticing the clue','will notice the clue'],answer:2},
    {prompt:`The characters are in the middle of discussing ${c.conflict}.`,options:['discuss','discussed','are discussing','have discussed'],answer:2},
    {prompt:`Choose the present progressive form.`,options:['they explore','they explored','they are exploring','they have explored'],answer:2}
  ],
  perfectAspect:(c) => [
    {prompt:`Which sentence uses present perfect aspect?`,options:[`${c.name} finds a clue.`,`${c.name} found a clue.`,`${c.name} has found a clue.`,`${c.name} is finding a clue.`],answer:2},
    {prompt:`The character finished searching before another event.`,options:['has been searching','had searched','is searching','will search'],answer:1},
    {prompt:`Choose the phrase with have + past participle.`,options:['is reading','read yesterday','has read','will read'],answer:2},
    {prompt:`Which sentence connects a past action to now?`,options:[`${c.name} searched yesterday.`,`${c.name} is searching now.`,`${c.name} has searched the room.`,`${c.name} will search later.`],answer:2}
  ],
  perfectProgressive:(c) => [
    {prompt:`${c.name} began searching earlier and is still searching:`,options:['has searched','has been searching','is searched','will search'],answer:1},
    {prompt:`Which phrase uses have + been + an -ing verb?`,options:['had found','has been looking','is looking','will have looked'],answer:1},
    {prompt:`The characters started discussing ${c.conflict} an hour ago and continue now.`,options:['discussed','have been discussing','will discuss','are discussed'],answer:1},
    {prompt:`Choose the past perfect progressive form.`,options:['had been waiting','has waited','was waiting','will have waited'],answer:0}
  ],
  tenseAspectTime:(c) => [
    {prompt:`The character began reading before the conflict started and continued until then.`,options:['reads','is reading','had been reading','will read'],answer:2},
    {prompt:`Which sentence clearly shows an action that will be ongoing at a future time?`,options:[`${c.name} will be reading at noon.`,`${c.name} read at noon.`,`${c.name} has read at noon.`,`${c.name} reads yesterday.`],answer:0},
    {prompt:`The notes describe an action completed before another past event.`,options:['has found','had found','is finding','will find'],answer:1},
    {prompt:`Which time word best fits “${c.name} ___ the clue already”?`,options:['tomorrow','yesterday before','has found','next week'],answer:2}
  ],
  modalVerbs:(c) => [
    {prompt:`Which modal shows ability? “${c.name} ___ solve the puzzle.”`,options:['can','was','has','does'],answer:0},
    {prompt:`Which modal shows possibility? “The clue ___ be near ${c.place}.”`,options:['might','did','has','is'],answer:0},
    {prompt:`Which modal shows a strong requirement?`,options:['could','might','must','would'],answer:2},
    {prompt:`Choose a modal that politely asks permission.`,options:['May I read the note?','I read the note.','I have read the note.','I am reading the note.'],answer:0}
  ]
};
const HISTORY_UNIT1 = [
  {id:'historyStories',name:'History Stories',lesson:'Compare the stories people tell about the past. Different starting points and perspectives shape what a history includes.'},
  {id:'historyScale',name:'History of Many Shapes and Sizes',lesson:'Switch scale to study local details or wider patterns, and test claims against evidence.',url:'https://www.khanacademy.org/humanities/world-history/x66f79d8a:origins-of-history/x66f79d8a:history-of-many-shapes-and-sizes-1-2/a/activity-opener-what-is-world-history-zooming-out'},
  {id:'historyFrames',name:'History Frames',lesson:'Use frames such as communities, networks, and production and distribution to focus a historical question.'},
  {id:'historyMemory',name:'History and Memory',lesson:'Assess historical narratives by examining evidence, memory, and multiple accounts.'}
];
const HISTORY_GROUPS = [
  {id:'stories',name:'History Stories | 1.1',quizName:'History Stories Quiz',learn:'Where does history begin? Compare starting points and perspectives; distinguish a historical story from the evidence used to support it.',skills:['historyStories'],quizSkills:['historyStories','historyScale'],extraLessons:[HISTORY_UNIT1[1]]},
  {id:'frames',name:'History Frames | 1.3',quizName:'History Frames Quiz',learn:'Explore communities, expanding and contracting networks, and how production and distribution shape societies.',skills:['historyFrames']},
  {id:'memory',name:'History and Memory | 1.4',quizName:'History and Memory Quiz',learn:'Assess narratives by comparing evidence, collective memory, and whose accounts are preserved.',skills:['historyMemory']}
];
const HISTORY_QUESTIONS = {
  historyStories:[
    {prompt:'Two communities tell different stories about the same event. What is a useful first step?',options:['Choose the older story automatically.','Compare each account’s perspective and supporting evidence.','Assume both accounts describe every detail.','Ignore the community that left fewer written records.'],answer:1},
    {prompt:'A historian finds a letter written by someone who witnessed an event. What can the letter show?',options:['One person’s perspective and some evidence about the event.','Every person’s experience of the event.','That the writer’s memory is perfectly accurate.','That no other sources are needed.'],answer:0},
    {prompt:'Why can histories of the same place begin at different points?',options:['A different starting point can highlight different people, changes, or questions.','Only one starting point is allowed in history.','The earliest date is always the most important.','Starting points change what actually happened.'],answer:0},
    {prompt:'Which statement is the best-supported historical claim?',options:['Everyone remembers the event the same way.','This source proves every detail about the past.','Several sources describe the change, though they emphasize different experiences.','One account is true because it is the longest.'],answer:2}
  ],
  historyScale:[
    {prompt:'A historian studies one family’s experience of migration. Which scale is this?',options:['A close, local scale.','A global scale only.','A century-wide scale only.','A comparison with no people.'],answer:0},
    {prompt:'What can “zooming out” help a historian notice?',options:['Patterns connecting many places or communities.','The exact thoughts of one person.','Details that no source records.','That local experiences do not matter.'],answer:0},
    {prompt:'A claim says a trade route changed many communities. What is a strong way to test it?',options:['Look for evidence from multiple connected places.','Use one object and assume it explains everything.','Ignore evidence that does not fit.','Ask only whether the route was long.'],answer:0},
    {prompt:'Why might a historian switch between close-up and wide views?',options:['Different scales reveal different details and patterns.','One scale makes all evidence unnecessary.','Wide views always prove local causes.','Close views cannot include evidence.'],answer:0}
  ],
  historyFrames:[
    {prompt:'A historian asks how families and villages formed shared practices. Which frame fits best?',options:['Communities.','Networks.','Production and distribution.','Weather only.'],answer:0},
    {prompt:'A historian traces how ideas and goods moved between places. Which frame fits best?',options:['Communities.','Networks.','One person’s daily routine only.','A list of rulers only.'],answer:1},
    {prompt:'A historian studies who made goods and how they reached other people. Which frame fits best?',options:['Production and distribution.','Collective memory only.','A single battle only.','A family tree only.'],answer:0},
    {prompt:'How can a frame help when studying a complex event?',options:['It focuses attention on one useful set of details and questions.','It guarantees one complete explanation.','It removes the need to compare sources.','It makes every other perspective incorrect.'],answer:0}
  ],
  historyMemory:[
    {prompt:'What is collective memory?',options:['Ways a group remembers and tells stories about its past.','A list of dates that never changes.','A source that is always unbiased.','A record written by only one historian.'],answer:0},
    {prompt:'Why compare a remembered story with other evidence?',options:['To understand what it reveals and where accounts differ or are incomplete.','To prove memories are useless.','To make all accounts identical.','To avoid asking who created a source.'],answer:0},
    {prompt:'A new artifact disagrees with a familiar account. What should historians do?',options:['Examine the artifact and compare it with other evidence.','Discard it because the old story is familiar.','Change the artifact to fit the account.','Assume disagreement makes all history unknowable.'],answer:0},
    {prompt:'Which question helps assess a historical narrative?',options:['Who preserved this account, and whose experiences are missing?','Is this the only story I have heard?','Does the narrative avoid all disagreement?','Can I memorize it without checking evidence?'],answer:0}
  ]
};
const isHistoryCourse = id => id === 'history' || id === 'history2' || id === 'history3' || id === 'history4';
const HISTORY_BUILDING_COURSE = {histOrigins:'history',histEarly:'history2',histAgrarian:'history3',histEmpires:'history4',bioChem:'bio1'};
const isScienceCourse = id => id === 'bio1';
const isProjectCourse = id => isHistoryCourse(id) || isScienceCourse(id);
const progressStore = id => isHistoryCourse(id) ? S.historyProgress : isScienceCourse(id) ? S.scienceProgress : S.elaProgress;
const projectStore = key => String(key).startsWith('history') ? S.historyProjects : S.scienceProjects;
const projectKeys = id => [id, `${id}lab`].filter(key => HISTORY_PROJECTS[key]);
const mc = (prompt, correct, ...wrong) => ({prompt, options:[correct, ...wrong], answer:0});
const HISTORY_UNIT3 = [
  {id:'villageNetworks',name:'Foragers and Village Networks | 3.2',lesson:'Early farming villages were small but connected through networks, and interacted with foragers, herders, and nomads.'},
  {id:'firstCities',name:'The First Cities, States, and Empires | 3.3',lesson:'As agriculture spread, villages grew into cities that linked into powerful states and complex networks.'},
  {id:'tradeNetworks',name:'Ancient Trade Networks | 3.4',lesson:'Local networks were more common, but long-distance trade also linked societies across Afro-Eurasia and the Americas.'},
  {id:'mesopotamia',name:'Ancient Mesopotamia | 3.6',lesson:'Farming, cities, writing, laws, and religion shaped one of the earliest complex societies.'},
  {id:'shangChina',name:'Shang Dynasty China | 3.7',lesson:'The Shang used farming, bronze technology, writing, ancestor worship, and political power to build an early agrarian society.'},
  {id:'egyptNubia',name:'Nubia and Ancient Egypt | 3.8',lesson:'The Nile shaped Nubia and ancient Egypt, and the two societies influenced one another.'},
  {id:'earlyAmericas',name:'Ancient Americas | 3.10',lesson:'Early societies in Mesoamerica, South America, and North America adapted to different environments and built complex communities, such as the Olmec and Chavín de Huantar.'},
  {id:'ancientIndia',name:'Indus River Valley | 3.11',lesson:'People in the Indus River Valley built organized cities and trade networks; historians rely on archaeological evidence because the society left few readable written records.'},
  {id:'earlyAgrarian',name:'Early Agrarian Societies in Context | 3.12',lesson:'Compare similarities and differences among early agrarian societies to see how geographic context influenced their development.'}
];
const HISTORY3_LEARN_ONLY = {villageNetworks:[{name:'Cities, Societies, and Empires | 3.1',lesson:'Small groups grew into large, complex societies, states, and empires that shaped life inside and beyond them.'}], mesopotamia:[{name:'Early Agrarian Societies | 3.5',lesson:'Complex agricultural societies emerged independently in different regions, each shaped by its geography, climate, and resources.'}], earlyAmericas:[{name:'Aksum and Nok Society | 3.9',lesson:'Aksum and Nok society show the diversity of early African agrarian societies through trade, technology, culture, and regional connections.'}]};
const HISTORY_GROUPS3 = HISTORY_UNIT3.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id],extraLessons:HISTORY3_LEARN_ONLY[skill.id]}));
const HISTORY3_QUESTIONS = {
  villageNetworks:[
    mc('Early farming villages were small. How were they connected to others?','Through networks of exchange and communication','They were completely isolated','Only through written laws','Only through large empires'),
    mc('Which groups did farming villages interact with?','Foragers, herders, and nomads','Only other farmers','No outsiders','Only rulers of empires'),
    mc('Why might a village trade with herders?','They could exchange different goods and resources','Herders never traded','Villages produced nothing','Trade was impossible without writing'),
    mc('What does a village network help historians see?','That small communities were part of wider connections','That villages never changed','That all people lived the same way','That cities appeared first')
  ],
  firstCities:[
    mc('What happened as agriculture spread and intensified?','Communities grew and some villages became cities','All people returned to foraging','Cities disappeared','Trade stopped'),
    mc('What is a state?','A political organization that governs a territory and people','A single farming tool','A type of crop','A small family group'),
    mc('How did linked cities form powerful states?','Through connections such as trade, leadership, and shared institutions','By avoiding all contact','By staying separate villages','By ending farming'),
    mc('Which change is most connected to growing cities?','More people living together and more complex societies','Smaller and simpler communities','Less need for organization','No new leadership')
  ],
  tradeNetworks:[
    mc('Which kind of trade network was more common in the ancient world?','Local networks','Global airline routes','Only ocean liners','Digital markets'),
    mc('Long-distance trade linked societies across which regions?','Afro-Eurasia and the Americas','Only one village','Only Antarctica','Only one river valley'),
    mc('Why might a society want goods from far away?','They might lack certain resources or want valued items','Distant goods were always identical to local ones','Trade prevented all contact','Only rulers could use goods'),
    mc('What can trade goods found far from their source suggest?','Connections between distant communities','That the goods fell from the sky','That no one traveled','That trade never happened')
  ],
  earlyAgrarian:[
    mc('Why did complex agrarian societies develop in different ways?','Geographic context shaped their resources and choices','All used identical resources','Climate never mattered','They never farmed'),
    mc('What is a good way to compare Mesopotamia, Egypt, the Indus Valley, and Shang China?','Identify similarities and differences in farming, cities, and trade','Assume they were the same','Compare only their names','Ignore their environments'),
    mc('Which is a similarity among several early agrarian societies?','Farming supported growing communities','None used farming','All had identical rulers','All were in the same place'),
    mc('Why is context important when studying a society?','It helps explain why events and choices happened','It makes evidence unnecessary','It proves every society was equal in size','It removes differences between regions')
  ],
  mesopotamia:[
    mc('Mesopotamia developed between which rivers?','The Tigris and Euphrates','The Nile and Congo','The Mississippi and Amazon','The Rhine and Danube'),
    mc('Which development helped Mesopotamian governments and trade keep records?','Writing','Telephones','Printing presses','Airplanes'),
    mc('What did early law codes help do in complex societies?','Set rules for behavior and settle disputes','Replace all farming','Prevent writing','End trade'),
    mc('How did religion shape Mesopotamian cities?','Temples and beliefs were central to community life','Cities had no beliefs','Religion banned cities','Temples were unrelated to leaders')
  ],
  shangChina:[
    mc('Which technology was important to the Shang Dynasty?','Bronze','Steel skyscrapers','Plastic','Electricity'),
    mc('What did Shang ancestor worship involve?','Honoring ancestors in religious practice','Ignoring family history','Banning ceremonies','Worshiping only machines'),
    mc('What kind of Shang writing evidence do historians study?','Inscriptions on bones and bronze','Digital files','Printed newspapers','Typewritten letters'),
    mc('How did political power support Shang society?','Rulers organized people, resources, and religion','Rulers had no role','Everyone governed separately','Farming was unnecessary')
  ],
  egyptNubia:[
    mc('Which river shaped ancient Egypt and Nubia?','The Nile','The Yangtze','The Rhine','The Seine'),
    mc('Why was the Nile important for farming?','Its flooding and water supported crops','It froze every year','It removed all soil','It had no effect'),
    mc('How are Nubia and Egypt best described?','Neighboring societies that influenced each other','Societies with no contact','One society that never changed','Societies on different continents with no trade'),
    mc('Which evidence could show influence between Nubia and Egypt?','Shared artifacts, trade, and political contact','A modern map only','A single unlabeled rock','Nothing could show it')
  ],
  earlyAmericas:[
    mc('Which early society in Mesoamerica is often studied with this unit?','The Olmec','The Shang','The Sumerians','The Hittites'),
    mc('Chavín de Huantar was located in which region?','The Andes of South America','The Nile Valley','Mesopotamia','The Arctic'),
    mc('Why did early American societies differ by region?','They adapted to different environments and resources','All regions were identical','They had no farms','Geography did not matter'),
    mc('How can historians learn about early American societies?','By studying artifacts, buildings, and other evidence','Only from modern novels','Only from one written law','They cannot study them')
  ],
  ancientIndia:[
    mc('Which river valley hosted early cities in South Asia?','The Indus','The Rhine','The Mississippi','The Seine'),
    mc('What is notable about many Indus Valley cities?','Planned layouts and drainage systems','No streets','No buildings','No trade'),
    mc('What are Indus seals and traded goods evidence of?','Trade networks and record-keeping practices','Modern computers','Only farming tools','A fully translated law code'),
    mc('How do historians study a society that left few readable written records?','By analyzing archaeological evidence such as buildings and artifacts','By guessing without evidence','By ignoring the society','By using only modern newspapers')
  ]
};
const HISTORY_UNIT2 = [
  {id:'earliestHumans',name:'The Earliest Humans | 2.1',lesson:'For most of human history people foraged. About 12,000 years ago some began farming, starting the Neolithic Revolution.'},
  {id:'migrationArt',name:'Migration and Art | 2.2',lesson:'Homo sapiens began in Africa and later migrated to other regions, leaving art and other evidence long before writing.'},
  {id:'foragingSocieties',name:'Foraging Societies | 2.3',lesson:'Foraging required deep knowledge and skill, supported by communities and networks.'},
  {id:'agriculturalRevolution',name:'The Agricultural Revolution | 2.4',lesson:'The move from foraging to agriculture laid the foundation for the first agricultural societies, with advantages and disadvantages.'},
  {id:'biggestMistake',name:'The Biggest Mistake Humans Ever Made? | 2.5',lesson:'Farming changed diets, communities, lifestyles, networks, and production and distribution, with lasting consequences.'}
];
const HISTORY_GROUPS2 = HISTORY_UNIT2.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id]}));
const HISTORY2_QUESTIONS = {
  earliestHumans:[
    {prompt:'For most of the 250,000 years of our species’ history, how did people mainly live?',options:['As foragers','As city dwellers','As factory workers','As farmers'],answer:0},
    {prompt:'About how long ago did some people begin experimenting with farming?',options:['About 12,000 years ago','About 250 years ago','About 2,000 years ago','About 250,000 years ago'],answer:0},
    {prompt:'What is the Neolithic Revolution?',options:['The shift toward farming and settled life','The invention of the printing press','A war between empires','The first use of writing'],answer:0},
    {prompt:'Why compare life “then” and “now” when studying early humans?',options:['It reveals changes and continuities in how people live','It proves the past was identical to today','It removes the need for evidence','It shows foragers had no knowledge'],answer:0}
  ],
  migrationArt:[
    {prompt:'Where did Homo sapiens first develop?',options:['Africa','Antarctica','Australia only','North America'],answer:0},
    {prompt:'What can early human art tell historians?',options:['Clues about beliefs, skills, and communities, though not everything','The exact thoughts of every person','That writing already existed everywhere','Nothing, because art is not evidence'],answer:0},
    {prompt:'Early humans created art before writing existed. What does that show?',options:['People communicated and expressed ideas in ways other than writing','Only written sources are reliable','Early humans could not think symbolically','Art always shows daily meals'],answer:0},
    {prompt:'A historian finds paintings in a cave. What is the best next step?',options:['Compare them with other evidence about the people and place','Assume the paintings explain all of their culture','Ignore them because they have no words','Decide the artist’s exact name'],answer:0}
  ],
  foragingSocieties:[
    {prompt:'Foraging is also called:',options:['Hunting and gathering','Mining and trading','Planting and harvesting','Building and printing'],answer:0},
    {prompt:'Why did foraging require great knowledge?',options:['People needed to know plants, animals, seasons, and places','Food always stayed in one spot','Tools were never used','Communities never shared information'],answer:0},
    {prompt:'How did communities help foragers thrive?',options:['By sharing skills, knowledge, and support','By avoiding all cooperation','By storing food in factories','By depending on one person only'],answer:0},
    {prompt:'How could networks help foraging communities?',options:['They could exchange information, goods, and help','They prevented all movement','They made tools unnecessary','They ended communication'],answer:0}
  ],
  agriculturalRevolution:[
    {prompt:'What is agriculture?',options:['Growing crops and raising animals for food','Collecting wild food only','Traveling without settling','Trading written records'],answer:0},
    {prompt:'Which is an advantage of farming?',options:['It can produce more food in one place','It guarantees perfect health','It removes the risk of drought','It ends all conflict'],answer:0},
    {prompt:'Which is a possible disadvantage of early farming?',options:['Crops could fail and diets could become less varied','Nobody needed to plan ahead','Communities always became smaller','Tools disappeared'],answer:0},
    {prompt:'Why did farming lay a foundation for early agricultural societies?',options:['Reliable food supported settled communities','It made people stop using resources','It prevented trade','It required no cooperation'],answer:0}
  ],
  biggestMistake:[
    {prompt:'Which kinds of change did agriculture influence?',options:['Diet, communities, lifestyles, networks, and production','Only the weather','Only the length of days','Nothing beyond food'],answer:0},
    {prompt:'A claim says farming was “the biggest mistake.” What is the best way to test it?',options:['Compare evidence about benefits and costs for different people','Accept it because it sounds dramatic','Ignore all disadvantages','Use only one object as proof'],answer:0},
    {prompt:'Which statement shows the question has more than one side?',options:['Farming created new possibilities and new problems','Farming had no effects','Foraging never required skill','Everyone experienced agriculture the same way'],answer:0},
    {prompt:'Which frame is most useful for studying how food was made and shared?',options:['Production and distribution','Weather only','A single ruler','A battle map'],answer:0}
  ]
};
const HISTORY_UNIT4 = [
  {id:'portableBelief',name:'Portable Belief Systems | 4.2',lesson:'Portable belief systems travel with people, spreading along networks to new places and connecting diverse communities.'},
  {id:'hinduBuddhism',name:'Hinduism and Buddhism | 4.4',lesson:'Hinduism and Buddhism developed in South Asia; their ideas about duty, suffering, rebirth, and liberation shaped people\u2019s lives.'},
  {id:'judaismChristianity',name:'Judaism and Christianity | 4.5',lesson:'Judaism, Christianity, and Zoroastrianism developed in Southwest Asia and shaped later religious traditions and communities.'},
  {id:'islam',name:'Islam | 4.6',lesson:'Islam began in Arabia; the life of Muhammad and the early Muslim community shaped its core beliefs and spread.'},
  {id:'comparePortable',name:'Comparing Portable Belief Systems | 4.7',lesson:'Comparing portable belief systems helps explain why traditions spread across regions and connected diverse communities.'},
  {id:'persia',name:'Ancient Empires: Persians and Greeks | 4.9 \u00b7 Ancient Persia',lesson:'Persian rulers used political power, warfare, culture, and exchange to shape the ancient Mediterranean world.'},
  {id:'greece',name:'Ancient Empires: Persians and Greeks | 4.9 \u00b7 Classical Greece',lesson:'Greek, Macedonian, and Ptolemaic powers shaped the Mediterranean through politics, warfare, culture, and exchange.'},
  {id:'imperialChina',name:'Ancient Empires: Zhou and Qin | 4.11',lesson:'The Zhou and Qin dynasties developed new ideas about government, power, and social order that shaped later Chinese empires.'},
  {id:'compareEmpires',name:'Comparing Ancient Empires | 4.12',lesson:'Comparing empires shows different ways states expanded, governed diverse peoples, and justified their power.'},
  {id:'rome',name:'Ancient Empires: Rome and Han China | 4.13 \u00b7 Ancient Rome',lesson:'Roman rulers grew and maintained their empire through military power, roads, law, and administration.'},
  {id:'romeHan',name:'Ancient Empires: Rome and Han China | 4.13 \u00b7 Rome and Han China',lesson:'Comparing how Roman and Han rulers grew and maintained their empires.'},
  {id:'womenAncient',name:'Women in the Ancient World | 4.15',lesson:'The roles of women differed in ancient Rome and Han China.'}
];
const HISTORY4_LEARN_ONLY = {portableBelief:[{name:'Empires and Belief Systems | 4.1',lesson:'The rise of new empires and portable belief systems added complexity to human societies; belief systems and empires often helped each other spread.'}], hinduBuddhism:[{name:'Confucianism, Legalism, and Daoism | 4.3',lesson:'These traditions offered different answers about order, leadership, human nature, and how people should live.'}], comparePortable:[{name:'How Do Religions Grow and Change? | 4.8',lesson:'Belief systems transformed as they spread along networks.'}], imperialChina:[{name:'Ancient Empires: Mauryan and Gupta | 4.10',lesson:'The Mauryan and Gupta Empires built political power, supported religious and cultural change, and shaped life across South Asia.'}], womenAncient:[{name:'The Rise and Fall of Empires | 4.14',lesson:'Comparing the rise and fall of empires shows patterns of continuity and change in power, social organization, and belief systems.'}]};
const HISTORY_GROUPS4 = HISTORY_UNIT4.map(skill => ({id:skill.id,name:skill.name,learn:skill.lesson,skills:[skill.id],extraLessons:HISTORY4_LEARN_ONLY[skill.id]}));
const HISTORY4_QUESTIONS = {
  portableBelief:[
    mc('What makes a belief system \u201cportable\u201d?','It can travel with people to new places','It is tied to one temple only','It forbids travel','It exists only in laws'),
    mc('How did portable belief systems often spread?','Along trade and travel networks','Only through isolation','Only by farming','By avoiding contact'),
    mc('Why could portable belief systems connect diverse communities?','Shared beliefs and practices linked people across regions','They erased all differences','They required one language only','They stopped trade'),
    mc('Which is an example of a portable belief system?','Buddhism','A village boundary stone','A harvest tool','A trade price list')
  ],
  hinduBuddhism:[
    mc('Who founded Buddhism?','Siddhartha Gautama, the Buddha','Muhammad','Confucius','Cyrus'),
    mc('In Hinduism, what does dharma refer to?','Duty and the right way of living','A kind of trade good','A military rank','A city wall'),
    mc('What is the cycle of death and rebirth called?','Samsara','Mandate','Satrapy','Census'),
    mc('Which idea is central to Buddhism?','Ending suffering by following the Eightfold Path','Building roads','Honoring emperors as gods only','Avoiding all teaching')
  ],
  judaismChristianity:[
    mc('Judaism is known for belief in:','One God and a covenant with the Jewish people','Many city gods only','No sacred texts','Rule by emperors only'),
    mc('Christianity developed from the teachings about:','Jesus of Nazareth','Siddhartha Gautama','Confucius','Alexander'),
    mc('In which region did Judaism and Christianity develop?','Southwest Asia','Northern Europe','The Americas','Southeast Asia'),
    mc('What is the central sacred text of Judaism?','The Torah','The Quran','The Analects','The Vedas only')
  ],
  islam:[
    mc('Where did Islam begin?','Arabia','China','Rome','Mesoamerica'),
    mc('What is the Quran?','The sacred text of Islam','A Roman law code','A Chinese dynasty','A trade route'),
    mc('Who is regarded by Muslims as the Prophet who received revelations?','Muhammad','Augustus','Darius','Laozi'),
    mc('What are the Five Pillars of Islam?','Core practices of Muslim life','Five Roman roads','Five Greek cities','Five Chinese dynasties')
  ],
  comparePortable:[
    mc('Why compare portable belief systems?','To see similarities, differences, and why they spread','To prove they are identical','To ignore their histories','To avoid using evidence'),
    mc('Which is a similarity many portable belief systems share?','Teachings about how people should live and treat others','They all began in one city','They all rejected travel','They all lacked communities'),
    mc('What helped belief systems spread across regions?','Trade routes, travelers, and sometimes empires','Isolation','Closed borders only','Avoiding networks'),
    mc('Which claim is best supported by comparing belief systems?','Traditions changed as they spread to new regions','Traditions never changed','Only one tradition spread','Spread had no causes')
  ],
  persia:[
    mc('How did the Persian Empire govern its large territory?','Through provinces called satrapies','Through a single village','Without officials','By avoiding roads'),
    mc('What was the Royal Road used for?','Communication and travel across the empire','A farming ritual','A battle formation','A religious holiday'),
    mc('Persian rulers like Cyrus were known for:','Allowing conquered peoples to keep many customs','Banning all travel','Ending trade','Destroying every city'),
    mc('The Persian Empire founded by Cyrus is called the:','Achaemenid Empire','Han Empire','Gupta Empire','Aksumite Empire')
  ],
  greece:[
    mc('Many Greek communities were organized as:','City-states','One national government','Nomadic bands only','Provinces of Rome'),
    mc('Athens is known for developing:','An early form of democracy among citizens','A single emperor','Bronze oracle bones','The Mandate of Heaven'),
    mc('How did Alexander the Great spread Greek culture?','By conquering a large empire','By avoiding other lands','By closing trade','By ending the army'),
    mc('Sparta was known for:','A military-focused society','Having no army','A mostly written law code','Being part of Han China')
  ],
  imperialChina:[
    mc('What was the Mandate of Heaven?','The idea that rulers govern with approval that can be lost','A Roman road','A trade tax','A type of writing'),
    mc('How did the Qin unify China?','By standardizing laws, writing, and money','By giving up power','By ending government','By closing all cities'),
    mc('Which philosophy favored strict laws and punishments?','Legalism','Daoism','Buddhism','Christianity'),
    mc('Which dynasty came before the Qin and used the Mandate of Heaven?','The Zhou','The Gupta','The Ptolemaic','The Achaemenid')
  ],
  compareEmpires:[
    mc('Why compare ancient empires?','To see how states expanded, governed diverse peoples, and justified power','To prove all were identical','To avoid evidence','To ignore geography'),
    mc('Which is a way empires justified their power?','Claiming divine approval or successful leadership','Giving up all authority','Avoiding rules','Ignoring subjects'),
    mc('What helped empires govern diverse peoples?','Roads, officials, laws, and local arrangements','Isolation','No communication','Only farming tools'),
    mc('Which claim is best supported by comparing empires?','Empires used different methods to expand and govern','All empires acted the same way','Empires never changed','Power had no sources')
  ],
  rome:[
    mc('Who became the first Roman emperor?','Augustus','Cyrus','Qin Shi Huangdi','Asoka'),
    mc('What was the Pax Romana?','A long period of relative peace and stability','A Chinese philosophy','A trade tax','A religious text'),
    mc('What helped Rome control its territory?','Roads, legions, and law','Isolation','No army','Only farming'),
    mc('Rome began as a:','Republic','Dynasty ruled by the Qin','Satrapy','Caliphate')
  ],
  romeHan:[
    mc('Which philosophy did Han rulers promote in government?','Confucianism','Legalism only','Christianity','Zoroastrianism'),
    mc('What trade network helped connect Rome and Han China indirectly?','The Silk Road','The Royal Road only','The Mississippi','The Amazon'),
    mc('Which problem did both Rome and Han China face?','Governing large territories and defending borders','No need for rulers','No trade','No farmers'),
    mc('How did Han rulers staff their government?','With educated officials in a bureaucracy','With no officials','Only with foreign armies','Only with priests')
  ],
  womenAncient:[
    mc('In Han China, Confucian ideas often emphasized women\u2019s roles in:','The family and household hierarchy','Voting in assemblies','Leading all armies','Writing Roman laws'),
    mc('Elite Roman women could often:','Influence family affairs and manage property, but could not vote','Vote and hold every office','Have no family role','Govern the empire as consuls'),
    mc('Why compare women\u2019s roles in Rome and Han China?','To see how societies shaped opportunities and limits','To prove roles were identical','To avoid evidence','To ignore social class'),
    mc('Which statement is best supported?','Women\u2019s experiences differed by society and social class','Every woman had the same experience','Women left no influence','Evidence is unnecessary')
  ]
};
const BIO_UNIT1 = [
  {id:'cellsOrganisms',name:'Understand: Cells and organisms',lesson:'Cells are the basic unit of life. Cells form tissues, tissues form organs, organs form systems, and systems work together in an organism.'},
  {id:'cellPartsU',name:'Understand: Cell parts and functions',lesson:'Each cell part has a function, such as the nucleus directing the cell and mitochondria releasing energy.'},
  {id:'cellPartsA',name:'Apply: Cell parts and functions',lesson:'Use what you know about cell parts to explain how a cell carries out life processes.'},
  {id:'plantSuccessU',name:'Understand: Plant reproductive success',lesson:'Plants have structures and behaviors that help them reproduce successfully.'},
  {id:'plantSuccessA',name:'Apply: Plant reproductive success',lesson:'Use plant structures and environments to explain reproductive success.'},
  {id:'asexualPlants',name:'Asexual reproduction',lesson:'In asexual reproduction one parent produces offspring that are genetically identical to it.'},
  {id:'sexualPlants',name:'Sexual reproduction',lesson:'In sexual reproduction, pollen and egg cells combine so offspring inherit traits from two parents.'},
  {id:'seedDispersal',name:'Dispersal of seeds',lesson:'Wind, water, animals, and other methods carry seeds to new places.'},
  {id:'digestionHumans',name:'Digestion in humans',lesson:'The digestive system breaks food down so the body can absorb nutrients.'},
  {id:'digestionIntestines',name:'Digestion in the intestines',lesson:'The small intestine absorbs nutrients and the large intestine absorbs water.'},
  {id:'humanDigestion',name:'Human digestion',lesson:'Follow food through the organs of the digestive system and explain what each organ does.'}
];
const BIO_GROUPS = [
  {id:'cells',name:'Cellular organization and cell parts',quizName:'Quiz 1',learn:'Recognize cells as the basic unit of life, how they organize into tissues, organs, systems, and organisms, and what cell parts do.',skills:['cellsOrganisms','cellPartsU','cellPartsA']},
  {id:'plants',name:'Reproduction in plants',quizName:'Quiz 2',learn:'Explore plant reproductive success, asexual and sexual reproduction, and seed dispersal.',skills:['plantSuccessU','plantSuccessA','asexualPlants','sexualPlants','seedDispersal']},
  {id:'digestion',name:'Human digestive system',quizName:'Quiz 3',learn:'Follow digestion through the human body and the intestines.',skills:['digestionHumans','digestionIntestines','humanDigestion']}
];
const BIO1_QUESTIONS = {
  cellsOrganisms:[
    mc('What is the basic unit of life?','The cell','The organ','The system','The tissue'),
    mc('Which sequence goes from smallest to largest?','Cell, tissue, organ, organ system','Organ, cell, tissue, system','Tissue, organ, cell, system','System, organ, tissue, cell'),
    mc('A group of similar cells working together is a:','Tissue','Cell part','Single organism only','Habitat'),
    mc('Which is a single-celled organism?','Bacterium','Oak tree','Dog','Human')
  ],
  cellPartsU:[
    mc('Which cell part directs the cell\u2019s activities?','Nucleus','Cell wall','Vacuole','Chloroplast'),
    mc('Which part releases energy from food for the cell?','Mitochondria','Cell membrane','Nucleus','Cytoplasm'),
    mc('Which part controls what enters and leaves the cell?','Cell membrane','Chloroplast','Nucleus','Vacuole'),
    mc('Which part carries out photosynthesis in plant cells?','Chloroplast','Mitochondria','Cell membrane','Nucleus')
  ],
  cellPartsA:[
    mc('A plant cell stays rigid and keeps its shape. Which part helps most?','Cell wall','Mitochondria','Nucleolus only','Cytoplasm gel only'),
    mc('A muscle cell needs lots of energy. Which part would you expect many of?','Mitochondria','Chloroplasts','Cell walls','Seeds'),
    mc('A cell cannot make proteins correctly because its instructions are damaged. Which part is most likely affected?','Nucleus','Cell wall','Vacuole','Cell membrane'),
    mc('A leaf cell makes food using light. Which part is most important?','Chloroplast','Nucleus','Cell membrane','Cytoplasm')
  ],
  plantSuccessU:[
    mc('What is the main purpose of a flower for many plants?','To help the plant reproduce','To absorb water from soil','To anchor the plant','To make roots'),
    mc('What do pollinators like bees help move?','Pollen','Roots','Soil','Leaves'),
    mc('Why do brightly colored flowers help some plants?','They attract pollinators','They scare pollinators away','They make seeds disappear','They stop photosynthesis'),
    mc('Plants that make many seeds can improve reproductive success because:','More seeds may survive and grow','Seeds never need water','Every seed always grows','Parents stop needing sunlight')
  ],
  plantSuccessA:[
    mc('A plant in a field has no pollinators visiting. What is the likely effect?','Fewer seeds may form','More seeds always form','Roots stop growing','Leaves become flowers'),
    mc('A flower smells sweet and has nectar. What structure-function idea fits?','Features attract animals that carry pollen','Features stop reproduction','Nectar makes roots','Smell removes pollen'),
    mc('A seed with a hard coat survives winter. This helps reproduction because:','It can protect the embryo until conditions improve','It makes the seed need no water ever','It turns into a flower','It stops growth permanently'),
    mc('Which environment change could lower a plant\u2019s reproductive success?','Loss of pollinators','More pollinators','Adequate water','Healthy soil')
  ],
  asexualPlants:[
    mc('In asexual reproduction, offspring are:','Genetically identical to the parent','Mixed from two different parents','Always different species','Made from pollen and eggs'),
    mc('Which is an example of asexual reproduction in plants?','A strawberry plant sending out runners','A bee carrying pollen','A seed floating on wind','A flower attracting insects'),
    mc('How many parents are needed for asexual reproduction?','One','Two','Three','None'),
    mc('A cutting grows into a new plant. This is:','Asexual reproduction','Sexual reproduction','Pollination only','Seed dispersal')
  ],
  sexualPlants:[
    mc('Sexual reproduction in flowering plants involves:','Pollen and egg cells combining','One parent making a copy','A cutting growing roots','Runners spreading'),
    mc('What is pollination?','Moving pollen to the female part of a flower','A seed growing roots','Water entering a root','A leaf making food'),
    mc('Why can sexual reproduction increase variation?','Offspring inherit traits from two parents','Offspring copy one parent exactly','No genes are involved','Seeds never form'),
    mc('After fertilization, an ovule can develop into a:','Seed','Root hair','Stem','Petal')
  ],
  seedDispersal:[
    mc('A maple seed spins away from the tree. How is it dispersed?','By wind','By animals eating it','By water only','By fire'),
    mc('A burr sticks to an animal\u2019s fur. How is the seed dispersed?','By animals','By wind only','By lightning','By soil only'),
    mc('Why is seed dispersal helpful to a plant?','Seeds can grow away from the crowded parent plant','Seeds always grow faster in the shade of the parent','It removes the need for water','It prevents germination'),
    mc('A coconut can float across water. How is it dispersed?','By water','By pollinators only','By roots','By leaves')
  ],
  digestionHumans:[
    mc('What is the main job of the digestive system?','Break food down so nutrients can be absorbed','Pump blood','Exchange gases','Send nerve signals'),
    mc('Where does digestion begin?','The mouth','The large intestine','The stomach only','The skin'),
    mc('What does chewing do?','Breaks food into smaller pieces','Absorbs all nutrients','Makes bile','Removes water from waste'),
    mc('The stomach helps digestion by:','Mixing food with acid and enzymes','Absorbing most water','Making blood cells','Filtering oxygen')
  ],
  digestionIntestines:[
    mc('Where is most nutrient absorption?','Small intestine','Large intestine','Mouth','Esophagus'),
    mc('What does the large intestine mostly absorb?','Water','Most protein','Light','Oxygen'),
    mc('Why does the small intestine have villi?','They increase surface area for absorption','They crush food','They make acid','They store waste'),
    mc('What happens to undigested material?','It is eliminated as waste','It becomes bone','It becomes blood','It is absorbed in the mouth')
  ],
  humanDigestion:[
    mc('Which is the correct path of food?','Mouth, esophagus, stomach, small intestine, large intestine','Mouth, stomach, esophagus, large intestine, small intestine','Stomach, mouth, esophagus, intestines','Esophagus, mouth, stomach, intestines'),
    mc('What does the esophagus do?','Moves food from the mouth to the stomach','Absorbs nutrients','Makes bile','Stores waste'),
    mc('Which organ makes bile that helps digest fats?','Liver','Stomach','Mouth','Esophagus'),
    mc('How do the digestive system and circulatory system work together?','The blood carries absorbed nutrients to cells','Blood digests food in the mouth','They are unrelated','The stomach pumps blood')
  ]
};
const HISTORY_PROJECTS = {
  bio1:{title:'Model Project: Structure and Function',summary:'Build a model of a cell or of the digestive system and explain how its parts work together.',steps:[
    {key:'choice',label:'1. Choose a cell (plant or animal) or the human digestive system. Describe the model you will build and your materials.'},
    {key:'parts',label:'2. List at least six parts. For each, explain its function and what it represents in your model.'},
    {key:'organization',label:'3. Explain how cells, tissues, organs, or systems work together in your chosen example.'},
    {key:'limits',label:'4. What does your model show well? What does it get wrong or leave out?'},
    {key:'sources',label:'5. List the sources you used so a teacher can check them.'}]},
  bio1lab:{title:'Experiment: Germination Lab',summary:'Plan and carry out a fair test of one variable that could affect seed germination. Ask an adult for help and wash your hands after handling soil and seeds.',steps:[
    {key:'question',label:'1. Write your testable question and a hypothesis (use \u201cIf ... then ... because ...\u201d).'},
    {key:'variables',label:'2. Name the variable you will change, the variable you will measure, and at least three variables you will keep the same.'},
    {key:'procedure',label:'3. List materials and the numbered steps you followed, including how many seeds and trials you used.'},
    {key:'data',label:'4. Record your observations or measurements for each day (a small table is fine).'},
    {key:'conclusion',label:'5. State your conclusion using your data. Was your hypothesis supported? Name one source of error and how to improve the test.'},
    {key:'connection',label:'6. Connect your results to plant reproduction: why does this matter for how seeds grow in nature?'}]},
  history4:{title:'Belief Systems and Empires Case Study',summary:'Show how a belief system and an empire helped (or challenged) each other.',steps:[
    {key:'subject',label:'1. Choose one belief system and one empire from this unit. Say where and when each existed.'},
    {key:'spread',label:'2. Explain how the belief system spread: which people, routes, or networks carried it?'},
    {key:'evidence',label:'3. Give at least three pieces of evidence (texts, buildings, artifacts, or reliable sources) and what each shows.'},
    {key:'compare',label:'4. Compare this case with another belief system or empire. What is similar and different?'},
    {key:'claim',label:'5. Make a claim about how beliefs and empires affected each other and defend it with evidence.'},
    {key:'sources',label:'6. List the sources you used so a teacher can check them.'}]},
  history3:{title:'Compare Two Early Societies',summary:'Compare two early agrarian societies and explain how geography and resources shaped them.',steps:[
    {key:'subject',label:'1. Choose two societies from this unit (for example Mesopotamia and Egypt) and say where and when each existed.'},
    {key:'environment',label:'2. Describe each society\u2019s environment, crops, and resources.'},
    {key:'evidence',label:'3. Give at least two pieces of evidence for each society and what the evidence shows.'},
    {key:'compare',label:'4. Compare how farming, cities, writing, trade, or religion developed in each. What is similar and different?'},
    {key:'sources',label:'5. List the sources you used so a teacher can check them.'}]},
  history:{title:'Source Investigator Project',summary:'Investigate one source and explain what it can and cannot tell a historian.',steps:[
    {key:'source',label:'1. Choose and describe a source (an object, photo, document, story, or place). Who made it, when, and why?'},
    {key:'perspective',label:'2. Whose perspective does it show? Whose voices are missing?'},
    {key:'claim',label:'3. Make one claim about the past from this source and give two pieces of evidence.'},
    {key:'frame',label:'4. Choose a frame (communities, networks, or production and distribution) or a different scale. How does it change the story?'}]},
  history2:{title:'Forager or Farmer? Evidence Case',summary:'Research one foraging society or early farming community and answer: was agriculture a mistake?',steps:[
    {key:'subject',label:'1. Choose a foraging society or early farming community to research. Describe where and when it existed.'},
    {key:'evidence',label:'2. List at least three pieces of evidence (artifacts, art, remains, or reliable sources) and what each shows.'},
    {key:'tradeoffs',label:'3. Explain advantages and disadvantages of this way of life for different people.'},
    {key:'claim',label:'4. Answer “Was agriculture a mistake?” with a claim, supporting evidence, and a counterargument.'},
    {key:'sources',label:'5. List the sources you used so a teacher can check them.'}]}
};
const englishCourse = course => course === 'verbs'
  ? {id:'verbs',building:'elaVerbs',title:'English Unit 2: Verbs',skills:ENGLISH_UNIT2,groups:ENGLISH_GROUPS2,finalKey:'verbs:final-test',finalPass:9}
  : course === 'history'
    ? {id:'history',building:'histOrigins',title:'History Unit 1: Origins of History',skills:HISTORY_UNIT1,groups:HISTORY_GROUPS,finalKey:'history:final-test',testPer:2,finalPass:6,noQuizzes:true}
  : course === 'history2'
    ? {id:'history2',building:'histEarly',title:'History Unit 2: Early Humans',skills:HISTORY_UNIT2,groups:HISTORY_GROUPS2,finalKey:'history2:final-test',testPer:2,finalPass:8,noQuizzes:true}
  : course === 'history3'
    ? {id:'history3',building:'histAgrarian',title:'History Unit 3: Early Agrarian Societies',skills:HISTORY_UNIT3,groups:HISTORY_GROUPS3,finalKey:'history3:final-test',testPer:2,finalPass:14,noQuizzes:true}
  : course === 'history4'
    ? {id:'history4',building:'histEmpires',title:'History Unit 4: Empires and Belief Systems',skills:HISTORY_UNIT4,groups:HISTORY_GROUPS4,finalKey:'history4:final-test',testPer:2,finalPass:19,noQuizzes:true}
  : course === 'bio1'
    ? {id:'bio1',building:'bioChem',title:'Biology Unit 1: Life Sciences',skills:BIO_UNIT1,groups:BIO_GROUPS,finalKey:'bio1:final-test',testPer:2,finalPass:18}
  : {id:'nouns',building:'elaNouns',title:'English Unit 1: Nouns',skills:ENGLISH_UNIT1,groups:ENGLISH_GROUPS,finalKey:'final-test',finalPass:8};
const testSize = course => course.skills.length * (course.testPer || 1);
const KHAN = 'https://www.khanacademy.org/';
const GRAMMAR = `${KHAN}humanities/grammar/parts-of-speech-the-`, WORLD = `${KHAN}humanities/world-history/x66f79d8a:`, BIO6 = `${KHAN}science/grade-6-science/x88f5990a7622d8f5:life-sciences/x88f5990a7622d8f5:`;
const KHAN_LINKS = {
  nouns:{intro:`${GRAMMAR}noun/grammar-nouns/v/introduction-to-nouns-the-parts-of-speech-grammar-khan-academy`,types:`${GRAMMAR}noun/types-of-nouns/v/common-and-proper-nouns`,irregularBase:`${GRAMMAR}noun/irregular-plural-nouns-base-plurals-and-irregular-endings/v/irregular-plural-nouns-part-i-the-parts-of-speech-grammar-khan-academy`,irregularForeign:`${GRAMMAR}noun/irregular-plural-nouns-mutant-and-foreign-plurals/v/irregular-plural-nouns-part-iv-the-parts-of-speech-grammar`},
  verbs:{foundation:`${GRAMMAR}verb/introduction-to-verbs/v/introduction-to-verbs-the-parts-of-speech-grammar`,irregular:`${GRAMMAR}verb/irregular-verbs/v/introduction-to-irregular-verbs-the-parts-of-speech-grammar`,aspect:`${GRAMMAR}verb/verb-aspect-simple-progressive-and-perfect/v/intro-to-aspect`,aspectModal:`${GRAMMAR}verb/verb-aspect-and-modal-verbs/v/perfect-progressive-aspect-the-parts-of-speech-grammar`},
  history:{stories:`${WORLD}origins-of-history/x66f79d8a:history-stories-1-1/v/meet-oer-project-world-history`,frames:`${WORLD}origins-of-history/x66f79d8a:history-frames-1-3/v/frame-concept-introduction-world-history-project-beta`,memory:`${WORLD}origins-of-history/x66f79d8a:history-and-memory-1-4/a/activity-opener-worst-day-ever`},
  history2:{earliestHumans:`${WORLD}early-humans/x66f79d8a:the-earliest-humans-2-1/a/activity-opener-then-vs-now`,migrationArt:`${WORLD}early-humans/x66f79d8a:migration-and-art-2-2/a/activity-opener-who-s-an-authority`,foragingSocieties:`${WORLD}early-humans/x66f79d8a:foraging-societies-2-3/a/activity-opener-what-is-this-asking-introduction-origins`,agriculturalRevolution:`${WORLD}early-humans/x66f79d8a:the-agricultural-revolution-2-4/a/activity-opener-which-frame`,biggestMistake:`${WORLD}early-humans/x66f79d8a:the-biggest-mistake-humans-ever-made-2-5/a/activity-opener-casual-map-jack-and-the-giant-beanstalk`},
  history3:{earlyAmericas:`${WORLD}early-agrarian-societies/x66f79d8a:ancient-mesoamerica/a/article-ancient-agrarian-societies-mesoamerica-olmec-and-chavin-de-huantar`,ancientIndia:`${WORLD}early-agrarian-societies/x66f79d8a:indus-river-valley/a/article-ancient-agrarian-societies-indus-river-valley`,earlyAgrarian:`${WORLD}early-agrarian-societies/x66f79d8a:early-agrarian-societies-in-context/a/activity-contextualization-agrarian-societies`},
  bio1:{cells:`${BIO6}cellular-organization/v/ms-cells-and-organisms`,plants:`${BIO6}reproduction-in-plants/v/ms-plant-reproductive-success`,digestion:`${BIO6}human-digestive-system/e/digestion-in-humans-and-herbivores`}
};
/* exact lesson URLs are used where known; otherwise a Khan Academy search for the lesson name */
function khanLinkHTML(url, name){
  const href = url || `${KHAN}search?page_search_query=${encodeURIComponent(String(name).replace(/\s*[|\u00b7].*$/, ''))}`;
  return `<a class="ela-khan-link" href="${esc(href)}" target="_blank" rel="noopener">${url ? '\u25b6 Watch or read this lesson on Khan Academy' : '\ud83d\udd0d Find this lesson on Khan Academy'}</a>`;
}
function englishProgressReportHTML(canReview = false){
  return ['nouns','verbs','history','history2','history3','history4','bio1'].map(courseId => {
    const course = englishCourse(courseId), skills = course.skills.map(skill => {
      const record = englishRecord(skill.id,courseId), accuracy = record.answered ? Math.round((record.answered - record.misses) * 100 / record.answered) : null;
      const summary = accuracy === null ? record.tries ? `No answer history yet · best ${record.best}/${record.questionCount || 4}` : 'Not practiced' : `${accuracy}% correct · ${record.misses} missed of ${record.answered}`;
      return `<div class="ela-parent-row"><strong>${esc(skill.name)}</strong><span>${summary}</span>${record.answered >= 4 && accuracy < 70 ? '<b class="ela-review-flag">Review suggested</b>' : ''}</div>`;
    }).join('');
    const assessments = [...(course.noQuizzes ? [] : course.groups.map(group => ({name:group.quizName || `${group.name} quiz`,key:englishQuizKey(group.id,courseId),total:4}))),{name:`${course.title} Test`,key:course.finalKey,total:testSize(course)}].map(item => {
      const record = englishRecord(item.key,courseId);
      return `<div class="ela-parent-row"><strong>${esc(item.name)}</strong><span>${record.tries ? `${record.passed ? 'Passed' : 'Not passed'} · best ${record.best}/${record.questionCount || item.total} · ${record.tries} tries` : 'Not started'}</span></div>`;
    }).join('');
    return `<section class="panel"><h3>${esc(course.title)}</h3><p class="muted">Per-skill accuracy and assessment progress. Review is suggested after at least four answers when accuracy is below 70%.</p><div class="ela-parent-grid">${skills}</div><h4>${course.noQuizzes ? 'Test' : 'Quizzes and test'}</h4><div class="ela-parent-grid">${assessments}</div>${isProjectCourse(courseId) ? `<h4>Project and experiment</h4><div class="ela-parent-grid">${projectKeys(courseId).map(key => historyProjectReportHTML(key, canReview)).join('')}</div>` : ''}</section>`;
  }).join('');
}
function readingLedgerHTML(){
  const books = S.readingBooks.map(book => `<section class="reading-report"><h4>${esc(book.title)}${book.author ? ` · ${esc(book.author)}` : ''}</h4>${book.chapters.length ? book.chapters.map(chapter => {
    const notes = [['Main characters',chapter.characters],['Notable character action',chapter.notableAction],['Character interactions',chapter.interaction],['Conflict',chapter.conflict],['Joy or success',chapter.joy],['Environment and setting',chapter.setting],['Theme or big idea',chapter.themes],['Standout detail',chapter.detail],['Vocabulary',chapter.vocabulary]].filter(([,value]) => value);
    return `<div class="reading-report-chapter"><b>${esc(chapter.label || 'Untitled chapter')}</b>${notes.length ? `<dl>${notes.map(([label,value]) => `<dt>${label}</dt><dd>${esc(value)}</dd>`).join('')}</dl>` : '<p class="muted">No notes added yet.</p>'}</div>`;
  }).join('') : '<p class="muted">No chapters added yet.</p>'}</section>`).join('');
  return `<section class="panel"><h3>Reading Log</h3><p class="muted">Student-entered book-report notes, chapter by chapter. The game does not verify book interpretations.</p>${books || '<p class="muted">No books added yet.</p>'}</section>`;
}
const PLURAL_QUESTIONS = {
  identifyNouns:[
    (name,place,theme) => ({prompt:`In the chapter, ${name} explores ${place}. Which word is a noun?`,options:[name,'explores','carefully','through'],answer:0}),
    (name,place,theme) => ({prompt:`Which word names a place in your reading notes?`,options:['bravely',place,'discovers','although'],answer:1}),
    (name,place,theme) => ({prompt:`Which choice names an idea from the chapter?`,options:['quickly','beneath','listens',theme],answer:3}),
    (name,place,theme) => ({prompt:`In "${name} remembers the chapter," which word names a person?`,options:['remembers','chapter',name,'the'],answer:2})
  ],
  singularPlural:[
    {prompt:'Which is the plural of story?',options:['storys','stories','storyes','storie'],answer:1},
    {prompt:'Which is the plural of box?',options:['boxs','boxies','boxes','box'],answer:2},
    {prompt:'Which sentence uses a singular noun?',options:['The chapters are exciting.','The library has a map.','The characters explore.','The books are open.'],answer:1},
    {prompt:'Choose the plural form of "chapter".',options:['chapteres','chapters','chapteries','chapter'],answer:1}
  ],
  commonProper:[
    (name,place) => ({prompt:'Which choice is a proper noun?',options:[name,'chapter','library','story'],answer:0}),
    (name,place) => ({prompt:'Which choice is a common noun?',options:[name,'author','your school name','a character name'],answer:1}),
    (name,place) => ({prompt:'Which sentence correctly capitalizes a proper noun?',options:[`We read about ${name} in the book.`,`We read About ${name} in the book.`,`We read about ${name} in The book.`,`we read about ${name} in the book.`],answer:0}),
    (name,place) => ({prompt:'In your chapter notes, which is the name of a specific place?',options:['a room',place,'the library','a country'],answer:1})
  ],
  concreteAbstract:[
    (name,place,theme) => ({prompt:'Which choice names an abstract idea from the chapter?',options:[name,place,'a doorway',theme],answer:3}),
    (name,place,theme) => ({prompt:'Which choice names something concrete you could see?',options:['friendship','hope',place,'courage'],answer:2}),
    (name,place,theme) => ({prompt:'Which is a concrete noun?',options:['kindness','a book','fear','freedom'],answer:1}),
    (name,place,theme) => ({prompt:'Which is an abstract noun?',options:['a window','a path','a character','bravery'],answer:3})
  ],
  fToVes:[
    {prompt:'Choose the plural of leaf.',options:['leafs','leaves','leavs','leafes'],answer:1},
    {prompt:'Choose the plural of wolf.',options:['wolfs','wolfes','wolves','wolvs'],answer:2},
    {prompt:'Choose the plural of knife.',options:['knifes','knives','knivs','knifees'],answer:1},
    {prompt:'Choose the plural of shelf.',options:['shelfs','shelves','shelvs','shelfes'],answer:1}
  ],
  enPlurals:[
    {prompt:'Choose the plural of child.',options:['childs','childes','children','childrens'],answer:2},
    {prompt:'Choose the plural of ox.',options:['oxes','oxen','oxs','oxens'],answer:1},
    {prompt:'Choose the plural of person.',options:['persons','people','peoples','persones'],answer:1},
    {prompt:'Choose the plural of woman.',options:['womans','womanes','women','womens'],answer:2}
  ],
  basePlurals:[
    {prompt:'What is the plural of sheep?',options:['sheeps','sheep','sheepes','sheepies'],answer:1},
    {prompt:'What is the plural of deer?',options:['deers','deer','deeres','deeries'],answer:1},
    {prompt:'Choose the correct sentence.',options:['Two fishs swam by.','Two fish swam by.','Two fishes swam by always.','Two fishies swam by.'],answer:1},
    {prompt:'Which word has the same singular and plural form?',options:['book','child','species','leaf'],answer:2}
  ],
  mutantPlurals:[
    {prompt:'Choose the plural of mouse.',options:['mouses','mice','mouse','mices'],answer:1},
    {prompt:'Choose the plural of goose.',options:['gooses','geese','goose','geeses'],answer:1},
    {prompt:'Choose the plural of tooth.',options:['tooths','teeth','toothes','teeths'],answer:1},
    {prompt:'Choose the plural of foot.',options:['foots','feet','footses','feets'],answer:1}
  ],
  foreignPlurals:[
    {prompt:'Choose the plural of cactus.',options:['cactuses only','cacti','cactus','cactis'],answer:1},
    {prompt:'Choose the plural of criterion.',options:['criterions','criteria','criteriones','criterias'],answer:1},
    {prompt:'Choose the plural of alumnus.',options:['alumnuses','alumni','alumnus','alumnis'],answer:1},
    {prompt:'Choose the plural of fungus.',options:['funguses only','fungi','fungus','fungis'],answer:1}
  ],
  pluralReview:[
    {prompt:'Choose the plural of knife.',options:['knifes','knives','knife','knivies'],answer:1},
    {prompt:'Choose the plural of child.',options:['childs','children','childes','child'],answer:1},
    {prompt:'Choose the plural of mouse.',options:['mouses','mice','mouse','mices'],answer:1},
    {prompt:'Choose the plural of sheep.',options:['sheeps','sheep','sheepes','sheepies'],answer:1}
  ]
};
let englishRun = null, deletingBookId = null, activeEnglishCourse = 'nouns';
const readingText = (chapter,key,fallback) => (chapter?.[key] || '').split(/[\n,;]/).map(value => value.trim()).filter(Boolean)[0] || fallback;
function selectedReading(){
  const selection = S.readingSelection;
  if (!selection) return null;
  const book = S.readingBooks.find(item => item.id === selection.bookId), chapter = book?.chapters.find(item => item.id === selection.chapterId);
  return book && chapter ? {book,chapter} : null;
}
function selectedReadingBook(){ return S.readingBooks.find(book => book.id === S.readingSelection?.bookId) || null; }
function englishQuestions(skillId, courseId='nouns'){
  const reading = selectedReading();
  const {book,chapter} = reading || {book:{title:'your book'},chapter:{}};
  const context = {
    name:readingText(chapter,'characters','Mira'),place:readingText(chapter,'setting','the old library'),
    theme:readingText(chapter,'themes','friendship'),action:readingText(chapter,'notableAction','searches for a clue'),
    conflict:readingText(chapter,'conflict','a difficult problem'),joy:readingText(chapter,'joy','a joyful discovery')
  };
  if (isScienceCourse(courseId)) return (BIO1_QUESTIONS[skillId] || []).map(question => {
    const correct = question.options[question.answer], options = shuffle(question.options);
    return {...question,options,answer:options.indexOf(correct),skillId};
  });
  if (isHistoryCourse(courseId)) return ((courseId === 'history4' ? HISTORY4_QUESTIONS : courseId === 'history3' ? HISTORY3_QUESTIONS : courseId === 'history2' ? HISTORY2_QUESTIONS : HISTORY_QUESTIONS)[skillId] || []).map(question => {
    const correct = question.options[question.answer], options = shuffle(question.options);
    return {...question,options,answer:options.indexOf(correct),skillId};
  });
  if (courseId === 'verbs') return (VERB_QUESTIONS[skillId] || []).map(makeQuestion => ({...makeQuestion(context),skillId}));
  if (!reading) {
    const general = {
      identifyNouns:[
        {prompt:'Which choice is a noun?',options:['quickly','mountain','because','bright'],answer:1},
        {prompt:'Which word names an idea?',options:['under','kindness','walked','softly'],answer:1},
        {prompt:'Which word names a person?',options:['teacher','carefully','across','blue'],answer:0},
        {prompt:'Which word names a place?',options:['nearby','city','sing','gentle'],answer:1}
      ],
      commonProper:[
        {prompt:'Which choice is a proper noun?',options:['river','Monday','book','teacher'],answer:1},
        {prompt:'Which choice is a common noun?',options:['Maya','Canada','planet','Tuesday'],answer:2},
        {prompt:'Which sentence correctly capitalizes a proper noun?',options:['We visited Boston in July.','We visited boston in July.','We visited Boston in july.','we visited Boston in July.'],answer:0},
        {prompt:'Which is the name of a specific place?',options:['a country','the park','Lake Erie','a classroom'],answer:2}
      ],
      concreteAbstract:[
        {prompt:'Which choice names an abstract idea?',options:['a chair','a window','honesty','a pencil'],answer:2},
        {prompt:'Which choice names something you could see or touch?',options:['hope','courage','a shell','patience'],answer:2},
        {prompt:'Which is a concrete noun?',options:['kindness','a book','fear','freedom'],answer:1},
        {prompt:'Which is an abstract noun?',options:['a window','a path','a character','bravery'],answer:3}
      ]
    };
    if (general[skillId]) return general[skillId].map(question => ({...question, skillId}));
  }
  const {name,place,theme} = context;
  const prompts = PLURAL_QUESTIONS[skillId] || [];
  return prompts.map(item => typeof item === 'function' ? item(name,place,theme) : item).map(question => ({...question, skillId}));
}
function renderEnglishLibrary(){
  const active = selectedReading(), activeBook = selectedReadingBook(), books = S.readingBooks;
  const bookList = books.map(book => `<button type="button" class="ela-book${activeBook?.id === book.id ? ' active' : ''}" data-ela-book="${esc(book.id)}"><strong>${esc(book.title)}</strong><small>${esc(book.author || 'Author not added')} · ${book.chapters.length} chapter${book.chapters.length === 1 ? '' : 's'}</small></button>`).join('');
  const chapterList = activeBook ? activeBook.chapters.map(chapter => `<button type="button" class="ela-chapter${active?.chapter.id === chapter.id ? ' active' : ''}" data-ela-chapter="${esc(chapter.id)}">${esc(chapter.label || 'Untitled chapter')}</button>`).join('') : '';
  const chapter = active?.chapter;
  const fields = [
    ['characters','Who are the main characters in this chapter?'],['notableAction','What is one notable thing a character did?'],['interaction','How did the characters interact?'],
    ['conflict','What conflict or problem appeared or changed?'],['joy','What brought a character joy, hope, or a sense of success?'],
    ['setting','What is the environment, and how does it affect events?'],['themes','What theme or big idea is developing?'],
    ['detail','What detail or moment stands out as evidence?'],['vocabulary','What new or interesting words did you notice?']
  ];
  const editor = active ? `<div class="ela-editor"><div class="ela-reading-context"><strong>${esc(active.book.title)}</strong><span>${esc(chapter.label)}</span></div>
    <form id="elaChapterForm"><div class="ela-prompts">${fields.map(([key,label]) => `<label>${label}<textarea name="${key}" maxlength="600" rows="2">${esc(chapter[key] || '')}</textarea></label>`).join('')}</div><button class="btn berry" type="submit">Save chapter notes</button></form>
    <div class="ela-start"><p>Your notes can give practice a reading context. The game does not check whether notes match the book.</p><button class="btn mint" type="button" data-ela-unit data-ela-course="nouns">Open English Unit 1: Nouns</button>${unitOpen('elaVerbs') ? '<button class="btn mint" type="button" data-ela-unit data-ela-course="verbs">Open English Unit 2: Verbs</button>' : ''}</div></div>` : `<div class="ela-empty"><span>📖</span><h3>Reading Log</h3><p>Add a book and chapter to save notes, or practice English without choosing a book.</p><button class="btn mint" type="button" data-ela-unit data-ela-course="nouns">Practice English Unit 1: Nouns</button>${unitOpen('elaVerbs') ? '<button class="btn mint" type="button" data-ela-unit data-ela-course="verbs">Practice English Unit 2: Verbs</button>' : ''}</div>`;
  $('#libraryWrap').innerHTML = `<div class="backrow"><h2>📚 Story Corner Library</h2><button class="btn small" data-go="home">Back to town</button></div>
    <p class="muted">Build your own book report one chapter at a time. Save your notes and return to them whenever you read more. Notes are not checked for accuracy; a parent can review them with you.</p>
    <div class="ela-layout"><aside class="ela-shelf"><h3>My books</h3>${bookList || '<p class="muted">No books added yet.</p>'}<form id="elaBookForm" class="ela-add-book"><label>Book title<input name="title" maxlength="120" required></label><label>Author <span class="muted">(optional)</span><input name="author" maxlength="120"></label><button class="btn" type="submit">Add a book</button></form></aside>
    <div class="ela-workspace">${activeBook ? `<div class="ela-chapters"><div class="ela-chapters-head"><h3>Chapters</h3><button type="button" class="btn small" data-ela-delete="${esc(activeBook.id)}">Delete book</button></div>${deletingBookId === activeBook.id ? `<div class="ela-delete-confirm"><p>Delete this book and all its chapter notes?</p><button type="button" class="btn small" data-ela-delete-confirm="${esc(activeBook.id)}">Delete permanently</button><button type="button" class="btn small" data-ela-delete-cancel>Cancel</button></div>` : ''}${chapterList}<form id="elaAddChapter" class="ela-add-chapter"><label>Chapter name or number<input name="label" maxlength="100" required placeholder="Chapter 1"></label><button class="btn small" type="submit">Add chapter</button></form></div>` : ''}${editor}</div></div>`;
}
$('#libraryWrap').addEventListener('submit', event => {
  event.preventDefault(); const form = event.target;
  if (form.id === 'elaBookForm') {
    const data = new FormData(form), title = String(data.get('title') || '').trim(); if (!title) return;
    const book = {id:'book-' + Math.random().toString(36).slice(2,10), title, author:String(data.get('author') || '').trim(), chapters:[]};
    S.readingBooks.unshift(book); S.readingSelection = {bookId:book.id,chapterId:null}; save(); renderEnglishLibrary(); $('#libraryWrap [name="label"]')?.focus(); return;
  }
  if (form.id === 'elaAddChapter') {
    const book = selectedReadingBook(), label = String(new FormData(form).get('label') || '').trim(); if (!book || !label) return;
    const chapter = {id:'chapter-' + Math.random().toString(36).slice(2,10),label,characters:'',notableAction:'',conflict:'',interaction:'',joy:'',setting:'',themes:'',detail:'',vocabulary:''};
    book.chapters.push(chapter); S.readingSelection = {bookId:book.id,chapterId:chapter.id}; save(); renderEnglishLibrary(); $('#elaChapterForm textarea')?.focus(); return;
  }
  if (form.id === 'elaChapterForm') {
    const active = selectedReading(); if (!active) return;
    for (const field of form.querySelectorAll('textarea[name]')) active.chapter[field.name] = field.value.trim();
    save(); renderEnglishLibrary(); toast('Chapter notes saved.');
  }
});
$('#libraryWrap').addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.elaDelete) { deletingBookId = button.dataset.elaDelete; renderEnglishLibrary(); return; }
  if (button.hasAttribute('data-ela-delete-cancel')) { deletingBookId = null; renderEnglishLibrary(); return; }
  if (button.dataset.elaDeleteConfirm) {
    const id = button.dataset.elaDeleteConfirm;
    S.readingBooks = S.readingBooks.filter(book => book.id !== id);
    if (S.readingSelection?.bookId === id) S.readingSelection = null;
    deletingBookId = null; save(); renderEnglishLibrary(); toast('Book and chapter notes deleted.'); return;
  }
  if (button.dataset.elaBook) {
    const book = S.readingBooks.find(item => item.id === button.dataset.elaBook); if (!book) return;
    deletingBookId = null; S.readingSelection = {bookId:book.id,chapterId:book.chapters[book.chapters.length-1]?.id || null}; save(); renderEnglishLibrary(); return;
  }
  if (button.dataset.elaChapter) {
    const active = selectedReading(); if (!active) return;
    S.readingSelection = {bookId:active.book.id,chapterId:button.dataset.elaChapter}; save(); renderEnglishLibrary(); return;
  }
  if (button.hasAttribute('data-ela-unit')) { renderEnglishUnit(button.dataset.elaCourse || 'nouns'); return; }
});
function englishRecord(key,courseId='nouns'){
  const progress = progressStore(courseId), record = progress?.[key];
  return record && typeof record === 'object' ? record : {best:0,tries:0,passed:false,recentScores:[],answered:0,misses:0,recentAnswers:[]};
}
const englishQuizKey = (id, courseId='nouns') => isProjectCourse(courseId) ? `${courseId}:quiz:${id}` : courseId === 'verbs' ? `verbs:quiz:${id}` : `quiz:${id}`;
function englishAssessmentQuestions(skillIds, count, courseId='nouns'){
  const pools = skillIds.map(skillId => shuffle(englishQuestions(skillId, courseId)));
  const questions = [];
  while (questions.length < count && pools.some(pool => pool.length)) {
    pools.forEach(pool => { if (pool.length && questions.length < count) questions.push(pool.pop()); });
  }
  return shuffle(questions);
}
const englishFinalReady = course => course.noQuizzes
  ? course.skills.every(skill => !!englishRecord(skill.id,course.id).passed)
  : course.groups.every(group => !!englishRecord(englishQuizKey(group.id,course.id),course.id).passed);
/* hosted: the teacher's verdict lives in quiz_overrides as "verified:<submittedAt>" or "revise:<submittedAt>"; local: a grown-up sets it */
function historyProjectState(courseId){
  const p = projectStore(courseId)[courseId] || {answers:{},status:'draft',submittedAt:0,localReview:''};
  if (p.status !== 'submitted') return {...p, state:'draft'};
  const raw = Backend.me ? Backend.me.quiz_overrides?.[`project:${courseId}`] : '', [verdict, at] = String(raw || '').split(':');
  const review = Backend.me ? (+at === p.submittedAt && (verdict === 'verified' || verdict === 'revise') ? verdict : '') : p.localReview;
  return {...p, state:review || 'submitted'};
}
const PROJECT_STATE_TEXT = {draft:'Draft', submitted:'Submitted \u00b7 waiting for review', verified:'\u2705 Verified by your teacher', revise:'\ud83d\udd01 Revision requested'};
function historyProjectCardHTML(courseId){ return projectKeys(courseId).map(historyProjectCardOne).join(''); }
function historyProjectCardOne(courseId){
  const project = HISTORY_PROJECTS[courseId], info = historyProjectState(courseId);
  return `<section class="ela-final-assessment"><div><h3>${esc(project.title)}</h3><p class="muted">${esc(project.summary)} \u00b7 ${PROJECT_STATE_TEXT[info.state]}</p></div><button type="button" class="btn small berry" data-history-project="${courseId}">${info.state === 'draft' ? 'Open project' : 'View project'}</button></section>`;
}
function historyProjectReportHTML(courseId, canReview){
  const project = HISTORY_PROJECTS[courseId], info = historyProjectState(courseId);
  const answers = project.steps.filter(step => info.answers[step.key]).map(step => `<dt>${esc(step.label)}</dt><dd>${esc(info.answers[step.key])}</dd>`).join('');
  const buttons = canReview && info.state !== 'draft' ? `<div class="row"><button class="btn small" data-project-local-review="verified" data-project-course="${courseId}">Mark verified</button><button class="btn small" data-project-local-review="revise" data-project-course="${courseId}">Request revision</button></div>` : '';
  return `<div class="ela-parent-row"><strong>${esc(project.title)}</strong><span>${PROJECT_STATE_TEXT[info.state]}</span></div>${answers ? `<div class="reading-report-chapter"><dl>${answers}</dl>${buttons}</div>` : ''}`;
}
function renderHistoryProject(courseId){
  void Backend.refreshSettings();
  const project = HISTORY_PROJECTS[courseId], info = historyProjectState(courseId), locked = info.state === 'submitted' || info.state === 'verified';
  const fields = project.steps.map(step => `<label>${esc(step.label)}<textarea name="${step.key}" maxlength="1500" rows="4" ${locked ? 'readonly' : ''}>${esc(info.answers[step.key] || '')}</textarea></label>`).join('');
  const actions = locked ? (info.state === 'submitted' ? `<button class="btn small" type="button" data-history-project-edit="${courseId}">Withdraw to edit</button>` : '')
    : `<button class="btn" type="submit" data-save-mode="draft">Save draft</button><button class="btn berry" type="submit" data-save-mode="submit">Submit for review</button>`;
  $('#libraryWrap').innerHTML = `<div class="backrow"><h2>${esc(project.title)}</h2><button class="btn small" data-ela-unit data-ela-course="${courseId.replace(/lab$/, '')}">Back to unit</button></div><p class="muted">${esc(project.summary)} Take your time: this is a long-term project. ${PROJECT_STATE_TEXT[info.state]}.</p><form id="historyProjectForm" data-course="${courseId}"><div class="ela-prompts">${fields}</div><div class="row">${actions}</div></form>`;
}
$('#libraryWrap').addEventListener('submit', event => {
  const form = event.target.closest('#historyProjectForm'); if (!form) return;
  event.stopImmediatePropagation(); event.preventDefault();
  const courseId = form.dataset.course, p = projectStore(courseId)[courseId], data = new FormData(form);
  HISTORY_PROJECTS[courseId].steps.forEach(step => { p.answers[step.key] = String(data.get(step.key) || '').trim().slice(0,1500); });
  if (event.submitter?.dataset.saveMode === 'submit') {
    if (!HISTORY_PROJECTS[courseId].steps.every(step => p.answers[step.key])) { toast('Answer every step before submitting.'); save(); renderHistoryProject(courseId); return; }
    p.status = 'submitted'; p.submittedAt = Date.now(); p.localReview = ''; toast('Project submitted for review.');
  } else toast('Draft saved.');
  save(); renderHistoryProject(courseId);
}, true);
$('#libraryWrap').addEventListener('click', event => {
  const open = event.target.closest('[data-history-project]'); if (open) { renderHistoryProject(open.dataset.historyProject); return; }
  const edit = event.target.closest('[data-history-project-edit]');
  if (edit) { const p = projectStore(edit.dataset.historyProjectEdit)[edit.dataset.historyProjectEdit]; p.status = 'draft'; p.localReview = ''; save(); renderHistoryProject(edit.dataset.historyProjectEdit); }
});
function renderEnglishUnit(courseId=activeEnglishCourse){
  const course = englishCourse(courseId), active = selectedReading(); activeEnglishCourse = course.id;
  const groups = course.groups.map((group, groupIndex) => {
    const blockUnlocked = groupIndex === 0 || (course.noQuizzes ? course.groups[groupIndex-1].skills.every(skillId => !!englishRecord(skillId,course.id).passed) : !!englishRecord(englishQuizKey(course.groups[groupIndex-1].id,course.id),course.id).passed);
    const exercises = group.skills.map((skillId, skillIndex) => {
      const skill = course.skills.find(item => item.id === skillId), record = englishRecord(skillId,course.id);
      const unlocked = blockUnlocked && (skillIndex === 0 || !!englishRecord(group.skills[skillIndex-1],course.id).passed);
      const accuracy = record.answered ? Math.round((record.answered - record.misses) * 100 / record.answered) : null;
      const status = record.passed ? `✓ Level up · Best ${record.best}/4 · ${record.tries} tries`
        : record.tries ? `Best ${record.best}/4 · ${record.tries} tries · Get 3 of 4 to level up`
          : 'Not started · Get 3 of 4 to level up';
      const tracking = record.answered ? `<span class="muted">${record.answered - record.misses}/${record.answered} answers correct${accuracy !== null ? ` · ${accuracy}% accuracy` : ''}${record.answered >= 4 && accuracy < 70 ? ' · Review suggested' : ''}</span>` : '';
      return `<article class="ela-exercise${unlocked ? '' : ' locked'}"><div><strong>${esc(skill.name)}</strong><p>${esc(skill.lesson)}</p><span class="muted">${status}</span>${tracking}</div><button type="button" class="btn small${unlocked ? ' berry' : ''}" data-ela-practice="${skillId}" data-ela-course="${course.id}" ${unlocked ? '' : 'disabled'}>${record.passed ? 'Practice again' : record.tries ? 'Try again' : 'Practice'}</button></article>`;
    }).join('');
    const key = englishQuizKey(group.id,course.id), quiz = englishRecord(key,course.id);
    const canQuiz = blockUnlocked && group.skills.every(skillId => !!englishRecord(skillId,course.id).passed);
    const quizStatus = quiz.passed ? `Passed · best ${quiz.best}/4 · ${quiz.tries} tries`
      : quiz.tries ? `Best ${quiz.best}/4 · ${quiz.tries} tries · Get 3 of 4 to unlock the next block`
        : canQuiz ? 'Ready · Get 3 of 4 to unlock the next block' : 'Pass each practice to unlock this quiz';
    const extraLessons = (group.extraLessons || []).map(lesson => `<article class="ela-read-only"><strong>${esc(lesson.name)}</strong><p>${esc(lesson.lesson)}</p>${khanLinkHTML(lesson.url, lesson.name)}<span>Learn · no separate practice set listed</span></article>`).join('');
    return `<section class="ela-unit-group"><div class="ela-unit-learn"><h3>${esc(group.name)}</h3><p>${esc(group.learn)}</p>${khanLinkHTML(KHAN_LINKS[course.id]?.[group.id], group.name)}<span>Learn</span></div>${extraLessons}<div class="ela-exercise-list">${exercises}</div>${course.noQuizzes ? '' : `<div class="ela-assessment"><div><strong>${esc(group.quizName || `${group.name} Quiz`)}</strong><p class="muted">${quizStatus}</p></div><button type="button" class="btn small${canQuiz ? ' berry' : ''}" data-ela-quiz="${group.id}" data-ela-course="${course.id}" ${canQuiz ? '' : 'disabled'}>${quiz.passed ? 'Retake quiz' : 'Start quiz'}</button></div>`}</section>`;
  }).join('');
  const finalKey = course.finalKey, finalRecord = englishRecord(finalKey,course.id), finalReady = englishFinalReady(course), size = testSize(course);
  const finalStatus = finalRecord.passed ? `Passed · best ${finalRecord.best}/${size} · ${finalRecord.tries} tries`
    : finalRecord.tries ? `Best ${finalRecord.best}/${size} · ${finalRecord.tries} tries · Get ${course.finalPass} of ${size} to pass`
      : finalReady ? `Ready · Get ${course.finalPass} of ${size} to pass` : course.noQuizzes ? 'Pass every practice to unlock' : 'Pass all block quizzes to unlock';
  const context = active ? `<strong>Reading: ${esc(active.book.title)}</strong><span>${esc(active.chapter.label)} · ${esc(readingText(active.chapter,'themes','Theme not added yet'))}</span>` : '<strong>General practice</strong><span>No book selected</span>';
  $('#libraryWrap').innerHTML = `<div class="backrow"><h2>📚 ${esc(course.title)}</h2><div class="row"><button class="btn small" data-ela-library>Reading Log</button><button class="btn small" data-go="home">Back to town</button></div></div><div class="ela-context">${context}</div><p class="muted ela-learn-note">How it works: under each lesson, open the Khan Academy link to watch the video or read the article, then do the practice below it. Sections marked “Learn” with no practice are reading only.</p>${groups}<section class="ela-final-assessment"><div><h3>${esc(course.title)} Test</h3><p class="muted">Cumulative · ${size} questions · ${finalStatus}</p></div><button type="button" class="btn small${finalReady ? ' berry' : ''}" data-ela-final data-ela-course="${course.id}" ${finalReady ? '' : 'disabled'}>${finalRecord.passed ? 'Retake test' : 'Start test'}</button></section>${isProjectCourse(course.id) ? historyProjectCardHTML(course.id) : ''}`;
}
function renderEnglishQuestion(){
  const run = englishRun; if (!run) return;
  const question = run.questions[run.index];
  const active = selectedReading(), context = active ? `<strong>${esc(active.book.title)}</strong><span>${esc(active.chapter.label)} · ${esc(readingText(active.chapter,'themes','Your chapter notes'))}</span>` : '<strong>General practice</strong><span>No book selected</span>';
  $('#libraryWrap').innerHTML = `<div class="backrow"><h2>${esc(run.title)}</h2><button class="btn small" data-ela-unit data-ela-course="${run.courseId || 'nouns'}">Exit practice</button></div><div class="ela-context">${context}</div><div class="ela-question"><p class="muted">Question ${run.index+1} of ${run.questions.length} · ${run.score} correct</p><h3>${esc(question.prompt)}</h3><div class="ela-options">${question.options.map((option,index) => `<button type="button" class="ela-option" data-ela-answer="${index}" ${run.answered ? 'disabled' : ''}>${esc(option)}</button>`).join('')}</div><div class="ela-feedback" aria-live="polite"></div>${run.answered ? '<button type="button" class="btn berry" data-ela-next>Continue</button>' : ''}</div>`;
}
function startEnglishPractice(skillId,courseId=activeEnglishCourse){
  const course = englishCourse(courseId), questions = englishQuestions(skillId,course.id), skill = course.skills.find(item => item.id === skillId);
  if (!skill || questions.length !== 4) return;
  activeEnglishCourse=course.id;englishRun = {title:skill.name,progressKey:skillId,retryType:'practice',retryId:skillId,courseId:course.id,questions,index:0,score:0,passMark:3,answered:false,outcomes:[]}; renderEnglishQuestion();
}
function startEnglishAssessment(groupId,courseId=activeEnglishCourse){
  const course=englishCourse(courseId),final = groupId === 'final', group = course.groups.find(item => item.id === groupId);
  if (final ? !englishFinalReady(course) : !group || !group.skills.every(skillId => englishRecord(skillId,course.id).passed)) return;
  const questions = final
    ? shuffle(course.skills.flatMap(skill => shuffle(englishQuestions(skill.id,course.id)).slice(0,course.testPer || 1)))
    : englishAssessmentQuestions(group.quizSkills || group.skills, 4,course.id);
  activeEnglishCourse=course.id;englishRun = {title:final ? `${course.title} Test` : (group.quizName || `${group.name} Quiz`),progressKey:final ? course.finalKey : englishQuizKey(group.id,course.id),retryType:final ? 'final' : 'quiz',retryId:groupId,courseId:course.id,questions,index:0,score:0,passMark:final ? course.finalPass : 3,answered:false,outcomes:[],assessment:true};
  renderEnglishQuestion();
}
function finishEnglishRun(){
  const run = englishRun, store = progressStore(run.courseId);
  const previous = englishRecord(run.progressKey,run.courseId), passed = run.score >= run.passMark;
  store[run.progressKey] = {
    ...previous, best:Math.max(previous.best || 0,run.score), tries:(previous.tries || 0) + 1,
    passed:!!previous.passed || passed, recentScores:[...(previous.recentScores || []),run.score].slice(-10),
    lastScore:run.score, questionCount:run.questions.length
  };
  run.questions.forEach((question,index) => {
    const skillId = question.skillId, record = englishRecord(skillId,run.courseId), correct = !!run.outcomes[index];
    store[skillId] = {
      ...record, answered:(record.answered || 0) + 1, misses:(record.misses || 0) + (correct ? 0 : 1),
      recentAnswers:[...(record.recentAnswers || []),correct ? 1 : 0].slice(-12)
    };
  });
  const arcadeMinutesEarned = Math.floor(run.questions.length / 4);
  if (arcadeMinutesEarned) {
    const day = arcadeDateKey();
    S.mathMinutes[day] = (S.mathMinutes[day] || 0) + arcadeMinutesEarned;
  }
  save(); englishRun = null;
  const resultText = passed ? `Passed: ${run.score} of ${run.questions.length} (need ${run.passMark}).` : `You got ${run.score} of ${run.questions.length}. Get ${run.passMark} to pass.`;
  const retry = run.retryType === 'practice' ? `<button class="btn berry" type="button" data-ela-practice="${run.retryId}" data-ela-course="${run.courseId}">Practice again</button>`
    : run.retryType === 'quiz' ? `<button class="btn berry" type="button" data-ela-quiz="${run.retryId}" data-ela-course="${run.courseId}">Retake quiz</button>`
      : `<button class="btn berry" type="button" data-ela-final data-ela-course="${run.courseId}">Retake test</button>`;
  $('#libraryWrap').innerHTML = `<div class="backrow"><h2>${passed ? '✅ Passed!' : '📖 Keep practicing'}</h2><button class="btn small" data-ela-unit data-ela-course="${run.courseId}">Back to ${esc(englishCourse(run.courseId).title)}</button></div><div class="ela-question ela-result"><p>${esc(run.title)}</p><p><strong>${resultText}</strong></p><p>Best: ${store[run.progressKey].best} of ${run.questions.length} · Attempts: ${store[run.progressKey].tries}</p>${retry}</div>`;
}
$('#libraryWrap').addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.hasAttribute('data-ela-library')) { renderEnglishLibrary(); return; }
  if (button.dataset.elaPractice) { startEnglishPractice(button.dataset.elaPractice,button.dataset.elaCourse || activeEnglishCourse); return; }
  if (button.dataset.elaQuiz) { startEnglishAssessment(button.dataset.elaQuiz,button.dataset.elaCourse || activeEnglishCourse); return; }
  if (button.hasAttribute('data-ela-final')) { startEnglishAssessment('final',button.dataset.elaCourse || activeEnglishCourse); return; }
  if (button.dataset.elaAnswer != null && englishRun && !englishRun.answered) {
    const question = englishRun.questions[englishRun.index], answer = +button.dataset.elaAnswer, correct = answer === question.answer;
    englishRun.answered = true; englishRun.outcomes[englishRun.index] = correct; if (correct) englishRun.score++;
    button.parentElement.querySelectorAll('button').forEach((option,index) => { option.disabled = true; if (index === question.answer) option.classList.add('correct'); else if (index === answer) option.classList.add('incorrect'); });
    const feedback = $('#libraryWrap .ela-feedback'); feedback.textContent = correct ? 'That is right.' : `Not quite. The answer is ${question.options[question.answer]}.`;
    button.closest('.ela-question').insertAdjacentHTML('beforeend','<button type="button" class="btn berry" data-ela-next>Continue</button>'); return;
  }
  if (button.hasAttribute('data-ela-next') && englishRun) {
    englishRun.index++; englishRun.answered = false;
    if (englishRun.index === englishRun.questions.length) finishEnglishRun(); else renderEnglishQuestion();
  }
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
  S = Object.assign(fresh(), {name:me?.name || S.name, minStation:me?.min_station || S.minStation || 1, practiceLanguage:S.practiceLanguage, resetSeen:resetAt});
  syncLanguageControls();
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
  $('#leaveShift').textContent = config.id === 'cafe' ? 'Close the café early' : `Close the ${config.name.toLowerCase()} early`;
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
  const currentOrder = order, originalText = currentOrder.p.bubble;
  const translatedText = S.practiceLanguage === 'es' ? translateText(originalText) : originalText;
  const spanish = translatedText !== originalText, utterance = new SpeechSynthesisUtterance(translatedText);
  const language = spanish ? 'es-MX' : 'en-US', prefix = spanish ? 'es' : 'en';
  utterance.lang = language;
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase() === language.toLowerCase())
    || speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith(prefix)) || null;
  utterance.rate = .95; currentOrder.speaking = true;
  utterance.onend = () => { if (order === currentOrder) currentOrder.speaking = false; };
  utterance.onerror = utterance.onend;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}
function ticketHTML(text){
  const bold = s => s.replace(/(&#?[a-z0-9]+;)|(\d+(?:\.\d+)?)/gi, (m, ent, num) => ent ? ent : `<b>${num}</b>`);
  const source = S.practiceLanguage === 'es' ? translateText(text) : text;
  const safe = esc(source);
  const parts = (safe.match(/(?:[^.!?]|[.!?](?=\S))+[.!?]*/g) || [safe]).map(s => s.trim()).filter(Boolean);   // a point inside a number (2.4) is not the end of a sentence
  let qi = -1; parts.forEach((s, i) => { if (s.endsWith('?')) qi = i; });
  const story = parts.filter((_, i) => i !== qi).join(' ');
  return (story ? `<div class="ticket-story">${bold(story)}</div>` : '') +
    (qi >= 0 ? `<div class="ticket-find">❓ ${S.practiceLanguage === 'es' ? 'Encuentra:' : 'Find:'} ${bold(parts[qi])}</div>` : '');
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
function wireNum(inp, onEnter, {neg = false} = {}){
  /* neg: the answer may be negative, so one leading minus sign is kept (typed as - or −) */
  inp.addEventListener('input', () => { const v = inp.value.replace(/[−–]/g, '-'), minus = neg && v.trimStart().startsWith('-'); inp.value = (minus ? '-' : '') + v.replace(/[^\d.]/g,''); inp.classList.remove('wrong'); });
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
    const html = numInput('cur', st.prompt) + (st.neg ? '<button type="button" class="btn small neg-btn" id="negBtn" aria-label="Switch between positive and negative">±</button>' : '');
    if (st.slot) { const sl = slotEl(st.slot); sl.classList.add('active'); sl.innerHTML = html; } else box.innerHTML = (st.work ? `<div class="step-work">${st.work}</div>` : '') + html;
    const inp = $('#cur'); wireNum(inp, checkCurrent, {neg:!!st.neg}); setTimeout(() => inp.focus(), 40);
    $('#negBtn')?.addEventListener('click', () => { inp.value = inp.value.startsWith('-') ? inp.value.slice(1) : '-' + inp.value; inp.classList.remove('wrong'); inp.focus(); });   // phone keypads have no minus key
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
  const mathDay = arcadeDateKey();
  S.mathMinutes[mathDay] = (S.mathMinutes[mathDay] || 0) + 1;
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
    const rows = shuffle(Array.from({length:count}, (_,i) => {
      const k = start + i;
      return {label:`${table} × ${k} =`, answer:String(table*k), multiplier:k};
    }));
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'miss' ? `That one was ${drill.text}. Let's practice the ${table}s facts.`
        : drill.reason === 'slow' ? `You got ${drill.text}, but it took a while. Let's build quick recall of the ${table}s facts!`
        : `The ${table}s were tricky in that sprint. Let's practice them!`,
      rows,
      targetIndex: rows.findIndex(row => row.multiplier === drill.other),
      hint(rowIndex, wrongs){
        const answer = this.rows[rowIndex].answer;
        return wrongs >= 2 ? `It's ${answer}. Type ${answer}.` : `Try to recall ${table} times ${this.rows[rowIndex].multiplier}.`;
      },
      finishLine: `You practiced all the way to ${table} × ${top}! +3 🪙`,
      tieLine: drill.div ? `${table*drill.other} ÷ ${table} = ${drill.other}, because ${table} × ${drill.other} = ${table*drill.other}.` : `${table} × ${drill.other} = ${table*drill.other}. Now you know it!`,
      copy(language){
        const spanish = language === 'es';
        const title = spanish ? `¡Practiquemos la tabla del ${table}!` : DRILLS[drill.type].kidTitle(drill.key);
        const why = spanish
          ? drill.reason === 'miss' ? `La respuesta era ${drill.text}. ¡Practiquemos la tabla del ${table}!`
            : drill.reason === 'slow' ? `Acertaste: ${drill.text}, pero tardaste un poco. ¡Practiquemos para recordar rápido la tabla del ${table}!`
            : `La tabla del ${table} fue difícil en la carrera. ¡Vamos a practicar!`
          : drill.reason === 'miss' ? `That one was ${drill.text}. Let's practice the ${table}s facts.`
            : drill.reason === 'slow' ? `You got ${drill.text}, but it took a while. Let's build quick recall of the ${table}s facts!`
            : `The ${table}s were tricky in that sprint. Let's practice them!`;
        return {
          title, why,
          rowLabels: rows.map(row => spanish ? `¿Cuánto es ${table} × ${row.multiplier}?` : row.label),
          rowAriaLabels: rows.map(row => spanish ? `¿Cuánto es ${table} por ${row.multiplier}?` : row.label),
          hint(rowIndex, wrongs){
            const answer = rows[rowIndex].answer, multiplier = rows[rowIndex].multiplier;
            return wrongs >= 2
              ? spanish ? `Es ${answer}. Escribe ${answer}.` : `It's ${answer}. Type ${answer}.`
              : spanish ? `Intenta recordar cuánto es ${table} por ${multiplier}.` : `Try to recall ${table} times ${multiplier}.`;
          },
          finishLine: spanish ? `¡Practicaste hasta ${table} × ${top}! +3 🪙` : `You practiced all the way to ${table} × ${top}! +3 🪙`,
          tieLine: spanish
            ? drill.div ? `${table*drill.other} dividido entre ${table} es ${drill.other}, porque ${table} por ${drill.other} es ${table*drill.other}.` : `${table} por ${drill.other} es ${table*drill.other}. ¡Ya te la sabes!`
            : drill.div ? `${table*drill.other} ÷ ${table} = ${drill.other}, because ${table} × ${drill.other} = ${table*drill.other}.` : `${table} × ${drill.other} = ${table*drill.other}. Now you know it!`,
          checkLabel: spanish ? 'Comprobar' : 'Check',
          closeLabel: paused => spanish ? paused ? 'Volver al pedido' : 'Seguir' : paused ? 'Back to the order' : 'Keep going',
          spokenPrompt(rowIndex){ const row = rows[rowIndex]; return spanish ? `¿Cuánto es ${table} por ${row.multiplier}?` : `What is ${table} times ${row.multiplier}?`; },
          spokenAnswer(rowIndex){ const row = rows[rowIndex]; return spanish ? `${table} por ${row.multiplier} es igual a ${table*row.multiplier}.` : `${table} times ${row.multiplier} equals ${table*row.multiplier}.`; }
        };
      }
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
  factors:{
    sprintItem(){
      const rows = factorRows(), row = pick(rows.slice(1).length ? rows.slice(1) : rows);
      return {prompt:row.label.trim() + ' ?', answer:row.answer, drillId:'factors:pairs'};
    },
    build(drill, {short = false} = {}){
    const rows = factorRows(), N = rows[0].label.split(' ')[0];
    return {
      title: DRILLS[drill.type].kidTitle(drill.key),
      why: drill.reason === 'slow' ? "Let's get faster at finding factor pairs." : `Factor pairs start at 1 and go up. Let's list all of ${N}'s!`,
      rows: short ? rows.slice(0, 3) : rows, targetIndex: 0,
      hint(rowIndex, wrongs){ const r = this.rows[rowIndex], f = r.label.split(' ')[2]; return wrongs >= 2 ? `It's ${r.answer}. Type ${r.answer}.` : `${N} ÷ ${f} = ?`; },
      finishLine: 'Every factor pair, found! +3 🪙',
      tieLine: 'Stop when the pairs start repeating: after that, the same pairs come back in the other order.'
    };
    }
  },
  rounding:{
    sprintKeys:['ten', 'hundred', 'thousand'],
    sprintItem(key){ const row = roundingRows(key, 1)[0]; return {prompt:row.label.replace(/:$/, ''), answer:row.answer, drillId:`rounding:${row.key}`}; },
    build(drill, {short = false} = {}){
    const key = ['ten', 'hundred', 'thousand'].includes(drill.key) ? drill.key : 'hundred';
    return {
      title: DRILLS[drill.type].kidTitle(key),
      why: drill.reason === 'slow' ? "Let's make rounding quick." : `Rounding comes first. Let's practice rounding to the nearest ${key}!`,
      rows: roundingRows(key, short ? 3 : 5), targetIndex: 0,
      hint(rowIndex, wrongs){ const r = this.rows[rowIndex]; return wrongs >= 2 ? `It's ${commas(r.answer)}. Type ${r.answer}.` : `Look at the digit just right of the ${key}s place. 5 or more rounds up.`; },
      finishLine: 'Rounded every one! +3 🪙',
      tieLine: `Find the ${key}s place, look one place to the right: 5 or more rounds up, 4 or less rounds down.`
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
  $('#ladder').innerHTML = model.rows.map((row, i) => `<div class="lrow${i === model.targetIndex ? ' target' : ''}${row.options || row.label.length > 34 || model.rows.some(r => r.options) ? ' story' : ''}" id="lr${i}"><span data-row-label>${esc(row.label)}</span><span class="ans" id="la${i}"></span></div>`).join('');
  const id = drill.type + ':' + drill.key, log = S.drillLog[id] = S.drillLog[id] || {miss:0, slow:0, sprint:0};
  log[drill.reason] = (log[drill.reason] || 0) + 1; save();
  Backend.log('practice_popups', {times_table:drill.type === 'times' ? Number(drill.key) : null,
    drill_type:drill.type, drill_key:String(drill.key), reason:drill.reason});
  $('main').inert = true; $('#practice').hidden = false;
  renderPracticeLanguage();
  ladderStep();
}
function practiceCopy(){ return pr?.drill.type === 'times' ? pr.model.copy(S.practiceLanguage) : null; }
function renderPracticeLanguage(){
  if (!pr || pr.drill.type !== 'times') return;
  const copy = practiceCopy(), spanish = S.practiceLanguage === 'es';
  $('#prTitle').textContent = copy.title; $('#prWhy').textContent = copy.why;
  pr.model.rows.forEach((row, i) => {
    const rowEl = $('#lr' + i);
    rowEl.querySelector('[data-row-label]').textContent = copy.rowLabels[i];
    rowEl.classList.toggle('story', spanish);
  });
  const input = $('#lin'); if (input) input.setAttribute('aria-label', copy.rowAriaLabels[pr.i]);
  const check = $('#prCheck'); if (check) check.textContent = copy.checkLabel;
  if (pr.wrongs) $('#prHint').textContent = copy.hint(pr.i, pr.wrongs);
  if (pr.completed) {
    $('#prFinishLine').textContent = copy.finishLine;
    $('#prTieLine').textContent = copy.tieLine;
    $('#prClose').textContent = copy.closeLabel(!!pr.pausedOrder);
  }
}
function setPracticeLanguage(language){
  if (!['en','es'].includes(language)) return;
  const timesDrill = pr?.drill.type === 'times';
  const phase = timesDrill && pr.speaking ? pr.speechPhase : '';
  if (timesDrill) pr.speechToken = (pr.speechToken || 0) + 1;
  if (phase && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  if (timesDrill) { pr.speaking = false; pr.speechPhase = ''; }
  S.practiceLanguage = language; save(); syncLanguageControls();
  if (timesDrill) renderPracticeLanguage();
  if (phase) speakTimesFact(phase);
}
function speakPractice(text, onEnd, language = 'en'){
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') { onEnd(); return; }
  const utterance = new SpeechSynthesisUtterance(text);
  const locale = language === 'es' ? 'es-MX' : 'en-US';
  utterance.lang = locale; utterance.rate = .9;
  const prefix = language === 'es' ? 'es' : 'en', voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.lang.toLowerCase() === locale.toLowerCase()) || voices.find(voice => voice.lang.toLowerCase().startsWith(prefix)) || null;
  let finished = false;
  const finish = () => { if (finished) return; finished = true; onEnd(); };
  utterance.onend = finish; utterance.onerror = finish;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
}
function speakTimesFact(phase){
  if (!pr || pr.drill.type !== 'times') return;
  const current = pr, language = S.practiceLanguage, copy = practiceCopy();
  const token = current.speechToken = (current.speechToken || 0) + 1;
  current.speaking = true; current.speechPhase = phase;
  speakPractice(phase === 'answer' ? copy.spokenAnswer(current.i) : copy.spokenPrompt(current.i), () => {
    if (pr !== current || current.speechToken !== token) return;
    current.speaking = false; current.speechPhase = '';
    if (phase === 'answer') advancePracticeRow();
    else $('#lin')?.focus();
  }, language);
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
  const copy = practiceCopy();
  $('#la'+pr.i).innerHTML = `<input id="lin" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="${esc(copy ? copy.rowAriaLabels[pr.i] : row.label)}"><button class="btn small" id="prCheck" type="button">${copy ? esc(copy.checkLabel) : 'Check'}</button>`;
  const inp = $('#lin');
  const allowText = /[./-]/.test(row.answer);
  inp.addEventListener('input', () => { inp.value = inp.value.replace(allowText ? /[^\d./-]/g : /\D/g,''); inp.classList.remove('wrong'); });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ladderCheck(); } });
  $('#prCheck').addEventListener('click', ladderCheck);
  const pad = numberPad(inp, ladderCheck, {decimal:/\./.test(row.answer)});
  if (/\./.test(row.answer)) inp.classList.add('wide');
  if (pad) $('#prCheck').insertAdjacentElement('afterend', pad);
  inp.focus(); if (rowEl.scrollIntoView) rowEl.scrollIntoView({block:'nearest'});
  if (pr.drill.type === 'times') speakTimesFact('prompt');
}
function ladderCheck(){
  if (pr.speaking) return;
  const inp = $('#lin'); if (!inp || !inp.value) return;
  const row = pr.model.rows[pr.i], answer = String(row.answer).trim();
  if (inp.value.trim() === answer) ladderRight(answer);
  else {
    pr.wrongs++; sfx('bad'); inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); inp.select();
    const copy = practiceCopy();
    $('#prHint').textContent = copy ? copy.hint(pr.i, pr.wrongs) : pr.model.hint(pr.i, pr.wrongs);
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
  if (pr.drill.type === 'times') speakTimesFact('answer');
  else advancePracticeRow();
}
function advancePracticeRow(){
  if (!pr) return;
  if (pr.i + 1 < pr.model.rows.length) { pr.i++; ladderStep(); } else ladderDone();
}
function ladderDone(){
  S.coins += 3; save(); updateHeader();
  pr.completed = true;
  const copy = practiceCopy();
  $('#prDone').innerHTML = `<p id="prFinishLine">${esc(copy ? copy.finishLine : pr.model.finishLine)}</p><p class="big" id="prTieLine">${esc(copy ? copy.tieLine : pr.model.tieLine)}</p><button class="btn berry" id="prClose">${esc(copy ? copy.closeLabel(!!pr.pausedOrder) : pr.pausedOrder ? 'Back to the order' : 'Keep going')}</button>`;
  $('#prDone').hidden = false; sfx('coin');
  $('#prClose').addEventListener('click', closePractice); $('#prClose').focus();
}
function closePractice(){
  const cur = pr; pr = null;
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  $('#practice').hidden = true; $('main').inert = false;
  if (cur.pausedOrder && cur.pausedOrder === order && !order.done) {
    order.start += performance.now() - cur.opened;
    const remaining = Math.max(0, order.limit - (performance.now() - order.start)/1000);
    startPatience(remaining, 100 * remaining / order.limit);
  }
  if (cur.onClose) cur.onClose();
  setTimeout(showNextUnlock, 0);
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-language]');
  if (button && ['en','es'].includes(button.dataset.language)) setPracticeLanguage(button.dataset.language);
});

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
  /* one grade at a time: a grade switch on top (once two grades are built), then that grade's shops */
  const grades = builtHoods().length > 1 ? `<div class="book-grades" role="tablist" aria-label="Grade">${builtHoods().map(n => `<button type="button" class="book-grade${n.id === building.hood ? ' active' : ''}" role="tab" aria-selected="${n.id === building.hood}" data-book-hood="${n.id}">${n.emoji} ${esc(n.name)}</button>`).join('')}</div>` : '';
  const tabs = buildingsInClass(building.hood, building.subject).map(b => `<button type="button" class="book-tab${b.id === building.id ? ' active' : ''}" data-book-unit="${b.id}">${b.emoji}<span>${esc(b.name)}</span></button>`).join('');
  const pageComplete = rewards.length && rewards.every(owns);
  const masterStamp = pageComplete || unitTestPassed(building.id);
  const pageClass = `${!unitOpen(building.id) ? ' book-page-soon' : ''}${pageComplete ? ' book-page-complete' : ''}`;
  const trophies = NEIGHBORHOODS.filter(n => S.completedSets.includes(`hood:${n.id}`)).map(n => `<span class="book-trophy">🏆 ${esc(n.name)}</span>`).join('');
  $('#bookWrap').innerHTML = `<div class="backrow"><h2>📒 Sticker Book</h2><button class="btn small" data-go="home">Back to town</button></div>${trophies ? `<div class="book-trophies">${trophies}</div>` : ''}${grades}<div class="book-tabs">${tabs}</div><div class="book-page${pageClass}">${!unitOpen(building.id) ? `<div class="book-soon-banner">${esc(unitLockedText(building))}</div>` : ''}<div class="book-page-head"><span class="book-building">${building.emoji}</span><div><h2>${esc(building.name)}</h2><p>${owned} of ${rewards.length} stickers</p></div>${masterStamp ? `<div class="book-stamp">${esc(building.name)}<br>Master</div>` : ''}</div>${row('pet','Pets')}${row('decor','Decorations')}<p class="book-hint" id="bookHint" aria-live="polite"></p></div>`;
  const seen = rewards.filter(reward => owns(reward) && !S.seenCollection.includes(reward.id)).map(reward => reward.id);
  if (seen.length) { S.seenCollection.push(...seen); save(); }
}
$('#bookWrap').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.bookHood) { renderBook(buildingsIn(b.dataset.bookHood)[0].id); return; }
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
    ${englishProgressReportHTML()}${readingLedgerHTML()}
    <div class="panel"><h3>For grown-ups</h3><p>See which skills are strong, which step gets stuck, and which times tables need work.</p><button class="btn small" id="toParent">Open the progress report</button></div>`;
  if ($('#switchPlayer')) $('#switchPlayer').addEventListener('click', async () => { await townTracker.report(); townTracker.stop(); await Backend.signOut(); storeKey = LOCAL_KEY; S = fresh(); syncLanguageControls(); openJoin(); });
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
    ${englishProgressReportHTML(!Backend.me)}${readingLedgerHTML()}
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
  $$('#parentWrap [data-project-local-review]').forEach(b => b.addEventListener('click', () => {
    const p = projectStore(b.dataset.projectCourse)[b.dataset.projectCourse]; if (!p || p.status !== 'submitted') return;
    p.localReview = b.dataset.projectLocalReview; save(); renderParent();
  }));
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
    clearTimeout(armT); const keep = {muted:S.muted, music:S.music, musicTrack:S.musicTrack, musicVolume:S.musicVolume, practiceLanguage:S.practiceLanguage, minStation:S.minStation, name:Backend.me ? S.name : ''};
    S = Object.assign(fresh(), keep); save(); toast('Progress reset'); if (Backend.me) show('home'); else openName();
  });
}

/* ---------- joining a class (hosted mode) ---------- */
const join = {code:'', roster:[], pick:null};
function openJoin(){
  viewHood = null; viewSubject = null;
  join.code = ''; join.roster = []; join.pick = null;
  let last = ''; try { last = localStorage.getItem('pettown:lastCode') || ''; } catch(e){}
  $('#joinWrap').innerHTML = `<div class="card"><div class="big-emoji">🐾</div><h2>Welcome to Pet Town!</h2>
    <label for="codeInput">Type your class code</label>
    <input id="codeInput" class="textin" maxlength="8" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase; letter-spacing:.2em" value="${esc(last)}">
    <div class="row"><button class="btn berry" id="codeGo">Next</button></div>
    <div class="row"><button class="btn small" type="button" data-games-only>I'm just here for the games</button></div>
    <form class="games-only-form" data-games-only-form hidden><label>Secret word<input class="textin" type="password" name="secretWord" autocomplete="off" required></label><div class="row"><button class="btn berry" type="submit">Open games</button></div><p class="muted" data-games-only-error aria-live="polite"></p></form>
    <p class="muted" id="joinMsg" aria-live="polite"></p></div>`;
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
  viewHood = null; viewSubject = null;
  storeKey = 'pettown:v1:' + me.student_id;
  const local = loadState(storeKey);
  const remote = me.state && typeof me.state === 'object' ? me.state : null;
  const resetAt = me.reset_at, resetMs = resetAt ? Date.parse(resetAt) : NaN;
  if (resetAt && Number.isFinite(resetMs) && (local.savedAt || 0) < resetMs) resetTown(resetAt);
  else {
    S = (remote && (remote.savedAt || 0) > (local.savedAt || 0)) ? normalize(remote) : local;
    S.name = me.name; S.minStation = me.min_station || 1; S.resetSeen = resetAt || S.resetSeen || null;
  }
  syncLanguageControls();
  drillSettings();
  checkUnlocks({announce:false});
  save(); show('home');
  startTownTracker();
  void Backend.startSession();
}

/* ---------- boot ---------- */
(async function boot(){
  if (!Backend.enabled) { S = loadState(LOCAL_KEY); syncLanguageControls(); drillSettings(); checkUnlocks({announce:false}); save(); startTownTracker(); if (!S.name) openName(); else show('home'); return; }
  show('loading');
  let me = null;
  try { me = await Backend.restore(); } catch(e){}
  if (me) enterAs(me); else openJoin();
})();
