/* Math 🧠 Think it through, station by station, for the grown-ups' progress report (game) and the teacher's student page
   (docs: QUESTION-TYPES.md, "Math: Think it through"). Reads the student's S.mathThink records ("cafe:1" → best, tries, …). */
import { SHOPS } from './registry';
import { TYPED_QUESTIONS } from './typedQuestions';

export interface ThinkRecord { best?: number; tries?: number; passed?: boolean; lastScore?: number; questionCount?: number; lastMissed?: string[] }

const escHTML = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/** The station keys that have a Think it through set, in shop and station order. */
export function thinkKeys(): string[] {
  return Object.keys((TYPED_QUESTIONS as Record<string, Record<string, unknown>>).math || {});
}
export function thinkStationName(key: string): string {
  const [shop, id] = key.split(':'), s = (SHOPS as Record<string, { name: string; emoji?: string; stations: { id: number; name: string }[] }>)[shop];
  const st = s?.stations.find(x => x.id === +id);
  return s && st ? `${s.emoji || ''} ${s.name} · ${st.id}. ${st.name}`.trim() : key;
}

/** A table of every set the student has tried: tries, last and best score, passed or not, and what was missed last time. */
export function thinkReportHTML(raw: unknown, required = true): string {
  const store = (raw && typeof raw === 'object' ? raw : {}) as Record<string, ThinkRecord>;
  const keys = thinkKeys(), tried = keys.filter(key => (store[key]?.tries || 0) > 0);
  const notPassed = tried.filter(key => !store[key]?.passed).length;
  const intro = `<p class="muted" style="margin-top:0">Each math station has a short set of select-all, sort, two-part and type-the-answer questions, plus one “explain your thinking” answer for a grown-up to read.${required ? ' A station’s set has to be passed (every question right) before the next station opens.' : ' Passing a set is not required to open the next station.'} A set that isn’t passed comes back at the top of the town as “Practice again.”</p>`;
  if (!tried.length) return `${intro}<p class="muted">No Think it through sets tried yet.</p>`;
  const rows = tried.map(key => {
    const r = store[key] || {}, n = r.questionCount || 2, missed = (r.lastMissed || []).filter(Boolean);
    return `<tr><td>${escHTML(thinkStationName(key))}${missed.length && !r.passed ? `<div class="muted" style="font-size:.85em">Missed last time: ${missed.map(m => `“${escHTML(m)}”`).join('; ')}</div>` : ''}</td>
      <td>${r.tries || 0}</td><td>${r.lastScore ?? '–'} of ${n}</td><td>${r.best ?? 0} of ${n}</td><td>${r.passed ? '✅ Passed' : '🔁 Not yet'}</td></tr>`;
  }).join('');
  return `${intro}<p><b>${tried.length - notPassed}</b> passed · <b>${notPassed}</b> to practice again · <b>${keys.length - tried.length}</b> not tried</p>
    <div class="subject-time-wrap"><table class="steptable think-report"><thead><tr><th>Station</th><th>Tries</th><th>Last</th><th>Best</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
