-- Art Studio (ROADMAP F13, docs/ART-STUDIO.md): the student's saved paintings (JPEG data URLs, up to 20 each).
-- Students read and delete their own and save new ones through save_painting(); teachers can see and delete their
-- classes' paintings. Run once in the Supabase SQL editor. Never edit this file after it is run.

create table public.art_paintings (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null default '' check (char_length(title) <= 60),
  image text not null check (image like 'data:image/jpeg;base64,%' and octet_length(image) <= 200000),
  created_at timestamptz not null default now()
);
create index art_paintings_student on public.art_paintings (student_id, created_at desc);

alter table public.art_paintings enable row level security;
create policy art_paintings_student_select on public.art_paintings for select using (student_id = public.current_student_id());
create policy art_paintings_student_delete on public.art_paintings for delete using (student_id = public.current_student_id());
create policy art_paintings_teacher_select on public.art_paintings for select using (public.teaches_class(class_id));
create policy art_paintings_teacher_delete on public.art_paintings for delete using (public.teaches_class(class_id));

-- the student saves a painting; refuses past 20 ("gallery full") and anything that isn't a small JPEG
create or replace function public.save_painting(p_title text, p_image text) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  sid uuid := public.current_student_id();
  cid uuid := public.current_class_id();
  new_id bigint;
begin
  if sid is null or cid is null then raise exception 'not signed in as a student'; end if;
  if p_image is null or p_image not like 'data:image/jpeg;base64,%' or octet_length(p_image) > 200000 then raise exception 'bad painting'; end if;
  if (select count(*) from public.art_paintings where student_id = sid) >= 20 then raise exception 'gallery full'; end if;
  insert into public.art_paintings (student_id, class_id, title, image)
  values (sid, cid, left(coalesce(p_title, ''), 60), p_image) returning id into new_id;
  return new_id;
end $$;

revoke all on function public.save_painting(text, text) from public;
grant execute on function public.save_painting(text, text) to authenticated;
