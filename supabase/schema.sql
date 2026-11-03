-- ===============================================================
-- ScroReel base schema
-- Safe to run more than once, and on a project that already has a
-- partial profiles table: existing rows and coin balances are kept.
-- ===============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  coin_balance integer not null default 0,
  subscription_active boolean not null default false,
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Repair a profiles table created by hand with only some of the columns.
-- email stays nullable: the Paddle webhook can create a row without one.
alter table public.profiles
  add column if not exists email text,
  add column if not exists coin_balance integer not null default 0,
  add column if not exists subscription_active boolean not null default false,
  add column if not exists subscription_expires_at timestamp with time zone,
  add column if not exists created_at timestamp with time zone default now() not null,
  add column if not exists updated_at timestamp with time zone default now() not null;

alter table public.profiles alter column email drop not null;

-- Other tables reference profiles(id), so it must be unique
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass and contype = 'p'
  ) then
    alter table public.profiles add primary key (id);
  end if;
end $$;

-- Give every existing user a profile, and fill in missing emails
insert into public.profiles (id, email)
  select id, email from auth.users
  on conflict (id) do nothing;

update public.profiles p
  set email = u.email
  from auth.users u
  where p.id = u.id and p.email is null;

-- Series table
create table if not exists public.series (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone default now() not null
);

-- Episodes table
create table if not exists public.episodes (
  id uuid default uuid_generate_v4() primary key,
  series_id uuid references public.series(id) on delete cascade not null,
  title text not null,
  episode_number integer not null,
  video_url text,
  thumbnail_url text,
  is_free boolean not null default false,
  duration_seconds integer not null default 0,
  created_at timestamp with time zone default now() not null
);

-- Coin transactions table
create table if not exists public.coin_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  type text not null check (type in ('purchase', 'spend')),
  description text,
  created_at timestamp with time zone default now() not null
);

-- Unlocked episodes table
create table if not exists public.unlocked_episodes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  episode_id uuid references public.episodes(id) on delete cascade not null,
  unlocked_at timestamp with time zone default now() not null,
  unique(user_id, episode_id)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.series enable row level security;
alter table public.episodes enable row level security;
alter table public.coin_transactions enable row level security;
alter table public.unlocked_episodes enable row level security;

-- Profiles hold coins, subscription status and emails. Remove every existing
-- policy, including hand-made ones, so only the rule below applies.
do $$
declare
  policy record;
begin
  for policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', policy.policyname);
  end loop;
end $$;

-- Profiles: users can only see their own, and only the server can change them
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

revoke insert, update, delete on public.profiles from anon, authenticated;

-- Series: anyone can view
drop policy if exists "Anyone can view series" on public.series;
create policy "Anyone can view series"
  on public.series for select
  to anon, authenticated
  using (true);

-- Episodes: anyone can view
drop policy if exists "Anyone can view episodes" on public.episodes;
create policy "Anyone can view episodes"
  on public.episodes for select
  to anon, authenticated
  using (true);

-- Coin transactions: users can only see their own
drop policy if exists "Users can view own transactions" on public.coin_transactions;
create policy "Users can view own transactions"
  on public.coin_transactions for select
  using (auth.uid() = user_id);

-- Unlocked episodes: users can only see their own
drop policy if exists "Users can view own unlocked episodes" on public.unlocked_episodes;
create policy "Users can view own unlocked episodes"
  on public.unlocked_episodes for select
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger: auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
