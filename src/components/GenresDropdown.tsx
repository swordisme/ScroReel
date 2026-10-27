'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { ALL_NETFLIX_GENRES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface GenresDropdownProps {
  selectedGenre?: string
  onSelectGenre: (genre: string | undefined) => void
}

export default function GenresDropdown({
  selectedGenre,
  onSelectGenre,
}: GenresDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Split genres into 3 columns
  const col1 = ALL_NETFLIX_GENRES.slice(0, 7)
  const col2 = ALL_NETFLIX_GENRES.slice(7, 14)
  const col3 = ALL_NETFLIX_GENRES.slice(14)

  const renderColumn = (genres: string[]) => (
    <div className="space-y-1">
      {genres.map((genre) => {
        const isSelected = selectedGenre?.toLowerCase() === genre.toLowerCase()
        return (
          <button
            key={genre}
            onClick={() => {
              onSelectGenre(isSelected ? undefined : genre)
              setIsOpen(false)
            }}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
              isSelected
                ? 'text-yellow-400 font-bold bg-white/10'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{genre}</span>
            {isSelected && <Check className="w-3 h-3 text-yellow-400" />}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-black/80 hover:bg-gray-900 border border-white/20 hover:border-white/40 text-white text-xs md:text-sm font-semibold rounded transition-all shadow-md"
      >
        <span>{selectedGenre || t('genres')}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-yellow-400' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Netflix Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-[340px] md:w-[480px] bg-black/95 border border-white/20 rounded-lg shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-800">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t('allGenres')}
            </span>
            {selectedGenre && (
              <button
                onClick={() => {
                  onSelectGenre(undefined)
                  setIsOpen(false)
                }}
                className="text-[11px] text-yellow-400 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {renderColumn(col1)}
            {renderColumn(col2)}
            {renderColumn(col3)}
          </div>
        </div>
      )}
    </div>
  )
}
