-- Station quizzes and unit tests.
-- Run AFTER 20260927000000_teacher_tools.sql. It replaces my_student(), which that file also changes.

-- practice steps and quiz/test steps are both kept in attempts; mode tells them apart
alter table public.attempts add column if not exists mode text not null default 'practice';
alter table public.attempts add constraint attempts_mode_check check (mode in ('practice','quiz','test'));
alter table public.problems add column if not exists mode text not null default 'practice';
alter table public.problems add constraint problems_mode_check check (mode in ('practice','quiz','test'));

-- one row per finished quiz or unit test
create table if not exists public.assessments (
  id             bigint generated always as identity primary key,
  student_id     uuid not null references public.students(id) on delete cascade,
  class_id       uuid not null references public.classes(id) on delete cascade,
  shop           text not null,
  station        int,                                   -- null for a unit test
  kind           text not null check (kind in ('quiz','test')),
  score          int  not null check (score >= 0),
  total          int  not null check (total > 0 and score <= total),
  passed         boolean not null,
  missed_skills  text[] not null default '{}',
  created_at     timestamptz not null default now()
);
create index if not exists assessments_student_idx on public.assessments(student_id, created_at);
create index if not exists assessments_class_idx on public.assessments(class_id, created_at);
alter table public.assessments enable row level security;
create policy assessments_student_insert on public.assessments for insert
  with check (student_id = public.current_student_id() and class_id = public.current_class_id());
create policy assessments_teacher_select on public.assessments for select using (public.teaches_class(class_id));

-- class-wide quiz rules (pass mark, question counts, whether quizzes unlock stations)
alter table public.classes add column if not exists quiz_settings jsonb not null default '{}'::jsonb;
alter table public.classes add constraint classes_quiz_settings_object check (jsonb_typeof(quiz_settings) = 'object');
-- per-student teacher overrides: mark a quiz passed (excused) or clear a required review
alter table public.students add column if not exists quiz_overrides jsonb;
alter table public.students add constraint students_quiz_overrides_object check (quiz_overrides is null or jsonb_typeof(quiz_overrides) = 'object');

alter publication supabase_realtime add table public.assessments;

-- class_report(): unchanged, plus 'qz' (quiz and test history) and 'qx' (teacher overrides)
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
      'sp', (select coalesce(max(x.correct), 0) from public.sprints x where x.student_id = s.id)
    ) as doc
    from public.students s
    join public.classes c on c.id = s.class_id
    where s.class_id = p_class
  ) r;
  return result;
end $$;

-- my_student(): unchanged, plus the class quiz rules and the student's overrides
create or replace function public.my_student() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'student_id', s.id, 'name', s.display_name, 'class_id', c.id, 'class_name', c.name,
    'min_station', c.min_station, 'state', sv.state, 'saved_at', sv.saved_at,
    'class_drills', c.drill_settings, 'student_drills', s.drill_settings,
    'reset_at', s.reset_at,
    'quiz_settings', c.quiz_settings, 'quiz_overrides', s.quiz_overrides)
  from public.student_sessions ss
  join public.students s on s.id = ss.student_id
  join public.classes c on c.id = s.class_id
  left join public.saves sv on sv.student_id = s.id
  where ss.auth_uid = auth.uid()
$$;
