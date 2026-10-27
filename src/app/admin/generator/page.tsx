'use client'

import { useState } from 'react'
import {
  Sparkles,
  Bot,
  Flame,
  Zap,
  CheckCircle,
  Film,
  UserCheck,
  Video,
  Copy,
  UploadCloud,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export default function AIGeneratorStudioPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('Romance')
  const [customTitle, setCustomTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [generatedData, setGeneratedData] = useState<any>(null)
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  const handleGenerate = async (autoPublish = false) => {
    setLoading(true)
    setPublishSuccess(null)
    try {
      const res = await fetch('/api/admin/bot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedGenre,
          customTitle: customTitle || undefined,
          publishDirectly: autoPublish,
        }),
      })

      const data = await res.json()
      if (data?.ok) {
        setGeneratedData(data)
        if (data.published?.message) {
          setPublishSuccess(data.published.message)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrompts = () => {
    if (!generatedData) return
    const text = JSON.stringify(generatedData.series, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            Autonomous AI Content Bot
          </span>
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Viral Radar Active
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Trend Scout & AI Production Studio
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-3xl">
          The bot analyzes viral TikTok and ReelShort tropes, writes complete 15-episode scripts, engineers Midjourney/FLUX prompts, and publishes directly to your platform.
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-gray-900/80 rounded-2xl p-6 border border-gray-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Configure AI Generation Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
              Select Target Audience / Trope Genre
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Romance', 'Drama', 'Thriller', 'Fantasy'].map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedGenre === genre
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20'
                      : 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {genre === 'Romance' && '👑 Billionaire / Love'}
                  {genre === 'Drama' && '🎓 Forbidden / Tension'}
                  {genre === 'Thriller' && '🩸 Mafia / Hostage'}
                  {genre === 'Fantasy' && '🐺 Werewolf / Queen'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              Custom Working Title (Optional — Leave blank for auto-generation)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g., The Trillionaire's Secret Bride"
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleGenerate(false)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{loading ? 'Analyzing Market & Writing...' : 'Scout Trend & Generate 15-Ep Script'}</span>
            </button>

            <button
              onClick={() => handleGenerate(true)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Generate & Auto-Publish Live</span>
            </button>
          </div>
        </div>

        {/* Live Market Insights Widget */}
        <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              Live Market Intelligence
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
                <p className="font-semibold text-white">#1 Top Grossing Hook:</p>
                <p className="text-gray-400 mt-0.5">
                  Episode 1 disrespect ➔ Episode 5 billionaire reveal converts at 38.4%.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
                <p className="font-semibold text-white">Optimal Episode Length:</p>
                <p className="text-gray-400 mt-0.5">60 to 90 seconds (150–200 spoken words).</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-[11px] text-green-400 font-medium">
            ✅ AI Script Engine Ready (FLUX.1 + ElevenLabs + Supabase)
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {publishSuccess && (
        <div className="mb-8 p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>{publishSuccess}</span>
          </div>
          {generatedData?.series?.slug && (
            <Link
              href={`/series/${encodeURIComponent(generatedData.series.slug)}`}
              className="px-3.5 py-1.5 bg-green-400 text-black font-bold text-xs rounded-lg hover:bg-green-300 transition-colors shadow-sm"
            >
              View on Website ➔
            </Link>
          )}
        </div>
      )}

      {/* Generation Results Preview */}
      {generatedData?.series && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Series Overview Card */}
          <div className="bg-gray-900/90 rounded-2xl p-6 md:p-8 border border-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-black mb-2 inline-block">
                  {generatedData.series.genre} · {generatedData.series.rating}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {generatedData.series.title}
                </h2>
                <p className="text-yellow-300 text-sm italic font-medium mt-1">
                  &quot;{generatedData.series.tagline}&quot;
                </p>
                <p className="text-gray-300 text-xs md:text-sm mt-3 max-w-3xl leading-relaxed">
                  {generatedData.series.description}
                </p>
              </div>

              <button
                onClick={handleCopyPrompts}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold border border-gray-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Full Script JSON!' : 'Copy Script & Prompts'}</span>
              </button>
            </div>

            {/* Character Concept Stills & Voice Models */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                Character Archetypes & Generation Prompts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedData.series.characterPrompts.map((char: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-950/80 border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-bold text-sm">{char.name}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {char.role}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-mono mb-2 line-clamp-2">
                      {char.prompt}
                    </p>
                    <p className="text-[11px] text-yellow-400 font-medium">
                      🎙️ Voice: {char.voiceModel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Episode Breakdown Table */}
          <div className="bg-gray-900/90 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-yellow-400" />
                  Generated 15-Episode Production Queue
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Includes scene setups, camera movement cues, and micro-hooks.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-800/60">
              {generatedData.series.episodes.map((ep: any) => (
                <div key={ep.episodeNumber} className="p-5 hover:bg-gray-800/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          ep.isFree
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {ep.episodeNumber}
                      </span>
                      <p className="text-white font-bold text-sm">{ep.title}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{ep.durationSeconds}s</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ep.isFree
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}
                      >
                        {ep.isFree ? 'FREE EPISODE' : 'LOCKED (10 COINS)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs mb-1.5">
                    <strong>Visual:</strong> {ep.imagePrompt}
                  </p>
                  <p className="text-yellow-400/90 text-xs font-medium">
                    ⚡ {ep.cliffhanger}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
