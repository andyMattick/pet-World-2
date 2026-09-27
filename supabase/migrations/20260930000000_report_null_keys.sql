-- Pet Town: fix "field name must not be null" on the teacher dashboard.
-- Run AFTER 20260929000000_practice_time.sql. It replaces class_report() only; no tables change.
--
-- The report groups practice pop-ups by times table. Pop-ups that aren't times tables (place value,
-- lining up, moving the decimal, word problems) have no times table, so the group key was null and
-- Postgres refused to build the JSON. Those pop-ups are already counted in 'dr' (by drill type), so
-- 'p' now counts times-table pop-ups only. The same guard is added to every other keyed list.

create or replace function public.class_report(p_class uuid, p_since timestamptz default now() - interval '365 days', p_tz text default 'America/New_York')
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.teaches_class(p_class) then raise exception 'not your class'; end if;
  select coalesce(jsonb_agg(r.doc order by r.doc ->> 'n'), '[]'::jsonb) into result
  from (
    select jsonb_build_object(
      'id', s.id,
      'n',  s.display_name,
      'cl', c.name,
      'o',  (select count(*) from public.problems p where p.student_id = s.id and p.created_at >= p_since),
      'pf', (select count(*) from public.problems p where p.student_id = s.id and p.perfect and p.created_at >= p_since),
      'tm', (select coalesce(sum(least(coalesce(p.secs, 0), 300)), 0) / 60 from public.problems p where p.student_id = s.id and p.created_at >= p_since),
      't',  (select floor(extract(epoch from coalesce(max(x.at), s.created_at)) * 1000)
               from (select max(created_at) as at from public.attempts where student_id = s.id
                     union all select max(created_at) from public.problems where student_id = s.id) x),
      'k',  coalesce((
              select jsonb_object_agg(ps.skill, jsonb_build_array(ps.cnt, ps.recent))
              from (
                select p.skill, count(*) as cnt,
                  (select string_agg(case when q.perfect then '1' else '0' end, '' order by q.created_at)
                     from (select p2.perfect, p2.created_at from public.problems p2
                            where p2.student_id = s.id and p2.skill = p.skill
                            order by p2.created_at desc limit 10) q) as recent
                from public.problems p
                where p.student_id = s.id and p.created_at >= p_since and p.skill is not null
                group by p.skill
              ) ps), '{}'::jsonb),
      's',  coalesce((
              select jsonb_object_agg(sk.skill, sk.steps)
              from (
                select st.skill, jsonb_object_agg(st.step, jsonb_build_array(st.n_all, st.n_ok, st.n_slow, st.kind)) as steps
                from (
                  select a.skill, a.step, count(*) as n_all,
                         count(*) filter (where a.correct) as n_ok,
                         count(*) filter (where a.slow) as n_slow,
                         case a.step_type when 'idea' then 'i' when 'arith' then 'a' else 's' end as kind
                  from public.attempts a
                  where a.student_id = s.id and a.first_try and a.shop <> 'sprint' and a.created_at >= p_since
                    and a.skill is not null and a.step is not null
                  group by a.skill, a.step, a.step_type
                ) st
                group by st.skill
              ) sk), '{}'::jsonb),
      'cc', (select jsonb_build_array(
                count(*) filter (where a.step_type = 'idea'),
                count(*) filter (where a.step_type = 'idea' and a.correct),
                count(*) filter (where a.step_type = 'arith'),
                count(*) filter (where a.step_type = 'arith' and a.correct))
             from public.attempts a where a.student_id = s.id and a.first_try and a.created_at >= p_since),
      'm',  coalesce((
              select jsonb_object_agg(mm.misconception, jsonb_build_array(mm.n, mm.ex))
              from (
                select a.misconception, count(*) as n,
                  (select coalesce(jsonb_agg(e.context), '[]'::jsonb)
                     from (select a2.context from public.attempts a2
                            where a2.student_id = s.id and a2.misconception = a.misconception
                            order by a2.created_at desc limit 3) e) as ex
                from public.attempts a
                where a.student_id = s.id and a.misconception is not null and a.created_at >= p_since
                group by a.misconception
              ) mm), '{}'::jsonb),
      'f',  coalesce((
              select jsonb_agg(jsonb_build_array(ff.k, ff.n_all, ff.n_ok, ff.n_slow) order by ff.bad desc)
              from (
                select least(a.fact_a, a.fact_b) || 'x' || greatest(a.fact_a, a.fact_b) as k,
                       count(*) as n_all, count(*) filter (where a.correct) as n_ok, count(*) filter (where a.slow) as n_slow,
                       count(*) - count(*) filter (where a.correct) + count(*) filter (where a.slow) as bad
                from public.attempts a
                where a.student_id = s.id and a.fact_a is not null and not coalesce(a.fact_div, false)
                  and a.first_try and a.created_at >= p_since
                group by 1
                order by bad desc
                limit 12
              ) ff where ff.bad > 0), '[]'::jsonb),
      'df', coalesce((
              select jsonb_agg(jsonb_build_array(dd.k, dd.n_all, dd.n_ok, dd.n_slow) order by dd.bad desc)
              from (
                select least(a.fact_a, a.fact_b) || 'x' || greatest(a.fact_a, a.fact_b) as k,
                       count(*) as n_all, count(*) filter (where a.correct) as n_ok, count(*) filter (where a.slow) as n_slow,
                       count(*) - count(*) filter (where a.correct) + count(*) filter (where a.slow) as bad
                from public.attempts a
                where a.student_id = s.id and a.fact_a is not null and coalesce(a.fact_div, false)
                  and a.first_try and a.created_at >= p_since
                group by 1
                order by bad desc
                limit 12
              ) dd where dd.bad > 0), '[]'::jsonb),
      'p',  coalesce((
              select jsonb_object_agg(pp.tt, pp.obj)
              from (
                select x.times_table::text as tt, jsonb_build_object(
                         'miss',   count(*) filter (where x.reason = 'miss'),
                         'slow',   count(*) filter (where x.reason = 'slow'),
                         'sprint', count(*) filter (where x.reason = 'sprint')) as obj
                from public.practice_popups x
                where x.student_id = s.id and x.created_at >= p_since and x.times_table is not null
                group by x.times_table
              ) pp), '{}'::jsonb),
      'dr', coalesce((
              select jsonb_object_agg(dd.k, dd.obj)
              from (
                select x.drill_type || ':' || coalesce(x.drill_key, x.times_table::text) as k, jsonb_build_object(
                         'miss',   count(*) filter (where x.reason = 'miss'),
                         'slow',   count(*) filter (where x.reason = 'slow'),
                         'sprint', count(*) filter (where x.reason = 'sprint')) as obj
                from public.practice_popups x
                where x.student_id = s.id and x.created_at >= p_since and x.drill_type is not null
                  and coalesce(x.drill_key, x.times_table::text) is not null
                group by 1
              ) dd), '{}'::jsonb),
      'ds', s.drill_settings,
      'dl', (select sv.state -> 'drillLog' from public.saves sv where sv.student_id = s.id),
      'qz', coalesce((
              select jsonb_agg(jsonb_build_object(
                       'shop', q.shop, 'station', q.station, 'kind', q.kind, 'score', q.score, 'total', q.total,
                       'passed', q.passed, 'missed', q.missed_skills, 't', floor(extract(epoch from q.created_at) * 1000))
                     order by q.created_at)
              from public.assessments q
              where q.student_id = s.id and q.created_at >= p_since), '[]'::jsonb),
      'qx', coalesce(s.quiz_overrides, '{}'::jsonb),
      'ss', jsonb_build_object(
              'last', (select floor(extract(epoch from max(z.started_at)) * 1000) from public.practice_sessions z where z.student_id = s.id),
              'today', (select round(coalesce(sum(z.active_seconds), 0) / 60.0) from public.practice_sessions z
                        where z.student_id = s.id and z.started_at >= date_trunc('day', now() at time zone p_tz) at time zone p_tz),
              'week', (select round(coalesce(sum(z.active_seconds), 0) / 60.0) from public.practice_sessions z
                        where z.student_id = s.id and z.started_at >= now() - interval '7 days'),
              'days', coalesce((select jsonb_agg(jsonb_build_array(d.day, d.mins) order by d.day)
                        from (select to_char(z.started_at at time zone p_tz, 'YYYY-MM-DD') as day, round(sum(z.active_seconds) / 60.0) as mins
                              from public.practice_sessions z
                              where z.student_id = s.id and z.started_at >= now() - interval '28 days'
                              group by 1) d), '[]'::jsonb),
              'recent', coalesce((select jsonb_agg(jsonb_build_array(floor(extract(epoch from r.started_at) * 1000),
                                                                     floor(extract(epoch from r.last_seen_at) * 1000),
                                                                     r.active_seconds, r.device) order by r.started_at desc)
                        from (select * from public.practice_sessions z where z.student_id = s.id
                              order by z.started_at desc limit 10) r), '[]'::jsonb)),
      'sp', (select coalesce(max(x.correct), 0) from public.sprints x where x.student_id = s.id)
    ) as doc
    from public.students s
    join public.classes c on c.id = s.class_id
    where s.class_id = p_class
  ) r;
  return result;
end $$;
revoke all on function public.class_report(uuid, timestamptz, text) from public, anon;
grant execute on function public.class_report(uuid, timestamptz, text) to authenticated;
