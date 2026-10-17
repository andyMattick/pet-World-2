-- Ledger, step 3 (docs/LEDGER.md): the student's record in Supabase.
--   ledger_days: one row per student per day with the day's summary (what "I'm done for today" shows), sent by the student.
--   ledger_outside: work done outside Pet World (and old Ledger entries imported later), added by a grown-up.
-- Students write their own day only through send_ledger_day(); teachers read and edit rows for their own classes,
-- the same pattern as sprints and saves. Run once in the Supabase SQL editor. Never edit this file after it is run.

create table public.ledger_days (
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  day date not null,
  entry jsonb not null default '{}'::jsonb,
  sent_at timestamptz not null default now(),
  edited_by_teacher boolean not null default false,
  primary key (student_id, day)
);

create table public.ledger_outside (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  day date not null,
  course text not null check (char_length(course) between 1 and 80),
  title text not null default '' check (char_length(title) <= 300),
  minutes integer not null default 0 check (minutes between 0 and 1440),
  grade text not null default '' check (char_length(grade) <= 20),
  notes text not null default '' check (char_length(notes) <= 1000),
  source text not null default 'teacher' check (source in ('teacher', 'import')),
  created_at timestamptz not null default now()
);
create index ledger_outside_student_day on public.ledger_outside (student_id, day);

alter table public.ledger_days enable row level security;
alter table public.ledger_outside enable row level security;

-- the student reads their own record; teachers read and edit their classes' records
create policy ledger_days_student_select on public.ledger_days for select using (student_id = public.current_student_id());
create policy ledger_days_teacher_select on public.ledger_days for select using (public.teaches_class(class_id));
create policy ledger_days_teacher_insert on public.ledger_days for insert with check (public.teaches_class(class_id));
create policy ledger_days_teacher_update on public.ledger_days for update using (public.teaches_class(class_id)) with check (public.teaches_class(class_id));
create policy ledger_days_teacher_delete on public.ledger_days for delete using (public.teaches_class(class_id));

create policy ledger_outside_student_select on public.ledger_outside for select using (student_id = public.current_student_id());
create policy ledger_outside_teacher_select on public.ledger_outside for select using (public.teaches_class(class_id));
create policy ledger_outside_teacher_insert on public.ledger_outside for insert with check (public.teaches_class(class_id));
create policy ledger_outside_teacher_update on public.ledger_outside for update using (public.teaches_class(class_id)) with check (public.teaches_class(class_id));
create policy ledger_outside_teacher_delete on public.ledger_outside for delete using (public.teaches_class(class_id));

-- the student sends (or sends again) one day; a day a grown-up has edited keeps the grown-up's version.
-- Returns 'saved' or 'kept'. Days within the last 14 days only, and summaries up to about 60 KB.
create or replace function public.send_ledger_day(p_day date, p_entry jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  sid uuid := public.current_student_id();
  cid uuid := public.current_class_id();
  kept boolean;
begin
  if sid is null or cid is null then raise exception 'not signed in as a student'; end if;
  if p_day > current_date + 1 or p_day < current_date - 14 then raise exception 'day out of range'; end if;
  if p_entry is null or jsonb_typeof(p_entry) <> 'object' or octet_length(p_entry::text) > 60000 then raise exception 'bad entry'; end if;
  select edited_by_teacher into kept from public.ledger_days where student_id = sid and day = p_day;
  if coalesce(kept, false) then return 'kept'; end if;
  insert into public.ledger_days (student_id, class_id, day, entry, sent_at)
  values (sid, cid, p_day, p_entry, now())
  on conflict (student_id, day) do update set entry = excluded.entry, class_id = excluded.class_id, sent_at = now();
  return 'saved';
end $$;

revoke all on function public.send_ledger_day(date, jsonb) from public;
grant execute on function public.send_ledger_day(date, jsonb) to authenticated;
