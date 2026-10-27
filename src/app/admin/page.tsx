import { Users, Film, Coins, TrendingUp, Plus, Sparkles, Video, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { MOCK_ALL_SERIES, MOCK_CATEGORIES } from '@/lib/mock-data'

const stats = [
  { label: 'Total Series & Movies', value: String(MOCK_ALL_SERIES.length), icon: Film, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Active Categories', value: String(MOCK_CATEGORIES.length), icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Total Episodes', value: '58', icon: Video, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Paywall Conversion Rate', value: '37.1%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
]

export default function AdminDashboard() {
  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Content Studio Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your vertical drama productions, video uploads, categories, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/series"
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black rounded-xl text-sm font-bold hover:bg-yellow-300 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Title</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-gray-900/70 rounded-2xl p-6 border border-gray-800/80 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-gray-400 text-xs font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Production Pipeline Guide Box */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent rounded-2xl p-6 border border-yellow-400/20 mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" />
              Content Engine Pipeline Ready
            </h2>
            <p className="text-gray-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Your 15-episode script <strong>&quot;Forbidden Lesson&quot;</strong> is fully ready. After generating your vertical videos (9:16) with Kling AI/Runway and editing in CapCut, simply click into Series Management to paste the Cloudflare Stream or Bunny.net video links.
            </p>
          </div>
          <Link
            href="/admin/series"
            className="hidden md:flex items-center gap-1 text-xs font-bold text-yellow-400 hover:text-yellow-300 underline"
          >
            Manage Episodes <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/series"
          className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-yellow-400/40 transition-all group"
        >
          <Film className="w-6 h-6 text-yellow-400 mb-3" />
          <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
            Series & Episodes Studio
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Add new titles, edit synopses, set free vs locked episodes, and assign video streaming URLs.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-yellow-400/40 transition-all group"
        >
          <Sparkles className="w-6 h-6 text-blue-400 mb-3" />
          <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
            Category Taxonomy
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Create and order categories (Romance, Thriller, Fantasy, etc.) to showcase on the Netflix homepage.
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="p-6 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-yellow-400/40 transition-all group"
        >
          <TrendingUp className="w-6 h-6 text-green-400 mb-3" />
          <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
            Conversion Analytics
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Track user retention across episodes 1 to 5 and measure Episode 6 paywall conversions.
          </p>
        </Link>
      </div>
    </div>
  )
}
