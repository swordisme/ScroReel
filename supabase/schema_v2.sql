-- ===============================================================
-- ScroReel Schema v2 — Netflix Upgrade
-- Run this in your Supabase SQL Editor after the original schema
-- ===============================================================

-- 1. Upgrade the series table with new columns
alter table public.series
  add column if not exists tagline text,
  add column if not exists banner_url text,
  add column if not exists trailer_url text,
  add column if not exists content_type text not null default 'series'
    check (content_type in ('series', 'movie')),
  add column if not exists genre text,
  add column if not exists release_year integer,
  add column if not exists rating text,
  add column if not exists is_featured boolean not null default false;

-- 2. Categories table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  icon text default '🎬',
  display_order integer not null default 0,
  created_at timestamp with time zone default now() not null
);

-- 3. Series-to-categories junction
create table if not exists public.series_categories (
  series_id uuid references public.series(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  primary key (series_id, category_id)
);

-- 4. Subscriptions table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  paddle_subscription_id text not null unique,
  status text not null default 'active'
    check (status in ('active', 'cancelled', 'past_due', 'paused')),
  plan_name text not null default 'All-Access Weekly',
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 5. Analytics events table
create table if not exists public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null
    check (event_type in (
      'episode_view', 'paywall_hit', 'episode_unlock',
      'subscription_start', 'coin_purchase', 'series_view'
    )),
  series_id uuid references public.series(id) on delete set null,
  episode_id uuid references public.episodes(id) on delete set null,
  metadata jsonb,
  created_at timestamp with time zone default now() not null
);

-- 6. RLS for new tables
alter table public.categories enable row level security;
alter table public.series_categories enable row level security;
alter table public.subscriptions enable row level security;
alter table public.analytics_events enable row level security;

create policy "Anyone can view categories"
  on public.categories for select
  to anon, authenticated using (true);

create policy "Anyone can view series_categories"
  on public.series_categories for select
  to anon, authenticated using (true);

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (true);

create policy "Anyone can insert analytics"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "Users can view own analytics"
  on public.analytics_events for select
  using (auth.uid() = user_id);

-- 7. Upgrade profiles: add subscription_id reference  
alter table public.profiles
  add column if not exists paddle_subscription_id text;

-- 8. Seed default categories
insert into public.categories (name, slug, icon, display_order) values
  ('Romance',      'romance',   '❤️',  1),
  ('Thriller',     'thriller',  '🔪',  2),
  ('Fantasy',      'fantasy',   '✨',  3),
  ('Drama',        'drama',     '🎭',  4),
  ('Action',       'action',    '⚡',  5)
on conflict (slug) do nothing;

-- 9. Admin helper view: episode analytics with drop-off
create or replace view public.episode_analytics as
  select
    e.id,
    e.series_id,
    e.episode_number,
    e.title,
    e.is_free,
    count(ae.id) filter (where ae.event_type = 'episode_view') as view_count,
    count(ae.id) filter (where ae.event_type = 'paywall_hit') as paywall_hits,
    count(ae.id) filter (where ae.event_type = 'episode_unlock') as unlock_count
  from public.episodes e
  left join public.analytics_events ae on ae.episode_id = e.id
  group by e.id, e.series_id, e.episode_number, e.title, e.is_free
  order by e.series_id, e.episode_number;
