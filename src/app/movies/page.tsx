'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ContentCard from '@/components/ContentCard'
import GenresDropdown from '@/components/GenresDropdown'
import { MOCK_ALL_SERIES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Play } from 'lucide-react'
import Link from 'next/link'

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()
  const { t } = useLanguage()

  const allMovies = MOCK_ALL_SERIES.filter((s) => s.content_type === 'movie')
  const featuredMovie = allMovies[0]

  const filteredMovies = selectedGenre
    ? allMovies.filter(
        (s) =>
          s.genre.toLowerCase() === selectedGenre.toLowerCase() ||
          (s.sub_genre && s.sub_genre.toLowerCase() === selectedGenre.toLowerCase())
      )
    : allMovies

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header />

      {/* Sub-header with Title & Genres Mega-Dropdown */}
      <div className="pt-24 px-6 md:px-12 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {t('movies')}
          </h1>
          <GenresDropdown
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>
      </div>

      {/* Featured Movie Banner */}
      {!selectedGenre && featuredMovie && (
        <div className="relative h-[55vh] min-h-[380px] max-h-[550px] flex items-end overflow-hidden mt-4 mx-6 md:mx-12 rounded-3xl border border-gray-800">
          <img
            src={featuredMovie.banner_url}
            alt={featuredMovie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="relative z-10 p-6 md:p-10 max-w-xl">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider mb-2 inline-block">
              FEATURED FILM
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2">
              {featuredMovie.title}
            </h2>
            <p className="text-gray-300 text-xs md:text-sm mb-4 line-clamp-2">
              {featuredMovie.description}
            </p>
            <Link
              href={`/watch/${featuredMovie.slug}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-bold text-xs md:text-sm rounded-xl hover:bg-yellow-300 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              {t('watchFree')}
            </Link>
          </div>
        </div>
      )}

      {/* Movies Catalog Grid */}
      <main className="px-6 md:px-12 py-8 pb-24 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-200">
            {selectedGenre ? `${selectedGenre} Movies` : 'All Mini-Films'}
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {filteredMovies.length} Titles
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-gray-950/50 rounded-2xl border border-gray-900">
            <p className="text-gray-400 text-base mb-2">{t('noContentFound')}</p>
            <button
              onClick={() => setSelectedGenre(undefined)}
              className="text-yellow-400 text-xs font-semibold hover:underline"
            >
              Reset to all movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <ContentCard key={movie.id} series={movie} size="md" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
