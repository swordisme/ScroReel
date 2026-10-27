import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Price is set here, never by the client
const UNLOCK_COST = 10

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const episodeId: string = body.episodeId || body.episode_id || body.id

  if (!episodeId || typeof episodeId !== 'string') {
    return NextResponse.json({ error: 'Missing episodeId' }, { status: 400 })
  }

  // Service client: unlock_episode is only executable by the service role
  const serviceSupabase = await createServiceClient()

  const { data, error } = await serviceSupabase
    .rpc('unlock_episode', {
      p_user_id: user.id,
      p_episode_key: episodeId,
      p_cost: UNLOCK_COST,
    })
    .single<{ new_balance: number; already_unlocked: boolean }>()

  if (error) {
    if (error.message?.includes('insufficient_coins')) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
    }
    console.error('[unlock] unlock_episode error:', JSON.stringify(error))
    return NextResponse.json(
      { error: 'Failed to unlock episode. Has supabase/schema_v3.sql been run?' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    newBalance: data.new_balance,
    alreadyUnlocked: data.already_unlocked,
  })
}
