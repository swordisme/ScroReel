import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, series_id, episode_id, metadata } = body

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('analytics_events').insert({
      user_id: user?.id ?? null,
      event_type,
      series_id: series_id ?? null,
      episode_id: episode_id ?? null,
      metadata: metadata ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Analytics logging should be fail-safe and never block the user experience
    console.error('[Analytics Error]:', err)
    return NextResponse.json({ ok: true })
  }
}
