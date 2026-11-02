'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Coins,
  Crown,
  LogIn,
  Menu,
  X,
  ShieldAlert,
  Search,
  Globe,
  Check,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { LANGUAGE_OPTIONS, Language } from '@/lib/i18n/translations'
import SearchModal from './SearchModal'

const ADMIN_EMAILS = [
  'sword.maataoui@gmail.com',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
]
  .map((e) => e.toLowerCase().trim())
  .filter(Boolean)

interface HeaderProps {
  user?: UserProfile | null
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeUser, setActiveUser] = useState<UserProfile | null>(user ?? null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const { language, setLanguage, t, isRTL } = useLanguage()

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync live auth session client-side
  useEffect(() => {
    try {
      const supabase = createClient()

      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setActiveUser((prev) => ({
            id: data.user.id,
            email: data.user.email ?? '',
            coin_balance: prev?.coin_balance ?? 0,
            subscription_active: prev?.subscription_active ?? false,
            subscription_expires_at: prev?.subscription_expires_at ?? null,
          }))
        } else {
          setActiveUser(null)
        }
      }).catch(() => {})

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setActiveUser((prev) => ({
            id: session.user.id,
            email: session.user.email ?? '',
            coin_balance: prev?.coin_balance ?? 0,
            subscription_active: prev?.subscription_active ?? false,
            subscription_expires_at: prev?.subscription_expires_at ?? null,
          }))
        } else {
          setActiveUser(null)
        }
      })

      return () => subscription?.unsubscribe?.()
    } catch {
      // Offline fallback
    }
  }, [])

  const isAdmin =
    activeUser?.email &&
    ADMIN_EMAILS.includes(activeUser.email.toLowerCase().trim())

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/shows', label: t('shows') },
    { href: '/movies', label: t('movies') },
    { href: '/popular', label: t('newAndPopular') },
    { href: '/languages', label: t('browseByLanguages') },
  ]

  const currentLangObj =
    LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-md transition-all">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-yellow-400/40 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <img src="/icon.svg" alt="ScroReel" className="w-full h-full object-cover" />
              </div>
              <span className="text-yellow-400 font-black text-2xl tracking-tighter">
                Scro<span className="text-white">Reel</span>
              </span>
            </Link>

            {/* Desktop Netflix-Style Nav */}
            <nav className="hidden lg:flex items-center gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs md:text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-gray-300 hover:text-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search"
              title={t('search')}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Multi-Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-gray-800 border border-white/20 rounded-lg text-xs font-semibold text-gray-200 hover:text-white transition-colors"
                title={t('selectLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
                <span className="sm:hidden">{currentLangObj.flag}</span>
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute mt-2 w-36 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code as Language)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        language === opt.code
                          ? 'bg-yellow-400/20 text-yellow-400 font-bold'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </span>
                      {language === opt.code && (
                        <Check className="w-3 h-3 text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Studio Link (ONLY visible to sword.maataoui@gmail.com) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 rounded-xl text-xs font-bold hover:bg-yellow-400/20 transition-all shadow-sm"
                title="Admin Studio"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('adminStudio')}</span>
              </Link>
            )}

            {/* User Profile & Coins */}
            {activeUser ? (
              <>
                {activeUser.subscription_active ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-400/40 text-xs font-bold shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="hidden sm:inline">{t('allAccess')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-900/90 border border-gray-800 text-white text-xs font-bold shadow-inner">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{activeUser.coin_balance}</span>
                  </span>
                )}

                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {t('logout')}
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black text-xs md:text-sm font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('signIn')}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-gray-300 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <nav className="lg:hidden px-6 pb-6 pt-2 flex flex-col gap-3 bg-black/95 border-b border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-yellow-400 py-2 text-sm font-medium border-b border-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-yellow-400 py-2 text-sm font-bold flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <ShieldAlert className="w-4 h-4" />
                {t('adminStudio')}
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
