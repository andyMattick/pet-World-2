-- Outside work a student adds herself (docs/OUTSIDE-WORK.md): on Today's plan she names the course, the activity,
-- the minutes and (if there is one) the grade, and can add up to 3 photos for a grown-up to review. Rows go into
-- ledger_outside with source 'student' and review 'waiting'; a teacher marks them ok or asks for a redo with a note.
-- Students write only through save_outside_work() and delete_outside_work(). Run once in the Supabase SQL editor.
-- Never edit this file after it is run.

alter table public.ledger_outside drop constraint if exists ledger_outside_source_check;
alter table public.ledger_outside add constraint ledger_outside_source_check check (source in ('teacher', 'import', 'student'));
alter table public.ledger_outside add column if not exists review text not null default '' check (review in ('', 'waiting', 'ok', 'redo'));
alter table public.ledger_outside add column if not exists review_note text not null default '' check (char_length(review_note) <= 500);
alter table public.ledger_outside add column if not exists images jsonb not null default '[]'::jsonb
  check (jsonb_typeof(images) = 'array' and jsonb_array_length(images) <= 3 and octet_length(images::text) <= 650000);

-- the student adds a row (p_id null) or changes one of her own that isn't marked ok yet; either way it waits for review.
-- Days from 14 days ago to tomorrow; photos are small JPEG data URLs (up to 3, about 200 KB each).
create or replace function public.save_outside_work(p_id bigint, p_day date, p_course text, p_title text, p_minutes int, p_grade text, p_images jsonb)
returns bigint
language plpgsql security definer set search_path = public as $$
declare
  sid uuid := public.current_student_id();
  cid uuid := public.current_class_id();
  img jsonb := coalesce(p_images, '[]'::jsonb);
  out_id bigint;
begin
  if sid is null or cid is null then raise exception 'not signed in as a student'; end if;
  if p_day is null or p_day > current_date + 1 or p_day < current_date - 14 then raise exception 'day out of range'; end if;
  if p_course is null or char_length(trim(p_course)) not between 1 and 80 then raise exception 'course needs a name'; end if;
  if char_length(coalesce(p_title, '')) > 300 or char_length(coalesce(p_grade, '')) > 20 then raise exception 'too long'; end if;
  if p_minutes is null or p_minutes not between 0 and 1440 then raise exception 'minutes out of range'; end if;
  if jsonb_typeof(img) <> 'array' or jsonb_array_length(img) > 3 or octet_length(img::text) > 650000
     or exists (select 1 from jsonb_array_elements(img) e where jsonb_typeof(e) <> 'string' or (e #>> '{}') not like 'data:image/jpeg;base64,%' or octet_length(e #>> '{}') > 200000)
  then raise exception 'bad photos'; end if;
  if p_id is null then
    insert into public.ledger_outside (student_id, class_id, day, course, title, minutes, grade, source, review, images)
    values (sid, cid, p_day, trim(p_course), coalesce(p_title, ''), p_minutes, coalesce(p_grade, ''), 'student', 'waiting', img)
    returning id into out_id;
  else
    update public.ledger_outside set day = p_day, course = trim(p_course), title = coalesce(p_title, ''), minutes = p_minutes,
      grade = coalesce(p_grade, ''), images = img, review = 'waiting'
    where id = p_id and student_id = sid and source = 'student' and review <> 'ok'
    returning id into out_id;
    if out_id is null then raise exception 'not yours to change'; end if;
  end if;
  return out_id;
end $$;

-- the student takes back one of her own rows that isn't marked ok yet
create or replace function public.delete_outside_work(p_id bigint) returns boolean
language plpgsql security definer set search_path = public as $$
declare sid uuid := public.current_student_id();
begin
  if sid is null then raise exception 'not signed in as a student'; end if;
  delete from public.ledger_outside where id = p_id and student_id = sid and source = 'student' and review <> 'ok';
  return found;
end $$;

revoke all on function public.save_outside_work(bigint, date, text, text, int, text, jsonb) from public;
grant execute on function public.save_outside_work(bigint, date, text, text, int, text, jsonb) to authenticated;
revoke all on function public.delete_outside_work(bigint) from public;
grant execute on function public.delete_outside_work(bigint) to authenticated;
