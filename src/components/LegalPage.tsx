import Header from '@/components/Header'
import { LEGAL } from '@/lib/legal'

interface LegalPageProps {
  title: string
  intro?: string
  children: React.ReactNode
}

// Shared layout for Terms, Privacy, Refund and Pricing pages
export default function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-28 px-6 md:px-12 pb-24 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: {LEGAL.lastUpdated}</p>
        {intro && <p className="text-gray-300 mt-6 leading-relaxed">{intro}</p>}
        <div className="mt-8 space-y-8 text-gray-300 leading-relaxed [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_p+p]:mt-3 [&_a]:text-yellow-400 [&_a:hover]:underline">
          {children}
        </div>
      </main>
    </div>
  )
}
