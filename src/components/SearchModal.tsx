'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Play } from 'lucide-react'
import Link from 'next/link'
import { MOCK_ALL_SERIES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = query.trim()
    ? MOCK_ALL_SERIES.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()) ||
          s.genre.toLowerCase().includes(query.toLowerCase()) ||
          (s.sub_genre && s.sub_genre.toLowerCase().includes(query.toLowerCase())) ||
          (s.original_language &&
            s.original_language.toLowerCase().includes(query.toLowerCase()))
      )
    : MOCK_ALL_SERIES.slice(0, 4)

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-gray-900/60">
          <Search className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-gray-800 text-xs font-semibold text-gray-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
            {query.trim() ? `Search Results (${filtered.length})` : 'Popular Searches'}
          </p>

          {filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-500 text-sm">
              {t('noContentFound')}
            </p>
          ) : (
            filtered.map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-gray-900 transition-colors group"
              >
                <img
                  src={s.thumbnail_url}
                  alt={s.title}
                  className="w-14 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-800 group-hover:border-yellow-400 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white text-sm font-bold truncate group-hover:text-yellow-400 transition-colors">
                      {s.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-300 font-semibold">
                      {s.rating}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-1 mb-1">
                    {s.description}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    {s.genre} • {s.release_year} • {s.total_episodes} Episodes
                    {s.original_language && ` • ${s.original_language}`}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black text-white transition-all flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
