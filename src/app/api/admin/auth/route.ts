import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, adminSessionToken, isValidAdminPassword } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const token = adminSessionToken()

    if (!token) {
      return NextResponse.json(
        { error: 'Passcode login is disabled (ADMIN_PASSWORD not set). Sign in with your admin email.' },
        { status: 403 }
      )
    }

    if (isValidAdminPassword(password)) {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE, token, {
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
  cookieStore.delete(ADMIN_COOKIE)
  return NextResponse.json({ ok: true })
}
