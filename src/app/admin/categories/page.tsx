import { Sparkles, Plus, GripVertical, Trash2, Edit2 } from 'lucide-react'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

export default function AdminCategoriesPage() {
  return (
    <div className="p-8 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Categories & Genres</h1>
          <p className="text-gray-400 text-sm mt-1">
            Organize the carousels and genre tabs displayed on the Netflix-style home and browse pages.
          </p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-sm font-bold hover:bg-yellow-300 transition-all shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 bg-gray-900/70 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-gray-600 cursor-grab hover:text-gray-400" />
              <div className="w-10 h-10 rounded-xl bg-gray-800/80 flex items-center justify-center text-xl shadow-inner border border-gray-700">
                {cat.icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{cat.name}</p>
                <p className="text-gray-500 text-xs font-mono">slug: /{cat.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-lg">
                Display Order #{cat.display_order}
              </span>

              <div className="flex items-center gap-1">
                <button
                  className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
