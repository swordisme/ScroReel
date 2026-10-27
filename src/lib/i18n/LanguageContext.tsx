'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, TRANSLATIONS, TranslationDict } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof TranslationDict) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => TRANSLATIONS.en[key] || key,
  isRTL: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('snackdrama_lang') as Language
    if (saved && ['en', 'ar', 'fr', 'es'].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('snackdrama_lang', lang)
    document.documentElement.lang = lang
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
    }
  }

  const isRTL = language === 'ar'

  const t = (key: keyof TranslationDict): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en
    return dict[key] || TRANSLATIONS.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
