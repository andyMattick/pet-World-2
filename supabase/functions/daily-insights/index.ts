// 📈 Pet World daily insights email (docs/INSIGHTS.md). Supabase Edge Function (Deno).
//
// Two ways in:
//   1. ✉️ Email me this now (teacher app):  POST {mode:'now', classId, studentId?, tz?}  with the teacher's sign-in token.
//      Sends that class (or one student) to the signed-in teacher's email, whatever the class setting says.
//   2. The hourly job (pg_cron + pg_net, migration 20261028000000_insights_email.sql): POST {mode:'scheduled'} with the
//      header x-cron-secret. Sends to every class whose game_settings.insightsEmail is {on:true, hour:<this hour in its tz>},
//      one email per teacher.
//
// It loads the same data the teacher app shows (class_report through insights_class_report, the saves, and the last few
// days of problems and attempts), runs src/shared/insights.ts on each student, and sends the result with Resend.
//
// ../_shared/insights.ts and ../_shared/registry.ts are COPIES made at deploy time by `node scripts/copy-insights.mjs`
// (npm run deploy:insights does both). Don't edit them; edit src/shared/ and deploy again.
//
// Secrets (supabase secrets set ...): RESEND_API_KEY, INSIGHTS_CRON_SECRET, and optionally INSIGHTS_FROM, APP_URL.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase. Deploy with --no-verify-jwt: this function checks
// the teacher's token itself, and the hourly job has no user token.
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { computeInsights, insightsEmailHTML, insightsSaveFields, rowsByStudent, insightsSince, type InsightNames, type Insights, type InsightsStudent } from '../_shared/insights.ts';
import { SKILLS, SHOPS, MIS, BUILDINGS } from '../_shared/registry.ts';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const env = (k: string) => Deno.env.get(k) || '';

const names: InsightNames = {
  skill: id => SKILLS[id]?.name,
  shop: id => (SHOPS[id] ? `${SHOPS[id].emoji} ${SHOPS[id].name}` : undefined),
  station: (shop, st) => { const s = SHOPS[shop], x = s?.stations.find(y => y.id === st); return s && x ? `${s.emoji} ${s.name} · ${x.name}` : undefined; },
  mixup: id => (MIS[id] ? { name: MIS[id].name, tip: MIS[id].tip } : undefined),
  unitSubject: id => BUILDINGS.find(b => b.id === id)?.subject
};

interface ClassRow { id: string; name: string; teacher_id: string; game_settings: Record<string, unknown> | null }
interface Setting { on: boolean; hour: number; tz: string }
function validTz(tz: unknown) { if (typeof tz !== 'string' || !tz) return ''; try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return tz; } catch { return ''; } }
function settingOf(c: ClassRow): Setting {
  const v = (c.game_settings?.insightsEmail || {}) as Partial<Setting>;
  return { on: v.on === true, hour: Number.isInteger(v.hour) && v.hour! >= 0 && v.hour! <= 23 ? v.hour! : 19, tz: validTz(v.tz) || 'America/New_York' };
}
const hourIn = (now: Date, tz: string) => +new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hourCycle: 'h23' }).format(now) % 24;
const dayIn = (now: Date, tz: string) => new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(now);

/** Every student in a class (or one), shaped like the teacher app's StudentReport, with Insights worked out. */
async function classInsights(admin: SupabaseClient, cls: ClassRow, tz: string, studentId = ''): Promise<{ ins: Insights }[]> {
  const report = await admin.rpc('insights_class_report', { p_class: cls.id, p_tz: tz });
  if (report.error) throw new Error(`class report: ${report.error.message}. Has supabase/migrations/20261028000000_insights_email.sql been run?`);
  const students = ((report.data || []) as Record<string, unknown>[]).filter(s => !studentId || s.id === studentId);
  if (!students.length) return [];
  const ids = students.map(s => String(s.id)), since = insightsSince();
  const [saves, problems, attempts] = await Promise.all([
    admin.from('saves').select('student_id,state').in('student_id', ids),
    admin.from('problems').select('student_id,created_at,skill,shop,station,perfect').eq('class_id', cls.id).in('student_id', ids).gte('created_at', since).order('created_at').limit(5000),
    admin.from('attempts').select('student_id,created_at,skill,shop,step,answer,expected,misconception,context').eq('class_id', cls.id).in('student_id', ids).eq('first_try', true).eq('correct', false).gte('created_at', since).order('created_at').limit(3000)
  ]);
  if (saves.error) throw new Error(`saves: ${saves.error.message}`);
  const stateOf = new Map(((saves.data || []) as { student_id: string; state: unknown }[]).map(r => [r.student_id, r.state]));
  const rp = problems.error ? null : rowsByStudent(problems.data), ra = attempts.error ? null : rowsByStudent(attempts.data);
  const brainOn = { enabled: (cls.game_settings?.brain as { enabled?: boolean } | undefined)?.enabled === true };
  const now = Date.now();
  return students.map(s => {
    const id = String(s.id), student = { ...s, ...insightsSaveFields(stateOf.get(id)), brainOn, n: String(s.n || 'Student'),
      ...(rp ? { rp: rp.get(id) || [] } : {}), ...(ra ? { ra: ra.get(id) || [] } : {}) } as InsightsStudent;
    return { ins: computeInsights(student, { now, tz, names }) };
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = env('RESEND_API_KEY');
  if (!key) throw new Error('RESEND_API_KEY is not set on the function (see docs/INSIGHTS.md, step 3)');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('INSIGHTS_FROM') || 'Pet World <onboarding@resend.dev>', to: [to], subject, html })
  });
  if (!res.ok) throw new Error(`Resend said ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
const subjectFor = (sections: { ins: Insights }[], now: Date, tz: string) => {
  const flags = sections.reduce((n, s) => n + s.ins.struggles.length, 0);
  return `📈 Pet World insights · ${dayIn(now, tz)}${sections.length === 1 ? ` · ${sections[0].ins.name}` : ''}${flags ? ` · ${flags} to look at` : ''}`;
};

/** The hourly job: every class that wants its email at this hour, one email per teacher. */
async function runScheduled(admin: SupabaseClient, now: Date) {
  const { data, error } = await admin.from('classes').select('id,name,teacher_id,game_settings').filter('game_settings->insightsEmail->>on', 'eq', 'true');
  if (error) throw new Error(`classes: ${error.message}`);
  const due = ((data || []) as ClassRow[]).filter(c => { const s = settingOf(c); return s.on && hourIn(now, s.tz) === s.hour; });
  const byTeacher = new Map<string, ClassRow[]>();
  for (const c of due) byTeacher.set(c.teacher_id, [...(byTeacher.get(c.teacher_id) || []), c]);
  let sent = 0; const problems: string[] = [];
  for (const [teacherId, list] of byTeacher) {
    try {
      const user = await admin.auth.admin.getUserById(teacherId);
      const to = user.data?.user?.email; if (!to) { problems.push(`no email for teacher ${teacherId}`); continue; }
      const tz = settingOf(list[0]).tz, sections: { ins: Insights }[] = [];
      for (const c of list) sections.push(...await classInsights(admin, c, settingOf(c).tz));
      await sendEmail(to, subjectFor(sections, now, tz), insightsEmailHTML(sections, { title: 'Pet World daily insights', className: list.map(c => c.name).join(', '), appUrl: env('APP_URL') ? `${env('APP_URL').replace(/\/$/, '')}/teacher.html` : undefined }));
      sent++;
    } catch (e) { problems.push(String((e as Error).message || e)); }
  }
  return { mode: 'scheduled', due: due.length, sent, problems };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    const body = await req.json().catch(() => ({})) as { mode?: string; classId?: string; studentId?: string; tz?: string };
    const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
    if (body.mode === 'scheduled') {
      const secret = env('INSIGHTS_CRON_SECRET');
      if (!secret || req.headers.get('x-cron-secret') !== secret) return json({ error: 'not allowed' }, 401);
      return json(await runScheduled(admin, new Date()));
    }
    /* ✉️ Email me this now: the signed-in teacher, their own class */
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: who, error: authError } = await admin.auth.getUser(token);
    if (authError || !who?.user || who.user.is_anonymous) return json({ error: 'Sign in again, then try once more.' }, 401);
    const { data: cls, error } = await admin.from('classes').select('id,name,teacher_id,game_settings').eq('id', String(body.classId || '')).maybeSingle();
    if (error) return json({ error: error.message }, 500);
    if (!cls || (cls as ClassRow).teacher_id !== who.user.id) return json({ error: 'That class isn’t one of yours.' }, 403);
    if (!who.user.email) return json({ error: 'Your account has no email address.' }, 400);
    const tz = validTz(body.tz) || settingOf(cls as ClassRow).tz, now = new Date();
    const sections = await classInsights(admin, cls as ClassRow, tz, String(body.studentId || ''));
    if (!sections.length) return json({ error: 'No students to send.' }, 400);
    await sendEmail(who.user.email, subjectFor(sections, now, tz), insightsEmailHTML(sections, { title: 'Pet World insights', className: (cls as ClassRow).name }));
    return json({ sent: 1, to: who.user.email });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
