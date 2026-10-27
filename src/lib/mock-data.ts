import type { Episode, Series, Category, CategoryWithSeries, CoinPackage } from '@/types'

// ─── 100% OPEN CORS VERIFIED STREAMING MP4 VIDEOS ────────────
const SAMPLE_STREAMING_VIDEOS = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
]

// ─── NETFLIX-STYLE GENRES LIST ────────────────────────────────
export const ALL_NETFLIX_GENRES = [
  'Action',
  'Anime',
  'Arabic',
  'Asian',
  'Billionaire',
  'British',
  'Comedies',
  'Crime',
  'Documentaries',
  'Dramas',
  'European',
  'Horror',
  'Kids',
  'Reality & Talk',
  'Romance',
  'Sci-Fi & Fantasy',
  'Teen',
  'Thriller',
  'Turkish',
  'US',
]

// ─── CATEGORIES ───────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Romance', slug: 'romance', icon: '❤️', display_order: 1 },
  { id: 'cat-2', name: 'Thriller', slug: 'thriller', icon: '🔪', display_order: 2 },
  { id: 'cat-3', name: 'Arabic', slug: 'arabic', icon: '🌙', display_order: 3 },
  { id: 'cat-4', name: 'Billionaire & CEO', slug: 'billionaire', icon: '💎', display_order: 4 },
  { id: 'cat-5', name: 'Sci-Fi & Fantasy', slug: 'fantasy', icon: '✨', display_order: 5 },
  { id: 'cat-6', name: 'Turkish Drama', slug: 'turkish', icon: '🇹🇷', display_order: 6 },
  { id: 'cat-7', name: 'Asian & K-Drama', slug: 'asian', icon: '🌸', display_order: 7 },
  { id: 'cat-8', name: 'Crime & Action', slug: 'crime', icon: '⚡', display_order: 8 },
]

// ─── SERIES & MOVIES CATALOG ──────────────────────────────────
export const MOCK_ALL_SERIES: Series[] = [
  {
    id: 'series-001',
    title: 'Forbidden Lesson',
    slug: 'forbidden-lesson',
    description:
      'A brilliant student. His breathtaking professor. A love that could destroy everything they have built.',
    tagline: 'She taught him everything. Except how to forget her.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80',
    content_type: 'series',
    genre: 'Romance',
    sub_genre: 'Teen',
    original_language: 'English',
    dubbed_languages: ['Arabic', 'French', 'Spanish'],
    release_year: 2026,
    rating: '16+',
    total_episodes: 15,
    is_featured: true,
    is_trending: true,
    top_rank: 1,
  },
  {
    id: 'series-002',
    title: "The Billionaire's Secret Bride",
    slug: 'the-billionaires-debt',
    description: 'She owes his company millions. He offers a contract: 100 days as his pretend wife.',
    tagline: 'Power. Obsession. Impossible love.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
    content_type: 'series',
    genre: 'Billionaire',
    sub_genre: 'Romance',
    original_language: 'English',
    dubbed_languages: ['Arabic', 'French'],
    release_year: 2026,
    rating: '16+',
    total_episodes: 12,
    is_featured: false,
    is_trending: true,
    top_rank: 2,
  },
  {
    id: 'series-003',
    title: 'Secret of the Medina (سر المدينة)',
    slug: 'secret-of-the-medina',
    description: 'In the ancient alleys of Casablanca, a hidden inheritance pits two estranged families against a dangerous criminal syndicate.',
    tagline: 'Some bloodlines are written in blood.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=1600&q=80',
    content_type: 'series',
    genre: 'Arabic',
    sub_genre: 'Crime',
    original_language: 'Arabic',
    dubbed_languages: ['English', 'French'],
    release_year: 2026,
    rating: '18+',
    total_episodes: 15,
    is_featured: false,
    is_trending: true,
    top_rank: 3,
  },
  {
    id: 'series-004',
    title: 'Shadow Queen',
    slug: 'shadow-queen',
    description:
      'Betrayed by her king, a powerless servant awakens a forbidden dark magic that will shake the entire kingdom.',
    tagline: 'She was their servant. Now she is their reckoning.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
    content_type: 'series',
    genre: 'Sci-Fi & Fantasy',
    sub_genre: 'Dramas',
    original_language: 'English',
    dubbed_languages: ['Arabic', 'Spanish'],
    release_year: 2026,
    rating: '13+',
    total_episodes: 20,
    is_featured: false,
    is_trending: true,
    top_rank: 4,
  },
  {
    id: 'series-005',
    title: 'Istanbul Nights (Gecenin Sırrı)',
    slug: 'istanbul-nights',
    description: 'A handsome heir to a Bosphorus shipping empire falls for a fiery undercover detective assigned to bring him down.',
    tagline: 'Lies whispered under city lights.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1600&q=80',
    content_type: 'series',
    genre: 'Turkish',
    sub_genre: 'Romance',
    original_language: 'Turkish',
    dubbed_languages: ['Arabic', 'English', 'French'],
    release_year: 2026,
    rating: '16+',
    total_episodes: 18,
    is_featured: false,
    is_trending: true,
    top_rank: 5,
  },
  {
    id: 'series-006',
    title: 'Seoul Temptation',
    slug: 'seoul-temptation',
    description: 'A high-stakes chaebol corporate feud ignites when the ruthless CEO meets an audacious designer who refuses to bow.',
    tagline: 'Ambition is deadly. Love is worse.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1600&q=80',
    content_type: 'series',
    genre: 'Asian',
    sub_genre: 'Dramas',
    original_language: 'Korean',
    dubbed_languages: ['English', 'French', 'Arabic'],
    release_year: 2026,
    rating: '16+',
    total_episodes: 16,
    is_featured: false,
    is_trending: true,
    top_rank: 6,
  },
  {
    id: 'series-007',
    title: 'The Last Witness',
    slug: 'the-last-witness',
    description:
      'She saw what she was never supposed to see. Now she has 48 hours to disappear before they find her.',
    tagline: 'Everyone she trusted is a suspect.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&q=80',
    content_type: 'series',
    genre: 'Thriller',
    sub_genre: 'Crime',
    original_language: 'English',
    dubbed_languages: ['French', 'Spanish'],
    release_year: 2026,
    rating: '18+',
    total_episodes: 10,
    is_featured: false,
    is_trending: true,
    top_rank: 7,
  },
  {
    id: 'movie-001',
    title: 'One Last Chance',
    slug: 'one-last-chance',
    description:
      'Two strangers. One stormy night in Paris. A connection neither of them asked for.',
    tagline: 'Some accidents change your life forever.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80',
    content_type: 'movie',
    genre: 'Romance',
    sub_genre: 'European',
    original_language: 'French',
    dubbed_languages: ['English', 'Arabic', 'Spanish'],
    release_year: 2026,
    rating: 'PG-13',
    total_episodes: 1,
    is_featured: false,
    is_trending: true,
    top_rank: 8,
  },
  {
    id: 'movie-002',
    title: 'Midnight in Marrakech',
    slug: 'midnight-in-marrakech',
    description: 'An international art thief gets caught in a deadly game of cat and mouse during a royal Moroccan gala.',
    tagline: 'Trust no one in the shadows.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80',
    content_type: 'movie',
    genre: 'Action',
    sub_genre: 'Arabic',
    original_language: 'Arabic',
    dubbed_languages: ['French', 'English'],
    release_year: 2026,
    rating: '16+',
    total_episodes: 1,
    is_featured: false,
    is_trending: false,
  },
  {
    id: 'movie-003',
    title: 'Echoes of Silence',
    slug: 'echoes-of-silence',
    description: 'A sound engineer uncovers an eerie hidden frequency embedded inside vintage horror broadcasts.',
    tagline: 'What you hear cannot be unheard.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80',
    banner_url:
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1600&q=80',
    content_type: 'movie',
    genre: 'Horror',
    sub_genre: 'Thriller',
    original_language: 'English',
    dubbed_languages: ['Spanish', 'French'],
    release_year: 2026,
    rating: '18+',
    total_episodes: 1,
    is_featured: false,
    is_trending: false,
  },
]

// ─── FEATURED SERIES ──────────────────────────────────────────
export const FEATURED_SERIES =
  MOCK_ALL_SERIES.find((s) => s.is_featured) || MOCK_ALL_SERIES[0]

// ─── CATEGORIES WITH SERIES ───────────────────────────────────
export const MOCK_CATEGORIES_WITH_SERIES: CategoryWithSeries[] = [
  {
    id: 'cat-trending',
    name: 'Trending Now',
    slug: 'trending',
    icon: '🔥',
    display_order: 0,
    series: MOCK_ALL_SERIES.filter((s) => s.is_trending),
  },
  {
    id: 'cat-arabic',
    name: 'Arabic Dramas (مسلسلات عربية)',
    slug: 'arabic',
    icon: '🌙',
    display_order: 1,
    series: MOCK_ALL_SERIES.filter(
      (s) => s.genre === 'Arabic' || s.original_language === 'Arabic' || s.sub_genre === 'Arabic'
    ),
  },
  {
    id: 'cat-romance',
    name: 'Romantic Obsessions',
    slug: 'romance',
    icon: '❤️',
    display_order: 2,
    series: MOCK_ALL_SERIES.filter((s) => s.genre === 'Romance' || s.sub_genre === 'Romance'),
  },
  {
    id: 'cat-billionaire',
    name: 'Billionaire & CEO Dramas',
    slug: 'billionaire',
    icon: '💎',
    display_order: 3,
    series: MOCK_ALL_SERIES.filter((s) => s.genre === 'Billionaire'),
  },
  {
    id: 'cat-turkish-asian',
    name: 'Turkish & Asian Hits',
    slug: 'international',
    icon: '✨',
    display_order: 4,
    series: MOCK_ALL_SERIES.filter((s) => s.genre === 'Turkish' || s.genre === 'Asian'),
  },
  {
    id: 'cat-thriller',
    name: 'Thrillers & Crime',
    slug: 'thriller',
    icon: '🔪',
    display_order: 5,
    series: MOCK_ALL_SERIES.filter(
      (s) => s.genre === 'Thriller' || s.genre === 'Crime' || s.sub_genre === 'Crime'
    ),
  },
]

// ─── EPISODES ─────────────────────────────────────────────────
const FORBIDDEN_LESSON_TITLES: Record<number, string> = {
  1: 'First Day',
  2: 'After Class',
  3: 'The Fiancé Arrives',
  4: 'Office Hours',
  5: 'The First Touch',
  6: 'The Engagement Party',
  7: 'The Threat',
  8: 'The Essay',
  9: "Nadia's Move",
  10: 'The Truth About Fares',
  11: 'One Night',
  12: 'Public Humiliation',
  13: 'Breaking Point',
  14: 'The Revelation',
  15: 'Season Finale',
}

export function getMockEpisodes(
  seriesId: string,
  count: number,
  freeCount = 5
): Episode[] {
  return Array.from({ length: count }, (_, i) => {
    const videoUrl =
      SAMPLE_STREAMING_VIDEOS[i % SAMPLE_STREAMING_VIDEOS.length]

    return {
      id: `${seriesId}-ep-${String(i + 1).padStart(3, '0')}`,
      series_id: seriesId,
      title:
        seriesId === 'series-001'
          ? FORBIDDEN_LESSON_TITLES[i + 1] ?? `Episode ${i + 1}`
          : `Episode ${i + 1}`,
      episode_number: i + 1,
      video_url: videoUrl,
      thumbnail_url: `https://picsum.photos/seed/${seriesId}-${i}/450/800`,
      is_free: i < freeCount,
      duration_seconds: 60 + Math.floor(Math.random() * 60),
    }
  })
}

export const MOCK_EPISODES = getMockEpisodes('series-001', 15)
export const MOCK_SERIES = MOCK_ALL_SERIES[0]

// ─── COIN PACKAGES ────────────────────────────────────────────
export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pkg-50',
    name: 'Starter Pack',
    coins: 50,
    price_usd: 4.99,
    paddle_price_id: process.env.NEXT_PUBLIC_PADDLE_PRICE_50_COINS ?? '',
  },
  {
    id: 'pkg-150',
    name: 'Popular Pack',
    coins: 150,
    price_usd: 9.99,
    paddle_price_id: process.env.NEXT_PUBLIC_PADDLE_PRICE_150_COINS ?? '',
  },
  {
    id: 'pkg-500',
    name: 'Mega Pack',
    coins: 500,
    price_usd: 24.99,
    paddle_price_id: process.env.NEXT_PUBLIC_PADDLE_PRICE_500_COINS ?? '',
  },
]

export const SUBSCRIPTION_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_PRICE_SUBSCRIPTION ?? ''
