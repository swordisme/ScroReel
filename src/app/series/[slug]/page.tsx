import Link from 'next/link'
import { Play, Sparkles, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import AIBadge from '@/components/AIBadge'
import { MOCK_ALL_SERIES, getMockEpisodes } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { Series, UserProfile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug || ''
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase().trim()
  const normalizedSlug = decodedSlug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  let series: Series | null = null

  // 1. Try finding in Supabase DB
  try {
    const supabase = await createClient()
    const { data: dbSeries } = await supabase
      .from('series')
      .select('*')
      .or(`slug.eq.${normalizedSlug},slug.eq.${rawSlug}`)
      .maybeSingle()

    if (dbSeries) {
      series = dbSeries as Series
    }
  } catch (e) {
    // Supabase query fallback
  }

  // 2. Try finding in Mock Catalog
  if (!series) {
    series =
      MOCK_ALL_SERIES.find(
        (s) =>
          s.slug === normalizedSlug ||
          s.slug === rawSlug ||
          s.title.toLowerCase() === decodedSlug.replace(/-/g, ' ')
      ) || null
  }

  // 3. Dynamic fallback for newly AI-generated titles (Never 404!)
  if (!series) {
    const readableTitle = decodedSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())

    series = {
      id: `ai-${normalizedSlug}`,
      title: readableTitle,
      slug: normalizedSlug,
      tagline: 'Power. Secrets. A passion that shook an empire.',
      description: `When the truth finally surfaced, the entire dynasty realized they picked a fight with the wrong person. Stream the full 15-episode viral drama.`,
      genre: 'Romance',
      content_type: 'series',
      release_year: 2026,
      rating: '16+',
      total_episodes: 15,
      is_featured: true,
      thumbnail_url:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      banner_url:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80',
    }
  }

  const episodes = getMockEpisodes(series.id, series.total_episodes || 15)

  // Fetch authenticated user profile from Supabase
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

      {/* Hero Banner Header */}
      <div className="relative h-[65vh] min-h-[460px] max-h-[700px] flex items-end overflow-hidden">
        <img
          src={series.banner_url || series.thumbnail_url}
          alt={series.title}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 px-6 md:px-12 pb-12 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded bg-yellow-400 text-black font-black text-xs uppercase tracking-wider">
              {series.content_type || 'SERIES'}
            </span>
            <AIBadge size="md" />
            <span className="text-gray-300 text-xs md:text-sm font-medium">
              {series.genre} · {series.release_year} · {series.rating}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-md">
            {series.title}
          </h1>

          <p className="text-yellow-300/90 text-sm md:text-base font-semibold italic mb-3">
            &quot;{series.tagline}&quot;
          </p>

          <p className="text-gray-300 text-xs md:text-sm mb-6 leading-relaxed line-clamp-3">
            {series.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/watch/${series.slug}`}
              className="flex items-center gap-2 px-7 py-3.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/20 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" />
              Watch Episode 1 Free
            </Link>

            <div className="flex items-center gap-3 text-xs text-gray-400 bg-gray-900/80 px-4 py-3 rounded-xl border border-gray-800 backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                {series.total_episodes || 15} Episodes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-green-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Ep 1-5 Free
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <main className="px-6 md:px-12 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-gray-900 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Episodes & Parts</h2>
            <p className="text-gray-400 text-xs mt-1">
              Episodes 1 to 5 are completely free. Unlock subsequent episodes with coins or an All-Access Pass.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/${series.slug}?ep=${ep.episode_number}`}
              className="group flex items-center justify-between p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-yellow-400/40 hover:bg-gray-800/60 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    ep.is_free
                      ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                      : 'bg-gray-800/80 text-gray-500 border border-gray-700'
                  }`}
                >
                  {ep.is_free ? ep.episode_number : '🔒'}
                </div>

                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate group-hover:text-yellow-400 transition-colors">
                    {ep.episode_number}. {ep.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1.5">
                    <span>
                      {Math.floor(ep.duration_seconds / 60)}m {ep.duration_seconds % 60}s
                    </span>
                    {ep.is_free ? (
                      <span className="text-green-400 font-semibold">• Free</span>
                    ) : (
                      <span className="text-yellow-400/90 font-medium">• 10 Coins</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-yellow-400 group-hover:text-black text-gray-300 transition-all flex-shrink-0">
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
