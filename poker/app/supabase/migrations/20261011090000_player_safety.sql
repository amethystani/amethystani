-- Reporting and blocking at multiplayer tables (docs/multiplayer.md).
--
-- Written only by the room server (rooms/src/safety.ts) with the service role.
-- Row level security is on and there are no policies, so no client can read or
-- write either table: a report is between the reporter and us, and nobody may
-- see who has blocked them. Deleting an account takes its rows with it.

create table if not exists public.player_reports (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  reporter uuid not null references auth.users on delete cascade,
  reported uuid not null references auth.users on delete cascade,
  room_code text not null,
  reason text not null check (reason in ('abuse', 'camera', 'cheating', 'other')),
  -- Who was at the table and what was on screen are not kept: the room is
  -- deleted when it closes, and the report says only what the reporter chose.
  resolved boolean not null default false
);

alter table public.player_reports enable row level security;

create table if not exists public.player_blocks (
  blocker uuid not null references auth.users on delete cascade,
  blocked uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked)
);

alter table public.player_blocks enable row level security;
