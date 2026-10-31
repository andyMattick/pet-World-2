// 🤖 Help bot check (docs/HELP-BOT.md): sample questions → expected destinations, plus index coverage.
// Run: npx tsx scripts/check-help-bot.mjs   (or: tsx scripts/check-help-bot.mjs)
import { buildIndex, ask, studentEntries, teacherEntries, teacherItemSettings, fromSharedSettings, TEACHER_SETTINGS, STUDENT_SPOTS } from '../src/shared/helpBot.ts';
import { BUILDINGS, NEIGHBORHOODS, SUBJECTS, SHOPS, SKILLS, ARCADE_GAMES } from '../src/shared/registry.ts';
import { BRAIN_GAMES } from '../src/shared/brainGames.ts';
import { MOVES } from '../src/shared/moveBreaks.ts';
import { THEME_DAYS } from '../src/shared/themeDays.ts';

const student = buildIndex(studentEntries({ BUILDINGS, NEIGHBORHOODS, SUBJECTS, SHOPS, SKILLS, ARCADE_GAMES, BRAIN_GAMES }));
// Quinn's shared settings list, when it's in the repo (or SETTINGS_LIST=<path> to try another copy)
let shared = [];
try { const m = await import(process.env.SETTINGS_LIST || '../src/teacher/settingsList.ts'); shared = fromSharedSettings(m.TEACHER_SETTINGS, m.SETTING_GROUPS); } catch { /* not there yet: the bot's own list covers Settings */ }
const teacherSettings = [...shared, ...TEACHER_SETTINGS, ...teacherItemSettings({ ARCADE_GAMES, BRAIN_GAMES, MOVES, THEME_DAYS })];
const teacher = buildIndex(teacherEntries(teacherSettings, [{ id: 'brain', name: 'Brain stretches', what: 'One brain break a day.' }]));

// [question, expected go (or entry id, or status:next), context]
const S = [
  ['Where do I start?', 'status:next'],
  ['what should i do next', 'status:next'],
  ['Find the Arcade', 'spot:arcade'],
  ['games', 'spot:arcade'],
  ['i want to play games', 'spot:arcade'],
  ['How do I take a test?', 'faq:test'],
  ['where is the bakkery', 'building:bakery'],
  ['fractions', 'building:bakery', { hood: 'g6' }],
  ['fractions', 'building:pizza', { hood: 'g4' }],
  ['ratios', 'building:cafe', { hood: 'g6' }],
  ['negative numbers', 'building:rink'],
  ['times tables', 'spot:sprint'],
  ['spelling words', 'spot:vocab'],
  ['take me to my room', 'spot:room'],
  ['bible verse', 'spot:bible'],
  ['photosynthesis', 'building:bioEnergy'],
  ['where is the potoin lab', 'building:potion'],
  ['mine walker', 'game:mine-walker'],
  ['corsairs cove', 'game:corsairs-cove'],
  ['why is the clock tower locked', 'faq:locked|building:clock'],
  ['why are things locked', 'faq:locked'],
  ['how do i get more coins', 'faq:coins'],
  ['turn off music', 'faq:music'],
  ['read it to me', 'faq:readaloud'],
  ['double number lines', 'building:cafe'],
  ['pronouns', 'building:elaPron'],
  ['history', 'class:history'],
  ['donde estan los juegos', 'spot:arcade'],
  // phrased differently from the chips and keys (added after the first pass, to check it isn't only tuned to its own list)
  ['how do coins work', 'faq:coins'],
  ['wheres the ice skating rink', 'building:rink'],
  ['i want to decorate my room', 'spot:room'],
  ['how do i hear the question', 'faq:readaloud'],
  ['where are my stickers', 'spot:book'],
  ['im stuck and need my teacher', 'faq:question'],
  ['volume and surface area', 'building:post'],
  ['cellular respiration', 'building:bioEnergy'],
  ['commas', 'building:elaPunct'],
  ['lemonade stand', 'building:lemonade'],
  ['potion detectiv', 'game:potion-detective'],
  ['what is today\'s video', 'faq:video'],
  // teacher
  ['print pin cards', 'tab:roster', null, 'teacher'],
  ['where do i change the pass mark', 'sel:#quizPassPct', null, 'teacher'],
  ['turn on free play', 'sel:#arcadeFreePlay', null, 'teacher'],
  ['hide youtube', 'sel:#useYouTube', null, 'teacher'],
  ['stop the still there popup', 'sel:#idleOn', null, 'teacher'],
  ['edit a question', 'tab:lessons', null, 'teacher'],
  ['spelling words for a student', 'tab:vocab', null, 'teacher'],
  ['delete this class', 'sel:#delCls', null, 'teacher'],
  ['Add students', 'tab:roster', null, 'teacher'],
  ['Reset a PIN', 'faq:resetPin', null, 'teacher'],
  ['reset password', 'faq:resetPin', null, 'teacher'],
  ['Turn off brain stretches', 'sel:#brainEnabled', null, 'teacher'],
  ['disable brian stretches', 'sel:#brainEnabled', null, 'teacher'],
  ['Quick setup', 'tab:setup', null, 'teacher'],
  ['stop the music', 'sel:#allowMusic', null, 'teacher'],
  ['turn off mine walker', 'sel:[data-arcade-game="mine-walker"]', null, 'teacher'],
  ['how many questions on a unit test', 'sel:#testPerSkill', null, 'teacher'],
  ['open a unit for everyone', 'sel:[data-open-unit]', null, 'teacher'],
  ['kid is locked out', 'faq:resetPin', null, 'teacher'],
  ['pajama day', 'sel:[data-themeday="pajamas"]', null, 'teacher'],
  ['see a students town', 'faq:look', null, 'teacher'],
  ['grades', 'faq:grades', null, 'teacher']
];
let pass = 0; const fails = [];
for (const [q, want, ctx, side] of S) {
  const r = ask(side === 'teacher' ? teacher : student, q, ctx || {});
  const top = r.hits[0]?.entry;
  const ok = want.startsWith('status:') ? r.status === want.slice(7)
    : want.includes('|') ? top && [top.id, top.go].includes(want.split('|')[0]) && r.hits.slice(1).some(h => [h.entry.id, h.entry.go].includes(want.split('|')[1]))
    : (r.status === 'sure' || r.status === 'maybe') && top && (top.go === want || top.id === want);
  if (ok) pass++; else fails.push(`  ✗ "${q}" → ${r.status} ${top ? `${top.id} (${r.hits[0].score.toFixed(2)})` : ''}; wanted ${want}` + (r.hits[1] ? ` | 2nd ${r.hits[1].entry.id} ${r.hits[1].score.toFixed(2)}` : ''));
}
// coverage: every building, Arcade game, brain game, town spot and teacher setting is in an index
const problems = [];
const sIds = new Set(student.docs.map(d => d.entry.id)), tIds = new Set(teacher.docs.map(d => d.entry.id));
for (const b of BUILDINGS) if (!sIds.has('building:' + b.id)) problems.push('building ' + b.id);
for (const g of ARCADE_GAMES) if (g.available && !sIds.has('game:' + g.id)) problems.push('arcade game ' + g.id);
for (const g of BRAIN_GAMES) if (!sIds.has('brain:' + g.id)) problems.push('brain game ' + g.id);
for (const s of STUDENT_SPOTS) if (!sIds.has('spot:' + s.id)) problems.push('town spot ' + s.id);
for (const s of teacherSettings) if (!tIds.has((s.tab === 'shared' ? 'shared:' : 'setting:') + s.id)) problems.push('teacher setting ' + s.id);
for (const g of ARCADE_GAMES) if (!tIds.has('setting:arcade-game:' + g.id)) problems.push('teacher arcade switch ' + g.id);

const rate = Math.round(pass / S.length * 100);
console.log(`Help bot: ${pass}/${S.length} sample questions (${rate}%). Index: ${student.docs.length} student entries, ${teacher.docs.length} teacher entries${shared.length ? ` (with ${shared.length} from the shared settings list)` : ''}.`);
fails.forEach(f => console.log(f));
if (problems.length) console.log('Missing from the index:\n  ' + problems.join('\n  '));
if (problems.length || rate < 90) process.exit(1);
