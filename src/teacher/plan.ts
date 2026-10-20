/* The daily plan on a student's page (ROADMAP F10, docs/DAILY-PLAN.md): a list of items for each weekday, and changes for
   single days. Saved in quiz_overrides as "plan" (JSON): {week:{mon:[item], ...}, days:{"YYYY-MM-DD":[item]}}. The game
   shows the day's items on the town page with ✅ / ⏳ / ⬜, opens the right unit, and moves unfinished items to the next day. */
import { BUILDINGS } from '../shared/registry';
import { subjectDayKey } from '../shared/subjectTime';

interface PlanItem { id: string; kind: 'subject' | 'unit' | 'project'; subject?: string; unit?: string; what?: 'practice' | 'quiz' | 'test'; project?: string; minutes?: number }
interface PlanSettings { week?: Record<string, PlanItem[]>; days?: Record<string, PlanItem[]> }

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const WEEK: [string, string][] = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SUBJECTS: [string, string][] = [['math', '➗ Math'], ['english', '📚 English'], ['history', '🏛️ History'], ['biology', '🦁 Biology'], ['reading', '📖 Reading Log']];
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const UNITS = BUILDINGS.filter(b => b.open);
let pick = 'mon';   // the weekday or date being edited

function parsePlan(raw: unknown): PlanSettings {
  try { const v = typeof raw === 'string' ? JSON.parse(raw) : raw; return v && typeof v === 'object' && !Array.isArray(v) ? v as PlanSettings : {}; } catch { return {}; }
}
function label(x: PlanItem, projects: Record<string, string>) {
  const unit = UNITS.find(b => b.id === x.unit), unitName = unit ? `${unit.emoji} ${unit.name}` : x.unit;
  if (x.kind === 'subject') return `${SUBJECTS.find(s => s[0] === x.subject)?.[1] || x.subject}: ${x.minutes || 15} min${x.subject === 'reading' ? '' : ' in the next unit'}`;
  if (x.kind === 'unit') return x.what === 'quiz' ? `Pass a quiz in the ${unitName}` : x.what === 'test' ? `Pass the unit test in the ${unitName}` : `Practice in the ${unitName}: ${x.minutes || 15} min`;
  return `📁 ${projects[x.project || ''] || x.project}`;
}
const dayName = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

export function renderPlanCard(el: HTMLElement, name: string, projects: Record<string, string>, getRaw: () => unknown, save: (value: string | null) => Promise<void>) {
  const s = parsePlan(getRaw()), week = s.week || {}, days = s.days || {}, today = subjectDayKey();
  const isDate = DAY.test(pick), weekday = isDate ? DOW[new Date(`${pick}T12:00:00`).getDay()] : pick;
  const own = isDate ? days[pick] : week[pick], items = own || (isDate ? week[weekday] || [] : []);
  const changed = Object.keys(days).filter(d => d >= today).sort();
  const unitOptions = SUBJECTS.filter(([sid]) => sid !== 'reading').map(([sid, sname]) => `<optgroup label="${esc(sname)}">${UNITS.filter(b => b.subject === sid).map(b => `<option value="${esc(b.id)}">${esc(`${b.emoji} ${b.name} (${b.unit})`)}</option>`).join('')}</optgroup>`).join('');
  el.innerHTML = `<p class="muted" style="margin-top:0">What ${esc(name)} does each day, shown on the town page as “Today’s plan” with ✅ done, ⏳ sent and waiting for you, or ⬜ to do, and a Go button that opens the right place. Extras show in the same list. This is where each subject’s minutes are set (there are no separate time goals). Anything not done when ${esc(name)} taps “I’m done for today” moves to the next day.</p>
    <div class="row noprint subject-tabs">${WEEK.map(([id, n]) => `<button type="button" class="btn small subject-tab" data-plan-pick="${id}" aria-pressed="${pick === id}">${n.slice(0, 3)}</button>`).join('')}
      <label>One day <input type="date" id="planDate" value="${isDate ? esc(pick) : ''}" min="${esc(today)}"></label></div>
    ${changed.length ? `<p class="muted" style="margin:0">Days with their own plan: ${changed.map(d => `<button class="btn small" data-plan-pick="${esc(d)}">${esc(dayName(d))}</button>`).join(' ')}</p>` : ''}
    <h3>${isDate ? `${esc(dayName(pick))} only` : `Every ${esc(WEEK.find(w => w[0] === pick)?.[1] || pick)}`}</h3>
    ${isDate ? (own ? `<p class="muted" style="margin:0">This day has its own plan. <button class="btn small" id="planUseWeek">Use the ${esc(WEEK.find(w => w[0] === weekday)?.[1])} plan again</button></p>` : `<p class="muted" style="margin:0">This day follows the ${esc(WEEK.find(w => w[0] === weekday)?.[1])} plan. Adding or removing an item changes this day only.</p>`) : ''}
    ${items.length ? `<table class="steptable">${items.map((x, i) => `<tr><td>${esc(label(x, projects))}</td><td style="white-space:nowrap">${i ? `<button class="btn small" data-plan-up="${i}" aria-label="Move up">↑</button> ` : ''}<button class="btn small" data-plan-remove="${i}">Remove</button></td></tr>`).join('')}</table>` : '<p class="muted">Nothing planned.</p>'}
    <h3>Add to this ${isDate ? 'day' : 'weekday'}</h3>
    <div class="row"><label>What <select id="planKind"><option value="subject">Time in a subject (next unit)</option><option value="practice">Practice in a unit</option><option value="quiz">Pass a quiz in a unit</option><option value="test">Pass a unit test</option><option value="project">A project</option></select></label>
      <label data-plan-for="subject">Subject <select id="planSubject">${SUBJECTS.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join('')}</select></label>
      <label data-plan-for="practice quiz test" hidden>Unit <select id="planUnit">${unitOptions}</select></label>
      <label data-plan-for="project" hidden>Project <select id="planProject">${Object.entries(projects).map(([id, t]) => `<option value="${esc(id)}">${esc(t)}</option>`).join('')}</select></label>
      <label data-plan-for="subject practice">Minutes <input type="number" id="planMin" min="1" max="240" value="15" style="width:70px"></label>
      <button class="btn small primary" id="planAdd">Add</button></div>
    ${isDate ? '' : `<div class="row"><button class="btn small" id="planCopy">Copy ${esc(WEEK.find(w => w[0] === pick)?.[1])} to Monday–Friday</button></div>`}
    <p class="status" id="planMsg"></p>`;
  const kind = el.querySelector<HTMLSelectElement>('#planKind')!;
  const showFields = () => el.querySelectorAll<HTMLElement>('[data-plan-for]').forEach(f => { f.hidden = !f.dataset.planFor!.split(' ').includes(kind.value); });
  kind.addEventListener('change', showFields);
  const again = () => renderPlanCard(el, name, projects, getRaw, save);
  async function store(nextItems: PlanItem[] | null, msg: string, allWeekdays = false) {
    const next: PlanSettings = { week: { ...week }, days: Object.fromEntries(Object.entries(days).filter(([d]) => d >= today)) };
    if (allWeekdays && nextItems) ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(d => { next.week![d] = nextItems.map(x => ({ ...x })); });
    else if (isDate) { if (nextItems) next.days![pick] = nextItems; else delete next.days![pick]; }
    else if (nextItems && nextItems.length) next.week![pick] = nextItems; else delete next.week![pick];
    const empty = !Object.keys(next.week!).length && !Object.keys(next.days!).length;
    await save(empty ? null : JSON.stringify(next));
    again();
    const m = el.querySelector('#planMsg'); if (m) m.textContent = msg;
  }
  el.querySelectorAll<HTMLButtonElement>('[data-plan-pick]').forEach(b => b.addEventListener('click', () => { pick = b.dataset.planPick!; again(); }));
  el.querySelector<HTMLInputElement>('#planDate')!.addEventListener('change', e => { const v = (e.target as HTMLInputElement).value; if (DAY.test(v)) { pick = v; again(); } });
  el.querySelector('#planUseWeek')?.addEventListener('click', () => { void store(null, 'This day follows the weekly plan again.'); });
  el.querySelectorAll<HTMLButtonElement>('[data-plan-remove]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.planRemove!; void store(items.filter((_, j) => j !== i), 'Removed.'); }));
  el.querySelectorAll<HTMLButtonElement>('[data-plan-up]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.planUp!, next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; void store(next, 'Moved.'); }));
  el.querySelector('#planCopy')?.addEventListener('click', () => { void store(items, 'Copied to Monday through Friday.', true); });
  el.querySelector('#planAdd')!.addEventListener('click', () => {
    const k = kind.value, id = `p${Date.now().toString(36)}`, minutes = Math.max(1, Math.min(240, Math.round(+(el.querySelector<HTMLInputElement>('#planMin')?.value || 15)) || 15));
    const item: PlanItem = k === 'subject' ? { id, kind: 'subject', subject: el.querySelector<HTMLSelectElement>('#planSubject')!.value, minutes }
      : k === 'project' ? { id, kind: 'project', project: el.querySelector<HTMLSelectElement>('#planProject')!.value }
      : { id, kind: 'unit', unit: el.querySelector<HTMLSelectElement>('#planUnit')!.value, what: k as 'practice' | 'quiz' | 'test', ...(k === 'practice' ? { minutes } : {}) };
    void store([...items, item].slice(0, 20), 'Added.');
  });
  showFields();
}
