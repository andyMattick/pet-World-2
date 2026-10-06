/* Role stage for History and Science questions: a little scene of where the student is,
   with the student's pet (as the historical figure or tour guide) and the asker talking in front of it.
   The question is the asker's speech bubble, the student's answer is said back, and the asker reacts. */

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// sky and ground colors for each place; the scene is just a backdrop behind the two characters
const SCENES = {
  campfire: {sky:['#1B2A4E','#4A3F6B'], ground:['#6B4A2E','#4E3520'], night:true},
  ice:      {sky:['#BFD9EA','#EAF4FA'], ground:['#F4FAFD','#D5E8F2']},
  cave:     {sky:['#3D2E26','#5A4335'], ground:['#3A2B22','#2A1F18'], night:true},
  field:    {sky:['#8CCBF0','#DDF1FB'], ground:['#C9A85C','#A8873E']},
  pasture:  {sky:['#9FD3F2','#E6F5FB'], ground:['#8DBF5E','#6E9F44']},
  city:     {sky:['#F6C77A','#FBE6B8'], ground:['#C9A06A','#B08752']},
  harbor:   {sky:['#7EC8F0','#CFEFFB'], ground:['#E9D3A1','#D6BE88'], sea:true},
  river:    {sky:['#F9C784','#FCE6BC'], ground:['#D7B36A','#C29E56'], sea:true},
  jungle:   {sky:['#7CC59A','#CDEBD6'], ground:['#5E8C3A','#46702A']},
  planned:  {sky:['#F2D3A0','#FBEBD0'], ground:['#B5653A','#9C522C']},
  court:    {sky:['#F7D6C4','#FCEEE6'], ground:['#8C6A43','#735536']},
  desert:   {sky:['#F6B26B','#FCE3B6'], ground:['#E5B96F','#CF9F55']},
  nightCaravan:{sky:['#22305C','#4E5E94'], ground:['#C9A06A','#A9824F'], night:true},
  agora:    {sky:['#8FD0F5','#E2F4FC'], ground:['#E8E2D6','#CFC7B6']},
  roman:    {sky:['#A7D3F0','#E4F3FB'], ground:['#A0896A','#857055']},
  palace:   {sky:['#F5C77E','#FCE7BE'], ground:['#C7A16E','#AD8857']},
  travel:   {sky:['#9CCFEF','#E2F3FC'], ground:['#B9A27C','#9F8A66']},
  village:  {sky:['#F9C784','#FCE6BC'], ground:['#C99A6E','#A97E55']},
  oldcity:  {sky:['#F3D9A6','#FBEFD6'], ground:['#D9C7A3','#C2AF8A']},
  // Science: Pet Town Nature Center
  lab:      {sky:['#E3F1FA','#F7FBFE'], ground:['#BFD3E0','#A7BFCF'], indoor:true},
  cell:     {sky:['#E8F7EE','#FFFFFF'], ground:['#BFE3C9','#A4D3B1'], indoor:true},
  garden:   {sky:['#A9DCF5','#E6F6FC'], ground:['#8CCB6E','#74B758']},
  greenhouse:{sky:['#DFF5E8','#F5FCF8'], ground:['#8B5E3C','#734A2D'], indoor:true, glass:true},
  trail:    {sky:['#F7D9A8','#FCEFD8'], ground:['#9C7A4E','#80623B']},
  tunnel:   {sky:['#F6B7C3','#FCE1E7'], ground:['#E58FA3','#D0738A'], indoor:true, tunnel:true}
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

// who is asking: [pattern, emoji]. 'PET' = one of the student's pets plays this part
const SPEAKERS = [
  [/reporter/i,'PET','🎤'], [/from the future/i,'PET','⏳'],
  [/kid|child|young/i,'🧒',''], [/grandparent/i,'🧓',''], [/parent/i,'🧑','👜'], [/runner/i,'🏃',''],
  [/emperor/i,'🤴','👑'], [/prince/i,'🤴',''], [/judge/i,'🧑‍⚖️',''], [/soldier|recruit/i,'🧑','🛡️'],
  [/monk/i,'🧘',''], [/scholar/i,'🧑‍🏫',''], [/student|apprentice/i,'🧑‍🎓',''], [/historian/i,'🧑','📜'],
  [/merchant|trader/i,'🧑','💰'], [/sailor/i,'🧑','⚓'], [/farmer|villager/i,'🧑‍🌾',''],
  [/messenger/i,'🏃','✉️'], [/governor|official|clerk|adviser|advisor/i,'🧑‍💼',''], [/city/i,'🏙️',''],
  [/traveler/i,'🧑','🧳'], [/visitor/i,'🧑','🎟️']
];
const SPARE_PETS = ['🐻','🦊','🐰','🐼','🐨','🐷','🐸','🦝'];

/** Split "A traveler asks: “…”" into a speaker line and what they say. */
function splitPrompt(prompt){
  const m = /^((?:A|An|The|Your)\s[^:“"]{2,70}?)\s*:\s*([\s\S]+)$/.exec(prompt);
  if (m && /\b(asks|says|tells you|wonders|wants to know)$/i.test(m[1])) return {lead:m[1], said:m[2]};
  const lead = /^((?:A|An|The|Your)\s[a-z][a-z ]{1,40}?)\s(asks|wants|hands|shows|points|holds|notices|tells|brings|says|talks|explains|reads|offers|calls|watches|sees|finds|picks|looks|touches|smells|tastes)\b/i.exec(prompt);
  return {lead: lead ? lead[1] : '', said: prompt};
}
const shortWho = who => { const w = who.split(',')[0].trim(); return /^a tour guide/i.test(who) ? 'Tour guide' : w.charAt(0).toUpperCase() + w.slice(1); };

/**
 * opts: {role, prompt, science, you (pet emoji), pets (owned pet emoji), index, first}
 * Two characters talking in front of the place: the student's pet (as the figure or tour guide) and the asker.
 */
export function stageHTML({role, prompt, science, you, pets = [], index = 0, first = false}){
  const scene = SCENES[sceneFor(role)] || SCENES.travel;
  const {lead, said} = splitPrompt(prompt);
  const others = pets.filter(p => p !== you), crowd = [...others, ...SPARE_PETS.filter(p => !others.includes(p) && p !== you)];
  let npc = '🧑';
  const rule = lead && SPEAKERS.find(([re]) => re.test(lead));
  if (science || rule?.[1] === 'PET') npc = crowd[index % crowd.length];
  else if (rule) npc = rule[1];
  const speaker = (lead || (science ? 'Someone on your tour' : 'A visitor')).replace(/\s+(asks|says|tells you|wonders|wants to know)$/i, '');
  const place = science ? role.who.replace(/^a tour guide (at|in|on|running) (the )?/i, '').replace(/^\w/, c => c.toUpperCase()) : role.where;
  const portal = first ? `<div class="stage-portal" aria-hidden="true">${science ? '🎟️ Your tour is starting…' : `⏳ Traveling to ${esc(role.where)}…`}</div>` : '';
  return `<div class="role-stage${scene.night ? ' night' : ''}${scene.sea ? ' sea' : ''}${first ? ' arrive' : ''}" style="--sky1:${scene.sky[0]};--sky2:${scene.sky[1]};--g1:${scene.ground[0]};--g2:${scene.ground[1]}">
    <div class="stage-ground" aria-hidden="true"></div>
    <div class="stage-place">📍 ${esc(place)}</div>
    <div class="stage-row">
      <div class="stage-actor you" aria-hidden="true"><span class="body">${you}</span><span class="plate">You · ${esc(shortWho(role.who))}</span></div>
      <div class="stage-talk">
        <div class="talk-bubble ask"><span class="speaker">${esc(speaker)}</span><h3>${esc(said)}</h3></div>
        <div class="stage-replies" aria-live="polite"></div>
      </div>
      <div class="stage-actor npc" aria-hidden="true"><span class="emote"></span><span class="body">${npc}</span><span class="plate">${esc(speaker.replace(/^(A|An) /, '').replace(/^\w/, c => c.toUpperCase()))}</span></div>
    </div>${portal}</div>
  <p class="stage-intro"><strong>You are ${esc(role.who)}.</strong> ${esc(role.intro)}</p>`;
}

/** After an answer: the student's pet says the answer back and the asker reacts. */
export function stageReact(root, correct, answerText){
  const stage = root.querySelector('.role-stage'); if (!stage) return;
  stage.classList.remove('good', 'bad'); void stage.offsetWidth; stage.classList.add(correct ? 'good' : 'bad');
  const emote = stage.querySelector('.npc .emote');
  if (emote) emote.textContent = correct ? ['💡','👏','😄','🤩'][Math.floor(Math.random() * 4)] : '🤔';
  const replies = stage.querySelector('.stage-replies');
  if (replies) replies.innerHTML = `<div class="talk-bubble reply"><span class="speaker">You</span>${esc(answerText)}</div>`;
}
