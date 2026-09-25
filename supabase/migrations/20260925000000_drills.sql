-- Generalize times-table pop-ups into drills of any type (place value, reciprocals, ...).
-- Safe for old app versions: they keep inserting times_table only, and drill_key falls back to it.
alter table public.practice_popups alter column times_table drop not null;
alter table public.practice_popups add column if not exists drill_type text not null default 'times';
alter table public.practice_popups add column if not exists drill_key text;
update public.practice_popups set drill_key = times_table::text where drill_key is null and times_table is not null;
alter table public.practice_popups add constraint practice_popups_drill_key_present
  check (drill_key is not null or times_table is not null);
create index if not exists practice_popups_student_drill_idx on public.practice_popups(student_id, drill_type);

-- class_report(): unchanged, plus a new 'dr' field keyed "type:key" (for example "times:7", "placeValue:tenths")
create or replace function public.class_report(p_class uuid, p_since timestamptz default now() - interval '365 days')
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
                where p.student_id = s.id and p.created_at >= p_since
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
                where x.student_id = s.id and x.created_at >= p_since
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
                where x.student_id = s.id and x.created_at >= p_since
                group by 1
              ) dd), '{}'::jsonb),
      'sp', (select coalesce(max(x.correct), 0) from public.sprints x where x.student_id = s.id)
    ) as doc
    from public.students s
    join public.classes c on c.id = s.class_id
    where s.class_id = p_class
  ) r;
  return result;
end $$;
