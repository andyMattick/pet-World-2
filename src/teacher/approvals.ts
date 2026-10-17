/* Approvals (ROADMAP F4, docs/APPROVALS.md): an admin approves new teacher and parent accounts, or removes an
   approval. Shown only to accounts in app_admins; the database checks again on every call. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { esc } from './report';

interface Account { user_id: string; email: string; signed_up: string; confirmed: boolean; last_sign_in: string | null; approved_at: string | null; is_admin: boolean }
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'never');

/** how many accounts are waiting (for the badge); 0 if this account isn't an admin */
export async function waitingCount(sb: SupabaseClient): Promise<number> {
  const { data, error } = await sb.rpc('admin_accounts');
  return error ? 0 : ((data || []) as Account[]).filter(a => !a.approved_at).length;
}

export async function renderApprovals(el: HTMLElement, sb: SupabaseClient, onChange: () => void) {
  if (!el.innerHTML) el.innerHTML = '<p class="muted">Loading…</p>';
  const { data, error } = await sb.rpc('admin_accounts');
  if (error) { el.innerHTML = `<div class="card"><p class="err">${esc(error.message)}</p></div>`; return; }
  const list = (data || []) as Account[], waiting = list.filter(a => !a.approved_at), approved = list.filter(a => a.approved_at);
  const row = (a: Account) => `<tr><td><b>${esc(a.email)}</b>${a.is_admin ? ' <span class="tag i">admin</span>' : ''}${a.confirmed ? '' : ' <span class="muted">(email not confirmed yet)</span>'}</td>
    <td>${esc(day(a.signed_up))}</td><td>${esc(day(a.last_sign_in))}</td>
    <td style="white-space:nowrap">${a.approved_at
      ? (a.is_admin ? `<span class="muted">Approved ${esc(day(a.approved_at))}</span>` : `<span class="muted">Approved ${esc(day(a.approved_at))}</span> <button class="btn small" data-approve="${esc(a.user_id)}" data-on="0">Remove</button>`)
      : `<button class="btn small primary" data-approve="${esc(a.user_id)}" data-on="1">Approve</button>`}</td></tr>`;
  const table = (rows: Account[]) => `<table class="steptable"><thead><tr><th>Account</th><th>Signed up</th><th>Last sign-in</th><th></th></tr></thead><tbody>${rows.map(row).join('')}</tbody></table>`;
  el.innerHTML = `<div class="card"><h2>🔑 Approvals</h2>
    <p class="muted" style="margin-top:0">New teacher and parent accounts can’t make a class until you approve them. After you approve someone, they tap “Check again” on their waiting screen (or sign in again). Removing an approval keeps their classes and students; they just can’t open them until you approve them again.</p>
    <h3>Waiting (${waiting.length})</h3>${waiting.length ? table(waiting) : '<p class="muted">Nobody is waiting.</p>'}
    <h3>Approved (${approved.length})</h3>${approved.length ? table(approved) : '<p class="muted">No approved accounts yet.</p>'}
    <p class="status" id="approvalMsg"></p></div>`;
  el.querySelectorAll<HTMLButtonElement>('[data-approve]').forEach(b => b.addEventListener('click', async () => {
    const on = b.dataset.on === '1', who = list.find(a => a.user_id === b.dataset.approve)?.email || 'this account';
    if (!on && b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Tap again to remove'; setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = 'Remove'; } }, 4000); return; }
    b.disabled = true;
    const { error: e } = await sb.rpc('admin_set_approval', { p_user: b.dataset.approve, p_approve: on });
    if (e) { b.disabled = false; const m = el.querySelector('#approvalMsg'); if (m) { m.className = 'status err'; m.textContent = e.message; } return; }
    await renderApprovals(el, sb, onChange);
    const m = el.querySelector('#approvalMsg'); if (m) m.textContent = on ? `Approved ${who}.` : `Removed the approval for ${who}.`;
    onChange();
  }));
}
