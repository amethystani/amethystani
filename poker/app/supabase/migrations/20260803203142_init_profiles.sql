-- Pip's sync schema. One table, one policy, one row per player.
--
-- The initial migration. Applied with `supabase db push`, never by hand in the
-- dashboard: a schema change that only exists in a dashboard is a change nobody
-- reviewed. It is idempotent, so re-running it is safe.
--
-- Why this file is short and still load-bearing: the publishable key ships in
-- the client bundle and this repo is open source, so anyone can call the API as
-- an anonymous user. Row Level Security is the only thing standing between one
-- player's row and everyone else. Treat any change here as security-sensitive.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users on delete cascade,
  -- PERSIST_VERSION of the client that wrote this row (see src/store/profile).
  -- The reader migrates forward and refuses anything from the future.
  version    int not null,
  -- The persisted profile's `state` object, exactly as localStorage holds it.
  state      jsonb not null,
  updated_at timestamptz not null default now(),
  -- Last writer, so a device can tell "another device changed this" from
  -- "I changed this". Not an identity and never read across users.
  device_id  text
);

alter table public.profiles enable row level security;

-- The whole security model. `using` covers reads and the pre-image of writes;
-- `with check` stops a user writing a row that claims to be someone else's.
drop policy if exists "own row only" on public.profiles;
create policy "own row only" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Deleting the auth user takes the row with it (the `on delete cascade` above),
-- which is the delete path for free and genuinely gone.
