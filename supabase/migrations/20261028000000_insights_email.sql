-- Pet World: the daily insights email (docs/INSIGHTS.md). Run AFTER the daily-insights Edge Function is deployed and
-- the two Vault secrets below exist. No tables change; the class setting lives in classes.game_settings.insightsEmail.
--
-- 1. insights_class_report(): class_report() for the Edge Function. class_report() checks that the signed-in teacher
--    owns the class (auth.uid()); the function runs with the service role and has no signed-in teacher, so this wrapper
--    sets the class's own teacher as the caller for this one call and returns exactly what the teacher app gets.
--    Only the service role (the Edge Function) can call it; teachers and students can't.
-- 2. An hourly pg_cron job that calls the function through pg_net. The function sends only to classes whose
--    insightsEmail.hour matches the current hour in their time zone, so hourly is right.
--
-- Secrets stay out of this file. Before running it, add two Vault secrets in the SQL editor (docs/INSIGHTS.md, step 5):
--   select vault.create_secret('https://<your-project-ref>.supabase.co', 'pet_world_project_url');
--   select vault.create_secret('<the same value as INSIGHTS_CRON_SECRET>', 'pet_world_insights_secret');
-- Until they exist, the hourly job does nothing.

create or replace function public.insights_class_report(p_class uuid, p_tz text default 'America/New_York')
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare t uuid;
begin
  select teacher_id into t from public.classes where id = p_class;
  if t is null then raise exception 'no such class'; end if;
  perform set_config('request.jwt.claim.sub', t::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', t, 'role', 'authenticated')::text, true);
  return public.class_report(p_class, now() - interval '365 days', p_tz);
end $$;
revoke all on function public.insights_class_report(uuid, text) from public, anon, authenticated;
grant execute on function public.insights_class_report(uuid, text) to service_role;

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- (re)schedule: running this file twice keeps one job
select cron.unschedule(jobid) from cron.job where jobname = 'pet-world-daily-insights';
select cron.schedule('pet-world-daily-insights', '0 * * * *', $job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'pet_world_project_url') || '/functions/v1/daily-insights',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'pet_world_insights_secret')),
    body := jsonb_build_object('mode', 'scheduled'),
    timeout_milliseconds := 60000)
  where exists (select 1 from vault.decrypted_secrets where name = 'pet_world_project_url')
    and exists (select 1 from vault.decrypted_secrets where name = 'pet_world_insights_secret');
$job$);
