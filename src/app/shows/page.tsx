'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import ContentCard from '@/components/ContentCard'
import GenresDropdown from '@/components/GenresDropdown'
import { MOCK_ALL_SERIES, FEATURED_SERIES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ShowsPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()
  const { t } = useLanguage()

  const allShows = MOCK_ALL_SERIES.filter((s) => s.content_type === 'series')

  const filteredShows = selectedGenre
    ? allShows.filter(
        (s) =>
          s.genre.toLowerCase() === selectedGenre.toLowerCase() ||
          (s.sub_genre && s.sub_genre.toLowerCase() === selectedGenre.toLowerCase())
      )
    : allShows

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header />

      {/* Sub-header with Title & Genres Mega-Dropdown */}
      <div className="pt-24 px-6 md:px-12 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {t('shows')}
          </h1>
          <GenresDropdown
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>
      </div>

      {/* When no genre is filtered, show Hero + Grid */}
      {!selectedGenre && (
        <div className="-mt-16">
          <HeroBanner series={FEATURED_SERIES} />
        </div>
      )}

      {/* Shows Catalog Grid */}
      <main className="px-6 md:px-12 py-8 pb-24 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-200">
            {selectedGenre ? `${selectedGenre} Shows` : t('trendingNow')}
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {filteredShows.length} Titles
          </span>
        </div>

        {filteredShows.length === 0 ? (
          <div className="text-center py-20 bg-gray-950/50 rounded-2xl border border-gray-900">
            <p className="text-gray-400 text-base mb-2">{t('noContentFound')}</p>
            <button
              onClick={() => setSelectedGenre(undefined)}
              className="text-yellow-400 text-xs font-semibold hover:underline"
            >
              Reset to all shows
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredShows.map((show) => (
              <ContentCard key={show.id} series={show} size="md" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
