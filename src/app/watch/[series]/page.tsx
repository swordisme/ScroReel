import { MOCK_ALL_SERIES, MOCK_SERIES, getMockEpisodes } from '@/lib/mock-data'
import EpisodePlayer from '@/components/EpisodePlayer'
import { createClient } from '@/lib/supabase/server'
import type { Series, UserProfile } from '@/types'

// Never serve a cached version — always read fresh session cookies
export const dynamic = 'force-dynamic'

interface WatchPageProps {
  params: Promise<{ series: string }>
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { series: rawSlug } = await params
  const decodedSlug = decodeURIComponent(rawSlug || '').toLowerCase().trim()
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
    // fallback
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

  // 3. Dynamic fallback for newly AI-generated titles
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
      userProfile = profile ?? null
    }
  } catch {
    // No session — continue as guest
  }

  return (
    <div className="bg-black min-h-screen">
      <EpisodePlayer series={series} episodes={episodes} user={userProfile} />
    </div>
  )
}

export async function generateMetadata({ params }: WatchPageProps) {
  const { series: rawSlug } = await params
  const decodedSlug = decodeURIComponent(rawSlug || '').replace(/-/g, ' ')
  return {
    title: `Watch ${decodedSlug} | SnackDrama`,
    description: `Stream 15 episodes of short-form vertical drama on SnackDrama.`,
  }
}
