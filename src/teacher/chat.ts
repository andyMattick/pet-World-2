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

export function startChatCard(el: HTMLElement, student: { id: string; n: string }, getRaw: () => unknown, save: (value: string | null) => Promise<void>) {
  let replies: ChatReply[] = [], seenAt = 0, timer: ReturnType<typeof setInterval> | null = null, readError = '';
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
    if (next.length !== replies.length || (+(c.seenAt || 0)) !== seenAt) { replies = next; seenAt = +(c.seenAt || 0); render(); }
  }
  function render() {
    const msgs = parseChat(getRaw());
    const all = [...msgs.map(m => ({ ...m, mine: true })), ...replies.map(r => ({ ...r, from: student.n, mine: false }))].sort((a, b) => a.at - b.at).slice(-40);
    const lastMine = msgs.length ? msgs[msgs.length - 1].at : 0;
    el.innerHTML = `<div class="card"><h2>💬 Messages with ${esc(student.n)}</h2>
      <p class="muted" style="margin-top:0">They pop up on ${esc(student.n)}’s screen with your name on them, and she can write back. Her replies show here (checked every 20 seconds).</p>
      <div style="max-height:320px; overflow:auto; display:flex; flex-direction:column; gap:6px; margin:8px 0">${all.length ? all.map(m => `<div style="align-self:${m.mine ? 'flex-end' : 'flex-start'}; max-width:85%; padding:6px 10px; border-radius:12px; background:${m.mine ? '#E7F5FF' : '#FFF3BF'}; color:#222">
        <div style="font-size:.8em; opacity:.75">${esc(m.mine ? m.from : student.n)} · ${esc(when(m.at))}</div><div style="white-space:pre-wrap">${esc(m.text)}</div></div>`).join('') : `<p class="muted">No messages yet.</p>`}</div>
      ${lastMine ? `<p class="muted" style="margin:0 0 6px; font-size:.85em">${seenAt >= lastMine ? `✓ ${esc(student.n)} has seen your last message.` : `${esc(student.n)} hasn’t opened your last message yet.`}</p>` : ''}
      <div class="row" style="flex-wrap:wrap; align-items:flex-end"><label>Your name <input id="chatFrom" maxlength="40" value="${esc(from)}" placeholder="Dad" style="width:9em"></label></div>
      <textarea id="chatText" rows="2" maxlength="1000" style="width:100%" placeholder="Write to ${esc(student.n)}…"></textarea>
      <div class="row"><button type="button" class="btn small primary" id="chatSend">Send</button>${msgs.length ? '<button type="button" class="btn small" id="chatClear">Clear my messages</button>' : ''}</div>
      <p class="status" id="chatMsg" role="status" style="margin:4px 0">${readError ? `Couldn’t read her replies: ${esc(readError)}` : ''}</p></div>`;
    el.querySelector<HTMLButtonElement>('#chatSend')?.addEventListener('click', () => void send());
    el.querySelector<HTMLTextAreaElement>('#chatText')?.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void send(); });
    el.querySelector<HTMLButtonElement>('#chatClear')?.addEventListener('click', () => { if (confirm(`Clear your messages from ${student.n}’s screen? Her replies stay in her town.`)) void save(null).then(render); });
  }
  async function send() {
    const box = el.querySelector<HTMLTextAreaElement>('#chatText'), text = box?.value.trim() || '', name = (el.querySelector<HTMLInputElement>('#chatFrom')?.value.trim() || '').slice(0, 40);
    const msg = el.querySelector('#chatMsg') as HTMLElement | null;
    if (!name) { if (msg) msg.textContent = 'Type your name first (like Dad), so she knows who is writing.'; el.querySelector<HTMLInputElement>('#chatFrom')?.focus(); return; }
    if (!text) { box?.focus(); return; }
    from = name; try { localStorage.setItem(FROM_KEY, name); } catch { /* private mode */ }
    const msgs = [...parseChat(getRaw()), { id: `m${Date.now().toString(36)}`, at: Date.now(), from: name, text: text.slice(0, 1000) }].slice(-MAX);
    try { await save(JSON.stringify({ msgs })); render(); }
    catch (err) { if (msg) msg.textContent = `Not sent: ${String(err)}`; }
  }
  render(); void poll();
  timer = setInterval(() => { void poll(); }, 20000);
}
