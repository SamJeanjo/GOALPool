create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sport text not null,
  status text not null default 'draft',
  starts_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  country_code text not null,
  flag_emoji text not null,
  seed int not null,
  group_name text
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  round text not null,
  position int not null,
  team_a_id uuid references public.teams(id),
  team_b_id uuid references public.teams(id),
  winner_team_id uuid references public.teams(id),
  starts_at timestamp with time zone,
  status text not null default 'open',
  score_a int,
  score_b int
);

create table if not exists public.brackets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  visibility text not null default 'public',
  share_slug text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.bracket_picks (
  id uuid primary key default gen_random_uuid(),
  bracket_id uuid not null references public.brackets(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  picked_team_id uuid not null references public.teams(id) on delete cascade,
  round text not null,
  created_at timestamp with time zone default now(),
  unique (bracket_id, match_id)
);

create table if not exists public.pools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  invite_code text unique not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.pool_members (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.pools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bracket_id uuid references public.brackets(id) on delete set null,
  created_at timestamp with time zone default now(),
  unique (pool_id, user_id)
);

create table if not exists public.scoring_rules (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  round text not null,
  points int not null,
  unique (tournament_id, round)
);

create index if not exists teams_tournament_seed_idx on public.teams(tournament_id, seed);
create index if not exists matches_tournament_round_idx on public.matches(tournament_id, round, position);
create index if not exists bracket_picks_bracket_idx on public.bracket_picks(bracket_id);
create index if not exists pool_members_pool_idx on public.pool_members(pool_id);

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.brackets enable row level security;
alter table public.bracket_picks enable row level security;
alter table public.pools enable row level security;
alter table public.pool_members enable row level security;
alter table public.scoring_rules enable row level security;

create policy "profiles are readable by authenticated users" on public.profiles
  for select to authenticated using (true);

create policy "users update their own profile" on public.profiles
  for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "published tournaments are public" on public.tournaments
  for select to anon, authenticated using (status in ('draft', 'open', 'live', 'complete'));

create policy "teams are public" on public.teams
  for select to anon, authenticated using (true);

create policy "matches are public" on public.matches
  for select to anon, authenticated using (true);

create policy "scoring rules are public" on public.scoring_rules
  for select to anon, authenticated using (true);

create policy "public brackets can be read" on public.brackets
  for select to anon, authenticated using (visibility = 'public' or user_id = auth.uid());

create policy "users create their own brackets" on public.brackets
  for insert to authenticated with check (user_id = auth.uid());

create policy "users update their own brackets" on public.brackets
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "public bracket picks can be read" on public.bracket_picks
  for select to anon, authenticated using (
    exists (
      select 1 from public.brackets
      where brackets.id = bracket_picks.bracket_id
      and (brackets.visibility = 'public' or brackets.user_id = auth.uid())
    )
  );

create policy "users manage picks for their brackets" on public.bracket_picks
  for all to authenticated using (
    exists (
      select 1 from public.brackets
      where brackets.id = bracket_picks.bracket_id
      and brackets.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.brackets
      where brackets.id = bracket_picks.bracket_id
      and brackets.user_id = auth.uid()
    )
  );

create policy "pool members can view pools" on public.pools
  for select to authenticated using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.pool_members
      where pool_members.pool_id = pools.id
      and pool_members.user_id = auth.uid()
    )
  );

create policy "authenticated users can create pools" on public.pools
  for insert to authenticated with check (owner_id = auth.uid());

create policy "pool members can view membership" on public.pool_members
  for select to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.pools
      where pools.id = pool_members.pool_id
      and pools.owner_id = auth.uid()
    )
  );

create policy "authenticated users can join pools" on public.pool_members
  for insert to authenticated with check (user_id = auth.uid());
