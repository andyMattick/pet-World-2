/* Role stage for History and Science questions: a little scene of where the student is,
   their pet in costume as the historical figure (or tour guide), and the person asking the question.
   The question appears in a dialogue box with the speaker's name, the student's answer is said back,
   and the asker reacts. Decorative parts are aria-hidden; the dialogue text stays readable. */

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// [emoji, left %, top %, size rem, extra class]
const SCENES = {
  campfire: {sky:['#1B2A4E','#4A3F6B'], ground:['#6B4A2E','#4E3520'], night:true, props:[['🌙',82,10,2],['⭐',20,8,1],['⭐',60,18,.8],['⭐',40,6,.7],['🌳',3,30,4.2],['🔥',48,52,2.6,'flicker'],['🪵',47,66,1.6],['🌳',91,34,3.6]]},
  ice:      {sky:['#BFD9EA','#EAF4FA'], ground:['#F4FAFD','#D5E8F2'], props:[['🏔️',8,8,4.5],['🏔️',62,4,5.2],['🦣',44,40,3],['🌲',30,36,2.2],['❄️',85,12,1.1,'drift']]},
  cave:     {sky:['#3D2E26','#5A4335'], ground:['#3A2B22','#2A1F18'], night:true, props:[['🐎',30,16,2.4,'painted'],['🦬',52,10,2.4,'painted'],['🦁',70,20,2,'painted'],['🖐️',42,34,1.4,'painted'],['🔥',4,30,2.2,'flicker'],['🔥',92,30,2.2,'flicker']]},
  field:    {sky:['#8CCBF0','#DDF1FB'], ground:['#C9A85C','#A8873E'], props:[['☀️',84,6,2.6],['🛖',36,30,3],['🌾',4,46,2.2],['🌾',54,48,2],['🐐',60,44,2],['🌾',24,52,1.8]]},
  pasture:  {sky:['#9FD3F2','#E6F5FB'], ground:['#8DBF5E','#6E9F44'], props:[['⛰️',4,8,4.4],['⛰️',56,14,3.6],['☁️',38,6,1.8,'drift'],['🐐',38,44,2.2],['🐑',52,48,2],['🐑',28,52,1.6]]},
  city:     {sky:['#F6C77A','#FBE6B8'], ground:['#C9A06A','#B08752'], props:[['☀️',6,6,2.4],['🏛️',34,18,3.6],['🧱',56,46,1.6],['🌴',2,28,3.4],['🌴',90,30,3.2],['🏺',58,56,1.4]]},
  harbor:   {sky:['#7EC8F0','#CFEFFB'], ground:['#E9D3A1','#D6BE88'], sea:true, props:[['☀️',84,6,2.4],['⛵',38,26,2.8,'bob'],['⛵',58,32,1.8,'bob'],['🐚',50,72,1.2],['🦀',62,74,1.1],['☁️',14,8,1.8,'drift']]},
  river:    {sky:['#F9C784','#FCE6BC'], ground:['#D7B36A','#C29E56'], sea:true, props:[['☀️',48,4,2.4],['🌴',2,24,3.6],['🛶',40,40,2.2,'bob'],['🐊',58,48,1.8],['🌴',90,26,3.2],['🏺',30,64,1.4]]},
  jungle:   {sky:['#7CC59A','#CDEBD6'], ground:['#5E8C3A','#46702A'], props:[['🌴',2,20,4],['🗿',38,26,3.4],['🦜',62,12,1.6,'drift'],['🌿',54,52,2],['🌴',88,22,3.8]]},
  planned:  {sky:['#F2D3A0','#FBEBD0'], ground:['#B5653A','#9C522C'], props:[['☀️',86,6,2.2],['🏠',30,30,2.6],['🏠',44,30,2.6],['🧱',58,50,1.6],['📐',22,56,1.4]]},
  court:    {sky:['#F7D6C4','#FCEEE6'], ground:['#8C6A43','#735536'], props:[['⛰️',4,6,3.8],['🏮',30,10,1.8,'bob'],['🏮',60,10,1.8,'bob'],['🎋',2,34,3],['🐉',42,30,2.6],['🎋',90,34,3]]},
  desert:   {sky:['#F6B26B','#FCE3B6'], ground:['#E5B96F','#CF9F55'], props:[['☀️',10,6,2.4],['🏜️',36,26,3.2],['🐪',56,40,2.6],['🐪',44,46,2],['🏕️',2,40,2.4]]},
  nightCaravan:{sky:['#22305C','#4E5E94'], ground:['#C9A06A','#A9824F'], night:true, props:[['🌙',80,8,2],['⭐',20,10,.9],['⭐',50,6,.7],['🐪',40,40,2.6],['🏕️',56,40,2.4],['🔥',30,52,1.6,'flicker']]},
  agora:    {sky:['#8FD0F5','#E2F4FC'], ground:['#E8E2D6','#CFC7B6'], props:[['☀️',86,6,2.2],['🏛️',30,16,3.8],['🫒',4,34,2.8],['🌊',54,46,1.6],['📜',58,62,1.3]]},
  roman:    {sky:['#A7D3F0','#E4F3FB'], ground:['#A0896A','#857055'], props:[['☀️',84,6,2.2],['🏛️',34,18,3.2],['⛺',54,36,2.4],['🦅',8,8,2,'drift'],['🛡️',60,58,1.4]]},
  palace:   {sky:['#F5C77E','#FCE7BE'], ground:['#C7A16E','#AD8857'], props:[['☀️',6,6,2.2],['🏰',34,14,3.6],['🐘',56,36,2.6],['🌴',90,26,3.2],['👑',58,62,1.2]]},
  travel:   {sky:['#9CCFEF','#E2F3FC'], ground:['#B9A27C','#9F8A66'], props:[['⛰️',4,8,4],['☁️',40,6,1.8,'drift'],['🗺️',34,40,2],['🧭',50,52,1.6],['⛵',60,30,1.8,'bob']]},
  village:  {sky:['#F9C784','#FCE6BC'], ground:['#C99A6E','#A97E55'], props:[['☀️',84,6,2.4],['🌳',2,20,4],['🛖',36,30,2.8],['🥁',54,52,2],['🛖',52,32,2.2]]},
  oldcity:  {sky:['#F3D9A6','#FBEFD6'], ground:['#D9C7A3','#C2AF8A'], props:[['☀️',84,6,2.2],['🧱',30,38,2],['🧱',42,38,2],['🌿',4,40,2.4],['🕊️',56,12,1.6,'drift']]},
  // Science: Pet Town Nature Center
  lab:      {sky:['#E3F1FA','#F7FBFE'], ground:['#BFD3E0','#A7BFCF'], indoor:true, props:[['💡',46,4,1.6],['🔬',34,42,2.6],['🧫',50,54,1.6],['🫙',58,46,1.6],['🪴',2,36,2.6]]},
  cell:     {sky:['#E8F7EE','#FFFFFF'], ground:['#BFE3C9','#A4D3B1'], indoor:true, props:[['🟢',34,20,4,'pulse'],['🫧',52,14,1.6,'drift'],['🫧',22,8,1.2,'drift'],['🧬',56,46,1.8],['🧩',40,58,1.4]]},
  garden:   {sky:['#A9DCF5','#E6F6FC'], ground:['#8CCB6E','#74B758'], props:[['☀️',84,6,2.2],['🌸',30,48,2],['🌻',4,32,3],['🌷',44,52,1.8],['🐝',50,20,1.4,'drift'],['🦋',30,14,1.6,'drift']]},
  greenhouse:{sky:['#DFF5E8','#F5FCF8'], ground:['#8B5E3C','#734A2D'], indoor:true, glass:true, props:[['🍓',36,52,1.8],['🪴',2,34,2.8],['🌼',48,50,1.8],['💧',44,14,1.2,'drift'],['🌱',56,58,1.4]]},
  trail:    {sky:['#F7D9A8','#FCEFD8'], ground:['#9C7A4E','#80623B'], props:[['🌳',2,18,4],['🍁',36,20,1.6,'drift'],['🌰',44,58,1.4],['🍂',52,48,1.6],['🌳',88,22,3.6]]},
  tunnel:   {sky:['#F6B7C3','#FCE1E7'], ground:['#E58FA3','#D0738A'], indoor:true, tunnel:true, props:[['🍎',36,44,2.2],['🌀',48,18,2.4,'spin'],['🗺️',54,52,1.6]]}
};

// first matching rule picks the scene, tested against who + where + intro
const SCENE_RULES = [
  [/microscope/i,'lab'], [/cell model|cell detective/i,'cell'], [/pollinator/i,'garden'], [/greenhouse/i,'greenhouse'],
  [/seed trail/i,'trail'], [/digestion/i,'tunnel'], [/nature center/i,'garden'],
  [/battuta|envoy|xuanzang|traveling merchant|monk and traveler/i,'travel'],
  [/cave/i,'cave'], [/ice age/i,'ice'], [/campfire|foraging band/i,'campfire'], [/herder/i,'pasture'],
  [/farm|wheat|abu hureyra/i,'field'], [/dilmun|bahrain|sailor|ships/i,'harbor'], [/nile|kush|nubia/i,'river'],
  [/olmec|san lorenzo/i,'jungle'], [/mohenjo|indus valley, about/i,'planned'], [/silk road|caravan/i,'nightCaravan'],
  [/mecca|arabia/i,'desert'], [/china|chang|anyang|xianyang|luoyang|han |qin |shang/i,'court'], [/griot|mali/i,'village'],
  [/roman|rome/i,'roman'], [/athens|greek|halicarnassus/i,'agora'], [/persia|cyrus|ashoka|maurya|india/i,'palace'],
  [/jerusalem|pilgrim/i,'oldcity'], [/uruk|babylon|mesopotamia|hammurabi/i,'city'],
  [/battuta|traveling|traveler|envoy|monk/i,'travel']
];
export function sceneFor(role){
  const text = `${role.who} ${role.where} ${role.intro}`;
  return (SCENE_RULES.find(([re]) => re.test(text)) || [null,'travel'])[1];
}

// who is asking: [pattern, emoji, badge]. 'PET' = one of the student's pets plays this part
const SPEAKERS = [
  [/reporter/i,'PET','🎤'], [/from the future/i,'PET','⏳'],
  [/kid|child|young/i,'🧒',''], [/grandparent/i,'🧓',''], [/parent/i,'🧑','👜'], [/runner/i,'🏃',''],
  [/emperor/i,'🤴','👑'], [/prince/i,'🤴',''], [/judge/i,'🧑‍⚖️',''], [/soldier|recruit/i,'🧑','🛡️'],
  [/monk/i,'🧘',''], [/scholar/i,'🧑‍🏫',''], [/student|apprentice/i,'🧑‍🎓',''], [/historian/i,'🧑','📜'],
  [/merchant|trader/i,'🧑','💰'], [/sailor/i,'🧑','⚓'], [/farmer|villager/i,'🧑‍🌾',''],
  [/messenger/i,'🏃','✉️'], [/governor|official|clerk|adviser|advisor/i,'🧑‍💼',''], [/city/i,'🏙️',''],
  [/traveler/i,'🧑','🧳'], [/visitor/i,'🧑','🎟️']
];
const TOUR_BADGE = [[/kid|child/i,'🎈'],[/grandparent/i,'👓'],[/parent/i,'👜'],[/runner/i,'👟'],[/student/i,'🎒'],[/visitor/i,'🎟️']];
const SPARE_PETS = ['🐻','🦊','🐰','🐼','🐨','🐷','🐸','🦝'];

/** Split "A traveler asks: “…”" into a speaker line and what they say. */
function splitPrompt(prompt){
  const m = /^((?:A|An|The|Your)\s[^:“"]{2,70}?)\s*:\s*([\s\S]+)$/.exec(prompt);
  if (m && /\b(asks|says|tells you|wonders|wants to know)$/i.test(m[1])) return {lead:m[1], said:m[2]};
  const lead = /^((?:A|An|The|Your)\s[a-z][a-z ]{1,40}?)\s(asks|wants|hands|shows|points|holds|notices|tells|brings|says|talks|explains|reads|offers|calls)\b/i.exec(prompt);
  return {lead: lead ? lead[1] : '', said: prompt};
}
const shortWho = who => { const w = who.split(',')[0].trim(); return /^a tour guide/i.test(who) ? 'Tour guide' : w.charAt(0).toUpperCase() + w.slice(1); };

/**
 * opts: {role, prompt, science, you (pet emoji), pets (owned pet emoji), index, first}
 * Returns the stage + dialogue HTML.
 */
export function stageHTML({role, prompt, science, you, pets = [], index = 0, first = false}){
  const scene = SCENES[sceneFor(role)] || SCENES.travel;
  const {lead, said} = splitPrompt(prompt);
  const others = pets.filter(p => p !== you), crowd = [...others, ...SPARE_PETS.filter(p => !others.includes(p) && p !== you)];
  let npc = '🧑', badge = '';
  const rule = lead && SPEAKERS.find(([re]) => re.test(lead));
  if (science) { npc = crowd[index % crowd.length]; badge = (TOUR_BADGE.find(([re]) => re.test(lead)) || [null,'🎟️'])[1]; }
  else if (rule) { [npc, badge] = rule[1] === 'PET' ? [crowd[index % crowd.length], rule[2]] : [rule[1], rule[2]]; }
  const group = science ? [crowd[(index + 1) % crowd.length], crowd[(index + 2) % crowd.length]] : [];
  const props = scene.props.map(([e,x,y,s,cls]) => `<span class="sp ${cls || ''}" style="left:${x}%;top:${y}%;--s:${s}">${e}</span>`).join('');
  const speaker = (lead || (science ? 'Someone on your tour' : 'A visitor')).replace(/\s+(asks|says|tells you|wonders|wants to know)$/i, '');
  const portal = first ? `<div class="stage-portal">${science ? '🎟️ Your tour is starting…' : `⏳ Traveling to ${esc(role.where)}…`}</div>` : '';
  return `<div class="role-stage${scene.night ? ' night' : ''}${scene.indoor ? ' indoor' : ''}${scene.sea ? ' sea' : ''}${scene.glass ? ' glass' : ''}${scene.tunnel ? ' tunnel' : ''}${first ? ' arrive' : ''}" style="--sky1:${scene.sky[0]};--sky2:${scene.sky[1]};--g1:${scene.ground[0]};--g2:${scene.ground[1]}" aria-hidden="true">
    <div class="stage-ground"></div>${props}
    <div class="stage-place">📍 ${esc(science ? role.who.replace(/^a tour guide (at|in|on|running) (the )?/i,'').replace(/^\w/, c => c.toUpperCase()) : role.where)}</div>
    <div class="stage-actor you"><span class="body">${you}<i class="costume">${role.emoji}</i></span><span class="plate">You · ${esc(shortWho(role.who))}</span></div>
    ${group.map((p, i) => `<div class="stage-actor crowd c${i}"><span class="body">${p}</span></div>`).join('')}
    <div class="stage-actor npc"><span class="emote"></span><span class="body">${npc}${badge ? `<i class="costume">${badge}</i>` : ''}</span><span class="plate">${esc(speaker.replace(/^(A|An) /, '').replace(/^\w/, c => c.toUpperCase()))}</span></div>
    ${portal}</div>
  <p class="stage-intro"><strong>You are ${esc(role.who)}.</strong> ${esc(role.intro)}</p>
  <div class="stage-dialog"><span class="speaker">${npc} ${esc(speaker)}</span><h3>${esc(said)}</h3><div class="stage-replies"></div></div>`;
}

/** After an answer: the student's pet says the answer back and the asker reacts. */
export function stageReact(root, correct, answerText, science){
  const stage = root.querySelector('.role-stage'); if (!stage) return;
  stage.classList.remove('good', 'bad'); void stage.offsetWidth; stage.classList.add(correct ? 'good' : 'bad');
  const emote = stage.querySelector('.npc .emote');
  if (emote) emote.textContent = correct ? ['💡','👏','😄','🤩'][Math.floor(Math.random() * 4)] : '🤔';
  if (correct) stage.insertAdjacentHTML('beforeend', Array.from({length:8}, (_, i) => `<span class="spark" style="left:${8 + i * 3}%;animation-delay:${i * 40}ms">${['✨','⭐','🎉'][i % 3]}</span>`).join(''));
  const replies = root.querySelector('.stage-replies');
  if (replies) replies.innerHTML = `<p class="reply you-say"><b>You:</b> “${esc(answerText)}”</p>`;
}
