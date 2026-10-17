-- Approving new teacher and parent accounts (ROADMAP F4, docs/APPROVALS.md).
-- Saves the approval setup that was first made by hand in Supabase (parent_approvals and is_approved_parent(), which
-- every classes policy uses), and adds admins: accounts that can approve or remove other accounts from the teacher
-- app's Approvals page. Safe to run on a database that already has parent_approvals: existing approvals are kept.
-- The admin list starts empty. Add yourself once in the SQL editor (see docs/APPROVALS.md); emails are not kept in
-- this public repo.

create table if not exists public.parent_approvals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  approved_at timestamptz not null default now()
);
alter table public.parent_approvals enable row level security;   -- no policies: only the functions below read or change it

create or replace function public.is_approved_parent() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.parent_approvals where user_id = auth.uid());
$$;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.app_admins enable row level security;          -- no policies: only the functions below read it

create or replace function public.is_app_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

-- every account with an email (students sign in anonymously, so they are left out), waiting ones first
create or replace function public.admin_accounts()
returns table (user_id uuid, email text, signed_up timestamptz, confirmed boolean, last_sign_in timestamptz, approved_at timestamptz, is_admin boolean)
language plpgsql stable security definer set search_path = public, auth as $$
#variable_conflict use_column
begin
  if not public.is_app_admin() then raise exception 'Only an admin can see accounts.' using errcode = '42501'; end if;
  return query
    select u.id, u.email::text, u.created_at, u.email_confirmed_at is not null, u.last_sign_in_at, a.approved_at,
           exists (select 1 from public.app_admins x where x.user_id = u.id)
    from auth.users u left join public.parent_approvals a on a.user_id = u.id
    where u.email is not null and u.email <> ''
    order by (a.approved_at is null) desc, u.created_at desc;
end $$;

-- approve (true) or remove an approval (false). Removing keeps the account's classes and students; they just can't
-- be opened until the account is approved again. An admin can't remove their own approval.
create or replace function public.admin_set_approval(p_user uuid, p_approve boolean) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_app_admin() then raise exception 'Only an admin can approve accounts.' using errcode = '42501'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'No such account.'; end if;
  if p_approve then
    if not exists (select 1 from public.parent_approvals where user_id = p_user) then
      insert into public.parent_approvals (user_id, approved_at) values (p_user, now());
    end if;
  else
    if p_user = auth.uid() then raise exception 'You can''t remove your own approval.'; end if;
    delete from public.parent_approvals where user_id = p_user;
  end if;
end $$;

revoke all on function public.is_approved_parent() from public;
revoke all on function public.is_app_admin() from public;
revoke all on function public.admin_accounts() from public;
revoke all on function public.admin_set_approval(uuid, boolean) from public;
grant execute on function public.is_approved_parent() to authenticated;
grant execute on function public.is_app_admin() to authenticated;
grant execute on function public.admin_accounts() to authenticated;
grant execute on function public.admin_set_approval(uuid, boolean) to authenticated;
