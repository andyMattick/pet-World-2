-- Save guard and save log (docs/CLEARING-PROGRESS.md, "Oct 23"). Run AFTER the game version with SAVE_CLIENT is live
-- on Vercel; until then, open tabs can't save (they reload into the new code within 10 minutes).
--
-- 1. The guard: a student's save is refused unless the game stamped it (state.client >= 4) and, when it names its
--    student (state.owner), it names this one. Tabs still running code from before the Oct 20-21 guardrails send no
--    stamp, so they can no longer write a merged copy of someone else's work into a student's town.
--    Saves written from the SQL editor or pg_cron (demo_reset) have no signed-in user and are not checked.
-- 2. The log: every save that changes a shop's station progress, or comes from a different browser sign-in than the
--    last logged one, gets a row in save_log: when, which browser sign-in (auth uid), its user agent and IP, the game
--    stamp, and every shop's station counts. The teacher can read it; nobody can change it from the app.

create table if not exists public.save_log (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  at          timestamptz not null default now(),
  auth_uid    uuid,
  user_agent  text,
  ip          text,
  client      int,
  stations    jsonb
);
create index if not exists save_log_student_idx on public.save_log(student_id, at);
alter table public.save_log enable row level security;
create policy save_log_teacher_select on public.save_log for select
  using (exists (select 1 from public.students s where s.id = student_id and public.teaches_class(s.class_id)));

create or replace function public.saves_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;   -- SQL editor, pg_cron, demo_reset
  if coalesce((new.state->>'client') ~ '^\d+$', false) is not true or (new.state->>'client')::int < 4 then
    raise exception 'pet-world: save from an old Pet World tab refused; reload the page' using errcode = 'P0001';
  end if;
  if new.state ? 'owner' and new.state->>'owner' is distinct from new.student_id::text then
    raise exception 'pet-world: save stamped for another student refused' using errcode = 'P0001';
  end if;
  return new;
end $$;

create or replace function public.saves_log() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  hdr jsonb := coalesce(nullif(current_setting('request.headers', true), '')::jsonb, '{}'::jsonb);
  st jsonb; last public.save_log%rowtype;
begin
  select coalesce(jsonb_object_agg(k, v->'st'), '{}'::jsonb) into st
    from jsonb_each(new.state) e(k, v) where jsonb_typeof(v) = 'object' and v ? 'st';
  select * into last from public.save_log where student_id = new.student_id order by at desc, id desc limit 1;
  if last.id is null or last.stations is distinct from st or last.auth_uid is distinct from auth.uid() then
    insert into public.save_log (student_id, auth_uid, user_agent, ip, client, stations)
    values (new.student_id, auth.uid(), left(hdr->>'user-agent', 300),
            coalesce(hdr->>'cf-connecting-ip', split_part(hdr->>'x-forwarded-for', ',', 1)),
            case when (new.state->>'client') ~ '^\d+$' then (new.state->>'client')::int end, st);
  end if;
  if random() < 0.01 then delete from public.save_log where at < now() - interval '90 days'; end if;
  return null;
end $$;

drop trigger if exists saves_guard on public.saves;
create trigger saves_guard before insert or update on public.saves for each row execute function public.saves_guard();
drop trigger if exists saves_log on public.saves;
create trigger saves_log after insert or update on public.saves for each row execute function public.saves_log();
