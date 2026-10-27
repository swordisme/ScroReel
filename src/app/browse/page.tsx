import Header from '@/components/Header'
import ContentCard from '@/components/ContentCard'
import { MOCK_ALL_SERIES, MOCK_CATEGORIES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string }>
}) {
  const params = await searchParams
  const category = params?.category
  const type = params?.type

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

  const filtered = MOCK_ALL_SERIES.filter((s) => {
    if (type && s.content_type !== type) return false
    if (category && s.genre.toLowerCase() !== category.toLowerCase()) return false
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header user={userProfile} />

      <main className="pt-28 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Explore Library</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Discover drama series, bite-sized vertical films, and romantic thrillers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
          <Link
            href="/browse"
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all ${
              !category && !type
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20'
                : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600'
            }`}
          >
            All Content
          </Link>
          <Link
            href="/browse?type=series"
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all ${
              type === 'series'
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20'
                : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600'
            }`}
          >
            📺 Drama Series
          </Link>
          <Link
            href="/browse?type=movie"
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all ${
              type === 'movie'
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20'
                : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600'
            }`}
          >
            🎬 Short Films
          </Link>
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all ${
                category === cat.slug
                  ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20'
                  : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600'
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Content Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-gray-950/50 rounded-2xl border border-gray-900">
            <p className="text-gray-400 text-lg mb-2">No titles found in this category.</p>
            <Link
              href="/browse"
              className="text-yellow-400 text-sm font-semibold underline hover:text-yellow-300"
            >
              View all titles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((s) => (
              <ContentCard key={s.id} series={s} size="md" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
