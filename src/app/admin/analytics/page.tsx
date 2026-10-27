import { TrendingUp, Users, Coins, Eye, Lock, CheckCircle } from 'lucide-react'

const episodeStats = [
  { ep: 1, title: 'First Day', views: 2450, paywallHits: 0, unlocks: 0, free: true },
  { ep: 2, title: 'After Class', views: 2180, paywallHits: 0, unlocks: 0, free: true },
  { ep: 3, title: 'The Fiancé Arrives', views: 1950, paywallHits: 0, unlocks: 0, free: true },
  { ep: 4, title: 'Office Hours', views: 1720, paywallHits: 0, unlocks: 0, free: true },
  { ep: 5, title: 'The First Touch', views: 1540, paywallHits: 0, unlocks: 0, free: true },
  { ep: 6, title: 'The Engagement Party', views: 580, paywallHits: 960, unlocks: 580, free: false },
  { ep: 7, title: 'The Threat', views: 540, paywallHits: 40, unlocks: 540, free: false },
  { ep: 8, title: 'The Essay', views: 510, paywallHits: 30, unlocks: 510, free: false },
  { ep: 9, title: "Nadia's Move", views: 480, paywallHits: 30, unlocks: 480, free: false },
  { ep: 10, title: 'The Truth About Fares', views: 460, paywallHits: 20, unlocks: 460, free: false },
]

export default function AdminAnalyticsPage() {
  const ep5Views = 1540
  const ep6Unlocks = 580
  const conversionRate = ((ep6Unlocks / ep5Views) * 100).toFixed(1)

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Conversion & Audience Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor your TikTok/Meta ad traffic funnel, viewer retention, and monetization drop-off.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-gray-900/70 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Ep 5 ➔ Ep 6 Conversion
          </p>
          <p className="text-3xl font-black text-green-400">{conversionRate}%</p>
          <p className="text-gray-500 text-xs mt-1">Industry standard: 25-35%</p>
        </div>

        <div className="bg-gray-900/70 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Total Ep 5 Finishers
          </p>
          <p className="text-3xl font-black text-white">{ep5Views.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">Warm conversion leads</p>
        </div>

        <div className="bg-gray-900/70 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Paywall Impressions
          </p>
          <p className="text-3xl font-black text-yellow-400">960</p>
          <p className="text-gray-500 text-xs mt-1">Modal triggered at Ep 6</p>
        </div>

        <div className="bg-gray-900/70 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Coin Unlocks & Passes
          </p>
          <p className="text-3xl font-black text-purple-400">3,110</p>
          <p className="text-gray-500 text-xs mt-1">Total paid episode views</p>
        </div>
      </div>

      {/* Episode Performance Breakdown Table */}
      <div className="bg-gray-900/70 rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Episode Performance Funnel — Forbidden Lesson
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Retention rate from free teaser episodes to locked coin episodes
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-bold rounded-lg border border-yellow-400/20">
            Season 1 Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/40 text-gray-400 text-xs uppercase font-semibold">
                <th className="px-6 py-3.5">Episode</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Views</th>
                <th className="px-6 py-3.5 text-right">Paywall Hits</th>
                <th className="px-6 py-3.5 text-right">Unlocks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {episodeStats.map((ep) => (
                <tr key={ep.ep} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Episode {ep.ep}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{ep.title}</td>
                  <td className="px-6 py-4 text-center">
                    {ep.free ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        10 COINS
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">
                    {ep.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {ep.paywallHits > 0 ? (
                      <span className="text-yellow-400">{ep.paywallHits}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    {ep.unlocks > 0 ? (
                      <span className="text-purple-400">{ep.unlocks}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
