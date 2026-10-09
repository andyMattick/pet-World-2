-- Teacher lesson links and question editing (docs: LESSON-CONTENT.md).
-- Two jsonb columns on classes, saved per class by the teacher app and returned to students by my_student().
-- The existing classes_teacher_select / classes_teacher_update policies (teacher_id = auth.uid())
-- already cover reading and changing these columns, so no new rules are needed.

alter table public.classes add column if not exists lesson_links jsonb not null default '{}'::jsonb;
alter table public.classes add column if not exists question_edits jsonb not null default '{}'::jsonb;
alter table public.classes add constraint classes_lesson_links_object check (jsonb_typeof(lesson_links) = 'object');
alter table public.classes add constraint classes_question_edits_object check (jsonb_typeof(question_edits) = 'object');
alter table public.classes add constraint classes_question_edits_size check (octet_length(question_edits::text) < 500000);

-- my_student(): unchanged (latest version is in 20260929000000_practice_time.sql), plus lesson_links and question_edits
create or replace function public.my_student() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'student_id', s.id, 'name', s.display_name, 'class_id', c.id, 'class_name', c.name,
    'min_station', c.min_station, 'state', sv.state, 'saved_at', sv.saved_at,
    'class_drills', c.drill_settings, 'student_drills', s.drill_settings,
    'reset_at', s.reset_at,
    'quiz_settings', c.quiz_settings, 'quiz_overrides', s.quiz_overrides,
    'game_settings', c.game_settings,
    'lesson_links', c.lesson_links, 'question_edits', c.question_edits)
  from public.student_sessions ss
  join public.students s on s.id = ss.student_id
  join public.classes c on c.id = s.class_id
  left join public.saves sv on sv.student_id = s.id
  where ss.auth_uid = auth.uid()
$$;
