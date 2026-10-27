'use client'

import Header from '@/components/Header'
import ContentCard from '@/components/ContentCard'
import { MOCK_ALL_SERIES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'
import { Play } from 'lucide-react'

export default function PopularPage() {
  const { t } = useLanguage()

  const top10Series = [...MOCK_ALL_SERIES]
    .filter((s) => s.top_rank)
    .sort((a, b) => (a.top_rank || 0) - (b.top_rank || 0))

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header />

      <main className="pt-28 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
            {t('newAndPopular')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            The most watched vertical dramas, viral episodes, and trending releases this week.
          </p>
        </div>

        {/* Top 10 Section with Giant Numbers */}
        <section className="mb-14">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🔥</span> {t('top10')}
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {top10Series.map((series, idx) => (
              <div key={series.id} className="relative flex items-end flex-shrink-0 group">
                {/* Giant Rank Number */}
                <span className="text-7xl md:text-8xl font-black text-stroke text-transparent -mr-5 md:-mr-7 select-none z-10 drop-shadow-lg leading-none"
                  style={{
                    WebkitTextStroke: '3px #52525B',
                    color: '#09090B',
                  }}
                >
                  {idx + 1}
                </span>

                {/* Series Poster Card */}
                <Link
                  href={`/series/${series.slug}`}
                  className="w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden relative z-20 border border-gray-800 group-hover:border-yellow-400 group-hover:scale-105 transition-all shadow-xl bg-gray-900"
                >
                  <img
                    src={series.thumbnail_url}
                    alt={series.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            {t('popularThisWeek')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {MOCK_ALL_SERIES.map((s) => (
              <ContentCard key={s.id} series={s} size="md" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
