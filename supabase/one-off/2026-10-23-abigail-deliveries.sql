-- Oct 23, 2026: Deliveries (Café station 4) showed done, with 10 minutes already logged, before Abigail started it.
-- Run in Supabase → SQL Editor (project utcqzhucfpvgoirbytej). Class code 3THGBU.

-- PART 1 (read only): who was in her town. Run it on its own first.
--   signin   = every browser that has signed in as her: when it signed in, when it was last active, its browser and IP
--   practice = practice sessions in the last 30 hours (device, start, last seen, active seconds)
--   save     = her saved town now: Café station counts and the clears it has applied
--   problem  = finished problems in the last 3 days, by shop:station:skill (first, last, how many)
--   assess   = quizzes and tests in the last 3 days
with a as (select s.id from public.students s join public.classes c on c.id = s.class_id
            where c.join_code = '3THGBU' and s.display_name = 'Abigail')
select * from (
  select 'signin' as what, left(ss.auth_uid::text, 8) as who,
         to_char(ss.created_at at time zone 'America/New_York', 'MM-DD HH24:MI') as t1,
         (select to_char(max(coalesce(x.refreshed_at, x.updated_at)) at time zone 'America/New_York', 'MM-DD HH24:MI')
            from auth.sessions x where x.user_id = ss.auth_uid) as t2,
         (select string_agg(distinct left(coalesce(x.user_agent, 'none'), 110) || ' ip ' || coalesce(host(x.ip), 'none'), ' | ')
            from auth.sessions x where x.user_id = ss.auth_uid) as info
    from public.student_sessions ss where ss.student_id = (select id from a)
  union all
  select 'practice', p.device, to_char(p.started_at at time zone 'America/New_York', 'MM-DD HH24:MI'),
         to_char(p.last_seen_at at time zone 'America/New_York', 'MM-DD HH24:MI'), p.active_seconds::text
    from public.practice_sessions p
   where p.student_id = (select id from a) and p.started_at > now() - interval '30 hours' and p.active_seconds > 0
  union all
  select 'save', coalesce(sv.state->>'owner', '(no owner)'), to_char(sv.saved_at at time zone 'America/New_York', 'MM-DD HH24:MI'),
         (sv.state->'cafe'->'st')::text, (sv.state->'clearsDone')::text
    from public.saves sv where sv.student_id = (select id from a)
  union all
  select 'problem ' || p.mode, p.shop || ':' || coalesce(p.station::text, '') || ':' || p.skill,
         to_char(min(p.created_at) at time zone 'America/New_York', 'MM-DD HH24:MI'),
         to_char(max(p.created_at) at time zone 'America/New_York', 'MM-DD HH24:MI'), count(*)::text
    from public.problems p where p.student_id = (select id from a) and p.created_at > now() - interval '3 days' group by 1, 2
  union all
  select 'assess', a2.shop || ':' || coalesce(a2.station::text, 'test') || ':' || a2.kind,
         to_char(a2.created_at at time zone 'America/New_York', 'MM-DD HH24:MI'), a2.score || '/' || a2.total, a2.passed::text
    from public.assessments a2 where a2.student_id = (select id from a) and a2.created_at > now() - interval '3 days'
) t order by what, t1;

-- PART 2: take Deliveries back. Only station 4 of the Café: its orders, quiz, Think it through and the coord, units and
-- ppw skill mastery. The Kitchen quiz she passed today (Oct 23, 2:09 PM) and everything else stay.
-- Skip this part if PART 1 shows she has since done Deliveries work herself (problem rows for cafe:4 at times she was on).
do $$
declare sid uuid; n int;
begin
  select s.id into strict sid
    from public.students s join public.classes c on c.id = s.class_id
   where c.join_code = '3THGBU' and s.display_name = 'Abigail';
  delete from public.problems where student_id = sid and shop = 'cafe' and station = 4;
  get diagnostics n = row_count; raise notice 'Deliveries problems deleted: %', n;
  delete from public.attempts where student_id = sid and shop = 'cafe' and skill in ('coord', 'units', 'ppw');
  get diagnostics n = row_count; raise notice 'Deliveries attempts deleted: %', n;
  delete from public.assessments where student_id = sid and shop = 'cafe' and station = 4;
  get diagnostics n = row_count; raise notice 'Deliveries quizzes deleted: %', n;
  update public.students
     set quiz_overrides = coalesce(quiz_overrides, '{}'::jsonb) || jsonb_build_object('clear:2026-10-23', 'station:cafe:4')
   where id = sid;
  raise notice 'Deliveries clear added for Abigail (%)', sid;
end $$;

-- Later, to see every browser that changed her station progress (after migration 20261023000000_save_guard.sql):
--   select at at time zone 'America/New_York' as at, left(auth_uid::text, 8) as who, left(user_agent, 80) as browser, ip, client, stations->'cafe' as cafe
--     from public.save_log where student_id = (select s.id from public.students s join public.classes c on c.id = s.class_id
--                                               where c.join_code = '3THGBU' and s.display_name = 'Abigail')
--    order by at desc limit 50;
