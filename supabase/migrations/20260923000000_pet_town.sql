-- Pet Town: schema, row-level security, and functions
-- Teachers sign in with email. Students join with class code + name + 4-digit PIN
-- on top of Supabase anonymous auth (no student emails are ever collected).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- tables
create table public.classes (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 60),
  join_code    text not null unique,
  min_station  int  not null default 1 check (min_station between 1 and 4),
  created_at   timestamptz not null default now()
);

create table public.students (
  id               uuid primary key default gen_random_uuid(),
  class_id         uuid not null references public.classes(id) on delete cascade,
  display_name     text not null check (char_length(display_name) between 1 and 30),
  pin_hash         text not null,
  failed_attempts  int  not null default 0,
  locked_until     timestamptz,
  created_at       timestamptz not null default now(),
  unique (class_id, display_name)
);
create index students_class_idx on public.students(class_id);

-- links a signed-in (anonymous) browser session to a roster student
create table public.student_sessions (
  auth_uid    uuid primary key references auth.users(id) on delete cascade,
  student_id  uuid not null references public.students(id) on delete cascade,
  created_at  timestamptz not null default now()
);
create index student_sessions_student_idx on public.student_sessions(student_id);

-- the whole town (coins, pets, progress) as one JSON document per student
create table public.saves (
  student_id  uuid primary key references public.students(id) on delete cascade,
  state       jsonb not null,
  saved_at    timestamptz not null default now()
);

-- one row per finished problem (a café order)
create table public.problems (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  class_id    uuid not null references public.classes(id) on delete cascade,
  shop        text not null default 'cafe',
  station     int,
  skill       text not null,
  perfect     boolean not null,
  steps       int,
  secs        int,
  created_at  timestamptz not null default now()
);
create index problems_class_time_idx on public.problems(class_id, created_at);
create index problems_student_skill_idx on public.problems(student_id, skill, created_at);

-- one row per step attempt (first tries, plus later tries that reveal a new mix-up) and per sprint answer
create table public.attempts (
  id             bigint generated always as identity primary key,
  student_id     uuid not null references public.students(id) on delete cascade,
  class_id       uuid not null references public.classes(id) on delete cascade,
  shop           text not null default 'cafe',
  skill          text not null,
  step           text not null,
  step_type      text not null check (step_type in ('idea','arith','setup','fact')),
  correct        boolean not null,
  first_try      boolean not null default true,
  slow           boolean not null default false,
  answer         text,
  expected       text,
  misconception  text,
  context        text,
  fact_a         int,
  fact_b         int,
  fact_div       boolean,
  ms             int,
  created_at     timestamptz not null default now()
);
create index attempts_class_time_idx on public.attempts(class_id, created_at);
create index attempts_student_idx on public.attempts(student_id, created_at);

create table public.practice_popups (
  id           bigint generated always as identity primary key,
  student_id   uuid not null references public.students(id) on delete cascade,
  class_id     uuid not null references public.classes(id) on delete cascade,
  times_table  int  not null check (times_table between 2 and 12),
  reason       text not null check (reason in ('miss','slow','sprint')),
  created_at   timestamptz not null default now()
);
create index practice_popups_student_idx on public.practice_popups(student_id);

create table public.sprints (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  class_id    uuid not null references public.classes(id) on delete cascade,
  correct     int  not null check (correct >= 0),
  created_at  timestamptz not null default now()
);
create index sprints_student_idx on public.sprints(student_id);

-- ---------------------------------------------------------------- helpers
create or replace function public.make_join_code() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no 0/O or 1/I
  c text;
begin
  loop
    c := '';
    for i in 1..6 loop
      c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.classes where join_code = c);
  end loop;
  return c;
end $$;
alter table public.classes alter column join_code set default public.make_join_code();

create or replace function public.current_student_id() returns uuid
language sql stable security definer set search_path = public as $$
  select student_id from public.student_sessions where auth_uid = auth.uid()
$$;

create or replace function public.current_class_id() returns uuid
language sql stable security definer set search_path = public as $$
  select s.class_id from public.student_sessions ss join public.students s on s.id = ss.student_id
  where ss.auth_uid = auth.uid()
$$;

create or replace function public.teaches_class(p_class uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.classes where id = p_class and teacher_id = auth.uid())
$$;

create or replace function public.is_anonymous_user() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
$$;

-- ---------------------------------------------------------------- row-level security
alter table public.classes          enable row level security;
alter table public.students         enable row level security;
alter table public.student_sessions enable row level security;  -- no policies: functions only
alter table public.saves            enable row level security;
alter table public.problems         enable row level security;
alter table public.attempts         enable row level security;
alter table public.practice_popups  enable row level security;
alter table public.sprints          enable row level security;

-- teachers (real accounts, not anonymous student sessions) manage their own classes
create policy classes_teacher_select on public.classes for select using (teacher_id = auth.uid());
create policy classes_teacher_insert on public.classes for insert
  with check (teacher_id = auth.uid() and not public.is_anonymous_user());
create policy classes_teacher_update on public.classes for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy classes_teacher_delete on public.classes for delete using (teacher_id = auth.uid());

-- students rows: teachers read/rename/remove; creating rows goes through add_students() so PINs are hashed
create policy students_teacher_select on public.students for select using (public.teaches_class(class_id));
create policy students_teacher_update on public.students for update
  using (public.teaches_class(class_id)) with check (public.teaches_class(class_id));
create policy students_teacher_delete on public.students for delete using (public.teaches_class(class_id));

-- saves: a student reads and writes only their own; the teacher can read them
create policy saves_student_select on public.saves for select using (student_id = public.current_student_id());
create policy saves_student_insert on public.saves for insert with check (student_id = public.current_student_id());
create policy saves_student_update on public.saves for update
  using (student_id = public.current_student_id()) with check (student_id = public.current_student_id());
create policy saves_teacher_select on public.saves for select
  using (exists (select 1 from public.students s where s.id = saves.student_id and public.teaches_class(s.class_id)));

-- event tables: students append their own rows; teachers read rows for their classes
create policy problems_student_insert on public.problems for insert
  with check (student_id = public.current_student_id() and class_id = public.current_class_id());
create policy problems_teacher_select on public.problems for select using (public.teaches_class(class_id));

create policy attempts_student_insert on public.attempts for insert
  with check (student_id = public.current_student_id() and class_id = public.current_class_id());
create policy attempts_teacher_select on public.attempts for select using (public.teaches_class(class_id));

create policy popups_student_insert on public.practice_popups for insert
  with check (student_id = public.current_student_id() and class_id = public.current_class_id());
create policy popups_teacher_select on public.practice_popups for select using (public.teaches_class(class_id));

create policy sprints_student_insert on public.sprints for insert
  with check (student_id = public.current_student_id() and class_id = public.current_class_id());
create policy sprints_teacher_select on public.sprints for select using (public.teaches_class(class_id));

-- ---------------------------------------------------------------- teacher functions
-- add students; returns each new student's PIN once (only a hash is stored)
create or replace function public.add_students(p_class uuid, p_names text[])
returns table (out_id uuid, out_name text, out_pin text)
language plpgsql security definer set search_path = public as $$
declare
  n text; v_pin text; v_id uuid;
begin
  if not public.teaches_class(p_class) then raise exception 'not your class'; end if;
  foreach n in array p_names loop
    n := left(btrim(n), 30);
    continue when n = '';
    v_pin := lpad(floor(random() * 10000)::int::text, 4, '0');
    v_id := null;
    insert into public.students (class_id, display_name, pin_hash)
      values (p_class, n, extensions.crypt(v_pin, extensions.gen_salt('bf')))
      on conflict (class_id, display_name) do nothing
      returning id into v_id;
    if v_id is not null then
      out_id := v_id; out_name := n; out_pin := v_pin;
      return next;
    end if;
  end loop;
end $$;

-- new PIN for a student who forgot theirs; also clears any lockout
create or replace function public.reset_pin(p_student uuid) returns text
language plpgsql security definer set search_path = public as $$
declare v_pin text; v_class uuid;
begin
  select class_id into v_class from public.students where id = p_student;
  if v_class is null or not public.teaches_class(v_class) then raise exception 'not your student'; end if;
  v_pin := lpad(floor(random() * 10000)::int::text, 4, '0');
  update public.students
     set pin_hash = extensions.crypt(v_pin, extensions.gen_salt('bf')), failed_attempts = 0, locked_until = null
   where id = p_student;
  return v_pin;
end $$;

-- everything the dashboard needs for one class, aggregated in the database
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
      'sp', (select coalesce(max(x.correct), 0) from public.sprints x where x.student_id = s.id)
    ) as doc
    from public.students s
    join public.classes c on c.id = s.class_id
    where s.class_id = p_class
  ) r;
  return result;
end $$;

-- ---------------------------------------------------------------- student functions
-- names on a class roster, for the "who are you?" screen
create or replace function public.class_roster(p_code text)
returns table (out_id uuid, out_name text, out_class text)
language sql stable security definer set search_path = public as $$
  select s.id, s.display_name, c.name
  from public.classes c join public.students s on s.class_id = c.id
  where c.join_code = upper(btrim(p_code))
  order by s.display_name
$$;

-- check the PIN and link this browser session to the student; 5 misses locks the student for 10 minutes
create or replace function public.claim_student(p_student uuid, p_pin text) returns text
language plpgsql security definer set search_path = public as $$
declare s public.students%rowtype;
begin
  if auth.uid() is null then return 'no_session'; end if;
  select * into s from public.students where id = p_student for update;
  if not found then return 'not_found'; end if;
  if s.locked_until is not null and s.locked_until > now() then return 'locked'; end if;
  if p_pin ~ '^\d{4}$' and s.pin_hash = extensions.crypt(p_pin, s.pin_hash) then
    update public.students set failed_attempts = 0, locked_until = null where id = p_student;
    insert into public.student_sessions (auth_uid, student_id) values (auth.uid(), p_student)
      on conflict (auth_uid) do update set student_id = excluded.student_id, created_at = now();
    return 'ok';
  end if;
  update public.students
     set failed_attempts = failed_attempts + 1,
         locked_until = case when failed_attempts + 1 >= 5 then now() + interval '10 minutes' else null end
   where id = p_student;
  return 'bad_pin';
end $$;

-- who am I (for a returning student), with class settings and saved town
create or replace function public.my_student() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'student_id', s.id, 'name', s.display_name, 'class_id', c.id, 'class_name', c.name,
    'min_station', c.min_station, 'state', sv.state, 'saved_at', sv.saved_at)
  from public.student_sessions ss
  join public.students s on s.id = ss.student_id
  join public.classes c on c.id = s.class_id
  left join public.saves sv on sv.student_id = s.id
  where ss.auth_uid = auth.uid()
$$;

-- ---------------------------------------------------------------- permissions
revoke all on function public.add_students(uuid, text[]) from public, anon;
revoke all on function public.reset_pin(uuid) from public, anon;
revoke all on function public.class_report(uuid, timestamptz) from public, anon;
revoke all on function public.claim_student(uuid, text) from public, anon;
revoke all on function public.my_student() from public, anon;
grant execute on function public.add_students(uuid, text[]) to authenticated;
grant execute on function public.reset_pin(uuid) to authenticated;
grant execute on function public.class_report(uuid, timestamptz) to authenticated;
grant execute on function public.claim_student(uuid, text) to authenticated;
grant execute on function public.my_student() to authenticated;
grant execute on function public.class_roster(text) to anon, authenticated;

-- ---------------------------------------------------------------- realtime (live dashboard)
alter publication supabase_realtime add table public.problems;
