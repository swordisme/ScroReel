-- ===============================================================
-- ScroReel Schema v3 — Atomic coin unlocks
-- Run this in your Supabase SQL Editor after schema.sql and schema_v2.sql
-- Safe to run more than once
-- ===============================================================

-- 1. Let unlocks reference catalog episodes that are not (yet) rows in
--    public.episodes, e.g. mock IDs like 'series-001-ep-006'.
alter table public.unlocked_episodes
  add column if not exists episode_key text;

update public.unlocked_episodes
  set episode_key = episode_id::text
  where episode_key is null and episode_id is not null;

alter table public.unlocked_episodes
  alter column episode_id drop not null,
  alter column episode_key set not null;

create unique index if not exists unlocked_episodes_user_key
  on public.unlocked_episodes (user_id, episode_key);

-- 2. Deduct coins, record the unlock and log the spend in one transaction.
--    Re-unlocking an episode is a no-op, and concurrent calls can't
--    double-charge: the unique index rolls the second one back.
create or replace function public.unlock_episode(
  p_user_id uuid,
  p_episode_key text,
  p_cost integer
)
returns table (new_balance integer, already_unlocked boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if exists (
    select 1 from unlocked_episodes
    where user_id = p_user_id and episode_key = p_episode_key
  ) then
    select coin_balance into v_balance from profiles where id = p_user_id;
    return query select v_balance, true;
    return;
  end if;

  update profiles
    set coin_balance = coin_balance - p_cost, updated_at = now()
    where id = p_user_id and coin_balance >= p_cost
    returning coin_balance into v_balance;

  if not found then
    raise exception 'insufficient_coins' using errcode = 'P0001';
  end if;

  insert into unlocked_episodes (user_id, episode_key, episode_id)
  values (
    p_user_id,
    p_episode_key,
    (select id from episodes where id::text = p_episode_key)
  );

  insert into coin_transactions (user_id, amount, type, description)
  values (p_user_id, -p_cost, 'spend', 'Unlocked episode ' || p_episode_key);

  return query select v_balance, false;
end;
$$;

-- Only the server (service role) may call it; it trusts p_user_id.
revoke execute on function public.unlock_episode(uuid, text, integer)
  from public, anon, authenticated;
grant execute on function public.unlock_episode(uuid, text, integer)
  to service_role;

-- 3. Lock down data only the server should change. The server uses the
--    service role, which bypasses RLS, so it needs none of these policies.
--    Without this, a signed-in user could set their own coin_balance and
--    subscription_active with the public anon key.
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Service role can manage subscriptions" on public.subscriptions;

-- The view runs with its owner's rights, so it would expose analytics to anyone
revoke all on public.episode_analytics from anon, authenticated;
