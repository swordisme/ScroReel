'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEGAL } from '@/lib/legal'

const links = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refunds', label: 'Refund Policy' },
]

export default function Footer() {
  const pathname = usePathname()

  // The full-screen player and the admin studio have their own chrome
  if (pathname?.startsWith('/watch') || pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t border-gray-900 bg-black px-6 md:px-12 py-8 text-sm text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} {LEGAL.brand}. All titles are AI-generated fiction.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${LEGAL.contactEmail}`} className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
