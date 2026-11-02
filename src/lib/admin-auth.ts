import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const ADMIN_COOKIE = 'admin_session'

const ADMIN_EMAILS = [
  'sword.maataoui@gmail.com',
  process.env.ADMIN_EMAIL || '',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
]
  .map((e) => e.toLowerCase().trim())
  .filter(Boolean)

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

/**
 * Cookie value derived from ADMIN_PASSWORD, so the cookie can't be forged
 * without knowing the passcode and changing the passcode logs everyone out.
 * Returns null when no passcode is configured (passcode login disabled).
 */
export function adminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createHash('sha256').update(`scroreel-admin:${password}`).digest('hex')
}

export function isValidAdminPassword(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  return Boolean(expected) && typeof password === 'string' && safeEqual(password, expected!)
}

/** Returns the admin's email (or 'passcode') if authorized, otherwise null. */
export async function getAdminIdentity(): Promise<string | null> {
  const token = adminSessionToken()
  const cookieValue = (await cookies()).get(ADMIN_COOKIE)?.value
  const hasCookieSession = Boolean(token && cookieValue && safeEqual(cookieValue, token))

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) {
      return user.email
    }
  } catch {
    // Offline / fallback
  }

  return hasCookieSession ? 'passcode' : null
}
