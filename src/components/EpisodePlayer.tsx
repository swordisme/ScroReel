'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Volume2, VolumeX, ArrowLeft, Crown, Play, Pause, Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Episode, Series, UserProfile } from '@/types'
import PaywallModal from './PaywallModal'
import type { CoinPackage } from '@/types'
import { usePaddle } from './PaddleProvider'
import { createClient } from '@/lib/supabase/client'

interface EpisodePlayerProps {
  series: Series
  episodes: Episode[]
  user?: UserProfile | null
}

export default function EpisodePlayer({ series, episodes, user }: EpisodePlayerProps) {
  const router = useRouter()
  const [paywallEpisode, setPaywallEpisode] = useState<Episode | null>(null)
  const [muted, setMuted] = useState(true)
  const [unlockedEpisodes, setUnlockedEpisodes] = useState<Set<string>>(new Set())
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [liveCoinBalance, setLiveCoinBalance] = useState<number>(user?.coin_balance ?? 0)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(user?.subscription_active ?? false)
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({})
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const { paddle, onCheckoutComplete } = usePaddle()

  // Track analytics event helper
  const trackEvent = useCallback(
    async (eventType: string, episodeId?: string, metadata?: Record<string, unknown>) => {
      try {
        await fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: eventType,
            series_id: series.id,
            episode_id: episodeId,
            metadata,
          }),
        })
      } catch (e) {
        // fail-safe
      }
    },
    [series.id]
  )

  // Sync live auth session client-side
  useEffect(() => {
    try {
      const supabase = createClient()

      supabase.auth.getUser().then(({ data }) => {
        setAuthUser(data?.user ?? null)
      }).catch(() => {})

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthUser(session?.user ?? null)
      })

      return () => subscription?.unsubscribe?.()
    } catch {
      // Guest mode fallback
    }
  }, [])

  // Subscribe to Paddle checkout.completed
  useEffect(() => {
    const unsubscribe = onCheckoutComplete(async () => {
      await new Promise((r) => setTimeout(r, 2000))
      const supabase = createClient()
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('coin_balance, subscription_active')
        .eq('id', currentUser.id)
        .maybeSingle()
      if (profile) {
        setLiveCoinBalance(profile.coin_balance ?? 0)
        setIsSubscribed(profile.subscription_active ?? false)
      }
    })
    return unsubscribe
  }, [onCheckoutComplete])

  // Sync muted state to all video elements directly in DOM
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = muted
      }
    })
  }, [muted])

  // Auto-play active video on intersection
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    videoRefs.current.forEach((video, id) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoRefs.current.forEach((v, vid) => {
                if (vid !== id) {
                  v.pause()
                  v.currentTime = 0
                  setPausedMap((prev) => ({ ...prev, [vid]: true }))
                }
              })

              video.muted = muted
              video.play().then(() => {
                setPausedMap((prev) => ({ ...prev, [id]: false }))
              }).catch(() => {
                setPausedMap((prev) => ({ ...prev, [id]: true }))
              })

              trackEvent('episode_view', id)
            }
          })
        },
        { threshold: 0.6 }
      )
      observer.observe(video)
      observers.push(observer)
    })

    // Auto-play first video on load
    const firstEntry = Array.from(videoRefs.current.entries())[0]
    if (firstEntry && firstEntry[1]) {
      firstEntry[1].muted = muted
      firstEntry[1].play().then(() => {
        setPausedMap((prev) => ({ ...prev, [firstEntry[0]]: false }))
      }).catch(() => {
        setPausedMap((prev) => ({ ...prev, [firstEntry[0]]: true }))
      })
    }

    return () => observers.forEach((obs) => obs.disconnect())
  }, [episodes, trackEvent])

  const toggleVideoPlayback = (id: string) => {
    const video = videoRefs.current.get(id)
    if (!video) return

    video.muted = muted

    if (video.paused) {
      video.play().then(() => {
        setPausedMap((prev) => ({ ...prev, [id]: false }))
      }).catch((e) => {
        console.warn('Play interrupted:', e)
      })
    } else {
      video.pause()
      setPausedMap((prev) => ({ ...prev, [id]: true }))
    }
  }

  const handleEpisodeClick = useCallback(
    (episode: Episode) => {
      if (!isSubscribed && !episode.is_free && !unlockedEpisodes.has(episode.id)) {
        setPaywallEpisode(episode)
        trackEvent('paywall_hit', episode.id)
      }
    },
    [isSubscribed, unlockedEpisodes, trackEvent]
  )

  const handleUnlockWithCoins = useCallback(async () => {
    if (!paywallEpisode) return
    if (!authUser) {
      router.push(`/login?returnTo=/watch/${series.slug}`)
      return
    }
    if (liveCoinBalance < 10) return

    setUnlockedEpisodes((prev) => new Set([...prev, paywallEpisode.id]))
    setLiveCoinBalance((b) => b - 10)
    setPaywallEpisode(null)

    trackEvent('episode_unlock', paywallEpisode.id, { coin_cost: 10 })

    try {
      const res = await fetch('/api/episodes/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: paywallEpisode.id,
          seriesId: series.id || series.slug || '',
          coinCost: 10,
        }),
      })
      if (!res.ok) {
        setUnlockedEpisodes((prev) => {
          const next = new Set(prev)
          next.delete(paywallEpisode.id)
          return next
        })
        setLiveCoinBalance((b) => b + 10)
      } else {
        const { newBalance } = await res.json()
        if (typeof newBalance === 'number') {
          setLiveCoinBalance(newBalance)
        }
      }
    } catch (err) {
      console.error('[EpisodePlayer] unlock error:', err)
    }
  }, [paywallEpisode, authUser, liveCoinBalance, router, series.id, series.slug, trackEvent])

  const handleSubscribe = useCallback(() => {
    if (!authUser) {
      router.push(`/login?returnTo=/watch/${series.slug}`)
      return
    }
    if (!paddle) return
    paddle.Checkout.open({
      items: [
        {
          priceId:
            process.env.NEXT_PUBLIC_PADDLE_PRICE_SUBSCRIPTION ||
            process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_100 ||
            '',
          quantity: 1,
        },
      ],
      customData: { user_id: authUser.id },
    })
  }, [paddle, authUser, router, series.slug])

  const handleBuyCoins = useCallback(
    (pkg: CoinPackage) => {
      const activePriceId =
        pkg.paddle_price_id ||
        process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_100 ||
        'pri_01m10azbe4dt3qzh22p7aepjg4'

      if (!authUser) {
        router.push(`/login?returnTo=/watch/${series.slug}`)
        return
      }

      if (!paddle) return

      paddle.Checkout.open({
        items: [{ priceId: activePriceId, quantity: 1 }],
        customData: { user_id: authUser.id, coins: String(pkg.coins) },
      })
    },
    [paddle, authUser, router, series.slug]
  )

  return (
    <>
      {/* Top Overlay Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
        <Link
          href={`/series/${series.slug}`}
          className="flex items-center gap-2 text-white/90 hover:text-white bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 hover:bg-black/70 transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series</span>
        </Link>

        {isSubscribed && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs font-bold backdrop-blur-md">
            <Crown className="w-3.5 h-3.5" />
            <span>All-Access Pass Active</span>
          </span>
        )}
      </div>

      {/* Vertical Scroll Snap Container */}
      <div
        ref={containerRef}
        className="h-dvh overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
      >
        {episodes.map((episode) => {
          const isLocked =
            !isSubscribed && !episode.is_free && !unlockedEpisodes.has(episode.id)
          const isPaused = pausedMap[episode.id] ?? false
          const isLoading = loadingMap[episode.id] ?? false

          return (
            <div
              key={episode.id}
              className="relative w-full h-dvh flex items-center justify-center bg-black overflow-hidden"
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              {/* Video Player Element */}
              {episode.video_url && !isLocked ? (
                <div
                  className="relative w-full h-full cursor-pointer flex items-center justify-center bg-black"
                  onClick={() => toggleVideoPlayback(episode.id)}
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        el.muted = muted
                        el.defaultMuted = true
                        videoRefs.current.set(episode.id, el)
                      } else {
                        videoRefs.current.delete(episode.id)
                      }
                    }}
                    src={episode.video_url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    preload="auto"
                    onWaiting={() =>
                      setLoadingMap((prev) => ({ ...prev, [episode.id]: true }))
                    }
                    onPlaying={() => {
                      setLoadingMap((prev) => ({ ...prev, [episode.id]: false }))
                      setPausedMap((prev) => ({ ...prev, [episode.id]: false }))
                    }}
                    onPause={() =>
                      setPausedMap((prev) => ({ ...prev, [episode.id]: true }))
                    }
                  />

                  {/* Centered Play Overlay Icon if Paused */}
                  {isPaused && !isLoading && (
                    <div className="absolute z-20 w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl animate-in zoom-in-75 duration-150">
                      <Play className="w-9 h-9 text-yellow-400 fill-yellow-400 ml-1" />
                    </div>
                  )}

                  {/* Loading Spinner */}
                  {isLoading && (
                    <div className="absolute z-20 flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                      <span className="text-xs text-gray-300 font-medium">Loading video...</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <img
                    src={episode.thumbnail_url}
                    alt={episode.title}
                    className={`w-full h-full object-cover ${
                      isLocked ? 'blur-xl scale-110 brightness-40' : ''
                    }`}
                  />
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(episode.id, el)
                      else videoRefs.current.delete(episode.id)
                    }}
                    className="hidden"
                  />
                </>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Lock overlay for locked episodes */}
              {isLocked && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer px-6 text-center z-20"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="w-20 h-20 rounded-full bg-black/70 border-2 border-yellow-400/80 flex items-center justify-center mb-4 backdrop-blur-md shadow-2xl animate-pulse">
                    <Lock className="w-9 h-9 text-yellow-400" />
                  </div>
                  <p className="text-white font-black text-2xl mb-1">
                    Episode {episode.episode_number} Locked
                  </p>
                  <p className="text-gray-300 text-sm mb-5">
                    Tap to unlock for 10 coins or get an All-Access Pass
                  </p>
                  <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-sm rounded-xl shadow-lg hover:bg-yellow-300 transition-all">
                    Unlock Now
                  </button>
                </div>
              )}

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 pointer-events-none">
                <div className="flex items-end justify-between pointer-events-auto">
                  <div className="flex-1 mr-4">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-yellow-400/20 text-yellow-400 text-xs font-bold mb-2 border border-yellow-400/30">
                      {series.title}
                    </span>
                    <h3 className="text-white font-black text-xl md:text-2xl leading-tight">
                      {episode.episode_number}. {episode.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-1">
                      {Math.floor(episode.duration_seconds / 60)}m{' '}
                      {episode.duration_seconds % 60}s
                      {episode.is_free ? (
                        <span className="ml-2 text-green-400 font-bold">• Free</span>
                      ) : (
                        <span className="ml-2 text-yellow-400 font-semibold">• 10 Coins</span>
                      )}
                    </p>
                  </div>

                  {/* Play/mute controls */}
                  {!isLocked && (
                    <div className="flex flex-col gap-3">
                      {episode.video_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMuted((m) => !m)
                          }}
                          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 shadow-lg"
                          aria-label="Toggle mute"
                        >
                          {muted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Paywall modal */}
      {paywallEpisode && (
        <PaywallModal
          episodeNumber={paywallEpisode.episode_number}
          userCoinBalance={liveCoinBalance}
          onClose={() => setPaywallEpisode(null)}
          onUnlockWithCoins={handleUnlockWithCoins}
          onSubscribe={handleSubscribe}
          onBuyCoins={handleBuyCoins}
        />
      )}
    </>
  )
}
