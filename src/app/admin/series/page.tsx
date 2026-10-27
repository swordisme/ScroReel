import { Film, Plus, Edit2, Trash2, ExternalLink, Video, CheckCircle2, Lock } from 'lucide-react'
import Link from 'next/link'
import { MOCK_ALL_SERIES } from '@/lib/mock-data'

export default function AdminSeriesPage() {
  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Series & Movie Catalog</h1>
          <p className="text-gray-400 text-sm mt-1">
            {MOCK_ALL_SERIES.length} published titles across your Netflix-style library.
          </p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-sm font-bold hover:bg-yellow-300 transition-all shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add New Title</span>
        </button>
      </div>

      {/* Series List */}
      <div className="space-y-4">
        {MOCK_ALL_SERIES.map((s) => (
          <div
            key={s.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gray-900/70 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
          >
            {/* Poster & Basic Info */}
            <div className="flex items-start gap-4 min-w-0">
              <img
                src={s.thumbnail_url}
                alt={s.title}
                className="w-16 h-24 object-cover rounded-xl flex-shrink-0 border border-gray-800 shadow-sm"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-white font-bold text-base truncate">{s.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      s.content_type === 'movie'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                    }`}
                  >
                    {s.content_type}
                  </span>
                  {s.is_featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      HOMEPAGE HERO
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-xs line-clamp-1 italic mb-2">
                  &quot;{s.tagline}&quot;
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{s.genre}</span>
                  <span>•</span>
                  <span>{s.release_year}</span>
                  <span>•</span>
                  <span>{s.rating}</span>
                  <span>•</span>
                  <span className="text-gray-300 font-semibold">
                    {s.total_episodes} {s.content_type === 'movie' ? 'Part' : 'Episodes'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Episode Management */}
            <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-800">
              <Link
                href={`/series/${s.slug}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-800 rounded-xl transition-colors"
                title="Preview details"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview</span>
              </Link>

              <button
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all shadow-sm"
                title="Edit video URLs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Upload Links</span>
              </button>

              <button
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
