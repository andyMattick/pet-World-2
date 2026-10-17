# Approving accounts (ROADMAP F4)

New teacher and parent accounts can't make a class until an admin approves them. Until then they see **Waiting for approval** with **Check again** and **Sign out**.

## How it works

- `parent_approvals` lists approved accounts. `is_approved_parent()` checks it, and every `classes` policy uses that function.
- `app_admins` lists the admins: the accounts that see **🔑 Approvals** in the teacher app's left column (with a count of accounts waiting).
- The Approvals page lists every account with an email (students sign in without one, so they are left out). Waiting accounts come first, each with **Approve**. Approved ones have **Remove** (tap twice), except admins.
- Removing an approval keeps the account's classes and students; they just can't be opened until it's approved again.
- Everything goes through `admin_accounts()` and `admin_set_approval()`, which check `is_app_admin()` in the database, so only admins can see the list or change it.
- Migration: `supabase/migrations/20261019000000_approvals.sql`. It's safe on a database that already has `parent_approvals`; existing approvals are kept.

## One-time setup: make yourself an admin

The admin list starts empty, and emails aren't kept in this public repo. After running the migration, run this once in Supabase's SQL editor with your own email:

```sql
insert into public.app_admins (user_id)
select id from auth.users where lower(email) = lower('you@example.com')
on conflict do nothing;

insert into public.parent_approvals (user_id)
select u.id from auth.users u
where lower(u.email) = lower('you@example.com')
  and not exists (select 1 from public.parent_approvals p where p.user_id = u.id);
```

Add another admin the same way with their email.

## Approving someone

1. They sign up on the teacher page and confirm their email.
2. Open **🔑 Approvals** and tap **Approve** next to them.
3. They tap **Check again** on their waiting screen.
