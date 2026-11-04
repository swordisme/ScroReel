-- ===============================================================
-- ScroReel Schema v4 — Exactly-once coin purchases
-- Run this in your Supabase SQL Editor after schema_v3.sql
-- Safe to run more than once
-- ===============================================================

-- 1. Remember which Paddle transaction paid for each credit
alter table public.coin_transactions
  add column if not exists paddle_transaction_id text;

create unique index if not exists coin_transactions_paddle_tx
  on public.coin_transactions (paddle_transaction_id)
  where paddle_transaction_id is not null;

-- 2. Credit coins once per transaction. Paddle sends several events for one
--    order and retries failures, so repeat calls must change nothing.
create or replace function public.credit_coins(
  p_user_id uuid,
  p_coins integer,
  p_transaction_id text
)
returns table (new_balance integer, already_credited boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_inserted integer;
begin
  -- A buyer may not have a profile row yet
  insert into profiles (id, email)
    select id, email from auth.users where id = p_user_id
    on conflict (id) do nothing;

  insert into coin_transactions (user_id, amount, type, description, paddle_transaction_id)
  values (
    p_user_id,
    p_coins,
    'purchase',
    'Purchased ' || p_coins || ' coins via Paddle',
    p_transaction_id
  )
  on conflict (paddle_transaction_id) where paddle_transaction_id is not null
  do nothing;

  get diagnostics v_inserted = row_count;

  if v_inserted = 0 then
    select coin_balance into v_balance from profiles where id = p_user_id;
    return query select v_balance, true;
    return;
  end if;

  update profiles
    set coin_balance = coin_balance + p_coins, updated_at = now()
    where id = p_user_id
    returning coin_balance into v_balance;

  return query select v_balance, false;
end;
$$;

-- Only the server (service role) may call it; it trusts p_user_id and p_coins.
revoke execute on function public.credit_coins(uuid, integer, text)
  from public, anon, authenticated;
grant execute on function public.credit_coins(uuid, integer, text)
  to service_role;
