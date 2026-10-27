'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ContentCard from '@/components/ContentCard'
import { MOCK_ALL_SERIES } from '@/lib/mock-data'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const AUDIO_LANGUAGES = [
  { code: 'all', label: 'All Languages', flag: '🌐' },
  { code: 'Arabic', label: 'Arabic (العربية)', flag: '🇲🇦' },
  { code: 'English', label: 'English', flag: '🇺🇸' },
  { code: 'French', label: 'Français', flag: '🇫🇷' },
  { code: 'Turkish', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'Korean', label: '한국어 (Korean)', flag: '🇰🇷' },
]

export default function LanguagesPage() {
  const [selectedLang, setSelectedLang] = useState('all')
  const { t } = useLanguage()

  const filtered =
    selectedLang === 'all'
      ? MOCK_ALL_SERIES
      : MOCK_ALL_SERIES.filter(
          (s) =>
            s.original_language?.toLowerCase() === selectedLang.toLowerCase() ||
            s.dubbed_languages?.some(
              (d) => d.toLowerCase() === selectedLang.toLowerCase()
            )
        )

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Header />

      <main className="pt-28 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
            {t('browseByLanguages')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Discover global short-form dramas in your preferred language or with localized subtitles.
          </p>
        </div>

        {/* Language Selection Filter Pills */}
        <div className="flex flex-wrap gap-2.5 md:gap-3 mb-10">
          {AUDIO_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20 scale-105'
                    : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            )
          })}
        </div>

        {/* Results Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-200">
            {selectedLang === 'all'
              ? 'All International Dramas'
              : `${selectedLang} Content`}
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {filtered.length} Titles Found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-950/50 rounded-2xl border border-gray-900">
            <p className="text-gray-400 text-base mb-2">{t('noContentFound')}</p>
            <button
              onClick={() => setSelectedLang('all')}
              className="text-yellow-400 text-xs font-semibold hover:underline"
            >
              Reset to all languages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((s) => (
              <ContentCard key={s.id} series={s} size="md" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
