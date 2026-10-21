import type { SupabaseClient } from '@supabase/supabase-js';
import { makeClient } from './supabase';

export interface StudentInfo {
  student_id: string; name: string; class_id: string; class_name: string; min_station: number;
  class_drills: Record<string, unknown> | null; student_drills: Record<string, unknown> | null;
  quiz_settings: Record<string, unknown>; quiz_overrides: Record<string, unknown> | null;
  game_settings?: { openUnits?: string[]; allowMusic?: boolean; [key: string]: unknown } | null;
  lesson_links?: Record<string, { url?: string; title?: string; note?: string; showKhan?: boolean }> | null;
  question_edits?: { hidden?: string[]; edited?: Record<string, unknown>; added?: Record<string, unknown[]> } | null;
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

  /** onActive (optional) hears about each 15 active seconds as they're counted, e.g. to credit them to a subject. */
  constructor(private readonly onReport: (seconds: number) => Promise<boolean> | boolean, private readonly onActive?: (seconds: number) => void) {}

  start() {
    this.stop();
    this.lastInput = Date.now();
    for (const type of ['pointerdown', 'keydown', 'touchstart']) document.addEventListener(type, this.onInput, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.tickTimer = setInterval(() => {
      if (!document.hidden && Date.now() - this.lastInput < 60000) { this.pending += 15; try { this.onActive?.(15); } catch { /* never stop the clock */ } }
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
  /** saved_at of the newest save this device has loaded or written; a newer one on the server came from another device */
  private lastSyncedAt = 0;
  /** set by the game: merges a newer save from another device into the open town (docs: PRACTICE-TIME.md, "Two devices") */
  onRemoteSave: ((state: Record<string, unknown>) => void) | null = null;
  /** called after refreshSettings() loads the newest teacher settings and overrides */
  onSettings: (() => void) | null = null;
  /** called when this browser's sign-in now belongs to a different student (another tab signed in as someone else).
      From then on this tab sends nothing, so one student's town can never be saved or merged into another's. */
  onAccountSwitch: (() => void) | null = null;
  private switched = false;
  /** Look only (docs/LOOK-ONLY.md): a teacher viewing a student's town from the teacher app. Nothing is saved,
      logged or counted, and the student's own sign-in on this browser is never touched. */
  lookOnly = false;

  get enabled() { return !!this.sb; }

  constructor() {
    if (!this.sb) return;
    setInterval(() => { void this.flush(); }, 5000);
    /* every tab on this site shares one sign-in (storage key pt-student): when another tab signs in, check who we are now */
    window.addEventListener('storage', e => { if (this.me && (e.key === null || e.key.startsWith('pt-student'))) void this.refreshSettings(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { void this.flush(); void this.pushSave(); }
    });
  }

  /** Look only: open one of the signed-in teacher's students (teacher_view_student), with the teacher's own sign-in.
      Returns null when no teacher is signed in on this browser or the student isn't in one of their classes. */
  async look(studentId: string): Promise<StudentInfo | null> {
    const teacher = makeClient('pt-teacher');
    if (!teacher) return null;
    const { data: { session } } = await teacher.auth.getSession();
    if (!session) return null;
    const { data, error } = await teacher.rpc('teacher_view_student', { p_student: studentId });
    if (error || !data) return null;
    this.sb = teacher; this.lookOnly = true; this.switched = true;   // switched: saveSoon, pushSave, log and flush never write
    this.me = data as StudentInfo;
    this.lastSyncedAt = this.me.saved_at ? Date.parse(this.me.saved_at) || 0 : 0;
    return this.me;
  }

  /** Resume a signed-in student on this device, if there is one. */
  async restore(): Promise<StudentInfo | null> {
    if (!this.sb) return null;
    const { data: { session } } = await this.sb.auth.getSession();
    if (!session) return null;
    const { data, error } = await this.sb.rpc('my_student');
    if (error || !data) return null;
    this.me = data as StudentInfo;
    this.lastSyncedAt = this.me.saved_at ? Date.parse(this.me.saved_at) || 0 : 0;
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
    const { data, error } = this.lookOnly ? await this.sb.rpc('teacher_view_student', { p_student: this.me.student_id }) : await this.sb.rpc('my_student');
    if (error || !data) return;
    const next = data as StudentInfo;
    if (next.student_id !== this.me.student_id) { this.accountSwitched(); return; }
    this.me.class_drills = next.class_drills;
    this.me.student_drills = next.student_drills;
    this.me.quiz_settings = next.quiz_settings;
    this.me.quiz_overrides = next.quiz_overrides;
    this.me.game_settings = next.game_settings;
    this.me.lesson_links = next.lesson_links;
    this.me.question_edits = next.question_edits;
    this.me.min_station = next.min_station;
    this.me.reset_at = next.reset_at;
    this.onSettings?.();   // the game applies any new teacher clears (game.js, applyClears)
    const remoteAt = next.saved_at ? Date.parse(next.saved_at) || 0 : 0;
    if (next.state && remoteAt > this.lastSyncedAt) { this.lastSyncedAt = remoteAt; this.onRemoteSave?.(next.state); }   // another device saved since this one last loaded or saved
  }

  /**
   * Start counting practice time for the signed-in student. Any earlier tracker is
   * stopped first, so calling this twice never double-counts.
   */
  async startSession() {
    if (this.lookOnly) return;
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
    if (this.lookOnly) return;
    await this.endSession();
    await this.flush(); await this.pushSave();
    this.me = null; this.queue = [];
    if (this.sb) await this.sb.auth.signOut();
  }

  /** Ledger (docs: LEDGER.md step 3): send one day's summary. Returns 'saved', 'kept' (a grown-up edited that day), or null in local mode, offline, or before the migration is run. */
  async sendLedgerDay(day: string, entry: Record<string, unknown>): Promise<string | null> {
    if (!this.sb || !this.me || this.lookOnly) return null;
    const { data, error } = await this.sb.rpc('send_ledger_day', { p_day: day, p_entry: entry });
    return error ? null : String(data);
  }

  /** Outside work she adds herself (docs: OUTSIDE-WORK.md, migration 20261020000000_outside_work.sql). */
  async listOutsideWork(fromDay: string): Promise<{ id: number; day: string; course: string; title: string; minutes: number; grade: string; source: string; review: string; review_note: string; images: string[] }[] | null> {
    if (!this.sb || !this.me) return null;
    const { data, error } = await this.sb.from('ledger_outside').select('id,day,course,title,minutes,grade,source,review,review_note,images').eq('student_id', this.me.student_id).gte('day', fromDay).order('day', { ascending: false }).order('id', { ascending: false });
    if (error || !data) return null;
    return data as { id: number; day: string; course: string; title: string; minutes: number; grade: string; source: string; review: string; review_note: string; images: string[] }[];
  }
  /** Adds (id null) or changes one of her rows; returns its id, or an error message. */
  async saveOutsideWork(id: number | null, row: { day: string; course: string; title: string; minutes: number; grade: string; images: string[] }): Promise<{ id?: number; error?: string }> {
    if (!this.sb || !this.me) return { error: 'Outside work needs a class sign-in.' };
    if (this.lookOnly) return { error: 'Look only: nothing is saved.' };
    const { data, error } = await this.sb.rpc('save_outside_work', { p_id: id, p_day: row.day, p_course: row.course, p_title: row.title, p_minutes: row.minutes, p_grade: row.grade, p_images: row.images });
    return error ? { error: error.message } : { id: Number(data) };
  }
  async deleteOutsideWork(id: number): Promise<boolean> {
    if (!this.sb || !this.me || this.lookOnly) return false;
    const { data, error } = await this.sb.rpc('delete_outside_work', { p_id: id });
    return !error && data === true;
  }

  /** Art Studio gallery (ROADMAP F13, docs: ART-STUDIO.md): the student's paintings, newest first. */
  async listPaintings(): Promise<{ id: string; title: string; image: string; at: number }[]> {
    if (!this.sb || !this.me) return [];
    const { data, error } = await this.sb.from('art_paintings').select('id,title,image,created_at').eq('student_id', this.me.student_id).order('created_at', { ascending: false }).limit(20);
    if (error || !data) return [];
    return (data as { id: number; title: string; image: string; created_at: string }[]).map(p => ({ id: String(p.id), title: p.title, image: p.image, at: Date.parse(p.created_at) }));
  }
  /** Saves a painting; returns its id, 'full' when the gallery has 20 already, or null on error (offline, or before migration 9). */
  async savePainting(title: string, image: string): Promise<string | null> {
    if (!this.sb || !this.me || this.lookOnly) return null;
    const { data, error } = await this.sb.rpc('save_painting', { p_title: title, p_image: image });
    if (error) return /gallery full/i.test(error.message) ? 'full' : null;
    return String(data);
  }
  async deletePainting(id: string): Promise<boolean> {
    if (!this.sb || !this.me || this.lookOnly) return false;
    const { error } = await this.sb.from('art_paintings').delete().eq('id', Number(id));
    return !error;
  }

  /** Another student signed in on this browser: stop saving, logging, and merging here (docs: CLEARING-PROGRESS.md) */
  /** Stop saving, logging and counting time in this tab (a newer version of the page is about to reload it). */
  pause() {
    this.switched = true;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.pendingState = null;
    this.tracker?.stop(); this.tracker = null;
  }

  private accountSwitched() {
    if (this.switched) return;
    this.switched = true;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.pendingState = null;
    this.tracker?.stop(); this.tracker = null;
    this.onAccountSwitch?.();
  }

  /** Called on every game save; writes to the server after a short pause. */
  saveSoon(state: Record<string, unknown>) {
    if (!this.me || this.switched) return;
    this.pendingState = state;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => { void this.pushSave(); }, 2000);
  }

  private async pushSave() {
    if (!this.sb || !this.me || !this.pendingState || this.saving || this.switched) return;
    this.saving = true;
    const state = this.pendingState; this.pendingState = null;
    const savedAt = typeof state.savedAt === 'number' ? new Date(state.savedAt) : new Date();
    const { error } = await this.sb.from('saves').upsert({ student_id: this.me.student_id, state, saved_at: savedAt.toISOString() });
    if (!error) this.lastSyncedAt = Math.max(this.lastSyncedAt, savedAt.getTime());
    this.saving = false;
    if (error && !this.pendingState) { this.pendingState = state; setTimeout(() => { void this.pushSave(); }, 8000); }
    else if (this.pendingState) void this.pushSave();
  }

  log(table: Table, row: Record<string, unknown>) {
    if (!this.me || this.switched) return;
    this.queue.push({ table, row: { ...row, student_id: this.me.student_id, class_id: this.me.class_id, created_at: new Date().toISOString() } });
    this.persistQueue();
  }

  async flush() {
    if (!this.sb || !this.me || this.flushing || !this.queue.length || this.switched) return;
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
