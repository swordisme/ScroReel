'use client'

import Link from 'next/link'
import { Play, Info } from 'lucide-react'
import type { Series } from '@/types'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HeroBanner({ series }: { series: Series }) {
  const { t } = useLanguage()

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] flex items-end overflow-hidden">
      {/* Background image */}
      <img
        src={series.banner_url}
        alt={series.title}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 pb-16 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-bold text-xs tracking-widest uppercase border border-yellow-400/30">
            🔥 {t('featured')}
          </span>
          <span className="text-gray-300 text-sm font-medium">
            {series.genre} · {series.release_year} · {series.rating}
          </span>
        </div>

        <h1 className="text-white text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight drop-shadow-md">
          {series.title}
        </h1>

        <p className="text-yellow-300/90 text-base md:text-lg mb-2 font-medium italic">
          &quot;{series.tagline}&quot;
        </p>

        <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
          {series.description}
        </p>

        <div className="flex gap-4">
          <Link
            href={`/watch/${series.slug}`}
            className="flex items-center gap-2 px-7 py-3.5 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/20 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-black" />
            {t('watchFree')}
          </Link>
          <Link
            href={`/series/${series.slug}`}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:scale-105"
          >
            <Info className="w-5 h-5" />
            {t('moreInfo')}
          </Link>
        </div>
      </div>
    </div>
  )
}
