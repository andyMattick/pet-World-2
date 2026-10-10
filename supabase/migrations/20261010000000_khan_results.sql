-- Khan unit test results and the Khan-ready badge (roadmap step 10; docs: LESSON-CONTENT.md).
-- One jsonb column on classes, written and read only by the teacher app:
--   {"passScore": 80, "students": {"<student id>": {"<course id>": {"date": "2026-10-10", "score": 85, "missed": ["bio1:cells"], "cleared": []}}}}
-- Missed topics are Khan topic names only (lesson_links keys), never copied Khan questions.
-- The existing classes_teacher_select / classes_teacher_update policies (teacher_id = auth.uid()) cover it,
-- and my_student() does not return it, so students never see it.

alter table public.classes add column if not exists khan_results jsonb not null default '{}'::jsonb;
alter table public.classes add constraint classes_khan_results_object check (jsonb_typeof(khan_results) = 'object');
alter table public.classes add constraint classes_khan_results_size check (octet_length(khan_results::text) < 200000);
