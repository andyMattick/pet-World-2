-- Look only (docs/LOOK-ONLY.md): the teacher app's 👀 Look button opens a student's town in the game with the
-- teacher's own sign-in. This returns the same thing my_student() returns for a signed-in student, but for one of the
-- signed-in teacher's students. Read only: the game never saves, logs or counts time in look only.
create or replace function public.teacher_view_student(p_student uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_class uuid; v jsonb;
begin
  select class_id into v_class from public.students where id = p_student;
  if v_class is null or not public.teaches_class(v_class) then raise exception 'not your student'; end if;
  select jsonb_build_object(
    'student_id', s.id, 'name', s.display_name, 'class_id', c.id, 'class_name', c.name,
    'min_station', c.min_station, 'state', sv.state, 'saved_at', sv.saved_at,
    'class_drills', c.drill_settings, 'student_drills', s.drill_settings,
    'reset_at', s.reset_at,
    'quiz_settings', c.quiz_settings, 'quiz_overrides', s.quiz_overrides,
    'game_settings', c.game_settings,
    'lesson_links', c.lesson_links, 'question_edits', c.question_edits)
    into v
    from public.students s
    join public.classes c on c.id = s.class_id
    left join public.saves sv on sv.student_id = s.id
   where s.id = p_student;
  return v;
end $$;
revoke all on function public.teacher_view_student(uuid) from public, anon;
grant execute on function public.teacher_view_student(uuid) to authenticated;
