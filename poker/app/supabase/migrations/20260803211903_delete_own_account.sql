-- Let a signed-in player actually delete their account.
--
-- Why this exists: the Settings dialog and the privacy page both promised that
-- "Delete my account and synced data" removes the account. It didn't. The app
-- deleted the `profiles` row and signed out, and the `auth.users` row lived on
-- with the email address, because a client holding only the publishable key has
-- no route to removing a user. We were keeping an address we had told people we
-- had erased.
--
-- The fix is one `security definer` function, which is the only way to give the
-- anon-key client that power without a service-role key going anywhere near a
-- public bundle.
--
-- Treat this as security-sensitive, same as the RLS policy. The properties that
-- make it safe are deliberate, and each one is load-bearing:
--
--   * **It takes no arguments.** There is no id to tamper with, so the only row
--     it can ever reach is the caller's. This is the whole design. Do not add a
--     parameter to it, ever: a `delete_own_account(uuid)` would be a function
--     that deletes anybody's account, whatever we named it.
--   * **`search_path = ''`** so nothing in the body can be shadowed by a table
--     or function planted in another schema. Every reference is qualified.
--   * **Execute is revoked from `public` and `anon`**, then granted only to
--     `authenticated`. Signed out, it is not callable at all.
--   * **The null check is belt-and-braces.** The grants should already make an
--     unauthenticated call impossible; if that ever stops being true, this
--     refuses rather than evaluating `id = null` and quietly matching nothing.
--
-- The `on delete cascade` on `profiles.user_id` takes the profile row with the
-- user, so this one call does both and the data path stays as documented.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
