import HeroBanner from '@/components/HeroBanner'
import CategoryRow from '@/components/CategoryRow'
import Header from '@/components/Header'
import {
  FEATURED_SERIES,
  MOCK_CATEGORIES_WITH_SERIES,
} from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let userProfile: UserProfile | null = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, coin_balance, subscription_active, subscription_expires_at')
        .eq('id', user.id)
        .maybeSingle()

      userProfile = profile ?? {
        id: user.id,
        email: user.email ?? '',
        coin_balance: 0,
        subscription_active: false,
        subscription_expires_at: null,
      }
    }
  } catch {
    // Guest fallback
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header user={userProfile} />

      <main className="pb-24">
        {/* Featured Hero Banner */}
        <HeroBanner series={FEATURED_SERIES} />

        {/* Categories Carousel Rows */}
        <div className="py-6 space-y-4 -mt-10 relative z-20">
          {MOCK_CATEGORIES_WITH_SERIES.map((cat) => (
            <CategoryRow
              key={cat.id}
              title={cat.name}
              icon={cat.icon}
              series={cat.series}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
