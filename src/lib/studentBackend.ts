import type { SupabaseClient } from '@supabase/supabase-js';
import { makeClient } from './supabase';

export interface StudentInfo {
  student_id: string; name: string; class_id: string; class_name: string; min_station: number;
  class_drills: Record<string, unknown> | null; student_drills: Record<string, unknown> | null;
  state: Record<string, unknown> | null; saved_at: string | null; reset_at: string | null;
}
export interface RosterEntry { out_id: string; out_name: string; out_class: string }
export type JoinResult = 'ok' | 'bad_pin' | 'locked' | 'not_found' | 'no_session' | 'error';
type Table = 'attempts' | 'problems' | 'practice_popups' | 'sprints';

const QUEUE_KEY = 'pettown:queue:';

/**
 * Everything the game needs from Supabase, for a signed-in student:
 * join with class code + name + PIN, load/save the town, and log learning events.
 * Events are queued in localStorage so nothing is lost if the Wi-Fi drops.
 */
class StudentBackend {
  private sb: SupabaseClient | null = makeClient('pt-student');
  me: StudentInfo | null = null;
  private queue: { table: Table; row: Record<string, unknown> }[] = [];
  private flushing = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private saving = false;
  private pendingState: Record<string, unknown> | null = null;

  get enabled() { return !!this.sb; }

  constructor() {
    if (!this.sb) return;
    setInterval(() => { void this.flush(); }, 5000);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { void this.flush(); void this.pushSave(); }
    });
  }

  /** Resume a signed-in student on this device, if there is one. */
  async restore(): Promise<StudentInfo | null> {
    if (!this.sb) return null;
    const { data: { session } } = await this.sb.auth.getSession();
    if (!session) return null;
    const { data, error } = await this.sb.rpc('my_student');
    if (error || !data) return null;
    this.me = data as StudentInfo;
    this.loadQueue();
    return this.me;
  }

  async roster(code: string): Promise<RosterEntry[] | null> {
    if (!this.sb) return null;
    const { data, error } = await this.sb.rpc('class_roster', { p_code: code.trim().toUpperCase() });
    if (error) return null;
    return (data || []) as RosterEntry[];
  }

  async join(studentId: string, pin: string): Promise<JoinResult> {
    if (!this.sb) return 'error';
    let { data: { session } } = await this.sb.auth.getSession();
    if (!session) {
      const { error } = await this.sb.auth.signInAnonymously();
      if (error) return 'error';
    }
    const { data, error } = await this.sb.rpc('claim_student', { p_student: studentId, p_pin: pin });
    if (error) return 'error';
    if (data !== 'ok') return data as JoinResult;
    return (await this.restore()) ? 'ok' : 'error';
  }

  async refreshSettings() {
    if (!this.sb || !this.me) return;
    const { data, error } = await this.sb.rpc('my_student');
    if (error || !data) return;
    const next = data as StudentInfo;
    this.me.class_drills = next.class_drills;
    this.me.student_drills = next.student_drills;
    this.me.min_station = next.min_station;
    this.me.reset_at = next.reset_at;
  }

  async signOut() {
    await this.flush(); await this.pushSave();
    this.me = null; this.queue = [];
    if (this.sb) await this.sb.auth.signOut();
  }

  /** Called on every game save; writes to the server after a short pause. */
  saveSoon(state: Record<string, unknown>) {
    if (!this.me) return;
    this.pendingState = state;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => { void this.pushSave(); }, 2000);
  }

  private async pushSave() {
    if (!this.sb || !this.me || !this.pendingState || this.saving) return;
    this.saving = true;
    const state = this.pendingState; this.pendingState = null;
    const savedAt = typeof state.savedAt === 'number' ? new Date(state.savedAt) : new Date();
    const { error } = await this.sb.from('saves').upsert({ student_id: this.me.student_id, state, saved_at: savedAt.toISOString() });
    this.saving = false;
    if (error && !this.pendingState) { this.pendingState = state; setTimeout(() => { void this.pushSave(); }, 8000); }
    else if (this.pendingState) void this.pushSave();
  }

  log(table: Table, row: Record<string, unknown>) {
    if (!this.me) return;
    this.queue.push({ table, row: { ...row, student_id: this.me.student_id, class_id: this.me.class_id, created_at: new Date().toISOString() } });
    this.persistQueue();
  }

  async flush() {
    if (!this.sb || !this.me || this.flushing || !this.queue.length) return;
    this.flushing = true;
    const batch = this.queue.slice(0, 200);
    const byTable = new Map<Table, Record<string, unknown>[]>();
    batch.forEach(q => { const list = byTable.get(q.table) || []; list.push(q.row); byTable.set(q.table, list); });
    let ok = true;
    for (const [table, rows] of byTable) {
      const { error } = await this.sb.from(table).insert(rows);
      if (error) { ok = false; break; }
    }
    if (ok) { this.queue.splice(0, batch.length); this.persistQueue(); }
    this.flushing = false;
  }

  private persistQueue() {
    if (!this.me) return;
    try { localStorage.setItem(QUEUE_KEY + this.me.student_id, JSON.stringify(this.queue.slice(-2000))); } catch { /* storage full */ }
  }
  private loadQueue() {
    if (!this.me) return;
    try { this.queue = JSON.parse(localStorage.getItem(QUEUE_KEY + this.me.student_id) || '[]'); } catch { this.queue = []; }
  }
}

export const Backend = new StudentBackend();
