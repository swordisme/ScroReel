export type ContentType = 'series' | 'movie'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  display_order: number
}

export interface Series {
  id: string
  title: string
  slug: string
  description: string
  tagline: string
  thumbnail_url: string
  banner_url: string
  trailer_url?: string
  content_type: ContentType
  genre: string
  sub_genre?: string
  original_language?: string // 'Arabic', 'English', 'French', 'Korean', 'Turkish', etc.
  dubbed_languages?: string[]
  release_year: number
  rating: string
  total_episodes: number
  is_featured: boolean
  is_trending?: boolean
  top_rank?: number
  categories?: Category[]
}

export interface Episode {
  id: string
  series_id: string
  title: string
  episode_number: number
  video_url: string
  thumbnail_url: string
  is_free: boolean
  duration_seconds: number
}

export interface UserProfile {
  id: string
  email: string
  coin_balance: number
  subscription_active: boolean
  subscription_expires_at: string | null
  paddle_subscription_id?: string | null
}

export interface CoinPackage {
  id: string
  name: string
  coins: number
  price_usd: number
  paddle_price_id: string
}

export interface Subscription {
  id: string
  user_id: string
  paddle_subscription_id: string
  status: 'active' | 'cancelled' | 'past_due' | 'paused'
  plan_name: string
  current_period_end: string
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  user_id: string | null
  event_type:
    | 'episode_view'
    | 'paywall_hit'
    | 'episode_unlock'
    | 'subscription_start'
    | 'coin_purchase'
    | 'series_view'
  series_id?: string
  episode_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface CategoryWithSeries extends Category {
  series: Series[]
}
