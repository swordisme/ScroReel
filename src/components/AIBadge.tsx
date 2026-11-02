'use client'

import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// Disclosure label shown on every title: all ScroReel content is AI-generated
export default function AIBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { t } = useLanguage()

  const sizeClasses =
    size === 'md'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-1.5 py-0.5 text-[10px] gap-0.5'

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded bg-purple-600/90 backdrop-blur-sm text-white font-bold shadow`}
      title={t('aiGenerated')}
    >
      <Sparkles className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      {t('aiGenerated')}
    </span>
  )
}
