/* Themed rooms: each building gets its own wallpaper, floor, props, and drifting extras
   behind the screens where students answer questions (shift, shop floor, summary, library).
   Purely decorative: everything here is aria-hidden and pointer-events:none.
   To theme a new building, add an entry to ROOMS keyed by its BUILDINGS id. */

// wall / wall2 = wallpaper colors, floor / floor2 = floor colors, frame = chalkboard frame,
// awning = header stripes, props = things standing on the floor, hero = big faint wall art,
// float = emoji that drift through the room, motion = rise | fall | drift
const ROOMS = {
  // 6th grade math
  cafe:   {wall:'#FCE4EC', wall2:'#F8D0DC', pattern:'stripes', floor:'#C99A6E', floor2:'#B5865B', floorKind:'planks', frame:'#9A6A45', awning:['#E4577A','#FFFFFF'],
           props:['🪴','☕','🧁','🫖','🍰','🌷'], hero:'☕', float:['💗','☕'], motion:'rise'},
  bakery: {wall:'#FFF4D6', wall2:'#F3E2B3', pattern:'tiles', floor:'#D98C5F', floor2:'#C4774B', floorKind:'checks', frame:'#B07842', awning:['#F28C28','#FFF4D6'],
           props:['🥖','🥐','🎂','🧁','🥧','🍩','🍞'], hero:'🥐', float:['♨️','✨'], motion:'rise'},
  market: {wall:'#E6F6E0', wall2:'#C8E9BC', pattern:'stripes', floor:'#BDB3A3', floor2:'#A69B8A', floorKind:'stone', frame:'#7A5A3A', awning:['#3F9E5A','#FFFFFF'],
           props:['🧺','🍎','🍉','🌽','🥕','🍋','🍇'], hero:'🍎', float:['🍃'], motion:'drift'},
  clock:  {wall:'#2E2A5A', wall2:'#F6E7A8', pattern:'stars', floor:'#6B6478', floor2:'#57506A', floorKind:'stone', frame:'#B8913A', awning:['#4B3F8F','#F2C94C'],
           props:['🕯️','⏳','🔔','📜','🕰️','🦉'], hero:'🕰️', float:['⭐','⚙️'], motion:'drift', dark:true},
  rink:   {wall:'#DDF1FB', wall2:'#FFFFFF', pattern:'snow', floor:'#EEF8FD', floor2:'#C9E6F5', floorKind:'ice', frame:'#5D8FB0', awning:['#3C8DC4','#FFFFFF'],
           props:['🌲','⛄','🏒','⛸️','🧣','🌲'], hero:'❄️', float:['❄️'], motion:'fall'},
  potion: {wall:'#3A2A4D', wall2:'#2A1E39', pattern:'bricks', floor:'#4B4256', floor2:'#3A3245', floorKind:'stone', frame:'#5E8C3A', awning:['#6A3D9A','#A6E35A'],
           props:['🍄','🧪','📜','⚗️','🔮','🕯️','🍄'], hero:'🔮', float:['🫧','✨'], motion:'rise', dark:true},
  houses: {wall:'#CDEBFA', wall2:'#FFFFFF', pattern:'sky', floor:'#8CCB6E', floor2:'#74B758', floorKind:'grass', frame:'#A0522D', awning:['#D9534F','#FFFFFF'],
           props:['🌳','🏡','🌻','🧱','🐝','🌳'], hero:'☀️', float:['☁️'], motion:'drift'},
  show:   {wall:'#9E1B32', wall2:'#7A1226', pattern:'drapes', floor:'#B07A4A', floor2:'#9A6638', floorKind:'planks', frame:'#C9A227', awning:['#B5122E','#F2C94C'],
           props:['💐','🎀','🏆','📸','🎪','💐'], hero:'⭐', float:['🎉','⭐'], motion:'fall', dark:true},
  // 4th grade math
  lemonade:{wall:'#FFF7C2', wall2:'#FFE97A', pattern:'stripes', floor:'#9AD07A', floor2:'#86C066', floorKind:'grass', frame:'#C9A227', awning:['#F5C518','#FFFFFF'],
           props:['🌼','🍋','🥤','🧊','⛱️','🌼'], hero:'☀️', float:['🌼','🍋'], motion:'fall'},
  toys:   {wall:'#E9F3FF', wall2:'#FFC8D8', pattern:'dots', floor:'#7FB3E6', floor2:'#6CA2D8', floorKind:'carpet', frame:'#E4577A', awning:['#3C8DC4','#FFD76A'],
           props:['🧸','🪀','🚂','🧩','🪁','🎈'], hero:'🎈', float:['🎈'], motion:'rise'},
  pizza:  {wall:'#FFFFFF', wall2:'#F4C2C2', pattern:'checks', floor:'#C9B79C', floor2:'#B5A385', floorKind:'checks', frame:'#3F7D3A', awning:['#D62828','#FFFFFF'],
           props:['🌿','🍅','🍕','🧀','🫓','🌿'], hero:'🍕', float:['🌿'], motion:'drift'},
  garden: {wall:'#E3F4DC', wall2:'#BFE3B0', pattern:'leaves', floor:'#8B5E3C', floor2:'#734A2D', floorKind:'soil', frame:'#5E8C3A', awning:['#3F9E5A','#FFF4D6'],
           props:['🌵','🌷','🥕','🪴','🌻','🌹'], hero:'🌻', float:['🦋','🐝'], motion:'drift'},
  art:    {wall:'#FFFDF6', wall2:'#FFD76A', pattern:'splatter', floor:'#C99A6E', floor2:'#B5865B', floorKind:'planks', frame:'#5D5D9E', awning:['#7B61FF','#FFD76A'],
           props:['🖼️','🎨','🖌️','✏️','🖍️','🖼️'], hero:'🎨', float:['🖍️'], motion:'drift'},
  // History museums
  histOrigins: {wall:'#EFE6D6', wall2:'#DCCDB4', pattern:'gallery', floor:'#A68A64', floor2:'#8F7552', floorKind:'stone', frame:'#7A5A3A', awning:['#8C6A43','#EFE6D6'],
                props:['🗿','🏺','📜','🪨','🦣','🏺'], hero:'🏺', float:['✨'], motion:'drift'},
  histEarly:   {wall:'#F6DFB8', wall2:'#E9C891', pattern:'gallery', floor:'#C8A26B', floor2:'#B48E58', floorKind:'sand', frame:'#8A5A2B', awning:['#B5651D','#F6DFB8'],
                props:['🌿','🦴','🔥','🪨','🦓','🌿'], hero:'🦴', float:['🍃'], motion:'drift'},
  histAgrarian:{wall:'#F9E7B5', wall2:'#E8C770', pattern:'gallery', floor:'#D7B36A', floor2:'#C29E56', floorKind:'sand', frame:'#2F6F8F', awning:['#2F6F8F','#F2C94C'],
                props:['🌴','🌾','🏺','🐊','🐪','🌴'], hero:'☀️', float:['🌾'], motion:'drift'},
  histEmpires: {wall:'#F4F1EA', wall2:'#DED8CB', pattern:'columns', floor:'#E8E2D6', floor2:'#CFC7B6', floorKind:'marble', frame:'#7B2D8E', awning:['#6B2A7A','#E5C46B'],
                props:['🏛️','🏺','🛡️','🦅','📜','🏛️'], hero:'🏛️', float:['✨'], motion:'drift'},
  histWebs:    {wall:'#F7E2C6', wall2:'#C9473D', pattern:'gallery', floor:'#C8A26B', floor2:'#B48E58', floorKind:'sand', frame:'#9E2B25', awning:['#C9473D','#F2C94C'],
                props:['🏮','🐫','🧭','🧵','🫖','🏮'], hero:'🐫', float:['🏮'], motion:'drift'},
  histGlobal1: {wall:'#DDF1EE', wall2:'#BFE3DC', pattern:'gallery', floor:'#A68A64', floor2:'#8F7552', floorKind:'planks', frame:'#2F7D6D', awning:['#2F7D6D','#F2C94C'],
                props:['🌺','🌽','⛵','🗺️','🦜','🌺'], hero:'⛵', float:['🦜'], motion:'drift'},
  histLong19:  {wall:'#E4E0DA', wall2:'#C8C1B8', pattern:'bricks', floor:'#6E6A66', floor2:'#5C5854', floorKind:'stone', frame:'#4A4A4A', awning:['#4A4A4A','#C9A227'],
                props:['🏭','🚂','🎩','⚙️','💡','🕰️'], hero:'⚙️', float:['☁️'], motion:'drift'},
  histConflict:{wall:'#E8EAE0', wall2:'#D2D6C4', pattern:'gallery', floor:'#9C9A8A', floor2:'#878574', floorKind:'stone', frame:'#556B2F', awning:['#556B2F','#F4F1E6'],
                props:['📻','🗞️','🕊️','✉️','🎖️','📻'], hero:'🕊️', float:['🕊️'], motion:'drift'},
  histGlobal2: {wall:'#E3F0FB', wall2:'#C6DDF2', pattern:'glass', floor:'#B9C3CC', floor2:'#A4AEB8', floorKind:'marble', frame:'#2B5D8C', awning:['#2B5D8C','#7FD1B9'],
                props:['🚢','📦','🌐','💻','📱','🚢'], hero:'🌐', float:['✈️'], motion:'drift'},
  // Biology
  bioChem:   {wall:'#E3F4DC', wall2:'#C2E5B4', pattern:'leaves', floor:'#8B5E3C', floor2:'#734A2D', floorKind:'soil', frame:'#5E8C3A', awning:['#3F9E5A','#FFF4D6'],
              props:['🌱','🍄','🔬','🐞','🪵','🌿'], hero:'🔬', float:['🍃','🐞'], motion:'drift'},
  bioCells:  {wall:'#FFF4D6', wall2:'#E9D7A8', pattern:'planks', floor:'#D9C27A', floor2:'#C4AC63', floorKind:'hay', frame:'#9A6A45', awning:['#C0392B','#FFFFFF'],
              props:['🌾','🐑','🐐','🐇','🪵','🌾'], hero:'🐑', float:['🌾'], motion:'drift'},
  bioEnergy: {wall:'#E8F7EE', wall2:'#FFFFFF', pattern:'glass', floor:'#8B5E3C', floor2:'#734A2D', floorKind:'soil', frame:'#3F7D5A', awning:['#3F9E5A','#FFFFFF'],
              props:['🪴','🌺','🌱','💧','🌸','🪴'], hero:'☀️', float:['💧'], motion:'fall'},
  bioDivide: {wall:'#F3E9FB', wall2:'#E1CFF2', pattern:'leaves', floor:'#8CCB6E', floor2:'#74B758', floorKind:'grass', frame:'#7B61FF', awning:['#9B59B6','#FFFFFF'],
              props:['🌸','🐛','🪺','🌼','🌸','🌷'], hero:'🦋', float:['🦋'], motion:'drift'},
  bioGenes:  {wall:'#B5452F', wall2:'#9C3A27', pattern:'planks', floor:'#D9C27A', floor2:'#C4AC63', floorKind:'hay', frame:'#6B3A1F', awning:['#B5452F','#FFFFFF'],
              props:['🌾','🐄','🐖','🐓','🚜','🌾'], hero:'🐄', float:['🌾'], motion:'drift', dark:true},
  bioEvolve: {wall:'#DFF3F7', wall2:'#BFE6EE', pattern:'leaves', floor:'#7FB069', floor2:'#6A9B55', floorKind:'grass', frame:'#2F7D6D', awning:['#2F9E8F','#FFD76A'],
              props:['🌳','🦜','🪺','🦩','🦉','🌳'], hero:'🦜', float:['🪶'], motion:'fall'},
  bioEco:    {wall:'#1F6FA8', wall2:'#5FB8E0', pattern:'water', floor:'#E9D3A1', floor2:'#D6BE88', floorKind:'sand', frame:'#1C5A86', awning:['#1C6FB0','#7FD1E8'],
              props:['🪸','🐚','🐢','🦀','🐙','🪸'], hero:'🐋', float:['🫧','🐠'], motion:'rise', dark:true},
  bioPlanet: {wall:'#FCE9C2', wall2:'#F2D08A', pattern:'sky', floor:'#C8B06B', floor2:'#B39B57', floorKind:'grass', frame:'#8A5A2B', awning:['#E08A1E','#FFF4D6'],
              props:['🌴','🦒','🐘','🦓','🦁','🌴'], hero:'☀️', float:['🦜'], motion:'drift'}
};

// English libraries share a bookshelf room, each with its own props
const LIBRARY = {wall:'#F2E6D3', wall2:'#8B5E3C', pattern:'shelves', floor:'#A0522D', floor2:'#8B4513', floorKind:'carpet', frame:'#6B3A1F', awning:['#6B3A1F','#F2E6D3'], hero:'📚', float:['✨'], motion:'drift'};
const LIBRARY_PROPS = {
  elaNouns:['🛋️','📚','🧸','📖','🕯️','🪴'], elaVerbs:['⚽','📚','🚲','🛹','🏀','🪴'], elaDescr:['🌹','📜','🪶','🌙','🎨','🪴'],
  elaSent:['🧩','📚','🔗','✏️','🧩','🪴'], elaPunct:['✏️','❗','📝','❓','✏️','🪴'], elaVocab:['🔤','📖','🔍','🗝️','📚','🪴'],
  elaRead:['🔎','🗺️','📚','🧭','🕯️','🪴'], elaLit:['🎭','🏰','📖','🐉','👑','🪴'], elaInfo:['📰','🌍','📊','🗞️','📚','🪴'], elaWrite:['📝','✒️','📓','💡','📚','🪴']
};
const SUBJECT_FALLBACK = {math:'cafe', history:'histOrigins', biology:'bioChem'};

export function roomTheme(id, subject){
  if (ROOMS[id]) return ROOMS[id];
  if (LIBRARY_PROPS[id] || subject === 'english') return {...LIBRARY, props: LIBRARY_PROPS[id] || LIBRARY_PROPS.elaNouns};
  return ROOMS[SUBJECT_FALLBACK[subject]] || null;
}

/* ---------- colors ---------- */
const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
const NIGHT = '#1E1419';
const darkMode = () => typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme !== 'light';
const svg = (w, h, body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${body}</svg>`)}")`;

/* ---------- wallpaper and floor patterns (a = main color, b = accent) ---------- */
const WALLS = {
  stripes: (a, b) => `repeating-linear-gradient(90deg,${a} 0 38px,${b} 38px 76px)`,
  checks:  (a, b) => `repeating-conic-gradient(${a} 0 25%,${b} 0 50%) 0 0/56px 56px`,
  dots:    (a, b) => `radial-gradient(${b} 7px,transparent 8px) 0 0/44px 44px, radial-gradient(${mix(b, '#7FB3E6', .5)} 7px,transparent 8px) 22px 22px/44px 44px, ${a}`,
  tiles:   (a, b) => `${svg(64, 32, `<rect width='64' height='32' fill='${a}'/><path d='M0 15.5H64M0 31.5H64M32 0V16M1 16V32' stroke='${b}' stroke-width='2'/>`)} 0 0/64px 32px`,
  bricks:  (a, b) => `${svg(80, 40, `<rect width='80' height='40' fill='${a}'/><path d='M0 1H80M0 21H80M20 1V21M60 21V41' stroke='${b}' stroke-width='3'/>`)} 0 0/80px 40px`,
  stars:   (a, b) => `${svg(140, 140, `<rect width='140' height='140' fill='${a}'/><circle cx='20' cy='30' r='1.6' fill='${b}'/><circle cx='95' cy='18' r='1.2' fill='${b}'/><circle cx='60' cy='75' r='2' fill='${b}'/><circle cx='120' cy='95' r='1.4' fill='${b}'/><circle cx='35' cy='120' r='1.1' fill='${b}'/><path d='M105 55l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' fill='${b}'/>`)} 0 0/140px 140px`,
  snow:    (a, b) => `radial-gradient(${b} 2.5px,transparent 3px) 0 0/38px 38px, radial-gradient(${b} 1.5px,transparent 2px) 19px 12px/38px 38px, linear-gradient(180deg,${mix(a, '#9CCFEA', .35)},${a})`,
  sky:     (a, b) => `radial-gradient(ellipse 120px 34px at 18% 22%,${b} 60%,transparent 62%), radial-gradient(ellipse 90px 26px at 72% 12%,${b} 60%,transparent 62%), linear-gradient(180deg,${mix(a, '#7EC8F0', .45)},${a})`,
  drapes:  (a, b) => `repeating-linear-gradient(90deg,${a} 0,${b} 22px,${a} 44px), linear-gradient(${a},${a})`,
  leaves:  (a, b) => `${svg(90, 90, `<rect width='90' height='90' fill='${a}'/><g fill='${b}'><ellipse cx='20' cy='22' rx='11' ry='5' transform='rotate(-35 20 22)'/><ellipse cx='65' cy='40' rx='12' ry='5' transform='rotate(30 65 40)'/><ellipse cx='30' cy='70' rx='10' ry='4.5' transform='rotate(15 30 70)'/><ellipse cx='78' cy='80' rx='9' ry='4' transform='rotate(-50 78 80)'/></g>`)} 0 0/90px 90px`,
  splatter:(a, b) => `${svg(160, 160, `<rect width='160' height='160' fill='${a}'/><circle cx='25' cy='30' r='9' fill='${b}'/><circle cx='38' cy='22' r='3' fill='${b}'/><circle cx='110' cy='45' r='11' fill='#B3E5FC'/><circle cx='124' cy='58' r='4' fill='#B3E5FC'/><circle cx='60' cy='110' r='10' fill='#F8BBD0'/><circle cx='48' cy='124' r='3.5' fill='#F8BBD0'/><circle cx='135' cy='130' r='8' fill='#C8E6C9'/>`)} 0 0/160px 160px`,
  gallery: (a, b) => `${svg(170, 230, `<rect width='170' height='230' fill='${a}'/><rect x='22' y='34' width='126' height='160' rx='3' fill='none' stroke='${b}' stroke-width='5'/><rect x='34' y='46' width='102' height='136' fill='none' stroke='${b}' stroke-width='1.5'/>`)} 0 0/170px 230px`,
  columns: (a, b) => `${svg(150, 300, `<rect width='150' height='300' fill='${a}'/><rect x='55' y='0' width='40' height='300' fill='${b}'/><path d='M63 0V300M75 0V300M87 0V300' stroke='${a}' stroke-width='3'/><rect x='47' y='0' width='56' height='10' fill='${b}'/>`)} 0 0/150px 300px`,
  planks:  (a, b) => `repeating-linear-gradient(90deg,${a} 0 52px,${b} 52px 55px)`,
  glass:   (a, b) => `linear-gradient(90deg,${b} 4px,transparent 4px) 0 0/80px 80px, linear-gradient(${b} 4px,transparent 4px) 0 0/80px 80px, linear-gradient(135deg,${a},${mix(a, '#FFFFFF', .5)} 50%,${a})`,
  water:   (a, b) => `repeating-linear-gradient(100deg,transparent 0 60px,rgba(255,255,255,.07) 60px 90px,transparent 90px 170px), linear-gradient(180deg,${b},${a} 70%,${mix(a, '#0B2A44', .4)})`,
  shelves: (a, b) => `${svg(132, 96, `<rect width='132' height='96' fill='${a}'/><rect x='0' y='84' width='132' height='12' fill='${b}'/><rect x='0' y='0' width='6' height='96' fill='${b}'/><rect x='12' y='34' width='13' height='50' fill='#C0392B'/><rect x='27' y='42' width='10' height='42' fill='#2E86AB'/><rect x='39' y='30' width='15' height='54' fill='#3F9E5A'/><rect x='56' y='46' width='11' height='38' fill='#F2C94C'/><rect x='69' y='38' width='13' height='46' fill='#8E44AD'/><rect x='88' y='50' width='30' height='9' fill='#E67E22' transform='rotate(-8 88 59)'/><rect x='90' y='62' width='34' height='11' fill='#16A085'/><rect x='90' y='73' width='36' height='11' fill='#D35400'/>`)} 0 0/132px 96px`
};
const FLOORS = {
  planks: (a, b) => `repeating-linear-gradient(90deg,${a} 0 78px,${b} 78px 81px)`,
  checks: (a, b) => `repeating-conic-gradient(${a} 0 25%,${b} 0 50%) 0 0/48px 48px`,
  stone:  (a, b) => `${svg(90, 46, `<rect width='90' height='46' fill='${a}'/><path d='M0 1H90M0 24H90M30 1V24M75 24V46' stroke='${b}' stroke-width='3'/>`)} 0 0/90px 46px`,
  marble: (a, b) => `repeating-conic-gradient(${a} 0 25%,${b} 0 50%) 0 0/70px 70px`,
  grass:  (a, b) => `radial-gradient(ellipse 4px 9px at 50% 100%,${b} 90%,transparent) 0 0/14px 12px, linear-gradient(${a},${b})`,
  soil:   (a, b) => `radial-gradient(${b} 2px,transparent 2.5px) 0 0/16px 16px, radial-gradient(${b} 1.5px,transparent 2px) 8px 6px/16px 16px, ${a}`,
  sand:   (a, b) => `radial-gradient(${b} 1.5px,transparent 2px) 0 0/12px 12px, radial-gradient(${b} 1px,transparent 1.5px) 6px 5px/12px 12px, ${a}`,
  ice:    (a, b) => `repeating-linear-gradient(115deg,transparent 0 40px,rgba(255,255,255,.55) 40px 46px,transparent 46px 110px), linear-gradient(${a},${b})`,
  carpet: (a, b) => `radial-gradient(${b} 3px,transparent 3.5px) 0 0/18px 18px, ${a}`,
  hay:    (a, b) => `repeating-linear-gradient(170deg,${a} 0 6px,${b} 6px 8px,${a} 8px 15px)`
};

/* ---------- scene ---------- */
let scene = null, currentRoom = '', lastExtras = '', mqBound = false, lastArgs = null;
const pick = (list, i) => list[i % list.length];

function buildScene(){
  scene = document.createElement('div');
  scene.className = 'room-scene'; scene.setAttribute('aria-hidden', 'true'); scene.hidden = true;
  scene.innerHTML = `<div class="room-wall"></div><div class="room-hero"></div><div class="room-floaties"></div><div class="room-floor"></div><div class="room-pets"></div><div class="room-props"><div class="room-props-l"></div><div class="room-props-r"></div></div>`;
  document.body.prepend(scene);
}

/** Show the room for a building id (or hide the scene with null).
    `extras` = owned decor emoji to add to the room, `pets` = [{emoji, name}] unlocked pets who wander the floor. */
export function applyRoom(id, subject, extras = [], pets = []){
  if (!scene) buildScene();
  const theme = id ? roomTheme(id, subject) : null;
  const body = document.body;
  if (!theme) {
    if (!currentRoom) return;
    currentRoom = ''; scene.hidden = true; body.classList.remove('in-room', 'room-dark');
    ['--awn1','--awn2','--wood','--wood-dark','--room-edge','--room-accent'].forEach(v => body.style.removeProperty(v));
    delete body.dataset.room; return;
  }
  lastArgs = [id, subject, extras, pets];
  const extrasKey = extras.join('') + '|' + pets.map(p => p.emoji).join('');
  if (currentRoom === id && lastExtras === extrasKey && scene.dataset.mode === (darkMode() ? 'd' : 'l')) return;
  currentRoom = id; lastExtras = extrasKey;
  const dark = darkMode(); scene.dataset.mode = dark ? 'd' : 'l';
  const dim = (c, t) => dark ? mix(c, NIGHT, t) : c;
  const wallA = dim(theme.wall, theme.dark ? .45 : .72), wallB = dim(theme.wall2, theme.dark ? .45 : .72);
  const floorA = dim(theme.floor, .55), floorB = dim(theme.floor2, .55);
  scene.querySelector('.room-wall').style.background = (WALLS[theme.pattern] || WALLS.stripes)(wallA, wallB);
  const floor = scene.querySelector('.room-floor');
  floor.style.background = (FLOORS[theme.floorKind] || FLOORS.planks)(floorA, floorB);
  floor.style.borderTopColor = mix(floorB, '#000000', .25);
  scene.querySelector('.room-hero').textContent = theme.hero || '';

  // props: theme props split to the two sides, the student's own decorations join the right side
  const props = theme.props || [], half = Math.ceil(props.length / 2);
  const span = (e, cls = '') => `<span class="${cls}">${e}</span>`;
  scene.querySelector('.room-props-l').innerHTML = props.slice(0, half).map(e => span(e)).join('');
  scene.querySelector('.room-props-r').innerHTML = extras.slice(0, 5).map(e => span(e, 'mine')).join('') + props.slice(half).map(e => span(e)).join('');

  // drifting extras, positions fixed per room so they don't jump on re-render
  const floats = theme.float || [], motion = theme.motion || 'drift';
  let seed = [...id].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) % 9973, 7);
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  scene.querySelector('.room-floaties').innerHTML = floats.length ? Array.from({length:9}, (_, i) => {
    const dur = 16 + rnd() * 14, size = 1.1 + rnd() * 1.1, pos = 3 + rnd() * 94;
    const place = motion === 'drift' ? `top:${8 + rnd() * 62}%` : `left:${pos}%`;
    return `<span class="fl ${motion}" style="${place};font-size:${size.toFixed(2)}rem;animation-duration:${dur.toFixed(1)}s;animation-delay:-${(rnd() * dur).toFixed(1)}s">${pick(floats, i)}</span>`;
  }).join('') : '';

  // unlocked pets stroll back and forth along the floor, each with its own pace and patch of floor
  scene.querySelector('.room-pets').innerHTML = pets.slice(0, 5).map((p, i) => {
    const start = i % 2 ? 66 + ((i * 13) % 14) : 1 + ((i * 11) % 14), range = 8 + ((i * 5) % 7), dur = 9 + ((i * 7) % 8);  // left and right lanes stay visible beside the content
    return `<span class="walker" style="left:${start}%;--range:${range}vw;--dur:${dur}s;--delay:-${(i * 3.1).toFixed(1)}s"><span class="hop">${p.emoji}</span><small>${p.name}</small></span>`;
  }).join('');

  body.dataset.room = id;
  body.classList.add('in-room'); body.classList.toggle('room-dark', !!theme.dark);
  body.style.setProperty('--awn1', theme.awning[0]); body.style.setProperty('--awn2', theme.awning[1]);
  body.style.setProperty('--wood', dim(theme.frame, .3)); body.style.setProperty('--wood-dark', mix(dim(theme.frame, .3), '#000000', .3));
  body.style.setProperty('--room-accent', dim(theme.awning[0], .2));
  scene.hidden = false;

  if (!mqBound && typeof matchMedia === 'function') {
    mqBound = true;
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (currentRoom && lastArgs) { currentRoom = ''; applyRoom(...lastArgs); } });
  }
}
