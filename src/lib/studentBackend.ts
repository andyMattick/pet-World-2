import type { SupabaseClient } from '@supabase/supabase-js';
import { makeClient } from './supabase';

export interface StudentInfo {
  student_id: string; name: string; class_id: string; class_name: string; min_station: number;
  class_drills: Record<string, unknown> | null; student_drills: Record<string, unknown> | null;
  quiz_settings: Record<string, unknown>; quiz_overrides: Record<string, unknown> | null;
  state: Record<string, unknown> | null; saved_at: string | null; reset_at: string | null;
}
export interface RosterEntry { out_id: string; out_name: string; out_class: string }
export type JoinResult = 'ok' | 'bad_pin' | 'locked' | 'not_found' | 'no_session' | 'error';
type Table = 'attempts' | 'problems' | 'practice_popups' | 'sprints' | 'assessments';

const QUEUE_KEY = 'pettown:queue:';

/**
 * Counts active practice time: every 15 seconds, if the tab is visible and the student
 * tapped, clicked, or typed in the last minute, 15 seconds are added. About once a minute,
 * and when the tab is hidden, the seconds are handed to `onReport`. If it returns false
 * (for example, offline), the seconds are kept for the next report.
 * Used for signed-in students (session_ping) and, in local mode, for the town's own log.
 */
export class ActivityTracker {
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private reportTimer: ReturnType<typeof setInterval> | null = null;
  private lastInput = 0;
  private pending = 0;
  private reporting = false;
  private readonly onInput = () => { this.lastInput = Date.now(); };
  private readonly onVisibility = () => { if (document.hidden) void this.report(); };

  constructor(private readonly onReport: (seconds: number) => Promise<boolean> | boolean) {}

  start() {
    this.stop();
    this.lastInput = Date.now();
    for (const type of ['pointerdown', 'keydown', 'touchstart']) document.addEventListener(type, this.onInput, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.tickTimer = setInterval(() => {
      if (!document.hidden && Date.now() - this.lastInput < 60000) this.pending += 15;
    }, 15000);
    this.reportTimer = setInterval(() => { void this.report(); }, 60000);
  }

  /** Hand pending seconds to onReport; keep them if the report fails. */
  async report() {
    if (this.reporting || this.pending <= 0) return;
    this.reporting = true;
    const seconds = this.pending; this.pending = 0;
    let ok = false;
    try { ok = await this.onReport(seconds); } catch { ok = false; }
    if (!ok) this.pending += seconds;
    this.reporting = false;
  }

  stop() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.reportTimer) clearInterval(this.reportTimer);
    this.tickTimer = this.reportTimer = null;
    for (const type of ['pointerdown', 'keydown', 'touchstart']) document.removeEventListener(type, this.onInput);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }
}

/** Rough device type for practice sessions. */
export function deviceType(): 'phone' | 'tablet' | 'computer' {
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  if (!coarse) return 'computer';
  return Math.min(screen.width, screen.height) < 700 ? 'phone' : 'tablet';
}

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
  private sessionId: number | null = null;
  private tracker: ActivityTracker | null = null;

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
    this.me.quiz_settings = next.quiz_settings;
    this.me.quiz_overrides = next.quiz_overrides;
    this.me.min_station = next.min_station;
    this.me.reset_at = next.reset_at;
  }

  /**
   * Start counting practice time for the signed-in student. Any earlier tracker is
   * stopped first, so calling this twice never double-counts.
   */
  async startSession() {
    this.tracker?.stop();
    this.tracker = null;
    this.sessionId = null;
    if (!this.sb || !this.me) return;
    const tracker = new ActivityTracker(seconds => this.ping(seconds));
    this.tracker = tracker;
    tracker.start();
    await this.openSession();
  }

  private async openSession(): Promise<boolean> {
    if (!this.sb || !this.me) return false;
    const { data, error } = await this.sb.rpc('session_start', { p_device: deviceType() });
    if (error || typeof data !== 'number') return false;
    this.sessionId = data;
    return true;
  }

  /** Report active seconds. Returns false to keep them for the next report (offline, no session yet). */
  private async ping(seconds: number): Promise<boolean> {
    if (!this.sb || !this.me) return true;           // signed out: nothing to report to
    if (this.sessionId === null && !(await this.openSession())) return false;
    const { data, error } = await this.sb.rpc('session_ping', { p_id: this.sessionId, p_active: seconds });
    if (error) return false;
    if (data === true) return true;
    // the session was closed after 30 idle minutes: start a new one and report there
    if (!(await this.openSession())) return false;
    const again = await this.sb.rpc('session_ping', { p_id: this.sessionId, p_active: seconds });
    return !again.error && again.data === true;
  }

  /** Send the last report and stop counting. */
  async endSession() {
    const tracker = this.tracker;
    this.tracker = null;
    if (tracker) { await tracker.report(); tracker.stop(); }
    this.sessionId = null;
  }

  async signOut() {
    await this.endSession();
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
    const retryTables = new Set<Table>();
    for (const [table, rows] of byTable) {
      const { error } = await this.sb.from(table).insert(rows);
      if (error) {
        // Only permanent data errors are unfixable by retrying; everything else (auth, RLS, server, network) stays queued.
        const permanent = /^22|^23/.test(error.code) || error.code === '42703' || error.code === 'PGRST204';
        if (permanent) console.warn(`[Backend] dropping ${rows.length} row(s) for ${table}: ${error.code}`);
        else retryTables.add(table);
      }
    }
    this.queue = [...batch.filter(q => retryTables.has(q.table)), ...this.queue.slice(batch.length)];
    this.persistQueue();
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
