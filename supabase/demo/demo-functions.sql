-- Pet World demo class (docs/DEMO.md)
-- A made-up class of 8 students with about 6 weeks of work, for showing other teachers the teacher app.
--
-- Run this whole file once in the Supabase SQL editor, then:
--   select public.demo_reset('demo@petworld.example');
-- (the email of a teacher account made only for the demo: Authentication > Users > Add user, with Auto Confirm).
-- Run demo_reset again any time to put the class back the way it was; dates move up to the day you run it.
--
-- demo_reset DELETES every class the demo account owns, so never give it your own email. It refuses an admin account.
-- Only the SQL editor (and pg_cron) can run these functions: they are not available through the app's API.

create table if not exists public.demo_seed (
  id    int primary key,
  data  jsonb not null
);
alter table public.demo_seed enable row level security;   -- no policies: the app's API can't read it

/* school day n: 0 is today, 1 the weekday before today, and so on (weekends skipped) */
create or replace function public.demo_days(p_tz text, p_count int default 80) returns date[]
language plpgsql stable set search_path = public as $$
declare
  today date := (now() at time zone p_tz)::date;
  d date := today;
  out date[] := array[today];
begin
  while coalesce(array_length(out, 1), 0) < p_count loop
    d := d - 1;
    if extract(isodow from d) < 6 then out := out || d; end if;
  end loop;
  return out;
end $$;

/* a time token as epoch milliseconds: "@T3@09:15:00" (3 school days ago at 9:15 local) or "@M12" (12 minutes ago) */
create or replace function public.demo_ms(p_tok text, p_days date[], p_tz text) returns bigint
language plpgsql stable set search_path = public as $$
declare m text[];
begin
  if p_tok like '@M%' then
    return floor(extract(epoch from now()) * 1000)::bigint - substr(p_tok, 3)::int * 60000;
  end if;
  m := regexp_match(p_tok, '^@T(\d+)@(\d\d:\d\d:\d\d)$');
  if m is null then raise exception 'bad time token %', p_tok; end if;
  return floor(extract(epoch from ((p_days[m[1]::int + 1] + m[2]::time) at time zone p_tz)) * 1000)::bigint;
end $$;

/* every token in a JSON value, made real: "@D3" -> "YYYY-MM-DD", "@T…"/"@M…" -> epoch ms, "@SY0"/"@SY1"/"@SYNAME" ->
   the school year's first day, last day and name; tokens inside longer strings (and in keys) are replaced as text */
create or replace function public.demo_fix(j jsonb, p_days date[], p_tz text) returns jsonb
language plpgsql stable set search_path = public as $$
declare
  t text; k text; v jsonb; out jsonb; m text[];
  today date := p_days[1];
  y int := case when extract(month from today) >= 8 then extract(year from today)::int else extract(year from today)::int - 1 end;
begin
  case jsonb_typeof(j)
  when 'object' then
    out := '{}'::jsonb;
    for k, v in select * from jsonb_each(j) loop
      if k like '@%' then k := public.demo_fix(to_jsonb(k), p_days, p_tz) #>> '{}'; end if;
      out := out || jsonb_build_object(k, public.demo_fix(v, p_days, p_tz));
    end loop;
    return out;
  when 'array' then
    select coalesce(jsonb_agg(public.demo_fix(e, p_days, p_tz) order by i), '[]'::jsonb) into out
    from jsonb_array_elements(j) with ordinality as x(e, i);
    return out;
  when 'string' then
    t := j #>> '{}';
    if position('@' in t) = 0 then return j; end if;
    if t ~ '^@[TM]' then return to_jsonb(public.demo_ms(t, p_days, p_tz)); end if;
    if t ~ '^@D\d+$' then return to_jsonb(to_char(p_days[substr(t, 3)::int + 1], 'YYYY-MM-DD')); end if;
    t := replace(t, '@SYNAME', y || '–' || right((y + 1)::text, 2) || ' School Year');
    t := replace(t, '@SY0', to_char(make_date(y, 8, 17), 'YYYY-MM-DD'));
    t := replace(t, '@SY1', to_char(make_date(y + 1, 5, 28), 'YYYY-MM-DD'));
    for m in select regexp_matches(t, '@T\d+@\d\d:\d\d:\d\d|@M\d+|@D\d+', 'g') loop
      t := replace(t, m[1], case when m[1] like '@D%' then to_char(p_days[substr(m[1], 3)::int + 1], 'YYYY-MM-DD') else public.demo_ms(m[1], p_days, p_tz)::text end);
    end loop;
    return to_jsonb(t);
  else
    return j;
  end case;
end $$;

/* (re)build the demo class for one teacher account. p_tz: the time zone the demo is mostly shown in. */
create or replace function public.demo_reset(p_email text, p_tz text default 'America/New_York') returns text
language plpgsql set search_path = public, extensions as $$
declare
  uid uuid; cid uuid; ids uuid[] := '{}'; sid uuid;
  d jsonb; days date[]; r jsonb; i int; overrides jsonb; khan text;
begin
  select u.id into uid from auth.users u where lower(u.email) = lower(btrim(p_email));
  if uid is null then raise exception 'No account with the email %. Add it first: Authentication > Users > Add user.', p_email; end if;
  if exists (select 1 from public.app_admins where user_id = uid) then raise exception 'That is an admin account. Use an account made only for the demo.'; end if;
  select data into d from public.demo_seed where id = 1;
  if d is null then raise exception 'The demo data is missing. Run all of supabase/demo/demo-class.sql first.'; end if;
  days := public.demo_days(p_tz, 80);

  insert into public.parent_approvals (user_id) values (uid) on conflict (user_id) do nothing;   -- the demo account is approved
  delete from public.classes where teacher_id = uid;                                              -- students and all their rows go too

  insert into public.classes (teacher_id, name, join_code, min_station, game_settings)
  values (uid, d->>'className', 'DEMO26', 1, d->'game_settings') returning id into cid;

  /* students (PIN 1234), each with a plan, goals and reviews in quiz_overrides; JSON settings are stored as strings */
  for r, i in select e, x.n from jsonb_array_elements(d->'students') with ordinality as x(e, n) loop
    select coalesce(jsonb_object_agg(key, case when jsonb_typeof(value) = 'string' then value else to_jsonb(value::text) end), '{}'::jsonb)
      into overrides from jsonb_each(public.demo_fix(r->1, days, p_tz));
    insert into public.students (class_id, display_name, pin_hash, pin_plain, quiz_overrides)
    values (cid, r->>0, extensions.crypt('1234', extensions.gen_salt('bf')), '1234', overrides) returning id into sid;
    ids := ids || sid;
  end loop;

  /* their towns */
  for r, i in select e, x.n from jsonb_array_elements(d->'saves') with ordinality as x(e, n) loop
    insert into public.saves (student_id, state, saved_at) values (ids[i], public.demo_fix(r, days, p_tz), now());
  end loop;

  /* Khan results, keyed by student id */
  khan := public.demo_fix(d->'khan_results', days, p_tz)::text;
  for i in 1 .. array_length(ids, 1) loop khan := replace(khan, '"@S' || (i - 1) || '"', '"' || ids[i] || '"'); end loop;
  update public.classes set khan_results = khan::jsonb where id = cid;

  insert into public.problems (student_id, class_id, shop, station, skill, perfect, steps, secs, created_at)
  select ids[(e->>0)::int + 1], cid, e->>2, (e->>3)::int, e->>4, (e->>5)::int = 1, (e->>6)::int, (e->>7)::int, to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0)
  from jsonb_array_elements(d->'problems') e;

  insert into public.attempts (student_id, class_id, shop, skill, step, step_type, correct, first_try, slow, answer, expected, misconception, context, ms, fact_a, fact_b, fact_div, created_at)
  select ids[(e->>0)::int + 1], cid, e->>2, e->>3, e->>4, e->>5, (e->>6)::int = 1, (e->>7)::int = 1, (e->>8)::int = 1, e->>9, e->>10, e->>11, e->>12, (e->>13)::int,
         (e->>14)::int, (e->>15)::int, (e->>16)::boolean, to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0)
  from jsonb_array_elements(d->'attempts') e;

  insert into public.assessments (student_id, class_id, shop, station, kind, score, total, passed, missed_skills, created_at)
  select ids[(e->>0)::int + 1], cid, e->>2, (e->>3)::int, e->>4, (e->>5)::int, (e->>6)::int, (e->>7)::int = 1,
         array(select jsonb_array_elements_text(e->8)), to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0)
  from jsonb_array_elements(d->'assessments') e;

  insert into public.sprints (student_id, class_id, correct, created_at)
  select ids[(e->>0)::int + 1], cid, (e->>2)::int, to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0)
  from jsonb_array_elements(d->'sprints') e;

  insert into public.practice_popups (student_id, class_id, times_table, reason, drill_type, drill_key, created_at)
  select ids[(e->>0)::int + 1], cid, (e->>2)::int, e->>3, e->>4, e->>5, to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0)
  from jsonb_array_elements(d->'popups') e;

  insert into public.practice_sessions (student_id, class_id, started_at, last_seen_at, active_seconds, device)
  select ids[(e->>0)::int + 1], cid, to_timestamp(public.demo_ms(e->>1, days, p_tz) / 1000.0), to_timestamp(public.demo_ms(e->>2, days, p_tz) / 1000.0), (e->>3)::int, e->>4
  from jsonb_array_elements(d->'sessions') e;

  insert into public.ledger_days (student_id, class_id, day, entry, sent_at, edited_by_teacher)
  select ids[(e->>0)::int + 1], cid, days[substr(e->>1, 3)::int + 1], public.demo_fix(e->2, days, p_tz), to_timestamp(public.demo_ms(e->>3, days, p_tz) / 1000.0), (e->>4)::boolean
  from jsonb_array_elements(d->'ledgerDays') e;

  insert into public.ledger_outside (student_id, class_id, day, course, title, minutes, grade, notes, source, review, review_note, images)
  select ids[(e->>0)::int + 1], cid, days[substr(e->>1, 3)::int + 1], e->>2, e->>3, (e->>4)::int, e->>5, e->>6, e->>7, e->>8, e->>9,
         (select coalesce(jsonb_agg(d->'photos'->x), '[]'::jsonb) from jsonb_array_elements_text(e->10) x)
  from jsonb_array_elements(d->'outside') e;

  return format('Demo class ready: %s students, class code DEMO26, every PIN 1234 (dates as of %s).', array_length(ids, 1), days[1]);
end $$;

revoke all on function public.demo_days(text, int) from public, anon, authenticated;
revoke all on function public.demo_ms(text, date[], text) from public, anon, authenticated;
revoke all on function public.demo_fix(jsonb, date[], text) from public, anon, authenticated;
revoke all on function public.demo_reset(text, text) from public, anon, authenticated;
