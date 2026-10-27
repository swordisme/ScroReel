import { NextRequest, NextResponse } from 'next/server'
import { analyzeMarketTrend } from '@/lib/bot/trend-analyzer'
import { generateSeriesFromTrope } from '@/lib/bot/script-engine'
import { publishSeriesToPlatform } from '@/lib/bot/publisher'
import { getAdminIdentity } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { category, customTitle, publishDirectly = false } = body

    // 1. Analyze market trends and select high-converting trope
    const selectedTrope = analyzeMarketTrend(category)

    // 2. Generate 15-episode script, character prompts, and micro-hooks
    const generatedPackage = generateSeriesFromTrope(selectedTrope, customTitle)

    // 3. Publish to database if requested
    let publishResult = null
    if (publishDirectly) {
      publishResult = await publishSeriesToPlatform(generatedPackage)
    }

    return NextResponse.json({
      ok: true,
      trope: selectedTrope,
      series: generatedPackage,
      published: publishResult,
    })
  } catch (err: any) {
    console.error('[Bot Generator API Error]:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to execute automated generator' },
      { status: 500 }
    )
  }
}
