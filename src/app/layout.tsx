import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PaddleProvider from '@/components/PaddleProvider'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnackDrama - Watch Vertical Drama Series',
  description: 'Binge short-form drama episodes. Free to start, unlock more with coins.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <PaddleProvider>
            {children}
          </PaddleProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
