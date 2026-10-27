/* 💬 Messages between a grown-up and a student (docs/CHAT.md).
   The grown-up writes on the student's page in the teacher app. Messages are saved in quiz_overrides as "chat":
   JSON {msgs:[{id, at, from, text}]}, the same pipe as Bible verses and help answers. Her replies are in her save
   (S.chat.replies), read here every 20 seconds while the card is on screen. Every message she sees is labeled with
   the grown-up's name: it never pretends to be a bot. */
import { ledgerClient } from './ledger';

const esc = (s: unknown) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
export interface ChatMsg { id: string; at: number; from: string; text: string }
export interface ChatReply { id: string; at: number; text: string }
interface ChatSave { replies?: ChatReply[]; seenAt?: number }
const FROM_KEY = 'pw-chat-from', MAX = 60;
const when = (t: number) => new Date(t).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });

export function parseChat(raw: unknown): ChatMsg[] {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const list = v && typeof v === 'object' && Array.isArray((v as { msgs?: unknown }).msgs) ? (v as { msgs: unknown[] }).msgs : [];
    return list.filter((m): m is ChatMsg => !!m && typeof m === 'object' && typeof (m as ChatMsg).id === 'string' && typeof (m as ChatMsg).text === 'string')
      .map(m => ({ id: m.id.slice(0, 40), at: +m.at || 0, from: String(m.from || 'A grown-up').slice(0, 40), text: m.text.slice(0, 1000) })).slice(-MAX);
  } catch { return []; }
}

/** when a grown-up last read her replies (shown to her as ✓ Seen) */
export function parseReadAt(raw: unknown): number {
  try { const v = typeof raw === 'string' ? JSON.parse(raw) : raw; return Math.max(0, +((v as { readAt?: unknown } | null)?.readAt || 0) || 0); } catch { return 0; }
}
const chatJSON = (msgs: ChatMsg[], readAt: number) => JSON.stringify({ msgs, ...(readAt ? { readAt } : {}) });

export function startChatCard(el: HTMLElement, student: { id: string; n: string }, getRaw: () => unknown, save: (value: string | null) => Promise<void>, known?: ChatSave | null) {
  let replies: ChatReply[] = Array.isArray(known?.replies) ? known!.replies!.filter(r => r && typeof r.text === 'string') : [], seenAt = +(known?.seenAt || 0), timer: ReturnType<typeof setInterval> | null = null, readError = '';
  let from = ''; try { from = localStorage.getItem(FROM_KEY) || ''; } catch { /* private mode */ }
  async function poll() {
    if (!el.isConnected) { if (timer) clearInterval(timer); return; }
    if (el.closest('[hidden]') || document.hidden) return;
    const sb = ledgerClient(); if (!sb) return;
    const { data, error } = await sb.from('saves').select('student_id, chat:state->chat').eq('student_id', student.id).maybeSingle();
    if (!el.isConnected) return;
    readError = error ? error.message : '';
    const c = ((data as { chat?: ChatSave } | null)?.chat) || {};
    const next = Array.isArray(c.replies) ? c.replies.filter(r => r && typeof r.text === 'string').map(r => ({ id: String(r.id || ''), at: +r.at || 0, text: String(r.text).slice(0, 1000) })) : [];
    if (next.length !== replies.length || (+(c.seenAt || 0)) !== seenAt) { replies = next; seenAt = +(c.seenAt || 0); render(); try { localStorage.setItem(`pw-chat-read:${student.id}`, String(Date.now())); } catch { /* private mode */ } }
  }
  function render(keepDraft = true) {
    const draft = keepDraft ? el.querySelector<HTMLTextAreaElement>('#chatText')?.value || '' : '', typing = document.activeElement?.id === 'chatText';   // a reply arriving never wipes what you're typing
    const msgs = parseChat(getRaw());
    const all = [...msgs.map(m => ({ ...m, mine: true })), ...replies.map(r => ({ ...r, from: student.n, mine: false }))].sort((a, b) => a.at - b.at).slice(-40);
    const lastMine = msgs.length ? msgs[msgs.length - 1].at : 0;
    el.innerHTML = `<div class="card"><h2>💬 Messages with ${esc(student.n)}</h2>
      <p class="muted" style="margin-top:0">They pop up on ${esc(student.n)}’s screen with your name on them, and she can write back. Her replies show here (checked every 20 seconds). ✓ Sent, ✓✓ Seen; she sees ✓✓ Seen on her replies once this conversation is open.</p>
      <div style="max-height:320px; overflow:auto; display:flex; flex-direction:column; gap:6px; margin:8px 0">${all.length ? all.map(m => `<div style="align-self:${m.mine ? 'flex-end' : 'flex-start'}; max-width:85%; padding:6px 10px; border-radius:12px; background:${m.mine ? '#E7F5FF' : '#FFF3BF'}; color:#222">
        <div style="font-size:.8em; opacity:.75">${esc(m.mine ? m.from : student.n)} · ${esc(when(m.at))}</div><div style="white-space:pre-wrap">${esc(m.text)}</div>${m.mine ? `<div style="font-size:.75em; opacity:.75; text-align:right">${seenAt >= m.at ? `✓✓ Seen` : '✓ Sent'}</div>` : ''}</div>`).join('') : `<p class="muted">No messages yet.</p>`}</div>
      ${lastMine ? `<p class="muted" style="margin:0 0 6px; font-size:.85em">${seenAt >= lastMine ? `✓✓ ${esc(student.n)} has seen your last message${seenAt ? ` (${esc(when(seenAt))})` : ''}.` : `✓ Sent. ${esc(student.n)} hasn’t opened your last message yet.`}</p>` : ''}
      <div class="row" style="flex-wrap:wrap; align-items:flex-end"><label>Your name <input id="chatFrom" maxlength="40" value="${esc(from)}" placeholder="Dad" style="width:9em"></label></div>
      <textarea id="chatText" rows="2" maxlength="1000" style="width:100%" placeholder="Write to ${esc(student.n)}…"></textarea>
      <div class="row"><button type="button" class="btn small primary" id="chatSend">Send</button>${msgs.length ? '<button type="button" class="btn small" id="chatClear">Clear my messages</button>' : ''}</div>
      <p class="status" id="chatMsg" role="status" style="margin:4px 0">${readError ? `Couldn’t read her replies: ${esc(readError)}` : ''}</p></div>`;
    const box = el.querySelector<HTMLTextAreaElement>('#chatText'); if (box && draft) { box.value = draft; if (typing) box.focus(); }
    el.querySelector<HTMLButtonElement>('#chatSend')?.addEventListener('click', () => void send());
    el.querySelector<HTMLTextAreaElement>('#chatText')?.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void send(); });
    el.querySelector<HTMLButtonElement>('#chatClear')?.addEventListener('click', () => { if (confirm(`Clear your messages from ${student.n}’s screen? Her replies stay in her town.`)) void save(null).then(() => render()); });
  }
  async function send() {
    const box = el.querySelector<HTMLTextAreaElement>('#chatText'), text = box?.value.trim() || '', name = (el.querySelector<HTMLInputElement>('#chatFrom')?.value.trim() || '').slice(0, 40);
    const msg = el.querySelector('#chatMsg') as HTMLElement | null;
    if (!name) { if (msg) msg.textContent = 'Type your name first (like Dad), so she knows who is writing.'; el.querySelector<HTMLInputElement>('#chatFrom')?.focus(); return; }
    if (!text) { box?.focus(); return; }
    from = name; try { localStorage.setItem(FROM_KEY, name); } catch { /* private mode */ }
    const msgs = [...parseChat(getRaw()), { id: `m${Date.now().toString(36)}`, at: Date.now(), from: name, text: text.slice(0, 1000) }].slice(-MAX);
    const newest = replies.reduce((a, r) => Math.max(a, r.at), 0);   // writing back means you read her replies
    try { await save(chatJSON(msgs, newest ? Date.now() : parseReadAt(getRaw()))); render(false); }
    catch (err) { if (msg) msg.textContent = `Not sent: ${String(err)}`; }
  }
  /* read receipt: while this conversation is on screen, her newest reply counts as read (saved as readAt, so she sees ✓ Seen) */
  let marking = false;
  async function markSeen() {
    const newest = replies.reduce((a, r) => Math.max(a, r.at), 0);
    if (marking || !newest || newest <= parseReadAt(getRaw()) || !el.isConnected || el.closest('[hidden]') || document.hidden) return;
    marking = true;
    try { await save(chatJSON(parseChat(getRaw()), Date.now())); } catch { /* tried again on the next check */ } finally { marking = false; }
  }
  render(); void poll().then(markSeen);
  timer = setInterval(() => { void poll().then(markSeen); }, 20000);
}

/* ---------- 💬 the Messages panel on the class dashboard ----------
   Every student in the class as a chip (with how many replies came in since you last opened that chat); tap one to
   open the conversation (startChatCard). The panel element survives the dashboard's live refreshes, so a message you
   are typing isn't lost; each refresh only updates the chips and the numbers. "Last read" is kept on this device. */
export interface ChatStudent { id: string; n: string; qx?: Record<string, string> | null; chat?: ChatSave | null }
const READ_KEY = (id: string) => `pw-chat-read:${id}`;
const readAt = (id: string) => { try { return +(localStorage.getItem(READ_KEY(id)) || 0); } catch { return 0; } };
const markRead = (id: string) => { try { localStorage.setItem(READ_KEY(id), String(Date.now())); } catch { /* private mode */ } };
let panelStudents = new Map<string, ChatStudent>(), panelSelected = '', panelSave: (id: string, value: string | null) => Promise<void> = async () => {};
export function messagesPanel(students: ChatStudent[], save: (id: string, value: string | null) => Promise<void>): HTMLElement {
  let el = document.getElementById('msgPanel');
  if (!el) {
    el = document.createElement('div'); el.id = 'msgPanel'; el.className = 'noprint';
    el.innerHTML = '<div class="card"><h2 style="margin-top:0">💬 Messages</h2><p class="muted" style="margin-top:0">Write to any student. It pops up in their town with your name on it, and they can write back.</p><div class="row" data-msg-chips style="flex-wrap:wrap"></div><div class="row" data-msg-notify style="margin-top:6px"></div></div><div data-msg-thread></div>';
    el.addEventListener('click', e => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-msg-student]'); if (!b) return;
      openThread(el!, b.dataset.msgStudent || '');
    });
  }
  panelStudents = new Map(students.map(s => [s.id, s])); panelSave = save;
  drawNotify(el); startChatAlerts(students);
  const chips = el.querySelector('[data-msg-chips]') as HTMLElement;
  chips.innerHTML = students.length ? students.map(s => {
    const replies = Array.isArray(s.chat?.replies) ? s.chat!.replies! : [], fresh = replies.filter(r => +r.at > readAt(s.id)).length, sent = parseChat(s.qx?.chat).length;
    return `<button type="button" class="btn small${s.id === panelSelected ? ' primary' : ''}" data-msg-student="${esc(s.id)}" aria-pressed="${s.id === panelSelected}">${esc(s.n)}${fresh ? ` <b style="background:#E03131;color:#fff;border-radius:999px;padding:0 6px">${fresh} new</b>` : sent || replies.length ? ' 💬' : ''}</button>`;
  }).join('') : '<p class="muted">No students in this class yet.</p>';
  if (panelSelected && !panelStudents.has(panelSelected)) { panelSelected = ''; (el.querySelector('[data-msg-thread]') as HTMLElement).innerHTML = ''; }
  return el;
}
function openThread(el: HTMLElement, id: string) {
  const s = panelStudents.get(id); if (!s) return;
  panelSelected = id; markRead(id);
  el.querySelectorAll<HTMLButtonElement>('[data-msg-student]').forEach(b => { const on = b.dataset.msgStudent === id; b.classList.toggle('primary', on); b.setAttribute('aria-pressed', String(on)); if (on) b.querySelector('b')?.remove(); });
  const host = el.querySelector('[data-msg-thread]') as HTMLElement;
  host.innerHTML = '<div></div>';   // a fresh element: the old conversation's 20-second check stops on its own
  startChatCard(host.firstElementChild as HTMLElement, { id, n: s.n }, () => panelStudents.get(id)?.qx?.chat,
    async value => { await panelSave(id, value); markRead(id); }, s.chat);   // her replies from the dashboard's load show right away
}

/* ---------- 🔔 message notifications (docs/CHAT.md) ----------
   An option on this device: when a student writes, show a pop-up on the dashboard, play a short sound, and send a
   device notification (with the browser's permission). Checked every 30 seconds while the teacher app is open, even
   in a background tab. It can't reach you when the teacher app is closed. */
const NOTIFY_KEY = 'pw-chat-notify';
const notifyWanted = () => { try { return localStorage.getItem(NOTIFY_KEY) === '1'; } catch { return false; } };
const canNotify = () => typeof Notification !== 'undefined' && Notification.permission === 'granted';
function drawNotify(el: HTMLElement) {
  const box = el.querySelector('[data-msg-notify]') as HTMLElement | null; if (!box) return;
  const on = notifyWanted();
  box.innerHTML = `<button type="button" class="btn small" data-chat-notify="${on ? 'off' : 'on'}">${on ? '🔔 Message notifications on' : '🔕 Notify me when a student writes'}</button>${on && !canNotify() ? '<small class="muted" style="align-self:center">Pop-ups only: the browser is blocking notifications for this site.</small>' : on ? '<small class="muted" style="align-self:center">A pop-up, a sound, and a notification on this device while the teacher app is open.</small>' : ''}`;
  box.querySelector<HTMLButtonElement>('[data-chat-notify]')?.addEventListener('click', async e => {
    const turnOn = (e.currentTarget as HTMLButtonElement).dataset.chatNotify === 'on';
    try { if (turnOn) localStorage.setItem(NOTIFY_KEY, '1'); else localStorage.removeItem(NOTIFY_KEY); } catch { /* private mode */ }
    if (turnOn && typeof Notification !== 'undefined' && Notification.permission === 'default') { try { await Notification.requestPermission(); } catch { /* older browsers */ } }
    drawNotify(el);
  });
}
let alertTimer: ReturnType<typeof setInterval> | null = null, alertIds = '';
const lastTold: Record<string, number> = {};
function chime() {
  try { const a = new AudioContext(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(.15, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .5); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5); } catch { /* no sound */ }
}
function popUp(text: string) {
  let box = document.getElementById('chatToasts');
  if (!box) { box = document.createElement('div'); box.id = 'chatToasts'; box.setAttribute('aria-live', 'polite'); box.style.cssText = 'position:fixed; left:12px; bottom:12px; z-index:50; display:flex; flex-direction:column; gap:8px; max-width:min(380px, calc(100vw - 24px))'; document.body.appendChild(box); }
  const n = document.createElement('div'); n.className = 'card'; n.style.cssText = 'margin:0; padding:10px 12px; box-shadow:0 6px 18px #0004; cursor:pointer'; n.textContent = text; n.title = 'Click to close';
  n.addEventListener('click', () => { n.remove(); document.getElementById('msgPanel')?.scrollIntoView({ behavior: 'smooth' }); });
  box.appendChild(n); setTimeout(() => n.remove(), 30000);
}
export function startChatAlerts(students: { id: string; n: string; chat?: ChatSave | null }[]) {
  const ids = students.map(s => s.id).sort().join(',');
  students.forEach(s => { if (!(s.id in lastTold)) lastTold[s.id] = Math.max(Date.now(), ...((s.chat?.replies || []).map(r => +r.at || 0))); });   // only replies from now on
  if (alertTimer && ids === alertIds) return;
  if (alertTimer) clearInterval(alertTimer);
  alertIds = ids;
  const names = new Map(students.map(s => [s.id, s.n]));
  const tick = async () => {
    if (!notifyWanted() || !names.size) return;
    const sb = ledgerClient(); if (!sb) return;
    const { data, error } = await sb.from('saves').select('student_id, chat:state->chat').in('student_id', [...names.keys()]);
    if (error) return;
    for (const row of (data || []) as { student_id: string; chat: ChatSave | null }[]) {
      const fresh = (row.chat?.replies || []).filter(r => r && +r.at > (lastTold[row.student_id] || 0)).sort((a, b) => a.at - b.at);
      if (!fresh.length) continue;
      lastTold[row.student_id] = fresh[fresh.length - 1].at;
      const name = names.get(row.student_id) || 'Your student', last = fresh[fresh.length - 1], text = `💬 ${name}${fresh.length > 1 ? ` (${fresh.length} new)` : ''}: ${String(last.text).slice(0, 140)}`;
      popUp(text); chime();
      if (canNotify()) { try { new Notification(`💬 New message from ${name}`, { body: String(last.text).slice(0, 200), tag: `chat:${row.student_id}:${last.at}` }); } catch { /* some phones only allow notifications from an installed app */ } }
    }
  };
  alertTimer = setInterval(() => { void tick(); }, 30000);
}
