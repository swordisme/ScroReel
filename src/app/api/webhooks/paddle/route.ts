import { NextRequest, NextResponse } from 'next/server'
import { Paddle, Environment, EventName } from '@paddle/paddle-node-sdk'
import { createServiceClient } from '@/lib/supabase/server'

// Disable Next.js body parsing so req.text() returns the raw bytes
// required for Paddle signature verification
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Paddle SDK — initialised once per cold start
// ---------------------------------------------------------------------------
const paddle = new Paddle(process.env.PADDLE_API_KEY ?? '', {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENV === 'production'
      ? Environment.production
      : Environment.sandbox,
})

// ---------------------------------------------------------------------------
// Shared helper — credit coins for a completed/paid transaction
// ---------------------------------------------------------------------------
async function creditCoins(transaction: {
  id: string
  customData: unknown
  items?: { price?: { id?: string } }[]
}): Promise<NextResponse | null> {
  const customData = transaction.customData as { user_id?: string; coins?: number } | null
  const userId = customData?.user_id
  console.log('[Paddle Webhook] userId from customData:', userId)

  if (!userId) {
    console.error('[Paddle Webhook] ✖ missing user_id in custom_data')
    return NextResponse.json({ error: 'Missing user_id in custom_data' }, { status: 400 })
  }

  // Build price->coins map at request time
  const priceCoins: Record<string, number> = {
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_50_COINS ?? 'PRICE_50']: 50,
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_100 ?? 'PRICE_100']: 100,
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_150_COINS ?? 'PRICE_150']: 150,
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_500_COINS ?? 'PRICE_500']: 500,
  }

  const priceId = transaction.items?.[0]?.price?.id ?? ''
  const coinsToCredit = customData?.coins ?? priceCoins[priceId] ?? 0
  console.log('[Paddle Webhook] priceId:', priceId, 'coinsToCredit:', coinsToCredit)

  if (coinsToCredit === 0) {
    console.log('[Paddle Webhook] unrecognised priceId / not a coin pack — checking next handlers')
    return null
  }

  let supabase: Awaited<ReturnType<typeof createServiceClient>>
  try {
    supabase = await createServiceClient()
    console.log('[Paddle Webhook] Supabase service client created')
  } catch (err) {
    console.error('[Paddle Webhook] failed to create Supabase service client:', err)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('coin_balance')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    console.error('[Paddle Webhook] profile fetch error:', JSON.stringify(profileError))
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }

  const newBalance = (currentProfile?.coin_balance ?? 0) + coinsToCredit
  console.log('[Paddle Webhook] coin_balance:', currentProfile?.coin_balance ?? 'NEW ROW', '->', newBalance)

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        coin_balance: newBalance,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  if (upsertError) {
    console.error('[Paddle Webhook] failed to upsert coin_balance:', JSON.stringify(upsertError))
    return NextResponse.json({ error: 'Failed to credit coins' }, { status: 500 })
  }

  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount: coinsToCredit,
    type: 'purchase',
    description: `Purchased ${coinsToCredit} coins via Paddle (tx: ${transaction.id})`,
  })

  console.log('[Paddle Webhook] successfully credited', coinsToCredit, 'coins to user', userId)
  return null
}

// ---------------------------------------------------------------------------
// Shared helper — handle subscription activate/update/cancel
// ---------------------------------------------------------------------------
async function handleSubscription(
  subscription: {
    id: string
    status: string
    customData?: unknown
    currentBillingPeriod?: { endsAt?: string }
  },
  isCancel = false
): Promise<void> {
  const customData = subscription.customData as { user_id?: string } | null
  const userId = customData?.user_id
  if (!userId) return

  let supabase: Awaited<ReturnType<typeof createServiceClient>>
  try {
    supabase = await createServiceClient()
  } catch (err) {
    console.error('[Paddle Webhook] DB error on subscription:', err)
    return
  }

  const isActive = !isCancel && (subscription.status === 'active' || subscription.status === 'trialing')
  const periodEnd = subscription.currentBillingPeriod?.endsAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await supabase.from('profiles').upsert(
    {
      id: userId,
      subscription_active: isActive,
      subscription_expires_at: isActive ? periodEnd : null,
      paddle_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      paddle_subscription_id: subscription.id,
      status: isActive ? 'active' : 'cancelled',
      plan_name: 'All-Access Pass',
      current_period_end: periodEnd,
    },
    { onConflict: 'paddle_subscription_id' }
  )
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/paddle
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  console.log('[Paddle Webhook] incoming request')

  let rawBody: string
  try {
    rawBody = await req.text()
  } catch (err) {
    console.error('[Paddle Webhook] failed to read raw body:', err)
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }

  const signature = req.headers.get('paddle-signature') ?? ''
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET_KEY ?? ''

  if (!signature || !webhookSecret) {
    console.error('[Paddle Webhook] missing signature or secret')
    return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 401 })
  }

  let event: any
  try {
    event = await paddle.webhooks.unmarshal(rawBody, webhookSecret, signature)
    console.log('[Paddle Webhook] verified eventType:', event?.eventType)
  } catch (err) {
    console.error('[Paddle Webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  if (!event) {
    return NextResponse.json({ error: 'Failed to unmarshal event' }, { status: 400 })
  }

  // 1. Transaction events (Coin Packs)
  if (
    event.eventType === EventName.TransactionCompleted ||
    event.eventType === EventName.TransactionPaid ||
    event.eventType === 'transaction.completed' ||
    event.eventType === 'transaction.paid'
  ) {
    const earlyResponse = await creditCoins(event.data)
    if (earlyResponse) return earlyResponse
  }

  // 2. Subscription events (All-Access Pass)
  if (
    event.eventType === EventName.SubscriptionActivated ||
    event.eventType === EventName.SubscriptionUpdated ||
    event.eventType === 'subscription.activated' ||
    event.eventType === 'subscription.updated'
  ) {
    await handleSubscription(event.data, false)
  }

  if (
    event.eventType === EventName.SubscriptionCanceled ||
    event.eventType === EventName.SubscriptionPastDue ||
    event.eventType === 'subscription.canceled' ||
    event.eventType === 'subscription.past_due'
  ) {
    await handleSubscription(event.data, true)
  }

  return NextResponse.json({ received: true })
}
