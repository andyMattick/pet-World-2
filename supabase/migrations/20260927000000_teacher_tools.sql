-- Teacher tools: readable PINs for the teacher's copy/print list, and resetting a student.
-- Run AFTER 20260926000000_drill_settings.sql.

-- A readable copy of each PIN, visible only to the teacher (students can't read the students table).
-- Existing students get one the next time the teacher clicks "New PIN".
alter table public.students add column if not exists pin_plain text;
alter table public.students add constraint students_pin_plain_format check (pin_plain is null or pin_plain ~ '^[0-9]{4}$');
-- When the teacher last reset this student. The game discards any older copy of the town.
alter table public.students add column if not exists reset_at timestamptz;

-- add_students(): unchanged, plus stores the readable PIN
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
    insert into public.students (class_id, display_name, pin_hash, pin_plain)
      values (p_class, n, extensions.crypt(v_pin, extensions.gen_salt('bf')), v_pin)
      on conflict (class_id, display_name) do nothing
      returning id into v_id;
    if v_id is not null then
      out_id := v_id; out_name := n; out_pin := v_pin;
      return next;
    end if;
  end loop;
end $$;

-- reset_pin(): unchanged, plus stores the readable PIN
create or replace function public.reset_pin(p_student uuid) returns text
language plpgsql security definer set search_path = public as $$
declare v_pin text; v_class uuid;
begin
  select class_id into v_class from public.students where id = p_student;
  if v_class is null or not public.teaches_class(v_class) then raise exception 'not your student'; end if;
  v_pin := lpad(floor(random() * 10000)::int::text, 4, '0');
  update public.students
     set pin_hash = extensions.crypt(v_pin, extensions.gen_salt('bf')), pin_plain = v_pin, failed_attempts = 0, locked_until = null
   where id = p_student;
  return v_pin;
end $$;

-- reset a student's town (and optionally their learning history); roster entry and PIN stay
create or replace function public.reset_student(p_student uuid, p_clear_history boolean default false) returns void
language plpgsql security definer set search_path = public as $$
declare v_class uuid;
begin
  select class_id into v_class from public.students where id = p_student;
  if v_class is null or not public.teaches_class(v_class) then raise exception 'not your student'; end if;
  delete from public.saves where student_id = p_student;
  if p_clear_history then
    delete from public.attempts        where student_id = p_student;
    delete from public.problems        where student_id = p_student;
    delete from public.practice_popups where student_id = p_student;
    delete from public.sprints         where student_id = p_student;
  end if;
  update public.students set reset_at = now() where id = p_student;  -- keeps PIN and any extra-time settings
end $$;
revoke all on function public.reset_student(uuid, boolean) from public, anon;
grant execute on function public.reset_student(uuid, boolean) to authenticated;

-- my_student(): unchanged, plus 'reset_at'
create or replace function public.my_student() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'student_id', s.id, 'name', s.display_name, 'class_id', c.id, 'class_name', c.name,
    'min_station', c.min_station, 'state', sv.state, 'saved_at', sv.saved_at,
    'class_drills', c.drill_settings, 'student_drills', s.drill_settings,
    'reset_at', s.reset_at)
  from public.student_sessions ss
  join public.students s on s.id = ss.student_id
  join public.classes c on c.id = s.class_id
  left join public.saves sv on sv.student_id = s.id
  where ss.auth_uid = auth.uid()
$$;
