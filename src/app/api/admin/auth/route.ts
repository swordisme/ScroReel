import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'snackdrama2026'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (password === DEFAULT_ADMIN_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Incorrect admin passcode' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ ok: true })
}
